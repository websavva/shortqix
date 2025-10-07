import {
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  inet,
  varchar,
  integer,
} from 'drizzle-orm/pg-core';

export const errorLogs = pgTable('error_logs', {
  id: serial('id').primaryKey(),

  // Error details
  type: varchar('type', { length: 100 }).notNull(),
  message: varchar('message', { length: 20e3 }).notNull(),
  stack: text('stack'),

  // User context
  userId: integer('user_id'),

  userAgent: varchar('user_agent', { length: 10e3 }),
  userAgentInfo: text('user_agent_info'),

  ip: inet('ip'),
  ipInfo: text('ip_info'),

  // Page context
  url: varchar('url', { length: 30e3 }),

  // Metadata
  timestamp: timestamp('timestamp').defaultNow(),

  env: varchar('env', { length: 100 }).notNull(),
});

export type ErrorLog = typeof errorLogs.$inferSelect;
export type NewErrorLog = typeof errorLogs.$inferInsert;
