'use client'

import React, { useEffect } from 'react'
import { XCircle } from 'lucide-react'
import { CalendarProvider, useCalendar } from '@/contexts/CalendarContext'
import { UIProvider } from '@/contexts/UIContext'
import { CalendarGenerator } from '@/components/calendar/CalendarGenerator'
import { CalendarDisplay } from '@/components/calendar/CalendarDisplay'
import { NotificationManager } from '@/components/common/NotificationManager'
import { SavedSchedules } from '@/components/saved-schedules'
import { useMobileDetection } from '@/hooks/useMobileDetection'
import { useScheduleManagement } from '@/hooks/useScheduleManagement'
import { useExportCalendar } from '@/hooks/useExportCalendar'
import { RotationPattern } from '@/types/rotation'

function HomeContent() {
  const isMobileView = useMobileDetection()
  const [isClient, setIsClient] = React.useState(false)
  
  // Get calendar context
  const { 
    isCalendarGenerated, 
    yearCalendar,
    scheduleName,
    selectedRotation,
    selectedDate,
    currentScheduleId,
    setYearCalendar,
    setScheduleName,
    setCurrentScheduleId,
    setIsSaved,
    setSelectedDate,
    handleRotationSelect,
    resetCalendar,
    setIsCalendarGenerated
  } = useCalendar()

  // Schedule management
  const {
    showSavedSchedules,
    saveNotification,
    isStorageSupported,
    saveSchedule,
    loadSchedule,
    setShowSavedSchedules,
    setSaveNotification
  } = useScheduleManagement({
    onScheduleLoaded: (schedule) => {
      // Load the schedule into the calendar context
      setSelectedDate(schedule.metadata.startDate)
      handleRotationSelect(schedule.metadata.rotationPattern as RotationPattern)
      setYearCalendar(schedule.calendar)
      setScheduleName(schedule.metadata.name)
      setCurrentScheduleId(schedule.metadata.id)
      setIsSaved(true)
      setIsCalendarGenerated(true)
    }
  })

  // Export functionality
  const exportHook = useExportCalendar({
    isMobileView,
    onError: (error) => console.error('Export error:', error),
    onSuccess: (message) => setSaveNotification(message)
  })

  // Client-side initialization
  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleSaveSchedule = () => {
    const result = saveSchedule(
      yearCalendar,
      scheduleName,
      selectedRotation,
      selectedDate,
      currentScheduleId
    )
    if (result.success && result.id) {
      setCurrentScheduleId(result.id)
      setIsSaved(true)
    }
  }

  return (
    <main className={`min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-white to-pink-100 flex ${isCalendarGenerated && isMobileView === true ? 'items-start pt-4' : 'items-center'} justify-center p-4 md:p-8 bg-fixed`}>
      {/* Notifications */}
      <NotificationManager
        saveNotification={saveNotification}
        onClearSaveNotification={() => setSaveNotification('')}
        isDownloading={exportHook.isDownloading}
        exportFormat={exportHook.exportFormat}
        showPDFError={exportHook.showPDFError}
        pdfErrorMessage={exportHook.pdfErrorMessage}
        onClosePDFError={() => exportHook.setShowPDFError(false)}
        onSwitchToPNG={exportHook.handleUsePNGInstead}
      />

      <div className="relative w-full max-w-[500px]">
        <div className={`${isCalendarGenerated && isMobileView === true ? 'mb-4' : 'mb-8 md:mb-12'}`}>
          <h1 className={`font-display text-center text-gray-800 ${
            isCalendarGenerated && isMobileView === true 
              ? 'text-3xl mb-1' 
              : 'text-4xl md:text-5xl lg:text-5xl mb-2'
          }`}>
            Offshore Mate 3
          </h1>
          <p className={`text-center text-orange-500 tracking-wide uppercase font-light ${
            isCalendarGenerated && isMobileView === true 
              ? 'text-[9px] opacity-80' 
              : 'text-[10px] md:text-sm'
          }`}>
            Navigate your offshore schedule with precision
          </p>
        </div>

        {!isCalendarGenerated ? (
          <>
            <CalendarGenerator
              onShowSavedSchedules={() => setShowSavedSchedules(true)}
              hasStorageSupport={isClient && isStorageSupported}
            />

            {/* Saved Schedules Modal */}
            {showSavedSchedules && (
              <div className="fixed inset-0 bg-black/25 backdrop-blur-sm z-20 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-auto shadow-xl">
                  <div className="p-5">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold">Saved Schedules</h3>
                      <button 
                        onClick={() => setShowSavedSchedules(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                    <SavedSchedules 
                      onLoadSchedule={loadSchedule} 
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <CalendarDisplay
            onBack={resetCalendar}
            onSave={handleSaveSchedule}
            isStorageAvailable={isClient && isStorageSupported}
          />
        )}

        {/* Footer */}
        {(!isCalendarGenerated || isMobileView !== true) && (
          <div className="mt-8 text-center text-sm text-gray-300 tracking-wide">
            <p className="tracking-wide">Version v.2</p>
          </div>
        )}
      </div>
    </main>
  )
}

export default function Home() {
  return (
    <CalendarProvider>
      <UIProvider>
        <HomeContent />
      </UIProvider>
    </CalendarProvider>
  )
}