# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Offshore Mate is a Next.js 15 web application that generates visual work rotation calendars for offshore workers. The app supports multiple rotation patterns (14/14, 14/21, 21/21, 28/28) and allows users to save/load schedules with local storage.

## Common Development Commands

**Development:**
```bash
npm run dev          # Start development server with turbopack
npm run build        # Build for production  
npm run start        # Start production server
npm run lint         # Run ESLint
```

**Testing:**
```bash
npx playwright test  # Run all Playwright tests
npx playwright test --ui  # Run tests with UI mode
```

## Architecture Overview

### Context-Based State Management
- **CalendarContext** (`src/contexts/CalendarContext.tsx`) - Central state for calendar generation and rotation form data
- **UIContext** (`src/contexts/UIContext.tsx`) - UI state management for mobile responsiveness and user interactions
- Custom hooks encapsulate business logic: `useCalendarGeneration`, `useRotationForm`, `useScheduleManagement`

### Key Components Architecture
- **Calendar Generation**: `src/lib/utils/rotation.ts` contains core rotation calculation logic with `generateRotationCalendar()` function
- **Export System**: Separate utilities for PNG (`html2canvas`), PDF (`jsPDF`), and iCal (`ical-generator`) exports
- **Storage**: LocalStorage management in `src/lib/utils/storage.ts` with SSR safety checks
- **Mobile-First Design**: Components use `isMobileView` context for responsive rendering

### File Structure Patterns
```
src/
├── components/           # UI components
│   ├── ui/              # Radix UI-based primitives  
│   └── calendar/        # Calendar-specific components
├── contexts/            # React context providers
├── hooks/               # Custom hooks for business logic
├── lib/utils/           # Utility functions and core logic
└── types/               # TypeScript type definitions
```

## Development Guidelines

### TypeScript & React Patterns
- **Strict TypeScript** - All components must be properly typed with interfaces from `src/types/rotation.ts`
- **React 19 RC** - Be aware of potential compatibility issues; avoid deprecated patterns
- **SSR Safety** - Always use client-side checks for `localStorage` and browser APIs:
  ```typescript
  const isClient = typeof window !== 'undefined'
  if (isClient && isStorageAvailable()) { /* use localStorage */ }
  ```

### Component Development Standards  
- **Radix UI Primitives** - Use existing UI components from `src/components/ui/`
- **Glass-morphism Design** - Follow `backdrop-blur-xl bg-white/30` styling patterns
- **Mobile-First Responsive** - Always implement responsive design with `isMobileView` context
- **Accessibility** - Radix components provide built-in accessibility; maintain these standards

### State Management Patterns
- **Context over Props Drilling** - Use `CalendarContext` and `UIContext` for shared state
- **Custom Hooks** - Extract business logic into hooks (see `src/hooks/` for examples)
- **LocalStorage Integration** - Use `useScheduleManagement` hook for persistent data

### Export Functionality Standards
- **Multi-format Support** - Handle PNG, PDF, and iCal exports with proper error handling
- **Progress Indicators** - Use `ExportProgressModal` for long-running export operations  
- **Mobile Considerations** - Different export flows for mobile vs desktop

### Testing Approach
- **Playwright E2E Tests** - Tests are configured in `playwright.config.ts` 
- **Test Environment** - Tests run against `http://localhost:3000` with automatic dev server startup
- **Cross-browser Testing** - Chromium, Firefox, and WebKit support configured

### Git Branch Strategy
- Feature branches: `feature/descriptive-name`
- Main branch: `main` for production deployments
- Always commit with descriptive messages after completing tasks

### Performance Considerations
- **Next.js 15** - Built-in optimizations enabled
- **Turbopack** - Used in development for faster builds
- **Image Optimization** - html2canvas exports are optimized for file size
- **Bundle Analysis** - Monitor bundle size when adding new dependencies