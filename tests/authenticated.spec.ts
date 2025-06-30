import { test, expect } from '@playwright/test';

const TEST_EMAIL = 'deepak14022003@gmail.com';
const TEST_PASSWORD = 'deepak2003';

test.describe('Authenticated Features', () => {
  test.beforeEach(async ({ page }) => {
    console.log('🔍 Starting login process...');
    
    await page.goto('/login');
    console.log('📍 Navigated to login page:', page.url());
    
    // Add logging for form filling
    await page.fill('input[type="email"]', TEST_EMAIL);
    await page.fill('input[type="password"]', TEST_PASSWORD);
    console.log('📝 Filled login form with credentials');
    
    // Log button state before click
    const submitButton = page.locator('button[type="submit"]');
    const isDisabled = await submitButton.isDisabled();
    console.log('🔘 Submit button disabled state before click:', isDisabled);
    
    // Click and wait for navigation with logging
    console.log('🖱️ Clicking submit button...');
    
    // Wait for navigation to complete with detailed logging
    const navigationPromise = page.waitForURL((url) => {
      console.log('🔄 URL changed to:', url.toString());
      return !url.pathname.includes('/login');
    }, { timeout: 15000 });
    
    await submitButton.click();
    console.log('✅ Submit button clicked');
    
    try {
      await navigationPromise;
      console.log('✅ Navigation completed successfully');
    } catch (error) {
      console.log('❌ Navigation failed:', error.message);
      
      // Log current state for debugging
      const currentUrl = page.url();
      console.log('📍 Current URL:', currentUrl);
      
      // Check if we're still on login page
      if (currentUrl.includes('/login')) {
        console.log('⚠️ Still on login page, checking for errors...');
        
        // Check for error messages
        const errorElement = page.locator('.text-red-600, [role="alert"], .text-destructive');
        if (await errorElement.isVisible()) {
          const errorText = await errorElement.textContent();
          console.log('❌ Login error found:', errorText);
          throw new Error(`Login failed: ${errorText}`);
        }
        
        // Check if button is still there and its state
        const buttonStillExists = await submitButton.isVisible();
        console.log('🔘 Submit button still visible:', buttonStillExists);
        
        if (buttonStillExists) {
          const buttonDisabled = await submitButton.isDisabled();
          console.log('🔘 Submit button disabled state:', buttonDisabled);
        }
        
        throw new Error('Login failed: Still on login page without error message');
      }
    }
    
    // Wait for page to be fully loaded
    console.log('⏳ Waiting for page to be fully loaded...');
    await page.waitForLoadState('networkidle');
    console.log('✅ Page fully loaded');
    
    // Verify we're on the dashboard
    const finalUrl = page.url();
    console.log('📍 Final URL:', finalUrl);
    
    if (!finalUrl.includes('/login')) {
      console.log('✅ Successfully authenticated and on dashboard');
    }
  });

  test('should display dashboard after login', async ({ page }) => {
    await expect(page.locator('text=Compliance Dashboard')).toBeVisible();
    await expect(page.locator('[role="tab"]')).toHaveCount(5);
  });

  test('should navigate between dashboard tabs', async ({ page }) => {
    // Click on different tabs
    await page.click('text=Document Scanner');
    await expect(page.locator('textarea')).toBeVisible();
    await page.click('text=Training');
    await expect(page.locator('text=Training Modules')).toBeVisible();

    // Log all tab texts
    const tabs = page.locator('[role="tab"]');
    const count = await tabs.count();
    for (let i = 0; i < count; i++) {
      const text = await tabs.nth(i).textContent();
      console.log(`Tab ${i}: "${text}"`);
    }

    // Click Modules tab (not Analytics)
    const modulesTab = page.locator('[role="tab"]:has-text("Modules")');
    console.log('Waiting for Modules tab to be visible...');
    await modulesTab.waitFor({ state: 'visible', timeout: 10000 });
    console.log('Clicking Modules tab...');
    await modulesTab.click();
    
    // Wait for any content to load after clicking Modules tab
    await page.waitForLoadState('networkidle');
    
    // Since Modules tab navigates to a different page, check for training-related content
    // The Modules tab likely navigates to the training page
    // Use a more specific selector to avoid strict mode violation
    await expect(page.locator('h1:has-text("Training")')).toBeVisible();
  });

  test('should access documents page', async ({ page }) => {
    await page.goto('/documents');
    await expect(page.locator('text=Document Upload')).toBeVisible();
    await expect(page.locator('input[type="file"]')).toBeVisible();
  });

  test('should access training page', async ({ page }) => {
    await page.goto('/training');
    await expect(page.locator('text=Training Modules')).toBeVisible();
  });

  test('should access audit page', async ({ page }) => {
    await page.goto('/audit');
    await expect(page.locator('h1:has-text("Audit Trail")')).toBeVisible();
  });
});