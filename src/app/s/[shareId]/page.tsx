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
  try {
    const { shareId } = await params
    
    // For debugging - let's add a hard-coded test
    if (shareId === 'testtest') {
      redirect('/shared/test?data=hardcoded_test')
    }

    // Validate shareId format  
    if (!shareId || typeof shareId !== 'string' || shareId.length !== 8 || !/^[A-Za-z0-9_-]{8}$/.test(shareId)) {
      notFound()
      return
    }

    // Initialize Redis and get mapping
    const redis = Redis.fromEnv()
    const key = `share:${shareId}`
    const mapping = await redis.get<ShortUrlMapping>(key)

    if (!mapping?.longUrl) {
      notFound()
      return
    }

    // Redirect to the long URL
    redirect(mapping.longUrl)

  } catch (error) {
    console.error('Redirect error:', error)
    notFound()
  }
}