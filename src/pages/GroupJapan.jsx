import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Phone, Mail, Lock, Star, Check, X, MessageCircle, Anchor, MapPin,
  ArrowRight, ChevronDown, ChevronLeft, ChevronRight, ZoomIn, Quote,
  Facebook, Youtube, Linkedin, Instagram,
} from 'lucide-react';
import { tours } from '../data/tours';
import '../pages/NewHome.css'; // brand tokens + nh header/footer/button styles
import './PrivateItaly.css';   // shared design skeleton (identical to the Italy mobile page)

const BASE = 245000;   // lead-in fare, per person (lowest departure)
const inr = (n) => '₹' + n.toLocaleString('en-IN');
const img = (id, w = 800) => `https://images.unsplash.com/${id}?w=${w}&q=80`;
const photoMed = (u) => u.replace(/w=\d+/, 'w=700');
const photoBig = (u) => u.replace(/w=\d+/, 'w=1500');

// Primary nav — identical to the rest of the site
const navItems = [
  { label: 'International Immersions', children: ['Europe', 'Southeast Asia', 'Middle East', 'Africa', 'The Americas', 'Australia & New Zealand'] },
  { label: 'Indian Getaways', children: ['Himalayas & North', 'Kerala & South', 'Rajasthan', 'Goa & Beaches', 'Northeast India', 'Andaman Islands'] },
  { label: 'All Inclusive Vacations', children: ['Beach Resorts', 'Cruise Holidays', 'Family Packages', 'Honeymoon Specials'] },
  { label: 'Tailormade Tours', children: ['Design Your Trip', 'Luxury Journeys', 'Group Departures', 'Corporate & MICE'] },
];

const HERO_IMG = img('photo-1545569341-9eb8b30979d9', 1900);

const highlights = [
  'A private tea ceremony in a Kyoto machiya',
  'Bullet train to Hakone with Mt. Fuji views',
  'Early-access temple visits, before the crowds',
  'A night in a traditional onsen ryokan',
  "Nara's bowing deer and the great bronze Buddha",
  'Tsukiji and Nishiki market food walks',
];

const route = [
  { n: 3, city: 'Tokyo', nights: '3 nights', desc: "Old and new — Senso-ji, Meiji shrine, the city's energy", image: img('photo-1480796927426-f609979314bd') },
  { n: 1, city: 'Hakone', nights: '1 night', desc: 'Onsen ryokan, a kaiseki dinner, and Mt. Fuji views', image: img('photo-1493976040374-85c8e12f0c0e') },
  { n: 4, city: 'Kyoto', nights: '4 nights', desc: 'Temples, Gion, Arashiyama and a Nara day trip', image: img('photo-1528360983277-13d401cdc186') },
  { n: 1, city: 'Osaka', nights: '1 night', desc: 'Dotonbori neon and last bowls of ramen before home', image: img('photo-1542051841857-5f90071e7989') },
];

const days = [
  { d: 'Day 01', t: 'Arrive Tokyo', body: 'Met at Narita by your guide and transferred to your hotel. An evening welcome dinner in Asakusa with the group.' },
  { d: 'Day 02', t: 'Tokyo, old & new', body: "Senso-ji, the Imperial gardens and a contemplative afternoon in Meiji Shrine's forest." },
  { d: 'Day 03', t: 'Hakone & Mt. Fuji', body: 'Bullet train into the mountains; a ryokan stay with onsen and a traditional kaiseki dinner.' },
  { d: 'Day 04', t: 'Into Kyoto', body: 'The Tokaido line to Kyoto. An evening stroll through lantern-lit Gion.' },
  { d: 'Day 05', t: "Kyoto's temples", body: 'Fushimi Inari at dawn, the Arashiyama bamboo grove, and a private tea ceremony for the group.' },
  { d: 'Day 06', t: 'Nara day trip', body: 'The great bronze Buddha and the bowing deer of Nara Park.' },
  { d: 'Day 07', t: 'Kyoto at leisure', body: "A free day to explore at your own pace — your curator's hand-drawn map in hand." },
  { d: 'Day 08', t: 'Kyoto → Osaka', body: "A short hop to Osaka; the city's exuberant food culture by night." },
  { d: 'Day 09', t: 'Osaka', body: 'Dotonbori, Osaka Castle, and a final evening to wander together.' },
  { d: 'Day 10', t: 'Depart for home', body: 'Transfer to the airport and onward, with a curator a message away if you need anything.' },
];

const inclusions = [
  'Visa fees & assistance', 'Comprehensive insurance', 'All meals, every day',
  '4–5★ hotels & a ryokan', 'Expert guide throughout', 'Bullet-train travel',
  'All entrances & experiences', 'Airport & daily transfers',
];
const exclusions = [
  'International airfare (add it at checkout, priced from your city)',
  'Personal expenses & shopping',
  'Optional experiences beyond the itinerary',
  'Gratuities for your guides and drivers',
];
const expectations = [
  { i: '👣', t: 'A gentle-to-moderate pace', s: 'Some early starts for quiet temples; comfortable walking days' },
  { i: '👥', t: 'A small group', s: 'Up to 16 travellers, with one expert guide throughout' },
  { i: '🌸', t: 'Spring weather', s: 'Roughly 10–18°C; the blossom timed as closely as nature allows' },
  { i: '🚄', t: 'Plenty of rail', s: 'Japan by bullet train — scenic, smooth and very Japanese' },
];
const awards = [
  { t: "World's Most Experienced Travel Company", y: '2024' },
  { t: 'Best for Service & Trust', y: '2023' },
  { t: 'Experiential Operator of the Year', y: '2023' },
  { t: 'Heritage Brand of the Decade', y: '2022' },
];
const travellerStories = [
  {
    text: 'Every transfer, every meal, flawless. They thought of things we didn’t know to ask. The blossom timing was perfect, the ryokan unforgettable, and the small group felt like friends by the end. We simply turned up and were cared for.',
    name: 'Meera & Anand', date: 'Japan, in a group · 2025', rating: 5,
    photos: [img('photo-1545569341-9eb8b30979d9', 200), img('photo-1528360983277-13d401cdc186', 200), img('photo-1493976040374-85c8e12f0c0e', 200)],
  },
  {
    text: 'A private tea ceremony in Kyoto, Nara’s bowing deer, the bullet train gliding past Mt. Fuji — all of it handled so we could just be present. Travelling as a small group meant company when we wanted it and space when we didn’t. Worth every rupee.',
    name: 'The Nair family', date: 'Japan · 2025', rating: 5,
    photos: [img('photo-1478436127897-769e1b3f0f36', 200), img('photo-1480796927426-f609979314bd', 200), img('photo-1542051841857-5f90071e7989', 200)],
  },
];
// Fixed 2026 group departures — this is a set-date tour, not a free-date private trip
const departures = [
  { date: '28 Mar 2026', price: 245000, seats: 'Only 2 seats left', tone: 'low' },
  { date: '04 Apr 2026', price: 259000, seats: 'Only 6 seats left', tone: 'low' },
  { date: '11 Apr 2026', price: 259000, was: 279000, save: 20000, seats: '11 seats available', tone: 'ok' },
  { date: '18 Apr 2026', price: 259000, seats: 'Sold out', tone: 'out', soldOut: true },
];

// Other journeys to surface for visitors who want something beyond this one
const otherPicks = tours.filter((t) => t.destination !== 'Japan').slice(0, 6);

function Engraving({ className }) {
  return (
    <svg className={className} viewBox="0 0 1440 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="1440" height="400" fill="#0e2336" />
      <g stroke="rgba(201,168,106,0.28)" fill="none" strokeWidth="1">
        <path d="M-40 110 Q 360 60 760 120 T 1500 110" />
        <path d="M-40 180 Q 420 130 820 190 T 1520 180" />
        <path d="M-40 300 Q 360 250 760 310 T 1500 300" />
      </g>
    </svg>
  );
}

export default function GroupJapan({ mobile = false }) {
  const [depIdx, setDepIdx] = useState(null);
  const [pay, setPay] = useState('d');
  const [openDays, setOpenDays] = useState(() => new Set([0]));
  const [showBar, setShowBar] = useState(false);
  const [modal, setModal] = useState(null);

  const picksRef = useRef(null);
  const scrollPicks = (dir) => picksRef.current?.scrollBy({ left: dir * 300, behavior: 'smooth' });

  // "What travellers say" — photo-gallery testimonials (nh-revs design)
  const [tIndex, setTIndex] = useState(0);
  const [lightbox, setLightbox] = useState(null);
  const story = travellerStories[tIndex];
  const prevRev = () => setTIndex((i) => (i - 1 + travellerStories.length) % travellerStories.length);
  const nextRev = () => setTIndex((i) => (i + 1) % travellerStories.length);
  const lbPrev = () => setLightbox((i) => (i - 1 + story.photos.length) % story.photos.length);
  const lbNext = () => setLightbox((i) => (i + 1) % story.photos.length);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setLightbox(null);
      else if (e.key === 'ArrowLeft') lbPrev();
      else if (e.key === 'ArrowRight') lbNext();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [lightbox, story.photos.length]);

  const selected = depIdx === null ? null : departures[depIdx];
  const price = selected ? selected.price : null;
  const dep = selected ? Math.round(price * 0.2) : 0;
  const reserveLabel = !selected
    ? 'Select a departure'
    : pay === 'd' ? `Pay deposit · ${inr(dep)}` : `Pay in full · ${inr(price)}`;

  const toggleDay = (i) =>
    setOpenDays((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  const reserve = () => setModal(selected ? { kind: 'checkout' } : { kind: 'pickdate' });
  const scrollToBook = () => document.getElementById('book')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  useEffect(() => {
    const onScroll = () => setShowBar(window.scrollY > window.innerHeight * 0.7);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = modal ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [modal]);

  return (
    <div className={`nh pi ${mobile ? 'pi--mobile' : ''}`}>
      {/* ===== Header (two-tier, consistent with the site — no nav CTA on this page) ===== */}
      <header className="nh-header">
        <div className="nh-utility">
          <div className="nh-utility__inner">
            <Link to="/" className="nh-logo" aria-label="Cox & Kings home">
              <img src="/cox-logo.svg" alt="Cox & Kings" />
            </Link>
            <span className="nh-utility__tag">The World's Most Experienced Travel Company · Est. 1758</span>
          </div>
        </div>
        <div className="nh-mainnav">
          <nav className="nh-mainnav__inner" aria-label="Primary">
            {navItems.map((n) => (
              <div className="nh-mainnav__item" key={n.label}>
                <Link to="/journeys4" aria-haspopup={n.children ? 'true' : undefined}>
                  {n.label} {n.children && <ChevronDown size={14} className="nh-mainnav__caret" aria-hidden="true" />}
                </Link>
                {n.children && (
                  <div className="nh-dropdown">
                    {n.children.map((c) => <Link key={c} to="/journeys4">{c}</Link>)}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section className="pi-hero">
        <div className="pi-hero__bg" style={{ backgroundImage: `url(${HERO_IMG})` }} />
        <div className="pi-hero__overlay" />
        <div className="pi-hero__inner nh-container">
          <div className="pi-hero__box">
            <span className="nh-eyebrow nh-eyebrow--light">Group tour · set 2026 departures · all-inclusive</span>
            <h1>Japan — <em>in cherry blossom</em>,<br />in a small group.</h1>
            <p className="pi-hero__sub">
              Ten unhurried days, Tokyo to Kyoto, timed to the blossom — a small group, one expert
              guide, and everything else handled. You show up; we’ve thought of all the rest. 🌸
            </p>
            <div className="pi-hero__stats">
              <div><b>10 days</b><small>fully guided</small></div>
              <div><b>₹2,45,000</b><small>from · all-inclusive</small></div>
              <div><b>Set dates</b><small>small groups</small></div>
            </div>
            <div className="pi-hero__ctas">
              <a href="#book" className="nh-btn nh-btn--orange">Plan your Japan journey <ArrowRight size={15} /></a>
              <a href="tel:+918556001700" className="nh-btn nh-btn--ghost"><Phone size={14} /> Talk to a curator</a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRUST STRIP ===== */}
      <div className="pi-trust">
        <div className="nh-container pi-trust__row">
          <div><b>Est. 1758</b>260+ years of travel</div>
          <div><b><span className="pi-star">★</span> 4.9</b>Trustpilot rated</div>
          <div><b>All-inclusive</b>visa → meals → transfers</div>
          <div><b>100+</b>destinations worldwide</div>
        </div>
      </div>

      {/* ===== HIGHLIGHTS ===== */}
      <section className="pi-section" id="highlights">
        <div className="nh-container">
          <div className="pi-head">
            <span className="nh-eyebrow">The journey from the ad</span>
            <h2 className="nh-h2">Tour highlights</h2>
            <p className="nh-sub">Every detail arranged for the group, so you need only turn up.</p>
          </div>
          <div className="pi-hl-grid">
            {highlights.map((h) => (
              <div className="pi-hl-item" key={h}>
                <span className="pi-k">✦</span>
                <p>{h}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ROUTE ===== */}
      <section className="pi-section pi-section--cream" id="route">
        <div className="nh-container">
          <div className="pi-head pi-head--center">
            <span className="nh-eyebrow">9 nights, in a small group</span>
            <h2 className="nh-h2">Your route</h2>
            <p className="nh-sub">Tokyo to Osaka — four stops, one seamless journey by rail.</p>
          </div>
          <div className="pi-routeline">
            {route.map((s, i) => (
              <div className="pi-routestop" key={s.city}>
                <div className="pi-routestop__node" style={{ backgroundImage: `url(${s.image})` }}>
                  <span className="pi-routestop__step">{i + 1}</span>
                </div>
                <div className="pi-routestop__c">
                  <span className="pi-routestop__nights">{s.nights}</span>
                  <h3 className="pi-routestop__city">{s.city}</h3>
                  <p className="pi-routestop__desc">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ITINERARY ===== */}
      <section className="pi-section" id="itinerary">
        <div className="nh-container">
          <div className="pi-head pi-head--center">
            <span className="nh-eyebrow">The full picture</span>
            <h2 className="nh-h2">Day by day</h2>
          </div>
          <div className="pi-itin">
            {days.map((d, i) => {
              const open = openDays.has(i);
              return (
                <div className={`pi-id ${open ? 'is-open' : ''}`} key={d.d}>
                  <button className="pi-iq" onClick={() => toggleDay(i)} aria-expanded={open}>
                    <span className="pi-dn">{d.d}</span>
                    <span className="pi-dt">{d.t}</span>
                    <span className="pi-pl">+</span>
                  </button>
                  <div className="pi-ia" style={{ maxHeight: open ? 200 : 0 }}>
                    <div className="pi-iin">{d.body}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== BOOKING ===== */}
      <section className="pi-section pi-section--tinted" id="book">
        <div className="nh-container pi-book-grid">
          {/* persuasive left column */}
          <div className="pi-book-aside">
            <span className="nh-eyebrow">Reserve your 2026 departure</span>
            <h2 className="nh-h2">Plan your Japan journey</h2>
            <p className="nh-sub">Pick one of our set 2026 departures and confirm your seats with a 20% deposit — the balance comes later.</p>
            <ul className="pi-book-points">
              <li><Check size={18} className="pi-ck" /> Expert-guided from the moment you land to the day you fly home</li>
              <li><Check size={18} className="pi-ck" /> All-inclusive — visa, insurance, hotels, meals and transfers</li>
              <li><Check size={18} className="pi-ck" /> A small group of like-minded travellers, never more than 16</li>
            </ul>
            <div className="pi-aside-note">
              <Lock size={20} />
              <div>
                <b>Book with confidence</b>
                <p>256-bit encrypted checkout. Your 20% deposit is protected, and you can talk to a curator first — free.</p>
              </div>
            </div>
          </div>

          {/* booking card (sticky on desktop — the optimum CTA position) */}
          <div className="pi-book-card">
            <p className="pi-book-card__price">from <b>{inr(BASE)}</b> / person · all-inclusive</p>

            <div className="pi-fld">
              <label>Choose your 2026 departure</label>
              <div className="pi-dep">
                {departures.map((d, i) => {
                  const sel = depIdx === i;
                  return (
                    <button
                      key={d.date}
                      type="button"
                      className={`pi-dep-row ${sel ? 'is-sel' : ''} ${d.soldOut ? 'is-out' : ''}`}
                      onClick={() => !d.soldOut && setDepIdx(i)}
                      disabled={d.soldOut}
                      aria-pressed={sel}
                    >
                      <div className="pi-dep-l">
                        <div className="pi-dep-d">{d.date}</div>
                        <div className={`pi-dep-s pi-dep-s--${d.tone}`}>{d.seats}</div>
                      </div>
                      <div className="pi-dep-p">
                        {d.was && <span className="pi-dep-was">{inr(d.was)}</span>}
                        <span className="pi-dep-now">{inr(d.price)}</span>
                        {d.save && <span className="pi-dep-save">Save {inr(d.save)}</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pi-pay">
              <button className={`pi-po ${pay === 'd' ? 'is-sel' : ''}`} onClick={() => setPay('d')}>
                <div className="pi-pt">Pay a deposit</div>
                <div className="pi-pa">{selected ? inr(dep) : '—'}</div>
                <div className="pi-ps">20% to confirm</div>
              </button>
              <button className={`pi-po ${pay === 'f' ? 'is-sel' : ''}`} onClick={() => setPay('f')}>
                <div className="pi-pt">Pay in full</div>
                <div className="pi-pa">{selected ? inr(price) : '—'}</div>
                <div className="pi-ps">settle today</div>
              </button>
            </div>

            <button className="nh-btn nh-btn--orange" style={{ width: '100%', justifyContent: 'center', marginTop: 16, padding: '16px' }} onClick={reserve}>
              {reserveLabel}
            </button>
            <div className="pi-secbar"><Lock size={14} /> Secure 256-bit checkout · deposit protected · or talk to a curator first, free</div>
          </div>
        </div>
      </section>

      {/* ===== INCLUDED / NOT INCLUDED ===== */}
      <section className="pi-section" id="included">
        <div className="nh-container pi-inex-grid">
          <div className="pi-inex">
            <span className="nh-eyebrow">Included, all of it</span>
            <h3>Everything taken care of</h3>
            <ul className="pi-list pi-list--in">
              {inclusions.map((it) => <li key={it}><Check size={18} className="pi-mk" />{it}</li>)}
            </ul>
          </div>
          <div className="pi-inex">
            <span className="nh-eyebrow">Good to know</span>
            <h3>What's not included</h3>
            <ul className="pi-list pi-list--ex">
              {exclusions.map((it) => <li key={it}><X size={18} className="pi-mk" />{it}</li>)}
            </ul>
          </div>
        </div>
      </section>

      {/* ===== WHAT TO EXPECT ===== */}
      <section className="pi-section pi-section--cream">
        <div className="nh-container">
          <div className="pi-head">
            <span className="nh-eyebrow">Honest, upfront</span>
            <h2 className="nh-h2">What to expect</h2>
          </div>
          <div className="pi-expect-grid">
            {expectations.map((e) => (
              <div className="pi-ex" key={e.t}>
                <span className="pi-exi">{e.i}</span>
                <b>{e.t}</b>
                <span>{e.s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CURATOR BAND ===== */}
      <section className="pi-section pi-curator">
        <Engraving className="pi-curator__eng" />
        <div className="nh-container pi-curator__in">
          <div className="pi-curator__av">AR</div>
          <div className="pi-curator__txt">
            <span className="nh-eyebrow nh-eyebrow--light">Your Japan curator</span>
            <h2>Ananya Rao</h2>
            <div className="pi-curator__rr">Hosts every Japan cherry-blossom departure personally</div>
            <div className="pi-curator__hours"><span className="pi-dot" /> Available now · 9am–9pm</div>
          </div>
          <div className="pi-curator__acts">
            <a className="nh-btn nh-btn--orange" href="tel:+918556001700"><Phone size={14} /> Call Ananya</a>
            <a className="nh-btn" style={{ background: '#1faa55', color: '#fff' }} href="https://wa.me/918556001700"><MessageCircle size={14} /> WhatsApp</a>
            <button className="nh-btn nh-btn--ghost" onClick={() => setModal({ kind: 'callback' })}>Request a callback</button>
          </div>
        </div>
      </section>

      {/* ===== HERITAGE band (mirrors the final 'Two and a half centuries' section) ===== */}
      <section className="nh-heritage">
        <div className="nh-heritage__bg" />
        <div className="nh-heritage__overlay" />
        <div className="nh-container nh-heritage__inner">
          <span className="nh-eyebrow nh-eyebrow--light">Since 1758</span>
          <h2 className="nh-h2 nh-h2--light">Two and a half centuries<br />of crafting journeys</h2>
          <p className="nh-sub nh-sub--light">
            The same travel house that has looked after travellers for over 260 years —
            across more than 100 destinations, and never a traveller left stranded.
          </p>
          <div className="nh-tl">
            <div className="nh-tl__item"><span className="nh-tl__year">1758</span><span className="nh-tl__lbl">Founded in London</span></div>
            <div className="nh-tl__item"><span className="nh-tl__year">1900s</span><span className="nh-tl__lbl">Pioneering grand world tours</span></div>
            <div className="nh-tl__item"><span className="nh-tl__year">2000s</span><span className="nh-tl__lbl">Tailor-made luxury journeys</span></div>
            <div className="nh-tl__item"><span className="nh-tl__year">Today</span><span className="nh-tl__lbl">Small-group, expert-guided travel</span></div>
          </div>
          <a href="#book" className="nh-btn nh-btn--ghost">Plan your Japan journey <ArrowRight size={15} /></a>
        </div>
      </section>

      {/* ===== WHAT TRAVELLERS SAY (nh-revs gallery design) ===== */}
      <section className="nh-revs" id="reviews">
        <div className="nh-container">
          <div className="nh-revs__head">
            <span className="nh-eyebrow">What travellers say</span>
            <h2 className="nh-h2">Real journeys, captured by real travellers</h2>
            <p className="nh-sub">Tap any photo to see the moments that made the trip — straight from those who lived it.</p>
          </div>

          <div className="nh-revs__grid">
            <div className="nh-revs__gallery">
              {story.photos.slice(0, 3).map((p, i) => (
                <button
                  key={i}
                  className={`nh-revphoto nh-revphoto--${i}`}
                  style={{ backgroundImage: `url(${photoMed(p)})` }}
                  onClick={() => setLightbox(i)}
                  aria-label={`View photo ${i + 1} from ${story.name}`}
                >
                  <span className="nh-revphoto__zoom"><span className="nh-revphoto__zoomi"><ZoomIn size={20} /></span></span>
                </button>
              ))}
            </div>

            <div className="nh-revs__content">
              <Quote className="nh-revs__qmark" size={40} />
              <div className="nh-rev__stars">
                {[...Array(story.rating)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
              </div>
              <p className="nh-rev__text">{story.text}</p>
              <div className="nh-rev__author">
                <div>
                  <strong>{story.name}</strong>
                  <span className="nh-rev__date">{story.date}</span>
                </div>
                <div className="nh-revs__nav">
                  <button onClick={prevRev} aria-label="Previous story"><ChevronLeft size={18} /></button>
                  <span className="nh-revs__count">{tIndex + 1} / {travellerStories.length}</span>
                  <button onClick={nextRev} aria-label="Next story"><ChevronRight size={18} /></button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {lightbox !== null && (
          <div className="nh-lightbox" onClick={() => setLightbox(null)} role="dialog" aria-modal="true">
            <button className="nh-lightbox__close" onClick={() => setLightbox(null)} aria-label="Close"><X size={22} /></button>
            <button className="nh-lightbox__nav nh-lightbox__nav--prev" onClick={(e) => { e.stopPropagation(); lbPrev(); }} aria-label="Previous photo"><ChevronLeft size={26} /></button>
            <figure className="nh-lightbox__fig" onClick={(e) => e.stopPropagation()}>
              <img src={photoBig(story.photos[lightbox])} alt={`Travel photo from ${story.name}`} />
              <figcaption>{story.name} · Photo {lightbox + 1} of {story.photos.length}</figcaption>
            </figure>
            <button className="nh-lightbox__nav nh-lightbox__nav--next" onClick={(e) => { e.stopPropagation(); lbNext(); }} aria-label="Next photo"><ChevronRight size={26} /></button>
          </div>
        )}
      </section>

      {/* ===== OTHER PACKAGES (card rail, like the home page) ===== */}
      <section className="nh-picks pi-section" id="more-packages">
        <div className="nh-container nh-picks__head">
          <div>
            <span className="nh-eyebrow">Not quite right?</span>
            <h2 className="nh-h2">Explore our other journeys</h2>
            <p className="nh-sub">If Japan isn't the one, here's a little of what else we craft.</p>
          </div>
          <div className="nh-picks__controls">
            <button className="nh-picks__arrow" onClick={() => scrollPicks(-1)} aria-label="Scroll left">
              <ChevronLeft size={20} />
            </button>
            <button className="nh-picks__arrow" onClick={() => scrollPicks(1)} aria-label="Scroll right">
              <ChevronRight size={20} />
            </button>
            <Link to="/journeys4" className="nh-textlink nh-picks__all">View all trips <ArrowRight size={15} /></Link>
          </div>
        </div>
        <div className="nh-picks__track" ref={picksRef}>
          {otherPicks.map((p) => (
            <Link to="/journeys4" key={p.id} className="nh-pick">
              <div className="nh-pick__img">
                <div className="nh-pick__imgbg" style={{ backgroundImage: `url(${p.image})` }} />
                <span className="nh-pick__cat">{p.category}</span>
                <span className="nh-pick__rating"><Star size={12} fill="currentColor" /> {p.rating}</span>
              </div>
              <div className="nh-pick__body">
                <span className="nh-pick__dest"><MapPin size={13} /> {p.destination}</span>
                <h3>{p.title}</h3>
                <p className="nh-pick__meta">{p.duration} · {p.reviews} reviews</p>
                <p className="nh-pick__price"><span className="nh-pick__from">from</span> ₹{(p.price * 83).toLocaleString('en-IN')} <span>/ person</span></p>
                <span className="nh-pick__link">View Trip <ArrowRight size={14} /></span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== CLOSING CTA BAND ===== */}
      <section className="pi-section pi-cta-band">
        <Engraving className="pi-cta-band__eng" />
        <div className="nh-container pi-cta-band__in">
          <h2>Begin your <em>Japan</em> journey</h2>
          <p>Set 2026 departures, a small group and an expert guide — and a curator who handles every detail.</p>
          <div className="pi-cta-band__btns">
            <a href="#book" className="nh-btn nh-btn--orange">Plan your Japan journey <ArrowRight size={15} /></a>
            <a href="tel:+918556001700" className="nh-btn nh-btn--ghost"><Phone size={14} /> +91 8556001700</a>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="nh-footer">
        <div className="nh-container nh-footer__top">
          <div className="nh-footer__brand">
            <img src="/cox-logo.svg" alt="Cox & Kings" />
            <p className="nh-footer__tag">260+ Years of Travel,<br />Trusted by Generations</p>
            <span className="nh-footer__h">CONTACT US</span>
            <a href="tel:+918556001700"><Phone size={14} /> +91 8556001700</a>
            <a href="mailto:holidays@coxandkings.com"><Mail size={14} /> holidays@coxandkings.com</a>
            <div className="nh-footer__social">
              <a href="#" aria-label="Facebook"><Facebook size={17} /></a>
              <a href="#" aria-label="YouTube"><Youtube size={17} /></a>
              <a href="#" aria-label="LinkedIn"><Linkedin size={17} /></a>
              <a href="#" aria-label="Instagram"><Instagram size={17} /></a>
            </div>
          </div>
          <div className="nh-footer__cols">
            <div>
              <span className="nh-footer__h">EXPLORE</span>
              <Link to="/journeys4">International Immersions</Link>
              <Link to="/journeys4">All Inclusive Vacations</Link>
              <Link to="/journeys4">Indian Getaways</Link>
              <Link to="/journeys4">Tailormade Journeys</Link>
              <span className="nh-footer__h nh-footer__h--gap">QUICK LINKS</span>
              <Link to="/sitemap">Sitemap</Link>
              <Link to="/terms#refund-policy">Refund Policy</Link>
              <Link to="/terms">Cancellation Policy</Link>
            </div>
            <div>
              <span className="nh-footer__h">ABOUT</span>
              <Link to="/about-us2">About Us</Link>
              <a href="#book">Contact Us</a>
              <a href="#">Inspiration Station</a>
              <a href="#">Testimonials</a>
              <a href="#">Press &amp; Media</a>
              <a href="#">FAQs</a>
            </div>
            <div>
              <span className="nh-footer__h">PARTNER WITH US</span>
              <a href="#">Become a Franchise Partner</a>
              <a href="#">Collaborate With Us</a>
              <a href="#">Become a Preferred Sales Partner</a>
            </div>
          </div>
        </div>
        <div className="nh-container nh-footer__bottom">
          <p>©2026 Cox &amp; Kings</p>
          <div className="nh-footer__legal">
            <a href="#">Terms &amp; Conditions</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </footer>

      {/* ===== fixed bottom CTA bar (always visible on the mobile version) ===== */}
      <div className={`pi-ctabar ${(mobile || showBar) ? 'is-show' : ''}`}>
        <button className="pi-cf-main" onClick={scrollToBook}>Plan &amp; book this journey</button>
        <a className="pi-cf-ic c" href="tel:+918556001700" aria-label="Call"><Phone size={18} /></a>
        <a className="pi-cf-ic w" href="https://wa.me/918556001700" aria-label="WhatsApp"><MessageCircle size={18} /></a>
      </div>

      {/* ===== modal ===== */}
      {modal && (
        <div className="pi-mbg" onClick={(e) => e.target === e.currentTarget && setModal(null)} role="dialog" aria-modal="true">
          <div className="pi-modal">
            <button className="pi-mx" onClick={() => setModal(null)} aria-label="Close">×</button>

            {modal.kind === 'pickdate' && (
              <>
                <h3>Choose a date</h3>
                <p>Please select a 2026 departure in the booking panel first.</p>
              </>
            )}

            {modal.kind === 'checkout' && (
              <>
                <h3>Secure checkout</h3>
                <p>Japan in Cherry Blossom · all-inclusive · {selected?.date}</p>
                <div className="pi-fr"><label>Lead traveller</label><input placeholder="Full name" /></div>
                <div className="pi-fr"><label>Phone</label><input placeholder="+91…" /></div>
                <div className="pi-fr"><label>Card</label><input placeholder="Card number" /></div>
                <button className="nh-btn nh-btn--orange" style={{ width: '100%', justifyContent: 'center', padding: 15 }} onClick={() => setModal({ kind: 'done' })}>
                  Pay {inr(pay === 'd' ? dep : price)} securely
                </button>
                <p className="pi-note">Demo only — no payment taken.</p>
              </>
            )}

            {modal.kind === 'callback' && (
              <>
                <h3>Request a callback</h3>
                <p>Ananya or a Japan curator will call — 9am to 9pm.</p>
                <div className="pi-fr"><label>Name</label><input placeholder="Full name" /></div>
                <div className="pi-fr"><label>Phone</label><input placeholder="+91…" /></div>
                <div className="pi-fr"><label>Rough dates &amp; party (optional)</label><input placeholder="e.g. Apr 2026, 2 travellers" /></div>
                <button className="nh-btn nh-btn--orange" style={{ width: '100%', justifyContent: 'center', padding: 15 }} onClick={() => setModal({ kind: 'done', cb: true })}>
                  Request my callback
                </button>
              </>
            )}

            {modal.kind === 'done' && (
              <div style={{ textAlign: 'center' }}>
                <div className="pi-seal"><small className="t">EST</small><b>1758</b><small className="bm">260+</small></div>
                <h3>{modal.cb ? 'A curator will call you shortly.' : "You're booked."}</h3>
                <p style={{ marginTop: 6 }}>
                  {modal.cb
                    ? 'Someone who knows Japan will be in touch within the hour to plan it with you.'
                    : 'A confirmation is on its way, and Ananya will call to welcome you to the group.'}
                </p>
                <button className="nh-btn nh-btn--blue" style={{ marginTop: 18 }} onClick={() => setModal(null)}>Done</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
