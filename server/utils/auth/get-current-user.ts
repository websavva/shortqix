import type { H3Event } from 'h3';

export async function getCurrentUser(event: H3Event) {
  return event.user;
}
