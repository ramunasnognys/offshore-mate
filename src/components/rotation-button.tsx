'use client'

import { cn } from '@/lib/utils'

interface RotationButtonProps {
  label: string
  isSelected: boolean
  onClick: () => void
  className?: string
}

export function RotationButton({
  label,
  isSelected,
  onClick,
  className
}: RotationButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative w-full px-5 py-2.5 md:px-6 md:py-4 rounded-full md:rounded-2xl border transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2",
        isSelected
          ? "border-black bg-black text-white"
          : "border-gray-200 bg-gray-50 text-gray-800 hover:bg-gray-100",
        className
      )}
    >
      <div className="font-semibold text-sm md:text-lg">{label}</div>
    </button>
  )
}