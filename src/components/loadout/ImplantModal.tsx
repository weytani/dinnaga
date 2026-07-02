// ABOUTME: Full implant stat card (spec §7) — detail modal with measured costs, rated buffs,
// ABOUTME: set-bonus hints, isolation slices, calibration flag, and install/uninstall actions.
import { useEffect, useRef } from 'react';
import type { Zord, ZordStack } from '../../types';

const TIER_PIPS: Record<string, number> = {
  common: 1,
  uncommon: 2,
  rare: 3,
  epic: 4,
  legendary: 5,
};

interface ImplantModalProps {
  zord: Zord;
  equipped: boolean;
  replaces: string | null;
  stacks: ZordStack[];
  slotSystem: string;
  onEquip: (zord: Zord) => void;
  onUnequip: (zord: Zord) => void;
  onClose: () => void;
}

export function ImplantModal({
  zord,
  equipped,
  replaces,
  stacks,
  slotSystem,
  onEquip,
  onUnequip,
  onClose,
}: ImplantModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    return () => {
      if (previous?.isConnected) previous.focus();
    };
  }, []);

  const pips = TIER_PIPS[zord.tier] ?? 1;
  const sets = stacks.filter((s) => s.members.includes(zord.name));

  return (
    <div className="lo-modal-backdrop" onClick={onClose} role="presentation">
      <div
        ref={dialogRef}
        tabIndex={-1}
        className={`lo-modal lo-tier-${zord.tier}`}
        role="dialog"
        aria-modal="true"
        aria-label={`${zord.name} implant details`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="lo-modal-head">
          <span className="lo-modal-name">{zord.name}</span>
          <span className="lo-card-tier">
            {zord.tier.toUpperCase()} {'◆'.repeat(pips)}
            {'◇'.repeat(5 - pips)}
          </span>
        </div>
        <div className="lo-modal-sub">
          {zord.manufacturer} · {slotSystem} ({zord.slot}) · hook {zord.hookPoints.join(' + ')}
        </div>

        <hr className="lo-divider" />
        <div className="lo-stat-row">
          <span className="lo-stat-label">Capacity cost</span>
          <span>
            +{(zord.contextCostTokens / 1000).toFixed(2)}k ctx{' '}
            <span
              className="lo-badge lo-badge--measured"
              title="estimated tokens (ceil chars/4) of the real payload text this implant loads into context"
            >
              measured
            </span>
          </span>
        </div>
        {zord.stats.map((s) => (
          <div className="lo-stat-row" key={s.label}>
            <span className="lo-stat-label">{s.label}</span>
            <span>
              {s.value} <span className={`lo-badge lo-badge--${s.provenance}`}>{s.provenance}</span>
            </span>
          </div>
        ))}

        <hr className="lo-divider" />
        {zord.improves.map((axis, i) => (
          <div className="lo-buff" key={axis}>
            {`▲ ${axis.replace(/-/g, ' ').toUpperCase()} ${i === 0 ? '++' : '+'} `}
            <span
              className="lo-badge lo-badge--rated"
              title="ordinal editorial rating, grounded by the reproduced headline"
            >
              rated
            </span>
          </div>
        ))}
        {sets.map((s) => (
          <div className="lo-set-hint" key={s.name}>
            ⊕ SET: {s.members.filter((m) => m !== zord.name).join(' + ')} → “{s.name}”
          </div>
        ))}

        {zord.requiresCalibration && (
          <div className="lo-calibration">
            ⚠ requires calibration — trains per-deployment heads before install
          </div>
        )}

        <hr className="lo-divider" />
        <p className="lo-iso">
          <b>r:</b> {zord.isolation.reads.join(', ')}
          <br />
          <b>w:</b> {zord.isolation.writes.join(', ')}
        </p>
        <hr className="lo-divider" />
        <p className="lo-flavor">“{zord.flavor}”</p>
        <p className="lo-prov">
          {zord.faithful} · {zord.tests} tests ·{' '}
          <a href={`https://arxiv.org/abs/${zord.paper}`} target="_blank" rel="noreferrer">
            arXiv {zord.paper}
          </a>
        </p>
        <p className="lo-iso">{zord.headline}</p>

        <div className="lo-modal-actions">
          {equipped ? (
            <button
              type="button"
              className="lo-equip-btn lo-equip-btn--uninstall"
              onClick={() => onUnequip(zord)}
            >
              Uninstall
            </button>
          ) : (
            <button type="button" className="lo-equip-btn" onClick={() => onEquip(zord)}>
              Install{replaces ? ` — replaces ${replaces}` : ''}
            </button>
          )}
          <button type="button" className="lo-hud-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
