'use client'

import { Users, ArrowRight } from 'lucide-react'

interface SavedSchedulesCardProps {
  onShowSavedSchedules: () => void
  savedSchedulesCount: number
}

export function SavedSchedulesCard({ onShowSavedSchedules, savedSchedulesCount }: SavedSchedulesCardProps) {
  return (
    <button
      onClick={onShowSavedSchedules}
      className="w-full p-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 
        rounded-xl transition-all duration-200 group text-left"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-600" />
          <label className="text-gray-600 text-lg font-serif font-semibold tracking-wide">
            Saved Schedules
          </label>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="bg-gray-200 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">
            {savedSchedulesCount} saved
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-all duration-200 group-hover:translate-x-0.5" />
        </div>
      </div>
    </button>
  )
}