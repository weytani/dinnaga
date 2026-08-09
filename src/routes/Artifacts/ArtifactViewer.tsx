// ABOUTME: Artifact viewer route (/artifacts/:slug) — compact header strip over a
// ABOUTME: full-bleed iframe rendering the static doc; unknown slugs render NotFound.
import { useParams } from 'react-router-dom';
import { ARTIFACTS } from '../../data/artifacts';
import { NotFound } from '../NotFound/NotFound';

export function ArtifactViewer() {
  const { slug } = useParams();
  const artifact = ARTIFACTS.find((a) => a.slug === slug);
  if (!artifact) return <NotFound />;
  return (
    <section
      className="section artifact-viewer"
      id="artifact-viewer"
      data-screen-label={artifact.project}
    >
      <header className="artifact-strip">
        <span className="section-eye">// {artifact.project}</span>
        <h1 className="artifact-strip-title">{artifact.title}</h1>
        <span className="artifact-date">published {artifact.published}</span>
        {artifact.note && <p className="artifact-note">{artifact.note}</p>}
        <a className="artifact-open" href={artifact.docPath}>
          Open standalone →
        </a>
      </header>
      <iframe className="artifact-frame" src={artifact.docPath} title={artifact.title} />
    </section>
  );
}
