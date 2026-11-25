/* ============================================================================
   Cox & Kings: Europe, early booking, VARIANT 2  (route: /europe-early-booking-v2)

   A copy of /europe-early-booking with the Japan v3 price system:
     · Every price is flat and carries its EMI: "₹2,80,000 or ₹18,000/month"
       (12 months on the balance after the early-bird discount and the
       ₹55,000 booking amount). No strikethroughs.
     · An "Easy EMIs" plan table (3/6/9/12 months × the four packages) after
       "How booking works", and an EMI option in the booking sheet.
     · Hero: the trust line is gone, and the orange "Early bird" pill (which
       read as a button) is now a plain price note under the CTAs.
     · Calmer tour cards: no blurb, the map shows city names only, one quiet
       line for nights/hotels/day trips, a month dropdown instead of a second
       chip row, and seats said once under the dates.
   Styles: SakuraJapan.css + EuropeEarlyBooking.css (shared, untouched) +
   EuropeEarlyBookingV2.css (scoped `.skj.eu2`).

   ---- variant 1 notes ----
   Cox & Kings: Europe, early booking  (route: /europe-early-booking)

   The Japan cherry-blossom lander (SakuraJapan.jsx), same layout, sections,
   design and most of the copy, re-pointed at Europe and marketed on the
   EARLY-BOOKING price instead of the blossom: book online before
   OFFER.earlyBy and the ₹10,000 saving comes off the tour price.
   Packages, prices, the ₹55,000 booking amount and the inclusions are the
   PM's product sheet (see europe/data.js).

   It reuses SakuraJapan.css as-is (every rule is scoped to `.skj`), so the
   two pages stay visually identical. Nothing in the Japan page changes.

     1  Hero              both CTAs inside the first fold on a 390×660 phone
     2  One price         what the price covers               (light)
     3  Tours             map, dates, seats, View package     (white)
     4  Reviews           rating bar + photo cards            (stone)
     5  How booking works what happens after I pay           (cream)
     6  The Promise       seal + four lines                   (white)
     7  Heritage          story, photo, facts, awards         (cream)
     8  Final CTA         photograph band + hours             (dark)

   Everything editable (offer, tours, dates, itineraries, reviews) is in
   ./europe/data.js. The map is ./europe/europeMap.js (generated).
   ========================================================================== */

import { useState, useRef, useEffect, useLayoutEffect, useCallback, useMemo, useId } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight, ArrowDown, ChevronDown, Check, X, Star, Minus, Plus, Route, Receipt, Hotel, Wallet,
  ShieldCheck, Headset, ClipboardList, Landmark, ChevronLeft, ChevronRight,
  Clock, BedDouble, Footprints, FileCheck2, Plane, Info, CalendarDays, PhoneCall,
  UtensilsCrossed, CarFront, TrainFront, Bus, Camera, Sparkles, Ticket, ShieldPlus, CreditCard, ScrollText,
} from 'lucide-react';
import {
  OFFER, TOURS, INCLUDED, NEVER, NOT_INCLUDED, REVIEWS, RATING, AWARDS, ITINERARIES, PAYMENT_URL, PHONE, EMAIL, EMI, inr, waLink, img,
} from './europe/data';
import { EU_PATH, EU_CITIES as EU_BASE } from './europe/europeMap';
import './SakuraJapan.css';
import './EuropeEarlyBooking.css';
import './EuropeEarlyBookingV2.css';

gsap.registerPlugin(ScrollTrigger);

/* ---- Price system (as Japan v3) -------------------------------------------
   The tour price is shown flat. Its EMI is the balance (price − early-bird
   discount − booking amount) over the longest tenure, rounded up to ₹100. */
const CHEAPEST = TOURS.reduce((a, t) => (t.price < a.price ? t : a), TOURS[0]);
const MAX_TENURE = Math.max(...EMI.tenures);
const TEN_K = inr(OFFER.onlineDiscount).replace(',000', 'K');
const balanceOf = (tour) => tour.price - OFFER.onlineDiscount - OFFER.booking;
const emiFor = (tour, n) => Math.ceil(balanceOf(tour) / n / 100) * 100;
const EMI_FINE = `EMI over ${MAX_TENURE} months on the balance, after the ${inr(OFFER.booking)} booking amount`;
const EMI_FINE_SHORT = `${MAX_TENURE}-month EMI, after ${inr(OFFER.booking)} to book`;
const TENURES_TXT = EMI.tenures.join(', ').replace(/, (\d+)$/, ' or $1');
const CTA = {
  book: `Book online & Save ${TEN_K}`,
  explore: 'Explore Tours',
  expert: 'Talk to an Expert',
  pkg: 'View Package',
};

/* "₹2,80,000 or ₹18,000/month": the lowest monthly figure, beside every price. */
function PriceEmi({ tour, className = '' }) {
  return (
    <p className={`v3-pe ${className}`}>
      <span className="v3-pe__amt">{inr(tour.price)}</span>
      <span className="v3-pe__or">or</span>
      <span className="v3-pe__emi"><b>{inr(emiFor(tour, MAX_TENURE))}</b>/month</span>
    </p>
  );
}

const HERO_IMG = '1502602898657-3e91760cbb34'; // the Eiffel Tower above the Seine at dusk
/* Pont Alexandre III at dusk: dark enough to carry white type. */
const FINAL_IMG = '1499856871958-5b9627545d1a';

/* One icon per inclusion, in data.js INCLUDED order. */
const INC_ICONS = [Plane, Hotel, UtensilsCrossed, UtensilsCrossed, CarFront, Headset, Camera, Sparkles, TrainFront, Wallet, ShieldPlus, FileCheck2, Receipt];

const PROMISES = [
  { icon: Route, t: 'Crafted, unhurried journeys', b: 'Must-sees and meaningful experiences, with fewer hotel changes and less time on the road.' },
  { icon: Hotel, t: 'Hotels & meals assured', b: 'Hotels named in your itinerary (or similar). Daily breakfast, with Indian lunches and dinners as listed.' },
  { icon: Headset, t: 'A tour manager, start to finish', b: 'Hindi & English help from booking to homecoming, pre-departure briefings and a WhatsApp group.' },
  { icon: ClipboardList, t: 'Every detail upfront', b: 'Daily itinerary, flights and hotels in writing. No compulsory shopping stops, and birthdays celebrated.' },
];
const STEPS = [
  { t: `Book at ${inr(OFFER.booking)}`, b: 'Your seat and your price are held' },
  { t: 'We help with your visa', b: 'Documents, processing and appointment' },
  { t: 'Visa approved', b: 'Only then is the balance due' },
  { t: 'Fly to Europe', b: 'Briefing first, then the summer' },
];

/* Heritage facts — each one is already printed elsewhere on the site
   (dispatches.js, v3content.js, terms.js, /testimonials). Nothing new here. */
/* Heritage side photo: travellers on a group journey. The card's person is
   the site's existing travel-designer profile (Luxe2Improved DESIGNER).
   ⚠ PLACEHOLDER: swap both for a real Cox & Kings tour manager or specialist
   (photo + name + tenure) before launch. */
const HERITAGE_PHOTO = img('1516483638261-f4dbaf036963', 1400); // Manarola, Cinque Terre
const SPECIALIST = { name: 'Aanya Kapoor', role: 'Europe specialist · 12 years with us', photo: '/aanya-kapoor.jpg' };

const HERITAGE_STATS = [
  { k: '1758', t: 'Founded in London' },
  { k: '260+', t: 'Years of heritage' },
  { k: '100+', t: 'Countries travelled' },
  { k: RATING.overall, t: 'Traveller rating' },
];

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

function Petal({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true">
      <path d="M20 3c5 6 11 10 11 18a11 11 0 0 1-22 0C9 13 15 9 20 3Zm0 6-1.6 4.2h3.2Z" fill="currentColor" />
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
   THE ROUTE MAP: Europe from Natural Earth (europe/europeMap.js), cropped to
   each tour's own stops so a 300px card still reads as a route, not a dot on
   an archipelago. Day-trip stops (0 nights) are hollow.
   -------------------------------------------------------------------------- */
/* Cities the generated map module doesn't carry, in its projection
   (x = (lon + 11) × cos 48° × 30, y = (58 − lat) × 30). "Tuscany" is the
   sheet's overnight; it sits on Florence. Padova (Venice's overnight) is
   9px from Venice, so the map shows Venice only. */
const EU_CITIES = {
  ...EU_BASE,
  London: [218.2, 194.8],
  Geneva: [344.1, 353.9],
  Zurich: [392.3, 318.7],
  Tuscany: EU_BASE.Florence,
};

const LABEL_POS = {
  London: [-1, 0.35, 'end'],
  Geneva: [-1, 0.35, 'end'],
  Zurich: [0, -0.9, 'middle'],
  Pisa: [-1, 0.35, 'end'],
  Tuscany: [1, 0.35, 'start'],
  Paris: [-1, 0.35, 'end'],
  Brussels: [1, 0.35, 'start'],
  Amsterdam: [1, 0.35, 'start'],
  Lucerne: [-1, 0.35, 'end'],
  Innsbruck: [1, 0.35, 'start'],
  Venice: [1, 0.35, 'start'],
  Florence: [-1, 0.35, 'end'],
  Rome: [1, 0.35, 'start'],
  Budapest: [1, 0.35, 'start'],
  Bratislava: [0.3, 1.6, 'middle'],
  Vienna: [-0.2, -0.85, 'end'],
  Salzburg: [-1, 0.35, 'end'],
  Prague: [1, 0.35, 'start'],
};

function RouteMap({ tour }) {
  const clipId = useId().replace(/:/g, '');
  const pts = tour.stops.map((s) => ({ ...s, p: EU_CITIES[s.city] }));
  const xs = pts.map((s) => s.p[0]);
  const ys = pts.map((s) => s.p[1]);
  let x0 = Math.min(...xs); let x1 = Math.max(...xs);
  let y0 = Math.min(...ys); let y1 = Math.max(...ys);
  // Europe routes span far more ground than Japan's, so the margins are wider,
  // with extra room at the bottom for the caption chip.
  const padX = 120; const padY = 40;
  x0 -= padX; x1 += padX; y0 -= padY; y1 += padY * 1.4; // v2: no caption chip, just room for the last label
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

  return (
    <figure className="skj-map">
      <svg viewBox={`${x0.toFixed(1)} ${y0.toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}`} role="img"
        aria-label={`Route map: ${tour.stops.map((s) => s.city).join(', then ')}`}>
        <defs>
          <clipPath id={`c${clipId}`}><rect x={x0} y={y0} width={w} height={h} /></clipPath>
        </defs>
        <g clipPath={`url(#c${clipId})`}>
          <rect x={x0} y={y0} width={w} height={h} className="skj-map__sea" />
          <path d={EU_PATH} className="skj-map__land" vectorEffect="non-scaling-stroke" />
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
                  {s.city}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </figure>
  );
}

/* --------------------------------------------------------------------------
   THE TOUR CARD
   -------------------------------------------------------------------------- */
function TourCard({ tour, selectedDep, onSelectDep, onItinerary }) {
  const live = tour.deps.filter((d) => !d.soldOut);
  const chosen = tour.deps.find((d) => d.id === selectedDep) || live[0];
  /* 27 to 92 departures per package: one month at a time, picked from a
     dropdown (v2) rather than a second row of chips. */
  const months = [...new Set(tour.deps.map((d) => d.month))];
  const [month, setMonth] = useState(chosen.month);
  const shown = tour.deps.filter((d) => d.month === month);
  const monthName = (m) => {
    const d = tour.deps.find((x) => x.month === m);
    return new Date(`${d.iso}T00:00:00`).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  };
  const nights = tour.hotels.reduce((a, h) => a + h.nights, 0);
  const dayTrips = tour.stops.filter((x) => !x.nights).map((x) => x.city);

  /* v2, calmer: photo + name, one map panel (city names only, one quiet
     line under it), dates, then price + EMI and the two CTAs. The blurb,
     map nights, caption chips and per-chip seat counts are gone; the popup
     carries the full detail. */
  return (
    <article className={`skj-tour eu2-tc${tour.featured ? ' is-featured' : ''}`} aria-labelledby={`${tour.id}-h`}>
      <div className="skj-tour__media">
        <img src={img(tour.image, 900)} alt={tour.alt} loading="lazy" width="900" height="600" />
        <span className="skj-tour__tag">{tour.tag}</span>
        <div className="skj-tour__title">
          <h3 id={`${tour.id}-h`} className="skj-tour__name">{tour.name}</h3>
          <span className="skj-tour__nd">{tour.nd}</span>
        </div>
      </div>

      <div className="skj-tour__body">
        <div className="eu2-trip">
          <RouteMap tour={tour} />
          <p className="eu2-trip__info">
            <BedDouble size={14} aria-hidden="true" />
            <span><b>{nights} nights</b> in {tour.hotels.length} hotels{dayTrips.length > 0 && <> · day trip{dayTrips.length > 1 ? 's' : ''} to {dayTrips.join(', ')}</>}</span>
          </p>
        </div>

        <div className="skj-tour__dates">
          <div className="eu2-dates__head">
            <p className="skj-tour__label" id={`${tour.id}-dl`}><CalendarDays size={14} aria-hidden="true" /> Departures</p>
            <label className="eu2-monthsel">
              <span className="v2-sr">Month</span>
              <select value={month} onChange={(e) => {
                const m = e.target.value;
                setMonth(m);
                onSelectDep(tour.id, live.find((d) => d.month === m).id);
              }}>
                {months.map((m) => <option key={m} value={m}>{monthName(m)}</option>)}
              </select>
              <ChevronDown size={14} aria-hidden="true" />
            </label>
          </div>
          <div className="skj-dates" role="radiogroup" aria-labelledby={`${tour.id}-dl`}>
            {shown.map((d) => {
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
                </button>
              );
            })}
          </div>
          {chosen && <p className="eu2-seats" aria-live="polite"><b>{chosen.seats} seats left</b> on {chosen.label.replace(/ \d{4}$/, '')}</p>}
        </div>

        <div className="skj-tour__buy eu2-buy">
          <div className="skj-tour__price">
            <p className="eu2-pk">Per person, twin sharing</p>
            <PriceEmi tour={tour} />
            <p className="v3-pe__fine">{EMI_FINE_SHORT}</p>
          </div>
          <div className="skj-tour__ctas">
            <button type="button" className="skj-btn skj-btn--primary" onClick={() => onItinerary(tour.id)}
              aria-label={`${CTA.pkg}: ${tour.name}`}>
              {CTA.pkg} <ArrowRight size={16} aria-hidden="true" />
            </button>
            <a className="skj-btn skj-btn--wa skj-btn--icon" href={waLink(`Hi Cox & Kings, I'm interested in ${tour.name} (${chosen?.label}). Can you help?`)}
              target="_blank" rel="noopener noreferrer" aria-label={`${CTA.expert} about ${tour.name} on WhatsApp`} title={CTA.expert}>
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

function ItineraryBody({ tour }) {
  const days = ITINERARIES[tour.id] || [];
  return (
    <div className="skj-itin">
      <dl className="skj-itin__facts">
        <div>
          <dt><Plane size={15} aria-hidden="true" /> Flights</dt>
          <dd>{tour.flights.out}<br />{tour.flights.back}</dd>
        </div>
        <div>
          <dt><Hotel size={15} aria-hidden="true" /> Hotels</dt>
          <dd>
            <ul>
              {tour.hotels.map((h) => (
                <li key={h.city}><b>{h.name}</b> <span>{h.city}, {h.nights} night{h.nights > 1 ? 's' : ''}</span></li>
              ))}
            </ul>
          </dd>
        </div>
        <div>
          <dt><UtensilsCrossed size={15} aria-hidden="true" /> Meals</dt>
          <dd>Daily breakfast, with Indian lunches and dinners as listed below. Packed meals on some days.</dd>
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
                {d.stay && <li><BedDouble size={14} aria-hidden="true" /> {d.stay}</li>}
                <li><UtensilsCrossed size={14} aria-hidden="true" /> {d.meals.join(', ')}</li>
              </ul>
            </div>
          </li>
        ))}
      </ol>

      <div className="eu-incl">
        <div>
          <h4 className="eu-incl__h">Inclusions</h4>
          <ul className="eu-incl__list">
            {tour.inclusions.map((t) => <li key={t}><Check size={14} aria-hidden="true" /> {t}</li>)}
          </ul>
        </div>
        <div>
          <h4 className="eu-incl__h">Exclusions</h4>
          <ul className="eu-incl__list is-ex">
            {tour.exclusions.map((t) => <li key={t}><X size={14} aria-hidden="true" /> {t}</li>)}
          </ul>
        </div>
      </div>
      <p className="eu-itin-src">Hotels are as named “or similar”. <a href={tour.url} target="_blank" rel="noopener noreferrer">Full package on coxandkings.com</a></p>
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
          <div><PriceEmi tour={tour} /><small>Per person, twin sharing · {EMI_FINE}</small></div>
          <div className="eu-foot-ctas">
            <a className="skj-btn skj-btn--wa" href={waLink(`Hi Cox & Kings, I'd like to talk to an expert about ${tour.name}.`)} target="_blank" rel="noopener noreferrer">
              <WhatsAppGlyph /> {CTA.expert}
            </a>
            <button type="button" className="skj-btn skj-btn--primary" onClick={() => onBook(tour.id)}>
              {CTA.book}
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
  const [tenure, setTenure] = useState(EMI.defaultTenure);
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
  const today = OFFER.booking * n;
  const balance = (onlinePrice - OFFER.booking) * n;

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
            <Eyebrow>Book now</Eyebrow>
            <h2 id="skj-sheet-h" className="skj-sheet__title">Book at {inr(OFFER.booking)} each</h2>
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
          <div className="is-save"><dt>Early-bird discount <small>online, till {OFFER.earlyBy}</small></dt><dd>−{inr(OFFER.onlineDiscount * n)}</dd></div>
          <div className="is-today"><dt>Booking amount, pay today</dt><dd>{inr(today)}</dd></div>
          <div><dt>Balance, after visa approval</dt><dd>{inr(balance)}</dd></div>
        </dl>

        <fieldset className="v2-sheet-emi">
          <legend><Wallet size={15} aria-hidden="true" /> Or pay the balance in EMIs</legend>
          <div className="v2-tenures" role="radiogroup" aria-label="EMI tenure">
            {EMI.tenures.map((m) => (
              <button key={m} type="button" role="radio" aria-checked={tenure === m}
                className={`v2-tenure${tenure === m ? ' is-on' : ''}`} onClick={() => setTenure(m)}>
                {m} months
              </button>
            ))}
          </div>
          <p className="v2-sheet-emi__amt"><b>{inr(Math.ceil(balance / tenure / 100) * 100)}</b> a month for {tenure} months <small>for {n} traveller{n > 1 ? 's' : ''}, indicative, before interest</small></p>
        </fieldset>

        <details className="skj-sheet__itin">
          <summary><ScrollText size={16} aria-hidden="true" /> Day-by-day itinerary, hotels and meals</summary>
          <ItineraryBody tour={tour} />
        </details>

        <p className="skj-sheet__note">
          <Info size={16} aria-hidden="true" />
          <span>
            The booking amount is <b>non-refundable</b>: it covers reservation commitments, insurance and visa appointments.
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


/* --------------------------------------------------------------------------
   EMI PLANS (v2, as Japan v3) — under "How booking works". One table: every
   tenure for all four packages. ⚠ Placeholder maths (EMI in europe/data.js).
   -------------------------------------------------------------------------- */
const tourShort = (t) => t.name.replace(/ Summer 2027$/, '').replace(/^The /, '');

function EmiPlans() {
  return (
    <section className="v3-emi" aria-labelledby="eu2-emi-h">
      <div className="v3-emi__inner">
        <div className="v3-emi__copy" data-rise>
          <Eyebrow>Easy EMIs</Eyebrow>
          <h2 id="eu2-emi-h" className="skj-h2">Europe now. <em>Pay monthly.</em></h2>
          <p className="skj-lead">Book with {inr(OFFER.booking)}. Once your visa is approved, pay the balance in one go or spread it over {TENURES_TXT} months.</p>
          <ul className="v3-emi__points">
            <li><Check size={15} strokeWidth={2.6} aria-hidden="true" /> EMIs start only after your visa is approved</li>
            <li><Check size={15} strokeWidth={2.6} aria-hidden="true" /> Your expert checks eligibility with you on WhatsApp</li>
          </ul>
          <a className="skj-btn skj-btn--wa" href={waLink("Hi Cox & Kings, I'd like to talk to an expert about EMI plans for the Europe summer 2027 tours.")}
            target="_blank" rel="noopener noreferrer">
            <WhatsAppGlyph /> {CTA.expert}
          </a>
        </div>

        <div className="v3-emi__card" data-rise>
          <div className="eu2-emi__scroll" tabIndex={0} role="region" aria-label="EMI plans per person, for each package">
            <table className="v3-emi__table">
              <caption className="v2-sr">EMI plans per person, for each package</caption>
              <thead>
                <tr>
                  <th scope="col">Per person</th>
                  {TOURS.map((t) => (
                    <th key={t.id} scope="col">{tourShort(t)}<small>{inr(t.price)}</small></th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="is-today">
                  <th scope="row">Booking amount today</th>
                  {TOURS.map((t) => <td key={t.id}>{inr(OFFER.booking)}</td>)}
                </tr>
                <tr className="is-bal">
                  <th scope="row">Balance, after your visa</th>
                  {TOURS.map((t) => <td key={t.id}>{inr(balanceOf(t))}</td>)}
                </tr>
                {EMI.tenures.map((m) => (
                  <tr key={m} className={m === MAX_TENURE ? 'is-low' : ''}>
                    <th scope="row">{m}-month plan{m === MAX_TENURE && <span className="v3-emi__tag">Lowest monthly</span>}</th>
                    {TOURS.map((t) => (
                      <td key={t.id}><b>{inr(emiFor(t, m))}</b><small>/month</small></td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="v3-emi__fine">Balance is after the {TEN_K} early-bird discount (online, till {OFFER.earlyBy}). {EMI.note}</p>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   THE PAGE
   ========================================================================== */
export default function EuropeEarlyBookingV2() {
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

  const scrollToTours = (e) => {
    e?.preventDefault();
    const el = document.getElementById('tours');
    if (!el) return;
    const navH = document.querySelector('.skj-nav')?.offsetHeight || 64;
    const y = el.getBoundingClientRect().top + window.scrollY - navH + 1;
    window.scrollTo({ top: y, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };

  /* Nav goes solid after the hero's top band; sticky bar watches the hero CTAs
     and the final band (PM note 4). */
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
    /* Each tour card carries its own two CTAs, so the bar steps aside while
       the tours own the middle of the screen — never two asks stacked. */
    const toursEl = document.getElementById('tours');
    const ioTours = new IntersectionObserver(([e]) => setToursIn(e.isIntersecting), { rootMargin: '-35% 0px -35% 0px' });
    if (toursEl) ioTours.observe(toursEl);
    if (heroCtas.current) io.observe(heroCtas.current);
    if (finalBand.current) io.observe(finalBand.current);
    return () => { window.removeEventListener('scroll', onScroll); io.disconnect(); ioTours.disconnect(); };
  }, []);

  const showSticky = heroGone && !finalIn && !toursIn && !sheet.open && !itinId;

  /* ---- GSAP ---------------------------------------------------------- */
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

          /* 1 · Hero entrance + parallax out */
          gsap.fromTo('[data-hero-in]', { y: 26, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.09, delay: 0.15 });
          gsap.fromTo('.skj-hero__img', { scale: 1.12 }, { scale: 1, duration: 2.2, ease: 'power2.out' });
          gsap.to('.skj-hero__imgwrap', {
            yPercent: 18, ease: 'none',
            scrollTrigger: { trigger: '.skj-hero', start: 'top top', end: 'bottom top', scrub: true },
          });
          gsap.to('.skj-hero__title', {
            yPercent: -30, ease: 'none',
            scrollTrigger: { trigger: '.skj-hero', start: 'top top', end: 'bottom top', scrub: true },
          });

          /* 2 · One price — no pin, no scrub, no per-item choreography (PM
             review: keep it normal). The card fades up once as it arrives. */
          gsap.fromTo('.skj-price__copy, .skj-ticket', { opacity: 0, y: 24 }, {
            opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.12,
            scrollTrigger: { trigger: '.skj-price', start: 'top 80%', once: true },
          });

          /* Booking steps + heritage timeline — a line fills as you scroll and
             each node switches on as the line reaches it. */
          [['.skj-steps', '.skj-step']].forEach(([wrap, item]) => {
            const nodes = gsap.utils.toArray(item);
            if (!nodes.length) return;
            gsap.fromTo(wrap, { '--prog': 0 }, {
              '--prog': 1, ease: 'none',
              scrollTrigger: {
                trigger: wrap, start: 'top 80%', end: 'bottom 60%', scrub: 0.4,
                onUpdate: (st) => nodes.forEach((n, i) => n.classList.toggle('is-on', st.progress >= i / Math.max(1, nodes.length - 1) - 0.02)),
              },
            });
          });

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

          /* Generic rise for everything marked data-rise */
          ScrollTrigger.batch('[data-rise]', {
            start: 'top 88%',
            once: true,
            onEnter: (els) => gsap.fromTo(els, { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.08, overwrite: true }),
          });
          // Hide the not-yet-entered ones without a flash; batch reveals them.
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
    <div className={`skj eu eu2${showSticky ? ' has-sticky' : ''}`} ref={root}>
      <a className="skj-skip" href="#tours" onClick={scrollToTours}>Skip to the tours</a>

      {/* ------------------------------------------------ NAV */}
      <header className={`skj-nav${solid ? ' is-solid' : ''}`}>
        <Link to="/" className="skj-nav__brand" aria-label="Cox & Kings home">
          <img src="/cox-logo-new.png" alt="Cox & Kings" width="120" height="46" />
        </Link>
        <button type="button" className={`skj-btn skj-btn--nav${showSticky ? ' is-ducked' : ''}`} onClick={() => openBook()}>
          <span className="skj-only-wide">Book early &amp; save {inr(OFFER.onlineDiscount)}</span>
          <span className="skj-only-narrow">Book early, save {inr(OFFER.onlineDiscount).replace(',000', 'k')}</span>
        </button>
      </header>

      <main>
        {/* ------------------------------------------------ 1 HERO */}
        <section className="skj-hero" aria-labelledby="skj-hero-h">
          <div className="skj-hero__imgwrap" aria-hidden="true">
            <img className="skj-hero__img" src={img(HERO_IMG, 2000)} alt="" fetchpriority="high" />
          </div>
          <div className="skj-hero__veil" aria-hidden="true" />

          <div className="skj-hero__copy">
            <p className="skj-hero__eyebrow" data-hero-in>
              <span>Summer 2027</span><i aria-hidden="true" /> <span>Early booking</span>
            </p>
            <h1 id="skj-hero-h" className="skj-hero__title" data-hero-in>
              Europe,<br className="skj-br" /> <em>booked early.</em>
            </h1>
            <p className="skj-hero__sub" data-hero-in>
              Expertly crafted holidays. Flights, hotels, Indian meals, sightseeing and visa assistance, all in one price.
            </p>
            <div className="skj-hero__ctas" ref={heroCtas} data-hero-in>
              <a className="skj-btn skj-btn--primary" href="#tours" onClick={scrollToTours}>
                {CTA.explore} <ArrowDown size={16} aria-hidden="true" />
              </a>
              <a className="skj-btn skj-btn--ghost" href={waLink('Hi Cox & Kings, I’d like to talk to an expert about the Europe summer 2027 tours.')}
                target="_blank" rel="noopener noreferrer">
                <WhatsAppGlyph /> {CTA.expert}
              </a>
            </div>
            {/* v2: the booking amount as a plain price note under the buttons
                (as Japan v3): no pill, no fill, so it can't read as a third CTA. */}
            <p className="eu2-hero-dep" data-hero-in>
              <span className="eu2-hero-dep__k">Early-bird booking</span>
              <span className="eu2-hero-dep__v"><b>{inr(OFFER.booking)}</b> <small>per person to book · pay the rest after your visa, in full or in EMIs</small></span>
            </p>
          </div>
        </section>

        {/* ------------------------------------------------ 2 ONE PRICE
            Straight after the hero: the strongest proof of "everything taken
            care of" is the list of what the price already covers. */}
        <section className="skj-price" aria-labelledby="skj-price-h">
          <div className="skj-price__inner">
            <div className="skj-price__copy">
              <Eyebrow>Truly all-inclusive</Eyebrow>
              <h2 id="skj-price-h" className="skj-h2">One price. <em>No surprises.</em></h2>
              <p className="skj-lead">Fixed in rupees the day you book. Nothing extra to spend on anything included.</p>
            </div>

            <div className="skj-ticket">
              <div className="skj-ticket__top">
                <div>
                  <span className="skj-ticket__lbl">From, per person</span>
                  <PriceEmi tour={CHEAPEST} className="v3-pe--ticket" />
                  <span className="skj-ticket__sub">Book at {inr(OFFER.booking)}, pay the balance after your visa · {EMI_FINE} · {TEN_K} early-bird discount online till {OFFER.earlyBy}</span>
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
              <p className="eu-notinc"><b>Not included:</b> {NOT_INCLUDED}</p>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------ 3 TOURS, straight after One price */}
        <section className="skj-tours" id="tours" aria-labelledby="skj-tours-h">
          <div className="skj-sechead">
            <div>
              <Eyebrow>Four ways to see Europe</Eyebrow>
              <h2 id="skj-tours-h" className="skj-h2">Choose your <em>summer</em></h2>
              <p className="skj-sub">Per person on twin sharing, flying from seven Indian cities. Book online before {OFFER.earlyBy} and {inr(OFFER.onlineDiscount)} comes off.</p>
            </div>
            <RowControls row={toursRow} label="tour" />
          </div>
          <div className="skj-row skj-tours__row" ref={toursRow.ref}>
            {TOURS.map((t) => (
              <TourCard key={t.id} tour={t} selectedDep={picked[t.id]} onSelectDep={selectDep} onItinerary={setItinId} />
            ))}
          </div>
        </section>

        {/* ------------------------------------------------ 4 REVIEWS, after the tours; the same pattern as the
            homepage review strip: one rating bar, then photo cards. */}
        <section className="skj-reviews" aria-labelledby="skj-rev-h">
          <div className="skj-reviews__head">
            <Eyebrow>Travelled, and came back happy</Eyebrow>
            <h2 id="skj-rev-h" className="skj-h2">Travellers who trusted us <em>with Europe</em></h2>
          </div>
          <div className="skj-rtrust">
            <p className="skj-rtrust__all">
              <strong>{RATING.overall}</strong>
              <span><Stars /><small>Excellent · {RATING.count} verified reviews</small></span>
            </p>
            <span className="skj-rtrust__div" aria-hidden="true" />
            <p className="skj-rtrust__plat"><GoogleG /><span><b>{RATING.google}</b> on Google</span></p>
            <p className="skj-rtrust__plat"><TripAdvisorOwl /><span><b>{RATING.tripadvisor}</b> on Tripadvisor</span></p>
          </div>
          {/* Desktop: a slow, endless marquee (pauses on hover/focus). The list is
              doubled so the loop is seamless; the copy is hidden from screen readers. */}
          <div className="skj-marquee">
            <ul className="skj-marquee__track">
              {REVIEWS.map((r) => <ReviewCard key={r.name} r={r} />)}
              {REVIEWS.map((r) => <ReviewCard key={`${r.name}-2`} r={r} hidden />)}
            </ul>
          </div>
          {/* Phones (and reduced motion): a snap carousel with dots. */}
          <ul className="skj-row skj-reviews__row" ref={reviewsRow.ref}>
            {REVIEWS.map((r) => <ReviewCard key={r.name} r={r} />)}
          </ul>
          <Dots row={reviewsRow} label="Review" />
        </section>

        {/* ------------------------------------------------ 5 HOW BOOKING WORKS — answers "what happens after I pay?" right after the tours */}
        <section className="skj-book" aria-labelledby="skj-book-h">
          <Eyebrow>Book early, save {inr(OFFER.onlineDiscount)}</Eyebrow>
          <h2 id="skj-book-h" className="skj-h2">Book at just <em>{inr(OFFER.booking)}</em></h2>
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
            <p><Info size={16} aria-hidden="true" /><span>The booking amount is non-refundable. Terms and conditions apply.</span></p>
          </div>
        </section>

        {/* ------------------------------------------------ 5b EMI PLANS (v2, as Japan v3) */}
        <EmiPlans />

        {/* ------------------------------------------------ 6 THE PROMISE (white). A seal and four
            lines; the price, booking, refund and heritage points each have their own section. */}
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

        {/* ------------------------------------------------ 7 HERITAGE (cream). Story + stats beside a
            photo with a floating card, then the four awards on one white panel.
            Every fact here is already printed elsewhere on the site. */}
        <section className="skj-heritage" aria-labelledby="skj-her-h">
          <div className="skj-heritage__grid">
            <div className="skj-heritage__story" data-rise>
              <Eyebrow>Our heritage</Eyebrow>
              <h2 id="skj-her-h" className="skj-h2">Trusted since 1758. <em>Best price, guaranteed.</em></h2>
              <p className="skj-heritage__p">
                260+ years of looking after travellers, now backed by Wilson &amp; Hughes and
                renewed for exceptional holidays, at the best price for every tour on this page.
              </p>
              <dl className="skj-heritage__stats">
                {HERITAGE_STATS.map(({ k, t }) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{t}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <figure className="skj-heritage__visual" data-rise>
              <img className="skj-heritage__photo" src={HERITAGE_PHOTO} alt="The pastel houses of Manarola, Cinque Terre, stacked above the sea" loading="lazy" />
              <figcaption className="skj-heritage__card">
                <p className="skj-heritage__card-k">Your people</p>
                <p className="skj-heritage__card-t">People who know the way</p>
                <p className="skj-heritage__card-b">A Europe specialist plans the trip with you. A tour manager travels it with you.</p>
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

        {/* ------------------------------------------------ 8 FINAL CTA — a photograph band,
            the page's last dark moment. Hours are the pre-seller roster from the
            strategy deck (9 a.m.–8 p.m.); the WhatsApp bot covers the rest. */}
        <section className="skj-final" ref={finalBand} aria-labelledby="skj-final-h">
          <img className="skj-final__img" src={img(FINAL_IMG, 2000)} alt="" loading="lazy" aria-hidden="true" />
          <div className="skj-final__inner">
            <Eyebrow light>Talk to us</Eyebrow>
            <h2 id="skj-final-h" className="skj-h2 is-light">The best seats go early. <br className="skj-br-wide" /><em>So does the best price.</em></h2>
            <p className="skj-final__sub">Ask a Europe specialist anything on WhatsApp, or book online at {inr(OFFER.booking)} and pay the rest after your visa, in full or in EMIs. The early-bird price ends {OFFER.earlyBy}.</p>
            <div className="skj-final__ctas">
              <button type="button" className="skj-btn skj-btn--primary" onClick={() => openBook()}>
                Book now · {inr(OFFER.booking)}
              </button>
              <a className="skj-btn skj-btn--ghost" href={waLink('Hi Cox & Kings, I have a question about the Europe summer 2027 tours.')} target="_blank" rel="noopener noreferrer">
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
          <b>{inr(OFFER.booking)} <small>to book</small></b>
          <span>Tours from {inr(CHEAPEST.price)} or {inr(emiFor(CHEAPEST, MAX_TENURE))}/month</span>
        </div>
        <button type="button" className="skj-btn skj-btn--primary" onClick={() => openBook()} tabIndex={showSticky ? 0 : -1}>
          Book now
        </button>
        <a className="skj-btn skj-btn--wa skj-btn--icon" href={waLink('Hi Cox & Kings, I’d like to know more about the Europe summer 2027 tours.')}
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
