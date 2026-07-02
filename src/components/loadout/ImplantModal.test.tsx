// ABOUTME: Tests for the full implant stat modal — spec §7 content, provenance badges,
// ABOUTME: calibration warning, and install/uninstall/close behavior.
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { STACKS, ZORDS, zordByName } from '../../data/zords';
import { ImplantModal } from './ImplantModal';

const genome = zordByName('genome')!;
const doomgoblin = zordByName('doomgoblin')!;

function mount(zord = genome, over: Partial<Parameters<typeof ImplantModal>[0]> = {}) {
  const props = {
    zord,
    equipped: false,
    replaces: null as string | null,
    stacks: STACKS,
    slotSystem: 'Kiroshi Optics',
    onEquip: vi.fn(),
    onUnequip: vi.fn(),
    onClose: vi.fn(),
    ...over,
  };
  render(<ImplantModal {...props} />);
  return props;
}

describe('ImplantModal', () => {
  it('renders the full stat card: cost, stats with provenance, buffs, isolation, provenance line', () => {
    mount();
    expect(screen.getByRole('dialog', { name: /genome implant details/i })).toBeInTheDocument();
    expect(screen.getByText(/capacity cost/i)).toBeInTheDocument();
    expect(screen.getAllByText('measured').length).toBeGreaterThanOrEqual(1);
    for (const s of genome.stats) expect(screen.getByText(s.label)).toBeInTheDocument();
    expect(screen.getByText(/▲ AGENT RELIABILITY \+\+/)).toBeInTheDocument();
    expect(screen.getByText(/▲ TOKEN EFFICIENCY \+/)).toBeInTheDocument();
    expect(screen.getByText(/runstate\.tool_events/)).toBeInTheDocument();
    expect(screen.getByText(/148 tests/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /arXiv 2606\.15579/i })).toHaveAttribute(
      'href',
      'https://arxiv.org/abs/2606.15579',
    );
    expect(screen.getAllByText(/⊕ SET:/)).toHaveLength(3);
  });

  it('install path: calls onEquip; shows replace note when displacing', async () => {
    const p = mount(genome, { replaces: 'doomgoblin' });
    const btn = screen.getByRole('button', { name: /install — replaces doomgoblin/i });
    await userEvent.click(btn);
    expect(p.onEquip).toHaveBeenCalledWith(genome);
  });

  it('uninstall path when equipped', async () => {
    const p = mount(genome, { equipped: true });
    await userEvent.click(screen.getByRole('button', { name: /uninstall/i }));
    expect(p.onUnequip).toHaveBeenCalledWith(genome);
  });

  it('Escape closes', async () => {
    const p = mount();
    await userEvent.keyboard('{Escape}');
    expect(p.onClose).toHaveBeenCalled();
  });

  it('doomgoblin shows the calibration requirement', () => {
    mount(doomgoblin, { slotSystem: 'Kiroshi Optics' });
    expect(screen.getByText(/requires calibration/i)).toBeInTheDocument();
  });

  it('every zord renders without crashing', () => {
    for (const z of ZORDS) {
      const { unmount } = render(
        <ImplantModal
          zord={z}
          equipped={false}
          replaces={null}
          stacks={STACKS}
          slotSystem="X"
          onEquip={() => {}}
          onUnequip={() => {}}
          onClose={() => {}}
        />,
      );
      unmount();
    }
  });

  it('moves focus to the dialog on mount', () => {
    mount();
    expect(screen.getByRole('dialog', { name: /genome implant details/i })).toHaveFocus();
  });

  it('restores focus to the previously focused element on unmount', () => {
    const outsideButton = document.createElement('button');
    document.body.appendChild(outsideButton);
    outsideButton.focus();
    expect(outsideButton).toHaveFocus();

    const { unmount } = render(
      <ImplantModal
        zord={genome}
        equipped={false}
        replaces={null}
        stacks={STACKS}
        slotSystem="Kiroshi Optics"
        onEquip={() => {}}
        onUnequip={() => {}}
        onClose={() => {}}
      />,
    );
    unmount();

    expect(outsideButton).toHaveFocus();
    document.body.removeChild(outsideButton);
  });
});
