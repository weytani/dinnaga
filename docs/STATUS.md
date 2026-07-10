# Dinnaga.ai — Status & Outstanding

_Last updated 2026-07-08._

## Live now
- Multi-page two-pillar lab site is **live at https://dinnaga.ai**, hosted on **Vercel** (`weytanis-projects/dinnaga`) since 2026-07-08. HTTPS is live via Let's Encrypt through Vercel. GitHub Pages hosting is retired; `.github/workflows/ci.yml` runs lint/unit-test/build as a deterministic PR gate — it does not deploy (Vercel deploys on push to `main`).
- Spec: `docs/superpowers/specs/2026-06-08-dinnaga-living-research-log-design.md`
- Plan: `docs/superpowers/plans/2026-06-08-dinnaga-two-pillar-site.md`
- Routes: `/` · `/atisha` · `/method` · `/colophon` · `/loadout` · 404.

## Cyberware Loadout (`/loadout`)
The ripperdoc bench is **merged to `main` and LIVE at [dinnaga.ai/loadout](https://dinnaga.ai/loadout)** (screenshots in `docs/screenshots/`, embedded in the repo README). It lets you equip megazord zords as cyberware implants, see a live friction/conflict/drift readout, and share a build via URL — a proposal surface only; nothing is wired live.
- Plan: `docs/superpowers/plans/2026-07-01-cyberware-loadout.md`
- **Data flow — manual snapshot, not live:** `~/code/megazord` stays the source of truth for zord manifests; the page renders a vendored snapshot at `src/data/zords.json` (snapshot regenerated 2026-07-08, registry now **22 zords** across 9 slots). Refreshing it is a documented **manual** step, not part of any automated build:
  ```bash
  cd ~/code/megazord && bin/megazord export-json --out ~/code/dinnaga/src/data/zords.json
  ```
  Nothing in dinnaga calls megazord at runtime.
- **Easter eggs:** a ripperdoc boot sequence (typed terminal lines, skippable), an `UNPOWERED` dormant readout when no cyberware is installed, and an over-capacity/max-drift "cyberpsychosis" panel (`I'm sorry, Dave. I'm afraid I can't wire that.`) when a build exceeds the context budget or drift ceiling. The boot's typing animation and the cyberpsychosis glitch effect both honor `prefers-reduced-motion` (the animation is skipped/disabled; the underlying content still renders).
- **Test counts:** unit 102/102 passing (vitest) · e2e 21/21 passing (playwright) · megazord `uv run pytest` green.

## Notes
- The **Atisha Initiative** is a GitHub **Project** (`https://github.com/orgs/Dinnaga-Research/projects/1`), not a repo — it must stay **Public** or the site's Atisha link 404s.
- `public/og.png` uses the real `logo-mark.svg` mark (the hexagon-gate D). The favicon and nav `BrandMark` are the original logo — unchanged.
- Phase-2 backlog (not built; spec §8): GRAVEDIGGER / DSPy harnesses / memory-architecture as future Atisha entries, field notes, a `/notes` + `/instruments` expansion, route code-splitting.
- "Phylon" was scrubbed everywhere; the lab is presented anonymously as **Dinnaga**.
