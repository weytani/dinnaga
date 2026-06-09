// ABOUTME: Shared TypeScript types for Dinnaga site content.
// ABOUTME: Consumed by data files in src/data/ and the components that render them.

export type Category = 'RESEARCH' | 'EDUCATION' | 'CONSULTING';

export interface FieldNote {
  id: string;
  cat: Category;
  date: string;
  readTime: string;
  title: string;
  excerpt: string;
}

export type PracticeIconName = 'ethos' | 'method' | 'atisha';

export interface Practice {
  num: string;
  title: string;
  icon: PracticeIconName;
  summary: string;
  body: string;
  meta: string;
}

export interface DataRow {
  idx: string;
  label: string;
  value: string;
}

export interface BootLine {
  text: string;
  delay: number;
}

export interface NavLink {
  label: string;
  to: string;
}

export type AtishaCategory = 'skill' | 'tool' | 'method' | 'paper';

export interface AtishaEntry {
  slug: string;
  title: string;
  category: AtishaCategory;
  oneLiner: string;
  sourceUrl: string;
  validatedOn: string;
  whyUseful: string;
  howValidated: string;
  attribution: string;
}
