import { defineEventHandler, readBody, createError, getRequestURL } from 'h3'
import { db } from '../../db/database'
import { users, magicLinks } from '../../db/schema'
import { eq, and, gt } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { sendMagicLinkEmail } from '../../utils/email'

export default defineEventHandler(async (event) => {
  const { email } = await readBody(event)
  
  if (!email) {
    throw createError({
      statusCode: 400,
      message: 'Email is required'
    })
  }

  try {
    // Check if user exists, create if not
    let user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    if (!user[0]) {
      // Create new user
      const newUser = await db
        .insert(users)
        .values({
          email,
          isVerified: false
        })
        .returning()
      user = newUser
    }

    // Generate magic link token
    const token = nanoid(32)
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

    // Save magic link to database
    await db
      .insert(magicLinks)
      .values({
        email,
        token,
        expiresAt,
        used: false
      })

    // Get base URL for magic link
    const requestUrl = getRequestURL(event)
    const baseUrl = `${requestUrl.protocol}//${requestUrl.host}`

    // Send magic link email
    const emailResult = await sendMagicLinkEmail(email, token, baseUrl)
    
    if (!emailResult.success) {
      throw createError({
        statusCode: 500,
        message: 'Failed to send magic link email'
      })
    }

    return {
      message: 'Magic link sent to your email',
      email
    }
  } catch (error: any) {
    if (error.statusCode) throw error
    
    console.error('Magic link error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to send magic link'
    })
  }
}) 