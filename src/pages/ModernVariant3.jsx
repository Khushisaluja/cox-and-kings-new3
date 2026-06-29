import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react';
import './ModernVariant3.css';

/* ============================================================
   Cox & Kings — "Modern Variant 3"  (route /modern-variant-3)
   Editorial-luxury, agency-grade build:
     · layered PARALLAX hero (HD brand images in /public/mv3)
     · a real 3D plane that flies THROUGH the page with z-depth,
       banking and breathing in perspective on scroll
     · scroll-driven word-by-word TEXT HIGHLIGHTING
     · double-bezel cards, magnetic CTAs, 3D card tilt + glare,
       blur-up scroll reveals, count-up stats
   Design language from design.md (Voyager Blue / Sienna Flame /
   warm paper · Zodiak + Work Sans). Self-contained, scoped .mv3.
   Touches no other page.
   ============================================================ */

const photo = (id, w = 1100) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

/* Split copy into word spans for scroll-highlighting */
function Highlight({ text, className = '' }) {
  return (
    <p className={`mv3-hl ${className}`}>
      {text.split(' ').map((w, i) => (
        <Fragment key={i}>
          <span className="mv3-w">{w}</span>{' '}
        </Fragment>
      ))}
    </p>
  );
}

const NAV = [
  ['Destinations', '#destinations'],
  ['Journeys', '#journeys'],
  ['Heritage', '#heritage'],
  ['Contact', '#contact'],
];

const DESTS = [
  ['1493976040374-85c8e12f0c0e', 'Japan', 'Kyoto, Tokyo & the snow country', 'large'],
  ['1516483638261-f4dbaf036963', 'Italy', 'Tuscany, the Amalfi Coast & Rome', 'tall'],
  ['1524492412937-b28074a5d7da', 'India', 'Rajasthan & the Golden Triangle', 'wide'],
  ['1531572753322-ad063cecc140', 'Switzerland', 'The Alps by private rail', 'small'],
];

const EXPERIENCES = [
  ['01', 'Escorted Tours', 'Travel in fine company, led end-to-end by a Cox & Kings tour manager who knows every door worth opening.'],
  ['02', 'Bespoke Holidays', 'A journey drawn around you — your pace, your people, your once-in-a-lifetime moments, arranged to the last detail.'],
  ['03', 'Private Experiences', 'A museum after hours. A chef’s own kitchen. The table, the room, the moment that money usually cannot buy.'],
];

export default function ModernVariant3() {
  const rootRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [planeOk, setPlaneOk] = useState(true);
  const [sent, setSent] = useState(false);

  /* Scroll engine: hero parallax (--p1..p4), 3D plane (transform),
     word highlighting, top progress. rAF-batched, motion-safe. */
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
    const hero = root.querySelector('.mv3-hero');
    const layers = Array.from(root.querySelectorAll('[data-depth]'));
    const plane = root.querySelector('.mv3-plane');
    const hlBlocks = Array.from(root.querySelectorAll('.mv3-hl')).map((el) => ({
      el, words: Array.from(el.querySelectorAll('.mv3-w')),
    }));
    let mx = 0, my = 0, raf = null;

    const update = () => {
      const vh = window.innerHeight, vw = window.innerWidth;
      const doc = document.documentElement;
      const p = clamp(window.scrollY / (doc.scrollHeight - vh || 1), 0, 1);
      root.style.setProperty('--prog', p.toFixed(4));

      // hero parallax (scroll + pointer)
      if (hero) {
        const hp = clamp(window.scrollY / vh, 0, 1.4);
        layers.forEach((l) => {
          const d = parseFloat(l.dataset.depth) || 0;
          l.style.transform =
            `translate3d(${(mx * d * 26).toFixed(1)}px, ${(hp * d * 160 + my * d * 22).toFixed(1)}px, 0) scale(${(1 + d * 0.06).toFixed(3)})`;
        });
      }

      // 3D plane flying through space
      if (plane) {
        const x = 50 + 30 * Math.sin(p * 3 * Math.PI - 0.5);
        const y = 14 + 66 * easeInOut(p);
        const z = -260 + 520 * (0.5 + 0.5 * Math.sin(p * 4 * Math.PI));
        const dt = 0.004;
        const x2 = 50 + 30 * Math.sin((p + dt) * 3 * Math.PI - 0.5);
        const y2 = 14 + 66 * easeInOut(p + dt);
        const dx = (x2 - x) / 100 * vw, dy = (y2 - y) / 100 * vh;
        const head = Math.atan2(dx, -dy) * 180 / Math.PI;
        const bank = clamp(dx * 0.9, -28, 28);
        const far = clamp((-z + 260) / 780, 0, 1); // 0 near .. 1 far
        plane.style.left = `${x.toFixed(2)}%`;
        plane.style.top = `${y.toFixed(2)}%`;
        plane.style.transform =
          `translate(-50%,-50%) translateZ(${z.toFixed(0)}px) rotateX(${(52 + bank * 0.3).toFixed(1)}deg) rotateZ(${head.toFixed(1)}deg) rotateY(${bank.toFixed(1)}deg)`;
        plane.style.filter = `drop-shadow(0 22px 26px rgba(2,19,48,${(0.32 * (1 - far)).toFixed(2)})) blur(${(far * 1.6).toFixed(2)}px)`;
        plane.style.opacity = (0.55 + 0.45 * (1 - far)).toFixed(2);
      }

      // word highlighting
      hlBlocks.forEach(({ el, words }) => {
        const r = el.getBoundingClientRect();
        const t = clamp((vh * 0.82 - r.top) / (vh * 0.55 + r.height * 0.4), 0, 1);
        const lit = t * words.length;
        words.forEach((w, i) => w.classList.toggle('is-lit', i < lit));
      });
      raf = null;
    };

    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    const onMove = (e) => { mx = (e.clientX / window.innerWidth - 0.5) * 2; my = (e.clientY / window.innerHeight - 0.5) * 2; onScroll(); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('mousemove', onMove);
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  /* Blur-up reveals on enter */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }),
      { threshold: 0.14, rootMargin: '0px 0px -8% 0px' }
    );
    root.querySelectorAll('.mv3-rise').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* Count-up stats */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target; io.unobserve(el);
        const target = parseFloat(el.dataset.count) || 0;
        const suffix = el.dataset.suffix || '';
        if (reduce) { el.textContent = target + suffix; return; }
        const dur = 1300, start = performance.now();
        const tick = (now) => {
          const k = Math.min(1, (now - start) / dur);
          el.textContent = Math.round((1 - Math.pow(1 - k, 3)) * target) + suffix;
          if (k < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.6 });
    root.querySelectorAll('[data-count]').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* Pointer card tilt + glare + magnetic (fine pointer, motion-safe) */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const cleanups = [];
    root.querySelectorAll('[data-tilt]').forEach((el) => {
      const max = parseFloat(el.dataset.tilt) || 6;
      const onMove = (e) => {
        const r = el.getBoundingClientRect();
        const gx = (e.clientX - r.left) / r.width, gy = (e.clientY - r.top) / r.height;
        el.style.setProperty('--ry', `${((gx - 0.5) * max).toFixed(2)}deg`);
        el.style.setProperty('--rx', `${((0.5 - gy) * max).toFixed(2)}deg`);
        el.style.setProperty('--gx', `${(gx * 100).toFixed(1)}%`);
        el.style.setProperty('--gy', `${(gy * 100).toFixed(1)}%`);
      };
      const onLeave = () => { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); };
      el.addEventListener('mousemove', onMove); el.addEventListener('mouseleave', onLeave);
      cleanups.push(() => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave); });
    });
    root.querySelectorAll('[data-magnetic]').forEach((el) => {
      const s = parseFloat(el.dataset.magnetic) || 0.3;
      const onMove = (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${((e.clientX - (r.left + r.width / 2)) * s).toFixed(1)}px`);
        el.style.setProperty('--my', `${((e.clientY - (r.top + r.height / 2)) * s).toFixed(1)}px`);
      };
      const onLeave = () => { el.style.setProperty('--mx', '0px'); el.style.setProperty('--my', '0px'); };
      el.addEventListener('mousemove', onMove); el.addEventListener('mouseleave', onLeave);
      cleanups.push(() => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave); });
    });
    return () => cleanups.forEach((f) => f());
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, [menuOpen]);

  const Arrow = () => (
    <span className="mv3-btn__ico" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="14" height="14"><path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </span>
  );

  return (
    <div className="mv3" ref={rootRef}>
      <a className="mv3-skip" href="#mv3-main">Skip to content</a>
      <div className="mv3-grain" aria-hidden="true" />
      <div className="mv3-progress" aria-hidden="true" />

      {/* 3D flight stage */}
      <div className="mv3-stage" aria-hidden="true">
        <div className="mv3-plane">
          {planeOk ? (
            <img src="/mv3/plane.png" alt="" onError={() => setPlaneOk(false)} />
          ) : (
            <svg className="mv3-plane__svg" viewBox="0 0 64 64"><path d="M32 3 L36 22 L60 40 L60 46 L36 35 L34 52 L44 59 L44 62 L32 57 L20 62 L20 59 L30 52 L28 35 L4 46 L4 40 L28 22 Z" fill="#021330" stroke="#F1EFE2" strokeWidth="1.4" strokeLinejoin="round" /></svg>
          )}
        </div>
      </div>

      {/* Floating glass-pill nav */}
      <header className="mv3-nav">
        <a className="mv3-nav__brand" href="/modern-variant-3" aria-label="Cox & Kings — Established 1758">
          <span>Cox &amp; Kings</span><i>Est. 1758</i>
        </a>
        <nav className="mv3-nav__links" aria-label="Primary">
          {NAV.map(([l, h]) => <a key={l} href={h}>{l}</a>)}
        </nav>
        <a className="mv3-btn mv3-btn--ink mv3-nav__cta" href="#contact" data-magnetic="0.3">
          Plan a journey <Arrow />
        </a>
        <button className={`mv3-burger ${menuOpen ? 'is-open' : ''}`} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="mv3-menu" onClick={() => setMenuOpen((v) => !v)}>
          <span /><span />
        </button>
      </header>

      <div id="mv3-menu" className={`mv3-menu ${menuOpen ? 'is-open' : ''}`} role="dialog" aria-modal="true" aria-label="Menu" hidden={!menuOpen}>
        <nav aria-label="Full">
          {NAV.map(([l, h], i) => (
            <a key={l} href={h} onClick={() => setMenuOpen(false)} style={{ transitionDelay: `${0.06 * i + 0.1}s` }}>{l}</a>
          ))}
        </nav>
      </div>

      <main id="mv3-main">
        {/* ---------------- Parallax hero ---------------- */}
        <section className="mv3-hero">
          <div className="mv3-hero__sky" data-depth="0.05" />
          <div className="mv3-hero__clouds" data-depth="0.16" />
          <div className="mv3-hero__far" data-depth="0.26" />
          <div className="mv3-hero__mid" data-depth="0.42" />
          <div className="mv3-hero__near" data-depth="0.62" />
          <div className="mv3-hero__veil" aria-hidden="true" />

          <div className="mv3-hero__copy">
            <span className="mv3-eyebrow mv3-rise">Established 1758 · The world&apos;s oldest travel company</span>
            <h1 className="mv3-hero__h">
              <span className="mv3-rise" style={{ transitionDelay: '.05s' }}>The world,</span>
              <span className="mv3-rise" style={{ transitionDelay: '.16s' }}>beautifully</span>
              <span className="mv3-rise mv3-serif-i" style={{ transitionDelay: '.27s' }}>arranged.</span>
            </h1>
            <p className="mv3-hero__sub mv3-rise" style={{ transitionDelay: '.4s' }}>
              For more than two and a half centuries, we have turned far-flung places into journeys planned
              to the last quiet detail — escorted, bespoke and entirely your own.
            </p>
            <div className="mv3-hero__cta mv3-rise" style={{ transitionDelay: '.52s' }}>
              <a className="mv3-btn mv3-btn--ink" href="#contact" data-magnetic="0.3">Plan your journey <Arrow /></a>
              <a className="mv3-btn mv3-btn--ghost" href="#destinations">Explore destinations</a>
            </div>
          </div>

          <span className="mv3-scrollcue" aria-hidden="true">Scroll</span>
        </section>

        {/* ---------------- Trust strip ---------------- */}
        <section className="mv3-trust" aria-label="Cox & Kings at a glance">
          {[['260', '+', 'years of travel'], ['100', '+', 'destinations'], ['1', 'M+', 'happy travellers'], ['90', '%', 'return to travel again']].map(([n, s, l]) => (
            <div className="mv3-trust__item mv3-rise" key={l}>
              <span className="mv3-trust__n"><span data-count={n} data-suffix={s}>0{s}</span></span>
              <span className="mv3-trust__l">{l}</span>
            </div>
          ))}
        </section>

        {/* ---------------- Scroll-highlight statement ---------------- */}
        <section className="mv3-statement" id="heritage">
          <span className="mv3-eyebrow mv3-eyebrow--center mv3-rise">Our promise</span>
          <Highlight
            className="mv3-statement__h"
            text="We turn distance into wonder — arranging the rooms, the routes and the rare moments that quietly turn a holiday into the journey of a lifetime."
          />
        </section>

        {/* ---------------- Destinations bento ---------------- */}
        <section className="mv3-dest" id="destinations">
          <div className="mv3-sec-head">
            <span className="mv3-eyebrow mv3-rise">Where we travel</span>
            <h2 className="mv3-h2 mv3-rise">A handpicked world</h2>
          </div>
          <div className="mv3-bento">
            {DESTS.map(([id, name, sub, size]) => (
              <article className={`mv3-card mv3-card--${size} mv3-rise`} data-tilt="6" key={name}>
                <div className="mv3-card__inner">
                  <div className="mv3-card__media">
                    <img src={photo(id, 1200)} alt={`${name} — ${sub}`} loading="lazy" />
                    <span className="mv3-card__glare" aria-hidden="true" />
                  </div>
                  <div className="mv3-card__body">
                    <h3 className="mv3-card__name">{name}</h3>
                    <p className="mv3-card__sub">{sub}</p>
                    <span className="mv3-card__link">Discover <Arrow /></span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ---------------- Experiences split ---------------- */}
        <section className="mv3-exp" id="journeys">
          <div className="mv3-exp__intro">
            <span className="mv3-eyebrow mv3-rise">How you travel</span>
            <h2 className="mv3-h2 mv3-rise">Three ways to go</h2>
            <p className="mv3-exp__lead mv3-rise">
              However far you wander, you travel with the same two and a half centuries of judgement behind you.
            </p>
          </div>
          <ol className="mv3-exp__list">
            {EXPERIENCES.map(([n, t, d]) => (
              <li className="mv3-exp__row mv3-rise" key={n}>
                <span className="mv3-exp__num">{n}</span>
                <div className="mv3-exp__text">
                  <h3 className="mv3-exp__title">{t}</h3>
                  <p>{d}</p>
                </div>
                <span className="mv3-exp__go" aria-hidden="true"><Arrow /></span>
              </li>
            ))}
          </ol>
        </section>

        {/* ---------------- Scroll-highlight closing ---------------- */}
        <section className="mv3-statement mv3-statement--alt">
          <Highlight
            className="mv3-statement__h"
            text="Tell us where you dream of going. A Cox & Kings expert will draw the journey around you — and stay beside you, from the first idea to the last evening."
          />
        </section>

        {/* ---------------- CTA panel ---------------- */}
        <section className="mv3-cta" id="contact">
          <div className="mv3-cta__panel mv3-rise" data-tilt="3">
            <div className="mv3-cta__inner">
              <span className="mv3-eyebrow mv3-eyebrow--light">Begin</span>
              <h2 className="mv3-cta__h">Let&apos;s plan something <span className="mv3-serif-i">unforgettable.</span></h2>
              {sent ? (
                <p className="mv3-cta__thanks" role="status">Thank you — a travel expert will be in touch personally. Every enquiry is answered by a person, not a queue.</p>
              ) : (
                <form className="mv3-cta__form" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
                  <label className="mv3-sr" htmlFor="mv3-email">Email address</label>
                  <input id="mv3-email" type="email" placeholder="Your email address" required />
                  <button className="mv3-btn mv3-btn--paper" type="submit" data-magnetic="0.3">Start planning <Arrow /></button>
                </form>
              )}
              <p className="mv3-cta__fine">Or call us — a real person, any time, anywhere in the world.</p>
            </div>
          </div>
        </section>
      </main>

      {/* ---------------- Footer ---------------- */}
      <footer className="mv3-foot">
        <div className="mv3-foot__top">
          <span className="mv3-foot__brand">Cox &amp; Kings</span>
          <p className="mv3-foot__line">The world&apos;s oldest travel company · Established 1758</p>
        </div>
        <div className="mv3-foot__cols">
          {[['Travel', ['Escorted Tours', 'Bespoke Holidays', 'Experiences', 'Destinations']],
            ['Company', ['Heritage', 'Our People', 'Journal', 'Contact']],
            ['Connect', ['Speak to an expert', 'Request a brochure', 'Newsletter']]].map(([h, items]) => (
            <div key={h}>
              <span className="mv3-foot__h">{h}</span>
              {items.map((it) => <a key={it} href="#contact">{it}</a>)}
            </div>
          ))}
        </div>
        <div className="mv3-foot__base">
          <span>© {new Date().getFullYear()} Cox &amp; Kings. All rights reserved.</span>
          <span>Luxury · Heritage · Trust since 1758</span>
        </div>
      </footer>
    </div>
  );
}
