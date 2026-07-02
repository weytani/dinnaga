// ABOUTME: Pure friction engine for the /loadout bench — synergies, conflicts, hazards,
// ABOUTME: drift, and context load computed from the real isolation masks in zords.json.
import type {
  Capacity,
  ConflictFinding,
  FrictionReport,
  Hazard,
  Synergy,
  Zord,
  ZordConflict,
  ZordStack,
} from '../types';

export interface FrictionInput {
  conflicts: ZordConflict[];
  stacks: ZordStack[];
  capacity: Capacity;
  sharedSinks: string[];
}

export function conflictKey(a: string, b: string): string {
  return [a, b].sort().join('~');
}

function intersect(a: string[], b: string[], exempt: string[]): string[] {
  const inB = new Set(b);
  const skip = new Set(exempt);
  return a.filter((s) => inB.has(s) && !skip.has(s));
}

function commonStack(a: string, b: string, stacks: ZordStack[]): ZordStack | undefined {
  return stacks.find((s) => s.members.includes(a) && s.members.includes(b));
}

export function analyze(
  equipped: Zord[],
  input: FrictionInput,
  resolved: ReadonlySet<string>,
): FrictionReport {
  const synergies: Synergy[] = [];
  const conflicts: ConflictFinding[] = [];
  const hazards: Hazard[] = [];
  let contamination = 0;

  for (let i = 0; i < equipped.length; i++) {
    for (let j = i + 1; j < equipped.length; j++) {
      const a = equipped[i];
      const b = equipped[j];
      if (!a || !b) continue;

      contamination += intersect(a.isolation.writes, b.isolation.writes, input.sharedSinks).length;

      const reg = input.conflicts.find(
        (c) => conflictKey(c.a, c.b) === conflictKey(a.name, b.name),
      );
      if (reg) conflicts.push({ conflict: reg, resolved: resolved.has(conflictKey(reg.a, reg.b)) });

      const stack = commonStack(a.name, b.name, input.stacks);
      if (!stack) {
        const ab = intersect(a.isolation.reads, b.isolation.writes, input.sharedSinks);
        if (ab.length > 0) hazards.push({ reader: a.name, writer: b.name, slices: ab });
        const ba = intersect(b.isolation.reads, a.isolation.writes, input.sharedSinks);
        if (ba.length > 0) hazards.push({ reader: b.name, writer: a.name, slices: ba });
      }

      const shared = a.improves.filter((t) => b.improves.includes(t));
      if (shared.length > 0 && a.layer !== b.layer) {
        synergies.push({
          a: a.name,
          b: b.name,
          on: shared,
          stackName: stack && shared.includes(stack.on) ? stack.name : null,
        });
      }
    }
  }

  const unresolvedCount = conflicts.filter((c) => !c.resolved).length;
  const drift = Math.max(0, Math.min(input.capacity.driftMax, contamination + 2 * unresolvedCount));
  const contextLoad = equipped.reduce((sum, z) => sum + z.contextCostTokens, 0);
  const overBudget = contextLoad > input.capacity.contextBudgetTokens;
  const coverage = [...new Set(equipped.flatMap((z) => z.improves))];

  return {
    synergies,
    conflicts,
    hazards,
    drift,
    contextLoad,
    overBudget,
    coverage,
    unstable: overBudget || drift >= input.capacity.driftMax,
  };
}
