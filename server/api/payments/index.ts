import { defineEventHandler, createError } from 'h3';
import { eq, desc, sql } from 'drizzle-orm';

import { PaginationParamsSchema } from '@/shared/dtos';
import { payments } from '#server/db/entities';
import { db } from '#server/db/database';
import {
  assertAuth,
  getValidatedQuery,
} from '#server/utils/validation';

export default defineEventHandler(async (event) => {
  assertAuth(event);

  const { page, limit } = await getValidatedQuery(
    PaginationParamsSchema(),
    event,
  );

  try {
    // Parse pagination parameters
    const offset = (page - 1) * limit;

    // Get paginated payments with Bitcoin address info
    const paymentItems = await db
      .select()
      .from(payments)
      .where(eq(payments.userId, event.user!.id))
      .orderBy(desc(payments.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination metadata
    const totalCount = await db
      .select({ count: sql<number>`count(${payments.id})` })
      .from(payments)
      .where(eq(payments.userId, event.user!.id));

    const totalPayments = Number(totalCount[0].count);
    const totalPages = Math.ceil(totalPayments / limit);

    return {
      payments: paymentItems,

      pagination: {
        page,
        limit,
        totalPayments,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
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
