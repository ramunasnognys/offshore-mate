'use client'

import React from 'react'
import { ArrowRight } from 'lucide-react'
import { DatePicker } from '@/components/date-picker'
import { RotationButton } from '@/components/rotation-button'
import { useCalendar } from '@/contexts/CalendarContext'
import { useUI } from '@/contexts/UIContext'
import { useMobileDetection } from '@/hooks/useMobileDetection'
import { RotationPattern } from '@/types/rotation'

interface CalendarGeneratorProps {
  onShowSavedSchedules: () => void
  hasStorageSupport: boolean
}

export function CalendarGenerator({ 
  onShowSavedSchedules, 
  hasStorageSupport 
}: CalendarGeneratorProps) {
  const {
    selectedDate,
    selectedRotation,
    showCustomInput,
    customWorkDays,
    customOffDays,
    handleDateSelect,
    handleRotationSelect,
    setCustomWorkDays,
    setCustomOffDays,
    validateForm,
    rotationOptions,
    generateCalendar
  } = useCalendar()
  
  const { setErrorMessage } = useUI()
  const isMobileView = useMobileDetection()

  const handleGenerateCalendar = () => {
    const validation = validateForm()
    if (!validation.isValid) {
      setErrorMessage(validation.error || 'Please check your inputs')
      return
    }

    const customRotation = selectedRotation === 'Other' 
      ? {
          workDays: parseInt(customWorkDays),
          offDays: parseInt(customOffDays)
        }
      : undefined

    generateCalendar(selectedDate, selectedRotation as RotationPattern, customRotation)
  }

  return (
    <div className={`${isMobileView ? 'space-y-3' : 'space-y-4 md:space-y-6'}`}>
      {/* Date Picker Button */}
      <div className="backdrop-blur-xl bg-white/30 rounded-2xl md:rounded-3xl shadow-card border border-white/30 transition-all duration-300 hover:shadow-card-hover hover:bg-white/40">
        <div className="px-4 md:px-6 py-3 md:py-4">
          <span className="text-gray-500 text-xs md:text-sm font-medium mb-0.5 md:mb-1 block">
            Start Date
          </span>
          <DatePicker 
            date={selectedDate ? new Date(selectedDate) : undefined}
            onSelect={handleDateSelect}
          />
        </div>
      </div>

      {/* Work Rotation */}
      <div className="backdrop-blur-xl bg-white/30 rounded-2xl md:rounded-3xl shadow-card border border-white/30 p-4 md:p-6">
        <span className="text-gray-600 text-sm md:text-base font-medium mb-3 block">
          Work Rotation
        </span>
        <div className="grid grid-cols-3 gap-2 md:gap-3">
          {rotationOptions.map((option) => (
            <RotationButton
              key={option.value}
              label={option.label}
              isSelected={selectedRotation === option.value}
              onClick={() => handleRotationSelect(option.value as RotationPattern)}
              className="text-sm md:text-base"
            />
          ))}
        </div>
        
        {/* Custom rotation input */}
        {showCustomInput && (
          <div className="mt-3 backdrop-blur-xl bg-white/30 border border-white/30 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Work days</label>
                <input
                  type="number"
                  value={customWorkDays}
                  onChange={(e) => setCustomWorkDays(e.target.value)}
                  className="w-full px-3 py-2 bg-white/50 backdrop-blur-sm border-white/30 rounded-md border text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800"
                  placeholder="e.g. 14"
                  min="1"
                  max="365"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Off days</label>
                <input
                  type="number"
                  value={customOffDays}
                  onChange={(e) => setCustomOffDays(e.target.value)}
                  className="w-full px-3 py-2 bg-white/50 backdrop-blur-sm border-white/30 rounded-md border text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800"
                  placeholder="e.g. 14"
                  min="1"
                  max="365"
                />
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* My Rotations - Next Hitch (placeholder for now) */}
      {selectedDate && selectedRotation && (
        <div className="backdrop-blur-xl bg-white/30 rounded-2xl md:rounded-3xl shadow-card border border-white/30 p-4 md:p-6">
          <span className="text-gray-600 text-sm md:text-base font-medium mb-2 block">
            My Rotations
          </span>
          <div className="text-gray-800 text-lg md:text-xl font-semibold">
            Next hitch: Calculating...
          </div>
        </div>
      )}

      {/* Saved Schedules Button */}
      {hasStorageSupport && (
        <div className="backdrop-blur-xl bg-white/30 rounded-2xl md:rounded-3xl shadow-card border border-white/30 transition-all duration-300 hover:shadow-card-hover hover:bg-white/40">
          <button
            onClick={onShowSavedSchedules}
            className="w-full px-4 md:px-6 py-3 md:py-4 flex items-center justify-between hover:bg-white/10 transition-all duration-200 group rounded-2xl md:rounded-3xl"
          >
            <div className="flex-grow text-left">
              <span className="text-gray-500 text-xs md:text-sm font-medium mb-0.5 md:mb-1 block">
                Saved Schedules
              </span>
              <span className="text-gray-800 text-base md:text-lg font-medium group-hover:text-orange-500 transition-colors">
                View your saved schedules
              </span>
            </div>
            <div className="flex items-center justify-center ml-3 md:ml-4">
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-orange-500 transition-transform duration-200 group-hover:translate-x-1" />
            </div>
          </button>
        </div>
      )}
      
      {/* Generate Button */}
      <button
        onClick={handleGenerateCalendar}
        className="w-full text-white rounded-full px-6 py-4 font-semibold text-lg 
          transition-all duration-300 relative bg-black hover:bg-gray-900 active:scale-[0.98]"
      >
        Generate
      </button>
    </div>
  )
}