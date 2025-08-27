import { defineEventHandler, getQuery, createError, setCookie, sendRedirect } from 'h3'
import { db } from '../../db/database'
import { users, magicLinks } from '../../db/schema'
import { eq, and, gt } from 'drizzle-orm'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const { token } = getQuery(event)
  
  if (!token || typeof token !== 'string') {
    throw createError({
      statusCode: 400,
      message: 'Invalid token'
    })
  }

  try {
    // Find and validate magic link
    const magicLink = await db
      .select()
      .from(magicLinks)
      .where(
        and(
          eq(magicLinks.token, token),
          eq(magicLinks.used, false),
          gt(magicLinks.expiresAt, new Date())
        )
      )
      .limit(1)

    if (!magicLink[0]) {
      throw createError({
        statusCode: 400,
        message: 'Invalid or expired token'
      })
    }

    // Mark magic link as used
    await db
      .update(magicLinks)
      .set({ used: true })
      .where(eq(magicLinks.id, magicLink[0].id))

    // Get or create user
    let user = await db
      .select()
      .from(users)
      .where(eq(users.email, magicLink[0].email))
      .limit(1)

    if (!user[0]) {
      throw createError({
        statusCode: 404,
        message: 'User not found'
      })
    }

    // Update user as verified
    if (!user[0].isVerified) {
      await db
        .update(users)
        .set({ isVerified: true })
        .where(eq(users.id, user[0].id))
      user[0].isVerified = true
    }

    // Create JWT token
    const jwtToken = jwt.sign(
      { 
        id: user[0].id, 
        email: user[0].email
      },
      process.env.AUTH_SECRET!,
      { expiresIn: '7d' }
    )

    // Set HTTP-only cookie
    setCookie(event, 'auth-token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    // Redirect to home page
    return sendRedirect(event, '/')
  } catch (error: any) {
    if (error.statusCode) throw error
    
    console.error('Verification error:', error)
    throw createError({
      statusCode: 500,
      message: 'Verification failed'
    })
  }
}) 