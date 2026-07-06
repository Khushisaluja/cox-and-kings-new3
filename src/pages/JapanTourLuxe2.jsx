import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Menu, X, ArrowRight, ArrowLeft, ArrowUpRight, ChevronRight, ChevronDown,
  Star, MapPin, Calendar, Users, Plane, Check, Plus, Minus, Lock, Quote,
  ShieldCheck, Phone, MessageCircle, PhoneCall, Headset, Sparkles, Clock,
  Wallet, Repeat, Stamp, CheckCircle2, Instagram, Facebook, Youtube, Linkedin,
  Hotel, Utensils, TrainFront, Compass,
} from 'lucide-react';
import ChatBot from '../components/ChatBot';
import './Luxe2Improved.css';
import './JapanTourLuxe.css';
import './JapanTourLuxe2.css';

/* ============================================================
   Cox & Kings — "Splendours of Japan" product / tour-detail page,
   VARIANT 2. Route: /tour-detail-japan-2.
   Same design language as JapanTourLuxe, but the "Day by day"
   section is reimagined as a split view: the itinerary on the
   LEFT, and a single sticky picture on the RIGHT that follows
   whichever day you hover / tap. The standalone photo gallery is
   removed — its imagery now lives inside the itinerary itself.
   ============================================================ */

const sizedUnsplash = (id, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

/* ---------- Human contact (matches the homepage) ---------- */
const PHONE_DISPLAY = '+91 85560 01700';
const PHONE_TEL = 'tel:+918556001700';
const WHATSAPP = 'https://wa.me/918556001700?text=Hi%20Cox%20%26%20Kings%2C%20I%27d%20like%20to%20plan%20the%20Splendours%20of%20Japan%20journey.';
const EMAIL = 'holidays@coxandkings.com';
const OFFICE_SHORT = 'Fort, Mumbai 400001';
const OFFICE_FULL = 'Turner Morrison House, 16 Bank Street, Fort, Mumbai 400001';
const HOME = '/luxe2-improved';

/* Header nav — same shape as the homepage (hover dropdowns). */
const NAV = [
  { label: 'Heritage', href: `${HOME}#heritage`, menu: [
    { label: 'Our story since 1758', href: `${HOME}#heritage` },
    { label: 'Why Cox & Kings', href: `${HOME}#curated` },
    { label: 'Press & awards', href: `${HOME}#reviews` },
  ] },
  { label: 'Journeys', href: `${HOME}#curated`, menu: [
    { label: 'Escorted group tours', href: `${HOME}#curated` },
    { label: 'Tailor-made trips', href: `${HOME}#curated` },
    { label: 'Honeymoons & milestones', href: `${HOME}#curated` },
  ] },
  { label: 'This tour', href: '#highlights', menu: [
    { label: 'Highlights', href: '#highlights' },
    { label: 'Your route', href: '#route' },
    { label: 'Day by day', href: '#itinerary' },
    { label: 'Dates & prices', href: '#dates' },
    { label: 'Reviews', href: '#reviews' },
  ] },
  { label: 'Discover', href: `${HOME}#destinations` },
  { label: 'Reviews', href: '#reviews' },
];

/* ---------- Tour data (aligned to the Splendours of Japan card) ---------- */
const PRICE = 295000;
const HERO = {
  kicker: 'Splendours of Japan · Escorted group tour',
  title: 'Japan, as the cherry blossoms fall.',
  lead:
    'Twelve unhurried days from Tokyo’s neon to Kyoto’s temple gardens, timed to the fleeting bloom — in a small group, led by an expert guide. You simply turn up; we’ve thought of all the rest. 🇯🇵',
  image: '1522383225653-ed111181a951',
  facts: [
    { icon: Calendar, label: '12 Days · 11 Nights' },
    { icon: MapPin, label: '5 Cities' },
    { icon: Users, label: 'Max 20 guests' },
    { icon: Plane, label: 'Flights included' },
  ],
};

const HIGHLIGHT_IMG = '1533050487297-09b450131914';
/* Scannable "what's in the price" strip — the key inclusions, at a glance. */
const KEY_INCLUSIONS = [
  { icon: Plane, label: 'Return flights' },
  { icon: Hotel, label: '4★/5★ + ryokan stays' },
  { icon: Utensils, label: 'All meals included' },
  { icon: Compass, label: 'Expert guide throughout' },
  { icon: TrainFront, label: 'Bullet-train travel' },
  { icon: ShieldCheck, label: 'Visa & insurance' },
];
const HIGHLIGHTS = [
  'A private tea ceremony in a Kyoto machiya',
  'A night in a traditional onsen ryokan',
  'Bullet train to Hakone with Mt. Fuji views',
  'Early-access temple visits, before the crowds',
  'Nara’s bowing deer and the great bronze Buddha',
  'Tsukiji and Nishiki market food walks',
];

const ROUTE = [
  { nights: '3 nights', city: 'Tokyo', note: 'Old and new — Senso-ji, the Meiji shrine, and the city’s electric energy after dark.', image: '1480796927426-f609979314bd' },
  { nights: '1 night', city: 'Hakone', note: 'An onsen ryokan, a kaiseki dinner, and Mt. Fuji mirrored in the lake.', image: '1490806843957-31f4c9a91c65' },
  { nights: '5 nights', city: 'Kyoto', note: 'Temples, Gion, Arashiyama — with a full day trip to Nara and its deer.', image: '1493976040374-85c8e12f0c0e' },
  { nights: '2 nights', city: 'Osaka', note: 'Dotonbori neon, Osaka Castle, and last bowls of ramen before home.', image: '1590559899731-a382839e5549' },
];

/* Day-by-day itinerary — each day now carries its own picture + place,
   which drives the sticky image panel on the right. */
const ITINERARY = [
  { day: 'Day 01', place: 'Tokyo', title: 'Arrive Tokyo', body: 'Met at Narita by your guide and transferred to your hotel. An evening welcome dinner in Asakusa with the group.', img: '1480796927426-f609979314bd', cap: 'Tokyo lights up as you land' },
  { day: 'Day 02', place: 'Tokyo', title: 'Tokyo, old & new', body: 'Senso-ji temple and the lanes of Asakusa in the morning, the Meiji shrine and Harajuku in the afternoon, and Shibuya after dark.', img: '1522383225653-ed111181a951', cap: 'Blossoms over the Asakusa gate' },
  { day: 'Day 03', place: 'Tokyo', title: 'Tokyo at leisure', body: 'A free day to wander — teamLab’s digital art, the Tsukiji outer market, or a quiet garden. Your guide has ideas for every pace.', img: '1528360983277-13d401cdc186', cap: 'A torii path, minutes from the city' },
  { day: 'Day 04', place: 'Hakone', title: 'Hakone & Mt. Fuji', body: 'Bullet train to Hakone. A lake cruise and ropeway with Mt. Fuji views, then a night in an onsen ryokan with a kaiseki dinner.', img: '1490806843957-31f4c9a91c65', cap: 'Mt. Fuji, mirrored in the lake' },
  { day: 'Day 05', place: 'Kyoto', title: 'Into Kyoto', body: 'Travel on to Kyoto by rail. A first evening walk through the lantern-lit lanes of Gion, Japan’s geisha district.', img: '1524413840807-0c3cb6fa808d', cap: 'Lanterns in the lanes of Gion' },
  { day: 'Day 06', place: 'Kyoto', title: 'Kyoto’s temples', body: 'Early-access to Fushimi Inari before the crowds, the golden Kinkaku-ji, and a private tea ceremony in a machiya townhouse.', img: '1493976040374-85c8e12f0c0e', cap: 'A quiet pagoda at first light' },
  { day: 'Day 07', place: 'Nara', title: 'Nara day trip', body: 'A day in Nara — the great bronze Buddha of Todai-ji and the free-roaming, bowing deer of Nara Park.', img: '1533050487297-09b450131914', cap: 'Temple gardens on the road to Nara' },
  { day: 'Day 08', place: 'Kyoto', title: 'Arashiyama & bamboo', body: 'The towering Arashiyama bamboo grove at first light, the Iwatayama monkeys, and a riverside lunch.', img: '1522383225653-ed111181a951', cap: 'Spring colour along the river' },
  { day: 'Day 09', place: 'Kyoto', title: 'Kyoto at leisure', body: 'A free day. Shop Nishiki market, revisit a favourite temple, or simply rest before the journey south.', img: '1524413840807-0c3cb6fa808d', cap: 'Evening in the old quarter' },
  { day: 'Day 10', place: 'Osaka', title: 'Kyoto → Osaka', body: 'A short hop to Osaka. An evening food walk through the neon of Dotonbori — takoyaki, okonomiyaki and street-side ramen.', img: '1590559899731-a382839e5549', cap: 'Dotonbori after dark' },
  { day: 'Day 11', place: 'Osaka', title: 'Osaka', body: 'Osaka Castle and the city at your own pace, with a final group dinner to toast the journey.', img: '1590559899731-a382839e5549', cap: 'One last night in the neon' },
  { day: 'Day 12', place: 'Departure', title: 'Depart for home', body: 'Transferred to Kansai airport for your flight home, with a little more Japan in you than when you arrived.', img: '1522383225653-ed111181a951', cap: 'Sakura, as you say goodbye' },
];

const INCLUDED = [
  'Return international flights from your city, plus all bullet-train and coach travel within Japan',
  'Eleven nights in hand-picked 4★/5★ hotels and one traditional onsen ryokan',
  'Daily breakfast, welcome and farewell group dinners, and a kaiseki ryokan dinner',
  'A dedicated English-speaking guide and tour manager for the entire journey',
  'Every entrance, temple visit and private experience listed in the itinerary',
  'Visa assistance, travel insurance, and all airport and hotel transfers',
];
const NOT_INCLUDED = [
  'Lunches and any meals not listed above, plus personal shopping and drinks',
  'Optional experiences and excursions beyond the set itinerary',
  'Gratuities for your guide and drivers — entirely at your discretion',
  'Anything of a personal nature — spa treatments, minibar, laundry',
];

const DEPARTURES = [
  { date: '21 March 2026', seats: 'Only 6 seats left', tight: true },
  { date: '28 March 2026', seats: 'Filling fast · 8 seats', tight: true },
  { date: '04 April 2026', seats: '12 seats available', tight: false },
  { date: '17 October 2026', seats: '14 seats available', tight: false },
];

/* Photo-first traveller reviews (families & groups). */
const REVIEWS = [
  { name: 'The Menon Family', age: '3 generations', trip: 'Japan · Cherry Blossom', rating: 5, span: 'tall',
    text: 'Grandparents, parents and two kids — all looked after. The pace was gentle, the ryokan night unforgettable, and the children still talk about the bullet train.',
    ids: ['1758272959663-b30513083206', '1715745218436-5a583702447a', '1580825175616-77f8df1bb507'] },
  { name: 'Aditi & Mohit', age: '', trip: 'Japan · Group · 2025', rating: 5, span: 'tall',
    text: 'Every transfer, every meal, flawless. The blossom timing was perfect and the small group felt like friends by the end. We simply turned up and were cared for.',
    ids: ['1630001722538-a9a540da549b', '1529156069898-49953e39b3ac'] },
  { name: 'Sunita Rao', age: '', trip: 'Japan · Kyoto temples', rating: 5, span: 'tall',
    text: 'Flawless from start to finish. The cherry blossom viewing in Kyoto was a once-in-a-lifetime moment, arranged beautifully by our guide.',
    ids: ['1567122087721-47b09b61e1d1', '1667029839636-af119b059c49'] },
  { name: 'The Nair Family', age: '5 travelling', trip: 'Japan · Escorted Group', rating: 5, span: 'tall',
    text: 'Zero planning stress with the fixed departure. Veg and Jain meals arranged every single day, and Nara’s deer were the highlight for our kids.',
    ids: ['1642342397404-fed6450eb964', '1580825175616-77f8df1bb507'] },
  { name: 'Rahul & friends', age: 'Group of 6', trip: 'Japan · Spring 2025', rating: 5, span: 'tall',
    text: 'Six of us, one seamless trip. The Dotonbori food walk, the onsen ryokan, temples at dawn — our guide made every day effortless.',
    ids: ['1639979511572-ff346bc5b3b7', '1667029839636-af119b059c49'] },
  { name: 'Priya & Raghav', age: '', trip: 'Japan · Anniversary', rating: 5, span: 'tall',
    text: 'A private tea ceremony, Mt. Fuji from the ropeway, and a curator a call away the whole time. Genuinely worth every rupee.',
    ids: ['1677179974826-b6619bd77506', '1639979511572-ff346bc5b3b7'] },
];

const SIMILAR = [
  { title: 'Grand European Sojourn', region: '5 countries', season: 'Apr–Oct', nights: '12 nights', priceFrom: '₹2,85,000', image: '1502602898657-3e91760cbb34', tags: ['Balanced pace', 'Escorted group'] },
  { title: 'Switzerland & the Alps', region: 'Switzerland', season: 'May–Sep', nights: '11 nights', priceFrom: '₹2,55,000', image: '1530841377377-3ff06c0ca713', tags: ['Relaxed pace', 'Scenic rail'] },
  { title: 'Rajasthan by Palace', region: 'India', season: 'Oct–Mar', nights: '9 nights', priceFrom: '₹1,95,000', image: '1599661046289-e31897846e41', tags: ['Relaxed pace', 'Heritage stays'] },
  { title: 'African Safari', region: 'Kenya & Tanzania', season: 'Jul–Oct', nights: '8 nights', priceFrom: '₹3,10,000', image: '1516426122078-c23e76319801', tags: ['Active pace', 'Small group'] },
];

const SAFETY = [
  { icon: Wallet, label: 'Low deposit', note: 'Book from 20% today' },
  { icon: Repeat, label: 'Free changes', note: 'Up to 45 days before travel' },
  { icon: Stamp, label: 'Visa support', note: 'Paperwork handled for you' },
  { icon: ShieldCheck, label: 'Financially protected', note: 'Your money is held securely' },
];

/* Booking terms — a few key points shown up front; the full set opens in a modal. */
const TERMS_SUMMARY = [
  { icon: Wallet, title: 'Deposit & payment', text: 'Confirm your seats with a 20% deposit; the balance is due 45 days before departure. International airfare is charged in full at ticketing.' },
  { icon: Calendar, title: 'Cancellation charges', text: '30% if you cancel 60+ days before travel, 50% at 45–59 days, 75% at 36–44 days, and 100% within 35 days or for a no-show.' },
  { icon: Stamp, title: 'Passport & visa', text: 'A passport valid at least 6 months beyond your return date and a valid visa/ETA are required — we handle the visa paperwork for you.' },
  { icon: ShieldCheck, title: 'Insurance included', text: 'Comprehensive travel insurance is included — medical expenses, baggage, trip cancellation and emergency evacuation.' },
];
const TERMS_FULL = [
  { heading: 'Payment schedule', points: [
    'A 20% deposit confirms your seats at the time of booking.',
    '75% of the tour cost is payable 60 days before departure.',
    'The full balance (100%) is payable 45 days before departure.',
    'International airfare is charged at 100% at the time of ticketing and is subject to change until tickets are issued.',
  ] },
  { heading: 'Cancellation & refunds', points: [
    '60 or more days before departure: 30% of tour cost retained.',
    '45–59 days before departure: 50% retained.',
    '36–44 days before departure: 75% retained.',
    '0–35 days before departure or no-show: 100% retained.',
    'Airfare is cancelled as per the airline’s policy. Refunds are processed within 45 days of cancellation.',
  ] },
  { heading: 'Travel documents', points: [
    'A passport valid for a minimum of 6 months beyond your return date is mandatory.',
    'A valid visa or ETA is required for Japan; our team assists with the application.',
    'Vaccination certificates and health documents may be required as per destination rules.',
    'Cancellation due to invalid or incomplete documents incurs standard cancellation charges.',
  ] },
  { heading: 'Insurance', points: [
    'Comprehensive travel insurance is mandatory and included in your package.',
    'It covers medical expenses, baggage loss, trip cancellation and emergency evacuation.',
    'Cox & Kings acts only as a facilitator; any claims are addressed directly to the insurer.',
  ] },
  { heading: 'Good to know', points: [
    'No refund is provided for unused services (hotels, meals, sightseeing, etc.).',
    'Special dietary requests (e.g. Jain, vegetarian) require at least 45 days’ written notice.',
    'All personal belongings and valuables remain the sole responsibility of the traveller.',
    'The rate of exchange is calculated on the final payment date (RBI reference rate + ₹2).',
    'Booking becomes a binding agreement upon execution of the booking form or advance payment.',
  ] },
];

const SUBNAV = [
  { id: 'highlights', label: 'Highlights' },
  { id: 'route', label: 'Route' },
  { id: 'itinerary', label: 'Day by day' },
  { id: 'included', label: 'Included' },
  { id: 'dates', label: 'Dates & prices' },
  { id: 'terms', label: 'Booking terms' },
  { id: 'reviews', label: 'Reviews' },
];

const inr = (n) => `₹${n.toLocaleString('en-IN')}`;

/* Scroll-reveal (mirrors the homepage useReveal) */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.lx2i-reveal');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { els.forEach((e) => e.classList.add('in')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);
}

export default function JapanTourLuxe2() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDay, setActiveDay] = useState(0);     // desktop: drives the sticky itinerary picture
  const [openDay, setOpenDay] = useState(-1);        // mobile: which day's accordion is expanded
  const [selectedDep, setSelectedDep] = useState(0);
  const [payMode, setPayMode] = useState('deposit');
  const [activeSection, setActiveSection] = useState('highlights');
  const [callbackOpen, setCallbackOpen] = useState(false);
  const [callbackSent, setCallbackSent] = useState(false);
  const [reviewIdx, setReviewIdx] = useState(0);
  const [travellers, setTravellers] = useState(2);
  const [termsOpen, setTermsOpen] = useState(false);

  useReveal();
  const review = REVIEWS[reviewIdx];
  const day = ITINERARY[activeDay];
  const nextReview = () => setReviewIdx((i) => (i + 1) % REVIEWS.length);
  const prevReview = () => setReviewIdx((i) => (i - 1 + REVIEWS.length) % REVIEWS.length);

  // Live booking maths — the card computes a real, changing total.
  const total = PRICE * travellers;
  const depositTotal = Math.round(total * 0.2);
  const dueToday = payMode === 'deposit' ? depositTotal : total;
  const balance = total - dueToday;

  useEffect(() => { window.scrollTo(0, 0); }, []);

  // Sticky-header state (transparent over hero → solid blue on scroll, like the homepage)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const lock = menuOpen || callbackOpen || termsOpen;
    document.body.style.overflow = lock ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen, callbackOpen, termsOpen]);

  useEffect(() => {
    if (!callbackOpen && !termsOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') { setCallbackOpen(false); setTermsOpen(false); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [callbackOpen, termsOpen]);

  // Spy the active section for the sticky sub-nav
  useEffect(() => {
    const els = SUBNAV.map((s) => document.getElementById(s.id)).filter(Boolean);
    if (!els.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (vis[0]) setActiveSection(vis[0].target.id);
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.2, 0.6, 1] }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // In-page (#) nav links smooth-scroll; cross-page links navigate normally.
  const navClick = useCallback((href) => (e) => {
    setMenuOpen(false);
    if (href.startsWith('#')) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const openCallback = useCallback((e) => { if (e) e.preventDefault(); setMenuOpen(false); setCallbackSent(false); setCallbackOpen(true); }, []);

  return (
    <>
      <div className="lx2i lxjt lxjt2">
        <div className="lx2i-grain" aria-hidden="true" />
        <a className="lxjt-skip" href="#main">Skip to content</a>

        {/* ============ HEADER (identical to the homepage) ============ */}
        <header className={`lx2i-header ${scrolled ? 'is-scrolled' : ''}`}>
          <div className="lx2i-util">
            <div className="lx2i-util__inner">
              <span className="lx2i-util__tag"><Headset size={14} /> Speak to a real travel expert, not a bot</span>
              <div className="lx2i-util__links">
                <span className="lx2i-util__addr"><MapPin size={14} /> {OFFICE_SHORT}</span>
                <a href={PHONE_TEL} className="lx2i-util__link"><Phone size={14} /> {PHONE_DISPLAY}</a>
                <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="lx2i-util__link lx2i-util__link--wa"><MessageCircle size={14} /> WhatsApp</a>
              </div>
            </div>
          </div>
          <div className="lx2i-header__inner">
            <Link to={HOME} className="lx2i-logo" aria-label="Cox & Kings — home">
              <img src="/cox-logo-new.png" alt="Cox & Kings — Est. 1758" />
            </Link>
            <nav className="lx2i-nav" aria-label="Primary">
              {NAV.map((n) => (
                <div key={n.label} className="lx2i-nav__item">
                  <a href={n.href} onClick={navClick(n.href)} className="lx2i-nav__link">
                    <span>{n.label}</span>
                    {n.menu && <ChevronDown size={14} className="lx2i-nav__caret" aria-hidden="true" />}
                  </a>
                  {n.menu && (
                    <div className="lx2i-nav__drop" role="menu" aria-label={n.label}>
                      <div className="lx2i-nav__dropcard">
                        {n.menu.map((m) => (
                          <a key={m.label} href={m.href} onClick={navClick(m.href)} className="lx2i-nav__dropitem" role="menuitem">
                            <span>{m.label}</span><ArrowRight size={14} />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>
            <div className="lx2i-header__right">
              <a href={PHONE_TEL} className="lx2i-btn lx2i-btn--secondary lx2i-header__cta"><Phone size={15} /> Speak to an Expert</a>
              <button className="lx2i-burger" aria-label="Open menu" onClick={() => setMenuOpen(true)}><Menu size={22} /></button>
            </div>
          </div>
        </header>

        {/* ============ MOBILE SLIDE-IN MENU ============ */}
        <div className={`lx2i-menu ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen}>
          <div className="lx2i-menu__scrim" onClick={() => setMenuOpen(false)} />
          <div className="lx2i-menu__panel" role="dialog" aria-modal="true" aria-label="Menu">
            <div className="lx2i-menu__top">
              <button className="lx2i-menu__close" aria-label="Close menu" onClick={() => setMenuOpen(false)}><X size={20} /></button>
              <img src="/cox-logo-new.png" alt="Cox & Kings — Est. 1758" className="lx2i-menu__logo" />
            </div>
            <nav className="lx2i-menu__primary" aria-label="Mobile primary">
              {NAV.map((n) => (
                <a key={n.label} href={n.href} onClick={navClick(n.href)}>
                  {n.label}<span className="lx2i-menu__chev"><ArrowRight size={16} /></span>
                </a>
              ))}
            </nav>
            <div className="lx2i-menu__office">
              <span className="lx2i-eyebrow">OUR OFFICE</span>
              <p className="lx2i-menu__addr"><MapPin size={15} /> {OFFICE_FULL}</p>
              <a href={PHONE_TEL} className="lx2i-menu__addrphone"><Phone size={14} /> {PHONE_DISPLAY}</a>
            </div>
            <div className="lx2i-menu__foot">
              <span className="lx2i-eyebrow">FOLLOW THE JOURNEY</span>
              <div className="lx2i-menu__social">
                <a href="#" aria-label="Instagram"><Instagram size={18} /></a>
                <a href="#" aria-label="Facebook"><Facebook size={18} /></a>
                <a href="#" aria-label="YouTube"><Youtube size={18} /></a>
                <a href="#" aria-label="LinkedIn"><Linkedin size={18} /></a>
              </div>
            </div>
          </div>
        </div>

        <main id="main">
          {/* ============ HERO (full-bleed under the fixed header) ============ */}
          <section className="lxjt-hero">
            <div className="lxjt-hero__bg" style={{ backgroundImage: 'url(/japan-bg.jpg)' }} aria-hidden="true" />
            <div className="lxjt-hero__veil" aria-hidden="true" />
            <div className="lx2i-container lxjt-hero__inner">
              <nav className="lxjt-crumb" aria-label="Breadcrumb">
                <Link to={HOME}><ArrowLeft size={14} /> Back to journeys</Link>
                <span className="lxjt-crumb__trail" aria-hidden="true">
                  <Link to={HOME}>Home</Link><ChevronRight size={12} />
                  <Link to={`${HOME}#curated`}>Escorted tours</Link><ChevronRight size={12} />
                  <span>Splendours of Japan</span>
                </span>
              </nav>
              <div className="lxjt-hero__content lx2i-fade" style={{ '--d': '.1s' }}>
                <span className="lx2i-eyebrow lx2i-eyebrow--light">{HERO.kicker}</span>
                <h1 className="lxjt-hero__title">{HERO.title}</h1>
                <p className="lxjt-hero__lead">{HERO.lead}</p>
                <ul className="lxjt-hero__facts" aria-label="Trip at a glance">
                  {HERO.facts.map(({ icon: Icon, label }) => (
                    <li key={label} className="lxjt-fact"><Icon size={16} strokeWidth={1.9} /> {label}</li>
                  ))}
                </ul>
                <div className="lxjt-hero__actions">
                  <a href="#dates" onClick={navClick('#dates')} className="lx2i-btn lx2i-btn--secondary lx2i-btn--lg">Check dates &amp; prices <ArrowRight size={16} /></a>
                  <a href="#itinerary" onClick={navClick('#itinerary')} className="lxjt-hero__textcta">or view the day-by-day itinerary <ArrowRight size={14} /></a>
                </div>
                <div className="lxjt-hero__rating">
                  <span className="lx2i-stars">{[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}</span>
                  <strong>4.9</strong><span>from 640 traveller reviews of this tour</span>
                </div>
              </div>
            </div>
          </section>

          {/* ============ STICKY SUB-NAV ============ */}
          <nav className="lxjt-subnav" aria-label="Sections of this tour">
            <div className="lx2i-container lxjt-subnav__inner">
              <ul>
                {SUBNAV.map((s) => (
                  <li key={s.id}><a href={`#${s.id}`} onClick={navClick(`#${s.id}`)} className={activeSection === s.id ? 'is-active' : ''}>{s.label}</a></li>
                ))}
              </ul>
            </div>
          </nav>

          {/* ============ HIGHLIGHTS ============ */}
          <section className="lxjt-section" id="highlights">
            <div className="lx2i-container">
              <div className="lxjt-head lx2i-reveal">
                <span className="lx2i-eyebrow">// THE JOURNEY, CURATED FOR YOU</span>
                <h2 className="lx2i-h2">Tour <strong>highlights</strong></h2>
                <p className="lxjt-lead">Every detail privately arranged, so you need only turn up and be there for it.</p>
              </div>
              <ul className="lxjt-keyinc lx2i-reveal" aria-label="Key inclusions in the price">
                {KEY_INCLUSIONS.map(({ icon: Icon, label }) => (
                  <li key={label} className="lxjt-keyinc__item">
                    <span className="lxjt-keyinc__ic"><Icon size={20} strokeWidth={1.7} /></span>
                    <span className="lxjt-keyinc__lbl">{label}</span>
                  </li>
                ))}
              </ul>
              <div className="lxjt-hl__grid">
                <div className="lxjt-hl__media lx2i-reveal">
                  <div className="lxjt-hl__img" style={{ backgroundImage: `url(${sizedUnsplash(HIGHLIGHT_IMG, 900)})` }} role="img" aria-label="Travellers exploring a Kyoto temple garden" />
                  <span className="lxjt-hl__cap"><MapPin size={13} /> Kyoto, at first light</span>
                </div>
                <ul className="lxjt-hl__list">
                  {HIGHLIGHTS.map((h, i) => (
                    <li key={h} className="lxjt-hl__item lx2i-reveal" style={{ '--d': `${(i % 3) * 0.07}s` }}>
                      <span className="lxjt-hl__mark" aria-hidden="true">&#10022;</span>
                      <p>{h}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* ============ ROUTE ============ */}
          <section className="lxjt-route" id="route">
            <div className="lx2i-container">
              <div className="lxjt-head lxjt-head--center lx2i-reveal">
                <span className="lx2i-eyebrow">// 11 NIGHTS, IN A SMALL GROUP</span>
                <h2 className="lx2i-h2">Your <strong>route</strong></h2>
                <p className="lxjt-lead">Tokyo to Osaka: five cities, one seamless journey by rail.</p>
              </div>
              <ol className="lxjt-route__list">
                {ROUTE.map((r, i) => (
                  <li key={r.city} className="lxjt-stop lx2i-reveal" style={{ '--d': `${i * 0.06}s` }}>
                    <div className="lxjt-stop__marker">
                      <div className="lxjt-stop__photo" style={{ backgroundImage: `url(${sizedUnsplash(r.image, 400)})` }} role="img" aria-label={`${r.city}, Japan`} />
                      <span className="lxjt-stop__num">{i + 1}</span>
                    </div>
                    {i < ROUTE.length - 1 && <span className="lxjt-stop__line" aria-hidden="true" />}
                    <div className="lxjt-stop__body">
                      <span className="lxjt-stop__nights">{r.nights}</span>
                      <h3>{r.city}</h3>
                      <p>{r.note}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* ============ DAY BY DAY — itinerary (left) + sticky picture (right) ============ */}
          <section className="lxjt-section lxjt2-itin" id="itinerary">
            <div className="lx2i-container">
              <div className="lxjt-head lxjt-head--center lx2i-reveal">
                <span className="lx2i-eyebrow">// THE FULL PICTURE, DAY BY DAY</span>
                <h2 className="lx2i-h2">Day by <strong>day</strong></h2>
                <p className="lxjt-lead">Twelve unhurried days — hover or tap any day and watch it come to life beside you.</p>
              </div>

              <div className="lxjt2-split lx2i-reveal">
                {/* LEFT — the itinerary timeline */}
                <ol className="lxjt2-days" onMouseLeave={() => { /* keep last-hovered day */ }}>
                  {ITINERARY.map((d, i) => {
                    const active = activeDay === i;
                    const open = openDay === i;
                    return (
                      <li key={d.day} className={`lxjt2-day ${active ? 'is-active' : ''} ${open ? 'is-open' : ''}`}>
                        <button
                          type="button"
                          className="lxjt2-day__btn"
                          onMouseEnter={() => setActiveDay(i)}
                          onFocus={() => setActiveDay(i)}
                          onClick={() => { setActiveDay(i); setOpenDay((p) => (p === i ? -1 : i)); }}
                          aria-expanded={open}
                        >
                          <span className="lxjt2-day__rail" aria-hidden="true">
                            <span className="lxjt2-day__node">{String(i + 1).padStart(2, '0')}</span>
                          </span>
                          <span className="lxjt2-day__content">
                            <span className="lxjt2-day__kicker">{d.day} <span className="lxjt2-day__place"><MapPin size={11} /> {d.place}</span></span>
                            <span className="lxjt2-day__title">{d.title}</span>
                            {/* desktop shows this on the picture; mobile expands it as an accordion */}
                            <span className="lxjt2-day__body"><span className="lxjt2-day__bodyin">{d.body}</span></span>
                          </span>
                          <span className="lxjt2-day__go" aria-hidden="true"><ArrowRight size={16} /></span>
                          <span className="lxjt2-day__chev" aria-hidden="true"><ChevronDown size={18} /></span>
                        </button>
                      </li>
                    );
                  })}
                </ol>

                {/* RIGHT — sticky picture that follows the active day */}
                <aside className="lxjt2-media" aria-live="polite">
                  <div className="lxjt2-media__sticky">
                    <div className="lxjt2-media__frame">
                      {ITINERARY.map((d, i) => (
                        <div
                          key={d.day}
                          className={`lxjt2-media__img ${activeDay === i ? 'is-on' : ''}`}
                          style={{ backgroundImage: `url(${sizedUnsplash(d.img, 1100)})` }}
                          role="img"
                          aria-label={d.cap}
                          aria-hidden={activeDay !== i}
                        />
                      ))}
                      <div className="lxjt2-media__veil" aria-hidden="true" />
                      <span className="lxjt2-media__count">{String(activeDay + 1).padStart(2, '0')} <i>/ {String(ITINERARY.length).padStart(2, '0')}</i></span>
                      <div className="lxjt2-media__meta" key={activeDay}>
                        <span className="lxjt2-media__daylbl">{day.day} · {day.place}</span>
                        <h3>{day.title}</h3>
                        <p className="lxjt2-media__body">{day.body}</p>
                        <span className="lxjt2-media__cap"><MapPin size={13} /> {day.cap}</span>
                      </div>
                    </div>
                    <div className="lxjt2-media__dots" role="tablist" aria-label="Jump to a day">
                      {ITINERARY.map((d, i) => (
                        <button
                          key={d.day}
                          type="button"
                          role="tab"
                          aria-selected={activeDay === i}
                          aria-label={`${d.day}: ${d.title}`}
                          className={`lxjt2-media__dot ${activeDay === i ? 'is-on' : ''}`}
                          onClick={() => setActiveDay(i)}
                        />
                      ))}
                    </div>
                  </div>
                </aside>
              </div>

              {/* MOBILE ONLY — the journey in pictures, as a horizontal city carousel */}
              <div className="lxjt2-rail" role="group" aria-label="The journey in pictures">
                {ITINERARY.map((d) => (
                  <div key={d.day} className="lxjt2-railcard" style={{ backgroundImage: `url(${sizedUnsplash(d.img, 640)})` }}>
                    <span className="lxjt2-railcard__day">{d.day}</span>
                    <span className="lxjt2-railcard__city"><MapPin size={13} /> {d.place}</span>
                  </div>
                ))}
              </div>

              <p className="lxjt2-note lx2i-reveal"><Check size={15} strokeWidth={2.4} /> Everything above is included in your price — stays, meals, guiding and transfers.</p>
            </div>
          </section>

          {/* ============ INCLUDED / NOT INCLUDED ============ */}
          <section className="lxjt-incl" id="included">
            <div className="lx2i-container lxjt-incl__grid">
              <div className="lxjt-incl__col lx2i-reveal">
                <span className="lx2i-eyebrow">// INCLUDED, PRIVATELY</span>
                <h3 className="lxjt-incl__h">Everything taken care of</h3>
                <ul className="lxjt-incl__list">
                  {INCLUDED.map((x) => (
                    <li key={x}><span className="lxjt-incl__tick"><Check size={13} strokeWidth={2.6} /></span>{x}</li>
                  ))}
                </ul>
              </div>
              <div className="lxjt-incl__col lxjt-incl__col--muted lx2i-reveal" style={{ '--d': '.08s' }}>
                <span className="lx2i-eyebrow">// GOOD TO KNOW</span>
                <h3 className="lxjt-incl__h">What&rsquo;s not included</h3>
                <ul className="lxjt-incl__list lxjt-incl__list--exc">
                  {NOT_INCLUDED.map((x) => (
                    <li key={x}><span className="lxjt-incl__dash" aria-hidden="true">&ndash;</span>{x}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* ============ DATES & PRICES / BOOK ============ */}
          <section className="lxjt-book" id="dates">
            <div className="lx2i-container lxjt-book__grid">
              <div className="lxjt-book__intro lx2i-reveal">
                <span className="lx2i-eyebrow">// RESERVE YOUR DATES</span>
                <h2 className="lx2i-h2">Reserve your <strong>seats</strong></h2>
                <p className="lxjt-lead">Pick one of our set 2026 departures and confirm your seats with a 20% deposit &mdash; the balance comes later.</p>
                <ul className="lxjt-book__perks">
                  <li><Check size={16} strokeWidth={2.4} /> Expert-guided from the moment you land to the day you fly home</li>
                  <li><Check size={16} strokeWidth={2.4} /> All-inclusive: flights, visa, insurance, stays, meals and transfers</li>
                  <li><Check size={16} strokeWidth={2.4} /> A small group of no more than 20 like-minded travellers</li>
                </ul>
                <div className="lxjt-confidence">
                  <ShieldCheck size={24} strokeWidth={1.7} />
                  <div>
                    <strong>Book with confidence</strong>
                    <p>Encrypted checkout. Your 20% deposit is protected, and you can talk to a curator first &mdash; free.</p>
                  </div>
                </div>
                <ul className="lxjt-safety" aria-label="How your booking is protected">
                  {SAFETY.map(({ icon: Icon, label, note }) => (
                    <li key={label} className="lxjt-safety__item">
                      <span className="lxjt-safety__ic"><Icon size={17} strokeWidth={1.8} /></span>
                      <span className="lxjt-safety__txt"><strong>{label}</strong><small>{note}</small></span>
                    </li>
                  ))}
                </ul>
              </div>

              <aside className="lxjt-card lx2i-reveal" style={{ '--d': '.08s' }}>
                <div className="lxjt-card__top">
                  <span className="lxjt-card__frm">from <strong>{inr(PRICE)}</strong> <small>pp</small></span>
                  <span className="lxjt-card__live"><span className="lxjt-card__dot" aria-hidden="true" /> Live availability</span>
                </div>

                <div className="lxjt-card__fields">
                  <label className="lxjt-fld lxjt-fld--dep">
                    <span className="lxjt-fld__lbl">Departure</span>
                    <div className="lxjt-select">
                      <select value={selectedDep} onChange={(e) => setSelectedDep(Number(e.target.value))} aria-label="Departure date">
                        {DEPARTURES.map((d, i) => <option key={d.date} value={i}>{d.date}</option>)}
                      </select>
                      <ChevronDown size={16} aria-hidden="true" />
                    </div>
                    <small className={`lxjt-fld__seats ${DEPARTURES[selectedDep].tight ? 'is-tight' : ''}`}>{DEPARTURES[selectedDep].seats}</small>
                  </label>

                  <label className="lxjt-fld lxjt-fld--trav">
                    <span className="lxjt-fld__lbl">Travellers</span>
                    <div className="lxjt-stepper">
                      <button type="button" aria-label="Fewer travellers" onClick={() => setTravellers((n) => Math.max(1, n - 1))} disabled={travellers <= 1}><Minus size={15} /></button>
                      <span className="lxjt-stepper__val">{travellers}</span>
                      <button type="button" aria-label="More travellers" onClick={() => setTravellers((n) => Math.min(20, n + 1))} disabled={travellers >= 20}><Plus size={15} /></button>
                    </div>
                  </label>
                </div>

                <div className="lxjt-pay" role="radiogroup" aria-label="Payment option">
                  <button type="button" role="radio" aria-checked={payMode === 'deposit'} className={`lxjt-pay__opt ${payMode === 'deposit' ? 'is-on' : ''}`} onClick={() => setPayMode('deposit')}>
                    <span className="lxjt-pay__title">20% deposit</span>
                    <span className="lxjt-pay__amt">{inr(depositTotal)}</span>
                  </button>
                  <button type="button" role="radio" aria-checked={payMode === 'full'} className={`lxjt-pay__opt ${payMode === 'full' ? 'is-on' : ''}`} onClick={() => setPayMode('full')}>
                    <span className="lxjt-pay__title">Pay in full</span>
                    <span className="lxjt-pay__amt">{inr(total)}</span>
                  </button>
                </div>

                <div className="lxjt-due">
                  <div className="lxjt-due__row"><span>Due today</span><strong>{inr(dueToday)}</strong></div>
                  <span className="lxjt-due__sub">{payMode === 'deposit' ? `Balance ${inr(balance)} due 45 days before travel` : `${travellers} × ${inr(PRICE)}, paid in full`}</span>
                </div>

                <button type="button" className="lx2i-btn lx2i-btn--primary lx2i-btn--lg lxjt-card__go">
                  Reserve {travellers === 1 ? 'my seat' : `${travellers} seats`} <ArrowRight size={17} />
                </button>
                <p className="lxjt-card__secure"><Lock size={13} /> Secure encrypted checkout · deposit protected</p>
                <a href={PHONE_TEL} className="lxjt-card__talk">Prefer to talk? Call a curator, free <ArrowRight size={14} /></a>
              </aside>
            </div>
          </section>

          {/* ============ BOOKING TERMS (summary + full in a modal) ============ */}
          <section className="lxjt-terms" id="terms">
            <div className="lx2i-container">
              <div className="lxjt-head lx2i-reveal">
                <span className="lx2i-eyebrow">// BEFORE YOU BOOK</span>
                <h2 className="lx2i-h2">Booking <strong>terms</strong></h2>
                <p className="lxjt-lead">The essentials, in plain words &mdash; the full terms &amp; conditions are one tap away.</p>
              </div>
              <div className="lxjt-terms__grid lx2i-reveal">
                {TERMS_SUMMARY.map(({ icon: Icon, title, text }) => (
                  <div key={title} className="lxjt-term">
                    <span className="lxjt-term__ic"><Icon size={20} strokeWidth={1.7} /></span>
                    <div className="lxjt-term__txt">
                      <strong>{title}</strong>
                      <p>{text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" className="lx2i-btn lx2i-btn--outline lxjt-terms__more" onClick={() => setTermsOpen(true)}>
                Read full booking terms &amp; conditions <ArrowRight size={15} />
              </button>
            </div>
          </section>

          {/* ============ REVIEWS (photo collage + quote, one at a time) ============ */}
          <section className="lxjt-review" id="reviews">
            <div className="lx2i-container">
              <div className="lxjt-head lxjt-head--center lxjt-head--light lx2i-reveal">
                <span className="lx2i-eyebrow lx2i-eyebrow--light">// WHAT TRAVELLERS SAY</span>
                <h2 className="lx2i-h2 lxjt-review__h">Real journeys, captured by <strong>our travellers</strong></h2>
                <p className="lxjt-lead lxjt-lead--light">The moments that made each trip &mdash; straight from the families and groups who lived them.</p>
              </div>

              <div className="lxjt-review__stage lx2i-reveal">
                <div className="lxjt-review__photos" key={`p-${reviewIdx}`}>
                  <div className="lxjt-review__photo lxjt-review__photo--lead" style={{ backgroundImage: `url(${sizedUnsplash(review.ids[0], 800)})` }} role="img" aria-label={`${review.name} — ${review.trip}`} />
                  <div className="lxjt-review__col">
                    {review.ids.slice(1, 3).map((id, k) => (
                      <div key={id + k} className="lxjt-review__photo" style={{ backgroundImage: `url(${sizedUnsplash(id, 500)})` }} role="img" aria-label={`${review.name} — travel photo`} />
                    ))}
                  </div>
                </div>

                <figure className="lxjt-review__body lx2i-glass" key={`q-${reviewIdx}`}>
                  <Quote size={36} className="lxjt-review__q" aria-hidden="true" />
                  <div className="lx2i-stars lx2i-stars--lg" aria-label={`${review.rating} out of 5 stars`}>{[...Array(review.rating)].map((_, i) => <Star key={i} size={17} fill="currentColor" />)}</div>
                  <blockquote>{review.text}</blockquote>
                  <figcaption className="lxjt-review__who">
                    <strong>{review.name}{review.age && <span className="lxjt-review__age"> · {review.age}</span>}</strong>
                    <span>{review.trip}</span>
                  </figcaption>
                </figure>
              </div>

              <div className="lxjt-review__controls">
                <button type="button" className="lxjt-review__arrow" onClick={prevReview} aria-label="Previous review"><ArrowLeft size={18} /></button>
                <div className="lxjt-review__dots" role="tablist" aria-label="Choose a review">
                  {REVIEWS.map((r, i) => (
                    <button key={r.name} type="button" role="tab" aria-selected={i === reviewIdx} aria-label={`Review ${i + 1}: ${r.name}`} className={`lxjt-review__dot ${i === reviewIdx ? 'is-on' : ''}`} onClick={() => setReviewIdx(i)} />
                  ))}
                </div>
                <span className="lxjt-review__count">{String(reviewIdx + 1).padStart(2, '0')} / {String(REVIEWS.length).padStart(2, '0')}</span>
                <button type="button" className="lxjt-review__arrow" onClick={nextReview} aria-label="Next review"><ArrowRight size={18} /></button>
              </div>
            </div>
          </section>

          {/* ============ PEOPLE ALSO VIEW ============ */}
          <section className="lxjt-section lxjt-similar">
            <div className="lx2i-container">
              <div className="lxjt-head lxjt-head--row lx2i-reveal">
                <div>
                  <span className="lx2i-eyebrow">// TRAVELLERS ALSO CONSIDERED</span>
                  <h2 className="lx2i-h2">People also <strong>view</strong></h2>
                </div>
                <a href={`${HOME}#curated`} className="lxjt-textlink">Browse all journeys <ArrowUpRight size={16} /></a>
              </div>
              <div className="lxjt-sim__grid">
                {SIMILAR.map((s, i) => (
                  <a key={s.title} href={`${HOME}#curated`} className="lxjt-sim lx2i-reveal" style={{ '--d': `${(i % 4) * 0.06}s` }}>
                    <div className="lxjt-sim__img" style={{ backgroundImage: `url(${sizedUnsplash(s.image, 700)})` }}>
                      <span className="lxjt-sim__region"><MapPin size={12} /> {s.region}</span>
                      <span className="lxjt-sim__season">{s.season}</span>
                    </div>
                    <div className="lxjt-sim__body">
                      <h3>{s.title}</h3>
                      <div className="lxjt-sim__meta"><Clock size={12} /> {s.nights}<span className="lxjt-sim__dot">&middot;</span><Users size={12} /> Small group</div>
                      <div className="lxjt-sim__tags">
                        {s.tags.map((t) => <span key={t} className="lxjt-sim__tag">{t}</span>)}
                      </div>
                      <div className="lxjt-sim__foot">
                        <span className="lxjt-sim__price">from {s.priceFrom} <small>pp</small></span>
                        <span className="lxjt-sim__go">View <ArrowRight size={15} /></span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* ============ FINAL CTA (reuses homepage lx2i-cta) ============ */}
          <section className="lx2i-cta">
            <div className="lx2i-cta__bg" style={{ backgroundImage: `url(${sizedUnsplash('1522383225653-ed111181a951', 1800)})` }} />
            <div className="lx2i-cta__veil" />
            <div className="lx2i-container lx2i-cta__inner lx2i-reveal">
              <span className="lx2i-eyebrow lx2i-eyebrow--light">BEGIN YOUR JAPAN JOURNEY</span>
              <h2 className="lx2i-cta__title">Twelve days in Japan,<br /><strong>every detail already handled.</strong></h2>
              <p className="lx2i-cta__sub">Set 2026 departures, a small group and an expert guide &mdash; and a curator who handles the visas, the ryokan, the rail and the reservations, so you can simply be there.</p>
              <div className="lx2i-cta__actions">
                <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="lx2i-btn lx2i-btn--secondary lx2i-btn--lg"><MessageCircle size={17} /> WhatsApp us</a>
                <button type="button" onClick={openCallback} className="lx2i-btn lx2i-btn--glass lx2i-btn--lg"><PhoneCall size={16} /> Schedule a callback</button>
              </div>
              <p className="lx2i-cta__hours">Travel experts available 9am–9pm IST, every day</p>
            </div>
          </section>

          {/* ============ FOOTER (reuses homepage lx2i-footer) ============ */}
          <footer className="lx2i-footer">
            <div className="lx2i-container lx2i-footer__top">
              <div className="lx2i-footer__brand">
                <img src="/cox-logo-new.png" alt="Cox & Kings — Est. 1758" />
                <p>The world&rsquo;s most experienced travel company.<br />Trusted by generations since 1758.</p>
                <div className="lx2i-footer__social">
                  <a href="#" aria-label="Instagram"><Instagram size={17} /></a>
                  <a href="#" aria-label="Facebook"><Facebook size={17} /></a>
                  <a href="#" aria-label="YouTube"><Youtube size={17} /></a>
                  <a href="#" aria-label="LinkedIn"><Linkedin size={17} /></a>
                </div>
              </div>
              <div className="lx2i-footer__cols">
                <div>
                  <span className="lx2i-eyebrow">EXPLORE</span>
                  <Link to={`${HOME}#destinations`}>Destinations</Link>
                  <Link to={`${HOME}#curated`}>Curated Journeys</Link>
                  <Link to={`${HOME}#heritage`}>Our Heritage</Link>
                  <a href="#reviews" onClick={navClick('#reviews')}>Reviews</a>
                </div>
                <div>
                  <span className="lx2i-eyebrow">COMPANY</span>
                  <a href={PHONE_TEL}>Speak to an Expert</a>
                  <a href="#">About Us</a>
                  <a href="#">Press Room</a>
                  <a href="#">Careers</a>
                </div>
                <div>
                  <span className="lx2i-eyebrow">SPEAK TO A HUMAN</span>
                  <a href={PHONE_TEL}><Phone size={13} /> {PHONE_DISPLAY}</a>
                  <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"><MessageCircle size={13} /> Chat on WhatsApp</a>
                  <a href="#" onClick={openCallback}><PhoneCall size={13} /> Request a callback</a>
                  <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                </div>
              </div>
            </div>
            <div className="lx2i-container lx2i-footer__bottom">
              <p>© 2026 Cox &amp; Kings. Est. 1758.</p>
              <div className="lx2i-footer__legal"><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Cookies</a></div>
            </div>
          </footer>
        </main>

        {/* ============ MOBILE THUMB-REACH BAR — talk to a human ============ */}
        <div className="lxjt-thumbbar">
          <div className="lxjt-thumbbar__nudge">
            <small>Got questions about Japan?</small>
            <strong>A specialist can help — free</strong>
          </div>
          <button type="button" className="lxjt-thumbbar__chat" onClick={() => setChatOpen(true)}>
            <MessageCircle size={18} /> Chat with a specialist
          </button>
          <a href={PHONE_TEL} className="lxjt-thumbbar__ico" aria-label="Call a specialist"><Phone size={20} /></a>
        </div>

        {/* ============ FLOATING AI BUTTON (desktop) ============ */}
        <button className={`lx2i-aifab ${chatOpen ? 'is-hidden' : ''}`} aria-label="Open Enaya, the AI travel assistant" onClick={() => setChatOpen(true)}>
          <Sparkles size={20} /><span>Ask Enaya</span>
        </button>

        {/* ============ FULL BOOKING TERMS MODAL ============ */}
        {termsOpen && (
          <div className="lxjt-tc" role="dialog" aria-modal="true" aria-label="Booking terms and conditions">
            <div className="lxjt-tc__scrim" onClick={() => setTermsOpen(false)} />
            <div className="lxjt-tc__panel">
              <div className="lxjt-tc__head">
                <div>
                  <span className="lx2i-eyebrow">TERMS &amp; CONDITIONS</span>
                  <h3 className="lxjt-tc__title">Booking terms — Splendours of Japan</h3>
                </div>
                <button className="lxjt-tc__close" aria-label="Close" onClick={() => setTermsOpen(false)}><X size={20} /></button>
              </div>
              <div className="lxjt-tc__body">
                {TERMS_FULL.map((sec) => (
                  <div key={sec.heading} className="lxjt-tc__sec">
                    <h4>{sec.heading}</h4>
                    <ul>
                      {sec.points.map((p) => <li key={p}><Check size={14} strokeWidth={2.4} /> {p}</li>)}
                    </ul>
                  </div>
                ))}
                <p className="lxjt-tc__note">These terms summarise the Cox &amp; Kings booking conditions for this escorted departure. Full contractual terms are provided with your booking confirmation.</p>
              </div>
              <div className="lxjt-tc__foot">
                <button type="button" className="lx2i-btn lx2i-btn--primary" onClick={() => setTermsOpen(false)}>Got it</button>
                <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="lx2i-btn lx2i-btn--outline"><MessageCircle size={15} /> Ask a question</a>
              </div>
            </div>
          </div>
        )}

        {/* ============ REQUEST A CALLBACK MODAL ============ */}
        {callbackOpen && (
          <div className="lx2i-cb" role="dialog" aria-modal="true" aria-label="Request a callback">
            <div className="lx2i-cb__scrim" onClick={() => setCallbackOpen(false)} />
            <div className="lx2i-cb__panel lx2i-glass">
              <button className="lx2i-cb__close" aria-label="Close" onClick={() => setCallbackOpen(false)}><X size={18} /></button>
              {callbackSent ? (
                <div className="lx2i-cb__done">
                  <span className="lx2i-cb__doneic"><CheckCircle2 size={34} strokeWidth={1.5} /></span>
                  <h3>We&rsquo;ll call you shortly</h3>
                  <p>A travel expert will be in touch &mdash; usually within a few hours, between 9am and 9pm IST. Prefer to talk now?</p>
                  <div className="lx2i-cb__nowrow">
                    <a href={PHONE_TEL} className="lx2i-btn lx2i-btn--primary"><Phone size={14} /> {PHONE_DISPLAY}</a>
                    <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="lx2i-btn lx2i-btn--outline"><MessageCircle size={14} /> WhatsApp</a>
                  </div>
                </div>
              ) : (
                <>
                  <span className="lx2i-eyebrow">SPEAK TO A HUMAN</span>
                  <h3 className="lx2i-cb__title">Request a callback</h3>
                  <p className="lx2i-cb__sub">Leave your number and a real travel designer &mdash; not a call centre &mdash; will call you back. No obligation.</p>
                  <form className="lx2i-cb__form" onSubmit={(e) => { e.preventDefault(); setCallbackSent(true); }}>
                    <label className="lx2i-cb__field"><span>Your name</span><input type="text" name="name" autoComplete="name" placeholder="e.g. Priya Sharma" required /></label>
                    <label className="lx2i-cb__field"><span>Phone number</span><input type="tel" name="phone" autoComplete="tel" inputMode="tel" placeholder="+91  XXXXX XXXXX" required /></label>
                    <label className="lx2i-cb__field"><span>Best time to call</span>
                      <select name="time" defaultValue="">
                        <option value="" disabled hidden>Choose a time</option>
                        <option>Morning (9am–12pm)</option>
                        <option>Afternoon (12pm–5pm)</option>
                        <option>Evening (5pm–9pm)</option>
                        <option>Anytime is fine</option>
                      </select>
                    </label>
                    <button type="submit" className="lx2i-btn lx2i-btn--primary lx2i-btn--lg lx2i-cb__submit"><PhoneCall size={15} /> Request my callback</button>
                    <p className="lx2i-cb__or">Or call now &mdash; <a href={PHONE_TEL}>{PHONE_DISPLAY}</a></p>
                  </form>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* AI chat (Enaya) — rendered OUTSIDE .lx2i so scoped styles can't leak in */}
      <ChatBot open={chatOpen} onOpenChange={setChatOpen} hideFab name="Enaya" />
    </>
  );
}
