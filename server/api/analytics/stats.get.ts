import { defineEventHandler, createError } from 'h3';
import { db } from '../../db/database';
import { shortenedUrls } from '../../db/schema';
import { eq, sql } from 'drizzle-orm';

import { assertAuth } from '~/server/utils/validation';
import { assertPremium } from '~/server/utils/validation';

export default defineEventHandler(async (event) => {
  assertAuth(event);
  assertPremium(
    event,
    'Analytics require active premium subscription',
  );

  try {
    // Get aggregated stats using SQL aggregation
    const [{ totalUrls, totalClicks, averageClicks }] =
      await db
        .select({
          totalUrls: sql<number>`count(${shortenedUrls.id})`,
          totalClicks: sql<number>`coalesce(sum(${shortenedUrls.clicks}), 0)`,
          averageClicks: sql<number>`coalesce(round(avg(${shortenedUrls.clicks}), 2), 0)`,
        })
        .from(shortenedUrls)
        .where(eq(shortenedUrls.userId, event.user!.id));

    return {
      totalUrls,
      totalClicks,
      averageClicks,
    };
  } catch (error: any) {
    if (error.statusCode) throw error;

    console.error('Stats fetch failed:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch stats',
    });
  }
});
