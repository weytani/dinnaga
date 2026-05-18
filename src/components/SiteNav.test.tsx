// ABOUTME: Tests for the SiteNav sticky navigation component.
// ABOUTME: Covers the mount animation green square and nav link click callbacks.
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SiteNav } from './SiteNav';

describe('SiteNav', () => {
  it('shows the travelling green square on mount, then removes it', async () => {
    const { container } = render(<SiteNav />);
    expect(container.querySelector('.green-square')).not.toBeNull();
    await waitFor(() => expect(container.querySelector('.green-square')).toBeNull(), {
      timeout: 2500,
    });
  });

  it('calls onNav with the slugified link id when a nav link is clicked', async () => {
    const onNav = vi.fn();
    render(<SiteNav onNav={onNav} />);
    await userEvent.click(screen.getByText('FIELD NOTES'));
    expect(onNav).toHaveBeenCalledWith('field-notes');
  });
});
