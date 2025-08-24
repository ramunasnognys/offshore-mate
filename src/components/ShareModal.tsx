'use client'

import React, { useState, useEffect } from 'react'
import { Share2, Mail, MessageCircle, Copy, Check, X } from 'lucide-react'
import { Dialog, DialogContent, DialogBottomContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useCalendar } from '@/contexts/CalendarContext'
import { useUI } from '@/contexts/UIContext'
import { SavedSchedule } from '@/lib/utils/storage'
import { useMobileDetection } from '@/hooks/useMobileDetection'
import * as shareUtils from '@/lib/utils/share'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  scheduleId: string
}

export function ShareModal({ isOpen, onClose, scheduleId }: ShareModalProps) {
  const [copied, setCopied] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [isGeneratingUrl, setIsGeneratingUrl] = useState(false)
  const { yearCalendar, selectedDate, selectedRotation } = useCalendar()
  const { setErrorMessage } = useUI()
  const isMobileView = useMobileDetection()

  const DialogContentComponent = isMobileView ? DialogBottomContent : DialogContent
  
  // Generate short share URL with calendar data
  useEffect(() => {
    if (isOpen && yearCalendar && yearCalendar.length > 0) {
      const generateShortUrl = async () => {
        setIsGeneratingUrl(true)
        let longUrl = ''
        
        try {
          // Create a SavedSchedule object from current calendar data
          const schedule: SavedSchedule = {
            metadata: {
              id: scheduleId,
              name: `${selectedRotation} Schedule`,
              rotationPattern: selectedRotation,
              startDate: selectedDate,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              schemaVersion: 'v1'
            },
            calendar: yearCalendar
          }
          
          // Generate long URL first (existing functionality)
          longUrl = shareUtils.generateShareUrl(scheduleId, schedule)
          
          // Attempt to shorten the URL
          const result = await shareUtils.shortenUrl(longUrl)
          setShareUrl(result.shortUrl)
          
          // If the short URL is the same as long URL, it means shortening failed
          // but we gracefully fell back, so we can show a subtle warning
          if (result.shortUrl === longUrl && longUrl.length > 100) {
            console.warn('URL shortening service unavailable, using full link')
            // Don't show error to user as fallback is working
          }
          
        } catch (error) {
          console.error('Error generating share URL:', error)
          // Fallback to long URL if we have it, otherwise show error
          if (longUrl) {
            setShareUrl(longUrl)
            console.warn('URL shortening failed, using long URL as fallback')
          } else {
            setErrorMessage('Failed to generate share link. Please try again.')
            setShareUrl('')
          }
        } finally {
          setIsGeneratingUrl(false)
        }
      }
      
      generateShortUrl()
    } else if (!isOpen) {
      // Reset URL when modal closes
      setShareUrl('')
      setIsGeneratingUrl(false)
    } else {
      // No calendar data available - don't generate URL without data
      setShareUrl('')
      setIsGeneratingUrl(false)
    }
  }, [isOpen, scheduleId, yearCalendar, selectedDate, selectedRotation, setErrorMessage])
  
  // Reset copied state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCopied(false)
      setIsSharing(false)
    }
  }, [isOpen])

  // Validate that we have calendar data
  if (!yearCalendar || yearCalendar.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContentComponent className={isMobileView 
          ? "p-0 max-h-[85vh] w-full max-w-none" 
          : "sm:max-w-md backdrop-blur-xl bg-white/95 border border-white/60"
        }>
          <div className="flex flex-col h-full">
            <DialogHeader className={`${isMobileView ? 'p-4 pb-3' : 'p-6 pb-4'} border-b border-gray-100`}>
              <div className={`flex items-center ${isMobileView ? 'justify-center' : 'justify-between'}`}>
                <div className={isMobileView ? 'text-center' : ''}>
                  <DialogTitle className={`flex items-center gap-2 font-semibold text-gray-900 ${
                    isMobileView ? 'text-lg justify-center' : 'text-xl'
                  }`}>
                    <Share2 className="w-5 h-5" />
                    Share Your Calendar
                  </DialogTitle>
                </div>
                {!isMobileView && (
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label="Close dialog"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                )}
              </div>
            </DialogHeader>
            
            <div className={`flex-1 ${isMobileView ? 'p-4' : 'p-6'}`}>
              <div className="p-4 rounded-lg bg-red-50/50 backdrop-blur border border-red-200/50">
                <p className="text-sm text-red-600">
                  Please generate a calendar first before sharing.
                </p>
              </div>
            </div>
          </div>
        </DialogContentComponent>
      </Dialog>
    )
  }

  // Show loading state while URL is being generated
  if (isGeneratingUrl || (!shareUrl && isOpen)) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContentComponent className={isMobileView 
          ? "p-0 max-h-[85vh] w-full max-w-none" 
          : "sm:max-w-md backdrop-blur-xl bg-white/95 border border-white/60"
        }>
          <div className="flex flex-col h-full">
            <DialogHeader className={`${isMobileView ? 'p-4 pb-3' : 'p-6 pb-4'} border-b border-gray-100`}>
              <div className={`flex items-center ${isMobileView ? 'justify-center' : 'justify-between'}`}>
                <div className={isMobileView ? 'text-center' : ''}>
                  <DialogTitle className={`flex items-center gap-2 font-semibold text-gray-900 ${
                    isMobileView ? 'text-lg justify-center' : 'text-xl'
                  }`}>
                    <Share2 className="w-5 h-5" />
                    Share Your Calendar
                  </DialogTitle>
                </div>
                {!isMobileView && (
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label="Close dialog"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                )}
              </div>
            </DialogHeader>
            
            <div className={`flex-1 flex items-center justify-center ${isMobileView ? 'p-4' : 'p-8'}`}>
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p className="text-gray-600">
                  {isGeneratingUrl ? 'Generating short link...' : 'Preparing share link...'}
                </p>
              </div>
            </div>
          </div>
        </DialogContentComponent>
      </Dialog>
    )
  }

  const shareData: shareUtils.ShareData = {
    title: `My ${selectedRotation} Rotation Schedule`,
    text: `Check out my offshore rotation calendar`,
    url: shareUrl,
    dateRange: `Starting ${selectedDate}`,
    rotationPattern: selectedRotation
  }
  
  const handleCopy = async () => {
    try {
      const success = await shareUtils.copyToClipboard(shareUrl)
      if (success) {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } else {
        setErrorMessage('Failed to copy to clipboard. Please try again.')
      }
    } catch (error) {
      console.error('Copy failed:', error)
      setErrorMessage('Failed to copy to clipboard. Please try again.')
    }
  }
  
  const handleNativeShare = async () => {
    setIsSharing(true)
    try {
      const shared = await shareUtils.shareNative(shareData)
      if (!shared) {
        setErrorMessage('Sharing not supported on this device. Try one of the other options.')
      }
    } catch (error) {
      console.error('Native share failed:', error)
      setErrorMessage('Sharing failed. Please try one of the other options.')
    } finally {
      setIsSharing(false)
    }
  }

  const handleWhatsAppShare = () => {
    try {
      shareUtils.shareViaWhatsApp(shareData)
    } catch (error) {
      console.error('WhatsApp share failed:', error)
      setErrorMessage('Failed to open WhatsApp. Please make sure it\'s installed.')
    }
  }

  const handleEmailShare = () => {
    try {
      shareUtils.shareViaEmail(shareData)
    } catch (error) {
      console.error('Email share failed:', error)
      setErrorMessage('Failed to open email client. Please try copying the link instead.')
    }
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContentComponent className={isMobileView 
        ? "p-0 max-h-[85vh] w-full max-w-none" 
        : "sm:max-w-md backdrop-blur-xl bg-white/95 border border-white/60"
      }>
        <div className="flex flex-col h-full">
          <DialogHeader className={`${isMobileView ? 'p-4 pb-3' : 'p-6 pb-4'} border-b border-gray-100`}>
            <div className={`flex items-center ${isMobileView ? 'justify-center' : 'justify-between'}`}>
              <div className={isMobileView ? 'text-center' : ''}>
                <DialogTitle className={`flex items-center gap-2 font-semibold text-gray-900 ${
                  isMobileView ? 'text-lg justify-center' : 'text-xl'
                }`}>
                  <Share2 className="w-5 h-5" />
                  Share Your Calendar
                </DialogTitle>
              </div>
              {!isMobileView && (
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Close dialog"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              )}
            </div>
          </DialogHeader>

          <div className={`flex-1 overflow-y-auto ${isMobileView ? 'p-4' : 'p-6'}`}>
            {/* Preview Section */}
            <div className={`space-y-4 ${isMobileView ? 'space-y-3' : 'space-y-4'}`}>
              <div className="p-4 rounded-lg bg-gray-50/50 backdrop-blur border border-gray-200/50">
                <p className={`text-gray-500 mb-2 ${isMobileView ? 'text-xs' : 'text-sm'}`}>Share Preview</p>
                <p className={`font-medium ${isMobileView ? 'text-base' : 'text-lg'}`}>{shareData.title}</p>
                <p className={`text-gray-400 mt-1 ${isMobileView ? 'text-xs' : 'text-sm'}`}>{shareData.dateRange}</p>
                <div className="mt-3 p-2 bg-white/80 rounded border border-gray-200/50">
                  <p className="text-xs text-gray-500 break-all">{shareUrl}</p>
                </div>
              </div>
              
              {/* Share Options */}
              <div className={`grid gap-2 ${isMobileView ? 'gap-3' : 'gap-2'}`}>
                {/* Native Share (if available) */}
                {shareUtils.isNativeShareSupported() && (
                  <button
                    onClick={handleNativeShare}
                    disabled={isSharing}
                    className={`flex items-center justify-center gap-2 w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
                      isMobileView ? 'py-4 px-4 min-h-[48px] text-base' : 'py-3 px-4'
                    }`}
                  >
                    <Share2 className="w-5 h-5" />
                    {isSharing ? 'Sharing...' : 'Share'}
                  </button>
                )}
                
                {/* WhatsApp */}
                <button
                  onClick={handleWhatsAppShare}
                  className={`flex items-center justify-center gap-2 w-full bg-green-500 text-white rounded-xl hover:bg-green-600 hover:shadow-lg hover:scale-105 transition-all duration-200 ${
                    isMobileView ? 'py-4 px-4 min-h-[48px] text-base' : 'py-3 px-4'
                  }`}
                >
                  <MessageCircle className="w-5 h-5" />
                  Share on WhatsApp
                </button>
                
                {/* Email */}
                <button
                  onClick={handleEmailShare}
                  className={`flex items-center justify-center gap-2 w-full bg-blue-500 text-white rounded-xl hover:bg-blue-600 hover:shadow-lg hover:scale-105 transition-all duration-200 ${
                    isMobileView ? 'py-4 px-4 min-h-[48px] text-base' : 'py-3 px-4'
                  }`}
                >
                  <Mail className="w-5 h-5" />
                  Share via Email
                </button>
                
                {/* Copy Link */}
                <button
                  onClick={handleCopy}
                  className={`flex items-center justify-center gap-2 w-full bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 hover:shadow hover:scale-105 transition-all duration-200 ${
                    isMobileView ? 'py-4 px-4 min-h-[48px] text-base' : 'py-3 px-4'
                  }`}
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
          </div>

          {/* Close button for mobile */}
          {isMobileView && (
            <div className="border-t border-gray-100 p-4">
              <button 
                onClick={onClose}
                className="w-full min-h-[48px] text-base py-3 px-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </DialogContentComponent>
    </Dialog>
  )
}