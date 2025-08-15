# PRP: Email and WhatsApp Share Integration for Offshore Mate Calendar

## Feature Overview
Implement one-click email and WhatsApp sharing capabilities for the existing Offshore Mate calendar application. The feature will allow users to share their generated rotation calendars via WhatsApp, email, or copy link functionality, with mobile-responsive design and progressive enhancement using the Web Share API.

## Context & Research Findings

### Existing Codebase Architecture
- **Framework**: Next.js 15 with React 19 RC (turbopack in dev)
- **State Management**: Context-based with CalendarContext and UIContext
- **UI Components**: Radix UI primitives in `/src/components/ui/`
- **Design System**: Glass-morphism with `backdrop-blur-xl bg-white/30` patterns
- **Storage**: LocalStorage via `useScheduleManagement` hook
- **Testing**: Playwright E2E tests
- **Mobile Support**: `isMobileView` context for responsive rendering

### Key Files to Reference
- `/src/components/bottom-toolbar.tsx` - Has Share2 button placeholder (line 84)
- `/src/components/floating-action-menu.tsx` - Has Share option placeholder (line 127) 
- `/src/contexts/CalendarContext.tsx` - Central calendar state
- `/src/hooks/useScheduleManagement.ts` - Storage patterns to follow
- `/src/components/ui/dialog.tsx` - Radix dialog component pattern
- `/src/lib/utils/storage.ts` - Storage utilities

### API Documentation References

#### WhatsApp Sharing
- **URL Scheme**: `https://api.whatsapp.com/send?text=ENCODED_TEXT`
- **Mobile Scheme**: `whatsapp://send?text=ENCODED_TEXT`  
- **Documentation**: https://faq.whatsapp.com/425247423114725
- **No auto-send**: User must manually send after pre-fill

#### Email Sharing  
- **Mailto Scheme**: `mailto:?subject=SUBJECT&body=BODY`
- **URL Encoding Required**: Use `encodeURIComponent()`
- **Documentation**: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#href

#### Web Share API
- **Method**: `navigator.share({ title, text, url })`
- **Requires HTTPS**: Only works in secure contexts
- **Documentation**: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share
- **Browser Support**: Check with `navigator.share !== undefined`

## Implementation Blueprint

### Phase 1: Core Share Utilities

```typescript
// src/lib/utils/share.ts
interface ShareData {
  title: string
  text: string
  url: string
  dateRange: string
  rotationPattern: string
}

// Detect mobile for platform-specific URLs
export const isMobile = () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

// Generate share URL with calendar data
export const generateShareUrl = (scheduleId: string): string => {
  const baseUrl = window.location.origin
  return `${baseUrl}/shared/${scheduleId}`
}

// WhatsApp sharing
export const shareViaWhatsApp = (data: ShareData) => {
  const message = `📅 ${data.title}\n\n${data.text}\n\nView calendar: ${data.url}`
  const encodedMessage = encodeURIComponent(message)
  
  const whatsappUrl = isMobile() 
    ? `whatsapp://send?text=${encodedMessage}`
    : `https://api.whatsapp.com/send?text=${encodedMessage}`
  
  window.open(whatsappUrl, '_blank')
}

// Email sharing
export const shareViaEmail = (data: ShareData) => {
  const subject = encodeURIComponent(data.title)
  const body = encodeURIComponent(
    `${data.text}\n\nClick here to view the calendar:\n${data.url}\n\n` +
    `Period: ${data.dateRange}\nRotation: ${data.rotationPattern}`
  )
  
  window.location.href = `mailto:?subject=${subject}&body=${body}`
}

// Web Share API with fallback
export const shareNative = async (data: ShareData): Promise<boolean> => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: data.title,
        text: data.text,
        url: data.url
      })
      return true
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('Share failed:', err)
      }
      return false
    }
  }
  return false
}

// Copy to clipboard
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    const success = document.execCommand('copy')
    document.body.removeChild(textArea)
    return success
  }
}
```

### Phase 2: Share Modal Component

```typescript
// src/components/ShareModal.tsx
import React, { useState } from 'react'
import { Share2, Mail, MessageCircle, Copy, Check, X } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useCalendar } from '@/contexts/CalendarContext'
import { useUI } from '@/contexts/UIContext'
import * as shareUtils from '@/lib/utils/share'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  scheduleId: string
}

export function ShareModal({ isOpen, onClose, scheduleId }: ShareModalProps) {
  const [copied, setCopied] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const { yearCalendar, selectedDate, selectedRotation } = useCalendar()
  const { isMobileView } = useUI()
  
  const shareUrl = shareUtils.generateShareUrl(scheduleId)
  const shareData = {
    title: `My ${selectedRotation} Rotation Schedule`,
    text: `Check out my offshore rotation calendar`,
    url: shareUrl,
    dateRange: `Starting ${selectedDate}`,
    rotationPattern: selectedRotation
  }
  
  const handleCopy = async () => {
    const success = await shareUtils.copyToClipboard(shareUrl)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }
  
  const handleNativeShare = async () => {
    setIsSharing(true)
    const shared = await shareUtils.shareNative(shareData)
    if (!shared) {
      // Show fallback options if native share fails
    }
    setIsSharing(false)
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md backdrop-blur-xl bg-white/95">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share Your Calendar
          </DialogTitle>
        </DialogHeader>
        
        {/* Preview Section */}
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-gray-50/50 backdrop-blur border border-gray-200/50">
            <p className="text-sm text-gray-600 mb-2">Share Preview</p>
            <p className="font-medium">{shareData.title}</p>
            <p className="text-sm text-gray-500 mt-1">{shareData.dateRange}</p>
            <div className="mt-3 p-2 bg-white/80 rounded border border-gray-200/50">
              <p className="text-xs text-gray-500 break-all">{shareUrl}</p>
            </div>
          </div>
          
          {/* Share Options */}
          <div className="grid gap-2">
            {/* Native Share (if available) */}
            {navigator.share && (
              <button
                onClick={handleNativeShare}
                disabled={isSharing}
                className="flex items-center justify-center gap-2 w-full py-3 px-4 
                  bg-gradient-to-r from-orange-500 to-orange-600 text-white 
                  rounded-xl hover:shadow-lg transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Share2 className="w-5 h-5" />
                Share
              </button>
            )}
            
            {/* WhatsApp */}
            <button
              onClick={() => shareUtils.shareViaWhatsApp(shareData)}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 
                bg-green-500 text-white rounded-xl hover:bg-green-600 
                hover:shadow-lg transition-all duration-200"
            >
              <MessageCircle className="w-5 h-5" />
              Share on WhatsApp
            </button>
            
            {/* Email */}
            <button
              onClick={() => shareUtils.shareViaEmail(shareData)}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 
                bg-blue-500 text-white rounded-xl hover:bg-blue-600 
                hover:shadow-lg transition-all duration-200"
            >
              <Mail className="w-5 h-5" />
              Share via Email
            </button>
            
            {/* Copy Link */}
            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 
                bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 
                hover:shadow transition-all duration-200"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-green-500">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  Copy Link
                </>
              )}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

### Phase 3: Hook Integration

```typescript
// src/hooks/useShareCalendar.ts
import { useState, useCallback } from 'react'
import { useCalendar } from '@/contexts/CalendarContext'
import { generateScheduleId } from '@/lib/utils/storage'

export function useShareCalendar() {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [shareId, setShareId] = useState<string | null>(null)
  const { yearCalendar, selectedRotation, selectedDate } = useCalendar()
  
  const openShareModal = useCallback(() => {
    if (!yearCalendar || yearCalendar.length === 0) {
      // Show error: Generate calendar first
      return
    }
    
    // Generate or get existing share ID
    const id = shareId || generateScheduleId()
    setShareId(id)
    setIsShareModalOpen(true)
  }, [yearCalendar, shareId])
  
  const closeShareModal = useCallback(() => {
    setIsShareModalOpen(false)
  }, [])
  
  return {
    isShareModalOpen,
    shareId,
    openShareModal,
    closeShareModal
  }
}
```

### Phase 4: Component Integration

```typescript
// Update src/components/bottom-toolbar.tsx
import { useShareCalendar } from '@/hooks/useShareCalendar'
import { ShareModal } from '@/components/ShareModal'

// In component:
const { isShareModalOpen, shareId, openShareModal, closeShareModal } = useShareCalendar()

// Update Share button onClick:
onClick={openShareModal}

// Add modal before closing tags:
{shareId && (
  <ShareModal 
    isOpen={isShareModalOpen}
    onClose={closeShareModal}
    scheduleId={shareId}
  />
)}
```

## Implementation Tasks

1. Create `/src/lib/utils/share.ts` with share utility functions
2. Create `/src/components/ShareModal.tsx` with Radix UI dialog
3. Create `/src/hooks/useShareCalendar.ts` for share state management
4. Update `/src/components/bottom-toolbar.tsx` to integrate share modal
5. Update `/src/components/floating-action-menu.tsx` to integrate share modal
6. Create shared calendar route `/src/app/shared/[id]/page.tsx` (if needed)
7. Add Playwright tests for share functionality
8. Test on mobile devices and various browsers

## Validation Gates

```bash
# TypeScript and linting
npm run lint

# Build verification  
npm run build

# Run existing tests
npx playwright test

# Test share functionality manually:
# 1. Generate calendar with any rotation pattern
# 2. Click share button
# 3. Verify modal opens with preview
# 4. Test WhatsApp share (opens WhatsApp with pre-filled message)
# 5. Test email share (opens email client with pre-filled content)
# 6. Test copy link (copies to clipboard with success feedback)
# 7. Test on mobile device for responsive design
# 8. Test Web Share API on supported browsers
```

## Success Criteria

- ✅ One-click WhatsApp sharing opens WhatsApp with pre-filled message
- ✅ One-click email sharing opens email client with pre-filled content  
- ✅ Copy link function works with visual feedback
- ✅ All sharing methods work on mobile and desktop
- ✅ Share preview accurately shows what will be sent
- ✅ Modal follows existing glass-morphism design patterns
- ✅ Proper error handling for unsupported browsers
- ✅ TypeScript fully typed with no errors
- ✅ All existing tests continue to pass

## Error Handling & Edge Cases

1. **No Calendar Generated**: Show user-friendly message to generate calendar first
2. **Browser Compatibility**: Graceful fallback if Web Share API unavailable
3. **Copy Failure**: Fallback to older clipboard API for legacy browsers
4. **WhatsApp Not Installed**: Opens web.whatsapp.com on desktop
5. **Email Client Not Configured**: Browser will handle with appropriate message
6. **Mobile Detection**: Use user agent with fallback to feature detection

## Security Considerations

- No sensitive data in URLs (only schedule ID)
- URL encoding to prevent injection attacks
- HTTPS required for Web Share API and clipboard access
- No auto-send capabilities (user must confirm)

## Performance Optimizations

- Lazy load ShareModal component
- Memoize share URL generation
- Debounce copy feedback animation
- Use CSS animations over JavaScript where possible

## Future Enhancements

- SMS sharing option
- QR code generation for easy mobile scanning
- Social media integrations (LinkedIn, Facebook)
- Custom message templates
- Analytics tracking for share methods
- Share history/tracking

## PRP Confidence Score: 9/10

High confidence due to:
- Clear requirements from INITIAL.md
- Existing UI patterns and components to follow
- Well-documented external APIs
- Established testing patterns
- Similar features already implemented (export functionality)

Minor uncertainty (-1 point) for:
- React 19 RC potential compatibility issues
- Actual shared calendar route implementation details not specified