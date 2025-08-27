import { defineEventHandler, createError, getCookie } from 'h3'
import { db } from '../../db/database'
import { cryptoPayments } from '../../db/schema'
import { bitcoinAddressGenerator } from '../../utils/bitcoin'
import { eq, and } from 'drizzle-orm'
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
    const user = jwt.verify(token, process.env.AUTH_SECRET!) as any
    const userId = user.id

    // Check if user already has a pending payment
    const existingPayment = await db
      .select()
      .from(cryptoPayments)
      .where(and(
        eq(cryptoPayments.userId, userId),
        eq(cryptoPayments.status, 'pending')
      ))
      .limit(1)

    if (existingPayment.length > 0) {
      return {
        success: true,
        payment: existingPayment[0]
      }
    }

    // Generate new Bitcoin address
    const index = await bitcoinAddressGenerator.getNextIndex()
    const bitcoinAddress = bitcoinAddressGenerator.generateAddress(index)

    // Set payment amount (0.001 BTC = ~$40-50 depending on current price)
    const amount = '0.001'

    // Set expiration (30 minutes from now)
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 30)

    // Create payment record
    const payment = await db
      .insert(cryptoPayments)
      .values({
        userId,
        bitcoinAddress,
        amount,
        status: 'pending',
        expiresAt
      })
      .returning()

    return {
      success: true,
      payment: payment[0]
    }
  } catch (error: any) {
    if (error.statusCode) throw error
    
    console.error('Failed to create crypto payment:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to create payment request'
    })
  }
}) 