import { pgTable, serial, varchar, text, timestamp, integer } from 'drizzle-orm/pg-core'
import { users } from './users'

export const shortenedUrls = pgTable('shortened_urls', {
  id: serial('id').primaryKey(),
  code: varchar('code', { length: 10 }).notNull().unique(),
  customSlug: varchar('custom_slug', { length: 20 }),
  longUrl: text('long_url').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  clicks: integer('clicks').default(0).notNull(),
  userId: integer('user_id').references(() => users.id),
})

export type ShortenedUrl = typeof shortenedUrls.$inferSelect
export type NewShortenedUrl = typeof shortenedUrls.$inferInsert 