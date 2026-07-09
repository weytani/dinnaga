Static site content: TypeScript modules exporting typed arrays/objects consumed
directly by components. Most files (`bootLines.ts`, `links.ts`, `method.ts`,
`navLinks.ts`, `practices.ts`, `surfaceData.ts`, `tickerItems.ts`,
`atishaCatalog.ts`, `loadoutBootLines.ts`) are plain literal data — their only
contract is the matching type in `../types.ts`.

**`zords.json` is the one exception.** It is a **vendored snapshot** exported
from the separate megazord registry repo:
`~/code/megazord/bin/megazord export-json --out src/data/zords.json`.
Refreshing it is a deliberate **manual, David-gated** step — nothing in this
site calls megazord at runtime, and no build step regenerates it.

`zords.ts` loads the snapshot with an **unchecked cast**
(`raw as unknown as ZordsDoc`) — TypeScript cannot verify a JSON literal
against an interface, so a corrupted or hand-edited snapshot would otherwise
crash `ImplantModal` at runtime instead of failing a build.
`zords.schema.test.ts` is the guard: every zord's core string fields are
non-empty, its array fields are arrays, `stats.length` is 2–4, every `slot`
resolves against `slots[].id`, and every conflict/stack member resolves via
`zordByName`. `zords.test.ts` covers the business-rule invariants (tier enum,
unique codes, provenance labels) on top of this.
