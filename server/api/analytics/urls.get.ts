import { defineEventHandler, getCookie, createError } from 'h3'
import { db } from '../../db/database'
import { users, shortenedUrls } from '../../db/schema'
import { eq, and, sql } from 'drizzle-orm'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth-token')
  
  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'Authentication required'
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.AUTH_SECRET!) as any
    
    // Check premium status
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
        message: 'Analytics require active premium subscription'
      })
    }

    // Get all URLs created by this user with click data
    const urls = await db
      .select({
        id: shortenedUrls.id,
        code: shortenedUrls.code,
        customSlug: shortenedUrls.customSlug,
        longUrl: shortenedUrls.longUrl,
        clicks: shortenedUrls.clicks,
        createdAt: shortenedUrls.createdAt,
        userId: shortenedUrls.userId
      })
      .from(shortenedUrls)
      .where(eq(shortenedUrls.userId, decoded.id))
      .orderBy(sql`${shortenedUrls.createdAt} DESC`)

    // For debugging - also get URLs without userId
    const allUrls = await db
      .select({
        id: shortenedUrls.id,
        code: shortenedUrls.code,
        customSlug: shortenedUrls.customSlug,
        longUrl: shortenedUrls.longUrl,
        clicks: shortenedUrls.clicks,
        createdAt: shortenedUrls.createdAt,
        userId: shortenedUrls.userId
      })
      .from(shortenedUrls)
      .orderBy(sql`${shortenedUrls.createdAt} DESC`)

    console.log('User ID:', decoded.id)
    console.log('URLs with userId:', urls.length)
    console.log('All URLs:', allUrls.length)
    console.log('Sample URLs:', allUrls.slice(0, 3))

    // Calculate total clicks
    const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0)

    return {
      urls,
      totalClicks,
      totalUrls: urls.length
    }
  } catch (error: any) {
    if (error.statusCode) throw error
    
    console.error('Analytics fetch failed:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch analytics'
    })
  }
}) 