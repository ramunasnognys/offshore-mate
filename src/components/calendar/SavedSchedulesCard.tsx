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
      // Phase 2 enhancements
      phase2Enhanced={true}
      microInteractions={true}
      enhancedShadows={true}
      gradientBackground={true}
      borderEffects={true}
      enhancedTypography={true}
      visualIndicators={true}
      ariaLabel="Saved schedules management"
      ariaDescription={`View and manage your saved schedules. You have ${savedSchedulesCount} saved schedules.`}
      onClick={onShowSavedSchedules}
      className="w-full text-left card-container"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="card-icon-enhanced">
            <Users className="h-5 w-5 text-current" />
          </div>
          <div>
            <h3 className="card-title-enhanced">
              Saved Schedules
            </h3>
            <p className="card-description-enhanced">
              Manage your saved rotation patterns
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="card-badge-enhanced">
            {savedSchedulesCount} saved
          </div>
          <div className="card-icon-enhanced">
            <ArrowRight className="w-4 h-4 text-current/60 group-hover:text-current transition-all duration-200 group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </SmartCard>
  )
}