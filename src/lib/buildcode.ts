// ABOUTME: Build-code codec for /loadout — URL param encode/decode, display short code,
// ABOUTME: and auto-naming from a matched stack or the dominant benefit axis.
import type { Loadout, LoadoutEntry, Slot, Zord, ZordConflict, ZordStack } from '../types';
import { conflictKey } from './friction';

const SLOT_ORDER = ['L0', 'L1', 'L2', 'L2.5', 'L2.7', 'L3', 'L4', 'DIAG'];
const PART_RE = /^(DIAG|L[0-9.]+)(.+)$/;

const AXIS_NAMES: Record<string, string> = {
  'agent-reliability': 'Reliability Rig',
  'token-efficiency': 'Lean Context Rig',
  'eval-fidelity': 'Honest Gauge Rig',
  'retrieval-accuracy': 'Total Recall Rig',
  'memory-retention': 'Long Memory Rig',
  'skill-acquisition': 'Autodidact Rig',
  'multi-agent-coordination': 'Hive Mind Rig',
  'hallucination-reduction': 'Reality Anchor Rig',
  'long-context': 'Deep Field Rig',
  calibration: 'True Needle Rig',
  generalization: 'Polymath Rig',
};

function sorted(loadout: Loadout): Loadout {
  return [...loadout].sort(
    (x, y) =>
      SLOT_ORDER.indexOf(x.slot) - SLOT_ORDER.indexOf(y.slot) || x.zord.localeCompare(y.zord),
  );
}

export function encode(loadout: Loadout): string {
  return sorted(loadout)
    .map((e) => `${e.slot}${e.zord}`)
    .join('_');
}

export interface DecodeResult {
  loadout: Loadout;
  warnings: string[];
}

export function decode(param: string, zords: Zord[], slots: Slot[]): DecodeResult {
  const loadout: LoadoutEntry[] = [];
  const warnings: string[] = [];
  for (const part of param.split('_')) {
    if (!part) continue;
    const m = PART_RE.exec(part);
    const slot = m ? slots.find((s) => s.id === m[1]) : undefined;
    const zord = m ? zords.find((z) => z.name === m[2]) : undefined;
    if (!slot || !zord || zord.slot !== slot.id) {
      warnings.push(part);
      continue;
    }
    const dupe =
      loadout.some((e) => e.zord === zord.name) ||
      (slot.single && loadout.some((e) => e.slot === slot.id));
    if (dupe) {
      warnings.push(part);
      continue;
    }
    loadout.push({ slot: slot.id, zord: zord.name });
  }
  return { loadout: sorted(loadout), warnings };
}

export function shortCode(loadout: Loadout, zords: Zord[]): string {
  if (loadout.length === 0) return '—';
  return sorted(loadout)
    .map((e) => zords.find((z) => z.name === e.zord)?.code ?? '???')
    .join('·');
}

export function autoName(loadout: Loadout, zords: Zord[], stacks: ZordStack[]): string {
  if (loadout.length === 0) return 'UNPOWERED';
  const names = new Set(loadout.map((e) => e.zord));
  const full = stacks
    .filter((s) => s.members.every((m) => names.has(m)))
    .sort((a, b) => b.members.length - a.members.length)[0];
  if (full) return `The ${full.name}`;
  const counts = new Map<string, number>();
  for (const e of loadout) {
    for (const axis of zords.find((z) => z.name === e.zord)?.improves ?? []) {
      counts.set(axis, (counts.get(axis) ?? 0) + 1);
    }
  }
  let best: string | undefined;
  let bestCount = 0;
  for (const [axis, n] of counts) {
    if (n > bestCount) {
      best = axis;
      bestCount = n;
    }
  }
  return best ? (AXIS_NAMES[best] ?? `${best} rig`) : 'CUSTOM RIG';
}

export function encodeResolved(keys: ReadonlySet<string>): string {
  return [...keys].sort().join('_');
}

export function decodeResolved(param: string | null, conflicts: ZordConflict[]): Set<string> {
  const valid = new Set(conflicts.map((c) => conflictKey(c.a, c.b)));
  const out = new Set<string>();
  for (const part of (param ?? '').split('_')) {
    if (part && valid.has(part)) out.add(part);
  }
  return out;
}
