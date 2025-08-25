'use client'

import React from 'react'
import { Download, CalendarPlus, FileImage, FileText } from 'lucide-react'
import { GenerateButton } from '@/components/ui/generate-button'
import { ExportFormat } from '@/hooks/useExportCalendar'

interface ExportTabProps {
  selectedFormat: ExportFormat
  onFormatChange: (format: ExportFormat) => void
  onExport: () => void
  isDownloading: boolean
}

export function ExportTab({ selectedFormat, onFormatChange, onExport, isDownloading }: ExportTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-2 text-gray-800 text-lg">Export Calendar</h3>
        <p className="text-sm text-gray-600">
          Choose your preferred format and download your calendar.
        </p>
      </div>
      
      {/* Format Options with cleaner design */}
      <div className="space-y-3">
        <label className="flex items-center justify-between p-4 rounded-xl bg-gray-50/50 border border-gray-200 has-[:checked]:border-orange-500 has-[:checked]:bg-orange-50/50 transition-all cursor-pointer hover:bg-gray-100/50">
          <div className="flex items-center gap-4">
            <input
              type="radio"
              name="desktopExportFormat"
              value="png"
              checked={selectedFormat === 'png'}
              onChange={() => onFormatChange('png')}
              className="sr-only"
            />
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-200">
              <FileImage className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <div className="font-medium text-gray-800">PNG Image</div>
              <div className="text-xs text-gray-500 mt-1">High quality image file</div>
            </div>
          </div>
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedFormat === 'png' ? 'border-orange-500 bg-orange-500' : 'border-gray-300'}`}>
            {selectedFormat === 'png' && (
              <div className="w-2 h-2 bg-white rounded-full" />
            )}
          </div>
        </label>
        
        <label className="flex items-center justify-between p-4 rounded-xl bg-gray-50/50 border border-gray-200 has-[:checked]:border-orange-500 has-[:checked]:bg-orange-50/50 transition-all cursor-pointer hover:bg-gray-100/50">
          <div className="flex items-center gap-4">
            <input
              type="radio"
              name="desktopExportFormat"
              value="pdf"
              checked={selectedFormat === 'pdf'}
              onChange={() => onFormatChange('pdf')}
              className="sr-only"
            />
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-200">
              <FileText className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <div className="font-medium text-gray-800">PDF Document</div>
              <div className="text-xs text-gray-500 mt-1">Printable document format</div>
            </div>
          </div>
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedFormat === 'pdf' ? 'border-orange-500 bg-orange-500' : 'border-gray-300'}`}>
            {selectedFormat === 'pdf' && (
              <div className="w-2 h-2 bg-white rounded-full" />
            )}
          </div>
        </label>
        
        <label className="flex items-center justify-between p-4 rounded-xl bg-gray-50/50 border border-gray-200 has-[:checked]:border-orange-500 has-[:checked]:bg-orange-50/50 transition-all cursor-pointer hover:bg-gray-100/50">
          <div className="flex items-center gap-4">
            <input
              type="radio"
              name="desktopExportFormat"
              value="ics"
              checked={selectedFormat === 'ics'}
              onChange={() => onFormatChange('ics')}
              className="sr-only"
            />
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-200">
              <CalendarPlus className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <div className="font-medium text-gray-800">Add to Calendar</div>
              <div className="text-xs text-gray-500 mt-1">Import to calendar app</div>
            </div>
          </div>
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedFormat === 'ics' ? 'border-orange-500 bg-orange-500' : 'border-gray-300'}`}>
            {selectedFormat === 'ics' && (
              <div className="w-2 h-2 bg-white rounded-full" />
            )}
          </div>
        </label>
      </div>
      
      {/* Export Button */}
      <GenerateButton
        variant="gradient"
        size="md"
        icon={<Download className="h-4 w-4" />}
        onClick={onExport}
        disabled={isDownloading}
        isLoading={isDownloading}
        className="w-full mt-4"
        ariaDescribedBy="export-button-description"
      >
        Export Calendar
      </GenerateButton>
      
      {/* Hidden description for accessibility */}
      <div id="export-button-description" className="sr-only">
        {isDownloading ? (
          selectedFormat === 'ics' ? 'Creating calendar file...' : 'Exporting calendar...'
        ) : (
          `Export calendar in ${selectedFormat.toUpperCase()} format`
        )}
      </div>
    </div>
  )
}