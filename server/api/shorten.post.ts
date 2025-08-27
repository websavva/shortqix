import { nanoid } from 'nanoid'
import { defineEventHandler, readBody, createError, getRequestURL } from 'h3'
import { createShortenedUrl } from '../db'
import { db } from '../db/database'
import { users, shortenedUrls } from '../db/schema'
import { eq, and, sql } from 'drizzle-orm'
import jwt from 'jsonwebtoken'

function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export default defineEventHandler(async (event) => {
  const { url, customSlug } = await readBody(event)
  
  if (!url || !isValidUrl(url)) {
    throw createError({
      statusCode: 400,
      message: 'Please provide a valid HTTP/HTTPS URL'
    })
  }

  try {
    let shortCode = nanoid(6)
    let userId: number | undefined
    
    if (customSlug) {
      // Check if user is premium
      const token = getCookie(event, 'auth-token')
      if (!token) {
        throw createError({
          statusCode: 401,
          message: 'Custom slugs require premium subscription'
        })
      }

      // Verify premium status
      const decoded = jwt.verify(token, process.env.AUTH_SECRET!) as any
      const user = await db
        .select()
        .from(users)
        .where(and(
          eq(users.id, decoded.id),
          eq(users.isPremium, true),
          sql`${users.premiumExpiresAt} > ${new Date().toISOString()}`
        ))
        .limit(1)

      if (!user[0]) {
        throw createError({
          statusCode: 403,
          message: 'Custom slugs require active premium subscription'
        })
      }

      userId = user[0].id

      // Check if custom slug is available
      const existing = await db
        .select()
        .from(shortenedUrls)
        .where(eq(shortenedUrls.customSlug, customSlug))
        .limit(1)

      if (existing[0]) {
        throw createError({
          statusCode: 409,
          message: 'Custom slug already taken'
        })
      }

      shortCode = customSlug
    } else {
      // For regular URLs, try to get user ID if authenticated
      const token = getCookie(event, 'auth-token')
      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.AUTH_SECRET!) as any
          userId = decoded.id
        } catch {
          // Token invalid, continue without user ID
        }
      }
    }
    
    await createShortenedUrl({
      code: shortCode,
      customSlug: customSlug || null,
      longUrl: url,
      userId
    })

    const requestUrl = getRequestURL(event)
    const baseUrl = `${requestUrl.protocol}//${requestUrl.host}`

    return {
      shortUrl: `${baseUrl}/s/${shortCode}`,
      shortCode
    }
  } catch (error: any) {
    if (error.statusCode) throw error
    
    console.error('Failed to create shortened URL:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to create shortened URL'
    })
  }
}) 