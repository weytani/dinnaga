import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SiteFooter } from './SiteFooter';

describe('SiteFooter', () => {
  it('renders the three link columns and the brand block', () => {
    const { container } = render(<SiteFooter />);
    expect(container.querySelectorAll('.foot-col')).toHaveLength(3);
    expect(screen.getByText('© 2026 DINNAGA RESEARCH')).toBeInTheDocument();
  });
});
