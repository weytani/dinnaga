// ABOUTME: Transmission dispatch — a static announcement block with a direct contact.
// ABOUTME: No fake signup; the lab does not run a mailing list.
export function Transmission() {
  return (
    <section className="transmission" id="dispatch" data-screen-label="Transmission">
      <div className="tx-inner">
        <span className="section-eye">// TRANSMISSION</span>
        <h2 className="tx-title">The Atisha Initiative is open.</h2>
        <p style={{ color: 'var(--fg-3)', margin: 0, fontFamily: 'var(--font-body)', fontSize: 16 }}>
          A public, open-source reference of what we have validated as genuinely useful. No mailing
          list, no funnel — the catalog lives in the open and grows as we validate.
        </p>
      </div>
    </section>
  );
}
