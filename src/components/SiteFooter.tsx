// ABOUTME: Site footer — brand block, route link columns, and bottom meta strip.
// ABOUTME: Links route within the SPA; the Atisha column points at the open Atisha Initiative project board.
import { Link } from 'react-router-dom';
import { BrandMark } from './BrandMark';
import { ATISHA_PROJECT_URL } from '../data/links';

export function SiteFooter() {
  return (
    <footer className="foot" id="footer">
      <div className="foot-inner">
        <div className="foot-brand">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <BrandMark size={28} />
            <span className="word">DINNAGA</span>
          </div>
          <p>
            An anonymous AI research lab. We validate what is genuinely useful and publish it openly,
            to make adoption faster for everyone.
          </p>
        </div>
        <nav className="foot-col" aria-label="The lab">
          <h4>The lab</h4>
          <Link to="/method">How we work</Link>
          <Link to="/atisha">Atisha Initiative</Link>
          <Link to="/colophon">Colophon</Link>
        </nav>
        <nav className="foot-col" aria-label="Open source">
          <h4>Open source</h4>
          <a href={ATISHA_PROJECT_URL}>Atisha project</a>
        </nav>
      </div>
      <div className="foot-meta">
        <span>© 2026 DINNAGA</span>
        <span>// VALIDATE · THEN SHARE</span>
        <span>// OPEN SOURCE</span>
      </div>
    </footer>
  );
}
