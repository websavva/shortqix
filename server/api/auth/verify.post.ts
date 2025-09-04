import {
  defineEventHandler,
  getQuery,
  createError,
  setCookie,
  sendRedirect,
} from 'h3';
import type { AuthTokenPayload } from '~/server/types';

import { db } from '../../db/database';
import { users, magicLinks } from '../../db/schema';
import { eq, and, gt } from 'drizzle-orm';

import { AuthJwtService } from '../../services/jwt';

export default defineEventHandler(async (event) => {
  const { token } = await readBody(event);

  if (!token || typeof token !== 'string') {
    throw createError({
      statusCode: 400,
      message: 'Invalid token',
    });
  }

  try {
    // Find and validate magic link
    const magicLink = await db
      .select()
      .from(magicLinks)
      .where(
        and(
          eq(magicLinks.token, token),
          eq(magicLinks.used, false),
          gt(magicLinks.expiresAt, new Date()),
        ),
      )
      .limit(1);

    if (!magicLink[0]) {
      throw createError({
        statusCode: 400,
        message: 'Invalid or expired token',
      });
    }

    // Use transaction to ensure all operations succeed or fail together
    const user = await db.transaction(async (tx) => {
      // Mark magic link as used
      await tx
        .update(magicLinks)
        .set({ used: true })
        .where(eq(magicLinks.id, magicLink[0].id));

      // Get user
      const [user] = await tx
        .select()
        .from(users)
        .where(eq(users.email, magicLink[0].email))
        .limit(1);

      if (!user) {
        throw createError({
          statusCode: 404,
          message: 'User not found',
        });
      }

      // Update user as verified if needed
      if (!user.isVerified) {
        await tx
          .update(users)
          .set({ isVerified: true })
          .where(eq(users.id, user.id));
        user.isVerified = true;
      }

      return user;
    });

    const payload: AuthTokenPayload = {
      id: user.id,
      email: user.email,
    };

    // Create JWT token
    const jwtToken = AuthJwtService.sign(payload);

    // Set HTTP-only cookie
    setCookie(event, 'auth-token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: Math.floor(
        +process.env.AUTH_TOKEN_EXPIRES_IN_MS! / 1000,
      ),
    });

    // Redirect to home page
    return true;
  } catch (error: any) {
    if (error.statusCode) throw error;

    console.error('Verification error:', error);
    throw createError({
      statusCode: 500,
      message: 'Verification failed',
    });
  }
});
