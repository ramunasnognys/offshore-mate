'use client';

import React from 'react';
import { Settings, Save, Edit3, Check, ChevronUp, Mail } from 'lucide-react';

interface SettingsBottomSheetProps {
  // Schedule name state and handlers
  scheduleName: string;
  setScheduleName: (name: string) => void;
  isEditingName: boolean;
  setIsEditingName: (editing: boolean) => void;
  
  // Save functionality
  isSaving: boolean;
  isSaved: boolean;
  onSave: () => void;
  
  // Schedule details for subtitle
  selectedRotation: string;
  selectedDate: string;
  
  // Storage availability check
  isStorageAvailable: boolean;
  
  // Sheet control
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsBottomSheet({
  scheduleName,
  setScheduleName,
  isEditingName,
  setIsEditingName,
  isSaving,
  isSaved,
  onSave,
  selectedRotation,
  selectedDate,
  isStorageAvailable,
  isOpen,
  onClose
}: SettingsBottomSheetProps) {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <>
      {/* Backdrop when expanded */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Settings Bottom Sheet (outer wrapper pointer-events guarded for Chrome) */}
      <div className={`
        fixed bottom-0 left-0 right-0 z-50 pointer-events-none
        bg-white/95 backdrop-blur-xl border-t border-gray-200/50 
        transform transition-all duration-300 ease-out
        ${isOpen ? 'translate-y-0 pointer-events-auto' : 'translate-y-full pointer-events-none'}
      `}>
        <div className="px-6 py-4" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Schedule Settings
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ChevronUp className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          
          <p className="text-sm text-gray-600 mb-6">
            Manage your schedule preferences and details.
          </p>
          
          {/* Schedule Name Section */}
          <div className="space-y-3 mb-6">
            <label className="flex items-start justify-between p-3 rounded-xl bg-gray-50 border-2 border-transparent hover:border-gray-200 transition-all">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-gray-800">Schedule Name</div>
                  {isSaved && (
                    <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                      SAVED
                    </div>
                  )}
                </div>
                
                {/* Schedule Name Input/Display */}
                <div className="bg-white/80 rounded-lg px-3 py-2 mt-2">
                  {isEditingName ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={scheduleName}
                        onChange={(e) => setScheduleName(e.target.value)}
                        className="flex-1 bg-transparent border-none focus:outline-none text-gray-800 text-base"
                        placeholder="Enter schedule name"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') setIsEditingName(false);
                          if (e.key === 'Escape') setIsEditingName(false);
                        }}
                      />
                      <button
                        onClick={() => setIsEditingName(false)}
                        className="text-green-600 hover:text-green-700 p-1 transition-colors"
                        aria-label="Save schedule name"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setIsEditingName(true)}
                      className="text-left w-full group"
                      aria-label="Edit schedule name"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-gray-800 text-base">
                          {scheduleName || `${selectedRotation} Rotation`}
                        </span>
                        <Edit3 className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                      </div>
                    </button>
                  )}
                </div>
                
                {/* Schedule details subtitle */}
                <div className="text-sm text-gray-400 mt-2 px-3">
                  {selectedRotation} • Starts {formatDate(selectedDate)}
                </div>
              </div>
            </label>
          </div>
          
          {/* Save Button */}
          {isStorageAvailable && (
            <button
              onClick={onSave}
              disabled={isSaving}
              className="w-full bg-black text-white rounded-xl py-3 font-medium flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors disabled:opacity-50"
            >
              <Save className={`w-5 h-5 ${isSaving ? 'animate-pulse' : ''}`} />
              {isSaving ? 'Saving...' : (isSaved ? 'Update Schedule' : 'Save Schedule')}
            </button>
          )}
          
          {/* Future settings note */}
          <div className="mt-6 pt-6 border-t border-gray-200/50">
            <p className="text-sm text-gray-500 text-center mb-4">
              More settings coming soon...
            </p>
            
            {/* Feedback Section */}
            <div className="p-3 rounded-xl bg-green-50 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4 text-green-600" />
                <h4 className="font-medium text-green-700 text-sm">Have suggestions?</h4>
              </div>
              <p className="text-xs text-green-600 mb-3">
                Your feedback helps us improve Offshore Mate.
              </p>
              <a 
                href="mailto:offshoremate.app@gmail.com?subject=Offshore Mate Feedback&body=Hi! I have some feedback about Offshore Mate:%0D%0A%0D%0A[Please describe your suggestion, bug report, or feature request here]%0D%0A%0D%0AThanks!"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 hover:text-green-800 transition-colors underline underline-offset-2"
                aria-label="Send feedback email to Offshore Mate team"
              >
                <Mail className="w-3 h-3" aria-hidden="true" />
                offshoremate.app@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}