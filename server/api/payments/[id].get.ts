import { createError } from 'h3';
import { eq, and } from 'drizzle-orm';

import { paymentId as paymentIdSchema } from '#shared/dtos/common';
import { payments, db } from '#server/db';
import {
  assertAuth,
  getValidatedRouterParam,
  defineSafeEventHandler,
} from '#server/utils';

export default defineSafeEventHandler(
  async (event) => {
    const id = await getValidatedRouterParam(
      paymentIdSchema(),
      event,
      'id',
    );

    assertAuth(event);

    const [payment] = await db
      .select()
      .from(payments)
      .where(
        and(
          eq(payments.id, id),
          eq(payments.userId, event.context.user!.id),
        ),
      );

    if (!payment) {
      throw createError({
        statusCode: 404,
        message: 'Payment not found',
      });
    }

    return payment;
  },
  {
    errorText: 'Failed to fetch payment',
  },
);
