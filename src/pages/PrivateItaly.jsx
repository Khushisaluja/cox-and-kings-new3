import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Phone, Mail, Lock, Star, Check, X, Plus, Minus, MessageCircle, Anchor, MapPin,
  ArrowRight, ChevronDown, ChevronLeft, ChevronRight, ZoomIn, Quote,
  Facebook, Youtube, Linkedin, Instagram,
} from 'lucide-react';
import { tours } from '../data/tours';
import '../pages/NewHome.css'; // brand tokens + nh header/footer/button styles
import './PrivateItaly.css';

const BASE = 295000;   // land, per person
const FLIGHT = 54000;  // live flight estimate, per person (Europe)
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

const HERO_IMG = img('photo-1516483638261-f4dbaf036963', 1900);

const highlights = [
  'A private driver-guide for the two of you, throughout',
  'An after-hours Vatican option, away from the crowds',
  'Two nights in a Tuscan villa, with nowhere to be',
  'The Amalfi coast by private boat',
  'A long lunch at a family wine estate',
  'Romantic dinners booked and quietly arranged',
];

const route = [
  { n: 3, city: 'Rome', nights: '3 nights', desc: 'The eternal city, the Vatican, and the back streets few see', image: img('photo-1552832230-c0197dd311b5') },
  { n: 2, city: 'Florence', nights: '2 nights', desc: 'Renaissance mornings, leather & gelato afternoons', image: img('photo-1543429776-2782fc8e1acd') },
  { n: 2, city: 'Tuscany', nights: '2 nights', desc: 'A villa, a vineyard, and the slow life', image: img('photo-1498307833015-e7b400441eb8') },
  { n: 3, city: 'Amalfi Coast', nights: '3 nights', desc: 'Positano, Ravello, and the sea by private boat', image: img('photo-1534445867742-43195f401b6c') },
];

const days = [
  { d: 'Day 01', t: 'Arrive Rome', body: 'Private transfer to your hotel. An evening walk to the Trevi Fountain as the city lights come on.' },
  { d: 'Day 02', t: 'Rome, privately guided', body: 'The Colosseum and Forum with your guide, then the back-street trattorias only locals know.' },
  { d: 'Day 03', t: 'The Vatican', body: "St. Peter's and the Sistine Chapel — with an after-hours option to have it almost to yourselves." },
  { d: 'Day 04', t: 'Rome → Florence', body: 'A scenic drive north into Tuscany; settle into Florence by evening.' },
  { d: 'Day 05', t: 'Florence', body: "The Uffizi and the Duomo, then time to wander the Oltrarno's workshops." },
  { d: 'Day 06', t: 'Into Tuscany', body: 'To your villa among the vines; a long lunch at a family wine estate.' },
  { d: 'Day 07', t: 'Tuscany at leisure', body: 'A day with nowhere to be — hill towns, a cooking lesson, or simply the pool.' },
  { d: 'Day 08', t: 'Tuscany → Amalfi', body: 'South to the coast, where the road curls above the sea to your cliffside hotel.' },
  { d: 'Day 09', t: 'Amalfi by private boat', body: "Positano, Ravello and hidden coves — the coast the way it's meant to be seen." },
  { d: 'Day 10', t: 'Amalfi at leisure', body: 'A last slow day by the sea. A farewell dinner quietly arranged.' },
  { d: 'Day 11', t: 'Depart for home', body: 'Private transfer to Naples or Rome for your flight, with a curator a message away.' },
];

const inclusions = [
  'Private driver-guide', 'Visa & assistance', 'Travel insurance',
  'A Tuscan villa stay', 'Amalfi by private boat', 'All meals & transfers',
];
const exclusions = [
  'International airfare (add it in the booking panel — live fares from your city)',
  'Personal expenses & shopping',
  'Optional experiences beyond the itinerary',
  'Gratuities for your guide and drivers',
];
const expectations = [
  { i: '♡', t: 'Just the two of you', s: 'No group, no fixed pace — the journey is entirely yours' },
  { i: '🗓️', t: 'Your dates, your rhythm', s: 'Start any day; lie-ins and long lunches encouraged' },
  { i: '🚗', t: 'A few driving days', s: 'Scenic transfers between regions, all privately chauffeured' },
  { i: '☀️', t: 'Best from May to October', s: 'Warm, long evenings — ideal for the coast and Tuscany' },
];
const awards = [
  { t: "World's Most Experienced Travel Company", y: '2024' },
  { t: 'Best for Service & Trust', y: '2023' },
  { t: 'Experiential Operator of the Year', y: '2023' },
  { t: 'Heritage Brand of the Decade', y: '2022' },
];
const coupleStories = [
  {
    text: 'They designed it around us — our pace, our dates. The most romantic trip of our lives. The villa in Tuscany, the private boat along the Amalfi coast, the dinners we’d never have found on our own. We just lived it, and everything else was quietly handled.',
    name: 'Aditi & Karan', date: 'Italy, privately · 2025', rating: 5,
    photos: [img('photo-1534445867742-43195f401b6c', 200), img('photo-1498307833015-e7b400441eb8', 200), img('photo-1514890547357-a9ee288728e0', 200)],
  },
  {
    text: 'The after-hours Vatican almost to ourselves, a long lunch at a family wine estate, romantic dinners booked before we’d even thought of them. We didn’t lift a finger — we just fell a little more in love with Italy, and with each other. Worth every rupee.',
    name: 'Sneha & Vikram', date: 'Italy · 2025', rating: 5,
    photos: [img('photo-1552832230-c0197dd311b5', 200), img('photo-1543429776-2782fc8e1acd', 200), img('photo-1583422409516-2895a77efded', 200)],
  },
];
const cities = ['New Delhi', 'Mumbai', 'Bengaluru', 'Chennai', 'Hyderabad', 'Kolkata', 'Ahmedabad'];

// Other journeys to surface for visitors who want something beyond this one
const otherPicks = tours.filter((t) => t.destination !== 'Italy').slice(0, 6);

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

export default function PrivateItaly({ mobile = false }) {
  const [date, setDate] = useState('');
  const [pax, setPax] = useState(2);
  const [pay, setPay] = useState('d');
  const [flight, setFlight] = useState(false);
  const [city, setCity] = useState(cities[0]);
  const [openDays, setOpenDays] = useState(() => new Set([0]));
  const [showBar, setShowBar] = useState(false);
  const [modal, setModal] = useState(null);

  const picksRef = useRef(null);
  const scrollPicks = (dir) => picksRef.current?.scrollBy({ left: dir * 300, behavior: 'smooth' });

  // "What couples say" — photo-gallery testimonials (nh-revs design)
  const [tIndex, setTIndex] = useState(0);
  const [lightbox, setLightbox] = useState(null);
  const story = coupleStories[tIndex];
  const prevRev = () => setTIndex((i) => (i - 1 + coupleStories.length) % coupleStories.length);
  const nextRev = () => setTIndex((i) => (i + 1) % coupleStories.length);
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

  const pp = BASE + (flight ? FLIGHT : 0);
  const sub = pp * pax;
  const dep = Math.round(sub * 0.2);
  const reserveLabel = !date
    ? 'Choose a date to continue'
    : pay === 'd' ? `Pay deposit · ${inr(dep)}` : `Pay in full · ${inr(sub)}`;

  const toggleDay = (i) =>
    setOpenDays((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  const reserve = () => setModal(date ? { kind: 'checkout' } : { kind: 'pickdate' });
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
            <span className="nh-eyebrow nh-eyebrow--light">Private · any date · flights from your city</span>
            <h1>Italy — <em>yours alone</em>,<br />on your dates.</h1>
            <p className="pi-hero__sub">
              Just the two of you, a private driver, and eleven slow Italian days — from Roman
              mornings to Amalfi sunsets. You show up holding hands; we’ve thought of all the rest. 🇮🇹
            </p>
            <div className="pi-hero__stats">
              <div><b>11 days</b><small>private &amp; guided</small></div>
              <div><b>₹2,95,000</b><small>from · land only</small></div>
              <div><b>Any date</b><small>your party only</small></div>
            </div>
            <div className="pi-hero__ctas">
              <a href="#book" className="nh-btn nh-btn--orange">Plan your private journey <ArrowRight size={15} /></a>
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
            <p className="nh-sub">Every detail privately arranged, so the two of you need only turn up.</p>
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
            <span className="nh-eyebrow">10 nights, privately</span>
            <h2 className="nh-h2">Your route</h2>
            <p className="nh-sub">Rome to the coast — four stops, one seamless private journey.</p>
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
            <span className="nh-eyebrow">Reserve your dates</span>
            <h2 className="nh-h2">Plan your private journey</h2>
            <p className="nh-sub">Choose any departure date, add flights from your city, and confirm with a 20% deposit — the balance comes later.</p>
            <ul className="pi-book-points">
              <li><Check size={18} className="pi-ck" /> Private from the moment you land to the day you fly home</li>
              <li><Check size={18} className="pi-ck" /> All-inclusive — visa, insurance, stays, meals and transfers</li>
              <li><Check size={18} className="pi-ck" /> A dedicated curator, a message away throughout</li>
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
            <p className="pi-book-card__price">from <b>{inr(pp)}</b> / person</p>

            <div className="pi-fld">
              <label htmlFor="pi-date">Departure date — any day you like</label>
              <input id="pi-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>

            <div className="pi-fld">
              <label>Travellers</label>
              <div className="pi-qty">
                <button onClick={() => setPax((p) => Math.max(1, p - 1))} aria-label="Fewer travellers"><Minus size={16} /></button>
                <input value={pax} readOnly aria-label="Number of travellers" />
                <button onClick={() => setPax((p) => p + 1)} aria-label="More travellers"><Plus size={16} /></button>
              </div>
            </div>

            <div className="pi-ftog">
              <div className={`pi-sw ${flight ? 'is-on' : ''}`} role="switch" aria-checked={flight} tabIndex={0}
                onClick={() => setFlight((f) => !f)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setFlight((f) => !f))} />
              <div style={{ flex: 1 }}>
                <div className="pi-ft">Add flights from your city</div>
                <div className="pi-fs">Live return fares, added to the package</div>
              </div>
            </div>

            {flight && (
              <>
                <div className="pi-fld">
                  <label htmlFor="pi-city">Departure city</label>
                  <select id="pi-city" value={city} onChange={(e) => setCity(e.target.value)}>
                    {cities.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="pi-live"><span className="pi-dot" /> Live fare loaded · confirmed at checkout</div>
              </>
            )}

            <div className="pi-pay">
              <button className={`pi-po ${pay === 'd' ? 'is-sel' : ''}`} onClick={() => setPay('d')}>
                <div className="pi-pt">Pay a deposit</div>
                <div className="pi-pa">{inr(dep)}</div>
                <div className="pi-ps">20% to confirm</div>
              </button>
              <button className={`pi-po ${pay === 'f' ? 'is-sel' : ''}`} onClick={() => setPay('f')}>
                <div className="pi-pt">Pay in full</div>
                <div className="pi-pa">{inr(sub)}</div>
                <div className="pi-ps">settle today</div>
              </button>
            </div>

            <div className="pi-sum">
              <div className="pi-r"><span>Journey ×{pax}</span><span>{inr(BASE * pax)}</span></div>
              {flight && <div className="pi-r"><span>Flights ×{pax} ({city}, live)</span><span>{inr(FLIGHT * pax)}</span></div>}
              <div className="pi-r"><span>All-inclusive · taxes</span><span>Included</span></div>
              <div className="pi-r pi-tot">
                <span>{pay === 'd' ? 'Due today (deposit)' : 'Total today'}</span>
                <b>{pay === 'd' ? inr(dep) : inr(sub)}</b>
              </div>
              {pay === 'd' && <div className="pi-r"><span>Balance later</span><span>{inr(sub - dep)}</span></div>}
            </div>

            <button className="nh-btn nh-btn--orange" style={{ width: '100%', justifyContent: 'center', marginTop: 16, padding: '16px' }} onClick={reserve}>
              {reserveLabel}
            </button>
            <div className="pi-secbar"><Lock size={14} /> Secure 256-bit checkout · deposit protected</div>
          </div>
        </div>
      </section>

      {/* ===== INCLUDED / NOT INCLUDED ===== */}
      <section className="pi-section" id="included">
        <div className="nh-container pi-inex-grid">
          <div className="pi-inex">
            <span className="nh-eyebrow">Included, privately</span>
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
          <div className="pi-curator__av">DM</div>
          <div className="pi-curator__txt">
            <span className="nh-eyebrow nh-eyebrow--light">Your Italy curator</span>
            <h2>David Menezes</h2>
            <div className="pi-curator__rr">Designs every private Italy journey personally</div>
            <div className="pi-curator__hours"><span className="pi-dot" /> Available now · 9am–9pm</div>
          </div>
          <div className="pi-curator__acts">
            <a className="nh-btn nh-btn--orange" href="tel:+918556001700"><Phone size={14} /> Call David</a>
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
            <div className="nh-tl__item"><span className="nh-tl__year">Today</span><span className="nh-tl__lbl">Private, bespoke travel</span></div>
          </div>
          <a href="#book" className="nh-btn nh-btn--ghost">Plan your private journey <ArrowRight size={15} /></a>
        </div>
      </section>

      {/* ===== WHAT COUPLES SAY (nh-revs gallery design) ===== */}
      <section className="nh-revs" id="reviews">
        <div className="nh-container">
          <div className="nh-revs__head">
            <span className="nh-eyebrow">What couples say</span>
            <h2 className="nh-h2">Real journeys, captured by real couples</h2>
            <p className="nh-sub">Tap any photo to see the moments that made the trip — straight from the two who lived it.</p>
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
                  <span className="nh-revs__count">{tIndex + 1} / {coupleStories.length}</span>
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
            <p className="nh-sub">If Italy isn't the one, here's a little of what else we craft.</p>
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
          <h2>Begin your private <em>Italy</em></h2>
          <p>Any date, flights from your city, just the two of you — and a curator who handles every detail.</p>
          <div className="pi-cta-band__btns">
            <a href="#book" className="nh-btn nh-btn--orange">Plan your private journey <ArrowRight size={15} /></a>
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
                <p>Pick any departure date in the booking panel to continue.</p>
              </>
            )}

            {modal.kind === 'checkout' && (
              <>
                <h3>Secure checkout</h3>
                <p>Romance of Italy, Privately · {date}</p>
                {flight && <p style={{ marginTop: 4, fontSize: '0.85rem' }}>Incl. flights from {city}</p>}
                <div className="pi-fr"><label>Lead traveller</label><input placeholder="Full name" /></div>
                <div className="pi-fr"><label>Phone</label><input placeholder="+91…" /></div>
                <div className="pi-fr"><label>Card</label><input placeholder="Card number" /></div>
                <button className="nh-btn nh-btn--orange" style={{ width: '100%', justifyContent: 'center', padding: 15 }} onClick={() => setModal({ kind: 'done' })}>
                  Pay {inr(pay === 'd' ? dep : sub)} securely
                </button>
                <p className="pi-note">Demo only — no payment taken.</p>
              </>
            )}

            {modal.kind === 'callback' && (
              <>
                <h3>Request a callback</h3>
                <p>David or an Italy curator will call — 9am to 9pm.</p>
                <div className="pi-fr"><label>Name</label><input placeholder="Full name" /></div>
                <div className="pi-fr"><label>Phone</label><input placeholder="+91…" /></div>
                <div className="pi-fr"><label>Rough dates &amp; party (optional)</label><input placeholder="e.g. Sep 2026, 2 travellers" /></div>
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
                    ? 'David will be in touch within the hour to design it with you.'
                    : 'A confirmation is on its way, and David will call to begin shaping your journey.'}
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
