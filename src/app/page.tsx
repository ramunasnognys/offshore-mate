'use client'

import React, { useState } from 'react'
import { ChevronDown, Download, ArrowRight } from 'lucide-react'
import { DatePicker } from "@/components/date-picker"
import { generateRotationCalendar } from '@/lib/utils/rotation'
import { ScheduleList } from '@/components/schedule-list'
import { MonthData, RotationPattern } from '@/types/rotation'

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
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-white to-pink-100 flex items-center justify-center p-4 md:p-8 bg-fixed">
      <div className="relative w-full max-w-[500px]">
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
              
              <button
                className="bg-black text-white rounded-full px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-medium
                  shadow-sm hover:bg-black/90 transition-all duration-200 flex items-center gap-1.5 md:gap-2 group"
              >
                <Download className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:translate-y-0.5 transition-transform" />
                Download Calendar
              </button>
            </div>
            
            <ScheduleList calendar={yearCalendar} />
          </div>
        )}
      </div>
    </main>
  )
}