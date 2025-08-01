import { useState, useCallback } from 'react'
import { RotationPattern } from '@/types/rotation'

interface RotationOption {
  label: string
  value: string
  workDays: number
  offDays: number
}

interface UseRotationFormReturn {
  // State
  selectedDate: string
  selectedRotation: RotationPattern | ''
  showCustomInput: boolean
  customWorkDays: string
  customOffDays: string
  
  // Actions
  setSelectedDate: (date: string) => void
  handleDateSelect: (date: Date | undefined) => void
  setSelectedRotation: (rotation: RotationPattern | '') => void
  handleRotationSelect: (rotation: RotationPattern | '') => void
  setCustomWorkDays: (days: string) => void
  setCustomOffDays: (days: string) => void
  
  // Validation
  validateForm: () => { isValid: boolean; error?: string }
  
  // Constants
  rotationOptions: RotationOption[]
}

/**
 * Custom hook for managing rotation form state and validation
 */
export function useRotationForm(): UseRotationFormReturn {
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedRotation, setSelectedRotation] = useState<RotationPattern | ''>('14/21')
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [customWorkDays, setCustomWorkDays] = useState('')
  const [customOffDays, setCustomOffDays] = useState('')

  const rotationOptions: RotationOption[] = [
    { label: '14/14', value: '14/14', workDays: 14, offDays: 14 },
    { label: '14/21', value: '14/21', workDays: 14, offDays: 21 },
    { label: 'Other', value: 'Other', workDays: 0, offDays: 0 }
  ]

  const handleDateSelect = useCallback((date: Date | undefined) => {
    if (date) {
      const formattedDate = date.toLocaleDateString('en-CA')
      setSelectedDate(formattedDate)
    }
  }, [])

  const handleRotationSelect = useCallback((rotation: RotationPattern | '') => {
    setSelectedRotation(rotation)
    if (rotation === 'Other') {
      setShowCustomInput(true)
    } else {
      setShowCustomInput(false)
      setCustomWorkDays('')
      setCustomOffDays('')
    }
  }, [])

  const validateForm = useCallback(() => {
    if (!selectedDate && !selectedRotation) {
      return { 
        isValid: false, 
        error: 'Please select both a start date and rotation pattern to generate your calendar' 
      }
    }
    
    if (!selectedDate) {
      return { 
        isValid: false, 
        error: 'Please select a start date for your rotation schedule' 
      }
    }
    
    if (!selectedRotation) {
      return { 
        isValid: false, 
        error: 'Please select a work rotation pattern (14/14, 14/21, or Other)' 
      }
    }
    
    // Validate custom rotation inputs
    if (selectedRotation === 'Other') {
      const workDays = parseInt(customWorkDays)
      const offDays = parseInt(customOffDays)
      
      if (!customWorkDays || !customOffDays) {
        return { 
          isValid: false, 
          error: 'Please enter both work days and off days for your custom rotation' 
        }
      }
      
      if (workDays < 1 || workDays > 365) {
        return { 
          isValid: false, 
          error: 'Work days must be between 1 and 365 days' 
        }
      }
      
      if (offDays < 1 || offDays > 365) {
        return { 
          isValid: false, 
          error: 'Off days must be between 1 and 365 days' 
        }
      }
    }
    
    return { isValid: true }
  }, [selectedDate, selectedRotation, customWorkDays, customOffDays])

  return {
    selectedDate,
    selectedRotation,
    showCustomInput,
    customWorkDays,
    customOffDays,
    setSelectedDate,
    handleDateSelect,
    setSelectedRotation: handleRotationSelect,
    handleRotationSelect,
    setCustomWorkDays,
    setCustomOffDays,
    validateForm,
    rotationOptions
  }
}