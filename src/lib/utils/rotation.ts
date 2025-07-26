import { RotationConfig, RotationPattern, MonthData, CalendarDay } from '@/types/rotation';
import { addDays, startOfMonth, endOfMonth, format, getDay, differenceInDays, isSameDay, addMonths } from 'date-fns';

export const rotationConfigs: Record<RotationPattern, RotationConfig> = {
  '14/14': { workDays: 15, offDays: 13, label: '14/14 Rotation', value: '14/14' },
  '14/21': { workDays: 15, offDays: 20, label: '14/21 Rotation', value: '14/21' },
  '21/21': { workDays: 22, offDays: 20, label: '21/21 Rotation', value: '21/21' },
  '28/28': { workDays: 29, offDays: 27, label: '28/28 Rotation', value: '28/28' },
  'Other': { workDays: 0, offDays: 0, label: 'Custom Rotation', value: 'Other' },
};

export function normalizeToPrecedingTuesday(date: Date): Date {
  const normalizedDate = new Date(date);
  const dayOfWeek = normalizedDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  
  // Calculate days to subtract to get to the preceding Tuesday
  // If it's already Tuesday (2), use it. Otherwise, go back to the previous Tuesday
  let daysToSubtract = 0;
  
  if (dayOfWeek === 2) {
    // It's Tuesday, use it
    daysToSubtract = 0;
  } else if (dayOfWeek > 2) {
    // Wed(3) through Sat(6): go back to Tuesday of this week
    daysToSubtract = dayOfWeek - 2;
  } else {
    // Sun(0) or Mon(1): go back to Tuesday of previous week
    daysToSubtract = dayOfWeek + 5;
  }
  
  return addDays(normalizedDate, -daysToSubtract);
}

function convertToMondayBasedDay(day: number): number {
  return day === 0 ? 7 : day;
}

export function generateRotationCalendar(
  startDate: Date,
  pattern: RotationPattern,
  months: number = 12,
  customRotation?: { workDays: number; offDays: number }
): MonthData[] {
  const monthData: MonthData[] = [];
  const config = pattern === 'Other' && customRotation 
    ? { ...rotationConfigs[pattern], workDays: customRotation.workDays + 1, offDays: customRotation.offDays - 1 }
    : rotationConfigs[pattern];
  
  // Normalize the start date to the preceding Tuesday
  const normalizedStartDate = normalizeToPrecedingTuesday(startDate);
  
  let currentDate = new Date(normalizedStartDate);
  // Use addMonths for accurate month calculation
  const endDate = addMonths(normalizedStartDate, months);
  
  // Calculate all work periods and transition dates
  const workPeriods: { start: Date; end: Date }[] = [];
  const transitionDates: Date[] = [];
  let periodStart = new Date(normalizedStartDate);
  
  while (periodStart < endDate) {
    // Calculate end of current work period (inclusive)
    const periodEnd = addDays(periodStart, config.workDays - 1);
    
    // Store work period
    workPeriods.push({
      start: new Date(periodStart),
      end: new Date(periodEnd)
    });
    
    // Add transition dates
    transitionDates.push(new Date(periodStart)); // Start transition
    transitionDates.push(new Date(periodEnd));   // End transition
    
    // Move to next period start
    periodStart = addDays(periodEnd, config.offDays + 1);
  }
  
  // Track generated months to ensure we don't exceed the limit
  let monthsGenerated = 0;
  
  while (currentDate < endDate && monthsGenerated < months) {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const days: CalendarDay[] = [];
    
    let dayPointer = monthStart;
    while (dayPointer <= monthEnd) {
      const daysSinceStart = differenceInDays(dayPointer, normalizedStartDate);
      
      if (daysSinceStart < 0) {
        days.push({
          date: new Date(dayPointer),
          isWorkDay: false,
          isInRotation: false,
          isTransitionDay: false
        });
      } else {
        // Check if the current day falls within any work period
        const isInWorkPeriod = workPeriods.some(period => 
          (dayPointer >= period.start && dayPointer <= period.end)
        );
        
        // Check if it's a transition day
        const isTransitionDay = transitionDates.some(date => 
          isSameDay(dayPointer, date)
        );
        
        days.push({
          date: new Date(dayPointer),
          isWorkDay: isInWorkPeriod,
          isInRotation: true,
          isTransitionDay
        });
      }
      
      dayPointer = addDays(dayPointer, 1);
    }
    
    const sundayBasedFirstDay = getDay(monthStart);
    const mondayBasedFirstDay = convertToMondayBasedDay(sundayBasedFirstDay);
    
    monthData.push({
      month: format(monthStart, 'MMMM'),
      year: monthStart.getFullYear(),
      days,
      firstDayOfWeek: mondayBasedFirstDay
    });
    
    monthsGenerated++;
    currentDate = addDays(monthEnd, 1);
  }
  
  return monthData;
}