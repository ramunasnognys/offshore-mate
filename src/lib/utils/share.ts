/**
 * Share utility functions for Offshore Mate calendar sharing
 * Implements WhatsApp, email, Web Share API, and clipboard sharing functionality
 */

export interface ShareData {
  title: string
  text: string
  url: string
  dateRange: string
  rotationPattern: string
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
export const generateShareUrl = (scheduleId: string): string => {
  if (typeof window === 'undefined') return ''
  const baseUrl = window.location.origin
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