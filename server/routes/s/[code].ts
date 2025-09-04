import {
  defineEventHandler,
  getRouterParam,
  createError,
  sendRedirect,
} from 'h3';
import { eq, sql } from 'drizzle-orm';

import { db } from '../../db';
import { shortenedUrls } from '../../db/schema';

export default defineEventHandler(async (event) => {
  const code = getRouterParam(event, 'code');

  if (!code) {
    throw createError({
      statusCode: 400,
      message: 'Code parameter is required',
    });
  }

  try {
    // Find URL
    const [shortenedUrl] = await db
      .select()
      .from(shortenedUrls)
      .where(eq(shortenedUrls.code, code))
      .limit(1);

    if (!shortenedUrl) {
      throw createError({
        statusCode: 404,
        message: 'URL not found',
      });
    }

    // Update click count
    await await db
      .update(shortenedUrls)
      .set({ clicks: sql`${shortenedUrls.clicks} + 1` })
      .where(eq(shortenedUrls.id, shortenedUrl.id))
      .returning();

    return sendRedirect(event, shortenedUrl.longUrl);
  } catch (error: any) {
    if (error.statusCode === 404) throw error;

    console.error('Failed to process redirect:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to process redirect',
    });
  }
});
