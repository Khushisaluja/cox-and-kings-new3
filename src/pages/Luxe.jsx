import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Menu, X, ArrowRight, ArrowLeft, ArrowUpRight, Star, MapPin, Compass,
  Calendar, Search, Phone, Sparkles, Send, ChevronDown, Quote,
  Instagram, Facebook, Youtube, Linkedin, Plus, Minus,
} from 'lucide-react';
import './Luxe.css';

/* ============================================================
   Cox & Kings — "Luxe" homepage (self-contained, route /luxe)
   Editorial-luxury + glassmorphism. Design tokens from design.md.
   Does not touch any existing page.
   ============================================================ */

const sizedUnsplash = (id, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

/* ---------- Nav ---------- */
const NAV = [
  { label: 'Destinations', href: '#destinations' },
  { label: 'Journeys', href: '#curated' },
  { label: 'Heritage', href: '#heritage' },
  { label: 'Reviews', href: '#reviews' },
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
const STAYS = [
  { name: 'Amankora, Bhutan', loc: 'Paro Valley, Himalayas', price: '₹2,40,000', rating: 4.9, cat: 'Private Villas', id: '1528127269322-539801943592' },
  { name: 'Aman Venice', loc: 'Grand Canal, Italy', price: '₹3,15,000', rating: 4.9, cat: 'Heritage Hotels', id: '1523906834658-6e24ef2386f9' },
  { name: 'Singita Sabi Sand', loc: 'Kruger, South Africa', price: '₹4,10,000', rating: 5.0, cat: 'Safari Lodges', id: '1547471080-7cc2caa01a7e' },
  { name: 'Soneva Fushi', loc: 'Baa Atoll, Maldives', price: '₹2,85,000', rating: 4.9, cat: 'Island Resorts', id: '1573843981267-be1999ff37cd' },
];

/* ---------- Destinations carousel (arch feature) ---------- */
const DESTS = [
  { name: 'Santorini, Greece', tags: ['Dramatic cliffs', 'Modern luxury', 'The Aegean Sea'], id: '1570077188670-e3a8d69ac5ff' },
  { name: 'Kyoto, Japan', tags: ['Cherry blossom', 'Ancient temples', 'Ryokan stays'], id: '1493976040374-85c8e12f0c0e' },
  { name: 'African Safari', tags: ['The Great Migration', 'Private reserves', 'Star beds'], id: '1516426122078-c23e76319801' },
  { name: 'Rajasthan, India', tags: ['Palace hotels', 'Desert forts', 'Royal heritage'], id: '1599661046289-e31897846e41' },
];

/* ---------- Photo-first reviews ---------- */
const REVIEWS = [
  { name: 'Kumar Biswas', trip: 'Vietnam · Tailor-Made', rating: 5, span: 'tall',
    text: 'They developed such a system that really works — every transfer, every detail handled. Travelling in a country where language was a barrier felt effortless.',
    id: '1528127269322-539801943592' },
  { name: 'Sunita Rao', trip: 'Japan · Cherry Blossom', rating: 5, span: 'wide',
    text: 'Flawless from start to finish. The cherry blossom viewing in Kyoto was a once-in-a-lifetime moment, arranged beautifully.',
    id: '1490806843957-31f4c9a91c65' },
  { name: 'Arjun & Meera', trip: 'Maldives · Honeymoon', rating: 5, span: '',
    text: 'An overwater villa, a private sandbank dinner, and not a single thing to worry about. Pure magic.',
    id: '1573843981267-be1999ff37cd' },
  { name: 'The Nair Family', trip: 'Switzerland · Family', rating: 5, span: '',
    text: 'Three generations, one unforgettable trip. The kids still talk about the Glacier Express.',
    id: '1530841377377-3ff06c0ca713' },
  { name: 'Rohan Kapoor', trip: 'Kenya · Safari', rating: 5, span: 'wide',
    text: 'We watched the migration cross the Mara at dawn. The lodge, the guides, the timing — all impeccable.',
    id: '1516426122078-c23e76319801' },
  { name: 'Priya Menon', trip: 'Italy · Private', rating: 5, span: 'tall',
    text: 'A private gondola, a chef in Tuscany, a guide who opened doors most tourists never see. Worth every rupee.',
    id: '1523906834658-6e24ef2386f9' },
];

const PRESS = ['CONDÉ NAST TRAVELLER', 'NATIONAL GEOGRAPHIC', 'TRAVEL + LEISURE', 'FORBES', 'ROBB REPORT', 'THE TELEGRAPH'];

/* ---------- Hooks ---------- */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.lx-reveal');
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
    <div className="lx-stat">
      <span className="lx-stat__num">{v}{suffix}</span>
      <span className="lx-stat__lbl">{label}</span>
    </div>
  );
}

export default function Luxe() {
  useReveal();
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [statIdx, setStatIdx] = useState(0);
  const [filter, setFilter] = useState('All');
  const [destIdx, setDestIdx] = useState(0);
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
  const dest = DESTS[destIdx];
  const nextDest = () => setDestIdx((i) => (i + 1) % DESTS.length);
  const prevDest = () => setDestIdx((i) => (i - 1 + DESTS.length) % DESTS.length);

  return (
    <div className="lx">
      <div className="lx-grain" aria-hidden="true" />

      {/* ============ HEADER ============ */}
      <header className={`lx-header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="lx-header__inner">
          <a href="#top" onClick={go('#top')} className="lx-logo" aria-label="Cox & Kings — home">
            <img src="/cox-logo-light.svg" alt="Cox & Kings" />
          </a>
          <nav className="lx-nav" aria-label="Primary">
            {NAV.map((n) => (
              <a key={n.label} href={n.href} onClick={go(n.href)} className="lx-nav__link">
                <span>{n.label}</span>
              </a>
            ))}
          </nav>
          <div className="lx-header__right">
            <a href="#contact" onClick={go('#contact')} className="lx-btn lx-btn--glass lx-header__cta">
              <Phone size={15} /> Speak to an Expert
            </a>
            <button className="lx-burger" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* ============ MOBILE / SLIDE-IN NAV (ZOOX-style glass panel) ============ */}
      <div className={`lx-menu ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen}>
        <div className="lx-menu__scrim" onClick={() => setMenuOpen(false)} />
        <div className="lx-menu__panel" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="lx-menu__top">
            <button className="lx-menu__close" aria-label="Close menu" onClick={() => setMenuOpen(false)}><X size={20} /></button>
            <img src="/cox-logo.svg" alt="Cox & Kings" className="lx-menu__logo" />
          </div>
          <nav className="lx-menu__primary" aria-label="Mobile primary">
            {NAV.map((n) => (
              <a key={n.label} href={n.href} onClick={go(n.href)}>
                {n.label}
                <span className="lx-menu__chev"><ArrowRight size={16} /></span>
              </a>
            ))}
          </nav>
          <div className="lx-menu__divider" />
          <div className="lx-menu__secondary">
            {NAV_SECONDARY.map((l) => (
              <a key={l} href="#curated" onClick={go('#curated')}>{l} <ArrowUpRight size={13} /></a>
            ))}
          </div>
          <div className="lx-menu__foot">
            <span className="lx-eyebrow">FOLLOW THE JOURNEY</span>
            <div className="lx-menu__social">
              <a href="#" aria-label="Instagram"><Instagram size={18} /></a>
              <a href="#" aria-label="Facebook"><Facebook size={18} /></a>
              <a href="#" aria-label="YouTube"><Youtube size={18} /></a>
              <a href="#" aria-label="LinkedIn"><Linkedin size={18} /></a>
            </div>
          </div>
        </div>
      </div>

      {/* ============ HERO ============ */}
      <section className="lx-hero" id="top" ref={heroRef}>
        <div className="lx-hero__bg" style={{ backgroundImage: `url(${sizedUnsplash('1570077188670-e3a8d69ac5ff', 2000)})` }} />
        <div className="lx-hero__veil" />
        <h2 className="lx-hero__ghost" aria-hidden="true">DISCOVER</h2>

        <div className="lx-hero__inner">
          <div className="lx-hero__left">
            <span className="lx-eyebrow lx-eyebrow--light lx-fade" style={{ '--d': '.1s' }}>THE WORLD'S MOST EXPERIENCED TRAVEL COMPANY · SINCE 1758</span>
            <h1 className="lx-hero__title">
              <span className="lx-fade" style={{ '--d': '.2s' }}>More than a</span>
              <span className="lx-fade" style={{ '--d': '.34s' }}>destination —</span>
              <em className="lx-fade" style={{ '--d': '.48s' }}>an inheritance.</em>
            </h1>
            <p className="lx-hero__sub lx-fade" style={{ '--d': '.62s' }}>
              For over two and a half centuries, we have crafted journeys for those who
              travel not to escape life, but to deepen it. Tailor-made, end to end.
            </p>

            {/* Glass search */}
            <form className="lx-search lx-fade" style={{ '--d': '.76s' }} onSubmit={(e) => e.preventDefault()} role="search">
              <label className="lx-search__field">
                <MapPin size={17} />
                <input type="text" placeholder="Where to?" aria-label="Destination" />
              </label>
              <span className="lx-search__div" />
              <label className="lx-search__field">
                <Compass size={17} />
                <input type="text" placeholder="What kind of trip?" aria-label="Experience" />
              </label>
              <span className="lx-search__div" />
              <label className="lx-search__field lx-search__field--when">
                <Calendar size={17} />
                <select defaultValue="" aria-label="When">
                  <option value="" disabled hidden>When?</option>
                  <option>Next 3 months</option>
                  <option>Later in 2026</option>
                  <option>2027 &amp; beyond</option>
                  <option>I'm flexible</option>
                </select>
              </label>
              <button type="submit" className="lx-search__btn" aria-label="Search journeys"><Search size={17} /><span>Search</span></button>
            </form>

            <a href="#reviews" onClick={go('#reviews')} className="lx-hero__rating lx-fade" style={{ '--d': '.9s' }}>
              <span className="lx-stars">{[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}</span>
              <strong>4.9</strong>
              <span>2,400+ traveller reviews</span>
              <ArrowRight size={15} />
            </a>
          </div>

          {/* Glass stat chips */}
          <div className="lx-hero__chips" aria-hidden="true">
            {HERO_STATS.map((s, i) => (
              <span key={s} className={`lx-chip ${i === statIdx ? 'is-active' : ''}`} style={{ '--i': i }}>{s}</span>
            ))}
          </div>
        </div>

        <a href="#curated" onClick={go('#curated')} className="lx-hero__scroll" aria-label="Scroll to explore">
          <span>Scroll to explore</span>
          <ChevronDown size={16} />
        </a>
      </section>

      {/* ============ CURATED STAYS (search + photo cards) ============ */}
      <section className="lx-curated" id="curated">
        <div className="lx-container">
          <div className="lx-sec-head lx-reveal">
            <span className="lx-eyebrow">OUR CURATIONS</span>
            <h2 className="lx-h2">A selection of exceptional<br />stays &amp; journeys</h2>
          </div>

          <div className="lx-filters lx-reveal">
            {FILTERS.map((f) => (
              <button key={f} className={`lx-filter ${filter === f ? 'is-on' : ''}`} onClick={() => setFilter(f)}>{f}</button>
            ))}
          </div>

          <div className="lx-stays">
            {stays.map((s, i) => (
              <article key={s.name} className="lx-stay lx-reveal" style={{ '--d': `${i * 0.08}s` }}>
                <div className="lx-stay__img" style={{ backgroundImage: `url(${sizedUnsplash(s.id, 900)})` }}>
                  <span className="lx-stay__rating"><Star size={12} fill="currentColor" /> {s.rating}</span>
                  <button className="lx-stay__go" aria-label={`View ${s.name}`}><ArrowUpRight size={18} /></button>
                </div>
                <div className="lx-stay__body">
                  <div>
                    <h3>{s.name}</h3>
                    <p className="lx-stay__loc"><MapPin size={13} /> {s.loc}</p>
                  </div>
                  <p className="lx-stay__price">{s.price}<small>/ person</small></p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ DESTINATIONS YOU'LL LOVE (arch carousel) ============ */}
      <section className="lx-dest" id="destinations">
        <div className="lx-container lx-dest__grid">
          <div className="lx-dest__intro lx-reveal">
            <span className="lx-eyebrow">EXPLORE</span>
            <h2 className="lx-h2">Destinations<br />you'll love</h2>
            <p className="lx-dest__copy">Hand-chosen by our specialists — each a world unto itself, each waiting to be made yours.</p>
            <div className="lx-dest__nav">
              <button onClick={prevDest} aria-label="Previous destination"><ArrowLeft size={18} /></button>
              <span className="lx-dest__count">{String(destIdx + 1).padStart(2, '0')} / {String(DESTS.length).padStart(2, '0')}</span>
              <button onClick={nextDest} aria-label="Next destination"><ArrowRight size={18} /></button>
            </div>
          </div>

          <div className="lx-dest__stage lx-reveal">
            <div className="lx-arch" key={dest.name}>
              <div className="lx-arch__img" style={{ backgroundImage: `url(${sizedUnsplash(dest.id, 1100)})` }} />
              <div className="lx-arch__tags">
                {dest.tags.map((t) => <span key={t} className="lx-tag">{t}</span>)}
              </div>
              <button className="lx-arch__go" aria-label={`Explore ${dest.name}`}><ArrowRight size={18} /></button>
              <h3 className="lx-arch__name">{dest.name}</h3>
            </div>
          </div>

          <div className="lx-dest__rail lx-reveal">
            {DESTS.map((d, i) => (
              <button key={d.name} className={`lx-thumb ${i === destIdx ? 'is-on' : ''}`} onClick={() => setDestIdx(i)}>
                <span className="lx-thumb__img" style={{ backgroundImage: `url(${sizedUnsplash(d.id, 300)})` }} />
                <span className="lx-thumb__no">{String(i + 1).padStart(2, '0')}</span>
                <span className="lx-thumb__name">{d.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ============ HERITAGE / TRUST ============ */}
      <section className="lx-heritage" id="heritage">
        <div className="lx-container lx-heritage__grid">
          <div className="lx-heritage__media lx-reveal">
            <div className="lx-heritage__photo lx-heritage__photo--main" style={{ backgroundImage: `url(${sizedUnsplash('1599661046289-e31897846e41', 900)})` }} />
            <div className="lx-heritage__card lx-glass">
              <span className="lx-eyebrow">SINCE 1758</span>
              <h4>Bespoke Itineraries</h4>
              <p>Each journey we curate is a masterpiece — crafted with care and precision to reflect you alone.</p>
              <div className="lx-heritage__photo lx-heritage__photo--inset" style={{ backgroundImage: `url(${sizedUnsplash('1523906834658-6e24ef2386f9', 600)})` }} />
            </div>
          </div>

          <div className="lx-heritage__text lx-reveal">
            <span className="lx-eyebrow">OUR HERITAGE</span>
            <h2 className="lx-h2">Crafting unforgettable<br />journeys since 1758</h2>
            <p className="lx-heritage__copy">
              From the age of sail to the era of bespoke travel, Cox &amp; Kings has guided generations
              of explorers across the globe. Our commitment to discretion, personalisation and
              seamless execution ensures every moment is nothing short of perfection.
            </p>
            <div className="lx-statband" ref={statsRef}>
              <Stat value={267} suffix="" label="Years of journeys" run={statsRun} />
              <span className="lx-statband__div" />
              <Stat value={100} suffix="+" label="Destinations" run={statsRun} />
              <span className="lx-statband__div" />
              <Stat value={98} suffix="%" label="Would travel again" run={statsRun} />
            </div>
            <a href="#contact" onClick={go('#contact')} className="lx-btn lx-btn--primary">Discover our story <ArrowRight size={16} /></a>
          </div>
        </div>
      </section>

      {/* ============ PHOTO-FIRST REVIEWS ============ */}
      <section className="lx-reviews" id="reviews">
        <div className="lx-container">
          <div className="lx-reviews__head lx-reveal">
            <div>
              <span className="lx-eyebrow">TRAVELLER STORIES</span>
              <h2 className="lx-h2">Real journeys, captured<br />by real travellers</h2>
            </div>
            <div className="lx-reviews__agg lx-glass">
              <span className="lx-stars lx-stars--lg">{[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}</span>
              <strong>4.9 / 5</strong>
              <span>from 2,400+ verified reviews</span>
            </div>
          </div>

          <div className="lx-wall">
            {REVIEWS.map((r, i) => (
              <figure key={r.name} className={`lx-rcard ${r.span ? `lx-rcard--${r.span}` : ''} lx-reveal`} style={{ '--d': `${(i % 3) * 0.08}s` }}>
                <div className="lx-rcard__img" style={{ backgroundImage: `url(${sizedUnsplash(r.id, 800)})` }} role="img" aria-label={`${r.trip} — photo by ${r.name}`} />
                <figcaption className="lx-rcard__glass lx-glass">
                  <div className="lx-rcard__meta">
                    <div>
                      <strong>{r.name}</strong>
                      <span>{r.trip}</span>
                    </div>
                    <span className="lx-stars">{[...Array(r.rating)].map((_, j) => <Star key={j} size={12} fill="currentColor" />)}</span>
                  </div>
                  <p className="lx-rcard__text"><Quote size={15} className="lx-rcard__q" />{r.text}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PRESS MARQUEE ============ */}
      <section className="lx-press" aria-label="As featured in">
        <div className="lx-press__label"><span className="lx-eyebrow">AS FEATURED IN</span></div>
        <div className="lx-press__track">
          {[...PRESS, ...PRESS].map((p, i) => <span key={i} className="lx-press__item">{p}</span>)}
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="lx-cta" id="contact">
        <div className="lx-cta__bg" style={{ backgroundImage: `url(${sizedUnsplash('1493976040374-85c8e12f0c0e', 1800)})` }} />
        <div className="lx-cta__veil" />
        <div className="lx-container lx-cta__inner lx-reveal">
          <span className="lx-eyebrow lx-eyebrow--light">BEGIN THE CONVERSATION</span>
          <h2 className="lx-cta__title">Your next journey deserves<br />a quarter-millennium of judgment.</h2>
          <p className="lx-cta__sub">Speak with a personal travel designer. No call centres, no scripts — just one expert who learns how you like to travel, and builds it around you.</p>
          <div className="lx-cta__actions">
            <a href="tel:+918556001700" className="lx-btn lx-btn--secondary lx-btn--lg"><Phone size={17} /> Speak to an Expert</a>
            <a href="#curated" onClick={go('#curated')} className="lx-btn lx-btn--glass lx-btn--lg">Browse journeys <ArrowRight size={16} /></a>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="lx-footer">
        <div className="lx-container lx-footer__top">
          <div className="lx-footer__brand">
            <img src="/cox-logo-light.svg" alt="Cox & Kings" />
            <p>The world's most experienced travel company.<br />Trusted by generations since 1758.</p>
            <div className="lx-footer__social">
              <a href="#" aria-label="Instagram"><Instagram size={17} /></a>
              <a href="#" aria-label="Facebook"><Facebook size={17} /></a>
              <a href="#" aria-label="YouTube"><Youtube size={17} /></a>
              <a href="#" aria-label="LinkedIn"><Linkedin size={17} /></a>
            </div>
          </div>
          <div className="lx-footer__cols">
            <div>
              <span className="lx-eyebrow">EXPLORE</span>
              <a href="#destinations" onClick={go('#destinations')}>Destinations</a>
              <a href="#curated" onClick={go('#curated')}>Curated Journeys</a>
              <a href="#heritage" onClick={go('#heritage')}>Our Heritage</a>
              <a href="#reviews" onClick={go('#reviews')}>Reviews</a>
            </div>
            <div>
              <span className="lx-eyebrow">COMPANY</span>
              <a href="#contact" onClick={go('#contact')}>Speak to an Expert</a>
              <a href="#">About Us</a>
              <a href="#">Press Room</a>
              <a href="#">Careers</a>
            </div>
            <div>
              <span className="lx-eyebrow">CONTACT</span>
              <a href="tel:+918556001700"><Phone size={13} /> +91 8556 001700</a>
              <a href="mailto:holidays@coxandkings.com">holidays@coxandkings.com</a>
            </div>
          </div>
        </div>
        <div className="lx-container lx-footer__bottom">
          <p>© 2026 Cox &amp; Kings. Est. 1758.</p>
          <div className="lx-footer__legal">
            <a href="#">Privacy</a><a href="#">Terms</a><a href="#">Cookies</a>
          </div>
        </div>
      </footer>

      {/* ============ MOBILE THUMB-REACH BAR ============ */}
      <div className="lx-thumbbar">
        <a href="tel:+918556001700" className="lx-thumbbar__cta"><Phone size={17} /> Speak to an Expert</a>
        <button className="lx-thumbbar__ai" aria-label="Open AI travel assistant" onClick={() => setChatOpen(true)}>
          <Sparkles size={20} />
        </button>
      </div>

      {/* ============ FLOATING AI BUTTON (desktop) ============ */}
      <button className={`lx-aifab ${chatOpen ? 'is-hidden' : ''}`} aria-label="Open AI travel assistant" onClick={() => setChatOpen(true)}>
        <Sparkles size={20} />
        <span>Ask our AI</span>
      </button>

      {/* ============ AI CHAT DRAWER ============ */}
      <div className={`lx-chat ${chatOpen ? 'open' : ''}`} aria-hidden={!chatOpen}>
        <div className="lx-chat__panel lx-glass" role="dialog" aria-modal="true" aria-label="AI travel assistant">
          <div className="lx-chat__head">
            <div className="lx-chat__id">
              <span className="lx-chat__avatar"><Sparkles size={16} /></span>
              <div>
                <strong>Kings — AI Travel Designer</strong>
                <span className="lx-chat__status"><i /> Online · replies instantly</span>
              </div>
            </div>
            <button className="lx-chat__close" aria-label="Close assistant" onClick={() => setChatOpen(false)}><X size={18} /></button>
          </div>
          <div className="lx-chat__body">
            <div className="lx-chat__msg lx-chat__msg--bot">
              Namaste 👋 I'm Kings. Tell me where you'd love to go, and I'll sketch a tailor-made journey — or connect you to a human expert.
            </div>
            <div className="lx-chat__chips">
              <button>Honeymoon in the Maldives</button>
              <button>Family trip to Japan</button>
              <button>Safari in Kenya</button>
            </div>
          </div>
          <form className="lx-chat__input" onSubmit={(e) => e.preventDefault()}>
            <input type="text" placeholder="Ask anything about your trip…" aria-label="Message" />
            <button type="submit" aria-label="Send"><Send size={16} /></button>
          </form>
        </div>
      </div>
    </div>
  );
}
