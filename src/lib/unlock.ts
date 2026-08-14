// ABOUTME: Passphrase matcher for the hidden artifact shelf — pure input normalization.
// ABOUTME: Consumed by the home Terminal; the phrase is a gate, not a secret.
export const UNLOCK_PHRASES = ['show me what you got', "show me what you've got"] as const;

function normalize(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/’/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[.!?]+$/, '')
    .trim();
}

export function isUnlockPhrase(raw: string): boolean {
  const phrase = normalize(raw);
  return (UNLOCK_PHRASES as readonly string[]).includes(phrase);
}
