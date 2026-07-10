import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Menu, X, ArrowRight, ArrowLeft, ArrowUpRight, ChevronDown,
  Star, MapPin, Calendar, Users, Plane, Check, Plus, Minus, Lock, Quote,
  ShieldCheck, Phone, MessageCircle, PhoneCall, Headset, Sparkles, Clock,
  Wallet, Repeat, Stamp, CheckCircle2, Instagram, Facebook, Youtube, Linkedin,
  Hotel, Utensils, TrainFront, Compass,
  CreditCard, FileText, AlertTriangle, RefreshCcw, Building2, UserCheck,
  HeartPulse, BedDouble, CloudLightning, Gavel, Scale, Car,
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
const PHONE_DISPLAY = '+91 85560 01700';
const PHONE_TEL = 'tel:+918556001700';
const WHATSAPP = 'https://wa.me/918556001700?text=Hi%20Cox%20%26%20Kings%2C%20I%27d%20like%20to%20plan%20the%20Essence%20Japan%20with%20Hakone%20journey.';
const EMAIL = 'holidays@coxandkings.com';
const OFFICE_SHORT = 'Fort, Mumbai 400001';
const OFFICE_FULL = 'Turner Morrison House, 16 Bank Street, Fort, Mumbai 400001';
const HOME = '/luxe2-improved';

/* Desktop nav megamenus — same shape as the /new homepage (hover flyouts),
   remapped to the sections that exist on this tour-detail page. */
const NAV_MENU = [
  {
    label: 'This tour', href: '#highlights',
    blurb: 'Everything about the Essence Japan with Hakone journey.',
    items: [
      { label: 'Highlights', desc: 'What makes this trip special', href: '#highlights' },
      { label: 'Your route', desc: 'Five cities, coast to coast', href: '#route' },
      { label: 'Day by day', desc: 'The full itinerary', href: '#itinerary' },
      { label: 'Dates & prices', desc: 'Departures and fares', href: '#dates' },
    ],
  },
  {
    label: 'Journeys', href: `${HOME}#curated`,
    blurb: 'Signature itineraries, ready to make your own.',
    items: [
      { label: 'Escorted group tours', desc: 'Expert-led, fixed departures', href: `${HOME}#curated` },
      { label: 'Tailor-made trips', desc: 'Designed entirely around you', href: `${HOME}#curated` },
      { label: 'Honeymoons & milestones', desc: 'Celebrate something special', href: `${HOME}#curated` },
      { label: 'All destinations', desc: 'Browse the full map', href: `${HOME}#destinations` },
    ],
  },
  {
    label: 'Why us', href: `${HOME}#heritage`,
    blurb: 'Specialists, not salespeople — and 260 years behind every trip.',
    items: [
      { label: 'Since 1758', desc: 'Heritage you can lean on', href: `${HOME}#heritage` },
      { label: 'Why Cox & Kings', desc: 'How we plan differently', href: `${HOME}#curated` },
      { label: 'Real reviews', desc: '640 verified travellers', href: '#reviews' },
      { label: 'Press & awards', desc: 'The press that covers us', href: `${HOME}#reviews` },
    ],
  },
  { label: 'Reviews', href: '#reviews' },
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

const DEPARTURES = [
  { date: '21 March 2026', seats: 'Only 6 seats left', tight: true },
  { date: '28 March 2026', seats: 'Filling fast · 8 seats', tight: true },
  { date: '04 April 2026', seats: '12 seats available', tight: false },
  { date: '17 October 2026', seats: '14 seats available', tight: false },
];

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

const SAFETY = [
  { icon: Wallet, label: 'Low deposit', note: 'Book from 20% today' },
  { icon: Repeat, label: 'Free changes', note: 'Up to 45 days before travel' },
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

export default function JapanTourLuxe5() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDay, setActiveDay] = useState(0);     // desktop: drives the sticky itinerary picture
  const [openDay, setOpenDay] = useState(-1);        // mobile: which day's accordion is expanded
  const [selectedDep, setSelectedDep] = useState(0);
  const [payMode, setPayMode] = useState('deposit');
  const [activeSection, setActiveSection] = useState('highlights');
  const [callbackOpen, setCallbackOpen] = useState(false);
  const [callbackSent, setCallbackSent] = useState(false);
  const [travellers, setTravellers] = useState(2);
  const [termsTab, setTermsTab] = useState('booking');       // which policy category is shown
  const [termsModalOpen, setTermsModalOpen] = useState(false); // full-detail modal

  useReveal();
  const day = ITINERARY[activeDay];
  const activeCat = TERM_CATS.find((c) => c.id === termsTab);

  // Live booking maths — the card computes a real, changing total.
  const total = PRICE * travellers;
  const depositTotal = Math.round(total * 0.2);
  const dueToday = payMode === 'deposit' ? depositTotal : total;
  const balance = total - dueToday;

  useEffect(() => { window.scrollTo(0, 0); }, []);

  // Sticky-header state (transparent over hero → solid blue on scroll, like the homepage)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const lock = menuOpen || callbackOpen || termsModalOpen;
    document.body.style.overflow = lock ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen, callbackOpen, termsModalOpen]);

  useEffect(() => {
    if (!callbackOpen && !termsModalOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') { setCallbackOpen(false); setTermsModalOpen(false); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [callbackOpen, termsModalOpen]);

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

  return (
    <>
      <div className="lx2i lxjt lxjt2 lxjt3 lxjt4 lxjt5">
        <div className="lx2i-grain" aria-hidden="true" />
        <a className="lxjt-skip" href="#main">Skip to content</a>

        {/* ============ HEADER + MOBILE MENU (matches the /new homepage) ============ */}
        <div className="h26">
          <header className={`h26-nav${scrolled ? ' is-solid' : ''}`}>
            <Link to={HOME} className="h26-brand" aria-label="Cox & Kings — home">
              <img src="/cox-logo-new.png" alt="Cox & Kings" />
            </Link>
            <nav className="h26-links hi-nav" aria-label="Primary">
              {NAV_MENU.map((group) => (
                <div className="hi-nav-group" key={group.label}>
                  <a href={group.href} onClick={navClick(group.href)} className="hi-nav-top" aria-haspopup={group.items ? 'true' : undefined}>
                    {group.label}
                    {group.items && <ChevronDown size={14} className="hi-nav-caret" aria-hidden="true" />}
                  </a>
                  {group.items && (
                    <div className="hi-nav-flyout" role="menu">
                      <div className="hi-nav-flyout-inner">
                        <p className="hi-nav-blurb">{group.blurb}</p>
                        <ul className="hi-nav-list">
                          {group.items.map((it) => (
                            <li key={it.label}>
                              <a href={it.href} onClick={navClick(it.href)} role="menuitem" className="hi-nav-item">
                                <span className="hi-nav-item-label">{it.label}</span>
                                <span className="hi-nav-item-desc">{it.desc}</span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>
            <div className="h26-nav-cta">
              <a href={PHONE_TEL} className="h26-phone">
                <Phone size={15} /> <span>{PHONE_DISPLAY}</span>
              </a>
              <a href="#callback" onClick={openCallback} className="h26-btn h26-btn-pill">Talk to an expert</a>
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
                {[
                  { label: 'Highlights', href: '#highlights' },
                  { label: 'Your route', href: '#route' },
                  { label: 'Day by day', href: '#itinerary' },
                  { label: 'Dates & prices', href: '#dates' },
                  { label: 'Reviews', href: '#reviews' },
                ].map((n) => (
                  <a key={n.label} href={n.href} onClick={navClick(n.href)}>
                    {n.label}
                    <span className="h26-menu-chev"><ArrowRight size={16} /></span>
                  </a>
                ))}
              </nav>
              <div className="h26-menu-divider" />
              <div className="h26-menu-secondary">
                <a href={HOME} onClick={navClick(HOME)}>All journeys <ArrowUpRight size={13} /></a>
                <a href={`${HOME}#destinations`} onClick={navClick(`${HOME}#destinations`)}>Destinations <ArrowUpRight size={13} /></a>
                <a href={`${HOME}#heritage`} onClick={navClick(`${HOME}#heritage`)}>Our story <ArrowUpRight size={13} /></a>
              </div>
              <a href="#callback" className="h26-btn h26-btn-pill h26-menu-cta" onClick={openCallback}>
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

          {/* ============ DATES & PRICES / BOOK ============ */}
          <section className="lxjt-book" id="dates">
            <div className="lx2i-container lxjt-book__grid">
              <div className="lxjt-book__intro lx2i-reveal">
                <span className="lx2i-eyebrow">// RESERVE YOUR DATES</span>
                <h2 className="lx2i-h2">Reserve your <strong>seats</strong></h2>
                <p className="lxjt-lead">Pick one of our set 2026 departures and confirm your seats with a 20% deposit &mdash; the balance comes later.</p>
                <ul className="lxjt-book__perks">
                  <li><Check size={16} strokeWidth={2.4} /> Expert-guided from the moment you land to the day you fly home</li>
                  <li><Check size={16} strokeWidth={2.4} /> All-inclusive: flights, visa, insurance, stays, meals and transfers</li>
                  <li><Check size={16} strokeWidth={2.4} /> A small group of no more than 20 like-minded travellers</li>
                </ul>
                <div className="lxjt-confidence">
                  <ShieldCheck size={24} strokeWidth={1.7} />
                  <div>
                    <strong>Book with confidence</strong>
                    <p>Encrypted checkout. Your 20% deposit is protected, and you can talk to a curator first &mdash; free.</p>
                  </div>
                </div>
                <ul className="lxjt-safety" aria-label="How your booking is protected">
                  {SAFETY.map(({ icon: Icon, label, note }) => (
                    <li key={label} className="lxjt-safety__item">
                      <span className="lxjt-safety__ic"><Icon size={17} strokeWidth={1.8} /></span>
                      <span className="lxjt-safety__txt"><strong>{label}</strong><small>{note}</small></span>
                    </li>
                  ))}
                </ul>
              </div>

              <aside className="lxjt-card lx2i-reveal" style={{ '--d': '.08s' }}>
                <div className="lxjt-card__top">
                  <span className="lxjt-card__frm">from <strong>{inr(PRICE)}</strong> <small>pp</small></span>
                  <span className="lxjt-card__live"><span className="lxjt-card__dot" aria-hidden="true" /> Live availability</span>
                </div>

                <div className="lxjt-card__fields">
                  <label className="lxjt-fld lxjt-fld--dep">
                    <span className="lxjt-fld__lbl">Departure</span>
                    <div className="lxjt-select">
                      <select value={selectedDep} onChange={(e) => setSelectedDep(Number(e.target.value))} aria-label="Departure date">
                        {DEPARTURES.map((d, i) => <option key={d.date} value={i}>{d.date}</option>)}
                      </select>
                      <ChevronDown size={16} aria-hidden="true" />
                    </div>
                    <small className={`lxjt-fld__seats ${DEPARTURES[selectedDep].tight ? 'is-tight' : ''}`}>{DEPARTURES[selectedDep].seats}</small>
                  </label>

                  <label className="lxjt-fld lxjt-fld--trav">
                    <span className="lxjt-fld__lbl">Travellers</span>
                    <div className="lxjt-stepper">
                      <button type="button" aria-label="Fewer travellers" onClick={() => setTravellers((n) => Math.max(1, n - 1))} disabled={travellers <= 1}><Minus size={15} /></button>
                      <span className="lxjt-stepper__val">{travellers}</span>
                      <button type="button" aria-label="More travellers" onClick={() => setTravellers((n) => Math.min(20, n + 1))} disabled={travellers >= 20}><Plus size={15} /></button>
                    </div>
                  </label>
                </div>

                <div className="lxjt-pay" role="radiogroup" aria-label="Payment option">
                  <button type="button" role="radio" aria-checked={payMode === 'deposit'} className={`lxjt-pay__opt ${payMode === 'deposit' ? 'is-on' : ''}`} onClick={() => setPayMode('deposit')}>
                    <span className="lxjt-pay__title">20% deposit</span>
                    <span className="lxjt-pay__amt">{inr(depositTotal)}</span>
                  </button>
                  <button type="button" role="radio" aria-checked={payMode === 'full'} className={`lxjt-pay__opt ${payMode === 'full' ? 'is-on' : ''}`} onClick={() => setPayMode('full')}>
                    <span className="lxjt-pay__title">Pay in full</span>
                    <span className="lxjt-pay__amt">{inr(total)}</span>
                  </button>
                </div>

                <div className="lxjt-due">
                  <div className="lxjt-due__row"><span>Due today</span><strong>{inr(dueToday)}</strong></div>
                  <span className="lxjt-due__sub">{payMode === 'deposit' ? `Balance ${inr(balance)} due 45 days before travel` : `${travellers} × ${inr(PRICE)}, paid in full`}</span>
                </div>

                <button type="button" className="lx2i-btn lx2i-btn--primary lx2i-btn--lg lxjt-card__go">
                  <MessageCircle size={17} /> Enquire Now
                </button>
                <p className="lxjt-card__secure"><Lock size={13} /> Secure encrypted checkout · deposit protected</p>
                <a href={PHONE_TEL} className="lxjt-card__talk">Prefer to talk? Call a curator, free <ArrowRight size={14} /></a>
              </aside>
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
              <Link to="/improved#reviews" className="h26-btn h26-btn-pill">View all reviews <ArrowUpRight size={16} /></Link>
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

          {/* ============ FOOTER (reuses homepage lx2i-footer) ============ */}
          <footer className="lx2i-footer">
            <div className="lx2i-container lx2i-footer__top">
              <div className="lx2i-footer__brand">
                <img src="/cox-logo-new.png" alt="Cox & Kings — Est. 1758" />
                <p>The world&rsquo;s most experienced travel company.<br />Trusted by generations since 1758.</p>
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
                  <Link to={`${HOME}#destinations`}>Destinations</Link>
                  <Link to={`${HOME}#curated`}>Curated Journeys</Link>
                  <Link to={`${HOME}#heritage`}>Our Heritage</Link>
                  <a href="#reviews" onClick={navClick('#reviews')}>Reviews</a>
                </div>
                <div>
                  <span className="lx2i-eyebrow">COMPANY</span>
                  <a href={PHONE_TEL}>Speak to an Expert</a>
                  <a href="#">About Us</a>
                  <a href="#">Press Room</a>
                  <a href="#">Careers</a>
                </div>
                <div>
                  <span className="lx2i-eyebrow">SPEAK TO A HUMAN</span>
                  <a href={PHONE_TEL}><Phone size={13} /> {PHONE_DISPLAY}</a>
                  <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"><MessageCircle size={13} /> Chat on WhatsApp</a>
                  <a href="#" onClick={openCallback}><PhoneCall size={13} /> Request a callback</a>
                  <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                </div>
              </div>
            </div>
            <div className="lx2i-container lx2i-footer__bottom">
              <p>© 2026 Cox &amp; Kings. Est. 1758.</p>
              <div className="lx2i-footer__legal"><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Cookies</a></div>
            </div>
          </footer>
        </main>

        {/* ============ MOBILE THUMB-REACH BAR — talk to a human ============ */}
        <div className="lxjt-thumbbar">
          <div className="lxjt-thumbbar__nudge">
            <small>Got questions about Japan?</small>
            <strong>A specialist can help — free</strong>
          </div>
          <button type="button" className="lxjt-thumbbar__chat" onClick={() => setChatOpen(true)}>
            <MessageCircle size={18} /> Chat with a specialist
          </button>
          <a href={PHONE_TEL} className="lxjt-thumbbar__ico" aria-label="Call a specialist"><Phone size={20} /></a>
        </div>

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
      </div>

      {/* AI chat (Enaya) — rendered OUTSIDE .lx2i so scoped styles can't leak in */}
      <ChatBot open={chatOpen} onOpenChange={setChatOpen} hideFab name="Enaya" />
    </>
  );
}
