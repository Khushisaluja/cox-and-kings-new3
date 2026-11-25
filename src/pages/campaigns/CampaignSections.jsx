/* ============================================================================
   Campaign sections for /new3-campaigns, the New3 homepage re-cut around
   this season's three marketing campaigns. Each section links to its lander:

     /japan-cherry-blossom   Japan in Full Bloom (spring 2027)
     /europe-early-booking   Europe, booked early (summer 2027, early bird)
     /vietnam-group-tours    Vietnam (spring 2027)

   Prices, deposits, seasons and nights are read from each lander's own
   data.js, so the homepage can never quote a number the lander doesn't.

   Sections, all GSAP + ScrollTrigger, all scoped to `.n3c`:

     <JapanFeature/>     arched photo with petals + a drifting night print
     <EuropeFeature/>    full-bleed photo, live early-bird countdown, stamp
     <VietnamFeature/>   VIỆT NAM behind the karsts, lanterns over the top
     <BookingRoute/>     a plane flies the four booking steps (scrubbed)
     <CampaignCards/>    one section, three cards (the other variant)

   Variant A (/new3-campaigns) spreads the three features down the page;
   variant B (/new3-campaign-cards) uses CampaignCards alone.

   Rules carried over from the landers: fromTo, never from(); an entrance
   tween and a scrubbed tween never share a node; nothing animates under
   prefers-reduced-motion, where every section is still complete and legible.
   ========================================================================== */

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { SplitText } from 'gsap/SplitText';
import { ArrowRight, ArrowLeft, ArrowUpRight, Plane, FileCheck2, BadgeCheck, Wallet, CalendarDays, Hotel, UtensilsCrossed } from 'lucide-react';
import * as JP from '../sakura/data';
import * as EU from '../europe/data';
import * as VN from '../vietnam/data';
import './campaigns.css';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, SplitText);

/* ---------------------------------------------------------------------------
   The three campaigns, derived from the landers' data
   ------------------------------------------------------------------------ */
const unsplash = (id, w = 1600) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=78`;
const MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function summarise(D) {
  /* Europe prints the sheet's price as-is (FROM_PRICE) and has one booking
     amount (OFFER.booking); Japan and Vietnam still net the online saving. */
  const from = D.FROM_PRICE ?? Math.min(...D.TOURS.map((t) => t.price)) - D.OFFER.onlineDiscount;
  const nights = D.TOURS.map((t) => Number((t.nd.match(/(\d+)\s*Nights/) || [])[1])).filter(Boolean);
  const live = D.TOURS.flatMap((t) => t.deps.filter((d) => !d.soldOut).map((d) => d.iso)).sort();
  const m0 = Number(live[0].slice(5, 7)) - 1;
  const m1 = Number(live[live.length - 1].slice(5, 7)) - 1;
  const seats = D.TOURS.flatMap((t) => t.deps).reduce((a, d) => a + d.seats, 0);
  return {
    from: D.inr(from),
    deposit: D.inr(D.OFFER.booking ?? D.OFFER.depositOnline),
    save: D.inr(D.OFFER.onlineDiscount),
    nights: `${Math.min(...nights)}–${Math.max(...nights)} nights`,
    window: m0 === m1 ? MONTH[m0] : `${MONTH[m0]} to ${MONTH[m1]}`,
    year: live[0].slice(0, 4),
    tours: D.TOURS.length,
    seats,
  };
}

export const CAMPAIGNS = [
  {
    key: 'japan', code: 'JPN', to: '/japan-cherry-blossom',
    title: 'Japan in Full Bloom', short: 'Japan in bloom', season: 'Spring',
    line: 'Tokyo, Fuji and Kyoto under the cherry blossom, with a tour manager from the first bow to the last.',
    img: unsplash('1490806843957-31f4c9a91c65'), alt: 'Cherry blossom framing Mt Fuji and a five-storey pagoda',
    tall: unsplash('1524413840807-0c3cb6fa808d', 1200),
    ...summarise(JP),
  },
  {
    key: 'europe', code: 'EUR', to: '/europe-early-booking',
    title: 'Europe, booked early', short: 'Europe early bird', season: 'Summer',
    line: 'Paris, the Alps, Venice and Rome at this year’s lowest price, if you book before the early-bird date.',
    img: unsplash('1502602898657-3e91760cbb34'), alt: 'The Eiffel Tower above the Seine at dusk',
    tall: unsplash('1499856871958-5b9627545d1a', 1200),
    earlyBy: EU.OFFER.earlyBy,
    ...summarise(EU),
  },
  {
    key: 'vietnam', code: 'VNM', to: '/vietnam-group-tours',
    title: 'Vietnam, all taken care of', short: 'Vietnam', season: 'Spring',
    line: 'A night on Ha Long Bay, lantern-lit Hoi An, the Golden Bridge and the Mekong, every meal included.',
    img: '/vietnam/halong-sky.jpg', alt: 'Ha Long Bay’s limestone karsts rising out of the sea',
    tall: unsplash('1526139334526-f591a54b477c', 1200),
    ...summarise(VN),
  },
];
const [JAPAN, EUROPE, VIETNAM] = CAMPAIGNS;

/* Early-bird deadline: the end of OFFER.earlyBy, India time. */
const EARLY_END = (() => {
  const d = new Date(`${EU.OFFER.earlyBy} 12:00:00`); // noon, so no time zone can tip it into another day
  const ymd = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  return new Date(`${ymd}T23:59:59+05:30`);
})();

const motionOK = () => typeof window !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Re-measure every trigger when the page's height changes (lazy images,
   web fonts, framer-motion reveals above us), so pins never start late. */
function useRefreshOnResize() {
  useEffect(() => {
    let t;
    const ro = new ResizeObserver(() => { clearTimeout(t); t = setTimeout(() => ScrollTrigger.refresh(), 200); });
    ro.observe(document.body);
    document.fonts?.ready?.then(() => ScrollTrigger.refresh());
    return () => { ro.disconnect(); clearTimeout(t); };
  }, []);
}

/* ---------------------------------------------------------------------------
   Small pieces
   ------------------------------------------------------------------------ */
function Petal({ style }) {
  return (
    <svg className="n3c-petal" viewBox="0 0 40 40" style={style} aria-hidden="true">
      <path d="M20 3c5 6 11 10 11 18a11 11 0 0 1-22 0C9 13 15 9 20 3Zm0 6-1.6 4.2h3.2Z" fill="currentColor" />
    </svg>
  );
}

function Lantern({ x, len, c, s = 1 }) {
  return (
    <div className="n3c-lantern" style={{ '--x': x, '--len': `${len}px`, '--c': c, '--s': s }} aria-hidden="true">
      <div className="n3c-lantern__drop">
        <div className="n3c-lantern__swing">
          <span className="n3c-lantern__string" />
          <span className="n3c-lantern__body">
            <span className="n3c-lantern__glow" />
            <svg viewBox="0 0 80 140">
              <rect x="25" y="0" width="30" height="10" rx="2.5" fill="#3A2417" />
              <ellipse cx="40" cy="53" rx="35" ry="45" fill={c} />
              <ellipse cx="40" cy="53" rx="35" ry="45" fill="url(#n3c-lantern-shade)" />
              <ellipse cx="40" cy="53" rx="22" ry="45" fill="none" stroke="#F4C15A" strokeWidth="2.2" opacity=".85" />
              <ellipse cx="40" cy="53" rx="9" ry="45" fill="none" stroke="#F4C15A" strokeWidth="2" opacity=".7" />
              <ellipse cx="31" cy="44" rx="11" ry="27" fill="#fff" opacity=".16" />
              <rect x="27" y="95" width="26" height="10" rx="2.5" fill="#3A2417" />
              <g stroke={c} strokeWidth="2.6" strokeLinecap="round"><path d="M34 105 L32 136" /><path d="M40 105 L40 138" /><path d="M46 105 L48 136" /></g>
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}

function LanternDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="n3c-lantern-shade" cx="42%" cy="42%" r="62%">
          <stop offset="0" stopColor="#FFE9B8" stopOpacity=".45" />
          <stop offset=".55" stopColor="#FFE9B8" stopOpacity="0" />
          <stop offset="1" stopColor="#2A0B05" stopOpacity=".42" />
        </radialGradient>
      </defs>
    </svg>
  );
}

/* Live early-bird countdown. Renders nothing once the date has passed. */
function Countdown() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const ms = EARLY_END.getTime() - now;
  if (ms <= 0) return null;
  const s = Math.floor(ms / 1000);
  const parts = [
    ['days', Math.floor(s / 86400)],
    ['hrs', Math.floor((s % 86400) / 3600)],
    ['min', Math.floor((s % 3600) / 60)],
    ['sec', s % 60],
  ];
  return (
    <div className="n3c-count" role="timer" aria-label={`Early-bird price ends ${EUROPE.earlyBy}`}>
      {parts.map(([k, v]) => (
        <span key={k} className="n3c-count__cell">
          <b aria-hidden="true">{String(v).padStart(2, '0')}</b>
          <small aria-hidden="true">{k}</small>
        </span>
      ))}
    </div>
  );
}

function Facts({ c, dark = false }) {
  return (
    <dl className={`n3c-facts${dark ? ' is-dark' : ''}`}>
      <div><dt>From</dt><dd>{c.from}</dd></div>
      <div><dt>Hold a seat</dt><dd>{c.deposit}</dd></div>
      <div><dt>Departures</dt><dd>{c.window} {c.year}</dd></div>
      <div><dt>Length</dt><dd>{c.nights}</dd></div>
    </dl>
  );
}

/* ===========================================================================
   2 · THREE CAMPAIGN FEATURES (variant A: /new3-campaigns)
   Three separate sections spread down the page, each with ordinary homepage
   sections between them. The page's own paper and cream grounds stay put;
   the photographs carry the colour. No pinning, no sideways scroll.
   ======================================================================== */
const PETALS = Array.from({ length: 12 }, (_, i) => ({
  left: `${(i * 37 + 7) % 96}%`, size: 9 + ((i * 7) % 10), delay: (i * 0.83) % 7, dur: 7 + ((i * 3) % 5), hue: i % 3,
}));
const PETAL_TINTS = ['#F6C9D3', '#FBE3E8', '#EDB0BF'];

function Petals({ n = PETALS.length }) {
  return (
    <span className="n3c-petals" aria-hidden="true">
      {PETALS.slice(0, n).map((p, i) => (
        <Petal key={i} style={{ left: p.left, width: p.size, height: p.size, color: PETAL_TINTS[p.hue] }} />
      ))}
    </span>
  );
}

/* Petals fall inside whatever `.n3c-petals` box they're in; they pause when
   that box is off-screen. */
function animatePetals(scope) {
  gsap.utils.toArray(scope.querySelectorAll('.n3c-petal')).forEach((p, i) => {
    const d = PETALS[i % PETALS.length];
    gsap.set(p, { y: -20, x: 0, rotation: 0, opacity: 0 });
    const tw = gsap.to(p, {
      keyframes: {
        y: [0.3, 0.7, 1.08].map((f) => f * (p.parentElement.offsetHeight || 400)),
        x: [gsap.utils.random(-30, 30), gsap.utils.random(-60, 60), gsap.utils.random(-90, 90)],
        rotation: [90, 200, gsap.utils.random(260, 420)],
        opacity: [1, 1, 0],
        easeEach: 'none',
      },
      duration: d.dur, delay: d.delay, ease: 'none', repeat: -1,
    });
    ScrollTrigger.create({ trigger: p.parentElement, start: 'top bottom', end: 'bottom top', onToggle: (st) => (st.isActive ? tw.resume() : tw.pause()) });
  });
}

/* Heading words rise out of a mask; a section's [data-in] items follow. */
function arrive(root, { start = 'top 75%' } = {}) {
  root.querySelectorAll('[data-split]').forEach((h) => {
    SplitText.create(h, {
      type: 'lines,words', mask: 'lines', linesClass: 'n3c-line', autoSplit: true,
      onSplit: (self) => gsap.fromTo(self.words, { yPercent: 115 }, {
        yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.04,
        scrollTrigger: { trigger: h, start: 'top 85%', once: true },
      }),
    });
  });
  const items = root.querySelectorAll('[data-in]');
  if (items.length) {
    gsap.fromTo(items, { y: 28, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.08, delay: 0.15,
      scrollTrigger: { trigger: items[0], start, once: true },
    });
  }
}

/* -- JAPAN: a tall arched photograph with petals falling inside it, a
      smaller night-blossom print drifting over its corner, copy beside. */
export function JapanFeature() {
  const root = useRef(null);
  useRefreshOnResize();
  useLayoutEffect(() => {
    if (!motionOK()) return undefined;
    const ctx = gsap.context(() => {
      arrive(root.current);
      animatePetals(root.current);
      gsap.fromTo('.n3c-jp__main', { clipPath: 'inset(22% 12% 0% 12% round 999px 999px 28px 28px)' }, {
        clipPath: 'inset(0% 0% 0% 0% round 999px 999px 28px 28px)', ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top 85%', end: 'top 20%', scrub: 0.6 },
      });
      gsap.fromTo('.n3c-jp__main img', { scale: 1.25, yPercent: -6 }, {
        scale: 1.05, yPercent: 6, ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
      });
      gsap.fromTo('.n3c-jp__print', { yPercent: 40, rotation: 6 }, {
        yPercent: -30, rotation: -3, ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="n3c n3c-feat n3c-feat--japan" ref={root} aria-labelledby="n3c-jp-h">
      <div className="n3c-feat__media">
        <figure className="n3c-jp__main">
          <img src={JAPAN.img} alt={JAPAN.alt} />
          <Petals />
        </figure>
        <figure className="n3c-jp__print" aria-hidden="true">
          <img src={JAPAN.tall} alt="" />
          <figcaption>Meguro river, after dark</figcaption>
        </figure>
      </div>
      <div className="n3c-feat__copy">
        <p className="n3c-eyebrow is-blossom">This season · {JAPAN.season} {JAPAN.year}</p>
        <h2 id="n3c-jp-h" className="n3c-h2" data-split>Japan, <em>in full bloom.</em></h2>
        <p className="n3c-feat__line" data-in>{JAPAN.line}</p>
        <div data-in><Facts c={JAPAN} /></div>
        <div className="n3c-feat__ctas" data-in>
          <Link to={JAPAN.to} className="n3c-btn n3c-btn--blue">Explore Japan <ArrowRight size={16} aria-hidden="true" /></Link>
          <span className="n3c-feat__note">{JAPAN.tours} tours · {JAPAN.seats} seats left this spring</span>
        </div>
      </div>
    </section>
  );
}

/* -- EUROPE: the photograph IS the background, full bleed, slowly coming
      closer as you scroll. A live early-bird countdown sits on glass. */
export function EuropeFeature() {
  const root = useRef(null);
  useLayoutEffect(() => {
    if (!motionOK()) return undefined;
    const ctx = gsap.context(() => {
      arrive(root.current, { start: 'top 80%' });
      gsap.fromTo('.n3c-eu__bg img', { scale: 1.22, yPercent: -5 }, {
        scale: 1, yPercent: 5, ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
      });
      gsap.fromTo(root.current, { clipPath: 'inset(6% 4% 6% 4% round 32px)' }, {
        clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top 90%', end: 'top 25%', scrub: 0.5 },
      });
      gsap.fromTo('.n3c-count__cell', { rotationX: -90, opacity: 0, transformOrigin: '50% 100%' }, {
        rotationX: 0, opacity: 1, duration: 0.8, ease: 'back.out(1.7)', stagger: 0.08,
        scrollTrigger: { trigger: '.n3c-count', start: 'top 88%', once: true },
      });
      gsap.fromTo('.n3c-eu__stamp', { scale: 0, rotation: -120 }, {
        scale: 1, rotation: 0, duration: 1.2, ease: 'back.out(1.6)',
        scrollTrigger: { trigger: root.current, start: 'top 55%', once: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="n3c n3c-feat n3c-feat--europe" ref={root} aria-labelledby="n3c-eu-h">
      <div className="n3c-eu__bg" aria-hidden="true"><img src={EUROPE.img} alt="" /></div>
      <div className="n3c-eu__inner">
        <div className="n3c-feat__copy">
          <p className="n3c-eyebrow is-gold">This season · {EUROPE.season} {EUROPE.year}</p>
          <h2 id="n3c-eu-h" className="n3c-h2 is-light" data-split>Europe, <em>booked early.</em></h2>
          <p className="n3c-feat__line is-light" data-in>{EUROPE.line}</p>
          <div className="n3c-eu__count" data-in>
            <p>Early-bird price ends {EUROPE.earlyBy}</p>
            <Countdown />
          </div>
          <div className="n3c-feat__ctas" data-in>
            <Link to={EUROPE.to} className="n3c-btn n3c-btn--gold">Book Europe early <ArrowRight size={16} aria-hidden="true" /></Link>
            <span className="n3c-feat__note is-light">from <b>{EUROPE.from}</b> · hold a seat for {EUROPE.deposit}</span>
          </div>
        </div>
        <span className="n3c-eu__stamp" aria-hidden="true">
          <svg viewBox="0 0 120 120"><defs><path id="n3c-stamp" d="M60 60 m-46 0 a46 46 0 1 1 92 0 a46 46 0 1 1 -92 0" /></defs>
            <text><textPath href="#n3c-stamp">EARLY BIRD · {EUROPE.save} OFF · EARLY BIRD · {EUROPE.save} OFF · </textPath></text></svg>
          <b>{EUROPE.save.replace(',000', 'k')}</b><small>off</small>
        </span>
      </div>
      <p className="n3c-eu__credit" aria-hidden="true">Paris, the Seine at dusk</p>
    </section>
  );
}

/* -- VIETNAM: a wide banner with VIỆT NAM set behind the Ha Long karsts
      (the word sinks behind the ridge as you scroll), lanterns hanging over
      its top edge, and the offer laid out underneath. */
export function VietnamFeature() {
  const root = useRef(null);
  useLayoutEffect(() => {
    if (!motionOK()) return undefined;
    const ctx = gsap.context(() => {
      arrive(root.current, { start: 'top 88%' });
      const st = { trigger: '.n3c-vn__scene', start: 'top bottom', end: 'bottom top', scrub: true };
      gsap.fromTo('.n3c-vn__sky', { yPercent: -4 }, { yPercent: 6, ease: 'none', scrollTrigger: st });
      gsap.fromTo('.n3c-vn__word', { yPercent: -35 }, { yPercent: 60, ease: 'none', scrollTrigger: { ...st } });
      gsap.fromTo('.n3c-vn__karsts', { yPercent: 4 }, { yPercent: -6, ease: 'none', scrollTrigger: { ...st } });
      gsap.fromTo('.n3c-vn__scene', { clipPath: 'inset(0% 10% 0% 10% round 28px)' }, {
        clipPath: 'inset(0% 0% 0% 0% round 28px)', ease: 'none',
        scrollTrigger: { trigger: '.n3c-vn__scene', start: 'top 95%', end: 'top 35%', scrub: 0.6 },
      });
      gsap.fromTo('.n3c-lantern__drop', { yPercent: -150, opacity: 0 }, {
        yPercent: 0, opacity: 1, duration: 2, ease: 'elastic.out(1, 0.42)', stagger: 0.18,
        scrollTrigger: { trigger: '.n3c-vn__scene', start: 'top 75%', once: true },
      });
      gsap.utils.toArray('.n3c-lantern__swing').forEach((el, i) => {
        gsap.fromTo(el, { rotation: -(4 + i) }, { rotation: 4 + i, duration: 2.2 + i * 0.4, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="n3c n3c-feat n3c-feat--vietnam" ref={root} aria-labelledby="n3c-vn-h">
      <LanternDefs />
      <div className="n3c-vn__stage">
        <div className="n3c-vn__scene" aria-hidden="true">
          <div className="n3c-vn__sky"><img src="/vietnam/halong-sky.jpg" alt="" /></div>
          <span className="n3c-vn__tint" />
          <span className="n3c-vn__word">VIỆT NAM</span>
          <div className="n3c-vn__karsts"><img src="/vietnam/halong-karsts.webp" alt="" /></div>
        </div>
        <div className="n3c-vn__lanterns" aria-hidden="true">
          <Lantern x="5%" len={40} c="#C8352B" />
          <Lantern x="13%" len={8} c="#E9B949" s={0.8} />
          <Lantern x="84%" len={28} c="#DD6A31" s={1.05} />
        </div>
      </div>
      <div className="n3c-vn__below">
        <div>
          <p className="n3c-eyebrow is-jade">This season · {VIETNAM.season} {VIETNAM.year}</p>
          <h2 id="n3c-vn-h" className="n3c-h2" data-split>Ha Long Bay to the Mekong, <em>all taken care of.</em></h2>
          <p className="n3c-feat__line" data-in>{VIETNAM.line}</p>
        </div>
        <div>
          <div data-in><Facts c={VIETNAM} /></div>
          <div className="n3c-feat__ctas" data-in>
            <Link to={VIETNAM.to} className="n3c-btn n3c-btn--jade">Explore Vietnam <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===========================================================================
   3 · BOOKING ROUTE: a plane flies the four steps
   ======================================================================== */
const ROUTE_STEPS = [
  { icon: Wallet, t: 'Hold your seat online', b: 'Pay the deposit, and your price is locked in.' },
  { icon: FileCheck2, t: 'We file your visa', b: 'Appointments, forms and follow-ups: ours to handle.' },
  { icon: BadgeCheck, t: 'Visa approved', b: 'Only now is the balance due.' },
  { icon: Plane, t: 'Fly with a tour manager', b: 'A briefing before you go, then someone with you all the way.' },
];
/* Desktop route: a gentle wave across a 1200×260 box. Each step sits at its
   share of the route's length (STOP_AT), measured from the real path, so the
   plane reaches a stop exactly as that stop lights up. */
const ROUTE_D = 'M40 190 C 200 40, 320 40, 420 140 S 640 250, 780 130 S 1000 20, 1160 90';
const STOP_AT = [0, 0.34, 0.68, 1];

export function BookingRoute() {
  const root = useRef(null);
  const [pts, setPts] = useState(null);

  useLayoutEffect(() => {
    const path = root.current.querySelector('.n3c-route__path');
    const L = path.getTotalLength();
    setPts(STOP_AT.map((f) => { const p = path.getPointAtLength(L * f); return [p.x / 1200, p.y / 260]; }));
  }, []);

  useLayoutEffect(() => {
    if (!pts) return undefined;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        SplitText.create(root.current.querySelector('[data-split]'), {
          type: 'lines,words', mask: 'lines', linesClass: 'n3c-line', autoSplit: true,
          onSplit: (self) => gsap.fromTo(self.words, { yPercent: 115 }, {
            yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.04,
            scrollTrigger: { trigger: root.current, start: 'top 75%', once: true },
          }),
        });
        gsap.fromTo('.n3c-route__deps > *', { y: 20, opacity: 0, scale: 0.94 }, {
          y: 0, opacity: 1, scale: 1, stagger: 0.08, duration: 0.7, ease: 'back.out(1.6)',
          scrollTrigger: { trigger: '.n3c-route__deps', start: 'top 90%', once: true },
        });
        gsap.fromTo('.n3c-route__inc li', { y: 14, opacity: 0 }, {
          y: 0, opacity: 1, stagger: 0.06, duration: 0.6, ease: 'power3.out',
          scrollTrigger: { trigger: '.n3c-route__inc', start: 'top 92%', once: true },
        });
      });

      const steps = gsap.utils.toArray('.n3c-route__step');
      const light = (p) => steps.forEach((s, i) => s.classList.toggle('is-on', p >= STOP_AT[i] - 0.02));

      /* DESKTOP: the plane flies the wave, inking the route behind it. */
      mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
        const path = root.current.querySelector('.n3c-route__path');
        gsap.timeline({
          scrollTrigger: { trigger: '.n3c-route__map', start: 'top 70%', end: 'bottom 40%', scrub: 0.7, onUpdate: (st) => light(st.progress) },
        })
          .fromTo('.n3c-route__ink', { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: 'none' }, 0)
          .fromTo('.n3c-route__plane',
            { motionPath: { path, align: path, alignOrigin: [0.5, 0.5], autoRotate: true, start: 0, end: 0 } },
            { motionPath: { path, align: path, alignOrigin: [0.5, 0.5], autoRotate: true, start: 0, end: 1 }, ease: 'none' }, 0);
      });

      /* PHONES: the route runs straight down beside the steps. */
      mm.add('(max-width: 899px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.timeline({
          scrollTrigger: { trigger: '.n3c-route__steps', start: 'top 70%', end: 'bottom 55%', scrub: 0.6, onUpdate: (st) => light(st.progress) },
        })
          .fromTo('.n3c-route__rail i', { scaleY: 0 }, { scaleY: 1, ease: 'none' }, 0)
          .fromTo('.n3c-route__mplane', { top: '0%' }, { top: '100%', ease: 'none' }, 0);
      });
    }, root);
    return () => ctx.revert();
  }, [pts]);

  return (
    <section className="n3c n3c-route" ref={root} aria-labelledby="n3c-route-h">
      <div className="n3c-route__head">
        <div>
          <p className="n3c-eyebrow">How the campaign tours work</p>
          <h2 id="n3c-route-h" className="n3c-h2" data-split>Hold your seat today. <em>Pay the rest after your visa.</em></h2>
        </div>
        <div className="n3c-route__deps">
          {CAMPAIGNS.map((c) => (
            <Link key={c.key} to={c.to} className={`n3c-chip is-${c.key}`}>
              <span>{c.short}</span><b>{c.deposit}</b><small>to hold a seat</small>
            </Link>
          ))}
        </div>
      </div>
      <div className="n3c-route__map">
        <svg className="n3c-route__svg" viewBox="0 0 1200 260" aria-hidden="true">
          <path d={ROUTE_D} className="n3c-route__path" />
          <path d={ROUTE_D} className="n3c-route__ink" pathLength="1" />
          <g className="n3c-route__plane">
            <circle r="24" className="n3c-route__halo" />
            <path className="n3c-route__glyph" d="M16 0 L-4 -5 L-10 -16 L-14 -16 L-10 -4 L-16 -3 L-19 -8 L-22 -8 L-20 0 L-22 8 L-19 8 L-16 3 L-10 4 L-14 16 L-10 16 L-4 5 Z" />
          </g>
        </svg>
        <span className="n3c-route__rail" aria-hidden="true"><i /><span className="n3c-route__mplane"><Plane size={18} /></span></span>
        <ol className="n3c-route__steps">
          {ROUTE_STEPS.map(({ icon: Icon, t, b }, i) => (
            <li key={t} className={`n3c-route__step${i === 0 ? ' is-on' : ''}`}
              style={pts ? { '--sx': pts[i][0], '--sy': pts[i][1] } : undefined}>
              <span className="n3c-route__dot"><Icon size={18} aria-hidden="true" /></span>
              <span className="n3c-route__card">
                <span className="n3c-route__n" aria-hidden="true">0{i + 1}</span>
                <h3>{t}</h3>
                <p>{b}</p>
              </span>
            </li>
          ))}
        </ol>
      </div>
      <ul className="n3c-route__inc" aria-label="Included in every campaign price">
        <li><Plane size={15} aria-hidden="true" /> Return flights</li>
        <li><Hotel size={15} aria-hidden="true" /> 4-star hotels</li>
        <li><UtensilsCrossed size={15} aria-hidden="true" /> Every meal</li>
        <li><FileCheck2 size={15} aria-hidden="true" /> Visa handled</li>
        <li><CalendarDays size={15} aria-hidden="true" /> Guaranteed departures</li>
      </ul>
    </section>
  );
}

/* ===========================================================================
   4 · CAMPAIGN CARDS (variant B: /new3-campaign-cards)
   One section, three cards. Desktop: three columns. Phones: a swipe row
   with a next/previous button and dots. Each card has its own small motif:
   petals fall inside the Japan photo, the Europe card carries the live
   early-bird countdown, lanterns sway over the Vietnam photo.
   ======================================================================== */
export function CampaignCards() {
  const root = useRef(null);
  const row = useRef(null);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const el = row.current;
    if (!el) return undefined;
    const onScroll = () => {
      const cards = [...el.children];
      let best = 0; let d = Infinity;
      cards.forEach((c, i) => { const dd = Math.abs(c.offsetLeft - el.offsetLeft - el.scrollLeft); if (dd < d) { d = dd; best = i; } });
      setIdx(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 ? cards.length - 1 : best);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const go = (i) => {
    const el = row.current;
    const c = el?.children[Math.max(0, Math.min(CAMPAIGNS.length - 1, i))];
    if (c) el.scrollTo({ left: c.offsetLeft - el.offsetLeft, behavior: motionOK() ? 'smooth' : 'auto' });
  };

  useLayoutEffect(() => {
    if (!motionOK()) return undefined;
    const ctx = gsap.context(() => {
      arrive(root.current);
      animatePetals(root.current);
      gsap.fromTo('.n3c-card', { y: 90, opacity: 0, rotation: (i) => [-3, 0, 3][i] }, {
        y: 0, opacity: 1, rotation: 0, duration: 1.2, ease: 'expo.out', stagger: 0.13,
        scrollTrigger: { trigger: '.n3c-cards__row', start: 'top 85%', once: true },
      });
      gsap.fromTo('.n3c-card__photo', { clipPath: 'inset(100% 0% 0% 0% round 22px)' }, {
        clipPath: 'inset(0% 0% 0% 0% round 22px)', duration: 1.3, ease: 'expo.inOut', stagger: 0.13, delay: 0.1,
        scrollTrigger: { trigger: '.n3c-cards__row', start: 'top 85%', once: true },
      });
      gsap.utils.toArray('.n3c-card__photo > img').forEach((im) => {
        gsap.fromTo(im, { yPercent: -7 }, {
          yPercent: 7, ease: 'none',
          scrollTrigger: { trigger: im.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
        });
      });
      gsap.fromTo('.n3c-card .n3c-lantern__drop', { yPercent: -150, opacity: 0 }, {
        yPercent: 0, opacity: 1, duration: 2, ease: 'elastic.out(1, 0.42)', stagger: 0.18, delay: 0.6,
        scrollTrigger: { trigger: '.n3c-cards__row', start: 'top 80%', once: true },
      });
      gsap.utils.toArray('.n3c-card .n3c-lantern__swing').forEach((el, i) => {
        gsap.fromTo(el, { rotation: -(4 + i) }, { rotation: 4 + i, duration: 2.2 + i * 0.4, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="n3c n3c-cards" ref={root} aria-labelledby="n3c-cards-h">
      <LanternDefs />
      <div className="n3c-cards__head">
        <div>
          <p className="n3c-eyebrow">This season’s departures</p>
          <h2 id="n3c-cards-h" className="n3c-h2" data-split>Three journeys, <em>ready to board.</em></h2>
        </div>
        <div className="n3c-cards__side">
          <p className="n3c-feat__line" data-in>
            One price covers flights, 4-star hotels, every meal and your visa. Hold your seat online and
            pay the rest only after your visa comes through.
          </p>
          <div className="n3c-cards__nav" data-in>
            <button type="button" className="n3c-iconbtn" onClick={() => go(idx - 1)} disabled={idx === 0} aria-label="Previous journey"><ArrowLeft size={18} /></button>
            <button type="button" className="n3c-iconbtn is-next" onClick={() => go(idx + 1)} disabled={idx === CAMPAIGNS.length - 1} aria-label="Next journey"><ArrowRight size={18} /></button>
          </div>
        </div>
      </div>

      <ul className="n3c-cards__row" ref={row}>
        {CAMPAIGNS.map((c, i) => (
          <li key={c.key} className={`n3c-card is-${c.key}`}>
            <Link to={c.to} className="n3c-card__link" aria-label={`${c.title}: ${c.season} ${c.year}, from ${c.from} per person`}>
              <figure className="n3c-card__photo">
                <img src={c.key === 'vietnam' ? c.tall : c.img} alt="" />
                <span className="n3c-card__veil" />
                <span className="n3c-card__chip">{c.season} {c.year}</span>
                <span className="n3c-card__n" aria-hidden="true">0{i + 1}</span>
                {c.key === 'japan' && <Petals n={10} />}
                {c.key === 'europe' && (
                  <span className="n3c-card__timer"><small>Early bird ends in</small><Countdown /></span>
                )}
                {c.key === 'vietnam' && (
                  <span className="n3c-card__lanterns" aria-hidden="true">
                    <Lantern x="10%" len={14} c="#C8352B" s={0.7} />
                    <Lantern x="74%" len={34} c="#E9B949" s={0.6} />
                  </span>
                )}
              </figure>
              <span className="n3c-card__body">
                <span className="n3c-card__t">{c.title}</span>
                <span className="n3c-card__line">{c.line}</span>
                <span className="n3c-card__facts">
                  <span><small>From</small><b>{c.from}</b></span>
                  <span><small>Hold a seat</small><b>{c.deposit}</b></span>
                  <span><small>Departures</small><b>{c.window}</b></span>
                </span>
                <span className={`n3c-card__go is-${c.key}`}>See the tours <ArrowUpRight size={16} aria-hidden="true" /></span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="n3c-cards__dots" role="group" aria-label="Choose a journey">
        {CAMPAIGNS.map((c, i) => (
          <button key={c.key} type="button" className={i === idx ? 'is-on' : ''} onClick={() => go(i)}
            aria-label={`${c.short}, ${i + 1} of ${CAMPAIGNS.length}`} aria-current={i === idx || undefined} />
        ))}
      </div>
    </section>
  );
}
