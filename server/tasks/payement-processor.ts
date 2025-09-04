import {
  db,
  type DbOrTransactionInstance,
} from '../db/database';
import {
  payments as paymentsTable,
  users as usersTable,
  type User,
  type Payment,
} from '../db/entities';
import { PaymentStatus } from '~/shared/consts/payments';

import { eq, and, sql, inArray } from 'drizzle-orm';
import { getPremiumPlan } from '~/shared/consts/premium-plans';
import { sleep } from '~/shared/utils/sleep';
import { BitcoinService } from '../services/bitcoin';
import type { Task } from '~/server/types/task';
import { WebSocketService } from '../services/ws';
import { WsEventTypes } from '~/shared/consts/ws-event-types';

export class PaymentProcessorTask implements Task {
  static async processAllPayments() {
    console.log('🔄 Processing payments...');

    try {
      const activePaymentInfos =
        await this.getActivePayments();
      console.log(
        `📊 Found ${activePaymentInfos.length} active payments`,
      );

      for (const { payment, user } of activePaymentInfos) {
        await this.processPayment(payment, user);
        await sleep(1e3); // Rate limiting
      }

      console.log('✅ Payment processing completed');
    } catch (error) {
      console.error('❌ Payment processing failed:', error);
      throw error;
    }
  }

  private static async updateExpiredPayments() {
    console.log('⏰ Checking for expired payments...');

    const updatedFields = {
      status: PaymentStatus.EXPIRED,
      updatedAt: new Date(),
    };

    try {
      const expiredPayments = await db
        .update(paymentsTable)
        .set(updatedFields)
        .where(
          and(
            inArray(paymentsTable.status, [
              PaymentStatus.PROCESSING,
              PaymentStatus.CONFIRMATION_PENDING,
            ]),
            sql`${
              paymentsTable.expiresAt
            } < ${new Date().toISOString()}`,
          ),
        )
        .returning({
          id: paymentsTable.id,
          status: paymentsTable.status,
          userId: paymentsTable.userId,
        });

      if (expiredPayments.length > 0) {
        console.log(
          `⏰ Marked ${expiredPayments.length} expired payments:`,
          expiredPayments.map((p) => p.id),
        );

        for (const { id, userId } of expiredPayments) {
          const wsEventPayload = {
            id,
            confirmedAt: null,
            ...updatedFields,
          };

          WebSocketService.sendUserEvent(
            userId,
            WsEventTypes.PAYMENT_UPDATE_STATUS,
            wsEventPayload,
          );
        }
      } else {
        console.log('⏰ No expired payments found');
      }

      return expiredPayments;
    } catch (error) {
      console.error(
        '❌ Error updating expired payments:',
        error,
      );
    }
  }

  private static async getActivePayments() {
    return await db
      .select({
        payment: paymentsTable,
        user: usersTable,
      })
      .from(paymentsTable)
      .innerJoin(
        usersTable,
        eq(paymentsTable.userId, usersTable.id),
      )
      .where(
        and(
          inArray(paymentsTable.status, [
            PaymentStatus.PROCESSING,
            PaymentStatus.CONFIRMATION_PENDING,
          ]),
          sql`${
            paymentsTable.expiresAt
          } > ${new Date().toISOString()}`,
        ),
      );
  }

  private static async processPayment(
    payment: Payment,
    user: User,
  ) {
    try {
      console.log(`💰 Checking payment ${payment.id}...`);

      const { pendingBalance, confirmedBalance } =
        await BitcoinService.checkBalance(
          payment.bitcoinAddress,
        );

      console.log(
        `📊 Address ${payment.bitcoinAddress}: Mempool ${pendingBalance} BTC, Chain ${confirmedBalance} BTC, Required ${payment.amountBtc} BTC`,
      );

      const normalizedRequiredAmount =
        BitcoinService.normalizeAmount(payment.amountBtc);

      if (confirmedBalance >= normalizedRequiredAmount) {
        await this.handleConfirmedPayment(payment, user);
      } else if (
        pendingBalance >= normalizedRequiredAmount
      ) {
        await this.handlePendingPayment(payment);
      } else {
        console.log(
          `❌ Payment ${payment.id} has no funds`,
        );
      }
    } catch (error) {
      console.error(
        `❌ Error processing payment ${payment.id}:`,
        error,
      );
    }
  }

  private static async handleConfirmedPayment(
    payment: Payment,
    user: User,
  ) {
    await db.transaction(async (tx) => {
      await this.updatePaymentStatus(
        tx,
        payment,
        PaymentStatus.SUCCESS,
      );
      await this.grantPremiumAccess(tx, payment, user);
    });

    console.log(
      `🎉 Payment ${payment.id} confirmed! Premium granted to user ${payment.userId}`,
    );
  }

  private static async handlePendingPayment(
    payment: Payment,
  ) {
    await this.updatePaymentStatus(
      db,
      payment,
      PaymentStatus.CONFIRMATION_PENDING,
    );
    console.log(
      `⏳ Payment ${payment.id} in mempool, waiting for confirmation`,
    );
  }

  private static async updatePaymentStatus(
    dbInstance: DbOrTransactionInstance,
    payment: Payment,
    status: PaymentStatus,
  ) {
    const updatedFields = {
      status,
      confirmedAt:
        status === PaymentStatus.SUCCESS
          ? new Date()
          : null,
      updatedAt: new Date(),
    };

    await dbInstance
      .update(paymentsTable)
      .set(updatedFields)
      .where(eq(paymentsTable.id, payment.id));

    const wsEventPayload = {
      id: payment.id,
      ...updatedFields,
    };

    WebSocketService.sendUserEvent(
      payment.userId,
      WsEventTypes.PAYMENT_UPDATE_STATUS,
      wsEventPayload,
    );
  }

  private static async grantPremiumAccess(
    dbInstance: DbOrTransactionInstance,
    payment: Payment,
    user: User,
  ) {
    const planConfig = getPremiumPlan(payment.plan)!;
    const planDurationInMS =
      planConfig.duration * 24 * 60 * 60 * 1000;

    const currentExpiresAt =
      user.premiumExpiresAt &&
      user.premiumExpiresAt > new Date()
        ? user.premiumExpiresAt
        : new Date();

    const newPremiumExpiresAt = new Date(
      currentExpiresAt.getTime() + planDurationInMS,
    );

    await dbInstance
      .update(usersTable)
      .set({
        isPremium: true,
        premiumExpiresAt: newPremiumExpiresAt,
      })
      .where(eq(usersTable.id, payment.userId));

    WebSocketService.sendUserEvent(
      user.id,
      WsEventTypes.PREMIUM_PURCHASE,
      {
        planId: payment.plan,
        premiumExpiresAt: newPremiumExpiresAt,
      },
    );
  }

  static cronExpression = '*/1 * * * *';

  static waitForCompletion = true;

  static async run() {
    await this.updateExpiredPayments();

    await this.processAllPayments();
  }
}
