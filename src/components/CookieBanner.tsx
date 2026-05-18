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
