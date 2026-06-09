# Dinnaga.ai — Two-Pillar Lab Site (secure · finish · polish)

**Date:** 2026-06-08
**Status:** Design (revised) — awaiting David's review
**Repo:** `github.com/weytani/dinnaga` → `dinnaga.ai` (GitHub Pages)
**Org:** `Dinnaga-Research` (display name to be scrubbed of "Phylon")

---

## 1. Goal

Three things, one pass:

1. **Secure it** — `https://dinnaga.ai` currently fails (only plain HTTP works). Fix TLS, enforce HTTPS.
2. **Finish & polish it** — take the single-page design-kit port to a real, polished, multi-page site.
3. **Represent real ongoing work** — replace the fictional "AI-adoption consultancy" placeholder with the **two real public pillars** of the Dinnaga lab.

## 2. Identity & voice

- **Public name: "Dinnaga."** Site is the public face of the **Dinnaga** org (`Dinnaga-Research`). **All "Phylon" references scrubbed.**
- **Anonymous by design.** No personal name anywhere. The lab is a persona; its work is real.
- **Open-source ethos.** The lab validates things and shares what's genuinely useful, openly, to accelerate AI adoption. That ethos is the site's thesis.
- **Voice:** terse, dry, a little cryptic — terminal / dispatch register, matching the existing visual system.
- **Naming line (real, used in copy):** *Dignāga* → perception / epistemics / **valid cognition (pramāṇa)**; *Atiśa* → the *Lamp for the Path*, transmission, bringing validated teaching into wider use; *Rhi* → the lab's multi-agent research methodology.

## 3. The two pillars (the site's real content "for now")

The whole site foregrounds exactly two initiatives. Everything else is shelved as Phase-2 backlog (§8).

### Pillar A — Project Planning *(how the work happens)*
- **Real repo:** `Dinnaga-Research/project-planning` (private today; an intentional scaffold).
- **The public-worthy substance:** its working loop — **Read → Digest → Ideate → Experiment → Ship** — and structure (`papers/ experiments/ skills/ ideas/ resources/`).
- **On the site:** a "How We Work" page describing the lab's research pipeline. (Title scrubbed from "Phylon Project Planning" → Dinnaga.)
- This pillar is **the funnel**: where ideas are read, tried, and either die or graduate.

### Pillar B — The Atisha Initiative *(what comes out, shared openly)*
- **New project, to be created under the Dinnaga org** (`Dinnaga-Research/atisha`, **public**).
- **Mission:** an open-source public reference of the things the lab has **validated as genuinely useful and worth sharing** — published openly to **accelerate AI adoption**.
- **The validation bar IS the lab's identity:** veracity-first, claim-verifying, "no mocks / real APIs," deliberation-tested. A thing earns an Atisha entry only after the lab has actually used and validated it. May include **third-party tools the lab vouches for** (properly attributed) — recommending what works *is* the open-source contribution.
- **Atisha is the graduation target** of the Project-Planning funnel.

**Relationship, in one line:** *Project Planning is the kitchen; Atisha is the menu of dishes we'd actually serve you.*

## 4. Architecture: the Atisha repo (new, open-source)

Create `Dinnaga-Research/atisha` as a **public** repo — the canonical, open-source home of validated entries. The website is its polished **front door** and links to it.

```
atisha/
  README.md          Mission, the validation bar, how to read it, how to contribute
  LICENSE            Open license (ethos-consistent)
  CONTRIBUTING.md    The validation criteria + entry template
  validated/         One markdown file per validated item
    <slug>.md        What it is · why it's useful · how we validated it · link · category
  index.json         Machine-readable catalog (the site reads this)
```

- **Entry schema (`validated/<slug>.md` front-matter):** `title, category (skill|tool|method|paper), one-liner, source-url, validated-on, why-useful, how-validated, attribution`.
- **`index.json`** is generated/maintained so the website can render the catalog without scraping markdown. (Build step or hand-maintained — see §6.)
- **Launch state:** charter + criteria + structure, **zero fabricated entries.** Real entries are added as David validates them (optionally a small confirmed seed at launch — David's call, §7).

## 5. Information architecture (site routes)

Approach **A**, narrowed to the two pillars. Clean URLs.

| Route | Page | Purpose |
|---|---|---|
| `/` | **Home** | Lab front page — Hero (Dinnaga + open-source ethos), Ticker, the two pillars featured prominently, dossier (true lab facts), Footer. Reuses existing components. |
| `/atisha` | **Atisha Initiative** | Mission, the validation bar, the catalog of validated entries (grows; pulled from `atisha` repo / `index.json`), link to the public repo. |
| `/method` | **How We Work** | The Project-Planning loop (Read → Digest → Ideate → Experiment → Ship); link to the repo. |
| `/colophon` | **Colophon** | About the lab — persona "rules," how the site's built, contact. No personal name. |
| `*` | **404** | Not-found; doubles as the GitHub-Pages SPA deep-link fallback. |

*(The earlier rich `/notes` + `/instruments` IA is deferred with the Phase-2 backlog. Components built for them are repurposed, not discarded.)*

## 6. Routing & content model

- **Routing — Clean URLs.** React Router + a `public/404.html` redirect-to-`index.html` shim (standard GH-Pages SPA trick) so deep links survive hard refresh.
- **Atisha catalog — repo-canonical.** The website renders the validated catalog from the `atisha` repo. Mechanism (decide at build): **(a)** commit a copy of `index.json` into the site and refresh on deploy, or **(b)** fetch the raw `index.json` from the public repo at runtime. Default: **(a)** — deterministic, no runtime dependency, cache-friendly; the deploy workflow refreshes it.
- **Site data** stays the clean typed `src/data/*.ts` pattern (dossier, ticker, pillar copy). Long-form site prose (How We Work, Atisha mission, colophon) authored as **Markdown** rendered with one lightweight lib.

## 7. Component plan & content

**Reuse (repoint content, don't rebuild):** `Hero` (lab + ethos), `Ticker` (real status lines), `Practices` (repurposed to present the two pillars + ethos), `DataPanel` (true dossier), `Transmission` (launch dispatch), `BrandMark`, `CautionDivider`, `AsciiArt`, `SiteNav`, `CookieBanner`, `SiteFooter`. `FieldNotes` is held for Phase-2 (or repurposed to preview Atisha entries).

**Add (thin):** `Layout`/router shell · `AtishaPage` + `AtishaEntry`/catalog list · `MethodPage` · `Colophon` · `NotFound`.

**Dossier (true lab facts — replaces fictional "7 researchers, UK·DE·KE"):**
`identity: anonymous by design` · `ethos: open source` · `mission: validate, then share what's genuinely useful` · `method: Read → Digest → Ideate → Experiment → Ship` · `validation bar: veracity-first, real APIs, no mocks` · `research methodology: Rhi (multi-agent debate)` · `initiatives live: 2`.

**Ticker (real):** `open-source by ethos` · `validate, then share` · `Atisha Initiative — online` · `the bar: genuinely useful, or it doesn't ship` · `no mocks — real validation` · `accelerating AI adoption`.

> **David — line-items needing your pen:**
> 1. **Atisha launch content:** charter + structure only, or seed it with a few *real* validated items now? If seeding, name them (incl. third-party tools you vouch for) and I'll write the entries.
> 2. **Repo names/visibility:** `Dinnaga-Research/atisha` public (yes — the whole point). `project-planning` — make public to link, or link only once it has content / keep referenced-but-unlinked?
> 3. **Org display name:** rename `Dinnaga-Research` away from "Phylon Institute"? (Site scrubs Phylon either way.)

## 8. Phase-2 backlog (parked, not shipped)

Written down so it isn't lost. These become **candidate Atisha entries** (things the lab built + validated) and/or a future `/notes` + `/instruments` expansion:

- Instruments: GRAVEDIGGER (nightly arxiv triage), arxiv-dspy, the DSPy build-optimization harness (client anonymized), the agent memory architecture, website-design-copier, rhisearch-center.
- Field notes (12 drafted): *Is grep all you need?*, *A clerk not an average*, *Consolidation is sleep*, *The deliverable is the corpus*, etc.
- Dossier proof-metrics (GRAVEDIGGER): 3,875 triaged / 42 promoted / 4,031-id ledger.
- **Third-party attribution rule (carries forward):** simmer, deliberation, Tracker/Mammoth/Dippin, `pi` are other teams' work — recommended/attributed, never claimed.

## 9. Security & deploy fix (the "secure it" half)

**Diagnosis (verified 2026-06-07):**

| Check | State |
|---|---|
| Apex `dinnaga.ai` A records | ✅ correct (4 GitHub Pages IPs) |
| `www.dinnaga.ai` CNAME | ❌ `weytani.github.**com**` → must be `weytani.github.**io**` |
| GitHub `https_certificate.state` | ❌ `bad_authz` ("start over") |
| Cert served | ⚠️ `*.github.io` fallback → `https://dinnaga.ai` fails SSL verify |
| `https_enforced` | ❌ `false` |

**Root cause:** `www` CNAME points at `github.com` not `github.io`; broke Let's Encrypt validation (apex + www provisioned together).

**Fix sequence:**
1. **David (Squarespace DNS):** `www` CNAME → `weytani.github.io`.
2. **Claude (post-propagation):** remove + re-add the custom domain via GitHub Pages API to restart ACME; verify cert reaches `issued`.
3. **Claude:** enable **Enforce HTTPS**.
4. **Claude:** add `public/404.html` SPA fallback (also serves the clean-URL routing).

## 10. Polish pass

Typography scale + rhythm · responsive breakpoints (all routes) · a11y (landmarks, `focus-visible`, `prefers-reduced-motion` for typed-boot + marquee, contrast, skip-link) · `<head>` meta + Open Graph + favicon · font-loading perf · code-split routes.

## 11. Testing (TDD)

- **Unit (vitest):** new data modules + components (Atisha catalog rendering incl. empty state, Method page, dossier/ticker).
- **Integration:** router resolves every route; Atisha catalog renders from `index.json`; pillar links resolve.
- **E2E (Playwright):** cross-route nav, deep-link hard-refresh via 404.html, reduced-motion, no console errors.
- Tests before implementation. No mocks — consistent with the lab's own discipline.

## 12. Risks & out of scope

- **Creating `Dinnaga-Research/atisha`** is an outward action — done as a sequenced build task, public, scaffold-only at first (no fabricated entries).
- **Repo visibility** is David's call per repo; nothing links to a private repo.
- **DNS edit** and **org rename** are David-only.
- **Font licensing (pre-existing, accepted):** 8 fonts from `marathonthegame.com` ship publicly — recorded in the original spec's Risks, unchanged.
- **Out of scope:** Phase-2 backlog content; making private repos public (per-repo security pass); populating Atisha with validated entries beyond any launch seed David confirms.

---

**Next step after approval:** invoke **writing-plans** to produce the sequenced, TDD implementation plan.
