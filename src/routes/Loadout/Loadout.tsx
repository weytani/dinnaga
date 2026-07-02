// ABOUTME: /loadout route — the ripperdoc bench. The URL is the only state store; composes
// ABOUTME: HUD, body nav, candidate tray, implant modal, and the live friction report.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTyped } from '../../hooks/useTyped';
import { LOADOUT_BOOT_LINES } from '../../data/loadoutBootLines';
import {
  CAPACITY,
  CONFLICTS,
  COST_BASIS,
  GENERATED,
  SHARED_SINKS,
  SLOTS,
  STACKS,
  ZORDS,
  candidatesForSlot,
  zordByName,
} from '../../data/zords';
import { analyze } from '../../lib/friction';
import {
  autoName,
  decode,
  decodeResolved,
  encode,
  encodeResolved,
  shortCode,
} from '../../lib/buildcode';
import { BodyNav } from '../../components/loadout/BodyNav';
import { FrictionPanel } from '../../components/loadout/FrictionPanel';
import { HarnessHUD } from '../../components/loadout/HarnessHUD';
import { ImplantCard } from '../../components/loadout/ImplantCard';
import { ImplantModal } from '../../components/loadout/ImplantModal';
import type { Zord } from '../../types';

function LoadoutBoot({ onDone }: { onDone: () => void }) {
  const { rendered, done } = useTyped(LOADOUT_BOOT_LINES);
  useEffect(() => {
    if (!done) return;
    const t = window.setTimeout(onDone, 400);
    return () => window.clearTimeout(t);
  }, [done, onDone]);
  return (
    <div className="lo-boot" onClick={onDone} role="presentation">
      <div className="lo-boot-panel">
        {rendered.map((line, i) => (
          <div className="lo-boot-line" key={i}>
            {line}
          </div>
        ))}
        <button type="button" className="lo-boot-skip lo-hud-btn" onClick={onDone}>
          Skip boot
        </button>
      </div>
    </div>
  );
}

export function Loadout() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [booted, setBooted] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState('L1');
  const [openZord, setOpenZord] = useState<Zord | null>(null);
  const [copied, setCopied] = useState<'share' | 'code' | null>(null);
  const copiedTimer = useRef<number | null>(null);

  const { loadout, warnings } = useMemo(
    () => decode(searchParams.get('b') ?? '', ZORDS, SLOTS),
    [searchParams],
  );
  const resolved = useMemo(() => decodeResolved(searchParams.get('r'), CONFLICTS), [searchParams]);
  const equipped = useMemo(
    () => loadout.map((e) => zordByName(e.zord)).filter((z): z is Zord => z !== undefined),
    [loadout],
  );
  const report = useMemo(
    () =>
      analyze(
        equipped,
        { conflicts: CONFLICTS, stacks: STACKS, capacity: CAPACITY, sharedSinks: SHARED_SINKS },
        resolved,
      ),
    [equipped, resolved],
  );

  const updateParams = useCallback(
    (b: string, r: string) => {
      const p = new URLSearchParams(searchParams);
      if (b) p.set('b', b);
      else p.delete('b');
      if (r) p.set('r', r);
      else p.delete('r');
      setSearchParams(p, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  const equip = useCallback(
    (z: Zord) => {
      const slot = SLOTS.find((s) => s.id === z.slot);
      const kept = loadout.filter(
        (e) => e.zord !== z.name && !(slot?.single === true && e.slot === z.slot),
      );
      updateParams(encode([...kept, { slot: z.slot, zord: z.name }]), encodeResolved(resolved));
      setOpenZord(null);
    },
    [loadout, resolved, updateParams],
  );

  const unequip = useCallback(
    (z: Zord) => {
      updateParams(encode(loadout.filter((e) => e.zord !== z.name)), encodeResolved(resolved));
      setOpenZord(null);
    },
    [loadout, resolved, updateParams],
  );

  const resolve = useCallback(
    (key: string) => {
      const next = new Set(resolved);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      updateParams(encode(loadout), encodeResolved(next));
    },
    [loadout, resolved, updateParams],
  );

  const flashCopied = useCallback((kind: 'share' | 'code') => {
    setCopied(kind);
    if (copiedTimer.current !== null) window.clearTimeout(copiedTimer.current);
    copiedTimer.current = window.setTimeout(() => setCopied(null), 1600);
  }, []);

  useEffect(
    () => () => {
      if (copiedTimer.current !== null) window.clearTimeout(copiedTimer.current);
    },
    [],
  );

  const buildName = autoName(loadout, ZORDS, STACKS);
  const buildCode = shortCode(loadout, ZORDS);

  const share = useCallback(() => {
    void navigator.clipboard
      ?.writeText(window.location.href)
      .then(() => flashCopied('share'))
      .catch(() => {});
  }, [flashCopied]);

  const copy = useCallback(() => {
    void navigator.clipboard
      ?.writeText(`${buildCode} — ${buildName}`)
      .then(() => flashCopied('code'))
      .catch(() => {});
  }, [buildCode, buildName, flashCopied]);

  const slot = SLOTS.find((s) => s.id === selectedSlot);
  const candidates = candidatesForSlot(selectedSlot);
  const openSlot = openZord ? SLOTS.find((s) => s.id === openZord.slot) : undefined;
  const replaces =
    openZord && openSlot?.single === true
      ? (loadout.find((e) => e.slot === openZord.slot && e.zord !== openZord.name)?.zord ?? null)
      : null;

  return (
    <section className="section lo-page" id="loadout" data-screen-label="LOADOUT">
      {!booted && <LoadoutBoot onDone={() => setBooted(true)} />}
      <header className="section-head">
        <span className="section-eye">// 05 · RIPPERDOC</span>
        <h1 className="section-title">Loadout.</h1>
      </header>
      <p className="body lo-intro">
        Every implant is a sealed paper reproduction from the megazord registry. Costs are measured,
        buffs are rated, drift is derived from real isolation masks — and nothing gets wired live.
      </p>

      <HarnessHUD
        report={report}
        capacity={CAPACITY}
        code={buildCode}
        name={buildName}
        copied={copied}
        onShare={share}
        onCopy={copy}
      />

      {warnings.length > 0 && (
        <div className="lo-notice" role="status">
          COULDN&apos;T PARSE PART OF THAT BUILD — ignored: {warnings.join(', ')}
        </div>
      )}

      {report.unstable && (
        <div className="lo-glitch-panel" role="alert">
          HARNESS INTEGRITY COMPROMISED
          <small>
            I&apos;m sorry, Dave. I&apos;m afraid I can&apos;t wire that.{' '}
            {report.overBudget ? 'Context over budget.' : 'Drift at maximum.'} Export still allowed
            — build stamped UNSTABLE.
          </small>
        </div>
      )}

      <div className="lo-bench">
        <BodyNav
          slots={SLOTS}
          loadout={loadout}
          selected={selectedSlot}
          onSelect={setSelectedSlot}
        />
        <div>
          {loadout.length === 0 && (
            <div className="lo-unpowered">// UNPOWERED — no cyberware installed. Pick a slot.</div>
          )}
          <div className="lo-tray-head">
            <span className="lo-tray-title">{slot?.system ?? selectedSlot}</span>
            <span className="lo-tray-rule">
              {slot?.layer} · {slot?.single === true ? 'one active' : 'multiple ok'}
            </span>
          </div>
          {candidates.length === 0 ? (
            <div className="lo-unpowered">Slot reserved — nothing on the shelf yet.</div>
          ) : (
            <div className="lo-cards">
              {candidates.map((z) => (
                <ImplantCard
                  key={z.name}
                  zord={z}
                  equipped={loadout.some((e) => e.zord === z.name)}
                  onOpen={setOpenZord}
                />
              ))}
            </div>
          )}
          {equipped.length > 0 && <FrictionPanel report={report} onResolve={resolve} />}
          <p className="lo-footnote">
            snapshot {GENERATED} · {COST_BASIS} · shared audit sink exempt from drift · proposed
            builds only — activation stays human-gated
          </p>
        </div>
      </div>

      {openZord && (
        <ImplantModal
          zord={openZord}
          equipped={loadout.some((e) => e.zord === openZord.name)}
          replaces={replaces}
          stacks={STACKS}
          slotSystem={SLOTS.find((s) => s.id === openZord.slot)?.system ?? openZord.slot}
          onEquip={equip}
          onUnequip={unequip}
          onClose={() => setOpenZord(null)}
        />
      )}
    </section>
  );
}
