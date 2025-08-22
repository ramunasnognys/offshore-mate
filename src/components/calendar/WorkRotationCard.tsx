'use client'

import { Clock } from 'lucide-react'
import { RotationPattern } from '@/types/rotation'

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
    <div className="text-red-500 text-sm mt-2 px-1">
      {error}
    </div>
  )
}

interface RotationOptionButtonProps {
  option: RotationOption
  isSelected: boolean
  onClick: () => void
}

function RotationOptionButton({ option, isSelected, onClick }: RotationOptionButtonProps) {
  return (
    <label className="flex items-center justify-between p-4 rounded-xl bg-white border border-gray-200 hover:border-gray-300 transition-all duration-200 cursor-pointer">
      <div className="flex-1">
        <div className="font-semibold text-base text-gray-800">
          {option.label}
        </div>
        <div className="text-sm text-gray-500 mt-1">
          {option.description}
        </div>
      </div>
      <div className="ml-4">
        <input
          type="radio"
          name="workRotation"
          value={option.value}
          checked={isSelected}
          onChange={() => onClick()}
          className="sr-only"
        />
        <div className={`w-5 h-5 rounded-full border-2 transition-all ${
          isSelected 
            ? 'border-orange-500 bg-orange-500' 
            : 'border-gray-300'
        } relative`}>
          {isSelected && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
          )}
        </div>
      </div>
    </label>
  )
}

interface CustomRotationInputProps {
  rotation: CustomRotation
  onChange: (rotation: CustomRotation) => void
  error?: string
}

function CustomRotationInput({ rotation, onChange, error }: CustomRotationInputProps) {
  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-200 mt-4">
      <label className="text-sm font-medium text-gray-700">Custom Rotation</label>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="work-days" className="text-xs text-gray-600 block mb-1">
            Work Days
          </label>
          <input
            id="work-days"
            type="number"
            placeholder="14"
            value={rotation.work}
            onChange={(e) => onChange({ ...rotation, work: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-roboto text-sm placeholder:text-xs placeholder:font-roboto"
            min="1"
          />
        </div>
        <div>
          <label htmlFor="rest-days" className="text-xs text-gray-600 block mb-1">
            Rest Days
          </label>
          <input
            id="rest-days"
            type="number"
            placeholder="21"
            value={rotation.rest}
            onChange={(e) => onChange({ ...rotation, rest: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-roboto text-sm placeholder:text-xs placeholder:font-roboto"
            min="1"
          />
        </div>
      </div>
      <ErrorDisplay error={error} />
    </div>
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
  return (
    <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-4">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-gray-600" />
        <label className="text-gray-600 text-lg font-serif font-semibold tracking-wide">
          Work Rotation
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => (
          <RotationOptionButton
            key={option.value}
            option={option}
            isSelected={selectedRotation === option.value}
            onClick={() => onRotationChange(option.value as RotationPattern)}
          />
        ))}
      </div>

      {selectedRotation === "Custom" && (
        <CustomRotationInput
          rotation={customRotation}
          onChange={onCustomRotationChange}
          error={error}
        />
      )}
    </div>
  )
}