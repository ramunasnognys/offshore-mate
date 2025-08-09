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
  expandedPanel?: 'export' | 'settings' | null;
  onExpandedPanelChange?: (panel: 'export' | 'settings' | null) => void;
}

export function BottomToolbar({ onExport, onFormatChange, onSettings, selectedFormat, isDownloading = false, className = '', onExpandedChange, expandedPanel, onExpandedPanelChange }: BottomToolbarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const exportButtonRef = React.useRef<HTMLButtonElement>(null);

  const handleExpandedChange = (expanded: boolean) => {
    setIsExpanded(expanded);
    onExpandedChange?.(expanded);
  };

  const handleExport = () => {
    onExport();
    handleExpandedChange(false);
  };

  const handlePanelChange = (panel: 'export' | 'settings' | null) => {
    if (panel === 'export') {
      handleExpandedChange(panel !== null);
    }
    onExpandedPanelChange?.(panel);
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
      
      {/* Bottom Toolbar (outer wrapper made non-interactive to prevent Chrome hit-area bugs) */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 pointer-events-none ${className}`} style={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}>
        {/* Expanded Export Options */}
        <div className={`
          bg-gradient-to-t from-white/98 via-white/95 to-white/90 backdrop-blur-2xl 
          border-t border-white/60 shadow-2xl shadow-black/10
          transform transition-all duration-300 ease-out
          ${isExpanded ? 'translate-y-0 z-50 relative pointer-events-auto' : 'translate-y-full relative pointer-events-none'}
        `}>
          <div className="px-6 py-4" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Export Calendar</h3>
              <button
                onClick={() => handleExpandedChange(false)}
                className="p-2 rounded-full hover:bg-white/60 hover:shadow-md hover:scale-105 
                  active:scale-95 transition-all duration-200 ease-out group
                  focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:ring-offset-2"
                aria-label="Close export options"
                title="Close export panel"
              >
                <ChevronUp className="w-5 h-5 text-gray-600 group-hover:text-orange-500 group-hover:scale-110 
                  transition-all duration-200 ease-out" />
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
              className="w-full bg-black text-white rounded-xl py-3 font-medium flex items-center justify-center gap-2 
                hover:bg-gray-900 hover:shadow-lg hover:shadow-black/20 hover:scale-[1.02] 
                active:scale-[0.98] transition-all duration-200 ease-out disabled:opacity-50 disabled:hover:scale-100
                focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:ring-offset-2"
            >
              <Download className={`w-5 h-5 ${isDownloading ? 'animate-bounce' : 'transition-transform duration-200'}`} />
              {isDownloading ? (selectedFormat === 'ics' ? 'Creating...' : 'Exporting...') : 'Export Calendar'}
            </button>
          </div>
        </div>
        
        {/* Main Toolbar */}
        <div className={`bg-gradient-to-t from-white/98 via-white/95 to-white/90 backdrop-blur-2xl 
          border-t border-white/60 shadow-2xl shadow-black/5
          ${isExpanded ? 'pointer-events-none z-40' : 'z-40'} relative pointer-events-auto`} 
          style={{ position: 'relative', contain: 'layout' }}>
          <div className="flex items-center justify-center py-3 px-4" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
            {/* Export Button */}
            <button
              ref={exportButtonRef}
              onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handlePanelChange(expandedPanel === 'export' ? null : 'export');
              }}
              onClick={(e) => {
                // Keep click for keyboard/mouse accessibility
                e.stopPropagation();
                handlePanelChange(expandedPanel === 'export' ? null : 'export');
              }}
              className="p-3 rounded-xl hover:bg-white/60 hover:shadow-lg hover:shadow-orange-500/10 
                hover:scale-105 active:scale-95 transition-all duration-200 ease-out group touch-manipulation
                focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:ring-offset-2 focus:ring-offset-white/80
                flex-1"
              aria-label="Export calendar - Open export options"
              title="Export calendar in different formats"
              type="button"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <Download className="w-5 h-5 text-gray-700 group-hover:text-orange-500 group-hover:scale-110 
                transition-all duration-200 ease-out mx-auto" />
            </button>
            
            {/* First Divider */}
            <div className="h-6 w-px bg-gradient-to-b from-transparent via-gray-300/60 to-transparent mx-4"></div>
            
            {/* Share Button */}
            <button
              className="p-3 rounded-xl hover:bg-white/60 hover:shadow-lg hover:shadow-orange-500/10 
                hover:scale-105 active:scale-95 transition-all duration-200 ease-out group
                focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:ring-offset-2 focus:ring-offset-white/80
                flex-1"
              aria-label="Share calendar - Share your rotation schedule"
              title="Share your rotation schedule with others"
            >
              <Share2 className="w-5 h-5 text-gray-700 group-hover:text-orange-500 group-hover:scale-110 
                transition-all duration-200 ease-out mx-auto" />
            </button>
            
            {/* Second Divider */}
            <div className="h-6 w-px bg-gradient-to-b from-transparent via-gray-300/60 to-transparent mx-4"></div>
            
            {/* Settings Button */}
            <button
              onClick={() => {
                handlePanelChange(expandedPanel === 'settings' ? null : 'settings');
                if (expandedPanel !== 'settings') {
                  onSettings();
                }
              }}
              className="p-3 rounded-xl hover:bg-white/60 hover:shadow-lg hover:shadow-orange-500/10 
                hover:scale-105 active:scale-95 transition-all duration-200 ease-out group
                focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:ring-offset-2 focus:ring-offset-white/80
                flex-1"
              aria-label="Settings - Manage your schedule preferences"
              title="Manage your schedule settings and preferences"
            >
              <Settings className="w-5 h-5 text-gray-700 group-hover:text-orange-500 group-hover:scale-110 
                transition-all duration-200 ease-out mx-auto" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}