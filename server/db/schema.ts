import { pgTable, serial, varchar, text, timestamp, integer, boolean, decimal, uuid } from 'drizzle-orm/pg-core'

export const shortenedUrls = pgTable('shortened_urls', {
  id: serial('id').primaryKey(),
  code: varchar('code', { length: 10 }).notNull().unique(),
  customSlug: varchar('custom_slug', { length: 20 }),
  longUrl: text('long_url').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  clicks: integer('clicks').default(0).notNull(),
  userId: integer('user_id').references(() => users.id),
})

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  isVerified: boolean('is_verified').default(false).notNull(),
  isPremium: boolean('is_premium').default(false).notNull(),
  premiumExpiresAt: timestamp('premium_expires_at'),
})

export const cryptoPayments = pgTable('crypto_payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: integer('user_id').references(() => users.id).notNull(),
  bitcoinAddress: varchar('bitcoin_address', { length: 100 }).notNull(),
  amount: decimal('amount', { precision: 18, scale: 8 }).notNull(),
  status: varchar('status', { length: 20 }).default('pending').notNull(), // pending, paid, expired, failed
  expiresAt: timestamp('expires_at').notNull(),
  paidAt: timestamp('paid_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const magicLinks = pgTable('magic_links', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull(),
  token: varchar('token', { length: 255 }).notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  used: boolean('used').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export type ShortenedUrl = typeof shortenedUrls.$inferSelect
export type NewShortenedUrl = typeof shortenedUrls.$inferInsert
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type CryptoPayment = typeof cryptoPayments.$inferSelect
export type NewCryptoPayment = typeof cryptoPayments.$inferInsert
export type MagicLink = typeof magicLinks.$inferSelect
export type NewMagicLink = typeof magicLinks.$inferInsert 