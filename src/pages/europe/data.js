/* ============================================================================
   Europe, early booking (/europe-early-booking). Same page as the Japan
   cherry-blossom lander, marketed on the early-booking price instead of the
   blossom. Every number and every line of offer copy lives in this file.

   ⚠ BEFORE LAUNCH
   · TOURS: routes, nights and prices are placeholders shaped to the strategy
     deck (Focused_Destination_Strategy, slide 5: Europe lands at about
     ₹1–1.2 lakh per person, round-off prices, with an "early-booking price,
     real price → discounted price"). Live coxandkings.com Europe group tours
     list at ₹2.5–3.6 lakh, so confirm the real products and prices.
   · EARLY-BIRD: ₹10,000 off when booked online before OFFER.earlyBy. The
     deposit mechanic is the PM's note ("pays 45k instead of 55k"); the
     original brief said ₹35,000. Confirm both with Finance.
   · ITINERARIES / HOTELS: placeholders. The hotel names are real 4-star
     properties but are NOT contracted.
   · REVIEWS: placeholder copy. Replace with verified Europe reviews.
   · PAYMENT_URL: null, so the booking button is a dummy.
   ========================================================================== */

export const OFFER = {
  depositOnline: 45000,   // what the customer pays today when booking early online
  depositOffline: 55000,  // the same upfront amount booked any other way
  onlineDiscount: 10000,  // the early-bird saving; comes off the tour price
  earlyBy: '31 Jan 2027', // last day of the early-bird price
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

/* The first summer departures are already sold out (early bookers took
   them); the rest are live with seats left. */
const dates = (id, sold, live) => [
  ...sold.map((d) => dep(id, d, true)),
  ...live.map((d) => dep(id, d)),
];

export const TOURS = [
  {
    id: 'europe-highlights',
    name: 'Europe Highlights',
    nd: '7 Nights / 8 Days',
    price: 109000,
    tag: 'First time in Europe',
    blurb: 'Paris, Amsterdam, the Swiss Alps and Venice, at an easy pace.',
    stops: [
      { city: 'Paris', nights: 2 },
      { city: 'Brussels', nights: 0 },
      { city: 'Amsterdam', nights: 1 },
      { city: 'Lucerne', nights: 2 },
      { city: 'Innsbruck', nights: 1 },
      { city: 'Venice', nights: 1 },
    ],
    flights: { out: 'Mumbai or Delhi to Paris, economy, baggage included', back: 'Venice to Mumbai or Delhi, economy, baggage included' },
    image: '1527668752968-14dc70a27c95',
    alt: 'A Swiss lake below snow-capped peaks and green meadows',
    deps: dates('europe-highlights', ['2027-05-08', '2027-05-22'], ['2027-06-05', '2027-06-19', '2027-07-03', '2027-07-17']),
  },
  {
    id: 'grand-europe',
    name: 'Grand Europe',
    nd: '10 Nights / 11 Days',
    price: 139000,
    tag: 'Most booked',
    featured: true,
    blurb: 'Seven countries, two nights in Lucerne and two in Rome, with Florence on the way.',
    stops: [
      { city: 'Paris', nights: 2 },
      { city: 'Brussels', nights: 0 },
      { city: 'Amsterdam', nights: 1 },
      { city: 'Lucerne', nights: 2 },
      { city: 'Innsbruck', nights: 1 },
      { city: 'Venice', nights: 1 },
      { city: 'Florence', nights: 1 },
      { city: 'Rome', nights: 2 },
    ],
    flights: { out: 'Mumbai or Delhi to Paris, economy, baggage included', back: 'Rome to Mumbai or Delhi, economy, baggage included' },
    image: '1552832230-c0197dd311b5',
    alt: 'The Colosseum in Rome under a soft evening sky',
    deps: dates('grand-europe', ['2027-05-01', '2027-05-15', '2027-05-29'], ['2027-06-12', '2027-06-26', '2027-07-10', '2027-07-24']),
  },
  {
    id: 'central-europe-gems',
    name: 'Central Europe Gems',
    nd: '7 Nights / 8 Days',
    price: 119000,
    tag: 'Castles & old towns',
    blurb: 'Budapest, Vienna, Salzburg and Prague: palaces, the Danube and old-town squares.',
    stops: [
      { city: 'Budapest', nights: 2 },
      { city: 'Bratislava', nights: 0 },
      { city: 'Vienna', nights: 2 },
      { city: 'Salzburg', nights: 1 },
      { city: 'Prague', nights: 2 },
    ],
    flights: { out: 'Mumbai or Delhi to Budapest, economy, baggage included', back: 'Prague to Mumbai or Delhi, economy, baggage included' },
    image: '1541849546-216549ae216d',
    alt: 'The spires and red roofs of Prague Old Town',
    deps: dates('central-europe-gems', ['2027-05-12', '2027-05-26'], ['2027-06-09', '2027-06-23', '2027-07-07', '2027-08-04']),
  },
];

/* ⚠ PLACEHOLDER itineraries and hotels (see the header). Real 4-star
   properties, not contracted: replace with the actual Europe products. */
export const HOTELS = {
  Paris: 'Novotel Paris Centre Tour Eiffel',
  Amsterdam: 'NH Amsterdam Centre',
  Lucerne: 'Radisson Blu Hotel, Lucerne',
  Innsbruck: 'Hilton Innsbruck',
  Venice: 'Hilton Garden Inn Venice Mestre San Giuliano',
  Florence: 'Novotel Firenze Nord Aeroporto',
  Rome: 'Novotel Roma Eur',
  Budapest: 'Novotel Budapest Danube',
  Vienna: 'Austria Trend Hotel Savoyen Vienna',
  Salzburg: 'Austria Trend Hotel Europa Salzburg',
  Prague: 'Hilton Prague Old Town',
};

const D = (t, d, stay, travel, meals = 'B L D') => ({ t, d, stay, travel, meals });
const PARIS_ARRIVE = D('Fly to Paris', 'Your tour manager meets you at Charles de Gaulle. Transfer to the hotel and a welcome dinner.', 'Paris', 'Flight + airport transfer', 'D');
const PARIS = D('Paris', 'The Eiffel Tower to the second level, a Seine cruise, the Louvre’s glass pyramid and the Champs-Élysées.', 'Paris', 'Private coach');
const TO_AMSTERDAM = D('Brussels, then Amsterdam', 'The Grand-Place and the Atomium in Brussels, then on to Amsterdam for the evening.', 'Amsterdam', 'Private coach, about 6 hrs');
const TO_LUCERNE = D('Amsterdam to the Alps', 'A morning canal cruise, then south along the Rhine valley to Lucerne.', 'Lucerne', 'Private coach, about 8 hrs');
const TITLIS = D('Mt Titlis', 'The revolving Rotair cable car to the glacier, then the Chapel Bridge and the lake at dusk.', 'Lucerne', 'Private coach + cable car');
const INNSBRUCK = D('Liechtenstein to Innsbruck', 'A stop in Vaduz, then Swarovski Crystal Worlds and Innsbruck’s Golden Roof.', 'Innsbruck', 'Private coach, about 4 hrs');
const VENICE = D('Venice', 'Over the Brenner Pass to Venice: a gondola ride, St Mark’s Square and the Rialto.', 'Venice', 'Private coach + water bus');

export const ITINERARIES = {
  'europe-highlights': [
    PARIS_ARRIVE, PARIS, TO_AMSTERDAM, TO_LUCERNE, TITLIS, INNSBRUCK, VENICE,
    D('Fly home', 'Breakfast, then a transfer to Venice airport for your flight home.', null, 'Airport transfer + flight', 'B'),
  ],
  'grand-europe': [
    PARIS_ARRIVE, PARIS, TO_AMSTERDAM, TO_LUCERNE, TITLIS, INNSBRUCK, VENICE,
    D('Florence', 'Down through Tuscany to Florence: the Duomo, Ponte Vecchio and the view from Piazzale Michelangelo.', 'Florence', 'Private coach, about 3 hrs'),
    D('Rome and the Vatican', 'On to Rome for the Vatican Museums, the Sistine Chapel and St Peter’s Basilica.', 'Rome', 'Private coach, about 3 hrs'),
    D('Ancient Rome', 'The Colosseum and the Roman Forum, then the Trevi Fountain and the Spanish Steps.', 'Rome', 'Private coach'),
    D('Fly home', 'Breakfast, then a transfer to Rome Fiumicino for your flight home.', null, 'Airport transfer + flight', 'B'),
  ],
  'central-europe-gems': [
    D('Fly to Budapest', 'Your tour manager meets you at the airport. An evening Danube cruise with dinner.', 'Budapest', 'Flight + airport transfer', 'D'),
    D('Budapest', 'Buda Castle, Fisherman’s Bastion and the Parliament, with time for the thermal baths.', 'Budapest', 'Private coach'),
    D('Bratislava, then Vienna', 'Lunch in Bratislava’s old town, then on to Vienna for an evening on the Ringstrasse.', 'Vienna', 'Private coach, about 3 hrs'),
    D('Vienna', 'Schönbrunn Palace and its gardens, St Stephen’s Cathedral and a coffee-house afternoon.', 'Vienna', 'Private coach'),
    D('Hallstatt to Salzburg', 'The lakeside village of Hallstatt, then Salzburg’s old town and Mirabell Gardens.', 'Salzburg', 'Private coach, about 4 hrs'),
    D('On to Prague', 'A photo stop in Český Krumlov on the way to Prague.', 'Prague', 'Private coach, about 5 hrs'),
    D('Prague', 'Prague Castle, the Charles Bridge and the astronomical clock in the Old Town Square.', 'Prague', 'Private coach'),
    D('Fly home', 'Breakfast, then a transfer to Prague airport for your flight home.', null, 'Airport transfer + flight', 'B'),
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

/* ⚠ PLACEHOLDER reviews — see the header note. `photo` is an Unsplash id. */
export const REVIEWS = [
  { name: 'Kavita & Rohan Mehta', city: 'Mumbai', tour: 'Grand Europe', when: 'June 2026', photo: '1523906834658-6e24ef2386f9', text: 'We booked in January and paid less than friends who booked in May for the same tour. Same hotels, same seats, just earlier.' },
  { name: 'Gurpreet Anand', city: 'Ludhiana', tour: 'Europe Highlights', when: 'July 2026', photo: '1534351590666-13e3e96b5017', text: 'Every meal had something vegetarian that tasted like home. The price we paid was the price, not one euro more.' },
  { name: 'Nirmala Shah', city: 'Surat', tour: 'Central Europe Gems', when: 'May 2026', photo: '1541343672885-9be56236302a', text: 'Jain food in Prague and Vienna, every single day. Our tour manager had called ahead to each restaurant.' },
  { name: 'Arjun Nair', city: 'Kochi', tour: 'Grand Europe', when: 'June 2026', photo: '1530122037265-a5f1f91d3b99', text: 'Two nights in Lucerne, two in Rome. We were never rushed, and Titlis on a clear day is something my parents still talk about.' },
  { name: 'Deepa Krishnan', city: 'Chennai', tour: 'Europe Highlights', when: 'August 2026', photo: '1467269204594-9661b134dd2b', text: 'Visa, insurance, the Schengen paperwork: all handled. We just packed and turned up at the airport.' },
];
