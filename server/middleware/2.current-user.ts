import {
  type H3Event,
  fromNodeMiddleware,
  type NodeMiddleware,
  defineEventHandler,
  createError,
  getCookie,
  deleteCookie,
} from 'h3';
import { eq } from 'drizzle-orm';

import { AuthJwtService } from '../services/jwt';
import { users, type User } from '../db/schema';
import { db } from '../db/database';

declare module 'h3' {
  interface H3EventContext {
    user?: User | null;
    sessionId?: string;
  }
}

declare module 'http' {
  interface IncomingMessage {
    user: User | null;
  }
}

export const CurrentUserNodeMiddleware: NodeMiddleware =
  async (req, res, next) => {
    const event = {
      node: {
        req,
        res,
      },
    } as H3Event;

    req.user = null;

    const token = getCookie(event, 'auth-token');

    if (!token) {
      next();
      return;
    }

    try {
      const decoded = AuthJwtService.verify(token);

      [req.user] = await db
        .select()
        .from(users)
        .where(eq(users.id, decoded.id));

      next();
    } catch (error) {
      console.error('Error getting current user:', error);

      if (AuthJwtService.isAuthTokenError(error)) {
        deleteCookie(event, 'auth-token');

        next(
          createError({
            statusCode: 422,
            message:
              'Invalid or expired authentication token',
          }),
        );
      } else {
        next(
          createError({
            statusCode: 500,
            message: 'Failed to get current user',
          }),
        );
      }
    }
  };

export default defineEventHandler({
  onRequest: (event) => {
    event.context.user = null;
  },

  handler: fromNodeMiddleware(CurrentUserNodeMiddleware),

  onBeforeResponse: (event) => {
    event.context.user = event.node.req.user;
  },
});
