'use client'

import React, { useState, useEffect } from 'react'
import { Share2, Mail, MessageCircle, Copy, Check } from 'lucide-react'
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
  const { setErrorMessage } = useUI()
  
  const shareUrl = shareUtils.generateShareUrl(scheduleId)
  
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
        <DialogContent className="sm:max-w-md backdrop-blur-xl bg-white/95 border border-white/60">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              Share Your Calendar
            </DialogTitle>
          </DialogHeader>
          
          <div className="p-4 rounded-lg bg-red-50/50 backdrop-blur border border-red-200/50">
            <p className="text-sm text-red-600">
              Please generate a calendar first before sharing.
            </p>
          </div>
        </DialogContent>
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
      <DialogContent className="sm:max-w-md backdrop-blur-xl bg-white/95 border border-white/60">
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
            {shareUtils.isNativeShareSupported() && (
              <button
                onClick={handleNativeShare}
                disabled={isSharing}
                className="flex items-center justify-center gap-2 w-full py-3 px-4 
                  bg-gradient-to-r from-orange-500 to-orange-600 text-white 
                  rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Share2 className="w-5 h-5" />
                {isSharing ? 'Sharing...' : 'Share'}
              </button>
            )}
            
            {/* WhatsApp */}
            <button
              onClick={handleWhatsAppShare}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 
                bg-green-500 text-white rounded-xl hover:bg-green-600 
                hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              <MessageCircle className="w-5 h-5" />
              Share on WhatsApp
            </button>
            
            {/* Email */}
            <button
              onClick={handleEmailShare}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 
                bg-blue-500 text-white rounded-xl hover:bg-blue-600 
                hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              <Mail className="w-5 h-5" />
              Share via Email
            </button>
            
            {/* Copy Link */}
            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 
                bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 
                hover:shadow hover:scale-105 transition-all duration-200"
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