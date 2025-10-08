import { defineEventHandler } from 'h3';
import { sql, getTableName } from 'drizzle-orm';

import {
  shortenedUrls,
  users,
  bitcoinAddresses,
  payments,
  magicLinks,
  db,
  errorLogs,
} from '#server/db';

const tables = [
  shortenedUrls,
  users,
  bitcoinAddresses,
  payments,
  magicLinks,
  errorLogs,
];

export default defineEventHandler(async () => {
  for (const table of tables) {
    await db.execute(
      sql.raw(
        `TRUNCATE TABLE ${getTableName(table)} CASCADE`,
      ),
    );
  }

  return {
    message: 'All tables deleted successfully',
  };
});
