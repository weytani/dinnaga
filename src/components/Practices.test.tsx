// ABOUTME: Tests for the Practices section listing the lab's two pillars and ethos.
// ABOUTME: Verifies the section title and the three card titles render.
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Practices } from './Practices';

describe('Practices', () => {
  it('renders the two pillars and the ethos card', () => {
    render(<Practices />);
    expect(screen.getByText('How the lab works.')).toBeInTheDocument();
    expect(screen.getByText('Open by ethos')).toBeInTheDocument();
    expect(screen.getByText('Project Planning')).toBeInTheDocument();
    expect(screen.getByText('The Atisha Initiative')).toBeInTheDocument();
  });
});
