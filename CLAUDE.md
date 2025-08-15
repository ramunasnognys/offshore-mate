# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Plan & Review

### Before starting work
- Always in plan mode to make a plan
- After get the plan, make sure you Write the plan to .claude/tasks/TASK_NAME.md.
- The plan should be a detailed implementation plan and the reasoning behind them, as well as tasks broken down.
- If the task require external knowledge or certain package, also research to get latest knowledge (Use Task tool for research)
- Don't over plan it, always think MVP.
- Once you write the plan, firstly ask me to review it. Do not continue until I approve the plan.

### While implementing
- You should update the plan as you work.
- After you complete tasks in the plan, you should update and append detailed descriptions of the changes you made, so following tasks can be easily hand over to other engineers.

## Project Overview

This is a Next.js SaaS template with AI-based learning features, using:
- **Next.js 15.3.3** with App Router and Turbopack
- **React 19** with TypeScript (strict mode)
- **Supabase** for authentication and database
- **Tailwind CSS v4** with PostCSS
- **shadcn/ui** components (New York style)
- **pnpm** as package manager

## Development Commands

### `bash`
# Start development server with Turbopack
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run Linting
pnpm lint

# Install dependencies
pnpm install

# Add shadcn/ui components
pnpm dlx shadcn@latest add [component-name]

## Architecture & Key Patterns

### Authentication Flow
- Middleware at `middleware.ts` handles session management via Supabase
- Protected routes start with `/app/*`
- Unauthenticated users redirect to `/login`
- Authenticated users at `/` redirect to `/app`
- Server actions for auth operations in `app/login/actions.ts`

## Routing Structure
- **Public routes**: `/`, `/login`, `/auth/*`
- **Protected routes**: `/app/*` (requires authentication)

## Component Architecture
- UI Components use shadcn/ui (located in `components/ui/`)
- Components follow React Server Components (RSC) pattern
- Use `cn()` utility from `lib/utils` for className merging
- Import aliases: `@/components`, `@/lib/utils`, `@/components/ui`, `@/hooks`

## Styling Approach
- Tailwind CSS v4 with CSS variables
- Dark mode support via CSS variables
- Global styles in `app/globals.css`
- Component styles use utility classes, not separate CSS files

## Environment Variables
Required environment variables for Supabase:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY

## Important Implementation Notes
### Supabase Integration
- Server-side client creation uses `@supabase/ssr`
- Middleware handles cookie management for auth persistence
- Use server actions for mutations (see `app/login/actions.ts` pattern)

### TypeScript Configuration
- Strict mode enabled
- Path aliases configured (`@/*` maps to root)
- Use proper typing for all components and functions

### ESLint Setup
- Uses flat config format (eslint.config.mjs)
- Next.js specific rules applied
- Run `pnpm lint` before committing

### Component Development
When adding new features:
1. Use shadcn/ui components when possible
2. Follow RSC patterns (use `use client` only when needed)
3. Place server actions in separate `.ts` files
4. Keep c