'use client'

import React, { useState } from 'react';
import { Download, FileImage, FileText, X, Share2 } from 'lucide-react';
import { ExportFormat } from './export-format-selector';

interface FloatingActionMenuProps {
  onExport: (format: ExportFormat) => void;
  isDownloading?: boolean;
  className?: string;
}

export function FloatingActionMenu({ onExport, isDownloading = false, className = '' }: FloatingActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredFormat, setHoveredFormat] = useState<ExportFormat | null>(null);

  const handleExport = (format: ExportFormat) => {
    onExport(format);
    setIsOpen(false);
  };

  return (
    <div className={`fixed bottom-8 right-8 z-40 ${className}`}>
      {/* Backdrop for focus */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Menu Options */}
      <div className={`
        absolute bottom-16 right-0 transition-all duration-300 transform origin-bottom-right
        ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
      `}>
        <div className="flex flex-col gap-3 items-end">
          {/* Share Option */}
          <button
            className="flex items-center gap-3 bg-white rounded-full pl-4 pr-5 py-3 shadow-lg hover:shadow-xl transition-all duration-200 group"
            onClick={() => {
              // Share functionality to be implemented
              setIsOpen(false);
            }}
          >
            <Share2 className="w-5 h-5 text-gray-700 group-hover:text-blue-500 transition-colors" />
            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-500 transition-colors">
              Share
            </span>
          </button>
          
          {/* PDF Export */}
          <button
            className="flex items-center gap-3 bg-white rounded-full pl-4 pr-5 py-3 shadow-lg hover:shadow-xl transition-all duration-200 group"
            onMouseEnter={() => setHoveredFormat('pdf')}
            onMouseLeave={() => setHoveredFormat(null)}
            onClick={() => handleExport('pdf')}
            disabled={isDownloading}
          >
            <FileText className="w-5 h-5 text-gray-700 group-hover:text-orange-500 transition-colors" />
            <span className="text-sm font-medium text-gray-700 group-hover:text-orange-500 transition-colors">
              Export as PDF
            </span>
          </button>
          
          {/* PNG Export */}
          <button
            className="flex items-center gap-3 bg-white rounded-full pl-4 pr-5 py-3 shadow-lg hover:shadow-xl transition-all duration-200 group"
            onMouseEnter={() => setHoveredFormat('png')}
            onMouseLeave={() => setHoveredFormat(null)}
            onClick={() => handleExport('png')}
            disabled={isDownloading}
          >
            <FileImage className="w-5 h-5 text-gray-700 group-hover:text-orange-500 transition-colors" />
            <span className="text-sm font-medium text-gray-700 group-hover:text-orange-500 transition-colors">
              Export as PNG
            </span>
          </button>
        </div>
      </div>
      
      {/* Main FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          relative bg-black text-white rounded-full p-4 shadow-lg hover:shadow-xl 
          transition-all duration-300 transform hover:scale-105 active:scale-95
          ${isOpen ? 'rotate-45' : 'rotate-0'}
          ${isDownloading ? 'animate-pulse' : ''}
        `}
        aria-label={isOpen ? 'Close menu' : 'Open export menu'}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Download className={`w-6 h-6 ${isDownloading ? 'animate-bounce' : ''}`} />
        )}
        
        {/* Ripple effect on hover */}
        {!isOpen && !isDownloading && (
          <span className="absolute inset-0 rounded-full bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-300" />
        )}
      </button>
      
      {/* Tooltip */}
      {hoveredFormat && !isDownloading && (
        <div className="absolute bottom-20 right-20 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 pointer-events-none whitespace-nowrap">
          {hoveredFormat === 'png' ? 'High-quality image' : 'Printable document'}
          <div className="absolute bottom-0 right-4 transform translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900" />
        </div>
      )}
    </div>
  );
}