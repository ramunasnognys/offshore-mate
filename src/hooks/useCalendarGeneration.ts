import { useState, useCallback, useMemo } from 'react'
import { MonthData, RotationPattern } from '@/types/rotation'
import { generateRotationCalendar } from '@/lib/utils/rotation'

interface UseCalendarGenerationReturn {
  // State
  isCalendarGenerated: boolean
  yearCalendar: MonthData[]
  currentScheduleId: string | null
  scheduleName: string
  isSaved: boolean
  
  // Actions
  generateCalendar: (
    startDate: string,
    rotationPattern: RotationPattern,
    customRotation?: { workDays: number; offDays: number }
  ) => void
  resetCalendar: () => void
  setScheduleName: (name: string) => void
  setCurrentScheduleId: (id: string | null) => void
  setIsSaved: (saved: boolean) => void
  setYearCalendar: (calendar: MonthData[]) => void
  setIsCalendarGenerated: (generated: boolean) => void
  
  // Computed values
  currentPeriodStatus: {
    isWork: boolean
    isOff: boolean
    isTransition: boolean
    month: string
    year: number
  } | null
}

/**
 * Custom hook for managing calendar generation state and logic
 */
export function useCalendarGeneration(): UseCalendarGenerationReturn {
  const [isCalendarGenerated, setIsCalendarGenerated] = useState(false)
  const [yearCalendar, setYearCalendar] = useState<MonthData[]>([])
  const [currentScheduleId, setCurrentScheduleId] = useState<string | null>(null)
  const [scheduleName, setScheduleName] = useState('')
  const [isSaved, setIsSaved] = useState(false)

  const generateCalendar = useCallback((
    startDate: string,
    rotationPattern: RotationPattern,
    customRotation?: { workDays: number; offDays: number }
  ) => {
    const calendar = generateRotationCalendar(
      new Date(startDate),
      rotationPattern,
      12,
      customRotation
    )
    
    setYearCalendar(calendar)
    setIsCalendarGenerated(true)
    setIsSaved(false)
    setCurrentScheduleId(null)
    
    // Generate a default schedule name
    const rotationLabel = rotationPattern === 'Custom' && customRotation
      ? `${customRotation.workDays}/${customRotation.offDays} Rotation` 
      : `${rotationPattern} Rotation`
    const defaultName = `${rotationLabel} (${new Date(startDate).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })})`
    setScheduleName(defaultName)
  }, [])

  const resetCalendar = useCallback(() => {
    setIsCalendarGenerated(false)
    setYearCalendar([])
    setCurrentScheduleId(null)
    setScheduleName('')
    setIsSaved(false)
  }, [])

  // Get current period status for smart header
  const currentPeriodStatus = useMemo(() => {
    if (!yearCalendar.length) return null
    
    const today = new Date()
    const currentMonth = yearCalendar.find(month => {
      return month.days.some(day => {
        const dayDate = new Date(day.date)
        return dayDate.toDateString() === today.toDateString()
      })
    })

    if (!currentMonth) return null

    const todayData = currentMonth.days.find(day => {
      const dayDate = new Date(day.date)
      return dayDate.toDateString() === today.toDateString()
    })

    if (!todayData) return null

    return {
      isWork: todayData.isWorkDay,
      isOff: !todayData.isWorkDay && !todayData.isTransitionDay,
      isTransition: todayData.isTransitionDay,
      month: currentMonth.month,
      year: currentMonth.year
    }
  }, [yearCalendar])

  return {
    isCalendarGenerated,
    yearCalendar,
    currentScheduleId,
    scheduleName,
    isSaved,
    generateCalendar,
    resetCalendar,
    setScheduleName,
    setCurrentScheduleId,
    setIsSaved,
    setYearCalendar,
    setIsCalendarGenerated,
    currentPeriodStatus
  }
}