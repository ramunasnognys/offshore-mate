'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { EnhancedCalendar } from './EnhancedCalendar'
import { cn } from '@/lib/utils'

interface EnhancedDatePickerDialogProps {
  isOpen: boolean
  onClose: () => void
  selectedDate?: Date
  onDateSelect: (date: Date) => void
  currentMonth: Date
  onMonthChange: (date: Date) => void
}

export function EnhancedDatePickerDialog({
  isOpen,
  onClose,
  selectedDate,
  onDateSelect,
  currentMonth,
  onMonthChange
}: EnhancedDatePickerDialogProps) {
  const today = new Date()

  const handleDateSelect = (date: Date) => {
    onDateSelect(date)
    onClose()
  }

  const handleTodayClick = () => {
    onMonthChange(today) // Navigate to current month
  }

  const handleClearClick = () => {
    onDateSelect(undefined!)
    onClose()
  }

  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Focus trap and body scroll lock
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const modalContent = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      {/* Enhanced glassmorphic overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-slate-900/30 via-purple-900/20 to-slate-900/30 backdrop-blur-lg" 
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div 
        className={cn(
          "relative bg-white/95 backdrop-blur-xl border border-white/50 rounded-2xl shadow-2xl",
          "w-full max-w-sm sm:max-w-md mx-auto p-6 sm:p-8",
          "transform transition-all duration-300 ease-out",
          "animate-in zoom-in-95 fade-in-0 duration-300"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Date picker calendar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -right-3 -top-3 p-2.5 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-300 hover:scale-105"
          aria-label="Close calendar"
        >
          <X className="h-5 w-5 text-slate-600" />
        </button>


        {/* Enhanced Calendar */}
        <EnhancedCalendar
          currentMonth={currentMonth}
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          onMonthChange={onMonthChange}
        />


        {/* Action buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={handleClearClick}
            className="flex-1 px-4 py-2 bg-white/60 backdrop-blur-sm text-slate-600 font-medium text-sm rounded-xl border border-white/40 hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={handleTodayClick}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Today
          </button>
        </div>
      </div>
    </div>
  )

  // Use portal to render modal at document body level
  return typeof document !== 'undefined' 
    ? createPortal(modalContent, document.body)
    : null
}