import type { Config } from 'drizzle-kit';

try {
  // workaround for production builds
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('dotenv').config();
} catch (error) {
  console.error(error);
}

export default {
  schema: './server/db/entities/index.ts',
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
