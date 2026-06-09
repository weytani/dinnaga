// ABOUTME: Tests the Atisha Initiative page — mission, validation bar, catalog states.
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import type { AtishaEntry } from '../../types';
import { Atisha } from './Atisha';

const FIRST_PARTY_ENTRY: AtishaEntry = {
  slug: 'arxiv-prospector',
  title: 'Arxiv Prospector',
  category: 'tool',
  oneLiner: 'Daily triage that scores arxiv papers against a research-to-tools rubric.',
  sourceUrl: 'https://github.com/Dinnaga-Research/atisha/tree/main/validated/arxiv-prospector',
  validatedOn: '2026-06-01',
  whyUseful: 'Turns a noisy feed into a short list of papers worth building from.',
  howValidated: 'Ran it daily for two weeks and shipped tools from its picks.',
  attribution: '',
};

const THIRD_PARTY_ENTRY: AtishaEntry = {
  ...FIRST_PARTY_ENTRY,
  slug: 'whisper-transcribe',
  title: 'Whisper Transcribe',
  oneLiner: 'High-accuracy speech-to-text for meeting notes.',
  attribution: 'OpenAI',
};

describe('Atisha', () => {
  it('renders the mission heading and the repo link', () => {
    render(<MemoryRouter><Atisha /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: /Atisha Initiative/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /open-source reference/i }))
      .toHaveAttribute('href', 'https://github.com/orgs/Dinnaga-Research/projects/1');
  });

  it('shows the empty-state when the catalog has no entries', () => {
    render(<MemoryRouter><Atisha /></MemoryRouter>);
    // ATISHA_CATALOG ships empty at launch.
    expect(screen.getByText(/first validated entries are on the way/i)).toBeInTheDocument();
  });

  it('renders a first-party entry card with no attribution span', () => {
    render(<MemoryRouter><Atisha entries={[FIRST_PARTY_ENTRY]} /></MemoryRouter>);
    expect(screen.queryByText(/first validated entries are on the way/i)).not.toBeInTheDocument();
    expect(screen.getByText(FIRST_PARTY_ENTRY.title)).toBeInTheDocument();
    expect(screen.getByText(FIRST_PARTY_ENTRY.oneLiner)).toBeInTheDocument();
    expect(screen.getByText(/How we validated it:/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^source/i }))
      .toHaveAttribute('href', FIRST_PARTY_ENTRY.sourceUrl);
    // attribution === '' → no "via" credit span.
    expect(screen.queryByText(/^via /)).not.toBeInTheDocument();
  });

  it('renders the "via" attribution span for a third-party entry', () => {
    render(<MemoryRouter><Atisha entries={[THIRD_PARTY_ENTRY]} /></MemoryRouter>);
    expect(screen.getByText(`via ${THIRD_PARTY_ENTRY.attribution}`)).toBeInTheDocument();
  });
});
