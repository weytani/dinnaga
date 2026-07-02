// ABOUTME: Tests for the body-system navigator — grouping, occupants, selection callback,
// ABOUTME: and the anatomical figure lighting regions as slots fill.
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SLOTS } from '../../data/zords';
import { BodyNav } from './BodyNav';

describe('BodyNav', () => {
  it('groups slots by body system', () => {
    render(<BodyNav slots={SLOTS} loadout={[]} selected="L1" onSelect={() => {}} />);
    for (const system of [
      'Operating System',
      'Kiroshi Optics',
      'Dynalar Limbs',
      'Frontal Cortex',
      'Immune System',
      'Subdermal / Diagnostics',
    ]) {
      expect(screen.getByText(system)).toBeInTheDocument();
    }
    // Dynalar Limbs expands into its three sub-slots
    expect(screen.getByRole('button', { name: /^L2 / })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^L2\.5/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^L2\.7/ })).toBeInTheDocument();
  });

  it('shows occupants, selection state, and fires onSelect', async () => {
    const onSelect = vi.fn();
    render(
      <BodyNav
        slots={SLOTS}
        loadout={[{ slot: 'L1', zord: 'genome' }]}
        selected="L1"
        onSelect={onSelect}
      />,
    );
    expect(screen.getByRole('button', { name: /^L1/ })).toHaveTextContent('genome');
    expect(screen.getByRole('button', { name: /^L1/ })).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(screen.getByRole('button', { name: /^L3/ }));
    expect(onSelect).toHaveBeenCalledWith('L3');
  });

  it('lights figure regions for equipped slots', () => {
    const { container } = render(
      <BodyNav
        slots={SLOTS}
        loadout={[
          { slot: 'L1', zord: 'genome' },
          { slot: 'L3', zord: 'funes' },
        ]}
        selected="L1"
        onSelect={() => {}}
      />,
    );
    expect(container.querySelectorAll('.lo-fig-region--lit').length).toBe(2); // eyes + head
  });
});
