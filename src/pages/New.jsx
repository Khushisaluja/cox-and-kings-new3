/* ============================================================
   New — composite page assembled from the best sections of the
   existing prototypes (route /new):

   · Navbar, hero, "Specialists, not salespeople." intro,
     "How would you like to travel?" fork, destinations grid,
     Clips (reels) section and footer  →  from /improved
   · Enaya (the working AI concierge — floating "Ask Enaya"
     button + ChatBot), "Crafting unforgettable journeys since
     1758" heritage, photo-first reviews and the "As featured
     in" press marquee  →  from /luxe2-improved
   · "Relaxed pace, for a calm vacation" shelf  →  from /journeys

   Self-contained: brings its own header + footer, does not touch
   any other route. The three design systems coexist because every
   stylesheet is prefix-scoped (h26-/hi-, lx2i-, jl-).
   ============================================================ */
import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { SmartLink as Link, CALLBACK } from '../components/ScheduleCall';
import { motion, useScroll, useTransform, useMotionValue, useSpring, useReducedMotion, AnimatePresence } from 'framer-motion';
import {
  Phone, MessageCircle, ArrowRight, ArrowUpRight, Star, Search, MapPin,
  Compass, Calendar, Menu, X, ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  Instagram, Facebook, Youtube, Linkedin, Check, Sparkles, Quote,
  Award, ShieldCheck, Globe2, Clock, Users, Gauge, Images,
} from 'lucide-react';
import {
  img, CONTACT, RATING, DESTINATIONS, ASSURANCE, EXPERTS, REELS,
  HERO_DESTINATIONS, HERO_TRIP_TYPES,
} from '../data/v3content';
import ChatBot from '../components/ChatBot';
import './Home2026.css';
import './Home2026Improved.css';
import './Luxe2Improved.css';
import './Journeys.css';
import './NewTypography.css'; // /new-homepage: Cormorant Garamond (primary) + Work Sans (secondary)

/* ---------- Shared contact (matches /improved & /luxe2-improved) ---------- */
const CONTACT_IMP = {
  ...CONTACT,
  phoneDisplay: '+91 8556001700',
  phoneHref: 'tel:+918556001700',
  whatsappHref: 'https://wa.me/918556001700',
};

/* ---------- Desktop nav megamenus (from /improved, anchors remapped
   to the sections that exist on THIS page) ---------- */
const NAV_MENU = [
  {
    label: 'Ways to travel', href: '#paths',
    blurb: 'Two ways to see the world — pick the one that fits you.',
    items: [
      { label: 'Escorted group tours', desc: 'Expert-led, fixed departures', href: '#paths' },
      { label: 'Tailor-made journeys', desc: 'Designed entirely around you', href: '#paths' },
      { label: 'Luxury & private travel', desc: 'Elevated stays and guiding', href: '#relaxed' },
      { label: 'Help me decide', desc: 'Talk it through with a specialist', to: CALLBACK },
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
    label: 'Journeys', href: '#relaxed',
    blurb: 'Signature itineraries, ready to make your own.',
    items: [
      { label: 'Cherry Blossom Japan', desc: '13 nights · Mar–Apr', to: '/tour-detail-japan-4' },
      { label: 'Classic Switzerland', desc: 'Scenic rail & summits', to: '/tour-detail-japan-4' },
      { label: 'Relaxed-pace journeys', desc: 'A calm vacation, handled', href: '#relaxed' },
      { label: 'Ready when you are', desc: 'Hand-picked departures', to: '/journeys' },
    ],
  },
  {
    label: 'Why us', href: '#heritage',
    blurb: 'Specialists, not salespeople — and 260 years behind every trip.',
    items: [
      { label: 'Since 1758', desc: 'Heritage you can lean on', href: '#heritage' },
      { label: 'Real reviews', desc: '2,400+ verified travellers', href: '#reviews' },
      { label: 'As featured in', desc: 'The press that covers us', href: '#press' },
      { label: 'Talk to an expert', desc: 'We pick up the phone', to: CALLBACK },
    ],
  },
];

/* --- Tabler icons for the Clips section (from /improved) --- */
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

/* Per-thumbnail cursor-parallax depth for the scatter grid. */
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

/* --- "When" calendar helpers (hero search) --- */
const WK_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MON_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const FLEX_OPTS = [0, 1, 2, 3];
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

/* One floating thumbnail: scroll drift (y) blended with cursor parallax. */
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

/* The cinematic backdrop the sheet scrolls over. */
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

/* Hand-tuned spans so the 8-card destination grid tiles with zero gaps. */
const DEST_SPANS = ['tall', 'wide', 'tall', 'wide', 'normal', 'normal', 'normal', 'normal'];

/* ---- Reusable blur-to-focus reveal (from /improved) ---- */
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

/* ---- Bespoke "Design It Around You" guided flow (from /improved) ---- */
const IMP_EXPERT_PHOTOS = {
  'Meera Sundaram': 'https://images.unsplash.com/photo-1463335361701-e90f4c5045d0',
  'Arjun Rao': 'https://images.unsplash.com/photo-1618306842557-a2515acf2112',
  'Nisha Verma': 'https://images.unsplash.com/photo-1759840278361-f1adc75529a1',
};
const EXPERTS_IMP = EXPERTS.map((e) => ({ ...e, photo: IMP_EXPERT_PHOTOS[e.name] || e.photo }));

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

/* ---- "Schedule a callback" popup (opened from the mobile call icon) ---- */
const CB_PURPOSES = [
  'Plan a new trip',
  'Get a price quote',
  'An existing booking',
  'Group / family tour',
  'Bespoke / tailor-made journey',
  'Other',
];
const CB_TIMES = [
  'As soon as possible',
  '9–11 AM',
  '11 AM–1 PM',
  '1–3 PM',
  '3–5 PM',
  '5–7 PM',
  '7–9 PM',
];

function ScheduleCallback({ onClose }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [purpose, setPurpose] = useState(CB_PURPOSES[0]);
  const [purposeOther, setPurposeOther] = useState('');
  const [time, setTime] = useState(CB_TIMES[0]);
  const [sent, setSent] = useState(false);

  const phoneValid = phone.replace(/\D/g, '').length >= 7;
  const purposeText = purpose === 'Other' ? purposeOther.trim() : purpose;
  const canSubmit = name.trim().length > 1 && phoneValid && !!time
    && (purpose !== 'Other' || purposeOther.trim().length > 1);

  const waHref = `${CONTACT_IMP.whatsappHref}?text=${encodeURIComponent(
    `Hi Cox & Kings, please schedule a callback.\nName: ${name}\nPhone: ${phone}\nAbout: ${purposeText}\nPreferred time: ${time}`,
  )}`;

  const submit = (e) => {
    e.preventDefault();
    if (canSubmit) setSent(true);
  };

  return (
    <motion.div
      className="bf h26-cb" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }} onClick={onClose}
    >
      <motion.div
        className="bf-panel cb-panel" role="dialog" aria-modal="true" aria-label="Schedule a callback"
        initial={{ opacity: 0, y: 28, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} onClick={(e) => e.stopPropagation()}
      >
        <button className="bf-close" aria-label="Close" onClick={onClose}><X size={20} /></button>

        {!sent ? (
          <form className="cb-form" onSubmit={submit}>
            <span className="bf-eyebrow"><Phone size={13} /> Schedule a callback</span>
            <h3 className="bf-q cb-title">A specialist will call you back</h3>
            <p className="cb-intro">Leave your details and a time that suits you — we'll call, no charge and no obligation.</p>

            <label className="cb-field">
              <span className="cb-label">Your name</span>
              <input className="cb-input" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Priya Sharma" autoComplete="name" required />
            </label>

            <label className="cb-field">
              <span className="cb-label">Phone number</span>
              <input className="cb-input" type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. +91 98765 43210" autoComplete="tel" required />
            </label>

            <label className="cb-field">
              <span className="cb-label">What's it about?</span>
              <span className="cb-select-wrap">
                <select className="cb-input cb-select" value={purpose} onChange={(e) => setPurpose(e.target.value)} aria-label="Purpose of callback">
                  {CB_PURPOSES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
                <ChevronDown size={16} className="cb-select-chev" aria-hidden="true" />
              </span>
            </label>

            {purpose === 'Other' && (
              <label className="cb-field">
                <span className="cb-label">Tell us a little more</span>
                <input className="cb-input" type="text" value={purposeOther} onChange={(e) => setPurposeOther(e.target.value)} placeholder="In a few words…" required />
              </label>
            )}

            <div className="cb-field">
              <span className="cb-label">Preferred time to call</span>
              <div className="bf-chips cb-times">
                {CB_TIMES.map((t) => (
                  <button key={t} type="button" className={`bf-chip${time === t ? ' on' : ''}`} onClick={() => setTime(t)}>{t}</button>
                ))}
              </div>
            </div>

            <button type="submit" className="h26-btn h26-btn-accent cb-submit" disabled={!canSubmit}>
              Request my callback <ArrowRight size={16} />
            </button>
          </form>
        ) : (
          <div className="cb-done">
            <span className="cb-done-ic"><Check size={26} /></span>
            <h3 className="bf-q cb-title">You're all set, {name.trim().split(' ')[0]}.</h3>
            <p className="cb-intro">
              A Cox &amp; Kings specialist will call you on <strong>{phone}</strong>, <strong>{time.toLowerCase()}</strong>
              {purposeText ? <>, about <strong>{purposeText.toLowerCase()}</strong></> : null}.
            </p>
            <div className="cb-done-actions">
              <a href={waHref} target="_blank" rel="noopener noreferrer" className="h26-btn h26-btn-accent"><MessageCircle size={16} /> Send details on WhatsApp</a>
              <button type="button" className="h26-btn h26-btn-ghost" onClick={onClose}>Done</button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* Full-screen vertical reel player — YouTube-Shorts style (from /improved). */
function ReelPlayer({ reels, index, setIndex, onClose }) {
  const reel = reels[index];
  const [saved, setSaved] = useState({});
  const [liked, setLiked] = useState({});
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [shared, setShared] = useState(false);
  const [hint, setHint] = useState(true);
  const [dir, setDir] = useState(1);
  const wheelLock = useRef(false);

  const isSaved = !!saved[reel.id];
  const isLiked = !!liked[reel.id];
  const comments = buildReelComments(reel);
  const go = (d) => { setDir(d); setIndex((i) => (i + d + reels.length) % reels.length); };

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

/* Hero-search dropdown popover, rendered in a body portal (from /improved). */
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

/* Swipe indicator for the mobile horizontal carousels (from /improved). */
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

/* ============================================================
   From /luxe2-improved — heritage, reviews, press
   ============================================================ */
const sizedUnsplash = (id, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const TRUST_BADGES = [
  { icon: Star, stat: '4.9★', label: 'from 2,400+ verified reviews' },
  { icon: Award, stat: 'Condé Nast 2024', label: 'Readers’ Choice Award, India' },
  { icon: ShieldCheck, stat: 'Since 1758', label: '267 years · financially protected' },
  { icon: Globe2, stat: '100+ countries', label: 'on all seven continents' },
];

const LX_REVIEWS = [
  { name: 'Mr & Mrs Iyer', age: 'Both 67', trip: 'Europe · Escorted Group Tour', rating: 5, span: 'tall',
    text: 'We worried the pace would be too much at our age - it was perfectly gentle. The tour manager carried our bags and found us Jain meals every single day.',
    ids: ['1630001722538-a9a540da549b', '1529156069898-49953e39b3ac', '1642342397404-fed6450eb964'] },
  { name: 'Sunita Rao', age: '', trip: 'Japan · Cherry Blossom', rating: 5, span: 'tall',
    text: 'Flawless from start to finish. The cherry blossom viewing in Kyoto was a once-in-a-lifetime moment, arranged beautifully.',
    ids: ['1567122087721-47b09b61e1d1', '1667029839636-af119b059c49', '1639979511572-ff346bc5b3b7'] },
  { name: 'Arjun & Meera', age: '', trip: 'Maldives · Honeymoon', rating: 5, span: 'tall',
    text: 'An overwater villa, a private sandbank dinner, and not a single thing to worry about. Pure magic.',
    ids: ['1677179974826-b6619bd77506', '1677176455554-03ae366d51d5', '1639979511514-904e46c8c13f'] },
  { name: 'The Nair Family', age: '3 generations', trip: 'Switzerland · Escorted Group Tour', rating: 5, span: 'tall',
    text: 'Grandparents, parents and two kids - all looked after. The fixed departure meant zero planning stress and the kids still talk about the Glacier Express.',
    ids: ['1758272959663-b30513083206', '1715745218436-5a583702447a', '1580825175616-77f8df1bb507'] },
  { name: 'Rohan Kapoor', age: '', trip: 'Kenya · Safari', rating: 5, span: 'tall',
    text: 'We watched the migration cross the Mara at dawn. The lodge, the guides, the timing - all impeccable.',
    ids: ['1539635278303-d4002c07eae3', '1581866548373-e6b8e1d0342c', '1758272959063-ef8a2114f807'] },
  { name: 'Priya Menon', age: '', trip: 'Italy · Tailor-Made', rating: 5, span: 'tall',
    text: 'A private gondola, a chef in Tuscany, a guide who opened doors most tourists never see. Worth every rupee.',
    ids: ['1721884487052-8fb79415772c', '1763643820621-d775cf3ae5dd', '1506869640319-fe1a24fd76dc'] },
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

/* One review card: a small photo gallery that auto-slides on hover. */
function ReviewCard({ r, i }) {
  const ids = r.ids && r.ids.length ? r.ids : (r.id ? [r.id] : []);
  const [idx, setIdx] = useState(0);
  const timer = useRef(null);
  const reduce = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const start = () => {
    if (reduce || ids.length < 2 || timer.current) return;
    timer.current = setInterval(() => setIdx((n) => (n + 1) % ids.length), 1300);
  };
  const stop = () => {
    if (timer.current) { clearInterval(timer.current); timer.current = null; }
    setIdx(0);
  };
  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);

  return (
    <figure
      className={`lx2i-rcard ${r.span ? `lx2i-rcard--${r.span}` : ''} lx2i-reveal`}
      style={{ '--d': `${(i % 3) * 0.08}s` }}
      onMouseEnter={start}
      onMouseLeave={stop}
    >
      <div
        className="lx2i-rcard__slides"
        style={{ transform: `translateX(-${idx * 100}%)` }}
        onClick={ids.length > 1 ? () => setIdx((n) => (n + 1) % ids.length) : undefined}
        role={ids.length > 1 ? 'button' : undefined}
        aria-label={ids.length > 1 ? 'Next photo' : undefined}
      >
        {ids.map((id, k) => (
          <div
            key={id + k}
            className="lx2i-rcard__slide"
            style={{ backgroundImage: `url(${sizedUnsplash(id, 800)})` }}
            role="img"
            aria-label={`${r.trip} - photo ${k + 1} of ${ids.length} by ${r.name}`}
          />
        ))}
      </div>
      {ids.length > 1 && (
        <div className="lx2i-rcard__dots">
          {ids.map((id, k) => (
            <button
              key={id + k}
              type="button"
              className={`lx2i-rcard__dot ${k === idx ? 'is-on' : ''}`}
              aria-label={`Show photo ${k + 1}`}
              aria-current={k === idx}
              onMouseEnter={() => setIdx(k)}
              onClick={() => setIdx(k)}
            />
          ))}
        </div>
      )}
      <figcaption className="lx2i-rcard__glass lx2i-glass">
        <div className="lx2i-rcard__meta">
          <div>
            <strong>{r.name}{r.age && <em className="lx2i-rcard__age"> · {r.age}</em>}</strong>
            <span>{r.trip}</span>
          </div>
          <span className="lx2i-stars">{[...Array(r.rating)].map((_, j) => <Star key={j} size={12} fill="currentColor" />)}</span>
        </div>
        <p className="lx2i-rcard__text"><Quote size={15} className="lx2i-rcard__q" />{r.text}</p>
      </figcaption>
    </figure>
  );
}

const LX_PRESS = [
  { name: 'Condé Nast Traveler', src: '/press/cntraveller.svg' },
  { name: 'National Geographic', src: '/press/natgeo.svg' },
  { name: 'Travel + Leisure', src: '/press/travel-leisure.svg' },
  { name: 'Forbes', src: '/press/forbes.svg' },
  { name: "Harper's Bazaar", src: '/press/harpers-bazaar.svg' },
  { name: 'The Telegraph', src: '/press/telegraph.svg' },
];

/* Scroll-reveal for the lx2i-reveal elements (from /luxe2-improved). */
function useLxReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.lx2i-reveal');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { els.forEach((e) => e.classList.add('in')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);
}

/* Count-up stat — rest state is ALWAYS the final number. */
function useCountUp(target, run) {
  const [val, setVal] = useState(target);
  useEffect(() => {
    if (!run) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setVal(target); return; }
    const from = Math.round(target * 0.82);
    let raf; const start = performance.now(); const dur = 1100;
    setVal(from);
    const tick = (now) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(from + (target - from) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setVal(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run]);
  return val;
}

function Stat({ value, suffix, label, run }) {
  const v = useCountUp(value, run);
  return (
    <div className="lx2i-stat">
      <span className="lx2i-stat__num">{v}{suffix}</span>
      <span className="lx2i-stat__lbl">{label}</span>
    </div>
  );
}

/* ============================================================
   From /journeys — the "Relaxed pace, for a calm vacation" shelf
   ============================================================ */
const U = (id) => `https://images.unsplash.com/photo-${id}`;
const REGION_PHOTOS = {
  Japan: [U('1522383225653-ed111181a951'), U('1492571350019-22de08371fd3'), U('1493976040374-85c8e12f0c0e'), U('1490806843957-31f4c9a91c65'), U('1528360983277-13d401cdc186'), U('1540959733332-eab4deabeeaf')],
  Switzerland: [U('1530122037265-a5f1f91d3b99'), U('1467269204594-9661b134dd2b')],
  Italy: [U('1534445867742-43195f401b6c'), U('1523906834658-6e24ef2386f9'), U('1467269204594-9661b134dd2b')],
  'Australia & NZ': [U('1506973035872-a4ec16b8e8d9'), U('1469521669194-babb45599def'), U('1507699622108-4be3abd695ad')],
  'Southeast Asia': [U('1528181304800-259b08848526'), U('1546708973-b339540b5162')],
  Maldives: [U('1514282401047-d79a71a590e8'), U('1546708973-b339540b5162')],
};
const GROUP_BY_STYLE = {
  'Group Tour': 'Small group · max 18',
  'Bespoke Private': 'Private & tailor-made',
  Luxury: 'Private guiding',
  Family: 'Family-friendly',
  Honeymoon: 'Just the two of you',
  Safari: 'Small-group safari',
};
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
/* The relaxed-pace journeys shown on this page's shelf. */
const RELAXED_JOURNEYS = [
  J({ id: 'jp-luxe', title: 'Japan: Ryokans & Art Islands', blurb: 'Slow luxury — design hotels, private onsen and the Naoshima art islands.', regions: ['Japan'], style: 'Luxury', pace: 'Relaxed', rating: 4.9, nights: 9, season: 'Year-round', price: 420000, image: U('1493976040374-85c8e12f0c0e'), to: '/tour-detail-japan-5' }),
  J({ id: 'ch-summer', title: 'Summer in Switzerland', blurb: 'Glacier trains and alpine lakes — Lucerne, Zermatt and the Jungfrau region.', regions: ['Switzerland', 'Europe'], style: 'Group Tour', pace: 'Relaxed', rating: 4.8, nights: 10, season: 'Jun–Sep', price: 245000, image: U('1530122037265-a5f1f91d3b99'), to: CALLBACK }),
  J({ id: 'ch-rail', title: 'Swiss Alps Private Rail Journey', blurb: 'The Glacier Express and Bernina line, first-class, with elevated stays throughout.', regions: ['Switzerland', 'Europe'], style: 'Luxury', pace: 'Relaxed', rating: 4.9, nights: 8, season: 'May–Oct', price: 360000, image: U('1530122037265-a5f1f91d3b99'), to: CALLBACK }),
  J({ id: 'it-slow', title: 'Slow Italy: Coast to Art', blurb: 'Rome after-hours, a Tuscan villa and a hidden Amalfi cove — designed around you.', regions: ['Italy', 'Europe'], style: 'Bespoke Private', pace: 'Relaxed', rating: 4.8, nights: 9, season: 'Apr–Oct', price: 240000, image: U('1534445867742-43195f401b6c'), to: CALLBACK }),
  J({ id: 'it-amalfi', title: 'Amalfi & the Southern Coast', blurb: 'A private skipper, cliffside stays and long lunches above the Tyrrhenian.', regions: ['Italy', 'Europe'], style: 'Luxury', pace: 'Relaxed', rating: 4.8, nights: 7, season: 'May–Sep', price: 280000, image: U('1534445867742-43195f401b6c'), to: CALLBACK }),
  J({ id: 'it-family', title: 'Italy for Families', blurb: 'Gladiator schools in Rome, gelato trails and a slow Tuscan farmhouse week.', regions: ['Italy', 'Europe'], style: 'Family', pace: 'Relaxed', rating: 4.7, nights: 10, season: 'Apr–Oct', price: 215000, image: U('1534445867742-43195f401b6c'), to: CALLBACK }),
  J({ id: 'au-family', title: 'Australia for Families', blurb: 'Reef, beaches and easy days — snorkelling, Rotorua and time to breathe.', regions: ['Australia & NZ'], style: 'Family', pace: 'Relaxed', rating: 4.7, nights: 14, season: 'Year-round', price: 340000, image: U('1506973035872-a4ec16b8e8d9'), to: CALLBACK }),
  J({ id: 'sea-srilanka', title: 'Sri Lanka: Tea Trails & Coast', blurb: 'Hill-country tea estates, ancient cities and a slow finish by the sea.', regions: ['Southeast Asia'], style: 'Bespoke Private', pace: 'Relaxed', rating: 4.8, nights: 9, season: 'Year-round', price: 130000, image: U('1546708973-b339540b5162'), to: CALLBACK }),
  J({ id: 'mv-overwater', title: 'Maldives Overwater Escape', blurb: 'Overwater calm — a private villa, a house reef and nowhere to be.', regions: ['Maldives'], style: 'Honeymoon', pace: 'Relaxed', rating: 4.9, nights: 5, season: 'Year-round', price: 140000, image: U('1514282401047-d79a71a590e8'), to: CALLBACK }),
];
const RELAXED_COL = {
  key: 'relaxed',
  title: 'Relaxed pace, for a calm vacation',
  sub: 'Slow mornings, gentle days and comfortable distances — easy on every generation.',
};

/* WhatsApp glyph (lucide has no brand icon) — used on the enquiry CTA. */
const WaIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.5A10 10 0 1 0 12 2zm0 18.3c-1.5 0-2.98-.4-4.27-1.16l-.3-.18-3.17 1 1.02-3.09-.2-.32A8.3 8.3 0 1 1 12 20.3z" />
    <path d="M17.5 14.4c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35z" />
  </svg>
);

/* A single journey card (from /journeys). */
function JourneyCard({ j, i, onPhotos }) {
  const waHref = `${CONTACT_IMP.whatsappHref}?text=${encodeURIComponent(`Hi Cox & Kings, I'd like to enquire about the "${j.title}" journey.`)}`;
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

/* The themed collection shelf — a horizontally scrollable rail (from /journeys). */
function Shelf({ col, list, onPhotos }) {
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

/* Photo lightbox — cycles a tour's gallery (from /journeys). */
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

/* ============================================================
   THE PAGE
   ============================================================ */
export default function New() {
  useLxReveal();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [where, setWhere] = useState('');
  const [whereOpen, setWhereOpen] = useState(false);
  const whereRef = useRef(null);
  const [style, setStyle] = useState('');
  const [styleOpen, setStyleOpen] = useState(false);
  const styleRef = useRef(null);
  const [whenOpen, setWhenOpen] = useState(false);
  const whenRef = useRef(null);
  const [whenDate, setWhenDate] = useState(null);
  const [whenFlex, setWhenFlex] = useState(0);
  const [whenMonth, setWhenMonth] = useState(() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); });
  const [chatOpen, setChatOpen] = useState(false);
  const [activeReel, setActiveReel] = useState(null);
  const [bespokeOpen, setBespokeOpen] = useState(false);
  const [callbackOpen, setCallbackOpen] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [statsRun, setStatsRun] = useState(false);
  const statsRef = useRef(null);

  const openPhotos = useCallback((j) => setLightbox({ title: j.title, photos: j.gallery, index: 0 }), []);

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
      if (e.target.closest && e.target.closest('.hi-where-pop')) return;
      if (whereRef.current && !whereRef.current.contains(e.target)) setWhereOpen(false);
      if (styleRef.current && !styleRef.current.contains(e.target)) setStyleOpen(false);
      if (whenRef.current && !whenRef.current.contains(e.target)) setWhenOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [whereOpen, styleOpen, whenOpen]);

  /* Lock body scroll while a modal surface is open. */
  useEffect(() => {
    const lock = menuOpen || activeReel !== null || bespokeOpen || callbackOpen || !!lightbox;
    document.body.style.overflow = lock ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen, activeReel, bespokeOpen, callbackOpen, lightbox]);

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

  /* Hero parallax. */
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

  /* Cursor parallax for the scatter grid. */
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

  /* Refs for the mobile carousels. */
  const forkRef = useRef(null);
  const destRef = useRef(null);

  /* Mobile reels: auto-advance the horizontal carousel. */
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

  /* Trigger the heritage count-up when the stats band enters view. */
  useEffect(() => {
    if (!statsRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setStatsRun(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setStatsRun(true); io.disconnect(); } }, { threshold: 0.25 });
    io.observe(statsRef.current);
    return () => io.disconnect();
  }, []);

  /* "When" — derive a friendly label from the picked date + flexible window. */
  const whenLabel = whenDate
    ? `${whenDate.getDate()} ${MON_NAMES[whenDate.getMonth()].slice(0, 3)}${whenFlex ? ` · ±${whenFlex}d` : ''}`
    : 'Anytime';
  const calCells = buildCalendar(whenMonth);
  const todayMidnight = new Date(); todayMidnight.setHours(0, 0, 0, 0);
  const canGoPrevMonth = whenMonth > new Date(todayMidnight.getFullYear(), todayMidnight.getMonth(), 1);

  const searchHref = `/journeys?where=${encodeURIComponent(where)}&style=${encodeURIComponent(style)}`;

  const whereQuery = where.trim().toLowerCase();
  const whereSuggestions = whereQuery
    ? HERO_DESTINATIONS.filter((d) => d.toLowerCase().includes(whereQuery))
    : HERO_DESTINATIONS;

  return (
    <>
    <div className="h26 new-typo">
      <a className="h26-skip" href="#top">Skip to content</a>

      {/* Fixed cinematic backdrop the sheet scrolls over */}
      <div className="h26-bg" aria-hidden="true">
        <img src={BG} alt="" />
        <div className="h26-bg-veil" />
        <div className="h26-bg-grain" />
      </div>

      {/* ---------- NAV (from /improved) ---------- */}
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
          <Link to={CALLBACK} className="h26-btn h26-btn-pill">Talk to an expert</Link>
          <button
            className="h26-burger"
            aria-label="Menu"
            onClick={() => setMenuOpen(true)}
          >
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
            {[
              { label: 'Ways to travel', href: '#paths' },
              { label: 'Destinations', href: '#destinations' },
              { label: 'Journeys', href: '#relaxed' },
              { label: 'Clips', href: '#reels' },
              { label: 'Reviews', href: '#reviews' },
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

      {/* ---------- HERO (from /improved) ---------- */}
      <section className="h26-hero" id="top" ref={heroRef}>
        <motion.div className="h26-hero-inner" style={{ y: (isMobile || prefersReduced) ? 0 : heroY }}>
          <Reveal className="h26-eyebrow" as="p">
            Established 1758 · 260+ years of travel
          </Reveal>

          <h1 className="h26-display">
            <WordReveal text="More than a destination," />
            <br />
            <WordReveal text="it's a journey." accent={[2]} delay={0.25} />
          </h1>

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
            <motion.a
              href="#reviews"
              className="h26-hero-rating"
              initial={prefersReduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="h26-hero-rating-stars">{[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}</span>
              <strong>4.9</strong>
              <span>from 2,400+ verified reviews</span>
              <ArrowRight size={15} />
            </motion.a>
            <div className="h26-search-quick">
              <span>Popular —</span>
              {['Switzerland', 'Japan', 'Italy', 'Northern Lights', 'African Safari'].map((d) => (
                <Link key={d} to="/journeys/japan" className="h26-chip">{d}</Link>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Floating stat pills */}
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

        {/* INTRO — "Specialists, not salespeople. Every detail, handled." (from /improved) */}
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

        {/* FORK — "How would you like to travel?" (from /improved) */}
        <section className="h26-section hi-fork" id="paths">
          <div className="h26-head hi-center">
            <Reveal className="h26-label" as="p">Start here</Reveal>
            <Reveal as="h2" className="h26-h2" delay={0.05}>How would you like to travel?</Reveal>
          </div>
          <div className="hi-fork-grid hi-fork-grid--four" ref={forkRef}>
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

        {/* DESTINATIONS — editorial grid (from /improved) */}
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

        {/* HERITAGE — "Crafting unforgettable journeys since 1758" (from /luxe2-improved) */}
        <div className="lx2i">
          <section className="lx2i-heritage" id="heritage">
            <div className="lx2i-container lx2i-heritage__grid">
              <div className="lx2i-heritage__media lx2i-reveal">
                <div className="lx2i-heritage__photo lx2i-heritage__photo--main" style={{ backgroundImage: `url(${sizedUnsplash('1599661046289-e31897846e41', 900)})` }} />
                <div className="lx2i-heritage__card lx2i-glass">
                  <span className="lx2i-eyebrow">SINCE 1758</span>
                  <h4>Bespoke Itineraries</h4>
                  <p>Each journey we curate is a masterpiece - crafted with care and precision to reflect you alone.</p>
                  <div className="lx2i-heritage__photo lx2i-heritage__photo--inset" style={{ backgroundImage: `url(${sizedUnsplash('1523906834658-6e24ef2386f9', 600)})` }} />
                </div>
              </div>

              <div className="lx2i-heritage__text lx2i-reveal">
                <span className="lx2i-eyebrow">OUR HERITAGE</span>
                <h2 className="lx2i-h2">Crafting <strong>unforgettable<br />journeys</strong> since 1758</h2>
                <p className="lx2i-heritage__copy">
                  From the age of sail to the era of bespoke travel, Cox &amp; Kings has guided generations
                  of explorers across the globe - the same name, the same standard, for over a quarter of a millennium.
                </p>

                <ul className="lx2i-trust" aria-label="Why travellers trust Cox & Kings">
                  {TRUST_BADGES.map((b) => {
                    const Icon = b.icon;
                    return (
                      <li key={b.stat} className="lx2i-trust__item">
                        <span className="lx2i-trust__ic"><Icon size={20} strokeWidth={1.6} /></span>
                        <span className="lx2i-trust__body">
                          <strong>{b.stat}</strong>
                          <small>{b.label}</small>
                        </span>
                      </li>
                    );
                  })}
                </ul>

                <div className="lx2i-statband" ref={statsRef}>
                  <Stat value={267} suffix="" label="Years of journeys" run={statsRun} />
                  <span className="lx2i-statband__div" />
                  <Stat value={100} suffix="+" label="Countries" run={statsRun} />
                  <span className="lx2i-statband__div" />
                  <Stat value={98} suffix="%" label="Would travel again" run={statsRun} />
                </div>
                <Link to="/about" className="lx2i-btn lx2i-btn--primary">Discover our story <ArrowRight size={16} /></Link>
              </div>
            </div>
          </section>
        </div>

        {/* RELAXED PACE — "Relaxed pace, for a calm vacation" shelf (from /journeys) */}
        <div className="jl" id="relaxed">
          <div className="jl-collections">
            <Shelf col={RELAXED_COL} list={RELAXED_JOURNEYS} onPhotos={openPhotos} />
          </div>
        </div>

        {/* CLIPS — short-form vertical discovery (from /improved) */}
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

        {/* REVIEWS + PRESS (from /luxe2-improved) */}
        <div className="lx2i">
          <section className="lx2i-reviews" id="reviews">
            <div className="lx2i-container">
              <div className="lx2i-reviews__head lx2i-reveal">
                <div>
                  <span className="lx2i-eyebrow">TRAVELLER STORIES</span>
                  <h2 className="lx2i-h2">Real journeys, captured<br />by <strong>real travellers</strong></h2>
                </div>
                <div className="lx2i-reviews__agg lx2i-glass">
                  <span className="lx2i-stars lx2i-stars--lg">{[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}</span>
                  <strong>4.9 / 5</strong>
                  <span>from 2,400+ verified reviews</span>
                  <div className="lx2i-reviews__plats">
                    <span className="lx2i-revplat"><GoogleG /> <b>4.8</b> on Google</span>
                    <span className="lx2i-revplat"><TripAdvisorOwl /> <b>4.9</b> on Tripadvisor</span>
                  </div>
                </div>
              </div>

              <div className="lx2i-wall">
                {LX_REVIEWS.map((r, i) => (
                  <ReviewCard key={r.name} r={r} i={i} />
                ))}
              </div>

              <div className="lx2i-reviews__more lx2i-reveal">
                <Link to="/about" className="lx2i-btn lx2i-btn--outline lx2i-btn--lg">View all 2,400+ reviews <ArrowRight size={16} /></Link>
              </div>
            </div>
          </section>

          {/* AS SEEN IN — press marquee */}
          <section className="lx2i-press" id="press" aria-label="As featured in">
            <div className="lx2i-press__label"><span className="lx2i-eyebrow">AS FEATURED IN</span></div>
            <div className="lx2i-press__track">
              {[...LX_PRESS, ...LX_PRESS].map((p, i) => (
                <img key={i} className="lx2i-press__logo" src={p.src} alt={p.name} loading="lazy" />
              ))}
            </div>
          </section>
        </div>

        {/* CONTACT — cinematic closing band (WhatsApp / schedule a callback) */}
        <section className="h26-contact" id="contact">
          <img
            className="h26-contact-bg"
            src={img('https://images.unsplash.com/photo-1534445867742-43195f401b6c', 1600)}
            alt="" aria-hidden="true" loading="lazy"
          />
          <div className="h26-contact-scrim" aria-hidden="true" />
          <div className="h26-contact-grain" aria-hidden="true" />
          <div className="h26-contact-inner">
            <Reveal className="h26-contact-eyebrow" as="p">
              <span className="h26-contact-rule" aria-hidden="true" /> Talk to us
            </Reveal>
            <h2 className="h26-contact-title">
              <WordReveal text="Let's plan" />
              <br />
              <WordReveal text="your next journey." accent={[2]} delay={0.18} />
            </h2>
            <Reveal as="p" className="h26-contact-sub" delay={0.2}>
              Speak to a specialist who's actually walked the route. Message us now, or
              pick a time and we'll call you — no scripts, no call centres, no obligation.
            </Reveal>
            <Reveal as="div" className="h26-contact-ctas" delay={0.3} y={0}>
              <button type="button" className="h26-btn h26-btn-accent h26-btn-lg" onClick={() => setCallbackOpen(true)}>
                <Phone size={17} /> Schedule a callback
              </button>
              <a href={CONTACT_IMP.whatsappHref} target="_blank" rel="noopener noreferrer" className="h26-btn h26-btn-lg h26-contact-wa">
                <WaIcon size={18} /> WhatsApp us
              </a>
            </Reveal>
            <Reveal as="p" className="h26-contact-alt" delay={0.38}>
              <Clock size={14} aria-hidden="true" /> Travel experts available 9am–9pm IST, every day
            </Reveal>
          </div>
        </section>

        {/* FOOTER (from /improved) */}
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
                <a href="#heritage">Why Cox &amp; Kings</a>
              </div>
              <div>
                <h4>Assurance</h4>
                <a href="#heritage">Trust &amp; safety</a>
                <a href="#reviews">Reviews</a>
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

      {/* Mobile thumb-reach bar — chat (primary) + schedule-a-callback */}
      <div className={`h26-thumbbar${activeReel !== null ? ' is-hidden' : ''}`}>
        <button type="button" className="h26-thumbbar-cta" onClick={() => setChatOpen(true)}>
          <MessageCircle size={18} /> Chat with an expert
        </button>
        <button type="button" className="h26-thumbbar-call" aria-label="Schedule a callback" onClick={() => setCallbackOpen(true)}>
          <Phone size={20} />
        </button>
      </div>

      {/* ENAYA — floating "Ask Enaya" button (from /luxe2-improved) */}
      <button className={`lx2i-aifab ${chatOpen ? 'is-hidden' : ''}`} aria-label="Open Enaya, the AI travel assistant" onClick={() => setChatOpen(true)}>
        <Sparkles size={20} />
        <span>Ask Enaya</span>
      </button>

      {/* Bespoke "Design it around you" guided flow */}
      <AnimatePresence>
        {bespokeOpen && <BespokeFlow onClose={() => setBespokeOpen(false)} />}
      </AnimatePresence>

      {/* Schedule-a-callback popup (mobile call icon) */}
      <AnimatePresence>
        {callbackOpen && <ScheduleCallback onClose={() => setCallbackOpen(false)} />}
      </AnimatePresence>

      {/* Reel / shorts player */}
      <AnimatePresence>
        {activeReel !== null && (
          <ReelPlayer reels={REELS} index={activeReel} setIndex={setActiveReel} onClose={() => setActiveReel(null)} />
        )}
      </AnimatePresence>

      {/* Journey photo lightbox */}
      <AnimatePresence>
        {lightbox && <Lightbox data={lightbox} onClose={() => setLightbox(null)} />}
      </AnimatePresence>
    </div>

    {/* ENAYA — the working AI concierge (from /luxe2-improved). Rendered
        OUTSIDE the page wrapper so scoped colour/font styles can't bleed in. */}
    <ChatBot open={chatOpen} onOpenChange={setChatOpen} hideFab name="Enaya" />
    </>
  );
}
