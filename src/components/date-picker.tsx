"use client"

import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogBottomContent,
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
    if (!date) return 'Pick your start date'
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
      <DialogBottomContent className="bg-white/95 backdrop-blur-xl border-white/40 shadow-2xl">        
        <div className="px-4 sm:px-6 pt-2 pb-4">
          <DialogHeader>
            <DialogTitle className="text-center">
              <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide">Today</p>
              <p className="text-xl sm:text-2xl font-semibold text-gray-800 leading-tight">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long',
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </p>
            </DialogTitle>
          </DialogHeader>
          
          <div className="w-full py-3 sm:py-4 flex items-center justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleSelect}
              initialFocus
              weekStartsOn={1}
              className="rounded-2xl border border-white/30 bg-white/30 backdrop-blur-sm w-full p-3 sm:p-4 [&_.rdp-caption]:text-lg sm:[&_.rdp-caption]:text-xl [&_.rdp-caption]:font-semibold [&_.rdp-caption]:text-gray-800 [&_.rdp-caption]:mb-3 sm:[&_.rdp-caption]:mb-4 [&_.rdp-months]:w-full [&_.rdp-month]:w-full [&_.rdp-head_th]:text-orange-500 [&_.rdp-head_th]:font-medium [&_.rdp-head_th]:h-6 sm:[&_.rdp-head_th]:h-8 [&_.rdp-head_th]:text-xs sm:[&_.rdp-head_th]:text-sm [&_.rdp-tbody]:w-full [&_.rdp-cell]:flex [&_.rdp-cell]:justify-center [&_.rdp-button]:h-8 sm:[&_.rdp-button]:h-10 [&_.rdp-button]:w-8 sm:[&_.rdp-button]:w-10 [&_.rdp-button]:text-xs sm:[&_.rdp-button]:text-sm [&_.rdp-button]:min-h-[36px] sm:[&_.rdp-button]:min-h-[44px] [&_.rdp-button]:min-w-[36px] sm:[&_.rdp-button]:min-w-[44px] [&_.rdp-button]:rounded-lg sm:[&_.rdp-button]:rounded-xl [&_.rdp-button]:transition-all [&_.rdp-button]:duration-200 [&_.rdp-button]:text-gray-700 [&_.rdp-button]:bg-white/40 [&_.rdp-button]:backdrop-blur-sm [&_.rdp-button]:border [&_.rdp-button]:border-white/50 [&_.rdp-button]:shadow-sm [&_.rdp-button:hover]:bg-white/70 [&_.rdp-button:hover]:shadow-lg [&_.rdp-button:hover]:-translate-y-0.5 [&_.rdp-button:hover]:border-orange-300/50 [&_.rdp-button:active]:scale-95 [&_.rdp-nav_button]:text-gray-600 [&_.rdp-nav_button:hover]:text-gray-800 [&_.rdp-nav_button]:transition-all [&_.rdp-nav_button]:w-7 sm:[&_.rdp-nav_button]:w-8 [&_.rdp-nav_button]:h-7 sm:[&_.rdp-nav_button]:h-8 [&_.rdp-nav_button]:min-h-[32px] sm:[&_.rdp-nav_button]:min-h-[36px] [&_.rdp-nav_button]:min-w-[32px] sm:[&_.rdp-nav_button]:min-w-[36px] [&_.rdp-nav_button]:rounded-full [&_.rdp-nav_button]:bg-white/50 [&_.rdp-nav_button]:backdrop-blur-sm [&_.rdp-nav_button]:border [&_.rdp-nav_button]:border-white/50 [&_.rdp-nav_button:hover]:bg-white/70 [&_.rdp-nav_button:hover]:shadow-md"
            />
          </div>
          
          {date && (
            <div className="text-center pb-3 sm:pb-4">
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-2 sm:p-3 border border-white/30">
                <p className="text-xs sm:text-sm text-gray-500 font-medium">Selected Date</p>
                <p className="text-sm sm:text-lg font-semibold text-gray-800">
                  {date.toLocaleDateString('en-US', { 
                    weekday: 'long',
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          )}
          
          {/* Quick action buttons */}
          <div className="flex gap-2 pt-2">
            <button 
              onClick={() => handleSelect(new Date())}
              className="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-medium rounded-lg sm:rounded-xl transition-all duration-200 touch-manipulation active:scale-95"
            >
              Today
            </button>
            <button 
              onClick={() => setOpen(false)}
              className="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 bg-gray-200 hover:bg-gray-300 active:bg-gray-400 text-gray-700 font-medium rounded-lg sm:rounded-xl transition-all duration-200 touch-manipulation active:scale-95"
            >
              Cancel
            </button>
          </div>
        </div>
      </DialogBottomContent>
    </Dialog>
  )
}