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
