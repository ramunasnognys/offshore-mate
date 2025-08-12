'use client'

import React from 'react'
import { ArrowRight } from 'lucide-react'
import { StartDateCard } from '@/components/calendar/StartDateCard'
import { WorkRotationCard } from '@/components/calendar/WorkRotationCard'
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

    const customRotation = selectedRotation === 'Custom' 
      ? {
          workDays: parseInt(customWorkDays),
          offDays: parseInt(customOffDays)
        }
      : undefined

    generateCalendar(selectedDate, selectedRotation as RotationPattern, customRotation)
  }

  return (
    <div className={`${isMobileView ? 'space-y-3' : 'space-y-4 md:space-y-6'}`}>
      <StartDateCard
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
      />

      <WorkRotationCard
        selectedRotation={selectedRotation}
        onRotationChange={handleRotationSelect}
        customRotation={{
          work: customWorkDays,
          rest: customOffDays
        }}
        onCustomRotationChange={(rotation) => {
          setCustomWorkDays(rotation.work)
          setCustomOffDays(rotation.rest)
        }}
        options={rotationOptions}
      />

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