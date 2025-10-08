import { defineEventHandler, createError } from 'h3';
import { useLogger } from '#imports';

import { getPremiumPlan } from '#shared/consts/premium-plans';
import { BuyPremiumDtSchema } from '#shared/dtos';
import {
  assertAuth,
  defineSafeEventHandler,
  readValidatedBody,
} from '#server/utils';
import { db } from '#server/db/database';
import {
  bitcoinAddresses,
  payments,
} from '#server/db/entities';
import { BitcoinService } from '#server/services/bitcoin';
import { PaymentStatus } from '#shared/consts/payments';

export default defineSafeEventHandler(
  async (event) => {
    assertAuth(event);

    const { planId } = await readValidatedBody(
      BuyPremiumDtSchema,
      event,
    );

    const selectedPlan = getPremiumPlan(planId)!;

    // Use transaction to ensure all operations succeed or fail together
    const payment = await db.transaction(async (tx) => {
      // Generate new Bitcoin address
      const { address, privateKey, publicKey } =
        BitcoinService.createAddress();

      // Create Bitcoin address record
      await tx
        .insert(bitcoinAddresses)
        .values({
          address,
          privateKey,
          publicKey,
          userId: event.context.user!.id,
          isActive: true,
          createdAt: new Date(),
          lastUsedAt: new Date(),
        })
        .returning();

      const amountBtc =
        await BitcoinService.convertUsdToBtc(
          selectedPlan.priceUSD,
        );

      // Create payment record
      const [payment] = await tx
        .insert(payments)
        .values({
          bitcoinAddress: address,
          userId: event.context.user!.id,
          plan: planId,
          amountUsd: selectedPlan.priceUSD,
          amountBtc: String(amountBtc),
          status: PaymentStatus.PROCESSING,
          expiresAt: new Date(
            Date.now() +
              +process.env.SQX_PAYMENT_EXPIRES_IN_MS!,
          ),
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return payment;
    });

    return {
      message: 'Premium upgrade initiated',
      payment,
    };
  },
  {
    errorText: 'Failed to initiate premium upgrade',
  },
);
