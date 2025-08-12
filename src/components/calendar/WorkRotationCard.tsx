'use client'

import { Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

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
    <div className="text-red-600 text-sm mt-1 px-1">
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
    <button
      onClick={onClick}
      className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
        isSelected
          ? "border-slate-800 bg-slate-800 text-white shadow-lg"
          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
      }`}
    >
      <div className="font-semibold text-lg">{option.label}</div>
      <div className={`text-xs mt-1 ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
        {option.description}
      </div>
    </button>
  )
}

interface CustomRotationInputProps {
  rotation: CustomRotation
  onChange: (rotation: CustomRotation) => void
  error?: string
}

function CustomRotationInput({ rotation, onChange, error }: CustomRotationInputProps) {
  return (
    <div className="space-y-3 p-4 bg-slate-50 rounded-lg border">
      <label className="text-sm font-medium text-slate-700">Custom Rotation</label>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="work-days" className="text-xs text-slate-600 block mb-1">
            Work Days
          </label>
          <input
            id="work-days"
            type="number"
            placeholder="14"
            value={rotation.work}
            onChange={(e) => onChange({ ...rotation, work: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent"
            min="1"
          />
        </div>
        <div>
          <label htmlFor="rest-days" className="text-xs text-slate-600 block mb-1">
            Rest Days
          </label>
          <input
            id="rest-days"
            type="number"
            placeholder="21"
            value={rotation.rest}
            onChange={(e) => onChange({ ...rotation, rest: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent"
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
  onRotationChange: (rotation: any) => void
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
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-slate-600" />
          <span className="text-sm font-semibold text-slate-700">Work Rotation</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {options.map((option) => (
            <RotationOptionButton
              key={option.value}
              option={option}
              isSelected={selectedRotation === option.value}
              onClick={() => onRotationChange(option.value)}
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
      </CardContent>
    </Card>
  )
}