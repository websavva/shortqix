import {
  pgTable,
  serial,
  varchar,
  timestamp,
  boolean,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 })
    .notNull()
    .unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  isVerified: boolean('is_verified')
    .default(false)
    .notNull(),
  isPremium: boolean('is_premium').default(false).notNull(),
  premiumExpiresAt: timestamp('premium_expires_at'),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
