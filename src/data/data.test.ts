// ABOUTME: Tests for all static content data files (fieldNotes, practices, surfaceData, etc.).
// ABOUTME: Verifies shape, length, and category constraints for each data export.
import { describe, expect, it } from 'vitest';
import { FIELD_NOTES } from './fieldNotes';
import { PRACTICES } from './practices';
import { SURFACE_DATA } from './surfaceData';
import { TICKER_ITEMS } from './tickerItems';
import { BOOT_LINES } from './bootLines';
import { NAV_LINKS } from './navLinks';

const CATEGORIES = ['RESEARCH', 'EDUCATION', 'CONSULTING'];

describe('content data files', () => {
  it('ships four field notes with valid categories', () => {
    expect(FIELD_NOTES).toHaveLength(4);
    for (const note of FIELD_NOTES) {
      expect(CATEGORIES).toContain(note.cat);
    }
  });

  it('ships three practices', () => {
    expect(PRACTICES).toHaveLength(3);
    expect(PRACTICES.map((p) => p.icon)).toEqual(['research', 'education', 'consulting']);
  });

  it('ships six surface-data rows', () => {
    expect(SURFACE_DATA).toHaveLength(6);
  });

  it('ships ticker items, boot lines, and nav links', () => {
    expect(TICKER_ITEMS.length).toBeGreaterThan(0);
    expect(BOOT_LINES.length).toBeGreaterThan(0);
    expect(NAV_LINKS.map((l) => l.to)).toEqual(['/atisha', '/method', '/colophon']);
  });
});
