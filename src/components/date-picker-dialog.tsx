"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"

interface DatePickerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selected?: Date
  onSelect: (date: Date | undefined) => void
}

export function DatePickerDialog({
  open,
  onOpenChange,
  selected,
  onSelect,
}: DatePickerDialogProps) {
  const today = new Date()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Pick a date</DialogTitle>
        </DialogHeader>
        <div className="backdrop-blur-xl bg-white/95 rounded-3xl p-8">
          {/* Today's Date Header */}
          <div className="text-center mb-8">
            <p className="text-lg font-medium text-gray-600">Today</p>
            <p className="text-3xl font-semibold text-gray-800">
              {today.toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </p>
          </div>

          {/* Calendar */}
          <div className="px-4">
            <Calendar
              mode="single"
              selected={selected}
              onSelect={onSelect}
              weekStartsOn={0}
              className="w-full"
              fromDate={today}
            />
          </div>

          {/* Selected Date */}
          {selected && (
            <div className="mt-6 text-center text-gray-600">
              Selected: {selected.toLocaleDateString('en-US', {
                month: 'numeric',
                day: 'numeric',
                year: 'numeric'
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 