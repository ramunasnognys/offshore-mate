'use client'

import React from 'react'
import { ArrowRight } from 'lucide-react'
import { ScheduleList } from '@/components/schedule-list'
import { DownloadCalendar } from '@/components/download-calendar'
import { BottomToolbar } from '@/components/bottom-toolbar'
import { FloatingActionMenu } from '@/components/floating-action-menu'
import { SettingsDialog } from '@/components/settings-dialog'
import { useCalendar } from '@/contexts/CalendarContext'
import { useUI } from '@/contexts/UIContext'
import { useMobileDetection } from '@/hooks/useMobileDetection'
import { useMonthNavigation } from '@/hooks/useMonthNavigation'
import { useSwipeable } from 'react-swipeable'
import { useExportCalendar } from '@/hooks/useExportCalendar'
import { MonthData } from '@/types/rotation'

interface CalendarDisplayProps {
  onBack: () => void
  onSave: () => void
  isStorageAvailable: boolean
}

export function CalendarDisplay({ 
  onBack, 
  onSave,
  isStorageAvailable 
}: CalendarDisplayProps) {
  const {
    yearCalendar,
    scheduleName,
    setScheduleName,
    selectedRotation,
    selectedDate,
    isSaved
  } = useCalendar()

  const {
    showSettings,
    setShowSettings,
    isEditingName,
    setIsEditingName,
    setErrorMessage
  } = useUI()

  const isMobileView = useMobileDetection()

  // Navigation
  const {
    currentMonthIndex,
    setCurrentMonthIndex,
    goToPreviousMonth,
    goToNextMonth,
    goToToday
  } = useMonthNavigation({ 
    yearCalendar, 
    initialMonthIndex: findCurrentMonthIndex(yearCalendar) 
  })

  // Export functionality
  const {
    isDownloading,
    exportFormat,
    setExportFormat,
    handleDownload: handleExport
  } = useExportCalendar({
    isMobileView,
    onError: setErrorMessage,
    onSuccess: (_message) => {
      // Handle success notification if needed
    }
  })

  // Swipe gestures with react-swipeable - mobile-optimized
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentMonthIndex < yearCalendar.length - 1) {
        goToNextMonth();
      }
    },
    onSwipedRight: () => {
      if (currentMonthIndex > 0) {
        goToPreviousMonth();
      }
    },
    onTouchStartOrOnMouseDown: (eventData) => {
      // Prevent swipe if touch starts on a button or interactive element
      const target = eventData.event.target as Element;
      if (target.closest('button') || 
          target.closest('[role="button"]') || 
          target.closest('.navigation-buttons')) {
        return false; // This prevents the swipe from starting
      }
    },
    delta: 50, // Minimum distance for a swipe (50px works well for mobile)
    preventScrollOnSwipe: false, // Allow vertical scrolling
    trackMouse: false, // Disable mouse tracking for mobile-only swipes
    trackTouch: true, // Enable touch tracking for mobile
    touchEventOptions: { passive: false }, // Allow preventDefault when needed
    swipeDuration: 500, // Maximum time for swipe
    preventDefaultTouchmoveEvent: false // Allow normal touch behavior
  })

  const handleDownload = async () => {
    await handleExport(yearCalendar, scheduleName, selectedRotation, selectedDate)
  }

  const handleTodayClick = () => {
    goToToday()
    
    // Smooth scroll to today's month on desktop
    if (isMobileView === false && yearCalendar.length > 0) {
      const monthElement = document.querySelector(
        `[aria-labelledby*="${yearCalendar[currentMonthIndex]?.month}-${yearCalendar[currentMonthIndex]?.year}"]`
      )
      monthElement?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header with Back Button and Today Button */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <button
            onClick={onBack}
            className="bg-black text-white rounded-full px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-medium
              shadow-sm hover:bg-black/90 transition-all duration-200 group inline-flex"
          >
            <span className="flex items-center gap-1.5 md:gap-2">
              <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
              Back
            </span>
          </button>
          
          {/* Today Button */}
          <button
            onClick={handleTodayClick}
            className="bg-white/80 backdrop-blur-sm text-gray-700 rounded-full px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-medium
              shadow-sm hover:bg-white hover:text-orange-500 transition-all duration-200 border border-gray-200/50 active:scale-95"
            title="Jump to current month"
          >
            Today
          </button>
        </div>
        
        {/* Rotation Info Badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border border-gray-200/50">
            <span className="text-sm text-gray-600">Rotation:</span>
            <span className="text-sm font-semibold text-gray-800">{selectedRotation}</span>
            <span className="text-gray-400">•</span>
            <span className="text-sm text-gray-600">Started</span>
            <span className="text-sm font-medium text-gray-800">
              {new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      {/* Calendar Display */}
      <div>
        <div className={isMobileView === true ? "relative" : ""}>
          {/* Swipe wrapper only for mobile */}
          <div {...(isMobileView === true ? handlers : {})}>
            <ScheduleList 
              calendar={isMobileView === true && yearCalendar.length > 0 
                ? [yearCalendar[currentMonthIndex]] 
                : yearCalendar
              } 
              className={isMobileView === true ? "h-auto" : ""}
              isMobile={isMobileView === true}
              currentMonthIndex={currentMonthIndex}
              onNavigate={(direction) => {
                if (direction === 'prev') goToPreviousMonth()
                else goToNextMonth()
              }}
              totalMonths={yearCalendar.length}
            />
          </div>
        </div>
        
        {/* Progress Dots - Mobile Only */}
        {isMobileView === true && yearCalendar.length > 0 && (
          <div className="flex justify-center gap-1.5 mt-4 mb-20">
            {yearCalendar.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentMonthIndex(index)}
                className={`
                  transition-all duration-200 rounded-full
                  ${index === currentMonthIndex 
                    ? 'w-8 h-2 bg-orange-500' 
                    : 'w-2 h-2 bg-gray-400/50 hover:bg-gray-400'
                  }
                `}
                aria-label={`Go to ${yearCalendar[index]?.month} ${yearCalendar[index]?.year}`}
              />
            ))}
          </div>
        )}
        
        {/* Floating Action Menu - Desktop only */}
        {isMobileView === false && (
          <FloatingActionMenu 
            onExport={(format) => {
              setExportFormat(format)
              handleDownload()
            }}
            isDownloading={isDownloading}
          />
        )}
        
        {/* Bottom Toolbar - Mobile only */}
        {isMobileView === true && (
          <BottomToolbar 
            selectedFormat={exportFormat}
            onFormatChange={setExportFormat}
            onExport={handleDownload}
            onSettings={() => setShowSettings(true)}
            isDownloading={isDownloading}
          />
        )}
        
        <DownloadCalendar calendar={yearCalendar} />
      </div>
      
      {/* Settings Dialog */}
      <SettingsDialog
        scheduleName={scheduleName}
        setScheduleName={setScheduleName}
        isEditingName={isEditingName}
        setIsEditingName={setIsEditingName}
        isSaving={false}
        isSaved={isSaved}
        onSave={onSave}
        selectedRotation={selectedRotation}
        selectedDate={selectedDate}
        isStorageAvailable={isStorageAvailable}
        onOpenChange={setShowSettings}
        open={showSettings}
      />
    </div>
  )
}

// Utility function to find current month index
function findCurrentMonthIndex(calendar: MonthData[]): number {
  const today = new Date()
  const currentMonth = today.getMonth() // 0-based
  const currentYear = today.getFullYear()
  
  const index = calendar.findIndex(month => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December']
    const monthIndex = monthNames.indexOf(month.month)
    return monthIndex === currentMonth && month.year === currentYear
  })
  
  // If current month not found, return 0 (first month)
  return index >= 0 ? index : 0
}