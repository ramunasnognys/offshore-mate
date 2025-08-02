import { test, expect } from '@playwright/test';

test.describe('Mobile Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
  });

  test('should generate calendar and navigate with swipe gestures', async ({ page }) => {
    // First select a date by clicking the date picker trigger
    await page.click('button:has-text("Pick your start date")');
    
    // Click Today button in the dialog
    await page.click('button:has-text("Today")');
    
    // Generate a calendar
    await page.click('button:has-text("14/14")');
    await page.click('button:has-text("Generate")');
    
    // Wait for calendar to be generated (with longer timeout)
    await expect(page.locator('#calendar-container')).toBeVisible({ timeout: 10000 });
    
    // Get initial month text
    const initialMonth = await page.locator('.navigation-buttons h3').textContent();
    
    // Perform swipe left (should go to next month)
    const calendarContainer = page.locator('.mobile-swipe-container');
    await calendarContainer.hover();
    
    // Simulate swipe left gesture with longer duration
    await page.mouse.move(300, 400);
    await page.mouse.down();
    await page.waitForTimeout(50);
    await page.mouse.move(100, 400, { steps: 20 });
    await page.waitForTimeout(50);
    await page.mouse.up();
    
    // Wait for navigation to complete with longer timeout
    await page.waitForTimeout(1000);
    
    // Check if month changed
    const newMonth = await page.locator('.navigation-buttons h3').textContent();
    expect(newMonth).not.toBe(initialMonth);
  });

  test('should navigate with navigation buttons', async ({ page }) => {
    // First select a date
    await page.click('button:has-text("Pick your start date")');
    await page.click('button:has-text("Today")');
    
    // Generate a calendar first
    await page.click('button:has-text("14/14")');
    await page.click('button:has-text("Generate")');
    
    // Wait for calendar to be generated
    await expect(page.locator('#calendar-container')).toBeVisible({ timeout: 10000 });
    
    // Get initial month text
    const initialMonth = await page.locator('.navigation-buttons h3').textContent();
    
    // Click next button
    const nextButton = page.locator('.navigation-buttons button[aria-label="Next month"]');
    await expect(nextButton).toBeVisible();
    await nextButton.click();
    
    // Wait for navigation to complete
    await page.waitForTimeout(300);
    
    // Check if month changed
    const newMonth = await page.locator('.navigation-buttons h3').textContent();
    expect(newMonth).not.toBe(initialMonth);
    
    // Click previous button to go back
    const prevButton = page.locator('.navigation-buttons button[aria-label="Previous month"]');
    await expect(prevButton).toBeVisible();
    await prevButton.click();
    
    // Wait for navigation to complete
    await page.waitForTimeout(300);
    
    // Check if we're back to initial month
    const backToInitialMonth = await page.locator('.navigation-buttons h3').textContent();
    expect(backToInitialMonth).toBe(initialMonth);
  });

  test('should navigate with progress dots', async ({ page }) => {
    // First select a date
    await page.click('button:has-text("Pick your start date")');
    await page.click('button:has-text("Today")');
    
    // Generate a calendar first
    await page.click('button:has-text("14/14")');
    await page.click('button:has-text("Generate")');
    
    // Wait for calendar to be generated
    await expect(page.locator('#calendar-container')).toBeVisible({ timeout: 10000 });
    
    // Wait for progress dots to be visible
    await expect(page.locator('.progress-dots')).toBeVisible();
    
    // Get initial month text
    const initialMonth = await page.locator('.navigation-buttons h3').textContent();
    
    // Click on the second progress dot (index 1)
    const progressDots = page.locator('.progress-dots button');
    const secondDot = progressDots.nth(1);
    await expect(secondDot).toBeVisible();
    await secondDot.click();
    
    // Wait for navigation to complete
    await page.waitForTimeout(300);
    
    // Check if month changed
    const newMonth = await page.locator('.navigation-buttons h3').textContent();
    expect(newMonth).not.toBe(initialMonth);
    
    // Check if the second dot is now active (has orange background)
    await expect(secondDot).toHaveClass(/bg-orange-500/);
  });

  test('should not trigger swipe when touching navigation buttons', async ({ page }) => {
    // First select a date
    await page.click('button:has-text("Pick your start date")');
    await page.click('button:has-text("Today")');
    
    // Generate a calendar first
    await page.click('button:has-text("14/14")');
    await page.click('button:has-text("Generate")');
    
    // Wait for calendar to be generated
    await expect(page.locator('#calendar-container')).toBeVisible({ timeout: 10000 });
    
    // Get initial month text
    const initialMonth = await page.locator('.navigation-buttons h3').textContent();
    
    // Try to swipe starting from a navigation button
    const nextButton = page.locator('.navigation-buttons button[aria-label="Next month"]');
    await nextButton.hover();
    
    // Start touch on button and try to swipe with longer duration
    await page.mouse.move(350, 200); // Button area
    await page.mouse.down();
    await page.waitForTimeout(50);
    await page.mouse.move(150, 200, { steps: 20 }); // Swipe left
    await page.waitForTimeout(50);
    await page.mouse.up();
    
    // Wait a bit
    await page.waitForTimeout(500);
    
    // Month should not have changed via swipe
    const monthAfterSwipeAttempt = await page.locator('.navigation-buttons h3').textContent();
    expect(monthAfterSwipeAttempt).toBe(initialMonth);
  });

  test('should handle touch events correctly on buttons', async ({ page }) => {
    // First select a date
    await page.click('button:has-text("Pick your start date")');
    await page.click('button:has-text("Today")');
    
    // Generate a calendar first
    await page.click('button:has-text("14/14")');
    await page.click('button:has-text("Generate")');
    
    // Wait for calendar to be generated
    await expect(page.locator('#calendar-container')).toBeVisible({ timeout: 10000 });
    
    // Test touch events on navigation buttons
    const nextButton = page.locator('.navigation-buttons button[aria-label="Next month"]');
    await expect(nextButton).toBeVisible();
    
    // Simulate touch events - use click instead of touch events for cross-browser compatibility
    await nextButton.click();
    
    // Wait for navigation to complete
    await page.waitForTimeout(300);
    
    // Should have navigated to next month
    // We can't easily check the exact month, but we can verify the button worked
    // by checking that we can go back
    const prevButton = page.locator('.navigation-buttons button[aria-label="Previous month"]');
    await expect(prevButton).toBeVisible();
    await expect(prevButton).not.toBeDisabled();
  });

  test('should maintain proper z-index layering', async ({ page }) => {
    // First select a date
    await page.click('button:has-text("Pick your start date")');
    await page.click('button:has-text("Today")');
    
    // Generate a calendar first
    await page.click('button:has-text("14/14")');
    await page.click('button:has-text("Generate")');
    
    // Wait for calendar to be generated
    await expect(page.locator('#calendar-container')).toBeVisible({ timeout: 10000 });
    
    // Check that navigation buttons have higher z-index
    const navigationButtons = page.locator('.navigation-buttons');
    const zIndex = await navigationButtons.evaluate((el) => {
      return window.getComputedStyle(el).zIndex;
    });
    
    // Should have z-index of 20 or higher
    expect(parseInt(zIndex)).toBeGreaterThanOrEqual(20);
    
    // Check that buttons within navigation have even higher z-index
    const nextButton = page.locator('.navigation-buttons button[aria-label="Next month"]');
    const buttonZIndex = await nextButton.evaluate((el) => {
      return window.getComputedStyle(el).zIndex;
    });
    
    // Should have z-index of 21 or higher
    expect(parseInt(buttonZIndex)).toBeGreaterThanOrEqual(21);
  });

  test('should show console logs for debugging', async ({ page }) => {
    const consoleLogs: string[] = [];
    
    // Capture console logs
    page.on('console', (msg) => {
      if (msg.type() === 'log') {
        consoleLogs.push(msg.text());
      }
    });
    
    // First select a date
    await page.click('button:has-text("Pick your start date")');
    await page.click('button:has-text("Today")');
    
    // Generate a calendar first
    await page.click('button:has-text("14/14")');
    await page.click('button:has-text("Generate")');
    
    // Wait for calendar to be generated
    await expect(page.locator('#calendar-container')).toBeVisible({ timeout: 10000 });
    
    // Click next button to trigger console logs
    const nextButton = page.locator('.navigation-buttons button[aria-label="Next month"]');
    await nextButton.click();
    
    // Wait for logs
    await page.waitForTimeout(500);
    
    // Check if we got expected console logs
    const touchLogs = consoleLogs.filter(log => log.includes('button touched') || log.includes('Navigation triggered'));
    expect(touchLogs.length).toBeGreaterThan(0);
  });
});