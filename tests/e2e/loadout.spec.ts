import { expect, test } from '@playwright/test';

test.describe('/loadout ripperdoc bench', () => {
  test('equip → conflict → resolve → share URL restores the build', async ({ page }) => {
    await page.goto('/loadout');
    await page.getByRole('button', { name: /skip boot/i }).click();

    await page.getByRole('button', { name: /^L1 / }).click();
    await page.getByRole('button', { name: /genome — inspect implant/i }).click();
    await page.getByRole('button', { name: /^install/i }).click();

    await page.getByRole('button', { name: /^L3 / }).click();
    await page.getByRole('button', { name: /funes — inspect implant/i }).click();
    await page.getByRole('button', { name: /^install/i }).click();

    await page.getByRole('button', { name: /^L4 / }).click();
    await page.getByRole('button', { name: /hler — inspect implant/i }).click();
    await page.getByRole('button', { name: /^install/i }).click();

    await expect(page.getByText(/funes ⟷ hler/)).toBeVisible();
    await expect(page.locator('.lo-build-name')).toHaveText(/Reliability Spine/);

    await page.getByRole('button', { name: /resolve — apply isolation mask/i }).click();
    await expect(page.getByText(/✓ resolved/)).toBeVisible();

    const url = page.url();
    const params = new URL(url).searchParams;
    // `~` is percent-encoded (%7E) by URLSearchParams' application/x-www-form-urlencoded
    // serialization — parse the URL instead of substring-matching the raw query string.
    expect(params.get('b')).toBe('L1genome_L3funes_L4hler');
    expect(params.get('r')).toBe('funes~hler');

    await page.goto(url);
    await page.getByRole('button', { name: /skip boot/i }).click();
    await expect(page.getByText('GNM·FNS·HLR')).toBeVisible();
    await expect(page.getByText(/✓ resolved/)).toBeVisible();
  });

  test('reduced motion renders the bench without a boot animation', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/loadout');
    await expect(page.getByRole('heading', { name: 'Loadout.' })).toBeVisible();
    await expect(page.locator('.lo-boot')).toHaveCount(0, { timeout: 5000 });
  });

  test('unstable build stamps but never blocks', async ({ page }) => {
    // Max legal loadout (one per single slot + all diagnostics) overflows the context budget.
    const b = [
      'L1genome', 'L2openskill', 'L2.5gauntlet', 'L2.7yeetriever', 'L3thonktank', 'L4hler',
      'DIAGblamethrower', 'DIAGgumshoe', 'DIAGskidmark-leak', 'DIAGskidmark-traj',
    ].join('_');
    await page.goto(`/loadout?b=${b}`);
    await page.getByRole('button', { name: /skip boot/i }).click();
    // The compromised phrase renders in both the HUD title and the glitch-panel alert —
    // scope to the first match (the HUD title) to avoid a strict-mode multi-match error.
    await expect(page.getByText('HARNESS INTEGRITY COMPROMISED').first()).toBeVisible();
    await expect(page.getByText(/I'm sorry, Dave/)).toBeVisible();
    await expect(page.getByText(/unstable build/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /share/i })).toBeEnabled();
  });
});
