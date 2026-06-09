// ABOUTME: Tests the 404 page renders a not-found message and a home link.
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { NotFound } from './NotFound';

describe('NotFound', () => {
  it('renders a 404 message and a link home', () => {
    render(<MemoryRouter><NotFound /></MemoryRouter>);
    expect(screen.getByText(/404/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to base/i })).toHaveAttribute('href', '/');
  });
});
