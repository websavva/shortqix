import { createError, setCookie } from 'h3';
import { eq, and, gt, isNull } from 'drizzle-orm';

import type { AuthTokenPayload } from '#server/types';
import {
  users,
  magicLinks,
  shortenedUrls,
  db,
} from '#server/db';
import {
  readValidatedBody,
  defineSafeEventHandler,
} from '#server/utils';
import { VerifyMagicLinkDtSchema } from '#shared/dtos';
import { AuthJwtService } from '#server/services/jwt';

export default defineSafeEventHandler(
  async (event) => {
    const { token } = await readValidatedBody(
      VerifyMagicLinkDtSchema,
      event,
    );

    if (!token || typeof token !== 'string') {
      throw createError({
        statusCode: 400,
        message: 'Invalid token',
      });
    }

    // Find and validate magic link
    const [magicLink] = await db
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

    if (!magicLink) {
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
        .where(eq(magicLinks.id, magicLink.id));

      // Get user
      const [user] = await tx
        .select()
        .from(users)
        .where(eq(users.email, magicLink.email))
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

      // Assigning short urls to user
      await tx
        .update(shortenedUrls)
        .set({ userId: user.id })
        .where(
          and(
            eq(
              shortenedUrls.sessionId,
              event.context.sessionId!,
            ),
            isNull(shortenedUrls.userId),
          ),
        );

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
      secure: process.env.SQX_STAGE === 'production',
      sameSite: 'lax',
      maxAge: Math.floor(
        +process.env.SQX_AUTH_TOKEN_EXPIRES_IN_MS! / 1000,
      ),
    });

    // Redirect to home page
    return true;
  },
  {
    errorText: 'Failed to verify magic link',
  },
);
