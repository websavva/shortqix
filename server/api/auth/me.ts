import { defineEventHandler } from 'h3';

import { assertAuth } from '~/server/utils/validation';

export default defineEventHandler(async (event) => {
  assertAuth(event);

  return { user: event.user };
});
