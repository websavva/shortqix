import { defineEventHandler, getRouterParam, createError, sendRedirect } from 'h3'
import { getShortenedUrlByCode, updateClickCount } from '../../db'

export default defineEventHandler(async (event) => {
  const code = getRouterParam(event, 'code')
  
  if (!code) {
    throw createError({
      statusCode: 400,
      message: 'Code parameter is required'
    })
  }

  try {
    // Find URL
    const shortenedUrl = await getShortenedUrlByCode(code)
    
    if (!shortenedUrl) {
      throw createError({
        statusCode: 404,
        message: 'URL not found'
      })
    }

    // Update click count
    await updateClickCount(shortenedUrl.id)

    return sendRedirect(event, shortenedUrl.longUrl)
  } catch (error: any) {
    if (error.statusCode === 404) throw error
    
    console.error('Failed to process redirect:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to process redirect'
    })
  }
}) 