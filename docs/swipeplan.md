# Calendar Swipe Feature Development Plan with Framer Motion

## Project Overview
Implement a smooth, gesture-based calendar navigation system for mobile devices using Framer Motion's powerful animation and gesture APIs, with optional react-swipeable integration for enhanced touch support.

## Technology Stack
- **Framer Motion** (v11.11.11 - already installed) - Primary animation and gesture library
- **react-swipeable** (optional) - Additional touch gesture support if needed
- **React 19 RC** - Existing framework
- **Next.js 15** - Existing framework with Turbopack

## Development Tasks

### 1. Setup & Architecture Phase
- [ ] Evaluate Framer Motion's drag/pan gestures for calendar swipe
- [ ] Test gesture performance on mobile devices
- [ ] Decide if react-swipeable is needed for additional support
- [ ] Create component architecture diagram
- [ ] Define animation specifications and timing curves

### 2. Core Framer Motion Implementation

#### 2.1 Create SwipeableCalendar Component
- [ ] Create new `SwipeableCalendar.tsx` component
- [ ] Wrap calendar months in `motion.div` components
- [ ] Set up `AnimatePresence` for smooth month transitions
- [ ] Configure `MotionConfig` for consistent animations
- [ ] Implement component props interface with TypeScript

#### 2.2 Implement Gesture System
- [ ] Add `drag="x"` prop for horizontal-only swiping
- [ ] Configure `dragConstraints` for swipe boundaries
- [ ] Implement `dragElastic={0.2}` for rubber-band effect
- [ ] Set up `onDragEnd` handler for navigation logic
- [ ] Use `useMotionValue(0)` for tracking x position
- [ ] Implement `useTransform` for visual effects during swipe

#### 2.3 Animation Variants
```typescript
// Define animation variants
const swipeVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
}

// Spring configuration
const transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  mass: 0.8
}
```

### 3. Enhanced Gesture Features

#### 3.1 Velocity-Based Navigation
- [ ] Import and use `useVelocity` from Framer Motion
- [ ] Calculate swipe velocity threshold (500px/s)
- [ ] Implement quick swipe detection
- [ ] Add momentum-based animations
- [ ] Create velocity-aware navigation logic

#### 3.2 Visual Feedback System
- [ ] Create swipe progress indicator with `motion.div`
- [ ] Use `useSpring` for smooth indicator animations
- [ ] Implement scale transform during swipe (0.85 - 1.0)
- [ ] Add opacity changes based on swipe distance
- [ ] Create shadow effects with `boxShadow` transforms

#### 3.3 Advanced Interactions
- [ ] Implement double-tap to return to today
- [ ] Add haptic feedback trigger points (iOS)
- [ ] Create swipe hints on first load
- [ ] Add gesture tutorial overlay option
- [ ] Implement gesture memory with localStorage

### 4. Component Integration

#### 4.1 Update CalendarDisplay Component
- [ ] Replace current swipe handlers with Framer Motion
- [ ] Integrate motion values with `useMonthNavigation`
- [ ] Add gesture state management
- [ ] Connect progress indicators to swipe progress
- [ ] Implement preloading for adjacent months

#### 4.2 Enhance Progress Indicators
- [ ] Convert dots to `motion.div` elements
- [ ] Link dot animations to swipe progress
- [ ] Add spring animations for dot selection
- [ ] Implement smooth width transitions
- [ ] Add interactive dot navigation

### 5. Performance Optimization

#### 5.1 Animation Performance
- [ ] Use `layout` prop for optimized repositioning
- [ ] Implement `LayoutGroup` for coordinated animations
- [ ] Add `initial={false}` to prevent initial animations
- [ ] Set `willChange: "transform"` for GPU acceleration
- [ ] Use `useReducedMotion` hook for accessibility

#### 5.2 Render Optimization
- [ ] Configure `AnimatePresence` with `mode="wait"`
- [ ] Implement proper `exitBeforeEnter` behavior
- [ ] Add React.memo to motion components
- [ ] Optimize re-renders with `useMemo`
- [ ] Implement virtual scrolling for year view

### 6. Optional react-swipeable Integration

If additional touch support is needed:

```typescript
import { useSwipeable } from 'react-swipeable'

const swipeHandlers = useSwipeable({
  onSwipedLeft: () => navigateMonth('next'),
  onSwipedRight: () => navigateMonth('prev'),
  onSwiping: (eventData) => updateSwipeProgress(eventData),
  preventDefaultTouchmoveEvent: true,
  trackMouse: true,
  delta: 50,
  swipeDuration: 500,
  velocity: 0.5
})
```

### 7. Mobile-Specific Enhancements

#### 7.1 Touch Optimizations
- [ ] Add `touch-action: pan-y` CSS for proper touch handling
- [ ] Implement iOS elastic scrolling compatibility
- [ ] Handle Android back gesture conflicts
- [ ] Add pull-to-refresh prevention
- [ ] Optimize for 60fps on mobile devices

#### 7.2 Responsive Animations
- [ ] Create device-specific animation configs
- [ ] Adjust spring stiffness for different screen sizes
- [ ] Implement breakpoint-based gesture thresholds
- [ ] Add tablet-specific swipe behaviors
- [ ] Test on various viewport sizes

### 8. Testing Implementation

#### 8.1 Unit Tests
- [ ] Test motion value calculations
- [ ] Test velocity threshold logic
- [ ] Test boundary constraints
- [ ] Test animation state management
- [ ] Mock Framer Motion for unit tests

#### 8.2 E2E Tests with Playwright
- [ ] Create swipe navigation test suite
- [ ] Test gesture cancellation scenarios
- [ ] Test rapid swipe sequences
- [ ] Test boundary behavior
- [ ] Test accessibility with keyboard navigation

### 9. Accessibility Features
- [ ] Implement keyboard navigation alternatives
- [ ] Add ARIA live regions for month changes
- [ ] Create screen reader announcements
- [ ] Ensure focus management during transitions
- [ ] Add skip links for gesture navigation

### 10. Documentation & Deployment
- [ ] Document SwipeableCalendar API
- [ ] Create gesture behavior diagrams
- [ ] Write migration guide from current implementation
- [ ] Update CLAUDE.md with Framer Motion patterns
- [ ] Create performance benchmarks

## Implementation Example

```typescript
// SwipeableCalendar.tsx
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import { useState } from 'react'

interface SwipeableCalendarProps {
  months: MonthData[]
  currentIndex: number
  onNavigate: (direction: 'prev' | 'next') => void
}

export function SwipeableCalendar({ months, currentIndex, onNavigate }: SwipeableCalendarProps) {
  const [isDragging, setIsDragging] = useState(false)
  const x = useMotionValue(0)
  
  // Visual transforms based on drag distance
  const scale = useTransform(x, [-200, 0, 200], [0.85, 1, 0.85])
  const opacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5])
  const rotateY = useTransform(x, [-200, 0, 200], [-15, 0, 15])
  
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 100
    const velocityThreshold = 500
    
    if (Math.abs(info.velocity.x) > velocityThreshold || Math.abs(info.offset.x) > swipeThreshold) {
      const direction = info.offset.x > 0 ? 'prev' : 'next'
      onNavigate(direction)
    }
    
    setIsDragging(false)
  }
  
  return (
    <div className="relative overflow-hidden">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={currentIndex}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          style={{ x }}
          animate={{ x: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
          className="w-full"
        >
          <motion.div
            style={{ scale, opacity, rotateY }}
            className="transform-gpu"
          >
            <CalendarMonth month={months[currentIndex]} />
          </motion.div>
        </motion.div>
      </AnimatePresence>
      
      {/* Swipe hint indicator */}
      {isDragging && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <SwipeHint direction={x.get() > 0 ? 'prev' : 'next'} />
        </motion.div>
      )}
    </div>
  )
}
```

## Dependencies to Install (if needed)
```bash
# Only if additional touch support is required
npm install react-swipeable@^7.0.1
```

## Performance Targets
- **Frame Rate**: Maintain 60fps during all animations
- **Gesture Response**: < 16ms touch response time
- **Animation Duration**: 300-400ms for month transitions
- **Memory Usage**: < 10MB additional overhead
- **Battery Impact**: Minimal with GPU acceleration

## Success Criteria
- Smooth, native-feeling swipe gestures
- Consistent 60fps performance on all devices
- Intuitive gesture discovery for users
- Full accessibility compliance
- Positive user feedback on mobile UX
- Zero regression in existing functionality

## Timeline Estimate
- Setup & Architecture: 0.5 days
- Core Framer Motion Implementation: 2 days
- Enhanced Features & Integration: 2 days
- Testing & Optimization: 1.5 days
- Documentation & Polish: 1 day
- **Total: 7 days**

## Notes
- Framer Motion's built-in gestures should be sufficient for most use cases
- Only add react-swipeable if specific touch handling issues arise
- Focus on performance and native feel over complex animations
- Ensure all animations respect prefers-reduced-motion