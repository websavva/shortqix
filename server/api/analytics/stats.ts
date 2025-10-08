import { eq, sql } from 'drizzle-orm';

import {
  assertAuth,
  assertPremium,
  defineSafeEventHandler,
} from '#server/utils';
import { db, shortenedUrls } from '#server/db';

export default defineSafeEventHandler(
  async (event) => {
    assertAuth(event);

    assertPremium(
      event,
      'Analytics require active premium subscription',
    );

    // Get aggregated stats using SQL aggregation
    const [
      {
        totalUrls = 0,
        totalClicks = 0,
        averageClicks = 0,
      } = {},
    ] = await db
      .select({
        totalUrls: sql<number>`count(${shortenedUrls.id})::integer`,
        totalClicks: sql<number>`coalesce(sum(${shortenedUrls.clicks}), 0)::integer`,
        averageClicks: sql<number>`coalesce(round(avg(${shortenedUrls.clicks}), 2), 0)::float`,
      })
      .from(shortenedUrls)
      .where(
        eq(shortenedUrls.userId, event.context.user!.id),
      );

    return {
      totalUrls,
      totalClicks,
      averageClicks,
    } as {
      totalUrls: number;
      totalClicks: number;
      averageClicks: number;
    };
  },
  {
    errorText: 'Failed to fetch stats',
  },
);
