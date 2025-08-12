'use client'

import React, { useState, useEffect } from 'react'
import { StartDateCard } from '@/components/calendar/StartDateCard'
import { WorkRotationCard } from '@/components/calendar/WorkRotationCard'
import { SavedSchedulesCard } from '@/components/calendar/SavedSchedulesCard'
import { useCalendar } from '@/contexts/CalendarContext'
import { useUI } from '@/contexts/UIContext'
import { useMobileDetection } from '@/hooks/useMobileDetection'
import { RotationPattern } from '@/types/rotation'
import { getAllScheduleMetadata } from '@/lib/utils/storage'

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
  const [savedSchedulesCount, setSavedSchedulesCount] = useState(0)

  // Update saved schedules count when component mounts or schedules change
  useEffect(() => {
    if (hasStorageSupport) {
      const updateCount = () => {
        const schedules = getAllScheduleMetadata()
        setSavedSchedulesCount(schedules.length)
      }
      updateCount()
      
      // Listen for storage changes to update count
      const handleStorageChange = () => updateCount()
      window.addEventListener('storage', handleStorageChange)
      
      return () => window.removeEventListener('storage', handleStorageChange)
    }
  }, [hasStorageSupport])

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

      {hasStorageSupport && (
        <SavedSchedulesCard
          onShowSavedSchedules={onShowSavedSchedules}
          savedSchedulesCount={savedSchedulesCount}
        />
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