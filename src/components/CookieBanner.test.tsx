import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CookieBanner } from './CookieBanner';

describe('CookieBanner', () => {
  it('marks itself dismissed and calls onDismiss when Accept is clicked', async () => {
    const onDismiss = vi.fn();
    const { container } = render(<CookieBanner onDismiss={onDismiss} />);
    const banner = container.querySelector('.cookie');

    expect(banner).not.toHaveClass('is-dismissed');
    await userEvent.click(screen.getByRole('button', { name: 'Accept' }));

    expect(banner).toHaveClass('is-dismissed');
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('dismisses on Decline too', async () => {
    const { container } = render(<CookieBanner />);
    await userEvent.click(screen.getByRole('button', { name: 'Decline' }));
    expect(container.querySelector('.cookie')).toHaveClass('is-dismissed');
  });
});
