// ABOUTME: Unit tests for the friction engine — every rule from spec §8 plus the
// ABOUTME: shared-sink exemption, over-budget cyberpsychosis, and real-registry pins.
import { describe, expect, it } from 'vitest';
import type { Capacity, Zord } from '../types';
import { CAPACITY, CONFLICTS, SHARED_SINKS, STACKS, ZORDS, zordByName } from '../data/zords';
import { analyze, conflictKey, type FrictionInput } from './friction';

const cap: Capacity = { contextBudgetTokens: 1000, driftMax: 5 };

function zord(name: string, over: Partial<Zord> = {}): Zord {
  return {
    name,
    code: 'ZZZ',
    slot: 'L1',
    layer: `${name}-layer`,
    hookPoints: ['x'],
    manufacturer: 'Test',
    tier: 'rare',
    method: [],
    improves: [],
    isolation: { reads: [], writes: [] },
    contextCostTokens: 100,
    tests: 1,
    faithful: 'FAITHFUL',
    headline: 'h',
    stats: [],
    flavor: 'f',
    paper: '0000.00000',
    requiresCalibration: false,
    ...over,
  };
}

function input(over: Partial<FrictionInput> = {}): FrictionInput {
  return { conflicts: [], stacks: [], capacity: cap, sharedSinks: ['runstate.audit'], ...over };
}

describe('conflictKey', () => {
  it('is order-independent', () => {
    expect(conflictKey('hler', 'funes')).toBe('funes~hler');
    expect(conflictKey('funes', 'hler')).toBe('funes~hler');
  });
});

describe('analyze', () => {
  it('empty loadout → zeroed stable report', () => {
    const r = analyze([], input(), new Set());
    expect(r).toEqual({
      synergies: [],
      conflicts: [],
      hazards: [],
      drift: 0,
      contextLoad: 0,
      overBudget: false,
      coverage: [],
      unstable: false,
    });
  });

  it('write overlap adds contamination; shared sinks exempt', () => {
    const a = zord('a', { isolation: { reads: [], writes: ['runstate.x', 'runstate.audit'] } });
    const b = zord('b', { isolation: { reads: [], writes: ['runstate.x', 'runstate.audit'] } });
    const r = analyze([a, b], input(), new Set());
    expect(r.drift).toBe(1); // runstate.x only — audit exempt
  });

  it('unresolved registered conflict adds 2; resolving zeroes it', () => {
    const c = { a: 'a', b: 'b', kind: 'k', why: 'w', resolution: 'r' };
    const zs = [zord('a'), zord('b')];
    expect(analyze(zs, input({ conflicts: [c] }), new Set()).drift).toBe(2);
    expect(analyze(zs, input({ conflicts: [c] }), new Set()).conflicts[0]?.resolved).toBe(false);
    const resolved = analyze(zs, input({ conflicts: [c] }), new Set([conflictKey('a', 'b')]));
    expect(resolved.drift).toBe(0);
    expect(resolved.conflicts[0]?.resolved).toBe(true);
  });

  it('drift clamps at driftMax and flips unstable', () => {
    const writes = ['w1', 'w2', 'w3', 'w4', 'w5', 'w6'];
    const a = zord('a', { isolation: { reads: [], writes } });
    const b = zord('b', { isolation: { reads: [], writes } });
    const r = analyze([a, b], input(), new Set());
    expect(r.drift).toBe(5);
    expect(r.unstable).toBe(true);
  });

  it('read-after-write hazard unless pair shares a stack', () => {
    const w = zord('writer', { isolation: { reads: [], writes: ['runstate.t'] } });
    const rd = zord('reader', { isolation: { reads: ['runstate.t'], writes: [] } });
    const bare = analyze([rd, w], input(), new Set());
    expect(bare.hazards).toEqual([{ reader: 'reader', writer: 'writer', slices: ['runstate.t'] }]);
    const stacked = analyze(
      [rd, w],
      input({ stacks: [{ members: ['reader', 'writer'], on: 'x', name: 'S' }] }),
      new Set(),
    );
    expect(stacked.hazards).toEqual([]);
  });

  it('synergy on shared improves across layers; named via matching stack', () => {
    const a = zord('a', { layer: 'LA', improves: ['agent-reliability'] });
    const b = zord('b', { layer: 'LB', improves: ['agent-reliability', 'other'] });
    const r = analyze(
      [a, b],
      input({ stacks: [{ members: ['a', 'b'], on: 'agent-reliability', name: 'Spine' }] }),
      new Set(),
    );
    expect(r.synergies).toEqual([
      { a: 'a', b: 'b', on: ['agent-reliability'], stackName: 'Spine' },
    ]);
    const sameLayer = analyze(
      [a, zord('c', { layer: 'LA', improves: ['agent-reliability'] })],
      input(),
      new Set(),
    );
    expect(sameLayer.synergies).toEqual([]);
  });

  it('context load sums costs; over budget flips unstable (cyberpsychosis by over-capacity)', () => {
    const a = zord('a', { contextCostTokens: 600 });
    const b = zord('b', { contextCostTokens: 600 });
    const r = analyze([a, b], input(), new Set());
    expect(r.contextLoad).toBe(1200);
    expect(r.overBudget).toBe(true);
    expect(r.unstable).toBe(true);
    expect(r.drift).toBe(0);
  });

  it('coverage is the union of improves', () => {
    const r = analyze(
      [zord('a', { improves: ['x', 'y'] }), zord('b', { layer: 'LB', improves: ['y', 'z'] })],
      input(),
      new Set(),
    );
    expect(r.coverage.sort()).toEqual(['x', 'y', 'z']);
  });
});

describe('real registry pins', () => {
  const realInput: FrictionInput = {
    conflicts: CONFLICTS,
    stacks: STACKS,
    capacity: CAPACITY,
    sharedSinks: SHARED_SINKS,
  };

  it('genome + funes + hler → funes⟷hler conflict, drift 2, Reliability Spine synergy', () => {
    const zs = ['genome', 'funes', 'hler'].map((n) => zordByName(n)!);
    const r = analyze(zs, realInput, new Set());
    expect(r.conflicts).toHaveLength(1);
    expect(r.drift).toBe(2);
    expect(r.synergies.some((s) => s.stackName === 'Reliability Spine')).toBe(true);
    expect(analyze(zs, realInput, new Set([conflictKey('funes', 'hler')])).drift).toBe(0);
  });

  it('yeetriever + gravedigger is a sanctioned seam (no hazard, named synergy)', () => {
    const zs = ['yeetriever', 'gravedigger'].map((n) => zordByName(n)!);
    const r = analyze(zs, realInput, new Set());
    expect(r.hazards).toEqual([]);
    expect(r.synergies.some((s) => s.stackName === 'Deep Archive Rig')).toBe(true);
  });

  it('max legal loadout overflows the context budget (cyberpsychosis reachable)', () => {
    const max = [
      'genome',
      'openskill',
      'gauntlet',
      'yeetriever',
      'thonktank',
      'hler',
      'blamethrower',
      'gumshoe',
      'skidmark-leak',
      'skidmark-traj',
    ].map((n) => zordByName(n)!);
    const r = analyze(max, realInput, new Set());
    expect(r.overBudget).toBe(true);
    expect(r.unstable).toBe(true);
  });

  it('full registry coverage spans every improves axis', () => {
    const r = analyze([...ZORDS], realInput, new Set());
    expect(r.coverage).toContain('agent-reliability');
    expect(r.coverage).toContain('eval-fidelity');
    expect(r.coverage.length).toBeGreaterThanOrEqual(8);
  });
});
