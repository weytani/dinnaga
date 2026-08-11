// ABOUTME: Typed loader for the vendored weekly run-log snapshot (weeklyRuns.json) — appended
// ABOUTME: by the Saturday week-in-review publish step; nothing regenerates it at build time.
import raw from './weeklyRuns.json';
import type { WeeklyRun } from '../types';

interface WeeklyRunsDoc {
  runs: WeeklyRun[];
}

const doc = raw as unknown as WeeklyRunsDoc;

// Newest-first regardless of file order — the cron appends, it does not sort.
export const WEEKLY_RUNS: WeeklyRun[] = [...doc.runs].sort((a, b) => b.date.localeCompare(a.date));

export function weeklyRunByDate(date: string): WeeklyRun | undefined {
  return WEEKLY_RUNS.find((r) => r.date === date);
}
