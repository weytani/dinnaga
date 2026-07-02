// ABOUTME: Tests for the Instruments proof section — live registry stats plus the bench screenshot.
// ABOUTME: Stat values are derived from the real ZORDS snapshot rather than hardcoded, beyond the 13/12 pins.
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { Instruments } from './Instruments';
import { ZORDS } from '../data/zords';

function expectedTestsTotal() {
  const firstTestsByPaper = new Map<string, number>();
  for (const z of ZORDS) {
    if (!firstTestsByPaper.has(z.paper)) firstTestsByPaper.set(z.paper, z.tests);
  }
  return [...firstTestsByPaper.values()].reduce((sum, n) => sum + n, 0);
}

describe('Instruments', () => {
  it('renders the section title and lede', () => {
    render(
      <MemoryRouter>
        <Instruments />
      </MemoryRouter>,
    );
    expect(screen.getByText('Proof you can pick up.')).toBeInTheDocument();
    expect(screen.getByText(/ripperdoc bench is that bar made playable/)).toBeInTheDocument();
  });

  it('renders live registry stats derived from the ZORDS snapshot', () => {
    render(
      <MemoryRouter>
        <Instruments />
      </MemoryRouter>,
    );
    const implants = ZORDS.length;
    const papers = new Set(ZORDS.map((z) => z.paper)).size;
    const tests = expectedTestsTotal();

    expect(implants).toBe(13);
    expect(papers).toBe(12);

    expect(screen.getByText(String(implants))).toBeInTheDocument();
    expect(screen.getByText(String(papers))).toBeInTheDocument();
    expect(screen.getByText(tests.toLocaleString('en-US'))).toBeInTheDocument();
    expect(screen.getByText('IMPLANTS ON THE SHELF')).toBeInTheDocument();
    expect(screen.getByText('PAPERS REPRODUCED')).toBeInTheDocument();
    expect(screen.getByText('TESTS GREEN')).toBeInTheDocument();
  });

  it('renders the bench screenshot linking to /loadout', () => {
    render(
      <MemoryRouter>
        <Instruments />
      </MemoryRouter>,
    );
    const img = screen.getByAltText(
      'The ripperdoc bench with a three-implant build equipped — HUD gauges, body navigator, and friction report',
    );
    expect(img).toHaveAttribute('src', '/assets/loadout-bench.png');
    const link = img.closest('a');
    expect(link).toHaveAttribute('href', '/loadout');
  });

  it('renders a CTA to equip a loadout', () => {
    render(
      <MemoryRouter>
        <Instruments />
      </MemoryRouter>,
    );
    expect(screen.getByRole('button', { name: 'Equip a loadout' })).toBeInTheDocument();
    expect(screen.getByText('proposed builds only — nothing gets wired live.')).toBeInTheDocument();
  });
});
