// ABOUTME: ASCII dossier section — a decorative glyph block under a section head.
// ABOUTME: The art string is static; vendored CSS handles the layered green extrusion.
const ASCII_ART = String.raw`
        ████████████████████████████████████████████████████████████
        ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██
        ██▓▒░                                                  ░▒▓██
        ██▓▒░     ╔═══════════════════════════════════════╗    ░▒▓██
        ██▓▒░     ║   D  I  N  N  A  G  A   //  OPEN      ║    ░▒▓██
        ██▓▒░     ╚═══════════════════════════════════════╝    ░▒▓██
        ██▓▒░                                                  ░▒▓██
        ██▓▒░       /\          ▸ ETHOS  : OPEN SOURCE         ░▒▓██
        ██▓▒░      /  \         ▸ METHOD : READ → SHIP         ░▒▓██
        ██▓▒░     /    \        ▸ BAR    : VALIDATED           ░▒▓██
        ██▓▒░    /  ██  \       ▸ MOCKS  : NONE                ░▒▓██
        ██▓▒░   /  ████  \      ▸ STATUS : LIVE · OPEN         ░▒▓██
        ██▓▒░  /  ██████  \                                    ░▒▓██
        ██▓▒░ /____________\    ┌─[ TRANSMISSION ]──────┐      ░▒▓██
        ██▓▒░ |    [   ]   |    │project planning / open│      ░▒▓██
        ██▓▒░ |    [ D ]   |    │atisha           / open│      ░▒▓██
        ██▓▒░ |    [   ]   |    │source           / open│      ░▒▓██
        ██▓▒░ |____________|    └───────────────────────┘      ░▒▓██
        ██▓▒░                                                  ░▒▓██
        ██▓▒░  ░▒▓█  VALIDATE · THEN SHARE                     ░▒▓██
        ██▓▒░                                                  ░▒▓██
        ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██
        ████████████████████████████████████████████████████████████`;

export function AsciiArt() {
  return (
    <section className="ascii-section" data-screen-label="ASCII dossier">
      <header className="section-head">
        <span className="section-eye">// 04 · DOSSIER · TRANSMISSION GATE</span>
        <h2 className="section-title">Decoded // wireframe.</h2>
      </header>
      <div className="ascii-stack" aria-hidden="true">
        <pre>{ASCII_ART}</pre>
      </div>
      <div className="ascii-caption">
        <span className="dot dot-live" />
        <span>▸ EXTRUDED IN EIGHT TINTS OF #C0FE04 · BREATHING ENABLED</span>
      </div>
    </section>
  );
}
