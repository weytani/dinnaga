// ABOUTME: Tests for the Hero above-the-fold section.
// ABOUTME: Covers headline and CTA rendering; the Terminal has its own test file.
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Hero } from './Hero';

describe('Hero', () => {
  it('renders the headline and both CTAs', () => {
    render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>,
    );
    expect(screen.getByText('Validated, then shared.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'See the Atisha Initiative' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'How we work' })).toBeInTheDocument();
  });
});
