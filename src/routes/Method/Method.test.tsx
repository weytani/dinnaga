// ABOUTME: Tests the How We Work page renders the five-stage loop.
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Method } from './Method';

describe('Method', () => {
  it('renders all five stages of the loop', () => {
    render(<Method />);
    ['Read', 'Digest', 'Ideate', 'Experiment', 'Ship'].forEach((s) => {
      expect(screen.getByText(s)).toBeInTheDocument();
    });
  });
});
