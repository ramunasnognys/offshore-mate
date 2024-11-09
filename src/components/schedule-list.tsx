// src/components/schedule-list.tsx
import React from 'react';
import { MonthData } from '@/types/rotation';
import { format } from 'date-fns';
import { Plane } from 'lucide-react';

interface ScheduleListProps {
  calendar: MonthData[];
  className?: string;
}

export function ScheduleList({ calendar, className }: ScheduleListProps) {
  return (
    <div 
      id="calendar-container"
      className={`space-y-4 md:space-y-8 pr-2 md:pr-4 ${className}`}
    >
      {calendar.map((month) => (
        <div 
          key={`${month.month}-${month.year}`}
          className="backdrop-blur-xl bg-white rounded-3xl border border-white/20 shadow-lg p-4 md:p-6 pb-2 md:pb-3"
        >
          <div className="h-full flex flex-col">
            <h3 className="text-base md:text-xl font-semibold text-gray-800 mb-6 md:mb-12">
              {month.month} {month.year}
            </h3>
            
            <div className="flex-grow grid grid-cols-7 gap-0.5 md:gap-1 content-start">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <div key={day} className="text-center text-xs md:text-sm font-medium text-gray-500 py-1 md:py-2">
                  {day}
                </div>
              ))}
              
              {Array.from({ length: month.firstDayOfWeek === 0 ? 6 : month.firstDayOfWeek - 1 }).map((_, index) => (
                <div key={`empty-${index}`} className="aspect-square" />
              ))}
              
              {month.days.map((day, index) => (
                <div
                  key={index}
                  className={`aspect-square p-0.5 md:p-1 rounded-lg ${
                    !day.isInRotation
                      ? 'bg-gray-100/50 text-gray-400'
                      : day.isTransitionDay
                        ? 'bg-pink-500/20 text-pink-800 ring-1 md:ring-2 ring-pink-500/50'
                        : day.isWorkDay 
                          ? 'bg-orange-500/20 text-orange-800' 
                          : 'bg-green-500/20 text-green-800'
                  }`}
                >
                  <div className="w-full h-full flex flex-col items-center justify-center rounded-lg text-xs md:text-sm">
                    {day.isTransitionDay && (
                      <Plane className="w-2 h-2 md:w-3 md:h-3 mb-0.5" />
                    )}
                    {format(day.date, 'd')}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-2 md:gap-4 mt-auto pt-4 md:pt-6 pb-2 text-xs md:text-sm">
              <div className="flex items-center gap-1.5 md:gap-2">
                <div className="w-3 h-3 md:w-4 md:h-4 rounded bg-orange-500/20" />
                <span className="py-0.5 md:py-1">Work Days</span>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2">
                <div className="w-3 h-3 md:w-4 md:h-4 rounded bg-green-500/20" />
                <span className="py-0.5 md:py-1">Off Days</span>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2">
                <div className="w-3 h-3 md:w-4 md:h-4 rounded bg-pink-500/20 ring-1 md:ring-2 ring-pink-500/50 flex items-center justify-center">
                  <Plane className="w-2 h-2 md:w-2.5 md:h-2.5" />
                </div>
                <span className="py-0.5 md:py-1">Transition Days</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}