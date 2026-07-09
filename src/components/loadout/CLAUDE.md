React components for the `/loadout` ripperdoc bench — the cyberware-implant
metaphor for equipping megazord zords onto an agent harness. Each renders
`Zord`/`FrictionReport`/`Capacity` shapes from `../../types`; none reads
`../../data/zords` directly — data flows down as props from the `Loadout`
route.

- `BodyNav.tsx` — left-rail slot navigator grouped by body system, with an
  anatomical figure that lights up installed regions.
- `ImplantCard.tsx` — compact candidate card for the tray grid (tier pips,
  manufacturer, measured context cost, reproduced headline).
- `ImplantModal.tsx` — full stat-card detail modal: measured costs, rated
  buffs, set-bonus hints, isolation slices, calibration flag, install/
  uninstall actions.
- `FrictionPanel.tsx` — live friction report: set bonuses, registered
  conflicts with RESOLVE actions, read-after-write hazards.
- `HarnessHUD.tsx` — sticky HUD bar: context/drift gauges, friction counts,
  build code + name, share/copy actions, and the cyberpsychosis
  (over-budget/max-drift) presentation.

Every component here has a co-located `.test.tsx`. Screenshots of the
rendered bench live in `../../../docs/screenshots/`.
