// ABOUTME: The lab's stance + two pillars — ethos / Project Planning / Atisha Initiative.
// ABOUTME: Each card expands on click or Enter/Space to reveal a longer body.
import { useState } from 'react';
import type { PracticeIconName } from '../types';
import { PRACTICES } from '../data/practices';

interface PracticeIconProps {
  name: PracticeIconName;
}

function PracticeIcon({ name }: PracticeIconProps) {
  const common = { strokeLinecap: 'square', strokeLinejoin: 'miter' } as const;
  if (name === 'method') {
    return (
      <svg className="practice-icon" viewBox="0 0 24 24" {...common}>
        <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
        <polyline points="14 3 14 9 20 9" />
        <line x1="8" y1="13" x2="16" y2="13" />
        <line x1="8" y1="17" x2="14" y2="17" />
      </svg>
    );
  }
  if (name === 'atisha') {
    return (
      <svg className="practice-icon" viewBox="0 0 24 24" {...common}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    );
  }
  return (
    <svg className="practice-icon" viewBox="0 0 24 24" {...common}>
      <circle cx="12" cy="12" r="10" />
      <polygon points="16 8 13 13 8 16 11 11 16 8" />
    </svg>
  );
}

interface PracticeCardProps {
  num: string;
  title: string;
  icon: PracticeIconName;
  summary: string;
  body: string;
  meta: string;
  open: boolean;
  onToggle: () => void;
}

function PracticeCard({ num, title, icon, summary, body, meta, open, onToggle }: PracticeCardProps) {
  return (
    <div
      className={'practice' + (open ? ' is-open' : '')}
      onClick={onToggle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle();
        }
      }}
    >
      <PracticeIcon name={icon} />
      <span className="practice-num">// {num}</span>
      <h3 className="practice-title">{title}</h3>
      <p className="practice-body">{open ? body : summary}</p>
      <span className="practice-meta">{meta}</span>
    </div>
  );
}

export function Practices() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <section className="section" id="lab" data-screen-label="Practices">
      <header className="section-head">
        <span className="section-eye">// 01 · THE LAB</span>
        <h2 className="section-title">How the lab works.</h2>
      </header>
      <div className="practices">
        {PRACTICES.map((it, i) => (
          <PracticeCard
            key={it.num}
            {...it}
            open={openIdx === i}
            onToggle={() => setOpenIdx(openIdx === i ? null : i)}
          />
        ))}
      </div>
    </section>
  );
}
