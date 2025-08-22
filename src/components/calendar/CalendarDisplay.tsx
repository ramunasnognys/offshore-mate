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
import { calculateWeekdayAdjustment, rotationConfigs } from '@/lib/utils/rotation'

interface CalendarDisplayProps {
  onBack: () => void
  isStorageAvailable: boolean
}

export function CalendarDisplay({ 
  onBack,
  isStorageAvailable: _isStorageAvailable 
}: CalendarDisplayProps) {
  const {
    yearCalendar,
    setScheduleName,
    selectedRotation,
    selectedDate,
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

  // Calculate the rotation pattern display and adjustment status together to prevent race conditions
  const rotationInfo = React.useMemo(() => {
    if (selectedRotation === 'Custom') {
      return {
        displayedPattern: 'Custom Rotation',
        isAdjusted: false
      };
    }
    
    const config = rotationConfigs[selectedRotation as RotationPattern];
    if (!config || !selectedDate) {
      return {
        displayedPattern: selectedRotation,
        isAdjusted: false
      };
    }
    
    // Calculate if adjustment was made
    const { adjustedWorkDays } = calculateWeekdayAdjustment(
      new Date(selectedDate),
      config.workDays,
      config.offDays
    );
    
    return {
      displayedPattern: config.label,
      isAdjusted: adjustedWorkDays !== config.workDays
    };
  }, [selectedRotation, selectedDate])

  return (
    <div className={`space-y-6 md:space-y-8 ${isMobileView === true ? 'mobile-calendar-container' : ''}`}>
      {/* Header with Back Button and Today Button */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <button
            onClick={onBack}
            className="bg-gradient-to-r from-gray-900 to-black text-white rounded-2xl px-6 md:px-8 py-3 md:py-4 text-sm md:text-base font-semibold
              shadow-lg hover:shadow-xl hover:from-black hover:to-gray-800 transition-all duration-300 group inline-flex border border-gray-700/20"
            aria-label="Go back to rotation selection"
          >
            <span className="flex items-center gap-2 md:gap-3">
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 rotate-180 group-hover:-translate-x-1 transition-transform duration-200" />
              Back
            </span>
          </button>
          
          {/* Today Button */}
          <button
            onClick={handleTodayClick}
            className="bg-white/90 backdrop-blur-sm text-gray-700 rounded-2xl px-6 md:px-8 py-3 md:py-4 text-sm md:text-base font-semibold
              shadow-lg hover:shadow-xl hover:bg-white hover:text-orange-500 transition-all duration-300 border border-white/50 active:scale-95
              hover:border-orange-200"
            aria-label="Jump to today's month"
          >
            Today
          </button>
        </div>
        
        {/* Rotation Info Badge - Shows dynamic rotation pattern */}
        <div className="flex justify-center">
          <div className="inline-flex items-center bg-gradient-to-r from-white/90 to-white/70 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg border border-white/40">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-orange-500"></div>
              <span className="text-sm font-semibold text-gray-800">{rotationInfo.displayedPattern}</span>
            </div>
          </div>
        </div>
      </div>


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