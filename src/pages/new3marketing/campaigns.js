/* ============================================================================
   The three live campaigns the /new3-marketing hero sells.

   Prices, deposits and departure months are READ from each lander's own
   data.js, never retyped here, so the banner and the page it links to cannot
   disagree. Change a tour price in sakura/data.js and the hero follows.
   (They are all still placeholders there: see each data.js header.)
   ========================================================================== */

import * as JP from '../sakura/data';
import * as EU from '../europe/data';
import * as VN from '../vietnam/data';

const U = (id, w = 2000) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const fromPrice = (tours) => Math.min(...tours.map((t) => t.price));

/* Months (YYYY-MM) with at least one departure that is NOT sold out. */
const liveMonths = (tours) => [...new Set(
  tours.flatMap((t) => t.deps.filter((d) => !d.soldOut).map((d) => d.iso.slice(0, 7))),
)].sort();

export const CAMPAIGNS = [
  {
    key: 'japan',
    to: '/japan-cherry-blossom',
    word: 'JAPAN',
    season: 'Cherry blossom 2027',
    kind: 'Group tours',
    title: ['Japan,', 'in full bloom.'],
    sub: 'Tokyo, Fuji and Kyoto at the peak of the sakura. Flights, 4-star hotels, every meal and your visa, taken care of.',
    tag: 'Book online',
    from: fromPrice(JP.TOURS),
    deposit: JP.OFFER.depositOnline,
    depositWas: JP.OFFER.depositOffline,
    saving: JP.OFFER.onlineDiscount,
    months: liveMonths(JP.TOURS),
    accent: '#D78C70',          // Sienna Flame / 300 (marker dots only)
    image: U('1490806843957-31f4c9a91c65'),
    thumb: U('1490806843957-31f4c9a91c65', 400),
    pos: '50% 60%',
    match: /(japan|kyoto|tokyo|osaka|fuji|sakura|cherry)/i,
  },
  {
    key: 'europe',
    to: '/europe-early-booking',
    word: 'EUROPE',
    season: 'Summer 2027',
    kind: 'Early booking',
    title: ['Europe,', 'booked early.'],
    sub: `Paris to the Alps on the early-bird price, held until ${EU.OFFER.earlyBy}. Flights, 4-star hotels, meals and your Schengen visa.`,
    tag: 'Early bird',
    from: fromPrice(EU.TOURS),
    deposit: EU.OFFER.depositOnline,
    depositWas: EU.OFFER.depositOffline,
    saving: EU.OFFER.onlineDiscount,
    deadline: EU.OFFER.earlyBy,
    months: liveMonths(EU.TOURS),
    accent: '#6D9CD0',          // Voyager Blue / 300 (marker dots only)
    image: U('1502602898657-3e91760cbb34'),
    thumb: U('1502602898657-3e91760cbb34', 400),
    pos: '50% 45%',
    match: /(europe|paris|france|swiss|switzer|alps|ital|rome|venice|amsterdam|london|austria|germany|spain|greece)/i,
  },
  {
    key: 'vietnam',
    to: '/vietnam-group-tours',
    word: 'VIỆT NAM',
    season: 'Spring 2027',
    kind: 'Group tours',
    title: ['Vietnam,', 'all taken care of.'],
    sub: 'Ha Long Bay to the Mekong, with a night on the bay. Flights, 4-star hotels, every meal and your e-visa.',
    tag: 'Book online',
    from: fromPrice(VN.TOURS),
    deposit: VN.OFFER.depositOnline,
    depositWas: VN.OFFER.depositOffline,
    saving: VN.OFFER.onlineDiscount,
    months: liveMonths(VN.TOURS),
    accent: '#BD4011',          // Sienna Flame / 500 (marker dots only)
    /* Two-layer cut-out from the lander: the wordmark slides BETWEEN them. */
    image: '/vietnam/halong-sky.jpg',
    layer: '/vietnam/halong-karsts.webp',
    thumb: '/vietnam/halong-sky.jpg',
    pos: '50% 50%',
    match: /(vietnam|viet nam|ha ?long|hanoi|saigon|ho chi minh|hoi an|mekong|da nang)/i,
  },
];

export const inr = JP.inr;

export const campaignFor = (text) => {
  const q = (text || '').trim();
  if (!q) return null;
  return CAMPAIGNS.find((c) => c.match.test(q)) || null;
};
