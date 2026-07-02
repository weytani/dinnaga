# Cyberware Harness Loadout (`/loadout`) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the `/loadout` ripperdoc bench on dinnaga.ai — megazord zords rendered as cyberware implants with real measured gauges, a pure friction engine over real isolation masks, and shareable build URLs — plus the megazord-side `export-json` tooling that feeds it.

**Architecture:** Two repos. `~/code/megazord` (canonical) gains a curated `components/cyberware-overlay.toml` and a `bin/megazord export-json` subcommand that merges manifests + overlay + measured context costs into `zords.json`. `~/code/dinnaga` vendors that snapshot at `src/data/zords.json` and builds the page from pure libs (`friction.ts`, `buildcode.ts`) + five components + one route. State lives entirely in the URL.

**Tech Stack:** megazord: Python 3 stdlib (tomllib) + uv/pytest for tests. dinnaga: Bun, Vite 8, React 19, react-router-dom 7, TypeScript strict, Vitest 4 + RTL, Playwright, plain global CSS.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-07-01-cyberware-loadout-design.md`. Honesty stance §3: every displayed stat is labeled `measured` / `rated` / `derived` / `reproduced`; nothing fabricated.
- **Do not touch the landing page** (Home/Atisha/Method/Colophon components or their CSS). All new styles live in `src/styles/loadout.css`, every class prefixed `lo-`, page wrapped in `.lo-page`. Only sanctioned shared-file edits: `main.tsx` (one CSS import), `colors_and_type.css` (tier tokens only), `App.tsx` (one route), `navLinks.ts` (one entry), `types.ts` (additions), `data.test.ts` (pin update), `tests/e2e/routing.spec.ts` (ROUTES row).
- Every `src/**/*.ts(x)` file starts with two `// ABOUTME:` comment lines. Named function exports only (no default exports). Props typed via a local `interface XxxProps`. Prettier: single quotes, semi, 100 cols, trailing commas.
- TDD: write the failing test first, watch it fail, implement, watch it pass. Test files sit NEXT to source. Pristine output (no console noise, no skipped tests).
- No mocks of app functionality (RTL/vitest test doubles for clipboard/matchMedia are test tooling, allowed).
- dinnaga work on branch `cyberware-loadout` (already checked out, clean). megazord work on `master` (repo convention: features land on master). Conventional commits, imperative present. **Never push** — David reviews locally. NEVER `--no-verify`.
- dinnaga commands: `bun run test`, `bun run lint`, `bun run build` (includes `tsc --noEmit`), `bun run test:e2e`. megazord tests: `uv run pytest -q` from `~/code/megazord`.
- `bin/megazord` stays **stdlib-only** (tomllib requires Python ≥ 3.11 — verified in Task 1). Do NOT modify the existing 5-key parser, `cmd_list`/`cmd_status`/`cmd_regen`, or their output.
- Source control: use `git` (neither repo is jj-colocated — verify with `jj root` once; on error use git).
- Reduced motion: every animation gated behind `@media (prefers-reduced-motion: no-preference)` or the existing `useTyped` short-circuit.

## Spec deviations (flag to David in the final report)

1. Overlay is **TOML not YAML** (spec §4.1): `bin/megazord` is deliberately stdlib-only; PyYAML would be its first dependency, `tomllib` is stdlib and supports comments.
2. Build-code separator is **`_` not `.`** (spec §10): slot ids contain dots (`L2.5`), making a dot-joined grammar ambiguous. Format: `?b=L1genome_L2.5gauntlet_L3funes`.
3. `context_cost_tokens` is **`ceil(chars/4)`**, labeled as an estimate in `costBasis` and in the UI tooltip — a deterministic measurement of real payload text, honestly labeled (no tokenizer dependency).
4. Each zord carries a **`stats[]` array** beyond the single spec headline — David explicitly asked for paper metrics as implant stats. New provenance kind `reproduced` joins `measured`/`rated`/`derived`.
5. `runstate.audit` is a declared **shared sink** (`sharedSinks`) excluded from contamination math — ~7 zords write it by design; counting it would fabricate drift. Documented in the data and the UI footer.
6. **Cyberpsychosis triggers on over-capacity OR maxed drift** (spec §3 maps over-capacity→cyberpsychosis; §8 says drift only). The real registry is coherent, so drift alone rarely maxes; over-budget is reachable and true to CP2077.
7. Manufacturer for genome = **Kiroshi** per §5's mapping (the §4.3 example said Zetatech, contradicting §5).
8. Resolved conflicts ride the URL as **`r=`** so shared links restore resolution state.
9. **ripcord is not shown** — the registry incumbent for 2606.05414 is doomgoblin (13 registered manifests exactly). doomgoblin carries `requires_calibration = true` in the overlay (same per-deployment predictor heads).
10. genome stays **Rare** (status-derived). A commented `tier_override = "epic"` sits in the overlay for David to flip (§6 says it's his call).

## Data contract — `zords.json` (camelCase, generated by megazord, vendored into the site)

```jsonc
{
  "generated": "2026-07-01",
  "costBasis": "estimated tokens = ceil(chars/4) over the manifest text + flavor + headline",
  "capacity": { "contextBudgetTokens": 8000, "driftMax": 5 },
  "sharedSinks": ["runstate.audit"],
  "slots": [{ "id": "L1", "system": "Kiroshi Optics", "layer": "L1-trajectory-telemetry", "single": true }],
  "zords": [{
    "name": "genome", "code": "GNM", "slot": "L1", "layer": "L1-trajectory-telemetry",
    "hookPoints": ["post-tool-use"], "manufacturer": "Kiroshi", "tier": "rare",
    "method": ["event-driven-harness", "critic-verifier-layer"],
    "improves": ["agent-reliability", "token-efficiency"],
    "isolation": { "reads": ["runstate.tool_events"], "writes": ["runstate.trajectory", "runstate.interventions", "runstate.audit"] },
    "contextCostTokens": 780, "tests": 148, "faithful": "FAITHFUL 28/28",
    "headline": "Governor fires on P-X-P, E→V deficit, X→X spirals — 0 LLM calls in the hot path",
    "stats": [{ "label": "HOT-PATH LLM CALLS", "value": "0", "provenance": "measured" }],
    "flavor": "Reads the run's DNA and nudges before the agent spirals.",
    "paper": "2606.15579", "requiresCalibration": false
  }],
  "conflicts": [{ "a": "funes", "b": "hler", "kind": "pre-commit-visibility", "why": "…", "resolution": "…" }],
  "stacks": [{ "members": ["genome", "hler"], "on": "agent-reliability", "name": "Reliability Spine" }]
}
```

Slot→zord truth (from the 13 registered manifests): L0 — empty (Pi deferred) · L1 — genome, doomgoblin · L2 — openskill · L2.5 — gauntlet · L2.7 — yeetriever · L3 — funes, gravedigger, thonktank · L4 — hler · DIAG (multi) — blamethrower, gumshoe, skidmark-leak, skidmark-traj.

---

### Task 1: megazord test harness + full manifest parser

**Files:**
- Create: `~/code/megazord/pyproject.toml` (via uv)
- Create: `~/code/megazord/tests/test_parser.py`
- Modify: `~/code/megazord/bin/megazord` (append new functions; do not touch existing ones)

**Interfaces:**
- Produces: `parse_manifest_full(path) -> dict` — all frontmatter keys incl. nested `isolation` (`{"reads": [...], "writes": [...]}`), list-or-scalar `hook_point`, `interface: |` block scalars, plus `"_text"` (full file text). `slot_for_layer(layer: str) -> str`. `TIER_FOR_STATUS: dict`. Task 2 consumes all three.

- [ ] **Step 1: Preflight + harness**

```bash
cd ~/code/megazord
python3 -c "import tomllib; print('tomllib OK')"   # must print tomllib OK (Py>=3.11); if it fails STOP and report
uv init --bare
uv add --dev pytest
mkdir -p tests
```

- [ ] **Step 2: Write the failing tests** — `tests/test_parser.py`:

```python
# ABOUTME: Tests for bin/megazord's full manifest parser (export-json support).
# ABOUTME: Parses the real component manifests — no fixtures, real data only.
import importlib.machinery
import importlib.util
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent


def load_cli():
    loader = importlib.machinery.SourceFileLoader("megazord_cli", str(ROOT / "bin" / "megazord"))
    spec = importlib.util.spec_from_loader("megazord_cli", loader)
    mod = importlib.util.module_from_spec(spec)
    loader.exec_module(mod)
    return mod


def test_parse_genome_full():
    cli = load_cli()
    d = cli.parse_manifest_full(ROOT / "components" / "genome.md")
    assert d["name"] == "genome"
    assert d["paper"] == "2606.15579"
    assert d["hook_point"] == "post-tool-use"
    assert d["isolation"] == {
        "reads": ["runstate.tool_events"],
        "writes": ["runstate.trajectory", "runstate.interventions", "runstate.audit"],
    }
    assert d["status"] == "built"
    assert "_text" in d and d["_text"].startswith("---")


def test_parse_list_hook_point_and_block_interface():
    cli = load_cli()
    doom = cli.parse_manifest_full(ROOT / "components" / "doomgoblin.md")
    assert doom["hook_point"] == ["post-turn", "pre-continue"]
    yeet = cli.parse_manifest_full(ROOT / "components" / "yeetriever.md")
    assert isinstance(yeet["interface"], str) and len(yeet["interface"]) > 0
    assert yeet["retriever_backend"] == "pluggable"


def test_all_13_manifests_parse_with_isolation():
    cli = load_cli()
    files = sorted((ROOT / "components").glob("*.md"))
    parsed = [cli.parse_manifest_full(p) for p in files]
    named = [d for d in parsed if d.get("name")]
    assert len(named) == 13
    for d in named:
        assert d["isolation"]["reads"], d["name"]
        assert d["isolation"]["writes"], d["name"]
        assert d["layer"] and d["status"] == "built"


def test_slot_for_layer():
    cli = load_cli()
    assert cli.slot_for_layer("L1-trajectory-telemetry") == "L1"
    assert cli.slot_for_layer("L1-L4-failure-alerting") == "L1"
    assert cli.slot_for_layer("L2-tools-skills") == "L2"
    assert cli.slot_for_layer("L2.5-skill-lifecycle-gating") == "L2.5"
    assert cli.slot_for_layer("L2.7-retriever-steered-workspace") == "L2.7"
    assert cli.slot_for_layer("L3-context-memory") == "L3"
    assert cli.slot_for_layer("L4-governance-gate") == "L4"
    assert cli.slot_for_layer("L-eval-fidelity") == "DIAG"
    assert cli.slot_for_layer("L-posthoc-trace-diagnosis") == "DIAG"


def test_tier_for_status():
    cli = load_cli()
    assert cli.TIER_FOR_STATUS == {
        "planned": "common",
        "queued": "uncommon",
        "built": "rare",
        "verified": "epic",
        "active": "legendary",
    }
```

- [ ] **Step 3: Run to verify failure**

Run: `uv run pytest -q`
Expected: FAIL — `AttributeError: module 'megazord_cli' has no attribute 'parse_manifest_full'`

- [ ] **Step 4: Implement** — append to `bin/megazord` (below the existing functions, above `main()`):

```python
# ---- full parser for export-json (list/status/regen keep the 5-key parser above) ----

TIER_FOR_STATUS = {
    "planned": "common",
    "queued": "uncommon",
    "built": "rare",
    "verified": "epic",
    "active": "legendary",
}

_SLOT_PREFIXES = ("L2.5", "L2.7", "L0", "L1", "L2", "L3", "L4")


def slot_for_layer(layer):
    for prefix in _SLOT_PREFIXES:
        if layer == prefix or layer.startswith(prefix + "-"):
            return prefix
    return "DIAG"


def _strip_comment(v):
    return re.sub(r"\s+#.*$", "", v.strip()).strip()


def _parse_value(v):
    if v.startswith("[") and v.endswith("]"):
        inner = v[1:-1].strip()
        return [s.strip() for s in inner.split(",")] if inner else []
    return v


def parse_manifest_full(path):
    text = path.read_text()
    m = re.search(r"^---\n(.*?)\n---", text, re.S)
    if not m:
        return {}
    lines = m.group(1).split("\n")
    data = {"_text": text}
    i = 0
    while i < len(lines):
        line = lines[i]
        if not line.strip() or line.lstrip().startswith("#") or line.startswith(" "):
            i += 1
            continue
        k, _, v = line.partition(":")
        k, v = k.strip(), _strip_comment(v)
        if v == "|":
            block = []
            i += 1
            while i < len(lines) and (lines[i].startswith("  ") or not lines[i].strip()):
                block.append(lines[i].strip())
                i += 1
            data[k] = "\n".join(block).strip()
            continue
        if v == "":
            sub = {}
            i += 1
            while i < len(lines) and lines[i].startswith("  "):
                sk, _, sv = lines[i].partition(":")
                sub[sk.strip()] = _parse_value(_strip_comment(sv))
                i += 1
            data[k] = sub
            continue
        data[k] = _parse_value(v)
        i += 1
    return data
```

- [ ] **Step 5: Run to verify pass**

Run: `uv run pytest -q` → all pass. Also regression-check the untouched commands: `bin/megazord status` prints `megazord registry: 13 zords — built:13` header as before.

- [ ] **Step 6: Commit**

```bash
cd ~/code/megazord && git add pyproject.toml uv.lock tests/test_parser.py bin/megazord .gitignore
git commit -m "feat(cli): full manifest parser + first test harness (uv/pytest) for export-json"
```
(If `uv init` added sample files like `main.py`, delete them before committing. Add `.venv/` to `.gitignore` if not covered.)

---

### Task 2: cyberware overlay + `export-json` subcommand

**Files:**
- Create: `~/code/megazord/components/cyberware-overlay.toml`
- Create: `~/code/megazord/tests/test_export.py`
- Modify: `~/code/megazord/bin/megazord` (add `cmd_export_json`, register in dispatch dict)
- Modify: `~/code/megazord/README.md` (document export + manual sync step)

**Interfaces:**
- Consumes: `parse_manifest_full`, `slot_for_layer`, `TIER_FOR_STATUS` (Task 1).
- Produces: `bin/megazord export-json [--out PATH]` — emits the exact Data Contract JSON above (camelCase). Task 3 runs it; Task 4 types it.

- [ ] **Step 1: Write the overlay** — `components/cyberware-overlay.toml`, complete content:

```toml
# ABOUTME: Cyberware flavor overlay for the /loadout page exporter (bin/megazord export-json).
# ABOUTME: Presentation-only — manifests stay canonical; nothing here changes harness semantics.
# Provenance vocabulary: measured (a real count of a real artifact), reproduced (a result
# our sealed reproduction produced), rated (ordinal editorial), derived (computed downstream).

[config]
context_budget_tokens = 8000
drift_max = 5
shared_sinks = ["runstate.audit"]   # append-only audit channel, written by design by most zords
cost_basis = "estimated tokens = ceil(chars/4) over the manifest text + flavor + headline"

[[slots]]
id = "L0"
system = "Operating System"
layer = "L0-model-adapter"
single = true

[[slots]]
id = "L1"
system = "Kiroshi Optics"
layer = "L1-trajectory-telemetry"
single = true

[[slots]]
id = "L2"
system = "Dynalar Limbs"
layer = "L2-tools-skills"
single = true

[[slots]]
id = "L2.5"
system = "Dynalar Limbs"
layer = "L2.5-skill-lifecycle-gating"
single = true

[[slots]]
id = "L2.7"
system = "Dynalar Limbs"
layer = "L2.7-retriever-steered-workspace"
single = true

[[slots]]
id = "L3"
system = "Frontal Cortex"
layer = "L3-context-memory"
single = true

[[slots]]
id = "L4"
system = "Immune System"
layer = "L4-governance-gate"
single = true

[[slots]]
id = "DIAG"
system = "Subdermal / Diagnostics"
layer = "L-eval-fidelity|L-posthoc-trace-diagnosis"
single = false

[zords.genome]
code = "GNM"
manufacturer = "Kiroshi"
flavor = "Reads the run's DNA and nudges before the agent spirals."
headline = "Governor fires on P-X-P, E→V deficit, X→X spirals — 0 LLM calls in the hot path"
tests = 148
faithful = "FAITHFUL 28/28"
stats = [
  { label = "HOT-PATH LLM CALLS", value = "0", provenance = "measured" },
  { label = "SELF-TUNING THRESHOLD", value = "χ² 3.841 @ α=.05", provenance = "reproduced" },
  { label = "FAILURE SIGNATURES", value = "P-X-P · E→V · X→X", provenance = "reproduced" },
]
# tier_override = "epic"   # David's call — the efficacy-verification milestone (spec §6)

[zords.doomgoblin]
code = "DGB"
slot = "L1"                    # layer is cross-cutting L1-L4; benches as Kiroshi Optics
manufacturer = "Kiroshi"
requires_calibration = true    # predictor heads train per-deployment from trajectory labels
flavor = "Screams before the crash, not after. Tune α to pick how jumpy."
headline = "One α-conditioned policy sweeps 11 accuracy–earliness operating points — no retraining"
tests = 120
faithful = "GATES A–D PASS"
stats = [
  { label = "OPERATING POINTS", value = "11 from one policy", provenance = "reproduced" },
  { label = "FUSION GAIN", value = "+7.7% HV vs naive", provenance = "reproduced" },
  { label = "α-MONOTONE", value = "ρ = 1.000", provenance = "reproduced" },
]

[zords.openskill]
code = "OSK"
manufacturer = "Dynalar"
flavor = "Grows new skills mid-run, then makes them prove themselves."
headline = "Live isolation run 44/44 PASS — self-authored skills land ground-truth-exact"
tests = 262
faithful = "FAITHFUL"
stats = [
  { label = "LIVE ISOLATION RUN", value = "44/44 PASS", provenance = "measured" },
  { label = "GROUND-TRUTH ANCHORS", value = "5/5 exact", provenance = "measured" },
  { label = "SKILLS AUTHORED LIVE", value = "3 evo-* SKILL.md", provenance = "measured" },
]

[zords.gauntlet]
code = "GNT"
manufacturer = "Dynalar"
flavor = "Every skill runs the gauntlet before it touches production."
headline = "Skill regressions 0.821 → 0.000 once every skill has to earn its promotion"
tests = 210
faithful = "FAITHFUL"
stats = [
  { label = "SKILL REGRESSIONS", value = "0.821 → 0.000", provenance = "reproduced" },
  { label = "PROMOTION BOUNDARY", value = "Wilson-UCB n* = 25", provenance = "reproduced" },
  { label = "DEMO DETERMINISM", value = "16/16 byte-identical", provenance = "measured" },
]

[zords.yeetriever]
code = "YTR"
manufacturer = "Dynalar"
flavor = "Fetch. Good dog. Pulls exactly the docs you point at — nothing you don't."
headline = "Dynamic pull() beats single-shot retrieval 1.000 vs 0.580 — with a smaller workspace"
tests = 98
faithful = "GAPS-FOUND (documented)"
stats = [
  { label = "VS SINGLE-SHOT", value = "1.000 vs 0.580", provenance = "reproduced" },
  { label = "WORKSPACE SIZE", value = "61.4 docs < 84.1", provenance = "reproduced" },
  { label = "SCALE COLLAPSE", value = "flat 1.000 @ n=800 (raw: 0.100)", provenance = "reproduced" },
]

[zords.funes]
code = "FNS"
manufacturer = "Zetatech"
flavor = "Remembers what was worth remembering. Forgets the rest on a power law."
headline = "Learned memory value holds 0.800 recall where blind heuristics collapse to 0.125"
tests = 148
faithful = "FAITHFUL"
stats = [
  { label = "CONFOUND RETENTION", value = "1.00 vs uniform 0.575", provenance = "reproduced" },
  { label = "BLIND RECALL", value = "0.800 (collapse: 0.125)", provenance = "reproduced" },
  { label = "VALUE MODEL", value = "7-factor learned V(m)", provenance = "reproduced" },
]

[zords.gravedigger]
code = "GRV"
manufacturer = "Zetatech"
flavor = "Digs up exactly the memory you need. Leaves the rest buried — that's the point."
headline = "Lean retrieved context beats full history 0.88 vs 0.65 — less is literally more"
tests = 159
faithful = "FAITHFUL"
stats = [
  { label = "LEAN VS FULL HISTORY", value = "0.88 vs 0.65 (+0.22)", provenance = "reproduced" },
  { label = "RECENCY RESOLUTION", value = "1.00 vs 0.38", provenance = "reproduced" },
  { label = "WRITE PATH", value = "< 50 ms · 0 LLM", provenance = "measured" },
]

[zords.thonktank]
code = "THK"
manufacturer = "Zetatech"
flavor = "The crew's shared brain. Knows who solved this before you asked."
headline = "Crew success 0.465 → 0.827 and 6.5 fewer steps on a shared transactive memory"
tests = 232
faithful = "FAITHFUL"
stats = [
  { label = "SUCCESS RATE", value = "0.465 → 0.827", provenance = "reproduced" },
  { label = "STEPS TO SOLVE", value = "20.0 → 13.5", provenance = "reproduced" },
  { label = "RERANKER", value = "44-feature LTR cascade", provenance = "reproduced" },
]

[zords.hler]
code = "HLR"
manufacturer = "Arasaka"
flavor = "The immune system says no. That's its job."
headline = "Critical failures 72% → 16% behind human decision gates (synthetic bench, p=6.7e-16)"
tests = 172
faithful = "FAITHFUL"
stats = [
  { label = "CRITICAL FAILURES", value = "72% → 16% (synthetic bench)", provenance = "reproduced" },
  { label = "FISHER EXACT", value = "p = 6.7e-16", provenance = "reproduced" },
  { label = "ATTENTION LAW", value = "Eq.5 allocation reproduced", provenance = "reproduced" },
]

[zords.blamethrower]
code = "BLM"
manufacturer = "Netwatch"
flavor = "When the evals drift, it knows whether to blame the judge or the machine."
headline = "False alarms 0.80 → 0.00 with anytime-valid e-processes — and it knows WHO drifted"
tests = 198
faithful = "FAITHFUL"
stats = [
  { label = "FALSE ALARMS", value = "0.80 → 0.00", provenance = "reproduced" },
  { label = "BLAME SPILL", value = "0.00 matched · 0.95 starved", provenance = "reproduced" },
  { label = "GUARANTEE", value = "anytime-valid e-process", provenance = "reproduced" },
]

[zords.gumshoe]
code = "GMS"
manufacturer = "Kiroshi"
flavor = "The coroner. Arrives after the crash, leaves with the decisive fault."
headline = "Attribution precision holds ~1.000 while the windowed baseline collapses to 0.000"
tests = 154
faithful = "GAPS-FOUND (documented)"
stats = [
  { label = "ATTRIBUTION PRECISION", value = "~1.000 flat (baseline → 0.000)", provenance = "reproduced" },
  { label = "STM-ABLATION LIFT", value = "1.000 @ tight budget", provenance = "reproduced" },
  { label = "HONEST LOSS KEPT", value = "0.590 < RAFFLES 0.615", provenance = "reproduced" },
]

[zords.skidmark-traj]
code = "SKT"
manufacturer = "Netwatch"
flavor = "Reads the skid marks to tell how you drove — backtracks, stalls, dead ends."
headline = "Five canonical failure trajectories reproduced value-exact from the skid marks alone"
tests = 209
faithful = "FAITHFUL"
stats = [
  { label = "CANONICAL D(t) SHAPES", value = "5/5 value-exact", provenance = "reproduced" },
  { label = "BACKTRACK DETECTION", value = "ΔD +0.9167 flagged", provenance = "reproduced" },
  { label = "ANTI-DRIFT PROBE", value = "∆AUC +0.281 → FAIL", provenance = "measured" },
]

[zords.skidmark-leak]
code = "SKL"
manufacturer = "Netwatch"
flavor = "Checks whether the benchmark answers were in the glovebox the whole time."
headline = "Caught +6.87 pt of benchmark inflation hiding in the git history"
tests = 209
faithful = "FAITHFUL"
stats = [
  { label = "PASS@1 INFLATION CAUGHT", value = "+6.87 pt (57.45 → 50.58)", provenance = "reproduced" },
  { label = "DIRECT LEAKAGE", value = "5.33%", provenance = "reproduced" },
  { label = "LEAK SIGNATURES", value = "4 gap-vs-leak classes", provenance = "reproduced" },
]

# ---- registered conflicts (HIERARCHY.md conflict register, verbatim semantics) ----

[[conflicts]]
a = "funes"
b = "hler"
kind = "pre-commit-visibility"
why = "global memory visibility guts the gate's pre-commit teeth"
resolution = "isolation mask — funes writes only its runstate.memory slice; the gate's pre-commit reads are quarantined from it"

# ---- named stacks (HIERARCHY stacks + manifest-declared cross-layer seams) ----

[[stacks]]
members = ["genome", "hler"]
on = "agent-reliability"
name = "Reliability Spine"

[[stacks]]
members = ["doomgoblin", "gumshoe", "genome"]
on = "agent-reliability"
name = "Diagnose-Govern Loop"

[[stacks]]
members = ["skidmark-traj", "skidmark-leak", "blamethrower"]
on = "eval-fidelity"
name = "Measurement Integrity Family"

[[stacks]]
members = ["yeetriever", "gravedigger"]
on = "retrieval-accuracy"
name = "Deep Archive Rig"

[[stacks]]
members = ["openskill", "gauntlet"]
on = "skill-acquisition"
name = "Skill Foundry"

[[stacks]]
members = ["genome", "gravedigger", "yeetriever"]
on = "token-efficiency"
name = "Token Diet"
```

- [ ] **Step 2: Write the failing tests** — `tests/test_export.py`:

```python
# ABOUTME: Tests for bin/megazord export-json — overlay merge, cost measurement,
# ABOUTME: slot/tier derivation, and full-document shape over the real manifests.
import json
import pathlib
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
VALID_PROVENANCE = {"measured", "rated", "derived", "reproduced"}
VALID_TIERS = {"common", "uncommon", "rare", "epic", "legendary"}


def run_export(tmp_path):
    out = tmp_path / "zords.json"
    r = subprocess.run(
        [sys.executable, str(ROOT / "bin" / "megazord"), "export-json", "--out", str(out)],
        capture_output=True, text=True, check=True,
    )
    assert "13 zords" in r.stdout
    return json.loads(out.read_text())


def test_export_shape(tmp_path):
    doc = run_export(tmp_path)
    assert doc["capacity"] == {"contextBudgetTokens": 8000, "driftMax": 5}
    assert doc["sharedSinks"] == ["runstate.audit"]
    assert [s["id"] for s in doc["slots"]] == ["L0", "L1", "L2", "L2.5", "L2.7", "L3", "L4", "DIAG"]
    assert len(doc["zords"]) == 13


def test_every_zord_complete(tmp_path):
    doc = run_export(tmp_path)
    slot_ids = {s["id"] for s in doc["slots"]}
    codes = set()
    for z in doc["zords"]:
        assert z["slot"] in slot_ids, z["name"]
        assert z["tier"] in VALID_TIERS
        assert z["contextCostTokens"] > 0
        assert z["tests"] > 0 and z["headline"] and z["flavor"] and z["paper"]
        assert isinstance(z["hookPoints"], list) and z["hookPoints"]
        assert z["isolation"]["reads"] and z["isolation"]["writes"]
        assert 2 <= len(z["stats"]) <= 4
        for s in z["stats"]:
            assert s["provenance"] in VALID_PROVENANCE
        assert len(z["code"]) == 3 and z["code"] not in codes
        codes.add(z["code"])


def test_slot_assignments(tmp_path):
    doc = run_export(tmp_path)
    by_slot = {}
    for z in doc["zords"]:
        by_slot.setdefault(z["slot"], []).append(z["name"])
    assert sorted(by_slot["L1"]) == ["doomgoblin", "genome"]
    assert by_slot["L2"] == ["openskill"]
    assert by_slot["L2.5"] == ["gauntlet"]
    assert by_slot["L2.7"] == ["yeetriever"]
    assert sorted(by_slot["L3"]) == ["funes", "gravedigger", "thonktank"]
    assert by_slot["L4"] == ["hler"]
    assert sorted(by_slot["DIAG"]) == ["blamethrower", "gumshoe", "skidmark-leak", "skidmark-traj"]
    assert "L0" not in by_slot


def test_refs_resolve(tmp_path):
    doc = run_export(tmp_path)
    names = {z["name"] for z in doc["zords"]}
    for c in doc["conflicts"]:
        assert c["a"] in names and c["b"] in names and c["resolution"]
    for s in doc["stacks"]:
        assert set(s["members"]) <= names and s["on"] and s["name"]
    doom = next(z for z in doc["zords"] if z["name"] == "doomgoblin")
    assert doom["requiresCalibration"] is True
    genome = next(z for z in doc["zords"] if z["name"] == "genome")
    assert genome["requiresCalibration"] is False
    assert genome["tier"] == "rare"
```

- [ ] **Step 3: Run to verify failure** — `uv run pytest -q tests/test_export.py` → FAIL (export-json falls through to `cmd_status`, no `--out` written → `FileNotFoundError`/CalledProcessError).

- [ ] **Step 4: Implement `cmd_export_json`** — append to `bin/megazord` after Task 1's functions (add `import json, math, datetime, tomllib` at top of file with existing imports):

```python
def cmd_export_json(comps):
    argv = sys.argv[2:]
    out = pathlib.Path(argv[argv.index("--out") + 1]) if "--out" in argv else None
    overlay = tomllib.loads((COMP / "cyberware-overlay.toml").read_text())
    cfg = overlay["config"]
    manifests = {}
    for p in sorted(COMP.glob("*.md")):
        d = parse_manifest_full(p)
        if d.get("name"):
            manifests[d["name"]] = d
    missing = set(manifests) - set(overlay["zords"])
    extra = set(overlay["zords"]) - set(manifests)
    if missing or extra:
        print(f"cyberware-overlay out of sync — missing: {sorted(missing)} extra: {sorted(extra)}", file=sys.stderr)
        sys.exit(1)
    zords = []
    for name, d in sorted(manifests.items()):
        o = overlay["zords"][name]
        payload = d["_text"] + o["flavor"] + o["headline"]
        iso = d.get("isolation", {})
        hook = d.get("hook_point", [])
        zords.append({
            "name": name,
            "code": o["code"],
            "slot": o.get("slot") or slot_for_layer(d["layer"]),
            "layer": d["layer"],
            "hookPoints": hook if isinstance(hook, list) else [hook],
            "manufacturer": o["manufacturer"],
            "tier": o.get("tier_override") or TIER_FOR_STATUS[d["status"]],
            "method": d.get("method", []),
            "improves": d.get("improves", []),
            "isolation": {"reads": iso.get("reads", []), "writes": iso.get("writes", [])},
            "contextCostTokens": math.ceil(len(payload) / 4),
            "tests": o["tests"],
            "faithful": o["faithful"],
            "headline": o["headline"],
            "stats": o["stats"],
            "flavor": o["flavor"],
            "paper": str(d["paper"]),
            "requiresCalibration": o.get("requires_calibration", False),
        })
    slot_order = [s["id"] for s in overlay["slots"]]
    zords.sort(key=lambda z: (slot_order.index(z["slot"]), z["name"]))
    doc = {
        "generated": datetime.date.today().isoformat(),
        "costBasis": cfg["cost_basis"],
        "capacity": {"contextBudgetTokens": cfg["context_budget_tokens"], "driftMax": cfg["drift_max"]},
        "sharedSinks": cfg["shared_sinks"],
        "slots": [{"id": s["id"], "system": s["system"], "layer": s["layer"], "single": s["single"]} for s in overlay["slots"]],
        "zords": zords,
        "conflicts": overlay.get("conflicts", []),
        "stacks": overlay.get("stacks", []),
    }
    text = json.dumps(doc, indent=2, ensure_ascii=False) + "\n"
    if out:
        out.write_text(text)
        print(f"wrote {out} ({len(zords)} zords)")
    else:
        sys.stdout.write(text)
```

Register it in `main()`'s dispatch dict: `{"list": cmd_list, "status": cmd_status, "regen": cmd_regen, "export-json": cmd_export_json}`.

- [ ] **Step 5: Run to verify pass** — `uv run pytest -q` → all green. Regression: `bin/megazord status` unchanged.

- [ ] **Step 6: Document + commit** — add to `README.md` a `## export-json` section: what it emits, that `zords.json` is vendored into `~/code/dinnaga/src/data/zords.json`, and the manual sync command `bin/megazord export-json --out ~/code/dinnaga/src/data/zords.json` (site freshness is a human step, spec §4.2).

```bash
cd ~/code/megazord && git add components/cyberware-overlay.toml tests/test_export.py bin/megazord README.md
git commit -m "feat(cli): export-json — cyberware overlay merge for the dinnaga /loadout page"
```

---

### Task 3: generate + vendor the snapshot

**Files:**
- Create: `~/code/dinnaga/src/data/zords.json` (generated artifact)

- [ ] **Step 1:** `cd ~/code/megazord && bin/megazord export-json --out ~/code/dinnaga/src/data/zords.json`
Expected stdout: `wrote /Users/weytani/code/dinnaga/src/data/zords.json (13 zords)`
- [ ] **Step 2:** Sanity-read the file: 13 zords, funes/hler conflict present, six stacks, every `contextCostTokens` roughly 500–2000. Record the **actual total** of all 13 costs — if the full-equip sum (the 10 equippable at once: genome OR doomgoblin, openskill, gauntlet, yeetriever, one L3, hler, 4×DIAG) cannot exceed 8000, lower `context_budget_tokens` in the overlay so a maxed-out bench overflows (cyberpsychosis must be reachable; stay honest — pick a round number below the max-equip sum, e.g. 90% of it), re-export, and amend the Task 2 commit message rationale in a follow-up commit.
- [ ] **Step 3:** Commit on dinnaga: `git add src/data/zords.json && git commit -m "feat(loadout): vendor megazord zords.json snapshot (13 implants)"`

---

### Task 4: site types, data module, tier tokens

**Files:**
- Modify: `~/code/dinnaga/src/types.ts` (append loadout types)
- Modify: `~/code/dinnaga/tsconfig.json` (ensure `"resolveJsonModule": true` in compilerOptions; skip if present)
- Create: `~/code/dinnaga/src/data/zords.ts`
- Create: `~/code/dinnaga/src/data/zords.test.ts`
- Modify: `~/code/dinnaga/src/styles/colors_and_type.css` (tier tokens ONLY, appended inside `:root`)

**Interfaces:**
- Produces (consumed by every later task):

```ts
// types.ts additions
export type Tier = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type Provenance = 'measured' | 'rated' | 'derived' | 'reproduced';
export interface ZordStat { label: string; value: string; provenance: Provenance; }
export interface ZordIsolation { reads: string[]; writes: string[]; }
export interface Zord {
  name: string; code: string; slot: string; layer: string; hookPoints: string[];
  manufacturer: string; tier: Tier; method: string[]; improves: string[];
  isolation: ZordIsolation; contextCostTokens: number; tests: number; faithful: string;
  headline: string; stats: ZordStat[]; flavor: string; paper: string; requiresCalibration: boolean;
}
export interface Slot { id: string; system: string; layer: string; single: boolean; }
export interface ZordConflict { a: string; b: string; kind: string; why: string; resolution: string; }
export interface ZordStack { members: string[]; on: string; name: string; }
export interface Capacity { contextBudgetTokens: number; driftMax: number; }
export interface LoadoutEntry { slot: string; zord: string; }
export type Loadout = LoadoutEntry[];
export interface Synergy { a: string; b: string; on: string[]; stackName: string | null; }
export interface ConflictFinding { conflict: ZordConflict; resolved: boolean; }
export interface Hazard { reader: string; writer: string; slices: string[]; }
export interface FrictionReport {
  synergies: Synergy[]; conflicts: ConflictFinding[]; hazards: Hazard[];
  drift: number; contextLoad: number; overBudget: boolean; coverage: string[]; unstable: boolean;
}
```

- `zords.ts` exports: `ZORDS: Zord[]`, `SLOTS: Slot[]`, `CONFLICTS: ZordConflict[]`, `STACKS: ZordStack[]`, `CAPACITY: Capacity`, `SHARED_SINKS: string[]`, `COST_BASIS: string`, `GENERATED: string`, `zordByName(name: string): Zord | undefined`, `candidatesForSlot(slotId: string): Zord[]`.

- [ ] **Step 1: Failing schema test** — `src/data/zords.test.ts` (this is spec §13's data-shape guard; it runs against the real vendored JSON):

```ts
// ABOUTME: Schema-validation tests for the vendored megazord snapshot (zords.json).
// ABOUTME: Guards shape + internal consistency — slots, tiers, refs, provenance labels.
import { describe, expect, it } from 'vitest';
import { CAPACITY, CONFLICTS, SLOTS, STACKS, ZORDS, candidatesForSlot, zordByName } from './zords';

const TIERS = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
const PROVENANCE = ['measured', 'rated', 'derived', 'reproduced'];

describe('zords.json snapshot', () => {
  it('has 13 zords and 8 slots', () => {
    expect(ZORDS).toHaveLength(13);
    expect(SLOTS.map((s) => s.id)).toEqual(['L0', 'L1', 'L2', 'L2.5', 'L2.7', 'L3', 'L4', 'DIAG']);
  });

  it('every zord is internally valid', () => {
    const slotIds = new Set(SLOTS.map((s) => s.id));
    const codes = new Set<string>();
    for (const z of ZORDS) {
      expect(slotIds.has(z.slot), z.name).toBe(true);
      expect(TIERS).toContain(z.tier);
      expect(z.contextCostTokens).toBeGreaterThan(0);
      expect(z.tests).toBeGreaterThan(0);
      expect(z.isolation.reads.length).toBeGreaterThan(0);
      expect(z.isolation.writes.length).toBeGreaterThan(0);
      expect(z.stats.length).toBeGreaterThanOrEqual(2);
      for (const s of z.stats) expect(PROVENANCE).toContain(s.provenance);
      expect(z.code).toHaveLength(3);
      expect(codes.has(z.code)).toBe(false);
      codes.add(z.code);
    }
  });

  it('conflicts and stacks reference existing zords', () => {
    const names = new Set(ZORDS.map((z) => z.name));
    for (const c of CONFLICTS) {
      expect(names.has(c.a) && names.has(c.b)).toBe(true);
      expect(c.resolution.length).toBeGreaterThan(0);
    }
    for (const s of STACKS) for (const m of s.members) expect(names.has(m), m).toBe(true);
  });

  it('capacity is sane and the funes/hler conflict is registered', () => {
    expect(CAPACITY.contextBudgetTokens).toBeGreaterThan(0);
    expect(CAPACITY.driftMax).toBeGreaterThan(0);
    expect(CONFLICTS.some((c) => [c.a, c.b].sort().join('~') === 'funes~hler')).toBe(true);
  });

  it('lookup helpers work', () => {
    expect(zordByName('genome')?.slot).toBe('L1');
    expect(zordByName('nope')).toBeUndefined();
    expect(candidatesForSlot('L3').map((z) => z.name).sort()).toEqual(['funes', 'gravedigger', 'thonktank']);
    expect(candidatesForSlot('L0')).toHaveLength(0);
  });
});
```

- [ ] **Step 2:** `bun run test src/data/zords.test.ts` → FAIL (`./zords` missing).
- [ ] **Step 3: Implement.** Append the types block above to `src/types.ts`. Ensure tsconfig has `resolveJsonModule: true`. Create `src/data/zords.ts`:

```ts
// ABOUTME: Typed loader for the vendored megazord snapshot (zords.json) — regenerate with
// ABOUTME: `~/code/megazord/bin/megazord export-json --out src/data/zords.json` (manual sync).
import raw from './zords.json';
import type { Capacity, Slot, Zord, ZordConflict, ZordStack } from '../types';

interface ZordsDoc {
  generated: string;
  costBasis: string;
  capacity: Capacity;
  sharedSinks: string[];
  slots: Slot[];
  zords: Zord[];
  conflicts: ZordConflict[];
  stacks: ZordStack[];
}

const doc = raw as unknown as ZordsDoc;

export const GENERATED = doc.generated;
export const COST_BASIS = doc.costBasis;
export const CAPACITY = doc.capacity;
export const SHARED_SINKS = doc.sharedSinks;
export const SLOTS = doc.slots;
export const ZORDS = doc.zords;
export const CONFLICTS = doc.conflicts;
export const STACKS = doc.stacks;

export function zordByName(name: string): Zord | undefined {
  return ZORDS.find((z) => z.name === name);
}

export function candidatesForSlot(slotId: string): Zord[] {
  return ZORDS.filter((z) => z.slot === slotId);
}
```

Append tier tokens at the end of the `:root` block in `colors_and_type.css` (touch nothing else in the file):

```css
  /* Cyberware tier colors (loadout page) — CP2077 rarity conventions on our black */
  --tier-common: #9a9a9a;
  --tier-uncommon: #62d96b;
  --tier-rare: #41a6f6;
  --tier-epic: #b16cea;
  --tier-legendary: #ff8a1e;
```

- [ ] **Step 4:** `bun run test src/data/zords.test.ts` → PASS. `bun run build` → clean (proves resolveJsonModule + strict types line up with the real JSON).
- [ ] **Step 5: Commit** — `git add src/types.ts src/data/zords.ts src/data/zords.test.ts src/styles/colors_and_type.css tsconfig.json && git commit -m "feat(loadout): typed zords data module + schema guard + tier tokens"`

---

### Task 5: friction engine (pure, TDD)

**Files:**
- Create: `~/code/dinnaga/src/lib/friction.ts`
- Create: `~/code/dinnaga/src/lib/friction.test.ts`

**Interfaces:**
- Consumes: types (Task 4).
- Produces: `conflictKey(a: string, b: string): string` (sorted `a~b`); `interface FrictionInput { conflicts: ZordConflict[]; stacks: ZordStack[]; capacity: Capacity; sharedSinks: string[]; }`; `analyze(equipped: Zord[], input: FrictionInput, resolved: ReadonlySet<string>): FrictionReport`.

Semantics (spec §8 + deviations 5/6): pairwise write-overlap (minus sharedSinks) adds `|overlap|` contamination; unresolved registered conflict adds 2 (resolved adds 0 — that IS the RESOLVE feature); drift = clamp(contamination + 2·unresolved, 0, driftMax); hazards = read∩write (minus sinks) for pairs NOT sharing a registered stack; synergy = shared `improves` across different layers, named when a shared stack covers the shared axis; `contextLoad` = Σ costs; `overBudget` = load > budget; `unstable` = overBudget || drift ≥ driftMax; `coverage` = union of improves.

- [ ] **Step 1: Failing tests** — `src/lib/friction.test.ts`. Helper builds synthetic zords (test data, not mocks); plus two REAL-data cases at the bottom pin the actual registry behavior:

```ts
// ABOUTME: Unit tests for the friction engine — every rule from spec §8 plus the
// ABOUTME: shared-sink exemption, over-budget cyberpsychosis, and real-registry pins.
import { describe, expect, it } from 'vitest';
import type { Capacity, Zord } from '../types';
import { CAPACITY, CONFLICTS, SHARED_SINKS, STACKS, ZORDS, zordByName } from '../data/zords';
import { analyze, conflictKey, type FrictionInput } from './friction';

const cap: Capacity = { contextBudgetTokens: 1000, driftMax: 5 };

function zord(name: string, over: Partial<Zord> = {}): Zord {
  return {
    name, code: 'ZZZ', slot: 'L1', layer: `${name}-layer`, hookPoints: ['x'],
    manufacturer: 'Test', tier: 'rare', method: [], improves: [],
    isolation: { reads: [], writes: [] }, contextCostTokens: 100, tests: 1,
    faithful: 'FAITHFUL', headline: 'h', stats: [], flavor: 'f', paper: '0000.00000',
    requiresCalibration: false, ...over,
  };
}

function input(over: Partial<FrictionInput> = {}): FrictionInput {
  return { conflicts: [], stacks: [], capacity: cap, sharedSinks: ['runstate.audit'], ...over };
}

describe('conflictKey', () => {
  it('is order-independent', () => {
    expect(conflictKey('hler', 'funes')).toBe('funes~hler');
    expect(conflictKey('funes', 'hler')).toBe('funes~hler');
  });
});

describe('analyze', () => {
  it('empty loadout → zeroed stable report', () => {
    const r = analyze([], input(), new Set());
    expect(r).toEqual({
      synergies: [], conflicts: [], hazards: [], drift: 0, contextLoad: 0,
      overBudget: false, coverage: [], unstable: false,
    });
  });

  it('write overlap adds contamination; shared sinks exempt', () => {
    const a = zord('a', { isolation: { reads: [], writes: ['runstate.x', 'runstate.audit'] } });
    const b = zord('b', { isolation: { reads: [], writes: ['runstate.x', 'runstate.audit'] } });
    const r = analyze([a, b], input(), new Set());
    expect(r.drift).toBe(1); // runstate.x only — audit exempt
  });

  it('unresolved registered conflict adds 2; resolving zeroes it', () => {
    const c = { a: 'a', b: 'b', kind: 'k', why: 'w', resolution: 'r' };
    const zs = [zord('a'), zord('b')];
    expect(analyze(zs, input({ conflicts: [c] }), new Set()).drift).toBe(2);
    expect(analyze(zs, input({ conflicts: [c] }), new Set()).conflicts[0]?.resolved).toBe(false);
    const resolved = analyze(zs, input({ conflicts: [c] }), new Set([conflictKey('a', 'b')]));
    expect(resolved.drift).toBe(0);
    expect(resolved.conflicts[0]?.resolved).toBe(true);
  });

  it('drift clamps at driftMax and flips unstable', () => {
    const writes = ['w1', 'w2', 'w3', 'w4', 'w5', 'w6'];
    const a = zord('a', { isolation: { reads: [], writes } });
    const b = zord('b', { isolation: { reads: [], writes } });
    const r = analyze([a, b], input(), new Set());
    expect(r.drift).toBe(5);
    expect(r.unstable).toBe(true);
  });

  it('read-after-write hazard unless pair shares a stack', () => {
    const w = zord('writer', { isolation: { reads: [], writes: ['runstate.t'] } });
    const rd = zord('reader', { isolation: { reads: ['runstate.t'], writes: [] } });
    const bare = analyze([rd, w], input(), new Set());
    expect(bare.hazards).toEqual([{ reader: 'reader', writer: 'writer', slices: ['runstate.t'] }]);
    const stacked = analyze([rd, w], input({ stacks: [{ members: ['reader', 'writer'], on: 'x', name: 'S' }] }), new Set());
    expect(stacked.hazards).toEqual([]);
  });

  it('synergy on shared improves across layers; named via matching stack', () => {
    const a = zord('a', { layer: 'LA', improves: ['agent-reliability'] });
    const b = zord('b', { layer: 'LB', improves: ['agent-reliability', 'other'] });
    const r = analyze([a, b], input({ stacks: [{ members: ['a', 'b'], on: 'agent-reliability', name: 'Spine' }] }), new Set());
    expect(r.synergies).toEqual([{ a: 'a', b: 'b', on: ['agent-reliability'], stackName: 'Spine' }]);
    const sameLayer = analyze([a, zord('c', { layer: 'LA', improves: ['agent-reliability'] })], input(), new Set());
    expect(sameLayer.synergies).toEqual([]);
  });

  it('context load sums costs; over budget flips unstable (cyberpsychosis by over-capacity)', () => {
    const a = zord('a', { contextCostTokens: 600 });
    const b = zord('b', { contextCostTokens: 600 });
    const r = analyze([a, b], input(), new Set());
    expect(r.contextLoad).toBe(1200);
    expect(r.overBudget).toBe(true);
    expect(r.unstable).toBe(true);
    expect(r.drift).toBe(0);
  });

  it('coverage is the union of improves', () => {
    const r = analyze(
      [zord('a', { improves: ['x', 'y'] }), zord('b', { layer: 'LB', improves: ['y', 'z'] })],
      input(), new Set(),
    );
    expect(r.coverage.sort()).toEqual(['x', 'y', 'z']);
  });
});

describe('real registry pins', () => {
  const realInput: FrictionInput = { conflicts: CONFLICTS, stacks: STACKS, capacity: CAPACITY, sharedSinks: SHARED_SINKS };

  it('genome + funes + hler → funes⟷hler conflict, drift 2, Reliability Spine synergy', () => {
    const zs = ['genome', 'funes', 'hler'].map((n) => zordByName(n)!);
    const r = analyze(zs, realInput, new Set());
    expect(r.conflicts).toHaveLength(1);
    expect(r.drift).toBe(2);
    expect(r.synergies.some((s) => s.stackName === 'Reliability Spine')).toBe(true);
    expect(analyze(zs, realInput, new Set([conflictKey('funes', 'hler')])).drift).toBe(0);
  });

  it('yeetriever + gravedigger is a sanctioned seam (no hazard, named synergy)', () => {
    const zs = ['yeetriever', 'gravedigger'].map((n) => zordByName(n)!);
    const r = analyze(zs, realInput, new Set());
    expect(r.hazards).toEqual([]);
    expect(r.synergies.some((s) => s.stackName === 'Deep Archive Rig')).toBe(true);
  });

  it('max legal loadout overflows the context budget (cyberpsychosis reachable)', () => {
    const max = ['genome', 'openskill', 'gauntlet', 'yeetriever', 'thonktank', 'hler',
      'blamethrower', 'gumshoe', 'skidmark-leak', 'skidmark-traj'].map((n) => zordByName(n)!);
    const r = analyze(max, realInput, new Set());
    expect(r.overBudget).toBe(true);
    expect(r.unstable).toBe(true);
  });

  it('full registry coverage spans every improves axis', () => {
    const r = analyze([...ZORDS], realInput, new Set());
    expect(r.coverage).toContain('agent-reliability');
    expect(r.coverage).toContain('eval-fidelity');
    expect(r.coverage.length).toBeGreaterThanOrEqual(8);
  });
});
```

(If the "max legal loadout overflows" pin fails because real costs are too small, that's the Task 3 Step 2 budget calibration — fix the overlay budget, re-export, re-vendor; do NOT weaken the test.)

- [ ] **Step 2:** `bun run test src/lib/friction.test.ts` → FAIL (module missing).
- [ ] **Step 3: Implement** — `src/lib/friction.ts`:

```ts
// ABOUTME: Pure friction engine for the /loadout bench — synergies, conflicts, hazards,
// ABOUTME: drift, and context load computed from the real isolation masks in zords.json.
import type {
  Capacity, ConflictFinding, FrictionReport, Hazard, Synergy, Zord, ZordConflict, ZordStack,
} from '../types';

export interface FrictionInput {
  conflicts: ZordConflict[];
  stacks: ZordStack[];
  capacity: Capacity;
  sharedSinks: string[];
}

export function conflictKey(a: string, b: string): string {
  return [a, b].sort().join('~');
}

function intersect(a: string[], b: string[], exempt: string[]): string[] {
  const inB = new Set(b);
  const skip = new Set(exempt);
  return a.filter((s) => inB.has(s) && !skip.has(s));
}

function commonStack(a: string, b: string, stacks: ZordStack[]): ZordStack | undefined {
  return stacks.find((s) => s.members.includes(a) && s.members.includes(b));
}

export function analyze(
  equipped: Zord[],
  input: FrictionInput,
  resolved: ReadonlySet<string>,
): FrictionReport {
  const synergies: Synergy[] = [];
  const conflicts: ConflictFinding[] = [];
  const hazards: Hazard[] = [];
  let contamination = 0;

  for (let i = 0; i < equipped.length; i++) {
    for (let j = i + 1; j < equipped.length; j++) {
      const a = equipped[i];
      const b = equipped[j];
      if (!a || !b) continue;

      contamination += intersect(a.isolation.writes, b.isolation.writes, input.sharedSinks).length;

      const reg = input.conflicts.find((c) => conflictKey(c.a, c.b) === conflictKey(a.name, b.name));
      if (reg) conflicts.push({ conflict: reg, resolved: resolved.has(conflictKey(reg.a, reg.b)) });

      const stack = commonStack(a.name, b.name, input.stacks);
      if (!stack) {
        const ab = intersect(a.isolation.reads, b.isolation.writes, input.sharedSinks);
        if (ab.length > 0) hazards.push({ reader: a.name, writer: b.name, slices: ab });
        const ba = intersect(b.isolation.reads, a.isolation.writes, input.sharedSinks);
        if (ba.length > 0) hazards.push({ reader: b.name, writer: a.name, slices: ba });
      }

      const shared = a.improves.filter((t) => b.improves.includes(t));
      if (shared.length > 0 && a.layer !== b.layer) {
        synergies.push({
          a: a.name,
          b: b.name,
          on: shared,
          stackName: stack && shared.includes(stack.on) ? stack.name : null,
        });
      }
    }
  }

  const unresolvedCount = conflicts.filter((c) => !c.resolved).length;
  const drift = Math.max(0, Math.min(input.capacity.driftMax, contamination + 2 * unresolvedCount));
  const contextLoad = equipped.reduce((sum, z) => sum + z.contextCostTokens, 0);
  const overBudget = contextLoad > input.capacity.contextBudgetTokens;
  const coverage = [...new Set(equipped.flatMap((z) => z.improves))];

  return {
    synergies,
    conflicts,
    hazards,
    drift,
    contextLoad,
    overBudget,
    coverage,
    unstable: overBudget || drift >= input.capacity.driftMax,
  };
}
```

- [ ] **Step 4:** `bun run test src/lib/friction.test.ts` → PASS. Then `bun run test` (whole suite) → PASS.
- [ ] **Step 5: Commit** — `git commit -m "feat(loadout): pure friction engine over real isolation masks"` (add both files).

---

### Task 6: build-code codec (pure, TDD)

**Files:**
- Create: `~/code/dinnaga/src/lib/buildcode.ts`
- Create: `~/code/dinnaga/src/lib/buildcode.test.ts`

**Interfaces:**
- Consumes: types (Task 4); `zords.ts` only inside tests.
- Produces: `encode(loadout: Loadout): string` · `decode(param: string, zords: Zord[], slots: Slot[]): { loadout: Loadout; warnings: string[] }` · `shortCode(loadout: Loadout, zords: Zord[]): string` · `autoName(loadout: Loadout, zords: Zord[], stacks: ZordStack[]): string` · `encodeResolved(keys: ReadonlySet<string>): string` · `decodeResolved(param: string | null, conflicts: ZordConflict[]): Set<string>`.

URL grammar (deviation 2): `b` = `_`-joined `<slotId><zordName>` parts, canonical slot order `L0,L1,L2,L2.5,L2.7,L3,L4,DIAG`; `r` = `_`-joined sorted conflict keys (`funes~hler`). Decode drops (with a warning string per part): unparseable parts, unknown slot/zord, zord in the wrong slot, duplicate zord, second zord in a `single` slot. `~` and `.` and `_` are URL-safe in query values.

- [ ] **Step 1: Failing tests** — `src/lib/buildcode.test.ts`:

```ts
// ABOUTME: Round-trip and edge-case tests for the /loadout URL build codec,
// ABOUTME: display short code, and auto-naming (stack match → axis fallback).
import { describe, expect, it } from 'vitest';
import { CONFLICTS, SLOTS, STACKS, ZORDS } from '../data/zords';
import { autoName, decode, decodeResolved, encode, encodeResolved, shortCode } from './buildcode';

const L = (slot: string, zord: string) => ({ slot, zord });

describe('encode/decode', () => {
  it('round-trips a mixed build canonically', () => {
    const loadout = [L('L3', 'funes'), L('L1', 'genome'), L('L4', 'hler')];
    const param = encode(loadout);
    expect(param).toBe('L1genome_L3funes_L4hler');
    expect(decode(param, ZORDS, SLOTS).loadout).toEqual([
      L('L1', 'genome'), L('L3', 'funes'), L('L4', 'hler'),
    ]);
  });

  it('handles dotted slot ids and multi-DIAG', () => {
    const loadout = [L('L2.5', 'gauntlet'), L('DIAG', 'gumshoe'), L('DIAG', 'blamethrower')];
    const { loadout: back, warnings } = decode(encode(loadout), ZORDS, SLOTS);
    expect(warnings).toEqual([]);
    expect(back).toHaveLength(3);
    expect(back.filter((e) => e.slot === 'DIAG')).toHaveLength(2);
  });

  it('empty param → empty loadout, no warnings', () => {
    expect(decode('', ZORDS, SLOTS)).toEqual({ loadout: [], warnings: [] });
  });

  it('drops garbage, wrong-slot, unknown, and dupes with warnings', () => {
    const { loadout, warnings } = decode(
      'L1genome_XXjunk_L1funes_L3funes_L3funes_L4nope_L3gravedigger',
      ZORDS, SLOTS,
    );
    expect(loadout).toEqual([L('L1', 'genome'), L('L3', 'funes')]);
    // XXjunk unparseable · L1funes wrong slot · dupe funes · L4nope unknown · gravedigger second-in-single
    expect(warnings).toHaveLength(5);
  });
});

describe('shortCode', () => {
  it('joins overlay codes with middots', () => {
    expect(shortCode([L('L1', 'genome'), L('L3', 'funes'), L('L4', 'hler')], ZORDS)).toBe('GNM·FNS·HLR');
    expect(shortCode([], ZORDS)).toBe('—');
  });
});

describe('autoName', () => {
  it('UNPOWERED when empty', () => {
    expect(autoName([], ZORDS, STACKS)).toBe('UNPOWERED');
  });

  it('prefers a fully-equipped named stack (largest wins)', () => {
    expect(autoName([L('L1', 'genome'), L('L4', 'hler')], ZORDS, STACKS)).toBe('The Reliability Spine');
  });

  it('falls back to the dominant improves axis', () => {
    expect(autoName([L('L3', 'funes')], ZORDS, STACKS)).toBe('Long Memory Rig');
  });
});

describe('resolved keys', () => {
  it('round-trips and filters to real conflicts', () => {
    const keys = new Set(['funes~hler']);
    expect(encodeResolved(keys)).toBe('funes~hler');
    expect(decodeResolved('funes~hler_bogus~pair', CONFLICTS)).toEqual(new Set(['funes~hler']));
    expect(decodeResolved(null, CONFLICTS)).toEqual(new Set());
  });
});
```

- [ ] **Step 2:** `bun run test src/lib/buildcode.test.ts` → FAIL.
- [ ] **Step 3: Implement** — `src/lib/buildcode.ts`:

```ts
// ABOUTME: Build-code codec for /loadout — URL param encode/decode, display short code,
// ABOUTME: and auto-naming from a matched stack or the dominant benefit axis.
import type { Loadout, LoadoutEntry, Slot, Zord, ZordConflict, ZordStack } from '../types';
import { conflictKey } from './friction';

const SLOT_ORDER = ['L0', 'L1', 'L2', 'L2.5', 'L2.7', 'L3', 'L4', 'DIAG'];
const PART_RE = /^(DIAG|L[0-9.]+)(.+)$/;

const AXIS_NAMES: Record<string, string> = {
  'agent-reliability': 'Reliability Rig',
  'token-efficiency': 'Lean Context Rig',
  'eval-fidelity': 'Honest Gauge Rig',
  'retrieval-accuracy': 'Total Recall Rig',
  'memory-retention': 'Long Memory Rig',
  'skill-acquisition': 'Autodidact Rig',
  'multi-agent-coordination': 'Hive Mind Rig',
  'hallucination-reduction': 'Reality Anchor Rig',
  'long-context': 'Deep Field Rig',
  'calibration': 'True Needle Rig',
  'generalization': 'Polymath Rig',
};

function sorted(loadout: Loadout): Loadout {
  return [...loadout].sort(
    (x, y) => SLOT_ORDER.indexOf(x.slot) - SLOT_ORDER.indexOf(y.slot) || x.zord.localeCompare(y.zord),
  );
}

export function encode(loadout: Loadout): string {
  return sorted(loadout)
    .map((e) => `${e.slot}${e.zord}`)
    .join('_');
}

export interface DecodeResult {
  loadout: Loadout;
  warnings: string[];
}

export function decode(param: string, zords: Zord[], slots: Slot[]): DecodeResult {
  const loadout: LoadoutEntry[] = [];
  const warnings: string[] = [];
  for (const part of param.split('_')) {
    if (!part) continue;
    const m = PART_RE.exec(part);
    const slot = m ? slots.find((s) => s.id === m[1]) : undefined;
    const zord = m ? zords.find((z) => z.name === m[2]) : undefined;
    if (!slot || !zord || zord.slot !== slot.id) {
      warnings.push(part);
      continue;
    }
    const dupe =
      loadout.some((e) => e.zord === zord.name) ||
      (slot.single && loadout.some((e) => e.slot === slot.id));
    if (dupe) {
      warnings.push(part);
      continue;
    }
    loadout.push({ slot: slot.id, zord: zord.name });
  }
  return { loadout: sorted(loadout), warnings };
}

export function shortCode(loadout: Loadout, zords: Zord[]): string {
  if (loadout.length === 0) return '—';
  return sorted(loadout)
    .map((e) => zords.find((z) => z.name === e.zord)?.code ?? '???')
    .join('·');
}

export function autoName(loadout: Loadout, zords: Zord[], stacks: ZordStack[]): string {
  if (loadout.length === 0) return 'UNPOWERED';
  const names = new Set(loadout.map((e) => e.zord));
  const full = stacks
    .filter((s) => s.members.every((m) => names.has(m)))
    .sort((a, b) => b.members.length - a.members.length)[0];
  if (full) return `The ${full.name}`;
  const counts = new Map<string, number>();
  for (const e of loadout) {
    for (const axis of zords.find((z) => z.name === e.zord)?.improves ?? []) {
      counts.set(axis, (counts.get(axis) ?? 0) + 1);
    }
  }
  let best: string | undefined;
  let bestCount = 0;
  for (const [axis, n] of counts) {
    if (n > bestCount) {
      best = axis;
      bestCount = n;
    }
  }
  return best ? (AXIS_NAMES[best] ?? `${best} rig`) : 'CUSTOM RIG';
}

export function encodeResolved(keys: ReadonlySet<string>): string {
  return [...keys].sort().join('_');
}

export function decodeResolved(param: string | null, conflicts: ZordConflict[]): Set<string> {
  const valid = new Set(conflicts.map((c) => conflictKey(c.a, c.b)));
  const out = new Set<string>();
  for (const part of (param ?? '').split('_')) {
    if (part && valid.has(part)) out.add(part);
  }
  return out;
}
```

- [ ] **Step 4:** `bun run test src/lib/buildcode.test.ts` → PASS (note: `funes` improves `memory-retention` only → 'Long Memory Rig' pin holds). Full `bun run test` → PASS.
- [ ] **Step 5: Commit** — `git commit -m "feat(loadout): build-code codec — URL state, short code, auto-naming"`.

---

### Task 7: loadout stylesheet (complete class contract)

**Files:**
- Create: `~/code/dinnaga/src/styles/loadout.css`
- Modify: `~/code/dinnaga/src/main.tsx` (add `import './styles/loadout.css';` after the existing three CSS imports)

**Design language ("Gurney Chrome" — distinct from the landing page, same universe):** surgical-cyan bench chrome (`--cw-accent`), arterial red for conflict/cyberpsychosis (`--cw-hot`), CP2077 tier colors from Task 4 tokens. Chamfered corners via clip-path (notched top-right), segmented relay-click gauges, Sevastopol terminal face for HUD readouts, KH Interference only in the compromised state. NO landing signal-green on this page except focus rings (site-global). Every class `lo-`-prefixed; everything scoped under `.lo-page`. `src/styles` is eslint/prettier-ignored — hand-format consistently with the other CSS files.

This file is the **complete class contract** for Tasks 8–13 — implement it in full now; Task 15 may refine values (not names). Complete content:

```css
/* ABOUTME: /loadout ripperdoc bench — page-scoped styles ("Gurney Chrome").
   ABOUTME: Surgical cyan + arterial red + tier tokens; all classes lo- prefixed. */

/* ---------- page accents (loadout-only; landing keeps signal green) ---------- */
.lo-page {
  --cw-accent: #58f0dc;
  --cw-accent-dim: #2a8f84;
  --cw-accent-glow: rgba(88, 240, 220, 0.30);
  --cw-hot: #ff2e55;
  --cw-hot-glow: rgba(255, 46, 85, 0.35);
  --cw-panel: #0a0d0e;
  --cw-seam: rgba(88, 240, 220, 0.16);
  --lo-notch: 10px;
  padding-bottom: var(--sp-12);
}

.lo-notched {
  clip-path: polygon(0 0, calc(100% - var(--lo-notch)) 0, 100% var(--lo-notch), 100% 100%, 0 100%);
}

/* ---------- boot overlay ---------- */
.lo-boot {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: grid;
  place-items: center;
  background: rgba(0, 0, 0, 0.92);
  cursor: pointer;
}

.lo-boot-panel {
  width: min(680px, 92vw);
  border: 1px solid var(--cw-seam);
  background: var(--cw-panel);
  padding: var(--sp-6);
}

.lo-boot-line {
  font-family: var(--font-terminal);
  font-size: var(--t-detail);
  letter-spacing: var(--ls-mono);
  line-height: var(--lh-mono);
  color: var(--cw-accent);
  white-space: pre-wrap;
  min-height: 1.4em;
}

.lo-boot-skip {
  margin-top: var(--sp-4);
  font-family: var(--font-mono);
  font-size: var(--t-detail-sm);
  letter-spacing: var(--ls-label);
  color: var(--fg-4);
  text-transform: uppercase;
}

/* ---------- HUD ---------- */
.lo-hud {
  position: sticky;
  top: var(--nav-h);
  z-index: 40;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--sp-4) var(--sp-6);
  padding: var(--sp-3) var(--sp-4);
  margin-bottom: var(--sp-6);
  border: 1px solid var(--cw-seam);
  background: color-mix(in srgb, var(--cw-panel) 88%, transparent);
  backdrop-filter: blur(6px);
}

.lo-hud-title {
  font-family: var(--font-mono);
  font-size: var(--t-detail-sm);
  letter-spacing: var(--ls-eyebrow);
  color: var(--cw-accent);
  text-transform: uppercase;
  white-space: nowrap;
}

.lo-hud--compromised {
  border-color: var(--cw-hot);
  box-shadow: 0 0 18px var(--cw-hot-glow);
}

.lo-hud--compromised .lo-hud-title {
  font-family: var(--font-decorative);
  color: var(--cw-hot);
}

.lo-gauge {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  font-family: var(--font-terminal);
  font-size: var(--t-detail-sm);
  color: var(--fg-2);
  font-variant-numeric: tabular-nums;
}

.lo-gauge-label {
  font-family: var(--font-mono);
  font-size: var(--t-detail-sm);
  letter-spacing: var(--ls-label);
  color: var(--fg-4);
  text-transform: uppercase;
}

.lo-gauge-track {
  display: flex;
  gap: 3px;
}

.lo-gauge-seg {
  width: 12px;
  height: 10px;
  background: var(--bg-2);
  border: 1px solid var(--seam);
}

.lo-gauge-seg--filled {
  background: var(--cw-accent);
  border-color: var(--cw-accent-dim);
  box-shadow: 0 0 6px var(--cw-accent-glow);
}

.lo-gauge-seg--warn {
  background: var(--warn);
  border-color: var(--warn);
  box-shadow: none;
}

.lo-gauge-seg--over {
  background: var(--cw-hot);
  border-color: var(--cw-hot);
  box-shadow: 0 0 6px var(--cw-hot-glow);
}

.lo-hud-counts {
  display: flex;
  gap: var(--sp-4);
  font-family: var(--font-mono);
  font-size: var(--t-detail-sm);
  letter-spacing: var(--ls-mono);
  color: var(--fg-3);
}

.lo-hud-counts .is-hot { color: var(--cw-hot); }
.lo-hud-counts .is-cool { color: var(--cw-accent); }
.lo-hud-counts .is-warn { color: var(--warn); }

.lo-build-line {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--sp-3);
  margin-left: auto;
  font-family: var(--font-terminal);
  font-size: var(--t-detail);
  color: var(--fg-2);
}

.lo-build-name { color: var(--cw-accent); }

.lo-stamp {
  font-family: var(--font-mono);
  font-size: var(--t-detail-sm);
  letter-spacing: var(--ls-label);
  color: var(--cw-hot);
  border: 1px solid var(--cw-hot);
  padding: 1px var(--sp-2);
  text-transform: uppercase;
}

.lo-hud-btn {
  font-family: var(--font-mono);
  font-size: var(--t-detail-sm);
  letter-spacing: var(--ls-label);
  text-transform: uppercase;
  color: var(--cw-accent);
  background: transparent;
  border: 1px solid var(--cw-accent-dim);
  padding: var(--sp-1) var(--sp-3);
  cursor: pointer;
}

.lo-hud-btn:hover {
  background: var(--cw-accent);
  color: var(--bg-1);
}

/* ---------- bench grid ---------- */
.lo-bench {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: var(--sp-6);
  align-items: start;
}

/* ---------- body nav (left rail) ---------- */
.lo-nav {
  border: 1px solid var(--cw-seam);
  background: var(--cw-panel);
  padding: var(--sp-4);
  position: sticky;
  top: calc(var(--nav-h) + 78px);
}

.lo-fig {
  display: block;
  margin: 0 auto var(--sp-4);
  width: 120px;
}

.lo-fig-region {
  fill: var(--bg-2);
  stroke: var(--seam-strong);
  stroke-width: 1;
  transition: fill var(--dur-base) var(--ease-out);
}

.lo-fig-region--lit {
  fill: var(--cw-accent-dim);
  stroke: var(--cw-accent);
}

.lo-nav-group {
  margin-bottom: var(--sp-4);
}

.lo-nav-system {
  font-family: var(--font-mono);
  font-size: var(--t-detail-sm);
  letter-spacing: var(--ls-eyebrow);
  color: var(--fg-4);
  text-transform: uppercase;
  margin-bottom: var(--sp-2);
}

.lo-nav-slot {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-2);
  padding: var(--sp-2) var(--sp-3);
  background: transparent;
  border: 1px solid transparent;
  border-left: 2px solid var(--seam);
  color: var(--fg-3);
  font-family: var(--font-terminal);
  font-size: var(--t-detail);
  text-align: left;
  cursor: pointer;
}

.lo-nav-slot:hover { color: var(--fg-1); border-left-color: var(--cw-accent-dim); }

.lo-nav-slot--selected {
  border-color: var(--cw-seam);
  border-left: 2px solid var(--cw-accent);
  color: var(--fg-1);
  background: rgba(88, 240, 220, 0.05);
}

.lo-nav-slot--filled .lo-nav-mark { color: var(--cw-accent); }

.lo-nav-mark { font-family: var(--font-mono); }

.lo-nav-occupant {
  color: var(--fg-4);
  font-size: var(--t-detail-sm);
  text-transform: uppercase;
}

/* ---------- tray (center-right) ---------- */
.lo-tray-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--sp-4);
  margin-bottom: var(--sp-4);
}

.lo-tray-title {
  font-family: var(--font-display);
  font-size: var(--t-h3);
  line-height: var(--lh-heading3);
  letter-spacing: var(--ls-display);
  text-transform: uppercase;
  color: var(--fg-1);
}

.lo-tray-rule {
  font-family: var(--font-mono);
  font-size: var(--t-detail-sm);
  letter-spacing: var(--ls-label);
  color: var(--fg-4);
  text-transform: uppercase;
}

.lo-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: var(--sp-4);
  margin-bottom: var(--sp-6);
}

/* ---------- implant card ---------- */
.lo-card {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  text-align: left;
  padding: var(--sp-4);
  background: var(--cw-panel);
  border: 1px solid var(--tier, var(--seam-strong));
  color: var(--fg-2);
  cursor: pointer;
  clip-path: polygon(0 0, calc(100% - var(--lo-notch)) 0, 100% var(--lo-notch), 100% 100%, 0 100%);
}

.lo-card:hover {
  box-shadow: 0 0 14px color-mix(in srgb, var(--tier, var(--cw-accent)) 35%, transparent);
  transform: translateY(-2px);
}

.lo-tier-common { --tier: var(--tier-common); }
.lo-tier-uncommon { --tier: var(--tier-uncommon); }
.lo-tier-rare { --tier: var(--tier-rare); }
.lo-tier-epic { --tier: var(--tier-epic); }
.lo-tier-legendary { --tier: var(--tier-legendary); }

.lo-card-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: var(--sp-2);
}

.lo-card-name {
  font-family: var(--font-display-alt);
  font-size: var(--t-body-hi);
  letter-spacing: var(--ls-tight);
  text-transform: uppercase;
  color: var(--fg-1);
}

.lo-card-equipped {
  font-family: var(--font-mono);
  font-size: var(--t-detail-sm);
  letter-spacing: var(--ls-label);
  color: var(--cw-accent);
}

.lo-card-tier {
  font-family: var(--font-mono);
  font-size: var(--t-detail-sm);
  letter-spacing: var(--ls-label);
  color: var(--tier, var(--fg-3));
  text-transform: uppercase;
}

.lo-card-meta {
  font-family: var(--font-mono);
  font-size: var(--t-detail-sm);
  letter-spacing: var(--ls-mono);
  color: var(--fg-4);
  text-transform: uppercase;
}

.lo-card-headline {
  font-family: var(--font-body);
  font-size: var(--t-detail);
  line-height: var(--lh-body);
  color: var(--fg-3);
}

/* ---------- modal ---------- */
.lo-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 70;
  background: rgba(0, 0, 0, 0.8);
  display: grid;
  place-items: center;
  padding: var(--sp-4);
}

.lo-modal {
  width: min(560px, 94vw);
  max-height: 86vh;
  overflow-y: auto;
  background: var(--cw-panel);
  border: 1px solid var(--tier, var(--seam-strong));
  padding: var(--sp-6);
  clip-path: polygon(0 0, calc(100% - var(--lo-notch)) 0, 100% var(--lo-notch), 100% 100%, 0 100%);
}

.lo-modal-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: var(--sp-3);
  margin-bottom: var(--sp-2);
}

.lo-modal-name {
  font-family: var(--font-display);
  font-size: var(--t-h3);
  line-height: var(--lh-heading3);
  letter-spacing: var(--ls-display);
  text-transform: uppercase;
  color: var(--fg-1);
}

.lo-modal-sub {
  font-family: var(--font-mono);
  font-size: var(--t-detail-sm);
  letter-spacing: var(--ls-label);
  color: var(--fg-4);
  text-transform: uppercase;
  margin-bottom: var(--sp-4);
}

.lo-divider {
  border: 0;
  border-top: 1px solid var(--cw-seam);
  margin: var(--sp-4) 0;
}

.lo-stat-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: var(--sp-3);
  padding: var(--sp-1) 0;
  font-family: var(--font-terminal);
  font-size: var(--t-detail);
  color: var(--fg-2);
  font-variant-numeric: tabular-nums;
}

.lo-stat-label {
  font-family: var(--font-mono);
  font-size: var(--t-detail-sm);
  letter-spacing: var(--ls-label);
  color: var(--fg-4);
  text-transform: uppercase;
}

.lo-badge {
  font-family: var(--font-mono);
  font-size: 0.625rem;
  letter-spacing: var(--ls-mono);
  padding: 0 var(--sp-1);
  border: 1px solid var(--seam-strong);
  color: var(--fg-4);
  text-transform: lowercase;
}

.lo-badge--measured { color: var(--cw-accent); border-color: var(--cw-accent-dim); }
.lo-badge--reproduced { color: var(--tier-rare); border-color: var(--tier-rare); }
.lo-badge--rated { color: var(--fg-3); }
.lo-badge--derived { color: var(--warn); border-color: var(--warn); }

.lo-buff {
  font-family: var(--font-terminal);
  font-size: var(--t-detail);
  color: var(--tier-uncommon);
  padding: var(--sp-1) 0;
}

.lo-set-hint {
  font-family: var(--font-mono);
  font-size: var(--t-detail-sm);
  color: var(--cw-accent);
  padding: var(--sp-1) 0;
}

.lo-iso {
  font-family: var(--font-mono);
  font-size: var(--t-detail-sm);
  letter-spacing: var(--ls-mono);
  color: var(--fg-4);
  line-height: 1.7;
  overflow-wrap: anywhere;
}

.lo-iso b { color: var(--fg-3); font-weight: 400; }

.lo-flavor {
  font-family: var(--font-body);
  font-style: italic;
  font-size: var(--t-body);
  line-height: var(--lh-body);
  color: var(--fg-3);
}

.lo-prov {
  font-family: var(--font-mono);
  font-size: var(--t-detail-sm);
  letter-spacing: var(--ls-mono);
  color: var(--fg-4);
}

.lo-prov a { color: var(--fg-3); }

.lo-calibration {
  font-family: var(--font-mono);
  font-size: var(--t-detail-sm);
  letter-spacing: var(--ls-label);
  color: var(--cw-hot);
  border: 1px solid var(--cw-hot);
  padding: var(--sp-1) var(--sp-2);
  margin: var(--sp-2) 0;
  text-transform: uppercase;
}

.lo-modal-actions {
  display: flex;
  gap: var(--sp-3);
  margin-top: var(--sp-4);
}

.lo-equip-btn {
  flex: 1;
  font-family: var(--font-mono);
  font-size: var(--t-detail);
  letter-spacing: var(--ls-label);
  text-transform: uppercase;
  padding: var(--sp-2) var(--sp-4);
  cursor: pointer;
  background: var(--cw-accent);
  border: 1px solid var(--cw-accent);
  color: var(--bg-1);
}

.lo-equip-btn--uninstall {
  background: transparent;
  color: var(--cw-hot);
  border-color: var(--cw-hot);
}

.lo-equip-btn:disabled {
  background: transparent;
  color: var(--fg-5);
  border-color: var(--fg-5);
  cursor: not-allowed;
}

/* ---------- friction panel ---------- */
.lo-friction {
  border: 1px solid var(--cw-seam);
  background: var(--cw-panel);
  padding: var(--sp-4);
}

.lo-friction-title {
  font-family: var(--font-mono);
  font-size: var(--t-detail-sm);
  letter-spacing: var(--ls-eyebrow);
  color: var(--fg-4);
  text-transform: uppercase;
  margin-bottom: var(--sp-3);
}

.lo-friction-item {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--sp-2);
  padding: var(--sp-2) 0;
  border-top: 1px solid var(--seam-soft);
  font-family: var(--font-terminal);
  font-size: var(--t-detail);
  color: var(--fg-2);
}

.lo-friction-item--synergy .lo-friction-mark { color: var(--cw-accent); }
.lo-friction-item--conflict .lo-friction-mark { color: var(--cw-hot); }
.lo-friction-item--hazard .lo-friction-mark { color: var(--warn); }

.lo-friction-why {
  flex-basis: 100%;
  font-family: var(--font-body);
  font-size: var(--t-detail);
  color: var(--fg-4);
}

.lo-resolve-btn {
  font-family: var(--font-mono);
  font-size: var(--t-detail-sm);
  letter-spacing: var(--ls-label);
  text-transform: uppercase;
  color: var(--warn);
  background: transparent;
  border: 1px solid var(--warn);
  padding: 1px var(--sp-2);
  cursor: pointer;
}

.lo-resolve-btn:hover { background: var(--warn); color: var(--bg-1); }

.lo-resolved-tag { color: var(--cw-accent); font-family: var(--font-mono); font-size: var(--t-detail-sm); }

/* ---------- unpowered / glitch / notices ---------- */
.lo-unpowered {
  border: 1px dashed var(--seam-strong);
  padding: var(--sp-8);
  text-align: center;
  font-family: var(--font-terminal);
  color: var(--fg-4);
  letter-spacing: var(--ls-mega);
  text-transform: uppercase;
}

.lo-glitch-panel {
  border: 1px solid var(--cw-hot);
  background: rgba(255, 46, 85, 0.06);
  padding: var(--sp-4);
  margin-bottom: var(--sp-6);
  font-family: var(--font-decorative);
  color: var(--cw-hot);
  font-size: var(--t-body-hi);
}

.lo-glitch-panel small {
  display: block;
  margin-top: var(--sp-2);
  font-family: var(--font-mono);
  font-size: var(--t-detail-sm);
  color: var(--fg-3);
}

.lo-notice {
  border: 1px solid var(--warn);
  color: var(--warn);
  font-family: var(--font-mono);
  font-size: var(--t-detail-sm);
  padding: var(--sp-2) var(--sp-3);
  margin-bottom: var(--sp-4);
}

.lo-footnote {
  margin-top: var(--sp-6);
  font-family: var(--font-mono);
  font-size: var(--t-detail-sm);
  color: var(--fg-5);
  letter-spacing: var(--ls-mono);
}

/* ---------- motion (relay click + glitch), gated ---------- */
@media (prefers-reduced-motion: no-preference) {
  .lo-card { transition: transform var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out); }
  .lo-gauge-seg { transition: background-color 80ms steps(1, end), box-shadow 80ms steps(1, end); }

  .lo-hud--compromised .lo-hud-title {
    animation: lo-glitch 900ms steps(4, end) infinite;
  }

  @keyframes lo-glitch {
    0%, 100% { text-shadow: 1px 0 var(--cw-hot), -1px 0 var(--cw-accent); transform: translateX(0); }
    25% { text-shadow: -2px 0 var(--cw-hot), 2px 0 var(--cw-accent); transform: translateX(1px); }
    50% { text-shadow: 1px 0 var(--cw-accent), -1px 0 var(--cw-hot); transform: translateX(-1px); }
    75% { text-shadow: -1px 0 var(--cw-accent), 2px 0 var(--cw-hot); transform: translateX(0); }
  }
}

/* ---------- responsive ---------- */
@media (max-width: 900px) {
  .lo-bench { grid-template-columns: 1fr; }
  .lo-nav { position: static; }
  .lo-hud { position: static; }
  .lo-build-line { margin-left: 0; }
}
```

- [ ] **Step 1:** Write the file exactly as above; add the import to `main.tsx` (fourth CSS import, keep its ABOUTME lines intact).
- [ ] **Step 2:** `bun run build` → clean. `bun run test` → still green (no component uses it yet).
- [ ] **Step 3: Commit** — `git commit -m "feat(loadout): Gurney Chrome stylesheet — page-scoped bench styles + relay gauges"`.

---

### Task 8: ImplantCard

**Files:**
- Create: `~/code/dinnaga/src/components/loadout/ImplantCard.tsx`
- Create: `~/code/dinnaga/src/components/loadout/ImplantCard.test.tsx`

**Interfaces:**
- Consumes: `Zord` (Task 4), `.lo-card*` classes (Task 7).
- Produces: `ImplantCard({ zord, equipped, onOpen }: { zord: Zord; equipped: boolean; onOpen: (z: Zord) => void })` — a `<button>` with `aria-label` `` `${zord.name} — inspect implant` `` (Tasks 13/14 target this label).

- [ ] **Step 1: Failing test** — `ImplantCard.test.tsx`:

```tsx
// ABOUTME: Tests for the compact implant candidate card — content and open callback.
// ABOUTME: Uses the real genome zord from the vendored snapshot; no fixtures.
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { zordByName } from '../../data/zords';
import { ImplantCard } from './ImplantCard';

const genome = zordByName('genome')!;

describe('ImplantCard', () => {
  it('renders name, tier, manufacturer, cost, and headline', () => {
    render(<ImplantCard zord={genome} equipped={false} onOpen={() => {}} />);
    expect(screen.getByText('GENOME')).toBeInTheDocument();
    expect(screen.getByText(/RARE/)).toBeInTheDocument();
    expect(screen.getByText(/KIROSHI/)).toBeInTheDocument();
    expect(screen.getByText(/k CTX/)).toBeInTheDocument();
    expect(screen.getByText(genome.headline)).toBeInTheDocument();
    expect(screen.queryByText('INSTALLED')).not.toBeInTheDocument();
  });

  it('shows INSTALLED when equipped and calls onOpen on click', async () => {
    const onOpen = vi.fn();
    render(<ImplantCard zord={genome} equipped onOpen={onOpen} />);
    expect(screen.getByText('INSTALLED')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /genome — inspect implant/i }));
    expect(onOpen).toHaveBeenCalledWith(genome);
  });
});
```

- [ ] **Step 2:** `bun run test src/components/loadout/ImplantCard.test.tsx` → FAIL.
- [ ] **Step 3: Implement** — `ImplantCard.tsx`:

```tsx
// ABOUTME: Compact cyberware candidate card for the /loadout tray grid — name, tier pips,
// ABOUTME: manufacturer, measured context cost, and the reproduced headline.
import type { Zord } from '../../types';

const TIER_PIPS: Record<string, number> = { common: 1, uncommon: 2, rare: 3, epic: 4, legendary: 5 };

interface ImplantCardProps {
  zord: Zord;
  equipped: boolean;
  onOpen: (zord: Zord) => void;
}

export function ImplantCard({ zord, equipped, onOpen }: ImplantCardProps) {
  const pips = TIER_PIPS[zord.tier] ?? 1;
  return (
    <button
      type="button"
      className={`lo-card lo-tier-${zord.tier}`}
      onClick={() => onOpen(zord)}
      aria-label={`${zord.name} — inspect implant`}
    >
      <span className="lo-card-top">
        <span className="lo-card-name">{zord.name.toUpperCase()}</span>
        {equipped && <span className="lo-card-equipped">INSTALLED</span>}
      </span>
      <span className="lo-card-tier">
        {zord.tier.toUpperCase()} {'◆'.repeat(pips)}
        {'◇'.repeat(5 - pips)}
      </span>
      <span className="lo-card-meta">
        {zord.manufacturer.toUpperCase()} · +{(zord.contextCostTokens / 1000).toFixed(2)}k CTX
      </span>
      <span className="lo-card-headline">{zord.headline}</span>
    </button>
  );
}
```

- [ ] **Step 4:** Test → PASS. **Step 5: Commit** `feat(loadout): implant candidate card`.

---

### Task 9: ImplantModal

**Files:**
- Create: `~/code/dinnaga/src/components/loadout/ImplantModal.tsx`
- Create: `~/code/dinnaga/src/components/loadout/ImplantModal.test.tsx`

**Interfaces:**
- Consumes: `Zord`, `ZordStack` (Task 4), `.lo-modal*`/`.lo-stat-row`/`.lo-badge*`/`.lo-buff`/`.lo-calibration` classes (Task 7).
- Produces: `ImplantModal({ zord, equipped, replaces, stacks, slotSystem, onEquip, onUnequip, onClose })` where `replaces: string | null` names the zord an Install would displace. Buttons: `Install` / `Install — replaces X` / `Uninstall` / `Close`. Escape and backdrop-click call `onClose`.

- [ ] **Step 1: Failing test** — `ImplantModal.test.tsx`:

```tsx
// ABOUTME: Tests for the full implant stat modal — spec §7 content, provenance badges,
// ABOUTME: calibration warning, and install/uninstall/close behavior.
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { STACKS, ZORDS, zordByName } from '../../data/zords';
import { ImplantModal } from './ImplantModal';

const genome = zordByName('genome')!;
const doomgoblin = zordByName('doomgoblin')!;

function mount(zord = genome, over: Partial<Parameters<typeof ImplantModal>[0]> = {}) {
  const props = {
    zord,
    equipped: false,
    replaces: null as string | null,
    stacks: STACKS,
    slotSystem: 'Kiroshi Optics',
    onEquip: vi.fn(),
    onUnequip: vi.fn(),
    onClose: vi.fn(),
    ...over,
  };
  render(<ImplantModal {...props} />);
  return props;
}

describe('ImplantModal', () => {
  it('renders the full stat card: cost, stats with provenance, buffs, isolation, provenance line', () => {
    mount();
    expect(screen.getByRole('dialog', { name: /genome implant details/i })).toBeInTheDocument();
    expect(screen.getByText(/capacity cost/i)).toBeInTheDocument();
    expect(screen.getAllByText('measured').length).toBeGreaterThanOrEqual(1);
    for (const s of genome.stats) expect(screen.getByText(s.label)).toBeInTheDocument();
    expect(screen.getByText(/▲ AGENT RELIABILITY \+\+/)).toBeInTheDocument();
    expect(screen.getByText(/▲ TOKEN EFFICIENCY \+/)).toBeInTheDocument();
    expect(screen.getByText(/runstate\.tool_events/)).toBeInTheDocument();
    expect(screen.getByText(/148 tests/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /arXiv 2606\.15579/i })).toHaveAttribute(
      'href',
      'https://arxiv.org/abs/2606.15579',
    );
    expect(screen.getByText(/⊕ SET:/)).toBeInTheDocument();
  });

  it('install path: calls onEquip; shows replace note when displacing', async () => {
    const p = mount(genome, { replaces: 'doomgoblin' });
    const btn = screen.getByRole('button', { name: /install — replaces doomgoblin/i });
    await userEvent.click(btn);
    expect(p.onEquip).toHaveBeenCalledWith(genome);
  });

  it('uninstall path when equipped', async () => {
    const p = mount(genome, { equipped: true });
    await userEvent.click(screen.getByRole('button', { name: /uninstall/i }));
    expect(p.onUnequip).toHaveBeenCalledWith(genome);
  });

  it('Escape closes', async () => {
    const p = mount();
    await userEvent.keyboard('{Escape}');
    expect(p.onClose).toHaveBeenCalled();
  });

  it('doomgoblin shows the calibration requirement', () => {
    mount(doomgoblin, { slotSystem: 'Kiroshi Optics' });
    expect(screen.getByText(/requires calibration/i)).toBeInTheDocument();
  });

  it('every zord renders without crashing', () => {
    for (const z of ZORDS) {
      const { unmount } = render(
        <ImplantModal
          zord={z} equipped={false} replaces={null} stacks={STACKS} slotSystem="X"
          onEquip={() => {}} onUnequip={() => {}} onClose={() => {}}
        />,
      );
      unmount();
    }
  });
});
```

- [ ] **Step 2:** Run → FAIL. **Step 3: Implement** — `ImplantModal.tsx`:

```tsx
// ABOUTME: Full implant stat card (spec §7) — detail modal with measured costs, rated buffs,
// ABOUTME: set-bonus hints, isolation slices, calibration flag, and install/uninstall actions.
import { useEffect } from 'react';
import type { Zord, ZordStack } from '../../types';

const TIER_PIPS: Record<string, number> = { common: 1, uncommon: 2, rare: 3, epic: 4, legendary: 5 };

interface ImplantModalProps {
  zord: Zord;
  equipped: boolean;
  replaces: string | null;
  stacks: ZordStack[];
  slotSystem: string;
  onEquip: (zord: Zord) => void;
  onUnequip: (zord: Zord) => void;
  onClose: () => void;
}

export function ImplantModal({
  zord, equipped, replaces, stacks, slotSystem, onEquip, onUnequip, onClose,
}: ImplantModalProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const pips = TIER_PIPS[zord.tier] ?? 1;
  const sets = stacks.filter((s) => s.members.includes(zord.name));

  return (
    <div className="lo-modal-backdrop" onClick={onClose} role="presentation">
      <div
        className={`lo-modal lo-tier-${zord.tier}`}
        role="dialog"
        aria-modal="true"
        aria-label={`${zord.name} implant details`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="lo-modal-head">
          <span className="lo-modal-name">{zord.name}</span>
          <span className="lo-card-tier">
            {zord.tier.toUpperCase()} {'◆'.repeat(pips)}
            {'◇'.repeat(5 - pips)}
          </span>
        </div>
        <div className="lo-modal-sub">
          {zord.manufacturer} · {slotSystem} ({zord.slot}) · hook {zord.hookPoints.join(' + ')}
        </div>

        <hr className="lo-divider" />
        <div className="lo-stat-row">
          <span className="lo-stat-label">Capacity cost</span>
          <span>
            +{(zord.contextCostTokens / 1000).toFixed(2)}k ctx{' '}
            <span
              className="lo-badge lo-badge--measured"
              title="real size of the text this implant loads into context"
            >
              measured
            </span>
          </span>
        </div>
        {zord.stats.map((s) => (
          <div className="lo-stat-row" key={s.label}>
            <span className="lo-stat-label">{s.label}</span>
            <span>
              {s.value} <span className={`lo-badge lo-badge--${s.provenance}`}>{s.provenance}</span>
            </span>
          </div>
        ))}

        <hr className="lo-divider" />
        {zord.improves.map((axis, i) => (
          <div className="lo-buff" key={axis}>
            {`▲ ${axis.replace(/-/g, ' ').toUpperCase()} ${i === 0 ? '++' : '+'} `}
            <span
              className="lo-badge lo-badge--rated"
              title="ordinal editorial rating, grounded by the reproduced headline"
            >
              rated
            </span>
          </div>
        ))}
        {sets.map((s) => (
          <div className="lo-set-hint" key={s.name}>
            ⊕ SET: {s.members.filter((m) => m !== zord.name).join(' + ')} → “{s.name}”
          </div>
        ))}

        {zord.requiresCalibration && (
          <div className="lo-calibration">
            ⚠ requires calibration — trains per-deployment heads before install
          </div>
        )}

        <hr className="lo-divider" />
        <p className="lo-iso">
          <b>r:</b> {zord.isolation.reads.join(', ')}
          <br />
          <b>w:</b> {zord.isolation.writes.join(', ')}
        </p>
        <hr className="lo-divider" />
        <p className="lo-flavor">“{zord.flavor}”</p>
        <p className="lo-prov">
          {zord.faithful} · {zord.tests} tests ·{' '}
          <a href={`https://arxiv.org/abs/${zord.paper}`} target="_blank" rel="noreferrer">
            arXiv {zord.paper}
          </a>
        </p>
        <p className="lo-iso">{zord.headline}</p>

        <div className="lo-modal-actions">
          {equipped ? (
            <button
              type="button"
              className="lo-equip-btn lo-equip-btn--uninstall"
              onClick={() => onUnequip(zord)}
            >
              Uninstall
            </button>
          ) : (
            <button type="button" className="lo-equip-btn" onClick={() => onEquip(zord)}>
              Install{replaces ? ` — replaces ${replaces}` : ''}
            </button>
          )}
          <button type="button" className="lo-hud-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4:** Test → PASS. **Step 5: Commit** `feat(loadout): implant detail modal — full stat card`.

---

### Task 10: BodyNav (+ anatomical figure)

**Files:**
- Create: `~/code/dinnaga/src/components/loadout/BodyNav.tsx`
- Create: `~/code/dinnaga/src/components/loadout/BodyNav.test.tsx`

**Interfaces:**
- Consumes: `Slot`, `Loadout` (Task 4), `.lo-nav*`/`.lo-fig*` classes (Task 7).
- Produces: `BodyNav({ slots, loadout, selected, onSelect }: { slots: Slot[]; loadout: Loadout; selected: string; onSelect: (slotId: string) => void })`. Slot buttons' accessible names start with the slot id (Tasks 13/14 target `/^L1/` etc.).

- [ ] **Step 1: Failing test** — `BodyNav.test.tsx`:

```tsx
// ABOUTME: Tests for the body-system navigator — grouping, occupants, selection callback,
// ABOUTME: and the anatomical figure lighting regions as slots fill.
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SLOTS } from '../../data/zords';
import { BodyNav } from './BodyNav';

describe('BodyNav', () => {
  it('groups slots by body system', () => {
    render(<BodyNav slots={SLOTS} loadout={[]} selected="L1" onSelect={() => {}} />);
    for (const system of [
      'Operating System', 'Kiroshi Optics', 'Dynalar Limbs', 'Frontal Cortex',
      'Immune System', 'Subdermal / Diagnostics',
    ]) {
      expect(screen.getByText(system)).toBeInTheDocument();
    }
    // Dynalar Limbs expands into its three sub-slots
    expect(screen.getByRole('button', { name: /^L2 / })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^L2\.5/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^L2\.7/ })).toBeInTheDocument();
  });

  it('shows occupants, selection state, and fires onSelect', async () => {
    const onSelect = vi.fn();
    render(
      <BodyNav
        slots={SLOTS}
        loadout={[{ slot: 'L1', zord: 'genome' }]}
        selected="L1"
        onSelect={onSelect}
      />,
    );
    expect(screen.getByRole('button', { name: /^L1/ })).toHaveTextContent('genome');
    expect(screen.getByRole('button', { name: /^L1/ })).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(screen.getByRole('button', { name: /^L3/ }));
    expect(onSelect).toHaveBeenCalledWith('L3');
  });

  it('lights figure regions for equipped slots', () => {
    const { container } = render(
      <BodyNav
        slots={SLOTS}
        loadout={[
          { slot: 'L1', zord: 'genome' },
          { slot: 'L3', zord: 'funes' },
        ]}
        selected="L1"
        onSelect={() => {}}
      />,
    );
    expect(container.querySelectorAll('.lo-fig-region--lit').length).toBe(2); // eyes + head
  });
});
```

- [ ] **Step 2:** Run → FAIL. **Step 3: Implement** — `BodyNav.tsx`:

```tsx
// ABOUTME: Left-rail body navigator — slots grouped by body system, with an anatomical
// ABOUTME: figure whose regions light up as cyberware is installed.
import type { Loadout, Slot } from '../../types';

interface BodyNavProps {
  slots: Slot[];
  loadout: Loadout;
  selected: string;
  onSelect: (slotId: string) => void;
}

const REGION_FOR_SLOT: Record<string, string> = {
  L0: 'spine',
  L1: 'eyes',
  L2: 'arms',
  'L2.5': 'arms',
  'L2.7': 'arms',
  L3: 'head',
  L4: 'torso',
  DIAG: 'skin',
};

function BodyFigure({ lit }: { lit: ReadonlySet<string> }) {
  const cls = (r: string) => `lo-fig-region${lit.has(r) ? ' lo-fig-region--lit' : ''}`;
  return (
    <svg className="lo-fig" viewBox="0 0 120 168" aria-hidden="true">
      <rect className={cls('skin')} x="14" y="4" width="92" height="160" rx="8" strokeDasharray="3 3" fillOpacity="0.15" />
      <circle className={cls('head')} cx="60" cy="28" r="16" />
      <rect className={cls('eyes')} x="47" y="24" width="26" height="5" />
      <rect className={cls('torso')} x="44" y="50" width="32" height="46" />
      <rect className={cls('spine')} x="57" y="52" width="6" height="42" />
      <rect className={cls('arms')} x="24" y="52" width="14" height="40" />
      <rect className={cls('arms')} x="82" y="52" width="14" height="40" />
    </svg>
  );
}

export function BodyNav({ slots, loadout, selected, onSelect }: BodyNavProps) {
  const lit = new Set(
    loadout.map((e) => REGION_FOR_SLOT[e.slot]).filter((r): r is string => r !== undefined),
  );
  const groups: { system: string; slots: Slot[] }[] = [];
  for (const slot of slots) {
    const last = groups[groups.length - 1];
    if (last && last.system === slot.system) last.slots.push(slot);
    else groups.push({ system: slot.system, slots: [slot] });
  }
  return (
    <aside className="lo-nav" aria-label="body systems">
      <BodyFigure lit={lit} />
      {groups.map((g) => (
        <div className="lo-nav-group" key={g.system}>
          <div className="lo-nav-system">{g.system}</div>
          {g.slots.map((slot) => {
            const occupants = loadout.filter((e) => e.slot === slot.id).map((e) => e.zord);
            const isSelected = selected === slot.id;
            return (
              <button
                key={slot.id}
                type="button"
                className={`lo-nav-slot${isSelected ? ' lo-nav-slot--selected' : ''}${
                  occupants.length ? ' lo-nav-slot--filled' : ''
                }`}
                aria-pressed={isSelected}
                onClick={() => onSelect(slot.id)}
              >
                <span>{slot.id} </span>
                <span className="lo-nav-occupant">{occupants.join(' · ') || '—'}</span>
                <span className="lo-nav-mark">{occupants.length ? '✓' : '·'}</span>
              </button>
            );
          })}
        </div>
      ))}
    </aside>
  );
}
```

Note the trailing space in `{slot.id} ` — it keeps accessible names like `L2 …` distinguishable from `L2.5 …` for the `/^L2 /` test regex.

- [ ] **Step 4:** Test → PASS (fig lit test: eyes + head = 2 lit regions; the two `arms` rects share one region key but render as two elements — loadout in that test doesn't light arms). **Step 5: Commit** `feat(loadout): body navigator with anatomical slot figure`.

---

### Task 11: HarnessHUD

**Files:**
- Create: `~/code/dinnaga/src/components/loadout/HarnessHUD.tsx`
- Create: `~/code/dinnaga/src/components/loadout/HarnessHUD.test.tsx`

**Interfaces:**
- Consumes: `FrictionReport`, `Capacity` (Task 4), `.lo-hud*`/`.lo-gauge*`/`.lo-stamp`/`.lo-build-*` classes (Task 7).
- Produces: `HarnessHUD({ report, capacity, code, name, copied, onShare, onCopy })` with `copied: 'share' | 'code' | null`. Buttons named `Share ↗` / `Copy` (flip to `Copied ↗` / `Copied`).

- [ ] **Step 1: Failing test** — `HarnessHUD.test.tsx`:

```tsx
// ABOUTME: Tests for the HUD bar — gauges, friction counts, build line, share/copy,
// ABOUTME: and the compromised cyberpsychosis state with UNSTABLE stamp.
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { FrictionReport } from '../../types';
import { CAPACITY } from '../../data/zords';
import { HarnessHUD } from './HarnessHUD';

const stable: FrictionReport = {
  synergies: [{ a: 'genome', b: 'hler', on: ['agent-reliability'], stackName: 'Reliability Spine' }],
  conflicts: [],
  hazards: [],
  drift: 0,
  contextLoad: 3200,
  overBudget: false,
  coverage: ['agent-reliability'],
  unstable: false,
};

function mount(report: FrictionReport, copied: 'share' | 'code' | null = null) {
  const onShare = vi.fn();
  const onCopy = vi.fn();
  render(
    <HarnessHUD
      report={report} capacity={CAPACITY} code="GNM·HLR" name="The Reliability Spine"
      copied={copied} onShare={onShare} onCopy={onCopy}
    />,
  );
  return { onShare, onCopy };
}

describe('HarnessHUD', () => {
  it('renders gauges, counts, and the build line', () => {
    mount(stable);
    expect(screen.getByText('RIPPERDOC // HARNESS LOADOUT')).toBeInTheDocument();
    expect(screen.getByLabelText(/context load 3200 of/)).toBeInTheDocument();
    expect(screen.getByLabelText(/drift 0 of/)).toBeInTheDocument();
    expect(screen.getByText('⊕1')).toBeInTheDocument();
    expect(screen.getByText('✕0')).toBeInTheDocument();
    expect(screen.getByText('GNM·HLR')).toBeInTheDocument();
    expect(screen.getByText(/The Reliability Spine/)).toBeInTheDocument();
    expect(screen.queryByText(/unstable build/i)).not.toBeInTheDocument();
  });

  it('share/copy fire callbacks and show copied feedback', async () => {
    const { onShare } = mount(stable, 'code');
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /share/i }));
    expect(onShare).toHaveBeenCalled();
  });

  it('compromised state: title flips, stamp appears', () => {
    mount({ ...stable, drift: CAPACITY.driftMax, unstable: true });
    expect(screen.getByText('HARNESS INTEGRITY COMPROMISED')).toBeInTheDocument();
    expect(screen.getByText(/unstable build/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2:** Run → FAIL. **Step 3: Implement** — `HarnessHUD.tsx`:

```tsx
// ABOUTME: Sticky HUD bar — context/drift relay gauges, friction counts, build code + name,
// ABOUTME: share/copy actions, and the compromised (cyberpsychosis) presentation.
import type { Capacity, FrictionReport } from '../../types';

interface HarnessHUDProps {
  report: FrictionReport;
  capacity: Capacity;
  code: string;
  name: string;
  copied: 'share' | 'code' | null;
  onShare: () => void;
  onCopy: () => void;
}

const CTX_SEGS = 16;

function segClass(on: boolean, over: boolean, warn: boolean): string {
  if (!on) return 'lo-gauge-seg';
  if (over) return 'lo-gauge-seg lo-gauge-seg--over';
  if (warn) return 'lo-gauge-seg lo-gauge-seg--warn';
  return 'lo-gauge-seg lo-gauge-seg--filled';
}

export function HarnessHUD({ report, capacity, code, name, copied, onShare, onCopy }: HarnessHUDProps) {
  const ratio = report.contextLoad / capacity.contextBudgetTokens;
  const filled = Math.min(CTX_SEGS, Math.round(ratio * CTX_SEGS));
  const unresolved = report.conflicts.filter((c) => !c.resolved).length;
  const driftMaxed = report.drift >= capacity.driftMax;

  return (
    <div className={`lo-hud${report.unstable ? ' lo-hud--compromised' : ''}`}>
      <span className="lo-hud-title">
        {report.unstable ? 'HARNESS INTEGRITY COMPROMISED' : 'RIPPERDOC // HARNESS LOADOUT'}
      </span>
      <span
        className="lo-gauge"
        aria-label={`context load ${report.contextLoad} of ${capacity.contextBudgetTokens} tokens`}
      >
        <span className="lo-gauge-label">Context</span>
        <span className="lo-gauge-track" aria-hidden="true">
          {Array.from({ length: CTX_SEGS }, (_, i) => (
            <span key={i} className={segClass(i < filled, report.overBudget, ratio > 0.75)} />
          ))}
        </span>
        <span>
          {(report.contextLoad / 1000).toFixed(1)}k/{(capacity.contextBudgetTokens / 1000).toFixed(0)}k{' '}
          <span className="lo-badge lo-badge--measured" title="sum of measured implant payloads">
            m
          </span>
        </span>
      </span>
      <span className="lo-gauge" aria-label={`drift ${report.drift} of ${capacity.driftMax}`}>
        <span className="lo-gauge-label">Drift</span>
        <span className="lo-gauge-track" aria-hidden="true">
          {Array.from({ length: capacity.driftMax }, (_, i) => (
            <span key={i} className={segClass(i < report.drift, driftMaxed, report.drift >= capacity.driftMax - 1)} />
          ))}
        </span>
        <span>
          {report.drift}/{capacity.driftMax}{' '}
          <span className="lo-badge lo-badge--derived" title="derived from isolation write-slice overlap">
            d
          </span>
        </span>
      </span>
      <span className="lo-hud-counts">
        <span className="is-cool">⊕{report.synergies.length}</span>
        <span className={unresolved > 0 ? 'is-hot' : ''}>✕{unresolved}</span>
        <span className={report.hazards.length > 0 ? 'is-warn' : ''}>⚠{report.hazards.length}</span>
      </span>
      <span className="lo-build-line">
        <span>{code}</span>
        <span className="lo-build-name">“{name}”</span>
        {report.unstable && <span className="lo-stamp">Unstable build</span>}
        <button type="button" className="lo-hud-btn" onClick={onShare}>
          {copied === 'share' ? 'Copied ↗' : 'Share ↗'}
        </button>
        <button type="button" className="lo-hud-btn" onClick={onCopy}>
          {copied === 'code' ? 'Copied' : 'Copy'}
        </button>
      </span>
    </div>
  );
}
```

- [ ] **Step 4:** Test → PASS. **Step 5: Commit** `feat(loadout): harness HUD with relay gauges + unstable stamp`.

---

### Task 12: FrictionPanel

**Files:**
- Create: `~/code/dinnaga/src/components/loadout/FrictionPanel.tsx`
- Create: `~/code/dinnaga/src/components/loadout/FrictionPanel.test.tsx`

**Interfaces:**
- Consumes: `FrictionReport` (Task 4), `conflictKey` (Task 5), `.lo-friction*`/`.lo-resolve-btn`/`.lo-resolved-tag` classes (Task 7).
- Produces: `FrictionPanel({ report, onResolve }: { report: FrictionReport; onResolve: (key: string) => void })`. Resolve button accessible name starts `Resolve — apply isolation mask` (Task 14 targets it).

- [ ] **Step 1: Failing test** — `FrictionPanel.test.tsx`:

```tsx
// ABOUTME: Tests for the live friction report panel — synergy/conflict/hazard rows,
// ABOUTME: resolve action wiring, resolved display, and the clean-install empty state.
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { FrictionReport } from '../../types';
import { FrictionPanel } from './FrictionPanel';

const conflict = {
  a: 'funes', b: 'hler', kind: 'pre-commit-visibility',
  why: 'global memory visibility guts the gate', resolution: 'isolation mask',
};

const report: FrictionReport = {
  synergies: [{ a: 'genome', b: 'hler', on: ['agent-reliability'], stackName: 'Reliability Spine' }],
  conflicts: [{ conflict, resolved: false }],
  hazards: [{ reader: 'doomgoblin', writer: 'genome', slices: ['runstate.trajectory'] }],
  drift: 2, contextLoad: 1000, overBudget: false, coverage: [], unstable: false,
};

describe('FrictionPanel', () => {
  it('renders all three finding kinds', () => {
    render(<FrictionPanel report={report} onResolve={() => {}} />);
    expect(screen.getByText(/genome ⊕ hler/)).toBeInTheDocument();
    expect(screen.getByText(/Reliability Spine/)).toBeInTheDocument();
    expect(screen.getByText(/funes ⟷ hler/)).toBeInTheDocument();
    expect(screen.getByText(/doomgoblin reads what genome writes/)).toBeInTheDocument();
  });

  it('resolve button fires with the conflict key', async () => {
    const onResolve = vi.fn();
    render(<FrictionPanel report={report} onResolve={onResolve} />);
    await userEvent.click(screen.getByRole('button', { name: /resolve — apply isolation mask/i }));
    expect(onResolve).toHaveBeenCalledWith('funes~hler');
  });

  it('resolved conflicts show the resolution instead of the button', () => {
    render(
      <FrictionPanel
        report={{ ...report, conflicts: [{ conflict, resolved: true }] }}
        onResolve={() => {}}
      />,
    );
    expect(screen.queryByRole('button', { name: /resolve/i })).not.toBeInTheDocument();
    expect(screen.getByText(/✓ resolved · isolation mask/)).toBeInTheDocument();
  });

  it('empty report reads clean', () => {
    render(
      <FrictionPanel
        report={{ ...report, synergies: [], conflicts: [], hazards: [] }}
        onResolve={() => {}}
      />,
    );
    expect(screen.getByText(/NO FRICTION — CLEAN INSTALL/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2:** Run → FAIL. **Step 3: Implement** — `FrictionPanel.tsx`:

```tsx
// ABOUTME: Live friction report — set bonuses, registered conflicts with RESOLVE actions,
// ABOUTME: and read-after-write hazards for the current loadout.
import type { FrictionReport } from '../../types';
import { conflictKey } from '../../lib/friction';

interface FrictionPanelProps {
  report: FrictionReport;
  onResolve: (key: string) => void;
}

export function FrictionPanel({ report, onResolve }: FrictionPanelProps) {
  const empty =
    report.synergies.length === 0 && report.conflicts.length === 0 && report.hazards.length === 0;
  return (
    <section className="lo-friction" aria-label="friction report">
      <div className="lo-friction-title">Friction // live report</div>
      {empty && <div className="lo-friction-item">NO FRICTION — CLEAN INSTALL.</div>}
      {report.synergies.map((s) => (
        <div className="lo-friction-item lo-friction-item--synergy" key={`${s.a}~${s.b}`}>
          <span className="lo-friction-mark">⊕</span>
          <span>
            {s.a} ⊕ {s.b} → {s.on.join(', ')}
            {s.stackName ? ` — “${s.stackName}”` : ''}
          </span>
        </div>
      ))}
      {report.conflicts.map(({ conflict, resolved }) => {
        const key = conflictKey(conflict.a, conflict.b);
        return (
          <div className="lo-friction-item lo-friction-item--conflict" key={key}>
            <span className="lo-friction-mark">✕</span>
            <span>
              {conflict.a} ⟷ {conflict.b} — {conflict.kind}
            </span>
            {resolved ? (
              <span className="lo-resolved-tag">✓ resolved · {conflict.resolution}</span>
            ) : (
              <>
                <button type="button" className="lo-resolve-btn" onClick={() => onResolve(key)}>
                  Resolve — apply isolation mask
                </button>
                <span className="lo-friction-why">{conflict.why}</span>
              </>
            )}
          </div>
        );
      })}
      {report.hazards.map((h) => (
        <div className="lo-friction-item lo-friction-item--hazard" key={`${h.reader}<${h.writer}`}>
          <span className="lo-friction-mark">⚠</span>
          <span>
            {h.reader} reads what {h.writer} writes ({h.slices.join(', ')}) — order-fragile
          </span>
        </div>
      ))}
    </section>
  );
}
```

- [ ] **Step 4:** Test → PASS. **Step 5: Commit** `feat(loadout): friction report panel with resolve action`.

---

### Task 13: Loadout route + registration

**Files:**
- Create: `~/code/dinnaga/src/data/loadoutBootLines.ts`
- Create: `~/code/dinnaga/src/routes/Loadout/Loadout.tsx`
- Create: `~/code/dinnaga/src/routes/Loadout/Loadout.test.tsx`
- Modify: `~/code/dinnaga/src/App.tsx` (import + `{ path: 'loadout', element: <Loadout /> }` before the `'*'` catch-all)
- Modify: `~/code/dinnaga/src/data/navLinks.ts` (append `{ label: 'Loadout', to: '/loadout' }`)
- Modify: `~/code/dinnaga/src/data/data.test.ts` (NAV_LINKS pin → `['/atisha', '/method', '/colophon', '/loadout']`)

**Interfaces:**
- Consumes: everything from Tasks 4–12 plus `useTyped` (existing hook, signature `useTyped(lines: BootLine[]): { rendered: string[]; done: boolean }`).
- Produces: `Loadout()` route component. URL contract: `?b=` build parts, `?r=` resolved conflict keys, both via `setSearchParams(p, { replace: true })`.

- [ ] **Step 1:** `src/data/loadoutBootLines.ts`:

```ts
// ABOUTME: Boot sequence lines for the /loadout ripperdoc chair power-on overlay.
// ABOUTME: Same BootLine shape the Hero terminal uses; consumed by useTyped.
import type { BootLine } from '../types';

export const LOADOUT_BOOT_LINES: BootLine[] = [
  { text: 'RIPPERDOC BENCH  v2.0.77   //   CHAIR POWER-ON', delay: 60 },
  { text: 'CLAMPS ......................... ENGAGED', delay: 60 },
  { text: 'ANAESTHETIC .................... DECLINED', delay: 60 },
  { text: 'ZORD REGISTRY .................. 13 FOUND', delay: 60 },
  { text: 'ISOLATION MASKS ................ VERIFIED', delay: 60 },
  { text: '', delay: 30 },
  { text: '▸  NOTHING GETS WIRED LIVE. INERT UNTIL THE DOC SIGNS OFF.', delay: 60 },
];
```

- [ ] **Step 2: Failing integration tests** — `src/routes/Loadout/Loadout.test.tsx`:

```tsx
// ABOUTME: Integration tests for the /loadout bench — URL state, equip flow, friction
// ABOUTME: updates, conflict resolution, boot dismissal, and graceful bad-param handling.
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Loadout } from './Loadout';

async function renderBench(entry = '/loadout') {
  const utils = render(
    <MemoryRouter initialEntries={[entry]}>
      <Loadout />
    </MemoryRouter>,
  );
  const skip = await screen.findByRole('button', { name: /skip boot/i });
  await userEvent.click(skip);
  await waitFor(() => expect(screen.queryByText(/CHAIR POWER-ON/)).not.toBeInTheDocument());
  return utils;
}

describe('Loadout', () => {
  it('empty bench is UNPOWERED with zeroed HUD', async () => {
    await renderBench();
    expect(screen.getByText(/UNPOWERED/)).toBeInTheDocument();
    expect(screen.getByText(/“UNPOWERED”/)).toBeInTheDocument(); // build name
    expect(screen.getByLabelText(/context load 0 of/)).toBeInTheDocument();
  });

  it('restores a shared build from the URL and resolves its conflict', async () => {
    await renderBench('/loadout?b=L1genome_L3funes_L4hler');
    expect(screen.getByText('GNM·FNS·HLR')).toBeInTheDocument();
    expect(screen.getByText(/The Reliability Spine/)).toBeInTheDocument();
    expect(screen.getByText(/funes ⟷ hler/)).toBeInTheDocument();
    expect(screen.getByLabelText(/drift 2 of/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /resolve — apply isolation mask/i }));
    expect(await screen.findByText(/✓ resolved/)).toBeInTheDocument();
    expect(screen.getByLabelText(/drift 0 of/)).toBeInTheDocument();
  });

  it('equips an implant through slot → card → modal → install', async () => {
    await renderBench();
    await userEvent.click(screen.getByRole('button', { name: /^L3/ }));
    await userEvent.click(screen.getByRole('button', { name: /funes — inspect implant/i }));
    await userEvent.click(screen.getByRole('button', { name: /^install/i }));
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /^L3/ })).toHaveTextContent('funes'),
    );
    expect(screen.queryByText(/UNPOWERED — no cyberware/)).not.toBeInTheDocument();
    expect(screen.getByText('FNS')).toBeInTheDocument();
  });

  it('single-slot equip swaps the occupant', async () => {
    await renderBench('/loadout?b=L3funes');
    await userEvent.click(screen.getByRole('button', { name: /^L3/ }));
    await userEvent.click(screen.getByRole('button', { name: /gravedigger — inspect implant/i }));
    await userEvent.click(
      screen.getByRole('button', { name: /install — replaces funes/i }),
    );
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /^L3/ })).toHaveTextContent('gravedigger'),
    );
  });

  it('flags unknown build parts gracefully', async () => {
    await renderBench('/loadout?b=L1genome_L9bogus');
    expect(screen.getByText(/COULDN'T PARSE PART OF THAT BUILD/i)).toBeInTheDocument();
    expect(screen.getByText('GNM')).toBeInTheDocument();
  });

  it('shows the calibration warning for doomgoblin', async () => {
    await renderBench();
    await userEvent.click(screen.getByRole('button', { name: /doomgoblin — inspect implant/i }));
    expect(screen.getByText(/requires calibration/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 3:** Run → FAIL. **Step 4: Implement** — `src/routes/Loadout/Loadout.tsx`:

```tsx
// ABOUTME: /loadout route — the ripperdoc bench. The URL is the only state store; composes
// ABOUTME: HUD, body nav, candidate tray, implant modal, and the live friction report.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTyped } from '../../hooks/useTyped';
import { LOADOUT_BOOT_LINES } from '../../data/loadoutBootLines';
import {
  CAPACITY, CONFLICTS, COST_BASIS, GENERATED, SHARED_SINKS, SLOTS, STACKS, ZORDS,
  candidatesForSlot, zordByName,
} from '../../data/zords';
import { analyze } from '../../lib/friction';
import {
  autoName, decode, decodeResolved, encode, encodeResolved, shortCode,
} from '../../lib/buildcode';
import { BodyNav } from '../../components/loadout/BodyNav';
import { FrictionPanel } from '../../components/loadout/FrictionPanel';
import { HarnessHUD } from '../../components/loadout/HarnessHUD';
import { ImplantCard } from '../../components/loadout/ImplantCard';
import { ImplantModal } from '../../components/loadout/ImplantModal';
import type { Zord } from '../../types';

function LoadoutBoot({ onDone }: { onDone: () => void }) {
  const { rendered, done } = useTyped(LOADOUT_BOOT_LINES);
  useEffect(() => {
    if (!done) return;
    const t = window.setTimeout(onDone, 400);
    return () => window.clearTimeout(t);
  }, [done, onDone]);
  return (
    <div className="lo-boot" onClick={onDone} role="presentation">
      <div className="lo-boot-panel">
        {rendered.map((line, i) => (
          <div className="lo-boot-line" key={i}>
            {line}
          </div>
        ))}
        <button type="button" className="lo-boot-skip lo-hud-btn" onClick={onDone}>
          Skip boot
        </button>
      </div>
    </div>
  );
}

export function Loadout() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [booted, setBooted] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState('L1');
  const [openZord, setOpenZord] = useState<Zord | null>(null);
  const [copied, setCopied] = useState<'share' | 'code' | null>(null);
  const copiedTimer = useRef<number | null>(null);

  const { loadout, warnings } = useMemo(
    () => decode(searchParams.get('b') ?? '', ZORDS, SLOTS),
    [searchParams],
  );
  const resolved = useMemo(
    () => decodeResolved(searchParams.get('r'), CONFLICTS),
    [searchParams],
  );
  const equipped = useMemo(
    () => loadout.map((e) => zordByName(e.zord)).filter((z): z is Zord => z !== undefined),
    [loadout],
  );
  const report = useMemo(
    () =>
      analyze(
        equipped,
        { conflicts: CONFLICTS, stacks: STACKS, capacity: CAPACITY, sharedSinks: SHARED_SINKS },
        resolved,
      ),
    [equipped, resolved],
  );

  const updateParams = useCallback(
    (b: string, r: string) => {
      const p = new URLSearchParams(searchParams);
      if (b) p.set('b', b);
      else p.delete('b');
      if (r) p.set('r', r);
      else p.delete('r');
      setSearchParams(p, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  const equip = useCallback(
    (z: Zord) => {
      const slot = SLOTS.find((s) => s.id === z.slot);
      const kept = loadout.filter(
        (e) => e.zord !== z.name && !(slot?.single === true && e.slot === z.slot),
      );
      updateParams(encode([...kept, { slot: z.slot, zord: z.name }]), encodeResolved(resolved));
      setOpenZord(null);
    },
    [loadout, resolved, updateParams],
  );

  const unequip = useCallback(
    (z: Zord) => {
      updateParams(encode(loadout.filter((e) => e.zord !== z.name)), encodeResolved(resolved));
      setOpenZord(null);
    },
    [loadout, resolved, updateParams],
  );

  const resolve = useCallback(
    (key: string) => {
      const next = new Set(resolved);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      updateParams(encode(loadout), encodeResolved(next));
    },
    [loadout, resolved, updateParams],
  );

  const flashCopied = useCallback((kind: 'share' | 'code') => {
    setCopied(kind);
    if (copiedTimer.current !== null) window.clearTimeout(copiedTimer.current);
    copiedTimer.current = window.setTimeout(() => setCopied(null), 1600);
  }, []);

  useEffect(
    () => () => {
      if (copiedTimer.current !== null) window.clearTimeout(copiedTimer.current);
    },
    [],
  );

  const buildName = autoName(loadout, ZORDS, STACKS);
  const buildCode = shortCode(loadout, ZORDS);

  const share = useCallback(() => {
    void navigator.clipboard?.writeText(window.location.href).then(() => flashCopied('share'));
  }, [flashCopied]);

  const copy = useCallback(() => {
    void navigator.clipboard
      ?.writeText(`${buildCode} — ${buildName}`)
      .then(() => flashCopied('code'));
  }, [buildCode, buildName, flashCopied]);

  const slot = SLOTS.find((s) => s.id === selectedSlot);
  const candidates = candidatesForSlot(selectedSlot);
  const openSlot = openZord ? SLOTS.find((s) => s.id === openZord.slot) : undefined;
  const replaces =
    openZord && openSlot?.single === true
      ? (loadout.find((e) => e.slot === openZord.slot && e.zord !== openZord.name)?.zord ?? null)
      : null;

  return (
    <section className="section lo-page" id="loadout" data-screen-label="LOADOUT">
      {!booted && <LoadoutBoot onDone={() => setBooted(true)} />}
      <header className="section-head">
        <span className="section-eye">// 05 · RIPPERDOC</span>
        <h1 className="section-title">Loadout.</h1>
      </header>
      <p className="body lo-intro">
        Every implant is a sealed paper reproduction from the megazord registry. Costs are
        measured, buffs are rated, drift is derived from real isolation masks — and nothing gets
        wired live.
      </p>

      <HarnessHUD
        report={report}
        capacity={CAPACITY}
        code={buildCode}
        name={buildName}
        copied={copied}
        onShare={share}
        onCopy={copy}
      />

      {warnings.length > 0 && (
        <div className="lo-notice" role="status">
          COULDN&apos;T PARSE PART OF THAT BUILD — ignored: {warnings.join(', ')}
        </div>
      )}

      {report.unstable && (
        <div className="lo-glitch-panel" role="alert">
          HARNESS INTEGRITY COMPROMISED
          <small>
            I&apos;m sorry, Dave. I&apos;m afraid I can&apos;t wire that.{' '}
            {report.overBudget ? 'Context over budget.' : 'Drift at maximum.'} Export still
            allowed — build stamped UNSTABLE.
          </small>
        </div>
      )}

      <div className="lo-bench">
        <BodyNav slots={SLOTS} loadout={loadout} selected={selectedSlot} onSelect={setSelectedSlot} />
        <div>
          {loadout.length === 0 && (
            <div className="lo-unpowered">// UNPOWERED — no cyberware installed. Pick a slot.</div>
          )}
          <div className="lo-tray-head">
            <span className="lo-tray-title">{slot?.system ?? selectedSlot}</span>
            <span className="lo-tray-rule">
              {slot?.layer} · {slot?.single === true ? 'one active' : 'multiple ok'}
            </span>
          </div>
          {candidates.length === 0 ? (
            <div className="lo-unpowered">Slot reserved — nothing on the shelf yet.</div>
          ) : (
            <div className="lo-cards">
              {candidates.map((z) => (
                <ImplantCard
                  key={z.name}
                  zord={z}
                  equipped={loadout.some((e) => e.zord === z.name)}
                  onOpen={setOpenZord}
                />
              ))}
            </div>
          )}
          {equipped.length > 0 && <FrictionPanel report={report} onResolve={resolve} />}
          <p className="lo-footnote">
            snapshot {GENERATED} · {COST_BASIS} · shared audit sink exempt from drift · proposed
            builds only — activation stays human-gated
          </p>
        </div>
      </div>

      {openZord && (
        <ImplantModal
          zord={openZord}
          equipped={loadout.some((e) => e.zord === openZord.name)}
          replaces={replaces}
          stacks={STACKS}
          slotSystem={SLOTS.find((s) => s.id === openZord.slot)?.system ?? openZord.slot}
          onEquip={equip}
          onUnequip={unequip}
          onClose={() => setOpenZord(null)}
        />
      )}
    </section>
  );
}
```

Note: the doomgoblin calibration test opens the card from the default `L1` slot tray (doomgoblin benches in L1). The empty-bench test asserts both the tray banner (`UNPOWERED — no cyberware`) and the HUD build name (`“UNPOWERED”`).

- [ ] **Step 5:** Register the route in `App.tsx` (import `Loadout`, add `{ path: 'loadout', element: <Loadout /> }` above the `'*'` row), append the nav link, update the `data.test.ts` pin to `['/atisha', '/method', '/colophon', '/loadout']`.
- [ ] **Step 6:** `bun run test` → whole suite PASS (including the updated data pin). `bun run lint` → clean. `bun run build` → clean.
- [ ] **Step 7: Commit** `feat(loadout): ripperdoc bench route — URL state, boot, cyberpsychosis, registration`.

---

### Task 14: E2E (Playwright)

**Files:**
- Create: `~/code/dinnaga/tests/e2e/loadout.spec.ts`
- Modify: `~/code/dinnaga/tests/e2e/routing.spec.ts` (add `{ path: '/loadout', heading: 'Loadout.' }` to its ROUTES table)
- Check: `tests/e2e/responsive.spec.ts` — if it iterates its own route list, add `/loadout`; if it only tests `/`, leave it.

- [ ] **Step 1:** Ensure a browser: `cd ~/code/dinnaga && bunx playwright install chromium` (idempotent).
- [ ] **Step 2: Write the spec** — `tests/e2e/loadout.spec.ts` (e2e files carry no ABOUTME headers, matching the existing specs):

```ts
import { expect, test } from '@playwright/test';

test.describe('/loadout ripperdoc bench', () => {
  test('equip → conflict → resolve → share URL restores the build', async ({ page }) => {
    await page.goto('/loadout');
    await page.getByRole('button', { name: /skip boot/i }).click();

    await page.getByRole('button', { name: /^L1 / }).click();
    await page.getByRole('button', { name: /genome — inspect implant/i }).click();
    await page.getByRole('button', { name: /^install/i }).click();

    await page.getByRole('button', { name: /^L3 / }).click();
    await page.getByRole('button', { name: /funes — inspect implant/i }).click();
    await page.getByRole('button', { name: /^install/i }).click();

    await page.getByRole('button', { name: /^L4 / }).click();
    await page.getByRole('button', { name: /hler — inspect implant/i }).click();
    await page.getByRole('button', { name: /^install/i }).click();

    await expect(page.getByText(/funes ⟷ hler/)).toBeVisible();
    await expect(page.locator('.lo-build-name')).toHaveText(/Reliability Spine/);

    await page.getByRole('button', { name: /resolve — apply isolation mask/i }).click();
    await expect(page.getByText(/✓ resolved/)).toBeVisible();

    const url = page.url();
    expect(url).toContain('b=L1genome_L3funes_L4hler');
    expect(url).toContain('r=funes~hler');

    await page.goto(url);
    await page.getByRole('button', { name: /skip boot/i }).click();
    await expect(page.getByText('GNM·FNS·HLR')).toBeVisible();
    await expect(page.getByText(/✓ resolved/)).toBeVisible();
  });

  test('reduced motion renders the bench without a boot animation', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/loadout');
    await expect(page.getByRole('heading', { name: 'Loadout.' })).toBeVisible();
    await expect(page.locator('.lo-boot')).toHaveCount(0, { timeout: 5000 });
  });

  test('unstable build stamps but never blocks', async ({ page }) => {
    // Max legal loadout (one per single slot + all diagnostics) overflows the context budget.
    const b = [
      'L1genome', 'L2openskill', 'L2.5gauntlet', 'L2.7yeetriever', 'L3thonktank', 'L4hler',
      'DIAGblamethrower', 'DIAGgumshoe', 'DIAGskidmark-leak', 'DIAGskidmark-traj',
    ].join('_');
    await page.goto(`/loadout?b=${b}`);
    await page.getByRole('button', { name: /skip boot/i }).click();
    await expect(page.getByText('HARNESS INTEGRITY COMPROMISED')).toBeVisible();
    await expect(page.getByText(/I'm sorry, Dave/)).toBeVisible();
    await expect(page.getByText(/unstable build/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /share/i })).toBeEnabled();
  });
});
```

- [ ] **Step 3:** Add the routing table row. Run `bun run test:e2e` → all specs (old + new) PASS. If the URL assertions fail on param encoding, debug the codec — do not loosen assertions to `toContain('b=')`.
- [ ] **Step 4: Commit** `test(loadout): e2e — equip/resolve/share round-trip, reduced motion, unstable build`.

---

### Task 15: Full verification + visual polish + docs

**Files:**
- Modify (values only, no class renames): `~/code/dinnaga/src/styles/loadout.css`
- Modify: `~/code/dinnaga/docs/STATUS.md` (add `/loadout` row + megazord sync note)

- [ ] **Step 1: Full gate, in order** (all must be pristine):

```bash
cd ~/code/megazord && uv run pytest -q          # exporter suite green
cd ~/code/dinnaga && bun run lint && bun run test && bun run build && bun run test:e2e
```

- [ ] **Step 2: Visual pass.** `bun run dev` (port 4242), then with chrome-devtools MCP: screenshot `http://localhost:4242/loadout` at 1440×900 and 375×812 — empty bench, a 3-implant build (`?b=L1genome_L3funes_L4hler`), the modal open, and the unstable build from Task 14. Judge against the Gurney Chrome intent: chamfered tier frames read clearly, gauges look like relays not progress bars, compromised state is menacing but legible, mobile stacks cleanly, nothing bleeds into landing-page styling. Refine `loadout.css` values only; re-run `bun run test` after edits.
- [ ] **Step 3:** Update `docs/STATUS.md`: `/loadout` live on branch, data flow line (`megazord export-json → src/data/zords.json`, manual sync), easter-egg inventory.
- [ ] **Step 4:** `git add -A && git commit -m "polish(loadout): visual pass + status docs"` (or fold into prior commits if empty).
- [ ] **Step 5:** Fresh-eyes check against spec §16 success criteria — browse all zords by system ✓ modal ✓ equip coherent loadout with live gauges ✓ conflicts from real isolation masks ✓ URL share/restore ✓ measured/rated/derived labels ✓ megazord canonical, site vendored, nothing live ✓. Report deviations list (header of this plan) to David.

---

## Self-review (completed at planning time)

- **Spec coverage:** §3 isomorphism table → data contract + overlay; §4 data model → Tasks 1–4; §5 slots → overlay `[[slots]]` + BodyNav; §6 tiers → `TIER_FOR_STATUS` + tokens; §7 card/modal → Tasks 8–9; §8 friction → Task 5 (all five rules: slot collision is structurally prevented by `decode` + swap-equip, guarded by the single-slot dupe warning test); §9 bench layout → Tasks 7/10/13; §10 URL state → Task 6 + route; §11 easter eggs → boot overlay, glitch panel, UNPOWERED, all reduced-motion-gated; §12 file architecture → matches (naming: `loadoutBootLines.ts` added); §13 testing → unit (5, 6, data schema), RTL (8–13), e2e (14); §14 edge cases → empty (13), full single slots (14 unstable test), multi-DIAG (6, 14), unresolved-export-allowed (14), unknown id (6, 13), reduced motion (14), one-candidate slots (L2/L2.5/L2.7/L4 render fine), zero-candidate slot (13 "Slot reserved"); §15 decisions honored; §16 criteria → Task 15 Step 5.
- **Type consistency:** `FrictionReport.overBudget` added everywhere it's consumed (HUD, route, tests); `conflictKey(a, b)` two-arg form used consistently; `decode` returns sorted canonical loadout (Task 13's `equip` re-encodes, keeping URLs canonical); `Provenance` includes `reproduced` and the exporter's overlay only emits valid values (pytest-checked, vitest-checked).
- **Placeholders:** none — every step has full code or an exact command with expected output.
- **Known judgment call for implementers:** if `useTyped`'s reduced-motion guard makes jsdom render boot lines instantly, the `Skip boot` click path in tests still works (button always renders until `booted`).


