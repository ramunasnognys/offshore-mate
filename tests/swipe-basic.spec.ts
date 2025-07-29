import { test, expect } from '@playwright/test'

test.describe('Basic Swipe Functionality', () => {
  test('application loads and has swipe feature available', async ({ page }) => {
    await page.goto('/')
    
    // Check that the main page loads
    await expect(page).toHaveTitle(/Offshore Mate/)
    
    // Check that we can interact with the form
    const dateButton = page.locator('button:has-text("Pick your start date")')
    await expect(dateButton).toBeVisible()
    
    const rotationButton = page.locator('button:has-text("14/14")')
    await expect(rotationButton).toBeVisible()
    
    const generateButton = page.locator('button:has-text("Generate Calendar")')
    await expect(generateButton).toBeVisible()
  })

  test('can generate calendar and see SwipeableCalendar on mobile', async ({ page }) => {
    // Set mobile viewport first
    await page.setViewportSize({ width: 375, height: 667 })
    
    await page.goto('/')
    
    // Interact with form to generate calendar
    await page.click('button:has-text("Pick your start date")')
    await page.waitForSelector('button:has-text("Today")', { timeout: 5000 })
    await page.click('button:has-text("Today")')
    
    // Wait a bit for dialog to close
    await page.waitForTimeout(500)
    
    await page.click('button:has-text("14/14")')
    await page.click('button:has-text("Generate Calendar")')
    
    // Wait for calendar to appear
    await page.waitForSelector('[aria-label="Work rotation schedule"]', { timeout: 10000 })
    
    // Check for SwipeableCalendar specific elements
    const navigationArrows = page.locator('button[aria-label="Next month"], button[aria-label="Previous month"]')
    await expect(navigationArrows.first()).toBeVisible()
    
    // Check for progress dots
    const progressDots = page.locator('button[aria-label*="Go to"]')
    await expect(progressDots.first()).toBeVisible()
  })

  test('swipeable calendar has proper CSS classes applied', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    await page.goto('/')
    
    // Generate calendar
    await page.click('button:has-text("Pick your start date")')
    await page.waitForSelector('button:has-text("Today")')
    await page.click('button:has-text("Today")')
    await page.waitForTimeout(500)
    
    await page.click('button:has-text("14/14")')
    await page.click('button:has-text("Generate Calendar")')
    
    // Wait for calendar
    await page.waitForSelector('[aria-label="Work rotation schedule"]', { timeout: 10000 })
    
    // Check for swipeable calendar CSS classes
    const swipeableContainer = page.locator('.calendar-swipe-container')
    await expect(swipeableContainer).toBeVisible()
    
    const swipeableCalendar = page.locator('.swipeable-calendar')
    await expect(swipeableCalendar).toBeVisible()
  })
})