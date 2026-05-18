// ABOUTME: ASCII dossier section — a decorative glyph block under a section head.
// ABOUTME: The art string is static; vendored CSS handles the layered green extrusion.
const ASCII_ART = String.raw`
        ████████████████████████████████████████████████████████████
        ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██
        ██▓▒░                                                  ░▒▓██
        ██▓▒░     ╔═══════════════════════════════════════╗    ░▒▓██
        ██▓▒░     ║   D  I  N  N  A  G  A   //  RESEARCH  ║    ░▒▓██
        ██▓▒░     ╚═══════════════════════════════════════╝    ░▒▓██
        ██▓▒░                                                  ░▒▓██
        ██▓▒░       /\          ▸ SIGNAL  : 042 OPEN           ░▒▓██
        ██▓▒░      /  \         ▸ DOSSIER : APRIL 2026         ░▒▓██
        ██▓▒░     /    \        ▸ ADOPTION: 87% / 14 PAPERS    ░▒▓██
        ██▓▒░    /  ██  \       ▸ FIDELITY: HIGH               ░▒▓██
        ██▓▒░   /  ████  \      ▸ STATUS  : LIVE · OUTBOUND    ░▒▓██
        ██▓▒░  /  ██████  \                                    ░▒▓██
        ██▓▒░ /____________\    ┌─[ TRANSMISSION ]──────┐      ░▒▓██
        ██▓▒░ |    [   ]   |    │ research  /  open     │      ░▒▓██
        ██▓▒░ |    [ D ]   |    │ education /  open     │      ░▒▓██
        ██▓▒░ |    [   ]   |    │ consulting/  open     │      ░▒▓██
        ██▓▒░ |____________|    └───────────────────────┘      ░▒▓██
        ██▓▒░                                                  ░▒▓██
        ██▓▒░  ░▒▓█  EMPOWER · ANYONE WHO BRINGS A QUESTION    ░▒▓██
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
