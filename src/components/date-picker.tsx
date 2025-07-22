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
  selectedRotation?: string
}

export function DatePicker({ date, onSelect, selectedRotation }: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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
      <DialogContent className="sm:max-w-[425px] bg-white/80 backdrop-blur-2xl border-0 shadow-2xl rounded-3xl
        max-h-screen h-screen sm:h-auto w-screen sm:w-auto m-0 sm:m-4
        before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-b 
        before:from-white/20 before:to-transparent before:pointer-events-none">
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
            className="rounded-2xl border border-white/30 bg-white/30 backdrop-blur-sm w-full p-6
              [&_.rdp-caption]:text-xl [&_.rdp-caption]:font-semibold [&_.rdp-caption]:text-gray-800 [&_.rdp-caption]:mb-4
              [&_.rdp-months]:w-full
              [&_.rdp-month]:w-full
              [&_tr]:grid [&_tr]:grid-cols-7 [&_tr]:gap-2
              [&_.rdp-head_cell]:flex [&_.rdp-head_cell]:justify-center
              [&_.rdp-head_th]:text-orange-500 [&_.rdp-head_th]:font-medium [&_.rdp-head_th]:h-8 [&_.rdp-head_th]:w-12 [&_.rdp-head_th]:text-base
              [&_.rdp-tbody]:w-full
              [&_.rdp-cell]:flex [&_.rdp-cell]:justify-center
              [&_.rdp-button]:h-12 [&_.rdp-button]:w-12 [&_.rdp-button]:rounded-xl
              [&_.rdp-button]:text-base [&_.rdp-button]:transition-all [&_.rdp-button]:duration-200 [&_.rdp-button]:text-gray-700
              [&_.rdp-button]:bg-white/40 [&_.rdp-button]:backdrop-blur-sm [&_.rdp-button]:border [&_.rdp-button]:border-white/50
              [&_.rdp-button]:shadow-sm
              [&_.rdp-button:hover]:bg-white/70 [&_.rdp-button:hover]:shadow-lg [&_.rdp-button:hover]:-translate-y-0.5
              [&_.rdp-button:hover]:border-orange-300/50 [&_.rdp-button:active]:scale-95
              [&_.rdp-day_selected]:bg-gradient-to-br [&_.rdp-day_selected]:from-blue-500 [&_.rdp-day_selected]:to-blue-600
              [&_.rdp-day_selected]:text-white [&_.rdp-day_selected]:font-semibold [&_.rdp-day_selected]:shadow-xl 
              [&_.rdp-day_selected]:shadow-blue-500/25 [&_.rdp-day_selected]:border-blue-400
              [&_.rdp-day_today]:bg-gradient-to-br [&_.rdp-day_today]:from-orange-500 [&_.rdp-day_today]:to-orange-600 
              [&_.rdp-day_today]:text-white [&_.rdp-day_today]:font-bold [&_.rdp-day_today]:shadow-xl
              [&_.rdp-day_today]:shadow-orange-500/25 [&_.rdp-day_today]:animate-pulse
              [&_.rdp-nav_button]:text-gray-600 [&_.rdp-nav_button:hover]:text-gray-800 [&_.rdp-nav_button]:transition-all
              [&_.rdp-nav_button]:w-8 [&_.rdp-nav_button]:h-8 [&_.rdp-nav_button]:rounded-full
              [&_.rdp-nav_button]:bg-white/50 [&_.rdp-nav_button]:backdrop-blur-sm [&_.rdp-nav_button]:border
              [&_.rdp-nav_button]:border-white/50 [&_.rdp-nav_button:hover]:bg-white/70 [&_.rdp-nav_button:hover]:shadow-md"
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