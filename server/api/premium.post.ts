import {
  defineEventHandler,
  readBody,
  createError,
} from 'h3';
import { db } from '../db/database';
import { bitcoinAddresses, payments } from '../db/entities';
import { convertUsdToBtc } from '~/server/utils/bitcoin';
import { PaymentStatus } from '../../shared/consts/payments';
import { assertAuth } from '~/server/utils/validation';
import {
  PREMIUM_PLANS,
  PremiumPlanId,
  isValidPlanId,
  getPremiumPlan,
} from '~/shared/consts/premium-plans';

import { createBitcoinAddress } from '~/server/utils/bitcoin';

export default defineEventHandler(async (event) => {
  assertAuth(event);

  try {
    const { planId } = await readBody(event);

    if (!planId || !isValidPlanId(planId)) {
      throw createError({
        statusCode: 400,
        message:
          'Invalid plan. Choose from: 1month, 3months, 1year',
      });
    }

    const selectedPlan = getPremiumPlan(planId)!;

    // Use transaction to ensure all operations succeed or fail together
    const payment = await db.transaction(async (tx) => {
      // Generate new Bitcoin address
      const { address, privateKey, publicKey } =
        createBitcoinAddress();

      // Create Bitcoin address record
      await tx
        .insert(bitcoinAddresses)
        .values({
          address,
          privateKey,
          publicKey,
          network: 'testnet',
          userId: event.user!.id,
          isActive: true,
          createdAt: new Date(),
          lastUsedAt: new Date(),
        })
        .returning();

      const amountBtc = await convertUsdToBtc(
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
          expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
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
