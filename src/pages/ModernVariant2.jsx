import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react';
import './ModernVariant2.css';

/* ============================================================
   Cox & Kings — "Modern Variant 2"  (route /modern-variant-2)
   A cinematic, by-invitation editorial homepage modelled on the
   second reference motion study ("The Obsidian Assembly"):
     · a giant 3-line serif headline wrapping a central object
     · scattered all-caps annotations, cream pill navigation
     · dark <-> ivory stage transitions on scroll
     · a mosaic gallery + circular-arrow carousels
     · portrait journey cards with roman-numeral / n-of-total labels
     · a big-type footer menu joined by a hand-drawn connector line
   Re-skinned with design.md tokens (Voyager Blue / Sienna Flame /
   warm paper · Zodiak + Work Sans) and Cox & Kings heritage content
   (Est. 1758, a "private travel atelier"). Self-contained, scoped
   under .mv2 — touches no other page.
   ============================================================ */

const img = (id, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

/* Word-by-word reveal — spaces are text nodes BETWEEN inline-block spans */
function RevealWords({ text, accent = [] }) {
  const words = text.split(' ');
  return (
    <span className="mv2-rw">
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="mv2-rw__w" style={{ transitionDelay: `${i * 55}ms` }}>
            <span className={accent.includes(i) ? 'mv2-em' : ''}>{w}</span>
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </Fragment>
      ))}
    </span>
  );
}

const NAV = [
  ['Destinations', '#gallery'],
  ['Journeys', '#journeys'],
  ['Places', '#places'],
  ['About', '#footer'],
  ['People', '#footer'],
  ['Contact', '#enquire'],
];

const GALLERY = [
  ['1582719478250-c89cae4dc85b', 'A glass pavilion above the bay'],
  ['1564013799919-ab600027ffc6', 'A villa courtyard at dusk'],
  ['1571003123894-1f0594d2b5d9', 'A heritage suite, lamplit'],
  ['1591088398332-8a7791972843', 'A garden terrace in spring'],
  ['1618773928121-c32242e63f39', 'A private library lounge'],
];

const COLLECTION = [
  ['1506905925346-21bda4d32df4', 'The Alpine Reserve'],
  ['1528127269322-539801943592', 'The Lantern Quarter'],
  ['1512453979798-5ea266f8880c', 'The Desert Palace'],
];

const JOURNEYS = [
  ['I', '1524492412937-b28074a5d7da', 'The Maharajas’ Trail', 'India · 9 nights',
    'Rajasthan’s palaces by private car and royal rail, with doors that open only for our travellers.'],
  ['II', '1493976040374-85c8e12f0c0e', 'Kyoto in Winter', 'Japan · 7 nights',
    'Temples before the gates open, a tea house that takes no strangers, and snow on the old streets.'],
  ['III', '1516483638261-f4dbaf036963', 'The Tuscan Estate', 'Italy · 6 nights',
    'A family-owned vineyard taken in full, its cellar, its kitchen, and its hills, for you alone.'],
  ['IV', '1539367628448-4bc5c9d171c8', 'The Alpine Crossing', 'Switzerland · 8 nights',
    'A private carriage on the great panoramic line, ending at a chalet kept off every listing.'],
];

export default function ModernVariant2() {
  const rootRef = useRef(null);
  const dragX = useRef(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [collIdx, setCollIdx] = useState(0);
  const [jrnIdx, setJrnIdx] = useState(0);
  const [sent, setSent] = useState(false);

  /* Scroll engine: parallax (--py), scale+fade grow (--gs/--go),
     hero stage progress (--stage), and a top progress fill (--prog). */
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const parallax = Array.from(root.querySelectorAll('[data-speed]'));
    const growers = Array.from(root.querySelectorAll('[data-grow]'));
    const scaleEls = [...new Set([...parallax, ...growers])];
    const hero = root.querySelector('.mv2-hero');
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);
    const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

    /* Parametric flight route, in % of viewport (matches the fixed 0..100 SVG).
       The plane banks left/right (sine) while descending take-off -> landing. */
    const fx = (t) => clamp(50 + 33 * Math.sin(t * 2.4 * Math.PI - 0.4), 7, 93);
    const fy = (t) => 16 + 60 * easeInOut(clamp(t, 0, 1));
    const buildPath = (to, n) => {
      let d = `M ${fx(0).toFixed(2)} ${fy(0).toFixed(2)}`;
      for (let i = 1; i <= n; i++) { const t = (to * i) / n; d += ` L ${fx(t).toFixed(2)} ${fy(t).toFixed(2)}`; }
      return d;
    };
    const plane = root.querySelector('.mv2-plane');
    const routeDone = root.querySelector('.mv2-route__done');
    const routePlan = root.querySelector('.mv2-route__plan');
    if (routePlan) routePlan.setAttribute('d', buildPath(1, 150));

    let raf = null;
    const update = () => {
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const doc = document.documentElement;
      const p = clamp(window.scrollY / (doc.scrollHeight - vh || 1), 0, 1);
      root.style.setProperty('--prog', p.toFixed(4));

      if (plane) {
        const dt = 0.006;
        const x0 = fx(p), y0 = fy(p);
        const x1 = fx(Math.min(1, p + dt)), y1 = fy(Math.min(1, p + dt));
        const dx = ((x1 - x0) / 100) * vw, dy = ((y1 - y0) / 100) * vh;
        plane.style.left = `${x0.toFixed(2)}%`;
        plane.style.top = `${y0.toFixed(2)}%`;
        plane.style.setProperty('--head', `${(Math.atan2(dx, -dy) * 180 / Math.PI).toFixed(1)}deg`);
        plane.style.setProperty('--ps', (0.78 + 0.36 * Math.sin(p * Math.PI)).toFixed(3));
        plane.style.setProperty('--bank', `${clamp(dx * 1.1, -24, 24).toFixed(1)}deg`);
      }
      if (routeDone) routeDone.setAttribute('d', buildPath(Math.max(0.0001, p), Math.max(2, Math.round(p * 150))));

      if (hero) {
        const stage = clamp(window.scrollY / (vh * 0.85), 0, 1);
        root.style.setProperty('--stage', stage.toFixed(4));
      }
      for (const el of parallax) {
        const r = el.getBoundingClientRect();
        const delta = r.top + r.height / 2 - vh / 2;
        el.style.setProperty('--py', `${(-delta * (parseFloat(el.dataset.speed) || 0)).toFixed(1)}px`);
      }
      for (const el of scaleEls) {
        const r = el.getBoundingClientRect();
        const p = easeOut(clamp((vh - r.top) / (vh * 0.66), 0, 1));
        const min = parseFloat(el.dataset.grow) || (el.dataset.speed ? 0.8 : 0.9);
        el.style.setProperty('--gs', (min + (1 - min) * p).toFixed(3));
        el.style.setProperty('--go', (0.12 + 0.88 * p).toFixed(3));
      }
      raf = null;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  /* One-shot reveals */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }),
      { threshold: 0.16, rootMargin: '0px 0px -8% 0px' }
    );
    root.querySelectorAll('.mv2-reveal, .mv2-rw').forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  /* Mobile menu: scroll lock + Escape */
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, [menuOpen]);

  /* Pointer-driven 3D tilt + magnetic micro-interactions (fine pointers, motion-safe) */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const cleanups = [];
    root.querySelectorAll('[data-tilt]').forEach((el) => {
      const max = parseFloat(el.dataset.tilt) || 8;
      const onMove = (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--ry', `${(((e.clientX - r.left) / r.width - 0.5) * max).toFixed(2)}deg`);
        el.style.setProperty('--rx', `${((0.5 - (e.clientY - r.top) / r.height) * max).toFixed(2)}deg`);
      };
      const onLeave = () => { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); };
      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseleave', onLeave);
      cleanups.push(() => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave); });
    });
    root.querySelectorAll('[data-magnetic]').forEach((el) => {
      const str = parseFloat(el.dataset.magnetic) || 0.3;
      const onMove = (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${((e.clientX - (r.left + r.width / 2)) * str).toFixed(1)}px`);
        el.style.setProperty('--my', `${((e.clientY - (r.top + r.height / 2)) * str).toFixed(1)}px`);
      };
      const onLeave = () => { el.style.setProperty('--mx', '0px'); el.style.setProperty('--my', '0px'); };
      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseleave', onLeave);
      cleanups.push(() => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave); });
    });
    return () => cleanups.forEach((f) => f());
  }, []);

  /* Count-up stats when scrolled into view */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target; io.unobserve(el);
        const target = parseFloat(el.dataset.count) || 0;
        const suffix = el.dataset.suffix || '';
        if (reduce) { el.textContent = target + suffix; return; }
        const dur = 1200, start = performance.now();
        const tick = (now) => {
          const p = Math.min(1, (now - start) / dur);
          el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.6 });
    root.querySelectorAll('[data-count]').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const move = (setter, len) => (dir) => setter((i) => (i + dir + len) % len);
  const moveColl = move(setCollIdx, COLLECTION.length);
  const moveJrn = move(setJrnIdx, JOURNEYS.length);

  return (
    <div className="mv2" ref={rootRef}>
      <a className="mv2-skip" href="#mv2-main">Skip to content</a>
      <div className="mv2-progress" aria-hidden="true" />

      {/* Immersive scroll-driven flight: a route drawn across the whole page
          and a plane that banks along it in 3D, taking off at the hero and
          descending toward the footer. Purely decorative. */}
      <svg className="mv2-route" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path className="mv2-route__plan" fill="none" vectorEffect="non-scaling-stroke" />
        <path className="mv2-route__done" fill="none" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="mv2-plane" aria-hidden="true">
        <span className="mv2-plane__craft">
          <svg className="mv2-plane__svg" viewBox="0 0 64 64">
            <path d="M32 3 L36 22 L60 40 L60 46 L36 35 L34 52 L44 59 L44 62 L32 57 L20 62 L20 59 L30 52 L28 35 L4 46 L4 40 L28 22 Z" />
          </svg>
        </span>
      </div>

      {/* ---------------- Header ---------------- */}
      <header className="mv2-head">
        <a className="mv2-brand" href="/modern-variant-2" aria-label="Cox & Kings — Established 1758">
          <span className="mv2-brand__name">Cox &amp; Kings</span>
          <span className="mv2-brand__tag">Established 1758</span>
        </a>

        <nav className="mv2-pills" aria-label="Primary">
          <a className="mv2-pill" href="#gallery">Destinations</a>
          <a className="mv2-pill" href="#journeys">Journeys</a>
        </nav>

        <div className="mv2-head__right">
          <a className="mv2-pill mv2-pill--ghost mv2-head__enq" href="#enquire">Send request</a>
          <button
            className={`mv2-menubtn ${menuOpen ? 'is-open' : ''}`}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mv2-menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="mv2-menubtn__lines"><span /><span /></span>
            <span className="mv2-menubtn__label">{menuOpen ? 'Close' : 'Menu'}</span>
          </button>
        </div>
      </header>

      {/* ---------------- Mobile / full menu ---------------- */}
      <div id="mv2-menu" className={`mv2-menu ${menuOpen ? 'is-open' : ''}`} role="dialog" aria-modal="true" aria-label="Menu" hidden={!menuOpen}>
        <nav className="mv2-menu__nav" aria-label="Full">
          {NAV.map(([label, href], i) => (
            <a key={label} href={href} onClick={() => setMenuOpen(false)} style={{ transitionDelay: `${0.05 * i + 0.1}s` }}>{label}</a>
          ))}
        </nav>
        <span className="mv2-menu__note">A private travel atelier · Established 1758</span>
      </div>

      <main id="mv2-main">
        {/* ---------------- Hero ---------------- */}
        <section className="mv2-hero">
          <span className="mv2-horizon" aria-hidden="true" />

          {/* destinations peeking in from the edges */}
          <figure className="mv2-frame mv2-frame--bl" data-speed="0.05">
            <img src={img('1493976040374-85c8e12f0c0e', 520)} alt="A lantern-lit street in Kyoto" loading="eager" />
            <figcaption>Kyoto</figcaption>
          </figure>
          <figure className="mv2-frame mv2-frame--br" data-speed="0.08">
            <img src={img('1445019980597-93fa8acb246c', 520)} alt="A sunlit colonnade in Lisbon" loading="eager" />
            <figcaption>Lisbon</figcaption>
          </figure>

          <div className="mv2-hero__center">
            <span className="mv2-hero__eyebrow mv2-reveal">Established 1758 · The world&apos;s oldest travel company</span>
            <h1 className="mv2-hero__title">
              <span className="mv2-reveal">We chart</span>
              <span className="mv2-reveal mv2-em">the way.</span>
            </h1>
            <p className="mv2-hero__sub mv2-reveal">
              For over two and a half centuries we have drawn the routes others follow — escorted tours,
              bespoke holidays and private journeys across 100+ destinations. Start scrolling, and follow the flight.
            </p>
            <a className="mv2-seek mv2-reveal" href="#enquire" data-magnetic="0.35">
              <span>Begin your journey</span>
              <span className="mv2-seek__dot" aria-hidden="true" />
            </a>
            <div className="mv2-board mv2-reveal" aria-hidden="true">
              <span>EST · 1758</span><span className="mv2-board__x">✈</span>
              <span>100+ destinations</span><span className="mv2-board__x">✈</span>
              <span>1M+ travellers</span>
            </div>
          </div>

          <span className="mv2-scrollhint" aria-hidden="true">Follow the route</span>
        </section>

        {/* ---------------- Wipe / interstitial ---------------- */}
        <section className="mv2-wipe">
          <p className="mv2-wipe__name mv2-reveal">Cox &amp; Kings</p>
          <p className="mv2-wipe__sub mv2-reveal">Since 1758</p>
        </section>

        {/* ---------------- Gallery (dark) ---------------- */}
        <section className="mv2-gallery" id="gallery">
          <h2 className="mv2-section-h mv2-section-h--light mv2-reveal">
            <RevealWords text="Not everything is listed" accent={[2]} />
          </h2>

          <div className="mv2-mosaic">
            {[0, 1].map((g) => (
              <figure className={`mv2-tileimg mv2-tileimg--${g + 1}`} data-grow="0.88" data-tilt="7" key={g}>
                <img src={img(GALLERY[g][0], 700)} alt={GALLERY[g][1]} loading="lazy" />
                <figcaption className="mv2-tilecap">{GALLERY[g][1]}</figcaption>
              </figure>
            ))}

            {/* central carousel */}
            <div className="mv2-carousel mv2-carousel--center" role="group" aria-roledescription="carousel" aria-label="The Collection">
              <div className="mv2-carousel__viewport">
                <div className="mv2-carousel__track" style={{ transform: `translateX(-${collIdx * 100}%)` }}>
                  {COLLECTION.map(([id, name]) => (
                    <figure className="mv2-carousel__slide" key={name}>
                      <img src={img(id, 1000)} alt={name} loading="lazy" />
                      <figcaption>{name}</figcaption>
                    </figure>
                  ))}
                </div>
              </div>
              <span className="mv2-carousel__eyebrow">The Collection</span>
              <div className="mv2-carousel__ctrls">
                <button className="mv2-circ" data-magnetic="0.4" onClick={() => moveColl(-1)} aria-label="Previous destination">‹</button>
                <button className="mv2-circ" data-magnetic="0.4" onClick={() => moveColl(1)} aria-label="Next destination">›</button>
              </div>
              <span className="mv2-carousel__count" aria-hidden="true">{collIdx + 1} / {COLLECTION.length}</span>
            </div>

            {[2, 3, 4].map((g) => (
              <figure className={`mv2-tileimg mv2-tileimg--${g + 1}`} data-grow="0.88" data-tilt="7" key={g}>
                <img src={img(GALLERY[g][0], 700)} alt={GALLERY[g][1]} loading="lazy" />
                <figcaption className="mv2-tilecap">{GALLERY[g][1]}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* ---------------- Full-bleed takeover ---------------- */}
        <section className="mv2-takeover" aria-label="The Grand Tour">
          <figure className="mv2-takeover__img" data-speed="0.06" data-grow="0.92">
            <img src={img('1523906834658-6e24ef2386f9', 1600)} alt="A grand room opening onto a canal" loading="lazy" />
          </figure>
          <div className="mv2-takeover__cap mv2-reveal">
            <span className="mv2-eyebrow mv2-eyebrow--light">Inner chamber</span>
            <p>The Grand Tour, reimagined</p>
          </div>
        </section>

        {/* ---------------- Places (ivory) ---------------- */}
        <section className="mv2-places" id="places">
          <svg className="mv2-map" viewBox="0 0 600 300" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
            <path d="M40 120 q60 -40 120 -10 t140 0 t160 -20 M60 180 q80 30 160 10 t180 -10 M30 90 q50 10 90 0" fill="none" stroke="currentColor" strokeWidth="0.7" opacity="0.5" />
          </svg>

          <div className="mv2-places__lead mv2-reveal">
            <h2 className="mv2-section-h">These journeys aren’t broadly advertised.</h2>
            <p className="mv2-places__body">
              We work across <span className="mv2-num" data-count="100" data-suffix="+">0+</span> destinations, each held within a specific
              relationship — a hotelier, a guide, a family — and maintained with discretion. Access is
              arranged, not assumed, and every itinerary is shaped by people who have walked the ground.
            </p>
          </div>

          <div className="mv2-places__find mv2-reveal">
            <span className="mv2-script">See what’s near</span>
            <form className="mv2-finder" onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="mv2-near" className="mv2-sr">Your city or region</label>
              <input id="mv2-near" type="text" placeholder="Your city or region" />
              <button type="submit" data-magnetic="0.3">Find</button>
            </form>
          </div>

          <svg className="mv2-compass mv2-reveal" viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r="34" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="50" cy="50" r="2" fill="currentColor" />
            <path d="M50 16 L57 50 L50 84 L43 50 Z" fill="currentColor" opacity="0.85" />
            <path d="M16 50 L50 43 L84 50 L50 57 Z" fill="currentColor" opacity="0.35" />
          </svg>
        </section>

        {/* ---------------- Signature type moment ---------------- */}
        <section className="mv2-bigtype">
          <h2 className="mv2-bigtype__h mv2-reveal">
            <span>Signature</span>
            <figure className="mv2-bigtype__img" data-grow="0.8"><img src={img('1502602898657-3e91760cbb34', 500)} alt="A traveller pausing on a boulevard" loading="lazy" /></figure>
            <span>Journeys</span>
          </h2>
        </section>

        {/* ---------------- Journeys carousel ---------------- */}
        <section className="mv2-journeys" id="journeys">
          <p className="mv2-journeys__intro mv2-reveal">These itineraries are shaped on the ground.</p>

          <div
            className="mv2-show" role="group" aria-roledescription="carousel" aria-label="Signature journeys"
            onPointerDown={(e) => { dragX.current = e.clientX; }}
            onPointerUp={(e) => { const d = e.clientX - dragX.current; if (d < -45) moveJrn(1); else if (d > 45) moveJrn(-1); }}
          >
            <p className="mv2-show__side mv2-show__side--l mv2-reveal">
              Each begins in a single place — shaped by its season, its people and its rooms — then continues
              only as far as you wish to go.
            </p>

            <div className="mv2-show__stage" data-tilt="9">
              <figure className="mv2-show__card" key={jrnIdx}>
                <img src={img(JOURNEYS[jrnIdx][1], 900)} alt={JOURNEYS[jrnIdx][2]} loading="lazy" draggable="false" />
                <figcaption>
                  <span className="mv2-show__roman">({JOURNEYS[jrnIdx][0]}) {JOURNEYS[jrnIdx][2]}</span>
                </figcaption>
              </figure>
              <span className="mv2-show__label" aria-live="polite">{JOURNEYS[jrnIdx][3]}</span>
            </div>

            <div className="mv2-show__side mv2-show__side--r mv2-reveal">
              <p key={jrnIdx} className="mv2-show__desc">{JOURNEYS[jrnIdx][4]}</p>
              <span className="mv2-show__count" aria-hidden="true">{jrnIdx + 1} / {JOURNEYS.length}</span>
              <div className="mv2-show__dots" role="tablist" aria-label="Choose a journey">
                {JOURNEYS.map((j, idx) => (
                  <button
                    key={idx}
                    className={`mv2-dot ${idx === jrnIdx ? 'is-active' : ''}`}
                    role="tab" aria-selected={idx === jrnIdx}
                    aria-label={`Journey ${idx + 1}: ${j[2]}`}
                    onClick={() => setJrnIdx(idx)}
                  />
                ))}
              </div>
            </div>

            <div className="mv2-show__ctrls">
              <button className="mv2-circ mv2-circ--dark" data-magnetic="0.4" onClick={() => moveJrn(-1)} aria-label="Previous journey">‹</button>
              <button className="mv2-circ mv2-circ--dark" data-magnetic="0.4" onClick={() => moveJrn(1)} aria-label="Next journey">›</button>
            </div>
          </div>

          <a className="mv2-seek mv2-seek--inline mv2-reveal" href="#enquire" data-magnetic="0.35">
            <span>Explore journeys</span>
            <span className="mv2-seek__dot" aria-hidden="true" />
          </a>
        </section>

        {/* ---------------- Editorial spread ---------------- */}
        <section className="mv2-spread">
          <h2 className="mv2-spread__h mv2-reveal">
            <RevealWords
              text="No two are planned alike. Each journey is shaped by its place, its season and the hands that make it — then handed, finished, to you."
              accent={[]}
            />
          </h2>
          <p className="mv2-spread__script mv2-reveal">Now curating</p>
        </section>

        {/* ---------------- Enquiry form ---------------- */}
        <section className="mv2-enquire" id="enquire">
          <figure className="mv2-enquire__bg" aria-hidden="true">
            <img src={img('1488646953014-85cb44e25828', 1500)} alt="" loading="lazy" />
          </figure>

          <div className="mv2-enquire__inner">
            <h2 className="mv2-enquire__h mv2-reveal">Begin your enquiry</h2>

            {sent ? (
              <p className="mv2-enquire__thanks" role="status">
                Thank you. A Cox &amp; Kings travel expert will be in touch personally — every enquiry is
                read and answered individually.
              </p>
            ) : (
              <form className="mv2-form" onSubmit={(e) => { e.preventDefault(); setSent(true); }} noValidate>
                <div className="mv2-field">
                  <label htmlFor="mv2-name">Full name</label>
                  <input id="mv2-name" name="name" type="text" autoComplete="name" required />
                </div>
                <div className="mv2-field">
                  <label htmlFor="mv2-email">Email address</label>
                  <input id="mv2-email" name="email" type="email" autoComplete="email" required />
                </div>
                <div className="mv2-field">
                  <label htmlFor="mv2-country">Country</label>
                  <input id="mv2-country" name="country" type="text" autoComplete="country-name" />
                </div>
                <div className="mv2-field">
                  <label htmlFor="mv2-city">City</label>
                  <input id="mv2-city" name="city" type="text" autoComplete="address-level2" />
                </div>
                <div className="mv2-field mv2-field--wide">
                  <label htmlFor="mv2-ctx">What are you dreaming of?</label>
                  <textarea id="mv2-ctx" name="context" rows={3} placeholder="A honeymoon, a milestone, a corner of the world…" />
                </div>
                <label className="mv2-consent">
                  <input type="checkbox" required />
                  <span>I understand each journey is planned individually, and that a considered reply may take a little time.</span>
                </label>
                <button className="mv2-submit" type="submit" data-magnetic="0.3">Submit enquiry</button>
              </form>
            )}
          </div>
        </section>
      </main>

      {/* ---------------- Footer menu spread ---------------- */}
      <footer className="mv2-footer" id="footer">
        <svg className="mv2-thread" viewBox="0 0 1200 360" aria-hidden="true" preserveAspectRatio="none">
          <path d="M40 300 C 240 320, 300 120, 520 200 S 760 120, 880 150 S 1120 120, 1160 220" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        </svg>

        <nav className="mv2-bignav" aria-label="Footer">
          <a className="mv2-bignav__1" href="#gallery">Destinations</a>
          <a className="mv2-bignav__2" href="#journeys">Journeys</a>
          <a className="mv2-bignav__3" href="#places">Places</a>
          <a className="mv2-bignav__4" href="#footer">About</a>
          <a className="mv2-bignav__5" href="#enquire">Contact</a>
        </nav>
        <p className="mv2-footer__op">Operating across the world, since 1758.</p>

        <div className="mv2-footer__meta">
          <span>© {new Date().getFullYear()} Cox &amp; Kings</span>
          <span>The world&apos;s oldest travel company · Established 1758</span>
          <span>A private travel atelier</span>
        </div>

        <div className="mv2-footer__base">
          <span className="mv2-brand__name mv2-brand__name--foot">Cox &amp; Kings</span>
          <p>
            For over two and a half centuries, Cox &amp; Kings has opened the world&apos;s finest doors —
            escorted tours, bespoke holidays and private journeys, each one planned by hand.
          </p>
        </div>
      </footer>
    </div>
  );
}
