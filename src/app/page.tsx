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
import { DesktopSidebar } from '@/components/desktop/DesktopSidebar'
import { useMobileDetection } from '@/hooks/useMobileDetection'
import { useScheduleManagement } from '@/hooks/useScheduleManagement'
import { useExportCalendar } from '@/hooks/useExportCalendar'
import { RotationPattern } from '@/types/rotation'

function HomeContent() {
  const isMobileView = useMobileDetection()
  const [isClient, setIsClient] = React.useState(false)
  const [isExportPanelExpanded, setIsExportPanelExpanded] = React.useState(false)
  const [expandedPanel, setExpandedPanel] = React.useState<'export' | 'settings' | null>(null)
  const [showSettingsDialog, setShowSettingsDialog] = React.useState(false)
  
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
      setShowSettingsDialog(false) // Prevent settings dialog from showing
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
    <div className="flex flex-col min-h-[100dvh] bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-100/70 relative overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl animation-delay-4000"></div>
      </div>
      
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.1)_1px,transparent_0)] bg-[length:24px_24px] opacity-20"></div>
      
      {/* Content */}
      <div className="relative z-10">
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

        <main className={`flex-1 overflow-y-auto ${isCalendarGenerated ? 'items-start pt-6' : 'items-center'} p-4 md:p-8 safe-area-inset-x ${isMobileView !== false ? 'mobile-safe-top' : ''} ${isCalendarGenerated && isMobileView === true ? 'has-bottom-toolbar' : ''} ${isCalendarGenerated && isMobileView === true && isExportPanelExpanded ? 'pb-96' : ''} ${isCalendarGenerated && isMobileView === false ? 'flex' : 'flex justify-center'}`} 
          style={{
            ...(isCalendarGenerated && isMobileView === true ? { 
              paddingBottom: isExportPanelExpanded ? '24rem' : 'calc(var(--bottom-toolbar-total-height) + var(--bottom-toolbar-buffer))',
              WebkitOverflowScrolling: 'touch'
            } : {})
          }}>

          {/* Desktop Layout - Two Column Grid */}
          {isCalendarGenerated && isMobileView === false ? (
            <div className="w-full flex flex-col items-center">
              {/* Centered Title Section */}
              <div className="mb-12 md:mb-16">
                <h1 className="font-display text-center text-gray-800 text-5xl md:text-6xl lg:text-7xl mb-4 font-bold tracking-tight">
                  Offshore Mate
                </h1>
                <div className="flex items-center justify-center gap-3">
                  <div className="w-12 h-px bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
                  <p className="text-center text-orange-500 tracking-wider uppercase font-semibold text-sm md:text-base">
                    Navigate your offshore schedule with precision
                  </p>
                  <div className="w-12 h-px bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
                </div>
              </div>
              
              {/* Centered Two-Column Layout with improved spacing */}
              <div className="flex gap-12 justify-center max-w-[1400px] w-full px-8">
                {/* Calendar Column with refined styling */}
                <div className="w-[540px] min-w-[540px] flex-shrink-0">
                  <div className="bg-white/85 backdrop-blur-md rounded-3xl border border-gray-100 shadow-xl p-8 transition-all duration-300 hover:shadow-2xl">
                    <CalendarDisplay
                      onBack={resetCalendar}
                      isStorageAvailable={isClient && isStorageSupported}
                    />
                  </div>
                  
                  {/* Footer */}
                  <div className="mt-10 text-center text-sm text-gray-400 tracking-wide">
                    <div className="inline-flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30 shadow-sm">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-orange-500 animate-pulse"></div>
                      <p className="tracking-wide font-medium">Version v.3</p>
                    </div>
                  </div>
                </div>
                
                {/* Desktop Sidebar with cleaner design */}
                <div className="min-w-[320px] max-w-[360px] h-fit sticky top-8">
                  <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-gray-100 shadow-lg overflow-hidden">
                    <DesktopSidebar 
                      exportFormat={exportFormat}
                      onFormatChange={setExportFormat}
                      onExport={handleExport}
                      onSaveSchedule={handleSaveSchedule}
                      isDownloading={isDownloading}
                      onLoadSchedule={loadSchedule}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Mobile Layout - Single Column */
            <div className="relative w-full max-w-[500px]">
              <div className={`${isCalendarGenerated && isMobileView === true ? 'mb-4 pt-2' : 'mb-8 md:mb-12'} ${isMobileView !== false ? 'pt-safe' : ''}`}>
                <div className="text-center space-y-2">
                  <h1 className={`font-display text-gray-800 ${isCalendarGenerated && isMobileView === true ? 'text-2xl mb-1 tracking-tight' : 'text-4xl md:text-5xl lg:text-5xl mb-2 tracking-tight'}`}>
                    <span className={`${isCalendarGenerated && isMobileView === true ? 'bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent' : 'bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 bg-clip-text text-transparent'}`}>
                      Offshore Mate
                    </span>
                  </h1>
                  {(!isCalendarGenerated || isMobileView !== true) && (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-8 h-px bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
                      <p className="text-center text-orange-500 tracking-wider uppercase font-semibold text-xs md:text-sm">
                        Plan your offshore rotations
                      </p>
                      <div className="w-8 h-px bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Calendar Generation Form or Calendar Display */}
              {!isCalendarGenerated ? (
                <CalendarGenerator 
                  onShowSavedSchedules={() => setShowSavedSchedules(true)}
                  hasStorageSupport={isClient && isStorageSupported}
                />
              ) : isMobileView === true ? (
                <>
                  <CalendarDisplay 
                    onBack={resetCalendar}
                    isStorageAvailable={isClient && isStorageSupported}
                  />
                  <BottomToolbar 
                    onExport={handleExport}
                    onFormatChange={setExportFormat}
                    onSaveSchedule={handleSaveSchedule}
                    onSettings={() => setShowSettingsDialog(true)}
                    selectedFormat={exportFormat}
                    isDownloading={isDownloading}
                    onExpandedChange={setIsExportPanelExpanded}
                    expandedPanel={expandedPanel}
                    onExpandedPanelChange={setExpandedPanel}
                  />
                </>
              ) : null}
            </div>
          )}
        </main>

        {/* Saved Schedules Modal */}
        {showSavedSchedules && (
          <SavedSchedules 
            onLoadSchedule={(scheduleId) => {
              loadSchedule(scheduleId)
              setShowSavedSchedules(false)
            }}
            isOpen={showSavedSchedules}
            onOpenChange={setShowSavedSchedules}
          />
        )}

        {/* Saved Schedules Settings Modal */}
        {showSettingsDialog && isCalendarGenerated && currentScheduleId && (
          <SavedSchedulesSettings 
            onLoadSchedule={loadSchedule}
            isOpen={showSettingsDialog}
            onOpenChange={(open) => {
              setShowSettingsDialog(open)
              if (!open) {
                setCurrentScheduleId(null)
              }
            }}
          />
        )}
      </div>
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