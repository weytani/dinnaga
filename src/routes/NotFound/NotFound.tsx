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
