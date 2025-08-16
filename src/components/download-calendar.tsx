// src/components/download-calendar.tsx
import React from 'react';
import { MonthData } from '@/types/rotation';
import { format } from 'date-fns';
import { CALENDAR_COLORS, CALENDAR_TYPOGRAPHY, CALENDAR_LAYOUT } from '@/lib/constants/calendar-colors';
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
        <h1 
          style={{
            fontSize: CALENDAR_TYPOGRAPHY.mainTitle,
            fontWeight: CALENDAR_TYPOGRAPHY.mainTitleWeight,
            color: CALENDAR_COLORS.monthTitle,
            margin: 0,
            fontFamily: 'var(--font-display), system-ui, sans-serif'
          }}
        >
          Offshore Calendar
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: CALENDAR_LAYOUT.legendGap }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: CALENDAR_LAYOUT.legendItemGap }}>
            <div style={{
              width: CALENDAR_LAYOUT.legendIndicatorSize,
              height: CALENDAR_LAYOUT.legendIndicatorSize,
              background: CALENDAR_COLORS.legendWork,
              border: `2px solid ${CALENDAR_COLORS.legendWorkBorder}`,
              borderRadius: '4px'
            }} />
            <span style={{
              fontSize: CALENDAR_TYPOGRAPHY.legendText,
              color: CALENDAR_COLORS.legendText,
              fontWeight: CALENDAR_TYPOGRAPHY.legendWeight
            }}>Work</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: CALENDAR_LAYOUT.legendItemGap }}>
            <div style={{
              width: CALENDAR_LAYOUT.legendIndicatorSize,
              height: CALENDAR_LAYOUT.legendIndicatorSize,
              background: CALENDAR_COLORS.legendOff,
              border: `2px solid ${CALENDAR_COLORS.legendOffBorder}`,
              borderRadius: '4px'
            }} />
            <span style={{
              fontSize: CALENDAR_TYPOGRAPHY.legendText,
              color: CALENDAR_COLORS.legendText,
              fontWeight: CALENDAR_TYPOGRAPHY.legendWeight
            }}>Off</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: CALENDAR_LAYOUT.legendItemGap }}>
            <div style={{
              width: CALENDAR_LAYOUT.legendIndicatorSize,
              height: CALENDAR_LAYOUT.legendIndicatorSize,
              background: CALENDAR_COLORS.legendTravel,
              border: `2px solid ${CALENDAR_COLORS.legendTravelBorder}`,
              borderRadius: '4px'
            }} />
            <span style={{
              fontSize: CALENDAR_TYPOGRAPHY.legendText,
              color: CALENDAR_COLORS.legendText,
              fontWeight: CALENDAR_TYPOGRAPHY.legendWeight
            }}>Travel</span>
          </div>
        </div>
      </div>

      {/* Calendar Grid - 3x4 layout */}
      <div className="grid grid-cols-3 gap-0" style={{ height: 'calc(100% - 80px)' }}>
        {twelveMonths.map((month) => (
          <div 
            key={`${month.month}-${month.year}`}
            style={{
              width: '100%',
              height: '25%',
              background: CALENDAR_COLORS.calendarBackground,
              border: `1px solid ${CALENDAR_COLORS.monthBorder}`,
              borderRadius: CALENDAR_LAYOUT.monthBorderRadius,
              padding: CALENDAR_LAYOUT.monthPadding,
              aspectRatio: '1',
              minHeight: '280px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div className="h-full flex flex-col">
              <h3 style={{
                textAlign: 'center',
                margin: '0 0 16px 0',
                fontSize: CALENDAR_TYPOGRAPHY.monthTitle,
                color: CALENDAR_COLORS.monthTitle,
                fontWeight: CALENDAR_TYPOGRAPHY.monthTitleWeight,
                fontFamily: 'serif',
                flexShrink: 0
              }}>
                {month.month} {month.year}
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gridTemplateRows: 'repeat(7, 1fr)',
                gap: CALENDAR_LAYOUT.cellGap,
                fontSize: CALENDAR_TYPOGRAPHY.dayHeader,
                flex: 1
              }}>
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                  <div key={index} style={{
                    textAlign: 'center',
                    fontWeight: CALENDAR_TYPOGRAPHY.dayHeaderWeight,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: CALENDAR_COLORS.headerBackground,
                    color: CALENDAR_COLORS.headerText,
                    borderRadius: CALENDAR_LAYOUT.cellBorderRadius,
                    aspectRatio: '1'
                  }}>
                    {day}
                  </div>
                ))}
                
                {Array.from({ length: month.firstDayOfWeek === 0 ? 6 : month.firstDayOfWeek - 1 }).map((_, index) => (
                  <div key={`empty-${index}`} style={{ aspectRatio: '1' }} />
                ))}
                
                {month.days.map((day, index) => {
                  const getDayStyles = () => {
                    if (!day.isInRotation) {
                      return {
                        background: CALENDAR_COLORS.nonRotationDay,
                        color: CALENDAR_COLORS.dayText,
                        border: `1px solid ${CALENDAR_COLORS.nonRotationDayBorder}`
                      };
                    }
                    
                    if (day.isTransitionDay) {
                      return {
                        background: CALENDAR_COLORS.travelDay,
                        color: CALENDAR_COLORS.dayText,
                        border: `1px solid ${CALENDAR_COLORS.travelDayBorder}`
                      };
                    }
                    
                    if (day.isWorkDay) {
                      return {
                        background: CALENDAR_COLORS.workDay,
                        color: CALENDAR_COLORS.dayText,
                        border: `1px solid ${CALENDAR_COLORS.workDayBorder}`
                      };
                    }
                    
                    return {
                      background: CALENDAR_COLORS.offDay,
                      color: CALENDAR_COLORS.dayText,
                      border: `1px solid ${CALENDAR_COLORS.offDayBorder}`
                    };
                  };
                  
                  const dayStyles = getDayStyles();
                  
                  return (
                    <div
                      key={index}
                      style={{
                        aspectRatio: '1',
                        borderRadius: CALENDAR_LAYOUT.cellBorderRadius,
                        textAlign: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: CALENDAR_TYPOGRAPHY.dayNumberWeight,
                        fontSize: CALENDAR_TYPOGRAPHY.dayNumber,
                        ...dayStyles
                      }}
                    >
                      {format(day.date, 'd')}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
