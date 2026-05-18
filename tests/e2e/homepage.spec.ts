import { expect, test } from '@playwright/test';

test('renders every homepage section', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Research for the rest of us.' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Three quiet practices.' })).toBeVisible();
  await expect(page.getByRole('heading', { name: "What we've been writing." })).toBeVisible();
  await expect(page.getByText('© 2026 DINNAGA RESEARCH')).toBeVisible();
});

test('dismisses the cookie banner', async ({ page }) => {
  await page.goto('/');
  const banner = page.locator('.cookie');
  await expect(banner).not.toHaveClass(/is-dismissed/);
  await page.getByRole('button', { name: 'Accept' }).click();
  await expect(banner).toHaveClass(/is-dismissed/);
});

test('filters field notes with the RESEARCH chip', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.note')).toHaveCount(4);
  await page.getByRole('button', { name: 'RESEARCH', exact: true }).click();
  await expect(page.locator('.note')).toHaveCount(2);
});

test('removes the travelling green square after the mount animation', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.green-square')).toHaveCount(0, { timeout: 3000 });
});
