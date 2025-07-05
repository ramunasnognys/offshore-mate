import React from 'react';
import { FileImage, FileText } from 'lucide-react';

export type ExportFormat = 'png' | 'pdf';

interface ExportFormatSelectorProps {
  selectedFormat: ExportFormat;
  onFormatChange: (format: ExportFormat) => void;
}

export function ExportFormatSelector({ selectedFormat, onFormatChange }: ExportFormatSelectorProps) {
  return (
    <div className="backdrop-blur-xl bg-white/30 rounded-2xl md:rounded-3xl shadow-lg border border-white/30 p-4 md:p-6 mb-4">
      <span className="text-gray-500 text-xs md:text-sm font-medium mb-3 block">
        Export Format
      </span>
      <div className="flex gap-3">
        <label className="flex-1">
          <input
            type="radio"
            name="exportFormat"
            value="png"
            checked={selectedFormat === 'png'}
            onChange={() => onFormatChange('png')}
            className="sr-only"
          />
          <div className={`
            flex items-center justify-center gap-2 p-3 rounded-xl cursor-pointer transition-all
            ${selectedFormat === 'png' 
              ? 'bg-white/50 text-orange-600 ring-2 ring-orange-500/30' 
              : 'bg-white/20 text-gray-600 hover:bg-white/30'}
          `}>
            <FileImage className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-sm md:text-base font-medium">PNG Image</span>
          </div>
        </label>
        
        <label className="flex-1">
          <input
            type="radio"
            name="exportFormat"
            value="pdf"
            checked={selectedFormat === 'pdf'}
            onChange={() => onFormatChange('pdf')}
            className="sr-only"
          />
          <div className={`
            flex items-center justify-center gap-2 p-3 rounded-xl cursor-pointer transition-all
            ${selectedFormat === 'pdf' 
              ? 'bg-white/50 text-orange-600 ring-2 ring-orange-500/30' 
              : 'bg-white/20 text-gray-600 hover:bg-white/30'}
          `}>
            <FileText className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-sm md:text-base font-medium">PDF Document</span>
          </div>
        </label>
      </div>
    </div>
  );
}