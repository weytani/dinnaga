// ABOUTME: Field-notes section — a filterable 2×2 seam-grid of the latest entries.
// ABOUTME: The filter chip set is derived from the FieldNote category union.
import { useState } from 'react';
import type { Category, FieldNote } from '../types';
import { FIELD_NOTES } from '../data/fieldNotes';

const CATS: Array<Category | 'ALL'> = ['ALL', 'RESEARCH', 'EDUCATION', 'CONSULTING'];

interface NoteProps {
  note: FieldNote;
}

function Note({ note }: NoteProps) {
  return (
    <a className="note" href={'#' + note.id}>
      <div className="note-meta">
        <span className="note-cat">{note.cat}</span>
        <span>{note.date}</span>
      </div>
      <h3 className="note-title">{note.title}</h3>
      <p className="note-excerpt">{note.excerpt}</p>
      <div className="note-foot">
        <span>{note.readTime}</span>
        <span className="spacer" />
        <span className="note-read">▸ READ</span>
      </div>
    </a>
  );
}

export function FieldNotes() {
  const [filter, setFilter] = useState<Category | 'ALL'>('ALL');
  const visible = filter === 'ALL' ? FIELD_NOTES : FIELD_NOTES.filter((n) => n.cat === filter);
  return (
    <section className="section" id="field-notes" data-screen-label="Field Notes">
      <header className="section-head">
        <span className="section-eye">// 03 · FIELD NOTES</span>
        <h2 className="section-title">What we've been writing.</h2>
      </header>
      <div className="notes-toolbar">
        {CATS.map((c) => (
          <button
            key={c}
            className={'filter-chip' + (filter === c ? ' is-active' : '')}
            onClick={() => setFilter(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="notes-grid">
        {visible.map((n) => (
          <Note key={n.id} note={n} />
        ))}
      </div>
    </section>
  );
}
