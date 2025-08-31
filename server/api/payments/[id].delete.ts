import { defineEventHandler, getRouterParam } from 'h3';
import { eq, and, inArray } from 'drizzle-orm';

import { payments } from '~/server/db/entities';
import { db } from '~/server/db/database';
import { assertAuth } from '~/server/utils/validation';
import { PaymentStatus } from '~/shared/consts/payments';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!;

  assertAuth(event);

  const [payment] = await db
    .update(payments)
    .set({
      status: PaymentStatus.CANCELLED,
    })
    .where(
      and(
        eq(payments.id, id),
        eq(payments.userId, event.user!.id),
        inArray(payments.status, [
          PaymentStatus.PROCESSING,
          PaymentStatus.CONFIRMATION_PENDING,
        ]),
      ),
    );

  if (!payment) {
    throw createError({
      statusCode: 404,
      message: 'Payment not found',
    });
  }

  return payment;
});
