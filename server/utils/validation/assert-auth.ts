import { type H3Event, createError } from 'h3';

export function assertAuth(event: H3Event) {
  if (!event.user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }
}
