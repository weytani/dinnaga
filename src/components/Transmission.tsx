// ABOUTME: Transmission signup — mono email field plus primary CTA.
// ABOUTME: Local-only success state; there is no backend, the UI is honest about it.
import { useState, type FormEvent } from 'react';

export function Transmission() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.includes('@')) return;
    setSent(true);
  };

  return (
    <section className="transmission" id="education" data-screen-label="Transmission">
      <div className="tx-inner">
        <span className="section-eye">// 06 · TRANSMISSION</span>
        <h2 className="tx-title">Stay on the wire.</h2>
        <p style={{ color: 'var(--fg-3)', margin: 0, fontFamily: 'var(--font-body)', fontSize: 16 }}>
          One transmission a month — new papers, workshop dates, field notes. You can leave any
          time.
        </p>
        {!sent ? (
          <form className="tx-form" onSubmit={onSubmit}>
            <input
              className="input"
              type="email"
              placeholder="you@somewhere.ai"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email"
            />
            <button className="btn btn-primary" type="submit">
              Subscribe
            </button>
          </form>
        ) : (
          <div className="tx-success">
            <span className="dot dot-live" />▸ TRANSMISSION ACCEPTED · CHECK YOUR INBOX
          </div>
        )}
      </div>
    </section>
  );
}
