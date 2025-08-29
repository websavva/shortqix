import {
  defineEventHandler,
  getCookie,
  createError,
} from 'h3';
import { db } from '../../db/database';
import { users, shortenedUrls } from '../../db/schema';
import { eq, and, sql } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth-token');

  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'Authentication required',
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.AUTH_SECRET!,
    ) as any;

    // Check premium status
    const user = await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.id, decoded.id),
          eq(users.isPremium, true),
          sql`${
            users.premiumExpiresAt
          } > ${new Date().toISOString()}`,
        ),
      )
      .limit(1);

    if (!user[0]) {
      throw createError({
        statusCode: 403,
        message:
          'Analytics require active premium subscription',
      });
    }

    // Get aggregated stats using SQL aggregation
    const [{ totalUrls, totalClicks, averageClicks }] =
      await db
        .select({
          totalUrls: sql<number>`count(${shortenedUrls.id})`,
          totalClicks: sql<number>`coalesce(sum(${shortenedUrls.clicks}), 0)`,
          averageClicks: sql<number>`coalesce(avg(${shortenedUrls.clicks}), 0)`,
        })
        .from(shortenedUrls)
        .where(eq(shortenedUrls.userId, decoded.id));

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
