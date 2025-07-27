'use client'

import React, { useEffect } from 'react'
import { ErrorToast } from '@/components/error-toast'
import { ExportProgressModal } from '@/components/export-progress-modal'
import { PDFExportErrorDialog } from '@/components/pdf-export-error-dialog'
import { useUI } from '@/contexts/UIContext'
import { useMobileDetection } from '@/hooks/useMobileDetection'
import { ExportFormat } from '@/hooks/useExportCalendar'

interface NotificationManagerProps {
  saveNotification?: string
  onClearSaveNotification?: () => void
  // Export-related props
  isDownloading?: boolean
  exportFormat?: ExportFormat
  showPDFError?: boolean
  pdfErrorMessage?: string
  onClosePDFError?: () => void
  onSwitchToPNG?: () => void
}

export function NotificationManager({ 
  saveNotification,
  onClearSaveNotification,
  isDownloading = false,
  exportFormat = 'png',
  showPDFError = false,
  pdfErrorMessage = '',
  onClosePDFError,
  onSwitchToPNG
}: NotificationManagerProps) {
  const { errorMessage, clearError } = useUI()
  const isMobileView = useMobileDetection()

  // Auto-clear save notification after 3 seconds
  useEffect(() => {
    if (saveNotification && onClearSaveNotification) {
      const timer = setTimeout(() => {
        onClearSaveNotification()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [saveNotification, onClearSaveNotification])

  return (
    <>
      {/* Export Progress Modal */}
      <ExportProgressModal 
        isOpen={isDownloading && exportFormat === 'pdf' && !showPDFError && isMobileView === true} 
        format='pdf'
      />
      
      {/* PDF Export Error Dialog */}
      <PDFExportErrorDialog
        isOpen={showPDFError}
        onClose={onClosePDFError || (() => {})}
        onSwitchToPNG={onSwitchToPNG || (() => {})}
        error={pdfErrorMessage}
      />
      
      {/* Error Toast */}
      {errorMessage && (
        <ErrorToast 
          message={errorMessage}
          onClose={clearError}
        />
      )}

      {/* Save notification */}
      {saveNotification && (
        <div className="fixed top-4 right-4 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg shadow-md animate-fade-in-out z-50">
          {saveNotification}
        </div>
      )}
    </>
  )
}