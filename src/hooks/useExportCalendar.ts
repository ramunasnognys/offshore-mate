import { useState, useCallback, useEffect } from 'react'
import { MonthData, RotationPattern } from '@/types/rotation'
import { downloadCalendarAsImage } from '@/lib/utils/download'

export type ExportFormat = 'png' | 'pdf' | 'ics'

interface UseExportCalendarProps {
  isMobileView?: boolean | null
  onError?: (error: string) => void
  onSuccess?: (message: string) => void
}

interface UseExportCalendarReturn {
  // State
  isDownloading: boolean
  exportFormat: ExportFormat
  showPDFError: boolean
  pdfErrorMessage: string
  
  // Actions
  setExportFormat: (format: ExportFormat) => void
  handleDownload: (
    yearCalendar: MonthData[],
    scheduleName: string,
    rotationPattern: string,
    startDate: string
  ) => Promise<void>
  setShowPDFError: (show: boolean) => void
  handleUsePNGInstead: () => void
}

/**
 * Custom hook for managing calendar export functionality
 */
export function useExportCalendar({
  isMobileView = false,
  onError,
  onSuccess
}: UseExportCalendarProps = {}): UseExportCalendarReturn {
  const [isDownloading, setIsDownloading] = useState(false)
  const [exportFormat, setExportFormat] = useState<ExportFormat>(() => {
    // Load saved format preference from localStorage
    if (typeof window !== 'undefined') {
      const savedFormat = localStorage.getItem('offshore_mate_export_format')
      return (savedFormat === 'pdf' || savedFormat === 'png' || savedFormat === 'ics') ? savedFormat : 'png'
    }
    return 'png'
  })
  const [showPDFError, setShowPDFError] = useState(false)
  const [pdfErrorMessage, setPdfErrorMessage] = useState('')

  // Save format preference when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('offshore_mate_export_format', exportFormat)
    }
  }, [exportFormat])

  const handleDownload = useCallback(async (
    yearCalendar: MonthData[],
    scheduleName: string,
    rotationPattern: string,
    startDate: string
  ) => {
    try {
      setIsDownloading(true)
      
      // Show progress modal for PDF generation on mobile
      const showProgress = exportFormat === 'pdf' && isMobileView === true
      
      // Add slight delay for progress modal to appear
      if (showProgress) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      
      if (exportFormat === 'pdf') {
        // Use dynamic import for PDF export
        const { exportCalendarAsJsPDF } = await import('@/lib/utils/jspdf-export')
        
        await exportCalendarAsJsPDF({
          calendar: yearCalendar,
          scheduleName: scheduleName || `${rotationPattern} Rotation`,
          rotationPattern,
          startDate
        })
      } else if (exportFormat === 'ics') {
        // Use dynamic import for ical export
        const { exportCalendarAsICS } = await import('@/lib/utils/ical-export')
        
        await exportCalendarAsICS({
          calendar: yearCalendar,
          scheduleName: scheduleName || 'Offshore Schedule',
          rotationPattern: rotationPattern as RotationPattern,
          startDate
        })
        
        // Show success notification
        onSuccess?.('Your schedule is ready. Check your device for a calendar import prompt.')
      } else {
        // PNG export
        const filename = `offshore-calendar-${rotationPattern}-${startDate}.png`
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
          'Failed to generate PDF. Your browser may not support PDF generation. Please try using PNG format instead.'
        console.error('PDF Export Error Details:', {
          error,
          browserInfo: navigator.userAgent,
          canvasSupport: !!document.createElement('canvas').getContext,
          memoryInfo: (performance as unknown as { memory?: unknown }).memory || 'Not available'
        })
        setPdfErrorMessage(message)
        setShowPDFError(true)
      } else if (exportFormat === 'ics') {
        // iCalendar export errors
        const message = error instanceof Error ? error.message : 
          'Failed to create calendar file. Please try again.'
        console.error('iCS Export Error Details:', {
          error,
          calendarData: yearCalendar?.length || 0,
          scheduleName: scheduleName || 'Unknown',
          rotationPattern
        })
        onError?.(message)
      } else {
        // PNG export errors
        const message = error instanceof Error ? error.message : 
          'Failed to download calendar image. Please try again.'
        console.error('PNG Export Error Details:', {
          error,
          elementFound: !!document.getElementById('download-calendar'),
          html2canvasAvailable: typeof window !== 'undefined' && 'html2canvas' in window
        })
        onError?.(message)
      }
    } finally {
      setIsDownloading(false)
    }
  }, [exportFormat, isMobileView, onError, onSuccess])

  const handleUsePNGInstead = useCallback(() => {
    setShowPDFError(false)
    setExportFormat('png')
  }, [])

  return {
    isDownloading,
    exportFormat,
    showPDFError,
    pdfErrorMessage,
    setExportFormat,
    handleDownload,
    setShowPDFError,
    handleUsePNGInstead
  }
}