import { expect, test } from '@playwright/test';

test('renders the homepage hero and lab sections', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Validated, then shared.' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'How the lab works.' })).toBeVisible();
  await expect(page.getByText(/© 2026 DINNAGA/)).toBeVisible();
});

test('dismisses the cookie banner', async ({ page }) => {
  await page.goto('/');
  const banner = page.locator('.cookie');
  await expect(banner).not.toHaveClass(/is-dismissed/);
  await page.getByRole('button', { name: 'Accept' }).click();
  await expect(banner).toHaveClass(/is-dismissed/);
});

test('removes the travelling green square after the mount animation', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.green-square')).toHaveCount(0, { timeout: 3000 });
});

test('nav links route between pages', async ({ page }) => {
  await page.goto('/');
  await page.locator('.nav-links').getByRole('link', { name: 'ATISHA' }).click();
  await expect(page).toHaveURL(/\/atisha$/);
  await expect(page.getByRole('heading', { name: /Atisha Initiative/i })).toBeVisible();
});
