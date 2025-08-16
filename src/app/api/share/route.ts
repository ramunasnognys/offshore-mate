import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'
import { nanoid } from 'nanoid'

// Initialize Redis client
const redis = Redis.fromEnv()

// Types for the API
interface ShortenUrlRequest {
  longUrl: string
}

interface ShortenUrlResponse {
  shortUrl: string
  shareId: string
  expiresAt: string
}

interface ShortUrlMapping {
  longUrl: string
  createdAt: string
  expiresAt: string
  scheduleId: string
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: ShortenUrlRequest = await request.json()
    const { longUrl } = body

    // Validate input
    if (!longUrl || typeof longUrl !== 'string') {
      return NextResponse.json(
        { error: 'Invalid or missing longUrl' },
        { status: 400 }
      )
    }

    // Security: Validate URL is from same domain
    // Get the current host and protocol consistently
    const host = request.headers.get('host') || 'localhost:3000'
    const protocol = host.includes('localhost') ? 'http' : 'https'
    const baseUrl = `${protocol}://${host}`

    // Allow URLs from current domain or any Vercel deployment domain
    const isValidDomain = longUrl.startsWith(baseUrl) || 
                         (process.env.VERCEL_URL && longUrl.startsWith(`https://${process.env.VERCEL_URL}`)) ||
                         longUrl.includes('.vercel.app') ||
                         longUrl.includes('offshoremate.com')

    if (!isValidDomain) {
      return NextResponse.json(
        { error: 'Invalid URL domain' },
        { status: 400 }
      )
    }

    // Generate 8-character ID for collision resistance
    const shareId = nanoid(8)
    const key = `share:${shareId}`

    // Calculate expiration (90 days from now)
    const TTL_SECONDS = 90 * 24 * 60 * 60 // 90 days = 7,776,000 seconds
    const expiresAt = new Date(Date.now() + TTL_SECONDS * 1000).toISOString()

    // Create mapping object
    const mapping: ShortUrlMapping = {
      longUrl,
      createdAt: new Date().toISOString(),
      expiresAt,
      scheduleId: longUrl.split('/shared/')[1]?.split('?')[0] || 'unknown'
    }

    // Store in Redis with TTL (Upstash handles JSON serialization automatically)
    console.log(`Storing mapping for key: ${key}`, mapping)
    const setResult = await redis.set(key, mapping, { ex: TTL_SECONDS })
    console.log(`Redis SET result for ${key}:`, setResult)
    
    // Immediately verify the storage by reading it back
    const verifyResult = await redis.get(key)
    console.log(`Redis GET verification for ${key}:`, verifyResult)

    // Generate short URL
    const shortUrl = `${baseUrl}/s/${shareId}`

    // Return response
    const response: ShortenUrlResponse = {
      shortUrl,
      shareId,
      expiresAt
    }

    return NextResponse.json(response, { status: 200 })

  } catch (error) {
    console.error('URL shortening failed:', error)
    
    // Return generic error to avoid leaking implementation details
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}