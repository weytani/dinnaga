// ABOUTME: Round-trip and edge-case tests for the /loadout URL build codec,
// ABOUTME: display short code, and auto-naming (stack match → axis fallback).
import { describe, expect, it } from 'vitest';
import { CONFLICTS, SLOTS, STACKS, ZORDS } from '../data/zords';
import type { Slot, Zord } from '../types';
import { autoName, decode, decodeResolved, encode, encodeResolved, shortCode } from './buildcode';

const L = (slot: string, zord: string) => ({ slot, zord });

describe('encode/decode', () => {
  it('round-trips a mixed build canonically', () => {
    const loadout = [L('L3', 'funes'), L('L1', 'genome'), L('L4', 'hler')];
    const param = encode(loadout);
    expect(param).toBe('L1genome_L3funes_L4hler');
    expect(decode(param, ZORDS, SLOTS).loadout).toEqual([
      L('L1', 'genome'),
      L('L3', 'funes'),
      L('L4', 'hler'),
    ]);
  });

  it('handles dotted slot ids and multi-DIAG', () => {
    const loadout = [L('L2.5', 'gauntlet'), L('DIAG', 'gumshoe'), L('DIAG', 'blamethrower')];
    const { loadout: back, warnings } = decode(encode(loadout), ZORDS, SLOTS);
    expect(warnings).toEqual([]);
    expect(back).toHaveLength(3);
    expect(back.filter((e) => e.slot === 'DIAG')).toHaveLength(2);
  });

  it('empty param → empty loadout, no warnings', () => {
    expect(decode('', ZORDS, SLOTS)).toEqual({ loadout: [], warnings: [] });
  });

  it('drops garbage, wrong-slot, unknown, and dupes with warnings', () => {
    const { loadout, warnings } = decode(
      'L1genome_XXjunk_L1funes_L3funes_L3funes_L4nope_L3gravedigger',
      ZORDS,
      SLOTS,
    );
    expect(loadout).toEqual([L('L1', 'genome'), L('L3', 'funes')]);
    // XXjunk unparseable · L1funes wrong slot · dupe funes · L4nope unknown · gravedigger second-in-single
    expect(warnings).toHaveLength(5);
  });

  it('does not swallow a zord name that starts with a digit into the slot id', () => {
    const realZord = ZORDS.find((z) => z.name === 'genome');
    if (!realZord) throw new Error('fixture data missing genome zord');
    const synthZord: Zord = { ...realZord, name: '4x', code: 'FX4', slot: 'L1' };
    const synthSlots: Slot[] = [
      { id: 'L1', system: 'test-system', layer: 'test-layer', single: false },
    ];
    const { loadout, warnings } = decode('L14x', [synthZord], synthSlots);
    expect(warnings).toEqual([]);
    expect(loadout).toEqual([L('L1', '4x')]);
  });
});

describe('shortCode', () => {
  it('joins overlay codes with middots', () => {
    expect(shortCode([L('L1', 'genome'), L('L3', 'funes'), L('L4', 'hler')], ZORDS)).toBe(
      'GNM·FNS·HLR',
    );
    expect(shortCode([], ZORDS)).toBe('—');
  });
});

describe('autoName', () => {
  it('UNPOWERED when empty', () => {
    expect(autoName([], ZORDS, STACKS)).toBe('UNPOWERED');
  });

  it('prefers a fully-equipped named stack (largest wins)', () => {
    expect(autoName([L('L1', 'genome'), L('L4', 'hler')], ZORDS, STACKS)).toBe(
      'The Reliability Spine',
    );
  });

  it('falls back to the dominant improves axis', () => {
    expect(autoName([L('L3', 'funes')], ZORDS, STACKS)).toBe('Long Memory Rig');
  });

  it('is order-independent for the axis fallback tie-break (same equipped set, either order)', () => {
    const hlerEntry = { slot: 'L4', zord: 'hler' };
    const gravediggerEntry = { slot: 'L3', zord: 'gravedigger' };
    expect(autoName([hlerEntry, gravediggerEntry], ZORDS, STACKS)).toBe(
      autoName([gravediggerEntry, hlerEntry], ZORDS, STACKS),
    );
  });
});

describe('resolved keys', () => {
  it('round-trips and filters to real conflicts', () => {
    const keys = new Set(['funes~hler']);
    expect(encodeResolved(keys)).toBe('funes~hler');
    expect(decodeResolved('funes~hler_bogus~pair', CONFLICTS)).toEqual(new Set(['funes~hler']));
    expect(decodeResolved(null, CONFLICTS)).toEqual(new Set());
  });
});
