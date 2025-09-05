import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  boolean,
} from 'drizzle-orm/pg-core';
import { users } from './users';

export const shortenedUrls = pgTable('shortened_urls', {
  id: serial('id').primaryKey(),
  code: varchar('code', { length: 32 }).notNull().unique(),
  longUrl: text('long_url').notNull(),
  isCustom: boolean('is_custom').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  clicks: integer('clicks').default(0).notNull(),
  userId: integer('user_id').references(() => users.id),
});

export type ShortenedUrl =
  typeof shortenedUrls.$inferSelect;
export type NewShortenedUrl =
  typeof shortenedUrls.$inferInsert;
