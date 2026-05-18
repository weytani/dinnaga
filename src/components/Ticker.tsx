// ABOUTME: Section ticker — a 38s linear marquee of system announcements.
// ABOUTME: Renders the joined item text twice so the CSS marquee loops seamlessly.
interface TickerProps {
  items: string[];
}

export function Ticker({ items }: TickerProps) {
  const text = items.join('   ·   ');
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">
        <span className="ticker-text">{text}&nbsp;&nbsp;</span>
        <span className="ticker-text">{text}&nbsp;&nbsp;</span>
      </div>
    </div>
  );
}
