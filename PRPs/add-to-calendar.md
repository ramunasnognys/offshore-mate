name: "Add to Calendar Feature PRP"
description: |

## Purpose
Implement a comprehensive "Add to Calendar" feature that allows users to export their generated work rotation schedules as iCalendar (.ics) files, enabling seamless integration with native calendar applications across all platforms.

## Core Principles
1. **Context is King**: All necessary patterns from existing export functionality included
2. **Validation Loops**: Playwright MCP tests following existing patterns
3. **Information Dense**: Uses existing UI patterns and state management
4. **Progressive Success**: Build on existing export infrastructure
5. **Global rules**: Follow all rules in CLAUDE.md

---

## Goal
Enable users to add their generated offshore work schedule to their device's native calendar application (Apple Calendar, Google Calendar, Outlook) via a standard iCalendar (.ics) file export, with clear visual distinction between work periods, off-duty periods, and travel days.

## Why
- **Business value**: Increases app stickiness by integrating with users' daily workflow
- **User impact**: Users can see work schedules alongside personal appointments without manual entry
- **Integration**: Extends existing export functionality with a more practical format
- **Problems solved**: Eliminates manual calendar entry, reduces scheduling conflicts

## What
Add a new "Add to Calendar" button to both mobile (BottomToolbar) and desktop (FloatingActionMenu) interfaces that generates and downloads an .ics file containing the full 12-month rotation schedule.

### Success Criteria
- [x] Button appears in both mobile and desktop export menus
- [x] Generates valid RFC 5545 compliant .ics files
- [x] Creates multi-day all-day events for work/off periods
- [x] Includes travel information in event descriptions
- [x] Works across iOS, Android, and desktop browsers
- [x] Shows loading state and success notification
- [x] Handles errors gracefully with user feedback

## All Needed Context

### Documentation & References
```yaml
# MUST READ - Include these in your context window
- url: https://www.npmjs.com/package/ical-generator
  why: Official npm package for generating iCal files - check API methods
  
- url: https://github.com/sebbo2002/ical-generator
  why: GitHub repo with examples of creating events with floating times
  
- file: /src/lib/utils/jspdf-export.ts
  why: Pattern for export utility functions and error handling
  
- file: /src/lib/utils/download.ts
  why: Existing download pattern for PNG export
  
- file: /src/components/bottom-toolbar.tsx
  why: Mobile export UI pattern - lines 53-118 show format selector
  
- file: /src/components/floating-action-menu.tsx
  why: Desktop export UI pattern - lines 39-78 show button styling
  
- file: /src/types/rotation.ts
  why: MonthData and CalendarDay interfaces - lines 22-27
  
- file: /src/app/page.tsx
  why: Export handler pattern and state management - handleExport function
  
- file: /src/components/error-toast.tsx
  why: Error notification pattern for failed exports
  
- doc: https://datatracker.ietf.org/doc/html/rfc5545
  section: 3.6.1 Event Component, 3.3.11 Text
  critical: DTEND for all-day events must be day AFTER last day
```

### Current Codebase tree
```bash
src/
├── app/
│   └── page.tsx                    # Main app component with export handlers
├── components/
│   ├── bottom-toolbar.tsx          # Mobile toolbar with export panel
│   ├── floating-action-menu.tsx    # Desktop floating action button
│   ├── error-toast.tsx             # Error notification component
│   └── export-format-selector.tsx  # Export format type definition
├── lib/
│   └── utils/
│       ├── download.ts             # PNG download utility
│       ├── jspdf-export.ts         # PDF export utility
│       └── rotation.ts             # Calendar generation logic
└── types/
    └── rotation.ts                 # Type definitions
```

### Desired Codebase tree with files to be added
```bash
src/
├── lib/
│   └── utils/
│       └── ical-export.ts          # New: iCalendar export utility
└── tests/
    └── calendar-export.spec.ts     # New: Playwright tests for calendar export
```

### Known Gotchas & Library Quirks
```typescript
// CRITICAL: ical-generator requires proper date handling for all-day events
// All-day events use VALUE=DATE format without time components
// Example: DTSTART;VALUE=DATE:20231001

// GOTCHA: iOS/Android handle data: URIs differently for .ics files
// Must use download attribute for fallback on unsupported browsers

// PATTERN: All export functions follow async pattern for consistency
// Even if synchronous, wrap in Promise for loading state handling

// CRITICAL: Event descriptions must handle travel days correctly
// First day: "Work Period (Day 1 of 14). Travel to location."
// Last day: "Work Period (Day 14 of 14). Travel home."

// GOTCHA: Schedule name must be sanitized for filename safety
// Replace spaces and special chars with hyphens
```

## Implementation Blueprint

### Data models and structure

```typescript
// src/lib/utils/ical-export.ts - Core types
interface ICalExportOptions {
  calendar: MonthData[];      // Full 12-month calendar data
  scheduleName: string;       // User's schedule name
  rotationPattern: string;    // e.g., "14/21"
  startDate: string;          // ISO date string
}

interface WorkPeriod {
  start: Date;
  end: Date;
  type: 'work' | 'off';
  totalDays: number;
}
```

### List of tasks to be completed in order

```yaml
Task 1: Create iCalendar export utility
MODIFY package.json:
  - ADD dependency: "ical-generator": "^9.0.0"
  
CREATE src/lib/utils/ical-export.ts:
  - MIRROR pattern from: src/lib/utils/jspdf-export.ts (async export structure)
  - IMPLEMENT RFC 5545 compliant event generation
  - USE floating time for timezone independence

Task 2: Add CalendarPlus icon and button to BottomToolbar
MODIFY src/components/bottom-toolbar.tsx:
  - IMPORT CalendarPlus from 'lucide-react'
  - ADD new button after PDF option (line 107)
  - FOLLOW existing radio button pattern
  - ADD disabled state based on isCalendarGenerated prop

Task 3: Add CalendarPlus button to FloatingActionMenu  
MODIFY src/components/floating-action-menu.tsx:
  - IMPORT CalendarPlus from 'lucide-react'
  - ADD button after PDF export (line 64)
  - MIRROR existing button styling pattern
  
Task 4: Update ExportFormat type
MODIFY src/components/export-format-selector.tsx:
  - CHANGE type from 'png' | 'pdf' to 'png' | 'pdf' | 'ics'

Task 5: Add export handler in main page
MODIFY src/app/page.tsx:
  - IMPORT exportCalendarAsICS from utils
  - ADD case 'ics' to handleExport function
  - IMPLEMENT loading state and error handling
  - ADD success toast notification

Task 6: Create Playwright tests
CREATE tests/calendar-export.spec.ts:
  - FOLLOW pattern from: tests/date-picker.spec.ts
  - TEST mobile and desktop export flows
  - VERIFY .ics file download triggered
```

### Per task pseudocode

```typescript
// Task 1 - iCalendar export utility structure
export async function exportCalendarAsICS(options: ICalExportOptions): Promise<void> {
  try {
    // Import dynamically for client-side only
    const ical = (await import('ical-generator')).default;
    
    // Create calendar with metadata
    const calendar = ical({
      name: `${options.scheduleName} - Work Schedule`,
      description: `Rotation pattern: ${options.rotationPattern}`,
      timezone: null  // Floating time
    });
    
    // Convert MonthData to work/off periods
    const periods = extractWorkPeriods(options.calendar);
    
    // Create events for each period
    periods.forEach(period => {
      const summary = `${options.scheduleName} (${period.type === 'work' ? 'Work' : 'Off Duty'})`;
      const description = generateEventDescription(period);
      
      calendar.createEvent({
        start: period.start,
        end: period.end,
        allDay: true,
        summary,
        description,
        // No location or alarms for V1
      });
    });
    
    // Generate .ics content
    const icsContent = calendar.toString();
    
    // Create download link following existing pattern
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // Sanitize filename
    const safeName = options.scheduleName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    link.download = `schedule-${safeName}-${options.startDate}.ics`;
    link.href = url;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error('Calendar export failed:', error);
    throw new Error('Failed to create calendar file');
  }
}

// Task 5 - Main page handler addition
const handleExport = async (format: ExportFormat) => {
  if (!yearCalendar.length) return;
  
  setIsDownloading(true);
  setErrorMessage('');
  
  try {
    switch (format) {
      case 'png':
        // existing PNG logic
        break;
      case 'pdf':
        // existing PDF logic
        break;
      case 'ics':
        await exportCalendarAsICS({
          calendar: yearCalendar,
          scheduleName: scheduleName || 'Offshore Schedule',
          rotationPattern: selectedRotation,
          startDate: selectedDate
        });
        
        // Show success notification
        setErrorMessage(''); // Clear any errors
        // Use existing toast pattern for success
        setSaveNotification('Your schedule is ready. Check your device for a calendar import prompt.');
        setTimeout(() => setSaveNotification(''), 5000);
        break;
    }
  } catch (error) {
    setErrorMessage('Failed to create calendar file. Please try again.');
  } finally {
    setIsDownloading(false);
  }
};
```

### Integration Points
```yaml
UI COMPONENTS:
  - BottomToolbar: Add after line 107 (PDF option)
  - FloatingActionMenu: Add after line 64 (PDF button)
  
STATE MANAGEMENT:
  - Use existing isDownloading state
  - Use existing errorMessage for failures
  - Use saveNotification for success message
  
PROPS:
  - Pass isCalendarGenerated to enable/disable button
  - Use existing onExport handler pattern
```

## Validation Loop

### Level 1: Syntax & TypeScript
```bash
# After implementation, run:
npm run lint
npm run build

# Expected: No errors. If errors, fix TypeScript issues.
```

### Level 2: Unit Tests (manual verification)
```typescript
// Test scenarios to verify manually:
// 1. Generate a schedule first
// 2. Click "Add to Calendar" 
// 3. Verify .ics file downloads
// 4. Open .ics file in text editor
// 5. Verify structure:
//    - BEGIN:VCALENDAR
//    - Events have VALUE=DATE format
//    - Summary includes schedule name
//    - Description has travel info
```

### Level 3: Playwright Tests (playwright MCP)
```bash
# Run the new test with playwright MCP

# Test both mobile and desktop flows
# Verify download triggered (can't test actual file content in Playwright)
```

### Level 4: Cross-platform Testing
```yaml
iOS Safari:
  - Generate schedule
  - Tap "Add to Calendar"
  - Verify import prompt appears
  
Android Chrome:
  - Generate schedule  
  - Tap "Add to Calendar"
  - Verify download or import prompt
  
Desktop Chrome/Firefox:
  - Generate schedule
  - Click "Add to Calendar"
  - Verify .ics file downloads
```

## Final Validation Checklist
- [ ] TypeScript builds without errors: `npm run build`
- [ ] No linting errors: `npm run lint`
- [ ] iOS import prompt appears correctly
- [ ] Android handles .ics file properly
- [ ] Desktop downloads file with correct name
- [ ] Error toast shows on failure
- [ ] Success notification appears
- [ ] Button disabled when no schedule
- [ ] Loading state during export

---

## Anti-Patterns to Avoid
- ❌ Don't use TZID (use floating time for universal compatibility)
- ❌ Don't create separate events for each day (use multi-day events)
- ❌ Don't forget travel day descriptions
- ❌ Don't use synchronous file generation (breaks loading state)
- ❌ Don't hardcode rotation patterns in descriptions
- ❌ Don't skip filename sanitization
- ❌ Don't use absolute paths in imports
- ❌ Don't create new UI patterns (follow existing export panels)

## Confidence Score: 9/10

High confidence due to:
- Clear existing patterns to follow
- Well-documented library with examples
- Simple integration points
- Comprehensive error handling patterns exist
- Test infrastructure already in place

Minor uncertainty on:
- Exact iOS/Android .ics handling behavior (but fallback ensures functionality)