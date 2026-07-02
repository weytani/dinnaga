// ABOUTME: Tests for all static content data files (practices, surfaceData, etc.).
// ABOUTME: Verifies shape, length, and category constraints for each data export.
import { describe, expect, it } from 'vitest';
import { PRACTICES } from './practices';
import { SURFACE_DATA } from './surfaceData';
import { TICKER_ITEMS } from './tickerItems';
import { BOOT_LINES } from './bootLines';
import { NAV_LINKS } from './navLinks';

describe('content data files', () => {
  it('ships three practices', () => {
    expect(PRACTICES).toHaveLength(3);
    expect(PRACTICES.map((p) => p.icon)).toEqual(['ethos', 'method', 'atisha']);
  });

  it('ships seven surface-data rows, including the registry row', () => {
    expect(SURFACE_DATA).toHaveLength(7);
    const registry = SURFACE_DATA.find((r) => r.idx === '07');
    expect(registry?.label).toBe('Registry');
    expect(registry?.value).toBe('13 implants · 12 papers reproduced · nothing wired live');
  });

  it('ships ticker items, boot lines, and nav links', () => {
    expect(TICKER_ITEMS.length).toBeGreaterThan(0);
    expect(BOOT_LINES.length).toBeGreaterThan(0);
    expect(NAV_LINKS.map((l) => l.to)).toEqual(['/atisha', '/method', '/colophon', '/loadout']);
  });

  it('ships exactly eight ticker items, with the bench line present', () => {
    expect(TICKER_ITEMS).toHaveLength(8);
    expect(TICKER_ITEMS).toContain('▸ RIPPERDOC BENCH — OPEN FOR BUSINESS');
  });

  it('mounts the ripperdoc bench right after the Atisha index boot line', () => {
    const atishaIdx = BOOT_LINES.findIndex((l) => l.text.startsWith('LOADING ATISHA INDEX'));
    expect(atishaIdx).toBeGreaterThanOrEqual(0);
    expect(BOOT_LINES[atishaIdx + 1]?.text).toBe('MOUNTING RIPPERDOC BENCH ....  OK');
  });
});
