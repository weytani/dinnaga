// ABOUTME: Tests for the SiteFooter component — route link columns and brand block.
// ABOUTME: Verifies the footer route links resolve and the copyright notice renders.
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { SiteFooter } from './SiteFooter';

describe('SiteFooter', () => {
  it('renders the route links and the copyright notice', () => {
    render(
      <MemoryRouter>
        <SiteFooter />
      </MemoryRouter>,
    );
    expect(screen.getByRole('link', { name: 'How we work' })).toHaveAttribute('href', '/method');
    expect(screen.getByRole('link', { name: 'Atisha Initiative' })).toHaveAttribute(
      'href',
      '/atisha',
    );
    expect(screen.getByRole('link', { name: 'Colophon' })).toHaveAttribute('href', '/colophon');
    expect(screen.getByRole('link', { name: 'Atisha project' })).toHaveAttribute(
      'href',
      'https://github.com/orgs/Dinnaga-Research/projects/1',
    );
    expect(screen.getByText('© 2026 DINNAGA')).toBeInTheDocument();
  });
});
