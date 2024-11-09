// src/components/download-calendar.tsx
import React from 'react';
import { MonthData } from '@/types/rotation';
import { format } from 'date-fns';
import { Plane } from 'lucide-react';

interface DownloadCalendarProps {
  calendar: MonthData[];
}

export function DownloadCalendar({ calendar }: DownloadCalendarProps) {
  // Ensure we only use first 12 months
  const twelveMonths = calendar.slice(0, 12);

  return (
    <div 
      id="download-calendar"
      className="hidden" // Keep it hidden from view but accessible for html2canvas
      style={{
        width: '1080px',
        height: '1920px',
        position: 'fixed',
        top: '-9999px',
        left: '-9999px',
        backgroundColor: 'white',
        padding: '48px',
        fontFamily: 'var(--font-inter)',
      }}
    >
      {/* Title Section */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <h1 className="text-5xl font-display text-gray-800">
            Offshore Calendar
          </h1>
        </div>
        <p className="text-orange-500 tracking-wide uppercase text-lg font-light">
          Your Offshore Work Schedule
        </p>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-3 gap-6 auto-rows-fr">
        {twelveMonths.map((month) => (
          <div 
            key={`${month.month}-${month.year}`}
            className="backdrop-blur-xl bg-white rounded-2xl border border-gray-200 shadow-lg p-6"
          >
            <div className="h-full flex flex-col">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                {month.month} {month.year}
              </h3>
              
              <div className="flex-grow grid grid-cols-7 gap-1 content-start">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
                
                {Array.from({ length: month.firstDayOfWeek === 0 ? 6 : month.firstDayOfWeek - 1 }).map((_, index) => (
                  <div key={`empty-${index}`} className="aspect-square" />
                ))}
                
                {month.days.map((day, index) => (
                  <div
                    key={index}
                    className={`aspect-square p-1 rounded-lg ${
                      !day.isInRotation
                        ? 'bg-gray-100/50 text-gray-400'
                        : day.isTransitionDay
                          ? 'bg-pink-500/20 text-pink-800 ring-1 ring-pink-500/50'
                          : day.isWorkDay 
                            ? 'bg-orange-500/20 text-orange-800' 
                            : 'bg-green-500/20 text-green-800'
                    }`}
                  >
                    <div className="w-full h-full flex flex-col items-center justify-center rounded-lg text-sm">
                      {day.isTransitionDay && (
                        <Plane className="w-3 h-3 mb-0.5" />
                      )}
                      {format(day.date, 'd')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Legend */}
      <div className="fixed bottom-12 left-0 right-0">
        <div className="flex justify-center items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-orange-500/20" />
            <span className="text-base text-gray-700">Work Days</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-green-500/20" />
            <span className="text-base text-gray-700">Off Days</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-pink-500/20 ring-1 ring-pink-500/50 flex items-center justify-center">
              <Plane className="w-3 h-3" />
            </div>
            <span className="text-base text-gray-700">Transition Days</span>
          </div>
        </div>
      </div>
    </div>
  );
}
