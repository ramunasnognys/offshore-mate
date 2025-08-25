'use client'

import React, { useState, useEffect } from 'react'
import { BookmarkCheck, Share2, Trash, Calendar, Clock, PencilLine, X, Check, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GenerateButton } from '@/components/ui/generate-button'
import { useCalendar } from '@/contexts/CalendarContext'
import { useUI } from '@/contexts/UIContext'
import { useShareCalendar } from '@/hooks/useShareCalendar'
import { ShareModal } from '@/components/ShareModal'
import { ScheduleMetadata, getAllScheduleMetadataSorted, deleteSchedule } from '@/lib/utils/storage'
import { useScheduleManagement } from '@/hooks/useScheduleManagement'
import { formatDistanceToNow } from 'date-fns'

interface SaveTabProps {
  onSaveSchedule: () => void
  onLoadSchedule: (scheduleId: string) => void
}

export function SaveTab({ onSaveSchedule, onLoadSchedule }: SaveTabProps) {
  const { scheduleName, isCalendarGenerated, currentScheduleId, isSaved } = useCalendar()
  const { editingScheduleId, setEditingScheduleId, setErrorMessage } = useUI()
  const { isShareModalOpen, shareId, openShareModal, closeShareModal } = useShareCalendar()
  const { renameSchedule } = useScheduleManagement({ onError: (e) => setErrorMessage(e) })
  
  const [savedSchedules, setSavedSchedules] = useState<ScheduleMetadata[]>([])
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [localEditName, setLocalEditName] = useState<string>('')
  const [saveNotification, setSaveNotification] = useState('')

  // Load saved schedules
  const loadSavedSchedules = () => {
    const schedules = getAllScheduleMetadataSorted()
    setSavedSchedules(schedules)
  }

  useEffect(() => {
    loadSavedSchedules()
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

  const handleSave = () => {
    onSaveSchedule()
    setSaveNotification('Schedule saved successfully')
    loadSavedSchedules()
  }

  const handleShare = () => {
    if (!isCalendarGenerated) {
      setErrorMessage('Please generate a calendar first before sharing.')
      return
    }
    openShareModal()
  }

  const handleLoadSchedule = (scheduleId: string) => {
    try {
      onLoadSchedule(scheduleId)
      loadSavedSchedules()
    } catch (error) {
      setErrorMessage('Failed to load schedule')
    }
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    
    try {
      setRemovingId(deleteId)
      const success = deleteSchedule(deleteId)
      
      if (success) {
        loadSavedSchedules()
        setDeleteId(null)
        setSaveNotification('Schedule deleted successfully')
      } else {
        setErrorMessage('Failed to delete schedule')
      }
    } catch (error) {
      setErrorMessage('Failed to delete schedule')
    } finally {
      setRemovingId(null)
    }
  }

  const cancelDelete = () => setDeleteId(null)

  const startEdit = (schedule: ScheduleMetadata) => {
    setEditingScheduleId(schedule.id)
    setLocalEditName(schedule.name || `${schedule.rotationPattern} Schedule`)
  }

  const cancelEdit = () => {
    setEditingScheduleId(null)
    setLocalEditName('')
  }

  const confirmEdit = async (scheduleId: string) => {
    const name = localEditName.trim()
    if (!name) return
    
    const res = renameSchedule(scheduleId, name)
    if (res.success) {
      setEditingScheduleId(null)
      setLocalEditName('')
      loadSavedSchedules()
      setSaveNotification('Schedule renamed successfully')
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    } catch {
      return 'Invalid date'
    }
  }

  const getTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return formatDistanceToNow(date, { addSuffix: true })
    } catch {
      return 'Unknown time'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-2 text-gray-800 text-lg">Save & Share</h3>
        <p className="text-sm text-gray-600">
          Save your calendar for quick access or share it with colleagues.
        </p>
      </div>

      {/* Save Notification */}
      {saveNotification && (
        <div className="p-3 rounded-lg bg-green-50 border border-green-200">
          <p className="text-sm text-green-600 font-medium">{saveNotification}</p>
        </div>
      )}

      {/* Save & Share Actions */}
      <div className="space-y-3">
        {/* Save Button */}
        <GenerateButton
          variant="primary"
          size="md"
          icon={<BookmarkCheck className="h-4 w-4" />}
          onClick={handleSave}
          disabled={!isCalendarGenerated}
          className="w-full"
        >
          {isSaved ? 'Update Schedule' : 'Save Schedule'}
        </GenerateButton>

        {/* Share Button */}
        <GenerateButton
          variant="gradient"
          size="md"
          icon={<Share2 className="h-4 w-4" />}
          onClick={handleShare}
          disabled={!isCalendarGenerated}
          className="w-full"
        >
          Share Calendar
        </GenerateButton>
      </div>

      {/* Current Schedule Info */}
      {isCalendarGenerated && scheduleName && (
        <div className="p-4 rounded-xl bg-gray-50/50 border border-gray-200">
          <p className="text-sm text-gray-800 font-medium">
            Current: {scheduleName}
          </p>
          {currentScheduleId && (
            <p className="text-xs text-gray-600 mt-1">
              {isSaved ? 'Saved' : 'Not saved'}
            </p>
          )}
        </div>
      )}

      {/* Saved Schedules */}
      <div>
        <h4 className="font-medium mb-3 text-gray-700 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Saved Schedules ({savedSchedules.length})
        </h4>
        
        {savedSchedules.length === 0 ? (
          <div className="p-4 rounded-xl bg-gray-50/50 border border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              No saved schedules yet.
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {savedSchedules.map((schedule) => {
              const isEditing = editingScheduleId === schedule.id
              const isRemoving = removingId === schedule.id

              return (
                <div
                  key={schedule.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isRemoving 
                      ? 'bg-red-50 border-red-200 opacity-50' 
                      : 'bg-white border-gray-200 hover:border-orange-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={localEditName}
                            onChange={(e) => setLocalEditName(e.target.value)}
                            className="flex-1 px-2 py-1 text-sm border border-orange-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') confirmEdit(schedule.id)
                              if (e.key === 'Escape') cancelEdit()
                            }}
                            autoFocus
                          />
                        </div>
                      ) : (
                        <h5 className="font-medium text-gray-800 text-sm truncate">
                          {schedule.name || `${schedule.rotationPattern} Schedule`}
                        </h5>
                      )}
                      
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>Starts: {formatDate(schedule.startDate)}</span>
                        </div>
                      </div>
                      
                      <div className="mt-1">
                        <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                          {schedule.rotationPattern}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => confirmEdit(schedule.id)}
                            className="p-1 hover:bg-green-100 rounded transition-colors"
                            title="Confirm edit"
                          >
                            <Check className="w-4 h-4 text-green-600" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-1 hover:bg-red-100 rounded transition-colors"
                            title="Cancel edit"
                          >
                            <X className="w-4 h-4 text-red-600" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(schedule)}
                            className="p-1 hover:bg-blue-100 rounded transition-colors"
                            title="Edit schedule name"
                          >
                            <PencilLine className="w-4 h-4 text-blue-600" />
                          </button>
                          <button
                            onClick={() => setDeleteId(schedule.id)}
                            className="p-1 hover:bg-red-100 rounded transition-colors"
                            title="Delete schedule"
                          >
                            <Trash className="w-4 h-4 text-red-600" />
                          </button>
                          <button
                            onClick={() => handleLoadSchedule(schedule.id)}
                            className="p-1 hover:bg-orange-100 rounded transition-colors"
                            title="Load schedule"
                          >
                            <ArrowRight className="w-4 h-4 text-orange-600" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 mx-4 max-w-sm w-full">
            <div className="flex items-center gap-2 mb-4">
              <Trash className="w-5 h-5 text-red-500" />
              <h4 className="font-semibold text-gray-800">Delete schedule</h4>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              This action cannot be undone. This will permanently delete the selected schedule.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={cancelDelete} className="flex-1">
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete} className="flex-1">
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {shareId && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={closeShareModal}
          scheduleId={shareId}
        />
      )}
    </div>
  )
}