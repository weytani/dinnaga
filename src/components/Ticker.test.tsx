// ABOUTME: Tests for the Ticker scrolling marquee and AsciiArt decorative components.
// ABOUTME: Verifies the ticker duplicates items for a seamless loop and the ASCII heading renders.
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Ticker } from './Ticker';
import { AsciiArt } from './AsciiArt';

describe('Ticker', () => {
  it('renders the joined items twice for a seamless loop', () => {
    const { container } = render(<Ticker items={['ONE', 'TWO']} />);
    const texts = container.querySelectorAll('.ticker-text');
    expect(texts).toHaveLength(2);
    expect(texts[0]?.textContent).toContain('ONE');
    expect(texts[0]?.textContent).toContain('TWO');
  });
});

describe('AsciiArt', () => {
  it('renders the dossier section heading', () => {
    render(<AsciiArt />);
    expect(screen.getByText('Decoded // wireframe.')).toBeInTheDocument();
  });
});
