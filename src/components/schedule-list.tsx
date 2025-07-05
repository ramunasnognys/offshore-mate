// src/components/schedule-list.tsx
import React from 'react';
import { MonthData, CalendarDay } from '@/types/rotation';
import { format } from 'date-fns';
import { Plane, Wrench, Waves } from 'lucide-react';

// Type definitions
type DayType = 'work' | 'off' | 'transition' | 'inactive';

interface ScheduleListProps {
  calendar: MonthData[];
  className?: string;
}

interface DayCellProps {
  day: CalendarDay;
}

interface CalendarMonthProps {
  month: MonthData;
}

interface LegendItemProps {
  label: string;
  className: string;
  icon?: React.ReactNode;
}

// Constants
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

const DAY_STYLES = {
  work: 'bg-orange-500/20 text-orange-800 border border-orange-500/30',
  off: 'bg-green-500/20 text-green-800 border border-green-500/30',
  transition: 'bg-pink-500/20 text-pink-800 ring-1 md:ring-2 ring-pink-500/50 border border-pink-500/30',
  inactive: 'bg-gray-100/50 text-gray-400 border border-gray-200/30'
} as const;

const LEGEND_CONFIG = [
  {
    type: 'work' as const,
    label: 'Work Days',
    className: 'bg-orange-500/20 border border-orange-500/30',
    icon: <Wrench className="w-2 h-2 md:w-2.5 md:h-2.5" />
  },
  {
    type: 'off' as const,
    label: 'Off Days',
    className: 'bg-green-500/20 border border-green-500/30',
    icon: <Waves className="w-2 h-2 md:w-2.5 md:h-2.5" />
  },
  {
    type: 'transition' as const,
    label: 'Transition Days',
    className: 'bg-pink-500/20 ring-1 md:ring-2 ring-pink-500/50 border border-pink-500/30',
    icon: <Plane className="w-2 h-2 md:w-2.5 md:h-2.5" />
  }
] as const;

// Utility functions
function getDayType(day: CalendarDay): DayType {
  if (!day.isInRotation) return 'inactive';
  if (day.isTransitionDay) return 'transition';
  if (day.isWorkDay) return 'work';
  return 'off';
}

function getEmptyDaysCount(firstDayOfWeek: number): number {
  return firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
}

// Sub-components
function WeekdayHeaders() {
  return (
    <>
      {WEEKDAYS.map((day) => (
        <div 
          key={day} 
          className="text-center text-xs md:text-sm font-medium text-gray-500 py-1 md:py-2"
          role="columnheader"
        >
          {day}
        </div>
      ))}
    </>
  );
}

function DayCell({ day }: DayCellProps) {
  const dayType = getDayType(day);
  const dayNumber = format(day.date, 'd');
  
  // Get appropriate icon for day type
  const getPatternIcon = () => {
    if (dayType === 'transition') return <Plane className="w-2.5 h-2.5 md:w-3 md:h-3 mb-0.5" aria-hidden="true" />;
    if (dayType === 'work') return <Wrench className="w-2.5 h-2.5 md:w-3 md:h-3 mb-0.5" aria-hidden="true" />;
    if (dayType === 'off') return <Waves className="w-2.5 h-2.5 md:w-3 md:h-3 mb-0.5" aria-hidden="true" />;
    return null;
  };
  
  return (
    <div
      className={`aspect-square p-1 md:p-1.5 rounded-lg transition-all duration-200 hover:shadow-md ${DAY_STYLES[dayType]}`}
      role="gridcell"
      aria-label={`${dayNumber} ${dayType === 'work' ? 'work day' : dayType === 'off' ? 'off day' : dayType === 'transition' ? 'transition day' : 'inactive'}`}
    >
      <div className="w-full h-full flex flex-col items-center justify-center rounded-md text-xs md:text-sm font-medium min-h-[44px] md:min-h-[48px]">
        {day.isInRotation && getPatternIcon()}
        <span className="font-semibold">{dayNumber}</span>
      </div>
    </div>
  );
}

function CalendarGrid({ month }: CalendarMonthProps) {
  const emptyDaysCount = getEmptyDaysCount(month.firstDayOfWeek);
  
  return (
    <div 
      className="flex-grow grid grid-cols-7 gap-1 md:gap-2 content-start"
      role="grid"
      aria-label={`Calendar for ${month.month} ${month.year}`}
    >
      <WeekdayHeaders />
      
      {Array.from({ length: emptyDaysCount }).map((_, index) => (
        <div key={`empty-${index}`} className="aspect-square min-h-[44px] md:min-h-[48px]" role="gridcell" aria-hidden="true" />
      ))}
      
      {month.days.map((day, index) => (
        <DayCell key={index} day={day} />
      ))}
    </div>
  );
}

function LegendItem({ label, className, icon }: LegendItemProps) {
  return (
    <div className="flex items-center gap-1.5 md:gap-2">
      <div className={`w-3 h-3 md:w-4 md:h-4 rounded ${className} ${icon ? 'flex items-center justify-center' : ''}`}>
        {icon}
      </div>
      <span className="py-0.5 md:py-1">{label}</span>
    </div>
  );
}

function CalendarLegend() {
  return (
    <div className="flex flex-wrap gap-2 md:gap-4 mt-auto pt-4 md:pt-6 pb-2 text-xs md:text-sm">
      {LEGEND_CONFIG.map((item) => (
        <LegendItem
          key={item.type}
          label={item.label}
          className={item.className}
          icon={item.icon}
        />
      ))}
    </div>
  );
}

function CalendarMonth({ month }: CalendarMonthProps) {
  return (
    <div 
      className="backdrop-blur-xl bg-white rounded-3xl border border-white/20 shadow-lg p-4 md:p-6 pb-4 md:pb-6"
      role="region"
      aria-labelledby={`month-${month.month}-${month.year}`}
    >
      <div className="h-full flex flex-col">
        <h3 
          id={`month-${month.month}-${month.year}`}
          className="text-lg md:text-xl font-semibold text-gray-800 mb-4 md:mb-6 text-center"
        >
          {month.month} {month.year}
        </h3>
        
        <CalendarGrid month={month} />
        <CalendarLegend />
      </div>
    </div>
  );
}

// Main component
export function ScheduleList({ calendar, className }: ScheduleListProps) {
  return (
    <div 
      id="calendar-container"
      className={`space-y-4 md:space-y-8 ${className}`}
      role="main"
      aria-label="Work rotation schedule"
    >
      {calendar.map((month) => (
        <CalendarMonth 
          key={`${month.month}-${month.year}`}
          month={month}
        />
      ))}
    </div>
  );
}