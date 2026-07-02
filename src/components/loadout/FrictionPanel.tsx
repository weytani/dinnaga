// ABOUTME: Live friction report — set bonuses, registered conflicts with RESOLVE actions,
// ABOUTME: and read-after-write hazards for the current loadout.
import type { FrictionReport } from '../../types';
import { conflictKey } from '../../lib/friction';

interface FrictionPanelProps {
  report: FrictionReport;
  onResolve: (key: string) => void;
}

export function FrictionPanel({ report, onResolve }: FrictionPanelProps) {
  const empty =
    report.synergies.length === 0 && report.conflicts.length === 0 && report.hazards.length === 0;
  return (
    <section className="lo-friction" aria-label="friction report">
      <div className="lo-friction-title">Friction // live report</div>
      {empty && <div className="lo-friction-item">NO FRICTION — CLEAN INSTALL.</div>}
      {report.synergies.map((s) => (
        <div className="lo-friction-item lo-friction-item--synergy" key={`${s.a}~${s.b}`}>
          <span className="lo-friction-mark">⊕</span>
          <span>
            {s.a} ⊕ {s.b} → {s.on.join(', ')}
            {s.stackName ? ` — “${s.stackName}”` : ''}
          </span>
        </div>
      ))}
      {report.conflicts.map(({ conflict, resolved }) => {
        const key = conflictKey(conflict.a, conflict.b);
        return (
          <div className="lo-friction-item lo-friction-item--conflict" key={key}>
            <span className="lo-friction-mark">✕</span>
            <span>
              {conflict.a} ⟷ {conflict.b} — {conflict.kind}
            </span>
            {resolved ? (
              <span className="lo-resolved-tag">✓ resolved · {conflict.resolution}</span>
            ) : (
              <>
                <button type="button" className="lo-resolve-btn" onClick={() => onResolve(key)}>
                  Resolve — apply isolation mask
                </button>
                <span className="lo-friction-why">{conflict.why}</span>
              </>
            )}
          </div>
        );
      })}
      {report.hazards.map((h) => (
        <div className="lo-friction-item lo-friction-item--hazard" key={`${h.reader}<${h.writer}`}>
          <span className="lo-friction-mark">⚠</span>
          <span>
            {h.reader} reads what {h.writer} writes ({h.slices.join(', ')}) — order-fragile
          </span>
        </div>
      ))}
    </section>
  );
}
