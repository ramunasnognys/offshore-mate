import { useState, useCallback } from 'react'
import { useCalendar } from '@/contexts/CalendarContext'
import { useUI } from '@/contexts/UIContext'
import { generateScheduleId } from '@/lib/utils/storage'

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
  const { yearCalendar, currentScheduleId } = useCalendar()
  const { setErrorMessage } = useUI()
  
  const openShareModal = useCallback(() => {
    // Check if calendar is generated
    if (!yearCalendar || yearCalendar.length === 0) {
      setErrorMessage('Please generate a calendar first before sharing.')
      return
    }
    
    // Use existing schedule ID or generate a new one for sharing
    const id = currentScheduleId || shareId || generateScheduleId()
    setShareId(id)
    setIsShareModalOpen(true)
  }, [yearCalendar, currentScheduleId, shareId, setErrorMessage])
  
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