import {
  defineEventHandler,
  readBody,
  createError,
} from 'h3';
import { eq } from 'drizzle-orm';

import { PaymentProcessorTask } from '#server/tasks/payment-processor';
import { payments, users } from '#server/db/schema';
import { db } from '#server/db';
import { PaymentStatus } from '#shared/consts/payments';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { paymentId, status } = body;

  const [{ payment, user }] = await db
    .select({
        payment: payments,
        user: users,
    })
    .from(payments)
    .innerJoin(users, eq(payments.userId, users.id))
    .where(eq(payments.id, paymentId))

  if (!payment) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Payment not found',
    });
  }

  if (PaymentStatus.SUCCESS === status) {
    await PaymentProcessorTask.handleConfirmedPayment(
      payment,
      user,
    );
  } else if (
    PaymentStatus.CONFIRMATION_PENDING === status
  ) {
    await PaymentProcessorTask.handlePendingPayment(
      payment,
    );
  }
});
