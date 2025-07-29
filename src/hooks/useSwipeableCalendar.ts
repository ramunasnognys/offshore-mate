import { useState, useCallback, useEffect } from 'react'
import { useMotionValue, useVelocity, useTransform, MotionValue } from 'framer-motion'

interface UseSwipeableCalendarProps {
  totalMonths: number
  initialIndex?: number
  onIndexChange?: (index: number) => void
}

interface UseSwipeableCalendarReturn {
  currentIndex: number
  direction: number
  x: MotionValue<number>
  velocity: MotionValue<number>
  scale: MotionValue<number>
  opacity: MotionValue<number>
  rotateY: MotionValue<number>
  isDragging: boolean
  isAnimating: boolean
  canGoPrevious: boolean
  canGoNext: boolean
  goToPrevious: () => void
  goToNext: () => void
  goToIndex: (index: number) => void
  handleDragStart: () => void
  handleDragEnd: (offset: number, velocity: number) => void
}

/**
 * Custom hook for managing swipeable calendar state and animations
 */
export function useSwipeableCalendar({
  totalMonths,
  initialIndex = 0,
  onIndexChange
}: UseSwipeableCalendarProps): UseSwipeableCalendarReturn {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [direction, setDirection] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  
  // Motion values
  const x = useMotionValue(0)
  const velocity = useVelocity(x)
  
  // Visual transforms
  const scale = useTransform(
    x,
    [-300, 0, 300],
    [0.85, 1, 0.85]
  )
  
  const opacity = useTransform(
    x,
    [-300, 0, 300],
    [0.5, 1, 0.5]
  )
  
  const rotateY = useTransform(
    x,
    [-300, 0, 300],
    [-10, 0, 10]
  )
  
  // Navigation state
  const canGoPrevious = currentIndex > 0
  const canGoNext = currentIndex < totalMonths - 1
  
  // Navigation functions
  const goToIndex = useCallback((index: number) => {
    if (index >= 0 && index < totalMonths && index !== currentIndex) {
      const newDirection = index > currentIndex ? 1 : -1
      setDirection(newDirection)
      setCurrentIndex(index)
      setIsAnimating(true)
      onIndexChange?.(index)
      
      // Reset animation state after transition
      setTimeout(() => {
        setIsAnimating(false)
      }, 500)
    }
  }, [currentIndex, totalMonths, onIndexChange])
  
  const goToPrevious = useCallback(() => {
    if (canGoPrevious) {
      goToIndex(currentIndex - 1)
    }
  }, [canGoPrevious, currentIndex, goToIndex])
  
  const goToNext = useCallback(() => {
    if (canGoNext) {
      goToIndex(currentIndex + 1)
    }
  }, [canGoNext, currentIndex, goToIndex])
  
  // Drag handlers
  const handleDragStart = useCallback(() => {
    setIsDragging(true)
  }, [])
  
  const handleDragEnd = useCallback((offset: number, velocity: number) => {
    setIsDragging(false)
    
    // Calculate swipe power
    const swipePower = Math.abs(offset) * velocity
    const swipeThreshold = 10000
    
    if (swipePower > swipeThreshold) {
      if (offset > 0 && canGoPrevious) {
        goToPrevious()
      } else if (offset < 0 && canGoNext) {
        goToNext()
      }
    }
    
    // Reset x position
    x.set(0)
  }, [canGoPrevious, canGoNext, goToPrevious, goToNext, x])
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnimating) return
      
      switch (e.key) {
        case 'ArrowLeft':
          goToPrevious()
          break
        case 'ArrowRight':
          goToNext()
          break
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goToPrevious, goToNext, isAnimating])
  
  // Gesture hints
  useEffect(() => {
    // Show swipe hint on first load
    const hasSeenHint = localStorage.getItem('calendar-swipe-hint-seen')
    if (!hasSeenHint && totalMonths > 1) {
      // Animate a subtle hint after 2 seconds
      const timer = setTimeout(() => {
        x.set(-30)
        setTimeout(() => x.set(0), 300)
        localStorage.setItem('calendar-swipe-hint-seen', 'true')
      }, 2000)
      
      return () => clearTimeout(timer)
    }
  }, [x, totalMonths])
  
  return {
    currentIndex,
    direction,
    x,
    velocity,
    scale,
    opacity,
    rotateY,
    isDragging,
    isAnimating,
    canGoPrevious,
    canGoNext,
    goToPrevious,
    goToNext,
    goToIndex,
    handleDragStart,
    handleDragEnd
  }
}