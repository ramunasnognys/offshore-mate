'use client'

import React, { useState, useEffect } from 'react'
import { Save } from 'lucide-react'
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
  const [dismissed, setDismissed] = useState(false)

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
    const hasCalendar = yearCalendar && yearCalendar.length > 0
    const shouldShow = hasCalendar && !currentScheduleId && !dismissed
    setIsVisible(shouldShow)
  }, [yearCalendar, currentScheduleId, dismissed])

  // Handle saved state display
  useEffect(() => {
    if (isSaved) {
      setIsVisible(false)
    }
  }, [isSaved])

  // no-op change tracking (immediate dismiss UX)

  // no delayed auto-hide (immediate dismiss UX)

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    setLocalName(newName)
    onNameChange(newName)
  }

  const handleSave = () => {
    if (localName.trim()) {
      onSave()
      setIsVisible(false)
      setDismissed(true)
    }
  }

  const handleCancel = () => {
    setDismissed(true)
    setIsVisible(false)
  }

  if (!isVisible) {
    return null
  }

  const isNameValid = localName.trim().length > 0

  return (
    <div className="animate-in slide-in-from-top duration-300 ease-out">
      <div className="backdrop-blur-xl bg-white/40 rounded-lg shadow border border-white/30 px-3 py-2.5 mb-4">
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 select-none">Name this schedule</div>
            <input
              id="schedule-name"
              type="text"
              value={localName}
              onChange={handleNameChange}
              placeholder={defaultName}
              className={`w-full h-9 px-3 rounded-md border bg-white/60 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-colors ${
                !isNameValid ? 'border-destructive' : 'border-gray-300'
              }`}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={handleCancel} className="text-sm">
              Cancel
            </Button>
            <Button
              size="sm"
              variant="default"
              onClick={handleSave}
              disabled={!isNameValid}
              className="bg-gray-700 hover:bg-gray-800 text-white text-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span className="sr-only sm:not-sr-only sm:ml-1.5">Save</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}