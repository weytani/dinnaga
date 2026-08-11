// ABOUTME: Runtime schema guard for the unchecked `raw as unknown as WeeklyRunsDoc` cast in
// ABOUTME: weeklyRuns.ts — catches a malformed snapshot in CI instead of at render time.
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { WEEKLY_RUNS } from './weeklyRuns';

const PUBLIC_DIR = join(__dirname, '..', '..', 'public');
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function nonEmptyString(value: unknown): boolean {
  return typeof value === 'string' && value.length > 0;
}

describe('weeklyRuns.json schema', () => {
  it('ships at least one run', () => {
    expect(WEEKLY_RUNS.length).toBeGreaterThan(0);
  });

  it('every run has non-empty core fields', () => {
    for (const r of WEEKLY_RUNS) {
      expect(nonEmptyString(r.date), `${r.date}.date`).toBe(true);
      expect(nonEmptyString(r.windowStart), `${r.date}.windowStart`).toBe(true);
      expect(nonEmptyString(r.windowLabel), `${r.date}.windowLabel`).toBe(true);
      expect(nonEmptyString(r.summary), `${r.date}.summary`).toBe(true);
      expect(nonEmptyString(r.docPath), `${r.date}.docPath`).toBe(true);
    }
  });

  it('every run date and windowStart are ISO yyyy-mm-dd', () => {
    for (const r of WEEKLY_RUNS) {
      expect(r.date, `${r.date}.date`).toMatch(ISO_DATE);
      expect(r.windowStart, `${r.date}.windowStart`).toMatch(ISO_DATE);
    }
  });

  it('run dates are unique', () => {
    const dates = WEEKLY_RUNS.map((r) => r.date);
    expect(new Set(dates).size).toBe(dates.length);
  });

  it('WEEKLY_RUNS is sorted newest-first regardless of file order', () => {
    for (let i = 1; i < WEEKLY_RUNS.length; i++) {
      const prev = WEEKLY_RUNS[i - 1];
      const curr = WEEKLY_RUNS[i];
      expect(prev && curr && prev.date > curr.date, `index ${i}`).toBe(true);
    }
  });

  it('every docPath is root-relative and resolves to a file under public/', () => {
    for (const r of WEEKLY_RUNS) {
      expect(r.docPath.startsWith('/'), `${r.date}.docPath`).toBe(true);
      expect(existsSync(join(PUBLIC_DIR, r.docPath)), `${r.date}.docPath`).toBe(true);
    }
  });

  it('no docPath lives inside the /weekly or /artifacts route namespaces', () => {
    // Static-host extensionless resolution (e.g. vite preview) would let a doc at
    // /weekly/<date>.html shadow the /weekly/<date> viewer route.
    for (const r of WEEKLY_RUNS) {
      expect(r.docPath.startsWith('/weekly/'), `${r.date}.docPath`).toBe(false);
      expect(r.docPath.startsWith('/artifacts/'), `${r.date}.docPath`).toBe(false);
    }
  });
});
