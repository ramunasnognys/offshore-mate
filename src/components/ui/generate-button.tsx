'use client'

import React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface GenerateButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gradient'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  icon?: React.ReactNode
  children: React.ReactNode
  disabled?: boolean
  ariaDescribedBy?: string
}

export const GenerateButton: React.FC<GenerateButtonProps> = ({
  variant = 'primary',
  size = 'lg',
  isLoading = false,
  icon,
  children,
  disabled,
  ariaDescribedBy,
  className,
  ...props
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'cta-primary text-white'
      case 'secondary':
        return 'glass-button text-slate-700 hover:text-slate-900'
      case 'gradient':
        return 'gradient-purple text-white'
      default:
        return 'cta-primary text-white'
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2 text-sm h-10'
      case 'md':
        return 'px-6 py-3 text-base h-12'
      case 'lg':
        return 'px-12 py-6 text-xl h-14'
      default:
        return 'px-6 py-3 text-base h-12'
    }
  }

  const getResponsiveClasses = () => {
    if (size === 'lg') {
      return 'md:px-12 md:py-6 md:text-xl px-8 py-4 text-lg' // Responsive for large buttons
    }
    return getSizeClasses()
  }

  const iconSize = size === 'lg' ? 'h-6 w-6' : size === 'md' ? 'h-5 w-5' : 'h-4 w-4'

  return (
    <button
      className={cn(
        'font-semibold rounded-full border-0 focus-enhanced transition-all duration-300 ease-out',
        'flex items-center justify-center tracking-wide',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
        getVariantClasses(),
        getResponsiveClasses(),
        disabled && 'generate-button-disabled',
        className
      )}
      disabled={disabled || isLoading}
      aria-describedby={ariaDescribedBy}
      {...props}
    >
      {isLoading ? (
        <Loader2 className={cn(iconSize, 'mr-3 animate-spin')} aria-hidden="true" />
      ) : (
        icon && <span className="mr-3" aria-hidden="true">{icon}</span>
      )}
      {isLoading ? 'Generating...' : children}
    </button>
  )
}

// Export default for convenience
export default GenerateButton