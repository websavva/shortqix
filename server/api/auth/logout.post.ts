import { defineEventHandler, deleteCookie } from 'h3';

import { assertAuth } from '~/server/utils/validation';

export default defineEventHandler(async (event) => {
  assertAuth(event);

  // Clear the auth cookie
  deleteCookie(event, 'auth-token');

  event.user = null;

  return {
    message: 'Logged out successfully',
  };
});
