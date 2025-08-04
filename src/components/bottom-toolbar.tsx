'use client'

import React, { useState } from 'react';
import { Download, Share2, Settings, ChevronUp, CalendarPlus } from 'lucide-react';
import { ExportFormat } from './export-format-selector';

interface BottomToolbarProps {
  onExport: () => void;
  onFormatChange: (format: ExportFormat) => void;
  onSettings: () => void;
  selectedFormat: ExportFormat;
  isDownloading?: boolean;
  className?: string;
  onExpandedChange?: (expanded: boolean) => void;
}

export function BottomToolbar({ onExport, onFormatChange, onSettings, selectedFormat, isDownloading = false, className = '', onExpandedChange }: BottomToolbarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpandedChange = (expanded: boolean) => {
    setIsExpanded(expanded);
    onExpandedChange?.(expanded);
  };

  const handleExport = () => {
    onExport();
    handleExpandedChange(false);
  };

  return (
    <>
      {/* Backdrop when expanded */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => handleExpandedChange(false)}
        />
      )}
      
      {/* Bottom Toolbar */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 ${className}`} style={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}>
        {/* Expanded Export Options */}
        <div className={`
          bg-white/95 backdrop-blur-xl border-t border-gray-200/50 
          transform transition-all duration-300 ease-out
          ${isExpanded ? 'translate-y-0' : 'translate-y-full'}
        `}>
          <div className="px-6 py-4" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Export Calendar</h3>
              <button
                onClick={() => handleExpandedChange(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ChevronUp className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            {/* Format Options */}
            <div className="space-y-3 mb-4">
              <label className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border-2 border-transparent has-[:checked]:border-orange-500 has-[:checked]:bg-orange-50 transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="exportFormat"
                    value="png"
                    checked={selectedFormat === 'png'}
                    onChange={() => onFormatChange('png')}
                    className="sr-only"
                  />
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <span className="text-xl">🖼️</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">PNG Image</div>
                    <div className="text-sm text-gray-500">High quality image file</div>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 ${selectedFormat === 'png' ? 'border-orange-500 bg-orange-500' : 'border-gray-300'} relative`}>
                  {selectedFormat === 'png' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </div>
              </label>
              
              <label className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border-2 border-transparent has-[:checked]:border-orange-500 has-[:checked]:bg-orange-50 transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="exportFormat"
                    value="pdf"
                    checked={selectedFormat === 'pdf'}
                    onChange={() => onFormatChange('pdf')}
                    className="sr-only"
                  />
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <span className="text-xl">📄</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">PDF Document</div>
                    <div className="text-sm text-gray-500">Printable document format</div>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 ${selectedFormat === 'pdf' ? 'border-orange-500 bg-orange-500' : 'border-gray-300'} relative`}>
                  {selectedFormat === 'pdf' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </div>
              </label>
              
              <label className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border-2 border-transparent has-[:checked]:border-orange-500 has-[:checked]:bg-orange-50 transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="exportFormat"
                    value="ics"
                    checked={selectedFormat === 'ics'}
                    onChange={() => onFormatChange('ics')}
                    className="sr-only"
                  />
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <CalendarPlus className="w-5 h-5 text-gray-700" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">Add to Calendar</div>
                    <div className="text-sm text-gray-500">Import to calendar app</div>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 ${selectedFormat === 'ics' ? 'border-orange-500 bg-orange-500' : 'border-gray-300'} relative`}>
                  {selectedFormat === 'ics' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </div>
              </label>
            </div>
            
            {/* Export Button */}
            <button
              onClick={handleExport}
              disabled={isDownloading}
              className="w-full bg-black text-white rounded-xl py-3 font-medium flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors disabled:opacity-50"
            >
              <Download className={`w-5 h-5 ${isDownloading ? 'animate-bounce' : ''}`} />
              {isDownloading ? (selectedFormat === 'ics' ? 'Creating...' : 'Exporting...') : 'Export Calendar'}
            </button>
          </div>
        </div>
        
        {/* Main Toolbar */}
        <div className="bg-white/95 backdrop-blur-xl border-t border-gray-200/50" style={{ position: 'relative', contain: 'layout' }}>
          <div className="flex items-center justify-around py-2" style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}>
            <button
              onClick={() => handleExpandedChange(!isExpanded)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors group"
              aria-label="Export"
            >
              <Download className="w-5 h-5 text-gray-700 group-hover:text-orange-500 transition-colors" />
            </button>
            
            <button
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors group"
              aria-label="Share"
            >
              <Share2 className="w-5 h-5 text-gray-700 group-hover:text-orange-500 transition-colors" />
            </button>
            
            <button
              onClick={onSettings}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors group"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5 text-gray-700 group-hover:text-orange-500 transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}