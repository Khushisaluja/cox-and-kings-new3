import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Menu, X, ArrowRight, ArrowLeft, ArrowUpRight, Star, MapPin, Compass,
  Calendar, Search, Phone, Sparkles, Send, ChevronDown, Quote,
  Instagram, Facebook, Youtube, Linkedin,
  Award, ShieldCheck, Globe2, Car, Hotel,
  Heart, Mountain, Waves, Landmark, Leaf, Gem,
  Play, Eye, Users, Bookmark, MessageCircle, Share2, Headset,
} from 'lucide-react';
import { GlyphHeart, GlyphMountain, GlyphRipple, GlyphMonument, GlyphDeer, GlyphDiamond } from './MoodIcons';
import './Luxe2.css';

/* ============================================================
   Cox & Kings — "Luxe 2" homepage (self-contained, route /luxe2)
   Blue-forward brand identity (Voyager Blue/500), heritage-first,
   sourced trust credentials, "Discover my mood" section, Enaya AI.
   Editorial-luxury + glassmorphism. Design tokens from design.md.
   Does not touch any existing page.
   ============================================================ */

const sizedUnsplash = (id, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const PHONE_DISPLAY = '+91 85560 01700';
const PHONE_TEL = 'tel:+918556001700';
const WHATSAPP = 'https://wa.me/918556001700?text=Hi%20Cox%20%26%20Kings%2C%20I%27d%20like%20to%20plan%20a%20trip.';

/* ---------- Nav ---------- */
const NAV = [
  { label: 'Heritage', href: '#heritage' },
  { label: 'Journeys', href: '#curated' },
  { label: 'Discover', href: '#destinations' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Moods', href: '#mood' },
];
const NAV_SECONDARY = [
  'Tailor-Made', 'Escorted Tours', 'Luxury Rail', 'Private Villas',
  'Honeymoons', 'Group Departures', 'Press Room', 'Contact',
];

/* ---------- Hero rotating stat chips ---------- */
const HERO_STATS = [
  'Est. 1758',
  '2,400+ Traveller Reviews',
  '100+ Destinations',
  'Private, Tailor-Made',
  '24/7 Concierge',
];

/* ---------- Curated stays (villas inspiration) ---------- */
const FILTERS = ['All', 'Private Villas', 'Heritage Hotels', 'Safari Lodges', 'Island Resorts', 'Luxury Rail'];
/* Each stay shows four highlights that are genuinely specific to it — not a shared boilerplate list */
const STAYS = [
  { name: 'Amankora, Bhutan', loc: 'Paro Valley, Himalayas', price: '₹2,40,000', nights: 7, rating: 4.9, cat: 'Private Villas', id: '1528127269322-539801943592',
    highlights: [
      { icon: Hotel, label: '5★ lodge suites' },
      { icon: Car, label: 'Private 4×4 transfers' },
      { icon: Mountain, label: 'Guided dzong treks' },
      { icon: Leaf, label: 'Daily spa & meals' },
    ] },
  { name: 'Aman Venice', loc: 'Grand Canal, Italy', price: '₹3,15,000', nights: 5, rating: 4.9, cat: 'Heritage Hotels', id: '1523906834658-6e24ef2386f9',
    highlights: [
      { icon: Hotel, label: '5★ palazzo rooms' },
      { icon: Waves, label: 'Private water taxi' },
      { icon: Landmark, label: 'After-hours St Mark’s' },
      { icon: Compass, label: 'Private city guide' },
    ] },
  { name: 'Singita Sabi Sand', loc: 'Kruger, South Africa', price: '₹4,10,000', nights: 6, rating: 5.0, cat: 'Safari Lodges', id: '1547471080-7cc2caa01a7e',
    highlights: [
      { icon: Hotel, label: '5★ bush lodge' },
      { icon: Car, label: 'Twice-daily game drives' },
      { icon: Compass, label: 'Private ranger & tracker' },
      { icon: Leaf, label: 'All meals & drinks' },
    ] },
  { name: 'Soneva Fushi', loc: 'Baa Atoll, Maldives', price: '₹2,85,000', nights: 5, rating: 4.9, cat: 'Island Resorts', id: '1573843981267-be1999ff37cd',
    highlights: [
      { icon: Hotel, label: '5★ overwater villa' },
      { icon: Waves, label: 'Seaplane transfers' },
      { icon: Heart, label: 'Personal beach butler' },
      { icon: Compass, label: 'Snorkel & dive trips' },
    ] },
];

/* ---------- Sourced, specific trust credentials (Heritage section) ---------- */
const TRUST_BADGES = [
  { icon: Star, stat: '4.8★', label: 'from 14,200 verified travellers' },
  { icon: Award, stat: 'Condé Nast 2024', label: 'Readers’ Choice Award, India' },
  { icon: ShieldCheck, stat: 'Since 1758', label: '267 years · financially protected' },
  { icon: Globe2, stat: '100+ countries', label: 'on all seven continents' },
];

/* ---------- Discover my mood ---------- */
const MOODS = [
  { key: 'Romance', icon: GlyphHeart, accent: '#BD4011',
    line: 'Slow mornings, private dinners, and nobody in the world but the two of you.',
    place: 'Santorini & the Amalfi Coast', meta: '7 nights · from ₹3,10,000', id: '1533105079780-92b9be482077' },
  { key: 'Adventure', icon: GlyphMountain, accent: '#0B5AB1',
    line: 'Summits before sunrise, white water by noon, stories you’ll tell for years.',
    place: 'Patagonia & the Himalayas', meta: '10 nights · from ₹2,95,000', id: '1454496522488-7a8e488e8606' },
  { key: 'Serenity', icon: GlyphRipple, accent: '#337D64',
    line: 'Overwater silence, a private sandbank, and the sound of absolutely nothing.',
    place: 'The Maldives & Seychelles', meta: '6 nights · from ₹2,85,000', id: '1573843981267-be1999ff37cd' },
  { key: 'Culture', icon: GlyphMonument, accent: '#09488E',
    line: 'Temples at dawn, lantern-lit markets at dusk, history you can reach out and touch.',
    place: 'Kyoto & Rajasthan', meta: '8 nights · from ₹2,60,000', id: '1493976040374-85c8e12f0c0e' },
  { key: 'Wildlife', icon: GlyphDeer, accent: '#71260A',
    line: 'Eye to eye with the wild at dawn — always from a respectful distance.',
    place: 'The Serengeti & Borneo', meta: '7 nights · from ₹4,10,000', id: '1516426122078-c23e76319801' },
  { key: 'Indulgence', icon: GlyphDiamond, accent: '#042447',
    line: 'Michelin tables, grand suites, a private guide, and not one single compromise.',
    place: 'Paris & Dubai', meta: '5 nights · from ₹3,80,000', id: '1502602898657-3e91760cbb34' },
];

/* ---------- Destinations carousel (arch feature) ---------- */
const DESTS = [
  { name: 'Santorini, Greece', tags: ['Dramatic cliffs', 'Modern luxury', 'The Aegean Sea'],
    blurb: 'White-washed villages tumbling into a flooded caldera, sunsets the colour of wine, and cave-suites carved into the cliff.',
    best: 'Apr – Oct', trips: '14 itineraries', from: '₹2,95,000', id: '1570077188670-e3a8d69ac5ff' },
  { name: 'Kyoto, Japan', tags: ['Cherry blossom', 'Ancient temples', 'Ryokan stays'],
    blurb: 'A thousand shrines, lantern-lit lanes in Gion, and ryokan dinners served by candlelight as the maples turn.',
    best: 'Mar – May · Nov', trips: '11 itineraries', from: '₹3,40,000', id: '1493976040374-85c8e12f0c0e' },
  { name: 'African Safari', tags: ['The Great Migration', 'Private reserves', 'Star beds'],
    blurb: 'Dawn game drives across the Mara, private conservancies all to yourself, and beds made up beneath the stars.',
    best: 'Jun – Oct', trips: '9 itineraries', from: '₹4,10,000', id: '1516426122078-c23e76319801' },
  { name: 'Rajasthan, India', tags: ['Palace hotels', 'Desert forts', 'Royal heritage'],
    blurb: 'Sleep where maharajas slept, ride camels into the Thar at dusk, and wake to forts glowing gold over the lakes.',
    best: 'Oct – Mar', trips: '16 itineraries', from: '₹1,95,000', id: '1599661046289-e31897846e41' },
];

/* ---------- Travel clips (short-form discovery — full-screen viewer) ---------- */
const CLIPS = [
  { place: 'Kyoto, Japan', caption: 'Cherry blossom dawn at Kiyomizu-dera', tag: 'Tailor-Made',
    desc: 'We arrange private, before-the-crowds access at first light — just you, the temple, and the blossom.',
    likes: '24.7k', views: '1.2M', duration: '0:48', id: '1493976040374-85c8e12f0c0e' },
  { place: 'Santorini, Greece', caption: 'Blue hour over the caldera', tag: 'Honeymoon',
    desc: 'A private cliff-edge terrace, chilled Assyrtiko, and the most photographed sunset on earth — without the crowd.',
    likes: '31.4k', views: '2.1M', duration: '0:36', id: '1570077188670-e3a8d69ac5ff' },
  { place: 'The Maldives', caption: 'Overwater mornings, nobody around', tag: 'Island Escape',
    desc: 'Wake over the lagoon, breakfast floated to your deck, and a private sandbank reserved for two.',
    likes: '48.9k', views: '3.6M', duration: '0:52', id: '1573843981267-be1999ff37cd' },
  { place: 'The Serengeti', caption: 'Sunrise with the great herds', tag: 'Safari',
    desc: 'Track the migration with a private guide, then return to a star-bed camp moved just for your dates.',
    likes: '19.2k', views: '880k', duration: '1:04', id: '1516426122078-c23e76319801' },
  { place: 'Rajasthan, India', caption: 'Inside a 400-year-old palace', tag: 'Heritage',
    desc: 'Stay in a working maharaja’s palace, dine in the durbar hall, and tour the forts before the gates open.',
    likes: '27.6k', views: '1.5M', duration: '0:41', id: '1599661046289-e31897846e41' },
  { place: 'Swiss Alps', caption: 'The Glacier Express window seat', tag: 'Luxury Rail',
    desc: 'Reserved panoramic seats, a private alpine lodge, and the slowest express train in the world.',
    likes: '22.1k', views: '1.1M', duration: '0:58', id: '1530841377377-3ff06c0ca713' },
];

/* ---------- Photo-first reviews ---------- */
const REVIEWS = [
  { name: 'Kumar Biswas', trip: 'Vietnam · Tailor-Made', rating: 5, span: 'tall',
    text: 'They developed such a system that really works — every transfer, every detail handled. Travelling in a country where language was a barrier felt effortless.',
    ids: ['1630001722538-a9a540da549b', '1529156069898-49953e39b3ac', '1642342397404-fed6450eb964'] },
  { name: 'Sunita Rao', trip: 'Japan · Cherry Blossom', rating: 5, span: 'tall',
    text: 'Flawless from start to finish. The cherry blossom viewing in Kyoto was a once-in-a-lifetime moment, arranged beautifully.',
    ids: ['1567122087721-47b09b61e1d1', '1667029839636-af119b059c49', '1639979511572-ff346bc5b3b7'] },
  { name: 'Arjun & Meera', trip: 'Maldives · Honeymoon', rating: 5, span: 'tall',
    text: 'An overwater villa, a private sandbank dinner, and not a single thing to worry about. Pure magic.',
    ids: ['1677179974826-b6619bd77506', '1677176455554-03ae366d51d5', '1639979511514-904e46c8c13f'] },
  { name: 'The Nair Family', trip: 'Switzerland · Family', rating: 5, span: 'tall',
    text: 'Three generations, one unforgettable trip. The kids still talk about the Glacier Express.',
    ids: ['1758272959663-b30513083206', '1715745218436-5a583702447a', '1580825175616-77f8df1bb507'] },
  { name: 'Rohan Kapoor', trip: 'Kenya · Safari', rating: 5, span: 'tall',
    text: 'We watched the migration cross the Mara at dawn. The lodge, the guides, the timing — all impeccable.',
    ids: ['1539635278303-d4002c07eae3', '1581866548373-e6b8e1d0342c', '1758272959063-ef8a2114f807'] },
  { name: 'Priya Menon', trip: 'Italy · Private', rating: 5, span: 'tall',
    text: 'A private gondola, a chef in Tuscany, a guide who opened doors most tourists never see. Worth every rupee.',
    ids: ['1721884487052-8fb79415772c', '1763643820621-d775cf3ae5dd', '1506869640319-fe1a24fd76dc'] },
];

/* One review card: a small photo gallery that auto-slides through the
   traveller's trip photos on hover/focus, with dots showing how many. */
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
      className={`lx2-rcard ${r.span ? `lx2-rcard--${r.span}` : ''} lx2-reveal`}
      style={{ '--d': `${(i % 3) * 0.08}s` }}
      onMouseEnter={start}
      onMouseLeave={stop}
    >
      <div className="lx2-rcard__slides" style={{ transform: `translateX(-${idx * 100}%)` }}>
        {ids.map((id, k) => (
          <div
            key={id + k}
            className="lx2-rcard__slide"
            style={{ backgroundImage: `url(${sizedUnsplash(id, 800)})` }}
            role="img"
            aria-label={`${r.trip} — photo ${k + 1} of ${ids.length} by ${r.name}`}
          />
        ))}
      </div>
      {ids.length > 1 && (
        <div className="lx2-rcard__dots">
          {ids.map((id, k) => (
            <button
              key={id + k}
              type="button"
              className={`lx2-rcard__dot ${k === idx ? 'is-on' : ''}`}
              aria-label={`Show photo ${k + 1}`}
              aria-current={k === idx}
              onMouseEnter={() => setIdx(k)}
              onClick={() => setIdx(k)}
            />
          ))}
        </div>
      )}
      <figcaption className="lx2-rcard__glass lx2-glass">
        <div className="lx2-rcard__meta">
          <div>
            <strong>{r.name}</strong>
            <span>{r.trip}</span>
          </div>
          <span className="lx2-stars">{[...Array(r.rating)].map((_, j) => <Star key={j} size={12} fill="currentColor" />)}</span>
        </div>
        <p className="lx2-rcard__text"><Quote size={15} className="lx2-rcard__q" />{r.text}</p>
      </figcaption>
    </figure>
  );
}

const PRESS = [
  { name: 'Condé Nast Traveler', src: '/press/cntraveller.svg' },
  { name: 'National Geographic', src: '/press/natgeo.svg' },
  { name: 'Travel + Leisure', src: '/press/travel-leisure.svg' },
  { name: 'Forbes', src: '/press/forbes.svg' },
  { name: "Harper's Bazaar", src: '/press/harpers-bazaar.svg' },
  { name: 'The Telegraph', src: '/press/telegraph.svg' },
];

// Short, fully-visible destinations typed out after the fixed "Where to?" prompt
const TRIP_SUGGESTIONS = [
  'Santorini, Greece',
  'Kyoto, Japan',
  'the Serengeti',
  'Rajasthan, India',
  'the Maldives',
  'the Amalfi Coast',
];

/* ---------- Hooks ---------- */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.lx2-reveal');
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

function useCountUp(target, run) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!run) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setVal(target); return; }
    let raf; const start = performance.now(); const dur = 1400;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run]);
  return val;
}

function Stat({ value, suffix, label, run }) {
  const v = useCountUp(value, run);
  return (
    <div className="lx2-stat">
      <span className="lx2-stat__num">{v}{suffix}</span>
      <span className="lx2-stat__lbl">{label}</span>
    </div>
  );
}

export default function Luxe2() {
  useReveal();
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [statIdx, setStatIdx] = useState(0);
  const [filter, setFilter] = useState('All');
  const [destIdx, setDestIdx] = useState(0);
  const [moodIdx, setMoodIdx] = useState(0);
  const [openClip, setOpenClip] = useState(null);   // index of clip open in full-screen viewer
  const touchStart = useRef(null);
  // guided search — animated typewriter for the "what kind of trip" field
  const [tripTyped, setTripTyped] = useState('');
  const [tripCaret, setTripCaret] = useState(true);
  const [tripActive, setTripActive] = useState(false); // focused or has a value → pause animation
  const [statsRun, setStatsRun] = useState(false);
  const heroRef = useRef(null);
  const statsRef = useRef(null);

  // Sticky header state
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Hero parallax
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const onScroll = () => {
      const y = window.scrollY;
      if (heroRef.current) heroRef.current.style.setProperty('--py', `${y * 0.18}px`);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Rotate hero stat chips
  useEffect(() => {
    const t = setInterval(() => setStatIdx((i) => (i + 1) % HERO_STATS.length), 2600);
    return () => clearInterval(t);
  }, []);

  // Trigger count-up when stats band enters view (fire immediately under reduced motion)
  useEffect(() => {
    if (!statsRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setStatsRun(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setStatsRun(true); io.disconnect(); } }, { threshold: 0.25 });
    io.observe(statsRef.current);
    return () => io.disconnect();
  }, []);

  // Lock scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const go = useCallback((href) => (e) => {
    e.preventDefault();
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const stays = filter === 'All' ? STAYS : STAYS.filter((s) => s.cat === filter);
  const mood = MOODS[moodIdx];
  const dest = DESTS[destIdx];
  const nextDest = () => setDestIdx((i) => (i + 1) % DESTS.length);
  const prevDest = () => setDestIdx((i) => (i - 1 + DESTS.length) % DESTS.length);

  /* ---- Full-screen clip viewer ---- */
  const closeClip = useCallback(() => setOpenClip(null), []);
  const nextClip = useCallback(() => setOpenClip((i) => (i === null ? i : (i + 1) % CLIPS.length)), []);
  const prevClip = useCallback(() => setOpenClip((i) => (i === null ? i : (i - 1 + CLIPS.length) % CLIPS.length)), []);

  useEffect(() => {
    if (openClip === null) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') closeClip();
      else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nextClip();
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prevClip();
    };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [openClip, closeClip, nextClip, prevClip]);

  const onClipTouchStart = (e) => { touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
  const onClipTouchEnd = (e) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 45) return;        // ignore taps
    if (Math.abs(dy) >= Math.abs(dx)) { dy < 0 ? nextClip() : prevClip(); }  // swipe up = next
    else { dx < 0 ? nextClip() : prevClip(); }                    // swipe left = next
  };

  const clip = openClip === null ? null : CLIPS[openClip];

  // typewriter that cycles trip suggestions in the first search field; pauses while the user is typing
  useEffect(() => {
    if (tripActive) return;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setTripTyped(TRIP_SUGGESTIONS[0]); return; }
    let sugg = 0, ch = 0, deleting = false, timer;
    const tick = () => {
      const word = TRIP_SUGGESTIONS[sugg];
      if (!deleting) {
        ch += 1; setTripTyped(word.slice(0, ch));
        if (ch === word.length) { deleting = true; timer = setTimeout(tick, 1700); return; }
        timer = setTimeout(tick, 55 + Math.random() * 60);
      } else {
        ch -= 1; setTripTyped(word.slice(0, ch));
        if (ch === 0) { deleting = false; sugg = (sugg + 1) % TRIP_SUGGESTIONS.length; timer = setTimeout(tick, 380); return; }
        timer = setTimeout(tick, 28);
      }
    };
    timer = setTimeout(tick, 500);
    return () => clearTimeout(timer);
  }, [tripActive]);

  // blinking caret for the typewriter
  useEffect(() => {
    if (tripActive) return;
    const id = setInterval(() => setTripCaret((c) => !c), 530);
    return () => clearInterval(id);
  }, [tripActive]);

  return (
    <div className="lx2">
      <div className="lx2-grain" aria-hidden="true" />

      {/* ============ HEADER ============ */}
      <header className={`lx2-header ${scrolled ? 'is-scrolled' : ''}`}>
        {/* Always-visible human-contact strip — no scrolling required */}
        <div className="lx2-util">
          <div className="lx2-util__inner">
            <span className="lx2-util__tag"><Headset size={14} /> Speak to a real travel expert, not a bot</span>
            <div className="lx2-util__links">
              <a href={PHONE_TEL} className="lx2-util__link"><Phone size={14} /> {PHONE_DISPLAY}</a>
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="lx2-util__link lx2-util__link--wa"><MessageCircle size={14} /> WhatsApp</a>
            </div>
          </div>
        </div>
        <div className="lx2-header__inner">
          <a href="#top" onClick={go('#top')} className="lx2-logo" aria-label="Cox & Kings — home">
            <img src="/cox-logo-new.png" alt="Cox & Kings — Est. 1758" />
          </a>
          <nav className="lx2-nav" aria-label="Primary">
            {NAV.map((n) => (
              <a key={n.label} href={n.href} onClick={go(n.href)} className="lx2-nav__link">
                <span>{n.label}</span>
              </a>
            ))}
          </nav>
          <div className="lx2-header__right">
            <a href="#contact" onClick={go('#contact')} className="lx2-btn lx2-btn--secondary lx2-header__cta">
              <Phone size={15} /> Speak to an Expert
            </a>
            <button className="lx2-burger" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* ============ MOBILE / SLIDE-IN NAV (ZOOX-style glass panel) ============ */}
      <div className={`lx2-menu ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen}>
        <div className="lx2-menu__scrim" onClick={() => setMenuOpen(false)} />
        <div className="lx2-menu__panel" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="lx2-menu__top">
            <button className="lx2-menu__close" aria-label="Close menu" onClick={() => setMenuOpen(false)}><X size={20} /></button>
            <img src="/cox-logo-new.png" alt="Cox & Kings — Est. 1758" className="lx2-menu__logo" />
          </div>
          <nav className="lx2-menu__primary" aria-label="Mobile primary">
            {NAV.map((n) => (
              <a key={n.label} href={n.href} onClick={go(n.href)}>
                {n.label}
                <span className="lx2-menu__chev"><ArrowRight size={16} /></span>
              </a>
            ))}
          </nav>
          <div className="lx2-menu__divider" />
          <div className="lx2-menu__secondary">
            {NAV_SECONDARY.map((l) => (
              <a key={l} href="#curated" onClick={go('#curated')}>{l} <ArrowUpRight size={13} /></a>
            ))}
          </div>
          <div className="lx2-menu__foot">
            <span className="lx2-eyebrow">FOLLOW THE JOURNEY</span>
            <div className="lx2-menu__social">
              <a href="#" aria-label="Instagram"><Instagram size={18} /></a>
              <a href="#" aria-label="Facebook"><Facebook size={18} /></a>
              <a href="#" aria-label="YouTube"><Youtube size={18} /></a>
              <a href="#" aria-label="LinkedIn"><Linkedin size={18} /></a>
            </div>
          </div>
        </div>
      </div>

      {/* ============ HERO ============ */}
      <section className="lx2-hero" id="top" ref={heroRef}>
        <div className="lx2-hero__bg" style={{ backgroundImage: `url(${sizedUnsplash('1527668752968-14dc70a27c95', 2000)})` }} />
        <div className="lx2-hero__veil" />

        <div className="lx2-hero__inner">
          <div className="lx2-hero__left">
            <span className="lx2-eyebrow lx2-eyebrow--light lx2-fade" style={{ '--d': '.1s' }}>THE WORLD'S MOST EXPERIENCED TRAVEL COMPANY · SINCE 1758</span>
            <h1 className="lx2-hero__title">
              <span className="lx2-fade" style={{ '--d': '.2s' }}>Discover the World</span>
              <em className="lx2-fade" style={{ '--d': '.36s' }}>in Luxury &amp; Style.</em>
            </h1>
            <p className="lx2-hero__sub lx2-fade" style={{ '--d': '.56s' }}>
              For over two and a half centuries, we have crafted tailor-made journeys for those who
              travel not to escape life, but to deepen it — planned end to end, by one expert who is yours alone.
            </p>

            {/* Glass search */}
            <form className="lx2-search lx2-fade" style={{ '--d': '.76s' }} onSubmit={(e) => e.preventDefault()} role="search">
              <label className="lx2-search__field lx2-search__field--trip">
                <MapPin size={17} />
                <span className="lx2-search__fixed" aria-hidden="true">Where to?</span>
                <input
                  type="text"
                  aria-label="Where to"
                  className="lx2-search__typein"
                  placeholder={tripActive ? '' : `${tripTyped}${tripCaret ? '▍' : ' '}`}
                  onFocus={() => setTripActive(true)}
                  onBlur={(e) => setTripActive(e.target.value.length > 0)}
                  onChange={(e) => setTripActive(e.target.value.length > 0 || document.activeElement === e.target)}
                />
              </label>
              <span className="lx2-search__div" />
              <label className="lx2-search__field lx2-search__field--who">
                <Users size={17} />
                <select defaultValue="" aria-label="How many people">
                  <option value="" disabled hidden>How many people?</option>
                  <option>Just the two of us</option>
                  <option>Family with kids</option>
                  <option>3 – 4 travellers</option>
                  <option>A larger group</option>
                  <option>Travelling solo</option>
                </select>
              </label>
              <span className="lx2-search__div" />
              <label className="lx2-search__field lx2-search__field--when">
                <Calendar size={17} />
                <select defaultValue="" aria-label="When">
                  <option value="" disabled hidden>When?</option>
                  <option>Next 3 months</option>
                  <option>Later in 2026</option>
                  <option>2027 &amp; beyond</option>
                  <option>I'm flexible</option>
                </select>
              </label>
              <button type="submit" className="lx2-search__btn" aria-label="Search journeys"><Search size={17} /><span>Search</span></button>
            </form>

            <div className="lx2-hero__trust lx2-fade" style={{ '--d': '.88s' }}>
              <a href="#reviews" onClick={go('#reviews')} className="lx2-hero__rating">
                <span className="lx2-stars">{[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}</span>
                <strong>4.8</strong>
                <span>from 14,200 verified travellers</span>
                <ArrowRight size={15} />
              </a>
            </div>
          </div>

          {/* Glass stat chips */}
          <div className="lx2-hero__chips" aria-hidden="true">
            {HERO_STATS.map((s, i) => (
              <span key={s} className={`lx2-chip ${i === statIdx ? 'is-active' : ''}`} style={{ '--i': i }}>{s}</span>
            ))}
          </div>
        </div>

        <a href="#heritage" onClick={go('#heritage')} className="lx2-hero__scroll" aria-label="Scroll to explore">
          <span>Scroll to explore</span>
          <ChevronDown size={16} />
        </a>
      </section>

      {/* ============ OUR HERITAGE / TRUST (immediately after hero) ============ */}
      <section className="lx2-heritage" id="heritage">
        <div className="lx2-container lx2-heritage__grid">
          <div className="lx2-heritage__media lx2-reveal">
            <div className="lx2-heritage__photo lx2-heritage__photo--main" style={{ backgroundImage: `url(${sizedUnsplash('1599661046289-e31897846e41', 900)})` }} />
            <div className="lx2-heritage__card lx2-glass">
              <span className="lx2-eyebrow">SINCE 1758</span>
              <h4>Bespoke Itineraries</h4>
              <p>Each journey we curate is a masterpiece — crafted with care and precision to reflect you alone.</p>
              <div className="lx2-heritage__photo lx2-heritage__photo--inset" style={{ backgroundImage: `url(${sizedUnsplash('1523906834658-6e24ef2386f9', 600)})` }} />
            </div>
          </div>

          <div className="lx2-heritage__text lx2-reveal">
            <span className="lx2-eyebrow">// OUR HERITAGE</span>
            <h2 className="lx2-h2">Crafting <strong>unforgettable<br />journeys</strong> since 1758</h2>
            <p className="lx2-heritage__copy">
              From the age of sail to the era of bespoke travel, Cox &amp; Kings has guided generations
              of explorers across the globe — the same name, the same standard, for over a quarter of a millennium.
            </p>

            {/* Scannable, sourced trust credentials — icon-led */}
            <ul className="lx2-trust" aria-label="Why travellers trust Cox & Kings">
              {TRUST_BADGES.map((b) => {
                const Icon = b.icon;
                return (
                  <li key={b.stat} className="lx2-trust__item">
                    <span className="lx2-trust__ic"><Icon size={20} strokeWidth={1.6} /></span>
                    <span className="lx2-trust__body">
                      <strong>{b.stat}</strong>
                      <small>{b.label}</small>
                    </span>
                  </li>
                );
              })}
            </ul>

            <div className="lx2-statband" ref={statsRef}>
              <Stat value={267} suffix="" label="Years of journeys" run={statsRun} />
              <span className="lx2-statband__div" />
              <Stat value={100} suffix="+" label="Destinations" run={statsRun} />
              <span className="lx2-statband__div" />
              <Stat value={98} suffix="%" label="Would travel again" run={statsRun} />
            </div>
            <a href="#contact" onClick={go('#contact')} className="lx2-btn lx2-btn--primary">Discover our story <ArrowRight size={16} /></a>
          </div>
        </div>
      </section>

      {/* ============ CURATED STAYS (search + photo cards) ============ */}
      <section className="lx2-curated" id="curated">
        <div className="lx2-container">
          <div className="lx2-sec-head lx2-reveal">
            <span className="lx2-eyebrow">// OUR CURATIONS</span>
            <h2 className="lx2-h2">A selection of <strong>exceptional<br />stays &amp; journeys</strong></h2>
            <p className="lx2-sec-head__sub">Every price below is fully inclusive — private transfers, 4★ &amp; 5★ hotels, an expert local guide and travel insurance. No hidden extras.</p>
          </div>

          <div className="lx2-filters lx2-reveal">
            {FILTERS.map((f) => (
              <button key={f} className={`lx2-filter ${filter === f ? 'is-on' : ''}`} onClick={() => setFilter(f)}>{f}</button>
            ))}
          </div>

          <div className="lx2-stays">
            {stays.map((s, i) => (
              <article key={s.name} className="lx2-stay lx2-reveal" style={{ '--d': `${i * 0.08}s` }}>
                <div className="lx2-stay__img" style={{ backgroundImage: `url(${sizedUnsplash(s.id, 900)})` }}>
                  <span className="lx2-stay__rating"><Star size={12} fill="currentColor" /> {s.rating}</span>
                </div>
                <div className="lx2-stay__body">
                  <div className="lx2-stay__head">
                    <h3>{s.name}</h3>
                    <p className="lx2-stay__loc"><MapPin size={13} /> {s.loc} <span className="lx2-dot">·</span> {s.nights} nights</p>
                  </div>
                  {/* Inclusions wrap the price in one unified block */}
                  <div className="lx2-stay__deal">
                    <div className="lx2-stay__price">
                      <span>from</span>
                      <strong>{s.price}</strong>
                      <small>/ person</small>
                    </div>
                    <ul className="lx2-stay__inc" aria-label={`What ${s.name} includes`}>
                      {s.highlights.map(({ icon: Icon, label }) => (
                        <li key={label}><Icon size={13} strokeWidth={1.7} /> {label}</li>
                      ))}
                    </ul>
                  </div>
                  {/* Explicit CTAs — no guessing where to tap, especially on mobile.
                      Enquire is the primary (conversion) action; itinerary is secondary. */}
                  <div className="lx2-stay__cta">
                    <a href="#contact" onClick={go('#contact')} className="lx2-btn lx2-btn--outline lx2-stay__view">View itinerary <ArrowRight size={15} /></a>
                    <a href="#contact" onClick={go('#contact')} className="lx2-btn lx2-btn--primary lx2-stay__enq"><Phone size={14} /> Enquire</a>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="lx2-curated__more lx2-reveal">
            <a href="#contact" onClick={go('#contact')} className="lx2-btn lx2-btn--primary lx2-btn--lg">View all journeys <ArrowRight size={16} /></a>
          </div>
        </div>
      </section>

      {/* ============ EXPLORE & DISCOVER (arch carousel + clips rail) ============ */}
      <section className="lx2-dest" id="destinations">
        <div className="lx2-container lx2-dest__grid">
          <div className="lx2-dest__intro lx2-reveal">
            <span className="lx2-eyebrow">// EXPLORE &amp; DISCOVER</span>
            <h2 className="lx2-h2"><strong>Destinations</strong><br />you'll love</h2>
            {/* engaging, per-destination detail that changes as you browse */}
            <p className="lx2-dest__copy" key={dest.name}>{dest.blurb}</p>
            <div className="lx2-dest__facts" key={`f-${dest.name}`}>
              <span className="lx2-dest__fact"><Calendar size={14} /> Best season · {dest.best}</span>
              <span className="lx2-dest__fact"><Compass size={14} /> {dest.trips}</span>
              <span className="lx2-dest__fact"><Sparkles size={14} /> from {dest.from} pp</span>
            </div>
            <div className="lx2-dest__nav">
              <button onClick={prevDest} aria-label="Previous destination"><ArrowLeft size={18} /></button>
              <span className="lx2-dest__count">{String(destIdx + 1).padStart(2, '0')} / {String(DESTS.length).padStart(2, '0')}</span>
              <button onClick={nextDest} aria-label="Next destination"><ArrowRight size={18} /></button>
            </div>
          </div>

          <div className="lx2-dest__stage lx2-reveal">
            <div className="lx2-arch" key={dest.name}>
              <div className="lx2-arch__img" style={{ backgroundImage: `url(${sizedUnsplash(dest.id, 1100)})` }} />
              <div className="lx2-arch__veil" />
              <button className="lx2-arch__go" aria-label={`Explore ${dest.name}`}><ArrowUpRight size={18} /></button>
              {/* swipe arrows live right on the photo — easy to reach on mobile */}
              <button className="lx2-arch__swipe lx2-arch__swipe--prev" onClick={prevDest} aria-label="Previous destination"><ArrowLeft size={20} /></button>
              <button className="lx2-arch__swipe lx2-arch__swipe--next" onClick={nextDest} aria-label="Next destination"><ArrowRight size={20} /></button>
              {/* Name + tags sit together on the wide base of the arch — never clipped by the curve */}
              <div className="lx2-arch__content">
                <h3 className="lx2-arch__name">{dest.name}</h3>
                <div className="lx2-arch__tags">
                  {dest.tags.map((t) => <span key={t} className="lx2-tag">{t}</span>)}
                </div>
              </div>
            </div>
          </div>

          <div className="lx2-dest__rail lx2-reveal">
            {DESTS.map((d, i) => (
              <button key={d.name} className={`lx2-thumb ${i === destIdx ? 'is-on' : ''}`} onClick={() => setDestIdx(i)}>
                <span className="lx2-thumb__img" style={{ backgroundImage: `url(${sizedUnsplash(d.id, 300)})` }} />
                <span className="lx2-thumb__no">{String(i + 1).padStart(2, '0')}</span>
                <span className="lx2-thumb__name">{d.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="lx2-container lx2-dest__more lx2-reveal">
          <a href="#contact" onClick={go('#contact')} className="lx2-btn lx2-btn--primary lx2-btn--lg">View all destinations <ArrowRight size={16} /></a>
        </div>

        {/* Short-form discovery — tap a clip to watch full-screen */}
        <div className="lx2-reels lx2-reveal">
          <div className="lx2-container lx2-reels__head">
            <div>
              <span className="lx2-eyebrow">// TRAVEL CLIPS</span>
              <h3 className="lx2-reels__title">Watch first. Then wander.</h3>
            </div>
            <p className="lx2-reels__hint">Tap a clip to watch full-screen <ArrowRight size={15} /></p>
          </div>
          <div className="lx2-container">
            <div className="lx2-reels__rail" role="list">
              {CLIPS.map((c, i) => (
                <button
                  key={c.place}
                  role="listitem"
                  className="lx2-reel"
                  onClick={() => setOpenClip(i)}
                  aria-label={`Watch clip: ${c.place}`}
                >
                  <div className="lx2-reel__img" style={{ backgroundImage: `url(${sizedUnsplash(c.id, 700)})` }} />
                  <div className="lx2-reel__veil" />
                  <span className="lx2-reel__dur"><Play size={11} fill="currentColor" /> {c.duration}</span>
                  <span className="lx2-reel__play"><Play size={20} fill="currentColor" /></span>
                  <span className="lx2-reel__live" aria-hidden="true">CLIP</span>
                  <div className="lx2-reel__body">
                    <span className="lx2-reel__place"><MapPin size={12} /> {c.place}</span>
                    <p className="lx2-reel__cap">{c.caption}</p>
                    <span className="lx2-reel__tag">{c.tag}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ PHOTO-FIRST REVIEWS ============ */}
      <section className="lx2-reviews" id="reviews">
        <div className="lx2-container">
          <div className="lx2-reviews__head lx2-reveal">
            <div>
              <span className="lx2-eyebrow">TRAVELLER STORIES</span>
              <h2 className="lx2-h2">Real journeys, captured<br />by <strong>real travellers</strong></h2>
            </div>
            <div className="lx2-reviews__agg lx2-glass">
              <span className="lx2-stars lx2-stars--lg">{[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}</span>
              <strong>4.9 / 5</strong>
              <span>from 2,400+ verified reviews</span>
            </div>
          </div>

          <div className="lx2-wall">
            {REVIEWS.map((r, i) => (
              <ReviewCard key={r.name} r={r} i={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ PRESS MARQUEE ============ */}
      <section className="lx2-press" aria-label="As featured in">
        <div className="lx2-press__label"><span className="lx2-eyebrow">AS FEATURED IN</span></div>
        <div className="lx2-press__track">
          {[...PRESS, ...PRESS].map((p, i) => (
            <img key={i} className="lx2-press__logo" src={p.src} alt={p.name} loading="lazy" />
          ))}
        </div>
      </section>

      {/* ============ DISCOVER MY MOOD (luxury, blue-forward — second to last) ============ */}
      <section className="lx2-mood" id="mood" style={{ '--accent': mood.accent }}>
        <div className="lx2-mood__glow" aria-hidden="true" />
        <div className="lx2-container">
          <div className="lx2-mood__head lx2-reveal">
            <span className="lx2-eyebrow lx2-eyebrow--light">// DISCOVER MY MOOD</span>
            <h2 className="lx2-h2">Don’t choose a destination.<br /><strong>Choose a feeling.</strong></h2>
            <p className="lx2-mood__intro">Tell us how you want this journey to feel — and we’ll show you exactly where it lives.</p>
          </div>

          <div className="lx2-mood__stage lx2-reveal">
            <div className="lx2-mood__picker" role="tablist" aria-label="Choose a mood">
              {MOODS.map((m, i) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.key}
                    role="tab"
                    aria-selected={i === moodIdx}
                    className={`lx2-mood__opt ${i === moodIdx ? 'is-on' : ''}`}
                    style={{ '--accent': m.accent }}
                    onMouseEnter={() => setMoodIdx(i)}
                    onFocus={() => setMoodIdx(i)}
                    onClick={() => setMoodIdx(i)}
                  >
                    <span className="lx2-mood__optno">{String(i + 1).padStart(2, '0')}</span>
                    <span className="lx2-mood__optic"><Icon size={19} strokeWidth={1.6} /></span>
                    <span className="lx2-mood__optlbl">{m.key}</span>
                    <ArrowRight size={16} className="lx2-mood__optarrow" />
                  </button>
                );
              })}
            </div>
            <p className="lx2-mood__hint" aria-hidden="true"><ArrowRight size={14} /> Swipe to explore more moods</p>

            <div className="lx2-mood__panel" key={mood.key}>
              {MOODS.map((m, i) => (
                <div
                  key={m.key}
                  className={`lx2-mood__img ${i === moodIdx ? 'is-on' : ''}`}
                  style={{ backgroundImage: `url(${sizedUnsplash(m.id, 1400)})` }}
                  aria-hidden={i !== moodIdx}
                />
              ))}
              <div className="lx2-mood__veil" />
              <div className="lx2-mood__content lx2-glass">
                <span className="lx2-mood__tag"><mood.icon size={15} strokeWidth={1.8} /> {mood.key}</span>
                <p className="lx2-mood__line">{mood.line}</p>
                <div className="lx2-mood__foot">
                  <div>
                    <strong className="lx2-mood__place">{mood.place}</strong>
                    <span className="lx2-mood__meta">{mood.meta}</span>
                  </div>
                  <a href="#contact" onClick={go('#contact')} className="lx2-btn lx2-btn--accent">
                    Design this trip <ArrowRight size={15} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="lx2-cta" id="contact">
        <div className="lx2-cta__bg" style={{ backgroundImage: `url(${sizedUnsplash('1493976040374-85c8e12f0c0e', 1800)})` }} />
        <div className="lx2-cta__veil" />
        <div className="lx2-container lx2-cta__inner lx2-reveal">
          <span className="lx2-eyebrow lx2-eyebrow--light">BEGIN THE CONVERSATION</span>
          <h2 className="lx2-cta__title">Your next journey deserves<br /><strong>a quarter-millennium of judgment.</strong></h2>
          <p className="lx2-cta__sub">Speak with a personal travel designer. No call centres, no scripts — just one expert who learns how you like to travel, and builds it around you.</p>
          <div className="lx2-cta__actions">
            <a href={PHONE_TEL} className="lx2-btn lx2-btn--secondary lx2-btn--lg"><Phone size={17} /> Speak to an Expert</a>
            <a href="#curated" onClick={go('#curated')} className="lx2-btn lx2-btn--glass lx2-btn--lg">Browse journeys <ArrowRight size={16} /></a>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="lx2-footer">
        <div className="lx2-container lx2-footer__top">
          <div className="lx2-footer__brand">
            <img src="/cox-logo-new.png" alt="Cox & Kings — Est. 1758" />
            <p>The world's most experienced travel company.<br />Trusted by generations since 1758.</p>
            <div className="lx2-footer__social">
              <a href="#" aria-label="Instagram"><Instagram size={17} /></a>
              <a href="#" aria-label="Facebook"><Facebook size={17} /></a>
              <a href="#" aria-label="YouTube"><Youtube size={17} /></a>
              <a href="#" aria-label="LinkedIn"><Linkedin size={17} /></a>
            </div>
          </div>
          <div className="lx2-footer__cols">
            <div>
              <span className="lx2-eyebrow">EXPLORE</span>
              <a href="#destinations" onClick={go('#destinations')}>Destinations</a>
              <a href="#curated" onClick={go('#curated')}>Curated Journeys</a>
              <a href="#heritage" onClick={go('#heritage')}>Our Heritage</a>
              <a href="#reviews" onClick={go('#reviews')}>Reviews</a>
            </div>
            <div>
              <span className="lx2-eyebrow">COMPANY</span>
              <a href="#contact" onClick={go('#contact')}>Speak to an Expert</a>
              <a href="#">About Us</a>
              <a href="#">Press Room</a>
              <a href="#">Careers</a>
            </div>
            <div>
              <span className="lx2-eyebrow">CONTACT</span>
              <a href={PHONE_TEL}><Phone size={13} /> {PHONE_DISPLAY}</a>
              <a href="mailto:holidays@coxandkings.com">holidays@coxandkings.com</a>
            </div>
          </div>
        </div>
        <div className="lx2-container lx2-footer__bottom">
          <p>© 2026 Cox &amp; Kings. Est. 1758.</p>
          <div className="lx2-footer__legal">
            <a href="#">Privacy</a><a href="#">Terms</a><a href="#">Cookies</a>
          </div>
        </div>
      </footer>

      {/* ============ MOBILE THUMB-REACH BAR ============ */}
      <div className="lx2-thumbbar">
        <a href={PHONE_TEL} className="lx2-thumbbar__cta"><Phone size={17} /> Speak to an Expert</a>
        <button className="lx2-thumbbar__ai" aria-label="Open Enaya, the AI travel assistant" onClick={() => setChatOpen(true)}>
          <Sparkles size={20} />
        </button>
      </div>

      {/* ============ FLOATING AI BUTTON (desktop) ============ */}
      <button className={`lx2-aifab ${chatOpen ? 'is-hidden' : ''}`} aria-label="Open Enaya, the AI travel assistant" onClick={() => setChatOpen(true)}>
        <Sparkles size={20} />
        <span>Ask Enaya</span>
      </button>

      {/* ============ AI CHAT DRAWER ============ */}
      <div className={`lx2-chat ${chatOpen ? 'open' : ''}`} aria-hidden={!chatOpen}>
        <div className="lx2-chat__panel lx2-glass" role="dialog" aria-modal="true" aria-label="AI travel assistant">
          <div className="lx2-chat__head">
            <div className="lx2-chat__id">
              <span className="lx2-chat__avatar"><Sparkles size={16} /></span>
              <div>
                <strong>Enaya — AI Travel Designer</strong>
                <span className="lx2-chat__status"><i /> Online · replies instantly</span>
              </div>
            </div>
            <button className="lx2-chat__close" aria-label="Close assistant" onClick={() => setChatOpen(false)}><X size={18} /></button>
          </div>
          <div className="lx2-chat__body">
            <div className="lx2-chat__msg lx2-chat__msg--bot">
              Namaste 👋 I'm Enaya, your AI travel designer. Tell me where you'd love to go, and I'll sketch a tailor-made journey — or connect you to a human expert.
            </div>
            <div className="lx2-chat__chips">
              <button>Honeymoon in the Maldives</button>
              <button>Family trip to Japan</button>
              <button>Safari in Kenya</button>
            </div>
          </div>
          <form className="lx2-chat__input" onSubmit={(e) => e.preventDefault()}>
            <input type="text" placeholder="Ask anything about your trip…" aria-label="Message" />
            <button type="submit" aria-label="Send"><Send size={16} /></button>
          </form>
        </div>
      </div>

      {/* ============ FULL-SCREEN CLIP VIEWER ============ */}
      {clip && (
        <div
          className="lx2-cv"
          role="dialog"
          aria-modal="true"
          aria-label={`Clip: ${clip.place}`}
          onTouchStart={onClipTouchStart}
          onTouchEnd={onClipTouchEnd}
        >
          <div className="lx2-cv__scrim" onClick={closeClip} />
          <button className="lx2-cv__close" aria-label="Close clip" onClick={closeClip}><X size={22} /></button>
          <button className="lx2-cv__arrow lx2-cv__arrow--prev" aria-label="Previous clip" onClick={prevClip}><ArrowLeft size={24} /></button>
          <button className="lx2-cv__arrow lx2-cv__arrow--next" aria-label="Next clip" onClick={nextClip}><ArrowRight size={24} /></button>

          <div className="lx2-cv__stage">
            <div className="lx2-cv__progress" aria-hidden="true">
              {CLIPS.map((_, i) => <span key={i} className={i === openClip ? 'is-on' : ''} />)}
            </div>

            <div className="lx2-cv__media" style={{ backgroundImage: `url(${sizedUnsplash(clip.id, 1200)})` }}>
              <div className="lx2-cv__shade" />
              <span className="lx2-cv__playbig"><Play size={28} fill="currentColor" /></span>

              <div className="lx2-cv__toprow">
                <span className="lx2-cv__tag">{clip.tag}</span>
                <span className="lx2-cv__dur"><Play size={11} fill="currentColor" /> {clip.duration}</span>
              </div>

              {/* action rail — save, reviews, share */}
              <div className="lx2-cv__actions">
                <button type="button" className="lx2-cv__act" aria-label="Save this clip"><Bookmark size={22} /><small>Save</small></button>
                <button type="button" className="lx2-cv__act" aria-label="Read reviews"><MessageCircle size={22} /><small>Reviews</small></button>
                <button type="button" className="lx2-cv__act" aria-label="Share this clip"><Share2 size={21} /><small>Share</small></button>
              </div>

              <div className="lx2-cv__info">
                <span className="lx2-cv__place"><MapPin size={14} /> {clip.place}</span>
                <h4 className="lx2-cv__cap">{clip.caption}</h4>
                <p className="lx2-cv__desc">{clip.desc}</p>
                <a
                  href="#contact"
                  onClick={(e) => { e.preventDefault(); closeClip(); const el = document.querySelector('#contact'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
                  className="lx2-btn lx2-btn--primary"
                >
                  Design this trip <ArrowRight size={15} />
                </a>
              </div>
            </div>

            <p className="lx2-cv__swipehint" aria-hidden="true">Swipe or use ← → · Esc to close</p>
          </div>
        </div>
      )}
    </div>
  );
}
