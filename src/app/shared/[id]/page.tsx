'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { CalendarProvider } from '@/contexts/CalendarContext'
import { UIProvider } from '@/contexts/UIContext'
import { getSchedule, SavedSchedule } from '@/lib/utils/storage'
import { decompressCalendarData } from '@/lib/utils/share'
import { Share2, ExternalLink, Calendar } from 'lucide-react'

interface SharedCalendarPageProps {
  params: Promise<{
    id: string
  }>
}

function SharedCalendarContent({ scheduleId }: { scheduleId: string }) {
  const [schedule, setSchedule] = useState<SavedSchedule | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadSharedSchedule = () => {
      try {
        // First, try to get calendar data from URL parameters
        const urlParams = new URLSearchParams(window.location.search)
        const encodedData = urlParams.get('data')
        
        if (encodedData) {
          try {
            const decodedSchedule = decompressCalendarData(encodedData)
            setSchedule(decodedSchedule)
            return
          } catch (decodeError) {
            console.error('Error decoding calendar data from URL:', decodeError)
            // Fall through to localStorage fallback
          }
        }
        
        // Fallback to localStorage for backward compatibility
        const savedSchedule = getSchedule(scheduleId)
        if (savedSchedule) {
          setSchedule(savedSchedule)
        } else {
          setError('Schedule not found or has expired')
        }
      } catch (err) {
        console.error('Error loading shared schedule:', err)
        setError('Unable to load the shared schedule')
      } finally {
        setLoading(false)
      }
    }

    loadSharedSchedule()
  }, [scheduleId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading shared calendar...</p>
        </div>
      </div>
    )
  }

  if (error || !schedule) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md px-6">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Calendar Not Found</h2>
          <p className="text-gray-600 mb-6">
            {error || 'This shared calendar link may have expired or is no longer available.'}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Create Your Own Schedule
          </Link>
        </div>
      </div>
    )
  }

  return <SharedCalendarView schedule={schedule} />
}

function SharedCalendarView({ schedule }: { schedule: SavedSchedule }) {
  return (
    <CalendarProvider>
      <UIProvider>
        <SharedCalendarDisplay schedule={schedule} />
      </UIProvider>
    </CalendarProvider>
  )
}

function SharedCalendarDisplay({ schedule }: { schedule: SavedSchedule }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null // Avoid hydration mismatch
  }

  return (
    <div className="flex flex-col min-h-[100dvh] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-white to-pink-100 bg-fixed">
      <main className="flex-1 overflow-y-auto flex items-start pt-6 justify-center p-4 md:p-8">
        <div className="relative w-full max-w-[500px]">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Share2 className="w-5 h-5 text-orange-500" />
              <h1 className="font-display text-3xl text-center text-gray-800">
                Shared Calendar
              </h1>
            </div>
            <p className="text-center text-orange-500 tracking-wide uppercase font-light text-[10px] mb-4">
              {schedule.metadata.name}
            </p>
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-white/40">
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Pattern:</span>
                <span className="font-medium">{schedule.metadata.rotationPattern}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Start Date:</span>
                <span className="font-medium">{new Date(schedule.metadata.startDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Created:</span>
                <span className="font-medium">{new Date(schedule.metadata.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Calendar Display - Read Only */}
          <SharedCalendarRenderer schedule={schedule} />

          {/* Footer */}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              <ExternalLink className="w-4 h-4" />
              Create Your Own Schedule
            </Link>
          </div>

          <div className="mt-4 text-center text-sm text-gray-300 tracking-wide">
            <p className="tracking-wide">Offshore Mate - Version v.2</p>
          </div>
        </div>
      </main>
    </div>
  )
}

function SharedCalendarRenderer({ schedule }: { schedule: SavedSchedule }) {
  // We need to render the calendar using the existing calendar components
  // but without the interactive features
  
  return (
    <div className="space-y-4">
      {schedule.calendar.map((month, index) => (
        <div key={index} className="bg-white/40 backdrop-blur-lg rounded-2xl p-6 border border-white/60 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              {month.month} {month.year}
            </h3>
          </div>
          
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day headers */}
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 p-2">
                {day}
              </div>
            ))}
            
            {/* Empty cells for proper weekday alignment */}
            {Array.from({ length: month.firstDayOfWeek === 0 ? 6 : month.firstDayOfWeek - 1 }).map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square" />
            ))}
            
            {/* Calendar days */}
            {month.days.map((day, dayIndex) => {
              // Safely handle date comparison and extraction
              let isToday = false
              let dayNumber = ''
              
              try {
                const dayDate = day.date instanceof Date ? day.date : new Date(day.date)
                isToday = new Date().toDateString() === dayDate.toDateString()
                dayNumber = dayDate.getDate().toString()
              } catch (error) {
                console.error('Error processing date for day:', day, error)
                dayNumber = '?'
              }
              
              return (
                <div
                  key={dayIndex}
                  className={`
                    aspect-square rounded-lg flex items-center justify-center text-sm font-medium
                    relative transition-all duration-200
                    ${!day.isInRotation 
                      ? 'text-gray-300 bg-gray-50/30' 
                      : day.isWorkDay 
                        ? 'bg-gradient-to-br from-emerald-400 to-green-500 text-white shadow-sm'
                        : 'bg-gradient-to-br from-blue-400 to-blue-500 text-white shadow-sm'
                    }
                    ${isToday ? 'ring-2 ring-orange-400 ring-offset-2 ring-offset-white/60' : ''}
                  `}
                >
                  <span className="relative z-10">{dayNumber}</span>
                  {day.isTransitionDay && (
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg opacity-40"></div>
                  )}
                </div>
              )
            })}
          </div>
          
          {/* Legend */}
          <div className="flex justify-center gap-4 mt-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gradient-to-br from-emerald-400 to-green-500 rounded"></div>
              <span className="text-gray-600">Work Days</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gradient-to-br from-blue-400 to-blue-500 rounded"></div>
              <span className="text-gray-600">Off Days</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded"></div>
              <span className="text-gray-600">Transition Days</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function SharedCalendarPage({ params }: SharedCalendarPageProps) {
  const [scheduleId, setScheduleId] = useState<string | null>(null)
  
  useEffect(() => {
    const loadParams = async () => {
      const { id } = await params
      setScheduleId(id)
    }
    loadParams()
  }, [params])

  if (!scheduleId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return <SharedCalendarContent scheduleId={scheduleId} />
}