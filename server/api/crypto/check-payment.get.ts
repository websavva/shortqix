import { defineEventHandler, createError, getQuery } from 'h3'
import { db } from '../../db/database'
import { cryptoPayments, users } from '../../db/schema'
import { bitcoinBalanceChecker } from '../../utils/bitcoin'
import { eq, and, gt } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { paymentId } = query

  if (!paymentId) {
    throw createError({
      statusCode: 400,
      message: 'Payment ID is required'
    })
  }

  try {
    // Get payment record
    const payment = await db
      .select()
      .from(cryptoPayments)
      .where(eq(cryptoPayments.id, parseInt(paymentId as string)))
      .limit(1)

    if (payment.length === 0) {
      throw createError({
        statusCode: 404,
        message: 'Payment not found'
      })
    }

    const paymentRecord = payment[0]

    // Check if payment has expired
    if (new Date() > paymentRecord.expiresAt && paymentRecord.status === 'pending') {
      await db
        .update(cryptoPayments)
        .set({ status: 'expired' })
        .where(eq(cryptoPayments.id, paymentRecord.id))

      return {
        success: true,
        status: 'expired',
        message: 'Payment has expired'
      }
    }

    // If already paid, return the status
    if (paymentRecord.status === 'paid') {
      return {
        success: true,
        status: 'paid',
        message: 'Payment completed'
      }
    }

    // Check Bitcoin address balance
    const balance = await bitcoinBalanceChecker.checkAddressBalance(paymentRecord.bitcoinAddress)
    const requiredAmount = parseFloat(paymentRecord.amount)

    // Check if payment is sufficient
    if (balance.confirmed >= requiredAmount) {
      // Update payment status
      await db
        .update(cryptoPayments)
        .set({ 
          status: 'paid',
          paidAt: new Date()
        })
        .where(eq(cryptoPayments.id, paymentRecord.id))

      // Upgrade user to premium
      const premiumExpiresAt = new Date()
      premiumExpiresAt.setMonth(premiumExpiresAt.getMonth() + 1)

      await db
        .update(users)
        .set({
          isPremium: true,
          premiumExpiresAt
        })
        .where(eq(users.id, paymentRecord.userId))

      return {
        success: true,
        status: 'paid',
        message: 'Payment completed and account upgraded to premium',
        balance: balance.confirmed,
        requiredAmount
      }
    }

    // Return current status
    return {
      success: true,
      status: 'pending',
      message: 'Payment pending',
      balance: balance.confirmed,
      requiredAmount,
      expiresAt: paymentRecord.expiresAt
    }

  } catch (error: any) {
    if (error.statusCode) throw error
    
    console.error('Failed to check payment:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to check payment status'
    })
  }
}) 