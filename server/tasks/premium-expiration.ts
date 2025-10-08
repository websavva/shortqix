import { lt, sql } from 'drizzle-orm';
import { useLogger } from '#imports';

import { WsEventTypes } from '#shared/consts/ws-event-types';
import type { Task } from '#server/types/task';
import { db, users } from '#server/db';
import { WebSocketService } from '#server/services/ws';

export class PremiumExpirationTask implements Task {
  static logger = useLogger()
    .withTag('tasks')
    .withTag('premium-expiration');

  static async updateExpiredPremium() {
    this.logger.log(
      '🔄 Starting premium expiration check...',
    );

    const updatedFields = {
      isPremium: false as const,
      premiumExpiresAt: null,
    };

    try {
      // First, check how many users have expired premium
      const [{ count: expiredUsersCount }] = await db
        .select({ count: sql<number>`count(*)` })
        .from(users)
        .where(lt(users.premiumExpiresAt, new Date()));

      this.logger.log(
        `📊 Found ${expiredUsersCount} users with expired premium`,
      );

      if (expiredUsersCount === 0) {
        this.logger.log(
          '✅ No users with expired premium found',
        );
        return;
      }

      this.logger.log(
        '⏰ Updating expired premium users...',
      );

      const usersWithExpiredPremium = await db
        .update(users)
        .set(updatedFields)
        .where(lt(users.premiumExpiresAt, new Date()))
        .returning({
          id: users.id,
          email: users.email,
          premiumExpiresAt: users.premiumExpiresAt,
        });

      this.logger.log(
        `✅ Successfully updated ${usersWithExpiredPremium.length} users`,
      );
      this.logger.log(
        '📋 Updated users:',
        usersWithExpiredPremium.map((u) => ({
          id: u.id,
          email: u.email,
          expiredAt: u.premiumExpiresAt,
        })),
      );

      // Send WebSocket notifications
      this.logger.log(
        '📡 Sending WebSocket notifications...',
      );
      let notificationsSent = 0;
      let notificationsFailed = 0;

      for (const {
        id: userId,
        email,
      } of usersWithExpiredPremium) {
        try {
          await WebSocketService.sendUserEvent(
            userId,
            WsEventTypes.PREMIUM_EXPIRATION,
            updatedFields,
          );
          notificationsSent++;
          this.logger.log(
            `📤 Notification sent to user ${userId} (${email})`,
          );
        } catch (error) {
          notificationsFailed++;
          this.logger.error(
            `❌ Failed to send notification to user ${userId} (${email}):`,
            error,
          );
        }
      }

      this.logger.log(
        `📊 Notifications summary: ${notificationsSent} sent, ${notificationsFailed} failed`,
      );
      this.logger.log(
        '✅ Premium expiration check completed successfully',
      );
    } catch (error) {
      this.logger.error(
        '❌ Error during premium expiration check:',
        error,
      );
      throw error;
    }
  }

  static cronExpression = '*/1 * * * *';

  static waitForCompletion = true;

  static async run() {
    this.logger.log('🚀 Starting PremiumExpirationTask...');
    try {
      await this.updateExpiredPremium();
      this.logger.log(
        '✅ PremiumExpirationTask completed successfully',
      );
    } catch (error) {
      this.logger.error(
        '❌ PremiumExpirationTask failed:',
        error,
      );
      throw error;
    }
  }
}
