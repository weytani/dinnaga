// ABOUTME: Tests for the compact implant candidate card — content and open callback.
// ABOUTME: Uses the real genome zord from the vendored snapshot; no fixtures.
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { zordByName } from '../../data/zords';
import { ImplantCard } from './ImplantCard';

const genome = zordByName('genome')!;

describe('ImplantCard', () => {
  it('renders name, tier, manufacturer, cost, and headline', () => {
    render(<ImplantCard zord={genome} equipped={false} onOpen={() => {}} />);
    expect(screen.getByText('GENOME')).toBeInTheDocument();
    expect(screen.getByText(/RARE/)).toBeInTheDocument();
    expect(screen.getByText(/KIROSHI/)).toBeInTheDocument();
    expect(screen.getByText(/k CTX/)).toBeInTheDocument();
    expect(screen.getByText(genome.headline)).toBeInTheDocument();
    expect(screen.queryByText('INSTALLED')).not.toBeInTheDocument();
  });

  it('shows INSTALLED when equipped and calls onOpen on click', async () => {
    const onOpen = vi.fn();
    render(<ImplantCard zord={genome} equipped onOpen={onOpen} />);
    expect(screen.getByText('INSTALLED')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /genome — inspect implant/i }));
    expect(onOpen).toHaveBeenCalledWith(genome);
  });
});
