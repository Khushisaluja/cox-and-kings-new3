/* ============================================================================
   Cox & Kings — The Great Festive Getaway, v4  (route: /festive-getaway-v4)

   v3 with the collage taken OUT of the ground and put back in the frame.

     v3  five drifting columns behind the whole band under a heavy scrim —
         the eye went to the gradient, not to Europe.
     v4  ONE photograph, full bleed and barely veiled, so the background is
         the subject again (the /mice hero pattern). The copy keeps the left;
         the right carries an album of three captioned frames — Vienna,
         Copenhagen, Stockholm — overlapped like prints laid on a table, with
         the wax seal stamped on the corner of the stack.

   THE VEIL is light on purpose: dense only behind the copy column and at the
   top edge for the nav, and nearly clear across the right half, where the
   album sits on the photograph rather than on a navy panel.

   Below 1041px the album steps down to a three-up strip under the copy, and
   below 560px to a swipeable row, so the phone still opens on the headline
   and the first CTA.

   EVERYTHING BELOW THE HERO IS v1/v3, deliberately — the hero is the only
   variable across the four.

   HOW IT IS BUILT. FestiveGetaway.css first, then FestiveGetawayV4.css, and
   the root wears one extra class: <div class="h26 new-typo n3 fg fgv4">
   Every rule in the v4 stylesheet is scoped to `.fgv4`.
   ========================================================================== */

import { useState, useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight, MessageCircle, CalendarCheck, BedDouble, UserRound,
  Camera, BusFront, UtensilsCrossed, ShieldCheck, Plane, ShieldHalf, Award, Users,
  Sparkles, Ship, Coffee, Landmark, Hotel, FileCheck2, Check, PhoneCall, ArrowDown,
} from 'lucide-react';
import { SiteNav, CONTACT_CK } from '../components/SiteChrome';
import { useScheduleCall, ScheduleCallForm, SmartLink } from '../components/ScheduleCall';
import { CALLBACK } from '../data/v3content';
import './FestiveGetaway.css';
import './FestiveGetawayV4.css';

gsap.registerPlugin(ScrollTrigger);

const img = (id, w = 1400) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

/* ---------------------------------------------------------------------------
   OFFER SLOT. The brief keeps room for a festive offer. Set this to an object
   and a ribbon appears above the hero headline:
     { tag: 'Festive offer', text: 'Save ₹20,000 per couple on October departures' }
   Leave null to ship without one — nothing else on the page changes.
   --------------------------------------------------------------------------- */
const OFFER = null;

/* THE BACKGROUND — Warsaw's Old Town Square at blue hour: the lit
   Christmas tree and its star, Sigismund's Column and the painted houses
   under a deep blue sky. The sky on the left carries the copy on a light
   gradient. ⚠ Stock stand-in: Cox & Kings' own festive-departure
   photography is the swap that would change this most. */
const HERO_IMG = '1737726956404-63c1d60afe64';

/* THE ALBUM — three frames on the right of the hero. Three, not six: at three
   each print is large enough to be a place; at six it was a contact sheet.
   Two of the three are Nordic on purpose — the Grand Nordic Passage is the
   brief's lead tour — and all three are evenings, so the stack reads as one
   season rather than three brochures. Vienna's Christmas market takes the tall
   print. */
const ALBUM = [
  { id: '1733991354048-26f6b5eb7e81', place: 'Vienna', note: 'Christkindlmarkt', alt: 'The Vienna Christmas market arch lit in front of the City Hall at night' },
  { id: '1513622470522-26c3c8a854bc', place: 'Copenhagen', note: 'Nyhavn by lamplight', alt: 'The lit harbour houses of Nyhavn, Copenhagen' },
  { id: '1509356843151-3e7d96241e11', place: 'Stockholm', note: 'Gamla stan at dusk', alt: 'Stockholm Old Town across the water at sunset' },
];

const WHY = [
  { icon: CalendarCheck, t: 'Guaranteed Departures' },
  { icon: BedDouble, t: '4-Star & Premium Stays' },
  { icon: UserRound, t: 'Expert Tour Manager' },
  { icon: Camera, t: 'Curated Sightseeing' },
  { icon: BusFront, t: 'Comfortable Transfers' },
  { icon: UtensilsCrossed, t: 'Indian & Local Dining Options' },
  { icon: ShieldCheck, t: 'Travel Insurance' },
  { icon: Plane, t: 'Flights & Transfers Included' },
];

/* WHAT EVERY FESTIVE DEPARTURE INCLUDES. Stated once, above the grid, instead
   of seven near-identical chips repeated on all three cards. Flights, hotels,
   sightseeing, a tour manager and transfers were on every tour in the brief and
   on coxandkings.com, so on a card they are noise: they cannot help anyone
   choose between the three. Section 3 makes the same promise at length; this
   line is its receipt, placed where the comparison happens. */
const COMMON_INC = ['Return flights', 'Hotels', 'Guided sightseeing', 'Tour manager', 'All transfers'];

/* ---------------------------------------------------------------------------
   EUROPE GIT PACKAGES — one structure for every card, so they compare.

   · The Grand Nordic Passage is the brief's own example, verbatim. It has no
     departure dates in the brief, so its card says so rather than going quiet
     and leaving a hole where the other two have chips.
   · European Highlights and Gems of Eastern Europe are live Cox & Kings group
     tours, taken from coxandkings.com on 13 Sep 2026 (price, route, inclusions
     and departures as listed there). ⚠ Confirm with the Europe product team
     before launch — live pricing is dynamic.

   `only` is the card's whole inclusion story: what this tour has that the
   others do NOT. Everything in COMMON_INC is deliberately absent from it, and
   where a tour upgrades a common item (Premium vs 4-star hotels) the UPGRADE is
   what gets named. Three lines maximum — past that nothing stands out.

   `countries` is counted off the route, not marketing copy:
     Nordic    DK · NO · SE · FI                      = 4
     Highlights FR · BE · NL · DE · CH · AT · IT      = 7
     Gems      AT · HU · CZ · SK · DE                 = 5

   To add a tour, add an object; `deps: []` shows "Dates on request".
   --------------------------------------------------------------------------- */
const TOURS = [
  {
    id: 'grand-nordic-passage',
    name: 'The Grand Nordic Passage',
    nd: '10 Nights / 11 Days',
    nights: 10,
    tag: 'Scandinavia',
    countries: 4,
    route: ['Copenhagen', 'Aarhus', 'Stavanger', 'Bergen', 'Oslo', 'Stockholm', 'Turku', 'Helsinki'],
    price: '₹3,61,690',
    only: [
      { icon: Sparkles, t: 'Premium hotels throughout' },
      { icon: Ship, t: 'Fjord & Baltic cruises' },
      { icon: Coffee, t: 'Daily breakfast' },
    ],
    deps: [],
    image: '1509356843151-3e7d96241e11',
    alt: 'Stockholm Old Town across the water at sunset',
  },
  {
    id: 'european-highlights',
    name: 'European Highlights',
    nd: '9 Nights / 10 Days',
    nights: 9,
    tag: 'Western Europe',
    countries: 7,
    route: ['Paris', 'Brussels', 'Amsterdam', 'Frankfurt', 'Lucerne', 'Seefeld', 'Padova', 'Venice', 'Rome'],
    price: '₹2,68,850',
    only: [
      { icon: Landmark, t: 'Seven countries in one trip' },
      { icon: ShieldCheck, t: 'Travel insurance included' },
      { icon: Coffee, t: 'Daily breakfast' },
    ],
    deps: ['15 Oct', '5 Nov'],
    image: '1502602898657-3e91760cbb34',
    alt: 'The Eiffel Tower above the Seine at dusk',
  },
  {
    id: 'gems-of-eastern-europe',
    name: 'Gems of Eastern Europe',
    nd: '7 Nights / 8 Days',
    nights: 7,
    tag: 'Central Europe',
    countries: 5,
    route: ['Vienna', 'Budapest', 'Prague', 'Bratislava', 'Salzburg', 'Hallstatt', 'Munich'],
    price: '₹2,50,621',
    only: [
      { icon: UtensilsCrossed, t: 'Indian & local meals' },
      { icon: FileCheck2, t: 'Visa assistance' },
      { icon: Hotel, t: '4-star hotels' },
    ],
    deps: ['16 Oct', '6 Nov', '20 Dec'],
    image: '1541343672885-9be56236302a',
    alt: 'Budapest and the Danube in warm autumn light',
  },
];

/* ---------------------------------------------------------------------------
   THE PROPOSITION, as a four-step story.

   The brief gives the section a thought line — "Festive season in India →
   Time to get together → Time for a getaway → Europe is the perfect choice" —
   and four sentences of copy. Rather than a headline, a timeline and a column
   of paragraphs set side by side (three things to read in parallel), each step
   carries its own sentence and its own photograph of people together, so the
   argument is read once, in order, and scans at a glance. The brief's closing
   line gets its own band beneath.
   --------------------------------------------------------------------------- */
const STORY = [
  {
    n: '01', t: 'Festive season in India',
    b: 'In India, the festive season is when families and friends come together.',
    id: '1467810563316-b5476525c0f9', alt: 'Hands holding lit sparklers at dusk',
  },
  {
    n: '02', t: 'Time to get together',
    b: 'It is also the perfect time to take a break, make plans and get away together.',
    id: '1528605248644-14dd04022da1', alt: 'Friends and family sharing a long table dinner',
  },
  {
    n: '03', t: 'Time for a getaway',
    b: 'And what better getaway than Europe?',
    id: '1529156069898-49953e39b3ac', alt: 'A group of friends sitting arm in arm, looking out over a European landscape',
  },
  {
    n: '04', t: 'Europe is the perfect choice',
    b: 'From grand cities and beautiful landscapes to food, culture and unforgettable experiences, Europe offers the perfect setting for a festive holiday with the people who matter most.',
    id: '1491438590914-bc09fcaaf77a', alt: 'Three friends in winter coats laughing together', answer: true,
  },
];

/* The brief's rangoli-star mark: eight points, drawn once, used as the eyebrow
   glyph and the closing ornament. */
function Star({ className = '' }) {
  return (
    <svg className={`fg-star ${className}`} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M12 0l2.2 7.6L21 3l-4.6 6.8L24 12l-7.6 2.2L21 21l-6.8-4.6L12 24l-2.2-7.6L3 21l4.6-6.8L0 12l7.6-2.2L3 3l6.8 4.6z" />
    </svg>
  );
}

function Garland({ count = 22, paper = false, className = '' }) {
  return (
    <ul className={`fg-garland${paper ? ' fg-garland--paper' : ''} ${className}`} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => <i key={i} />)}
    </ul>
  );
}

/* Deterministic embers — no Math.random, so the markup is stable across renders. */
const EMBERS = Array.from({ length: 16 }).map((_, i) => ({
  left: `${(i * 37 + 7) % 100}%`,
  '--s': `${3 + (i * 7) % 6}px`,
  '--d': `${11 + (i * 5) % 9}s`,
  '--dl': `${-((i * 13) % 17)}s`,
  '--x': `${((i * 23) % 60) - 30}px`,
}));

/* ========================================================================== */

export default function FestiveGetawayV4() {
  const root = useRef(null);
  const railRef = useRef(null);
  const openForm = useScheduleCall();

  /* Section 7 sits directly above an open form, so its button walks the reader
     down to it and puts the cursor in the first field — a dialog there would
     cover the very thing it was asking them to fill in. If the section is ever
     removed the popup is still the fallback. */
  const toForm = () => {
    const el = document.getElementById('fg-enquire');
    if (!el) { openForm(); return; }
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'start' });
    window.setTimeout(
      () => el.querySelector('.cb-input')?.focus({ preventScroll: true }),
      still ? 0 : 700,
    );
  };

  const [barVisible, setBarVisible] = useState(false);
  const [railIdx, setRailIdx] = useState(0);

  /* ---- mobile tour rail position --------------------------------------- */
  const onRail = () => {
    const track = railRef.current;
    const first = track?.firstElementChild;
    if (!track || !first) return;
    const gap = parseFloat(getComputedStyle(track).columnGap || '14') || 14;
    setRailIdx(Math.round(track.scrollLeft / (first.offsetWidth + gap)));
  };

  /* ---- motion ------------------------------------------------------------ */
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      /* The bars are navigation, not decoration — outside the motion gate.
         They step aside over section 7, where the same button is on screen. */
      ScrollTrigger.create({
        trigger: '.fg-hero',
        start: 'bottom top+=80',
        onEnter: () => setBarVisible(true),
        onLeaveBack: () => setBarVisible(false),
      });
      ScrollTrigger.create({
        trigger: '#fg-enquire',
        start: 'top 70%',
        end: 'bottom 30%',
        onEnter: () => setBarVisible(false),
        onEnterBack: () => setBarVisible(false),
        onLeave: () => setBarVisible(true),
        onLeaveBack: () => setBarVisible(true),
      });

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        /* HERO — the headline lines rise out of their masks, the rest of the
           column follows a beat later, and the wax seal stamps itself on last.
           The photograph's own drift is CSS (as it is on /easy-escapes): a
           tween on the same transform would only lose to the running keyframes. */
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
        tl.fromTo('.fg-hero__kicker', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7 }, 0.1)
          .fromTo('.fg-hero__title .fg-line > span', { yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: 0.1 }, 0.15)
          .fromTo('.fg-hero__reveal', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.09 }, 0.6)
          .fromTo('.fg-seal', { opacity: 0, scale: 0.3, rotation: -60 },
            { opacity: 1, scale: 1, rotation: 0, duration: 1, ease: 'back.out(1.8)' }, 1.05);

        /* Generic rises. */
        gsap.utils.toArray('.fg-rise').forEach((el) => {
          gsap.fromTo(el, { opacity: 0, y: 30 }, {
            opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          });
        });
        gsap.utils.toArray('.fg-rise-group').forEach((g) => {
          gsap.fromTo(g.children, { opacity: 0, y: 30 }, {
            opacity: 1, y: 0, duration: 0.85, ease: 'power3.out', stagger: 0.09,
            scrollTrigger: { trigger: g, start: 'top 85%', once: true },
          });
        });

        /* INTRO — the headline brightens word by word as it is read. */
        const words = gsap.utils.toArray('.fg-intro__h .fg-w');
        if (words.length) {
          gsap.fromTo(words, { opacity: 0.14 }, {
            opacity: 1, ease: 'none', stagger: 0.1,
            scrollTrigger: { trigger: '.fg-intro__h', start: 'top 82%', end: 'bottom 45%', scrub: true },
          });
        }
        gsap.utils.toArray('.fg-intro__pic img').forEach((im, i) => {
          gsap.fromTo(im, { yPercent: i ? 8 : -6, scale: 1.12 }, {
            yPercent: i ? -8 : 6, scale: 1.12, ease: 'none',
            scrollTrigger: { trigger: '.fg-intro', start: 'top bottom', end: 'bottom top', scrub: true },
          });
        });

        /* WHY — the eight tiles light in a wave. */
        gsap.fromTo('.fg-why__item', { opacity: 0, y: 40 }, {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          stagger: { each: 0.07, grid: 'auto', from: 'start' },
          scrollTrigger: { trigger: '.fg-why__grid', start: 'top 82%', once: true },
        });
        gsap.fromTo('.fg-why__ic', { scale: 0.4, rotation: -45 }, {
          scale: 1, rotation: 0, duration: 0.9, ease: 'back.out(2)', stagger: 0.07,
          scrollTrigger: { trigger: '.fg-why__grid', start: 'top 82%', once: true },
        });

        /* TOURS */
        gsap.fromTo('.fg-card', { opacity: 0, y: 60 }, {
          opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.12,
          scrollTrigger: { trigger: '.fg-tours__grid', start: 'top 85%', once: true },
        });

        /* PROPOSITION — the garland lights, then the story's photographs are
           unveiled step by step and drift gently while in view. */
        gsap.fromTo('.fg-prop__garland i', { opacity: 0, scale: 0 }, {
          opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(3)', stagger: 0.04,
          scrollTrigger: { trigger: '.fg-prop', start: 'top 75%', once: true },
          clearProps: 'opacity,transform',
        });
        gsap.utils.toArray('.fg-step').forEach((step) => {
          const pic = step.querySelector('.fg-step__img');
          const im = step.querySelector('.fg-step__img img');
          const st = { trigger: step, start: 'top 86%', once: true };
          gsap.fromTo(step.querySelector('.fg-step__n'), { scale: 0 }, { scale: 1, duration: 0.6, ease: 'back.out(2.4)', scrollTrigger: st });
          gsap.fromTo(pic, { clipPath: 'inset(100% 0% 0% 0%)' }, {
            clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'power4.inOut', scrollTrigger: st, clearProps: 'clipPath',
          });
          gsap.fromTo(step.querySelectorAll('.fg-step__t, .fg-step__b'), { opacity: 0, y: 18 }, {
            opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08, delay: 0.25, scrollTrigger: st,
          });
          gsap.fromTo(im, { yPercent: -6 }, {
            yPercent: 0, ease: 'none',
            scrollTrigger: { trigger: step, start: 'top bottom', end: 'bottom top', scrub: true },
          });
        });
        gsap.fromTo('.fg-invite__img img', { scale: 1.14 }, {
          scale: 1, ease: 'none',
          scrollTrigger: { trigger: '.fg-invite', start: 'top bottom', end: 'bottom center', scrub: true },
        });

        /* LEGACY and LEAD — photographs travel a little slower than their column. */
        gsap.utils.toArray('.fg-trust__img img, .fg-lead__img img').forEach((im) => {
          gsap.fromTo(im, { yPercent: -6, scale: 1.12 }, {
            yPercent: 6, scale: 1.12, ease: 'none',
            scrollTrigger: { trigger: im.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
          });
        });

        /* CLOSE — the photograph pushes in, the lines rise. */
        gsap.fromTo('.fg-close__media img', { scale: 1.18 }, {
          scale: 1, ease: 'none',
          scrollTrigger: { trigger: '.fg-close', start: 'top bottom', end: 'bottom bottom', scrub: true },
        });
        gsap.fromTo('.fg-close__title .fg-line > span', { yPercent: 110 }, {
          yPercent: 0, duration: 1.1, ease: 'power4.out', stagger: 0.12,
          scrollTrigger: { trigger: '.fg-close__title', start: 'top 85%', once: true },
        });
        return () => {};
      });

      /* The story's rule draws itself: across on desktop, down on mobile —
         different transforms, so two branches rather than one tween that
         silently does nothing on a phone. */
      mm.add({
        wide: '(min-width: 861px) and (prefers-reduced-motion: no-preference)',
        narrow: '(max-width: 860px) and (prefers-reduced-motion: no-preference)',
      }, (c) => {
        const rule = document.querySelector('.fg-story__rule i');
        if (!rule) return undefined;
        const axis = c.conditions.wide ? 'scaleX' : 'scaleY';
        gsap.fromTo(rule, { [axis]: 0 }, {
          [axis]: 1, ease: 'none',
          scrollTrigger: { trigger: '.fg-story', start: 'top 80%', end: c.conditions.wide ? 'top 35%' : 'bottom 70%', scrub: true },
        });
        return () => {};
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const introWords = 'This Festive Season, Give Yourself Somewhere New To Go.'.split(' ');

  return (
    <div className="h26 new-typo n3 fg fgv4" ref={root}>
      <SiteNav solidAt={80} skipTo="#fg-main" skipLabel="Skip to content" />

      {/* ============================================================== 1 HERO */}
      {/* The /mice hero pattern: one full-bleed photograph under a light
          veil, the copy on the left, and on the right an album of three
          captioned prints with the wax seal stamped on the stack. */}
      <header className="fg-hero fgv4-hero" id="fg-main" tabIndex={-1}>
        {/* One photograph and a light veil — the ground is the subject. */}
        <div className="fg-hero__bg" style={{ backgroundImage: `url(${img(HERO_IMG, 2000)})` }} aria-hidden="true" />
        <div className="fgv4-veil" aria-hidden="true" />
        <div className="fg-hero__glow" aria-hidden="true" />
        <div className="fg-embers" aria-hidden="true">
          {EMBERS.map((s, i) => <span key={i} style={s} />)}
        </div>

        <div className="fgv4-hero__inner">
          <div className="fgv4-hero__copy">
            {OFFER && (
              <p className="fg-offer fg-hero__reveal"><b>{OFFER.tag}</b>{OFFER.text}</p>
            )}
            <p className="fg-hero__kicker"><Star /> Cox &amp; Kings · Europe Group Tours</p>
            <h1 className="fg-hero__title">
              <span className="fg-line"><span>The Great</span></span>
              <span className="fg-line"><span><em>Festive</em> Getaway</span></span>
            </h1>
            <p className="fg-hero__support fg-hero__reveal">
              This festive season, take your celebrations somewhere unforgettable.
              Discover Europe with expertly curated group journeys, iconic destinations
              and departures designed for the Indian traveller.
            </p>
            <p className="fg-hero__pill fg-hero__reveal">
              Guaranteed departures. October to December. Flights in.
            </p>
            <div className="fg-hero__actions fg-hero__reveal">
              <button type="button" className="h26-btn h26-btn-accent h26-btn-lg" onClick={openForm}>
                Talk to an Expert <ArrowRight size={16} aria-hidden="true" />
              </button>
              <a className="h26-btn h26-btn-glass h26-btn-lg" href="#fg-tours">
                See the group tours <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>
            <ul className="fg-hero__proof fgv4-hero__proof fg-hero__reveal" aria-label="Why Cox and Kings">
              <li><strong>260+</strong><span>Years of travel</span></li>
              <li><strong>4.9★</strong><span>2,400+ reviews</span></li>
              <li><strong>Oct–Dec</strong><span>Festive departures</span></li>
            </ul>
          </div>

          {/* THE ALBUM. Real content, not decoration: each print is a place
              the tours go, so each carries its alt text and its caption. */}
          <div className="fgv4-album" role="group" aria-label="Three European evenings on this season's tours">
            {ALBUM.map((p, i) => (
              <figure className={`fgv4-print fgv4-print--${i + 1}`} key={p.id}>
                <div className="fgv4-print__img">
                  <img
                    src={img(p.id, 640)}
                    srcSet={`${img(p.id, 420)} 420w, ${img(p.id, 640)} 640w, ${img(p.id, 900)} 900w`}
                    sizes="(max-width: 1040px) 33vw, 22vw"
                    alt={p.alt}
                    /* Lazy, so a phone — where the album is display:none —
                       never fetches the prints; on desktop they are in the
                       first viewport and load straight away regardless. */
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <figcaption className="fgv4-print__cap">
                  <span className="fgv4-print__place">{p.place}</span>
                  <span className="fgv4-print__note">{p.note}</span>
                </figcaption>
              </figure>
            ))}
            {/* The seal, stamped on the corner of the stack. */}
            <div className="fg-seal" aria-hidden="true">
              <svg className="fg-seal__ring" viewBox="0 0 120 120">
                <defs>
                  <path id="fgv4-ring" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
                </defs>
                <text fontSize="9.4" letterSpacing="2.6" fill="currentColor" fontFamily="Work Sans, sans-serif">
                  <textPath href="#fgv4-ring">FESTIVE GETAWAY · EUROPE · 2026 ·</textPath>
                </text>
              </svg>
              <span className="fg-seal__core">Europe<br />awaits</span>
            </div>
          </div>
        </div>
      </header>

      {/* ====================================================== 2 INTRODUCTION */}
      <section className="fg-sec fg-intro" aria-labelledby="fg-intro-h">
        <div className="fg-wrap fg-intro__grid">
          <div className="fg-intro__copy">
            <p className="fg-eyebrow"><Star /> The Great Festive Getaway</p>
            <h2 id="fg-intro-h" className="fg-intro__h">
              {introWords.map((w, i) => (
                <span key={i}>
                  <span className="fg-w">
                    {/Somewhere|New/.test(w) ? <em>{w}</em> : w}
                  </span>{' '}
                </span>
              ))}
            </h2>
            <div className="fg-rise-group">
              <p>
                From iconic cities and grand architecture to scenic landscapes, European
                cafés and unforgettable experiences : this festive season is the perfect
                time to take that holiday you&apos;ve been planning.
              </p>
              <p>
                With Cox &amp; Kings, explore Europe on thoughtfully planned group journeys
                with comfortable stays, curated experiences and the reassurance of
                travelling with experts.
              </p>
            </div>
          </div>
          <div className="fg-intro__pics">
            {/* Both frames are European cities in their festive dress rather
                than daytime landmarks — the season is the subject, the place is
                the offer. ⚠ Stock stand-ins: swap for true festive-market
                photography (Prague, Vienna, Copenhagen, Strasbourg) at launch. */}
            <div className="fg-intro__pic fg-intro__pic--a">
              <img src={img('1541849546-216549ae216d', 900)}
                alt="The spires and red roofs of Prague Old Town above its festive market square"
                loading="lazy" decoding="async" />
            </div>
            <div className="fg-intro__pic fg-intro__pic--b">
              <img src={img('1513622470522-26c3c8a854bc', 700)}
                alt="The lit harbour houses of Nyhavn, Copenhagen, in festive colour"
                loading="lazy" decoding="async" />
            </div>
            <span className="fg-intro__note">Somewhere new</span>
          </div>
        </div>
      </section>

      {/* ======================================================= 3 WHY EUROPE */}
      <section className="fg-sec fg-why" aria-labelledby="fg-why-h">
        <div className="fg-wrap">
          <header className="fg-sechead fg-sechead--split fg-rise-group">
            <div>
              <p className="fg-eyebrow"><Star /> Travel expertly</p>
              <h2 id="fg-why-h" className="fg-h2">Why Europe With <em>Cox &amp; Kings</em></h2>
            </div>
            <p className="fg-lede">Everything that makes a group journey effortless, already taken care of.</p>
          </header>

          <ul className="fg-why__grid">
            {WHY.map((w, i) => {
              const Icon = w.icon;
              return (
                <li className="fg-why__item" key={w.t}>
                  <span className="fg-why__ic"><Icon size={22} strokeWidth={1.6} aria-hidden="true" /></span>
                  <span className="fg-why__n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="fg-why__t">{w.t}</h3>
                </li>
              );
            })}
          </ul>
          <p className="fg-why__note">Inclusions vary by tour — each card below lists its own.</p>
        </div>
      </section>

      {/* ======================================================== 4 GROUP TOURS */}
      <section className="fg-sec fg-tours" id="fg-tours" aria-labelledby="fg-tours-h">
        <div className="fg-wrap">
          <header className="fg-sechead fg-sechead--split fg-rise-group">
            <div>
              <p className="fg-eyebrow"><Star /> Festive departures</p>
              <h2 id="fg-tours-h" className="fg-h2">Explore Our Europe <em>Group Tours</em></h2>
            </div>
            <p className="fg-lede">
              Enough to know the journey. Enquire and a Europe expert will walk you
              through the rest.
            </p>
          </header>

          {/* The promise every card would otherwise repeat, made once. Five
              identical chips on three cards taught a reader nothing; moved up
              here they become the floor the cards are compared ABOVE. */}
          <p className="fg-tours__base">
            <span className="fg-lab">Every tour includes</span>
            {COMMON_INC.map((x) => (
              <span className="fg-base__i" key={x}><Check size={13} aria-hidden="true" />{x}</span>
            ))}
          </p>

          <ul className="fg-tours__grid" ref={railRef} onScroll={onRail}>
            {TOURS.map((t) => (
              <li key={t.id}>
                <article className="fg-card" aria-labelledby={`fg-t-${t.id}`}>
                  <div className="fg-card__media">
                    <img src={img(t.image, 900)} alt={t.alt} loading="lazy" decoding="async" />
                    <span className="fg-card__tag"><Star /> {t.tag}</span>
                    <span className="fg-card__dur">{t.nd}</span>
                  </div>

                  <div className="fg-card__body">
                    {/* SCAN LAYER — the three numbers a group-tour shopper
                        compares first, in the same place on every card. */}
                    <p className="fg-card__meta">
                      <span>{t.route.length} cities</span>
                      <span>{t.countries} countries</span>
                    </p>
                    <h3 className="fg-card__name" id={`fg-t-${t.id}`}>{t.name}</h3>

                    {/* DETAIL LAYER — the full route stays. On a group tour it
                        IS the product, and a reader who wants Venice is looking
                        for the word, not for a summary of it. */}
                    <p className="fg-card__route">
                      {t.route.map((c, i) => (
                        <span key={c}>{i > 0 && <> <b aria-hidden="true">→</b> </>}{c}</span>
                      ))}
                    </p>

                    {/* DIFFERENCE LAYER — only what is true of THIS tour and
                        not the other two, one icon per line so the eye counts
                        three things instead of reading a pipe-separated run. */}
                    <ul className="fg-card__only" aria-label={`What sets ${t.name} apart`}>
                      {t.only.map(({ icon: Ic, t: label }) => (
                        <li key={label}><Ic size={16} strokeWidth={1.7} aria-hidden="true" />{label}</li>
                      ))}
                    </ul>

                    {/* DATE LAYER — present on every card, so three cards keep
                        one rhythm and a missing date reads as an answer rather
                        than as a gap. */}
                    <div className="fg-card__deps">
                      <span className="fg-lab">Departs</span>
                      {t.deps.length > 0 ? (
                        <span className="fg-card__depsl">
                          {t.deps.map((d) => <b key={d}>{d}</b>)}
                        </span>
                      ) : (
                        <span className="fg-card__depsl"><i>Dates on request</i></span>
                      )}
                    </div>

                    {/* ACTION LAYER */}
                    <div className="fg-card__foot">
                      <p className="fg-card__price">
                        <small>From</small>
                        <strong>{t.price}</strong>
                        <small>per person</small>
                      </p>
                      <button type="button" className="h26-btn h26-btn-pill"
                        onClick={openForm}
                        aria-label={`Enquire now about ${t.name}`}>
                        Enquire Now <ArrowRight size={15} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
          <div className="fg-tours__hint" aria-hidden="true">
            {TOURS.map((t, i) => <i key={t.id} className={i === railIdx ? 'is-on' : ''} />)}
          </div>

          <div className="fg-tours__foot">
            <p>Prices are per person on twin sharing and may change with availability.</p>
            <button type="button" className="fg-link" onClick={openForm}>
              Not sure which? Ask an expert <ArrowRight size={15} aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      {/* ================================================= 5 THE PROPOSITION */}
      <section className="fg-sec fg-prop" aria-labelledby="fg-prop-h">
        <Garland count={30} paper className="fg-prop__garland" />
        <div className="fg-wrap">
          <header className="fg-sechead fg-rise-group">
            <p className="fg-eyebrow"><Star /> Why now</p>
            <h2 id="fg-prop-h" className="fg-h2">
              This Festive Season, Take The Celebration <em>Somewhere New.</em>
            </h2>
          </header>

          <ol className="fg-story">
            <li className="fg-story__rule" aria-hidden="true"><i /></li>
            {STORY.map((s) => (
              <li className={`fg-step${s.answer ? ' fg-step--answer' : ''}`} key={s.n}>
                <span className="fg-step__n" aria-hidden="true">{s.n}</span>
                <div className="fg-step__img">
                  <img src={img(s.id, 700)} alt={s.alt} loading="lazy" decoding="async" />
                </div>
                <h3 className="fg-step__t">{s.t}</h3>
                <p className="fg-step__b">{s.b}</p>
              </li>
            ))}
          </ol>

          <div className="fg-invite">
            <div className="fg-invite__img">
              <img src={img('1511632765486-a01980e01a18', 1100)}
                alt="Four friends arm in arm, watching the sun go down together"
                loading="lazy" decoding="async" />
            </div>
            <div className="fg-invite__copy fg-rise-group">
              <p className="fg-invite__lead">This festive season, bring your family and friends along.</p>
              <p className="fg-invite__h">Europe is <em>waiting.</em></p>
              <Garland count={9} paper className="fg-invite__garland" />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= 6 LEGACY */}
      <section className="fg-sec fg-trust" aria-labelledby="fg-trust-h">
        <div className="fg-wrap fg-trust__grid">
          <div className="fg-trust__media fg-rise">
            {/* The legacy section argues that 260 years buys you PEOPLE who know
                what to include — so it shows people being looked after, not a
                flat-lay of maps and compasses. The objects said "heritage"; they
                could not say "someone will help you".

                ⚠ STOCK STAND-IN. This frame reads as travellers being advised,
                but it is not Cox & Kings and it carries no travel cue. The shot
                this section actually wants is C&K's own: a tour manager with
                guests, or a couple across the desk from a C&K consultant.
                Replace before launch — that, not stock, is the identity. */}
            <div className="fg-trust__img">
              <img src={img('1522202176988-66273c2fd55f', 1000)}
                alt="Three travellers laughing together over a laptop and notebook as their trip is planned"
                loading="lazy" decoding="async" />
            </div>
            <p className="fg-trust__badge">
              <strong>260+ years</strong>
              <span>Since 1758</span>
            </p>
          </div>
          <div className="fg-rise-group">
            <p className="fg-eyebrow"><Star /> The Cox &amp; Kings legacy</p>
            <h2 id="fg-trust-h" className="fg-trust__h">Europe, With 260+ Years Of <em>Travel Expertise.</em></h2>
            <p className="fg-trust__copy">
              For generations, Cox &amp; Kings has understood that great travel is about more
              than getting from one place to another. It&apos;s about knowing what to include,
              what to leave out and how to make every journey feel effortless.
            </p>
            <ul className="fg-trust__row">
              <li><Award size={18} aria-hidden="true" /> Since 1758</li>
              <li><Users size={18} aria-hidden="true" /> Escorted group departures</li>
              <li><ShieldHalf size={18} aria-hidden="true" /> 4.9★ from 2,400+ travellers</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ======================================================= 7 LEAD CTA */}
      {/* One button, the site's own popup form. No second form on the page. */}
      <section className="fg-sec fg-lead" id="fg-plan" aria-labelledby="fg-lead-h">
        <div className="fg-wrap fg-lead__panel">
          <div className="fg-rise-group">
            <p className="fg-eyebrow"><Star /> Plan your getaway</p>
            <h2 id="fg-lead-h" className="fg-h2">Ready To Make This Festive Season <em>A European One?</em></h2>
            <p className="fg-lede">Tell us where you want to go. We&apos;ll help you plan the rest.</p>
            <div className="fg-lead__actions">
              <button type="button" className="h26-btn h26-btn-pill" onClick={toForm}>
                Talk To A Europe Expert <ArrowDown size={17} aria-hidden="true" />
              </button>
            </div>
            <p className="fg-lead__note">No charge, no obligation.</p>
          </div>
          <div className="fg-lead__img fg-rise">
            <img src={img('1467269204594-9661b134dd2b', 1100)}
              alt="A flower-lined old-town street in Europe at golden hour"
              loading="lazy" decoding="async" />
          </div>
        </div>
      </section>

      {/* ========================================================= 8 FINAL CTA */}
      {/* THE FORM IS ALREADY OPEN. An ad visitor who has scrolled this far has
          decided; asking them to click once more to be shown a dialog spends
          that decision on an interaction. The fields are the site's own — the
          very same <ScheduleCallForm> the nav's popup renders — so leads still
          land in one CRM flow and there is no second form to maintain.

          The photograph stays: on a wide screen it holds the left half behind
          the headline, and the form sits on it as a lit panel. On a phone the
          headline shortens and the panel takes the width. */}
      <section className="fg-close" id="fg-enquire" aria-labelledby="fg-close-h">
        <div className="fg-close__media" aria-hidden="true">
          <img src={img('1498931299472-f7a63a5a1cfa', 2000)} alt="" loading="lazy" decoding="async" />
        </div>
        <div className="fg-close__inner">
          <div className="fg-close__copy">
            <Star />
            <h2 id="fg-close-h" className="fg-close__title">
              <span className="fg-line"><span>Your Festive</span></span>
              <span className="fg-line"><span>Getaway <em>Is Calling.</em></span></span>
            </h2>
            <p className="fg-close__sub fg-rise">Explore Europe<i>·</i>Travel Expertly</p>
            <ul className="fg-close__proof fg-rise" aria-label="What to expect">
              <li><PhoneCall size={17} aria-hidden="true" /> A Europe specialist calls you back</li>
              <li><CalendarCheck size={17} aria-hidden="true" /> At the time you pick, no charge</li>
              <li><ShieldHalf size={17} aria-hidden="true" /> 260+ years of travel expertise</li>
            </ul>
          </div>

          <div className="fg-close__form fg-rise">
            <ScheduleCallForm />
          </div>
        </div>
      </section>

      {/* ======================================================= FOOTER */}
      {/* The marketing-page footer, local to v4 (the shared SiteFooter is
          untouched). An ad visitor's last screen needs the brand, a way to get
          help and the legal line — not eighteen routes off the page — so it is
          one row and a rule, not a four-column directory. */}
      <footer className="fgv4-foot">
        <div className="fgv4-foot__row">
          <img className="fgv4-foot__logo" src="/cox-logo-new.png" alt="Cox & Kings" />
          <nav className="fgv4-foot__help" aria-label="Help and support">
            <span className="fgv4-foot__label">Help &amp; support</span>
            <SmartLink to={CALLBACK}>Contact us</SmartLink>
            <SmartLink to="/faq2">FAQs</SmartLink>
            <SmartLink to="/terms#refund-policy">Refund policy</SmartLink>
            <SmartLink to="/terms">Terms &amp; Conditions</SmartLink>
          </nav>
          <div className="fgv4-foot__contact">
            <a href={CONTACT_CK.phoneHref}><PhoneCall size={14} aria-hidden="true" /> {CONTACT_CK.phoneDisplay}</a>
            <a href={`mailto:${CONTACT_CK.email}`}>{CONTACT_CK.email}</a>
          </div>
        </div>
        <div className="fgv4-foot__legal">
          <span>© {new Date().getFullYear()} Cox &amp; Kings. Travelling the world since 1758.</span>
          <span>IATA · TAAI · ASTA</span>
        </div>
      </footer>

      {/* Mobile thumb bar — the homepage's own component. */}
      <div className={`h26-thumbbar${barVisible ? '' : ' is-hidden'}`} aria-hidden={!barVisible}>
        <button type="button" className="h26-thumbbar-cta" onClick={openForm} tabIndex={barVisible ? 0 : -1}>
          Talk to an Expert <ArrowRight size={18} aria-hidden="true" />
        </button>
        <button type="button" className="h26-thumbbar-call" aria-label="Schedule a callback"
          onClick={openForm} tabIndex={barVisible ? 0 : -1}>
          <MessageCircle size={20} aria-hidden="true" />
        </button>
      </div>

      {/* Desktop equivalent. */}
      <div className={`fg-bar${barVisible ? ' is-on' : ''}`} aria-hidden={!barVisible}>
        <span className="fg-bar__t">Your festive getaway is calling.</span>
        <button type="button" className="h26-btn h26-btn-pill" onClick={openForm} tabIndex={barVisible ? 0 : -1}>
          Enquire Now
        </button>
      </div>
    </div>
  );
}
