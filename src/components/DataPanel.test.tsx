// ABOUTME: Tests the dossier panel renders true lab facts and the "who we are" prose.
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DataPanel } from './DataPanel';

describe('DataPanel', () => {
  it('renders true lab dossier rows and identity prose', () => {
    render(<DataPanel />);
    expect(screen.getByText('Ethos')).toBeInTheDocument();
    // "Open source" appears in the Ethos dossier row and a who-we-are bullet; both are true copy.
    expect(screen.getAllByText(/open source/i).length).toBeGreaterThan(0);
    expect(screen.getByText('Identity')).toBeInTheDocument();
    expect(screen.getByText(/anonymous by design/i)).toBeInTheDocument();
  });
});
