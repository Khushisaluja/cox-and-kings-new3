/* ============================================================
   NotFound404 — the CLIENT-FACING 404 (route /404, and the
   unmatched-URL catch-all in App.jsx).

   "You're wandering off the map": a traveller who mistypes or
   follows a dead link gets the same room as the rest of the site,
   the New3 chrome (SiteNav/SiteFooter), a dark photographic hero
   on the Voyager Blue 800 palette shade, and white Cormorant
   display type with the homepage's white italic accent (design.md
   palette only, no gold), plus real ways back in.

   The dev-facing NotFound in App.jsx still exists: the homepage's
   not-yet-built tour cards and vibe themes deliberately keep landing
   there (see the catch-all in App.jsx), so this page is NOT wired to
   the New3 homepage's dead ends yet.
   ============================================================ */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Search } from 'lucide-react';
import { SmartLink as Link } from '../components/ScheduleCall';
import { SiteNav, SiteFooter } from '../components/SiteChrome';
import { img } from '../data/v3content';
import './Home2026.css';
import './Home2026Improved.css';
import './Luxe2Improved.css';
import './NewTypography.css';
import './NotFound404.css';

/* An antique chart + compass — the one photograph on the site that IS a map,
   for the one page about being off it. Same Unsplash pipeline as every other
   page's photography. */
const HERO_IMG = img('https://images.unsplash.com/photo-1524661135-423995f22d0b', 2000);

/* A compass whose needle can't settle — the page's emblem. */
function Compass() {
  return (
    <div className="nf4-compass" aria-hidden="true">
      <svg width="54" height="54" viewBox="0 0 54 54" fill="none" stroke="currentColor" strokeWidth="1.4">
        <circle cx="27" cy="27" r="25" opacity="0.55" />
        <circle cx="27" cy="27" r="19.5" opacity="0.3" />
        {/* Cardinal ticks */}
        <path d="M27 2v5M27 47v5M2 27h5M47 27h5" opacity="0.55" />
        <g className="nf4-compass__needle">
          <path d="M27 10 L31.5 27 L27 44 L22.5 27 Z" fill="currentColor" opacity="0.9" stroke="none" />
          <circle cx="27" cy="27" r="2.4" fill="#042447" stroke="currentColor" />
        </g>
      </svg>
    </div>
  );
}

const PATHS = [
  { to: '/journeys4', label: 'All journeys' },
  { to: '/journeys/japan-2', label: 'The Japan collection' },
  { to: '/journeys4-group', label: 'Group tours' },
  { to: '/journeys4-private', label: 'Private & bespoke' },
];

export default function NotFound404() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');

  /* The journeys listing already reads ?q= into its search box, so the
     404's search simply lands there. */
  const onSearch = (e) => {
    e.preventDefault();
    const term = q.trim();
    if (term) navigate(`/journeys4?q=${encodeURIComponent(term)}`);
  };

  return (
    <div className="h26 new-typo nf4">
      <SiteNav solidAt={80} skipTo="#lost" skipLabel="Skip to content" />

      {/* tabIndex so the skip link can MOVE focus here, not just scroll. */}
      <main id="lost" tabIndex={-1}>
        <section className="nf4-hero" aria-labelledby="nf4-title">
          <div className="nf4-hero__bg" style={{ backgroundImage: `url(${HERO_IMG})` }} />
          <div className="nf4-hero__veil" aria-hidden="true" />

          <div className="nf4-hero__inner">
            <Compass />
            <p className="nf4-eyebrow">Error 404 · Uncharted territory</p>
            <h1 className="nf4-title" id="nf4-title">
              You&rsquo;re wandering <em>off the map.</em>
            </h1>
            <p className="nf4-lede">
              The page you&rsquo;re looking for doesn&rsquo;t exist. It may have moved, or the
              link you followed may be out of date.
            </p>

            <form className="nf4-search" onSubmit={onSearch} role="search">
              <label className="nf4-srlabel" htmlFor="nf4-q">Search destinations or journeys</label>
              <Search size={17} aria-hidden="true" className="nf4-search__icon" />
              <input
                id="nf4-q"
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search destinations or journeys"
                autoComplete="off"
              />
              <button type="submit" className="btn-primary nf4-search__go">Search</button>
            </form>

            <nav className="nf4-paths" aria-label="Popular pages">
              <span className="nf4-paths__label">Or take a well-trodden path</span>
              <div className="nf4-paths__row">
                {PATHS.map((p) => (
                  <Link key={p.to} to={p.to} className="nf4-path">
                    {p.label}
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
