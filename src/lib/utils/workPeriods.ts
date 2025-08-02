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

    if (day.isWorkDay && day.isInRotation) {
      if (!currentPeriodStart) {
        currentPeriodStart = day.date
      }
      
      if (isLastDay) {
        workPeriods.push({
          startDate: currentPeriodStart,
          endDate: day.date
        })
      }
    } else {
      if (currentPeriodStart) {
        const previousDay = monthData.days[index - 1]
        workPeriods.push({
          startDate: currentPeriodStart,
          endDate: previousDay.date
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