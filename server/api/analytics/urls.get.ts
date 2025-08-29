import {
  defineEventHandler,
  getCookie,
  getQuery,
  createError,
} from 'h3';
import { eq, and, sql, desc } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

import { assertAuth } from '~/server/utils/validation';

import { db } from '../../db/database';
import { users, shortenedUrls } from '../../db/schema';

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth-token');
  const { page = '1', limit = '20' } = getQuery(event);

  assertAuth(event);

  try {
    // Parse pagination parameters
    const pageNum = Math.max(
      1,
      parseInt(page as string) || 1,
    );
    const limitNum = Math.min(
      100,
      Math.max(1, parseInt(limit as string) || 20),
    );
    const offset = (pageNum - 1) * limitNum;

    // Get paginated URLs with click data
    const urls = await db
      .select({
        id: shortenedUrls.id,
        code: shortenedUrls.code,
        customSlug: shortenedUrls.customSlug,
        longUrl: shortenedUrls.longUrl,
        clicks: shortenedUrls.clicks,
        createdAt: shortenedUrls.createdAt,
        userId: shortenedUrls.userId,
      })
      .from(shortenedUrls)
      .where(eq(shortenedUrls.userId, event.user!.id))
      .orderBy(desc(shortenedUrls.createdAt))
      .offset(offset)
      .limit(limitNum);

    // Get total count for pagination metadata
    const totalCount = await db
      .select({
        count: sql<number>`count(${shortenedUrls.id})`,
      })
      .from(shortenedUrls)
      .where(eq(shortenedUrls.userId, event.user!.id));

    const totalUrls = Number(totalCount[0].count);
    const totalPages = Math.ceil(totalUrls / limitNum);

    return {
      urls,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalUrls,
        totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1,
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
