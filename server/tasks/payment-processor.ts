import { eq, and, sql, inArray } from 'drizzle-orm';
import { useLogger } from '#imports';

import { PaymentStatus } from '#shared/consts/payments';
import { getPremiumPlan } from '#shared/consts/premium-plans';
import { sleep } from '#shared/utils/sleep';
import { WsEventTypes } from '#shared/consts/ws-event-types';
import type { Task } from '#server/types/task';
import type { WsEvent } from '#server/types/ws';
import { BitcoinService } from '#server/services/bitcoin';
import { WebSocketService } from '#server/services/ws';
import {
  payments as paymentsTable,
  users as usersTable,
  type User,
  type Payment,
  type DbOrTransactionInstance,
  db,
} from '#server/db';
import { MailService } from '#server/services/mail';

export class PaymentProcessorTask implements Task {
  static logger = useLogger()
    .withTag('tasks')
    .withTag('payment-processor');

  static async processAllPayments() {
    this.logger.log('🔄 Processing payments...');

    try {
      const activePaymentInfos =
        await this.getActivePayments();
      this.logger.log(
        `📊 Found ${activePaymentInfos.length} active payments`,
      );

      for (const { payment, user } of activePaymentInfos) {
        await this.processPayment(payment, user);
        await sleep(1e3); // Rate limiting
      }

      this.logger.log('✅ Payment processing completed');
    } catch (error) {
      this.logger.error(
        '❌ Payment processing failed:',
        error,
      );
      throw error;
    }
  }

  private static async updateExpiredPayments() {
    this.logger.log('⏰ Checking for expired payments...');

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
            sql`${paymentsTable.expiresAt} < ${new Date().toISOString()}`,
          ),
        )
        .returning({
          id: paymentsTable.id,
          status: paymentsTable.status,
          userId: paymentsTable.userId,
        });

      if (expiredPayments.length > 0) {
        this.logger.log(
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
        this.logger.log('⏰ No expired payments found');
      }

      return expiredPayments;
    } catch (error) {
      this.logger.error(
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
          sql`${paymentsTable.expiresAt} > ${new Date().toISOString()}`,
        ),
      );
  }

  private static async processPayment(
    payment: Payment,
    user: User,
  ) {
    try {
      this.logger.log(
        `💰 Checking payment ${payment.id}...`,
      );

      const { pendingBalance, confirmedBalance } =
        await BitcoinService.checkBalance(
          payment.bitcoinAddress,
        );

      this.logger.log(
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
        this.logger.log(
          `❌ Payment ${payment.id} has no funds`,
        );
      }
    } catch (error) {
      this.logger.error(
        `❌ Error processing payment ${payment.id}:`,
        error,
      );
    }
  }

  private static async handleConfirmedPayment(
    payment: Payment,
    user: User,
  ) {
    const events: WsEvent[] = [];

    await db.transaction(async (tx) => {
      const updatedPayment = await this.updatePaymentStatus(
        tx,
        payment,
        PaymentStatus.SUCCESS,
      );

      const updatedUser = await this.grantPremiumAccess(
        tx,
        payment,
        user,
      );

      await MailService.sendMailTemplate(
        'premium-purchase',
        {
          to: updatedUser.email,
          props: {
            purchasedAt: payment.confirmedAt!,
            premiumExpiresAt: updatedUser.premiumExpiresAt!,
            planId: payment.plan,
          },
        },
      ).catch((err) => {
        this.logger.error(
          `❌ Error sending premium purchase email:`,
          err,
        );
      });

      events.push(
        {
          userId: payment.userId,
          type: WsEventTypes.PAYMENT_UPDATE_STATUS,
          payload: updatedPayment,
        },
        {
          userId: user.id,
          type: WsEventTypes.PREMIUM_PURCHASE,
          payload: {
            isPremium: true,
            premiumExpiresAt: updatedUser.premiumExpiresAt!,
            planId: payment.plan,
          },
        },
      );

      await this.sendWsEvents(events);
    });

    this.logger.log(
      `🎉 Payment ${payment.id} confirmed! Premium granted to user ${payment.userId}`,
    );
  }

  private static async sendWsEvents(events: WsEvent[]) {
    for (const event of events) {
      await WebSocketService.sendUserEvent(
        event.userId,
        event.type,
        event.payload,
      );
    }
  }

  private static async handlePendingPayment(
    payment: Payment,
  ) {
    const updatedPayment = await this.updatePaymentStatus(
      db,
      payment,
      PaymentStatus.CONFIRMATION_PENDING,
    );

    WebSocketService.sendUserEvent(
      payment.userId,
      WsEventTypes.PAYMENT_UPDATE_STATUS,
      updatedPayment,
    );

    this.logger.log(
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

    const [updatedPayment] = await dbInstance
      .update(paymentsTable)
      .set(updatedFields)
      .where(eq(paymentsTable.id, payment.id))
      .returning();

    return updatedPayment;
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

    const [updatedUser] = await dbInstance
      .update(usersTable)
      .set({
        isPremium: true,
        premiumExpiresAt: newPremiumExpiresAt,
      })
      .where(eq(usersTable.id, payment.userId))
      .returning();

    return updatedUser;
  }

  static cronExpression = '*/1 * * * *';

  static waitForCompletion = true;

  static async run() {
    await this.updateExpiredPayments();

    await this.processAllPayments();
  }
}
