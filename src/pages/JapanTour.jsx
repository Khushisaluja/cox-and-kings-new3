/* ============================================================
   JapanTour — product / tour-detail page for the escorted
   "Japan, as the cherry blossoms fall" journey.

   Opens when a traveller taps the Japan package card on the
   improved homepage (/improved). Content & section order adapted
   from the Cox & Kings Figma tour-detail page; visual language
   inherited from Home2026 / Home2026Improved (Voyager-Blue + warm
   paper, Zodiak serif headings, h26 tokens & components).

   Self-contained: brings its own header + footer, matching the
   improved homepage. Fully responsive (mobile-first → desktop).
   ============================================================ */
import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Phone, MessageCircle, ArrowRight, ArrowUpRight, ArrowLeft, Star,
  Calendar, MapPin, Users, Plane, Check, Plus, Minus, ShieldCheck,
  Lock, ChevronRight, Sparkles, Quote, ChevronDown, ChevronLeft, Menu, X,
  Send, Instagram, Facebook, Youtube, Linkedin,
} from 'lucide-react';
import { img } from '../data/v3content';
import './Home2026.css';
import './Home2026Improved.css';
import './JapanTour.css';

/* /improved contact override — same direct line the improved homepage uses. */
const CONTACT = {
  phoneDisplay: '+91 8556001700',
  phoneHref: 'tel:+918556001700',
  whatsappHref: 'https://wa.me/918556001700',
  email: 'holidays@coxandkings.com',
};

/* Mega-menu, mirroring the /improved header structure but with links that
   resolve from a sub-page (routes, not on-page anchors). */
const JT_NAV = [
  {
    label: 'Ways to travel', to: '/journeys',
    blurb: 'Two ways to see the world — pick the one that fits you.',
    items: [
      { label: 'Escorted group tours', desc: 'Expert-led, fixed departures', to: '/journeys' },
      { label: 'Tailor-made journeys', desc: 'Designed entirely around you', to: '/contact' },
      { label: 'Luxury & private travel', desc: 'Elevated stays and guiding', to: '/journeys' },
      { label: 'Help me decide', desc: 'Talk it through with a specialist', to: '/contact' },
    ],
  },
  {
    label: 'Destinations', to: '/journeys',
    blurb: 'Over 100 countries, shaped by specialists who know them first-hand.',
    items: [
      { label: 'Japan', desc: 'Cherry blossom to neon', to: '/journeys?where=Japan' },
      { label: 'Switzerland', desc: 'Alpine railways & lakes', to: '/journeys?where=Switzerland' },
      { label: 'Italy', desc: 'Cities, coast & countryside', to: '/journeys?where=Italy' },
      { label: 'Northern Lights', desc: 'Arctic winter skies', to: '/journeys?where=Northern%20Lights' },
      { label: 'African Safari', desc: 'Big-five wilderness', to: '/journeys?where=African%20Safari' },
      { label: 'All destinations', desc: 'Browse the full map', to: '/journeys' },
    ],
  },
  {
    label: 'Journeys', to: '/journeys',
    blurb: 'Signature itineraries, ready to make your own.',
    items: [
      { label: 'Cherry Blossom Japan', desc: '10 days · Mar–Apr', to: '/tours/japan' },
      { label: 'Classic Switzerland', desc: 'Scenic rail & summits', to: '/journeys?where=Switzerland' },
      { label: 'Northern Lights & Ice', desc: 'Arctic Scandinavia', to: '/journeys' },
      { label: 'Ready when you are', desc: 'Hand-picked departures', to: '/journeys' },
    ],
  },
  {
    label: 'Why us', to: '/about',
    blurb: 'Specialists, not salespeople — and 260 years behind every trip.',
    items: [
      { label: 'Our specialists', desc: 'The people who plan your trip', to: '/about' },
      { label: 'Since 1758', desc: 'Heritage you can lean on', to: '/about' },
      { label: 'Real reviews', desc: '2,400+ verified travellers', to: '#reviews' },
      { label: 'Contact us', desc: 'We reply within a day', to: '/contact' },
    ],
  },
];

const HERO = {
  eyebrow: 'Group tour · expert-guided throughout',
  title: 'Japan, as the cherry blossoms fall.',
  lead:
    'Ten unhurried days from Tokyo’s neon to Kyoto’s temple gardens, timed to the fleeting bloom — in a small group, led by an expert guide. You simply turn up; we’ve thought of all the rest. 🇯🇵',
  image: 'https://images.unsplash.com/photo-1522383225653-ed111181a951',
  facts: [
    { icon: Calendar, label: '10 Days, 9 Nights' },
    { icon: MapPin, label: '4 Cities' },
    { icon: Users, label: 'Small group' },
    { icon: Plane, label: 'Flights included' },
  ],
};

const HIGHLIGHT_IMG = 'https://images.unsplash.com/photo-1528360983277-13d401cdc186';
const HIGHLIGHTS = [
  'A private tea ceremony in a Kyoto machiya',
  'A night in a traditional onsen ryokan',
  'Bullet train to Hakone with Mt. Fuji views',
  'Early-access temple visits, before the crowds',
  'Nara’s bowing deer and the great bronze Buddha',
  'Tsukiji and Nishiki market food walks',
];

const ROUTE = [
  { nights: '3 nights', city: 'Tokyo', note: 'Old and new — Senso-ji, Meiji shrine, the city’s energy', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf' },
  { nights: '1 night', city: 'Hakone', note: 'Onsen ryokan, a kaiseki dinner, and Mt. Fuji views', image: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65' },
  { nights: '4 nights', city: 'Kyoto', note: 'Temples, Gion, Arashiyama and a Nara day trip', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e' },
  { nights: '1 night', city: 'Osaka', note: 'Dotonbori neon and last bowls of ramen before home', image: 'https://images.unsplash.com/photo-1590559899731-a382839e5549' },
];

/* "People also view" — kept region-aware (East & Southeast Asia, same
   small-group / escorted trip type), so the recommendations feel Japan-adjacent
   rather than random. */
const SIMILAR = [
  {
    title: 'Essential South Korea', region: 'South Korea', season: 'Apr–Oct', nights: '8 nights', priceFrom: '₹2,25,000', to: '/tours',
    images: [
      'https://images.unsplash.com/photo-1538485399081-7191377e8241',
      'https://images.unsplash.com/photo-1517154421773-0529f29ea451',
      'https://images.unsplash.com/photo-1548115184-bc6544d06a58',
    ],
  },
  {
    title: 'Vietnam, North to South', region: 'Vietnam', season: 'Oct–Apr', nights: '11 nights', priceFrom: '₹1,95,000', to: '/tours',
    images: [
      'https://images.unsplash.com/photo-1528127269322-539801943592',
      'https://images.unsplash.com/photo-1555921015-5532091f6026',
      'https://images.unsplash.com/photo-1583417319070-4a69db38a482',
    ],
  },
  {
    title: 'Bali & the Islands', region: 'Indonesia', season: 'Apr–Oct', nights: '7 nights', priceFrom: '₹1,45,000', to: '/tours',
    images: [
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2',
      'https://images.unsplash.com/photo-1604999333679-b86d54738315',
    ],
  },
  {
    title: 'Sri Lanka: Tea & Temples', region: 'Sri Lanka', season: 'Nov–Apr', nights: '9 nights', priceFrom: '₹1,35,000', to: '/tours',
    images: [
      'https://images.unsplash.com/photo-1546708973-b339c6b6c4b9',
      'https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9',
      'https://images.unsplash.com/photo-1590123047484-4c2f0c6b9e30',
    ],
  },
];

/* Destination specialist — named, credentialed, with a SPECIFIC, personal,
   place-anchored recommendation (per the product-research audit: every
   specialist quote must contain a real place + a personal opinion, not filler).
   Arjun Rao is the same Japan specialist featured on /improved, kept consistent. */
const SPECIALIST = {
  name: 'Arjun Rao',
  title: 'Japan & East Asia specialist',
  years: '12 years',
  photo: 'https://images.unsplash.com/photo-1618306842557-a2515acf2112',
  cred: 'Has travelled Japan 30+ times and lived a year in Kyoto.',
  quote:
    'Take the first slot at Fushimi Inari — 7am, before the coaches arrive — and walk the vermillion gates almost alone, with the morning light coming through. It’s the one thing every group tells me they’ll never forget. I still do that walk every single trip.',
};

const FAQS = [
  {
    q: 'Are flights from India included?',
    a: 'International airfare isn’t in the ₹2,59,000 pp tour price — you add it at checkout, priced live from your city (Delhi, Mumbai, Bengaluru, Hyderabad and more), so you only ever pay the real fare. Everything inside Japan — bullet trains, transfers and domestic travel — is fully included.',
  },
  {
    q: 'Will there be vegetarian and Jain food?',
    a: 'Yes. We flag your dietary needs to every hotel, ryokan and restaurant in advance — vegetarian, Jain and no-onion-garlic meals are all arranged, and your guide carries a Japanese dietary card for street-side stops. Indian food is available on request in Tokyo, Kyoto and Osaka.',
  },
  {
    q: 'Do I need a visa, and will you help?',
    a: 'Indian passport holders need a Japan tourist visa. It’s fully included: we prepare your application, itinerary and hotel confirmations, and hand-hold the submission. Our visa-delay protection means your deposit is safe if a visa is held up beyond our control.',
  },
  {
    q: 'How big is the group, and who travels?',
    a: 'A small group — typically 12 to 18 like-minded Indian travellers — led by one expert guide throughout. It suits couples, solo travellers and families alike; the pace is unhurried, with free time built into most days.',
  },
  {
    q: 'How fit do I need to be?',
    a: 'Comfortable, not strenuous. Expect 6,000–9,000 steps on temple and city days, with plenty of sitting on trains and at meals. Do tell us about mobility needs when you book and we’ll adapt transfers and pacing for you.',
  },
  {
    q: 'What if I want to change or cancel?',
    a: 'Your 20% deposit confirms your seats, and you get free cancellation for 7 days after booking. Full booking terms and the cancellation schedule are shared before you pay — no surprises, and a curator will walk you through them if you prefer.',
  },
];

const ITINERARY = [
  { day: 'Day 01', title: 'Arrive Tokyo', body: 'Met at Narita by your guide and transferred to your hotel. An evening welcome dinner in Asakusa with the group.' },
  { day: 'Day 02', title: 'Tokyo, old & new', body: 'Senso-ji temple and the lanes of Asakusa in the morning, the Meiji shrine and Harajuku in the afternoon, and Shibuya after dark.' },
  { day: 'Day 03', title: 'Hakone & Mt. Fuji', body: 'Bullet train to Hakone. A lake cruise and ropeway with Mt. Fuji views, then a night in an onsen ryokan with a kaiseki dinner.' },
  { day: 'Day 04', title: 'Into Kyoto', body: 'Travel on to Kyoto by rail. A first evening walk through the lantern-lit lanes of Gion, Japan’s geisha district.' },
  { day: 'Day 05', title: 'Kyoto’s temples', body: 'Early-access to Fushimi Inari before the crowds, the golden Kinkaku-ji, and a private tea ceremony in a machiya townhouse.' },
  { day: 'Day 06', title: 'Nara day trip', body: 'A day in Nara — the great bronze Buddha of Todai-ji and the free-roaming, bowing deer of Nara Park.' },
  { day: 'Day 07', title: 'Kyoto at leisure', body: 'A free day. Wander the Arashiyama bamboo grove, shop Nishiki market, or simply rest — your guide has suggestions for every pace.' },
  { day: 'Day 08', title: 'Kyoto → Osaka', body: 'A short hop to Osaka. An evening food walk through the neon of Dotonbori — takoyaki, okonomiyaki and street-side ramen.' },
  { day: 'Day 09', title: 'Osaka', body: 'Osaka Castle and the city at your own pace, with a final group dinner to toast the journey.' },
  { day: 'Day 10', title: 'Depart for home', body: 'Transferred to Kansai airport for your flight home, with a little more Japan in you than when you arrived.' },
];

const INCLUDED = [
  'Expert guide throughout',
  'Visa & assistance',
  'Travel insurance',
  'Bullet-train travel',
  'All entrances & experiences',
  'All meals & transfers',
];

const NOT_INCLUDED = [
  'International airfare (add it at checkout, priced from your city)',
  'Personal expenses & shopping',
  'Optional experiences beyond the itinerary',
  'Gratuities for your guide and drivers',
];

const PRICE = 259000;
const DEPARTURES = [
  { date: '28 March 2026', seats: 'Only 6 seats left', tight: true },
  { date: '04 April 2026', seats: 'Only 6 seats left', tight: true },
  { date: '11 April 2026', seats: '12 seats available', tight: false },
  { date: '18 April 2026', seats: 'Only 2 seats left', tight: true },
];

const REVIEW = {
  quote:
    'Every transfer, every meal, flawless. They thought of things we didn’t know to ask. The blossom timing was perfect, the ryokan unforgettable, and the small group felt like friends by the end. We simply turned up and were cared for.',
  name: 'Aditi & Mohit',
  meta: 'Japan, group · 2025',
  photos: [
    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e',
    'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d',
    'https://images.unsplash.com/photo-1528360983277-13d401cdc186',
  ],
};

const inr = (n) => `₹${n.toLocaleString('en-IN')}`;

const SUBNAV = [
  { id: 'highlights', label: 'Highlights' },
  { id: 'route', label: 'Route' },
  { id: 'itinerary', label: 'Day by day' },
  { id: 'included', label: 'What’s included' },
  { id: 'dates', label: 'Dates & prices' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'faq', label: 'FAQs' },
];

function Reveal({ children, className = '', delay = 0, y = 22, as = 'div' }) {
  const M = motion[as] || motion.div;
  const reduce = useReducedMotion();
  if (reduce) return <M className={className}>{children}</M>;
  return (
    <M
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(12px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </M>
  );
}

/* "People also view" card with an inline photo carousel — browse a journey's
   other photos with the ‹ › controls, without leaving the page. */
function SimCard({ s }) {
  const [idx, setIdx] = useState(0);
  const n = s.images.length;
  const go = (e, dir) => {
    e.preventDefault();
    e.stopPropagation();
    setIdx((i) => (i + dir + n) % n);
  };
  return (
    <div className="jt-sim">
      <div className="jt-sim-media">
        {s.images.map((src, i) => (
          <img
            key={src}
            src={img(src, 700)}
            alt={`${s.title} — photo ${i + 1} of ${n}`}
            loading="lazy"
            className={i === idx ? 'is-active' : ''}
            aria-hidden={i !== idx}
          />
        ))}
        <span className="jt-sim-region"><MapPin size={12} /> {s.region}</span>
        <span className="jt-sim-season">{s.season}</span>
        <button type="button" className="jt-sim-arrow jt-sim-arrow--prev" onClick={(e) => go(e, -1)} aria-label={`Previous photo of ${s.title}`}>
          <ChevronLeft size={18} />
        </button>
        <button type="button" className="jt-sim-arrow jt-sim-arrow--next" onClick={(e) => go(e, 1)} aria-label={`Next photo of ${s.title}`}>
          <ChevronRight size={18} />
        </button>
        <span className="jt-sim-dots" aria-hidden="true">
          {s.images.map((_, i) => (
            <span key={i} className={`jt-sim-dot-i${i === idx ? ' is-on' : ''}`} />
          ))}
        </span>
      </div>
      <div className="jt-sim-body">
        <h3>{s.title}</h3>
        <div className="jt-sim-meta">
          <span>{s.nights}</span>
          <span className="jt-sim-dot" aria-hidden="true">·</span>
          <span className="jt-sim-cap"><Users size={12} /> Small group</span>
        </div>
        <div className="jt-sim-foot">
          <span className="jt-sim-price">from {s.priceFrom} <small>pp</small></span>
          <Link to={s.to} className="jt-sim-go">View journey <ArrowRight size={15} /></Link>
        </div>
      </div>
    </div>
  );
}

export default function JapanTour() {
  const [openDay, setOpenDay] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [selectedDep, setSelectedDep] = useState(0);
  const [payMode, setPayMode] = useState('deposit');
  const [activeSection, setActiveSection] = useState('highlights');
  const [subStuck, setSubStuck] = useState(false);
  const subSentinel = useRef(null);

  const deposit = Math.round(PRICE * 0.2);

  // Track which section is in view for the sub-nav.
  useEffect(() => {
    const ids = SUBNAV.map((s) => s.id);
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (vis[0]) setActiveSection(vis[0].target.id);
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.2, 0.5, 1] }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Toggle a "stuck" shadow on the sub-nav once it pins.
  useEffect(() => {
    const el = subSentinel.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => setSubStuck(!e.isIntersecting),
      { threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="h26 jt">
      <a className="h26-skip" href="#jt-main">Skip to content</a>

      {/* ---------------- Header — same mega-menu as /improved ---------------- */}
      <header className="h26-nav is-solid jt-nav">
        <Link to="/improved" className="h26-brand">
          <img src="/cox-logo-new.png" alt="Cox & Kings" />
        </Link>
        <nav className="h26-links hi-nav" aria-label="Primary">
          {JT_NAV.map((group) => (
            <div className="hi-nav-group" key={group.label}>
              <Link to={group.to} className="hi-nav-top" aria-haspopup="true">
                {group.label}
                <ChevronDown size={14} className="hi-nav-caret" aria-hidden="true" />
              </Link>
              <div className="hi-nav-flyout" role="menu">
                <div className="hi-nav-flyout-inner">
                  <p className="hi-nav-blurb">{group.blurb}</p>
                  <ul className="hi-nav-list">
                    {group.items.map((it) => (
                      <li key={it.label}>
                        {it.to.startsWith('#') ? (
                          <a href={it.to} role="menuitem" className="hi-nav-item">
                            <span className="hi-nav-item-label">{it.label}</span>
                            <span className="hi-nav-item-desc">{it.desc}</span>
                          </a>
                        ) : (
                          <Link to={it.to} role="menuitem" className="hi-nav-item">
                            <span className="hi-nav-item-label">{it.label}</span>
                            <span className="hi-nav-item-desc">{it.desc}</span>
                          </Link>
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
          <a href={CONTACT.phoneHref} className="h26-phone">
            <Phone size={15} /> <span>{CONTACT.phoneDisplay}</span>
          </a>
          <button className="h26-burger" aria-label="Menu" onClick={() => setMenuOpen(true)}>
            <Menu size={22} />
          </button>
        </div>
      </header>

      {/* Mobile slide-in menu — matches /improved */}
      <div className={`h26-menu${menuOpen ? ' is-open' : ''}`} aria-hidden={!menuOpen}>
        <div className="h26-menu-scrim" onClick={() => setMenuOpen(false)} />
        <div className="h26-menu-panel" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="h26-menu-top">
            <button className="h26-menu-close" aria-label="Close menu" onClick={() => setMenuOpen(false)}><X size={20} /></button>
            <img className="h26-menu-logo" src="/cox-logo-new.png" alt="Cox & Kings — Est. 1758" />
          </div>
          <nav className="h26-menu-primary" aria-label="Mobile primary">
            {[
              { label: 'Highlights', href: '#highlights' },
              { label: 'Day by day', href: '#itinerary' },
              { label: 'Your specialist', href: '#specialist' },
              { label: 'Dates & prices', href: '#dates' },
              { label: 'FAQs', href: '#faq' },
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
            <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact <ArrowUpRight size={13} /></Link>
          </div>
          <a href="#dates" className="h26-btn h26-btn-pill h26-menu-cta" onClick={() => setMenuOpen(false)}>
            <Calendar size={16} /> Reserve your dates
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

      <main id="jt-main">
        {/* ---------------- Breadcrumb ---------------- */}
        <div className="jt-crumb">
          <Link to="/improved"><ArrowLeft size={15} /> Back to journeys</Link>
          <span className="jt-crumb-trail">
            <Link to="/improved">Home</Link><ChevronRight size={13} />
            <Link to="/journeys?where=Japan">Japan</Link><ChevronRight size={13} />
            <span>Cherry Blossom Group Tour</span>
          </span>
        </div>

        {/* ---------------- Hero ---------------- */}
        <header className="jt-hero">
          <img className="jt-hero-img" src={img(HERO.image, 1900)} alt="Cherry blossoms and a pagoda in Japan" />
          <div className="jt-hero-veil" />
          <div className="jt-hero-inner">
            <Reveal className="jt-hero-content">
              <p className="h26-eyebrow jt-hero-eyebrow">{HERO.eyebrow}</p>
              <h1 className="h26-display jt-hero-title">
                Japan, as the <em className="wr-accent">cherry blossoms</em> fall.
              </h1>
              <p className="jt-hero-lead">{HERO.lead}</p>
              <div className="jt-hero-facts">
                {HERO.facts.map((f) => {
                  const Ic = f.icon;
                  return (
                    <span key={f.label} className="jt-fact"><Ic size={17} /> {f.label}</span>
                  );
                })}
              </div>
              <div className="jt-hero-actions">
                <a href="#dates" className="h26-btn h26-btn-accent h26-btn-lg">See dates & prices <ArrowRight size={16} /></a>
                <a href="#itinerary" className="h26-btn h26-btn-glass h26-btn-lg">View the itinerary</a>
              </div>
            </Reveal>
          </div>
        </header>

        {/* ---------------- Sticky sub-nav ---------------- */}
        <div ref={subSentinel} aria-hidden="true" />
        <nav className={`jt-subnav${subStuck ? ' is-stuck' : ''}`} aria-label="Sections of this tour">
          <div className="jt-subnav-inner">
            <ul>
              {SUBNAV.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className={activeSection === s.id ? 'is-active' : ''}>{s.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* ---------------- Highlights ---------------- */}
        <section className="h26-section jt-section" id="highlights">
          <div className="h26-head">
            <Reveal className="h26-label" as="p">The journey, curated for you</Reveal>
            <Reveal as="h2" className="h26-h2" delay={0.05}>Tour highlights</Reveal>
            <Reveal as="p" className="jt-lead" delay={0.1}>
              Every detail privately arranged, so you need only turn up and be there for it.
            </Reveal>
          </div>
          <div className="jt-highlights-grid">
            <Reveal className="jt-highlights-media" y={16}>
              <img src={img(HIGHLIGHT_IMG, 900)} alt="A quiet pagoda among Kyoto’s temple gardens" loading="lazy" />
              <span className="jt-highlights-cap">Kyoto, at first light</span>
            </Reveal>
            <ul className="jt-highlights">
              {HIGHLIGHTS.map((h, i) => (
                <Reveal key={h} as="li" className="jt-highlight" delay={(i % 3) * 0.06} y={16}>
                  <span className="jt-highlight-mark">✦</span>
                  <p>{h}</p>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------------- Route ---------------- */}
        <section className="jt-route-sec" id="route">
          <div className="jt-route-wrap">
            <div className="h26-head jt-head-center">
              <Reveal className="h26-label" as="p">9 nights, in a small group</Reveal>
              <Reveal as="h2" className="h26-h2" delay={0.05}>Your route</Reveal>
              <Reveal as="p" className="jt-lead" delay={0.1}>
                Tokyo to Osaka: four stops, one seamless journey by rail.
              </Reveal>
            </div>
            <ol className="jt-route">
              {ROUTE.map((r, i) => (
                <Reveal key={r.city} as="li" className="jt-stop" delay={i * 0.06} y={14}>
                  <div className="jt-stop-node">
                    <span className="jt-stop-num">{i + 1}</span>
                    {i < ROUTE.length - 1 && <span className="jt-stop-line" aria-hidden="true" />}
                  </div>
                  <div className="jt-stop-card">
                    <div className="jt-stop-body">
                      <span className="jt-stop-nights">{r.nights}</span>
                      <h3>{r.city}</h3>
                      <p>{r.note}</p>
                    </div>
                    <div className="jt-stop-media">
                      <img src={img(r.image, 420)} alt={`${r.city}, Japan`} loading="lazy" />
                    </div>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------------- Day by day ---------------- */}
        <section className="h26-section jt-section" id="itinerary">
          <div className="h26-head jt-head-center">
            <Reveal className="h26-label" as="p">The full picture</Reveal>
            <Reveal as="h2" className="h26-h2" delay={0.05}>Day by day</Reveal>
          </div>
          <Reveal className="jt-itinerary">
            {ITINERARY.map((d, i) => {
              const open = openDay === i;
              return (
                <div key={d.day} className={`jt-day${open ? ' is-open' : ''}`}>
                  <button
                    type="button"
                    className="jt-day-head"
                    aria-expanded={open}
                    onClick={() => setOpenDay(open ? -1 : i)}
                  >
                    <span className="jt-day-label">{d.day}</span>
                    <span className="jt-day-title">{d.title}</span>
                    <span className="jt-day-icon" aria-hidden="true">{open ? <Minus size={18} /> : <Plus size={18} />}</span>
                  </button>
                  <div className="jt-day-panel" hidden={!open}>
                    <p>{d.body}</p>
                  </div>
                </div>
              );
            })}
          </Reveal>
        </section>

        {/* ---------------- Destination specialist ---------------- */}
        <section className="jt-spec-sec" id="specialist">
          <div className="jt-spec-wrap">
            <Reveal className="jt-spec-media" y={16}>
              <img src={img(SPECIALIST.photo, 640)} alt={SPECIALIST.name} loading="lazy" />
              <span className="jt-spec-badge"><Sparkles size={13} /> Your Japan specialist</span>
            </Reveal>
            <Reveal className="jt-spec-body" delay={0.08}>
              <p className="h26-label">Designed by the person who knows it</p>
              <span className="jt-spec-quote-mark" aria-hidden="true"><Quote size={30} /></span>
              <blockquote className="jt-spec-quote">{SPECIALIST.quote}</blockquote>
              <div className="jt-spec-who">
                <div>
                  <strong>{SPECIALIST.name}</strong>
                  <span>{SPECIALIST.title} · {SPECIALIST.years}</span>
                </div>
              </div>
              <p className="jt-spec-cred"><MapPin size={15} /> {SPECIALIST.cred}</p>
              <div className="jt-spec-actions">
                <a href={CONTACT.phoneHref} className="h26-btn h26-btn-pill">
                  <Phone size={16} /> Ask {SPECIALIST.name.split(' ')[0]} a question
                </a>
                <a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer" className="jt-spec-wa">
                  <MessageCircle size={15} /> WhatsApp {SPECIALIST.name.split(' ')[0]}
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ---------------- Included / Not included ---------------- */}
        <section className="jt-incl-sec" id="included">
          <div className="jt-incl-wrap">
            <Reveal className="jt-incl-col">
              <p className="h26-label">Included, privately</p>
              <h3 className="jt-incl-h">Everything taken care of</h3>
              <ul className="jt-incl-list">
                {INCLUDED.map((x) => (
                  <li key={x}><span className="jt-incl-tick"><Check size={14} /></span>{x}</li>
                ))}
              </ul>
            </Reveal>
            <Reveal className="jt-incl-col jt-incl-col--muted" delay={0.08}>
              <p className="h26-label">Good to know</p>
              <h3 className="jt-incl-h">What’s not included</h3>
              <ul className="jt-incl-list jt-incl-list--exc">
                {NOT_INCLUDED.map((x) => (
                  <li key={x}><span className="jt-incl-dash" aria-hidden="true">–</span>{x}</li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        {/* ---------------- Dates & prices / Book ---------------- */}
        <section className="h26-section jt-book-sec" id="dates">
          <div className="jt-book-grid">
            <div className="jt-book-intro">
              <Reveal className="h26-label" as="p">Reserve your dates</Reveal>
              <Reveal as="h2" className="h26-h2" delay={0.05}>Reserve your seats</Reveal>
              <Reveal as="p" className="jt-lead" delay={0.1}>
                Pick one of our set 2026 departures and confirm your seats with a 20% deposit — the balance comes later.
              </Reveal>
              <Reveal className="jt-book-perks" delay={0.15}>
                <li><Check size={16} /> Expert-guided from the moment you land to the day you fly home</li>
                <li><Check size={16} /> All-inclusive: visa, insurance, stays, meals and transfers</li>
                <li><Check size={16} /> A small group of like-minded travellers</li>
              </Reveal>
              <Reveal className="jt-confidence" delay={0.2}>
                <ShieldCheck size={22} />
                <div>
                  <strong>Book with confidence</strong>
                  <p>Encrypted checkout. Your 20% deposit is protected, and you can talk to a curator first — free.</p>
                </div>
              </Reveal>
            </div>

            <Reveal className="jt-book-card" delay={0.1}>
              <p className="jt-book-card-label">Choose your departure date</p>
              <div className="jt-deps" role="radiogroup" aria-label="Departure dates">
                {DEPARTURES.map((d, i) => {
                  const sel = selectedDep === i;
                  return (
                    <button
                      key={d.date}
                      type="button"
                      role="radio"
                      aria-checked={sel}
                      className={`jt-dep${sel ? ' is-selected' : ''}`}
                      onClick={() => setSelectedDep(i)}
                    >
                      <span className="jt-dep-left">
                        <span className="jt-dep-date">{d.date}</span>
                        <span className={`jt-dep-seats${d.tight ? ' is-tight' : ''}`}>{d.seats}</span>
                      </span>
                      <span className="jt-dep-price">{inr(PRICE)}</span>
                    </button>
                  );
                })}
              </div>

              <div className="jt-pay" role="radiogroup" aria-label="Payment option">
                <button
                  type="button"
                  role="radio"
                  aria-checked={payMode === 'deposit'}
                  className={`jt-pay-opt${payMode === 'deposit' ? ' is-on' : ''}`}
                  onClick={() => setPayMode('deposit')}
                >
                  <span className="jt-pay-title">Pay a deposit</span>
                  <span className="jt-pay-amt">{inr(deposit)}</span>
                  <span className="jt-pay-note">20% to confirm</span>
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={payMode === 'full'}
                  className={`jt-pay-opt${payMode === 'full' ? ' is-on' : ''}`}
                  onClick={() => setPayMode('full')}
                >
                  <span className="jt-pay-title">Pay in full</span>
                  <span className="jt-pay-amt">{inr(PRICE)}</span>
                  <span className="jt-pay-note">Settle today</span>
                </button>
              </div>

              <button type="button" className="h26-btn h26-btn-accent jt-pay-go">
                {payMode === 'deposit' ? `Pay ${inr(deposit)} & secure seat` : `Pay ${inr(PRICE)} & secure seat`}
              </button>
              <p className="jt-pay-secure"><Lock size={13} /> Secure encrypted checkout · deposit protected</p>
              <a href={CONTACT.phoneHref} className="jt-pay-talk">Prefer to talk first? Call a curator, free <ArrowRight size={14} /></a>
            </Reveal>
          </div>
        </section>

        {/* ---------------- Reviews ---------------- */}
        <section className="jt-review-sec" id="reviews">
          <div className="jt-review-wrap">
            <div className="h26-head jt-head-center">
              <Reveal className="h26-label" as="p">What travellers say</Reveal>
              <Reveal as="h2" className="h26-h2 h26-h2-light" delay={0.05}>Real journeys, captured by our travellers</Reveal>
              <Reveal as="p" className="jt-lead jt-lead-light" delay={0.1}>
                The moments that made the trip — straight from the two who lived it.
              </Reveal>
            </div>
            <div className="jt-review">
              <Reveal className="jt-review-photos">
                <img className="jt-review-photo jt-review-photo--lead" src={img(REVIEW.photos[0], 800)} alt="Travellers’ photo from Japan" />
                <img className="jt-review-photo" src={img(REVIEW.photos[1], 500)} alt="Travellers’ photo from Japan" />
                <img className="jt-review-photo" src={img(REVIEW.photos[2], 500)} alt="Travellers’ photo from Japan" />
              </Reveal>
              <Reveal className="jt-review-body" delay={0.08}>
                <div className="jt-review-stars" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={17} fill="currentColor" />)}
                </div>
                <blockquote>{REVIEW.quote}</blockquote>
                <div className="jt-review-who">
                  <strong>{REVIEW.name}</strong>
                  <span>{REVIEW.meta}</span>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ---------------- FAQs ---------------- */}
        <section className="h26-section jt-section jt-faq-sec" id="faq">
          <div className="h26-head jt-head-center">
            <Reveal className="h26-label" as="p">Good to know, before you ask</Reveal>
            <Reveal as="h2" className="h26-h2" delay={0.05}>Questions, answered</Reveal>
            <Reveal as="p" className="jt-lead" delay={0.1}>
              The things Indian travellers ask us most about Japan. Can’t see yours? A curator will answer in person.
            </Reveal>
          </div>
          <Reveal className="jt-faq">
            {FAQS.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={f.q} className={`jt-faq-item${open ? ' is-open' : ''}`}>
                  <button
                    type="button"
                    className="jt-faq-q"
                    aria-expanded={open}
                    onClick={() => setOpenFaq(open ? -1 : i)}
                  >
                    <span>{f.q}</span>
                    <span className="jt-faq-icon" aria-hidden="true">{open ? <Minus size={18} /> : <Plus size={18} />}</span>
                  </button>
                  <div className="jt-faq-a" hidden={!open}>
                    <p>{f.a}</p>
                  </div>
                </div>
              );
            })}
          </Reveal>
          <Reveal className="jt-faq-foot" delay={0.1}>
            <span>Still have a question?</span>
            <a href={CONTACT.phoneHref} className="h26-textlink">Talk to a curator, free <ArrowRight size={15} /></a>
          </Reveal>
        </section>

        {/* ---------------- People also view ---------------- */}
        <section className="h26-section jt-section jt-similar-sec">
          <div className="h26-head h26-head-row">
            <div>
              <Reveal className="h26-label" as="p">Travellers also considered</Reveal>
              <Reveal as="h2" className="h26-h2" delay={0.05}>People also view</Reveal>
            </div>
            <Reveal as="div" delay={0.1}>
              <Link to="/journeys" className="h26-textlink">Browse all journeys <ArrowUpRight size={16} /></Link>
            </Reveal>
          </div>
          <div className="jt-similar">
            {SIMILAR.map((s, i) => (
              <Reveal key={s.title} delay={(i % 4) * 0.06} y={0}>
                <SimCard s={s} />
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---------------- Final CTA — consistent with the homepage (h26-cta2) ---------------- */}
        <section className="h26-cta2" id="plan">
          <div className="h26-cta2-bg" style={{ backgroundImage: `url(${img('https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e', 1800)})` }} />
          <div className="h26-cta2-veil" />
          <div className="h26-cta2-inner">
            <Reveal className="h26-cta2-eyebrow" as="span">Begin your Japan journey</Reveal>
            <Reveal as="h2" className="h26-cta2-title" delay={0.05}>
              Ten days in Japan,<br /><strong>every detail already handled.</strong>
            </Reveal>
            <Reveal as="p" className="h26-cta2-sub" delay={0.1}>
              Set 2026 departures, a small group and an expert guide — and a curator who handles
              the visas, the ryokan, the rail and the reservations, so you can simply be there.
            </Reveal>
            <Reveal className="h26-cta2-actions" delay={0.15}>
              <a href="#dates" className="h26-btn h26-btn-accent h26-btn-lg"><Calendar size={17} /> Reserve your dates</a>
              <a href={CONTACT.phoneHref} className="h26-btn h26-btn-glass h26-btn-lg"><Phone size={16} /> {CONTACT.phoneDisplay}</a>
              <a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer" className="h26-btn h26-btn-glass h26-btn-lg"><MessageCircle size={16} /> WhatsApp us</a>
            </Reveal>
            <Reveal as="p" className="h26-cta2-hours" delay={0.2}>Travel experts available 9am–9pm IST, every day</Reveal>
            <Reveal as="p" className="hi-plan-safe" delay={0.25}>
              <ShieldCheck size={15} /> 20% deposit · free cancellation for 7 days · visa delay protected · secure payments
            </Reveal>
          </div>
        </section>

        {/* ---------------- Footer — same as the homepage ---------------- */}
        <footer className="h26-footer">
          <div className="h26-footer-top">
            <div className="h26-footer-brand">
              <img src="/cox-logo-new.png" alt="Cox & Kings" />
              <p>The world’s most experienced travel company. Established 1758.</p>
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
                <a href="#reviews">Why Cox &amp; Kings</a>
              </div>
              <div>
                <h4>Assurance</h4>
                <a href="#included">Trust &amp; safety</a>
                <a href="#reviews">Awards</a>
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
      </main>

      {/* ---------------- Mobile bottom nav — Book now + Chat + Call ---------------- */}
      <nav className="jt-thumbbar" aria-label="Booking and contact">
        <a href="#dates" className="jt-thumbbar-book">
          <span className="jt-thumbbar-book-main">Book now</span>
          <span className="jt-thumbbar-book-sub">from {inr(PRICE)} pp</span>
        </a>
        <button type="button" className="jt-thumbbar-ico jt-thumbbar-ai" aria-label="Chat with Enaya, the AI travel assistant" onClick={() => setChatOpen(true)}>
          <Sparkles size={20} />
          <span>Chat</span>
        </button>
        <a href={CONTACT.phoneHref} className="jt-thumbbar-ico" aria-label="Call a specialist">
          <Phone size={20} />
          <span>Call</span>
        </a>
      </nav>

      {/* ---------------- Desktop Book now FAB — sits just above Ask Enaya ---------------- */}
      <a href="#dates" className={`jt-bookfab${chatOpen ? ' is-hidden' : ''}`}>
        <Calendar size={18} /> <span>Book now</span>
      </a>

      {/* ---------------- Ask Enaya AI button — matches /improved ---------------- */}
      <button type="button" className={`h26-aifab ${chatOpen ? 'is-hidden' : ''}`} aria-label="Open Enaya, the AI travel assistant" onClick={() => setChatOpen(true)}>
        <Sparkles size={20} />
        <span>Ask Enaya</span>
      </button>

      {/* ---------------- Chat launcher popover ---------------- */}
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
              <p className="h26-chat-bubble">Hi! 👋 Planning Japan? Ask about dates, the ryokan night, visas or vegetarian meals — or reach a specialist right now.</p>
              <div className="h26-chat-quick">
                <a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer"><MessageCircle size={15} /> Chat on WhatsApp</a>
                <a href={CONTACT.phoneHref}><Phone size={15} /> Call a specialist</a>
                <Link to="/contact"><Send size={15} /> Send an enquiry</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
