import {
  pgTable,
  varchar,
  text,
  timestamp,
  integer,
  boolean,
} from 'drizzle-orm/pg-core';

import { users } from './users';

export const bitcoinAddresses = pgTable(
  'bitcoin_addresses',
  {
    address: varchar('address', { length: 100 })
      .primaryKey()
      .notNull(),
    privateKey: text('private_key').notNull(), // Encrypted private key
    publicKey: text('public_key').notNull(),
    userId: integer('user_id').references(() => users.id),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at')
      .defaultNow()
      .notNull(),
    lastUsedAt: timestamp('last_used_at'),
  },
);

export type BitcoinAddress =
  typeof bitcoinAddresses.$inferSelect;
export type NewBitcoinAddress =
  typeof bitcoinAddresses.$inferInsert;
