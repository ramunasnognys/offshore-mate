import { useState, useCallback, useEffect } from 'react'
import { MonthData } from '@/types/rotation'
import {
  SavedSchedule,
  ScheduleMetadata,
  saveSchedule as saveScheduleToStorage,
  getSchedule,
  deleteSchedule as deleteScheduleFromStorage,
  getAllScheduleMetadata,
  generateScheduleId,
  isStorageAvailable
} from '@/lib/utils/storage'

interface UseScheduleManagementProps {
  onScheduleLoaded?: (schedule: SavedSchedule) => void
  onError?: (error: string) => void
}

interface UseScheduleManagementReturn {
  // State
  isSaving: boolean
  showSavedSchedules: boolean
  saveNotification: string
  isStorageSupported: boolean
  savedSchedulesList: ScheduleMetadata[]
  
  // Actions
  saveSchedule: (
    yearCalendar: MonthData[],
    scheduleName: string,
    rotationPattern: string,
    startDate: string,
    currentScheduleId: string | null
  ) => { success: boolean; id?: string }
  loadSchedule: (scheduleId: string) => void
  deleteSchedule: (scheduleId: string) => boolean
  setShowSavedSchedules: (show: boolean) => void
  setSaveNotification: (message: string) => void
  refreshSchedulesList: () => void
}

/**
 * Custom hook for managing schedule save/load operations
 */
export function useScheduleManagement({
  onScheduleLoaded,
  onError
}: UseScheduleManagementProps = {}): UseScheduleManagementReturn {
  const [isSaving, setIsSaving] = useState(false)
  const [showSavedSchedules, setShowSavedSchedules] = useState(false)
  const [saveNotification, setSaveNotification] = useState('')
  const [savedSchedulesList, setSavedSchedulesList] = useState<ScheduleMetadata[]>([])
  const [isStorageSupported, setIsStorageSupported] = useState(false)

  // Check if storage is available on mount
  useEffect(() => {
    setIsStorageSupported(isStorageAvailable())
  }, [])

  // Auto-clear save notifications
  useEffect(() => {
    if (saveNotification) {
      const timer = setTimeout(() => {
        setSaveNotification('')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [saveNotification])

  const refreshSchedulesList = useCallback(() => {
    if (isStorageSupported) {
      setSavedSchedulesList(getAllScheduleMetadata())
    }
  }, [isStorageSupported])

  const saveSchedule = useCallback((
    yearCalendar: MonthData[],
    scheduleName: string,
    rotationPattern: string,
    startDate: string,
    currentScheduleId: string | null
  ): { success: boolean; id?: string } => {
    if (!isStorageSupported) {
      onError?.('Your browser does not support local storage. Unable to save schedules.')
      return { success: false }
    }

    if (!yearCalendar || yearCalendar.length === 0) {
      onError?.('Please generate a calendar before saving it to your device')
      return { success: false }
    }

    setIsSaving(true)
    try {
      // Create schedule metadata
      const metadata: ScheduleMetadata = {
        id: currentScheduleId || generateScheduleId(),
        name: scheduleName || `${rotationPattern} Rotation`,
        rotationPattern,
        startDate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        schemaVersion: 'v1'
      }

      // Create the schedule object
      const scheduleToSave: SavedSchedule = {
        metadata,
        calendar: yearCalendar
      }

      // Save to localStorage
      const success = saveScheduleToStorage(scheduleToSave)

      if (success) {
        setSaveNotification('Schedule saved successfully!')
        refreshSchedulesList()
        return { success: true, id: metadata.id }
      } else {
        onError?.('Failed to save the schedule. Your storage may be full or restricted.')
        return { success: false }
      }
    } catch (error) {
      console.error('Error saving schedule:', error)
      onError?.('Unable to save the schedule. Please check your browser settings and try again.')
      return { success: false }
    } finally {
      setIsSaving(false)
    }
  }, [isStorageSupported, onError, refreshSchedulesList])

  const loadSchedule = useCallback((scheduleId: string) => {
    try {
      const savedSchedule = getSchedule(scheduleId)
      if (!savedSchedule) {
        onError?.('Schedule not found')
        return
      }

      onScheduleLoaded?.(savedSchedule)
      setShowSavedSchedules(false)
    } catch (error) {
      console.error('Error loading schedule:', error)
      onError?.('Unable to load the saved schedule. The file may be corrupted or in an outdated format.')
    }
  }, [onScheduleLoaded, onError])

  const deleteSchedule = useCallback((scheduleId: string): boolean => {
    try {
      const success = deleteScheduleFromStorage(scheduleId)
      if (success) {
        refreshSchedulesList()
        setSaveNotification('Schedule deleted successfully')
      }
      return success
    } catch (error) {
      console.error('Error deleting schedule:', error)
      onError?.('Unable to delete the schedule')
      return false
    }
  }, [onError, refreshSchedulesList])

  // Refresh schedules list when showing saved schedules
  useEffect(() => {
    if (showSavedSchedules) {
      refreshSchedulesList()
    }
  }, [showSavedSchedules, refreshSchedulesList])

  return {
    isSaving,
    showSavedSchedules,
    saveNotification,
    isStorageSupported,
    savedSchedulesList,
    saveSchedule,
    loadSchedule,
    deleteSchedule,
    setShowSavedSchedules,
    setSaveNotification,
    refreshSchedulesList
  }
}