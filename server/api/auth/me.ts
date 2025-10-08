import {
  assertAuth,
  defineSafeEventHandler,
} from '#server/utils';
import type { User } from '#server/db';

export default defineSafeEventHandler(async (event) => {
  assertAuth(event);

  return { user: event.context.user as User };
});
