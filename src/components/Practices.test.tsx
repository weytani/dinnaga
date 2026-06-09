// ABOUTME: Tests for the Practices section listing the lab's two pillars and ethos.
// ABOUTME: Verifies the section title, the three card titles, and accordion expand-on-click.
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  it('shows only the summary by default and reveals the body on click', async () => {
    render(<Practices />);
    const card = screen.getByText('Project Planning').closest('.practice') as HTMLElement;

    expect(card).not.toHaveClass('is-open');
    expect(card.textContent).toContain('How the work happens: Read → Digest');
    expect(card.textContent).not.toContain('We read papers and releases');

    await userEvent.click(card);

    expect(card).toHaveClass('is-open');
    expect(card.textContent).toContain('We read papers and releases');
  });
});
