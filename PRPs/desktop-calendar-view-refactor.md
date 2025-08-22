# PRP: Desktop Calendar View Refactor

## Feature Overview
Implement a progressively enhanced desktop view for the Offshore Mate calendar display featuring a multi-column grid layout for calendar months and a persistent sticky header for primary actions and navigation. The mobile experience must remain unchanged.

## Context & Requirements
Based on the specification in `INITIAL.md`, this refactor addresses the current suboptimal desktop experience where users must scroll through a single-column calendar view. The goal is to provide a desktop-optimized interface while maintaining the existing mobile-first experience.

## Critical Implementation Context

### Existing Codebase Patterns

#### Component Architecture Flow
```
src/app/page.tsx (HomeContent)
  ↓ passes onBack, isStorageAvailable
src/components/calendar/CalendarDisplay.tsx
  ↓ uses useMobileDetection(), passes isMobile prop
src/components/schedule-list.tsx
  ↓ renders calendar based on isMobile prop
```

#### Key Files to Reference
1. **src/components/calendar/CalendarDisplay.tsx** (Lines 43-44, 115-180)
   - Already uses `useMobileDetection()` hook
   - Currently passes `isMobile={isMobileView === true}` to ScheduleList
   - Has existing Back and Today buttons (lines 119-139)

2. **src/components/schedule-list.tsx** (Lines 10-17, 269-296)
   - Already accepts `isMobile` prop
   - Currently renders single month on mobile, all months on desktop
   - Has existing month navigation for mobile

3. **src/components/ui/button.tsx** (Lines 7-35)
   - Provides Button component with variant support
   - Variants: default (black), outline, ghost, secondary
   - Sizes: default, sm, lg, icon

4. **src/components/ui/popover.tsx**
   - Available for Export dropdown implementation
   - Uses Radix UI primitives

5. **src/hooks/useExportCalendar.ts**
   - Provides export functionality and format selection
   - Returns `isDownloading`, `exportFormat`, `handleDownload`

6. **src/hooks/useScheduleManagement.ts**
   - Provides schedule saving functionality
   - Returns `saveSchedule`, `loadSchedule`

### Icon Requirements (from lucide-react)
- ArrowLeft - Back button
- CalendarCheck - Today button
- ChevronLeft/ChevronRight - Year navigation
- Bookmark - Saved Schedules
- Share2 - Share button
- Download - Export button
- Save - Save Schedule
- Loader2 - Loading spinner

### Responsive Breakpoints
- Mobile: < 768px (no changes)
- Tablet (md): 768px - 1023px (2-column grid)
- Desktop (lg): >= 1024px (3-column grid)

## Implementation Blueprint

### Task List (in order)

1. **Create DesktopHeader Component**
   ```typescript
   // src/components/calendar/DesktopHeader.tsx
   interface DesktopHeaderProps {
     onBack: () => void;
     onToday: () => void;
     onSave: () => void;
     onExport: (format: 'png' | 'pdf' | 'ics') => void;
     onShare: () => void;
     onShowSaved: () => void;
     isDownloading: boolean;
     isSaving: boolean;
     currentYear: number;
     onYearChange: (year: number) => void;
     isGeneratingYear?: boolean;
   }
   ```

2. **Modify CalendarDisplay.tsx**
   - Import DesktopHeader component
   - Add year navigation logic
   - Pass required props from page.tsx
   - Implement scroll-to-month with highlight for Today button
   - Handle year regeneration without re-anchoring

3. **Update ScheduleList.tsx**
   - Modify root container for desktop grid layout
   - Add responsive grid classes: `grid md:grid-cols-2 lg:grid-cols-3 gap-8`
   - Conditionally render based on isMobile prop
   - Remove navigation buttons for desktop view

4. **Update page.tsx (HomeContent)**
   - Pass additional props to CalendarDisplay:
     - Export handlers
     - Save handlers
     - Loading states (isDownloading, isSaving)
     - Share functionality

5. **Delete floating-action-menu.tsx**
   - Remove file from src/components/
   - Remove all imports referencing it

### Pseudocode for Key Implementations

#### DesktopHeader Layout
```jsx
<div className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg p-4 border-b">
  <div className="flex justify-between items-center">
    {/* Left Group */}
    <div className="flex gap-2">
      <Button onClick={onBack} variant="outline">
        <ArrowLeft /> Back
      </Button>
      <Button onClick={onToday} variant="outline">
        <CalendarCheck /> Today
      </Button>
    </div>
    
    {/* Center Group */}
    <div className="flex gap-2">
      <Button onClick={prevYear} variant="ghost" size="icon" disabled={isGeneratingYear}>
        <ChevronLeft />
      </Button>
      <Button variant={yearVariant}>{currentYear}</Button>
      <Button onClick={nextYear} variant="ghost" size="icon" disabled={isGeneratingYear}>
        <ChevronRight />
      </Button>
    </div>
    
    {/* Right Group */}
    <div className="flex gap-2">
      <Button onClick={onShowSaved} variant="outline" size="icon">
        <Bookmark />
      </Button>
      <Button onClick={onShare} variant="outline" size="icon">
        <Share2 />
      </Button>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" disabled={isDownloading}>
            {isDownloading ? <Loader2 className="animate-spin" /> : <Download />}
            Export
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          {/* Export format options */}
        </PopoverContent>
      </Popover>
      <Button onClick={onSave} disabled={isSaving}>
        {isSaving ? <Loader2 className="animate-spin" /> : <Save />}
        Save Schedule
      </Button>
    </div>
  </div>
</div>
```

#### Today Button Highlight Implementation
```typescript
const handleTodayClick = () => {
  goToToday();
  
  if (!isMobileView && yearCalendar.length > 0) {
    const monthElement = document.querySelector(
      `[aria-labelledby*="${yearCalendar[currentMonthIndex]?.month}-${yearCalendar[currentMonthIndex]?.year}"]`
    );
    
    if (monthElement) {
      // Scroll with header offset
      const headerHeight = 80; // Approximate sticky header height
      const elementPosition = monthElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Apply temporary highlight
      monthElement.classList.add('ring-2', 'ring-offset-2', 'ring-blue-500');
      monthElement.style.transition = 'opacity 2.5s ease-out';
      
      setTimeout(() => {
        monthElement.classList.remove('ring-2', 'ring-offset-2', 'ring-blue-500');
      }, 2500);
    }
  }
};
```

#### Year Navigation Logic
```typescript
const handleYearChange = (newYear: number) => {
  // Calculate months since original start
  const monthsDiff = (newYear - currentYear) * 12;
  
  // Generate calendar as continuation (not re-anchored)
  const newCalendar = generateRotationCalendar(
    originalStartDate,
    selectedRotation,
    12,
    customRotation,
    monthsDiff // Pass offset to continue pattern
  );
  
  setYearCalendar(newCalendar);
  setCurrentYear(newYear);
};
```

## External Documentation References

### Tailwind CSS Responsive Design
- Grid Layout: https://tailwindcss.com/docs/grid-template-columns
- Responsive Breakpoints: https://tailwindcss.com/docs/responsive-design
- Sticky Positioning: https://tailwindcss.com/docs/position#sticky

### Radix UI Popover
- Documentation: https://www.radix-ui.com/docs/primitives/components/popover
- Already implemented in src/components/ui/popover.tsx

### Lucide React Icons
- Icon Browser: https://lucide.dev/icons/
- All required icons are available and already used in the project

## Error Handling Strategy

1. **Year Navigation Boundaries**
   - Limit year range to ±10 years from current
   - Show toast if generation fails
   - Maintain current view on error

2. **Export Failures**
   - Already handled by useExportCalendar hook
   - Show error dialog with fallback options

3. **Responsive Resize**
   - Reset to current month when switching to mobile
   - Preserve desktop state when switching back

## Validation Gates

```bash
# 1. TypeScript compilation
pnpm build

# 2. Linting
pnpm lint

# 3. Manual Testing Checklist
# Desktop (>= 768px):
# - [ ] Sticky header remains at top during scroll
# - [ ] 2-column grid on tablet (768-1023px)
# - [ ] 3-column grid on desktop (>= 1024px)
# - [ ] Back button resets to generator
# - [ ] Today button scrolls and highlights
# - [ ] Year navigation regenerates correctly
# - [ ] Export dropdown works
# - [ ] Save button shows loading state
# - [ ] All icon buttons are functional

# Mobile (< 768px):
# - [ ] Single month view unchanged
# - [ ] Swipe navigation works
# - [ ] Bottom toolbar present
# - [ ] No desktop header visible

# Responsive:
# - [ ] Resize from desktop to mobile resets to current month
# - [ ] Resize from mobile to desktop shows grid layout

# Code Quality:
# - [ ] floating-action-menu.tsx deleted
# - [ ] No TypeScript errors
# - [ ] No console errors
```

## Gotchas & Important Notes

1. **State Management**
   - CalendarDisplay already receives context from CalendarProvider
   - Don't duplicate state - use existing context values
   - The `isMobileView` check uses strict equality (`=== true` or `=== false`)

2. **Calendar Generation**
   - Year navigation must continue the existing rotation pattern
   - Do NOT re-anchor to January 1st
   - Use the existing `generateRotationCalendar` function

3. **Styling Consistency**
   - Follow existing button styles (rounded-full for primary actions)
   - Use backdrop-blur effects as seen in existing components
   - Maintain the bg-white/80 pattern for translucent backgrounds

4. **Component Cleanup**
   - The floating-action-menu.tsx is obsolete and must be deleted
   - Ensure no imports reference it after deletion

5. **Loading States**
   - Use the Loader2 icon with `animate-spin` class
   - Disable buttons during loading operations
   - Pass loading states from page.tsx through props

## Confidence Score: 9/10

This PRP provides comprehensive context including:
- Complete file references with line numbers
- Existing code patterns to follow
- Clear implementation order
- Pseudocode for complex logic
- External documentation links
- Executable validation gates
- Error handling strategy

The only uncertainty is around the exact year navigation continuation logic, but the approach is clearly defined and can be refined during implementation.