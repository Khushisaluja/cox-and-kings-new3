import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import {
  ArrowRight, ArrowUpRight, Menu, X, Compass, UserRound, PenLine, LifeBuoy,
  Plane, BedDouble, Sparkles, FileCheck2, Headphones, ShieldCheck,
  Phone, MapPin, Mail, Check,
} from 'lucide-react';
import './Modern.css';

const img = (id, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

/* ---------------------------------------------------------------- DATA */

const NAV = [
  { label: 'By Destination', href: '#series' },
  { label: 'By Experience', href: '#series' },
  { label: 'By Style', href: '#series' },
  { label: 'Tailormade', href: '#contact' },
];

const PILLARS = [
  {
    icon: Compass,
    n: '01',
    t: 'Curated since 1758',
    d: 'Two and a half centuries of opening the world’s finest doors — the oldest travel company on earth, and the only one that can say it.',
  },
  {
    icon: UserRound,
    n: '02',
    t: 'A named specialist',
    d: 'Every journey is shaped by a Cox & Kings specialist who has walked the route themselves — not a call-centre, not an algorithm.',
  },
  {
    icon: PenLine,
    n: '03',
    t: 'Tailormade, never templated',
    d: 'Your itinerary is written for you alone — the pace, the rooms, the people you meet, all considered and yours to refine.',
  },
  {
    icon: LifeBuoy,
    n: '04',
    t: 'On-the-ground concierge',
    d: 'A 24/7 team and our own offices across India and abroad mean someone is always reachable while you travel — not just before you pay.',
  },
];

const STATS = [
  { num: '1758', lab: 'Established — before most nations existed' },
  { num: '267 yrs', lab: 'Of uninterrupted journey-making' },
  { num: '100+', lab: 'Destinations curated worldwide' },
  { num: '4.8★', lab: 'From 14,200 verified travellers' },
];

const PROCESS = [
  {
    day: 'Step 01',
    t: 'A conversation, not a form',
    d: 'You tell a specialist what you imagine. No quote engine, no checkout — just someone who has been there listening to what you want.',
  },
  {
    day: 'Step 02',
    t: 'Your proposal, written by hand',
    d: 'Within days you receive a tailormade journey — stays, routes and experiences chosen for you, with the reasoning behind each choice.',
  },
  {
    day: 'Step 03',
    t: 'Refined together',
    d: 'Change anything. Slow it down, add a region, move a room. We rework it as many times as it takes to feel like yours.',
  },
  {
    day: 'Step 04',
    t: 'Travel, with us beside you',
    d: 'From the first transfer to the last, a concierge and a 24/7 line stay with you. The trip is curated; the support is constant.',
  },
];

const INCLUSIONS = [
  { icon: Plane, t: 'International flights', d: 'Routed and ticketed for you, with seat and connection care built in.' },
  { icon: BedDouble, t: 'Hand-picked stays', d: 'Five-star and character hotels we have stayed in and vouch for personally.' },
  { icon: Sparkles, t: 'Expert curation', d: 'Private guides, rare access and experiences money alone cannot book.' },
  { icon: FileCheck2, t: 'Visa & documentation', d: 'Paperwork, permits and embassy steps handled end to end by our team.' },
  { icon: Headphones, t: '24/7 on-trip support', d: 'A real person on a real line in your timezone for the length of the trip.' },
  { icon: ShieldCheck, t: 'Comprehensive cover', d: 'Travel insurance and contingency planning so the unexpected stays small.' },
];

const SERIES = [
  {
    n: '01',
    t: 'Heritage Journeys',
    d: 'Walled cities, palace stays and the stories behind them — India and beyond, read by people who know the history first-hand.',
    meta: [['Pace', 'Unhurried'], ['Best for', 'Culture seekers'], ['Sample', 'Rajasthan · 12 nights']],
    img: 'photo-1524492412937-b28074a5d7da',
  },
  {
    n: '02',
    t: 'Honeymoons & Anniversaries',
    d: 'Private, quiet and impossibly romantic. Overwater villas, candlelit terraces and the kind of access that makes a once-in-a-lifetime feel like it.',
    meta: [['Pace', 'Slow'], ['Best for', 'Couples'], ['Sample', 'Italy · 9 nights']],
    img: 'photo-1502602898657-3e91760cbb34',
  },
  {
    n: '03',
    t: 'Family Odysseys',
    d: 'Journeys that hold a grandparent, a teenager and a toddler at once — comfort, pacing and wonder calibrated for every generation travelling.',
    meta: [['Pace', 'Balanced'], ['Best for', 'Multi-gen'], ['Sample', 'Japan · 11 nights']],
    img: 'photo-1503220317375-aaad61436b1b',
  },
  {
    n: '04',
    t: 'Wellness Retreats',
    d: 'Himalayan spa sanctuaries, ocean-edge yoga and forest silence — unwound itineraries built around rest rather than itinerary.',
    meta: [['Pace', 'Restorative'], ['Best for', 'Solo & couples'], ['Sample', 'Kerala · 7 nights']],
    img: 'photo-1506905925346-21bda4d32df4',
  },
  {
    n: '05',
    t: 'Escorted Group Tours',
    d: 'Small, like-minded groups led by a Cox & Kings tour manager. Senior-friendly pacing, every detail handled, and only ever a dozen guests.',
    meta: [['Group', 'Max 12 guests'], ['Best for', 'First-timers'], ['Next', 'Departs Nov 3 · 3 seats']],
    img: 'photo-1516483638261-f4dbaf036963',
  },
];

const SPECIALISTS = [
  {
    name: 'Aarushi Menon',
    role: 'Japan & East Asia Specialist',
    quote: '“I’ve walked every route I sell — I plan the trip I’d want my own family to take.”',
    photo: 'photo-1494790108377-be9c29b29330',
    stats: [['14 yrs', 'with Cox & Kings'], ['600+', 'journeys curated']],
  },
  {
    name: 'Rohan Iyer',
    role: 'Italy & Mediterranean Specialist',
    quote: '“The difference is in the rooms you don’t find online and the people I can introduce you to.”',
    photo: 'photo-1507003211169-0a1dd7228f2d',
    stats: [['11 yrs', 'with Cox & Kings'], ['450+', 'journeys curated']],
  },
  {
    name: 'Sara Pinto',
    role: 'India & Heritage Specialist',
    quote: '“Two hundred and sixty years of relationships open doors that a booking site never will.”',
    photo: 'photo-1438761681033-6461ffad8d80',
    stats: [['17 yrs', 'with Cox & Kings'], ['800+', 'journeys curated']],
  },
];

const PRESS = [
  { src: '/press/cntraveller.svg', alt: 'Condé Nast Traveller' },
  { src: '/press/forbes.svg', alt: 'Forbes' },
  { src: '/press/harpers-bazaar.svg', alt: "Harper's Bazaar" },
  { src: '/press/natgeo.svg', alt: 'National Geographic' },
  { src: '/press/telegraph.svg', alt: 'The Telegraph' },
  { src: '/press/travel-leisure.svg', alt: 'Travel + Leisure' },
];

/* ------------------------------------------------------- scroll reveal */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.mv-reveal');
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-in'));
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ============================================================ PAGE */
export default function Modern() {
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [tab, setTab] = useState('tailormade');
  const [sent, setSent] = useState(false);
  const [lang, setLang] = useState('EN');
  const heroRef = useRef(null);

  useReveal();

  // top scroll progress bar
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  // hero meter fills as the hero scrolls past
  const { scrollYProgress: heroProg } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const meterScale = useTransform(heroProg, [0, 1], [0.04, 1]);
  const meterNum = useTransform(heroProg, (v) => `${String(Math.round(v * 100)).padStart(3, '0')} / 100`);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const submit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="mv">
      {/* top scroll progress */}
      <motion.div className="mv-scrollbar" style={{ scaleX: progress }} />

      {/* NAV */}
      <header className={`mv-nav ${solid ? 'mv-nav--solid' : 'mv-nav--over'}`}>
        <a className="mv-nav__brand" href="#top" aria-label="Cox & Kings home">
          <img className="mv-nav__logo" src="/cox-logo-new.png" alt="Cox & Kings" />
          <span className="mv-nav__est">Est. 1758</span>
        </a>
        <nav className="mv-nav__links">
          {NAV.map((n) => (
            <a key={n.label} href={n.href}>{n.label}</a>
          ))}
        </nav>
        <div className="mv-nav__right">
          <button className="mv-nav__lang" onClick={() => setLang(lang === 'EN' ? 'HI' : 'EN')}>
            {lang === 'EN' ? 'EN · हिं' : 'हिं · EN'}
          </button>
          <a className="mv-btn mv-btn--primary" href="#contact">
            Speak to a Specialist <ArrowRight />
          </a>
          <button
            className="mv-nav__burger"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
          >
            <span /><span /><span />
          </button>
        </div>
      </header>

      {/* MOBILE MENU */}
      <div className={`mv-mobile ${menuOpen ? 'mv-mobile--open' : ''}`}>
        <button
          className="mv-nav__burger"
          aria-label="Close menu"
          style={{ position: 'absolute', top: 18, right: 'var(--mv-edge)' }}
          onClick={() => setMenuOpen(false)}
        >
          <X color="#fff" size={28} />
        </button>
        {NAV.map((n) => (
          <a key={n.label} href={n.href} onClick={() => setMenuOpen(false)}>{n.label}</a>
        ))}
        <a className="mv-btn mv-btn--primary" href="#contact" onClick={() => setMenuOpen(false)}>
          Begin Your Journey <ArrowRight />
        </a>
      </div>

      {/* HERO */}
      <section className="mv-hero" id="top" ref={heroRef}>
        <div className="mv-hero__bg">
          <img src={img('photo-1524492412937-b28074a5d7da', 2000)} alt="A storied journey" />
        </div>
        <div className="mv-hero__scrim" />
        <div className="mv-hero__inner">
          <p className="mv-label mv-hero__eyebrow">
            Established 1758 &nbsp;·&nbsp; The world&rsquo;s oldest travel company
          </p>
          <h1 className="mv-hero__title">
            The world&rsquo;s most <em>storied</em> journeys, curated since 1758.
          </h1>
          <p className="mv-hero__sub">
            Not a booking engine. A travel institution — where a named specialist designs
            a journey for you alone, and stays with you from the first transfer to the last.
          </p>
          <div className="mv-hero__actions">
            <a className="mv-btn mv-btn--primary" href="#contact">Begin Your Journey <ArrowRight /></a>
            <a className="mv-btn mv-btn--ghost" href="#series">Explore Signature Journeys</a>
          </div>

          <div className="mv-hero__meter">
            <span className="mv-hero__meter-cap">Curated since 1758</span>
            <div className="mv-hero__meter-track">
              <motion.div className="mv-hero__meter-fill" style={{ scaleX: meterScale }} />
            </div>
            <motion.span className="mv-hero__meter-num">{meterNum}</motion.span>
          </div>
        </div>
      </section>

      {/* PILLARS */}
      <section className="mv-section mv-section--white">
        <div className="mv-head mv-reveal">
          <div className="mv-head__top">
            <div>
              <span className="mv-num-tag">01 — Why Cox &amp; Kings</span>
              <h2 className="mv-head__title">Four things a 267-year-old company can do that a website cannot.</h2>
            </div>
            <p className="mv-head__intro">
              Every recommendation in this audit traced back to one idea: build for belief, not just for booking.
              These are the four ways we do it.
            </p>
          </div>
        </div>
        <div className="mv-pillars__grid mv-reveal">
          {PILLARS.map((p) => {
            const I = p.icon;
            return (
              <div className="mv-pillar" key={p.n}>
                <div className="mv-pillar__ico"><I /></div>
                <div className="mv-pillar__n">{p.n}</div>
                <h3 className="mv-pillar__t">{p.t}</h3>
                <p className="mv-pillar__d">{p.d}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* HERITAGE BAND */}
      <section className="mv-section mv-section--dark mv-heritage">
        <div className="mv-heritage__inner">
          <div className="mv-reveal">
            <span className="mv-num-tag" style={{ color: 'rgba(255,255,255,0.5)' }}>02 — Heritage</span>
            <h2 className="mv-heritage__statement">
              We&rsquo;ve been doing this since <em>before the United States existed.</em>
            </h2>
            <p className="mv-heritage__lead">
              Founded in 1758 to serve the regiments and royal households of an earlier age,
              Cox &amp; Kings has spent more than two and a half centuries learning how to move
              people across the world beautifully. No competitor in travel can say the same.
            </p>
          </div>
          <div className="mv-heritage__stats mv-reveal">
            {STATS.map((s) => (
              <div key={s.lab}>
                <div className="mv-stat__num">{s.num}</div>
                <div className="mv-stat__lab">{s.lab}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS TIMELINE */}
      <section className="mv-section mv-section--paper">
        <div className="mv-head mv-reveal">
          <div className="mv-head__top">
            <div>
              <span className="mv-num-tag">03 — How it works</span>
              <h2 className="mv-head__title">How a Cox &amp; Kings journey comes together.</h2>
            </div>
            <p className="mv-head__intro">
              Luxury travel is decided over weeks, not minutes. There is no &ldquo;book now&rdquo; here —
              only a conversation that becomes a journey.
            </p>
          </div>
        </div>
        <div className="mv-proc__grid mv-reveal">
          {PROCESS.map((s) => (
            <div className="mv-proc__step" key={s.day}>
              <div className="mv-proc__day">{s.day}</div>
              <h3 className="mv-proc__t">{s.t}</h3>
              <p className="mv-proc__d">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* INCLUSIONS MATRIX */}
      <section className="mv-section mv-section--white">
        <div className="mv-head mv-reveal">
          <div className="mv-head__top">
            <div>
              <span className="mv-num-tag">04 — Always included</span>
              <h2 className="mv-head__title">Every journey arrives complete.</h2>
            </div>
            <p className="mv-head__intro">
              The price, when it comes, is one number that covers all of this — the value is
              established before the figure ever lands.
            </p>
          </div>
        </div>
        <div className="mv-incl__grid mv-reveal">
          {INCLUSIONS.map((c) => {
            const I = c.icon;
            return (
              <div className="mv-incl__cell" key={c.t}>
                <span className="mv-incl__ico"><I /></span>
                <div>
                  <h3 className="mv-incl__t">{c.t}</h3>
                  <p className="mv-incl__d">{c.d}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SIGNATURE SERIES */}
      <section className="mv-section mv-series" id="series">
        <div className="mv-head mv-reveal">
          <div className="mv-head__top">
            <div>
              <span className="mv-num-tag">05 — Signature Series</span>
              <h2 className="mv-head__title">Five ways to travel with us.</h2>
            </div>
            <p className="mv-head__intro">
              Named collections, each a product line of its own — not a filter. Choose the one that
              sounds like your kind of journey, and a specialist takes it from there.
            </p>
          </div>
        </div>
        <div className="mv-series__list mv-reveal">
          {SERIES.map((s) => (
            <article className="mv-series__row" key={s.n}>
              <div className="mv-series__n">{s.n}</div>
              <div className="mv-series__body">
                <h3 className="mv-series__t">{s.t}</h3>
                <p className="mv-series__d">{s.d}</p>
                <div className="mv-series__meta">
                  {s.meta.map(([k, v]) => (
                    <span key={k}>{k} · <strong>{v}</strong></span>
                  ))}
                </div>
                <a className="mv-btn mv-btn--link" href="#contact">
                  Start planning <ArrowUpRight size={15} />
                </a>
              </div>
              <div className="mv-series__media">
                <img src={img(s.img)} alt={s.t} loading="lazy" />
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* SPECIALISTS */}
      <section className="mv-section mv-section--cloud">
        <div className="mv-head mv-reveal">
          <div className="mv-head__top">
            <div>
              <span className="mv-num-tag">06 — The people</span>
              <h2 className="mv-head__title">Your journey has a name and a face.</h2>
            </div>
            <p className="mv-head__intro">
              Not a call-centre. A specialist who has travelled the region, knows the hoteliers by name,
              and is yours from first idea to homecoming.
            </p>
          </div>
        </div>
        <div className="mv-spec__grid mv-reveal">
          {SPECIALISTS.map((s) => (
            <article className="mv-spec__card" key={s.name}>
              <div className="mv-spec__photo">
                <img src={img(s.photo, 800)} alt={s.name} loading="lazy" />
              </div>
              <div className="mv-spec__body">
                <h3 className="mv-spec__name">{s.name}</h3>
                <div className="mv-spec__role">{s.role}</div>
                <p className="mv-spec__quote">{s.quote}</p>
                <div className="mv-spec__stats">
                  {s.stats.map(([n, l]) => (
                    <div key={l}><span>{n}</span><small>{l}</small></div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* PROOF */}
      <section className="mv-section mv-section--dark">
        <div className="mv-proof__inner mv-reveal">
          <p className="mv-label mv-proof__label">As featured in</p>
          <div className="mv-proof__press">
            {PRESS.map((p) => (
              <img key={p.alt} src={p.src} alt={p.alt} />
            ))}
          </div>
          <div className="mv-proof__stars">★★★★★</div>
          <blockquote className="mv-proof__quote">
            &ldquo;They didn&rsquo;t sell us a package. They listened, then handed us the trip we&rsquo;d
            been trying to describe for years.&rdquo;
          </blockquote>
          <div className="mv-proof__cite">
            Priya &amp; Anand Sharma · Tailormade Japan, 2025 · 4.8★ from 14,200 verified travellers
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="mv-section mv-contact" id="contact">
        <div className="mv-contact__grid">
          <div className="mv-reveal">
            <span className="mv-num-tag">07 — Begin</span>
            <h2 className="mv-contact__aside-title">Start planning with a Cox &amp; Kings specialist.</h2>
            <p className="mv-contact__aside-text">
              Tell us a little about the journey you have in mind. A specialist — a real person who
              knows your destination — will be in touch within one working day. No obligation, no checkout.
            </p>
            <div className="mv-contact__channels">
              <div className="mv-contact__channel">
                <Phone />
                <div>
                  <b>Speak to a Travel Expert</b>
                  <span>+91 22 6720 0000 · Mon–Sat, 9am–9pm IST</span>
                </div>
              </div>
              <div className="mv-contact__channel">
                <MapPin />
                <div>
                  <b>25 offices across India</b>
                  <span>Mumbai · Delhi · Bengaluru · Chennai · Kolkata &amp; more</span>
                </div>
              </div>
              <div className="mv-contact__channel">
                <Mail />
                <div>
                  <b>Write to us</b>
                  <span>journeys@coxandkings.com</span>
                </div>
              </div>
            </div>
          </div>

          <form className="mv-form mv-reveal" onSubmit={submit}>
            {sent && (
              <div className="mv-form__success">
                <Check />
                <span>Thank you — a Cox &amp; Kings specialist will be in touch within one working day.</span>
              </div>
            )}
            <div className="mv-seg" role="tablist" aria-label="Journey type">
              <button type="button" className={tab === 'tailormade' ? 'is-active' : ''} onClick={() => setTab('tailormade')}>
                Tailormade Journey
              </button>
              <button type="button" className={tab === 'group' ? 'is-active' : ''} onClick={() => setTab('group')}>
                Escorted Group Tour
              </button>
            </div>
            <div className="mv-field--row">
              <div className="mv-field">
                <label htmlFor="mv-name">Full name</label>
                <input id="mv-name" type="text" placeholder="Your name" required />
              </div>
              <div className="mv-field">
                <label htmlFor="mv-phone">Phone</label>
                <input id="mv-phone" type="tel" placeholder="+91" required />
              </div>
            </div>
            <div className="mv-field--row">
              <div className="mv-field">
                <label htmlFor="mv-email">Email</label>
                <input id="mv-email" type="email" placeholder="you@email.com" required />
              </div>
              <div className="mv-field">
                <label htmlFor="mv-dest">Where to?</label>
                <input id="mv-dest" type="text" placeholder={tab === 'group' ? 'e.g. Scandinavia' : 'e.g. Japan, Italy…'} />
              </div>
            </div>
            <div className="mv-field">
              <label htmlFor="mv-msg">Tell us about the journey you imagine</label>
              <textarea id="mv-msg" placeholder="Dates, who's travelling, the kind of trip you have in mind…" />
            </div>
            <p className="mv-form__note">
              This is the start of a conversation, not a booking. Please don&rsquo;t share passport or
              payment details here — your specialist will guide those steps securely.
            </p>
            <button className="mv-btn mv-btn--primary" type="submit">
              {tab === 'group' ? 'Request Group Tour Details' : 'Start Planning'} <ArrowRight />
            </button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mv-footer">
        <div className="mv-footer__inner">
          <div className="mv-footer__top">
            <div>
              <img className="mv-footer__logo" src="/cox-logo-new.png" alt="Cox & Kings" />
              <p className="mv-footer__blurb">
                The world&rsquo;s oldest travel company. Curating storied journeys for discerning
                travellers since 1758.
              </p>
            </div>
            <div className="mv-footer__col">
              <h4>Travel</h4>
              <a href="#series">Heritage Journeys</a>
              <a href="#series">Honeymoons</a>
              <a href="#series">Family Odysseys</a>
              <a href="#series">Wellness Retreats</a>
              <a href="#series">Escorted Group Tours</a>
            </div>
            <div className="mv-footer__col">
              <h4>Company</h4>
              <a href="#top">Our Story, since 1758</a>
              <a href="#">Our Specialists</a>
              <a href="#">Offices Across India</a>
              <a href="#">CK Journal</a>
              <a href="#contact">Contact</a>
            </div>
            <div className="mv-footer__col">
              <h4>Plan</h4>
              <a href="#contact">Begin Your Journey</a>
              <a href="#contact">Speak to a Specialist</a>
              <a href="#">My CK Collection</a>
              <a href="#">Brochure Request</a>
            </div>
          </div>
          <div className="mv-footer__bottom">
            <span>© {new Date().getFullYear()} Cox &amp; Kings · Established 1758 · All rights reserved</span>
            <span className="mv-footer__lang">
              Language
              <button className={lang === 'EN' ? 'is-active' : ''} onClick={() => setLang('EN')}>EN</button>
              <button className={lang === 'HI' ? 'is-active' : ''} onClick={() => setLang('HI')}>हिं</button>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
