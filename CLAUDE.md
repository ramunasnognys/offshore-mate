# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Offshore Mate is a Next.js 15 web application that generates visual work rotation calendars for offshore workers. The app supports multiple rotation patterns (14/14, 14/21, 21/21, 28/28) and allows users to save/load schedules with local storage.



### 🔄 Project Awareness & Context
- **Always read `PLANNING.md`** at the start of a new conversation to understand the project's architecture, goals, style, and constraints.
- **Check `TASK.md`** before starting a new task. If the task isn’t listed, add it with a brief description and today's date.
- **Use consistent naming conventions, file structure, and architecture patterns** as described in `PLANNING.md`.
- **Use venv_linux** (the virtual environment) whenever executing Python commands, including for unit tests.

### 🧱 Code Structure & Modularity
- **Never create a file longer than 500 lines of code.** If a file approaches this limit, refactor by splitting it into modules or helper files.
- **Organize code into clearly separated modules**, grouped by feature or responsibility.
  For agents this looks like:
    - `agent.py` - Main agent definition and execution logic 
    - `tools.py` - Tool functions used by the agent 
    - `prompts.py` - System prompts
- **Use clear, consistent imports** (prefer relative imports within packages).
- **Use clear, consistent imports** (prefer relative imports within packages).
- **Use python_dotenv and load_env()** for environment variables.



### ✅ Task Completion
- **Mark completed tasks in `TASK.md`** immediately after finishing them.
- Add new sub-tasks or TODOs discovered during development to `TASK.md` under a “Discovered During Work” section.


### 📚 Documentation & Explainability
- **Update `README.md`** when new features are added, dependencies change, or setup steps are modified.
- **Comment non-obvious code** and ensure everything is understandable to a mid-level developer.
- When writing complex logic, **add an inline `# Reason:` comment** explaining the why, not just the what.

### 🧠 AI Behavior Rules
- **Never assume missing context. Ask questions if uncertain.**
- **Never hallucinate libraries or functions** – only use known, verified Python packages.
- **Always confirm file paths and module names** exist before referencing them in code or tests.
- **Never delete or overwrite existing code** unless explicitly instructed to or if part of a task from `TASK.md`.


## Development Guidelines

### Git Branch Strategy
- Feature branches should be named descriptively (e.g., `feature/calendar-improvements`)
- Main branch is `main` for production deployments
- Always commit changes with descriptive messages after completing tasks

### Code Quality Standards
- TypeScript strict mode is enabled - maintain type safety
- React 19 RC is used - be aware of potential compatibility issues with older patterns
- SSR compatibility is critical - always check for `isClient` and `isStorageAvailable()` patterns
- Mobile-first responsive design is mandatory - test both mobile (375x812) and desktop (1280x900) viewports


### Component Development Patterns
- Use Radix UI primitives for consistent accessibility
- Follow existing glass-morphism design system with `backdrop-blur-xl bg-white/30` patterns
- Implement mobile-responsive patterns with conditional rendering based on `isMobileView`
- Export functionality should handle both PNG (html2canvas) and PDF (jsPDF) formats with proper error handling