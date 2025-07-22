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

# Testing
npx playwright test  # Run end-to-end tests
```

Note: The project recommends using `bun` as the package manager, though `npm` also works.

## Architecture Overview

### Core Data Flow
1. **Rotation Generation**: `src/lib/utils/rotation.ts` contains the core logic for generating rotation calendars based on patterns
2. **Type Definitions**: `src/types/rotation.ts` defines the data structures (RotationPattern, CalendarDay, MonthData)
3. **Local Storage**: `src/lib/utils/storage.ts` handles saving/loading schedules to browser storage
4. **UI Components**: `src/components/` contains reusable UI components built with Radix UI primitives

### Key Components Structure
- `src/app/page.tsx` - Main application page with schedule generation logic and mobile navigation
- `src/components/schedule-list.tsx` - Displays generated calendars with mobile-optimized layout
- `src/components/settings-dialog.tsx` - Settings modal for schedule management and configuration
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
- **Package Manager**: Bun (recommended) or npm
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui patterns
- **Date Handling**: date-fns library
- **Export**: html2canvas for PNG generation, jsPDF for PDF export
- **Animation**: Framer Motion
- **Testing**: Playwright for end-to-end testing

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

### Mobile-First Design Architecture
The application implements a comprehensive mobile-first approach:

**Responsive Layout System**:
- Mobile breakpoint at 768px (`md:` prefix for desktop styles)
- Mobile detection with `window.innerWidth < 768` and resize listeners
- Conditional component rendering based on `isMobileView` state

**Mobile Navigation**:
- Touch gesture support with swipe detection for calendar navigation
- Month-by-month view on mobile vs. full year view on desktop
- Progress dots indicator for mobile month navigation
- Optimized header layouts with back button and settings positioning

**Mobile-Optimized Calendar**:
- Compact typography scale: `text-xs` for day numbers, `text-[10px]` for headers
- Reduced icon sizes: `w-2 h-2` for calendar icons on mobile
- Perfect center alignment with absolute positioning for icons
- Tighter spacing: `gap-0.5`, `p-0.5`, reduced `min-h-[40px]` for mobile density
- Touch-friendly targets while maintaining visual compactness

**Settings Modal Architecture**:
- Radix Dialog-based settings modal with glass-morphism design
- Centralized schedule management moved from main interface to settings
- Mobile-responsive dialog with proper touch interactions
- Transparent button styling with black border for visual balance

### Design System and Styling

**Glass-Morphism Cards**:
- Consistent card styling: `backdrop-blur-xl bg-white/30 rounded-2xl md:rounded-3xl shadow-card border border-white/30`
- Custom shadow utilities in `globals.css`:
  - `shadow-card`: Multi-layered shadow with inset highlight
  - `shadow-card-hover`: Enhanced shadow for hover states
- Unified styling across mobile and desktop (no conditional styling for cards)

**Custom CSS Utilities**:
- Today cell animations with gradient background and pulse effect
- Smooth transitions using `transition-all duration-300`
- Active state scaling: `active:scale-[0.98]`

**Color Scheme**:
- Work days: Orange (`bg-orange-100`, `text-orange-600`)
- Off days: Green (`bg-green-100`, `text-green-600`)
- Transition days: Pink/Rose (`bg-pink-100`, `text-pink-600`)
- Today indicator: Blue gradient with animation

### Testing Architecture

**Playwright End-to-End Testing**:
- **Test Location**: `/tests/` directory with `.spec.ts` files
- **Framework**: Playwright for cross-browser end-to-end testing
- **Test Coverage**: Date picker functionality, mobile/desktop responsive behavior
- **Viewport Testing**: Both mobile (375x812) and desktop (1280x900) viewports
- **Test Types**:
  - User interaction flows (date selection, dialog interactions)
  - Mobile-specific UI behavior (confirm/cancel buttons)
  - Validation logic (past date restrictions, quick select)
  - State management across component interactions

**Running Tests**:
- Use `npx playwright test` to run all tests
- Tests validate both mobile and desktop user experiences
- Component-level integration testing for date picker workflows

### Version Information
Current version: v.2 (displayed in footer)