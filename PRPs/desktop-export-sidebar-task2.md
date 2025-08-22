# PRP: Task 2 - Responsive Layout and Sidebar Integration

## Feature Overview
Modify the main page layout to implement a two-column grid on desktop screens, integrating the new `DesktopSidebar` component for desktop users while maintaining the existing `BottomToolbar` for mobile users. This creates a responsive split between desktop and mobile UIs.

## Current State Analysis

### Existing Components
1. **DesktopSidebar** (`src/components/desktop/DesktopSidebar.tsx`)
   - Already created in Task 1
   - Currently a placeholder component
   - Uses `hidden lg:block` pattern for desktop-only visibility

2. **Page Layout** (`src/app/page.tsx`)
   - Current structure: Single column layout
   - Uses `useMobileDetection()` hook for responsive behavior
   - Renders `BottomToolbar` when `isCalendarGenerated && isMobileView === true`
   - Max width constraint: `max-w-[500px]`

3. **Mobile Detection**
   - Hook: `useMobileDetection(breakpoint = 768)`
   - Returns: `boolean | null` (null during initialization)
   - Used throughout for conditional rendering

4. **FloatingActionMenu**
   - Already removed (confirmed absent from codebase)
   - No deletion needed

### Key Dependencies
- Next.js 15.0.3 with Turbopack
- React 19.0.0-rc
- Tailwind CSS 3.4.1
- Package manager: pnpm@10.15.0

## Implementation Blueprint

### Pseudocode Approach
```
1. Import DesktopSidebar component
2. Restructure main layout:
   - Wrap content in responsive grid container
   - Apply conditional grid classes based on calendar state
   - Maintain center alignment when calendar not generated
3. Update main content area:
   - Adjust padding and spacing for desktop
   - Remove desktop-specific max-width constraints
4. Add conditional rendering for DesktopSidebar:
   - Show only when: isCalendarGenerated && isMobileView === false
5. Maintain existing mobile behavior:
   - Keep BottomToolbar logic unchanged
   - Preserve mobile-specific styles
```

## Detailed Implementation

### File: `src/app/page.tsx`

#### 1. Add Import
```tsx
import { DesktopSidebar } from '@/components/desktop/DesktopSidebar'
```

#### 2. Layout Structure Changes

**Current Structure:**
```tsx
<main className={`flex-1 overflow-y-auto flex ${...}`}>
  <div className="relative w-full max-w-[500px]">
    {/* content */}
  </div>
</main>
```

**New Structure:**
```tsx
<div className={`lg:grid lg:grid-cols-[1fr_320px] lg:gap-8 lg:max-w-7xl lg:mx-auto lg:p-8 ${isCalendarGenerated ? '' : 'flex items-center justify-center min-h-[100dvh]'}`}>
  <main className={`flex-1 overflow-y-auto flex ${...}`}>
    <div className="relative w-full max-w-[500px] lg:max-w-none">
      {/* content */}
    </div>
  </main>
  
  {/* Desktop Sidebar */}
  {isCalendarGenerated && isMobileView === false && (
    <DesktopSidebar />
  )}
</div>
```

### Key Pattern References

#### Responsive Grid Pattern (from codebase)
- Reference: `src/components/schedule-list.tsx:283`
- Pattern: `grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6`

#### Desktop-Only Visibility Pattern
- Reference: `src/components/desktop/DesktopSidebar.tsx:8`
- Pattern: `hidden lg:block`

#### Mobile Detection Pattern
- Reference: `src/hooks/useMobileDetection.ts`
- Default breakpoint: 768px (md breakpoint)
- Desktop detection: `isMobileView === false`

## Implementation Tasks

### Task Checklist
1. [ ] Import DesktopSidebar component
2. [ ] Add wrapper div with responsive grid layout
3. [ ] Move main content into grid structure
4. [ ] Adjust main element classes for desktop layout
5. [ ] Update max-width constraints for responsive behavior
6. [ ] Add conditional rendering for DesktopSidebar
7. [ ] Ensure mobile BottomToolbar remains unchanged
8. [ ] Test responsive behavior at different breakpoints

## Important Considerations

### Responsive Breakpoints
- **Mobile**: < 768px (uses BottomToolbar)
- **Tablet**: 768px - 1023px (transitional, no sidebar)
- **Desktop**: ≥ 1024px (lg breakpoint, shows DesktopSidebar)

### State Dependencies
- `isCalendarGenerated`: Must be true to show sidebar
- `isMobileView`: Must be false (desktop) to show sidebar
- Both conditions must be met: `isCalendarGenerated && isMobileView === false`

### CSS Class Strategy
- Grid layout: `lg:grid lg:grid-cols-[1fr_320px]`
  - Main content: `1fr` (flexible)
  - Sidebar: `320px` (fixed width)
- Gap: `lg:gap-8` for spacing between columns
- Max width: `lg:max-w-7xl` for desktop constraint
- Center alignment: `lg:mx-auto` for centered desktop layout

## Validation Gates

### Linting & Build
```bash
# Check for TypeScript/ESLint errors
pnpm lint

# Ensure build succeeds
pnpm build
```

### Manual Testing Checklist
```bash
# Start dev server
pnpm dev

# Test responsive behavior:
# 1. Load page at mobile width (<768px)
#    - Verify BottomToolbar appears when calendar generated
#    - Verify no DesktopSidebar visible
#
# 2. Load page at desktop width (≥1024px)
#    - Verify DesktopSidebar appears when calendar generated
#    - Verify no BottomToolbar visible
#
# 3. Resize window across breakpoints
#    - Verify smooth transition between layouts
#    - Verify no layout jumps or overlaps
#
# 4. Test with calendar not generated
#    - Verify centered layout on all screen sizes
#    - Verify no sidebar/toolbar shown
```

### Expected Behaviors
1. **Mobile (<768px)**:
   - Single column layout
   - BottomToolbar when calendar generated
   - No DesktopSidebar

2. **Desktop (≥1024px)**:
   - Two-column grid when calendar generated
   - DesktopSidebar in right column
   - No BottomToolbar

3. **Calendar Not Generated**:
   - Centered content on all screen sizes
   - No sidebar or toolbar

## Error Handling

### Common Issues & Solutions

1. **Layout Break on Resize**
   - Ensure grid classes only apply at lg breakpoint
   - Use conditional classes based on isCalendarGenerated

2. **Sidebar Appearing on Mobile**
   - Verify `hidden lg:block` classes on DesktopSidebar
   - Check isMobileView condition

3. **Content Overflow**
   - Maintain overflow-y-auto on main element
   - Ensure proper height constraints

## External Documentation
- Tailwind Grid: https://tailwindcss.com/docs/grid-template-columns
- Tailwind Responsive Design: https://tailwindcss.com/docs/responsive-design
- Next.js Layouts: https://nextjs.org/docs/app/building-your-application/routing/layouts-and-templates

## Success Criteria
- [ ] Desktop shows two-column layout when calendar is generated
- [ ] Mobile maintains single column with BottomToolbar
- [ ] No visual regressions on existing functionality
- [ ] Smooth responsive transitions
- [ ] Build and lint pass without errors

## Confidence Score: 9/10
High confidence due to:
- Clear existing patterns in codebase
- Simple structural changes
- No complex state management
- Existing responsive utilities

Minor uncertainty on:
- Exact styling adjustments needed for optimal desktop layout

## Next Steps
After successful implementation:
- **Task 3**: Implement Export Tab functionality in DesktopSidebar
- **Task 4**: Implement Save & Share Tab
- **Task 5**: Settings Tab and final polish