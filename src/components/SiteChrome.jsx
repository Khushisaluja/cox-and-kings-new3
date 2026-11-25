/* ============================================================================
   Shared site chrome — the ONE navbar + footer, lifted verbatim from /new3.

   Every page used to build its own copy of this markup, so the six of them had
   already drifted: different mobile menus (a flat link list here, the grouped
   accordion there), different footer columns, different scroll thresholds.
   This is now the only definition. Change the nav or the footer here and it
   changes everywhere.

   Desktop and mobile are driven by the SAME `NAV_MENU` array — the desktop
   hover flyouts and the mobile drawer accordion render from it — so the two can
   no longer disagree about what is in the menu.

   ---------------------------------------------------------------------------
   Anchors. The nav points at sections that only exist on the homepage
   (#paths, #destinations, #relaxed, #reviews, #press, #heritage, #reels). On
   the homepage those stay native same-page anchors; anywhere else they have to
   become router links to "/#section", or they would scroll the visitor to
   nothing. `useLocation` decides which, so a page never has to think about it.

   Styling. The chrome wraps itself in `.h26.new-typo.n3` and pulls its own
   stylesheets, so it carries its own design tokens and does not care what the
   host page's root element looks like. Those three classes only declare CSS
   variables — no layout — so nesting them inside a page is inert.
   ========================================================================== */

import { Fragment, useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SmartLink as Link, CALLBACK, useScheduleCall } from './ScheduleCall';
import { EINAYA, useEinaya } from './Einaya';
import {
  ChevronDown, ChevronRight, Phone, Menu, X, ArrowRight, ArrowUpRight,
  Instagram, Facebook, Youtube, Linkedin,
} from 'lucide-react';

import '../pages/Home2026.css';
import '../pages/Home2026Improved.css';
import '../pages/NewTypography.css';
import '../pages/New3.css';

export const CONTACT_CK = {
  phoneDisplay: '+91 8556001700',
  phoneHref: 'tel:+918556001700',
  email: 'holidays@coxandkings.com',
};

/* The routes on which the nav's in-page anchors actually resolve to a section. */
const HOME_PATHS = ['/', '/new3'];

const INSPIRATION_TO = '/inspiration';

/* Only Japan has a page today. Every other place opens the "coming soon"
   screen, with ?dest= carrying its name so the copy can say which one — swap
   the `to` for the real route as each country page ships. */
const soon = (name) => `/journeys/coming-soon?dest=${encodeURIComponent(name)}`;

/* ---------------------------------------------------------------------------
   The Destinations panel. The list is the "countries we cater to" sheet
   (trfed.xlsx): 56 destinations in the seven regions it names, nothing else.

   Same rail-and-pane panel as before: regions on the left, the hovered
   region's places on the right. What changed is how the pane copes with
   regions of very different sizes (Europe 23, Antarctica 1):
     - nine or more places: a compact three-column list of names;
     - eight or fewer: two columns, each place with a one-line description;
     - and the foot of every pane holds one quiet next step (the live
       campaign pages where a region has them, a specialist otherwise), so a
       short region ends on something useful rather than blank paper.

   Region names are the sheet's own. Two spellings were corrected for display:
   "Antartica" and "United States Of America".
   --------------------------------------------------------------------------- */
const place = (label, desc, to = soon(label)) => ({ label, desc, to });

const DEST_REGIONS = [
  {
    region: 'Asia',
    note: 'Temples, street food and island coastlines.',
    places: [
      place('Bhutan'), place('Hong Kong'), place('India'), place('Indonesia'),
      place('Japan', '', '/journeys/japan-2'), place('Malaysia'), place('Maldives'),
      place('Mauritius'), place('Nepal'), place('Philippines'), place('Seychelles'),
      place('Singapore'), place('South Korea'), place('Sri Lanka'), place('Thailand'),
      place('Vietnam'),
    ],
    open: [
      { label: 'Japan in Full Bloom', meta: 'Spring 2027', to: '/japan-cherry-blossom' },
      { label: 'Vietnam group tours', meta: 'Spring 2027', to: '/vietnam-group-tours' },
    ],
  },
  {
    region: 'Europe',
    note: 'Alpine rail, old cities and long coastlines.',
    places: [
      place('Austria'), place('Belgium'), place('Croatia'), place('Czech Republic'),
      place('Denmark'), place('Finland'), place('France'), place('Georgia'),
      place('Germany'), place('Greece'), place('Hungary'), place('Iceland'),
      place('Ireland'), place('Italy'), place('Netherlands'), place('Norway'),
      place('Portugal'), place('Romania'), place('Spain'), place('Sweden'),
      place('Switzerland'), place('Turkey'), place('United Kingdom'),
    ],
    open: [{ label: 'Europe, early booking', meta: 'Summer 2027', to: '/europe-early-booking' }],
  },
  {
    region: 'North Africa & Middle East',
    note: 'Desert cities, souks and ancient stone.',
    places: [
      place('Abu Dhabi', 'Grand Mosque & desert dunes'),
      place('Dubai', 'Skyline, souks & the desert'),
      place('Egypt', 'Nile, pyramids & temples'),
      place('Jordan', 'Petra & Wadi Rum'),
      place('Morocco', 'Medinas & the Sahara'),
      place('Oman', 'Forts, wadis & coastline'),
      place('Saudi Arabia', 'AlUla & the old caravan roads'),
      place('United Arab Emirates', 'Seven emirates, one coast'),
    ],
  },
  {
    region: 'Africa',
    note: 'Big-five wilderness and the long horizon.',
    places: [
      place('Kenya', 'The Mara migration'),
      place('South Africa', 'Cape, wine & Kruger'),
      place('Tanzania', 'Serengeti & Zanzibar'),
    ],
  },
  {
    region: 'North America',
    note: 'Canyons, coastlines and great cities.',
    places: [
      place('Canada', 'Rockies & maple country'),
      place('Mexico', 'Maya ruins & Pacific coast'),
      place('United States of America', 'Parks, coasts & big cities'),
    ],
  },
  {
    region: 'Australia & New Zealand',
    note: 'Reef, outback and the long way south.',
    places: [
      place('Australia', 'Reef, outback & Sydney'),
      place('New Zealand', 'Both islands, end to end'),
    ],
  },
  {
    region: 'Antarctica',
    note: 'The last continent, at the very end of the map.',
    places: [place('Antarctica', 'The White Continent, by expedition ship')],
  },
];
const DEST_COUNT = DEST_REGIONS.reduce((n, r) => n + r.places.length, 0);

/* Four groups. "Destinations" is split by KIND — places, then the itineraries
   that used to live under a competing "Journeys" menu — with a section rule
   between them, which is what makes seven rows scannable instead of a wall.
   Items carry `to` (a route), `href` (a homepage section) or CALLBACK (opens
   the schedule-a-call dialog in place, rather than dead-ending on a page). */
const NAV_MENU = [
  {
    label: 'Ways to travel', href: '#paths',
    blurb: 'Two ways to see the world. Pick the one that fits you.',
    items: [
      { label: 'Escorted group tours', desc: 'Expert-led, fixed departures', to: '/journeys4-group?style=Group Tour' },
      { label: 'Tailor-made journeys', desc: 'Designed entirely around you', to: '/journeys4-private?style=Bespoke Private' },
      { label: 'Luxury & private travel', desc: 'Elevated stays and guiding', to: '/journeys4?style=Luxury' },
      { label: 'Help me decide', desc: 'Talk it through with Einaya', to: EINAYA },
    ],
  },
  {
    /* `to` rather than `href`: the label itself opens the Atlas Index (the full
       sitemap), instead of scrolling the homepage down to the destinations
       section — the flyout already covers the shortlist. */
    label: 'Destinations', to: '/sitemap',
    blurb: `${DEST_COUNT} destinations, shaped by specialists who know them first-hand.`,
    /* `atlas` instead of `items`: this one renders as the two-pane panel
       (regions left, places right), not the single column every other menu
       uses. See DEST_REGIONS. */
    atlas: DEST_REGIONS,
    /* The catch-all. Not one more destination — a way out of the list. */
    all: { label: 'All destinations', meta: '31 journeys', to: '/journeys4' },
  },
  /* A flat link, not a menu: `plain` means no caret, no flyout on desktop and
     no accordion in the drawer — it just goes somewhere. */
  { label: 'Inspiration', to: INSPIRATION_TO, plain: true },
  {
    /* `to` rather than `href`: the label itself opens the About page at its top,
       instead of scrolling the homepage down to the heritage section. */
    label: 'About us', to: '/about-us2',
    blurb: 'Specialists, not salespeople, with 260 years behind every trip.',
    items: [
      { label: 'Our story', desc: 'Since 1758, and what came after', to: '/about-us2' },
      { label: 'Vision & Mission', desc: 'What we promise, and what it prevents', to: '/vision-mission' },
      { label: 'The team', desc: 'The specialists you will actually deal with', to: '/about-us2/team' },
      { label: 'Real reviews', desc: '2,400+ verified travellers', to: '/testimonials' },
      { label: 'As featured in', desc: 'Press coverage & awards', to: '/press-media' },
      { label: 'Talk to an expert', desc: 'Pick a time, we call you back', to: CALLBACK },
    ],
  },
];

/* The two homepage sections that have no submenu — mobile drawer only. */
const MOBILE_PLAIN = [
  { label: 'Clips', href: '#reels' },
  { label: 'Reviews', to: '/testimonials' },
];

/* One link, wherever it points. A homepage section is a native anchor when we
   are already on the homepage and a router link to "/#section" when we are not;
   a route or CALLBACK is always a SmartLink. */
function ChromeLink({ item, home, className, children, onClick, ...rest }) {
  const openEinaya = useEinaya();
  /* A bare "#" is a deliberate placeholder (see INSPIRATION_TO) — render it
     inert, never as a route, so it cannot navigate anywhere by accident. */
  if (item.to === '#') {
    return <a href="#" className={className} onClick={onClick} {...rest}>{children}</a>;
  }
  /* The EINAYA sentinel opens the AI assistant instead of navigating. Rendered
     as a button-flavoured <a> (no href) so menu link styles still match it,
     mirroring how SmartLink handles the CALLBACK sentinel. */
  if (item.to === EINAYA) {
    const fire = (e) => { e.preventDefault(); onClick?.(e); openEinaya(); };
    return (
      <a
        className={className}
        role="button"
        tabIndex={0}
        onClick={fire}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fire(e); }}
        {...rest}
      >
        {children}
      </a>
    );
  }
  if (item.to) {
    return <Link to={item.to} className={className} onClick={onClick} {...rest}>{children}</Link>;
  }
  if (home) {
    return <a href={item.href} className={className} onClick={onClick} {...rest}>{children}</a>;
  }
  return <Link to={`/${item.href}`} className={className} onClick={onClick} {...rest}>{children}</Link>;
}

/* The Destinations panel: a rail of regions on the left, the hovered region's
   places on the right. Hover (or focus) only swaps the pane; nothing navigates
   until a place is clicked. It reopens on Asia every time. */
function DestFlyout({ group }) {
  const regions = group.atlas;
  const [active, setActive] = useState(0);
  const reg = regions[active];
  const n = reg.places.length;
  /* Nine or more: names in three columns. Three or fewer: one soft card per
     place (a single place gets a taller one). In between: two columns. */
  const layout = n > 8 ? ' is-dense' : n === 1 ? ' is-few is-one' : n <= 3 ? ' is-few' : '';
  const dense = n > 8;

  return (
    <div className="hi-nav-flyout n3-mega-flyout n3-dest-flyout" role="menu" onMouseLeave={() => setActive(0)}>
      <div className="hi-nav-flyout-inner n3-mega-inner">
        <div className="n3-mega">
          <div className="n3-mega-rail">
            <p className="hi-nav-blurb n3-mega-blurb">{group.blurb}</p>
            <div className="n3-mega-region">
              <p className="n3-mega-region-head">Where we travel</p>
              <ul className="n3-mega-cats">
                {regions.map((r, i) => {
                  const on = i === active;
                  const show = () => setActive(i);
                  return (
                    <li key={r.region}>
                      <button
                        type="button"
                        className={`n3-mega-cat${on ? ' is-active' : ''}`}
                        aria-current={on ? 'true' : undefined}
                        onMouseEnter={show}
                        onFocus={show}
                        onClick={show}
                      >
                        <span className="n3-mega-cat-label">{r.region}</span>
                        <span className="n3-mega-cat-count">{r.places.length}</span>
                        <ChevronRight size={14} className="n3-mega-cat-arrow" aria-hidden="true" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* aria-live so a screen reader hears the pane change. */}
          <div className="n3-mega-pane n3-dest-pane" aria-live="polite">
            <p className="n3-mega-pane-head">{reg.region}</p>
            <p className="n3-mega-pane-note">{reg.note}</p>
            <ul className={`n3-mega-places${layout}`}>
              {reg.places.map((p) => (
                <li key={p.label}>
                  <Link to={p.to} role="menuitem" className="n3-mega-place">
                    <span className="n3-mega-place-label">{p.label}</span>
                    {!dense && p.desc && <span className="n3-mega-place-desc">{p.desc}</span>}
                    {n <= 3 && <ArrowRight size={15} className="n3-mega-place-arrow" aria-hidden="true" />}
                  </Link>
                </li>
              ))}
            </ul>

            {/* One quiet next step at the foot of every pane. */}
            <div className="n3-dest-next">
              {reg.open ? (
                <>
                  <span className="n3-dest-next-head">Open for booking</span>
                  {reg.open.map((o) => (
                    <Link key={o.to} to={o.to} role="menuitem" className="n3-dest-next-link">
                      {o.label}
                      <span className="n3-dest-next-meta">{o.meta}</span>
                      <ArrowRight size={13} aria-hidden="true" />
                    </Link>
                  ))}
                </>
              ) : (
                <>
                  <span className="n3-dest-next-head">Not sure where to start?</span>
                  <Link to={CALLBACK} role="menuitem" className="n3-dest-next-link">
                    Talk to our {reg.region} specialists
                    <ArrowRight size={13} aria-hidden="true" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {group.all && (
          <Link to={group.all.to} role="menuitem" className="n3-navall n3-mega-all">
            <span className="n3-navall-label">{group.all.label}</span>
            <span className="n3-navall-meta">{group.all.meta}</span>
            <ArrowRight size={15} className="n3-navall-arrow" aria-hidden="true" />
          </Link>
        )}
      </div>
    </div>
  );
}

/* `solidAt` — how far the page scrolls before the nav loses its transparency.
   The homepage has a tall photographic hero to clear, so it passes a larger
   value; pages that open on a shallow banner go solid almost immediately. */
export function SiteNav({ solidAt = 40, skipTo = '#main', skipLabel = 'Skip to content' }) {
  const { pathname } = useLocation();
  const home = HOME_PATHS.includes(pathname);

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState(null);  // open accordion in the drawer

  const openScheduleCall = useScheduleCall();
  const openCallback = useCallback(() => { setMenuOpen(false); openScheduleCall(); }, [openScheduleCall]);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > solidAt);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [solidAt]);

  /* Don't let the page scroll behind the open drawer. */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  /* A drawer that reopens with a section still expanded feels stale. */
  useEffect(() => { if (!menuOpen) setMobileSection(null); }, [menuOpen]);

  /* Escape closes the drawer — it is a modal dialog. */
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <div className="h26 new-typo n3">
      {/* The skip link's target differs per page (#top on the homepage, #main on
          the tour-detail pages, #results on the listing), so it is a prop — a
          skip link that points at nothing is worse than none at all. */}
      <a className="h26-skip" href={skipTo}>{skipLabel}</a>

      {/* ---------- DESKTOP NAV ---------- */}
      <header className={`h26-nav${scrolled ? ' is-solid' : ''}`}>
        <Link to="/" className="h26-brand" aria-label="Cox & Kings — home">
          <img src="/cox-logo-new.png" alt="Cox & Kings" />
        </Link>

        <nav className="h26-links hi-nav" aria-label="Primary">
          {NAV_MENU.map((group) => group.plain ? (
            /* No menu behind it — no caret, no flyout, nothing to hover. */
            <div className="hi-nav-group" key={group.label}>
              <ChromeLink item={group} home={home} className="hi-nav-top n3-nav-plain">
                {group.label}
              </ChromeLink>
            </div>
          ) : (
            <div className="hi-nav-group" key={group.label}>
              <ChromeLink item={group} home={home} className="hi-nav-top" aria-haspopup="true">
                {group.label}
                <ChevronDown size={14} className="hi-nav-caret" aria-hidden="true" />
              </ChromeLink>

              {/* The Destinations panel is a different shape from the rest:
                  a rail of regions beside a pane of places. Everything else stays a
                  single column. */}
              {group.atlas ? (
                <DestFlyout group={group} />
              ) : (
              <div className="hi-nav-flyout" role="menu">
                <div className="hi-nav-flyout-inner">
                  <p className="hi-nav-blurb">{group.blurb}</p>

                  <ul className="hi-nav-list">
                    {group.items.map((it, idx) => (
                      <Fragment key={it.label}>
                        {/* Section rule wherever the KIND of item changes. */}
                        {it.group && group.items[idx - 1]?.group !== it.group && (
                          <li className="n3-navgroup" aria-hidden="true"><span>{it.group}</span></li>
                        )}
                        <li>
                          <ChromeLink item={it} home={home} className="hi-nav-item">
                            <span className="hi-nav-item-label">{it.label}</span>
                            <span className="hi-nav-item-desc">{it.desc}</span>
                          </ChromeLink>
                        </li>
                      </Fragment>
                    ))}
                  </ul>

                  {/* The catch-all sits OUTSIDE the list: it is not one more thing
                      to choose between, it is the way past the choosing. */}
                  {group.all && (
                    <Link to={group.all.to} role="menuitem" className="n3-navall">
                      <span className="n3-navall-label">{group.all.label}</span>
                      <span className="n3-navall-meta">{group.all.meta}</span>
                      <ArrowRight size={15} className="n3-navall-arrow" aria-hidden="true" />
                    </Link>
                  )}
                </div>
              </div>
              )}
            </div>
          ))}
        </nav>

        <div className="h26-nav-cta">
          <a href={CONTACT_CK.phoneHref} className="h26-phone">
            <Phone size={15} /> <span>{CONTACT_CK.phoneDisplay}</span>
          </a>
          <Link to={CALLBACK} className="h26-btn h26-btn-pill">Talk to an expert</Link>
          <button className="h26-burger" aria-label="Menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}>
            <Menu size={22} />
          </button>
        </div>
      </header>

      {/* ---------- MOBILE DRAWER ----------
          Driven by the SAME NAV_MENU as the desktop flyouts, so the two cannot
          drift apart. Each top-level entry is an accordion; one open at a time. */}
      <div className={`h26-menu${menuOpen ? ' is-open' : ''}`} aria-hidden={!menuOpen}>
        <div className="h26-menu-scrim" onClick={closeMenu} />
        <div className="h26-menu-panel" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="h26-menu-top">
            <button className="h26-menu-close" aria-label="Close menu" onClick={closeMenu}><X size={20} /></button>
            <img className="h26-menu-logo" src="/cox-logo-new.png" alt="Cox & Kings — Est. 1758" />
          </div>

          <nav className="h26-menu-primary n3-macc" aria-label="Mobile primary">
            {NAV_MENU.map((g) => {
              /* Same rule as the desktop nav: nothing to expand, so it is a row
                 you tap, not an accordion you open. */
              if (g.plain) {
                return (
                  <ChromeLink key={g.label} item={g} home={home} className="n3-macc-plain" onClick={closeMenu}>
                    {g.label}
                    <span className="h26-menu-chev"><ArrowRight size={16} /></span>
                  </ChromeLink>
                );
              }
              const open = mobileSection === g.label;
              return (
                <div key={g.label} className={`n3-macc-item${open ? ' is-open' : ''}`}>
                  <button
                    type="button"
                    className="n3-macc-head"
                    aria-expanded={open}
                    onClick={() => setMobileSection(open ? null : g.label)}
                  >
                    {g.label}
                    <span className="h26-menu-chev n3-macc-chev"><ChevronDown size={16} /></span>
                  </button>

                  <div className="n3-macc-panel" hidden={!open}>
                    {/* Destinations carries `atlas` rather than a flat
                        `items` list. On a phone it is one long index: the red
                        region heading, then its places two to a row, so 56
                        names cost 28 rows of scrolling instead of 56. */}
                    {g.atlas ? g.atlas.map((reg) => (
                      <Fragment key={reg.region}>
                        <span className="n3-macc-region">{reg.region}</span>
                        <div className="n3-macc-atlas">
                          {reg.places.map((p) => (
                            <Link key={p.label} to={p.to} className="n3-macc-atlas-link" onClick={closeMenu}>
                              {p.label}
                            </Link>
                          ))}
                        </div>
                      </Fragment>
                    )) : g.items.map((it, idx) => (
                      <Fragment key={it.label}>
                        {it.group && g.items[idx - 1]?.group !== it.group && (
                          <span className="n3-macc-group">{it.group}</span>
                        )}
                        <ChromeLink item={it} home={home} className="n3-macc-link" onClick={closeMenu}>
                          <span className="n3-macc-lbl">{it.label}</span>
                          <span className="n3-macc-desc">{it.desc}</span>
                        </ChromeLink>
                      </Fragment>
                    ))}

                    {g.all && (
                      <Link to={g.all.to} className="n3-navall n3-macc-all" onClick={closeMenu}>
                        <span className="n3-navall-label">{g.all.label}</span>
                        <span className="n3-navall-meta">{g.all.meta}</span>
                        <ArrowRight size={15} className="n3-navall-arrow" aria-hidden="true" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Homepage sections, which have no submenu to open. */}
            {MOBILE_PLAIN.map((n) => (
              <ChromeLink key={n.label} item={n} home={home} className="n3-macc-plain" onClick={closeMenu}>
                {n.label}
                <span className="h26-menu-chev"><ArrowRight size={16} /></span>
              </ChromeLink>
            ))}
          </nav>

          <div className="h26-menu-divider" />

          <div className="h26-menu-secondary">
            <Link to="/journeys4" onClick={closeMenu}>All journeys <ArrowUpRight size={13} /></Link>
            <Link to="/journeys/japan-2" onClick={closeMenu}>Japan <ArrowUpRight size={13} /></Link>
            <Link to="/about-us2" onClick={closeMenu}>Our story <ArrowUpRight size={13} /></Link>
            <Link to={CALLBACK} onClick={closeMenu}>Contact <ArrowUpRight size={13} /></Link>
          </div>

          <button type="button" className="h26-btn h26-btn-pill h26-menu-cta" onClick={openCallback}>
            <Phone size={16} /> Schedule a call
          </button>

          <div className="h26-menu-foot">
            <span className="h26-menu-eyebrow">Follow the journey</span>
            <div className="h26-menu-social">
              <a href="#" aria-label="Instagram"><Instagram size={18} /></a>
              <a href="#" aria-label="Facebook"><Facebook size={18} /></a>
              <a href="#" aria-label="YouTube"><Youtube size={18} /></a>
              <a href="#" aria-label="LinkedIn"><Linkedin size={18} /></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SiteFooter() {
  return (
    <div className="h26 new-typo n3">
      <footer className="h26-footer">
        <div className="h26-footer-top">
          <div className="h26-footer-brand">
            <img src="/cox-logo-new.png" alt="Cox & Kings" />
            <p>The world's most experienced travel company. Established 1758.</p>
            <div className="h26-footer-contact">
              <a href={CONTACT_CK.phoneHref}><Phone size={15} /> {CONTACT_CK.phoneDisplay}</a>
              <a href={`mailto:${CONTACT_CK.email}`}>{CONTACT_CK.email}</a>
            </div>
          </div>

          {/* Four columns, one visitor intent each — browse the journeys,
              learn who we are, work with us, get help — so every link has
              exactly one home. Legal lives in the bottom row, not here. */}
          <div className="h26-footer-cols">
            <div>
              <h4>Explore</h4>
              <Link to="/journeys4">All journeys</Link>
              <Link to="/journeys4-group">Group tours</Link>
              <Link to="/journeys4-private">Bespoke holidays</Link>
              <Link to="/journeys4?style=Luxury">Luxury journeys</Link>
              <Link to="/inspiration">Inspiration</Link>
              <Link to="/gift-vouchers">Gift vouchers</Link>
            </div>
            <div>
              <h4>Company</h4>
              <Link to="/about-us2">Our story</Link>
              <Link to="/vision-mission">Vision &amp; Mission</Link>
              <Link to="/about-us2/team">Meet the team</Link>
              <Link to="/testimonials">Testimonials</Link>
              <Link to="/press-media">Press &amp; Media</Link>
              <Link to="/careers">Careers</Link>
            </div>
            <div>
              <h4>Partner with us</h4>
              {/* A MICE enquiry is a business relationship, not a booking, so it
                  belongs here beside the other B2B routes rather than under
                  Explore with the holidays. */}
              <Link to="/mice">Corporate &amp; MICE</Link>
              <Link to="/franchise">Franchise partnership</Link>
              <Link to="/become-a-partner">Preferred sales partner</Link>
              <Link to="/collaborate">Creators &amp; collaborations</Link>
            </div>
            <div>
              <h4>Help &amp; support</h4>
              <Link to={CALLBACK}>Contact us</Link>
              <Link to="/faq2">FAQs</Link>
              <Link to="/terms#refund-policy">Refund policy</Link>
              <Link to="/sitemap">Sitemap</Link>
            </div>
          </div>
        </div>

        <div className="h26-footer-bottom">
          <span>© {new Date().getFullYear()} Cox &amp; Kings. Travelling the world since 1758.</span>
          <span className="h26-footer-legal">
            <Link to="/terms">Terms &amp; Conditions</Link>
            <span className="h26-footer-assoc">IATA · TAAI · ASTA</span>
          </span>
        </div>
      </footer>
    </div>
  );
}
