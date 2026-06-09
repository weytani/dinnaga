// ABOUTME: Sequentially reveals terminal boot lines character-by-character.
// ABOUTME: Returns the rendered line strings plus a `done` flag for the Hero terminal.
import { useEffect, useState } from 'react';
import type { BootLine } from '../types';

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export function useTyped(lines: BootLine[]) {
  // Under reduced motion, paint the final boot text immediately and skip the
  // per-character animation. The terminal still shows its complete output.
  const reduced = prefersReducedMotion();
  const [rendered, setRendered] = useState<string[]>(() =>
    reduced ? lines.map((l) => l.text) : [],
  );
  const [done, setDone] = useState(() => reduced);

  useEffect(() => {
    if (reduced) return;
    let cancelled = false;
    let lineIdx = 0;
    let charIdx = 0;
    const out = lines.map(() => '');

    async function tick() {
      while (!cancelled && lineIdx < lines.length) {
        const line = lines[lineIdx];
        if (!line) break;
        if (charIdx < line.text.length) {
          out[lineIdx] = line.text.slice(0, charIdx + 1);
          charIdx += 1;
          setRendered([...out]);
          // Per-character cadence — the `delay === 30` branch is a verbatim
          // port artifact from the UI kit's terminal; kept for fidelity.
          await sleep(line.delay === 30 ? 10 : 14);
        } else {
          lineIdx += 1;
          charIdx = 0;
          await sleep(line.delay);
        }
      }
      if (!cancelled) setDone(true);
    }

    tick();
    return () => {
      cancelled = true;
    };
    // Runs once on mount; `lines` is treated as a stable mount-time input.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { rendered, done };
}
