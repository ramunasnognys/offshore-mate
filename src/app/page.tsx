'use client'

import React, { useState, useEffect } from 'react'
import { ChevronDown, Download, ArrowRight, Save, XCircle } from 'lucide-react'
import { DatePicker } from "@/components/date-picker"
import { generateRotationCalendar } from '@/lib/utils/rotation'
import { ScheduleList } from '@/components/schedule-list'
import { DownloadCalendar } from '@/components/download-calendar'
import { MonthData, RotationPattern } from '@/types/rotation'
import { downloadCalendarAsImage } from '@/lib/utils/download'
import { SavedSchedules } from '@/components/saved-schedules'
import { SavedSchedule, ScheduleMetadata, saveSchedule, getSchedule, isStorageAvailable, generateScheduleId } from '@/lib/utils/storage'

type RotationOption = {
  label: string
  value: string
  workDays: number
  offDays: number
}

export default function Home() {
  const [selectedDate, setSelectedDate] = useState('')
  const [isRotationOpen, setIsRotationOpen] = useState(false)
  const [selectedRotation, setSelectedRotation] = useState('')
  const [isCalendarGenerated, setIsCalendarGenerated] = useState(false)
  const [yearCalendar, setYearCalendar] = useState<MonthData[]>([])
  const [isHovered, setIsHovered] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [currentScheduleId, setCurrentScheduleId] = useState<string | null>(null)
  const [scheduleName, setScheduleName] = useState('')
  const [showSavedSchedules, setShowSavedSchedules] = useState(false)
  const [saveNotification, setSaveNotification] = useState('')

  const rotationOptions: RotationOption[] = [
    { label: '14/14 Rotation', value: '14/14', workDays: 14, offDays: 14 },
    { label: '14/21 Rotation', value: '14/21', workDays: 14, offDays: 21 },
    { label: '21/21 Rotation', value: '21/21', workDays: 21, offDays: 21 },
    { label: '28/28 Rotation', value: '28/28', workDays: 28, offDays: 28 }
  ]

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const formattedDate = date.toLocaleDateString('en-CA')
      setSelectedDate(formattedDate)
    }
  }

  const handleGenerateCalendar = () => {
    if (!selectedDate || !selectedRotation) {
      alert('Please select both a start date and rotation pattern')
      return
    }
    
    const calendar = generateRotationCalendar(
      new Date(selectedDate),
      selectedRotation as RotationPattern,
      12
    )
    
    setYearCalendar(calendar)
    setIsCalendarGenerated(true)
    setIsSaved(false)
    setCurrentScheduleId(null)
    // Generate a default schedule name with date and rotation
    const defaultName = `${selectedRotation} Rotation (${new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })})`
    setScheduleName(defaultName)
  }

  // Handle loading a saved schedule
  const handleLoadSchedule = (scheduleId: string) => {
    try {
      const savedSchedule = getSchedule(scheduleId)
      if (!savedSchedule) return

      setSelectedDate(savedSchedule.metadata.startDate)
      setSelectedRotation(savedSchedule.metadata.rotationPattern as RotationPattern)
      setYearCalendar(savedSchedule.calendar)
      setScheduleName(savedSchedule.metadata.name)
      setCurrentScheduleId(scheduleId)
      setIsCalendarGenerated(true)
      setIsSaved(true)
      setShowSavedSchedules(false)
    } catch (error) {
      console.error('Error loading schedule:', error)
      alert('Could not load the saved schedule. It may be in an invalid format.')
    }
  }

  // Handle saving the current schedule
  const handleSaveSchedule = () => {
    if (!isStorageAvailable()) {
      alert('Local storage is not available in your browser. Unable to save the schedule.')
      return
    }

    if (!yearCalendar || yearCalendar.length === 0) {
      alert('Please generate a calendar before saving')
      return
    }

    setIsSaving(true)
    try {
      // Create schedule metadata
      const metadata: ScheduleMetadata = {
        id: currentScheduleId || generateScheduleId(),
        name: scheduleName || `${selectedRotation} Rotation`,
        rotationPattern: selectedRotation,
        startDate: selectedDate,
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
      const success = saveSchedule(scheduleToSave)

      if (success) {
        setCurrentScheduleId(metadata.id)
        setIsSaved(true)
        // Show notification
        setSaveNotification('Schedule saved successfully!')
        setTimeout(() => setSaveNotification(''), 3000) // Clear after 3 seconds
      } else {
        alert('Failed to save the schedule. Please try again.')
      }
    } catch (error) {
      console.error('Error saving schedule:', error)
      alert('An error occurred while saving the schedule.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDownload = async () => {
    try {
      setIsDownloading(true)
      const filename = `offshore-calendar-${selectedRotation}-${selectedDate}.png`
      await downloadCalendarAsImage('download-calendar', filename)
    } catch (error) {
      console.error('Failed to download calendar:', error)
      alert('Failed to download calendar. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-white to-pink-100 flex items-center justify-center p-4 md:p-8 bg-fixed">
      <div className="relative w-full max-w-[500px]">
        {/* Save notification */}
        {saveNotification && (
          <div className="fixed top-4 right-4 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg shadow-md animate-fade-in-out">
            {saveNotification}
          </div>
        )}
        <div className="flex items-center justify-center gap-2 md:gap-3 mb-2">
          <h1 className="text-4xl md:text-5xl lg:text-5xl font-display text-center text-gray-800">
            Offshore Mate
          </h1>
        </div>
        <p className="text-center text-orange-500 mb-8 md:mb-12 tracking-wide uppercase text-[10px] md:text-sm font-light">
          Navigate your offshore schedule with precision
        </p>

        {!isCalendarGenerated ? (
          <div className="space-y-4 md:space-y-6">
            {/* Date Picker Button */}
            <div className="backdrop-blur-xl bg-white/30 rounded-2xl md:rounded-3xl shadow-lg border border-white/30 transition-all duration-300 hover:shadow-xl hover:bg-white/40">
              <div className="px-4 md:px-6 py-3 md:py-4">
                <span className="text-gray-500 text-xs md:text-sm font-medium mb-0.5 md:mb-1 block">
                  Start Date
                </span>
                <DatePicker 
                  date={selectedDate ? new Date(selectedDate) : undefined}
                  onSelect={handleDateSelect}
                />
              </div>
            </div>

            {/* Rotation Selector */}
            <div className="relative">
              <div className="backdrop-blur-xl bg-white/30 rounded-2xl md:rounded-3xl shadow-lg border border-white/30 transition-all duration-300 hover:shadow-xl hover:bg-white/40">
                <button
                  onClick={() => setIsRotationOpen(!isRotationOpen)}
                  className={`flex items-center w-full px-4 md:px-6 py-3 md:py-4 hover:bg-white/10 transition-all duration-200 group
                    ${isRotationOpen ? 'rounded-t-2xl md:rounded-t-3xl' : 'rounded-2xl md:rounded-3xl'}`}
                >
                  <div className="flex-grow text-left">
                    <span className="text-gray-500 text-xs md:text-sm font-medium mb-0.5 md:mb-1 block">Work Rotation</span>
                    <span className="text-gray-800 text-base md:text-lg font-medium group-hover:text-orange-500 transition-colors">
                      {selectedRotation ? `${selectedRotation} Rotation` : 'Select rotation'}
                    </span>
                  </div>
                  <div className="flex items-center justify-center ml-3 md:ml-4">
                    <ChevronDown className={`w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-orange-500 transition-transform duration-200 
                      ${isRotationOpen ? 'transform rotate-180' : ''}`} />
                  </div>
                </button>

                {/* Rotation Options */}
                {isRotationOpen && (
                  <div className="border-t border-white/30">
                    <div className="backdrop-blur-xl bg-white/80 rounded-b-2xl md:rounded-b-3xl">
                      {rotationOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSelectedRotation(option.value)
                            setIsRotationOpen(false)
                          }}
                          className={`w-full px-4 md:px-6 py-2.5 md:py-3 text-left hover:bg-white/50 transition-all duration-200
                            ${selectedRotation === option.value ? 'bg-white/50' : ''}`}
                        >
                          <div className="text-gray-800 text-sm md:text-base font-medium">{option.label}</div>
                          <div className="text-gray-500 text-xs md:text-sm">
                            {`${option.workDays} days on, ${option.offDays} days off`}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Saved Schedules Button */}
            {isStorageAvailable() && (
              <div className="backdrop-blur-xl bg-white/30 rounded-2xl md:rounded-3xl shadow-lg border border-white/30 transition-all duration-300 hover:shadow-xl hover:bg-white/40">
                <button
                  onClick={() => setShowSavedSchedules(!showSavedSchedules)}
                  className="w-full px-4 md:px-6 py-3 md:py-4 flex items-center justify-between hover:bg-white/10 transition-all duration-200 group rounded-2xl md:rounded-3xl"
                >
                  <div className="flex-grow text-left">
                    <span className="text-gray-500 text-xs md:text-sm font-medium mb-0.5 md:mb-1 block">
                      Saved Schedules
                    </span>
                    <span className="text-gray-800 text-base md:text-lg font-medium group-hover:text-orange-500 transition-colors">
                      View your saved schedules
                    </span>
                  </div>
                  <div className="flex items-center justify-center ml-3 md:ml-4">
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-orange-500 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </button>
              </div>
            )}

            {/* Show saved schedules popup */}
            {showSavedSchedules && (
              <div className="fixed inset-0 bg-black/25 backdrop-blur-sm z-20 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-auto shadow-xl">
                  <div className="p-5">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold">Saved Schedules</h3>
                      <button 
                        onClick={() => setShowSavedSchedules(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                    <SavedSchedules 
                      onLoadSchedule={handleLoadSchedule} 
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Generate Button */}
            <button
              onClick={handleGenerateCalendar}
              disabled={!selectedDate || !selectedRotation}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className={`w-full text-white rounded-2xl md:rounded-3xl px-4 md:px-6 py-4 md:py-5 font-medium text-base md:text-lg 
                shadow-lg transition-all duration-300 border relative overflow-hidden
                ${(!selectedDate || !selectedRotation) 
                  ? 'opacity-100 cursor-not-allowed bg-gray-400 border-white/5' 
                  : 'bg-black hover:bg-black/90 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] active:shadow-md border-white/10'
                }`}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Generate Calendar
                <ArrowRight className={`w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
              </span>
              {selectedDate && selectedRotation && (
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-black to-black/90 transform transition-transform duration-300"
                  style={{
                    transform: isHovered ? 'translateX(0)' : 'translateX(-100%)',
                    zIndex: 0
                  }}
                />
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-6 md:space-y-8">
            {/* Schedule Name Input */}
            <div className="backdrop-blur-xl bg-white/30 rounded-2xl md:rounded-3xl shadow-lg border border-white/30 transition-all duration-300 mb-4">
              <div className="px-4 md:px-6 py-3 md:py-4">
                <span className="text-gray-500 text-xs md:text-sm font-medium mb-0.5 md:mb-1 block">
                  Schedule Name {isSaved && <span className="text-green-500">(Saved)</span>}
                </span>
                <input
                  type="text"
                  value={scheduleName}
                  onChange={(e) => setScheduleName(e.target.value)}
                  className="w-full bg-transparent border-none focus:outline-none text-gray-800 text-base md:text-lg font-medium"
                  placeholder="Enter a name for this schedule"
                />
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <button
                onClick={() => setIsCalendarGenerated(false)}
                className="bg-white/30 backdrop-blur-xl text-gray-800 rounded-full px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-medium
                  shadow-sm hover:bg-white/40 transition-all duration-200 border border-white/30 group"
              >
                <span className="flex items-center gap-1.5 md:gap-2">
                  <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                  Back
                </span>
              </button>
              
              <div className="flex gap-2">
                {isStorageAvailable() && (
                  <button
                    onClick={handleSaveSchedule}
                    disabled={isSaving}
                    className={`bg-green-600 text-white rounded-full px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-medium
                      shadow-sm hover:bg-green-700 transition-all duration-200 flex items-center gap-1.5 md:gap-2 group
                      ${isSaving ? 'opacity-75 cursor-wait' : ''}`}
                  >
                    <Save className={`w-3.5 h-3.5 md:w-4 md:h-4 transition-transform
                      ${isSaving ? 'animate-pulse' : 'group-hover:scale-110'}`} 
                    />
                    {isSaving ? 'Saving...' : (isSaved ? 'Update' : 'Save')}
                  </button>
                )}
                
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className={`bg-black text-white rounded-full px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-medium
                    shadow-sm hover:bg-black/90 transition-all duration-200 flex items-center gap-1.5 md:gap-2 group
                    ${isDownloading ? 'opacity-75 cursor-wait' : ''}`}
                >
                  <Download className={`w-3.5 h-3.5 md:w-4 md:h-4 transition-transform
                    ${isDownloading ? 'animate-bounce' : 'group-hover:translate-y-0.5'}`} 
                  />
                  {isDownloading ? 'Downloading...' : 'Download'}
                </button>
              </div>
            </div>
            
            <div>
              <ScheduleList 
                calendar={yearCalendar} 
                className="h-[calc(100vh-12rem)] overflow-y-auto"
              />
              <DownloadCalendar calendar={yearCalendar} />
            </div>
          </div>
        )}

        {/* Add footer at the bottom */}
        <div className="mt-8 text-center text-sm text-gray-300 tracking-wide">
          <p>
            Created by{' '}
            <a 
              href="https://my-portfolio-r80lxqbzb-ramunasnognys1s-projects.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-gray-500 underline transition-colors tracking-wide"
            >
              Ramūnas Nognys
            </a>
          </p>
          <p className="mt-1 tracking-wide">Version 1.0.2</p>
        </div>
      </div>
    </main>
  )
}