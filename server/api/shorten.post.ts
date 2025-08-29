import { nanoid } from 'nanoid';
import {
  defineEventHandler,
  readBody,
  createError,
  getRequestURL,
} from 'h3';
import { createShortenedUrl } from '../db';
import { db } from '../db/database';
import { users, shortenedUrls } from '../db/schema';
import { eq, and, sql } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

import {
  assertAuth,
  assertPremium,
} from '../utils/validation';

function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return (
      url.protocol === 'http:' || url.protocol === 'https:'
    );
  } catch {
    return false;
  }
}

export default defineEventHandler(async (event) => {
  const { url, customSlug } = await readBody(event);

  if (!url || !isValidUrl(url)) {
    throw createError({
      statusCode: 400,
      message: 'Please provide a valid HTTP/HTTPS URL',
    });
  }

  try {
    let shortCode = nanoid(6);

    if (customSlug) {
      assertAuth(event);
      assertPremium(
        event,
        'Custom slugs require active premium subscription',
      );

      // Check if custom slug is available
      const existing = await db
        .select()
        .from(shortenedUrls)
        .where(eq(shortenedUrls.customSlug, customSlug))
        .limit(1);

      if (existing[0]) {
        throw createError({
          statusCode: 409,
          message: 'Custom slug already taken',
        });
      }

      shortCode = customSlug;
    }

    await createShortenedUrl({
      code: shortCode,
      customSlug: customSlug || null,
      longUrl: url,
      userId: event.user?.id,
    });

    const requestUrl = getRequestURL(event);
    const baseUrl = `${requestUrl.protocol}//${requestUrl.host}`;

    return {
      shortUrl: `${baseUrl}/s/${shortCode}`,
      shortCode,
    };
  } catch (error: any) {
    if (error.statusCode) throw error;

    console.error('Failed to create shortened URL:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to create shortened URL',
    });
  }
});
