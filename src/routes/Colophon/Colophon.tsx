// ABOUTME: Colophon route (/colophon) — about the lab: persona rules and how the site is built.
// ABOUTME: No personal name; states the lab's anonymity and how the site is made.
export function Colophon() {
  return (
    <section className="section" id="colophon" data-screen-label="Colophon">
      <header className="section-head">
        <span className="section-eye">// COLOPHON</span>
        <h1 className="section-title">Colophon.</h1>
      </header>
      <div className="panel-body-wrap">
        <p className="panel-body">
          Dinnaga is an anonymous research lab. We do not put names to the work — the work is
          meant to stand on whether it is true and useful, not on who made it. Anonymous by design.
        </p>
        <p className="panel-body">
          Built as a static site (React + Vite), deployed on GitHub Pages, typeset in the Dinnaga
          design system. Source for what we publish lives openly under the Dinnaga org.
        </p>
      </div>
    </section>
  );
}
