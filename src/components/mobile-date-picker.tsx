'use client'

import * as React from 'react'
import { Calendar as CalendarIcon, X, Check } from 'lucide-react'
import { format, addDays, startOfWeek, isToday, isSameDay } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { cn } from '@/lib/utils'

interface MobileDatePickerProps {
  date?: Date
  onSelect: (date: Date | undefined) => void
  selectedRotation?: string
}

// Custom dialog content for mobile bottom sheet without dark overlay
const MobileDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/20 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed z-50 gap-4 bg-background shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out",
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
))
MobileDialogContent.displayName = "MobileDialogContent"

export function MobileDatePicker({ date, onSelect, selectedRotation }: MobileDatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(date)
  const [isAnimating, setIsAnimating] = React.useState(false)

  const handleSelect = (newDate: Date | undefined) => {
    setSelectedDate(newDate)
  }

  const handleConfirm = () => {
    setIsAnimating(true)
    setTimeout(() => {
      onSelect(selectedDate)
      setOpen(false)
      setIsAnimating(false)
    }, 200)
  }

  const handleCancel = () => {
    setSelectedDate(date) // Reset to original
    setOpen(false)
  }

  const handleQuickSelect = (quickDate: Date) => {
    setSelectedDate(quickDate)
    // Auto-confirm for quick selections
    setTimeout(() => {
      onSelect(quickDate)
      setOpen(false)
    }, 300)
  }

  const formatDisplayDate = (date: Date | undefined) => {
    if (!date) return 'Pick your start date'
    return format(date, 'MMMM d, yyyy')
  }

  // Quick date options
  const today = new Date()
  const tomorrow = addDays(today, 1)
  const nextMonday = startOfWeek(addDays(today, 7), { weekStartsOn: 1 })
  const inOneWeek = addDays(today, 7)

  return (
    <>
      {/* Trigger Button */}
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

      {/* Mobile Bottom Sheet */}
      <Dialog open={open} onOpenChange={setOpen}>
        <MobileDialogContent className="md:hidden fixed bottom-0 left-0 right-0 top-auto max-h-[90vh] p-0 
          bg-white rounded-t-3xl border-0 shadow-2xl
          animate-in slide-in-from-bottom-full duration-300
          overflow-hidden flex flex-col">
          
          {/* Hidden Dialog Title for accessibility */}
          <DialogTitle className="sr-only">Select Start Date</DialogTitle>
          
          {/* Drag Handle */}
          <div className="flex-shrink-0 flex justify-center pt-3 pb-2">
            <div className="w-12 h-1 bg-gray-300 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex-shrink-0 px-4 sm:px-6 pb-3">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                Select Your First Work Day
              </h3>
              <button
                onClick={handleCancel}
                className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <p className="text-xs sm:text-sm text-gray-600">
              Choose when your {selectedRotation || 'rotation'} schedule begins
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex-shrink-0 px-4 sm:px-6 pb-3">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleQuickSelect(today)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all
                  ${isSameDay(selectedDate || new Date(), today)
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm active:scale-95'
                  }`}
              >
                Today
              </button>
              <button
                onClick={() => handleQuickSelect(tomorrow)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all
                  ${isSameDay(selectedDate || new Date(), tomorrow)
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm active:scale-95'
                  }`}
              >
                Tomorrow
              </button>
              <button
                onClick={() => handleQuickSelect(nextMonday)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all
                  ${isSameDay(selectedDate || new Date(), nextMonday)
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm active:scale-95'
                  }`}
              >
                Next Monday
              </button>
              <button
                onClick={() => handleQuickSelect(inOneWeek)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all
                  ${isSameDay(selectedDate || new Date(), inOneWeek)
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm active:scale-95'
                  }`}
              >
                In 1 Week
              </button>
            </div>
          </div>

          {/* Calendar */}
          <div className="flex-1 px-3 sm:px-4 pb-4 overflow-y-auto bg-gray-50 min-h-0 flex items-center justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleSelect}
              weekStartsOn={1}
              className="touch-manipulation bg-white rounded-xl p-4 border border-gray-200 shadow-lg
                [&_.rdp]:mx-auto [&_.rdp]:max-w-fit
                [&_.rdp-caption]:text-base [&_.rdp-caption]:font-semibold [&_.rdp-caption]:text-gray-800 [&_.rdp-caption]:mb-3
                [&_.rdp-caption]:flex [&_.rdp-caption]:justify-center [&_.rdp-caption]:items-center [&_.rdp-caption]:relative
                [&_.rdp-months]:flex [&_.rdp-months]:justify-center
                [&_.rdp-month]:w-full
                [&_.rdp-table]:mx-auto [&_.rdp-table]:max-w-fit
                [&_thead]:mb-1
                [&_tr]:grid [&_tr]:grid-cols-7 [&_tr]:gap-1 [&_tr]:justify-center
                [&_.rdp-head_cell]:flex [&_.rdp-head_cell]:justify-center [&_.rdp-head_cell]:items-center
                [&_.rdp-head_th]:text-orange-500 [&_.rdp-head_th]:font-semibold [&_.rdp-head_th]:text-[11px] [&_.rdp-head_th]:uppercase
                [&_.rdp-tbody]:block
                [&_.rdp-cell]:flex [&_.rdp-cell]:justify-center [&_.rdp-cell]:items-center
                [&_.rdp-button]:h-10 [&_.rdp-button]:w-10 [&_.rdp-button]:rounded-lg [&_.rdp-button]:flex [&_.rdp-button]:items-center [&_.rdp-button]:justify-center
                [&_.rdp-button]:text-sm [&_.rdp-button]:font-medium [&_.rdp-button]:transition-all [&_.rdp-button]:duration-200
                [&_.rdp-button]:bg-white [&_.rdp-button]:text-gray-700 [&_.rdp-button]:border [&_.rdp-button]:border-gray-200
                [&_.rdp-button]:shadow-sm
                [&_.rdp-button:not(:disabled)]:active:scale-95
                [&_.rdp-button:hover:not(:disabled)]:bg-gray-50 [&_.rdp-button:hover:not(:disabled)]:shadow-md
                [&_.rdp-button:hover:not(:disabled)]:border-orange-300
                [&_.rdp-day_selected]:bg-gradient-to-br [&_.rdp-day_selected]:from-blue-500 [&_.rdp-day_selected]:to-blue-600 
                [&_.rdp-day_selected]:text-white [&_.rdp-day_selected]:font-semibold
                [&_.rdp-day_selected]:border-blue-500 [&_.rdp-day_selected]:shadow-lg [&_.rdp-day_selected]:shadow-blue-500/20
                [&_.rdp-day_today]:bg-gradient-to-br [&_.rdp-day_today]:from-orange-500 [&_.rdp-day_today]:to-orange-600 
                [&_.rdp-day_today]:text-white [&_.rdp-day_today]:font-bold
                [&_.rdp-day_today]:shadow-lg [&_.rdp-day_today]:shadow-orange-500/20 [&_.rdp-day_today]:ring-2 [&_.rdp-day_today]:ring-orange-300
                [&_.rdp-day_disabled]:opacity-40 [&_.rdp-day_disabled]:cursor-not-allowed [&_.rdp-day_disabled]:bg-gray-50
                [&_.rdp-day_outside]:opacity-30 [&_.rdp-day_outside]:text-gray-400
                [&_.rdp-nav_button]:text-gray-600 [&_.rdp-nav_button:hover]:text-gray-800 
                [&_.rdp-nav_button]:w-8 [&_.rdp-nav_button]:h-8 [&_.rdp-nav_button]:rounded-full
                [&_.rdp-nav_button]:bg-white [&_.rdp-nav_button]:border [&_.rdp-nav_button]:border-gray-200
                [&_.rdp-nav_button:hover]:bg-gray-50 [&_.rdp-nav_button:hover]:shadow-md [&_.rdp-nav_button]:transition-all
                [&_.rdp-nav]:absolute [&_.rdp-nav]:flex [&_.rdp-nav]:items-center
                [&_.rdp-nav_button_previous]:absolute [&_.rdp-nav_button_previous]:left-1
                [&_.rdp-nav_button_next]:absolute [&_.rdp-nav_button_next]:right-1"
              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              fromDate={new Date()}
              toDate={addDays(new Date(), 365)}
            />
          </div>

          {/* Footer Actions */}
          <div className="flex-shrink-0 bg-white border-t border-gray-200 px-4 sm:px-6 py-3 shadow-lg">
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="flex-1 px-3 py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 font-medium text-sm
                  bg-white hover:bg-gray-50 transition-all active:scale-[0.98] shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={!selectedDate}
                className={`flex-1 px-3 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2
                  ${selectedDate
                    ? 'bg-gradient-to-r from-gray-900 to-black text-white hover:shadow-xl active:scale-[0.98] shadow-lg'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  } ${isAnimating ? 'scale-95' : ''}`}
              >
                {isAnimating && <Check className="w-4 h-4 animate-bounce" />}
                {selectedDate ? `Set ${format(selectedDate, 'MMM d')}` : 'Select Date'}
              </button>
            </div>
          </div>
        </MobileDialogContent>

        {/* Desktop Modal (fallback) */}
        <DialogContent className="hidden md:block md:max-w-[425px] bg-white/95 backdrop-blur-md border-0 shadow-lg rounded-3xl">
          <DialogTitle className="sr-only">Select Start Date</DialogTitle>
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-1">
              Select Start Date
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Choose when your rotation begins
            </p>
            
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date)
                setTimeout(() => {
                  onSelect(date)
                  setOpen(false)
                }, 200)
              }}
              weekStartsOn={1}
              className="rounded-lg w-full"
              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}