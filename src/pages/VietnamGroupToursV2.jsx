/* ============================================================================
   Cox & Kings: Vietnam group tours, VARIANT 2  (route: /vietnam-group-tours-v2)

   A copy of /vietnam-group-tours (VietnamGroupTours.jsx, left as it is) with
   Japan v3's price and EMI system, tailored for Vietnam:
     · No strikethrough prices. The price is the Steal Deal price, flat
       (₹1,44,000), and the 10% off is said once in the small print.
     · EMI sits next to every price: "₹1,44,000 or ₹12,000/month". There is
       no booking amount, so the EMI is the whole price split evenly.
     · An EMI section (plan table, 3/6/9/12 months) after "How it works",
       and an EMI tenure picker in the lead form.
     · Hero: no trust line, and the offer is a plain price note (no filled
       tag that reads as a button), as on Japan v3.
   Styles: VietnamGroupToursV2.css only (v1's base styles copied in, scoped
   .skj.vn2). Data: vietnam/dataV2.js (a copy of data.js).

   ---- variant 1 notes ----

   The package is the PM sheet's one Vietnam row, "Vietnam From Heritage to
   Paradise" (see vietnam/data.js): one tour, three departure windows.

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

     1  Hero              the one CTA inside the first fold on a 390×660 phone
     2  One price         what the price covers               (light)
     3  Tours             the one package: map, windows, View package (white)
     4  Reviews           rating bar + photo cards            (stone)
     5  How it works      what happens after I ask            (cream)
     6  The Promise       seal + four lines                   (white)
     7  Heritage          story, lantern arch, facts, awards  (cream)
     8  Final CTA         Hoi An lantern street + hours       (dark)

   ONE BUTTON (PM, 2026-11-25): every call to action on this page is
   "Talk to an Expert" and opens the lead form (LeadSheet). There is no
   booking amount and no online payment; the offer is the flat 10% Steal Deal.

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
  UtensilsCrossed, CarFront, PlaneTakeoff, Bus, Camera, Ticket, ShieldPlus, ScrollText, Ship, MapPin, ExternalLink,
} from 'lucide-react';
import {
  OFFER, TOURS, INCLUDED, NEVER, REVIEWS, RATING, AWARDS, ITINERARIES, HOTELS, LEAD_URL, PHONE, EMAIL, inr, img,
  INCLUSIONS, EXCLUSIONS, DEPARTURE_CITIES, EMI,
} from './vietnam/dataV2';

/* The sheet's price and the Steal Deal price (flat 10% off). */
const dealPrice = (t) => t.price - OFFER.onlineDiscount;
const DEAL = `${OFFER.dealName}: save ${inr(OFFER.onlineDiscount)}`;
const CTA = 'Talk to an Expert';

/* EMI (Japan v3's system). No booking amount on Vietnam, so the monthly
   figure is the whole Steal Deal price split evenly, before interest. */
const MAX_TENURE = Math.max(...EMI.tenures);
const emiFor = (tour, n) => Math.ceil(dealPrice(tour) / n / 100) * 100;
const TENURES = EMI.tenures.join(', ').replace(/, (\d+)$/, ' or $1');
/* "₹1,44,000 or ₹12,000/month": the lowest monthly figure, next to every price. */
function PriceEmi({ tour, className = '' }) {
  return (
    <p className={`v3-pe ${className}`}>
      <span className="v3-pe__amt">{inr(dealPrice(tour))}</span>
      <span className="v3-pe__or">or</span>
      <span className="v3-pe__emi"><b>{inr(emiFor(tour, MAX_TENURE))}</b>/month</span>
    </p>
  );
}
/* The one place the 10% off is explained. */
const DEAL_NOTE = `${OFFER.dealName} price, flat ${OFFER.dealPct}% off ${inr(TOURS[0].price)}`;
const EMI_FINE = `${DEAL_NOTE} · EMI over ${MAX_TENURE} months`;
const TOUR = TOURS[0];
import { VN_PATH, VN_NEIGHBOURS, VN_CITIES } from './vietnam/vietnamMap';
import './SakuraJapan.css';
import './VietnamGroupToursV2.css';

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
const INC_ICONS = [Plane, PlaneTakeoff, FileCheck2, Hotel, UtensilsCrossed, UtensilsCrossed, CarFront, Bus, Ship, Ticket, Camera, ShieldPlus, Receipt];

/* All eight points of the Cox & Kings Promise, as two swipeable cards of
   four (Japan v3's layout), worded for Vietnam: no booking amount, a guide
   rather than a tour manager, hotels "or similar". */
const PROMISE_CARDS = [
  {
    k: 'Your trip, taken care of',
    items: [
      { icon: Route, t: 'Crafted, unhurried journeys', b: 'Must-sees and meaningful experiences, with fewer hotel changes and less time on the road.' },
      { icon: Hotel, t: 'Hotels & meals assured', b: 'Hotels named upfront (or similar). Breakfast every day, lunches and dinners as the itinerary lists them.' },
      { icon: Headset, t: 'Guided, start to finish', b: 'A guide on every sightseeing day, and a Cox & Kings expert on call from your first question to homecoming.' },
      { icon: ClipboardList, t: 'Every detail upfront', b: 'Daily itinerary, flights and hotels in writing. No compulsory shopping stops, and birthdays celebrated.' },
    ],
  },
  {
    k: 'Your money, protected',
    items: [
      { icon: Receipt, t: 'All-inclusive, fixed price', b: 'Flights, hotels, the meals listed, transfers, sightseeing, entry tickets, the Ha Long Bay cruise, visa fees, GST & TCS. No hidden charges.' },
      { icon: Wallet, t: `Flat ${OFFER.dealPct}% off, or pay monthly`, b: `The ${OFFER.dealName} takes ${inr(OFFER.onlineDiscount)} off per person. Pay in full, or split the price into EMIs.` },
      { icon: ShieldCheck, t: 'Guaranteed departures', b: 'If Cox & Kings cancels a departure, you get a full refund.' },
      { icon: Landmark, t: 'Heritage & best price', b: 'Travelling since 1758, 260+ years on, now backed by Wilson & Hughes, with a guaranteed best price on this tour.' },
    ],
  },
];
const STEPS = [
  { t: CTA, b: 'Leave your number. A Vietnam specialist calls you back' },
  { t: 'Pick your date', b: `${OFFER.dealPct}% off, pay in full or in EMIs` },
  { t: 'We apply for your visa', b: 'Vietnam visa fees are included' },
  { t: 'Fly to Phu Quoc', b: 'Islands first, Hanoi and the bay last' },
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

/* The card's map is portrait (Vietnam runs north to south), so it can stand
   beside the rest of the card instead of above it. `fsK` sizes the labels
   against the map's rendered width; `labels` overrides LABEL_POS. */
function RouteMap({ tour, ratio = 1.6, fsK = 0.043, labels = {}, shiftX = 0 }) {
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
  const want = ratio;
  let w = x1 - x0; let h = y1 - y0;
  if (w / h < want) { const nw = h * want; x0 -= (nw - w) / 2; w = nw; } else { const nh = w / want; y0 -= (nh - h) / 2; h = nh; }
  x0 += w * shiftX;
  const fs = w * fsK;

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
          {/* Day-trip stops first, so an overnight dot (Da Nang) sits on top of a
              day trip right next to it (Hoi An). */}
          {pts.map((s, i) => ({ s, i })).sort((a, b) => (a.s.nights ? 1 : 0) - (b.s.nights ? 1 : 0)).map(({ s, i }) => {
            const [lx, ly, anchor] = labels[s.city] || s.lp || LABEL_POS[s.city] || [1, 0.35, 'start'];
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

function useMedia(q) {
  const [on, setOn] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches);
  useEffect(() => {
    const m = window.matchMedia(q);
    const f = () => setOn(m.matches);
    f();
    m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, [q]);
  return on;
}

/* The card shows four of the sheet's eight highlights, one per region
   (Phu Quoc, Hoi An, Ba Na Hills, Ha Long Bay); all eight, word for word,
   are at the top of the package popup. */
const CARD_HL = [0, 4, 5, 7];

/* Portrait-map labels: everything west of the dots except Ha Long Bay. */
const CARD_LABELS = {
  Hanoi: [-1, 0.35, 'end'],
  'Ha Long Bay': [0.9, -0.55, 'start'],
  'Da Nang': [-1, 0.1, 'end'],
  'Hoi An': [-1, 1.15, 'end'],
  'Phu Quoc': [1, 0.35, 'start'],
};

/* --------------------------------------------------------------------------
   THE TOUR CARD
   -------------------------------------------------------------------------- */
function TourCard({ tour, selectedDep, onSelectDep, onItinerary, onExpert }) {
  const live = tour.deps.filter((d) => !d.soldOut);
  const chosen = tour.deps.find((d) => d.id === selectedDep) || live[0];

  /* The whole card fits one screen (nav excluded) on desktop and phones.
     Body is a grid; the same children move between two layouts in CSS:
       desktop   from  | blurb        phone  map | from
                 map   | highlights          map | departures
                 map   | departures          highlights
                 map   | price + CTA         price + CTA
     On screens too short for the full list, the highlights fold into a
     toggle (the `short` query). */
  const desk = useMedia('(min-width: 980px)');
  const short = useMedia(desk ? '(max-height: 559px)' : '(max-height: 699px)');
  const [hlOpen, setHlOpen] = useState(false);
  const fold = short && !hlOpen;
  return (
    <article className={`skj-tour vn-card${tour.featured ? ' is-featured' : ''}`} aria-labelledby={`${tour.id}-h`}>
      <div className="skj-tour__media">
        <img src={img(tour.image, 900)} alt={tour.alt} loading="lazy" width="900" height="600" />
        <span className="skj-tour__tag">{tour.tag}</span>
        <div className="skj-tour__title">
          <h3 id={`${tour.id}-h`} className="skj-tour__name">{tour.name}</h3>
          <span className="skj-tour__nd">{tour.nd}</span>
        </div>
      </div>

      <div className="skj-tour__body vn-card__body">
        <p className="vn-tour__from vn-card__from"><MapPin size={14} aria-hidden="true" /> <span>From {tour.from}</span></p>

        <div className="vn-card__map">
          <RouteMap tour={tour} ratio={desk ? 0.74 : 0.8} fsK={desk ? 0.05 : 0.068} labels={CARD_LABELS} shiftX={0.06} />
        </div>

        <div className="vn-tour__hl vn-card__hl">
          <div className="vn-card__hlhead">
            {short ? (
              <button type="button" className="skj-tour__label vn-card__hltoggle" aria-expanded={hlOpen}
                aria-controls={`${tour.id}-hl`} onClick={() => setHlOpen((o) => !o)}>
                Highlights <ChevronRight size={14} aria-hidden="true" />
              </button>
            ) : (
              <p className="skj-tour__label">Key highlights</p>
            )}
            {/* The day-by-day, hotels, inclusions and exclusions: a text
                link, not a second button. */}
            <button type="button" className="vn-tour__more" onClick={() => onItinerary(tour.id)}>
              All {tour.highlights.length} highlights &amp; itinerary <ArrowRight size={14} aria-hidden="true" />
            </button>
          </div>
          {!fold && <ul id={`${tour.id}-hl`}>
            {CARD_HL.map((i) => tour.highlights[i]).map((h) => <li key={h}><Check size={14} strokeWidth={2.6} aria-hidden="true" /> {h}</li>)}
          </ul>}
        </div>

        <div className="skj-tour__dates vn-card__dates">
          <p className="skj-tour__label" id={`${tour.id}-dl`}><CalendarDays size={14} aria-hidden="true" /> Departures</p>
          <div className="vn-wins" role="radiogroup" aria-labelledby={`${tour.id}-dl`}>
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
                  className={`vn-win${d.soldOut ? ' is-sold' : ''}${on ? ' is-on' : ''}`}
                  onClick={() => !d.soldOut && onSelectDep(tour.id, d.id)}
                  aria-label={`Departures ${d.label}: ${d.soldOut ? 'sold out' : `${d.seats} seats left`}`}
                >
                  <span className="vn-win__d">{d.from} <i aria-hidden="true">–</i> {d.to}</span>
                  <span className="vn-win__y">{d.year} <b className="vn-win__s">{d.soldOut ? 'Sold out' : `${d.seats} left`}</b></span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="skj-tour__buy vn-card__buy">
          <div className="skj-tour__price">
            <PriceEmi tour={tour} />
            <p className="v3-pe__fine">Per person · {OFFER.dealName}, {OFFER.dealPct}% off</p>
          </div>
          <div className="skj-tour__ctas">
            <button type="button" className="skj-btn skj-btn--primary" onClick={() => onExpert(tour.id, chosen?.id)}>
              {CTA} <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

/* --------------------------------------------------------------------------
   Modal plumbing shared by the lead form and the itinerary popup:
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
   day. Used in the package popup (from the tour card).
   -------------------------------------------------------------------------- */
const MEAL_NAMES = { B: 'Breakfast', L: 'Lunch', D: 'Dinner' };

function ItineraryBody({ tour, full = false }) {
  const days = ITINERARIES[tour.id] || [];
  const stays = tour.stops.filter((st) => st.nights > 0);
  return (
    <div className="skj-itin">
      {full && (
        <div className="vn2-hl">
          <h4 className="vn-incl__h">Key highlights</h4>
          <ul className="vn-incl__list">
            {tour.highlights.map((t) => <li key={t}><Check size={14} aria-hidden="true" /> {t}</li>)}
          </ul>
        </div>
      )}
      <dl className="skj-itin__facts">
        <div>
          <dt><Plane size={15} aria-hidden="true" /> Flights</dt>
          <dd>{tour.flights.out}<br />{tour.flights.back}</dd>
        </div>
        <div>
          <dt><Hotel size={15} aria-hidden="true" /> Hotels</dt>
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
          <dd>Daily continental breakfast. Lunches and dinners as listed for each day below.</dd>
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

      {full && (
        <>
          <div className="vn-incl">
            <div>
              <h4 className="vn-incl__h">Inclusions</h4>
              <ul className="vn-incl__list">
                {INCLUSIONS.map((t) => <li key={t}><Check size={14} aria-hidden="true" /> {t}</li>)}
              </ul>
            </div>
            <div>
              <h4 className="vn-incl__h">Exclusions</h4>
              <ul className="vn-incl__list is-ex">
                {EXCLUSIONS.map((t) => <li key={t}><X size={14} aria-hidden="true" /> {t}</li>)}
              </ul>
            </div>
          </div>
          <p className="vn-itin-src">
            Hotels are as named “or similar”. <a href={tour.url} target="_blank" rel="noopener noreferrer">Full package on coxandkings.com <ExternalLink size={13} aria-hidden="true" /></a>
          </p>
        </>
      )}
    </div>
  );
}

function ItineraryDialog({ tour, onClose, onExpert }) {
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
        <ItineraryBody tour={tour} full />
        <div className="skj-itin__foot">
          <div><PriceEmi tour={tour} /><small>Per person, twin sharing · {EMI_FINE}</small></div>
          <button type="button" className="skj-btn skj-btn--primary" onClick={() => onExpert(tour.id)}>
            {CTA} <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
   THE LEAD FORM — bottom sheet on phones, centred dialog on desktop. Every
   "Talk to an Expert" button opens it. Nothing is paid here: the visitor
   leaves a name and number, and a Vietnam specialist calls back.
   With LEAD_URL set (data.js) the form POSTs its fields as JSON there;
   while it is null the form shows its thank-you without sending anything.
   -------------------------------------------------------------------------- */
const EMPTY_LEAD = { name: '', phone: '', email: '' };

/* Returns the errors, so focus can go to the first one without waiting for
   React state. */
function validateLead(v) {
  const e = {};
  if (v.name.trim().length < 2) e.name = 'Please enter your name.';
  const digits = v.phone.replace(/\D/g, '').replace(/^(91|0)(?=\d{10}$)/, '');
  if (!/^[6-9]\d{9}$/.test(digits)) e.phone = 'Please enter a 10-digit Indian mobile number.';
  if (v.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = 'Please check this email address.';
  return e;
}

function LeadSheet({ open, initial, onClose }) {
  const tour = TOUR;
  const live = tour.deps.filter((d) => !d.soldOut);
  const [depId, setDepId] = useState(initial.depId || live[0].id);
  const [date, setDate] = useState('');
  const [city, setCity] = useState(DEPARTURE_CITIES[0]);
  const [pax, setPax] = useState(2);
  const [tenure, setTenure] = useState(EMI.defaultTenure);
  const [v, setV] = useState(EMPTY_LEAD);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | failed
  const panel = useRef(null);
  const uid = useId();
  const fid = (k) => `${uid}-${k}`;

  useEffect(() => {
    if (!open) return;
    setDepId(live.some((d) => d.id === initial.depId) ? initial.depId : live[0].id);
    setDate('');
    setErrors({});
    if (status !== 'sent') setStatus('idle');
  }, [open, initial]); // eslint-disable-line react-hooks/exhaustive-deps

  useModal(open, onClose, panel);

  const dep = live.find((d) => d.id === depId) || live[0];
  /* Dates inside the chosen window, from tomorrow at the earliest. */
  const tomorrow = new Date(Date.now() + 864e5).toISOString().slice(0, 10);
  const min = dep.iso > tomorrow ? dep.iso : tomorrow;
  const n = Math.min(pax, 6);

  const set = (k) => (e) => {
    setV((o) => ({ ...o, [k]: e.target.value }));
    if (errors[k]) setErrors((o) => ({ ...o, [k]: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const errs = validateLead(v);
    setErrors(errs);
    const first = ['name', 'phone', 'email'].find((k) => errs[k]);
    if (first) { document.getElementById(fid(first))?.focus(); return; }
    const lead = {
      tour: tour.id, tourName: tour.name, window: dep.label, date: date || null,
      from: city, travellers: n, name: v.name.trim(), phone: v.phone.trim(), email: v.email.trim() || null,
      offer: `${OFFER.dealName} ${OFFER.dealPct}%`, emiMonths: tenure, page: '/vietnam-group-tours-v2',
    };
    if (!LEAD_URL) { setStatus('sent'); return; }
    setStatus('sending');
    try {
      const r = await fetch(LEAD_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(lead) });
      setStatus(r.ok ? 'sent' : 'failed');
    } catch {
      setStatus('failed');
    }
  };

  if (!open) return null;

  const field = (k, label, props) => (
    <label className={`skj-field vn-lead__f${errors[k] ? ' is-err' : ''}`}>
      <span>{label}</span>
      <input id={fid(k)} value={v[k]} onChange={set(k)} aria-invalid={!!errors[k]}
        aria-describedby={errors[k] ? `${fid(k)}-e` : undefined} {...props} />
      {errors[k] && <small className="vn-lead__err" id={`${fid(k)}-e`}>{errors[k]}</small>}
    </label>
  );

  return (
    <div className="skj-sheet" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="skj-sheet__panel" role="dialog" aria-modal="true" aria-labelledby="skj-sheet-h" ref={panel}>
        <div className="skj-sheet__head">
          <div>
            <Eyebrow>{`${tour.name} · ${tour.nd.replace(/ /g, "\u00a0")}`}</Eyebrow>
            <h2 id="skj-sheet-h" className="skj-sheet__title">{status === 'sent' ? 'Thank you. We’ll call you soon.' : CTA}</h2>
          </div>
          <button type="button" className="skj-iconbtn" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>

        {status === 'sent' ? (
          <div className="vn-lead__done" role="status">
            <span className="vn-lead__tick" aria-hidden="true"><Check size={26} /></span>
            <p>
              {v.name.trim().split(' ')[0]}, a Vietnam specialist will call you on <b>{v.phone.trim()}</b> between
              9am and 8pm IST to plan your dates and confirm the {OFFER.dealName} price of <b>{inr(dealPrice(tour))}</b> per person.
            </p>
            <button type="button" className="skj-btn skj-btn--primary skj-btn--block" onClick={onClose}>Done</button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <p className="vn-lead__intro">
              Leave your details and a Vietnam specialist will call you back. No payment, no obligation.
            </p>
            <div className="skj-sheet__grid vn-sheet__grid vn-lead__grid">
              {field('name', 'Your name', { type: 'text', autoComplete: 'name', required: true })}
              {field('phone', 'Mobile number', { type: 'tel', inputMode: 'tel', autoComplete: 'tel', placeholder: '98765 43210', required: true })}
              {field('email', 'Email (optional)', { type: 'email', autoComplete: 'email' })}
              <label className="skj-field">
                <span>Flying from</span>
                <select value={city} onChange={(e) => setCity(e.target.value)}>
                  {DEPARTURE_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>
              <label className="skj-field">
                <span>Departure window</span>
                <select value={dep.id} onChange={(e) => { setDepId(e.target.value); setDate(''); }}>
                  {live.map((d) => <option key={d.id} value={d.id}>{d.label}</option>)}
                </select>
              </label>
              <label className="skj-field">
                <span>Preferred date (optional)</span>
                <input type="date" value={date} min={min} max={dep.end} onChange={(e) => setDate(e.target.value)} />
              </label>
              <div className="skj-field">
                <span id="skj-pax-l">Travellers</span>
                <div className="skj-stepper" role="group" aria-labelledby="skj-pax-l">
                  <button type="button" onClick={() => setPax(Math.max(1, n - 1))} disabled={n <= 1} aria-label="One fewer traveller"><Minus size={16} /></button>
                  <output aria-live="polite">{n}</output>
                  <button type="button" onClick={() => setPax(Math.min(6, n + 1))} disabled={n >= 6} aria-label="One more traveller"><Plus size={16} /></button>
                </div>
              </div>
            </div>

            <dl className="skj-bill">
              <div><dt>Tour price × {n}</dt><dd>{inr(tour.price * n)}</dd></div>
              <div className="is-save"><dt>{OFFER.dealName}, flat {OFFER.dealPct}% off</dt><dd>−{inr(OFFER.onlineDiscount * n)}</dd></div>
              <div className="is-today"><dt>Your price, {n} traveller{n > 1 ? 's' : ''}</dt><dd>{inr(dealPrice(tour) * n)}</dd></div>
            </dl>

            <fieldset className="v2-sheet-emi">
              <legend><Wallet size={15} aria-hidden="true" /> Or pay in EMIs</legend>
              <div className="v2-tenures" role="radiogroup" aria-label="EMI tenure">
                {EMI.tenures.map((m) => (
                  <button key={m} type="button" role="radio" aria-checked={tenure === m}
                    className={`v2-tenure${tenure === m ? ' is-on' : ''}`} onClick={() => setTenure(m)}>
                    {m} mo
                  </button>
                ))}
              </div>
              <p className="v2-sheet-emi__amt"><b>{inr(Math.ceil((dealPrice(tour) * n) / tenure / 100) * 100)}</b> a month for {tenure} months <small>for {n} traveller{n > 1 ? 's' : ''}, indicative, before interest</small></p>
            </fieldset>

            <p className="skj-sheet__note">
              <Info size={16} aria-hidden="true" />
              <span>
                {OFFER.dealName} is a limited-period offer with limited discount vouchers. Prices include GST and TCS.
                Terms and conditions apply.
              </span>
            </p>

            {status === 'failed' && (
              <p className="vn-lead__err vn-lead__fail" role="alert">
                That didn’t go through. Please try again, or call us on <a href={PHONE.href}>{PHONE.display}</a>.
              </p>
            )}
            <button type="submit" className="skj-btn skj-btn--primary skj-btn--block" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : 'Request a call back'} <ArrowRight size={16} aria-hidden="true" />
            </button>
            <p className="skj-sheet__fine">We’ll only use your number to talk about this trip.</p>
          </form>
        )}
      </div>
    </div>
  );
}


/* --------------------------------------------------------------------------
   EMI PLANS — after "How it works", as on Japan v3. One package, so one
   column of monthly amounts per tenure.
   ⚠ Placeholder maths (EMI in data.js): the price split evenly, before
   interest, rounded up to the nearest ₹100.
   -------------------------------------------------------------------------- */
function EmiPlans({ onExpert }) {
  return (
    <section className="v3-emi" aria-labelledby="v3-emi-h">
      <div className="v3-emi__inner">
        <div className="v3-emi__copy" data-rise>
          <Eyebrow>Easy EMIs</Eyebrow>
          <h2 id="v3-emi-h" className="skj-h2">Vietnam now. <em>Pay monthly.</em></h2>
          <p className="skj-lead">Pay the {OFFER.dealName} price of {inr(dealPrice(TOUR))} in one go, or spread it over {TENURES} months.</p>
          <ul className="v3-emi__points">
            <li><Check size={15} strokeWidth={2.6} aria-hidden="true" /> No booking amount to pay upfront</li>
            <li><Check size={15} strokeWidth={2.6} aria-hidden="true" /> Your expert checks eligibility with you on the call</li>
          </ul>
          <button type="button" className="skj-btn skj-btn--primary" onClick={onExpert}>
            {CTA} <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>

        <div className="v3-emi__card" data-rise>
          <table className="v3-emi__table">
            <caption className="skj-sr">EMI plans per person</caption>
            <thead>
              <tr>
                <th scope="col">Per person</th>
                <th scope="col">{TOUR.name.replace('Vietnam ', '')}<small>{TOUR.nd}</small></th>
              </tr>
            </thead>
            <tbody>
              <tr className="is-bal">
                <th scope="row">Tour price, {OFFER.dealName}</th>
                <td>{inr(dealPrice(TOUR))}</td>
              </tr>
              {EMI.tenures.map((m) => (
                <tr key={m} className={m === MAX_TENURE ? 'is-low' : ''}>
                  <th scope="row">{m}-month plan{m === MAX_TENURE && <span className="v3-emi__tag">Lowest monthly</span>}</th>
                  <td><b>{inr(emiFor(TOUR, m))}</b><small>/month</small></td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="v3-emi__fine">{DEAL_NOTE}. {EMI.note}</p>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   THE PAGE
   ========================================================================== */
export default function VietnamGroupToursV2() {
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
  const promiseRow = useSnapRow();

  const openLead = useCallback((tourId = null, depId = null) => {
    setSheet({ open: true, tourId: tourId || TOUR.id, depId });
  }, []);
  const closeLead = useCallback(() => setSheet((s) => ({ ...s, open: false })), []);
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

          /* How-it-works steps: a line fills as you scroll, each node switches on. */
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
    <div className={`skj vn2${showSticky ? ' has-sticky' : ''}`} ref={root}>
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
          <a href="#tours" onClick={scrollToTours}>The package</a>
          <a href="#how-it-works" onClick={scrollToId('how-it-works')}>How it works</a>
          <a href={PHONE.href}>{PHONE.display}</a>
        </nav>
        <button type="button" className={`skj-btn skj-btn--nav${showSticky ? ' is-ducked' : ''}`} onClick={() => openLead()}>
          {CTA}
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
                <span>Nov 2026 to Nov 2027</span><i aria-hidden="true" /> <span>Vietnam group tour</span>
              </p>
              <h1 id="skj-hero-h" className="skj-hero__title vn-hero__title" data-hero-in>
                <span className="skj-sr">Vietnam: </span>Phu Quoc to Ha Long Bay, <em>all taken care of.</em>
              </h1>
            </div>
            <div className="vn-hero__act">
              <p className="skj-hero__sub" data-hero-in>
                Vietnam From Heritage to Paradise, 8 nights. Return and domestic flights, hotels, sightseeing, visa fees, GST and TCS.
              </p>
              {/* The offer as a plain price note, no filled tag: it must not
                  read as a second button (Japan v3's hero booking note). */}
              {/* Price + the one CTA on a frosted glass bar, the same glass as
                  the homepage hero's search bar (Luxe2Improved .lx2i-search). */}
              <div className="vn2-hero-glass" data-hero-in>
                <p className="vn2-hero-price">
                  <span className="vn2-hero-price__k">{OFFER.dealName} · flat {OFFER.dealPct}% off</span>
                  <span className="vn2-hero-price__v"><b>{inr(dealPrice(TOUR))}</b> <small>per person</small></span>
                  <span className="vn2-hero-price__emi">or <b>{inr(emiFor(TOUR, MAX_TENURE))}</b>/month on EMI</span>
                </p>
                <div className="skj-hero__ctas" ref={heroCtas}>
                  <button type="button" className="skj-btn skj-btn--primary" onClick={() => openLead()}>
                    {CTA} <ArrowRight size={16} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------ 2 ONE PRICE */}
        <section className="skj-price" aria-labelledby="skj-price-h">
          <div className="skj-price__inner">
            <div className="skj-price__copy">
              <Eyebrow>Truly all-inclusive</Eyebrow>
              <h2 id="skj-price-h" className="skj-h2">One price. <em>No surprises.</em></h2>
              <p className="skj-lead">Fixed in rupees, with GST and TCS already in. Nothing extra to spend on anything included.</p>
            </div>

            <div className="skj-ticket">
              <div className="skj-ticket__top">
                <div>
                  <span className="skj-ticket__lbl">Per person, {TOUR.nd}</span>
                  <PriceEmi tour={TOUR} className="v3-pe--ticket" />
                  <span className="skj-ticket__sub">{DEAL_NOTE} · EMI over {TENURES} months</span>
                </div>
              </div>
              <ul className="skj-incs" aria-label="Included in the price">
                {INCLUDED.map((t, i) => {
                  const Icon = INC_ICONS[i] || Check;
                  return <li key={t} className="skj-inc"><Icon size={16} aria-hidden="true" /><span>{t}</span></li>;
                })}
              </ul>
              <ul className="skj-never" aria-label="What you will never pay for">
                {NEVER.map((t) => <li key={t}><Check size={14} aria-hidden="true" /> {t}</li>)}
              </ul>
              <p className="vn-notinc"><b>Not included:</b> {EXCLUSIONS.slice(0, 5).join(' · ')}.</p>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------ 3 TOURS */}
        <section className="skj-tours" id="tours" aria-labelledby="skj-tours-h">
          <div className="skj-sechead">
            <div>
              <Eyebrow>The package</Eyebrow>
              <h2 id="skj-tours-h" className="skj-h2">Islands, heritage <em>and the bay</em></h2>
              <p className="skj-sub">8 nights, 9 days, departures from November 2026. The price includes the {OFFER.dealName}, flat {OFFER.dealPct}% off.</p>
            </div>
          </div>
          <div className="skj-tours__row vn-tours__one">
            {TOURS.map((t) => (
              <TourCard key={t.id} tour={t} selectedDep={picked[t.id]} onSelectDep={selectDep} onItinerary={setItinId} onExpert={openLead} />
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

        {/* ------------------------------------------------ 5 HOW IT WORKS */}
        <section className="skj-book" id="how-it-works" aria-labelledby="skj-book-h">
          <Eyebrow>{DEAL}</Eyebrow>
          <h2 id="skj-book-h" className="skj-h2">Talk to an expert. <em>We take it from there.</em></h2>
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
            <p><ShieldCheck size={16} aria-hidden="true" /><span><b>Guaranteed departures.</b> If we cancel, you get a full refund.</span></p>
            <p><Info size={16} aria-hidden="true" /><span>{OFFER.dealName}: flat {OFFER.dealPct}% off ({inr(OFFER.onlineDiscount)} per person), a limited-period offer with limited discount vouchers. Terms and conditions apply.</span></p>
          </div>
        </section>

        {/* ------------------------------------------------ 5b EMI PLANS (Japan v3's table) */}
        <EmiPlans onExpert={() => openLead()} />

        {/* ------------------------------------------------ 6 THE PROMISE */}
        <section className="skj-promises" aria-labelledby="skj-pr-h">
          <div className="v2-pr-head">
            <div className="skj-promises__head">
              <PromiseSeal />
              <div>
                <Eyebrow>The Cox &amp; Kings Promise</Eyebrow>
                <h2 id="skj-pr-h" className="skj-h2">Expertly crafted. <em>Everything taken care of.</em></h2>
              </div>
            </div>
            <RowControls row={promiseRow} label="promise card" />
          </div>
          <div className="skj-row v2-pr-row" ref={promiseRow.ref}>
            {PROMISE_CARDS.map((card, ci) => (
              <article key={card.k} className="v2-pcard" aria-labelledby={`v2-pc-${ci}`}>
                <h3 id={`v2-pc-${ci}`} className="v2-pcard__k">
                  <span aria-hidden="true">{String(ci + 1).padStart(2, '0')}</span> {card.k}
                </h3>
                <ul className="v2-pcard__list">
                  {card.items.map(({ icon: Icon, t, b }) => (
                    <li key={t} className="v2-pi">
                      <span className="skj-pitem__icon"><Icon size={20} strokeWidth={1.6} aria-hidden="true" /></span>
                      <div>
                        <p className="v2-pi__t">{t}</p>
                        <p className="v2-pi__b">{b}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <Dots row={promiseRow} label="Promise card" />
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
            <p className="skj-final__sub">Leave your number and a Vietnam specialist will call you back with dates, prices and anything else you want to know. The {OFFER.dealName} is a limited-period offer.</p>
            <div className="skj-final__ctas">
              <button type="button" className="skj-btn skj-btn--primary" onClick={() => openLead()}>
                {CTA} <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
            <p className="skj-final__hours"><Clock size={15} aria-hidden="true" /> Experts call back 9am–8pm IST, seven days a week</p>
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
          <b>{inr(dealPrice(TOUR))} <small>per person</small></b>
          <span>or {inr(emiFor(TOUR, MAX_TENURE))}/month · {OFFER.dealName}</span>
        </div>
        <button type="button" className="skj-btn skj-btn--primary" onClick={() => openLead()} tabIndex={showSticky ? 0 : -1}>
          {CTA}
        </button>
      </div>

      <LeadSheet open={sheet.open} initial={sheetInitial} onClose={closeLead} />
      <ItineraryDialog
        tour={TOURS.find((t) => t.id === itinId) || null}
        onClose={closeItin}
        onExpert={(id) => { setItinId(null); openLead(id, picked[id]); }}
      />
    </div>
  );
}
