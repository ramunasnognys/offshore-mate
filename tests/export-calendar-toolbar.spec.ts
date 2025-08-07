import { test, expect } from '@playwright/test'

test.describe('Export Calendar Toolbar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000')
  })

  test('should display export toolbar only after calendar is generated on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Initially, export toolbar should not be visible
    const exportButton = page.locator('button[aria-label="Export"]')
    await expect(exportButton).not.toBeVisible()
    
    // Generate calendar first
    await page.getByRole('button', { name: '14 days on / 14 days off' }).click()
    await page.getByRole('button', { name: 'Generate Calendar' }).click()
    
    // Wait for calendar to load
    await page.waitForSelector('[aria-label*="month calendar grid"]')
    
    // Now export toolbar should be visible on mobile
    await expect(exportButton).toBeVisible()
  })

  test('should expand export options when export button is clicked', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Generate calendar
    await page.getByRole('button', { name: '14 days on / 14 days off' }).click()
    await page.getByRole('button', { name: 'Generate Calendar' }).click()
    await page.waitForSelector('[aria-label*="month calendar grid"]')
    
    // Initially, export options panel should not be visible
    const exportOptionsTitle = page.locator('h3', { hasText: 'Export Calendar' })
    await expect(exportOptionsTitle).not.toBeVisible()
    
    // Click export button
    const exportButton = page.locator('button[aria-label="Export"]')
    await exportButton.click()
    
    // Export options should now be visible
    await expect(exportOptionsTitle).toBeVisible()
    
    // All format options should be visible
    await expect(page.locator('text=PNG Image')).toBeVisible()
    await expect(page.locator('text=PDF Document')).toBeVisible()
    await expect(page.locator('text=Add to Calendar')).toBeVisible()
  })

  test('should allow format selection and show correct options', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Generate calendar and open export panel
    await page.getByRole('button', { name: '14 days on / 14 days off' }).click()
    await page.getByRole('button', { name: 'Generate Calendar' }).click()
    await page.waitForSelector('[aria-label*="month calendar grid"]')
    await page.locator('button[aria-label="Export"]').click()
    
    // Test PNG format selection
    const pngOption = page.locator('input[value="png"]')
    await pngOption.click()
    await expect(pngOption).toBeChecked()
    
    // Test PDF format selection
    const pdfOption = page.locator('input[value="pdf"]')
    await pdfOption.click()
    await expect(pdfOption).toBeChecked()
    await expect(pngOption).not.toBeChecked()
    
    // Test ICS format selection
    const icsOption = page.locator('input[value="ics"]')
    await icsOption.click()
    await expect(icsOption).toBeChecked()
    await expect(pdfOption).not.toBeChecked()
  })

  test('should show export button with correct text and handle download', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Generate calendar and open export panel
    await page.getByRole('button', { name: '14 days on / 14 days off' }).click()
    await page.getByRole('button', { name: 'Generate Calendar' }).click()
    await page.waitForSelector('[aria-label*="month calendar grid"]')
    await page.locator('button[aria-label="Export"]').click()
    
    // Check initial export button text
    const exportButton = page.locator('button', { hasText: 'Export Calendar' })
    await expect(exportButton).toBeVisible()
    
    // Select PNG format
    await page.locator('input[value="png"]').click()
    
    // Listen for download
    const downloadPromise = page.waitForEvent('download')
    
    // Click export button
    await exportButton.click()
    
    // Verify download starts (text changes to "Exporting...")
    await expect(page.locator('button', { hasText: 'Exporting...' })).toBeVisible({ timeout: 5000 })
    
    // Wait for download to complete
    const download = await downloadPromise
    expect(download.suggestedFilename()).toMatch(/.*\.png$/)
  })

  test('should show different loading text for ICS format', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Generate calendar and open export panel
    await page.getByRole('button', { name: '14 days on / 14 days off' }).click()
    await page.getByRole('button', { name: 'Generate Calendar' }).click()
    await page.waitForSelector('[aria-label*="month calendar grid"]')
    await page.locator('button[aria-label="Export"]').click()
    
    // Select ICS format
    await page.locator('input[value="ics"]').click()
    
    // Listen for download
    const downloadPromise = page.waitForEvent('download')
    
    // Click export button
    const exportButton = page.locator('button', { hasText: 'Export Calendar' })
    await exportButton.click()
    
    // Verify loading text is "Creating..." for ICS
    await expect(page.locator('button', { hasText: 'Creating...' })).toBeVisible({ timeout: 5000 })
    
    // Wait for download to complete
    const download = await downloadPromise
    expect(download.suggestedFilename()).toMatch(/.*\.ics$/)
  })

  test('should close export panel when backdrop is clicked', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Generate calendar and open export panel
    await page.getByRole('button', { name: '14 days on / 14 days off' }).click()
    await page.getByRole('button', { name: 'Generate Calendar' }).click()
    await page.waitForSelector('[aria-label*="month calendar grid"]')
    await page.locator('button[aria-label="Export"]').click()
    
    // Export panel should be visible
    const exportOptionsTitle = page.locator('h3', { hasText: 'Export Calendar' })
    await expect(exportOptionsTitle).toBeVisible()
    
    // Click backdrop to close
    await page.locator('.fixed.inset-0.bg-black\\/20').click()
    
    // Panel should be closed
    await expect(exportOptionsTitle).not.toBeVisible()
  })

  test('should close export panel when close button is clicked', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Generate calendar and open export panel
    await page.getByRole('button', { name: '14 days on / 14 days off' }).click()
    await page.getByRole('button', { name: 'Generate Calendar' }).click()
    await page.waitForSelector('[aria-label*="month calendar grid"]')
    await page.locator('button[aria-label="Export"]').click()
    
    // Export panel should be visible
    const exportOptionsTitle = page.locator('h3', { hasText: 'Export Calendar' })
    await expect(exportOptionsTitle).toBeVisible()
    
    // Click close button (ChevronUp icon)
    await page.locator('.p-2.rounded-full.hover\\:bg-gray-100').click()
    
    // Panel should be closed
    await expect(exportOptionsTitle).not.toBeVisible()
  })

  test('should close export panel after successful export', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Generate calendar and open export panel
    await page.getByRole('button', { name: '14 days on / 14 days off' }).click()
    await page.getByRole('button', { name: 'Generate Calendar' }).click()
    await page.waitForSelector('[aria-label*="month calendar grid"]')
    await page.locator('button[aria-label="Export"]').click()
    
    // Export panel should be visible
    const exportOptionsTitle = page.locator('h3', { hasText: 'Export Calendar' })
    await expect(exportOptionsTitle).toBeVisible()
    
    // Select format and export
    await page.locator('input[value="png"]').click()
    
    // Listen for download
    const downloadPromise = page.waitForEvent('download')
    
    // Click export button
    await page.locator('button', { hasText: 'Export Calendar' }).click()
    
    // Wait for download to complete
    await downloadPromise
    
    // Panel should be closed after export
    await expect(exportOptionsTitle).not.toBeVisible()
  })

  test('should maintain proper touch interactions on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Generate calendar
    await page.getByRole('button', { name: '14 days on / 14 days off' }).click()
    await page.getByRole('button', { name: 'Generate Calendar' }).click()
    await page.waitForSelector('[aria-label*="month calendar grid"]')
    
    // Test export button touch interaction
    const exportButton = page.locator('button[aria-label="Export"]')
    
    // Simulate touch tap
    await exportButton.tap()
    
    // Export panel should open
    await expect(page.locator('h3', { hasText: 'Export Calendar' })).toBeVisible()
    
    // Test format option touch interaction
    const formatOption = page.locator('label').filter({ hasText: 'PNG Image' })
    await formatOption.tap()
    
    // Format should be selected
    await expect(page.locator('input[value="png"]')).toBeChecked()
  })

  test('should not show export toolbar on desktop view', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1024, height: 768 })
    
    // Generate calendar
    await page.getByRole('button', { name: '14 days on / 14 days off' }).click()
    await page.getByRole('button', { name: 'Generate Calendar' }).click()
    await page.waitForSelector('[aria-label*="month calendar grid"]')
    
    // Export toolbar should not be visible on desktop
    const exportButton = page.locator('button[aria-label="Export"]')
    await expect(exportButton).not.toBeVisible()
  })
})