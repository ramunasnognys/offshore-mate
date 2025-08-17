/**
 * Share utility functions for Offshore Mate calendar sharing
 * Implements WhatsApp, email, Web Share API, and clipboard sharing functionality
 */

import pako from 'pako'
import { SavedSchedule } from './storage'

export interface ShareData {
  title: string
  text: string
  url: string
  dateRange: string
  rotationPattern: string
}

// Types for URL shortening API
interface ShortenUrlRequest {
  longUrl: string
}

interface ShortenUrlResponse {
  shortUrl: string
  shareId: string
  expiresAt: string
}

// Helper to convert Uint8Array to URL-safe Base64
const toUrlSafeBase64 = (arr: Uint8Array): string => {
  const base64 = btoa(String.fromCharCode.apply(null, Array.from(arr)))
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

// Helper to convert URL-safe Base64 to Uint8Array
const fromUrlSafeBase64 = (str: string): Uint8Array => {
  // Convert URL-safe back to standard Base64
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  // Add padding if needed
  while (base64.length % 4) {
    base64 += '='
  }
  return new Uint8Array(atob(base64).split('').map(c => c.charCodeAt(0)))
}

/**
 * Compress calendar data using pako (zlib) for dramatically smaller URLs
 */
export const compressCalendarData = (schedule: SavedSchedule): string => {
  try {
    // Create a minimal representation of the calendar data
    const compressed = {
      m: schedule.metadata,
      c: schedule.calendar.map(month => ({
        m: month.month,
        y: month.year,
        f: month.firstDayOfWeek,
        d: month.days.map(day => {
          // Safely handle date conversion
          let dateString: string
          try {
            if (day.date instanceof Date) {
              // Use local date formatting to avoid timezone shift
              const year = day.date.getFullYear()
              const month = String(day.date.getMonth() + 1).padStart(2, '0')
              const dayOfMonth = String(day.date.getDate()).padStart(2, '0')
              dateString = `${year}-${month}-${dayOfMonth}`
            } else if (typeof day.date === 'string') {
              // Parse string date in local timezone and reformat
              const parsedDate = new Date(day.date)
              const year = parsedDate.getFullYear()
              const month = String(parsedDate.getMonth() + 1).padStart(2, '0')
              const dayOfMonth = String(parsedDate.getDate()).padStart(2, '0')
              dateString = `${year}-${month}-${dayOfMonth}`
            } else {
              throw new Error('Invalid date format')
            }
          } catch (dateError) {
            console.error('Invalid date in calendar data:', day.date, dateError)
            // Use a fallback date or skip this day
            dateString = new Date().toISOString().split('T')[0]
          }
          
          return {
            dt: dateString,
            w: day.isWorkDay,
            r: day.isInRotation,
            t: day.isTransitionDay || undefined // Only include if true
          }
        })
      }))
    }
    
    // Convert to JSON, compress with pako, and encode as URL-safe Base64
    const jsonString = JSON.stringify(compressed)
    const deflated = pako.deflate(jsonString)
    return toUrlSafeBase64(deflated)
  } catch (error) {
    console.error('Error compressing calendar data:', error)
    throw new Error('Failed to compress calendar data')
  }
}

/**
 * Decompress calendar data from URL using pako (zlib) decompression
 */
export const decompressCalendarData = (encodedData: string): SavedSchedule => {
  try {
    // Decode from URL-safe Base64 and decompress with pako
    const compressed = fromUrlSafeBase64(encodedData)
    const jsonString = pako.inflate(compressed, { to: 'string' })
    const decompressed = JSON.parse(jsonString)
    
    // Reconstruct the full schedule object
    const schedule: SavedSchedule = {
      metadata: decompressed.m,
      calendar: decompressed.c.map((month: { m: string; y: number; f?: number; d: Array<{ dt: string; w: boolean; r: boolean; t?: boolean }> }) => {
        // Calculate firstDayOfWeek from the first day if not provided (backward compatibility)
        let firstDayOfWeek = month.f
        if (firstDayOfWeek === undefined && month.d.length > 0) {
          try {
            // Parse date in local timezone to avoid timezone shift issues
            const [year, monthNum, day] = month.d[0].dt.split('-').map(Number)
            const firstDate = new Date(year, monthNum - 1, day)
            const jsDay = firstDate.getDay() // JavaScript format: 0=Sunday, 1=Monday, etc.
            // Convert to Monday-based format: 1=Monday, 2=Tuesday, ..., 7=Sunday
            firstDayOfWeek = jsDay === 0 ? 7 : jsDay
          } catch (error) {
            console.error('Error calculating firstDayOfWeek from first date:', error)
            firstDayOfWeek = 1 // Default to Monday
          }
        }
        
        return {
          month: month.m,
          year: month.y,
          firstDayOfWeek: firstDayOfWeek || 1,
          days: month.d.map((day: { dt: string; w: boolean; r: boolean; t?: boolean }) => {
          // Ensure we have a valid date string and convert it properly in local timezone
          let dateObj: Date
          try {
            // Parse date in local timezone to avoid timezone shift issues
            const [year, monthNum, dayNum] = day.dt.split('-').map(Number)
            dateObj = new Date(year, monthNum - 1, dayNum)
            // Validate the date is actually valid
            if (isNaN(dateObj.getTime())) {
              throw new Error('Invalid date')
            }
          } catch (dateError) {
            console.error('Invalid date in compressed data:', day.dt, dateError)
            // Use a fallback date
            dateObj = new Date()
          }
          
          return {
            date: dateObj,
            isWorkDay: day.w,
            isInRotation: day.r,
            isTransitionDay: day.t || false
          }
          })
        }
      })
    }
    
    return schedule
  } catch (error) {
    console.error('Error decompressing calendar data:', error)
    throw new Error('Failed to decompress calendar data')
  }
}

/**
 * Check if calendar data can fit in URL (under 2000 characters)
 * With pako compression, this is rarely an issue, but kept for backwards compatibility
 */
export const canDataFitInUrl = (schedule: SavedSchedule): boolean => {
  try {
    // Validate schedule structure first
    if (!schedule || !schedule.calendar || !Array.isArray(schedule.calendar)) {
      console.warn('Invalid schedule structure for URL encoding')
      return false
    }
    
    const compressed = compressCalendarData(schedule)
    const testUrl = `${window.location.origin}/shared/test?data=${compressed}`
    return testUrl.length < 2000
  } catch (error) {
    console.error('Error checking if data fits in URL:', error)
    return false
  }
}

/**
 * Detect mobile device for platform-specific URLs
 */
export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
}

/**
 * Generate share URL with calendar data
 * With pako compression, calendar data almost always fits in URL
 */
export const generateShareUrl = (scheduleId: string, schedule?: SavedSchedule): string => {
  if (typeof window === 'undefined') return ''
  const baseUrl = window.location.origin
  
  // If schedule data is provided, always try to encode it in the URL
  if (schedule) {
    try {
      const encodedData = compressCalendarData(schedule)
      return `${baseUrl}/shared/${scheduleId}?data=${encodedData}`
    } catch (error) {
      console.error('Failed to encode calendar data in URL:', error)
      // Fall back to URL without data - but this will likely fail for new users
      console.warn('Falling back to URL without data - new users may not be able to view this calendar')
    }
  }
  
  return `${baseUrl}/shared/${scheduleId}`
}

/**
 * Share via WhatsApp with platform-specific URL schemes
 */
export const shareViaWhatsApp = (data: ShareData): void => {
  const message = `📅 ${data.title}\n\n${data.text}\n\nView calendar: ${data.url}`
  const encodedMessage = encodeURIComponent(message)
  
  const whatsappUrl = isMobile() 
    ? `whatsapp://send?text=${encodedMessage}`
    : `https://api.whatsapp.com/send?text=${encodedMessage}`
  
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
}

/**
 * Share via email client using mailto scheme
 */
export const shareViaEmail = (data: ShareData): void => {
  const subject = encodeURIComponent(data.title)
  const body = encodeURIComponent(
    `${data.text}\n\nClick here to view the calendar:\n${data.url}\n\n` +
    `Period: ${data.dateRange}\nRotation: ${data.rotationPattern}`
  )
  
  window.location.href = `mailto:?subject=${subject}&body=${body}`
}

/**
 * Share using Web Share API with graceful fallback
 */
export const shareNative = async (data: ShareData): Promise<boolean> => {
  if (!navigator.share) {
    return false
  }

  try {
    await navigator.share({
      title: data.title,
      text: data.text,
      url: data.url
    })
    return true
  } catch (err) {
    // User cancelled sharing or error occurred
    if ((err as Error).name !== 'AbortError') {
      console.error('Native share failed:', err)
    }
    return false
  }
}

/**
 * Copy text to clipboard with fallback for older browsers
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  if (typeof window === 'undefined') return false

  try {
    // Modern clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch (error) {
    console.error('Clipboard API failed:', error)
  }

  // Fallback for older browsers
  try {
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    
    const success = document.execCommand('copy')
    document.body.removeChild(textArea)
    return success
  } catch (error) {
    console.error('Fallback copy failed:', error)
    return false
  }
}

/**
 * Check if Web Share API is supported
 */
export const isNativeShareSupported = (): boolean => {
  if (typeof window === 'undefined') return false
  return navigator.share !== undefined
}

/**
 * Shorten a long URL using the URL shortening API
 * Falls back to the original URL if shortening fails
 */
export const shortenUrl = async (longUrl: string): Promise<{ shortUrl: string; shareId?: string }> => {
  try {
    // Validate input
    if (!longUrl || typeof longUrl !== 'string') {
      throw new Error('Invalid URL provided')
    }

    // Make API call to shorten URL
    const response = await fetch('/api/share', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ longUrl } as ShortenUrlRequest),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`API error: ${response.status} - ${errorData.error || 'Unknown error'}`)
    }

    const result: ShortenUrlResponse = await response.json()
    
    // Validate response
    if (!result.shortUrl) {
      throw new Error('Invalid API response: missing shortUrl')
    }

    return {
      shortUrl: result.shortUrl,
      shareId: result.shareId
    }

  } catch (error) {
    console.error('URL shortening failed:', error)
    
    // Graceful fallback to original URL
    return {
      shortUrl: longUrl
    }
  }
}

/**
 * Generate share URL with optional shortening
 * This function maintains backwards compatibility while adding shortening capability
 */
export const generateShareUrlWithShortening = async (
  scheduleId: string, 
  schedule?: SavedSchedule,
  useShortening: boolean = true
): Promise<string> => {
  // Generate the long URL first (existing functionality)
  const longUrl = generateShareUrl(scheduleId, schedule)
  
  // If shortening is disabled or we're on server side, return long URL
  if (!useShortening || typeof window === 'undefined') {
    return longUrl
  }

  // Attempt to shorten the URL
  try {
    const result = await shortenUrl(longUrl)
    return result.shortUrl
  } catch (error) {
    console.error('Failed to shorten URL, using long URL:', error)
    return longUrl
  }
}

/**
 * Validate share data before sharing
 */
export const validateShareData = (data: Partial<ShareData>): data is ShareData => {
  return !!(
    data.title?.trim() &&
    data.text?.trim() &&
    data.url?.trim() &&
    data.dateRange?.trim() &&
    data.rotationPattern?.trim()
  )
}