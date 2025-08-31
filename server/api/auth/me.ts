import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
  assertAuth(event);

  return { user: event.user };
});
