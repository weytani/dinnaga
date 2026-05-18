// ABOUTME: Site footer — brand block, three link columns, and bottom meta strip.
// ABOUTME: Footer column links are structural and kept local to this component.
import { BrandMark } from './BrandMark';

interface FooterColumn {
  title: string;
  links: string[];
}

const FOOTER_COLUMNS: FooterColumn[] = [
  { title: 'Research', links: ['Latest papers', 'Field notes', 'Open data', 'Methods'] },
  {
    title: 'Education',
    links: ['Foundations cohort', 'Advanced topics', 'Curriculum (CC-BY)', 'Scholarships'],
  },
  { title: 'Studio', links: ['About', 'Consulting brief', 'Press', 'Contact'] },
];

export function SiteFooter() {
  return (
    <footer className="foot" id="consulting">
      <div className="foot-inner">
        <div className="foot-brand">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <BrandMark size={28} />
            <span className="word">DINNAGA</span>
          </div>
          <p>
            Research, education, and consulting toward the broadest possible adoption of useful AI.
            Independent, distributed, mostly outdoors.
          </p>
        </div>
        {FOOTER_COLUMNS.map((c) => (
          <nav className="foot-col" key={c.title} aria-label={c.title}>
            <h4>{c.title}</h4>
            {c.links.map((l) => (
              <a key={l} href="#">
                {l}
              </a>
            ))}
          </nav>
        ))}
      </div>
      <div className="foot-meta">
        <span>© 2026 DINNAGA RESEARCH</span>
        <span>// CC-BY 4.0 EXCEPT WHERE NOTED</span>
        <span>LAST TRANSMISSION 2026-04-16 · 18:42Z</span>
      </div>
    </footer>
  );
}
