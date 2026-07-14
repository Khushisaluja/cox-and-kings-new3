/* ============================================================
   Journeys4 — the tour LISTING page for Cox & Kings, sidebar edition.

   A variant of /journeys2 with exactly ONE change: every card carries
   a clear "Private Tour" or "Group Tour" badge on its image, so the
   way a trip travels is obvious before you read a word. Everything
   else — the /improved nav + footer, the open LEFT filter rail
   (Destination, Budget, Travellers, Dates, Pace, Trip style), the
   filterable/sortable grid and the pill-based radius language — is
   left exactly as /journeys2. The single badge style lives in
   Journeys4.css, layered last.
   ============================================================ */
import { Fragment, useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SmartLink as Link, CALLBACK, useScheduleCall } from '../components/ScheduleCall';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import {
  Phone, PhoneCall, MessageCircle, ArrowUpRight, ArrowRight, Search, MapPin,
  Compass, Calendar, Menu, X, ChevronDown, ChevronLeft, ChevronRight,
  Star, SlidersHorizontal, Clock, Users, User, Gauge, Wallet,
  Instagram, Facebook, Youtube, Linkedin, Check, Plus, Minus, CalendarRange,
} from 'lucide-react';
import { img } from '../data/v3content';
import './Home2026.css';
import './Home2026Improved.css';
import './Journeys.css';
import './Journeys2.css';
import './Journeys4.css';
/* The header and footer are the /new3 ones, verbatim. Both stylesheets are
   fully scoped (.new-typo / .n3), so importing them here cannot leak into the
   rest of this page — only the two wrappers that carry those classes. */
import './NewTypography.css';
import './New3.css';

/* /improved-scoped direct line (matches Home2026Improved, and /new3, whose
   navbar and footer this page now carries). */
const CONTACT = {
  phoneDisplay: '+91 8556001700',
  phoneHref: 'tel:+918556001700',
  whatsappHref: 'https://wa.me/918556001700',
  email: 'journeys@coxandkings.com',
};

/* The homepage. /new3's chrome points at sections that live there. */
const HOME = '/';

/* ---- Canonical destination filters. Order = the sidebar list. ---- */
const REGIONS = [
  'India', 'Japan', 'Switzerland', 'Italy', 'Northern Lights',
  'Australia & NZ', 'Africa Safari', 'Southeast Asia',
  'Maldives', 'Europe', 'USA',
];

/* Trip-style filter (mirrors the /improved hero "Style" list). */
const STYLES = ['Group Tour', 'Bespoke Private', 'Luxury', 'Family', 'Honeymoon', 'Safari'];

/* Pace filter. */
const PACES = ['Relaxed', 'Balanced', 'Active'];

/* Travel-month selector — filters on each journey's season string. */
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_IDX = Object.fromEntries(MONTHS.map((m, i) => [m, i]));

/* Does a journey's season string cover the chosen month? Permissive: an
   unparseable season never excludes a trip. Handles single months ('Dec'),
   ranges ('Mar–Apr') and wrap-around ranges ('Oct–Mar'). */
function monthInSeason(month, season) {
  if (!month) return true;
  const s = (season || '').trim();
  if (/year-round|any/i.test(s)) return true;
  const toks = s.split('–').map((t) => t.trim().slice(0, 3));
  const start = MONTH_IDX[toks[0]];
  const end = MONTH_IDX[toks[toks.length - 1]];
  const mi = MONTH_IDX[month];
  if (start == null || end == null || mi == null) return true;
  return start <= end ? mi >= start && mi <= end : mi >= start || mi <= end;
}

const SORTS = [
  { key: 'recommended', label: 'Recommended' },
  { key: 'price-asc', label: 'Price · low to high' },
  { key: 'price-desc', label: 'Price · high to low' },
  { key: 'nights-desc', label: 'Duration · longest first' },
];

/* One-line "how it travels" label, derived from the trip style. */
const GROUP_BY_STYLE = {
  'Group Tour': 'Small group · max 18',
  'Bespoke Private': 'Private & tailor-made',
  Luxury: 'Private guiding',
  Family: 'Family-friendly',
  Honeymoon: 'Just the two of you',
  Safari: 'Small-group safari',
};

/* Binary tour-type badge shown prominently on every card. Escorted
   fixed-departure styles (group tours, small-group safaris) read as a
   "Group Tour"; everything designed just for the travellers reads as a
   "Private Tour". Data-driven off the trip style. */
const GROUP_STYLES = ['Group Tour', 'Safari'];
const tourTypeOf = (style) => (GROUP_STYLES.includes(style) ? 'Group Tour' : 'Private Tour');

/* Author-vetted, region-correct photo pools (shared with /journeys). */
const U = (id) => `https://images.unsplash.com/photo-${id}`;
const REGION_PHOTOS = {
  India: [U('1564507592333-c60657eea523'), U('1477587458883-47145ed94245'), U('1524492412937-b28074a5d7da'), U('1602216056096-3b40cc0c9944'), U('1587474260584-136574528ed5')],
  Japan: [U('1522383225653-ed111181a951'), U('1492571350019-22de08371fd3'), U('1493976040374-85c8e12f0c0e'), U('1490806843957-31f4c9a91c65'), U('1528360983277-13d401cdc186'), U('1540959733332-eab4deabeeaf')],
  Switzerland: [U('1530122037265-a5f1f91d3b99'), U('1467269204594-9661b134dd2b')],
  Italy: [U('1534445867742-43195f401b6c'), U('1523906834658-6e24ef2386f9'), U('1467269204594-9661b134dd2b')],
  'Northern Lights': [U('1483347756197-71ef80e95f73'), U('1476610182048-b716b8518aae'), U('1531366936337-7c912a4589a7')],
  'Australia & NZ': [U('1506973035872-a4ec16b8e8d9'), U('1469521669194-babb45599def'), U('1507699622108-4be3abd695ad')],
  'Africa Safari': [U('1516426122078-c23e76319801'), U('1547471080-7cc2caa01a7e')],
  'Southeast Asia': [U('1528181304800-259b08848526'), U('1546708973-b339540b5162')],
  Maldives: [U('1514282401047-d79a71a590e8'), U('1546708973-b339540b5162')],
  Europe: [U('1467269204594-9661b134dd2b'), U('1523906834658-6e24ef2386f9'), U('1543349689-9a4d426bee8e')],
  USA: [U('1501594907352-04cda38ebc29'), U('1503614472-8c93d56e92ce')],
};

const HERO_IMG = U('1493976040374-85c8e12f0c0e');

/* ---- The catalogue (shared with /journeys). ---- */
function buildGallery(o) {
  const pool = REGION_PHOTOS[o.regions[0]] || [];
  return [...new Set([o.image, ...pool])].slice(0, 5);
}
const J = (o) => ({
  ...o,
  priceLabel: `₹${o.price.toLocaleString('en-IN')}`,
  nightsLabel: `${o.nights} nights`,
  group: GROUP_BY_STYLE[o.style],
  tourType: tourTypeOf(o.style),
  gallery: buildGallery(o),
});
const ALL_JOURNEYS = [
  /* ---- India. Added so the "Indian Getaways" nav entry resolves to real
     journeys: the catalogue previously had no India inventory at all, so any
     India search (Rajasthan, Kerala, the Golden Triangle) dead-ended on
     "0 journeys". Priced and paced in line with the rest of the list. ---- */
  J({ id: 'in-golden', title: 'Golden Triangle & the Taj', blurb: 'Delhi, Agra and Jaipur: the Taj at sunrise, Amber Fort and the Pink City.', regions: ['India'], style: 'Group Tour', pace: 'Balanced', rating: 4.9, nights: 8, season: 'Oct–Mar', price: 95000, image: U('1564507592333-c60657eea523'), to: CALLBACK }),
  J({ id: 'in-rajasthan', title: 'Rajasthan: Palaces & Forts', blurb: 'Udaipur lake palaces, Jodhpur blue city and a night under the Thar desert sky.', regions: ['India'], style: 'Luxury', pace: 'Relaxed', rating: 4.9, nights: 10, season: 'Oct–Mar', price: 185000, image: U('1477587458883-47145ed94245'), to: CALLBACK }),
  J({ id: 'in-kerala', title: 'Kerala Backwaters & Coast', blurb: 'A private houseboat on the backwaters, tea country and a slow finish by the Arabian Sea.', regions: ['India'], style: 'Bespoke Private', pace: 'Relaxed', rating: 4.8, nights: 9, season: 'Sep–Mar', price: 120000, image: U('1602216056096-3b40cc0c9944'), to: CALLBACK }),
  J({ id: 'in-honeymoon', title: 'Udaipur & Ranthambore Honeymoon', blurb: 'A lake-palace suite, a private dinner on the water and tigers at first light.', regions: ['India'], style: 'Honeymoon', pace: 'Relaxed', rating: 4.9, nights: 7, season: 'Oct–Mar', price: 165000, image: U('1524492412937-b28074a5d7da'), to: CALLBACK }),
  J({ id: 'in-family', title: 'India for Families', blurb: 'Forts to climb, elephants to meet and a tiger safari, paced for younger travellers.', regions: ['India'], style: 'Family', pace: 'Relaxed', rating: 4.7, nights: 9, season: 'Oct–Mar', price: 110000, image: U('1587474260584-136574528ed5'), to: CALLBACK }),
  J({ id: 'jp-blossom', title: 'Cherry Blossom Japan', blurb: 'Two weeks, one fleeting bloom — Tokyo neon to Kyoto temple gardens, timed to the petals.', regions: ['Japan'], style: 'Group Tour', pace: 'Balanced', rating: 4.9, nights: 13, season: 'Mar–Apr', price: 295000, image: U('1522383225653-ed111181a951'), to: '/tour-detail-japan-5' }),
  J({ id: 'jp-first', title: 'Japan for First-Timers', blurb: 'Tokyo, Hakone and Kyoto with a private guide and a night in a traditional ryokan.', regions: ['Japan'], style: 'Bespoke Private', pace: 'Balanced', rating: 4.8, nights: 10, season: 'Any date', price: 310000, image: U('1492571350019-22de08371fd3'), to: '/tour-detail-japan-5' }),
  J({ id: 'jp-luxe', title: 'Japan: Ryokans & Art Islands', blurb: 'Slow luxury — design hotels, private onsen and the Naoshima art islands.', regions: ['Japan'], style: 'Luxury', pace: 'Relaxed', rating: 4.9, nights: 9, season: 'Year-round', price: 420000, image: U('1493976040374-85c8e12f0c0e'), to: '/tour-detail-japan-5' }),

  J({ id: 'ch-summer', title: 'Summer in Switzerland', blurb: 'Glacier trains and alpine lakes — Lucerne, Zermatt and the Jungfrau region.', regions: ['Switzerland', 'Europe'], style: 'Group Tour', pace: 'Relaxed', rating: 4.8, nights: 10, season: 'Jun–Sep', price: 245000, image: U('1530122037265-a5f1f91d3b99'), to: CALLBACK }),
  J({ id: 'ch-it-grand', title: 'Grand Switzerland & Italy', blurb: 'Lakeside Lucerne, the Matterhorn, then Venice to Rome — paced so you actually savour it.', regions: ['Switzerland', 'Italy', 'Europe'], style: 'Group Tour', pace: 'Balanced', rating: 4.7, nights: 13, season: 'Apr–Sep', price: 245000, image: U('1530122037265-a5f1f91d3b99'), to: CALLBACK }),
  J({ id: 'ch-rail', title: 'Swiss Alps Private Rail Journey', blurb: 'The Glacier Express and Bernina line, first-class, with elevated stays throughout.', regions: ['Switzerland', 'Europe'], style: 'Luxury', pace: 'Relaxed', rating: 4.9, nights: 8, season: 'May–Oct', price: 360000, image: U('1530122037265-a5f1f91d3b99'), to: CALLBACK }),

  J({ id: 'it-slow', title: 'Slow Italy: Coast to Art', blurb: 'Rome after-hours, a Tuscan villa and a hidden Amalfi cove — designed around you.', regions: ['Italy', 'Europe'], style: 'Bespoke Private', pace: 'Relaxed', rating: 4.8, nights: 9, season: 'Apr–Oct', price: 240000, image: U('1534445867742-43195f401b6c'), to: CALLBACK }),
  J({ id: 'it-amalfi', title: 'Amalfi & the Southern Coast', blurb: 'A private skipper, cliffside stays and long lunches above the Tyrrhenian.', regions: ['Italy', 'Europe'], style: 'Luxury', pace: 'Relaxed', rating: 4.8, nights: 7, season: 'May–Sep', price: 280000, image: U('1534445867742-43195f401b6c'), to: CALLBACK }),
  J({ id: 'it-family', title: 'Italy for Families', blurb: 'Gladiator schools in Rome, gelato trails and a slow Tuscan farmhouse week.', regions: ['Italy', 'Europe'], style: 'Family', pace: 'Relaxed', rating: 4.7, nights: 10, season: 'Apr–Oct', price: 215000, image: U('1534445867742-43195f401b6c'), to: CALLBACK }),

  J({ id: 'nl-chase', title: 'Chasing the Northern Lights', blurb: 'Arctic Scandinavia after dark — aurora hunts, huskies and snowbound nights.', regions: ['Northern Lights', 'Europe'], style: 'Group Tour', pace: 'Active', rating: 4.7, nights: 7, season: 'Oct–Mar', price: 275000, image: U('1483347756197-71ef80e95f73'), to: CALLBACK }),
  J({ id: 'nl-ice', title: 'Arctic Scandinavia & Ice Hotels', blurb: 'A night in an ice hotel, glass-roofed cabins and the aurora overhead.', regions: ['Northern Lights', 'Europe'], style: 'Luxury', pace: 'Balanced', rating: 4.8, nights: 8, season: 'Dec–Mar', price: 340000, image: U('1483347756197-71ef80e95f73'), to: CALLBACK }),

  J({ id: 'nz-road', title: 'New Zealand by Road', blurb: 'The South Island end to end — fjords, glaciers and open mountain roads.', regions: ['Australia & NZ'], style: 'Bespoke Private', pace: 'Active', rating: 4.9, nights: 12, season: 'Oct–Apr', price: 320000, image: U('1469521669194-babb45599def'), to: CALLBACK }),
  J({ id: 'au-family', title: 'Australia for Families', blurb: 'Reef, beaches and easy days — snorkelling, Rotorua and time to breathe.', regions: ['Australia & NZ'], style: 'Family', pace: 'Relaxed', rating: 4.7, nights: 14, season: 'Year-round', price: 340000, image: U('1506973035872-a4ec16b8e8d9'), to: CALLBACK }),

  J({ id: 'af-migration', title: 'African Safari: Great Migration', blurb: 'The Maasai Mara in migration season — game drives at first and last light.', regions: ['Africa Safari'], style: 'Group Tour', pace: 'Active', rating: 4.9, nights: 8, season: 'Jul–Oct', price: 310000, image: U('1516426122078-c23e76319801'), to: CALLBACK }),
  J({ id: 'af-private', title: 'Kenya Private Conservancy Safari', blurb: 'Private Maasai Mara camps, few vehicles and a naturalist to yourself.', regions: ['Africa Safari'], style: 'Safari', pace: 'Balanced', rating: 4.9, nights: 8, season: 'Jul–Oct', price: 420000, image: U('1516426122078-c23e76319801'), to: CALLBACK }),
  J({ id: 'af-tanzania', title: 'Tanzania: Serengeti & Ngorongoro', blurb: 'The Serengeti plains and the Ngorongoro crater, in classic tented camps.', regions: ['Africa Safari'], style: 'Safari', pace: 'Active', rating: 4.8, nights: 9, season: 'Jun–Oct', price: 380000, image: U('1547471080-7cc2caa01a7e'), to: CALLBACK }),
  J({ id: 'af-southafrica', title: 'South Africa: Cape & Kruger', blurb: 'Cape Town, the winelands and big-five days in a private Kruger reserve.', regions: ['Africa Safari'], style: 'Safari', pace: 'Balanced', rating: 4.7, nights: 11, season: 'Year-round', price: 325000, image: U('1516426122078-c23e76319801'), to: CALLBACK }),

  J({ id: 'eu-grand', title: 'Grand Europe', blurb: 'Many countries, one effortless journey — the classic capitals, seamlessly linked.', regions: ['Europe'], style: 'Group Tour', pace: 'Active', rating: 4.6, nights: 15, season: 'Apr–Sep', price: 185000, image: U('1467269204594-9661b134dd2b'), to: CALLBACK }),
  J({ id: 'eu-iberia', title: 'Portugal & Spain: Iberian Journey', blurb: 'Lisbon and Porto, Seville and Madrid — tiles, tapas and Atlantic light.', regions: ['Europe'], style: 'Group Tour', pace: 'Balanced', rating: 4.7, nights: 12, season: 'Apr–Oct', price: 195000, image: U('1467269204594-9661b134dd2b'), to: CALLBACK }),
  J({ id: 'eu-xmas', title: 'European Christmas Markets', blurb: 'Mulled wine and old-town lights across the festive heart of Europe.', regions: ['Europe'], style: 'Group Tour', pace: 'Balanced', rating: 4.7, nights: 9, season: 'Dec', price: 170000, image: U('1543349689-9a4d426bee8e'), to: CALLBACK }),

  J({ id: 'sea-islands', title: 'Islands & Temples of Southeast Asia', blurb: 'Bangkok street food, Angkor at dawn and slow days on the islands.', regions: ['Southeast Asia'], style: 'Bespoke Private', pace: 'Balanced', rating: 4.7, nights: 11, season: 'Year-round', price: 95000, image: U('1528181304800-259b08848526'), to: CALLBACK }),
  J({ id: 'sea-srilanka', title: 'Sri Lanka: Tea Trails & Coast', blurb: 'Hill-country tea estates, ancient cities and a slow finish by the sea.', regions: ['Southeast Asia'], style: 'Bespoke Private', pace: 'Relaxed', rating: 4.8, nights: 9, season: 'Year-round', price: 130000, image: U('1546708973-b339540b5162'), to: CALLBACK }),
  J({ id: 'sea-vietnam', title: 'Vietnam & Cambodia Discovery', blurb: 'Hanoi to Halong Bay, the Mekong and the temples of Angkor.', regions: ['Southeast Asia'], style: 'Group Tour', pace: 'Balanced', rating: 4.6, nights: 12, season: 'Oct–Apr', price: 120000, image: U('1528181304800-259b08848526'), to: CALLBACK }),

  J({ id: 'mv-overwater', title: 'Maldives Overwater Escape', blurb: 'Overwater calm — a private villa, a house reef and nowhere to be.', regions: ['Maldives'], style: 'Honeymoon', pace: 'Relaxed', rating: 4.9, nights: 5, season: 'Year-round', price: 140000, image: U('1514282401047-d79a71a590e8'), to: CALLBACK }),

  J({ id: 'us-coast', title: 'USA Coast to Coast', blurb: 'The great national parks and iconic cities, linked into one road-trip arc.', regions: ['USA'], style: 'Bespoke Private', pace: 'Active', rating: 4.7, nights: 14, season: 'May–Oct', price: 220000, image: U('1501594907352-04cda38ebc29'), to: CALLBACK }),
  J({ id: 'us-canada', title: 'Canadian Rockies & Rail', blurb: 'Banff, Lake Louise and the Rocky Mountaineer through the mountains.', regions: ['USA'], style: 'Group Tour', pace: 'Balanced', rating: 4.8, nights: 10, season: 'Jun–Sep', price: 295000, image: U('1503614472-8c93d56e92ce'), to: CALLBACK }),
];

/* ---- Budget bounds + price distribution, derived from the catalogue. ---- */
const _prices = ALL_JOURNEYS.map((j) => j.price);
const PRICE_MIN = Math.floor(Math.min(..._prices) / 10000) * 10000; // 90,000
const PRICE_MAX = Math.ceil(Math.max(..._prices) / 10000) * 10000;  // 420,000
const PRICE_STEP = 5000;

const fmtLakh = (v) => {
  const l = v / 100000;
  return `₹${(Number.isInteger(l) ? l : l.toFixed(1)).toString().replace(/\.0$/, '')}L`;
};

/* One-tap budget ceilings (only those inside the real price range show). */
const BUDGET_PRESETS = [
  { label: '≤ ₹1.5L', v: 150000 },
  { label: '≤ ₹2.5L', v: 250000 },
  { label: '≤ ₹3.5L', v: 350000 },
].filter((p) => p.v > PRICE_MIN && p.v < PRICE_MAX);

/* ---- Calendar constants for the travel-date picker. ---- */
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const FLEX_STEPS = [0, 2, 3, 4]; // days of ± flexibility

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

/* Trigger-label date format, e.g. "12 Aug". */
const fmtDate = (date) => `${date.d} ${MONTHS[date.m]}`;

/* ---------- Desktop nav megamenus — the /new3 navbar, verbatim ----------
   Same four groups, same blurbs, same rows, the same grouped "Destinations"
   menu with its catch-all, so the chrome does not change shape when a traveller
   crosses from the homepage into this listing.

   The one difference is forced: /new3's top-level entries point at ITS OWN
   sections (#paths, #destinations, #relaxed), and those sections do not exist
   here — left as bare hashes they would be dead links. They are rebased onto
   HOME, so they still land on the same section, on the page that has it. */
const NAV_MENU = [
  {
    label: 'Ways to travel', href: `${HOME}#paths`,
    blurb: 'Two ways to see the world. Pick the one that fits you.',
    items: [
      { label: 'Escorted group tours', desc: 'Expert-led, fixed departures', to: '/journeys4?style=Group Tour' },
      { label: 'Tailor-made journeys', desc: 'Designed entirely around you', to: '/journeys4?style=Bespoke Private' },
      { label: 'Luxury & private travel', desc: 'Elevated stays and guiding', to: '/journeys4?style=Luxury' },
      { label: 'Help me decide', desc: 'Talk it through with a specialist', to: CALLBACK },
    ],
  },
  {
    label: 'Destinations', href: `${HOME}#destinations`,
    blurb: 'Over 100 countries, shaped by specialists who know them first-hand.',
    items: [
      { group: 'By destination', label: 'Japan', desc: 'Cherry blossom to neon', to: '/journeys4?where=Japan' },
      { group: 'By destination', label: 'Switzerland', desc: 'Alpine railways & lakes', to: '/journeys4?where=Switzerland' },
      { group: 'By destination', label: 'Italy', desc: 'Cities, coast & countryside', to: '/journeys4?where=Italy' },
      { group: 'By destination', label: 'Northern Lights', desc: 'Arctic winter skies', to: '/journeys4?where=Northern Lights' },
      { group: 'By destination', label: 'African Safari', desc: 'Big-five wilderness', to: '/journeys4?where=Africa Safari' },
      { group: 'Signature journeys', label: 'Cherry Blossom Japan', desc: '13 nights · Mar–Apr', to: '/tour-detail-japan-5' },
      { group: 'Signature journeys', label: 'Relaxed-pace journeys', desc: 'A calm vacation, handled', to: '/journeys4?pace=Relaxed' },
    ],
    all: { label: 'All destinations', meta: '31 journeys', to: '/journeys4' },
  },
  {
    label: 'Indian Getaways', href: `${HOME}#relaxed`,
    blurb: 'Closer to home, and no less of a journey.',
    items: [
      { label: 'Golden Triangle & the Taj', desc: '8 nights · Delhi, Agra, Jaipur', to: '/journeys4?where=India&style=Group Tour' },
      { label: 'Rajasthan: palaces & forts', desc: 'Udaipur, Jodhpur & the Thar', to: '/journeys4?where=India&style=Luxury' },
      { label: 'Kerala backwaters', desc: 'Houseboats, tea country, coast', to: '/journeys4?where=India&style=Bespoke Private' },
    ],
    all: { label: 'All Indian journeys', meta: '5 journeys', to: '/journeys4?where=India' },
  },
  {
    label: 'About us', to: '/about-us2',
    blurb: 'Specialists, not salespeople, with 260 years behind every trip.',
    items: [
      { label: 'Our story', desc: 'Since 1758, and what came after', to: '/about-us2' },
      { label: 'Real reviews', desc: '2,400+ verified travellers', href: `${HOME}#reviews` },
      { label: 'As featured in', desc: 'The press that covers us', href: `${HOME}#press` },
      /* An action, not a page: opens the callback dialog in place. */
      { label: 'Talk to an expert', desc: 'Pick a time, we call you back', action: 'callback' },
    ],
  },
];

/* ---- Reduced-motion-safe reveal (matches /improved). ---- */
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

/* Word-by-word blur reveal for the display headline (matches /improved). */
function WordReveal({ text, className = '', accent = [], delay = 0 }) {
  const words = text.split(' ');
  const reduce = useReducedMotion();
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => (
        <span className="wr-wrap" key={i} aria-hidden="true">
          {reduce ? (
            <span className={`wr-word${accent.includes(i) ? ' wr-accent' : ''}`}>{w}</span>
          ) : (
            <motion.span
              className={`wr-word${accent.includes(i) ? ' wr-accent' : ''}`}
              initial={{ opacity: 0, y: '1em', filter: 'blur(12px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: delay + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
            >
              {w}
            </motion.span>
          )}{' '}
        </span>
      ))}
    </span>
  );
}

/* WhatsApp glyph (lucide has no brand icon) — used on the enquiry CTA. */
const WaIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.5A10 10 0 1 0 12 2zm0 18.3c-1.5 0-2.98-.4-4.27-1.16l-.3-.18-3.17 1 1.02-3.09-.2-.32A8.3 8.3 0 1 1 12 20.3z" />
    <path d="M17.5 14.4c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35z" />
  </svg>
);

/* A single journey card — reuses the .jl-card styles from Journeys.css.
   The card image is an inline carousel: prev/next arrows and dot markers
   let you flick through the gallery without leaving the listing (no more
   dead "N photos" label). */
function JourneyCard({ j, i, people = 1 }) {
  const waHref = `${CONTACT.whatsappHref}?text=${encodeURIComponent(`Hi Cox & Kings, I'd like to enquire about the "${j.title}" journey.`)}`;
  const isGroup = j.tourType === 'Group Tour';
  const shots = j.gallery;
  const many = shots.length > 1;
  const [shot, setShot] = useState(0);
  /* Arrows sit above the itinerary link — stop them navigating / bubbling. */
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
          <span><Gauge size={14} aria-hidden="true" /> {j.pace} pace</span>
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
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="jl-cbtn jl-cbtn-wa"
              aria-label={`Enquire about ${j.title} on WhatsApp`}
            >
              <WaIcon size={15} /> Enquire Now
            </a>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* Photo lightbox — cycles a tour's gallery without leaving the listing. */
function Lightbox({ data, onClose }) {
  const { title, photos } = data;
  const [idx, setIdx] = useState(data.index || 0);
  const dialogRef = useRef(null);

  const go = useCallback((dir) => setIdx((n) => (n + dir + photos.length) % photos.length), [photos.length]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    };
    document.addEventListener('keydown', onKey);
    dialogRef.current?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [go, onClose]);

  return (
    <motion.div
      className="jl-lb"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Photos of ${title}`}
    >
      <div className="jl-lb-top" onClick={(e) => e.stopPropagation()}>
        <span className="jl-lb-title">{title}</span>
        <span className="jl-lb-count">{idx + 1} / {photos.length}</span>
        <button type="button" className="jl-lb-close" onClick={onClose} aria-label="Close photos"><X size={22} /></button>
      </div>
      <div className="jl-lb-stage" onClick={(e) => e.stopPropagation()} ref={dialogRef} tabIndex={-1}>
        <button type="button" className="jl-lb-nav jl-lb-prev" onClick={() => go(-1)} aria-label="Previous photo"><ChevronLeft size={26} /></button>
        <AnimatePresence mode="wait">
          <motion.img
            key={idx}
            src={img(photos[idx], 1400)}
            alt={`${title} — photo ${idx + 1}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          />
        </AnimatePresence>
        <button type="button" className="jl-lb-nav jl-lb-next" onClick={() => go(1)} aria-label="Next photo"><ChevronRight size={26} /></button>
      </div>
      <div className="jl-lb-thumbs" onClick={(e) => e.stopPropagation()}>
        {photos.map((p, k) => (
          <button
            key={p + k}
            type="button"
            className={`jl-lb-thumb${k === idx ? ' is-on' : ''}`}
            onClick={() => setIdx(k)}
            aria-label={`Photo ${k + 1}`}
            aria-current={k === idx}
          >
            <img src={img(p, 200)} alt="" />
          </button>
        ))}
      </div>
    </motion.div>
  );
}

/* A single open filter group in the sidebar — a labelled section with a
   list of always-visible checkbox rows. Each row shows a live count of
   how many journeys would match it. Uses role="group" + aria-labelledby
   (rather than fieldset/legend) so the vertical rhythm is fully in our
   control — native legends inject unpredictable spacing. */
function FilterGroup({ id, title, icon: Icon, options, selected, onToggle, counts }) {
  const labelId = `j2grp-${id}`;
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
              <input
                type="checkbox"
                checked={on}
                onChange={() => onToggle(opt.value)}
              />
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

/* Wrapper that gives a control the same eyebrow + rhythm as FilterGroup. */
function FilterField({ id, title, icon: Icon, children, aside }) {
  const labelId = `j2grp-${id}`;
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

/* Searchable destination combobox. Typing filters a suggestion list;
   focusing the empty field shows all destinations. Picks become chips. */
function DestinationSearch({ selected, onToggle, counts }) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrapRef = useRef(null);

  useEffect(() => {
    const onDoc = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const suggestions = REGIONS.filter(
    (r) => !selected.includes(r) && r.toLowerCase().includes(q.trim().toLowerCase())
  );

  const pick = (r) => { onToggle(r); setQ(''); setActive(0); };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setActive((a) => Math.min(a + 1, suggestions.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === 'Enter' && suggestions[active]) { e.preventDefault(); pick(suggestions[active]); }
    else if (e.key === 'Escape') { setOpen(false); }
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
          placeholder={selected.length ? 'Add another destination…' : 'Search destinations…'}
          aria-label="Search destinations"
          aria-expanded={open}
          role="combobox"
          aria-controls="j2-dest-list"
          autoComplete="off"
        />
      </div>

      {open && suggestions.length > 0 && (
        <ul className="j2-dest-pop" id="j2-dest-list" role="listbox">
          {suggestions.map((r, i) => (
            <li key={r}>
              <button
                type="button"
                role="option"
                aria-selected={i === active}
                className={`j2-dest-opt${i === active ? ' is-active' : ''}`}
                onMouseEnter={() => setActive(i)}
                onClick={() => pick(r)}
              >
                <MapPin size={14} aria-hidden="true" />
                <span className="j2-dest-opt-label">{r}</span>
                {counts && <span className="j2-option-count">{counts[r] ?? 0}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}

      {selected.length > 0 && (
        <div className="j2-dest-chips">
          {selected.map((r) => (
            <button key={r} type="button" className="j2-dest-chip" onClick={() => onToggle(r)} aria-label={`Remove ${r}`}>
              {r} <X size={13} aria-hidden="true" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* Budget = a single "up to" ceiling. A price-distribution skyline sits
   behind a chunky one-thumb slider; bars fade past the ceiling. Preset
   pills give one-tap common maxes. Far easier to grab than a hairline. */
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
          <button
            key={p.v}
            type="button"
            className={`j2-preset${value === p.v ? ' is-on' : ''}`}
            onClick={() => onChange(p.v)}
          >
            {p.label}
          </button>
        ))}
        <button
          type="button"
          className={`j2-preset${isAny ? ' is-on' : ''}`}
          onClick={() => onChange(max)}
        >
          Any
        </button>
      </div>
    </div>
  );
}

/* A calendar popover for choosing a travel date, with ±2/3/4-day
   flexibility chips. Selecting a date filters journeys whose season
   covers the chosen window. Everything closes on outside-click / Escape. */
function TravelDatePicker({ date, flex, onChange }) {
  const [open, setOpen] = useState(false);
  const now = new Date();
  const [view, setView] = useState(() => (date ? { y: date.y, m: date.m } : { y: now.getFullYear(), m: now.getMonth() }));
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
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

  /* Leading blanks (Mon-based) + the month's days. */
  const firstDow = (new Date(view.y, view.m, 1).getDay() + 6) % 7;
  const daysIn = new Date(view.y, view.m + 1, 0).getDate();
  const cells = [...Array(firstDow).fill(null), ...Array.from({ length: daysIn }, (_, i) => i + 1)];
  const todayKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;

  const label = date ? `${fmtDate(date)}${flex ? ` · ±${flex}d` : ''}` : 'Any dates';

  return (
    <div className="j2-cal" ref={ref}>
      <button
        type="button"
        className={`j2-cal-trigger${date ? ' has-date' : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
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
                <button
                  key={f}
                  type="button"
                  className={`j2-flexchip${flex === f ? ' is-on' : ''}`}
                  onClick={() => onChange(date, f)}
                >
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

/* Plus / minus stepper for a labelled count (e.g. adults, children). */
function Stepper({ value, min, max, onChange, label, sub }) {
  return (
    <div className="j2-stepper-row">
      <span className="j2-stepper-label">
        {label}
        {sub && <small>{sub}</small>}
      </span>
      <div className="j2-stepper">
        <button
          type="button" className="j2-step-btn"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={`Fewer ${label.toLowerCase()}`}
        >
          <Minus size={16} aria-hidden="true" />
        </button>
        <span className="j2-step-val" aria-live="polite">{value}</span>
        <button
          type="button" className="j2-step-btn"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label={`More ${label.toLowerCase()}`}
        >
          <Plus size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export default function Journeys4() {
  const [params, setParams] = useSearchParams();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  /* Which NAV_MENU group is expanded in the mobile drawer (one at a time). */
  const [mobileSection, setMobileSection] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false); // mobile filter drawer
  const [lightbox, setLightbox] = useState(null);

  /* Multi-select filter state — arrays. Destinations & styles seed from URL. */
  const seedList = (key, valid) => {
    const raw = params.getAll(key);
    const flat = raw.flatMap((v) => v.split(',')).map((v) => v.trim()).filter(Boolean);
    return flat.filter((v) => valid.includes(v));
  };
  const [query, setQuery] = useState(() => params.get('q') || '');
  const [regions, setRegions] = useState(() => seedList('where', REGIONS));
  const [styles, setStyles] = useState(() => seedList('style', STYLES));
  const [budgetMax, setBudgetMax] = useState(() => {
    const n = parseInt(params.get('budget'), 10);
    return Number.isFinite(n) && n >= PRICE_MIN && n <= PRICE_MAX ? n : PRICE_MAX;
  });
  const [adults, setAdults] = useState(() => {
    const n = parseInt(params.get('adults'), 10);
    return Number.isFinite(n) && n >= 1 && n <= 12 ? n : 2;
  });
  const [children, setChildren] = useState(() => {
    const n = parseInt(params.get('children'), 10);
    return Number.isFinite(n) && n >= 0 && n <= 10 ? n : 0;
  });
  const people = adults + children;
  /* Travel date {y,m,d}|null + ± flexibility in days. Seeds from ?when=YYYY-MM-DD&flex=N */
  const [travelDate, setTravelDate] = useState(() => {
    const m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(params.get('when') || '');
    if (!m) return null;
    const y = +m[1], mo = +m[2] - 1, d = +m[3];
    return mo >= 0 && mo <= 11 && d >= 1 && d <= 31 ? { y, m: mo, d } : null;
  });
  const [flex, setFlex] = useState(() => {
    const f = parseInt(params.get('flex'), 10);
    return FLEX_STEPS.includes(f) ? f : 0;
  });
  const setDate = useCallback((date, f) => { setTravelDate(date); setFlex(f || 0); }, []);
  const [paces, setPaces] = useState(() => seedList('pace', PACES));
  const [sort, setSort] = useState('recommended');
  const [sortOpen, setSortOpen] = useState(false);

  const sortRef = useRef(null);
  const prefersReduced = useReducedMotion();

  const openPhotos = useCallback((j) => setLightbox({ title: j.title, photos: j.gallery, index: 0 }), []);

  /* Toggle helper for a value inside an array state. */
  const toggler = (setter) => (value) =>
    setter((cur) => (cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value]));

  /* Nav goes solid once the page scrolls off the dark banner. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Lock body scroll while the mobile menu, filter drawer or lightbox is open. */
  useEffect(() => {
    const lock = menuOpen || filtersOpen || !!lightbox;
    document.body.style.overflow = lock ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen, filtersOpen, lightbox]);

  /* Reset the drawer's open section when it closes. */
  useEffect(() => { if (!menuOpen) setMobileSection(null); }, [menuOpen]);

  /* "Talk to an expert" in the nav and drawer opens the site-wide
     schedule-a-call dialog (the one <ScheduleCallProvider> owns), exactly as
     /new3's chrome does. */
  const openScheduleCall = useScheduleCall();
  const openNavCallback = useCallback(() => { setMenuOpen(false); openScheduleCall(); }, [openScheduleCall]);

  /* Close the sort menu on outside click / Escape. */
  useEffect(() => {
    if (!sortOpen) return;
    const onDoc = (e) => { if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setSortOpen(false); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, [sortOpen]);

  /* Keep the URL shareable in sync with the active filters. */
  useEffect(() => {
    const next = {};
    if (query.trim()) next.q = query.trim();
    if (regions.length) next.where = regions.join(',');
    if (styles.length) next.style = styles.join(',');
    if (budgetMax < PRICE_MAX) next.budget = String(budgetMax);
    if (adults !== 2) next.adults = String(adults);
    if (children !== 0) next.children = String(children);
    if (travelDate) {
      next.when = `${travelDate.y}-${travelDate.m + 1}-${travelDate.d}`;
      if (flex) next.flex = String(flex);
    }
    if (paces.length) next.pace = paces.join(',');
    setParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, regions, styles, budgetMax, adults, children, travelDate, flex, paces]);

  /* Months touched by the chosen date ± flex — recomputed only when either changes. */
  const dateMonths = useMemo(() => dateWindowMonths(travelDate, flex), [travelDate, flex]);

  /* Does a journey pass every active filter group? (AND across groups,
     OR within a group.) `skip` lets us drop one group when counting. */
  const passes = useCallback((j, skip) => {
    const q = query.trim().toLowerCase();
    if (skip !== 'q' && q) {
      const hay = `${j.title} ${j.blurb} ${j.regions.join(' ')} ${j.style} ${j.pace} ${j.season}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (skip !== 'where' && regions.length && !regions.some((r) => j.regions.includes(r))) return false;
    if (skip !== 'style' && styles.length && !styles.includes(j.style)) return false;
    if (skip !== 'pace' && paces.length && !paces.includes(j.pace)) return false;
    if (skip !== 'budget' && j.price > budgetMax) return false;
    if (skip !== 'when' && dateMonths && !dateMonths.some((mo) => monthInSeason(mo, j.season))) return false;
    return true;
  }, [query, regions, styles, paces, budgetMax, dateMonths]);

  /* The filtered + sorted result set. */
  const results = useMemo(() => {
    let list = ALL_JOURNEYS.filter((j) => passes(j));
    const by = {
      'price-asc': (a, b) => a.price - b.price,
      'price-desc': (a, b) => b.price - a.price,
      'nights-desc': (a, b) => b.nights - a.nights,
    }[sort];
    if (by) list = [...list].sort(by);
    return list;
  }, [passes, sort]);

  /* Per-option counts — how many journeys each option adds, holding the
     OTHER groups fixed (so the number reflects what you'd actually get). */
  const counts = useMemo(() => {
    const count = (skip, matcher) => {
      const base = ALL_JOURNEYS.filter((j) => passes(j, skip));
      const out = {};
      for (const [value, test] of matcher) out[value] = base.filter(test).length;
      return out;
    };
    return {
      where: count('where', REGIONS.map((r) => [r, (j) => j.regions.includes(r)])),
      pace: count('pace', PACES.map((p) => [p, (j) => j.pace === p])),
      style: count('style', STYLES.map((s) => [s, (j) => j.style === s])),
    };
  }, [passes]);

  const budgetActive = budgetMax < PRICE_MAX;
  const totalActive =
    (query.trim() ? 1 : 0) + regions.length + styles.length + paces.length +
    (budgetActive ? 1 : 0) + (travelDate ? 1 : 0);

  const clearAll = () => {
    setQuery(''); setRegions([]); setStyles([]); setPaces([]);
    setBudgetMax(PRICE_MAX); setTravelDate(null); setFlex(0); setAdults(2); setChildren(0);
  };

  const sortLabel = SORTS.find((s) => s.key === sort)?.label;

  /* The whole sidebar body — shared by the desktop rail and mobile drawer. */
  const filterBody = (
    <>
      <FilterField id="dest" title="Destination" icon={MapPin}>
        <DestinationSearch selected={regions} onToggle={toggler(setRegions)} counts={counts.where} />
      </FilterField>

      <FilterField id="budget" title="Budget (per person)" icon={Wallet}>
        <BudgetPicker
          value={budgetMax} min={PRICE_MIN} max={PRICE_MAX} step={PRICE_STEP}
          onChange={setBudgetMax}
        />
      </FilterField>

      <FilterField id="people" title="Travellers" icon={Users}>
        <div className="j2-steppers">
          <Stepper label="Adults" sub="12+ yrs" value={adults} min={1} max={12} onChange={setAdults} />
          <Stepper label="Children" sub="2–11 yrs" value={children} min={0} max={10} onChange={setChildren} />
        </div>
      </FilterField>

      <FilterField id="dur" title="When you'll travel" icon={CalendarRange}>
        <TravelDatePicker date={travelDate} flex={flex} onChange={setDate} />
      </FilterField>

      <FilterGroup
        id="pace" title="Pace" icon={Gauge}
        options={PACES.map((p) => ({ value: p, label: `${p} pace` }))}
        selected={paces} onToggle={toggler(setPaces)} counts={counts.pace}
      />
      <FilterGroup
        id="style" title="Trip style" icon={Compass}
        options={STYLES.map((s) => ({ value: s, label: s }))}
        selected={styles} onToggle={toggler(setStyles)} counts={counts.style}
      />
    </>
  );

  return (
    <div className="h26 jl jl2 jl4">
      <a className="h26-skip" href="#results">Skip to journeys</a>

      {/* ---------- NAV + MOBILE MENU (the /new3 chrome, verbatim) ----------
           `new-typo n3` are what NewTypography.css and New3.css hang their rules
           off, and `h26` is what NewTypography's `.h26.new-typo` var block needs
           on the same element. All three are scoped, so putting them on this
           chrome-only wrapper (rather than the page root) styles the header and
           the drawer and nothing else on the page. */}
      <div className="h26 new-typo n3">
        <header className={`h26-nav${scrolled ? ' is-solid' : ''}`}>
          <Link to={HOME} className="h26-brand" aria-label="Cox & Kings — home">
            <img src="/cox-logo-new.png" alt="Cox & Kings" />
          </Link>
          <nav className="h26-links hi-nav" aria-label="Primary">
            {NAV_MENU.map((group) => (
              <div className="hi-nav-group" key={group.label}>
                {group.to ? (
                  <Link to={group.to} className="hi-nav-top" aria-haspopup="true">
                    {group.label}
                    <ChevronDown size={14} className="hi-nav-caret" aria-hidden="true" />
                  </Link>
                ) : (
                  <a href={group.href} className="hi-nav-top" aria-haspopup="true">
                    {group.label}
                    <ChevronDown size={14} className="hi-nav-caret" aria-hidden="true" />
                  </a>
                )}
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
                            {it.action === 'callback' ? (
                              <button type="button" role="menuitem" className="hi-nav-item n3-nav-action" onClick={openNavCallback}>
                                <span className="hi-nav-item-label">{it.label}</span>
                                <span className="hi-nav-item-desc">{it.desc}</span>
                              </button>
                            ) : it.to ? (
                              <Link to={it.to} role="menuitem" className="hi-nav-item">
                                <span className="hi-nav-item-label">{it.label}</span>
                                <span className="hi-nav-item-desc">{it.desc}</span>
                              </Link>
                            ) : (
                              <a href={it.href} role="menuitem" className="hi-nav-item">
                                <span className="hi-nav-item-label">{it.label}</span>
                                <span className="hi-nav-item-desc">{it.desc}</span>
                              </a>
                            )}
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
              </div>
            ))}
          </nav>
          <div className="h26-nav-cta">
            <a href={CONTACT.phoneHref} className="h26-phone">
              <Phone size={15} /> <span>{CONTACT.phoneDisplay}</span>
            </a>
            <Link to={CALLBACK} className="h26-btn h26-btn-pill">Talk to an expert</Link>
            <button className="h26-burger" aria-label="Menu" onClick={() => setMenuOpen(true)}>
              <Menu size={22} />
            </button>
          </div>
        </header>

        {/* Mobile slide-in menu — driven by the SAME NAV_MENU as the desktop
            flyouts, so the two cannot drift apart. One section open at a time. */}
        <div className={`h26-menu${menuOpen ? ' is-open' : ''}`} aria-hidden={!menuOpen}>
          <div className="h26-menu-scrim" onClick={() => setMenuOpen(false)} />
          <div className="h26-menu-panel" role="dialog" aria-modal="true" aria-label="Menu">
            <div className="h26-menu-top">
              <button className="h26-menu-close" aria-label="Close menu" onClick={() => setMenuOpen(false)}><X size={20} /></button>
              <img className="h26-menu-logo" src="/cox-logo-new.png" alt="Cox & Kings — Est. 1758" />
            </div>
            <nav className="h26-menu-primary n3-macc" aria-label="Mobile primary">
              {NAV_MENU.map((g) => {
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
                      {g.items.map((it, idx) => (
                        <Fragment key={it.label}>
                          {it.group && g.items[idx - 1]?.group !== it.group && (
                            <span className="n3-macc-group">{it.group}</span>
                          )}
                          {it.action === 'callback' ? (
                            <button type="button" className="n3-macc-link n3-nav-action" onClick={openNavCallback}>
                              <span className="n3-macc-lbl">{it.label}</span>
                              <span className="n3-macc-desc">{it.desc}</span>
                            </button>
                          ) : it.to ? (
                            <Link to={it.to} className="n3-macc-link" onClick={() => setMenuOpen(false)}>
                              <span className="n3-macc-lbl">{it.label}</span>
                              <span className="n3-macc-desc">{it.desc}</span>
                            </Link>
                          ) : (
                            <a href={it.href} className="n3-macc-link" onClick={() => setMenuOpen(false)}>
                              <span className="n3-macc-lbl">{it.label}</span>
                              <span className="n3-macc-desc">{it.desc}</span>
                            </a>
                          )}
                        </Fragment>
                      ))}
                      {g.all && (
                        <Link to={g.all.to} className="n3-navall n3-macc-all" onClick={() => setMenuOpen(false)}>
                          <span className="n3-navall-label">{g.all.label}</span>
                          <span className="n3-navall-meta">{g.all.meta}</span>
                          <ArrowRight size={15} className="n3-navall-arrow" aria-hidden="true" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
              {/* The two rows with no submenu to open. On /new3 they scroll the
                  page; from here they land on the homepage's own sections. */}
              {[{ label: 'Clips', href: `${HOME}#reels` }, { label: 'Reviews', href: `${HOME}#reviews` }].map((n) => (
                <a key={n.label} href={n.href} className="n3-macc-plain" onClick={() => setMenuOpen(false)}>
                  {n.label}
                  <span className="h26-menu-chev"><ArrowRight size={16} /></span>
                </a>
              ))}
            </nav>
            <div className="h26-menu-divider" />
            <div className="h26-menu-secondary">
              <Link to="/journeys4" onClick={() => setMenuOpen(false)}>All journeys <ArrowUpRight size={13} /></Link>
              <Link to="/journeys4" onClick={() => setMenuOpen(false)}>Destinations <ArrowUpRight size={13} /></Link>
              <Link to="/about-us2" onClick={() => setMenuOpen(false)}>Our story <ArrowUpRight size={13} /></Link>
              <Link to={CALLBACK} onClick={() => setMenuOpen(false)}>Contact <ArrowUpRight size={13} /></Link>
            </div>
            <button type="button" className="h26-btn h26-btn-pill h26-menu-cta" onClick={openNavCallback}>
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

      {/* ---------- COMPACT HERO BANNER + SEARCH ---------- */}
      <section className="jl-hero jl2-hero">
        <div className="jl-hero-bg" style={{ backgroundImage: `url(${img(HERO_IMG, 1800)})` }} aria-hidden="true" />
        <div className="jl-hero-veil" aria-hidden="true" />
        <div className="jl-hero-inner">
          <Reveal className="h26-label jl-hero-eyebrow" as="p">
            {ALL_JOURNEYS.length} handcrafted journeys · 100+ countries
          </Reveal>
          <h1 className="jl-hero-title">
            <WordReveal text="Find your journey" accent={[2]} />
          </h1>
          <Reveal className="jl-hero-sub" as="p" delay={0.15}>
            Filter by where you're headed, what you'll spend and how you like to travel —
            everything's on the left, nothing hidden behind a menu.
          </Reveal>

          {/* Big search field */}
          <motion.div
            className="jl-search"
            initial={prefersReduced ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="jl-search-field">
              <Search size={19} aria-hidden="true" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search a destination or journey — “Japan”, “safari”, “ryokan”…"
                aria-label="Search journeys"
                autoComplete="off"
              />
              {query && (
                <button type="button" className="jl-search-clear" aria-label="Clear search" onClick={() => setQuery('')}>
                  <X size={16} />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------- TWO-COLUMN LAYOUT: filters + results ---------- */}
      <main className="jl2-shell" id="results">
        {/* Mobile filter trigger + result count bar */}
        <div className="jl2-mobilebar">
          <button type="button" className="jl2-filter-toggle" onClick={() => setFiltersOpen(true)}>
            <SlidersHorizontal size={16} aria-hidden="true" />
            Filters
            {totalActive > 0 && <span className="jl2-filter-badge">{totalActive}</span>}
          </button>
          <span className="jl2-mobile-count"><strong>{results.length}</strong> journeys</span>
        </div>

        {/* ----- LEFT: open filter sidebar (a drawer on mobile) ----- */}
        <aside className={`jl2-sidebar${filtersOpen ? ' is-open' : ''}`} aria-label="Filter journeys">
          <div className="jl2-sidebar-scrim" onClick={() => setFiltersOpen(false)} />
          <div className="jl2-sidebar-panel">
            <div className="jl2-sidebar-head">
              <h2 className="jl2-sidebar-title"><SlidersHorizontal size={17} aria-hidden="true" /> Filters</h2>
              {totalActive > 0 && (
                <button type="button" className="jl2-clear" onClick={clearAll}>Clear all</button>
              )}
              <button type="button" className="jl2-sidebar-close" aria-label="Close filters" onClick={() => setFiltersOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="jl2-sidebar-body">
              {filterBody}
            </div>

            <div className="jl2-sidebar-foot">
              <button type="button" className="h26-btn h26-btn-pill jl2-apply" onClick={() => setFiltersOpen(false)}>
                Show {results.length} {results.length === 1 ? 'journey' : 'journeys'}
              </button>
            </div>
          </div>
        </aside>

        {/* ----- RIGHT: results ----- */}
        <section className="jl2-results">
          <div className="jl2-results-head">
            <p className="jl-count" aria-live="polite">
              <strong>{results.length}</strong> {results.length === 1 ? 'journey' : 'journeys'}
              {regions.length ? ` · ${regions.length === 1 ? regions[0] : `${regions.length} destinations`}` : ''}
            </p>
            <div className="jl-sort" ref={sortRef}>
              <button
                type="button"
                className="jl-sort-btn"
                onClick={() => setSortOpen((o) => !o)}
                aria-haspopup="listbox"
                aria-expanded={sortOpen}
              >
                <SlidersHorizontal size={15} aria-hidden="true" />
                <span>{sortLabel}</span>
                <ChevronDown size={14} aria-hidden="true" />
              </button>
              {sortOpen && (
                <ul className="jl-sort-pop" role="listbox">
                  {SORTS.map((s) => (
                    <li key={s.key}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={sort === s.key}
                        className={`jl-sort-opt${sort === s.key ? ' is-on' : ''}`}
                        onClick={() => { setSort(s.key); setSortOpen(false); }}
                      >
                        {s.label}
                        {sort === s.key && <Check size={15} aria-hidden="true" />}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Active filter chips */}
          {totalActive > 0 && (
            <div className="jl-active jl2-active">
              {query.trim() && (
                <button type="button" className="jl-active-chip" onClick={() => setQuery('')}>
                  “{query.trim()}” <X size={13} />
                </button>
              )}
              {regions.map((r) => (
                <button key={r} type="button" className="jl-active-chip" onClick={() => toggler(setRegions)(r)}>{r} <X size={13} /></button>
              ))}
              {budgetActive && (
                <button type="button" className="jl-active-chip" onClick={() => setBudgetMax(PRICE_MAX)}>
                  Up to {fmtLakh(budgetMax)} <X size={13} />
                </button>
              )}
              {travelDate && (
                <button type="button" className="jl-active-chip" onClick={() => setDate(null, 0)}>
                  {fmtDate(travelDate)}{flex ? ` ±${flex}d` : ''} <X size={13} />
                </button>
              )}
              {styles.map((s) => (
                <button key={s} type="button" className="jl-active-chip" onClick={() => toggler(setStyles)(s)}>{s} <X size={13} /></button>
              ))}
              {paces.map((p) => (
                <button key={p} type="button" className="jl-active-chip" onClick={() => toggler(setPaces)(p)}>{p} pace <X size={13} /></button>
              ))}
              <button type="button" className="jl-clear-all" onClick={clearAll}>Clear all</button>
            </div>
          )}

          {results.length > 0 ? (
            <div className="jl-grid jl2-grid">
              {results.map((j, i) => <JourneyCard key={j.id} j={j} i={i} onPhotos={openPhotos} people={people} />)}
            </div>
          ) : (
            <div className="jl-empty">
              <span className="jl-empty-icon"><Compass size={30} aria-hidden="true" /></span>
              <h2>No journeys match just yet</h2>
              <p>
                We run trips to over 100 countries and design tailor-made holidays anywhere.
                Loosen a filter, or tell a specialist where you'd like to go — we'll build it.
              </p>
              <div className="jl-empty-actions">
                <button type="button" className="h26-btn h26-btn-pill jl-btn-solid" onClick={clearAll}>Clear filters</button>
                <a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer" className="h26-btn jl-btn-ghost">
                  <MessageCircle size={16} /> Ask a specialist
                </a>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* ---------- CLOSING CTA ---------- */}
      <section className="jl-cta">
        <div className="jl-cta-bg" style={{ backgroundImage: `url(${img(HERO_IMG, 1800)})` }} aria-hidden="true" />
        <div className="jl-cta-veil" aria-hidden="true" />
        <div className="jl-cta-inner">
          <Reveal className="h26-label jl-cta-eyebrow" as="span">Can't see quite the right one?</Reveal>
          <Reveal as="h2" className="jl-cta-title" delay={0.05}>
            Tell us how you like to travel.<br /><strong>We'll design the journey around you.</strong>
          </Reveal>
          <Reveal className="jl-cta-actions" delay={0.12}>
            <a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer" className="h26-btn h26-btn-accent h26-btn-lg"><MessageCircle size={17} /> WhatsApp us</a>
            <Link to={CALLBACK} className="h26-btn h26-btn-glass h26-btn-lg"><PhoneCall size={16} /> Schedule a callback</Link>
          </Reveal>
          <Reveal as="p" className="jl-cta-hours" delay={0.18}>Travel experts available 9am–9pm IST, every day.</Reveal>
        </div>
      </section>

      {/* ---------- FOOTER (the /new3 footer, verbatim) ----------
           Same wrapper as the header: .h26 carries the colour tokens the
           footer's rules resolve against, `new-typo n3` the type and the gutter.
           Its in-page anchors are rebased onto HOME for the same reason as the
           nav's — #heritage and #reviews live on the homepage. */}
      <div className="h26 new-typo n3">
        <footer className="h26-footer">
          <div className="h26-footer-top">
            <div className="h26-footer-brand">
              <img src="/cox-logo-new.png" alt="Cox & Kings" />
              <p>The world's most experienced travel company. Established 1758.</p>
              <div className="h26-footer-contact">
                <a href={CONTACT.phoneHref}><Phone size={15} /> {CONTACT.phoneDisplay}</a>
                <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
              </div>
            </div>
            <div className="h26-footer-cols">
              <div>
                <h4>Travel</h4>
                <Link to="/journeys4">Group tours</Link>
                <Link to={CALLBACK}>Bespoke holidays</Link>
                <Link to="/journeys4">Luxury journeys</Link>
                <Link to="/journeys4">Destinations</Link>
              </div>
              <div>
                <h4>Company</h4>
                <Link to="/about-us2">Our story</Link>
                <Link to="/about-us2">Specialists</Link>
                <Link to={CALLBACK}>Contact</Link>
                <a href={`${HOME}#heritage`}>Why Cox &amp; Kings</a>
              </div>
              <div>
                <h4>Assurance</h4>
                <a href={`${HOME}#heritage`}>Trust &amp; safety</a>
                <a href={`${HOME}#reviews`}>Reviews</a>
                <Link to={CALLBACK}>Refund policy</Link>
                <Link to={CALLBACK}>Speak to an expert</Link>
              </div>
            </div>
          </div>
          <div className="h26-footer-bottom">
            <span>© {new Date().getFullYear()} Cox &amp; Kings. Travelling the world since 1758.</span>
            <span className="h26-footer-assoc">IATA · TAAI · ASTA</span>
          </div>
        </footer>
      </div>

      {/* ---------- PHOTO LIGHTBOX ---------- */}
      <AnimatePresence>
        {lightbox && <Lightbox data={lightbox} onClose={() => setLightbox(null)} />}
      </AnimatePresence>
    </div>
  );
}
