import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Transmission } from './Transmission';

describe('Transmission', () => {
  it('shows the success state after submitting a valid email', async () => {
    render(<Transmission />);
    await userEvent.type(screen.getByLabelText('Email'), 'reader@dinnaga.ai');
    await userEvent.click(screen.getByRole('button', { name: 'Subscribe' }));
    expect(screen.getByText(/TRANSMISSION ACCEPTED/)).toBeInTheDocument();
  });

  it('does not advance when the email has no @', async () => {
    render(<Transmission />);
    await userEvent.type(screen.getByLabelText('Email'), 'not-an-email');
    await userEvent.click(screen.getByRole('button', { name: 'Subscribe' }));
    expect(screen.queryByText(/TRANSMISSION ACCEPTED/)).not.toBeInTheDocument();
  });
});
