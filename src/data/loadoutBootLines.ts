// ABOUTME: Boot sequence lines for the /loadout ripperdoc chair power-on overlay.
// ABOUTME: Same BootLine shape the Hero terminal uses; consumed by useTyped.
import type { BootLine } from '../types';

export const LOADOUT_BOOT_LINES: BootLine[] = [
  { text: 'RIPPERDOC BENCH  v2.0.77   //   CHAIR POWER-ON', delay: 60 },
  { text: 'CLAMPS ......................... ENGAGED', delay: 60 },
  { text: 'ANAESTHETIC .................... DECLINED', delay: 60 },
  { text: 'ZORD REGISTRY .................. 13 FOUND', delay: 60 },
  { text: 'ISOLATION MASKS ................ VERIFIED', delay: 60 },
  { text: '', delay: 30 },
  { text: '▸  NOTHING GETS WIRED LIVE. INERT UNTIL THE DOC SIGNS OFF.', delay: 60 },
];
