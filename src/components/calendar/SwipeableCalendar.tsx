'use client'

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo, useReducedMotion } from 'framer-motion'
import { MonthData } from '@/types/rotation'
import { ScheduleList } from '@/components/schedule-list'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface SwipeableCalendarProps {
  months: MonthData[]
  currentIndex: number
  onIndexChange: (index: number) => void
  className?: string
}

// Animation variants for month transitions
const monthVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.95
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1
  },
  exit: (direction: number) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.95
  })
}

// Spring transition configuration
const springTransition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  mass: 0.8
}

// Swipe configuration - Made more sensitive for mobile
const SWIPE_CONFIDENCE_THRESHOLD = 3000
const SWIPE_DISTANCE_THRESHOLD = 30
const SWIPE_VELOCITY_THRESHOLD = 0.2
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * Math.abs(velocity)
}

export function SwipeableCalendar({ 
  months, 
  currentIndex, 
  onIndexChange,
  className = ""
}: SwipeableCalendarProps) {
  const [[page, direction], setPage] = useState([currentIndex, 0])
  const [isDragging, setIsDragging] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  
  // Motion values for drag gesture
  const x = useMotionValue(0)
  
  // Visual transforms based on drag distance
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
  
  // Reset motion value when page changes
  React.useEffect(() => {
    x.set(0)
  }, [currentIndex, x])
  
  // Navigation functions
  const paginate = useCallback((newDirection: number) => {
    const newIndex = currentIndex + newDirection
    
    if (newIndex >= 0 && newIndex < months.length) {
      setPage([newIndex, newDirection])
      onIndexChange(newIndex)
    }
  }, [currentIndex, months.length, onIndexChange])
  
  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      paginate(-1)
    }
  }, [currentIndex, paginate])
  
  const goToNext = useCallback(() => {
    if (currentIndex < months.length - 1) {
      paginate(1)
    }
  }, [currentIndex, months.length, paginate])
  
  // Handle drag end
  const handleDragEnd = useCallback((e: MouseEvent | TouchEvent | PointerEvent, { offset, velocity }: PanInfo) => {
    const swipe = swipePower(offset.x, velocity.x)
    
    console.log('Swipe detection:', {
      offsetX: offset.x,
      velocityX: velocity.x,
      swipePower: swipe,
      currentIndex,
      maxIndex: months.length - 1
    })
    
    // More sensitive swipe detection
    const shouldSwipeLeft = (
      (offset.x < -SWIPE_DISTANCE_THRESHOLD && velocity.x < -SWIPE_VELOCITY_THRESHOLD) ||
      (swipe > SWIPE_CONFIDENCE_THRESHOLD && velocity.x < 0)
    ) && currentIndex < months.length - 1
    
    const shouldSwipeRight = (
      (offset.x > SWIPE_DISTANCE_THRESHOLD && velocity.x > SWIPE_VELOCITY_THRESHOLD) ||
      (swipe > SWIPE_CONFIDENCE_THRESHOLD && velocity.x > 0)
    ) && currentIndex > 0
    
    console.log('Swipe decision:', { shouldSwipeLeft, shouldSwipeRight })
    
    if (shouldSwipeLeft) {
      console.log('Swiping to next month')
      paginate(1)
    } else if (shouldSwipeRight) {
      console.log('Swiping to previous month')
      paginate(-1)
    } else {
      console.log('Swipe not detected - resetting position')
      x.set(0)
    }
    
    setIsDragging(false)
  }, [currentIndex, months.length, paginate, x])
  
  // Simplified animations for reduced motion
  const reducedMotionVariants = {
    enter: { opacity: 0 },
    center: { opacity: 1 },
    exit: { opacity: 0 }
  }
  
  const reducedMotionTransition = {
    duration: 0.2
  }
  
  const isFirstMonth = currentIndex === 0
  const isLastMonth = currentIndex === months.length - 1
  
  return (
    <div className={`relative calendar-swipe-container z-10 ${className}`}>
      {/* Month Navigation Header */}
      <div className="flex items-center justify-between mb-4 px-4 z-20 relative">
        <button
          onClick={goToPrevious}
          disabled={isFirstMonth}
          className={`
            p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg z-30 relative
            transition-all duration-200 touch-none
            ${isFirstMonth 
              ? 'opacity-30 cursor-not-allowed' 
              : 'hover:bg-white hover:scale-110 active:scale-95'
            }
          `}
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
        
        {/* Month Title */}
        <div className="flex-1 text-center z-30 relative">
          <h3 className="text-lg font-semibold text-gray-800">
            {months[currentIndex]?.month} {months[currentIndex]?.year}
          </h3>
        </div>
        
        <button
          onClick={goToNext}
          disabled={isLastMonth}
          className={`
            p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg z-30 relative
            transition-all duration-200 touch-none
            ${isLastMonth 
              ? 'opacity-30 cursor-not-allowed' 
              : 'hover:bg-white hover:scale-110 active:scale-95'
            }
          `}
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>
      </div>
      
      {/* Swipeable Calendar Container */}
      <div className="overflow-hidden relative swipeable-calendar no-select" style={{ touchAction: 'none' }}>
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={page}
            custom={direction}
            variants={shouldReduceMotion ? reducedMotionVariants : monthVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={shouldReduceMotion ? reducedMotionTransition : springTransition}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            dragMomentum={false}
            whileDrag={{ cursor: "grabbing" }}
            onDragStart={() => {
              console.log('Drag started');
              setIsDragging(true);
            }}
            onDragEnd={(e, info) => {
              console.log('Drag ended:', { offset: info.offset, velocity: info.velocity });
              handleDragEnd(e, info);
            }}
            style={{ x }}
            className="w-full cursor-grab active:cursor-grabbing touch-none"
          >
            <motion.div
              style={shouldReduceMotion ? {} : { scale, opacity, rotateY }}
              className="transform-gpu swipeable-calendar-item"
            >
              {months[currentIndex] && (
                <ScheduleList 
                  calendar={[months[currentIndex]]} 
                  isMobile={true}
                  currentMonthIndex={0}
                  totalMonths={1}
                  hideNavigation={true}
                />
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>
        
        {/* Swipe Hint Indicator */}
        <AnimatePresence>
          {isDragging && !shouldReduceMotion && (
            <motion.div
              className="absolute inset-0 pointer-events-none flex items-center justify-center z-50"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-black/20 backdrop-blur-md rounded-full px-6 py-3 shadow-lg">
                <span className="text-sm font-semibold text-white">
                  ← Swipe to navigate →
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Progress Dots */}
      <div className="flex justify-center gap-1.5 mt-4">
        {months.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => {
              const newDirection = index > currentIndex ? 1 : -1
              setPage([index, newDirection])
              onIndexChange(index)
            }}
            className={`
              transition-all duration-200 rounded-full
              ${index === currentIndex 
                ? 'w-8 h-2' 
                : 'w-2 h-2 hover:scale-125'
              }
            `}
            initial={false}
            animate={{
              backgroundColor: index === currentIndex ? '#f97316' : 'rgba(156, 163, 175, 0.5)'
            }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            aria-label={`Go to ${months[index]?.month} ${months[index]?.year}`}
          />
        ))}
      </div>
    </div>
  )
}