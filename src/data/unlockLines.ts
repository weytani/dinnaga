// ABOUTME: Terminal reveal script played when the hidden-shelf passphrase matches.
// ABOUTME: Typed out character-by-character, then the Terminal routes to /artifacts.
import type { BootLine } from '../types';

export const UNLOCK_LINES: BootLine[] = [
  { text: 'PASSPHRASE ACCEPTED.', delay: 240 },
  { text: 'OPERATOR  : RECOGNIZED', delay: 120 },
  { text: 'CLEARANCE : LEVEL 42', delay: 120 },
  { text: 'UNSEALING ARTIFACT SHELF ....  OK', delay: 200 },
  { text: '', delay: 40 },
  { text: '▸ ACCESS GRANTED — ROUTING TO /ARTIFACTS', delay: 60 },
];
