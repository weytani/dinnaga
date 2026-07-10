Pure, side-effect-free logic for the `/loadout` bench — no React, no DOM, no
imports from `../components` or `../routes`.

- `friction.ts` — `analyze()` computes synergies/conflicts/hazards/drift/
  context-load from the real isolation read/write masks (`FrictionReport` in
  `../types`). `conflictKey(a, b)` is the canonical `a~b` sort-join used to
  match a pair against the registry's `conflicts` list.
- `buildcode.ts` — the loadout URL codec: `encode`/`decode` a `Loadout` to/from
  the `?b=` query param, `shortCode`/`autoName` for display, `encodeResolved`/
  `decodeResolved` for the `?r=` acknowledged-conflicts param.

Both modules are deterministic given their inputs. Their `.test.ts` files mix
hand-built `Zord`/`FrictionInput` fixtures (edge cases, isolation rules) with
pins against the real `../data/zords` registry (`funes`/`hler` conflict, real
stack membership) — see each test file's own fixtures for the split.
