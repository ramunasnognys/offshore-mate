"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] backdrop-blur-xl bg-white/95">
        <DialogHeader>
          <DialogTitle>Select Date</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={onSelect}
            initialFocus
            className="rounded-md border-0"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
} 