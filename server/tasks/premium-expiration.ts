import { Task } from '../types/task';
import { lt } from 'drizzle-orm';

import { db } from '../db';
import { users } from '../db/schema';

export class PremiumExpiration implements Task {
  static async updateExpiredPremium() {
    await db
      .update(users)
      .set({
        isPremium: false,
        premiumExpiresAt: null,
      })
      .where(lt(users.premiumExpiresAt, new Date()));
  }

  static cronExpression = '0 0 * * *';

  static waitForCompletion = true;

  static async run() {
    await this.updateExpiredPremium();
  }
}
