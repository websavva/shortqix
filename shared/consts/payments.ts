export enum PaymentStatus {
  PROCESSING = 'processing',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
  CONFIRMATION_PENDING = 'confirmation-pending',
  SUCCESS = 'success',
}

export function isPaymentWaitingForConfirmation(
  status?: PaymentStatus,
) {
  return (
    status === PaymentStatus.PROCESSING ||
    status === PaymentStatus.CONFIRMATION_PENDING
  );
}
