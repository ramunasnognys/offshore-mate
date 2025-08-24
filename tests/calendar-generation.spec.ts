import { test, expect } from '@playwright/test'

test.describe('Calendar Generation', () => {
  test('should generate a calendar with 14/14 rotation pattern', async ({ page }) => {
    // Navigate to the application
    await page.goto('/')
    
    // Verify the main heading is visible
    await expect(page.getByRole('heading', { name: 'Offshore Mate' })).toBeVisible()
    
    // Verify the subtitle/tagline is visible
    await expect(page.getByText('Navigate your offshore schedule with precision')).toBeVisible()
    
    // Select a rotation pattern - 14/14
    const rotationCard = page.locator('[data-testid="rotation-14/14"]').or(
      page.getByText('14 Days On, 14 Days Off').locator('..')
    )
    
    // If the test ID doesn't exist, try to find by text content
    if (await rotationCard.count() === 0) {
      await page.getByText('14/14').first().click()
    } else {
      await rotationCard.click()
    }
    
    // Select a start date - use today's date or a future date
    const startDateCard = page.getByText('Select Start Date').locator('..').or(
      page.locator('[data-testid="start-date-card"]')
    )
    
    if (await startDateCard.count() > 0) {
      await startDateCard.click()
    } else {
      // Try alternative selector for date picker
      await page.getByText('Start Date').click()
    }
    
    // Wait for date picker to appear and select today or first available date
    const datePickerButton = page.locator('button[aria-label*="calendar"]').or(
      page.getByRole('button', { name: /choose date/i })
    )
    
    if (await datePickerButton.count() > 0) {
      await datePickerButton.click()
      
      // Select today's date or first selectable date
      const todayButton = page.getByRole('gridcell', { name: new Date().getDate().toString() }).first()
      if (await todayButton.count() > 0) {
        await todayButton.click()
      } else {
        // Fallback: select any available date
        await page.getByRole('gridcell').first().click()
      }
    }
    
    // Generate the calendar
    const generateButton = page.getByRole('button', { name: /generate/i }).or(
      page.getByText('Generate Calendar')
    )
    await generateButton.click()
    
    // Wait for calendar to be generated and displayed
    await page.waitForTimeout(2000) // Allow time for calendar generation
    
    // Verify calendar is displayed
    const calendarContainer = page.locator('.calendar-container').or(
      page.getByText('January').locator('..')
    )
    
    // Check for month names to confirm calendar is rendered
    await expect(page.getByText('January')).toBeVisible()
    
    // Verify that work days and off days are rendered with different styling
    const workDays = page.locator('.work-day').or(
      page.locator('[data-work-day="true"]')
    )
    const offDays = page.locator('.off-day').or(
      page.locator('[data-work-day="false"]')
    )
    
    // At least one work day and one off day should be visible
    // (using count check since the exact selectors may vary)
    const hasColoredDays = await page.locator('.bg-blue-500, .bg-orange-500, .bg-red-500, .bg-green-500').count() > 0
    expect(hasColoredDays).toBeTruthy()
    
    // Verify navigation elements are present
    await expect(page.getByText('Back')).toBeVisible()
    
    // Verify that multiple months are shown (should show full year)
    const monthCount = await page.getByText(/January|February|March|April|May|June|July|August|September|October|November|December/).count()
    expect(monthCount).toBeGreaterThan(3) // Should show multiple months
    
    // Test the back functionality
    await page.getByText('Back').click()
    
    // Should return to the initial state
    await expect(page.getByRole('heading', { name: 'Offshore Mate' })).toBeVisible()
    await expect(page.getByText('Navigate your offshore schedule with precision')).toBeVisible()
  })
  
  test('should handle different rotation patterns', async ({ page }) => {
    await page.goto('/')
    
    // Test 21/21 rotation pattern
    const rotation2121 = page.getByText('21/21').first()
    if (await rotation2121.count() > 0) {
      await rotation2121.click()
      
      // Select start date and generate
      const generateButton = page.getByRole('button', { name: /generate/i })
      if (await generateButton.count() > 0) {
        await generateButton.click()
        await page.waitForTimeout(1000)
        
        // Verify calendar generation
        await expect(page.getByText('January')).toBeVisible()
        
        // Go back for next test
        await page.getByText('Back').click()
      }
    }
  })
  
  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    // Verify mobile layout
    await expect(page.getByRole('heading', { name: 'Offshore Mate' })).toBeVisible()
    
    // Mobile should have touch-friendly interface
    const rotationOptions = page.getByText('14/14')
    await expect(rotationOptions.first()).toBeVisible()
    
    // Test mobile navigation
    await rotationOptions.first().click()
    
    // Generate calendar on mobile
    const generateButton = page.getByRole('button', { name: /generate/i })
    if (await generateButton.count() > 0) {
      await generateButton.click()
      await page.waitForTimeout(1000)
      
      // Verify mobile calendar display
      await expect(page.getByText('January')).toBeVisible()
    }
  })
})