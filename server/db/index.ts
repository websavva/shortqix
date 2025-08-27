import { db } from './database'
import { shortenedUrls } from './schema'
import { eq, sql } from 'drizzle-orm'

// Initialize database connection
export async function initializeDatabase() {
  try {
    // Test the connection
    await db.select().from(shortenedUrls).limit(1)
    console.log('✅ Database connection established')
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    throw error
  }
}

// Get shortened URL by code
export async function getShortenedUrlByCode(code: string) {
  const result = await db
    .select()
    .from(shortenedUrls)
    .where(eq(shortenedUrls.code, code))
    .limit(1)
  
  return result[0] || null
}

// Create new shortened URL
export async function createShortenedUrl(data: { code: string; longUrl: string; customSlug?: string | null; userId?: number }) {
  const result = await db
    .insert(shortenedUrls)
    .values(data)
    .returning()
  
  return result[0]
}

// Update click count
export async function updateClickCount(id: number) {
  const result = await db
    .update(shortenedUrls)
    .set({ clicks: sql`${shortenedUrls.clicks} + 1` })
    .where(eq(shortenedUrls.id, id))
    .returning()
  
  return result[0]
}

// Close database connection
export async function closeDatabase() {
  // Drizzle handles connection cleanup automatically
  console.log('Database connection closed')
}
