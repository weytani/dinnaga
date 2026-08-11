# INDEX

Root routing table — one line per artifact/dir, so a session can find things
without bulk-loading the repo. Every content dir below carries its own
`CLAUDE.md` contract (≤40 lines); this file is capped at ≤80 lines. Both are
enforced by `src/test/dirDocs.test.ts`.

## Routes (`src/routes/`)
- `/` — `Home/` — hero, boot ticker, instruments/dossier sections.
- `/atisha` — `Atisha/` — Atisha Initiative catalog (data: `src/data/atishaCatalog.ts`).
- `/method` — `Method/` — practices/method content (data: `src/data/practices.ts`, `method.ts`).
- `/loadout` — `Loadout/` — the ripperdoc cyberware bench (see Data flow below).
- `/artifacts`, `/artifacts/:slug` — `Artifacts/` — artifact document shelf + iframe
  viewer (data: `src/data/artifacts.ts`; docs served statically from `public/artifact-docs/`,
  outside the route namespace so extensionless static hosts can't shadow the viewer).
- `/weekly`, `/weekly/:date` — `Weekly/` — Saturday week-in-review run log + report
  viewer (data: `src/data/weeklyRuns.ts`; reports served from
  `public/artifact-docs/weekly/`, outside the route namespace — see Weekly data flow).
- `/colophon` — `Colophon/` — colophon page.
- 404 — `NotFound/` — SPA fallback (`public/404.html` redirect trick).

## Data flow: megazord → zords.json → /loadout
`~/code/megazord` is the canonical zord registry (a separate repo). It exports
a snapshot via `bin/megazord export-json --out src/data/zords.json` — a
**manual, David-gated** step; nothing here calls megazord at runtime.
`src/data/zords.ts` loads the snapshot (unchecked cast, guarded by
`src/data/zords.schema.test.ts`), and `src/lib/friction.ts` +
`src/lib/buildcode.ts` derive the bench's friction/build-code logic, rendered
by `src/components/loadout/*` inside the `Loadout` route. See
`src/data/CLAUDE.md`, `src/lib/CLAUDE.md`, `src/components/loadout/CLAUDE.md`.

## Data flow: week-in-review → weeklyRuns.json → /weekly
`src/data/weeklyRuns.json` is a **vendored snapshot** appended by the Saturday
week-in-review publish step in `~/.claude/week-in-review/` — sanitize-gated,
fail-closed; nothing on the site calls it live. `src/data/weeklyRuns.ts` loads
it (unchecked cast, guarded by `src/data/weeklyRuns.schema.test.ts`); reports
land under `public/artifact-docs/weekly/`.

## Docs (`docs/`)
- `docs/STATUS.md` — current live/outstanding state (see `docs/CLAUDE.md`).
- `docs/superpowers/specs/`, `docs/superpowers/plans/` — dated design history.
- `docs/screenshots/` — PNGs referenced from `README.md`.

## Tests
- Unit/integration: vitest, co-located `*.test.ts`/`*.test.tsx` next to
  source (`bun run test`); dir-doc and snapshot-schema guards live in
  `src/test/dirDocs.test.ts` and `src/data/zords.schema.test.ts`.
- End-to-end: Playwright specs in `tests/e2e/` (`bun run test:e2e`) — see
  `tests/e2e/CLAUDE.md`.

## Deploy
Vercel (`.vercel/project.json`, project `dinnaga`) — **dinnaga.ai is live via
Vercel**. Deploys are **manual**: `vercel deploy --prod` from the repo root
(no Git integration — pushing `main` does NOT deploy); `.github/workflows/ci.yml`
runs lint/test/build as a gate only (no deploy step). Vercel bot protection
challenges non-browser clients (curl/automation get 403 + security checkpoint).
