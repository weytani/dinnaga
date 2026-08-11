// ABOUTME: Weekly run-log route (/weekly) — the chronological log of Saturday
// ABOUTME: week-in-review runs, newest-first, each linking into the /weekly/:date viewer.
import { Link } from 'react-router-dom';
import { WEEKLY_RUNS } from '../../data/weeklyRuns';

export function WeeklyLog() {
  return (
    <section className="section" id="weekly" data-screen-label="Weekly">
      <header className="section-head">
        <span className="section-eye">// WEEKLY</span>
        <h1 className="section-title">The Saturday run log.</h1>
      </header>
      <p className="panel-body">
        Every Saturday the lab runs a week-in-review pass over its own transcripts. Each run logs
        here and links to the full report.
      </p>
      <ul className="artifact-index">
        {WEEKLY_RUNS.map((r) => (
          <li className="artifact-entry" key={r.date}>
            <span className="artifact-project">{r.windowLabel}</span>
            <h3 className="artifact-title">
              <Link to={`/weekly/${r.date}`}>Week in review — {r.date}</Link>
            </h3>
            <p className="artifact-oneliner">{r.summary}</p>
            <footer className="artifact-foot">
              <span className="artifact-date">run {r.date}</span>
            </footer>
          </li>
        ))}
      </ul>
    </section>
  );
}
