# PRP: Enhanced Schedule Saving and Management

## Overview
Implement an intuitive and contextual schedule saving and management system for Offshore Mate. This feature enhances the user experience by introducing a contextual save bar after calendar generation and adding inline editing capabilities to the saved schedules management interface.

## Success Criteria
- Users can save schedules immediately after generation with a contextual save bar
- Users can rename schedules inline without navigation
- Smooth animations and transitions enhance the UX
- All existing schedules remain functional
- Error handling provides clear feedback

## Context & Research

### Existing Implementation Analysis

#### Current Schedule Management (`src/hooks/useScheduleManagement.ts`)
```typescript
// Current hook provides:
- saveSchedule(yearCalendar, scheduleName, rotationPattern, startDate, currentScheduleId)
- loadSchedule(scheduleId)
- deleteSchedule(scheduleId)
- refreshSchedulesList()
// Missing: renameSchedule function
```

#### Storage Layer (`src/lib/utils/storage.ts`)
```typescript
// Existing functions:
- saveSchedule(schedule: SavedSchedule): boolean
- getSchedule(id: string): SavedSchedule | null
- deleteSchedule(id: string): boolean
- getAllScheduleMetadata(): ScheduleMetadata[]
// Structure preserved, metadata.name update needed for rename
```

#### UI Components Pattern
- Using Radix UI primitives (Dialog, Button, etc.)
- shadcn/ui components with variants
- ErrorToast component for error messages
- Consistent animation patterns in `globals.css`

### External Documentation
- **Radix UI Dialog**: https://www.radix-ui.com/primitives/docs/components/dialog
  - Use Dialog.Root, Dialog.Content, Dialog.Close for confirmation
  - Portal renders in body for proper z-index
- **Tailwind CSS Animations**: Standard classes like `transition-all duration-300 ease-out`
- **React State Management**: useState for local component state

## Implementation Blueprint

### 1. ContextualSaveBar Component (NEW)

```typescript
// src/components/ContextualSaveBar.tsx
interface ContextualSaveBarProps {
  yearCalendar: MonthData[]
  scheduleName: string
  selectedRotation: string
  selectedDate: string
  currentScheduleId: string | null
  isSaved: boolean
  onNameChange: (name: string) => void
  onSave: () => void
  onUpdate: () => void
}

// Pseudocode:
1. Show when: isCalendarGenerated && !currentScheduleId (new schedule)
2. Default name: `${selectedRotation} Rotation (${format(selectedDate, "MMM d, yyyy")})`
3. Input validation: trim().length > 0, show border-destructive if invalid
4. Button states:
   - "Save" when !isSaved
   - "Saved ✔" immediately after save (2-3s display)
   - "Update" if inputs change after saved
5. Animations:
   - Appear: `animate-in slide-in-from-top duration-300 ease-out`
   - Disappear: `animate-out fade-out duration-500 ease-in`
```

### 2. Enhanced SavedSchedules Component (MODIFY)

```typescript
// src/components/saved-schedules.tsx
// Add to component state:
const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null)
const [editingName, setEditingName] = useState<string>('')
const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

// Functions to add:
const handleEditStart = (schedule: ScheduleMetadata) => {
  // Cancel any existing edit
  setEditingScheduleId(schedule.id)
  setEditingName(schedule.name)
}

const handleEditConfirm = async () => {
  if (!editingName.trim()) {
    // Show validation error
    return
  }
  const success = await renameSchedule(editingScheduleId, editingName)
  if (success) {
    setEditingScheduleId(null)
    refreshSchedulesList()
  } else {
    // Show ErrorToast
  }
}

const handleEditCancel = () => {
  setEditingScheduleId(null)
  setEditingName('')
}

// UI Changes:
// View Mode: Add Edit icon (Pencil from lucide-react)
// Edit Mode: Replace icons with Confirm (Check) and Cancel (X) buttons
// Use Dialog for delete confirmation with variant="destructive" button
```

### 3. UIContext Enhancement (MODIFY)

```typescript
// src/contexts/UIContext.tsx
interface UIContextType {
  // ... existing fields
  
  // Add new field for managing editing state
  editingScheduleId: string | null
  setEditingScheduleId: (id: string | null) => void
}
```

### 4. useScheduleManagement Hook Enhancement (MODIFY)

```typescript
// src/hooks/useScheduleManagement.ts
// Add rename function:
const renameSchedule = useCallback((scheduleId: string, newName: string): boolean => {
  try {
    const schedule = getSchedule(scheduleId)
    if (!schedule) {
      onError?.('Schedule not found')
      return false
    }
    
    schedule.metadata.name = newName
    schedule.metadata.updatedAt = new Date().toISOString()
    
    const success = saveSchedule(schedule)
    if (success) {
      refreshSchedulesList()
      setSaveNotification('Schedule renamed successfully')
    }
    return success
  } catch (error) {
    onError?.('Unable to rename schedule')
    return false
  }
}, [onError, refreshSchedulesList])
```

### 5. CalendarDisplay Integration (MODIFY)

```typescript
// src/components/calendar/CalendarDisplay.tsx
// Add ContextualSaveBar rendering:
{isCalendarGenerated && !currentScheduleId && (
  <ContextualSaveBar
    yearCalendar={yearCalendar}
    scheduleName={scheduleName}
    selectedRotation={selectedRotation}
    selectedDate={selectedDate}
    currentScheduleId={currentScheduleId}
    isSaved={isSaved}
    onNameChange={setScheduleName}
    onSave={handleSave}
    onUpdate={handleUpdate}
  />
)}
```

## File Changes Summary

### CREATE
- `src/components/ContextualSaveBar.tsx` - New contextual save UI component

### MODIFY
- `src/components/saved-schedules.tsx` - Add inline editing, delete confirmation dialog
- `src/components/calendar/CalendarDisplay.tsx` - Integrate ContextualSaveBar
- `src/hooks/useScheduleManagement.ts` - Add renameSchedule function
- `src/contexts/UIContext.tsx` - Add editingScheduleId state

## Implementation Tasks (In Order)

1. **Create ContextualSaveBar Component**
   - Implement component with proper state management
   - Add animations and transitions
   - Handle validation and error states

2. **Enhance UIContext**
   - Add editingScheduleId state
   - Update provider and consumers

3. **Update useScheduleManagement Hook**
   - Implement renameSchedule function
   - Add proper error handling

4. **Enhance SavedSchedules Component**
   - Add inline editing UI
   - Implement delete confirmation dialog
   - Handle concurrent editing logic

5. **Integrate ContextualSaveBar in CalendarDisplay**
   - Add conditional rendering logic
   - Connect to calendar context

6. **Test & Validate**
   - Test all user flows
   - Verify animations work correctly
   - Ensure error handling works

## Validation Gates

```bash
# TypeScript compilation
npm run build

# Linting
npm run lint

# Manual Testing Checklist
- [ ] New schedule saves with contextual bar
- [ ] Default name format is correct: "14/21 Rotation (Mar 4, 2025)"
- [ ] Save button changes to "Saved ✔" on success
- [ ] Bar fades out after 2-3 seconds
- [ ] Editing schedule name works inline
- [ ] Concurrent editing cancels previous edit
- [ ] Delete confirmation dialog appears
- [ ] Empty name validation shows red border
- [ ] Error messages appear as toasts
- [ ] Animations are smooth (300ms in, 500ms out)
- [ ] Loading a schedule closes the modal
```

## Error Handling Strategy

1. **Empty Name Validation**
   - Apply `border-destructive` class to input
   - Disable Save/Confirm button
   - No error message needed (visual feedback sufficient)

2. **Storage Errors**
   - Use ErrorToast component for all storage failures
   - Messages: "Schedule not found", "Unable to save", "Storage full"

3. **State Recovery**
   - If save fails, keep form data intact
   - Allow user to retry or cancel

## Common Gotchas & Solutions

1. **Race Conditions**
   - Solution: Use proper async/await and loading states
   - Cancel previous operations when starting new ones

2. **Animation Timing**
   - Use CSS classes from globals.css for consistency
   - Test on various devices for performance

3. **LocalStorage Limits**
   - Check isStorageAvailable() before operations
   - Provide clear error messages when storage is full

4. **Mobile Touch Targets**
   - Ensure all buttons are at least 44x44px
   - Use touch-manipulation class for better response

## Dependencies & References

- **Radix UI Dialog**: `@radix-ui/react-dialog` (v1.1.2)
- **Lucide Icons**: `lucide-react` (v0.454.0)
- **Date Formatting**: `date-fns` (v3.6.0)
- **Existing Components**: Button, Dialog, ErrorToast
- **Existing Hooks**: useScheduleManagement, useCalendar

## Success Metrics

- Zero console errors during normal operation
- All animations complete within specified durations
- User can complete save flow in < 3 clicks
- Edit operation completes in < 2 seconds
- No data loss on page refresh (saved schedules persist)

## Confidence Score: 8/10

**Rationale**: High confidence due to:
- Clear requirements and detailed specifications
- Existing patterns to follow in codebase
- Well-established component libraries (Radix UI)
- Comprehensive error handling strategy

**Risk Factors**:
- Animation performance on older devices (-1)
- Potential edge cases in concurrent editing (-1)

---

*This PRP provides comprehensive context for one-pass implementation success. All necessary patterns, utilities, and dependencies are documented with clear implementation paths.*