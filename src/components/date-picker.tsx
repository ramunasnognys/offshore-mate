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
        <button
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
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white/95 backdrop-blur-xl border border-white/30">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium text-gray-800">Choose start date</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            initialFocus
            weekStartsOn={1}

            className="mx-auto rounded-lg border-white/30 bg-white/50"
          />
{/* 
<Calendar
  mode="single"
  selected={selected}
  onSelect={onSelect}
  weekStartsOn={0}
  className="w-full"
/> */}
        </div>
      </DialogContent>
    </Dialog>
  )
}