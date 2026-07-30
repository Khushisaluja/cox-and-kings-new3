/* ============================================================================
   Cox & Kings — TESTIMONIALS  (route: /testimonials, alias /reviews)

   Built on the SAME system as the /new3 homepage — not a page of its own
   invention. It renders inside `.lx2i`, so it inherits that system's tokens
   and primitives directly: the ken-burns photographic hero (`lx2i-hero__bg`
   + `__veil` + `__scroll`, verbatim), `lx2i-container`, `lx2i-eyebrow`,
   `lx2i-h2`, `lx2i-stars`, the `lx2i-btn` family and the `lx2i-cta` closing
   band. `.new-typo` swaps Zodiak for Cormorant Garamond exactly as it does
   on the homepage, and the shared <SiteNav /> + <SiteFooter /> carry the
   chrome. Page-specific rules live under `.tv` in Testimonials.css.

   NOTE ON `.n3`. The root carries `n3`, and New3.css reshapes the lx2i
   primitives by name under it — including `.n3 .lx2i-container`, which is
   deliberately stripped of its 1240px measure because on the homepage the
   SECTION carries the gutter (only .h26-section / .h26-intro / .h26-contact
   / .lx2i-heritage / .lx2i-reviews are in that list). None of this page's
   sections are, so Testimonials.css restores the measure on the container
   itself. Same for eyebrows: `.n3 .lx2i-eyebrow` is sienna, which is
   near-invisible on the two dark bands here, so `.tv` re-tints them to the
   same #F3B9A2 the homepage's reviews band uses.

   ---------------------------------------------------------------------------
   WHY THE CARDS LOOK LIKE THIS. The homepage review wall hides each quote
   behind a hover — fine for six cards you scroll past, wrong for a page
   whose whole job is reading them. So the card is rebuilt for SCANNING:

     photo → stars + the platform it came from → the review's OPENING LINE,
     set large → the rest of it → a signed footer (name, trip, date).

   The large line is not a summary someone wrote: it is the review's own
   first sentence, and `rest` is literally the remainder. Read together they
   are the traveller's text, unedited and unduplicated — which is the only
   honest way to run a pull-quote on a page headed "in their own words".
   ========================================================================== */
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight, ArrowUpRight, BadgeCheck, ChevronDown, Images, Quote, Star, X,
} from 'lucide-react';
import { SmartLink as Link, CALLBACK } from '../components/ScheduleCall';
import { SiteNav, SiteFooter } from '../components/SiteChrome';

import './Home2026.css';
import './Home2026Improved.css';
import './Luxe2Improved.css';   /* the lx2i system this page is built on */
import './NewTypography.css';   /* Cormorant Garamond over Zodiak */
import './New3.css';
import './PressMedia.css';      /* the awards ledger, shared with /press-media */
import './Testimonials.css';    /* last, so .tv wins over .n3's overrides */

gsap.registerPlugin(ScrollTrigger);

const shot = (id, w = 1000) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

/* ------------------------------------------------- the external platforms.
   Every review is attributed to one of these three, and every attribution
   links out to it — the proof lives where we cannot edit it. Google and
   Tripadvisor carry the same scores the homepage prints; they must agree. */
const PLATFORMS = {
  google: {
    name: 'Google', full: 'Google Reviews', rating: '4.8', count: '1,100+ reviews',
    url: 'https://www.google.com/search?q=Cox+%26+Kings+India+reviews',
    note: 'The largest pool, and the hardest to game.',
  },
  tripadvisor: {
    name: 'Tripadvisor', full: 'Tripadvisor', rating: '4.9', count: '860+ reviews',
    url: 'https://www.tripadvisor.in/Search?q=Cox+%26+Kings',
    note: 'Trip by trip, often written mid-journey.',
  },
  trustpilot: {
    name: 'Trustpilot', full: 'Trustpilot', rating: '4.7', count: '450+ reviews',
    url: 'https://www.trustpilot.com/review/coxandkings.com',
    note: 'Service, refunds, and how we handle it going wrong.',
  },
};

/* Brand marks, inline — the same Google G and Tripadvisor owl the homepage
   review strip draws, so the two pages agree down to the logo. */
const GoogleG = ({ size = 14 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true">
    <path fill="#4285F4" d="M47.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h13.2c-.6 3-2.3 5.6-4.9 7.3v6h7.9c4.6-4.3 7.3-10.5 7.3-17.8z" />
    <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.9-6c-2.2 1.5-5 2.3-8 2.3-6.1 0-11.3-4.1-13.2-9.6H2.6v6.2C6.6 42.6 14.6 48 24 48z" />
    <path fill="#FBBC05" d="M10.8 28.9c-.5-1.5-.8-3-.8-4.6s.3-3.1.8-4.6v-6.2H2.6C.9 16.1 0 19.9 0 24s.9 7.9 2.6 11.1l8.2-6.2z" />
    <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.9 2.4 30.5 0 24 0 14.6 0 6.6 5.4 2.6 13.4l8.2 6.2C12.7 13.6 17.9 9.5 24 9.5z" />
  </svg>
);
const TripAdvisorOwl = ({ size = 14 }) => (
  <svg viewBox="0 0 132 80" width={Math.round(size * 1.6)} height={size} aria-hidden="true">
    <circle cx="38" cy="42" r="32" fill="#34E0A1" /><circle cx="94" cy="42" r="32" fill="#34E0A1" />
    <circle cx="38" cy="42" r="18" fill="#fff" /><circle cx="94" cy="42" r="18" fill="#fff" />
    <circle cx="38" cy="42" r="9" fill="#000" /><circle cx="94" cy="42" r="9" fill="#000" />
    <path d="M52 2 Q66 14 80 2 L66 22 Z" fill="#000" />
  </svg>
);
const TrustpilotStar = ({ size = 14 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
    <path fill="#00B67A" d="M12 0l2.9 8.6H24l-7.4 5.3 2.8 8.7L12 17.2l-7.4 5.4 2.8-8.7L0 8.6h9.1z" />
  </svg>
);
const MARK = { google: GoogleG, tripadvisor: TripAdvisorOwl, trustpilot: TrustpilotStar };

/* Rating stars. `lx2i-stars` carries the system's Rating Gold — the one
   place design.md allows that colour. */
function Stars({ n = 5, size = 13 }) {
  return (
    <span className="lx2i-stars" role="img" aria-label={`Rated ${n} out of 5`}>
      {[...Array(n)].map((_, i) => <Star key={i} size={size} fill="currentColor" aria-hidden="true" />)}
    </span>
  );
}

/* ------------------------------------------------------------- the reviews.
   The first six are the homepage's #reviews entries with the same
   photographs — the same travellers telling the same stories wherever they
   are quoted. The last four were chosen for the worry each answers: pace at
   seventy-one, a twice-refused visa, a refund, and three generations on one
   coach.

   `pull` is the review's opening line and `rest` is the remainder — split,
   not summarised, so the card can set the first line large without putting
   words in anyone's mouth. */
const FILTERS = [
  { key: 'all', label: 'All stories' },
  { key: 'group', label: 'Group tours' },
  { key: 'bespoke', label: 'Tailor-made' },
  { key: 'family', label: 'Families' },
  { key: 'honeymoon', label: 'Honeymoons' },
];

const REVIEWS = [
  {
    cat: 'group', platform: 'google', date: 'March 2026', rating: 5,
    name: 'Mr & Mrs Iyer', age: 'both 67', trip: 'Europe · Escorted group tour',
    pull: 'We worried the pace would be too much at our age — it was perfectly gentle.',
    rest: 'The tour manager carried our bags and found us Jain meals every single day.',
    ids: ['1630001722538-a9a540da549b', '1529156069898-49953e39b3ac', '1642342397404-fed6450eb964'],
  },
  {
    cat: 'group', platform: 'tripadvisor', date: 'April 2026', rating: 5,
    name: 'Sunita Rao', age: '', trip: 'Japan · Cherry blossom group tour',
    pull: 'Flawless from start to finish.',
    rest: 'The cherry blossom viewing in Kyoto was a once-in-a-lifetime moment, arranged beautifully. Not one thing went wrong in eleven days.',
    ids: ['1567122087721-47b09b61e1d1', '1667029839636-af119b059c49', '1639979511572-ff346bc5b3b7'],
  },
  {
    cat: 'honeymoon', platform: 'google', date: 'February 2026', rating: 5,
    name: 'Arjun & Meera', age: '', trip: 'Maldives · Honeymoon',
    pull: 'Not a single thing to worry about.',
    rest: 'An overwater villa, a private sandbank dinner, and everything handled before we thought to ask. Pure magic.',
    ids: ['1677179974826-b6619bd77506', '1677176455554-03ae366d51d5', '1639979511514-904e46c8c13f'],
  },
  {
    cat: 'family', platform: 'tripadvisor', date: 'January 2026', rating: 5,
    name: 'The Nair Family', age: 'three generations', trip: 'Switzerland · Escorted group tour',
    pull: 'Grandparents to grandkids — all of us looked after.',
    rest: 'The fixed departure meant zero planning stress, and the kids still talk about the Glacier Express. Eight of us across three generations, and nobody was left behind.',
    ids: ['1758272959663-b30513083206', '1715745218436-5a583702447a', '1580825175616-77f8df1bb507'],
  },
  {
    cat: 'bespoke', platform: 'trustpilot', date: 'February 2026', rating: 5,
    name: 'Rohan Kapoor', age: '', trip: 'Kenya · Private safari',
    pull: 'We watched the migration cross the Mara at dawn.',
    rest: 'The lodge, the guides, the timing — all impeccable. Being in the right place at the right hour is the whole game on safari, and they knew it.',
    ids: ['1539635278303-d4002c07eae3', '1581866548373-e6b8e1d0342c', '1758272959063-ef8a2114f807'],
  },
  {
    cat: 'bespoke', platform: 'google', date: 'December 2025', rating: 5,
    name: 'Priya Menon', age: '', trip: 'Italy · Tailor-made journey',
    pull: 'A guide who opened doors most tourists never see.',
    rest: 'A private gondola, a chef in Tuscany, and rooms that were not on any itinerary. Worth every rupee.',
    ids: ['1721884487052-8fb79415772c', '1763643820621-d775cf3ae5dd', '1506869640319-fe1a24fd76dc'],
  },
  {
    cat: 'group', platform: 'tripadvisor', date: 'November 2025', rating: 5,
    name: 'Farida & Hosang Batliwala', age: 'both 71', trip: 'Japan · Autumn colours group tour',
    pull: 'We were the oldest on the coach and never once felt it.',
    rest: 'Lifts instead of stairs, an unhurried morning every third day, and a tour manager who noticed we were tired before we said so. At seventy-one, that is everything.',
    ids: ['1493976040374-85c8e12f0c0e', '1528181304800-259b08848526'],
  },
  {
    cat: 'group', platform: 'google', date: 'October 2025', rating: 5,
    name: 'Ankit Verma', age: '', trip: 'Vietnam · Escorted group tour',
    pull: 'Twice refused on my own. Cleared in six days with them.',
    rest: 'Their documentation team rebuilt the entire visa file after two rejections and it came through in under a week. That alone was worth the booking.',
    ids: ['1573496359142-b8d87734a5a2', '1552058544-f2b08422138a'],
  },
  {
    cat: 'family', platform: 'trustpilot', date: 'September 2025', rating: 5,
    name: 'Shalini Deshpande', age: '', trip: 'Dubai · Family holiday',
    pull: 'The fare difference was back in my account in five days.',
    rest: 'Our airline cancelled three days before departure. They rebooked all five of us overnight and refunded the difference to the rupee. That is when you learn what a company actually is.',
    ids: ['1580489944761-15a19d654956', '1582719478250-c89cae4dc85b'],
  },
  {
    cat: 'honeymoon', platform: 'google', date: 'June 2026', rating: 5,
    name: 'Kavya & Dhruv', age: '', trip: 'Japan · Tailor-made honeymoon',
    pull: 'It felt designed, not booked.',
    rest: 'A ryokan with a private onsen, a tea ceremony arranged only for us, and an itinerary that always left room to wander. Nothing about it felt off a shelf.',
    ids: ['1522383225653-ed111181a951', '1545167622-3a6ac756afa4'],
  },
];

/* The interlude — a repeat traveller, because nothing argues for a travel
   company like the people who keep coming back. */
const INTERLUDE = {
  bg: '1534445867742-43195f401b6c',
  lines: ['Nobody watches the small things —', 'the aisle seat, the early check-in —', 'the way Cox & Kings does.'],
  by: 'Nalini Krishnan',
  meta: 'Her fifth journey with Cox & Kings · Verified traveller',
};

/* Trust stats, counted up on scroll. The markup already reads the finished
   value, so with motion off the band is simply correct.

   The 4.9 is the site-wide verified-review average the homepage also prints;
   it is deliberately NOT labelled as the mean of the three platform scores
   below, because it isn't one — those three are the public platforms, the
   pool behind 4.9 also includes post-trip surveys. */
const STATS = [
  { end: 267, decimals: 0, suffix: '', display: '267', label: 'years of journeys, since 1758' },
  { end: 2400, decimals: 0, suffix: '+', display: '2,400+', label: 'verified traveller reviews' },
  { end: 4.9, decimals: 1, suffix: '', display: '4.9', label: 'average from verified travellers' },
  { end: 100, decimals: 0, suffix: '+', display: '100+', label: 'countries, on all seven continents' },
];

/* Accolades — copied verbatim from /press-media, emblems and all, in the
   same order. One record, two rooms; they must never disagree. If the four
   awards change there, change them here too. */
const AWARDS = [
  { img: '/awards/accolades.jpg', title: "India's Favourite Tour Operator", by: "Condé Nast Traveller Readers' Travel Awards", years: '2016, 2017, 2022' },
  { img: '/awards/accolades-2.jpg', title: 'PATA Gold Award', by: 'The Pacific Asia Travel Association', years: '2015' },
  { img: '/awards/accolades-3.jpg', title: "Asia's Leading Luxury Tour Operator", by: 'World Travel Awards', years: '2015 – 2019' },
  { img: '/awards/accolades-4.png', title: 'Best Luxury Travel Curator', by: "Travel + Leisure India's Best Awards", years: '2017' },
];

/* ---------------------------------------------------------------- the card.
   Every card is the SAME height, because every card carries the same amount:
   one photo, the rating, the review's opening line clamped to three lines,
   and who wrote it. The rest of the review — and the photo gallery, and the
   outbound link to the platform — live in the overlay behind a click.

   That split is what makes the wall scannable. Ten cards of identical shape
   scroll as one rhythm; a reader stops only where a line catches them.

   The card is a <button>, so it cannot contain other interactive elements —
   which is why the platform shows here as a plain mark and becomes a real
   link only inside the overlay. */
function ReviewCard({ r, onOpen }) {
  const Mark = MARK[r.platform];
  const P = PLATFORMS[r.platform];

  return (
    <button type="button" className="tv-card" onClick={onOpen}>
      <span className="tv-card__media">
        <img className="tv-card__img" src={shot(r.ids[0], 800)} alt={r.trip} loading="lazy" />
        <span className="tv-card__scrim" aria-hidden="true" />
        <span className="tv-card__trip">{r.trip}</span>
        {r.ids.length > 1 && (
          <span className="tv-card__count" aria-hidden="true">
            <Images size={12} /> {r.ids.length}
          </span>
        )}
      </span>

      <span className="tv-card__body">
        <span className="tv-card__top">
          <Stars n={r.rating} size={13} />
          <span className="tv-card__via"><Mark /> {P.name}</span>
        </span>

        {/* Clamped to three lines — the one rule that keeps every card the
            same height no matter how long the traveller's sentence ran. */}
        <span className="tv-card__pull">{r.pull}</span>

        <span className="tv-card__sig">
          <span className="tv-card__name">
            {r.name}{r.age && <em> · {r.age}</em>}
          </span>
          <span className="tv-card__ver">
            <BadgeCheck size={13} aria-hidden="true" /> Verified · {r.date}
          </span>
        </span>

        <span className="tv-card__more">
          Read the full review <ArrowRight size={14} aria-hidden="true" />
        </span>
      </span>
    </button>
  );
}

/* --------------------------------------------------------------- the overlay.
   The whole review, the whole gallery, and the link out to the platform it
   was posted on. Rendered into <body> so no ancestor's transform or overflow
   can trap it. Escape closes, the backdrop closes, focus starts on the close
   button and returns to the card that opened it. */
function ReviewModal({ r, onClose }) {
  const [idx, setIdx] = useState(0);
  const closeRef = useRef(null);
  const panelRef = useRef(null);
  const P = PLATFORMS[r.platform];
  const Mark = MARK[r.platform];
  const many = r.ids.length > 1;

  useEffect(() => {
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (!many) return;
      if (e.key === 'ArrowRight') setIdx((n) => (n + 1) % r.ids.length);
      if (e.key === 'ArrowLeft') setIdx((n) => (n - 1 + r.ids.length) % r.ids.length);
    };
    /* Keep Tab inside the dialog — it is modal, so the page behind it is
       not reachable until it closes. */
    const onTab = (e) => {
      if (e.key !== 'Tab' || !panelRef.current) return;
      const f = panelRef.current.querySelectorAll('button, a[href]');
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };

    window.addEventListener('keydown', onKey);
    window.addEventListener('keydown', onTab);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keydown', onTab);
      document.body.style.overflow = prevOverflow;
    };
  }, [r, many, onClose]);

  return createPortal(
    <div className="tv-modal" onClick={onClose}>
      <div className="tv-modal__scrim" aria-hidden="true" />
      <div
        className="tv-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tv-modal-name"
        ref={panelRef}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="tv-modal__close"
          aria-label="Close review"
          onClick={onClose}
          ref={closeRef}
        >
          <X size={18} aria-hidden="true" />
        </button>

        <div className="tv-modal__media">
          <div className="tv-modal__slides" style={{ transform: `translateX(-${idx * 100}%)` }}>
            {r.ids.map((id, k) => (
              <img
                key={id}
                className="tv-modal__slide"
                src={shot(id, 1200)}
                alt={`${r.trip}${many ? ` — ${k + 1} of ${r.ids.length}` : ''}`}
              />
            ))}
          </div>
          {many && (
            <div className="tv-modal__dots">
              {r.ids.map((id, k) => (
                <button
                  key={id}
                  type="button"
                  className={`tv-modal__dot${k === idx ? ' is-on' : ''}`}
                  aria-label={`Show photograph ${k + 1} of ${r.ids.length}`}
                  aria-current={k === idx}
                  onClick={() => setIdx(k)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="tv-modal__body">
          <p className="tv-modal__trip">{r.trip}</p>
          <div className="tv-modal__top">
            <Stars n={r.rating} size={16} />
            <a
              className="tv-modal__via"
              href={P.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Mark /> Read on {P.full} <ArrowUpRight size={13} aria-hidden="true" />
            </a>
          </div>

          <blockquote className="tv-modal__quote">
            <Quote size={22} className="tv-modal__mark" aria-hidden="true" />
            <p className="tv-modal__pull">{r.pull}</p>
            <p className="tv-modal__rest">{r.rest}</p>
          </blockquote>

          <p className="tv-modal__sig">
            <span className="tv-modal__name" id="tv-modal-name">
              {r.name}{r.age && <em> · {r.age}</em>}
            </span>
            <span className="tv-modal__ver">
              <BadgeCheck size={14} aria-hidden="true" /> Verified traveller · {r.date}
            </span>
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}

/* How many cards stand before "Show all", per grid width — always a whole
   number of rows, so the wall never ends on a ragged half-row. One column on
   a phone means nine cards is a very long scroll before the reader reaches
   anything else, so it opens at four there and grows with the grid. */
const PREVIEW_STEPS = [
  { q: '(max-width: 720px)', n: 4 },    /* 1 column  */
  { q: '(max-width: 1000px)', n: 6 },   /* 2 columns */
];
const PREVIEW_WIDE = 9;                 /* 3 columns */

function readPreview() {
  if (typeof window === 'undefined' || !window.matchMedia) return PREVIEW_WIDE;
  for (const s of PREVIEW_STEPS) if (window.matchMedia(s.q).matches) return s.n;
  return PREVIEW_WIDE;
}

function usePreviewCount() {
  const [n, setN] = useState(readPreview);
  useEffect(() => {
    const mqls = PREVIEW_STEPS.map((s) => window.matchMedia(s.q));
    const sync = () => setN(readPreview());
    mqls.forEach((m) => m.addEventListener('change', sync));
    sync();
    return () => mqls.forEach((m) => m.removeEventListener('change', sync));
  }, []);
  return n;
}

export default function Testimonials() {
  const root = useRef(null);
  const [cat, setCat] = useState('all');
  const [expanded, setExpanded] = useState(false);
  const preview = usePreviewCount();
  /* The review shown in the overlay, plus the card that opened it — closing
     hands focus back there rather than dropping it at the top of the page. */
  const [openReview, setOpenReview] = useState(null);
  const opener = useRef(null);

  const openReviewFor = useCallback((r) => (e) => {
    opener.current = e.currentTarget;
    setOpenReview(r);
  }, []);
  const closeReview = useCallback(() => {
    setOpenReview(null);
    opener.current?.focus();
  }, []);

  const counts = useMemo(() => {
    const out = { all: REVIEWS.length };
    for (const f of FILTERS) if (f.key !== 'all') out[f.key] = REVIEWS.filter((r) => r.cat === f.key).length;
    return out;
  }, []);

  const shown = useMemo(
    () => (cat === 'all' ? REVIEWS : REVIEWS.filter((r) => r.cat === cat)),
    [cat],
  );
  const visible = expanded ? shown : shown.slice(0, preview);

  const pick = (key) => { setCat(key); setExpanded(false); };

  /* ============================================================
     MOTION — one gsap.context, reduced-motion gated end to end.
     Reveals are gsap.from(), so the CSS resting state IS the
     finished page: if none of this runs, nothing is invisible.
     Triggers attach only to nodes that never re-render; the card
     wall remounts on every filter change and animates in CSS.
     ============================================================ */
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add({ motion: '(prefers-reduced-motion: no-preference)' }, (self) => {
        if (!self.conditions.motion) return;

        /* ---- Hero, on load ---- */
        gsap.timeline({ defaults: { ease: 'power3.out' } })
          .from('.tv-hero__eyebrow', { opacity: 0, y: 14, duration: 0.7 }, 0.15)
          .from('.tv-hero__line > span', { yPercent: 112, duration: 1.05, stagger: 0.11 }, 0.28)
          .from('.tv-hero__sub', { opacity: 0, y: 16, duration: 0.8 }, 0.8)
          .from('.tv-hero__agg', { opacity: 0, y: 20, duration: 0.85 }, 0.92)
          .from('.tv-hero__agg .lx2i-stars svg', { scale: 0, opacity: 0, duration: 0.45, stagger: 0.06, ease: 'back.out(2.6)' }, 1.06)
          .from('.tv-hero__plat', { opacity: 0, y: 12, duration: 0.6, stagger: 0.08 }, 1.15)
          .from('.tv-hero__actions > *', { opacity: 0, y: 14, duration: 0.7, stagger: 0.08 }, 1.28)
          .from('.tv-proof', { opacity: 0, x: 26, duration: 0.8, stagger: 0.1 }, 0.95)
          .from('.tv-hero .lx2i-hero__scroll', { opacity: 0, duration: 0.8 }, 1.5);

        /* Hero photo parallax. The ken-burns keyframes own `scale`, so the
           drift rides the --py custom property the same rule reads for
           translateY — animating `y` here would fight the animation. */
        gsap.fromTo('.tv-hero .lx2i-hero__bg',
          { '--py': '0px' },
          {
            '--py': '110px', ease: 'none',
            scrollTrigger: { trigger: '.tv-hero', start: 'top top', end: 'bottom top', scrub: true },
          });

        /* ---- Section reveals ---- */
        gsap.utils.toArray('[data-rev]').forEach((el) => {
          gsap.from(el, {
            opacity: 0, y: 30, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 87%' },
          });
        });

        /* ---- Count-ups ---- */
        gsap.utils.toArray('.tv-stat__n').forEach((el) => {
          const end = parseFloat(el.dataset.end);
          const dec = Number(el.dataset.decimals || 0);
          const suffix = el.dataset.suffix || '';
          const final = el.textContent;
          const obj = { v: 0 };
          gsap.to(obj, {
            v: end, duration: 1.9, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
            onUpdate: () => {
              el.textContent = obj.v.toLocaleString('en-IN', {
                minimumFractionDigits: dec, maximumFractionDigits: dec,
              }) + suffix;
            },
            onComplete: () => { el.textContent = final; },
          });
        });

        /* ---- The interlude: photo drifts, lines rise out of masks ---- */
        gsap.fromTo('.tv-interlude__bg', { yPercent: -8 }, {
          yPercent: 8, ease: 'none',
          scrollTrigger: { trigger: '.tv-interlude', start: 'top bottom', end: 'bottom top', scrub: true },
        });
        gsap.from('.tv-interlude__line > span', {
          yPercent: 112, duration: 1.0, stagger: 0.13, ease: 'power3.out',
          scrollTrigger: { trigger: '.tv-interlude', start: 'top 72%' },
        });

        /* ---- Award cards — the same stagger /press-media gives them.
           `once` matters here: this is a gsap.from(), so the cards sit at
           opacity 0 until the trigger fires. On /press-media the awards sit
           under a short text page; here they sit under nine lazy-loaded
           photographs, so the trigger must not be able to re-arm against a
           position the page has since outgrown. The refresh effect below
           keeps those positions honest. ---- */
        gsap.from('.pm-acard', {
          opacity: 0, y: 20, duration: 0.7, ease: 'power3.out', stagger: 0.09,
          scrollTrigger: { trigger: '.pm-awards__grid', start: 'top 92%', once: true },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  /* ScrollTrigger measures start/end positions once, at build time. Every
     photograph on this page below the fold is lazy, so they land afterwards
     and push everything under them further down — leaving those cached
     positions describing a page that no longer exists. Re-measure once the
     images have settled, and again whenever the grid's own height changes
     (a filter, or "Show all"). */
  useEffect(() => {
    const imgs = Array.from(root.current?.querySelectorAll('img') || []);
    const pending = imgs.filter((i) => !i.complete);
    if (!pending.length) { ScrollTrigger.refresh(); return undefined; }

    let left = pending.length;
    const settle = () => { if (--left === 0) ScrollTrigger.refresh(); };
    pending.forEach((i) => {
      i.addEventListener('load', settle, { once: true });
      i.addEventListener('error', settle, { once: true });
    });
    return () => pending.forEach((i) => {
      i.removeEventListener('load', settle);
      i.removeEventListener('error', settle);
    });
  }, [cat, expanded, preview]);

  return (
    <div className="h26 new-typo n3" ref={root}>
      {/* A tall photographic hero, exactly like the homepage — so the nav
          stays transparent well down it. */}
      <SiteNav solidAt={80} skipTo="#tv-wall" skipLabel="Skip to traveller stories" />

      <div className="lx2i tv">
        <main id="tv-main">
          {/* ==================== HERO ==================== */}
          <section className="lx2i-hero tv-hero" id="tv-top">
            <div className="lx2i-hero__bgwrap" aria-hidden="true">
              <div
                className="lx2i-hero__bg"
                style={{ backgroundImage: `url(${shot('1530122037265-a5f1f91d3b99', 2000)})` }}
              />
              <div className="lx2i-hero__veil" />
            </div>

            <div className="lx2i-hero__inner">
              <div className="lx2i-hero__left">
                <span className="lx2i-eyebrow lx2i-eyebrow--light tv-hero__eyebrow">
                  Traveller stories · 2,400+ verified reviews
                </span>

                <h1 className="lx2i-hero__title tv-hero__title">
                  <span className="tv-hero__line"><span>Real journeys,</span></span>
                  <em className="tv-hero__line"><span>in their own words.</span></em>
                </h1>

                <p className="lx2i-hero__sub tv-hero__sub">
                  Two hundred and sixty-seven years of taking people out into the
                  world — and every word below was written by one of them, in
                  public, on a platform we cannot edit.
                </p>

                {/* The aggregate. A solid warm-paper plate rather than glass:
                    it holds the most important number on the page and must
                    never fight the photo behind it for legibility. */}
                <div className="tv-hero__agg">
                  <div className="tv-hero__aggtop">
                    <span className="tv-hero__score">4.9</span>
                    <span className="tv-hero__aggtext">
                      <Stars size={16} />
                      <span>from 2,400+ verified reviews</span>
                    </span>
                  </div>
                  <div className="tv-hero__plats">
                    {Object.entries(PLATFORMS).map(([key, p]) => {
                      const Mark = MARK[key];
                      return (
                        <a
                          key={key}
                          className="tv-hero__plat"
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${p.full}: rated ${p.rating} (opens in a new tab)`}
                        >
                          <Mark /> <b>{p.rating}</b> <span>{p.name}</span>
                          <ArrowUpRight size={11} aria-hidden="true" />
                        </a>
                      );
                    })}
                  </div>
                </div>

                <div className="tv-hero__actions">
                  <a href="#tv-wall" className="lx2i-btn lx2i-btn--primary lx2i-btn--lg">
                    Read their stories <ArrowRight size={16} aria-hidden="true" />
                  </a>
                  <a href="#tv-awards" className="lx2i-btn lx2i-btn--glass lx2i-btn--lg">
                    See the awards
                  </a>
                </div>
              </div>

              {/* Dark glass proof chips — the homepage hero's right-hand
                  column, same pill shape and same on-photo treatment. */}
              <div className="tv-proofs" aria-label="Why travellers trust us">
                <div className="tv-proof">
                  <strong>96%</strong>
                  <span>would travel with us again</span>
                </div>
                <div className="tv-proof">
                  <strong>4 awards</strong>
                  <span>reader-voted &amp; jury-given</span>
                </div>
                <div className="tv-proof">
                  <strong>Since 1758</strong>
                  <span>267 years of journeys</span>
                </div>
              </div>
            </div>

            {/* The homepage's own scroll cue, reused whole. */}
            <a className="lx2i-hero__scroll" href="#tv-wall">
              <span>Scroll to the stories</span>
              <ChevronDown size={18} aria-hidden="true" />
            </a>
          </section>

          {/* ==================== TRUST IN NUMBERS ==================== */}
          <section className="tv-stats" aria-label="Cox and Kings in numbers">
            <div className="lx2i-container tv-stats__grid" data-rev>
              {STATS.map((s) => (
                <div className="tv-stat" key={s.label}>
                  <span
                    className="tv-stat__n"
                    data-end={s.end}
                    data-decimals={s.decimals}
                    data-suffix={s.suffix}
                  >
                    {s.display}
                  </span>
                  <span className="tv-stat__l">{s.label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ==================== THE WALL ==================== */}
          <section className="tv-wall" id="tv-wall" aria-labelledby="tv-wall-h">
            <div className="lx2i-container">
              <div className="tv-wall__head" data-rev>
                <div>
                  <span className="lx2i-eyebrow">Traveller stories</span>
                  <h2 className="lx2i-h2" id="tv-wall-h">
                    Real journeys, captured<br />by <strong>real travellers</strong>
                  </h2>
                </div>
                <p className="tv-wall__note">
                  Every story names the traveller, the trip and the platform it
                  was posted on — follow any of them out and read us there.
                </p>
              </div>

              <div className="tv-filters" role="group" aria-label="Filter stories by kind of journey">
                {FILTERS.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    className={`tv-chip${cat === f.key ? ' is-on' : ''}`}
                    aria-pressed={cat === f.key}
                    onClick={() => pick(f.key)}
                  >
                    {f.label} <span className="tv-chip__n">{counts[f.key]}</span>
                  </button>
                ))}
              </div>

              {/* Filtering remounts the grid silently, so the change is
                  announced here for anyone not watching it happen. */}
              <p className="tv-sr" role="status">
                Showing {visible.length} of {REVIEWS.length} stories
                {cat === 'all' ? '' : ` in ${FILTERS.find((f) => f.key === cat).label}`}.
              </p>

              {/* Keyed by the filter so a change remounts the grid and the CSS
                  entrance replays — no ScrollTriggers to orphan. */}
              <div className="tv-grid" key={cat}>
                {visible.map((r, i) => (
                  <div
                    className="tv-cell"
                    key={r.name}
                    style={{ '--d': `${Math.min(i, 8) * 0.06}s` }}
                  >
                    <ReviewCard r={r} onOpen={openReviewFor(r)} />
                  </div>
                ))}
              </div>

              {shown.length > preview && (
                <div className="tv-more">
                  <button
                    type="button"
                    className="lx2i-btn lx2i-btn--glass lx2i-btn--lg"
                    aria-expanded={expanded}
                    onClick={() => setExpanded((v) => !v)}
                  >
                    {expanded ? 'Show fewer stories' : `Show all ${shown.length} stories`}
                    <ChevronDown size={16} className={`tv-more__chev${expanded ? ' is-open' : ''}`} aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* ==================== THE RETURNING GUEST ==================== */}
          <figure className="tv-interlude">
            <img
              className="tv-interlude__bg"
              src={shot(INTERLUDE.bg, 1800)}
              alt=""
              aria-hidden="true"
              loading="lazy"
            />
            <span className="tv-interlude__veil" aria-hidden="true" />
            <div className="lx2i-container tv-interlude__inner">
              <Quote size={30} className="tv-interlude__mark" aria-hidden="true" />
              <blockquote className="tv-interlude__text">
                {INTERLUDE.lines.map((line, i) => (
                  <span className="tv-interlude__line" key={line}>
                    <span>{i === 1 ? <em>{line}</em> : line}</span>
                  </span>
                ))}
              </blockquote>
              <figcaption className="tv-interlude__by">
                <cite>{INTERLUDE.by}</cite> · {INTERLUDE.meta}
              </figcaption>
            </div>
          </figure>

          {/* ==================== VERIFY US YOURSELF ==================== */}
          <section className="tv-verify" id="tv-verify" aria-labelledby="tv-verify-h">
            <div className="lx2i-container">
              <div className="tv-head" data-rev>
                <span className="lx2i-eyebrow">Verify us yourself</span>
                <h2 className="lx2i-h2" id="tv-verify-h">
                  Don&apos;t take our <strong>word for it</strong>
                </h2>
                <p className="tv-sub">
                  Every review on this page lives on an independent platform we
                  cannot edit, reorder or delete. Read us where the score is kept.
                </p>
              </div>

              <div className="tv-verify__grid" data-rev>
                {Object.entries(PLATFORMS).map(([key, p]) => {
                  const Mark = MARK[key];
                  return (
                    <a
                      className="tv-plat"
                      key={key}
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${p.full}: rated ${p.rating} from ${p.count} (opens in a new tab)`}
                    >
                      <span className="tv-plat__name"><Mark size={18} /> {p.full}</span>
                      <span className="tv-plat__score">
                        <span className="tv-plat__n">{p.rating}</span>
                        <Stars size={14} />
                      </span>
                      <span className="tv-plat__count">{p.count}</span>
                      <span className="tv-plat__note">{p.note}</span>
                      <span className="tv-plat__go">
                        Read our reviews there <ArrowUpRight size={15} aria-hidden="true" />
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ==================== ACCOLADES & ACHIEVEMENTS ====================
              Lifted whole from /press-media — same markup, same copy, same
              `.pm` stylesheet, so the two pages show one identical record.
              The `.pm` wrapper is what makes PressMedia.css apply; the few
              values `.n3` would otherwise change are restored in
              Testimonials.css under `.tv .pm`. */}
          <div className="pm">
            <section className="h26-section pm-awards" id="tv-awards" aria-labelledby="tv-awards-h">
              <div className="pm-wrap">
                <div className="pm-head pm-head--center" data-rev>
                  <p className="h26-label">Accolades &amp; achievements</p>
                  <h2 className="pm-h2" id="tv-awards-h">Celebrated Worldwide, Trusted for Generations</h2>
                </div>

                <ul className="pm-awards__grid">
                  {AWARDS.map((a) => (
                    <li className="pm-acard" key={a.title}>
                      {/* Not lazy: four small emblems that ARE the proof.
                          Deferring them is what let them arrive after the
                          scroll positions were measured. */}
                      <img className="pm-acard__img" src={a.img} alt={`${a.by} emblem`} width="104" height="104" />
                      <h3 className="pm-acard__title">{a.title}</h3>
                      <p className="pm-acard__by">{a.by}</p>
                      <span className="pm-acard__years">{a.years}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>

          {/* ==================== CLOSING BAND ====================
              The homepage's own closing component, reused whole. */}
          <section className="lx2i-cta tv-cta">
            <div
              className="lx2i-cta__bg"
              style={{ backgroundImage: `url(${shot('1488646953014-85cb44e25828', 1800)})` }}
              aria-hidden="true"
            />
            <div className="lx2i-cta__veil" aria-hidden="true" />
            <div className="lx2i-container">
              <div className="lx2i-cta__inner" data-rev>
                <span className="lx2i-eyebrow">Your turn</span>
                <h2 className="lx2i-cta__title">
                  The next story <strong>is yours</strong>
                </h2>
                <p className="lx2i-cta__sub">
                  Tell a specialist where you have been dreaming of, and we will
                  design the journey you end up writing about.
                </p>
                <div className="lx2i-cta__actions">
                  <Link to={CALLBACK} className="lx2i-btn lx2i-btn--primary lx2i-btn--lg">
                    Talk to an expert <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                  <Link to="/journeys4" className="lx2i-btn lx2i-btn--glass lx2i-btn--lg">
                    Explore all journeys
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      <SiteFooter />

      {openReview && <ReviewModal r={openReview} onClose={closeReview} />}
    </div>
  );
}
