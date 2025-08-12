'use client'

import { Calendar as CalendarIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { DatePicker } from '@/components/date-picker'

interface StartDateCardProps {
  selectedDate: string
  onDateSelect: (date: Date | undefined) => void
}

export function StartDateCard({ selectedDate, onDateSelect }: StartDateCardProps) {
  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-slate-600" />
          <span className="text-sm font-semibold text-slate-700">Start Date</span>
        </div>

        <div>
          <DatePicker 
            date={selectedDate ? new Date(selectedDate) : undefined}
            onSelect={onDateSelect}
          />
        </div>
      </CardContent>
    </Card>
  )
}