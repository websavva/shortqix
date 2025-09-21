import { defineEventHandler, createError } from 'h3';
import { eq, desc, sql } from 'drizzle-orm';

import { PaginationParamsSchema } from '#shared/dtos';
import { payments } from '#server/db/entities';
import { createPaginationMetadata } from '#server/utils/pagination';
import { db } from '#server/db/database';
import {
  assertAuth,
  getValidatedQuery,
} from '#server/utils/validation';

export default defineEventHandler(async (event) => {
  assertAuth(event);

  const { page, limit } = await getValidatedQuery(
    PaginationParamsSchema,
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
    const [{ totalCount }] = await db
      .select({
        totalCount: sql<number>`count(${payments.id})`,
      })
      .from(payments)
      .where(eq(payments.userId, event.user!.id));

    return {
      payments: paymentItems,

      pagination: createPaginationMetadata({
        totalCount,
        page,
        limit,
      }),
    };
  } catch (error: any) {
    console.error('Payments fetch error:', error);

    throw createError({
      statusCode: 500,
      message: 'Failed to fetch payments',
    });
  }
});
