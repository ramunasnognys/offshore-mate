import { RotationConfig, RotationPattern, MonthData, CalendarDay } from '@/types/rotation';
import { addDays, startOfMonth, endOfMonth, format, getDay, differenceInDays, isSameDay, addWeeks } from 'date-fns';

export const rotationConfigs: Record<RotationPattern, RotationConfig> = {
  '14/14': { workDays: 15, offDays: 13, label: '14/14 Rotation', value: '14/14' },
  '14/21': { workDays: 15, offDays: 20, label: '14/21 Rotation', value: '14/21' },
  '21/21': { workDays: 22, offDays: 20, label: '21/21 Rotation', value: '21/21' },
  '28/28': { workDays: 29, offDays: 27, label: '28/28 Rotation', value: '28/28' },
};

function convertToMondayBasedDay(day: number): number {
  return day === 0 ? 7 : day;
}

export function generateRotationCalendar(
  startDate: Date,
  pattern: RotationPattern,
  months: number = 12
): MonthData[] {
  const monthData: MonthData[] = [];
  const config = rotationConfigs[pattern];
  
  let currentDate = new Date(startDate);
  const endDate = addDays(currentDate, months * 31);
  
  // Calculate all work periods and transition dates
  const workPeriods: { start: Date; end: Date }[] = [];
  const transitionDates: Date[] = [];
  let periodStart = new Date(startDate);
  
  while (periodStart < endDate) {
    // Calculate end of current work period
    const periodEnd = addWeeks(periodStart, Math.floor((config.workDays - 1) / 7));
    
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
  
  while (currentDate < endDate) {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const days: CalendarDay[] = [];
    
    let dayPointer = monthStart;
    while (dayPointer <= monthEnd) {
      const daysSinceStart = differenceInDays(dayPointer, startDate);
      
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
    
    currentDate = addDays(monthEnd, 1);
  }
  
  return monthData;
}