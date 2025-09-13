import { nanoid } from 'nanoid';
import { defineEventHandler, createError } from 'h3';
import { eq } from 'drizzle-orm';

import { db } from '../db/database';
import { shortenedUrls } from '../db/schema';
import {
  assertAuth,
  assertPremium, readValidatedBody 
} from '../utils/validation';
import { createShortUrl } from '../../shared/utils/create-short-url';
import { CreateShortenedUrlDtoSchema } from '../../shared/dtos';

export default defineEventHandler(async (event) => {
  const { url, code: customCode } = await readValidatedBody(
    CreateShortenedUrlDtoSchema,
    event,
  );

  try {
    let code: string;

    if (customCode) {
      assertAuth(event);
      assertPremium(
        event,
        'Custom codes require active premium subscription',
      );

      // Check if custom slug is available
      const [existingShortenedUrl] = await db
        .select()
        .from(shortenedUrls)
        .where(eq(shortenedUrls.code, customCode))
        .limit(1);

      if (existingShortenedUrl) {
        throw createError({
          statusCode: 409,
          message: 'Custom slug already taken',
        });
      }

      code = customCode;
    } else {
      code = nanoid(6);
    }

    await db
      .insert(shortenedUrls)
      .values({
        code,
        longUrl: url,
        isCustom: Boolean(customCode),
        userId: event.user?.id,
      })
      .returning();

    return {
      shortUrl: createShortUrl(code),
      code,
    };
  } catch (error: any) {
    if (error.statusCode) throw error;

    console.error('Failed to create shortened URL:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to create shortened URL',
    });
  }
});
