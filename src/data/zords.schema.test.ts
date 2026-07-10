// ABOUTME: Runtime schema guard for the unchecked `raw as unknown as ZordsDoc` cast in
// ABOUTME: zords.ts — catches a malformed snapshot in CI instead of at ImplantModal render time.
import { describe, expect, it } from 'vitest';
import { CONFLICTS, SLOTS, STACKS, ZORDS, zordByName } from './zords';

function nonEmptyString(value: unknown): boolean {
  return typeof value === 'string' && value.length > 0;
}

describe('zords.json schema', () => {
  it('every zord has the required non-empty string fields', () => {
    for (const z of ZORDS) {
      // faithful is the zord's reproduction-status label (e.g. "FAITHFUL", "GAPS-FOUND (documented)").
      expect(nonEmptyString(z.name), `${z.name}.name`).toBe(true);
      expect(nonEmptyString(z.layer), `${z.name}.layer`).toBe(true);
      expect(nonEmptyString(z.slot), `${z.name}.slot`).toBe(true);
      expect(nonEmptyString(z.faithful), `${z.name}.faithful`).toBe(true);
      expect(nonEmptyString(z.headline), `${z.name}.headline`).toBe(true);
      expect(nonEmptyString(z.flavor), `${z.name}.flavor`).toBe(true);
    }
  });

  it('every zord has array-typed stats/hookPoints/improves/isolation fields', () => {
    for (const z of ZORDS) {
      expect(Array.isArray(z.stats), `${z.name}.stats`).toBe(true);
      expect(Array.isArray(z.hookPoints), `${z.name}.hookPoints`).toBe(true);
      expect(Array.isArray(z.improves), `${z.name}.improves`).toBe(true);
      expect(Array.isArray(z.isolation.reads), `${z.name}.isolation.reads`).toBe(true);
      expect(Array.isArray(z.isolation.writes), `${z.name}.isolation.writes`).toBe(true);
    }
  });

  it('every zord carries 2-4 stat rows', () => {
    for (const z of ZORDS) {
      expect(z.stats.length, z.name).toBeGreaterThanOrEqual(2);
      expect(z.stats.length, z.name).toBeLessThanOrEqual(4);
    }
  });

  it('every zord slot resolves against a registered slot id', () => {
    const slotIds = new Set(SLOTS.map((s) => s.id));
    for (const z of ZORDS) {
      expect(slotIds.has(z.slot), `${z.name}.slot=${z.slot}`).toBe(true);
    }
  });

  it('every conflict and stack member resolves via zordByName', () => {
    for (const c of CONFLICTS) {
      expect(zordByName(c.a), `conflict.a=${c.a}`).toBeDefined();
      expect(zordByName(c.b), `conflict.b=${c.b}`).toBeDefined();
    }
    for (const s of STACKS) {
      for (const m of s.members) {
        expect(zordByName(m), `${s.name} member=${m}`).toBeDefined();
      }
    }
  });
});
