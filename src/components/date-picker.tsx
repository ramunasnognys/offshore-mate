"use client"

import * as React from "react"
import { EnhancedDatePickerDialog } from "@/components/calendar/EnhancedDatePickerDialog"

interface DatePickerProps {
  date?: Date
  onSelect: (date: Date | undefined) => void
}

export function DatePicker({ date, onSelect }: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [currentMonth, setCurrentMonth] = React.useState(date || new Date())

  const formatDisplayDate = (date: Date | undefined) => {
    if (!date) return 'Pick a start date'
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Update current month when date changes
  React.useEffect(() => {
    if (date) {
      setCurrentMonth(date)
    }
  }, [date])

  return (
    <>
      <button 
        onClick={() => setOpen(true)}
        className="flex items-center w-full hover:bg-white/10 transition-all duration-200 group rounded-2xl md:rounded-3xl"
      >
        <div className="flex-grow text-left ml-8">
          <span className={`font-medium transition-colors ${
            date 
              ? 'text-gray-800 text-sm group-hover:text-orange-500' 
              : 'text-gray-500 text-sm'
          }`}>
            {formatDisplayDate(date)}
          </span>
        </div>
      </button>

      <EnhancedDatePickerDialog
        isOpen={open}
        onClose={() => setOpen(false)}
        selectedDate={date}
        onDateSelect={onSelect}
        currentMonth={currentMonth}
        onMonthChange={setCurrentMonth}
      />
    </>
  )
}