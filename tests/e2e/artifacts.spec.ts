import { expect, test } from '@playwright/test';

test('/artifacts lists the report and clicking navigates to the viewer', async ({ page }) => {
  await page.goto('/artifacts');
  await expect(page.getByText(/84-dish portfolio test kitchen/)).toBeVisible();
  await page.getByRole('link', { name: /SLAMWICH Tasting Report/ }).click();
  await expect(page).toHaveURL(/\/artifacts\/slamwich-tasting-report$/);
  await expect(
    page.getByRole('heading', { name: /SLAMWICH Tasting Report/i }),
  ).toBeVisible();
});

test('deep link to the viewer resolves on hard load', async ({ page }) => {
  await page.goto('/artifacts/slamwich-tasting-report');
  await expect(
    page.getByRole('heading', { name: /SLAMWICH Tasting Report/i }),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: /open standalone/i })).toHaveAttribute(
    'href',
    '/artifacts/slamwich-tasting-report.html',
  );
});

test('the viewer iframe loads the actual report document', async ({ page }) => {
  await page.goto('/artifacts/slamwich-tasting-report');
  const frame = page.frameLocator('iframe[title="SLAMWICH Tasting Report"]');
  await expect(
    frame.getByRole('heading', {
      name: /What 84 rebuilds of 28 acclaimed portfolios teach about design/i,
    }),
  ).toBeVisible();
});

test('the raw doc is served as a static file', async ({ page }) => {
  const res = await page.request.get('/artifacts/slamwich-tasting-report.html');
  expect(res.ok()).toBe(true);
  const text = await res.text();
  expect(text).toContain('<!doctype html>');
  expect(text).toContain('SLAMWICH Tasting Report');
});

test('renders exactly one main landmark on both artifact routes', async ({ page }) => {
  await page.goto('/artifacts');
  await expect(page.locator('main')).toHaveCount(1);
  await page.goto('/artifacts/slamwich-tasting-report');
  await expect(page.locator('main')).toHaveCount(1);
});
