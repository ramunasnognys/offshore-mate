import React from 'react';
import { Loader2 } from 'lucide-react';

interface ExportProgressModalProps {
  isOpen: boolean;
  format: 'png' | 'pdf';
}

export function ExportProgressModal({ isOpen, format }: ExportProgressModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="backdrop-blur-xl bg-white/95 rounded-2xl md:rounded-3xl shadow-xl border border-white/30 p-6 max-w-sm w-full">
        <div className="flex flex-col items-center text-center">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {format === 'pdf' ? 'Generating PDF...' : 'Creating Image...'}
          </h3>
          <p className="text-sm text-gray-600">
            {format === 'pdf' 
              ? 'Your calendar is being converted to PDF format. This may take a moment.'
              : 'Your calendar image is being prepared for download.'}
          </p>
          {format === 'pdf' && (
            <p className="text-xs text-gray-500 mt-3">
              Tip: PDF generation works best on desktop browsers.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}