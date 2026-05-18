// ABOUTME: Hero terminal boot sequence — placeholder lines from the UI kit.
// ABOUTME: The Terminal component types these in character-by-character on mount.
import type { BootLine } from '../types';

export const BOOT_LINES: BootLine[] = [
  { text: 'DINNAGA-OS  v0.4.1   //   TERMINAL · SIGNAL // 042', delay: 60 },
  { text: 'ESTABLISHING UPLINK  ........  OK', delay: 70 },
  { text: 'DECRYPTING DOSSIER   ........  OK', delay: 70 },
  { text: 'OPERATOR  : VISITOR', delay: 60 },
  { text: 'CHANNEL   : RESEARCH / EDUCATION / CONSULTING', delay: 60 },
  { text: '', delay: 30 },
  { text: '▸  ASK US ANYTHING ABOUT AI ADOPTION.', delay: 60 },
  { text: '▸  WE READ EVERYTHING. WE REPLY TO ALMOST EVERYTHING.', delay: 60 },
  { text: '', delay: 30 },
];
