// ABOUTME: Tests for the FieldNotes grid section with category filter chips.
// ABOUTME: Verifies all notes render by default and category filtering reduces the visible set.
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { FieldNotes } from './FieldNotes';

describe('FieldNotes', () => {
  it('shows all four notes by default', () => {
    const { container } = render(<FieldNotes />);
    expect(container.querySelectorAll('.note')).toHaveLength(4);
  });

  it('filters to research notes when the RESEARCH chip is clicked', async () => {
    const { container } = render(<FieldNotes />);
    await userEvent.click(screen.getByRole('button', { name: 'RESEARCH' }));
    const notes = container.querySelectorAll('.note');
    expect(notes).toHaveLength(2);
    for (const note of notes) {
      expect(note.querySelector('.note-cat')?.textContent).toBe('RESEARCH');
    }
  });
});
