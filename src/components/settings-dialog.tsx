'use client';

import React from 'react';
import { Save, Edit3, Check, Settings } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SettingsDialogProps {
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
  
  // Dialog control
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function SettingsDialog({
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
  open,
  onOpenChange
}: SettingsDialogProps) {
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      
      <DialogContent className="sm:max-w-[450px] backdrop-blur-xl bg-white/95 border border-white/30">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gray-800">
            <Settings className="h-5 w-5" />
            Schedule Settings
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Manage your schedule preferences and details.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Schedule Name Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700">Schedule Name</h3>
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
            <div className="backdrop-blur-xl bg-white/30 rounded-xl border border-white/30 p-4">
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={scheduleName}
                    onChange={(e) => setScheduleName(e.target.value)}
                    className="flex-1 bg-transparent border-none focus:outline-none text-gray-800 text-base font-medium"
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
                  className="cursor-pointer group text-left w-full"
                  aria-label="Edit schedule name"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-gray-800 text-base font-medium">
                      {scheduleName || `${selectedRotation} Rotation`}
                    </span>
                    <Edit3 className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                  </div>
                </button>
              )}
              
              {/* Schedule details subtitle */}
              <div className="text-sm text-gray-500 mt-2">
                {selectedRotation} • Starts {formatDate(selectedDate)}
              </div>
            </div>
            
            {/* Save Button */}
            {isStorageAvailable && (
              <div className="flex justify-end">
                <button
                  onClick={onSave}
                  disabled={isSaving}
                  className={`bg-green-600 text-white rounded-lg px-4 py-2.5 text-sm font-medium
                    shadow-sm hover:bg-green-700 transition-all duration-200 flex items-center gap-2 group
                    ${isSaving ? 'opacity-75 cursor-wait' : ''}`}
                >
                  <Save className={`w-4 h-4 transition-transform
                    ${isSaving ? 'animate-pulse' : 'group-hover:scale-110'}`} 
                  />
                  {isSaving ? 'Saving...' : (isSaved ? 'Update Schedule' : 'Save Schedule')}
                </button>
              </div>
            )}
          </div>
          
          {/* Future settings sections can be added here */}
          <div className="border-t border-gray-200/50 pt-4">
            <p className="text-sm text-gray-500 text-center">
              More settings coming soon...
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}