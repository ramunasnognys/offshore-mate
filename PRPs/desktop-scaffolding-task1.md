# Desktop Export Sidebar - Task 1: Project Scaffolding and Context Setup

## Goal
Create the necessary new files and directories for the desktop sidebar components. This task involves no logic changes and is purely structural, setting the foundation for subsequent steps to implement the Desktop Export Sidebar feature.

## Why
- **Business value**: Enable desktop users to access export and save features in a dedicated sidebar for better UX
- **Integration**: Replaces the floating-action-menu.tsx with a more comprehensive desktop solution
- **Problems solved**: Desktop users currently have limited access to export options; this provides dedicated screen real estate for these features

## What
Create the initial component structure for the desktop sidebar feature with boilerplate components that will be enhanced in subsequent tasks.

### Success Criteria
- [ ] All component files created with proper TypeScript/React structure
- [ ] Components follow existing patterns in the codebase
- [ ] All files use 'use client' directive for client components
- [ ] TypeScript strict mode compliance
- [ ] Components are ready for feature implementation in next tasks

## All Needed Context

### Documentation & References
```yaml
# MUST READ - Include these in your context window
- url: https://ui.shadcn.com/docs/components/tabs
  why: Need to install and understand Tabs component from shadcn/ui for sidebar navigation
  
- file: src/components/bottom-toolbar.tsx
  why: Reference pattern for similar toolbar component with export functionality
  
- file: src/components/floating-action-menu.tsx
  why: Component that will be replaced - understand current implementation
  
- file: src/components/ui/button.tsx
  why: Reference for shadcn/ui component patterns and styling approach

- file: src/app/page.tsx
  why: Main page structure to understand integration points

- file: INITIAL.md
  why: Complete implementation plan with all task details
```

### Current Codebase Structure
```bash
src/
├── app/
│   └── page.tsx                     # Main page with calendar display
├── components/
│   ├── bottom-toolbar.tsx           # Mobile toolbar (reference pattern)
│   ├── floating-action-menu.tsx     # Will be removed in Task 2
│   ├── calendar/                    # Calendar components
│   │   ├── CalendarDisplay.tsx
│   │   └── CalendarGenerator.tsx
│   ├── ui/                          # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   └── [other ui components]
│   └── [other components]
├── contexts/
│   ├── CalendarContext.tsx
│   └── UIContext.tsx
└── hooks/
    ├── useExportCalendar.ts
    ├── useScheduleManagement.ts
    └── useShareCalendar.ts
```

### Desired Structure After Task 1
```bash
src/components/
├── desktop/                          # NEW: Desktop-specific components
│   ├── DesktopSidebar.tsx          # Main sidebar container
│   └── tabs/                        # Tab content components
│       ├── ExportTab.tsx           # Export functionality tab
│       ├── SaveTab.tsx              # Save & share tab
│       └── SettingsTab.tsx         # Settings tab placeholder
└── ui/
    └── tabs.tsx                     # NEW: Will need to be added via shadcn/ui
```

### Known Codebase Patterns & Conventions
```typescript
// CRITICAL: All client components must have 'use client' directive
// Pattern: TypeScript interfaces for all component props
// Pattern: Lucide React icons for all icons
// Pattern: Tailwind classes for styling (no separate CSS files)
// Pattern: cn() utility from @/lib/utils for className merging
// Convention: Component files use PascalCase with .tsx extension
// Convention: Import paths use @/ alias for src/ directory
```

## Implementation Blueprint

### Prerequisites
Before creating files, need to install the Tabs component from shadcn/ui:
```bash
pnpm dlx shadcn@latest add tabs
```

### Task Details

#### Step 1: Install shadcn/ui Tabs Component
```bash
# This command will:
# - Create src/components/ui/tabs.tsx
# - Add necessary Radix UI dependencies
# - Apply proper styling consistent with the project
pnpm dlx shadcn@latest add tabs
```

#### Step 2: Create Directory Structure
```bash
# Create the desktop components directory structure
mkdir -p src/components/desktop/tabs
```

#### Step 3: Create Component Files

**CREATE src/components/desktop/DesktopSidebar.tsx:**
```typescript
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

**CREATE src/components/desktop/tabs/ExportTab.tsx:**
```typescript
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

**CREATE src/components/desktop/tabs/SaveTab.tsx:**
```typescript
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

**CREATE src/components/desktop/tabs/SettingsTab.tsx:**
```typescript
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

### Integration Points
```yaml
COMPONENTS:
  - location: src/components/desktop/
  - pattern: Follow existing component patterns from bottom-toolbar.tsx
  
STYLING:
  - approach: Tailwind utility classes only
  - theme: Glass morphism with backdrop-blur and white/opacity
  
FUTURE INTEGRATION (Task 2):
  - Import in: src/app/page.tsx
  - Replace: floating-action-menu.tsx
  - Condition: Show only when isMobileView === false
```

## Validation Loop

### Level 1: Syntax & TypeScript Checking
```bash
# After creating all files, verify TypeScript compilation
pnpm run build

# Expected: Build should complete without errors
# If errors: Check for missing imports or type issues
```

### Level 2: Component Structure Validation
```bash
# Verify all files exist
ls -la src/components/desktop/
ls -la src/components/desktop/tabs/
ls -la src/components/ui/tabs.tsx

# Expected: All files should be present
```

### Level 3: Linting Check
```bash
# Run Next.js linting
pnpm run lint

# Expected: No linting errors
# Common fixes:
# - Add 'use client' directive if missing
# - Fix any unused variables
# - Ensure proper TypeScript types
```

### Level 4: Development Server Test
```bash
# Start dev server to ensure no runtime errors
pnpm dev

# Visit http://localhost:3000
# Expected: App should load without console errors
# Note: Sidebar won't be visible yet (Task 2 handles integration)
```

## Final Validation Checklist
- [ ] shadcn/ui Tabs component installed successfully
- [ ] All 4 component files created in correct locations
- [ ] All components have 'use client' directive
- [ ] TypeScript build passes: `pnpm run build`
- [ ] Linting passes: `pnpm run lint`
- [ ] Dev server runs without errors: `pnpm dev`
- [ ] Component structure matches existing patterns
- [ ] Ready for Task 2 integration

## Anti-Patterns to Avoid
- ❌ Don't add complex logic in this task - keep it structural only
- ❌ Don't import hooks or contexts yet - will be added in later tasks
- ❌ Don't modify existing files in this task
- ❌ Don't add component functionality beyond placeholders
- ❌ Don't skip the 'use client' directive for client components
- ❌ Don't use CSS modules or separate stylesheets

## Notes for Next Tasks
- Task 2 will integrate the sidebar into page.tsx and remove floating-action-menu.tsx
- Task 3 will implement the Export tab functionality
- Task 4 will implement the Save & Share tab
- Task 5 will add Settings tab and final polish

## Confidence Score
**9/10** - This is a straightforward scaffolding task with clear patterns to follow. The only potential issue is the shadcn/ui installation step which depends on external tooling.