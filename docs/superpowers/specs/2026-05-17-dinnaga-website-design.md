# Dinnaga.ai Website — Design Spec

**Date:** 2026-05-17
**Status:** Approved (design) — pending implementation plan
**Project:** `~/code/dinnaga`

## Purpose

Build the public marketing & research website for **Dinnaga Research** (dinnaga.ai) — a
research, education, and consulting organization focused on broadening access to AI. The
build is a React + Vite + Bun + TypeScript application that consumes the existing
**Dinnaga Design System** and the UI kit it ships.

The first delivery is the single long-scroll homepage that the design system's UI kit
recreates. The project is structured so that dedicated Research / Education / Consulting /
Field Notes routes can be added later without restructuring.

## Decisions (from brainstorming)

| Decision | Choice | Rationale |
|---|---|---|
| Scope | Long-scroll homepage now, multi-page later | Ship the kit's homepage; keep folders routing-ready. |
| Fonts | Ship the captured woff2/ttf fonts as-is | Exact visual fidelity. **Licensing exposure — see Risks.** |
| Content | Placeholder copy, content-driven | Port the kit's sample copy into typed `src/data/` files. |
| Hosting | None decided | Plain `vite build` → `dist/`; no host-specific config. |
| Approach | A — Faithful port + vendored design system | DS README explicitly recommends vendoring its CSS as-is. |

## Source material

The design system arrives as `Dinnaga Design System-2.zip` (in `~/Downloads`, captured
2026-05-17 18:21). Relevant contents:

- `colors_and_type.css`, `components.css` — framework-agnostic CSS custom properties,
  resets, and utility classes. Vendored verbatim.
- `fonts/` — 7 woff2 + `Sevastopol-Interface.ttf`.
- `assets/` — `logo-mark.svg`, `logo-wordmark.svg`.
- `ui_kits/website/` — 12 cosmetic JSX components + `site.css` recreating the homepage.
- `README.md`, `SKILL.md` — brand voice, visual foundations, anti-patterns.

## Stack & tooling

- **Bun** (`1.3.13`) — package manager and script runner.
- **Vite 6** + `@vitejs/plugin-react`.
- **React 19** — the UI kit targets React 18 UMD; modernized to 19 (no breaking API used).
- **TypeScript** strict mode: `strict: true`, `noUncheckedIndexedAccess: true`.
- **ESLint + Prettier** — flat config.
- **Vitest + React Testing Library** — unit + integration.
- **Playwright** — e2e.

Scripts: `bun run dev` / `build` / `preview` / `test` / `test:e2e` / `lint`.

## Repo structure

```
dinnaga/
├── public/
│   ├── fonts/                   # 7 woff2 + Sevastopol-Interface.ttf, served at /fonts/
│   └── assets/                  # logo-mark.svg, logo-wordmark.svg
├── src/
│   ├── styles/
│   │   ├── colors_and_type.css  # vendored verbatim (only @font-face urls patched)
│   │   └── components.css       # vendored verbatim
│   ├── components/              # 12 ported UI-kit components (.tsx)
│   ├── hooks/                   # useTyped.ts (and future hooks)
│   ├── data/                    # typed content files
│   ├── routes/
│   │   └── Home/Home.tsx        # composes the long-scroll homepage
│   ├── types.ts                 # shared content types
│   ├── App.tsx                  # renders <Home/> today; router-ready
│   └── main.tsx                 # entry — imports the two DS CSS files
├── tests/e2e/                   # Playwright specs
├── docs/superpowers/specs/      # this document
├── index.html
├── vite.config.ts
└── package.json
```

`App.tsx` renders `<Home/>` directly today. Adding React Router later means wrapping `App`
in a router and adding siblings under `src/routes/` — no restructuring of existing files.

## Design system vendoring

- `colors_and_type.css` and `components.css` are copied **verbatim** into `src/styles/` and
  imported once in `main.tsx`. They are framework-agnostic; the DS README explicitly warns
  against re-abstracting them (no CSS Modules, no Tailwind, no CSS-in-JS).
- Fonts and logos go to `public/` so `@font-face` `url(...)` references resolve at the site
  root. **Only** the `@font-face` `url(...)` paths in `colors_and_type.css` are patched to
  `/fonts/...` — no other CSS edits.
- The `site.css` from `ui_kits/website/` is vendored alongside as the homepage layout sheet.

## Component port (JSX → TSX)

Twelve files in `src/components/`, ported close to 1:1. The Babel-standalone
`window.X = X` globals and `React.` prefixes are replaced by ESM imports.

`BrandMark` · `CookieBanner` · `SiteNav` · `Hero` (contains `Terminal` + `useTyped`) ·
`Ticker` · `Practices` (contains `Practice` + `PracticeIcon`) · `FieldNotes` (contains
`Note`) · `DataPanel` · `AsciiArt` · `CautionDivider` · `Transmission` · `SiteFooter`.

- `useTyped` moves to `src/hooks/useTyped.ts`; its async `sleep`/tick loop is preserved
  exactly.
- Each component gets a typed props interface. Subcomponents (`Note`, `Practice`,
  `PracticeIcon`, `Terminal`) stay co-located in their parent file, as the kit has them —
  they are not independently reused.
- `Home.tsx` composes the section order from the kit's `index.html`:
  CookieBanner → SiteNav → Hero → Ticker → Practices → FieldNotes → DataPanel → AsciiArt →
  CautionDivider → Transmission → SiteFooter, plus the `.crt-overlay` div.
- The `onNav` smooth-scroll handler moves into `Home.tsx`, unchanged.

## Data layer & types

Inline arrays currently buried in components move to `src/data/`, each typed against
`src/types.ts`:

| Data file | Type | Source component |
|---|---|---|
| `fieldNotes.ts` | `FieldNote` (id, cat, date, readTime, title, excerpt) | FieldNotes |
| `practices.ts` | `Practice` (num, title, icon, summary, body, meta) | Practices |
| `surfaceData.ts` | `DataRow` (idx, label, value) | DataPanel |
| `tickerItems.ts` | `string[]` | App/Ticker |
| `bootLines.ts` | `BootLine` (text, delay) | Hero terminal |
| `navLinks.ts` | `string[]` | SiteNav |

`FieldNote.cat` and `Practice.icon` use string-literal union types. The FieldNotes filter
chip set (`ALL · RESEARCH · EDUCATION · CONSULTING`) derives from the `cat` union. After
this move, components are pure presentation — swapping in real content means editing
`src/data/`, never JSX.

## Signature motions (preserved exactly)

Ported verbatim, no behavior change:

- **Nav clip-reveal** + travelling green square (`SiteNav`, 1300ms timeout).
- **CTA double-blink** on first paint (Hero primary button).
- **Terminal boot type-on** (`useTyped`) + blinking-cursor prompt + fake transmission
  submit (`setSent` / history / `[RESET]`).
- **Ticker** 38s linear marquee; **status dot** 1.6s pulse; **CRT overlay**.
- `prefers-reduced-motion` handling stays in `colors_and_type.css` as-is.

## Data flow

- Static typed data (`src/data/`) → imported by section components → rendered.
- All interactivity is local React state: `useState` for filter (`FieldNotes`), open card
  index (`Practices`), banner dismissal (`CookieBanner`), terminal input/history/sent
  (`Hero`/`Terminal`), nav green-square visibility (`SiteNav`).
- Navigation is anchor links + a smooth-scroll handler. No router today.
- No network calls. The Transmission signup and Terminal submit are cosmetic success
  states, as the kit intends (no mocks — there is simply no backend; the UI is honest that
  the response is a local state change).

## Error handling

- The site is static and content is build-time typed data — no runtime fetch failures.
- TypeScript strict mode + `noUncheckedIndexedAccess` catch data-shape errors at build.
- Terminal/Transmission inputs guard against empty submits (`input.trim()` check, preserved
  from the kit).
- Keyboard handlers on the `Practices` cards (Enter/Space) are preserved for accessibility.

## Testing

All three tiers, per project conventions. TDD where behavior is non-trivial.

- **Unit (Vitest):** `useTyped` reveals lines sequentially and sets `done`; data files
  satisfy their declared types; any pure helpers.
- **Integration (Vitest + RTL):** FieldNotes filter chips filter the grid; Practices card
  expand/collapse including keyboard activation; CookieBanner dismiss; Transmission form
  success state; Terminal submit → history entry + `[RESET]`.
- **E2E (Playwright):** homepage renders all sections; nav smooth-scroll to anchors; green
  square animates once on mount; filter chips work end-to-end; cookie banner dismiss.

Purely cosmetic components get render/smoke tests; the signature *behaviors* inside them
are covered by the integration tier.

## Risks & open items

- **Font licensing.** The shipped fonts are captured from marathonthegame.com and flagged
  research-use-only by the DS README. We ship them now per the brand owner's decision.
  **Pre-launch action: license the captured faces or swap to the README's Google Fonts
  substitutes (Antonio, Archivo, Inter/DM Sans, JetBrains Mono, VT323).** This is a
  go-live blocker, not a build blocker.
- **Hosting undecided.** Build emits a plain static `dist/`; a host-specific config can be
  added later without code changes.

## Out of scope

- Multi-page routing (folder structure is ready; routes are not built).
- Real research/education/consulting content (placeholder copy ships).
- Any backend, CMS, or live form submission.
- Reworking the design system's CSS architecture.
