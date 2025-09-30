import { defineEventHandler } from 'h3';

import { assertAuth } from '#server/utils/validation';
import type { User } from '#server/db/schema';

export default defineEventHandler(async (event) => {
  assertAuth(event);

  return { user: event.context.user as User };
});
