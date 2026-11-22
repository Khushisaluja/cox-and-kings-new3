/* ============================================================================
   Cox & Kings — Japan in Full Bloom  (route: /japan-cherry-blossom)

   A campaign lander for the spring 2027 Japan group departures. Ad traffic
   only: it is not in the site nav, and it does not wear the shared SiteNav —
   just the crest and one CTA, like /franchise-v2.

   THE SHAPE OF THE PAGE (the brief: 70% value proposition, 30% tours; less
   scroll, more swipe; two CTAs everywhere — Deposit & Book, and WhatsApp).
   Round 2 (PM review): the Promise statement and the tall Kyoto photo are
   gone, One price moved up behind the hero, booking went neutral and the
   reviews took the dark band, tour cards halved in height on phones,
   heritage became a timeline.

     1  Hero              both CTAs inside the first fold on a 390×660 phone
     2  One price         what the price covers               (light)
     3  Tours             choose: map, dates, seats, CTAs     (light)
     4  Reviews           rating bar + photo cards            (light)
     5  How booking works what happens after I pay           (white)
     6  The Promise       seal + four lines                   (white)
     7  Heritage          story, photo, facts, awards         (cream)
     8  Final CTA         photograph band + hours             (dark)

   Round 3 removed every repeat: the "Unhurried" section (it is promise card
   1), the meals strip (card 2), and the promise cards that restated One
   price, the deposit, the refund and the heritage — each has its own section.

   MOTION. GSAP ScrollTrigger, Apple-product-page style, through
   gsap.matchMedia so phones and desktops get different choreography:
     · Nothing pins. Sections reveal once as they arrive (One price fades up).
     · <900px: nothing pins (pinning on touch is fragile and costs scroll —
       the brief asks for less of it); the same reveals run as you pass.
     · prefers-reduced-motion: no scroll animation at all; every element is
       visible by default in CSS, GSAP only ever animates FROM a hidden state
       it sets itself (fromTo — see the React double-mount note in memory).

   STICKY CTA BAR (PM note 4) shows only once the hero's own CTAs have
   scrolled off the top, and hides again over the tours and the final band, so two CTA
   bars are never on screen together.

   Everything editable (offer, tours, dates, reviews) is in ./sakura/data.js.
   Every rule in SakuraJapan.css is scoped to `.skj`.
   ========================================================================== */

import { useState, useRef, useEffect, useLayoutEffect, useCallback, useMemo, useId } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight, ArrowDown, Check, X, Star, Minus, Plus, Route, Receipt, Hotel, Wallet,
  ShieldCheck, Headset, ClipboardList, Landmark, ChevronLeft, ChevronRight,
  Clock, BedDouble, Footprints, FileCheck2, Plane, Info, CalendarDays, PhoneCall,
  UtensilsCrossed, CarFront, TrainFront, Bus, Camera, Sparkles, Ticket, ShieldPlus, CreditCard, ScrollText,
} from 'lucide-react';
import {
  OFFER, TOURS, INCLUDED, NEVER, REVIEWS, RATING, AWARDS, ITINERARIES, HOTELS, FLIGHTS, PAYMENT_URL, PHONE, EMAIL, inr, waLink, img,
} from './sakura/data';
import { JP_PATH, JP_CITIES } from './sakura/japanMap';
import './SakuraJapan.css';

gsap.registerPlugin(ScrollTrigger);

const HERO_IMG = '1490806843957-31f4c9a91c65';
/* Meguro river at night under lit blossom — dark enough to carry white type. */
const FINAL_IMG = '1524413840807-0c3cb6fa808d';

/* One icon per inclusion, in data.js INCLUDED order. */
const INC_ICONS = [Plane, Hotel, UtensilsCrossed, CarFront, TrainFront, Bus, Camera, Sparkles, Ticket, FileCheck2, ShieldPlus, Receipt, CreditCard];

const PROMISES = [
  { icon: Route, t: 'Crafted, unhurried journeys', b: 'Must-sees and meaningful experiences, with fewer hotel changes and less time on the road.' },
  { icon: Hotel, t: 'Hotels & meals assured', b: 'Hotels named before you book, never substituted. Three meals a day: Indian, vegetarian & Jain.' },
  { icon: Headset, t: 'A tour manager, start to finish', b: 'Hindi & English help from booking to homecoming, pre-departure briefings and a WhatsApp group.' },
  { icon: ClipboardList, t: 'Every detail upfront', b: 'Daily itinerary, flights and hotels in writing. No compulsory shopping stops, and birthdays celebrated.' },
];
const STEPS = [
  { t: `Pay ${inr(OFFER.depositOnline)} online`, b: `${inr(OFFER.onlineDiscount)} less than booking offline` },
  { t: 'We file your visa', b: 'Appointment booked for you' },
  { t: 'Visa approved', b: 'Only then is the balance due' },
  { t: 'Fly to Japan', b: 'Briefing first, then the blossom' },
];

/* Heritage facts — each one is already printed elsewhere on the site
   (dispatches.js, v3content.js, terms.js, /testimonials). Nothing new here. */
/* Heritage side photo: travellers on a group journey. The card's person is
   the site's existing Japan travel-designer profile (Luxe2Improved DESIGNER).
   ⚠ PLACEHOLDER: swap both for a real Cox & Kings tour manager or specialist
   (photo + name + tenure) before launch. */
const HERITAGE_PHOTO = '/sakura/heritage-chureito-flip.jpg'; // Chureito pagoda + Mt Fuji at sunrise (user-supplied)
const SPECIALIST = { name: 'Aanya Kapoor', role: 'Japan specialist · 12 years with us', photo: '/aanya-kapoor.jpg' };

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
   THE ROUTE MAP — Japan from Natural Earth (sakura/japanMap.js), cropped to
   each tour's own stops so a 300px card still reads as a route, not a dot on
   an archipelago. Day-trip stops (0 nights) are hollow.
   -------------------------------------------------------------------------- */
const LABEL_POS = {
  Tokyo: [1, 0.35, 'start'],
  Kawaguchiko: [-1, -0.6, 'end'],
  Hakone: [0.2, 1.5, 'middle'],
  Kyoto: [0.9, -0.45, 'start'],
  Nara: [0.9, 1.0, 'start'],
  Osaka: [-1, 0.35, 'end'],
  Takayama: [0.9, 0.9, 'start'],
  'Shirakawa-go': [0.9, -0.2, 'start'],
  Kanazawa: [-1, 0, 'end'],
  Hiroshima: [0, 1.5, 'middle'],
  Nagoya: [0.9, 0.35, 'start'],
};

function RouteMap({ tour }) {
  const clipId = useId().replace(/:/g, '');
  const pts = tour.stops.map((s) => ({ ...s, p: JP_CITIES[s.city] }));
  const xs = pts.map((s) => s.p[0]);
  const ys = pts.map((s) => s.p[1]);
  let x0 = Math.min(...xs); let x1 = Math.max(...xs);
  let y0 = Math.min(...ys); let y1 = Math.max(...ys);
  const padX = 52; const padY = 30;
  x0 -= padX; x1 += padX; y0 -= padY; y1 += padY;
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
          <path d={JP_PATH} className="skj-map__land" vectorEffect="non-scaling-stroke" />
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
          <dd>{FLIGHTS.out}<br />{FLIGHTS.back}</dd>
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
          <button type="button" className="skj-btn skj-btn--primary" onClick={() => onBook(tour.id)}>
            Deposit &amp; book<span className="skj-only-wide">&nbsp;· {inr(OFFER.depositOnline)}</span>
          </button>
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
          <div className="is-save"><dt>Online booking discount</dt><dd>−{inr(OFFER.onlineDiscount * n)}</dd></div>
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

/* --------------------------------------------------------------------------
   Falling petals in the hero — a small canvas, paused off-screen and absent
   entirely under reduced motion.
   -------------------------------------------------------------------------- */
function PetalCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const ctx = cv.getContext('2d');
    let w = 0; let h = 0; let raf = 0; let on = true;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => {
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const count = w < 600 ? 16 : 30;
    const P = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: Math.random() * h - h,
      s: 5 + Math.random() * 7, vy: 0.35 + Math.random() * 0.7, vx: -0.2 - Math.random() * 0.5,
      r: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.03, sw: Math.random() * 6.28,
      c: Math.random() > 0.35 ? '242,217,207' : '255,255,255', a: 0.55 + Math.random() * 0.4,
    }));
    const draw = () => {
      raf = 0;
      if (!on) return;
      ctx.clearRect(0, 0, w, h);
      P.forEach((p) => {
        p.sw += 0.012; p.y += p.vy; p.x += p.vx + Math.sin(p.sw) * 0.5; p.r += p.vr;
        if (p.y > h + 20 || p.x < -20) { p.y = -20; p.x = Math.random() * w * 1.2; }
        ctx.save();
        ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.scale(1, 0.62 + Math.sin(p.sw * 2) * 0.25);
        ctx.fillStyle = `rgba(${p.c},${p.a})`;
        ctx.beginPath();
        ctx.moveTo(0, -p.s);
        ctx.bezierCurveTo(p.s, -p.s * 0.4, p.s * 0.8, p.s * 0.7, 0, p.s);
        ctx.bezierCurveTo(-p.s * 0.8, p.s * 0.7, -p.s, -p.s * 0.4, 0, -p.s);
        ctx.fill();
        ctx.restore();
      });
      raf = requestAnimationFrame(draw);
    };
    const io = new IntersectionObserver(([e]) => {
      on = e.isIntersecting;
      if (on && !raf) raf = requestAnimationFrame(draw);
    });
    io.observe(cv);
    window.addEventListener('resize', resize);
    raf = requestAnimationFrame(draw);
    return () => {
      on = false; io.disconnect(); window.removeEventListener('resize', resize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return <canvas ref={ref} className="skj-hero__petals" aria-hidden="true" />;
}

/* ==========================================================================
   THE PAGE
   ========================================================================== */
export default function SakuraJapan() {
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
    <div className={`skj${showSticky ? ' has-sticky' : ''}`} ref={root}>
      <a className="skj-skip" href="#tours" onClick={scrollToTours}>Skip to the tours</a>

      {/* ------------------------------------------------ NAV */}
      <header className={`skj-nav${solid ? ' is-solid' : ''}`}>
        <Link to="/" className="skj-nav__brand" aria-label="Cox & Kings home">
          <img src="/cox-logo-new.png" alt="Cox & Kings" width="120" height="46" />
        </Link>
        <button type="button" className={`skj-btn skj-btn--nav${showSticky ? ' is-ducked' : ''}`} onClick={() => openBook()}>
          <span className="skj-only-wide">Book online &amp; save {inr(OFFER.onlineDiscount)}</span>
          <span className="skj-only-narrow">Book &amp; save {inr(OFFER.onlineDiscount).replace(',000', 'k')}</span>
        </button>
      </header>

      <main>
        {/* ------------------------------------------------ 1 HERO */}
        <section className="skj-hero" aria-labelledby="skj-hero-h">
          <div className="skj-hero__imgwrap" aria-hidden="true">
            <img className="skj-hero__img" src={img(HERO_IMG, 2000)} alt="" fetchpriority="high" />
          </div>
          <div className="skj-hero__veil" aria-hidden="true" />
          <PetalCanvas />

          <div className="skj-hero__copy">
            <p className="skj-hero__eyebrow" data-hero-in>
              <span>Cherry blossom 2027</span><i aria-hidden="true" /> <span>Group tours</span>
            </p>
            <h1 id="skj-hero-h" className="skj-hero__title" data-hero-in>
              Japan,<br className="skj-br" /> <em>in full bloom.</em>
            </h1>
            <p className="skj-hero__sub" data-hero-in>
              Expertly crafted holidays. Everything taken care of: flights, 4-star hotels, every meal, your visa.
            </p>
            <p className="skj-hero__offer" data-hero-in>
              <span className="skj-hero__offer-tag">Book online</span>
              <span>Pay <b>{inr(OFFER.depositOnline)}</b> <s>{inr(OFFER.depositOffline)}</s> today · balance after visa</span>
            </p>
            <div className="skj-hero__ctas" ref={heroCtas} data-hero-in>
              <a className="skj-btn skj-btn--primary" href="#tours" onClick={scrollToTours}>
                Explore tours <ArrowDown size={16} aria-hidden="true" />
              </a>
              <a className="skj-btn skj-btn--ghost" href={waLink('Hi Cox & Kings, I’d like to talk to an expert about the Japan cherry blossom tours.')}
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

        {/* ------------------------------------------------ 3 TOURS, straight after One price */}
        <section className="skj-tours" id="tours" aria-labelledby="skj-tours-h">
          <div className="skj-sechead">
            <div>
              <Eyebrow>Three ways to see the blossom</Eyebrow>
              <h2 id="skj-tours-h" className="skj-h2">Choose your <em>spring</em></h2>
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

        {/* ------------------------------------------------ 4 REVIEWS, after the tours; the same pattern as the
            homepage review strip: one rating bar, then photo cards. */}
        <section className="skj-reviews" aria-labelledby="skj-rev-h">
          <div className="skj-reviews__head">
            <Eyebrow>Travelled, and came back happy</Eyebrow>
            <h2 id="skj-rev-h" className="skj-h2">Travellers who trusted us <em>with Japan</em></h2>
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
            <p><Info size={16} aria-hidden="true" /><span>The deposit is non-refundable. It covers reservation commitments, insurance and visa appointments.</span></p>
          </div>
        </section>

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
              <img className="skj-heritage__photo" src={HERITAGE_PHOTO} alt="The Chureito pagoda above Fujiyoshida, with Mt Fuji at sunrise and cherry trees below" loading="lazy" />
              <figcaption className="skj-heritage__card">
                <p className="skj-heritage__card-k">Your people</p>
                <p className="skj-heritage__card-t">People who know the way</p>
                <p className="skj-heritage__card-b">A Japan specialist plans the trip with you. A tour manager travels it with you.</p>
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
            <h2 id="skj-final-h" className="skj-h2 is-light">The blossom won’t wait. <br className="skj-br-wide" /><em>Neither do April’s seats.</em></h2>
            <p className="skj-final__sub">Ask a Japan specialist anything on WhatsApp, or hold your seats online for {inr(OFFER.depositOnline)}, {inr(OFFER.onlineDiscount)} less than booking offline.</p>
            <div className="skj-final__ctas">
              <button type="button" className="skj-btn skj-btn--primary" onClick={() => openBook()}>
                Deposit &amp; book · {inr(OFFER.depositOnline)}
              </button>
              <a className="skj-btn skj-btn--ghost" href={waLink('Hi Cox & Kings, I have a question about the Japan cherry blossom tours.')} target="_blank" rel="noopener noreferrer">
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
        <a className="skj-btn skj-btn--wa skj-btn--icon" href={waLink('Hi Cox & Kings, I’d like to know more about the Japan cherry blossom tours.')}
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
