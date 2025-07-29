import { test, expect } from '@playwright/test'

test.describe('Calendar Swipe Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    
    // Fill in the form to generate a calendar
    await page.fill('input[type="date"]', '2024-01-01')
    await page.selectOption('select', '14/14')
    await page.click('button:has-text("Generate Calendar")')
    
    // Wait for calendar to be generated
    await page.waitForSelector('[aria-label="Work rotation schedule"]')
  })

  test('should navigate between months using swipe on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Get initial month
    const initialMonth = await page.textContent('h3[id^="month-"]')
    
    // Perform swipe left gesture
    const calendar = await page.locator('.swipeable-calendar').first()
    const box = await calendar.boundingBox()
    
    if (box) {
      // Swipe left to go to next month
      await page.mouse.move(box.x + box.width * 0.8, box.y + box.height / 2)
      await page.mouse.down()
      await page.mouse.move(box.x + box.width * 0.2, box.y + box.height / 2, { steps: 10 })
      await page.mouse.up()
      
      // Wait for animation to complete
      await page.waitForTimeout(500)
      
      // Check that month has changed
      const newMonth = await page.textContent('h3[id^="month-"]')
      expect(newMonth).not.toBe(initialMonth)
    }
  })

  test('should navigate using navigation arrows', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Get initial month
    const initialMonth = await page.textContent('h3[id^="month-"]')
    
    // Click next arrow
    await page.click('button[aria-label="Next month"]')
    
    // Wait for animation
    await page.waitForTimeout(500)
    
    // Check that month has changed
    const newMonth = await page.textContent('h3[id^="month-"]')
    expect(newMonth).not.toBe(initialMonth)
  })

  test('should navigate using progress dots', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Click on the third dot
    const dots = await page.locator('button[aria-label*="Go to"]').all()
    if (dots.length >= 3) {
      await dots[2].click()
      
      // Wait for animation
      await page.waitForTimeout(500)
      
      // Verify we're on the third month
      const activeButton = await page.locator('button[aria-label*="Go to"]').nth(2)
      const buttonWidth = await activeButton.evaluate(el => window.getComputedStyle(el).width)
      expect(buttonWidth).toBe('32px') // w-8 = 2rem = 32px
    }
  })

  test('should disable previous button on first month', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Check that previous button is disabled
    const prevButton = await page.locator('button[aria-label="Previous month"]')
    await expect(prevButton).toBeDisabled()
  })

  test('should show swipe hint when dragging', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    const calendar = await page.locator('.swipeable-calendar').first()
    const box = await calendar.boundingBox()
    
    if (box) {
      // Start dragging
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
      await page.mouse.down()
      await page.mouse.move(box.x + box.width * 0.4, box.y + box.height / 2, { steps: 5 })
      
      // Check for swipe hint
      await expect(page.locator('text="Swipe to navigate"')).toBeVisible()
      
      // Release
      await page.mouse.up()
    }
  })

  test('should work with keyboard navigation on desktop', async ({ page }) => {
    // Desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 })
    
    // Generate calendar and switch to mobile view for testing
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Focus on the calendar area
    await page.locator('.swipeable-calendar').first().focus()
    
    // Press right arrow key
    await page.keyboard.press('ArrowRight')
    await page.waitForTimeout(500)
    
    // Verify navigation occurred
    const dots = await page.locator('button[aria-label*="Go to"]').all()
    const activeDot = await page.locator('button[aria-label*="Go to"]').filter({ 
      hasCSS: 'width', 
      value: '32px' 
    })
    
    // Should be on second month
    await expect(activeDot).toHaveCount(1)
  })
})