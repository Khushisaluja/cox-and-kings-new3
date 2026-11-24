/* ============================================================================
   Vietnam, spring 2027 group tours (/vietnam-group-tours). The same lander as
   the Japan and Europe pages. Every number and every line of offer copy
   lives in this file.

   ⚠ BEFORE LAUNCH
   · TOURS: routes, nights and prices are PLACEHOLDERS. The strategy deck
     (Focused_Destination_Strategy, slide 5) prices Vietnam as "net flight
     cost + all-inclusive costs, built up per person for each departure and
     rounded off", and gives no number, so confirm every price with Finance.
   · OFFER: the deposit and online saving are PLACEHOLDERS scaled down from
     the Japan/Europe 45k/55k mechanic (a ₹45,000 deposit on an ₹80,000 tour
     would read oddly). Confirm both.
   · ITINERARIES / HOTELS: placeholders. The hotel and cruise names are real
     properties but are NOT contracted.
   · REVIEWS: placeholder copy. Replace with verified Vietnam reviews.
   · PAYMENT_URL: null, so the booking button is a dummy.
   ========================================================================== */

export const OFFER = {
  depositOnline: 20000,   // ⚠ placeholder: paid today when booking online
  depositOffline: 25000,  // ⚠ placeholder: the same upfront amount booked any other way
  onlineDiscount: 5000,   // ⚠ placeholder: the online saving; comes off the tour price
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

/* The first spring departures are already sold out; the rest are live. */
const dates = (id, sold, live) => [
  ...sold.map((d) => dep(id, d, true)),
  ...live.map((d) => dep(id, d)),
];

export const TOURS = [
  {
    id: 'vietnam-highlights',
    name: 'Vietnam Highlights',
    nd: '6 Nights / 7 Days',
    price: 84000,
    tag: 'First time in Vietnam',
    blurb: 'Hanoi, a night on Ha Long Bay, then Da Nang and lantern-lit Hoi An.',
    stops: [
      { city: 'Hanoi', nights: 2 },
      { city: 'Ha Long Bay', nights: 1 },
      { city: 'Da Nang', nights: 2 },
      { city: 'Hoi An', nights: 1 },
    ],
    flights: { out: 'Delhi or Mumbai to Hanoi, economy, baggage included', back: 'Da Nang to Delhi or Mumbai, economy, baggage included' },
    image: '1557750255-c76072a7aad1',
    alt: 'A pagoda on the water between green limestone cliffs at Trang An',
    deps: dates('vietnam-highlights', ['2027-02-06', '2027-02-20'], ['2027-03-06', '2027-03-20', '2027-04-03', '2027-04-17']),
  },
  {
    id: 'grand-vietnam',
    name: 'Grand Vietnam',
    nd: '9 Nights / 10 Days',
    price: 112000,
    tag: 'Most booked',
    featured: true,
    blurb: 'North to south: Ha Long Bay, the Golden Bridge, Hoi An at full moon, Saigon and the Mekong.',
    stops: [
      { city: 'Hanoi', nights: 2 },
      { city: 'Ha Long Bay', nights: 1 },
      { city: 'Da Nang', nights: 2 },
      { city: 'Hoi An', nights: 1 },
      { city: 'Ho Chi Minh City', nights: 3 },
      { city: 'Mekong Delta', nights: 0 },
    ],
    flights: { out: 'Delhi or Mumbai to Hanoi, economy, baggage included', back: 'Ho Chi Minh City to Delhi or Mumbai, economy, baggage included' },
    image: '1564596823821-79b97151055e',
    alt: 'The Golden Bridge held up by two giant stone hands above the forest at Ba Na Hills',
    deps: dates('grand-vietnam', ['2027-02-13', '2027-02-27'], ['2027-03-13', '2027-03-27', '2027-04-10', '2027-04-24']),
  },
  {
    id: 'karsts-and-islands',
    name: 'Karsts & Islands',
    nd: '7 Nights / 8 Days',
    price: 96000,
    tag: 'Bays & beaches',
    blurb: 'Hanoi, Ninh Binh’s rice-field karsts, a Ha Long cruise, then three slow nights on Phu Quoc.',
    stops: [
      { city: 'Hanoi', nights: 2 },
      { city: 'Ninh Binh', nights: 0 },
      { city: 'Ha Long Bay', nights: 1, lp: [1, 0.35, 'start'] },
      { city: 'Phu Quoc', nights: 3 },
    ],
    flights: { out: 'Delhi or Mumbai to Hanoi, economy, baggage included', back: 'Phu Quoc to Delhi or Mumbai via Ho Chi Minh City, economy, baggage included' },
    image: '1504457047772-27faf1c00561',
    alt: 'Limestone karsts and a village reflected in still water at Tam Coc, Ninh Binh',
    deps: dates('karsts-and-islands', ['2027-02-10'], ['2027-02-24', '2027-03-10', '2027-03-24', '2027-04-07', '2027-04-21']),
  },
];

/* ⚠ PLACEHOLDER itineraries and hotels (see the header). Real properties,
   not contracted: replace with the actual Vietnam products. */
export const HOTELS = {
  Hanoi: 'Novotel Suites Hanoi',
  'Ha Long Bay': 'Ambassador Cruise, overnight cabin',
  'Da Nang': 'Novotel Danang Premier Han River',
  'Hoi An': 'Hoi An Silk Marina Resort',
  'Ho Chi Minh City': 'Novotel Saigon Centre',
  'Phu Quoc': 'Novotel Phu Quoc Resort',
};

const D = (t, d, stay, travel, meals = 'B L D') => ({ t, d, stay, travel, meals });
const HANOI_ARRIVE = D('Fly to Hanoi', 'Your tour manager meets you at Noi Bai airport. An evening walk round Hoan Kiem Lake and a welcome dinner.', 'Hanoi', 'Flight + airport transfer', 'D');
const HANOI = D('Hanoi', 'Ho Chi Minh’s mausoleum, the Temple of Literature, Tran Quoc pagoda on West Lake and a cyclo ride through the Old Quarter.', 'Hanoi', 'Private coach + cyclo');
const HALONG = D('Ha Long Bay', 'Board your cruise among the limestone islands: kayaking, Sung Sot cave and dinner on deck.', 'Ha Long Bay', 'Private coach, about 3 hrs + cruise');
const TO_DANANG = D('Ha Long to Da Nang', 'Tai chi on the sundeck at sunrise, brunch on board, then a short flight south to Da Nang.', 'Da Nang', 'Coach + domestic flight', 'B L D');
const BANA = D('Ba Na Hills', 'The cable car up to Ba Na Hills and a walk across the Golden Bridge, held up by two stone hands.', 'Da Nang', 'Private coach + cable car');
const HOIAN = D('Hoi An', 'The Japanese Covered Bridge, old merchant houses and a lantern-lit boat ride on the Thu Bon river.', 'Hoi An', 'Private coach, about 45 min');

export const ITINERARIES = {
  'vietnam-highlights': [
    HANOI_ARRIVE, HANOI, HALONG, TO_DANANG, BANA, HOIAN,
    D('Fly home', 'Breakfast, then a transfer to Da Nang airport for your flight home.', null, 'Airport transfer + flight', 'B'),
  ],
  'grand-vietnam': [
    HANOI_ARRIVE, HANOI, HALONG, TO_DANANG, BANA, HOIAN,
    D('Fly to Saigon', 'A short flight to Ho Chi Minh City: the Notre-Dame Cathedral, the Central Post Office and Ben Thanh market.', 'Ho Chi Minh City', 'Domestic flight + private coach'),
    D('Cu Chi tunnels', 'The tunnel network at Cu Chi in the morning, then an evening dinner cruise on the Saigon river.', 'Ho Chi Minh City', 'Private coach, about 1.5 hrs'),
    D('The Mekong Delta', 'A day on the delta: sampan boats through coconut canals, a fruit orchard and a floating market.', 'Ho Chi Minh City', 'Private coach + boat'),
    D('Fly home', 'Breakfast, then a transfer to Tan Son Nhat airport for your flight home.', null, 'Airport transfer + flight', 'B'),
  ],
  'karsts-and-islands': [
    HANOI_ARRIVE,
    D('Ninh Binh', 'A day trip to Tam Coc: a rowing boat between rice fields and karst cliffs, then the temples of Hoa Lu.', 'Hanoi', 'Private coach, about 2 hrs + boat'),
    HALONG,
    D('Fly to Phu Quoc', 'Back to Hanoi by coach, then a flight south to the island of Phu Quoc and a sunset on Long Beach.', 'Phu Quoc', 'Coach + domestic flight', 'B L D'),
    D('Phu Quoc islands', 'The Hon Thom cable car over the sea, snorkelling off An Thoi and a seafood lunch on the beach.', 'Phu Quoc', 'Private coach + cable car + boat'),
    D('Phu Quoc at leisure', 'A free day by the pool or the sea, then the night market at Duong Dong.', 'Phu Quoc', 'At leisure'),
    D('Fly home', 'Breakfast, then a transfer to Phu Quoc airport for your flight home.', null, 'Airport transfer + flight', 'B'),
  ],
};

/* Everything the fixed price covers, in the brief's order. */
export const INCLUDED = [
  'Return flights',
  '4-star hotels & a Ha Long cruise',
  'Breakfast, lunch & dinner',
  'Airport transfers',
  'Domestic flights',
  'Comfortable coaches',
  'Guided sightseeing',
  'Experiences',
  'Major entry tickets',
  'E-visa handled for you',
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

/* ⚠ PLACEHOLDER reviews: see the header note. `photo` is an Unsplash id. */
export const REVIEWS = [
  { name: 'Sneha & Vikram Joshi', city: 'Pune', tour: 'Grand Vietnam', when: 'March 2026', photo: '1559592413-7cec4d0cae2b', text: 'The Golden Bridge in the morning mist, Hoi An by lantern light, Saigon by night. Ten days and not one thing we had to arrange ourselves.' },
  { name: 'Harpreet Sandhu', city: 'Amritsar', tour: 'Vietnam Highlights', when: 'April 2026', photo: '1528127269322-539801943592', text: 'The night on the Ha Long cruise was the best of the trip. Vegetarian dinner on deck, and our tour manager had told the chef in advance.' },
  { name: 'Meena Iyer', city: 'Bengaluru', tour: 'Karsts & Islands', when: 'February 2026', photo: '1504457047772-27faf1c00561', text: 'Rowing between the rice fields at Tam Coc, then three lazy days on Phu Quoc. My mother, who is 71, never once felt rushed.' },
  { name: 'Aditya Rao', city: 'Hyderabad', tour: 'Grand Vietnam', when: 'March 2026', photo: '1583417319070-4a69db38a482', text: 'The price we saw online was the price we paid. E-visa, domestic flights, the Mekong boat: all of it already included.' },
  { name: 'Farah Siddiqui', city: 'Lucknow', tour: 'Vietnam Highlights', when: 'February 2026', photo: '1555921015-5532091f6026', text: 'Hanoi’s old quarter felt overwhelming for about ten minutes, until our guide took over. Every meal had a vegetarian option that tasted good.' },
];
