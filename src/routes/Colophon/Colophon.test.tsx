// ABOUTME: Tests the Colophon page renders the about-the-lab content.
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Colophon } from './Colophon';

describe('Colophon', () => {
  it('renders the colophon heading and the anonymity note', () => {
    render(<Colophon />);
    expect(screen.getByRole('heading', { name: /Colophon/i })).toBeInTheDocument();
    expect(screen.getByText(/anonymous by design/i)).toBeInTheDocument();
  });
});
