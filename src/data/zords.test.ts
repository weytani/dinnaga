// ABOUTME: Schema-validation tests for the vendored megazord snapshot (zords.json).
// ABOUTME: Guards shape + internal consistency — slots, tiers, refs, provenance labels.
import { describe, expect, it } from 'vitest';
import { CAPACITY, CONFLICTS, SLOTS, STACKS, ZORDS, candidatesForSlot, zordByName } from './zords';

const TIERS = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
const PROVENANCE = ['measured', 'rated', 'derived', 'reproduced'];

describe('zords.json snapshot', () => {
  it('has 22 zords and 9 slots', () => {
    expect(ZORDS).toHaveLength(22);
    expect(SLOTS.map((s) => s.id)).toEqual([
      'L0',
      'L1',
      'L2',
      'L2.5',
      'L2.7',
      'L2.8',
      'L3',
      'L4',
      'DIAG',
    ]);
  });

  it('every zord is internally valid', () => {
    const slotIds = new Set(SLOTS.map((s) => s.id));
    const codes = new Set<string>();
    for (const z of ZORDS) {
      expect(slotIds.has(z.slot), z.name).toBe(true);
      expect(TIERS).toContain(z.tier);
      expect(z.contextCostTokens).toBeGreaterThan(0);
      expect(z.tests).toBeGreaterThan(0);
      expect(z.isolation.reads.length).toBeGreaterThan(0);
      expect(z.isolation.writes.length).toBeGreaterThan(0);
      expect(z.stats.length).toBeGreaterThanOrEqual(2);
      for (const s of z.stats) expect(PROVENANCE).toContain(s.provenance);
      expect(z.code).toHaveLength(3);
      expect(codes.has(z.code)).toBe(false);
      codes.add(z.code);
    }
  });

  it('conflicts and stacks reference existing zords', () => {
    const names = new Set(ZORDS.map((z) => z.name));
    for (const c of CONFLICTS) {
      expect(names.has(c.a) && names.has(c.b)).toBe(true);
      expect(c.resolution.length).toBeGreaterThan(0);
    }
    for (const s of STACKS) for (const m of s.members) expect(names.has(m), m).toBe(true);
  });

  it('capacity is sane and the funes/hler conflict is registered', () => {
    expect(CAPACITY.contextBudgetTokens).toBeGreaterThan(0);
    expect(CAPACITY.driftMax).toBeGreaterThan(0);
    expect(CONFLICTS.some((c) => [c.a, c.b].sort().join('~') === 'funes~hler')).toBe(true);
  });

  it('lookup helpers work', () => {
    expect(zordByName('genome')?.slot).toBe('L1');
    expect(zordByName('nope')).toBeUndefined();
    expect(
      candidatesForSlot('L3')
        .map((z) => z.name)
        .sort(),
    ).toEqual(['funes', 'gravedigger', 'squishzilla', 'thonktank', 'zapgram']);
    expect(candidatesForSlot('L0')).toHaveLength(0);
  });
});
