import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Menu, X, ArrowRight, ArrowLeft, ArrowUpRight, Star, MapPin, Compass,
  Calendar, Search, Phone, Sparkles, Send, ChevronDown, Quote,
  Instagram, Facebook, Youtube, Linkedin,
  Award, ShieldCheck, Globe2, Car, Hotel,
  Heart, Mountain, Waves, Landmark, Leaf, Gem,
  Play, Eye, Users, Bookmark, MessageCircle, Share2,
  Plane, Utensils, Accessibility, Wallet, Repeat, Stamp,
  PhoneCall, PenTool, Headset, CheckCircle2, Gauge,
} from 'lucide-react';
import { GlyphHeart, GlyphMountain, GlyphRipple, GlyphMonument, GlyphDeer, GlyphDiamond } from './MoodIcons';
import ChatBot from '../components/ChatBot';
import './Luxe2Improved.css';

/* ============================================================
   Cox & Kings - "Luxe 2" homepage (self-contained, route /luxe2)
   Blue-forward brand identity (Voyager Blue/500), heritage-first,
   sourced trust credentials, "Discover my mood" section, Enaya AI.
   Editorial-luxury + glassmorphism. Design tokens from design.md.
   Does not touch any existing page.
   ============================================================ */

const sizedUnsplash = (id, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

/* ---------- Human contact (one number, reused everywhere) ---------- */
const PHONE_DISPLAY = '+91 85560 01700';
const PHONE_TEL = 'tel:+918556001700';
const OFFICE_SHORT = 'Fort, Mumbai 400001';
const OFFICE_FULL = 'Turner Morrison House, 16 Bank Street, Fort, Mumbai 400001';
const WHATSAPP = 'https://wa.me/918556001700?text=Hi%20Cox%20%26%20Kings%2C%20I%27d%20like%20to%20plan%20a%20trip.';

/* ---------- Nav (each item reveals a matching dropdown on hover) ---------- */
const NAV = [
  { label: 'Heritage', href: '#heritage', menu: [
    { label: 'Our story since 1758', href: '#heritage' },
    { label: 'Why Cox & Kings', href: '#curated' },
    { label: 'Press & awards', href: '#press' },
    { label: 'Traveller reviews', href: '#reviews' },
  ] },
  { label: 'Journeys', href: '#curated', menu: [
    { label: 'Tailor-made trips', href: '#curated' },
    { label: 'Escorted group tours', href: '#curated' },
    { label: 'Luxury rail', href: '#curated' },
    { label: 'Private villas', href: '#curated' },
    { label: 'Honeymoons & milestones', href: '#curated' },
  ] },
  { label: 'Discover', href: '#destinations', menu: [
    { label: 'Santorini, Greece', href: '#destinations' },
    { label: 'Kyoto, Japan', href: '#destinations' },
    { label: 'The Maldives', href: '#destinations' },
    { label: 'Rajasthan, India', href: '#destinations' },
    { label: 'Travel clips', href: '#destinations' },
  ] },
  { label: 'Reviews', href: '#reviews', menu: [
    { label: 'Traveller stories', href: '#reviews' },
    { label: 'Google reviews', href: '#reviews' },
    { label: 'Tripadvisor', href: '#reviews' },
    { label: 'Press coverage', href: '#press' },
  ] },
  { label: 'Moods', href: '#mood', menu: [
    { label: 'Romance & honeymoon', href: '#mood' },
    { label: 'Adventure', href: '#mood' },
    { label: 'Culture & heritage', href: '#mood' },
    { label: 'Wellness & escape', href: '#mood' },
  ] },
];

/* ---------- Search dropdown options ---------- */
const POPULAR_DEST = [
  'Santorini, Greece', 'Kyoto, Japan', 'The Maldives', 'Rajasthan, India',
  'Swiss Alps', 'Amalfi Coast, Italy', 'African Safari', 'Iceland',
];
const WHO_OPTS = ['Just the two of us', 'Family with kids', '3 – 4 travellers', 'A larger group', 'Travelling solo'];
const WHEN_OPTS = ['Next 3 months', 'Later in 2026', '2027 & beyond', "I'm flexible"];
const NAV_SECONDARY = [
  'Tailor-Made', 'Escorted Tours', 'Luxury Rail', 'Private Villas',
  'Honeymoons', 'Group Departures', 'Press Room', 'Contact',
];

/* ---------- Hero rotating stat chips ---------- */
const HERO_STATS = [
  'Est. 1758',
  '2,400+ Traveller Reviews',
  '100+ Destinations',
  'Private, Tailor-Made',
  '24/7 Concierge',
];

/* ---------- Curated stays (villas inspiration) ---------- */
const FILTERS = ['All', 'Private Villas', 'Heritage Hotels', 'Safari Lodges', 'Island Resorts', 'Luxury Rail'];
/* Each stay shows four highlights that are genuinely specific to it - not a shared boilerplate list */
const STAYS = [
  { name: 'Amankora, Bhutan', loc: 'Paro Valley, Himalayas', price: '₹2,40,000', nights: 7, rating: 4.9, cat: 'Private Villas', id: '1528127269322-539801943592',
    highlights: [
      { icon: Hotel, label: '5★ lodge suites' },
      { icon: Car, label: 'Private 4×4 transfers' },
      { icon: Mountain, label: 'Guided dzong treks' },
      { icon: Leaf, label: 'Daily spa & meals' },
    ] },
  { name: 'Aman Venice', loc: 'Grand Canal, Italy', price: '₹3,15,000', nights: 5, rating: 4.9, cat: 'Heritage Hotels', id: '1523906834658-6e24ef2386f9',
    highlights: [
      { icon: Hotel, label: '5★ palazzo rooms' },
      { icon: Waves, label: 'Private water taxi' },
      { icon: Landmark, label: 'After-hours St Mark’s' },
      { icon: Compass, label: 'Private city guide' },
    ] },
  { name: 'Singita Sabi Sand', loc: 'Kruger, South Africa', price: '₹4,10,000', nights: 6, rating: 5.0, cat: 'Safari Lodges', id: '1547471080-7cc2caa01a7e',
    highlights: [
      { icon: Hotel, label: '5★ bush lodge' },
      { icon: Car, label: 'Twice-daily game drives' },
      { icon: Compass, label: 'Private ranger & tracker' },
      { icon: Leaf, label: 'All meals & drinks' },
    ] },
  { name: 'Soneva Fushi', loc: 'Baa Atoll, Maldives', price: '₹2,85,000', nights: 5, rating: 4.9, cat: 'Island Resorts', id: '1573843981267-be1999ff37cd',
    highlights: [
      { icon: Hotel, label: '5★ overwater villa' },
      { icon: Waves, label: 'Seaplane transfers' },
      { icon: Heart, label: 'Personal beach butler' },
      { icon: Compass, label: 'Snorkel & dive trips' },
    ] },
];

/* ---------- Escorted group departures (families · groups · seniors) ----------
   Fixed-date, fully-escorted tours: flights included, capped group size,
   senior-friendly comfort signals and a real "seats filling" cue.        */
const GROUP_TOURS = [
  { name: 'Grand European Sojourn', route: 'London · Paris · Lucerne · Venice · Rome',
    days: 13, nights: 12, price: '₹2,85,000', departures: 'Apr · Jun · Sep · Oct 2026',
    cap: 'Max 24 guests', tagMonths: 'Apr · Jun (6 left) · Sep', pace: 'Balanced',
    rating: 4.8, reviews: 1180, id: '1502602898657-3e91760cbb34',
    comfort: [
      { icon: Globe2, label: '5 countries, one trip' },
      { icon: Compass, label: 'High-speed trains between cities' },
      { icon: Hotel, label: 'Central 4★ / 5★ hotels' },
      { icon: Users, label: 'Dedicated tour manager' },
    ] },
  { name: 'Splendours of Japan', route: 'Tokyo · Hakone · Kyoto · Nara · Osaka',
    days: 12, nights: 11, price: '₹2,95,000', departures: 'Mar · Apr · Oct · Nov 2026',
    cap: 'Max 20 guests', tagMonths: 'Mar · Apr (filling fast) · Oct', pace: 'Relaxed',
    rating: 4.9, reviews: 640, id: '1493976040374-85c8e12f0c0e', detail: '/tour-detail-japan',
    comfort: [
      { icon: Compass, label: 'Local English-speaking guide' },
      { icon: Utensils, label: 'Veg & Jain meals arranged' },
      { icon: Hotel, label: 'Ryokan + city hotel stays' },
      { icon: Accessibility, label: 'Gentle, relaxed pace' },
    ] },
  { name: 'Switzerland & the Alps', route: 'Zurich · Interlaken · Zermatt · Geneva',
    days: 12, nights: 11, price: '₹2,55,000', departures: 'May · Jul · Aug · Sep 2026',
    cap: 'Max 24 guests', tagMonths: 'May · Jul (9 left) · Sep', pace: 'Relaxed',
    rating: 4.8, reviews: 520, id: '1530841377377-3ff06c0ca713',
    comfort: [
      { icon: Mountain, label: 'Glacier Express scenic rail' },
      { icon: Waves, label: 'Lakes & peaks by cable car' },
      { icon: Accessibility, label: 'Senior-friendly pace' },
      { icon: Hotel, label: 'Central 4★ / 5★ hotels' },
    ] },
];

/* ---------- How bespoke works (3 steps) + your travel designer ---------- */
const HOW_STEPS = [
  { icon: MessageCircle, step: '01', title: 'Share your dream',
    body: 'Tell one expert where you long to go and how you like to travel - by phone, WhatsApp or a quick callback.' },
  { icon: PenTool, step: '02', title: 'We design your version',
    body: 'Every curated journey here is a starting point. Your designer reshapes it around your dates, pace and budget.' },
  { icon: Headset, step: '03', title: 'Travel with 24/7 support',
    body: 'Travel knowing a real person is one call away, in your timezone, for the whole journey.' },
];
const DESIGNER = {
  name: 'Aanya Kapoor', role: 'Senior Travel Designer',
  tenure: '12 years with Cox & Kings',
  blurb: 'I plan 30 trips a year, never 300. Tell me how you want to feel, and I will build the journey around you - not the other way round.',
  specialises: 'Japan · Italy · honeymoons & milestones',
  stats: [
    { n: '12', l: 'years designing' },
    { n: '~30', l: 'trips a year' },
    { n: '4.9★', l: 'traveller rating' },
  ],
  photo: '/aanya-kapoor.jpg',
};

/* ---------- Money-safety, in plain words ---------- */
const SAFETY = [
  { icon: Wallet, label: 'Low deposit', note: 'Book from 20% today' },
  { icon: Repeat, label: 'Free changes', note: 'Up to 45 days before travel' },
  { icon: Stamp, label: 'Visa support', note: 'Paperwork handled for you' },
  { icon: ShieldCheck, label: 'Financially protected', note: 'Your money is held securely' },
];

/* ---------- Above-the-fold quick picks (hero) ---------- */
const QUICK_PICKS = ['Japan', 'Europe', 'Maldives', 'Safari', 'Rajasthan'];

/* ---------- Sourced, specific trust credentials (Heritage section) ---------- */
const TRUST_BADGES = [
  { icon: Star, stat: '4.9★', label: 'from 2,400+ verified reviews' },
  { icon: Award, stat: 'Condé Nast 2024', label: 'Readers’ Choice Award, India' },
  { icon: ShieldCheck, stat: 'Since 1758', label: '267 years · financially protected' },
  { icon: Globe2, stat: '100+ countries', label: 'on all seven continents' },
];

/* ---------- Discover my mood ---------- */
const MOODS = [
  { key: 'Romance', icon: GlyphHeart, accent: '#BD4011',
    line: 'Slow mornings, private dinners, and nobody in the world but the two of you.',
    place: 'Santorini & the Amalfi Coast', meta: '7 nights · from ₹3,10,000', id: '1533105079780-92b9be482077' },
  { key: 'Adventure', icon: GlyphMountain, accent: '#0B5AB1',
    line: 'Summits before sunrise, white water by noon, stories you’ll tell for years.',
    place: 'Patagonia & the Himalayas', meta: '10 nights · from ₹2,95,000', id: '1454496522488-7a8e488e8606' },
  { key: 'Serenity', icon: GlyphRipple, accent: '#337D64',
    line: 'Overwater silence, a private sandbank, and the sound of absolutely nothing.',
    place: 'The Maldives & Seychelles', meta: '6 nights · from ₹2,85,000', id: '1573843981267-be1999ff37cd' },
  { key: 'Culture', icon: GlyphMonument, accent: '#09488E',
    line: 'Temples at dawn, lantern-lit markets at dusk, history you can reach out and touch.',
    place: 'Kyoto & Rajasthan', meta: '8 nights · from ₹2,60,000', id: '1493976040374-85c8e12f0c0e' },
  { key: 'Wildlife', icon: GlyphDeer, accent: '#71260A',
    line: 'Eye to eye with the wild at dawn - always from a respectful distance.',
    place: 'The Serengeti & Borneo', meta: '7 nights · from ₹4,10,000', id: '1516426122078-c23e76319801' },
  { key: 'Indulgence', icon: GlyphDiamond, accent: '#042447',
    line: 'Michelin tables, grand suites, a private guide, and not one single compromise.',
    place: 'Paris & Dubai', meta: '5 nights · from ₹3,80,000', id: '1502602898657-3e91760cbb34' },
];

/* ---------- Destinations carousel (arch feature) ---------- */
const DESTS = [
  { name: 'Santorini, Greece', tags: ['Dramatic cliffs', 'Modern luxury', 'The Aegean Sea'],
    blurb: 'White-washed villages tumbling into a flooded caldera, sunsets the colour of wine, and cave-suites carved into the cliff.',
    best: 'Apr – Oct', trips: '14 itineraries', from: '₹2,95,000', id: '1570077188670-e3a8d69ac5ff' },
  { name: 'Kyoto, Japan', tags: ['Cherry blossom', 'Ancient temples', 'Ryokan stays'],
    blurb: 'A thousand shrines, lantern-lit lanes in Gion, and ryokan dinners served by candlelight as the maples turn.',
    best: 'Mar – May · Nov', trips: '11 itineraries', from: '₹3,40,000', id: '1493976040374-85c8e12f0c0e' },
  { name: 'African Safari', tags: ['The Great Migration', 'Private reserves', 'Star beds'],
    blurb: 'Dawn game drives across the Mara, private conservancies all to yourself, and beds made up beneath the stars.',
    best: 'Jun – Oct', trips: '9 itineraries', from: '₹4,10,000', id: '1516426122078-c23e76319801' },
  { name: 'Rajasthan, India', tags: ['Palace hotels', 'Desert forts', 'Royal heritage'],
    blurb: 'Sleep where maharajas slept, ride camels into the Thar at dusk, and wake to forts glowing gold over the lakes.',
    best: 'Oct – Mar', trips: '16 itineraries', from: '₹1,95,000', id: '1599661046289-e31897846e41' },
  { name: 'Swiss Alps', tags: ['Glacier Express', 'Alpine lodges', 'Lakes & peaks'],
    blurb: 'Reserved panoramic seats on the slowest express in the world, lake-edge towns, and a private lodge under the peaks.',
    best: 'Jun – Sep', trips: '12 itineraries', from: '₹2,75,000', id: '1527668752968-14dc70a27c95' },
  { name: 'Amalfi Coast, Italy', tags: ['Cliffside towns', 'Lemon groves', 'La dolce vita'],
    blurb: 'Pastel towns stacked above the Tyrrhenian, a private skipper to hidden coves, and long lunches over the sea.',
    best: 'Apr – Oct', trips: '13 itineraries', from: '₹2,80,000', id: '1530841377377-3ff06c0ca713' },
  { name: 'The Maldives', tags: ['Overwater villas', 'Private sandbanks', 'House reefs'],
    blurb: 'Wake over the lagoon, breakfast floated to your deck, and a private sandbank reserved for just the two of you.',
    best: 'Nov – Apr', trips: '10 itineraries', from: '₹2,85,000', id: '1573843981267-be1999ff37cd' },
];

/* ---------- Travel clips (short-form discovery - full-screen viewer) ---------- */
const CLIPS = [
  { place: 'Kyoto, Japan', caption: 'Cherry blossom dawn at Kiyomizu-dera', tag: 'Tailor-Made',
    desc: 'We arrange private, before-the-crowds access at first light - just you, the temple, and the blossom.',
    likes: '24.7k', views: '1.2M', duration: '0:48', id: '1493976040374-85c8e12f0c0e' },
  { place: 'Santorini, Greece', caption: 'Blue hour over the caldera', tag: 'Honeymoon',
    desc: 'A private cliff-edge terrace, chilled Assyrtiko, and the most photographed sunset on earth - without the crowd.',
    likes: '31.4k', views: '2.1M', duration: '0:36', id: '1570077188670-e3a8d69ac5ff' },
  { place: 'The Maldives', caption: 'Overwater mornings, nobody around', tag: 'Island Escape',
    desc: 'Wake over the lagoon, breakfast floated to your deck, and a private sandbank reserved for two.',
    likes: '48.9k', views: '3.6M', duration: '0:52', id: '1573843981267-be1999ff37cd' },
  { place: 'The Serengeti', caption: 'Sunrise with the great herds', tag: 'Safari',
    desc: 'Track the migration with a private guide, then return to a star-bed camp moved just for your dates.',
    likes: '19.2k', views: '880k', duration: '1:04', id: '1516426122078-c23e76319801' },
  { place: 'Rajasthan, India', caption: 'Inside a 400-year-old palace', tag: 'Heritage',
    desc: 'Stay in a working maharaja’s palace, dine in the durbar hall, and tour the forts before the gates open.',
    likes: '27.6k', views: '1.5M', duration: '0:41', id: '1599661046289-e31897846e41' },
  { place: 'Swiss Alps', caption: 'The Glacier Express window seat', tag: 'Luxury Rail',
    desc: 'Reserved panoramic seats, a private alpine lodge, and the slowest express train in the world.',
    likes: '22.1k', views: '1.1M', duration: '0:58', id: '1530841377377-3ff06c0ca713' },
];

/* ---------- Photo-first reviews ---------- */
const REVIEWS = [
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

/* One review card: a small photo gallery that auto-slides through the
   traveller's photos on hover/focus, with dots showing how many. */
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

const PRESS = [
  { name: 'Condé Nast Traveler', src: '/press/cntraveller.svg' },
  { name: 'National Geographic', src: '/press/natgeo.svg' },
  { name: 'Travel + Leisure', src: '/press/travel-leisure.svg' },
  { name: 'Forbes', src: '/press/forbes.svg' },
  { name: "Harper's Bazaar", src: '/press/harpers-bazaar.svg' },
  { name: 'The Telegraph', src: '/press/telegraph.svg' },
];

// Short, fully-visible destinations typed out after the fixed "Where to?" prompt
const TRIP_SUGGESTIONS = [
  'Santorini, Greece',
  'Kyoto, Japan',
  'the Serengeti',
  'Rajasthan, India',
  'the Maldives',
  'the Amalfi Coast',
];

/* ---------- Hooks ---------- */
function useReveal() {
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

/* Rest state is ALWAYS the final number - the count-up is a pure progressive
   enhancement that animates the last stretch (from ~82%). The page therefore
   never renders 0 / 0+ / 0%, even if JS or the observer never fires. */
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

export default function Luxe2Improved() {
  useReveal();
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [statIdx, setStatIdx] = useState(0);
  const [filter, setFilter] = useState('All');
  const [travelMode, setTravelMode] = useState('group'); // 'group' (escorted, fixed price) leads; 'bespoke' is a placeholder for now
  const [callbackOpen, setCallbackOpen] = useState(false);
  const [callbackSent, setCallbackSent] = useState(false);
  const [destIdx, setDestIdx] = useState(0);
  const [moodIdx, setMoodIdx] = useState(0);
  const [openClip, setOpenClip] = useState(null);   // index of clip open in full-screen viewer
  const touchStart = useRef(null);
  // guided search - animated typewriter for the "what kind of trip" field
  const [tripTyped, setTripTyped] = useState('');
  const [tripCaret, setTripCaret] = useState(true);
  const [tripActive, setTripActive] = useState(false); // focused or has a value → pause animation
  const [statsRun, setStatsRun] = useState(false);
  // Custom search dropdowns (Where to / How many / When)
  const [openField, setOpenField] = useState(null); // 'trip' | 'who' | 'when' | null
  const [tripValue, setTripValue] = useState('');
  const [whoValue, setWhoValue] = useState('');
  const [whenValue, setWhenValue] = useState('');
  const searchRef = useRef(null);
  const heroRef = useRef(null);
  const statsRef = useRef(null);

  // Close any open search dropdown on outside click / Escape
  useEffect(() => {
    if (!openField) return;
    const onDown = (e) => { if (searchRef.current && !searchRef.current.contains(e.target)) setOpenField(null); };
    const onKey = (e) => { if (e.key === 'Escape') setOpenField(null); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [openField]);

  // Hide the page scrollbar + go full-bleed, only while this page is mounted
  useEffect(() => {
    document.documentElement.classList.add('lx2i-noscroll');
    return () => document.documentElement.classList.remove('lx2i-noscroll');
  }, []);

  // Sticky header state
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Hero parallax
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const onScroll = () => {
      const y = window.scrollY;
      if (heroRef.current) heroRef.current.style.setProperty('--py', `${y * 0.18}px`);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Rotate hero stat chips
  useEffect(() => {
    const t = setInterval(() => setStatIdx((i) => (i + 1) % HERO_STATS.length), 2600);
    return () => clearInterval(t);
  }, []);

  // Trigger count-up when stats band enters view (fire immediately under reduced motion)
  useEffect(() => {
    if (!statsRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setStatsRun(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setStatsRun(true); io.disconnect(); } }, { threshold: 0.25 });
    io.observe(statsRef.current);
    return () => io.disconnect();
  }, []);

  // Lock scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const go = useCallback((href) => (e) => {
    e.preventDefault();
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const openCallback = useCallback((e) => { if (e) e.preventDefault(); setMenuOpen(false); setCallbackSent(false); setCallbackOpen(true); }, []);

  // lock scroll while the callback modal is open
  useEffect(() => {
    if (!callbackOpen) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') setCallbackOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [callbackOpen]);

  // jump to journeys; quick-picks also flip to the right travel mode
  const jumpToJourneys = useCallback((mode) => (e) => {
    if (e) e.preventDefault();
    if (mode) setTravelMode(mode);
    const el = document.querySelector('#curated');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const stays = filter === 'All' ? STAYS : STAYS.filter((s) => s.cat === filter);
  const mood = MOODS[moodIdx];
  const dest = DESTS[destIdx];
  const nextDest = () => setDestIdx((i) => (i + 1) % DESTS.length);
  const prevDest = () => setDestIdx((i) => (i - 1 + DESTS.length) % DESTS.length);

  /* ---- Full-screen clip viewer ---- */
  const closeClip = useCallback(() => setOpenClip(null), []);
  const nextClip = useCallback(() => setOpenClip((i) => (i === null ? i : (i + 1) % CLIPS.length)), []);
  const prevClip = useCallback(() => setOpenClip((i) => (i === null ? i : (i - 1 + CLIPS.length) % CLIPS.length)), []);

  useEffect(() => {
    if (openClip === null) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') closeClip();
      else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nextClip();
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prevClip();
    };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [openClip, closeClip, nextClip, prevClip]);

  const onClipTouchStart = (e) => { touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
  const onClipTouchEnd = (e) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 45) return;        // ignore taps
    if (Math.abs(dy) >= Math.abs(dx)) { dy < 0 ? nextClip() : prevClip(); }  // swipe up = next
    else { dx < 0 ? nextClip() : prevClip(); }                    // swipe left = next
  };

  const clip = openClip === null ? null : CLIPS[openClip];

  // typewriter that cycles trip suggestions in the first search field; pauses while the user is typing
  useEffect(() => {
    if (tripActive) return;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setTripTyped(TRIP_SUGGESTIONS[0]); return; }
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

  // blinking caret for the typewriter
  useEffect(() => {
    if (tripActive) return;
    const id = setInterval(() => setTripCaret((c) => !c), 530);
    return () => clearInterval(id);
  }, [tripActive]);

  return (
    <>
    <div className="lx2i">
      <div className="lx2i-grain" aria-hidden="true" />

      {/* ============ HEADER ============ */}
      <header className={`lx2i-header ${scrolled ? 'is-scrolled' : ''}`}>
        {/* Always-visible human-contact strip - no scrolling required */}
        <div className="lx2i-util">
          <div className="lx2i-util__inner">
            <span className="lx2i-util__tag"><Headset size={14} /> Speak to a real travel expert, not a bot</span>
            <div className="lx2i-util__links">
              <span className="lx2i-util__addr"><MapPin size={14} /> {OFFICE_SHORT}</span>
              <a href={PHONE_TEL} className="lx2i-util__link"><Phone size={14} /> {PHONE_DISPLAY}</a>
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="lx2i-util__link lx2i-util__link--wa"><MessageCircle size={14} /> WhatsApp</a>
            </div>
          </div>
        </div>
        <div className="lx2i-header__inner">
          <a href="#top" onClick={go('#top')} className="lx2i-logo" aria-label="Cox & Kings - home">
            <img src="/cox-logo-new.png" alt="Cox & Kings - Est. 1758" />
          </a>
          <nav className="lx2i-nav" aria-label="Primary">
            {NAV.map((n) => (
              <div key={n.label} className="lx2i-nav__item">
                <a href={n.href} onClick={go(n.href)} className="lx2i-nav__link">
                  <span>{n.label}</span>
                  {n.menu && <ChevronDown size={14} className="lx2i-nav__caret" aria-hidden="true" />}
                </a>
                {n.menu && (
                  <div className="lx2i-nav__drop" role="menu" aria-label={n.label}>
                    <div className="lx2i-nav__dropcard">
                      {n.menu.map((m) => (
                        <a key={m.label} href={m.href} onClick={go(m.href)} className="lx2i-nav__dropitem" role="menuitem">
                          <span>{m.label}</span>
                          <ArrowRight size={14} />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>
          <div className="lx2i-header__right">
            <a href={PHONE_TEL} className="lx2i-btn lx2i-btn--secondary lx2i-header__cta">
              <Phone size={15} /> Speak to an Expert
            </a>
            <button className="lx2i-burger" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* ============ MOBILE / SLIDE-IN NAV (ZOOX-style glass panel) ============ */}
      <div className={`lx2i-menu ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen}>
        <div className="lx2i-menu__scrim" onClick={() => setMenuOpen(false)} />
        <div className="lx2i-menu__panel" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="lx2i-menu__top">
            <button className="lx2i-menu__close" aria-label="Close menu" onClick={() => setMenuOpen(false)}><X size={20} /></button>
            <img src="/cox-logo-new.png" alt="Cox & Kings - Est. 1758" className="lx2i-menu__logo" />
          </div>
          <nav className="lx2i-menu__primary" aria-label="Mobile primary">
            {NAV.map((n) => (
              <a key={n.label} href={n.href} onClick={go(n.href)}>
                {n.label}
                <span className="lx2i-menu__chev"><ArrowRight size={16} /></span>
              </a>
            ))}
          </nav>
          <div className="lx2i-menu__divider" />
          <div className="lx2i-menu__secondary">
            {NAV_SECONDARY.map((l) => (
              <a key={l} href="#curated" onClick={go('#curated')}>{l} <ArrowUpRight size={13} /></a>
            ))}
          </div>
          <div className="lx2i-menu__office">
            <span className="lx2i-eyebrow">OUR OFFICE</span>
            <p className="lx2i-menu__addr"><MapPin size={15} /> {OFFICE_FULL}</p>
            <a href={PHONE_TEL} className="lx2i-menu__addrphone"><Phone size={14} /> {PHONE_DISPLAY}</a>
          </div>
          <div className="lx2i-menu__foot">
            <span className="lx2i-eyebrow">FOLLOW THE JOURNEY</span>
            <div className="lx2i-menu__social">
              <a href="#" aria-label="Instagram"><Instagram size={18} /></a>
              <a href="#" aria-label="Facebook"><Facebook size={18} /></a>
              <a href="#" aria-label="YouTube"><Youtube size={18} /></a>
              <a href="#" aria-label="LinkedIn"><Linkedin size={18} /></a>
            </div>
          </div>
        </div>
      </div>

      {/* ============ HERO ============ */}
      <section className="lx2i-hero" id="top" ref={heroRef}>
        <div className="lx2i-hero__bgwrap" aria-hidden="true">
          <div className="lx2i-hero__bg" style={{ backgroundImage: `url(${sizedUnsplash('1527668752968-14dc70a27c95', 2000)})` }} />
          <div className="lx2i-hero__veil" />
        </div>

        <div className="lx2i-hero__inner">
          <div className="lx2i-hero__left">
            <span className="lx2i-eyebrow lx2i-eyebrow--light lx2i-fade" style={{ '--d': '.1s' }}>THE WORLD'S MOST EXPERIENCED TRAVEL COMPANY · SINCE 1758</span>
            <h1 className="lx2i-hero__title">
              <span className="lx2i-fade" style={{ '--d': '.2s' }}>Discover the World</span>
              <em className="lx2i-fade" style={{ '--d': '.36s' }}>in Luxury &amp; Style.</em>
            </h1>
            {/* Glass search */}
            <form ref={searchRef} className="lx2i-search lx2i-fade" style={{ '--d': '.76s' }} onSubmit={(e) => e.preventDefault()} role="search">
              <div className={`lx2i-search__field lx2i-search__field--trip ${openField === 'trip' ? 'is-open' : ''}`}>
                <MapPin size={17} />
                <span className="lx2i-search__fixed" aria-hidden="true">Where to?</span>
                <input
                  type="text"
                  aria-label="Where to"
                  className="lx2i-search__typein"
                  value={tripValue}
                  placeholder={tripActive || tripValue ? '' : `${tripTyped}${tripCaret ? '▍' : ' '}`}
                  onFocus={() => { setTripActive(true); setOpenField('trip'); }}
                  onChange={(e) => { setTripValue(e.target.value); setTripActive(true); setOpenField('trip'); }}
                />
                {openField === 'trip' && (
                  <div className="lx2i-search__drop" role="listbox" aria-label="Popular destinations">
                    <span className="lx2i-search__droplabel">Popular destinations</span>
                    {POPULAR_DEST
                      .filter((d) => d.toLowerCase().includes(tripValue.toLowerCase()))
                      .map((d) => (
                        <button key={d} type="button" className={`lx2i-search__opt ${tripValue === d ? 'is-on' : ''}`} role="option" aria-selected={tripValue === d} onClick={() => { setTripValue(d); setOpenField(null); }}>
                          <MapPin size={15} /> <span>{d}</span>
                        </button>
                      ))}
                  </div>
                )}
              </div>
              <span className="lx2i-search__div" />
              <div className={`lx2i-search__field lx2i-search__field--who ${openField === 'who' ? 'is-open' : ''}`}>
                <Users size={17} />
                <button type="button" className="lx2i-search__trigger" aria-haspopup="listbox" aria-expanded={openField === 'who'} onClick={() => setOpenField(openField === 'who' ? null : 'who')}>
                  <span className={whoValue ? '' : 'lx2i-search__ph'}>{whoValue || 'How many people?'}</span>
                  <ChevronDown size={15} className="lx2i-search__chev" />
                </button>
                {openField === 'who' && (
                  <div className="lx2i-search__drop" role="listbox" aria-label="How many people">
                    {WHO_OPTS.map((o) => (
                      <button key={o} type="button" className={`lx2i-search__opt ${whoValue === o ? 'is-on' : ''}`} role="option" aria-selected={whoValue === o} onClick={() => { setWhoValue(o); setOpenField(null); }}>
                        <Users size={15} /> <span>{o}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <span className="lx2i-search__div" />
              <div className={`lx2i-search__field lx2i-search__field--when ${openField === 'when' ? 'is-open' : ''}`}>
                <Calendar size={17} />
                <button type="button" className="lx2i-search__trigger" aria-haspopup="listbox" aria-expanded={openField === 'when'} onClick={() => setOpenField(openField === 'when' ? null : 'when')}>
                  <span className={whenValue ? '' : 'lx2i-search__ph'}>{whenValue || 'When?'}</span>
                  <ChevronDown size={15} className="lx2i-search__chev" />
                </button>
                {openField === 'when' && (
                  <div className="lx2i-search__drop" role="listbox" aria-label="When">
                    {WHEN_OPTS.map((o) => (
                      <button key={o} type="button" className={`lx2i-search__opt ${whenValue === o ? 'is-on' : ''}`} role="option" aria-selected={whenValue === o} onClick={() => { setWhenValue(o); setOpenField(null); }}>
                        <Calendar size={15} /> <span>{o}</span>
                      </button>
                    ))}
                  </div>
                )}
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
                {QUICK_PICKS.map((q) => (
                  <button key={q} type="button" className="lx2i-quickpick" onClick={jumpToJourneys()}>{q}</button>
                ))}
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

        <a href="#heritage" onClick={go('#heritage')} className="lx2i-hero__scroll" aria-label="Scroll to explore">
          <span>Scroll to explore</span>
          <ChevronDown size={16} />
        </a>
      </section>

      {/* ============ OUR HERITAGE / TRUST (immediately after hero) ============ */}
      <section className="lx2i-heritage" id="heritage">
        <div className="lx2i-container lx2i-heritage__grid">
          <div className="lx2i-heritage__media lx2i-reveal">
            <div className="lx2i-heritage__photo lx2i-heritage__photo--main" style={{ backgroundImage: `url(${sizedUnsplash('1599661046289-e31897846e41', 900)})` }} />
            <div className="lx2i-heritage__card lx2i-glass">
              <span className="lx2i-eyebrow">SINCE 1758</span>
              <h4>Bespoke Itineraries</h4>
              <p>Each journey we curate is a masterpiece - crafted with care and precision to reflect you alone.</p>
              <div className="lx2i-heritage__photo lx2i-heritage__photo--inset" style={{ backgroundImage: `url(${sizedUnsplash('1523906834658-6e24ef2386f9', 600)})` }} />
            </div>
          </div>

          <div className="lx2i-heritage__text lx2i-reveal">
            <span className="lx2i-eyebrow">// OUR HERITAGE</span>
            <h2 className="lx2i-h2">Crafting <strong>unforgettable<br />journeys</strong> since 1758</h2>
            <p className="lx2i-heritage__copy">
              From the age of sail to the era of bespoke travel, Cox &amp; Kings has guided generations
              of explorers across the globe - the same name, the same standard, for over a quarter of a millennium.
            </p>

            {/* Scannable, sourced trust credentials - icon-led */}
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
            <a href="#contact" onClick={go('#contact')} className="lx2i-btn lx2i-btn--primary">Discover our story <ArrowRight size={16} /></a>
          </div>
        </div>
      </section>

      {/* ============ CURATED STAYS (search + photo cards) ============ */}
      <section className="lx2i-curated" id="curated">
        <div className="lx2i-container">
          <div className="lx2i-sec-head lx2i-reveal">
            <span className="lx2i-eyebrow">// OUR CURATIONS</span>
            <h2 className="lx2i-h2">Two ways to <strong>travel<br />the world with us</strong></h2>
            <p className="lx2i-sec-head__sub">Whether you want a trip designed around just you, or the ease of a fully-escorted group departure with flights and a tour manager - start here. Every price is clearly per person.</p>
          </div>

          {/* TWO WAYS TO TRAVEL - escorted (fixed price) leads & is highlighted;
              private is a placeholder for now (no fixed pricing yet) */}
          <div className="lx2i-mode lx2i-reveal" role="tablist" aria-label="Choose how you want to travel">
            <button role="tab" aria-selected={travelMode === 'group'} className={`lx2i-mode__card ${travelMode === 'group' ? 'is-on' : ''}`} onClick={() => setTravelMode('group')}>
              <span className="lx2i-mode__ic"><Users size={20} strokeWidth={1.6} /></span>
              <span className="lx2i-mode__txt">
                <strong>Escorted Group Tours</strong>
                <small>Fixed departures, flights included, a tour manager throughout. Great for families &amp; seniors.</small>
              </span>
            </button>
            <button type="button" className="lx2i-mode__card" onClick={(e) => e.preventDefault()}>
              <span className="lx2i-mode__ic"><Gem size={20} strokeWidth={1.6} /></span>
              <span className="lx2i-mode__txt">
                <strong>Private &amp; Bespoke</strong>
                <small>Just your party. Your dates, your pace - designed around you.</small>
              </span>
            </button>
          </div>

          {travelMode === 'bespoke' ? (
            <>
              <div className="lx2i-filters lx2i-reveal">
                {FILTERS.map((f) => (
                  <button key={f} className={`lx2i-filter ${filter === f ? 'is-on' : ''}`} onClick={() => setFilter(f)}>{f}</button>
                ))}
              </div>

              <div className="lx2i-stays">
                {stays.map((s, i) => (
                  <article key={s.name} className="lx2i-stay lx2i-reveal" style={{ '--d': `${i * 0.08}s` }}>
                    <div className="lx2i-stay__img" style={{ backgroundImage: `url(${sizedUnsplash(s.id, 900)})` }}>
                      <span className="lx2i-stay__rating"><Star size={12} fill="currentColor" /> {s.rating}</span>
                    </div>
                    <div className="lx2i-stay__body">
                      <div className="lx2i-stay__head">
                        <h3>{s.name}</h3>
                        <p className="lx2i-stay__loc"><MapPin size={13} /> {s.loc}</p>
                      </div>
                      {/* Price clarity: explicit "from", per-person, duration right beside it */}
                      <div className="lx2i-stay__deal">
                        <div className="lx2i-stay__price">
                          <span className="lx2i-stay__from">from</span>
                          <strong>{s.price}</strong>
                          <span className="lx2i-stay__pp">pp</span>
                          <span className="lx2i-stay__dur"><Calendar size={12} /> {s.nights} nights</span>
                        </div>
                        <ul className="lx2i-stay__inc" aria-label={`What ${s.name} includes`}>
                          {s.highlights.map(({ icon: Icon, label }) => (
                            <li key={label}><Icon size={13} strokeWidth={1.7} /> {label}</li>
                          ))}
                        </ul>
                        <p className="lx2i-stay__exc"><CheckCircle2 size={12} /> Hotels, transfers &amp; private guide included <span>· excl. international flights</span></p>
                      </div>
                      <div className="lx2i-stay__cta">
                        <a href="#contact" onClick={go('#contact')} className="lx2i-btn lx2i-btn--outline lx2i-stay__view">View itinerary <ArrowRight size={15} /></a>
                        <a href="#contact" onClick={go('#contact')} className="lx2i-btn lx2i-btn--primary lx2i-stay__enq"><Phone size={14} /> Enquire</a>
                      </div>
                      <button type="button" className="lx2i-stay__cb" onClick={openCallback}><PhoneCall size={13} /> Or request a callback</button>
                    </div>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <div className="lx2i-tours">
              {GROUP_TOURS.map((t, i) => (
                <article key={t.name} className="lx2i-tour lx2i-reveal" style={{ '--d': `${i * 0.08}s` }}>
                  <div className="lx2i-tour__img" style={{ backgroundImage: `url(${sizedUnsplash(t.id, 900)})` }}>
                    <span className="lx2i-tour__rating"><Star size={12} fill="currentColor" /> {t.rating} · {t.reviews.toLocaleString('en-IN')} reviews</span>
                    <span className="lx2i-tour__seats"><Calendar size={12} /> {t.tagMonths}</span>
                  </div>
                  <div className="lx2i-tour__body">
                    <span className="lx2i-tour__badge"><Plane size={12} /> Escorted · Return flights included</span>
                    <h3>{t.name}</h3>
                    <p className="lx2i-tour__route"><MapPin size={13} /> {t.route}</p>
                    <div className="lx2i-tour__facts">
                      <span><Calendar size={13} /> {t.days} days · {t.nights} nights</span>
                      <span><Users size={13} /> {t.cap}</span>
                    </div>
                    <ul className="lx2i-tour__comfort" aria-label={`Comfort and inclusions for ${t.name}`}>
                      {t.comfort.map(({ icon: Icon, label }) => (
                        <li key={label}><Icon size={12} strokeWidth={1.8} /> {label}</li>
                      ))}
                    </ul>
                    <div className="lx2i-tour__deal">
                      <div className="lx2i-stay__price">
                        <span className="lx2i-stay__from">from</span>
                        <strong>{t.price}</strong>
                        <span className="lx2i-stay__pp">pp</span>
                      </div>
                    </div>
                    <div className="lx2i-stay__cta">
                      {t.detail ? (
                        <Link to={t.detail} className="lx2i-btn lx2i-btn--outline lx2i-stay__view">View itinerary <ArrowRight size={15} /></Link>
                      ) : (
                        <a href="#contact" onClick={go('#contact')} className="lx2i-btn lx2i-btn--outline lx2i-stay__view">View itinerary <ArrowRight size={15} /></a>
                      )}
                      {t.detail ? (
                        <Link to={t.detail} className="lx2i-btn lx2i-btn--primary lx2i-stay__enq"><ArrowRight size={14} /> View tour</Link>
                      ) : (
                        <a href="#contact" onClick={go('#contact')} className="lx2i-btn lx2i-btn--primary lx2i-stay__enq"><Phone size={14} /> Reserve a seat</a>
                      )}
                    </div>
                    <button type="button" className="lx2i-stay__cb" onClick={openCallback}><PhoneCall size={13} /> Or request a callback</button>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Money-safety, in plain words */}
          <ul className="lx2i-safety lx2i-reveal" aria-label="How your booking is protected">
            {SAFETY.map(({ icon: Icon, label, note }) => (
              <li key={label} className="lx2i-safety__item">
                <span className="lx2i-safety__ic"><Icon size={17} strokeWidth={1.7} /></span>
                <span className="lx2i-safety__txt"><strong>{label}</strong><small>{note}</small></span>
              </li>
            ))}
          </ul>

          <div className="lx2i-curated__more lx2i-reveal">
            <a href="#contact" onClick={go('#contact')} className="lx2i-btn lx2i-btn--primary lx2i-btn--lg">View all journeys <ArrowRight size={16} /></a>
            <button type="button" className="lx2i-curated__cb" onClick={openCallback}><PhoneCall size={15} /> Prefer to talk? Request a callback</button>
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS + YOUR TRAVEL DESIGNER ============ */}
      <section className="lx2i-how" id="how">
        <span className="lx2i-how__glow" aria-hidden="true" />
        <div className="lx2i-container">
          <div className="lx2i-how__grid">

            {/* LEFT - the heading + the journey as a three-movement path */}
            <div className="lx2i-how__lede lx2i-reveal">
              <span className="lx2i-eyebrow">// HOW BESPOKE WORKS</span>
              <h2 className="lx2i-h2">Every trip above is a <strong>starting point</strong></h2>
              <p className="lx2i-how__sub">You never book a fixed package. A real travel designer reshapes any journey here into your version - and stays with you from the first call to the flight home.</p>

              <ul className="lx2i-how__steps">
                {HOW_STEPS.map(({ icon: Icon, step, title, body }, i) => (
                  <li key={step} className="lx2i-how__step" style={{ '--i': i }}>
                    <span className="lx2i-how__stepic"><Icon size={19} strokeWidth={1.7} /></span>
                    <div className="lx2i-how__steptxt">
                      <h4>{title}</h4>
                      <p>{body}</p>
                    </div>
                    <span className="lx2i-how__stepno" aria-hidden="true">{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* RIGHT - the named designer, a compact calling card */}
            <aside className="lx2i-designer lx2i-reveal">
              <div className="lx2i-designer__card lx2i-designer__card--compact">
                <div className="lx2i-designer__frame">
                  <div className="lx2i-designer__photo" style={{ backgroundImage: `url(${DESIGNER.photo})` }} role="img" aria-label={`${DESIGNER.name}, ${DESIGNER.role}`} />
                  <span className="lx2i-designer__badge"><CheckCircle2 size={13} /> Your personal expert</span>
                </div>
                <div className="lx2i-designer__body">
                  <div className="lx2i-designer__id">
                    <h3 className="lx2i-designer__name">{DESIGNER.name}</h3>
                    <span className="lx2i-designer__role">{DESIGNER.role} · {DESIGNER.tenure}</span>
                  </div>
                  <span className="lx2i-designer__spec"><Compass size={13} /> {DESIGNER.specialises}</span>
                  <div className="lx2i-designer__stats">
                    {DESIGNER.stats.map((s) => (
                      <div key={s.l} className="lx2i-designer__stat"><b>{s.n}</b><span>{s.l}</span></div>
                    ))}
                  </div>
                  <div className="lx2i-designer__cta">
                    <a href={PHONE_TEL} className="lx2i-btn lx2i-btn--secondary"><Phone size={14} /> Call {DESIGNER.name.split(' ')[0]}</a>
                    <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="lx2i-btn lx2i-btn--outline"><MessageCircle size={14} /> WhatsApp</a>
                  </div>
                </div>
              </div>
              <a href="#contact" onClick={go('#contact')} className="lx2i-designer__all">View all experts <ArrowRight size={15} /></a>
            </aside>

          </div>
        </div>
      </section>

      {/* ============ EXPLORE & DISCOVER (arch carousel + clips rail) ============ */}
      <section className="lx2i-dest" id="destinations">
        <div className="lx2i-container lx2i-dest__grid">
          <div className="lx2i-dest__intro lx2i-reveal">
            <span className="lx2i-eyebrow">// EXPLORE &amp; DISCOVER</span>
            <h2 className="lx2i-h2"><strong>Destinations</strong><br />you'll love</h2>
            {/* engaging, per-destination detail that changes as you browse */}
            <p className="lx2i-dest__copy" key={dest.name}>{dest.blurb}</p>
            <div className="lx2i-dest__facts" key={`f-${dest.name}`}>
              <span className="lx2i-dest__fact"><Calendar size={14} /> Best season · {dest.best}</span>
              <span className="lx2i-dest__fact"><Compass size={14} /> {dest.trips}</span>
              <span className="lx2i-dest__fact"><Sparkles size={14} /> from {dest.from} pp</span>
            </div>
            <div className="lx2i-dest__nav">
              <button onClick={prevDest} aria-label="Previous destination"><ArrowLeft size={18} /></button>
              <span className="lx2i-dest__count">{String(destIdx + 1).padStart(2, '0')} / {String(DESTS.length).padStart(2, '0')}</span>
              <button onClick={nextDest} aria-label="Next destination"><ArrowRight size={18} /></button>
            </div>
          </div>

          <div className="lx2i-dest__stage lx2i-reveal">
            <div className="lx2i-arch" key={dest.name}>
              <div className="lx2i-arch__img" style={{ backgroundImage: `url(${sizedUnsplash(dest.id, 1100)})` }} />
              <div className="lx2i-arch__veil" />
              <button className="lx2i-arch__go" aria-label={`Explore ${dest.name}`}><ArrowUpRight size={18} /></button>
              {/* swipe arrows live right on the photo - easy to reach on mobile */}
              <button className="lx2i-arch__swipe lx2i-arch__swipe--prev" onClick={prevDest} aria-label="Previous destination"><ArrowLeft size={20} /></button>
              <button className="lx2i-arch__swipe lx2i-arch__swipe--next" onClick={nextDest} aria-label="Next destination"><ArrowRight size={20} /></button>
              {/* Name + tags sit together on the wide base of the arch - never clipped by the curve */}
              <div className="lx2i-arch__content">
                <h3 className="lx2i-arch__name">{dest.name}</h3>
                <div className="lx2i-arch__tags">
                  {dest.tags.map((t) => <span key={t} className="lx2i-tag">{t}</span>)}
                </div>
              </div>
            </div>
          </div>

          <div className="lx2i-dest__rail lx2i-reveal">
            {DESTS.map((d, i) => (
              <button key={d.name} className={`lx2i-thumb ${i === destIdx ? 'is-on' : ''}`} onClick={() => setDestIdx(i)}>
                <span className="lx2i-thumb__img" style={{ backgroundImage: `url(${sizedUnsplash(d.id, 300)})` }} />
                <span className="lx2i-thumb__no">{String(i + 1).padStart(2, '0')}</span>
                <span className="lx2i-thumb__name">{d.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="lx2i-container lx2i-dest__more lx2i-reveal">
          <a href="#contact" onClick={go('#contact')} className="lx2i-btn lx2i-btn--primary lx2i-btn--lg">View all destinations <ArrowRight size={16} /></a>
        </div>

        {/* Short-form discovery - tap a clip to watch full-screen */}
        <div className="lx2i-reels lx2i-reveal">
          <div className="lx2i-container lx2i-reels__head">
            <div>
              <span className="lx2i-eyebrow">// TRAVEL CLIPS</span>
              <h3 className="lx2i-reels__title">Watch first. Then wander.</h3>
            </div>
            <p className="lx2i-reels__hint">Tap a clip to watch full-screen <ArrowRight size={15} /></p>
          </div>
          <div className="lx2i-container">
            <div className="lx2i-reels__rail" role="list">
              {CLIPS.map((c, i) => (
                <button
                  key={c.place}
                  role="listitem"
                  className="lx2i-reel"
                  onClick={() => setOpenClip(i)}
                  aria-label={`Watch clip: ${c.place}`}
                >
                  <div className="lx2i-reel__img" style={{ backgroundImage: `url(${sizedUnsplash(c.id, 700)})` }} />
                  <div className="lx2i-reel__veil" />
                  <span className="lx2i-reel__dur"><Play size={11} fill="currentColor" /> {c.duration}</span>
                  <span className="lx2i-reel__play"><Play size={20} fill="currentColor" /></span>
                  <span className="lx2i-reel__live" aria-hidden="true">CLIP</span>
                  <div className="lx2i-reel__body">
                    <span className="lx2i-reel__place"><MapPin size={12} /> {c.place}</span>
                    <p className="lx2i-reel__cap">{c.caption}</p>
                    <span className="lx2i-reel__tag">{c.tag}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ PHOTO-FIRST REVIEWS ============ */}
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
            {REVIEWS.map((r, i) => (
              <ReviewCard key={r.name} r={r} i={i} />
            ))}
          </div>

          <div className="lx2i-reviews__more lx2i-reveal">
            <a href="#reviews" onClick={go('#reviews')} className="lx2i-btn lx2i-btn--outline lx2i-btn--lg">View all 2,400+ reviews <ArrowRight size={16} /></a>
          </div>
        </div>
      </section>

      {/* ============ PRESS MARQUEE ============ */}
      <section className="lx2i-press" aria-label="As featured in">
        <div className="lx2i-press__label"><span className="lx2i-eyebrow">AS FEATURED IN</span></div>
        <div className="lx2i-press__track">
          {[...PRESS, ...PRESS].map((p, i) => (
            <img key={i} className="lx2i-press__logo" src={p.src} alt={p.name} loading="lazy" />
          ))}
        </div>
      </section>

      {/* ============ DISCOVER MY MOOD (luxury, blue-forward - second to last) ============ */}
      <section className="lx2i-mood" id="mood" style={{ '--accent': mood.accent }}>
        <div className="lx2i-mood__glow" aria-hidden="true" />
        <div className="lx2i-container">
          <div className="lx2i-mood__head lx2i-reveal">
            <span className="lx2i-eyebrow lx2i-eyebrow--light">// DISCOVER MY MOOD</span>
            <h2 className="lx2i-h2">Don’t choose a destination.<br /><strong>Choose a feeling.</strong></h2>
            <p className="lx2i-mood__intro">Tell us how you want this journey to feel - and we’ll show you exactly where it lives.</p>
          </div>

          <div className="lx2i-mood__stage lx2i-reveal">
            <div className="lx2i-mood__picker" role="tablist" aria-label="Choose a mood">
              {MOODS.map((m, i) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.key}
                    role="tab"
                    aria-selected={i === moodIdx}
                    className={`lx2i-mood__opt ${i === moodIdx ? 'is-on' : ''}`}
                    style={{ '--accent': m.accent }}
                    onMouseEnter={() => setMoodIdx(i)}
                    onFocus={() => setMoodIdx(i)}
                    onClick={() => setMoodIdx(i)}
                  >
                    <span className="lx2i-mood__optno">{String(i + 1).padStart(2, '0')}</span>
                    <span className="lx2i-mood__optic"><Icon size={19} strokeWidth={1.6} /></span>
                    <span className="lx2i-mood__optlbl">{m.key}</span>
                    <ArrowRight size={16} className="lx2i-mood__optarrow" />
                  </button>
                );
              })}
            </div>
            <p className="lx2i-mood__hint" aria-hidden="true"><ArrowRight size={14} /> Swipe to explore more moods</p>

            <div className="lx2i-mood__panel" key={mood.key}>
              {MOODS.map((m, i) => (
                <div
                  key={m.key}
                  className={`lx2i-mood__img ${i === moodIdx ? 'is-on' : ''}`}
                  style={{ backgroundImage: `url(${sizedUnsplash(m.id, 1400)})` }}
                  aria-hidden={i !== moodIdx}
                />
              ))}
              <div className="lx2i-mood__veil" />
              <div className="lx2i-mood__content lx2i-glass">
                <span className="lx2i-mood__tag"><mood.icon size={15} strokeWidth={1.8} /> {mood.key}</span>
                <p className="lx2i-mood__line">{mood.line}</p>
                <div className="lx2i-mood__foot">
                  <div>
                    <strong className="lx2i-mood__place">{mood.place}</strong>
                    <span className="lx2i-mood__meta">{mood.meta}</span>
                  </div>
                  <a href="#contact" onClick={go('#contact')} className="lx2i-btn lx2i-btn--accent">
                    Design this trip <ArrowRight size={15} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="lx2i-cta" id="contact">
        <div className="lx2i-cta__bg" style={{ backgroundImage: `url(${sizedUnsplash('1493976040374-85c8e12f0c0e', 1800)})` }} />
        <div className="lx2i-cta__veil" />
        <div className="lx2i-container lx2i-cta__inner lx2i-reveal">
          <span className="lx2i-eyebrow lx2i-eyebrow--light">BEGIN THE CONVERSATION</span>
          <h2 className="lx2i-cta__title">Your next journey deserves<br /><strong>a quarter-millennium of judgment.</strong></h2>
          <p className="lx2i-cta__sub">Speak with a personal travel designer. No call centres, no scripts - just one expert who learns how you like to travel, and builds it around you.</p>
          <div className="lx2i-cta__actions">
            <a href={PHONE_TEL} className="lx2i-btn lx2i-btn--secondary lx2i-btn--lg"><Phone size={17} /> {PHONE_DISPLAY}</a>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="lx2i-btn lx2i-btn--glass lx2i-btn--lg"><MessageCircle size={16} /> WhatsApp us</a>
            <button type="button" onClick={openCallback} className="lx2i-btn lx2i-btn--glass lx2i-btn--lg"><PhoneCall size={16} /> Request a callback</button>
          </div>
          <p className="lx2i-cta__hours">Travel experts available 9am–9pm IST, every day · or browse journeys below</p>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="lx2i-footer">
        <div className="lx2i-container lx2i-footer__top">
          <div className="lx2i-footer__brand">
            <img src="/cox-logo-new.png" alt="Cox & Kings - Est. 1758" />
            <p>The world's most experienced travel company.<br />Trusted by generations since 1758.</p>
            <div className="lx2i-footer__social">
              <a href="#" aria-label="Instagram"><Instagram size={17} /></a>
              <a href="#" aria-label="Facebook"><Facebook size={17} /></a>
              <a href="#" aria-label="YouTube"><Youtube size={17} /></a>
              <a href="#" aria-label="LinkedIn"><Linkedin size={17} /></a>
            </div>
          </div>
          <div className="lx2i-footer__cols">
            <div>
              <span className="lx2i-eyebrow">EXPLORE</span>
              <a href="#destinations" onClick={go('#destinations')}>Destinations</a>
              <a href="#curated" onClick={go('#curated')}>Curated Journeys</a>
              <a href="#heritage" onClick={go('#heritage')}>Our Heritage</a>
              <a href="#reviews" onClick={go('#reviews')}>Reviews</a>
            </div>
            <div>
              <span className="lx2i-eyebrow">COMPANY</span>
              <a href="#contact" onClick={go('#contact')}>Speak to an Expert</a>
              <a href="#">About Us</a>
              <a href="#">Press Room</a>
              <a href="#">Careers</a>
            </div>
            <div>
              <span className="lx2i-eyebrow">SPEAK TO A HUMAN</span>
              <a href={PHONE_TEL}><Phone size={13} /> {PHONE_DISPLAY}</a>
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"><MessageCircle size={13} /> Chat on WhatsApp</a>
              <a href="#" onClick={openCallback}><PhoneCall size={13} /> Request a callback</a>
              <a href="mailto:holidays@coxandkings.com">holidays@coxandkings.com</a>
            </div>
          </div>
        </div>
        <div className="lx2i-container lx2i-footer__bottom">
          <p>© 2026 Cox &amp; Kings. Est. 1758.</p>
          <div className="lx2i-footer__legal">
            <a href="#">Privacy</a><a href="#">Terms</a><a href="#">Cookies</a>
          </div>
        </div>
      </footer>

      {/* ============ MOBILE THUMB-REACH BAR ============ */}
      <div className="lx2i-thumbbar">
        <a href={PHONE_TEL} className="lx2i-thumbbar__cta"><Phone size={17} /> Call an Expert</a>
        <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="lx2i-thumbbar__wa" aria-label="Chat on WhatsApp"><MessageCircle size={20} /></a>
        <button className="lx2i-thumbbar__ai" aria-label="Open Enaya, the AI travel assistant" onClick={() => setChatOpen(true)}>
          <Sparkles size={20} />
        </button>
      </div>

      {/* ============ FLOATING AI BUTTON (desktop) ============ */}
      <button className={`lx2i-aifab ${chatOpen ? 'is-hidden' : ''}`} aria-label="Open Enaya, the AI travel assistant" onClick={() => setChatOpen(true)}>
        <Sparkles size={20} />
        <span>Ask Enaya</span>
      </button>


      {/* ============ FULL-SCREEN CLIP VIEWER ============ */}
      {clip && (
        <div
          className="lx2i-cv"
          role="dialog"
          aria-modal="true"
          aria-label={`Clip: ${clip.place}`}
          onTouchStart={onClipTouchStart}
          onTouchEnd={onClipTouchEnd}
        >
          <div className="lx2i-cv__scrim" onClick={closeClip} />
          <button className="lx2i-cv__close" aria-label="Close clip" onClick={closeClip}><X size={22} /></button>
          <button className="lx2i-cv__arrow lx2i-cv__arrow--prev" aria-label="Previous clip" onClick={prevClip}><ArrowLeft size={24} /></button>
          <button className="lx2i-cv__arrow lx2i-cv__arrow--next" aria-label="Next clip" onClick={nextClip}><ArrowRight size={24} /></button>

          <div className="lx2i-cv__stage">
            <div className="lx2i-cv__progress" aria-hidden="true">
              {CLIPS.map((_, i) => <span key={i} className={i === openClip ? 'is-on' : ''} />)}
            </div>

            <div className="lx2i-cv__media" style={{ backgroundImage: `url(${sizedUnsplash(clip.id, 1200)})` }}>
              <div className="lx2i-cv__shade" />
              <span className="lx2i-cv__playbig"><Play size={28} fill="currentColor" /></span>

              <div className="lx2i-cv__toprow">
                <span className="lx2i-cv__tag">{clip.tag}</span>
                <span className="lx2i-cv__dur"><Play size={11} fill="currentColor" /> {clip.duration}</span>
              </div>

              {/* action rail - save, reviews, share */}
              <div className="lx2i-cv__actions">
                <button type="button" className="lx2i-cv__act" aria-label="Save this clip"><Bookmark size={22} /><small>Save</small></button>
                <button type="button" className="lx2i-cv__act" aria-label="Read reviews"><MessageCircle size={22} /><small>Reviews</small></button>
                <button type="button" className="lx2i-cv__act" aria-label="Share this clip"><Share2 size={21} /><small>Share</small></button>
              </div>

              <div className="lx2i-cv__info">
                <span className="lx2i-cv__place"><MapPin size={14} /> {clip.place}</span>
                <h4 className="lx2i-cv__cap">{clip.caption}</h4>
                <p className="lx2i-cv__desc">{clip.desc}</p>
                <a
                  href="#contact"
                  onClick={(e) => { e.preventDefault(); closeClip(); const el = document.querySelector('#contact'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
                  className="lx2i-btn lx2i-btn--primary"
                >
                  View this trip <ArrowRight size={15} />
                </a>
              </div>
            </div>

            <p className="lx2i-cv__swipehint" aria-hidden="true">Swipe or use ← → · Esc to close</p>
          </div>
        </div>
      )}

      {/* ============ REQUEST A CALLBACK MODAL ============ */}
      {callbackOpen && (
        <div className="lx2i-cb" role="dialog" aria-modal="true" aria-label="Request a callback">
          <div className="lx2i-cb__scrim" onClick={() => setCallbackOpen(false)} />
          <div className="lx2i-cb__panel lx2i-glass">
            <button className="lx2i-cb__close" aria-label="Close" onClick={() => setCallbackOpen(false)}><X size={18} /></button>
            {callbackSent ? (
              <div className="lx2i-cb__done">
                <span className="lx2i-cb__doneic"><CheckCircle2 size={34} strokeWidth={1.5} /></span>
                <h3>We’ll call you shortly</h3>
                <p>A travel expert will be in touch - usually within a few hours, between 9am and 9pm IST. Prefer to talk now?</p>
                <div className="lx2i-cb__nowrow">
                  <a href={PHONE_TEL} className="lx2i-btn lx2i-btn--primary"><Phone size={14} /> {PHONE_DISPLAY}</a>
                  <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="lx2i-btn lx2i-btn--outline"><MessageCircle size={14} /> WhatsApp</a>
                </div>
              </div>
            ) : (
              <>
                <span className="lx2i-eyebrow">SPEAK TO A HUMAN</span>
                <h3 className="lx2i-cb__title">Request a callback</h3>
                <p className="lx2i-cb__sub">Leave your number and a real travel designer - not a call centre - will call you back. No obligation.</p>
                <form className="lx2i-cb__form" onSubmit={(e) => { e.preventDefault(); setCallbackSent(true); }}>
                  <label className="lx2i-cb__field">
                    <span>Your name</span>
                    <input type="text" name="name" autoComplete="name" placeholder="e.g. Priya Sharma" required />
                  </label>
                  <label className="lx2i-cb__field">
                    <span>Phone number</span>
                    <input type="tel" name="phone" autoComplete="tel" inputMode="tel" placeholder="+91  XXXXX XXXXX" required />
                  </label>
                  <label className="lx2i-cb__field">
                    <span>Best time to call</span>
                    <select name="time" defaultValue="">
                      <option value="" disabled hidden>Choose a time</option>
                      <option>Morning (9am–12pm)</option>
                      <option>Afternoon (12pm–5pm)</option>
                      <option>Evening (5pm–9pm)</option>
                      <option>Anytime is fine</option>
                    </select>
                  </label>
                  <button type="submit" className="lx2i-btn lx2i-btn--primary lx2i-btn--lg lx2i-cb__submit"><PhoneCall size={15} /> Request my callback</button>
                  <p className="lx2i-cb__or">Or call now - <a href={PHONE_TEL}>{PHONE_DISPLAY}</a></p>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>

    {/* AI chat (Enaya) — rendered OUTSIDE .lx2i so the page's scoped colour/
        font styles can't bleed into the widget. Same working concierge as
        /final2a-stack-ds; launched by this page's "Ask Enaya" buttons. */}
    <ChatBot open={chatOpen} onOpenChange={setChatOpen} hideFab name="Enaya" />
    </>
  );
}
