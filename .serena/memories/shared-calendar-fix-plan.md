# Shared Calendar Fix Plan

## Problem Analysis
The shared calendar links currently don't work for new users because:
1. The shared page (`src/app/shared/[id]/page.tsx`) falls back to localStorage when URL data is missing or invalid
2. New users don't have the schedule in their localStorage, so they see "Schedule not found"
3. The current compression method (JSON + base64) creates very long URLs that may exceed browser limits

## Solution Overview
Make shared links completely self-contained by:
1. Removing localStorage fallback from shared page
2. Implementing better compression using pako library
3. Always including calendar data in share URLs
4. Providing clear error messages for incomplete links

## Implementation Tasks

### Phase 1: Install Dependencies
- Install pako library for better compression: `pnpm add pako @types/pako`

### Phase 2: Update Share Utilities
- Enhance compression using pako (zlib compression)
- Implement URL-safe base64 encoding
- Remove URL length check (compression will handle it)

### Phase 3: Fix Shared Page
- Remove localStorage fallback completely
- Only rely on URL data parameter
- Improve error messages for broken/incomplete links

### Phase 4: Update ShareModal
- Ensure it always includes calendar data in URLs
- Remove fallback to simple URL
- Add error handling for compression failures

### Phase 5: Testing & Validation
- Test shared links in incognito/private browsing
- Test with different browsers
- Verify calendar displays correctly for new users
- Check URL length with complex calendars

## Files to Modify
1. `/src/lib/utils/share.ts` - Implement pako compression
2. `/src/app/shared/[id]/page.tsx` - Remove localStorage fallback
3. `/src/components/ShareModal.tsx` - Ensure data always included

## Expected Outcome
- Any user can open a shared link and see the calendar
- No dependency on localStorage for viewing shared calendars
- Smaller, more reliable URLs through compression
- Clear error messages when links are broken