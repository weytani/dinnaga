// ABOUTME: Shared doc-viewer chrome — compact header strip (eyebrow, title, meta, optional
// ABOUTME: note, standalone link) over a full-bleed iframe rendering a static doc.

interface DocFrameProps {
  eyebrow: string;
  title: string;
  meta: string;
  note?: string;
  docPath: string;
  screenLabel: string;
}

export function DocFrame({ eyebrow, title, meta, note, docPath, screenLabel }: DocFrameProps) {
  return (
    <section className="section artifact-viewer" id="artifact-viewer" data-screen-label={screenLabel}>
      <header className="artifact-strip">
        <span className="section-eye">{eyebrow}</span>
        <h1 className="artifact-strip-title">{title}</h1>
        <span className="artifact-date">{meta}</span>
        {note && <p className="artifact-note">{note}</p>}
        <a className="artifact-open" href={docPath}>
          Open standalone →
        </a>
      </header>
      <iframe className="artifact-frame" src={docPath} title={title} />
    </section>
  );
}
