import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react';
import './ModernVariant.css';

/* ============================================================
   Cox & Kings — "Modern Variant"  (route /modern-variant)
   A scroll-activated editorial homepage modelled on the
   reference "Landing Page – Scroll activated" motion study:
     · centred editorial column with serif headlines that mix
       roman + a colour italic accent word
     · imagery that floats in the left / right gutters and
       drifts at parallax speeds as the centre scrolls
     · word-by-word scroll-reveal headlines
     · full-bleed dark + accent statement panels punctuating flow
   Content is tailored for Cox & Kings (Est. 1758, heritage-first,
   escorted tours + bespoke journeys) and grounded in the
   competitive / UX audit. Visual tokens come from design.md
   (Voyager Blue / Sienna Flame / warm paper · Zodiak + Work Sans).
   Fully self-contained + scoped under .mv — touches no other page.
   ============================================================ */

const img = (id, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

/* Split a string into word spans for staggered reveal */
function RevealWords({ text, accent = [], className = '' }) {
  const words = text.split(' ');
  return (
    <span className={`mv-rw ${className}`}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="mv-rw__w" style={{ transitionDelay: `${i * 55}ms` }}>
            <span className={accent.includes(i) ? 'mv-italic' : ''}>{w}</span>
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </Fragment>
      ))}
    </span>
  );
}

export default function ModernVariant() {
  const rootRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const NAV = [
    ['Destinations', '#destinations'],
    ['Journeys', '#journeys'],
    ['Experiences', '#experiences'],
    ['Group Tours', '#people'],
    ['Our Story', '#destinations'],
    ['Get Inspired', '#journal'],
  ];

  /* Lock body scroll + close on Escape while the mobile menu is open */
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  /* Scroll engine — runs every frame while scrolling:
       · [data-speed]  → parallax drift (sets --py)
       · [data-speed] / [data-grow] → scroll-linked scale + fade (small → full)
       · [data-expand] → clip-path grow from a small centred box to full-bleed
     All values are written as CSS custom properties so they compose with
     hover/layout transforms declared in the stylesheet. */
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const parallax = Array.from(root.querySelectorAll('[data-speed]'));
    const growers = Array.from(root.querySelectorAll('[data-grow]'));
    const expanders = Array.from(root.querySelectorAll('[data-expand]'));
    const scaleEls = [...new Set([...parallax, ...growers])];

    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    let raf = null;
    const update = () => {
      const vh = window.innerHeight;

      const doc = document.documentElement;
      const prog = clamp(window.scrollY / (doc.scrollHeight - vh || 1), 0, 1);
      root.style.setProperty('--prog', prog.toFixed(4));

      for (const el of parallax) {
        const r = el.getBoundingClientRect();
        const delta = r.top + r.height / 2 - vh / 2;
        const speed = parseFloat(el.dataset.speed) || 0;
        el.style.setProperty('--py', `${(-delta * speed).toFixed(1)}px`);
      }

      for (const el of scaleEls) {
        const r = el.getBoundingClientRect();
        const start = vh * 1.0;       // begins as the element enters from the bottom
        const end = vh * 0.34;        // fully grown a bit above centre
        const p = easeOut(clamp((start - r.top) / (start - end), 0, 1));
        const min = parseFloat(el.dataset.grow) || (el.dataset.speed ? 0.74 : 0.88);
        el.style.setProperty('--gs', (min + (1 - min) * p).toFixed(3));
        el.style.setProperty('--go', (0.1 + 0.9 * p).toFixed(3));
      }

      for (const el of expanders) {
        const r = el.getBoundingClientRect();
        const start = vh * 0.95;
        const end = vh * 0.32;
        const p = easeOut(clamp((start - r.top) / (start - end), 0, 1));
        const inY = ((1 - p) * 34).toFixed(2);
        const inX = ((1 - p) * 20).toFixed(2);
        const rad = (3 + (1 - p) * 44).toFixed(1);
        el.style.clipPath = `inset(${inY}% ${inX}% round ${rad}px)`;
        el.style.setProperty('--ep', p.toFixed(3));
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

  /* Reveal on enter */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const targets = root.querySelectorAll('.mv-reveal, .mv-rw');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' }
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  /* Header: condense on scroll */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const hdr = root.querySelector('.mv-head');
    const onScroll = () => {
      if (window.scrollY > 80) hdr?.classList.add('is-stuck');
      else hdr?.classList.remove('is-stuck');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="mv" ref={rootRef}>
      <a className="mv-skip" href="#mv-main">Skip to content</a>
      <div className="mv-topstrip" />
      <div className="mv-progress" aria-hidden="true" />

      {/* ---------------- Header ---------------- */}
      <header className="mv-head">
        <nav className="mv-head__side mv-head__left" aria-label="Primary">
          <a href="#destinations">Destinations</a>
          <a href="#journeys">Journeys</a>
          <a href="#experiences">Experiences</a>
        </nav>

        <a className="mv-head__brand" href="/modern-variant" aria-label="Cox & Kings — Established 1758">
          <img src="/cox-logo-new.png" alt="Cox & Kings" />
          <span className="mv-head__est">Established 1758</span>
        </a>

        <nav className="mv-head__side mv-head__right" aria-label="Secondary">
          <a href="#people">Group Tours</a>
          <a href="#destinations">Our Story</a>
          <a href="#journal">Get Inspired</a>
        </nav>

        <button
          className={`mv-burger ${menuOpen ? 'is-open' : ''}`}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mv-mobile-menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>
      </header>

      {/* ---------------- Mobile menu ---------------- */}
      <div
        id="mv-mobile-menu"
        className={`mv-menu ${menuOpen ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        hidden={!menuOpen}
      >
        <nav className="mv-menu__nav" aria-label="Mobile">
          {NAV.map(([label, href], i) => (
            <a key={label} href={href} onClick={() => setMenuOpen(false)} style={{ transitionDelay: `${0.06 * i + 0.1}s` }}>
              {label}
            </a>
          ))}
        </nav>
        <a className="mv-btn mv-btn--solid mv-menu__cta" href="#contact" onClick={() => setMenuOpen(false)}>
          Start planning
        </a>
        <span className="mv-menu__est">Established 1758 · The world&apos;s oldest travel company</span>
      </div>

      <main id="mv-main">

      {/* ---------------- Hero ---------------- */}
      <section className="mv-hero">
        {/* gutter images */}
        <figure className="mv-gutter mv-gutter--l mv-hero__gl" data-speed="0.06">
          <img src={img('1516483638261-f4dbaf036963', 700)} alt="Cypress-lined hills in Tuscany, Italy" loading="eager" />
        </figure>
        <figure className="mv-gutter mv-gutter--r mv-hero__gr" data-speed="0.09">
          <img src={img('1493976040374-85c8e12f0c0e', 700)} alt="A lantern-lit lane in Kyoto, Japan" loading="eager" />
        </figure>

        <div className="mv-hero__center">
          <figure className="mv-hero__card" data-speed="0.04">
            <img src={img('1564507592333-c60657eea523', 1100)} alt="The Taj Mahal mirrored in its reflecting pool at dawn" loading="eager" />
            <figcaption>
              <span className="mv-card__eyebrow">Signature Journeys</span>
              <span className="mv-card__title">India · The Golden Triangle</span>
            </figcaption>
          </figure>

          <span className="mv-dot" aria-hidden="true" />

          <h1 className="mv-hero__h">
            The world&apos;s most storied journeys,
            {' '}<u>expertly</u> <em className="mv-italic">curated</em>
            {' '}— for over <u>260 years</u>
          </h1>

          <p className="mv-hero__sub">
            The world&apos;s oldest travel company opens its finest doors. Escorted tours,
            bespoke holidays and rare experiences across 100+ destinations — handcrafted by people, not algorithms.
          </p>

          <a className="mv-btn mv-btn--solid" href="#contact">Start planning</a>
        </div>
      </section>

      {/* ---------------- Trust band ---------------- */}
      <section className="mv-trust mv-reveal" aria-label="Why travellers trust Cox & Kings">
        {[
          ['260+', 'years of travel'],
          ['100+', 'destinations'],
          ['1M+', 'happy travellers'],
          ['90%', 'return to travel again'],
        ].map(([n, l]) => (
          <div className="mv-trust__item" key={l}>
            <span className="mv-trust__n">{n}</span>
            <span className="mv-trust__l">{l}</span>
          </div>
        ))}
      </section>

      {/* ---------------- Dark statement ---------------- */}
      <section className="mv-statement" data-expand>
        <div className="mv-statement__inner">
          <h2 className="mv-statement__h">
            <RevealWords text="Travel your" />
            <span className="mv-statement__accent mv-reveal">
              <span className="mv-rule" /> <em className="mv-italic">extraordinary</em> story
            </span>
            <RevealWords text="with Cox & Kings" />
          </h2>
          <a className="mv-btn mv-btn--ghost mv-reveal" href="#journeys">Begin the journey</a>
        </div>
      </section>

      {/* ---------------- Editorial 1 — Curated Journeys ---------------- */}
      <section className="mv-ed" id="journeys">
        <figure className="mv-gutter mv-gutter--l mv-ed__g1" data-speed="0.10">
          <img src={img('1516483638261-f4dbaf036963', 640)} alt="Tuscan hills" loading="lazy" />
        </figure>
        <figure className="mv-gutter mv-gutter--r mv-ed__g2" data-speed="0.07">
          <img src={img('1539367628448-4bc5c9d171c8', 640)} alt="Swiss alpine railway" loading="lazy" />
        </figure>
        <figure className="mv-gutter mv-gutter--l mv-ed__g3" data-speed="0.14">
          <img src={img('1538970272646-f61fabb3a8a2', 540)} alt="Venice canal" loading="lazy" />
        </figure>

        <div className="mv-ed__center mv-reveal">
          <span className="mv-eyebrow">What &amp; where</span>
          <h2 className="mv-ed__h">Curated <em className="mv-italic">Journeys</em></h2>
          <p className="mv-ed__p">
            We believe how you travel matters as much as where you go. Every itinerary is shaped by
            destination experts — the right rooms, the rare table, the door that only opens for us —
            so each journey carries the unmistakable signature of Cox &amp; Kings.
          </p>
          <div className="mv-ed__btns">
            <a className="mv-btn mv-btn--out" href="#people">Escorted tours</a>
            <a className="mv-btn mv-btn--out is-active" href="#contact">Bespoke holidays</a>
          </div>
        </div>
      </section>

      {/* ---------------- Editorial 2 — Signature Experiences ---------------- */}
      <section className="mv-ed mv-ed--alt" id="experiences">
        <figure className="mv-gutter mv-gutter--l mv-ed__g1" data-speed="0.08">
          <img src={img('1502602898657-3e91760cbb34', 600)} alt="Paris boulevard" loading="lazy" />
        </figure>
        <figure className="mv-gutter mv-gutter--r mv-ed__g2" data-speed="0.12">
          <img src={img('1528127269322-539801943592', 560)} alt="Lantern-lit street" loading="lazy" />
        </figure>

        <div className="mv-ed__center mv-reveal">
          <span className="mv-eyebrow">Elevated experiences</span>
          <h2 className="mv-ed__h">Signature <em className="mv-italic">Experiences</em></h2>
          <p className="mv-ed__p">
            Private after-hours at a museum. Dinner with a Michelin chef in their own kitchen. A vintage
            carriage through old quarters at first light. No two are ever alike — each crafted to be as
            unforgettable as the traveller it was made for.
          </p>
          <a className="mv-btn mv-btn--out" href="#contact">Discover</a>
        </div>
      </section>

      {/* ---------------- Editorial 3 — Handpicked Stays ---------------- */}
      <section className="mv-ed">
        <figure className="mv-gutter mv-gutter--l mv-ed__g1" data-speed="0.11">
          <img src={img('1551882547-ff40c63fe5fa', 600)} alt="Infinity pool overlooking the sea" loading="lazy" />
        </figure>
        <figure className="mv-gutter mv-gutter--r mv-ed__g2" data-speed="0.06">
          <img src={img('1582719478250-c89cae4dc85b', 560)} alt="Heritage suite interior" loading="lazy" />
        </figure>

        <div className="mv-ed__center mv-reveal">
          <span className="mv-eyebrow">Where you stay</span>
          <h2 className="mv-ed__h">Handpicked <em className="mv-italic">Stays</em></h2>
          <p className="mv-ed__p">
            A palace once home to royalty. A family-run vineyard estate. An oceanfront retreat known only
            to a few. Every address is chosen for authenticity and a true sense of place — never a category,
            always a character.
          </p>
          <a className="mv-btn mv-btn--out" href="#contact">Discover</a>
        </div>
      </section>

      {/* ---------------- Scroll-reveal headline — Celebrations ---------------- */}
      <section className="mv-reveal-band">
        <figure className="mv-gutter mv-gutter--l mv-rb__g1" data-speed="0.10">
          <img src={img('1519741497674-611481863552', 560)} alt="Celebration by the water" loading="lazy" />
        </figure>
        <figure className="mv-gutter mv-gutter--r mv-rb__g2" data-speed="0.13">
          <img src={img('1465495976277-4387d4b0b4c6', 560)} alt="Couple on a coastal terrace" loading="lazy" />
        </figure>
        <div className="mv-rb__center">
          <span className="mv-eyebrow mv-eyebrow--accent">For the moments that matter</span>
          <h2 className="mv-rb__h">
            <RevealWords text="Celebrations & Honeymoons" accent={[2]} />
          </h2>
          <p className="mv-rb__p mv-reveal">
            Anniversaries, honeymoons, milestone birthdays and family reunions — staged in the world&apos;s
            most beautiful settings and handled, end to end, by a single expert who knows the day matters
            as much as the destination.
          </p>
        </div>
      </section>

      {/* ---------------- Our People (accent panel) ---------------- */}
      <section className="mv-people" id="people">
        <div className="mv-people__intro mv-reveal">
          <span className="mv-eyebrow mv-eyebrow--onaccent">Our tour leaders</span>
          <p>
            Cox &amp; Kings is defined as much by its people as its places. Our tour managers and destination
            experts are the difference between a trip and a journey — present at every step, with the local
            knowledge, judgement and warmth that two and a half centuries have taught us.
          </p>
        </div>
        <div className="mv-people__row">
          {[
            ['1500648767791-00dcc994a43e', 'Vikram Mehta', 'Lead Tour Manager · Europe'],
            ['1494790108377-be9c29b29330', 'Ananya Rao', 'Destination Expert · Japan'],
            ['1507003211169-0a1dd7228f2d', 'David Fernandes', 'Escorted Tours · The Americas'],
            ['1438761681033-6461ffad8d80', 'Leila Haddad', 'Bespoke Journeys · Middle East'],
          ].map(([id, name, role], i) => (
            <figure className="mv-people__card mv-reveal" key={name} style={{ transitionDelay: `${i * 90}ms` }}>
              <img src={img(id, 520)} alt={name} loading="lazy" />
              <figcaption>
                <span className="mv-people__name">{name}</span>
                <span className="mv-people__role">{role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ---------------- Our Destinations ---------------- */}
      <section className="mv-dest" id="destinations">
        <div className="mv-dest__top">
          <h2 className="mv-dest__h mv-reveal">
            Discover a world <em className="mv-italic">handcrafted</em> by Cox &amp; Kings
          </h2>
          <p className="mv-dest__lead mv-reveal">
            Every destination we choose reflects the essence of considered travel — authentic, memorable,
            and deeply rooted in the soul of the place. Begin with two of the worlds we know best.
          </p>
        </div>

        <div className="mv-dest__tiles">
          <article className="mv-tile" data-grow="0.84">
            <img src={img('1499856871958-5b9627545d1a', 1000)} alt="Europe" loading="lazy" />
            <div className="mv-tile__scrim" />
            <div className="mv-tile__body">
              <h3 className="mv-tile__name">Europe</h3>
              <div className="mv-tile__explore">
                <span className="mv-tile__exhead">Explore</span>
                <ul>
                  <li>Italy &amp; the Mediterranean</li>
                  <li>France &amp; the Alps</li>
                  <li>Spain &amp; Portugal</li>
                  <li>The British Isles</li>
                  <li>Scandinavia &amp; the Fjords</li>
                </ul>
              </div>
            </div>
          </article>

          <article className="mv-tile" data-grow="0.84">
            <img src={img('1480796927426-f609979314bd', 1000)} alt="Asia" loading="lazy" />
            <div className="mv-tile__scrim" />
            <div className="mv-tile__body">
              <h3 className="mv-tile__name">Asia</h3>
              <div className="mv-tile__explore">
                <span className="mv-tile__exhead">Explore</span>
                <ul>
                  <li>Japan &amp; the Far East</li>
                  <li>India &amp; the Subcontinent</li>
                  <li>Southeast Asia</li>
                  <li>The Silk Road</li>
                  <li>Bhutan &amp; the Himalaya</li>
                </ul>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* ---------------- Contact (dark) ---------------- */}
      <section className="mv-contact" id="contact">
        <span className="mv-eyebrow mv-eyebrow--onaccent mv-reveal">Contact</span>
        <h2 className="mv-contact__h">
          <RevealWords text="Let's make it happen" accent={[2, 3]} />
        </h2>
        <p className="mv-contact__p mv-reveal">
          Every great journey begins with fine company. Tell us where you dream of going — a Cox &amp; Kings
          travel expert will design it around you, by phone or in person.
        </p>
        <div className="mv-contact__actions mv-reveal">
          <a className="mv-btn mv-btn--solid" href="#contact">Speak to an expert</a>
          <a className="mv-btn mv-btn--ghost" href="#journeys">Browse journeys</a>
        </div>
      </section>

      {/* ---------------- Journal ---------------- */}
      <section className="mv-journal" id="journal">
        <h2 className="mv-journal__h">
          <RevealWords text="Stories worth travelling for" accent={[3]} />
        </h2>

        <div className="mv-journal__grid">
          {[
            ['1528164344705-47542687000d', 'Jun 2, 2026', '4 min read', 'The art of the slow itinerary',
              'Why the finest journeys leave room to do nothing at all — and how our experts build the pause in.'],
            ['1545569341-9eb8b30979d9', 'May 18, 2026', '6 min read', 'Kyoto, beyond the postcard',
              'A destination expert on the temples that open early, the tea houses that don’t take strangers, and the season to go.'],
            ['1523906834658-6e24ef2386f9', 'Apr 30, 2026', '5 min read', 'Two centuries of opening doors',
              'From 1758 to today — how the world’s oldest travel company still earns the trust of the next generation.'],
          ].map(([id, date, read, title, excerpt], i) => (
            <article className="mv-art mv-reveal" key={title} style={{ transitionDelay: `${i * 90}ms` }}>
              <figure className="mv-art__img" data-grow="0.9">
                <img src={img(id, 720)} alt={title} loading="lazy" />
              </figure>
              <div className="mv-art__meta">
                <span className="mv-art__date">{date}</span>
                <span className="mv-art__rule" />
                <span className="mv-art__read">{read}</span>
              </div>
              <h3 className="mv-art__title">{title}</h3>
              <p className="mv-art__excerpt">{excerpt}</p>
            </article>
          ))}
        </div>
      </section>

      </main>

      {/* ---------------- Footer ---------------- */}
      <footer className="mv-foot">
        <div className="mv-foot__top">
          <div className="mv-foot__brand">
            <span className="mv-foot__word">Cox &amp; Kings</span>
            <span className="mv-foot__est">Established 1758 · The world&apos;s oldest travel company</span>
          </div>
          <div className="mv-foot__cols">
            <div>
              <span className="mv-foot__head">Travel</span>
              <a href="#journeys">Escorted Tours</a>
              <a href="#contact">Bespoke Holidays</a>
              <a href="#experiences">Experiences</a>
              <a href="#destinations">Destinations</a>
            </div>
            <div>
              <span className="mv-foot__head">Company</span>
              <a href="#destinations">Our Story</a>
              <a href="#people">Our People</a>
              <a href="#journal">Journal</a>
              <a href="#contact">Contact</a>
            </div>
            <div>
              <span className="mv-foot__head">Connect</span>
              <a href="#contact">Speak to an expert</a>
              <a href="#contact">Request a brochure</a>
              <a href="#journal">Newsletter</a>
            </div>
          </div>
        </div>
        <div className="mv-foot__base">
          <span>© {new Date().getFullYear()} Cox &amp; Kings. All rights reserved.</span>
          <span>Luxury · Heritage · Trust since 1758</span>
        </div>
      </footer>
    </div>
  );
}
