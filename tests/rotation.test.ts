import { test, expect } from '@playwright/test';
import { 
  generateRotationCalendar, 
  calculateWeekdayAdjustment,
  rotationConfigs 
} from '../src/lib/utils/rotation';
import { RotationPattern, MonthData, CalendarDay } from '../src/types/rotation';
import { addDays, format, startOfMonth, endOfMonth, isSameDay } from 'date-fns';

test.describe('Calendar Generation Unit Tests', () => {
  test.describe('calculateWeekdayAdjustment', () => {
    test('should apply adjustment for 14/14 starting on Tuesday', () => {
      // Tuesday, January 2, 2024
      const tuesday = new Date(2024, 0, 2);
      const { adjustedWorkDays, adjustedOffDays } = calculateWeekdayAdjustment(tuesday, 14, 14);
      expect(adjustedWorkDays).toBe(15); // +1 day adjustment to end on Tuesday
      expect(adjustedOffDays).toBe(13); // -1 day adjustment
      expect(adjustedWorkDays + adjustedOffDays).toBe(28); // Total cycle unchanged
    });

    test('should adjust 14/21 pattern starting on Wednesday', () => {
      // Wednesday, January 3, 2024
      const wednesday = new Date(2024, 0, 3);
      const { adjustedWorkDays, adjustedOffDays } = calculateWeekdayAdjustment(wednesday, 14, 21);
      expect(adjustedWorkDays).toBe(15); // +1 day adjustment
      expect(adjustedOffDays).toBe(20); // -1 day adjustment
      expect(adjustedWorkDays + adjustedOffDays).toBe(35); // Total cycle unchanged
    });

    test('should adjust 28/28 pattern starting on Friday', () => {
      // Friday, January 5, 2024
      const friday = new Date(2024, 0, 5);
      const { adjustedWorkDays, adjustedOffDays } = calculateWeekdayAdjustment(friday, 28, 28);
      expect(adjustedWorkDays).toBe(29); // +1 day adjustment
      expect(adjustedOffDays).toBe(27); // -1 day adjustment
      expect(adjustedWorkDays + adjustedOffDays).toBe(56); // Total cycle unchanged
    });

    test('should not adjust non-weekly patterns like 10/10', () => {
      // Any day for non-weekly pattern
      const anyDay = new Date(2024, 0, 10);
      const { adjustedWorkDays, adjustedOffDays } = calculateWeekdayAdjustment(anyDay, 10, 10);
      expect(adjustedWorkDays).toBe(10); // No adjustment
      expect(adjustedOffDays).toBe(10); // No adjustment
    });

    test('should handle Sunday start for 14/14 pattern', () => {
      // Sunday, January 7, 2024
      const sunday = new Date(2024, 0, 7);
      const { adjustedWorkDays, adjustedOffDays } = calculateWeekdayAdjustment(sunday, 14, 14);
      expect(adjustedWorkDays).toBe(15); // +1 day adjustment to end on Sunday
      expect(adjustedOffDays).toBe(13); // -1 day adjustment
    });
    
    test('should not adjust when no adjustment needed for 14/14', () => {
      // Monday, January 1, 2024 (14 days later is Sunday, so no adjustment for Monday start)
      const monday = new Date(2024, 0, 1);
      const { adjustedWorkDays, adjustedOffDays } = calculateWeekdayAdjustment(monday, 14, 14);
      expect(adjustedWorkDays).toBe(14); // No adjustment needed
      expect(adjustedOffDays).toBe(14); // No adjustment needed
    });
  });

  test.describe('generateRotationCalendar - 14/14 Pattern', () => {
    test('should generate correct calendar for 14/14 pattern', () => {
      const startDate = new Date(2024, 0, 2); // Tuesday, January 2, 2024
      const months = 3;
      const pattern: RotationPattern = '14/14';
      
      const result = generateRotationCalendar(startDate, pattern, months);
      
      expect(result).toHaveLength(3);
      expect(result[0].month).toBe('January');
      expect(result[0].year).toBe(2024);
      expect(result[1].month).toBe('February');
      expect(result[2].month).toBe('March');
    });

    test('should have correct work/off cycle for 14/14 pattern starting Tuesday', () => {
      const startDate = new Date(2024, 0, 2); // Tuesday, January 2, 2024
      const pattern: RotationPattern = '14/14';
      
      const result = generateRotationCalendar(startDate, pattern, 2);
      const januaryDays = result[0].days;
      
      // First 14 days should be work days (no adjustment for Tuesday start)
      const workDays = januaryDays.filter(day => day.isWorkDay && day.isInRotation);
      const offDays = januaryDays.filter(day => !day.isWorkDay && day.isInRotation);
      
      expect(workDays.length).toBeGreaterThan(0);
      expect(offDays.length).toBeGreaterThan(0);
      
      // Check specific dates
      const jan2 = januaryDays.find(day => day.date.getDate() === 2);
      const jan15 = januaryDays.find(day => day.date.getDate() === 15);
      const jan16 = januaryDays.find(day => day.date.getDate() === 16);
      
      expect(jan2?.isWorkDay).toBe(true);  // Start of work period
      expect(jan15?.isWorkDay).toBe(true); // Last day of work period
      expect(jan16?.isWorkDay).toBe(false); // First day off
    });
    
    test('should apply weekday adjustment for 14/21 pattern starting Wednesday', () => {
      const startDate = new Date(2024, 0, 3); // Wednesday, January 3, 2024  
      const pattern: RotationPattern = '14/21';
      
      const result = generateRotationCalendar(startDate, pattern, 2);
      const januaryDays = result[0].days;
      const februaryDays = result[1].days;
      
      // Should be 15 work days (14 + 1 adjustment)
      const jan3 = januaryDays.find(day => day.date.getDate() === 3);
      const jan17 = januaryDays.find(day => day.date.getDate() === 17);
      const jan18 = januaryDays.find(day => day.date.getDate() === 18);
      
      expect(jan3?.isWorkDay).toBe(true);   // Start of work (Wednesday)
      expect(jan17?.isWorkDay).toBe(true);  // Still working (15th day, Wednesday)
      expect(jan18?.isWorkDay).toBe(false); // First day off (Thursday)
      
      // Verify the end day is also Wednesday
      const jan17Date = new Date(2024, 0, 17);
      expect(jan17Date.getDay()).toBe(3); // Wednesday
    });

    test('should mark transition days correctly', () => {
      const startDate = new Date(2024, 0, 2); // Tuesday, January 2, 2024
      const pattern: RotationPattern = '14/14';
      
      const result = generateRotationCalendar(startDate, pattern, 1);
      const januaryDays = result[0].days;
      
      // Find transition days
      const transitionDays = januaryDays.filter(day => day.isTransitionDay);
      expect(transitionDays.length).toBeGreaterThan(0);
      
      // First day of work and first day off should be marked as transition days
      const jan2 = januaryDays.find(day => day.date.getDate() === 2);
      const jan16 = januaryDays.find(day => day.date.getDate() === 16);
      
      expect(jan2?.isTransitionDay).toBe(true);  // First day of work
      expect(jan16?.isTransitionDay).toBe(true); // First day off
    });
  });

  test.describe('generateRotationCalendar - Custom Pattern', () => {
    test('should NOT adjust custom patterns like 10/10', () => {
      const startDate = new Date(2024, 0, 3); // Wednesday, January 3, 2024
      const pattern: RotationPattern = 'Custom';
      const customRotation = { workDays: 10, offDays: 10 };
      
      const result = generateRotationCalendar(startDate, pattern, 2, customRotation);
      const januaryDays = result[0].days;
      
      // Should be exactly 10 work days with no adjustment
      const jan3 = januaryDays.find(day => day.date.getDate() === 3);
      const jan12 = januaryDays.find(day => day.date.getDate() === 12);
      const jan13 = januaryDays.find(day => day.date.getDate() === 13);
      
      expect(jan3?.isWorkDay).toBe(true);   // Start of work (Wednesday)
      expect(jan12?.isWorkDay).toBe(true);  // 10th day of work (Friday)
      expect(jan13?.isWorkDay).toBe(false); // First day off (Saturday)
      
      // Verify no weekday adjustment was applied
      const jan12Date = new Date(2024, 0, 12);
      expect(jan12Date.getDay()).toBe(5); // Friday, not Wednesday
    });
  });

  test.describe('generateRotationCalendar - 14/21 Pattern', () => {
    test('should generate correct calendar for 14/21 pattern', () => {
      const startDate = new Date(2024, 0, 2);
      const pattern: RotationPattern = '14/21';
      
      const result = generateRotationCalendar(startDate, pattern, 2);
      
      expect(result).toHaveLength(2);
      
      // Check work/off ratio is different from 14/14
      const allDays = result.flatMap(month => month.days);
      const workDays = allDays.filter(day => day.isWorkDay && day.isInRotation);
      const offDays = allDays.filter(day => !day.isWorkDay && day.isInRotation);
      
      expect(workDays.length).toBeGreaterThan(0);
      expect(offDays.length).toBeGreaterThan(workDays.length); // 21 off > 14 work
    });
  });

  test.describe('generateRotationCalendar - 28/28 Pattern', () => {
    test('should generate correct calendar for 28/28 pattern', () => {
      const startDate = new Date(2024, 0, 2);
      const pattern: RotationPattern = '28/28';
      
      const result = generateRotationCalendar(startDate, pattern, 3);
      
      expect(result).toHaveLength(3);
      
      // Check longer work periods
      const allDays = result.flatMap(month => month.days);
      const inRotationDays = allDays.filter(day => day.isInRotation);
      const workDays = inRotationDays.filter(day => day.isWorkDay);
      
      expect(workDays.length).toBeGreaterThan(0);
    });
  });

  test.describe('generateRotationCalendar - Custom Pattern', () => {
    test('should generate correct calendar for custom pattern', () => {
      const startDate = new Date(2024, 0, 2);
      const pattern: RotationPattern = 'Custom';
      const customRotation = { workDays: 10, offDays: 20 };
      
      const result = generateRotationCalendar(startDate, pattern, 2, customRotation);
      
      expect(result).toHaveLength(2);
      
      const allDays = result.flatMap(month => month.days);
      const workDays = allDays.filter(day => day.isWorkDay && day.isInRotation);
      const offDays = allDays.filter(day => !day.isWorkDay && day.isInRotation);
      
      expect(workDays.length).toBeGreaterThan(0);
      expect(offDays.length).toBeGreaterThan(workDays.length); // 20 off > 10 work
    });

    test('should handle custom pattern without custom rotation config', () => {
      const startDate = new Date(2024, 0, 2);
      const pattern: RotationPattern = 'Custom';
      
      const result = generateRotationCalendar(startDate, pattern, 1);
      
      expect(result).toHaveLength(1);
      // Should use default config values (0 work days, 0 off days)
    });
  });

  test.describe('Edge Cases', () => {
    test('should handle leap year correctly', () => {
      const startDate = new Date(2024, 1, 27); // February 27, 2024 (leap year)
      const pattern: RotationPattern = '14/14';
      
      const result = generateRotationCalendar(startDate, pattern, 1);
      const februaryDays = result[0].days;
      
      // February 2024 should have 29 days
      expect(februaryDays).toHaveLength(29);
      
      // Check that February 29 exists
      const feb29 = februaryDays.find(day => day.date.getDate() === 29);
      expect(feb29).toBeDefined();
      expect(feb29?.date.getMonth()).toBe(1); // February
    });

    test('should handle non-leap year correctly', () => {
      const startDate = new Date(2023, 1, 27); // February 27, 2023 (non-leap year)
      const pattern: RotationPattern = '14/14';
      
      const result = generateRotationCalendar(startDate, pattern, 1);
      const februaryDays = result[0].days;
      
      // February 2023 should have 28 days
      expect(februaryDays).toHaveLength(28);
      
      // Check that February 29 does not exist
      const feb29 = februaryDays.find(day => day.date.getDate() === 29);
      expect(feb29).toBeUndefined();
    });

    test('should handle year boundary correctly', () => {
      const startDate = new Date(2023, 11, 5); // December 5, 2023
      const pattern: RotationPattern = '14/14';
      
      const result = generateRotationCalendar(startDate, pattern, 2);
      
      expect(result).toHaveLength(2);
      expect(result[0].month).toBe('December');
      expect(result[0].year).toBe(2023);
      expect(result[1].month).toBe('January');
      expect(result[1].year).toBe(2024);
    });

    test('should generate correct number of months when requested', () => {
      const startDate = new Date(2024, 0, 2);
      const pattern: RotationPattern = '14/14';
      
      // Test different month counts
      const result1 = generateRotationCalendar(startDate, pattern, 1);
      const result6 = generateRotationCalendar(startDate, pattern, 6);
      const result12 = generateRotationCalendar(startDate, pattern, 12);
      
      expect(result1).toHaveLength(1);
      expect(result6).toHaveLength(6);
      expect(result12).toHaveLength(12);
    });

    test('should handle start date before rotation begins', () => {
      const startDate = new Date(2024, 0, 5); // Friday, will normalize to Tuesday Jan 2
      const pattern: RotationPattern = '14/14';
      
      const result = generateRotationCalendar(startDate, pattern, 1);
      const januaryDays = result[0].days;
      
      // Days before January 2 should not be in rotation
      const jan1 = januaryDays.find(day => day.date.getDate() === 1);
      expect(jan1?.isInRotation).toBe(false);
      
      // January 2 should be in rotation (start day)
      const jan2 = januaryDays.find(day => day.date.getDate() === 2);
      expect(jan2?.isInRotation).toBe(true);
    });

    test('should maintain consistency across different start dates', () => {
      const pattern: RotationPattern = '14/14';
      
      // Test different start dates that should normalize to the same Tuesday
      const startDates = [
        new Date(2024, 0, 2), // Tuesday
        new Date(2024, 0, 3), // Wednesday  
        new Date(2024, 0, 4), // Thursday
        new Date(2024, 0, 5), // Friday
        new Date(2024, 0, 6), // Saturday
        new Date(2024, 0, 7), // Sunday
        new Date(2024, 0, 8), // Monday
      ];
      
      const results = startDates.map(date => 
        generateRotationCalendar(date, pattern, 1)
      );
      
      // All results should have the same work/off pattern
      const firstResult = results[0];
      results.forEach((result, index) => {
        expect(result[0].days.length).toBe(firstResult[0].days.length);
        
        // Check that work days align
        result[0].days.forEach((day, dayIndex) => {
          const firstDay = firstResult[0].days[dayIndex];
          expect(day.isWorkDay).toBe(firstDay.isWorkDay);
          expect(day.isInRotation).toBe(firstDay.isInRotation);
        });
      });
    });
  });

  test.describe('Calendar Data Structure Validation', () => {
    test('should return valid month data structure', () => {
      const startDate = new Date(2024, 0, 2);
      const pattern: RotationPattern = '14/14';
      
      const result = generateRotationCalendar(startDate, pattern, 1);
      
      expect(result).toHaveLength(1);
      
      const monthData = result[0];
      expect(monthData.month).toBe('January');
      expect(monthData.year).toBe(2024);
      expect(monthData.firstDayOfWeek).toBeGreaterThanOrEqual(1);
      expect(monthData.firstDayOfWeek).toBeLessThanOrEqual(7);
      expect(Array.isArray(monthData.days)).toBe(true);
    });

    test('should return valid calendar day structure', () => {
      const startDate = new Date(2024, 0, 2);
      const pattern: RotationPattern = '14/14';
      
      const result = generateRotationCalendar(startDate, pattern, 1);
      const day = result[0].days[0];
      
      expect(day.date instanceof Date).toBe(true);
      expect(typeof day.isWorkDay).toBe('boolean');
      expect(typeof day.isInRotation).toBe('boolean');
      expect(typeof day.isTransitionDay).toBe('boolean');
    });

    test('should have correct number of days for each month', () => {
      const startDate = new Date(2024, 0, 2);
      const pattern: RotationPattern = '14/14';
      
      const result = generateRotationCalendar(startDate, pattern, 12);
      
      // Check that each month has the correct number of days
      const expectedDaysPerMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; // 2024 is leap year
      
      result.forEach((monthData, index) => {
        expect(monthData.days).toHaveLength(expectedDaysPerMonth[index]);
      });
    });

    test('should have sequential dates within each month', () => {
      const startDate = new Date(2024, 0, 2);
      const pattern: RotationPattern = '14/14';
      
      const result = generateRotationCalendar(startDate, pattern, 2);
      
      result.forEach(monthData => {
        for (let i = 1; i < monthData.days.length; i++) {
          const prevDay = monthData.days[i - 1].date;
          const currentDay = monthData.days[i].date;
          
          expect(currentDay.getTime()).toBe(addDays(prevDay, 1).getTime());
        }
      });
    });
  });

  test.describe('Rotation Configuration Validation', () => {
    test('should use correct rotation configs', () => {
      expect(rotationConfigs['14/14'].workDays).toBe(14);
      expect(rotationConfigs['14/14'].offDays).toBe(14);
      
      expect(rotationConfigs['14/21'].workDays).toBe(14);
      expect(rotationConfigs['14/21'].offDays).toBe(21);
      
      expect(rotationConfigs['28/28'].workDays).toBe(28);
      expect(rotationConfigs['28/28'].offDays).toBe(28);
      
      expect(rotationConfigs['Custom'].workDays).toBe(0);
      expect(rotationConfigs['Custom'].offDays).toBe(0);
    });

    test('should handle all defined rotation patterns', () => {
      const startDate = new Date(2024, 0, 2);
      const patterns: RotationPattern[] = ['14/14', '14/21', '28/28'];
      
      patterns.forEach(pattern => {
        const result = generateRotationCalendar(startDate, pattern, 1);
        expect(result).toHaveLength(1);
        expect(result[0].days.length).toBeGreaterThan(0);
      });
    });
  });
});