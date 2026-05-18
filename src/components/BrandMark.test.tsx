// ABOUTME: Tests for the BrandMark and CautionDivider leaf components.
// ABOUTME: Verifies the brand SVG sizes correctly and the divider renders.
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BrandMark } from './BrandMark';
import { CautionDivider } from './CautionDivider';

describe('BrandMark', () => {
  it('renders an svg at the requested size', () => {
    const { container } = render(<BrandMark size={32} />);
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg).toHaveAttribute('width', '32');
  });
});

describe('CautionDivider', () => {
  it('renders a decorative separator', () => {
    const { container } = render(<CautionDivider />);
    expect(container.querySelector('.caution-stripes')).not.toBeNull();
  });
});
