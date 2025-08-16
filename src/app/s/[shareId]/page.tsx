import { redirect, notFound } from 'next/navigation'
import { Redis } from '@upstash/redis'

// Types
interface ShortUrlMapping {
  longUrl: string
  createdAt: string
  expiresAt: string
  scheduleId: string
}

interface ShortUrlRedirectProps {
  params: Promise<{ shareId: string }>
}

// Generate static params to help Next.js recognize this as a dynamic route
export async function generateStaticParams() {
  // Return empty array since we don't want to pre-generate any pages
  // This just helps Next.js understand this is a dynamic route
  return []
}

export default async function ShortUrlRedirect({ params }: ShortUrlRedirectProps) {
  const { shareId } = await params
  
  // Validate shareId format first to avoid unnecessary database lookups
  if (!shareId || typeof shareId !== 'string' || shareId.length !== 8 || !/^[A-Za-z0-9_-]{8}$/.test(shareId)) {
    return notFound()
  }

  let mapping: ShortUrlMapping | null = null

  try {
    // Only wrap Redis operations in try-catch
    const redis = Redis.fromEnv()
    const key = `share:${shareId}`
    mapping = await redis.get<ShortUrlMapping>(key)
  } catch (error) {
    // This will catch actual Redis connection errors, etc.
    console.error('Error fetching share link from Redis:', error)
    return notFound()
  }

  if (!mapping?.longUrl) {
    return notFound()
  }

  // Now call redirect outside of the try...catch block
  redirect(mapping.longUrl)
}