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
import { SmartLink as Link, CALLBACK } from '../components/ScheduleCall';
import { motion, useScroll, useTransform, useReducedMotion, AnimatePresence } from 'framer-motion';
import {
  Phone, MessageCircle, ArrowRight, ArrowUpRight, Star, Play,
  Search, MapPin, Compass, Calendar, Menu, X, ChevronDown,
  Bot, Instagram, Facebook, Youtube, Linkedin, ChevronUp, Send, Sparkles,
} from 'lucide-react';
import {
  img, CONTACT, STATS, RATING, PRESS, PATHS, DESTINATIONS,
  ASSURANCE, JOURNEYS, REVIEWS, CURATIONS, EXPERTS, REELS,
  HERO_DESTINATIONS, HERO_TRIP_TYPES, HERO_WHEN,
} from '../data/v3content';
import './Home2026.css';

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

export default function Home2026() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [where, setWhere] = useState(HERO_DESTINATIONS[0]);
  const [style, setStyle] = useState(HERO_TRIP_TYPES[0]);
  const [when, setWhen] = useState(HERO_WHEN[0]);
  const [chatOpen, setChatOpen] = useState(false);
  const [activeReel, setActiveReel] = useState(null); // index into REELS, or null

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Lock body scroll while the menu or a reel is open. */
  useEffect(() => {
    const lock = menuOpen || activeReel !== null;
    document.body.style.overflow = lock ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen, activeReel]);

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
            <Link to={CALLBACK} onClick={() => setMenuOpen(false)}>Contact <ArrowUpRight size={13} /></Link>
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
            <WordReveal text="More than a destination —" />
            <br />
            <WordReveal text="it's a journey." accent={[2]} delay={0.25} />
          </h1>

          <Reveal className="h26-hero-sub" as="p" delay={0.5}>
            Tailor-made and escorted holidays to over 100 countries, shaped by
            specialists who have walked the road themselves.
          </Reveal>

          {/* Price anchor — answer the "how much?" question above the fold */}
          <Reveal className="h26-hero-anchor" as="p" delay={0.55}>
            Escorted group tours <strong>from ₹95,000</strong> · tailor-made trips designed around you
          </Reveal>

          {/* Directed search dock — chips instead of a blank field */}
          <Reveal className="h26-search" delay={0.65}>
            <div className="h26-search-bar">
              <label className="h26-search-seg">
                <span className="h26-search-label"><MapPin size={13} /> Where</span>
                <span className="h26-search-control">
                  <select value={where} onChange={(e) => setWhere(e.target.value)} aria-label="Where to">
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

        {/* INTRO — scattered floating grid + centered statement */}
        <section className="h26-intro" ref={scatterRef}>
          {SCATTER.map((s, i) => (
            <motion.img
              key={s.c}
              style={{ y: [drift1, drift2, drift3, drift2, drift1, drift3, drift1][i] }}
              whileHover={{ scale: 1.14, rotate: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
              className={`h26-scatter ${s.c}`}
              src={s.src}
              alt=""
              loading="lazy"
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

        {/* PATHS — how would you like to travel */}
        <section className="h26-section" id="paths">
          <div className="h26-head">
            <Reveal className="h26-label" as="p">Start here</Reveal>
            <Reveal as="h2" className="h26-h2" delay={0.05}>
              How would you like to travel?
            </Reveal>
          </div>
          <div className="h26-paths">
            {PATHS.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <Link to={p.to} className={`h26-path${p.accent ? ' is-accent' : ''}`}>
                  <span className="h26-path-num">0{i + 1}</span>
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                  <span className="h26-path-cta">{p.cta} <ArrowRight size={16} /></span>
                </Link>
              </Reveal>
            ))}
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
              <Reveal key={d.name} className={`h26-dest h26-dest-${DEST_SPANS[i]}`} delay={(i % 4) * 0.06}>
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
          <div className="h26-journeys">
            {JOURNEYS.slice(0, 5).map((j, i) => (
              <Reveal key={j.title} className={`h26-jrn${j.lead ? ' is-lead' : ''}`} delay={(i % 3) * 0.06}>
                <Link to="/tours" className="h26-jrn-link">
                  <img src={img(j.image, j.lead ? 1100 : 700)} alt={j.title} loading="lazy" />
                  <div className="h26-jrn-veil" />
                  <div className="h26-jrn-body">
                    {j.season && <span className="h26-jrn-season">{j.season}</span>}
                    <h3>{j.title}</h3>
                    <p>{j.blurb}</p>
                    <span className="h26-jrn-meta">
                      {j.nights && <span>{j.nights}</span>}
                      {j.priceFrom && <span className="h26-jrn-price">from {j.priceFrom}</span>}
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
              const expert = EXPERTS.find((e) => e.name === c.specialist);
              return (
                <Reveal key={c.name} className="h26-cur-card" delay={i * 0.07}>
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
                    <Link to={CALLBACK} className="h26-cur-cta">Request this trip <ArrowRight size={15} /></Link>
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
          <div className="h26-reels">
            {REELS.map((r, i) => (
              <Reveal key={r.id} className="h26-reel" delay={(i % 4) * 0.05}>
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
          <div className="h26-marquee">
            <div className="h26-marquee-track">
              {[...REVIEWS, ...REVIEWS].map((r, i) => (
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
              <Link to={CALLBACK} className="h26-btn h26-btn-glass h26-btn-lg"><Phone size={16} /> Request a callback</Link>
            </Reveal>
            <Reveal as="p" className="h26-cta2-hours" delay={0.2}>Travel experts available 9am–9pm IST, every day · or browse journeys below</Reveal>
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
                <Link to={CALLBACK}>Bespoke holidays</Link>
                <Link to="/tours">Luxury journeys</Link>
                <Link to="/destinations">Destinations</Link>
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
                <Link to={CALLBACK}><Send size={15} /> Send an enquiry</Link>
              </div>
            </div>
          </motion.div>
        )}
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
