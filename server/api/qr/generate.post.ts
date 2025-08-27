import { defineEventHandler, readBody, createError, getCookie } from 'h3'
import { db } from '../../db/database'
import { users, shortenedUrls } from '../../db/schema'
import { eq, and, sql } from 'drizzle-orm'
import jwt from 'jsonwebtoken'
import QRCode from 'qrcode'

export default defineEventHandler(async (event) => {
  const { shortCode } = await readBody(event)
  const token = getCookie(event, 'auth-token')
  
  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'Authentication required'
    })
  }

  if (!shortCode) {
    throw createError({
      statusCode: 400,
      message: 'Short code is required'
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
        message: 'QR code generation requires active premium subscription'
      })
    }

    // Get the shortened URL
    const shortenedUrl = await db
      .select()
      .from(shortenedUrls)
      .where(eq(shortenedUrls.code, shortCode))
      .limit(1)

    if (!shortenedUrl[0]) {
      throw createError({
        statusCode: 404,
        message: 'Shortened URL not found'
      })
    }

    // Generate QR code
    const requestUrl = getRequestURL(event)
    const baseUrl = `${requestUrl.protocol}//${requestUrl.host}`
    const fullShortUrl = `${baseUrl}/s/${shortCode}`
    
    const qrCodeDataUrl = await QRCode.toDataURL(fullShortUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })

    return {
      success: true,
      qrCode: qrCodeDataUrl,
      shortUrl: fullShortUrl
    }
  } catch (error: any) {
    if (error.statusCode) throw error
    
    console.error('QR code generation failed:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to generate QR code'
    })
  }
}) 