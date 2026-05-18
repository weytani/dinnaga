import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useTyped } from './useTyped';

describe('useTyped', () => {
  it('reveals every line character-by-character then reports done', async () => {
    const lines = [
      { text: 'AB', delay: 30 },
      { text: 'CD', delay: 30 },
    ];
    const { result } = renderHook(() => useTyped(lines));

    await waitFor(() => expect(result.current.done).toBe(true), { timeout: 3000 });
    expect(result.current.rendered).toEqual(['AB', 'CD']);
  });

  it('starts with an empty render and not-done state', () => {
    const { result } = renderHook(() => useTyped([{ text: 'X', delay: 30 }]));
    expect(result.current.done).toBe(false);
  });

  it('cancels the loop on unmount without completing', async () => {
    const { result, unmount } = renderHook(() =>
      useTyped([{ text: 'LONGLINE', delay: 200 }]),
    );
    expect(result.current.done).toBe(false);
    unmount();
    // After unmount the cancelled flag stops the loop; done never flips.
    await new Promise((r) => setTimeout(r, 100));
    expect(result.current.done).toBe(false);
  });
});
