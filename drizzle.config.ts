import type { Config } from 'drizzle-kit';
import { config } from 'dotenv';

config();

export default {
  schema: './server/db/schema.ts',
  out: './server/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env.SQX_POSTGRES_HOST!,
    port: +process.env.SQX_POSTGRES_PORT!,
    user: process.env.SQX_POSTGRES_USER,
    password: process.env.SQX_POSTGRES_PASSWORD!,
    database: process.env.SQX_POSTGRES_DB!,
    ssl: false,
  },
} satisfies Config;
