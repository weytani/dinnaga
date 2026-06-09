// ABOUTME: Hero — 7/5 split: super-type headline + lede + CTAs, and a boot terminal.
// ABOUTME: The terminal types its boot sequence on mount then invites a question.
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTyped } from '../hooks/useTyped';
import { BOOT_LINES } from '../data/bootLines';
import type { BootLine } from '../types';

interface HeroMedia {
  type: 'video' | 'image';
  src: string;
  poster?: string;
  alt?: string;
}

interface HeroProps {
  media?: HeroMedia;
}

export function Hero({ media }: HeroProps) {
  const navigate = useNavigate();
  return (
    <section className="hero" id="top">
      <div>
        <span className="hero-eyebrow">// 01 · DINNAGA</span>
        <h1 className="hero-title">Validated, then shared.</h1>
        <p className="hero-lede">
          An anonymous research lab at the consumer-AI frontier. We try things, validate what's
          genuinely useful, and publish it openly — to make adoption faster for everyone.
        </p>
        <div className="hero-ctas">
          <button className="btn btn-primary" onClick={() => navigate('/atisha')}>
            See the Atisha Initiative
          </button>
          <button className="btn btn-ghost" onClick={() => navigate('/method')}>
            How we work
          </button>
        </div>
      </div>
      <div className="hero-art">
        <Terminal media={media} />
      </div>
    </section>
  );
}

interface TerminalProps {
  media?: HeroMedia;
  bootLines?: BootLine[];
}

interface HistoryEntry {
  kind: 'in' | 'out';
  text: string;
}

export function Terminal({ media, bootLines = BOOT_LINES }: TerminalProps) {
  const { rendered, done } = useTyped(bootLines);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [sent, setSent] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (done && inputRef.current && !sent) inputRef.current.focus();
  }, [done, sent]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = input.trim();
    if (!q) return;
    setHistory((h) => [
      ...h,
      { kind: 'in', text: q },
      { kind: 'out', text: '▸ TRANSMISSION RECEIVED. AN OPERATOR WILL REPLY WITHIN 48H.' },
    ]);
    setInput('');
    setSent(true);
  };

  return (
    <div className="terminal" aria-label="Dinnaga terminal">
      {media && media.type === 'video' && (
        <video
          className="terminal-media"
          src={media.src}
          poster={media.poster}
          autoPlay
          muted
          loop
          playsInline
        />
      )}
      {media && media.type === 'image' && (
        <img className="terminal-media" src={media.src} alt={media.alt ?? ''} />
      )}

      <div className="terminal-chrome">
        <span className="terminal-chrome-tag">SIGNAL // 042</span>
        <span className="terminal-chrome-meta">DINNAGA-OS · ENCRYPTED · 18:42Z</span>
        <span className="terminal-chrome-dots" aria-hidden="true">
          <i></i>
          <i></i>
          <i></i>
        </span>
      </div>

      <div className="terminal-screen">
        <div className="terminal-curvature" aria-hidden="true" />
        <div className="terminal-scanlines" aria-hidden="true" />
        <div className="terminal-flicker" aria-hidden="true" />

        <div className="terminal-body">
          {rendered.map((t, i) => (
            <div className="t-line" key={i}>
              {t || ' '}
            </div>
          ))}

          {history.map((h, i) => (
            <div className={'t-line ' + (h.kind === 'in' ? 't-in' : 't-out')} key={'h' + i}>
              {h.kind === 'in' ? '> ' + h.text : h.text}
            </div>
          ))}

          {done && !sent && (
            <form className="t-prompt" onSubmit={onSubmit}>
              <span className="t-caret">&gt;</span>
              <input
                ref={inputRef}
                className="t-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="ASK A QUESTION_"
                spellCheck={false}
                autoComplete="off"
                aria-label="Ask Dinnaga a question"
              />
              <span className="t-cursor" aria-hidden="true">
                ▮
              </span>
            </form>
          )}

          {done && sent && (
            <div className="t-prompt is-done">
              <span className="t-caret">&gt;</span>
              <span style={{ color: 'var(--signal)' }}>
                NEW TRANSMISSION CLOSED. AWAITING REPLY.
              </span>
              <button
                type="button"
                className="t-reset"
                onClick={() => {
                  setSent(false);
                  setHistory([]);
                }}
              >
                [RESET]
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="terminal-foot">
        <span>
          <span className="dot dot-live" /> UPLINK STABLE
        </span>
        <span>PING 42ms</span>
        <span>FIDELITY 87%</span>
        <span>OP · DINNAGA</span>
      </div>
    </div>
  );
}
