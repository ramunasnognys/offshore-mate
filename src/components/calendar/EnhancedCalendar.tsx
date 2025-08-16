'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EnhancedCalendarProps {
  currentMonth: Date
  selectedDate?: Date
  onDateSelect: (date: Date) => void
  onMonthChange: (date: Date) => void
}

export function EnhancedCalendar({
  currentMonth,
  selectedDate,
  onDateSelect,
  onMonthChange
}: EnhancedCalendarProps) {
  const today = new Date()
  
  // Get first day of month and create calendar grid
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
  const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
  const firstDayOfWeek = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()
  
  // Adjust first day to start from Monday (0 = Sunday, we want Monday = 0)
  const adjustedFirstDay = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1
  
  // Create array of dates for the calendar grid
  const calendarDays = []
  
  // Add empty cells for days before the first day of month
  for (let i = 0; i < adjustedFirstDay; i++) {
    calendarDays.push(null)
  }
  
  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))
  }
  
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  
  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    })
  }
  
  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear()
  }
  
  const isToday = (date: Date) => isSameDay(date, today)
  const isSelected = (date: Date) => selectedDate ? isSameDay(date, selectedDate) : false
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth)
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1)
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1)
    }
    onMonthChange(newMonth)
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Header with navigation */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-3 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 text-white shadow-lg hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-300"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold font-serif bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            {formatMonthYear(currentMonth).split(' ')[0]}
          </h2>
          <p className="text-lg font-medium text-slate-500">
            {formatMonthYear(currentMonth).split(' ')[1]}
          </p>
        </div>
        
        <button
          onClick={() => navigateMonth('next')}
          className="p-3 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 text-white shadow-lg hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-300"
          aria-label="Next month"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Week day headers */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {weekDays.map((day) => (
          <div
            key={day}
            className="h-8 flex items-center justify-center text-sm font-bold tracking-wide text-slate-600"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2 mb-8">
        {calendarDays.map((date, index) => (
          <div key={index} className="aspect-square">
            {date ? (
              <button
                onClick={() => onDateSelect(date)}
                className={cn(
                  "w-full h-full rounded-lg text-sm sm:text-base font-semibold transition-all duration-300 border focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2",
                  // Base styling
                  "bg-white/60 backdrop-blur-sm border-white/40 text-slate-700 shadow-sm",
                  // Hover states
                  "hover:bg-white/80 hover:shadow-lg hover:scale-105 hover:-translate-y-0.5",
                  // Active state
                  "active:scale-95",
                  // Selected state
                  isSelected(date) && "bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 text-white shadow-lg ring-2 ring-purple-400/50 shadow-purple-500/25 hover:shadow-purple-500/40",
                  // Today state (only if not selected)
                  !isSelected(date) && isToday(date) && "bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-700 border-2 border-blue-200 hover:from-blue-100 hover:to-indigo-100"
                )}
                aria-label={`${date.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}${isToday(date) ? ', today' : ''}${isSelected(date) ? ', selected' : ''}`}
                aria-current={isToday(date) ? 'date' : undefined}
                aria-pressed={isSelected(date)}
              >
                {date.getDate()}
              </button>
            ) : (
              <div className="w-full h-full" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}