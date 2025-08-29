import type { H3Event } from 'h3';
import jwt, {
  JsonWebTokenError,
  TokenExpiredError,
} from 'jsonwebtoken';

import { db } from '../db/database';
import { users, type User } from '../db/schema';
import { eq } from 'drizzle-orm';

import type { AuthTokenPayload } from '~/server/types';

declare module 'h3' {
  interface H3Event {
    user: User | null;
  }
}

export default defineEventHandler(
  async (event: H3Event) => {
    event.user = null;

    const token = getCookie(event, 'auth-token');

    if (!token) return;

    try {
      const decoded = jwt.verify(
        token,
        process.env.AUTH_SECRET!,
      ) as AuthTokenPayload;

      [event.user] = await db
        .select()
        .from(users)
        .where(eq(users.id, decoded.id));
    } catch (error) {
      console.error('Error getting current user:', error);

      if (
        error instanceof JsonWebTokenError ||
        error instanceof TokenExpiredError
      ) {
        deleteCookie(event, 'auth-token');

        throw createError({
          statusCode: 422,
          message:
            'Invalid or expired authentication token',
        });
      }
    }
  },
);
