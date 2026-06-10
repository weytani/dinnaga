# Dinnaga.ai — Status & Outstanding

_Last updated 2026-06-09._

## Live now
- Multi-page two-pillar lab site is **live at http://dinnaga.ai** (PR #1 merged to `main`; deploys via `.github/workflows/deploy.yml` on every push to `main`).
- Spec: `docs/superpowers/specs/2026-06-08-dinnaga-living-research-log-design.md`
- Plan: `docs/superpowers/plans/2026-06-08-dinnaga-two-pillar-site.md`
- Routes: `/` · `/atisha` · `/method` · `/colophon` · 404 (GitHub-Pages SPA fallback via `public/404.html`).

## ⚠️ Outstanding: HTTPS not yet enabled
`https://dinnaga.ai` has no valid cert yet. Root cause was a `www` CNAME typo (`weytani.github.com`, must be `weytani.github.io`) that broke Let's Encrypt. **DNS is now fixed and verified** (authoritative NS returns `weytani.github.io`), and the custom domain was removed/re-added via both the API and the GitHub Settings→Pages UI — but GitHub's ACME authorization is stuck in `bad_authz` and hasn't re-issued. This stuck state can take **hours (up to ~a day)** to self-heal after a long-wrong record; it is not a config error.

### To finish HTTPS (once the cert clears)
1. Check state: `gh api repos/weytani/dinnaga/pages --jq '.https_certificate.state'`
2. When it reads `issued` or `approved`: `gh api -X PUT repos/weytani/dinnaga/pages -F https_enforced=true`
3. Verify: `curl -sI https://dinnaga.ai | head -1` (expect `HTTP/2 200`, no SSL error)

If it's still `bad_authz` after a day, re-do the **Settings → Pages** remove/re-add custom-domain toggle (watch for green "DNS check successful"), then wait.

## Notes
- The **Atisha Initiative** is a GitHub **Project** (`https://github.com/orgs/Dinnaga-Research/projects/1`), not a repo — it must stay **Public** or the site's Atisha link 404s.
- `public/og.png` uses the real `logo-mark.svg` mark (the hexagon-gate D). The favicon and nav `BrandMark` are the original logo — unchanged.
- Phase-2 backlog (not built; spec §8): GRAVEDIGGER / DSPy harnesses / memory-architecture as future Atisha entries, field notes, a `/notes` + `/instruments` expansion, route code-splitting.
- "Phylon" was scrubbed everywhere; the lab is presented anonymously as **Dinnaga**.
