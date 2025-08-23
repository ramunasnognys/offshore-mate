'use client'

import { Clock } from 'lucide-react'
import { RotationPattern } from '@/types/rotation'
import { SmartCard } from '@/components/ui/smart-card'
import { useMobileDetection } from '@/hooks/useMobileDetection'
import type { RotationType } from '@/types/card-system'

interface RotationOption {
  label: string
  value: string
  workDays: number
  offDays: number
  description: string
}

interface CustomRotation {
  work: string
  rest: string
}

interface ErrorDisplayProps {
  error?: string
}

function ErrorDisplay({ error }: ErrorDisplayProps) {
  if (!error) return null
  
  return (
    <div 
      className="text-red-600 text-sm mt-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2"
      role="alert"
      aria-live="polite"
      id="custom-rotation-error"
    >
      <span className="text-red-500 text-base leading-none mt-0.5" aria-hidden="true">⚠</span>
      <span className="flex-1">{error}</span>
    </div>
  )
}

interface RotationOptionButtonProps {
  option: RotationOption
  isSelected: boolean
  onClick: () => void
}

function RotationOptionButton({ option, isSelected, onClick }: RotationOptionButtonProps) {
  const isMobile = useMobileDetection()
  
  // Map option values to RotationType
  const getRotationType = (value: string): RotationType => {
    switch (value) {
      case '14/21': return '14/21'
      case '28/28': return '28/28'
      case '14/14': return '14/14'
      case '15/20': return '15/20'
      case 'Custom': return 'Custom'
      default: return 'Custom'
    }
  }
  
  return (
    <SmartCard
      variant="rotation-selection"
      context={isMobile ? 'mobile' : 'desktop'}
      interactionMode={isMobile ? 'touch' : 'mouse'}
      importance="secondary"
      rotationType={getRotationType(option.value)}
      adaptiveContrast={true}
      physicsEnabled={false}
      magneticHover={!isMobile}
      glassEffect={true}
      // Phase 2 enhancements
      phase2Enhanced={true}
      microInteractions={true}
      enhancedShadows={true}
      gradientBackground={true}
      borderEffects={true}
      enhancedTypography={true}
      ariaLabel={`${option.label} rotation pattern`}
      ariaDescription={`${option.description}. ${isSelected ? 'Currently selected' : 'Click to select'}`}
      ariaSelected={isSelected}
      cognitiveBias="selection"
      onClick={onClick}
      className="w-full text-left transition-all duration-200"
      initialState={{ isSelected }}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-base text-current mb-1">
            {option.label}
          </div>
          <div className="text-sm opacity-75 line-clamp-2">
            {option.description}
          </div>
        </div>
        
        <div className="ml-4 flex-shrink-0">
          <div className={`w-5 h-5 rounded-full border-2 transition-all duration-200 relative ${
            isSelected 
              ? 'border-current bg-current shadow-sm' 
              : 'border-current/40 hover:border-current/60'
          }`}>
            {isSelected && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Hidden input for form compatibility */}
      <input
        type="radio"
        name="workRotation"
        value={option.value}
        checked={isSelected}
        onChange={() => onClick()}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      />
    </SmartCard>
  )
}

interface CustomRotationInputProps {
  rotation: CustomRotation
  onChange: (rotation: CustomRotation) => void
  error?: string
}

function CustomRotationInput({ rotation, onChange, error }: CustomRotationInputProps) {
  const isMobile = useMobileDetection()
  
  return (
    <SmartCard
      variant="info-panel"
      context={isMobile ? 'mobile' : 'desktop'}
      interactionMode={isMobile ? 'touch' : 'mouse'}
      importance="secondary"
      rotationType="Custom"
      adaptiveContrast={true}
      glassEffect={true}
      ariaLabel="Custom rotation configuration"
      ariaDescription="Configure your custom work and rest day pattern"
      className="mt-4"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-4 w-4 text-current opacity-70" />
          <label className="text-sm font-medium text-current opacity-90">
            Custom Rotation Pattern
          </label>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label 
              htmlFor="work-days" 
              className="text-xs text-current opacity-75 block mb-2 font-medium"
            >
              Work Days
            </label>
            <input
              id="work-days"
              type="number"
              placeholder="14"
              value={rotation.work}
              onChange={(e) => onChange({ ...rotation, work: e.target.value })}
              className={
                "w-full px-3 py-2.5 border rounded-lg text-sm font-medium " +
                "focus:outline-none focus:ring-2 focus:ring-current/20 " +
                "focus:border-current transition-all duration-200 " +
                "bg-white/50 border-current/20 text-current " +
                "placeholder:text-current/40 placeholder:font-normal " +
                "hover:border-current/30 hover:bg-white/60"
              }
              min="1"
              max="365"
              aria-describedby={error ? "custom-rotation-error" : undefined}
              aria-invalid={!!error}
            />
          </div>
          <div>
            <label 
              htmlFor="rest-days" 
              className="text-xs text-current opacity-75 block mb-2 font-medium"
            >
              Rest Days
            </label>
            <input
              id="rest-days"
              type="number"
              placeholder="21"
              value={rotation.rest}
              onChange={(e) => onChange({ ...rotation, rest: e.target.value })}
              className={
                "w-full px-3 py-2.5 border rounded-lg text-sm font-medium " +
                "focus:outline-none focus:ring-2 focus:ring-current/20 " +
                "focus:border-current transition-all duration-200 " +
                "bg-white/50 border-current/20 text-current " +
                "placeholder:text-current/40 placeholder:font-normal " +
                "hover:border-current/30 hover:bg-white/60"
              }
              min="1"
              max="365"
              aria-describedby={error ? "custom-rotation-error" : undefined}
              aria-invalid={!!error}
            />
          </div>
        </div>
        
        <ErrorDisplay error={error} />
      </div>
    </SmartCard>
  )
}

interface WorkRotationCardProps {
  selectedRotation: string
  onRotationChange: (rotation: RotationPattern | '') => void
  customRotation: CustomRotation
  onCustomRotationChange: (rotation: CustomRotation) => void
  options: RotationOption[]
  error?: string
}

export function WorkRotationCard({ 
  selectedRotation, 
  onRotationChange, 
  customRotation, 
  onCustomRotationChange, 
  options, 
  error 
}: WorkRotationCardProps) {
  const isMobile = useMobileDetection()
  
  return (
    <SmartCard
      variant="info-panel"
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
      ariaLabel="Work rotation pattern selection"
      ariaDescription="Choose your work rotation schedule from the available options or create a custom pattern"
      className="card-container"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-current/10 rounded-lg">
            <Clock className="h-5 w-5 text-current" />
          </div>
          <div>
            <h2 className="text-current text-lg font-serif font-semibold tracking-wide">
              Work Rotation Pattern
            </h2>
            <p className="text-current/70 text-sm mt-1">
              Select your offshore work schedule
            </p>
          </div>
        </div>

        {/* Rotation Options Grid */}
        <div className="grid grid-cols-1 @[400px]:grid-cols-2 gap-4">
          {options.map((option) => (
            <RotationOptionButton
              key={option.value}
              option={option}
              isSelected={selectedRotation === option.value}
              onClick={() => onRotationChange(option.value as RotationPattern)}
            />
          ))}
        </div>

        {/* Custom Rotation Input */}
        {selectedRotation === "Custom" && (
          <CustomRotationInput
            rotation={customRotation}
            onChange={onCustomRotationChange}
            error={error}
          />
        )}
      </div>
    </SmartCard>
  )
}