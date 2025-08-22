'use client'

import { Calendar } from 'lucide-react'
import { DatePicker } from '@/components/date-picker'

interface StartDateCardProps {
  selectedDate: string
  onDateSelect: (date: Date | undefined) => void
}

export function StartDateCard({ selectedDate, onDateSelect }: StartDateCardProps) {
  return (
    <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-gray-600" />
        <label className="text-gray-600 text-lg font-serif font-semibold tracking-wide">
          Start Date
        </label>
      </div>
      
      <div className="p-3 bg-white border border-gray-200 rounded-lg">
        <DatePicker 
          date={selectedDate ? new Date(selectedDate) : undefined}
          onSelect={onDateSelect}
        />
      </div>
    </div>
  )
}