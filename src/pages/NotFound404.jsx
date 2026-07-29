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
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Compass as TripIcon, MapPin, Search } from 'lucide-react';
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

/* Typeahead suggestions, mirroring the homepage hero's dropdown. Like its
   HERO_POPULAR_DEST, these are carried locally: the /journeys4 catalogue
   lives inside that page, unexported. Destinations are its region filters;
   journeys are its tour titles — every one of them lands ?q= on results. */
const SUGGEST_DESTS = [
  'India', 'Japan', 'Switzerland', 'Italy', 'Northern Lights',
  'Australia & NZ', 'Africa Safari', 'Southeast Asia', 'Maldives', 'Europe', 'USA',
];
const SUGGEST_JOURNEYS = [
  'Golden Triangle & the Taj', 'Rajasthan: Palaces & Forts', 'Kerala Backwaters & Coast',
  'Udaipur & Ranthambore Honeymoon', 'India for Families', 'Cherry Blossom Japan',
  'Japan for First-Timers', 'Japan: Ryokans & Art Islands', 'Summer in Switzerland',
  'Grand Switzerland & Italy', 'Swiss Alps Private Rail Journey', 'Slow Italy: Coast to Art',
  'Amalfi & the Southern Coast', 'Italy for Families', 'Chasing the Northern Lights',
  'Arctic Scandinavia & Ice Hotels', 'New Zealand by Road', 'Australia for Families',
  'African Safari: Great Migration', 'Kenya Private Conservancy Safari',
  'Tanzania: Serengeti & Ngorongoro', 'South Africa: Cape & Kruger', 'Grand Europe',
  'Portugal & Spain: Iberian Journey', 'European Christmas Markets',
  'Islands & Temples of Southeast Asia', 'Sri Lanka: Tea Trails & Coast',
  'Vietnam & Cambodia Discovery', 'Maldives Overwater Escape', 'USA Coast to Coast',
  'Canadian Rockies & Rail',
];

export default function NotFound404() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const searchRef = useRef(null);

  /* The journeys listing already reads ?q= into its search box, so the
     404's search simply lands there. */
  const onSearch = (e) => {
    e.preventDefault();
    const term = q.trim();
    if (term) navigate(`/journeys4?q=${encodeURIComponent(term)}`);
  };

  /* Same dropdown manners as the homepage search: click-away and Escape
     both close it. */
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  /* Untyped → the destination list (as the homepage shows its populars on
     focus). Typed → matching destinations first, then matching journeys. */
  const term = q.trim().toLowerCase();
  const destMatches = SUGGEST_DESTS.filter((d) => !term || d.toLowerCase().includes(term));
  const tripMatches = term ? SUGGEST_JOURNEYS.filter((t) => t.toLowerCase().includes(term)) : [];
  const suggestions = [
    ...destMatches.slice(0, term ? 4 : 8).map((label) => ({ label, kind: 'dest' })),
    ...tripMatches.slice(0, 5).map((label) => ({ label, kind: 'trip' })),
  ];

  const pick = (label) => { setQ(label); setOpen(false); };

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

            <form className="nf4-search" onSubmit={onSearch} role="search" ref={searchRef}>
              <label className="nf4-srlabel" htmlFor="nf4-q">Search destinations or journeys</label>
              <Search size={17} aria-hidden="true" className="nf4-search__icon" />
              <input
                id="nf4-q"
                type="search"
                value={q}
                onFocus={() => setOpen(true)}
                onChange={(e) => { setQ(e.target.value); setOpen(true); }}
                placeholder="Search destinations or journeys"
                autoComplete="off"
                aria-expanded={open}
                aria-controls="nf4-suggest"
              />
              <button type="submit" className="btn-primary nf4-search__go">Search</button>

              {open && (
                <div className="nf4-search__drop" id="nf4-suggest" role="listbox" aria-label={term ? 'Suggestions' : 'Popular destinations'}>
                  <span className="nf4-search__droplabel">{term ? 'Suggestions' : 'Popular destinations'}</span>
                  {suggestions.map((s) => (
                    <button
                      key={`${s.kind}-${s.label}`}
                      type="button"
                      className={`nf4-search__opt${q === s.label ? ' is-on' : ''}`}
                      role="option"
                      aria-selected={q === s.label}
                      onClick={() => pick(s.label)}
                    >
                      {s.kind === 'dest' ? <MapPin size={15} aria-hidden="true" /> : <TripIcon size={15} aria-hidden="true" />}
                      <span>{s.label}</span>
                    </button>
                  ))}
                  {term && (
                    <button type="submit" className="nf4-search__opt nf4-search__opt--go">
                      <Search size={15} aria-hidden="true" />
                      <span>Search for &ldquo;{q.trim()}&rdquo;</span>
                    </button>
                  )}
                </div>
              )}
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
