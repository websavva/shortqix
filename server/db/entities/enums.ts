import { pgEnum } from 'drizzle-orm/pg-core';

import { PaymentStatus } from '../../../shared/consts/payments';
import { PremiumPlanId } from '../../../shared/consts/premium-plans';

// Payment status enum
export const paymentStatusEnum = pgEnum('payment_status', [
  PaymentStatus.PROCESSING,
  PaymentStatus.CANCELLED,
  PaymentStatus.EXPIRED,
  PaymentStatus.CONFIRMATION_PENDING,
  PaymentStatus.SUCCESS,
]);

export const premiumPlanEnum = pgEnum('premium_plan', [
  PremiumPlanId.ONE_MONTH,
  PremiumPlanId.THREE_MONTHS,
  PremiumPlanId.ONE_YEAR,
]);
