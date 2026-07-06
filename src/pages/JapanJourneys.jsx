/* ============================================================
   Japan Journeys — a COUNTRY-SPECIFIC tour listing page.

   A focused sibling of /journeys: instead of every destination, it
   tells the story of one country. Flow:
     1. A little about Japan (why go, when, how it travels)
     2. The Japan journeys (only Japan tours, as cards)
     3. "The food people eat in Japan" — signature dishes and a
        short list of restaurant recommendations.

   Design language: shares the /improved chrome exactly — the same
   fixed Voyager-Blue nav (transparent over a dark banner, solid on
   scroll), Zodiak serif headings, warm-paper surfaces and the
   design.md token set. Reuses Journeys.css for the hero/cards/chrome
   and layers JapanJourneys.css for the about + food sections.
   ============================================================ */
import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import {
  Phone, PhoneCall, MessageCircle, ArrowUpRight, ArrowRight,
  MapPin, Menu, X, ChevronDown, ChevronLeft, ChevronRight,
  Star, Clock, Calendar, Users, Gauge, Images, Utensils,
  CalendarDays, Plane, Landmark, Languages, TrainFront,
  Instagram, Facebook, Youtube, Linkedin,
} from 'lucide-react';
import { img } from '../data/v3content';
import './Home2026.css';
import './Home2026Improved.css';
import './Journeys.css';
import './JapanJourneys.css';

/* /improved-scoped direct line (matches Home2026Improved / Journeys). */
const CONTACT = {
  phoneDisplay: '+91 8556001700',
  phoneHref: 'tel:+918556001700',
  whatsappHref: 'https://wa.me/918556001700',
  email: 'journeys@coxandkings.com',
};

const U = (id) => `https://images.unsplash.com/photo-${id}`;

/* Japan photo pool — on-brand, harvested from the existing CK pages —
   drives the per-tour lightbox galleries. */
const JAPAN_PHOTOS = [
  U('1522383225653-ed111181a951'), U('1492571350019-22de08371fd3'),
  U('1493976040374-85c8e12f0c0e'), U('1490806843957-31f4c9a91c65'),
  U('1528360983277-13d401cdc186'), U('1540959733332-eab4deabeeaf'),
];
const HERO_IMG = U('1545569341-9eb8b30979d9');

/* ---- The Japan catalogue. Same shape as /journeys, Japan-only. ---- */
const GROUP_BY_STYLE = {
  'Group Tour': 'Small group · max 18',
  'Bespoke Private': 'Private & tailor-made',
  Luxury: 'Private guiding',
};
function buildGallery(image) {
  return [...new Set([image, ...JAPAN_PHOTOS])].slice(0, 5);
}
const T = (o) => ({
  ...o,
  priceLabel: `₹${o.price.toLocaleString('en-IN')}`,
  nightsLabel: `${o.nights} nights`,
  group: GROUP_BY_STYLE[o.style],
  gallery: buildGallery(o.image),
});
/* Escorted, tour-manager-led departures — the "group tours" rail. */
const GROUP_TOURS = [
  T({ id: 'jp-blossom', title: 'Cherry Blossom Japan', blurb: 'Tokyo neon to Kyoto temple gardens, timed to the petals.', style: 'Group Tour', pace: 'Balanced', rating: 4.9, nights: 13, season: 'Mar–Apr', price: 295000, image: U('1522383225653-ed111181a951'), to: '/japan' }),
  T({ id: 'jp-essence', title: 'Essence of Japan with Hakone', blurb: 'The classic first loop — Tokyo, Mt Fuji and old Kyoto.', style: 'Group Tour', pace: 'Balanced', rating: 4.8, nights: 8, season: 'Mar–Nov', price: 265000, image: U('1490806843957-31f4c9a91c65'), to: '/essence-japan' }),
  T({ id: 'jp-highlights', title: 'Highlights of Japan', blurb: 'Tokyo, Kyoto, Hiroshima and Osaka, linked by bullet train.', style: 'Group Tour', pace: 'Active', rating: 4.7, nights: 11, season: 'Year-round', price: 250000, image: U('1540959733332-eab4deabeeaf'), to: '/japan' }),
  T({ id: 'jp-autumn', title: 'Japan in Autumn Colours', blurb: 'Fire-red maples across Kyoto, Nikko and the Fuji lakes.', style: 'Group Tour', pace: 'Balanced', rating: 4.8, nights: 12, season: 'Oct–Nov', price: 285000, image: U('1528360983277-13d401cdc186'), to: '/japan' }),
];

/* Tailor-made & private-guided trips — the "private tours" rail. */
const PRIVATE_TOURS = [
  T({ id: 'jp-first', title: 'Japan for First-Timers', blurb: 'Tokyo, Hakone and Kyoto with a private guide and a ryokan night.', style: 'Bespoke Private', pace: 'Balanced', rating: 4.8, nights: 10, season: 'Any date', price: 310000, image: U('1492571350019-22de08371fd3'), to: '/japan' }),
  T({ id: 'jp-luxe', title: 'Ryokans & Art Islands', blurb: 'Design hotels, private onsen and the Naoshima art islands.', style: 'Luxury', pace: 'Relaxed', rating: 4.9, nights: 9, season: 'Year-round', price: 420000, image: U('1493976040374-85c8e12f0c0e'), to: '/japan' }),
  T({ id: 'jp-kyoto', title: 'Tailor-made Kyoto & Kanazawa', blurb: 'Old capitals, craft studios and quiet gardens, at your pace.', style: 'Bespoke Private', pace: 'Relaxed', rating: 4.8, nights: 8, season: 'Year-round', price: 335000, image: U('1522383225653-ed111181a951'), to: '/japan' }),
  T({ id: 'jp-rail', title: 'Luxury Japan by Rail', blurb: 'First-class Shinkansen and the finest stays, end to end.', style: 'Luxury', pace: 'Relaxed', rating: 4.9, nights: 11, season: 'Apr–Oct', price: 480000, image: U('1490806843957-31f4c9a91c65'), to: '/japan' }),
];

const TOUR_COUNT = GROUP_TOURS.length + PRIVATE_TOURS.length;

/* ---- Quick country facts (the "little info about Japan" strip). ---- */
const FACTS = [
  { icon: CalendarDays, label: 'Best time', value: 'Mar–Apr (blossom) · Oct–Nov (autumn)' },
  { icon: Plane, label: 'Flight from India', value: '~7–9 hrs direct to Tokyo' },
  { icon: Landmark, label: 'Currency', value: 'Japanese Yen (¥)' },
  { icon: Languages, label: 'Language', value: 'Japanese · English in cities' },
  { icon: TrainFront, label: 'Getting around', value: 'JR Pass & bullet trains (Shinkansen)' },
];

/* ---- Regional highlights, quick-read cards under the intro. ---- */
const HIGHLIGHTS = [
  { name: 'Tokyo', note: 'Neon, sushi counters and pin-drop-calm gardens, all at once.', image: U('1540959733332-eab4deabeeaf'), to: '/journeys/japan/tokyo' },
  { name: 'Kyoto', note: 'A thousand temples, geisha lanes and moss-still Zen courtyards.', image: U('1493976040374-85c8e12f0c0e'), to: '/journeys/japan/kyoto' },
  { name: 'Mt Fuji & Hakone', note: 'Hot-spring ryokans in view of the sacred cone.', image: U('1490806843957-31f4c9a91c65'), to: '/journeys/japan/hakone' },
  { name: 'Osaka', note: "Japan's kitchen — street food, neon canals and easy nightlife.", image: U('1528360983277-13d401cdc186'), to: '/journeys/japan/osaka' },
];

/* ---- The food section — signature dishes people actually eat. ---- */
const DISHES = [
  { name: 'Sushi & Sashimi', tag: 'Tokyo', desc: 'Edo-style nigiri at a counter, cut to order — the purest taste of the sea.', image: U('1579584425555-c3ce17fd4351') },
  { name: 'Ramen', tag: 'Everywhere', desc: 'Rich tonkotsu, clear shoyu or miso — slurped fast at a steamy counter.', image: U('1557872943-16a5ac26437e') },
  { name: 'Tempura', tag: 'Kyoto', desc: 'Seafood and vegetables in a whisper-light, lace-crisp batter.', image: U('1615361200141-f45040f367be') },
  { name: 'Okonomiyaki', tag: 'Osaka', desc: 'The savoury griddle pancake — cabbage, batter and your pick of fillings.', image: U('1580822184713-fc5400e7fe10') },
  { name: 'Wagyu & Yakiniku', tag: 'Kobe', desc: 'Marbled beef seared over charcoal at your table, melt-soft.', image: U('1544025162-d76694265947') },
  { name: 'Matcha & Wagashi', tag: 'Uji · Kyoto', desc: 'Stone-ground green tea with delicate seasonal sweets — a quiet ritual.', image: U('1536256263959-770b48d82b0a') },
];

/* ---- A short, credible list of restaurant recommendations. ---- */
const RESTAURANTS = [
  { name: 'Sukiyabashi Jiro', city: 'Ginza, Tokyo', note: 'The legendary sushi counter — a bucket-list omakase. Book far ahead.', price: '¥¥¥¥', image: U('1579584425555-c3ce17fd4351') },
  { name: 'Ichiran Ramen', city: 'Shibuya, Tokyo', note: 'Solo-booth tonkotsu ramen, dialled exactly to your taste. Casual & iconic.', price: '¥¥', image: U('1557872943-16a5ac26437e') },
  { name: 'Kikunoi Honten', city: 'Higashiyama, Kyoto', note: 'Three-Michelin-star kaiseki — Japan’s seasonal haute cuisine.', price: '¥¥¥¥', image: U('1536256263959-770b48d82b0a') },
  { name: 'Mizuno', city: 'Dotonbori, Osaka', note: 'A Michelin-listed okonomiyaki institution on the canal. Expect a queue.', price: '¥¥', image: U('1580822184713-fc5400e7fe10') },
  { name: 'Gion Karyo', city: 'Gion, Kyoto', note: 'Approachable kaiseki in a machiya townhouse — beauty without the ceremony.', price: '¥¥¥', image: U('1615361200141-f45040f367be') },
  { name: 'Afuri', city: 'Ebisu, Tokyo', note: 'Bright yuzu-shio ramen — a lighter, modern take worth the detour.', price: '¥¥', image: U('1591814468924-caf88d1232e1') },
];

/* ---- Nav megamenu — Japan items route into THIS page / its tours. ---- */
const NAV_MENU = [
  {
    label: 'Ways to travel', href: '/journeys',
    blurb: 'Two ways to see the world — pick the one that fits you.',
    items: [
      { label: 'Escorted group tours', desc: 'Expert-led, fixed departures', to: '/journeys?style=Group Tour' },
      { label: 'Tailor-made journeys', desc: 'Designed entirely around you', to: '/journeys?style=Bespoke Private' },
      { label: 'Luxury & private travel', desc: 'Elevated stays and guiding', to: '/journeys?style=Luxury' },
      { label: 'Help me decide', desc: 'Talk it through with a specialist', to: '/contact' },
    ],
  },
  {
    label: 'Destinations', href: '/journeys',
    blurb: 'Over 100 countries, shaped by specialists who know them first-hand.',
    items: [
      { label: 'Japan', desc: 'Cherry blossom to neon', to: '/journeys/japan' },
      { label: 'Switzerland', desc: 'Alpine railways & lakes', to: '/journeys?where=Switzerland' },
      { label: 'Italy', desc: 'Cities, coast & countryside', to: '/journeys?where=Italy' },
      { label: 'Northern Lights', desc: 'Arctic winter skies', to: '/journeys?where=Northern Lights' },
      { label: 'Africa Safari', desc: 'Big-five wilderness', to: '/journeys?where=Africa Safari' },
      { label: 'All destinations', desc: 'Browse every journey', to: '/journeys' },
    ],
  },
  {
    label: 'Japan', href: '/journeys/japan',
    blurb: 'Cherry blossom to neon — our most-loved country, four ways.',
    items: [
      { label: 'Cherry Blossom Japan', desc: '13 nights · Mar–Apr', to: '/japan' },
      { label: 'Japan for First-Timers', desc: '10 nights · any date', to: '/japan' },
      { label: 'Ryokans & Art Islands', desc: '9 nights · slow luxury', to: '/japan' },
      { label: 'All Japan journeys', desc: 'The full collection', to: '/journeys/japan' },
    ],
  },
  {
    label: 'Why us', href: '/improved#trust',
    blurb: 'Specialists, not salespeople — and 260 years behind every trip.',
    items: [
      { label: 'Our specialists', desc: 'The people who plan your trip', to: '/improved#trust' },
      { label: 'Since 1758', desc: 'Heritage you can lean on', to: '/improved#trust' },
      { label: 'Real reviews', desc: '2,400+ verified travellers', to: '/improved#reviews' },
      { label: 'Talk to an expert', desc: 'We pick up the phone', to: '/contact' },
    ],
  },
];

/* ---- Reduced-motion-safe reveal (matches /improved & Journeys). ---- */
function Reveal({ children, className = '', delay = 0, y = 20, as = 'div' }) {
  const M = motion[as] || motion.div;
  const reduce = useReducedMotion();
  if (reduce) return <M className={className}>{children}</M>;
  return (
    <M
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(12px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </M>
  );
}

/* Word-by-word blur reveal for the display headline (matches /improved). */
function WordReveal({ text, className = '', accent = [], delay = 0 }) {
  const words = text.split(' ');
  const reduce = useReducedMotion();
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => (
        <span className="wr-wrap" key={i} aria-hidden="true">
          {reduce ? (
            <span className={`wr-word${accent.includes(i) ? ' wr-accent' : ''}`}>{w}</span>
          ) : (
            <motion.span
              className={`wr-word${accent.includes(i) ? ' wr-accent' : ''}`}
              initial={{ opacity: 0, y: '1em', filter: 'blur(12px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: delay + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
            >
              {w}
            </motion.span>
          )}{' '}
        </span>
      ))}
    </span>
  );
}

/* WhatsApp glyph (lucide has no brand icon) — used on the enquiry CTA. */
const WaIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.5A10 10 0 1 0 12 2zm0 18.3c-1.5 0-2.98-.4-4.27-1.16l-.3-.18-3.17 1 1.02-3.09-.2-.32A8.3 8.3 0 1 1 12 20.3z" />
    <path d="M17.5 14.4c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35z" />
  </svg>
);

/* A single journey card — mirrors /journeys exactly. */
function JourneyCard({ j, i, onPhotos }) {
  const waHref = `${CONTACT.whatsappHref}?text=${encodeURIComponent(`Hi Cox & Kings, I'd like to enquire about the "${j.title}" journey.`)}`;
  return (
    <Reveal className="jl-card" delay={(i % 3) * 0.05} y={24} as="article">
      <div className="jl-card-media">
        <Link to={j.to} className="jl-card-media-link" aria-label={`${j.title} — view itinerary`}>
          <img src={img(j.image, 800)} alt={j.title} loading="lazy" />
        </Link>
        <span className="jl-card-style">{j.style}</span>
        <span className="jl-card-rating"><Star size={12} fill="currentColor" aria-hidden="true" /> {j.rating.toFixed(1)}</span>
        <span className="jl-card-region"><MapPin size={12} aria-hidden="true" /> Japan</span>
        {j.gallery.length > 1 && (
          <button
            type="button"
            className="jl-photos"
            onClick={() => onPhotos(j)}
            aria-label={`View ${j.gallery.length} photos of ${j.title}`}
          >
            <Images size={15} aria-hidden="true" /> {j.gallery.length} photos
          </button>
        )}
      </div>
      <div className="jl-card-body">
        <h3 className="jl-card-title"><Link to={j.to}>{j.title}</Link></h3>
        <span className="jl-card-group"><Users size={13} aria-hidden="true" /> {j.group}</span>
        <p className="jl-card-blurb">{j.blurb}</p>
        <div className="jl-card-meta">
          <span><Clock size={14} aria-hidden="true" /> {j.nightsLabel}</span>
          <span><Calendar size={14} aria-hidden="true" /> {j.season}</span>
          <span><Gauge size={14} aria-hidden="true" /> {j.pace} pace</span>
        </div>
        <div className="jl-card-foot">
          <span className="jl-card-price">
            <small>from</small> {j.priceLabel} <small>/ person</small>
          </span>
          <div className="jl-card-ctas">
            <Link to={j.to} className="jl-cbtn jl-cbtn-view">
              View Itinerary <ArrowRight size={15} aria-hidden="true" />
            </Link>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="jl-cbtn jl-cbtn-wa"
              aria-label={`Enquire about ${j.title} on WhatsApp`}
            >
              <WaIcon size={15} /> Enquire Now
            </a>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* Photo lightbox — cycles a tour's gallery without leaving the page. */
function Lightbox({ data, onClose }) {
  const { title, photos } = data;
  const [idx, setIdx] = useState(data.index || 0);
  const dialogRef = useRef(null);

  const go = useCallback((dir) => setIdx((n) => (n + dir + photos.length) % photos.length), [photos.length]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    };
    document.addEventListener('keydown', onKey);
    dialogRef.current?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [go, onClose]);

  return (
    <motion.div
      className="jl-lb"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Photos of ${title}`}
    >
      <div className="jl-lb-top" onClick={(e) => e.stopPropagation()}>
        <span className="jl-lb-title">{title}</span>
        <span className="jl-lb-count">{idx + 1} / {photos.length}</span>
        <button type="button" className="jl-lb-close" onClick={onClose} aria-label="Close photos"><X size={22} /></button>
      </div>
      <div className="jl-lb-stage" onClick={(e) => e.stopPropagation()} ref={dialogRef} tabIndex={-1}>
        <button type="button" className="jl-lb-nav jl-lb-prev" onClick={() => go(-1)} aria-label="Previous photo"><ChevronLeft size={26} /></button>
        <AnimatePresence mode="wait">
          <motion.img
            key={idx}
            src={img(photos[idx], 1400)}
            alt={`${title} — photo ${idx + 1}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          />
        </AnimatePresence>
        <button type="button" className="jl-lb-nav jl-lb-next" onClick={() => go(1)} aria-label="Next photo"><ChevronRight size={26} /></button>
      </div>
      <div className="jl-lb-thumbs" onClick={(e) => e.stopPropagation()}>
        {photos.map((p, k) => (
          <button
            key={p + k}
            type="button"
            className={`jl-lb-thumb${k === idx ? ' is-on' : ''}`}
            onClick={() => setIdx(k)}
            aria-label={`Photo ${k + 1}`}
            aria-current={k === idx}
          >
            <img src={img(p, 200)} alt="" />
          </button>
        ))}
      </div>
    </motion.div>
  );
}

/* A horizontal carousel — identical chrome to the /journeys shelves:
   a heading block + desktop arrow controls, and a full-bleed, snap-scroll
   rail you swipe on touch. Reused for both tour rails and the food rail. */
function Rail({ label, title, sub, id, children, railClass = '' }) {
  const railRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    update();
    const el = railRef.current;
    el?.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { el?.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, [update]);

  const scrollBy = (dir) => {
    const el = railRef.current;
    if (!el) return;
    const card = el.firstElementChild;
    const step = (card ? card.offsetWidth : 320) + 16;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  return (
    <section className="jl-shelf" aria-labelledby={id}>
      <div className="jl-shelf-head">
        <div className="jl-shelf-heading">
          <Reveal className="h26-label jl-shelf-label" as="p">{label}</Reveal>
          <Reveal as="h2" className="jl-shelf-title" delay={0.04} id={id}>{title}</Reveal>
          <Reveal as="p" className="jl-shelf-sub" delay={0.08}>{sub}</Reveal>
        </div>
        <div className="jl-shelf-arrows" aria-hidden="true">
          <button type="button" className="jl-arrow" onClick={() => scrollBy(-1)} disabled={atStart} aria-label="Scroll left" tabIndex={-1}>
            <ChevronLeft size={20} />
          </button>
          <button type="button" className="jl-arrow" onClick={() => scrollBy(1)} disabled={atEnd} aria-label="Scroll right" tabIndex={-1}>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      <div className={`jl-rail ${railClass}`} ref={railRef} role="group" aria-label={`${title} — scroll for more`}>
        {children}
      </div>
    </section>
  );
}

/* A single dish tile for the food carousel. */
function DishCard({ d }) {
  return (
    <article className="jp-dish">
      <div className="jp-dish-media">
        <img src={img(d.image, 640)} alt={d.name} loading="lazy" />
        <span className="jp-dish-tag"><MapPin size={12} aria-hidden="true" /> {d.tag}</span>
      </div>
      <div className="jp-dish-body">
        <h3 className="jp-dish-name">{d.name}</h3>
        <p className="jp-dish-desc">{d.desc}</p>
      </div>
    </article>
  );
}

/* A compact restaurant tile for the recommendations carousel —
   photo + price badge, then details and a "Book a table" CTA. */
function RestoCard({ r }) {
  const bookHref = `${CONTACT.whatsappHref}?text=${encodeURIComponent(`Hi Cox & Kings, I'd like to book a table at ${r.name} (${r.city}) as part of my Japan trip.`)}`;
  return (
    <article className="jp-resto-card">
      <div className="jp-resto-media">
        <img src={img(r.image, 420)} alt={r.name} loading="lazy" />
        <span className="jp-resto-price">{r.price}</span>
      </div>
      <div className="jp-resto-body">
        <h4 className="jp-resto-name">{r.name}</h4>
        <span className="jp-resto-city"><MapPin size={12} aria-hidden="true" /> {r.city}</span>
        <p className="jp-resto-note">{r.note}</p>
        <a
          href={bookHref}
          target="_blank"
          rel="noopener noreferrer"
          className="jp-resto-book"
          aria-label={`Book a table at ${r.name}`}
        >
          <Utensils size={14} aria-hidden="true" /> Book a table
        </a>
      </div>
    </article>
  );
}

export default function JapanJourneys() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightbox, setLightbox] = useState(null); // { title, photos, index } | null

  const openPhotos = useCallback((j) => setLightbox({ title: j.title, photos: j.gallery, index: 0 }), []);

  /* Nav goes solid once the page scrolls off the dark banner. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Lock body scroll while the mobile menu or lightbox is open. */
  useEffect(() => {
    const lock = menuOpen || !!lightbox;
    document.body.style.overflow = lock ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen, lightbox]);

  return (
    <div className="h26 jl jp">
      <a className="h26-skip" href="#tours">Skip to journeys</a>

      {/* ---------- NAV (shared /improved chrome) ---------- */}
      <header className={`h26-nav${scrolled ? ' is-solid' : ''}`}>
        <Link to="/improved" className="h26-brand">
          <img src="/cox-logo-new.png" alt="Cox & Kings" />
        </Link>
        <nav className="h26-links hi-nav" aria-label="Primary">
          {NAV_MENU.map((group) => (
            <div className="hi-nav-group" key={group.label}>
              <Link to={group.href} className="hi-nav-top" aria-haspopup="true">
                {group.label}
                <ChevronDown size={14} className="hi-nav-caret" aria-hidden="true" />
              </Link>
              <div className="hi-nav-flyout" role="menu">
                <div className="hi-nav-flyout-inner">
                  <p className="hi-nav-blurb">{group.blurb}</p>
                  <ul className="hi-nav-list">
                    {group.items.map((it) => (
                      <li key={it.label}>
                        <Link to={it.to} role="menuitem" className="hi-nav-item">
                          <span className="hi-nav-item-label">{it.label}</span>
                          <span className="hi-nav-item-desc">{it.desc}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </nav>
        <div className="h26-nav-cta">
          <a href={CONTACT.phoneHref} className="h26-phone">
            <Phone size={15} /> <span>{CONTACT.phoneDisplay}</span>
          </a>
          <Link to="/contact" className="h26-btn h26-btn-pill">Talk to an expert</Link>
          <button className="h26-burger" aria-label="Menu" onClick={() => setMenuOpen(true)}>
            <Menu size={22} />
          </button>
        </div>
      </header>

      {/* Mobile slide-in menu */}
      <div className={`h26-menu${menuOpen ? ' is-open' : ''}`} aria-hidden={!menuOpen}>
        <div className="h26-menu-scrim" onClick={() => setMenuOpen(false)} />
        <div className="h26-menu-panel" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="h26-menu-top">
            <button className="h26-menu-close" aria-label="Close menu" onClick={() => setMenuOpen(false)}><X size={20} /></button>
            <img className="h26-menu-logo" src="/cox-logo-new.png" alt="Cox & Kings — Est. 1758" />
          </div>
          <nav className="h26-menu-primary" aria-label="Mobile primary">
            <Link to="/journeys/japan" onClick={() => setMenuOpen(false)}>Japan journeys<span className="h26-menu-chev"><ArrowRight size={16} /></span></Link>
            <Link to="/japan" onClick={() => setMenuOpen(false)}>Cherry Blossom Japan<span className="h26-menu-chev"><ArrowRight size={16} /></span></Link>
            <Link to="/essence-japan" onClick={() => setMenuOpen(false)}>Essence of Japan<span className="h26-menu-chev"><ArrowRight size={16} /></span></Link>
            <Link to="/journeys" onClick={() => setMenuOpen(false)}>All destinations<span className="h26-menu-chev"><ArrowRight size={16} /></span></Link>
          </nav>
          <div className="h26-menu-divider" />
          <div className="h26-menu-secondary">
            <Link to="/journeys" onClick={() => setMenuOpen(false)}>All journeys <ArrowUpRight size={13} /></Link>
            <Link to="/improved" onClick={() => setMenuOpen(false)}>Home <ArrowUpRight size={13} /></Link>
            <Link to="/about" onClick={() => setMenuOpen(false)}>Our story <ArrowUpRight size={13} /></Link>
            <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact <ArrowUpRight size={13} /></Link>
          </div>
          <a href={CONTACT.phoneHref} className="h26-btn h26-btn-pill h26-menu-cta" onClick={() => setMenuOpen(false)}>
            <Phone size={16} /> Speak to an expert
          </a>
          <div className="h26-menu-foot">
            <span className="h26-menu-eyebrow">Follow the journey</span>
            <div className="h26-menu-social">
              <a href="#" aria-label="Instagram"><Instagram size={18} /></a>
              <a href="#" aria-label="Facebook"><Facebook size={18} /></a>
              <a href="#" aria-label="YouTube"><Youtube size={18} /></a>
              <a href="#" aria-label="LinkedIn"><Linkedin size={18} /></a>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- HERO BANNER ---------- */}
      <section className="jl-hero">
        <div className="jl-hero-bg" style={{ backgroundImage: `url(${img(HERO_IMG, 1800)})` }} aria-hidden="true" />
        <div className="jl-hero-veil" aria-hidden="true" />
        <div className="jl-hero-inner">
          <Reveal className="h26-label jl-hero-eyebrow" as="p">
            Japan · {TOUR_COUNT} handcrafted journeys
          </Reveal>
          <h1 className="jl-hero-title">
            <WordReveal text="Japan, at your own pace" accent={[0]} />
          </h1>
          <Reveal className="jl-hero-sub" as="p" delay={0.15}>
            Cherry blossom to neon, temple gardens to bullet trains — the land of the rising sun,
            shaped by specialists who know it first-hand. A little about the country, our Japan
            journeys, and the food you simply have to eat while you're there.
          </Reveal>
          <Reveal className="jp-hero-actions" as="div" delay={0.24}>
            <a href="#tours" className="h26-btn h26-btn-accent h26-btn-lg">View Japan journeys <ArrowRight size={16} /></a>
            <a href="#food" className="h26-btn h26-btn-glass h26-btn-lg"><Utensils size={16} /> What to eat</a>
          </Reveal>
        </div>
      </section>

      {/* ---------- A LITTLE ABOUT JAPAN ---------- */}
      <section className="jp-about" aria-labelledby="about-japan">
        <span className="jp-about-glyph" aria-hidden="true">日本</span>
        <div className="jp-wrap">
          {/* Editorial intro — headline + lede on the left, a refined
              "Good to know" facts panel on the right. */}
          <div className="jp-about-top">
            <div className="jp-about-intro">
              <Reveal className="h26-label jp-eyebrow" as="p">The destination</Reveal>
              <Reveal as="h2" className="jp-title" id="about-japan" delay={0.04}>
                A little about <em>Japan</em>
              </Reveal>
              <Reveal as="p" className="jp-lede" delay={0.08}>
                Few countries hold their opposites so gracefully. In Japan, a 1,300-year-old temple
                stands a train stop from the world's busiest crossing; a bullet train glides at 300 km/h
                past rice paddies unchanged for centuries. It is spotless, courteous and astonishingly
                easy to travel — and endlessly rewarding for the curious.
              </Reveal>
            </div>

            <Reveal className="jp-facts" delay={0.12} as="aside">
              <p className="jp-facts-title">Good to know</p>
              {FACTS.map((f) => (
                <div className="jp-fact" key={f.label}>
                  <span className="jp-fact-ic"><f.icon size={17} aria-hidden="true" /></span>
                  <div className="jp-fact-txt">
                    <span className="jp-fact-label">{f.label}</span>
                    <span className="jp-fact-value">{f.value}</span>
                  </div>
                </div>
              ))}
            </Reveal>
          </div>

          {/* Regional highlights — image cards with an overlaid caption */}
          <div className="jp-hl-head">
            <Reveal className="h26-label jp-eyebrow" as="p">Where you'll go</Reveal>
            <Reveal as="p" className="jp-hl-sub" delay={0.04}>
              Four corners of the country, each worth the journey on its own.
            </Reveal>
          </div>
          <div className="jp-highlights">
            {HIGHLIGHTS.map((h, i) => (
              <Reveal className="jp-hl" key={h.name} delay={0.05 * i} y={24} as="article">
                <Link to={h.to} className="jp-hl-link" aria-label={`Explore ${h.name} — journeys, food & more`}>
                  <div className="jp-hl-media">
                    <img src={img(h.image, 700)} alt={h.name} loading="lazy" />
                    <span className="jp-hl-scrim" aria-hidden="true" />
                    <div className="jp-hl-cap">
                      <span className="jp-hl-idx">{String(i + 1).padStart(2, '0')}</span>
                      <h3 className="jp-hl-name">{h.name}</h3>
                      <p className="jp-hl-note">{h.note}</p>
                      <span className="jp-hl-cta">Explore {h.name} <ArrowRight size={15} aria-hidden="true" /></span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- THE JAPAN JOURNEYS — two carousels ---------- */}
      <main className="jl-results jp-tours" id="tours">
        <div className="jl-collections">
          <Rail
            id="rail-group"
            label={`${GROUP_TOURS.length} journeys · tour-manager led`}
            title="Group tours & expert-guided"
            sub="Escorted, fixed departures with a tour manager throughout — everything handled, fine company along the way."
          >
            {GROUP_TOURS.map((j, i) => <JourneyCard key={j.id} j={j} i={i} onPhotos={openPhotos} />)}
          </Rail>
          <Rail
            id="rail-private"
            label={`${PRIVATE_TOURS.length} journeys · just for you`}
            title="Private & tailor-made"
            sub="Designed one-to-one around your dates and your pace — private guides, elevated stays and rare access."
          >
            {PRIVATE_TOURS.map((j, i) => <JourneyCard key={j.id} j={j} i={i} onPhotos={openPhotos} />)}
          </Rail>
        </div>
      </main>

      {/* ---------- THE FOOD PEOPLE EAT IN JAPAN — carousel ---------- */}
      <section className="jp-food" id="food" aria-labelledby="rail-food">
        <div className="jl-collections">
          <Rail
            id="rail-food"
            label="What's on the table"
            title="The food people eat in Japan"
            sub="Regional, seasonal and taken seriously — from a ¥900 bowl of ramen to a hushed kaiseki tasting. Swipe through the dishes you'll actually eat."
            railClass="jl-rail-food"
          >
            {DISHES.map((d) => <DishCard key={d.name} d={d} />)}
          </Rail>

          {/* Restaurant recommendations — horizontal carousel */}
          <Rail
            id="rail-resto"
            label="Reservations"
            title="Where to eat — our recommendations"
            sub="From bucket-list counters to easy neighbourhood favourites — swipe through, and book the table as part of your trip."
            railClass="jl-rail-resto"
          >
            {RESTAURANTS.map((r) => <RestoCard key={r.name} r={r} />)}
          </Rail>
        </div>
        <div className="jp-resto-footwrap">
          <Reveal as="p" className="jp-resto-foot" delay={0.1}>
            Want a table at any of these? Your Cox &amp; Kings specialist can request reservations
            as part of your itinerary — including the counters that book out months ahead.
          </Reveal>
        </div>
      </section>

      {/* ---------- CLOSING CTA ---------- */}
      <section className="jl-cta">
        <div className="jl-cta-bg" style={{ backgroundImage: `url(${img(U('1493976040374-85c8e12f0c0e'), 1800)})` }} aria-hidden="true" />
        <div className="jl-cta-veil" aria-hidden="true" />
        <div className="jl-cta-inner">
          <Reveal className="h26-label jl-cta-eyebrow" as="span">Dreaming of Japan?</Reveal>
          <Reveal as="h2" className="jl-cta-title" delay={0.05}>
            Tell us when you'd like to go.<br /><strong>We'll shape the perfect Japan around you.</strong>
          </Reveal>
          <Reveal className="jl-cta-actions" delay={0.12}>
            <a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer" className="h26-btn h26-btn-accent h26-btn-lg"><MessageCircle size={17} /> WhatsApp us</a>
            <Link to="/contact" className="h26-btn h26-btn-glass h26-btn-lg"><PhoneCall size={16} /> Schedule a callback</Link>
          </Reveal>
          <Reveal as="p" className="jl-cta-hours" delay={0.18}>Travel experts available 9am–9pm IST, every day.</Reveal>
        </div>
      </section>

      {/* ---------- FOOTER (shared /improved chrome) ---------- */}
      <footer className="h26-footer">
        <div className="h26-footer-top">
          <div className="h26-footer-brand">
            <img src="/cox-logo-new.png" alt="Cox & Kings" />
            <p>The world's most experienced travel company. Established 1758.</p>
            <div className="h26-footer-contact">
              <a href={CONTACT.phoneHref}><Phone size={15} /> {CONTACT.phoneDisplay}</a>
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            </div>
          </div>
          <div className="h26-footer-cols">
            <div>
              <h4>Japan</h4>
              <Link to="/japan">Cherry Blossom Japan</Link>
              <Link to="/essence-japan">Essence of Japan</Link>
              <Link to="/journeys/japan">All Japan journeys</Link>
              <Link to="/journeys">Other destinations</Link>
            </div>
            <div>
              <h4>Company</h4>
              <Link to="/about">Our story</Link>
              <Link to="/about">Specialists</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/improved#trust">Why Cox &amp; Kings</Link>
            </div>
            <div>
              <h4>Assurance</h4>
              <Link to="/improved#trust">Trust &amp; safety</Link>
              <Link to="/improved#trust">Awards</Link>
              <Link to="/contact">Refund policy</Link>
              <Link to="/contact">Speak to an expert</Link>
            </div>
          </div>
        </div>
        <div className="h26-footer-bottom">
          <span>© {new Date().getFullYear()} Cox &amp; Kings. Travelling the world since 1758.</span>
          <span className="h26-footer-assoc">IATA · TAAI · ASTA</span>
        </div>
      </footer>

      {/* ---------- PHOTO LIGHTBOX ---------- */}
      <AnimatePresence>
        {lightbox && <Lightbox data={lightbox} onClose={() => setLightbox(null)} />}
      </AnimatePresence>
    </div>
  );
}
