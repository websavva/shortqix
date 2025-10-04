import {
  defineEventHandler,
  getCookie,
  setCookie,
} from 'h3';
import { nanoid } from 'nanoid';

declare module 'h3' {
  interface H3EventContext {
    sessionId?: string;
  }
}

export default defineEventHandler(async (event) => {
  const guestId = getCookie(event, 'session-id');

  let sessionId = guestId;

  if (!sessionId) {
    sessionId = nanoid(32);

    setCookie(event, 'session-id', sessionId, {
      domain: process.env.SQX_COOKIE_DOMAIN,
      httpOnly: true,
      secure: process.env.SQX_STAGE === 'production',
      maxAge: Math.floor(
        +process.env.SQX_SESSION_ID_COOKIE_EXPIRES_IN_MS! /
          1e3,
      ),
    });
  }

  event.context.sessionId = sessionId;
});
