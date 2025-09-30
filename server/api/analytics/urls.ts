import {
  defineEventHandler,
  createError,
  getQuery,
} from 'h3';
import { eq, sql, desc } from 'drizzle-orm';

import { PaginationParamsSchema } from '#shared/dtos';
import {
  assertAuth,
  getValidatedQuery,
} from '#server/utils/validation';
import { createPaginationMetadata } from '#server/utils/pagination';

import { db } from '../../db/database';
import {
  shortenedUrls,
  type ShortenedUrl,
} from '../../db/schema';

export default defineEventHandler(async (event) => {
  const { page, limit } = await getValidatedQuery(
    PaginationParamsSchema,
    event,
  );

  assertAuth(event);

  try {
    // Parse pagination parameters
    const offset = (page - 1) * limit;

    // Get paginated URLs with click data
    const urls = (await db
      .select({
        id: shortenedUrls.id,
        code: shortenedUrls.code,
        isCustom: shortenedUrls.isCustom,
        longUrl: shortenedUrls.longUrl,
        ...(event.context.user!.isPremium && {
          clicks: shortenedUrls.clicks,
        }),
        createdAt: shortenedUrls.createdAt,
      })
      .from(shortenedUrls)
      .where(
        eq(shortenedUrls.userId, event.context.user!.id),
      )
      .orderBy(desc(shortenedUrls.createdAt))
      .offset(offset)
      .limit(limit)) as Array<
      Pick<
        ShortenedUrl,
        'id' | 'code' | 'isCustom' | 'longUrl' | 'createdAt'
      > & {
        clicks?: number;
      }
    >;

    // Get total count for pagination metadata
    const [{ totalCount = 0 } = {}] = await db
      .select({
        totalCount: sql<number>`count(${shortenedUrls.id})::integer`,
      })
      .from(shortenedUrls)
      .where(
        eq(shortenedUrls.userId, event.context.user!.id),
      );

    const pagination = createPaginationMetadata({
      totalCount,
      page,
      limit,
    });

    return {
      urls,
      pagination,
    };
  } catch (error: any) {
    if (error.statusCode) throw error;

    console.error('URLs fetch failed:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch URLs',
    });
  }
});
