/* ============================================================
   New3 — the /new-homepage composite with the /luxe2-improved
   HERO (route /new3).

   Identical to /new-homepage in every respect — same navbar, same
   Cormorant Garamond + Work Sans typography, same intro / fork /
   destinations / heritage / clips / reviews / press / relaxed-pace
   sections and footer — except the hero.

   The hero is the /luxe2-improved one, ported whole: its own
   ken-burns photo + veil (rather than the shared fixed backdrop),
   the bottom-anchored headline, the glass search bar with the
   typewriter "Where to?" field, the rating line, the "Popular right
   now" quick picks, the rotating glass stat chips and the scroll cue.

   Only the sheet's -4vh pull-up is dropped (see New3.css): the lx2i
   hero paints above the sheet so its search dropdowns can overflow,
   so the two must not overlap.
   ============================================================ */
import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { SmartLink as Link, CALLBACK, useScheduleCall } from '../components/ScheduleCall';
import { SiteNav, SiteFooter } from '../components/SiteChrome';
import { motion, useScroll, useTransform, useMotionValue, useSpring, useReducedMotion, AnimatePresence } from 'framer-motion';
import {
  Phone, MessageCircle, ArrowRight, ArrowLeft, ArrowUpRight, Star, Search, MapPin,
  Compass, Calendar, ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  Check, Sparkles, Quote,
  Award, ShieldCheck, Globe2, Clock, Users, User, Gauge,
} from 'lucide-react';
import {
  img, CONTACT, RATING, DESTINATIONS, ASSURANCE, EXPERTS, REELS,
} from '../data/v3content';
import ChatBot from '../components/ChatBot';
import './Home2026.css';
import './Home2026Improved.css';
import './Luxe2Improved.css';
import './Journeys.css';
import './Journeys2.css';
import './Journeys4.css';  // the shelf uses the /journeys4 card
import './NewTypography.css'; // Cormorant Garamond (primary) + Work Sans (secondary)
import './New3.css';           // seats the lx2i hero inside the h26 page

/* ---------- Shared contact (matches /improved & /luxe2-improved) ---------- */
const CONTACT_IMP = {
  ...CONTACT,
  phoneDisplay: '+91 8556001700',
  phoneHref: 'tel:+918556001700',
  whatsappHref: 'https://wa.me/918556001700',
};

/* The nav's own NAV_MENU used to live here. It now lives in <SiteChrome>,
   which is the single definition of the menu for every page. */

/* --- Tabler icons for the Clips section (from /improved) --- */
const TiBase = ({ size = 24, filled = false, children, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true" {...rest}>{children}</svg>
);
const TiPlay = (p) => <TiBase filled {...p}><path d="M7 4v16l13 -8z" /></TiBase>;
const TiHeart = (p) => <TiBase {...p}><path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.572a5 5 0 1 1 7.5 6.572" /></TiBase>;
const TiBookmark = (p) => <TiBase {...p}><path d="M18 7v14l-6 -4l-6 4v-14a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4z" /></TiBase>;
const TiShare = (p) => (
  <TiBase {...p}>
    <path d="M6 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <path d="M18 6m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <path d="M18 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <path d="M8.7 10.7l6.6 -3.4" />
    <path d="M8.7 13.3l6.6 3.4" />
  </TiBase>
);
const TiMessage = (p) => (
  <TiBase {...p}>
    <path d="M3 20l1.3 -3.9a9 8 0 1 1 3.4 2.9l-4.7 1" />
    <path d="M12 12l0 .01" /><path d="M8 12l0 .01" /><path d="M16 12l0 .01" />
  </TiBase>
);
const TiSend = (p) => (
  <TiBase {...p}>
    <path d="M10 14l11 -11" />
    <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5" />
  </TiBase>
);
const TiChevronUp = (p) => <TiBase {...p}><path d="M6 15l6 -6l6 6" /></TiBase>;
const TiChevronDown = (p) => <TiBase {...p}><path d="M6 9l6 6l6 -6" /></TiBase>;
const TiX = (p) => <TiBase {...p}><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></TiBase>;

/* Per-thumbnail cursor-parallax depth for the scatter grid. */
const SCATTER_DEPTH = [34, -26, 44, -38, 28, -46, 22];

/* --- Reel "reviews" (comments) — light, per-clip traveller chatter --- */
const REEL_COMMENT_AUTHORS = [
  { n: 'Anjali Mehta', a: 'https://images.unsplash.com/photo-1628264047320-49bab8dc07d6' },
  { n: 'Suresh Iyer', a: 'https://images.unsplash.com/photo-1624202090198-d6f758540f18' },
  { n: 'Priya Nair', a: 'https://images.unsplash.com/photo-1496813146940-1601b02f81a4' },
  { n: 'Rohit Kapoor', a: 'https://images.unsplash.com/photo-1618306842557-a2515acf2112' },
];
const REEL_COMMENT_TEXTS = [
  (r) => `${r.place.split(',')[0]} just shot to the top of our list. Saved this! 😍`,
  (r) => `Booked our ${r.tag} trip with Cox & Kings after a reel like this. No regrets.`,
  (r) => `The colours are unreal. How many days do you need to do it properly?`,
  (r) => `That’s exactly the kind of trip my parents would love. Sending them this.`,
];
const REEL_COMMENT_LIKES = ['2.1k', '864', '413', '120'];
function buildReelComments(r) {
  return REEL_COMMENT_AUTHORS.map((au, i) => ({
    id: `${r.id}-c${i}`, name: au.n, avatar: au.a,
    text: REEL_COMMENT_TEXTS[i](r), likes: REEL_COMMENT_LIKES[i],
  }));
}

/* ---------- HERO (ported from /luxe2-improved) ----------
   The rotating glass chips, the three search dropdowns, the typewriter
   suggestions that cycle through the "Where to?" field while it is idle,
   and the above-the-fold quick picks. */
const HERO_STATS = [
  'Est. 1758',
  '2,400+ Traveller Reviews',
  '100+ Destinations',
  'Private, Tailor-Made',
  '24/7 Concierge',
];
/* ---------- Where the hero search lands ----------
   /journeys4 is the listing page (the old /journeys is retired). Its filters
   seed from the URL by EXACT match against its own vocabulary — `seedList`
   does `valid.includes(v)` — so a loose value like "Kyoto, Japan" is silently
   dropped and the search would land unfiltered.

   So resolve the evocative label the traveller picked to the canonical region
   the catalogue actually files it under, before building the URL. Anything that
   doesn't resolve (someone typing freely) is passed as ?q=, which /journeys4
   runs as a full-text search rather than discarding. */
const JOURNEYS_PATH = '/journeys4';

/* Canonical regions, mirroring REGIONS in Journeys4.jsx. */
const REGION_ALIASES = [
  [/(india|rajasthan|kerala|goa|delhi|jaipur|udaipur|taj|golden triangle)/, 'India'],
  [/(japan|kyoto|tokyo)/, 'Japan'],
  [/(switzer|swiss|alps|zermatt|lucerne)/, 'Switzerland'],
  [/(ital|amalfi|rome|tuscan|venice)/, 'Italy'],
  [/(northern light|scandinav|arctic|aurora|norway|iceland|finland)/, 'Northern Lights'],
  [/(australia|new zealand|\bnz\b)/, 'Australia & NZ'],
  [/(africa|safari|kenya|tanzania)/, 'Africa Safari'],
  [/(southeast asia|thailand|vietnam|bali|indonesia|cambodia|sri lanka)/, 'Southeast Asia'],
  [/maldive/, 'Maldives'],
  [/(usa|america|united states|canada)/, 'USA'],
  [/(europe|greece|santorini|mykonos|spain|portugal|christmas market)/, 'Europe'],
];
function toRegion(raw) {
  const q = (raw || '').trim().toLowerCase();
  if (!q) return null;
  for (const [re, region] of REGION_ALIASES) if (re.test(q)) return region;
  return null;
}

/* Every entry must resolve above, or Search dead-ends on "0 journeys". Luxe2's
   list offered Rajasthan, for which there is no India catalogue at all. */
const HERO_POPULAR_DEST = [
  'Rajasthan, India', 'Kyoto, Japan', 'The Maldives', 'Bali, Indonesia',
  'Swiss Alps', 'Amalfi Coast, Italy', 'African Safari', 'Santorini, Greece',
];
/* The "open it right up" escape hatch, offered in all three search fields.

   Phrased as an invitation ("show me all") rather than as a deficiency ("I
   don't have a preference") — not having decided yet is the normal state early
   in planning a holiday, and the copy shouldn't make it feel like a failing.

   Presented identically in each field: same sparkle, same "Any… — show me all"
   wording, same spot at the foot of the dropdown, so it reads as one recurring
   choice rather than three unrelated ones. Each simply omits its filter, which
   widens the search rather than narrowing it to nothing. */
const ANY_DEST = 'Anywhere';
const ANY_WHO = { label: 'Anyone', any: true };

/* "Who's travelling?" — each option maps onto a filter /journeys actually
   applies, so the Search button lands on a genuinely filtered list rather than
   a query string nothing reads. `style` matches its STYLES list; seniors have
   no style of their own, so they map to the Relaxed pace instead.

   `key` is the stable slug carried to a COUNTRY page (e.g. ?who=couple), where
   it seeds that page's own "Who's travelling" filter — the country pages don't
   share /journeys4's style/pace vocabulary, so they key off this instead. */
const HERO_WHO_OPTS = [
  { key: 'couple', label: 'Couple — just the two of us', style: 'Honeymoon' },
  { key: 'family', label: 'Family with children', style: 'Family' },
  { key: 'friends', label: 'A group of friends', style: 'Group Tour' },
  { key: 'seniors', label: 'Senior travellers', pace: 'Relaxed' },
  { key: 'solo', label: 'Travelling solo', style: 'Bespoke Private' },
];
/* Same rule as HERO_POPULAR_DEST — "Rajasthan" returned nothing, so it is out. */
const HERO_QUICK_PICKS = ['India', 'Japan', 'Europe', 'Maldives', 'Safari'];

/* ---------- Country pages ----------
   Only Japan has one built. Everything else is a placeholder, so it must LOOK
   like a placeholder: previously all eight destination cards linked to
   /journeys/japan, which meant clicking "Italy" or "Maldives" quietly landed
   you on Japan. Better to say "coming soon" than to lie.

   Keyed by the canonical region (see toRegion), so "Kyoto, Japan", "Japan" and
   the quick-pick chip all resolve to the same page. Add a route here as each
   country page ships. */
const DEST_PAGES = {
  Japan: '/journeys/japan-2',
};
const destPage = (name) => DEST_PAGES[toRegion(name) || name] || null;

/* Where a specific destination lands when its country page isn't built yet —
   an honest "coming soon" screen rather than a silent redirect to Japan. */
const COMING_SOON_PATH = '/journeys/coming-soon';

/* --- "When" calendar (the hi-cal-* component the /improved hero used).
   Replaces luxe2's fixed "Next 3 months / Later in 2026 / …" option list, so
   a traveller can pick a real departure date and a flexibility window. --- */
const WK_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MON_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
/* Must mirror FLEX_STEPS in Journeys4.jsx — it validates ?flex= against that
   exact list, so an off-list value (it has no ±1) silently arrives as 0. */
const FLEX_OPTS = [0, 2, 3, 4];
function buildCalendar(monthStart) {
  const y = monthStart.getFullYear(), m = monthStart.getMonth();
  const firstDow = new Date(y, m, 1).getDay();
  const daysIn = new Date(y, m + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysIn; d++) cells.push(new Date(y, m, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}
const sameDay = (a, b) => a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const TRIP_SUGGESTIONS = [
  'Santorini, Greece',
  'Kyoto, Japan',
  'the Serengeti',
  'Rajasthan, India',
  'the Maldives',
  'the Amalfi Coast',
];

/* One floating thumbnail: scroll drift (y) blended with cursor parallax. */
function ScatterImg({ src, cls, driftY, mx, my, depth }) {
  const x = useTransform(mx, (v) => v * depth);
  const y = useTransform([driftY, my], ([d, m]) => d + m * depth * 0.6);
  return (
    <motion.img
      style={{ x, y }}
      whileHover={{ scale: 1.14, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
      className={`h26-scatter ${cls}`}
      src={src}
      alt=""
      loading="lazy"
    />
  );
}

/* The cinematic backdrop the sheet scrolls over. */

/* Scattered thumbnails for the intro statement grid. */
const SCATTER = [
  { src: img('https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e', 500), c: 's1' },
  { src: img('https://images.unsplash.com/photo-1528127269322-539801943592', 500), c: 's2' },
  { src: img('https://images.unsplash.com/photo-1516483638261-f4dbaf036963', 500), c: 's3' },
  { src: img('https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d', 500), c: 's4' },
  { src: img('https://images.unsplash.com/photo-1467269204594-9661b134dd2b', 500), c: 's5' },
  { src: img('https://images.unsplash.com/photo-1514282401047-d79a71a590e8', 500), c: 's6' },
  { src: img('https://images.unsplash.com/photo-1523906834658-6e24ef2386f9', 500), c: 's7' },
];

/* Hand-tuned spans so the 8-card destination grid tiles with zero gaps. */
const DEST_SPANS = ['tall', 'wide', 'tall', 'wide', 'normal', 'normal', 'normal', 'normal'];

/* ---- Reusable blur-to-focus reveal (from /improved) ---- */
function Reveal({ children, className = '', delay = 0, y = 24, as = 'div' }) {
  const M = motion[as] || motion.div;
  const reduce = useReducedMotion();
  if (reduce) return <M className={className}>{children}</M>;
  return (
    <M
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(14px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-12% 0px' }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </M>
  );
}

/* ---- Word-by-word blur reveal for display headlines ---- */
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
              transition={{ duration: 0.7, delay: delay + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              {w}
            </motion.span>
          )}{' '}
        </span>
      ))}
    </span>
  );
}

/* ---- Specialist head-shots (from /improved) ---- */
const IMP_EXPERT_PHOTOS = {
  'Meera Sundaram': 'https://images.unsplash.com/photo-1463335361701-e90f4c5045d0',
  'Arjun Rao': 'https://images.unsplash.com/photo-1618306842557-a2515acf2112',
  'Nisha Verma': 'https://images.unsplash.com/photo-1759840278361-f1adc75529a1',
};
const EXPERTS_IMP = EXPERTS.map((e) => ({ ...e, photo: IMP_EXPERT_PHOTOS[e.name] || e.photo }));

/* Full-screen vertical reel player — YouTube-Shorts style (from /improved). */
function ReelPlayer({ reels, index, setIndex, onClose }) {
  const reel = reels[index];
  const [saved, setSaved] = useState({});
  const [liked, setLiked] = useState({});
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [shared, setShared] = useState(false);
  const [hint, setHint] = useState(true);
  const [dir, setDir] = useState(1);
  const wheelLock = useRef(false);

  const isSaved = !!saved[reel.id];
  const isLiked = !!liked[reel.id];
  const comments = buildReelComments(reel);
  const go = (d) => { setDir(d); setIndex((i) => (i + d + reels.length) % reels.length); };

  useEffect(() => {
    setHint(true);
    const t = setTimeout(() => setHint(false), 2200);
    return () => clearTimeout(t);
  }, [index]);

  const onWheel = (e) => {
    if (wheelLock.current || Math.abs(e.deltaY) < 16) return;
    wheelLock.current = true;
    go(e.deltaY > 0 ? 1 : -1);
    setTimeout(() => { wheelLock.current = false; }, 480);
  };
  const onDragEnd = (_e, info) => {
    if (info.offset.y > 70 || info.velocity.y > 450) go(1);
    else if (info.offset.y < -70 || info.velocity.y < -450) go(-1);
  };

  const share = async () => {
    const url = `${window.location.origin}${window.location.pathname}#reels`;
    try {
      if (navigator.share) await navigator.share({ title: reel.title, text: `${reel.title} — ${reel.place}`, url });
      else { await navigator.clipboard.writeText(url); setShared(true); setTimeout(() => setShared(false), 1600); }
    } catch { /* user dismissed the share sheet */ }
  };

  const CommentList = (
    <ul className="h26-rcom-list">
      {comments.map((c) => (
        <li key={c.id} className="h26-rcom">
          <img src={img(c.avatar, 80)} alt="" loading="lazy" />
          <div>
            <strong>{c.name}</strong>
            <p>{c.text}</p>
            <span className="h26-rcom-like"><TiHeart size={12} filled /> {c.likes}</span>
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <motion.div
      className="h26-reelplayer"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      <button className="h26-reelplayer-close" aria-label="Close player" onClick={onClose}><TiX size={24} /></button>

      <div className="h26-reelplayer-shell" onClick={(e) => e.stopPropagation()}>
        <button className="h26-reelplayer-nav up" aria-label="Previous clip" onClick={() => go(-1)}><TiChevronUp size={26} /></button>

        <div className="h26-reelplayer-col">
          <motion.div
            key={reel.id}
            className="h26-reelplayer-stage"
            initial={{ opacity: 0, y: dir > 0 ? 64 : -64 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 34, mass: 0.7 }}
            onWheel={onWheel}
            drag="y"
            dragDirectionLock
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.45}
            onDragEnd={onDragEnd}
          >
            <img src={img(reel.poster, 900)} alt={reel.title} />
            <div className="h26-reelplayer-veil" />
            <span className="h26-reelplayer-live"><span className="h26-reelplayer-dot" /> Clip · {index + 1}/{reels.length}</span>
            <span className="h26-reelplayer-bigplay"><TiPlay size={28} /></span>

            <div className="h26-reelrail">
              <button type="button" className={`h26-reelrail-btn${isLiked ? ' is-on' : ''}`} onClick={() => setLiked((s) => ({ ...s, [reel.id]: !s[reel.id] }))} aria-pressed={isLiked} aria-label="Like">
                <span className="h26-reelrail-ic"><TiHeart size={23} filled={isLiked} /></span>
                <span>{isLiked ? '1.2k' : '1.1k'}</span>
              </button>
              <button type="button" className="h26-reelrail-btn" onClick={() => setCommentsOpen(true)} aria-label="Reviews">
                <span className="h26-reelrail-ic"><TiMessage size={23} /></span>
                <span>{comments.length}</span>
              </button>
              <button type="button" className={`h26-reelrail-btn${isSaved ? ' is-on' : ''}`} onClick={() => setSaved((s) => ({ ...s, [reel.id]: !s[reel.id] }))} aria-pressed={isSaved} aria-label="Save">
                <span className="h26-reelrail-ic"><TiBookmark size={23} filled={isSaved} /></span>
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </button>
              <button type="button" className="h26-reelrail-btn" onClick={share} aria-label="Share">
                <span className="h26-reelrail-ic"><TiShare size={22} /></span>
                <span>{shared ? 'Copied' : 'Share'}</span>
              </button>
            </div>

            <div className="h26-reelplayer-info">
              <span className="h26-reel-tag">{reel.tag}</span>
              <h3>{reel.title}</h3>
              <p>{reel.place} · {reel.views} views</p>
              <Link to="/tour-detail-japan-5" className="h26-btn h26-btn-accent">Explore this journey <ArrowRight size={16} /></Link>
            </div>

            <AnimatePresence>
              {hint && (
                <motion.div
                  className="h26-reelhint"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.span
                    className="h26-reelhint-ic"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
                  ><TiChevronDown size={22} /></motion.span>
                  <span className="h26-reelhint-txt"><b className="hi-mob-only">Swipe</b><b className="hi-desk-only">Scroll</b> for the next clip</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        <aside className="h26-reelpanel">
          <div className="h26-reelpanel-head">
            <strong>Traveller reviews</strong>
            <span>{comments.length} on this film</span>
          </div>
          {CommentList}
          <div className="h26-reelpanel-foot">
            <input type="text" placeholder="Add a review…" aria-label="Add a review" />
            <button type="button" aria-label="Post review"><TiSend size={16} /></button>
          </div>
        </aside>

        <button className="h26-reelplayer-nav down" aria-label="Next clip" onClick={() => go(1)}><TiChevronDown size={26} /></button>
      </div>

      <AnimatePresence>
        {commentsOpen && (
          <motion.div
            className="h26-rsheet"
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h26-rsheet-grab" />
            <div className="h26-rsheet-head">
              <strong>Traveller reviews</strong>
              <button type="button" aria-label="Close reviews" onClick={() => setCommentsOpen(false)}><TiX size={20} /></button>
            </div>
            {CommentList}
            <div className="h26-reelpanel-foot">
              <input type="text" placeholder="Add a review…" aria-label="Add a review" />
              <button type="button" aria-label="Post review"><TiSend size={16} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* Swipe indicator for the mobile horizontal carousels (from /improved). */
function CarouselDots({ scrollRef, count, label = 'cards' }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const compute = () => {
      const cards = Array.from(el.children);
      if (cards.length < 2) return;
      const base = cards[0].offsetLeft;
      let idx = 0, best = Infinity;
      cards.forEach((c, i) => {
        const d = Math.abs((c.offsetLeft - base) - el.scrollLeft);
        if (d < best) { best = d; idx = i; }
      });
      setActive(Math.min(idx, count - 1));
    };
    compute();
    el.addEventListener('scroll', compute, { passive: true });
    window.addEventListener('resize', compute);
    return () => { el.removeEventListener('scroll', compute); window.removeEventListener('resize', compute); };
  }, [scrollRef, count]);
  const go = (i) => {
    const el = scrollRef.current;
    if (!el) return;
    const cards = Array.from(el.children);
    if (!cards[i]) return;
    el.scrollTo({ left: cards[i].offsetLeft - cards[0].offsetLeft, behavior: 'smooth' });
  };
  return (
    <div className="hi-dots" role="tablist" aria-label={`Swipe through ${label}`}>
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          type="button"
          className={`hi-dot${i === active ? ' is-active' : ''}`}
          aria-label={`Show ${label} ${i + 1} of ${count}`}
          aria-selected={i === active}
          onClick={() => go(i)}
        />
      ))}
    </div>
  );
}

/* ============================================================
   From /luxe2-improved — heritage, reviews, press
   ============================================================ */
const sizedUnsplash = (id, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const TRUST_BADGES = [
  { icon: Star, stat: '4.9★', label: 'from 2,400+ verified reviews' },
  { icon: Award, stat: 'Condé Nast 2024', label: 'Readers’ Choice Award, India' },
  { icon: ShieldCheck, stat: 'Since 1758', label: '267 years · financially protected' },
  { icon: Globe2, stat: '100+ countries', label: 'on all seven continents' },
];

const LX_REVIEWS = [
  { name: 'Mr & Mrs Iyer', age: 'Both 67', trip: 'Europe · Escorted Group Tour', rating: 5, span: 'tall',
    text: 'We worried the pace would be too much at our age - it was perfectly gentle. The tour manager carried our bags and found us Jain meals every single day.',
    ids: ['1630001722538-a9a540da549b', '1529156069898-49953e39b3ac', '1642342397404-fed6450eb964'] },
  { name: 'Sunita Rao', age: '', trip: 'Japan · Cherry Blossom', rating: 5, span: 'tall',
    text: 'Flawless from start to finish. The cherry blossom viewing in Kyoto was a once-in-a-lifetime moment, arranged beautifully.',
    ids: ['1567122087721-47b09b61e1d1', '1667029839636-af119b059c49', '1639979511572-ff346bc5b3b7'] },
  { name: 'Arjun & Meera', age: '', trip: 'Maldives · Honeymoon', rating: 5, span: 'tall',
    text: 'An overwater villa, a private sandbank dinner, and not a single thing to worry about. Pure magic.',
    ids: ['1677179974826-b6619bd77506', '1677176455554-03ae366d51d5', '1639979511514-904e46c8c13f'] },
  { name: 'The Nair Family', age: '3 generations', trip: 'Switzerland · Escorted Group Tour', rating: 5, span: 'tall',
    text: 'Grandparents, parents and two kids - all looked after. The fixed departure meant zero planning stress and the kids still talk about the Glacier Express.',
    ids: ['1758272959663-b30513083206', '1715745218436-5a583702447a', '1580825175616-77f8df1bb507'] },
  { name: 'Rohan Kapoor', age: '', trip: 'Kenya · Safari', rating: 5, span: 'tall',
    text: 'We watched the migration cross the Mara at dawn. The lodge, the guides, the timing - all impeccable.',
    ids: ['1539635278303-d4002c07eae3', '1581866548373-e6b8e1d0342c', '1758272959063-ef8a2114f807'] },
  { name: 'Priya Menon', age: '', trip: 'Italy · Tailor-Made', rating: 5, span: 'tall',
    text: 'A private gondola, a chef in Tuscany, a guide who opened doors most tourists never see. Worth every rupee.',
    ids: ['1721884487052-8fb79415772c', '1763643820621-d775cf3ae5dd', '1506869640319-fe1a24fd76dc'] },
];

/* Brand marks for the review-credibility strip (inline, no asset deps). */
const GoogleG = () => (
  <svg viewBox="0 0 48 48" width="16" height="16" aria-hidden="true">
    <path fill="#4285F4" d="M47.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h13.2c-.6 3-2.3 5.6-4.9 7.3v6h7.9c4.6-4.3 7.3-10.5 7.3-17.8z" />
    <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.9-6c-2.2 1.5-5 2.3-8 2.3-6.1 0-11.3-4.1-13.2-9.6H2.6v6.2C6.6 42.6 14.6 48 24 48z" />
    <path fill="#FBBC05" d="M10.8 28.9c-.5-1.5-.8-3-.8-4.6s.3-3.1.8-4.6v-6.2H2.6C.9 16.1 0 19.9 0 24s.9 7.9 2.6 11.1l8.2-6.2z" />
    <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.9 2.4 30.5 0 24 0 14.6 0 6.6 5.4 2.6 13.4l8.2 6.2C12.7 13.6 17.9 9.5 24 9.5z" />
  </svg>
);
const TripAdvisorOwl = () => (
  <svg viewBox="0 0 132 80" width="24" height="15" aria-hidden="true">
    <circle cx="38" cy="42" r="32" fill="#34E0A1" />
    <circle cx="94" cy="42" r="32" fill="#34E0A1" />
    <circle cx="38" cy="42" r="18" fill="#fff" />
    <circle cx="94" cy="42" r="18" fill="#fff" />
    <circle cx="38" cy="42" r="9" fill="#000" />
    <circle cx="94" cy="42" r="9" fill="#000" />
    <path d="M52 2 Q66 14 80 2 L66 22 Z" fill="#000" />
  </svg>
);

/* One review card: a small photo gallery that auto-slides on hover. */
function ReviewCard({ r, i }) {
  const ids = r.ids && r.ids.length ? r.ids : (r.id ? [r.id] : []);
  const [idx, setIdx] = useState(0);
  const timer = useRef(null);
  const reduce = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const start = () => {
    if (reduce || ids.length < 2 || timer.current) return;
    timer.current = setInterval(() => setIdx((n) => (n + 1) % ids.length), 1300);
  };
  const stop = () => {
    if (timer.current) { clearInterval(timer.current); timer.current = null; }
    setIdx(0);
  };
  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);

  return (
    <figure
      className={`lx2i-rcard ${r.span ? `lx2i-rcard--${r.span}` : ''} lx2i-reveal`}
      style={{ '--d': `${(i % 3) * 0.08}s` }}
      onMouseEnter={start}
      onMouseLeave={stop}
    >
      <div
        className="lx2i-rcard__slides"
        style={{ transform: `translateX(-${idx * 100}%)` }}
        onClick={ids.length > 1 ? () => setIdx((n) => (n + 1) % ids.length) : undefined}
        role={ids.length > 1 ? 'button' : undefined}
        aria-label={ids.length > 1 ? 'Next photo' : undefined}
      >
        {ids.map((id, k) => (
          <div
            key={id + k}
            className="lx2i-rcard__slide"
            style={{ backgroundImage: `url(${sizedUnsplash(id, 800)})` }}
            role="img"
            aria-label={`${r.trip} - photo ${k + 1} of ${ids.length} by ${r.name}`}
          />
        ))}
      </div>
      {ids.length > 1 && (
        <div className="lx2i-rcard__dots">
          {ids.map((id, k) => (
            <button
              key={id + k}
              type="button"
              className={`lx2i-rcard__dot ${k === idx ? 'is-on' : ''}`}
              aria-label={`Show photo ${k + 1}`}
              aria-current={k === idx}
              onMouseEnter={() => setIdx(k)}
              onClick={() => setIdx(k)}
            />
          ))}
        </div>
      )}
      <figcaption className="lx2i-rcard__glass lx2i-glass">
        <div className="lx2i-rcard__meta">
          <div>
            <strong>{r.name}{r.age && <em className="lx2i-rcard__age"> · {r.age}</em>}</strong>
            <span>{r.trip}</span>
          </div>
          <span className="lx2i-stars">{[...Array(r.rating)].map((_, j) => <Star key={j} size={12} fill="currentColor" />)}</span>
        </div>
        <p className="lx2i-rcard__text"><Quote size={15} className="lx2i-rcard__q" />{r.text}</p>
      </figcaption>
    </figure>
  );
}

const LX_PRESS = [
  { name: 'Condé Nast Traveler', src: '/press/cntraveller.svg' },
  { name: 'National Geographic', src: '/press/natgeo.svg' },
  { name: 'Travel + Leisure', src: '/press/travel-leisure.svg' },
  { name: 'Forbes', src: '/press/forbes.svg' },
  { name: "Harper's Bazaar", src: '/press/harpers-bazaar.svg' },
  { name: 'The Telegraph', src: '/press/telegraph.svg' },
];

/* Scroll-reveal for the lx2i-reveal elements (from /luxe2-improved). */
function useLxReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.lx2i-reveal');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { els.forEach((e) => e.classList.add('in')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);
}

/* Count-up stat — rest state is ALWAYS the final number. */
function useCountUp(target, run) {
  const [val, setVal] = useState(target);
  useEffect(() => {
    if (!run) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setVal(target); return; }
    const from = Math.round(target * 0.82);
    let raf; const start = performance.now(); const dur = 1100;
    setVal(from);
    const tick = (now) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(from + (target - from) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setVal(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run]);
  return val;
}

function Stat({ value, suffix, label, run }) {
  const v = useCountUp(value, run);
  return (
    <div className="lx2i-stat">
      <span className="lx2i-stat__num">{v}{suffix}</span>
      <span className="lx2i-stat__lbl">{label}</span>
    </div>
  );
}

/* ============================================================
   From /journeys — the "Relaxed pace, for a calm vacation" shelf
   ============================================================ */
const U = (id) => `https://images.unsplash.com/photo-${id}`;
const REGION_PHOTOS = {
  Japan: [U('1522383225653-ed111181a951'), U('1492571350019-22de08371fd3'), U('1493976040374-85c8e12f0c0e'), U('1490806843957-31f4c9a91c65'), U('1528360983277-13d401cdc186'), U('1540959733332-eab4deabeeaf')],
  Switzerland: [U('1530122037265-a5f1f91d3b99'), U('1467269204594-9661b134dd2b')],
  Italy: [U('1534445867742-43195f401b6c'), U('1523906834658-6e24ef2386f9'), U('1467269204594-9661b134dd2b')],
  'Australia & NZ': [U('1506973035872-a4ec16b8e8d9'), U('1469521669194-babb45599def'), U('1507699622108-4be3abd695ad')],
  'Southeast Asia': [U('1528181304800-259b08848526'), U('1546708973-b339540b5162')],
  Maldives: [U('1514282401047-d79a71a590e8'), U('1546708973-b339540b5162')],
};
const GROUP_BY_STYLE = {
  'Group Tour': 'Small group · max 18',
  'Bespoke Private': 'Private & tailor-made',
  Luxury: 'Private guiding',
  Family: 'Family-friendly',
  Honeymoon: 'Just the two of you',
  Safari: 'Small-group safari',
};
function buildGallery(o) {
  const pool = REGION_PHOTOS[o.regions[0]] || [];
  return [...new Set([o.image, ...pool])].slice(0, 5);
}
/* Binary tour-type badge, mirroring Journeys4.jsx: escorted, fixed-departure
   trips read as a "Group Tour"; everything designed around the travellers
   themselves reads as a "Private Tour". Data-driven off the trip style. */
const GROUP_STYLES = ['Group Tour', 'Safari'];
const tourTypeOf = (style) => (GROUP_STYLES.includes(style) ? 'Group Tour' : 'Private Tour');

const J = (o) => ({
  ...o,
  priceLabel: `₹${o.price.toLocaleString('en-IN')}`,
  nightsLabel: `${o.nights} nights`,
  group: GROUP_BY_STYLE[o.style],
  tourType: tourTypeOf(o.style),
  gallery: buildGallery(o),
  /* Every tour card opens its own detail page. Only two detail templates exist
     today (Japan / Thailand), kept explicitly on those cards; the rest route to
     /tour-detail-<id>, which has no page yet and lands on the dev-facing 404
     (it links the two live templates). Bare CALLBACK cards become detail links. */
  to: o.to && o.to !== CALLBACK ? o.to : `/tour-detail-${o.id}`,
});
/* The relaxed-pace journeys shown on this page's shelf. */
const RELAXED_JOURNEYS = [
  J({ id: 'jp-luxe', title: 'Japan: Ryokans & Art Islands', blurb: 'Slow luxury, with design hotels, private onsen and the Naoshima art islands.', regions: ['Japan'], style: 'Luxury', pace: 'Relaxed', rating: 4.9, nights: 9, season: 'Year-round', price: 420000, image: U('1493976040374-85c8e12f0c0e'), to: '/tour-detail-japan-5' }),
  J({ id: 'ch-summer', title: 'Summer in Switzerland', blurb: 'Glacier trains and alpine lakes across Lucerne, Zermatt and the Jungfrau region.', regions: ['Switzerland', 'Europe'], style: 'Group Tour', pace: 'Relaxed', rating: 4.8, nights: 10, season: 'Jun–Sep', price: 245000, image: U('1530122037265-a5f1f91d3b99'), to: CALLBACK }),
  J({ id: 'ch-rail', title: 'Swiss Alps Private Rail Journey', blurb: 'The Glacier Express and Bernina line, first-class, with elevated stays throughout.', regions: ['Switzerland', 'Europe'], style: 'Luxury', pace: 'Relaxed', rating: 4.9, nights: 8, season: 'May–Oct', price: 360000, image: U('1530122037265-a5f1f91d3b99'), to: CALLBACK }),
  J({ id: 'it-slow', title: 'Slow Italy: Coast to Art', blurb: 'Rome after-hours, a Tuscan villa and a hidden Amalfi cove, designed around you.', regions: ['Italy', 'Europe'], style: 'Bespoke Private', pace: 'Relaxed', rating: 4.8, nights: 9, season: 'Apr–Oct', price: 240000, image: U('1534445867742-43195f401b6c'), to: CALLBACK }),
  J({ id: 'it-amalfi', title: 'Amalfi & the Southern Coast', blurb: 'A private skipper, cliffside stays and long lunches above the Tyrrhenian.', regions: ['Italy', 'Europe'], style: 'Luxury', pace: 'Relaxed', rating: 4.8, nights: 7, season: 'May–Sep', price: 280000, image: U('1534445867742-43195f401b6c'), to: CALLBACK }),
  J({ id: 'it-family', title: 'Italy for Families', blurb: 'Gladiator schools in Rome, gelato trails and a slow Tuscan farmhouse week.', regions: ['Italy', 'Europe'], style: 'Family', pace: 'Relaxed', rating: 4.7, nights: 10, season: 'Apr–Oct', price: 215000, image: U('1534445867742-43195f401b6c'), to: CALLBACK }),
  J({ id: 'au-family', title: 'Australia for Families', blurb: 'Reef, beaches and easy days, with snorkelling, Rotorua and time to breathe.', regions: ['Australia & NZ'], style: 'Family', pace: 'Relaxed', rating: 4.7, nights: 14, season: 'Year-round', price: 340000, image: U('1506973035872-a4ec16b8e8d9'), to: CALLBACK }),
  J({ id: 'sea-srilanka', title: 'Sri Lanka: Tea Trails & Coast', blurb: 'Hill-country tea estates, ancient cities and a slow finish by the sea.', regions: ['Southeast Asia'], style: 'Bespoke Private', pace: 'Relaxed', rating: 4.8, nights: 9, season: 'Year-round', price: 130000, image: U('1546708973-b339540b5162'), to: '/tour-detail-thailand-2' }),
  J({ id: 'mv-overwater', title: 'Maldives Overwater Escape', blurb: 'Overwater calm, with a private villa, a house reef and nowhere to be.', regions: ['Maldives'], style: 'Honeymoon', pace: 'Relaxed', rating: 4.9, nights: 5, season: 'Year-round', price: 140000, image: U('1514282401047-d79a71a590e8'), to: CALLBACK }),
];
const RELAXED_COL = {
  key: 'relaxed',
  title: 'Relaxed pace, for a calm vacation',
  sub: 'Slow mornings, gentle days and comfortable distances, easy on every generation.',
};

/* ---------- Theme discovery (arch carousel) ----------
   The /luxe2-improved "Destinations you'll love" carousel, retargeted from
   places to WAYS to travel — the browser who knows the mood but not the map.
   `id` is an Unsplash photo id (see sizedUnsplash); `best/trips/from` fill the
   same three facts the original showed. `cta`/`to` drive the theme-specific
   button: where /journeys4 has a matching style/pace filter we deep-link to it,
   otherwise we open the full listing. */
const THEMES = [
  { name: 'Adventure', tags: ['Trek & summit', 'Rapids & rides', 'Off the map'],
    blurb: 'High passes at first light, white-water mornings and nights under canvas — journeys built for people who would rather earn the view.',
    best: 'Oct – Mar', trips: '18 journeys', from: '₹1,45,000', id: '1527668752968-14dc70a27c95',
    cta: 'Explore adventure trips', to: '/adventure' },
  { name: 'Honeymoon', tags: ['Just the two of you', 'Private dinners', 'Overwater calm'],
    blurb: 'Overwater villas, a sandbank dinner laid for two and long, unhurried mornings — the trip you take once, arranged exactly right.',
    best: 'Nov – Apr', trips: '14 journeys', from: '₹1,85,000', id: '1573843981267-be1999ff37cd',
    cta: 'Explore honeymoons', to: '/vibe/honeymoon' },
  { name: 'Relaxed & Slow', tags: ['Nothing to rush', 'Long lunches', 'Sea & shade'],
    blurb: 'One town, one terrace and nowhere you have to be — slow itineraries with room to breathe between the beautiful bits.',
    best: 'Apr – Oct', trips: '16 journeys', from: '₹1,60,000', id: '1530841377377-3ff06c0ca713',
    cta: 'Explore relaxed journeys', to: '/vibe/relaxed-slow' },
  { name: 'Pilgrimage', tags: ['Sacred routes', 'Quiet mornings', 'Guided rites'],
    blurb: 'Temple towns at dawn, holy rivers and the old routes walked for centuries — travelled gently, with care for every ritual.',
    best: 'Year-round', trips: '12 journeys', from: '₹95,000', id: '1599661046289-e31897846e41',
    cta: 'Explore pilgrimages', to: '/vibe/pilgrimage' },
  { name: 'Staycation', tags: ['Close to home', 'Weekend-sized', 'A full reset'],
    blurb: 'A short hop, a beautiful room and a full stop on the calendar — the reset that feels a world away without the long flight.',
    best: 'Year-round', trips: '9 journeys', from: '₹45,000', id: '1506973035872-a4ec16b8e8d9',
    cta: 'Explore staycations', to: '/vibe/staycation' },
  { name: 'Wildlife & Safari', tags: ['Dawn game drives', 'Private reserves', 'Star beds'],
    blurb: 'Track the great herds at sunrise, keep a conservancy to yourself, and sleep under the stars in camps moved just for your dates.',
    best: 'Jun – Oct', trips: '11 journeys', from: '₹2,25,000', id: '1516426122078-c23e76319801',
    cta: 'Explore safaris', to: '/vibe/wildlife-safari' },
  { name: 'Culture & Heritage', tags: ['Living history', 'Old cities', 'Local hands'],
    blurb: 'Palaces you can sleep in, festivals timed to your visit and the makers behind the crafts — a place told by the people in it.',
    best: 'Oct – Mar', trips: '20 journeys', from: '₹1,25,000', id: '1493976040374-85c8e12f0c0e',
    cta: 'Explore heritage trips', to: '/vibe/culture-heritage' },
];

/* WhatsApp glyph (lucide has no brand icon) — used on the enquiry CTA. */
const WaIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.5A10 10 0 1 0 12 2zm0 18.3c-1.5 0-2.98-.4-4.27-1.16l-.3-.18-3.17 1 1.02-3.09-.2-.32A8.3 8.3 0 1 1 12 20.3z" />
    <path d="M17.5 14.4c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35z" />
  </svg>
);

/* A single journey card (from /journeys). */
/* The /journeys4 card, so the shelf and the listing page it links to show the
   same object: the sienna Private/Group tour-type badge, and the gallery
   browsable inline on the card (arrows + dots) rather than behind a
   "N photos" button that opened a lightbox. */
function JourneyCard({ j, i }) {
  const waHref = `${CONTACT_IMP.whatsappHref}?text=${encodeURIComponent(`Hi Cox & Kings, I'd like to enquire about the "${j.title}" journey.`)}`;
  const isGroup = j.tourType === 'Group Tour';
  const shots = j.gallery;
  const many = shots.length > 1;
  const [shot, setShot] = useState(0);
  /* The arrows sit above the itinerary link — stop them navigating. */
  const step = (dir) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShot((sIdx) => (sIdx + dir + shots.length) % shots.length);
  };
  return (
    <Reveal className="jl-card" delay={(i % 3) * 0.05} y={24} as="article">
      <div className="jl-card-media">
        <Link to={j.to} className="jl-card-media-link jl4-media-link" aria-label={`${j.title} — view itinerary`}>
          <AnimatePresence initial={false}>
            <motion.img
              key={shot}
              src={img(shots[shot], 800)}
              alt={`${j.title}${many ? ` — photo ${shot + 1} of ${shots.length}` : ''}`}
              loading="lazy"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            />
          </AnimatePresence>
        </Link>
        <span className={`jl4-tourtype${isGroup ? ' is-group' : ' is-private'}`}>
          {isGroup ? <Users size={13} aria-hidden="true" /> : <User size={13} aria-hidden="true" />}
          {j.tourType}
        </span>
        <span className="jl-card-rating"><Star size={12} fill="currentColor" aria-hidden="true" /> {j.rating.toFixed(1)}</span>
        <span className="jl-card-region"><MapPin size={12} aria-hidden="true" /> {j.regions[0]}</span>
        {many && (
          <>
            <button type="button" className="jl4-nav jl4-nav-prev" onClick={step(-1)} aria-label={`Previous photo of ${j.title}`}>
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <button type="button" className="jl4-nav jl4-nav-next" onClick={step(1)} aria-label={`Next photo of ${j.title}`}>
              <ChevronRight size={18} aria-hidden="true" />
            </button>
            <div className="jl4-dots" aria-hidden="true">
              {shots.map((sr, k) => (
                <button
                  key={sr + k}
                  type="button"
                  className={`jl4-dot${k === shot ? ' is-on' : ''}`}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShot(k); }}
                  tabIndex={-1}
                  aria-label={`Go to photo ${k + 1}`}
                />
              ))}
            </div>
          </>
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

/* The themed collection shelf — a horizontally scrollable rail (from /journeys). */
function Shelf({ col, list }) {
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
    const card = el.querySelector('.jl-card');
    const step = (card ? card.offsetWidth : 320) + 22;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  return (
    <section className="jl-shelf" aria-labelledby={`shelf-${col.key}`}>
      <div className="jl-shelf-head">
        <div className="jl-shelf-heading">
          <Reveal className="h26-label jl-shelf-label" as="p">{list.length} journeys</Reveal>
          <Reveal as="h2" className="jl-shelf-title" delay={0.04} id={`shelf-${col.key}`}>{col.title}</Reveal>
          <Reveal as="p" className="jl-shelf-sub" delay={0.08}>{col.sub}</Reveal>
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
      <div className="jl-rail" ref={railRef} role="group" aria-label={`${col.title} — scroll for more`}>
        {list.map((j, i) => <JourneyCard key={j.id} j={j} i={i} />)}
      </div>
    </section>
  );
}

/* ============================================================
   THE PAGE
   ============================================================ */
export default function New3() {
  useLxReveal();
  const navigate = useNavigate();

  /* --- Hero search (from /luxe2-improved): one open dropdown at a time --- */
  const [openField, setOpenField] = useState(null); // 'trip' | 'who' | 'when' | null
  const [tripValue, setTripValue] = useState('');
  const [whoValue, setWhoValue] = useState(null);   // a HERO_WHO_OPTS entry
  /* "When" is a real calendar: a departure date + a ± flexibility window, or
     "any dates" (whenAny) for travellers with no date in mind. */
  const [whenDate, setWhenDate] = useState(null);
  const [whenAny, setWhenAny] = useState(false);
  const [whenFlex, setWhenFlex] = useState(0);
  const [whenMonth, setWhenMonth] = useState(() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); });
  const [tripTyped, setTripTyped] = useState('');   // typewriter placeholder
  const [tripCaret, setTripCaret] = useState(true);
  const [tripActive, setTripActive] = useState(false); // focused or filled → pause the typewriter
  const [statIdx, setStatIdx] = useState(0);        // rotating glass chips
  const searchRef = useRef(null);

  const [chatOpen, setChatOpen] = useState(false);
  /* Einaya opens centred (expanded) from the fork card, and docked in the
     corner from the floating FAB. */
  const [chatCentred, setChatCentred] = useState(false);
  const [activeReel, setActiveReel] = useState(null);
  const [statsRun, setStatsRun] = useState(false);
  const statsRef = useRef(null);

  /* Theme-discovery arch carousel (see THEMES). All photos render as stacked
     layers in the arch, so every image loads up front and a swipe is a pure
     opacity crossfade — no remount, no fetch-on-click flash. */
  const [themeIdx, setThemeIdx] = useState(0);
  const theme = THEMES[themeIdx];
  const nextTheme = () => setThemeIdx((i) => (i + 1) % THEMES.length);
  const prevTheme = () => setThemeIdx((i) => (i - 1 + THEMES.length) % THEMES.length);

  // Hide the page scrollbar + go full-bleed, only while this page is mounted
  useEffect(() => {
    document.documentElement.classList.add('h26-noscroll');
    return () => document.documentElement.classList.remove('h26-noscroll');
  }, []);

  /* Close the open hero-search dropdown on outside click / Escape. The
     calendar is portaled to <body> on mobile, so it is NOT inside searchRef —
     exempt it explicitly or tapping a date would dismiss the picker. */
  useEffect(() => {
    if (!openField) return;
    const onDown = (e) => {
      if (e.target.closest && e.target.closest('.n3-caldrop')) return;
      if (searchRef.current && !searchRef.current.contains(e.target)) setOpenField(null);
    };
    const onKey = (e) => { if (e.key === 'Escape') setOpenField(null); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [openField]);

  /* Below 860px the search bar stacks and the calendar is taller than the room
     left above or below the field, so it opens as a centred modal instead. */
  const [calAsModal, setCalAsModal] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 860px)');
    const sync = () => setCalAsModal(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  /* Rotate the glass stat chips in the hero. */
  useEffect(() => {
    const t = setInterval(() => setStatIdx((i) => (i + 1) % HERO_STATS.length), 2600);
    return () => clearInterval(t);
  }, []);

  /* Typewriter that cycles trip suggestions through the idle "Where to?" field. */
  useEffect(() => {
    if (tripActive) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setTripTyped(TRIP_SUGGESTIONS[0]); return; }
    let sugg = 0, ch = 0, deleting = false, timer;
    const tick = () => {
      const word = TRIP_SUGGESTIONS[sugg];
      if (!deleting) {
        ch += 1; setTripTyped(word.slice(0, ch));
        if (ch === word.length) { deleting = true; timer = setTimeout(tick, 1700); return; }
        timer = setTimeout(tick, 55 + Math.random() * 60);
      } else {
        ch -= 1; setTripTyped(word.slice(0, ch));
        if (ch === 0) { deleting = false; sugg = (sugg + 1) % TRIP_SUGGESTIONS.length; timer = setTimeout(tick, 380); return; }
        timer = setTimeout(tick, 28);
      }
    };
    timer = setTimeout(tick, 500);
    return () => clearTimeout(timer);
  }, [tripActive]);

  /* Blinking caret for the typewriter. */
  useEffect(() => {
    if (tripActive) return;
    const id = setInterval(() => setTripCaret((c) => !c), 530);
    return () => clearInterval(id);
  }, [tripActive]);

  /* Lock body scroll while the reel player is open. (The mobile drawer used to
     share this lock; <SiteNav> now owns its own.) */
  useEffect(() => {
    const lock = activeReel !== null;
    document.body.style.overflow = lock ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [activeReel]);

  /* Keyboard control for the reel player. */
  useEffect(() => {
    if (activeReel === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setActiveReel(null);
      else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') setActiveReel((i) => (i + 1) % REELS.length);
      else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') setActiveReel((i) => (i - 1 + REELS.length) % REELS.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeReel]);

  /* Hero parallax — the lx2i hero drifts its own ken-burns backdrop via --py. */
  const heroRef = useRef(null);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const onScroll = () => {
      if (heroRef.current) heroRef.current.style.setProperty('--py', `${window.scrollY * 0.18}px`);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* The hero already carries its own CTAs (search + quick picks), so the mobile
     thumb-bar only earns its place once the hero has scrolled away — the two
     never sit on screen at once. */
  const [pastHero, setPastHero] = useState(false);
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const io = new IntersectionObserver(([e]) => setPastHero(!e.isIntersecting), { threshold: 0 });
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 680px)');
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  /* Scatter grid parallax. */
  const scatterRef = useRef(null);
  const { scrollYProgress: scP } = useScroll({
    target: scatterRef, offset: ['start end', 'end start'],
  });
  const drift1 = useTransform(scP, [0, 1], [60, -60]);
  const drift2 = useTransform(scP, [0, 1], [-40, 40]);
  const drift3 = useTransform(scP, [0, 1], [90, -90]);

  /* Cursor parallax for the scatter grid. */
  const prefersReduced = useReducedMotion();
  const mPx = useMotionValue(0);
  const mPy = useMotionValue(0);
  const mx = useSpring(mPx, { stiffness: 110, damping: 22, mass: 0.4 });
  const my = useSpring(mPy, { stiffness: 110, damping: 22, mass: 0.4 });
  const onScatterMove = (e) => {
    if (prefersReduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    mPx.set((e.clientX - r.left) / r.width - 0.5);
    mPy.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onScatterLeave = () => { mPx.set(0); mPy.set(0); };

  /* Refs for the mobile carousels. */
  const forkRef = useRef(null);
  const destRef = useRef(null);

  /* Mobile reels: auto-advance the horizontal carousel. */
  const reelsRef = useRef(null);
  useEffect(() => {
    const el = reelsRef.current;
    if (!el || prefersReduced) return;
    const mq = window.matchMedia('(max-width: 680px)');
    if (!mq.matches) return;
    let paused = false; let resumeT;
    const advance = () => {
      if (paused) return;
      const cards = Array.from(el.children);
      if (cards.length < 2) return;
      const base = cards[0].offsetLeft;
      const cur = cards.findIndex((c) => c.offsetLeft - base >= el.scrollLeft - 8);
      const next = (((cur === -1 ? cards.length - 1 : cur)) + 1) % cards.length;
      el.scrollTo({ left: cards[next].offsetLeft - base, behavior: 'smooth' });
    };
    const timer = setInterval(advance, 3200);
    const pause = () => { paused = true; clearTimeout(resumeT); resumeT = setTimeout(() => { paused = false; }, 5000); };
    el.addEventListener('pointerdown', pause);
    el.addEventListener('touchstart', pause, { passive: true });
    return () => {
      clearInterval(timer); clearTimeout(resumeT);
      el.removeEventListener('pointerdown', pause);
      el.removeEventListener('touchstart', pause);
    };
  }, [prefersReduced]);

  /* Trigger the heritage count-up when the stats band enters view. */
  useEffect(() => {
    if (!statsRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setStatsRun(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setStatsRun(true); io.disconnect(); } }, { threshold: 0.25 });
    io.observe(statsRef.current);
    return () => io.disconnect();
  }, []);

  /* "When" — a friendly label for the picked date + flexible window. */
  const whenLabel = whenAny
    ? 'Any dates' 
    : whenDate
      ? `${whenDate.getDate()} ${MON_NAMES[whenDate.getMonth()].slice(0, 3)}${whenFlex ? ` · ±${whenFlex}d` : ''}`
      : '';
  const calCells = buildCalendar(whenMonth);
  const todayMidnight = new Date(); todayMidnight.setHours(0, 0, 0, 0);
  const canGoPrevMonth = whenMonth > new Date(todayMidnight.getFullYear(), todayMidnight.getMonth(), 1);

  /* The "When" picker. Rendered inline inside the search bar on desktop, and
     portaled to <body> as a centred modal on mobile — see calAsModal. */
  const calendarPanel = (
    <div className="lx2i-search__drop n3-caldrop" role="dialog" aria-modal={calAsModal || undefined} aria-label="Choose your departure date">
      <div className="hi-cal-head">
        <button
          type="button"
          className="hi-cal-nav"
          onClick={() => canGoPrevMonth && setWhenMonth(new Date(whenMonth.getFullYear(), whenMonth.getMonth() - 1, 1))}
          disabled={!canGoPrevMonth}
          aria-label="Previous month"
        ><ChevronLeft size={16} /></button>
        <span className="hi-cal-title">{MON_NAMES[whenMonth.getMonth()]} {whenMonth.getFullYear()}</span>
        <button
          type="button"
          className="hi-cal-nav"
          onClick={() => setWhenMonth(new Date(whenMonth.getFullYear(), whenMonth.getMonth() + 1, 1))}
          aria-label="Next month"
        ><ChevronRight size={16} /></button>
      </div>
      <div className="hi-cal-grid hi-cal-dow">
        {WK_DAYS.map((w) => <span key={w} className="hi-cal-dowcell">{w}</span>)}
      </div>
      <div className="hi-cal-grid">
        {calCells.map((c, idx) => {
          if (!c) return <span key={idx} className="hi-cal-cell is-empty" />;
          const past = c < todayMidnight;
          const sel = !whenAny && sameDay(c, whenDate);
          return (
            <button
              key={idx}
              type="button"
              className={`hi-cal-cell${sel ? ' is-sel' : ''}${past ? ' is-past' : ''}`}
              disabled={past}
              onClick={() => { setWhenDate(c); setWhenAny(false); }}
              aria-pressed={sel}
            >{c.getDate()}</button>
          );
        })}
      </div>

      <p className="lx2i-search__droplabel hi-cal-flexlabel">Flexible?</p>
      <div className="hi-cal-flex">
        {FLEX_OPTS.map((f) => (
          <button
            key={f}
            type="button"
            className={`hi-cal-flexchip${!whenAny && whenFlex === f ? ' is-on' : ''}`}
            disabled={whenAny || !whenDate}
            onClick={() => setWhenFlex(f)}
          >{f === 0 ? 'Exact' : `± ${f} ${f === 1 ? 'day' : 'days'}`}</button>
        ))}
      </div>

      {/* Last option in the panel, exactly as in the other two fields. No date
          in mind searches every departure rather than none. */}
      <button
        type="button"
        className={`n3-any${whenAny ? ' is-on' : ''}`}
        aria-pressed={whenAny}
        onClick={() => { setWhenAny(true); setWhenDate(null); setWhenFlex(0); setOpenField(null); }}
      >
        <Sparkles size={15} /> <span>Any dates · show me all</span>
      </button>

      <div className="hi-cal-actions">
        <button type="button" className="hi-cal-clear" onClick={() => { setWhenDate(null); setWhenFlex(0); setWhenAny(false); }}>Clear</button>
        <button type="button" className="hi-cal-done" onClick={() => setOpenField(null)}>Done</button>
      </div>
    </div>
  );

  /* The mobile modal is portaled OUT of .h26, where the design tokens live,
     so .n3-calscrim re-declares the ones the calendar needs (see New3.css). */
  const whenPicker = calAsModal
    ? createPortal(
        <div className="n3-calscrim" onMouseDown={() => setOpenField(null)}>
          <div className="n3-calsheet" onMouseDown={(e) => e.stopPropagation()}>{calendarPanel}</div>
        </div>,
        document.body,
      )
    : calendarPanel;

  /* Search runs the traveller's actual criteria: every field they filled in is
     carried into /journeys4 as a filter it applies on load, so they land on a
     filtered result list instead of an empty finder they have to redo. Fields
     left blank, or set to one of the "show me all" options, are simply omitted,
     which widens the search rather than narrowing it to nothing. */
  const searchHref = useMemo(() => {
    const iso = whenDate && !whenAny
      ? `${whenDate.getFullYear()}-${String(whenDate.getMonth() + 1).padStart(2, '0')}-${String(whenDate.getDate()).padStart(2, '0')}`
      : null;

    const dest = tripValue.trim();
    const specific = !!dest && dest !== ANY_DEST;

    /* A SPECIFIC destination goes to that COUNTRY page (e.g. /journeys/japan-2),
       carrying the traveller and dates as filters it pre-selects — `who` keys
       the country page's own "Who's travelling" filter; `when`/`flex` seed its
       date filter. Only Japan has a country page built, so any other specific
       place lands on the honest "coming soon" screen. */
    if (specific) {
      const qs = new URLSearchParams();
      if (whoValue && !whoValue.any && whoValue.key) qs.set('who', whoValue.key);
      if (iso) { qs.set('when', iso); if (whenFlex) qs.set('flex', String(whenFlex)); }
      const q = qs.toString();
      const page = destPage(dest);
      if (page) return q ? `${page}?${q}` : page;
      // Known/typed place with no country page yet.
      return `${COMING_SOON_PATH}?${new URLSearchParams({ dest }).toString()}`;
    }

    /* "Anywhere" (or a blank field) keeps the old behaviour: the full
       /journeys4 listing, filtered by who → style/pace and by when. */
    const qs = new URLSearchParams();
    if (whoValue?.style) qs.set('style', whoValue.style);
    if (whoValue?.pace) qs.set('pace', whoValue.pace);
    if (iso) { qs.set('when', iso); if (whenFlex) qs.set('flex', String(whenFlex)); }
    const q = qs.toString();
    return q ? `${JOURNEYS_PATH}?${q}` : JOURNEYS_PATH;
  }, [tripValue, whoValue, whenDate, whenAny, whenFlex]);
  const goToSearch = useCallback(() => { navigate(searchHref); }, [navigate, searchHref]);

  /* Smooth-scroll to an in-page section (hero scroll cue + quick picks). */
  const go = useCallback((href) => (e) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  /* "Design it around you" hands straight to Einaya, centred on screen rather
     than docked in the corner — it is the task now, not a side offer. */
  const openEinaya = useCallback(() => { setChatCentred(true); setChatOpen(true); }, []);

  /* Every "talk to us" CTA opens the same callback dialog (name, number,
     purpose, time slot) instead of firing a tel: link. The dialog itself lives
     in <ScheduleCallProvider>, so every page shares one copy of it. */
  const openCallback = useScheduleCall();

  return (
    <>
    {/* `n3` scopes New3.css — without it those rules would hit every other
        .h26 page (/, /new-homepage, /new2, /improved) too. */}
    <div className="h26 new-typo n3">
      {/* The navbar, the mobile drawer and the skip link are the shared
          <SiteChrome> ones now. `solidAt={80}` keeps this page's threshold:
          the hero is tall, so the nav stays transparent well down it. */}
      <SiteNav solidAt={80} skipTo="#top" />

      {/* The /improved hero was transparent over a FIXED full-page backdrop
          (.h26-bg). The luxe2 hero brings its own, so that backdrop is gone
          from this page: it held a different photo, it did not scroll, and the
          only place it still showed was through the sheet's rounded top
          corners — which is exactly the flicker at the hero/sheet seam. The
          corners now fall through to the page colour set in New3.css. */}

      {/* ---------- HERO (from /luxe2-improved) ----------
           Wrapped in .lx2i so it picks up that system's tokens (--gold,
           --glass-dark, --ease…) and the Cormorant/Work Sans override that
           NewTypography.css hangs off `.new-typo .lx2i`. */}
      <div className="lx2i n3-herowrap">
        <section className="lx2i-hero" id="top" ref={heroRef}>
          <div className="lx2i-hero__bgwrap" aria-hidden="true">
            <div className="lx2i-hero__bg" style={{ backgroundImage: `url(${sizedUnsplash('1527668752968-14dc70a27c95', 2000)})` }} />
            <div className="lx2i-hero__veil" />
          </div>

          <div className="lx2i-hero__inner">
            <div className="lx2i-hero__left">
              <span className="lx2i-eyebrow lx2i-eyebrow--light lx2i-fade" style={{ '--d': '.1s' }}>THE WORLD&apos;S MOST EXPERIENCED TRAVEL COMPANY · SINCE 1758</span>
              <h1 className="lx2i-hero__title">
                <span className="lx2i-fade" style={{ '--d': '.2s' }}>Discover the World</span>
                <em className="lx2i-fade" style={{ '--d': '.36s' }}>in Luxury &amp; Style.</em>
              </h1>

              {/* Glass search */}
              <form
                ref={searchRef}
                className="lx2i-search lx2i-fade"
                style={{ '--d': '.76s' }}
                onSubmit={(e) => { e.preventDefault(); goToSearch(); }}
                role="search"
              >
                <div className={`lx2i-search__field lx2i-search__field--trip ${openField === 'trip' ? 'is-open' : ''}`}>
                  <MapPin size={17} />
                  <span className="lx2i-search__fixed" aria-hidden="true">Where to?</span>
                  <input
                    type="text"
                    aria-label="Where to"
                    className="lx2i-search__typein"
                    value={tripValue}
                    placeholder={tripActive || tripValue ? '' : `${tripTyped}${tripCaret ? '▍' : ' '}`}
                    onFocus={() => { setTripActive(true); setOpenField('trip'); }}
                    onChange={(e) => { setTripValue(e.target.value); setTripActive(true); setOpenField('trip'); }}
                  />
                  {openField === 'trip' && (
                    <div className="lx2i-search__drop" role="listbox" aria-label="Popular destinations">
                      <span className="lx2i-search__droplabel">Popular destinations</span>
                      {HERO_POPULAR_DEST
                        /* "Anywhere" is a choice, not a query — don't let it
                           filter the list down to nothing when reopened. */
                        .filter((d) => tripValue === ANY_DEST || d.toLowerCase().includes(tripValue.toLowerCase()))
                        .map((d) => (
                          <button key={d} type="button" className={`lx2i-search__opt ${tripValue === d ? 'is-on' : ''}`} role="option" aria-selected={tripValue === d} onClick={() => { setTripValue(d); setOpenField(null); }}>
                            <MapPin size={15} /> <span>{d}</span>
                          </button>
                        ))}
                      <button
                        type="button"
                        className={`n3-any${tripValue === ANY_DEST ? ' is-on' : ''}`}
                        role="option"
                        aria-selected={tripValue === ANY_DEST}
                        onClick={() => { setTripValue(ANY_DEST); setTripActive(true); setOpenField(null); }}
                      >
                        <Sparkles size={15} /> <span>Anywhere · show me all</span>
                      </button>
                    </div>
                  )}
                </div>
                <span className="lx2i-search__div" />
                <div className={`lx2i-search__field lx2i-search__field--who ${openField === 'who' ? 'is-open' : ''}`}>
                  <Users size={17} />
                  <button type="button" className="lx2i-search__trigger" aria-haspopup="listbox" aria-expanded={openField === 'who'} onClick={() => setOpenField(openField === 'who' ? null : 'who')}>
                    <span className={whoValue ? '' : 'lx2i-search__ph'}>{whoValue?.label || "Who's travelling?"}</span>
                    <ChevronDown size={15} className="lx2i-search__chev" />
                  </button>
                  {openField === 'who' && (
                    <div className="lx2i-search__drop" role="listbox" aria-label="Who's travelling">
                      {HERO_WHO_OPTS.map((o) => (
                        <button
                          key={o.label}
                          type="button"
                          className={`lx2i-search__opt ${whoValue?.label === o.label ? 'is-on' : ''}`}
                          role="option"
                          aria-selected={whoValue?.label === o.label}
                          onClick={() => { setWhoValue(o); setOpenField(null); }}
                        >
                          <Users size={15} /> <span>{o.label}</span>
                        </button>
                      ))}
                      <button
                        type="button"
                        className={`n3-any${whoValue?.any ? ' is-on' : ''}`}
                        role="option"
                        aria-selected={!!whoValue?.any}
                        onClick={() => { setWhoValue(ANY_WHO); setOpenField(null); }}
                      >
                        <Sparkles size={15} /> <span>Anyone · show me all</span>
                      </button>
                    </div>
                  )}
                </div>
                <span className="lx2i-search__div" />
                <div className={`lx2i-search__field lx2i-search__field--when ${openField === 'when' ? 'is-open' : ''}`}>
                  <Calendar size={17} />
                  <button type="button" className="lx2i-search__trigger" aria-haspopup="dialog" aria-expanded={openField === 'when'} onClick={() => setOpenField(openField === 'when' ? null : 'when')}>
                    <span className={whenLabel ? '' : 'lx2i-search__ph'}>{whenLabel || 'When?'}</span>
                    <ChevronDown size={15} className="lx2i-search__chev" />
                  </button>
                  {openField === 'when' && whenPicker}
                </div>
                <button type="submit" className="lx2i-search__btn" aria-label="Search journeys"><Search size={17} /><span>Search</span></button>
              </form>

              <div className="lx2i-hero__trust lx2i-fade" style={{ '--d': '.88s' }}>
                <a href="#reviews" onClick={go('#reviews')} className="lx2i-hero__rating">
                  <span className="lx2i-stars">{[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}</span>
                  <strong>4.9</strong>
                  <span>from 2,400+ verified reviews</span>
                  <ArrowRight size={15} />
                </a>
              </div>

              {/* Above-the-fold quick picks - get to an answer without the form */}
              <div className="lx2i-hero__quick lx2i-fade" style={{ '--d': '.98s' }}>
                <span className="lx2i-hero__quicklbl">Popular right now</span>
                <div className="lx2i-hero__quickrow">
                  {HERO_QUICK_PICKS.map((q) => {
                    const page = destPage(q);
                    return page ? (
                      <Link key={q} to={page} className="lx2i-quickpick">{q}</Link>
                    ) : (
                      /* No country page yet — inert rather than misdirected. */
                      <button
                        key={q}
                        type="button"
                        className="lx2i-quickpick n3-soon"
                        aria-disabled="true"
                        title={`${q} destination page coming soon`}
                        onClick={(e) => e.preventDefault()}
                      >
                        {q}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Glass stat chips */}
            <div className="lx2i-hero__chips" aria-hidden="true">
              {HERO_STATS.map((s, i) => (
                <span key={s} className={`lx2i-chip ${i === statIdx ? 'is-active' : ''}`} style={{ '--i': i }}>{s}</span>
              ))}
            </div>
          </div>

          <a href="#paths" onClick={go('#paths')} className="lx2i-hero__scroll" aria-label="Scroll to explore">
            <span>Scroll to explore</span>
            <ChevronDown size={16} />
          </a>
        </section>
      </div>

      {/* ---------- SHEET (everything below scrolls over the backdrop) ---------- */}
      <div className="h26-sheet">

        {/* INTRO — "Specialists, not salespeople. Every detail, handled." (from /improved) */}
        <section className="h26-intro" ref={scatterRef} onMouseMove={onScatterMove} onMouseLeave={onScatterLeave}>
          {SCATTER.map((s, i) => (
            <ScatterImg
              key={s.c}
              src={s.src}
              cls={s.c}
              driftY={[drift1, drift2, drift3, drift2, drift1, drift3, drift1][i]}
              mx={mx}
              my={my}
              depth={SCATTER_DEPTH[i]}
            />
          ))}

          <div className="h26-intro-copy">
            <Reveal className="h26-label" as="p">The Cox &amp; Kings way</Reveal>
            <h2 className="h26-statement">
              <WordReveal text="Specialists, not salespeople." accent={[0]} />
              <br />
              <WordReveal text="Every detail, handled." accent={[2]} delay={0.2} />
            </h2>
            <Reveal className="h26-intro-text" as="p" delay={0.3}>
              Your journey is shaped by someone who has actually walked it. Then
              flights, visas, hotels and transfers are coordinated end to end, with
              one team you can reach on WhatsApp before, during and after the trip.
            </Reveal>
            <ul className="hi-spec-points">
              {ASSURANCE.map((a, i) => (
                <Reveal key={a} as="li" delay={0.36 + i * 0.06} y={0}>
                  <Check size={15} className="hi-spec-points-ic" aria-hidden="true" />
                  <span>{a}</span>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* FORK — "How would you like to travel?" (from /improved) */}
        <section className="h26-section hi-fork" id="paths">
          <div className="h26-head hi-center">
            <Reveal className="h26-label" as="p">Start here</Reveal>
            <Reveal as="h2" className="h26-h2" delay={0.05}>How would you like to travel?</Reveal>
          </div>
          <div className="hi-fork-grid hi-fork-grid--three" ref={forkRef}>
            <Reveal className="hi-lane" y={0}>
              <Link to="/journeys4" className="hi-lane-link">
                <div className="hi-lane-media">
                  <img src={img('https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99', 800)} alt="An escorted small-group journey" loading="lazy" />
                </div>
                <div className="hi-lane-body">
                  <span className="hi-lane-tag">Escorted small groups</span>
                  <h3>Find Your Journey</h3>
                  <p>Fixed departures, capped at 18, with a tour manager throughout. Everything handled, fine company along the way.</p>
                  <span className="h26-btn h26-btn-pill">See group journeys <ArrowRight size={16} /></span>
                </div>
              </Link>
            </Reveal>
            {/* "Design it around you" and "Help me decide" were two cards asking
                the same question, whether you already know what you want. Both
                now open Einaya, who works it out with you either way. */}
            <Reveal className="hi-lane is-featured" y={0}>
              <span className="hi-lane-badge">Recommended</span>
              <div className="hi-lane-media">
                <img src={img('https://images.unsplash.com/photo-1488646953014-85cb44e25828', 800)} alt="Planning a trip together over a map" loading="lazy" />
              </div>
              <div className="hi-lane-body">
                <span className="hi-lane-tag">Tailor-made &amp; private</span>
                <h3>Design it around you</h3>
                <p>Know exactly where you&apos;re going, or haven&apos;t the faintest? Answer a few questions and Einaya will shape a private journey around you.</p>
                {/* Same pill as the other two: the badge alone marks this as the
                    recommended path, so the CTA doesn't have to shout as well. */}
                <button type="button" className="h26-btn h26-btn-pill" onClick={openEinaya}>
                  Design it with Einaya <ArrowRight size={16} />
                </button>
              </div>
            </Reveal>
            <Reveal className="hi-lane" y={0}>
              <div className="hi-lane-media">
                <img src={img('https://images.unsplash.com/photo-1521737604893-d14cc237f11d', 800)} alt="A travel specialist ready to talk" loading="lazy" />
              </div>
              <div className="hi-lane-body">
                <span className="hi-lane-tag">A real person</span>
                <h3>Just talk to someone</h3>
                <p>Prefer a conversation? Pick a time that suits you and a specialist will call. No scripts, no call centre, no obligation.</p>
                {/* Opens the callback dialog rather than dialling straight out:
                    a tel: link fires an unexpected call, is dead on desktop, and
                    tells us nothing about who is calling or what they need. */}
                <button type="button" className="h26-btn h26-btn-pill" onClick={openCallback}>
                  Schedule a call <ArrowRight size={16} />
                </button>
              </div>
            </Reveal>
          </div>
          <CarouselDots scrollRef={forkRef} count={3} label="ways to travel" />
        </section>

        {/* DESTINATIONS — editorial grid (from /improved) */}
        <section className="h26-section" id="destinations">
          <div className="h26-head h26-head-row">
            <div>
              <Reveal className="h26-label" as="p">100+ countries</Reveal>
              <Reveal as="h2" className="h26-h2" delay={0.05}>Where will you go?</Reveal>
            </div>
            <Reveal as="div" delay={0.1}>
              <Link to="/journeys4" className="h26-textlink">All destinations <ArrowUpRight size={16} /></Link>
            </Reveal>
          </div>
          <div className="h26-dest-grid" ref={destRef}>
            {DESTINATIONS.slice(0, 8).map((d, i) => {
              const page = destPage(d.name);
              const inner = (
                <>
                  <img src={img(d.image, 900)} alt={d.name} loading="lazy" />
                  <div className="h26-dest-veil" />
                  <div className="h26-dest-body">
                    <h3>{d.name}</h3>
                    <p>{d.hook}</p>
                    {d.priceFrom && <span className="h26-dest-price">from {d.priceFrom} <small>/ person</small></span>}
                  </div>
                  <span className="h26-dest-arrow"><ArrowUpRight size={18} /></span>
                </>
              );
              return (
                <Reveal key={d.name} className={`h26-dest h26-dest-${DEST_SPANS[i]}`} delay={(i % 4) * 0.06} y={0}>
                  {page ? (
                    <Link to={page} className="h26-dest-link">{inner}</Link>
                  ) : (
                    /* Every card used to link to /journeys/japan regardless of
                       which country it showed. Until each page exists, the card
                       says so instead of misdirecting. */
                    <div className="h26-dest-link n3-dest-soon" aria-disabled="true">{inner}</div>
                  )}
                </Reveal>
              );
            })}
          </div>
          <CarouselDots scrollRef={destRef} count={Math.min(8, DESTINATIONS.length)} label="destinations" />
        </section>

        {/* HERITAGE — "Crafting unforgettable journeys since 1758" (from /luxe2-improved) */}
        <div className="lx2i">
          <section className="lx2i-heritage" id="heritage">
            <div className="lx2i-container lx2i-heritage__grid">
              <div className="lx2i-heritage__media lx2i-reveal">
                <div className="lx2i-heritage__photo lx2i-heritage__photo--main" style={{ backgroundImage: `url(${sizedUnsplash('1599661046289-e31897846e41', 900)})` }} />
                <div className="lx2i-heritage__card lx2i-glass">
                  <span className="lx2i-eyebrow">SINCE 1758</span>
                  <h4>Bespoke Itineraries</h4>
                  <p>Each journey we curate is a masterpiece, crafted with care and precision to reflect you alone.</p>
                  <div className="lx2i-heritage__photo lx2i-heritage__photo--inset" style={{ backgroundImage: `url(${sizedUnsplash('1523906834658-6e24ef2386f9', 600)})` }} />
                </div>
              </div>

              <div className="lx2i-heritage__text lx2i-reveal">
                <span className="lx2i-eyebrow">OUR HERITAGE</span>
                <h2 className="lx2i-h2">Crafting <strong>unforgettable<br />journeys</strong> since 1758</h2>
                <p className="lx2i-heritage__copy">
                  From the age of sail to the era of bespoke travel, Cox &amp; Kings has guided generations
                  of explorers across the globe, under the same name and the same standard, for over a quarter of a millennium.
                </p>

                <ul className="lx2i-trust" aria-label="Why travellers trust Cox & Kings">
                  {TRUST_BADGES.map((b) => {
                    const Icon = b.icon;
                    return (
                      <li key={b.stat} className="lx2i-trust__item">
                        <span className="lx2i-trust__ic"><Icon size={20} strokeWidth={1.6} /></span>
                        <span className="lx2i-trust__body">
                          <strong>{b.stat}</strong>
                          <small>{b.label}</small>
                        </span>
                      </li>
                    );
                  })}
                </ul>

                <div className="lx2i-statband" ref={statsRef}>
                  <Stat value={267} suffix="" label="Years of journeys" run={statsRun} />
                  <span className="lx2i-statband__div" />
                  <Stat value={100} suffix="+" label="Countries" run={statsRun} />
                  <span className="lx2i-statband__div" />
                  <Stat value={98} suffix="%" label="Would travel again" run={statsRun} />
                </div>
                <Link to="/about-us2" className="lx2i-btn lx2i-btn--primary">Discover our story <ArrowRight size={16} /></Link>
              </div>
            </div>
          </section>

          {/* AS SEEN IN — press marquee. Sits straight after heritage so the
              267-year story flows into the outlets that have covered it. */}
          <section className="lx2i-press" id="press" aria-label="As featured in">
            <div className="lx2i-press__label"><span className="lx2i-eyebrow">AS FEATURED IN</span></div>
            <div className="lx2i-press__track">
              {[...LX_PRESS, ...LX_PRESS].map((p, i) => (
                <img key={i} className="lx2i-press__logo" src={p.src} alt={p.name} loading="lazy" />
              ))}
            </div>
          </section>
        </div>

        {/* RELAXED PACE — "Relaxed pace, for a calm vacation" shelf (from /journeys) */}
        <div className="jl jl4" id="relaxed">
          <div className="jl-collections">
            <Shelf col={RELAXED_COL} list={RELAXED_JOURNEYS} />
          </div>
        </div>

        {/* THEME DISCOVERY (n3d) — rebuilt from scratch, fully self-contained.
            Same design as the /luxe2-improved arch carousel, retargeted from
            places to travel THEMES. Built glitch-free: nothing remounts on
            swipe; the photo crossfades via stacked opacity layers (compositor-
            only), the on-photo controls use solid fills (no backdrop-filter
            under motion), and the only entrance motion is the shared one-time
            fade-up. Typography per design.md. */}
        <section className="n3-disc" id="discover-themes" aria-label="Explore by theme">
          <div className="n3d__grid">
            {/* Left column — split into head (title + body) and meta (facts +
                counter). The split lets mobile drop the photo BETWEEN them:
                head above, arch, then the de-emphasised facts (see the
                display:contents reorder in New3.css). */}
            <div className="n3d__intro">
              <div className="n3d__head lx2i-reveal">
                <span className="n3d__eyebrow">// EXPLORE &amp; DISCOVER</span>
                <h2 className="n3d__title">What&apos;s your<br />vibe?</h2>
                <p className="n3d__copy">{theme.blurb}</p>
              </div>
              <div className="n3d__meta lx2i-reveal">
                <ul className="n3d__facts">
                  <li><Calendar size={15} /> Best season · {theme.best}</li>
                  <li><Compass size={15} /> {theme.trips}</li>
                  <li><Sparkles size={15} /> from {theme.from} pp</li>
                </ul>
                <div className="n3d__nav">
                  <button type="button" className="n3d__navbtn" onClick={prevTheme} aria-label="Previous theme"><ArrowLeft size={18} /></button>
                  <span className="n3d__count">{String(themeIdx + 1).padStart(2, '0')} / {String(THEMES.length).padStart(2, '0')}</span>
                  <button type="button" className="n3d__navbtn" onClick={nextTheme} aria-label="Next theme"><ArrowRight size={18} /></button>
                </div>
              </div>
            </div>

            {/* Centre — arch. All photos are stacked layers; only the active
                one is opaque, so a swipe is a pure opacity crossfade. */}
            <div className="n3d__stage lx2i-reveal">
              <div className="n3d__arch">
                {THEMES.map((t, i) => (
                  <div
                    key={t.name}
                    className="n3d__photo"
                    style={{ backgroundImage: `url(${sizedUnsplash(t.id, 1100)})`, opacity: i === themeIdx ? 1 : 0 }}
                    aria-hidden={i === themeIdx ? undefined : true}
                  />
                ))}
                <div className="n3d__veil" aria-hidden="true" />
                {/* The whole photo is the CTA: a full-cover link to the theme's
                    filtered listing. It sits below the swipe buttons (z-index)
                    so prev/next still win their taps. The corner arrow is now a
                    decorative affordance (pointer-events off) — the cover owns
                    the click and the caption passes through to it. */}
                <Link to={theme.to} className="n3d__cover" aria-label={`Explore ${theme.name} journeys`} />
                <span className="n3d__go" aria-hidden="true"><ArrowUpRight size={18} /></span>
                <button type="button" className="n3d__swipe n3d__swipe--prev" onClick={prevTheme} aria-label="Previous theme"><ArrowLeft size={20} /></button>
                <button type="button" className="n3d__swipe n3d__swipe--next" onClick={nextTheme} aria-label="Next theme"><ArrowRight size={20} /></button>
                <div className="n3d__caption">
                  <h3 className="n3d__name">{theme.name}</h3>
                  <div className="n3d__tags">
                    {theme.tags.map((t) => <span key={t} className="n3d__tag">{t}</span>)}
                  </div>
                </div>
              </div>
            </div>

            {/* Right — thumbnail rail */}
            <div className="n3d__rail lx2i-reveal">
              {THEMES.map((t, i) => (
                <button
                  type="button"
                  key={t.name}
                  className={`n3d__thumb${i === themeIdx ? ' is-on' : ''}`}
                  onClick={() => setThemeIdx(i)}
                  aria-pressed={i === themeIdx}
                >
                  <span className="n3d__thumbimg" style={{ backgroundImage: `url(${sizedUnsplash(t.id, 300)})` }} />
                  <span className="n3d__thumbno">{String(i + 1).padStart(2, '0')}</span>
                  <span className="n3d__thumbname">{t.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* CTA follows the selected theme — label and destination both. */}
          <div className="n3d__more lx2i-reveal">
            <Link to={theme.to} className="lx2i-btn lx2i-btn--primary lx2i-btn--lg">{theme.cta} <ArrowRight size={16} /></Link>
          </div>
        </section>

        {/* CLIPS — short-form vertical discovery (from /improved) */}
        <section className="h26-section h26-reels-sec" id="reels">
          <div className="h26-head h26-head-row">
            <div>
              <Reveal className="h26-label" as="p">Clips</Reveal>
              <Reveal as="h2" className="h26-h2" delay={0.05}>Real moments, in 30 seconds.</Reveal>
            </div>
            <Reveal as="div" delay={0.1}>
              <Link to="/journeys4" className="h26-textlink">Explore journeys <ArrowUpRight size={16} /></Link>
            </Reveal>
          </div>
          <Reveal as="p" className="h26-reels-hint" delay={0.05}>Swipe through traveller films. Tap any to watch the full journey.</Reveal>
          <div className="h26-reels" ref={reelsRef}>
            {REELS.map((r, i) => (
              <Reveal key={r.id} className="h26-reel" delay={(i % 4) * 0.05} y={0}>
                <button type="button" className="h26-reel-link" onClick={() => setActiveReel(i)} aria-label={`Play clip: ${r.title}`}>
                  <img src={img(r.poster, 700)} alt={r.title} loading="lazy" />
                  <div className="h26-reel-veil" />
                  <span className="h26-reel-tag">{r.tag}</span>
                  <span className="h26-reel-play"><TiPlay size={22} /></span>
                  <div className="h26-reel-body">
                    <h3>{r.title}</h3>
                    <p>{r.place}</p>
                    <span className="h26-reel-views"><TiPlay size={11} /> {r.views} views</span>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
          <CarouselDots scrollRef={reelsRef} count={REELS.length} label="clips" />
        </section>

        {/* REVIEWS + PRESS (from /luxe2-improved) */}
        <div className="lx2i">
          <section className="lx2i-reviews" id="reviews">
            <div className="lx2i-container">
              <div className="lx2i-reviews__head lx2i-reveal">
                <div>
                  <span className="lx2i-eyebrow">TRAVELLER STORIES</span>
                  <h2 className="lx2i-h2">Real journeys, captured<br />by <strong>real travellers</strong></h2>
                </div>
                <div className="lx2i-reviews__agg lx2i-glass">
                  <span className="lx2i-stars lx2i-stars--lg">{[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}</span>
                  <strong>4.9 / 5</strong>
                  <span>from 2,400+ verified reviews</span>
                  <div className="lx2i-reviews__plats">
                    <span className="lx2i-revplat"><GoogleG /> <b>4.8</b> on Google</span>
                    <span className="lx2i-revplat"><TripAdvisorOwl /> <b>4.9</b> on Tripadvisor</span>
                  </div>
                </div>
              </div>

              <div className="lx2i-wall">
                {LX_REVIEWS.map((r, i) => (
                  <ReviewCard key={r.name} r={r} i={i} />
                ))}
              </div>

              <div className="lx2i-reviews__more lx2i-reveal">
                <Link to="/testimonials" className="lx2i-btn lx2i-btn--outline lx2i-btn--lg">View all 2,400+ reviews <ArrowRight size={16} /></Link>
              </div>
            </div>
          </section>
        </div>

        {/* CONTACT — cinematic closing band (WhatsApp / schedule a callback) */}
        <section className="h26-contact" id="contact">
          <img
            className="h26-contact-bg"
            src={img('https://images.unsplash.com/photo-1534445867742-43195f401b6c', 1600)}
            alt="" aria-hidden="true" loading="lazy"
          />
          <div className="h26-contact-scrim" aria-hidden="true" />
          <div className="h26-contact-grain" aria-hidden="true" />
          <div className="h26-contact-inner">
            <Reveal className="h26-contact-eyebrow" as="p">
              <span className="h26-contact-rule" aria-hidden="true" /> Talk to us
            </Reveal>
            <h2 className="h26-contact-title">
              <WordReveal text="Let's plan" />
              <br />
              <WordReveal text="your next journey." accent={[2]} delay={0.18} />
            </h2>
            <Reveal as="p" className="h26-contact-sub" delay={0.2}>
              Speak to a specialist who's actually walked the route. Message us now, or
              pick a time and we'll call you. No scripts, no call centres, no obligation.
            </Reveal>
            <Reveal as="div" className="h26-contact-ctas" delay={0.3} y={0}>
              <button type="button" className="h26-btn h26-btn-accent h26-btn-lg" onClick={openCallback}>
                <Phone size={17} /> Schedule a callback
              </button>
              <a href={CONTACT_IMP.whatsappHref} target="_blank" rel="noopener noreferrer" className="h26-btn h26-btn-lg h26-contact-wa">
                <WaIcon size={18} /> WhatsApp us
              </a>
            </Reveal>
            <Reveal as="p" className="h26-contact-alt" delay={0.38}>
              <Clock size={14} aria-hidden="true" /> Travel experts available 9am–9pm IST, every day
            </Reveal>
          </div>
        </section>

        <SiteFooter />
      </div>

      {/* Mobile thumb-reach bar — chat + Einaya (AI) + schedule-a-callback */}
      <div className={`h26-thumbbar${activeReel !== null || !pastHero ? ' is-hidden' : ''}`} aria-hidden={activeReel !== null || !pastHero}>
        <button type="button" className="h26-thumbbar-cta" onClick={() => setChatOpen(true)}>
          <MessageCircle size={18} /> Chat with an expert
        </button>
        <button type="button" className="h26-thumbbar-call" aria-label="Schedule a callback" onClick={openCallback}>
          <Phone size={20} />
        </button>
        {/* The desktop "Ask Einaya" FAB is hidden on mobile, so the assistant
            gets its own button here — rightmost, where the FAB sits on desktop. */}
        <button
          type="button"
          className="h26-thumbbar-ai n3-thumb-ai"
          aria-label="Ask Einaya, the AI travel assistant"
          onClick={() => { setChatCentred(false); setChatOpen(true); }}
        >
          <Sparkles size={20} aria-hidden="true" />
        </button>
      </div>

      {/* ENAYA — floating "Ask Einaya" button (from /luxe2-improved) */}
      <button className={`lx2i-aifab ${chatOpen ? 'is-hidden' : ''}`} aria-label="Open Einaya, the AI travel assistant" onClick={() => { setChatCentred(false); setChatOpen(true); }}>
        <Sparkles size={20} />
        <span>Ask Einaya</span>
      </button>


      {/* Reel / shorts player */}
      <AnimatePresence>
        {activeReel !== null && (
          <ReelPlayer reels={REELS} index={activeReel} setIndex={setActiveReel} onClose={() => setActiveReel(null)} />
        )}
      </AnimatePresence>
    </div>

    {/* ENAYA — the working AI concierge (from /luxe2-improved). Rendered
        OUTSIDE the page wrapper so scoped colour/font styles can't bleed in. */}
    <ChatBot open={chatOpen} onOpenChange={setChatOpen} openExpanded={chatCentred} hideFab name="Einaya" />
    </>
  );
}
