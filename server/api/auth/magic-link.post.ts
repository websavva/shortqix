import {
  defineEventHandler,
  createError,
  getQuery,
} from 'h3';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

import { db } from '../../db/database';
import { users, magicLinks } from '../../db/schema';
import { MailService } from '../../services/mail';
import { readValidatedBody } from '../../utils/validation';
import { CreateMagicLinkDtoSchema } from '../../../shared/dtos';

export default defineEventHandler(async (event) => {
  const { email } = await readValidatedBody(
    CreateMagicLinkDtoSchema,
    event,
  );

  try {
    // Use transaction to ensure both operations succeed or fail together
    const token = await db.transaction(async (tx) => {
      // Check if user exists, create if not
      let [user] = await tx
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (!user) {
        // Create new user
        const [newUser] = await tx
          .insert(users)
          .values({
            email,
            isVerified: false,
          })
          .returning();

        user = newUser;
      }

      // Generate magic link token
      const token = nanoid(32);
      const expiresAt = new Date(
        Date.now() +
          +process.env.AUTH_MAGIC_LINK_TOKEN_EXPIRES_IN_MS!,
      );

      // Save magic link to database
      await tx.insert(magicLinks).values({
        email,
        token,
        expiresAt,
        used: false,
      });

      return token;
    });

    // Send magic link email
    await MailService.sendMailTemplate('magic-link', {
      to: email,
      props: {
        token,
      },
    });

    return {
      email,
      token:
        process.env.NODE_ENV === 'production'
          ? undefined
          : token,
    };
  } catch (error: any) {
    if (error.statusCode) throw error;

    console.error('Magic link error:', error);

    throw createError({
      statusCode: 500,
      message: 'Failed to send magic link',
    });
  }
});
