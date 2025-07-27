import { useState, useCallback } from 'react'
import React from 'react'

interface UseSwipeGestureProps {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  minSwipeDistance?: number
  enabled?: boolean
}

interface UseSwipeGestureReturn {
  handleTouchStart: (e: React.TouchEvent) => void
  handleTouchMove: (e: React.TouchEvent) => void
  handleTouchEnd: () => void
}

/**
 * Custom hook for handling swipe gestures on touch devices
 */
export function useSwipeGesture({
  onSwipeLeft,
  onSwipeRight,
  minSwipeDistance = 50,
  enabled = true
}: UseSwipeGestureProps): UseSwipeGestureReturn {
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!enabled) return
    setTouchEnd(0) // Reset touchEnd
    setTouchStart(e.targetTouches[0].clientX)
  }, [enabled])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!enabled) return
    setTouchEnd(e.targetTouches[0].clientX)
  }, [enabled])

  const handleTouchEnd = useCallback(() => {
    if (!enabled || !touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    
    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0 && onSwipeLeft) {
        // Swipe left
        onSwipeLeft()
      } else if (distance < 0 && onSwipeRight) {
        // Swipe right
        onSwipeRight()
      }
    }
  }, [enabled, touchStart, touchEnd, minSwipeDistance, onSwipeLeft, onSwipeRight])

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  }
}