/* ============================================================
   Sitemap — "The Atlas Index" (route /sitemap).

   The live site's sitemap is a wall of blue links. This one is the
   index plate of a 267-year-old travel atlas instead: a dark
   Voyager-Blue chart on top carrying an interactive dotted world
   map (hover a continent to light it, click to jump to its index),
   then the warm-paper index below — six region sections, the ways
   to travel, and every site page — with a live search that filters
   the whole index as you type and a sticky scrollspy rail.

   Content mirrors coxandkings.com/sitemap (66 destinations across
   six regions + travel styles + company/help/legal), mapped onto
   THIS site's real routes: Japan goes to its live country page,
   every other destination follows the established
   /journeys/coming-soon?dest= pattern until its page ships.

   Motion is GSAP + ScrollTrigger, gated behind gsap.matchMedia so
   it degrades cleanly under prefers-reduced-motion. The search
   filter hides/show DOM with classes (never unmounts) so the
   scroll triggers stay stable; it calls ScrollTrigger.refresh()
   whenever the filtered layout changes height.
   ============================================================ */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowUpRight, ArrowRight, Search, X, Phone, Clock, MapPin, FileText,
} from 'lucide-react';
import { SmartLink as Link, CALLBACK } from '../components/ScheduleCall';
import { SiteNav, SiteFooter, CONTACT_CK } from '../components/SiteChrome';
import { img } from '../data/v3content';
import './Home2026.css';
import './Home2026Improved.css';
import './NewTypography.css';
import './New3.css';
import './Sitemap.css';

gsap.registerPlugin(ScrollTrigger);

/* ---------------------------------------------------------------
   THE WORLD, AS DOTS.
   A hand-drawn character grid, one glyph per ~5.5° of longitude and
   ~4.3° of latitude. Each letter is a continent code, '.' is ocean.
   N/S = the Americas (one index section, two landmasses),
   E = Europe, F = Africa, M = Middle East, A = Asia, O = Oceania,
   X = land we don't sell (Greenland) — drawn faint, not interactive.
   Rows are pad-guarded to GRID_W so a miscount can't shear the map.
   --------------------------------------------------------------- */
const GRID_W = 64;
/*        0         1         2         3         4         5         6
          0123456789012345678901234567890123456789012345678901234567890123 */
const WORLD = [
  '........N.NN.N.NN......XXXX.............AA.AAAA.AAAAAA.AAAA.....',
  '.......N.NNNNNNNN.....XXXXXX.......A....AAAAAAAAAAAAAAAAAAAA...',
  '......NNNNNNNNNNN......XXXX.EE...EEE..AAAAAAAAAAAAAAAAAAAAAAA..',
  '.NNN..NNNNNNNNNNNN......XX......EEEEE.EEEEE.AAAAAAAAAAAAAAAAAA.',
  'NNNN.NNNNNNNNNNNNN...........E..EEEEE.EEEEEAAAAAAAAAAAAAAAAAA..',
  '....NNNNNNNNNNNNNN..........EEE...E.EEEEEEEE.AAAAAAAAAAAAAAA...',
  '....NNNNNNNNNNNNN.............EEEEEEEEE.EAAAAAAAAAAAAAAAAAA....',
  '....NNNNNNNNNNNNN............EE.EEEEEE.AAAAAAAAAAAAAAAAAA.A....',
  '....NNNNNNNNNNNN.............EEE.EE.EE.AAAAAAAAAAAAAAAAA.AA....',
  '.....NNNNNNNNNNN.............EE...E.AAAAAAAAAAAAAAAAA.A..AA....',
  '......NNNNNNNNN.............FFFFFFFFMM.MMAAAAAAAAAAAA...AA.....',
  '........NNNNN...............FFFFFFFFF.MMMMMM.AAAAAAAAAA..A.....',
  '.........NNNN..NN..........FFFFFFFFFF.MMMMM.AAAAAAAAAAA.A......',
  '..........NNNN..NNN.........FFFFFFFFFFFMMMM..AAA.AAAA..AA......',
  '...........NNNN.............FFFFFFFFFFFF.....AA..AAAAA.AA......',
  '.............NNN..NNN.......FFFFFFFFFFF......A...AAAAA.AA......',
  '...............NNN.NNN......FFFFFFFFF.......A..AAA.AAA.A.......',
  '...............SSSSSSS.........FFFFFFFF.........AAA.AAA.OOO....',
  '...............SSSSSSSS..........FFFFFF..........AAAAA..OOO....',
  '...............SSSSSSSSSS........FFFFFF...........AAAA..OOO....',
  '...............SSSSSSSSS.........FFFFFF..............OOOOO.....',
  '...............SSSSSSSSS.........FFFFFF.F............OOOOOO....',
  '................SSSSSSS..........FFFFF..F.F.........OOOOOOO....',
  '................SSSSSS...........FFFFF..F...........OOOOOOOO...',
  '................SSSS..............FFF...............OOOOOOOO...',
  '................SSS...............FF................O..OOOO...OO',
  '................SSS......................................O....OO',
  '................SS.......................................O...OO.',
  '................SS..............................................',
  '................S...............................................',
];

/* Continent code → the index section it lights up / jumps to. */
const CODE_REGION = { N: 'americas', S: 'americas', E: 'europe', F: 'africa', M: 'middle-east', A: 'asia', O: 'oceania' };

/* The one destination with a live page gets a beacon on the map:
   Japan, near lon 139 / lat 36 on the grid above. */
const BEACON = { col: 57.6, row: 8.5, label: 'Japan — live' };

/* ---------------------------------------------------------------
   DESTINATIONS — content from coxandkings.com/sitemap, grouped by
   region exactly as the live sitemap groups them. Only Japan has a
   country page today; everything else follows the site's
   coming-soon pattern (see SiteChrome's NAV_MENU note).
   --------------------------------------------------------------- */
const dest = (label) => ({ label, to: `/journeys/coming-soon?dest=${encodeURIComponent(label)}` });

const REGIONS = [
  {
    id: 'europe', name: 'Europe', code: 'E',
    tagline: 'Alpine rail, Baltic capitals and the grand tour, rewritten.',
    places: [
      'Austria', 'Bosnia and Herzegovina', 'Croatia', 'Czech Republic', 'Denmark', 'Estonia',
      'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'Iceland', 'Ireland', 'Italy',
      'Latvia', 'Netherlands', 'Norway', 'Portugal', 'Slovenia', 'Spain', 'Sweden',
      'Switzerland', 'United Kingdom',
    ].map(dest),
  },
  {
    id: 'asia', name: 'Asia', code: 'A',
    tagline: 'From cherry blossom to island temples — our home continent.',
    places: [
      'Azerbaijan', 'Bhutan', 'Cambodia', 'Georgia', 'Hong Kong', 'India', 'Indonesia',
      'Japan', 'Kazakhstan', 'Laos', 'Malaysia', 'Maldives', 'Nepal', 'Philippines',
      'Singapore', 'South Korea', 'Sri Lanka', 'Thailand', 'Vietnam',
    ].map((label) => (label === 'Japan'
      ? { label, to: '/journeys/japan-2' }
      : dest(label))),
  },
  {
    id: 'africa', name: 'Africa', code: 'F',
    tagline: 'Great migrations, desert kingdoms and Indian Ocean islands.',
    places: ['Egypt', 'Kenya', 'Mauritius', 'Morocco', 'Seychelles', 'South Africa', 'Tanzania', 'Zimbabwe'].map(dest),
  },
  {
    id: 'americas', name: 'The Americas', code: 'NS',
    tagline: 'Inca trails, national parks and coast-to-coast road trips.',
    places: ['Argentina', 'Brazil', 'Canada', 'Mexico', 'Peru', 'United States of America'].map(dest),
  },
  {
    id: 'middle-east', name: 'Middle East', code: 'M',
    tagline: 'Ancient stone cities and skylines that grew overnight.',
    places: ['Abu Dhabi', 'Dubai', 'Jordan', 'Oman', 'Qatar', 'Saudi Arabia', 'United Arab Emirates'].map(dest),
  },
  {
    id: 'oceania', name: 'Oceania', code: 'O',
    tagline: "Reefs, fjords and the earth's last quiet edens.",
    places: ['Australia', 'Fiji', 'New Zealand'].map(dest),
  },
];

/* ---------------------------------------------------------------
   WAYS TO TRAVEL — the three doors the nav offers, rendered as the
   SAME hi-lane cards the homepage's "How would you like to travel?"
   fork uses (tag, serif title, copy, pill CTA; the tailor-made lane
   keeps its "Recommended" badge), so the two pages read as one site.
   --------------------------------------------------------------- */
const WAYS = [
  {
    label: 'Escorted group tours', tag: 'Escorted small groups', cta: 'See group journeys',
    desc: 'Fixed departures, capped at 18, with a tour manager throughout. Everything handled, fine company along the way.',
    to: '/journeys4-group?style=Group Tour',
    photo: img('https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99', 800),
  },
  {
    label: 'Tailor-made journeys', tag: 'Tailor-made & private', cta: 'Design your journey', featured: true,
    desc: 'A private itinerary designed entirely around you — your pace, your places, your people.',
    to: '/journeys4-private?style=Bespoke Private',
    photo: img('https://images.unsplash.com/photo-1488646953014-85cb44e25828', 800),
  },
  {
    label: 'Luxury & private travel', tag: 'The finer route', cta: 'See luxury journeys',
    desc: 'Elevated stays, private guiding and the unhurried version of every itinerary.',
    to: '/journeys4?style=Luxury',
    photo: img('https://images.unsplash.com/photo-1571896349842-33c89424de2d', 800),
  },
];

/* WhatsApp glyph (lucide has no brand icon) — same path the homepage uses. */
const WaIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.5A10 10 0 1 0 12 2zm0 18.3c-1.5 0-2.98-.4-4.27-1.16l-.3-.18-3.17 1 1.02-3.09-.2-.32A8.3 8.3 0 1 1 12 20.3z" />
    <path d="M17.5 14.4c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35z" />
  </svg>
);

const WHATSAPP_HREF = 'https://wa.me/918556001700';

/* ---------------------------------------------------------------
   SITE PAGES — every route the site actually serves (App.jsx is
   the source of truth), grouped the way a visitor thinks.
   --------------------------------------------------------------- */
const SITE_GROUPS = [
  {
    id: 'browse', name: 'Plan & browse',
    links: [
      { label: 'Home', to: '/' },
      { label: 'All journeys', to: '/journeys4' },
      { label: 'The Japan collection', to: '/journeys/japan-2' },
      { label: 'Adventure collection', to: '/adventure' },
      { label: 'Essence Japan with Hakone', to: '/tour-detail-japan-5' },
      { label: 'Pattaya & Bangkok Escape', to: '/tour-detail-thailand-2' },
    ],
  },
  {
    id: 'company', name: 'The company',
    links: [
      { label: 'Our story', to: '/about-us2' },
      { label: 'Vision & Mission', to: '/vision-mission' },
      { label: 'Meet the team', to: '/about-us2/team' },
      { label: 'Traveller reviews', to: '/testimonials' },
      { label: 'Careers', to: '/careers' },
      { label: 'Press & Media', to: '/press-media' },
      { label: 'Inspiration — Dispatches', to: '/inspiration' },
      { label: 'Gift vouchers', to: '/gift-vouchers' },
    ],
  },
  {
    id: 'partner', name: 'Partner with us',
    links: [
      { label: 'Become a Franchise Partner', to: '/franchise' },
      { label: 'Collaborate With Us', to: '/collaborate' },
      { label: 'Preferred Sales Partner', to: '/become-a-partner' },
    ],
  },
  {
    id: 'help', name: 'Help & legal',
    links: [
      { label: 'Talk to an expert', to: CALLBACK },
      { label: 'FAQs', to: '/faq2' },
      { label: `Call ${CONTACT_CK.phoneDisplay}`, href: CONTACT_CK.phoneHref },
      { label: 'Email the specialists', href: `mailto:${CONTACT_CK.email}` },
      { label: 'Terms & Conditions', to: '/terms' },
      { label: 'Refund policy', to: '/terms#refund-policy' },
    ],
  },
];

/* Everything the search dropdown can jump straight to — destinations first,
   then pages. Dialog-opening entries (CALLBACK) and bare hrefs are left to
   the index below; a suggestion always navigates somewhere. */
const SEARCH_POOL = [
  ...REGIONS.flatMap((r) => r.places.map((p) => ({ label: p.label, to: p.to, kind: 'dest' }))),
  ...WAYS.map((w) => ({ label: w.label, to: w.to, kind: 'page' })),
  ...SITE_GROUPS.flatMap((g) => g.links
    .filter((l) => l.to && l.to !== CALLBACK)
    .map((l) => ({ label: l.label, to: l.to, kind: 'page' }))),
];

const DEST_COUNT = REGIONS.reduce((n, r) => n + r.places.length, 0);
const PAGE_COUNT = DEST_COUNT + WAYS.length + SITE_GROUPS.reduce((n, g) => n + g.links.length, 0);

/* The scrollspy rail — the indexed sections first (regions, then the site
   pages), then the full-width closing sections it can still jump to. */
const RAIL = [
  ...REGIONS.map((r) => ({ id: r.id, label: r.name, count: r.places.length })),
  { id: 'pages', label: 'Site pages', count: SITE_GROUPS.reduce((n, g) => n + g.links.length, 0) },
  { id: 'ways', label: 'Ways to travel', count: WAYS.length },
];

/* The homepage hero shows its populars before you type — same manners here. */
const POPULAR_DESTS = ['Japan', 'Switzerland', 'Italy', 'France', 'Greece', 'Thailand', 'Dubai', 'Australia'];

/* Highlight the matched substring of a label while searching. */
function Hi({ text, term }) {
  if (!term) return text;
  const i = text.toLowerCase().indexOf(term);
  if (i === -1) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark>{text.slice(i, i + term.length)}</mark>
      {text.slice(i + term.length)}
    </>
  );
}

/* One row of the index — destination or site page. */
function IndexLink({ item, term, hidden }) {
  const inner = (
    <>
      <span className="smap-link__label">
        <span><Hi text={item.label} term={term} /></span>
      </span>
      <ArrowUpRight size={15} className="smap-link__arrow" aria-hidden="true" />
    </>
  );
  const cls = `smap-link${hidden ? ' is-hidden' : ''}`;
  if (item.href) return <a href={item.href} className={cls}>{inner}</a>;
  return <Link to={item.to} className={cls}>{inner}</Link>;
}

/* ---------------------------------------------------------------
   The dotted world map. Dots are grouped per region so a whole
   continent lights as one; hover and click are wired on the groups.
   --------------------------------------------------------------- */
const CELL = 13;                       // svg units per grid cell
const MAP_W = GRID_W * CELL;
const MAP_H = WORLD.length * CELL;

function WorldMap({ active, dimmed, onHover, onLeave, onPick }) {
  /* Build the dot lists once — grouped by region id, plus the faint
     neutral land. */
  const groups = useMemo(() => {
    const byRegion = {};
    const neutral = [];
    WORLD.forEach((rawRow, r) => {
      const row = rawRow.padEnd(GRID_W, '.').slice(0, GRID_W);
      for (let c = 0; c < GRID_W; c += 1) {
        const ch = row[c];
        if (ch === '.') continue;
        const pt = { x: c * CELL + CELL / 2, y: r * CELL + CELL / 2, key: `${r}-${c}` };
        if (ch === 'X') neutral.push(pt);
        else {
          const region = CODE_REGION[ch];
          (byRegion[region] = byRegion[region] || []).push(pt);
        }
      }
    });
    return { byRegion, neutral };
  }, []);

  const regionMeta = useMemo(
    () => Object.fromEntries(REGIONS.map((r) => [r.id, r])),
    [],
  );

  return (
    <svg
      className="smap-map"
      viewBox={`0 0 ${MAP_W} ${MAP_H}`}
      role="group"
      aria-label="World map of our destinations — choose a continent to jump to its index"
    >
      {groups.neutral.map((p) => (
        <circle key={p.key} className="smap-dot smap-dot--x" cx={p.x} cy={p.y} r={CELL * 0.26} />
      ))}
      {Object.entries(groups.byRegion).map(([regionId, pts]) => {
        const meta = regionMeta[regionId];
        const cls = [
          'smap-continent',
          active === regionId ? 'is-active' : '',
          dimmed && dimmed.has(regionId) ? 'is-dim' : '',
        ].filter(Boolean).join(' ');
        return (
          <g
            key={regionId}
            className={cls}
            role="button"
            tabIndex={0}
            aria-label={`${meta.name} — ${meta.places.length} destinations. Jump to its index.`}
            onPointerEnter={() => onHover(regionId)}
            onPointerLeave={onLeave}
            onFocus={() => onHover(regionId)}
            onBlur={onLeave}
            onClick={() => onPick(regionId)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPick(regionId); } }}
          >
            {/* The transparent stroke widens each dot's hit area to cover the
                gaps between dots, so hovering a continent doesn't flicker as
                the pointer crosses the water between circles. */}
            {pts.map((p) => (
              <circle
                key={p.key}
                className="smap-dot"
                cx={p.x} cy={p.y} r={CELL * 0.3}
                stroke="transparent" strokeWidth={CELL * 0.85}
              />
            ))}
          </g>
        );
      })}

      {/* The Japan beacon — the one place on the map that is fully live. */}
      <g className="smap-beacon" aria-hidden="true">
        <circle className="smap-beacon__ring" cx={BEACON.col * CELL} cy={BEACON.row * CELL} r={CELL * 0.6} />
        <circle className="smap-beacon__core" cx={BEACON.col * CELL} cy={BEACON.row * CELL} r={CELL * 0.34} />
      </g>
    </svg>
  );
}

export default function Sitemap() {
  const navigate = useNavigate();
  const rootRef = useRef(null);
  const searchRef = useRef(null);

  const formRef = useRef(null);
  const mrailRef = useRef(null);

  /* Touch devices can't hover — the map caption and interactions speak
     "tap" there instead. Checked once; a device doesn't change hands. */
  const [coarse] = useState(() => window.matchMedia('(hover: none)').matches);

  const [q, setQ] = useState('');
  const [dropOpen, setDropOpen] = useState(false);
  const [hoverRegion, setHoverRegion] = useState(null);
  const [railActive, setRailActive] = useState(REGIONS[0].id);

  const term = q.trim().toLowerCase();

  /* The dropdown's direct-jump suggestions, mirroring the homepage hero:
     untyped → the popular destinations; typed → matching destinations first,
     then matching pages. */
  const suggestions = useMemo(() => {
    if (!term) {
      return POPULAR_DESTS
        .map((n) => SEARCH_POOL.find((s) => s.kind === 'dest' && s.label === n))
        .filter(Boolean);
    }
    const hits = SEARCH_POOL.filter((s) => s.label.toLowerCase().includes(term));
    return [
      ...hits.filter((s) => s.kind === 'dest').slice(0, 5),
      ...hits.filter((s) => s.kind === 'page').slice(0, 4),
    ];
  }, [term]);

  /* Same dropdown manners as the homepage search: click-away and Escape
     both close it. */
  useEffect(() => {
    if (!dropOpen) return undefined;
    const onDown = (e) => {
      if (formRef.current && !formRef.current.contains(e.target)) setDropOpen(false);
    };
    const onKey = (e) => { if (e.key === 'Escape') setDropOpen(false); };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [dropOpen]);

  /* ---- The filter. A region stays whole if its NAME matches;
     otherwise it keeps only its matching places. Same for groups. ---- */
  const view = useMemo(() => {
    const hit = (label) => !term || label.toLowerCase().includes(term);
    const regions = REGIONS.map((r) => {
      const nameHit = hit(r.name);
      const places = r.places.map((p) => ({ ...p, visible: nameHit || hit(p.label) }));
      const shown = places.filter((p) => p.visible).length;
      return { ...r, places, shown };
    });
    const ways = WAYS.map((w) => ({ ...w, visible: hit(w.label) }));
    const groups = SITE_GROUPS.map((g) => {
      const nameHit = hit(g.name);
      const links = g.links.map((l) => ({ ...l, visible: nameHit || hit(l.label) }));
      return { ...g, links, shown: links.filter((l) => l.visible).length };
    });
    const total = regions.reduce((n, r) => n + r.shown, 0)
      + ways.filter((w) => w.visible).length
      + groups.reduce((n, g) => n + g.shown, 0);
    return { regions, ways, groups, total };
  }, [term]);

  /* Continents with zero matches fade on the map while searching. */
  const dimmedRegions = useMemo(() => {
    if (!term) return null;
    return new Set(view.regions.filter((r) => r.shown === 0).map((r) => r.id));
  }, [term, view]);

  const jumpTo = (id) => {
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById(`smap-${id}`)?.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'start' });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!term) return;
    if (view.total === 0) {
      navigate(`/journeys4?q=${encodeURIComponent(q.trim())}`);
      return;
    }
    const first = view.regions.find((r) => r.shown > 0)?.id
      || (view.groups.some((g) => g.shown > 0) ? 'pages' : 'ways');
    jumpTo(first);
  };

  /* "/" focuses the search from anywhere on the page. */
  useEffect(() => {
    const onKey = (e) => {
      const tag = e.target.tagName;
      if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  /* Keep the mobile contents bar's active chip centred in its scroller.
     Manual scrollLeft (not scrollIntoView) so the PAGE never moves. */
  useEffect(() => {
    const scroller = mrailRef.current;
    if (!scroller) return;
    const chip = scroller.querySelector('.is-active');
    if (!chip) return;
    scroller.scrollTo({
      left: chip.offsetLeft - scroller.clientWidth / 2 + chip.clientWidth / 2,
      behavior: 'smooth',
    });
  }, [railActive]);

  /* ---- Scrollspy for the rail — IntersectionObserver, always on. ---- */
  useEffect(() => {
    const sections = RAIL.map((r) => document.getElementById(`smap-${r.id}`)).filter(Boolean);
    if (!sections.length) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) setRailActive(en.target.id.replace('smap-', ''));
        });
      },
      { rootMargin: '-30% 0px -60% 0px' },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  /* ---- GSAP: the intro plate + scroll reveals, gated cleanly. ---- */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set('[data-reveal], .smap-dot, .smap-hero__inner > *', { clearProps: 'all', opacity: 1 });
      });

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        /* The plate assembles: copy first, then the world cascades in.
           fromTo (not from) so both endpoints are explicit — from() reads
           its end value from the DOM at init, which StrictMode's mount →
           revert → remount cycle can catch mid-transition at ~0, freezing
           the dots invisible. The plate wears .is-drawing for the duration
           so the dots' CSS opacity transition can't fight the tween, and
           everything is handed back to the stylesheet (clearProps) at the
           end so the hover/dim classes work on top. */
        const plate = document.querySelector('.smap-plate');
        plate?.classList.add('is-drawing');
        gsap.timeline({
          defaults: { ease: 'power3.out' },
          onComplete: () => {
            gsap.set('.smap-hero__inner > *, .smap-dot, .smap-legend__chip', { clearProps: 'all' });
            plate?.classList.remove('is-drawing');
          },
        })
          .fromTo('.smap-hero__inner > *',
            { y: 28, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9, stagger: 0.09 })
          .fromTo('.smap-dot',
            { opacity: 0, scale: 0, transformOrigin: 'center' },
            {
              opacity: 1,
              scale: 1,
              duration: 0.5,
              ease: 'power2.out',
              stagger: { each: 0.0022, from: 'random' },
            }, '-=0.55')
          .fromTo('.smap-legend__chip',
            { y: 14, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, stagger: 0.05 }, '-=0.8');

        /* Section furniture rises as it enters; rules draw themselves.
           The set() MUST precede the batch(), or an element already in
           view when its trigger evaluates would be hidden after its one
           chance to reveal has passed. */
        gsap.set('[data-reveal]', { opacity: 0, y: 26 });
        ScrollTrigger.batch('[data-reveal]', {
          start: 'top 88%',
          once: true,
          onEnter: (els) => gsap.to(els, {
            opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08,
          }),
        });

        gsap.utils.toArray('.smap-rule').forEach((el) => {
          gsap.from(el, {
            scaleX: 0,
            transformOrigin: 'left center',
            duration: 1.1,
            ease: 'power3.inOut',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          });
        });

      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  /* Filtering changes the page height — keep trigger positions honest. */
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [term]);

  const activeRegion = hoverRegion && REGIONS.find((r) => r.id === hoverRegion);

  return (
    <div className="h26 new-typo n3 smap" ref={rootRef}>
      <SiteNav solidAt={80} skipTo="#smap-index" skipLabel="Skip to the index" />

      <main id="smap-main">
        {/* ================= THE CHART PLATE ================= */}
        <header className="smap-hero">
          <div className="smap-hero__grid" aria-hidden="true" />
          <div className="smap-hero__inner">
            <p className="smap-eyebrow">The index &middot; Every page, every place</p>
            <h1 className="smap-title">
              The whole world, <em>on one page.</em>
            </h1>
            <p className="smap-lede">
              {PAGE_COUNT} pages &middot; {DEST_COUNT} destinations &middot; 6 regions &middot; one company, since 1758.
              Search it, or wander the map.
            </p>

            <form className="smap-search" role="search" onSubmit={onSubmit} ref={formRef}>
              <label className="smap-srlabel" htmlFor="smap-q">Search the index</label>
              <Search size={18} aria-hidden="true" className="smap-search__icon" />
              <input
                id="smap-q"
                ref={searchRef}
                type="search"
                value={q}
                onFocus={() => setDropOpen(true)}
                onChange={(e) => { setQ(e.target.value); setDropOpen(true); }}
                placeholder="Try “Japan”, “group tours”, “careers”…"
                autoComplete="off"
                aria-expanded={dropOpen && suggestions.length > 0}
                aria-controls="smap-suggest"
              />
              {q && (
                <button type="button" className="smap-search__clear" onClick={() => setQ('')} aria-label="Clear search">
                  <X size={16} />
                </button>
              )}

              {/* Typeahead, with the homepage hero's dropdown manners: populars
                  on focus, matches as you type, each option jumping STRAIGHT to
                  its page — the index below keeps filtering live regardless. */}
              {dropOpen && suggestions.length > 0 && (
                <div className="smap-search__drop" id="smap-suggest" role="listbox" aria-label={term ? 'Suggestions' : 'Popular destinations'}>
                  <span className="smap-search__droplabel">{term ? 'Go straight there' : 'Popular destinations'}</span>
                  {suggestions.map((s) => (
                    <button
                      key={`${s.kind}-${s.label}`}
                      type="button"
                      className="smap-search__opt"
                      role="option"
                      aria-selected={false}
                      onClick={() => { setDropOpen(false); navigate(s.to); }}
                    >
                      {s.kind === 'dest' ? <MapPin size={15} aria-hidden="true" /> : <FileText size={15} aria-hidden="true" />}
                      <span><Hi text={s.label} term={term} /></span>
                    </button>
                  ))}
                </div>
              )}
            </form>

            {/* Screen readers and sighted users both get the running tally. */}
            <p className="smap-count" role="status" aria-live="polite">
              {term
                ? (view.total === 0
                  ? <>No pages match &ldquo;{q.trim()}&rdquo; — press Enter to search all journeys instead.</>
                  : <>{view.total} page{view.total === 1 ? '' : 's'} match &ldquo;{q.trim()}&rdquo;</>)
                : <>&nbsp;</>}
            </p>
          </div>

          <div className="smap-plate">
            <WorldMap
              active={hoverRegion}
              dimmed={dimmedRegions}
              onHover={setHoverRegion}
              onLeave={() => setHoverRegion(null)}
              onPick={jumpTo}
            />
            {/* The chart caption — swaps to the hovered continent. Touch
                devices have no hover, so the caption says "tap" there. */}
            <p className="smap-plate__caption" aria-hidden="true">
              {activeRegion
                ? <>{activeRegion.name} &middot; {activeRegion.places.length} destinations — {coarse ? 'tap' : 'click'} to open</>
                : (coarse
                  ? <>Tap a continent to open its index</>
                  : <>Hover a continent &middot; click to open its index</>)}
            </p>

            <div className="smap-legend" role="list" aria-label="Regions">
              {REGIONS.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  role="listitem"
                  className={`smap-legend__chip${hoverRegion === r.id ? ' is-active' : ''}${dimmedRegions?.has(r.id) ? ' is-dim' : ''}`}
                  onPointerEnter={() => setHoverRegion(r.id)}
                  onPointerLeave={() => setHoverRegion(null)}
                  onFocus={() => setHoverRegion(r.id)}
                  onBlur={() => setHoverRegion(null)}
                  onClick={() => jumpTo(r.id)}
                >
                  <span className="smap-legend__dot" aria-hidden="true" />
                  {r.name}
                  <span className="smap-legend__count">{term ? view.regions.find((v) => v.id === r.id).shown : r.places.length}</span>
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* ================= THE INDEX ================= */}
        {/* tabIndex so the skip link can MOVE focus here, not just scroll. */}
        <div className="smap-index" id="smap-index" tabIndex={-1}>
          {/* MOBILE contents bar — the rail's little sibling: a sticky,
              horizontally scrolling chip row under the nav, driven by the
              same scrollspy, its active chip kept centred. Hidden on desktop
              where the full rail takes over. */}
          <nav className="smap-mrail" aria-label="Index sections" ref={mrailRef}>
            {RAIL.map((r) => {
              const shown = term
                ? (view.regions.find((v) => v.id === r.id)?.shown
                  ?? (r.id === 'ways'
                    ? view.ways.filter((w) => w.visible).length
                    : view.groups.reduce((n, g) => n + g.shown, 0)))
                : r.count;
              return (
                <button
                  key={r.id}
                  type="button"
                  className={`smap-mrail__chip${railActive === r.id ? ' is-active' : ''}${term && shown === 0 ? ' is-dim' : ''}`}
                  onClick={() => jumpTo(r.id)}
                >
                  {r.label}
                  <span className="smap-mrail__count">{shown}</span>
                </button>
              );
            })}
          </nav>

          {/* Sticky atlas rail — desktop only; the bar above covers mobile. */}
          <nav className="smap-rail" aria-label="Index sections">
            <span className="smap-rail__title">Contents</span>
            {RAIL.map((r) => {
              const shown = term
                ? (view.regions.find((v) => v.id === r.id)?.shown
                  ?? (r.id === 'ways'
                    ? view.ways.filter((w) => w.visible).length
                    : view.groups.reduce((n, g) => n + g.shown, 0)))
                : r.count;
              return (
                <button
                  key={r.id}
                  type="button"
                  className={`smap-rail__item${railActive === r.id ? ' is-active' : ''}${term && shown === 0 ? ' is-dim' : ''}`}
                  onClick={() => jumpTo(r.id)}
                >
                  <span className="smap-rail__label">{r.label}</span>
                  <span className="smap-rail__count">{shown}</span>
                </button>
              );
            })}
          </nav>

          <div className="smap-body">
            {/* ---------- Destinations, region by region ---------- */}
            {view.regions.map((r) => (
              <section
                key={r.id}
                id={`smap-${r.id}`}
                className={`smap-region${term && r.shown === 0 ? ' is-hidden' : ''}`}
                aria-labelledby={`smap-${r.id}-h`}
              >
                <div className="smap-region__head" data-reveal>
                  <div>
                    <h2 className="smap-region__name" id={`smap-${r.id}-h`}>
                      {r.name}
                      <span className="smap-region__tally">
                        {term ? `${r.shown} of ${r.places.length}` : r.places.length} destinations
                      </span>
                    </h2>
                    <p className="smap-region__tagline">{r.tagline}</p>
                  </div>
                </div>
                <div className="smap-rule" aria-hidden="true" />
                <div className="smap-links" data-reveal>
                  {r.places.map((p) => (
                    <IndexLink key={p.label} item={p} term={term} hidden={!p.visible} />
                  ))}
                </div>
              </section>
            ))}

            {/* ---------- Site pages ---------- */}
            <section
              id="smap-pages"
              className={`smap-pages${term && view.groups.every((g) => g.shown === 0) ? ' is-hidden' : ''}`}
              aria-labelledby="smap-pages-h"
            >
              <div className="smap-region__head" data-reveal>
                <div>
                  <h2 className="smap-region__name" id="smap-pages-h">Site pages</h2>
                  <p className="smap-region__tagline">Everything else — the company, the paperwork, the people.</p>
                </div>
              </div>
              <div className="smap-rule" aria-hidden="true" />
              <div className="smap-pages__grid" data-reveal>
                {view.groups.map((g) => (
                  <div key={g.id} className={`smap-pagegroup${term && g.shown === 0 ? ' is-hidden' : ''}`}>
                    <h3 className="smap-pagegroup__name">{g.name}</h3>
                    {g.links.map((l) => (
                      <IndexLink key={l.label} item={l} term={term} hidden={!l.visible} />
                    ))}
                  </div>
                ))}
              </div>
            </section>

          </div>
        </div>

        {/* ---------- Ways to travel — FULL WIDTH, the homepage's fork
             section verbatim: centered head, hi-lane cards, same classes. */}
        <section
          id="smap-ways"
          className={`h26-section smap-fork${term && !view.ways.some((w) => w.visible) ? ' is-hidden' : ''}`}
          aria-labelledby="smap-ways-h"
        >
          <div className="h26-head hi-center" data-reveal>
            <p className="h26-label">Start here</p>
            <h2 className="h26-h2" id="smap-ways-h">Ways to travel</h2>
          </div>
          <div className="hi-fork-grid hi-fork-grid--three" data-reveal>
            {view.ways.map((w) => (
              <div key={w.label} className={`hi-lane${w.featured ? ' is-featured' : ''}${!w.visible ? ' is-hidden' : ''}`}>
                {w.featured && <span className="hi-lane-badge">Recommended</span>}
                <Link to={w.to} className="hi-lane-link">
                  <div className="hi-lane-media">
                    <img src={w.photo} alt="" loading="lazy" />
                  </div>
                  <div className="hi-lane-body">
                    <span className="hi-lane-tag">{w.tag}</span>
                    <h3><Hi text={w.label} term={term} /></h3>
                    <p>{w.desc}</p>
                    <span className="h26-btn h26-btn-pill">{w.cta} <ArrowRight size={16} /></span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- The way out — the homepage's closing contact section,
             full-bleed and flowing straight into the footer, exactly as on
             the homepage. Same classes, photograph, scrim and grain. */}
        <section className="h26-contact smap-contact" aria-labelledby="smap-cta-h" data-reveal>
              <img
                className="h26-contact-bg"
                src={img('https://images.unsplash.com/photo-1534445867742-43195f401b6c', 1600)}
                alt="" aria-hidden="true" loading="lazy"
              />
              <div className="h26-contact-scrim" aria-hidden="true" />
              <div className="h26-contact-grain" aria-hidden="true" />
              <div className="h26-contact-inner">
                <p className="h26-contact-eyebrow">
                  <span className="h26-contact-rule" aria-hidden="true" /> Talk to us
                </p>
                <h2 className="h26-contact-title" id="smap-cta-h">
                  Can&rsquo;t find it?
                  <br />
                  <span className="wr-accent">A person can.</span>
                </h2>
                <p className="h26-contact-sub">
                  A specialist who has been where you&rsquo;re going will point you to the
                  right page — or plan the trip that isn&rsquo;t on one yet.
                </p>
                <div className="h26-contact-ctas">
                  <Link to={CALLBACK} className="h26-btn h26-btn-accent h26-btn-lg">
                    <Phone size={17} /> Schedule a callback
                  </Link>
                  <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className="h26-btn h26-btn-lg h26-contact-wa">
                    <WaIcon size={18} /> WhatsApp us
                  </a>
                </div>
                <p className="h26-contact-alt">
                  <Clock size={14} aria-hidden="true" /> Travel experts available 9am–9pm IST, every day
                </p>
              </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
