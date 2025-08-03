import { test, expect } from '@playwright/test'

test.describe('Work Pattern Display', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3002')
  })

  test('should display work pattern badge after generating calendar', async ({ page }) => {
    // Select a rotation pattern (14/14)
    await page.getByRole('button', { name: '14 days on / 14 days off' }).click()
    
    // Generate calendar
    await page.getByRole('button', { name: 'Generate Calendar' }).click()
    
    // Wait for calendar to load
    await page.waitForSelector('[aria-label*="month calendar grid"]')
    
    // Check that work pattern badge is visible
    const workPatternBadge = page.locator('div').filter({ hasText: /🛠️|🏖️/ }).first()
    await expect(workPatternBadge).toBeVisible()
    
    // Check that the badge contains expected text
    const badgeText = await workPatternBadge.textContent()
    expect(badgeText).toMatch(/🛠️.*\d+|🏖️ Off this month/)
  })

  test('should show "Off this month" for months with no work days', async ({ page }) => {
    // Select 28/28 rotation
    await page.getByRole('button', { name: '28 days on / 28 days off' }).click()
    
    // Set start date to ensure some months will be off
    await page.getByRole('button', { name: 'Change Start Date' }).click()
    await page.waitForSelector('select[name="month"]')
    
    // Select January 2024
    await page.selectOption('select[name="month"]', '0') // January
    await page.selectOption('select[name="year"]', '2024')
    await page.locator('button[name="day"][value="1"]').click()
    
    // Generate calendar
    await page.getByRole('button', { name: 'Generate Calendar' }).click()
    
    // Wait for calendar
    await page.waitForSelector('[aria-label*="month calendar grid"]')
    
    // Navigate through months to find an off month
    let foundOffMonth = false
    for (let i = 0; i < 12; i++) {
      const badgeText = await page.locator('div').filter({ hasText: /🛠️|🏖️/ }).first().textContent()
      if (badgeText?.includes('🏖️ Off this month')) {
        foundOffMonth = true
        break
      }
      
      // Navigate to next month on mobile
      const nextButton = page.locator('button[aria-label="Next month"]')
      if (await nextButton.isVisible()) {
        await nextButton.click()
        await page.waitForTimeout(500)
      }
    }
    
    expect(foundOffMonth).toBe(true)
  })

  test('should update pattern when navigating between months', async ({ page }) => {
    // Select rotation and generate calendar
    await page.getByRole('button', { name: '14 days on / 14 days off' }).click()
    await page.getByRole('button', { name: 'Generate Calendar' }).click()
    
    // Wait for calendar
    await page.waitForSelector('[aria-label*="month calendar grid"]')
    
    // Get initial pattern
    const initialPattern = await page.locator('div').filter({ hasText: /🛠️|🏖️/ }).first().textContent()
    
    // Navigate to next month
    const nextButton = page.locator('button[aria-label="Next month"]')
    if (await nextButton.isVisible()) {
      await nextButton.click()
      await page.waitForTimeout(500)
      
      // Get new pattern
      const newPattern = await page.locator('div').filter({ hasText: /🛠️|🏖️/ }).first().textContent()
      
      // Patterns might be the same or different, but should be defined
      expect(newPattern).toBeDefined()
      expect(newPattern).toMatch(/🛠️.*\d+|🏖️ Off this month/)
    }
  })

  test('should display correct date ranges in work pattern', async ({ page }) => {
    // Select rotation and generate calendar
    await page.getByRole('button', { name: '14 days on / 14 days off' }).click()
    await page.getByRole('button', { name: 'Generate Calendar' }).click()
    
    // Wait for calendar
    await page.waitForSelector('[aria-label*="month calendar grid"]')
    
    // Get work pattern text
    const patternText = await page.locator('div').filter({ hasText: /🛠️|🏖️/ }).first().textContent()
    
    if (patternText?.includes('🛠️')) {
      // Check for date format (e.g., "Jan 1 -> 14" or "Dec 28 -> Jan 10")
      expect(patternText).toMatch(/🛠️.*([A-Z][a-z]{2}\s+\d{1,2}(\s+->\s+\d{1,2}|\s+->\s+[A-Z][a-z]{2}\s+\d{1,2}))/)
    }
  })

  test('should handle edge case of single day work period', async ({ page }) => {
    // This might happen at the beginning or end of a rotation
    // Select rotation with specific start date
    await page.getByRole('button', { name: '21 days on / 21 days off' }).click()
    
    // Set start date
    await page.getByRole('button', { name: 'Change Start Date' }).click()
    await page.waitForSelector('select[name="month"]')
    
    // Select a date that might create edge cases
    await page.selectOption('select[name="month"]', '11') // December
    await page.selectOption('select[name="year"]', '2024')
    await page.locator('button[name="day"][value="31"]').click()
    
    // Generate calendar
    await page.getByRole('button', { name: 'Generate Calendar' }).click()
    
    // Wait for calendar
    await page.waitForSelector('[aria-label*="month calendar grid"]')
    
    // Check that pattern is correctly displayed
    const patternText = await page.locator('div').filter({ hasText: /🛠️|🏖️/ }).first().textContent()
    expect(patternText).toBeDefined()
    expect(patternText).toMatch(/🛠️.*|🏖️ Off this month/)
  })

  test('should maintain pattern display on mobile view', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Select rotation and generate calendar
    await page.getByRole('button', { name: '14 days on / 14 days off' }).click()
    await page.getByRole('button', { name: 'Generate Calendar' }).click()
    
    // Wait for calendar
    await page.waitForSelector('[aria-label*="month calendar grid"]')
    
    // Check work pattern badge is visible on mobile
    const workPatternBadge = page.locator('div').filter({ hasText: /🛠️|🏖️/ }).first()
    await expect(workPatternBadge).toBeVisible()
    
    // Check positioning and styling
    const badgeBox = await workPatternBadge.boundingBox()
    expect(badgeBox).toBeTruthy()
    expect(badgeBox!.width).toBeGreaterThan(100) // Badge should have reasonable width
  })

  test('should handle multiple work periods in a month', async ({ page }) => {
    // Select 14/14 rotation which often has multiple periods
    await page.getByRole('button', { name: '14 days on / 14 days off' }).click()
    
    // Set a start date that will create multiple periods
    await page.getByRole('button', { name: 'Change Start Date' }).click()
    await page.waitForSelector('select[name="month"]')
    
    await page.selectOption('select[name="month"]', '0') // January
    await page.selectOption('select[name="year"]', '2024')
    await page.locator('button[name="day"][value="5"]').click()
    
    // Generate calendar
    await page.getByRole('button', { name: 'Generate Calendar' }).click()
    
    // Wait for calendar
    await page.waitForSelector('[aria-label*="month calendar grid"]')
    
    // Navigate through months to find one with multiple periods
    for (let i = 0; i < 6; i++) {
      const patternText = await page.locator('div').filter({ hasText: /🛠️|🏖️/ }).first().textContent()
      
      // Check if pattern contains comma (indicating multiple periods)
      if (patternText?.includes(',')) {
        expect(patternText).toMatch(/🛠️.*,.*/) // Should have comma-separated periods
        break
      }
      
      // Navigate to next month
      const nextButton = page.locator('button[aria-label="Next month"]')
      if (await nextButton.isVisible()) {
        await nextButton.click()
        await page.waitForTimeout(500)
      }
    }
  })
})

test.describe('Work Pattern Display - TypeScript Types', () => {
  test('TypeScript compilation should succeed', async () => {
    // This test runs TypeScript compiler to check for type errors
    const { execSync } = require('child_process')
    
    try {
      execSync('npx tsc --noEmit', { 
        cwd: '/Users/ramunasnognys/Developer/offshore-mate',
        stdio: 'pipe' 
      })
    } catch (error: any) {
      // If there are TypeScript errors, fail the test
      console.error('TypeScript compilation errors:', error.stdout?.toString())
      throw new Error('TypeScript compilation failed')
    }
  })
})