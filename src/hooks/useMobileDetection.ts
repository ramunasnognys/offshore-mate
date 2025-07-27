import { useState, useEffect } from 'react'

/**
 * Custom hook for detecting mobile viewport and managing responsive behavior
 * @returns {boolean | null} - true for mobile, false for desktop, null during initialization
 */
export function useMobileDetection(breakpoint: number = 768): boolean | null {
  const [isMobileView, setIsMobileView] = useState<boolean | null>(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < breakpoint)
    }
    
    // Initial check
    checkMobile()
    
    // Add resize listener
    window.addEventListener('resize', checkMobile)
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile)
  }, [breakpoint])

  return isMobileView
}