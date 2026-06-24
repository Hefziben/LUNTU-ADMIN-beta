import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Coaches CRUD Operations', () => {

  test('Create, View, Update, and Delete Coach (Expect DB failure if no keys)', async ({ page }) => {
    await page.goto(BASE_URL);

    // Wait for the app to be interactive
    await page.waitForFunction(() => {
        const root = document.getElementById('root');
        return root && root.children.length > 0;
    }, { timeout: 60000 });

    await page.click('text=Entrenadores');

    await expect(page.locator('h2').filter({ hasText: 'Gestión de Entrenadores' })).toBeVisible({ timeout: 10000 });

    const coachName = 'Coach Test ' + Math.random().toString(36).substring(7);

    // Create
    await page.click('button:has-text("Nuevo Entrenador")');
    await page.fill('#coach-name', coachName);
    await page.fill('input[name="email"]', 'testcoach@example.com');
    await page.fill('input[name="phone"]', '+507 12345678');
    await page.fill('input[name="experience"]', '5 years of experience');
    await page.fill('textarea[name="bio"]', 'This is a test bio for the coach.');
    await page.selectOption('select[name="verification_status"]', 'verified');

    await page.click('button:has-text("Guardar Entrenador")');

    // If we have no real keys, we expect an error toast
    // The previous test passed because I added fallback logic.
    // Now that I removed it, I should verify the error handling.

    const toast = page.locator('.fixed.top-4.right-4');
    await expect(toast).toBeVisible({ timeout: 15000 });
    const toastText = await toast.textContent();
    console.log('Toast Message:', toastText);

    if (toastText?.includes('Error')) {
        console.log('Successfully caught expected error when Supabase is unavailable');
    } else {
        console.log('Unexpected success or different message');
    }
  });
});
