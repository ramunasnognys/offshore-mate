'use client'

import { Users, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface SavedSchedulesCardProps {
  onShowSavedSchedules: () => void
  savedSchedulesCount: number
}

export function SavedSchedulesCard({ onShowSavedSchedules, savedSchedulesCount }: SavedSchedulesCardProps) {
  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardContent className="p-6">
        <button
          onClick={onShowSavedSchedules}
          className="w-full flex items-center justify-between hover:bg-white/10 transition-all duration-200 group rounded-xl p-2 -m-2"
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-slate-600" />
              <div className="text-left">
                <div className="text-sm font-semibold text-slate-700 mb-1">Saved Schedules</div>
                <div className="text-xs text-slate-500">View and manage your schedules</div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="bg-slate-100 text-slate-700 text-xs font-medium px-2.5 py-1 rounded-full">
              {savedSchedulesCount} saved
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-all duration-200 group-hover:translate-x-0.5" />
          </div>
        </button>
      </CardContent>
    </Card>
  )
}