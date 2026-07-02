// ABOUTME: Tests for the live friction report panel — synergy/conflict/hazard rows,
// ABOUTME: resolve action wiring, resolved display, and the clean-install empty state.
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { FrictionReport } from '../../types';
import { FrictionPanel } from './FrictionPanel';

const conflict = {
  a: 'funes',
  b: 'hler',
  kind: 'pre-commit-visibility',
  why: 'global memory visibility guts the gate',
  resolution: 'isolation mask',
};

const report: FrictionReport = {
  synergies: [
    { a: 'genome', b: 'hler', on: ['agent-reliability'], stackName: 'Reliability Spine' },
  ],
  conflicts: [{ conflict, resolved: false }],
  hazards: [{ reader: 'doomgoblin', writer: 'genome', slices: ['runstate.trajectory'] }],
  drift: 2,
  contextLoad: 1000,
  overBudget: false,
  coverage: [],
  unstable: false,
};

describe('FrictionPanel', () => {
  it('renders all three finding kinds', () => {
    render(<FrictionPanel report={report} onResolve={() => {}} />);
    expect(screen.getByText(/genome ⊕ hler/)).toBeInTheDocument();
    expect(screen.getByText(/Reliability Spine/)).toBeInTheDocument();
    expect(screen.getByText(/funes ⟷ hler/)).toBeInTheDocument();
    expect(screen.getByText(/doomgoblin reads what genome writes/)).toBeInTheDocument();
  });

  it('resolve button fires with the conflict key', async () => {
    const onResolve = vi.fn();
    render(<FrictionPanel report={report} onResolve={onResolve} />);
    await userEvent.click(screen.getByRole('button', { name: /resolve — apply isolation mask/i }));
    expect(onResolve).toHaveBeenCalledWith('funes~hler');
  });

  it('resolved conflicts show the resolution instead of the button', () => {
    render(
      <FrictionPanel
        report={{ ...report, conflicts: [{ conflict, resolved: true }] }}
        onResolve={() => {}}
      />,
    );
    expect(screen.queryByRole('button', { name: /resolve/i })).not.toBeInTheDocument();
    expect(screen.getByText(/✓ resolved · isolation mask/)).toBeInTheDocument();
  });

  it('empty report reads clean', () => {
    render(
      <FrictionPanel
        report={{ ...report, synergies: [], conflicts: [], hazards: [] }}
        onResolve={() => {}}
      />,
    );
    expect(screen.getByText(/NO FRICTION — CLEAN INSTALL/)).toBeInTheDocument();
  });
});
