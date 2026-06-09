// ABOUTME: The lab's stance + two pillars — rendered by Practices.tsx.
// ABOUTME: Open-source ethos, the project-planning funnel, and the Atisha Initiative.
import type { Practice } from '../types';

export const PRACTICES: Practice[] = [
  {
    num: '01',
    title: 'Open by ethos',
    icon: 'ethos',
    summary: 'We validate things and share what is genuinely useful, openly.',
    body: 'We validate things and share what is genuinely useful, openly — to make AI adoption faster for everyone. The lab is anonymous; the work is real and checkable.',
    meta: '▸ open source',
  },
  {
    num: '02',
    title: 'Project Planning',
    icon: 'method',
    summary: 'How the work happens: Read → Digest → Ideate → Experiment → Ship.',
    body: 'How the work happens. We read papers and releases, digest what matters, ideate, build experiments, and ship the ones that survive. The funnel that feeds everything else.',
    meta: '▸ read → ship',
  },
  {
    num: '03',
    title: 'The Atisha Initiative',
    icon: 'atisha',
    summary: 'The open-source reference of what we validated as worth sharing.',
    body: 'What comes out the other end: a public, open-source reference of the tools, skills, and methods we have validated as genuinely useful — so you do not have to take it on faith.',
    meta: '▸ validated, then shared',
  },
];
