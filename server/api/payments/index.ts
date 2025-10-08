import { eq, desc, sql } from 'drizzle-orm';

import { PaginationParamsSchema } from '#shared/dtos';
import { payments, db } from '#server/db';
import {
  createPaginationMetadata,
  defineSafeEventHandler,
  getValidatedQuery,
  assertAuth,
} from '#server/utils';

export default defineSafeEventHandler(
  async (event) => {
    assertAuth(event);

    const { page, limit } = await getValidatedQuery(
      PaginationParamsSchema,
      event,
    );

    // Parse pagination parameters
    const offset = (page - 1) * limit;

    // Get paginated payments with Bitcoin address info
    const paymentItems = await db
      .select()
      .from(payments)
      .where(eq(payments.userId, event.context.user!.id))
      .orderBy(desc(payments.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination metadata
    const [{ totalCount = 0 } = {}] = await db
      .select({
        totalCount: sql<number>`count(${payments.id})::integer`,
      })
      .from(payments)
      .where(eq(payments.userId, event.context.user!.id));

    return {
      payments: paymentItems,

      pagination: createPaginationMetadata({
        totalCount,
        page,
        limit,
      }),
    };
  },
  {
    errorText: 'Failed to fetch payments',
  },
);
