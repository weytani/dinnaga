// ABOUTME: Tests the Atisha Initiative page — mission, validation bar, catalog states.
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Atisha } from './Atisha';

describe('Atisha', () => {
  it('renders the mission heading and the repo link', () => {
    render(<MemoryRouter><Atisha /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: /Atisha Initiative/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /open-source reference/i }))
      .toHaveAttribute('href', 'https://github.com/Dinnaga-Research/atisha');
  });

  it('shows the empty-state when the catalog has no entries', () => {
    render(<MemoryRouter><Atisha /></MemoryRouter>);
    // ATISHA_CATALOG ships empty at launch.
    expect(screen.getByText(/first validated entries are on the way/i)).toBeInTheDocument();
  });
});
