---
description: Automatically update README, CLAUDE.md, and documentation files based on recent code changes
allowed-tools: ["Bash", "Read", "Edit", "MultiEdit", "Write", "Grep", "Glob", "LS", "TodoWrite"]
argument-hint: "[optional: specific file to update, e.g., README, CLAUDE, or ALL]"
---

# Auto-Update Documentation

I'll analyze recent code changes and update your documentation files accordingly. Let me start by checking what has changed in the codebase.

## Step 1: Analyze Recent Changes

First, I'll check the git status and recent commits to understand what has been modified:

```bash
!git status --porcelain
```

```bash
!git diff --name-only HEAD~5..HEAD 2>/dev/null || git diff --name-only --cached
```

## Step 2: Identify Documentation Files

I'll check which documentation files exist in the project:

```bash
!find . -name "*.md" -not -path "./node_modules/*" -not -path "./.next/*" | sort
```

## Step 3: Analyze Changed Files

Based on the changes detected, I'll:

1. **For TypeScript/React files (.tsx, .ts)**:
   - Extract new component definitions and their props
   - Identify new hooks and utilities
   - Note any new API endpoints or services
   - Check for new context providers or state management

2. **For package.json changes**:
   - Identify new dependencies
   - Update installation instructions if needed
   - Note any script changes

3. **For configuration files**:
   - Update setup instructions
   - Note any new environment variables

4. **For new features**:
   - Extract feature descriptions from code comments
   - Identify user-facing functionality

## Step 4: Update Documentation

I'll update the following files based on the analysis:

### README.md Updates:
- Features section for new functionality
- Installation/setup changes
- Usage examples for new features
- Dependencies updates

### CLAUDE.md Updates:
- New development patterns discovered
- Code quality standards based on implementations
- Component patterns used
- New architectural decisions

### docs/ Updates:
- Technical documentation for new components
- API documentation for new endpoints
- Architecture updates

## Step 5: Create Update Summary

After updating, I'll provide a summary of:
- Which files were updated
- What sections were modified
- Key changes made
- Any manual review needed

## Auto-Update Markers

To ensure safe updates, I'll look for and respect these markers in documentation files:

```markdown
<!-- AUTO-UPDATE:START -->
Content here will be automatically updated
<!-- AUTO-UPDATE:END -->

<!-- AUTO-UPDATE:SKIP -->
Content here will never be automatically updated
<!-- AUTO-UPDATE:SKIP:END -->
```

## Target File Selection

Based on the argument provided ("$ARGUMENTS"):
- "README" - Update only README.md
- "CLAUDE" - Update only CLAUDE.md  
- "ALL" or empty - Update all documentation files

Let me proceed with analyzing your recent changes and updating the documentation accordingly...