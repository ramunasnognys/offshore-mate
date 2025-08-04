// src/components/schedule-list.tsx
import React from 'react';
import { MonthData, CalendarDay } from '@/types/rotation';
import { format } from 'date-fns';
import { Plane, Wrench, Waves, ChevronLeft, ChevronRight } from 'lucide-react';

// Type definitions
type DayType = 'work' | 'off' | 'transition' | 'inactive';

interface ScheduleListProps {
  calendar: MonthData[];
  className?: string;
  isMobile?: boolean;
  currentMonthIndex?: number;
  onNavigate?: (direction: 'prev' | 'next') => void;
  totalMonths?: number;
}

interface DayCellProps {
  day: CalendarDay;
}

interface CalendarMonthProps {
  month: MonthData;
  isMobile?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
  onNavigate?: (direction: 'prev' | 'next') => void;
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
    icon: <Wrench className="w-3 h-3 md:w-5 md:h-5" />
  },
  {
    type: 'off' as const,
    label: 'Off Days',
    className: 'bg-green-500/20 border border-green-500/30',
    icon: <Waves className="w-3 h-3 md:w-5 md:h-5" />
  },
  {
    type: 'transition' as const,
    label: 'Transition Days',
    className: 'bg-pink-500/20 ring-1 md:ring-2 ring-pink-500/50 border border-pink-500/30',
    icon: <Plane className="w-3 h-3 md:w-5 md:h-5" />
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

// Utility function to check if a date is today
function isToday(date: Date | string): boolean {
  const today = new Date();
  const compareDate = typeof date === 'string' ? new Date(date) : date;
  return compareDate.toDateString() === today.toDateString();
}

// Sub-components
function WeekdayHeaders() {
  return (
    <>
      {WEEKDAYS.map((day) => (
        <div 
          key={day} 
          className="text-center text-[10px] md:text-sm font-medium text-gray-500 py-0.5 md:py-2"
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
  const isCurrentDate = isToday(day.date);
  
  // Get appropriate icon for day type
  const getPatternIcon = () => {
    if (dayType === 'transition') return <Plane className="w-2 h-2 md:w-3.5 md:h-3.5" aria-hidden="true" />;
    if (dayType === 'work') return <Wrench className="w-2 h-2 md:w-3.5 md:h-3.5" aria-hidden="true" />;
    if (dayType === 'off') return <Waves className="w-2 h-2 md:w-3.5 md:h-3.5" aria-hidden="true" />;
    return null;
  };
  
  return (
    <div
      className={`
        aspect-square p-0.5 md:p-1.5 rounded-lg transition-all duration-200 hover:shadow-md 
        ${isCurrentDate ? 'today-cell border-2 border-white shadow-xl' : DAY_STYLES[dayType]} 
        relative overflow-hidden
      `}
      role="gridcell"
      aria-label={`${dayNumber} ${dayType === 'work' ? 'work day' : dayType === 'off' ? 'off day' : dayType === 'transition' ? 'transition day' : 'inactive'}${isCurrentDate ? ' - Today' : ''}`}
    >
      {isCurrentDate && (
        <>
          {/* Modern TODAY badge */}
          <div className="absolute -top-1 -right-1 today-badge text-white text-[7px] md:text-[9px] px-1.5 md:px-2 py-0.5 rounded-full font-extrabold tracking-wide z-10">
            TODAY
          </div>
          {/* Subtle inner glow */}
          <div className="absolute inset-0 bg-white/10 rounded-md"></div>
        </>
      )}
      <div className={`w-full h-full flex items-center justify-center rounded-md text-xs md:text-base font-medium min-h-[40px] md:min-h-[52px] relative z-10 ${
        isCurrentDate ? 'text-white drop-shadow-sm' : ''
      }`}>
        {/* Perfectly centered day number */}
        <span className={`font-semibold ${isCurrentDate ? 'text-white' : ''} relative z-20`}>{dayNumber}</span>
        
        {/* Absolutely positioned icon in top-left corner */}
        {day.isInRotation && (
          <div className={`absolute top-0.5 left-0.5 ${isCurrentDate ? 'filter brightness-0 invert' : ''}`}>
            {getPatternIcon()}
          </div>
        )}
      </div>
    </div>
  );
}

function CalendarGrid({ month }: CalendarMonthProps) {
  const emptyDaysCount = getEmptyDaysCount(month.firstDayOfWeek);
  
  return (
    <div 
      className="flex-grow grid grid-cols-7 gap-0.5 md:gap-2 content-start"
      role="grid"
      aria-label={`Calendar for ${month.month} ${month.year}`}
    >
      <WeekdayHeaders />
      
      {Array.from({ length: emptyDaysCount }).map((_, index) => (
        <div key={`empty-${index}`} className="aspect-square min-h-[40px] md:min-h-[52px]" role="gridcell" aria-hidden="true" />
      ))}
      
      {month.days.map((day, index) => (
        <DayCell key={index} day={day} />
      ))}
    </div>
  );
}


function CalendarLegend() {
  return (
    <div className="grid grid-cols-3 gap-1 md:gap-2 mt-3 md:mt-4 pt-2 md:pt-3 border-t border-gray-200/30">
      {LEGEND_CONFIG.map((item) => (
        <div key={item.type} className="flex flex-col items-center gap-1 text-center">
          <div className={`w-6 h-6 md:w-10 md:h-10 rounded-lg ${item.className} flex items-center justify-center`}>
            {item.icon}
          </div>
          <span className="text-[8px] md:text-xs text-gray-600 font-medium leading-tight">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function CalendarMonth({ month, isMobile, isFirst, isLast, onNavigate }: CalendarMonthProps) {
  return (
    <div 
      className={`backdrop-blur-xl bg-white rounded-3xl border border-white/20 shadow-lg p-3 md:p-6 pb-3 md:pb-6 ${isMobile ? 'mb-6' : ''}`}
      role="region"
      aria-labelledby={`month-${month.month}-${month.year}`}
    >
      <div className="h-full flex flex-col">
        {isMobile && onNavigate ? (
          // Mobile header with integrated navigation
          <div className="navigation-buttons flex items-center justify-between mb-3 relative z-30">
            <button
              onClick={() => {
                if (!isFirst && onNavigate) {
                  onNavigate('prev');
                }
              }}
              disabled={isFirst}
              className={`p-3 rounded-full transition-all duration-150 bg-gray-100/50 touch-manipulation relative ${
                isFirst 
                  ? 'opacity-30 cursor-not-allowed' 
                  : 'hover:bg-gray-200/50 active:scale-95'
              }`}
              style={{ 
                WebkitTouchCallout: 'none', 
                WebkitUserSelect: 'none'
              }}
              aria-label="Go to previous month"
              aria-disabled={isFirst}
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            
            <h3 
              id={`month-${month.month}-${month.year}`}
              className="text-lg md:text-xl font-bold text-gray-800 px-4 select-none flex-1 text-center"
            >
              {month.month} {month.year}
            </h3>
            
            <button
              onClick={() => {
                if (!isLast && onNavigate) {
                  onNavigate('next');
                }
              }}
              disabled={isLast}
              className={`p-3 rounded-full transition-all duration-150 bg-gray-100/50 touch-manipulation relative ${
                isLast
                  ? 'opacity-30 cursor-not-allowed' 
                  : 'hover:bg-gray-200/50 active:scale-95'
              }`}
              style={{ 
                WebkitTouchCallout: 'none', 
                WebkitUserSelect: 'none'
              }}
              aria-label="Go to next month"
              aria-disabled={isLast}
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        ) : (
          // Desktop header (unchanged)
          <h3 
            id={`month-${month.month}-${month.year}`}
            className="text-lg md:text-xl font-semibold text-gray-800 mb-4 md:mb-6 text-center"
          >
            {month.month} {month.year}
          </h3>
        )}
        
        <CalendarGrid month={month} />
        <CalendarLegend />
      </div>
    </div>
  );
}

// Main component
export function ScheduleList({ 
  calendar, 
  className, 
  isMobile, 
  currentMonthIndex, 
  onNavigate, 
  totalMonths 
}: ScheduleListProps) {
  return (
    <div 
      id="calendar-container"
      className={`space-y-4 md:space-y-8 ${className} ${isMobile ? 'with-bottom-toolbar' : ''}`}
      role="main"
      aria-label="Work rotation schedule"
    >
      {calendar.map((month) => (
        <CalendarMonth 
          key={`${month.month}-${month.year}`}
          month={month}
          isMobile={isMobile}
          isFirst={currentMonthIndex === 0}
          isLast={currentMonthIndex === (totalMonths ?? calendar.length) - 1}
          onNavigate={onNavigate}
        />
      ))}
      
      {/* Spacer for mobile to ensure content is visible above bottom toolbar */}
      {isMobile && (
        <div 
          className="mobile-calendar-spacer" 
          aria-hidden="true"
          style={{ 
            height: 'calc(5rem + env(safe-area-inset-bottom, 0) + 2rem)',
            minHeight: 'calc(5rem + env(safe-area-inset-bottom, 0) + 2rem)'
          }}
        />
      )}
    </div>
  );
}