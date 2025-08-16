// src/lib/constants/calendar-colors.ts
// Shared calendar styling constants to ensure PNG and PDF exports match exactly

export const CALENDAR_COLORS = {
  // Day background colors
  workDay: '#93c5fd',      // Light blue for work days
  offDay: '#b3e5b3',       // Light green for off days  
  travelDay: '#ffc1cc',    // Light pink for travel/transition days
  nonRotationDay: '#f8f9fa', // Light gray for days before rotation starts
  
  // Day border colors
  workDayBorder: '#3b82f6',    // Blue border for work days
  offDayBorder: '#4ade80',     // Green border for off days
  travelDayBorder: '#f472b6',  // Pink border for travel days
  nonRotationDayBorder: '#e5e7eb', // Gray border for non-rotation days
  
  // Text colors
  dayText: '#1f2937',          // Dark gray for day numbers
  monthTitle: '#1f2937',       // Dark gray for month titles
  legendText: '#374151',       // Gray for legend text
  headerText: '#374151',       // Gray for day headers (M, T, W, etc.)
  
  // Background colors
  headerBackground: '#f8f9fa',  // Light gray for day headers
  calendarBackground: '#ffffff', // White background
  monthBorder: '#d1d5db',       // Gray border for month containers
  
  // Legend indicator colors (these match the day colors but are used in legend)
  legendWork: '#93c5fd',
  legendWorkBorder: '#3b82f6',
  legendOff: '#b3e5b3', 
  legendOffBorder: '#4ade80',
  legendTravel: '#ffc1cc',
  legendTravelBorder: '#f472b6'
} as const;

export const CALENDAR_TYPOGRAPHY = {
  // Font sizes (in pixels for React components, will be converted for PDF)
  monthTitle: '36px',
  dayNumber: '24px', 
  dayHeader: '20px',
  legendText: '20px',
  mainTitle: '48px',
  
  // Font weights
  monthTitleWeight: 'bold',
  dayNumberWeight: 'bold',
  dayHeaderWeight: 'bold',
  legendWeight: 'normal',
  mainTitleWeight: 'bold'
} as const;

export const CALENDAR_LAYOUT = {
  // Spacing and dimensions
  monthPadding: '16px',
  cellGap: '3px',
  cellBorderRadius: '6px',
  monthBorderRadius: '8px',
  legendGap: '32px',
  legendItemGap: '8px',
  legendIndicatorSize: '24px'
} as const;