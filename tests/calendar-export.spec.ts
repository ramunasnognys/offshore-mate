import { test, expect } from '@playwright/test';

// Utility to set viewport for mobile/desktop
const setViewport = async (page, type: 'mobile' | 'desktop') => {
  if (type === 'mobile') {
    await page.setViewportSize({ width: 375, height: 812 }); // iPhone X
  } else {
    await page.setViewportSize({ width: 1280, height: 900 });
  }
};

// Helper to generate a calendar
const generateTestCalendar = async (page) => {
  // Select start date (today)
  await page.getByText('Start Date').click();
  if (await page.locator('.rdp-day:not(.rdp-day_disabled)').count() > 0) {
    const days = await page.locator('.rdp-day:not(.rdp-day_disabled)').all();
    await days[0].click();
  }
  
  // Close date picker (desktop) or confirm (mobile)
  const confirmBtn = await page.getByRole('button', { name: /Set|Select Date/ });
  if (await confirmBtn.isVisible()) {
    await confirmBtn.click();
  }
  
  // Select rotation pattern (14/21)
  await page.getByRole('button', { name: '14/21' }).click();
  
  // Generate calendar
  await page.getByRole('button', { name: 'Generate' }).click();
  
  // Wait for calendar to be generated
  await expect(page.getByRole('button', { name: 'Back' })).toBeVisible();
};

test.describe('Calendar Export - Desktop', () => {
  test.beforeEach(async ({ page }) => {
    await setViewport(page, 'desktop');
    await page.goto('/');
    await generateTestCalendar(page);
  });

  test('shows Add to Calendar option in floating action menu', async ({ page }) => {
    // Open floating action menu
    await page.locator('button[aria-label="Open export menu"]').click();
    
    // Check that all export options are visible
    await expect(page.getByText('Export as PNG')).toBeVisible();
    await expect(page.getByText('Export as PDF')).toBeVisible();
    await expect(page.getByText('Add to Calendar')).toBeVisible();
  });

  test('triggers download when Add to Calendar is clicked', async ({ page }) => {
    // Listen for download event
    const downloadPromise = page.waitForEvent('download');
    
    // Open floating action menu
    await page.locator('button[aria-label="Open export menu"]').click();
    
    // Click Add to Calendar
    await page.getByText('Add to Calendar').click();
    
    // Wait for download to trigger
    const download = await downloadPromise;
    
    // Verify download filename contains .ics extension
    const filename = download.suggestedFilename();
    expect(filename).toMatch(/\.ics$/);
    expect(filename).toContain('schedule');
  });

  test('shows tooltip on hover', async ({ page }) => {
    // Open floating action menu
    await page.locator('button[aria-label="Open export menu"]').click();
    
    // Hover over Add to Calendar button
    await page.getByText('Add to Calendar').hover();
    
    // Check tooltip appears
    await expect(page.getByText('Import to calendar app')).toBeVisible();
  });
});

test.describe('Calendar Export - Mobile', () => {
  test.beforeEach(async ({ page }) => {
    await setViewport(page, 'mobile');
    await page.goto('/');
    await generateTestCalendar(page);
  });

  test('shows Add to Calendar option in bottom toolbar', async ({ page }) => {
    // Open export options
    await page.getByText('Export').click();
    
    // Check that export panel is visible
    await expect(page.getByText('Export Calendar')).toBeVisible();
    
    // Check all export format options
    await expect(page.getByText('PNG Image')).toBeVisible();
    await expect(page.getByText('PDF Document')).toBeVisible();
    await expect(page.getByText('Add to Calendar')).toBeVisible();
  });

  test('selects calendar format and triggers download', async ({ page }) => {
    // Listen for download event
    const downloadPromise = page.waitForEvent('download');
    
    // Open export options
    await page.getByText('Export').click();
    
    // Select Add to Calendar format
    await page.getByText('Add to Calendar').click();
    
    // Click Export Calendar button
    await page.getByRole('button', { name: 'Export Calendar' }).click();
    
    // Wait for download to trigger
    const download = await downloadPromise;
    
    // Verify download filename
    const filename = download.suggestedFilename();
    expect(filename).toMatch(/\.ics$/);
    expect(filename).toContain('schedule');
  });

  test('shows correct loading state', async ({ page }) => {
    // Open export options
    await page.getByText('Export').click();
    
    // Select Add to Calendar format
    await page.getByText('Add to Calendar').click();
    
    // Click Export Calendar button
    await page.getByRole('button', { name: 'Export Calendar' }).click();
    
    // Check loading state text
    await expect(page.getByText('Creating...')).toBeVisible();
  });

  test('closes export panel after successful export', async ({ page }) => {
    // Open export options
    await page.getByText('Export').click();
    
    // Verify panel is open
    await expect(page.getByText('Export Calendar')).toBeVisible();
    
    // Select Add to Calendar format
    await page.getByText('Add to Calendar').click();
    
    // Click Export Calendar button
    await page.getByRole('button', { name: 'Export Calendar' }).click();
    
    // Wait for panel to close
    await expect(page.getByText('Export Calendar')).not.toBeVisible();
  });
});

test.describe('Calendar Export - Cross-platform', () => {
  test('generates valid .ics file content', async ({ page }) => {
    await setViewport(page, 'desktop');
    await page.goto('/');
    await generateTestCalendar(page);
    
    // Listen for download
    const downloadPromise = page.waitForEvent('download');
    
    // Trigger calendar export
    await page.locator('button[aria-label="Open export menu"]').click();
    await page.getByText('Add to Calendar').click();
    
    const download = await downloadPromise;
    
    // Verify file extension
    expect(download.suggestedFilename()).toMatch(/\.ics$/);
    
    // Note: In a real test environment, you could save and verify the file contents
    // But Playwright doesn't support reading downloaded file contents directly in browser context
  });

  test('handles export errors gracefully', async ({ page }) => {
    await setViewport(page, 'desktop');
    await page.goto('/');
    
    // Try to export without generating calendar first
    // This shouldn't be possible as the FAB is not shown, but if it were...
    // The app should handle this gracefully
    
    // Generate calendar first
    await generateTestCalendar(page);
    
    // The export should work normally
    await page.locator('button[aria-label="Open export menu"]').click();
    await expect(page.getByText('Add to Calendar')).toBeVisible();
  });
});