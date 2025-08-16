'use client'

import React from 'react'
import { ArrowRight } from 'lucide-react'
import { ScheduleList } from '@/components/schedule-list'
import { DownloadCalendar } from '@/components/download-calendar'
import { SavedSchedulesSettings } from '@/components/SavedSchedulesSettings'
import { useCalendar } from '@/contexts/CalendarContext'
import { useUI } from '@/contexts/UIContext'
import { useMobileDetection } from '@/hooks/useMobileDetection'
import { useMonthNavigation } from '@/hooks/useMonthNavigation'
import { useScheduleManagement } from '@/hooks/useScheduleManagement'
import { MonthData, RotationPattern } from '@/types/rotation'
import { ContextualSaveBar } from '@/components/ContextualSaveBar'
import { calculateWeekdayAdjustment, rotationConfigs } from '@/lib/utils/rotation'

interface CalendarDisplayProps {
  onBack: () => void
  onSave: () => void
  isStorageAvailable: boolean
}

export function CalendarDisplay({ 
  onBack, 
  onSave,
  isStorageAvailable: _isStorageAvailable 
}: CalendarDisplayProps) {
  const {
    yearCalendar,
    scheduleName,
    setScheduleName,
    selectedRotation,
    selectedDate,
    isSaved,
    currentScheduleId,
    setYearCalendar,
    setCurrentScheduleId,
    setIsSaved,
    setSelectedDate,
    handleRotationSelect,
    setIsCalendarGenerated
  } = useCalendar()

  const {
    showSettings,
    setShowSettings,
    setErrorMessage
  } = useUI()

  const isMobileView = useMobileDetection()

  // Schedule management for loading schedules
  const { loadSchedule } = useScheduleManagement({
    onScheduleLoaded: (schedule) => {
      // Load the schedule into the calendar context
      setSelectedDate(schedule.metadata.startDate)
      handleRotationSelect(schedule.metadata.rotationPattern as RotationPattern)
      setYearCalendar(schedule.calendar)
      setScheduleName(schedule.metadata.name)
      setCurrentScheduleId(schedule.metadata.id)
      setIsSaved(true)
      setIsCalendarGenerated(true)
    },
    onError: (error) => setErrorMessage(error)
  })

  // Navigation
  const {
    currentMonthIndex,
    goToPreviousMonth,
    goToNextMonth,
    goToToday
  } = useMonthNavigation({ 
    yearCalendar, 
    initialMonthIndex: findCurrentMonthIndex(yearCalendar) 
  })

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

  // Calculate the actual rotation pattern being displayed (with weekday adjustment)
  const displayedRotationPattern = React.useMemo(() => {
    if (selectedRotation === 'Custom') {
      // For custom rotations, show the custom label
      return 'Custom Rotation';
    }
    
    const config = rotationConfigs[selectedRotation as RotationPattern];
    if (!config || !selectedDate) return selectedRotation;
    
    // Always return the original pattern label, regardless of adjustment
    return config.label;
  }, [selectedRotation, selectedDate])

  // Check if weekday adjustment was applied
  const isAdjusted = React.useMemo(() => {
    if (selectedRotation === 'Custom' || !selectedDate) return false;
    
    const config = rotationConfigs[selectedRotation as RotationPattern];
    if (!config) return false;
    
    // Calculate if adjustment was made
    const { adjustedWorkDays } = calculateWeekdayAdjustment(
      new Date(selectedDate),
      config.workDays,
      config.offDays
    );
    
    return adjustedWorkDays !== config.workDays;
  }, [selectedRotation, selectedDate])

  return (
    <div className={`space-y-6 md:space-y-8 ${isMobileView === true ? 'mobile-calendar-container' : ''}`}>
      {/* Header with Back Button and Today Button */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <button
            onClick={onBack}
            className="bg-black text-white rounded-full px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-medium
              shadow-sm hover:bg-black/90 transition-all duration-200 group inline-flex"
            aria-label="Go back to rotation selection"
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
            aria-label="Jump to today's month"
          >
            Today
          </button>
        </div>
        
        {/* Rotation Info Badge - Shows dynamic rotation pattern */}
        <div className="flex justify-center">
          <div className="inline-flex items-center bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border border-gray-200/50">
            <span className="text-sm font-medium text-gray-800">{displayedRotationPattern}</span>
            {isAdjusted && (
              <span className="ml-2 text-xs text-gray-500">(adjusted for weekday consistency)</span>
            )}
          </div>
        </div>
      </div>

      {/* Contextual Save Bar - appears for new unsaved schedules */}
      <ContextualSaveBar
        yearCalendar={yearCalendar}
        scheduleName={scheduleName}
        selectedRotation={displayedRotationPattern}
        selectedDate={selectedDate}
        currentScheduleId={currentScheduleId}
        isSaved={isSaved}
        onNameChange={setScheduleName}
        onSave={onSave}
        onUpdate={onSave}
      />

      {/* Calendar Display */}
      <div>
        <ScheduleList 
          calendar={isMobileView === true && yearCalendar.length > 0 
            ? [yearCalendar[currentMonthIndex]] 
            : yearCalendar
          } 
          className={isMobileView === true ? "h-auto" : ""}
          isMobile={isMobileView === true}
          currentMonthIndex={currentMonthIndex}
          onNavigate={(direction) => {
            console.log('Navigation triggered from ScheduleList', direction);
            if (direction === 'prev') goToPreviousMonth()
            else goToNextMonth()
          }}
          totalMonths={yearCalendar.length}
        />
        
        <DownloadCalendar calendar={yearCalendar} />
      </div>
      
      {/* Settings Dialog - Only show on desktop */}
      {isMobileView === false && (
        <SavedSchedulesSettings
          onLoadSchedule={loadSchedule}
          isOpen={showSettings}
          onOpenChange={setShowSettings}
        />
      )}
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