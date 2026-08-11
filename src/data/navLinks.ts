// ABOUTME: Primary navigation model — label + route target for each top-level link.
// ABOUTME: Order is the on-screen order.
import type { NavLink } from '../types';

export const NAV_LINKS: NavLink[] = [
  { label: 'Atisha', to: '/atisha' },
  { label: 'How We Work', to: '/method' },
  { label: 'Colophon', to: '/colophon' },
  { label: 'Loadout', to: '/loadout' },
  { label: 'Artifacts', to: '/artifacts' },
  { label: 'Weekly', to: '/weekly' },
];
