// ABOUTME: Shared site chrome around routed pages — nav, footer, cookie banner, CRT overlay.
// ABOUTME: Renders the matched route via <Outlet/>.
import { Outlet } from 'react-router-dom';
import { CookieBanner } from './CookieBanner';
import { SiteNav } from './SiteNav';
import { SiteFooter } from './SiteFooter';

export function Layout() {
  return (
    <div className="site" data-screen-label="Dinnaga">
      <CookieBanner />
      <SiteNav />
      <Outlet />
      <SiteFooter />
      <div className="crt-overlay" aria-hidden="true" />
    </div>
  );
}
