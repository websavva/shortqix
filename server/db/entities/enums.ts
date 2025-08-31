import { pgEnum } from 'drizzle-orm/pg-core';

import { PaymentStatus } from '../../../shared/consts/payments';

// Payment status enum
export const paymentStatusEnum = pgEnum('payment_status', [
  PaymentStatus.PROCESSING,
  PaymentStatus.CANCELLED,
  PaymentStatus.EXPIRED,
  PaymentStatus.CONFIRMATION_PENDING,
  PaymentStatus.SUCCESS,
]);
