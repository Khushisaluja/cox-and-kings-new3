/* ============================================================
   EssenceJapan2 — alternate layout of the "Essence Japan with Hakone"
   tour-detail page.

   Difference from EssenceJapan (/essence-japan): the day-by-day
   itinerary and the photography are fused into ONE section — an
   interactive timeline on the LEFT, a sticky picture panel on the
   RIGHT that crossfades to the active day (with a filmstrip of every
   day beneath it). The standalone "In pictures" gallery section is
   removed; its browse value lives inside the itinerary now.

   Everything else — nav, hero, route strip, sticky booking rail,
   inclusions, booking, FAQs, similar journeys, footer — is shared
   verbatim with EssenceJapan via EssenceJapan.css. The new section's
   styles live in EssenceJapan2.css (.ej2-* classes).
   ============================================================ */
import { useState, useEffect, useRef } from 'react';
import { SmartLink as Link, CALLBACK } from '../components/ScheduleCall';
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import {
  Phone, MessageCircle, ArrowRight, ArrowUpRight, Menu, X, ChevronDown, Plus,
  MapPin, CalendarDays, Users, BedDouble, UtensilsCrossed, Star, Check,
  ShieldCheck, Sparkles, Compass, Plane, Instagram, Facebook, Youtube, Linkedin,
  Clock, Quote, PhoneCall,
} from 'lucide-react';
import './EssenceJapan.css';
import './EssenceJapan2.css';

/* Image proxy — keeps Unsplash request sizes sane. */
const img = (url, w = 1200) =>
  `${url}${url.includes('?') ? '&' : '?'}auto=format&fit=crop&w=${w}&q=80`;

const CONTACT = {
  phoneDisplay: '+91 8556001700',
  phoneHref: 'tel:+918556001700',
  whatsappHref: 'https://wa.me/918556001700?text=I%27d%20like%20to%20know%20more%20about%20Essence%20Japan%20with%20Hakone',
  email: 'holidays@coxandkings.com',
};

const NAV_MENU = [
  {
    label: 'Ways to travel', href: '/journeys',
    blurb: 'Two ways to see the world — pick the one that fits you.',
    items: [
      { label: 'Escorted group tours', desc: 'Expert-led, fixed departures', href: '/journeys?style=Group' },
      { label: 'Tailor-made journeys', desc: 'Designed entirely around you', href: '/journeys?style=Tailor-made' },
      { label: 'Luxury & private travel', desc: 'Elevated stays and guiding', href: '/journeys?style=Luxury' },
      { label: 'Help me decide', desc: 'Talk it through with a specialist', to: CALLBACK },
    ],
  },
  {
    label: 'Destinations', href: '/journeys',
    blurb: 'Over 100 countries, shaped by specialists who know them first-hand.',
    items: [
      { label: 'Japan', desc: 'Cherry blossom to neon', href: '/journeys?where=Japan' },
      { label: 'Switzerland', desc: 'Alpine railways & lakes', href: '/journeys?where=Switzerland' },
      { label: 'Italy', desc: 'Cities, coast & countryside', href: '/journeys?where=Italy' },
      { label: 'Southeast Asia', desc: 'Temples, islands & food', href: '/journeys?where=Vietnam' },
      { label: 'All destinations', desc: 'Browse the full map', href: '/journeys' },
    ],
  },
  {
    label: 'Journeys', href: '/journeys',
    blurb: 'Signature itineraries, ready to make your own.',
    items: [
      { label: 'Essence Japan with Hakone', desc: '8 days · escorted', href: '/essence-japan-2' },
      { label: 'Cherry Blossom Japan', desc: '13 nights · Mar–Apr', href: '/tour-detail-japan-5' },
      { label: 'Splendours of Japan', desc: 'Private, tailor-made', href: '/tour-detail-japan' },
      { label: 'Ready when you are', desc: 'Hand-picked departures', href: '/journeys' },
    ],
  },
  {
    label: 'Why us', href: '/improved',
    blurb: 'Specialists, not salespeople — and 260 years behind every trip.',
    items: [
      { label: 'Our specialists', desc: 'The people who plan your trip', href: '/improved' },
      { label: 'Since 1758', desc: 'Heritage you can lean on', href: '/improved' },
      { label: 'Real reviews', desc: '2,400+ verified travellers', href: '/improved' },
      { label: 'Talk to an expert', desc: 'We pick up the phone', to: CALLBACK },
    ],
  },
];

const TOUR = {
  eyebrow: 'Escorted Small-Group Tour · Japan',
  title: 'Essence of Japan,\nwith Hakone',
  standfirst:
    'Eight unhurried days from Tokyo’s neon to Kyoto’s temple gardens — with a ryokan night beneath Mount Fuji, a boat across Lake Kawaguchiko, and Nara’s bowing deer along the way.',
  priceFrom: '₹2,49,064',
  priceNote: 'per person · land only · excl. GST & TCS',
  days: 8, nights: 7, cities: 5, countries: 'Japan',
  hero: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65',
};

const ROUTE = [
  { city: 'Tokyo', nights: 2, img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf' },
  { city: 'Odawara', nights: 1, img: 'https://images.unsplash.com/photo-1522383225653-ed111181a951' },
  { city: 'Kawaguchiko', nights: 1, img: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65' },
  { city: 'Kyoto', nights: 2, img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e' },
  { city: 'Osaka', nights: 1, img: 'https://images.unsplash.com/photo-1590559899731-a382839e5549' },
];

const GLANCE = [
  { icon: CalendarDays, label: 'Duration', value: '8 days · 7 nights' },
  { icon: MapPin, label: 'Route', value: 'Tokyo → Kyoto → Osaka' },
  { icon: Users, label: 'Style', value: 'Small escorted group' },
  { icon: BedDouble, label: 'Stays', value: '4★ hotels + a ryokan' },
  { icon: UtensilsCrossed, label: 'Meals', value: 'Daily breakfast + 3 dinners' },
  { icon: Compass, label: 'Guiding', value: 'English-speaking guide' },
];

const HIGHLIGHTS = [
  { t: 'A ryokan night below Fuji', d: 'Soak in an onsen, sleep on tatami, and wake to Mount Fuji rising across Lake Kawaguchiko.' },
  { t: 'Kyoto’s temple heart', d: 'Arashiyama’s bamboo grove, the vermilion gates of Fushimi Inari, and the Golden Pavilion.' },
  { t: 'Both sides of Tokyo', d: 'Meiji Shrine calm and Senso-ji incense, then Shibuya’s crossing and Shinjuku after dark.' },
  { t: 'Nara’s ancient giants', d: 'The Great Buddha at Todai-ji, Japan’s oldest timber temples, and the famously polite deer.' },
];

const SPECIALIST = {
  name: 'Zoya Nair',
  role: 'Japan Specialist · Cox & Kings',
  years: '9 years designing Japan journeys',
  photo: 'https://images.unsplash.com/photo-1759840278361-f1adc75529a1',
  quote:
    'Ask for a clear morning at the Kawaguchiko ryokan — step out of the onsen at first light and Fuji is right there across the lake, before a single coach arrives. That, and Fushimi Inari before 8am, are the two moments people email me about after they get home.',
};

/* Each day carries a `place` for the picture-panel tag. */
const ITINERARY = [
  {
    d: 1, title: 'Arrive in Tokyo', place: 'Tokyo',
    body: 'A shared transfer meets you at the airport and brings you into the city. The rest of the day is yours to shake off the flight before we gather for a short evening briefing over your first taste of Tokyo.',
    hotel: 'Shinagawa Prince Hotel (or similar) · Standard',
    meals: 'Meals: on your own',
    img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf',
  },
  {
    d: 2, title: 'Old & new Tokyo, then Shinjuku by night', place: 'Tokyo',
    body: 'Zojoji and Senso-ji temples, the quiet of Meiji Shrine, the Imperial Palace gardens, Tokyo Skytree’s view and the roar of the Shibuya crossing. As the neon comes up we walk Shinjuku’s lantern-lit lanes together.',
    hotel: 'Shinagawa Prince Hotel (or similar) · Standard',
    meals: 'Meals: breakfast + dinner',
    img: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989',
  },
  {
    d: 3, title: 'Kamakura, Enoshima & on to Odawara', place: 'Odawara',
    body: 'South to the old capital of Kamakura — the Great Buddha, the bamboo garden at Hokoku-ji — then the sea air of Enoshima and the keep of Odawara Castle before we settle in for the night.',
    hotel: 'Well-selected hotel, Odawara',
    meals: 'Meals: breakfast',
    img: 'https://images.unsplash.com/photo-1522383225653-ed111181a951',
  },
  {
    d: 4, title: 'Mount Fuji country & a ryokan by the lake', place: 'Kawaguchiko',
    body: 'Into Fuji’s foothills: the Fifth Station panorama (weather permitting), the spring-fed pools of Oshino Hakkai, and a boat across Lake Kawaguchiko. Tonight is the trip’s quiet centrepiece — a traditional ryokan with an onsen soak and a kaiseki dinner.',
    hotel: 'Traditional ryokan, Kawaguchiko',
    meals: 'Meals: breakfast + ryokan dinner',
    img: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186',
  },
  {
    d: 5, title: 'Iyashi no Sato, Shiraito Falls & Kyoto', place: 'Kyoto',
    body: 'A thatched-roof village frozen in time, the lace-curtain sweep of Shiraito Falls, then the shinkansen carries us west to Kyoto — a thousand years of imperial capital waiting.',
    hotel: 'Well-selected hotel, Kyoto',
    meals: 'Meals: breakfast',
    img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e',
  },
  {
    d: 6, title: 'A full day in Kyoto’s heart', place: 'Kyoto',
    body: 'Arashiyama’s towering bamboo and the Zen gardens of Tenryu-ji, the endless torii of Fushimi Inari, and Kinkaku-ji — the Golden Pavilion — mirrored in its pond. Evening free to wander the lantern-lit streets of Gion.',
    hotel: 'Well-selected hotel, Kyoto',
    meals: 'Meals: breakfast',
    img: 'https://images.unsplash.com/photo-1503640538573-148065ba4904',
  },
  {
    d: 7, title: 'Nara’s temples, then Osaka', place: 'Osaka',
    body: 'To Nara for Todai-ji’s Great Buddha and the ancient timber of Horyu-ji, with the city’s gentle deer for company. On to Osaka, and the neon and street food of Dotonbori tonight.',
    hotel: 'Well-selected hotel, Osaka',
    meals: 'Meals: breakfast + lunch',
    img: 'https://images.unsplash.com/photo-1590559899731-a382839e5549',
  },
  {
    d: 8, title: 'Sayonara from Osaka', place: 'Osaka',
    body: 'A last Japanese breakfast before your transfer to the airport, and the flight home — with a camera roll you’ll be scrolling for weeks.',
    hotel: 'Departure day',
    meals: 'Meals: breakfast',
    img: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d',
  },
];

const INCLUDED = [
  '7 nights’ accommodation — 4★ hotels plus a traditional ryokan, twin/double share',
  'Daily breakfast, plus 3 dinners/lunches (Tokyo, Kawaguchiko ryokan, Nara)',
  'All sightseeing, transfers & coach travel per the itinerary',
  'An English-speaking guide throughout',
  'All entrance fees listed in the itinerary',
  'Complimentary visa assistance',
  'Complimentary travel insurance (travellers up to 69 years)',
];
const EXCLUDED = [
  'International & domestic airfare (quoted separately)',
  'GST and TCS as applicable',
  'Lunches and dinners not listed above',
  'Optional excursions and personal expenses',
  'Tips, gratuities, laundry, camera/entry fees not listed',
  'Anything not mentioned under “What’s included”',
];

const BOOKING = [
  { icon: ShieldCheck, t: 'Book with 35% advance', d: 'The balance is due in stages before you travel — 75% at 60 days, the remainder at 45 days out.' },
  { icon: Plane, t: 'Airfare quoted separately', d: 'Flights are billed apart from the land cost and paid in full at ticketing.' },
  { icon: ShieldCheck, t: 'Visa & insurance handled', d: 'Complimentary visa assistance, and travel insurance for travellers up to 69.' },
  { icon: PhoneCall, t: 'A real specialist, start to finish', d: 'One named Japan specialist plans your trip and stays reachable while you travel.' },
];

const CANCELLATION = [
  ['More than 60 days before departure', '30% of tour cost'],
  ['45–59 days before departure', '50% of tour cost'],
  ['36–44 days before departure', '75% of tour cost'],
  ['35 days or fewer / no-show', '100% of tour cost'],
  ['Airfare', 'As per the airline’s policy'],
];

const FAQS = [
  { q: 'Do I need a visa, and can you help?', a: 'Yes — Indian passport holders need a visa for Japan. Complimentary visa assistance is included; your specialist sends the checklist and guides the application. We recommend applying at least 4–6 weeks before departure.' },
  { q: 'When is the best time to travel?', a: 'Cherry blossom (late March–April) and autumn colour (November) are the signature seasons and book earliest. The tour runs on set departure dates through the year — your specialist can tell you what’s open next.' },
  { q: 'How much walking is involved?', a: 'A moderate amount — temples, gardens and city sightseeing mean several hours on your feet most days, some of it on steps and uneven paths. Comfortable shoes matter; tell your specialist about any mobility needs and we’ll advise honestly.' },
  { q: 'Is the airfare included in the price?', a: 'No — the ₹2,49,064 is the land cost per person. Flights are quoted separately so you can choose your city and cabin; your specialist will price them alongside the tour.' },
  { q: 'Can you cater for vegetarian or Jain meals?', a: 'Yes. Included meals can be arranged vegetarian or Jain with notice — Japan’s smaller towns have fewer options, so we brief the guide in advance to keep you well fed.' },
  { q: 'What size is the group?', a: 'This is a small escorted group, not a 40-seat coach tour — you travel with a compact group and one guide throughout, with a Cox & Kings specialist a phone call away.' },
];

const SIMILAR = [
  { title: 'Cherry Blossom Japan', region: 'Japan · private', nights: '13 nights', priceFrom: '₹3,10,000', img: 'https://images.unsplash.com/photo-1522383225653-ed111181a951', to: '/tour-detail-japan-5' },
  { title: 'Splendours of Japan', region: 'Japan · tailor-made', nights: '10 nights', priceFrom: '₹3,45,000', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e', to: '/tour-detail-japan' },
  { title: 'Essential South Korea', region: 'South Korea · group', nights: '8 nights', priceFrom: '₹2,25,000', img: 'https://images.unsplash.com/photo-1538485399081-7191377e8241', to: '/journeys' },
  { title: 'Vietnam, North to South', region: 'Vietnam · group', nights: '11 nights', priceFrom: '₹1,95,000', img: 'https://images.unsplash.com/photo-1528127269322-539801943592', to: '/journeys' },
];

/* Gallery section is gone — its browse role now lives in the itinerary. */
const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'itinerary', label: 'Itinerary & pictures' },
  { id: 'inclusions', label: 'Inclusions' },
  { id: 'booking', label: 'Booking' },
  { id: 'faqs', label: 'FAQs' },
];

/* ---- Reduced-motion-safe reveal ---- */
function Reveal({ children, className = '', delay = 0, y = 22, as = 'div' }) {
  const M = motion[as] || motion.div;
  const reduce = useReducedMotion();
  if (reduce) return <M className={className}>{children}</M>;
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </M>
  );
}

export default function EssenceJapan2() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('overview');
  const [activeDay, setActiveDay] = useState(1);
  const [showCancel, setShowCancel] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const reduce = useReducedMotion();

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  const day = ITINERARY.find((d) => d.d === activeDay) || ITINERARY[0];

  /* Solid nav + sticky sub-nav appear after leaving the hero. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 90);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Lock body scroll while the mobile menu is open. */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  /* Scroll-spy for the sticky section tabs. */
  useEffect(() => {
    const ids = SECTIONS.map((s) => s.id);
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.25, 0.5, 1] },
    );
    ids.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);

  const goTo = (id) => (e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 116, behavior: 'smooth' });
  };

  return (
    <div className="ej ej2">
      <a className="ej-skip" href="#overview">Skip to content</a>

      {/* ---------------- NAV (consistent with /improved) ---------------- */}
      <header className={`ej-nav${scrolled ? ' is-solid' : ''}`}>
        <Link to="/improved" className="ej-brand" aria-label="Cox & Kings — home">
          <img src="/cox-logo-new.png" alt="Cox & Kings" />
        </Link>
        <nav className="ej-nav-links" aria-label="Primary">
          {NAV_MENU.map((group) => (
            <div className="ej-navgroup" key={group.label}>
              <Link to={group.href} className="ej-navtop" aria-haspopup="true">
                {group.label}
                <ChevronDown size={14} className="ej-navcaret" aria-hidden="true" />
              </Link>
              <div className="ej-flyout" role="menu">
                <div className="ej-flyout-inner">
                  <p className="ej-flyout-blurb">{group.blurb}</p>
                  <ul className="ej-flyout-list">
                    {group.items.map((it) => (
                      <li key={it.label}>
                        <Link to={it.href} role="menuitem" className="ej-flyout-item">
                          <span className="ej-flyout-label">{it.label}</span>
                          <span className="ej-flyout-desc">{it.desc}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </nav>
        <div className="ej-nav-cta">
          <a href={CONTACT.phoneHref} className="ej-phone"><Phone size={15} /> <span>{CONTACT.phoneDisplay}</span></a>
          <a href="#enquire" onClick={goTo('enquire')} className="ej-btn ej-btn-pill">Talk to an expert</a>
          <button className="ej-burger" aria-label="Open menu" onClick={() => setMenuOpen(true)}><Menu size={22} /></button>
        </div>
      </header>

      {/* Mobile slide-in glass menu */}
      <div className={`ej-menu${menuOpen ? ' is-open' : ''}`} aria-hidden={!menuOpen}>
        <div className="ej-menu-scrim" onClick={() => setMenuOpen(false)} />
        <div className="ej-menu-panel" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="ej-menu-top">
            <button className="ej-menu-close" aria-label="Close menu" onClick={() => setMenuOpen(false)}><X size={20} /></button>
            <img className="ej-menu-logo" src="/cox-logo-new.png" alt="Cox & Kings — Est. 1758" />
          </div>
          <nav className="ej-menu-primary" aria-label="Mobile primary">
            {NAV_MENU.map((n) => (
              <Link key={n.label} to={n.href} onClick={() => setMenuOpen(false)}>
                {n.label}<span className="ej-menu-chev"><ArrowRight size={16} /></span>
              </Link>
            ))}
          </nav>
          <div className="ej-menu-divider" />
          <div className="ej-menu-secondary">
            <Link to="/journeys" onClick={() => setMenuOpen(false)}>All journeys <ArrowUpRight size={13} /></Link>
            <Link to="/improved" onClick={() => setMenuOpen(false)}>Our story <ArrowUpRight size={13} /></Link>
            <Link to={CALLBACK} onClick={() => setMenuOpen(false)}>Contact <ArrowUpRight size={13} /></Link>
            <a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)}>WhatsApp <ArrowUpRight size={13} /></a>
          </div>
          <a href={CONTACT.phoneHref} className="ej-btn ej-btn-pill ej-menu-cta" onClick={() => setMenuOpen(false)}>
            <Phone size={16} /> Speak to a specialist
          </a>
          <div className="ej-menu-foot">
            <span className="ej-menu-eyebrow">Follow the journey</span>
            <div className="ej-menu-social">
              <a href="#" aria-label="Instagram"><Instagram size={18} /></a>
              <a href="#" aria-label="Facebook"><Facebook size={18} /></a>
              <a href="#" aria-label="YouTube"><Youtube size={18} /></a>
              <a href="#" aria-label="LinkedIn"><Linkedin size={18} /></a>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- HERO ---------------- */}
      <section className="ej-hero" ref={heroRef}>
        <motion.div className="ej-hero-bg" style={{ y: reduce ? 0 : heroY }} aria-hidden="true">
          <img src={img(TOUR.hero, 2000)} alt="" />
          <div className="ej-hero-veil" />
        </motion.div>

        <div className="ej-hero-inner">
          <Reveal className="ej-breadcrumb" as="nav" delay={0.05}>
            <Link to="/improved">Home</Link><span>/</span>
            <Link to="/journeys">Group Tours</Link><span>/</span>
            <span aria-current="page">Essence Japan with Hakone</span>
          </Reveal>
          <Reveal className="ej-eyebrow" as="p" delay={0.1}>{TOUR.eyebrow}</Reveal>
          <Reveal as="h1" className="ej-hero-title" delay={0.15}>
            {TOUR.title.split('\n').map((l, i) => <span key={i}>{l}<br /></span>)}
          </Reveal>
          <Reveal className="ej-hero-stand" as="p" delay={0.22}>{TOUR.standfirst}</Reveal>

          <Reveal className="ej-hero-meta" delay={0.3}>
            <span><CalendarDays size={15} /> {TOUR.days} days · {TOUR.nights} nights</span>
            <span className="ej-dot" />
            <span><MapPin size={15} /> {TOUR.cities} cities · {TOUR.countries}</span>
            <span className="ej-dot" />
            <span><Star size={15} /> 120 guests travelled in the last 3 months</span>
          </Reveal>

          <Reveal className="ej-hero-actions" delay={0.38}>
            <div className="ej-hero-price">
              <span className="ej-price-label">From</span>
              <strong>{TOUR.priceFrom}</strong>
              <span className="ej-price-note">{TOUR.priceNote}</span>
            </div>
            <a href="#enquire" onClick={goTo('enquire')} className="ej-btn ej-btn-primary ej-btn-lg">
              Enquire &amp; get dates <ArrowRight size={17} />
            </a>
            <a href={CONTACT.phoneHref} className="ej-btn ej-btn-glass ej-btn-lg"><Phone size={16} /> {CONTACT.phoneDisplay}</a>
          </Reveal>
        </div>
      </section>

      {/* ---------------- ROUTE STRIP ---------------- */}
      <section className="ej-route" aria-label="Trip route">
        <div className="ej-route-inner">
          {ROUTE.map((r, i) => (
            <div className="ej-route-node" key={r.city}>
              <span className="ej-route-img"><img src={img(r.img, 220)} alt="" loading="lazy" /></span>
              <div className="ej-route-text">
                <span className="ej-route-city">{r.city}</span>
                <span className="ej-route-nights">{r.nights} {r.nights === 1 ? 'night' : 'nights'}</span>
              </div>
              {i < ROUTE.length - 1 && <ArrowRight size={16} className="ej-route-arrow" aria-hidden="true" />}
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- STICKY SECTION TABS ---------------- */}
      <div className={`ej-tabs${scrolled ? ' is-stuck' : ''}`} role="navigation" aria-label="Sections">
        <div className="ej-tabs-inner">
          <div className="ej-tabs-links">
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={goTo(s.id)}
                className={`ej-tab${active === s.id ? ' is-active' : ''}`}
              >
                {s.label}
              </a>
            ))}
          </div>
          <a href="#enquire" onClick={goTo('enquire')} className="ej-btn ej-btn-primary ej-tabs-cta">
            From {TOUR.priceFrom} · Enquire
          </a>
        </div>
      </div>

      <main className="ej-main">
        <div className="ej-grid">
          {/* ============ LEFT COLUMN (content) ============ */}
          <div className="ej-content">
            {/* -------- OVERVIEW -------- */}
            <section id="overview" className="ej-sec">
              <Reveal><span className="ej-kicker">The journey</span></Reveal>
              <Reveal as="h2" className="ej-h2" delay={0.05}>A first, unhurried Japan — the icons, done properly</Reveal>
              <Reveal className="ej-lede" as="p" delay={0.1}>
                Essence Japan is built for a first visit that doesn’t feel rushed. You get the
                three great cities — Tokyo, Kyoto, Osaka — threaded together with Mount Fuji,
                a night on tatami, and Nara’s temples, all led by one guide who knows the
                shortcuts, the quiet hours, and the best bowl of ramen on the block.
              </Reveal>

              <Reveal className="ej-highlights" delay={0.14}>
                {HIGHLIGHTS.map((h) => (
                  <div className="ej-hcard" key={h.t}>
                    <span className="ej-hcard-mark"><Sparkles size={16} /></span>
                    <div>
                      <h3>{h.t}</h3>
                      <p>{h.d}</p>
                    </div>
                  </div>
                ))}
              </Reveal>

              {/* Specialist — one named human, one specific quote */}
              <Reveal className="ej-specialist" delay={0.08}>
                <div className="ej-spec-photo">
                  <img src={img(SPECIALIST.photo, 320)} alt={SPECIALIST.name} loading="lazy" />
                </div>
                <div className="ej-spec-body">
                  <Quote size={26} className="ej-spec-quotemark" aria-hidden="true" />
                  <p className="ej-spec-quote">{SPECIALIST.quote}</p>
                  <div className="ej-spec-meta">
                    <strong>{SPECIALIST.name}</strong>
                    <span>{SPECIALIST.role} · {SPECIALIST.years}</span>
                  </div>
                  <a href="#enquire" onClick={goTo('enquire')} className="ej-btn ej-btn-outline">
                    Plan this with {SPECIALIST.name.split(' ')[0]} <ArrowRight size={15} />
                  </a>
                </div>
              </Reveal>
            </section>

            {/* -------- ITINERARY + PICTURES (fused, synced) -------- */}
            <section id="itinerary" className="ej-sec ej2-itin-sec">
              <Reveal><span className="ej-kicker">Day by day · in pictures</span></Reveal>
              <Reveal as="h2" className="ej-h2" delay={0.05}>Eight days, one thread</Reveal>
              <Reveal className="ej-lede" as="p" delay={0.1}>
                Walk the route a day at a time — open any day to see where you’ll stay, the
                meals we cover, and exactly what you’ll wake up to, in pictures.
              </Reveal>

              <div className="ej2-itin">
                {/* LEFT — interactive timeline */}
                <ol className="ej2-days" role="tablist" aria-label="Itinerary, day by day">
                  {ITINERARY.map((d) => {
                    const on = activeDay === d.d;
                    return (
                      <li className={`ej2-day${on ? ' is-active' : ''}`} key={d.d}>
                        <button
                          type="button"
                          className="ej2-day-head"
                          role="tab"
                          aria-selected={on}
                          aria-expanded={on}
                          onClick={() => setActiveDay(d.d)}
                        >
                          <span className="ej2-day-node" aria-hidden="true">{String(d.d).padStart(2, '0')}</span>
                          <span className="ej2-day-heads">
                            <span className="ej2-day-kicker">Day {d.d} · {d.place}</span>
                            <span className="ej2-day-title">{d.title}</span>
                          </span>
                          <Plus size={16} className="ej2-day-plus" aria-hidden="true" />
                        </button>
                        <div className="ej2-day-body" hidden={!on}>
                          {/* Inline image only surfaces on mobile, where the
                              sticky picture panel is hidden. */}
                          <img className="ej2-day-inlineimg" src={img(d.img, 640)} alt={d.title} loading="lazy" />
                          <p>{d.body}</p>
                          <ul className="ej2-day-facts">
                            <li><BedDouble size={14} aria-hidden="true" /> {d.hotel}</li>
                            <li><UtensilsCrossed size={14} aria-hidden="true" /> {d.meals}</li>
                          </ul>
                        </div>
                      </li>
                    );
                  })}
                </ol>

                {/* RIGHT — sticky picture panel, synced to the active day */}
                <div className="ej2-visual" aria-hidden="true">
                  <div className="ej2-visual-sticky">
                    <figure className="ej2-figure">
                      <div className="ej2-figure-frame">
                        <AnimatePresence mode="wait" initial={false}>
                          <motion.img
                            key={day.d}
                            src={img(day.img, 1000)}
                            alt=""
                            initial={reduce ? false : { opacity: 0, scale: 1.06 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.01 }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                          />
                        </AnimatePresence>
                        <span className="ej2-figure-index">{String(day.d).padStart(2, '0')}<em>/ 08</em></span>
                        <div className="ej2-figure-cap">
                          <span className="ej2-figure-tag">Day {day.d} · {day.place}</span>
                          <span className="ej2-figure-title">{day.title}</span>
                        </div>
                      </div>
                    </figure>

                    {/* Filmstrip — every day, one tap away (the old gallery, folded in) */}
                    <div className="ej2-film">
                      {ITINERARY.map((d) => (
                        <button
                          key={d.d}
                          type="button"
                          className={`ej2-thumb${activeDay === d.d ? ' is-on' : ''}`}
                          onClick={() => setActiveDay(d.d)}
                          aria-label={`Day ${d.d}: ${d.title}`}
                        >
                          <img src={img(d.img, 180)} alt="" loading="lazy" />
                          <span>{d.d}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* -------- INCLUSIONS -------- */}
            <section id="inclusions" className="ej-sec">
              <Reveal><span className="ej-kicker">The fine print, up front</span></Reveal>
              <Reveal as="h2" className="ej-h2" delay={0.05}>What’s included — and what’s not</Reveal>
              <div className="ej-incl">
                <Reveal className="ej-incl-col ej-incl-in" delay={0.06}>
                  <h3><Check size={17} /> Included</h3>
                  <ul>{INCLUDED.map((x) => <li key={x}>{x}</li>)}</ul>
                </Reveal>
                <Reveal className="ej-incl-col ej-incl-out" delay={0.12}>
                  <h3><X size={17} /> Not included</h3>
                  <ul>{EXCLUDED.map((x) => <li key={x}>{x}</li>)}</ul>
                </Reveal>
              </div>
            </section>

            {/* -------- BOOKING & SAFETY -------- */}
            <section id="booking" className="ej-sec">
              <Reveal><span className="ej-kicker">Booking with confidence</span></Reveal>
              <Reveal as="h2" className="ej-h2" delay={0.05}>How payment &amp; protection work</Reveal>
              <div className="ej-booking">
                {BOOKING.map((b) => (
                  <Reveal className="ej-bcard" key={b.t} delay={0.05}>
                    <span className="ej-bcard-ic"><b.icon size={20} /></span>
                    <h3>{b.t}</h3>
                    <p>{b.d}</p>
                  </Reveal>
                ))}
              </div>

              <div className="ej-cancel">
                <button className="ej-cancel-head" aria-expanded={showCancel} onClick={() => setShowCancel((s) => !s)}>
                  <span><Clock size={16} /> Cancellation schedule</span>
                  <ChevronDown size={18} className={`ej-cancel-chev${showCancel ? ' is-open' : ''}`} />
                </button>
                {showCancel && (
                  <div className="ej-cancel-body">
                    <table>
                      <thead><tr><th>If you cancel</th><th>Charge</th></tr></thead>
                      <tbody>
                        {CANCELLATION.map(([w, c]) => <tr key={w}><td>{w}</td><td>{c}</td></tr>)}
                      </tbody>
                    </table>
                    <p className="ej-cancel-note">
                      The 35% advance is non-refundable. Refunds are processed within 45 days of a
                      confirmed cancellation. Airfare follows the airline’s own policy. Your full
                      schedule is shared in writing before you pay.
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* -------- FAQs -------- */}
            <section id="faqs" className="ej-sec">
              <Reveal><span className="ej-kicker">Good to know</span></Reveal>
              <Reveal as="h2" className="ej-h2" delay={0.05}>Questions travellers ask us</Reveal>
              <div className="ej-faqs">
                {FAQS.map((f, i) => {
                  const open = openFaq === i;
                  return (
                    <div className={`ej-faq${open ? ' is-open' : ''}`} key={f.q}>
                      <button className="ej-faq-q" aria-expanded={open} onClick={() => setOpenFaq(open ? null : i)}>
                        <span>{f.q}</span>
                        <Plus size={17} className="ej-faq-plus" />
                      </button>
                      {open && <p className="ej-faq-a">{f.a}</p>}
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* ============ RIGHT COLUMN (sticky booking rail) ============ */}
          <aside className="ej-rail">
            <div className="ej-railcard">
              <span className="ej-railcard-eyebrow">Essence Japan with Hakone</span>
              <div className="ej-railcard-price">
                <span>From</span><strong>{TOUR.priceFrom}</strong>
              </div>
              <p className="ej-railcard-note">{TOUR.priceNote}</p>
              <ul className="ej-railcard-facts">
                <li><CalendarDays size={15} /> 8 days · 7 nights</li>
                <li><MapPin size={15} /> Tokyo · Fuji · Kyoto · Osaka</li>
                <li><Users size={15} /> Small escorted group</li>
                <li><BedDouble size={15} /> 4★ hotels + a ryokan</li>
              </ul>
              <a href="#enquire" onClick={goTo('enquire')} className="ej-btn ej-btn-primary ej-railcard-cta">
                Enquire &amp; get dates <ArrowRight size={16} />
              </a>
              <a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer" className="ej-btn ej-btn-outline ej-railcard-cta2">
                <MessageCircle size={16} /> WhatsApp us
              </a>
              <a href={CONTACT.phoneHref} className="ej-railcard-phone"><Phone size={14} /> {CONTACT.phoneDisplay}</a>
              <div className="ej-railcard-trust">
                <ShieldCheck size={14} /> Licensed Indian tour operator · trusted since 1758
              </div>
            </div>
          </aside>
        </div>

        {/* ---------------- SIMILAR JOURNEYS ---------------- */}
        <section className="ej-similar" aria-label="Similar journeys">
          <div className="ej-similar-head">
            <Reveal><span className="ej-kicker">Keep exploring</span></Reveal>
            <Reveal as="h2" className="ej-h2" delay={0.05}>More of Japan &amp; Asia</Reveal>
          </div>
          <div className="ej-similar-grid">
            {SIMILAR.map((s, i) => (
              <Reveal key={s.title} delay={(i % 4) * 0.05}>
                <Link to={s.to} className="ej-simcard">
                  <span className="ej-simcard-img"><img src={img(s.img, 640)} alt={s.title} loading="lazy" /></span>
                  <div className="ej-simcard-body">
                    <span className="ej-simcard-region">{s.region}</span>
                    <h3>{s.title}</h3>
                    <div className="ej-simcard-foot">
                      <span>{s.nights}</span>
                      <span className="ej-simcard-price">from {s.priceFrom}</span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---------------- ENQUIRE / CTA ---------------- */}
        <section id="enquire" className="ej-cta">
          <div className="ej-cta-inner">
            <Reveal><span className="ej-kicker ej-kicker-light">Start the conversation</span></Reveal>
            <Reveal as="h2" className="ej-cta-title" delay={0.05}>
              Talk to a Japan specialist — no obligation
            </Reveal>
            <Reveal className="ej-cta-copy" as="p" delay={0.1}>
              Tell us your dates and who’s travelling. {SPECIALIST.name} will send live departure
              dates, a full price breakdown, and answer anything before you commit a rupee.
            </Reveal>
            <Reveal className="ej-cta-actions" delay={0.16}>
              <a href={CONTACT.phoneHref} className="ej-btn ej-btn-primary ej-btn-lg"><Phone size={17} /> Call {CONTACT.phoneDisplay}</a>
              <a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer" className="ej-btn ej-btn-glass ej-btn-lg"><MessageCircle size={17} /> WhatsApp us</a>
              <a href={`mailto:${CONTACT.email}`} className="ej-btn ej-btn-glass ej-btn-lg">Email an enquiry</a>
            </Reveal>
            <Reveal className="ej-cta-fine" as="p" delay={0.22}>
              Specialists available Mon–Sat, 9:30am–6:30pm IST · {CONTACT.email}
            </Reveal>
          </div>
        </section>
      </main>

      {/* ---------------- FOOTER ---------------- */}
      <footer className="ej-footer">
        <div className="ej-footer-top">
          <div className="ej-footer-brand">
            <img src="/cox-logo-white.png" alt="Cox & Kings" />
            <p>The world’s longest-established travel company. Journeys crafted since 1758.</p>
          </div>
          <div className="ej-footer-cols">
            <div>
              <h4>Explore</h4>
              <Link to="/journeys">All journeys</Link>
              <Link to="/journeys?where=Japan">Japan</Link>
              <Link to="/tour-detail-japan-5">Cherry Blossom Japan</Link>
              <Link to="/improved">Our story</Link>
            </div>
            <div>
              <h4>Company</h4>
              <Link to={CALLBACK}>Contact</Link>
              <Link to="/improved">Why Cox &amp; Kings</Link>
              <a href={CONTACT.phoneHref}>{CONTACT.phoneDisplay}</a>
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            </div>
            <div>
              <h4>Follow</h4>
              <div className="ej-footer-social">
                <a href="#" aria-label="Instagram"><Instagram size={18} /></a>
                <a href="#" aria-label="Facebook"><Facebook size={18} /></a>
                <a href="#" aria-label="YouTube"><Youtube size={18} /></a>
                <a href="#" aria-label="LinkedIn"><Linkedin size={18} /></a>
              </div>
            </div>
          </div>
        </div>
        <div className="ej-footer-bar">
          <span>© {new Date().getFullYear()} Cox &amp; Kings (Wilson &amp; Hughes India Pvt. Ltd.)</span>
          <span>IATA accredited · TAAI &amp; ASTA member</span>
        </div>
      </footer>

      {/* ---------------- MOBILE STICKY BOOKING BAR ---------------- */}
      <div className="ej-mobar">
        <div className="ej-mobar-price">
          <span>From</span><strong>{TOUR.priceFrom}</strong>
        </div>
        <a href={CONTACT.phoneHref} className="ej-btn ej-btn-outline ej-mobar-call" aria-label="Call us"><Phone size={18} /></a>
        <a href="#enquire" onClick={goTo('enquire')} className="ej-btn ej-btn-primary ej-mobar-cta">Enquire</a>
      </div>
    </div>
  );
}
