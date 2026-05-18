// ABOUTME: Integration test for the Home route — the full long-scroll homepage composition.
// ABOUTME: Verifies key section headings and the CRT overlay are present after render.
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Home } from './Home';

describe('Home', () => {
  it('renders the full long-scroll homepage', () => {
    const { container } = render(<Home />);
    expect(screen.getByText('Research for the rest of us.')).toBeInTheDocument();
    expect(screen.getByText('Three quiet practices.')).toBeInTheDocument();
    expect(screen.getByText("What we've been writing.")).toBeInTheDocument();
    expect(container.querySelector('.crt-overlay')).not.toBeNull();
  });
});
