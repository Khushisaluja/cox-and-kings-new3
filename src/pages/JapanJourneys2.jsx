/* ============================================================
   Japan Journeys 2 — a NEW VERSION of /journeys/japan.

   Same story, re-sequenced and expanded:
     1. Hero banner            (kept from /journeys/japan)
     2. A little about Japan    (kept — intro + "good to know" facts)
     3. The Japan journeys      (NEW: every Japan tour in one grid, with a
                                 /journeys2-style LEFT filter rail — trip
                                 style, pace, budget, duration — plus a
                                 sort menu; 9 shown at a time, "show more")
     4. Food & reservations     (kept — but on a BEIGE surface, not Cloudstone)
     5. Where you'll go         (the "four corners" highlights, now a
                                 standalone section after the food)
     6. Traveller testimonials  (NEW)
     7. People also view        (NEW)
     8. Closing CTA + footer     (kept)

   Design language: shares the /improved chrome exactly and reuses the
   /journeys card/lightbox, the /journeys2 filter-rail shell and the base
   Japan sections. New styles live in JapanJourneys2.css, all scoped .jj2
   so the original /journeys/japan is untouched.
   ============================================================ */
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import {
  Phone, PhoneCall, MessageCircle, ArrowUpRight, ArrowRight,
  MapPin, Menu, X, ChevronDown, ChevronLeft, ChevronRight,
  Star, Clock, Calendar, Users, User, Gauge, Images, Utensils, Compass,
  CalendarDays, Plane, Landmark, Languages, TrainFront, Wallet,
  SlidersHorizontal, Check, Plus, Sparkles,
  Instagram, Facebook, Youtube, Linkedin,
} from 'lucide-react';
import { img } from '../data/v3content';
import ChatBot from '../components/ChatBot';
import './Home2026.css';
import './Home2026Improved.css';
import './Luxe2Improved.css';
import './Journeys.css';
import './Journeys2.css';
import './Journeys4.css';
import './JapanJourneys.css';
import './JapanJourneys2.css';

/* /improved-scoped direct line (matches Home2026Improved / Journeys). */
const CONTACT = {
  phoneDisplay: '+91 8556001700',
  phoneHref: 'tel:+918556001700',
  whatsappHref: 'https://wa.me/918556001700',
  email: 'journeys@coxandkings.com',
};

const U = (id) => `https://images.unsplash.com/photo-${id}`;

/* Japan photo pool — on-brand, harvested from the existing CK pages —
   drives the per-tour lightbox galleries. */
const JAPAN_PHOTOS = [
  U('1522383225653-ed111181a951'), U('1492571350019-22de08371fd3'),
  U('1493976040374-85c8e12f0c0e'), U('1490806843957-31f4c9a91c65'),
  U('1528360983277-13d401cdc186'), U('1540959733332-eab4deabeeaf'),
];
const HERO_IMG = U('1545569341-9eb8b30979d9');

/* ---- The Japan catalogue. Same card shape as /journeys, Japan-only. ---- */
const GROUP_BY_STYLE = {
  'Group Tour': 'Small group · max 18',
  'Bespoke Private': 'Private & tailor-made',
  Luxury: 'Private guiding',
};
function buildGallery(image) {
  return [...new Set([image, ...JAPAN_PHOTOS])].slice(0, 5);
}
/* Binary tour-type tag shown on every card — matches /journeys4. Escorted,
   fixed-departure styles read as a "Group Tour"; everything tailor-made
   reads as a "Private Tour". Data-driven off the trip style. */
const GROUP_STYLES = ['Group Tour'];
const tourTypeOf = (style) => (GROUP_STYLES.includes(style) ? 'Group Tour' : 'Private Tour');
const T = (o) => ({
  ...o,
  priceLabel: `₹${o.price.toLocaleString('en-IN')}`,
  nightsLabel: `${o.nights} nights`,
  group: GROUP_BY_STYLE[o.style],
  tourType: tourTypeOf(o.style),
  gallery: buildGallery(o.image),
});

/* Every Japan journey, escorted and private, in one flat catalogue. */
const ALL_TOURS = [
  T({ id: 'jp-blossom', title: 'Cherry Blossom Japan', blurb: 'Tokyo neon to Kyoto temple gardens, timed to the petals.', style: 'Group Tour', pace: 'Balanced', rating: 4.9, nights: 13, season: 'Mar–Apr', price: 295000, image: U('1522383225653-ed111181a951'), to: '/japan' }),
  T({ id: 'jp-essence', title: 'Essence of Japan with Hakone', blurb: 'The classic first loop — Tokyo, Mt Fuji and old Kyoto.', style: 'Group Tour', pace: 'Balanced', rating: 4.8, nights: 8, season: 'Mar–Nov', price: 265000, image: U('1490806843957-31f4c9a91c65'), to: '/essence-japan' }),
  T({ id: 'jp-highlights', title: 'Highlights of Japan', blurb: 'Tokyo, Kyoto, Hiroshima and Osaka, linked by bullet train.', style: 'Group Tour', pace: 'Active', rating: 4.7, nights: 11, season: 'Year-round', price: 250000, image: U('1540959733332-eab4deabeeaf'), to: '/japan' }),
  T({ id: 'jp-autumn', title: 'Japan in Autumn Colours', blurb: 'Fire-red maples across Kyoto, Nikko and the Fuji lakes.', style: 'Group Tour', pace: 'Balanced', rating: 4.8, nights: 12, season: 'Oct–Nov', price: 285000, image: U('1528360983277-13d401cdc186'), to: '/japan' }),
  T({ id: 'jp-first', title: 'Japan for First-Timers', blurb: 'Tokyo, Hakone and Kyoto with a private guide and a ryokan night.', style: 'Bespoke Private', pace: 'Balanced', rating: 4.8, nights: 10, season: 'Any date', price: 310000, image: U('1492571350019-22de08371fd3'), to: '/japan' }),
  T({ id: 'jp-luxe', title: 'Ryokans & Art Islands', blurb: 'Design hotels, private onsen and the Naoshima art islands.', style: 'Luxury', pace: 'Relaxed', rating: 4.9, nights: 9, season: 'Year-round', price: 420000, image: U('1493976040374-85c8e12f0c0e'), to: '/japan' }),
  T({ id: 'jp-kyoto', title: 'Tailor-made Kyoto & Kanazawa', blurb: 'Old capitals, craft studios and quiet gardens, at your pace.', style: 'Bespoke Private', pace: 'Relaxed', rating: 4.8, nights: 8, season: 'Year-round', price: 335000, image: U('1522383225653-ed111181a951'), to: '/japan' }),
  T({ id: 'jp-rail', title: 'Luxury Japan by Rail', blurb: 'First-class Shinkansen and the finest stays, end to end.', style: 'Luxury', pace: 'Relaxed', rating: 4.9, nights: 11, season: 'Apr–Oct', price: 480000, image: U('1490806843957-31f4c9a91c65'), to: '/japan' }),
  T({ id: 'jp-family', title: 'Japan for Families', blurb: 'Robot cafés, bullet trains and easy days — a first Japan for all ages.', style: 'Bespoke Private', pace: 'Relaxed', rating: 4.7, nights: 12, season: 'Year-round', price: 340000, image: U('1540959733332-eab4deabeeaf'), to: '/japan' }),
  T({ id: 'jp-hokkaido', title: 'Hokkaido & the Northern Wilds', blurb: 'Lavender fields, volcano lakes and the crab counters of Sapporo.', style: 'Group Tour', pace: 'Active', rating: 4.7, nights: 9, season: 'Jun–Sep', price: 275000, image: U('1528360983277-13d401cdc186'), to: '/japan' }),
  T({ id: 'jp-kyushu', title: 'Southern Japan: Kyushu & Onsen', blurb: 'Steaming hot-spring towns, active volcanoes and quiet coastlines.', style: 'Bespoke Private', pace: 'Relaxed', rating: 4.8, nights: 10, season: 'Year-round', price: 355000, image: U('1493976040374-85c8e12f0c0e'), to: '/japan' }),
  T({ id: 'jp-winter', title: 'Winter Japan & Snow Monkeys', blurb: 'Snow-hushed temples, the Nagano macaques and steaming ryokan baths.', style: 'Group Tour', pace: 'Balanced', rating: 4.8, nights: 8, season: 'Dec–Feb', price: 240000, image: U('1492571350019-22de08371fd3'), to: '/japan' }),
];

const TOUR_COUNT = ALL_TOURS.length;
/* How many cards to reveal at a time — fewer on phones so the single-column
   list isn't an endless scroll, more on desktop where the grid is 2–3 wide. */
const PAGE_DESKTOP = 9;
const PAGE_MOBILE = 4;
const MOBILE_Q = '(max-width: 560px)';

/* ---- Filter vocabularies (Japan-appropriate subset of /journeys2). ---- */
const STYLES = ['Group Tour', 'Bespoke Private', 'Luxury'];
const PACES = ['Relaxed', 'Balanced', 'Active'];
const DURATIONS = [
  { value: 'short', label: 'Up to 8 nights', test: (n) => n <= 8 },
  { value: 'mid', label: '9–11 nights', test: (n) => n >= 9 && n <= 11 },
  { value: 'long', label: '12 nights +', test: (n) => n >= 12 },
];
const DURATION_TEST = Object.fromEntries(DURATIONS.map((d) => [d.value, d.test]));

const SORTS = [
  { key: 'recommended', label: 'Recommended' },
  { key: 'price-asc', label: 'Price · low to high' },
  { key: 'price-desc', label: 'Price · high to low' },
  { key: 'nights-desc', label: 'Duration · longest first' },
  { key: 'rating-desc', label: 'Rating · highest first' },
];

/* ---- Budget bounds, derived from the catalogue. ---- */
const _prices = ALL_TOURS.map((t) => t.price);
const PRICE_MIN = Math.floor(Math.min(..._prices) / 10000) * 10000;
const PRICE_MAX = Math.ceil(Math.max(..._prices) / 10000) * 10000;
const PRICE_STEP = 5000;
const fmtLakh = (v) => {
  const l = v / 100000;
  return `₹${(Number.isInteger(l) ? l : l.toFixed(1)).toString().replace(/\.0$/, '')}L`;
};
const BUDGET_PRESETS = [
  { label: '≤ ₹2.75L', v: 275000 },
  { label: '≤ ₹3.5L', v: 350000 },
].filter((p) => p.v > PRICE_MIN && p.v < PRICE_MAX);

/* ---- Quick country facts (the "little info about Japan" strip). ---- */
const FACTS = [
  { icon: CalendarDays, label: 'Best time', value: 'Mar–Apr (blossom) · Oct–Nov (autumn)' },
  { icon: Plane, label: 'Flight from India', value: '~7–9 hrs direct to Tokyo' },
  { icon: Landmark, label: 'Currency', value: 'Japanese Yen (¥)' },
  { icon: Languages, label: 'Language', value: 'Japanese · English in cities' },
  { icon: TrainFront, label: 'Getting around', value: 'JR Pass & bullet trains (Shinkansen)' },
];

/* ---- Regional highlights ("Where you'll go" — four corners). ---- */
const HIGHLIGHTS = [
  { name: 'Tokyo', note: 'Neon, sushi counters and pin-drop-calm gardens, all at once.', image: U('1540959733332-eab4deabeeaf'), to: '/journeys/japan/tokyo' },
  { name: 'Kyoto', note: 'A thousand temples, geisha lanes and moss-still Zen courtyards.', image: U('1493976040374-85c8e12f0c0e'), to: '/journeys/japan/kyoto' },
  { name: 'Mt Fuji & Hakone', note: 'Hot-spring ryokans in view of the sacred cone.', image: U('1490806843957-31f4c9a91c65'), to: '/journeys/japan/hakone' },
  { name: 'Osaka', note: "Japan's kitchen — street food, neon canals and easy nightlife.", image: U('1528360983277-13d401cdc186'), to: '/journeys/japan/osaka' },
];

/* ---- The food section — signature dishes people actually eat. ---- */
const DISHES = [
  { name: 'Sushi & Sashimi', tag: 'Tokyo', desc: 'Edo-style nigiri at a counter, cut to order — the purest taste of the sea.', image: U('1579584425555-c3ce17fd4351') },
  { name: 'Ramen', tag: 'Everywhere', desc: 'Rich tonkotsu, clear shoyu or miso — slurped fast at a steamy counter.', image: U('1557872943-16a5ac26437e') },
  { name: 'Tempura', tag: 'Kyoto', desc: 'Seafood and vegetables in a whisper-light, lace-crisp batter.', image: U('1615361200141-f45040f367be') },
  { name: 'Okonomiyaki', tag: 'Osaka', desc: 'The savoury griddle pancake — cabbage, batter and your pick of fillings.', image: U('1580822184713-fc5400e7fe10') },
  { name: 'Wagyu & Yakiniku', tag: 'Kobe', desc: 'Marbled beef seared over charcoal at your table, melt-soft.', image: U('1544025162-d76694265947') },
  { name: 'Matcha & Wagashi', tag: 'Uji · Kyoto', desc: 'Stone-ground green tea with delicate seasonal sweets — a quiet ritual.', image: U('1536256263959-770b48d82b0a') },
];

/* ---- A short, credible list of restaurant recommendations. ---- */
const RESTAURANTS = [
  { name: 'Sukiyabashi Jiro', city: 'Ginza, Tokyo', note: 'The legendary sushi counter — a bucket-list omakase. Book far ahead.', price: '¥¥¥¥', image: U('1579584425555-c3ce17fd4351') },
  { name: 'Ichiran Ramen', city: 'Shibuya, Tokyo', note: 'Solo-booth tonkotsu ramen, dialled exactly to your taste. Casual & iconic.', price: '¥¥', image: U('1557872943-16a5ac26437e') },
  { name: 'Kikunoi Honten', city: 'Higashiyama, Kyoto', note: 'Three-Michelin-star kaiseki — Japan’s seasonal haute cuisine.', price: '¥¥¥¥', image: U('1536256263959-770b48d82b0a') },
  { name: 'Mizuno', city: 'Dotonbori, Osaka', note: 'A Michelin-listed okonomiyaki institution on the canal. Expect a queue.', price: '¥¥', image: U('1580822184713-fc5400e7fe10') },
  { name: 'Gion Karyo', city: 'Gion, Kyoto', note: 'Approachable kaiseki in a machiya townhouse — beauty without the ceremony.', price: '¥¥¥', image: U('1615361200141-f45040f367be') },
  { name: 'Afuri', city: 'Ebisu, Tokyo', note: 'Bright yuzu-shio ramen — a lighter, modern take worth the detour.', price: '¥¥', image: U('1591814468924-caf88d1232e1') },
];

/* ---- Traveller reviews (Japan trips) — the /improved marquee shape:
   a trip photo + a quote with the traveller's avatar, name & city. ---- */
const REVIEWS = [
  { name: 'Ananya & Rohan Mehta', location: 'Mumbai', tour: 'Cherry Blossom Japan', rating: 5, text: 'The petals fell exactly when they promised. Every ryokan, every bullet-train seat, every dinner reservation was handled — we just showed up and fell in love with Japan.', avatar: U('1545167622-3a6ac756afa4'), tripPhoto: U('1522383225653-ed111181a951') },
  { name: 'Suresh Iyer', location: 'Bengaluru', tour: 'Japan for Families', rating: 5, text: 'Two kids, my parents and us — and not one dull hour. The pace was gentle, the guides endlessly patient, and the little touches made it unforgettable.', avatar: U('1633332755192-727a05c4013d'), tripPhoto: U('1540959733332-eab4deabeeaf') },
  { name: 'Vikram Desai', location: 'Delhi', tour: 'Luxury Japan by Rail', rating: 5, text: 'First-class Shinkansen, faultless hotels and a curator who anticipated everything. This is how Japan should be travelled — effortless, and quietly extraordinary.', avatar: U('1500648767791-00dcc994a43e'), tripPhoto: U('1490806843957-31f4c9a91c65') },
  { name: 'Sunita Rao', location: 'Hyderabad', tour: 'Japan in Autumn Colours', rating: 5, text: 'The maples in Kyoto were on fire with colour, timed to the day. A once-in-a-lifetime week, arranged with such care that nothing ever felt rushed.', avatar: U('1438761681033-6461ffad8d80'), tripPhoto: U('1528360983277-13d401cdc186') },
  { name: 'The Nair Family', location: 'Pune', tour: 'Essence of Japan with Hakone', rating: 5, text: 'Mt Fuji from the ryokan window, the kids wide-eyed on the bullet train, and a guide who felt like family by day three. Faultless from start to finish.', avatar: U('1552058544-f2b08422138a'), tripPhoto: U('1493976040374-85c8e12f0c0e') },
];

/* Brand marks for the review-credibility strip (inline, no asset deps). */
const GoogleG = () => (
  <svg viewBox="0 0 48 48" width="16" height="16" aria-hidden="true">
    <path fill="#4285F4" d="M47.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h13.2c-.6 3-2.3 5.6-4.9 7.3v6h7.9c4.6-4.3 7.3-10.5 7.3-17.8z" />
    <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.9-6c-2.2 1.5-5 2.3-8 2.3-6.1 0-11.3-4.1-13.2-9.6H2.6v6.2C6.6 42.6 14.6 48 24 48z" />
    <path fill="#FBBC05" d="M10.8 28.9c-.5-1.5-.8-3-.8-4.6s.3-3.1.8-4.6v-6.2H2.6C.9 16.1 0 19.9 0 24s.9 7.9 2.6 11.1l8.2-6.2z" />
    <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.9 2.4 30.5 0 24 0 14.6 0 6.6 5.4 2.6 13.4l8.2 6.2C12.7 13.6 17.9 9.5 24 9.5z" />
  </svg>
);
const TripAdvisorOwl = () => (
  <svg viewBox="0 0 132 80" width="24" height="15" aria-hidden="true">
    <circle cx="38" cy="42" r="32" fill="#34E0A1" />
    <circle cx="94" cy="42" r="32" fill="#34E0A1" />
    <circle cx="38" cy="42" r="18" fill="#fff" />
    <circle cx="94" cy="42" r="18" fill="#fff" />
    <circle cx="38" cy="42" r="9" fill="#000" />
    <circle cx="94" cy="42" r="9" fill="#000" />
    <path d="M52 2 Q66 14 80 2 L66 22 Z" fill="#000" />
  </svg>
);

/* ---- People also view — other CK journeys, linking into /journeys. ---- */
const SIMILAR = [
  { title: 'Summer in Switzerland', region: 'Switzerland', nights: '10 nights', season: 'Jun–Sep', price: '₹2.45L', image: U('1530122037265-a5f1f91d3b99'), to: '/journeys?where=Switzerland' },
  { title: 'Slow Italy: Coast to Art', region: 'Italy', nights: '9 nights', season: 'Apr–Oct', price: '₹2.4L', image: U('1534445867742-43195f401b6c'), to: '/journeys?where=Italy' },
  { title: 'Chasing the Northern Lights', region: 'Scandinavia', nights: '7 nights', season: 'Oct–Mar', price: '₹2.75L', image: U('1483347756197-71ef80e95f73'), to: '/journeys?where=Northern Lights' },
  { title: 'Vietnam & Cambodia Discovery', region: 'Southeast Asia', nights: '12 nights', season: 'Oct–Apr', price: '₹1.2L', image: U('1528181304800-259b08848526'), to: '/journeys?where=Southeast Asia' },
];

/* ---- Nav megamenu — Japan items route into THIS page / its tours. ---- */
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
      { label: 'Japan', desc: 'Cherry blossom to neon', to: '/journeys/japan-2' },
      { label: 'Switzerland', desc: 'Alpine railways & lakes', to: '/journeys?where=Switzerland' },
      { label: 'Italy', desc: 'Cities, coast & countryside', to: '/journeys?where=Italy' },
      { label: 'Northern Lights', desc: 'Arctic winter skies', to: '/journeys?where=Northern Lights' },
      { label: 'Africa Safari', desc: 'Big-five wilderness', to: '/journeys?where=Africa Safari' },
      { label: 'All destinations', desc: 'Browse every journey', to: '/journeys' },
    ],
  },
  {
    label: 'Japan', href: '/journeys/japan-2',
    blurb: 'Cherry blossom to neon — our most-loved country, many ways.',
    items: [
      { label: 'Cherry Blossom Japan', desc: '13 nights · Mar–Apr', to: '/japan' },
      { label: 'Japan for First-Timers', desc: '10 nights · any date', to: '/japan' },
      { label: 'Ryokans & Art Islands', desc: '9 nights · slow luxury', to: '/japan' },
      { label: 'All Japan journeys', desc: 'The full collection', to: '/journeys/japan-2' },
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

/* ---- Reduced-motion-safe reveal (matches /improved & Journeys). ---- */
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

/* A single journey card — mirrors /journeys exactly. */
function JourneyCard({ j, i, onPhotos }) {
  const waHref = `${CONTACT.whatsappHref}?text=${encodeURIComponent(`Hi Cox & Kings, I'd like to enquire about the "${j.title}" journey.`)}`;
  const isGroup = j.tourType === 'Group Tour';
  return (
    <Reveal className="jl-card" delay={(i % 3) * 0.05} y={24} as="article">
      <div className="jl-card-media">
        <Link to={j.to} className="jl-card-media-link" aria-label={`${j.title} — view itinerary`}>
          <img src={img(j.image, 800)} alt={j.title} loading="lazy" />
        </Link>
        <span className={`jl4-tourtype${isGroup ? ' is-group' : ' is-private'}`}>
          {isGroup ? <Users size={13} aria-hidden="true" /> : <User size={13} aria-hidden="true" />}
          {j.tourType}
        </span>
        <span className="jl-card-rating"><Star size={12} fill="currentColor" aria-hidden="true" /> {j.rating.toFixed(1)}</span>
        <span className="jl-card-region"><MapPin size={12} aria-hidden="true" /> Japan</span>
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

/* Photo lightbox — cycles a tour's gallery without leaving the page. */
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

/* A single open filter group in the sidebar — labelled section with a list
   of always-visible checkbox rows, each with a live match count. Mirrors
   the /journeys2 FilterGroup exactly. */
function FilterGroup({ id, title, icon: Icon, options, selected, onToggle, counts }) {
  const labelId = `jj2grp-${id}`;
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

/* Wrapper that gives a control the same eyebrow + rhythm as FilterGroup. */
function FilterField({ id, title, icon: Icon, children }) {
  const labelId = `jj2grp-${id}`;
  return (
    <div className="j2-group" role="group" aria-labelledby={labelId}>
      <p className="j2-group-title" id={labelId}>
        {Icon && <Icon size={14} aria-hidden="true" />} {title}
      </p>
      {children}
    </div>
  );
}

/* Budget = a single "up to" ceiling — a chunky one-thumb slider plus one-tap
   preset pills. Mirrors the /journeys2 BudgetPicker. */
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

/* A horizontal carousel — the /journeys shelf chrome, reused for the two
   food rails on this page. */
function Rail({ label, title, sub, id, children, railClass = '' }) {
  const railRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

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
    const card = el.firstElementChild;
    const step = (card ? card.offsetWidth : 320) + 16;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  return (
    <section className="jl-shelf" aria-labelledby={id}>
      <div className="jl-shelf-head">
        <div className="jl-shelf-heading">
          <Reveal className="h26-label jl-shelf-label" as="p">{label}</Reveal>
          <Reveal as="h2" className="jl-shelf-title" delay={0.04} id={id}>{title}</Reveal>
          <Reveal as="p" className="jl-shelf-sub" delay={0.08}>{sub}</Reveal>
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
      <div className={`jl-rail ${railClass}`} ref={railRef} role="group" aria-label={`${title} — scroll for more`}>
        {children}
      </div>
    </section>
  );
}

/* A single dish tile for the food carousel. */
function DishCard({ d }) {
  return (
    <article className="jp-dish">
      <div className="jp-dish-media">
        <img src={img(d.image, 640)} alt={d.name} loading="lazy" />
        <span className="jp-dish-tag"><MapPin size={12} aria-hidden="true" /> {d.tag}</span>
      </div>
      <div className="jp-dish-body">
        <h3 className="jp-dish-name">{d.name}</h3>
        <p className="jp-dish-desc">{d.desc}</p>
      </div>
    </article>
  );
}

/* A compact restaurant tile for the recommendations carousel. */
function RestoCard({ r }) {
  const bookHref = `${CONTACT.whatsappHref}?text=${encodeURIComponent(`Hi Cox & Kings, I'd like to book a table at ${r.name} (${r.city}) as part of my Japan trip.`)}`;
  return (
    <article className="jp-resto-card">
      <div className="jp-resto-media">
        <img src={img(r.image, 420)} alt={r.name} loading="lazy" />
        <span className="jp-resto-price">{r.price}</span>
      </div>
      <div className="jp-resto-body">
        <h4 className="jp-resto-name">{r.name}</h4>
        <span className="jp-resto-city"><MapPin size={12} aria-hidden="true" /> {r.city}</span>
        <p className="jp-resto-note">{r.note}</p>
        <a
          href={bookHref}
          target="_blank"
          rel="noopener noreferrer"
          className="jp-resto-book"
          aria-label={`Book a table at ${r.name}`}
        >
          <Utensils size={14} aria-hidden="true" /> Book a table
        </a>
      </div>
    </article>
  );
}

export default function JapanJourneys2() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [chatOpen, setChatOpen] = useState(false); // Enaya popup

  /* Filter state. */
  const [filtersOpen, setFiltersOpen] = useState(false); // mobile drawer
  const [styles, setStyles] = useState([]);
  const [paces, setPaces] = useState([]);
  const [durations, setDurations] = useState([]);
  const [budgetMax, setBudgetMax] = useState(PRICE_MAX);
  const [sort, setSort] = useState('recommended');
  const [sortOpen, setSortOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.matchMedia(MOBILE_Q).matches);
  const pageSize = isMobile ? PAGE_MOBILE : PAGE_DESKTOP;
  const [visible, setVisible] = useState(pageSize);
  const sortRef = useRef(null);

  const openPhotos = useCallback((j) => setLightbox({ title: j.title, photos: j.gallery, index: 0 }), []);

  const toggler = (setter) => (value) =>
    setter((cur) => (cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value]));

  /* Nav goes solid once the page scrolls off the dark banner. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Track the phone breakpoint so the initial card count adapts. */
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_Q);
    const on = () => setIsMobile(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  /* Lock body scroll while a menu / drawer / lightbox is open. */
  useEffect(() => {
    const lock = menuOpen || filtersOpen || !!lightbox;
    document.body.style.overflow = lock ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen, filtersOpen, lightbox]);

  /* Close the sort menu on outside click / Escape. */
  useEffect(() => {
    if (!sortOpen) return;
    const onDoc = (e) => { if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setSortOpen(false); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, [sortOpen]);

  /* Does a tour pass every active filter group? `skip` drops one group
     (used for live per-option counts). AND across groups, OR within. */
  const passes = useCallback((t, skip) => {
    if (skip !== 'style' && styles.length && !styles.includes(t.style)) return false;
    if (skip !== 'pace' && paces.length && !paces.includes(t.pace)) return false;
    if (skip !== 'duration' && durations.length && !durations.some((d) => DURATION_TEST[d](t.nights))) return false;
    if (skip !== 'budget' && t.price > budgetMax) return false;
    return true;
  }, [styles, paces, durations, budgetMax]);

  /* Filtered + sorted result set. */
  const results = useMemo(() => {
    let list = ALL_TOURS.filter((t) => passes(t));
    const by = {
      'price-asc': (a, b) => a.price - b.price,
      'price-desc': (a, b) => b.price - a.price,
      'nights-desc': (a, b) => b.nights - a.nights,
      'rating-desc': (a, b) => b.rating - a.rating,
    }[sort];
    if (by) list = [...list].sort(by);
    return list;
  }, [passes, sort]);

  /* Per-option counts — hold the OTHER groups fixed. */
  const counts = useMemo(() => {
    const count = (skip, matcher) => {
      const base = ALL_TOURS.filter((t) => passes(t, skip));
      const out = {};
      for (const [value, test] of matcher) out[value] = base.filter(test).length;
      return out;
    };
    return {
      style: count('style', STYLES.map((s) => [s, (t) => t.style === s])),
      pace: count('pace', PACES.map((p) => [p, (t) => t.pace === p])),
      duration: count('duration', DURATIONS.map((d) => [d.value, (t) => d.test(t.nights)])),
    };
  }, [passes]);

  /* Reset the visible window whenever the result set or breakpoint changes. */
  useEffect(() => { setVisible(pageSize); }, [styles, paces, durations, budgetMax, sort, pageSize]);

  const budgetActive = budgetMax < PRICE_MAX;
  const totalActive = styles.length + paces.length + durations.length + (budgetActive ? 1 : 0);
  const clearAll = () => { setStyles([]); setPaces([]); setDurations([]); setBudgetMax(PRICE_MAX); };

  /* "How would you like to travel" — pick a lane, pre-set the listing's
     trip-style filter and jump UP to it. Move focus to the listing heading
     so keyboard/SR users aren't stranded at the bottom; the result count
     (aria-live) announces what changed. */
  const chooseStyles = (styleList) => {
    setStyles(styleList); setPaces([]); setDurations([]); setBudgetMax(PRICE_MAX);
    const el = document.getElementById('tours');
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    const heading = el.querySelector('h2');
    if (heading) { heading.setAttribute('tabindex', '-1'); heading.focus({ preventScroll: true }); }
  };

  const sortLabel = SORTS.find((s) => s.key === sort)?.label;
  const shown = results.slice(0, visible);

  /* The whole sidebar body — shared by the desktop rail and mobile drawer. */
  const filterBody = (
    <>
      <FilterGroup
        id="style" title="Trip style" icon={Compass}
        options={STYLES.map((s) => ({ value: s, label: s }))}
        selected={styles} onToggle={toggler(setStyles)} counts={counts.style}
      />
      <FilterGroup
        id="pace" title="Pace" icon={Gauge}
        options={PACES.map((p) => ({ value: p, label: `${p} pace` }))}
        selected={paces} onToggle={toggler(setPaces)} counts={counts.pace}
      />
      <FilterGroup
        id="duration" title="Duration" icon={Clock}
        options={DURATIONS.map((d) => ({ value: d.value, label: d.label }))}
        selected={durations} onToggle={toggler(setDurations)} counts={counts.duration}
      />
      <FilterField id="budget" title="Budget (per person)" icon={Wallet}>
        <BudgetPicker
          value={budgetMax} min={PRICE_MIN} max={PRICE_MAX} step={PRICE_STEP}
          onChange={setBudgetMax}
        />
      </FilterField>
    </>
  );

  return (
    <>
    <div className="h26 jl jl2 jp jj2">
      <a className="h26-skip" href="#tours">Skip to journeys</a>

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
            <Link to="/journeys/japan-2" onClick={() => setMenuOpen(false)}>Japan journeys<span className="h26-menu-chev"><ArrowRight size={16} /></span></Link>
            <Link to="/japan" onClick={() => setMenuOpen(false)}>Cherry Blossom Japan<span className="h26-menu-chev"><ArrowRight size={16} /></span></Link>
            <Link to="/essence-japan" onClick={() => setMenuOpen(false)}>Essence of Japan<span className="h26-menu-chev"><ArrowRight size={16} /></span></Link>
            <Link to="/journeys" onClick={() => setMenuOpen(false)}>All destinations<span className="h26-menu-chev"><ArrowRight size={16} /></span></Link>
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

      {/* ---------- HERO BANNER (kept) ---------- */}
      <section className="jl-hero">
        <div className="jl-hero-bg" style={{ backgroundImage: `url(${img(HERO_IMG, 1800)})` }} aria-hidden="true" />
        <div className="jl-hero-veil" aria-hidden="true" />
        <div className="jl-hero-inner">
          <Reveal className="h26-label jl-hero-eyebrow" as="p">
            Japan · {TOUR_COUNT} handcrafted journeys
          </Reveal>
          <h1 className="jl-hero-title">
            <WordReveal text="Japan, at your own pace" accent={[0]} />
          </h1>
          <Reveal className="jl-hero-sub" as="p" delay={0.15}>
            Cherry blossom to neon, temple gardens to bullet trains — the land of the rising sun,
            shaped by specialists who know it first-hand. A little about the country, our Japan
            journeys, and the food you simply have to eat while you're there.
          </Reveal>
          <Reveal className="jp-hero-actions" as="div" delay={0.24}>
            <a href="#tours" className="h26-btn h26-btn-accent h26-btn-lg">View Japan journeys <ArrowRight size={16} /></a>
            <a href="#food" className="h26-btn h26-btn-glass h26-btn-lg"><Utensils size={16} /> What to eat</a>
          </Reveal>
        </div>
      </section>

      {/* ---------- A LITTLE ABOUT JAPAN (kept — intro + facts) ---------- */}
      <section className="jp-about" aria-labelledby="about-japan">
        <span className="jp-about-glyph" aria-hidden="true">日本</span>
        <div className="jp-wrap">
          <div className="jp-about-top">
            <div className="jp-about-intro">
              <Reveal className="h26-label jp-eyebrow" as="p">The destination</Reveal>
              <Reveal as="h2" className="jp-title" id="about-japan" delay={0.04}>
                A little about <em>Japan</em>
              </Reveal>
              <Reveal as="p" className="jp-lede" delay={0.08}>
                Few countries hold their opposites so gracefully. In Japan, a 1,300-year-old temple
                stands a train stop from the world's busiest crossing; a bullet train glides at 300 km/h
                past rice paddies unchanged for centuries. It is spotless, courteous and astonishingly
                easy to travel — and endlessly rewarding for the curious.
              </Reveal>
            </div>

            <Reveal className="jp-facts" delay={0.12} as="aside">
              <p className="jp-facts-title">Good to know</p>
              {FACTS.map((f) => (
                <div className="jp-fact" key={f.label}>
                  <span className="jp-fact-ic"><f.icon size={17} aria-hidden="true" /></span>
                  <div className="jp-fact-txt">
                    <span className="jp-fact-label">{f.label}</span>
                    <span className="jp-fact-value">{f.value}</span>
                  </div>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- THE JAPAN JOURNEYS — filter rail + sortable grid ---------- */}
      <section className="jj2-tours" id="tours">
        <div className="jj2-tours-head">
          <Reveal className="h26-label jp-eyebrow" as="p">The journeys</Reveal>
          <Reveal as="h2" className="jp-title" delay={0.04}>
            Every Japan journey, <em>one collection</em>
          </Reveal>
          <Reveal as="p" className="jj2-tours-sub" delay={0.08}>
            Escorted group departures and private, tailor-made trips — filter by how you like to
            travel, your pace, your budget and how long you have.
          </Reveal>
        </div>

        <main className="jl2-shell jj2-shell">
          {/* Mobile filter trigger (the journey count lives in the results
              head just below, so it isn't repeated here). */}
          <div className="jl2-mobilebar">
            <button type="button" className="jl2-filter-toggle" onClick={() => setFiltersOpen(true)}>
              <SlidersHorizontal size={16} aria-hidden="true" />
              Filters
              {totalActive > 0 && <span className="jl2-filter-badge">{totalActive}</span>}
            </button>
          </div>

          {/* ----- LEFT: filter sidebar (a drawer on mobile) ----- */}
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
                <strong>{results.length}</strong> {results.length === 1 ? 'journey' : 'journeys'} · Japan
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
                {styles.map((s) => (
                  <button key={s} type="button" className="jl-active-chip" onClick={() => toggler(setStyles)(s)}>{s} <X size={13} /></button>
                ))}
                {paces.map((p) => (
                  <button key={p} type="button" className="jl-active-chip" onClick={() => toggler(setPaces)(p)}>{p} pace <X size={13} /></button>
                ))}
                {durations.map((d) => (
                  <button key={d} type="button" className="jl-active-chip" onClick={() => toggler(setDurations)(d)}>
                    {DURATIONS.find((x) => x.value === d)?.label} <X size={13} />
                  </button>
                ))}
                {budgetActive && (
                  <button type="button" className="jl-active-chip" onClick={() => setBudgetMax(PRICE_MAX)}>
                    Up to {fmtLakh(budgetMax)} <X size={13} />
                  </button>
                )}
                <button type="button" className="jl-clear-all" onClick={clearAll}>Clear all</button>
              </div>
            )}

            {results.length > 0 ? (
              <>
                <div className="jl-grid jl2-grid">
                  {shown.map((j, i) => <JourneyCard key={j.id} j={j} i={i} onPhotos={openPhotos} />)}
                </div>
                {results.length > visible && (
                  <div className="jj2-more">
                    <span className="jj2-more-count">Showing {shown.length} of {results.length} journeys</span>
                    <button type="button" className="jj2-more-btn" onClick={() => setVisible((v) => v + pageSize)}>
                      Show more journeys <Plus size={16} aria-hidden="true" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="jl-empty">
                <span className="jl-empty-icon"><Compass size={30} aria-hidden="true" /></span>
                <h2>No journeys match just yet</h2>
                <p>
                  We design tailor-made Japan trips for any date, pace and budget. Loosen a filter,
                  or tell a specialist exactly what you're after — we'll build it.
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
      </section>

      {/* ---------- HOW WOULD YOU LIKE TO TRAVEL — compact fork ---------- */}
      <section className="jj2-choose" id="how-to-travel" aria-labelledby="fork-japan">
        <div className="jp-wrap">
          <div className="jj2-choose__head">
            <Reveal className="h26-label" as="p">Start here</Reveal>
            <Reveal as="h2" className="jj2-choose__title" id="fork-japan" delay={0.04}>
              How would you like to <em>travel</em>?
            </Reveal>
          </div>

          <Reveal className="jj2-picks" y={18} delay={0.06}>
            <button
              type="button"
              className="jj2-pick"
              onClick={() => chooseStyles(['Group Tour'])}
              aria-label="See group journeys — filters the list above to escorted small-group tours"
            >
              <span className="jj2-pick__thumb" aria-hidden="true">
                <img src={img(U('1528360983277-13d401cdc186'), 180)} alt="" loading="lazy" />
              </span>
              <span className="jj2-pick__body">
                <h3 className="jj2-pick__title">Group tours</h3>
                <p className="jj2-pick__desc">Escorted small groups, everything handled.</p>
              </span>
              <ArrowRight size={17} className="jj2-pick__arrow" aria-hidden="true" />
            </button>

            <button
              type="button"
              className="jj2-pick"
              onClick={() => chooseStyles(['Bespoke Private', 'Luxury'])}
              aria-label="See private journeys — filters the list above to private, tailor-made tours"
            >
              <span className="jj2-pick__thumb" aria-hidden="true">
                <img src={img(U('1490806843957-31f4c9a91c65'), 180)} alt="" loading="lazy" />
              </span>
              <span className="jj2-pick__body">
                <h3 className="jj2-pick__title">Private &amp; tailor-made</h3>
                <p className="jj2-pick__desc">Designed one-to-one, at your own pace.</p>
              </span>
              <ArrowRight size={17} className="jj2-pick__arrow" aria-hidden="true" />
            </button>

            <button
              type="button"
              className="jj2-pick jj2-pick--ai"
              onClick={() => setChatOpen(true)}
              aria-label="Design a trip with Enaya, our AI travel designer"
            >
              <span className="jj2-pick__thumb" aria-hidden="true">
                <img src={img(U('1540959733332-eab4deabeeaf'), 180)} alt="" loading="lazy" />
                <span className="jj2-pick__spark"><Sparkles size={15} strokeWidth={1.9} /></span>
              </span>
              <span className="jj2-pick__body">
                <h3 className="jj2-pick__title">Design it with Enaya</h3>
                <p className="jj2-pick__desc">Not sure yet? Shape a trip around you.</p>
              </span>
              <ArrowRight size={17} className="jj2-pick__arrow" aria-hidden="true" />
            </button>
          </Reveal>
        </div>
      </section>

      {/* ---------- FOOD & RESERVATIONS (kept — on a BEIGE surface) ---------- */}
      <section className="jp-food" id="food" aria-labelledby="rail-food">
        <div className="jl-collections">
          <Rail
            id="rail-food"
            label="What's on the table"
            title="The food people eat in Japan"
            sub="Regional, seasonal and taken seriously — from a ¥900 bowl of ramen to a hushed kaiseki tasting. Swipe through the dishes you'll actually eat."
            railClass="jl-rail-food"
          >
            {DISHES.map((d) => <DishCard key={d.name} d={d} />)}
          </Rail>

          <Rail
            id="rail-resto"
            label="Reservations"
            title="Where to eat — our recommendations"
            sub="From bucket-list counters to easy neighbourhood favourites — swipe through, and book the table as part of your trip."
            railClass="jl-rail-resto"
          >
            {RESTAURANTS.map((r) => <RestoCard key={r.name} r={r} />)}
          </Rail>
        </div>
        <div className="jp-resto-footwrap">
          <Reveal as="p" className="jp-resto-foot" delay={0.1}>
            Want a table at any of these? Your Cox &amp; Kings specialist can request reservations
            as part of your itinerary — including the counters that book out months ahead.
          </Reveal>
        </div>
      </section>

      {/* ---------- WHERE YOU'LL GO — four corners (standalone) ---------- */}
      <section className="jj2-where" aria-labelledby="where-japan">
        <div className="jp-wrap">
          <div className="jj2-where-head">
            <Reveal className="h26-label jp-eyebrow" as="p">Where you'll go</Reveal>
            <Reveal as="h2" className="jj2-where-title" id="where-japan" delay={0.04}>
              Four corners of <em>the country</em>
            </Reveal>
            <Reveal as="p" className="jj2-where-sub" delay={0.08}>
              Each worth the journey on its own — and easily linked by the world's finest railway.
            </Reveal>
          </div>
          <div className="jp-highlights">
            {HIGHLIGHTS.map((h, i) => (
              <Reveal className="jp-hl" key={h.name} delay={0.05 * i} y={24} as="article">
                <Link to={h.to} className="jp-hl-link" aria-label={`Explore ${h.name} — journeys, food & more`}>
                  <div className="jp-hl-media">
                    <img src={img(h.image, 700)} alt={h.name} loading="lazy" />
                    <span className="jp-hl-scrim" aria-hidden="true" />
                    <div className="jp-hl-cap">
                      <span className="jp-hl-idx">{String(i + 1).padStart(2, '0')}</span>
                      <h3 className="jp-hl-name">{h.name}</h3>
                      <p className="jp-hl-note">{h.note}</p>
                      <span className="jp-hl-cta">Explore {h.name} <ArrowRight size={15} aria-hidden="true" /></span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- REVIEWS — marquee of real travellers (design from /improved) ---------- */}
      <section className="h26-reviews" id="reviews">
        <div className="h26-head">
          <Reveal className="h26-label" as="p">Travelled, and came back happy</Reveal>
          <Reveal as="h2" className="h26-h2" delay={0.05}>Travellers who trusted us with Japan.</Reveal>
          <Reveal as="p" className="hi-rev-sub" delay={0.1}>Couples and honeymooners, multi-generational families, friends and solo explorers.</Reveal>
        </div>

        {/* Independent-rating trust strip: overall score + Google / Tripadvisor */}
        <Reveal className="hi-rtrust">
          <div className="hi-rtrust-overall">
            <strong>4.9</strong>
            <div className="hi-rtrust-overall-meta">
              <span className="hi-rtrust-stars" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, k) => <Star key={k} size={15} fill="currentColor" />)}
              </span>
              <span className="hi-rtrust-sub">Excellent · 2,400+ verified reviews</span>
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
              <span><strong>4.9</strong> on <b>Tripadvisor</b></span>
            </span>
          </div>
        </Reveal>

        <div className="h26-marquee">
          <div className="h26-marquee-track">
            {[...REVIEWS, ...REVIEWS].map((r, i) => (
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
        <Reveal className="h26-reviews-more" delay={0.1}>
          <Link to="/improved#reviews" className="h26-btn h26-btn-pill">View all reviews <ArrowUpRight size={16} /></Link>
        </Reveal>
      </section>

      {/* ---------- PEOPLE ALSO VIEW ---------- */}
      <section className="jj2-pav" aria-labelledby="pav-japan">
        <div className="jp-wrap">
          <div className="jj2-pav-head">
            <div>
              <Reveal className="h26-label jp-eyebrow" as="p">Travellers also considered</Reveal>
              <Reveal as="h2" className="jj2-pav-title" id="pav-japan" delay={0.04}>
                People also <strong>view</strong>
              </Reveal>
            </div>
            <Reveal as="div" delay={0.06}>
              <Link to="/journeys" className="jj2-pav-link">Browse all journeys <ArrowUpRight size={16} aria-hidden="true" /></Link>
            </Reveal>
          </div>
          <div className="jj2-pav-grid">
            {SIMILAR.map((s, i) => (
              <Reveal key={s.title} delay={0.05 * i} y={24} as="div">
                <Link to={s.to} className="jj2-pav-card">
                  <div className="jj2-pav-media">
                    <img src={img(s.image, 700)} alt={s.title} loading="lazy" />
                    <span className="jj2-pav-region"><MapPin size={12} aria-hidden="true" /> {s.region}</span>
                  </div>
                  <div className="jj2-pav-body">
                    <h3 className="jj2-pav-name">{s.title}</h3>
                    <div className="jj2-pav-meta">
                      <Clock size={13} aria-hidden="true" /> {s.nights}
                      <span aria-hidden="true">·</span>
                      <Calendar size={13} aria-hidden="true" /> {s.season}
                    </div>
                    <div className="jj2-pav-foot">
                      <span className="jj2-pav-price">from {s.price} <small>pp</small></span>
                      <span className="jj2-pav-go">View <ArrowRight size={15} aria-hidden="true" /></span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CLOSING CTA (kept) ---------- */}
      <section className="jl-cta">
        <div className="jl-cta-bg" style={{ backgroundImage: `url(${img(U('1493976040374-85c8e12f0c0e'), 1800)})` }} aria-hidden="true" />
        <div className="jl-cta-veil" aria-hidden="true" />
        <div className="jl-cta-inner">
          <Reveal className="h26-label jl-cta-eyebrow" as="span">Dreaming of Japan?</Reveal>
          <Reveal as="h2" className="jl-cta-title" delay={0.05}>
            Tell us when you'd like to go.<br /><strong>We'll shape the perfect Japan around you.</strong>
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
              <h4>Japan</h4>
              <Link to="/japan">Cherry Blossom Japan</Link>
              <Link to="/essence-japan">Essence of Japan</Link>
              <Link to="/journeys/japan-2">All Japan journeys</Link>
              <Link to="/journeys">Other destinations</Link>
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

      {/* ---------- MOBILE BOTTOM BAR — talk to a specialist
           (mirrors /tour-detail-japan-5's thumb-reach bar) ---------- */}
      <div className="jj2-thumbbar">
        <div className="jj2-thumbbar__nudge">
          <small>Got questions about Japan?</small>
          <strong>A specialist can help — free</strong>
        </div>
        <a
          href={CONTACT.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="jj2-thumbbar__chat"
        >
          <MessageCircle size={18} aria-hidden="true" /> Chat with a specialist
        </a>
        <a href={CONTACT.phoneHref} className="jj2-thumbbar__ico" aria-label="Call a specialist"><Phone size={20} aria-hidden="true" /></a>
      </div>

      {/* ---------- ENAYA — floating "Ask Enaya" button (exactly like /new-homepage) ---------- */}
      <button
        className={`lx2i-aifab ${chatOpen ? 'is-hidden' : ''}`}
        aria-label="Open Enaya, the AI travel assistant"
        onClick={() => setChatOpen(true)}
      >
        <Sparkles size={20} />
        <span>Ask Enaya</span>
      </button>

      {/* ---------- PHOTO LIGHTBOX ---------- */}
      <AnimatePresence>
        {lightbox && <Lightbox data={lightbox} onClose={() => setLightbox(null)} />}
      </AnimatePresence>
    </div>

    {/* ENAYA — the working AI concierge (from /new-homepage). Rendered OUTSIDE
        the page wrapper so scoped colour/font styles can't bleed in. */}
    <ChatBot open={chatOpen} onOpenChange={setChatOpen} hideFab name="Enaya" />
    </>
  );
}
