// ABOUTME: Tests for the Terminal interactive component.
// ABOUTME: Covers boot sequence reveal, question submission, and reset.
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Terminal } from './Terminal';

describe('Terminal', () => {
  it('reveals the prompt after boot and records a submitted question', async () => {
    render(<Terminal bootLines={[{ text: 'OK', delay: 30 }]} />);

    const input = await screen.findByLabelText('Ask Dinnaga a question', undefined, {
      timeout: 3000,
    });
    await userEvent.type(input, 'How do we start?');
    await userEvent.keyboard('{Enter}');

    expect(screen.getByText('> How do we start?')).toBeInTheDocument();
    expect(screen.getByText(/TRANSMISSION RECEIVED/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '[RESET]' })).toBeInTheDocument();
  });

  it('clears history when [RESET] is pressed', async () => {
    render(<Terminal bootLines={[{ text: 'OK', delay: 30 }]} />);
    const input = await screen.findByLabelText('Ask Dinnaga a question', undefined, {
      timeout: 3000,
    });
    await userEvent.type(input, 'ping{Enter}');
    await userEvent.click(screen.getByRole('button', { name: '[RESET]' }));
    await waitFor(() => expect(screen.queryByText('> ping')).not.toBeInTheDocument());
  });
});
