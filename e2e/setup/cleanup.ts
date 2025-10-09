import { afterAll } from 'vitest';

import { deleteMail, resetDb } from '../utils';

afterAll(async () => {
  await resetDb();

  await deleteMail();
});
