/* ============================================================================
   Japan cherry-blossom lander (/japan-cherry-blossom) — every number and every
   line of offer copy lives in this file, so marketing can change the offer
   without touching layout code.

   ⚠ BEFORE LAUNCH
   · TOURS: routes, nights and prices are placeholders shaped to the brief
     (Focused_Destination_Strategy, slide 5: Japan lands at about ₹1–1.2 lakh
     per person, round-off prices). The product team's real Japan products
     were due 20–21 Nov 2026 — swap them in here.
   · DEPOSIT: the PM's second note says "customer pays 45k instead of 55k"
     when booking online. The original brief said ₹35,000. This file follows
     the newer note. Confirm which one Finance signed off (slide 10, decision 1).
   · REVIEWS: placeholder copy. Replace with verified customer reviews (name,
     city, tour, month) before this page takes ad traffic.
   · PAYMENT_URL: null until the Connect / gateway link exists. While null,
     "Pay deposit" hands the selection to the WhatsApp bot, which sends the
     payment link.
   ========================================================================== */

export const OFFER = {
  depositOnline: 45000,   // what the customer pays today when booking online
  depositOffline: 55000,  // the same upfront amount booked any other way
  onlineDiscount: 10000,  // = depositOffline − depositOnline, comes off the tour price
};

export const WA_NUMBER = '912269111700'; // v3content CONTACT.whatsappHref
export const PAYMENT_URL = null;
export const PHONE = { display: '+91 8556001700', href: 'tel:+918556001700' };
export const EMAIL = 'holidays@coxandkings.com';

export const inr = (n) => '₹' + n.toLocaleString('en-IN');

export const waLink = (text) =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;

export const img = (id, w = 1400) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=78`;

/* Stable "random" seat count per departure: the brief asks for a random number
   under 20, but a number that changes on every render reads as a lie the
   second time someone looks. Hash the id instead → 3..18, same every visit.
   Replace with live inventory when Connect exposes it. */
const seatsFor = (key) => {
  let h = 2166136261;
  for (let i = 0; i < key.length; i += 1) h = Math.imul(h ^ key.charCodeAt(i), 16777619);
  return 3 + (Math.abs(h) % 16);
};

const dep = (tourId, iso, soldOut = false) => {
  const d = new Date(`${iso}T00:00:00`);
  return {
    id: `${tourId}-${iso}`,
    iso,
    day: d.toLocaleDateString('en-IN', { day: '2-digit' }),
    mon: d.toLocaleDateString('en-IN', { month: 'short' }),
    label: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    soldOut,
    seats: soldOut ? 0 : seatsFor(`${tourId}-${iso}`),
  };
};

/* Feb + Mar departures are sold out (PM note 8); April is live (note 9). */
const dates = (id, sold, live) => [
  ...sold.map((d) => dep(id, d, true)),
  ...live.map((d) => dep(id, d)),
];

export const TOURS = [
  {
    id: 'sakura-highlights',
    name: 'Sakura Highlights',
    nd: '6 Nights / 7 Days',
    price: 109000,
    tag: 'First time in Japan',
    blurb: 'Tokyo, Mt Fuji and Kyoto at the peak of the bloom, at an easy pace.',
    stops: [
      { city: 'Tokyo', nights: 2 },
      { city: 'Kawaguchiko', nights: 1 },
      { city: 'Kyoto', nights: 2 },
      { city: 'Osaka', nights: 1 },
    ],
    image: '1490806843957-31f4c9a91c65',
    alt: 'Mt Fuji framed by cherry blossom against a clear blue sky',
    deps: dates('sakura-highlights', ['2027-02-27', '2027-03-13', '2027-03-24'], ['2027-04-03', '2027-04-10', '2027-04-17']),
  },
  {
    id: 'japan-in-full-bloom',
    name: 'Japan in Full Bloom',
    nd: '8 Nights / 9 Days',
    price: 119000,
    tag: 'Most booked',
    featured: true,
    blurb: 'A ryokan night in Hakone, three nights in Kyoto and a day with the deer of Nara.',
    stops: [
      { city: 'Tokyo', nights: 3 },
      { city: 'Hakone', nights: 1 },
      { city: 'Kyoto', nights: 3 },
      { city: 'Nara', nights: 0 },
      { city: 'Osaka', nights: 1 },
    ],
    image: '1522547902298-51566e4fb383',
    alt: 'The Senso-ji pagoda in Tokyo behind branches of cherry blossom',
    deps: dates('japan-in-full-bloom', ['2027-02-20', '2027-03-06', '2027-03-20', '2027-03-28'], ['2027-04-04', '2027-04-11', '2027-04-18']),
  },
  {
    id: 'alps-and-blossom',
    name: 'Alps & Blossom',
    nd: '10 Nights / 11 Days',
    price: 139000,
    tag: 'For the slow traveller',
    blurb: 'Late blossom in the Japanese Alps: Takayama, Shirakawa-go and Kanazawa’s gardens.',
    stops: [
      { city: 'Tokyo', nights: 3 },
      // lp = label position override [dx, dy, anchor] in label-heights,
      // where the Alps cluster would otherwise put two labels on top of each other.
      { city: 'Kawaguchiko', nights: 1, lp: [0.3, 1.75, 'middle'] },
      { city: 'Takayama', nights: 1, lp: [0.9, 1.05, 'start'] },
      { city: 'Shirakawa-go', nights: 0, lp: [0.9, -0.5, 'start'] },
      { city: 'Kanazawa', nights: 1 },
      { city: 'Kyoto', nights: 3 },
      { city: 'Osaka', nights: 1 },
    ],
    image: '1526481280693-3bfa7568e0f3',
    alt: 'The Chureito pagoda above Fujiyoshida with Mt Fuji behind it',
    deps: dates('alps-and-blossom', ['2027-03-10', '2027-03-26'], ['2027-04-08', '2027-04-15', '2027-04-22']),
  },
];

/* ⚠ PLACEHOLDER itineraries. Shaped to each tour's stops and nights so the
   "View itinerary" popup works end to end. The hotel names are real 4-star
   properties in each city, but they are NOT contracted: the product team
   must replace them (and the days) with the actual Japan products. The brief
   promises hotel names "guaranteed without substitutions", so these must be
   the real ones before launch. */
export const HOTELS = {
  Tokyo: 'Mitsui Garden Hotel Ginza Premier',
  Kawaguchiko: 'Fuji View Hotel',
  Hakone: 'Hotel Okada, Hakone Yumoto (ryokan)',
  Kyoto: 'Mitsui Garden Hotel Kyoto Sanjo',
  Osaka: 'Hotel Nikko Osaka',
  Takayama: 'Hida Hotel Plaza',
  Kanazawa: 'Hotel Nikko Kanazawa',
};

export const FLIGHTS = {
  out: 'Mumbai or Delhi to Tokyo (Narita), economy, baggage included',
  back: 'Osaka (Kansai) to Mumbai or Delhi, economy, baggage included',
};

const D = (t, d, stay, travel, meals = 'B L D') => ({ t, d, stay, travel, meals });
const ARRIVE = D('Fly to Tokyo', 'Your tour manager meets you at Narita. Transfer to the hotel and a welcome dinner.', 'Tokyo', 'Flight + airport transfer', 'D');
const HOME = D('Fly home', 'Breakfast, then a transfer to Kansai airport for your flight home.', null, 'Airport transfer + flight', 'B');
const TOKYO_BLOOM = D('Tokyo in bloom', 'Ueno Park and Senso-ji under the cherry trees, Shinjuku Gyoen, and the city from Tokyo Skytree.', 'Tokyo', 'Private coach');
const FUJI = D('Mt Fuji and the lakes', 'The Chureito pagoda above Fujiyoshida, then a blossom walk along Lake Kawaguchi.', 'Kawaguchiko', 'Private coach, about 2 hrs');
const KYOTO_EAST = D('Kyoto: temples and lanes', 'Kiyomizu-dera, the Philosopher’s Path in bloom and the gates of Fushimi Inari. Tea ceremony in the evening.', 'Kyoto', 'Private coach');
const ARASHIYAMA = D('Kyoto: Arashiyama', 'The bamboo grove, Tenryu-ji’s garden and a riverside lunch. Evening walk through Gion.', 'Kyoto', 'Private coach');
const NARA_OSAKA = D('Nara and Osaka', 'The deer of Nara Park and Todai-ji, then Osaka Castle park in blossom and dinner in Dotonbori.', 'Osaka', 'Private coach');

export const ITINERARIES = {
  'sakura-highlights': [
    ARRIVE,
    TOKYO_BLOOM,
    FUJI,
    D('Bullet train to Kyoto', 'Shinkansen from Mishima to Kyoto. Evening along the Shirakawa canal in Gion.', 'Kyoto', 'Private coach + Shinkansen'),
    KYOTO_EAST,
    NARA_OSAKA,
    HOME,
  ],
  'japan-in-full-bloom': [
    ARRIVE,
    TOKYO_BLOOM,
    D('Tokyo: Meguro and Shibuya', 'The Meguro river canopy, a boat at Chidorigafuchi moat and the Shibuya crossing.', 'Tokyo', 'Private coach'),
    D('Hakone, a ryokan night', 'Lake Ashi cruise and the Owakudani ropeway, then a kaiseki-style dinner and hot-spring baths.', 'Hakone', 'Private coach, about 2 hrs'),
    D('Bullet train to Kyoto', 'Shinkansen from Odawara to Kyoto. Evening walk through Gion.', 'Kyoto', 'Private coach + Shinkansen'),
    ARASHIYAMA,
    KYOTO_EAST,
    NARA_OSAKA,
    HOME,
  ],
  'alps-and-blossom': [
    ARRIVE,
    TOKYO_BLOOM,
    D('Tokyo: Meguro and Shibuya', 'The Meguro river canopy, a boat at Chidorigafuchi moat and the Shibuya crossing.', 'Tokyo', 'Private coach'),
    FUJI,
    D('Into the Alps', 'Matsumoto Castle on the way, then Takayama’s old merchant streets at dusk.', 'Takayama', 'Private coach, about 4 hrs'),
    D('Shirakawa-go to Kanazawa', 'Takayama’s morning market, the thatched farmhouses of Shirakawa-go, on to Kanazawa.', 'Kanazawa', 'Private coach, about 3 hrs'),
    D('Kenroku-en, then Kyoto', 'Kenroku-en garden in bloom and the Higashi Chaya tea district, then the train to Kyoto.', 'Kyoto', 'Private coach + express train'),
    ARASHIYAMA,
    KYOTO_EAST,
    NARA_OSAKA,
    HOME,
  ],
};

/* Everything the fixed price covers — the brief's list, in its order. */
export const INCLUDED = [
  'Return flights',
  'Branded 4-star hotels',
  'Breakfast, lunch & dinner',
  'Airport transfers',
  'Intercity travel',
  'Comfortable coaches',
  'Guided sightseeing',
  'Experiences',
  'Major entry tickets',
  'Visa assistance',
  'Comprehensive insurance',
  'GST & TCS',
  'Payment gateway charges',
];

export const NEVER = [
  'No exchange-rate impact',
  'No hidden charges',
  'No costly optional sightseeing',
];

/* Ratings — the same figures the homepage, /testimonials and the Thailand
   lander print (Testimonials.jsx PLATFORMS). They must agree everywhere;
   change them there and here together. */
export const RATING = { overall: '4.9', count: '2,400+', google: '4.8', tripadvisor: '4.9' };

/* Accolades — verbatim from /press-media and /testimonials, same emblems. */
export const AWARDS = [
  { img: '/awards/accolades.jpg', title: "India's Favourite Tour Operator", by: "Condé Nast Traveller Readers' Travel Awards", years: '2016, 2017, 2022' },
  { img: '/awards/accolades-3.jpg', title: "Asia's Leading Luxury Tour Operator", by: 'World Travel Awards', years: '2015–2019' },
  { img: '/awards/accolades-2.jpg', title: 'PATA Gold Award', by: 'Pacific Asia Travel Association', years: '2015' },
  { img: '/awards/accolades-4.png', title: 'Best Luxury Travel Curator', by: "Travel + Leisure India's Best Awards", years: '2017' },
];

/* ⚠ PLACEHOLDER reviews — see the header note. `photo` is an Unsplash id
   for the card's trip photo (all already used elsewhere on the site). */
export const REVIEWS = [
  { name: 'Meera & Anil Kulkarni', city: 'Pune', tour: 'Japan in Full Bloom', when: 'April 2026', photo: '1522547902298-51566e4fb383', text: 'We are both vegetarian and never once had to explain ourselves. The hotels were exactly the ones named in our itinerary.' },
  { name: 'Harpreet Sethi', city: 'Chandigarh', tour: 'Sakura Highlights', when: 'March 2026', photo: '1540959733332-eab4deabeeaf', text: 'The price we paid was the price. No dollar surprises at the counter, no “optional” tours on the bus.' },
  { name: 'Rajesh Jain', city: 'Ahmedabad', tour: 'Japan in Full Bloom', when: 'April 2026', photo: '1528360983277-13d401cdc186', text: 'Jain meals, every single day, in Japan. Our tour manager had spoken to every restaurant before we arrived.' },
  { name: 'Ananya Reddy', city: 'Hyderabad', tour: 'Alps & Blossom', when: 'April 2026', photo: '1526481280693-3bfa7568e0f3', text: 'Three nights in Tokyo, three in Kyoto. We actually unpacked. Takayama in blossom was the loveliest morning of the year.' },
  { name: 'Suresh Iyer', city: 'Bengaluru', tour: 'Sakura Highlights', when: 'March 2026', photo: '1493976040374-85c8e12f0c0e', text: 'I booked for my parents, both past 70. Visa, insurance, the pace: all handled. They came home rested, not tired.' },
];
