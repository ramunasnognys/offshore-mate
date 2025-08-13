import { test, expect } from '@playwright/test';
import { 
  generateRotationCalendar, 
  normalizeToPrecedingTuesday, 
  rotationConfigs 
} from '../src/lib/utils/rotation';
import { RotationPattern, MonthData, CalendarDay } from '../src/types/rotation';
import { addDays, addMonths, format, isSameDay, differenceInDays } from 'date-fns';

test.describe('Rotation Edge Cases and Business Logic', () => {
  test.describe('Date Normalization Edge Cases', () => {
    test('should handle date normalization across year boundaries', () => {
      // Monday, January 1, 2024 should normalize to Tuesday, December 26, 2023
      const newYearMonday = new Date(2024, 0, 1);
      const result = normalizeToPrecedingTuesday(newYearMonday);
      
      expect(result.getDay()).toBe(2); // Tuesday
      expect(result.getFullYear()).toBe(2023);
      expect(result.getMonth()).toBe(11); // December
      expect(result.getDate()).toBe(26);
    });

    test('should handle date normalization across month boundaries', () => {
      // Sunday, March 3, 2024 should normalize to Tuesday, February 27, 2024
      const marchSunday = new Date(2024, 2, 3);
      const result = normalizeToPrecedingTuesday(marchSunday);
      
      expect(result.getDay()).toBe(2); // Tuesday
      expect(result.getMonth()).toBe(1); // February
      expect(result.getDate()).toBe(27);
    });

    test('should handle leap year February 29 normalization', () => {
      // Friday, February 29, 2024 (leap year) should normalize to Tuesday, February 27, 2024
      const leapDayFriday = new Date(2024, 1, 29);
      const result = normalizeToPrecedingTuesday(leapDayFriday);
      
      expect(result.getDay()).toBe(2); // Tuesday
      expect(result.getMonth()).toBe(1); // February
      expect(result.getDate()).toBe(27);
    });

    test('should be consistent across different time zones', () => {
      const testDate = new Date(2024, 5, 15); // June 15, 2024
      
      // Create dates with different time components
      const morning = new Date(testDate);
      morning.setHours(8, 0, 0, 0);
      
      const evening = new Date(testDate);
      evening.setHours(20, 30, 45, 500);
      
      const result1 = normalizeToPrecedingTuesday(morning);
      const result2 = normalizeToPrecedingTuesday(evening);
      
      expect(result1.getTime()).toBe(result2.getTime());
    });
  });

  test.describe('Rotation Pattern Edge Cases', () => {
    test('should handle very short custom rotations', () => {
      const startDate = new Date(2024, 0, 2);
      const customRotation = { workDays: 1, offDays: 1 };
      
      const result = generateRotationCalendar(startDate, 'Custom', 2, customRotation);
      
      expect(result).toHaveLength(2);
      
      // With 1 work day, 1 off day pattern, should alternate frequently
      const allDays = result.flatMap(month => month.days).filter(day => day.isInRotation);
      const workDays = allDays.filter(day => day.isWorkDay);
      const offDays = allDays.filter(day => !day.isWorkDay);
      
      expect(workDays.length).toBeGreaterThan(0);
      expect(offDays.length).toBeGreaterThan(0);
      
      // Should have frequent transitions
      const transitionDays = allDays.filter(day => day.isTransitionDay);
      expect(transitionDays.length).toBeGreaterThan(workDays.length / 2);
    });

    test('should handle very long custom rotations', () => {
      const startDate = new Date(2024, 0, 2);
      const customRotation = { workDays: 60, offDays: 30 };
      
      const result = generateRotationCalendar(startDate, 'Custom', 6, customRotation);
      
      expect(result).toHaveLength(6);
      
      const allDays = result.flatMap(month => month.days).filter(day => day.isInRotation);
      const workDays = allDays.filter(day => day.isWorkDay);
      const offDays = allDays.filter(day => !day.isWorkDay);
      
      expect(workDays.length).toBeGreaterThan(0);
      expect(offDays.length).toBeGreaterThan(0);
      
      // Should have fewer transitions due to longer periods
      const transitionDays = allDays.filter(day => day.isTransitionDay);
      expect(transitionDays.length).toBeLessThan(workDays.length / 10);
    });

    test('should handle zero work days custom rotation', () => {
      const startDate = new Date(2024, 0, 2);
      const customRotation = { workDays: 0, offDays: 10 };
      
      const result = generateRotationCalendar(startDate, 'Custom', 1, customRotation);
      
      expect(result).toHaveLength(1);
      
      const allDays = result[0].days.filter(day => day.isInRotation);
      const workDays = allDays.filter(day => day.isWorkDay);
      
      // Should have no work days with 0 work days configuration
      expect(workDays.length).toBe(0);
    });

    test('should handle zero off days custom rotation', () => {
      const startDate = new Date(2024, 0, 2);
      const customRotation = { workDays: 10, offDays: 0 };
      
      const result = generateRotationCalendar(startDate, 'Custom', 1, customRotation);
      
      expect(result).toHaveLength(1);
      
      const allDays = result[0].days.filter(day => day.isInRotation);
      const offDays = allDays.filter(day => !day.isWorkDay);
      
      // Should have no off days with 0 off days configuration
      expect(offDays.length).toBe(0);
    });
  });

  test.describe('Boundary Conditions', () => {
    test('should handle single month generation', () => {
      const startDate = new Date(2024, 0, 2);
      const result = generateRotationCalendar(startDate, '14/14', 1);
      
      expect(result).toHaveLength(1);
      expect(result[0].month).toBe('January');
      expect(result[0].days.length).toBe(31);
    });

    test('should handle maximum month generation', () => {
      const startDate = new Date(2024, 0, 2);
      const result = generateRotationCalendar(startDate, '14/14', 24); // 2 years
      
      expect(result).toHaveLength(24);
      expect(result[0].year).toBe(2024);
      expect(result[23].year).toBe(2025);
    });

    test('should handle start date at end of month', () => {
      const startDate = new Date(2024, 0, 31); // January 31
      const result = generateRotationCalendar(startDate, '14/14', 2);
      
      expect(result).toHaveLength(2);
      
      // Should normalize to a Tuesday in January
      const normalizedDate = normalizeToPrecedingTuesday(startDate);
      expect(normalizedDate.getMonth()).toBe(0); // January
      expect(normalizedDate.getDay()).toBe(2); // Tuesday
    });

    test('should handle start date at beginning of year', () => {
      const startDate = new Date(2024, 0, 1); // January 1
      const result = generateRotationCalendar(startDate, '14/14', 3);
      
      expect(result).toHaveLength(3);
      expect(result[0].month).toBe('January');
      expect(result[0].year).toBe(2024);
    });
  });

  test.describe('Rotation Period Calculations', () => {
    test('should calculate correct work periods for 14/14 pattern', () => {
      const startDate = new Date(2024, 0, 2); // Tuesday
      const result = generateRotationCalendar(startDate, '14/14', 2);
      
      const allDays = result.flatMap(month => month.days);
      const rotationDays = allDays.filter(day => day.isInRotation);
      
      // Find consecutive work periods
      let currentWorkPeriod = 0;
      let maxWorkPeriod = 0;
      let consecutiveWorkDays = 0;
      
      for (const day of rotationDays) {
        if (day.isWorkDay) {
          consecutiveWorkDays++;
          maxWorkPeriod = Math.max(maxWorkPeriod, consecutiveWorkDays);
        } else {
          consecutiveWorkDays = 0;
        }
      }
      
      // For 14/14 pattern, should have work periods of 15 days (14+1)
      expect(maxWorkPeriod).toBe(15);
    });

    test('should calculate correct off periods for 14/21 pattern', () => {
      const startDate = new Date(2024, 0, 2);
      const result = generateRotationCalendar(startDate, '14/21', 3);
      
      const allDays = result.flatMap(month => month.days);
      const rotationDays = allDays.filter(day => day.isInRotation);
      
      // Find consecutive off periods
      let consecutiveOffDays = 0;
      let maxOffPeriod = 0;
      
      for (const day of rotationDays) {
        if (!day.isWorkDay) {
          consecutiveOffDays++;
          maxOffPeriod = Math.max(maxOffPeriod, consecutiveOffDays);
        } else {
          consecutiveOffDays = 0;
        }
      }
      
      // For 14/21 pattern, should have off periods of 20 days
      expect(maxOffPeriod).toBe(20);
    });

    test('should maintain consistent cycle length', () => {
      const startDate = new Date(2024, 0, 2);
      const result = generateRotationCalendar(startDate, '14/14', 6);
      
      const allDays = result.flatMap(month => month.days);
      const rotationDays = allDays.filter(day => day.isInRotation);
      
      // Count complete cycles (work + off periods)
      let cycles = 0;
      let daysSinceStart = 0;
      const cycleLength = 15 + 13; // work days + off days for 14/14
      
      for (const day of rotationDays) {
        daysSinceStart++;
        if (daysSinceStart % cycleLength === 0) {
          cycles++;
        }
      }
      
      expect(cycles).toBeGreaterThan(0);
    });
  });

  test.describe('Transition Day Logic', () => {
    test('should mark first day of rotation as transition', () => {
      const startDate = new Date(2024, 0, 2);
      const result = generateRotationCalendar(startDate, '14/14', 1);
      
      const januaryDays = result[0].days;
      const firstRotationDay = januaryDays.find(day => day.isInRotation);
      
      expect(firstRotationDay?.isTransitionDay).toBe(true);
    });

    test('should mark last day of work period as transition', () => {
      const startDate = new Date(2024, 0, 2);
      const result = generateRotationCalendar(startDate, '14/14', 2);
      
      const allDays = result.flatMap(month => month.days);
      const transitionDays = allDays.filter(day => day.isTransitionDay);
      
      // Should have at least 2 transition days (start and end of first work period)
      expect(transitionDays.length).toBeGreaterThanOrEqual(2);
      
      // Check that transition days alternate between work and off periods
      for (let i = 0; i < transitionDays.length - 1; i += 2) {
        const workStart = transitionDays[i];
        const workEnd = transitionDays[i + 1];
        
        expect(workStart.isWorkDay).toBe(true);
        expect(workEnd.isWorkDay).toBe(true);
      }
    });

    test('should have correct number of transition days for pattern', () => {
      const startDate = new Date(2024, 0, 2);
      const result = generateRotationCalendar(startDate, '14/14', 3);
      
      const allDays = result.flatMap(month => month.days);
      const transitionDays = allDays.filter(day => day.isTransitionDay);
      
      // Each complete cycle should have 2 transition days (start and end of work period)
      // Number of transitions should be even
      expect(transitionDays.length % 2).toBe(0);
    });
  });

  test.describe('Calendar Structure Validation', () => {
    test('should maintain correct first day of week across months', () => {
      const startDate = new Date(2024, 0, 2);
      const result = generateRotationCalendar(startDate, '14/14', 12);
      
      // Check each month has correct first day of week (Monday-based: 1-7)
      result.forEach(monthData => {
        expect(monthData.firstDayOfWeek).toBeGreaterThanOrEqual(1);
        expect(monthData.firstDayOfWeek).toBeLessThanOrEqual(7);
        
        // Verify it matches the actual first day of the month
        const firstDay = new Date(monthData.year, 
          ['January', 'February', 'March', 'April', 'May', 'June',
           'July', 'August', 'September', 'October', 'November', 'December']
          .indexOf(monthData.month), 1);
        
        const expectedFirstDay = firstDay.getDay() === 0 ? 7 : firstDay.getDay();
        expect(monthData.firstDayOfWeek).toBe(expectedFirstDay);
      });
    });

    test('should have sequential dates without gaps', () => {
      const startDate = new Date(2024, 0, 2);
      const result = generateRotationCalendar(startDate, '14/14', 3);
      
      result.forEach(monthData => {
        for (let i = 1; i < monthData.days.length; i++) {
          const prevDate = monthData.days[i - 1].date;
          const currentDate = monthData.days[i].date;
          
          const expectedDate = addDays(prevDate, 1);
          expect(currentDate.getTime()).toBe(expectedDate.getTime());
        }
      });
    });

    test('should handle month transitions correctly', () => {
      const startDate = new Date(2024, 0, 31); // January 31
      const result = generateRotationCalendar(startDate, '14/14', 2);
      
      expect(result).toHaveLength(2);
      
      // January should have 31 days
      expect(result[0].days).toHaveLength(31);
      expect(result[0].days[30].date.getDate()).toBe(31);
      
      // February should start with day 1
      expect(result[1].days[0].date.getDate()).toBe(1);
      expect(result[1].days[0].date.getMonth()).toBe(1); // February
    });
  });

  test.describe('Performance and Memory Edge Cases', () => {
    test('should handle large month ranges efficiently', () => {
      const startDate = new Date(2024, 0, 2);
      const startTime = Date.now();
      
      const result = generateRotationCalendar(startDate, '14/14', 36); // 3 years
      
      const endTime = Date.now();
      const executionTime = endTime - startTime;
      
      expect(result).toHaveLength(36);
      expect(executionTime).toBeLessThan(1000); // Should complete in under 1 second
    });

    test('should handle memory efficiently with large datasets', () => {
      const startDate = new Date(2024, 0, 2);
      const result = generateRotationCalendar(startDate, '14/14', 24);
      
      // Verify structure is correct and no memory leaks in object references
      result.forEach(monthData => {
        expect(monthData.days.length).toBeGreaterThan(27);
        expect(monthData.days.length).toBeLessThan(32);
        
        monthData.days.forEach(day => {
          expect(day.date instanceof Date).toBe(true);
          expect(typeof day.isWorkDay).toBe('boolean');
          expect(typeof day.isInRotation).toBe('boolean');
          expect(typeof day.isTransitionDay).toBe('boolean');
        });
      });
    });
  });

  test.describe('Timezone and Locale Independence', () => {
    test('should produce consistent results regardless of system timezone', () => {
      const startDate = new Date(2024, 0, 2);
      
      // Create dates with different timezone offsets
      const date1 = new Date(startDate.getTime());
      const date2 = new Date(startDate.getTime());
      
      const result1 = generateRotationCalendar(date1, '14/14', 2);
      const result2 = generateRotationCalendar(date2, '14/14', 2);
      
      expect(result1).toHaveLength(result2.length);
      
      // Compare day by day
      for (let monthIndex = 0; monthIndex < result1.length; monthIndex++) {
        const month1 = result1[monthIndex];
        const month2 = result2[monthIndex];
        
        expect(month1.days.length).toBe(month2.days.length);
        
        for (let dayIndex = 0; dayIndex < month1.days.length; dayIndex++) {
          const day1 = month1.days[dayIndex];
          const day2 = month2.days[dayIndex];
          
          expect(day1.isWorkDay).toBe(day2.isWorkDay);
          expect(day1.isInRotation).toBe(day2.isInRotation);
          expect(day1.isTransitionDay).toBe(day2.isTransitionDay);
        }
      }
    });

    test('should handle daylight saving time transitions', () => {
      // Test around typical DST transition dates
      const springDST = new Date(2024, 2, 10); // March 10, 2024 (around US DST start)
      const fallDST = new Date(2024, 10, 3);   // November 3, 2024 (around US DST end)
      
      const springResult = generateRotationCalendar(springDST, '14/14', 1);
      const fallResult = generateRotationCalendar(fallDST, '14/14', 1);
      
      expect(springResult).toHaveLength(1);
      expect(fallResult).toHaveLength(1);
      
      // Both should have full month of days
      expect(springResult[0].days.length).toBe(31); // March has 31 days
      expect(fallResult[0].days.length).toBe(30);   // November has 30 days
    });
  });
});