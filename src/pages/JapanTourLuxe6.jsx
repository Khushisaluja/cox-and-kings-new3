import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Menu, X, ArrowRight, ArrowLeft, ArrowUpRight, ChevronDown,
  Star, MapPin, Calendar, Users, Check, Quote, Flame,
  ShieldCheck, Phone, MessageCircle, PhoneCall, Sparkles, Clock,
  Wallet, Repeat, Stamp, CheckCircle2, Instagram, Facebook, Youtube, Linkedin,
  Hotel, Utensils, TrainFront, Compass, TrendingUp, Timer, Lock,
} from 'lucide-react';
import ChatBot from '../components/ChatBot';
import './Home2026.css';
import './Home2026Improved.css';
import './Luxe2Improved.css';
import './JapanTourLuxe.css';
import './JapanTourLuxe2.css';
import './JapanTourLuxe3.css';
import './JapanTourLuxe4.css';
import './JapanTourLuxe5.css';
import './JapanTourLuxe6.css';

/* ============================================================
   Cox & Kings — "Essence Japan with Hakone" tour-detail page,
   VARIANT 6. Route: /tour-detail-japan-6.
   A CAMPAIGN LANDING page for paid-ad traffic. Built from VARIANT 5
   but deliberately pared back: the deep-detail sections (day-by-day
   sticky itinerary, included/excluded, full policies + modal, "people
   also view") are removed. What remains is tuned for a single job —
   collect the lead. So: a lead form sits in the hero above the fold,
   an urgency/scarcity strip runs beneath it, the departures carry loud
   "seats left" tags that jump to the form, and a second lead block
   closes the page. Less to read, more reasons to enquire now.
   ============================================================ */

const sizedUnsplash = (id, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

/* ---------- Human contact (matches the homepage) ---------- */
const PHONE_DISPLAY = '+91 85560 01700';
const PHONE_TEL = 'tel:+918556001700';
const WHATSAPP = 'https://wa.me/918556001700?text=Hi%20Cox%20%26%20Kings%2C%20I%27d%20like%20to%20plan%20the%20Essence%20Japan%20with%20Hakone%20journey.';
const EMAIL = 'holidays@coxandkings.com';
const HOME = '/luxe2-improved';

/* ---------- Tour data (Essence Japan with Hakone) ---------- */
const PRICE = 295000;
const HERO = {
  kicker: 'Essence Japan with Hakone · Escorted small-group tour',
  title: (
    <>Japan, as the <em className="lxjt-hero__accent">cherry blossoms</em> fall.</>
  ),
  lead:
    'Eight unhurried days — Tokyo, Mount Fuji, a hot-spring ryokan night and Kyoto’s temple gardens — in a small group, led end-to-end by an expert. Everything handled; you simply turn up. 🇯🇵',
  image: '1522383225653-ed111181a951',
  facts: [
    { icon: Calendar, label: '8 Days · 7 Nights' },
    { icon: MapPin, label: '5 Cities' },
    { icon: Users, label: 'Small group' },
    { icon: Compass, label: 'Guided throughout' },
  ],
};

/* Scannable "what's in the price" strip — the key inclusions, at a glance. */
const KEY_INCLUSIONS = [
  { icon: Hotel, label: '7 nights incl. a ryokan' },
  { icon: Utensils, label: 'Breakfast daily + meals' },
  { icon: Compass, label: 'English-speaking guide' },
  { icon: TrainFront, label: 'Coach & transfers' },
  { icon: MapPin, label: 'All entrance fees' },
  { icon: ShieldCheck, label: 'Visa & insurance' },
];
const HIGHLIGHTS = [
  'Mount Fuji’s 5th Station and a Lake Kawaguchiko boat ride',
  'A night in a traditional onsen ryokan',
  'Fushimi Inari’s vermilion torii and the Golden Pavilion',
  'Nara’s Tōdai-ji and its famously friendly deer',
];

const ROUTE = [
  { nights: '2 nights', city: 'Tokyo', note: 'Temples, shrines and the electric crossings — plus an evening walk through neon-lit Shinjuku.', image: '1480796927426-f609979314bd' },
  { nights: '1 night', city: 'Odawara', note: 'Kamakura’s Great Buddha and bamboo groves, Enoshima Island, and a hilltop castle.', image: '1528360983277-13d401cdc186' },
  { nights: '1 night', city: 'Kawaguchiko', note: 'Mount Fuji up close, hot-spring valleys and a night in a traditional onsen ryokan.', image: '1490806843957-31f4c9a91c65' },
  { nights: '2 nights', city: 'Kyoto', note: 'Arashiyama, Fushimi Inari and the Golden Pavilion in Japan’s old capital.', image: '1493976040374-85c8e12f0c0e' },
  { nights: '1 night', city: 'Osaka', note: 'A day in Nara among the deer en route, then Dōtonbori’s neon and street food.', image: '1590559899731-a382839e5549' },
];

/* Departures — upcoming, future-facing so the scarcity reads true.
   `left` drives the scarcity pill; `tight` flags the near-sold ones. */
const DEPARTURES = [
  { date: '17 October 2026', season: 'Autumn colours', left: 4, tight: true },
  { date: '07 November 2026', season: 'Autumn colours', left: 9, tight: false },
  { date: '20 March 2027', season: 'Cherry blossom', left: 6, tight: true },
  { date: '03 April 2027', season: 'Cherry blossom', left: 12, tight: false },
];
const PRICE_RISE_DATE = '31 August 2026';
const ENQUIRED_THIS_WEEK = 27;

/* Photo-first traveller reviews (trimmed to three for a campaign page). */
const REVIEWS = [
  { name: 'The Menon Family', age: '3 generations', trip: 'Japan · Cherry Blossom', rating: 5,
    text: 'Grandparents, parents and two kids — all looked after. The pace was gentle, the ryokan night unforgettable, and the children still talk about the bullet train.',
    ids: ['1758272959663-b30513083206', '1715745218436-5a583702447a', '1580825175616-77f8df1bb507'] },
  { name: 'Aditi & Mohit', age: '', trip: 'Japan · Group · 2025', rating: 5,
    text: 'Every transfer, every meal, flawless. The blossom timing was perfect and the small group felt like friends by the end. We simply turned up and were cared for.',
    ids: ['1630001722538-a9a540da549b', '1529156069898-49953e39b3ac'] },
  { name: 'Rahul & friends', age: 'Group of 6', trip: 'Japan · Spring 2025', rating: 5,
    text: 'Six of us, one seamless trip. The Dotonbori food walk, the onsen ryokan, temples at dawn — our guide made every day effortless.',
    ids: ['1639979511572-ff346bc5b3b7', '1667029839636-af119b059c49'] },
];

const TRUST = [
  { icon: Wallet, label: 'Low deposit', note: 'Reserve from 20% today' },
  { icon: Repeat, label: 'Free changes', note: 'Up to 45 days before travel' },
  { icon: Stamp, label: 'Visa support', note: 'Paperwork handled for you' },
  { icon: ShieldCheck, label: 'Financially protected', note: 'Your money is held securely' },
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

/* ------------------------------------------------------------
   The lead form — the page's single job. Reused in the hero and
   in the closing block. Captures name, phone, departure and party
   size, then swaps to a reassuring "we'll be in touch" state.
   ------------------------------------------------------------ */
function LeadForm({ id, variant = 'card', defaultDep = 0 }) {
  const [sent, setSent] = useState(false);
  const [dep, setDep] = useState(defaultDep);

  useEffect(() => { setDep(defaultDep); }, [defaultDep]);

  if (sent) {
    return (
      <div className={`lxjt6-form lxjt6-form--${variant} lxjt6-form--done`}>
        <span className="lxjt6-form__doneic"><CheckCircle2 size={34} strokeWidth={1.5} /></span>
        <h3>Thank you — your seats are being held</h3>
        <p>A Japan specialist will call you shortly with the full itinerary, live availability and your exact price. Prefer to talk now?</p>
        <div className="lxjt6-form__nowrow">
          <a href={PHONE_TEL} className="lx2i-btn lx2i-btn--primary"><Phone size={14} /> {PHONE_DISPLAY}</a>
          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="lx2i-btn lx2i-btn--outline"><MessageCircle size={14} /> WhatsApp</a>
        </div>
      </div>
    );
  }

  return (
    <form
      id={id}
      className={`lxjt6-form lxjt6-form--${variant}`}
      onSubmit={(e) => { e.preventDefault(); setSent(true); }}
    >
      <div className="lxjt6-form__head">
        <div className="lxjt6-form__pretitle">
          <span className="lxjt6-form__from">from <strong>{inr(PRICE)}</strong> <small>pp</small></span>
          <span className="lxjt6-form__live"><span className="lxjt6-form__livedot" aria-hidden="true" /> {DEPARTURES[dep].left} seats left</span>
        </div>
        <h3 className="lxjt6-form__title">Get the itinerary &amp; live prices</h3>
        <p className="lxjt6-form__sub">Leave your details — a Japan specialist calls you back, free. No obligation.</p>
      </div>

      <label className="lxjt6-fld"><span>Your name</span>
        <input type="text" name="name" autoComplete="name" placeholder="e.g. Priya Sharma" required />
      </label>
      <label className="lxjt6-fld"><span>Phone number</span>
        <input type="tel" name="phone" autoComplete="tel" inputMode="tel" placeholder="+91  XXXXX XXXXX" required />
      </label>
      <label className="lxjt6-fld"><span>Email <small>(optional)</small></span>
        <input type="email" name="email" autoComplete="email" placeholder="you@email.com" />
      </label>
      <div className="lxjt6-fld2">
        <label className="lxjt6-fld"><span>Departure</span>
          <div className="lxjt6-select">
            <select value={dep} onChange={(e) => setDep(Number(e.target.value))} aria-label="Departure date">
              {DEPARTURES.map((d, i) => <option key={d.date} value={i}>{d.date}</option>)}
            </select>
            <ChevronDown size={16} aria-hidden="true" />
          </div>
        </label>
        <label className="lxjt6-fld"><span>Travellers</span>
          <div className="lxjt6-select">
            <select name="travellers" defaultValue="2" aria-label="Number of travellers">
              {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n}{n === 6 ? '+' : ''}</option>)}
            </select>
            <ChevronDown size={16} aria-hidden="true" />
          </div>
        </label>
      </div>

      <button type="submit" className="lx2i-btn lx2i-btn--primary lx2i-btn--lg lxjt6-form__go">
        Get my prices &amp; dates <ArrowRight size={17} />
      </button>
      <p className="lxjt6-form__secure"><Lock size={13} /> Your details are safe. No spam, ever.</p>
    </form>
  );
}

export default function JapanTourLuxe6() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [callbackOpen, setCallbackOpen] = useState(false);
  const [callbackSent, setCallbackSent] = useState(false);
  const [reviewIdx, setReviewIdx] = useState(0);
  const [pickedDep, setPickedDep] = useState(0);   // a departure "Enquire" pre-selects the form

  useReveal();
  const review = REVIEWS[reviewIdx];
  const nextReview = () => setReviewIdx((i) => (i + 1) % REVIEWS.length);
  const prevReview = () => setReviewIdx((i) => (i - 1 + REVIEWS.length) % REVIEWS.length);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const lock = menuOpen || callbackOpen;
    document.body.style.overflow = lock ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen, callbackOpen]);

  useEffect(() => {
    if (!callbackOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setCallbackOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [callbackOpen]);

  const navClick = useCallback((href) => (e) => {
    setMenuOpen(false);
    if (href.startsWith('#')) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // A departure's "Enquire" pre-selects it, then scrolls to the hero form.
  const enquireDep = useCallback((i) => (e) => {
    e.preventDefault();
    setPickedDep(i);
    const el = document.getElementById('lead');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  const openCallback = useCallback((e) => { if (e) e.preventDefault(); setMenuOpen(false); setCallbackSent(false); setCallbackOpen(true); }, []);

  return (
    <>
      <div className="lx2i lxjt lxjt2 lxjt3 lxjt4 lxjt5 lxjt6">
        <div className="lx2i-grain" aria-hidden="true" />
        <a className="lxjt-skip" href="#lead">Skip to enquiry</a>

        {/* ============ SLIM HEADER — no deep nav, just brand + contact ============ */}
        <div className="h26">
          <header className={`h26-nav${scrolled ? ' is-solid' : ''}`}>
            <Link to={HOME} className="h26-brand" aria-label="Cox & Kings — home">
              <img src="/cox-logo-new.png" alt="Cox & Kings" />
            </Link>
            <div className="lxjt6-navtrust">
              <span className="lx2i-stars">{[...Array(5)].map((_, i) => <Star key={i} size={13} fill="currentColor" />)}</span>
              <strong>4.9</strong><span>· 640 reviews</span>
              <span className="lxjt6-navtrust__sep" aria-hidden="true" />
              <span className="lxjt6-navtrust__est">Trusted since 1758</span>
            </div>
            <div className="h26-nav-cta">
              <a href={PHONE_TEL} className="h26-phone">
                <Phone size={15} /> <span>{PHONE_DISPLAY}</span>
              </a>
              <a href="#lead" onClick={navClick('#lead')} className="h26-btn h26-btn-pill">Enquire now</a>
              <button className="h26-burger" aria-label="Menu" onClick={() => setMenuOpen(true)}>
                <Menu size={22} />
              </button>
            </div>
          </header>

          {/* Mobile slide-in menu — pared to the essentials */}
          <div className={`h26-menu${menuOpen ? ' is-open' : ''}`} aria-hidden={!menuOpen}>
            <div className="h26-menu-scrim" onClick={() => setMenuOpen(false)} />
            <div className="h26-menu-panel" role="dialog" aria-modal="true" aria-label="Menu">
              <div className="h26-menu-top">
                <button className="h26-menu-close" aria-label="Close menu" onClick={() => setMenuOpen(false)}><X size={20} /></button>
                <img className="h26-menu-logo" src="/cox-logo-new.png" alt="Cox & Kings — Est. 1758" />
              </div>
              <nav className="h26-menu-primary" aria-label="Mobile primary">
                {[
                  { label: 'The trip', href: '#highlights' },
                  { label: 'Your route', href: '#route' },
                  { label: 'Dates & seats', href: '#dates' },
                  { label: 'Reviews', href: '#reviews' },
                ].map((n) => (
                  <a key={n.label} href={n.href} onClick={navClick(n.href)}>
                    {n.label}
                    <span className="h26-menu-chev"><ArrowRight size={16} /></span>
                  </a>
                ))}
              </nav>
              <a href="#lead" className="h26-btn h26-btn-pill h26-menu-cta" onClick={navClick('#lead')}>
                <ArrowRight size={16} /> Get prices & dates
              </a>
              <div className="h26-menu-divider" />
              <div className="h26-menu-secondary">
                <a href={PHONE_TEL}><Phone size={13} /> {PHONE_DISPLAY}</a>
                <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"><MessageCircle size={13} /> WhatsApp us</a>
              </div>
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

        <main id="main">
          {/* ============ HERO — content left, lead form right ============ */}
          <section className="lxjt-hero lxjt6-hero">
            <div className="lxjt-hero__bg" style={{ backgroundImage: `url(${sizedUnsplash(HERO.image, 1900)})` }} aria-hidden="true" />
            <div className="lxjt-hero__veil" aria-hidden="true" />
            <div className="lx2i-container lxjt6-hero__inner">
              <div className="lxjt6-hero__content lx2i-fade" style={{ '--d': '.1s' }}>
                <span className="lxjt6-badge"><Flame size={14} strokeWidth={2.4} /> Selling fast · 2026–27 departures</span>
                <span className="lx2i-eyebrow lx2i-eyebrow--light">{HERO.kicker}</span>
                <h1 className="lxjt-hero__title">{HERO.title}</h1>
                <p className="lxjt-hero__lead">{HERO.lead}</p>
                <ul className="lxjt-hero__facts" aria-label="Trip at a glance">
                  {HERO.facts.map(({ icon: Icon, label }) => (
                    <li key={label} className="lxjt-fact"><Icon size={16} strokeWidth={1.9} /> {label}</li>
                  ))}
                </ul>
                <a href="#reviews" onClick={navClick('#reviews')} className="lxjt-hero__rating lxjt5-rating-link">
                  <span className="lx2i-stars">{[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}</span>
                  <strong>4.9</strong><span>from 640 traveller reviews of this tour</span>
                </a>
              </div>

              {/* the lead form — the whole point of the page */}
              <div className="lxjt6-hero__form lx2i-fade" style={{ '--d': '.18s' }} id="lead">
                <LeadForm id="lead-form-hero" variant="card" defaultDep={pickedDep} />
              </div>
            </div>
          </section>

          {/* ============ SCARCITY STRIP — the urgency, at a glance ============ */}
          <section className="lxjt6-scar" aria-label="Availability">
            <div className="lx2i-container lxjt6-scar__inner">
              <div className="lxjt6-scar__item">
                <Timer size={18} strokeWidth={1.9} />
                <span><strong>Only {DEPARTURES[0].left} seats left</strong> on the next departure ({DEPARTURES[0].date})</span>
              </div>
              <div className="lxjt6-scar__item">
                <TrendingUp size={18} strokeWidth={1.9} />
                <span><strong>Prices rise on {PRICE_RISE_DATE}</strong> — lock today’s fare now</span>
              </div>
              <div className="lxjt6-scar__item">
                <Users size={18} strokeWidth={1.9} />
                <span><strong>{ENQUIRED_THIS_WEEK} travellers enquired</strong> about this trip this week</span>
              </div>
            </div>
          </section>

          {/* ============ HIGHLIGHTS — condensed ============ */}
          <section className="lxjt-section lxjt6-hl" id="highlights">
            <div className="lx2i-container">
              <div className="lxjt-head lxjt-head--center lx2i-reveal">
                <span className="lx2i-eyebrow">// WHY YOU’LL LOVE IT</span>
                <h2 className="lx2i-h2">Eight days, <strong>every detail handled</strong></h2>
                <p className="lxjt-lead">Fully guided, all-inclusive and small-group — here’s what’s in the price and what you’ll see.</p>
              </div>
              <ul className="lxjt-keyinc lx2i-reveal" aria-label="Key inclusions in the price">
                {KEY_INCLUSIONS.map(({ icon: Icon, label }) => (
                  <li key={label} className="lxjt-keyinc__item">
                    <span className="lxjt-keyinc__ic"><Icon size={20} strokeWidth={1.7} /></span>
                    <span className="lxjt-keyinc__lbl">{label}</span>
                  </li>
                ))}
              </ul>
              <ul className="lxjt6-hl__list">
                {HIGHLIGHTS.map((h, i) => (
                  <li key={h} className="lxjt6-hl__item lx2i-reveal" style={{ '--d': `${(i % 2) * 0.07}s` }}>
                    <span className="lxjt6-hl__mark" aria-hidden="true"><Check size={15} strokeWidth={2.6} /></span>
                    <p>{h}</p>
                  </li>
                ))}
              </ul>
              <div className="lxjt6-hl__cta lx2i-reveal">
                <a href="#lead" onClick={navClick('#lead')} className="lx2i-btn lx2i-btn--primary lx2i-btn--lg">Get the full day-by-day <ArrowRight size={16} /></a>
                <span className="lxjt6-hl__ctanote"><Compass size={14} /> We’ll email you the complete 8-day itinerary</span>
              </div>
            </div>
          </section>

          {/* ============ ROUTE — quick visual glance ============ */}
          <section className="lxjt-route lxjt6-route" id="route">
            <div className="lx2i-container">
              <div className="lxjt-head lxjt-head--center lx2i-reveal">
                <span className="lx2i-eyebrow">// TOKYO TO OSAKA</span>
                <h2 className="lx2i-h2">Where you’ll <strong>go</strong></h2>
                <p className="lxjt-lead">Five cities, one seamless journey by coach — coast to coast.</p>
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

          {/* ============ DATES & SEATS — scarcity that jumps to the form ============ */}
          <section className="lxjt6-dates" id="dates">
            <div className="lx2i-container">
              <div className="lxjt-head lxjt-head--center lx2i-reveal">
                <span className="lx2i-eyebrow">// SET 2026–27 DEPARTURES</span>
                <h2 className="lx2i-h2">Pick a date, <strong>hold your seat</strong></h2>
                <p className="lxjt-lead">A 20% deposit reserves your place — the balance comes later. Seats are limited to a small group of 20.</p>
              </div>
              <ul className="lxjt6-deplist lx2i-reveal">
                {DEPARTURES.map((d, i) => (
                  <li key={d.date} className={`lxjt6-dep ${d.tight ? 'is-tight' : ''}`}>
                    <div className="lxjt6-dep__date">
                      <Calendar size={17} strokeWidth={1.9} />
                      <div>
                        <strong>{d.date}</strong>
                        <span>{d.season} · 8 days</span>
                      </div>
                    </div>
                    <span className={`lxjt6-dep__seats ${d.tight ? 'is-tight' : ''}`}>
                      {d.tight ? <Flame size={13} strokeWidth={2.4} /> : <span className="lxjt6-dep__dot" aria-hidden="true" />}
                      {d.tight ? `Only ${d.left} seats left` : `${d.left} seats available`}
                    </span>
                    <span className="lxjt6-dep__price">from {inr(PRICE)} <small>pp</small></span>
                    <a href="#lead" onClick={enquireDep(i)} className="lx2i-btn lx2i-btn--primary lxjt6-dep__go">Enquire <ArrowRight size={15} /></a>
                  </li>
                ))}
              </ul>
              <ul className="lxjt6-trust lx2i-reveal" aria-label="How your booking is protected">
                {TRUST.map(({ icon: Icon, label, note }) => (
                  <li key={label} className="lxjt6-trust__item">
                    <span className="lxjt6-trust__ic"><Icon size={17} strokeWidth={1.8} /></span>
                    <span className="lxjt6-trust__txt"><strong>{label}</strong><small>{note}</small></span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* ============ REVIEWS — condensed social proof ============ */}
          <section className="lxjt-review lxjt6-review" id="reviews">
            <div className="lx2i-container">
              <div className="lxjt-head lxjt-head--center lxjt-head--light lx2i-reveal">
                <span className="lx2i-eyebrow lx2i-eyebrow--light">// 640 TRAVELLERS, RATED 4.9/5</span>
                <h2 className="lx2i-h2 lxjt-review__h">Loved by <strong>the families who went</strong></h2>
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

          {/* ============ CLOSING LEAD BLOCK — one more chance to enquire ============ */}
          <section className="lxjt6-close">
            <div className="lxjt6-close__bg" style={{ backgroundImage: `url(${sizedUnsplash('1522383225653-ed111181a951', 1800)})` }} aria-hidden="true" />
            <div className="lxjt6-close__veil" aria-hidden="true" />
            <div className="lx2i-container lxjt6-close__inner">
              <div className="lxjt6-close__copy lx2i-reveal">
                <span className="lxjt6-badge lxjt6-badge--light"><Clock size={14} strokeWidth={2.4} /> Limited 2026–27 seats</span>
                <h2 className="lxjt6-close__title">Ready when you are.<br /><strong>Let’s hold your seat.</strong></h2>
                <p className="lxjt6-close__sub">Leave your number and a Japan specialist — not a call centre — will call you back with dates, prices and answers. Free, and no obligation.</p>
                <ul className="lxjt6-close__perks">
                  <li><Check size={16} strokeWidth={2.4} /> All-inclusive: flights, visa, insurance, stays &amp; guiding</li>
                  <li><Check size={16} strokeWidth={2.4} /> Reserve from just 20% today, balance later</li>
                  <li><Check size={16} strokeWidth={2.4} /> A real specialist, available 9am–9pm IST</li>
                </ul>
                <div className="lxjt6-close__alt">
                  <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="lx2i-btn lx2i-btn--secondary"><MessageCircle size={16} /> WhatsApp us</a>
                  <a href={PHONE_TEL} className="lx2i-btn lx2i-btn--glass"><Phone size={15} /> {PHONE_DISPLAY}</a>
                </div>
              </div>
              <div className="lxjt6-close__form lx2i-reveal">
                <LeadForm id="lead-form-close" variant="panel" defaultDep={pickedDep} />
              </div>
            </div>
          </section>

          {/* ============ SLIM FOOTER ============ */}
          <footer className="lx2i-footer lxjt6-footer">
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
                  <span className="lx2i-eyebrow">THIS TRIP</span>
                  <a href="#highlights" onClick={navClick('#highlights')}>Highlights</a>
                  <a href="#route" onClick={navClick('#route')}>Your route</a>
                  <a href="#dates" onClick={navClick('#dates')}>Dates &amp; seats</a>
                  <a href="#reviews" onClick={navClick('#reviews')}>Reviews</a>
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

        {/* ============ MOBILE THUMB-REACH BAR — one tap to enquire ============ */}
        <div className="lxjt-thumbbar lxjt6-thumbbar">
          <div className="lxjt-thumbbar__nudge">
            <small>from {inr(PRICE)} pp · {DEPARTURES[0].left} seats left</small>
            <strong>Get prices &amp; dates — free</strong>
          </div>
          <a href="#lead" onClick={navClick('#lead')} className="lxjt-thumbbar__chat lxjt6-thumbbar__cta">
            <ArrowRight size={18} /> Enquire now
          </a>
          <a href={PHONE_TEL} className="lxjt-thumbbar__ico" aria-label="Call a specialist"><Phone size={20} /></a>
        </div>

        {/* ============ FLOATING AI BUTTON (desktop) ============ */}
        <button className={`lx2i-aifab ${chatOpen ? 'is-hidden' : ''}`} aria-label="Open Enaya, the AI travel assistant" onClick={() => setChatOpen(true)}>
          <Sparkles size={20} /><span>Ask Enaya</span>
        </button>

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
