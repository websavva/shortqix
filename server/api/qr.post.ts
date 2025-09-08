import { defineEventHandler, createError } from 'h3';
import { eq, and } from 'drizzle-orm';
import QRCode from 'qrcode';

import { createShortUrl } from '#shared/utils/create-short-url';
import {
  assertAuth,
  assertPremium,
} from '#server/utils/validation';

import { db } from '../db/database';
import { shortenedUrls } from '../db/schema';
import { readValidatedBody } from '../utils/validation';
import { CreateQrDtSchema } from '../../shared/dtos';



export default defineEventHandler(async (event) => {
  const { code } = await readValidatedBody(
    CreateQrDtSchema,
    event,
  );

  assertAuth(event);
  assertPremium(
    event,
    'QR code generation requires active premium subscription',
  );

  try {
    // Get the shortened URL
    const [shortenedUrl] = await db
      .select()
      .from(shortenedUrls)
      .where(
        and(
          eq(shortenedUrls.code, code),
          eq(shortenedUrls.userId, event.user!.id),
        ),
      )
      .limit(1);

    if (!shortenedUrl) {
      throw createError({
        statusCode: 404,
        message: 'Shortened URL not found',
      });
    }

    // Generate QR code
    const fullShortUrl = createShortUrl(shortenedUrl.code);

    const qrCodeDataUrl = await QRCode.toDataURL(
      fullShortUrl,
      {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      },
    );

    return {
      qrCode: qrCodeDataUrl,
      shortUrl: fullShortUrl,
    };
  } catch (error: any) {
    if (error.statusCode) throw error;

    console.error('QR code generation failed:', error);

    throw createError({
      statusCode: 500,
      message: 'Failed to generate QR code',
    });
  }
});
