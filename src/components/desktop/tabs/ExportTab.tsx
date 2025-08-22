'use client'

import React from 'react'
import { Download, CalendarPlus } from 'lucide-react'
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
        <h3 className="font-semibold mb-4 text-gray-800">Export Calendar</h3>
        <p className="text-sm text-gray-600 mb-4">
          Choose your preferred format and download your calendar.
        </p>
      </div>
      
      {/* Format Options */}
      <div className="space-y-3">
        <label className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border-2 border-transparent has-[:checked]:border-orange-500 has-[:checked]:bg-orange-50 transition-all cursor-pointer">
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="desktopExportFormat"
              value="png"
              checked={selectedFormat === 'png'}
              onChange={() => onFormatChange('png')}
              className="sr-only"
            />
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-lg">🖼️</span>
            </div>
            <div>
              <div className="font-medium text-gray-800">PNG Image</div>
              <div className="text-xs text-gray-500">High quality image file</div>
            </div>
          </div>
          <div className={`w-4 h-4 rounded-full border-2 ${selectedFormat === 'png' ? 'border-orange-500 bg-orange-500' : 'border-gray-300'} relative`}>
            {selectedFormat === 'png' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
              </div>
            )}
          </div>
        </label>
        
        <label className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border-2 border-transparent has-[:checked]:border-orange-500 has-[:checked]:bg-orange-50 transition-all cursor-pointer">
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="desktopExportFormat"
              value="pdf"
              checked={selectedFormat === 'pdf'}
              onChange={() => onFormatChange('pdf')}
              className="sr-only"
            />
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-lg">📄</span>
            </div>
            <div>
              <div className="font-medium text-gray-800">PDF Document</div>
              <div className="text-xs text-gray-500">Printable document format</div>
            </div>
          </div>
          <div className={`w-4 h-4 rounded-full border-2 ${selectedFormat === 'pdf' ? 'border-orange-500 bg-orange-500' : 'border-gray-300'} relative`}>
            {selectedFormat === 'pdf' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
              </div>
            )}
          </div>
        </label>
        
        <label className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border-2 border-transparent has-[:checked]:border-orange-500 has-[:checked]:bg-orange-50 transition-all cursor-pointer">
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="desktopExportFormat"
              value="ics"
              checked={selectedFormat === 'ics'}
              onChange={() => onFormatChange('ics')}
              className="sr-only"
            />
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <CalendarPlus className="w-4 h-4 text-gray-700" />
            </div>
            <div>
              <div className="font-medium text-gray-800">Add to Calendar</div>
              <div className="text-xs text-gray-500">Import to calendar app</div>
            </div>
          </div>
          <div className={`w-4 h-4 rounded-full border-2 ${selectedFormat === 'ics' ? 'border-orange-500 bg-orange-500' : 'border-gray-300'} relative`}>
            {selectedFormat === 'ics' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
              </div>
            )}
          </div>
        </label>
      </div>
      
      {/* Export Button */}
      <button
        onClick={onExport}
        disabled={isDownloading}
        className="w-full bg-black text-white rounded-xl py-3 font-medium flex items-center justify-center gap-2 
          hover:bg-gray-900 hover:shadow-lg hover:shadow-black/20 hover:scale-[1.02] 
          active:scale-[0.98] transition-all duration-200 ease-out disabled:opacity-50 disabled:hover:scale-100
          focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:ring-offset-2"
      >
        <Download className={`w-4 h-4 ${isDownloading ? 'animate-bounce' : 'transition-transform duration-200'}`} />
        {isDownloading ? (
          selectedFormat === 'ics' ? 'Creating...' : 'Exporting...'
        ) : (
          'Export Calendar'
        )}
      </button>
      
      {/* Format Info */}
      <div className="text-xs text-gray-500 space-y-1">
        {selectedFormat === 'png' && (
          <p>• Perfect for sharing on social media or messaging apps</p>
        )}
        {selectedFormat === 'pdf' && (
          <p>• Ideal for printing or professional documentation</p>
        )}
        {selectedFormat === 'ics' && (
          <p>• Compatible with Google Calendar, Outlook, and Apple Calendar</p>
        )}
      </div>
    </div>
  )
}