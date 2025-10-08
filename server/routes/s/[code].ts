import {
  getRouterParam,
  createError,
  sendRedirect,
} from 'h3';
import { eq, sql } from 'drizzle-orm';

import { db, shortenedUrls } from '#server/db';
import { defineSafeEventHandler } from '#server/utils';

export default defineSafeEventHandler(
  async (event) => {
    const code = getRouterParam(event, 'code');

    if (!code) {
      throw createError({
        statusCode: 400,
        message: 'Code parameter is required',
      });
    }

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
  },
  {
    errorText: 'Failed to process redirect',
  },
);
