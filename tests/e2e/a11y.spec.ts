import { expect, test } from '@playwright/test';

test('exposes a skip-to-content link', async ({ page }) => {
  await page.goto('/');
  const skip = page.getByRole('link', { name: /skip to content/i });
  await expect(skip).toHaveAttribute('href', '#main');
});

test('renders exactly one main landmark on the homepage', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('main')).toHaveCount(1);
});

test('renders exactly one main landmark on an inner route', async ({ page }) => {
  await page.goto('/atisha');
  await expect(page.locator('main')).toHaveCount(1);
});

test('honours reduced-motion (no travelling green square)', async ({ page }) => {
  // Emulate the reduced-motion preference before the app mounts so the
  // green square's mount-time matchMedia check never schedules the motion.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.green-square')).toHaveCount(0);
});
