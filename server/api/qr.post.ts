import {
  defineEventHandler,
  readBody,
  createError,
  getCookie,
} from 'h3';
import { db } from '../db/database';
import { shortenedUrls } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import QRCode from 'qrcode';

import {
  assertAuth,
  assertPremium,
} from '~/server/utils/validation';

export default defineEventHandler(async (event) => {
  const { shortCode } = await readBody(event);

  assertAuth(event);
  assertPremium(
    event,
    'QR code generation requires active premium subscription',
  );

  const token = getCookie(event, 'auth-token');

  if (!shortCode) {
    throw createError({
      statusCode: 400,
      message: 'Short code is required',
    });
  }

  try {
    // Get the shortened URL
    const shortenedUrl = await db
      .select()
      .from(shortenedUrls)
      .where(
        and(
          eq(shortenedUrls.code, shortCode),
          eq(shortenedUrls.userId, event.user!.id),
        ),
      )
      .limit(1);

    if (!shortenedUrl[0]) {
      throw createError({
        statusCode: 404,
        message: 'Shortened URL not found',
      });
    }

    // Generate QR code
    const requestUrl = getRequestURL(event);
    const baseUrl = `${requestUrl.protocol}//${requestUrl.host}`;
    const fullShortUrl = `${baseUrl}/s/${shortCode}`;

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
      success: true,
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
