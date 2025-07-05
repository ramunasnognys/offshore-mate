# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Offshore Mate is a Next.js 15 web application that generates visual work rotation calendars for offshore workers. The app supports multiple rotation patterns (14/14, 14/21, 21/21, 28/28) and allows users to save/load schedules with local storage.

## Common Development Commands

```bash
# Development
npm run dev          # Start development server with turbopack
bun dev             # Alternative with bun (recommended per README)

# Production
npm run build       # Build for production
npm start          # Start production server

# Code Quality
npm run lint       # Run ESLint
```

Note: The project recommends using `bun` as the package manager, though `npm` also works.

## Standard Workflow

1. First think through the problem, read the codebase for relevant files, and write a plan to projectplan.md.
2. The plan should have a list of todo items that you can check off as you complete them
3. Before you begin working, check in with me and I will verify the plan.
4. Then, begin working on the todo items, marking them as complete as you go.
5. Please every step of the way just give me a high level explanation of what changes you made
6. Make every task and code change you do as simple as possible. We want to avoid making any massive or complex changes. Every change should impact as little code as possible. Everything is about simplicity.
7. Finally, add a review section to the projectplan.md file with a summary of the changes you made and any other relevant information.


## Architecture Overview

### Core Data Flow
1. **Rotation Generation**: `src/lib/utils/rotation.ts` contains the core logic for generating rotation calendars based on patterns
2. **Type Definitions**: `src/types/rotation.ts` defines the data structures (RotationPattern, CalendarDay, MonthData)
3. **Local Storage**: `src/lib/utils/storage.ts` handles saving/loading schedules to browser storage
4. **UI Components**: `src/components/` contains reusable UI components built with Radix UI primitives

### Key Components Structure
- `src/app/page.tsx` - Main application page with schedule generation logic
- `src/components/schedule-list.tsx` - Displays generated calendars
- `src/components/date-picker.tsx` - Date selection component
- `src/components/saved-schedules.tsx` - Manages saved schedule functionality
- `src/lib/utils/download.ts` - Handles calendar export as PNG using html2canvas

### Rotation Logic
The rotation calculation uses date-fns for date manipulation and generates work periods based on:
- Work periods with transition days at start/end
- Off periods calculated between work periods
- Calendar view with color-coded days (work/off/transition)

### Technology Stack
- **Framework**: Next.js 15.0.3 with TypeScript
- **React Version**: 19.0.0-rc (Release Candidate)
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui patterns
- **Date Handling**: date-fns library
- **Export**: html2canvas for PNG generation, jsPDF for PDF export
- **Animation**: Framer Motion

### Storage System
Local storage implementation saves schedules with metadata including:
- Schedule name, rotation pattern, start date
- Created/updated timestamps
- Schema versioning for future compatibility
- Indexed storage system for efficient retrieval using schedule IDs
- Browser environment detection for SSR compatibility

### Rotation Algorithm Details
The core rotation calculation (`src/lib/utils/rotation.ts`) implements:
- **Work Period Calculation**: Uses `addWeeks()` to determine work period end dates
- **Transition Day Logic**: Marks first and last day of each work period as transition days
- **Calendar Generation**: Creates 12-month calendar view with proper date calculations
- **Monday-Based Week System**: Converts Sunday-based `getDay()` to Monday-first week display
- **Period Overlap Detection**: Efficiently determines work/off status for any given date

### Export Architecture
The application supports dual export formats:

**PNG Export** (`src/lib/utils/download.ts`):
- Uses html2canvas for client-side image generation
- Renders a hidden calendar component (`src/components/download-calendar.tsx`) at high resolution (2100x2970px)
- Optimized for print layouts with 3x4 month grid

**PDF Export** (`src/lib/utils/jspdf-export.ts`):
- Uses jsPDF + html2canvas for PDF generation (more compatible with React 19 RC)
- Renders calendar components to canvas first, then converts to PDF
- Includes error handling and fallback mechanisms
- Client-side PDF generation without server dependencies

**Export Components**:
- `src/components/export-format-selector.tsx` - Format selection UI
- `src/components/export-progress-modal.tsx` - Loading states with mobile-specific messaging
- `src/components/pdf-export-error-dialog.tsx` - User-friendly error handling
- `src/components/error-toast.tsx` - Toast notifications for user feedback

### SSR and Hydration Considerations
The project uses several patterns to handle server-side rendering compatibility:

**Client-Side Detection**:
- `isStorageAvailable()` utility properly handles server/client environment differences
- Mobile detection state initialized as `null` to prevent hydration mismatches
- `isClient` state pattern for components that require browser APIs

**Conditional Rendering**:
- Storage-dependent features wrapped with `isClient && isStorageAvailable()` checks
- Mobile-specific UI components use strict equality checks (`isMobileView === true`)
- Date-based calculations handled carefully to avoid server/client differences