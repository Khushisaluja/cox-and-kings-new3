/* ============================================================================
   /new3-marketing-v2: the hero restated in the Cox and Kings voice (Brand
   Voice & Tone of Voice Guide v2); the sections below it carry the live
   coxandkings.com copy (see the note above NEW3_COPY_V2).

   The filter every HERO line here was held against:
   · Assured     heritage as proof, never boast. "Since 1758", not "the best".
   · Hospitable  acknowledge what the trip means before what we sell.
   · Curious     the named place (Hoi An by lantern light), not "hidden gems".
   · Precise     headlines of six words or fewer, no block over three lines,
                 the most important thing first.
   Retired: curated, bespoke, tailor-made, seamless, unforgettable, vibe,
   "explore/discover" used as filler, contractions, em dashes, and anything
   another travel brand could have written. The Written Promise ("what we put
   in writing is what you receive") is the spine of the page.

   Facts are unchanged from v1: prices, deposits and months still come from
   each lander's data.js; places named are ones those itineraries visit.
   Guest reviews are left in the guests' own words.
   ========================================================================== */

import { CAMPAIGNS } from './campaigns';
import { NEW3_COPY } from '../New3';

const nameOf = (s) => (s.word === 'VIỆT NAM' ? 'Vietnam' : s.word[0] + s.word.slice(1).toLowerCase());

/* ---------- Hero banners ---------- */
const HERO_LINES = {
  japan: {
    title: ['Japan,', 'in full bloom.'],
    sub: 'You have been imagining Kyoto in blossom for some time. We know the week it peaks. Flights, hotels, every meal and your visa are held, in writing.',
  },
  europe: {
    title: ['Europe,', 'worth the wait.'],
    sub: 'Paris, the Jungfrau, Venice and Rome, summer 2027. Flights, hotels, Indian meals and visa assistance, confirmed in writing. Book early and the early price holds.',
  },
  vietnam: {
    title: ['Vietnam,', 'everything held.'],
    tag: 'Book online',   // v1 says "Steal deal": discount-first, which the guide retires
    sub: 'Hanoi at dusk, a day on Ha Long Bay, Hoi An by lantern light. Flights, hotels, every meal and your e-visa, confirmed before you travel.',
  },
};

export const CAMPAIGNS_V2 = CAMPAIGNS.map((c) => {
  const v = HERO_LINES[c.key];
  if (!v) return c;
  return { ...c, ...v };
});

export const HERO_COPY_V2 = {
  h1: 'Cox & Kings: group and private journeys, since 1758',
  cta: (s) => `See the ${nameOf(s)} journeys`,
  ghost: 'Ask someone who has been',
};

export const DOCK_COPY_V2 = {
  where: 'Where',
  wherePh: 'Kyoto, the Alps, Ha Long Bay',
  anyDest: 'Anywhere · show me the world',
  whenPh: 'Choose a month',
  whoPh: 'Who is travelling',
  anyWho: 'Anyone · show me everything',
  go: 'Show me',
  goOffer: 'See the journey',
  idle: 'Tell us where and when. We will show you what is possible.',
  chips: 'This season',
};

/* ---------- Sections below the hero ----------
   Per the user (2026-11-25): only the hero speaks in the brand-voice pass.
   Everything below it carries the LIVE coxandkings.com homepage copy, taken
   from that page's own section data (introData, travelPathsData,
   heritageData, themeDiscoveryData, topPicksData, clipsData,
   realJourneyData, letsPlanData). Re-check against the live site before
   shipping: it is edited in their CMS. */
const LIVE_THEME_BLURB = "Handpicked journeys, whatever kind of trip you're after.";
const LIVE_THEME_NAMES = { Honeymoon: 'Romantic', 'Wildlife & Safari': 'Wildlife Safari' };

const [bStar, bAward, bShield, bGlobe] = NEW3_COPY.trustBadges.map((b) => b.icon);

export const NEW3_COPY_V2 = {
  introLabel: 'THE COX & KINGS PROMISE',
  introLine1: "It's our difference", introAccent1: [0, 1],
  introLine2: 'that makes the difference.', introAccent2: [3],
  introText: "Our promise is built on journeys shaped with every detail in mind, experts who wear destinations on their sleeves, global connections built over two and a half centuries, and a team that's ready to help you, no matter what time of day it is.",
  assurance: [
    'Designed for Every Generation',
    'Group & Tailor-Made Journeys',
    'Complimentary Visa Assistance',
    'Indian & Dietary Meals',
    'Certified Tour Managers',
    '24×7 Travel Support',
  ],

  forkLabel: 'Start here',
  forkTitle: 'The Holiday Matchmaker',
  lane1Tag: 'Escorted Small Groups', lane1Title: 'Leave the planning to us',
  lane1Text: 'Travel with a small group, a dedicated tour manager and every detail taken care of, from start to finish.',
  lane1Cta: 'SEE GROUP JOURNEYS',
  /* Our middle card opens Einaya and the right one opens the callback, so the
     live cards' text follows the action (live puts "Recommended" on the
     expert card). "Enaya" on the live site is a typo, corrected here. */
  lane2Badge: 'Recommended', lane2Tag: 'Tailor-Made & Customised', lane2Title: 'Craft your own journey',
  lane2Text: 'Know exactly what you want? Having a hard time deciding? Answer a few questions, and Einaya will shape the perfect journey for you.',
  lane2Cta: 'DESIGN IT WITH EINAYA',
  lane3Tag: "Let's Talk", lane3Title: 'Speak to an expert',
  lane3Text: 'Prefer a conversation? Pick a time that suits you, and one of our travel experts will get in touch to help you plan your journey.',
  lane3Cta: 'TALK TO AN EXPERT',

  destLabel: '50+ Destinations',
  destTitle: 'We’re here to take you there.',
  destLink: 'All destinations',
  destHooks: {},

  herCardEyebrow: 'A PROMISE',
  herCardTitle: 'Designed with care',
  herCardText: "Each journey we curate is crafted with the same care, whether it's for one traveller or many.",
  herEyebrow: 'Our heritage',
  herTitle: <>Perfecting<br /><strong>The Art Of Travel</strong><br />Since 1758.</>,
  herCopy: "Every great journey begins with a single step, ours began in 1758. Since then, we've guided generations of explorers across the globe, under the same name and the same standard, for over a quarter of a millennium. In the years to come, we shall strive to continue to create more remarkable journeys around the world. And who knows, one day we might just take you to the moon. Wouldn't that be something?",
  trustBadges: [
    { icon: bStar, stat: '4.5★', label: 'from verified reviews' },
    { icon: bAward, stat: 'Among the most awarded', label: "India's Favourite Tour Operator, PATA Gold & more" },
    { icon: bShield, stat: 'Complimentary visa assistance', label: 'With you the whole way, from application to approval.' },
    { icon: bGlobe, stat: '24/7 support during your journeys', label: 'Someone by your side, no matter the time' },
  ],
  stats: [
    { value: 260, suffix: '+', label: 'Years of journeys' },
    { value: 50, suffix: '+', label: 'Global destinations' },
    { value: 98, suffix: '%', label: 'Would travel again' },
  ],
  herCta: 'Discover our story',

  relaxedCol: {
    ...NEW3_COPY.relaxedCol,
    title: 'The joy of slow travel',
    sub: 'Journeys featuring easy mornings, shorter drives and relaxed sightseeing, designed for travellers who find ‘luxury’ in taking it slow.',
  },

  themes: NEW3_COPY.themes.map((t) => {
    const name = LIVE_THEME_NAMES[t.name] || t.name;
    return { ...t, name, blurb: LIVE_THEME_BLURB, cta: `Explore ${name} trips` };
  }),
  themeEyebrow: 'CHOOSE BY EXPERIENCE',
  themeTitle: <>What brings<br />you here?</>,

  reelsLabel: 'ON CAMERA',
  reelsTitle: 'See The Journey Come To Life',
  reelsLink: 'Explore journeys',
  reelsHint: 'Get a feel for the journey before getting into the details. Take a quick look at some of our favourite journeys, watch the highlights, then explore the itinerary you like.',

  revEyebrow: 'TRAVELLER REVIEWS',
  revTitle: 'Miles full of smiles',
  revAgg: '4.5 / 5', revAggLabel: 'from verified reviews', revPlatforms: false,
  revMore: 'View all reviews',

  contactEyebrow: 'Need a little help?',
  contactLine1: "Let's Figure",
  contactLine2: 'It Out Together.', contactAccent2: [2],
  contactSub: "Speak to a travel specialist, share your ideas, ask your questions, or simply tell us what you're looking for. We'll help you plan the rest.",
  contactCall: 'Schedule a call',
  contactWa: 'Talk to an Expert',
  contactAlt: 'Our travel experts are here to help every day, from 9:00 AM–9:00 PM IST.',
};
