"use client"

import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface DatePickerProps {
  date?: Date
  onSelect: (date: Date | undefined) => void
}

export function DatePicker({ date, onSelect }: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  const handleSelect = (date: Date | undefined) => {
    onSelect(date)
    setOpen(false)
  }

  const formatDisplayDate = (date: Date | undefined) => {
    if (!date) return 'Select start date'
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center w-full hover:bg-white/10 transition-all duration-200 group rounded-2xl md:rounded-3xl">
          <div className="flex-grow text-left">
            <span className="text-gray-800 text-base md:text-lg font-medium group-hover:text-orange-500 transition-colors">
              {formatDisplayDate(date)}
            </span>
          </div>
          <div className="flex items-center justify-center ml-3 md:ml-4">
            <CalendarIcon className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
          </div>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white/95 backdrop-blur-md border-0 shadow-lg rounded-3xl
        max-h-screen h-screen sm:h-auto w-screen sm:w-auto m-0 sm:m-4">
        <DialogHeader>
          <DialogTitle className="text-center">
            <p className="text-lg font-medium text-gray-600">Today</p>
            <p className="text-3xl font-semibold text-gray-800">
              {new Date().toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </p>
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 w-full flex items-center justify-center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            initialFocus
            weekStartsOn={1}
            className="rounded-lg border-0 bg-transparent w-full px-4
              [&_.rdp-caption]:text-xl [&_.rdp-caption]:font-semibold [&_.rdp-caption]:text-gray-800 
              [&_.rdp-months]:w-full
              [&_.rdp-month]:w-full
              [&_tr]:grid [&_tr]:grid-cols-7 [&_tr]:gap-1
              [&_.rdp-head_cell]:flex [&_.rdp-head_cell]:justify-center
              [&_.rdp-head_th]:text-orange-500 [&_.rdp-head_th]:font-medium [&_.rdp-head_th]:h-8 [&_.rdp-head_th]:w-12 [&_.rdp-head_th]:text-base
              [&_.rdp-tbody]:w-full
              [&_.rdp-cell]:flex [&_.rdp-cell]:justify-center
              [&_.rdp-button]:h-12 [&_.rdp-button]:w-12 [&_.rdp-button]:rounded-full 
              [&_.rdp-button]:text-base [&_.rdp-button]:transition-colors [&_.rdp-button]:text-gray-700
              [&_.rdp-button:hover]:bg-white [&_.rdp-button:hover]:shadow-md
              [&_.rdp-day_selected]:bg-blue-500 [&_.rdp-day_selected]:text-white
              [&_.rdp-day_today]:bg-orange-500 [&_.rdp-day_today]:text-white [&_.rdp-day_today]:font-semibold [&_.rdp-day_today]:border [&_.rdp-day_today]:border-orange-500
              [&_.rdp-nav_button]:text-gray-600 [&_.rdp-nav_button:hover]:text-gray-800 [&_.rdp-nav_button]:transition-colors
              [&_.rdp-nav_button]:w-6 [&_.rdp-nav_button]:h-6"
          />
        </div>
        {date && (
          <div className="text-center text-gray-600 pb-2">
            Selected: {date.toLocaleDateString()}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}