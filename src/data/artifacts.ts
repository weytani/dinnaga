// ABOUTME: The artifact shelf — standalone research documents served from public/artifact-docs/.
// ABOUTME: Rendered by the /artifacts index and /artifacts/:slug viewer routes.
import type { ArtifactEntry } from '../types';

export const ARTIFACTS: ArtifactEntry[] = [
  {
    slug: 'slamwich-tasting-report',
    title: 'SLAMWICH Tasting Report',
    project: 'SLAMWICH',
    oneLiner:
      'The synthesis of the 84-dish portfolio test kitchen — corpus traits, the technique leaderboard, and specimen walkthroughs.',
    published: '2026-08-08',
    docPath: '/artifact-docs/slamwich-tasting-report.html',
    note: 'Dish links inside the report point at the SLAMWICH dev kitchen on localhost:9021 — they only resolve on the lab bench.',
  },
];
