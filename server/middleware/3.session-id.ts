import {
  defineEventHandler,
  getCookie,
  setCookie,
} from 'h3';
import { nanoid } from 'nanoid';

declare module 'h3' {
  interface H3Event {
    sessionId: string;
  }
}

export default defineEventHandler(async (event) => {
  const guestId = getCookie(event, 'session-id');

  let sessionId = guestId;

  if (!sessionId) {
    sessionId = nanoid(32);

    setCookie(event, 'session-id', sessionId, {
      domain: process.env.COOKIE_DOMAIN,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: +process.env.SESSION_ID_COOKIE_EXPIRES_IN_MS!,
    });
  }

  event.sessionId = sessionId;
});
