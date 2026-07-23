/* ============================================================
   Adventure — the dedicated collection page reached from the
   New3 homepage "What's your vibe?" carousel (the Adventure
   theme deep-links here instead of /journeys4?pace=Active).

   Route: /adventure

   Design language follows design.md — Voyager Blue primary /
   Sienna Flame accent on the warm paper scale, Cormorant Garamond
   Light headings, Work Sans UI, 4px-radius uppercase buttons —
   and the browse experience is deliberately the /journeys4 one:
   the SAME JourneyCard, and a left filter sidebar built from the
   same jl2-/j2- filter chrome. The cinematic top of the page
   (hero, manifesto, pinned "kinds of adventure" rail, feature
   expedition, stats, assurance, CTA) is GSAP + ScrollTrigger,
   all gated behind gsap.matchMedia so it degrades cleanly.
   ============================================================ */
import { useRef, useState, useMemo, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  ArrowRight, ArrowUpRight, ArrowDown, Star, MapPin, Clock, Calendar, Gauge,
  ChevronLeft, ChevronRight, ChevronDown, Check, SlidersHorizontal, X, Compass, Mountain,
  ShieldCheck, Users, User, Sparkles, Phone, MessageCircle, Globe2, Search,
  Wallet, CalendarRange, Minus, Plus,
} from 'lucide-react';
import { useScheduleCall } from '../components/ScheduleCall';
import { SmartLink as Link } from '../components/ScheduleCall';
import { SiteNav, SiteFooter } from '../components/SiteChrome';
import { img } from '../data/v3content';
import './Home2026.css';
import './Home2026Improved.css';
import './Luxe2Improved.css';
import './Journeys.css';    // the .jl-card styles
import './Journeys2.css';   // the two-column shell + left filter sidebar
import './Journeys4.css';   // the /journeys4 card badges + heading ramp
import './NewTypography.css';
import './Adventure.css';

gsap.registerPlugin(ScrollTrigger);

const U = (id) => `https://images.unsplash.com/photo-${id}`;
const sizedUnsplash = (id, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const CONTACT = {
  phoneDisplay: '+91 8556001700',
  phoneHref: 'tel:+918556001700',
  whatsappHref: 'https://wa.me/918556001700',
};

/* ---------- Kinds of adventure (the horizontal rail + a filter facet) --- */
const KINDS = [
  { key: 'Trek & Summit', line: 'High passes, long climbs and the summit you earn on foot.', id: '1527668752968-14dc70a27c95' },
  { key: 'Safari & Wild', line: 'Dawn game drives, great herds and gorillas in the mist.', id: '1547471080-7cc2caa01a7e' },
  { key: 'Polar & Ice', line: 'Aurora nights, drifting pack ice and the ends of the earth.', id: '1483347756197-71ef80e95f73' },
  { key: 'Desert & Dunes', line: 'Star camps, silent dunes and canyons cut over aeons.', id: '1501594907352-04cda38ebc29' },
  { key: 'Water & Rapids', line: 'White-water mornings and rivers that run through gorges.', id: '1530122037265-a5f1f91d3b99' },
  { key: 'Cycle & Road', line: 'Open mountain roads, saddle days and horizons that keep moving.', id: '1469521669194-babb45599def' },
  { key: 'Dive & Coast', line: 'Reef walls, wild coastlines and the world below the surface.', id: '1506973035872-a4ec16b8e8d9' },
];
const KIND_KEYS = KINDS.map((k) => k.key);

/* Per-kind photo pools so each card has a browsable inline gallery,
   exactly like the /journeys4 cards. */
const KIND_PHOTOS = {
  'Trek & Summit': ['1527668752968-14dc70a27c95', '1469521669194-babb45599def', '1467269204594-9661b134dd2b'],
  'Safari & Wild': ['1547471080-7cc2caa01a7e', '1516426122078-c23e76319801'],
  'Polar & Ice': ['1483347756197-71ef80e95f73', '1467269204594-9661b134dd2b'],
  'Desert & Dunes': ['1501594907352-04cda38ebc29', '1477587458883-47145ed94245'],
  'Water & Rapids': ['1530122037265-a5f1f91d3b99', '1467269204594-9661b134dd2b'],
  'Cycle & Road': ['1469521669194-babb45599def', '1503614472-8c93d56e92ce', '1467269204594-9661b134dd2b'],
  'Dive & Coast': ['1506973035872-a4ec16b8e8d9', '1514282401047-d79a71a590e8'],
};

const REGIONS = ['Asia', 'Africa', 'Europe', 'South America', 'North America', 'Oceania', 'Middle East', 'Polar'];
const GRADES = ['Moderate', 'Challenging', 'Expedition'];
const GROUP_KINDS = ['Trek & Summit', 'Safari & Wild', 'Polar & Ice', 'Water & Rapids'];

/* Build a JourneyCard-shaped object from the compact adventure record.
   `regions[0]` (the country) drives the on-card location chip; `regions[1]`
   (the continent) drives the Region filter. */
const A = (o) => ({
  ...o,
  regions: [o.country, o.region],
  tourType: GROUP_KINDS.includes(o.kind) ? 'Group Tour' : 'Private Tour',
  group: o.group,
  pace: o.grade === 'Moderate' ? 'Balanced' : 'Active',
  nights: o.days,
  nightsLabel: `${o.days} days`,
  priceLabel: `₹${o.price.toLocaleString('en-IN')}`,
  gallery: [...new Set([U(o.image), ...KIND_PHOTOS[o.kind].map(U)])].slice(0, 4),
  blurb: o.note,
  /* Each tour opens its own detail page. Only two detail templates exist today
     (Japan / Thailand), mapped explicitly below; every other route falls
     through to the 404, which carries dev links to those two templates. */
  to: o.to || `/tour-detail-adventure-${o.id}`,
});

const ADVENTURES = [
  A({ id: 'ebc', title: 'Everest Base Camp Trek', country: 'Nepal', region: 'Asia', kind: 'Trek & Summit', grade: 'Expedition', days: 16, price: 245000, rating: 4.9, season: 'Mar–May · Oct–Nov', image: '1527668752968-14dc70a27c95', group: 'Small group · max 12', note: 'Sherpa country, high suspension bridges and Kala Patthar at first light.' }),
  A({ id: 'inca', title: 'Inca Trail to Machu Picchu', country: 'Peru', region: 'South America', kind: 'Trek & Summit', grade: 'Challenging', days: 11, price: 310000, rating: 4.9, season: 'May–Sep', image: '1469521669194-babb45599def', group: 'Small group · max 12', note: 'Four days on the old stone road, arriving through the Sun Gate at dawn.' }),
  A({ id: 'patagonia', title: 'Patagonia: Torres del Paine', country: 'Chile', region: 'South America', kind: 'Trek & Summit', grade: 'Challenging', days: 12, price: 380000, rating: 4.9, season: 'Nov–Mar', image: '1467269204594-9661b134dd2b', group: 'Small group · max 12', note: 'The W circuit past granite towers, hanging glaciers and turquoise lakes.' }),
  A({ id: 'kili', title: 'Kilimanjaro Summit', country: 'Tanzania', region: 'Africa', kind: 'Trek & Summit', grade: 'Expedition', days: 9, price: 295000, rating: 4.8, season: 'Jan–Mar · Jun–Oct', image: '1516426122078-c23e76319801', group: 'Small group · max 12', note: "Africa's rooftop by the scenic Lemosho route, camps moved for your dates." }),
  A({ id: 'bhutan', title: 'Bhutan: Druk Path Trek', country: 'Bhutan', region: 'Asia', kind: 'Trek & Summit', grade: 'Challenging', days: 10, price: 185000, rating: 4.8, season: 'Mar–May · Sep–Nov', image: '1599661046289-e31897846e41', group: 'Small group · max 10', note: 'High blue-lake ridgelines linking Paro and Thimphu, monasteries en route.' }),
  A({ id: 'ladakh', title: 'Ladakh High Passes', country: 'India', region: 'Asia', kind: 'Trek & Summit', grade: 'Challenging', days: 11, price: 165000, rating: 4.8, season: 'Jun–Sep', image: '1477587458883-47145ed94245', group: 'Small group · max 12', note: 'Moonscape valleys, 5,000-metre passes and monasteries above the Indus.' }),
  A({ id: 'nakasendo', title: 'Japan Alps & Nakasendo Trail', country: 'Japan', region: 'Asia', kind: 'Trek & Summit', grade: 'Moderate', days: 9, price: 310000, rating: 4.8, season: 'Apr–Jun · Oct–Nov', image: '1490806843957-31f4c9a91c65', group: 'Private & tailor-made', note: 'The old post road between Kyoto and Tokyo, on foot between ryokan nights.', to: '/tour-detail-japan-5' }),
  A({ id: 'srilanka', title: 'Sri Lanka Hill-Country Trek', country: 'Sri Lanka', region: 'Asia', kind: 'Trek & Summit', grade: 'Moderate', days: 8, price: 120000, rating: 4.7, season: 'Jan–Mar', image: '1546708973-b339540b5162', group: 'Private & tailor-made', note: 'Tea-estate ridges, Adam’s Peak at sunrise and a slow finish by the sea.', to: '/tour-detail-thailand-2' }),
  A({ id: 'migration', title: 'Great Migration Safari', country: 'Tanzania', region: 'Africa', kind: 'Safari & Wild', grade: 'Moderate', days: 8, price: 310000, rating: 4.9, season: 'Jul–Oct', image: '1547471080-7cc2caa01a7e', group: 'Small group · max 8', note: 'The herds crossing the Mara River, from mobile camps set on the plains.' }),
  A({ id: 'gorilla', title: 'Gorilla Trek', country: 'Rwanda', region: 'Africa', kind: 'Safari & Wild', grade: 'Challenging', days: 7, price: 420000, rating: 4.9, season: 'Jun–Sep', image: '1516426122078-c23e76319801', group: 'Small group · max 8', note: 'A morning tracking a habituated family through the Volcanoes rainforest.' }),
  A({ id: 'kruger', title: 'South Africa: Cape & Kruger', country: 'South Africa', region: 'Africa', kind: 'Safari & Wild', grade: 'Moderate', days: 11, price: 325000, rating: 4.7, season: 'Year-round', image: '1516426122078-c23e76319801', group: 'Small group · max 8', note: 'Big-five days in a private reserve, then Cape Town and the winelands.' }),
  A({ id: 'aurora', title: 'Chasing the Northern Lights', country: 'Iceland', region: 'Europe', kind: 'Polar & Ice', grade: 'Moderate', days: 7, price: 275000, rating: 4.7, season: 'Oct–Mar', image: '1483347756197-71ef80e95f73', group: 'Small group · max 14', note: 'Aurora hunts, ice caves and geothermal soaks under a winter sky.' }),
  A({ id: 'svalbard', title: 'Arctic Svalbard Expedition', country: 'Norway', region: 'Europe', kind: 'Polar & Ice', grade: 'Moderate', days: 8, price: 460000, rating: 4.8, season: 'Jun–Aug', image: '1467269204594-9661b134dd2b', group: 'Expedition ship', note: 'A small ship among the pack ice, walrus haul-outs and calving glaciers.' }),
  A({ id: 'antarctica', title: 'Antarctica Expedition Cruise', country: 'Antarctica', region: 'Polar', kind: 'Polar & Ice', grade: 'Moderate', days: 12, price: 850000, rating: 5.0, season: 'Nov–Feb', image: '1483347756197-71ef80e95f73', group: 'Expedition ship', note: 'The Drake, the Peninsula and zodiac landings among penguin colonies.' }),
  A({ id: 'sahara', title: 'Sahara Dunes & the Atlas', country: 'Morocco', region: 'Africa', kind: 'Desert & Dunes', grade: 'Moderate', days: 9, price: 155000, rating: 4.7, season: 'Oct–Apr', image: '1501594907352-04cda38ebc29', group: 'Private & tailor-made', note: 'A camel line into Erg Chebbi, a desert camp and the High Atlas passes.' }),
  A({ id: 'wadirum', title: 'Wadi Rum & Petra', country: 'Jordan', region: 'Middle East', kind: 'Desert & Dunes', grade: 'Moderate', days: 8, price: 195000, rating: 4.8, season: 'Mar–May · Sep–Nov', image: '1501594907352-04cda38ebc29', group: 'Private & tailor-made', note: 'Nights in the Valley of the Moon and Petra reached on foot at dawn.' }),
  A({ id: 'namibia', title: 'Namibia Dunes & Skeleton Coast', country: 'Namibia', region: 'Africa', kind: 'Desert & Dunes', grade: 'Moderate', days: 11, price: 325000, rating: 4.8, season: 'May–Oct', image: '1501594907352-04cda38ebc29', group: 'Private & tailor-made', note: 'Sossusvlei’s red dunes, desert-adapted wildlife and a wild Atlantic shore.' }),
  A({ id: 'zambezi', title: 'Zambezi White-Water & Falls', country: 'Zambia', region: 'Africa', kind: 'Water & Rapids', grade: 'Challenging', days: 7, price: 210000, rating: 4.7, season: 'Jul–Feb', image: '1530122037265-a5f1f91d3b99', group: 'Small group · max 10', note: 'Grade-five rapids below Victoria Falls and an evening on the river.' }),
  A({ id: 'grandcanyon', title: 'Grand Canyon Rafting', country: 'USA', region: 'North America', kind: 'Water & Rapids', grade: 'Challenging', days: 8, price: 280000, rating: 4.8, season: 'May–Sep', image: '1501594907352-04cda38ebc29', group: 'Small group · max 10', note: 'Days on the Colorado between mile-high walls, nights on the sandbars.' }),
  A({ id: 'nz-road', title: 'New Zealand by Road', country: 'New Zealand', region: 'Oceania', kind: 'Cycle & Road', grade: 'Challenging', days: 12, price: 320000, rating: 4.9, season: 'Oct–Apr', image: '1469521669194-babb45599def', group: 'Private & tailor-made', note: 'The South Island end to end — fjords, glaciers and open mountain roads.' }),
  A({ id: 'vietnam-bike', title: 'Vietnam by Bike', country: 'Vietnam', region: 'Asia', kind: 'Cycle & Road', grade: 'Moderate', days: 10, price: 145000, rating: 4.6, season: 'Oct–Apr', image: '1528181304800-259b08848526', group: 'Small group · max 12', note: 'Rice-terrace back roads, the Mekong delta and a finish on the coast.' }),
  A({ id: 'iceland-ring', title: 'Iceland Ring Road', country: 'Iceland', region: 'Europe', kind: 'Cycle & Road', grade: 'Moderate', days: 9, price: 260000, rating: 4.8, season: 'Jun–Sep', image: '1483347756197-71ef80e95f73', group: 'Private & tailor-made', note: 'Waterfalls, black beaches and glacier lagoons on the road around the island.' }),
  A({ id: 'rockies-rail', title: 'Canadian Rockies & Rail', country: 'Canada', region: 'North America', kind: 'Cycle & Road', grade: 'Moderate', days: 10, price: 295000, rating: 4.8, season: 'Jun–Sep', image: '1503614472-8c93d56e92ce', group: 'Small group · max 16', note: 'Banff, Lake Louise and the Rocky Mountaineer through the high passes.' }),
  A({ id: 'galapagos', title: 'Galápagos Diving & Wildlife', country: 'Ecuador', region: 'South America', kind: 'Dive & Coast', grade: 'Moderate', days: 9, price: 410000, rating: 4.9, season: 'Year-round', image: '1506973035872-a4ec16b8e8d9', group: 'Small group · max 12', note: 'Hammerheads and sea lions below, giant tortoises and boobies above.' }),
  A({ id: 'reef', title: 'Great Barrier Reef Dive', country: 'Australia', region: 'Oceania', kind: 'Dive & Coast', grade: 'Moderate', days: 10, price: 340000, rating: 4.7, season: 'Jun–Oct', image: '1506973035872-a4ec16b8e8d9', group: 'Small group · max 12', note: 'Liveaboard nights on the outer reef and the Daintree where it meets the sea.' }),
];

/* Destination search corpus — continents (regions) + every country, so the
   "Region" field behaves like the /journeys4 destination combobox. Selecting
   either narrows the grid (a journey matches its region OR its country). */
const DESTS = [
  ...REGIONS.map((r) => ({ value: r, label: r, type: 'region' })),
  ...[...new Set(ADVENTURES.map((a) => a.country))].sort().map((c) => ({ value: c, label: c, type: 'country' })),
];
const isRegionDest = (v) => REGIONS.includes(v);
const destMatch = (a, v) => a.region === v || a.country === v;

/* Duration = a single "up to N days" ceiling on the same slider + preset-pill
   bar the /journeys4 budget/length filters use. */
const DUR_MIN = 7;
const DUR_MAX = 16;
const DURATION_PRESETS = [
  { v: 8, label: 'Up to 8 days' },
  { v: 11, label: 'Up to 11 days' },
  { v: 14, label: 'Up to 14 days' },
];
const fmtDays = (n) => `${n} days`;

/* ---- Budget bounds, derived from the catalogue ---- */
const _prices = ADVENTURES.map((a) => a.price);
const PRICE_MIN = Math.floor(Math.min(..._prices) / 10000) * 10000;
const PRICE_MAX = Math.ceil(Math.max(..._prices) / 10000) * 10000;
const PRICE_STEP = 5000;
const fmtLakh = (v) => {
  const l = v / 100000;
  return `₹${(Number.isInteger(l) ? l : l.toFixed(1)).toString().replace(/\.0$/, '')}L`;
};
const BUDGET_PRESETS = [
  { label: '≤ ₹2L', v: 200000 },
  { label: '≤ ₹3.5L', v: 350000 },
  { label: '≤ ₹5L', v: 500000 },
].filter((p) => p.v > PRICE_MIN && p.v < PRICE_MAX);

/* ---- Travel-date filter: months, season matching, calendar constants ---- */
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_IDX = Object.fromEntries(MONTHS.map((m, i) => [m, i]));
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const FLEX_STEPS = [0, 2, 3, 4]; // days of ± flexibility

/* Does a journey's season string cover the chosen month? Permissive: an
   unparseable/multi-window season never wrongly excludes a trip. Handles single
   months, ranges ('Mar–May') and wrap-arounds ('Oct–Mar'); a season carrying
   two windows ('Jan–Mar · Jun–Oct') passes if EITHER window covers the month. */
function monthInSeason(month, season) {
  if (!month) return true;
  const s = (season || '').trim();
  if (/year-round|any/i.test(s)) return true;
  const mi = MONTH_IDX[month];
  if (mi == null) return true;
  const windows = s.split('·');
  return windows.some((win) => {
    const toks = win.trim().split('–').map((t) => t.trim().slice(0, 3));
    const start = MONTH_IDX[toks[0]];
    const end = MONTH_IDX[toks[toks.length - 1]];
    if (start == null || end == null) return false;
    return start <= end ? mi >= start && mi <= end : mi >= start || mi <= end;
  });
}

/* Which months does a chosen date (± flex days) touch? */
function dateWindowMonths(date, flex) {
  if (!date) return null;
  const base = new Date(date.y, date.m, date.d);
  const months = new Set();
  for (let off = -flex; off <= flex; off += 1) {
    const d = new Date(base);
    d.setDate(base.getDate() + off);
    months.add(MONTHS[d.getMonth()]);
  }
  return [...months];
}
const fmtDate = (date) => `${date.d} ${MONTHS[date.m]}`;

const STATS = [
  { value: 24, suffix: '', label: 'Signature adventures' },
  { value: 25, suffix: '', label: 'Countries' },
  { value: 6, suffix: '', label: 'Continents' },
  { value: 266, suffix: '', label: 'Years of expertise' },
];

const ASSURANCES = [
  { icon: ShieldCheck, title: 'Vetted, safety-first operators', body: 'Every expedition runs with certified mountain and expedition leaders, insured logistics and 24/7 support on the ground.' },
  { icon: Users, title: 'Small groups, real access', body: 'Capped group sizes and private departures — permits, porters and guides arranged so you reach places most itineraries never do.' },
  { icon: Gauge, title: 'Graded honestly', body: 'Each trip is graded Moderate, Challenging or Expedition, with the fitness and altitude it really asks of you — no surprises on day three.' },
  { icon: Compass, title: 'Since 1758, still guiding', body: 'One of the oldest names in travel, with specialists who have walked these routes and design each day around you.' },
];

/* WhatsApp glyph — matches the /journeys4 card CTA. */
const WaIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.5A10 10 0 1 0 12 2zm0 18.3c-1.5 0-2.98-.4-4.27-1.16l-.3-.18-3.17 1 1.02-3.09-.2-.32A8.3 8.3 0 1 1 12 20.3z" />
    <path d="M17.5 14.4c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35z" />
  </svg>
);

/* Reduced-motion-safe reveal (matches /journeys4). */
function Reveal({ children, className = '', delay = 0, y = 20, as = 'div' }) {
  const M = motion[as] || motion.div;
  const reduce = useReducedMotion();
  if (reduce) return <M className={className}>{children}</M>;
  return (
    <M
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(12px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </M>
  );
}

/* The /journeys4 journey card, reused verbatim (inline gallery carousel). */
function JourneyCard({ j, i, people = 1 }) {
  const waHref = `${CONTACT.whatsappHref}?text=${encodeURIComponent(`Hi Cox & Kings, I'd like to enquire about the "${j.title}" journey.`)}`;
  const isGroup = j.tourType === 'Group Tour';
  const shots = j.gallery;
  const many = shots.length > 1;
  const [shot, setShot] = useState(0);
  const step = (dir) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShot((s) => (s + dir + shots.length) % shots.length);
  };
  return (
    <Reveal className="jl-card" delay={(i % 3) * 0.05} y={24} as="article">
      <div className="jl-card-media">
        <Link to={j.to} className="jl-card-media-link jl4-media-link" aria-label={`${j.title} — view itinerary`}>
          <AnimatePresence initial={false}>
            <motion.img
              key={shot}
              src={img(shots[shot], 800)}
              alt={`${j.title}${many ? ` — photo ${shot + 1} of ${shots.length}` : ''}`}
              loading="lazy"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            />
          </AnimatePresence>
        </Link>
        <span className={`jl4-tourtype${isGroup ? ' is-group' : ' is-private'}`}>
          {isGroup ? <Users size={13} aria-hidden="true" /> : <User size={13} aria-hidden="true" />}
          {j.tourType}
        </span>
        <span className="jl-card-rating"><Star size={12} fill="currentColor" aria-hidden="true" /> {j.rating.toFixed(1)}</span>
        <span className="jl-card-region"><MapPin size={12} aria-hidden="true" /> {j.regions[0]}</span>
        {many && (
          <>
            <button type="button" className="jl4-nav jl4-nav-prev" onClick={step(-1)} aria-label={`Previous photo of ${j.title}`}>
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <button type="button" className="jl4-nav jl4-nav-next" onClick={step(1)} aria-label={`Next photo of ${j.title}`}>
              <ChevronRight size={18} aria-hidden="true" />
            </button>
            <div className="jl4-dots" aria-hidden="true">
              {shots.map((s, k) => (
                <button
                  key={s + k}
                  type="button"
                  className={`jl4-dot${k === shot ? ' is-on' : ''}`}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShot(k); }}
                  tabIndex={-1}
                  aria-label={`Go to photo ${k + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <div className="jl-card-body">
        <h3 className="jl-card-title"><Link to={j.to}>{j.title}</Link></h3>
        <span className="jl-card-group"><Users size={13} aria-hidden="true" /> {j.group}</span>
        <p className="jl-card-blurb">{j.blurb}</p>
        <div className="jl-card-meta">
          <span><Clock size={14} aria-hidden="true" /> {j.nightsLabel}</span>
          <span><Calendar size={14} aria-hidden="true" /> {j.season}</span>
          <span><Gauge size={14} aria-hidden="true" /> {j.grade}</span>
        </div>
        <div className="jl-card-foot">
          <span className="jl-card-price">
            <small>from</small> {j.priceLabel} <small>/ person</small>
            {people > 1 && (
              <span className="jl2-card-total">
                ≈ ₹{(j.price * people).toLocaleString('en-IN')} for {people} travellers
              </span>
            )}
          </span>
          <div className="jl-card-ctas">
            <Link to={j.to} className="jl-cbtn jl-cbtn-view">
              View Itinerary <ArrowRight size={15} aria-hidden="true" />
            </Link>
            <a href={waHref} target="_blank" rel="noopener noreferrer" className="jl-cbtn jl-cbtn-wa" aria-label={`Enquire about ${j.title} on WhatsApp`}>
              <WaIcon size={15} /> Enquire Now
            </a>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* A titled filter group (matches /journeys4's j2-group). */
function FilterGroup({ id, title, icon: Icon, options, selected, onToggle, counts }) {
  const labelId = `advgrp-${id}`;
  return (
    <div className="j2-group" role="group" aria-labelledby={labelId}>
      <p className="j2-group-title" id={labelId}>
        {Icon && <Icon size={14} aria-hidden="true" />} {title}
      </p>
      <div className="j2-options">
        {options.map((opt) => {
          const on = selected.includes(opt.value);
          const count = counts ? counts[opt.value] ?? 0 : null;
          return (
            <label key={opt.value} className={`j2-option${on ? ' is-on' : ''}${count === 0 && !on ? ' is-empty' : ''}`}>
              <input type="checkbox" checked={on} onChange={() => onToggle(opt.value)} />
              <span className="j2-check" aria-hidden="true">{on && <Check size={12} strokeWidth={3} />}</span>
              <span className="j2-option-label">{opt.label}</span>
              {count !== null && <span className="j2-option-count">{count}</span>}
            </label>
          );
        })}
      </div>
    </div>
  );
}

/* Wrapper giving a control the same eyebrow + rhythm as FilterGroup
   (matches /journeys4's FilterField). */
function FilterField({ id, title, icon: Icon, children, aside }) {
  const labelId = `advgrp-${id}`;
  return (
    <div className="j2-group" role="group" aria-labelledby={labelId}>
      <p className="j2-group-title" id={labelId}>
        {Icon && <Icon size={14} aria-hidden="true" />} {title}
        {aside && <span className="j2-group-aside">{aside}</span>}
      </p>
      {children}
    </div>
  );
}

/* Searchable region/country combobox — the /journeys4 DestinationSearch,
   retargeted to this page's continents + countries. */
function RegionSearch({ selected, onToggle, counts }) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrapRef = useRef(null);

  useEffect(() => {
    const onDoc = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const needle = q.trim().toLowerCase();
  const suggestions = DESTS.filter((d) => !selected.includes(d.value) && d.label.toLowerCase().includes(needle));
  const regionHits = suggestions.filter((d) => d.type === 'region');
  const countryHits = suggestions.filter((d) => d.type === 'country');

  const pick = (d) => { onToggle(d.value); setQ(''); setActive(0); };
  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setActive((a) => Math.min(a + 1, suggestions.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === 'Enter' && suggestions[active]) { e.preventDefault(); pick(suggestions[active]); }
    else if (e.key === 'Escape') { setOpen(false); }
  };

  const renderOpt = (d, idx) => {
    const Icon = d.type === 'region' ? Globe2 : MapPin;
    return (
      <li key={`${d.type}-${d.value}`}>
        <button
          type="button"
          role="option"
          aria-selected={idx === active}
          className={`j2-dest-opt${idx === active ? ' is-active' : ''}`}
          onMouseEnter={() => setActive(idx)}
          onClick={() => pick(d)}
        >
          <Icon size={14} aria-hidden="true" />
          <span className="j2-dest-opt-label">{d.label}</span>
          {counts && <span className="j2-option-count">{counts[d.value] ?? 0}</span>}
        </button>
      </li>
    );
  };

  return (
    <div className="j2-dest" ref={wrapRef}>
      <div className="j2-dest-field">
        <Search size={16} aria-hidden="true" />
        <input
          type="text"
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); setActive(0); }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={selected.length ? 'Add a region or country…' : 'Search a region or country…'}
          aria-label="Search adventures by region or country"
          aria-expanded={open}
          role="combobox"
          aria-controls="adv-dest-list"
          autoComplete="off"
        />
      </div>

      {open && suggestions.length > 0 && (
        <ul className="j2-dest-pop" id="adv-dest-list" role="listbox">
          {regionHits.length > 0 && (
            <>
              <li className="j2-dest-grouphd" role="presentation">Regions</li>
              {regionHits.map((d) => renderOpt(d, suggestions.indexOf(d)))}
            </>
          )}
          {countryHits.length > 0 && (
            <>
              <li className="j2-dest-grouphd" role="presentation">Countries</li>
              {countryHits.map((d) => renderOpt(d, suggestions.indexOf(d)))}
            </>
          )}
        </ul>
      )}

      {selected.length > 0 && (
        <div className="j2-dest-chips">
          {selected.map((d) => {
            const Icon = isRegionDest(d) ? Globe2 : MapPin;
            return (
              <button key={d} type="button" className="j2-dest-chip" onClick={() => onToggle(d)} aria-label={`Remove ${d}`}>
                <Icon size={12} aria-hidden="true" /> {d} <X size={13} aria-hidden="true" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* "Up to N days" slider + preset pills — reuses the /journeys4 .j2-budget bar. */
function DurationBar({ value, min, max, onChange }) {
  const pct = ((value - min) / (max - min)) * 100;
  const isAny = value >= max;
  return (
    <div className="j2-budget">
      <div className="j2-budget-slider">
        <div className="j2-budget-track">
          <div className="j2-budget-fill" style={{ width: `${pct}%` }} aria-hidden="true" />
          <input
            type="range" min={min} max={max} step={1} value={value}
            className="j2-budget-input"
            onChange={(e) => onChange(Number(e.target.value))}
            aria-label="Maximum trip length in days"
            aria-valuetext={isAny ? 'Any length' : `Up to ${fmtDays(value)}`}
          />
        </div>
        <div className="j2-budget-ends">
          <span>{fmtDays(min)}</span>
          <span>{max}+ days</span>
        </div>
      </div>
      <div className="j2-budget-presets">
        {DURATION_PRESETS.map((p) => (
          <button key={p.v} type="button" className={`j2-preset${value === p.v ? ' is-on' : ''}`} onClick={() => onChange(p.v)}>
            {p.label}
          </button>
        ))}
        <button type="button" className={`j2-preset${isAny ? ' is-on' : ''}`} onClick={() => onChange(max)}>Any</button>
      </div>
    </div>
  );
}

/* "Up to ₹NL per person" slider + preset pills — the /journeys4 budget bar. */
function BudgetPicker({ value, min, max, step, onChange }) {
  const pct = ((value - min) / (max - min)) * 100;
  const isAny = value >= max;
  return (
    <div className="j2-budget">
      <div className="j2-budget-slider">
        <div className="j2-budget-track">
          <div className="j2-budget-fill" style={{ width: `${pct}%` }} aria-hidden="true" />
          <input
            type="range" min={min} max={max} step={step} value={value}
            className="j2-budget-input"
            onChange={(e) => onChange(Number(e.target.value))}
            aria-label="Maximum budget per person"
            aria-valuetext={isAny ? 'Any budget' : `Up to ${fmtLakh(value)}`}
          />
        </div>
        <div className="j2-budget-ends">
          <span>{fmtLakh(min)}</span>
          <span>{fmtLakh(max)}+</span>
        </div>
      </div>
      <div className="j2-budget-presets">
        {BUDGET_PRESETS.map((p) => (
          <button key={p.v} type="button" className={`j2-preset${value === p.v ? ' is-on' : ''}`} onClick={() => onChange(p.v)}>
            {p.label}
          </button>
        ))}
        <button type="button" className={`j2-preset${isAny ? ' is-on' : ''}`} onClick={() => onChange(max)}>Any</button>
      </div>
    </div>
  );
}

/* Plus / minus stepper for a labelled count (adults, children). */
function Stepper({ value, min, max, onChange, label, sub }) {
  return (
    <div className="j2-stepper-row">
      <span className="j2-stepper-label">
        {label}
        {sub && <small>{sub}</small>}
      </span>
      <div className="j2-stepper">
        <button type="button" className="j2-step-btn" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={`Fewer ${label.toLowerCase()}`}>
          <Minus size={16} aria-hidden="true" />
        </button>
        <span className="j2-step-val" aria-live="polite">{value}</span>
        <button type="button" className="j2-step-btn" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={`More ${label.toLowerCase()}`}>
          <Plus size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

/* Travel-date picker with a ± flexibility window — the /journeys4 calendar.
   Filters journeys whose season covers the chosen month(s). */
function TravelDatePicker({ date, flex, onChange }) {
  const [open, setOpen] = useState(false);
  const now = new Date();
  const [view, setView] = useState(() => (date ? { y: date.y, m: date.m } : { y: now.getFullYear(), m: now.getMonth() }));
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, [open]);

  const minYM = now.getFullYear() * 12 + now.getMonth();
  const viewYM = view.y * 12 + view.m;
  const shift = (n) => {
    const t = viewYM + n;
    if (t < minYM) return;
    setView({ y: Math.floor(t / 12), m: t % 12 });
  };

  const firstDow = (new Date(view.y, view.m, 1).getDay() + 6) % 7;
  const daysIn = new Date(view.y, view.m + 1, 0).getDate();
  const cells = [...Array(firstDow).fill(null), ...Array.from({ length: daysIn }, (_, i) => i + 1)];
  const todayKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
  const label = date ? `${fmtDate(date)}${flex ? ` · ±${flex}d` : ''}` : 'Any dates';

  return (
    <div className="j2-cal" ref={ref}>
      <button type="button" className={`j2-cal-trigger${date ? ' has-date' : ''}`} onClick={() => setOpen((o) => !o)} aria-haspopup="dialog" aria-expanded={open}>
        <Calendar size={16} aria-hidden="true" />
        <span>{label}</span>
        {date ? (
          <span
            className="j2-cal-clear"
            role="button"
            tabIndex={0}
            aria-label="Clear date"
            onClick={(e) => { e.stopPropagation(); onChange(null, 0); }}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); e.preventDefault(); onChange(null, 0); } }}
          >
            <X size={14} aria-hidden="true" />
          </span>
        ) : (
          <ChevronDown size={15} aria-hidden="true" className="j2-cal-caret" />
        )}
      </button>

      {open && (
        <div className="j2-cal-pop" role="dialog" aria-label="Choose a travel date">
          <div className="j2-cal-head">
            <button type="button" className="j2-cal-nav" onClick={() => shift(-1)} disabled={viewYM <= minYM} aria-label="Previous month">
              <ChevronLeft size={17} aria-hidden="true" />
            </button>
            <span className="j2-cal-month">{MONTH_NAMES[view.m]} {view.y}</span>
            <button type="button" className="j2-cal-nav" onClick={() => shift(1)} aria-label="Next month">
              <ChevronRight size={17} aria-hidden="true" />
            </button>
          </div>
          <div className="j2-cal-grid j2-cal-dow">
            {WEEKDAYS.map((w) => <span key={w} className="j2-cal-wd">{w}</span>)}
          </div>
          <div className="j2-cal-grid">
            {cells.map((d, i) => {
              if (d === null) return <span key={`b${i}`} className="j2-cal-blank" />;
              const isSel = date && date.y === view.y && date.m === view.m && date.d === d;
              const isToday = todayKey === `${view.y}-${view.m}-${d}`;
              const isPast = new Date(view.y, view.m, d) < new Date(now.getFullYear(), now.getMonth(), now.getDate());
              return (
                <button
                  key={d}
                  type="button"
                  className={`j2-cal-day${isSel ? ' is-sel' : ''}${isToday ? ' is-today' : ''}`}
                  disabled={isPast}
                  onClick={() => onChange({ y: view.y, m: view.m, d }, flex)}
                >
                  {d}
                </button>
              );
            })}
          </div>
          <div className="j2-cal-flex">
            <span className="j2-cal-flex-label">Flexible by</span>
            <div className="j2-cal-flex-chips">
              {FLEX_STEPS.map((f) => (
                <button key={f} type="button" className={`j2-flexchip${flex === f ? ' is-on' : ''}`} onClick={() => onChange(date, f)}>
                  {f === 0 ? 'Exact' : `±${f}d`}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Count-up figure, run once when scrolled into view ---------- */
function StatFigure({ value, suffix }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = `${value}${suffix}`;
      return undefined;
    }
    const obj = { n: 0 };
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => gsap.to(obj, {
        n: value, duration: 1.4, ease: 'power2.out',
        onUpdate: () => { el.textContent = `${Math.round(obj.n)}${suffix}`; },
      }),
    });
    el.textContent = `0${suffix}`;
    return () => st.kill();
  }, [value, suffix]);
  return <span className="adv-stat__num" ref={ref}>{value}{suffix}</span>;
}

export default function Adventure() {
  const rootRef = useRef(null);
  const heroBgRef = useRef(null);
  const modesRef = useRef(null);
  const trackRef = useRef(null);
  const featureImgRef = useRef(null);
  const collectionRef = useRef(null);

  const openScheduleCall = useScheduleCall();

  const [filtersOpen, setFiltersOpen] = useState(false); // mobile drawer
  const [dests, setDests] = useState([]);         // regions + countries
  const [budgetMax, setBudgetMax] = useState(PRICE_MAX);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [travelDate, setTravelDate] = useState(null);   // {y,m,d} | null
  const [flex, setFlex] = useState(0);                  // ± days
  const [kinds, setKinds] = useState([]);
  const [durationMax, setDurationMax] = useState(DUR_MAX);
  const [grades, setGrades] = useState([]);

  const people = adults + children;
  const setDate = useCallback((date, f) => { setTravelDate(date); setFlex(f || 0); }, []);

  const toggler = (setter) => (value) =>
    setter((cur) => (cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value]));

  const durationActive = durationMax < DUR_MAX;
  const budgetActive = budgetMax < PRICE_MAX;

  /* Months touched by the chosen date ± flex — recomputed only when either changes. */
  const dateMonths = useMemo(() => dateWindowMonths(travelDate, flex), [travelDate, flex]);

  /* AND across groups, OR within. `skip` drops one group for option counts. */
  const passes = useCallback((a, skip) => {
    if (skip !== 'dest' && dests.length && !dests.some((d) => destMatch(a, d))) return false;
    if (skip !== 'budget' && a.price > budgetMax) return false;
    if (skip !== 'when' && dateMonths && !dateMonths.some((mo) => monthInSeason(mo, a.season))) return false;
    if (skip !== 'kind' && kinds.length && !kinds.includes(a.kind)) return false;
    if (skip !== 'dur' && a.days > durationMax) return false;
    if (skip !== 'grade' && grades.length && !grades.includes(a.grade)) return false;
    return true;
  }, [dests, budgetMax, dateMonths, kinds, durationMax, grades]);

  const results = useMemo(() => ADVENTURES.filter((a) => passes(a)), [passes]);

  const counts = useMemo(() => {
    const count = (skip, matcher) => {
      const base = ADVENTURES.filter((a) => passes(a, skip));
      const out = {};
      for (const [value, test] of matcher) out[value] = base.filter(test).length;
      return out;
    };
    return {
      kind: count('kind', KIND_KEYS.map((k) => [k, (a) => a.kind === k])),
      dest: count('dest', DESTS.map((d) => [d.value, (a) => destMatch(a, d.value)])),
      grade: count('grade', GRADES.map((g) => [g, (a) => a.grade === g])),
    };
  }, [passes]);

  const totalActive =
    dests.length + kinds.length + grades.length +
    (budgetActive ? 1 : 0) + (travelDate ? 1 : 0) + (durationActive ? 1 : 0);
  const clearAll = () => {
    setDests([]); setKinds([]); setGrades([]); setDurationMax(DUR_MAX);
    setBudgetMax(PRICE_MAX); setTravelDate(null); setFlex(0); setAdults(2); setChildren(0);
  };

  const scrollToCollection = useCallback(() => {
    collectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const pickKind = useCallback((k) => {
    setKinds([k]); setDests([]); setGrades([]); setDurationMax(DUR_MAX);
    setBudgetMax(PRICE_MAX); setTravelDate(null); setFlex(0);
    setTimeout(scrollToCollection, 60);
  }, [scrollToCollection]);

  /* Lock body scroll while the mobile filter drawer is open. */
  useEffect(() => {
    document.body.style.overflow = filtersOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [filtersOpen]);

  /* ---- GSAP + ScrollTrigger, all gated behind matchMedia ---- */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set('[data-reveal], [data-line]', { clearProps: 'all', opacity: 1, y: 0, filter: 'none' });
      });

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.timeline({ defaults: { ease: 'power3.out' } })
          .from('[data-hero-line]', { yPercent: 115, opacity: 0, duration: 1.1, stagger: 0.12 }, 0.1)
          .from('[data-hero-fade]', { y: 24, opacity: 0, duration: 0.9, stagger: 0.1 }, 0.5);

        if (heroBgRef.current) {
          gsap.to(heroBgRef.current, {
            yPercent: 22, ease: 'none',
            scrollTrigger: { trigger: '.adv-hero', start: 'top top', end: 'bottom top', scrub: true },
          });
        }

        ScrollTrigger.batch('[data-reveal]', {
          start: 'top 88%',
          onEnter: (batch) => gsap.to(batch, {
            opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, stagger: 0.08, ease: 'power3.out', overwrite: true,
          }),
        });
        gsap.set('[data-reveal]', { opacity: 0, y: 28, filter: 'blur(12px)' });

        gsap.utils.toArray('[data-line]').forEach((line) => {
          gsap.fromTo(line, { opacity: 0.14 }, {
            opacity: 1, ease: 'none',
            scrollTrigger: { trigger: line, start: 'top 82%', end: 'top 46%', scrub: true },
          });
        });

        if (featureImgRef.current) {
          gsap.fromTo(featureImgRef.current, { yPercent: -12 }, {
            yPercent: 12, ease: 'none',
            scrollTrigger: { trigger: '.adv-feature', start: 'top bottom', end: 'bottom top', scrub: true },
          });
        }
      });

      mm.add('(min-width: 861px) and (prefers-reduced-motion: no-preference)', () => {
        const track = trackRef.current;
        const section = modesRef.current;
        if (!track || !section) return undefined;
        const getDist = () => Math.max(0, track.scrollWidth - window.innerWidth);
        const tween = gsap.to(track, {
          x: () => -getDist(), ease: 'none',
          scrollTrigger: {
            trigger: section, start: 'top top', end: () => `+=${getDist()}`,
            pin: true, scrub: 0.6, invalidateOnRefresh: true, anticipatePin: 1,
            /* The pin injects a multi-thousand-pixel spacer. A higher
               refreshPriority makes this trigger refresh BEFORE the reveals /
               triggers below it, so their start positions are measured against
               the spaced page — otherwise an arriving visitor can be dropped
               into the middle of the page. (Same fix as the /about-us timeline.) */
            refreshPriority: 1,
          },
        });
        return () => tween.kill();
      });
    }, rootRef);

    /* Once every trigger (including the pinned rail) is registered, one refresh
       recomputes all positions in priority order; then land the page at the top
       (this effect runs after the app's ScrollToTop, and a pin refresh can
       otherwise leave the arriving visitor part-way down). */
    ScrollTrigger.refresh();
    window.scrollTo(0, 0);

    return () => ctx.revert();
  }, []);

  /* The shared filter body — desktop rail + mobile drawer. */
  const filterBody = (
    <>
      <FilterField id="region" title="Region" icon={MapPin}>
        <RegionSearch selected={dests} onToggle={toggler(setDests)} counts={counts.dest} />
      </FilterField>
      <FilterField
        id="budget" title="Budget (per person)" icon={Wallet}
        aside={budgetActive ? `Up to ${fmtLakh(budgetMax)}` : 'Any'}
      >
        <BudgetPicker value={budgetMax} min={PRICE_MIN} max={PRICE_MAX} step={PRICE_STEP} onChange={setBudgetMax} />
      </FilterField>
      <FilterField id="people" title="Travellers" icon={Users}>
        <div className="j2-steppers">
          <Stepper label="Adults" sub="12+ yrs" value={adults} min={1} max={12} onChange={setAdults} />
          <Stepper label="Children" sub="2–11 yrs" value={children} min={0} max={10} onChange={setChildren} />
        </div>
      </FilterField>
      <FilterField id="when" title="When you'll travel" icon={CalendarRange}>
        <TravelDatePicker date={travelDate} flex={flex} onChange={setDate} />
      </FilterField>
      <FilterGroup
        id="kind" title="Adventure type" icon={Mountain}
        options={KINDS.map((k) => ({ value: k.key, label: k.key }))}
        selected={kinds} onToggle={toggler(setKinds)} counts={counts.kind}
      />
      <FilterField
        id="dur" title="Duration" icon={Clock}
        aside={durationActive ? `Up to ${fmtDays(durationMax)}` : 'Any length'}
      >
        <DurationBar value={durationMax} min={DUR_MIN} max={DUR_MAX} onChange={setDurationMax} />
      </FilterField>
      <FilterGroup
        id="grade" title="Difficulty" icon={Gauge}
        options={GRADES.map((g) => ({ value: g, label: g }))}
        selected={grades} onToggle={toggler(setGrades)} counts={counts.grade}
      />
    </>
  );

  return (
    <div className="h26 new-typo adv jl jl2 jl4" ref={rootRef}>
      <SiteNav solidAt={80} skipTo="#adventures" skipLabel="Skip to adventures" />

      <main>
        {/* ---------------- HERO ---------------- */}
        <section className="adv-hero" aria-label="Adventure travel">
          <div className="adv-hero__bg" ref={heroBgRef} style={{ backgroundImage: `url(${sizedUnsplash('1527668752968-14dc70a27c95', 2000)})` }} />
          <div className="adv-hero__veil" aria-hidden="true" />
          <div className="adv-hero__inner">
            <span className="adv-eyebrow adv-eyebrow--light" data-hero-fade>Adventure Collection</span>
            <h1 className="adv-hero__title">
              <span className="adv-line"><span data-hero-line>Earn</span></span>
              <span className="adv-line"><span data-hero-line>the <em>view.</em></span></span>
            </h1>
            <p className="adv-hero__sub" data-hero-fade>
              High passes at first light, white-water mornings and nights under canvas —
              24 journeys across 25 countries, built for people who would rather work for the horizon.
            </p>
            <div className="adv-hero__ctas" data-hero-fade>
              <button type="button" className="adv-btn adv-btn--primary" onClick={scrollToCollection}>
                Browse adventures <ArrowDown size={16} aria-hidden="true" />
              </button>
              <button type="button" className="adv-btn adv-btn--light" onClick={openScheduleCall}>
                Talk to a specialist
              </button>
            </div>
            <ul className="adv-hero__chips" data-hero-fade>
              <li><strong>25</strong> countries</li>
              <li><strong>6</strong> continents</li>
              <li><strong>4.8</strong> traveller rating</li>
            </ul>
          </div>
          <span className="adv-hero__cue" aria-hidden="true"><span /></span>
        </section>

        {/* ---------------- MANIFESTO ---------------- */}
        <section className="adv-manifesto" aria-label="Why adventure">
          <span className="adv-eyebrow" data-reveal>The adventure state of mind</span>
          <p className="adv-manifesto__lines">
            <span data-line>Some trips are for slowing down.</span>{' '}
            <span data-line>These are for the ones who’d rather</span>{' '}
            <span data-line><em>climb higher, paddle further</em></span>{' '}
            <span data-line>and sleep where the map runs out —</span>{' '}
            <span data-line>and come home having done the thing.</span>
          </p>
        </section>

        {/* ---------------- KINDS (pinned horizontal rail) ---------------- */}
        <section className="adv-modes" ref={modesRef} aria-label="Kinds of adventure">
          <div className="adv-modes__pin">
            <div className="adv-modes__head">
              <span className="adv-eyebrow adv-eyebrow--light">Choose your kind</span>
              <h2 className="adv-h2 adv-h2--light">What kind of<br /><em>adventure?</em></h2>
              <p className="adv-modes__hint">Pick a discipline to jump straight to those trips.</p>
            </div>
            <div className="adv-modes__track" ref={trackRef}>
              {KINDS.map((k, i) => (
                <button
                  type="button"
                  key={k.key}
                  className="adv-mode"
                  onClick={() => pickKind(k.key)}
                  style={{ backgroundImage: `linear-gradient(180deg, rgba(2,19,48,0) 30%, rgba(2,19,48,0.86) 100%), url(${sizedUnsplash(k.id, 900)})` }}
                >
                  <span className="adv-mode__no">{String(i + 1).padStart(2, '0')}</span>
                  <span className="adv-mode__body">
                    <span className="adv-mode__count">{counts.kind[k.key] ?? 0} journeys</span>
                    <span className="adv-mode__name">{k.key}</span>
                    <span className="adv-mode__line">{k.line}</span>
                    <span className="adv-mode__go">Explore <ArrowRight size={15} aria-hidden="true" /></span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- FEATURE EXPEDITION ---------------- */}
        <section className="adv-feature" aria-label="Featured expedition">
          <div className="adv-feature__media">
            <div className="adv-feature__img" ref={featureImgRef} style={{ backgroundImage: `url(${sizedUnsplash('1527668752968-14dc70a27c95', 1600)})` }} />
          </div>
          <div className="adv-feature__panel" data-reveal>
            <span className="adv-eyebrow adv-eyebrow--light">Signature expedition</span>
            <h2 className="adv-h2 adv-h2--light">Everest Base Camp</h2>
            <p className="adv-feature__lead">
              Sixteen days into the Khumbu — Sherpa villages, swaying suspension bridges and
              the amphitheatre of Everest, Lhotse and Nuptse from Kala Patthar at 5,600 metres.
              Acclimatisation built in, the best teahouses held, and a mountain leader with you the whole way.
            </p>
            <ul className="adv-feature__facts">
              <li><Mountain size={16} aria-hidden="true" /> 5,644 m high point</li>
              <li><Clock size={16} aria-hidden="true" /> 16 days</li>
              <li><Gauge size={16} aria-hidden="true" /> Expedition grade</li>
            </ul>
            <div className="adv-feature__ctas">
              {/* Opens the Everest Base Camp detail page. That page isn't built
                  yet, so this route falls through to the 404 — which carries dev
                  links to the two existing tour-detail templates. */}
              <Link to="/tour-detail-adventure-ebc" className="adv-btn adv-btn--primary">
                Plan this expedition <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <span className="adv-feature__from">from ₹2,45,000 pp</span>
            </div>
          </div>
        </section>

        {/* ---------------- THE COLLECTION: filters + grid ---------------- */}
        <section className="adv-collection" ref={collectionRef}>
          <div className="adv-collection__intro">
            <span className="adv-eyebrow" data-reveal>The collection</span>
            <h2 className="adv-h2" data-reveal>Adventures across <em>the world.</em></h2>
            <p className="adv-collection__lead" data-reveal>
              Filter on the left by region, budget, when you'll travel, the kind of adventure,
              trip length and difficulty — every trip is fully tailorable to your own dates.
            </p>
          </div>

          <div className="jl2-shell" id="adventures">
            {/* Mobile filter trigger + count bar */}
            <div className="jl2-mobilebar">
              <button type="button" className="jl2-filter-toggle" onClick={() => setFiltersOpen(true)}>
                <SlidersHorizontal size={16} aria-hidden="true" />
                Filters
                {totalActive > 0 && <span className="jl2-filter-badge">{totalActive}</span>}
              </button>
              <span className="jl2-mobile-count"><strong>{results.length}</strong> adventures</span>
            </div>

            {/* ----- LEFT: filter sidebar (a drawer on mobile) ----- */}
            <aside className={`jl2-sidebar${filtersOpen ? ' is-open' : ''}`} aria-label="Filter adventures">
              <div className="jl2-sidebar-scrim" onClick={() => setFiltersOpen(false)} />
              <div className="jl2-sidebar-panel">
                <div className="jl2-sidebar-head">
                  <h2 className="jl2-sidebar-title"><SlidersHorizontal size={17} aria-hidden="true" /> Filters</h2>
                  {totalActive > 0 && <button type="button" className="jl2-clear" onClick={clearAll}>Clear all</button>}
                  <button type="button" className="jl2-sidebar-close" aria-label="Close filters" onClick={() => setFiltersOpen(false)}>
                    <X size={20} />
                  </button>
                </div>
                <div className="jl2-sidebar-body">
                  {filterBody}
                </div>
                <div className="jl2-sidebar-foot">
                  <button type="button" className="adv-btn adv-btn--primary adv-btn--block" onClick={() => setFiltersOpen(false)}>
                    Show {results.length} {results.length === 1 ? 'adventure' : 'adventures'}
                  </button>
                </div>
              </div>
            </aside>

            {/* ----- RIGHT: results ----- */}
            <section className="jl2-results">
              <div className="jl2-results-head">
                <p className="jl-count" aria-live="polite">
                  <strong>{results.length}</strong> {results.length === 1 ? 'adventure' : 'adventures'}
                  {dests.length ? ` · ${dests.length === 1 ? dests[0] : `${dests.length} places`}` : ''}
                </p>
              </div>

              {totalActive > 0 && (
                <div className="jl-active jl2-active">
                  {dests.map((d) => (
                    <button key={d} type="button" className="jl-active-chip" onClick={() => toggler(setDests)(d)}>{d} <X size={13} /></button>
                  ))}
                  {kinds.map((k) => (
                    <button key={k} type="button" className="jl-active-chip" onClick={() => toggler(setKinds)(k)}>{k} <X size={13} /></button>
                  ))}
                  {grades.map((g) => (
                    <button key={g} type="button" className="jl-active-chip" onClick={() => toggler(setGrades)(g)}>{g} <X size={13} /></button>
                  ))}
                  {budgetActive && (
                    <button type="button" className="jl-active-chip" onClick={() => setBudgetMax(PRICE_MAX)}>Up to {fmtLakh(budgetMax)} <X size={13} /></button>
                  )}
                  {travelDate && (
                    <button type="button" className="jl-active-chip" onClick={() => setDate(null, 0)}>{fmtDate(travelDate)}{flex ? ` ±${flex}d` : ''} <X size={13} /></button>
                  )}
                  {durationActive && (
                    <button type="button" className="jl-active-chip" onClick={() => setDurationMax(DUR_MAX)}>Up to {fmtDays(durationMax)} <X size={13} /></button>
                  )}
                  <button type="button" className="jl-clear-all" onClick={clearAll}>Clear all</button>
                </div>
              )}

              {results.length > 0 ? (
                <div className="jl-grid jl2-grid">
                  {results.map((j, i) => <JourneyCard key={j.id} j={j} i={i} people={people} />)}
                </div>
              ) : (
                <div className="jl-empty">
                  <span className="jl-empty-icon"><Compass size={30} aria-hidden="true" /></span>
                  <h2>No adventures match just yet</h2>
                  <p>
                    We run adventures on every continent and design tailor-made expeditions anywhere.
                    Loosen a filter, or tell a specialist what you're after — we'll build it.
                  </p>
                  <div className="jl-empty-actions">
                    <button type="button" className="adv-btn adv-btn--primary" onClick={clearAll}>Clear filters</button>
                    <a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer" className="adv-btn adv-btn--outline">
                      <MessageCircle size={16} /> Ask a specialist
                    </a>
                  </div>
                </div>
              )}
            </section>
          </div>
        </section>

        {/* ---------------- STATS ---------------- */}
        <section className="adv-stats" aria-label="Adventure by the numbers">
          {STATS.map((s) => (
            <div className="adv-stat" key={s.label} data-reveal>
              <StatFigure value={s.value} suffix={s.suffix} />
              <span className="adv-stat__label">{s.label}</span>
            </div>
          ))}
        </section>

        {/* ---------------- ASSURANCE ---------------- */}
        <section className="adv-trust" aria-label="Why book with Cox & Kings">
          <div className="adv-trust__head" data-reveal>
            <span className="adv-eyebrow">The Cox &amp; Kings difference</span>
            <h2 className="adv-h2">Serious adventure, <em>safely handled.</em></h2>
          </div>
          <div className="adv-trust__grid">
            {ASSURANCES.map((t) => {
              const Icon = t.icon;
              return (
                <div className="adv-trust__card" key={t.title} data-reveal>
                  <span className="adv-trust__icon"><Icon size={20} aria-hidden="true" /></span>
                  <h3>{t.title}</h3>
                  <p>{t.body}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ---------------- CTA ---------------- */}
        <section className="adv-cta" aria-label="Plan your adventure">
          <div className="adv-cta__bg" aria-hidden="true" style={{ backgroundImage: `url(${sizedUnsplash('1483347756197-71ef80e95f73', 1800)})` }} />
          <div className="adv-cta__veil" aria-hidden="true" />
          <div className="adv-cta__inner" data-reveal>
            <span className="adv-eyebrow adv-eyebrow--light">Start the planning</span>
            <h2 className="adv-cta__title">Where will you<br /><em>push yourself?</em></h2>
            <p className="adv-cta__sub">Tell a specialist the kind of challenge you’re after. We’ll shape the route, the grade and the dates around you — and handle every permit, porter and pickup in between.</p>
            <div className="adv-cta__ctas">
              <button type="button" className="adv-btn adv-btn--primary" onClick={openScheduleCall}>
                Plan my adventure <ArrowRight size={16} aria-hidden="true" />
              </button>
              <a className="adv-btn adv-btn--light" href={CONTACT.phoneHref}>
                <Phone size={15} aria-hidden="true" /> {CONTACT.phoneDisplay}
              </a>
            </div>
            <p className="adv-cta__alt"><Sparkles size={14} aria-hidden="true" /> Fully tailored · Expert-led · No obligation</p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
