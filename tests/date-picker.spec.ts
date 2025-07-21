import { test, expect } from '@playwright/test';

// Utility to set viewport for mobile/desktop
const setViewport = async (page, type: 'mobile' | 'desktop') => {
  if (type === 'mobile') {
    await page.setViewportSize({ width: 375, height: 812 }); // iPhone X
  } else {
    await page.setViewportSize({ width: 1280, height: 900 });
  }
};

test.describe('Start Date Picker - Desktop', () => {
  test.beforeEach(async ({ page }) => {
    await setViewport(page, 'desktop');
    await page.goto('/');
  });

  test('opens date picker and selects a date', async ({ page }) => {
    await page.getByText('Start Date').click();
    await expect(page.getByRole('dialog')).toBeVisible();
    // Pick the first enabled day (today or future)
    const days = await page.locator('.rdp-day:not(.rdp-day_disabled)').all();
    await days[0].click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
    // Label should update
    const label = await page.getByText(/\w+ \d{1,2}, \d{4}/);
    await expect(label).toBeVisible();
  });

  test('does not allow selecting past dates', async ({ page }) => {
    await page.getByText('Start Date').click();
    const disabledDays = await page.locator('.rdp-day.rdp-day_disabled');
    await expect(disabledDays).toHaveCountGreaterThan(0);
  });
});

test.describe('Start Date Picker - Mobile', () => {
  test.beforeEach(async ({ page }) => {
    await setViewport(page, 'mobile');
    await page.goto('/');
  });

  test('opens mobile date picker and selects a date', async ({ page }) => {
    await page.getByText('Start Date').click();
    await expect(page.getByRole('dialog')).toBeVisible();
    // Pick the first enabled day
    const days = await page.locator('.rdp-day:not(.rdp-day_disabled)').all();
    await days[0].click();
    // Confirm selection
    const confirmBtn = await page.getByRole('button', { name: /Set|Select Date/ });
    await confirmBtn.click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
    // Label should update
    const label = await page.getByText(/\w+ \d{1,2}, \d{4}/);
    await expect(label).toBeVisible();
  });

  test('cancel resets selection', async ({ page }) => {
    await page.getByText('Start Date').click();
    const days = await page.locator('.rdp-day:not(.rdp-day_disabled)').all();
    await days[0].click();
    // Cancel
    await page.getByRole('button', { name: /Cancel/ }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
    // Label should still be 'Pick your start date'
    await expect(page.getByText('Pick your start date')).toBeVisible();
  });

  test('quick select works', async ({ page }) => {
    await page.getByText('Start Date').click();
    await page.getByRole('button', { name: /Today/ }).click();
    const confirmBtn = await page.getByRole('button', { name: /Set|Select Date/ });
    await confirmBtn.click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
    // Label should update
    const label = await page.getByText(/\w+ \d{1,2}, \d{4}/);
    await expect(label).toBeVisible();
  });
});
