import { defineEventHandler, createError } from 'h3';
import { eq, and } from 'drizzle-orm';

import { paymentId as paymentIdSchema } from '#shared/dtos/common';
import { payments } from '#server/db/entities';
import { db } from '#server/db/database';
import {
  assertAuth,
  getValidatedRouterParam,
} from '#server/utils/validation';

export default defineEventHandler(async (event) => {
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
});
