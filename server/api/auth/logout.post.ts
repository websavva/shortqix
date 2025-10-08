import { deleteCookie } from 'h3';

import {
  assertAuth,
  defineSafeEventHandler,
} from '#server/utils';

export default defineSafeEventHandler(async (event) => {
  assertAuth(event);

  // Clear the auth cookie
  deleteCookie(event, 'auth-token');

  event.context.user = null;

  return {
    message: 'Logged out successfully',
  };
});
