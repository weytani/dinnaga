// ABOUTME: Tests for the HUD bar — gauges, friction counts, build line, share/copy,
// ABOUTME: and the compromised cyberpsychosis state with UNSTABLE stamp.
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { FrictionReport } from '../../types';
import { CAPACITY } from '../../data/zords';
import { HarnessHUD } from './HarnessHUD';

const stable: FrictionReport = {
  synergies: [
    { a: 'genome', b: 'hler', on: ['agent-reliability'], stackName: 'Reliability Spine' },
  ],
  conflicts: [],
  hazards: [],
  drift: 0,
  contextLoad: 3200,
  overBudget: false,
  coverage: ['agent-reliability'],
  unstable: false,
};

function mount(report: FrictionReport, copied: 'share' | 'code' | null = null) {
  const onShare = vi.fn();
  const onCopy = vi.fn();
  render(
    <HarnessHUD
      report={report}
      capacity={CAPACITY}
      code="GNM·HLR"
      name="The Reliability Spine"
      copied={copied}
      onShare={onShare}
      onCopy={onCopy}
    />,
  );
  return { onShare, onCopy };
}

describe('HarnessHUD', () => {
  it('renders gauges, counts, and the build line', () => {
    mount(stable);
    expect(screen.getByText('RIPPERDOC // HARNESS LOADOUT')).toBeInTheDocument();
    expect(screen.getByLabelText(/context load 3200 of/)).toBeInTheDocument();
    expect(screen.getByLabelText(/drift 0 of/)).toBeInTheDocument();
    expect(screen.getByText('⊕1')).toBeInTheDocument();
    expect(screen.getByText('✕0')).toBeInTheDocument();
    expect(screen.getByText('GNM·HLR')).toBeInTheDocument();
    expect(screen.getByText(/The Reliability Spine/)).toBeInTheDocument();
    expect(screen.queryByText(/unstable build/i)).not.toBeInTheDocument();
  });

  it('share/copy fire callbacks and show copied feedback', async () => {
    const { onShare } = mount(stable, 'code');
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /share/i }));
    expect(onShare).toHaveBeenCalled();
  });

  it('compromised state: title flips, stamp appears', () => {
    mount({ ...stable, drift: CAPACITY.driftMax, unstable: true });
    expect(screen.getByText('HARNESS INTEGRITY COMPROMISED')).toBeInTheDocument();
    expect(screen.getByText(/unstable build/i)).toBeInTheDocument();
  });
});
