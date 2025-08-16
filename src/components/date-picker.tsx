"use client"

import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { EnhancedDatePickerDialog } from "@/components/calendar/EnhancedDatePickerDialog"

interface DatePickerProps {
  date?: Date
  onSelect: (date: Date | undefined) => void
}

export function DatePicker({ date, onSelect }: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [currentMonth, setCurrentMonth] = React.useState(date || new Date())

  const formatDisplayDate = (date: Date | undefined) => {
    if (!date) return 'Pick your start date'
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
        <div className="flex-grow text-left">
          <span className="text-gray-800 text-base md:text-lg font-medium group-hover:text-orange-500 transition-colors">
            {formatDisplayDate(date)}
          </span>
        </div>
        <div className="flex items-center justify-center ml-3 md:ml-4">
          <CalendarIcon className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
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