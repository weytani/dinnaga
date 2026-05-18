# Dinnaga.ai Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the public dinnaga.ai homepage as a React + Vite + Bun + TypeScript app, faithfully porting the Dinnaga Design System UI kit.

**Architecture:** Approach A — vendor the design system CSS/fonts/assets verbatim, port the 12 cosmetic UI-kit JSX components to typed TSX, extract placeholder copy into typed `src/data/` files. Single long-scroll homepage today; `src/routes/` and `App.tsx` structured so multi-page routing can be added later with no restructuring.

**Tech Stack:** Bun 1.3.13 (pkg manager + runner), Vite 6, React 19, TypeScript (strict + `noUncheckedIndexedAccess`), Vitest + React Testing Library (unit/integration), Playwright (e2e), ESLint 9 + Prettier.

**Source material:** The design system zip lives at `~/Downloads/Dinnaga Design System-2.zip`. Tasks below extract it to `/tmp/dinnaga-ds-src/`. Spec: `docs/superpowers/specs/2026-05-17-dinnaga-website-design.md`.

**Repo:** `~/code/dinnaga` (git already initialized, `main` branch, the spec is the only commit).

---

## Task 1: Project scaffolding & tooling config

**Files:**
- Create: `package.json`, `tsconfig.json`, `vite.config.ts`, `eslint.config.js`, `.prettierrc`, `.prettierignore`, `.gitignore`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/test/setup.ts`

- [ ] **Step 1: Create `.gitignore`**

```
node_modules
dist
coverage
playwright-report
test-results
*.local
.DS_Store
```

- [ ] **Step 2: Create `package.json`**

```json
{
  "name": "dinnaga",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "lint": "eslint ."
  }
}
```

- [ ] **Step 3: Install dependencies with Bun**

Run:
```bash
cd ~/code/dinnaga
bun add react react-dom
bun add -d typescript vite @vitejs/plugin-react @types/react @types/react-dom @types/node \
  vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event \
  @playwright/test eslint @eslint/js typescript-eslint globals \
  eslint-plugin-react-hooks eslint-plugin-react-refresh prettier
bunx playwright install chromium
```
Expected: `bun.lock` created, `node_modules/` populated, Chromium downloaded.

- [ ] **Step 4: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "skipLibCheck": true,
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "types": ["node", "vitest/globals", "@testing-library/jest-dom"]
  },
  "include": ["src", "vite.config.ts", "playwright.config.ts", "tests"]
}
```

- [ ] **Step 5: Create `vite.config.ts`**

```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Dev/preview ports use 42xx — "42" is the recurring HUD number in the
// Dinnaga design system (PING 42ms, SIGNAL 042) and avoids common ports.
export default defineConfig({
  plugins: [react()],
  server: { port: 4242 },
  preview: { port: 4243 },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    exclude: ['**/node_modules/**', '**/tests/e2e/**', '**/dist/**'],
  },
});
```

- [ ] **Step 6: Create `src/test/setup.ts`**

```ts
// ABOUTME: Vitest global setup — registers jest-dom matchers for all tests.
// ABOUTME: Referenced by vite.config.ts `test.setupFiles`.
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 7: Create `eslint.config.js`**

```js
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'coverage', 'playwright-report', 'test-results', 'src/styles'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
);
```

- [ ] **Step 8: Create `.prettierrc` and `.prettierignore`**

`.prettierrc`:
```json
{ "singleQuote": true, "semi": true, "printWidth": 100, "trailingComma": "all" }
```

`.prettierignore` (vendored design-system CSS must never be reformatted):
```
dist
coverage
src/styles
public
bun.lock
```

- [ ] **Step 9: Create `index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Dinnaga Research — research, education, consulting for AI adoption</title>
    <link rel="icon" type="image/svg+xml" href="/assets/logo-mark.svg" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 10: Create `src/App.tsx` (placeholder, replaced in Task 15)**

```tsx
// ABOUTME: Root application component. Renders the homepage route today.
// ABOUTME: Router-ready: wrap in a router and add routes/ siblings later.
export function App() {
  return <div>Dinnaga — scaffolding</div>;
}
```

- [ ] **Step 11: Create `src/main.tsx` (CSS imports added in Task 2)**

```tsx
// ABOUTME: Browser entry point — mounts the React app onto #root.
// ABOUTME: StrictMode is intentionally omitted; its dev double-invoke would
// ABOUTME: fire the one-shot signature motions (nav reveal, CTA blink) twice.
import { createRoot } from 'react-dom/client';
import { App } from './App';

const root = document.getElementById('root');
if (!root) throw new Error('Root element #root not found');
createRoot(root).render(<App />);
```

- [ ] **Step 12: Verify the build passes**

Run: `bun run build`
Expected: PASS — `tsc --noEmit` reports no errors, `vite build` writes `dist/`.

- [ ] **Step 13: Commit**

```bash
git add -A
git commit -m "chore: scaffold vite + react + ts project with bun"
```

---

## Task 2: Vendor the design system

**Files:**
- Create: `src/styles/colors_and_type.css`, `src/styles/components.css`, `src/styles/site.css`, `public/fonts/*`, `public/assets/*`
- Modify: `src/main.tsx`

- [ ] **Step 1: Extract the design system zip**

Run:
```bash
rm -rf /tmp/dinnaga-ds-src && mkdir -p /tmp/dinnaga-ds-src
unzip -q ~/Downloads/"Dinnaga Design System-2.zip" -d /tmp/dinnaga-ds-src
ls /tmp/dinnaga-ds-src
```
Expected: lists `README.md SKILL.md assets colors_and_type.css components.css fonts preview screenshots ui_kits uploads`.

- [ ] **Step 2: Copy CSS, fonts, and assets into the project**

Run:
```bash
cd ~/code/dinnaga
mkdir -p src/styles public/fonts public/assets
cp /tmp/dinnaga-ds-src/colors_and_type.css src/styles/
cp /tmp/dinnaga-ds-src/components.css src/styles/
cp /tmp/dinnaga-ds-src/ui_kits/website/site.css src/styles/
cp /tmp/dinnaga-ds-src/fonts/* public/fonts/
cp /tmp/dinnaga-ds-src/assets/* public/assets/
ls public/fonts public/assets src/styles
```
Expected: `public/fonts/` has 7 woff2 + `Sevastopol-Interface.ttf`; `public/assets/` has `logo-mark.svg` + `logo-wordmark.svg`; `src/styles/` has the 3 CSS files.

- [ ] **Step 3: Patch `@font-face` url paths in `src/styles/colors_and_type.css`**

The vendored CSS references fonts as `url("./fonts/NAME")`. Fonts now live in `public/fonts/`, served at the site root. Change **only** the 8 `@font-face` `src:` url paths from `./fonts/` to `/fonts/` — touch nothing else in the file.

Run:
```bash
cd ~/code/dinnaga
sed -i '' 's#url("\./fonts/#url("/fonts/#g' src/styles/colors_and_type.css
grep -n 'url(' src/styles/colors_and_type.css
```
Expected: 8 lines, each now reading `src: url("/fonts/...")`.

- [ ] **Step 4: Import the vendored CSS in `src/main.tsx`**

Replace the contents of `src/main.tsx` with:

```tsx
// ABOUTME: Browser entry point — mounts the React app onto #root.
// ABOUTME: StrictMode is intentionally omitted; its dev double-invoke would
// ABOUTME: fire the one-shot signature motions (nav reveal, CTA blink) twice.
import { createRoot } from 'react-dom/client';
import './styles/colors_and_type.css';
import './styles/components.css';
import './styles/site.css';
import { App } from './App';

const root = document.getElementById('root');
if (!root) throw new Error('Root element #root not found');
createRoot(root).render(<App />);
```

- [ ] **Step 5: Verify the build still passes**

Run: `bun run build`
Expected: PASS. `dist/assets/` contains the bundled CSS and the woff2/ttf font files.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: vendor dinnaga design system css, fonts, and assets"
```

---

## Task 3: Shared content types

**Files:**
- Create: `src/types.ts`

- [ ] **Step 1: Create `src/types.ts`**

```ts
// ABOUTME: Shared TypeScript types for Dinnaga site content.
// ABOUTME: Consumed by data files in src/data/ and the components that render them.

export type Category = 'RESEARCH' | 'EDUCATION' | 'CONSULTING';

export interface FieldNote {
  id: string;
  cat: Category;
  date: string;
  readTime: string;
  title: string;
  excerpt: string;
}

export type PracticeIconName = 'research' | 'education' | 'consulting';

export interface Practice {
  num: string;
  title: string;
  icon: PracticeIconName;
  summary: string;
  body: string;
  meta: string;
}

export interface DataRow {
  idx: string;
  label: string;
  value: string;
}

export interface BootLine {
  text: string;
  delay: number;
}
```

- [ ] **Step 2: Verify it type-checks**

Run: `bunx tsc --noEmit`
Expected: PASS, no errors.

- [ ] **Step 3: Commit**

```bash
git add src/types.ts
git commit -m "feat: add shared content types"
```

---

## Task 4: Content data files

**Files:**
- Create: `src/data/fieldNotes.ts`, `src/data/practices.ts`, `src/data/surfaceData.ts`, `src/data/tickerItems.ts`, `src/data/bootLines.ts`, `src/data/navLinks.ts`
- Test: `src/data/data.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/data/data.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { FIELD_NOTES } from './fieldNotes';
import { PRACTICES } from './practices';
import { SURFACE_DATA } from './surfaceData';
import { TICKER_ITEMS } from './tickerItems';
import { BOOT_LINES } from './bootLines';
import { NAV_LINKS } from './navLinks';

const CATEGORIES = ['RESEARCH', 'EDUCATION', 'CONSULTING'];

describe('content data files', () => {
  it('ships four field notes with valid categories', () => {
    expect(FIELD_NOTES).toHaveLength(4);
    for (const note of FIELD_NOTES) {
      expect(CATEGORIES).toContain(note.cat);
    }
  });

  it('ships three practices', () => {
    expect(PRACTICES).toHaveLength(3);
    expect(PRACTICES.map((p) => p.icon)).toEqual(['research', 'education', 'consulting']);
  });

  it('ships six surface-data rows', () => {
    expect(SURFACE_DATA).toHaveLength(6);
  });

  it('ships ticker items, boot lines, and nav links', () => {
    expect(TICKER_ITEMS.length).toBeGreaterThan(0);
    expect(BOOT_LINES.length).toBeGreaterThan(0);
    expect(NAV_LINKS).toEqual(['Research', 'Education', 'Consulting', 'Field Notes', 'About']);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `bun run test`
Expected: FAIL — cannot resolve `./fieldNotes` etc.

- [ ] **Step 3: Create `src/data/fieldNotes.ts`**

```ts
// ABOUTME: Field-notes content — placeholder copy ported from the UI kit.
// ABOUTME: Swap real entries here; FieldNotes.tsx renders this verbatim.
import type { FieldNote } from '../types';

export const FIELD_NOTES: FieldNote[] = [
  {
    id: 'fn-042',
    cat: 'RESEARCH',
    date: '2026-04-16',
    readTime: '14 min',
    title: 'Adoption in regulated industries',
    excerpt:
      "A survey of how 38 teams in healthcare, public sector, and telecoms are actually integrating LLMs. Less hype than you'd expect, more spreadsheets.",
  },
  {
    id: 'fn-041',
    cat: 'EDUCATION',
    date: '2026-04-09',
    readTime: '8 min',
    title: 'What we teach in Foundations',
    excerpt:
      "The actual two-day curriculum — every slide, every exercise, every reading. We've made the whole thing CC-BY so you can run it yourself.",
  },
  {
    id: 'fn-040',
    cat: 'CONSULTING',
    date: '2026-03-28',
    readTime: '6 min',
    title: 'Three engagements, three lessons',
    excerpt:
      'What we got right and wrong working with a national health service, a tier-1 telco, and a city council in 2025.',
  },
  {
    id: 'fn-039',
    cat: 'RESEARCH',
    date: '2026-03-12',
    readTime: '22 min',
    title: 'On the inevitability of proliferation',
    excerpt:
      'Our founding essay. Why we believe powerful AI will spread regardless of policy, and what that implies about how we choose to spend our time.',
  },
];
```

- [ ] **Step 4: Create `src/data/practices.ts`**

```ts
// ABOUTME: "Three quiet practices" content — placeholder copy ported from the UI kit.
// ABOUTME: Swap real copy here; Practices.tsx renders this verbatim.
import type { Practice } from '../types';

export const PRACTICES: Practice[] = [
  {
    num: '01',
    title: 'Research',
    icon: 'research',
    summary: 'Plainspoken reports on AI adoption — written for operators, not investors.',
    body: 'Plainspoken reports on AI adoption — written for operators, not investors. We publish quarterly primers and a monthly field-notes index. Everything is open access, machine-readable, and translated into three languages.',
    meta: '▸ 14 papers · 3 languages',
  },
  {
    num: '02',
    title: 'Education',
    icon: 'education',
    summary: 'Workshops and primers for general audiences and operators. Practical, hype-free.',
    body: 'Workshops and primers for general audiences and operators. Practical, hype-free, with materials you keep. Two cohorts a year for foundations; rolling enrollment for advanced topics. Scholarship places held for public-sector applicants.',
    meta: '▸ 6 cohorts / year',
  },
  {
    num: '03',
    title: 'Consulting',
    icon: 'consulting',
    summary: 'Durable, no-bullshit engagements helping organizations adopt AI thoughtfully.',
    body: 'Durable, no-bullshit engagements helping organizations adopt AI thoughtfully. We work mostly with regulated industries — telecoms, public sector, healthcare. Engagements are typically 12 weeks, capped intake.',
    meta: '▸ 8 engagements/year',
  },
];
```

- [ ] **Step 5: Create `src/data/surfaceData.ts`**

```ts
// ABOUTME: "Surface data" dossier rows — placeholder copy ported from the UI kit.
// ABOUTME: DataPanel.tsx renders this as the left-hand tabular panel.
import type { DataRow } from '../types';

export const SURFACE_DATA: DataRow[] = [
  { idx: '01', label: 'Founded', value: 'Late 2024' },
  { idx: '02', label: 'Headcount', value: '7 researchers, 2 educators, 1 strategist' },
  { idx: '03', label: 'Headquarters', value: 'Distributed — UK · DE · KE' },
  { idx: '04', label: 'Funding', value: 'Independent · 100% project-based revenue' },
  { idx: '05', label: 'Open output', value: 'All papers · CC-BY 4.0' },
  { idx: '06', label: 'Last transmission', value: '2026-04-16 · 18:42Z' },
];
```

- [ ] **Step 6: Create `src/data/tickerItems.ts`**

```ts
// ABOUTME: Marquee ticker items — placeholder system announcements from the UI kit.
// ABOUTME: Home.tsx passes these to the Ticker component.
export const TICKER_ITEMS: string[] = [
  '▸ TRANSMISSION 042 OPEN',
  '▸ NEW PRIMER — ADOPTION IN REGULATED INDUSTRIES',
  '▸ WORKSHOP COHORT 03 ENROLLING',
  '▸ FIELD NOTES — APRIL DROPPED',
  '▸ NEW ENGAGEMENT — CITY OF SHEFFIELD',
];
```

- [ ] **Step 7: Create `src/data/bootLines.ts`**

```ts
// ABOUTME: Hero terminal boot sequence — placeholder lines from the UI kit.
// ABOUTME: The Terminal component types these in character-by-character on mount.
import type { BootLine } from '../types';

export const BOOT_LINES: BootLine[] = [
  { text: 'DINNAGA-OS  v0.4.1   //   TERMINAL · SIGNAL // 042', delay: 60 },
  { text: 'ESTABLISHING UPLINK  ........  OK', delay: 70 },
  { text: 'DECRYPTING DOSSIER   ........  OK', delay: 70 },
  { text: 'OPERATOR  : VISITOR', delay: 60 },
  { text: 'CHANNEL   : RESEARCH / EDUCATION / CONSULTING', delay: 60 },
  { text: '', delay: 30 },
  { text: '▸  ASK US ANYTHING ABOUT AI ADOPTION.', delay: 60 },
  { text: '▸  WE READ EVERYTHING. WE REPLY TO ALMOST EVERYTHING.', delay: 60 },
  { text: '', delay: 30 },
];
```

- [ ] **Step 8: Create `src/data/navLinks.ts`**

```ts
// ABOUTME: Primary navigation labels — SiteNav derives anchor ids from these.
// ABOUTME: Order is the on-screen order.
export const NAV_LINKS: string[] = ['Research', 'Education', 'Consulting', 'Field Notes', 'About'];
```

- [ ] **Step 9: Run the test to verify it passes**

Run: `bun run test`
Expected: PASS — all 4 `data.test.ts` assertions green.

- [ ] **Step 10: Commit**

```bash
git add src/data src/types.ts
git commit -m "feat: add typed content data files"
```

---

## Task 5: useTyped hook

**Files:**
- Create: `src/hooks/useTyped.ts`
- Test: `src/hooks/useTyped.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/hooks/useTyped.test.ts`:

```ts
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useTyped } from './useTyped';

describe('useTyped', () => {
  it('reveals every line character-by-character then reports done', async () => {
    const lines = [
      { text: 'AB', delay: 30 },
      { text: 'CD', delay: 30 },
    ];
    const { result } = renderHook(() => useTyped(lines));

    await waitFor(() => expect(result.current.done).toBe(true), { timeout: 3000 });
    expect(result.current.rendered).toEqual(['AB', 'CD']);
  });

  it('starts with an empty render and not-done state', () => {
    const { result } = renderHook(() => useTyped([{ text: 'X', delay: 30 }]));
    expect(result.current.done).toBe(false);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `bun run test src/hooks/useTyped.test.ts`
Expected: FAIL — cannot resolve `./useTyped`.

- [ ] **Step 3: Create `src/hooks/useTyped.ts`**

This preserves the UI kit's original `tick()` loop structure exactly; the only
additions are the module-level `sleep`, the `BootLine` typing, and the
`if (!line) break;` guard required by `noUncheckedIndexedAccess`.

```ts
// ABOUTME: Sequentially reveals terminal boot lines character-by-character.
// ABOUTME: Returns the rendered line strings plus a `done` flag for the Hero terminal.
import { useEffect, useState } from 'react';
import type { BootLine } from '../types';

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export function useTyped(lines: BootLine[]) {
  const [rendered, setRendered] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let lineIdx = 0;
    let charIdx = 0;
    const out = lines.map(() => '');

    async function tick() {
      while (!cancelled && lineIdx < lines.length) {
        const line = lines[lineIdx];
        if (!line) break;
        if (charIdx < line.text.length) {
          out[lineIdx] = line.text.slice(0, charIdx + 1);
          charIdx += 1;
          setRendered([...out]);
          await sleep(line.delay === 30 ? 10 : 14);
        } else {
          lineIdx += 1;
          charIdx = 0;
          await sleep(line.delay);
        }
      }
      if (!cancelled) setDone(true);
    }

    tick();
    return () => {
      cancelled = true;
    };
    // Runs once on mount; `lines` is treated as a stable mount-time input.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { rendered, done };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `bun run test src/hooks/useTyped.test.ts`
Expected: PASS — both tests green.

- [ ] **Step 5: Commit**

```bash
git add src/hooks
git commit -m "feat: add useTyped terminal-boot hook"
```

---

## Task 6: Static leaf components — BrandMark & CautionDivider

**Files:**
- Create: `src/components/BrandMark.tsx`, `src/components/CautionDivider.tsx`
- Test: `src/components/BrandMark.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/BrandMark.test.tsx`:

```tsx
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BrandMark } from './BrandMark';
import { CautionDivider } from './CautionDivider';

describe('BrandMark', () => {
  it('renders an svg at the requested size', () => {
    const { container } = render(<BrandMark size={32} />);
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg).toHaveAttribute('width', '32');
  });
});

describe('CautionDivider', () => {
  it('renders a decorative separator', () => {
    const { container } = render(<CautionDivider />);
    expect(container.querySelector('.caution-stripes')).not.toBeNull();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `bun run test src/components/BrandMark.test.tsx`
Expected: FAIL — cannot resolve `./BrandMark`.

- [ ] **Step 3: Create `src/components/BrandMark.tsx`**

```tsx
// ABOUTME: Dinnaga hexagonal "gate" brand mark, rendered as inline SVG.
// ABOUTME: Inherits color via currentColor; sized by the `size` prop.
interface BrandMarkProps {
  size?: number;
  color?: string;
}

export function BrandMark({ size = 24, color = 'currentColor' }: BrandMarkProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true" style={{ color }}>
      <path d="M20 2 L36 11 L36 29 L20 38 L4 29 L4 11 Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 12 L12 28 L24 28 L28 24 L28 16 L24 12 Z" fill="currentColor" />
      <rect x="14" y="18" width="10" height="4" fill="#000" />
    </svg>
  );
}
```

- [ ] **Step 4: Create `src/components/CautionDivider.tsx`**

```tsx
// ABOUTME: Diagonal signal/black caution-stripe band used as a section divider.
// ABOUTME: Purely decorative; the stripe pattern is defined in vendored CSS.
export function CautionDivider() {
  return <div className="caution-stripes" role="separator" aria-hidden="true" />;
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `bun run test src/components/BrandMark.test.tsx`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/BrandMark.tsx src/components/CautionDivider.tsx src/components/BrandMark.test.tsx
git commit -m "feat: add BrandMark and CautionDivider components"
```

---

## Task 7: Static components — Ticker & AsciiArt

**Files:**
- Create: `src/components/Ticker.tsx`, `src/components/AsciiArt.tsx`
- Test: `src/components/Ticker.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/Ticker.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Ticker } from './Ticker';
import { AsciiArt } from './AsciiArt';

describe('Ticker', () => {
  it('renders the joined items twice for a seamless loop', () => {
    const { container } = render(<Ticker items={['ONE', 'TWO']} />);
    const texts = container.querySelectorAll('.ticker-text');
    expect(texts).toHaveLength(2);
    expect(texts[0]?.textContent).toContain('ONE');
    expect(texts[0]?.textContent).toContain('TWO');
  });
});

describe('AsciiArt', () => {
  it('renders the dossier section heading', () => {
    render(<AsciiArt />);
    expect(screen.getByText('Decoded // wireframe.')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `bun run test src/components/Ticker.test.tsx`
Expected: FAIL — cannot resolve `./Ticker`.

- [ ] **Step 3: Create `src/components/Ticker.tsx`**

```tsx
// ABOUTME: Section ticker — a 38s linear marquee of system announcements.
// ABOUTME: Renders the joined item text twice so the CSS marquee loops seamlessly.
interface TickerProps {
  items: string[];
}

export function Ticker({ items }: TickerProps) {
  const text = items.join('   ·   ');
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">
        <span className="ticker-text">{text}&nbsp;&nbsp;</span>
        <span className="ticker-text">{text}&nbsp;&nbsp;</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create `src/components/AsciiArt.tsx`**

```tsx
// ABOUTME: ASCII dossier section — a decorative glyph block under a section head.
// ABOUTME: The art string is static; vendored CSS handles the layered green extrusion.
const ASCII_ART = String.raw`
        ████████████████████████████████████████████████████████████
        ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██
        ██▓▒░                                                  ░▒▓██
        ██▓▒░     ╔═══════════════════════════════════════╗    ░▒▓██
        ██▓▒░     ║   D  I  N  N  A  G  A   //  RESEARCH  ║    ░▒▓██
        ██▓▒░     ╚═══════════════════════════════════════╝    ░▒▓██
        ██▓▒░                                                  ░▒▓██
        ██▓▒░       /\          ▸ SIGNAL  : 042 OPEN           ░▒▓██
        ██▓▒░      /  \         ▸ DOSSIER : APRIL 2026         ░▒▓██
        ██▓▒░     /    \        ▸ ADOPTION: 87% / 14 PAPERS    ░▒▓██
        ██▓▒░    /  ██  \       ▸ FIDELITY: HIGH               ░▒▓██
        ██▓▒░   /  ████  \      ▸ STATUS  : LIVE · OUTBOUND    ░▒▓██
        ██▓▒░  /  ██████  \                                    ░▒▓██
        ██▓▒░ /____________\    ┌─[ TRANSMISSION ]──────┐      ░▒▓██
        ██▓▒░ |    [   ]   |    │ research  /  open     │      ░▒▓██
        ██▓▒░ |    [ D ]   |    │ education /  open     │      ░▒▓██
        ██▓▒░ |    [   ]   |    │ consulting/  open     │      ░▒▓██
        ██▓▒░ |____________|    └───────────────────────┘      ░▒▓██
        ██▓▒░                                                  ░▒▓██
        ██▓▒░  ░▒▓█  EMPOWER · ANYONE WHO BRINGS A QUESTION    ░▒▓██
        ██▓▒░                                                  ░▒▓██
        ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██
        ████████████████████████████████████████████████████████████`;

export function AsciiArt() {
  return (
    <section className="ascii-section" data-screen-label="ASCII dossier">
      <header className="section-head">
        <span className="section-eye">// 04 · DOSSIER · TRANSMISSION GATE</span>
        <h2 className="section-title">Decoded // wireframe.</h2>
      </header>
      <div className="ascii-stack" aria-hidden="true">
        <pre>{ASCII_ART}</pre>
      </div>
      <div className="ascii-caption">
        <span className="dot dot-live" />
        <span>▸ EXTRUDED IN EIGHT TINTS OF #C0FE04 · BREATHING ENABLED</span>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `bun run test src/components/Ticker.test.tsx`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/Ticker.tsx src/components/AsciiArt.tsx src/components/Ticker.test.tsx
git commit -m "feat: add Ticker and AsciiArt components"
```

---

## Task 8: CookieBanner component

**Files:**
- Create: `src/components/CookieBanner.tsx`
- Test: `src/components/CookieBanner.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/CookieBanner.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CookieBanner } from './CookieBanner';

describe('CookieBanner', () => {
  it('marks itself dismissed and calls onDismiss when Accept is clicked', async () => {
    const onDismiss = vi.fn();
    const { container } = render(<CookieBanner onDismiss={onDismiss} />);
    const banner = container.querySelector('.cookie');

    expect(banner).not.toHaveClass('is-dismissed');
    await userEvent.click(screen.getByRole('button', { name: 'Accept' }));

    expect(banner).toHaveClass('is-dismissed');
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('dismisses on Decline too', async () => {
    const { container } = render(<CookieBanner />);
    await userEvent.click(screen.getByRole('button', { name: 'Decline' }));
    expect(container.querySelector('.cookie')).toHaveClass('is-dismissed');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `bun run test src/components/CookieBanner.test.tsx`
Expected: FAIL — cannot resolve `./CookieBanner`.

- [ ] **Step 3: Create `src/components/CookieBanner.tsx`**

```tsx
// ABOUTME: Top-of-page cookie / transmission advisory bar.
// ABOUTME: Dismisses itself on Accept or Decline; notifies the parent via onDismiss.
import { useState } from 'react';

interface CookieBannerProps {
  onDismiss?: () => void;
}

export function CookieBanner({ onDismiss }: CookieBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const handle = () => {
    setDismissed(true);
    onDismiss?.();
  };
  return (
    <aside
      className={'cookie' + (dismissed ? ' is-dismissed' : '')}
      role="note"
      aria-hidden={dismissed}
    >
      <div className="cookie-inner">
        <span className="cookie-tag">DINNAGA // TRANSMISSION ADVISORY</span>
        <p className="cookie-text">
          This site uses lightweight analytics to understand which research reaches you. Nothing
          personal — telemetry only.
        </p>
        <div className="cookie-actions">
          <button className="btn-mini" onClick={handle}>
            Accept
          </button>
          <button className="btn-mini alt" onClick={handle}>
            Decline
          </button>
        </div>
      </div>
    </aside>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `bun run test src/components/CookieBanner.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/CookieBanner.tsx src/components/CookieBanner.test.tsx
git commit -m "feat: add CookieBanner component"
```

---

## Task 9: SiteNav component

**Files:**
- Create: `src/components/SiteNav.tsx`
- Test: `src/components/SiteNav.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/SiteNav.test.tsx`:

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SiteNav } from './SiteNav';

describe('SiteNav', () => {
  it('shows the travelling green square on mount, then removes it', async () => {
    const { container } = render(<SiteNav />);
    expect(container.querySelector('.green-square')).not.toBeNull();
    await waitFor(() => expect(container.querySelector('.green-square')).toBeNull(), {
      timeout: 2500,
    });
  });

  it('calls onNav with the slugified link id when a nav link is clicked', async () => {
    const onNav = vi.fn();
    render(<SiteNav onNav={onNav} />);
    await userEvent.click(screen.getByText('FIELD NOTES'));
    expect(onNav).toHaveBeenCalledWith('field-notes');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `bun run test src/components/SiteNav.test.tsx`
Expected: FAIL — cannot resolve `./SiteNav`.

- [ ] **Step 3: Create `src/components/SiteNav.tsx`**

The kit repeated the `toLowerCase().replace(/\s+/g, '-')` slug expression twice;
it is hoisted here into a single `toId` helper (behavior identical).

```tsx
// ABOUTME: Sticky primary navigation — brand mark, 5 links, live-status corner.
// ABOUTME: Signature motion: a green square races L→R behind the clip-reveal on mount.
import { Fragment, useEffect, useState } from 'react';
import { BrandMark } from './BrandMark';
import { NAV_LINKS } from '../data/navLinks';

interface SiteNavProps {
  onNav?: (id: string) => void;
}

const toId = (label: string) => label.toLowerCase().replace(/\s+/g, '-');

export function SiteNav({ onNav }: SiteNavProps) {
  const [showSquare, setShowSquare] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowSquare(false), 1300);
    return () => clearTimeout(t);
  }, []);

  return (
    <Fragment>
      {showSquare && <div className="green-square" aria-hidden="true" />}
      <nav className="nav" aria-label="Primary">
        <a
          className="nav-brand"
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            onNav?.('top');
          }}
        >
          <BrandMark size={26} />
          <span className="word">DINNAGA</span>
        </a>
        <div className="nav-links">
          {NAV_LINKS.map((l) => (
            <a
              key={l}
              href={'#' + toId(l)}
              onClick={(e) => {
                e.preventDefault();
                onNav?.(toId(l));
              }}
            >
              {l.toUpperCase()}
            </a>
          ))}
        </div>
        <div className="nav-right">
          <span className="dot dot-live" />
          <span>LIVE · 2026-04-16</span>
        </div>
      </nav>
    </Fragment>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `bun run test src/components/SiteNav.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/SiteNav.tsx src/components/SiteNav.test.tsx
git commit -m "feat: add SiteNav component"
```

---

## Task 10: Practices component

**Files:**
- Create: `src/components/Practices.tsx`
- Test: `src/components/Practices.test.tsx`

Note: the kit's inner `Practice` component is renamed `PracticeCard` here to avoid
colliding with the `Practice` *type* from `src/types.ts`.

- [ ] **Step 1: Write the failing test**

Create `src/components/Practices.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Practices } from './Practices';

describe('Practices', () => {
  it('shows the summary by default and the longer body after a click', async () => {
    render(<Practices />);
    const research = screen.getByText('Research').closest('.practice') as HTMLElement;

    expect(research).not.toHaveClass('is-open');
    expect(research.textContent).toContain('written for operators, not investors.');
    expect(research.textContent).not.toContain('quarterly primers');

    await userEvent.click(research);

    expect(research).toHaveClass('is-open');
    expect(research.textContent).toContain('quarterly primers');
  });

  it('toggles open on Enter keypress', async () => {
    render(<Practices />);
    const research = screen.getByText('Research').closest('.practice') as HTMLElement;
    research.focus();
    await userEvent.keyboard('{Enter}');
    expect(research).toHaveClass('is-open');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `bun run test src/components/Practices.test.tsx`
Expected: FAIL — cannot resolve `./Practices`.

- [ ] **Step 3: Create `src/components/Practices.tsx`**

```tsx
// ABOUTME: "Three quiet practices" section — Research / Education / Consulting.
// ABOUTME: Each card expands on click or Enter/Space to reveal a longer body.
import { useState } from 'react';
import type { PracticeIconName } from '../types';
import { PRACTICES } from '../data/practices';

interface PracticeIconProps {
  name: PracticeIconName;
}

function PracticeIcon({ name }: PracticeIconProps) {
  const common = { strokeLinecap: 'square', strokeLinejoin: 'miter' } as const;
  if (name === 'research') {
    return (
      <svg className="practice-icon" viewBox="0 0 24 24" {...common}>
        <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
        <polyline points="14 3 14 9 20 9" />
        <line x1="8" y1="13" x2="16" y2="13" />
        <line x1="8" y1="17" x2="14" y2="17" />
      </svg>
    );
  }
  if (name === 'education') {
    return (
      <svg className="practice-icon" viewBox="0 0 24 24" {...common}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    );
  }
  return (
    <svg className="practice-icon" viewBox="0 0 24 24" {...common}>
      <circle cx="12" cy="12" r="10" />
      <polygon points="16 8 13 13 8 16 11 11 16 8" />
    </svg>
  );
}

interface PracticeCardProps {
  num: string;
  title: string;
  icon: PracticeIconName;
  summary: string;
  body: string;
  meta: string;
  open: boolean;
  onToggle: () => void;
}

function PracticeCard({ num, title, icon, summary, body, meta, open, onToggle }: PracticeCardProps) {
  return (
    <div
      className={'practice' + (open ? ' is-open' : '')}
      onClick={onToggle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle();
        }
      }}
    >
      <PracticeIcon name={icon} />
      <span className="practice-num">// {num}</span>
      <h3 className="practice-title">{title}</h3>
      <p className="practice-body">{open ? body : summary}</p>
      <span className="practice-meta">{meta}</span>
    </div>
  );
}

export function Practices() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <section className="section" id="research" data-screen-label="Practices">
      <header className="section-head">
        <span className="section-eye">// 02 · WHAT WE DO</span>
        <h2 className="section-title">Three quiet practices.</h2>
      </header>
      <div className="practices">
        {PRACTICES.map((it, i) => (
          <PracticeCard
            key={it.num}
            {...it}
            open={openIdx === i}
            onToggle={() => setOpenIdx(openIdx === i ? null : i)}
          />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `bun run test src/components/Practices.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/Practices.tsx src/components/Practices.test.tsx
git commit -m "feat: add Practices component"
```

---

## Task 11: FieldNotes component

**Files:**
- Create: `src/components/FieldNotes.tsx`
- Test: `src/components/FieldNotes.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/FieldNotes.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { FieldNotes } from './FieldNotes';

describe('FieldNotes', () => {
  it('shows all four notes by default', () => {
    const { container } = render(<FieldNotes />);
    expect(container.querySelectorAll('.note')).toHaveLength(4);
  });

  it('filters to research notes when the RESEARCH chip is clicked', async () => {
    const { container } = render(<FieldNotes />);
    await userEvent.click(screen.getByRole('button', { name: 'RESEARCH' }));
    const notes = container.querySelectorAll('.note');
    expect(notes).toHaveLength(2);
    for (const note of notes) {
      expect(note.querySelector('.note-cat')?.textContent).toBe('RESEARCH');
    }
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `bun run test src/components/FieldNotes.test.tsx`
Expected: FAIL — cannot resolve `./FieldNotes`.

- [ ] **Step 3: Create `src/components/FieldNotes.tsx`**

```tsx
// ABOUTME: Field-notes section — a filterable 2×2 seam-grid of the latest entries.
// ABOUTME: The filter chip set is derived from the FieldNote category union.
import { useState } from 'react';
import type { Category, FieldNote } from '../types';
import { FIELD_NOTES } from '../data/fieldNotes';

const CATS: Array<Category | 'ALL'> = ['ALL', 'RESEARCH', 'EDUCATION', 'CONSULTING'];

interface NoteProps {
  note: FieldNote;
}

function Note({ note }: NoteProps) {
  return (
    <a className="note" href={'#' + note.id}>
      <div className="note-meta">
        <span className="note-cat">{note.cat}</span>
        <span>{note.date}</span>
      </div>
      <h3 className="note-title">{note.title}</h3>
      <p className="note-excerpt">{note.excerpt}</p>
      <div className="note-foot">
        <span>{note.readTime}</span>
        <span className="spacer" />
        <span className="note-read">▸ READ</span>
      </div>
    </a>
  );
}

export function FieldNotes() {
  const [filter, setFilter] = useState<Category | 'ALL'>('ALL');
  const visible = filter === 'ALL' ? FIELD_NOTES : FIELD_NOTES.filter((n) => n.cat === filter);
  return (
    <section className="section" id="field-notes" data-screen-label="Field Notes">
      <header className="section-head">
        <span className="section-eye">// 03 · FIELD NOTES</span>
        <h2 className="section-title">What we've been writing.</h2>
      </header>
      <div className="notes-toolbar">
        {CATS.map((c) => (
          <button
            key={c}
            className={'filter-chip' + (filter === c ? ' is-active' : '')}
            onClick={() => setFilter(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="notes-grid">
        {visible.map((n) => (
          <Note key={n.id} note={n} />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `bun run test src/components/FieldNotes.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/FieldNotes.tsx src/components/FieldNotes.test.tsx
git commit -m "feat: add FieldNotes component"
```

---

## Task 12: DataPanel component

**Files:**
- Create: `src/components/DataPanel.tsx`
- Test: `src/components/DataPanel.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/DataPanel.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DataPanel } from './DataPanel';

describe('DataPanel', () => {
  it('renders all six surface-data rows', () => {
    const { container } = render(<DataPanel />);
    expect(container.querySelectorAll('.data-row')).toHaveLength(6);
  });

  it('renders both dossier panels', () => {
    render(<DataPanel />);
    expect(screen.getByText('SURFACE DATA')).toBeInTheDocument();
    expect(screen.getByText('WHO WE ARE')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `bun run test src/components/DataPanel.test.tsx`
Expected: FAIL — cannot resolve `./DataPanel`.

- [ ] **Step 3: Create `src/components/DataPanel.tsx`**

```tsx
// ABOUTME: Two-column dossier panel — tabular surface data plus an "about" prose panel.
// ABOUTME: The tabular rows come from src/data/surfaceData.ts; the prose is static copy.
import { SURFACE_DATA } from '../data/surfaceData';

export function DataPanel() {
  return (
    <section
      className="section"
      id="about"
      data-screen-label="About panels"
      style={{ padding: 0, borderBottom: 'none' }}
    >
      <div className="data-panels">
        <article className="panel">
          <header className="panel-head">
            <span className="panel-idx">// 04</span>
            <h3 className="panel-title">SURFACE DATA</h3>
          </header>
          <dl className="data-list">
            {SURFACE_DATA.map((r) => (
              <div className="data-row" key={r.idx}>
                <span className="data-idx">{r.idx}</span>
                <dt className="data-label">{r.label}</dt>
                <dd className="data-value">{r.value}</dd>
              </div>
            ))}
          </dl>
          <footer className="panel-foot">
            <span className="chip chip-signal">PUBLIC</span>
            <span>Last sync 2026-04-16 // Dinnaga Research</span>
          </footer>
        </article>
        <article className="panel">
          <header className="panel-head">
            <span className="panel-idx">// 05</span>
            <h3 className="panel-title">WHO WE ARE</h3>
          </header>
          <p className="panel-body">
            Dinnaga Research is a small, focused team. We're <em>research-first</em>: we publish
            before we consult, and we teach before we publish. The work is open by default and our
            roadmap is decided in public.
          </p>
          <p className="panel-body">
            We're named for Dignāga — a 6th-century philosopher of perception and inference whose
            work argued that knowledge belongs to whoever takes the trouble to examine it. We try to
            keep that bar.
          </p>
          <ul className="panel-list">
            <li>
              <span className="panel-bullet">▸</span> All research published under CC-BY 4.0.
            </li>
            <li>
              <span className="panel-bullet">▸</span> Workshop materials open-source.
            </li>
            <li>
              <span className="panel-bullet">▸</span> Engagements declined if outcome can't be
              shared.
            </li>
            <li>
              <span className="panel-bullet">▸</span> No marketing budget — only field notes.
            </li>
          </ul>
        </article>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `bun run test src/components/DataPanel.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/DataPanel.tsx src/components/DataPanel.test.tsx
git commit -m "feat: add DataPanel component"
```

---

## Task 13: Transmission component

**Files:**
- Create: `src/components/Transmission.tsx`
- Test: `src/components/Transmission.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/Transmission.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Transmission } from './Transmission';

describe('Transmission', () => {
  it('shows the success state after submitting a valid email', async () => {
    render(<Transmission />);
    await userEvent.type(screen.getByLabelText('Email'), 'reader@dinnaga.ai');
    await userEvent.click(screen.getByRole('button', { name: 'Subscribe' }));
    expect(screen.getByText(/TRANSMISSION ACCEPTED/)).toBeInTheDocument();
  });

  it('does not advance when the email has no @', async () => {
    render(<Transmission />);
    await userEvent.type(screen.getByLabelText('Email'), 'not-an-email');
    await userEvent.click(screen.getByRole('button', { name: 'Subscribe' }));
    expect(screen.queryByText(/TRANSMISSION ACCEPTED/)).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `bun run test src/components/Transmission.test.tsx`
Expected: FAIL — cannot resolve `./Transmission`.

- [ ] **Step 3: Create `src/components/Transmission.tsx`**

```tsx
// ABOUTME: Transmission signup — mono email field plus primary CTA.
// ABOUTME: Local-only success state; there is no backend, the UI is honest about it.
import { useState, type FormEvent } from 'react';

export function Transmission() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.includes('@')) return;
    setSent(true);
  };

  return (
    <section className="transmission" id="education" data-screen-label="Transmission">
      <div className="tx-inner">
        <span className="section-eye">// 06 · TRANSMISSION</span>
        <h2 className="tx-title">Stay on the wire.</h2>
        <p style={{ color: 'var(--fg-3)', margin: 0, fontFamily: 'var(--font-body)', fontSize: 16 }}>
          One transmission a month — new papers, workshop dates, field notes. You can leave any
          time.
        </p>
        {!sent ? (
          <form className="tx-form" onSubmit={onSubmit}>
            <input
              className="input"
              type="email"
              placeholder="you@somewhere.ai"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email"
            />
            <button className="btn btn-primary" type="submit">
              Subscribe
            </button>
          </form>
        ) : (
          <div className="tx-success">
            <span className="dot dot-live" />▸ TRANSMISSION ACCEPTED · CHECK YOUR INBOX
          </div>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `bun run test src/components/Transmission.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/Transmission.tsx src/components/Transmission.test.tsx
git commit -m "feat: add Transmission component"
```

---

## Task 14: Hero & Terminal components

**Files:**
- Create: `src/components/Hero.tsx`
- Test: `src/components/Hero.test.tsx`

Note: `Terminal` accepts an optional `bootLines` prop (defaulting to the imported
`BOOT_LINES`). This is a minimal testability seam, consistent with the content-driven
decision — tests pass a tiny boot sequence so they finish fast.

- [ ] **Step 1: Write the failing test**

Create `src/components/Hero.test.tsx`:

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Hero, Terminal } from './Hero';

describe('Hero', () => {
  it('renders the headline and both CTAs', () => {
    render(<Hero />);
    expect(screen.getByText('Research for the rest of us.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Read the paper' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Start a conversation' })).toBeInTheDocument();
  });
});

describe('Terminal', () => {
  it('reveals the prompt after boot and records a submitted question', async () => {
    render(<Terminal bootLines={[{ text: 'OK', delay: 30 }]} />);

    const input = await screen.findByLabelText('Ask Dinnaga a question', undefined, {
      timeout: 3000,
    });
    await userEvent.type(input, 'How do we start?');
    await userEvent.keyboard('{Enter}');

    expect(screen.getByText('> How do we start?')).toBeInTheDocument();
    expect(screen.getByText(/TRANSMISSION RECEIVED/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '[RESET]' })).toBeInTheDocument();
  });

  it('clears history when [RESET] is pressed', async () => {
    render(<Terminal bootLines={[{ text: 'OK', delay: 30 }]} />);
    const input = await screen.findByLabelText('Ask Dinnaga a question', undefined, {
      timeout: 3000,
    });
    await userEvent.type(input, 'ping{Enter}');
    await userEvent.click(screen.getByRole('button', { name: '[RESET]' }));
    await waitFor(() => expect(screen.queryByText('> ping')).not.toBeInTheDocument());
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `bun run test src/components/Hero.test.tsx`
Expected: FAIL — cannot resolve `./Hero`.

- [ ] **Step 3: Create `src/components/Hero.tsx`**

```tsx
// ABOUTME: Hero — 7/5 split: super-type headline + lede + CTAs, and a boot terminal.
// ABOUTME: The terminal types its boot sequence on mount then invites a question.
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useTyped } from '../hooks/useTyped';
import { BOOT_LINES } from '../data/bootLines';
import type { BootLine } from '../types';

interface HeroMedia {
  type: 'video' | 'image';
  src: string;
  poster?: string;
  alt?: string;
}

interface HeroProps {
  media?: HeroMedia;
}

export function Hero({ media }: HeroProps) {
  return (
    <section className="hero" id="top">
      <div>
        <span className="hero-eyebrow">// 01 · DINNAGA RESEARCH</span>
        <h1 className="hero-title">Research for the rest of us.</h1>
        <p className="hero-lede">
          We believe powerful AI is inevitable — and that the best possible outcome is to empower as
          many people as we can. We work in research, education, and consulting, and publish what we
          learn.
        </p>
        <div className="hero-ctas">
          <button className="btn btn-primary">Read the paper</button>
          <button className="btn btn-ghost">Start a conversation</button>
        </div>
      </div>
      <div className="hero-art">
        <Terminal media={media} />
      </div>
    </section>
  );
}

interface TerminalProps {
  media?: HeroMedia;
  bootLines?: BootLine[];
}

interface HistoryEntry {
  kind: 'in' | 'out';
  text: string;
}

export function Terminal({ media, bootLines = BOOT_LINES }: TerminalProps) {
  const { rendered, done } = useTyped(bootLines);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [sent, setSent] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (done && inputRef.current && !sent) inputRef.current.focus();
  }, [done, sent]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = input.trim();
    if (!q) return;
    setHistory((h) => [
      ...h,
      { kind: 'in', text: q },
      { kind: 'out', text: '▸ TRANSMISSION RECEIVED. AN OPERATOR WILL REPLY WITHIN 48H.' },
    ]);
    setInput('');
    setSent(true);
  };

  return (
    <div className="terminal" aria-label="Dinnaga terminal">
      {media && media.type === 'video' && (
        <video
          className="terminal-media"
          src={media.src}
          poster={media.poster}
          autoPlay
          muted
          loop
          playsInline
        />
      )}
      {media && media.type === 'image' && (
        <img className="terminal-media" src={media.src} alt={media.alt ?? ''} />
      )}

      <div className="terminal-chrome">
        <span className="terminal-chrome-tag">SIGNAL // 042</span>
        <span className="terminal-chrome-meta">DINNAGA-OS · ENCRYPTED · 18:42Z</span>
        <span className="terminal-chrome-dots" aria-hidden="true">
          <i></i>
          <i></i>
          <i></i>
        </span>
      </div>

      <div className="terminal-screen">
        <div className="terminal-curvature" aria-hidden="true" />
        <div className="terminal-scanlines" aria-hidden="true" />
        <div className="terminal-flicker" aria-hidden="true" />

        <div className="terminal-body">
          {rendered.map((t, i) => (
            <div className="t-line" key={i}>
              {t || ' '}
            </div>
          ))}

          {history.map((h, i) => (
            <div className={'t-line ' + (h.kind === 'in' ? 't-in' : 't-out')} key={'h' + i}>
              {h.kind === 'in' ? '> ' + h.text : h.text}
            </div>
          ))}

          {done && !sent && (
            <form className="t-prompt" onSubmit={onSubmit}>
              <span className="t-caret">&gt;</span>
              <input
                ref={inputRef}
                className="t-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="ASK A QUESTION_"
                spellCheck={false}
                autoComplete="off"
                aria-label="Ask Dinnaga a question"
              />
              <span className="t-cursor" aria-hidden="true">
                ▮
              </span>
            </form>
          )}

          {done && sent && (
            <div className="t-prompt is-done">
              <span className="t-caret">&gt;</span>
              <span style={{ color: 'var(--signal)' }}>
                NEW TRANSMISSION CLOSED. AWAITING REPLY.
              </span>
              <button
                type="button"
                className="t-reset"
                onClick={() => {
                  setSent(false);
                  setHistory([]);
                }}
              >
                [RESET]
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="terminal-foot">
        <span>
          <span className="dot dot-live" /> UPLINK STABLE
        </span>
        <span>PING 42ms</span>
        <span>FIDELITY 87%</span>
        <span>OP · DINNAGA</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `bun run test src/components/Hero.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/Hero.tsx src/components/Hero.test.tsx
git commit -m "feat: add Hero and Terminal components"
```

---

## Task 15: SiteFooter component & Home assembly

**Files:**
- Create: `src/components/SiteFooter.tsx`, `src/routes/Home/Home.tsx`
- Test: `src/components/SiteFooter.test.tsx`, `src/routes/Home/Home.test.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Write the failing tests**

Create `src/components/SiteFooter.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SiteFooter } from './SiteFooter';

describe('SiteFooter', () => {
  it('renders the three link columns and the brand block', () => {
    const { container } = render(<SiteFooter />);
    expect(container.querySelectorAll('.foot-col')).toHaveLength(3);
    expect(screen.getByText('© 2026 DINNAGA RESEARCH')).toBeInTheDocument();
  });
});
```

Create `src/routes/Home/Home.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Home } from './Home';

describe('Home', () => {
  it('renders the full long-scroll homepage', () => {
    const { container } = render(<Home />);
    expect(screen.getByText('Research for the rest of us.')).toBeInTheDocument();
    expect(screen.getByText('Three quiet practices.')).toBeInTheDocument();
    expect(screen.getByText("What we've been writing.")).toBeInTheDocument();
    expect(container.querySelector('.crt-overlay')).not.toBeNull();
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `bun run test src/components/SiteFooter.test.tsx src/routes/Home/Home.test.tsx`
Expected: FAIL — cannot resolve `./SiteFooter` / `./Home`.

- [ ] **Step 3: Create `src/components/SiteFooter.tsx`**

The footer columns are a small structural array kept local to this component
(they are not in the `src/data/` content table from the spec).

```tsx
// ABOUTME: Site footer — brand block, three link columns, and bottom meta strip.
// ABOUTME: Footer column links are structural and kept local to this component.
import { BrandMark } from './BrandMark';

interface FooterColumn {
  title: string;
  links: string[];
}

const FOOTER_COLUMNS: FooterColumn[] = [
  { title: 'Research', links: ['Latest papers', 'Field notes', 'Open data', 'Methods'] },
  {
    title: 'Education',
    links: ['Foundations cohort', 'Advanced topics', 'Curriculum (CC-BY)', 'Scholarships'],
  },
  { title: 'Studio', links: ['About', 'Consulting brief', 'Press', 'Contact'] },
];

export function SiteFooter() {
  return (
    <footer className="foot" id="consulting">
      <div className="foot-inner">
        <div className="foot-brand">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <BrandMark size={28} />
            <span className="word">DINNAGA</span>
          </div>
          <p>
            Research, education, and consulting toward the broadest possible adoption of useful AI.
            Independent, distributed, mostly outdoors.
          </p>
        </div>
        {FOOTER_COLUMNS.map((c) => (
          <nav className="foot-col" key={c.title} aria-label={c.title}>
            <h4>{c.title}</h4>
            {c.links.map((l) => (
              <a key={l} href="#">
                {l}
              </a>
            ))}
          </nav>
        ))}
      </div>
      <div className="foot-meta">
        <span>© 2026 DINNAGA RESEARCH</span>
        <span>// CC-BY 4.0 EXCEPT WHERE NOTED</span>
        <span>LAST TRANSMISSION 2026-04-16 · 18:42Z</span>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Create `src/routes/Home/Home.tsx`**

```tsx
// ABOUTME: Homepage route — composes the long-scroll dinnaga.ai homepage.
// ABOUTME: Owns the smooth-scroll nav handler shared by SiteNav.
import { CookieBanner } from '../../components/CookieBanner';
import { SiteNav } from '../../components/SiteNav';
import { Hero } from '../../components/Hero';
import { Ticker } from '../../components/Ticker';
import { Practices } from '../../components/Practices';
import { FieldNotes } from '../../components/FieldNotes';
import { DataPanel } from '../../components/DataPanel';
import { AsciiArt } from '../../components/AsciiArt';
import { CautionDivider } from '../../components/CautionDivider';
import { Transmission } from '../../components/Transmission';
import { SiteFooter } from '../../components/SiteFooter';
import { TICKER_ITEMS } from '../../data/tickerItems';

export function Home() {
  const handleNav = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.offsetTop - 70, behavior: 'smooth' });
    }
  };

  return (
    <div className="site" data-screen-label="Dinnaga homepage">
      <CookieBanner />
      <SiteNav onNav={handleNav} />
      <Hero />
      <Ticker items={TICKER_ITEMS} />
      <Practices />
      <FieldNotes />
      <DataPanel />
      <AsciiArt />
      <CautionDivider />
      <Transmission />
      <SiteFooter />
      <div className="crt-overlay" aria-hidden="true" />
    </div>
  );
}
```

- [ ] **Step 5: Replace `src/App.tsx`**

```tsx
// ABOUTME: Root application component. Renders the homepage route today.
// ABOUTME: Router-ready: wrap in a router and add routes/ siblings later.
import { Home } from './routes/Home/Home';

export function App() {
  return <Home />;
}
```

- [ ] **Step 6: Run the tests to verify they pass**

Run: `bun run test src/components/SiteFooter.test.tsx src/routes/Home/Home.test.tsx`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/components/SiteFooter.tsx src/components/SiteFooter.test.tsx src/routes src/App.tsx
git commit -m "feat: add SiteFooter and assemble the homepage route"
```

---

## Task 16: Playwright end-to-end tests

**Files:**
- Create: `playwright.config.ts`, `tests/e2e/homepage.spec.ts`

- [ ] **Step 1: Create `playwright.config.ts`**

```ts
// ABOUTME: Playwright config — runs e2e specs against the Vite dev server.
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4242',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'bun run dev',
    url: 'http://localhost:4242',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
```

- [ ] **Step 2: Write the e2e spec**

Create `tests/e2e/homepage.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

test('renders every homepage section', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Research for the rest of us.' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Three quiet practices.' })).toBeVisible();
  await expect(page.getByRole('heading', { name: "What we've been writing." })).toBeVisible();
  await expect(page.getByText('© 2026 DINNAGA RESEARCH')).toBeVisible();
});

test('dismisses the cookie banner', async ({ page }) => {
  await page.goto('/');
  const banner = page.locator('.cookie');
  await expect(banner).not.toHaveClass(/is-dismissed/);
  await page.getByRole('button', { name: 'Accept' }).click();
  await expect(banner).toHaveClass(/is-dismissed/);
});

test('filters field notes with the RESEARCH chip', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.note')).toHaveCount(4);
  await page.getByRole('button', { name: 'RESEARCH', exact: true }).click();
  await expect(page.locator('.note')).toHaveCount(2);
});

test('removes the travelling green square after the mount animation', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.green-square')).toHaveCount(0, { timeout: 3000 });
});
```

- [ ] **Step 3: Run the e2e suite**

Run: `bun run test:e2e`
Expected: PASS — 4 tests green. Playwright starts the dev server on port 4242 automatically.

- [ ] **Step 4: Commit**

```bash
git add playwright.config.ts tests/e2e
git commit -m "test: add playwright e2e homepage suite"
```

---

## Task 17: Final verification

**Files:** none (verification only)

- [ ] **Step 1: Run the full unit/integration suite**

Run: `bun run test`
Expected: PASS — every `*.test.ts(x)` file green, output pristine (no errors/warnings).

- [ ] **Step 2: Run the e2e suite**

Run: `bun run test:e2e`
Expected: PASS — 4 tests green.

- [ ] **Step 3: Run the linter**

Run: `bun run lint`
Expected: PASS — no errors.

- [ ] **Step 4: Run the production build**

Run: `bun run build`
Expected: PASS — `tsc --noEmit` clean, `vite build` writes `dist/` with bundled JS, CSS, and fonts.

- [ ] **Step 5: Smoke-test the built site**

Run: `bun run preview` then open `http://localhost:4243`.
Expected: the full homepage renders — nav clip-reveal + green square fire once, terminal types its boot sequence, ticker scrolls, practice cards expand on click, field-note filter chips work, cookie banner dismisses.

- [ ] **Step 6: Final commit (if any verification fixes were needed)**

```bash
git add -A
git commit -m "chore: final verification fixes for dinnaga homepage"
```

If steps 1–5 all passed with no changes, skip this commit.

---

## Self-Review Notes

**Spec coverage** — every spec section maps to tasks: tooling (T1), DS vendoring + font-url patch (T2), repo structure (T1/T2/T15), types (T3), data layer (T4), 12 components (T6–T15), signature motions (preserved in T9 nav square, T14 terminal/useTyped, CTA blink via vendored CSS), data flow / error handling (typed data + strict TS in T3/T4, guards preserved in T5/T13/T14), all three test tiers (unit T4/T5, integration T6–T15, e2e T16).

**Font licensing** — captured fonts ship as-is per the approved spec; the pre-launch swap is tracked in the spec's Risks section, not this plan.

**Type consistency** — `Practice` (type) vs `PracticeCard` (component) disambiguation is called out in T10; `Category | 'ALL'` filter type is consistent between T3, T4, and T11; `BootLine` is consistent across T3, T4, T5, T14.
