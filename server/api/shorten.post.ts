import { nanoid } from 'nanoid';
import { createError, getRequestIP } from 'h3';
import { eq, and, sql, gte, lte } from 'drizzle-orm';

import { shortenedUrls, db } from '#server/db';
import {
  assertAuth,
  assertPremium,
  defineSafeEventHandler,
  readValidatedBody,
} from '#server/utils';
import { createShortUrl } from '#shared/utils/create-short-url';
import { CreateShortenedUrlDtoSchema } from '#shared/dtos';

export default defineSafeEventHandler(
  async (event) => {
    const { url, code: customCode } =
      await readValidatedBody(
        CreateShortenedUrlDtoSchema,
        event,
      );

    let code: string;

    if (customCode) {
      assertAuth(event);
      assertPremium(
        event,
        'Custom codes require active premium subscription',
      );

      // Check if custom code is available
      const [existingShortenedUrl] = await db
        .select()
        .from(shortenedUrls)
        .where(eq(shortenedUrls.code, customCode))
        .limit(1);

      if (existingShortenedUrl) {
        throw createError({
          statusCode: 409,
          message: 'Custom code already taken',
        });
      }

      code = customCode;
    } else {
      code = nanoid(6);
    }

    const { user, sessionId } = event.context;

    const ipAddress = getRequestIP(event, {
      xForwardedFor: true,
    })!;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [{ count: todayShortenedUrlsCount = 0 } = {}] =
      await db
        .select({
          count: sql<number>`count(${shortenedUrls.id})::integer`,
        })
        .from(shortenedUrls)
        .where(
          and(
            user
              ? eq(shortenedUrls.userId, user.id)
              : eq(shortenedUrls.ipAddress, ipAddress),
            gte(shortenedUrls.createdAt, todayStart),
            lte(shortenedUrls.createdAt, todayEnd),
          ),
        );

    const maxTodayShortenedUrlsCount = +(user?.isPremium
      ? process.env.SQX_PREMIUM_SHORT_URLS_MAX_COUNT!
      : process.env.SQX_NON_PREMIUM_SHORT_URLS_MAX_COUNT!);

    if (
      todayShortenedUrlsCount >= maxTodayShortenedUrlsCount
    ) {
      throw createError({
        statusCode: 400,
        message:
          'You have reached the maximum number of shortened URLs for today. Please upgrade to a premium plan to increase your limit.',
      });
    }

    await db
      .insert(shortenedUrls)
      .values({
        code,
        longUrl: url,
        isCustom: Boolean(customCode),
        userId: user?.id,
        ipAddress,
        sessionId: sessionId!,
      })
      .returning();

    return {
      shortUrl: createShortUrl(code),
      code,
    };
  },
  {
    errorText: 'Failed to create shortened URL',
  },
);
