// ABOUTME: Proof section — live registry stats + the ripperdoc bench screenshot, linking to /loadout.
// ABOUTME: Stats are derived at render time from the vendored ZORDS snapshot, never hardcoded copy.
import { Link, useNavigate } from 'react-router-dom';
import { ZORDS } from '../data/zords';

interface InstrStatProps {
  value: string;
  label: string;
}

function InstrStat({ value, label }: InstrStatProps) {
  return (
    <div className="instr-stat">
      <b>{value}</b>
      <span>{label}</span>
    </div>
  );
}

function registryStats() {
  const implants = ZORDS.length;
  const papers = new Set(ZORDS.map((z) => z.paper)).size;

  const firstTestsByPaper = new Map<string, number>();
  for (const z of ZORDS) {
    if (!firstTestsByPaper.has(z.paper)) firstTestsByPaper.set(z.paper, z.tests);
  }
  const tests = [...firstTestsByPaper.values()].reduce((sum, n) => sum + n, 0);

  return { implants, papers, tests };
}

export function Instruments() {
  const navigate = useNavigate();
  const { implants, papers, tests } = registryStats();

  return (
    <section className="section instruments" id="instruments" data-screen-label="Instruments">
      <header className="section-head">
        <span className="section-eye">// 04 · INSTRUMENTS</span>
        <h2 className="section-title">Proof you can pick up.</h2>
      </header>
      <p className="body">
        The Atisha bar is "genuinely useful, checkable." The ripperdoc bench is that bar made
        playable: our sealed paper reproductions rendered as cyberware implants — measured context
        costs, real isolation masks, honestly rated buffs. Equip a build and watch real gauges move.
      </p>
      <div className="instr-stats">
        <InstrStat value={String(implants)} label="IMPLANTS ON THE SHELF" />
        <InstrStat value={String(papers)} label="PAPERS REPRODUCED" />
        <InstrStat value={tests.toLocaleString('en-US')} label="TESTS GREEN" />
      </div>
      <Link className="instr-shot-link" to="/loadout">
        <img
          className="instr-shot"
          src="/assets/loadout-bench.png"
          alt="The ripperdoc bench with a three-implant build equipped — HUD gauges, body navigator, and friction report"
          loading="lazy"
        />
      </Link>
      <button className="btn btn-primary" onClick={() => navigate('/loadout')}>
        Equip a loadout
      </button>
      <p className="instr-note">proposed builds only — nothing gets wired live.</p>
    </section>
  );
}
