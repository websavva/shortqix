import type { Config } from 'drizzle-kit';
import { config } from 'dotenv';

config();

export default {
  schema: './server/db/schema.ts',
  out: './server/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env.POSTGRES_HOST!,
    port: +process.env.POSTGRES_PORT!,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD!,
    database: process.env.POSTGRES_DB!,
    ssl: false,
  },
} satisfies Config;
