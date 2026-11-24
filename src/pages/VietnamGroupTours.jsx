/* ============================================================================
   Cox & Kings: Vietnam, spring 2027 group tours  (route: /vietnam-group-tours)

   The third lander in the set, after /japan-cherry-blossom and
   /europe-early-booking: the same sections in the same order, the same
   tokens and components (it imports SakuraJapan.css, every rule scoped to
   `.skj`), with VietnamGroupTours.css layered on top for what is new here
   (every rule there scoped to `.skj.vn`):

     · the hero: "VIỆT NAM" set behind the Ha Long Bay karsts. The photo is
       two layers (public/vietnam/halong-sky.jpg and the cut-out
       halong-karsts.webp, generated from one Unsplash frame), so on scroll
       the word sinks behind the peaks while the karsts rise.
     · the heritage visual: Tran Quoc pagoda in an arch that opens with the
       scroll, under three hanging lanterns that drop in, sway, and swing
       harder when you scroll fast.
     · text arrivals: every section heading rises in line by line (SplitText,
       masked lines), eyebrows and leads fade up, numbers count up.

     1  Hero              both CTAs inside the first fold on a 390×660 phone
     2  One price         what the price covers               (light)
     3  Tours             map, dates, seats, View package     (white)
     4  Reviews           rating bar + photo cards            (stone)
     5  How booking works what happens after I pay           (cream)
     6  The Promise       seal + four lines                   (white)
     7  Heritage          story, lantern arch, facts, awards  (cream)
     8  Final CTA         Hoi An lantern street + hours       (dark)

   Everything editable (offer, tours, dates, itineraries, reviews) is in
   ./vietnam/data.js. The map is ./vietnam/vietnamMap.js (generated).
   ========================================================================== */

import { useState, useRef, useEffect, useLayoutEffect, useCallback, useMemo, useId } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import {
  ArrowRight, ArrowDown, Check, X, Star, Minus, Plus, Route, Receipt, Hotel, Wallet,
  ShieldCheck, Headset, ClipboardList, Landmark, ChevronLeft, ChevronRight,
  Clock, BedDouble, Footprints, FileCheck2, Plane, Info, CalendarDays, PhoneCall,
  UtensilsCrossed, CarFront, PlaneTakeoff, Bus, Camera, Sparkles, Ticket, ShieldPlus, CreditCard, ScrollText,
} from 'lucide-react';
import {
  OFFER, TOURS, INCLUDED, NEVER, REVIEWS, RATING, AWARDS, ITINERARIES, HOTELS, PAYMENT_URL, PHONE, EMAIL, inr, waLink, img,
} from './vietnam/data';
import { VN_PATH, VN_NEIGHBOURS, VN_CITIES } from './vietnam/vietnamMap';
import './SakuraJapan.css';
import './VietnamGroupTours.css';

gsap.registerPlugin(ScrollTrigger, SplitText);

/* Hero layers, cut from Unsplash 1528127269322 (Ha Long Bay from Ti Top). */
const HERO_SKY = '/vietnam/halong-sky.jpg';
const HERO_KARSTS = '/vietnam/halong-karsts.webp';
/* Hoi An's old town under strings of silk lanterns at night. */
const FINAL_IMG = '1526139334526-f591a54b477c';
/* Tran Quoc pagoda on West Lake, Hanoi: the arch photo under the lanterns. */
const ARCH_IMG = '1599708153386-62bf3f035c78';

const WORDMARK = ['V', 'I', 'Ệ', 'T', ' ', 'N', 'A', 'M'];

/* The three lanterns over the arch: position, string length, colour, size. */
const LANTERNS = [
  { x: '4%', len: 70, c: '#C8352B', s: 1, amp: 5 },
  { x: '44%', len: 18, c: '#E9B949', s: 0.82, amp: 4 },
  { x: '80%', len: 46, c: '#DD6A31', s: 1.08, amp: 6 },
];

/* One icon per inclusion, in data.js INCLUDED order. */
const INC_ICONS = [Plane, Hotel, UtensilsCrossed, CarFront, PlaneTakeoff, Bus, Camera, Sparkles, Ticket, FileCheck2, ShieldPlus, Receipt, CreditCard];

const PROMISES = [
  { icon: Route, t: 'Crafted, unhurried journeys', b: 'Must-sees and meaningful experiences, with fewer hotel changes and less time on the road.' },
  { icon: Hotel, t: 'Hotels & meals assured', b: 'Hotels named before you book, never substituted. Three meals a day: Indian, vegetarian & Jain.' },
  { icon: Headset, t: 'A tour manager, start to finish', b: 'Hindi & English help from booking to homecoming, pre-departure briefings and a WhatsApp group.' },
  { icon: ClipboardList, t: 'Every detail upfront', b: 'Daily itinerary, flights and hotels in writing. No compulsory shopping stops, and birthdays celebrated.' },
];
const STEPS = [
  { t: `Pay ${inr(OFFER.depositOnline)} online`, b: 'Your seats and your price are locked in' },
  { t: 'We file your e-visa', b: 'No embassy visit needed' },
  { t: 'Visa approved', b: 'Only then is the balance due' },
  { t: 'Fly to Hanoi', b: 'Briefing first, then the bay' },
];

/* Heritage: the card's person is the site's existing travel-designer profile
   (Luxe2Improved DESIGNER).
   ⚠ PLACEHOLDER: swap for a real Cox & Kings Vietnam specialist
   (photo + name + tenure) before launch. */
const SPECIALIST = { name: 'Aanya Kapoor', role: 'Vietnam specialist · 12 years with us', photo: '/aanya-kapoor.jpg' };

/* `n` is what the count-up animates to; `k` is what is printed. */
const HERITAGE_STATS = [
  { k: '1758', n: 1758, from: 1700, t: 'Founded in London' },
  { k: '260+', n: 260, t: 'Years of heritage' },
  { k: '100+', n: 100, t: 'Countries travelled' },
  { k: RATING.overall, n: Number(RATING.overall), dec: 1, t: 'Traveller rating' },
];

/* A hanging paper lantern: cap, ribbed body, cap, tassels. The string is a
   separate element so each lantern can hang at its own height. */
function Lantern({ x, len, c, s }) {
  return (
    <div className="vn-lantern" style={{ '--x': x, '--len': `${len}px`, '--c': c, '--s': s }} aria-hidden="true">
      <div className="vn-lantern__drop">
        <div className="vn-lantern__swing">
          <div className="vn-lantern__push">
            <span className="vn-lantern__string" />
            <span className="vn-lantern__body">
            <span className="vn-lantern__glow" />
            <svg className="vn-lantern__svg" viewBox="0 0 80 140">
              <rect x="25" y="0" width="30" height="10" rx="2.5" fill="#3A2417" />
              <ellipse cx="40" cy="53" rx="35" ry="45" fill={c} />
              <ellipse cx="40" cy="53" rx="35" ry="45" fill="url(#vn-lantern-shade)" />
              <ellipse cx="40" cy="53" rx="22" ry="45" fill="none" stroke="#F4C15A" strokeWidth="2.2" opacity=".85" />
              <ellipse cx="40" cy="53" rx="9" ry="45" fill="none" stroke="#F4C15A" strokeWidth="2" opacity=".7" />
              <ellipse cx="31" cy="44" rx="11" ry="27" fill="#fff" opacity=".16" />
              <rect x="27" y="95" width="26" height="10" rx="2.5" fill="#3A2417" />
              <g stroke={c} strokeWidth="2.6" strokeLinecap="round" className="vn-lantern__tassel">
                <path d="M34 105 L32 136" /><path d="M40 105 L40 138" /><path d="M46 105 L48 136" />
              </g>
            </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Three gulls drifting over the bay. */
function Birds() {
  return (
    <div className="vn-birds" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <svg key={i} className={`vn-bird vn-bird--${i}`} viewBox="0 0 40 12">
          <path d="M1 9 Q10 1 20 8 Q30 1 39 9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ))}
    </div>
  );
}

/* --------------------------------------------------------------------------
   Small pieces
   -------------------------------------------------------------------------- */

function WhatsAppGlyph({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.83 9.83 0 0 0 12.04 2Zm0 18.15h-.01a8.23 8.23 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48a.92.92 0 0 0-.66.31c-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />
    </svg>
  );
}

function Stars() {
  return (
    <span className="skj-stars" role="img" aria-label="Rated 5 out of 5">
      {[0, 1, 2, 3, 4].map((i) => <Star key={i} size={14} aria-hidden="true" />)}
    </span>
  );
}

function Eyebrow({ children, light = false }) {
  return <p className={`skj-eyebrow${light ? ' is-light' : ''}`}>{children}</p>;
}

/* Brand marks, inline — the same Google G and Tripadvisor owl the homepage
   and /testimonials draw, so the pages agree down to the logo. */
function GoogleG({ size = 16 }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true">
      <path fill="#4285F4" d="M47.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h13.2c-.6 3-2.3 5.6-4.9 7.3v6h7.9c4.6-4.3 7.3-10.5 7.3-17.8z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.9-6c-2.2 1.5-5 2.3-8 2.3-6.1 0-11.3-4.1-13.2-9.6H2.6v6.2C6.6 42.6 14.6 48 24 48z" />
      <path fill="#FBBC05" d="M10.8 28.9c-.5-1.5-.8-3-.8-4.6s.3-3.1.8-4.6v-6.2H2.6C.9 16.1 0 19.9 0 24s.9 7.9 2.6 11.1l8.2-6.2z" />
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.9 2.4 30.5 0 24 0 14.6 0 6.6 5.4 2.6 13.4l8.2 6.2C12.7 13.6 17.9 9.5 24 9.5z" />
    </svg>
  );
}
function TripAdvisorOwl({ size = 16 }) {
  return (
    <svg viewBox="0 0 132 80" width={Math.round(size * 1.6)} height={size} aria-hidden="true">
      <circle cx="38" cy="42" r="32" fill="#34E0A1" /><circle cx="94" cy="42" r="32" fill="#34E0A1" />
      <circle cx="38" cy="42" r="18" fill="#fff" /><circle cx="94" cy="42" r="18" fill="#fff" />
      <circle cx="38" cy="42" r="9" fill="#000" /><circle cx="94" cy="42" r="9" fill="#000" />
      <path d="M52 2 Q66 14 80 2 L66 22 Z" fill="#000" />
    </svg>
  );
}

/* One review card — shared by the desktop marquee and the phone carousel. */
function ReviewCard({ r, hidden = false }) {
  const initials = r.name.split(/\s+/).filter((w) => /^[A-Z]/.test(w)).map((w) => w[0]).slice(0, 2).join('');
  return (
    <li className="skj-review" aria-hidden={hidden || undefined}>
      <div className="skj-review__photo">
        <img src={img(r.photo, 720)} alt="" loading="lazy" width="360" height="160" />
        <span>{r.tour}</span>
      </div>
      <div className="skj-review__body">
        <Stars />
        <blockquote>“{r.text}”</blockquote>
        <p className="skj-review__by">
          <span className="skj-review__av" aria-hidden="true">{initials}</span>
          <span><b>{r.name}</b><small>{r.city} · {r.when}</small></span>
        </p>
      </div>
    </li>
  );
}

/* Dot indicator for a snap row: one dot per card, the current one stretched. */
function Dots({ row, label }) {
  const go = (k) => {
    const el = row.ref.current;
    const card = el?.children[k];
    if (!el || !card) return;
    const pad = parseFloat(getComputedStyle(el).paddingLeft || 0);
    el.scrollTo({ left: card.offsetLeft - el.offsetLeft - pad, behavior: 'smooth' });
  };
  return (
    <div className="skj-dots" role="group" aria-label={`Choose ${label}`}>
      {Array.from({ length: row.n }, (_, k) => (
        <button
          key={k} type="button" className={`skj-dot${k === row.i ? ' is-on' : ''}`}
          aria-label={`${label} ${k + 1} of ${row.n}`} aria-current={k === row.i || undefined}
          onClick={() => go(k)}
        />
      ))}
    </div>
  );
}

/* The Promise seal — circular type around the crest, turned by scroll. */
function PromiseSeal() {
  const id = useId().replace(/:/g, '');
  return (
    <div className="skj-seal" aria-hidden="true">
      <svg className="skj-seal__ring" viewBox="0 0 200 200">
        <defs><path id={`seal${id}`} d="M100 100 m-78 0 a78 78 0 1 1 156 0 a78 78 0 1 1 -156 0" /></defs>
        <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeWidth="1" />
        <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="1" />
        <text><textPath href={`#seal${id}`} textLength="486">THE COX &amp; KINGS PROMISE · EST. 1758 · </textPath></text>
      </svg>
      <img className="skj-seal__crest" src="/cox-logo-new.png" alt="" width="64" height="48" loading="lazy" />
    </div>
  );
}

/* --------------------------------------------------------------------------
   Swipe rows: native scroll-snap (works with touch, trackpad and keyboard),
   plus arrows on pointer devices and a position readout.
   -------------------------------------------------------------------------- */
function useSnapRow() {
  const ref = useRef(null);
  const [state, setState] = useState({ i: 0, n: 0, atStart: true, atEnd: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const items = [...el.children];
      const n = items.length;
      const left = el.scrollLeft;
      let i = 0;
      let best = Infinity;
      items.forEach((c, k) => {
        const d = Math.abs(c.offsetLeft - el.offsetLeft - left - parseFloat(getComputedStyle(el).paddingLeft || 0));
        if (d < best) { best = d; i = k; }
      });
      const atEnd = left + el.clientWidth >= el.scrollWidth - 4;
      setState({ i: atEnd ? n - 1 : i, n, atStart: left <= 4, atEnd });
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(measure); };
    measure();
    el.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const step = useCallback((dir) => {
    const el = ref.current;
    if (!el) return;
    const card = el.children[0];
    const gap = parseFloat(getComputedStyle(el).columnGap || 0) || 16;
    el.scrollBy({ left: dir * ((card?.offsetWidth || 300) + gap), behavior: 'smooth' });
  }, []);

  return { ref, ...state, step };
}

function RowControls({ row, label }) {
  if (row.n < 2) return null;
  return (
    <div className="skj-rowctl">
      <span className="skj-rowctl__count" aria-live="polite">
        <b>{String(row.i + 1).padStart(2, '0')}</b> / {String(row.n).padStart(2, '0')}
      </span>
      <span className="skj-rowctl__bar" aria-hidden="true">
        <i style={{ transform: `scaleX(${(row.i + 1) / row.n})` }} />
      </span>
      <button type="button" className="skj-iconbtn" onClick={() => row.step(-1)} disabled={row.atStart} aria-label={`Previous ${label}`}>
        <ChevronLeft size={18} />
      </button>
      <button type="button" className="skj-iconbtn" onClick={() => row.step(1)} disabled={row.atEnd} aria-label={`Next ${label}`}>
        <ChevronRight size={18} />
      </button>
    </div>
  );
}

/* --------------------------------------------------------------------------
   THE ROUTE MAP: Vietnam and its neighbours from Natural Earth
   (vietnam/vietnamMap.js), cropped to each tour's own stops so a 300px card
   still reads as a route. Vietnam is drawn darker than the land around it. Day-trip stops (0 nights) are hollow.
   -------------------------------------------------------------------------- */
const LABEL_POS = {
  Hanoi: [-1, 0.35, 'end'],
  'Ha Long Bay': [1, -0.2, 'start'],
  'Ninh Binh': [-1, 0.9, 'end'],
  'Da Nang': [1, -0.35, 'start'],
  'Hoi An': [1, 1.05, 'start'],
  'Ho Chi Minh City': [1, 0.1, 'start'],
  'Mekong Delta': [1, 1.1, 'start'], // left of the dot it sits under the caption chip
  'Phu Quoc': [-1, 0.35, 'end'],
};

function RouteMap({ tour }) {
  const clipId = useId().replace(/:/g, '');
  const pts = tour.stops.map((s) => ({ ...s, p: VN_CITIES[s.city] }));
  const xs = pts.map((s) => s.p[0]);
  const ys = pts.map((s) => s.p[1]);
  let x0 = Math.min(...xs); let x1 = Math.max(...xs);
  let y0 = Math.min(...ys); let y1 = Math.max(...ys);
  // Vietnam routes run north to south, so the 16:10 frame below widens them;
  // keep the vertical margin small, with room at the bottom for the caption chip.
  const padX = 60; const padY = 34;
  x0 -= padX; x1 += padX; y0 -= padY; y1 += padY * 2.2;
  // Hold a 16:10 frame so all three cards' maps share one shape.
  const want = 1.6;
  let w = x1 - x0; let h = y1 - y0;
  if (w / h < want) { const nw = h * want; x0 -= (nw - w) / 2; w = nw; } else { const nh = w / want; y0 -= (nh - h) / 2; h = nh; }
  const fs = w * 0.043;

  // A gently bowed line through the stops, not a ruler-straight polyline.
  let d = `M${pts[0].p[0]} ${pts[0].p[1]}`;
  for (let i = 1; i < pts.length; i += 1) {
    const [ax, ay] = pts[i - 1].p; const [bx, by] = pts[i].p;
    const mx = (ax + bx) / 2; const my = (ay + by) / 2;
    const dx = bx - ax; const dy = by - ay;
    const bow = i % 2 ? 0.18 : -0.18;
    d += ` Q${(mx - dy * bow).toFixed(1)} ${(my + dx * bow).toFixed(1)} ${bx} ${by}`;
  }

  const hotels = tour.stops.filter((s) => s.nights > 0).length;
  const nights = tour.stops.reduce((a, s) => a + s.nights, 0);

  return (
    <figure className="skj-map">
      <svg viewBox={`${x0.toFixed(1)} ${y0.toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}`} role="img"
        aria-label={`Route map: ${tour.stops.map((s) => s.city).join(', then ')}`}>
        <defs>
          <clipPath id={`c${clipId}`}><rect x={x0} y={y0} width={w} height={h} /></clipPath>
        </defs>
        <g clipPath={`url(#c${clipId})`}>
          <rect x={x0} y={y0} width={w} height={h} className="skj-map__sea" />
          <path d={VN_NEIGHBOURS} className="skj-map__land vn-map__near" vectorEffect="non-scaling-stroke" />
          <path d={VN_PATH} className="skj-map__land" vectorEffect="non-scaling-stroke" />
          {/* No non-scaling-stroke here: it moves dash maths into screen space and
              breaks pathLength="1", so the draw-in would stop part-way. */}
          <path d={d} className="skj-map__route" pathLength="1" strokeWidth={(w * 0.0095).toFixed(2)} />
          {pts.map((s, i) => {
            const [lx, ly, anchor] = s.lp || LABEL_POS[s.city] || [1, 0.35, 'start'];
            const isEnd = i === 0 || i === pts.length - 1;
            return (
              <g key={s.city} className="skj-map__stop">
                <circle cx={s.p[0]} cy={s.p[1]} r={fs * 0.42}
                  className={s.nights ? (isEnd ? 'is-end' : '') : 'is-day'} vectorEffect="non-scaling-stroke" />
                <text x={s.p[0] + lx * fs * 0.8} y={s.p[1] + ly * fs} fontSize={fs} textAnchor={anchor}>
                  {s.city}{s.nights ? <tspan className="skj-map__n" dx={fs * 0.25}>{s.nights}N</tspan> : null}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
      <figcaption>
        <span><BedDouble size={13} aria-hidden="true" /> {hotels} hotels · {nights} nights</span>
        {tour.stops.some((x) => !x.nights) && <span className="skj-map__key"><i aria-hidden="true" /> day trip</span>}
      </figcaption>
    </figure>
  );
}

/* --------------------------------------------------------------------------
   THE TOUR CARD
   -------------------------------------------------------------------------- */
function TourCard({ tour, selectedDep, onSelectDep, onItinerary }) {
  const live = tour.deps.filter((d) => !d.soldOut);
  const chosen = tour.deps.find((d) => d.id === selectedDep) || live[0];
  const onlinePrice = tour.price - OFFER.onlineDiscount;

  /* Compact on phones: the name sits ON the photo, the map caption sits ON
     the map, and price + both CTAs share one block — about half the height
     of the first version without dropping any information. */
  return (
    <article className={`skj-tour${tour.featured ? ' is-featured' : ''}`} aria-labelledby={`${tour.id}-h`}>
      <div className="skj-tour__media">
        <img src={img(tour.image, 900)} alt={tour.alt} loading="lazy" width="900" height="600" />
        <span className="skj-tour__tag">{tour.tag}</span>
        <div className="skj-tour__title">
          <h3 id={`${tour.id}-h`} className="skj-tour__name">{tour.name}</h3>
          <span className="skj-tour__nd">{tour.nd}</span>
        </div>
      </div>

      <div className="skj-tour__body">
        <p className="skj-tour__blurb">{tour.blurb}</p>

        <RouteMap tour={tour} />

        <div className="skj-tour__dates">
          <p className="skj-tour__label" id={`${tour.id}-dl`}><CalendarDays size={14} aria-hidden="true" /> Spring 2027 departures</p>
          <div className="skj-dates" role="radiogroup" aria-labelledby={`${tour.id}-dl`}>
            {tour.deps.map((d) => {
              const on = chosen && chosen.id === d.id;
              return (
                <button
                  key={d.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  aria-disabled={d.soldOut || undefined}
                  tabIndex={d.soldOut ? -1 : 0}
                  className={`skj-date${d.soldOut ? ' is-sold' : ''}${on ? ' is-on' : ''}`}
                  onClick={() => !d.soldOut && onSelectDep(tour.id, d.id)}
                  aria-label={`${d.label}: ${d.soldOut ? 'sold out' : `${d.seats} seats left`}`}
                >
                  <span className="skj-date__d">{d.day}</span>
                  <span className="skj-date__m">{d.mon}</span>
                  <span className="skj-date__s">{d.soldOut ? 'Sold out' : `${d.seats} left`}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="skj-tour__buy">
          <div className="skj-tour__price">
            <p className="skj-tour__amt">{inr(onlinePrice)} <s>{inr(tour.price)}</s></p>
            <p className="skj-tour__note">Per person, all-inclusive · online price</p>
          </div>
          <div className="skj-tour__ctas">
            {/* Opens the package: day-by-day itinerary, hotels, meals, with
                Deposit & book at the bottom of the popup. */}
            <button type="button" className="skj-btn skj-btn--primary" onClick={() => onItinerary(tour.id)}
              aria-label={`View package: ${tour.name}`}>
              View package <ArrowRight size={16} aria-hidden="true" />
            </button>
            <a className="skj-btn skj-btn--wa skj-btn--icon" href={waLink(`Hi Cox & Kings, I'm interested in ${tour.name} (${chosen?.label}). Can you help?`)}
              target="_blank" rel="noopener noreferrer" aria-label={`Ask about ${tour.name} on WhatsApp`}>
              <WhatsAppGlyph size={20} />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

/* --------------------------------------------------------------------------
   Modal plumbing shared by the booking sheet and the itinerary popup:
   focus moves in, Tab is trapped, Esc closes, page scroll is locked, and
   focus returns to whatever opened it.
   -------------------------------------------------------------------------- */
function useModal(open, onClose, panel) {
  useEffect(() => {
    if (!open) return undefined;
    const lastFocus = document.activeElement;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = 'hidden';
    panel.current?.querySelector('select, button, input, summary')?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab' || !panel.current) return;
      const f = [...panel.current.querySelectorAll('a[href], button:not([disabled]), select, input, summary')];
      if (!f.length) return;
      const a = f[0]; const z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      html.style.overflow = prev;
      lastFocus?.focus?.();
    };
  }, [open, onClose, panel]);
}

/* --------------------------------------------------------------------------
   ITINERARY — day by day, with the hotel, the travel and the meals on every
   day. Used in the popup (from a tour card) and inline in the booking sheet.
   -------------------------------------------------------------------------- */
const MEAL_NAMES = { B: 'Breakfast', L: 'Lunch', D: 'Dinner' };

function ItineraryBody({ tour }) {
  const days = ITINERARIES[tour.id] || [];
  const stays = tour.stops.filter((st) => st.nights > 0);
  return (
    <div className="skj-itin">
      <dl className="skj-itin__facts">
        <div>
          <dt><Plane size={15} aria-hidden="true" /> Flights</dt>
          <dd>{tour.flights.out}<br />{tour.flights.back}</dd>
        </div>
        <div>
          <dt><Hotel size={15} aria-hidden="true" /> Hotels, never substituted</dt>
          <dd>
            <ul>
              {stays.map((st) => (
                <li key={st.city}><b>{HOTELS[st.city]}</b> <span>{st.city}, {st.nights} night{st.nights > 1 ? 's' : ''}</span></li>
              ))}
            </ul>
          </dd>
        </div>
        <div>
          <dt><UtensilsCrossed size={15} aria-hidden="true" /> Meals</dt>
          <dd>Breakfast, lunch and dinner every day, with Indian, vegetarian and Jain options.</dd>
        </div>
      </dl>

      <ol className="skj-itin__days">
        {days.map((d, i) => (
          <li key={i} className="skj-day">
            <span className="skj-day__n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <h4 className="skj-day__t"><span className="skj-sr">Day {i + 1}: </span>{d.t}</h4>
              <p className="skj-day__d">{d.d}</p>
              <ul className="skj-day__meta">
                <li><Bus size={14} aria-hidden="true" /> {d.travel}</li>
                {d.stay && <li><BedDouble size={14} aria-hidden="true" /> {HOTELS[d.stay]}</li>}
                <li><UtensilsCrossed size={14} aria-hidden="true" /> {d.meals.split(' ').map((m) => MEAL_NAMES[m]).join(', ')}</li>
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function ItineraryDialog({ tour, onClose, onBook }) {
  const panel = useRef(null);
  useModal(!!tour, onClose, panel);
  if (!tour) return null;
  return (
    <div className="skj-sheet" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="skj-sheet__panel skj-sheet__panel--wide" role="dialog" aria-modal="true" aria-labelledby="skj-itin-h" ref={panel}>
        <div className="skj-sheet__head">
          <div>
            <Eyebrow>The package, day by day</Eyebrow>
            <h2 id="skj-itin-h" className="skj-sheet__title">{tour.name} <small>{tour.nd}</small></h2>
          </div>
          <button type="button" className="skj-iconbtn" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>
        <ItineraryBody tour={tour} />
        <div className="skj-itin__foot">
          <p><b>{inr(tour.price - OFFER.onlineDiscount)}</b> per person, online price</p>
          <div className="vn-itin__ctas">
            <a className="skj-btn skj-btn--wa" href={waLink(`Hi Cox & Kings, I'd like to talk to an expert about ${tour.name} (${tour.nd}).`)}
              target="_blank" rel="noopener noreferrer">
              <WhatsAppGlyph /> Talk to an expert
            </a>
            <button type="button" className="skj-btn skj-btn--primary" onClick={() => onBook(tour.id)}>
              Book now <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
   THE BOOKING SHEET — bottom sheet on phones, centred dialog on desktop.
   Deposit is non-refundable, so the page asks for an explicit acknowledgement
   (unticked by default) before it takes anyone to payment.
   -------------------------------------------------------------------------- */
function BookingSheet({ open, initial, onClose }) {
  const [tourId, setTourId] = useState(initial.tourId || TOURS[1].id);
  const tour = TOURS.find((t) => t.id === tourId) || TOURS[1];
  const live = tour.deps.filter((d) => !d.soldOut);
  const [depId, setDepId] = useState(initial.depId || live[0].id);
  const [pax, setPax] = useState(2);
  const panel = useRef(null);

  useEffect(() => {
    if (!open) return;
    const t = TOURS.find((x) => x.id === initial.tourId) || TOURS[1];
    setTourId(t.id);
    const l = t.deps.filter((d) => !d.soldOut);
    setDepId(l.some((d) => d.id === initial.depId) ? initial.depId : l[0].id);
  }, [open, initial]);

  useModal(open, onClose, panel);

  const dep = live.find((d) => d.id === depId) || live[0];
  const maxPax = Math.min(6, dep.seats);
  const n = Math.min(pax, maxPax);
  const onlinePrice = tour.price - OFFER.onlineDiscount;
  const today = OFFER.depositOnline * n;
  const balance = (onlinePrice - OFFER.depositOnline) * n;

  /* Low-commitment next step: no payment here. Dummy until the booking
     flow exists; set PAYMENT_URL in data.js and it goes there instead. */
  const next = () => {
    if (PAYMENT_URL) window.location.assign(`${PAYMENT_URL}?tour=${tour.id}&date=${dep.iso}&pax=${n}`);
  };

  if (!open) return null;

  return (
    <div className="skj-sheet" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="skj-sheet__panel" role="dialog" aria-modal="true" aria-labelledby="skj-sheet-h" ref={panel}>
        <div className="skj-sheet__head">
          <div>
            <Eyebrow>Deposit &amp; book</Eyebrow>
            <h2 id="skj-sheet-h" className="skj-sheet__title">Hold your seats for {inr(OFFER.depositOnline)} each</h2>
          </div>
          <button type="button" className="skj-iconbtn" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>

        <div className="skj-sheet__grid">
          <label className="skj-field">
            <span>Tour</span>
            <select value={tourId} onChange={(e) => {
              const t = TOURS.find((x) => x.id === e.target.value);
              setTourId(t.id);
              setDepId(t.deps.find((d) => !d.soldOut).id);
            }}>
              {TOURS.map((t) => <option key={t.id} value={t.id}>{t.name} · {t.nd}</option>)}
            </select>
          </label>
          <label className="skj-field">
            <span>Departure</span>
            <select value={dep.id} onChange={(e) => setDepId(e.target.value)}>
              {tour.deps.map((d) => (
                <option key={d.id} value={d.id} disabled={d.soldOut}>
                  {d.label}, {d.soldOut ? 'sold out' : `${d.seats} seats left`}
                </option>
              ))}
            </select>
          </label>
          <div className="skj-field">
            <span id="skj-pax-l">Travellers</span>
            <div className="skj-stepper" role="group" aria-labelledby="skj-pax-l">
              <button type="button" onClick={() => setPax(Math.max(1, n - 1))} disabled={n <= 1} aria-label="One fewer traveller"><Minus size={16} /></button>
              <output aria-live="polite">{n}</output>
              <button type="button" onClick={() => setPax(Math.min(maxPax, n + 1))} disabled={n >= maxPax} aria-label="One more traveller"><Plus size={16} /></button>
            </div>
          </div>
        </div>

        <dl className="skj-bill">
          <div><dt>Tour price × {n}</dt><dd>{inr(tour.price * n)}</dd></div>
          <div className="is-save"><dt>Online discount</dt><dd>−{inr(OFFER.onlineDiscount * n)}</dd></div>
          <div className="is-today"><dt>Pay today <small>instead of {inr(OFFER.depositOffline * n)}</small></dt><dd>{inr(today)}</dd></div>
          <div><dt>Balance, after visa approval</dt><dd>{inr(balance)}</dd></div>
        </dl>

        <details className="skj-sheet__itin">
          <summary><ScrollText size={16} aria-hidden="true" /> Day-by-day itinerary, hotels and meals</summary>
          <ItineraryBody tour={tour} />
        </details>

        <p className="skj-sheet__note">
          <Info size={16} aria-hidden="true" />
          <span>
            The deposit is <b>non-refundable</b>: it covers reservation commitments, insurance and visa appointments.
            If Cox &amp; Kings cancels the departure, you get a <b>full refund</b>, advance included.
          </span>
        </p>

        <button type="button" className="skj-btn skj-btn--primary skj-btn--block" onClick={next}>
          Fill traveller details <ArrowRight size={16} aria-hidden="true" />
        </button>
        <p className="skj-sheet__fine">No payment yet. You’ll review everything before paying {inr(today)}.</p>
      </div>
    </div>
  );
}


/* ==========================================================================
   THE PAGE
   ========================================================================== */
export default function VietnamGroupTours() {
  const root = useRef(null);
  const heroCtas = useRef(null);
  const finalBand = useRef(null);

  const [solid, setSolid] = useState(false);
  const [heroGone, setHeroGone] = useState(false);
  const [finalIn, setFinalIn] = useState(false);
  const [toursIn, setToursIn] = useState(false);
  const [sheet, setSheet] = useState({ open: false, tourId: null, depId: null });
  const [picked, setPicked] = useState({}); // tourId → departure id
  const [itinId, setItinId] = useState(null); // tour whose itinerary popup is open
  const closeItin = useCallback(() => setItinId(null), []);

  const reviewsRow = useSnapRow();
  const toursRow = useSnapRow();

  const openBook = useCallback((tourId = null, depId = null) => {
    setSheet({ open: true, tourId: tourId || TOURS[1].id, depId });
  }, []);
  const closeBook = useCallback(() => setSheet((s) => ({ ...s, open: false })), []);
  const sheetInitial = useMemo(() => ({ tourId: sheet.tourId, depId: sheet.depId }), [sheet.tourId, sheet.depId]);

  const selectDep = useCallback((tourId, depId) => setPicked((p) => ({ ...p, [tourId]: depId })), []);

  const scrollToId = (id) => (e) => {
    e?.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const navH = document.querySelector('.skj-nav')?.offsetHeight || 64;
    const y = el.getBoundingClientRect().top + window.scrollY - navH + 1;
    window.scrollTo({ top: y, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };
  const scrollToTours = scrollToId('tours');

  /* Nav goes solid after the hero's top band; the sticky bar watches the hero
     CTAs, the tours and the final band, so there is only ever one ask. */
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.target === heroCtas.current) setHeroGone(!e.isIntersecting && e.boundingClientRect.top < 0);
        if (e.target === finalBand.current) setFinalIn(e.isIntersecting);
      });
    }, { rootMargin: '-64px 0px 0px 0px' });
    const toursEl = document.getElementById('tours');
    const ioTours = new IntersectionObserver(([e]) => setToursIn(e.isIntersecting), { rootMargin: '-35% 0px -35% 0px' });
    if (toursEl) ioTours.observe(toursEl);
    if (heroCtas.current) io.observe(heroCtas.current);
    if (finalBand.current) io.observe(finalBand.current);
    return () => { window.removeEventListener('scroll', onScroll); io.disconnect(); ioTours.disconnect(); };
  }, []);

  const showSticky = heroGone && !finalIn && !toursIn && !sheet.open && !itinId;

  /* ---- GSAP ----------------------------------------------------------
     Rules that keep this from fighting itself (see the Lumikern notes):
     fromTo everywhere, never from(); and an entrance tween and a scrubbed
     tween never share a node: the entrance runs on an inner element, the
     scrub on its wrapper. No pinning, so the page always scrolls normally. */
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          desk: '(min-width: 900px) and (prefers-reduced-motion: no-preference)',
          mob: '(max-width: 899px) and (prefers-reduced-motion: no-preference)',
        },
        (c) => {
          const { desk } = c.conditions;
          if (!c.conditions.desk && !c.conditions.mob) return;

          /* 1 · Hero. Arrival: the scene settles from a slow zoom while the
             letters of VIỆT NAM rise one by one behind the karsts, then the
             copy follows. */
          gsap.fromTo('.vn-hero__scene', { scale: 1.14 }, { scale: 1, duration: 2.6, ease: 'power3.out' });
          gsap.fromTo('.vn-hero__ch', { yPercent: 115, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 1.5, ease: 'expo.out', stagger: 0.07, delay: 0.25 });
          gsap.fromTo('[data-hero-in]', { y: 26, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.09, delay: 0.75 });
          gsap.fromTo('.vn-birds', { opacity: 0 }, { opacity: 1, duration: 2, delay: 1.2 });

          /* Scroll: three depths. The sky drifts down slowly, the word sinks
             behind the ridge, the karsts rise. The karsts only ever move UP
             relative to the sky, so the sky photo's own ridge stays hidden. */
          const heroST = { trigger: '.vn-hero', start: 'top top', end: 'bottom top', scrub: true };
          gsap.to('.vn-hero__sky', { yPercent: 10, ease: 'none', scrollTrigger: heroST });
          gsap.to('.vn-hero__mark', { yPercent: desk ? 70 : 45, ease: 'none', scrollTrigger: { ...heroST } });
          gsap.to('.vn-hero__karsts', { yPercent: -7, ease: 'none', scrollTrigger: { ...heroST } });
          gsap.to('.skj-hero__copy', { y: desk ? -80 : -40, ease: 'none', scrollTrigger: { ...heroST } });

          /* Text arrivals: every section heading rises line by line out of a
             mask; eyebrows slide in, leads fade up. autoSplit re-splits when
             fonts load or the width changes, and returns a fresh tween. */
          gsap.utils.toArray('.skj-main .skj-h2').forEach((h) => {
            SplitText.create(h, {
              type: 'lines,words', mask: 'lines', linesClass: 'vn-line', autoSplit: true,
              onSplit: (self) => gsap.fromTo(self.words, { yPercent: 110 }, {
                yPercent: 0, duration: 1.05, ease: 'expo.out', stagger: 0.035,
                scrollTrigger: { trigger: h, start: 'top 88%', once: true },
              }),
            });
          });
          gsap.utils.toArray('.skj-main .skj-eyebrow').forEach((el) => {
            gsap.fromTo(el, { opacity: 0, x: -14 }, {
              opacity: 1, x: 0, duration: 0.8, ease: 'power3.out',
              scrollTrigger: { trigger: el, start: 'top 90%', once: true },
            });
          });
          gsap.utils.toArray('.skj-main .skj-lead, .skj-main .skj-sub, .skj-heritage__p, .skj-final__sub').forEach((el) => {
            gsap.fromTo(el, { opacity: 0, y: 16 }, {
              opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.25,
              scrollTrigger: { trigger: el, start: 'top 92%', once: true },
            });
          });

          /* Count-ups: the printed value is already in the DOM, so with JS
             off or motion reduced the real number is what shows. */
          gsap.utils.toArray('[data-count]').forEach((el) => {
            const to = Number(el.dataset.count);
            const dec = Number(el.dataset.dec || 0);
            const suffix = el.dataset.suffix || '';
            const o = { v: Number(el.dataset.from || 0) };
            gsap.fromTo(o, { v: o.v }, {
              v: to, duration: 1.8, ease: 'power3.out',
              scrollTrigger: { trigger: el, start: 'top 90%', once: true },
              onUpdate: () => { el.textContent = `${o.v.toFixed(dec)}${suffix}`; },
            });
          });

          /* 2 · One price: the ticket lifts in, then the inclusions tick on. */
          gsap.fromTo('.skj-ticket', { opacity: 0, y: 40 }, {
            opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: '.skj-price', start: 'top 75%', once: true },
          });
          gsap.fromTo('.skj-inc', { opacity: 0, y: 10 }, {
            opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.035, delay: 0.3,
            scrollTrigger: { trigger: '.skj-ticket', start: 'top 75%', once: true },
          });

          /* 3 · Tours: the cards rise in a wave; the photo inside each card
             drifts against the scroll. */
          gsap.fromTo('.skj-tour', { opacity: 0, y: 70 }, {
            opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.14,
            scrollTrigger: { trigger: '.skj-tours__row', start: 'top 85%', once: true },
          });
          gsap.utils.toArray('.skj-tour__media img').forEach((im) => {
            gsap.fromTo(im, { yPercent: -8, scale: 1.16 }, {
              yPercent: 8, scale: 1.16, ease: 'none',
              scrollTrigger: { trigger: im.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
            });
          });

          /* Booking steps: a line fills as you scroll, each node switches on. */
          const nodes = gsap.utils.toArray('.skj-step');
          if (nodes.length) {
            gsap.fromTo('.skj-steps', { '--prog': 0 }, {
              '--prog': 1, ease: 'none',
              scrollTrigger: {
                trigger: '.skj-steps', start: 'top 80%', end: 'bottom 60%', scrub: 0.4,
                onUpdate: (st) => nodes.forEach((n, i) => n.classList.toggle('is-on', st.progress >= i / Math.max(1, nodes.length - 1) - 0.02)),
              },
            });
          }

          /* Promise seal turns with the scroll */
          gsap.fromTo('.skj-seal__ring', { rotate: -40 }, {
            rotate: 80, ease: 'none',
            scrollTrigger: { trigger: '.skj-promises', start: 'top bottom', end: 'bottom top', scrub: true },
          });

          /* Route maps draw in */
          gsap.utils.toArray('.skj-map').forEach((m) => {
            const tl = gsap.timeline({ scrollTrigger: { trigger: m, start: 'top 88%', once: true } });
            tl.fromTo(m.querySelector('.skj-map__route'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut' })
              .fromTo(m.querySelectorAll('.skj-map__stop'), { opacity: 0, scale: 0.4, transformOrigin: 'center' },
                { opacity: 1, scale: 1, stagger: 0.12, duration: 0.4, ease: 'back.out(2)' }, 0.1);
          });

          /* 7 · The lantern arch. The arch opens from a narrow window as it
             comes up the screen (scrubbed, on the clip wrapper), the photo
             inside settles from a zoom (on the img), the lanterns drop in on
             their strings and then never quite stop swaying. */
          gsap.fromTo('.vn-arch', { clipPath: 'inset(16% 22% 0% 22% round 999px 999px 0 0)' }, {
            clipPath: 'inset(0% 0% 0% 0% round 999px 999px 0 0)', ease: 'none',
            scrollTrigger: { trigger: '.vn-archwrap', start: 'top 95%', end: 'top 35%', scrub: 0.6 },
          });
          gsap.fromTo('.vn-arch__img', { scale: 1.3 }, {
            scale: 1, ease: 'none',
            scrollTrigger: { trigger: '.vn-archwrap', start: 'top bottom', end: 'bottom top', scrub: true },
          });
          gsap.fromTo('.vn-lantern__drop', { yPercent: -160, opacity: 0 }, {
            yPercent: 0, opacity: 1, duration: 2, ease: 'elastic.out(1, 0.42)', stagger: 0.2,
            scrollTrigger: { trigger: '.vn-archwrap', start: 'top 70%', once: true },
          });
          gsap.utils.toArray('.vn-lantern__swing').forEach((el, i) => {
            const amp = LANTERNS[i]?.amp || 5;
            gsap.fromTo(el, { rotation: -amp }, {
              rotation: amp, duration: 2.3 + i * 0.45, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: i * 0.3,
            });
          });
          /* Scroll speed pushes the lanterns: fast scrolling swings them, and
             they settle back once the page stops. */
          const pushers = gsap.utils.toArray('.vn-lantern__push')
            .map((el) => gsap.quickTo(el, 'rotation', { duration: 0.9, ease: 'power3.out' }));
          let settle;
          ScrollTrigger.create({
            trigger: '.vn-archwrap', start: 'top bottom', end: 'bottom top',
            onUpdate: (st) => {
              const v = gsap.utils.clamp(-16, 16, st.getVelocity() / -110);
              pushers.forEach((to, i) => to(v * (i === 1 ? 0.7 : 1)));
              settle?.kill();
              settle = gsap.delayedCall(0.18, () => pushers.forEach((to) => to(0)));
            },
          });

          /* 8 · Final band: the lantern street slowly comes closer. */
          gsap.fromTo('.skj-final__img', { scale: 1.18, yPercent: -6 }, {
            scale: 1, yPercent: 6, ease: 'none',
            scrollTrigger: { trigger: '.skj-final', start: 'top bottom', end: 'bottom top', scrub: true },
          });

          /* Generic rise for everything marked data-rise */
          ScrollTrigger.batch('[data-rise]', {
            start: 'top 88%',
            once: true,
            onEnter: (els) => gsap.fromTo(els, { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.08, overwrite: true }),
          });
          gsap.utils.toArray('[data-rise]').forEach((el) => {
            if (el.getBoundingClientRect().top > window.innerHeight * 0.88) gsap.set(el, { opacity: 0 });
          });
        },
      );
    }, root);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    document.fonts?.ready?.then(refresh);
    const t = setTimeout(refresh, 600);
    return () => { window.removeEventListener('load', refresh); clearTimeout(t); ctx.revert(); };
  }, []);


  return (
    <div className={`skj vn${showSticky ? ' has-sticky' : ''}`} ref={root}>
      <a className="skj-skip" href="#tours" onClick={scrollToTours}>Skip to the tours</a>

      {/* Shared shading for the lanterns: light in the middle, darker at the rim. */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
        <defs>
          <radialGradient id="vn-lantern-shade" cx="42%" cy="42%" r="62%">
            <stop offset="0" stopColor="#FFE9B8" stopOpacity=".45" />
            <stop offset=".55" stopColor="#FFE9B8" stopOpacity="0" />
            <stop offset="1" stopColor="#2A0B05" stopOpacity=".42" />
          </radialGradient>
        </defs>
      </svg>

      {/* ------------------------------------------------ NAV */}
      <header className={`skj-nav${solid ? ' is-solid' : ''}`}>
        <Link to="/" className="skj-nav__brand" aria-label="Cox & Kings home">
          <img src="/cox-logo-new.png" alt="Cox & Kings" width="120" height="46" />
        </Link>
        <nav className="vn-nav__links" aria-label="On this page">
          <a href="#tours" onClick={scrollToTours}>Vietnam tours</a>
          <a href="#how-booking-works" onClick={scrollToId('how-booking-works')}>How booking works</a>
          <a href={PHONE.href}>{PHONE.display}</a>
        </nav>
        <button type="button" className={`skj-btn skj-btn--nav${showSticky ? ' is-ducked' : ''}`} onClick={() => openBook()}>
          <span className="skj-only-wide">Book online &amp; save {inr(OFFER.onlineDiscount)}</span>
          <span className="skj-only-narrow">Book, save {inr(OFFER.onlineDiscount).replace(',000', 'k')}</span>
        </button>
      </header>

      <main className="skj-main">
        {/* ------------------------------------------------ 1 HERO */}
        <section className="skj-hero vn-hero" aria-labelledby="skj-hero-h">
          <div className="vn-hero__scene" aria-hidden="true">
            <div className="vn-hero__sky"><img src={HERO_SKY} alt="" fetchpriority="high" /></div>
            <div className="vn-hero__tint" />
            <div className="vn-hero__mark">
              <span className="vn-hero__word">
                {WORDMARK.map((ch, i) => (ch === ' '
                  ? <span key={i} className="vn-hero__gap" />
                  : <span key={i} className="vn-hero__chm"><span className="vn-hero__ch">{ch}</span></span>))}
              </span>
            </div>
            <div className="vn-hero__karsts"><img src={HERO_KARSTS} alt="" /></div>
            <Birds />
          </div>
          <div className="skj-hero__veil vn-hero__veil" aria-hidden="true" />

          <div className="skj-hero__copy vn-hero__copy">
            <div className="vn-hero__lead">
              <p className="skj-hero__eyebrow" data-hero-in>
                <span>Spring 2027</span><i aria-hidden="true" /> <span>Vietnam group tours</span>
              </p>
              <h1 id="skj-hero-h" className="skj-hero__title vn-hero__title" data-hero-in>
                <span className="skj-sr">Vietnam: </span>Ha Long Bay to the Mekong, <em>all taken care of.</em>
              </h1>
            </div>
            <div className="vn-hero__act">
              <p className="skj-hero__sub" data-hero-in>
                Expertly crafted holidays. Flights, 4-star hotels, a night on the bay, every meal, your e-visa.
              </p>
              <p className="skj-hero__offer" data-hero-in>
                <span className="skj-hero__offer-tag">Book online</span>
                <span>Pay <b>{inr(OFFER.depositOnline)}</b> <s>{inr(OFFER.depositOffline)}</s> today<span className="skj-only-wide"> · balance after visa</span></span>
              </p>
              <div className="skj-hero__ctas" ref={heroCtas} data-hero-in>
                <a className="skj-btn skj-btn--primary" href="#tours" onClick={scrollToTours}>
                  Explore tours <ArrowDown size={16} aria-hidden="true" />
                </a>
                <a className="skj-btn skj-btn--ghost" href={waLink('Hi Cox & Kings, I’d like to talk to an expert about the Vietnam spring 2027 tours.')}
                  target="_blank" rel="noopener noreferrer">
                  <WhatsAppGlyph /> Talk to an expert
                </a>
              </div>
              <ul className="skj-hero__trust" data-hero-in>
                <li>Since 1758</li>
                <li>Guaranteed departures</li>
                <li>Hindi &amp; English tour manager</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------ 2 ONE PRICE */}
        <section className="skj-price" aria-labelledby="skj-price-h">
          <div className="skj-price__inner">
            <div className="skj-price__copy">
              <Eyebrow>Truly all-inclusive</Eyebrow>
              <h2 id="skj-price-h" className="skj-h2">One price. <em>No surprises.</em></h2>
              <p className="skj-lead">Fixed in rupees the day you book. Nothing extra to spend on anything included, not even the dong.</p>
            </div>

            <div className="skj-ticket">
              <div className="skj-ticket__top">
                <div>
                  <span className="skj-ticket__lbl">From, per person</span>
                  <p className="skj-ticket__amt">{inr(TOURS[0].price - OFFER.onlineDiscount)} <s>{inr(TOURS[0].price)}</s></p>
                  <span className="skj-ticket__sub">{inr(OFFER.onlineDiscount)} off when you book online · hold your seat with {inr(OFFER.depositOnline)}</span>
                </div>
              </div>
              <ul className="skj-incs" aria-label="Included in the price">
                {INCLUDED.map((t, i) => {
                  const Icon = INC_ICONS[i] || Check;
                  return <li key={t} className="skj-inc"><Icon size={16} aria-hidden="true" /><span>{t}</span></li>;
                })}
              </ul>
              <ul className="skj-never" aria-label="What you will never pay for">
                {NEVER.map((t) => <li key={t}><X size={14} aria-hidden="true" /> {t}</li>)}
              </ul>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------ 3 TOURS */}
        <section className="skj-tours" id="tours" aria-labelledby="skj-tours-h">
          <div className="skj-sechead">
            <div>
              <Eyebrow>Three ways to see Vietnam</Eyebrow>
              <h2 id="skj-tours-h" className="skj-h2">Choose your <em>Vietnam</em></h2>
              <p className="skj-sub">Prices below include the {inr(OFFER.onlineDiscount)} online discount.</p>
            </div>
            <RowControls row={toursRow} label="tour" />
          </div>
          <div className="skj-row skj-tours__row" ref={toursRow.ref}>
            {TOURS.map((t) => (
              <TourCard key={t.id} tour={t} selectedDep={picked[t.id]} onSelectDep={selectDep} onItinerary={setItinId} />
            ))}
          </div>
        </section>

        {/* ------------------------------------------------ 4 REVIEWS */}
        <section className="skj-reviews" aria-labelledby="skj-rev-h">
          <div className="skj-reviews__head">
            <Eyebrow>Travelled, and came back happy</Eyebrow>
            <h2 id="skj-rev-h" className="skj-h2">Travellers who trusted us <em>with Vietnam</em></h2>
          </div>
          <div className="skj-rtrust">
            <p className="skj-rtrust__all">
              <strong data-count={RATING.overall} data-dec="1">{RATING.overall}</strong>
              <span><Stars /><small>Excellent · {RATING.count} verified reviews</small></span>
            </p>
            <span className="skj-rtrust__div" aria-hidden="true" />
            <p className="skj-rtrust__plat"><GoogleG /><span><b>{RATING.google}</b> on Google</span></p>
            <p className="skj-rtrust__plat"><TripAdvisorOwl /><span><b>{RATING.tripadvisor}</b> on Tripadvisor</span></p>
          </div>
          <div className="skj-marquee">
            <ul className="skj-marquee__track">
              {REVIEWS.map((r) => <ReviewCard key={r.name} r={r} />)}
              {REVIEWS.map((r) => <ReviewCard key={`${r.name}-2`} r={r} hidden />)}
            </ul>
          </div>
          <ul className="skj-row skj-reviews__row" ref={reviewsRow.ref}>
            {REVIEWS.map((r) => <ReviewCard key={r.name} r={r} />)}
          </ul>
          <Dots row={reviewsRow} label="Review" />
        </section>

        {/* ------------------------------------------------ 5 HOW BOOKING WORKS */}
        <section className="skj-book" id="how-booking-works" aria-labelledby="skj-book-h">
          <Eyebrow>Book online, save {inr(OFFER.onlineDiscount)}</Eyebrow>
          <h2 id="skj-book-h" className="skj-h2">Hold your seat for <em>{inr(OFFER.depositOnline)}</em></h2>
          <ol className="skj-steps">
            <span className="skj-steps__line" aria-hidden="true"><i /></span>
            {STEPS.map(({ t, b }, i) => (
              <li key={t} className={`skj-step${i === 0 ? ' is-on' : ''}`}>
                <span className="skj-step__dot" aria-hidden="true">{i + 1}</span>
                <div>
                  <h3 className="skj-step__t">{t}</h3>
                  <p className="skj-step__b">{b}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="skj-book__notes">
            <p><ShieldCheck size={16} aria-hidden="true" /><span><b>Guaranteed departures.</b> If we cancel, you get a full refund, advance included.</span></p>
            <p><Info size={16} aria-hidden="true" /><span>The deposit is non-refundable. It covers reservation commitments, insurance and visa processing.</span></p>
          </div>
        </section>

        {/* ------------------------------------------------ 6 THE PROMISE */}
        <section className="skj-promises" aria-labelledby="skj-pr-h">
          <div className="skj-promises__head">
            <PromiseSeal />
            <div>
              <Eyebrow>The Cox &amp; Kings Promise</Eyebrow>
              <h2 id="skj-pr-h" className="skj-h2">Expertly crafted. <em>Everything taken care of.</em></h2>
            </div>
          </div>
          <ul className="skj-promises__list">
            {PROMISES.map(({ icon: Icon, t, b }, i) => (
              <li key={t} className="skj-pitem" data-rise>
                <span className="skj-pitem__icon"><Icon size={22} strokeWidth={1.6} aria-hidden="true" /></span>
                <div>
                  <h3 className="skj-pitem__t"><span className="skj-pitem__n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>{t}</h3>
                  <p className="skj-pitem__b">{b}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* ------------------------------------------------ 7 HERITAGE (cream). Story + stats beside the
            lantern arch (Tran Quoc pagoda), then the awards on one white panel. */}
        <section className="skj-heritage" aria-labelledby="skj-her-h">
          <div className="skj-heritage__grid">
            <div className="skj-heritage__story">
              <Eyebrow>Our heritage</Eyebrow>
              <h2 id="skj-her-h" className="skj-h2">Trusted since 1758. <em>Best price, guaranteed.</em></h2>
              <p className="skj-heritage__p">
                260+ years of looking after travellers, now backed by Wilson &amp; Hughes and
                renewed for exceptional holidays, at the best price for every tour on this page.
              </p>
              <dl className="skj-heritage__stats">
                {HERITAGE_STATS.map(({ k, n, from, dec, t }) => (
                  <div key={k}>
                    <dt data-count={n} data-from={from} data-dec={dec} data-suffix={k.endsWith('+') ? '+' : undefined}>{k}</dt>
                    <dd>{t}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <figure className="skj-heritage__visual vn-archwrap">
              <div className="vn-arch">
                <img className="vn-arch__img" src={img(ARCH_IMG, 1200)} alt="Tran Quoc pagoda rising above the palms on West Lake, Hanoi" loading="lazy" />
              </div>
              {LANTERNS.map((l) => <Lantern key={l.x} {...l} />)}
              <figcaption className="skj-heritage__card">
                <p className="skj-heritage__card-k">Your people</p>
                <p className="skj-heritage__card-t">People who know the way</p>
                <p className="skj-heritage__card-b">A Vietnam specialist plans the trip with you. A tour manager travels it with you.</p>
                <span className="skj-heritage__person">
                  <img src={SPECIALIST.photo} alt="" width="48" height="48" loading="lazy" />
                  <span><b>{SPECIALIST.name}</b><small>{SPECIALIST.role}</small></span>
                </span>
              </figcaption>
            </figure>
          </div>
          <div className="skj-awards" data-rise>
            <p className="skj-awards__h">Recognised by the industry</p>
            <ul className="skj-row skj-awards__row">
              {AWARDS.map((a) => (
                <li key={a.title} className="skj-award">
                  <span className="skj-award__img"><img src={a.img} alt="" width="64" height="64" loading="lazy" /></span>
                  <span className="skj-award__txt">
                    <b>{a.title}</b>
                    <small>{a.by}, {a.years}</small>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ------------------------------------------------ 8 FINAL CTA: Hoi An's lantern street */}
        <section className="skj-final" ref={finalBand} aria-labelledby="skj-final-h">
          <img className="skj-final__img" src={img(FINAL_IMG, 2000)} alt="" loading="lazy" aria-hidden="true" />
          <div className="skj-final__inner">
            <Eyebrow light>Talk to us</Eyebrow>
            <h2 id="skj-final-h" className="skj-h2 is-light">The lanterns are lit. <br className="skj-br-wide" /><em>Your seat is waiting.</em></h2>
            <p className="skj-final__sub">Ask a Vietnam specialist anything on WhatsApp, or hold your seats online for {inr(OFFER.depositOnline)}. Spring departures fill first.</p>
            <div className="skj-final__ctas">
              <button type="button" className="skj-btn skj-btn--primary" onClick={() => openBook()}>
                Deposit &amp; book · {inr(OFFER.depositOnline)}
              </button>
              <a className="skj-btn skj-btn--ghost" href={waLink('Hi Cox & Kings, I have a question about the Vietnam spring 2027 tours.')} target="_blank" rel="noopener noreferrer">
                <WhatsAppGlyph /> WhatsApp us
              </a>
            </div>
            <p className="skj-final__hours"><Clock size={15} aria-hidden="true" /> Experts on call 9am–8pm IST · WhatsApp replies any time</p>
          </div>
        </section>
      </main>

      {/* ------------------------------------------------ FOOTER */}
      <footer className="skj-foot">
        <div className="skj-foot__row">
          <img className="skj-foot__logo" src="/cox-logo-new.png" alt="Cox & Kings" width="120" height="46" loading="lazy" />
          <nav className="skj-foot__help" aria-label="Help and support">
            <Link to="/faq2">FAQs</Link>
            <Link to="/terms#refund-policy">Refund policy</Link>
            <Link to="/terms">Terms &amp; Conditions</Link>
          </nav>
          <div className="skj-foot__contact">
            <a href={PHONE.href}><PhoneCall size={14} aria-hidden="true" /> {PHONE.display}</a>
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          </div>
        </div>
        <div className="skj-foot__legal">
          <span>© {new Date().getFullYear()} Cox &amp; Kings. Travelling the world since 1758.</span>
          <span>Prices per person on twin sharing, inclusive of GST &amp; TCS.</span>
        </div>
      </footer>

      {/* ------------------------------------------------ STICKY CTA BAR */}
      <div className={`skj-sticky${showSticky ? ' is-on' : ''}`} aria-hidden={!showSticky}>
        <div className="skj-sticky__info">
          <b>{inr(OFFER.depositOnline)} <small>to book</small></b>
          <span>Tour from {inr(TOURS[0].price - OFFER.onlineDiscount)} pp</span>
        </div>
        <button type="button" className="skj-btn skj-btn--primary" onClick={() => openBook()} tabIndex={showSticky ? 0 : -1}>
          Deposit &amp; book
        </button>
        <a className="skj-btn skj-btn--wa skj-btn--icon" href={waLink('Hi Cox & Kings, I’d like to know more about the Vietnam spring 2027 tours.')}
          target="_blank" rel="noopener noreferrer" tabIndex={showSticky ? 0 : -1} aria-label="Chat on WhatsApp">
          <WhatsAppGlyph size={20} /> <span className="skj-only-wide">WhatsApp</span>
        </a>
      </div>

      <BookingSheet open={sheet.open} initial={sheetInitial} onClose={closeBook} />
      <ItineraryDialog
        tour={TOURS.find((t) => t.id === itinId) || null}
        onClose={closeItin}
        onBook={(id) => { setItinId(null); openBook(id, picked[id]); }}
      />
    </div>
  );
}
