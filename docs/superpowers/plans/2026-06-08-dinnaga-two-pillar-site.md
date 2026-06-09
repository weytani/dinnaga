# Dinnaga.ai Two-Pillar Lab Site — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Secure `dinnaga.ai` (HTTPS), and turn the single-page design-kit port into a polished multi-page site for the anonymous Dinnaga lab, foregrounding two real pillars — *How We Work* (project-planning) and the open-source *Atisha Initiative*.

**Architecture:** Add React Router (clean URLs) + a `Layout` shell holding shared chrome (nav, footer, cookie banner, CRT overlay) around an `<Outlet/>`. Convert the existing long-scroll homepage into the `/` route and add `/atisha`, `/method`, `/colophon`, and a 404. Replace all fictional-consultancy copy with the lab's real two-pillar / open-source / anonymous identity. Scaffold a separate public `Dinnaga-Research/atisha` repo as the canonical catalog; the site renders a local typed copy of its catalog (empty at launch). Fix the GitHub Pages TLS cert (root cause: `www` CNAME typo).

**Tech Stack:** React 19, TypeScript, Vite 8, Bun, react-router-dom v7, Vitest + Testing Library, Playwright, GitHub Pages + Actions.

---

## Spec

Source spec: `docs/superpowers/specs/2026-06-08-dinnaga-living-research-log-design.md`.

## Shared contracts (define once; every task must match these names exactly)

**New routes & files**
```
src/App.tsx                         RouterProvider (rewritten from <Home/>)
src/components/Layout.tsx           Shared chrome + <Outlet/>
src/routes/Home/Home.tsx            (exists) → renders sections only, no chrome
src/routes/Atisha/Atisha.tsx        New
src/routes/Method/Method.tsx        New
src/routes/Colophon/Colophon.tsx    New
src/routes/NotFound/NotFound.tsx    New
src/data/atishaCatalog.ts           Typed local copy of the Atisha catalog (empty [] at launch)
src/data/navLinks.ts                (exists) → route nav model {label,to}
public/404.html                     SPA deep-link redirect shim
```

**New types (added to `src/types.ts`)**
```ts
export type AtishaCategory = 'skill' | 'tool' | 'method' | 'paper';
export interface AtishaEntry {
  slug: string;
  title: string;
  category: AtishaCategory;
  oneLiner: string;
  sourceUrl: string;
  validatedOn: string;   // ISO date
  whyUseful: string;
  howValidated: string;  // how the lab checked it (spec §4 entry field)
  attribution: string;   // "" for first-party; otherwise the third-party owner
}
export interface NavLink { label: string; to: string; }
export type PracticeIconName = 'ethos' | 'method' | 'atisha';
```
(`PracticeIconName` is **changed** from `'research'|'education'|'consulting'` to the three values above.)

**Naming rules**
- Public repo URL constants live in `src/data/links.ts`:
  `ATISHA_REPO_URL = 'https://github.com/Dinnaga-Research/atisha'` and
  `PROJECT_PLANNING_URL: string | null = null` (stays `null` — i.e. no link rendered — until David makes that repo public).
- Brand string is always `DINNAGA` / `Dinnaga`. The word **"Phylon"** must not appear in shipped site copy.

## Pre-flight notes for the executor

- Package manager is **Bun** (`bun add`, `bun run`). Never use npm/pnpm.
- Tests: `bun run test` (vitest, unit/integration) and `bun run test:e2e` (Playwright). Lint: `bun run lint`. Build: `bun run build` (runs `tsc --noEmit && vite build`).
- The deploy workflow runs only on push to **main**; all work happens on a branch, so nothing deploys until the final merge. Good — the half-built site never goes live.
- Two tasks require David's go before running: **Task 17** (`gh repo create` — outward action) and **Task 18** (security ops, gated on David's DNS edit). Stop and confirm at those.

---

## Phase 0 — Setup

### Task 1: Branch and commit the spec

**Files:**
- Commit: `docs/superpowers/specs/2026-06-08-dinnaga-living-research-log-design.md` (already written)
- Create: `docs/superpowers/plans/2026-06-08-dinnaga-two-pillar-site.md` (this file)

- [ ] **Step 1: Create the feature branch**

Run:
```bash
cd ~/code/dinnaga && git checkout -b dinnaga-two-pillar-site
```
Expected: `Switched to a new branch 'dinnaga-two-pillar-site'`

- [ ] **Step 2: Commit the spec and plan**

```bash
git add docs/superpowers/specs/2026-06-08-dinnaga-living-research-log-design.md docs/superpowers/plans/2026-06-08-dinnaga-two-pillar-site.md
git commit -m "docs: add two-pillar site spec and implementation plan"
```
Expected: pre-commit hooks (if any) pass; one commit created.

---

## Phase 1 — Routing & SPA shell

### Task 2: Add React Router and the Layout shell

**Files:**
- Modify: `package.json` (add dep)
- Create: `src/components/Layout.tsx`
- Modify: `src/App.tsx`
- Modify: `src/routes/Home/Home.tsx` (drop shared chrome)
- Modify: `src/routes/Home/Home.test.tsx` (rewrite — sections only, no chrome)
- Create: `src/components/Layout.test.tsx`

- [ ] **Step 1: Install react-router-dom**

Run:
```bash
bun add react-router-dom
```
Expected: `react-router-dom` added to `dependencies` (v7.x), `bun.lock` updated.

- [ ] **Step 2: Write the failing Layout test**

Create `src/components/Layout.test.tsx`:
```tsx
// ABOUTME: Tests for the shared Layout shell — chrome + routed outlet.
// ABOUTME: Verifies nav, footer, and the routed child all render.
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './Layout';

function renderAt(path: string) {
  const router = createMemoryRouter(
    [{ path: '/', element: <Layout />, children: [{ index: true, element: <p>HOME CONTENT</p> }] }],
    { initialEntries: [path] },
  );
  return render(<RouterProvider router={router} />);
}

describe('Layout', () => {
  it('renders the primary nav, the routed child, and the footer', () => {
    renderAt('/');
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument();
    expect(screen.getByText('HOME CONTENT')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `bun run test src/components/Layout.test.tsx`
Expected: FAIL — `Layout` not found.

- [ ] **Step 4: Create the Layout shell**

Create `src/components/Layout.tsx`:
```tsx
// ABOUTME: Shared site chrome around routed pages — nav, footer, cookie banner, CRT overlay.
// ABOUTME: Renders the matched route via <Outlet/>.
import { Outlet } from 'react-router-dom';
import { CookieBanner } from './CookieBanner';
import { SiteNav } from './SiteNav';
import { SiteFooter } from './SiteFooter';

export function Layout() {
  return (
    <div className="site" data-screen-label="Dinnaga">
      <CookieBanner />
      <SiteNav />
      <Outlet />
      <SiteFooter />
      <div className="crt-overlay" aria-hidden="true" />
    </div>
  );
}
```

- [ ] **Step 5: Rewrite App.tsx as the router**

Replace `src/App.tsx` with:
```tsx
// ABOUTME: Root application component — defines the route table and renders the router.
// ABOUTME: Shared chrome lives in Layout; each route renders only its own content.
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './routes/Home/Home';
import { Atisha } from './routes/Atisha/Atisha';
import { Method } from './routes/Method/Method';
import { Colophon } from './routes/Colophon/Colophon';
import { NotFound } from './routes/NotFound/NotFound';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'atisha', element: <Atisha /> },
      { path: 'method', element: <Method /> },
      { path: 'colophon', element: <Colophon /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
```
> NOTE: this imports routes created in Tasks 11–13. To keep the build green between tasks, create **stub** files now and flesh them out later:
> - `src/routes/Atisha/Atisha.tsx`, `src/routes/Method/Method.tsx`, `src/routes/Colophon/Colophon.tsx`, `src/routes/NotFound/NotFound.tsx`, each exporting `export function <Name>() { return <main className="section" />; }` with the matching ABOUTME header.

- [ ] **Step 6: Strip shared chrome from Home**

Replace `src/routes/Home/Home.tsx` with (sections only; chrome now in Layout):
```tsx
// ABOUTME: Home route (/) — composes the long-scroll dinnaga.ai homepage sections.
// ABOUTME: Shared chrome (nav, footer, cookie banner, CRT overlay) lives in Layout.
import { Hero } from '../../components/Hero';
import { Ticker } from '../../components/Ticker';
import { Practices } from '../../components/Practices';
import { DataPanel } from '../../components/DataPanel';
import { AsciiArt } from '../../components/AsciiArt';
import { CautionDivider } from '../../components/CautionDivider';
import { Transmission } from '../../components/Transmission';
import { TICKER_ITEMS } from '../../data/tickerItems';

export function Home() {
  return (
    <>
      <Hero />
      <Ticker items={TICKER_ITEMS} />
      <Practices />
      <DataPanel />
      <AsciiArt />
      <CautionDivider />
      <Transmission />
    </>
  );
}
```
> NOTE: `FieldNotes` is intentionally dropped from Home (Phase-2 backlog). `SiteNav` no longer takes an `onNav` prop (Task 4 makes it route-based).

- [ ] **Step 7: Rewrite Home.test.tsx for the new (chrome-less) Home**

`src/routes/Home/Home.test.tsx` asserts old copy and the `.crt-overlay` (now in Layout). Replace it with a router-wrapped smoke test that survives the Phase-2 copy changes:
```tsx
// ABOUTME: Integration test for the Home route — verifies the homepage sections render.
// ABOUTME: Copy-specific assertions live in the component tests and the homepage e2e.
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Home } from './Home';

describe('Home', () => {
  it('renders the homepage sections', () => {
    const { container } = render(<MemoryRouter><Home /></MemoryRouter>);
    expect(container.querySelectorAll('.section').length).toBeGreaterThan(0);
  });
});
```
(The `.crt-overlay` assertion is dropped here — it is covered by `Layout.test.tsx`. `SiteNav.test.tsx` stays green because `SiteNav.tsx` itself is untouched until Task 4.)

- [ ] **Step 8: Run the full unit suite**

Run: `bun run test`
Expected: GREEN. Layout + Home smoke tests pass; SiteNav/data tests still pass (their subjects are unchanged until Tasks 4/7). If `tsc` errors on missing route stubs, create the stubs from Step 5's NOTE.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add react-router, Layout shell, and route stubs"
```

### Task 3: Clean-URL SPA deep-link support (404.html)

**Files:**
- Create: `public/404.html`
- Modify: `index.html` (restore-path snippet)
- Create/Modify: `tests/e2e/routing.spec.ts`

- [ ] **Step 1: Write the failing e2e for a deep link**

Create `tests/e2e/routing.spec.ts`:
```ts
import { expect, test } from '@playwright/test';

const ROUTES = [
  { path: '/atisha', heading: /Atisha Initiative/i },
  { path: '/method', heading: /From read to ship/i },
  { path: '/colophon', heading: /Colophon/i },
];

for (const r of ROUTES) {
  test(`deep link ${r.path} resolves on hard load (SPA fallback)`, async ({ page }) => {
    await page.goto(r.path);
    await expect(page).toHaveURL(new RegExp(r.path.replace('/', '\\/') + '$'));
    await expect(page.getByRole('heading', { name: r.heading }).first()).toBeVisible();
  });
}

test('an unknown deep link renders the 404 page', async ({ page }) => {
  await page.goto('/no-such-page');
  await expect(page.getByRole('heading', { name: /No transmission here/i })).toBeVisible();
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `bun run test:e2e tests/e2e/routing.spec.ts`
Expected: FAIL (pages + SPA fallback not built yet). These stay red until the pages land in Tasks 11–13; the full e2e suite is run end-to-end in Task 18. Note it and continue.

- [ ] **Step 3: Add the 404.html redirect shim**

Create `public/404.html` (apex custom domain → keep 0 path segments):
```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Dinnaga</title>
    <script>
      // SPA fallback for GitHub Pages: encode the path into a query string
      // and redirect to the root, where index.html restores it. pathSegmentsToKeep=0
      // because the site is served from the apex domain root.
      var pathSegmentsToKeep = 0;
      var l = window.location;
      l.replace(
        l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
        l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
        l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
        (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
        l.hash
      );
    </script>
  </head>
  <body></body>
</html>
```

- [ ] **Step 4: Add the restore snippet to index.html**

Modify `index.html` — add this `<script>` inside `<head>` (before the module script reference is fine; it must run before the app):
```html
<script>
  // Restores the path encoded by 404.html (SPA fallback for GitHub Pages).
  (function () {
    var l = window.location;
    if (l.search[1] === '/') {
      var decoded = l.search.slice(1).split('&').map(function (s) {
        return s.replace(/~and~/g, '&');
      }).join('?');
      window.history.replaceState(null, null, l.pathname.slice(0, -1) + decoded + l.hash);
    }
  })();
</script>
```

- [ ] **Step 5: Commit**

```bash
git add public/404.html index.html tests/e2e/routing.spec.ts
git commit -m "feat: SPA deep-link fallback for clean URLs on GitHub Pages"
```

### Task 4: Route-aware SiteNav

**Files:**
- Modify: `src/data/navLinks.ts`
- Modify: `src/components/SiteNav.tsx`
- Modify: `src/components/SiteNav.test.tsx`
- Modify: `src/data/data.test.ts` (NAV_LINKS assertion)

- [ ] **Step 1: Add the NavLink type, then update the nav model + failing test**

First add the `NavLink` type to `src/types.ts` (additive — build stays green):
```ts
export interface NavLink {
  label: string;
  to: string;
}
```

Replace `src/data/navLinks.ts`:
```ts
// ABOUTME: Primary navigation model — label + route target for each top-level link.
// ABOUTME: Order is the on-screen order.
import type { NavLink } from '../types';

export const NAV_LINKS: NavLink[] = [
  { label: 'Atisha', to: '/atisha' },
  { label: 'How We Work', to: '/method' },
  { label: 'Colophon', to: '/colophon' },
];
```

Update the NAV_LINKS assertion in `src/data/data.test.ts` (it currently deep-equals the old string array — once `NAV_LINKS` becomes `NavLink[]` this is both a runtime AND a `tsc --noEmit` failure). Change that line to:
```ts
expect(NAV_LINKS.map((l) => l.to)).toEqual(['/atisha', '/method', '/colophon']);
```

Replace `src/components/SiteNav.test.tsx` with:
```tsx
// ABOUTME: Tests for the route-aware primary navigation.
// ABOUTME: Verifies brand home link and the three route links render with correct hrefs.
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { SiteNav } from './SiteNav';

describe('SiteNav', () => {
  it('renders the brand link and route links', () => {
    render(<MemoryRouter><SiteNav /></MemoryRouter>);
    expect(screen.getByRole('link', { name: /DINNAGA/ })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'ATISHA' })).toHaveAttribute('href', '/atisha');
    expect(screen.getByRole('link', { name: 'HOW WE WORK' })).toHaveAttribute('href', '/method');
    expect(screen.getByRole('link', { name: 'COLOPHON' })).toHaveAttribute('href', '/colophon');
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `bun run test src/components/SiteNav.test.tsx`
Expected: FAIL — SiteNav still uses string `NAV_LINKS` + `onNav`.

- [ ] **Step 3: Rewrite SiteNav with route links**

Replace `src/components/SiteNav.tsx`:
```tsx
// ABOUTME: Sticky primary navigation — brand mark + route links + live-status corner.
// ABOUTME: Signature motion: a green square races L→R behind the clip-reveal on mount.
import { Fragment, useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { BrandMark } from './BrandMark';
import { NAV_LINKS } from '../data/navLinks';

export function SiteNav() {
  const [showSquare, setShowSquare] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowSquare(false), 1300);
    return () => clearTimeout(t);
  }, []);

  return (
    <Fragment>
      {showSquare && <div className="green-square" aria-hidden="true" />}
      <nav className="nav" aria-label="Primary">
        <Link className="nav-brand" to="/">
          <BrandMark size={26} />
          <span className="word">DINNAGA</span>
        </Link>
        <div className="nav-links">
          {NAV_LINKS.map((l) => (
            <NavLink key={l.to} to={l.to}>
              {l.label.toUpperCase()}
            </NavLink>
          ))}
        </div>
        <div className="nav-right">
          <span className="dot dot-live" />
          <span>LIVE</span>
        </div>
      </nav>
    </Fragment>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `bun run test src/components/SiteNav.test.tsx`
Expected: PASS.

- [ ] **Step 5: Remove the stale smooth-scroll e2e**

In `tests/e2e/homepage.spec.ts`, delete the `'nav links smooth-scroll to their target section'` test (anchor scrolling is replaced by routing; a routing nav test is added in Task 19's e2e). Leave the other homepage tests for now (they'll be updated as copy changes in Phase 2).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: route-aware primary navigation"
```

---

## Phase 2 — Identity scrub (copy → Dinnaga two-pillar / open-source / anonymous)

### Task 5: Update shared types

**Files:**
- Modify: `src/types.ts`

- [ ] **Step 1: Add the Atisha catalog types (additive — build stays green)**

Append to `src/types.ts`:
```ts
export type AtishaCategory = 'skill' | 'tool' | 'method' | 'paper';

export interface AtishaEntry {
  slug: string;
  title: string;
  category: AtishaCategory;
  oneLiner: string;
  sourceUrl: string;
  validatedOn: string;
  whyUseful: string;
  howValidated: string;
  attribution: string;
}
```
(`NavLink` was added in Task 4. `PracticeIconName` is changed later in Task 7, atomically with its consumers. `Category` and `FieldNote` stay for the Phase-2 FieldNotes component.)

- [ ] **Step 2: Create the links module**

Create `src/data/links.ts`:
```ts
// ABOUTME: Canonical outbound repo links for the Dinnaga lab.
// ABOUTME: project-planning stays null (unlinked) until it is made public.
export const ATISHA_REPO_URL = 'https://github.com/Dinnaga-Research/atisha';
export const PROJECT_PLANNING_URL: string | null = null;
```

- [ ] **Step 3: Typecheck and commit**

Run: `bun run build`
Expected: PASS — these additions are purely additive, so the build stays green.

```bash
git add src/types.ts src/data/links.ts
git commit -m "feat: add Atisha catalog types and outbound link constants"
```

### Task 6: Hero copy → Dinnaga ethos

**Files:**
- Modify: `src/components/Hero.tsx`
- Modify: `src/components/Hero.test.tsx`
- Modify: `src/data/bootLines.ts` (if it carries consultancy copy)

- [ ] **Step 1: Update the failing Hero test**

In `src/components/Hero.test.tsx`, change the assertions to the new copy:
```tsx
it('renders the headline and both CTAs', () => {
  render(<Hero />);
  expect(screen.getByText('Validated, then shared.')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'See the Atisha Initiative' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'How we work' })).toBeInTheDocument();
});
```
(Keep the Terminal tests; only the Hero headline/CTA assertions change. The Terminal input aria-label `'Ask Dinnaga a question'` stays.)

- [ ] **Step 2: Run it to verify it fails**

Run: `bun run test src/components/Hero.test.tsx`
Expected: FAIL on the new headline text.

- [ ] **Step 3: Update Hero copy**

In `src/components/Hero.tsx`: change the headline to `Validated, then shared.`, the two CTA button labels to `See the Atisha Initiative` and `How we work`, and any subhead/eyebrow prose to the lab voice, e.g. subhead: *"An anonymous research lab at the consumer-AI frontier. We try things, validate what's genuinely useful, and publish it openly — to make adoption faster for everyone."* Wire the CTAs to navigate: import `useNavigate` from `react-router-dom` and `onClick={() => navigate('/atisha')}` / `navigate('/method')`. Remove any reference to "paper" / "conversation" / consultancy framing.

- [ ] **Step 4: Scrub bootLines (mandatory — it carries fictional-consultancy copy)**

`src/data/bootLines.ts` currently includes `CHANNEL : RESEARCH / EDUCATION / CONSULTING`, `ASK US ANYTHING ABOUT AI ADOPTION`, and `WE REPLY TO ALMOST EVERYTHING` — all fictional framing. Replace the array (keep the `BootLine` `{text, delay}` shape):
```ts
export const BOOT_LINES: BootLine[] = [
  { text: 'DINNAGA-OS  v0.4.1   //   TERMINAL', delay: 60 },
  { text: 'ESTABLISHING UPLINK  ........  OK', delay: 70 },
  { text: 'LOADING ATISHA INDEX ........  OK', delay: 70 },
  { text: 'OPERATOR  : VISITOR', delay: 60 },
  { text: 'ETHOS     : OPEN SOURCE', delay: 60 },
  { text: 'VALIDATION BAR : ENGAGED', delay: 60 },
  { text: '', delay: 30 },
  { text: '▸  WE VALIDATE THINGS, THEN SHARE WHAT IS GENUINELY USEFUL.', delay: 60 },
  { text: '', delay: 30 },
];
```

- [ ] **Step 5: Run tests to verify pass**

Run: `bun run test src/components/Hero.test.tsx`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: rewrite Hero copy to the Dinnaga lab identity"
```

### Task 7: Practices → two pillars + ethos

**Files:**
- Modify: `src/data/practices.ts`
- Modify: `src/components/Practices.tsx`
- Modify: `src/components/Practices.test.tsx`
- Modify: `src/data/data.test.ts` (PRACTICES icon assertion)

- [ ] **Step 1: Update the failing test**

Replace assertions in `src/components/Practices.test.tsx` to expect the new section + cards:
```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Practices } from './Practices';

describe('Practices', () => {
  it('renders the two pillars and the ethos card', () => {
    render(<Practices />);
    expect(screen.getByText('How the lab works.')).toBeInTheDocument();
    expect(screen.getByText('Open by ethos')).toBeInTheDocument();
    expect(screen.getByText('Project Planning')).toBeInTheDocument();
    expect(screen.getByText('The Atisha Initiative')).toBeInTheDocument();
  });
});
```

Also update `src/data/data.test.ts` — its practices-icon assertion (`['research','education','consulting']`) must become the new icon names (PRACTICES stays length 3, so the length assertion is unchanged):
```ts
expect(PRACTICES.map((p) => p.icon)).toEqual(['ethos', 'method', 'atisha']);
```

- [ ] **Step 2: Run it to verify it fails**

Run: `bun run test src/components/Practices.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Replace the practices data**

Replace `src/data/practices.ts`:
```ts
// ABOUTME: The lab's stance + two pillars — rendered by Practices.tsx.
// ABOUTME: Open-source ethos, the project-planning funnel, and the Atisha Initiative.
import type { Practice } from '../types';

export const PRACTICES: Practice[] = [
  {
    num: '01',
    title: 'Open by ethos',
    icon: 'ethos',
    summary: 'We validate things and share what is genuinely useful, openly.',
    body: 'We validate things and share what is genuinely useful, openly — to make AI adoption faster for everyone. The lab is anonymous; the work is real and checkable.',
    meta: '▸ open source',
  },
  {
    num: '02',
    title: 'Project Planning',
    icon: 'method',
    summary: 'How the work happens: Read → Digest → Ideate → Experiment → Ship.',
    body: 'How the work happens. We read papers and releases, digest what matters, ideate, build experiments, and ship the ones that survive. The funnel that feeds everything else.',
    meta: '▸ read → ship',
  },
  {
    num: '03',
    title: 'The Atisha Initiative',
    icon: 'atisha',
    summary: 'The open-source reference of what we validated as worth sharing.',
    body: 'What comes out the other end: a public, open-source reference of the tools, skills, and methods we have validated as genuinely useful — so you do not have to take it on faith.',
    meta: '▸ validated, then shared',
  },
];
```

- [ ] **Step 4: Change PracticeIconName, then update Practices.tsx**

In `src/types.ts`, change the union (atomic with its consumers below):
`export type PracticeIconName = 'research' | 'education' | 'consulting';` → `export type PracticeIconName = 'ethos' | 'method' | 'atisha';`

In `src/components/Practices.tsx`:
- Change the three `if (name === ...)` branches in `PracticeIcon` to `'ethos'`, `'method'`, `'atisha'` (reuse the existing three SVG glyphs; just rename the conditions — `'ethos'` → the circle/target glyph, `'method'` → the document glyph, `'atisha'` → the people glyph; order doesn't matter visually).
- Change the section eyebrow `// 02 · WHAT WE DO` → `// 01 · THE LAB` and the title `Three quiet practices.` → `How the lab works.`
- Change the section `id="research"` → `id="lab"`.

- [ ] **Step 5: Run tests to verify pass**

Run: `bun run test src/components/Practices.test.tsx`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: reframe Practices into the lab's two pillars + ethos"
```

### Task 8: DataPanel dossier → true lab facts

**Files:**
- Modify: `src/data/surfaceData.ts`
- Modify: `src/components/DataPanel.tsx`
- Create: `src/components/DataPanel.test.tsx` (if absent) / Modify if present

- [ ] **Step 1: Write/update the failing test**

Create or update `src/components/DataPanel.test.tsx`:
```tsx
// ABOUTME: Tests the dossier panel renders true lab facts and the "who we are" prose.
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DataPanel } from './DataPanel';

describe('DataPanel', () => {
  it('renders true lab dossier rows and identity prose', () => {
    render(<DataPanel />);
    expect(screen.getByText('Ethos')).toBeInTheDocument();
    expect(screen.getByText(/open source/i)).toBeInTheDocument();
    expect(screen.getByText('Identity')).toBeInTheDocument();
    expect(screen.getByText(/anonymous by design/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `bun run test src/components/DataPanel.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Replace surfaceData**

Replace `src/data/surfaceData.ts`:
```ts
// ABOUTME: Dossier rows — true facts about the Dinnaga lab.
// ABOUTME: DataPanel.tsx renders this as the left-hand tabular panel.
import type { DataRow } from '../types';

export const SURFACE_DATA: DataRow[] = [
  { idx: '01', label: 'Identity', value: 'Anonymous by design' },
  { idx: '02', label: 'Ethos', value: 'Open source — validate, then share' },
  { idx: '03', label: 'Mission', value: 'Accelerate AI adoption with what is genuinely useful' },
  { idx: '04', label: 'Method', value: 'Read → Digest → Ideate → Experiment → Ship' },
  { idx: '05', label: 'Validation bar', value: 'Veracity-first · real APIs · no mocks' },
  { idx: '06', label: 'Initiatives live', value: '2 — Project Planning · Atisha' },
];
```

- [ ] **Step 4: Rewrite the DataPanel prose**

In `src/components/DataPanel.tsx`:
- Change the footer line `Last sync 2026-04-16 // Dinnaga Research` → `// DINNAGA` (drop the fake date) and keep the `PUBLIC` chip.
- Replace both `panel-body` paragraphs under "WHO WE ARE" with true copy, e.g.:
  - *"Dinnaga is an anonymous research lab working at the consumer-AI frontier. We are open by default: we validate things ourselves, then publish what is genuinely useful so adoption gets faster for everyone."*
  - *"Named for Dignāga — a philosopher of perception and valid cognition (pramāṇa) who held that knowledge belongs to whoever takes the trouble to examine it. That is the bar for anything we put our name on."*
- Replace the `panel-list` bullets with true ones: `▸ Validated before it ships.` · `▸ Open source by default.` · `▸ Third-party tools we rely on are credited, never claimed.` · `▸ No marketing — only what works.`
- Remove the words "consult", "teach", "CC-BY", "Workshop", "roadmap decided in public" unless still true (drop them).

- [ ] **Step 5: Run tests to verify pass**

Run: `bun run test src/components/DataPanel.test.tsx`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: replace dossier with true lab facts and identity prose"
```

### Task 9: Ticker, Transmission, AsciiArt copy

**Files:**
- Modify: `src/data/tickerItems.ts`
- Modify: `src/components/Transmission.tsx` (form → static dispatch)
- Modify: `src/components/Transmission.test.tsx` (drop the email-form assertions)
- Modify: `src/components/AsciiArt.tsx` (scrub the ASCII body)

- [ ] **Step 1: Replace ticker items**

Replace `src/data/tickerItems.ts`:
```ts
// ABOUTME: Marquee ticker items — real lab status lines.
// ABOUTME: Home.tsx passes these to the Ticker component.
export const TICKER_ITEMS: string[] = [
  '▸ OPEN-SOURCE BY ETHOS',
  '▸ VALIDATE, THEN SHARE',
  '▸ ATISHA INITIATIVE — ONLINE',
  '▸ THE BAR — GENUINELY USEFUL OR IT DOES NOT SHIP',
  '▸ NO MOCKS — REAL VALIDATION',
  '▸ ACCELERATING AI ADOPTION',
];
```

- [ ] **Step 2: Convert Transmission to a static dispatch (it is currently a fake-signup email form)**

`src/components/Transmission.tsx` is a no-backend email signup form ("Stay on the wire.", "One transmission a month", Email input, Subscribe → "TRANSMISSION ACCEPTED"). A submit that "accepts" an email with no backend is exactly the dishonest UI the lab's veracity bar forbids, and the copy is fictional. Replace it with a static dispatch:
```tsx
// ABOUTME: Transmission dispatch — a static announcement block with a direct contact.
// ABOUTME: No fake signup; the lab does not run a mailing list.
export function Transmission() {
  return (
    <section className="transmission" id="dispatch" data-screen-label="Transmission">
      <div className="tx-inner">
        <span className="section-eye">// TRANSMISSION</span>
        <h2 className="tx-title">The Atisha Initiative is open.</h2>
        <p style={{ color: 'var(--fg-3)', margin: 0, fontFamily: 'var(--font-body)', fontSize: 16 }}>
          A public, open-source reference of what we have validated as genuinely useful. No mailing
          list, no funnel — the catalog lives in the open and grows as we validate.
        </p>
      </div>
    </section>
  );
}
```
Then replace `src/components/Transmission.test.tsx` (drop the Email/Subscribe/ACCEPTED assertions):
```tsx
// ABOUTME: Tests the Transmission dispatch renders its heading and mission copy.
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Transmission } from './Transmission';

describe('Transmission', () => {
  it('renders the dispatch heading and mission copy', () => {
    render(<Transmission />);
    expect(screen.getByText('The Atisha Initiative is open.')).toBeInTheDocument();
    expect(screen.getByText(/open-source reference/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2b: Scrub the ASCII_ART body**

`src/components/AsciiArt.tsx` embeds fictional copy inside the `ASCII_ART` String.raw block (`DOSSIER : APRIL 2026`, `ADOPTION: 87% / 14 PAPERS`, the `research / education / consulting` triad, `EMPOWER · ANYONE WHO BRINGS A QUESTION`). Keep the box art + column widths (so the box stays aligned), but replace those interior text lines with true ones:
- header line → `D  I  N  N  A  G  A   //  OPEN`
- the five `▸` stat lines → `ETHOS  : OPEN SOURCE`, `METHOD : READ → SHIP`, `BAR    : VALIDATED`, `MOCKS  : NONE`, `STATUS : LIVE · OPEN`
- the inner triad box → `project planning / open`, `atisha           / open`, `source           / open`
- the bottom tagline → `VALIDATE · THEN SHARE`

Leave the `.ascii-caption` (`EXTRUDED IN EIGHT TINTS…`) — it is decorative, not fictional.

- [ ] **Step 3: Run tests + commit**

Run: `bun run test`
Expected: PASS (fix any assertion that referenced old copy).
```bash
git add -A
git commit -m "feat: scrub ticker/transmission/ascii copy to lab voice"
```

### Task 10: Footer + document head

**Files:**
- Modify: `src/components/SiteFooter.tsx` + `src/components/SiteFooter.test.tsx`
- Modify: `index.html`

- [ ] **Step 1: Update footer test + copy**

Read `src/components/SiteFooter.tsx`. Keep `© 2026 DINNAGA RESEARCH` only if you want the "Research" suffix; otherwise change to `© 2026 DINNAGA`. Replace any footer nav anchors with route `<Link>`s (`/atisha`, `/method`, `/colophon`) — import `Link` from `react-router-dom`, and wrap the footer render in tests with `MemoryRouter`. Update `SiteFooter.test.tsx` assertions accordingly. Drop fictional footer links (newsletter, etc.) that are not real.

- [ ] **Step 2: Update index.html head**

In `index.html`, set:
```html
<title>Dinnaga — validate, then share</title>
<meta name="description" content="An anonymous AI research lab. We validate what is genuinely useful and publish it openly to accelerate AI adoption." />
<meta property="og:title" content="Dinnaga — validate, then share" />
<meta property="og:description" content="An anonymous AI research lab. We validate what is genuinely useful and publish it openly." />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://dinnaga.ai/" />
<meta name="theme-color" content="#0a0a0a" />
```
(Keep the favicon line. og:image is finalized in Task 16.)

- [ ] **Step 3: Update the homepage e2e for the new copy + structure**

`tests/e2e/homepage.spec.ts` still asserts the old fictional copy and the removed FieldNotes section. Replace its contents to match the shipped Home:
```ts
import { expect, test } from '@playwright/test';

test('renders the homepage hero and lab sections', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Validated, then shared.' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'How the lab works.' })).toBeVisible();
  await expect(page.getByText(/© 2026 DINNAGA/)).toBeVisible();
});

test('dismisses the cookie banner', async ({ page }) => {
  await page.goto('/');
  const banner = page.locator('.cookie');
  await expect(banner).not.toHaveClass(/is-dismissed/);
  await page.getByRole('button', { name: 'Accept' }).click();
  await expect(banner).toHaveClass(/is-dismissed/);
});

test('removes the travelling green square after the mount animation', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.green-square')).toHaveCount(0, { timeout: 3000 });
});

test('nav links route between pages', async ({ page }) => {
  await page.goto('/');
  await page.locator('.nav-links').getByRole('link', { name: 'ATISHA' }).click();
  await expect(page).toHaveURL(/\/atisha$/);
  await expect(page.getByRole('heading', { name: /Atisha Initiative/i })).toBeVisible();
});
```
(Drops the old FieldNotes-chip and smooth-scroll tests — those sections/behaviours no longer exist on Home. The `nav links route` test fully passes once the Atisha page lands in Task 13; e2e is run end-to-end in Task 18, not per-task.)

- [ ] **Step 4: Run tests + commit**

Run: `bun run test`
Expected: PASS.
```bash
git add -A
git commit -m "feat: footer route links + document metadata"
```

---

## Phase 3 — New pages

### Task 11: Colophon + NotFound pages

**Files:**
- Modify: `src/routes/Colophon/Colophon.tsx` (flesh out the stub)
- Create: `src/routes/Colophon/Colophon.test.tsx`
- Modify: `src/routes/NotFound/NotFound.tsx` (flesh out the stub)
- Create: `src/routes/NotFound/NotFound.test.tsx`

- [ ] **Step 1: Failing test**

Create `src/routes/Colophon/Colophon.test.tsx`:
```tsx
// ABOUTME: Tests the Colophon page renders the about-the-lab content.
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Colophon } from './Colophon';

describe('Colophon', () => {
  it('renders the colophon heading and the anonymity note', () => {
    render(<Colophon />);
    expect(screen.getByRole('heading', { name: /Colophon/i })).toBeInTheDocument();
    expect(screen.getByText(/anonymous by design/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run it → fail**

Run: `bun run test src/routes/Colophon/Colophon.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement Colophon**

Replace `src/routes/Colophon/Colophon.tsx`:
```tsx
// ABOUTME: Colophon route (/colophon) — about the lab: persona rules and how the site is built.
// ABOUTME: No personal name; states the lab's anonymity and how the site is made.
export function Colophon() {
  return (
    <main className="section" id="colophon" data-screen-label="Colophon">
      <header className="section-head">
        <span className="section-eye">// COLOPHON</span>
        <h1 className="section-title">Colophon.</h1>
      </header>
      <div className="panel-body-wrap">
        <p className="panel-body">
          Dinnaga is an anonymous research lab. We do not put names to the work — the work is
          meant to stand on whether it is true and useful, not on who made it. Anonymous by design.
        </p>
        <p className="panel-body">
          Built as a static site (React + Vite), deployed on GitHub Pages, typeset in the Dinnaga
          design system. Source for what we publish lives openly under the Dinnaga org.
        </p>
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Run Colophon test → pass**

Run: `bun run test src/routes/Colophon/Colophon.test.tsx`
Expected: PASS.

- [ ] **Step 5: Implement NotFound (failing test first)**

Create `src/routes/NotFound/NotFound.test.tsx`:
```tsx
// ABOUTME: Tests the 404 page renders a not-found message and a home link.
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { NotFound } from './NotFound';

describe('NotFound', () => {
  it('renders a 404 message and a link home', () => {
    render(<MemoryRouter><NotFound /></MemoryRouter>);
    expect(screen.getByText(/404/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to base/i })).toHaveAttribute('href', '/');
  });
});
```
Run it → FAIL. Then replace `src/routes/NotFound/NotFound.tsx`:
```tsx
// ABOUTME: 404 route (path '*') — signal-lost message with a route home.
import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <main className="section" id="notfound" data-screen-label="404">
      <header className="section-head">
        <span className="section-eye">// 404 · SIGNAL LOST</span>
        <h1 className="section-title">No transmission here.</h1>
      </header>
      <p className="panel-body">
        That path does not resolve. <Link to="/">Back to base →</Link>
      </p>
    </main>
  );
}
```
Run it → PASS.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add Colophon and NotFound pages"
```

### Task 12: How We Work (Method) page

**Files:**
- Modify: `src/routes/Method/Method.tsx`
- Create: `src/data/method.ts`
- Create: `src/routes/Method/Method.test.tsx`

- [ ] **Step 1: Failing test**

Create `src/routes/Method/Method.test.tsx`:
```tsx
// ABOUTME: Tests the How We Work page renders the five-stage loop.
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Method } from './Method';

describe('Method', () => {
  it('renders all five stages of the loop', () => {
    render(<Method />);
    ['Read', 'Digest', 'Ideate', 'Experiment', 'Ship'].forEach((s) => {
      expect(screen.getByText(s)).toBeInTheDocument();
    });
  });
});
```

- [ ] **Step 2: Run it → fail**

Run: `bun run test src/routes/Method/Method.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Add method data**

Create `src/data/method.ts`:
```ts
// ABOUTME: The five-stage project-planning loop shown on the How We Work page.
export interface MethodStage { num: string; name: string; detail: string; }

export const METHOD_STAGES: MethodStage[] = [
  { num: '01', name: 'Read', detail: 'Find interesting papers, posts, and releases. Queue them.' },
  { num: '02', name: 'Digest', detail: 'Read them. Write up what actually matters.' },
  { num: '03', name: 'Ideate', detail: 'Promising ideas get a note worth coming back to.' },
  { num: '04', name: 'Experiment', detail: 'Build it, try it, see what happens. Most die here.' },
  { num: '05', name: 'Ship', detail: 'What survives becomes a skill, tool, or workflow — and a candidate for Atisha.' },
];
```

- [ ] **Step 4: Implement Method page**

Replace `src/routes/Method/Method.tsx`:
```tsx
// ABOUTME: How We Work route (/method) — the project-planning loop, Read → Ship.
// ABOUTME: Links to the project-planning repo only when it is public.
import { METHOD_STAGES } from '../../data/method';
import { PROJECT_PLANNING_URL } from '../../data/links';

export function Method() {
  return (
    <main className="section" id="method" data-screen-label="How We Work">
      <header className="section-head">
        <span className="section-eye">// HOW WE WORK</span>
        <h1 className="section-title">From read to ship.</h1>
      </header>
      <p className="panel-body">
        Project Planning is the funnel. Ideas come in one end; what survives validation comes out the
        other as something we would actually stand behind.
      </p>
      <ol className="method-loop">
        {METHOD_STAGES.map((s) => (
          <li className="method-stage" key={s.num}>
            <span className="method-num">// {s.num}</span>
            <h3 className="method-name">{s.name}</h3>
            <p className="method-detail">{s.detail}</p>
          </li>
        ))}
      </ol>
      {PROJECT_PLANNING_URL && (
        <p className="panel-body">
          <a href={PROJECT_PLANNING_URL}>See the project-planning repository →</a>
        </p>
      )}
    </main>
  );
}
```

- [ ] **Step 5: Add minimal styles**

Append to `src/styles/components.css` styles for `.method-loop`, `.method-stage`, `.method-num`, `.method-name`, `.method-detail` consistent with the existing card/section visual language (mono numerals, hairline borders). Keep it simple; reuse existing custom properties/colors.

- [ ] **Step 6: Run it → pass; commit**

Run: `bun run test src/routes/Method/Method.test.tsx`
Expected: PASS.
```bash
git add -A
git commit -m "feat: add How We Work (method) page"
```

### Task 13: Atisha Initiative page + catalog

**Files:**
- Create: `src/data/atishaCatalog.ts`
- Modify: `src/routes/Atisha/Atisha.tsx`
- Create: `src/routes/Atisha/Atisha.test.tsx`

- [ ] **Step 1: Failing tests (mission + empty-state + entry rendering)**

Create `src/routes/Atisha/Atisha.test.tsx`:
```tsx
// ABOUTME: Tests the Atisha Initiative page — mission, validation bar, catalog states.
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Atisha } from './Atisha';

describe('Atisha', () => {
  it('renders the mission heading and the repo link', () => {
    render(<MemoryRouter><Atisha /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: /Atisha Initiative/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /open-source reference/i }))
      .toHaveAttribute('href', 'https://github.com/Dinnaga-Research/atisha');
  });

  it('shows the empty-state when the catalog has no entries', () => {
    render(<MemoryRouter><Atisha /></MemoryRouter>);
    // ATISHA_CATALOG ships empty at launch.
    expect(screen.getByText(/first validated entries are on the way/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run them → fail**

Run: `bun run test src/routes/Atisha/Atisha.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Create the (empty) catalog data**

Create `src/data/atishaCatalog.ts`:
```ts
// ABOUTME: Local typed copy of the Atisha catalog (canonical source: Dinnaga-Research/atisha).
// ABOUTME: Empty at launch — entries are added only after the lab validates them.
import type { AtishaEntry } from '../types';

export const ATISHA_CATALOG: AtishaEntry[] = [];
```

- [ ] **Step 4: Implement the Atisha page**

Replace `src/routes/Atisha/Atisha.tsx`:
```tsx
// ABOUTME: Atisha Initiative route (/atisha) — the open-source validated-reference front door.
// ABOUTME: Renders mission, the validation bar, and the catalog (or an honest empty-state).
import { ATISHA_CATALOG } from '../../data/atishaCatalog';
import { ATISHA_REPO_URL } from '../../data/links';

export function Atisha() {
  const entries = ATISHA_CATALOG;
  return (
    <main className="section" id="atisha" data-screen-label="Atisha Initiative">
      <header className="section-head">
        <span className="section-eye">// VALIDATED, THEN SHARED</span>
        <h1 className="section-title">The Atisha Initiative.</h1>
      </header>
      <p className="panel-body">
        Atisha is an{' '}
        <a href={ATISHA_REPO_URL}>open-source reference</a> of the tools, skills, and methods the lab
        has validated as genuinely useful — published openly to make AI adoption faster for everyone.
      </p>
      <p className="panel-body">
        The bar: we have to have used it and checked it ourselves. Veracity-first, real APIs, no
        mocks. Third-party tools we rely on are credited, never claimed.
      </p>

      {entries.length === 0 ? (
        <p className="atisha-empty">
          ▸ The first validated entries are on the way. The catalog lives in the open at{' '}
          <a href={ATISHA_REPO_URL}>Dinnaga-Research/atisha</a>.
        </p>
      ) : (
        <ul className="atisha-catalog">
          {entries.map((e) => (
            <li className="atisha-entry" key={e.slug}>
              <span className="atisha-cat">{e.category.toUpperCase()}</span>
              <h3 className="atisha-title">{e.title}</h3>
              <p className="atisha-oneliner">{e.oneLiner}</p>
              <p className="atisha-why">{e.whyUseful}</p>
              <p className="atisha-howvalidated">How we validated it: {e.howValidated}</p>
              <footer className="atisha-foot">
                <a href={e.sourceUrl}>source →</a>
                {e.attribution && <span className="atisha-attr">via {e.attribution}</span>}
                <span className="atisha-date">validated {e.validatedOn}</span>
              </footer>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
```

- [ ] **Step 5: Add minimal catalog styles**

Append to `src/styles/components.css` simple styles for `.atisha-empty`, `.atisha-catalog`, `.atisha-entry`, `.atisha-cat`, `.atisha-title`, `.atisha-oneliner`, `.atisha-why`, `.atisha-foot`, `.atisha-attr`, `.atisha-date` consistent with the existing visual language.

- [ ] **Step 6: Run tests → pass**

Run: `bun run test src/routes/Atisha/Atisha.test.tsx`
Expected: PASS. Now re-run the Task 3 deep-link e2e:
Run: `bun run test:e2e tests/e2e/routing.spec.ts`
Expected: PASS (Atisha heading now renders).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add Atisha Initiative page with catalog + empty-state"
```

---

## Phase 4 — Atisha repo scaffold (OUTWARD ACTION — confirm with David first)

### Task 14: Scaffold the public `Dinnaga-Research/atisha` repo

> **STOP:** creating a public repo under the org is an outward action. Confirm with David before running `gh repo create`. Do not fabricate validated entries.

**Files (in a fresh clone of the new repo, not the site repo):**
- `README.md`, `LICENSE`, `CONTRIBUTING.md`, `validated/.gitkeep`, `index.json`

- [ ] **Step 1: Create the repo (after confirmation)**

Run:
```bash
gh repo create Dinnaga-Research/atisha --public --description "Open-source reference of AI tools, skills, and methods the Dinnaga lab has validated as genuinely useful." --clone
```
Expected: repo created and cloned locally.

- [ ] **Step 2: Add the scaffold files**

In the clone, create:
- `README.md` — mission (validate, then share; accelerate AI adoption), the validation bar (veracity-first, real APIs, no mocks, must have used it), how to read the catalog, link back to dinnaga.ai.
- `CONTRIBUTING.md` — the entry template matching the `AtishaEntry` front-matter (`title, category, oneLiner, sourceUrl, validatedOn, whyUseful, howValidated, attribution`).
- `validated/.gitkeep` — empty dir placeholder.
- `index.json` — `{"entries": []}` (empty catalog).
- `LICENSE` — an open license (e.g. CC-BY-4.0 for the reference content, or MIT — David's call; default CC-BY-4.0).

- [ ] **Step 3: Commit + push the scaffold**

```bash
git add -A && git commit -m "chore: scaffold the Atisha open-source validated-reference" && git push
```

- [ ] **Step 4: Record the sync mechanism + reconcile shapes (no fabricated entries)**

The site's `ATISHA_CATALOG` (a typed `AtishaEntry[]`) is the committed mirror of this repo's `index.json` `entries` array — **field names must match exactly** (`slug, title, category, oneLiner, sourceUrl, validatedOn, whyUseful, howValidated, attribution`), so the spec's "renders from index.json" holds. Make `index.json` = `{ "entries": [] }`. Add a one-line note in the site's `src/data/atishaCatalog.ts` header: entries are synced from `Dinnaga-Research/atisha/index.json` `entries` by hand (or a future deploy step) as the lab validates them. No fabricated entries at launch.

---

## Phase 5 — Polish

### Task 15: Accessibility + reduced-motion

**Files:**
- Modify: `src/components/Layout.tsx` (skip-link, main landmark)
- Modify: `src/styles/site.css` (focus-visible, prefers-reduced-motion)
- Create: `tests/e2e/a11y.spec.ts`

- [ ] **Step 1: Failing e2e (skip link + reduced motion removes the green square)**

Create `tests/e2e/a11y.spec.ts`:
```ts
import { expect, test } from '@playwright/test';

test('exposes a skip-to-content link', async ({ page }) => {
  await page.goto('/');
  const skip = page.getByRole('link', { name: /skip to content/i });
  await expect(skip).toHaveAttribute('href', '#main');
});

test.use({ reducedMotion: 'reduce' });
test('honours reduced-motion (no travelling green square)', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.green-square')).toHaveCount(0);
});
```

- [ ] **Step 2: Run it → fail**

Run: `bun run test:e2e tests/e2e/a11y.spec.ts`
Expected: FAIL.

- [ ] **Step 3: Add skip-link + main landmark**

In `src/components/Layout.tsx`, add `<a className="skip-link" href="#main">Skip to content</a>` as the first child, and wrap `<Outlet/>` in `<main id="main">…</main>` ONLY if pages don't already render their own `<main>`. (Pages in Tasks 11–13 use `<main>`; to avoid nested mains, instead give the Outlet wrapper `id="main"` on a `<div>` and ensure exactly one `<main>` per page. Simplest: Layout renders `<div id="main" className="outlet">{<Outlet/>}</div>` and each page keeps its own `<main>`.)

- [ ] **Step 4: Add CSS for focus + reduced motion**

In `src/styles/site.css`, add:
```css
.skip-link { position: absolute; left: -9999px; }
.skip-link:focus { left: 1rem; top: 1rem; z-index: 1000; }
:focus-visible { outline: 2px solid var(--accent, #39ff14); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important; }
}
```
And in `src/components/SiteNav.tsx`, gate the green-square mount on motion preference:
```tsx
const [showSquare, setShowSquare] = useState(
  () => !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
);
```
Do the same guard for any other one-shot motion (typed boot can keep its final text; only skip the animation).

- [ ] **Step 5: Run e2e → pass; commit**

Run: `bun run test:e2e tests/e2e/a11y.spec.ts`
Expected: PASS.
```bash
git add -A
git commit -m "feat: skip-link, focus-visible, and reduced-motion support"
```

### Task 16: Responsive + favicon/OG image

**Files:**
- Modify: `src/styles/site.css` / `components.css` (breakpoints for new pages)
- Add: `public/og.png` (or reuse `public/assets/logo-mark.svg`) + `index.html` og:image
- Create: `tests/e2e/responsive.spec.ts`

- [ ] **Step 1: Failing mobile e2e**

Create `tests/e2e/responsive.spec.ts`:
```ts
import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 375, height: 812 } });
test('home renders without horizontal overflow on mobile', async ({ page }) => {
  await page.goto('/');
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  );
  expect(overflow).toBe(false);
});
```

- [ ] **Step 2: Run it → fail or pass**

Run: `bun run test:e2e tests/e2e/responsive.spec.ts`
Expected: likely FAIL on a wide section. Fix overflow in CSS (the new `.method-loop`/`.atisha-catalog` and any fixed-width panels) with breakpoints at `max-width: 720px`.

- [ ] **Step 3: Add a raster OG image + font-display**

OG scrapers (Slack, X, iMessage, LinkedIn) do not render SVG, so create a real 1200×630 `public/og.png` (dark card with the DINNAGA mark) and reference it:
```html
<meta property="og:image" content="https://dinnaga.ai/og.png" />
```
Then do the font-loading-perf pass (spec §10): add `font-display: swap;` to each `@font-face` rule in `src/styles/colors_and_type.css` so text paints on the fallback immediately while the self-hosted fonts load.

- [ ] **Step 4: Run e2e → pass; commit**

```bash
git add -A
git commit -m "feat: responsive fixes for new pages + OG image"
```

---

## Phase 6 — Security / deploy (gated on David's DNS edit)

### Task 17: Restore HTTPS

> **STOP:** Steps 2–4 require (a) David has changed the `www` CNAME at Squarespace to `weytani.github.io`, and (b) DNS has propagated. Confirm before running.

- [ ] **Step 1: Verify DNS is fixed**

Run:
```bash
dig +short www.dinnaga.ai
```
Expected: resolves toward `weytani.github.io` (CNAME) — NOT `github.com`. If still `.com`, stop and ask David to make the DNS change.

- [ ] **Step 2: Restart the ACME challenge**

Run (re-saving the custom domain forces GitHub to re-attempt Let's Encrypt):
```bash
gh api -X PUT repos/weytani/dinnaga/pages -f cname="" 2>/dev/null; \
gh api -X PUT repos/weytani/dinnaga/pages -f cname="dinnaga.ai"
```
Then poll:
```bash
gh api repos/weytani/dinnaga/pages --jq '.https_certificate.state'
```
Expected: progresses to `approved`/`issued` (may take minutes). If it stays `bad_authz`, re-verify DNS and wait.

> NOTE: `public/CNAME` (contents `dinnaga.ai`) is committed and re-published by the deploy workflow on every push to main, so the apex domain is also file-managed. The `cname=""` clear above is transient — only to force an ACME restart — and a subsequent deploy re-asserts the committed file. Confirm the cert reaches `issued` WITH the CNAME present; do not assume API-only domain state.

- [ ] **Step 3: Enforce HTTPS**

Run:
```bash
gh api -X PUT repos/weytani/dinnaga/pages -F https_enforced=true
gh api repos/weytani/dinnaga/pages --jq '{state: .https_certificate.state, enforced: .https_enforced}'
```
Expected: `enforced: true`, cert state `issued`.

- [ ] **Step 4: Verify the live cert**

Run:
```bash
curl -sSI https://dinnaga.ai | head -1
```
Expected: `HTTP/2 200` with no SSL error.

---

## Phase 7 — Ship

### Task 18: Full verification + PR

- [ ] **Step 1: Green the whole suite**

Run:
```bash
bun run lint && bun run test && bun run build && bun run test:e2e
```
Expected: all pass; `dist/` built; zero console errors in e2e.

- [ ] **Step 2: Update the project memory**

Update `~/.claude/projects/-Users-weytani/memory/project_dinnaga.md` + the MEMORY.md hook: new two-pillar identity (Dinnaga org, Phylon scrubbed), the `www` CNAME root-cause + HTTPS fix, and the Atisha repo. (Per the memory protocol — convert relative dates to absolute.)

- [ ] **Step 3: Open the PR**

Run:
```bash
git push -u origin dinnaga-two-pillar-site
gh pr create --title "Two-pillar Dinnaga site: secure, finish, polish" --body "$(cat <<'EOF'
Secures dinnaga.ai (HTTPS root-caused to the www CNAME typo), finishes the site as a multi-page React-Router app, and reframes all content around the two real pillars — How We Work and the open-source Atisha Initiative. Anonymous persona; Phylon scrubbed.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 4: Merge → deploy**

After David's review, merge to `main`. The deploy workflow (lint → test → build → Pages) publishes automatically. Verify `https://dinnaga.ai` shows the new site.

---

## Open items carried from the spec (David's calls — surface at the relevant task)

1. **Atisha launch seed** (Task 13/14): ships empty by default. If David names real validated items, add them to `index.json` + `src/data/atishaCatalog.ts`.
2. **`project-planning` visibility** (Task 12): `PROJECT_PLANNING_URL` stays `null` (no link) until David makes the repo public.
3. **Org display-name rename** (out of build scope): site scrubs "Phylon" regardless; the GitHub org rename is David's, optional.
4. **Contact**: dropped for now (no contact line on Colophon or the dispatch), per David.
5. **LICENSE choice** (Task 14): default CC-BY-4.0 for the Atisha reference; confirm.

## Phase-2 backlog (NOT in this plan)

GRAVEDIGGER / arxiv-dspy / DSPy build harness / memory architecture / website-design-copier / rhisearch-center as future Atisha entries; the 12 drafted field notes; a `/notes` + `/instruments` expansion. Captured in the spec §8.

**Route code-splitting (React.lazy + Suspense):** deliberately deferred — the four-route bundle is tiny, so the spec §10 "code-split routes" item is parked here rather than adding Suspense complexity for negligible gain. (Font-loading-perf, the other §10 item, IS done in Task 16.) Revisit if the bundle grows.
