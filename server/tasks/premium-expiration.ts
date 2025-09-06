import { lt, sql  } from 'drizzle-orm';

import { WsEventTypes } from '@/shared/consts/ws-event-types';

import type { Task } from '../types/task';
import { db } from '../db';
import { users } from '../db/schema';
import { WebSocketService } from '../services/ws';


export class PremiumExpirationTask implements Task {
  static async updateExpiredPremium() {
    console.log('🔄 Starting premium expiration check...');

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

      console.log(
        `📊 Found ${expiredUsersCount} users with expired premium`,
      );

      if (expiredUsersCount === 0) {
        console.log(
          '✅ No users with expired premium found',
        );
        return;
      }

      console.log('⏰ Updating expired premium users...');

      const usersWithExpiredPremium = await db
        .update(users)
        .set(updatedFields)
        .where(lt(users.premiumExpiresAt, new Date()))
        .returning({
          id: users.id,
          email: users.email,
          premiumExpiresAt: users.premiumExpiresAt,
        });

      console.log(
        `✅ Successfully updated ${usersWithExpiredPremium.length} users`,
      );
      console.log(
        '📋 Updated users:',
        usersWithExpiredPremium.map((u) => ({
          id: u.id,
          email: u.email,
          expiredAt: u.premiumExpiresAt,
        })),
      );

      // Send WebSocket notifications
      console.log('📡 Sending WebSocket notifications...');
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
          console.log(
            `📤 Notification sent to user ${userId} (${email})`,
          );
        } catch (error) {
          notificationsFailed++;
          console.error(
            `❌ Failed to send notification to user ${userId} (${email}):`,
            error,
          );
        }
      }

      console.log(
        `📊 Notifications summary: ${notificationsSent} sent, ${notificationsFailed} failed`,
      );
      console.log(
        '✅ Premium expiration check completed successfully',
      );
    } catch (error) {
      console.error(
        '❌ Error during premium expiration check:',
        error,
      );
      throw error;
    }
  }

  static cronExpression = '*/1 * * * *';

  static waitForCompletion = true;

  static async run() {
    console.log('🚀 Starting PremiumExpirationTask...');
    try {
      await this.updateExpiredPremium();
      console.log(
        '✅ PremiumExpirationTask completed successfully',
      );
    } catch (error) {
      console.error(
        '❌ PremiumExpirationTask failed:',
        error,
      );
      throw error;
    }
  }
}
