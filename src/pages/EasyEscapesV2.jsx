/* ============================================================================
   Cox & Kings — EASY ESCAPES, v2  (route: /easy-escapes-v2)

   A fork of /easy-escapes taken after its brief-conformance pass, carrying the
   four things that pass left open. v1 is untouched, so the two can be read side
   by side and only these four differences will show:

     §3  How Easy Is It?   the brief's own heading, and steps numbered
                           "01 — Explore" instead of a badge on the disc.
     §4  Sorting           Recommended (now the default), Newest and Departure
                           date — the three the brief asks for and the page did
                           not have. Departure dates are ISO in the DATA now, so
                           they can actually be ordered; "12 Oct" is derived for
                           display rather than stored, which is why the card and
                           the booking drawer needed no change at all.
     §5  Destination       Malaysia and Singapore have packages. Both sat on the
                           brief's destination list at zero, so two of the nine
                           options were a dead end.
     §7  Scalability       the future price tiers — ₹60K–₹1L, Premium, Luxury —
                           are declared in the data, and each appears on its own
                           the day a package lands in it.

   NOT changed, deliberately:

     §2  "Why Cox & Kings Easy Escapes?" is still absent. Asked for.
     §8  The palette stays this site's sienna and ivory, not the brief's gold.
         Asked for — and worth noting the brief asks for gold AND for
         consistency with the existing Cox & Kings language, which is sienna, so
         those two requirements were never compatible.

   Everything below this line is v1's file, its own comments included.
   ---------------------------------------------------------------------------
   Cox & Kings — EASY ESCAPES  (route: /easy-escapes, alias /book-online)

   An E-COMMERCE CATALOGUE, not a package listing page. The difference is that a
   listing page ends at "enquire" and hands the visitor to a salesperson, while
   this one carries a person from discovery all the way through payment without
   anyone having to pick up a phone. Everything below follows from that:

     · every card states a bookable price, real departure dates and what is
       included, because there is nobody to ask;
     · the primary action on every card is BOOK ONLINE, never "enquire";
     · the booking happens in a drawer ON this page — date, travellers, extras,
       details, pay — so the catalogue is never lost behind a funnel;
     · support is KEPT but demoted to the secondary action: WhatsApp on every
       card, the callback dialog in the closing CTA, Einaya on the fab, and the
       specialist bar on mobile. Never a blocker in the buying path.

   ---------------------------------------------------------------------------
   DESIGN LANGUAGE — this page is built ON /journeys/japan-2 and /journeys4,
   not beside them. It wears the same root class stack (`h26 jl jl2 jp jj2`)
   and therefore the same components, unchanged:

     · `jl-hero` + `jl-hero-bg/veil/inner`      the hero banner
     · `jp-about` + `jp-facts` / `jp-fact`      the intro and "good to know"
     · `jl2-shell` / `jl2-sidebar` / `jl2-results`   the filter rail + results
     · `j2-group` / `j2-option` / `j2-preset` / `j2-budget`   the filter controls
     · `jl-card` and everything under it        the product card
     · `jl-sort` / `jl-active` / `jl-empty` / `jj2-more`   the results chrome
     · `jl-lb`                                  the photo lightbox
     · `jj2-choose` / `jj2-pick`                the dark step strip
     · `jp-highlights` / `jp-hl`                the four-corners grid
     · `h26-reviews` / `hi-rtrust` / `h26-marquee`   the testimonials
     · `jj2-pav`                                "people also view"
     · `jl-cta`, `jj2-thumbbar`, `lx2i-aifab`   closing CTA, mobile bar, Einaya

   EasyEscapes.css therefore holds almost nothing: only the booking drawer,
   which is genuinely new — no other page on this site takes a payment — and a
   handful of tuning rules where a borrowed component carries different content.

   MOTION — the same framer-motion `Reveal` / `WordReveal` the whole /journeys
   family uses, so the page reveals with an identical feel, plus one GSAP
   ScrollTrigger for the hero's photographic parallax and the count-ups. Both
   are reduced-motion gated, and NOTHING is hidden in CSS: every resting state
   is the visible one, so the catalogue is complete, filterable and bookable
   with animation off.

   ---------------------------------------------------------------------------
   THE FILTERS — the brief's three facets.

     Travel Style   Adventure · Culture & Heritage · Honeymoon / Romantic ·
                    Short Getaways                        (multi-select)
     Duration       2–3 · 4–5 · 6–7 · 8+ nights           (multi-select)
     Budget         a per-person ceiling                  (slider + presets)

   Plus a destination search, because a catalogue this size is unusable without
   one — it is the same `jj2-city` control /journeys/japan-2 uses for cities.

   HOW THIS SCALES. Nothing in the layout knows how many facets there are.
   TRAVEL_STYLES and DURATIONS drive the rail, the mobile drawer, the chips and
   the counts; the budget bounds are DERIVED from the catalogue itself
   (PRICE_MIN / PRICE_MAX below), so the slider re-scales on its own the day
   more expensive journeys are loaded in. Adding a travel style, a duration
   band or a whole new facet is a data change, and widening the price range is
   a data change. Filter state lives in the QUERY STRING, so every view is a
   shareable, bookmarkable URL and a campaign can land someone directly on
   "Honeymoon, up to ₹50,000".

   NOTE — the release phasing of the wider Book Online range is a PLANNING
   matter and is deliberately absent from the interface. A shopper does not
   care which phase they are in; they care what is on the shelf today. The
   journeys above this catalogue are reached the way they always were, through
   "people also view" and a specialist.
   ========================================================================== */

import {
  useState, useEffect, useMemo, useRef, useCallback, useLayoutEffect,
} from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Phone, PhoneCall, MessageCircle, ArrowUpRight, ArrowRight,
  MapPin, X, ChevronDown, ChevronLeft, ChevronRight,
  Star, Clock, Calendar, CalendarDays, Users, Images, Compass,
  SlidersHorizontal, Check, Plus, Minus, Sparkles, Search, Wallet,
  Mountain, Landmark, Heart, Sun, Waves, Building2, Zap, Lock,
  Award, ReceiptText, CalendarCheck, ShieldCheck, Headset,
  CreditCard, Headphones, Ticket,
} from 'lucide-react';
import { SmartLink as Link, CALLBACK, useScheduleCall } from '../components/ScheduleCall';
import { SiteNav, SiteFooter } from '../components/SiteChrome';
import { img } from '../data/v3content';
import ChatBot from '../components/ChatBot';
import './Home2026.css';
import './Home2026Improved.css';
import './Luxe2Improved.css';
import './Journeys.css';
import './Journeys2.css';
import './Journeys4.css';
import './JapanJourneys.css';
import './JapanJourneys2.css';
import './EasyEscapes.css';
import './EasyEscapesV2.css';

gsap.registerPlugin(ScrollTrigger);

/* The direct line, for the page BODY only — the card enquiry CTAs, the empty
   state and the mobile specialist bar. The nav and footer carry their own copy
   (CONTACT_CK in SiteChrome), which is why no number is printed here. */
const CONTACT = {
  phoneHref: 'tel:+918556001700',
  whatsappHref: 'https://wa.me/918556001700',
};

const U = (id) => `https://images.unsplash.com/photo-${id}`;

const HERO_IMG = U('1506973035872-a4ec16b8e8d9');

/* A shared photo pool, harvested from the existing CK pages, so every card's
   lightbox has more than one frame in it. */
const POOL = [
  U('1564507592333-c60657eea523'), U('1602216056096-3b40cc0c9944'),
  U('1477587458883-47145ed94245'), U('1528181304800-259b08848526'),
  U('1469521669194-babb45599def'), U('1524492412937-b28074a5d7da'),
];

const inr = (n) => `₹${Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
/* Budget labels in the units Indian travellers actually use. */
const fmtK = (n) => (n >= 100000 ? `₹${(n / 100000).toFixed(n % 100000 ? 1 : 0)}L` : `₹${Math.round(n / 1000)}K`);

/* ---------------------------------------------------------------------------
   THE FIVE FACETS, in the brief's order and with the brief's values.

   Every one is a multi-select checkbox group: a shopper who will take Bali OR
   Thailand should not have to run the catalogue twice. Values inside a facet
   are OR'd, facets are AND'd — the ordinary e-commerce contract.
   --------------------------------------------------------------------------- */

/* FACET 1 · Budget. A one-thumb "up to" bar with preset pills, the same
   control /journeys/japan-2 uses, rather than the brief's four fixed bands —
   asked for directly, and it is also what keeps this page's filter rail
   recognisable as the same rail every other Cox & Kings listing wears.

   The bands survive as the PRESETS beneath the bar, derived from the catalogue
   rather than typed out, which is what answers the brief's §7 scalability point
   now that the tier list is gone: raise the ceiling and the bar, its end labels
   and its pills all re-scale themselves with no copy to edit.

   Kept below, unused by the rail, purely as documentation of the four bands the
   brief named — so the next person can see what was asked for and what was
   chosen instead. */
const BRIEF_PRICE_BANDS = [
  'Under ₹30,000', '₹30,000–₹40,000', '₹40,000–₹50,000', '₹50,000–₹60,000',
];

/* FACET 2 · Destination. The brief's list, verbatim and in its order. Malaysia
   and Singapore have no qualifying package on the shelf yet, so they render
   greyed with a 0 rather than being quietly dropped — the brief's own note is
   that the final list follows the packages that qualify, and this is what that
   looks like while the inventory catches up. "Other eligible destinations" is
   the catch-all the brief asks for; Nepal sits there today. */
const DESTINATIONS = [
  'Bali', 'Vietnam', 'Thailand', 'Sri Lanka', 'Malaysia',
  'Singapore', 'Dubai', 'India', 'Other eligible destinations',
];

/* FACET 3 · Traveller type. Who the journey is shaped for, which is the one
   thing a shopper cannot read off a photograph. */
const TRAVELLER_TYPES = ['Family', 'Couples', 'Friends', 'Solo', 'Seniors'];

/* FACET 4 · Travel style. The brief's seven.

   "Short Getaways" is listed as a STYLE though it reads like a duration. Kept
   as a style and defined editorially — trips shaped like a long weekend — with
   style and duration left as INDEPENDENT facets, so "Culture & Heritage + 2–3
   nights" is still reachable and the two never fight. Worth confirming. */
const TRAVEL_STYLES = [
  { value: 'Beach Escapes', icon: Waves },
  { value: 'City Breaks', icon: Building2 },
  { value: 'Family Holidays', icon: Users },
  { value: 'Adventure', icon: Mountain },
  { value: 'Culture & Heritage', icon: Landmark },
  { value: 'Honeymoon / Romantic', icon: Heart },
  { value: 'Short Getaways', icon: Sun },
];
const STYLE_VALUES = TRAVEL_STYLES.map((s) => s.value);

/* FACET 5 · Duration. The brief's four bands, as checkboxes — asked for
   directly, and unlike budget this facet stays multi-select: the bands are OR'd,
   so "2–3 or 6–7 nights" is one query rather than two runs of the catalogue.
   `max: null` is the open-ended 8+ band. */
const DURATIONS = [
  { value: '2–3 Nights', min: 2, max: 3 },
  { value: '4–5 Nights', min: 4, max: 5 },
  { value: '6–7 Nights', min: 6, max: 7 },
  { value: '8+ Nights', min: 8, max: null },
];
const inBand = (nights, b) => nights >= b.min && (b.max === null || nights <= b.max);

/* The brief asks for six orders. Three of them — Recommended, Newest and
   Departure date — had nothing in the data to sort by, which is the real reason
   they were missing; all three are now backed by a field (`score`, `addedAt`,
   `departAt`, derived in E below). The three the page added on its own are kept
   underneath, because none of them contradicts the brief.

   The brief's word is "Popularity"; the label says both, so the mapping between
   the brief and the control is legible to whoever reviews this. */
const SORTS = [
  { key: 'recommended', label: 'Recommended' },
  { key: 'price-asc', label: 'Price · low to high' },
  { key: 'price-desc', label: 'Price · high to low' },
  { key: 'popular', label: 'Popularity · most booked' },
  { key: 'newest', label: 'Newest on the shelf' },
  { key: 'departure', label: 'Departure date · soonest first' },
  { key: 'nights-asc', label: 'Duration · shortest first' },
  { key: 'nights-desc', label: 'Duration · longest first' },
  { key: 'rating', label: 'Rating · highest first' },
];
const DEFAULT_SORT = 'recommended';

/* ---------------------------------------------------------------------------
   ⚠ PLACEHOLDER CONTENT — PRICES, DEPARTURE DATES AND IMAGERY.

   Every price, date and inclusion below is illustrative. Before this page takes
   a real booking all three must come from the reservations system rather than a
   constant; the shape of one record here is the shape of one API row.
   Imagery is stock, drawn from the pool already used across the site — swap in
   the real product photography when it exists.
   --------------------------------------------------------------------------- */
/* People frames. An escape is who you go with as much as where you go, and a
   carousel of empty landscapes answers none of the questions a shopper would
   otherwise put to a salesperson — who else is on this, what does the group
   look like. Woven BETWEEN the destination frames below, never appended, so
   the set never reads as "the real photos, then the people ones". */
const PEOPLE = [
  U('1529156069898-49953e39b3ac'),  /* travellers arm in arm, looking out */
  U('1511632765486-a01980e01a18'),  /* four friends at golden hour */
  U('1539635278303-d4002c07eae3'),  /* a small group on a mountain trail */
];

/* Eight frames per escape: its own hero, then places and people alternating.
   Feeds both the card lightbox and the carousel at the top of the booking
   drawer, so the count on the card is always the count you get. */
const gallery = (image) => {
  const places = [...new Set([image, ...POOL])];
  /* A card's own photo can now BE one of the people frames, so drop it from the
     woven set — otherwise the same picture opens the carousel and turns up
     again three frames later. The card's "N photos" count reads this array, so
     it stays honest either way. */
  const people = PEOPLE.filter((p) => p !== image);
  return [places[0], places[1], people[0], places[2], places[3],
    people[1], places[4], people[2]].filter(Boolean);
};

/* Departure dates are STORED as ISO and formatted for display, never the other
   way round. "12 Oct" cannot be ordered, cannot be compared with today and does
   not survive a year boundary — which is exactly why the brief's departure-date
   sort could not be built on it. `dates` keeps its old name and its old labels,
   so the card and the booking drawer are untouched by this. */
const IST = 'Asia/Kolkata';
const at = (iso) => new Date(`${iso}T00:00:00+05:30`).getTime();
const fmtDep = (iso) => new Date(`${iso}T00:00:00+05:30`)
  .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', timeZone: IST });

/* "Recommended", until merchandising owns a hand-ranked order. A stated blend
   of how much a journey sells, how well it scores and how many people scored
   it — so the default order can be explained to whoever asks why their package
   is fourth, and changing the answer means changing three numbers in one place.
   No copy anywhere depends on the weights. */
const recommendScore = (o) => (
  o.popularity * 0.55
  + (o.rating - 4) * 100 * 0.30
  + (Math.min(o.reviews, 750) / 7.5) * 0.15
);

const E = (o) => ({
  ...o,
  priceLabel: inr(o.price),
  nightsLabel: `${o.nights} nights`,
  daysLabel: `${o.nights + 1}D / ${o.nights}N`,
  gallery: gallery(o.image),
  dates: o.depart.map(fmtDep),   /* display labels, derived */
  departAt: at(o.depart[0]),     /* soonest departure, for the sort */
  addedAt: at(o.added),          /* shelf date, for "Newest" */
  score: recommendScore(o),      /* for "Recommended" */
});

const ALL_ESCAPES = [
  E({ id: 'pondicherry', title: 'Pondicherry: The French Quarter', place: 'Pondicherry', region: 'India',
    destination: 'India', travellers: ['Couples', 'Solo', 'Seniors'],
    blurb: 'Mustard-yellow colonial streets, a seafront promenade at dawn and long café mornings.',
    styles: ['City Breaks', 'Culture & Heritage', 'Short Getaways'], nights: 2, price: 15900, rating: 4.6, reviews: 214,
    season: 'Oct–Mar', popularity: 74, image: U('1524413840807-0c3cb6fa808d'),
    cities: ['Pondicherry', 'Auroville', 'Chennai'],
    includes: ['2 nights in a heritage boutique stay', 'Daily breakfast', 'Airport transfers', 'Guided White Town walk'],
    added: '2026-03-04',
    depart: ['2026-10-12', '2026-10-26', '2026-11-09', '2026-11-23', '2026-12-07'] }),
  E({ id: 'rishikesh', title: 'Rishikesh: Rapids & River Yoga', place: 'Rishikesh', region: 'India',
    destination: 'India', travellers: ['Friends', 'Solo'],
    blurb: 'Grade III white water in the morning, a riverside camp and the Ganga aarti after dark.',
    styles: ['Adventure', 'Short Getaways'], nights: 3, price: 18500, rating: 4.7, reviews: 388,
    season: 'Sep–Apr', popularity: 88, image: U('1544735716-392fe2489ffa'),
    cities: ['Rishikesh', 'Haridwar', 'Dehradun'],
    includes: ['3 nights riverside camp', 'All meals', '16 km rafting with certified guides', 'Sunrise yoga session'],
    added: '2026-07-19',
    depart: ['2026-10-05', '2026-10-19', '2026-11-02', '2026-11-16', '2026-11-30'] }),
  E({ id: 'munnar', title: 'Munnar & Thekkady Hill Escape', place: 'Kerala', region: 'India',
    destination: 'India', travellers: ['Family', 'Couples', 'Seniors'],
    blurb: 'Tea slopes to spice hills — cool air, plantation walks and a boat ride on Periyar.',
    styles: ['Family Holidays', 'Short Getaways'], nights: 3, price: 19900, rating: 4.5, reviews: 176,
    season: 'Sep–Mar', popularity: 61, image: U('1596604820148-da737958af16'),
    cities: ['Munnar', 'Thekkady', 'Kochi'],
    includes: ['3 nights hill resorts', 'Breakfast & dinner', 'Private car throughout', 'Periyar boat safari'],
    added: '2026-01-28',
    depart: ['2026-10-10', '2026-10-24', '2026-11-14', '2026-12-05'] }),
  E({ id: 'jaipur-agra', title: 'Jaipur & Agra: A Golden Weekend', place: 'Rajasthan & Agra', region: 'India',
    destination: 'India', travellers: ['Family', 'Couples', 'Seniors'],
    blurb: 'The Taj at sunrise, Amber Fort by lunch and the Pink City to yourself after dark.',
    styles: ['City Breaks', 'Culture & Heritage', 'Short Getaways'], nights: 3, price: 21900, rating: 4.8, reviews: 512,
    season: 'Oct–Mar', popularity: 96, image: U('1564507592333-c60657eea523'),
    cities: ['Jaipur', 'Agra', 'Delhi'],
    includes: ['3 nights 4-star hotels', 'Daily breakfast', 'All monument entries', 'English-speaking guide'],
    added: '2026-08-30',
    depart: ['2026-10-11', '2026-10-25', '2026-11-08', '2026-11-22', '2026-12-06', '2026-12-20'] }),
  E({ id: 'goa', title: 'Goa: The Northern Beaches', place: 'Goa', region: 'India',
    destination: 'India', travellers: ['Friends', 'Couples', 'Solo'],
    blurb: 'Assagao mornings, Anjuna sunsets and a shack table booked for every evening.',
    styles: ['Beach Escapes', 'Short Getaways'], nights: 3, price: 22900, rating: 4.5, reviews: 641,
    season: 'Oct–Mar', popularity: 92, image: U('1506973035872-a4ec16b8e8d9'),
    cities: ['Goa', 'Anjuna', 'Assagao'],
    includes: ['3 nights boutique stay', 'Daily breakfast', 'Airport transfers', 'Sunset river cruise'],
    added: '2026-02-11',
    depart: ['2026-10-09', '2026-10-23', '2026-11-13', '2026-11-27', '2026-12-11'] }),
  E({ id: 'coorg', title: 'Coorg: Coffee Country', place: 'Coorg', region: 'India',
    destination: 'India', travellers: ['Couples', 'Family'],
    blurb: 'A plantation bungalow, mist on the estate at six and nothing at all in the diary.',
    styles: ['Honeymoon / Romantic', 'Short Getaways'], nights: 3, price: 24500, rating: 4.6, reviews: 203,
    season: 'Oct–Mar', popularity: 66, image: U('1518709268805-4e9042af9f23'),
    cities: ['Coorg', 'Madikeri', 'Bengaluru'],
    includes: ['3 nights plantation stay', 'All meals', 'Estate walk & coffee tasting', 'Abbey Falls visit'],
    added: '2026-06-05',
    depart: ['2026-10-12', '2026-11-02', '2026-11-23', '2026-12-14'] }),
  E({ id: 'hampi', title: 'Hampi & Badami: Stone Kingdoms', place: 'Karnataka', region: 'India',
    destination: 'India', travellers: ['Solo', 'Friends', 'Couples'],
    blurb: 'A vanished empire in boulder country, and rock-cut caves most people never reach.',
    styles: ['Culture & Heritage'], nights: 4, price: 27900, rating: 4.7, reviews: 148,
    season: 'Oct–Feb', popularity: 58, image: U('1587474260584-136574528ed5'),
    cities: ['Hampi', 'Badami', 'Hospet'],
    includes: ['4 nights hotels', 'Daily breakfast', 'Archaeologist-led walks', 'All transfers'],
    added: '2026-04-17',
    depart: ['2026-10-18', '2026-11-15', '2026-12-06', '2027-01-10'] }),
  E({ id: 'udaipur', title: 'Udaipur: The City of Lakes', place: 'Udaipur', region: 'India',
    destination: 'India', travellers: ['Couples', 'Seniors'],
    blurb: 'A lake-facing room, a boat at golden hour and dinner on a rooftop above Pichola.',
    styles: ['City Breaks', 'Culture & Heritage', 'Honeymoon / Romantic'], nights: 3, price: 29900, rating: 4.9, reviews: 297,
    season: 'Sep–Mar', popularity: 90, image: U('1524492412937-b28074a5d7da'),
    cities: ['Udaipur', 'Kumbhalgarh'],
    includes: ['3 nights lake-view hotel', 'Daily breakfast', 'Private sunset boat', 'City Palace entry & guide'],
    added: '2026-09-02',
    depart: ['2026-10-16', '2026-10-30', '2026-11-13', '2026-11-27', '2026-12-18'] }),
  E({ id: 'nepal', title: 'Nepal: Kathmandu & Pokhara', place: 'Nepal', region: 'Near abroad',
    destination: 'Other eligible destinations', travellers: ['Friends', 'Solo', 'Couples'],
    blurb: 'Durbar squares and prayer flags, then Phewa Lake with the Annapurnas behind it.',
    styles: ['Adventure', 'Culture & Heritage'], nights: 5, price: 33900, rating: 4.6, reviews: 187,
    season: 'Oct–Apr', popularity: 71, image: U('1544005313-94ddf0286df2'),
    cities: ['Kathmandu', 'Pokhara', 'Nagarkot'],
    includes: ['5 nights hotels', 'Daily breakfast', 'Sarangkot sunrise drive', 'All internal transfers'],
    added: '2026-01-15',
    depart: ['2026-10-08', '2026-11-05', '2026-12-03', '2027-01-07'] }),
  E({ id: 'kerala', title: 'Kerala: Backwaters & Fort Kochi', place: 'Kerala', region: 'India',
    destination: 'India', travellers: ['Family', 'Couples', 'Seniors'],
    blurb: 'A private houseboat night on the Vembanad, then Kochi’s Chinese nets and spice lanes.',
    styles: ['Family Holidays', 'Culture & Heritage', 'Honeymoon / Romantic'], nights: 5, price: 34900, rating: 4.8, reviews: 429,
    season: 'Sep–Mar', popularity: 94, image: U('1602216056096-3b40cc0c9944'),
    cities: ['Alleppey', 'Kochi', 'Munnar'],
    includes: ['4 nights hotels + 1 night houseboat', 'All meals on board', 'Kathakali performance', 'Private car & driver'],
    added: '2026-05-23',
    depart: ['2026-10-11', '2026-10-25', '2026-11-15', '2026-11-29', '2026-12-13'] }),
  E({ id: 'thailand', title: 'Bangkok & Pattaya Escape', place: 'Thailand', region: 'Southeast Asia',
    destination: 'Thailand', travellers: ['Friends', 'Couples', 'Family'],
    blurb: 'Temples and street food in the capital, then two slow days on the coast.',
    styles: ['Beach Escapes', 'City Breaks', 'Short Getaways'], nights: 4, price: 38900, rating: 4.5, reviews: 733,
    season: 'Year-round', popularity: 97, image: U('1528181304800-259b08848526'),
    cities: ['Bangkok', 'Pattaya'], to: '/tour-detail-thailand-2',
    includes: ['4 nights 4-star hotels', 'Daily breakfast', 'Coral Island day trip', 'Return airport transfers'],
    added: '2026-08-08',
    depart: ['2026-10-07', '2026-10-21', '2026-11-04', '2026-11-18', '2026-12-02', '2026-12-16'] }),
  E({ id: 'kashmir', title: 'Kashmir: Srinagar & Gulmarg', place: 'Kashmir', region: 'India',
    destination: 'India', travellers: ['Family', 'Couples', 'Seniors'],
    blurb: 'A houseboat on the Dal, shikara mornings and the gondola up towards Apharwat.',
    styles: ['Family Holidays', 'Adventure', 'Honeymoon / Romantic'], nights: 5, price: 39900, rating: 4.8, reviews: 356,
    /* A GROUP TRIP frame rather than a landscape: travellers arm in arm facing
       a mountain cable car, which is the Gulmarg gondola this itinerary
       actually includes. Replaces a stock head-and-shoulders portrait that had
       nothing to do with Kashmir. */
    season: 'Mar–Nov', popularity: 89, image: U('1529156069898-49953e39b3ac'),
    cities: ['Srinagar', 'Gulmarg', 'Pahalgam'],
    includes: ['3 nights hotel + 2 nights houseboat', 'Breakfast & dinner', 'Gulmarg gondola phase I', 'Shikara ride'],
    added: '2026-03-27',
    depart: ['2026-10-10', '2026-10-24', '2026-11-07', '2026-11-21'] }),
  E({ id: 'sikkim', title: 'Sikkim & Darjeeling Himalayan Trail', place: 'Sikkim & Bengal', region: 'India',
    destination: 'India', travellers: ['Friends', 'Solo', 'Couples'],
    blurb: 'Monasteries above the cloud line, the toy train, and Kanchenjunga at first light.',
    styles: ['Adventure', 'Culture & Heritage'], nights: 7, price: 41900, rating: 4.7, reviews: 162,
    season: 'Oct–May', popularity: 63, image: U('1571896349842-33c89424de2d'),
    cities: ['Gangtok', 'Darjeeling', 'Pelling'],
    includes: ['7 nights hotels', 'Breakfast & dinner', 'Tiger Hill sunrise', 'All permits & transfers'],
    added: '2026-06-30',
    depart: ['2026-10-12', '2026-11-09', '2026-12-07', '2027-01-11'] }),
  E({ id: 'meghalaya', title: 'Meghalaya: Living Root Bridges', place: 'Meghalaya', region: 'India',
    destination: 'India', travellers: ['Friends', 'Solo', 'Couples'],
    blurb: 'The double-decker root bridge, Asia’s cleanest village and the caves under Cherrapunji.',
    styles: ['Adventure'], nights: 6, price: 44900, rating: 4.8, reviews: 141,
    season: 'Oct–Apr', popularity: 69, image: U('1596176530529-78163a4f7af2'),
    cities: ['Shillong', 'Cherrapunji', 'Dawki'],
    includes: ['6 nights stays', 'Breakfast & 4 dinners', 'Guided trek to Nongriat', 'Dawki river boat'],
    added: '2026-02-24',
    depart: ['2026-10-18', '2026-11-15', '2026-12-13'] }),
  E({ id: 'dubai', title: 'Dubai: The Long Weekend', place: 'Dubai', region: 'Near abroad',
    destination: 'Dubai', travellers: ['Family', 'Couples', 'Friends'],
    blurb: 'Desert dunes at sunset, the world’s tallest view and a marina dinner cruise.',
    styles: ['City Breaks', 'Family Holidays', 'Short Getaways'], nights: 3, price: 45900, rating: 4.6, reviews: 508,
    season: 'Oct–Apr', popularity: 85, image: U('1512453979798-5ea266f8880c'),
    cities: ['Dubai', 'Abu Dhabi'],
    includes: ['3 nights 4-star hotel', 'Daily breakfast', 'Desert safari with BBQ', 'Burj Khalifa Level 124'],
    added: '2026-07-06',
    depart: ['2026-10-09', '2026-10-23', '2026-11-06', '2026-11-20', '2026-12-04'] }),
  E({ id: 'ladakh', title: 'Ladakh: Leh, Nubra & Pangong', place: 'Ladakh', region: 'India',
    destination: 'India', travellers: ['Friends', 'Solo'],
    blurb: 'High passes, a night in the Nubra dunes and Pangong turning four colours before noon.',
    styles: ['Adventure'], nights: 6, price: 47500, rating: 4.9, reviews: 274,
    season: 'May–Oct', popularity: 87, image: U('1469521669194-babb45599def'),
    cities: ['Leh', 'Nubra', 'Pangong'],
    includes: ['6 nights hotels & camp', 'All meals', 'Inner-line permits', 'Oxygen support & acclimatisation day'],
    added: '2026-04-02',
    depart: ['2026-10-05', '2026-10-12', '2027-05-10', '2027-05-24', '2027-06-07'] }),
  E({ id: 'vietnam', title: 'Vietnam: Hanoi & Halong Bay', place: 'Vietnam', region: 'Southeast Asia',
    destination: 'Vietnam', travellers: ['Friends', 'Couples', 'Solo'],
    blurb: 'Old Quarter street kitchens, then an overnight cruise between the limestone karsts.',
    styles: ['City Breaks', 'Adventure', 'Culture & Heritage'], nights: 5, price: 49900, rating: 4.7, reviews: 311,
    season: 'Oct–Apr', popularity: 80, image: U('1528127269322-539801943592'),
    cities: ['Hanoi', 'Halong Bay', 'Ninh Binh'],
    includes: ['3 nights Hanoi + 1 night cruise + 1 transit', 'All meals on cruise', 'Kayaking & cave visit', 'Visa assistance'],
    added: '2026-09-05',
    depart: ['2026-10-14', '2026-11-11', '2026-12-09', '2027-01-13'] }),
  E({ id: 'srilanka', title: 'Sri Lanka: Kandy, Ella & the Coast', place: 'Sri Lanka', region: 'Near abroad',
    destination: 'Sri Lanka', travellers: ['Family', 'Couples', 'Seniors'],
    blurb: 'The hill-country train to Ella, tea estates in the mist and a slow finish by the sea.',
    styles: ['Beach Escapes', 'Family Holidays', 'Culture & Heritage'], nights: 7, price: 52500, rating: 4.8, reviews: 226,
    season: 'Year-round', popularity: 76, image: U('1546708973-b339540b5162'),
    cities: ['Kandy', 'Ella', 'Galle', 'Colombo'],
    includes: ['7 nights hotels', 'Daily breakfast', 'Reserved hill-country rail seats', 'Private car & driver'],
    added: '2026-05-11',
    depart: ['2026-10-16', '2026-11-13', '2026-12-11', '2027-01-15'] }),
  E({ id: 'andaman', title: 'Andaman: Havelock & Neil', place: 'Andaman Islands', region: 'India',
    destination: 'India', travellers: ['Couples', 'Family', 'Friends'],
    blurb: 'Radhanagar at sunset, a first dive on the house reef and two islands to yourselves.',
    styles: ['Beach Escapes', 'Adventure', 'Honeymoon / Romantic'], nights: 5, price: 52900, rating: 4.8, reviews: 384,
    season: 'Oct–May', popularity: 91, image: U('1514282401047-d79a71a590e8'),
    cities: ['Havelock', 'Neil Island', 'Port Blair'],
    includes: ['5 nights beach resorts', 'Daily breakfast', 'Private ferry transfers', 'Introductory scuba dive'],
    added: '2026-01-09',
    depart: ['2026-10-11', '2026-10-25', '2026-11-15', '2026-12-06', '2026-12-20'] }),
  E({ id: 'bali', title: 'Bali: Ubud & Seminyak', place: 'Bali', region: 'Southeast Asia',
    destination: 'Bali', travellers: ['Couples', 'Friends', 'Family'],
    blurb: 'A rice-terrace villa with its own pool, then five minutes from the sand in Seminyak.',
    styles: ['Beach Escapes', 'Honeymoon / Romantic', 'Short Getaways'], nights: 5, price: 54900, rating: 4.7, reviews: 596,
    season: 'Year-round', popularity: 93, image: U('1537996194471-e657df975ab4'),
    cities: ['Ubud', 'Seminyak', 'Denpasar'],
    includes: ['5 nights villas', 'Daily breakfast', 'Private pool villa 2 nights', 'Ubud waterfall & temple day'],
    added: '2026-08-15',
    depart: ['2026-10-08', '2026-10-22', '2026-11-05', '2026-11-19', '2026-12-03'] }),
  E({ id: 'rajasthan', title: 'Rajasthan: The Grand Circuit', place: 'Rajasthan', region: 'India',
    destination: 'India', travellers: ['Family', 'Couples', 'Seniors'],
    blurb: 'Jaipur, Jodhpur, Udaipur and a night under the Thar sky — the whole state, properly paced.',
    styles: ['Family Holidays', 'Culture & Heritage'], nights: 8, price: 57900, rating: 4.8, reviews: 208,
    season: 'Oct–Mar', popularity: 78, image: U('1477587458883-47145ed94245'),
    cities: ['Jaipur', 'Jodhpur', 'Udaipur', 'Jaisalmer'],
    includes: ['8 nights heritage hotels', 'Daily breakfast', 'A night at a desert camp', 'Private car & driver throughout'],
    added: '2026-03-13',
    depart: ['2026-10-13', '2026-11-10', '2026-12-08', '2027-01-12'] }),
  E({ id: 'spiti', title: 'Spiti Valley Overland', place: 'Himachal Pradesh', region: 'India',
    destination: 'India', travellers: ['Friends', 'Solo'],
    blurb: 'Shimla to Kaza the long way — Chandratal, Key Monastery and the highest village road in the world.',
    styles: ['Adventure'], nights: 8, price: 58500, rating: 4.9, reviews: 119,
    season: 'Jun–Sep', popularity: 72, image: U('1553969546-6c4b1b4e0dd6'),
    cities: ['Shimla', 'Kaza', 'Chandratal'],
    includes: ['8 nights homestays & guesthouses', 'All meals', 'Shared 4x4 with driver', 'Oxygen support'],
    added: '2026-06-18',
    depart: ['2027-06-05', '2027-06-19', '2027-07-03', '2027-07-17', '2027-08-07'] }),

  /* ---- ADDED IN v2. The brief's destination list names Malaysia and
     Singapore; the shelf carried neither, so two of the nine options returned
     nothing and the filter offered a dead end. Both of these sit under the
     ₹60,000 ceiling and both are shaped like an escape rather than a grand
     tour, which is the only test for belonging on this page. ---- */
  E({ id: 'langkawi', title: 'Kuala Lumpur & Langkawi', place: 'Malaysia', region: 'Southeast Asia',
    destination: 'Malaysia', travellers: ['Family', 'Couples', 'Friends'],
    blurb: 'Two nights under the Petronas towers, then an island where the ferry is the only thing in a hurry.',
    styles: ['Beach Escapes', 'City Breaks', 'Family Holidays'], nights: 5, price: 42900, rating: 4.6, reviews: 264,
    season: 'Year-round', popularity: 79, image: U('1596422846543-75c6fc197f07'),
    cities: ['Kuala Lumpur', 'Langkawi'],
    includes: ['2 nights Kuala Lumpur + 3 nights Langkawi', 'Daily breakfast', 'Island-hopping boat trip', 'All flights within Malaysia'],
    added: '2026-09-08',
    depart: ['2026-10-15', '2026-10-29', '2026-11-12', '2026-11-26', '2026-12-10'] }),
  E({ id: 'singapore', title: 'Singapore: The Long Weekend', place: 'Singapore', region: 'Southeast Asia',
    destination: 'Singapore', travellers: ['Family', 'Couples', 'Friends'],
    blurb: 'Gardens by the Bay after dark, hawker-centre breakfasts and one whole day the children choose.',
    styles: ['City Breaks', 'Family Holidays', 'Short Getaways'], nights: 3, price: 46900, rating: 4.7, reviews: 341,
    season: 'Year-round', popularity: 84, image: U('1525625293386-3f8f99389edd'),
    cities: ['Singapore', 'Sentosa'],
    includes: ['3 nights central hotel', 'Daily breakfast', 'Gardens by the Bay conservatories', 'Sentosa day pass'],
    added: '2026-09-09',
    depart: ['2026-10-09', '2026-10-23', '2026-11-06', '2026-11-20', '2026-12-04'] }),
];

const ESCAPE_COUNT = ALL_ESCAPES.length;

/* ---- Both bars' bounds derive from the catalogue — never hard-coded — so the
   day more expensive journeys are loaded in, the budget bar, its end labels,
   its preset pills and the stats strip under the intro all re-scale themselves
   and no copy anywhere has to be edited. This is what carries the brief's §7
   scalability requirement. ---- */
const _prices = ALL_ESCAPES.map((e) => e.price);
const PRICE_MIN = Math.floor(Math.min(..._prices) / 5000) * 5000;
const PRICE_MAX = Math.ceil(Math.max(..._prices) / 5000) * 5000;
const PRICE_STEP = 1000;

/* One-tap ceilings. Only those that actually sit inside the live range show, so
   a pill can never point at an empty shelf. The brief's bands are these same
   numbers read as ceilings rather than as closed bands. */
const BUDGET_PRESETS = [20000, 30000, 40000, 50000, 75000, 100000]
  .filter((v) => v > PRICE_MIN && v < PRICE_MAX)
  .map((v) => ({ v, label: `Under ${fmtK(v)}` }));


/* ---- WHY COX & KINGS EASY ESCAPES — brief §2, and the ONE section on this
   page whose copy is quoted rather than written. Every heading and every
   sentence below is the brief's, unedited, because this is the section the
   business wrote itself and the one a reviewer will read word for word.

   "Curated by Cox & Kings" is pulled out as the lead card: it is the only
   pillar making a claim the others rest on, it is the only one with a number in
   it, and a heritage claim earns a photograph in a way "secure payment" does
   not. The other four take an icon each — no numerals, because the numbered
   discs belong to "How Easy Is It?" below and repeating them would make two
   sections read as one list. ---- */
const WHY = [
  { icon: ReceiptText, t: 'Simple, Transparent Booking',
    d: 'See your journey, inclusions, departure details and pricing upfront before you book.' },
  { icon: CalendarCheck, t: 'Book on Your Terms',
    d: 'Choose your destination, departure and travel options — and complete your booking online whenever you\u2019re ready.' },
  { icon: ShieldCheck, t: 'Secure & Convenient',
    d: 'Make your payment securely and receive your booking confirmation digitally.' },
  { icon: Headset, t: 'Cox & Kings, Always Within Reach',
    d: 'Prefer some guidance? Our travel specialists are still available whenever you need them.' },
];
const WHY_LEAD = {
  icon: Award,
  t: 'Curated by Cox & Kings',
  d: 'Handpicked journeys designed with the expertise of a travel company that has been helping travellers explore the world for over 260 years.',
  image: U('1477587458883-47145ed94245'),
};

/* ---- How easy is it: the four steps of a self-serve booking, laid out the
   way the /journeys route map is — a disc per step on one sienna rail.
   The minutes add up to the "under five minutes" the lede promises, so the
   two claims cannot drift apart. The icons are a custom four-piece set drawn
   for this page (public/icons/ee-*.svg): one sienna line weight, one object
   each, no shared vocabulary with lucide so they never look half-borrowed. */
const STEPS = [
  { t: 'Explore', time: '2 minutes', icon: '/icons/ee-explore.svg',
    d: 'Find a journey that fits your budget and travel style.' },
  { t: 'Choose', time: '1 minute', icon: '/icons/ee-choose.svg',
    d: 'Select your preferred departure and traveller details.' },
  { t: 'Book', time: '2 minutes', icon: '/icons/ee-book.svg',
    d: 'Review your journey and complete your secure online payment.' },
  { t: 'Go', time: 'Instant', icon: '/icons/ee-go.svg',
    d: 'Receive your confirmation and get ready to travel.' },
];

/* ---- Where these escapes go. Each card sets the filter and jumps up to the
   grid — the same four-corners component /journeys/japan-2 uses for regions. */
const CLUSTERS = [
  { name: 'The Himalaya', note: 'Ladakh, Spiti, Sikkim and Kashmir.', filter: { style: 'Adventure' }, image: U('1469521669194-babb45599def') },
  { name: 'Coast & islands', note: 'Goa, the Andamans, Kerala and Bali.', filter: { style: 'Honeymoon / Romantic' }, image: U('1514282401047-d79a71a590e8') },
  { name: 'Old India', note: 'Rajasthan, Agra, Hampi and Pondicherry.', filter: { style: 'Culture & Heritage' }, image: U('1564507592333-c60657eea523') },
  { name: 'The near abroad', note: 'Thailand, Nepal, Sri Lanka and Dubai.', filter: { style: 'Short Getaways' }, image: U('1528181304800-259b08848526') },
];

const REVIEWS = [
  { name: 'Karan S.', location: 'Mumbai', rating: 5, tour: 'Bangkok & Pattaya Escape', text: 'Booked it on my phone on a Tuesday night. Vouchers were in my inbox before I finished dinner. No calls, no follow-ups, no pressure.', avatar: U('1507003211169-0a1dd7228f2d'), tripPhoto: U('1528181304800-259b08848526') },
  { name: 'Meera & Arjun', location: 'Bengaluru', rating: 5, tour: 'Udaipur: The City of Lakes', text: 'We had a long weekend and a budget. Three filters and it was done. The lake-view room was exactly what the page said it would be.', avatar: U('1494790108377-be9c29b29330'), tripPhoto: U('1524492412937-b28074a5d7da') },
  { name: 'Rohit D.', location: 'Pune', rating: 5, tour: 'Ladakh: Leh, Nubra & Pangong', text: 'I did message on WhatsApp once, about the acclimatisation day. Answered in ten minutes, then I went back and booked it myself.', avatar: U('1500648767791-00dcc994a43e'), tripPhoto: U('1469521669194-babb45599def') },
  { name: 'Priya N.', location: 'Delhi', rating: 5, tour: 'Kerala: Backwaters & Fort Kochi', text: 'What sold it was the price being the actual price. I have been quoted "starting from" numbers before that doubled by the end.', avatar: U('1544005313-94ddf0286df2'), tripPhoto: U('1602216056096-3b40cc0c9944') },
  { name: 'Aditya M.', location: 'Hyderabad', rating: 5, tour: 'Meghalaya: Living Root Bridges', text: 'Changed my dates a week later — one click, no charge, no explaining myself to anyone. That is the whole reason I will use it again.', avatar: U('1531123897727-8f129e1688ce'), tripPhoto: U('1596176530529-78163a4f7af2') },
];

/* ---- Bigger journeys live elsewhere. This is how the catalogue hands a
   visitor over to the specialist-designed range, without saying a word about
   internal release planning. ---- */
const SIMILAR = [
  { title: 'Escorted group tours', region: 'Worldwide', nights: '8–15 nights', season: 'Fixed departures', price: '₹1,85,000', image: U('1467269204594-9661b134dd2b'), to: '/journeys4-group' },
  { title: 'Tailor-made private journeys', region: 'Worldwide', nights: 'Your dates', season: 'Year-round', price: '₹2,40,000', image: U('1534445867742-43195f401b6c'), to: '/journeys4-private' },
  { title: 'Japan, at your own pace', region: 'Japan', nights: '8–13 nights', season: 'Mar–Nov', price: '₹2,65,000', image: U('1522383225653-ed111181a951'), to: '/journeys/japan-2' },
  { title: 'Every Cox & Kings journey', region: 'Worldwide', nights: '5–15 nights', season: 'Year-round', price: '₹95,000', image: U('1530122037265-a5f1f91d3b99'), to: '/journeys4' },
];

/* Extras are catalogue-wide: the same four options, priced the same way, apply
   to every escape, so the inventory system never has to describe them per
   product. Anything genuinely package-specific belongs in `includes`. */
const ADDONS = [
  { id: 'insurance', label: 'Travel insurance', note: 'Medical, delay and cancellation cover', price: 899, per: 'person' },
  { id: 'transfers', label: 'Private airport transfers', note: 'Both ways, meet-and-greet on arrival', price: 2400, per: 'booking' },
  { id: 'upgrade', label: 'Room upgrade', note: 'Next category up, subject to availability', price: 3500, per: 'booking' },
  { id: 'visa', label: 'Visa handling', note: 'Documents checked and filed for you', price: 1800, per: 'person' },
];
const CHILD_RATE = 0.75; /* 2–11 years, sharing. Stated in the drawer, not implied. */

const PAGE_DESKTOP = 9;
const PAGE_MOBILE = 4;
const MOBILE_Q = '(max-width: 560px)';

/* ==========================================================================
   Shared motion helpers — lifted verbatim from /journeys/japan-2 so this page
   reveals with exactly the same feel as the rest of the family.
   ========================================================================== */
function Reveal({ children, className = '', delay = 0, y = 20, as = 'div', ...rest }) {
  const M = motion[as] || motion.div;
  const reduce = useReducedMotion();
  if (reduce) return <M className={className} {...rest}>{children}</M>;
  return (
    <M
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(12px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </M>
  );
}

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

const WaIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.5A10 10 0 1 0 12 2zm0 18.3c-1.5 0-2.98-.4-4.27-1.16l-.3-.18-3.17 1 1.02-3.09-.2-.32A8.3 8.3 0 1 1 12 20.3z" />
    <path d="M17.5 14.4c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35z" />
  </svg>
);

const GoogleG = () => (
  <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#4285F4" d="M45 24c0-1.6-.1-2.7-.4-3.9H24v7.1h12c-.2 1.9-1.5 4.7-4.3 6.6l6.6 5.1C42.2 35.6 45 30.3 45 24z" />
    <path fill="#34A853" d="M24 46c5.7 0 10.5-1.9 14-5.1l-6.6-5.1c-1.8 1.2-4.2 2.1-7.4 2.1-5.6 0-10.4-3.7-12.1-8.8l-6.9 5.3C8.4 41.1 15.6 46 24 46z" />
    <path fill="#FBBC05" d="M11.9 29.1c-.4-1.3-.7-2.7-.7-4.1s.3-2.8.7-4.1l-6.9-5.4C3.5 18.2 2.8 21 2.8 25s.7 6.8 2.2 9.5l6.9-5.4z" />
    <path fill="#EA4335" d="M24 11.1c3.2 0 5.9 1.1 8.1 3.2l6-6C34.4 4.8 29.7 2.8 24 2.8 15.6 2.8 8.4 7.7 5 15.5l6.9 5.4C13.6 15.8 18.4 11.1 24 11.1z" />
  </svg>
);

const TripAdvisorOwl = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="11" fill="#34E0A1" />
    <circle cx="8.2" cy="12" r="3.1" fill="#000" />
    <circle cx="15.8" cy="12" r="3.1" fill="#000" />
    <circle cx="8.2" cy="12" r="1.3" fill="#fff" />
    <circle cx="15.8" cy="12" r="1.3" fill="#fff" />
  </svg>
);

/* ==========================================================================
   Filter controls — the /journeys2 vocabulary, unchanged.
   ========================================================================== */
function FilterGroup({ id, title, icon: Icon, options, selected, onToggle, counts }) {
  const labelId = `eegrp-${id}`;
  return (
    <div className="j2-group" role="group" aria-labelledby={labelId}>
      <p className="j2-group-title" id={labelId}>
        {Icon && <Icon size={14} aria-hidden="true" />} {title}
      </p>
      <div className="j2-options">
        {options.map((opt) => {
          const on = selected.includes(opt.value);
          const count = counts ? counts[opt.value] ?? 0 : null;
          return (
            <label key={opt.value} className={`j2-option${on ? ' is-on' : ''}${count === 0 && !on ? ' is-empty' : ''}`}>
              <input type="checkbox" checked={on} onChange={() => onToggle(opt.value)} />
              <span className="j2-check" aria-hidden="true">{on && <Check size={12} strokeWidth={3} />}</span>
              <span className="j2-option-label">
                {opt.icon && <opt.icon size={13} aria-hidden="true" className="ee-opt-ic" />}
                {opt.label}
              </span>
              {count !== null && <span className="j2-option-count">{count}</span>}
            </label>
          );
        })}
      </div>
    </div>
  );
}

/* Budget = a single "up to" ceiling: a chunky one-thumb slider plus one-tap
   preset pills. Lifted from /journeys/japan-2 unchanged apart from the money
   formatter, which is thousands here rather than lakhs. */
function BudgetPicker({ value, min, max, step, onChange }) {
  const pct = ((value - min) / (max - min)) * 100;
  const isAny = value >= max;
  return (
    <div className="j2-budget">
      <div className="j2-budget-slider">
        <div className="j2-budget-track">
          <div className="j2-budget-fill" style={{ width: `${pct}%` }} aria-hidden="true" />
          <input
            type="range" min={min} max={max} step={step} value={value}
            className="j2-budget-input"
            onChange={(e) => onChange(Number(e.target.value))}
            aria-label="Maximum budget per person"
            aria-valuetext={isAny ? 'Any budget' : `Up to ${inr(value)}`}
          />
        </div>
        <div className="j2-budget-ends">
          <span>{fmtK(min)}</span>
          <span>{fmtK(max)}</span>
        </div>
      </div>
      <div className="j2-budget-presets">
        {BUDGET_PRESETS.map((p) => (
          <button key={p.v} type="button" className={`j2-preset${value === p.v ? ' is-on' : ''}`}
            onClick={() => onChange(p.v)}>
            {p.label}
          </button>
        ))}
        <button type="button" className={`j2-preset${isAny ? ' is-on' : ''}`} onClick={() => onChange(max)}>
          Any
        </button>
      </div>
    </div>
  );
}

function FilterField({ id, title, icon: Icon, children }) {
  const labelId = `eegrp-${id}`;
  return (
    <div className="j2-group" role="group" aria-labelledby={labelId}>
      <p className="j2-group-title" id={labelId}>
        {Icon && <Icon size={14} aria-hidden="true" />} {title}
      </p>
      {children}
    </div>
  );
}

/* ==========================================================================
   THE CARD — /journeys' `jl-card`, unchanged in shape. Only two things differ,
   and both follow from this being a shop rather than a listing:

     · the corner tag says the escape is bookable online and confirms instantly,
       where a /journeys card says Group or Private;
     · the primary CTA BOOKS instead of opening an itinerary. The secondary CTA
       stays exactly what it is everywhere else — WhatsApp a specialist — which
       is how support survives on a page designed to need none.
   ========================================================================== */
function EscapeCard({ j, i, onPhotos, onBook }) {
  const waHref = `${CONTACT.whatsappHref}?text=${encodeURIComponent(`Hi Cox & Kings, I'd like to ask about the "${j.title}" escape.`)}`;
  return (
    <Reveal className="jl-card ee-card" delay={(i % 3) * 0.05} y={24} as="article">
      <div className="jl-card-media">
        <button type="button" className="jl-card-media-link ee-media-btn" onClick={() => onBook(j)}
          aria-label={`${j.title} — see dates and book`}>
          <img src={img(j.image, 800)} alt={j.title} loading="lazy" />
        </button>
        <span className="jl4-tourtype ee-tourtype">
          <Zap size={13} aria-hidden="true" /> Book online
        </span>
        <span className="jl-card-rating"><Star size={12} fill="currentColor" aria-hidden="true" /> {j.rating.toFixed(1)}</span>
        <span className="jl-card-region"><MapPin size={12} aria-hidden="true" /> {j.place}</span>
        {j.gallery.length > 1 && (
          <button type="button" className="jl-photos" onClick={() => onPhotos(j)}
            aria-label={`View ${j.gallery.length} photos of ${j.title}`}>
            <Images size={15} aria-hidden="true" /> {j.gallery.length} photos
          </button>
        )}
      </div>
      <div className="jl-card-body">
        <h3 className="jl-card-title">
          <button type="button" onClick={() => onBook(j)}>{j.title}</button>
        </h3>
        {/* Two styles, never three. Several escapes carry three and the third
            was pushing this line onto a second row on the narrower cards, which
            no other card on the site does. The array is authored most-defining
            first, so the two that survive are the two worth reading. */}
        <span className="jl-card-group">
          <Compass size={13} aria-hidden="true" /> {j.styles.slice(0, 2).join(' · ')}
        </span>
        <p className="jl-card-blurb">{j.blurb}</p>
        {/* /journeys/japan-2's meta row, item for item: nights, then season,
            then the one fact that page fills with "pace" and this one has to
            fill with the next departure — because on a shelf you buy from, when
            it actually leaves is the third thing you want to know. The
            inclusions list that used to sit under this row is gone: it is in
            the booking drawer, one tap away, and it was the only thing making
            this card taller than every other card on the site. */}
        <div className="jl-card-meta">
          <span><Clock size={14} aria-hidden="true" /> {j.nightsLabel}</span>
          <span><Calendar size={14} aria-hidden="true" /> {j.season}</span>
          <span><CalendarDays size={14} aria-hidden="true" /> Next {j.dates[0]}</span>
        </div>

        <div className="jl-card-foot">
          <span className="jl-card-price">
            <small>from</small> {j.priceLabel} <small>/ person</small>
          </span>
          <div className="jl-card-ctas">
            <button type="button" className="jl-cbtn jl-cbtn-view ee-cbtn" onClick={() => onBook(j)}>
              Book online <ArrowRight size={15} aria-hidden="true" />
            </button>
            <a href={waHref} target="_blank" rel="noopener noreferrer" className="jl-cbtn jl-cbtn-wa"
              aria-label={`Ask a specialist about ${j.title} on WhatsApp`}>
              <WaIcon size={15} /> Ask first
            </a>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ==========================================================================
   PHOTO LIGHTBOX — /journeys' `jl-lb`, unchanged.
   ========================================================================== */
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
    <motion.div className="jl-lb" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }} onClick={onClose} role="dialog" aria-modal="true"
      aria-label={`Photos of ${title}`}>
      <div className="jl-lb-top" onClick={(e) => e.stopPropagation()}>
        <span className="jl-lb-title">{title}</span>
        <span className="jl-lb-count">{idx + 1} / {photos.length}</span>
        <button type="button" className="jl-lb-close" onClick={onClose} aria-label="Close photos"><X size={22} /></button>
      </div>
      <div className="jl-lb-stage" onClick={(e) => e.stopPropagation()} ref={dialogRef} tabIndex={-1}>
        <button type="button" className="jl-lb-nav jl-lb-prev" onClick={() => go(-1)} aria-label="Previous photo"><ChevronLeft size={26} /></button>
        <AnimatePresence mode="wait">
          <motion.img key={idx} src={img(photos[idx], 1400)} alt={`${title} — photo ${idx + 1}`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} />
        </AnimatePresence>
        <button type="button" className="jl-lb-nav jl-lb-next" onClick={() => go(1)} aria-label="Next photo"><ChevronRight size={26} /></button>
      </div>
    </motion.div>
  );
}

/* ==========================================================================
   THE BOOKING DRAWER — the one genuinely new component on this page, because
   nothing else on this site takes a payment. It is dressed entirely in the
   site's existing filter and button vocabulary (`j2-group`, `j2-preset`,
   `j2-option`, `h26-btn`, `jl-cbtn`) so it reads as the same family; only its
   shell, its steppers and its total bar are new CSS.

   Three steps, and the money is visible in all of them. A person can see the
   running total before telling us a single thing about themselves — which is
   the opposite of an enquiry form, and the reason this converts without a
   salesperson standing behind it.
   ========================================================================== */
/* ==========================================================================
   THE PHOTO CAROUSEL — the top of the booking drawer.

   Clicking an escape opens this drawer, and the first question anyone asks of
   a holiday they cannot ask a person about is "show me". So the drawer opens
   on pictures, not on a form: a horizontal scroll-snapped rail of the whole
   gallery, swipeable on a phone, arrow- and keyboard-driven on a desktop.

   Native scroll-snap rather than a transform carousel, because it keeps the
   trackpad, the touch swipe, the scrollbar and the keyboard all working for
   free, and degrades to a plain scroller if JS ever fails.
   ========================================================================== */
function BookingGallery({ frames, title }) {
  const rail = useRef(null);
  const [idx, setIdx] = useState(0);
  const reduce = useReducedMotion();
  const last = frames.length - 1;

  const stride = () => {
    const el = rail.current;
    const fig = el?.querySelector('.ee-gal-fig');
    return fig ? fig.offsetWidth + 12 : (el?.clientWidth || 1);
  };
  const go = (dir) => {
    rail.current?.scrollBy({ left: dir * stride(), behavior: reduce ? 'auto' : 'smooth' });
  };
  /* The rail is the source of truth for which frame is showing — a swipe, a
     trackpad flick and an arrow press all land in the same place. */
  const onScroll = () => {
    const el = rail.current;
    if (el) setIdx(Math.min(last, Math.max(0, Math.round(el.scrollLeft / stride()))));
  };

  return (
    <div className="ee-gal">
      <div className="ee-gal-rail" ref={rail} onScroll={onScroll} tabIndex={0}
        role="group" aria-label={`Photos of ${title} — scrollable`}>
        {frames.map((src, i) => (
          <figure className="ee-gal-fig" key={src}>
            <img src={img(src, 760)} alt={`${title}, photo ${i + 1} of ${frames.length}`}
              loading={i < 2 ? 'eager' : 'lazy'} draggable="false" />
          </figure>
        ))}
      </div>

      <button type="button" className="ee-gal-arrow ee-gal-arrow--prev" onClick={() => go(-1)}
        disabled={idx === 0} aria-label="Previous photo">
        <ChevronLeft size={19} aria-hidden="true" />
      </button>
      <button type="button" className="ee-gal-arrow ee-gal-arrow--next" onClick={() => go(1)}
        disabled={idx === last} aria-label="Next photo">
        <ChevronRight size={19} aria-hidden="true" />
      </button>

      <p className="ee-gal-count" aria-live="polite">
        <Images size={13} aria-hidden="true" /> {idx + 1} / {frames.length}
      </p>
    </div>
  );
}

function BookingDrawer({ escape, onClose, onHelp }) {
  const panel = useRef(null);
  const [step, setStep] = useState(1);
  const [date, setDate] = useState(escape.dates[0]);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [addons, setAddons] = useState([]);
  const [payMode, setPayMode] = useState('full');
  const [errors, setErrors] = useState({});
  const [ref, setRef] = useState(null);
  const [who, setWho] = useState({ name: '', email: '', phone: '', consent: false });

  const setField = (k) => (ev) => {
    const v = ev.target.type === 'checkbox' ? ev.target.checked : ev.target.value;
    setWho((w) => ({ ...w, [k]: v }));
    setErrors((x) => (x[k] ? { ...x, [k]: undefined } : x));
  };

  const travellers = adults + children;
  const toggleAddon = (id) =>
    setAddons((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));

  /* The ONE place money is calculated. The bar, the pay button and the
     confirmation all read from here, so they cannot drift apart. */
  const money = useMemo(() => {
    const base = escape.price * adults + Math.round(escape.price * CHILD_RATE) * children;
    const extras = ADDONS.filter((a) => addons.includes(a.id))
      .reduce((sum, a) => sum + (a.per === 'person' ? a.price * travellers : a.price), 0);
    const total = base + extras;
    return { base, extras, total, dueNow: payMode === 'deposit' ? Math.round(total * 0.25) : total };
  }, [escape.price, adults, children, addons, travellers, payMode]);

  /* Escape closes it, the panel takes focus when it opens, and the page behind
     is locked — a dialog that leaves focus behind its scrim is unusable. */
  useEffect(() => {
    const onKey = (ev) => { if (ev.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const t = requestAnimationFrame(() => panel.current?.querySelector('.ee-bk-close')?.focus());
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
      cancelAnimationFrame(t);
    };
  }, [onClose]);

  /* Tab is wrapped at both ends. Not a full trap library — the drawer is the
     only interactive region while it is open. */
  const onKeyDown = (ev) => {
    if (ev.key !== 'Tab') return;
    const nodes = panel.current?.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])');
    if (!nodes || !nodes.length) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (ev.shiftKey && document.activeElement === first) { ev.preventDefault(); last.focus(); }
    else if (!ev.shiftKey && document.activeElement === last) { ev.preventDefault(); first.focus(); }
  };

  const validate = () => {
    const e = {};
    if (!who.name.trim()) e.name = 'Please enter the lead traveller’s name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(who.email)) e.email = 'Please check your email — the vouchers go here.';
    if (who.phone.replace(/\D/g, '').length < 10) e.phone = 'Please enter a 10-digit mobile number.';
    if (!who.consent) e.consent = 'Please accept the booking terms to continue.';
    setErrors(e);
    return e;
  };

  /* The pay button is never disabled: a greyed-out button tells a person they
     have failed without telling them how. An invalid submit moves focus to the
     first field in error instead. */
  const pay = (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      panel.current?.querySelector(`[name="${Object.keys(errs)[0]}"]`)?.focus();
      return;
    }
    /* ⚠ NO PAYMENT GATEWAY IS WIRED UP. This is where the checkout session is
       created and the browser handed to the PSP (Razorpay / PayU / Stripe).
       The reference below is generated client-side purely so the confirmation
       screen can be reviewed. Nothing is charged and nothing is stored. */
    setRef(`CK-${escape.id.slice(0, 3).toUpperCase()}-${Math.floor(100000 + Math.random() * 899999)}`);
    setStep(3);
    requestAnimationFrame(() => panel.current?.querySelector('#ee-done-h')?.focus());
  };

  const stepLabel = ['Your escape', 'Your details', 'Confirmed'][step - 1];

  return (
    <div className="ee-bk" role="presentation">
      <button type="button" className="ee-bk-scrim" aria-label="Close booking" onClick={onClose} />

      <aside className="ee-bk-panel" role="dialog" aria-modal="true"
        aria-label={`Book ${escape.title}`} ref={panel} onKeyDown={onKeyDown}>

        <header className="ee-bk-top">
          <div className="ee-bk-topmedia" aria-hidden="true">
            <img src={img(escape.image, 240)} alt="" />
          </div>
          <div className="ee-bk-topcopy">
            <p className="h26-label ee-bk-eyebrow">Step {step} of 3 · {stepLabel}</p>
            <h2 className="ee-bk-title">{escape.title}</h2>
            <p className="ee-bk-meta">
              <MapPin size={13} aria-hidden="true" /> {escape.place}
              <span aria-hidden="true">·</span>
              <Clock size={13} aria-hidden="true" /> {escape.daysLabel}
            </p>
          </div>
          <button type="button" className="ee-bk-close" onClick={onClose} aria-label="Close booking">
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        <div className="ee-bk-prog" aria-hidden="true">
          {[1, 2, 3].map((i) => <span key={i} className={i <= step ? 'is-on' : ''} />)}
        </div>

        <div className="ee-bk-scroll">
          {step === 1 && (
            <>
              <BookingGallery frames={escape.gallery} title={escape.title} />

              <FilterField id="bk-date" title="Choose your departure" icon={CalendarDays}>
                <p className="ee-bk-hint">Live dates. Everything shown has seats available today.</p>
                <div className="j2-budget-presets" role="radiogroup" aria-label="Departure date">
                  {escape.dates.map((d) => (
                    <button key={d} type="button" role="radio" aria-checked={date === d}
                      className={`j2-preset${date === d ? ' is-on' : ''}`} onClick={() => setDate(d)}>
                      {d}
                    </button>
                  ))}
                </div>
              </FilterField>

              <FilterField id="bk-who" title="Who is travelling" icon={Users}>
                <div className="ee-steppers">
                  <Stepper label="Adults" sub="12 years and over" value={adults} min={1} max={9} onChange={setAdults} />
                  <Stepper label="Children" sub={`2–11 years · ${Math.round(CHILD_RATE * 100)}% of the adult fare`}
                    value={children} min={0} max={6} onChange={setChildren} />
                </div>
              </FilterField>

              <FilterField id="bk-add" title="Add anything you need" icon={Plus}>
                <p className="ee-bk-hint">Optional. Nothing here is pre-selected.</p>
                <div className="j2-options">
                  {ADDONS.map((a) => {
                    const on = addons.includes(a.id);
                    return (
                      <label key={a.id} className={`j2-option ee-addon${on ? ' is-on' : ''}`}>
                        <input type="checkbox" checked={on} onChange={() => toggleAddon(a.id)} />
                        <span className="j2-check" aria-hidden="true">{on && <Check size={12} strokeWidth={3} />}</span>
                        <span className="j2-option-label ee-addon-txt">
                          <strong>{a.label}</strong>
                          <small>{a.note}</small>
                        </span>
                        <span className="j2-option-count ee-addon-price">
                          {inr(a.price)}{a.per === 'person' ? ' pp' : ''}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </FilterField>

              <FilterField id="bk-inc" title="What is already included" icon={Check}>
                <ul className="ee-bk-inc">
                  {escape.includes.map((inc) => (
                    <li key={inc}><Check size={14} aria-hidden="true" /> {inc}</li>
                  ))}
                </ul>
                <p className="ee-bk-note">
                  Flights are not included, so the price stays honest whichever city you fly from.
                  Add them at the next step and we will quote live fares.
                </p>
              </FilterField>
            </>
          )}

          {step === 2 && (
            <form className="ee-bk-form" onSubmit={pay} noValidate>
              <FilterField id="bk-lead" title="Lead traveller" icon={Users}>
                <p className="ee-bk-hint">
                  Three fields. Everything else we need, we ask for after you are booked.
                  <span className="ee-req-key"><span className="ee-req" aria-hidden="true">*</span> Required</span>
                </p>
                <Field label="Full name (as on your ID)" name="name" error={errors.name} required>
                  <input id="ee-name" name="name" type="text" autoComplete="name" value={who.name}
                    onChange={setField('name')} aria-required="true" aria-invalid={!!errors.name} />
                </Field>
                <Field label="Email" name="email" error={errors.email} required
                  hint="Vouchers and your itinerary are sent here.">
                  <input id="ee-email" name="email" type="email" autoComplete="email" value={who.email}
                    onChange={setField('email')} aria-required="true" aria-invalid={!!errors.email} />
                </Field>
                <Field label="Mobile" name="phone" error={errors.phone} required
                  hint="Used only for travel updates. We will not call to sell you anything.">
                  <input id="ee-phone" name="phone" type="tel" inputMode="numeric" autoComplete="tel"
                    value={who.phone} onChange={setField('phone')} aria-required="true" aria-invalid={!!errors.phone} />
                </Field>
              </FilterField>

              <FilterField id="bk-pay" title="How would you like to pay?" icon={Wallet}>
                <div className="ee-pay" role="radiogroup" aria-label="Payment option">
                  <button type="button" role="radio" aria-checked={payMode === 'full'}
                    className={`ee-payopt${payMode === 'full' ? ' is-on' : ''}`} onClick={() => setPayMode('full')}>
                    <strong>Pay in full</strong>
                    <span>{inr(money.total)} now, nothing else to do</span>
                  </button>
                  <button type="button" role="radio" aria-checked={payMode === 'deposit'}
                    className={`ee-payopt${payMode === 'deposit' ? ' is-on' : ''}`} onClick={() => setPayMode('deposit')}>
                    <strong>25% deposit</strong>
                    <span>{inr(Math.round(money.total * 0.25))} now, balance 21 days before</span>
                  </button>
                </div>
              </FilterField>

              <label className={`j2-option ee-consent${errors.consent ? ' has-error' : ''}`}>
                <input type="checkbox" name="consent" checked={who.consent} onChange={setField('consent')}
                  aria-required="true" aria-invalid={!!errors.consent} />
                <span className="j2-check" aria-hidden="true">{who.consent && <Check size={12} strokeWidth={3} />}</span>
                <span className="j2-option-label">
                  <span className="ee-req" aria-hidden="true">*</span>
                  <span className="ee-sr">(required) </span>
                  I have read the{' '}
                  <a href="/terms" target="_blank" rel="noreferrer"
                    onClick={(ev) => ev.stopPropagation()}>booking terms</a> and the{' '}
                  <a href="/terms#refund-policy" target="_blank" rel="noreferrer"
                    onClick={(ev) => ev.stopPropagation()}>cancellation policy</a>.
                </span>
              </label>
              {errors.consent && <p className="ee-err" role="alert">{errors.consent}</p>}

              <p className="ee-bk-secure">
                <Lock size={13} aria-hidden="true" />
                Payment is taken on a PCI-DSS certified gateway. Card details never reach our servers.
              </p>
            </form>
          )}

          {step === 3 && (
            <div className="ee-bk-done">
              <span className="ee-bk-tick" aria-hidden="true"><Check size={26} /></span>
              <h3 id="ee-done-h" tabIndex={-1} className="ee-bk-doneh">You&apos;re booked.</h3>
              <p className="ee-bk-donesub">
                {escape.title} · {date} · {travellers} {travellers === 1 ? 'traveller' : 'travellers'}
              </p>
              <p className="ee-bk-ref"><Ticket size={14} aria-hidden="true" /> Booking reference <strong>{ref}</strong></p>
              <ul className="ee-bk-inc ee-bk-next">
                <li><Check size={14} aria-hidden="true" /> Vouchers and your day-by-day itinerary are on their way to {who.email}.</li>
                <li><Check size={14} aria-hidden="true" /> Your coordinator will introduce themselves within 24 hours.</li>
                <li><Check size={14} aria-hidden="true" /> Free cancellation stays open until 14 days before departure.</li>
              </ul>
              <div className="ee-bk-doneacts">
                <button type="button" className="h26-btn h26-btn-pill" onClick={onClose}>
                  Back to the escapes
                </button>
                <button type="button" className="h26-btn jl-btn-ghost" onClick={onHelp}>
                  <PhoneCall size={15} aria-hidden="true" /> Talk to my coordinator
                </button>
              </div>
            </div>
          )}
        </div>

        {/* The money bar. Present from the first screen, so nobody discovers a
            number late. The only thing pinned to the bottom of the panel. */}
        {step < 3 && (
          <footer className="ee-bk-bar">
            <div className="ee-bk-total">
              <span className="ee-bk-totlbl">
                {step === 2 && payMode === 'deposit' ? 'Due now' : 'Total'}
                <small> · {travellers} {travellers === 1 ? 'traveller' : 'travellers'}, {date}</small>
              </span>
              <strong className="ee-bk-totval">{inr(step === 2 ? money.dueNow : money.total)}</strong>
              {money.extras > 0 && <small className="ee-bk-totnote">includes {inr(money.extras)} of extras</small>}
            </div>
            {step === 1 ? (
              <button type="button" className="h26-btn h26-btn-pill ee-bk-go" onClick={() => setStep(2)}>
                Continue <ArrowRight size={15} aria-hidden="true" />
              </button>
            ) : (
              <div className="ee-bk-baracts">
                <button type="button" className="ee-bk-back" onClick={() => setStep(1)}>
                  <ChevronLeft size={15} aria-hidden="true" /> Back
                </button>
                <button type="button" className="h26-btn h26-btn-pill ee-bk-go" onClick={pay}>
                  <Lock size={14} aria-hidden="true" /> Pay {inr(money.dueNow)}
                </button>
              </div>
            )}
          </footer>
        )}
      </aside>
    </div>
  );
}

function Stepper({ label, sub, value, min, max, onChange }) {
  return (
    <div className="ee-step">
      <span className="ee-step-lbl">
        <strong>{label}</strong>
        <small>{sub}</small>
      </span>
      <span className="ee-step-ctrl">
        <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min}
          aria-label={`One fewer ${label.toLowerCase()}`}><Minus size={15} aria-hidden="true" /></button>
        <output aria-live="polite">{value}</output>
        <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max}
          aria-label={`One more ${label.toLowerCase()}`}><Plus size={15} aria-hidden="true" /></button>
      </span>
    </div>
  );
}

/* `required` prints the asterisk everyone reads as "you have to fill this in",
   and an off-screen "(required)" so a screen reader hears the same thing —
   an asterisk on its own is punctuation to a screen reader, not a rule. */
function Field({ label, name, hint, error, required, children }) {
  return (
    <div className={`ee-field${error ? ' has-error' : ''}`}>
      <label htmlFor={`ee-${name}`}>
        {label}
        {required && (
          <>
            <span className="ee-req" aria-hidden="true">*</span>
            <span className="ee-sr"> (required)</span>
          </>
        )}
      </label>
      {children}
      {error ? <p className="ee-err" role="alert">{error}</p>
        : hint ? <p className="ee-field-hint">{hint}</p> : null}
    </div>
  );
}

/* ==========================================================================
   THE PAGE
   ========================================================================== */
export default function EasyEscapesV2() {
  const root = useRef(null);
  const [params, setParams] = useSearchParams();
  const openCallback = useScheduleCall();

  const [chatOpen, setChatOpen] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [booking, setBooking] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef(null);

  /* ---- Filter state lives in the URL, so every view is shareable ---------- */
  const readList = (v) => (v ? v.split(',').filter(Boolean) : []);
  const dests = readList(params.get('dest')).filter((v) => DESTINATIONS.includes(v));
  const whos = readList(params.get('who')).filter((v) => TRAVELLER_TYPES.includes(v));
  const styles = readList(params.get('style')).filter((s) => STYLE_VALUES.includes(s));
  const durations = readList(params.get('nights')).filter((d) => DURATIONS.some((x) => x.value === d));
  /* Budget is the one facet that is a single value rather than a list. It is
     clamped to the catalogue's own bounds on the way in, so a stale or
     hand-edited URL can never leave the thumb outside its own bar. */
  const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
  const budgetMax = clamp(Number(params.get('max')) || PRICE_MAX, PRICE_MIN, PRICE_MAX);
  const sort = SORTS.some((s) => s.key === params.get('sort')) ? params.get('sort') : DEFAULT_SORT;

  const update = useCallback((patch) => {
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(patch).forEach(([k, v]) => {
        if (v === null || v === '' || v === undefined) next.delete(k);
        else next.set(k, v);
      });
      return next;
    }, { replace: true });
  }, [setParams]);

  const toggleIn = (list, key) => (value) =>
    update({ [key]: (list.includes(value) ? list.filter((x) => x !== value) : [...list, value]).join(',') || null });
  const toggleDest = toggleIn(dests, 'dest');
  const toggleWho = toggleIn(whos, 'who');
  const toggleStyle = toggleIn(styles, 'style');
  const toggleDuration = toggleIn(durations, 'nights');
  /* The bar at its own end means "no opinion", so it drops out of the URL
     rather than writing max=60000 — a shared link then carries only real
     choices. */
  const setBudgetMax = (v) => update({ max: v >= PRICE_MAX ? null : String(v) });
  const setSort = (v) => update({ sort: v === DEFAULT_SORT ? null : v });
  const CLEARED = { dest: null, who: null, style: null, max: null, nights: null };
  const clearAll = () => update(CLEARED);

  /* ---- Matching. `skip` lets the counts ask "how many if I ignore my own
     facet?", which is what makes a chip's number the number you will get. ---- */
  const passes = useCallback((e, skip) => {
    if (skip !== 'budget' && e.price > budgetMax) return false;
    if (skip !== 'dest' && dests.length && !dests.includes(e.destination)) return false;
    if (skip !== 'who' && whos.length && !e.travellers.some((t) => whos.includes(t))) return false;
    if (skip !== 'style' && styles.length && !e.styles.some((s) => styles.includes(s))) return false;
    if (skip !== 'nights' && durations.length) {
      const bands = DURATIONS.filter((d) => durations.includes(d.value));
      if (!bands.some((b) => inBand(e.nights, b))) return false;
    }
    return true;
  }, [budgetMax, dests.join(), whos.join(), styles.join(), durations.join()]); // eslint-disable-line react-hooks/exhaustive-deps

  const results = useMemo(() => {
    const out = ALL_ESCAPES.filter((e) => passes(e));
    const by = {
      recommended: (a, b) => b.score - a.score,
      popular: (a, b) => b.popularity - a.popularity,
      'price-asc': (a, b) => a.price - b.price,
      'price-desc': (a, b) => b.price - a.price,
      newest: (a, b) => b.addedAt - a.addedAt,
      departure: (a, b) => a.departAt - b.departAt,
      'nights-asc': (a, b) => a.nights - b.nights,
      'nights-desc': (a, b) => b.nights - a.nights,
      rating: (a, b) => b.rating - a.rating || b.reviews - a.reviews,
    };
    return out.sort(by[sort] || by.recommended);
  }, [passes, sort]);

  const counts = useMemo(() => {
    const count = (skip, matcher) => {
      const base = ALL_ESCAPES.filter((e) => passes(e, skip));
      const out = {};
      for (const [value, test] of matcher) out[value] = base.filter(test).length;
      return out;
    };
    return {
      dest: count('dest', DESTINATIONS.map((d) => [d, (e) => e.destination === d])),
      who: count('who', TRAVELLER_TYPES.map((t) => [t, (e) => e.travellers.includes(t)])),
      style: count('style', STYLE_VALUES.map((s) => [s, (e) => e.styles.includes(s)])),
      nights: count('nights', DURATIONS.map((d) => [d.value, (e) => inBand(e.nights, d)])),
    };
  }, [passes]);

  /* ---- Paging, like /journeys/japan-2: fewer cards revealed at a time on a
     phone, where the grid is one column and the list would never end. ---- */
  const [pageSize, setPageSize] = useState(PAGE_DESKTOP);
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_Q);
    const apply = () => setPageSize(mq.matches ? PAGE_MOBILE : PAGE_DESKTOP);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);
  const [visible, setVisible] = useState(PAGE_DESKTOP);
  useEffect(() => { setVisible(pageSize); }, [budgetMax, dests.join(), whos.join(), styles.join(), durations.join(), sort, pageSize]); // eslint-disable-line react-hooks/exhaustive-deps
  const shown = results.slice(0, visible);

  /* ---- Active-filter bookkeeping ---------------------------------------- */
  const budgetActive = budgetMax < PRICE_MAX;
  const totalActive = dests.length + whos.length + styles.length + durations.length
    + (budgetActive ? 1 : 0);
  const sortLabel = SORTS.find((s) => s.key === sort)?.label;

  /* Close the sort popover on an outside click, as /journeys/japan-2 does. */
  useEffect(() => {
    if (!sortOpen) return undefined;
    const onDown = (e) => { if (!sortRef.current?.contains(e.target)) setSortOpen(false); };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [sortOpen]);

  /* The four-corners cards set a filter and jump UP to the grid. Focus moves to
     the section heading so a keyboard or screen-reader visitor is not stranded
     at the bottom; the live result count announces what changed. */
  const chooseCluster = (filter) => {
    update({ ...CLEARED, style: filter.style || null });
    const el = document.getElementById('escapes');
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    const heading = el.querySelector('h2');
    if (heading) { heading.setAttribute('tabindex', '-1'); heading.focus({ preventScroll: true }); }
  };

  const openPhotos = (j) => setLightbox({ title: j.title, photos: j.gallery, index: 0 });

  /* ---- Motion. The reveals are framer-motion, exactly as on the rest of the
     /journeys family. GSAP handles only the two things framer cannot: the
     hero's photographic parallax and the count-ups, both reduced-motion gated
     and both leaving the resting DOM complete. ---- */
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      /* The hero needs nothing from GSAP: Journeys.css already drifts
         .jl-hero-bg with its own keyframes, and a tween on the same transform
         would simply lose to the running CSS animation. */
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray('.ee [data-count]').forEach((el) => {
          const end = Number(el.dataset.count);
          if (!Number.isFinite(end)) return;
          const o = { v: 0 };
          gsap.to(o, {
            v: end, duration: 1.5, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
            onUpdate: () => { el.textContent = Math.round(o.v).toLocaleString('en-IN'); },
          });
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  /* The grid changes height as filters land; anything anchored below it has to
     be re-measured or its trigger points drift. */
  useLayoutEffect(() => { ScrollTrigger.refresh(); }, [results.length, visible]);

  /* The whole sidebar body — shared by the desktop rail and the mobile drawer,
     so the two can never disagree about what the filters are. */
  const filterBody = (
    <>
      <FilterField id="budget" title="Budget (per person)" icon={Wallet}>
        <BudgetPicker
          value={budgetMax} min={PRICE_MIN} max={PRICE_MAX} step={PRICE_STEP}
          onChange={setBudgetMax}
        />
      </FilterField>
      <FilterGroup
        id="dest" title="Destination" icon={MapPin}
        options={DESTINATIONS.map((d) => ({ value: d, label: d }))}
        selected={dests} onToggle={toggleDest} counts={counts.dest}
      />
      <FilterGroup
        id="who" title="Traveller type" icon={Users}
        options={TRAVELLER_TYPES.map((t) => ({ value: t, label: t }))}
        selected={whos} onToggle={toggleWho} counts={counts.who}
      />
      <FilterGroup
        id="style" title="Travel style" icon={Compass}
        options={TRAVEL_STYLES.map((t) => ({ value: t.value, label: t.value, icon: t.icon }))}
        selected={styles} onToggle={toggleStyle} counts={counts.style}
      />
      <FilterGroup
        id="nights" title="Duration" icon={Clock}
        options={DURATIONS.map((d) => ({ value: d.value, label: d.value }))}
        selected={durations} onToggle={toggleDuration} counts={counts.nights}
      />
    </>
  );

  return (
    <>
    <div className="h26 jl jl2 jp jj2 ee eev2" ref={root}>
      <SiteNav />

      {/* ---------- HERO ----------
           `id="main"` is the skip link's target: the first thing after the nav,
           so "skip to content" lands at the top of this page's own content. */}
      <section className="jl-hero" id="main" tabIndex={-1}>
        <div className="jl-hero-bg" style={{ backgroundImage: `url(${img(HERO_IMG, 1800)})` }} aria-hidden="true" />
        <div className="jl-hero-veil" aria-hidden="true" />
        <div className="jl-hero-inner">
          {/* The brief's tagline, set the way /journeys/japan-2 sets
              "Japan · 12 handcrafted journeys" — the hero eyebrow ABOVE the
              name, in the shared h26-label, rather than a serif deck beneath
              it. Same element, same class pair, same position in the stack, so
              the two heroes open identically. */}
          <Reveal className="h26-label jl-hero-eyebrow" as="p">
            Exceptional journeys. Surprisingly easy to book.
          </Reveal>
          <h1 className="jl-hero-title">
            <WordReveal text="Cox & Kings Easy Escapes" accent={[3, 4]} />
          </h1>
          <Reveal className="jl-hero-sub" as="p" delay={0.15}>
            Discover thoughtfully curated Cox &amp; Kings holidays at accessible price points —
            and book your journey online, in just a few clicks.
          </Reveal>
          <Reveal className="ee-hero-kicker" as="p" delay={0.2}>
            No waiting. No back-and-forth. Just choose, book and go.
          </Reveal>
          <Reveal className="jp-hero-actions" as="div" delay={0.24}>
            <a href="#escapes" className="h26-btn h26-btn-accent h26-btn-lg">
              Browse the escapes <ArrowRight size={16} />
            </a>
            <a href="#how" className="h26-btn h26-btn-glass h26-btn-lg">
              <Zap size={16} /> How booking works
            </a>
          </Reveal>
        </div>
      </section>

      {/* ---------- WHY COX & KINGS EASY ESCAPES — brief §2 ---------- */}
      <section className="eev2-why" aria-labelledby="why-ee">
        <div className="jp-wrap">
          <div className="eev2-why__head">
            <Reveal className="h26-label jp-eyebrow" as="p">Why book here</Reveal>
            <Reveal as="h2" className="eev2-why__title" id="why-ee" delay={0.04}>
              Why Cox &amp; Kings <em>Easy Escapes?</em>
            </Reveal>
            <Reveal as="p" className="eev2-why__deck" delay={0.08}>
              The same Cox &amp; Kings journeys. A shorter way to book one.
            </Reveal>
          </div>

          <div className="eev2-why__grid">
            {/* The lead: a photograph, the heritage figure, and the pillar the
                other four rest on. The count-up runs off the page's existing
                `[data-count]` hook, which is reduced-motion gated and leaves
                the real number in the DOM at rest. */}
            <Reveal className="eev2-why__lead" as="article" y={24}>
              <img src={img(WHY_LEAD.image, 900)} alt="" loading="lazy" />
              <span className="eev2-why__lead-scrim" aria-hidden="true" />
              <div className="eev2-why__lead-body">
                <span className="eev2-why__ic is-glass">
                  <WHY_LEAD.icon size={20} aria-hidden="true" />
                </span>
                <p className="eev2-why__fig" aria-hidden="true">
                  <strong data-count={260}>260</strong><small>+ years</small>
                </p>
                <h3>{WHY_LEAD.t}</h3>
                <p className="eev2-why__lead-copy">{WHY_LEAD.d}</p>
              </div>
            </Reveal>

            {WHY.map((w, i) => (
              <Reveal className="eev2-why__card" as="article" key={w.t} y={22} delay={0.05 * (i + 1)}>
                <span className="eev2-why__ic"><w.icon size={20} aria-hidden="true" /></span>
                <h3>{w.t}</h3>
                <p>{w.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- HOW EASY IS IT — unchanged ---------- */}
      <section className="jp-about" id="how" aria-labelledby="how-ee">
        <div className="jp-wrap">
          {/* How easy is it — four photo discs on one rail. */}
          <div className="ee-flow-wrap">
            <div className="ee-flow-head">
              <Reveal className="h26-label jp-eyebrow" as="p">Four steps, nobody calls you</Reveal>
              <Reveal as="h2" className="ee-flow-title" id="how-ee" delay={0.04}>
                How <em>Easy</em> Is It?
              </Reveal>
              <Reveal as="p" className="ee-flow-sub" delay={0.08}>
                No enquiry form, no callback, no waiting on a quote. The whole thing happens
                on this page, at whatever hour suits you.
              </Reveal>
            </div>
            <ol className="ee-flow">
              {STEPS.map((s, i) => (
                <Reveal as="li" className="ee-flow__step" key={s.t} y={18} delay={0.06 * i}>
                  <div className="ee-flow__marker">
                    <div className="ee-flow__disc">
                      <img className="ee-flow__icon" src={s.icon} alt="" width="74" height="74" loading="lazy" />
                    </div>
                    <span className="ee-flow__num" aria-hidden="true">{i + 1}</span>
                  </div>
                  {i < STEPS.length - 1 && <span className="ee-flow__line" aria-hidden="true" />}
                  <div className="ee-flow__body">
                    <span className="ee-flow__time">{s.time}</span>
                    <h4>{s.t}</h4>
                    <p>{s.d}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
            <Reveal as="p" className="ee-flow-foot" delay={0.12}>
              Prefer to talk it through first? That door stays open — WhatsApp a specialist from
              any card, or{' '}
              <button type="button" className="ee-inline" onClick={openCallback}>
                book a callback <ArrowUpRight size={13} aria-hidden="true" />
              </button>
              . The price is the same either way.
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- THE CATALOGUE — filter rail + sortable grid ---------- */}
      <section className="jj2-tours" id="escapes">
        <div className="jj2-tours-head">
          <Reveal className="h26-label jp-eyebrow" as="p">The escapes</Reveal>
          <Reveal as="h2" className="jp-title" delay={0.04}>
            Every escape, <em>one shelf</em>
          </Reveal>
          <Reveal as="p" className="jj2-tours-sub" delay={0.08}>
            Filter by price, destination, who is travelling, travel style and how many
            nights you have. Every price is the final per-person price for the dates shown.
          </Reveal>
        </div>

        <main className="jl2-shell jj2-shell">
          <div className="jl2-mobilebar">
            <button type="button" className="jl2-filter-toggle" onClick={() => setFiltersOpen(true)}>
              <SlidersHorizontal size={16} aria-hidden="true" />
              Filters
              {totalActive > 0 && <span className="jl2-filter-badge">{totalActive}</span>}
            </button>
          </div>

          {/* ----- LEFT: filter sidebar (a drawer on mobile) ----- */}
          <aside className={`jl2-sidebar${filtersOpen ? ' is-open' : ''}`} aria-label="Filter escapes">
            <div className="jl2-sidebar-scrim" onClick={() => setFiltersOpen(false)} />
            <div className="jl2-sidebar-panel">
              <div className="jl2-sidebar-head">
                <h2 className="jl2-sidebar-title"><SlidersHorizontal size={17} aria-hidden="true" /> Filters</h2>
                {totalActive > 0 && <button type="button" className="jl2-clear" onClick={clearAll}>Clear all</button>}
                <button type="button" className="jl2-sidebar-close" aria-label="Close filters"
                  onClick={() => setFiltersOpen(false)}><X size={20} /></button>
              </div>
              <div className="jl2-sidebar-body">{filterBody}</div>
              <div className="jl2-sidebar-foot">
                <button type="button" className="h26-btn h26-btn-pill jl2-apply" onClick={() => setFiltersOpen(false)}>
                  Show {results.length} {results.length === 1 ? 'escape' : 'escapes'}
                </button>
              </div>
            </div>
          </aside>

          {/* ----- RIGHT: results ----- */}
          <section className="jl2-results">
            <div className="jl2-results-head">
              <p className="jl-count" aria-live="polite">
                <strong>{results.length}</strong> {results.length === 1 ? 'escape' : 'escapes'}
                {budgetActive ? ` · up to ${inr(budgetMax)}` : ''}
              </p>
              <div className="jl-sort" ref={sortRef}>
                <button type="button" className="jl-sort-btn" onClick={() => setSortOpen((o) => !o)}
                  aria-haspopup="listbox" aria-expanded={sortOpen}>
                  <SlidersHorizontal size={15} aria-hidden="true" />
                  <span>{sortLabel}</span>
                  <ChevronDown size={14} aria-hidden="true" />
                </button>
                {sortOpen && (
                  <ul className="jl-sort-pop" role="listbox">
                    {SORTS.map((s) => (
                      <li key={s.key}>
                        <button type="button" role="option" aria-selected={sort === s.key}
                          className={`jl-sort-opt${sort === s.key ? ' is-on' : ''}`}
                          onClick={() => { setSort(s.key); setSortOpen(false); }}>
                          {s.label}
                          {sort === s.key && <Check size={15} aria-hidden="true" />}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {totalActive > 0 && (
              <div className="jl-active jl2-active">
                {budgetActive && (
                  <button type="button" className="jl-active-chip" onClick={() => setBudgetMax(PRICE_MAX)}>
                    Up to {inr(budgetMax)} <X size={13} />
                  </button>
                )}
                {dests.map((v) => (
                  <button key={v} type="button" className="jl-active-chip" onClick={() => toggleDest(v)}>
                    <MapPin size={12} aria-hidden="true" /> {v} <X size={13} />
                  </button>
                ))}
                {whos.map((v) => (
                  <button key={v} type="button" className="jl-active-chip" onClick={() => toggleWho(v)}>
                    {v} <X size={13} />
                  </button>
                ))}
                {styles.map((v) => (
                  <button key={v} type="button" className="jl-active-chip" onClick={() => toggleStyle(v)}>
                    {v} <X size={13} />
                  </button>
                ))}
                {durations.map((v) => (
                  <button key={v} type="button" className="jl-active-chip" onClick={() => toggleDuration(v)}>
                    {v} <X size={13} />
                  </button>
                ))}
                <button type="button" className="jl-clear-all" onClick={clearAll}>Clear all</button>
              </div>
            )}

            {results.length > 0 ? (
              <>
                <div className="jl-grid jl2-grid">
                  {shown.map((j, i) => (
                    <EscapeCard key={j.id} j={j} i={i} onPhotos={openPhotos} onBook={setBooking} />
                  ))}
                </div>
                {results.length > visible && (
                  <div className="jj2-more">
                    <span className="jj2-more-count">Showing {shown.length} of {results.length} escapes</span>
                    <button type="button" className="jj2-more-btn" onClick={() => setVisible((v) => v + pageSize)}>
                      Show more escapes <Plus size={16} aria-hidden="true" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="jl-empty">
                <span className="jl-empty-icon"><Compass size={30} aria-hidden="true" /></span>
                <h2>Nothing matches all of that</h2>
                <p>
                  There are {ESCAPE_COUNT} escapes on the shelf. Loosen a filter and something will
                  turn up — or tell a specialist what you had in mind and we will build it.
                </p>
                <div className="jl-empty-actions">
                  <button type="button" className="h26-btn h26-btn-pill jl-btn-solid" onClick={clearAll}>Clear filters</button>
                  <a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer" className="h26-btn jl-btn-ghost">
                    <MessageCircle size={16} /> Ask a specialist
                  </a>
                </div>
              </div>
            )}
          </section>
        </main>
      </section>

      {/* ---------- WHERE THESE ESCAPES GO — four corners ---------- */}
      <section className="jj2-where" aria-labelledby="where-ee">
        <div className="jp-wrap">
          <div className="jj2-where-head">
            <Reveal className="h26-label jp-eyebrow" as="p">Where they go</Reveal>
            <Reveal as="h2" className="jj2-where-title" id="where-ee" delay={0.04}>
              Four corners of <em>the shelf</em>
            </Reveal>
            <Reveal as="p" className="jj2-where-sub" delay={0.08}>
              Close enough to leave on a Friday. Tap one and the shelf filters itself.
            </Reveal>
          </div>
          <div className="jp-highlights">
            {CLUSTERS.map((h, i) => (
              <Reveal className="jp-hl" key={h.name} delay={0.05 * i} y={24} as="article">
                <button type="button" className="jp-hl-link ee-hl-btn" onClick={() => chooseCluster(h.filter)}
                  aria-label={`Show ${h.name} escapes`}>
                  <div className="jp-hl-media">
                    <img src={img(h.image, 700)} alt={h.name} loading="lazy" />
                    <span className="jp-hl-scrim" aria-hidden="true" />
                    <div className="jp-hl-cap">
                      <span className="jp-hl-idx">{String(i + 1).padStart(2, '0')}</span>
                      <h3 className="jp-hl-name">{h.name}</h3>
                      <p className="jp-hl-note">{h.note}</p>
                      <span className="jp-hl-cta">Show these <ArrowRight size={15} aria-hidden="true" /></span>
                    </div>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- REVIEWS ---------- */}
      <section className="h26-reviews" id="reviews">
        <div className="h26-head">
          <Reveal className="h26-label" as="p">Booked online, travelled happy</Reveal>
          <Reveal as="h2" className="h26-h2" delay={0.05}>People who booked one themselves.</Reveal>
          <Reveal as="p" className="hi-rev-sub" delay={0.1}>
            Weekenders, honeymooners and first-time solo travellers — none of whom spoke to a salesperson.
          </Reveal>
        </div>

        <Reveal className="hi-rtrust">
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
            <span className="hi-rtrust-plat"><GoogleG /><span><strong>4.8</strong> on <b>Google</b></span></span>
            <span className="hi-rtrust-plat"><TripAdvisorOwl /><span><strong>4.9</strong> on <b>Tripadvisor</b></span></span>
          </div>
        </Reveal>

        <div className="h26-marquee">
          <div className="h26-marquee-track">
            {[...REVIEWS, ...REVIEWS].map((r, i) => (
              <article className="h26-rev" key={i}>
                <div className="h26-rev-photo">
                  <img src={img(r.tripPhoto, 600)} alt={r.tour} loading="lazy" />
                  <span className="h26-rev-tour">{r.tour}</span>
                </div>
                <div className="h26-rev-content">
                  <div className="h26-rev-stars">
                    {Array.from({ length: r.rating }).map((_, k) => <Star key={k} size={14} fill="currentColor" />)}
                  </div>
                  <p>"{r.text}"</p>
                  <div className="h26-rev-who">
                    <img src={img(r.avatar, 120)} alt="" loading="lazy" />
                    <span><strong>{r.name}</strong><em>{r.location}</em></span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
        <Reveal className="h26-reviews-more" delay={0.1}>
          <Link to="/testimonials" className="h26-btn h26-btn-pill">View all reviews <ArrowUpRight size={16} /></Link>
        </Reveal>
      </section>

      {/* ---------- LOOKING FOR SOMETHING BIGGER ----------
           Where the catalogue hands over to the specialist-designed range. The
           longer, further and more expensive journeys are not on this shelf,
           and this is how someone who needs one finds their way there. */}
      <section className="jj2-pav" aria-labelledby="pav-ee">
        <div className="jp-wrap">
          <div className="jj2-pav-head">
            <div>
              <Reveal className="h26-label jp-eyebrow" as="p">Something bigger in mind?</Reveal>
              <Reveal as="h2" className="jj2-pav-title" id="pav-ee" delay={0.04}>
                Beyond the <strong>shelf</strong>
              </Reveal>
            </div>
            <Reveal as="div" delay={0.06}>
              <Link to="/journeys4" className="jj2-pav-link">Browse all journeys <ArrowUpRight size={16} aria-hidden="true" /></Link>
            </Reveal>
          </div>
          <div className="jj2-pav-grid">
            {SIMILAR.map((s, i) => (
              <Reveal key={s.title} delay={0.05 * i} y={24} as="div">
                <Link to={s.to} className="jj2-pav-card">
                  <div className="jj2-pav-media">
                    <img src={img(s.image, 700)} alt={s.title} loading="lazy" />
                    <span className="jj2-pav-region"><MapPin size={12} aria-hidden="true" /> {s.region}</span>
                  </div>
                  <div className="jj2-pav-body">
                    <h3 className="jj2-pav-name">{s.title}</h3>
                    <div className="jj2-pav-meta">
                      <Clock size={13} aria-hidden="true" /> {s.nights}
                      <span aria-hidden="true">·</span>
                      <Calendar size={13} aria-hidden="true" /> {s.season}
                    </div>
                    <div className="jj2-pav-foot">
                      <span className="jj2-pav-price">from {s.price} <small>pp</small></span>
                      <span className="jj2-pav-go">View <ArrowRight size={15} aria-hidden="true" /></span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CLOSING CTA ---------- */}
      <section className="jl-cta">
        <div className="jl-cta-bg" style={{ backgroundImage: `url(${img(U('1514282401047-d79a71a590e8'), 1800)})` }} aria-hidden="true" />
        <div className="jl-cta-veil" aria-hidden="true" />
        <div className="jl-cta-inner">
          <Reveal className="h26-label jl-cta-eyebrow" as="span">Got a long weekend?</Reveal>
          <Reveal as="h2" className="jl-cta-title" delay={0.05}>
            Take one down off the shelf.<br /><strong>You could be booked before the kettle boils.</strong>
          </Reveal>
          <Reveal className="jl-cta-actions" delay={0.12}>
            <a href="#escapes" className="h26-btn h26-btn-accent h26-btn-lg">
              Browse {ESCAPE_COUNT} escapes <ArrowRight size={17} />
            </a>
            <Link to={CALLBACK} className="h26-btn h26-btn-glass h26-btn-lg">
              <PhoneCall size={16} /> Rather talk it through?
            </Link>
          </Reveal>
          <Reveal as="p" className="jl-cta-hours" delay={0.18}>
            Book any hour you like. Specialists are on hand 9am–9pm IST, every day.
          </Reveal>
        </div>
      </section>

      <SiteFooter />

      {/* ---------- MOBILE BOTTOM BAR — the retained support route ---------- */}
      <div className="jj2-thumbbar">
        <div className="jj2-thumbbar__nudge">
          <small>Not sure which one?</small>
          <strong>A specialist can help — free</strong>
        </div>
        <a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer" className="jj2-thumbbar__chat">
          <MessageCircle size={18} aria-hidden="true" /> Chat with a specialist
        </a>
        <a href={CONTACT.phoneHref} className="jj2-thumbbar__ico" aria-label="Call a specialist">
          <Phone size={20} aria-hidden="true" />
        </a>
      </div>

      {/* ---------- EINAYA ---------- */}
      <button className={`lx2i-aifab ${chatOpen ? 'is-hidden' : ''}`}
        aria-label="Open Einaya, the AI travel assistant" onClick={() => setChatOpen(true)}>
        <Sparkles size={20} />
        <span>Ask Einaya</span>
      </button>

      {/* ---------- PHOTO LIGHTBOX ---------- */}
      <AnimatePresence>
        {lightbox && <Lightbox data={lightbox} onClose={() => setLightbox(null)} />}
      </AnimatePresence>

      {/* ---------- BOOKING DRAWER ---------- */}
      {booking && (
        <BookingDrawer
          escape={booking}
          onClose={() => setBooking(null)}
          onHelp={() => { setBooking(null); openCallback(); }}
        />
      )}
    </div>

    {/* Rendered OUTSIDE the page wrapper so scoped colour/font styles cannot
        bleed into the concierge. */}
    <ChatBot open={chatOpen} onOpenChange={setChatOpen} hideFab name="Einaya" />
    </>
  );
}
