import { Fragment, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { SmartLink as Link, CALLBACK, useScheduleCall } from '../components/ScheduleCall';
import {
  Menu, X, ArrowRight, ArrowLeft, ArrowUpRight, ChevronDown, ChevronLeft, ChevronRight,
  Star, MapPin, Calendar, Users, Plane, Check, Plus, Minus, Lock, Quote,
  ShieldCheck, Phone, MessageCircle, PhoneCall, Headset, Sparkles, Clock,
  Wallet, Repeat, Stamp, CheckCircle2, Instagram, Facebook, Youtube, Linkedin,
  Hotel, Utensils, TrainFront, Compass,
  CreditCard, FileText, AlertTriangle, RefreshCcw, Building2, UserCheck,
  HeartPulse, BedDouble, CloudLightning, Gavel, Scale, Car,
  Baby, Accessibility, Download,
} from 'lucide-react';
import ChatBot from '../components/ChatBot';
import './Home2026.css';
import './Home2026Improved.css';
import './Luxe2Improved.css';
import './JapanTourLuxe.css';
import './JapanTourLuxe2.css';
import './JapanTourLuxe3.css';
import './JapanTourLuxe4.css';
import './JapanTourLuxe5.css';
/* The header and footer are the /new3 ones, verbatim. Both stylesheets are
   fully scoped (.new-typo / .n3), so importing them here cannot leak into the
   rest of this page — only the two wrappers that carry those classes. */
import './NewTypography.css';
import './New3.css';

/* ============================================================
   Cox & Kings — "Essence Japan with Hakone" tour-detail page,
   VARIANT 5. Route: /tour-detail-japan-5.
   Identical to VARIANT 4 except for the hero overlay: instead of a
   side-weighted veil (dark left → clear right), the hero carries a
   near-constant tint across the whole image. On desktop it eases
   only slightly lighter towards the right; on mobile it is fully
   uniform, with no left-to-right variation.
   ============================================================ */

const sizedUnsplash = (id, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

/* ---------- Human contact (matches the homepage) ---------- */
/* Spaced as /new3 spaces it. The navbar and footer are that page's, verbatim,
   and a number that regrouped its digits between the header and the booking
   card would read as two different numbers. */
const PHONE_DISPLAY = '+91 8556001700';
const PHONE_TEL = 'tel:+918556001700';
const WHATSAPP = 'https://wa.me/918556001700?text=Hi%20Cox%20%26%20Kings%2C%20I%27d%20like%20to%20plan%20the%20Essence%20Japan%20with%20Hakone%20journey.';
/* The address /new3 publishes (data/v3content CONTACT). Same reason as the
   phone: the footer here IS that page's footer, and the site should not hand a
   traveller two different addresses depending on which page they landed on. */
const EMAIL = 'journeys@coxandkings.com';
const OFFICE_SHORT = 'Fort, Mumbai 400001';
const OFFICE_FULL = 'Turner Morrison House, 16 Bank Street, Fort, Mumbai 400001';
const HOME = '/';

/* WhatsApp glyph (lucide ships no brand icons) — same path as the homepage. */
const WaIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.5A10 10 0 1 0 12 2zm0 18.3c-1.5 0-2.98-.4-4.27-1.16l-.3-.18-3.17 1 1.02-3.09-.2-.32A8.3 8.3 0 1 1 12 20.3z" />
    <path d="M17.5 14.4c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35z" />
  </svg>
);

/* ---------- Desktop nav megamenus — the /new3 navbar, verbatim ----------
   Same four groups, same blurbs, same rows, same grouped "Destinations" menu
   and the same catch-all, so the chrome does not change shape when a traveller
   crosses from the homepage into a tour.

   The one difference is forced: /new3's top-level entries point at ITS OWN
   sections (#paths, #destinations, #relaxed), and those sections do not exist
   on a tour-detail page — left as bare hashes they would be dead links. They
   are rebased onto HOME, so they still land on the same section, on the page
   that actually has it. */
const NAV_MENU = [
  {
    label: 'Ways to travel', href: `${HOME}#paths`,
    blurb: 'Two ways to see the world. Pick the one that fits you.',
    items: [
      { label: 'Escorted group tours', desc: 'Expert-led, fixed departures', to: '/journeys4?style=Group Tour' },
      { label: 'Tailor-made journeys', desc: 'Designed entirely around you', to: '/journeys4?style=Bespoke Private' },
      { label: 'Luxury & private travel', desc: 'Elevated stays and guiding', to: '/journeys4?style=Luxury' },
      { label: 'Help me decide', desc: 'Talk it through with a specialist', to: CALLBACK },
    ],
  },
  {
    label: 'Destinations', href: `${HOME}#destinations`,
    blurb: 'Over 100 countries, shaped by specialists who know them first-hand.',
    items: [
      { group: 'By destination', label: 'Japan', desc: 'Cherry blossom to neon', to: '/journeys4?where=Japan' },
      { group: 'By destination', label: 'Switzerland', desc: 'Alpine railways & lakes', to: '/journeys4?where=Switzerland' },
      { group: 'By destination', label: 'Italy', desc: 'Cities, coast & countryside', to: '/journeys4?where=Italy' },
      { group: 'By destination', label: 'Northern Lights', desc: 'Arctic winter skies', to: '/journeys4?where=Northern Lights' },
      { group: 'By destination', label: 'African Safari', desc: 'Big-five wilderness', to: '/journeys4?where=Africa Safari' },
      { group: 'Signature journeys', label: 'Cherry Blossom Japan', desc: '13 nights · Mar–Apr', to: '/tour-detail-japan-5' },
      { group: 'Signature journeys', label: 'Relaxed-pace journeys', desc: 'A calm vacation, handled', to: '/journeys4?pace=Relaxed' },
    ],
    all: { label: 'All destinations', meta: '31 journeys', to: '/journeys4' },
  },
  {
    label: 'Indian Getaways', href: `${HOME}#relaxed`,
    blurb: 'Closer to home, and no less of a journey.',
    items: [
      { label: 'Golden Triangle & the Taj', desc: '8 nights · Delhi, Agra, Jaipur', to: '/journeys4?where=India&style=Group Tour' },
      { label: 'Rajasthan: palaces & forts', desc: 'Udaipur, Jodhpur & the Thar', to: '/journeys4?where=India&style=Luxury' },
      { label: 'Kerala backwaters', desc: 'Houseboats, tea country, coast', to: '/journeys4?where=India&style=Bespoke Private' },
    ],
    all: { label: 'All Indian journeys', meta: '5 journeys', to: '/journeys4?where=India' },
  },
  {
    label: 'About us', to: '/about-us2',
    blurb: 'Specialists, not salespeople, with 260 years behind every trip.',
    items: [
      { label: 'Our story', desc: 'Since 1758, and what came after', to: '/about-us2' },
      { label: 'Real reviews', desc: '2,400+ verified travellers', href: `${HOME}#reviews` },
      { label: 'As featured in', desc: 'The press that covers us', href: `${HOME}#press` },
      { label: 'Talk to an expert', desc: 'Pick a time, we call you back', action: 'callback' },
    ],
  },
];

/* ---------- Tour data (Essence Japan with Hakone) ---------- */
const PRICE = 295000;
const HERO = {
  kicker: 'Essence Japan with Hakone · Escorted group tour',
  title: (
    <>Japan, as the <em className="lxjt-hero__accent">cherry blossoms</em> fall.</>
  ),
  lead:
    'Eight unhurried days from Tokyo’s neon to Kyoto’s temple gardens, by way of Mount Fuji and a night in a hot-spring ryokan, in a small group, led by an expert guide. You simply turn up; we’ve thought of all the rest. 🇯🇵',
  image: '1522383225653-ed111181a951',
  facts: [
    { icon: Calendar, label: '8 Days · 7 Nights' },
    { icon: MapPin, label: '5 Cities' },
    { icon: Users, label: 'Small group' },
    { icon: Compass, label: 'Guided throughout' },
  ],
};

const HIGHLIGHT_IMG = '1533050487297-09b450131914';
/* Scannable "what's in the price" strip — the key inclusions, at a glance. */
const KEY_INCLUSIONS = [
  { icon: Hotel, label: '7 nights incl. a ryokan' },
  { icon: Utensils, label: 'Breakfast daily + meals' },
  { icon: Compass, label: 'English-speaking guide' },
  { icon: TrainFront, label: 'Coach & transfers' },
  { icon: MapPin, label: 'All entrance fees' },
  { icon: ShieldCheck, label: 'Visa & insurance' },
];
const HIGHLIGHTS = [
  'Mount Fuji’s 5th Station and a Lake Kawaguchiko boat ride',
  'A night in a traditional onsen ryokan',
  'Kamakura’s Great Buddha and bamboo groves',
  'Fushimi Inari’s vermilion torii and the Golden Pavilion',
  'Nara’s Tōdai-ji and its famously friendly deer',
  'Dōtonbori’s neon and street food in Osaka',
];

const ROUTE = [
  { nights: '2 nights', city: 'Tokyo', note: 'Temples, shrines and the electric crossings — plus an evening walk through neon-lit Shinjuku.', image: '1480796927426-f609979314bd' },
  { nights: '1 night', city: 'Odawara', note: 'Kamakura’s Great Buddha and bamboo groves, Enoshima Island, and a hilltop castle.', image: '1528360983277-13d401cdc186' },
  { nights: '1 night', city: 'Kawaguchiko', note: 'Mount Fuji up close, hot-spring valleys and a night in a traditional onsen ryokan.', image: '1490806843957-31f4c9a91c65' },
  { nights: '2 nights', city: 'Kyoto', note: 'Arashiyama, Fushimi Inari and the Golden Pavilion in Japan’s old capital.', image: '1493976040374-85c8e12f0c0e' },
  { nights: '1 night', city: 'Osaka', note: 'A day in Nara among the deer en route, then Dōtonbori’s neon and street food.', image: '1590559899731-a382839e5549' },
];

/* Day-by-day itinerary — mirrors the real "Essence Japan with Hakone" product.
   Each day carries its picture + the hotel, meals and key sights that surface on
   the picture (desktop) or inside the accordion (mobile). */
const ITINERARY = [
  { day: 'Day 01', place: 'Tokyo', title: 'Arrive in Tokyo', img: '1480796927426-f609979314bd', cap: 'Arrival into Tokyo',
    body: 'Arrive in Tokyo, transfer to your hotel and unwind, with an evening briefing on the journey ahead.',
    hotel: 'Shinagawa Prince Hotel, Tokyo', stars: 4, room: 'Standard Room · twin / double', ryokan: false,
    transfer: 'Narita / Haneda Airport → Tokyo hotel (shared shuttle)', meals: 'No meals included', nights: '2 nights · Tokyo',
    acts: ['Airport shared transfer', 'Evening trip briefing'] },
  { day: 'Day 02', place: 'Tokyo', title: 'Tokyo sightseeing & Shinjuku', img: '1522383225653-ed111181a951', cap: 'Sensō-ji & Shibuya, Tokyo',
    body: 'A full day across old and new Tokyo, ending with an evening walk through neon-lit Shinjuku.',
    hotel: 'Shinagawa Prince Hotel, Tokyo', stars: 4, room: 'Standard Room · twin / double', ryokan: false,
    transfer: 'Coach touring + evening transfer to Shinjuku', meals: 'Breakfast', nights: '2 nights · Tokyo',
    acts: ['Zōjō-ji Temple & Meiji Shrine', 'Shibuya Crossing & Imperial Palace', 'Tokyo Skytree', 'Sensō-ji & Nakamise Street'] },
  { day: 'Day 03', place: 'Odawara', title: 'Kamakura, Enoshima & Odawara', img: '1528360983277-13d401cdc186', cap: 'The Great Buddha, Kamakura',
    body: 'The seaside temple town of Kamakura and its Great Buddha, then on via Enoshima Island to Odawara.',
    hotel: 'Hotel in Odawara (or similar)', stars: 4, room: 'Standard Room · twin / double', ryokan: false,
    transfer: 'Tokyo → Kamakura → Odawara by coach', meals: 'Breakfast', nights: '1 night · Odawara',
    acts: ['Hōkoku-ji Temple & bamboo forest', 'Sugimoto-dera & the Great Buddha', 'Enoshima Island', 'Odawara Castle'] },
  { day: 'Day 04', place: 'Kawaguchiko', title: 'Mount Fuji & a ryokan night', img: '1490806843957-31f4c9a91c65', cap: 'Mt. Fuji from Lake Kawaguchiko',
    body: 'The Mount Fuji region — 5th Station, hot-spring valleys and a lake boat ride — then a night in an onsen ryokan.',
    hotel: 'Onsen Ryokan, Kawaguchiko', stars: 4, room: 'Japanese-style room · twin', ryokan: true,
    transfer: 'Odawara → Fuji region → Kawaguchiko by coach', meals: 'Breakfast · Lunch · Dinner', nights: '1 night · Kawaguchiko',
    acts: ['Owakudani / Arakurayama', 'Oshino Hakkai springs', 'Mount Fuji 5th Station', 'Lake Kawaguchiko boat ride & onsen'] },
  { day: 'Day 05', place: 'Kyoto', title: 'Iyashi-no-Sato, Shiraito & Kyoto', img: '1533050487297-09b450131914', cap: 'Thatched village of Iyashi-no-Sato',
    body: 'A thatched-roof village, the lace-like Shiraito Falls and the Toyota Museum en route to the old capital, Kyoto.',
    hotel: 'Hotel in Kyoto (or similar)', stars: 4, room: 'Standard Room · twin / double', ryokan: false,
    transfer: 'Kawaguchiko → Kyoto by coach', meals: 'Breakfast · Lunch · Dinner', nights: '2 nights · Kyoto',
    acts: ['Iyashi-no-Sato Nenba village', 'Shiraito Falls', 'Toyota Museum'] },
  { day: 'Day 06', place: 'Kyoto', title: 'Kyoto heritage tour', img: '1493976040374-85c8e12f0c0e', cap: 'Golden Pavilion, Kyoto',
    body: 'A full day among Kyoto’s finest — Arashiyama’s bamboo grove, Fushimi Inari and the Golden Pavilion.',
    hotel: 'Hotel in Kyoto (or similar)', stars: 4, room: 'Standard Room · twin / double', ryokan: false,
    transfer: 'Kyoto sightseeing by coach', meals: 'Breakfast', nights: '2 nights · Kyoto',
    acts: ['Arashiyama & Tenryū-ji Temple', 'Bamboo Grove', 'Fushimi Inari', 'Imperial Palace & Golden Pavilion'] },
  { day: 'Day 07', place: 'Osaka', title: 'Nara, then Osaka', img: '1590559899731-a382839e5549', cap: 'Nara’s temples & deer',
    body: 'A morning in Nara — the great Tōdai-ji and its friendly deer — then on to Osaka and Dōtonbori.',
    hotel: 'Hotel in Osaka (or similar)', stars: 4, room: 'Standard Room · twin / double', ryokan: false,
    transfer: 'Kyoto → Nara → Osaka by coach', meals: 'Breakfast · Lunch', nights: '1 night · Osaka',
    acts: ['Tōdai-ji Temple', 'Hōryū-ji Temple', 'Nara Park deer', 'Dōtonbori, Osaka'] },
  { day: 'Day 08', place: 'Osaka', title: 'Depart from Osaka', img: '1522383225653-ed111181a951', cap: 'Sayōnara, from Osaka',
    body: 'After breakfast, transfer to the airport for your onward flight home.',
    hotel: 'Check-out · departure day', stars: 0, room: '—', ryokan: false,
    transfer: 'Osaka hotel → Kansai Airport', meals: 'Breakfast', nights: 'Departure',
    acts: ['Airport transfer'] },
];

const INCLUDED = [
  'Seven nights in hand-picked hotels, including a night in a traditional onsen ryokan',
  'Daily breakfast, plus the lunches and dinners in Tokyo, Kawaguchiko and Nara',
  'Airport arrival transfer by shared shuttle and all coach travel per the itinerary',
  'An English-speaking guide throughout the touring days',
  'All entrance fees for the attractions listed in the itinerary',
  'Visa assistance and travel insurance (for travellers up to 69 years)',
];
const NOT_INCLUDED = [
  'International airfare and anything not listed in the inclusions',
  'Monument or attraction entrance fees not listed in the itinerary',
  'Meals beyond those specified in the daily programme',
  'Personal expenses — tips, laundry, calls, beverages, camera fees and the like',
  'Costs arising from itinerary changes due to weather, flight cancellations, illness or roadblocks',
];

/* ============================================================
   WHEN YOU TRAVEL — a private journey has no fixed departures

   Essence Japan is private and tailor-made: there is no coach to fill
   and no group to join, so the journey runs on the traveller's date,
   not ours. A list of four set departures was the wrong control for
   that. It invented a scarcity that does not exist ("Only 6 seats
   left" — there are no seats), and it hid the other 361 days they
   could perfectly well leave on. A calendar tells the truth: pick any
   day, and we build the journey around it.

   Two real constraints do apply, and the picker states both up front
   rather than letting the traveller find out afterwards:

     · LEAD TIME. A private journey takes about three weeks to build —
       the guide, the ryokan, the rail, the visa — so days inside that
       window are closed rather than silently accepted and then walked
       back by a phone call.

     · SEASON. Japan is one of the few countries where WHEN you go
       changes WHAT the trip is. Blossom and autumn colour are the two
       peaks and want far more notice, so the picker names the season
       of the day they chose instead of burying it in a footnote.
   ============================================================ */
const TRIP_DAYS = 8;              // eight days, seven nights
const MIN_LEAD_DAYS = 21;         // the least notice a private journey can be built in
const BOOK_HORIZON_MONTHS = 18;   // how far ahead the calendar will look

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
const WEEKDAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const startOfDay = (d) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
const addDays = (d, n) => { const x = startOfDay(d); x.setDate(x.getDate() + n); return x; };
const firstOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
const addMonths = (d, n) => new Date(d.getFullYear(), d.getMonth() + n, 1);
/* Month arithmetic that survives the short months: 31 Jan + 1 month is
   28 Feb, not 3 March. */
const addMonthsClamped = (d, n) => {
  const t = new Date(d.getFullYear(), d.getMonth() + n, 1);
  const lastDay = new Date(t.getFullYear(), t.getMonth() + 1, 0).getDate();
  t.setDate(Math.min(d.getDate(), lastDay));
  return t;
};
const daysInMonth = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
const sameDay = (a, b) => !!a && !!b
  && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
/* Local-time ISO. `toISOString()` would be a UTC round-trip, which quietly
   shifts the date by one either side of midnight in IST. */
const toISO = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const fromISO = (s) => {
  if (!s) return null;
  const [y, m, d] = s.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return Number.isNaN(date.getTime()) ? null : date;
};
const longDate = (d) => `${d.getDate()} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
/* Monday-first, the way Indian calendars print. */
const mondayIndex = (d) => (d.getDay() + 6) % 7;

function seasonFor(d) {
  const md = (d.getMonth() + 1) * 100 + d.getDate();
  if (md >= 320 && md <= 412) return { label: 'Cherry blossom', peak: true, note: 'The loveliest fortnight in Japan, and the busiest. We would want four months’ notice to hold the ryokan and the rail.' };
  if (md >= 413 && md <= 531) return { label: 'Late spring', peak: false, note: 'Warm, green, and far quieter than blossom season — our specialists’ own favourite time to go.' };
  if (md >= 601 && md <= 831) return { label: 'Summer', peak: false, note: 'Hot and humid in the cities, but this is festival season — and the mountains stay cool.' };
  if (md >= 901 && md <= 1019) return { label: 'Early autumn', peak: false, note: 'The typhoons have eased, the summer crowds have gone, and the light turns golden.' };
  if (md >= 1020 && md <= 1205) return { label: 'Autumn colour', peak: true, note: 'The second peak. Kyoto under red maple is worth planning a long way ahead.' };
  return { label: 'Winter', peak: false, note: 'Crisp, clear and quiet. Snow in the north, and the onsen at their very best.' };
}

/* Traveller reviews — marquee shape (design from /journeys/japan-2). */
const REVIEWS = [
  { name: 'Ananya & Rohan Mehta', location: 'Mumbai', tour: 'Cherry Blossom Japan', rating: 5, text: 'The petals fell exactly when they promised. Every ryokan, every bullet-train seat, every dinner reservation was handled — we just showed up and fell in love with Japan.', avatar: '1545167622-3a6ac756afa4', tripPhoto: '1522383225653-ed111181a951' },
  { name: 'Suresh Iyer', location: 'Bengaluru', tour: 'Japan for Families', rating: 5, text: 'Two kids, my parents and us — and not one dull hour. The pace was gentle, the guides endlessly patient, and the little touches made it unforgettable.', avatar: '1633332755192-727a05c4013d', tripPhoto: '1540959733332-eab4deabeeaf' },
  { name: 'Vikram Desai', location: 'Delhi', tour: 'Luxury Japan by Rail', rating: 5, text: 'First-class Shinkansen, faultless hotels and a curator who anticipated everything. This is how Japan should be travelled — effortless, and quietly extraordinary.', avatar: '1500648767791-00dcc994a43e', tripPhoto: '1490806843957-31f4c9a91c65' },
  { name: 'Sunita Rao', location: 'Hyderabad', tour: 'Japan in Autumn Colours', rating: 5, text: 'The maples in Kyoto were on fire with colour, timed to the day. A once-in-a-lifetime week, arranged with such care that nothing ever felt rushed.', avatar: '1438761681033-6461ffad8d80', tripPhoto: '1528360983277-13d401cdc186' },
  { name: 'The Nair Family', location: 'Pune', tour: 'Essence of Japan with Hakone', rating: 5, text: 'Mt Fuji from the ryokan window, the kids wide-eyed on the bullet train, and a guide who felt like family by day three. Faultless from start to finish.', avatar: '1552058544-f2b08422138a', tripPhoto: '1493976040374-85c8e12f0c0e' },
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

const SIMILAR = [
  { title: 'Grand European Sojourn', region: '5 countries', season: 'Apr–Oct', nights: '12 nights', priceFrom: '₹2,85,000', image: '1502602898657-3e91760cbb34', tags: ['Balanced pace', 'Escorted group'] },
  { title: 'Switzerland & the Alps', region: 'Switzerland', season: 'May–Sep', nights: '11 nights', priceFrom: '₹2,55,000', image: '1530841377377-3ff06c0ca713', tags: ['Relaxed pace', 'Scenic rail'] },
  { title: 'Rajasthan by Palace', region: 'India', season: 'Oct–Mar', nights: '9 nights', priceFrom: '₹1,95,000', image: '1599661046289-e31897846e41', tags: ['Relaxed pace', 'Heritage stays'] },
  { title: 'African Safari', region: 'Kenya & Tanzania', season: 'Jul–Oct', nights: '8 nights', priceFrom: '₹3,10,000', image: '1516426122078-c23e76319801', tags: ['Active pace', 'Small group'] },
];

/* Nothing here promises a payment, because asking for a quote takes one.
   The old set led with "Low deposit · Book from 20% today", which read as
   a checkout on a card that has never been able to charge anything. */
const SAFETY = [
  { icon: Wallet, label: 'Nothing to pay', note: 'The quote is free, and free of obligation' },
  { icon: Repeat, label: 'Reshape it freely', note: 'Change the route until it is yours' },
  { icon: Stamp, label: 'Visa support', note: 'Paperwork handled for you' },
  { icon: ShieldCheck, label: 'Financially protected', note: 'Your money is held securely' },
];

/* ============================================================
   The policies — the full Cox & Kings terms, organised into three
   filterable categories. Each topic shows a short summary + a couple
   of preview points; the rest expands on demand (accordion).
   A point can be a plain string or { tone, text } where tone drives
   its icon: 'do' (allowed), 'dont' (never), 'warn' (caution).
   ============================================================ */
const TERM_CATS = [
  { id: 'booking', label: 'Booking Terms', icon: Wallet, blurb: 'How and when you pay — and how to keep every rupee safe.' },
  { id: 'cancellation', label: 'Cancellation Policy', icon: RefreshCcw, blurb: 'Charges, refunds and how to cancel, in plain numbers.' },
  { id: 'tnc', label: 'Terms & Conditions', icon: FileText, blurb: 'The full agreement — eligibility, documents, liability and law.' },
];

const TERM_GROUPS = {
  booking: [
    { id: 'pay-schedule', icon: Calendar, heading: 'Payment schedule — international tours',
      summary: 'A 35% non-refundable advance confirms your booking; the balance follows before departure.',
      points: [
        '35% advance (non-refundable) payable at the time of booking',
        '75% of the total tour cost payable 60 days prior to departure',
        '100% of the total tour cost payable 45 days prior to departure',
      ] },
    { id: 'airfare', icon: Plane, heading: 'Airfare payment',
      summary: 'Airfare is paid in full at booking and billed separately from the land package.',
      points: [
        '100% of airfare must be paid at the time of booking',
        'Airfare is quoted at proposal stage and is subject to change at actual ticketing',
        'If air tickets are part of the package, they are billed separately from the land component',
        'Specific cancellation terms for airfare will be shared at the time of ticket issuance',
      ] },
    { id: 'channels', icon: CreditCard, heading: 'Authorised payment channels',
      summary: 'Pay only through official Cox & Kings channels — never to a personal UPI, QR code or individual account.',
      points: [
        { tone: 'do', text: 'Secure payment link shared directly by Cox & Kings' },
        { tone: 'do', text: 'NEFT / RTGS / Cheque payable to: Wilson & Hughes India Private Limited' },
        { tone: 'dont', text: 'Personal UPI IDs (G Pay, Paytm, etc.) of any employee or representative' },
        { tone: 'dont', text: 'WhatsApp QR codes' },
        { tone: 'dont', text: 'Direct transfers to individual employee or agent accounts' },
        { tone: 'warn', text: 'Cox & Kings bears no liability for payments made through unauthorised channels. All official communication comes only from addresses ending in @coxandkings.com' },
      ] },
  ],
  cancellation: [
    { id: 'how-cancel', icon: FileText, heading: 'How to submit a cancellation',
      summary: 'Cancellations are only valid in writing, effective from the date we receive your notice.',
      points: [
        'All cancellations must be submitted in writing — verbal requests will not be accepted',
        'Cancellation is effective only from the date written notice is received by Cox & Kings',
        'By email: holidays@coxandkings.com (followed by written confirmation to the registered office)',
        'In writing at: Wilson & Hughes India Private Limited, Southern Park, Saket, New Delhi – 110017',
      ] },
    { id: 'charges', icon: Calendar, heading: 'International tour — cancellation charges',
      summary: 'The closer to departure you cancel, the higher the charge. Airfare follows the airline’s own policy.',
      tiers: [
        { when: 'More than 60 days before', charge: '30%', refund: '70% refundable', level: 1 },
        { when: '45–59 days before', charge: '50%', refund: '50% refundable', level: 2 },
        { when: '36–44 days before', charge: '75%', refund: '25% refundable', level: 3 },
        { when: '0–35 days / No-show', charge: '100%', refund: 'No refund', level: 4 },
      ],
      note: 'Airfare: cancellation charges apply as per the respective airline’s policy.' },
    { id: 'deemed', icon: AlertTriangle, heading: 'Deemed cancellations (no formal notice needed)',
      summary: 'Some situations count as a cancellation automatically — even without a written request.',
      points: [
        { tone: 'warn', text: 'Visa rejection: deemed cancelled from the date written intimation of rejection is received by the company' },
        { tone: 'warn', text: 'Non-payment: failure to pay by the scheduled date; effective from the date the company issues a notice' },
        { tone: 'warn', text: 'Outstanding balance at departure: booking is deemed cancelled without notice, attracting 100% charges' },
      ] },
    { id: 'company-cancel', icon: Building2, heading: 'Cancellation by the company',
      summary: 'Rarely, we may cancel or amend a tour for safety, demand or force-majeure reasons.',
      points: [
        'Unsafe or adverse conditions as determined by competent authorities',
        'Insufficient demand or low occupancy',
        'Restrictions imposed by governmental or regulatory bodies',
        'Force majeure: natural disasters, war, epidemics, political unrest or similar unforeseeable events',
        'Refunds are processed within 45 days; no further claims or compensation will be entertained',
        'The company is not responsible for consequential losses such as connecting flights, accommodation, visas or vaccinations booked independently',
      ] },
    { id: 'refunds', icon: RefreshCcw, heading: 'Refund policy',
      summary: 'Eligible refunds are processed within 45 days; unutilised services are never refundable.',
      points: [
        'Refunds, where applicable, are processed within 45 days of cancellation',
        'Airline refunds may take longer depending on the airline’s policy',
        { tone: 'dont', text: 'No refund for any unutilised services — hotels, meals, sightseeing, rides, cruises, entrance tickets, optional tours, illness, late arrival or personal choice' },
        'If the tour cannot operate due to force majeure, the company is not obligated to refund, but may consider one at its sole discretion based on supplier policies and costs incurred',
      ] },
    { id: 'visa-cancel', icon: Stamp, heading: 'Visa-related cancellations',
      summary: 'Consular and processing fees are non-refundable, and standard charges apply even on a rejection.',
      points: [
        { tone: 'dont', text: 'All consular fees, visa processing fees, courier charges and admin fees are non-refundable — regardless of outcome' },
        'Standard cancellation charges apply even in the event of a visa rejection',
        'Cancellation is deemed effective from the date the company receives written intimation of rejection',
        'Re-applying after a rejection is entirely at the customer’s own risk and cost',
        'The company is not liable for visa rejections, delays, consulate errors or procedural delays under any circumstance',
      ] },
  ],
  tnc: [
    { id: 'eligibility', icon: UserCheck, heading: 'Eligibility & user agreement',
      summary: 'Services are for those legally able to contract; booking means you accept all terms.',
      points: [
        'Available only to persons legally competent to contract under the Indian Contract Act, 1872',
        'Minors, undischarged insolvents and persons of unsound mind are not eligible',
        'Use of the website or making a booking constitutes unconditional acceptance of all terms',
        'The user is financially responsible for all transactions made under their account',
      ] },
    { id: 'documents', icon: Stamp, heading: 'Travel documents & statutory clearances',
      summary: 'Holding valid passports, visas and clearances is entirely the customer’s responsibility.',
      points: [
        'Passport valid for at least 6 months beyond return date (9 months for Malaysia)',
        'Valid visa, ETA or other required entry permits for all destinations',
        'Confirmed air tickets',
        'NOC, immigration clearances and medical certificates where required',
        'Vaccination certificates and health documents as required by destination countries',
      ],
      note: 'Cancellation due to invalid or unavailable travel documents attracts standard cancellation charges.' },
    { id: 'health', icon: HeartPulse, heading: 'Health & fitness',
      summary: 'Each guest confirms they are fit to travel; medical clearance is advised for some travellers.',
      points: [
        'By booking, each guest confirms they are physically and mentally fit to travel',
        'Medical clearance is strongly advised for elderly travellers, minors and those with pre-existing conditions',
        'Pregnant travellers beyond 6 months are strongly discouraged; a fitness-to-travel certificate from a registered doctor is required',
        'All vaccinations, health tests and required medical documents must be arranged by the customer at their own cost',
      ] },
    { id: 'insurance', icon: ShieldCheck, heading: 'Travel insurance',
      summary: 'Comprehensive insurance is mandatory; Cox & Kings is only a facilitator for claims.',
      points: [
        'Comprehensive travel insurance is mandatory — medical expenses, baggage loss, trip cancellation and emergency evacuation',
        'Overseas Mediclaim and relevant policies must be purchased from the Cox & Kings-designated insurer at prescribed rates',
        'Cox & Kings acts only as a facilitator — it bears no responsibility for claims processing or settlement',
        'All claims must be addressed directly to the insurance provider',
      ] },
    { id: 'accommodation', icon: BedDouble, heading: 'Accommodation',
      summary: 'Hotel category varies by package; valuables and any room damage are the guest’s responsibility.',
      points: [
        'Hotel category and standard vary by tour package; hotels may be near airports or in the countryside for international group tours',
        'Triple-occupancy rooms typically include a twin room plus a rollaway bed; no more than 3 persons per room recommended',
        'All personal belongings and valuables are the sole responsibility of the customer',
        'Any damage to hotel property caused by the customer — wilful or accidental — is the customer’s sole liability',
      ] },
    { id: 'meals', icon: Utensils, heading: 'Meals & special requests',
      summary: 'Meals follow pre-set menus; dietary requests need 45 days’ written notice.',
      points: [
        'Meals are provided as per pre-set menus specified in the itinerary',
        'Special dietary requests must be submitted in writing at least 45 days before the final payment date',
        'No refund will be provided for any meal not availed, for any reason',
      ] },
    { id: 'force-majeure', icon: CloudLightning, heading: 'Force majeure & limitation of liability',
      summary: 'Cox & Kings is not liable for losses from events beyond its reasonable control.',
      points: [
        'Not liable for any loss, injury, illness, death or delay arising from events beyond its reasonable control — acts of God, war, civil unrest, epidemics, pandemics or governmental actions',
      ] },
    { id: 'law', icon: Gavel, heading: 'Governing law, arbitration & jurisdiction',
      summary: 'Indian law governs these terms; disputes are arbitrated in Chandigarh, in English.',
      points: [
        'These terms are governed by the laws of the Republic of India',
        'Disputes shall first be resolved through mutual negotiation within 30 days',
        'Unresolved disputes shall be referred to binding arbitration under the Arbitration and Conciliation Act, 1996',
        'Seat and venue of arbitration: Chandigarh, India; proceedings in English',
        'Courts at Chandigarh, India shall have exclusive jurisdiction over all judicial matters',
      ] },
    { id: 'binding', icon: Scale, heading: 'Binding agreement',
      summary: 'Signing the booking form — via OTP, digital acceptance or any advance payment — accepts all terms in full.',
      points: [
        'Execution of the booking form — including via OTP, digital acceptance or payment of any advance — constitutes full and unconditional acceptance of all terms',
      ] },
  ],
};

/* The few headline points shown on the page per category (3 in a row, or 4 in
   two rows). The exhaustive detail lives in the "read full" modal. */
const TERM_HIGHLIGHTS = {
  booking: [
    { icon: Calendar, title: 'Payment schedule', text: '35% non-refundable advance at booking, 75% by 60 days out, then 100% by 45 days before departure.' },
    { icon: Plane, title: 'Airfare', text: 'Airfare is paid 100% at booking, billed separately, and can change until ticketing.' },
    { icon: CreditCard, title: 'Pay safely', text: 'Only via official Cox & Kings payment links or NEFT / cheque — never a personal UPI or QR code.' },
  ],
  cancellation: [
    { icon: FileText, title: 'How to cancel', text: 'Only valid in writing, effective from the date Cox & Kings receives your notice.' },
    { icon: Calendar, title: 'Cancellation charges', text: '30% if you cancel 60+ days out, rising to 100% within 35 days or for a no-show.' },
    { icon: RefreshCcw, title: 'Refunds', text: 'Eligible refunds are processed within 45 days; unutilised services are never refundable.' },
    { icon: Stamp, title: 'Visa cancellations', text: 'Visa fees are non-refundable, and a rejection still attracts standard cancellation charges.' },
  ],
  tnc: [
    { icon: Stamp, title: 'Travel documents', text: 'A valid passport (6+ months), visas and clearances are the traveller’s responsibility.' },
    { icon: ShieldCheck, title: 'Insurance', text: 'Comprehensive travel insurance is mandatory, via the Cox & Kings-designated insurer.' },
    { icon: HeartPulse, title: 'Health & fitness', text: 'Each guest confirms fitness to travel; medical clearance is advised for some travellers.' },
    { icon: Gavel, title: 'Law & liability', text: 'Indian law governs; disputes are arbitrated in Chandigarh, in English.' },
  ],
};

/* A point's tone → its leading icon. 'plain' uses a small dot. */
const TONE = {
  do:    { Icon: Check, cls: 'do' },
  dont:  { Icon: X, cls: 'dont' },
  warn:  { Icon: AlertTriangle, cls: 'warn' },
  plain: { Icon: null, cls: 'plain' },
};
const normPoint = (p) => (typeof p === 'string' ? { tone: 'plain', text: p } : p);

function TermPoint({ point }) {
  const p = normPoint(point);
  const t = TONE[p.tone] || TONE.plain;
  const Icon = t.Icon;
  return (
    <li className={`lxjt3-pt lxjt3-pt--${t.cls}`}>
      <span className="lxjt3-pt__ic" aria-hidden="true">
        {Icon ? <Icon size={12} strokeWidth={3} /> : <span className="lxjt3-pt__dot" />}
      </span>
      <span className="lxjt3-pt__tx">{p.text}</span>
    </li>
  );
}

/* The cancellation-charge tiers — a compact visual scale (severity by level). */
function TermTiers({ tiers }) {
  return (
    <ul className="lxjt3-tiers" aria-label="Cancellation charges by timing">
      {tiers.map((t) => (
        <li key={t.when} className={`lxjt3-tier lxjt3-tier--l${t.level}`}>
          <span className="lxjt3-tier__when">{t.when}</span>
          <span className="lxjt3-tier__meter" aria-hidden="true"><span style={{ width: `${t.level * 25}%` }} /></span>
          <span className="lxjt3-tier__charge">{t.charge}</span>
          <span className="lxjt3-tier__refund">{t.refund}</span>
        </li>
      ))}
    </ul>
  );
}

const SUBNAV = [
  { id: 'highlights', label: 'Highlights' },
  { id: 'route', label: 'Route' },
  { id: 'itinerary', label: 'Day by day' },
  { id: 'included', label: 'Included' },
  { id: 'dates', label: 'Dates & prices' },
  { id: 'terms', label: 'Policies' },
  { id: 'reviews', label: 'Reviews' },
];

const inr = (n) => `₹${n.toLocaleString('en-IN')}`;

/* Scroll-reveal (mirrors the homepage useReveal) */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.lx2i-reveal');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { els.forEach((e) => e.classList.add('in')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);
}

/* ============================================================
   QUOTE ENGINE

   The private departure is priced by hand on the server (~15s), so the
   numbers below are what the dialog renders once it comes back. Every
   line is derived from what the traveller actually answered, which is
   the whole point of a quote: they should recognise their own choices
   in it, not read a generic price list.
   ============================================================ */
const QUOTE_SECONDS = 15;   // how long the server takes to price a private departure

/* The dialog is five screens, so its accessible name has to move with them —
   a screen reader announces this on entry and on every stage change. */
const QUOTE_STAGE_LABEL = {
  details: 'Step 1 of 3 — tell us who is travelling',
  pricing: 'Step 2 of 3 — pricing your journey, about 15 seconds',
  quote: 'Your quote is ready',
  call: 'Step 3 of 3 — book your confirmation call',
  booked: 'Your call is booked',
};

const RATES = {
  child: 0.85,        // of the adult land price, sharing with an adult
  privatePP: 24000,   // private departure — own guide, coach and dates
  flightsPP: 62000,   // return economy from the home city
  visaPP: 8500,       // Japan tourist visa, paperwork handled
  extraBed: 9500,     // rollaway, per bed for the trip
  gst: 0.05,          // GST on the package
};

function priceQuote(q, adults) {
  const heads = adults + q.children;
  const childPP = Math.round(PRICE * RATES.child);
  const lines = [
    { label: `Land journey — ${adults} adult${adults === 1 ? '' : 's'}`, note: `${inr(PRICE)} per adult`, amount: PRICE * adults },
  ];
  if (q.children > 0) {
    lines.push({ label: `Children — ${q.children}`, note: `${inr(childPP)} each, sharing with an adult`, amount: childPP * q.children });
  }
  lines.push({ label: 'Private departure', note: 'Your own guide, coach and dates — not a shared group', amount: RATES.privatePP * adults });
  if (q.extraBeds > 0) {
    lines.push({ label: `Extra beds — ${q.extraBeds}`, note: `${inr(RATES.extraBed)} each, for the eight nights`, amount: RATES.extraBed * q.extraBeds });
  }
  if (q.flights) {
    lines.push({ label: `Return flights — ${heads} traveller${heads === 1 ? '' : 's'}`, note: 'Economy, from your home city', amount: RATES.flightsPP * heads });
  }
  if (q.visa) {
    lines.push({ label: `Visa assistance — ${heads}`, note: 'Japan tourist visa, paperwork handled for you', amount: RATES.visaPP * heads });
  }

  const subtotal = lines.reduce((sum, l) => sum + l.amount, 0);
  const gst = Math.round(subtotal * RATES.gst);
  const total = subtotal + gst;

  /* Stated plainly, so nobody discovers it at the airport. */
  const excluded = [
    ...(q.flights ? [] : ['International flights — you told us you are booking your own']),
    ...(q.visa ? [] : ['Visa — you told us you will arrange it yourself']),
    'Meals beyond those listed in the day-by-day itinerary',
    'Personal expenses — tips, laundry, beverages and the like',
  ];

  return { lines, subtotal, gst, total, heads, perPerson: Math.round(total / heads), excluded };
}

/* The wait is ~15s of real server work. Naming each stage — and echoing the
   traveller's own answers back into it — is what stops it reading as a hang. */
function quoteStages(q, adults, departure) {
  return [
    { at: 0, label: `Checking availability for ${departure}` },
    { at: 3, label: `Pricing ${adults} adult${adults === 1 ? '' : 's'}${q.children ? ` and ${q.children} child${q.children === 1 ? '' : 'ren'}` : ''}` },
    { at: 6, label: `Holding ${q.rooms} room${q.rooms === 1 ? '' : 's'} across the eight nights` },
    { at: 9, label: q.flights ? 'Fetching live flight fares from your home city' : 'Costing the land journey, without flights' },
    { at: 12, label: 'Applying your private-departure rates' },
    { at: 14, label: 'Preparing your quote document' },
  ];
}

/* ---- Downloadable documents ----------------------------------------
   Built client-side as self-contained, print-ready HTML: the traveller
   saves or prints it to PDF from the browser. Labelled as print-ready
   rather than "PDF", because it isn't one — see the note in the panel.
   -------------------------------------------------------------------- */
const docShell = (title, body) => `<!doctype html><html><head><meta charset="utf-8">
<title>${title}</title>
<style>
  @page { margin: 18mm; }
  body { font-family: Georgia, 'Times New Roman', serif; color: #1F2A36; line-height: 1.55; max-width: 720px; margin: 40px auto; padding: 0 24px; }
  header { border-bottom: 2px solid #0B5AB1; padding-bottom: 14px; margin-bottom: 26px; }
  .brand { font-size: 13px; letter-spacing: 0.22em; text-transform: uppercase; color: #0B5AB1; font-family: Helvetica, Arial, sans-serif; }
  h1 { font-size: 28px; font-weight: 400; margin: 8px 0 4px; }
  .sub { font-family: Helvetica, Arial, sans-serif; font-size: 13px; color: #5C5C55; margin: 0; }
  h2 { font-size: 17px; font-weight: 400; margin: 28px 0 10px; border-bottom: 1px solid #D9D7CB; padding-bottom: 6px; }
  table { width: 100%; border-collapse: collapse; font-size: 14px; }
  td { padding: 9px 0; vertical-align: top; border-bottom: 1px solid #EDEBE1; }
  td.amt { text-align: right; white-space: nowrap; font-variant-numeric: tabular-nums; }
  .note { font-family: Helvetica, Arial, sans-serif; font-size: 12px; color: #5C5C55; }
  .tot td { border-top: 2px solid #1F2A36; border-bottom: 0; font-size: 17px; padding-top: 12px; }
  ul { padding-left: 18px; font-size: 14px; }
  li { margin-bottom: 5px; }
  .day { margin-bottom: 18px; page-break-inside: avoid; }
  .day h3 { font-size: 15px; margin: 0 0 3px; font-weight: 400; }
  .day p { margin: 0 0 4px; font-size: 14px; }
  footer { margin-top: 34px; border-top: 1px solid #D9D7CB; padding-top: 14px; font-family: Helvetica, Arial, sans-serif; font-size: 12px; color: #5C5C55; }
</style></head><body>${body}
<footer>Cox &amp; Kings · ${OFFICE_FULL} · ${PHONE_DISPLAY} · ${EMAIL}<br>
This document was generated for you and is not a contract. Fares and availability are confirmed when you book.</footer>
</body></html>`;

function downloadDoc(filename, html) {
  const url = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/* ---- Quote-form primitives (used only by the "Get a quote" dialog) ---- */

/* Counter row. Mirrors the booking card's .lxjt-stepper so the dialog reads
   as the same control the traveller already used on the card. */
function QStep({ label, hint, value, onChange, min = 0, max = 12 }) {
  return (
    <div className="lxjt5-q__step">
      <span className="lxjt5-q__steplbl">{label}{hint && <small>{hint}</small>}</span>
      <div className="lxjt-stepper">
        <button type="button" aria-label={`Fewer: ${label}`} onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min}><Minus size={15} /></button>
        <span className="lxjt-stepper__val">{value}</span>
        <button type="button" aria-label={`More: ${label}`} onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max}><Plus size={15} /></button>
      </div>
    </div>
  );
}

/* On/off row. A real switch (role + aria-checked) rather than a styled
   checkbox, so screen readers announce the state, not just the label. */
function QToggle({ icon: Icon, label, hint, checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={`lxjt5-q__tog ${checked ? 'is-on' : ''}`}
      onClick={() => onChange(!checked)}
    >
      <span className="lxjt5-q__togic"><Icon size={17} strokeWidth={1.8} /></span>
      <span className="lxjt5-q__togtxt"><strong>{label}</strong>{hint && <small>{hint}</small>}</span>
      <span className="lxjt5-q__switch" aria-hidden="true" />
    </button>
  );
}

/* ---- The date picker -------------------------------------------------
   A month grid rather than a <select> of four dates. The traveller is
   choosing a moment in their own year — a weekend, a school holiday, an
   anniversary — and a calendar is the only control that shows them the
   shape of it.

   Keyboard behaviour is the part that is easy to get wrong. A date grid
   takes ONE tab stop, not thirty-one: arrows move within it, PageUp and
   PageDown change month, Home and End jump to the ends of the week. That
   is the composite-widget pattern a screen-reader user expects of a
   calendar, and it is what WCAG's roving-tabindex guidance asks for.
   -------------------------------------------------------------------- */
function PrivateCalendar({ value, onChange, minDate, maxDate }) {
  const selected = fromISO(value);
  const [cursor, setCursor] = useState(() => firstOfMonth(selected ?? minDate));
  const [focusDay, setFocusDay] = useState(() => selected ?? minDate);
  const gridRef = useRef(null);
  /* Only pull focus when the user actually drove the grid with the keyboard
     — never on first paint, which would yank the page down to the calendar. */
  const grabFocus = useRef(false);

  useEffect(() => {
    if (!grabFocus.current) return;
    grabFocus.current = false;
    gridRef.current?.querySelector('[data-roving="true"]')?.focus();
  }, [focusDay]);

  /* The drawer's date field writes to the same state. If it lands on another
     month, the calendar has to follow it there — otherwise the grid sits on
     March while the summary underneath reads October. */
  useEffect(() => {
    const next = fromISO(value);
    if (!next) return;
    setCursor(firstOfMonth(next));
    setFocusDay(next);
  }, [value]);

  const clamp = (d) => (d < minDate ? minDate : d > maxDate ? maxDate : d);

  const moveTo = (d) => {
    const next = clamp(d);
    grabFocus.current = true;
    setFocusDay(next);
    setCursor(firstOfMonth(next));
  };

  const onKeyDown = (e) => {
    const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
    if (step !== undefined) { e.preventDefault(); moveTo(addDays(focusDay, step)); return; }
    if (e.key === 'PageUp') { e.preventDefault(); moveTo(addMonthsClamped(focusDay, -1)); return; }
    if (e.key === 'PageDown') { e.preventDefault(); moveTo(addMonthsClamped(focusDay, 1)); return; }
    if (e.key === 'Home') { e.preventDefault(); moveTo(addDays(focusDay, -mondayIndex(focusDay))); return; }
    if (e.key === 'End') { e.preventDefault(); moveTo(addDays(focusDay, 6 - mondayIndex(focusDay))); }
  };

  const prevMonth = addMonths(cursor, -1);
  const nextMonth = addMonths(cursor, 1);
  const canGoBack = prevMonth >= firstOfMonth(minDate);
  const canGoOn = nextMonth <= firstOfMonth(maxDate);

  /* Lay the month out Monday-first, padding the ragged ends. */
  const cells = [];
  for (let i = 0; i < mondayIndex(cursor); i += 1) cells.push(null);
  for (let d = 1; d <= daysInMonth(cursor); d += 1) cells.push(new Date(cursor.getFullYear(), cursor.getMonth(), d));
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  return (
    <div className="lxjt5-cal">
      <div className="lxjt5-cal__bar">
        <button type="button" className="lxjt5-cal__nav" aria-label="Previous month"
          disabled={!canGoBack} onClick={() => setCursor(prevMonth)}>
          <ChevronLeft size={17} />
        </button>
        {/* Announced politely, so a screen reader learns the month changed
            without the arrows shouting over the rest of the page. */}
        <h4 className="lxjt5-cal__title" aria-live="polite">
          {MONTH_NAMES[cursor.getMonth()]} {cursor.getFullYear()}
        </h4>
        <button type="button" className="lxjt5-cal__nav" aria-label="Next month"
          disabled={!canGoOn} onClick={() => setCursor(nextMonth)}>
          <ChevronRight size={17} />
        </button>
      </div>

      <div className="lxjt5-cal__wk" aria-hidden="true">
        {WEEKDAY_NAMES.map((w) => <span key={w}>{w}</span>)}
      </div>

      <div className="lxjt5-cal__grid" role="grid" aria-label="Choose your start date"
        ref={gridRef} onKeyDown={onKeyDown}>
        {weeks.map((week, wi) => (
          <div className="lxjt5-cal__row" role="row" key={wi}>
            {week.map((d, di) => {
              if (!d) return <span className="lxjt5-cal__pad" role="gridcell" key={di} />;
              const open = d >= minDate && d <= maxDate;
              const on = sameDay(d, selected);
              const roving = sameDay(d, focusDay);
              return (
                <span role="gridcell" aria-selected={on} key={di}>
                  <button
                    type="button"
                    data-roving={roving ? 'true' : undefined}
                    tabIndex={roving ? 0 : -1}
                    disabled={!open}
                    className={`lxjt5-cal__day ${on ? 'is-on' : ''}`}
                    onClick={() => { setFocusDay(d); onChange(toISO(d)); }}
                    /* The visible label is a bare numeral; the accessible one
                       has to carry the whole date, and the reason a day is
                       shut rather than leaving it a mystery. */
                    aria-label={open ? longDate(d) : `${longDate(d)} — too soon to build a private journey`}
                  >
                    {d.getDate()}
                  </button>
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function JapanTourLuxe5() {
  const [menuOpen, setMenuOpen] = useState(false);
  /* Which NAV_MENU group is expanded in the mobile drawer (one at a time). */
  const [mobileSection, setMobileSection] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  /* Whether the hero has scrolled off. Gates the floating quote CTA. */
  const [pastHero, setPastHero] = useState(false);
  const [activeDay, setActiveDay] = useState(0);     // desktop: drives the sticky itinerary picture
  const [openDay, setOpenDay] = useState(-1);        // mobile: which day's accordion is expanded
  /* The traveller's own start date, as a local ISO day. Empty until they
     pick one: a private journey has no default departure, and pre-filling
     a travel date would be putting words in their mouth. */
  const [startDate, setStartDate] = useState('');
  const [activeSection, setActiveSection] = useState('highlights');
  const [callbackOpen, setCallbackOpen] = useState(false);
  const [callbackSent, setCallbackSent] = useState(false);
  const [travellers, setTravellers] = useState(2);
  const [termsTab, setTermsTab] = useState('booking');       // which policy category is shown
  const [termsModalOpen, setTermsModalOpen] = useState(false); // full-detail modal

  /* Quote dialog. This is a private, tailor-made departure, so the booking
     card can't price it on its own — the CTA collects the party details and
     hands off to a travel designer instead of taking a payment.
     `adults` deliberately lives in `travellers` (the card's stepper), so the
     two controls stay one number and the card's maths keeps following it. */
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [q, setQ] = useState({
    prefix: 'Mr', first: '', last: '', email: '', phone: '',
    children: 0, rooms: 1, bed: 'twin', extraBeds: 0,
    flights: true, visa: true, infant: false, seniors: false,
    comments: '',
  });
  const qSet = (key) => (val) => setQ((prev) => ({ ...prev, [key]: val }));

  /* Where the traveller is in the quote flow:
       details → pricing (~15s on the server) → quote → call → booked
     'failed' is a real destination, not an afterthought: a 15-second
     request that cannot fail does not exist, and a wait with no way out
     is a trap. */
  const [qStage, setQStage] = useState('details');
  const [elapsed, setElapsed] = useState(0);          // seconds into the 15s wait
  const [quoteRef, setQuoteRef] = useState(null);     // set once the server answers
  const [validUntil, setValidUntil] = useState('');
  const [callSlot, setCallSlot] = useState({ day: 'today', time: '' });
  const quotePanelRef = useRef(null);                 // focus + scroll are managed per stage

  /* The window a private journey can actually be built in. Both ends are
     computed once from today, so the calendar and the drawer's date field
     enforce exactly the same rule. */
  const today = useMemo(() => startOfDay(new Date()), []);
  const minDate = useMemo(() => addDays(today, MIN_LEAD_DAYS), [today]);
  const maxDate = useMemo(
    () => new Date(today.getFullYear(), today.getMonth() + BOOK_HORIZON_MONTHS + 1, 0),
    [today]
  );
  const picked = useMemo(() => fromISO(startDate), [startDate]);
  const season = useMemo(() => (picked ? seasonFor(picked) : null), [picked]);
  const homeOn = useMemo(() => (picked ? addDays(picked, TRIP_DAYS - 1) : null), [picked]);
  /* Everything downstream — the wait, the quote, the PDF — says the date in
     one voice, and degrades gracefully if they somehow got here without one. */
  const dateLabel = picked ? longDate(picked) : 'your chosen dates';

  const quote = useMemo(() => priceQuote(q, travellers), [q, travellers]);
  const stages = useMemo(
    () => quoteStages(q, travellers, dateLabel),
    [q, travellers, dateLabel]
  );
  const stageLabel = [...stages].reverse().find((s) => elapsed >= s.at)?.label ?? stages[0].label;
  const pct = Math.min(100, Math.round((elapsed / QUOTE_SECONDS) * 100));

  useReveal();
  const day = ITINERARY[activeDay];
  const activeCat = TERM_CATS.find((c) => c.id === termsTab);

  /* The card used to run deposit maths — "Due today ₹1,18,000", 20% of a
     price nobody had quoted yet. On a private journey that number was
     fiction twice over: the price is built by hand from the brief, and the
     card has never been able to take a payment. It has gone. The card now
     anchors on the honest number (the from-price) and the quote carries the
     real one. */

  useEffect(() => { window.scrollTo(0, 0); }, []);

  // Sticky-header state (transparent over hero → solid blue on scroll, like the homepage)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const lock = menuOpen || callbackOpen || termsModalOpen || quoteOpen;
    document.body.style.overflow = lock ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen, callbackOpen, termsModalOpen, quoteOpen]);

  /* Reset the drawer's open section when it closes. */
  useEffect(() => { if (!menuOpen) setMobileSection(null); }, [menuOpen]);

  /* The hero already carries a CTA into the booking card — the floating one
     only earns its place once that has scrolled away, so the two never sit on
     screen at once. */
  useEffect(() => {
    const hero = document.querySelector('.lxjt-hero');
    if (!hero) return;
    const io = new IntersectionObserver(([e]) => setPastHero(!e.isIntersecting), { threshold: 0 });
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!callbackOpen && !termsModalOpen && !quoteOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') { setCallbackOpen(false); setTermsModalOpen(false); setQuoteOpen(false); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [callbackOpen, termsModalOpen, quoteOpen]);

  // Spy the active section for the sticky sub-nav
  useEffect(() => {
    const els = SUBNAV.map((s) => document.getElementById(s.id)).filter(Boolean);
    if (!els.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (vis[0]) setActiveSection(vis[0].target.id);
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.2, 0.6, 1] }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // In-page (#) nav links smooth-scroll; cross-page links navigate normally.
  const navClick = useCallback((href) => (e) => {
    setMenuOpen(false);
    if (href.startsWith('#')) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const openCallback = useCallback((e) => { if (e) e.preventDefault(); setMenuOpen(false); setCallbackSent(false); setCallbackOpen(true); }, []);

  /* The navbar and footer open the SITE-WIDE schedule-a-call dialog (the one
     <ScheduleCallProvider> owns and every other page's chrome uses), not this
     page's local callback sheet — that is what makes the chrome identical to
     /new3 in behaviour and not just in looks. The tour's own CTAs below keep
     the local sheet, which is tied to this journey. */
  const openScheduleCall = useScheduleCall();
  const openNavCallback = useCallback(() => { setMenuOpen(false); openScheduleCall(); }, [openScheduleCall]);

  /* Re-opening never throws work away: if a quote already came back, the
     dialog returns to it rather than to an empty form. */
  const openQuote = useCallback((e) => {
    if (e) e.preventDefault();
    setMenuOpen(false);
    setQuoteOpen(true);
  }, []);

  /* The 15-second wait. Ticks every 250ms so the bar moves smoothly and the
     stage copy can change under it; the whole thing tears down on unmount or
     if the traveller backs out, so a cancelled request can't land later. */
  useEffect(() => {
    if (qStage !== 'pricing') return;
    setElapsed(0);
    const started = Date.now();
    const id = setInterval(() => {
      const secs = (Date.now() - started) / 1000;
      setElapsed(secs);
      if (secs >= QUOTE_SECONDS) {
        clearInterval(id);
        setQuoteRef(`CK-JP-${Math.floor(1000 + Math.random() * 9000)}`);
        const until = new Date(Date.now() + 14 * 864e5);
        setValidUntil(until.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }));
        setQStage('quote');
      }
    }, 250);
    return () => clearInterval(id);
  }, [qStage]);

  /* Each stage swaps the whole panel out. Without this, the button the user
     just pressed unmounts and focus falls back to <body> — a keyboard user is
     dumped at the top of the page mid-flow. Moving focus to the new heading
     also announces the change to a screen reader, which is the only way they
     learn the 15-second wait is over. The panel scrolls back to the top for
     everyone else. */
  useEffect(() => {
    if (!quoteOpen) return;
    const head = quotePanelRef.current?.querySelector('h3');
    if (head) { head.tabIndex = -1; head.focus({ preventScroll: true }); }
    /* The drawer pins its head and foot, so the panel itself never scrolls —
       the middle does. Reset that, not the panel. */
    const body = quotePanelRef.current?.querySelector('.lxjt5-qd__body');
    if (body) body.scrollTop = 0;
  }, [qStage, quoteOpen]);

  const partySummary = `${travellers} adult${travellers === 1 ? '' : 's'}${q.children ? `, ${q.children} child${q.children === 1 ? '' : 'ren'}` : ''}`;

  const downloadQuote = useCallback(() => {
    const rows = quote.lines.map((l) => `<tr><td>${l.label}<br><span class="note">${l.note}</span></td><td class="amt">${inr(l.amount)}</td></tr>`).join('');
    downloadDoc(`Cox-and-Kings-Quote-${quoteRef}.html`, docShell(`Quote ${quoteRef} — Essence Japan with Hakone`, `
      <header>
        <div class="brand">Cox &amp; Kings · Private departure</div>
        <h1>Essence Japan with Hakone</h1>
        <p class="sub">Quote ${quoteRef} · prepared for ${q.prefix} ${q.first} ${q.last} · valid until ${validUntil}</p>
      </header>
      <h2>Your journey</h2>
      <table>
        <tr><td>Departing</td><td class="amt">${dateLabel}</td></tr>
        <tr><td>Travellers</td><td class="amt">${partySummary}</td></tr>
        <tr><td>Rooms</td><td class="amt">${q.rooms} · ${q.bed === 'twin' ? 'twin beds' : q.bed === 'double' ? 'one double' : 'a mix'}${q.extraBeds ? ` · ${q.extraBeds} extra bed(s)` : ''}</td></tr>
        <tr><td>Duration</td><td class="amt">8 days · 7 nights</td></tr>
      </table>
      <h2>The price</h2>
      <table>
        ${rows}
        <tr><td>GST (5%)</td><td class="amt">${inr(quote.gst)}</td></tr>
        <tr class="tot"><td>Total</td><td class="amt">${inr(quote.total)}</td></tr>
      </table>
      <p class="note">That is ${inr(quote.perPerson)} per person, all in, for ${quote.heads} traveller${quote.heads === 1 ? '' : 's'}.</p>
      <h2>What the price includes</h2>
      <ul>${INCLUDED.map((i) => `<li>${i}</li>`).join('')}</ul>
      <h2>What it does not include</h2>
      <ul>${quote.excluded.map((i) => `<li>${i}</li>`).join('')}</ul>
      ${q.comments ? `<h2>Your notes to us</h2><p>${q.comments}</p>` : ''}
    `));
  }, [quote, quoteRef, validUntil, q, dateLabel, partySummary]);

  const downloadItinerary = useCallback(() => {
    const days = ITINERARY.map((d) => `
      <div class="day">
        <h3>${d.day} · ${d.title}</h3>
        <p>${d.body}</p>
        <p class="note">Hotel: ${d.hotel} · Meals: ${d.meals} · ${d.transfer}</p>
      </div>`).join('');
    downloadDoc(`Cox-and-Kings-Itinerary-Essence-Japan.html`, docShell('Essence Japan with Hakone — full itinerary', `
      <header>
        <div class="brand">Cox &amp; Kings · Private departure</div>
        <h1>Essence Japan with Hakone</h1>
        <p class="sub">8 days · 7 nights · Tokyo, Odawara, Kawaguchiko, Kyoto, Osaka${quoteRef ? ` · accompanies quote ${quoteRef}` : ''}</p>
      </header>
      <h2>Day by day</h2>
      ${days}
      <h2>What the price includes</h2>
      <ul>${INCLUDED.map((i) => `<li>${i}</li>`).join('')}</ul>
      <h2>What it does not include</h2>
      <ul>${NOT_INCLUDED.map((i) => `<li>${i}</li>`).join('')}</ul>
    `));
  }, [quoteRef]);

  /* An .ics the traveller's own calendar understands — so the call they just
     booked exists somewhere other than our database. */
  const downloadCallInvite = useCallback(() => {
    const when = callSlot.day === 'today' ? new Date() : new Date(Date.now() + 864e5);
    const stamp = (d) => `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}T${String(d.getUTCHours()).padStart(2, '0')}${String(d.getUTCMinutes()).padStart(2, '0')}00Z`;
    const end = new Date(when.getTime() + 30 * 60000);
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Cox and Kings//Quote call//EN', 'BEGIN:VEVENT',
      `UID:${quoteRef}@coxandkings.com`, `DTSTAMP:${stamp(new Date())}`, `DTSTART:${stamp(when)}`, `DTEND:${stamp(end)}`,
      `SUMMARY:Cox & Kings — booking call (${quoteRef})`,
      `DESCRIPTION:Your travel designer will call you on ${q.phone} to confirm Essence Japan with Hakone, quote ${quoteRef}.`,
      `LOCATION:${PHONE_DISPLAY}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    const a = document.createElement('a');
    a.href = url; a.download = `Cox-and-Kings-call-${quoteRef}.ics`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  }, [callSlot, quoteRef, q.phone]);

  return (
    <>
      <div className="lx2i lxjt lxjt2 lxjt3 lxjt4 lxjt5">
        <div className="lx2i-grain" aria-hidden="true" />
        <a className="lxjt-skip" href="#main">Skip to content</a>

        {/* ============ HEADER + MOBILE MENU (the /new3 navbar, verbatim) ============
             `new-typo n3` are what New3.css and NewTypography.css hang their rules
             off. Both are scoped to those classes, so putting them on this wrapper
             (rather than the page root) styles the chrome and nothing else. */}
        <div className="h26 new-typo n3">
          <header className={`h26-nav${scrolled ? ' is-solid' : ''}`}>
            <Link to={HOME} className="h26-brand" aria-label="Cox & Kings — home">
              <img src="/cox-logo-new.png" alt="Cox & Kings" />
            </Link>
            <nav className="h26-links hi-nav" aria-label="Primary">
              {NAV_MENU.map((group) => (
                <div className="hi-nav-group" key={group.label}>
                  {group.to ? (
                    <Link to={group.to} className="hi-nav-top" aria-haspopup="true">
                      {group.label}
                      <ChevronDown size={14} className="hi-nav-caret" aria-hidden="true" />
                    </Link>
                  ) : (
                    <a href={group.href} className="hi-nav-top" aria-haspopup="true">
                      {group.label}
                      <ChevronDown size={14} className="hi-nav-caret" aria-hidden="true" />
                    </a>
                  )}
                  <div className="hi-nav-flyout" role="menu">
                    <div className="hi-nav-flyout-inner">
                      <p className="hi-nav-blurb">{group.blurb}</p>
                      <ul className="hi-nav-list">
                        {group.items.map((it, idx) => (
                          <Fragment key={it.label}>
                            {/* Section rule wherever the KIND of item changes. */}
                            {it.group && group.items[idx - 1]?.group !== it.group && (
                              <li className="n3-navgroup" aria-hidden="true"><span>{it.group}</span></li>
                            )}
                            <li>
                              {it.action === 'callback' ? (
                                <button type="button" role="menuitem" className="hi-nav-item n3-nav-action" onClick={openNavCallback}>
                                  <span className="hi-nav-item-label">{it.label}</span>
                                  <span className="hi-nav-item-desc">{it.desc}</span>
                                </button>
                              ) : it.to ? (
                                <Link to={it.to} role="menuitem" className="hi-nav-item">
                                  <span className="hi-nav-item-label">{it.label}</span>
                                  <span className="hi-nav-item-desc">{it.desc}</span>
                                </Link>
                              ) : (
                                <a href={it.href} role="menuitem" className="hi-nav-item">
                                  <span className="hi-nav-item-label">{it.label}</span>
                                  <span className="hi-nav-item-desc">{it.desc}</span>
                                </a>
                              )}
                            </li>
                          </Fragment>
                        ))}
                      </ul>
                      {/* The catch-all sits OUTSIDE the list: it is not one more thing
                          to choose between, it is the way past the choosing. */}
                      {group.all && (
                        <Link to={group.all.to} role="menuitem" className="n3-navall">
                          <span className="n3-navall-label">{group.all.label}</span>
                          <span className="n3-navall-meta">{group.all.meta}</span>
                          <ArrowRight size={15} className="n3-navall-arrow" aria-hidden="true" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </nav>
            <div className="h26-nav-cta">
              <a href={PHONE_TEL} className="h26-phone">
                <Phone size={15} /> <span>{PHONE_DISPLAY}</span>
              </a>
              <Link to={CALLBACK} className="h26-btn h26-btn-pill">Talk to an expert</Link>
              <button className="h26-burger" aria-label="Menu" onClick={() => setMenuOpen(true)}>
                <Menu size={22} />
              </button>
            </div>
          </header>

          {/* Mobile slide-in menu — driven by the SAME NAV_MENU as the desktop
              flyouts, so the two cannot drift apart. One section open at a time. */}
          <div className={`h26-menu${menuOpen ? ' is-open' : ''}`} aria-hidden={!menuOpen}>
            <div className="h26-menu-scrim" onClick={() => setMenuOpen(false)} />
            <div className="h26-menu-panel" role="dialog" aria-modal="true" aria-label="Menu">
              <div className="h26-menu-top">
                <button className="h26-menu-close" aria-label="Close menu" onClick={() => setMenuOpen(false)}><X size={20} /></button>
                <img className="h26-menu-logo" src="/cox-logo-new.png" alt="Cox & Kings — Est. 1758" />
              </div>
              <nav className="h26-menu-primary n3-macc" aria-label="Mobile primary">
                {NAV_MENU.map((g) => {
                  const open = mobileSection === g.label;
                  return (
                    <div key={g.label} className={`n3-macc-item${open ? ' is-open' : ''}`}>
                      <button
                        type="button"
                        className="n3-macc-head"
                        aria-expanded={open}
                        onClick={() => setMobileSection(open ? null : g.label)}
                      >
                        {g.label}
                        <span className="h26-menu-chev n3-macc-chev"><ChevronDown size={16} /></span>
                      </button>
                      <div className="n3-macc-panel" hidden={!open}>
                        {g.items.map((it, idx) => (
                          <Fragment key={it.label}>
                            {it.group && g.items[idx - 1]?.group !== it.group && (
                              <span className="n3-macc-group">{it.group}</span>
                            )}
                            {it.action === 'callback' ? (
                              <button type="button" className="n3-macc-link n3-nav-action" onClick={openNavCallback}>
                                <span className="n3-macc-lbl">{it.label}</span>
                                <span className="n3-macc-desc">{it.desc}</span>
                              </button>
                            ) : it.to ? (
                              <Link to={it.to} className="n3-macc-link" onClick={() => setMenuOpen(false)}>
                                <span className="n3-macc-lbl">{it.label}</span>
                                <span className="n3-macc-desc">{it.desc}</span>
                              </Link>
                            ) : (
                              <a href={it.href} className="n3-macc-link" onClick={() => setMenuOpen(false)}>
                                <span className="n3-macc-lbl">{it.label}</span>
                                <span className="n3-macc-desc">{it.desc}</span>
                              </a>
                            )}
                          </Fragment>
                        ))}
                        {g.all && (
                          <Link to={g.all.to} className="n3-navall n3-macc-all" onClick={() => setMenuOpen(false)}>
                            <span className="n3-navall-label">{g.all.label}</span>
                            <span className="n3-navall-meta">{g.all.meta}</span>
                            <ArrowRight size={15} className="n3-navall-arrow" aria-hidden="true" />
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
                {/* In-page sections, which have no submenu to open. On /new3 these
                    are Clips and Reviews; here, the two the tour itself has. */}
                {[{ label: 'Itinerary', href: '#itinerary' }, { label: 'Reviews', href: '#reviews' }].map((n) => (
                  <a key={n.label} href={n.href} className="n3-macc-plain" onClick={navClick(n.href)}>
                    {n.label}
                    <span className="h26-menu-chev"><ArrowRight size={16} /></span>
                  </a>
                ))}
              </nav>
              <div className="h26-menu-divider" />
              <div className="h26-menu-secondary">
                <Link to="/journeys4" onClick={() => setMenuOpen(false)}>All journeys <ArrowUpRight size={13} /></Link>
                <Link to="/journeys4" onClick={() => setMenuOpen(false)}>Destinations <ArrowUpRight size={13} /></Link>
                <Link to="/about-us2" onClick={() => setMenuOpen(false)}>Our story <ArrowUpRight size={13} /></Link>
                <Link to={CALLBACK} onClick={() => setMenuOpen(false)}>Contact <ArrowUpRight size={13} /></Link>
              </div>
              <button type="button" className="h26-btn h26-btn-pill h26-menu-cta" onClick={openNavCallback}>
                <Phone size={16} /> Schedule a call
              </button>
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
        </div>

        <main id="main">
          {/* ============ HERO (full-bleed under the fixed header) ============ */}
          <section className="lxjt-hero">
            <div className="lxjt-hero__bg" style={{ backgroundImage: `url(${sizedUnsplash(HERO.image, 1900)})` }} aria-hidden="true" />
            <div className="lxjt-hero__veil" aria-hidden="true" />
            <div className="lx2i-container lxjt-hero__inner">
              <nav className="lxjt-crumb" aria-label="Breadcrumb">
                <Link to={HOME}><ArrowLeft size={14} /> Back to journeys</Link>
              </nav>
              <div className="lxjt-hero__content lx2i-fade" style={{ '--d': '.1s' }}>
                <span className="lx2i-eyebrow lx2i-eyebrow--light">{HERO.kicker}</span>
                <h1 className="lxjt-hero__title">{HERO.title}</h1>
                <p className="lxjt-hero__lead">{HERO.lead}</p>
                <ul className="lxjt-hero__facts" aria-label="Trip at a glance">
                  {HERO.facts.map(({ icon: Icon, label }) => (
                    <li key={label} className="lxjt-fact"><Icon size={16} strokeWidth={1.9} /> {label}</li>
                  ))}
                </ul>
                <div className="lxjt-hero__actions">
                  <a href="#dates" onClick={navClick('#dates')} className="lx2i-btn lx2i-btn--secondary lx2i-btn--lg">Check dates &amp; prices <ArrowRight size={16} /></a>
                </div>
                <a href="#reviews" onClick={navClick('#reviews')} className="lxjt-hero__rating lxjt5-rating-link">
                  <span className="lx2i-stars">{[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}</span>
                  <strong>4.9</strong><span>from 640 traveller reviews of this tour</span>
                </a>
              </div>
            </div>
          </section>

          {/* ============ STICKY SUB-NAV ============ */}
          <nav className="lxjt-subnav" aria-label="Sections of this tour">
            <div className="lx2i-container lxjt-subnav__inner">
              <ul>
                {SUBNAV.map((s) => (
                  <li key={s.id}><a href={`#${s.id}`} onClick={navClick(`#${s.id}`)} className={activeSection === s.id ? 'is-active' : ''}>{s.label}</a></li>
                ))}
              </ul>
            </div>
          </nav>

          {/* ============ HIGHLIGHTS ============ */}
          <section className="lxjt-section" id="highlights">
            <div className="lx2i-container">
              <div className="lxjt-head lx2i-reveal">
                <span className="lx2i-eyebrow">// THE JOURNEY, CURATED FOR YOU</span>
                <h2 className="lx2i-h2">Tour <strong>highlights</strong></h2>
                <p className="lxjt-lead">Every detail privately arranged, so you need only turn up and be there for it.</p>
              </div>
              <ul className="lxjt-keyinc lx2i-reveal" aria-label="Key inclusions in the price">
                {KEY_INCLUSIONS.map(({ icon: Icon, label }) => (
                  <li key={label} className="lxjt-keyinc__item">
                    <span className="lxjt-keyinc__ic"><Icon size={20} strokeWidth={1.7} /></span>
                    <span className="lxjt-keyinc__lbl">{label}</span>
                  </li>
                ))}
              </ul>
              <div className="lxjt-hl__grid">
                <div className="lxjt-hl__media lx2i-reveal">
                  <div className="lxjt-hl__img" style={{ backgroundImage: `url(${sizedUnsplash(HIGHLIGHT_IMG, 900)})` }} role="img" aria-label="Travellers exploring a Kyoto temple garden" />
                  <span className="lxjt-hl__cap"><MapPin size={13} /> Kyoto, at first light</span>
                </div>
                <ul className="lxjt-hl__list">
                  {HIGHLIGHTS.map((h, i) => (
                    <li key={h} className="lxjt-hl__item lx2i-reveal" style={{ '--d': `${(i % 3) * 0.07}s` }}>
                      <span className="lxjt-hl__mark" aria-hidden="true">&#10022;</span>
                      <p>{h}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* ============ ROUTE ============ */}
          <section className="lxjt-route" id="route">
            <div className="lx2i-container">
              <div className="lxjt-head lxjt-head--center lx2i-reveal">
                <span className="lx2i-eyebrow">// 7 NIGHTS, IN A SMALL GROUP</span>
                <h2 className="lx2i-h2">Your <strong>route</strong></h2>
                <p className="lxjt-lead">Tokyo to Osaka: five cities, one seamless journey by coach.</p>
              </div>
              <ol className="lxjt-route__list">
                {ROUTE.map((r, i) => (
                  <li key={r.city} className="lxjt-stop lx2i-reveal" style={{ '--d': `${i * 0.06}s` }}>
                    <div className="lxjt-stop__marker">
                      <div className="lxjt-stop__photo" style={{ backgroundImage: `url(${sizedUnsplash(r.image, 400)})` }} role="img" aria-label={`${r.city}, Japan`} />
                      <span className="lxjt-stop__num">{i + 1}</span>
                    </div>
                    {i < ROUTE.length - 1 && <span className="lxjt-stop__line" aria-hidden="true" />}
                    <div className="lxjt-stop__body">
                      <span className="lxjt-stop__nights">{r.nights}</span>
                      <h3>{r.city}</h3>
                      <p>{r.note}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* ============ DAY BY DAY — itinerary (left) + sticky picture (right) ============ */}
          <section className="lxjt-section lxjt2-itin" id="itinerary">
            <div className="lx2i-container">
              <div className="lxjt-head lxjt-head--center lx2i-reveal">
                <span className="lx2i-eyebrow">// THE FULL PICTURE, DAY BY DAY</span>
                <h2 className="lx2i-h2">Day by <strong>day</strong></h2>
                <p className="lxjt-lead">Eight unhurried days — hover or tap any day to see its hotel, meals and sights beside you.</p>
              </div>

              <div className="lxjt2-split lx2i-reveal">
                {/* LEFT — the itinerary timeline */}
                <ol className="lxjt2-days" onMouseLeave={() => { /* keep last-hovered day */ }}>
                  {ITINERARY.map((d, i) => {
                    const active = activeDay === i;
                    const open = openDay === i;
                    return (
                      <li key={d.day} className={`lxjt2-day ${active ? 'is-active' : ''} ${open ? 'is-open' : ''}`}>
                        <button
                          type="button"
                          className="lxjt2-day__btn"
                          onMouseEnter={() => setActiveDay(i)}
                          onFocus={() => setActiveDay(i)}
                          onClick={() => { setActiveDay(i); setOpenDay((p) => (p === i ? -1 : i)); }}
                          aria-expanded={open}
                        >
                          <span className="lxjt2-day__rail" aria-hidden="true">
                            <span className="lxjt2-day__node">{String(i + 1).padStart(2, '0')}</span>
                          </span>
                          <span className="lxjt2-day__content">
                            <span className="lxjt2-day__kicker">{d.day} <span className="lxjt2-day__place"><MapPin size={11} /> {d.place}</span></span>
                            <span className="lxjt2-day__title">{d.title}</span>
                            {/* desktop shows this on the picture; mobile expands it as an accordion */}
                            <span className="lxjt2-day__body"><span className="lxjt2-day__bodyin">
                              {d.body}
                              <span className="lxjt4-mdetails">
                                <span className="lxjt4-mfact"><Hotel size={13} /> <span>{d.hotel}{d.stars > 0 && <span className="lxjt4-mstars">{'★'.repeat(d.stars)}</span>}{d.ryokan && <span className="lxjt4-tag">Ryokan</span>}</span></span>
                                <span className="lxjt4-mfact"><BedDouble size={13} /> <span>{d.room}</span></span>
                                <span className="lxjt4-mfact"><Car size={13} /> <span>{d.transfer}</span></span>
                                <span className="lxjt4-mfact"><Utensils size={13} /> <span>{d.meals}</span></span>
                              </span>
                              <span className="lxjt4-macts">
                                {d.acts.map((a) => <span key={a} className="lxjt4-mact"><MapPin size={11} /> {a}</span>)}
                              </span>
                            </span></span>
                          </span>
                          <span className="lxjt2-day__go" aria-hidden="true"><ArrowRight size={16} /></span>
                          <span className="lxjt2-day__chev" aria-hidden="true"><ChevronDown size={18} /></span>
                        </button>
                      </li>
                    );
                  })}
                </ol>

                {/* RIGHT — sticky picture card + a separate day-details card */}
                <aside className="lxjt2-media lxjt4-side" aria-live="polite">
                  <div className="lxjt2-media__sticky lxjt4-sticky">
                    {/* picture card */}
                    <div className="lxjt2-media__frame lxjt4-imgcard">
                      {ITINERARY.map((d, i) => (
                        <div
                          key={d.day}
                          className={`lxjt2-media__img ${activeDay === i ? 'is-on' : ''}`}
                          style={{ backgroundImage: `url(${sizedUnsplash(d.img, 1100)})` }}
                          role="img"
                          aria-label={d.cap}
                          aria-hidden={activeDay !== i}
                        />
                      ))}
                      <div className="lxjt2-media__veil" aria-hidden="true" />
                      <span className="lxjt2-media__count">{String(activeDay + 1).padStart(2, '0')} <i>/ {String(ITINERARY.length).padStart(2, '0')}</i></span>
                      <div className="lxjt4-imgcap" key={`c${activeDay}`}>
                        <span className="lxjt2-media__daylbl">{day.day} · {day.place}</span>
                        <h3>{day.title}</h3>
                      </div>
                    </div>

                    {/* details card */}
                    <div className="lxjt4-detail" key={`d${activeDay}`}>
                      <p className="lxjt4-detail__desc">{day.body}</p>
                      <div className="lxjt4-detail__rows">
                        <div className="lxjt4-drow">
                          <span className="lxjt4-drow__ic"><Hotel size={16} strokeWidth={1.9} /></span>
                          <div className="lxjt4-drow__tx">
                            <span className="lxjt4-drow__lbl">Hotel</span>
                            <span className="lxjt4-drow__val">
                              {day.hotel}
                              {day.stars > 0 && (
                                <span className="lxjt4-stars" aria-label={`${day.stars}-star`}>
                                  {[...Array(day.stars)].map((_, s) => <Star key={s} size={12} fill="currentColor" />)}
                                </span>
                              )}
                              {day.ryokan && <span className="lxjt4-tag">Ryokan</span>}
                            </span>
                          </div>
                        </div>
                        <div className="lxjt4-drow">
                          <span className="lxjt4-drow__ic"><BedDouble size={16} strokeWidth={1.9} /></span>
                          <div className="lxjt4-drow__tx">
                            <span className="lxjt4-drow__lbl">Room</span>
                            <span className="lxjt4-drow__val">{day.room}</span>
                          </div>
                        </div>
                        <div className="lxjt4-drow">
                          <span className="lxjt4-drow__ic"><Car size={16} strokeWidth={1.9} /></span>
                          <div className="lxjt4-drow__tx">
                            <span className="lxjt4-drow__lbl">Transfers</span>
                            <span className="lxjt4-drow__val">{day.transfer}</span>
                          </div>
                        </div>
                        <div className="lxjt4-drow">
                          <span className="lxjt4-drow__ic"><Utensils size={16} strokeWidth={1.9} /></span>
                          <div className="lxjt4-drow__tx">
                            <span className="lxjt4-drow__lbl">Meals</span>
                            <span className="lxjt4-drow__val">{day.meals}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="lxjt2-media__dots" role="tablist" aria-label="Jump to a day">
                      {ITINERARY.map((d, i) => (
                        <button
                          key={d.day}
                          type="button"
                          role="tab"
                          aria-selected={activeDay === i}
                          aria-label={`${d.day}: ${d.title}`}
                          className={`lxjt2-media__dot ${activeDay === i ? 'is-on' : ''}`}
                          onClick={() => setActiveDay(i)}
                        />
                      ))}
                    </div>
                  </div>
                </aside>
              </div>

              {/* MOBILE ONLY — the journey in pictures, as a horizontal city carousel */}
              <div className="lxjt2-rail" role="group" aria-label="The journey in pictures">
                {ITINERARY.map((d) => (
                  <div key={d.day} className="lxjt2-railcard" style={{ backgroundImage: `url(${sizedUnsplash(d.img, 640)})` }}>
                    <span className="lxjt2-railcard__day">{d.day}</span>
                    <span className="lxjt2-railcard__city"><MapPin size={13} /> {d.place}</span>
                  </div>
                ))}
              </div>

              <p className="lxjt2-note lx2i-reveal"><Check size={15} strokeWidth={2.4} /> Everything above is included in your price — stays, meals, guiding and transfers.</p>
            </div>
          </section>

          {/* ============ INCLUDED / NOT INCLUDED ============ */}
          <section className="lxjt-incl" id="included">
            <div className="lx2i-container lxjt-incl__grid">
              <div className="lxjt-incl__col lx2i-reveal">
                <span className="lx2i-eyebrow">// INCLUDED, PRIVATELY</span>
                <h3 className="lxjt-incl__h">Everything taken care of</h3>
                <ul className="lxjt-incl__list">
                  {INCLUDED.map((x) => (
                    <li key={x}><span className="lxjt-incl__tick"><Check size={13} strokeWidth={2.6} /></span>{x}</li>
                  ))}
                </ul>
              </div>
              <div className="lxjt-incl__col lxjt-incl__col--muted lx2i-reveal" style={{ '--d': '.08s' }}>
                <span className="lx2i-eyebrow">// GOOD TO KNOW</span>
                <h3 className="lxjt-incl__h">What&rsquo;s not included</h3>
                <ul className="lxjt-incl__list lxjt-incl__list--exc">
                  {NOT_INCLUDED.map((x) => (
                    <li key={x}><span className="lxjt-incl__dash" aria-hidden="true">&ndash;</span>{x}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* ============ YOUR DATES / BOOK ============

               Same design language as before — centred head, beige
               confidence band, one white card walking numbered steps, all
               of it lifted from /tour-detail-thailand-2. The CONTENT is now
               a private journey's rather than a group tour's.

               Two steps, not three. Thailand's third step is "choose how to
               pay", which it can ask because it takes the payment. This card
               cannot: the journey is priced by hand from the brief. Asking
               "20% deposit or pay in full?" against a price that does not
               exist yet was theatre, so the card asks only what it can act
               on — when, and who — and hands the rest to the drawer.
               ============================================================ */}
          <section className="lxjt-book lxjt5-book" id="dates">
            <div className="lx2i-container lxjt5-book__wrap">
              <div className="lxjt-head lxjt-head--center lx2i-reveal">
                <span className="lx2i-eyebrow">// PRIVATE JOURNEY · YOUR DATES</span>
                <h2 className="lx2i-h2">Travel on <strong>your</strong> dates</h2>
                <p className="lxjt5-book__lede">
                  This journey is private, so there is no coach to fill and no group to join &mdash; it runs when
                  you want it to. Pick a day, tell us who&rsquo;s coming, and a Japan specialist prices it by hand.
                </p>
              </div>

              <ul className="lxjt5-book__perks lx2i-reveal">
                <li><Check size={16} strokeWidth={2.4} /> Just your party &mdash; your own guide, your own car, no strangers</li>
                <li><Check size={16} strokeWidth={2.4} /> Any day of the year, at whatever pace suits you</li>
                <li><Check size={16} strokeWidth={2.4} /> Flights, visa, stays, meals and transfers &mdash; in or out, your call</li>
              </ul>

              {/* The reassurance that actually applies to an enquiry */}
              <div className="lxjt5-conf lx2i-reveal">
                <span className="lxjt5-conf__ic"><ShieldCheck size={22} strokeWidth={2} /></span>
                <div className="lxjt5-conf__tx">
                  <h3>Priced by a person, not a price engine</h3>
                  <p>
                    Nothing is charged to ask. A Japan specialist builds the itinerary around your date and your
                    party, and you can talk the whole thing through before a single rupee moves.
                  </p>
                </div>
              </div>

              <div className="lxjt5-bcard lx2i-reveal">
                <div className="lxjt5-bcard__col">
                  <div className="lxjt5-bstep">
                    <span className="lxjt5-bstep__n">1</span>
                    <h3 className="lxjt5-bstep__t">Pick your start date</h3>
                  </div>

                  <PrivateCalendar
                    value={startDate}
                    onChange={setStartDate}
                    minDate={minDate}
                    maxDate={maxDate}
                  />

                  {/* What they chose, echoed back in the card language the rest
                      of the page speaks — and what it means, which on a Japan
                      trip is the whole point of choosing a date at all. */}
                  {picked ? (
                    <div className="lxjt5-picked">
                      <span className="lxjt5-picked__ic" aria-hidden="true"><Check size={14} strokeWidth={3} /></span>
                      <span className="lxjt5-picked__tx">
                        <strong>{longDate(picked)}</strong>
                        <small>{TRIP_DAYS} days &middot; home on {longDate(homeOn)}</small>
                      </span>
                      <span className={`lxjt5-picked__season ${season.peak ? 'is-peak' : ''}`}>{season.label}</span>
                    </div>
                  ) : (
                    <p className="lxjt5-cal__empty">
                      Pick any day above. There are no set departures to choose between &mdash; the journey runs on your date.
                    </p>
                  )}

                  {picked && <p className="lxjt5-cal__season">{season.note}</p>}

                  <p className="lxjt5-cal__lead">
                    <Clock size={13} strokeWidth={2} />
                    A private journey takes about three weeks to build, so the earliest we can set off is {longDate(minDate)}.
                  </p>
                </div>

                <div className="lxjt5-bcard__col">
                  <div className="lxjt5-bstep">
                    <span className="lxjt5-bstep__n">2</span>
                    <h3 className="lxjt5-bstep__t">Who&rsquo;s travelling?</h3>
                  </div>
                  <div className="lxjt5-travs">
                    <div className="lxjt5-travrow">
                      <span className="lxjt5-travrow__lbl">Adults <small>12 and over</small></span>
                      <div className="lxjt-stepper">
                        <button type="button" aria-label="Fewer adults" onClick={() => setTravellers((n) => Math.max(1, n - 1))} disabled={travellers <= 1}><Minus size={15} /></button>
                        <span className="lxjt-stepper__val">{travellers}</span>
                        <button type="button" aria-label="More adults" onClick={() => setTravellers((n) => Math.min(20, n + 1))} disabled={travellers >= 20}><Plus size={15} /></button>
                      </div>
                    </div>
                    <div className="lxjt5-travrow">
                      <span className="lxjt5-travrow__lbl">Children <small>2&ndash;11 years</small></span>
                      <div className="lxjt-stepper">
                        <button type="button" aria-label="Fewer children" onClick={() => qSet('children')(Math.max(0, q.children - 1))} disabled={q.children <= 0}><Minus size={15} /></button>
                        <span className="lxjt-stepper__val">{q.children}</span>
                        <button type="button" aria-label="More children" onClick={() => qSet('children')(Math.min(10, q.children + 1))} disabled={q.children >= 10}><Plus size={15} /></button>
                      </div>
                    </div>
                  </div>

                  {/* The price anchor. A from-figure is the only number this
                      card can honestly show, so it shows that and says plainly
                      where the real one comes from. */}
                  <div className="lxjt5-anchor">
                    <span className="lxjt5-anchor__frm">
                      Private journeys from <strong>{inr(PRICE)}</strong> <small>per person</small>
                    </span>
                    <p className="lxjt5-anchor__note">
                      There is no shelf price for a private trip. Yours is built from the date, the party and what
                      you want included &mdash; it takes about a minute to ask, and nothing is charged for it.
                    </p>
                  </div>

                  <div className="lxjt5-bcard__go">
                    <button type="button" className="lxjt5-cta" onClick={openQuote} disabled={!picked}>
                      {quoteRef
                        ? <><FileText size={17} /> View your quote &middot; {quoteRef}</>
                        : <><FileText size={17} /> Get my tailor-made quote <ArrowRight size={17} /></>}
                    </button>
                    {/* A disabled button that doesn't say why is a dead end. */}
                    {!picked && <p className="lxjt5-cta__why">Pick a start date and we can price it.</p>}
                    <p className="lxjt5-secure">
                      <Lock size={14} /> {quoteRef
                        ? `Held until ${validUntil} · nothing charged yet`
                        : 'About a minute to fill in · priced in 15 seconds · no payment'}
                    </p>
                    <a href={PHONE_TEL} className="lxjt-card__talk">Prefer to talk? Call a curator, free <ArrowRight size={14} /></a>
                  </div>
                </div>
              </div>

              <ul className="lxjt-safety lxjt5-safety lx2i-reveal" aria-label="How your enquiry is protected">
                {SAFETY.map(({ icon: Icon, label, note }) => (
                  <li key={label} className="lxjt-safety__item">
                    <span className="lxjt-safety__ic"><Icon size={17} strokeWidth={1.8} /></span>
                    <span className="lxjt-safety__txt"><strong>{label}</strong><small>{note}</small></span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* ============ POLICIES (3 toggleable categories, summary + full modal) ============ */}
          <section className="lxjt-terms lxjt3-policies" id="terms">
            <div className="lx2i-container">
              <div className="lxjt-head lx2i-reveal">
                <span className="lx2i-eyebrow">// BEFORE YOU BOOK</span>
                <h2 className="lx2i-h2">The <strong>policies</strong></h2>
                <p className="lxjt-lead">Booking, cancellation and the full terms &mdash; pick a section, skim the essentials, and open the full detail whenever you need it.</p>
              </div>

              {/* the 3 categories, toggleable */}
              <div className="lxjt3-tabs lx2i-reveal" role="tablist" aria-label="Policy category">
                {TERM_CATS.map((c) => (
                  <button key={c.id} type="button" role="tab" aria-selected={termsTab === c.id}
                    className={`lxjt3-tab ${termsTab === c.id ? 'is-on' : ''}`}
                    onClick={() => setTermsTab(c.id)}>
                    <c.icon size={17} strokeWidth={1.9} aria-hidden="true" />
                    <span>{c.label}</span>
                    <small>{TERM_GROUPS[c.id].length}</small>
                  </button>
                ))}
              </div>

              {/* a few headline points for the active category (3 across, or 4 in 2 rows) */}
              <div className={`lxjt3-hgrid lxjt3-hgrid--n${TERM_HIGHLIGHTS[termsTab].length}`} key={termsTab}>
                {TERM_HIGHLIGHTS[termsTab].map((h) => (
                  <div key={h.title} className="lxjt-term">
                    <span className="lxjt-term__ic"><h.icon size={20} strokeWidth={1.7} /></span>
                    <div className="lxjt-term__txt">
                      <strong>{h.title}</strong>
                      <p>{h.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button type="button" className="lx2i-btn lx2i-btn--outline lxjt-terms__more" onClick={() => setTermsModalOpen(true)}>
                Read the full {activeCat.label} <ArrowRight size={15} />
              </button>
            </div>
          </section>

          {/* ============ REVIEWS (photo collage + quote, one at a time) ============ */}
          <section className="h26-reviews" id="reviews">
            <div className="h26-head">
              <p className="h26-label lx2i-reveal">Travelled, and came back happy</p>
              <h2 className="h26-h2 lx2i-reveal">Travellers who trusted us with Japan.</h2>
              <p className="hi-rev-sub lx2i-reveal">Couples and honeymooners, multi-generational families, friends and solo explorers.</p>
            </div>

            {/* Independent-rating trust strip: overall score + Google / Tripadvisor */}
            <div className="hi-rtrust lx2i-reveal">
              <div className="hi-rtrust-overall">
                <strong>4.9</strong>
                <div className="hi-rtrust-overall-meta">
                  <span className="hi-rtrust-stars" aria-hidden="true">
                    {Array.from({ length: 5 }).map((_, k) => <Star key={k} size={15} fill="currentColor" />)}
                  </span>
                  <span className="hi-rtrust-sub">Excellent · 2,400+ verified reviews</span>
                </div>
              </div>
              <span className="hi-rtrust-div" aria-hidden="true" />
              <div className="hi-rtrust-platforms">
                <span className="hi-rtrust-plat">
                  <GoogleG />
                  <span><strong>4.8</strong> on <b>Google</b></span>
                </span>
                <span className="hi-rtrust-plat">
                  <TripAdvisorOwl />
                  <span><strong>4.9</strong> on <b>Tripadvisor</b></span>
                </span>
              </div>
            </div>

            <div className="h26-marquee">
              <div className="h26-marquee-track">
                {[...REVIEWS, ...REVIEWS].map((r, i) => (
                  <article className="h26-rev" key={i}>
                    <div className="h26-rev-photo">
                      <img src={sizedUnsplash(r.tripPhoto, 600)} alt={r.tour} loading="lazy" />
                      <span className="h26-rev-tour">{r.tour}</span>
                    </div>
                    <div className="h26-rev-content">
                      <div className="h26-rev-stars">
                        {Array.from({ length: r.rating }).map((_, k) => <Star key={k} size={14} fill="currentColor" />)}
                      </div>
                      <p>"{r.text}"</p>
                      <div className="h26-rev-who">
                        <img src={sizedUnsplash(r.avatar, 120)} alt="" loading="lazy" />
                        <span>
                          <strong>{r.name}</strong>
                          <em>{r.location}</em>
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
            <div className="h26-reviews-more lx2i-reveal">
              <Link to="/#reviews" className="h26-btn h26-btn-pill">View all reviews <ArrowUpRight size={16} /></Link>
            </div>
          </section>

          {/* ============ PEOPLE ALSO VIEW ============ */}
          <section className="lxjt-section lxjt-similar">
            <div className="lx2i-container">
              <div className="lxjt-head lxjt-head--row lx2i-reveal">
                <div>
                  <span className="lx2i-eyebrow">// TRAVELLERS ALSO CONSIDERED</span>
                  <h2 className="lx2i-h2">People also <strong>view</strong></h2>
                </div>
                <a href={`${HOME}#curated`} className="lxjt-textlink">Browse all journeys <ArrowUpRight size={16} /></a>
              </div>
              <div className="lxjt-sim__grid">
                {SIMILAR.map((s, i) => (
                  <a key={s.title} href={`${HOME}#curated`} className="lxjt-sim lx2i-reveal" style={{ '--d': `${(i % 4) * 0.06}s` }}>
                    <div className="lxjt-sim__img" style={{ backgroundImage: `url(${sizedUnsplash(s.image, 700)})` }}>
                      <span className="lxjt-sim__region"><MapPin size={12} /> {s.region}</span>
                      <span className="lxjt-sim__season">{s.season}</span>
                    </div>
                    <div className="lxjt-sim__body">
                      <h3>{s.title}</h3>
                      <div className="lxjt-sim__meta"><Clock size={12} /> {s.nights}<span className="lxjt-sim__dot">&middot;</span><Users size={12} /> Small group</div>
                      <div className="lxjt-sim__tags">
                        {s.tags.map((t) => <span key={t} className="lxjt-sim__tag">{t}</span>)}
                      </div>
                      <div className="lxjt-sim__foot">
                        <span className="lxjt-sim__price">from {s.priceFrom} <small>pp</small></span>
                        <span className="lxjt-sim__go">View <ArrowRight size={15} /></span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* ============ FINAL CTA (reuses homepage lx2i-cta) ============ */}
          <section className="lx2i-cta">
            <div className="lx2i-cta__bg" style={{ backgroundImage: `url(${sizedUnsplash('1522383225653-ed111181a951', 1800)})` }} />
            <div className="lx2i-cta__veil" />
            <div className="lx2i-container lx2i-cta__inner lx2i-reveal">
              <span className="lx2i-eyebrow lx2i-eyebrow--light">BEGIN YOUR JAPAN JOURNEY</span>
              <h2 className="lx2i-cta__title">Eight days in Japan,<br /><strong>every detail already handled.</strong></h2>
              <p className="lx2i-cta__sub">Set 2026 departures, a small group and an expert guide &mdash; and a curator who handles the visas, the ryokan, the rail and the reservations, so you can simply be there.</p>
              <div className="lx2i-cta__actions">
                <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="lx2i-btn lx2i-btn--secondary lx2i-btn--lg"><MessageCircle size={17} /> WhatsApp us</a>
                <button type="button" onClick={openCallback} className="lx2i-btn lx2i-btn--glass lx2i-btn--lg"><PhoneCall size={16} /> Schedule a callback</button>
              </div>
              <p className="lx2i-cta__hours">Travel experts available 9am–9pm IST, every day</p>
            </div>
          </section>

          {/* ============ FOOTER (the /new3 footer, verbatim) ============
               Same wrapper as the header: .h26 carries the colour tokens the
               footer's rules resolve against, `new-typo n3` the type and the
               gutter. In-page anchors are rebased onto HOME for the same reason
               as the nav's — #heritage and #press live on the homepage. */}
          <div className="h26 new-typo n3">
            <footer className="h26-footer">
              <div className="h26-footer-top">
                <div className="h26-footer-brand">
                  <img src="/cox-logo-new.png" alt="Cox & Kings" />
                  <p>The world&apos;s most experienced travel company. Established 1758.</p>
                  <div className="h26-footer-contact">
                    <a href={PHONE_TEL}><Phone size={15} /> {PHONE_DISPLAY}</a>
                    <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                  </div>
                </div>
                <div className="h26-footer-cols">
                  <div>
                    <h4>Travel</h4>
                    <Link to="/journeys4">Group tours</Link>
                    <Link to={CALLBACK}>Bespoke holidays</Link>
                    <Link to="/journeys4">Luxury journeys</Link>
                    <Link to="/journeys4">Destinations</Link>
                  </div>
                  <div>
                    <h4>Company</h4>
                    <Link to="/about-us2">Our story</Link>
                    <Link to="/about-us2">Specialists</Link>
                    <Link to={CALLBACK}>Contact</Link>
                    <a href={`${HOME}#heritage`}>Why Cox &amp; Kings</a>
                  </div>
                  <div>
                    <h4>Assurance</h4>
                    <a href={`${HOME}#heritage`}>Trust &amp; safety</a>
                    <a href="#reviews" onClick={navClick('#reviews')}>Reviews</a>
                    <Link to={CALLBACK}>Refund policy</Link>
                    <Link to={CALLBACK}>Speak to an expert</Link>
                  </div>
                </div>
              </div>
              <div className="h26-footer-bottom">
                <span>© {new Date().getFullYear()} Cox &amp; Kings. Travelling the world since 1758.</span>
                <span className="h26-footer-assoc">IATA · TAAI · ASTA</span>
              </div>
            </footer>
          </div>
        </main>

        {/* ============ MOBILE THUMB-REACH BAR ============
             Floating dark-glass bar, matching the /new3 homepage. The quote is
             the primary action and carries the label; WhatsApp is the secondary
             and needs no label — the glyph is the whole message. */}
        <div className="lxjt5-tbar">
          <button type="button" className="lxjt5-tbar__cta" onClick={openQuote}>
            <FileText size={17} /> Get a free quote
          </button>
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="lxjt5-tbar__wa"
            aria-label="Chat with a specialist on WhatsApp"
          >
            <WaIcon size={23} />
          </a>
        </div>

        {/* ============ FLOATING QUOTE CTA (desktop) ============
             The /tour-detail-thailand-2 book-now button. Below 680px the
             thumb-bar carries this action; above it, nothing did once the hero
             was gone. Scrolls to the booking card rather than opening the quote
             dialog outright — the dialog cannot price a journey without a start
             date, and the card is where that date gets picked. */}
        <a
          href="#dates"
          onClick={navClick('#dates')}
          className={`lxjt5-bookfab ${chatOpen || !pastHero ? 'is-hidden' : ''}`}
          aria-hidden={chatOpen || !pastHero}
          tabIndex={chatOpen || !pastHero ? -1 : undefined}
        >
          <Calendar size={17} strokeWidth={2} />
          <span>Get a quote</span>
          <span className="lxjt5-bookfab__px">from {inr(PRICE)} pp</span>
        </a>

        {/* ============ FLOATING AI BUTTON (desktop) ============ */}
        <button className={`lx2i-aifab ${chatOpen ? 'is-hidden' : ''}`} aria-label="Open Enaya, the AI travel assistant" onClick={() => setChatOpen(true)}>
          <Sparkles size={20} /><span>Ask Enaya</span>
        </button>

        {/* ============ FULL POLICY DETAIL MODAL (active category) ============ */}
        {termsModalOpen && (
          <div className="lxjt-tc" role="dialog" aria-modal="true" aria-label={`${activeCat.label} — full detail`}>
            <div className="lxjt-tc__scrim" onClick={() => setTermsModalOpen(false)} />
            <div className="lxjt-tc__panel">
              <div className="lxjt-tc__head">
                <div>
                  <span className="lx2i-eyebrow">{activeCat.label}</span>
                  <h3 className="lxjt-tc__title">{activeCat.label} — Essence Japan with Hakone</h3>
                </div>
                <button className="lxjt-tc__close" aria-label="Close" onClick={() => setTermsModalOpen(false)}><X size={20} /></button>
              </div>
              <div className="lxjt-tc__body lxjt3-tcbody">
                {TERM_GROUPS[termsTab].map((g) => (
                  <div key={g.id} className="lxjt-tc__sec">
                    <h4>{g.heading}</h4>
                    {g.tiers && <TermTiers tiers={g.tiers} />}
                    {g.points && g.points.length > 0 && (
                      <ul className="lxjt3-pts">
                        {g.points.map((p, i) => <TermPoint key={i} point={p} />)}
                      </ul>
                    )}
                    {g.note && <p className="lxjt3-note2"><AlertTriangle size={14} strokeWidth={2} /> {g.note}</p>}
                  </div>
                ))}
                <p className="lxjt-tc__note">These are the Cox &amp; Kings booking conditions for this departure. Full contractual terms are provided with your booking confirmation.</p>
              </div>
              <div className="lxjt-tc__foot">
                <button type="button" className="lx2i-btn lx2i-btn--primary" onClick={() => setTermsModalOpen(false)}>Got it</button>
                <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="lx2i-btn lx2i-btn--outline"><MessageCircle size={15} /> Ask a question</a>
              </div>
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
                  <h3>We&rsquo;ll call you shortly</h3>
                  <p>A travel expert will be in touch &mdash; usually within a few hours, between 9am and 9pm IST. Prefer to talk now?</p>
                  <div className="lx2i-cb__nowrow">
                    <a href={PHONE_TEL} className="lx2i-btn lx2i-btn--primary"><Phone size={14} /> {PHONE_DISPLAY}</a>
                    <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="lx2i-btn lx2i-btn--outline"><MessageCircle size={14} /> WhatsApp</a>
                  </div>
                </div>
              ) : (
                <>
                  <span className="lx2i-eyebrow">SPEAK TO A HUMAN</span>
                  <h3 className="lx2i-cb__title">Request a callback</h3>
                  <p className="lx2i-cb__sub">Leave your number and a real travel designer &mdash; not a call centre &mdash; will call you back. No obligation.</p>
                  <form className="lx2i-cb__form" onSubmit={(e) => { e.preventDefault(); setCallbackSent(true); }}>
                    <label className="lx2i-cb__field"><span>Your name</span><input type="text" name="name" autoComplete="name" placeholder="e.g. Priya Sharma" required /></label>
                    <label className="lx2i-cb__field"><span>Phone number</span><input type="tel" name="phone" autoComplete="tel" inputMode="tel" placeholder="+91  XXXXX XXXXX" required /></label>
                    <label className="lx2i-cb__field"><span>Best time to call</span>
                      <select name="time" defaultValue="">
                        <option value="" disabled hidden>Choose a time</option>
                        <option>Morning (9am–12pm)</option>
                        <option>Afternoon (12pm–5pm)</option>
                        <option>Evening (5pm–9pm)</option>
                        <option>Anytime is fine</option>
                      </select>
                    </label>
                    <button type="submit" className="lx2i-btn lx2i-btn--primary lx2i-btn--lg lx2i-cb__submit"><PhoneCall size={15} /> Request my callback</button>
                    <p className="lx2i-cb__or">Or call now &mdash; <a href={PHONE_TEL}>{PHONE_DISPLAY}</a></p>
                  </form>
                </>
              )}
            </div>
          </div>
        )}

        {/* ============ QUOTE DRAWER ============

            The /tour-detail-thailand-2 drawer design: a right-edge panel
            rather than a centred modal, with a pinned head, a scrolling
            middle and a pinned foot — so the action never scrolls out of
            reach however long the form (or the quote) runs.

            The content is japan-5's five-stage quote flow, unchanged:
            details → the 15-second pricing wait → the quote → book the call
            → booked. Each stage fills the same three slots.
            ============================================================ */}
        {quoteOpen && (
          <div className="lxjt5-qd" role="dialog" aria-modal="true" aria-label={QUOTE_STAGE_LABEL[qStage]}>
            <div className="lxjt5-qd__scrim" onClick={() => setQuoteOpen(false)} />
            <aside className="lxjt5-qd__panel" ref={quotePanelRef}>
              <button className="lxjt5-qd__close" aria-label="Close" onClick={() => setQuoteOpen(false)}><X size={18} /></button>

              {/* ---------- 1 · DETAILS ---------- */}
              {qStage === 'details' && (
                <form className="lxjt5-qd__form" onSubmit={(e) => { e.preventDefault(); setQStage('pricing'); }}>
                  <header className="lxjt5-qd__head">
                    <span className="lx2i-eyebrow">// PRIVATE DEPARTURE · STEP 1 OF 3</span>
                    <h3 className="lxjt5-qd__title">Tell us who&rsquo;s travelling</h3>
                    <p className="lxjt5-qd__sub">
                      This journey is private and tailor-made, so the price follows the party &mdash; who&rsquo;s coming, how you want the rooms,
                      and what you want included. Answer these and we&rsquo;ll price it while you wait. No payment at this step.
                    </p>
                  </header>

                  <div className="lxjt5-qd__body">
                    {/* ---- When ----
                        The card's calendar already asks this, and normally the
                        answer arrives here already filled in. But the mobile
                        bottom bar opens this drawer straight from anywhere on
                        the page, so the drawer cannot assume a date exists —
                        it has to be able to ask for one itself. Same state, so
                        the two controls can never disagree. */}
                    <fieldset className="lxjt5-q__set">
                      <legend>When you&rsquo;d like to go</legend>
                      <label className="lx2i-cb__field">
                        <span>Start date <small>{TRIP_DAYS} days, {TRIP_DAYS - 1} nights</small></span>
                        <input
                          type="date"
                          required
                          min={toISO(minDate)}
                          max={toISO(maxDate)}
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                        />
                      </label>
                      {picked && (
                        <p className="lxjt5-q__ctx">
                          <Calendar size={14} strokeWidth={2} />
                          <span>
                            <strong>{season.label}</strong> &middot; home on {longDate(homeOn)} &middot; from {inr(PRICE)} pp
                          </span>
                        </p>
                      )}
                    </fieldset>

                    {/* ---- Lead traveller ---- */}
                    <fieldset className="lxjt5-q__set">
                      <legend>Lead traveller</legend>
                      <div className="lxjt5-q__row lxjt5-q__row--name">
                        <label className="lx2i-cb__field">
                          <span>Title</span>
                          <select value={q.prefix} onChange={(e) => qSet('prefix')(e.target.value)}>
                            {['Mr', 'Mrs', 'Ms', 'Mx', 'Dr', 'Prof'].map((p) => <option key={p}>{p}</option>)}
                          </select>
                        </label>
                        <label className="lx2i-cb__field">
                          <span>First name</span>
                          <input type="text" autoComplete="given-name" placeholder="e.g. Priya" required
                            value={q.first} onChange={(e) => qSet('first')(e.target.value)} />
                        </label>
                        <label className="lx2i-cb__field">
                          <span>Last name</span>
                          <input type="text" autoComplete="family-name" placeholder="e.g. Sharma" required
                            value={q.last} onChange={(e) => qSet('last')(e.target.value)} />
                        </label>
                      </div>
                      <div className="lxjt5-q__row lxjt5-q__row--2">
                        <label className="lx2i-cb__field">
                          <span>Email &mdash; we send the quote here</span>
                          <input type="email" autoComplete="email" inputMode="email" placeholder="priya@example.com" required
                            value={q.email} onChange={(e) => qSet('email')(e.target.value)} />
                        </label>
                        <label className="lx2i-cb__field">
                          <span>Phone</span>
                          <input type="tel" autoComplete="tel" inputMode="tel" placeholder="+91  XXXXX XXXXX" required
                            value={q.phone} onChange={(e) => qSet('phone')(e.target.value)} />
                        </label>
                      </div>
                    </fieldset>

                    {/* ---- The party ---- */}
                    <fieldset className="lxjt5-q__set">
                      <legend>Who&rsquo;s coming</legend>
                      <div className="lxjt5-q__row lxjt5-q__row--2">
                        <QStep label="Adults" hint="12 and over" value={travellers} onChange={setTravellers} min={1} max={20} />
                        <QStep label="Children" hint="2–11 years" value={q.children} onChange={qSet('children')} min={0} max={10} />
                      </div>
                      <div className="lxjt5-q__togs">
                        <QToggle icon={Baby} label="Baby on board" hint="Under 2 — we'll arrange a cot and a bassinet seat"
                          checked={q.infant} onChange={qSet('infant')} />
                        <QToggle icon={Accessibility} label="Senior citizens travelling" hint="We'll pace the days and flag step-free rooms"
                          checked={q.seniors} onChange={qSet('seniors')} />
                      </div>
                    </fieldset>

                    {/* ---- Rooms & beds ---- */}
                    <fieldset className="lxjt5-q__set">
                      <legend>Rooms &amp; beds</legend>
                      <div className="lxjt5-q__row lxjt5-q__row--2">
                        <QStep label="Rooms" value={q.rooms} onChange={qSet('rooms')} min={1} max={10} />
                        <QStep label="Extra beds" hint="Rollaway, per room" value={q.extraBeds} onChange={qSet('extraBeds')} min={0} max={6} />
                      </div>
                      <div className="lx2i-cb__field">
                        <span>Bed preference</span>
                        <div className="lxjt5-q__seg" role="radiogroup" aria-label="Bed preference">
                          {[
                            { id: 'twin', label: 'Twin beds' },
                            { id: 'double', label: 'One double' },
                            { id: 'mix', label: 'A mix' },
                          ].map((b) => (
                            <button key={b.id} type="button" role="radio" aria-checked={q.bed === b.id}
                              className={`lxjt5-q__segbtn ${q.bed === b.id ? 'is-on' : ''}`}
                              onClick={() => qSet('bed')(b.id)}>
                              <BedDouble size={15} strokeWidth={1.8} /> {b.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </fieldset>

                    {/* ---- What the quote should cover ---- */}
                    <fieldset className="lxjt5-q__set">
                      <legend>What should the quote include?</legend>
                      <div className="lxjt5-q__togs">
                        <QToggle icon={Plane} label="Include flights" hint="Return economy from your home city"
                          checked={q.flights} onChange={qSet('flights')} />
                        <QToggle icon={Stamp} label="Include visa assistance" hint="Japan tourist visa — paperwork handled for you"
                          checked={q.visa} onChange={qSet('visa')} />
                      </div>
                    </fieldset>

                    {/* ---- Anything else ---- */}
                    <label className="lx2i-cb__field">
                      <span>Anything else we should know? <small>Optional</small></span>
                      <textarea rows={3} className="lxjt5-q__ta"
                        placeholder="Dietary needs, an anniversary, a city you'd like to add, mobility needs…"
                        value={q.comments} onChange={(e) => qSet('comments')(e.target.value)} />
                    </label>
                  </div>

                  <footer className="lxjt5-qd__foot">
                    <button type="submit" className="lxjt5-cta">
                      <FileText size={15} /> Get a Quote
                    </button>
                    <p className="lxjt5-qd__footnote">Takes about 15 seconds &middot; or talk to us on <a href={PHONE_TEL}>{PHONE_DISPLAY}</a></p>
                  </footer>
                </form>
              )}

              {/* ---------- 2 · PRICING (the ~15s wait) ----------
                  Determinate, named and cancellable. A spinner for fifteen
                  seconds reads as a hang; a bar that visibly moves through
                  work the traveller recognises as their own reads as care. */}
              {qStage === 'pricing' && (
                <div className="lxjt5-qd__form">
                  <header className="lxjt5-qd__head">
                    <span className="lx2i-eyebrow">// PRIVATE DEPARTURE · STEP 2 OF 3</span>
                    <h3 className="lxjt5-qd__title">Pricing your journey</h3>
                    <p className="lxjt5-qd__sub">
                      A private departure is priced by hand, not pulled off a shelf &mdash; it takes about 15 seconds.
                      Stay with us and you&rsquo;ll have the full quote on screen.
                    </p>
                  </header>

                  <div className="lxjt5-qd__body lxjt5-q__wait">
                    <div className="lxjt5-q__bar"
                      role="progressbar"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={pct}
                      aria-label="Pricing your journey">
                      <span className="lxjt5-q__barfill" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="lxjt5-q__pct">{pct}%<small>about {Math.max(1, Math.ceil(QUOTE_SECONDS - elapsed))}s left</small></p>

                    {/* Politeness matters: an assertive region would interrupt a
                        screen reader every few seconds for fifteen seconds. */}
                    <ul className="lxjt5-q__steps" role="status" aria-live="polite">
                      {stages.map((s) => {
                        const done = elapsed >= s.at + 3;
                        const now = !done && elapsed >= s.at;
                        return (
                          <li key={s.label} className={`lxjt5-q__step2 ${done ? 'is-done' : ''} ${now ? 'is-now' : ''}`}>
                            <span className="lxjt5-q__stepic" aria-hidden="true">
                              {done ? <Check size={13} strokeWidth={3} /> : <span className="lxjt5-q__dot" />}
                            </span>
                            {s.label}
                          </li>
                        );
                      })}
                    </ul>

                    <p className="lxjt5-q__waitnote">
                      <Lock size={13} /> Nothing is booked or charged by this. {stageLabel}.
                    </p>
                  </div>

                  {/* The way out. A wait you cannot leave is a trap, and the
                      details survive the trip back. */}
                  <footer className="lxjt5-qd__foot">
                    <button type="button" className="lx2i-btn lx2i-btn--outline lxjt5-q__cancel" onClick={() => setQStage('details')}>
                      <ArrowLeft size={14} /> Cancel and change my details
                    </button>
                  </footer>
                </div>
              )}

              {/* ---------- 3 · THE QUOTE ---------- */}
              {qStage === 'quote' && (
                <div className="lxjt5-qd__form">
                  <header className="lxjt5-qd__head">
                    <span className="lx2i-eyebrow">// QUOTE {quoteRef}</span>
                    <h3 className="lxjt5-qd__title lxjt5-q__resulth">Your quote is ready</h3>
                    <p className="lxjt5-qd__sub">
                      Priced for {q.prefix} {q.first} {q.last} &mdash; {partySummary}, departing {dateLabel}.
                      We&rsquo;ll hold these rates until <strong>{validUntil}</strong>.
                    </p>
                  </header>

                  <div className="lxjt5-qd__body">
                    <div className="lxjt5-q__lines">
                      {quote.lines.map((l) => (
                        <div key={l.label} className="lxjt5-q__line">
                          <span className="lxjt5-q__linelbl"><strong>{l.label}</strong><small>{l.note}</small></span>
                          <span className="lxjt5-q__lineamt">{inr(l.amount)}</span>
                        </div>
                      ))}
                      <div className="lxjt5-q__line lxjt5-q__line--sub">
                        <span className="lxjt5-q__linelbl"><strong>GST (5%)</strong></span>
                        <span className="lxjt5-q__lineamt">{inr(quote.gst)}</span>
                      </div>
                      <div className="lxjt5-q__line lxjt5-q__line--tot">
                        <span className="lxjt5-q__linelbl">
                          <strong>Total</strong>
                          <small>{inr(quote.perPerson)} per person, all in</small>
                        </span>
                        <span className="lxjt5-q__lineamt">{inr(quote.total)}</span>
                      </div>
                    </div>

                    {/* What is NOT in the number, said before they ask — the
                       omission is what erodes trust, not the exclusion. */}
                    <details className="lxjt5-q__excl">
                      <summary>What this price does not cover</summary>
                      <ul>{quote.excluded.map((x) => <li key={x}>{x}</li>)}</ul>
                    </details>

                    <div className="lxjt5-q__dl">
                      <button type="button" className="lx2i-btn lx2i-btn--outline" onClick={downloadQuote}>
                        <Download size={15} /> Download quote
                      </button>
                      <button type="button" className="lx2i-btn lx2i-btn--outline" onClick={downloadItinerary}>
                        <Download size={15} /> Download full itinerary
                      </button>
                    </div>
                    <p className="lxjt5-q__dlnote">Both open print-ready &mdash; save as PDF from your browser&rsquo;s print dialog.</p>
                  </div>

                  <footer className="lxjt5-qd__foot">
                    <button type="button" className="lxjt5-cta" onClick={() => setQStage('call')}>
                      <PhoneCall size={15} /> Confirm &amp; book on a call
                    </button>
                    <p className="lxjt5-qd__footnote">
                      Something not right? <button type="button" className="lxjt5-q__link" onClick={() => setQStage('details')}>Adjust the details and re-price</button>
                    </p>
                  </footer>
                </div>
              )}

              {/* ---------- 4 · BOOK THE CALL ---------- */}
              {qStage === 'call' && (
                <div className="lxjt5-qd__form">
                  <header className="lxjt5-qd__head">
                    <span className="lx2i-eyebrow">// PRIVATE DEPARTURE · STEP 3 OF 3</span>
                    <h3 className="lxjt5-qd__title">Book it on a call</h3>
                    <p className="lxjt5-qd__sub">
                      A private departure is confirmed with a person, not a checkout &mdash; so we hold quote <strong>{quoteRef}</strong>,
                      walk you through the detail, and take the deposit on the call. Tell us when suits.
                    </p>
                  </header>

                  <div className="lxjt5-qd__body">
                    <a href={PHONE_TEL} className="lx2i-btn lx2i-btn--primary lx2i-btn--lg lxjt5-q__callnow">
                      <Phone size={16} /> Call now &mdash; {PHONE_DISPLAY}
                    </a>
                    <p className="lxjt5-q__or2"><span>or have us call you</span></p>

                    <div className="lxjt5-q__slots">
                      <div className="lx2i-cb__field">
                        <span>Which day?</span>
                        <div className="lxjt5-q__seg" role="radiogroup" aria-label="Which day should we call?">
                          {[{ id: 'today', label: 'Today' }, { id: 'tomorrow', label: 'Tomorrow' }].map((d) => (
                            <button key={d.id} type="button" role="radio" aria-checked={callSlot.day === d.id}
                              className={`lxjt5-q__segbtn ${callSlot.day === d.id ? 'is-on' : ''}`}
                              onClick={() => setCallSlot((s) => ({ ...s, day: d.id }))}>
                              <Calendar size={15} strokeWidth={1.8} /> {d.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="lx2i-cb__field">
                        <span>What time? <small>IST</small></span>
                        <div className="lxjt5-q__seg lxjt5-q__seg--3" role="radiogroup" aria-label="What time should we call?">
                          {['9am–12pm', '12pm–5pm', '5pm–9pm'].map((t) => (
                            <button key={t} type="button" role="radio" aria-checked={callSlot.time === t}
                              className={`lxjt5-q__segbtn ${callSlot.time === t ? 'is-on' : ''}`}
                              onClick={() => setCallSlot((s) => ({ ...s, time: t }))}>
                              <Clock size={15} strokeWidth={1.8} /> {t}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <p className="lxjt5-q__ctx">
                      <Phone size={14} strokeWidth={2} />
                      <span>We&rsquo;ll call <strong>{q.phone}</strong> &mdash; the number you gave us.</span>
                    </p>
                  </div>

                  {/* Disabled buttons that don't say why are an anti-pattern, so
                      the reason sits next to it rather than in a tooltip. */}
                  <footer className="lxjt5-qd__foot">
                    <button type="button" className="lxjt5-cta"
                      disabled={!callSlot.time} onClick={() => setQStage('booked')}>
                      <PhoneCall size={15} /> Confirm this call
                    </button>
                    {!callSlot.time && <p className="lxjt5-q__hint">Pick a time window and we&rsquo;ll confirm it.</p>}
                    <p className="lxjt5-qd__footnote">
                      <button type="button" className="lxjt5-q__link" onClick={() => setQStage('quote')}>Back to my quote</button>
                    </p>
                  </footer>
                </div>
              )}

              {/* ---------- 5 · BOOKED ---------- */}
              {qStage === 'booked' && (
                <div className="lxjt5-qd__form">
                  <div className="lxjt5-qd__body">
                    <div className="lx2i-cb__done lxjt5-qd__done">
                      <span className="lx2i-cb__doneic"><CheckCircle2 size={34} strokeWidth={1.5} /></span>
                      <h3>Your call is booked</h3>
                      <p>
                        A travel designer will call <strong>{q.phone}</strong> {callSlot.day}, <strong>{callSlot.time}</strong>,
                        holding quote <strong>{quoteRef}</strong> at <strong>{inr(quote.total)}</strong>. They&rsquo;ll confirm the
                        detail and take the deposit on the call &mdash; nothing has been charged yet.
                      </p>
                      <div className="lxjt5-q__dl">
                        <button type="button" className="lx2i-btn lx2i-btn--outline" onClick={downloadCallInvite}>
                          <Calendar size={15} /> Add call to calendar
                        </button>
                        <button type="button" className="lx2i-btn lx2i-btn--outline" onClick={downloadQuote}>
                          <Download size={15} /> Download quote
                        </button>
                      </div>
                      <div className="lx2i-cb__nowrow">
                        <a href={PHONE_TEL} className="lx2i-btn lx2i-btn--primary"><Phone size={14} /> Call now instead</a>
                        <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="lx2i-btn lx2i-btn--outline"><MessageCircle size={14} /> WhatsApp</a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </aside>
          </div>
        )}
      </div>

      {/* AI chat (Enaya) — rendered OUTSIDE .lx2i so scoped styles can't leak in */}
      <ChatBot open={chatOpen} onOpenChange={setChatOpen} hideFab name="Enaya" />
    </>
  );
}
