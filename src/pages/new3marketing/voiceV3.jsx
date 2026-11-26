/* ============================================================================
   /new3-marketing-v3: the whole page in the Cox and Kings voice
   (Brand Voice & Tone of Voice Guide v2, ~/Downloads/CoxAndKings_BrandVoice_v2).

   v2 restated only the hero; this pass carries the voice through every
   section, and fixes the photographs so each one shows the place its words
   name. The four-word filter every line was held against:
   · Assured     heritage as proof ("since 1758"), never a boast. No
                 "world's most experienced", no superlatives.
   · Hospitable  acknowledge what the trip means before what we sell.
   · Curious     the named place (Amalfi, Varanasi, the Nine Arch Bridge),
                 not "handpicked destinations" or "hidden gems".
   · Precise     headlines of six words or fewer, no block over three lines,
                 the most important thing first.
   Retired: curated, bespoke, tailor-made, seamless, unforgettable, vibe,
   handpicked, "discover/explore" as filler, contractions, em dashes.

   Facts are never retyped by hand: prices, booking amounts and tour counts are
   read from each lander's data.js, ratings and stats are the live
   coxandkings.com figures v2 already used (4.5 from verified reviews, 260+,
   50+, 98%), awards are the ones listed in europe/data.js. Guest reviews stay
   in the guests' own words; only their photographs and trip labels change.
   ========================================================================== */

import { CAMPAIGNS, inr } from './campaigns';
import { NEW3_COPY } from '../New3';
import * as JP from '../sakura/data';
import * as EU from '../europe/data';
import * as VN from '../vietnam/data';

const US = (id) => `https://images.unsplash.com/photo-${id}`;

/* ---------- Trending packages (OfferCards) ---------- */
const TOUR_COUNT = { japan: JP.TOURS.length, europe: EU.TOURS.length, vietnam: VN.TOURS.length };
const NAME = { japan: 'Japan', europe: 'Europe', vietnam: 'Vietnam' };

/* Mobile clamps card text to three lines, so each line leads with the places
   and lands the promise inside that budget. */
const CARD_LINES = {
  japan: () => ({
    title: ['Japan,', 'in full bloom.'],
    sub: 'Tokyo, Kyoto and the lakes below Fuji, in blossom. Return flights, 4-star hotels and every meal included.',
  }),
  europe: (c) => ({
    title: ['Europe,', 'worth the wait.'],
    /* "Book at just ₹55,000. Pay after you get your visa." (the PM sheet) */
    sub: `Paris, the Jungfrau and Rome. Hold your place with ${inr(c.deposit)} and pay the rest once your visa is in hand.`,
  }),
  vietnam: () => ({
    title: ['Vietnam,', 'everything held.'],
    /* Inclusions per vietnam/data.js: return + domestic flights, visa fees,
       8 nights, sightseeing. Meals are only "as mentioned", so no "every meal". */
    sub: 'Phu Quoc, Hoi An by lantern boat and a day on Ha Long Bay. Flights, visa fees and eight nights of hotels included.',
    /* The price shown is already the Steal Deal price. Vietnam is enquiry
       only, so v2's "Book online" was not true; say what the price is. */
    tag: `Includes ${VN.OFFER.dealPct}% off`,
  }),
};

export const CAMPAIGNS_V3 = CAMPAIGNS.map((c) => {
  const v = CARD_LINES[c.key];
  return v ? { ...c, ...v(c) } : c;
});

export const OFFER_COPY_V3 = {
  cta: (s) => (TOUR_COUNT[s.key] === 1 ? `See the ${NAME[s.key]} journey` : `See the ${NAME[s.key]} journeys`),
};

/* ---------- Relaxed-pace shelf: words and pictures per journey ----------
   Every Italy card used to show the same Cinque Terre photo (a coast none of
   them visit), the Swiss gallery borrowed a Bavarian street, and Sri Lanka
   showed a resort pool. Each card now opens on the place its first line names. */
const RELAXED_FIX = {
  'jp-luxe': { blurb: 'Design hotels, a private onsen and the art islands of Naoshima, taken slowly.' },
  'ch-summer': { gallery: [US('1530122037265-a5f1f91d3b99'), US('1491555103944-7c647fd857e6'), US('1527668752968-14dc70a27c95')] },
  'ch-rail': {
    blurb: 'The Glacier Express and the Bernina line in first class, with a good hotel at every stop.',
    image: US('1491555103944-7c647fd857e6'),
    gallery: [US('1491555103944-7c647fd857e6'), US('1530122037265-a5f1f91d3b99'), US('1527668752968-14dc70a27c95')],
  },
  'it-slow': {
    blurb: 'Rome after hours, a Tuscan villa and a quiet cove on the Amalfi coast.',
    group: 'Private journey',
    image: US('1518098268026-4e89f1a2cd8e'),
    gallery: [US('1518098268026-4e89f1a2cd8e'), US('1525874684015-58379d421a52'), US('1612698093158-e07ac200d44e')],
  },
  'it-amalfi': { image: US('1612698093158-e07ac200d44e'), gallery: [US('1612698093158-e07ac200d44e')] },
  'it-family': {
    image: US('1552832230-c0197dd311b5'),
    gallery: [US('1552832230-c0197dd311b5'), US('1525874684015-58379d421a52'), US('1518098268026-4e89f1a2cd8e')],
  },
  'au-family': { gallery: [US('1506973035872-a4ec16b8e8d9'), US('1582967788606-a171c1080cb0')] },
  'sea-srilanka': {
    group: 'Private journey',
    image: US('1566296314736-6eaac1ca0cb9'),
    gallery: [US('1566296314736-6eaac1ca0cb9'), US('1580910527739-556eb89f9d65')],
  },
};

/* ---------- Themes: photographs that show the theme ----------
   Staycation was Sydney Harbour (a long-haul flight, the opposite of the
   promise), Pilgrimage was Amber Fort, Adventure repeated the hero meadow. */
const THEME_FIX = {
  Adventure: {
    blurb: 'High passes at first light, white-water mornings and nights under canvas. For travellers who would rather earn the view.',
    id: '1551632811-561732d1e306', cta: 'See adventure journeys',
  },
  Honeymoon: {
    name: 'Romantic',
    blurb: 'An overwater villa, a sandbank dinner laid for two and long, unhurried mornings. A trip you take once, arranged exactly right.',
    cta: 'See romantic journeys',
  },
  'Relaxed & Slow': {
    blurb: 'One town, one terrace and nowhere you have to be. Slow itineraries with room to breathe between the beautiful parts.',
    cta: 'See slower journeys',
  },
  Pilgrimage: {
    blurb: 'Temple towns at dawn, holy rivers and routes walked for centuries, travelled gently and with care for every ritual.',
    id: '1571536802807-30451e3955d8', cta: 'See pilgrimages',
  },
  Staycation: {
    blurb: 'A short flight, a beautiful room and a full stop on the calendar. A reset that feels far away, without the long journey.',
    id: '1602216056096-3b40cc0c9944', cta: 'See staycations',
  },
  'Wildlife & Safari': {
    name: 'Wildlife Safari',
    blurb: 'The great herds at sunrise, a conservancy to yourself and a camp under the stars.',
    cta: 'See safaris',
  },
  'Culture & Heritage': {
    blurb: 'Palaces you can sleep in, festivals timed to your visit and the makers behind the crafts. A place told by the people in it.',
    id: '1477587458883-47145ed94245', cta: 'See heritage journeys',
  },
};

/* ---------- Destinations: named places, and a photo of the one named ---------- */
const DEST_FIX = {
  Switzerland: { hook: 'Lauterbrunnen, Zermatt and the glacier trains', alt: 'Chalets and a waterfall in the Lauterbrunnen valley, Switzerland' },
  Japan: { hook: 'Kyoto temples, ryokan nights, the bullet train', alt: 'A vermilion torii gate standing in a Japanese lake' },
  Italy: {
    hook: 'Amalfi, the Tuscan hills and the lakes', image: US('1518098268026-4e89f1a2cd8e'),
    alt: 'A cypress-lined road through the Tuscan hills at sunset', pos: '50% 60%',
  },
  'Scandinavia & the Northern Lights': { hook: 'Tromsø skies and fjord nights', alt: 'The Northern Lights over a snowy forest' },
  'Australia & New Zealand': { hook: 'Sydney Harbour, the reef, the South Island', alt: 'Sydney Harbour and the Opera House from the water' },
  USA: { hook: 'San Francisco, the coast road, the great parks', alt: 'The Golden Gate Bridge above the bay, San Francisco' },
  'Southeast Asia': { hook: 'Temples, islands and night markets', alt: 'Gilded temple roofs in northern Thailand' },
  Maldives: { hook: 'One island, one villa, the house reef', alt: 'Overwater villas on a turquoise lagoon, the Maldives' },
};

/* ---------- Clips: titles that match the film's poster ---------- */
const REEL_FIX = {
  r1: { title: 'Under the Matterhorn', poster: US('1491555103944-7c647fd857e6') },  // was an aurora photo
  r2: { title: 'Higashiyama at dusk' },                                                    // the poster has no blossom
  r3: { title: 'The aurora, overhead' },
  r4: { title: 'Overwater, from the air' },                                               // daylight, not golden hour
  r6: { title: 'The Cinque Terre from the water', place: 'Liguria, Italy' },                // the poster is not Amalfi
};

/* ---------- Reviews: the guests' words untouched; photos of their trip ---------- */
const REVIEW_FIX = {
  'Mr & Mrs Iyer': ['1514890547357-a9ee288728e0', '1467269204594-9661b134dd2b', '1502602898657-3e91760cbb34'],
  'Sunita Rao': ['1522547902298-51566e4fb383', '1490806843957-31f4c9a91c65', '1522383225653-ed111181a951'],
  'Arjun & Meera': ['1573843981267-be1999ff37cd', '1514282401047-d79a71a590e8', '1540202404-a2f29016b523'],
  'The Nair Family': ['1530122037265-a5f1f91d3b99', '1491555103944-7c647fd857e6', '1527668752968-14dc70a27c95'],
  'Rohan Kapoor': ['1516426122078-c23e76319801', '1535941339077-2dd1c7963098', '1523805009345-7448845a9e53'],
  'Priya Menon': ['1534113414509-0eec2bfb493f', '1518098268026-4e89f1a2cd8e', '1525874684015-58379d421a52'],
};

const [bStar, bAward, bShield, bGlobe] = NEW3_COPY.trustBadges.map((b) => b.icon);

/* Awards for the intro (fold two): the same entries the Europe lander
   lists in europe/data.js, so nothing here is new or unsourced. */
const AWARDS_V3 = [
  { title: "India's Favourite Tour Operator", by: "Condé Nast Traveller Readers' Travel Awards", years: '2016, 2017, 2022' },
  { title: "Asia's Leading Luxury Tour Operator", by: 'World Travel Awards', years: '2015 to 2019' },
  { title: 'PATA Gold Award', by: 'Pacific Asia Travel Association', years: '2015' },
];

export const NEW3_COPY_V3 = {
  /* Hero: original /new3 layout and photograph; only the words change. */
  heroEyebrow: 'Cox & Kings · Holidays since 1758',
  heroSub: 'Group tours and private holidays to 50+ destinations, planned by specialists and confirmed in writing.',
  introAwards: AWARDS_V3,
  heroTitle1: 'The world,', heroTitle2: 'beyond the obvious.',
  heroWho: 'Who is travelling?',
  heroWhoOpts: NEW3_COPY.heroWhoOpts.map((o) => (o.key === 'couple' ? { ...o, label: 'Couple, just the two of us' } : o)),
  heroRatingScore: '4.5', heroRatingLabel: 'from verified reviews',   // the figure the reviews section shows
  heroQuickLabel: 'Or choose a place',
  heroScroll: 'Read on',
  heroStats: ['Since 1758', 'In writing, before you travel', '50+ destinations', 'Group and private journeys', 'Here 24/7 while you travel'],

  /* The Written Promise, the spine of the page. */
  /* Fold two leads with the USP: journeys planned around the guest, and
     more than two and a half centuries of practice at luxury travel. */
  introLabel: 'Luxury travel since 1758',
  introLine1: 'Planned around you.', introAccent1: [2],
  introLine2: 'Refined since 1758.', introAccent2: [0],
  introText: 'No two journeys we plan are alike. A specialist listens first, then shapes yours around how you like to travel: the pace, the hotels, the table. It is the same care we have given travellers since 1758, and every detail is confirmed in writing before you leave.',
  assurance: [
    'Private journeys, planned around you',
    'A specialist who has walked the route',
    'Paced for every generation',
    'Indian and dietary meals',
    'Visa assistance, at no charge',
    'Here 24/7 while you travel',
  ],

  /* 'How would you like to travel?' keeps the original /new3 copy (NEW3_COPY defaults); only its photos change. */
  lane1Img: US('1529156069898-49953e39b3ac'), lane1Alt: 'Friends on a group journey, arm in arm, looking out over the view',
  lane2Alt: 'A map, a notebook and a camera laid out to plan a journey',
  lane3Img: US('1526139334526-f591a54b477c'), lane3Alt: 'Lanterns strung above an evening market street',

  destLabel: '50+ destinations',
  destTitle: 'Places we know by name',
  destLink: 'All destinations',
  destHooks: {},
  destinations: NEW3_COPY.destinations.map((d) => (DEST_FIX[d.name] ? { ...d, ...DEST_FIX[d.name] } : d)),

  herCardEyebrow: 'A PROMISE',
  herCardTitle: 'Our word, in writing',
  herCardText: 'Everything in your itinerary is our word to you, confirmed in writing before you travel.',
  herEyebrow: 'Our heritage',
  herImgMain: '1501785888041-af3ef285b470', /* a rowing boat on Lago di Braies, in place of Amber Fort */
  herTitle: <>Since 1758,<br />finding what <strong>others miss.</strong></>,
  herCopy: 'For two and a half centuries, guests have placed something important in our hands: a promise to someone they love, a reward years in the making. We give it the attention it deserves.',
  trustBadges: [
    { icon: bStar, stat: '4.5★', label: 'from verified reviews' },
    { icon: bAward, stat: "India's Favourite Tour Operator", label: "Condé Nast Traveller Readers' Travel Awards, 2016, 2017 and 2022" },
    { icon: bShield, stat: 'Visa assistance, at no charge', label: 'Documents, processing and the appointment, with you throughout' },
    { icon: bGlobe, stat: 'Here 24/7 while you travel', label: 'We are here whenever you need us' },
  ],
  stats: [
    { value: 260, suffix: '+', label: 'Years of receiving travellers' },
    { value: 50, suffix: '+', label: 'Destinations we know well' },
    { value: 98, suffix: '%', label: 'Would travel with us again' },
  ],
  herCta: 'Read our story',

  relaxedCol: {
    ...NEW3_COPY.relaxedCol,
    title: 'At the right pace',
    sub: 'Easy mornings, shorter drives and time to sit with a place. For travellers who would rather see less, and see it properly.',
    viewCta: 'See the itinerary',
    askCta: 'Ask us',
  },
  relaxedList: NEW3_COPY.relaxedList.map((j) => (RELAXED_FIX[j.id] ? { ...j, ...RELAXED_FIX[j.id] } : j)),

  themes: NEW3_COPY.themes.map((t) => (THEME_FIX[t.name] ? { ...t, ...THEME_FIX[t.name] } : t)),
  themeEyebrow: 'SEVEN WAYS TO TRAVEL',
  themeTitle: <>What kind<br />of journey?</>,

  reelsLabel: 'ON CAMERA',
  reelsTitle: 'Thirty seconds, somewhere else',
  reelsLink: 'All journeys',
  reelsHint: 'Short films from places we know well. Watch one, then see the journeys that go there.',
  reels: NEW3_COPY.reels.map((r) => (REEL_FIX[r.id] ? { ...r, ...REEL_FIX[r.id] } : r)),

  revEyebrow: 'TRAVELLER REVIEWS',
  revTitle: 'In our guests’ own words',
  revAgg: '4.5 / 5', revAggLabel: 'from verified reviews', revPlatforms: false,
  revMore: 'Read every review',
  reviews: NEW3_COPY.reviews.map((r) => ({
    ...r,
    ids: REVIEW_FIX[r.name] || r.ids,
    trip: r.trip.replace('Tailor-Made', 'Private journey'),
  })),

  contactEyebrow: 'Talk to us',
  contactLine1: 'Tell us what you',
  contactLine2: 'have been imagining.', contactAccent2: [2],
  contactSub: 'Who is the journey for, and what does it mean to them? Tell us, and someone who knows that part of the world will take it from there.',
  contactCall: 'Schedule a call',
  contactWa: 'Message us on WhatsApp',
  contactAlt: 'Specialists are available every day, 9 am to 9 pm IST.',
  contactImg: US('1506905925346-21bda4d32df4'),
};
