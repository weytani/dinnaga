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
