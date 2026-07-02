// ABOUTME: Integration tests for the /loadout bench — URL state, equip flow, friction
// ABOUTME: updates, conflict resolution, boot dismissal, and graceful bad-param handling.
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Loadout } from './Loadout';

async function renderBench(entry = '/loadout') {
  const utils = render(
    <MemoryRouter initialEntries={[entry]}>
      <Loadout />
    </MemoryRouter>,
  );
  const skip = await screen.findByRole('button', { name: /skip boot/i });
  await userEvent.click(skip);
  await waitFor(() => expect(screen.queryByText(/CHAIR POWER-ON/)).not.toBeInTheDocument());
  return utils;
}

describe('Loadout', () => {
  it('empty bench is UNPOWERED with zeroed HUD', async () => {
    await renderBench();
    expect(screen.getByText(/UNPOWERED/)).toBeInTheDocument();
    expect(screen.getByText(/“UNPOWERED”/)).toBeInTheDocument(); // build name
    expect(screen.getByLabelText(/context load 0 of/)).toBeInTheDocument();
  });

  it('restores a shared build from the URL and resolves its conflict', async () => {
    await renderBench('/loadout?b=L1genome_L3funes_L4hler');
    expect(screen.getByText('GNM·FNS·HLR')).toBeInTheDocument();
    expect(screen.getByText(/The Reliability Spine/)).toBeInTheDocument();
    expect(screen.getByText(/funes ⟷ hler/)).toBeInTheDocument();
    expect(screen.getByLabelText(/drift 2 of/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /resolve — apply isolation mask/i }));
    expect(await screen.findByText(/✓ resolved/)).toBeInTheDocument();
    expect(screen.getByLabelText(/drift 0 of/)).toBeInTheDocument();
  });

  it('equips an implant through slot → card → modal → install', async () => {
    await renderBench();
    await userEvent.click(screen.getByRole('button', { name: /^L3/ }));
    await userEvent.click(screen.getByRole('button', { name: /funes — inspect implant/i }));
    await userEvent.click(screen.getByRole('button', { name: /^install/i }));
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /^L3/ })).toHaveTextContent('funes'),
    );
    expect(screen.queryByText(/UNPOWERED — no cyberware/)).not.toBeInTheDocument();
    expect(screen.getByText('FNS')).toBeInTheDocument();
  });

  it('single-slot equip swaps the occupant', async () => {
    await renderBench('/loadout?b=L3funes');
    await userEvent.click(screen.getByRole('button', { name: /^L3/ }));
    await userEvent.click(screen.getByRole('button', { name: /gravedigger — inspect implant/i }));
    await userEvent.click(screen.getByRole('button', { name: /install — replaces funes/i }));
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /^L3/ })).toHaveTextContent('gravedigger'),
    );
  });

  it('flags unknown build parts gracefully', async () => {
    await renderBench('/loadout?b=L1genome_L9bogus');
    expect(screen.getByText(/COULDN'T PARSE PART OF THAT BUILD/i)).toBeInTheDocument();
    expect(screen.getByText('GNM')).toBeInTheDocument();
  });

  it('shows the calibration warning for doomgoblin', async () => {
    await renderBench();
    await userEvent.click(screen.getByRole('button', { name: /doomgoblin — inspect implant/i }));
    expect(screen.getByText(/requires calibration/i)).toBeInTheDocument();
  });
});
