// ABOUTME: Sticky HUD bar — context/drift relay gauges, friction counts, build code + name,
// ABOUTME: share/copy actions, and the compromised (cyberpsychosis) presentation.
import type { Capacity, FrictionReport } from '../../types';

interface HarnessHUDProps {
  report: FrictionReport;
  capacity: Capacity;
  code: string;
  name: string;
  copied: 'share' | 'code' | null;
  onShare: () => void;
  onCopy: () => void;
}

const CTX_SEGS = 16;

function segClass(on: boolean, over: boolean, warn: boolean): string {
  if (!on) return 'lo-gauge-seg';
  if (over) return 'lo-gauge-seg lo-gauge-seg--over';
  if (warn) return 'lo-gauge-seg lo-gauge-seg--warn';
  return 'lo-gauge-seg lo-gauge-seg--filled';
}

export function HarnessHUD({
  report,
  capacity,
  code,
  name,
  copied,
  onShare,
  onCopy,
}: HarnessHUDProps) {
  const ratio = report.contextLoad / capacity.contextBudgetTokens;
  const filled = Math.min(CTX_SEGS, Math.round(ratio * CTX_SEGS));
  const unresolved = report.conflicts.filter((c) => !c.resolved).length;
  const driftMaxed = report.drift >= capacity.driftMax;

  return (
    <div className={`lo-hud${report.unstable ? ' lo-hud--compromised' : ''}`}>
      <span className="lo-hud-title">
        {report.unstable ? 'HARNESS INTEGRITY COMPROMISED' : 'RIPPERDOC // HARNESS LOADOUT'}
      </span>
      <span
        className="lo-gauge"
        aria-label={`context load ${report.contextLoad} of ${capacity.contextBudgetTokens} tokens`}
      >
        <span className="lo-gauge-label">Context</span>
        <span className="lo-gauge-track" aria-hidden="true">
          {Array.from({ length: CTX_SEGS }, (_, i) => (
            <span key={i} className={segClass(i < filled, report.overBudget, ratio > 0.75)} />
          ))}
        </span>
        <span>
          {(report.contextLoad / 1000).toFixed(1)}k/
          {(capacity.contextBudgetTokens / 1000).toFixed(0)}k{' '}
          <span className="lo-badge lo-badge--measured" title="sum of measured implant payloads">
            m
          </span>
        </span>
      </span>
      <span className="lo-gauge" aria-label={`drift ${report.drift} of ${capacity.driftMax}`}>
        <span className="lo-gauge-label">Drift</span>
        <span className="lo-gauge-track" aria-hidden="true">
          {Array.from({ length: capacity.driftMax }, (_, i) => (
            <span
              key={i}
              className={segClass(
                i < report.drift,
                driftMaxed,
                report.drift >= capacity.driftMax - 1,
              )}
            />
          ))}
        </span>
        <span>
          {report.drift}/{capacity.driftMax}{' '}
          <span
            className="lo-badge lo-badge--derived"
            title="derived from isolation write-slice overlap"
          >
            d
          </span>
        </span>
      </span>
      <span className="lo-hud-counts">
        <span className="is-cool">⊕{report.synergies.length}</span>
        <span className={unresolved > 0 ? 'is-hot' : ''}>✕{unresolved}</span>
        <span className={report.hazards.length > 0 ? 'is-warn' : ''}>⚠{report.hazards.length}</span>
      </span>
      <span className="lo-build-line">
        <span>{code}</span>
        <span className="lo-build-name">“{name}”</span>
        {report.unstable && <span className="lo-stamp">Unstable build</span>}
        <button type="button" className="lo-hud-btn" onClick={onShare}>
          {copied === 'share' ? 'Copied ↗' : 'Share ↗'}
        </button>
        <button type="button" className="lo-hud-btn" onClick={onCopy}>
          {copied === 'code' ? 'Copied' : 'Copy'}
        </button>
      </span>
    </div>
  );
}
