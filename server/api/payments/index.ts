import {
  defineEventHandler,
  getQuery,
  createError,
} from 'h3';
import { eq, and, desc, sql } from 'drizzle-orm';

import {
  payments,
  bitcoinAddresses,
} from '~/server/db/entities';
import { db } from '~/server/db/database';
import { assertAuth } from '~/server/utils/validation';

export default defineEventHandler(async (event) => {
  assertAuth(event);

  const { page = '1', limit = '20' } = getQuery(event);

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

    // Get paginated payments with Bitcoin address info
    const paymentItems = await db
      .select({
        payment: payments,
        bitcoinAddress: bitcoinAddresses,
      })
      .from(payments)
      .innerJoin(
        bitcoinAddresses,
        eq(
          payments.bitcoinAddress,
          bitcoinAddresses.address,
        ),
      )
      .where(eq(payments.userId, event.user!.id))
      .orderBy(desc(payments.createdAt))
      .limit(limitNum)
      .offset(offset);

    // Get total count for pagination metadata
    const totalCount = await db
      .select({ count: sql<number>`count(${payments.id})` })
      .from(payments)
      .where(eq(payments.userId, event.user!.id));

    const totalPayments = Number(totalCount[0].count);
    const totalPages = Math.ceil(totalPayments / limitNum);

    return {
      payments: paymentItems,

      pagination: {
        page: pageNum,
        limit: limitNum,
        totalPayments,
        totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1,
      },
    };
  } catch (error: any) {
    console.error('Payments fetch error:', error);

    throw createError({
      statusCode: 500,
      message: 'Failed to fetch payments',
    });
  }
});
