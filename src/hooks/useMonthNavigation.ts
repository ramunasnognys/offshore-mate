import { useState, useCallback } from 'react'
import { MonthData } from '@/types/rotation'

interface UseMonthNavigationProps {
  yearCalendar: MonthData[]
  initialMonthIndex?: number
}

interface UseMonthNavigationReturn {
  currentMonthIndex: number
  setCurrentMonthIndex: (index: number) => void
  goToPreviousMonth: () => void
  goToNextMonth: () => void
  goToToday: () => void
  isFirstMonth: boolean
  isLastMonth: boolean
}

/**
 * Custom hook for managing month navigation in the calendar
 */
export function useMonthNavigation({
  yearCalendar,
  initialMonthIndex = 0
}: UseMonthNavigationProps): UseMonthNavigationReturn {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(initialMonthIndex)

  const goToPreviousMonth = useCallback(() => {
    setCurrentMonthIndex(prev => Math.max(0, prev - 1))
  }, [])

  const goToNextMonth = useCallback(() => {
    setCurrentMonthIndex(prev => Math.min(yearCalendar.length - 1, prev + 1))
  }, [yearCalendar.length])

  const goToToday = useCallback(() => {
    const today = new Date()
    const currentMonth = today.getMonth() // 0-based
    const currentYear = today.getFullYear()
    
    const index = yearCalendar.findIndex(month => {
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                         'July', 'August', 'September', 'October', 'November', 'December']
      const monthIndex = monthNames.indexOf(month.month)
      return monthIndex === currentMonth && month.year === currentYear
    })
    
    // If current month not found, return 0 (first month)
    setCurrentMonthIndex(index >= 0 ? index : 0)
  }, [yearCalendar])

  return {
    currentMonthIndex,
    setCurrentMonthIndex,
    goToPreviousMonth,
    goToNextMonth,
    goToToday,
    isFirstMonth: currentMonthIndex === 0,
    isLastMonth: currentMonthIndex === yearCalendar.length - 1
  }
}