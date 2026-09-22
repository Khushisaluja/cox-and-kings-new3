/* ============================================================================
   Cox & Kings India — FRANCHISE PARTNERSHIP, VERSION 2   (route: /franchise-v2)

   A second, unlinked take on the franchise page. /franchise is untouched and
   still ships; this one is reachable by URL only so the two can be compared.

   ---------------------------------------------------------------------------
   WHERE THE CONTENT COMES FROM
   The sections, their order and their copy are the `coxandkings-franchise_2_2`
   prototype in the project root, carried over word for word:

     HERO      the destination map + "Become an entrepreneur with a Cox & Kings
               store."
     THE OFFER four tabs — what we bring (the orbit), what you bring (six
               requirements), how it works (five steps), questions (six FAQs)
     APPLY     the three-step eligibility form, its qualified/nurture routing
               and the celebration state
     TERMS     the twelve plain-words franchise terms and the closing note

   WHAT IS REDESIGNED
   The prototype was its own little site — scroll-snapped full-screen panels, a
   private palette, its own nav and its own footer. This page is a page of THIS
   site instead:

     · Local chrome: a logo + CTA nav, and the /festive-getaway-v4 footer.
     · design.md throughout — Voyager Blue is the primary action, Sienna Flame
       the accent (numerals, eyebrows, the arcs on the map — never a button),
       dark ground is Neutrals-Dark/900 #021330, display type is Cormorant
       Garamond Light and everything else is Work Sans. 4px radius on anything
       interactive. Warm paper neutrals, never cold grey.
     · THE HERO IS ONE SCREEN, NOT TWO. The prototype spent two full viewports
       on two maps — world, then India — with near-identical copy on each. Here
       they are one hero with a switch between them: same two maps, same two
       sets of copy, half the scroll and a reason to touch the page in the first
       four seconds. The hub is marked, every destination is a dot on it, and
       the ticker underneath names them one at a time while the map lights the
       one being named. No flight arcs: thirty curves fanning out of one point
       buried the map they were drawn on top of.
     · Normal document scroll. scroll-snap on a 5-screen page fights every
       trackpad and every screen reader; the sections are measured with the
       house spacing scale instead.

   MOTION — GSAP + ScrollTrigger, all of it inside gsap.matchMedia() gated on
   (prefers-reduced-motion: no-preference), and all of it fromTo() rather than
   from(). NOTHING is hidden in CSS: every resting state is the visible one and
   GSAP owns the from-state, so a reduced-motion visitor — or a visitor whose
   GSAP never loads — gets the whole page, static and complete.

   ACCESSIBILITY, where this differs from the prototype
     · The tab strip is a real tablist with arrow-key roving focus, and its
       9-second auto-advance has a visible pause control (WCAG 2.2.2) and stops
       for good the moment anyone touches it.
     · The orbit's six nodes are buttons, so the description each one reveals
       in the hub is reachable by keyboard, not hover only.
     · The form's option chips are real radios behind their labels; errors are
       announced with role="alert" and the invalid fields are marked; changing
       step moves focus to the new step's heading.
     · The map is decorative and hidden from the accessibility tree — every
       destination it names is also named in the copy around it.
   ========================================================================== */

import {
  useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState,
} from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight, ArrowLeft, Check, ChevronDown,
  Globe2, MapPin, Inbox, FileCheck2, GraduationCap, ListChecks, Store,
  LayoutGrid, Users, Building2, Monitor, Table2, ClipboardList, Phone, Mail, FileText,
  ShieldCheck, Calendar, Wallet, CircleX, BadgeCheck, Tag, Lock, Ban, Scale, Gavel, PhoneCall,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { CONTACT_CK } from '../components/SiteChrome';
import { SmartLink } from '../components/ScheduleCall';
import { CALLBACK } from '../data/v3content';
import './FranchiseV2.css';

gsap.registerPlugin(ScrollTrigger);

/* Point at the lead handler before this goes live. Empty = log to the console
   and still show the applicant their confirmation, which is what the prototype
   did: a broken endpoint must never cost us a filled-in form. */
const FORM_ENDPOINT = '';

/* THE FRANCHISE DESK'S OWN CONTACT.
   The address is the one the live Cox & Kings franchise page publishes —
   NOT "franchise@", which the business does not use. /franchise and
   /become-a-partner both carry the same one.

   This page publishes a PHONE NUMBER, which /new3 and /mice deliberately do
   not: those route every "talk to us" into the callback dialog, on the
   grounds that a tel: link fires an unexpected call and tells us nothing
   about who is ringing. A franchise enquiry is a business conversation with a
   named desk rather than a holiday enquiry from an unknown visitor, so here
   the number is published directly. */
const EMAIL = 'franchisee@coxandkings.com';
const PHONE_DISPLAY = '+91 92173 87790';
const PHONE_HREF = 'tel:+919217387790';

/* ===========================================================================
   MAP GEOMETRY

   Both maps are dot-matrix land masses drawn from coarse outline polygons and
   a point-in-polygon test, rather than a 200KB TopoJSON — the shapes only have
   to read as "the world" and "India" behind a scrim, and this costs nothing to
   ship. Geometry is computed once per mode in a useMemo and rendered as plain
   JSX, so GSAP animates real React-owned nodes.
   =========================================================================== */

/* name, lon, lat, text-anchor, label dx, label dy */
const WORLD_DEST = [
  ['Canada', -106, 56, 'middle', 0, -10], ['United States', -98, 39, 'middle', 0, -10],
  ['Brazil', -51, -10, 'middle', 0, 15], ['United Kingdom', -3, 54, 'end', -7, -4],
  ['Netherlands', 5.5, 52, 'start', 7, -7], ['France', 2, 47, 'end', -7, 5],
  ['Germany', 10.5, 51, 'start', 7, 3], ['Switzerland', 8, 47, 'end', -7, 13],
  ['Austria', 14.5, 47.5, 'start', 7, 12], ['Spain', -4, 40, 'end', -7, 10],
  ['Italy', 12.5, 42.5, 'start', 7, 19], ['Greece', 22, 39, 'middle', 4, 17],
  ['Turkey', 35, 39, 'start', 7, -6], ['Russia', 62, 58, 'middle', 0, -10],
  ['Egypt', 30, 27, 'middle', 0, 15], ['United Arab Emirates', 54, 24, 'start', 7, 4],
  ['Kenya', 38, 0, 'start', 7, 4], ['South Africa', 25, -29, 'middle', 0, 16],
  ['Mauritius', 57.5, -20.3, 'start', 7, 4], ['Maldives', 73, 3.5, 'end', -7, 4],
  ['Sri Lanka', 81, 7.5, 'start', 7, 7], ['Thailand', 101, 15, 'middle', -4, -9],
  ['Vietnam', 107, 16, 'start', 8, 5], ['Malaysia', 102, 4, 'end', -7, 1],
  ['Singapore', 103.8, 1.3, 'end', -7, 12], ['Indonesia', 116, -4, 'middle', 0, 16],
  ['China', 104, 36, 'middle', 0, -10], ['Japan', 138, 36, 'start', 8, 0],
  ['Australia', 134, -25, 'middle', 0, -10], ['New Zealand', 172, -42, 'end', -7, 4],
];

const INDIA_DEST = [
  ['Kashmir', 74.8, 34.1, 'start', 7, -2], ['Ladakh', 77.6, 34.2, 'start', 7, -2],
  ['Himachal', 77.2, 31.8, 'start', 7, 0], ['Uttarakhand', 79.3, 30.3, 'start', 7, -2],
  ['Punjab', 75.3, 31.1, 'end', -7, 2], ['Rajasthan', 73.8, 26.9, 'end', -7, 2],
  ['Agra', 78.0, 27.2, 'start', 7, 8],
  ['Varanasi', 83.0, 25.3, 'start', 7, 2], ['Gujarat', 71.6, 22.7, 'end', -7, 2],
  ['Kolkata', 88.4, 22.6, 'start', 7, 2], ['Sikkim', 88.5, 27.5, 'start', 7, -2],
  ['North East', 93.5, 26.0, 'start', 7, 0], ['Madhya Pradesh', 78.5, 23.5, 'middle', 0, 14],
  ['Maharashtra', 75.5, 19.5, 'end', -7, 2], ['Goa', 74.0, 15.4, 'end', -7, 2],
  ['Hyderabad', 78.5, 17.4, 'start', 7, 2], ['Karnataka', 76.0, 14.5, 'end', -7, 2],
  ['Andhra', 80.5, 15.5, 'start', 7, 2], ['Chennai', 80.3, 13.1, 'start', 7, 2],
  ['Kerala', 76.5, 10.0, 'end', -7, 2], ['Tamil Nadu', 78.5, 10.8, 'start', 7, 4],
  ['Andaman', 92.8, 11.7, 'start', 7, 2], ['Kanyakumari', 77.5, 8.1, 'middle', 0, 14],
];

/* Coarse continental outlines (lon, lat). Only accurate enough to be read as
   land at 1000x470 behind a 90%-opacity scrim. */
const WORLD_LAND = [
  [[-168, 66], [-158, 71], [-135, 70], [-105, 73], [-85, 73], [-70, 68], [-58, 60], [-53, 47], [-65, 45],
    [-70, 41], [-75, 35], [-81, 25], [-90, 29], [-97, 26], [-105, 20], [-115, 30], [-124, 40], [-130, 52],
    [-140, 59], [-152, 59], [-168, 66]],
  [[-105, 20], [-92, 17], [-83, 9], [-77, 8], [-80, 15], [-92, 16], [-105, 20]],
  [[-81, 10], [-72, 12], [-60, 10], [-50, 2], [-35, -6], [-38, -15], [-48, -25], [-57, -34], [-62, -40],
    [-66, -50], [-71, -52], [-75, -45], [-72, -30], [-70, -18], [-80, -5], [-81, 10]],
  [[-10, 36], [0, 44], [10, 45], [16, 40], [24, 36], [30, 31], [35, 33], [40, 38], [48, 40], [56, 37], [61, 25],
    [66, 25], [70, 20], [73, 8], [80, 13], [88, 21], [95, 16], [100, 13], [106, 10], [110, 20], [119, 23],
    [122, 31], [120, 40], [128, 42], [136, 50], [143, 54], [152, 59], [162, 61], [172, 66], [180, 68],
    [180, 74], [140, 75], [100, 76], [70, 73], [50, 70], [32, 70], [20, 70], [10, 60], [4, 55], [-5, 48],
    [-10, 43], [-10, 36]],
  [[-17, 15], [-17, 21], [-10, 28], [0, 32], [10, 33], [20, 32], [30, 31], [33, 27], [36, 22], [39, 15],
    [43, 11], [51, 11], [48, 3], [42, -2], [40, -10], [35, -18], [33, -25], [30, -30], [25, -34], [18, -34],
    [12, -18], [9, -2], [5, 4], [-5, 5], [-12, 8], [-17, 15]],
  [[113, -22], [115, -33], [122, -34], [130, -32], [138, -35], [146, -38], [150, -35], [153, -28],
    [148, -20], [142, -12], [135, -12], [130, -11], [125, -14], [118, -20], [113, -22]],
  [[-7, 50], [-7, 58], [-2, 58], [1, 53], [-3, 50]],
  [[129, 31], [136, 34], [141, 40], [146, 44], [142, 42], [139, 36], [133, 33], [129, 31]],
  [[95, 5], [103, -3], [112, -8], [120, -9], [131, -6], [140, -4], [141, 1], [125, 2], [110, 3], [98, 6]],
  [[43, -13], [50, -17], [47, -25], [44, -20], [43, -13]],
  [[166, -35], [174, -37], [178, -40], [172, -46], [167, -45], [166, -35]],
];

const INDIA_LAND = [
  [[76.5, 33.5], [74.5, 34.5], [75, 32], [74, 30], [72, 28.5], [70.5, 28], [70, 25],
    [68.5, 23.5], [69, 22], [70.5, 20.8], [73, 18], [73.5, 16], [74.5, 13.5], [76, 10.5],
    [77.5, 8.2], [78.5, 9.5], [79.5, 10.5], [80.3, 13], [80.2, 15], [82, 16.5], [84, 17.5],
    [86.5, 20], [87.5, 21.5], [88.5, 21.8], [89, 22.5], [88.5, 24], [89.5, 25.5], [91.5, 25],
    [92.5, 24], [94, 24], [95.5, 27], [97, 28], [96, 29.5], [93, 27.5], [91, 27], [89, 26],
    [88, 26.5], [85, 27.5], [83, 28.5], [81, 30], [79, 30.8], [77, 31.5], [76.5, 33.5]],
];

/* The two things the hero can be showing. Copy is the prototype's, verbatim:
   screen 1 for `world`, screen 1b for `india`. */
const MAP_MODES = {
  world: {
    id: 'world',
    tab: 'Worldwide',
    Icon: Globe2,
    eyebrow: 'Franchise partnership · Pan-India',
    title: 'Become an entrepreneur with a Cox & Kings store.',
    sub: "A heritage travel brand, the world's holidays, and the systems to sell them — behind your store.",
    tickLabel: 'Now selling worldwide',
    tickStatic: '30 countries',
    hub: { name: 'India', lon: 79, lat: 22, anchor: 'middle', dx: 0, dy: -13 },
    dest: WORLD_DEST,
    land: WORLD_LAND,
    latFrom: 76, latTo: -52,
  },
  india: {
    id: 'india',
    tab: 'Across India',
    Icon: MapPin,
    eyebrow: 'Across India · 100+ destinations',
    title: 'The whole of India, on your shelves.',
    sub: 'From Kashmir to Kanyakumari — every domestic holiday your store can sell, backed by Cox & Kings.',
    tickLabel: 'Now selling in India',
    tickStatic: '23 regions',
    hub: { name: 'Delhi', lon: 77.1, lat: 28.6, anchor: 'end', dx: -8, dy: -6 },
    dest: INDIA_DEST,
    land: INDIA_LAND,
    latFrom: 36, latTo: 7,
  },
};

/* The world map is a plain equirectangular fit to the viewBox. India gets an
   equal degrees-per-pixel scale on BOTH axes (rather than a fit-to-box stretch)
   so the country keeps its true proportions, offset to sit right of the copy.
   Each projector carries its inverse, because the dots are laid on a SCREEN
   lattice and asked "what is under you?" rather than walked in degrees — see
   buildGeo. */
const VB_W = 1000;
const VB_H = 470;

function projector(mode) {
  if (mode === 'india') {
    /* OX places India's centre in the viewBox. 560 (dead centre) put Gujarat
       and Delhi underneath the headline once `slice` had cropped the sides on
       a desktop hero; 640 walks the whole country clear of the copy column
       while still leaving it on screen when the map is fitted whole on a
       phone. */
    const CLON = 82; const CLAT = 22; const SCALE = 13; const OX = 640; const OY = 235;
    return {
      x: (lon) => OX + (lon - CLON) * SCALE,
      y: (lat) => OY - (lat - CLAT) * SCALE,
      lon: (x) => (x - OX) / SCALE + CLON,
      lat: (y) => CLAT - (y - OY) / SCALE,
    };
  }
  const TOP = 76; const BOT = -52;
  return {
    x: (lon) => ((lon + 180) / 360) * VB_W,
    y: (lat) => ((TOP - lat) / (TOP - BOT)) * VB_H,
    lon: (x) => (x / VB_W) * 360 - 180,
    lat: (y) => TOP - (y / VB_H) * (TOP - BOT),
  };
}

/* The dot matrix. PITCH is the distance between dot centres in viewBox units
   and DOT_R their radius — a ~0.45 radius-to-pitch ratio, which is the weight
   /sitemap's map reads at. */
const PITCH = 11;
const DOT_R = 2.5;

function inside(pt, poly) {
  let hit = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i, i += 1) {
    const [a, b] = poly[i];
    const [c, d] = poly[j];
    if ((b > pt[1]) !== (d > pt[1]) && pt[0] < ((c - a) * (pt[1] - b)) / (d - b) + a) hit = !hit;
  }
  return hit;
}

/* Everything the SVG needs, in one pass: the land dots (sorted west to east so
   the reveal can sweep across the map), the hub, and one arc + pin + label per
   destination. */
function buildGeo(modeId) {
  const cfg = MAP_MODES[modeId];
  const p = projector(modeId);

  /* THE DOTS ARE WALKED IN SCREEN SPACE, NOT IN DEGREES.
     Stepping by a fixed number of degrees was the first version of this and it
     is why the map read as noise: a degree of longitude and a degree of
     latitude are different numbers of pixels here (2.8 vs 3.7 on the world
     map), so the lattice came out 7px across and 9.5px down — a grid that is
     visibly not square reads as a mistake rather than as a matrix. Walking a
     square PITCH across the viewBox and asking the INVERSE projection what
     is underneath each point gives the even, deliberate grid /sitemap has. */
  const dots = [];
  for (let y = PITCH / 2; y < VB_H; y += PITCH) {
    for (let x = PITCH / 2; x < VB_W; x += PITCH) {
      const lon = p.lon(x);
      const lat = p.lat(y);
      if (lat > cfg.latFrom || lat < cfg.latTo) continue;
      if (!cfg.land.some((poly) => inside([lon, lat], poly))) continue;
      dots.push({ x: +x.toFixed(1), y: +y.toFixed(1) });
    }
  }
  dots.sort((a, b) => a.x - b.x);

  const hx = p.x(cfg.hub.lon);
  const hy = p.y(cfg.hub.lat);

  const nodes = cfg.dest.map(([name, lon, lat, anchor, dx, dy]) => {
    const x = p.x(lon);
    const y = p.y(lat);
    return { name, x, y, lx: x + dx, ly: y + dy, anchor };
  });

  /* A box drawn tight around what is actually on the map, for when it is
     shown whole rather than cropped. The full 1000x470 viewBox exists to be
     CROPPED by `slice` on a desktop hero — India in particular is pushed
     right inside it so the country clears the headline column. Shown whole,
     that offset just parks India off to one side of its own block, so the
     stacked mobile hero frames this box instead.

     Padded generously on x because labels are anchored at a point and run
     outwards from it: "United Arab Emirates" set `start` reaches some 60
     units past its anchor. */
  const xs = dots.map((d) => d.x).concat(nodes.map((n) => n.lx), [hx]);
  const ys = dots.map((d) => d.y).concat(nodes.map((n) => n.ly), [hy]);
  const x0 = Math.min(...xs) - 54;
  const x1 = Math.max(...xs) + 54;
  const y0 = Math.min(...ys) - 26;
  const y1 = Math.max(...ys) + 26;

  return {
    dots,
    dotR: DOT_R,
    box: `${x0.toFixed(0)} ${y0.toFixed(0)} ${(x1 - x0).toFixed(0)} ${(y1 - y0).toFixed(0)}`,
    hub: { x: hx, y: hy, name: cfg.hub.name, lx: hx + cfg.hub.dx, ly: hy + cfg.hub.dy, anchor: cfg.hub.anchor },
    nodes,
  };
}

/* ===========================================================================
   SHARED HOOKS
   =========================================================================== */

/* One source of truth for "does this visitor want motion?". Live, because the
   OS setting can change while the tab is open. */
function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(() => (
    typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ));
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduce(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduce;
}

/* Live matchMedia, for the one layout fact the markup itself has to know:
   below 861px the hero is stacked and the map is shown WHOLE rather than
   cropped, which changes the viewBox it is drawn in. */
function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => (
    typeof window !== 'undefined' && window.matchMedia(query).matches
  ));
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatches(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return matches;
}

/* ===========================================================================
   THE HERO MAP

   Remounted (via key) whenever the switch changes, so every mode change
   replays the draw rather than cutting to a finished map.
   =========================================================================== */

function DestinationMap({ modeId, activeIndex, reduce, whole }) {
  const host = useRef(null);
  const geo = useMemo(() => buildGeo(modeId), [modeId]);
  const active = geo.nodes[activeIndex % geo.nodes.length];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (reduce) return;
      const tl = gsap.timeline();

      /* The land arrives as a sweep from the Pacific eastward — the dots are
         already sorted by x, so a flat stagger IS the sweep. */
      tl.fromTo('.fv-dot', { opacity: 0 }, {
        opacity: 1, duration: 0.5, ease: 'none', stagger: { each: 1.1 / geo.dots.length },
      }, 0);

      /* OPACITY ONLY — deliberately no scale.
         This used to pop the hub in with scale + svgOrigin, and it left the
         group displaced: the white dot and its "India" label ended up sitting
         over Kazakhstan while everything else on the map was in the right
         place. The svg is sized in CSS pixels but drawn in viewBox units, and
         a transform-origin that crosses that boundary does not land where the
         coordinates say. Nothing on this map needs to be transformed, so
         nothing is. */
      tl.fromTo('.fv-hub', { opacity: 0 }, {
        opacity: 1, duration: 0.5, ease: 'power2.out',
      }, 0.55);

      tl.fromTo('.fv-pin', { opacity: 0 }, {
        opacity: 1, duration: 0.45, ease: 'power2.out', stagger: 0.03,
      }, 0.85);
    }, host);
    return () => ctx.revert();
  }, [modeId, geo, reduce]);

  return (
    <div className="fv-map" ref={host} data-mode={modeId} aria-hidden="true">
      {/* Cropped to fill a desktop hero; framed whole when it is a block of
          its own in the stacked mobile layout. */}
      <svg
        viewBox={whole ? geo.box : `0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio={whole ? 'xMidYMid meet' : 'xMidYMid slice'}
        focusable="false"
      >
        <g className="fv-map__dots">
          {geo.dots.map((d) => (
            <circle className="fv-dot" key={`${d.x}-${d.y}`} cx={d.x} cy={d.y} r={geo.dotR} />
          ))}
        </g>

        <g className="fv-map__pins">
          {geo.nodes.map((n, i) => (
            <g className={`fv-pin${i === activeIndex ? ' is-on' : ''}`} key={`p-${n.name}`}>
              <circle className="fv-pin__ring" cx={n.x} cy={n.y} r="3" />
              <circle className="fv-pin__core" cx={n.x} cy={n.y} r="2.4" />
            </g>
          ))}
          <g className="fv-hub">
            <circle className="fv-hub__ring" cx={geo.hub.x} cy={geo.hub.y} r="3" />
            <circle className="fv-hub__core" cx={geo.hub.x} cy={geo.hub.y} r="4.2" />
            <text className="fv-mlab fv-mlab--hub" x={geo.hub.lx} y={geo.hub.ly} textAnchor={geo.hub.anchor}>
              {geo.hub.name}
            </text>
          </g>
        </g>

        {/* ONE label, on the destination the ticker is naming.
            The first version of this map put a name beside all thirty pins at
            once: thirty halo'd words scattered over the arcs, which is the
            opposite of legible. The ticker already names them one at a time —
            so the map marks the one being named and stays quiet otherwise. */}
        {active && (
          <text
            className="fv-mlab fv-mlab--live"
            key={`${modeId}-${active.name}`}
            x={active.lx}
            y={active.ly}
            textAnchor={active.anchor}
          >
            {active.name}
          </text>
        )}
      </svg>
    </div>
  );
}

/* ===========================================================================
   HERO

   The prototype's two full-height map screens, folded into one. The switch
   below the copy changes BOTH the map and the words beside it, so the copy
   block is the switch's tabpanel.
   =========================================================================== */

function Hero({ onApply }) {
  const [modeId, setModeId] = useState('world');
  const reduce = usePrefersReducedMotion();
  const stacked = useMediaQuery('(max-width: 860px)');
  const mode = MAP_MODES[modeId];

  /* The ticker names one destination at a time and the map marks it. Slow
     enough to actually read — the arcs finish drawing long before this has
     been round more than twice. */
  const [tick, setTick] = useState(0);
  useEffect(() => {
    setTick(0);
    if (reduce) return undefined;
    const id = setInterval(() => setTick((i) => i + 1), 2600);
    return () => clearInterval(id);
  }, [modeId, reduce]);

  const activeIndex = tick % mode.dest.length;
  const tickName = reduce ? mode.tickStatic : mode.dest[activeIndex][0];

  /* ONE button, rendered in whichever place the layout wants it.
     Stacked, the CTA belongs directly under the map; on the desktop hero it
     belongs under the lede inside the copy block. CSS `order` cannot do this on its
     own — the button sits INSIDE .fv-hero__copy, so it is not a sibling of
     the map layer and no amount of ordering will move it past one. Rendering
     it twice behind display toggles would put two identically-labelled
     buttons in the accessibility tree, so the breakpoint picks a side. */
  const cta = (
    <div className="fv-hero__cta fv-hero__fade">
      <button type="button" className="fv-btn fv-btn--accent fv-btn--lg" onClick={onApply}>
        Check if you qualify
        <ArrowRight size={16} aria-hidden="true" />
      </button>
      {/* Small, under the action: the visitor who would rather write or ring
          than fill anything in should not have to scroll to find out they
          can. */}
      <p className="fv-hero__contact">
        <a href={`mailto:${EMAIL}`}>
          <Mail size={14} aria-hidden="true" />
          {EMAIL}
        </a>
        <span className="fv-hero__contact-sep" aria-hidden="true" />
        <a href={PHONE_HREF}>
          <Phone size={14} aria-hidden="true" />
          {PHONE_DISPLAY}
        </a>
      </p>
    </div>
  );

  /* The headline reveals word by word on mount and on every mode change — the
     copy block is keyed on the mode, so this effect re-runs with it. */
  const copyRef = useRef(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (reduce) return;
      gsap.fromTo('.fv-hero__word', { yPercent: 108, opacity: 0 }, {
        yPercent: 0, opacity: 1, duration: 0.85, ease: 'power3.out', stagger: 0.045, delay: 0.1,
      });
      gsap.fromTo('.fv-hero__fade', { y: 18, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.7, ease: 'power2.out', stagger: 0.09, delay: 0.42,
      });
    }, copyRef);
    return () => ctx.revert();
  }, [modeId, reduce]);

  /* Scrolling out of the hero: the map drifts and dims while the copy lifts a
     little faster, so the two layers separate instead of sliding as one slab. */
  const heroRef = useRef(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      /* Desktop only. Below 861px the map is a block IN THE FLOW under the
         copy (see the stylesheet), and a parallax transform would drag it out
         of the layout it now belongs to. */
      mm.add('(min-width: 861px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.to('.fv-hero__maplayer', {
          yPercent: 12, scale: 1.06, opacity: 0.32, ease: 'none',
          scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
        });
        gsap.to('.fv-hero__inner', {
          yPercent: -14, opacity: 0, ease: 'none',
          scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
        });
        return () => {};
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <header className="fv-hero" ref={heroRef}>
      {/* The map remounts on every mode change (that is what replays the draw),
          so the scroll parallax above is parked on this WRAPPER instead — a
          tween holding the old, detached <DestinationMap> would leave the new
          map sitting still. */}
      <div className="fv-hero__maplayer">
        <DestinationMap
          key={modeId}
          modeId={modeId}
          activeIndex={activeIndex}
          reduce={reduce}
          whole={stacked}
        />
      </div>
      <div className="fv-hero__scrim" aria-hidden="true" />
      <div className="fv-hero__grain" aria-hidden="true" />

      <div className="fv-wrap fv-hero__inner">
        <div
          className="fv-hero__copy"
          id="fv-hero-panel"
          role="tabpanel"
          aria-labelledby={`fv-map-tab-${modeId}`}
          key={modeId}
          ref={copyRef}
        >
          <p className="fv-eyebrow fv-eyebrow--light fv-hero__fade">{mode.eyebrow}</p>

          <h1 className="fv-hero__title">
            {mode.title.split(' ').map((w, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <span className="fv-hero__wordmask" key={`${w}-${i}`}>
                <span className="fv-hero__word">{w}</span>
              </span>
            ))}
          </h1>

          <p className="fv-hero__sub fv-hero__fade">{mode.sub}</p>

          {!stacked && cta}
        </div>
      </div>

      {/* The floor of the hero: the map switch on the left, the ticker on the
          right, a hairline above both. */}
      <div className="fv-hero__foot">
        <div className="fv-wrap fv-hero__footin">
          <div className="fv-switch" role="tablist" aria-label="Which map to show">
            {Object.values(MAP_MODES).map((m) => (
              <button
                type="button"
                key={m.id}
                role="tab"
                id={`fv-map-tab-${m.id}`}
                aria-selected={m.id === modeId}
                aria-controls="fv-hero-panel"
                tabIndex={m.id === modeId ? 0 : -1}
                className={`fv-switch__btn${m.id === modeId ? ' is-on' : ''}`}
                onClick={() => setModeId(m.id)}
                onKeyDown={(e) => {
                  if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
                  e.preventDefault();
                  const ids = Object.keys(MAP_MODES);
                  const next = ids[(ids.indexOf(modeId) + 1) % ids.length];
                  setModeId(next);
                  requestAnimationFrame(() => document.getElementById(`fv-map-tab-${next}`)?.focus());
                }}
              >
                <m.Icon size={15} aria-hidden="true" />
                {m.tab}
              </button>
            ))}
          </div>

          <p className="fv-ticker">
            <span className="fv-ticker__label">{mode.tickLabel}</span>
            <span className="fv-ticker__name" key={`${modeId}-${tickName}`}>{tickName}</span>
          </p>
        </div>
      </div>

      {/* Stacked, the action sits directly under the map and above the rule
          that opens the map's caption-and-switch block. */}
      {stacked && <div className="fv-wrap fv-hero__ctarow">{cta}</div>}
    </header>
  );
}

/* ===========================================================================
   THE OFFER — four tabs

   Laid out the way the tour-detail page lays out "Tour highlights" and "The
   policies": a section head (rule-and-slash eyebrow, serif heading with one
   italic accent word, lede) sitting ABOVE a full-width body, not beside it in
   a narrow column. The first version split this 4fr/7fr, which left the lede
   breaking one word to a line and gave a five-step timeline about ninety
   pixels a step.

   The tab strip no longer advances by itself. It used to rotate every nine
   seconds behind a progress rule, which needed a Pause control to satisfy
   WCAG 2.2.2 — and a Pause button parked above the content is exactly the kind
   of chrome that has no business on a marketing page. Manual tabs need no
   timer, no pause and no explanation.
   =========================================================================== */

const SUPPORT = [
  { t: 'Lead support', d: 'Enquiries routed straight to your store', Icon: Inbox },
  { t: 'Connect portal', d: 'Worldwide holiday packages, ready to sell', Icon: Globe2 },
  { t: 'Visa & insurance', d: 'A dedicated desk standing behind you', Icon: FileCheck2 },
  { t: 'Training', d: 'Sales and product sessions, bi-weekly', Icon: GraduationCap },
  { t: 'TeleCRM', d: 'Every lead tracked, nothing lost', Icon: ListChecks },
  { t: 'Branding designs', d: 'Store identity, designed and ready to build', Icon: Store },
];

const REQUIREMENTS = [
  { t: '600 sq ft', d: 'Minimum store size', Icon: LayoutGrid },
  { t: 'Prime location', d: 'Ground or first floor', Icon: MapPin },
  { t: 'Two staff', d: 'Experienced, hired by you', Icon: Users },
  { t: 'Interiors', d: 'Fitted to our guidelines', Icon: Building2 },
  { t: 'Two systems', d: 'Plus internet and a printer', Icon: Monitor },
  { t: 'Service desk', d: 'And display racks', Icon: Table2 },
];

const STEPS = [
  { t: 'Apply', d: 'Two minutes', Icon: ClipboardList },
  { t: 'We call', d: 'A real conversation', Icon: Phone },
  { t: 'Site review', d: 'We visit your location', Icon: MapPin },
  { t: 'Agreement', d: 'Terms shared and signed', Icon: FileText },
  { t: 'Open', d: 'Branding, training, launch', Icon: Store },
];

const FAQS = [
  ['Which cities?', 'Any city in India. Metro, tier 2 and tier 3 — applications are judged on the location and the applicant, not a fixed list.'],
  ['Do I need travel experience?', 'It helps but it is not essential. We work with established agents and with first-time owners from other industries.'],
  ['What does it cost?', 'Terms vary by city and are shared with you directly after we review your application and speak to you.'],
  ['How do I earn?', 'A share on the holidays and travel services sold through your store. The structure is explained in full before anything is signed.'],
  ['Will you send me customers?', 'We support your store with leads and the CRM to manage them. Retail travel is still local — the strongest stores build their own relationships too.'],
  ['How long does it take?', 'Mostly it depends on confirming and fitting out the location. Branding, training and system access run alongside the fit-out.'],
];

const TABS = [
  { id: 0, label: 'What we bring', kick: '// OUR SIDE', h: ['Everything except', 'the shop'], say: 'The brand, the product and the systems are ready. You open the doors.' },
  { id: 1, label: 'What you bring', kick: '// YOUR SIDE', h: ['A shop, a team,', 'and your city'], say: 'Six things. Nothing hidden behind them.' },
  { id: 2, label: 'How it works', kick: '// THE PROCESS', h: ['Apply today,', 'open your doors'], say: 'Five steps. We stay with you through all of them.' },
  { id: 3, label: 'Questions', kick: '// BEFORE YOU APPLY', h: ['The things people', 'always ask'], say: 'The six questions we are asked before almost every application.' },
];

function FaqList() {
  const [open, setOpen] = useState(() => new Set());
  return (
    <ul className="fv-faq">
      {FAQS.map(([q, a], i) => {
        const isOpen = open.has(i);
        return (
          <li key={q} className={isOpen ? 'is-open' : ''} data-panel-item>
            <h4>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`fv-faq-a-${i}`}
                onClick={() => setOpen((set) => {
                  const next = new Set(set);
                  if (next.has(i)) next.delete(i); else next.add(i);
                  return next;
                })}
              >
                {q}
                <ChevronDown size={19} strokeWidth={1.5} aria-hidden="true" />
              </button>
            </h4>
            <div className="fv-faq__a" id={`fv-faq-a-${i}`} hidden={!isOpen}>
              <p>{a}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/* Fallback only. --fv-navh is written from the live header height on mount
   (see FranchiseV2 below), because the header is one height on a phone,
   another on a desktop, and shorter again once it goes solid — the number
   /tour-detail-japan-5 hard-codes for its own sticky bar. */
const NAVH = 66;
const navHeight = () => document.querySelector('.h26-nav')?.offsetHeight || NAVH;

function Offer() {
  const reduce = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const tabRefs = useRef([]);
  const panelRef = useRef(null);
  const scrollerRef = useRef(null);
  const barRef = useRef(null);
  const panelWrapRef = useRef(null);

  /* Panel contents come in on every tab change, not just the first. */
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (reduce) return;
      gsap.fromTo('[data-panel-head]', { y: 18, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.55, ease: 'power2.out', stagger: 0.07,
      });
      gsap.fromTo('[data-panel-item]', { y: 20, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.55, ease: 'power2.out', stagger: 0.07, delay: 0.12,
      });
      /* The rule runs across the page on desktop and DOWN it below 980px
         (see the timeline block in the stylesheet), so the axis it draws on
         has to follow — scaling X on the vertical rule would squash its 2px
         width rather than reveal its length. */
      const wide = window.matchMedia('(min-width: 981px)').matches;
      gsap.fromTo(
        '[data-panel-rule]',
        wide ? { scaleX: 0 } : { scaleY: 0 },
        { scaleX: 1, scaleY: 1, duration: 1.1, ease: 'power2.inOut', delay: 0.2 },
      );
    }, panelRef);
    return () => ctx.revert();
  }, [active, reduce]);

  /* On a phone the four labels are wider than the bar, so it scrolls
     sideways. Keep the live tab in view — arrowing onto a tab that is off the
     right edge and having nothing appear to happen is the usual way a
     scrolling tab strip goes wrong. Only the strip's own scrollLeft is
     touched, never the page. */
  useEffect(() => {
    const scroller = scrollerRef.current;
    const el = tabRefs.current[active];
    if (!scroller || !el) return;
    const target = el.offsetLeft - (scroller.clientWidth - el.offsetWidth) / 2;
    scroller.scrollTo({
      left: Math.max(0, target),
      behavior: reduce ? 'auto' : 'smooth',
    });
  }, [active, reduce]);

  /* Picking a tab while the bar is PINNED — i.e. the panel has already
     scrolled up under it — puts the reader somewhere in the middle of content
     that has just been replaced. Re-anchor to the top of the new panel in that
     case, and leave the page alone otherwise. */
  const pick = (i) => {
    setActive(i);
    const wrap = panelWrapRef.current;
    if (!wrap) return;
    const offset = navHeight() + (barRef.current?.offsetHeight || 0);
    const top = wrap.getBoundingClientRect().top;
    if (top >= offset) return;
    window.scrollTo({
      top: window.scrollY + top - offset - 24,
      behavior: reduce ? 'auto' : 'smooth',
    });
  };

  const onTabKey = (e) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    const jump = e.key === 'Home' ? 0 : e.key === 'End' ? TABS.length - 1 : null;
    if (step === undefined && jump === null) return;
    e.preventDefault();
    const next = jump !== null ? jump : (active + step + TABS.length) % TABS.length;
    pick(next);
    requestAnimationFrame(() => tabRefs.current[next]?.focus());
  };

  const tab = TABS[active];

  return (
    <section className="fv-offer" id="fv-offer" aria-labelledby="fv-offer-h">
      <h2 className="fv-sr" id="fv-offer-h">The franchise partnership</h2>

      {/* THE STICKY BAR — /tour-detail-japan-5's sub-nav, same spec: pinned
          under the header, translucent paper over a blur, hairline top and
          bottom, a soft shadow beneath, and a sienna underline on the live
          label. It is full-bleed, so it needs its own inner .fv-wrap to keep
          the labels on the page's measure.

          It sticks WITHIN this section rather than for the whole page,
          because unlike the Japan bar (which links to sections you scroll
          through) these four labels switch the panel directly underneath
          them. Once you are past the offer they control nothing, so they
          release instead of following you down to the terms. */}
      <div className="fv-subnav" ref={barRef}>
        <div className="fv-wrap">
          <div
            className="fv-tabs"
            ref={scrollerRef}
            role="tablist"
            aria-label="The franchise partnership"
            onKeyDown={onTabKey}
          >
          {TABS.map((t, i) => (
            <button
              type="button"
              key={t.id}
              role="tab"
              id={`fv-tab-${t.id}`}
              aria-selected={i === active}
              aria-controls="fv-panel"
              tabIndex={i === active ? 0 : -1}
              ref={(el) => { tabRefs.current[i] = el; }}
              className={`fv-tab${i === active ? ' is-on' : ''}`}
              onClick={() => pick(i)}
            >
              {t.label}
            </button>
          ))}
          </div>
        </div>
      </div>

      <div className="fv-wrap" ref={panelWrapRef}>

        <div
          className="fv-panel"
          id="fv-panel"
          role="tabpanel"
          aria-labelledby={`fv-tab-${tab.id}`}
          tabIndex={0}
          key={active}
          ref={panelRef}
        >
          <div className="fv-sechead">
            <p className="fv-eyebrow" data-panel-head>{tab.kick}</p>
            <h3 className="fv-h2" data-panel-head>
              {tab.h[0]} <strong>{tab.h[1]}</strong>
            </h3>
            <p className="fv-lead" data-panel-head>{tab.say}</p>
          </div>

          {/* --- what we bring: six support cards ------------------------- */}
          {active === 0 && (
            <ul className="fv-cards">
              {SUPPORT.map((n) => (
                <li key={n.t} data-panel-item>
                  <span className="fv-ictile" aria-hidden="true">
                    <n.Icon size={20} strokeWidth={1.7} />
                  </span>
                  <div>
                    <strong>{n.t}</strong>
                    <p>{n.d}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* --- what you bring: the included-rail ------------------------ */}
          {active === 1 && (
            <ul className="fv-rail">
              {REQUIREMENTS.map((r) => (
                <li key={r.t} data-panel-item>
                  <span className="fv-ictile" aria-hidden="true">
                    <r.Icon size={20} strokeWidth={1.7} />
                  </span>
                  <strong>{r.t}</strong>
                  <span>{r.d}</span>
                </li>
              ))}
            </ul>
          )}

          {/* --- how it works: the five-stop timeline --------------------- */}
          {active === 2 && (
            <div className="fv-steps">
              {/* The rule is a sibling of the list, not a child of it: only
                  <li> may sit directly inside an <ol>. */}
              <span className="fv-steps__line" data-panel-rule aria-hidden="true" />
              <ol className="fv-steps__list">
                {STEPS.map((st) => (
                  <li key={st.t} data-panel-item>
                    <span className="fv-steps__dot" aria-hidden="true">
                      <st.Icon size={20} strokeWidth={1.8} />
                    </span>
                    <strong>{st.t}</strong>
                    <span>{st.d}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {active === 3 && <FaqList />}
        </div>
      </div>
    </section>
  );
}

/* ===========================================================================
   APPLY — the three-step eligibility form

   The prototype's questions, options, validation messages and qualified /
   nurture routing, carried over exactly. What is new is the plumbing: the
   option chips are real radios behind their labels, errors are announced and
   point at the field that caused them, and each step move puts focus on the
   new step's heading so a keyboard or screen-reader visitor is not left at the
   top of the page wondering what happened.
   =========================================================================== */

const OPTS = {
  space: { q: 'At least 600 sq ft?', o: [['have', 'Have it'], ['can', 'Can arrange'], ['no', 'Not yet']] },
  floor: { q: 'Which floor?', o: [['ground', 'Ground'], ['first', 'First'], ['other', 'Other']] },
  exp: { q: 'Experience in travel?', o: [['agency', 'I run one'], ['worked', "I've worked in it"], ['other', 'Other business'], ['first', 'My first']] },
  involve: { q: 'Running it day to day?', o: [['yes', 'Personally'], ['manager', 'Via a manager'], ['unsure', 'Undecided']] },
  when: { q: 'When would you open?', o: [['3', '3 months'], ['6', '3–6 months'], ['12', '6–12 months'], ['exploring', 'Exploring']] },
};

function OptionGroup({ name, value, onPick, invalid }) {
  const { q, o } = OPTS[name];
  const refs = useRef([]);
  const labelId = `fv-optlabel-${name}`;

  /* Buttons rather than a <label> wrapped round a hidden <input>. The input
     version rendered badly here — the chips came out sized to their own text
     with the words spilling out of the box — and the fix is not worth chasing
     when a roving-tabindex radiogroup is both simpler and what every other
     chip on this site already is. Arrow keys move AND select, which is the
     behaviour a native radio group has. */
  const onKey = (e) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (step === undefined) return;
    e.preventDefault();
    const at = Math.max(0, o.findIndex(([v]) => v === value));
    const next = (at + step + o.length) % o.length;
    onPick(name, o[next][0]);
    refs.current[next]?.focus();
  };

  return (
    <div className="fv-q">
      <p className="fv-q__label" id={labelId}>{q}</p>
      <div
        className="fv-opts"
        role="radiogroup"
        aria-labelledby={labelId}
        aria-invalid={invalid || undefined}
        onKeyDown={onKey}
      >
        {o.map(([v, label], i) => {
          const sel = value === v;
          return (
            <button
              type="button"
              key={v}
              role="radio"
              aria-checked={sel}
              tabIndex={sel || (!value && i === 0) ? 0 : -1}
              ref={(el) => { refs.current[i] = el; }}
              className={`fv-opt${sel ? ' is-sel' : ''}`}
              onClick={() => onPick(name, v)}
            >
              <Check className="fv-opt__tick" size={14} strokeWidth={2.4} aria-hidden="true" />
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* A short burst on submit. Canvas rather than 170 DOM nodes, cleared and torn
   down the moment it settles, and never started under reduced motion. */
function celebrate(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.style.display = 'block';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  /* Voyager Blue, Sienna Flame and their tints — the confetti is the one
     moment the page throws the palette in the air, so it uses only the
     palette. */
  const cols = ['#BD4011', '#0B5AB1', '#D78C70', '#F1EFE2', '#6D9CD0'];
  const bits = [];
  for (let i = 0; i < 170; i += 1) {
    bits.push({
      x: window.innerWidth * (0.2 + Math.random() * 0.6),
      y: window.innerHeight * 0.45 + Math.random() * 40,
      vx: (Math.random() - 0.5) * 13,
      vy: -(7 + Math.random() * 13),
      w: 5 + Math.random() * 7,
      h: 4 + Math.random() * 6,
      c: cols[(Math.random() * cols.length) | 0],
      r: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.34,
      life: 0,
    });
  }
  let t = 0;
  const frame = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    bits.forEach((p) => {
      p.vy += 0.34; p.x += p.vx; p.y += p.vy; p.vx *= 0.995; p.r += p.vr; p.life += 1;
      if (p.y < canvas.height + 40) alive = true;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      ctx.globalAlpha = Math.max(0, 1 - p.life / 135);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    t += 1;
    if (alive && t < 190) requestAnimationFrame(frame);
    else { ctx.clearRect(0, 0, canvas.width, canvas.height); canvas.style.display = 'none'; }
  };
  requestAnimationFrame(frame);
}

function ApplyForm() {
  const reduce = usePrefersReducedMotion();
  const [step, setStep] = useState(0);
  const [f, setF] = useState({ city: '', state: '', name: '', phone: '', email: '' });
  const [a, setA] = useState({});
  const [err, setErr] = useState({ msg: '', field: '' });
  const [result, setResult] = useState(null);

  const headRef = useRef(null);
  const canvasRef = useRef(null);
  const paneRef = useRef(null);
  const prevStep = useRef(step);

  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));
  const pick = (k, v) => { setA((s) => ({ ...s, [k]: v })); setErr({ msg: '', field: '' }); };

  /* Moving between steps: focus the new heading, and slide the pane in.
     Gated on the step ACTUALLY having changed rather than on a "have I run
     before" flag — StrictMode double-invokes effects in development, which
     would burn such a flag on mount and then pull focus down to a form nobody
     has touched. */
  useLayoutEffect(() => {
    if (prevStep.current === step) return;
    prevStep.current = step;
    headRef.current?.focus();
    if (reduce || !paneRef.current) return;
    gsap.fromTo(paneRef.current, { x: 22, opacity: 0 }, { x: 0, opacity: 1, duration: 0.42, ease: 'power2.out' });
  }, [step, reduce]);

  const validate = (i) => {
    if (i === 0) {
      if (!f.city.trim()) return { msg: 'Please tell us the city.', field: 'city' };
      if (!a.space) return { msg: 'Please answer the question about space.', field: 'space' };
      if (!a.floor) return { msg: 'Please tell us which floor.', field: 'floor' };
    }
    if (i === 1) {
      if (!a.exp || !a.involve || !a.when) return { msg: 'Please answer all three.', field: !a.exp ? 'exp' : !a.involve ? 'involve' : 'when' };
    }
    if (i === 2) {
      if (!f.name.trim()) return { msg: 'Please enter your name.', field: 'name' };
      if (f.phone.replace(/\D/g, '').length < 10) return { msg: 'Please enter a valid 10-digit mobile number.', field: 'phone' };
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email.trim())) return { msg: 'Please enter a valid email address.', field: 'email' };
    }
    return null;
  };

  const next = () => {
    const bad = validate(step);
    if (bad) { setErr(bad); return; }
    setErr({ msg: '', field: '' });
    setStep(step + 1);
  };

  const back = () => { setErr({ msg: '', field: '' }); setStep(step - 1); };

  const submit = (e) => {
    e.preventDefault();
    const bad = validate(2);
    if (bad) { setErr(bad); return; }

    /* "Clears" is the prototype's rule, unchanged: a location that exists, on
       a floor we can trade from, with a date attached. Everything else is a
       real lead too — it just goes to the nurture list rather than the call
       list, and the applicant is told so honestly rather than rejected. */
    const clears = a.space !== 'no' && a.floor !== 'other' && a.when !== 'exploring';
    const reference = `CK-${Date.now().toString(36).toUpperCase().slice(-6)}`;
    const payload = {
      city: f.city.trim(),
      state: f.state.trim(),
      name: f.name.trim(),
      phone: f.phone.trim(),
      email: f.email.trim(),
      answers: a,
      submittedAt: new Date().toISOString(),
      track: clears ? 'qualified' : 'nurture',
      reference,
    };

    if (FORM_ENDPOINT) {
      fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch((e2) => console.error(e2));
    } else {
      console.log('Application (no endpoint configured):', payload);
    }

    const first = (payload.name.split(' ')[0] || '').trim();
    setResult({
      reference,
      title: `Congratulations${first ? `, ${first}` : ''}!`,
      body: clears
        ? 'Your application is in, and it looks like a strong fit. Our franchise team will call you shortly to talk through your location.'
        : 'Your application is in. Not everything is in place yet, which is completely normal — our team will call you to talk through what comes next.',
    });
    setErr({ msg: '', field: '' });
    setStep(3);
    if (!reduce) setTimeout(() => celebrate(canvasRef.current), 180);
  };

  /* The success state's own entrance — the ring, the tick, then the words. */
  const doneRef = useRef(null);
  useLayoutEffect(() => {
    if (step !== 3 || reduce || !doneRef.current) return undefined;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.fromTo('.fv-burst__core', { scale: 0 }, { scale: 1, duration: 0.6, ease: 'back.out(1.9)' }, 0)
        .fromTo('.fv-burst__ring', { scale: 0.25, opacity: 0.9 }, { scale: 1, opacity: 0, duration: 1, ease: 'power2.out', stagger: 0.16 }, 0)
        .fromTo('[data-done]', { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: 'power2.out', stagger: 0.14 }, 0.4);
    }, doneRef);
    return () => ctx.revert();
  }, [step, reduce]);

  const invalid = (k) => (err.field === k ? true : undefined);
  const errId = err.msg ? `fv-err-${step}` : undefined;

  return (
    <>
      <canvas className="fv-confetti" ref={canvasRef} aria-hidden="true" />

      <form className="fv-card" id="fv-apply-form" onSubmit={submit} noValidate>
        <div className="fv-prog">
          <i style={{ width: `${((step + 1) / 4) * 100}%` }} />
          <span className="fv-sr" role="status">
            {step < 3 ? `Step ${step + 1} of 3` : 'Application received'}
          </span>
        </div>

        {step === 0 && (
          <div className="fv-pane" ref={paneRef}>
            <p className="fv-step-no">Step 1 of 3 · Location</p>
            <h3 className="fv-pane__h" tabIndex={-1} ref={headRef}>Where would the store be?</h3>

            <div className="fv-row2">
              <div className="fv-q">
                <label htmlFor="fv-city">City</label>
                <input id="fv-city" type="text" placeholder="e.g. Rohtak" autoComplete="address-level2" value={f.city} onChange={set('city')} aria-invalid={invalid('city')} aria-describedby={errId} />
              </div>
              <div className="fv-q">
                <label htmlFor="fv-state">State</label>
                <input id="fv-state" type="text" placeholder="e.g. Haryana" autoComplete="address-level1" value={f.state} onChange={set('state')} />
              </div>
            </div>

            <OptionGroup name="space" value={a.space} onPick={pick} invalid={invalid('space')} />
            <OptionGroup name="floor" value={a.floor} onPick={pick} invalid={invalid('floor')} />

            {err.msg && <p className="fv-err" id={errId} role="alert">{err.msg}</p>}
            <div className="fv-navb">
              <span />
              <button type="button" className="fv-btn fv-btn--primary" onClick={next}>
                Continue <ArrowRight size={15} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="fv-pane" ref={paneRef}>
            <p className="fv-step-no">Step 2 of 3 · About you</p>
            <h3 className="fv-pane__h" tabIndex={-1} ref={headRef}>A little background</h3>

            <OptionGroup name="exp" value={a.exp} onPick={pick} invalid={invalid('exp')} />
            <OptionGroup name="involve" value={a.involve} onPick={pick} invalid={invalid('involve')} />
            <OptionGroup name="when" value={a.when} onPick={pick} invalid={invalid('when')} />

            {err.msg && <p className="fv-err" id={errId} role="alert">{err.msg}</p>}
            <div className="fv-navb">
              <button type="button" className="fv-link" onClick={back}>
                <ArrowLeft size={14} aria-hidden="true" /> Back
              </button>
              <button type="button" className="fv-btn fv-btn--primary" onClick={next}>
                Continue <ArrowRight size={15} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="fv-pane" ref={paneRef}>
            <p className="fv-step-no">Step 3 of 3 · Your details</p>
            <h3 className="fv-pane__h" tabIndex={-1} ref={headRef}>How do we reach you?</h3>

            <div className="fv-q">
              <label htmlFor="fv-name">Full name</label>
              <input id="fv-name" type="text" placeholder="Your name" autoComplete="name" value={f.name} onChange={set('name')} aria-invalid={invalid('name')} aria-describedby={errId} />
            </div>
            <div className="fv-row2">
              <div className="fv-q">
                <label htmlFor="fv-phone">Mobile</label>
                <input id="fv-phone" type="tel" inputMode="numeric" placeholder="10 digits" autoComplete="tel" value={f.phone} onChange={set('phone')} aria-invalid={invalid('phone')} aria-describedby={errId} />
              </div>
              <div className="fv-q">
                <label htmlFor="fv-email">Email</label>
                <input id="fv-email" type="email" placeholder="you@example.com" autoComplete="email" value={f.email} onChange={set('email')} aria-invalid={invalid('email')} aria-describedby={errId} />
              </div>
            </div>

            {err.msg && <p className="fv-err" id={errId} role="alert">{err.msg}</p>}
            <div className="fv-navb">
              <button type="button" className="fv-link" onClick={back}>
                <ArrowLeft size={14} aria-hidden="true" /> Back
              </button>
              <button type="submit" className="fv-btn fv-btn--primary">
                Submit <ArrowRight size={15} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && result && (
          <div className="fv-done" ref={doneRef}>
            <div className="fv-burst" aria-hidden="true">
              <span className="fv-burst__ring" />
              <span className="fv-burst__ring" />
              <span className="fv-burst__core"><Check size={30} strokeWidth={2.6} /></span>
            </div>
            <h3 className="fv-done__h" tabIndex={-1} ref={headRef} data-done>{result.title}</h3>
            <p data-done>{result.body}</p>
            <p className="fv-done__ref" data-done>
              Reference <b>{result.reference}</b>
            </p>
          </div>
        )}
      </form>
    </>
  );
}

/* ===========================================================================
   TERMS

   The prototype's twelve plain-words terms, verbatim — but presented the way
   the tour-detail page presents its policies rather than as twelve equal
   cards in one undifferentiated wall. Nobody reads a wall of twelve. Grouped
   into three, with a count on each group, a reader can go straight to the one
   they came for: what they are signing, how the store must run, or what they
   are agreeing not to do.
   =========================================================================== */

const TERM_GROUPS = [
  {
    id: 'agreement',
    label: 'The agreement',
    Icon: FileText,
    terms: [
      { t: 'Grant & territory', Icon: MapPin, b: 'The franchisee is granted a non-exclusive right to operate a Cox & Kings retail travel store at the approved location, under the brand name and marks, for the term of the agreement. Any territory understanding applies only to the specific approved location.' },
      { t: 'Term & renewal', Icon: Calendar, b: 'The franchise runs for a fixed initial term from the date of signing. Renewal is by mutual agreement, subject to the franchisee being in good standing and to the terms applicable at the time of renewal.' },
      { t: 'Fees & payments', Icon: Wallet, b: 'Applicable franchise fees, a refundable security deposit and the commercial terms are set out in the agreement and shared following review of the application. All payments are made as scheduled in the agreement.' },
      { t: 'Termination', Icon: CircleX, b: 'Either party may end the agreement in the circumstances set out in it, including for material breach that is not remedied within the notice period. On termination, use of the brand name and marks stops and the store is de-branded.' },
    ],
  },
  {
    id: 'store',
    label: 'Running the store',
    Icon: Store,
    terms: [
      { t: 'Brand standards', Icon: BadgeCheck, b: 'The store, its interiors, signage, staff conduct and customer service must follow Cox & Kings brand guidelines and operating standards at all times. The brand name and logo are used strictly in line with the agreement and may not be altered.' },
      { t: 'Premises & setup', Icon: Building2, b: 'The franchisee arranges suitable premises meeting the minimum specifications, and completes fit-out and branding to approved standards before opening. Any change of location requires prior written approval.' },
      { t: 'Products & pricing', Icon: Tag, b: 'The store sells the holiday packages and travel services made available by Cox & Kings. Products are sold on the terms and at the prices notified from time to time; the franchisee does not create competing products under the brand.' },
      { t: 'Training & support', Icon: GraduationCap, b: 'Cox & Kings provides onboarding, product and sales training, systems access and ongoing support. The franchisee ensures staff complete required training and follow the systems and processes provided.' },
    ],
  },
  {
    id: 'obligations',
    label: 'Your obligations',
    Icon: ShieldCheck,
    terms: [
      { t: 'Confidentiality', Icon: Lock, b: 'Business information, pricing, systems, customer data and know-how shared during the partnership are confidential and used only to operate the store. Confidentiality obligations continue after the agreement ends.' },
      { t: 'Non-compete', Icon: Ban, b: 'During the term, the franchisee does not operate or hold an interest in a competing travel business under any other brand at the approved location, except as permitted in writing by Cox & Kings.' },
      { t: 'Compliance & conduct', Icon: Scale, b: 'The franchisee holds all licences and registrations required by law, operates the store lawfully, and does not act in any way that harms the reputation or goodwill of the Cox & Kings brand.' },
      { t: 'Governing law & disputes', Icon: Gavel, b: 'The agreement is governed by the laws of India. Disputes are first addressed through good-faith discussion, and thereafter as provided in the agreement, before the courts of the agreed jurisdiction.' },
    ],
  },
];

function Terms() {
  const reduce = usePrefersReducedMotion();
  const [group, setGroup] = useState('agreement');
  const refs = useRef([]);
  const panelRef = useRef(null);
  const current = TERM_GROUPS.find((g) => g.id === group);

  /* The cards are swapped by the segmented control, not scrolled to, so they
     come in on every group change — a scroll-triggered reveal would fire for
     the first group and leave the other two appearing with no transition. */
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (reduce) return;
      gsap.fromTo('li', { y: 18, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', stagger: 0.06,
      });
    }, panelRef);
    return () => ctx.revert();
  }, [group, reduce]);

  const onKey = (e) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (step === undefined) return;
    e.preventDefault();
    const at = TERM_GROUPS.findIndex((g) => g.id === group);
    const next = (at + step + TERM_GROUPS.length) % TERM_GROUPS.length;
    setGroup(TERM_GROUPS[next].id);
    requestAnimationFrame(() => refs.current[next]?.focus());
  };

  return (
    <section className="fv-terms" id="fv-terms" aria-labelledby="fv-terms-h">
      <div className="fv-wrap">
        <div className="fv-sechead" data-reveal>
          <p className="fv-eyebrow">// THE FINE PRINT, IN PLAIN WORDS</p>
          <h2 className="fv-h2" id="fv-terms-h">
            Franchise terms <strong>&amp; conditions</strong>
          </h2>
          <p className="fv-lead">
            A summary of the general terms on which the partnership operates. The full,
            binding terms are set out in the franchise agreement, which is shared with you
            before anything is signed.
          </p>
        </div>

        <div className="fv-segbar" role="tablist" aria-label="Terms by group" onKeyDown={onKey} data-reveal>
          {TERM_GROUPS.map((g, i) => (
            <button
              type="button"
              key={g.id}
              role="tab"
              id={`fv-term-tab-${g.id}`}
              aria-selected={g.id === group}
              aria-controls="fv-term-panel"
              tabIndex={g.id === group ? 0 : -1}
              ref={(el) => { refs.current[i] = el; }}
              className={`fv-seg${g.id === group ? ' is-on' : ''}`}
              onClick={() => setGroup(g.id)}
            >
              <g.Icon size={17} strokeWidth={1.9} aria-hidden="true" />
              <span>{g.label}</span>
              <small>{g.terms.length}</small>
            </button>
          ))}
        </div>

        <ul
          className="fv-cards fv-cards--two"
          id="fv-term-panel"
          role="tabpanel"
          aria-labelledby={`fv-term-tab-${group}`}
          key={group}
          ref={panelRef}
        >
          {current.terms.map((t) => (
            <li key={t.t}>
              <span className="fv-ictile" aria-hidden="true">
                <t.Icon size={20} strokeWidth={1.7} />
              </span>
              <div>
                <strong>{t.t}</strong>
                <p>{t.b}</p>
              </div>
            </li>
          ))}
        </ul>

        <p className="fv-terms__foot">
          This summary is provided for general information and does not form part of any
          contract. It is not an offer, and no representation is made as to revenue, profit
          or return. The franchise agreement is the sole binding document and prevails in
          the event of any inconsistency.
        </p>
      </div>
    </section>
  );
}

/* ===========================================================================
   THE PAGE
   =========================================================================== */

/* ---------------------------------------------------------------------------
   THE NAV — logo and one CTA, local to this page (the shared SiteNav is
   untouched). A prospective franchisee has one job here, so the header offers
   one way forward instead of the whole travel catalogue. It keeps SiteNav's
   classes and scroll behaviour, so it looks and moves the same, and it still
   answers to `.h26-nav` for the --fv-navh measurement below.
   --------------------------------------------------------------------------- */
function FvNav({ onApply, solidAt = 90 }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > solidAt);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [solidAt]);

  return (
    <>
      <a className="h26-skip" href="#fv-apply">Skip to the franchise application</a>
      <header className={`h26-nav fv-nav${scrolled ? ' is-solid' : ''}`}>
        <Link to="/" className="h26-brand" aria-label="Cox & Kings — home">
          <img src="/cox-logo-new.png" alt="Cox & Kings" />
        </Link>
        <button type="button" className="h26-btn h26-btn-pill fv-nav__cta" onClick={onApply}>
          Check if you qualify
        </button>
      </header>
    </>
  );
}

export default function FranchiseV2() {
  const root = useRef(null);

  /* The sticky sub-nav has to sit exactly under the fixed site header, so the
     header's real height is measured and published as --fv-navh rather than
     guessed.

     THE HEADER CHANGES HEIGHT BY CHANGING PADDING. `.h26-nav` is 22px top and
     bottom until it goes solid, then 12px — a 20px drop, eased over .4s. Two
     consequences, and the first pass got both wrong:

       · ResizeObserver watches the CONTENT box by default, and padding is not
         part of it. The observer therefore never fired on the solid swap, the
         variable kept its un-scrolled value, and the bar sat parked 20px below
         the header with the page showing through the gap. It observes the
         BORDER box now, which is the box that actually moved.
       · The change is a transition, not a jump, so a single measurement at
         either end is wrong for 400ms. Scroll and transitionend both re-read
         it, coalesced through one rAF so a fast scroll cannot queue a hundred
         style writes. */
  useEffect(() => {
    const nav = document.querySelector('.h26-nav');
    const el = root.current;
    if (!nav || !el) return undefined;

    let raf = 0;
    const apply = () => {
      raf = 0;
      el.style.setProperty('--fv-navh', `${Math.round(nav.getBoundingClientRect().height)}px`);
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(apply); };

    apply();
    const ro = new ResizeObserver(schedule);
    ro.observe(nav, { box: 'border-box' });
    window.addEventListener('resize', schedule);
    window.addEventListener('scroll', schedule, { passive: true });
    nav.addEventListener('transitionend', schedule);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', schedule);
      window.removeEventListener('scroll', schedule);
      nav.removeEventListener('transitionend', schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  /* Every "Check if you qualify" on the page lands in the same place: the
     apply section, with the first field focused once the scroll has settled.
     preventScroll, because focusing mid-flight would snap the page. */
  const goToForm = useCallback(() => {
    document.getElementById('fv-apply')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => document.getElementById('fv-city')?.focus({ preventScroll: true }), 620);
  }, []);

  /* --- page-wide scroll motion ---------------------------------------------
     Three primitives, applied by data attribute rather than by class, so the
     markup above says what moves and this says how. All fromTo: the resting
     state in the DOM is the finished state, so nothing is invisible if GSAP
     never runs. */
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray('[data-reveal]').forEach((el) => {
          gsap.fromTo(el, { y: 34, opacity: 0 }, {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 86%', once: true },
          });
        });

        /* Hairlines draw rather than fade — it is the one motion on the page
           that reads as "ruled", which is the register the type is in. */
        gsap.utils.toArray('[data-rule]').forEach((el) => {
          gsap.fromTo(el, { scaleX: 0 }, {
            scaleX: 1,
            duration: 1.1,
            ease: 'power2.inOut',
            transformOrigin: 'left center',
            scrollTrigger: { trigger: el, start: 'top 92%', once: true },
          });
        });

        return () => {};
      });

      /* Late-loading webfonts re-flow the display type, which moves every
         trigger under it. */
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener('load', refresh);
      const t = setTimeout(refresh, 900);
      return () => { window.removeEventListener('load', refresh); clearTimeout(t); };
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div className="h26 new-typo n3 fv" ref={root}>
      <FvNav onApply={goToForm} />

      <Hero onApply={goToForm} />

      <main id="fv-main">
        <Offer />

        {/* ===================================================== APPLY ==== */}
        <section className="fv-apply" id="fv-apply" aria-labelledby="fv-apply-h">
          <div className="fv-wrap fv-apply__grid">
            <div className="fv-apply__copy">
              <div className="fv-sechead" data-reveal>
                <p className="fv-eyebrow">// APPLY</p>
                <h2 className="fv-h2" id="fv-apply-h">
                  Check if you <strong>qualify</strong>
                </h2>
                <p className="fv-lead">
                  Six quick questions, then your details. If something is not in place yet,
                  apply anyway — we will tell you what would need to change.
                </p>
              </div>
              <p className="fv-apply__reassure" data-reveal>
                We call before we send anything. No obligation at any stage.
              </p>

              <div className="fv-contact" data-reveal>
                <p className="fv-contact__h">Or reach the franchise desk directly</p>
                <a href={`mailto:${EMAIL}`}>
                  <Mail size={16} strokeWidth={1.7} aria-hidden="true" />
                  {EMAIL}
                </a>
                <a href={PHONE_HREF}>
                  <Phone size={16} strokeWidth={1.7} aria-hidden="true" />
                  {PHONE_DISPLAY}
                </a>
              </div>
            </div>

            <div className="fv-apply__form" data-reveal>
              <ApplyForm />
            </div>
          </div>
        </section>

        <Terms />

        {/* The prototype's footer paragraph. It is a legal note about who
            operates the programme, not navigation, so it sits as its own quiet
            band above the house footer rather than being folded into it. */}
        <section className="fv-legal" aria-label="Legal note">
          <div className="fv-wrap">
            <span className="fv-rule" data-rule aria-hidden="true" />
            <p>
              Operated in India by Wilson &amp; Hughes India Private Limited. This page describes
              the franchise partnership in general terms and is for information only. It is not
              an offer, and no representation is made as to revenue, profit or return. Commercial
              terms are shared following review of your application and are set out in the
              partnership agreement.
            </p>
          </div>
        </section>
      </main>

      {/* The marketing-page footer, the same one /festive-getaway-v4 carries
          (the shared SiteFooter is untouched): the brand, a way to get help
          and the legal line, in one row and a rule. */}
      <footer className="fv-foot">
        <div className="fv-foot__row">
          <img className="fv-foot__logo" src="/cox-logo-new.png" alt="Cox & Kings" />
          <nav className="fv-foot__help" aria-label="Help and support">
            <span className="fv-foot__label">Help &amp; support</span>
            <SmartLink to={CALLBACK}>Contact us</SmartLink>
            <SmartLink to="/faq2">FAQs</SmartLink>
            <SmartLink to="/terms#refund-policy">Refund policy</SmartLink>
            <SmartLink to="/terms">Terms &amp; Conditions</SmartLink>
          </nav>
          <div className="fv-foot__contact">
            <a href={CONTACT_CK.phoneHref}><PhoneCall size={14} aria-hidden="true" /> {CONTACT_CK.phoneDisplay}</a>
            <a href={`mailto:${CONTACT_CK.email}`}>{CONTACT_CK.email}</a>
          </div>
        </div>
        <div className="fv-foot__legal">
          <span>© {new Date().getFullYear()} Cox &amp; Kings. Travelling the world since 1758.</span>
          <span>IATA · TAAI · ASTA</span>
        </div>
      </footer>
    </div>
  );
}
