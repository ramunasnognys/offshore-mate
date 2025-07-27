'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { MonthData } from '@/types/rotation'
import { useCalendarGeneration } from '@/hooks/useCalendarGeneration'
import { useRotationForm } from '@/hooks/useRotationForm'

interface CalendarContextType {
  // From useCalendarGeneration
  isCalendarGenerated: boolean
  yearCalendar: MonthData[]
  currentScheduleId: string | null
  scheduleName: string
  isSaved: boolean
  generateCalendar: ReturnType<typeof useCalendarGeneration>['generateCalendar']
  resetCalendar: () => void
  setScheduleName: (name: string) => void
  setCurrentScheduleId: (id: string | null) => void
  setIsSaved: (saved: boolean) => void
  setYearCalendar: (calendar: MonthData[]) => void
  currentPeriodStatus: ReturnType<typeof useCalendarGeneration>['currentPeriodStatus']
  
  // From useRotationForm
  selectedDate: string
  selectedRotation: ReturnType<typeof useRotationForm>['selectedRotation']
  showCustomInput: boolean
  customWorkDays: string
  customOffDays: string
  setSelectedDate: (date: string) => void
  handleDateSelect: (date: Date | undefined) => void
  handleRotationSelect: (rotation: ReturnType<typeof useRotationForm>['selectedRotation']) => void
  setCustomWorkDays: (days: string) => void
  setCustomOffDays: (days: string) => void
  validateForm: () => { isValid: boolean; error?: string }
  rotationOptions: ReturnType<typeof useRotationForm>['rotationOptions']
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined)

export function CalendarProvider({ children }: { children: ReactNode }) {
  const calendarGeneration = useCalendarGeneration()
  const rotationForm = useRotationForm()

  const value: CalendarContextType = {
    ...calendarGeneration,
    ...rotationForm
  }

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  )
}

export function useCalendar() {
  const context = useContext(CalendarContext)
  if (context === undefined) {
    throw new Error('useCalendar must be used within a CalendarProvider')
  }
  return context
}