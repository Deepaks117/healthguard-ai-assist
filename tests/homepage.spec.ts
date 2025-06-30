import { test, expect } from '@playwright/test';

test.describe('HealthGuard360 Homepage', () => {
  test.beforeEach(async ({ page }) => {
    // Skip authentication for now - we'll test the login page separately
    // In a real scenario, you'd log in here
  });

  test('should load the homepage successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check if the page loads without errors
    await expect(page).toHaveTitle(/HealthGuard360/);
    
    // Since the app redirects to login when not authenticated, check for login page
    await expect(page.locator('h3:has-text("Sign In")')).toBeVisible();
  });

  test('should redirect to login when not authenticated', async ({ page }) => {
    await page.goto('/');
    
    // Should redirect to login page
    await expect(page).toHaveURL(/.*\/login/);
    await expect(page.locator('h3:has-text("Sign In")')).toBeVisible();
  });

  test('should have working navigation to signup', async ({ page }) => {
    await page.goto('/login');
    
    // Check if signup link is present and clickable
    await expect(page.locator('a[href="/signup"]')).toBeVisible();
    
    // Click on signup link to ensure it works
    await page.click('a[href="/signup"]');
    await expect(page).toHaveURL(/.*\/signup/);
    await expect(page.locator('h3:has-text("Create Account")')).toBeVisible();
  });

  test('should display main navigation sections', async ({ page }) => {
    await page.goto('/');
    
    // Check for main sections that should be on the homepage
    await expect(page.locator('text=Compliance Dashboard')).toBeVisible();
    await expect(page.locator('text=Document Scanner')).toBeVisible();
    await expect(page.locator('text=Training')).toBeVisible();
  });

  test('should have working navigation tabs', async ({ page }) => {
    await page.goto('/');
    
    // Check if tabs are present and clickable
    const tabs = page.locator('[role="tab"]');
    await expect(tabs).toHaveCount(5); // Expected number of tabs
    
    // Click on different tabs to ensure they work
    await page.click('text=Training');
    await expect(page.locator('text=Training Modules')).toBeVisible();
    
    await page.click('text=Document Scanner');
    await expect(page.locator('textarea')).toBeVisible();
  });
}); 