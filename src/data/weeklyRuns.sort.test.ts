// ABOUTME: Comparator guard for the newest-first sort in weeklyRuns.ts — the shipped snapshot
// ABOUTME: has a single run, so only this mocked multi-entry fixture can catch a reversed sort.
import { describe, expect, it, vi } from 'vitest';
import { WEEKLY_RUNS } from './weeklyRuns';

// File-order is deliberately oldest-first here: the Saturday cron appends, it does not sort.
vi.mock('./weeklyRuns.json', () => ({
  default: {
    runs: [
      {
        date: '2026-08-08',
        windowStart: '2026-08-03',
        windowLabel: 'this week (since 2026-08-03)',
        summary: 'Older run.',
        docPath: '/artifact-docs/weekly/2026-08-08.html',
      },
      {
        date: '2026-08-15',
        windowStart: '2026-08-09',
        windowLabel: 'this week (since 2026-08-09)',
        summary: 'Newer run.',
        docPath: '/artifact-docs/weekly/2026-08-15.html',
      },
    ],
  },
}));

describe('WEEKLY_RUNS sort comparator', () => {
  it('orders an appended (oldest-first) snapshot newest-first', () => {
    expect(WEEKLY_RUNS.map((r) => r.date)).toEqual(['2026-08-15', '2026-08-08']);
  });
});
