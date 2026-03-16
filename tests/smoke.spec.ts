import { test, expect } from '@playwright/test';

test('Smoke Test - Project Load', async ({ page }) => {
  // Increase timeout for this specific test
  test.slow();
  
  console.log('Navigating to practice test site...');
  await page.goto('https://practicetestautomation.com/practice-test-login/', { 
    waitUntil: 'domcontentloaded',
    timeout: 30000 
  });
  
  // Wait for the heading to be visible
  await expect(page.locator('h2')).toContainText('Test login', { timeout: 15000 });
  
  console.log('Smoke test passed successfully.');
});
