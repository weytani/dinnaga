// ABOUTME: Compact cyberware candidate card for the /loadout tray grid — name, tier pips,
// ABOUTME: manufacturer, measured context cost, and the reproduced headline.
import type { Zord } from '../../types';

const TIER_PIPS: Record<string, number> = {
  common: 1,
  uncommon: 2,
  rare: 3,
  epic: 4,
  legendary: 5,
};

interface ImplantCardProps {
  zord: Zord;
  equipped: boolean;
  onOpen: (zord: Zord) => void;
}

export function ImplantCard({ zord, equipped, onOpen }: ImplantCardProps) {
  const pips = TIER_PIPS[zord.tier] ?? 1;
  return (
    <button
      type="button"
      className={`lo-card lo-tier-${zord.tier}`}
      onClick={() => onOpen(zord)}
      aria-label={`${zord.name} — inspect implant`}
    >
      <span className="lo-card-top">
        <span className="lo-card-name">{zord.name.toUpperCase()}</span>
        {equipped && <span className="lo-card-equipped">INSTALLED</span>}
      </span>
      <span className="lo-card-tier">
        {zord.tier.toUpperCase()} {'◆'.repeat(pips)}
        {'◇'.repeat(5 - pips)}
      </span>
      <span className="lo-card-meta">
        {zord.manufacturer.toUpperCase()} · +{(zord.contextCostTokens / 1000).toFixed(2)}k CTX
      </span>
      <span className="lo-card-headline">{zord.headline}</span>
    </button>
  );
}
