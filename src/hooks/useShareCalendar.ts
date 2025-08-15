import { useState, useCallback } from 'react'
import { useCalendar } from '@/contexts/CalendarContext'
import { useUI } from '@/contexts/UIContext'
import { generateScheduleId, saveSchedule, SavedSchedule } from '@/lib/utils/storage'

interface UseShareCalendarReturn {
  // State
  isShareModalOpen: boolean
  shareId: string | null
  
  // Actions
  openShareModal: () => void
  closeShareModal: () => void
}

/**
 * Custom hook for managing calendar sharing functionality
 * Handles share modal state and share ID generation
 */
export function useShareCalendar(): UseShareCalendarReturn {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [shareId, setShareId] = useState<string | null>(null)
  const { yearCalendar, currentScheduleId, selectedRotation, selectedDate } = useCalendar()
  const { setErrorMessage } = useUI()
  
  const openShareModal = useCallback(() => {
    // Check if calendar is generated
    if (!yearCalendar || yearCalendar.length === 0) {
      setErrorMessage('Please generate a calendar first before sharing.')
      return
    }
    
    // Use existing schedule ID or generate a new one for sharing
    const id = currentScheduleId || shareId || generateScheduleId()
    
    // Ensure the schedule is saved to localStorage for sharing
    // This allows the shared link to access the calendar data
    if (!currentScheduleId || shareId !== id) {
      try {
        const scheduleToSave: SavedSchedule = {
          metadata: {
            id,
            name: `Shared ${selectedRotation} Schedule`,
            rotationPattern: selectedRotation,
            startDate: selectedDate,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            schemaVersion: 'v1'
          },
          calendar: yearCalendar
        }
        
        const success = saveSchedule(scheduleToSave)
        if (!success) {
          setErrorMessage('Unable to prepare schedule for sharing. Please try again.')
          return
        }
      } catch (error) {
        console.error('Error saving schedule for sharing:', error)
        setErrorMessage('Unable to prepare schedule for sharing. Please try again.')
        return
      }
    }
    
    setShareId(id)
    setIsShareModalOpen(true)
  }, [yearCalendar, currentScheduleId, shareId, selectedRotation, selectedDate, setErrorMessage])
  
  const closeShareModal = useCallback(() => {
    setIsShareModalOpen(false)
  }, [])
  
  return {
    isShareModalOpen,
    shareId,
    openShareModal,
    closeShareModal
  }
}