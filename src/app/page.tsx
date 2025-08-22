'use client'

import React, { useEffect } from 'react'
import { CalendarProvider, useCalendar } from '@/contexts/CalendarContext'
import { UIProvider } from '@/contexts/UIContext'
import { CalendarGenerator } from '@/components/calendar/CalendarGenerator'
import { CalendarDisplay } from '@/components/calendar/CalendarDisplay'
import { NotificationManager } from '@/components/common/NotificationManager'
import { SavedSchedules } from '@/components/saved-schedules'
import { BottomToolbar } from '@/components/bottom-toolbar'
import { SavedSchedulesSettings } from '@/components/SavedSchedulesSettings'
import { useMobileDetection } from '@/hooks/useMobileDetection'
import { useScheduleManagement } from '@/hooks/useScheduleManagement'
import { useExportCalendar } from '@/hooks/useExportCalendar'
import { DesktopSidebar } from '@/components/desktop/DesktopSidebar'
import { RotationPattern } from '@/types/rotation'

function HomeContent() {
  const isMobileView = useMobileDetection()
  const [isClient, setIsClient] = React.useState(false)
  const [_isExportPanelExpanded, setIsExportPanelExpanded] = React.useState(false)
  const [expandedPanel, setExpandedPanel] = React.useState<'export' | 'settings' | null>(null)
  
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

  // UI context (currently unused but keeping for future use)
  // const { } = useUI()

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
  const {
    isDownloading,
    exportFormat,
    setExportFormat,
    handleDownload,
    showPDFError,
    pdfErrorMessage,
    setShowPDFError,
    handleUsePNGInstead
  } = useExportCalendar({
    isMobileView,
    onError: (error) => console.error('Export error:', error),
    onSuccess: (message) => setSaveNotification(message)
  })

  const handleExport = async () => {
    await handleDownload(yearCalendar, scheduleName, selectedRotation, selectedDate)
  }

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
    <div className="flex flex-col min-h-[100dvh] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-white to-pink-100 bg-fixed">
      {/* Notifications */}
      <NotificationManager
        saveNotification={saveNotification}
        onClearSaveNotification={() => setSaveNotification('')}
        isDownloading={isDownloading}
        exportFormat={exportFormat}
        showPDFError={showPDFError}
        pdfErrorMessage={pdfErrorMessage}
        onClosePDFError={() => setShowPDFError(false)}
        onSwitchToPNG={handleUsePNGInstead}
      />

      <div className={`${isCalendarGenerated ? 'lg:grid lg:grid-cols-[1fr_320px] lg:gap-8 lg:max-w-screen-lg lg:mx-auto lg:p-8' : 'flex items-center justify-center min-h-[calc(100dvh-200px)]'}`}>
        <main className={`flex-1 overflow-y-auto flex ${isCalendarGenerated ? 'items-start pt-6' : 'items-center'} justify-center p-4 md:p-8 lg:p-0 safe-area-inset-x ${isMobileView !== false ? 'mobile-safe-top' : ''} ${isCalendarGenerated && isMobileView === true ? 'has-bottom-toolbar' : ''}`} 
          style={{
            ...(isCalendarGenerated && isMobileView === true ? { 
              WebkitOverflowScrolling: 'touch'
            } : {})
          }}>

        <div className="relative w-full max-w-[500px]">
        <div className={`${isCalendarGenerated && isMobileView === true ? 'mb-4 pt-2' : 'mb-8 md:mb-12'} ${isMobileView !== false ? 'pt-safe' : ''}`}>
          <h1 className={`font-display text-center text-gray-800 ${
            isCalendarGenerated && isMobileView === true 
              ? 'text-3xl mb-1' 
              : 'text-4xl md:text-5xl lg:text-5xl mb-2'
          }`}>
            Offshore Mate
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

            {/* Saved Schedules Dialog */}
            <SavedSchedules 
              onLoadSchedule={loadSchedule}
              isOpen={showSavedSchedules}
              onOpenChange={setShowSavedSchedules}
            />
          </>
        ) : (
          <CalendarDisplay
            onBack={resetCalendar}
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

        {/* Desktop Sidebar */}
        {isCalendarGenerated && isMobileView === false && (
          <DesktopSidebar />
        )}
      </div>

      {/* Bottom Toolbar - Mobile only */}
      {isCalendarGenerated && isMobileView === true && (
        <>
          <BottomToolbar 
            selectedFormat={exportFormat}
            onFormatChange={setExportFormat}
            onExport={handleExport}
            onSaveSchedule={handleSaveSchedule}
            onSettings={() => {}}
            isDownloading={isDownloading}
            onExpandedChange={setIsExportPanelExpanded}
            expandedPanel={expandedPanel}
            onExpandedPanelChange={setExpandedPanel}
          />
          <SavedSchedulesSettings
            onLoadSchedule={loadSchedule}
            isOpen={expandedPanel === 'settings'}
            onOpenChange={(open) => setExpandedPanel(open ? 'settings' : null)}
          />
        </>
      )}
    </div>
  )
}

export default function Home() {
  return (
    <UIProvider>
      <CalendarProvider>
        <HomeContent />
      </CalendarProvider>
    </UIProvider>
  )
}