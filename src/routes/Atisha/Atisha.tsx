// ABOUTME: Atisha Initiative route (/atisha) — the open-source validated-reference front door.
// ABOUTME: Renders mission, the validation bar, and the catalog (or an honest empty-state).
import { ATISHA_CATALOG } from '../../data/atishaCatalog';
import { ATISHA_REPO_URL } from '../../data/links';
import type { AtishaEntry } from '../../types';

export function Atisha({ entries = ATISHA_CATALOG }: { entries?: AtishaEntry[] } = {}) {
  return (
    <main className="section" id="atisha" data-screen-label="Atisha Initiative">
      <header className="section-head">
        <span className="section-eye">// VALIDATED, THEN SHARED</span>
        <h1 className="section-title">The Atisha Initiative.</h1>
      </header>
      <p className="panel-body">
        Atisha is an{' '}
        <a href={ATISHA_REPO_URL}>open-source reference</a> of the tools, skills, and methods the lab
        has validated as genuinely useful — published openly to make AI adoption faster for everyone.
      </p>
      <p className="panel-body">
        The bar: we have to have used it and checked it ourselves. Veracity-first, real APIs, no
        mocks. Third-party tools we rely on are credited, never claimed.
      </p>

      {entries.length === 0 ? (
        <p className="atisha-empty">
          ▸ The first validated entries are on the way. The catalog lives in the open at{' '}
          <a href={ATISHA_REPO_URL}>Dinnaga-Research/atisha</a>.
        </p>
      ) : (
        <ul className="atisha-catalog">
          {entries.map((e) => (
            <li className="atisha-entry" key={e.slug}>
              <span className="atisha-cat">{e.category.toUpperCase()}</span>
              <h3 className="atisha-title">{e.title}</h3>
              <p className="atisha-oneliner">{e.oneLiner}</p>
              <p className="atisha-why">{e.whyUseful}</p>
              <p className="atisha-howvalidated">How we validated it: {e.howValidated}</p>
              <footer className="atisha-foot">
                <a href={e.sourceUrl}>source →</a>
                {e.attribution && <span className="atisha-attr">via {e.attribution}</span>}
                <span className="atisha-date">validated {e.validatedOn}</span>
              </footer>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
