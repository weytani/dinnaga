// ABOUTME: Typed loader for the vendored megazord snapshot (zords.json) — regenerate with
// ABOUTME: `~/code/megazord/bin/megazord export-json --out src/data/zords.json` (manual sync).
import raw from './zords.json';
import type { Capacity, Slot, Zord, ZordConflict, ZordStack } from '../types';

interface ZordsDoc {
  generated: string;
  costBasis: string;
  capacity: Capacity;
  sharedSinks: string[];
  slots: Slot[];
  zords: Zord[];
  conflicts: ZordConflict[];
  stacks: ZordStack[];
}

const doc = raw as unknown as ZordsDoc;

export const GENERATED = doc.generated;
export const COST_BASIS = doc.costBasis;
export const CAPACITY = doc.capacity;
export const SHARED_SINKS = doc.sharedSinks;
export const SLOTS = doc.slots;
export const ZORDS = doc.zords;
export const CONFLICTS = doc.conflicts;
export const STACKS = doc.stacks;

export function zordByName(name: string): Zord | undefined {
  return ZORDS.find((z) => z.name === name);
}

export function candidatesForSlot(slotId: string): Zord[] {
  return ZORDS.filter((z) => z.slot === slotId);
}
