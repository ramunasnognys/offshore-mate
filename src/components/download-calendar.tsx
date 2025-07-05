// src/components/download-calendar.tsx
import React from 'react';
import { MonthData } from '@/types/rotation';
import { format } from 'date-fns';
// import { Plane } from 'lucide-react';

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
        width: '2100px',
        height: '2970px',
        position: 'fixed',
        top: '-9999px',
        left: '-9999px',
        backgroundColor: 'white',
        padding: '20px',
        fontFamily: 'var(--font-inter)',
      }}
    >
      {/* Title Section */}
      <div className="flex justify-between items-center mb-4" style={{ height: '60px' }}>
        <h1 className="text-5xl font-display text-gray-800">
          Offshore Calendar
        </h1>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-orange-500/30 border-2 border-orange-500" />
            <span className="text-xl text-gray-700">Work</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-green-500/30 border-2 border-green-500" />
            <span className="text-xl text-gray-700">Off</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-pink-500/30 border-2 border-pink-500" />
            <span className="text-xl text-gray-700">Travel</span>
          </div>
        </div>
      </div>

      {/* Calendar Grid - 3x4 layout */}
      <div className="grid grid-cols-3 gap-0" style={{ height: 'calc(100% - 80px)' }}>
        {twelveMonths.map((month) => (
          <div 
            key={`${month.month}-${month.year}`}
            className="bg-white border border-gray-300 p-4"
            style={{ width: '100%', height: '25%' }}
          >
            <div className="h-full flex flex-col">
              <h3 className="text-3xl font-bold text-gray-800 mb-4 text-center">
                {month.month} {month.year}
              </h3>
              
              <div className="grid grid-cols-7 gap-1" style={{ height: 'calc(100% - 60px)' }}>
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                  <div key={index} className="text-center text-xl font-bold text-gray-600" style={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {day}
                  </div>
                ))}
                
                {Array.from({ length: month.firstDayOfWeek === 0 ? 6 : month.firstDayOfWeek - 1 }).map((_, index) => (
                  <div key={`empty-${index}`} className="aspect-square" />
                ))}
                
                {month.days.map((day, index) => (
                  <div
                    key={index}
                    className={`aspect-square rounded-md border-2 ${
                      !day.isInRotation
                        ? 'bg-gray-50 text-gray-400 border-gray-200'
                        : day.isTransitionDay
                          ? 'bg-pink-500/30 text-pink-900 border-pink-500'
                          : day.isWorkDay 
                            ? 'bg-orange-500/30 text-orange-900 border-orange-500' 
                            : 'bg-green-500/30 text-green-900 border-green-500'
                    }`}
                  >
                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold">
                      {format(day.date, 'd')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
