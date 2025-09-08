import {
  defineEventHandler,
  createError,
} from 'h3';

import { getPremiumPlan } from '#shared/consts/premium-plans';
import { BuyPremiumDtSchema } from '#shared/dtos';
import { assertAuth } from '#server/utils/validation';

import { db } from '../db/database';
import { bitcoinAddresses, payments } from '../db/entities';
import { BitcoinService } from '../services/bitcoin';
import { PaymentStatus } from '../../shared/consts/payments';
import { readValidatedBody } from '../utils/validation';


export default defineEventHandler(async (event) => {
  assertAuth(event);

  try {
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
          userId: event.user!.id,
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
          userId: event.user!.id,
          plan: planId,
          amountUsd: selectedPlan.priceUSD,
          amountBtc: String(amountBtc),
          status: PaymentStatus.PROCESSING,
          expiresAt: new Date(
            Date.now() +
              +process.env.PAYMENT_EXPIRES_IN_MS!,
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
  } catch (error: any) {
    if (error.statusCode) throw error;

    console.error('Premium upgrade error:', error);

    throw createError({
      statusCode: 500,
      message: 'Failed to initiate premium upgrade',
    });
  }
});
