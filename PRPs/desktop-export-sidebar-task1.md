# PRP: Desktop Export Sidebar - Task 1: Project Scaffolding and Context Setup

**Version:** 1.0  
**Date:** 2025-01-22  
**Confidence Level:** 9/10 (High confidence - straightforward file creation task)

## 1. Feature Overview

This PRP covers the implementation of **Task 1: Project Scaffolding and Context Setup** for the Desktop Export Sidebar feature. This is a foundational task that creates the necessary directory structure and boilerplate files for the desktop sidebar components without making any logic changes to existing code.

## 2. Context and Background

### 2.1 Current State
The Offshore Mate application currently has:
- Mobile-optimized UI with `BottomToolbar` for calendar exports
- Desktop view using `DesktopHeader` component (in `src/components/calendar/DesktopHeader.tsx`)
- Responsive detection via `useMobileDetection` hook
- Export functionality through `useExportCalendar` hook
- Share functionality through `useShareCalendar` hook
- Schedule management through `useScheduleManagement` hook

### 2.2 Project Conventions to Follow
Based on codebase analysis:
- All React components use `'use client'` directive
- Components are written in TypeScript with `.tsx` extension
- UI components use `shadcn/ui` library (located in `src/components/ui/`)
- Styling uses Tailwind CSS with utility classes
- Component structure follows pattern seen in existing components:
  ```tsx
  'use client'
  import React from 'react'
  // imports
  export function ComponentName() { ... }
  ```

### 2.3 Existing Patterns to Reference
- **Desktop Header Pattern**: `src/components/calendar/DesktopHeader.tsx` - Shows desktop-specific UI patterns
- **Component Organization**: Components grouped by feature in subdirectories
- **Responsive Patterns**: Desktop components hidden on mobile using `hidden lg:block`
- **Glass Morphism Design**: `bg-white/50 backdrop-blur-lg` with rounded corners and borders

## 3. Implementation Blueprint

### 3.1 Directory Structure to Create
```
src/components/desktop/
├── DesktopSidebar.tsx
└── tabs/
    ├── ExportTab.tsx
    ├── SaveTab.tsx
    └── SettingsTab.tsx
```

### 3.2 File Contents

#### File 1: `src/components/desktop/DesktopSidebar.tsx`
```tsx
'use client'

import React from 'react'
// Imports for shadcn/ui Tabs will be added in a later step

export function DesktopSidebar() {
  return (
    <aside className="hidden lg:block w-[320px] p-4">
      <div className="bg-white/50 backdrop-blur-lg rounded-2xl h-full p-4 shadow-lg border border-white/30">
        <p>Desktop Sidebar Placeholder</p>
        {/* Tab components will be added here */}
      </div>
    </aside>
  )
}
```

**Key Design Decisions:**
- `hidden lg:block` - Only visible on large screens (≥1024px)
- `w-[320px]` - Fixed width sidebar
- Glass morphism styling matching existing desktop components
- Placeholder text for initial testing

#### File 2: `src/components/desktop/tabs/ExportTab.tsx`
```tsx
'use client'

import React from 'react'

export function ExportTab() {
  return (
    <div>
      <h3 className="font-semibold mb-4">Export Calendar</h3>
      <p className="text-sm text-gray-500">Export options will be here.</p>
    </div>
  )
}
```

#### File 3: `src/components/desktop/tabs/SaveTab.tsx`
```tsx
'use client'

import React from 'react'

export function SaveTab() {
  return (
    <div>
      <h3 className="font-semibold mb-4">Save & Share</h3>
      <p className="text-sm text-gray-500">Save and share options will be here.</p>
    </div>
  )
}
```

#### File 4: `src/components/desktop/tabs/SettingsTab.tsx`
```tsx
'use client'

import React from 'react'

export function SettingsTab() {
  return (
    <div>
      <h3 className="font-semibold mb-4">Settings</h3>
      <p className="text-sm text-gray-500">Settings will be here.</p>
    </div>
  )
}
```

**Common Patterns in Tab Components:**
- Consistent heading structure with `font-semibold mb-4`
- Placeholder text using `text-sm text-gray-500`
- Simple div wrapper for content

## 4. Implementation Tasks

### Task Checklist
1. [ ] Create directory `src/components/desktop/`
2. [ ] Create subdirectory `src/components/desktop/tabs/`
3. [ ] Create `DesktopSidebar.tsx` with boilerplate
4. [ ] Create `ExportTab.tsx` with boilerplate
5. [ ] Create `SaveTab.tsx` with boilerplate
6. [ ] Create `SettingsTab.tsx` with boilerplate
7. [ ] Run validation gates to ensure no errors

## 5. Validation Gates

### 5.1 Syntax and Type Checking
```bash
# Check TypeScript compilation
pnpm tsc --noEmit

# Run linting
pnpm lint
```

### 5.2 File Structure Verification
```bash
# Verify all files were created
ls -la src/components/desktop/
ls -la src/components/desktop/tabs/

# Expected output should show:
# - DesktopSidebar.tsx
# - tabs/ExportTab.tsx
# - tabs/SaveTab.tsx
# - tabs/SettingsTab.tsx
```

### 5.3 Component Import Test
```bash
# Test that components can be imported without errors
# This will be validated when running the dev server
pnpm dev

# Navigate to http://localhost:3000 and check console for errors
```

## 6. Success Criteria

- [ ] All 4 files created in correct locations
- [ ] Each file contains the exact boilerplate code specified
- [ ] No TypeScript errors when running `pnpm tsc --noEmit`
- [ ] No linting errors when running `pnpm lint`
- [ ] Development server starts without errors
- [ ] No console errors in browser

## 7. Error Handling and Edge Cases

### Potential Issues and Solutions

1. **Directory Already Exists**
   - Check if `src/components/desktop/` exists before creating
   - If exists, verify it's empty or back up existing contents

2. **Import Path Issues**
   - Ensure using `@/` alias for imports (configured in tsconfig.json)
   - All internal imports should use `@/components/...` pattern

3. **Styling Conflicts**
   - Tailwind classes used are standard and shouldn't conflict
   - Glass morphism pattern matches existing desktop components

## 8. Dependencies and Prerequisites

### Required Dependencies (Already Installed)
- React 19.0.0-rc
- Next.js 15.0.3
- TypeScript 5.x
- Tailwind CSS 3.4.1
- @radix-ui components (for future Tabs integration)

### No New Dependencies Required for Task 1

## 9. Testing Approach

Since this task only creates boilerplate files with no logic:

1. **Manual Verification**
   - Verify file structure matches specification
   - Check that each file contains correct boilerplate

2. **Build Verification**
   ```bash
   pnpm build
   # Should complete without errors
   ```

3. **Development Server Check**
   ```bash
   pnpm dev
   # Should start without errors
   ```

## 10. Notes for Future Tasks

This scaffolding sets up for:
- **Task 2**: Will integrate DesktopSidebar into main page layout
- **Task 3**: Will implement full ExportTab functionality
- **Task 4**: Will implement SaveTab functionality
- **Task 5**: Will complete SettingsTab and final polish

The boilerplate structure allows incremental development without breaking existing functionality.

## 11. References

### Existing Files to Study
- `src/components/calendar/DesktopHeader.tsx` - Desktop component patterns
- `src/components/bottom-toolbar.tsx` - Mobile export UI for reference
- `src/app/page.tsx` - Main page structure where sidebar will integrate
- `src/hooks/useExportCalendar.ts` - Export logic to connect in Task 3
- `src/hooks/useShareCalendar.ts` - Share logic to connect in Task 4

### Documentation
- Tailwind CSS utilities: https://tailwindcss.com/docs
- shadcn/ui Tabs component: https://ui.shadcn.com/docs/components/tabs
- Next.js App Router: https://nextjs.org/docs/app

## Confidence Score: 9/10

**Rationale for High Confidence:**
- Task is purely structural (creating files/folders)
- No logic changes or complex integrations
- Clear boilerplate provided in requirements
- Follows existing project patterns
- Minimal risk of breaking existing functionality
- Clear validation gates to ensure success

**Minor Risk Factor (-1 point):**
- Slight possibility of path/import issues that would need adjustment

---

**Ready for Implementation**: This PRP provides comprehensive context for Task 1 implementation. The AI agent has all necessary information to create the scaffolding successfully in a single pass.