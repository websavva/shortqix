import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
  inet,
} from 'drizzle-orm/pg-core';

import { users } from './users';

export const pageVisits = pgTable('page_visits', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  userId: integer('user_id').references(() => users.id),
  ipAddress: inet('ip_address'),
  url: varchar('url', {
    length: 256,
  }).notNull(),
  sessionId: varchar('guest_id', { length: 100 }),
});

export type PageVisit = typeof pageVisits.$inferSelect;
export type NewPageVisit = typeof pageVisits.$inferInsert;
