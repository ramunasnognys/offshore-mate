'use client';

import { MonthData, RotationPattern } from '@/types/rotation';
import { format, addDays } from 'date-fns';
import { rotationConfigs, normalizeToPrecedingTuesday } from './rotation';

interface ICalExportOptions {
  calendar: MonthData[];
  scheduleName: string;
  rotationPattern: RotationPattern;
  startDate: string;
}

interface WorkPeriod {
  start: Date;
  end: Date;
  type: 'work' | 'off';
  totalDays: number;
  hasStartTravel: boolean;
  hasEndTravel: boolean;
  rotationStart?: Date;
  rotationEnd?: Date;
  actualWorkEnd?: Date;
}

/**
 * Exports the calendar as an iCalendar (.ics) file
 * Creates multi-day all-day events for work and off periods
 */
export async function exportCalendarAsICS(options: ICalExportOptions): Promise<void> {
  try {
    console.log('Starting iCalendar export...');
    
    // Import dynamically for client-side only
    const ical = (await import('ical-generator')).default;
    
    // Create calendar with metadata
    const calendar = ical({
      name: `${options.scheduleName} - Work Schedule`,
      description: `Rotation pattern: ${options.rotationPattern}`,
      timezone: null  // Floating time for universal compatibility
    });
    
    // Convert MonthData to work/off periods using rotation boundaries
    const periods = extractWorkPeriods(options.calendar, options.rotationPattern, options.startDate);
    
    // Create events for each work period
    periods.forEach(period => {
      // Format dates for the title: show the visual work period (first day to last work day)
      // For 14/21 rotation: Tuesday (incl. travel) to Monday (last actual work day, excl. final travel day)
      const titleStartDate = period.start; // First day (includes initial travel day)
      const titleEndDate = new Date(period.end.getTime() - 24 * 60 * 60 * 1000); // Last work day (excludes iCal +1 day and final travel day)
      
      const startFormatted = format(titleStartDate, 'MMM d');
      const endFormatted = format(titleEndDate, 'MMM d');
      const summary = `🛠️ (${startFormatted} -> ${endFormatted})`;
      
      const description = generateEventDescription(period);
      
      calendar.createEvent({
        start: period.start,
        end: period.end,
        allDay: true,
        summary,
        description,
        // No location or alarms for V1
      });
    });
    
    // Generate .ics content
    const icsContent = calendar.toString();
    
    // Create download link following existing pattern
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // Sanitize filename
    const safeName = options.scheduleName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    link.download = `schedule-${safeName}-${options.startDate}.ics`;
    link.href = url;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log('iCalendar export completed successfully');
  } catch (error) {
    console.error('Calendar export failed:', error);
    throw new Error('Failed to create calendar file');
  }
}

/**
 * Extracts work periods based on rotation cycles (Tuesday-to-Tuesday boundaries)
 * Uses the same logic as the rotation calculation to ensure proper alignment
 */
function extractWorkPeriods(calendar: MonthData[], rotationPattern: RotationPattern, startDateStr: string): WorkPeriod[] {
  const config = rotationConfigs[rotationPattern];
  
  // Handle custom rotation by defaulting to 14/14 if Other is selected
  if (rotationPattern === 'Other') {
    console.warn('Custom rotation not supported for calendar export, using 14/14 pattern');
    const defaultConfig = rotationConfigs['14/14'];
    return extractWorkPeriodsWithConfig(calendar, defaultConfig, startDateStr);
  }
  
  return extractWorkPeriodsWithConfig(calendar, config, startDateStr);
}

/**
 * Extracts work periods using the specified rotation configuration
 */
function extractWorkPeriodsWithConfig(calendar: MonthData[], config: { workDays: number; offDays: number }, startDateStr: string): WorkPeriod[] {
  const periods: WorkPeriod[] = [];
  const startDate = new Date(startDateStr);
  
  // Normalize the start date to the preceding Tuesday (same as rotation calculation)
  const normalizedStartDate = normalizeToPrecedingTuesday(startDate);
  
  // Flatten all days to find the date range
  const allDays = calendar.flatMap(month => month.days);
  if (allDays.length === 0) return periods;
  
  const firstDay = new Date(allDays[0].date);
  const lastDay = new Date(allDays[allDays.length - 1].date);
  
  // Calculate work periods starting from normalized start date
  let periodStart = new Date(normalizedStartDate);
  let periodIndex = 0;
  
  while (periodStart <= lastDay) {
    // Calculate end of current work period (inclusive)
    const periodEnd = addDays(periodStart, config.workDays - 1);
    
    // Check if this period overlaps with our calendar data
    if (periodEnd >= firstDay && periodStart <= lastDay) {
      // Find the actual work days in this period from the calendar
      const workDaysInPeriod = allDays.filter(day => {
        const dayDate = new Date(day.date);
        return day.isInRotation && 
               (day.isWorkDay || day.isTransitionDay) &&
               dayDate >= periodStart && 
               dayDate <= periodEnd;
      });
      
      if (workDaysInPeriod.length > 0) {
        const actualStartDate = new Date(workDaysInPeriod[0].date);
        const actualEndDate = new Date(workDaysInPeriod[workDaysInPeriod.length - 1].date);
        
        // For iCal all-day events, end date should be the next day after the last day
        const icalEndDate = addDays(actualEndDate, 1);
        
        // Check for travel days
        const hasStartTravel = workDaysInPeriod[0].isTransitionDay;
        const hasEndTravel = workDaysInPeriod[workDaysInPeriod.length - 1].isTransitionDay;
        
        periods.push({
          start: actualStartDate,
          end: icalEndDate,
          type: 'work',
          totalDays: workDaysInPeriod.length,
          hasStartTravel,
          hasEndTravel,
          // Store the calculated rotation period boundaries and actual work end for title generation
          rotationStart: new Date(periodStart),
          rotationEnd: new Date(periodEnd),
          actualWorkEnd: new Date(actualEndDate)
        });
      }
    }
    
    // Move to next period start (same calculation as rotation.ts)
    periodStart = addDays(periodEnd, config.offDays + 1);
    periodIndex++;
  }
  
  return periods;
}

/**
 * Generates description text for work period events including travel information
 */
function generateEventDescription(period: WorkPeriod): string {
  const lines: string[] = [];
  
  lines.push(`Work rotation period (${period.totalDays} days)`);
  
  if (period.hasStartTravel) {
    lines.push('First day includes travel to location');
  }
  
  if (period.hasEndTravel) {
    lines.push('Last day includes travel home');
  }
  
  return lines.join('\n');
}