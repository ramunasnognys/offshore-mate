'use client'

import { Calendar } from 'lucide-react'
import { DatePicker } from '@/components/date-picker'
import { SmartCard } from '@/components/ui/smart-card'
import { useMobileDetection } from '@/hooks/useMobileDetection'

interface StartDateCardProps {
  selectedDate: string
  onDateSelect: (date: Date | undefined) => void
}

export function StartDateCard({ selectedDate, onDateSelect }: StartDateCardProps) {
  const isMobile = useMobileDetection()
  const formattedDate = selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'No date selected'
  
  return (
    <SmartCard
      variant="date-picker"
      context={isMobile ? 'mobile' : 'desktop'}
      interactionMode={isMobile ? 'touch' : 'mouse'}
      importance="secondary"
      adaptiveContrast={true}
      glassEffect={true}
      // Phase 2 enhancements
      phase2Enhanced={true}
      microInteractions={true}
      enhancedShadows={true}
      gradientBackground={true}
      borderEffects={true}
      enhancedTypography={true}
      visualIndicators={true}
      ariaLabel="Start date selection"
      ariaDescription={`Select the start date for your rotation. Currently selected: ${formattedDate}`}
      className="card-container"
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-radial from-current/5 to-current/2 rounded-lg transition-all duration-300 hover:from-current/8 hover:to-current/4">
            <Calendar className="h-5 w-5 text-current" />
          </div>
          <div className="flex-1">
            <h2 className="text-current text-lg font-serif font-semibold tracking-wide">
              Start Date
            </h2>
            <p className="text-current/50 text-sm mt-1">
              When does your rotation begin?
            </p>
          </div>
        </div>
        
        {/* Date Picker Container */}
        <SmartCard
          variant="info-panel"
          context={isMobile ? 'mobile' : 'desktop'}
          interactionMode={isMobile ? 'touch' : 'mouse'}
          importance="secondary"
          adaptiveContrast={true}
          glassEffect={false}
          ariaLabel="Date picker input"
          className="bg-white/80 hover:bg-white/90 transition-colors duration-200 !py-3"
        >
          <DatePicker 
            date={selectedDate ? new Date(selectedDate) : undefined}
            onSelect={onDateSelect}
          />
        </SmartCard>
      </div>
    </SmartCard>
  )
}