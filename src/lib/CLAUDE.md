Pure, side-effect-free logic — no React, no DOM, no imports from
`../components` or `../routes`. Mostly the `/loadout` bench, plus the
hidden-shelf passphrase matcher.

- `friction.ts` — `analyze()` computes synergies/conflicts/hazards/drift/
  context-load from the real isolation read/write masks (`FrictionReport` in
  `../types`). `conflictKey(a, b)` is the canonical `a~b` sort-join used to
  match a pair against the registry's `conflicts` list.
- `buildcode.ts` — the loadout URL codec: `encode`/`decode` a `Loadout` to/from
  the `?b=` query param, `shortCode`/`autoName` for display, `encodeResolved`/
  `decodeResolved` for the `?r=` acknowledged-conflicts param.
- `unlock.ts` — `isUnlockPhrase()` normalizes terminal input (case, whitespace,
  trailing punctuation, curly apostrophe) and exact-matches `UNLOCK_PHRASES`;
  gates the hidden `/artifacts` reveal in `src/components/Terminal.tsx`.

All modules are deterministic given their inputs. The friction/buildcode
`.test.ts` files mix hand-built `Zord`/`FrictionInput` fixtures (edge cases,
isolation rules) with pins against the real `../data/zords` registry
(`funes`/`hler` conflict, real stack membership); `unlock.test.ts` pins
accepted variants and rejected near-misses.
