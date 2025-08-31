import {
  pgTable,
  uuid,
  integer,
  decimal,
  varchar,
  timestamp,
  doublePrecision,
} from 'drizzle-orm/pg-core';

import { PaymentStatus } from '~/shared/consts/payments';

import { paymentStatusEnum } from './enums';
import { users } from './users';
import { bitcoinAddresses } from './bitcoin-addresses';

export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  bitcoinAddress: varchar('bitcoin_address_id')
    .references(() => bitcoinAddresses.address)
    .notNull(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  plan: varchar('plan', { length: 20 }).notNull(), // 1month, 3months, 1year
  amountUsd: doublePrecision('amount_usd').notNull(),
  amountBtc: decimal('amount_btc', {
    precision: 18,
    scale: 8,
  }).notNull(),
  status: paymentStatusEnum('status')
    .default(PaymentStatus.PROCESSING)
    .notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  confirmedAt: timestamp('confirmed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
