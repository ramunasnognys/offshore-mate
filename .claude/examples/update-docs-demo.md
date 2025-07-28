# Documentation Update Demo

## Example Usage

After making changes to your code, you can use the documentation update commands:

### Basic Update
```
/update-docs
```

This will:
1. Check recent git changes
2. Analyze modified files
3. Update sections marked with `<!-- AUTO-UPDATE:START -->` tags
4. Show you a summary of changes

### Targeted Updates
```
/update-docs README
```
Updates only the README.md file

```
/update-docs CLAUDE
```
Updates only the CLAUDE.md file

### Enhanced Analysis
```
/update-docs-enhanced component
```
Performs deep analysis of React components and updates documentation with:
- Component API references
- Props documentation
- Usage examples
- Integration patterns

## Example Output

When you run `/update-docs`, you might see:

```
📝 Documentation Update Summary
================================

Files Analyzed:
✓ src/components/calendar/CalendarDisplay.tsx
✓ src/hooks/useExportCalendar.ts
✓ package.json

Documentation Updated:
✓ README.md
  - Added new export formats to Features section
  - Updated Tech Stack with new dependencies
  
✓ CLAUDE.md
  - Added new component patterns
  - Updated code quality standards

Changes Made:
- Added PDF export capability documentation
- Documented new useExportCalendar hook
- Updated dependency list with jsPDF

Review the changes and commit when ready!
```

## Automatic Suggestions

After making several code changes, you'll see:

```
📝 You've made 5 significant code changes. Consider running '/update-docs' to update your documentation files (README.md, CLAUDE.md, etc.) to reflect these changes.
```

This helps ensure your documentation stays in sync with your code!