import { test, expect } from '@playwright/test';

test.describe('Compliance Features', () => {
  test('should show login page when accessing protected routes', async ({ page }) => {
    // Test that protected routes redirect to login
    await page.goto('/documents');
    await expect(page).toHaveURL(/.*\/login/);
    await expect(page.locator('h3:has-text("Sign In")')).toBeVisible();
  });

  test('should show login page when accessing training route', async ({ page }) => {
    await page.goto('/training');
    await expect(page).toHaveURL(/.*\/login/);
    await expect(page.locator('h3:has-text("Sign In")')).toBeVisible();
  });

  test('should show login page when accessing audit route', async ({ page }) => {
    await page.goto('/audit');
    await expect(page).toHaveURL(/.*\/login/);
    await expect(page.locator('h3:has-text("Sign In")')).toBeVisible();
  });

  test('should allow navigation between auth pages', async ({ page }) => {
    // Test navigation between login and signup
    await page.goto('/login');
    await expect(page.locator('h3:has-text("Sign In")')).toBeVisible();
    
    await page.click('a[href="/signup"]');
    await expect(page).toHaveURL(/.*\/signup/);
    await expect(page.locator('h3:has-text("Create Account")')).toBeVisible();
    
    // Go back to login
    await page.click('a[href="/login"]');
    await expect(page).toHaveURL(/.*\/login/);
    await expect(page.locator('h3:has-text("Sign In")')).toBeVisible();
  });
}); 