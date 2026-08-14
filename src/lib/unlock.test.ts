// ABOUTME: Tests for the hidden-shelf passphrase matcher.
// ABOUTME: Pins accepted variants (case, spacing, punctuation, apostrophe) and rejected near-misses.
import { describe, expect, it } from 'vitest';
import { isUnlockPhrase } from './unlock';

describe('isUnlockPhrase', () => {
  it.each([
    'show me what you got',
    'SHOW ME WHAT YOU GOT',
    '  show   me  what you got  ',
    'show me what you got!',
    'show me what you got?!',
    'show me what you got.',
    "show me what you've got",
    "SHOW ME WHAT YOU'VE GOT",
    'show me what you’ve got',
  ])('accepts %j', (phrase) => {
    expect(isUnlockPhrase(phrase)).toBe(true);
  });

  it.each([
    'please show me what you got',
    'show me what you got now',
    'show me what you have got',
    'show me',
    'how do we start?',
    '',
    '   ',
  ])('rejects %j', (phrase) => {
    expect(isUnlockPhrase(phrase)).toBe(false);
  });
});
