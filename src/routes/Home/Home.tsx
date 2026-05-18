// ABOUTME: Homepage route — composes the long-scroll dinnaga.ai homepage.
// ABOUTME: Owns the smooth-scroll nav handler shared by SiteNav.
import { CookieBanner } from '../../components/CookieBanner';
import { SiteNav } from '../../components/SiteNav';
import { Hero } from '../../components/Hero';
import { Ticker } from '../../components/Ticker';
import { Practices } from '../../components/Practices';
import { FieldNotes } from '../../components/FieldNotes';
import { DataPanel } from '../../components/DataPanel';
import { AsciiArt } from '../../components/AsciiArt';
import { CautionDivider } from '../../components/CautionDivider';
import { Transmission } from '../../components/Transmission';
import { SiteFooter } from '../../components/SiteFooter';
import { TICKER_ITEMS } from '../../data/tickerItems';

export function Home() {
  const handleNav = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.offsetTop - 70, behavior: 'smooth' });
    }
  };

  return (
    <div className="site" data-screen-label="Dinnaga homepage">
      <CookieBanner />
      <SiteNav onNav={handleNav} />
      <Hero />
      <Ticker items={TICKER_ITEMS} />
      <Practices />
      <FieldNotes />
      <DataPanel />
      <AsciiArt />
      <CautionDivider />
      <Transmission />
      <SiteFooter />
      <div className="crt-overlay" aria-hidden="true" />
    </div>
  );
}
