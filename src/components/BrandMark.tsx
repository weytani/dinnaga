// ABOUTME: Dinnaga hexagonal "gate" brand mark, rendered as inline SVG.
// ABOUTME: Inherits color via currentColor; sized by the `size` prop.
interface BrandMarkProps {
  size?: number;
  color?: string;
}

export function BrandMark({ size = 24, color = 'currentColor' }: BrandMarkProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true" style={{ color }}>
      <path d="M20 2 L36 11 L36 29 L20 38 L4 29 L4 11 Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 12 L12 28 L24 28 L28 24 L28 16 L24 12 Z" fill="currentColor" />
      <rect x="14" y="18" width="10" height="4" fill="#000" />
    </svg>
  );
}
