'use client'

import React, { useState, useEffect } from 'react'
import { Check, Save } from 'lucide-react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { MonthData } from '@/types/rotation'

interface ContextualSaveBarProps {
  yearCalendar: MonthData[]
  scheduleName: string
  selectedRotation: string
  selectedDate: string
  currentScheduleId: string | null
  isSaved: boolean
  onNameChange: (name: string) => void
  onSave: () => void
  onUpdate: () => void
}

export function ContextualSaveBar({
  yearCalendar,
  scheduleName,
  selectedRotation,
  selectedDate,
  currentScheduleId,
  isSaved,
  onNameChange,
  onSave,
  onUpdate
}: ContextualSaveBarProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [localName, setLocalName] = useState('')
  const [showSavedState, setShowSavedState] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Generate default name based on rotation and date
  const defaultName = React.useMemo(() => {
    try {
      const date = new Date(selectedDate)
      return `${selectedRotation} Rotation (${format(date, "MMM d, yyyy")})`
    } catch {
      return `${selectedRotation} Rotation`
    }
  }, [selectedRotation, selectedDate])

  // Initialize local name when component mounts or props change
  useEffect(() => {
    if (!scheduleName) {
      setLocalName(defaultName)
    } else {
      setLocalName(scheduleName)
    }
  }, [scheduleName, defaultName])

  // Show/hide the bar based on conditions
  useEffect(() => {
    const shouldShow = yearCalendar && yearCalendar.length > 0 && !currentScheduleId
    setIsVisible(shouldShow)
  }, [yearCalendar, currentScheduleId])

  // Handle saved state display
  useEffect(() => {
    if (isSaved && !showSavedState) {
      setShowSavedState(true)
      const timer = setTimeout(() => {
        setShowSavedState(false)
        setHasChanges(false)
      }, 2500)
      return () => clearTimeout(timer)
    }
  }, [isSaved, showSavedState])

  // Track changes after saving
  useEffect(() => {
    if (showSavedState && localName !== scheduleName) {
      setHasChanges(true)
      setShowSavedState(false)
    }
  }, [localName, scheduleName, showSavedState])

  // Auto-hide bar after successful save
  useEffect(() => {
    if (isSaved && !hasChanges) {
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isSaved, hasChanges])

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    setLocalName(newName)
    onNameChange(newName)
    
    // If we were showing saved state and name changes, show update button
    if (showSavedState) {
      setHasChanges(true)
      setShowSavedState(false)
    }
  }

  const handleSave = () => {
    if (localName.trim()) {
      onSave()
    }
  }

  const handleUpdate = () => {
    if (localName.trim()) {
      onUpdate()
      setHasChanges(false)
    }
  }

  if (!isVisible) {
    return null
  }

  const isNameValid = localName.trim().length > 0
  const buttonAction = showSavedState ? 'saved' : hasChanges ? 'update' : 'save'

  return (
    <div className="animate-in slide-in-from-top duration-300 ease-out">
      <div className="backdrop-blur-xl bg-white/40 rounded-xl shadow-lg border border-white/30 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex-1">
            <label htmlFor="schedule-name" className="block text-sm font-medium text-gray-700 mb-2">
              Schedule Name
            </label>
            <input
              id="schedule-name"
              type="text"
              value={localName}
              onChange={handleNameChange}
              placeholder="Enter schedule name..."
              className={`w-full px-3 py-2 rounded-md border bg-white/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                !isNameValid ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>

          <div className="flex gap-2">
            {buttonAction === 'saved' && (
              <Button
                variant="default"
                disabled
                className="bg-green-600 hover:bg-green-600 text-white"
              >
                <Check className="w-4 h-4 mr-2" />
                Saved ✔
              </Button>
            )}

            {buttonAction === 'save' && (
              <Button
                variant="default"
                onClick={handleSave}
                disabled={!isNameValid}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            )}

            {buttonAction === 'update' && (
              <Button
                variant="default"
                onClick={handleUpdate}
                disabled={!isNameValid}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Update
              </Button>
            )}
          </div>
        </div>

        {!isNameValid && (
          <p className="text-xs text-red-600 mt-1 animate-in fade-in duration-200">
            Please enter a schedule name
          </p>
        )}
      </div>
    </div>
  )
}