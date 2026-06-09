// ABOUTME: Tests the Transmission dispatch renders its heading and mission copy.
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Transmission } from './Transmission';

describe('Transmission', () => {
  it('renders the dispatch heading and mission copy', () => {
    render(<Transmission />);
    expect(screen.getByText('The Atisha Initiative is open.')).toBeInTheDocument();
    expect(screen.getByText(/open-source reference/i)).toBeInTheDocument();
  });
});
