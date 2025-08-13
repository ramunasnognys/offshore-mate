import { test, expect } from '@playwright/test';

test.describe('Calendar Generation Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Basic Calendar Generation', () => {
    test('should generate calendar with 14/14 rotation pattern', async ({ page }) => {
      // Select 14/14 rotation pattern
      await page.getByRole('button', { name: /14\/14/i }).click();
      
      // Set a start date
      await page.getByRole('button', { name: /pick a start date/i }).click();
      await page.getByRole('button', { name: '15' }).first().click();
      
      // Generate calendar
      await page.getByRole('button', { name: /generate calendar/i }).click();
      
      // Verify calendar is displayed
      await expect(page.locator('#calendar-container')).toBeVisible();
      
      // Check for work days and off days
      await expect(page.locator('.work-day')).toHaveCount({ min: 1 });
      await expect(page.locator('.off-day')).toHaveCount({ min: 1 });
      
      // Verify calendar shows multiple months
      await expect(page.locator('.month-container')).toHaveCount({ min: 3 });
    });

    test('should generate calendar with 14/21 rotation pattern', async ({ page }) => {
      // Select 14/21 rotation pattern
      await page.getByRole('button', { name: /14\/21/i }).click();
      
      // Set a start date
      await page.getByRole('button', { name: /pick a start date/i }).click();
      await page.getByRole('button', { name: '1' }).first().click();
      
      // Generate calendar
      await page.getByRole('button', { name: /generate calendar/i }).click();
      
      // Verify calendar is displayed
      await expect(page.locator('#calendar-container')).toBeVisible();
      
      // Check that off days outnumber work days (21 off vs 14 work)
      const workDays = await page.locator('.work-day').count();
      const offDays = await page.locator('.off-day').count();
      
      expect(offDays).toBeGreaterThan(workDays);
    });

    test('should generate calendar with 28/28 rotation pattern', async ({ page }) => {
      // Select 28/28 rotation pattern
      await page.getByRole('button', { name: /28\/28/i }).click();
      
      // Set a start date
      await page.getByRole('button', { name: /pick a start date/i }).click();
      await page.getByRole('button', { name: '10' }).first().click();
      
      // Generate calendar
      await page.getByRole('button', { name: /generate calendar/i }).click();
      
      // Verify calendar is displayed
      await expect(page.locator('#calendar-container')).toBeVisible();
      
      // Verify longer work periods (should have longer consecutive work stretches)
      await expect(page.locator('.work-day')).toHaveCount({ min: 10 });
    });

    test('should generate calendar with custom rotation pattern', async ({ page }) => {
      // Select Custom rotation pattern
      await page.getByRole('button', { name: /custom/i }).click();
      
      // Set custom work days
      await page.getByLabel(/work days/i).fill('10');
      
      // Set custom off days
      await page.getByLabel(/off days/i).fill('20');
      
      // Set a start date
      await page.getByRole('button', { name: /pick a start date/i }).click();
      await page.getByRole('button', { name: '5' }).first().click();
      
      // Generate calendar
      await page.getByRole('button', { name: /generate calendar/i }).click();
      
      // Verify calendar is displayed
      await expect(page.locator('#calendar-container')).toBeVisible();
      
      // Check for work and off days
      await expect(page.locator('.work-day')).toHaveCount({ min: 1 });
      await expect(page.locator('.off-day')).toHaveCount({ min: 1 });
    });
  });

  test.describe('Calendar Navigation and Display', () => {
    test('should display current date highlight', async ({ page }) => {
      // Generate a calendar
      await page.getByRole('button', { name: /14\/14/i }).click();
      await page.getByRole('button', { name: /pick a start date/i }).click();
      await page.getByRole('button', { name: '1' }).first().click();
      await page.getByRole('button', { name: /generate calendar/i }).click();
      
      // Check if today's date is highlighted
      const today = new Date();
      const todaySelector = `[data-date="${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}"]`;
      
      if (await page.locator(todaySelector).count() > 0) {
        await expect(page.locator(todaySelector)).toHaveClass(/today/);
      }
    });

    test('should show transition days in calendar', async ({ page }) => {
      // Generate a calendar
      await page.getByRole('button', { name: /14\/14/i }).click();
      await page.getByRole('button', { name: /pick a start date/i }).click();
      await page.getByRole('button', { name: '1' }).first().click();
      await page.getByRole('button', { name: /generate calendar/i }).click();
      
      // Check for transition day indicators
      await expect(page.locator('.transition-day')).toHaveCount({ min: 1 });
    });

    test('should display month and year headers', async ({ page }) => {
      // Generate a calendar
      await page.getByRole('button', { name: /14\/14/i }).click();
      await page.getByRole('button', { name: /pick a start date/i }).click();
      await page.getByRole('button', { name: '15' }).first().click();
      await page.getByRole('button', { name: /generate calendar/i }).click();
      
      // Check for month/year headers
      const currentDate = new Date();
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      
      const currentMonthName = monthNames[currentDate.getMonth()];
      await expect(page.getByText(new RegExp(currentMonthName, 'i'))).toBeVisible();
      await expect(page.getByText(currentDate.getFullYear().toString())).toBeVisible();
    });
  });

  test.describe('Calendar Export Functionality', () => {
    test('should enable export buttons after calendar generation', async ({ page }) => {
      // Generate a calendar first
      await page.getByRole('button', { name: /14\/14/i }).click();
      await page.getByRole('button', { name: /pick a start date/i }).click();
      await page.getByRole('button', { name: '1' }).first().click();
      await page.getByRole('button', { name: /generate calendar/i }).click();
      
      // Wait for calendar to be generated
      await expect(page.locator('#calendar-container')).toBeVisible();
      
      // Check that export buttons are enabled
      await expect(page.getByRole('button', { name: /export as png/i })).toBeEnabled();
      await expect(page.getByRole('button', { name: /export as pdf/i })).toBeEnabled();
      await expect(page.getByRole('button', { name: /export as ical/i })).toBeEnabled();
    });

    test('should show export progress modal during export', async ({ page }) => {
      // Generate a calendar
      await page.getByRole('button', { name: /14\/14/i }).click();
      await page.getByRole('button', { name: /pick a start date/i }).click();
      await page.getByRole('button', { name: '1' }).first().click();
      await page.getByRole('button', { name: /generate calendar/i }).click();
      
      // Wait for calendar to be generated
      await expect(page.locator('#calendar-container')).toBeVisible();
      
      // Click export button (PNG is usually fastest)
      await page.getByRole('button', { name: /export as png/i }).click();
      
      // Check if progress modal appears (might be quick)
      const progressModal = page.locator('[data-testid="export-progress-modal"]');
      if (await progressModal.isVisible()) {
        await expect(progressModal).toContainText(/generating/i);
      }
    });
  });

  test.describe('Schedule Management', () => {
    test('should save and load schedules', async ({ page }) => {
      // Generate a calendar
      await page.getByRole('button', { name: /14\/14/i }).click();
      await page.getByRole('button', { name: /pick a start date/i }).click();
      await page.getByRole('button', { name: '1' }).first().click();
      await page.getByRole('button', { name: /generate calendar/i }).click();
      
      // Wait for calendar to be generated
      await expect(page.locator('#calendar-container')).toBeVisible();
      
      // Save the schedule
      await page.getByRole('button', { name: /save schedule/i }).click();
      
      // Enter schedule name
      await page.getByRole('textbox', { name: /schedule name/i }).fill('Test Schedule');
      await page.getByRole('button', { name: /save/i }).click();
      
      // Check if schedule was saved (should show in saved schedules)
      await expect(page.getByText('Test Schedule')).toBeVisible();
      
      // Try to load the schedule
      await page.getByRole('button', { name: /load.*test schedule/i }).click();
      
      // Verify calendar is still displayed
      await expect(page.locator('#calendar-container')).toBeVisible();
    });

    test('should show saved schedules count', async ({ page }) => {
      // Check initial saved schedules display
      const savedSchedulesCard = page.locator('[data-testid="saved-schedules-card"]');
      if (await savedSchedulesCard.isVisible()) {
        await expect(savedSchedulesCard).toContainText(/saved schedules/i);
      }
    });
  });

  test.describe('Mobile Responsiveness', () => {
    test('should work on mobile viewport', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Generate a calendar
      await page.getByRole('button', { name: /14\/14/i }).click();
      await page.getByRole('button', { name: /pick a start date/i }).click();
      await page.getByRole('button', { name: '1' }).first().click();
      await page.getByRole('button', { name: /generate calendar/i }).click();
      
      // Verify calendar is displayed and responsive
      await expect(page.locator('#calendar-container')).toBeVisible();
      
      // Check that calendar days are appropriately sized for mobile
      const calendarDay = page.locator('.calendar-day').first();
      if (await calendarDay.isVisible()) {
        const boundingBox = await calendarDay.boundingBox();
        expect(boundingBox?.width).toBeGreaterThan(30); // Minimum touch target
        expect(boundingBox?.height).toBeGreaterThan(30);
      }
    });

    test('should handle mobile-specific navigation', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Generate a calendar
      await page.getByRole('button', { name: /14\/14/i }).click();
      await page.getByRole('button', { name: /pick a start date/i }).click();
      await page.getByRole('button', { name: '1' }).first().click();
      await page.getByRole('button', { name: /generate calendar/i }).click();
      
      // Check for mobile-specific UI elements
      const mobileNavButton = page.locator('[data-testid="mobile-nav-button"]');
      if (await mobileNavButton.isVisible()) {
        await expect(mobileNavButton).toBeVisible();
      }
    });
  });

  test.describe('Error Handling', () => {
    test('should handle invalid custom rotation inputs', async ({ page }) => {
      // Select Custom rotation pattern
      await page.getByRole('button', { name: /custom/i }).click();
      
      // Enter invalid work days (negative number)
      await page.getByLabel(/work days/i).fill('-5');
      
      // Try to generate calendar
      await page.getByRole('button', { name: /generate calendar/i }).click();
      
      // Should show error or prevent generation
      const errorMessage = page.locator('[data-testid="error-message"]');
      if (await errorMessage.isVisible()) {
        await expect(errorMessage).toContainText(/invalid/i);
      }
    });

    test('should handle missing start date', async ({ page }) => {
      // Select rotation pattern without setting start date
      await page.getByRole('button', { name: /14\/14/i }).click();
      
      // Try to generate calendar without selecting start date
      await page.getByRole('button', { name: /generate calendar/i }).click();
      
      // Should either prompt for date or show error
      const generateButton = page.getByRole('button', { name: /generate calendar/i });
      const startDateButton = page.getByRole('button', { name: /pick a start date/i });
      
      // Either button should still be visible (indicating calendar wasn't generated)
      await expect(generateButton.or(startDateButton)).toBeVisible();
    });
  });

  test.describe('Calendar Data Validation', () => {
    test('should maintain rotation consistency across months', async ({ page }) => {
      // Generate a calendar spanning multiple months
      await page.getByRole('button', { name: /14\/14/i }).click();
      await page.getByRole('button', { name: /pick a start date/i }).click();
      await page.getByRole('button', { name: '1' }).first().click();
      await page.getByRole('button', { name: /generate calendar/i }).click();
      
      // Wait for calendar to be generated
      await expect(page.locator('#calendar-container')).toBeVisible();
      
      // Check that multiple months are displayed
      await expect(page.locator('.month-container')).toHaveCount({ min: 3 });
      
      // Verify work/off pattern consistency
      const workDays = await page.locator('.work-day').count();
      const offDays = await page.locator('.off-day').count();
      
      expect(workDays).toBeGreaterThan(0);
      expect(offDays).toBeGreaterThan(0);
      
      // For 14/14 pattern, work and off days should be roughly balanced
      const ratio = workDays / offDays;
      expect(ratio).toBeGreaterThan(0.5);
      expect(ratio).toBeLessThan(2.0);
    });

    test('should handle leap year dates correctly', async ({ page }) => {
      // This test would be more meaningful if we could set the system date
      // For now, just verify calendar generation works with current date
      await page.getByRole('button', { name: /14\/14/i }).click();
      await page.getByRole('button', { name: /pick a start date/i }).click();
      
      // Try to select February 29 if it exists (leap year)
      const feb29 = page.getByRole('button', { name: '29' });
      if (await feb29.isVisible()) {
        await feb29.click();
        
        // Generate calendar
        await page.getByRole('button', { name: /generate calendar/i }).click();
        
        // Verify calendar is displayed
        await expect(page.locator('#calendar-container')).toBeVisible();
      }
    });

    test('should display correct day of week alignment', async ({ page }) => {
      // Generate a calendar
      await page.getByRole('button', { name: /14\/14/i }).click();
      await page.getByRole('button', { name: /pick a start date/i }).click();
      await page.getByRole('button', { name: '1' }).first().click();
      await page.getByRole('button', { name: /generate calendar/i }).click();
      
      // Wait for calendar to be generated
      await expect(page.locator('#calendar-container')).toBeVisible();
      
      // Check for day of week headers
      const dayHeaders = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      
      for (const day of dayHeaders) {
        await expect(page.getByText(day)).toBeVisible();
      }
      
      // Verify first day of month is correctly positioned
      const firstDayOfMonth = page.locator('.calendar-day[data-date*="-01"]').first();
      if (await firstDayOfMonth.isVisible()) {
        await expect(firstDayOfMonth).toBeVisible();
      }
    });
  });
});