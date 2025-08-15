/**
 * Share utility functions for Offshore Mate calendar sharing
 * Implements WhatsApp, email, Web Share API, and clipboard sharing functionality
 */

import { SavedSchedule } from './storage'

export interface ShareData {
  title: string
  text: string
  url: string
  dateRange: string
  rotationPattern: string
}

/**
 * Compress calendar data for URL sharing
 */
export const compressCalendarData = (schedule: SavedSchedule): string => {
  try {
    // Create a minimal representation of the calendar data
    const compressed = {
      m: schedule.metadata,
      c: schedule.calendar.map(month => ({
        m: month.month,
        y: month.year,
        d: month.days.map(day => ({
          dt: day.date.toISOString().split('T')[0], // Just the date part
          w: day.isWorkDay,
          r: day.isInRotation,
          t: day.isTransitionDay || undefined // Only include if true
        }))
      }))
    }
    
    // Convert to JSON and encode
    const jsonString = JSON.stringify(compressed)
    return btoa(encodeURIComponent(jsonString))
  } catch (error) {
    console.error('Error compressing calendar data:', error)
    throw new Error('Failed to compress calendar data')
  }
}

/**
 * Decompress calendar data from URL
 */
export const decompressCalendarData = (encodedData: string): SavedSchedule => {
  try {
    const jsonString = decodeURIComponent(atob(encodedData))
    const compressed = JSON.parse(jsonString)
    
    // Reconstruct the full schedule object
    const schedule: SavedSchedule = {
      metadata: compressed.m,
      calendar: compressed.c.map((month: { m: string; y: number; d: Array<{ dt: string; w: boolean; r: boolean; t?: boolean }> }) => ({
        month: month.m,
        year: month.y,
        days: month.d.map((day: { dt: string; w: boolean; r: boolean; t?: boolean }) => ({
          date: new Date(day.dt),
          isWorkDay: day.w,
          isInRotation: day.r,
          isTransitionDay: day.t || false
        }))
      }))
    }
    
    return schedule
  } catch (error) {
    console.error('Error decompressing calendar data:', error)
    throw new Error('Failed to decompress calendar data')
  }
}

/**
 * Check if calendar data can fit in URL (under 2000 characters)
 */
export const canDataFitInUrl = (schedule: SavedSchedule): boolean => {
  try {
    const compressed = compressCalendarData(schedule)
    const testUrl = `${window.location.origin}/shared/test?data=${compressed}`
    return testUrl.length < 2000
  } catch {
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
 */
export const generateShareUrl = (scheduleId: string, schedule?: SavedSchedule): string => {
  if (typeof window === 'undefined') return ''
  const baseUrl = window.location.origin
  
  // If schedule data is provided, try to encode it in the URL
  if (schedule && canDataFitInUrl(schedule)) {
    try {
      const encodedData = compressCalendarData(schedule)
      return `${baseUrl}/shared/${scheduleId}?data=${encodedData}`
    } catch (error) {
      console.error('Failed to encode calendar data in URL:', error)
      // Fall back to original URL without data
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