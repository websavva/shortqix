import { defineEventHandler, createError } from 'h3';
import { eq, sql, desc } from 'drizzle-orm';

import { PaginationParamsSchema } from '#shared/dtos';
import {
  assertAuth,
  getValidatedQuery,
} from '#server/utils/validation';

import { db } from '../../db/database';
import { shortenedUrls } from '../../db/schema';


export default defineEventHandler(async (event) => {
  const { page, limit } = await getValidatedQuery(
    PaginationParamsSchema(),
    event,
  );

  assertAuth(event);

  try {
    // Parse pagination parameters
    const offset = (page - 1) * limit;

    // Get paginated URLs with click data
    const urls = await db
      .select({
        id: shortenedUrls.id,
        code: shortenedUrls.code,
        isCustom: shortenedUrls.isCustom,
        longUrl: shortenedUrls.longUrl,
        clicks: shortenedUrls.clicks,
        createdAt: shortenedUrls.createdAt,
        userId: shortenedUrls.userId,
      })
      .from(shortenedUrls)
      .where(eq(shortenedUrls.userId, event.user!.id))
      .orderBy(desc(shortenedUrls.createdAt))
      .offset(offset)
      .limit(limit);

    // Get total count for pagination metadata
    const totalCount = await db
      .select({
        count: sql<number>`count(${shortenedUrls.id})`,
      })
      .from(shortenedUrls)
      .where(eq(shortenedUrls.userId, event.user!.id));

    const totalUrls = Number(totalCount[0].count);
    const totalPages = Math.ceil(totalUrls / limit);

    return {
      urls,
      pagination: {
        page,
        totalUrls,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
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
