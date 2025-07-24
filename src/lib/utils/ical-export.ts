'use client';

import { MonthData } from '@/types/rotation';

interface ICalExportOptions {
  calendar: MonthData[];
  scheduleName: string;
  rotationPattern: string;
  startDate: string;
}

interface WorkPeriod {
  start: Date;
  end: Date;
  type: 'work' | 'off';
  totalDays: number;
  hasStartTravel: boolean;
  hasEndTravel: boolean;
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
    
    // Convert MonthData to work/off periods
    const periods = extractWorkPeriods(options.calendar);
    
    // Create events for each period
    periods.forEach(period => {
      const summary = `${options.scheduleName} (${period.type === 'work' ? 'Work' : 'Off Duty'})`;
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
 * Extracts continuous work/off periods from the calendar data
 */
function extractWorkPeriods(calendar: MonthData[]): WorkPeriod[] {
  const periods: WorkPeriod[] = [];
  let currentPeriod: WorkPeriod | null = null;
  
  // Flatten all days from all months
  const allDays = calendar.flatMap(month => month.days);
  
  for (const day of allDays) {
    // Skip days not in rotation
    if (!day.isInRotation) continue;
    
    const isWork = day.isWorkDay || day.isTransitionDay;
    const dayDate = new Date(day.date);
    
    // Start of a new period
    if (!currentPeriod || (currentPeriod.type === 'work') !== isWork) {
      // Save the previous period if it exists
      if (currentPeriod) {
        // End date should be the day after the last day for all-day events
        const endDate = new Date(currentPeriod.end);
        endDate.setDate(endDate.getDate() + 1);
        currentPeriod.end = endDate;
        periods.push(currentPeriod);
      }
      
      // Start new period
      currentPeriod = {
        start: dayDate,
        end: dayDate,
        type: isWork ? 'work' : 'off',
        totalDays: 1,
        hasStartTravel: day.isTransitionDay,
        hasEndTravel: false
      };
    } else {
      // Continue current period
      currentPeriod.end = dayDate;
      currentPeriod.totalDays++;
      
      // Check if this is the last day of work period with travel
      if (day.isTransitionDay && currentPeriod.type === 'work') {
        currentPeriod.hasEndTravel = true;
      }
    }
  }
  
  // Don't forget the last period
  if (currentPeriod) {
    // End date should be the day after the last day for all-day events
    const endDate = new Date(currentPeriod.end);
    endDate.setDate(endDate.getDate() + 1);
    currentPeriod.end = endDate;
    periods.push(currentPeriod);
  }
  
  return periods;
}

/**
 * Generates description text for calendar events including travel information
 */
function generateEventDescription(period: WorkPeriod): string {
  const lines: string[] = [];
  
  if (period.type === 'work') {
    lines.push(`Work rotation period (${period.totalDays} days)`);
    
    if (period.hasStartTravel) {
      lines.push('First day includes travel to location');
    }
    
    if (period.hasEndTravel) {
      lines.push('Last day includes travel home');
    }
  } else {
    lines.push(`Off duty period (${period.totalDays} days)`);
  }
  
  return lines.join('\n');
}