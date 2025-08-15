name: "URL Shortening Service for Shared Calendars - Context-Rich PRP"
description: |

## Purpose
Comprehensive PRP optimized for AI agents to implement URL shortening feature with sufficient context and self-validation capabilities to achieve working code through iterative refinement.

## Core Principles
1. **Context is King**: Include ALL necessary documentation, examples, and caveats
2. **Validation Loops**: Provide executable tests/lints the AI can run and fix
3. **Information Dense**: Use keywords and patterns from the codebase
4. **Progressive Success**: Start simple, validate, then enhance
5. **Global rules**: Be sure to follow all rules in CLAUDE.md

---

## Goal
Build a URL shortening service that replaces long, pako-compressed calendar URLs with clean, branded short URLs (e.g., `offshore-mate.app/s/aB1cD2eF`) to improve user experience and reduce URL complexity for shared calendars.

## Why
- **User Experience**: Current URLs with pako-compressed data are unwieldy (often >500 chars) and not user-friendly
- **Mobile Sharing**: Long URLs break on WhatsApp, email, and other mobile platforms
- **Brand Recognition**: Short URLs with domain branding improve trust and professional appearance
- **Analytics Potential**: Short URLs enable tracking of calendar share engagement (future enhancement)
- **Reliability**: Reduces URL encoding issues and improves cross-platform compatibility

## What
Replace the current direct URL data encoding system with a serverless URL shortening service that stores URL mappings in a key-value store and provides instant redirects.

### Success Criteria
- [ ] Short URLs under 50 characters (e.g., `https://domain.com/s/aB1cD2eF`)
- [ ] ShareModal generates short URLs within 2 seconds
- [ ] Redirects work consistently across all browsers and platforms
- [ ] Graceful fallback to long URLs if shortening fails
- [ ] 90-day TTL for short URLs (matches business requirements)
- [ ] All existing share functionality (WhatsApp, Email, Native Share) uses short URLs
- [ ] Mobile and desktop responsive UI maintains current patterns

## All Needed Context

### Documentation & References
```yaml
# MUST READ - Include these in your context window
- url: https://www.npmjs.com/package/@vercel/kv
  why: Vercel KV API methods (get, set, TTL) - CRITICAL: Being sunset, plan alternatives
  
- url: https://www.npmjs.com/package/nanoid
  why: Secure URL-friendly ID generation with custom lengths
  critical: Use collision calculator for safe ID lengths
  
- url: https://nextjs.org/docs/app/api-reference/file-conventions/route
  section: Route Handlers (POST/GET patterns)
  critical: Next.js 15 App Router API route patterns for request/response handling

- file: src/components/ShareModal.tsx
  why: Current sharing UI patterns, error handling, loading states, mobile responsiveness
  
- file: src/lib/utils/share.ts
  why: Current URL generation patterns, pako compression logic, share utilities to maintain
  
- file: src/app/shared/[id]/page.tsx
  why: Current shared calendar display patterns, URL parameter handling, error states

- file: CLAUDE.md
  why: Project-specific rules, development commands, architecture patterns
```

### Current Codebase tree (project structure overview)
```bash
src/
├── app/
│   ├── shared/[id]/page.tsx          # Current shared calendar display
│   ├── layout.tsx                    # App layout with providers
│   └── globals.css                   # Global styles
├── components/
│   ├── ShareModal.tsx                # Current share UI - MODIFY
│   └── ui/                          # shadcn/ui components
├── lib/utils/
│   ├── share.ts                     # Current share logic - MODIFY
│   └── storage.ts                   # SavedSchedule types
├── contexts/
│   ├── CalendarContext.tsx          # Calendar state management
│   └── UIContext.tsx               # UI state (error messages)
└── hooks/
    └── useShareCalendar.ts          # Share-related hooks
```

### Desired Codebase tree with files to be added and responsibility of file
```bash
src/
├── app/
│   ├── api/
│   │   └── share/
│   │       └── route.ts             # NEW: POST endpoint for URL shortening
│   ├── s/[shareId]/
│   │   └── page.tsx                 # NEW: Redirect handler for short URLs
│   └── shared/[id]/page.tsx         # MODIFY: Handle both short and long URL patterns
├── components/
│   └── ShareModal.tsx               # MODIFY: Integrate short URL generation
├── lib/utils/
│   └── share.ts                     # MODIFY: Add shortening utilities
```

### Known Gotchas of our codebase & Library Quirks
```typescript
// CRITICAL: Vercel KV is being sunset as of June 2025
// Must plan for marketplace storage alternatives (Redis, Upstash)
// Current @vercel/kv package still works but plan migration

// CRITICAL: This codebase uses 'use client' for client components
// API routes MUST be server components (no 'use client')

// CRITICAL: Current URL generation pattern in share.ts:
// Uses pako compression + URL encoding - MUST maintain fallback compatibility

// CRITICAL: ShareModal uses useEffect for URL generation
// Short URL generation should happen on modal open, not in render

// CRITICAL: TypeScript strict mode enabled
// All types must be properly defined, especially for API routes

// CRITICAL: Mobile responsiveness patterns use isMobileView detection
// New UI must follow existing responsive patterns in ShareModal

// CRITICAL: Error handling uses setErrorMessage from UIContext
// Must integrate with existing error handling patterns

// CRITICAL: nanoid security requirement
// Must use 8+ character IDs to avoid collisions with expected traffic volume
```

## Implementation Blueprint

### Data models and structure

```typescript
// NEW: Short URL mapping structure for KV store
interface ShortUrlMapping {
  longUrl: string;
  createdAt: string;
  expiresAt: string;
  scheduleId: string;
}

// NEW: API request/response types
interface ShortenUrlRequest {
  longUrl: string;
}

interface ShortenUrlResponse {
  shortUrl: string;
  expiresAt: string;
}

// EXISTING: Maintain compatibility with current SavedSchedule type
// from src/lib/utils/storage.ts - no changes needed
```

### List of tasks to be completed to fulfill the PRP in the order they should be completed

```yaml
Task 1: Install Dependencies
COMMAND: pnpm install @vercel/kv nanoid
MODIFY: package.json
  - ADD: "@vercel/kv": "^0.2.3"
  - ADD: "nanoid": "^5.0.4"
  - ADD: "@types/nanoid": "^3.0.0" (dev dependency)

Task 2: Create API Route for URL Shortening
CREATE: src/app/api/share/route.ts
  - IMPLEMENT: POST handler for URL shortening
  - PATTERN: Follow Next.js 15 App Router API patterns
  - SECURITY: Validate input URLs are from same domain
  - TTL: Set 90-day expiration (7,776,000 seconds)
  - ERROR: Handle Vercel KV failures gracefully

Task 3: Create Short URL Redirect Handler
CREATE: src/app/s/[shareId]/page.tsx
  - IMPLEMENT: Server component with async redirect
  - PATTERN: Mirror existing src/app/shared/[id]/page.tsx structure
  - HANDLE: 404 for expired/invalid short IDs using notFound()
  - SECURITY: No client-side logic needed

Task 4: Update Share Utilities
MODIFY: src/lib/utils/share.ts
  - ADD: shortenUrl() function that calls API endpoint
  - ADD: Error handling for API failures with fallback to long URLs
  - PRESERVE: All existing functions (WhatsApp, email, native share)
  - MAINTAIN: Backward compatibility with existing URL patterns

Task 5: Update ShareModal Component
MODIFY: src/components/ShareModal.tsx
  - ADD: Loading state for short URL generation
  - MODIFY: useEffect to call shortenUrl() instead of generateShareUrl()
  - MAINTAIN: All existing UI patterns and mobile responsiveness
  - FALLBACK: Use long URL if shortening fails
  - ERROR: Integrate with existing UIContext error handling

Task 6: Update Shared Calendar Page (Optional Enhancement)
MODIFY: src/app/shared/[id]/page.tsx
  - ADD: Support for both short and long URL patterns
  - MAINTAIN: Existing error handling and loading states
  - PRESERVE: All current functionality

Task 7: Environment Configuration
MODIFY: Project environment setup
  - ADD: KV_REST_API_URL environment variable
  - ADD: KV_REST_API_TOKEN environment variable
  - DOCUMENT: Setup instructions for Vercel KV database
```

### Per task pseudocode as needed added to each task

```typescript
// Task 2: API Route pseudocode
// src/app/api/share/route.ts
export async function POST(request: NextRequest) {
  try {
    // PATTERN: Standard Next.js request parsing
    const { longUrl } = await request.json()
    
    // SECURITY: Validate URL is from same domain
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000'
    
    if (!longUrl.startsWith(baseUrl)) {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
    }
    
    // CRITICAL: Use 8-character nanoid for security
    const shareId = nanoid(8)
    const key = `share:${shareId}`
    
    // CRITICAL: 90-day TTL (7,776,000 seconds)
    await kv.set(key, longUrl, { ex: 7776000 })
    
    const shortUrl = `${baseUrl}/s/${shareId}`
    return NextResponse.json({ shortUrl, shareId })
    
  } catch (error) {
    // PATTERN: Consistent error handling
    console.error('URL shortening failed:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// Task 3: Redirect Handler pseudocode  
// src/app/s/[shareId]/page.tsx
export default async function ShortUrlRedirect({ params }: { params: Promise<{ shareId: string }> }) {
  const { shareId } = await params
  
  try {
    const longUrl = await kv.get<string>(`share:${shareId}`)
    
    if (!longUrl) {
      notFound() // Built-in Next.js 404 page
    }
    
    redirect(longUrl) // Built-in Next.js redirect
  } catch (error) {
    console.error('Redirect failed:', error)
    notFound()
  }
}

// Task 5: ShareModal integration pseudocode
// MODIFY useEffect in ShareModal.tsx
useEffect(() => {
  if (isOpen && yearCalendar?.length > 0) {
    setIsLoading(true)
    
    // Generate long URL (existing pattern)
    const longUrl = shareUtils.generateShareUrl(scheduleId, schedule)
    
    // NEW: Call shortening API with fallback
    shareUtils.shortenUrl(longUrl)
      .then(result => {
        setShareUrl(result.shortUrl || longUrl) // Fallback to long URL
      })
      .catch(error => {
        console.error('Shortening failed:', error)
        setShareUrl(longUrl) // Always fallback
        setErrorMessage('Short link generation failed, using full link')
      })
      .finally(() => setIsLoading(false))
  }
}, [isOpen, yearCalendar, scheduleId])
```

### Integration Points
```yaml
ENVIRONMENT:
  - setup: Vercel dashboard -> Storage -> KV Database
  - variables: KV_REST_API_URL, KV_REST_API_TOKEN (auto-added by Vercel)
  
API:
  - endpoint: POST /api/share (new)
  - response: { shortUrl: string, shareId: string }
  - error: 400 for invalid URL, 500 for server errors
  
ROUTING:
  - add: /s/[shareId] route for redirects
  - modify: ShareModal to call API
  - preserve: /shared/[id] for existing functionality

DATABASE:
  - store: Key-value pairs in Vercel KV
  - pattern: "share:${nanoid}" -> longUrl
  - ttl: 90 days (7,776,000 seconds)
```

## Validation Loop

### Level 1: Syntax & Style
```bash
# Run these FIRST - fix any errors before proceeding
pnpm lint                            # ESLint with Next.js rules
npx tsc --noEmit                     # TypeScript compilation check

# Expected: No errors. If errors, READ the error and fix.
```

### Level 2: Unit Tests (manual testing approach)
```typescript
// MANUAL TEST: API endpoint functionality
// 1. Start dev server
pnpm dev

// 2. Test API endpoint with curl
curl -X POST http://localhost:3000/api/share \
  -H "Content-Type: application/json" \
  -d '{"longUrl": "http://localhost:3000/shared/test?data=compressed_data"}'

// Expected response:
// {"shortUrl": "http://localhost:3000/s/abcd1234", "shareId": "abcd1234"}

// 3. Test redirect functionality
curl -I http://localhost:3000/s/abcd1234
// Expected: HTTP 302 redirect to original URL

// 4. Test invalid short ID
curl -I http://localhost:3000/s/invalid
// Expected: HTTP 404 Not Found

// MANUAL TEST: ShareModal integration
// 1. Generate calendar in UI
// 2. Open share modal
// 3. Verify short URL appears within 2 seconds
// 4. Test copy, WhatsApp, email functions use short URL
// 5. Test short URL actually redirects to working calendar
```

### Level 3: Integration Test
```bash
# Start the service
pnpm dev

# Test complete flow:
# 1. Generate calendar
# 2. Share modal -> should show short URL
# 3. Copy short URL
# 4. Open in new tab -> should redirect to original calendar
# 5. Verify calendar displays correctly

# Test error scenarios:
# 1. Disconnect internet -> should fallback to long URL
# 2. Invalid calendar data -> should show appropriate error
# 3. Expired short URL -> should show 404
```

## Final validation Checklist
- [ ] All TypeScript compilation passes: `npx tsc --noEmit`
- [ ] No linting errors: `pnpm lint`
- [ ] API endpoint returns short URLs: Manual curl test
- [ ] Short URLs redirect correctly: Manual browser test
- [ ] ShareModal shows loading state and updates with short URL
- [ ] All existing share functions (WhatsApp, email, copy) work with short URLs
- [ ] Graceful fallback to long URLs when shortening fails
- [ ] Mobile responsive UI maintained (test on mobile device)
- [ ] Error messages appear in UI when appropriate

---

## Anti-Patterns to Avoid
- ❌ Don't create new UI patterns when existing ones work (follow ShareModal patterns)
- ❌ Don't skip validation because "it should work" (always validate URLs)
- ❌ Don't ignore Vercel KV deprecation - plan for alternatives
- ❌ Don't use client-side logic in API routes (server components only)
- ❌ Don't break existing long URL compatibility (graceful fallback)
- ❌ Don't hardcode TTL or domain values (use environment variables)
- ❌ Don't ignore mobile responsiveness (existing patterns must be maintained)

## Confidence Score: 8/10
**Reasoning**: High confidence due to comprehensive context, existing similar patterns in codebase, well-documented APIs, and clear fallback strategies. Deducted 2 points for Vercel KV sunset requiring future migration planning.