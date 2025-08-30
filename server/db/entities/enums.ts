import { pgEnum } from 'drizzle-orm/pg-core';

export enum PaymentStatus {
  PROCESSING = 'processing',
  CANCELLED = 'cancelled',
  CONFIRMATION_PENDING = 'confirmation-pending',
  SUCCESS = 'success',
}

// Payment status enum
export const paymentStatusEnum = pgEnum('payment_status', [
  PaymentStatus.PROCESSING,
  PaymentStatus.CANCELLED,
  PaymentStatus.CONFIRMATION_PENDING,
  PaymentStatus.SUCCESS,
]);
