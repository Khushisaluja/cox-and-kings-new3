/* ============================================================
   Journeys4 — the tour LISTING page for Cox & Kings, sidebar edition.

   A variant of /journeys2 with exactly ONE change: every card carries
   a clear "Private Tour" or "Group Tour" badge on its image, so the
   way a trip travels is obvious before you read a word. Everything
   else — the open LEFT filter rail (Destination, Budget, Travellers,
   Dates, Pace, Trip style), the filterable/sortable grid and the
   pill-based radius language — is left exactly as /journeys2. The
   single badge style lives in Journeys4.css, layered last.

   The nav and footer are NOT this page's: they come from <SiteChrome>,
   the one definition the whole site shares.
   ============================================================ */
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { SmartLink as Link, CALLBACK } from '../components/ScheduleCall';
import { SiteNav, SiteFooter } from '../components/SiteChrome';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import {
  PhoneCall, MessageCircle, ArrowRight, Search, MapPin,
  Compass, Calendar, X, ChevronDown, ChevronLeft, ChevronRight,
  Star, SlidersHorizontal, Clock, Users, User, Gauge, Wallet,
  Check, Plus, Minus, CalendarRange, Building2, Globe2, Stamp,
} from 'lucide-react';
import { img } from '../data/v3content';
import './Home2026.css';
import './Home2026Improved.css';
import './Journeys.css';
import './Journeys2.css';
import './Journeys4.css';
/* The nav and footer now come from <SiteChrome>, which pulls its own scoped
   stylesheets. These two stay because the PAGE also leans on them (the .h26-btn
   pills in the hero, the empty state and the closing CTA). */
import './NewTypography.css';
import './New3.css';

/* The WhatsApp line the enquiry CTAs dial. The phone/email that used to sit
   here belonged to the nav and footer, and moved with them into SiteChrome. */
const CONTACT = {
  whatsappHref: 'https://wa.me/918556001700',
};

/* ---- Canonical destination filters. Order = the sidebar list. ---- */
const REGIONS = [
  'India', 'Japan', 'Switzerland', 'Italy', 'Northern Lights',
  'Australia & NZ', 'Africa Safari', 'Southeast Asia',
  'Maldives', 'Europe', 'USA',
];

/* Trip-style filter (mirrors the /improved hero "Style" list). */
const STYLES = ['Group Tour', 'Bespoke Private', 'Luxury', 'Family', 'Couple', 'Safari'];

/* Pace filter. */
const PACES = ['Relaxed', 'Balanced', 'Active'];

/* Visa filter — for an Indian passport. Each journey carries one of these
   statuses (see VISA_BY_ID); the sidebar exposes the two traveller-friendly
   ones so you can hide trips that need a visa arranged in advance. */
const VISA_OPTIONS = [
  { value: 'free', label: 'Visa-free' },
  { value: 'voa', label: 'Visa on arrival / e-visa' },
];
const VISA_LABEL = { free: 'Visa-free', voa: 'Visa on arrival', required: 'Visa needed' };

/* Travel-month selector — filters on each journey's season string. */
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_IDX = Object.fromEntries(MONTHS.map((m, i) => [m, i]));

/* Does a journey's season string cover the chosen month? Permissive: an
   unparseable season never excludes a trip. Handles single months ('Dec'),
   ranges ('Mar–Apr') and wrap-around ranges ('Oct–Mar'). */
function monthInSeason(month, season) {
  if (!month) return true;
  const s = (season || '').trim();
  if (/year-round|any/i.test(s)) return true;
  const toks = s.split('–').map((t) => t.trim().slice(0, 3));
  const start = MONTH_IDX[toks[0]];
  const end = MONTH_IDX[toks[toks.length - 1]];
  const mi = MONTH_IDX[month];
  if (start == null || end == null || mi == null) return true;
  return start <= end ? mi >= start && mi <= end : mi >= start || mi <= end;
}

const SORTS = [
  { key: 'recommended', label: 'Recommended' },
  { key: 'price-asc', label: 'Price · low to high' },
  { key: 'price-desc', label: 'Price · high to low' },
  { key: 'nights-desc', label: 'Duration · longest first' },
];

/* One-line "how it travels" label, derived from the trip style. */
const GROUP_BY_STYLE = {
  'Group Tour': 'Small group · max 18',
  'Bespoke Private': 'Private & tailor-made',
  Luxury: 'Private guiding',
  Family: 'Family-friendly',
  Couple: 'Just the two of you',
  Safari: 'Small-group safari',
};

/* Binary tour-type badge shown prominently on every card. Escorted
   fixed-departure styles (group tours, small-group safaris) read as a
   "Group Tour"; everything designed just for the travellers reads as a
   "Private Tour". Data-driven off the trip style. */
const GROUP_STYLES = ['Group Tour', 'Safari'];
const tourTypeOf = (style) => (GROUP_STYLES.includes(style) ? 'Group Tour' : 'Private Tour');

/* Author-vetted, region-correct photo pools (shared with /journeys). */
const U = (id) => `https://images.unsplash.com/photo-${id}`;
const REGION_PHOTOS = {
  India: [U('1564507592333-c60657eea523'), U('1477587458883-47145ed94245'), U('1524492412937-b28074a5d7da'), U('1602216056096-3b40cc0c9944'), U('1587474260584-136574528ed5')],
  Japan: [U('1522383225653-ed111181a951'), U('1492571350019-22de08371fd3'), U('1493976040374-85c8e12f0c0e'), U('1490806843957-31f4c9a91c65'), U('1528360983277-13d401cdc186'), U('1540959733332-eab4deabeeaf')],
  Switzerland: [U('1530122037265-a5f1f91d3b99'), U('1467269204594-9661b134dd2b')],
  Italy: [U('1534445867742-43195f401b6c'), U('1523906834658-6e24ef2386f9'), U('1467269204594-9661b134dd2b')],
  'Northern Lights': [U('1483347756197-71ef80e95f73'), U('1476610182048-b716b8518aae'), U('1531366936337-7c912a4589a7')],
  'Australia & NZ': [U('1506973035872-a4ec16b8e8d9'), U('1469521669194-babb45599def'), U('1507699622108-4be3abd695ad')],
  'Africa Safari': [U('1516426122078-c23e76319801'), U('1547471080-7cc2caa01a7e')],
  'Southeast Asia': [U('1528181304800-259b08848526'), U('1546708973-b339540b5162')],
  Maldives: [U('1514282401047-d79a71a590e8'), U('1546708973-b339540b5162')],
  Europe: [U('1467269204594-9661b134dd2b'), U('1523906834658-6e24ef2386f9'), U('1543349689-9a4d426bee8e')],
  USA: [U('1501594907352-04cda38ebc29'), U('1503614472-8c93d56e92ce')],
};

const HERO_IMG = U('1493976040374-85c8e12f0c0e');

/* ---- The cities each journey visits, keyed by id. Kept here (rather than on
   every literal below) so the catalogue stays readable. These feed the
   Destination filter's city-level search — searching "Kyoto" or "Amalfi"
   surfaces the trips that actually go there. ---- */
const CITY_BY_ID = {
  'in-golden': ['Delhi', 'Agra', 'Jaipur'],
  'in-rajasthan': ['Udaipur', 'Jodhpur', 'Jaisalmer'],
  'in-kerala': ['Kochi', 'Munnar', 'Alleppey'],
  'in-honeymoon': ['Udaipur', 'Ranthambore'],
  'in-family': ['Jaipur', 'Agra', 'Ranthambore'],
  'jp-blossom': ['Tokyo', 'Kyoto'],
  'jp-first': ['Tokyo', 'Hakone', 'Kyoto'],
  'jp-luxe': ['Kyoto', 'Naoshima'],
  'ch-summer': ['Lucerne', 'Zermatt', 'Interlaken'],
  'ch-it-grand': ['Lucerne', 'Zermatt', 'Venice', 'Rome'],
  'ch-rail': ['Zermatt', 'St. Moritz'],
  'it-slow': ['Rome', 'Florence', 'Amalfi'],
  'it-amalfi': ['Amalfi', 'Positano'],
  'it-family': ['Rome', 'Florence'],
  'nl-chase': ['Tromsø'],
  'nl-ice': ['Kiruna', 'Tromsø'],
  'nz-road': ['Queenstown', 'Christchurch'],
  'au-family': ['Cairns', 'Sydney'],
  'af-migration': ['Maasai Mara', 'Nairobi'],
  'af-private': ['Maasai Mara', 'Nairobi'],
  'af-tanzania': ['Serengeti', 'Ngorongoro'],
  'af-southafrica': ['Cape Town', 'Kruger'],
  'eu-grand': ['Paris', 'Rome', 'Amsterdam'],
  'eu-iberia': ['Lisbon', 'Porto', 'Seville', 'Madrid'],
  'eu-xmas': ['Vienna', 'Prague'],
  'sea-islands': ['Bangkok', 'Siem Reap'],
  'sea-srilanka': ['Kandy', 'Colombo', 'Ella'],
  'sea-vietnam': ['Hanoi', 'Halong Bay', 'Siem Reap'],
  'mv-overwater': ['Malé'],
  'us-coast': ['New York', 'San Francisco', 'Las Vegas'],
  'us-canada': ['Banff', 'Lake Louise'],
};

/* ---- Visa status per journey, for an Indian passport. 'free' = no visa,
   'voa' = visa on arrival / e-visa, 'required' = arrange in advance. Anything
   not listed defaults to 'required'. Kept here as a single editable table so
   it's easy to keep current as rules change. ---- */
const VISA_BY_ID = {
  // India — home turf, no visa.
  'in-golden': 'free', 'in-rajasthan': 'free', 'in-kerala': 'free',
  'in-honeymoon': 'free', 'in-family': 'free',
  // Visa on arrival / e-visa destinations.
  'mv-overwater': 'voa',                                   // Maldives
  'sea-islands': 'voa', 'sea-srilanka': 'voa', 'sea-vietnam': 'voa', // Thailand/Cambodia/Sri Lanka/Vietnam
  'af-migration': 'voa', 'af-private': 'voa', 'af-tanzania': 'voa',  // Kenya / Tanzania
  // Everything else (Japan, Schengen Europe, Australia/NZ, South Africa, USA)
  // needs a visa arranged in advance and is left to the 'required' default.
};

/* ---- Which detailed product page a card opens. Only two are built so far:
   the Japan FIT/luxe page and the Thailand GIT/low-budget page. Every other
   journey points at its own /tour-detail-<id> URL that has no route yet, so it
   deliberately lands on the 404 page — which carries dev links to the two
   examples above. As those pages get built, add the route in App.jsx and a
   mapping here. ---- */
const DETAIL_PAGES = {
  'jp-blossom': '/tour-detail-japan-5',
  'jp-first': '/tour-detail-japan-5',
  'jp-luxe': '/tour-detail-japan-5',
  'sea-islands': '/tour-detail-thailand-2',
};
const detailTo = (id) => DETAIL_PAGES[id] || `/tour-detail-${id}`;

/* ---- The catalogue (shared with /journeys). ---- */
function buildGallery(o) {
  const pool = REGION_PHOTOS[o.regions[0]] || [];
  return [...new Set([o.image, ...pool])].slice(0, 5);
}
const J = (o) => ({
  ...o,
  cities: CITY_BY_ID[o.id] || [],
  visa: VISA_BY_ID[o.id] || 'required',
  /* Cards open a product page. `to` is derived here (overriding whatever the
     literal below sets) so every card routes to a detail page — a real one
     where it exists, a 404-with-dev-links where it doesn't. */
  to: detailTo(o.id),
  priceLabel: `₹${o.price.toLocaleString('en-IN')}`,
  nightsLabel: `${o.nights} nights`,
  group: GROUP_BY_STYLE[o.style],
  tourType: tourTypeOf(o.style),
  gallery: buildGallery(o),
});
const ALL_JOURNEYS = [
  /* ---- India. Added so the "Indian Getaways" nav entry resolves to real
     journeys: the catalogue previously had no India inventory at all, so any
     India search (Rajasthan, Kerala, the Golden Triangle) dead-ended on
     "0 journeys". Priced and paced in line with the rest of the list. ---- */
  J({ id: 'in-golden', title: 'Golden Triangle & the Taj', blurb: 'Delhi, Agra and Jaipur: the Taj at sunrise, Amber Fort and the Pink City.', regions: ['India'], style: 'Group Tour', pace: 'Balanced', rating: 4.9, nights: 8, season: 'Oct–Mar', price: 95000, image: U('1564507592333-c60657eea523'), to: CALLBACK }),
  J({ id: 'in-rajasthan', title: 'Rajasthan: Palaces & Forts', blurb: 'Udaipur lake palaces, Jodhpur blue city and a night under the Thar desert sky.', regions: ['India'], style: 'Luxury', pace: 'Relaxed', rating: 4.9, nights: 10, season: 'Oct–Mar', price: 185000, image: U('1477587458883-47145ed94245'), to: CALLBACK }),
  J({ id: 'in-kerala', title: 'Kerala Backwaters & Coast', blurb: 'A private houseboat on the backwaters, tea country and a slow finish by the Arabian Sea.', regions: ['India'], style: 'Bespoke Private', pace: 'Relaxed', rating: 4.8, nights: 9, season: 'Sep–Mar', price: 120000, image: U('1602216056096-3b40cc0c9944'), to: CALLBACK }),
  J({ id: 'in-honeymoon', title: 'Udaipur & Ranthambore Honeymoon', blurb: 'A lake-palace suite, a private dinner on the water and tigers at first light.', regions: ['India'], style: 'Couple', pace: 'Relaxed', rating: 4.9, nights: 7, season: 'Oct–Mar', price: 165000, image: U('1524492412937-b28074a5d7da'), to: CALLBACK }),
  J({ id: 'in-family', title: 'India for Families', blurb: 'Forts to climb, elephants to meet and a tiger safari, paced for younger travellers.', regions: ['India'], style: 'Family', pace: 'Relaxed', rating: 4.7, nights: 9, season: 'Oct–Mar', price: 110000, image: U('1587474260584-136574528ed5'), to: CALLBACK }),
  J({ id: 'jp-blossom', title: 'Cherry Blossom Japan', blurb: 'Two weeks, one fleeting bloom — Tokyo neon to Kyoto temple gardens, timed to the petals.', regions: ['Japan'], style: 'Group Tour', pace: 'Balanced', rating: 4.9, nights: 13, season: 'Mar–Apr', price: 295000, image: U('1522383225653-ed111181a951'), to: '/tour-detail-japan-5' }),
  J({ id: 'jp-first', title: 'Japan for First-Timers', blurb: 'Tokyo, Hakone and Kyoto with a private guide and a night in a traditional ryokan.', regions: ['Japan'], style: 'Bespoke Private', pace: 'Balanced', rating: 4.8, nights: 10, season: 'Any date', price: 310000, image: U('1492571350019-22de08371fd3'), to: '/tour-detail-japan-5' }),
  J({ id: 'jp-luxe', title: 'Japan: Ryokans & Art Islands', blurb: 'Slow luxury — design hotels, private onsen and the Naoshima art islands.', regions: ['Japan'], style: 'Luxury', pace: 'Relaxed', rating: 4.9, nights: 9, season: 'Year-round', price: 420000, image: U('1493976040374-85c8e12f0c0e'), to: '/tour-detail-japan-5' }),

  J({ id: 'ch-summer', title: 'Summer in Switzerland', blurb: 'Glacier trains and alpine lakes — Lucerne, Zermatt and the Jungfrau region.', regions: ['Switzerland', 'Europe'], style: 'Group Tour', pace: 'Relaxed', rating: 4.8, nights: 10, season: 'Jun–Sep', price: 245000, image: U('1530122037265-a5f1f91d3b99'), to: CALLBACK }),
  J({ id: 'ch-it-grand', title: 'Grand Switzerland & Italy', blurb: 'Lakeside Lucerne, the Matterhorn, then Venice to Rome — paced so you actually savour it.', regions: ['Switzerland', 'Italy', 'Europe'], style: 'Group Tour', pace: 'Balanced', rating: 4.7, nights: 13, season: 'Apr–Sep', price: 245000, image: U('1530122037265-a5f1f91d3b99'), to: CALLBACK }),
  J({ id: 'ch-rail', title: 'Swiss Alps Private Rail Journey', blurb: 'The Glacier Express and Bernina line, first-class, with elevated stays throughout.', regions: ['Switzerland', 'Europe'], style: 'Luxury', pace: 'Relaxed', rating: 4.9, nights: 8, season: 'May–Oct', price: 360000, image: U('1530122037265-a5f1f91d3b99'), to: CALLBACK }),

  J({ id: 'it-slow', title: 'Slow Italy: Coast to Art', blurb: 'Rome after-hours, a Tuscan villa and a hidden Amalfi cove — designed around you.', regions: ['Italy', 'Europe'], style: 'Bespoke Private', pace: 'Relaxed', rating: 4.8, nights: 9, season: 'Apr–Oct', price: 240000, image: U('1534445867742-43195f401b6c'), to: CALLBACK }),
  J({ id: 'it-amalfi', title: 'Amalfi & the Southern Coast', blurb: 'A private skipper, cliffside stays and long lunches above the Tyrrhenian.', regions: ['Italy', 'Europe'], style: 'Luxury', pace: 'Relaxed', rating: 4.8, nights: 7, season: 'May–Sep', price: 280000, image: U('1534445867742-43195f401b6c'), to: CALLBACK }),
  J({ id: 'it-family', title: 'Italy for Families', blurb: 'Gladiator schools in Rome, gelato trails and a slow Tuscan farmhouse week.', regions: ['Italy', 'Europe'], style: 'Family', pace: 'Relaxed', rating: 4.7, nights: 10, season: 'Apr–Oct', price: 215000, image: U('1534445867742-43195f401b6c'), to: CALLBACK }),

  J({ id: 'nl-chase', title: 'Chasing the Northern Lights', blurb: 'Arctic Scandinavia after dark — aurora hunts, huskies and snowbound nights.', regions: ['Northern Lights', 'Europe'], style: 'Group Tour', pace: 'Active', rating: 4.7, nights: 7, season: 'Oct–Mar', price: 275000, image: U('1483347756197-71ef80e95f73'), to: CALLBACK }),
  J({ id: 'nl-ice', title: 'Arctic Scandinavia & Ice Hotels', blurb: 'A night in an ice hotel, glass-roofed cabins and the aurora overhead.', regions: ['Northern Lights', 'Europe'], style: 'Luxury', pace: 'Balanced', rating: 4.8, nights: 8, season: 'Dec–Mar', price: 340000, image: U('1483347756197-71ef80e95f73'), to: CALLBACK }),

  J({ id: 'nz-road', title: 'New Zealand by Road', blurb: 'The South Island end to end — fjords, glaciers and open mountain roads.', regions: ['Australia & NZ'], style: 'Bespoke Private', pace: 'Active', rating: 4.9, nights: 12, season: 'Oct–Apr', price: 320000, image: U('1469521669194-babb45599def'), to: CALLBACK }),
  J({ id: 'au-family', title: 'Australia for Families', blurb: 'Reef, beaches and easy days — snorkelling, Rotorua and time to breathe.', regions: ['Australia & NZ'], style: 'Family', pace: 'Relaxed', rating: 4.7, nights: 14, season: 'Year-round', price: 340000, image: U('1506973035872-a4ec16b8e8d9'), to: CALLBACK }),

  J({ id: 'af-migration', title: 'African Safari: Great Migration', blurb: 'The Maasai Mara in migration season — game drives at first and last light.', regions: ['Africa Safari'], style: 'Group Tour', pace: 'Active', rating: 4.9, nights: 8, season: 'Jul–Oct', price: 310000, image: U('1516426122078-c23e76319801'), to: CALLBACK }),
  J({ id: 'af-private', title: 'Kenya Private Conservancy Safari', blurb: 'Private Maasai Mara camps, few vehicles and a naturalist to yourself.', regions: ['Africa Safari'], style: 'Safari', pace: 'Balanced', rating: 4.9, nights: 8, season: 'Jul–Oct', price: 420000, image: U('1516426122078-c23e76319801'), to: CALLBACK }),
  J({ id: 'af-tanzania', title: 'Tanzania: Serengeti & Ngorongoro', blurb: 'The Serengeti plains and the Ngorongoro crater, in classic tented camps.', regions: ['Africa Safari'], style: 'Safari', pace: 'Active', rating: 4.8, nights: 9, season: 'Jun–Oct', price: 380000, image: U('1547471080-7cc2caa01a7e'), to: CALLBACK }),
  J({ id: 'af-southafrica', title: 'South Africa: Cape & Kruger', blurb: 'Cape Town, the winelands and big-five days in a private Kruger reserve.', regions: ['Africa Safari'], style: 'Safari', pace: 'Balanced', rating: 4.7, nights: 11, season: 'Year-round', price: 325000, image: U('1516426122078-c23e76319801'), to: CALLBACK }),

  J({ id: 'eu-grand', title: 'Grand Europe', blurb: 'Many countries, one effortless journey — the classic capitals, seamlessly linked.', regions: ['Europe'], style: 'Group Tour', pace: 'Active', rating: 4.6, nights: 15, season: 'Apr–Sep', price: 185000, image: U('1467269204594-9661b134dd2b'), to: CALLBACK }),
  J({ id: 'eu-iberia', title: 'Portugal & Spain: Iberian Journey', blurb: 'Lisbon and Porto, Seville and Madrid — tiles, tapas and Atlantic light.', regions: ['Europe'], style: 'Group Tour', pace: 'Balanced', rating: 4.7, nights: 12, season: 'Apr–Oct', price: 195000, image: U('1467269204594-9661b134dd2b'), to: CALLBACK }),
  J({ id: 'eu-xmas', title: 'European Christmas Markets', blurb: 'Mulled wine and old-town lights across the festive heart of Europe.', regions: ['Europe'], style: 'Group Tour', pace: 'Balanced', rating: 4.7, nights: 9, season: 'Dec', price: 170000, image: U('1543349689-9a4d426bee8e'), to: CALLBACK }),

  J({ id: 'sea-islands', title: 'Islands & Temples of Southeast Asia', blurb: 'Bangkok street food, Angkor at dawn and slow days on the islands.', regions: ['Southeast Asia'], style: 'Bespoke Private', pace: 'Balanced', rating: 4.7, nights: 11, season: 'Year-round', price: 95000, image: U('1528181304800-259b08848526'), to: CALLBACK }),
  J({ id: 'sea-srilanka', title: 'Sri Lanka: Tea Trails & Coast', blurb: 'Hill-country tea estates, ancient cities and a slow finish by the sea.', regions: ['Southeast Asia'], style: 'Bespoke Private', pace: 'Relaxed', rating: 4.8, nights: 9, season: 'Year-round', price: 130000, image: U('1546708973-b339540b5162'), to: CALLBACK }),
  J({ id: 'sea-vietnam', title: 'Vietnam & Cambodia Discovery', blurb: 'Hanoi to Halong Bay, the Mekong and the temples of Angkor.', regions: ['Southeast Asia'], style: 'Group Tour', pace: 'Balanced', rating: 4.6, nights: 12, season: 'Oct–Apr', price: 120000, image: U('1528181304800-259b08848526'), to: CALLBACK }),

  J({ id: 'mv-overwater', title: 'Maldives Overwater Escape', blurb: 'Overwater calm — a private villa, a house reef and nowhere to be.', regions: ['Maldives'], style: 'Couple', pace: 'Relaxed', rating: 4.9, nights: 5, season: 'Year-round', price: 140000, image: U('1514282401047-d79a71a590e8'), to: CALLBACK }),

  J({ id: 'us-coast', title: 'USA Coast to Coast', blurb: 'The great national parks and iconic cities, linked into one road-trip arc.', regions: ['USA'], style: 'Bespoke Private', pace: 'Active', rating: 4.7, nights: 14, season: 'May–Oct', price: 220000, image: U('1501594907352-04cda38ebc29'), to: CALLBACK }),
  J({ id: 'us-canada', title: 'Canadian Rockies & Rail', blurb: 'Banff, Lake Louise and the Rocky Mountaineer through the mountains.', regions: ['USA'], style: 'Group Tour', pace: 'Balanced', rating: 4.8, nights: 10, season: 'Jun–Sep', price: 295000, image: U('1503614472-8c93d56e92ce'), to: CALLBACK }),
];

/* ---- Destination search vocabulary. The filter's Destination search spans
   BOTH countries/regions and the individual cities the trips visit, so a
   traveller can search either "Japan" or "Kyoto". A quick set tells the two
   apart when a chosen destination is applied as a filter. ---- */
const REGION_SET = new Set(REGIONS);
const ALL_CITIES = [...new Set(ALL_JOURNEYS.flatMap((j) => j.cities))].sort((a, b) => a.localeCompare(b));
const DESTINATIONS = [
  ...REGIONS.map((r) => ({ value: r, label: r, type: 'region' })),
  ...ALL_CITIES.map((c) => ({ value: c, label: c, type: 'city' })),
];
const isRegionDest = (d) => REGION_SET.has(d);

/* Destinations that own a dedicated landing page. Typing one of these into the
   HERO search and pressing Enter jumps straight to that page — the sidebar
   Destination search still just filters this listing in place. Keys are
   lower-cased for a case-insensitive match. */
const DESTINATION_PAGES = {
  japan: '/journeys/japan-2',
};

/* ---- Budget bounds + price distribution, derived from the catalogue. ---- */
const _prices = ALL_JOURNEYS.map((j) => j.price);
const PRICE_MIN = Math.floor(Math.min(..._prices) / 10000) * 10000; // 90,000
const PRICE_MAX = Math.ceil(Math.max(..._prices) / 10000) * 10000;  // 420,000
const PRICE_STEP = 5000;

const fmtLakh = (v) => {
  const l = v / 100000;
  return `₹${(Number.isInteger(l) ? l : l.toFixed(1)).toString().replace(/\.0$/, '')}L`;
};

/* One-tap budget ceilings (only those inside the real price range show). */
const BUDGET_PRESETS = [
  { label: '≤ ₹1.5L', v: 150000 },
  { label: '≤ ₹2.5L', v: 250000 },
  { label: '≤ ₹3.5L', v: 350000 },
].filter((p) => p.v > PRICE_MIN && p.v < PRICE_MAX);

/* ---- Trip-length bounds, derived from the catalogue (nights). ---- */
const _nights = ALL_JOURNEYS.map((j) => j.nights);
const NIGHTS_MIN = Math.min(..._nights); // 5
const NIGHTS_MAX = Math.max(..._nights); // 15
const fmtNights = (v) => `${v} ${v === 1 ? 'night' : 'nights'}`;

/* One-tap trip-length ceilings (only those inside the real range show). */
const DURATION_PRESETS = [
  { label: '≤ 7 nights', v: 7 },
  { label: '≤ 10 nights', v: 10 },
  { label: '≤ 13 nights', v: 13 },
].filter((p) => p.v > NIGHTS_MIN && p.v < NIGHTS_MAX);

/* ---- Calendar constants for the travel-date picker. ---- */
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const FLEX_STEPS = [0, 2, 3, 4]; // days of ± flexibility

/* Which months does a chosen date (± flex days) touch? */
function dateWindowMonths(date, flex) {
  if (!date) return null;
  const base = new Date(date.y, date.m, date.d);
  const months = new Set();
  for (let off = -flex; off <= flex; off += 1) {
    const d = new Date(base);
    d.setDate(base.getDate() + off);
    months.add(MONTHS[d.getMonth()]);
  }
  return [...months];
}

/* Trigger-label date format, e.g. "12 Aug". */
const fmtDate = (date) => `${date.d} ${MONTHS[date.m]}`;

/* ---- Reduced-motion-safe reveal (matches /improved). ---- */
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

/* A single journey card — reuses the .jl-card styles from Journeys.css.
   The card image is an inline carousel: prev/next arrows and dot markers
   let you flick through the gallery without leaving the listing (no more
   dead "N photos" label). */
function JourneyCard({ j, i, people = 1 }) {
  const waHref = `${CONTACT.whatsappHref}?text=${encodeURIComponent(`Hi Cox & Kings, I'd like to enquire about the "${j.title}" journey.`)}`;
  const isGroup = j.tourType === 'Group Tour';
  const shots = j.gallery;
  const many = shots.length > 1;
  const [shot, setShot] = useState(0);
  /* Arrows sit above the itinerary link — stop them navigating / bubbling. */
  const step = (dir) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShot((s) => (s + dir + shots.length) % shots.length);
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
              {shots.map((s, k) => (
                <button
                  key={s + k}
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
        <div className="jl4-card-tags">
          <span className="jl-card-group"><Users size={13} aria-hidden="true" /> {j.group}</span>
          <span className={`jl4-visa jl4-visa-${j.visa}`}>
            <Stamp size={12} aria-hidden="true" /> {VISA_LABEL[j.visa]}
          </span>
        </div>
        <p className="jl-card-blurb">{j.blurb}</p>
        <div className="jl-card-meta">
          <span><Clock size={14} aria-hidden="true" /> {j.nightsLabel}</span>
          <span><Calendar size={14} aria-hidden="true" /> {j.season}</span>
          <span><Gauge size={14} aria-hidden="true" /> {j.pace} pace</span>
        </div>
        <div className="jl-card-foot">
          <span className="jl-card-price">
            <small>from</small> {j.priceLabel} <small>/ person</small>
            {people > 1 && (
              <span className="jl2-card-total">
                ≈ ₹{(j.price * people).toLocaleString('en-IN')} for {people} travellers
              </span>
            )}
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

/* Photo lightbox — cycles a tour's gallery without leaving the listing. */
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

/* A single open filter group in the sidebar — a labelled section with a
   list of always-visible checkbox rows. Each row shows a live count of
   how many journeys would match it. Uses role="group" + aria-labelledby
   (rather than fieldset/legend) so the vertical rhythm is fully in our
   control — native legends inject unpredictable spacing. */
function FilterGroup({ id, title, icon: Icon, options, selected, onToggle, counts }) {
  const labelId = `j2grp-${id}`;
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
              <input
                type="checkbox"
                checked={on}
                onChange={() => onToggle(opt.value)}
              />
              <span className="j2-check" aria-hidden="true">{on && <Check size={12} strokeWidth={3} />}</span>
              <span className="j2-option-label">{opt.label}</span>
              {count !== null && <span className="j2-option-count">{count}</span>}
            </label>
          );
        })}
      </div>
    </div>
  );
}

/* Wrapper that gives a control the same eyebrow + rhythm as FilterGroup. */
function FilterField({ id, title, icon: Icon, children, aside }) {
  const labelId = `j2grp-${id}`;
  return (
    <div className="j2-group" role="group" aria-labelledby={labelId}>
      <p className="j2-group-title" id={labelId}>
        {Icon && <Icon size={14} aria-hidden="true" />} {title}
        {aside && <span className="j2-group-aside">{aside}</span>}
      </p>
      {children}
    </div>
  );
}

/* Searchable destination combobox spanning BOTH countries/regions and cities.
   Typing filters a suggestion list, grouped into "Countries & regions" and
   "Cities"; focusing the empty field shows all of them. Picks become chips,
   each tagged with a small city/region icon so it's clear which you chose. */
function DestinationSearch({ selected, onToggle, counts }) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrapRef = useRef(null);

  useEffect(() => {
    const onDoc = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const needle = q.trim().toLowerCase();
  /* Flat list drives keyboard nav; the render groups it by type. Regions come
     first so a bare "Japan" still lands on the country, not a city. */
  const suggestions = DESTINATIONS.filter(
    (d) => !selected.includes(d.value) && d.label.toLowerCase().includes(needle)
  );
  const regionHits = suggestions.filter((d) => d.type === 'region');
  const cityHits = suggestions.filter((d) => d.type === 'city');

  const pick = (d) => { onToggle(d.value); setQ(''); setActive(0); };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setActive((a) => Math.min(a + 1, suggestions.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === 'Enter' && suggestions[active]) { e.preventDefault(); pick(suggestions[active]); }
    else if (e.key === 'Escape') { setOpen(false); }
  };

  /* Render one option row. `idx` is the row's position in the flat list so
     keyboard highlight and mouse hover stay in sync across both groups. */
  const renderOpt = (d, idx) => {
    const Icon = d.type === 'city' ? Building2 : Globe2;
    return (
      <li key={`${d.type}-${d.value}`}>
        <button
          type="button"
          role="option"
          aria-selected={idx === active}
          className={`j2-dest-opt${idx === active ? ' is-active' : ''}`}
          onMouseEnter={() => setActive(idx)}
          onClick={() => pick(d)}
        >
          <Icon size={14} aria-hidden="true" />
          <span className="j2-dest-opt-label">{d.label}</span>
          {counts && <span className="j2-option-count">{counts[d.value] ?? 0}</span>}
        </button>
      </li>
    );
  };

  return (
    <div className="j2-dest" ref={wrapRef}>
      <div className="j2-dest-field">
        <Search size={16} aria-hidden="true" />
        <input
          type="text"
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); setActive(0); }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={selected.length ? 'Add a city or country…' : 'Search a city or country…'}
          aria-label="Search destinations by city or country"
          aria-expanded={open}
          role="combobox"
          aria-controls="j2-dest-list"
          autoComplete="off"
        />
      </div>

      {open && suggestions.length > 0 && (
        <ul className="j2-dest-pop" id="j2-dest-list" role="listbox">
          {regionHits.length > 0 && (
            <>
              <li className="j2-dest-grouphd" role="presentation">Countries &amp; regions</li>
              {regionHits.map((d) => renderOpt(d, suggestions.indexOf(d)))}
            </>
          )}
          {cityHits.length > 0 && (
            <>
              <li className="j2-dest-grouphd" role="presentation">Cities</li>
              {cityHits.map((d) => renderOpt(d, suggestions.indexOf(d)))}
            </>
          )}
        </ul>
      )}

      {selected.length > 0 && (
        <div className="j2-dest-chips">
          {selected.map((d) => {
            const Icon = isRegionDest(d) ? Globe2 : Building2;
            return (
              <button key={d} type="button" className="j2-dest-chip" onClick={() => onToggle(d)} aria-label={`Remove ${d}`}>
                <Icon size={12} aria-hidden="true" /> {d} <X size={13} aria-hidden="true" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* Budget = a single "up to" ceiling. A price-distribution skyline sits
   behind a chunky one-thumb slider; bars fade past the ceiling. Preset
   pills give one-tap common maxes. Far easier to grab than a hairline. */
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
            aria-valuetext={isAny ? 'Any budget' : `Up to ${fmtLakh(value)}`}
          />
        </div>
        <div className="j2-budget-ends">
          <span>{fmtLakh(min)}</span>
          <span>{fmtLakh(max)}+</span>
        </div>
      </div>

      <div className="j2-budget-presets">
        {BUDGET_PRESETS.map((p) => (
          <button
            key={p.v}
            type="button"
            className={`j2-preset${value === p.v ? ' is-on' : ''}`}
            onClick={() => onChange(p.v)}
          >
            {p.label}
          </button>
        ))}
        <button
          type="button"
          className={`j2-preset${isAny ? ' is-on' : ''}`}
          onClick={() => onChange(max)}
        >
          Any
        </button>
      </div>
    </div>
  );
}

/* Trip length = a single "up to N nights" ceiling, built from the same
   one-thumb slider + preset pills as the budget bar so the two read as a
   pair. Reuses the .j2-budget styles verbatim. */
function DurationPicker({ value, min, max, onChange }) {
  const pct = ((value - min) / (max - min)) * 100;
  const isAny = value >= max;
  return (
    <div className="j2-budget">
      <div className="j2-budget-slider">
        <div className="j2-budget-track">
          <div className="j2-budget-fill" style={{ width: `${pct}%` }} aria-hidden="true" />
          <input
            type="range" min={min} max={max} step={1} value={value}
            className="j2-budget-input"
            onChange={(e) => onChange(Number(e.target.value))}
            aria-label="Maximum trip length in nights"
            aria-valuetext={isAny ? 'Any length' : `Up to ${fmtNights(value)}`}
          />
        </div>
        <div className="j2-budget-ends">
          <span>{fmtNights(min)}</span>
          <span>{max}+ nights</span>
        </div>
      </div>

      <div className="j2-budget-presets">
        {DURATION_PRESETS.map((p) => (
          <button
            key={p.v}
            type="button"
            className={`j2-preset${value === p.v ? ' is-on' : ''}`}
            onClick={() => onChange(p.v)}
          >
            {p.label}
          </button>
        ))}
        <button
          type="button"
          className={`j2-preset${isAny ? ' is-on' : ''}`}
          onClick={() => onChange(max)}
        >
          Any
        </button>
      </div>
    </div>
  );
}

/* A calendar popover for choosing a travel date, with ±2/3/4-day
   flexibility chips. Selecting a date filters journeys whose season
   covers the chosen window. Everything closes on outside-click / Escape. */
function TravelDatePicker({ date, flex, onChange }) {
  const [open, setOpen] = useState(false);
  const now = new Date();
  const [view, setView] = useState(() => (date ? { y: date.y, m: date.m } : { y: now.getFullYear(), m: now.getMonth() }));
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, [open]);

  const minYM = now.getFullYear() * 12 + now.getMonth();
  const viewYM = view.y * 12 + view.m;
  const shift = (n) => {
    const t = viewYM + n;
    if (t < minYM) return;
    setView({ y: Math.floor(t / 12), m: t % 12 });
  };

  /* Leading blanks (Mon-based) + the month's days. */
  const firstDow = (new Date(view.y, view.m, 1).getDay() + 6) % 7;
  const daysIn = new Date(view.y, view.m + 1, 0).getDate();
  const cells = [...Array(firstDow).fill(null), ...Array.from({ length: daysIn }, (_, i) => i + 1)];
  const todayKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;

  const label = date ? `${fmtDate(date)}${flex ? ` · ±${flex}d` : ''}` : 'Any dates';

  return (
    <div className="j2-cal" ref={ref}>
      <button
        type="button"
        className={`j2-cal-trigger${date ? ' has-date' : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <Calendar size={16} aria-hidden="true" />
        <span>{label}</span>
        {date ? (
          <span
            className="j2-cal-clear"
            role="button"
            tabIndex={0}
            aria-label="Clear date"
            onClick={(e) => { e.stopPropagation(); onChange(null, 0); }}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); e.preventDefault(); onChange(null, 0); } }}
          >
            <X size={14} aria-hidden="true" />
          </span>
        ) : (
          <ChevronDown size={15} aria-hidden="true" className="j2-cal-caret" />
        )}
      </button>

      {open && (
        <div className="j2-cal-pop" role="dialog" aria-label="Choose a travel date">
          <div className="j2-cal-head">
            <button type="button" className="j2-cal-nav" onClick={() => shift(-1)} disabled={viewYM <= minYM} aria-label="Previous month">
              <ChevronLeft size={17} aria-hidden="true" />
            </button>
            <span className="j2-cal-month">{MONTH_NAMES[view.m]} {view.y}</span>
            <button type="button" className="j2-cal-nav" onClick={() => shift(1)} aria-label="Next month">
              <ChevronRight size={17} aria-hidden="true" />
            </button>
          </div>

          <div className="j2-cal-grid j2-cal-dow">
            {WEEKDAYS.map((w) => <span key={w} className="j2-cal-wd">{w}</span>)}
          </div>
          <div className="j2-cal-grid">
            {cells.map((d, i) => {
              if (d === null) return <span key={`b${i}`} className="j2-cal-blank" />;
              const isSel = date && date.y === view.y && date.m === view.m && date.d === d;
              const isToday = todayKey === `${view.y}-${view.m}-${d}`;
              const isPast = new Date(view.y, view.m, d) < new Date(now.getFullYear(), now.getMonth(), now.getDate());
              return (
                <button
                  key={d}
                  type="button"
                  className={`j2-cal-day${isSel ? ' is-sel' : ''}${isToday ? ' is-today' : ''}`}
                  disabled={isPast}
                  onClick={() => onChange({ y: view.y, m: view.m, d }, flex)}
                >
                  {d}
                </button>
              );
            })}
          </div>

          <div className="j2-cal-flex">
            <span className="j2-cal-flex-label">Flexible by</span>
            <div className="j2-cal-flex-chips">
              {FLEX_STEPS.map((f) => (
                <button
                  key={f}
                  type="button"
                  className={`j2-flexchip${flex === f ? ' is-on' : ''}`}
                  onClick={() => onChange(date, f)}
                >
                  {f === 0 ? 'Exact' : `±${f}d`}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* Plus / minus stepper for a labelled count (e.g. adults, children). */
function Stepper({ value, min, max, onChange, label, sub }) {
  return (
    <div className="j2-stepper-row">
      <span className="j2-stepper-label">
        {label}
        {sub && <small>{sub}</small>}
      </span>
      <div className="j2-stepper">
        <button
          type="button" className="j2-step-btn"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={`Fewer ${label.toLowerCase()}`}
        >
          <Minus size={16} aria-hidden="true" />
        </button>
        <span className="j2-step-val" aria-live="polite">{value}</span>
        <button
          type="button" className="j2-step-btn"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label={`More ${label.toLowerCase()}`}
        >
          <Plus size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export default function Journeys4() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();

  const [filtersOpen, setFiltersOpen] = useState(false); // mobile filter drawer
  const [lightbox, setLightbox] = useState(null);

  /* Multi-select filter state — arrays. Destinations & styles seed from URL. */
  const seedList = (key, valid) => {
    const raw = params.getAll(key);
    const flat = raw.flatMap((v) => v.split(',')).map((v) => v.trim()).filter(Boolean);
    return flat.filter((v) => valid.includes(v));
  };
  const [query, setQuery] = useState(() => params.get('q') || '');
  /* Chosen destinations — a mix of countries/regions and cities. */
  const [dests, setDests] = useState(() => seedList('where', DESTINATIONS.map((d) => d.value)));
  const [styles, setStyles] = useState(() => seedList('style', STYLES));
  const [budgetMax, setBudgetMax] = useState(() => {
    const n = parseInt(params.get('budget'), 10);
    return Number.isFinite(n) && n >= PRICE_MIN && n <= PRICE_MAX ? n : PRICE_MAX;
  });
  const [nightsMax, setNightsMax] = useState(() => {
    const n = parseInt(params.get('nights'), 10);
    return Number.isFinite(n) && n >= NIGHTS_MIN && n <= NIGHTS_MAX ? n : NIGHTS_MAX;
  });
  const [adults, setAdults] = useState(() => {
    const n = parseInt(params.get('adults'), 10);
    return Number.isFinite(n) && n >= 1 && n <= 12 ? n : 2;
  });
  const [children, setChildren] = useState(() => {
    const n = parseInt(params.get('children'), 10);
    return Number.isFinite(n) && n >= 0 && n <= 10 ? n : 0;
  });
  const people = adults + children;
  /* Travel date {y,m,d}|null + ± flexibility in days. Seeds from ?when=YYYY-MM-DD&flex=N */
  const [travelDate, setTravelDate] = useState(() => {
    const m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(params.get('when') || '');
    if (!m) return null;
    const y = +m[1], mo = +m[2] - 1, d = +m[3];
    return mo >= 0 && mo <= 11 && d >= 1 && d <= 31 ? { y, m: mo, d } : null;
  });
  const [flex, setFlex] = useState(() => {
    const f = parseInt(params.get('flex'), 10);
    return FLEX_STEPS.includes(f) ? f : 0;
  });
  const setDate = useCallback((date, f) => { setTravelDate(date); setFlex(f || 0); }, []);
  const [paces, setPaces] = useState(() => seedList('pace', PACES));
  const [visas, setVisas] = useState(() => seedList('visa', VISA_OPTIONS.map((v) => v.value)));
  const [sort, setSort] = useState('recommended');
  const [sortOpen, setSortOpen] = useState(false);

  const sortRef = useRef(null);
  const prefersReduced = useReducedMotion();

  const openPhotos = useCallback((j) => setLightbox({ title: j.title, photos: j.gallery, index: 0 }), []);

  /* Toggle helper for a value inside an array state. */
  const toggler = (setter) => (value) =>
    setter((cur) => (cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value]));

  /* Lock body scroll while the filter drawer or the lightbox is open. (The nav
     drawer locks scroll itself, inside SiteChrome.) */
  useEffect(() => {
    const lock = filtersOpen || !!lightbox;
    document.body.style.overflow = lock ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [filtersOpen, lightbox]);

  /* Close the sort menu on outside click / Escape. */
  useEffect(() => {
    if (!sortOpen) return;
    const onDoc = (e) => { if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setSortOpen(false); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, [sortOpen]);

  /* Keep the URL shareable in sync with the active filters. */
  useEffect(() => {
    const next = {};
    if (query.trim()) next.q = query.trim();
    if (dests.length) next.where = dests.join(',');
    if (styles.length) next.style = styles.join(',');
    if (budgetMax < PRICE_MAX) next.budget = String(budgetMax);
    if (nightsMax < NIGHTS_MAX) next.nights = String(nightsMax);
    if (adults !== 2) next.adults = String(adults);
    if (children !== 0) next.children = String(children);
    if (travelDate) {
      next.when = `${travelDate.y}-${travelDate.m + 1}-${travelDate.d}`;
      if (flex) next.flex = String(flex);
    }
    if (paces.length) next.pace = paces.join(',');
    if (visas.length) next.visa = visas.join(',');
    setParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, dests, styles, budgetMax, nightsMax, adults, children, travelDate, flex, paces, visas]);

  /* Months touched by the chosen date ± flex — recomputed only when either changes. */
  const dateMonths = useMemo(() => dateWindowMonths(travelDate, flex), [travelDate, flex]);

  /* Does a journey pass every active filter group? (AND across groups,
     OR within a group.) `skip` lets us drop one group when counting. */
  const passes = useCallback((j, skip) => {
    const q = query.trim().toLowerCase();
    if (skip !== 'q' && q) {
      const hay = `${j.title} ${j.blurb} ${j.regions.join(' ')} ${j.cities.join(' ')} ${j.style} ${j.pace} ${j.season}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    /* A chosen destination matches on region OR city, depending on which it is. */
    if (skip !== 'where' && dests.length &&
        !dests.some((d) => (isRegionDest(d) ? j.regions.includes(d) : j.cities.includes(d)))) return false;
    if (skip !== 'style' && styles.length && !styles.includes(j.style)) return false;
    if (skip !== 'pace' && paces.length && !paces.includes(j.pace)) return false;
    if (skip !== 'visa' && visas.length && !visas.includes(j.visa)) return false;
    if (skip !== 'budget' && j.price > budgetMax) return false;
    if (skip !== 'nights' && j.nights > nightsMax) return false;
    if (skip !== 'when' && dateMonths && !dateMonths.some((mo) => monthInSeason(mo, j.season))) return false;
    return true;
  }, [query, dests, styles, paces, visas, budgetMax, nightsMax, dateMonths]);

  /* The filtered + sorted result set. */
  const results = useMemo(() => {
    let list = ALL_JOURNEYS.filter((j) => passes(j));
    const by = {
      'price-asc': (a, b) => a.price - b.price,
      'price-desc': (a, b) => b.price - a.price,
      'nights-desc': (a, b) => b.nights - a.nights,
    }[sort];
    if (by) list = [...list].sort(by);
    return list;
  }, [passes, sort]);

  /* Per-option counts — how many journeys each option adds, holding the
     OTHER groups fixed (so the number reflects what you'd actually get). */
  const counts = useMemo(() => {
    const count = (skip, matcher) => {
      const base = ALL_JOURNEYS.filter((j) => passes(j, skip));
      const out = {};
      for (const [value, test] of matcher) out[value] = base.filter(test).length;
      return out;
    };
    return {
      where: count('where', [
        ...REGIONS.map((r) => [r, (j) => j.regions.includes(r)]),
        ...ALL_CITIES.map((c) => [c, (j) => j.cities.includes(c)]),
      ]),
      pace: count('pace', PACES.map((p) => [p, (j) => j.pace === p])),
      style: count('style', STYLES.map((s) => [s, (j) => j.style === s])),
      visa: count('visa', VISA_OPTIONS.map((v) => [v.value, (j) => j.visa === v.value])),
    };
  }, [passes]);

  const budgetActive = budgetMax < PRICE_MAX;
  const nightsActive = nightsMax < NIGHTS_MAX;
  const totalActive =
    (query.trim() ? 1 : 0) + dests.length + styles.length + paces.length + visas.length +
    (budgetActive ? 1 : 0) + (nightsActive ? 1 : 0) + (travelDate ? 1 : 0);

  const clearAll = () => {
    setQuery(''); setDests([]); setStyles([]); setPaces([]); setVisas([]);
    setBudgetMax(PRICE_MAX); setNightsMax(NIGHTS_MAX); setTravelDate(null); setFlex(0); setAdults(2); setChildren(0);
  };

  /* Hero search submit: if the typed destination has its own landing page
     (e.g. "Japan" → /journeys/japan-2), go there. Otherwise fall back to
     filtering this listing in place and scroll down to the results. */
  const heroPage = DESTINATION_PAGES[query.trim().toLowerCase()] || null;
  const onHeroSubmit = (e) => {
    e.preventDefault();
    if (heroPage) { navigate(heroPage); return; }
    document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const sortLabel = SORTS.find((s) => s.key === sort)?.label;

  /* The whole sidebar body — shared by the desktop rail and mobile drawer. */
  const filterBody = (
    <>
      <FilterField id="dest" title="Destination" icon={MapPin}>
        <DestinationSearch selected={dests} onToggle={toggler(setDests)} counts={counts.where} />
      </FilterField>

      <FilterField id="budget" title="Budget (per person)" icon={Wallet}>
        <BudgetPicker
          value={budgetMax} min={PRICE_MIN} max={PRICE_MAX} step={PRICE_STEP}
          onChange={setBudgetMax}
        />
      </FilterField>

      <FilterField id="length" title="Trip length" icon={Clock}>
        <DurationPicker
          value={nightsMax} min={NIGHTS_MIN} max={NIGHTS_MAX}
          onChange={setNightsMax}
        />
      </FilterField>

      <FilterField id="people" title="Travellers" icon={Users}>
        <div className="j2-steppers">
          <Stepper label="Adults" sub="12+ yrs" value={adults} min={1} max={12} onChange={setAdults} />
          <Stepper label="Children" sub="2–11 yrs" value={children} min={0} max={10} onChange={setChildren} />
        </div>
      </FilterField>

      <FilterField id="dur" title="When you'll travel" icon={CalendarRange}>
        <TravelDatePicker date={travelDate} flex={flex} onChange={setDate} />
      </FilterField>

      <FilterGroup
        id="pace" title="Pace" icon={Gauge}
        options={PACES.map((p) => ({ value: p, label: `${p} pace` }))}
        selected={paces} onToggle={toggler(setPaces)} counts={counts.pace}
      />
      <FilterGroup
        id="style" title="Trip style" icon={Compass}
        options={STYLES.map((s) => ({ value: s, label: s }))}
        selected={styles} onToggle={toggler(setStyles)} counts={counts.style}
      />
      <FilterGroup
        id="visa" title="Visa (Indian passport)" icon={Stamp}
        options={VISA_OPTIONS}
        selected={visas} onToggle={toggler(setVisas)} counts={counts.visa}
      />
    </>
  );

  return (
    <div className="h26 jl jl2 jl4">
      {/* The /new3 chrome, shared with every other page. It renders the skip
          link too — pointed at the results grid, since on a listing page the
          filters are chrome and the journeys are the content. */}
      <SiteNav skipTo="#results" skipLabel="Skip to journeys" />

      {/* ---------- COMPACT HERO BANNER + SEARCH ---------- */}
      <section className="jl-hero jl2-hero">
        <div className="jl-hero-bg" style={{ backgroundImage: `url(${img(HERO_IMG, 1800)})` }} aria-hidden="true" />
        <div className="jl-hero-veil" aria-hidden="true" />
        <div className="jl-hero-inner">
          <Reveal className="h26-label jl-hero-eyebrow" as="p">
            {ALL_JOURNEYS.length} handcrafted journeys · 100+ countries
          </Reveal>
          <h1 className="jl-hero-title">
            <WordReveal text="Find your journey" accent={[2]} />
          </h1>
          <Reveal className="jl-hero-sub" as="p" delay={0.15}>
            Filter by where you're headed, what you'll spend and how you like to travel —
            everything's on the left, nothing hidden behind a menu.
          </Reveal>

          {/* Big search field */}
          <motion.div
            className="jl-search"
            initial={prefersReduced ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <form className="jl-search-field" onSubmit={onHeroSubmit}>
              <Search size={19} aria-hidden="true" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search a destination or journey — “Japan”, “safari”, “ryokan”…"
                aria-label="Search journeys"
                autoComplete="off"
              />
              {query && (
                <button type="button" className="jl-search-clear" aria-label="Clear search" onClick={() => setQuery('')}>
                  <X size={16} />
                </button>
              )}
              {heroPage && (
                <button type="submit" className="jl4-search-go">
                  Explore {query.trim()} <ArrowRight size={15} aria-hidden="true" />
                </button>
              )}
            </form>
            {heroPage && (
              <p className="jl4-search-hint" aria-live="polite">
                Press Enter to open the {query.trim()} destination page.
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* ---------- TWO-COLUMN LAYOUT: filters + results ---------- */}
      <main className="jl2-shell" id="results">
        {/* Mobile filter trigger + result count bar */}
        <div className="jl2-mobilebar">
          <button type="button" className="jl2-filter-toggle" onClick={() => setFiltersOpen(true)}>
            <SlidersHorizontal size={16} aria-hidden="true" />
            Filters
            {totalActive > 0 && <span className="jl2-filter-badge">{totalActive}</span>}
          </button>
          <span className="jl2-mobile-count"><strong>{results.length}</strong> journeys</span>
        </div>

        {/* ----- LEFT: open filter sidebar (a drawer on mobile) ----- */}
        <aside className={`jl2-sidebar${filtersOpen ? ' is-open' : ''}`} aria-label="Filter journeys">
          <div className="jl2-sidebar-scrim" onClick={() => setFiltersOpen(false)} />
          <div className="jl2-sidebar-panel">
            <div className="jl2-sidebar-head">
              <h2 className="jl2-sidebar-title"><SlidersHorizontal size={17} aria-hidden="true" /> Filters</h2>
              {totalActive > 0 && (
                <button type="button" className="jl2-clear" onClick={clearAll}>Clear all</button>
              )}
              <button type="button" className="jl2-sidebar-close" aria-label="Close filters" onClick={() => setFiltersOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="jl2-sidebar-body">
              {filterBody}
            </div>

            <div className="jl2-sidebar-foot">
              <button type="button" className="h26-btn h26-btn-pill jl2-apply" onClick={() => setFiltersOpen(false)}>
                Show {results.length} {results.length === 1 ? 'journey' : 'journeys'}
              </button>
            </div>
          </div>
        </aside>

        {/* ----- RIGHT: results ----- */}
        <section className="jl2-results">
          <div className="jl2-results-head">
            <p className="jl-count" aria-live="polite">
              <strong>{results.length}</strong> {results.length === 1 ? 'journey' : 'journeys'}
              {dests.length ? ` · ${dests.length === 1 ? dests[0] : `${dests.length} destinations`}` : ''}
            </p>
            <div className="jl-sort" ref={sortRef}>
              <button
                type="button"
                className="jl-sort-btn"
                onClick={() => setSortOpen((o) => !o)}
                aria-haspopup="listbox"
                aria-expanded={sortOpen}
              >
                <SlidersHorizontal size={15} aria-hidden="true" />
                <span>{sortLabel}</span>
                <ChevronDown size={14} aria-hidden="true" />
              </button>
              {sortOpen && (
                <ul className="jl-sort-pop" role="listbox">
                  {SORTS.map((s) => (
                    <li key={s.key}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={sort === s.key}
                        className={`jl-sort-opt${sort === s.key ? ' is-on' : ''}`}
                        onClick={() => { setSort(s.key); setSortOpen(false); }}
                      >
                        {s.label}
                        {sort === s.key && <Check size={15} aria-hidden="true" />}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Active filter chips */}
          {totalActive > 0 && (
            <div className="jl-active jl2-active">
              {query.trim() && (
                <button type="button" className="jl-active-chip" onClick={() => setQuery('')}>
                  “{query.trim()}” <X size={13} />
                </button>
              )}
              {dests.map((d) => (
                <button key={d} type="button" className="jl-active-chip" onClick={() => toggler(setDests)(d)}>{d} <X size={13} /></button>
              ))}
              {budgetActive && (
                <button type="button" className="jl-active-chip" onClick={() => setBudgetMax(PRICE_MAX)}>
                  Up to {fmtLakh(budgetMax)} <X size={13} />
                </button>
              )}
              {nightsActive && (
                <button type="button" className="jl-active-chip" onClick={() => setNightsMax(NIGHTS_MAX)}>
                  Up to {fmtNights(nightsMax)} <X size={13} />
                </button>
              )}
              {travelDate && (
                <button type="button" className="jl-active-chip" onClick={() => setDate(null, 0)}>
                  {fmtDate(travelDate)}{flex ? ` ±${flex}d` : ''} <X size={13} />
                </button>
              )}
              {styles.map((s) => (
                <button key={s} type="button" className="jl-active-chip" onClick={() => toggler(setStyles)(s)}>{s} <X size={13} /></button>
              ))}
              {paces.map((p) => (
                <button key={p} type="button" className="jl-active-chip" onClick={() => toggler(setPaces)(p)}>{p} pace <X size={13} /></button>
              ))}
              {visas.map((v) => (
                <button key={v} type="button" className="jl-active-chip" onClick={() => toggler(setVisas)(v)}>{VISA_LABEL[v]} <X size={13} /></button>
              ))}
              <button type="button" className="jl-clear-all" onClick={clearAll}>Clear all</button>
            </div>
          )}

          {results.length > 0 ? (
            <div className="jl-grid jl2-grid">
              {results.map((j, i) => <JourneyCard key={j.id} j={j} i={i} onPhotos={openPhotos} people={people} />)}
            </div>
          ) : (
            <div className="jl-empty">
              <span className="jl-empty-icon"><Compass size={30} aria-hidden="true" /></span>
              <h2>No journeys match just yet</h2>
              <p>
                We run trips to over 100 countries and design tailor-made holidays anywhere.
                Loosen a filter, or tell a specialist where you'd like to go — we'll build it.
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

      {/* ---------- CLOSING CTA ---------- */}
      <section className="jl-cta">
        <div className="jl-cta-bg" style={{ backgroundImage: `url(${img(HERO_IMG, 1800)})` }} aria-hidden="true" />
        <div className="jl-cta-veil" aria-hidden="true" />
        <div className="jl-cta-inner">
          <Reveal className="h26-label jl-cta-eyebrow" as="span">Can't see quite the right one?</Reveal>
          <Reveal as="h2" className="jl-cta-title" delay={0.05}>
            Tell us how you like to travel.<br /><strong>We'll design the journey around you.</strong>
          </Reveal>
          <Reveal className="jl-cta-actions" delay={0.12}>
            <a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer" className="h26-btn h26-btn-accent h26-btn-lg"><MessageCircle size={17} /> WhatsApp us</a>
            <Link to={CALLBACK} className="h26-btn h26-btn-glass h26-btn-lg"><PhoneCall size={16} /> Schedule a callback</Link>
          </Reveal>
          <Reveal as="p" className="jl-cta-hours" delay={0.18}>Travel experts available 9am–9pm IST, every day.</Reveal>
        </div>
      </section>

      <SiteFooter />

      {/* ---------- PHOTO LIGHTBOX ---------- */}
      <AnimatePresence>
        {lightbox && <Lightbox data={lightbox} onClose={() => setLightbox(null)} />}
      </AnimatePresence>
    </div>
  );
}
