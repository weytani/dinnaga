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
