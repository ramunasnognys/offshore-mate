import { MonthData } from '@/types/rotation'
import { formatDate } from './index'

export interface WorkPeriod {
  startDate: Date
  endDate: Date
}

export function extractWorkPeriods(monthData: MonthData): WorkPeriod[] {
  const workPeriods: WorkPeriod[] = []
  let currentPeriodStart: Date | null = null

  monthData.days.forEach((day, index) => {
    const isLastDay = index === monthData.days.length - 1
    // Ensure date is a Date object
    const dayDate = day.date instanceof Date ? day.date : new Date(day.date)

    if (day.isWorkDay && day.isInRotation) {
      if (!currentPeriodStart) {
        currentPeriodStart = dayDate
      }
      
      if (isLastDay) {
        workPeriods.push({
          startDate: currentPeriodStart,
          endDate: dayDate
        })
      }
    } else {
      if (currentPeriodStart) {
        const previousDay = monthData.days[index - 1]
        const prevDate = previousDay.date instanceof Date ? previousDay.date : new Date(previousDay.date)
        workPeriods.push({
          startDate: currentPeriodStart,
          endDate: prevDate
        })
        currentPeriodStart = null
      }
    }
  })

  return workPeriods
}

export function formatWorkPeriod(period: WorkPeriod): string {
  const startFormatted = formatDate(period.startDate, { month: 'short', day: 'numeric' })
  const endFormatted = formatDate(period.endDate, { month: 'short', day: 'numeric' })
  
  const startMonth = period.startDate.getMonth()
  const endMonth = period.endDate.getMonth()
  
  if (startMonth === endMonth) {
    const month = formatDate(period.startDate, { month: 'short' })
    const startDay = period.startDate.getDate()
    const endDay = period.endDate.getDate()
    
    if (startDay === endDay) {
      return startFormatted
    }
    
    return `${month} ${startDay} -> ${endDay}`
  }
  
  return `${startFormatted} -> ${endFormatted}`
}

export function formatWorkPatternDisplay(periods: WorkPeriod[]): string {
  if (periods.length === 0) {
    return '🏖️ Off this month'
  }
  
  const formattedPeriods = periods.map(period => formatWorkPeriod(period))
  
  if (periods.length === 1) {
    return `🛠️ ${formattedPeriods[0]}`
  }
  
  return `🛠️ ${formattedPeriods.join(', ')}`
}