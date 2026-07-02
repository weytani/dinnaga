// ABOUTME: Shared TypeScript types for Dinnaga site content.
// ABOUTME: Consumed by data files in src/data/ and the components that render them.

export type PracticeIconName = 'ethos' | 'method' | 'atisha';

export interface Practice {
  num: string;
  title: string;
  icon: PracticeIconName;
  summary: string;
  body: string;
  meta: string;
}

export interface DataRow {
  idx: string;
  label: string;
  value: string;
}

export interface BootLine {
  text: string;
  delay: number;
}

export interface NavLink {
  label: string;
  to: string;
}

export type AtishaCategory = 'skill' | 'tool' | 'method' | 'paper';

export interface AtishaEntry {
  slug: string;
  title: string;
  category: AtishaCategory;
  oneLiner: string;
  sourceUrl: string;
  validatedOn: string;
  whyUseful: string;
  howValidated: string;
  // '' = first-party / no credit; non-empty = the third-party owner to credit.
  attribution: string;
}

export type Tier = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type Provenance = 'measured' | 'rated' | 'derived' | 'reproduced';
export interface ZordStat {
  label: string;
  value: string;
  provenance: Provenance;
}
export interface ZordIsolation {
  reads: string[];
  writes: string[];
}
export interface Zord {
  name: string;
  code: string;
  slot: string;
  layer: string;
  hookPoints: string[];
  manufacturer: string;
  tier: Tier;
  method: string[];
  improves: string[];
  isolation: ZordIsolation;
  contextCostTokens: number;
  tests: number;
  faithful: string;
  headline: string;
  stats: ZordStat[];
  flavor: string;
  paper: string;
  requiresCalibration: boolean;
}
export interface Slot {
  id: string;
  system: string;
  layer: string;
  single: boolean;
}
export interface ZordConflict {
  a: string;
  b: string;
  kind: string;
  why: string;
  resolution: string;
}
export interface ZordStack {
  members: string[];
  on: string;
  name: string;
}
export interface Capacity {
  contextBudgetTokens: number;
  driftMax: number;
}
export interface LoadoutEntry {
  slot: string;
  zord: string;
}
export type Loadout = LoadoutEntry[];
export interface Synergy {
  a: string;
  b: string;
  on: string[];
  stackName: string | null;
}
export interface ConflictFinding {
  conflict: ZordConflict;
  resolved: boolean;
}
export interface Hazard {
  reader: string;
  writer: string;
  slices: string[];
}
export interface FrictionReport {
  synergies: Synergy[];
  conflicts: ConflictFinding[];
  hazards: Hazard[];
  drift: number;
  contextLoad: number;
  overBudget: boolean;
  coverage: string[];
  unstable: boolean;
}
