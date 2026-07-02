# Dinnaga.ai — Status & Outstanding

_Last updated 2026-07-02._

## Live now
- Multi-page two-pillar lab site is **live at http://dinnaga.ai** (PR #1 merged to `main`; deploys via `.github/workflows/deploy.yml` on every push to `main`).
- Spec: `docs/superpowers/specs/2026-06-08-dinnaga-living-research-log-design.md`
- Plan: `docs/superpowers/plans/2026-06-08-dinnaga-two-pillar-site.md`
- Routes: `/` · `/atisha` · `/method` · `/colophon` · `/loadout` · 404 (GitHub-Pages SPA fallback via `public/404.html`).

## ⚠️ Outstanding: HTTPS not yet enabled
`https://dinnaga.ai` has no valid cert yet. Root cause was a `www` CNAME typo (`weytani.github.com`, must be `weytani.github.io`) that broke Let's Encrypt. **DNS is now fixed and verified** (authoritative NS returns `weytani.github.io`), and the custom domain was removed/re-added via both the API and the GitHub Settings→Pages UI — but GitHub's ACME authorization is stuck in `bad_authz` and hasn't re-issued. This stuck state can take **hours (up to ~a day)** to self-heal after a long-wrong record; it is not a config error.

### To finish HTTPS (once the cert clears)
1. Check state: `gh api repos/weytani/dinnaga/pages --jq '.https_certificate.state'`
2. When it reads `issued` or `approved`: `gh api -X PUT repos/weytani/dinnaga/pages -F https_enforced=true`
3. Verify: `curl -sI https://dinnaga.ai | head -1` (expect `HTTP/2 200`, no SSL error)

If it's still `bad_authz` after a day, re-do the **Settings → Pages** remove/re-add custom-domain toggle (watch for green "DNS check successful"), then wait.

## Cyberware Loadout (`/loadout`)
The ripperdoc bench is **merged to `main` and LIVE at [dinnaga.ai/loadout](http://dinnaga.ai/loadout)** (deployed 2026-07-02; screenshots in `docs/screenshots/`, embedded in the repo README). It lets you equip megazord zords as cyberware implants, see a live friction/conflict/drift readout, and share a build via URL — a proposal surface only; nothing is wired live.
- Plan: `docs/superpowers/plans/2026-07-01-cyberware-loadout.md`
- **Data flow — manual snapshot, not live:** `~/code/megazord` stays the source of truth for zord manifests; the page renders a vendored snapshot at `src/data/zords.json`. Refreshing it is a documented **manual** step, not part of any automated build:
  ```bash
  cd ~/code/megazord && bin/megazord export-json --out ~/code/dinnaga/src/data/zords.json
  ```
  Nothing in dinnaga calls megazord at runtime.
- **Easter eggs:** a ripperdoc boot sequence (typed terminal lines, skippable), an `UNPOWERED` dormant readout when no cyberware is installed, and an over-capacity/max-drift "cyberpsychosis" panel (`I'm sorry, Dave. I'm afraid I can't wire that.`) when a build exceeds the context budget or drift ceiling. The boot's typing animation and the cyberpsychosis glitch effect both honor `prefers-reduced-motion` (the animation is skipped/disabled; the underlying content still renders).
- **Test counts:** unit 85/85 passing (vitest) · e2e 21/21 passing (playwright) · megazord `uv run pytest` 9/9 passing.

## Notes
- The **Atisha Initiative** is a GitHub **Project** (`https://github.com/orgs/Dinnaga-Research/projects/1`), not a repo — it must stay **Public** or the site's Atisha link 404s.
- `public/og.png` uses the real `logo-mark.svg` mark (the hexagon-gate D). The favicon and nav `BrandMark` are the original logo — unchanged.
- Phase-2 backlog (not built; spec §8): GRAVEDIGGER / DSPy harnesses / memory-architecture as future Atisha entries, field notes, a `/notes` + `/instruments` expansion, route code-splitting.
- "Phylon" was scrubbed everywhere; the lab is presented anonymously as **Dinnaga**.
