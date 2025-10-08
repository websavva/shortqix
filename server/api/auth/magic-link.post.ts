import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

import { db, users, magicLinks } from '#server/db';
import { MailService } from '#server/services/mail';
import {
  readValidatedBody,
  defineSafeEventHandler,
} from '#server/utils';
import { CreateMagicLinkDtoSchema } from '#shared/dtos';

export default defineSafeEventHandler(
  async (event) => {
    const { email } = await readValidatedBody(
      CreateMagicLinkDtoSchema,
      event,
    );

    let isNewUser = false;

    // Use transaction to ensure both operations succeed or fail together
    const token = await db.transaction(async (tx) => {
      // Check if user exists, create if not
      let [user] = await tx
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (!user) {
        isNewUser = true;

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
          +process.env
            .SQX_AUTH_MAGIC_LINK_TOKEN_EXPIRES_IN_MS!,
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

    // Send magic link and welcome emails
    await Promise.all([
      MailService.sendMailTemplate('magic-link', {
        to: email,
        props: {
          token,
        },
      }),
      isNewUser
        ? MailService.sendMailTemplate('welcome', {
            to: email,
            props: {},
          })
        : Promise.resolve(),
    ]);

    return {
      email,
      token:
        process.env.SQX_STAGE === 'production'
          ? undefined
          : token,
    };
  },
  {
    errorText: 'Failed to send magic link',
  },
);
