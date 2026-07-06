/* ============================================================
   Journeys — the tour LISTING page for Cox & Kings.

   Reached when a traveller clicks a destination name or runs a
   search on /improved. Shows every available journey, organised
   into browsable themed collections (Guided group tours, Relaxed
   pace, Tailor-made, Luxury, Safari, Family & honeymoon) when no
   filter is active — and a flat, filterable/sortable grid the
   moment a destination, style, pace or search is applied.

   Each card carries a few at-a-glance details (nights, season,
   pace, group size, rating) and a "photos" control that opens a
   lightbox gallery of that tour — without leaving the listing.

   Design language: shares the /improved chrome exactly — the same
   fixed Voyager-Blue nav (transparent over a dark banner, solid on
   scroll), Zodiak serif headings, warm-paper surfaces and the
   design.md token set. Self-contained: brings its own nav + footer.
   ============================================================ */
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import {
  Phone, PhoneCall, MessageCircle, ArrowUpRight, ArrowRight, Search, MapPin,
  Compass, Calendar, Menu, X, ChevronDown, ChevronLeft, ChevronRight,
  Star, SlidersHorizontal, Clock, Users, Gauge, Images, Sparkles,
  Instagram, Facebook, Youtube, Linkedin, Check,
} from 'lucide-react';
import { img, RATING, REVIEWS } from '../data/v3content';
import './Home2026.css';
import './Home2026Improved.css';
import './Journeys.css';

/* /improved-scoped direct line (matches Home2026Improved). */
const CONTACT = {
  phoneDisplay: '+91 8556001700',
  phoneHref: 'tel:+918556001700',
  whatsappHref: 'https://wa.me/918556001700',
  email: 'journeys@coxandkings.com',
};

/* Reviewer faces — Indian portraits to match the (Indian) names, mirroring
   the /improved review strip so the two pages read consistently. */
const IMP_REVIEW_AVATARS = {
  'Anjali & Rohan Mehta': 'https://images.unsplash.com/photo-1628264047320-49bab8dc07d6',
  'Suresh Iyer': 'https://images.unsplash.com/photo-1624202090198-d6f758540f18',
  'Priya Nair': 'https://images.unsplash.com/photo-1496813146940-1601b02f81a4',
  'The Kapoor Family': 'https://images.unsplash.com/photo-1596604820148-da737958af16',
};
const REVIEWS_IMP = REVIEWS.map((r) => ({ ...r, avatar: IMP_REVIEW_AVATARS[r.name] || r.avatar }));

/* Brand marks for the review-trust strip (inline — no asset deps). */
const GoogleG = () => (
  <svg viewBox="0 0 48 48" width="18" height="18" aria-hidden="true">
    <path fill="#4285F4" d="M47.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h13.2c-.6 3-2.3 5.6-4.9 7.3v6h7.9c4.6-4.3 7.3-10.5 7.3-17.8z" />
    <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.9-6c-2.2 1.5-5 2.3-8 2.3-6.1 0-11.3-4.1-13.2-9.6H2.6v6.2C6.6 42.6 14.6 48 24 48z" />
    <path fill="#FBBC05" d="M10.8 28.9c-.5-1.5-.8-3-.8-4.6s.3-3.1.8-4.6v-6.2H2.6C.9 16.1 0 19.9 0 24s.9 7.9 2.6 11.1l8.2-6.2z" />
    <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.9 2.4 30.5 0 24 0 14.6 0 6.6 5.4 2.6 13.4l8.2 6.2C12.7 13.6 17.9 9.5 24 9.5z" />
  </svg>
);
const TripAdvisorOwl = () => (
  <svg viewBox="0 0 132 80" width="26" height="16" aria-hidden="true">
    <circle cx="38" cy="42" r="32" fill="#34E0A1" />
    <circle cx="94" cy="42" r="32" fill="#34E0A1" />
    <circle cx="38" cy="42" r="18" fill="#fff" />
    <circle cx="94" cy="42" r="18" fill="#fff" />
    <circle cx="38" cy="42" r="9" fill="#000" />
    <circle cx="94" cy="42" r="9" fill="#000" />
    <path d="M52 2 Q66 14 80 2 L66 22 Z" fill="#000" />
  </svg>
);

/* ---- Canonical destination filters. Order = the chip row. ---- */
const REGIONS = [
  'Japan', 'Switzerland', 'Italy', 'Northern Lights',
  'Australia & NZ', 'Africa Safari', 'Southeast Asia',
  'Maldives', 'Europe', 'USA',
];

/* Trip-style filter (mirrors the /improved hero "Style" list). */
const STYLES = ['Group Tour', 'Bespoke Private', 'Luxury', 'Family', 'Honeymoon', 'Safari'];

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

/* Author-vetted, region-correct photo pools (harvested from the existing
   Cox & Kings pages so every image is on-brand and on-topic). Drive the
   per-tour lightbox galleries. */
const U = (id) => `https://images.unsplash.com/photo-${id}`;
const REGION_PHOTOS = {
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

/* Contextual hero image per destination (falls back to the default). */
const REGION_HERO = {
  Japan: U('1522383225653-ed111181a951'),
  Switzerland: U('1530122037265-a5f1f91d3b99'),
  Italy: U('1534445867742-43195f401b6c'),
  'Northern Lights': U('1483347756197-71ef80e95f73'),
  'Australia & NZ': U('1506973035872-a4ec16b8e8d9'),
  'Africa Safari': U('1516426122078-c23e76319801'),
  'Southeast Asia': U('1528181304800-259b08848526'),
  Maldives: U('1514282401047-d79a71a590e8'),
  Europe: U('1467269204594-9661b134dd2b'),
  USA: U('1501594907352-04cda38ebc29'),
};
const HERO_DEFAULT = U('1493976040374-85c8e12f0c0e');

/* ---- The catalogue. price (₹) & nights drive sort; regions[], style &
   pace drive the filters & collections; `to` opens the detail page
   (only Japan has one today — others route to an enquiry). J() derives
   the price/nights labels, the group line and the gallery. ---- */
function buildGallery(o) {
  const pool = REGION_PHOTOS[o.regions[0]] || [];
  return [...new Set([o.image, ...pool])].slice(0, 5);
}
const J = (o) => ({
  ...o,
  priceLabel: `₹${o.price.toLocaleString('en-IN')}`,
  nightsLabel: `${o.nights} nights`,
  group: GROUP_BY_STYLE[o.style],
  gallery: buildGallery(o),
});
const ALL_JOURNEYS = [
  J({ id: 'jp-blossom', title: 'Cherry Blossom Japan', blurb: 'Two weeks, one fleeting bloom — Tokyo neon to Kyoto temple gardens, timed to the petals.', regions: ['Japan'], style: 'Group Tour', pace: 'Balanced', rating: 4.9, nights: 13, season: 'Mar–Apr', price: 295000, image: U('1522383225653-ed111181a951'), to: '/japan' }),
  J({ id: 'jp-first', title: 'Japan for First-Timers', blurb: 'Tokyo, Hakone and Kyoto with a private guide and a night in a traditional ryokan.', regions: ['Japan'], style: 'Bespoke Private', pace: 'Balanced', rating: 4.8, nights: 10, season: 'Any date', price: 310000, image: U('1492571350019-22de08371fd3'), to: '/japan' }),
  J({ id: 'jp-luxe', title: 'Japan: Ryokans & Art Islands', blurb: 'Slow luxury — design hotels, private onsen and the Naoshima art islands.', regions: ['Japan'], style: 'Luxury', pace: 'Relaxed', rating: 4.9, nights: 9, season: 'Year-round', price: 420000, image: U('1493976040374-85c8e12f0c0e'), to: '/japan' }),

  J({ id: 'ch-summer', title: 'Summer in Switzerland', blurb: 'Glacier trains and alpine lakes — Lucerne, Zermatt and the Jungfrau region.', regions: ['Switzerland', 'Europe'], style: 'Group Tour', pace: 'Relaxed', rating: 4.8, nights: 10, season: 'Jun–Sep', price: 245000, image: U('1530122037265-a5f1f91d3b99'), to: '/contact' }),
  J({ id: 'ch-it-grand', title: 'Grand Switzerland & Italy', blurb: 'Lakeside Lucerne, the Matterhorn, then Venice to Rome — paced so you actually savour it.', regions: ['Switzerland', 'Italy', 'Europe'], style: 'Group Tour', pace: 'Balanced', rating: 4.7, nights: 13, season: 'Apr–Sep', price: 245000, image: U('1530122037265-a5f1f91d3b99'), to: '/contact' }),
  J({ id: 'ch-rail', title: 'Swiss Alps Private Rail Journey', blurb: 'The Glacier Express and Bernina line, first-class, with elevated stays throughout.', regions: ['Switzerland', 'Europe'], style: 'Luxury', pace: 'Relaxed', rating: 4.9, nights: 8, season: 'May–Oct', price: 360000, image: U('1530122037265-a5f1f91d3b99'), to: '/contact' }),

  J({ id: 'it-slow', title: 'Slow Italy: Coast to Art', blurb: 'Rome after-hours, a Tuscan villa and a hidden Amalfi cove — designed around you.', regions: ['Italy', 'Europe'], style: 'Bespoke Private', pace: 'Relaxed', rating: 4.8, nights: 9, season: 'Apr–Oct', price: 240000, image: U('1534445867742-43195f401b6c'), to: '/contact' }),
  J({ id: 'it-amalfi', title: 'Amalfi & the Southern Coast', blurb: 'A private skipper, cliffside stays and long lunches above the Tyrrhenian.', regions: ['Italy', 'Europe'], style: 'Luxury', pace: 'Relaxed', rating: 4.8, nights: 7, season: 'May–Sep', price: 280000, image: U('1534445867742-43195f401b6c'), to: '/contact' }),
  J({ id: 'it-family', title: 'Italy for Families', blurb: 'Gladiator schools in Rome, gelato trails and a slow Tuscan farmhouse week.', regions: ['Italy', 'Europe'], style: 'Family', pace: 'Relaxed', rating: 4.7, nights: 10, season: 'Apr–Oct', price: 215000, image: U('1534445867742-43195f401b6c'), to: '/contact' }),

  J({ id: 'nl-chase', title: 'Chasing the Northern Lights', blurb: 'Arctic Scandinavia after dark — aurora hunts, huskies and snowbound nights.', regions: ['Northern Lights', 'Europe'], style: 'Group Tour', pace: 'Active', rating: 4.7, nights: 7, season: 'Oct–Mar', price: 275000, image: U('1483347756197-71ef80e95f73'), to: '/contact' }),
  J({ id: 'nl-ice', title: 'Arctic Scandinavia & Ice Hotels', blurb: 'A night in an ice hotel, glass-roofed cabins and the aurora overhead.', regions: ['Northern Lights', 'Europe'], style: 'Luxury', pace: 'Balanced', rating: 4.8, nights: 8, season: 'Dec–Mar', price: 340000, image: U('1483347756197-71ef80e95f73'), to: '/contact' }),

  J({ id: 'nz-road', title: 'New Zealand by Road', blurb: 'The South Island end to end — fjords, glaciers and open mountain roads.', regions: ['Australia & NZ'], style: 'Bespoke Private', pace: 'Active', rating: 4.9, nights: 12, season: 'Oct–Apr', price: 320000, image: U('1469521669194-babb45599def'), to: '/contact' }),
  J({ id: 'au-family', title: 'Australia for Families', blurb: 'Reef, beaches and easy days — snorkelling, Rotorua and time to breathe.', regions: ['Australia & NZ'], style: 'Family', pace: 'Relaxed', rating: 4.7, nights: 14, season: 'Year-round', price: 340000, image: U('1506973035872-a4ec16b8e8d9'), to: '/contact' }),

  J({ id: 'af-migration', title: 'African Safari: Great Migration', blurb: 'The Maasai Mara in migration season — game drives at first and last light.', regions: ['Africa Safari'], style: 'Group Tour', pace: 'Active', rating: 4.9, nights: 8, season: 'Jul–Oct', price: 310000, image: U('1516426122078-c23e76319801'), to: '/contact' }),
  J({ id: 'af-private', title: 'Kenya Private Conservancy Safari', blurb: 'Private Maasai Mara camps, few vehicles and a naturalist to yourself.', regions: ['Africa Safari'], style: 'Safari', pace: 'Balanced', rating: 4.9, nights: 8, season: 'Jul–Oct', price: 420000, image: U('1516426122078-c23e76319801'), to: '/contact' }),
  J({ id: 'af-tanzania', title: 'Tanzania: Serengeti & Ngorongoro', blurb: 'The Serengeti plains and the Ngorongoro crater, in classic tented camps.', regions: ['Africa Safari'], style: 'Safari', pace: 'Active', rating: 4.8, nights: 9, season: 'Jun–Oct', price: 380000, image: U('1547471080-7cc2caa01a7e'), to: '/contact' }),
  J({ id: 'af-southafrica', title: 'South Africa: Cape & Kruger', blurb: 'Cape Town, the winelands and big-five days in a private Kruger reserve.', regions: ['Africa Safari'], style: 'Safari', pace: 'Balanced', rating: 4.7, nights: 11, season: 'Year-round', price: 325000, image: U('1516426122078-c23e76319801'), to: '/contact' }),

  J({ id: 'eu-grand', title: 'Grand Europe', blurb: 'Many countries, one effortless journey — the classic capitals, seamlessly linked.', regions: ['Europe'], style: 'Group Tour', pace: 'Active', rating: 4.6, nights: 15, season: 'Apr–Sep', price: 185000, image: U('1467269204594-9661b134dd2b'), to: '/contact' }),
  J({ id: 'eu-iberia', title: 'Portugal & Spain: Iberian Journey', blurb: 'Lisbon and Porto, Seville and Madrid — tiles, tapas and Atlantic light.', regions: ['Europe'], style: 'Group Tour', pace: 'Balanced', rating: 4.7, nights: 12, season: 'Apr–Oct', price: 195000, image: U('1467269204594-9661b134dd2b'), to: '/contact' }),
  J({ id: 'eu-xmas', title: 'European Christmas Markets', blurb: 'Mulled wine and old-town lights across the festive heart of Europe.', regions: ['Europe'], style: 'Group Tour', pace: 'Balanced', rating: 4.7, nights: 9, season: 'Dec', price: 170000, image: U('1543349689-9a4d426bee8e'), to: '/contact' }),

  J({ id: 'sea-islands', title: 'Islands & Temples of Southeast Asia', blurb: 'Bangkok street food, Angkor at dawn and slow days on the islands.', regions: ['Southeast Asia'], style: 'Bespoke Private', pace: 'Balanced', rating: 4.7, nights: 11, season: 'Year-round', price: 95000, image: U('1528181304800-259b08848526'), to: '/contact' }),
  J({ id: 'sea-srilanka', title: 'Sri Lanka: Tea Trails & Coast', blurb: 'Hill-country tea estates, ancient cities and a slow finish by the sea.', regions: ['Southeast Asia'], style: 'Bespoke Private', pace: 'Relaxed', rating: 4.8, nights: 9, season: 'Year-round', price: 130000, image: U('1546708973-b339540b5162'), to: '/contact' }),
  J({ id: 'sea-vietnam', title: 'Vietnam & Cambodia Discovery', blurb: 'Hanoi to Halong Bay, the Mekong and the temples of Angkor.', regions: ['Southeast Asia'], style: 'Group Tour', pace: 'Balanced', rating: 4.6, nights: 12, season: 'Oct–Apr', price: 120000, image: U('1528181304800-259b08848526'), to: '/contact' }),

  J({ id: 'mv-overwater', title: 'Maldives Overwater Escape', blurb: 'Overwater calm — a private villa, a house reef and nowhere to be.', regions: ['Maldives'], style: 'Honeymoon', pace: 'Relaxed', rating: 4.9, nights: 5, season: 'Year-round', price: 140000, image: U('1514282401047-d79a71a590e8'), to: '/contact' }),

  J({ id: 'us-coast', title: 'USA Coast to Coast', blurb: 'The great national parks and iconic cities, linked into one road-trip arc.', regions: ['USA'], style: 'Bespoke Private', pace: 'Active', rating: 4.7, nights: 14, season: 'May–Oct', price: 220000, image: U('1501594907352-04cda38ebc29'), to: '/contact' }),
  J({ id: 'us-canada', title: 'Canadian Rockies & Rail', blurb: 'Banff, Lake Louise and the Rocky Mountaineer through the mountains.', regions: ['USA'], style: 'Group Tour', pace: 'Balanced', rating: 4.8, nights: 10, season: 'Jun–Sep', price: 295000, image: U('1503614472-8c93d56e92ce'), to: '/contact' }),
];

/* ---- Themed browse collections (shown when no filter is active). Each
   maps to a single filter the "See all" control applies. ---- */
const COLLECTIONS = [
  { key: 'group', title: 'Guided group tours', sub: 'Expert-led departures with a tour manager throughout — everything handled, fine company along the way.', match: (j) => j.style === 'Group Tour', apply: { style: 'Group Tour' } },
  { key: 'relaxed', title: 'Relaxed pace, for a calm vacation', sub: 'Slow mornings, gentle days and comfortable distances — easy on every generation.', match: (j) => j.pace === 'Relaxed', apply: { pace: 'Relaxed' } },
  { key: 'private', title: 'Tailor-made private journeys', sub: 'Designed one-to-one, entirely around your pace and your people.', match: (j) => j.style === 'Bespoke Private', apply: { style: 'Bespoke Private' } },
  { key: 'luxury', title: 'Luxury & signature stays', sub: 'The finest hotels, private guiding and rare, after-hours access.', match: (j) => j.style === 'Luxury', apply: { style: 'Luxury' } },
  { key: 'safari', title: 'Safari & the wide outdoors', sub: 'Migrations, big-five wilderness and landscapes that don’t fit indoors.', match: (j) => j.style === 'Safari', apply: { style: 'Safari' } },
  { key: 'family', title: 'Family & honeymoon escapes', sub: 'Easy days for all ages — and quiet corners just for two.', match: (j) => j.style === 'Family' || j.style === 'Honeymoon', apply: { style: 'Family' } },
];

/* Map a loose incoming ?where= value onto a canonical region chip. */
function matchRegion(raw) {
  if (!raw) return null;
  const q = raw.trim().toLowerCase();
  if (!q) return null;
  const direct = REGIONS.find((r) => r.toLowerCase() === q);
  if (direct) return direct;
  const aliases = [
    [/japan/, 'Japan'], [/switzer/, 'Switzerland'], [/ital/, 'Italy'],
    [/(northern light|scandinav|arctic|aurora|norway|iceland|finland)/, 'Northern Lights'],
    [/(australia|new zealand|\bnz\b)/, 'Australia & NZ'],
    [/(africa|safari|kenya|tanzania)/, 'Africa Safari'],
    [/(southeast asia|thailand|vietnam|bali|indonesia|cambodia|sri lanka)/, 'Southeast Asia'],
    [/maldive/, 'Maldives'], [/(usa|america|united states|canada)/, 'USA'],
    [/(europe|christmas market|spain|portugal)/, 'Europe'],
  ];
  for (const [re, region] of aliases) if (re.test(q)) return region;
  return null;
}

/* Map a loose incoming ?style= value onto a canonical style. */
function matchStyle(raw) {
  if (!raw) return null;
  const q = raw.trim().toLowerCase();
  return STYLES.find((s) => s.toLowerCase() === q || s.toLowerCase().includes(q)) || null;
}

/* ---- Nav megamenus — Destinations & styles route into THIS listing. ---- */
const NAV_MENU = [
  {
    label: 'Ways to travel', href: '/journeys',
    blurb: 'Two ways to see the world — pick the one that fits you.',
    items: [
      { label: 'Escorted group tours', desc: 'Expert-led, fixed departures', to: '/journeys?style=Group Tour' },
      { label: 'Tailor-made journeys', desc: 'Designed entirely around you', to: '/journeys?style=Bespoke Private' },
      { label: 'Luxury & private travel', desc: 'Elevated stays and guiding', to: '/journeys?style=Luxury' },
      { label: 'Help me decide', desc: 'Talk it through with a specialist', to: '/contact' },
    ],
  },
  {
    label: 'Destinations', href: '/journeys',
    blurb: 'Over 100 countries, shaped by specialists who know them first-hand.',
    items: [
      { label: 'Japan', desc: 'Cherry blossom to neon', to: '/journeys?where=Japan' },
      { label: 'Switzerland', desc: 'Alpine railways & lakes', to: '/journeys?where=Switzerland' },
      { label: 'Italy', desc: 'Cities, coast & countryside', to: '/journeys?where=Italy' },
      { label: 'Northern Lights', desc: 'Arctic winter skies', to: '/journeys?where=Northern Lights' },
      { label: 'Africa Safari', desc: 'Big-five wilderness', to: '/journeys?where=Africa Safari' },
      { label: 'All destinations', desc: 'Browse every journey', to: '/journeys' },
    ],
  },
  {
    label: 'Journeys', href: '/journeys',
    blurb: 'Signature itineraries, ready to make your own.',
    items: [
      { label: 'Cherry Blossom Japan', desc: '13 nights · Mar–Apr', to: '/journeys?where=Japan' },
      { label: 'Grand Switzerland & Italy', desc: 'Scenic rail & cities', to: '/journeys?where=Switzerland' },
      { label: 'Northern Lights & Ice', desc: 'Arctic Scandinavia', to: '/journeys?where=Northern Lights' },
      { label: 'All journeys', desc: 'The full collection', to: '/journeys' },
    ],
  },
  {
    label: 'Why us', href: '/improved#trust',
    blurb: 'Specialists, not salespeople — and 260 years behind every trip.',
    items: [
      { label: 'Our specialists', desc: 'The people who plan your trip', to: '/improved#trust' },
      { label: 'Since 1758', desc: 'Heritage you can lean on', to: '/improved#trust' },
      { label: 'Real reviews', desc: '2,400+ verified travellers', to: '/improved#reviews' },
      { label: 'Talk to an expert', desc: 'We pick up the phone', to: '/contact' },
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

/* A single journey card — image (opens the itinerary), meta, and two
   clear CTAs: WhatsApp "Enquire Now" and "View Itinerary". */
function JourneyCard({ j, i, onPhotos }) {
  const waHref = `${CONTACT.whatsappHref}?text=${encodeURIComponent(`Hi Cox & Kings, I'd like to enquire about the "${j.title}" journey.`)}`;
  return (
    <Reveal className="jl-card" delay={(i % 3) * 0.05} y={24} as="article">
      <div className="jl-card-media">
        <Link to={j.to} className="jl-card-media-link" aria-label={`${j.title} — view itinerary`}>
          <img src={img(j.image, 800)} alt={j.title} loading="lazy" />
        </Link>
        <span className="jl-card-style">{j.style}</span>
        <span className="jl-card-rating"><Star size={12} fill="currentColor" aria-hidden="true" /> {j.rating.toFixed(1)}</span>
        <span className="jl-card-region"><MapPin size={12} aria-hidden="true" /> {j.regions[0]}</span>
        {j.gallery.length > 1 && (
          <button
            type="button"
            className="jl-photos"
            onClick={() => onPhotos(j)}
            aria-label={`View ${j.gallery.length} photos of ${j.title}`}
          >
            <Images size={15} aria-hidden="true" /> {j.gallery.length} photos
          </button>
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

/* A themed collection shelf — a horizontally scrollable rail of every
   matching journey. Native swipe/trackpad scroll on all devices, plus
   desktop arrow controls that snap one card at a time. */
function Shelf({ col, onPhotos }) {
  const railRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const list = useMemo(() => ALL_JOURNEYS.filter(col.match), [col]);

  const update = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    update();
    const el = railRef.current;
    el?.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { el?.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, [update]);

  const scrollBy = (dir) => {
    const el = railRef.current;
    if (!el) return;
    const card = el.querySelector('.jl-card');
    const step = (card ? card.offsetWidth : 320) + 22;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  return (
    <section className="jl-shelf" aria-labelledby={`shelf-${col.key}`}>
      <div className="jl-shelf-head">
        <div className="jl-shelf-heading">
          <Reveal className="h26-label jl-shelf-label" as="p">{list.length} journeys</Reveal>
          <Reveal as="h2" className="jl-shelf-title" delay={0.04} id={`shelf-${col.key}`}>{col.title}</Reveal>
          <Reveal as="p" className="jl-shelf-sub" delay={0.08}>{col.sub}</Reveal>
        </div>
        <div className="jl-shelf-arrows" aria-hidden="true">
          <button type="button" className="jl-arrow" onClick={() => scrollBy(-1)} disabled={atStart} aria-label="Scroll left" tabIndex={-1}>
            <ChevronLeft size={20} />
          </button>
          <button type="button" className="jl-arrow" onClick={() => scrollBy(1)} disabled={atEnd} aria-label="Scroll right" tabIndex={-1}>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      <div className="jl-rail" ref={railRef} role="group" aria-label={`${col.title} — scroll for more`}>
        {list.map((j, i) => <JourneyCard key={j.id} j={j} i={i} onPhotos={onPhotos} />)}
      </div>
    </section>
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

export default function Journeys() {
  const [params, setParams] = useSearchParams();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightbox, setLightbox] = useState(null); // { title, photos, index } | null

  /* Filter state — seeded from the incoming URL (?where=, ?style=). */
  const [query, setQuery] = useState(() => {
    const w = params.get('where') || '';
    return matchRegion(w) ? '' : w;
  });
  const [region, setRegion] = useState(() => matchRegion(params.get('where')));
  const [style, setStyle] = useState(() => matchStyle(params.get('style')));
  const [pace, setPace] = useState(null);
  const [sort, setSort] = useState('recommended');
  const [sortOpen, setSortOpen] = useState(false);

  const sortRef = useRef(null);
  const prefersReduced = useReducedMotion();

  const openPhotos = useCallback((j) => setLightbox({ title: j.title, photos: j.gallery, index: 0 }), []);

  /* Nav goes solid once the page scrolls off the dark banner. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Lock body scroll while the mobile menu or lightbox is open. */
  useEffect(() => {
    const lock = menuOpen || !!lightbox;
    document.body.style.overflow = lock ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen, lightbox]);

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
    if (region) next.where = region;
    else if (query.trim()) next.where = query.trim();
    if (style) next.style = style;
    if (pace) next.pace = pace;
    setParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [region, query, style, pace]);

  /* The filtered + sorted result set. */
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = ALL_JOURNEYS.filter((j) => {
      if (region && !j.regions.includes(region)) return false;
      if (style && j.style !== style) return false;
      if (pace && j.pace !== pace) return false;
      if (q) {
        const hay = `${j.title} ${j.blurb} ${j.regions.join(' ')} ${j.style} ${j.pace} ${j.season}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    const by = {
      'price-asc': (a, b) => a.price - b.price,
      'price-desc': (a, b) => b.price - a.price,
      'nights-desc': (a, b) => b.nights - a.nights,
    }[sort];
    if (by) list = [...list].sort(by);
    return list;
  }, [query, region, style, pace, sort]);

  const activeCount = (region ? 1 : 0) + (style ? 1 : 0) + (pace ? 1 : 0) + (query.trim() ? 1 : 0);
  /* No filter + default sort → editorial browse (themed shelves). */
  const browseMode = activeCount === 0 && sort === 'recommended';

  const clearAll = () => { setRegion(null); setStyle(null); setPace(null); setQuery(''); };
  const pickRegion = (r) => { setRegion(region === r ? null : r); setQuery(''); setPace(null); };

  const heroImg = img(REGION_HERO[region] || HERO_DEFAULT, 1800);
  const heroTitle = region ? `Journeys to ${region}`
    : style ? `${style} journeys`
    : pace ? `${pace}-pace journeys`
    : 'Every journey, in one place';
  const sortLabel = SORTS.find((s) => s.key === sort)?.label;

  return (
    <div className="h26 jl">
      <a className="h26-skip" href="#results">Skip to journeys</a>

      {/* ---------- NAV (shared /improved chrome) ---------- */}
      <header className={`h26-nav${scrolled ? ' is-solid' : ''}`}>
        <Link to="/improved" className="h26-brand">
          <img src="/cox-logo-new.png" alt="Cox & Kings" />
        </Link>
        <nav className="h26-links hi-nav" aria-label="Primary">
          {NAV_MENU.map((group) => (
            <div className="hi-nav-group" key={group.label}>
              <Link to={group.href} className="hi-nav-top" aria-haspopup="true">
                {group.label}
                <ChevronDown size={14} className="hi-nav-caret" aria-hidden="true" />
              </Link>
              <div className="hi-nav-flyout" role="menu">
                <div className="hi-nav-flyout-inner">
                  <p className="hi-nav-blurb">{group.blurb}</p>
                  <ul className="hi-nav-list">
                    {group.items.map((it) => (
                      <li key={it.label}>
                        <Link to={it.to} role="menuitem" className="hi-nav-item">
                          <span className="hi-nav-item-label">{it.label}</span>
                          <span className="hi-nav-item-desc">{it.desc}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </nav>
        <div className="h26-nav-cta">
          <a href={CONTACT.phoneHref} className="h26-phone">
            <Phone size={15} /> <span>{CONTACT.phoneDisplay}</span>
          </a>
          <Link to="/contact" className="h26-btn h26-btn-pill">Talk to an expert</Link>
          <button className="h26-burger" aria-label="Menu" onClick={() => setMenuOpen(true)}>
            <Menu size={22} />
          </button>
        </div>
      </header>

      {/* Mobile slide-in menu */}
      <div className={`h26-menu${menuOpen ? ' is-open' : ''}`} aria-hidden={!menuOpen}>
        <div className="h26-menu-scrim" onClick={() => setMenuOpen(false)} />
        <div className="h26-menu-panel" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="h26-menu-top">
            <button className="h26-menu-close" aria-label="Close menu" onClick={() => setMenuOpen(false)}><X size={20} /></button>
            <img className="h26-menu-logo" src="/cox-logo-new.png" alt="Cox & Kings — Est. 1758" />
          </div>
          <nav className="h26-menu-primary" aria-label="Mobile primary">
            {REGIONS.slice(0, 6).map((r) => (
              <Link key={r} to={`/journeys?where=${encodeURIComponent(r)}`} onClick={() => setMenuOpen(false)}>
                {r}
                <span className="h26-menu-chev"><ArrowRight size={16} /></span>
              </Link>
            ))}
          </nav>
          <div className="h26-menu-divider" />
          <div className="h26-menu-secondary">
            <Link to="/journeys" onClick={() => setMenuOpen(false)}>All journeys <ArrowUpRight size={13} /></Link>
            <Link to="/improved" onClick={() => setMenuOpen(false)}>Home <ArrowUpRight size={13} /></Link>
            <Link to="/about" onClick={() => setMenuOpen(false)}>Our story <ArrowUpRight size={13} /></Link>
            <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact <ArrowUpRight size={13} /></Link>
          </div>
          <a href={CONTACT.phoneHref} className="h26-btn h26-btn-pill h26-menu-cta" onClick={() => setMenuOpen(false)}>
            <Phone size={16} /> Speak to an expert
          </a>
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

      {/* ---------- HERO BANNER + SEARCH ---------- */}
      <section className="jl-hero">
        <div className="jl-hero-bg" style={{ backgroundImage: `url(${heroImg})` }} aria-hidden="true" />
        <div className="jl-hero-veil" aria-hidden="true" />
        <div className="jl-hero-inner">
          <Reveal className="h26-label jl-hero-eyebrow" as="p">
            {ALL_JOURNEYS.length} handcrafted journeys · 100+ countries
          </Reveal>
          <h1 className="jl-hero-title">
            <WordReveal text={heroTitle} accent={region || style || pace ? [1] : [2]} />
          </h1>
          <Reveal className="jl-hero-sub" as="p" delay={0.15}>
            Browse every Cox &amp; Kings journey — escorted group tours and tailor-made private
            holidays alike. Search a place, or filter by how you like to travel.
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
                onChange={(e) => { setQuery(e.target.value); setRegion(null); setPace(null); }}
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

          {/* Independent-review proof — TripAdvisor + Google */}
          <motion.div
            className="jl-hero-reviews"
            role="group"
            aria-label="Traveller reviews"
            initial={prefersReduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="jl-review">
              <span className="jl-review-logo" aria-hidden="true">
                <svg viewBox="0 0 64 40" width="34" height="21">
                  <circle cx="19" cy="20" r="17" fill="#000" />
                  <circle cx="45" cy="20" r="17" fill="#000" />
                  <circle cx="19" cy="20" r="10.5" fill="#fff" />
                  <circle cx="45" cy="20" r="10.5" fill="#fff" />
                  <circle cx="19" cy="20" r="5" fill="#000" />
                  <circle cx="45" cy="20" r="5" fill="#000" />
                  <circle cx="32" cy="6" r="4.5" fill="#34e0a1" />
                  <path d="M25 33 L32 39 L39 33 Z" fill="#000" />
                </svg>
              </span>
              <span className="jl-review-body">
                <span className="jl-review-bubbles jl-review-bubbles--ta" aria-hidden="true">
                  <i /><i /><i /><i /><i className="is-half" />
                </span>
                <span className="jl-review-meta"><strong>4.7</strong> · Tripadvisor</span>
              </span>
            </div>

            <span className="jl-review-divider" aria-hidden="true" />

            <div className="jl-review">
              <span className="jl-review-logo" aria-hidden="true">
                <svg viewBox="0 0 48 48" width="21" height="21">
                  <path fill="#4285F4" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                  <path fill="#EA4335" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
                  <path fill="#34A853" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
                  <path fill="#FBBC05" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
                </svg>
              </span>
              <span className="jl-review-body">
                <span className="jl-review-stars" aria-hidden="true">
                  <Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" />
                </span>
                <span className="jl-review-meta"><strong>4.8</strong> · Google Reviews</span>
              </span>
            </div>

            <a
              href="#reviews"
              className="jl-review-jump"
              aria-label="Read traveller reviews"
              onClick={(e) => {
                const el = document.getElementById('reviews');
                if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
              }}
            >
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ---------- STICKY FILTER TOOLBAR ---------- */}
      <div className={`jl-toolbar${scrolled ? ' is-stuck' : ''}`}>
        <div className="jl-toolbar-inner">
          {/* Destination chip rail */}
          <div className="jl-regions" role="group" aria-label="Filter by destination">
            <button
              type="button"
              className={`jl-region${!region ? ' is-on' : ''}`}
              onClick={() => { setRegion(null); setQuery(''); }}
            >
              All
            </button>
            {REGIONS.map((r) => (
              <button
                key={r}
                type="button"
                className={`jl-region${region === r ? ' is-on' : ''}`}
                onClick={() => pickRegion(r)}
                aria-pressed={region === r}
              >
                <MapPin size={13} aria-hidden="true" /> {r}
              </button>
            ))}
          </div>

          {/* Style + sort */}
          <div className="jl-toolbar-controls">
            <div className="jl-select">
              <Compass size={15} aria-hidden="true" />
              <select
                value={style || ''}
                onChange={(e) => setStyle(e.target.value || null)}
                aria-label="Filter by trip style"
              >
                <option value="">Any style</option>
                {STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown size={15} className="jl-select-chev" aria-hidden="true" />
            </div>

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
        </div>
      </div>

      {/* ---------- RESULTS ---------- */}
      <main className="jl-results" id="results">
        {browseMode ? (
          /* ===== Editorial browse — themed collection shelves you scroll ===== */
          <div className="jl-collections">
            {COLLECTIONS.map((col) => <Shelf key={col.key} col={col} onPhotos={openPhotos} />)}
          </div>
        ) : (
          /* ===== Filtered / searched — flat result grid (contained) ===== */
          <div className="jl-contained">
            <div className="jl-results-head">
              <p className="jl-count" aria-live="polite">
                <strong>{results.length}</strong> {results.length === 1 ? 'journey' : 'journeys'}
                {region ? ` to ${region}` : ''}{style ? ` · ${style}` : ''}{pace ? ` · ${pace} pace` : ''}
              </p>
              {activeCount > 0 && (
                <div className="jl-active">
                  {query.trim() && (
                    <button type="button" className="jl-active-chip" onClick={() => setQuery('')}>
                      “{query.trim()}” <X size={13} />
                    </button>
                  )}
                  {region && (
                    <button type="button" className="jl-active-chip" onClick={() => setRegion(null)}>
                      {region} <X size={13} />
                    </button>
                  )}
                  {style && (
                    <button type="button" className="jl-active-chip" onClick={() => setStyle(null)}>
                      {style} <X size={13} />
                    </button>
                  )}
                  {pace && (
                    <button type="button" className="jl-active-chip" onClick={() => setPace(null)}>
                      {pace} pace <X size={13} />
                    </button>
                  )}
                  <button type="button" className="jl-clear-all" onClick={clearAll}>Clear all</button>
                </div>
              )}
            </div>

            {results.length > 0 ? (
              <div className="jl-grid">
                {results.map((j, i) => <JourneyCard key={j.id} j={j} i={i} onPhotos={openPhotos} />)}
              </div>
            ) : (
              <div className="jl-empty">
                <span className="jl-empty-icon"><Compass size={30} aria-hidden="true" /></span>
                <h2>No journeys match just yet</h2>
                <p>
                  We run trips to over 100 countries and design tailor-made holidays anywhere.
                  Clear a filter, or tell a specialist where you'd like to go — we'll build it.
                </p>
                <div className="jl-empty-actions">
                  <button type="button" className="h26-btn h26-btn-pill jl-btn-solid" onClick={clearAll}>Clear filters</button>
                  <a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer" className="h26-btn jl-btn-ghost">
                    <MessageCircle size={16} /> Ask a specialist
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      {/* ---------- TRAVELLER REVIEWS — horizontal marquee (mirrors /improved) ---------- */}
      <section className="h26-reviews jl-reviews" id="reviews">
        <div className="h26-head">
          <Reveal className="h26-label" as="p">Travelled, and came back happy</Reveal>
          <Reveal as="h2" className="h26-h2" delay={0.05}>Travellers who trusted us.</Reveal>
          <Reveal as="p" className="hi-rev-sub" delay={0.1}>Couples and honeymooners, multi-generational families, friends and solo explorers.</Reveal>
        </div>

        {/* Independent-rating trust strip: overall score + Google / Tripadvisor */}
        <Reveal className="hi-rtrust">
          <div className="hi-rtrust-overall">
            <strong>{RATING.score}</strong>
            <div className="hi-rtrust-overall-meta">
              <span className="hi-rtrust-stars" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, k) => <Star key={k} size={15} fill="currentColor" />)}
              </span>
              <span className="hi-rtrust-sub">Excellent · {RATING.count} verified reviews</span>
            </div>
          </div>
          <span className="hi-rtrust-div" aria-hidden="true" />
          <div className="hi-rtrust-platforms">
            <span className="hi-rtrust-plat">
              <GoogleG />
              <span><strong>4.8</strong> on <b>Google</b></span>
            </span>
            <span className="hi-rtrust-plat">
              <TripAdvisorOwl />
              <span><strong>4.7</strong> on <b>Tripadvisor</b></span>
            </span>
          </div>
        </Reveal>

        <div className="h26-marquee">
          <div className="h26-marquee-track">
            {[...REVIEWS_IMP, ...REVIEWS_IMP].map((r, i) => (
              <article className="h26-rev" key={i}>
                <div className="h26-rev-photo">
                  <img src={img(r.tripPhoto, 600)} alt={r.tour} loading="lazy" />
                  <span className="h26-rev-tour">{r.tour}</span>
                </div>
                <div className="h26-rev-content">
                  <div className="h26-rev-stars">
                    {Array.from({ length: r.rating }).map((_, k) => <Star key={k} size={14} fill="currentColor" />)}
                  </div>
                  <p>"{r.text}"</p>
                  <div className="h26-rev-who">
                    <img src={img(r.avatar, 120)} alt="" loading="lazy" />
                    <span>
                      <strong>{r.name}</strong>
                      <em>{r.location}</em>
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CLOSING CTA ---------- */}
      <section className="jl-cta">
        <div className="jl-cta-bg" style={{ backgroundImage: `url(${img(HERO_DEFAULT, 1800)})` }} aria-hidden="true" />
        <div className="jl-cta-veil" aria-hidden="true" />
        <div className="jl-cta-inner">
          <Reveal className="h26-label jl-cta-eyebrow" as="span">Can't see quite the right one?</Reveal>
          <Reveal as="h2" className="jl-cta-title" delay={0.05}>
            Tell us how you like to travel.<br /><strong>We'll design the journey around you.</strong>
          </Reveal>
          <Reveal className="jl-cta-actions" delay={0.12}>
            <a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer" className="h26-btn h26-btn-accent h26-btn-lg"><MessageCircle size={17} /> WhatsApp us</a>
            <Link to="/contact" className="h26-btn h26-btn-glass h26-btn-lg"><PhoneCall size={16} /> Schedule a callback</Link>
          </Reveal>
          <Reveal as="p" className="jl-cta-hours" delay={0.18}>Travel experts available 9am–9pm IST, every day.</Reveal>
        </div>
      </section>

      {/* ---------- FOOTER (shared /improved chrome) ---------- */}
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
              <h4>Journeys</h4>
              <Link to="/journeys?style=Group Tour">Group tours</Link>
              <Link to="/journeys?style=Bespoke Private">Bespoke holidays</Link>
              <Link to="/journeys?style=Luxury">Luxury journeys</Link>
              <Link to="/journeys">All destinations</Link>
            </div>
            <div>
              <h4>Company</h4>
              <Link to="/about">Our story</Link>
              <Link to="/about">Specialists</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/improved#trust">Why Cox &amp; Kings</Link>
            </div>
            <div>
              <h4>Assurance</h4>
              <Link to="/improved#trust">Trust &amp; safety</Link>
              <Link to="/improved#trust">Awards</Link>
              <Link to="/contact">Refund policy</Link>
              <Link to="/contact">Speak to an expert</Link>
            </div>
          </div>
        </div>
        <div className="h26-footer-bottom">
          <span>© {new Date().getFullYear()} Cox &amp; Kings. Travelling the world since 1758.</span>
          <span className="h26-footer-assoc">IATA · TAAI · ASTA</span>
        </div>
      </footer>

      {/* ---------- PHOTO LIGHTBOX ---------- */}
      <AnimatePresence>
        {lightbox && <Lightbox data={lightbox} onClose={() => setLightbox(null)} />}
      </AnimatePresence>
    </div>
  );
}
