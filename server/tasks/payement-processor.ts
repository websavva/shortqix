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
import { PaymentStatus } from '../db/entities/enums';
import { eq, and, sql, inArray } from 'drizzle-orm';
import { getPremiumPlan } from '~/shared/consts/premium-plans';
import { sleep } from '~/shared/utils/sleep';
import {
  checkBitcoinBalance,
  normalizeBitcoinAmount,
} from '~/server/utils/bitcoin';
import type { Task } from '~/server/types/task';

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
        await checkBitcoinBalance(payment.bitcoinAddress);

      console.log(
        `📊 Address ${payment.bitcoinAddress}: Mempool ${pendingBalance} BTC, Chain ${confirmedBalance} BTC, Required ${payment.amountBtc} BTC`,
      );

      const normalizedConfirmedBalance =
        normalizeBitcoinAmount(payment.amountBtc);

      if (confirmedBalance >= normalizedConfirmedBalance) {
        await this.handleConfirmedPayment(payment, user);
      } else if (
        pendingBalance >= normalizedConfirmedBalance
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
        payment.id,
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
      payment.id,
      PaymentStatus.CONFIRMATION_PENDING,
    );
    console.log(
      `⏳ Payment ${payment.id} in mempool, waiting for confirmation`,
    );
  }

  private static async updatePaymentStatus(
    dbInstance: DbOrTransactionInstance,
    paymentId: string,
    status: PaymentStatus,
  ) {
    await dbInstance
      .update(paymentsTable)
      .set({
        status,
        ...(status === PaymentStatus.SUCCESS && {
          confirmedAt: new Date(),
        }),
        updatedAt: new Date(),
      })
      .where(eq(paymentsTable.id, paymentId));
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
  }

  static cronExpression = '0 0 * * *';

  static isSequential = true;

  static run() {
    return this.processAllPayments();
  }
}
