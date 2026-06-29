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
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useMotionValue, useSpring, useReducedMotion, AnimatePresence } from 'framer-motion';
import {
  Phone, MessageCircle, ArrowRight, ArrowUpRight, Star, Play,
  Search, MapPin, Compass, Calendar, Menu, X, ChevronDown,
  Bot, Instagram, Facebook, Youtube, Linkedin, ChevronUp, Send,
  Plane, BedDouble, Users, UtensilsCrossed, Check, ShieldCheck,
  Wallet, RotateCcw, Lock, Sparkles, Building2, Clock,
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

/* Per-thumbnail cursor-parallax depth (px of travel at full cursor offset).
   Mixed signs + magnitudes give the grid a layered, floating feel. */
const SCATTER_DEPTH = [34, -26, 44, -38, 28, -46, 22];

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
const EXCLUDED = ['Visa fees (we handle the paperwork)', 'Travel insurance', 'Lunches & optional excursions', 'Tips & personal expenses'];
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
              <a href={CONTACT.phoneHref} className="h26-btn h26-btn-pill"><Phone size={16} /> Talk to {specialist.name.split(' ')[0]}</a>
              <a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer" className="h26-btn h26-btn-ghost"><MessageCircle size={16} /> WhatsApp this brief</a>
            </div>
            <button className="bf-restart" onClick={() => setStep(0)}>Start over</button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function Home2026Improved() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [where, setWhere] = useState('');
  const [style, setStyle] = useState(HERO_TRIP_TYPES[0]);
  const [when, setWhen] = useState(HERO_WHEN[0]);
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

  /* Hero parallax — the headline drifts up & fades as the sheet rises. */
  const heroRef = useRef(null);
  const { scrollYProgress: heroP } = useScroll({
    target: heroRef, offset: ['start start', 'end start'],
  });
  const heroY = useTransform(heroP, [0, 1], [0, -120]);
  const heroFade = useTransform(heroP, [0, 0.7], [1, 0]);

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

  /* The hero search carries the visitor's choices through to the
     listing page instead of throwing them away. */
  const searchHref = `/tours?where=${encodeURIComponent(where)}&style=${encodeURIComponent(style)}&when=${encodeURIComponent(when)}`;

  return (
    <div className="h26">
      <a className="h26-skip" href="#top">Skip to content</a>

      {/* Fixed cinematic backdrop the sheet scrolls over */}
      <div className="h26-bg" aria-hidden="true">
        <img src={BG} alt="" />
        <div className="h26-bg-veil" />
        <div className="h26-bg-grain" />
      </div>

      {/* ---------- NAV ---------- */}
      <header className={`h26-nav${scrolled ? ' is-solid' : ''}`}>
        <a href="#top" className="h26-brand">
          <img src="/cox-logo-new.png" alt="Cox & Kings" />
        </a>
        <nav className="h26-links" aria-label="Primary">
          <a href="#paths">Ways to travel</a>
          <a href="#destinations">Destinations</a>
          <a href="#journeys">Journeys</a>
          <a href="#trust">Why us</a>
        </nav>
        <div className="h26-nav-cta">
          <a href={CONTACT.phoneHref} className="h26-phone">
            <Phone size={15} /> <span>{CONTACT.phoneDisplay}</span>
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
              { label: 'Watch & wander', href: '#reels' },
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
            <Link to="/tours" onClick={() => setMenuOpen(false)}>All journeys <ArrowUpRight size={13} /></Link>
            <Link to="/destinations" onClick={() => setMenuOpen(false)}>Destinations <ArrowUpRight size={13} /></Link>
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

      {/* ---------- HERO ---------- */}
      <section className="h26-hero" id="top" ref={heroRef}>
        <motion.div className="h26-hero-inner" style={{ y: heroY, opacity: heroFade }}>
          <Reveal className="h26-eyebrow" as="p">
            Established 1758 · 260+ years of travel
          </Reveal>

          <h1 className="h26-display">
            <WordReveal text="More than a destination," />
            <br />
            <WordReveal text="it's a journey." accent={[2]} delay={0.25} />
          </h1>

          {/* Directed search dock — chips instead of a blank field */}
          <Reveal className="h26-search" delay={0.65}>
            <div className="h26-search-bar">
              <label className="h26-search-seg">
                <span className="h26-search-label"><MapPin size={13} /> Where</span>
                <span className="h26-search-control">
                  <select value={where} onChange={(e) => setWhere(e.target.value)} aria-label="Where to">
                    <option value="" disabled>Where to?</option>
                    {HERO_DESTINATIONS.map((d) => <option key={d}>{d}</option>)}
                  </select>
                  <ChevronDown size={15} className="h26-search-chev" aria-hidden="true" />
                </span>
              </label>
              <span className="h26-search-div" />
              <label className="h26-search-seg">
                <span className="h26-search-label"><Compass size={13} /> Style</span>
                <span className="h26-search-control">
                  <select value={style} onChange={(e) => setStyle(e.target.value)} aria-label="Trip style">
                    {HERO_TRIP_TYPES.map((d) => <option key={d}>{d}</option>)}
                  </select>
                  <ChevronDown size={15} className="h26-search-chev" aria-hidden="true" />
                </span>
              </label>
              <span className="h26-search-div" />
              <label className="h26-search-seg">
                <span className="h26-search-label"><Calendar size={13} /> When</span>
                <span className="h26-search-control">
                  <select value={when} onChange={(e) => setWhen(e.target.value)} aria-label="When to travel">
                    {HERO_WHEN.map((d) => <option key={d}>{d}</option>)}
                  </select>
                  <ChevronDown size={15} className="h26-search-chev" aria-hidden="true" />
                </span>
              </label>
              <Link to={searchHref} className="h26-search-go" aria-label="Find my journey">
                <Search size={18} />
                <span>Find my journey</span>
              </Link>
            </div>
            <div className="h26-search-quick">
              <span>Popular —</span>
              {['Switzerland', 'Japan', 'Italy', 'Northern Lights', 'African Safari'].map((d) => (
                <Link key={d} to={`/tours?where=${encodeURIComponent(d)}`} className="h26-chip">{d}</Link>
              ))}
            </div>
          </Reveal>
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
          </div>
        </section>

        {/* FORK — four ways in: bespoke, escorted, help me decide, talk to someone */}
        <section className="h26-section hi-fork" id="paths">
          <div className="h26-head hi-center">
            <Reveal className="h26-label" as="p">Start here</Reveal>
            <Reveal as="h2" className="h26-h2" delay={0.05}>How would you like to travel?</Reveal>
          </div>
          <div className="hi-fork-grid hi-fork-grid--four">
            {/* Bespoke lane — desire-led, no price (serves Ananya) */}
            <Reveal className="hi-lane">
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
            <Reveal className="hi-lane">
              <div className="hi-lane-media">
                <img src={img('https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99', 800)} alt="An escorted small-group journey" loading="lazy" />
              </div>
              <div className="hi-lane-body">
                <span className="hi-lane-tag">Escorted small groups</span>
                <h3>Join an escorted journey</h3>
                <p>Fixed departures, capped at 18, a tour manager throughout — everything handled, fine company along the way.</p>
                <a href="#journeys" className="h26-btn h26-btn-pill">See group journeys <ArrowRight size={16} /></a>
              </div>
            </Reveal>
            {/* Help me decide — highlighted/recommended path for the undecided visitor */}
            <Reveal className="hi-lane is-featured">
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
            <Reveal className="hi-lane">
              <div className="hi-lane-media">
                <img src={img('https://images.unsplash.com/photo-1521737604893-d14cc237f11d', 800)} alt="A travel specialist ready to talk" loading="lazy" />
              </div>
              <div className="hi-lane-body">
                <span className="hi-lane-tag">A real person</span>
                <h3>Just talk to someone</h3>
                <p>Prefer a conversation? Speak with a specialist directly — no scripts, no call centre, no obligation.</p>
                <a href={CONTACT.phoneHref} className="h26-btn h26-btn-pill">Talk to someone <ArrowRight size={16} /></a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* DESTINATIONS — editorial grid */}
        <section className="h26-section" id="destinations">
          <div className="h26-head h26-head-row">
            <div>
              <Reveal className="h26-label" as="p">100+ countries</Reveal>
              <Reveal as="h2" className="h26-h2" delay={0.05}>Where will you go?</Reveal>
            </div>
            <Reveal as="div" delay={0.1}>
              <Link to="/destinations" className="h26-textlink">All destinations <ArrowUpRight size={16} /></Link>
            </Reveal>
          </div>
          <div className="h26-dest-grid">
            {DESTINATIONS.slice(0, 8).map((d, i) => (
              <Reveal key={d.name} className={`h26-dest h26-dest-${DEST_SPANS[i]}`} delay={(i % 4) * 0.06} y={0}>
                <Link to="/destinations" className="h26-dest-link">
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
              <div className="h26-assure">
                {ASSURANCE.map((a, i) => (
                  <Reveal key={a} className="h26-assure-chip" delay={0.15 + i * 0.05} as="span">{a}</Reveal>
                ))}
              </div>
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
                <span><Phone size={16} /> {CONTACT.phoneDisplay}</span>
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
              <Link to="/contact" className="hi-textlink hi-textlink-light">Read full booking terms <ArrowRight size={14} /></Link>
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
              <Link to="/tours" className="h26-textlink">Browse all journeys <ArrowUpRight size={16} /></Link>
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
            <div className="hi-includes-lists">
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
          </Reveal>

          <div className="h26-journeys">
            {JOURNEYS.slice(0, 5).map((j, i) => (
              <Reveal key={j.title} className={`h26-jrn${j.lead ? ' is-lead' : ''}`} delay={(i % 3) * 0.06} y={0}>
                <Link to="/tours" className="h26-jrn-link">
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
        </section>

        {/* CURATIONS — hand-picked by credentialed specialists */}
        <section className="h26-section" id="curations">
          <div className="h26-head">
            <Reveal className="h26-label" as="p">Hand-picked by our specialists</Reveal>
            <Reveal as="h2" className="h26-h2" delay={0.05}>Ready when you are.</Reveal>
          </div>
          <div className="h26-cur">
            {CURATIONS.map((c, i) => {
              const expert = EXPERTS_IMP.find((e) => e.name === c.specialist);
              return (
                <Reveal key={c.name} className="h26-cur-card" delay={i * 0.07} y={0}>
                  <div className="h26-cur-media">
                    <img src={img(c.image, 800)} alt={c.name} loading="lazy" />
                    <span className="h26-cur-cat">{c.category}</span>
                  </div>
                  <div className="h26-cur-body">
                    <h3>{c.name}</h3>
                    <p className="h26-cur-note">{c.note}</p>
                    <div className="h26-cur-meta">
                      <span>{c.duration}</span>
                      <span className="h26-cur-price">from {c.priceFrom}<small>/person</small></span>
                    </div>
                    {c.departs && <p className="h26-cur-departs">{c.departs}</p>}
                    <div className="h26-cur-expert">
                      {expert && <img src={img(expert.photo, 120)} alt={expert.name} loading="lazy" />}
                      <span>
                        Curated by <strong>{c.specialist}</strong>
                        {expert && <em>{expert.region} · {expert.years}</em>}
                      </span>
                    </div>
                    <Link to="/contact" className="h26-cur-cta">Request this trip <ArrowRight size={15} /></Link>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* REELS — short-form vertical discovery (YouTube-Shorts style) */}
        <section className="h26-section h26-reels-sec" id="reels">
          <div className="h26-head h26-head-row">
            <div>
              <Reveal className="h26-label" as="p">Watch &amp; wander</Reveal>
              <Reveal as="h2" className="h26-h2" delay={0.05}>Real moments, in 30 seconds.</Reveal>
            </div>
            <Reveal as="div" delay={0.1}>
              <Link to="/tours" className="h26-textlink">Explore journeys <ArrowUpRight size={16} /></Link>
            </Reveal>
          </div>
          <Reveal as="p" className="h26-reels-hint" delay={0.05}>Swipe through traveller films — tap any to watch the full journey.</Reveal>
          <div className="h26-reels" ref={reelsRef}>
            {REELS.map((r, i) => (
              <Reveal key={r.id} className="h26-reel" delay={(i % 4) * 0.05} y={0}>
                <button type="button" className="h26-reel-link" onClick={() => setActiveReel(i)} aria-label={`Play ${r.title}`}>
                  <img src={img(r.poster, 700)} alt={r.title} loading="lazy" />
                  <div className="h26-reel-veil" />
                  <span className="h26-reel-tag">{r.tag}</span>
                  <span className="h26-reel-play"><Play size={22} fill="currentColor" /></span>
                  <div className="h26-reel-body">
                    <h3>{r.title}</h3>
                    <p>{r.place}</p>
                    <span className="h26-reel-views"><Play size={11} fill="currentColor" /> {r.views} views</span>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </section>

        {/* REVIEWS — marquee of real travellers */}
        <section className="h26-reviews">
          <div className="h26-head">
            <Reveal className="h26-label" as="p">Travelled, and came back happy</Reveal>
            <Reveal as="h2" className="h26-h2" delay={0.05}>Families who trusted us.</Reveal>
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
              <a href={CONTACT.phoneHref} className="h26-btn h26-btn-accent h26-btn-lg"><Phone size={17} /> {CONTACT.phoneDisplay}</a>
              <a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer" className="h26-btn h26-btn-glass h26-btn-lg"><MessageCircle size={16} /> WhatsApp us</a>
              <Link to="/contact" className="h26-btn h26-btn-glass h26-btn-lg"><Phone size={16} /> Request a callback</Link>
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
                <a href={CONTACT.phoneHref}><Phone size={15} /> {CONTACT.phoneDisplay}</a>
                <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
              </div>
            </div>
            <div className="h26-footer-cols">
              <div>
                <h4>Travel</h4>
                <Link to="/tours">Group tours</Link>
                <Link to="/contact">Bespoke holidays</Link>
                <Link to="/tours">Luxury journeys</Link>
                <Link to="/destinations">Destinations</Link>
              </div>
              <div>
                <h4>Company</h4>
                <Link to="/about">Our story</Link>
                <Link to="/about">Specialists</Link>
                <Link to="/contact">Contact</Link>
                <a href="#trust">Why Cox &amp; Kings</a>
              </div>
              <div>
                <h4>Assurance</h4>
                <a href="#trust">Trust &amp; safety</a>
                <a href="#trust">Awards</a>
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
      </div>

      {/* Mobile thumb-reach bar — matches /luxe2-improved */}
      <div className="h26-thumbbar">
        <a href={CONTACT.phoneHref} className="h26-thumbbar-cta"><Phone size={17} /> Call an Expert</a>
        <a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer" className="h26-thumbbar-wa" aria-label="Chat on WhatsApp"><MessageCircle size={20} /></a>
        <button type="button" className="h26-thumbbar-ai" aria-label="Open Enaya, the AI travel assistant" onClick={() => setChatOpen(true)}>
          <Sparkles size={20} />
        </button>
      </div>

      {/* Desktop floating AI button — matches /luxe2-improved */}
      <button type="button" className={`h26-aifab ${chatOpen ? 'is-hidden' : ''}`} aria-label="Open Enaya, the AI travel assistant" onClick={() => setChatOpen(true)}>
        <Sparkles size={20} />
        <span>Ask Enaya</span>
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
                <strong>Enaya — AI Travel Designer</strong>
                <em>Typically replies in a few minutes</em>
              </div>
              <button type="button" className="h26-chat-close" aria-label="Close chat" onClick={() => setChatOpen(false)}><X size={18} /></button>
            </div>
            <div className="h26-chat-body">
              <p className="h26-chat-bubble">Hi! 👋 Tell us where you'd like to go and we'll match you with a specialist.</p>
              <div className="h26-chat-quick">
                <a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer"><MessageCircle size={15} /> Chat on WhatsApp</a>
                <a href={CONTACT.phoneHref}><Phone size={15} /> Call a specialist</a>
                <Link to="/contact"><Send size={15} /> Send an enquiry</Link>
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
          <motion.div
            className="h26-reelplayer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setActiveReel(null)}
          >
            <button className="h26-reelplayer-close" aria-label="Close player" onClick={() => setActiveReel(null)}><X size={24} /></button>
            <button className="h26-reelplayer-nav up" aria-label="Previous reel" onClick={(e) => { e.stopPropagation(); setActiveReel((i) => (i - 1 + REELS.length) % REELS.length); }}><ChevronUp size={26} /></button>
            <motion.div
              key={REELS[activeReel].id}
              className="h26-reelplayer-stage"
              initial={{ opacity: 0, scale: 0.96, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <img src={img(REELS[activeReel].poster, 900)} alt={REELS[activeReel].title} />
              <div className="h26-reelplayer-veil" />
              <span className="h26-reelplayer-live"><span className="h26-reelplayer-dot" /> Reel · {activeReel + 1}/{REELS.length}</span>
              <span className="h26-reelplayer-bigplay"><Play size={30} fill="currentColor" /></span>
              <div className="h26-reelplayer-info">
                <span className="h26-reel-tag">{REELS[activeReel].tag}</span>
                <h3>{REELS[activeReel].title}</h3>
                <p>{REELS[activeReel].place} · {REELS[activeReel].views} views</p>
                <Link to="/tours" className="h26-btn h26-btn-accent">Explore this journey <ArrowRight size={16} /></Link>
              </div>
            </motion.div>
            <button className="h26-reelplayer-nav down" aria-label="Next reel" onClick={(e) => { e.stopPropagation(); setActiveReel((i) => (i + 1) % REELS.length); }}><ChevronDown size={26} /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
