/* ============================================================
   Home2026 — scroll-activated luxury homepage for Cox & Kings.

   Design language: a cinematic Voyager-Blue backdrop stays FIXED
   while a warm-paper "sheet" of content scrolls up over it
   (the EarthSlice card-over-background mechanic), elevated with
   oversized Zodiak serif, blur-to-focus word reveals, a scattered
   floating image grid, a glass directed-search dock, and a
   circular reveal finale.

   Self-contained: brings its own header + footer. Does not touch
   the shared chrome or any other route.
   ============================================================ */
import { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { SmartLink as Link, CALLBACK } from '../components/ScheduleCall';
import { motion, useScroll, useTransform, useMotionValue, useSpring, useReducedMotion, AnimatePresence } from 'framer-motion';
import {
  Phone, MessageCircle, ArrowRight, ArrowUpRight, Star, Play,
  Search, MapPin, Compass, Calendar, Menu, X, ChevronDown,
  Bot, Instagram, Facebook, Youtube, Linkedin, ChevronUp, Send,
  Plane, BedDouble, Users, UtensilsCrossed, Check, ShieldCheck,
  Wallet, RotateCcw, Lock, Sparkles, Building2, Clock,
  Bookmark, Share2, Heart, Footprints,
} from 'lucide-react';
import {
  img, CONTACT, STATS, RATING, PRESS, PATHS, DESTINATIONS,
  ASSURANCE, JOURNEYS, REVIEWS, CURATIONS, EXPERTS, REELS,
  HERO_DESTINATIONS, HERO_TRIP_TYPES, HERO_WHEN,
} from '../data/v3content';
import './Home2026.css';
import './Home2026Improved.css';

/* /improved-only: Indian portrait faces for reviewers & specialists, to match
   the (already Indian) names. Overrides the shared v3content photos here only,
   so the reference page "/" is unchanged. */
const IMP_REVIEW_AVATARS = {
  'Anjali & Rohan Mehta': 'https://images.unsplash.com/photo-1628264047320-49bab8dc07d6',
  'Suresh Iyer': 'https://images.unsplash.com/photo-1624202090198-d6f758540f18',
  'Priya Nair': 'https://images.unsplash.com/photo-1496813146940-1601b02f81a4',
  'The Kapoor Family': 'https://images.unsplash.com/photo-1596604820148-da737958af16',
};
const IMP_EXPERT_PHOTOS = {
  'Meera Sundaram': 'https://images.unsplash.com/photo-1463335361701-e90f4c5045d0',
  'Arjun Rao': 'https://images.unsplash.com/photo-1618306842557-a2515acf2112',
  'Nisha Verma': 'https://images.unsplash.com/photo-1759840278361-f1adc75529a1',
};
const REVIEWS_IMP = REVIEWS.map((r) => ({ ...r, avatar: IMP_REVIEW_AVATARS[r.name] || r.avatar }));
const EXPERTS_IMP = EXPERTS.map((e) => ({ ...e, photo: IMP_EXPERT_PHOTOS[e.name] || e.photo }));

/* /improved-only contact override — new direct line, scoped here so the
   reference page "/" keeps the shared CONTACT number. */
const CONTACT_IMP = {
  ...CONTACT,
  phoneDisplay: '+91 8556001700',
  phoneHref: 'tel:+918556001700',
  whatsappHref: 'https://wa.me/918556001700',
};

/* /improved-only curation enrichments — concrete proof a high-ticket buyer
   asks for: a pace rating and named example stays, plus a softer "designed
   from" price wording on the genuinely tailor-made (bespoke/luxury) paths.
   Keyed by curation name; scoped here so the reference page "/" is unchanged. */
const CURATION_EXTRAS = {
  'Grand Switzerland & Italy': { pace: 'Relaxed', stays: 'e.g. Hotel Schweizerhof, Lucerne · Hotel Danieli, Venice', bespoke: false },
  'Japan for First-Timers':    { pace: 'Balanced', stays: 'e.g. The Tokyo Station Hotel · a traditional Hakone ryokan', bespoke: true },
  'Australia & New Zealand':   { pace: 'Relaxed', stays: 'e.g. Sofitel Sydney Darling Harbour · Sofitel Queenstown', bespoke: false },
  'Kenya Migration Safari':    { pace: 'Active', stays: 'e.g. Angama Mara · a private Maasai Mara conservancy camp', bespoke: true },
};
const CURATIONS_IMP = CURATIONS.map((c) => ({ ...c, ...(CURATION_EXTRAS[c.name] || {}) }));

/* Desktop nav megamenus — each top-level link expands on hover to reveal a
   curated set of in-page destinations (/improved only). The first entry of
   each group is the section the link already points to, so the header still
   behaves like a simple jump link for anyone who just clicks it. */
const NAV_MENU = [
  {
    label: 'Ways to travel', href: '#paths',
    blurb: 'Two ways to see the world — pick the one that fits you.',
    items: [
      { label: 'Escorted group tours', desc: 'Expert-led, fixed departures', href: '#paths' },
      { label: 'Tailor-made journeys', desc: 'Designed entirely around you', href: '#paths' },
      { label: 'Luxury & private travel', desc: 'Elevated stays and guiding', href: '#journeys' },
      { label: 'Help me decide', desc: 'Talk it through with a specialist', href: '#plan' },
    ],
  },
  {
    label: 'Destinations', href: '#destinations',
    blurb: 'Over 100 countries, shaped by specialists who know them first-hand.',
    items: [
      { label: 'Switzerland', desc: 'Alpine railways & lakes', to: '/journeys/japan' },
      { label: 'Japan', desc: 'Cherry blossom to neon', to: '/journeys/japan' },
      { label: 'Italy', desc: 'Cities, coast & countryside', to: '/journeys/japan' },
      { label: 'Northern Lights', desc: 'Arctic winter skies', to: '/journeys/japan' },
      { label: 'African Safari', desc: 'Big-five wilderness', to: '/journeys/japan' },
      { label: 'All destinations', desc: 'Browse the full map', to: '/journeys' },
    ],
  },
  {
    label: 'Journeys', href: '#journeys',
    blurb: 'Signature itineraries, ready to make your own.',
    items: [
      { label: 'Cherry Blossom Japan', desc: '13 nights · Mar–Apr', to: '/tour-detail-japan-4' },
      { label: 'Classic Switzerland', desc: 'Scenic rail & summits', to: '/tour-detail-japan-4' },
      { label: 'Northern Lights & Ice', desc: 'Arctic Scandinavia', to: '/tour-detail-japan-4' },
      { label: 'Ready when you are', desc: 'Hand-picked departures', to: '/journeys' },
    ],
  },
  {
    label: 'Why us', href: '#trust',
    blurb: 'Specialists, not salespeople — and 260 years behind every trip.',
    items: [
      { label: 'Our specialists', desc: 'The people who plan your trip', href: '#trust' },
      { label: 'Since 1758', desc: 'Heritage you can lean on', href: '#trust' },
      { label: 'Real reviews', desc: '2,400+ verified travellers', href: '#reviews' },
      { label: 'Talk to an expert', desc: 'We pick up the phone', href: '#plan' },
    ],
  },
];

/* --- Tabler icons (the Clips section uses the design-system icon set from
   Figma, not lucide). Inlined as small stroke SVGs; closed-path icons
   (play / heart / bookmark) fill solid when `filled` is set. --- */
const TiBase = ({ size = 24, filled = false, children, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true" {...rest}>{children}</svg>
);
const TiPlay = (p) => <TiBase filled {...p}><path d="M7 4v16l13 -8z" /></TiBase>;
const TiHeart = (p) => <TiBase {...p}><path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.572a5 5 0 1 1 7.5 6.572" /></TiBase>;
const TiBookmark = (p) => <TiBase {...p}><path d="M18 7v14l-6 -4l-6 4v-14a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4z" /></TiBase>;
const TiShare = (p) => (
  <TiBase {...p}>
    <path d="M6 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <path d="M18 6m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <path d="M18 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <path d="M8.7 10.7l6.6 -3.4" />
    <path d="M8.7 13.3l6.6 3.4" />
  </TiBase>
);
const TiMessage = (p) => (
  <TiBase {...p}>
    <path d="M3 20l1.3 -3.9a9 8 0 1 1 3.4 2.9l-4.7 1" />
    <path d="M12 12l0 .01" /><path d="M8 12l0 .01" /><path d="M16 12l0 .01" />
  </TiBase>
);
const TiSend = (p) => (
  <TiBase {...p}>
    <path d="M10 14l11 -11" />
    <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5" />
  </TiBase>
);
const TiChevronUp = (p) => <TiBase {...p}><path d="M6 15l6 -6l6 6" /></TiBase>;
const TiChevronDown = (p) => <TiBase {...p}><path d="M6 9l6 6l6 -6" /></TiBase>;
const TiX = (p) => <TiBase {...p}><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></TiBase>;

/* Per-thumbnail cursor-parallax depth (px of travel at full cursor offset).
   Mixed signs + magnitudes give the grid a layered, floating feel. */
const SCATTER_DEPTH = [34, -26, 44, -38, 28, -46, 22];

/* --- Reel "reviews" (comments) — light, per-clip traveller chatter --- */
const REEL_COMMENT_AUTHORS = [
  { n: 'Anjali Mehta', a: 'https://images.unsplash.com/photo-1628264047320-49bab8dc07d6' },
  { n: 'Suresh Iyer', a: 'https://images.unsplash.com/photo-1624202090198-d6f758540f18' },
  { n: 'Priya Nair', a: 'https://images.unsplash.com/photo-1496813146940-1601b02f81a4' },
  { n: 'Rohit Kapoor', a: 'https://images.unsplash.com/photo-1618306842557-a2515acf2112' },
];
const REEL_COMMENT_TEXTS = [
  (r) => `${r.place.split(',')[0]} just shot to the top of our list. Saved this! 😍`,
  (r) => `Booked our ${r.tag} trip with Cox & Kings after a reel like this — no regrets.`,
  (r) => `The colours are unreal. How many days do you need to do it properly?`,
  (r) => `That’s exactly the kind of trip my parents would love. Sending them this.`,
];
const REEL_COMMENT_LIKES = ['2.1k', '864', '413', '120'];
function buildReelComments(r) {
  return REEL_COMMENT_AUTHORS.map((au, i) => ({
    id: `${r.id}-c${i}`, name: au.n, avatar: au.a,
    text: REEL_COMMENT_TEXTS[i](r), likes: REEL_COMMENT_LIKES[i],
  }));
}

/* --- "When" calendar helpers --- */
const WK_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MON_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const FLEX_OPTS = [0, 1, 2, 3];
/* Build the 6-week grid (leading blanks as null) for a given month-start Date. */
function buildCalendar(monthStart) {
  const y = monthStart.getFullYear(), m = monthStart.getMonth();
  const firstDow = new Date(y, m, 1).getDay();
  const daysIn = new Date(y, m + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysIn; d++) cells.push(new Date(y, m, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}
const sameDay = (a, b) => a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

/* One floating thumbnail: scroll drift (y) blended with cursor parallax (x/y). */
function ScatterImg({ src, cls, driftY, mx, my, depth }) {
  const x = useTransform(mx, (v) => v * depth);
  const y = useTransform([driftY, my], ([d, m]) => d + m * depth * 0.6);
  return (
    <motion.img
      style={{ x, y }}
      whileHover={{ scale: 1.14, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
      className={`h26-scatter ${cls}`}
      src={src}
      alt=""
      loading="lazy"
    />
  );
}

/* Brand marks for the review-trust strip (inline so there are no asset deps). */
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

/* The cinematic backdrop that the sheet scrolls over. */
const BG = img('https://images.unsplash.com/photo-1501785888041-af3ef285b470', 2000);

/* Scattered thumbnails for the intro statement grid. */
const SCATTER = [
  { src: img('https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e', 500), c: 's1' },
  { src: img('https://images.unsplash.com/photo-1528127269322-539801943592', 500), c: 's2' },
  { src: img('https://images.unsplash.com/photo-1516483638261-f4dbaf036963', 500), c: 's3' },
  { src: img('https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d', 500), c: 's4' },
  { src: img('https://images.unsplash.com/photo-1467269204594-9661b134dd2b', 500), c: 's5' },
  { src: img('https://images.unsplash.com/photo-1514282401047-d79a71a590e8', 500), c: 's6' },
  { src: img('https://images.unsplash.com/photo-1523906834658-6e24ef2386f9', 500), c: 's7' },
];

/* Hand-tuned spans so the 8-card destination grid tiles a 4-col layout
   with zero gaps (2 tall + 2 wide bookend rows 1-2, 4 normals fill row 3). */
const DEST_SPANS = ['tall', 'wide', 'tall', 'wide', 'normal', 'normal', 'normal', 'normal'];

/* ---- Reusable blur-to-focus reveal ----
   Honours prefers-reduced-motion: motion-sensitive users (and any
   JS/observer failure path) render the content immediately, fully
   visible — never trapped at opacity:0. */
function Reveal({ children, className = '', delay = 0, y = 24, as = 'div' }) {
  const M = motion[as] || motion.div;
  const reduce = useReducedMotion();
  if (reduce) return <M className={className}>{children}</M>;
  return (
    <M
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(14px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-12% 0px' }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </M>
  );
}

/* ---- Word-by-word blur reveal for display headlines ---- */
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
              transition={{ duration: 0.7, delay: delay + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              {w}
            </motion.span>
          )}{' '}
        </span>
      ))}
    </span>
  );
}

/* ---- Improved-page content (persona-driven) ---- */
const SPEC = [
  { icon: Plane, label: 'Flights', value: 'Intl. flights incl. (ex-Mumbai)' },
  { icon: BedDouble, label: 'Hotels', value: '4★ / select 5★, central' },
  { icon: Users, label: 'Group size', value: 'Max 18 · avg 12–16' },
  { icon: UtensilsCrossed, label: 'Meals', value: 'Daily breakfast + select dinners' },
];
const INCLUDED = ['Return international flights', 'All hotels (4★/5★, central)', 'Daily breakfast + select dinners', 'All transfers & entrance fees', 'A Cox & Kings tour manager throughout'];
const EXCLUDED = ['Paperwork cost', 'Travel insurance', 'Lunches & optional excursions', 'Tips & personal expenses'];
const WHY_PREMIUM = [
  'Small groups, capped at 18 — never a 40-seat coach.',
  'Central 4★/5★ hotels, not budget properties on the outskirts.',
  'A Cox & Kings tour manager travels with you the whole way.',
  'Entrance fees & most meals included — fewer surprises on the road.',
];
const BOOKING_SAFETY = [
  { icon: Wallet, t: 'Book with a 20% deposit', d: 'Balance due 30 days before you travel.' },
  { icon: RotateCcw, t: 'Free cancellation for 7 days', d: 'Full cancellation schedule shown before you pay.' },
  { icon: ShieldCheck, t: 'Visa delayed or refused?', d: 'We rebook your dates or refund the land portion.' },
  { icon: Lock, t: 'Secure payments only', d: 'Verified gateways — never to a personal account.' },
];
const COMPANY_TODAY = {
  line: 'A licensed Indian tour operator, open and taking bookings now.',
  address: 'Registered office · Fort, Mumbai',
  licence: 'IATA accredited · TAAI & ASTA member',
  hours: 'Specialists: Mon–Sat, 9:30am–6:30pm IST',
};

const BF_REGIONS = ['Japan', 'Italy', 'Switzerland', 'Scandinavia', 'Southeast Asia', 'Africa', 'Maldives', 'Somewhere else'];
const BF_WHO = ['A couple', 'Family with kids', 'Multi-generational', 'A group of friends', 'Solo'];
const BF_STYLE = ['Honeymoon & romance', 'Culture & food', 'Adventure', 'Slow luxury', 'Once-in-a-lifetime'];
const BF_MATTERS = ['Privacy', 'Design hotels', 'Senior-friendly pace', 'Photography', 'Specific dates', 'Comfortable budget'];
const BF_BUDGET = ['₹3–5L', '₹5–8L', '₹8L+'];
const BF_SAMPLE = {
  Japan: { title: 'A design-led Japan journey', from: '₹3,10,000', days: ['Tokyo — neon nights & a private sushi counter', 'Hakone — a ryokan with a private onsen', 'Kyoto — temple gardens at first light', 'Naoshima — the art islands'] },
  Italy: { title: 'A slow Italy, coast to art', from: '₹2,40,000', days: ['Rome — after-hours Vatican, by private guide', 'Tuscany — a hillside villa & vineyard table', 'Amalfi — a skipper & a hidden cove', 'Venice — dawn on the lagoon'] },
  default: { title: 'A trip designed around you', from: '₹2,20,000', days: ['Arrive to a private transfer & a plan that fits you', 'Hand-picked stays with character', 'Private guiding where it matters', 'Free days to wander, with us on call'] },
};

/* ---- Bespoke "Design It Around You" guided flow ---- */
function BespokeFlow({ onClose }) {
  const [step, setStep] = useState(0);
  const [region, setRegion] = useState('');
  const [who, setWho] = useState('');
  const [style, setStyle] = useState('');
  const [matters, setMatters] = useState([]);
  const [budget, setBudget] = useState('');
  const TOTAL = 4;
  const done = step >= TOTAL;
  const toggleMatter = (m) => setMatters((a) => (a.includes(m) ? a.filter((x) => x !== m) : [...a, m]));
  const canNext = [Boolean(region), Boolean(who), Boolean(style), true][step];

  const specialist =
    EXPERTS_IMP.find((e) => region && e.region.toLowerCase().includes(region.split(' ')[0].toLowerCase())) || EXPERTS_IMP[0];
  const sample = BF_SAMPLE[region] || BF_SAMPLE.default;

  const Chips = ({ opts, val, set, multi }) => (
    <div className="bf-chips">
      {opts.map((o) => {
        const on = multi ? matters.includes(o) : val === o;
        return (
          <button key={o} type="button" className={`bf-chip${on ? ' on' : ''}`} onClick={() => set(o)}>
            {multi && <span className="bf-chip-tick">{on ? <Check size={13} /> : null}</span>}{o}
          </button>
        );
      })}
    </div>
  );

  return (
    <motion.div className="bf" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} onClick={onClose}>
      <motion.div
        className="bf-panel" role="dialog" aria-modal="true" aria-label="Design your trip"
        initial={{ opacity: 0, y: 28, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} onClick={(e) => e.stopPropagation()}
      >
        <button className="bf-close" aria-label="Close" onClick={onClose}><X size={20} /></button>

        {!done ? (
          <div className="bf-step">
            <span className="bf-eyebrow">Design it around you · Step {step + 1} of {TOTAL}</span>
            <div className="bf-bar"><span style={{ width: `${(step / TOTAL) * 100}%` }} /></div>

            {step === 0 && (<><h3 className="bf-q">Where do you dream of going?</h3><Chips opts={BF_REGIONS} val={region} set={setRegion} /></>)}
            {step === 1 && (<><h3 className="bf-q">Who's travelling?</h3><Chips opts={BF_WHO} val={who} set={setWho} /></>)}
            {step === 2 && (<><h3 className="bf-q">What's the feeling you're after?</h3><Chips opts={BF_STYLE} val={style} set={setStyle} /></>)}
            {step === 3 && (
              <>
                <h3 className="bf-q">Anything that must be right?</h3>
                <Chips opts={BF_MATTERS} multi set={toggleMatter} />
                <p className="bf-sublabel">A comfortable budget (optional — just so we pitch it right):</p>
                <Chips opts={BF_BUDGET} val={budget} set={setBudget} />
              </>
            )}

            <div className="bf-nav">
              {step > 0 ? <button className="bf-back" onClick={() => setStep((s) => s - 1)}>Back</button> : <span />}
              <button className="h26-btn h26-btn-accent bf-next" disabled={!canNext} onClick={() => setStep((s) => s + 1)}>
                {step === TOTAL - 1 ? 'See my match' : 'Next'} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div className="bf-result">
            <span className="bf-eyebrow"><Sparkles size={13} /> Your specialist match</span>
            <div className="bf-match">
              <img src={img(specialist.photo, 160)} alt={specialist.name} />
              <div>
                <h3>{specialist.name}</h3>
                <p>{specialist.region} · {specialist.years} designing trips</p>
                <p className="bf-match-cred">Will personally shape your {region || 'tailor-made'} journey.</p>
              </div>
            </div>
            <div className="bf-sample">
              <span className="bf-sample-tag">A starting point — we'll tailor every day to you</span>
              <h4>{sample.title}</h4>
              <ul>{sample.days.map((d) => <li key={d}><span className="bf-dot" />{d}</li>)}</ul>
              <p className="bf-sample-from">Indicative from <strong>{sample.from}</strong> per person {budget && <>· your band: {budget}</>}</p>
            </div>
            <p className="bf-recap">For {who || 'your group'}{style ? ` · ${style.toLowerCase()}` : ''}{matters.length ? ` · ${matters.join(', ').toLowerCase()}` : ''}.</p>
            <div className="bf-actions">
              <a href={CONTACT_IMP.phoneHref} className="h26-btn h26-btn-pill"><Phone size={16} /> Talk to {specialist.name.split(' ')[0]}</a>
              <a href={CONTACT_IMP.whatsappHref} target="_blank" rel="noopener noreferrer" className="h26-btn h26-btn-ghost"><MessageCircle size={16} /> WhatsApp this brief</a>
            </div>
            <button className="bf-restart" onClick={() => setStep(0)}>Start over</button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* Full-screen vertical reel player — YouTube-Shorts style.
   Desktop: scroll (wheel) to move between clips, with the reviews/comments
   panel docked open on the right. Mobile: swipe down for the next clip, with
   a TikTok-style action rail and a comments bottom-sheet. A short hint on open
   tells first-timers they can swipe/scroll for more. */
function ReelPlayer({ reels, index, setIndex, onClose }) {
  const reel = reels[index];
  const [saved, setSaved] = useState({});
  const [liked, setLiked] = useState({});
  const [commentsOpen, setCommentsOpen] = useState(false); // mobile bottom-sheet
  const [shared, setShared] = useState(false);
  const [hint, setHint] = useState(true);
  const [dir, setDir] = useState(1); // travel direction, for the slide animation
  const wheelLock = useRef(false);

  const isSaved = !!saved[reel.id];
  const isLiked = !!liked[reel.id];
  const comments = buildReelComments(reel);
  const go = (d) => { setDir(d); setIndex((i) => (i + d + reels.length) % reels.length); };

  /* Re-show the swipe hint briefly each time a new clip comes up. */
  useEffect(() => {
    setHint(true);
    const t = setTimeout(() => setHint(false), 2200);
    return () => clearTimeout(t);
  }, [index]);

  const onWheel = (e) => {
    if (wheelLock.current || Math.abs(e.deltaY) < 16) return;
    wheelLock.current = true;
    go(e.deltaY > 0 ? 1 : -1);
    setTimeout(() => { wheelLock.current = false; }, 480);
  };
  /* Drag-to-swipe: the clip follows the finger and snaps back; a decisive
     drag (or a flick) advances. Swipe DOWN → next clip. */
  const onDragEnd = (_e, info) => {
    if (info.offset.y > 70 || info.velocity.y > 450) go(1);
    else if (info.offset.y < -70 || info.velocity.y < -450) go(-1);
  };

  const share = async () => {
    const url = `${window.location.origin}${window.location.pathname}#reels`;
    try {
      if (navigator.share) await navigator.share({ title: reel.title, text: `${reel.title} — ${reel.place}`, url });
      else { await navigator.clipboard.writeText(url); setShared(true); setTimeout(() => setShared(false), 1600); }
    } catch { /* user dismissed the share sheet */ }
  };

  const CommentList = (
    <ul className="h26-rcom-list">
      {comments.map((c) => (
        <li key={c.id} className="h26-rcom">
          <img src={img(c.avatar, 80)} alt="" loading="lazy" />
          <div>
            <strong>{c.name}</strong>
            <p>{c.text}</p>
            <span className="h26-rcom-like"><TiHeart size={12} filled /> {c.likes}</span>
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <motion.div
      className="h26-reelplayer"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      <button className="h26-reelplayer-close" aria-label="Close player" onClick={onClose}><TiX size={24} /></button>

      <div className="h26-reelplayer-shell" onClick={(e) => e.stopPropagation()}>
        <button className="h26-reelplayer-nav up" aria-label="Previous clip" onClick={() => go(-1)}><TiChevronUp size={26} /></button>

        <div className="h26-reelplayer-col">
          <motion.div
            key={reel.id}
            className="h26-reelplayer-stage"
            initial={{ opacity: 0, y: dir > 0 ? 64 : -64 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 34, mass: 0.7 }}
            onWheel={onWheel}
            drag="y"
            dragDirectionLock
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.45}
            onDragEnd={onDragEnd}
          >
            <img src={img(reel.poster, 900)} alt={reel.title} />
            <div className="h26-reelplayer-veil" />
            <span className="h26-reelplayer-live"><span className="h26-reelplayer-dot" /> Clip · {index + 1}/{reels.length}</span>
            <span className="h26-reelplayer-bigplay"><TiPlay size={28} /></span>

            {/* Action rail — like / reviews / save / share (TikTok-style) */}
            <div className="h26-reelrail">
              <button type="button" className={`h26-reelrail-btn${isLiked ? ' is-on' : ''}`} onClick={() => setLiked((s) => ({ ...s, [reel.id]: !s[reel.id] }))} aria-pressed={isLiked} aria-label="Like">
                <span className="h26-reelrail-ic"><TiHeart size={23} filled={isLiked} /></span>
                <span>{isLiked ? '1.2k' : '1.1k'}</span>
              </button>
              <button type="button" className="h26-reelrail-btn" onClick={() => setCommentsOpen(true)} aria-label="Reviews">
                <span className="h26-reelrail-ic"><TiMessage size={23} /></span>
                <span>{comments.length}</span>
              </button>
              <button type="button" className={`h26-reelrail-btn${isSaved ? ' is-on' : ''}`} onClick={() => setSaved((s) => ({ ...s, [reel.id]: !s[reel.id] }))} aria-pressed={isSaved} aria-label="Save">
                <span className="h26-reelrail-ic"><TiBookmark size={23} filled={isSaved} /></span>
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </button>
              <button type="button" className="h26-reelrail-btn" onClick={share} aria-label="Share">
                <span className="h26-reelrail-ic"><TiShare size={22} /></span>
                <span>{shared ? 'Copied' : 'Share'}</span>
              </button>
            </div>

            <div className="h26-reelplayer-info">
              <span className="h26-reel-tag">{reel.tag}</span>
              <h3>{reel.title}</h3>
              <p>{reel.place} · {reel.views} views</p>
              <Link to="/tour-detail-japan-4" className="h26-btn h26-btn-accent">Explore this journey <ArrowRight size={16} /></Link>
            </div>

            {/* Swipe / scroll hint on open */}
            <AnimatePresence>
              {hint && (
                <motion.div
                  className="h26-reelhint"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.span
                    className="h26-reelhint-ic"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
                  ><TiChevronDown size={22} /></motion.span>
                  <span className="h26-reelhint-txt"><b className="hi-mob-only">Swipe</b><b className="hi-desk-only">Scroll</b> for the next clip</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Desktop reviews panel — always open beside the clip */}
        <aside className="h26-reelpanel">
          <div className="h26-reelpanel-head">
            <strong>Traveller reviews</strong>
            <span>{comments.length} on this film</span>
          </div>
          {CommentList}
          <div className="h26-reelpanel-foot">
            <input type="text" placeholder="Add a review…" aria-label="Add a review" />
            <button type="button" aria-label="Post review"><TiSend size={16} /></button>
          </div>
        </aside>

        <button className="h26-reelplayer-nav down" aria-label="Next clip" onClick={() => go(1)}><TiChevronDown size={26} /></button>
      </div>

      {/* Mobile comments bottom-sheet */}
      <AnimatePresence>
        {commentsOpen && (
          <motion.div
            className="h26-rsheet"
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h26-rsheet-grab" />
            <div className="h26-rsheet-head">
              <strong>Traveller reviews</strong>
              <button type="button" aria-label="Close reviews" onClick={() => setCommentsOpen(false)}><TiX size={20} /></button>
            </div>
            {CommentList}
            <div className="h26-reelpanel-foot">
              <input type="text" placeholder="Add a review…" aria-label="Add a review" />
              <button type="button" aria-label="Post review"><TiSend size={16} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* Hero-search dropdown popover. Rendered in a portal to <body> with fixed
   positioning anchored to its trigger, so it floats above the page without
   any z-index juggling on the hero/sheet (which was causing the section below
   to flicker when a dropdown opened). Repositions on scroll/resize. */
function Popover({ open, anchorRef, placement = 'left', className = '', role, ariaLabel, children }) {
  const [rect, setRect] = useState(null);
  useEffect(() => {
    if (!open) return;
    const update = () => {
      const el = anchorRef.current;
      if (el) setRect(el.getBoundingClientRect());
    };
    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [open, anchorRef]);

  const style = rect ? {
    position: 'fixed',
    top: rect.bottom + 12,
    left: placement === 'right' ? 'auto' : rect.left,
    right: placement === 'right' ? Math.max(8, window.innerWidth - rect.right) : 'auto',
    zIndex: 130,
  } : null;

  return createPortal(
    <AnimatePresence>
      {open && style && (
        <motion.div
          className={`${className}${placement === 'right' ? ' hi-pop--right' : ''}`}
          style={style}
          role={role}
          aria-label={ariaLabel}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.16, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

/* Swipe indicator for the mobile horizontal carousels: a row of dots that
   tracks which card is in view and lets you tap to jump. Rendered for every
   carousel but only shown on mobile (where the grids become scrollers). */
function CarouselDots({ scrollRef, count, label = 'cards' }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const compute = () => {
      const cards = Array.from(el.children);
      if (cards.length < 2) return;
      const base = cards[0].offsetLeft;
      let idx = 0, best = Infinity;
      cards.forEach((c, i) => {
        const d = Math.abs((c.offsetLeft - base) - el.scrollLeft);
        if (d < best) { best = d; idx = i; }
      });
      setActive(Math.min(idx, count - 1));
    };
    compute();
    el.addEventListener('scroll', compute, { passive: true });
    window.addEventListener('resize', compute);
    return () => { el.removeEventListener('scroll', compute); window.removeEventListener('resize', compute); };
  }, [scrollRef, count]);
  const go = (i) => {
    const el = scrollRef.current;
    if (!el) return;
    const cards = Array.from(el.children);
    if (!cards[i]) return;
    el.scrollTo({ left: cards[i].offsetLeft - cards[0].offsetLeft, behavior: 'smooth' });
  };
  return (
    <div className="hi-dots" role="tablist" aria-label={`Swipe through ${label}`}>
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          type="button"
          className={`hi-dot${i === active ? ' is-active' : ''}`}
          aria-label={`Show ${label} ${i + 1} of ${count}`}
          aria-selected={i === active}
          onClick={() => go(i)}
        />
      ))}
    </div>
  );
}

export default function Home2026Improved() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [where, setWhere] = useState('');
  const [whereOpen, setWhereOpen] = useState(false);
  const whereRef = useRef(null);
  const [style, setStyle] = useState(''); // no pre-selection — neutral "Any style" placeholder
  const [styleOpen, setStyleOpen] = useState(false);
  const styleRef = useRef(null);
  /* When: a calendar pick + flexible window, instead of a coarse select. */
  const [whenOpen, setWhenOpen] = useState(false);
  const whenRef = useRef(null);
  const [whenDate, setWhenDate] = useState(null); // Date | null
  const [whenFlex, setWhenFlex] = useState(0); // 0 = exact, else ± days
  const [whenMonth, setWhenMonth] = useState(() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); });
  const [chatOpen, setChatOpen] = useState(false);
  const [activeReel, setActiveReel] = useState(null); // index into REELS, or null
  const [bespokeOpen, setBespokeOpen] = useState(false);

  // Hide the page scrollbar + go full-bleed, only while this page is mounted
  useEffect(() => {
    document.documentElement.classList.add('h26-noscroll');
    return () => document.documentElement.classList.remove('h26-noscroll');
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Close any open hero-search dropdown on outside click. */
  useEffect(() => {
    if (!whereOpen && !styleOpen && !whenOpen) return;
    const onDown = (e) => {
      // The dropdowns render in a body portal, so a click inside one isn't
      // inside the trigger refs — treat any click within a popover as "inside".
      if (e.target.closest && e.target.closest('.hi-where-pop')) return;
      if (whereRef.current && !whereRef.current.contains(e.target)) setWhereOpen(false);
      if (styleRef.current && !styleRef.current.contains(e.target)) setStyleOpen(false);
      if (whenRef.current && !whenRef.current.contains(e.target)) setWhenOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [whereOpen, styleOpen, whenOpen]);

  /* Lock body scroll while the menu or a reel is open. */
  useEffect(() => {
    const lock = menuOpen || activeReel !== null || bespokeOpen;
    document.body.style.overflow = lock ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen, activeReel, bespokeOpen]);

  /* Keyboard control for the reel player. */
  useEffect(() => {
    if (activeReel === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setActiveReel(null);
      else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') setActiveReel((i) => (i + 1) % REELS.length);
      else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') setActiveReel((i) => (i - 1 + REELS.length) % REELS.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeReel]);

  /* Hero parallax — the headline drifts up as the sheet rises. (No opacity
     fade: it dimmed the text on the way out and made an open search dropdown
     flicker while scrolling.) */
  const heroRef = useRef(null);
  const { scrollYProgress: heroP } = useScroll({
    target: heroRef, offset: ['start start', 'end start'],
  });
  const heroY = useTransform(heroP, [0, 1], [0, -120]);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 680px)');
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  /* Scatter grid parallax. */
  const scatterRef = useRef(null);
  const { scrollYProgress: scP } = useScroll({
    target: scatterRef, offset: ['start end', 'end start'],
  });
  const drift1 = useTransform(scP, [0, 1], [60, -60]);
  const drift2 = useTransform(scP, [0, 1], [-40, 40]);
  const drift3 = useTransform(scP, [0, 1], [90, -90]);

  /* Cursor parallax for the scatter grid (springy so it eases, not snaps). */
  const prefersReduced = useReducedMotion();
  const mPx = useMotionValue(0);
  const mPy = useMotionValue(0);
  const mx = useSpring(mPx, { stiffness: 110, damping: 22, mass: 0.4 });
  const my = useSpring(mPy, { stiffness: 110, damping: 22, mass: 0.4 });
  const onScatterMove = (e) => {
    if (prefersReduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    mPx.set((e.clientX - r.left) / r.width - 0.5);
    mPy.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onScatterLeave = () => { mPx.set(0); mPy.set(0); };

  /* Refs for the mobile carousels, so their swipe-dot indicators can track
     scroll position and jump to a card. */
  const forkRef = useRef(null);
  const destRef = useRef(null);
  const journeysRef = useRef(null);
  const includesRef = useRef(null);
  const curRef = useRef(null);

  /* Mobile reels: auto-advance the horizontal carousel so it "plays" itself,
     pausing for a few seconds whenever the visitor swipes (lets them interact). */
  const reelsRef = useRef(null);
  useEffect(() => {
    const el = reelsRef.current;
    if (!el || prefersReduced) return;
    const mq = window.matchMedia('(max-width: 680px)');
    if (!mq.matches) return;
    let paused = false; let resumeT;
    const advance = () => {
      if (paused) return;
      const cards = Array.from(el.children);
      if (cards.length < 2) return;
      const base = cards[0].offsetLeft;
      const cur = cards.findIndex((c) => c.offsetLeft - base >= el.scrollLeft - 8);
      const next = (((cur === -1 ? cards.length - 1 : cur)) + 1) % cards.length;
      el.scrollTo({ left: cards[next].offsetLeft - base, behavior: 'smooth' });
    };
    const timer = setInterval(advance, 3200);
    const pause = () => { paused = true; clearTimeout(resumeT); resumeT = setTimeout(() => { paused = false; }, 5000); };
    el.addEventListener('pointerdown', pause);
    el.addEventListener('touchstart', pause, { passive: true });
    return () => {
      clearInterval(timer); clearTimeout(resumeT);
      el.removeEventListener('pointerdown', pause);
      el.removeEventListener('touchstart', pause);
    };
  }, [prefersReduced]);

  /* "When" — derive a friendly label from the picked date + flexible window.
     Falls back to "Anytime" until a date is chosen. */
  const whenLabel = whenDate
    ? `${whenDate.getDate()} ${MON_NAMES[whenDate.getMonth()].slice(0, 3)}${whenFlex ? ` · ±${whenFlex}d` : ''}`
    : 'Anytime';
  const calCells = buildCalendar(whenMonth);
  const todayMidnight = new Date(); todayMidnight.setHours(0, 0, 0, 0);
  const canGoPrevMonth = whenMonth > new Date(todayMidnight.getFullYear(), todayMidnight.getMonth(), 1);

  /* While any hero-search dropdown is open we freeze the hero's scroll
     parallax, so scrolling doesn't drag the popover around / make it jitter. */
  const searchOpen = whereOpen || styleOpen || whenOpen;

  /* The hero search carries the visitor's choices through to the
     listing page instead of throwing them away. */
  const searchHref = `/journeys?where=${encodeURIComponent(where)}&style=${encodeURIComponent(style)}`;

  /* "Where to?" is a typeable combobox: free text in the field, while the
     dropdown only ever suggests popular places. As the visitor types we
     narrow that list of suggestions (and never block a custom entry). */
  const whereQuery = where.trim().toLowerCase();
  const whereSuggestions = whereQuery
    ? HERO_DESTINATIONS.filter((d) => d.toLowerCase().includes(whereQuery))
    : HERO_DESTINATIONS;

  return (
    <div className="h26">
      <a className="h26-skip" href="#top">Skip to content</a>

      {/* Fixed cinematic backdrop the sheet scrolls over */}
      <div className="h26-bg" aria-hidden="true">
        <img src={BG} alt="" loading="eager" fetchPriority="high" decoding="sync" />
        <div className="h26-bg-veil" />
        <div className="h26-bg-grain" />
      </div>

      {/* ---------- NAV ---------- */}
      <header className={`h26-nav${scrolled ? ' is-solid' : ''}`}>
        <a href="#top" className="h26-brand">
          <img src="/cox-logo-new.png" alt="Cox & Kings" />
        </a>
        <nav className="h26-links hi-nav" aria-label="Primary">
          {NAV_MENU.map((group) => (
            <div className="hi-nav-group" key={group.label}>
              <a href={group.href} className="hi-nav-top" aria-haspopup="true">
                {group.label}
                <ChevronDown size={14} className="hi-nav-caret" aria-hidden="true" />
              </a>
              <div className="hi-nav-flyout" role="menu">
                <div className="hi-nav-flyout-inner">
                  <p className="hi-nav-blurb">{group.blurb}</p>
                  <ul className="hi-nav-list">
                    {group.items.map((it) => (
                      <li key={it.label}>
                        {it.to ? (
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
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </nav>
        <div className="h26-nav-cta">
          <a href={CONTACT_IMP.phoneHref} className="h26-phone">
            <Phone size={15} /> <span>{CONTACT_IMP.phoneDisplay}</span>
          </a>
          <a href="#plan" className="h26-btn h26-btn-pill">Talk to an expert</a>
          <button
            className="h26-burger"
            aria-label="Menu"
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      {/* Mobile slide-in menu — luxe2-style glass panel */}
      <div className={`h26-menu${menuOpen ? ' is-open' : ''}`} aria-hidden={!menuOpen}>
        <div className="h26-menu-scrim" onClick={() => setMenuOpen(false)} />
        <div className="h26-menu-panel" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="h26-menu-top">
            <button className="h26-menu-close" aria-label="Close menu" onClick={() => setMenuOpen(false)}><X size={20} /></button>
            <img className="h26-menu-logo" src="/cox-logo-new.png" alt="Cox & Kings — Est. 1758" />
          </div>
          <nav className="h26-menu-primary" aria-label="Mobile primary">
            {[
              { label: 'Ways to travel', href: '#paths' },
              { label: 'Destinations', href: '#destinations' },
              { label: 'Journeys', href: '#journeys' },
              { label: 'Clips', href: '#reels' },
              { label: 'Why us', href: '#trust' },
            ].map((n) => (
              <a key={n.label} href={n.href} onClick={() => setMenuOpen(false)}>
                {n.label}
                <span className="h26-menu-chev"><ArrowRight size={16} /></span>
              </a>
            ))}
          </nav>
          <div className="h26-menu-divider" />
          <div className="h26-menu-secondary">
            <Link to="/journeys" onClick={() => setMenuOpen(false)}>All journeys <ArrowUpRight size={13} /></Link>
            <Link to="/journeys" onClick={() => setMenuOpen(false)}>Destinations <ArrowUpRight size={13} /></Link>
            <Link to="/about" onClick={() => setMenuOpen(false)}>Our story <ArrowUpRight size={13} /></Link>
            <Link to={CALLBACK} onClick={() => setMenuOpen(false)}>Contact <ArrowUpRight size={13} /></Link>
          </div>
          <a href={CONTACT_IMP.phoneHref} className="h26-btn h26-btn-pill h26-menu-cta" onClick={() => setMenuOpen(false)}>
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

      {/* ---------- HERO ---------- */}
      <section className="h26-hero" id="top" ref={heroRef}>
        <motion.div className="h26-hero-inner" style={{ y: (isMobile || searchOpen) ? 0 : heroY }}>
          <Reveal className="h26-eyebrow" as="p">
            Established 1758 · 260+ years of travel
          </Reveal>

          <h1 className="h26-display">
            <WordReveal text="More than a destination," />
            <br />
            <WordReveal text="it's a journey." accent={[2]} delay={0.25} />
          </h1>

          {/* Directed search dock — chips instead of a blank field */}
          {/* Plain (no-blur) reveal: a filter on this wrapper would clip the
              search dropdowns to its own box. Animate opacity + y only. */}
          <motion.div
            className="h26-search"
            initial={prefersReduced ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="h26-search-bar">
              <div className="h26-search-seg hi-where" ref={whereRef}>
                <span className="h26-search-label"><MapPin size={13} /> Where</span>
                <span className="h26-search-control">
                  <input
                    type="text"
                    className="hi-where-input"
                    value={where}
                    onChange={(e) => { setWhere(e.target.value); setWhereOpen(true); setStyleOpen(false); setWhenOpen(false); }}
                    onFocus={() => { setWhereOpen(true); setStyleOpen(false); setWhenOpen(false); }}
                    onKeyDown={(e) => { if (e.key === 'Escape') setWhereOpen(false); }}
                    placeholder="Where to?"
                    aria-label="Where to"
                    role="combobox"
                    aria-expanded={whereOpen}
                    aria-autocomplete="list"
                    autoComplete="off"
                  />
                  <ChevronDown size={15} className="h26-search-chev" aria-hidden="true" />
                </span>
                <Popover open={whereOpen} anchorRef={whereRef} placement="left" className="hi-where-pop" role="listbox">
                  <p className="hi-where-pop-label">Popular destinations</p>
                  {whereSuggestions.length > 0 ? (
                    <ul className="hi-where-list">
                      {whereSuggestions.map((d) => (
                        <li key={d}>
                          <button
                            type="button"
                            className="hi-where-opt"
                            role="option"
                            aria-selected={where === d}
                            onClick={() => { setWhere(d); setWhereOpen(false); }}
                          >
                            <MapPin size={14} aria-hidden="true" />
                            <span>{d}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="hi-where-empty">Press search to explore “{where}”</p>
                  )}
                </Popover>
              </div>
              <span className="h26-search-div" />
              <div className="h26-search-seg hi-where" ref={styleRef}>
                <span className="h26-search-label"><Compass size={13} /> Style</span>
                <button
                  type="button"
                  className="h26-search-control hi-seg-btn"
                  onClick={() => { setStyleOpen((o) => !o); setWhereOpen(false); setWhenOpen(false); }}
                  aria-haspopup="listbox"
                  aria-expanded={styleOpen}
                  aria-label="Trip style"
                >
                  <span className={`hi-seg-val${style ? '' : ' is-placeholder'}`}>{style || 'Any style'}</span>
                  <ChevronDown size={15} className="h26-search-chev" aria-hidden="true" />
                </button>
                <Popover open={styleOpen} anchorRef={styleRef} placement="left" className="hi-where-pop" role="listbox">
                  <p className="hi-where-pop-label">Trip style</p>
                  <ul className="hi-where-list">
                    {HERO_TRIP_TYPES.map((d) => (
                      <li key={d}>
                        <button
                          type="button"
                          className="hi-where-opt"
                          role="option"
                          aria-selected={style === d}
                          onClick={() => { setStyle(d); setStyleOpen(false); }}
                        >
                          <Compass size={14} aria-hidden="true" />
                          <span>{d}</span>
                          {style === d && <Check size={15} className="hi-opt-check" aria-hidden="true" />}
                        </button>
                      </li>
                    ))}
                  </ul>
                </Popover>
              </div>
              <span className="h26-search-div" />
              <div className="h26-search-seg hi-where hi-when" ref={whenRef}>
                <span className="h26-search-label"><Calendar size={13} /> When</span>
                <button
                  type="button"
                  className="h26-search-control hi-seg-btn"
                  onClick={() => { setWhenOpen((o) => !o); setWhereOpen(false); setStyleOpen(false); }}
                  aria-haspopup="dialog"
                  aria-expanded={whenOpen}
                  aria-label="When to travel"
                >
                  <span className="hi-seg-val">{whenLabel}</span>
                  <ChevronDown size={15} className="h26-search-chev" aria-hidden="true" />
                </button>
                <Popover open={whenOpen} anchorRef={whenRef} placement="right" className="hi-where-pop hi-cal-pop" role="dialog" ariaLabel="Choose travel dates">
                      <div className="hi-cal-head">
                        <button
                          type="button"
                          className="hi-cal-nav"
                          onClick={() => canGoPrevMonth && setWhenMonth(new Date(whenMonth.getFullYear(), whenMonth.getMonth() - 1, 1))}
                          disabled={!canGoPrevMonth}
                          aria-label="Previous month"
                        ><ChevronUp size={16} style={{ transform: 'rotate(-90deg)' }} /></button>
                        <span className="hi-cal-title">{MON_NAMES[whenMonth.getMonth()]} {whenMonth.getFullYear()}</span>
                        <button
                          type="button"
                          className="hi-cal-nav"
                          onClick={() => setWhenMonth(new Date(whenMonth.getFullYear(), whenMonth.getMonth() + 1, 1))}
                          aria-label="Next month"
                        ><ChevronDown size={16} style={{ transform: 'rotate(-90deg)' }} /></button>
                      </div>
                      <div className="hi-cal-grid hi-cal-dow">
                        {WK_DAYS.map((w) => <span key={w} className="hi-cal-dowcell">{w}</span>)}
                      </div>
                      <div className="hi-cal-grid">
                        {calCells.map((c, idx) => {
                          if (!c) return <span key={idx} className="hi-cal-cell is-empty" />;
                          const past = c < todayMidnight;
                          const sel = sameDay(c, whenDate);
                          return (
                            <button
                              key={idx}
                              type="button"
                              className={`hi-cal-cell${sel ? ' is-sel' : ''}${past ? ' is-past' : ''}`}
                              disabled={past}
                              onClick={() => setWhenDate(c)}
                              aria-pressed={sel}
                            >{c.getDate()}</button>
                          );
                        })}
                      </div>
                      <p className="hi-where-pop-label hi-cal-flexlabel">Flexible?</p>
                      <div className="hi-cal-flex">
                        {FLEX_OPTS.map((f) => (
                          <button
                            key={f}
                            type="button"
                            className={`hi-cal-flexchip${whenFlex === f ? ' is-on' : ''}`}
                            onClick={() => setWhenFlex(f)}
                          >{f === 0 ? 'Exact' : `± ${f} ${f === 1 ? 'day' : 'days'}`}</button>
                        ))}
                      </div>
                      <div className="hi-cal-actions">
                        <button type="button" className="hi-cal-clear" onClick={() => { setWhenDate(null); setWhenFlex(0); }}>Clear</button>
                        <button type="button" className="hi-cal-done" onClick={() => setWhenOpen(false)}>Done</button>
                      </div>
                </Popover>
              </div>
              <Link to={searchHref} className="h26-search-go" aria-label="Find my journey">
                <Search size={18} />
                <span>Find my journey</span>
              </Link>
            </div>
            <div className="h26-search-quick">
              <span>Popular —</span>
              {['Switzerland', 'Japan', 'Italy', 'Northern Lights', 'African Safari'].map((d) => (
                <Link key={d} to="/journeys/japan" className="h26-chip">{d}</Link>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Floating stat pills — hero teaser; full proof set lives in #trust */}
        <div className="h26-pills">
          {[
            { v: '260+ yrs', l: 'of heritage' },
            { v: `${RATING.score}★`, l: `${RATING.count} reviews` },
            { v: '100+', l: 'countries' },
            { v: '24 hr', l: 'specialist reply' },
          ].map((p, i) => (
            <motion.div
              key={p.v}
              className="h26-pill"
              initial={{ opacity: 0, x: 30, filter: 'blur(8px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, delay: 0.9 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              <strong>{p.v}</strong>
              <span>{p.l}</span>
            </motion.div>
          ))}
        </div>

        <div className="h26-scrollcue">
          <span>Scroll</span>
          <span className="h26-scrollcue-line" />
        </div>
      </section>

      {/* ---------- SHEET (everything below scrolls over the backdrop) ---------- */}
      <div className="h26-sheet">

        {/* INTRO — scattered floating grid + centered statement (matches "/" exactly) */}
        <section className="h26-intro" ref={scatterRef} onMouseMove={onScatterMove} onMouseLeave={onScatterLeave}>
          {SCATTER.map((s, i) => (
            <ScatterImg
              key={s.c}
              src={s.src}
              cls={s.c}
              driftY={[drift1, drift2, drift3, drift2, drift1, drift3, drift1][i]}
              mx={mx}
              my={my}
              depth={SCATTER_DEPTH[i]}
            />
          ))}

          <div className="h26-intro-copy">
            <Reveal className="h26-label" as="p">The Cox &amp; Kings way</Reveal>
            <h2 className="h26-statement">
              <WordReveal text="Specialists, not salespeople." accent={[0]} />
              <br />
              <WordReveal text="Every detail, handled." accent={[2]} delay={0.2} />
            </h2>
            <Reveal className="h26-intro-text" as="p" delay={0.3}>
              Your journey is shaped by someone who has actually walked it — then
              flights, visas, hotels and transfers are coordinated end to end, with
              one team you can reach on WhatsApp before, during and after the trip.
            </Reveal>
            <ul className="hi-spec-points">
              {ASSURANCE.map((a, i) => (
                <Reveal key={a} as="li" delay={0.36 + i * 0.06} y={0}>
                  <Check size={15} className="hi-spec-points-ic" aria-hidden="true" />
                  <span>{a}</span>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* FORK — four ways in: bespoke, escorted, help me decide, talk to someone */}
        <section className="h26-section hi-fork" id="paths">
          <div className="h26-head hi-center">
            <Reveal className="h26-label" as="p">Start here</Reveal>
            <Reveal as="h2" className="h26-h2" delay={0.05}>How would you like to travel?</Reveal>
          </div>
          <div className="hi-fork-grid hi-fork-grid--four" ref={forkRef}>
            {/* Bespoke lane — desire-led, no price (serves Ananya) */}
            <Reveal className="hi-lane" y={0}>
              <div className="hi-lane-media">
                <img src={img('https://images.unsplash.com/photo-1540541338287-41700207dee6', 800)} alt="A private, design-led stay" loading="lazy" />
              </div>
              <div className="hi-lane-body">
                <span className="hi-lane-tag">Tailor-made &amp; private</span>
                <h3>Design it around you</h3>
                <p>A private holiday shaped one-to-one with a named specialist — your pace, your people, your way.</p>
                <button type="button" className="h26-btn h26-btn-pill" onClick={() => setBespokeOpen(true)}>
                  Start designing <ArrowRight size={16} />
                </button>
              </div>
            </Reveal>
            {/* Escorted lane — value-led, with spec proof (serves Karan, Rajesh) */}
            <Reveal className="hi-lane" y={0}>
              <Link to="/journeys2" className="hi-lane-link">
                <div className="hi-lane-media">
                  <img src={img('https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99', 800)} alt="An escorted small-group journey" loading="lazy" />
                </div>
                <div className="hi-lane-body">
                  <span className="hi-lane-tag">Escorted small groups</span>
                  <h3>Find Your Journey</h3>
                  <p>Fixed departures, capped at 18, a tour manager throughout — everything handled, fine company along the way.</p>
                  <span className="h26-btn h26-btn-pill">See group journeys <ArrowRight size={16} /></span>
                </div>
              </Link>
            </Reveal>
            {/* Help me decide — highlighted/recommended path for the undecided visitor */}
            <Reveal className="hi-lane is-featured" y={0}>
              <span className="hi-lane-badge">Recommended</span>
              <div className="hi-lane-media">
                <img src={img('https://images.unsplash.com/photo-1488646953014-85cb44e25828', 800)} alt="Planning a trip together over a map" loading="lazy" />
              </div>
              <div className="hi-lane-body">
                <span className="hi-lane-tag">Not sure yet</span>
                <h3>Help me decide</h3>
                <p>Tell us who's travelling and what you love — we'll point you to the way that fits you best.</p>
                <button type="button" className="h26-btn h26-btn-accent" onClick={() => setBespokeOpen(true)}>
                  Help me decide <ArrowRight size={16} />
                </button>
              </div>
            </Reveal>
            {/* Talk to someone — human contact, no form (serves Sunita) */}
            <Reveal className="hi-lane" y={0}>
              <div className="hi-lane-media">
                <img src={img('https://images.unsplash.com/photo-1521737604893-d14cc237f11d', 800)} alt="A travel specialist ready to talk" loading="lazy" />
              </div>
              <div className="hi-lane-body">
                <span className="hi-lane-tag">A real person</span>
                <h3>Just talk to someone</h3>
                <p>Prefer a conversation? Speak with a specialist directly — no scripts, no call centre, no obligation.</p>
                <a href={CONTACT_IMP.phoneHref} className="h26-btn h26-btn-pill">Talk to someone <ArrowRight size={16} /></a>
              </div>
            </Reveal>
          </div>
          <CarouselDots scrollRef={forkRef} count={4} label="ways to travel" />
        </section>

        {/* DESTINATIONS — editorial grid */}
        <section className="h26-section" id="destinations">
          <div className="h26-head h26-head-row">
            <div>
              <Reveal className="h26-label" as="p">100+ countries</Reveal>
              <Reveal as="h2" className="h26-h2" delay={0.05}>Where will you go?</Reveal>
            </div>
            <Reveal as="div" delay={0.1}>
              <Link to="/journeys" className="h26-textlink">All destinations <ArrowUpRight size={16} /></Link>
            </Reveal>
          </div>
          <div className="h26-dest-grid" ref={destRef}>
            {DESTINATIONS.slice(0, 8).map((d, i) => (
              <Reveal key={d.name} className={`h26-dest h26-dest-${DEST_SPANS[i]}`} delay={(i % 4) * 0.06} y={0}>
                <Link to="/journeys/japan" className="h26-dest-link">
                  <img src={img(d.image, 900)} alt={d.name} loading="lazy" />
                  <div className="h26-dest-veil" />
                  <div className="h26-dest-body">
                    <h3>{d.name}</h3>
                    <p>{d.hook}</p>
                    {d.priceFrom && <span className="h26-dest-price">from {d.priceFrom} <small>/ person</small></span>}
                  </div>
                  <span className="h26-dest-arrow"><ArrowUpRight size={18} /></span>
                </Link>
              </Reveal>
            ))}
          </div>
          <CarouselDots scrollRef={destRef} count={Math.min(8, DESTINATIONS.length)} label="destinations" />
        </section>

        {/* TRUST — genuinely back, quantified credibility */}
        <section className="h26-trust" id="trust">
          <div className="h26-trust-inner">
            {/* Media column — heritage photo with an overlapping glass card */}
            <Reveal className="h26-heritage-media">
              <img
                className="h26-heritage-photo"
                src={img('https://images.unsplash.com/photo-1503220317375-aaad61436b1b', 900)}
                alt="A Cox & Kings traveller taking in the view"
                loading="lazy"
              />
              <div className="h26-heritage-card">
                <span className="h26-heritage-eyebrow">Since 1758</span>
                <strong>Bespoke itineraries</strong>
                <p>Each journey is crafted with care and precision — shaped to reflect you alone.</p>
                <img
                  className="h26-heritage-inset"
                  src={img('https://images.unsplash.com/photo-1523906834658-6e24ef2386f9', 500)}
                  alt=""
                  loading="lazy"
                />
              </div>
            </Reveal>

            {/* Text column */}
            <div className="h26-heritage-text">
              <Reveal className="h26-label" as="p">Our heritage</Reveal>
              <Reveal as="h2" className="h26-h2 h26-h2-light" delay={0.05}>
                Crafting <em>unforgettable journeys</em> since 1758.
              </Reveal>
              <Reveal as="p" className="h26-trust-text" delay={0.1}>
                From the age of sail to the era of bespoke travel, Cox &amp; Kings has guided
                generations of explorers across the globe — the same name, the same standard,
                for over a quarter of a millennium.
              </Reveal>
              <div className="h26-statband">
                {STATS.map((s, i) => (
                  <Reveal key={s.value} className="h26-statband-item" delay={i * 0.07}>
                    <strong>{s.value}</strong>
                    <span>{s.label}</span>
                  </Reveal>
                ))}
              </div>
              <Reveal as="div" delay={0.2}>
                <Link to="/about" className="h26-btn h26-btn-accent">Discover our story <ArrowRight size={16} /></Link>
              </Reveal>
            </div>
          </div>
          <Reveal className="h26-award">
            <span className="h26-award-badge">🏆</span>
            <div>
              <strong>Awarded Best Leisure Tours Brand</strong>
              <span>Economic Times Travel &amp; Tourism Awards · {RATING.score}★ from {RATING.count} travellers</span>
            </div>
            <div className="h26-press">
              {PRESS.slice(0, 4).map((p) => <span key={p}>{p}</span>)}
            </div>
          </Reveal>
        </section>

        {/* COX & KINGS TODAY — "we're back", real facts (serves Sunita) */}
        <section className="hi-today">
          <div className="hi-today-inner">
            <Reveal className="hi-today-main">
              <span className="h26-label h26-label-light">Cox &amp; Kings today</span>
              <h2 className="h26-h2 h26-h2-light">The name you remember — back, and taking bookings now.</h2>
              <p className="hi-today-lead">{COMPANY_TODAY.line}</p>
              <div className="hi-today-facts">
                <span><Building2 size={16} /> {COMPANY_TODAY.address}</span>
                <span><ShieldCheck size={16} /> {COMPANY_TODAY.licence}</span>
                <span><Clock size={16} /> {COMPANY_TODAY.hours}</span>
                <span><Phone size={16} /> {CONTACT_IMP.phoneDisplay}</span>
              </div>
            </Reveal>
            <Reveal className="hi-safety" delay={0.1}>
              <h3>Your booking is protected</h3>
              <ul>
                {BOOKING_SAFETY.map((b) => {
                  const Ic = b.icon;
                  return (
                    <li key={b.t}>
                      <span className="hi-safety-ic"><Ic size={17} /></span>
                      <span><strong>{b.t}</strong><em>{b.d}</em></span>
                    </li>
                  );
                })}
              </ul>
              <Link to={CALLBACK} className="hi-textlink hi-textlink-light">Read full booking terms <ArrowRight size={14} /></Link>
            </Reveal>
          </div>
        </section>

        {/* JOURNEYS — signature, inspiration → shortlist */}
        <section className="h26-section" id="journeys">
          <div className="h26-head h26-head-row">
            <div>
              <Reveal className="h26-label" as="p">Signature journeys</Reveal>
              <Reveal as="h2" className="h26-h2" delay={0.05}>Begin with a little desire.</Reveal>
            </div>
            <Reveal as="div" delay={0.1}>
              <Link to="/journeys" className="h26-textlink">Browse all journeys <ArrowUpRight size={16} /></Link>
            </Reveal>
          </div>

          {/* What every escorted journey includes — answers "what's in the price?" */}
          <Reveal className="hi-includes">
            <div className="hi-includes-spec">
              {SPEC.map((s) => {
                const Ic = s.icon;
                return (
                  <div key={s.label} className="hi-spec">
                    <span className="hi-spec-ic"><Ic size={18} /></span>
                    <span><strong>{s.label}</strong><em>{s.value}</em></span>
                  </div>
                );
              })}
            </div>
            <div className="hi-includes-lists" ref={includesRef}>
              <div className="hi-inc">
                <h4>What's included</h4>
                <ul>{INCLUDED.map((x) => <li key={x}><Check size={14} className="hi-check" />{x}</li>)}</ul>
              </div>
              <div className="hi-inc hi-exc">
                <h4>Not included</h4>
                <ul>{EXCLUDED.map((x) => <li key={x}><span className="hi-dash" aria-hidden="true">–</span>{x}</li>)}</ul>
              </div>
              <div className="hi-inc hi-why">
                <h4>Why we cost a little more</h4>
                <ul>{WHY_PREMIUM.map((x) => <li key={x}><Sparkles size={13} className="hi-spark" />{x}</li>)}</ul>
              </div>
            </div>
            <CarouselDots scrollRef={includesRef} count={3} label="lists" />
          </Reveal>

          <div className="h26-journeys" ref={journeysRef}>
            {JOURNEYS.slice(0, 5).map((j, i) => (
              <Reveal key={j.title} className={`h26-jrn${j.lead ? ' is-lead' : ''}`} delay={(i % 3) * 0.06} y={0}>
                <Link to="/tour-detail-japan-4" className="h26-jrn-link">
                  <img src={img(j.image, j.lead ? 1100 : 700)} alt={j.title} loading="lazy" />
                  <div className="h26-jrn-veil" />
                  <div className="h26-jrn-body">
                    {j.season && <span className="h26-jrn-season">{j.season}</span>}
                    <h3>{j.title}</h3>
                    <p>{j.blurb}</p>
                    <span className="h26-jrn-meta">
                      {j.nights && <span>{j.nights}</span>}
                      <span className="hi-jrn-cap"><Users size={12} /> Max 18</span>
                      {j.priceFrom && <span className="h26-jrn-price">from {j.priceFrom} <small>pp · incl. flights</small></span>}
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          <CarouselDots scrollRef={journeysRef} count={Math.min(5, JOURNEYS.length)} label="journeys" />
        </section>

        {/* CURATIONS — hand-picked by credentialed specialists */}
        <section className="h26-section" id="curations">
          <div className="h26-head">
            <Reveal className="h26-label" as="p">Hand-picked by our specialists</Reveal>
            <Reveal as="h2" className="h26-h2" delay={0.05}>Ready when you are.</Reveal>
            <Reveal as="p" className="hi-cur-promise" delay={0.1}>
              <ShieldCheck size={15} aria-hidden="true" /> Paced for comfort as standard — relaxed mornings, lifts in every hotel, and senior-friendly days, with vegetarian &amp; Indian meals arranged in advance.
            </Reveal>
          </div>
          <div className="h26-cur" ref={curRef}>
            {CURATIONS_IMP.map((c, i) => {
              const expert = EXPERTS_IMP.find((e) => e.name === c.specialist);
              return (
                <Reveal key={c.name} className="h26-cur-card" delay={i * 0.07} y={0}>
                  <div className="h26-cur-media">
                    <img src={img(c.image, 800)} alt={c.name} loading="lazy" />
                    <span className="h26-cur-cat">{c.category}</span>
                    {c.pace && <span className={`hi-cur-pace hi-cur-pace--${c.pace.toLowerCase()}`}><Footprints size={12} aria-hidden="true" /> {c.pace} pace</span>}
                  </div>
                  <div className="h26-cur-body">
                    <h3>{c.name}</h3>
                    <p className="h26-cur-note">{c.note}</p>
                    {c.stays && <p className="hi-cur-stays"><BedDouble size={13} aria-hidden="true" /> <span><strong>Stays:</strong> {c.stays.replace('e.g. ', '')}</span></p>}
                    <div className="h26-cur-meta">
                      <span className="hi-cur-dur"><Clock size={13} aria-hidden="true" /> {c.duration}</span>
                      <span className="h26-cur-price">designed from {c.priceFrom}<small>/person</small></span>
                    </div>
                    {c.departs && <p className="h26-cur-departs">{c.departs}</p>}
                    <div className="h26-cur-expert">
                      {expert && <img src={img(expert.photo, 120)} alt={expert.name} loading="lazy" />}
                      <span>
                        Curated by <strong>{c.specialist}</strong>
                        {expert && <em>{expert.region} · {expert.years}</em>}
                      </span>
                    </div>
                    <Link to={CALLBACK} className="h26-cur-cta">Request this trip <ArrowRight size={15} /></Link>
                  </div>
                </Reveal>
              );
            })}
          </div>
          <CarouselDots scrollRef={curRef} count={CURATIONS.length} label="trips" />
        </section>

        {/* REELS — short-form vertical discovery (YouTube-Shorts style) */}
        <section className="h26-section h26-reels-sec" id="reels">
          <div className="h26-head h26-head-row">
            <div>
              <Reveal className="h26-label" as="p">Clips</Reveal>
              <Reveal as="h2" className="h26-h2" delay={0.05}>Real moments, in 30 seconds.</Reveal>
            </div>
            <Reveal as="div" delay={0.1}>
              <Link to="/journeys" className="h26-textlink">Explore journeys <ArrowUpRight size={16} /></Link>
            </Reveal>
          </div>
          <Reveal as="p" className="h26-reels-hint" delay={0.05}>Swipe through traveller films — tap any to watch the full journey.</Reveal>
          <div className="h26-reels" ref={reelsRef}>
            {REELS.map((r, i) => (
              <Reveal key={r.id} className="h26-reel" delay={(i % 4) * 0.05} y={0}>
                <button type="button" className="h26-reel-link" onClick={() => setActiveReel(i)} aria-label={`Play clip: ${r.title}`}>
                  <img src={img(r.poster, 700)} alt={r.title} loading="lazy" />
                  <div className="h26-reel-veil" />
                  <span className="h26-reel-tag">{r.tag}</span>
                  <span className="h26-reel-play"><TiPlay size={22} /></span>
                  <div className="h26-reel-body">
                    <h3>{r.title}</h3>
                    <p>{r.place}</p>
                    <span className="h26-reel-views"><TiPlay size={11} /> {r.views} views</span>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
          <CarouselDots scrollRef={reelsRef} count={REELS.length} label="clips" />
        </section>

        {/* REVIEWS — marquee of real travellers */}
        <section className="h26-reviews">
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
                <span><strong>4.9</strong> on <b>Tripadvisor</b></span>
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
          <Reveal className="h26-reviews-more" delay={0.1}>
            <Link to="/about" className="h26-btn h26-btn-pill">View all reviews <ArrowUpRight size={16} /></Link>
          </Reveal>
        </section>

        {/* FINAL CTA — luxe2-improved style: full-bleed dark, image + veil */}
        <section className="h26-cta2" id="plan">
          <div className="h26-cta2-bg" style={{ backgroundImage: `url(${img('https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e', 1800)})` }} />
          <div className="h26-cta2-veil" />
          <div className="h26-cta2-inner">
            <Reveal className="h26-cta2-eyebrow" as="span">Begin the conversation</Reveal>
            <Reveal as="h2" className="h26-cta2-title" delay={0.05}>
              Your next journey deserves<br /><strong>a quarter-millennium of judgment.</strong>
            </Reveal>
            <Reveal as="p" className="h26-cta2-sub" delay={0.1}>
              Speak with a personal travel designer. No call centres, no scripts — just one expert
              who learns how you like to travel, and builds it around you.
            </Reveal>
            <Reveal className="h26-cta2-actions" delay={0.15}>
              <a href={CONTACT_IMP.phoneHref} className="h26-btn h26-btn-accent h26-btn-lg"><Phone size={17} /> {CONTACT_IMP.phoneDisplay}</a>
              <a href={CONTACT_IMP.whatsappHref} target="_blank" rel="noopener noreferrer" className="h26-btn h26-btn-glass h26-btn-lg"><MessageCircle size={16} /> WhatsApp us</a>
              <Link to={CALLBACK} className="h26-btn h26-btn-glass h26-btn-lg"><Phone size={16} /> Request a callback</Link>
            </Reveal>
            <Reveal as="p" className="h26-cta2-hours" delay={0.2}>Travel experts available 9am–9pm IST, every day · or browse journeys below</Reveal>
            <Reveal as="p" className="hi-plan-safe" delay={0.25}>
              <ShieldCheck size={15} /> 20% deposit · free cancellation for 7 days · visa delay protected · secure payments
            </Reveal>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="h26-footer">
          <div className="h26-footer-top">
            <div className="h26-footer-brand">
              <img src="/cox-logo-new.png" alt="Cox & Kings" />
              <p>The world's most experienced travel company. Established 1758.</p>
              <div className="h26-footer-contact">
                <a href={CONTACT_IMP.phoneHref}><Phone size={15} /> {CONTACT_IMP.phoneDisplay}</a>
                <a href={`mailto:${CONTACT_IMP.email}`}>{CONTACT_IMP.email}</a>
              </div>
            </div>
            <div className="h26-footer-cols">
              <div>
                <h4>Travel</h4>
                <Link to="/journeys">Group tours</Link>
                <Link to={CALLBACK}>Bespoke holidays</Link>
                <Link to="/journeys">Luxury journeys</Link>
                <Link to="/journeys">Destinations</Link>
              </div>
              <div>
                <h4>Company</h4>
                <Link to="/about">Our story</Link>
                <Link to="/about">Specialists</Link>
                <Link to={CALLBACK}>Contact</Link>
                <a href="#trust">Why Cox &amp; Kings</a>
              </div>
              <div>
                <h4>Assurance</h4>
                <a href="#trust">Trust &amp; safety</a>
                <a href="#trust">Awards</a>
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

      {/* Mobile thumb-reach bar — matches /luxe2-improved. Hidden while the
          clips player is open so it doesn't sit under the player's CTA. */}
      <div className={`h26-thumbbar${activeReel !== null ? ' is-hidden' : ''}`}>
        <a href={CONTACT_IMP.phoneHref} className="h26-thumbbar-cta"><Phone size={17} /> Call an Expert</a>
        <a href={CONTACT_IMP.whatsappHref} target="_blank" rel="noopener noreferrer" className="h26-thumbbar-wa" aria-label="Chat on WhatsApp"><MessageCircle size={20} /></a>
        <button type="button" className="h26-thumbbar-ai" aria-label="Open Einaya, the AI travel assistant" onClick={() => setChatOpen(true)}>
          <Sparkles size={20} />
        </button>
      </div>

      {/* Desktop floating AI button — matches /luxe2-improved */}
      <button type="button" className={`h26-aifab ${chatOpen ? 'is-hidden' : ''}`} aria-label="Open Einaya, the AI travel assistant" onClick={() => setChatOpen(true)}>
        <Sparkles size={20} />
        <span>Ask Einaya</span>
      </button>

      {/* Lightweight chat launcher popover */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            className="h26-chat"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-label="Chat with Cox & Kings"
          >
            <div className="h26-chat-head">
              <span className="h26-chat-avatar"><Sparkles size={18} /></span>
              <div>
                <strong>Einaya — AI Travel Designer</strong>
                <em>Typically replies in a few minutes</em>
              </div>
              <button type="button" className="h26-chat-close" aria-label="Close chat" onClick={() => setChatOpen(false)}><X size={18} /></button>
            </div>
            <div className="h26-chat-body">
              <p className="h26-chat-bubble">Hi! 👋 Tell us where you'd like to go and we'll match you with a specialist.</p>
              <div className="h26-chat-quick">
                <a href={CONTACT_IMP.whatsappHref} target="_blank" rel="noopener noreferrer"><MessageCircle size={15} /> Chat on WhatsApp</a>
                <a href={CONTACT_IMP.phoneHref}><Phone size={15} /> Call a specialist</a>
                <Link to={CALLBACK}><Send size={15} /> Send an enquiry</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bespoke "Design it around you" guided flow */}
      <AnimatePresence>
        {bespokeOpen && <BespokeFlow onClose={() => setBespokeOpen(false)} />}
      </AnimatePresence>

      {/* Reel / shorts player */}
      <AnimatePresence>
        {activeReel !== null && (
          <ReelPlayer reels={REELS} index={activeReel} setIndex={setActiveReel} onClose={() => setActiveReel(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
