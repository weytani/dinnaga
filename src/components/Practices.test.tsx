import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Practices } from './Practices';

describe('Practices', () => {
  it('shows the summary by default and the longer body after a click', async () => {
    render(<Practices />);
    const research = screen.getByText('Research').closest('.practice') as HTMLElement;

    expect(research).not.toHaveClass('is-open');
    expect(research.textContent).toContain('written for operators, not investors.');
    expect(research.textContent).not.toContain('quarterly primers');

    await userEvent.click(research);

    expect(research).toHaveClass('is-open');
    expect(research.textContent).toContain('quarterly primers');
  });

  it('toggles open on Enter keypress', async () => {
    render(<Practices />);
    const research = screen.getByText('Research').closest('.practice') as HTMLElement;
    research.focus();
    await userEvent.keyboard('{Enter}');
    expect(research).toHaveClass('is-open');
  });
});
