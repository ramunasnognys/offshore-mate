---
description: Advanced documentation updater with deep code analysis and intelligent content generation
allowed-tools: ["Task", "Bash", "Read", "Edit", "MultiEdit", "Write", "Grep", "Glob", "LS", "TodoWrite", "WebSearch"]
argument-hint: "[component|hook|feature|dependency] - analyze specific types of changes"
---

# Enhanced Documentation Auto-Updater

I'll perform a comprehensive analysis of your codebase changes and intelligently update all documentation files.

## Enhanced Analysis Pipeline

### 1. Deep Code Analysis

I'll use specialized agents to analyze different aspects of your code:

```bash
!echo "Starting enhanced documentation analysis..."
```

Based on the argument provided ("$ARGUMENTS"), I'll focus on:
- **component**: Analyze React components and their props
- **hook**: Analyze custom hooks and their usage
- **feature**: Analyze new features and user-facing changes
- **dependency**: Analyze package.json and dependency changes
- **all** (default): Comprehensive analysis of everything

### 2. Component Analysis

For React components, I'll extract:
- Component name and purpose
- Props interface/type definitions
- Usage examples from the codebase
- Related hooks and contexts used
- Export patterns (default vs named)

### 3. Hook Analysis

For custom hooks, I'll document:
- Hook signature and parameters
- Return values and types
- Internal state management
- Side effects and dependencies
- Usage patterns across components

### 4. Feature Detection

I'll identify new features by:
- Analyzing new routes in app directory
- Detecting new UI components
- Finding new API endpoints
- Checking for new user interactions
- Reviewing commit messages for feature descriptions

### 5. Smart Documentation Generation

I'll generate documentation that includes:

#### For README.md:
- Feature descriptions in user-friendly language
- Updated installation steps if dependencies changed
- New usage examples with screenshots references
- Performance improvements or optimizations

#### For CLAUDE.md:
- New coding patterns discovered
- Architecture decisions made
- Component composition patterns
- State management approaches
- Performance optimization techniques

#### For Technical Docs:
- API documentation with request/response examples
- Component API reference with prop tables
- Hook documentation with usage examples
- Architecture diagrams (as ASCII art)

### 6. Version Management

I'll also:
- Suggest version bumps based on changes (patch/minor/major)
- Generate changelog entries
- Update version history in README

### 7. Quality Checks

Before applying updates:
- Verify all code examples compile
- Check for broken internal links
- Ensure consistent formatting
- Validate markdown syntax
- Preview changes in a diff format

## Execution Plan

Let me analyze your codebase and generate comprehensive documentation updates...

<!-- The Task tool will be used here to launch specialized analysis agents -->