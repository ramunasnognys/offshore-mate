import { RotationConfig, RotationPattern, MonthData, CalendarDay } from '@/types/rotation';
import { addDays, startOfMonth, endOfMonth, format, getDay, differenceInDays, isSameDay, addMonths } from 'date-fns';

export const rotationConfigs: Record<RotationPattern, RotationConfig> = {
  '14/14': { workDays: 14, offDays: 14, label: '14/14 Rotation', value: '14/14', description: '14 days on, 14 days off' },
  '14/21': { workDays: 14, offDays: 21, label: '14/21 Rotation', value: '14/21', description: '14 days on, 21 days off' },
  '28/28': { workDays: 28, offDays: 28, label: '28/28 Rotation', value: '28/28', description: '28 days on, 28 days off' },
  'Custom': { workDays: 0, offDays: 0, label: 'Custom Rotation', value: 'Custom', description: 'Set your own rotation' },
};

/**
 * Helper function to calculate the dynamic adjustment for weekly-based patterns
 * Returns the adjusted work and off days to maintain same start/end weekday
 */
export function calculateWeekdayAdjustment(
  startDate: Date,
  workDays: number,
  offDays: number
): { adjustedWorkDays: number; adjustedOffDays: number } {
  const totalCycleDays = workDays + offDays;
  
  // Only apply adjustment for weekly-based cycles
  if (totalCycleDays % 7 !== 0) {
    return { adjustedWorkDays: workDays, adjustedOffDays: offDays };
  }
  
  const startDayOfWeek = getDay(startDate); // 0=Sun, 1=Mon, etc.
  
  // Calculate the nominal end date (last day of work period)
  const nominalEndDate = addDays(startDate, workDays - 1);
  const nominalEndDayOfWeek = getDay(nominalEndDate);
  
  // Calculate adjustment needed to make end day match start day
  const adjustment = (startDayOfWeek - nominalEndDayOfWeek + 7) % 7;
  
  // Adjust work and off days while keeping total cycle constant
  return {
    adjustedWorkDays: workDays + adjustment,
    adjustedOffDays: offDays - adjustment
  };
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
  const config = pattern === 'Custom' && customRotation 
    ? { ...rotationConfigs[pattern], workDays: customRotation.workDays, offDays: customRotation.offDays }
    : rotationConfigs[pattern];
  
  // Use the user's selected start date directly (no normalization)
  const effectiveStartDate = new Date(startDate);
  
  // Apply weekday adjustment for weekly-based patterns
  const { adjustedWorkDays, adjustedOffDays } = calculateWeekdayAdjustment(
    effectiveStartDate,
    config.workDays,
    config.offDays
  );
  
  let currentDate = new Date(effectiveStartDate);
  // Use addMonths for accurate month calculation
  const endDate = addMonths(effectiveStartDate, months);
  
  // Calculate all work periods and transition dates
  const workPeriods: { start: Date; end: Date }[] = [];
  const transitionDates: Date[] = [];
  let periodStart = new Date(effectiveStartDate);
  
  while (periodStart < endDate) {
    // Calculate end of current work period (inclusive) using adjusted days
    const periodEnd = addDays(periodStart, adjustedWorkDays - 1);
    
    // Store work period
    workPeriods.push({
      start: new Date(periodStart),
      end: new Date(periodEnd)
    });
    
    // Add transition dates (first day of work and last day of work)
    transitionDates.push(new Date(periodStart)); // First day of work period (crew flies out)
    transitionDates.push(new Date(periodEnd));   // Last day of work period (crew flies home)
    
    // Move to next period start using adjusted days
    periodStart = addDays(periodEnd, adjustedOffDays + 1);
  }
  
  // Track generated months to ensure we don't exceed the limit
  let monthsGenerated = 0;
  
  while (currentDate < endDate && monthsGenerated < months) {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const days: CalendarDay[] = [];
    
    let dayPointer = monthStart;
    while (dayPointer <= monthEnd) {
      const daysSinceStart = differenceInDays(dayPointer, effectiveStartDate);
      
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