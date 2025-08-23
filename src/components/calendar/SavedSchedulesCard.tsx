'use client'

import { Users, ArrowRight } from 'lucide-react'
import { SmartCard } from '@/components/ui/smart-card'
import { useMobileDetection } from '@/hooks/useMobileDetection'

interface SavedSchedulesCardProps {
  onShowSavedSchedules: () => void
  savedSchedulesCount: number
}

export function SavedSchedulesCard({ onShowSavedSchedules, savedSchedulesCount }: SavedSchedulesCardProps) {
  const isMobile = useMobileDetection()
  
  return (
    <SmartCard
      variant="action-card"
      context={isMobile ? 'mobile' : 'desktop'}
      interactionMode={isMobile ? 'touch' : 'mouse'}
      importance="secondary"
      adaptiveContrast={true}
      physicsEnabled={false}
      magneticHover={false}
      glassEffect={true}
      ariaLabel="Saved schedules management"
      ariaDescription={`View and manage your saved schedules. You have ${savedSchedulesCount} saved schedules.`}
      onClick={onShowSavedSchedules}
      className="w-full text-left card-container"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-current/10 rounded-lg">
            <Users className="h-5 w-5 text-current" />
          </div>
          <div>
            <h3 className="text-current text-lg font-serif font-semibold tracking-wide">
              Saved Schedules
            </h3>
            <p className="text-current/70 text-sm mt-1">
              Manage your saved rotation patterns
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="bg-current/10 text-current/80 text-xs font-medium px-3 py-1.5 rounded-full border border-current/20">
            {savedSchedulesCount} saved
          </div>
          <div className="p-1 rounded-lg bg-current/5 group-hover:bg-current/10 transition-colors duration-200">
            <ArrowRight className="w-4 h-4 text-current/60 group-hover:text-current transition-all duration-200 group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </SmartCard>
  )
}