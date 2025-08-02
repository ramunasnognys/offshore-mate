'use client'

import React, { useState, useEffect } from 'react'
import { ArrowRight, XCircle } from 'lucide-react'
import { DatePicker } from "@/components/date-picker"
import { RotationButton } from "@/components/rotation-button"
import { generateRotationCalendar } from '@/lib/utils/rotation'
import { ScheduleList } from '@/components/schedule-list'
import { DownloadCalendar } from '@/components/download-calendar'
import { MonthData, RotationPattern } from '@/types/rotation'
import { downloadCalendarAsImage } from '@/lib/utils/download'
// Removed static imports for PDF components - will lazy load them
import { ExportFormat } from '@/components/export-format-selector'
import { ExportProgressModal } from '@/components/export-progress-modal'
import { PDFExportErrorDialog } from '@/components/pdf-export-error-dialog'
import { ErrorToast } from '@/components/error-toast'
import { SavedSchedules } from '@/components/saved-schedules'
import { SettingsDialog } from '@/components/settings-dialog'
import { SavedSchedule, ScheduleMetadata, saveSchedule, getSchedule, isStorageAvailable, generateScheduleId } from '@/lib/utils/storage'
import { BottomToolbar } from '@/components/bottom-toolbar'
import { FloatingActionMenu } from '@/components/floating-action-menu'

type RotationOption = {
  label: string
  value: string
  workDays: number
  offDays: number
}

export default function Home() {
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedRotation, setSelectedRotation] = useState<RotationPattern | ''>('14/21')
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [customWorkDays, setCustomWorkDays] = useState('')
  const [customOffDays, setCustomOffDays] = useState('')
  const [isCalendarGenerated, setIsCalendarGenerated] = useState(false)
  const [yearCalendar, setYearCalendar] = useState<MonthData[]>([])
  const [isDownloading, setIsDownloading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [currentScheduleId, setCurrentScheduleId] = useState<string | null>(null)
  const [scheduleName, setScheduleName] = useState('')
  const [showSavedSchedules, setShowSavedSchedules] = useState(false)
  const [saveNotification, setSaveNotification] = useState('')
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0)
  const [isMobileView, setIsMobileView] = useState<boolean | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [exportFormat, setExportFormat] = useState<ExportFormat>(() => {
    // Load saved format preference from localStorage
    if (typeof window !== 'undefined') {
      const savedFormat = localStorage.getItem('offshore_mate_export_format');
      return (savedFormat === 'pdf' || savedFormat === 'png' || savedFormat === 'ics') ? savedFormat : 'png';
    }
    return 'png';
  })
  const [errorMessage, setErrorMessage] = useState('')
  const [showPDFError, setShowPDFError] = useState(false)
  const [pdfErrorMessage, setPdfErrorMessage] = useState<string>('')

  const rotationOptions: RotationOption[] = [
    { label: '14/14', value: '14/14', workDays: 14, offDays: 14 },
    { label: '14/21', value: '14/21', workDays: 14, offDays: 21 },
    { label: 'Other', value: 'Other', workDays: 0, offDays: 0 }
  ]

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const formattedDate = date.toLocaleDateString('en-CA')
      setSelectedDate(formattedDate)
    }
  }

  // Utility function to find current month index in calendar
  const findCurrentMonthIndex = (calendar: MonthData[]): number => {
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

  const handleGenerateCalendar = () => {
    if (!selectedDate && !selectedRotation) {
      setErrorMessage('Please select both a start date and rotation pattern to generate your calendar')
      return
    }
    
    if (!selectedDate) {
      setErrorMessage('Please select a start date for your rotation schedule')
      return
    }
    
    if (!selectedRotation) {
      setErrorMessage('Please select a work rotation pattern (14/14, 14/21, or Other)')
      return
    }
    
    // Validate custom rotation inputs
    if (selectedRotation === 'Other') {
      const workDays = parseInt(customWorkDays)
      const offDays = parseInt(customOffDays)
      
      if (!customWorkDays || !customOffDays) {
        setErrorMessage('Please enter both work days and off days for your custom rotation')
        return
      }
      
      if (workDays < 1 || workDays > 365) {
        setErrorMessage('Work days must be between 1 and 365 days')
        return
      }
      
      if (offDays < 1 || offDays > 365) {
        setErrorMessage('Off days must be between 1 and 365 days')
        return
      }
    }
    
    const calendar = generateRotationCalendar(
      new Date(selectedDate),
      selectedRotation as RotationPattern,
      12,
      selectedRotation === 'Other' ? {
        workDays: parseInt(customWorkDays),
        offDays: parseInt(customOffDays)
      } : undefined
    )
    
    setYearCalendar(calendar)
    setIsCalendarGenerated(true)
    setIsSaved(false)
    setCurrentScheduleId(null)
    
    // Auto-navigate to current month
    const currentMonthIndex = findCurrentMonthIndex(calendar)
    setCurrentMonthIndex(currentMonthIndex)
    
    // Generate a default schedule name with date and rotation
    const rotationLabel = selectedRotation === 'Other' 
      ? `${customWorkDays}/${customOffDays} Rotation` 
      : `${selectedRotation} Rotation`
    const defaultName = `${rotationLabel} (${new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })})`
    setScheduleName(defaultName)
  }

  // Handle loading a saved schedule
  const handleLoadSchedule = (scheduleId: string) => {
    try {
      const savedSchedule = getSchedule(scheduleId)
      if (!savedSchedule) return

      setSelectedDate(savedSchedule.metadata.startDate)
      setSelectedRotation(savedSchedule.metadata.rotationPattern as RotationPattern)
      setYearCalendar(savedSchedule.calendar)
      setScheduleName(savedSchedule.metadata.name)
      setCurrentScheduleId(scheduleId)
      setIsCalendarGenerated(true)
      setIsSaved(true)
      setShowSavedSchedules(false)
      
      // Auto-navigate to current month for saved schedules too
      const currentMonthIndex = findCurrentMonthIndex(savedSchedule.calendar)
      setCurrentMonthIndex(currentMonthIndex)
    } catch (error) {
      console.error('Error loading schedule:', error)
      setErrorMessage('Unable to load the saved schedule. The file may be corrupted or in an outdated format.')
    }
  }

  // Handle saving the current schedule
  const handleSaveSchedule = () => {
    if (!isClient || !isStorageAvailable()) {
      setErrorMessage('Your browser does not support local storage. Unable to save schedules.')
      return
    }

    if (!yearCalendar || yearCalendar.length === 0) {
      setErrorMessage('Please generate a calendar before saving it to your device')
      return
    }

    setIsSaving(true)
    try {
      // Create schedule metadata
      const metadata: ScheduleMetadata = {
        id: currentScheduleId || generateScheduleId(),
        name: scheduleName || `${selectedRotation} Rotation`,
        rotationPattern: selectedRotation,
        startDate: selectedDate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        schemaVersion: 'v1'
      }

      // Create the schedule object
      const scheduleToSave: SavedSchedule = {
        metadata,
        calendar: yearCalendar
      }

      // Save to localStorage
      const success = saveSchedule(scheduleToSave)

      if (success) {
        setCurrentScheduleId(metadata.id)
        setIsSaved(true)
        // Show notification
        setSaveNotification('Schedule saved successfully!')
        setTimeout(() => setSaveNotification(''), 3000) // Clear after 3 seconds
      } else {
        setErrorMessage('Failed to save the schedule. Your storage may be full or restricted.')
      }
    } catch (error) {
      console.error('Error saving schedule:', error)
      setErrorMessage('Unable to save the schedule. Please check your browser settings and try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDownload = async () => {
    try {
      setIsDownloading(true)
      
      // Show progress modal for PDF generation on mobile
      const showProgress = exportFormat === 'pdf' && isMobileView === true;
      
      // Add slight delay for progress modal to appear
      if (showProgress) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      if (exportFormat === 'pdf') {
        // Use jsPDF for better React 19 RC compatibility
        const { exportCalendarAsJsPDF } = await import('@/lib/utils/jspdf-export');
        
        await exportCalendarAsJsPDF({
          calendar: yearCalendar,
          scheduleName: scheduleName || `${selectedRotation} Rotation`,
          rotationPattern: selectedRotation,
          startDate: selectedDate
        })
      } else if (exportFormat === 'ics') {
        // Use dynamic import for ical export
        const { exportCalendarAsICS } = await import('@/lib/utils/ical-export');
        
        await exportCalendarAsICS({
          calendar: yearCalendar,
          scheduleName: scheduleName || 'Offshore Schedule',
          rotationPattern: selectedRotation as RotationPattern,
          startDate: selectedDate
        })
        
        // Show success notification
        setSaveNotification('Your schedule is ready. Check your device for a calendar import prompt.');
        setTimeout(() => setSaveNotification(''), 5000);
      } else {
        const filename = `offshore-calendar-${selectedRotation}-${selectedDate}.png`
        await downloadCalendarAsImage('download-calendar', filename)
      }
    } catch (error) {
      console.error('Failed to download calendar:', error)
      console.error('Error details:', {
        type: error?.constructor?.name,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      })
      // Handle PDF errors specially
      if (exportFormat === 'pdf') {
        const message = error instanceof Error ? error.message : 
          'Failed to generate PDF. Your browser may not support PDF generation. Please try using PNG format instead.';
        console.error('PDF Export Error Details:', {
          error,
          browserInfo: navigator.userAgent,
          canvasSupport: !!document.createElement('canvas').getContext,
          memoryInfo: (performance as any).memory || 'Not available'
        });
        setPdfErrorMessage(message);
        setShowPDFError(true);
      } else if (exportFormat === 'ics') {
        // iCalendar export errors - add more detailed logging
        const message = error instanceof Error ? error.message : 
          'Failed to create calendar file. Please try again.';
        console.error('iCS Export Error Details:', {
          error,
          calendarData: yearCalendar?.length || 0,
          scheduleName: scheduleName || 'Unknown',
          rotationPattern: selectedRotation
        });
        setErrorMessage(message);
      } else {
        // PNG export errors
        const message = error instanceof Error ? error.message : 
          'Failed to download calendar image. Please try again.';
        console.error('PNG Export Error Details:', {
          error,
          elementFound: !!document.getElementById('download-calendar'),
          html2canvasAvailable: typeof window !== 'undefined' && 'html2canvas' in window
        });
        setErrorMessage(message);
      }
    } finally {
      setIsDownloading(false)
    }
  }

  // Client-side initialization
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768) // MD breakpoint
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Month navigation functions
  const goToPreviousMonth = () => {
    setCurrentMonthIndex(prev => Math.max(0, prev - 1))
  }

  const goToNextMonth = () => {
    setCurrentMonthIndex(prev => Math.min(yearCalendar.length - 1, prev + 1))
  }


  // Get current period status for smart header
  const getCurrentPeriodStatus = () => {
    if (!yearCalendar.length) return null
    
    const today = new Date()
    const currentMonth = yearCalendar.find(month => {
      return month.days.some(day => {
        const dayDate = new Date(day.date)
        return dayDate.toDateString() === today.toDateString()
      })
    })

    if (!currentMonth) return null

    const todayData = currentMonth.days.find(day => {
      const dayDate = new Date(day.date)
      return dayDate.toDateString() === today.toDateString()
    })

    if (!todayData) return null

    return {
      isWork: todayData.isWorkDay,
      isOff: !todayData.isWorkDay && !todayData.isTransitionDay,
      isTransition: todayData.isTransitionDay,
      month: currentMonth.month,
      year: currentMonth.year
    }
  }


  const handleUsePNGInstead = async () => {
    setShowPDFError(false)
    setExportFormat('png')
    // Automatically trigger PNG download
    setTimeout(() => {
      handleDownload()
    }, 100)
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-white to-pink-100 flex items-center justify-center p-4 md:p-8 bg-fixed">
      {/* Export Progress Modal */}
      <ExportProgressModal 
        isOpen={isDownloading && exportFormat === 'pdf' && !showPDFError} 
        format='pdf'
      />
      
      {/* PDF Export Error Dialog */}
      <PDFExportErrorDialog
        isOpen={showPDFError}
        onClose={() => setShowPDFError(false)}
        onSwitchToPNG={handleUsePNGInstead}
        error={pdfErrorMessage}
      />
      
      {/* Error Toast */}
      {errorMessage && (
        <ErrorToast 
          message={errorMessage}
          onClose={() => setErrorMessage('')}
        />
      )}
      
      <div className="relative w-full max-w-[500px]">
        {/* Save notification */}
        {saveNotification && (
          <div className="fixed top-4 right-4 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg shadow-md animate-fade-in-out">
            {saveNotification}
          </div>
        )}
        <div className={`${isCalendarGenerated && isMobileView === true ? 'mb-4' : 'mb-8 md:mb-12'}`}>
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
          <div className={`${isMobileView ? 'space-y-3' : 'space-y-4 md:space-y-6'}`}>
            {/* Date Picker Button */}
            <div className="backdrop-blur-xl bg-white/30 rounded-2xl md:rounded-3xl shadow-card border border-white/30 transition-all duration-300 hover:shadow-card-hover hover:bg-white/40">
              <div className="px-4 md:px-6 py-3 md:py-4">
                <span className="text-gray-500 text-xs md:text-sm font-medium mb-0.5 md:mb-1 block">
                  Start Date
                </span>
                <DatePicker 
                  date={selectedDate ? new Date(selectedDate) : undefined}
                  onSelect={handleDateSelect}
                />
              </div>
            </div>

            {/* Work Rotation */}
            <div className="backdrop-blur-xl bg-white/30 rounded-2xl md:rounded-3xl shadow-card border border-white/30 p-4 md:p-6">
              <span className="text-gray-600 text-sm md:text-base font-medium mb-3 block">
                Work Rotation
              </span>
              <div className="grid grid-cols-3 gap-2 md:gap-3">
                {rotationOptions.map((option) => (
                  <RotationButton
                    key={option.value}
                    label={option.label}
                    isSelected={selectedRotation === option.value}
                    onClick={() => {
                      setSelectedRotation(option.value as RotationPattern)
                      if (option.value === 'Other') {
                        setShowCustomInput(true)
                      } else {
                        setShowCustomInput(false)
                        setCustomWorkDays('')
                        setCustomOffDays('')
                      }
                    }}
                    className="text-sm md:text-base"
                  />
                ))}
              </div>
              
              {/* Custom rotation input */}
              {showCustomInput && (
                <div className="mt-3 backdrop-blur-xl bg-white/30 border border-white/30 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">Work days</label>
                      <input
                        type="number"
                        value={customWorkDays}
                        onChange={(e) => setCustomWorkDays(e.target.value)}
                        className="w-full px-3 py-2 bg-white/50 backdrop-blur-sm border-white/30 rounded-md border text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800"
                        placeholder="e.g. 14"
                        min="1"
                        max="365"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">Off days</label>
                      <input
                        type="number"
                        value={customOffDays}
                        onChange={(e) => setCustomOffDays(e.target.value)}
                        className="w-full px-3 py-2 bg-white/50 backdrop-blur-sm border-white/30 rounded-md border text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800"
                        placeholder="e.g. 14"
                        min="1"
                        max="365"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* My Rotations - Next Hitch */}
            {selectedDate && selectedRotation && (
              <div className="backdrop-blur-xl bg-white/30 rounded-2xl md:rounded-3xl shadow-card border border-white/30 p-4 md:p-6">
                <span className="text-gray-600 text-sm md:text-base font-medium mb-2 block">
                  My Rotations
                </span>
                <div className="text-gray-800 text-lg md:text-xl font-semibold">
                  Next hitch: Aug 12 → Aug 26
                </div>
              </div>
            )}

            {/* Saved Schedules Button */}
            {isClient && isStorageAvailable() && (
              <div className="backdrop-blur-xl bg-white/30 rounded-2xl md:rounded-3xl shadow-card border border-white/30 transition-all duration-300 hover:shadow-card-hover hover:bg-white/40">
                <button
                  onClick={() => setShowSavedSchedules(!showSavedSchedules)}
                  className="w-full px-4 md:px-6 py-3 md:py-4 flex items-center justify-between hover:bg-white/10 transition-all duration-200 group rounded-2xl md:rounded-3xl"
                >
                  <div className="flex-grow text-left">
                    <span className="text-gray-500 text-xs md:text-sm font-medium mb-0.5 md:mb-1 block">
                      Saved Schedules
                    </span>
                    <span className="text-gray-800 text-base md:text-lg font-medium group-hover:text-orange-500 transition-colors">
                      View your saved schedules
                    </span>
                  </div>
                  <div className="flex items-center justify-center ml-3 md:ml-4">
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-orange-500 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </button>
              </div>
            )}

            {/* Show saved schedules popup */}
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
                      onLoadSchedule={handleLoadSchedule} 
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Generate Button */}
            <button
              onClick={handleGenerateCalendar}
              className="w-full text-white rounded-full px-6 py-4 font-semibold text-lg 
                transition-all duration-300 relative bg-black hover:bg-gray-900 active:scale-[0.98]"
            >
              Generate
            </button>
            
          </div>
        ) : (
          <div className="space-y-6 md:space-y-8">
            {/* Header with Back Button and Today Button */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setIsCalendarGenerated(false)}
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
                  onClick={() => {
                    const todayIndex = findCurrentMonthIndex(yearCalendar);
                    setCurrentMonthIndex(todayIndex);
                    
                    // Smooth scroll to today's month on desktop
                    if (isMobileView === false && yearCalendar.length > 0) {
                      const monthElement = document.querySelector(`[aria-labelledby*="${yearCalendar[todayIndex]?.month}-${yearCalendar[todayIndex]?.year}"]`);
                      monthElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                  }}
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

            <div>
              {/* Calendar Display */}
              <div className={isMobileView === true ? "relative" : ""}>
                {/* Swipe indicator for mobile */}
                {isMobileView === true && yearCalendar.length > 1 && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1 z-10">
                    <div className="w-8 h-1 bg-gray-300 rounded-full opacity-50"></div>
                  </div>
                )}
                <div>
                  <ScheduleList 
                    calendar={isMobileView === true && yearCalendar.length > 0 ? [yearCalendar[currentMonthIndex]] : yearCalendar} 
                    className={isMobileView === true ? "h-auto" : ""}
                    isMobile={isMobileView === true}
                    currentMonthIndex={currentMonthIndex}
                    onNavigate={(direction) => {
                      if (direction === 'prev') goToPreviousMonth();
                      else goToNextMonth();
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
                    setExportFormat(format);
                    localStorage.setItem('offshore_mate_export_format', format);
                    handleDownload();
                  }}
                  isDownloading={isDownloading}
                />
              )}
              
              {/* Bottom Toolbar - Mobile only */}
              {isMobileView === true && (
                <BottomToolbar 
                  selectedFormat={exportFormat}
                  onFormatChange={(format) => {
                    setExportFormat(format);
                    localStorage.setItem('offshore_mate_export_format', format);
                  }}
                  onExport={handleDownload}
                  onSettings={() => {
                    setShowSettings(true);
                  }}
                  isDownloading={isDownloading}
                />
              )}
              
              <DownloadCalendar calendar={yearCalendar} />
            </div>
            
            {/* Settings Dialog - Controlled by state */}
            <SettingsDialog
              scheduleName={scheduleName}
              setScheduleName={setScheduleName}
              isEditingName={isEditingName}
              setIsEditingName={setIsEditingName}
              isSaving={isSaving}
              isSaved={isSaved}
              onSave={handleSaveSchedule}
              selectedRotation={selectedRotation}
              selectedDate={selectedDate}
              isStorageAvailable={isClient && isStorageAvailable()}
              onOpenChange={setShowSettings}
              open={showSettings}
            />
          </div>
        )}

        {/* Add footer at the bottom - hide on mobile when calendar is generated */}
        {(!isCalendarGenerated || isMobileView !== true) && (
          <div className="mt-8 text-center text-sm text-gray-300 tracking-wide">
            <p className="tracking-wide">Version v.2</p>
          </div>
        )}
      </div>
    </main>
  )
}