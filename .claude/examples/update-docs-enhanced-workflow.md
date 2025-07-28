# Enhanced Documentation Update Workflow Example

This example demonstrates how the `/update-docs-enhanced` command works when analyzing and updating documentation after significant code changes.

## Scenario: Adding a New Export Feature

Let's say you've just implemented a new iCal export feature for the Offshore Mate calendar app. Here's how the enhanced documentation updater would handle it:

### 1. Initial Command
```
/update-docs-enhanced feature
```

### 2. What Happens Behind the Scenes

#### Phase 1: Code Analysis
The command launches specialized agents that:

```bash
# Analyzes git changes
git diff --name-only HEAD~5..HEAD

# Output:
src/hooks/useICalExport.ts
src/components/export-format-selector.tsx
src/lib/utils/ical-export.ts
package.json
```

#### Phase 2: Deep Feature Analysis
The system performs intelligent analysis:

**Component Analysis:**
```typescript
// Detected new component: ExportFormatSelector
interface ExportFormatSelectorProps {
  onExport: (format: 'png' | 'pdf' | 'ical') => void;
  isExporting: boolean;
  availableFormats?: ExportFormat[];
}

// Usage pattern found in: src/components/floating-action-menu.tsx
<ExportFormatSelector
  onExport={handleExport}
  isExporting={isExporting}
  availableFormats={['png', 'pdf', 'ical']}
/>
```

**Hook Analysis:**
```typescript
// Detected new hook: useICalExport
function useICalExport() {
  // Returns:
  // - exportToICal: (schedule: Schedule) => Promise<void>
  // - isExporting: boolean
  // - error: Error | null
}
```

**Dependency Detection:**
```json
// New dependency found in package.json:
"ical-generator": "^3.6.1"
```

### 3. Documentation Generation

#### README.md Updates
```markdown
## 🌟 Features

<!-- AUTO-UPDATE:START -->
- **Multiple Rotation Patterns**
  - 14/14 (14 days on, 14 days off)
  - 14/21 (14 days on, 21 days off)
  - 21/21 (21 days on, 21 days off)
  - 28/28 (28 days on, 28 days off)

- **Interactive Calendar**
  - Visual distinction between work days, off days, and transition days
  - Month-by-month view for easy planning
  - Color-coded calendar entries
  - Responsive design for all devices

- **Export Capabilities**
  - Download calendars as high-quality PNG images
  - Export to PDF for printing and sharing
  - NEW: Export to iCal format for calendar app integration ✨
  - Perfect for sharing or printing
  - Optimized for various screen sizes
<!-- AUTO-UPDATE:END -->

## 🛠️ Tech Stack

<!-- AUTO-UPDATE:START -->
- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** 
  - Radix UI primitives
  - shadcn/ui components
  - Custom components
- **Date Handling:** date-fns
- **Calendar Generation:** Custom implementation
- **Export Formats:** 
  - Image: html2canvas
  - PDF: jsPDF
  - iCal: ical-generator ✨
- **Icons:** Lucide React
<!-- AUTO-UPDATE:END -->
```

#### CLAUDE.md Updates
```markdown
### Component Development Patterns
<!-- AUTO-UPDATE:START -->
- Use Radix UI primitives for consistent accessibility
- Follow existing glass-morphism design system with `backdrop-blur-xl bg-white/30` patterns
- Implement mobile-responsive patterns with conditional rendering based on `isMobileView`
- Export functionality should handle multiple formats:
  - PNG (html2canvas) for visual sharing
  - PDF (jsPDF) for printing
  - iCal (ical-generator) for calendar integration ✨
- Export format selection uses dropdown pattern with ExportFormatSelector component
- All export operations should show loading state and handle errors gracefully
<!-- AUTO-UPDATE:END -->

### Export Implementation Pattern
<!-- AUTO-UPDATE:START -->
When implementing export features:
1. Create a dedicated hook (e.g., `useICalExport`) that encapsulates:
   - Export logic
   - Loading state management
   - Error handling
   - Success notifications

2. Use the ExportFormatSelector component for consistent UI:
   ```tsx
   <ExportFormatSelector
     onExport={handleExport}
     isExporting={isExporting}
     availableFormats={supportedFormats}
   />
   ```

3. Handle format-specific logic in the export handler:
   ```tsx
   const handleExport = async (format: ExportFormat) => {
     switch (format) {
       case 'ical':
         await exportToICal(schedule);
         break;
       // ... other formats
     }
   };
   ```
<!-- AUTO-UPDATE:END -->
```

#### Technical Documentation (docs/features/export-functionality.md)
```markdown
# Export Functionality

<!-- AUTO-UPDATE:START -->
## Supported Export Formats

### 1. PNG Export
- Library: html2canvas
- Use case: Social media sharing, visual reference
- File size: ~200-500KB

### 2. PDF Export  
- Library: jsPDF
- Use case: Printing, formal documentation
- Features: Multi-page support, custom headers

### 3. iCal Export ✨
- Library: ical-generator
- Use case: Calendar app integration (Google Calendar, Outlook, Apple Calendar)
- Features:
  - Creates recurring events for work rotations
  - Includes event descriptions and categories
  - Timezone-aware event generation
  - Compatible with major calendar applications

## Implementation Guide

### Using the Export Hooks

```typescript
// For iCal export
import { useICalExport } from '@/hooks/useICalExport';

function MyComponent() {
  const { exportToICal, isExporting, error } = useICalExport();
  
  const handleExport = async () => {
    try {
      await exportToICal({
        schedule: currentSchedule,
        timezone: userTimezone,
        includeTransitionDays: true
      });
    } catch (err) {
      console.error('Export failed:', err);
    }
  };
}
```

### Export Format Selector Component

```typescript
import { ExportFormatSelector } from '@/components/export-format-selector';

// Basic usage
<ExportFormatSelector
  onExport={(format) => handleExport(format)}
  isExporting={isExporting}
/>

// With custom formats
<ExportFormatSelector
  onExport={(format) => handleExport(format)}
  isExporting={isExporting}
  availableFormats={['png', 'pdf', 'ical']}
  formatLabels={{
    ical: 'Calendar App (iCal)'
  }}
/>
```
<!-- AUTO-UPDATE:END -->
```

### 4. Summary Report

```
📝 Enhanced Documentation Update Complete
========================================

Analysis Type: Feature Analysis
Focus: iCal Export Implementation

Files Analyzed:
✓ src/hooks/useICalExport.ts (New hook)
✓ src/components/export-format-selector.tsx (Modified)
✓ src/lib/utils/ical-export.ts (New utility)
✓ package.json (New dependency)

Documentation Updated:
✓ README.md
  - Added iCal export to features list
  - Updated tech stack with ical-generator
  
✓ CLAUDE.md
  - Added export pattern documentation
  - Included implementation guidelines
  - Updated component patterns

✓ docs/features/export-functionality.md (Created)
  - Comprehensive export format guide
  - Implementation examples
  - API documentation

Key Additions:
• New Export Format: iCal calendar integration
• New Hook: useICalExport for calendar exports
• New Component Pattern: ExportFormatSelector
• New Dependency: ical-generator v3.6.1

Semantic Version Suggestion: 
Minor version bump (1.1.0 → 1.2.0) - New feature added

Review the changes above and commit when satisfied!
```

### 5. Interactive Elements

The enhanced command also:
- Shows diffs before applying changes
- Allows selective updates (accept/reject per file)
- Creates backup files
- Validates markdown syntax
- Ensures code examples compile

## Command Variations

### Component Analysis
```
/update-docs-enhanced component
```
Focuses on React component documentation, prop tables, and usage examples.

### Hook Analysis
```
/update-docs-enhanced hook
```
Deep-dives into custom hooks, their parameters, return values, and usage patterns.

### Dependency Analysis
```
/update-docs-enhanced dependency
```
Analyzes package.json changes and updates installation instructions and dependency documentation.

### Comprehensive Analysis
```
/update-docs-enhanced all
```
Performs all analysis types and generates the most thorough documentation updates.

## Benefits Over Basic Update

| Feature | Basic `/update-docs` | Enhanced `/update-docs-enhanced` |
|---------|---------------------|----------------------------------|
| Git diff analysis | ✓ | ✓ |
| Auto-update markers | ✓ | ✓ |
| Component prop extraction | Basic | Advanced with types |
| Usage example generation | ❌ | ✓ |
| Hook documentation | Basic | Comprehensive |
| API documentation | ❌ | ✓ |
| Version suggestions | ❌ | ✓ |
| Implementation patterns | ❌ | ✓ |
| Code validation | ❌ | ✓ |

The enhanced command provides a much more thorough and intelligent documentation update process!