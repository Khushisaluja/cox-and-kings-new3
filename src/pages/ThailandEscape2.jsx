import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Menu, X, ArrowRight, ArrowLeft, ArrowUpRight, ChevronDown,
  Star, MapPin, Calendar, Users, Check, Plus, Minus, Lock, Quote,
  ShieldCheck, Phone, MessageCircle, PhoneCall, Sparkles, Clock,
  Wallet, Repeat, Stamp, CheckCircle2, Instagram, Facebook, Youtube, Linkedin,
  Hotel, Utensils, Compass, Headset, Flame, Zap, BadgeCheck, Plane,
  CreditCard, FileText, AlertTriangle, RefreshCcw, Building2, UserCheck,
  HeartPulse, BedDouble, CloudLightning, Gavel, Scale, Car, UserPlus, Trash2,
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
import './ThailandEscape.css';
import './ThailandEscape2.css';

/* ============================================================
   Cox & Kings — "Pattaya & Bangkok Escape" tour-detail page.
   Route: /tour-detail-thailand.

   Built on the same design language as /tour-detail-japan-5, but
   where the Japan page is tuned for LEAD CAPTURE, this page is tuned
   to make people BOOK: a loud "Book now" hero CTA, an urgency /
   high-demand strip and scarcity ribbon on the booking card, seats-
   left tags on every date, and trust badges beside the checkout.
   Content is taken from coxandkings.com/private-tours/pattaya-bangkok-escape.
   ============================================================ */

const sizedUnsplash = (id, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

/* ---------- Human contact (matches the homepage) ---------- */
const PHONE_DISPLAY = '+91 85560 01700';
const PHONE_TEL = 'tel:+918556001700';
const WHATSAPP = 'https://wa.me/918556001700?text=Hi%20Cox%20%26%20Kings%2C%20I%27d%20like%20to%20book%20the%20Pattaya%20%26%20Bangkok%20Escape.';
const EMAIL = 'holidays@coxandkings.com';
const HOME = '/luxe2-improved';

/* Desktop nav megamenus — same shape as the /new homepage, remapped
   to the sections on this tour-detail page. */
const NAV_MENU = [
  {
    label: 'This tour', href: '#highlights',
    blurb: 'Everything about the Pattaya & Bangkok Escape.',
    items: [
      { label: 'Highlights', desc: 'What makes this trip special', href: '#highlights' },
      { label: 'Day by day', desc: 'The full itinerary', href: '#itinerary' },
      { label: 'Dates & prices', desc: 'Departures and fares', href: '#dates' },
    ],
  },
  {
    label: 'Journeys', href: `${HOME}#curated`,
    blurb: 'Signature itineraries, ready to make your own.',
    items: [
      { label: 'Private tours', desc: 'Just your party, your pace', href: `${HOME}#curated` },
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
      { label: 'Real reviews', desc: '2,400+ verified travellers', href: '#reviews' },
      { label: 'Press & awards', desc: 'The press that covers us', href: `${HOME}#reviews` },
    ],
  },
  { label: 'Reviews', href: '#reviews' },
];

/* ---------- Tour data (Pattaya & Bangkok Escape) ----------
   PRICE is the headline "from" fare — the lowest across all 2026 departures
   (the per-date prices live in DEPARTURES below). */
const PRICE = 31299;
const HERO = {
  kicker: 'Pattaya & Bangkok Escape · Private tour',
  title: (
    <>Thailand, from <em className="lxjt-hero__accent">island shores</em> to golden temples.</>
  ),
  image: '1552465011-b4e21bf6e79a',
  facts: [
    { icon: Calendar, label: '5 Days · 4 Nights' },
    { icon: MapPin, label: '2 Cities' },
    { icon: Users, label: 'Escorted small group' },
    { icon: Compass, label: 'Guided sightseeing' },
  ],
};

const HIGHLIGHT_IMG = '1519451241324-20b4ea2c4220';
/* Scannable "what's in the price" strip — the key inclusions, at a glance. */
const KEY_INCLUSIONS = [
  { icon: Hotel, label: '4 nights · Pattaya & Bangkok' },
  { icon: Utensils, label: 'Breakfast daily + 2 lunches' },
  { icon: Compass, label: 'Alcazar Show & Coral Island' },
  { icon: Car, label: 'Private airport & city transfers' },
  { icon: MapPin, label: 'Temple tour & Safari World' },
  { icon: ShieldCheck, label: 'Local representative throughout' },
];
const HIGHLIGHTS = [
  'The world-famous Alcazar cabaret show in Pattaya',
  'A Coral Island speedboat adventure, with lunch',
  'Tiger Topia — a close-up wildlife encounter',
  'Bangkok’s golden temples: Wat Traimit & Wat Pho',
  'Safari World & Marine Park, with lunch included',
  'Private transfers and guided sightseeing throughout',
];

/* Day-by-day itinerary — mirrors the real "Pattaya & Bangkok Escape" product.
   Each day carries its picture + the hotel, meals and key sights that surface on
   the picture (desktop) or inside the accordion (mobile). */
const ITINERARY = [
  { day: 'Day 01', place: 'Pattaya', title: 'Arrive in Bangkok → Pattaya', img: '1528702748617-c64d49f918af', cap: 'The Alcazar Show, Pattaya',
    body: 'Land at Bangkok’s Suvarnabhumi Airport, where our local representative meets you for a private transfer to Pattaya (about 2–2.5 hours). After check-in, take in the world-famous Alcazar Show — a dazzling cabaret of costumes, music and stagecraft.',
    hotel: 'Aiyara Grand Pattaya (or similar)', stars: 4, room: 'Standard Room · twin / double', ryokan: false,
    transfer: 'Suvarnabhumi Airport → Pattaya (private, ~2–2.5 hrs)', meals: 'No meals included', nights: '2 nights · Pattaya',
    acts: ['Private airport transfer', 'Hotel check-in', 'Alcazar cabaret show'] },
  { day: 'Day 02', place: 'Pattaya', title: 'Coral Island & Tiger Topia', img: '1537956965359-7573183d1f57', cap: 'Coral Island by speedboat',
    body: 'A speedboat skims out to Coral Island for a day on powder-soft sand and clear water, with lunch included. Back on the mainland, come face to face with the big cats at the Tiger Topia wildlife park.',
    hotel: 'Aiyara Grand Pattaya (or similar)', stars: 4, room: 'Standard Room · twin / double', ryokan: false,
    transfer: 'Speedboat to Coral Island + coach touring', meals: 'Breakfast · Lunch', nights: '2 nights · Pattaya',
    acts: ['Coral Island by speedboat', 'Beach time & water activities', 'Lunch on the island', 'Tiger Topia wildlife park'] },
  { day: 'Day 03', place: 'Bangkok', title: 'Pattaya → Bangkok & temple tour', img: '1563492065599-3520f775eeed', cap: 'Wat Pho, Bangkok',
    body: 'Travel on to Bangkok and step into its spiritual heart — Wat Traimit, home to the solid-gold Buddha, and Wat Pho with its vast reclining Buddha — before settling into your city hotel.',
    hotel: 'Hotel in Bangkok (or similar)', stars: 4, room: 'Standard Room · twin / double', ryokan: false,
    transfer: 'Pattaya → Bangkok by coach', meals: 'Breakfast', nights: '2 nights · Bangkok',
    acts: ['Transfer to Bangkok', 'Wat Traimit (Golden Buddha)', 'Wat Pho (Reclining Buddha)', 'City orientation'] },
  { day: 'Day 04', place: 'Bangkok', title: 'Safari World & Marine Park', img: '1571407970349-bc81e7e96d47', cap: 'Safari World, Bangkok',
    body: 'Spend the day at Safari World & Marine Park — a drive-through safari of free-roaming animals and a marine park of dolphin, sea-lion and orangutan shows — with lunch included.',
    hotel: 'Hotel in Bangkok (or similar)', stars: 4, room: 'Standard Room · twin / double', ryokan: false,
    transfer: 'Coach to Safari World & Marine Park', meals: 'Breakfast · Lunch', nights: '2 nights · Bangkok',
    acts: ['Safari drive-through park', 'Marine Park shows', 'Lunch included', 'Return to Bangkok'] },
  { day: 'Day 05', place: 'Bangkok', title: 'Depart from Bangkok', img: '1528181304800-259b08848526', cap: 'Sawasdee, from Bangkok',
    body: 'After breakfast, a private transfer takes you to Suvarnabhumi Airport in good time for your onward flight home.',
    hotel: 'Check-out · departure day', stars: 0, room: '—', ryokan: false,
    transfer: 'Bangkok hotel → Suvarnabhumi Airport (private)', meals: 'Breakfast', nights: 'Departure',
    acts: ['Breakfast at hotel', 'Private airport transfer'] },
];

const INCLUDED = [
  'Two nights in Pattaya and two nights in Bangkok in hand-picked hotels',
  'Daily breakfast, plus lunch on Coral Island and at Safari World',
  'Private airport arrival transfer and all intercity & sightseeing transfers',
  'The Alcazar cabaret show, Coral Island tour, Tiger Topia and the Bangkok temple tour',
  'Safari World & Marine Park entry with lunch',
  'A local representative on hand throughout your stay',
];
const NOT_INCLUDED = [
  'International airfare and anything not listed in the inclusions',
  'Visa fees and monument entrance fees not specified in the itinerary',
  'Meals beyond those specified in the daily programme',
  'Personal expenses — tips, laundry, calls, beverages, shopping, minibar and camera fees',
  'Early check-in / late check-out and any optional tours or activities',
  'Travel insurance (mandatory, arranged separately)',
];

/* Fixed group departures — a real list (not a dropdown). Each carries its own
   price, seats and an urgency LEVEL that maps to a design.md semantic colour:
   'error' (almost gone) · 'warn' (filling) · 'ok' (good availability). */
const DEPARTURES = [
  { date: '18 Jul 2026', dow: 'Saturday', ret: 'Returns Wed 22 Jul', price: 34999, seats: 4, level: 'error', badge: 'Peak season' },
  { date: '09 Aug 2026', dow: 'Sunday',   ret: 'Returns Thu 13 Aug', price: 33499, seats: 6, level: 'warn',  badge: 'Popular' },
  { date: '20 Sep 2026', dow: 'Sunday',   ret: 'Returns Thu 24 Sep', price: 31299, seats: 11, level: 'ok',   badge: 'Best price' },
  { date: '18 Oct 2026', dow: 'Sunday',   ret: 'Returns Thu 22 Oct', price: 32279, seats: 14, level: 'ok',   badge: '' },
  { date: '15 Nov 2026', dow: 'Sunday',   ret: 'Returns Thu 19 Nov', price: 33999, seats: 8, level: 'warn',  badge: '' },
];
/* Urgency label + a11y wording for a given departure. */
const seatText = (d) =>
  d.level === 'error' ? `Only ${d.seats} seats left`
  : d.level === 'warn' ? `Filling fast · ${d.seats} seats`
  : `${d.seats} seats available`;

/* Photo-first traveller reviews (families, couples & groups). */
const REVIEWS = [
  { name: 'The Kapoor Family', age: '2 kids', trip: 'Thailand · Pattaya & Bangkok', rating: 5, span: 'tall', location: 'Mumbai', avatar: '1552058544-f2b08422138a',
    text: 'Coral Island by speedboat and Safari World back to back — the kids were in heaven. Every transfer was private and on time, so we never once stood around waiting.',
    ids: ['1758272959663-b30513083206', '1715745218436-5a583702447a', '1580825175616-77f8df1bb507'] },
  { name: 'Neha & Arjun', age: '', trip: 'Thailand · Honeymoon', rating: 5, span: 'tall', location: 'Bengaluru', avatar: '1545167622-3a6ac756afa4',
    text: 'The Alcazar show was spectacular and the Pattaya beach evenings were pure romance. Booking took five minutes and the whole trip was handled end to end.',
    ids: ['1630001722538-a9a540da549b', '1529156069898-49953e39b3ac'] },
  { name: 'Sameer Gupta', age: '', trip: 'Thailand · Temples & city', rating: 5, span: 'tall', location: 'Delhi', avatar: '1500648767791-00dcc994a43e',
    text: 'Wat Traimit and Wat Pho were breathtaking, and our guide brought the history alive. Flawless from the airport pickup to the drop-off five days later.',
    ids: ['1567122087721-47b09b61e1d1', '1667029839636-af119b059c49'] },
  { name: 'The Shah Family', age: '4 travelling', trip: 'Thailand · Escape', rating: 5, span: 'tall', location: 'Ahmedabad', avatar: '1633332755192-727a05c4013d',
    text: 'Zero planning stress — everything was booked and confirmed before we flew. Safari World was the highlight for our children, and lunch was sorted every day.',
    ids: ['1642342397404-fed6450eb964', '1580825175616-77f8df1bb507'] },
  { name: 'Riya & friends', age: 'Group of 5', trip: 'Thailand · Spring 2026', rating: 5, span: 'tall', location: 'Pune', avatar: '1438761681033-6461ffad8d80',
    text: 'Five of us, one seamless trip. Coral Island, the cabaret, the temples — our own private tour meant we set the pace and never felt rushed.',
    ids: ['1639979511572-ff346bc5b3b7', '1667029839636-af119b059c49'] },
  { name: 'Anita & Vikram', age: '', trip: 'Thailand · Anniversary', rating: 5, span: 'tall', location: 'Hyderabad', avatar: '1545167622-3a6ac756afa4',
    text: 'Private transfers meant we could relax the whole way. Great hotels in both cities and a curator a call away the entire time. Genuinely worth every rupee.',
    ids: ['1677179974826-b6619bd77506', '1639979511572-ff346bc5b3b7'] },
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
  { title: 'Phuket & Krabi Beaches', region: 'Thailand', season: 'Oct–Apr', nights: '6 nights', priceFrom: '₹48,000', image: '1519451241324-20b4ea2c4220', tags: ['Relaxed pace', 'Private tour'] },
  { title: 'Bali Highlights', region: 'Indonesia', season: 'All year', nights: '6 nights', priceFrom: '₹52,000', image: '1537956965359-7573183d1f57', tags: ['Relaxed pace', 'Private tour'] },
  { title: 'Singapore & Malaysia', region: '2 countries', season: 'All year', nights: '6 nights', priceFrom: '₹65,000', image: '1583417319070-4a69db38a482', tags: ['Balanced pace', 'Private tour'] },
  { title: 'Vietnam Discovery', region: 'Vietnam', season: 'Oct–Apr', nights: '8 nights', priceFrom: '₹78,000', image: '1598935888738-cd2622bcd437', tags: ['Active pace', 'Private tour'] },
];

const SAFETY = [
  { icon: Wallet, label: 'Low deposit', note: 'Book from 20% today' },
  { icon: Repeat, label: 'Free date changes', note: 'Up to 45 days before travel' },
  { icon: Stamp, label: 'Visa support', note: 'Paperwork guidance included' },
  { icon: ShieldCheck, label: 'Financially protected', note: 'Your money is held securely' },
];

/* Assurance band — a standalone strip of trust badges (booking-first). */
const ASSURE = [
  { icon: BadgeCheck, label: '4.8 / 5 rating', note: 'From 2,400+ verified travellers', stars: true, to: '#reviews' },
  { icon: Lock, label: '100% secure payments', note: 'Encrypted checkout, protected deposit' },
  { icon: Headset, label: '24 × 7 support', note: 'A real human, on WhatsApp or call' },
  { icon: Stamp, label: 'Since 1758', note: 'The world’s longest-running travel firm' },
];

/* ============================================================
   The policies — the full Cox & Kings terms, organised into three
   filterable categories. Each topic shows a short summary + a couple
   of preview points; the rest expands on demand (accordion).
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
        'Passport valid for at least 6 months beyond return date',
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
        'Hotel category and standard vary by tour package',
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
  { id: 'itinerary', label: 'Day by day' },
  { id: 'included', label: 'Included' },
  { id: 'dates', label: 'Book now' },
  { id: 'terms', label: 'Policies' },
  { id: 'reviews', label: 'Reviews' },
];

const inr = (n) => `₹${n.toLocaleString('en-IN')}`;

/* Booking add-ons / opt-outs.

   This is a fixed group departure, so the Mumbai return flight is bundled
   into the headline per-person price by default. A traveller who arranges
   their own flights books the same tour "land only" and the air component
   comes back off the bill — hence a credit, not a surcharge.

   Thailand visa is NOT part of the package (see BOOKING_POINTS); the figure
   below is shown for guidance only and never enters the total. */
const FLIGHT_CREDIT = 18000;   // per person, deducted when "land only"
const EXTRA_BED_FEE = 6500;    // flat, one rollaway bed in a shared room
const VISA_FEE_EST = 2500;     // per person, paid by the traveller directly

const TITLES = ['Mr', 'Mrs', 'Ms', 'Dr', 'Mx'];
const CHILD_TITLES = ['Mstr', 'Miss'];
const MAX_PARTY = 20;

const blankGuest = (kind) => ({
  title: kind === 'child' ? 'Mstr' : 'Mr',
  first: '',
  last: '',
  phone: '',
});

const nameOk = (g) => Boolean(g.first.trim() && g.last.trim());
/* Indian mobiles are 10 digits; allow a +91 / 0 prefix and any spacing. */
const phoneOk = (v) => (v || '').replace(/\D/g, '').length >= 10;

/* Shown inside the traveller-details dialog. `on` = included in the price,
   `off` = explicitly excluded, so nobody discovers the visa at the airport.

   The flight line tracks the checkbox — a static "flights are included" bullet
   sitting under an unticked box is the kind of contradiction people ring up
   about. */
const bookingPoints = (withFlights) => [
  withFlights
    ? { tone: 'on', text: 'Return flights from Mumbai (economy) are included in the price shown. Not flying from Mumbai? Untick the box above and the air fare comes off your bill.' }
    : { tone: 'off', text: `Flights are NOT included — you've chosen to travel land only. Make your own way to Bangkok and meet the group at the hotel; we've taken ${inr(FLIGHT_CREDIT)} per person off the price.` },
  { tone: 'on', text: '4 nights hotels, all airport and inter-city transfers, daily breakfast and the guided sightseeing listed in the itinerary.' },
  { tone: 'off', text: `Thailand visa fee is NOT included. You apply yourself and pay the consulate directly — budget roughly ${inr(VISA_FEE_EST)} per person. We send the paperwork checklist once you book.` },
  { tone: 'off', text: 'Travel insurance, meals not listed, tips and personal expenses are not included.' },
];

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

export default function ThailandEscape2() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [activeDay, setActiveDay] = useState(0);
  const [openDay, setOpenDay] = useState(-1);
  const [selectedDep, setSelectedDep] = useState(0);
  const [payMode, setPayMode] = useState('deposit');
  const [activeSection, setActiveSection] = useState('highlights');
  const [callbackOpen, setCallbackOpen] = useState(false);
  const [callbackSent, setCallbackSent] = useState(false);
  const [reviewIdx, setReviewIdx] = useState(0);

  /* The party IS the guest list — a seat and the person sitting in it are the
     same record, so the card's steppers and the drawer's traveller forms can
     never drift apart. Counts are derived, never stored. */
  const [adultGuests, setAdultGuests] = useState(() => [blankGuest('adult'), blankGuest('adult')]);
  const [childGuests, setChildGuests] = useState([]);
  const adults = adultGuests.length;
  const children = childGuests.length;
  const travellers = adults + children;   // seats = adults + children

  const addAdult = () => setAdultGuests((g) => (travellers >= MAX_PARTY ? g : [...g, blankGuest('adult')]));
  const addChild = () => setChildGuests((g) => (travellers >= MAX_PARTY ? g : [...g, blankGuest('child')]));
  /* The lead (adult 0) can never be removed — they own the booking. */
  const dropAdult = (i) => setAdultGuests((g) => (i === 0 || g.length <= 1 ? g : g.filter((_, n) => n !== i)));
  const dropChild = (i) => setChildGuests((g) => g.filter((_, n) => n !== i));
  const editAdult = (i, patch) => setAdultGuests((g) => g.map((x, n) => (n === i ? { ...x, ...patch } : x)));
  const editChild = (i, patch) => setChildGuests((g) => g.map((x, n) => (n === i ? { ...x, ...patch } : x)));

  /* Traveller-details drawer (opens from the booking card's CTA). */
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [bookingDone, setBookingDone] = useState(false);
  const [withFlights, setWithFlights] = useState(true);  // group tour ⇒ flights by default
  const [extraBed, setExtraBed] = useState(false);
  const [termsTab, setTermsTab] = useState('booking');
  const [termsModalOpen, setTermsModalOpen] = useState(false);

  useReveal();
  const review = REVIEWS[reviewIdx];
  const day = ITINERARY[activeDay];
  const activeCat = TERM_CATS.find((c) => c.id === termsTab);
  const nextReview = () => setReviewIdx((i) => (i + 1) % REVIEWS.length);
  const prevReview = () => setReviewIdx((i) => (i - 1 + REVIEWS.length) % REVIEWS.length);

  // Live booking maths — driven by the SELECTED departure's per-person price.
  const dep = DEPARTURES[selectedDep];
  const pp = dep.price;
  const fare = pp * travellers;
  /* Opting out of the bundled Mumbai flights credits the air fare back, per
     traveller. The extra bed is a flat one-off, not per head. */
  const flightCredit = withFlights ? 0 : FLIGHT_CREDIT * travellers;
  const bedFee = extraBed ? EXTRA_BED_FEE : 0;
  const total = fare - flightCredit + bedFee;
  const depositTotal = Math.round(total * 0.2);
  const dueToday = payMode === 'deposit' ? depositTotal : total;
  const balance = total - dueToday;

  /* Every traveller needs the name on their passport; only the lead has to
     leave a number, since that is who we ring when a flight moves. */
  const lead = adultGuests[0];
  const namedOk = [...adultGuests, ...childGuests].every((g) => nameOk(g));
  const leadPhoneOk = phoneOk(lead.phone);
  const formOk = namedOk && leadPhoneOk;

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* The hero already carries a "Book now" — the floating one only earns its
     place once that has scrolled away, so the two never sit on screen at once. */
  useEffect(() => {
    const hero = document.querySelector('.lxjt-hero');
    if (!hero) return;
    const io = new IntersectionObserver(([e]) => setPastHero(!e.isIntersecting), { threshold: 0 });
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const lock = menuOpen || callbackOpen || termsModalOpen || detailsOpen;
    document.body.style.overflow = lock ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen, callbackOpen, termsModalOpen, detailsOpen]);

  useEffect(() => {
    if (!callbackOpen && !termsModalOpen && !detailsOpen) return;
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      setCallbackOpen(false); setTermsModalOpen(false); setDetailsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [callbackOpen, termsModalOpen, detailsOpen]);

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

  const navClick = useCallback((href) => (e) => {
    setMenuOpen(false);
    if (href.startsWith('#')) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const openCallback = useCallback((e) => { if (e) e.preventDefault(); setMenuOpen(false); setCallbackSent(false); setCallbackOpen(true); }, []);

  /* One card per person in the drawer. Adult 0 is the lead: they can't be
     removed, and theirs is the only phone number we insist on. */
  const renderGuest = (g, i, kind) => {
    const isLead = kind === 'adult' && i === 0;
    const edit = kind === 'adult' ? editAdult : editChild;
    const drop = kind === 'adult' ? dropAdult : dropChild;
    const titles = kind === 'adult' ? TITLES : CHILD_TITLES;
    const who = isLead ? 'Lead traveller' : `${kind === 'adult' ? 'Adult' : 'Child'} ${i + 1}`;

    return (
      <div className={`tha2-bd__guest ${isLead ? 'is-lead' : ''}`} key={`${kind}-${i}`}>
        <div className="tha2-bd__guesthd">
          <span className="tha2-bd__guestwho">
            {isLead ? <UserCheck size={15} /> : <Users size={15} />} {who}
            {kind === 'child' && <small>Age 2&ndash;11</small>}
          </span>
          {isLead ? (
            <span className="tha2-bd__guesttag">Books &amp; pays</span>
          ) : (
            <button
              type="button"
              className="tha2-bd__drop"
              onClick={() => drop(i)}
              aria-label={`Remove ${who.toLowerCase()}`}
            >
              <Trash2 size={14} /> Remove
            </button>
          )}
        </div>

        <div className="tha2-bd__namerow">
          <label className="tha2-bd__field tha2-bd__field--title">
            <span>Title</span>
            <select value={g.title} onChange={(e) => edit(i, { title: e.target.value })}>
              {titles.map((t) => <option key={t}>{t}</option>)}
            </select>
          </label>
          <label className="tha2-bd__field">
            <span>First name <i className="tha2-bd__star" title="Required">*</i></span>
            <input
              type="text" required
              autoComplete={isLead ? 'given-name' : 'off'}
              placeholder={kind === 'child' ? 'Aarav' : 'Priya'}
              value={g.first}
              onChange={(e) => edit(i, { first: e.target.value })}
            />
          </label>
          <label className="tha2-bd__field">
            <span>Last name <i className="tha2-bd__star" title="Required">*</i></span>
            <input
              type="text" required
              autoComplete={isLead ? 'family-name' : 'off'}
              placeholder="Sharma"
              value={g.last}
              onChange={(e) => edit(i, { last: e.target.value })}
            />
          </label>
        </div>

        <label className="tha2-bd__field tha2-bd__field--phone">
          <span>
            Phone number{' '}
            {isLead
              ? <i className="tha2-bd__star" title="Required">*</i>
              : <em className="tha2-bd__opt-lbl">Optional</em>}
          </span>
          <input
            type="tel" inputMode="tel"
            autoComplete={isLead ? 'tel' : 'off'}
            required={isLead}
            placeholder={isLead ? '+91 98765 43210' : 'If you have it'}
            value={g.phone}
            onChange={(e) => edit(i, { phone: e.target.value })}
          />
        </label>
      </div>
    );
  };

  return (
    <>
      <div className="lx2i lxjt lxjt2 lxjt3 lxjt4 lxjt5 tha tha2">
        <div className="lx2i-grain" aria-hidden="true" />
        <a className="lxjt-skip" href="#main">Skip to content</a>

        {/* ============ HEADER + MOBILE MENU ============ */}
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
              <a href="#dates" onClick={navClick('#dates')} className="h26-btn h26-btn-pill">Book now</a>
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
                  { label: 'Day by day', href: '#itinerary' },
                  { label: 'Book now', href: '#dates' },
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
              <a href="#dates" className="h26-btn h26-btn-pill h26-menu-cta" onClick={navClick('#dates')}>
                <Zap size={16} /> Book this tour
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
          {/* ============ HERO ============ */}
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
                <ul className="lxjt-hero__facts" aria-label="Trip at a glance">
                  {HERO.facts.map(({ icon: Icon, label }) => (
                    <li key={label} className="lxjt-fact"><Icon size={16} strokeWidth={1.9} /> {label}</li>
                  ))}
                </ul>
                <div className="lxjt-hero__actions">
                  <a href="#dates" onClick={navClick('#dates')} className="lx2i-btn lx2i-btn--primary lx2i-btn--lg">Book now — from {inr(PRICE)} pp <ArrowRight size={16} /></a>
                  <a href="#itinerary" onClick={navClick('#itinerary')} className="lx2i-btn lx2i-btn--outline lx2i-btn--lg">View itinerary</a>
                </div>
                <a href="#reviews" onClick={navClick('#reviews')} className="lxjt-hero__rating lxjt5-rating-link">
                  <span className="lx2i-stars">{[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}</span>
                  <strong>4.8</strong><span>from 2,400+ traveller reviews</span>
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
                <span className="lx2i-eyebrow">// FIVE EASY DAYS, EVERYTHING HANDLED</span>
                <h2 className="lx2i-h2">Tour <strong>highlights</strong></h2>
                <p className="lxjt-lead">Beaches, temples and wildlife — privately arranged, so you need only turn up and be there for it.</p>
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
                  <div className="lxjt-hl__img" style={{ backgroundImage: `url(${sizedUnsplash(HIGHLIGHT_IMG, 900)})` }} role="img" aria-label="A Thai island beach with clear turquoise water" />
                  <span className="lxjt-hl__cap"><MapPin size={13} /> Coral Island, off Pattaya</span>
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

          {/* ============ DAY BY DAY ============ */}
          <section className="lxjt-section lxjt2-itin" id="itinerary">
            <div className="lx2i-container">
              <div className="lxjt-head lxjt-head--center lx2i-reveal">
                <span className="lx2i-eyebrow">// THE FULL PICTURE, DAY BY DAY</span>
                <h2 className="lx2i-h2">Day by <strong>day</strong></h2>
                <p className="lxjt-lead">Five easy days — hover or tap any day to see its hotel, meals and sights beside you.</p>
              </div>

              <div className="lxjt2-split lx2i-reveal">
                {/* LEFT — the itinerary timeline */}
                <ol className="lxjt2-days">
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
                            <span className="lxjt2-day__body"><span className="lxjt2-day__bodyin">
                              {d.body}
                              <span className="lxjt4-mdetails">
                                <span className="lxjt4-mfact"><Hotel size={13} /> <span>{d.hotel}{d.stars > 0 && <span className="lxjt4-mstars">{'★'.repeat(d.stars)}</span>}</span></span>
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

              {/* MOBILE ONLY — the journey in pictures */}
              <div className="lxjt2-rail" role="group" aria-label="The journey in pictures">
                {ITINERARY.map((d) => (
                  <div key={d.day} className="lxjt2-railcard" style={{ backgroundImage: `url(${sizedUnsplash(d.img, 640)})` }}>
                    <span className="lxjt2-railcard__day">{d.day}</span>
                    <span className="lxjt2-railcard__city"><MapPin size={13} /> {d.place}</span>
                  </div>
                ))}
              </div>

              <p className="lxjt2-note lx2i-reveal"><Check size={15} strokeWidth={2.4} /> Everything above is included in your price — stays, meals, sightseeing and private transfers.</p>
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
          <section className="lxjt-book tha-book-section tha2-section" id="dates">
            <div className="lx2i-container tha2-wrap">
              <div className="lxjt-head lxjt-head--center lx2i-reveal">
                <span className="lx2i-eyebrow">// FIXED GROUP DEPARTURES · 2026</span>
                <h2 className="lx2i-h2">Book now in <strong>three easy steps</strong></h2>
                <p className="tha2-steplede">Pick a date, tell us who&rsquo;s travelling, and choose how to pay &mdash; it takes about two minutes.</p>
              </div>

              {/* Book with confidence */}
              <div className="tha2-confidence lx2i-reveal">
                <span className="tha2-confidence__ic"><Lock size={22} strokeWidth={2} /></span>
                <div className="tha2-confidence__tx">
                  <h3>Book with confidence</h3>
                  <p>Encrypted checkout. Your 20% deposit is protected, and you can talk to a curator first, <strong>FREE</strong>.</p>
                </div>
              </div>

              {/* Booking card */}
              <div className="tha2-card lx2i-reveal">
                <div className="tha2-card__col tha2-card__col--dates">
                <div className="tha2-step">
                  <span className="tha2-step__n">1</span>
                  <h3 className="tha2-step__t">Choose your date</h3>
                </div>

                <ul className="tha2-deps" role="radiogroup" aria-label="Choose a departure date">
                  {DEPARTURES.map((d, i) => {
                    const on = selectedDep === i;
                    return (
                      <li key={d.date}>
                        <button
                          type="button"
                          role="radio"
                          aria-checked={on}
                          className={`tha2-dep ${on ? 'is-on' : ''}`}
                          onClick={() => setSelectedDep(i)}
                        >
                          <span className="tha2-dep__left">
                            <span className="tha2-dep__date">{d.date}</span>
                            <span className={`tha2-dep__seats tha2-dep__seats--${d.level}`}>{seatText(d)}</span>
                          </span>
                          <span className="tha2-dep__price">{inr(d.price)}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
                </div>

                <div className="tha2-card__col tha2-card__col--pay">
                <div className="tha2-step">
                  <span className="tha2-step__n">2</span>
                  <h3 className="tha2-step__t">Who&rsquo;s travelling?</h3>
                </div>
                {/* travellers */}
                <div className="tha2-travellers">
                  <div className="tha2-travrow">
                    <span className="tha2-travrow__lbl">Adults <small>Age 12+</small></span>
                    <div className="lxjt-stepper">
                      <button type="button" aria-label="Fewer adults" onClick={() => dropAdult(adults - 1)} disabled={adults <= 1}><Minus size={15} /></button>
                      <span className="lxjt-stepper__val">{adults}</span>
                      <button type="button" aria-label="More adults" onClick={addAdult} disabled={travellers >= MAX_PARTY}><Plus size={15} /></button>
                    </div>
                  </div>
                  <div className="tha2-travrow">
                    <span className="tha2-travrow__lbl">Children <small>Age 2&ndash;11</small></span>
                    <div className="lxjt-stepper">
                      <button type="button" aria-label="Fewer children" onClick={() => dropChild(children - 1)} disabled={children <= 0}><Minus size={15} /></button>
                      <span className="lxjt-stepper__val">{children}</span>
                      <button type="button" aria-label="More children" onClick={addChild} disabled={travellers >= MAX_PARTY}><Plus size={15} /></button>
                    </div>
                  </div>
                </div>

                <div className="tha2-step">
                  <span className="tha2-step__n">3</span>
                  <h3 className="tha2-step__t">Choose how to pay</h3>
                </div>
                {/* pay options */}
                <div className="tha2-pay" role="radiogroup" aria-label="Payment option">
                  <button type="button" role="radio" aria-checked={payMode === 'deposit'} className={`tha2-payopt ${payMode === 'deposit' ? 'is-on' : ''}`} onClick={() => setPayMode('deposit')}>
                    <span className="tha2-payopt__t">Pay a Deposit</span>
                    <span className="tha2-payopt__amt">{inr(depositTotal)}</span>
                    <span className="tha2-payopt__sub">20% to confirm</span>
                  </button>
                  <button type="button" role="radio" aria-checked={payMode === 'full'} className={`tha2-payopt ${payMode === 'full' ? 'is-on' : ''}`} onClick={() => setPayMode('full')}>
                    <span className="tha2-payopt__t">Pay in Full</span>
                    <span className="tha2-payopt__amt">{inr(total)}</span>
                    <span className="tha2-payopt__sub">Settle full today</span>
                  </button>
                </div>

                <button type="button" className="tha2-cta" onClick={() => { setBookingDone(false); setDetailsOpen(true); }}>
                  Fill in traveller details <ArrowRight size={17} />
                </button>
                <p className="tha2-secure"><Lock size={14} /> Nothing is charged yet &mdash; you&rsquo;ll confirm flights, beds and who&rsquo;s travelling next</p>
                </div>
              </div>
            </div>
          </section>

          {/* ============ ASSURANCE BAND (trust badges) ============ */}
          <section className="tha-assure">
            <div className="lx2i-container">
              <div className="tha-assure__grid">
                {ASSURE.map(({ icon: Icon, label, note, stars, to }) =>
                  stars ? (
                    <a
                      key={label}
                      href={to}
                      onClick={navClick(to)}
                      className="tha-assure__item tha-assure__item--link"
                    >
                      <span className="tha-assure__ic"><Icon size={22} strokeWidth={1.7} /></span>
                      <span className="tha-assure__tx">
                        <span className="tha-assure__ratingline">
                          <strong>{label}</strong>
                          <span className="tha-assure__stars" aria-hidden="true">
                            {[...Array(5)].map((_, i) => <Star key={i} size={13} fill="currentColor" strokeWidth={0} />)}
                          </span>
                        </span>
                        <span>{note}</span>
                      </span>
                      <ArrowRight className="tha-assure__go" size={18} />
                    </a>
                  ) : (
                    <div key={label} className="tha-assure__item">
                      <span className="tha-assure__ic"><Icon size={22} strokeWidth={1.7} /></span>
                      <span className="tha-assure__tx"><strong>{label}</strong><span>{note}</span></span>
                    </div>
                  )
                )}
              </div>
            </div>
          </section>

          {/* ============ POLICIES ============ */}
          <section className="lxjt-terms lxjt3-policies" id="terms">
            <div className="lx2i-container">
              <div className="lxjt-head lx2i-reveal">
                <span className="lx2i-eyebrow">// BEFORE YOU BOOK</span>
                <h2 className="lx2i-h2">The <strong>policies</strong></h2>
                <p className="lxjt-lead">Booking, cancellation and the full terms &mdash; pick a section, skim the essentials, and open the full detail whenever you need it.</p>
              </div>

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

          {/* ============ REVIEWS — marquee of real travellers (design from /journeys/japan-2) ============ */}
          <section className="h26-reviews" id="reviews">
            <div className="h26-head">
              <p className="h26-label lx2i-reveal">Travelled, and came back happy</p>
              <h2 className="h26-h2 lx2i-reveal">Travellers who trusted us with Thailand.</h2>
              <p className="hi-rev-sub lx2i-reveal">Couples and honeymooners, multi-generational families, friends and groups.</p>
            </div>

            {/* Independent-rating trust strip: overall score + Google / Tripadvisor */}
            <div className="hi-rtrust lx2i-reveal">
              <div className="hi-rtrust-overall">
                <strong>4.8</strong>
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
                      <img src={sizedUnsplash(r.ids[0], 600)} alt={r.trip} loading="lazy" />
                      <span className="h26-rev-tour">{r.trip}</span>
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
              <a href="#dates" onClick={navClick('#dates')} className="h26-btn h26-btn-pill">Book this trip <ArrowUpRight size={16} /></a>
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
                      <div className="lxjt-sim__meta"><Clock size={12} /> {s.nights}<span className="lxjt-sim__dot">&middot;</span><Users size={12} /> Private tour</div>
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

          {/* ============ FINAL CTA ============ */}
          <section className="lx2i-cta">
            <div className="lx2i-cta__bg" style={{ backgroundImage: `url(${sizedUnsplash('1508009603885-50cf7c579365', 1800)})` }} />
            <div className="lx2i-cta__veil" />
            <div className="lx2i-container lx2i-cta__inner lx2i-reveal">
              <span className="lx2i-eyebrow lx2i-eyebrow--light">READY WHEN YOU ARE</span>
              <h2 className="lx2i-cta__title">Five days in Thailand,<br /><strong>from just {inr(PRICE)} per person.</strong></h2>
              <p className="lx2i-cta__sub">Beaches, temples and wildlife on a private tour, with every transfer, hotel and key meal handled &mdash; confirm your seats today with a 20% deposit.</p>
              <div className="lx2i-cta__actions">
                <a href="#dates" onClick={navClick('#dates')} className="lx2i-btn lx2i-btn--primary lx2i-btn--lg"><Zap size={17} /> Book now</a>
                <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="lx2i-btn lx2i-btn--outline lx2i-btn--lg"><MessageCircle size={16} /> WhatsApp us</a>
              </div>
              <p className="lx2i-cta__hours">Travel experts available 9am–9pm IST, every day</p>
            </div>
          </section>

          {/* ============ FOOTER ============ */}
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

        {/* ============ MOBILE THUMB-REACH BAR — book now ============ */}
        <div className="lxjt-thumbbar">
          <div className="lxjt-thumbbar__nudge">
            <small>From {inr(PRICE)} pp · 4 nights</small>
            <strong>Only 4 seats left on the next date</strong>
          </div>
          <a href="#dates" onClick={navClick('#dates')} className="lxjt-thumbbar__book">
            <Calendar size={17} /> Check Availability
          </a>
          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="lxjt-thumbbar__ico" aria-label="Message us on WhatsApp"><MessageCircle size={20} /></a>
        </div>

        {/* ============ FLOATING BOOK CTA (desktop) ============
            Below 640px the thumb-bar carries the booking CTA; above it the only
            way back to the card was the header pill. This stacks on the same
            right rail as the Enaya button, directly above it. */}
        <a
          href="#dates"
          onClick={navClick('#dates')}
          className={`tha2-bookfab ${chatOpen || !pastHero ? 'is-hidden' : ''}`}
          aria-hidden={chatOpen || !pastHero}
          tabIndex={chatOpen || !pastHero ? -1 : undefined}
        >
          <Calendar size={17} strokeWidth={2} />
          <span>Book now</span>
          <span className="tha2-bookfab__px">from {inr(PRICE)} pp</span>
        </a>

        {/* ============ FLOATING AI BUTTON (desktop) ============ */}
        <button className={`lx2i-aifab ${chatOpen ? 'is-hidden' : ''}`} aria-label="Open Enaya, the AI travel assistant" onClick={() => setChatOpen(true)}>
          <Sparkles size={20} /><span>Ask Enaya</span>
        </button>

        {/* ============ FULL POLICY DETAIL MODAL ============ */}
        {termsModalOpen && (
          <div className="lxjt-tc" role="dialog" aria-modal="true" aria-label={`${activeCat.label} — full detail`}>
            <div className="lxjt-tc__scrim" onClick={() => setTermsModalOpen(false)} />
            <div className="lxjt-tc__panel">
              <div className="lxjt-tc__head">
                <div>
                  <span className="lx2i-eyebrow">{activeCat.label}</span>
                  <h3 className="lxjt-tc__title">{activeCat.label} — Pattaya &amp; Bangkok Escape</h3>
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
                <p className="lxjt-tc__note">These are the Cox &amp; Kings booking conditions for this tour. Full contractual terms are provided with your booking confirmation.</p>
              </div>
              <div className="lxjt-tc__foot">
                <button type="button" className="lx2i-btn lx2i-btn--primary" onClick={() => setTermsModalOpen(false)}>Got it</button>
                <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="lx2i-btn lx2i-btn--outline"><MessageCircle size={15} /> Ask a question</a>
              </div>
            </div>
          </div>
        )}

        {/* ============ TRAVELLER DETAILS DRAWER (from the booking CTA) ============ */}
        {detailsOpen && (
          <div className="tha2-bd" role="dialog" aria-modal="true" aria-label="Traveller details">
            <div className="tha2-bd__scrim" onClick={() => setDetailsOpen(false)} />
            <aside className="tha2-bd__panel">
              <button className="tha2-bd__close" aria-label="Close" onClick={() => setDetailsOpen(false)}><X size={18} /></button>

              {bookingDone ? (
                <div className="tha2-bd__body">
                  <div className="tha2-bd__done">
                    <span className="tha2-bd__doneic"><CheckCircle2 size={34} strokeWidth={1.5} /></span>
                    <h3>Seats held for {lead.title} {lead.first} {lead.last}</h3>
                    <p>
                      {travellers} {travellers === 1 ? 'traveller' : 'travellers'} on the {dep.date} departure
                      {withFlights ? ', flying from Mumbai' : ', land only — you arrange your own flights'}
                      {extraBed ? ', with an extra bed' : ''}. We&rsquo;ll call {lead.phone} to confirm, and we&rsquo;ve
                      emailed your visa checklist &mdash; the Thailand visa isn&rsquo;t part of the package.
                    </p>
                    <div className="tha2-bd__donerow">
                      <a href={PHONE_TEL} className="lx2i-btn lx2i-btn--primary"><Phone size={14} /> {PHONE_DISPLAY}</a>
                      <button type="button" className="lx2i-btn lx2i-btn--outline" onClick={() => setDetailsOpen(false)}>Close</button>
                    </div>
                  </div>
                </div>
              ) : (
                <form
                  className="tha2-bd__form"
                  onSubmit={(e) => { e.preventDefault(); setBookingDone(true); }}
                >
                  <header className="tha2-bd__head">
                    <span className="lx2i-eyebrow">ALMOST THERE &middot; NOTHING CHARGED YET</span>
                    <h3 className="tha2-bd__title">Who&rsquo;s travelling?</h3>
                    <p className="tha2-bd__sub">
                      {dep.date} departure &middot; {payMode === 'deposit' ? '20% deposit' : 'paying in full'} &middot;{' '}
                      <span className="tha2-bd__reqkey"><i>*</i> required</span>
                    </p>
                  </header>

                  <div className="tha2-bd__body">
                    {/* ---- Every traveller, named ---- */}
                    <fieldset className="tha2-bd__set tha2-bd__set--first">
                      <legend>Travellers ({travellers})</legend>
                      <p className="tha2-bd__hint">
                        Names exactly as they appear on each passport. We only need a number for the lead traveller
                        &mdash; that&rsquo;s who we call if anything about the trip changes.
                      </p>

                      {adultGuests.map((g, i) => renderGuest(g, i, 'adult'))}
                      {childGuests.map((g, i) => renderGuest(g, i, 'child'))}

                      <div className="tha2-bd__addrow">
                        <button type="button" className="tha2-bd__add" onClick={addAdult} disabled={travellers >= MAX_PARTY}>
                          <UserPlus size={15} /> Add an adult
                        </button>
                        <button type="button" className="tha2-bd__add" onClick={addChild} disabled={travellers >= MAX_PARTY}>
                          <UserPlus size={15} /> Add a child
                        </button>
                      </div>
                      {travellers >= MAX_PARTY && (
                        <p className="tha2-bd__hint tha2-bd__hint--cap">
                          {MAX_PARTY} is the most we can book online &mdash; call us for a larger group.
                        </p>
                      )}
                    </fieldset>

                    {/* ---- Flights + beds ---- */}
                    <fieldset className="tha2-bd__set">
                      <legend>Flights &amp; beds</legend>

                      <label className={`tha2-bd__opt ${withFlights ? 'is-on' : ''}`}>
                        <input
                          type="checkbox"
                          checked={withFlights}
                          onChange={(e) => setWithFlights(e.target.checked)}
                        />
                        <span className="tha2-bd__optbox" aria-hidden="true"><Check size={13} strokeWidth={3} /></span>
                        <span className="tha2-bd__opttx">
                          <span className="tha2-bd__optt"><Plane size={15} /> Include return flights from Mumbai</span>
                          <span className="tha2-bd__opts">
                            Already booked your own, or flying from another city? Untick this and we&rsquo;ll take{' '}
                            {inr(FLIGHT_CREDIT)} per person off the price &mdash; you&rsquo;ll join the group in Bangkok.
                          </span>
                        </span>
                      </label>

                      <label className={`tha2-bd__opt ${extraBed ? 'is-on' : ''}`}>
                        <input
                          type="checkbox"
                          checked={extraBed}
                          onChange={(e) => setExtraBed(e.target.checked)}
                        />
                        <span className="tha2-bd__optbox" aria-hidden="true"><Check size={13} strokeWidth={3} /></span>
                        <span className="tha2-bd__opttx">
                          <span className="tha2-bd__optt"><BedDouble size={15} /> Add an extra bed</span>
                          <span className="tha2-bd__opts">
                            A rollaway bed in a shared room, for a third guest or an older child. Flat {inr(EXTRA_BED_FEE)}.
                          </span>
                        </span>
                      </label>
                    </fieldset>

                    {/* ---- What's in, what's not ---- */}
                    <fieldset className="tha2-bd__set">
                      <legend>What this price covers</legend>
                      <ul className="tha2-bd__points">
                        {bookingPoints(withFlights).map((p) => (
                          <li key={p.text} className={`tha2-bd__point tha2-bd__point--${p.tone}`}>
                            <span className="tha2-bd__pointic" aria-hidden="true">
                              {p.tone === 'on' ? <Check size={12} strokeWidth={3} /> : <X size={12} strokeWidth={3} />}
                            </span>
                            <span>{p.text}</span>
                          </li>
                        ))}
                      </ul>
                    </fieldset>

                    {/* ---- Live bill ---- */}
                    <div className="tha2-bd__bill">
                      <div className="tha2-bd__billrow">
                        <span>{inr(pp)} × {travellers} {travellers === 1 ? 'traveller' : 'travellers'}</span>
                        <span>{inr(fare)}</span>
                      </div>
                      {!withFlights && (
                        <div className="tha2-bd__billrow tha2-bd__billrow--credit">
                          <span>Land only &mdash; flights removed</span>
                          <span>&minus;{inr(flightCredit)}</span>
                        </div>
                      )}
                      {extraBed && (
                        <div className="tha2-bd__billrow">
                          <span>Extra bed</span>
                          <span>+{inr(bedFee)}</span>
                        </div>
                      )}
                      <div className="tha2-bd__billrow tha2-bd__billrow--total">
                        <span>Tour total</span>
                        <span>{inr(total)}</span>
                      </div>
                      <div className="tha2-bd__billrow tha2-bd__billrow--due">
                        <span>{payMode === 'deposit' ? 'Due today (20% deposit)' : 'Due today (paid in full)'}</span>
                        <span>{inr(dueToday)}</span>
                      </div>
                      {balance > 0 && (
                        <p className="tha2-bd__balance">
                          {inr(balance)} balance due 30 days before departure. Visa fee is separate and paid by you.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* The pay button rides the bottom of the drawer, so it stays
                      reachable however long the traveller list grows. */}
                  <footer className="tha2-bd__foot">
                    <button type="submit" className="tha2-cta tha2-bd__submit" disabled={!formOk}>
                      <Lock size={15} /> Pay {inr(dueToday)} and secure {travellers === 1 ? 'seat' : 'seats'}
                    </button>
                    {!formOk && (
                      <p className="tha2-bd__req">
                        {!namedOk
                          ? 'Add a first and last name for every traveller to continue.'
                          : 'Add the lead traveller’s phone number to continue.'}
                      </p>
                    )}
                  </footer>
                </form>
              )}
            </aside>
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

      {/* AI chat (Enaya) */}
      <ChatBot open={chatOpen} onOpenChange={setChatOpen} hideFab name="Enaya" />
    </>
  );
}
