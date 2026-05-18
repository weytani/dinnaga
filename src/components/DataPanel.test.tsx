// ABOUTME: Tests for the DataPanel dossier component showing surface data and team profile.
// ABOUTME: Verifies all six data rows render and both panel headings are present.
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DataPanel } from './DataPanel';

describe('DataPanel', () => {
  it('renders all six surface-data rows', () => {
    const { container } = render(<DataPanel />);
    expect(container.querySelectorAll('.data-row')).toHaveLength(6);
  });

  it('renders both dossier panels', () => {
    render(<DataPanel />);
    expect(screen.getByText('SURFACE DATA')).toBeInTheDocument();
    expect(screen.getByText('WHO WE ARE')).toBeInTheDocument();
  });
});
