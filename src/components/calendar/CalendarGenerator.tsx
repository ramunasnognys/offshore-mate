'use client'

import React, { useState, useEffect } from 'react'
import { Waves } from 'lucide-react'
import { StartDateCard } from '@/components/calendar/StartDateCard'
import { WorkRotationCard } from '@/components/calendar/WorkRotationCard'
import { SavedSchedulesCard } from '@/components/calendar/SavedSchedulesCard'
import { GenerateButton } from '@/components/ui/generate-button'
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
    <div className={`${isMobileView ? 'space-y-6' : 'space-y-4 md:space-y-6'}`}>
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
      <div className="flex justify-center">
        <GenerateButton
          variant="primary"
          size="lg"
          icon={<Waves className="h-5 w-5" />}
          onClick={handleGenerateCalendar}
          ariaDescribedBy="generate-button-description"
          className={isMobileView ? "w-full" : "w-2/3"}
        >
          Generate Schedule
        </GenerateButton>
        {/* Hidden description for accessibility */}
        <div id="generate-button-description" className="sr-only">
          Generate your offshore work schedule based on selected start date and rotation pattern
        </div>
      </div>
    </div>
  )
}