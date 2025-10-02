import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { config } from 'dotenv';
import type { ExtractTablesWithRelations } from 'drizzle-orm';
import type { PgTransaction } from 'drizzle-orm/pg-core';
import type { PostgresJsQueryResultHKT } from 'drizzle-orm/postgres-js';

config();

// Create the postgres client
const client = postgres({
  host: process.env.SQX_POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.SQX_POSTGRES_PORT || '5432'),
  user: process.env.SQX_POSTGRES_USER || 'postgres',
  password: process.env.SQX_POSTGRES_PASSWORD,
  database: process.env.SQX_POSTGRES_DB || 'url_shortener',
});

// Create the drizzle database instance
export const db = drizzle(client);

export type DbOrTransactionInstance =
  | typeof db
  | PgTransaction<
      PostgresJsQueryResultHKT,
      Record<string, never>,
      ExtractTablesWithRelations<Record<string, never>>
    >;

export default db;
