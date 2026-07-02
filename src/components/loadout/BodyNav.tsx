// ABOUTME: Left-rail body navigator — slots grouped by body system, with an anatomical
// ABOUTME: figure whose regions light up as cyberware is installed.
import type { Loadout, Slot } from '../../types';

interface BodyNavProps {
  slots: Slot[];
  loadout: Loadout;
  selected: string;
  onSelect: (slotId: string) => void;
}

const REGION_FOR_SLOT: Record<string, string> = {
  L0: 'spine',
  L1: 'eyes',
  L2: 'arms',
  'L2.5': 'arms',
  'L2.7': 'arms',
  L3: 'head',
  L4: 'torso',
  DIAG: 'skin',
};

function BodyFigure({ lit }: { lit: ReadonlySet<string> }) {
  const cls = (r: string) => `lo-fig-region${lit.has(r) ? ' lo-fig-region--lit' : ''}`;
  return (
    <svg className="lo-fig" viewBox="0 0 120 168" aria-hidden="true">
      <rect
        className={cls('skin')}
        x="14"
        y="4"
        width="92"
        height="160"
        rx="8"
        strokeDasharray="3 3"
        fillOpacity="0.15"
      />
      <circle className={cls('head')} cx="60" cy="28" r="16" />
      <rect className={cls('eyes')} x="47" y="24" width="26" height="5" />
      <rect className={cls('torso')} x="44" y="50" width="32" height="46" />
      <rect className={cls('spine')} x="57" y="52" width="6" height="42" />
      <rect className={cls('arms')} x="24" y="52" width="14" height="40" />
      <rect className={cls('arms')} x="82" y="52" width="14" height="40" />
    </svg>
  );
}

export function BodyNav({ slots, loadout, selected, onSelect }: BodyNavProps) {
  const lit = new Set(
    loadout.map((e) => REGION_FOR_SLOT[e.slot]).filter((r): r is string => r !== undefined),
  );
  const groups: { system: string; slots: Slot[] }[] = [];
  for (const slot of slots) {
    const last = groups[groups.length - 1];
    if (last && last.system === slot.system) last.slots.push(slot);
    else groups.push({ system: slot.system, slots: [slot] });
  }
  return (
    <aside className="lo-nav" aria-label="body systems">
      <BodyFigure lit={lit} />
      {groups.map((g) => (
        <div className="lo-nav-group" key={g.system}>
          <div className="lo-nav-system">{g.system}</div>
          {g.slots.map((slot) => {
            const occupants = loadout.filter((e) => e.slot === slot.id).map((e) => e.zord);
            const isSelected = selected === slot.id;
            return (
              <button
                key={slot.id}
                type="button"
                className={`lo-nav-slot${isSelected ? ' lo-nav-slot--selected' : ''}${
                  occupants.length ? ' lo-nav-slot--filled' : ''
                }`}
                aria-label={`${slot.id} slot`}
                aria-pressed={isSelected}
                onClick={() => onSelect(slot.id)}
              >
                <span>{slot.id}</span>
                <span className="lo-nav-occupant">{occupants.join(' · ') || '—'}</span>
                <span className="lo-nav-mark">{occupants.length ? '✓' : '·'}</span>
              </button>
            );
          })}
        </div>
      ))}
    </aside>
  );
}
