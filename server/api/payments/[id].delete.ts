import { eq, and, inArray } from 'drizzle-orm';
import { createError } from 'h3';

import { PaymentStatus } from '#shared/consts/payments';
import {
  assertAuth,
  defineSafeEventHandler,
  getValidatedRouterParam,
} from '#server/utils';
import { payments, db } from '#server/db';
import { paymentId as paymentIdSchema } from '#shared/dtos/common';

export default defineSafeEventHandler(
  async (event) => {
    const id = await getValidatedRouterParam(
      paymentIdSchema(),
      event,
      'id',
    );

    assertAuth(event);

    const [payment] = await db
      .update(payments)
      .set({
        status: PaymentStatus.CANCELLED,
      })
      .where(
        and(
          eq(payments.id, id),
          eq(payments.userId, event.context.user!.id),
          inArray(payments.status, [
            PaymentStatus.PROCESSING,
            PaymentStatus.CONFIRMATION_PENDING,
          ]),
        ),
      )
      .returning();

    if (!payment) {
      throw createError({
        statusCode: 404,
        message: 'Payment not found',
      });
    }

    return payment;
  },
  {
    errorText: 'Failed to cancel payment',
  },
);
