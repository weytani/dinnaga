// ABOUTME: The five-stage project-planning loop shown on the How We Work page.
export interface MethodStage { num: string; name: string; detail: string; }

export const METHOD_STAGES: MethodStage[] = [
  { num: '01', name: 'Read', detail: 'Find interesting papers, posts, and releases. Queue them.' },
  { num: '02', name: 'Digest', detail: 'Read them. Write up what actually matters.' },
  { num: '03', name: 'Ideate', detail: 'Promising ideas get a note worth coming back to.' },
  { num: '04', name: 'Experiment', detail: 'Build it, try it, see what happens. Most die here.' },
  { num: '05', name: 'Ship', detail: 'What survives becomes a skill, tool, or workflow — and a candidate for Atisha.' },
];
