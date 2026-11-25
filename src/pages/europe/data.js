/* ============================================================================
   Europe, early booking (/europe-early-booking). Same page as the Japan
   cherry-blossom lander, marketed on early booking. Every number and every
   line of offer copy lives in this file.

   SOURCE OF TRUTH: the PM's product sheet (Google Sheet
   1aSUJAetAIHvmNbHhUfOUOBKNFUC37Ji2fbho0yP8F_w, gid 698108089, the four
   Europe rows). Package names, prices, nights, cities, departure cities,
   departure dates, the booking amount, inclusions and exclusions are copied
   from it. Re-pull it with
     curl -L ".../export?format=csv&gid=698108089"
   The day-by-day, hotels and meals come from the live package pages
   (coxandkings.com/group-tours/<slug>, the embedded "itinerary" JSON).

   ⚠ STILL TO CONFIRM BEFORE LAUNCH
   · EARLY-BIRD: ₹10,000 off the tour price when booked online before
     OFFER.earlyBy. This is the page's own early-booking hook (strategy deck,
     slide 5); the sheet does NOT mention it. Everything else on the price
     side (tour price, ₹55,000 booking amount) is the sheet's.
   · Seats left per departure are a stable hash, not live inventory.
   · REVIEWS are placeholder copy.
   · PAYMENT_URL: null, so the booking button is a dummy.
   ========================================================================== */

export const OFFER = {
  booking: 55000,         // the sheet: "Book at just ₹55,000/-. Pay after you get your visa."
  onlineDiscount: 10000,  // early-bird saving, off the tour price (NOT in the sheet; see header)
  earlyBy: '31 Jan 2027', // last day of the early-bird price
};

/* The lowest package price, as the sheet prints it (no early-bird maths), for
   the homepage campaign banners. */
export const FROM_PRICE = 280000;

export const WA_NUMBER = '918556001700'; // one number everywhere, as on the Japan v2 page
export const PAYMENT_URL = null;
export const PHONE = { display: '+91 85560 01700', href: 'tel:+918556001700' };
export const EMAIL = 'holidays@coxandkings.com';

export const inr = (n) => '₹' + n.toLocaleString('en-IN');

export const waLink = (text) =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;

export const img = (id, w = 1400) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=78`;

/* Stable "random" seat count per departure: hash the id → 3..18, same every
   visit. Replace with live inventory when Connect exposes it. */
const seatsFor = (key) => {
  let h = 2166136261;
  for (let i = 0; i < key.length; i += 1) h = Math.imul(h ^ key.charCodeAt(i), 16777619);
  return 3 + (Math.abs(h) % 16);
};

const MONTHS = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' };

/* The sheet's "Departures" cell, pasted verbatim ("Apr.27: 16, 19\nMay.27: 01"),
   turned into departure objects. */
const fromSheet = (tourId, cell) => cell.trim().split('\n').flatMap((line) => {
  const [, mon, yy, list] = line.match(/^(\w{3})\.(\d{2}):\s*(.+)$/);
  return list.split(',').map((d) => {
    const iso = `20${yy}-${MONTHS[mon]}-${d.trim().padStart(2, '0')}`;
    const dt = new Date(`${iso}T00:00:00`);
    return {
      id: `${tourId}-${iso}`,
      iso,
      month: dt.toLocaleDateString('en-IN', { month: 'short' }),
      day: dt.toLocaleDateString('en-IN', { day: '2-digit' }),
      mon: dt.toLocaleDateString('en-IN', { month: 'short' }),
      label: dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      soldOut: false,
      seats: seatsFor(`${tourId}-${iso}`),
    };
  });
});

/* Sheet: Departure City = DEL BOM BLR CCU AMD HYD MAA, the same for all four. */
export const FROM = 'Delhi, Mumbai, Bengaluru, Kolkata, Ahmedabad, Hyderabad or Chennai';

/* The sheet's Inclusions cell, one line per item, verbatim apart from the
   tick marks and two typos ("inWell", a doubled "Visa Assistance (").
   The last four lines are the same on every package. */
const COMMON_TAIL = [
  'Mandatory Driver & Guide Tips',
  'Complimentary Travel Insurance',
  'Visa Assistance (Documentation, Processing & Appointment Booking Support)',
  'GST and TCS Included',
];

const DEP_SUMMER = `Apr.27: 16, 19, 22, 25, 27, 29
May.27: 01, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31
Jun.27: 01, 02, 03, 05, 06, 07, 08, 09, 21, 22, 23, 26, 27, 28, 29, 30
Jul.27: 03, 04, 05, 06, 07, 10, 11, 12, 13, 14, 17, 18, 19, 20, 21, 24, 26, 28, 31
Aug.27: 04, 07, 10, 13, 16, 19, 22, 25, 28, 31
Sep.27: 03, 07, 14, 21, 28
Oct.27: 06, 20
Nov.27: 14, 24
Dec.27: 09, 25`;

const EXCLUSIONS = [
  'Embassy/Consulate visa fees',
  'Personal expenses',
  'Entrance fees not mentioned in inclusions',
  'Meals not specified in itinerary',
  'Expenses due to itinerary changes beyond control',
  'Anything not mentioned under package inclusions',
];

export const TOURS = [
  {
    id: 'fascinating-europe-summer-2027',
    name: 'Fascinating Europe Summer 2027',
    nd: '6 Nights / 7 Days',
    price: 280000,
    tag: 'Paris & the Swiss Alps',
    blurb: 'Three nights in Paris with Disneyland®, then Geneva, Jungfraujoch, Mount Titlis and the Black Forest.',
    stops: [
      { city: 'Paris', nights: 3 },
      { city: 'Geneva', nights: 1 },
      { city: 'Lucerne', nights: 0 },
      { city: 'Zurich', nights: 2 },
    ],
    hotels: [
      { name: 'Millennium CDG or similar', city: 'Paris', nights: 3 },
      { name: 'Everness or similar', city: 'Geneva', nights: 1 },
      { name: 'La Maison or similar', city: 'Zurich', nights: 2 },
    ],
    flights: { out: `${FROM} to Paris, economy`, back: 'Zurich to your home city, economy' },
    image: '1527668752968-14dc70a27c95',
    alt: 'A Swiss lake below snow-capped peaks and green meadows',
    deps: fromSheet('fascinating-europe-summer-2027', DEP_SUMMER),
    inclusions: [
      'Return Economy Class Airfare',
      '06 Nights Accommodation in Well-Appointed 4-Star Hotels on Double/Twin Sharing Basis',
      'Daily Continental Breakfast at the Hotel',
      'Daily Indian Lunches & Dinners as Mentioned in the Itinerary',
      'Packed Meals on select days as per the Itinerary',
      'Airport Transfers & Intercity Transfers as per the Itinerary',
      'Services of a Professional Tour Manager Throughout the Journey',
      'Guided Paris City Tour',
      'Eiffel Tower 3rd Level',
      'Guided Palace of Versailles Tour, including State Apartments & Hall of Mirrors',
      'Montmartre Funicular Ride & Sacré-Cœur Basilica Visit',
      'Paris Illumination Tour & River Seine Cruise',
      'Disneyland® Paris, 1 Day, 1 Park Experience with Disney Fireworks',
      'Geneva Orientation Tour',
      'Lake Geneva Cruise or Toy Train Ride',
      'Harder Kulm Funicular Ride with Special Lunch at the Summit',
      'Jungfraujoch Excursion, including Sphinx Observatory & Ice Palace',
      'Interlaken Visit',
      'Mount Titlis Excursion with Rotair Revolving Cable Car, Glacier Cave & Titlis Tower',
      'Lucerne Orientation Tour covering Chapel Bridge & Lion Monument',
      'Black Forest Visit',
      'Traditional Cuckoo Clock Demonstration',
      ...COMMON_TAIL,
    ],
    exclusions: EXCLUSIONS,
    url: 'https://coxandkings.com/group-tours/fascinating-europe-summer-2027',
  },
  {
    id: 'the-beauty-of-europe-summer-2027',
    name: 'The Beauty of Europe Summer 2027',
    nd: '10 Nights / 11 Days',
    price: 350000,
    tag: '7 countries',
    blurb: 'Paris and the Swiss Alps, then Liechtenstein, Innsbruck, Venice, Pisa, Florence and Rome.',
    stops: [
      { city: 'Paris', nights: 3 },
      { city: 'Geneva', nights: 1 },
      { city: 'Zurich', nights: 2 },
      { city: 'Innsbruck', nights: 1 },
      { city: 'Venice', nights: 0 },
      { city: 'Pisa', nights: 0 },
      { city: 'Tuscany', nights: 1 },
      { city: 'Rome', nights: 1 },
    ],
    hotels: [
      { name: 'B&B Grand Roissy CDG or similar', city: 'Paris', nights: 3 },
      { name: 'Everness or similar', city: 'Geneva', nights: 1 },
      { name: 'La Maison or similar', city: 'Zurich', nights: 2 },
      { name: 'Alpenkoning or similar', city: 'Innsbruck', nights: 1 },
      { name: 'Four Points by Sheraton or similar', city: 'Padova', nights: 1 },
      { name: 'Grand Le Fonti or similar', city: 'Tuscany', nights: 1 },
      { name: 'Simon or similar', city: 'Rome', nights: 1 },
    ],
    flights: { out: `${FROM} to Paris, economy`, back: 'Rome to your home city, economy' },
    image: '1552832230-c0197dd311b5',
    alt: 'The Colosseum in Rome under a soft evening sky',
    deps: fromSheet('the-beauty-of-europe-summer-2027', DEP_SUMMER),
    inclusions: [
      'Return Economy Class Airfare',
      '10 Nights Accommodation in Well-Appointed 4-Star Hotels on Double/Twin Sharing Basis',
      'Daily Breakfast at the Hotel',
      'Daily Indian Lunches and Dinners as Mentioned in the Itinerary',
      'Packed Meals on Select Days as per Itinerary',
      'Airport Transfers and Intercity Transfers as per Itinerary',
      'Professional Tour Manager Throughout the Journey',
      'Guided Paris City Tour',
      'Eiffel Tower 3rd Level',
      'Palace of Versailles Visit',
      'Montmartre Funicular Ride & Sacré-Cœur Basilica',
      'Paris Illumination Tour',
      'River Seine Cruise',
      'Disneyland® Paris One Day, One Park Experience & Fireworks',
      'Geneva Orientation Tour',
      'Lake Geneva Cruise or Toy Train Ride',
      'Harder Kulm Funicular Ride & Special Lunch',
      'Jungfraujoch Excursion with Eiger Express & Cogwheel Train',
      'Interlaken Visit',
      'Black Forest Visit & Cuckoo Clock Demonstration',
      'Mount Titlis with Rotair Revolving Cable Car & Titlis Tower',
      'Lucerne Orientation Tour',
      'Rhine Falls Visit',
      'Vaduz Mini Train Ride',
      'Swarovski Crystal Museum Visit',
      'Innsbruck Orientation Tour',
      "Venice Orientation, St. Mark's Square by Private Boat & Gondola Ride",
      'Leaning Tower of Pisa Visit',
      'Guided Florence City Tour',
      'Rome & Vatican City Visit',
      ...COMMON_TAIL,
    ],
    exclusions: EXCLUSIONS,
    url: 'https://coxandkings.com/group-tours/the-beauty-of-europe-summer-2027',
  },
  {
    id: 'europe-s-grand-circuit-summer-2027',
    name: 'Europe’s Grand Circuit Summer 2027',
    nd: '12 Nights / 13 Days',
    price: 380000,
    tag: '9 countries',
    blurb: 'Starts in Amsterdam with Giethoorn and the Dutch villages, then Brussels, Paris, the Alps and Italy to Rome.',
    stops: [
      { city: 'Amsterdam', nights: 2 },
      { city: 'Brussels', nights: 0 },
      { city: 'Paris', nights: 3 },
      { city: 'Geneva', nights: 1 },
      { city: 'Zurich', nights: 2 },
      { city: 'Innsbruck', nights: 1 },
      { city: 'Venice', nights: 0 },
      { city: 'Pisa', nights: 0 },
      { city: 'Tuscany', nights: 1 },
      { city: 'Rome', nights: 1 },
    ],
    hotels: [
      { name: 'Holiday Inn Eindhoven or similar', city: 'Amsterdam', nights: 2 },
      { name: 'B&B Grand Roissy CDG or similar', city: 'Paris', nights: 3 },
      { name: 'Everness or similar', city: 'Geneva', nights: 1 },
      { name: 'La Maison or similar', city: 'Zurich', nights: 2 },
      { name: 'Alpenkoning or similar', city: 'Innsbruck', nights: 1 },
      { name: 'Four Points by Sheraton or similar', city: 'Padova', nights: 1 },
      { name: 'Grand Le Fonti or similar', city: 'Tuscany', nights: 1 },
      { name: 'Simon or similar', city: 'Rome', nights: 1 },
    ],
    flights: { out: `${FROM} to Amsterdam, economy`, back: 'Rome to your home city, economy' },
    image: '1534351590666-13e3e96b5017',
    alt: 'Canal houses and bicycles along an Amsterdam canal',
    deps: fromSheet('europe-s-grand-circuit-summer-2027', `Apr.27: 14, 17, 20, 23, 25, 27, 29
May.27: 01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31
Jun.27: 01, 03, 04, 05, 06, 07, 19, 20, 21, 24, 25, 26, 27, 28
Jul.27: 01, 02, 03, 04, 05, 08, 09, 10, 11, 12, 15, 16, 17, 18, 19, 22, 24, 26, 29
Aug.27: 02, 05, 08, 11, 14, 17, 20, 23, 26, 29
Sep.27: 01, 05, 12, 19, 26
Oct.27: 04, 18
Nov.27: 12, 22
Dec.27: 07, 23`),
    inclusions: [
      'Return Economy Class Airfare',
      '12 Nights Accommodation in Well-Appointed Hotels on Double/Twin Sharing Basis',
      'Daily Breakfast at the Hotel',
      'Daily Indian Lunches and Dinners as Mentioned in the Itinerary',
      'Packed Meals on Select Days as per Itinerary',
      'Airport Transfers and Sightseeing Transfers as per Itinerary',
      'Services of Tour Manager / Local Representative as per Tour Arrangement',
      'Amsterdam Canal Cruise',
      'Giethoorn Boat Ride',
      'Zaanse Schans Visit',
      'Tulip Gardens (till 9 May) or Volendam Visit (from 10 May)',
      'Madurodam & Mini-Europe',
      'Brussels Orientation Tour',
      'Belgian Beer Museum (departures after 9 May)',
      'Eiffel Tower 3rd Level',
      'Guided Palace of Versailles Visit',
      'Montmartre Funicular Ride',
      'Paris Illumination Tour',
      'River Seine Cruise',
      'Disneyland® Paris, 1 Day, 1 Park & Fireworks',
      'Geneva Orientation & Lake Geneva Cruise or Toy Train Ride',
      'Harder Kulm Funicular Ride & Special Summit Lunch',
      'Jungfraujoch Excursion',
      'Mount Titlis with Rotair, Glacier Cave, Titlis Tower & Cliff Walk',
      'Black Forest Visit & Cuckoo Clock Demonstration',
      'Vaduz Mini Train Ride',
      'Swarovski Crystal Museum',
      "Venice Gondola Ride & Private Boat to St. Mark's Square",
      'Leaning Tower of Pisa Visit',
      'Guided Florence City Tour',
      'Rome Guided City Tour & Vatican City Visit',
      ...COMMON_TAIL,
    ],
    exclusions: EXCLUSIONS,
    url: 'https://coxandkings.com/group-tours/europe-s-grand-circuit-summer-2027',
  },
  {
    id: 'grand-wonders-of-europe-summer-2027',
    name: 'Grand Wonders of Europe Summer 2027',
    nd: '14 Nights / 15 Days',
    price: 460000,
    tag: '10 countries, from London',
    blurb: 'Two nights in London, the Eurostar to Amsterdam, then Paris, the Swiss Alps and Italy all the way to Rome.',
    stops: [
      { city: 'London', nights: 2 },
      { city: 'Amsterdam', nights: 2 },
      { city: 'Brussels', nights: 0 },
      { city: 'Paris', nights: 3 },
      { city: 'Geneva', nights: 1 },
      { city: 'Zurich', nights: 2 },
      { city: 'Innsbruck', nights: 1 },
      { city: 'Venice', nights: 0 },
      { city: 'Pisa', nights: 0 },
      { city: 'Tuscany', nights: 1 },
      { city: 'Rome', nights: 1 },
    ],
    hotels: [
      { name: 'Atrium LHR or similar', city: 'London', nights: 2 },
      { name: 'Holiday Inn Eindhoven or similar', city: 'Amsterdam', nights: 2 },
      { name: 'B&B Grand Roissy CDG or similar', city: 'Paris', nights: 3 },
      { name: 'Everness or similar', city: 'Geneva', nights: 1 },
      { name: 'La Maison or similar', city: 'Zurich', nights: 2 },
      { name: 'Alpenkoning or similar', city: 'Innsbruck', nights: 1 },
      { name: 'Four Points by Sheraton or similar', city: 'Padova', nights: 1 },
      { name: 'Grand Le Fonti or similar', city: 'Tuscany', nights: 1 },
      { name: 'Simon or similar', city: 'Rome', nights: 1 },
    ],
    flights: { out: `${FROM} to London, economy`, back: 'Rome to your home city, economy' },
    image: '1513635269975-59663e0ac1ad',
    alt: 'Tower Bridge over the Thames in London',
    deps: fromSheet('grand-wonders-of-europe-summer-2027', `Apr.27: 12, 18, 23, 27
May.27: 01, 03, 05, 09, 11, 15, 18, 24, 30
Jun.27: 02, 17, 22, 26, 30
Jul.27: 07, 15, 31
Aug.27: 18, 30
Sep.27: 10, 24
Oct.27: 02, 31`),
    inclusions: [
      'Return Economy Class Airfare',
      '14 Nights Accommodation in Well-Appointed 4-Star Hotels on Twin/Double Sharing Basis',
      'Daily Breakfast at the Hotel',
      'Daily Indian Lunches and Dinners as Mentioned in the Itinerary',
      'Packed Meals on Select Days as per Itinerary',
      'Airport Transfers and Sightseeing Transfers as per Itinerary',
      'Services of Tour Manager / Local Representative as per Tour Arrangement',
      'High-Speed Eurostar Train from London to Amsterdam',
      'Guided London City Tour',
      'Witness the Changing of the Guards at Buckingham Palace (subject to operation)',
      'Entrance to Tower of London, including the Crown Jewels',
      'Entrance to Madame Tussauds Wax Museum',
      'Ride on the London Eye',
      'Amsterdam Canal Cruise',
      'Giethoorn Boat Ride',
      'Zaanse Schans Visit',
      'Tulip Gardens (till 9 May) or Volendam Visit (from 10 May)',
      'Madurodam & Mini-Europe',
      'Brussels Orientation Tour',
      'Belgian Beer Museum (departures after 9 May)',
      'Eiffel Tower 3rd Level',
      'Guided Palace of Versailles Visit',
      'Montmartre Funicular Ride',
      'Paris Illumination Tour',
      'River Seine Cruise',
      'Disneyland® Paris, 1 Day, 1 Park & Fireworks',
      'Geneva Orientation & Lake Geneva Cruise or Toy Train Ride',
      'Harder Kulm Funicular Ride & Special Summit Lunch',
      'Jungfraujoch Excursion',
      'Mount Titlis with Rotair, Glacier Cave, Titlis Tower & Cliff Walk',
      'Black Forest Visit & Cuckoo Clock Demonstration',
      'Vaduz Mini Train Ride',
      'Swarovski Crystal Museum',
      "Venice Gondola Ride & Private Boat to St. Mark's Square",
      'Leaning Tower of Pisa Visit',
      'Guided Florence City Tour',
      'Rome Guided City Tour & Vatican City Visit',
      ...COMMON_TAIL,
    ],
    exclusions: [
      'Embassy/Consulate visa fees',
      'Any optional activities cost',
      ...EXCLUSIONS.slice(1),
    ],
    url: 'https://coxandkings.com/group-tours/grand-wonders-of-europe-summer-2027',
  },
];

/* Day by day, condensed from the live package pages. `stay` is the hotel
   name itself (null on the last day); meals are as the package page lists
   them. Shared days are defined once. */
const D = (t, d, stay, travel, meals) => ({ t, d, stay, travel, meals });
const ALL3 = ['Breakfast', 'Indian lunch', 'Indian dinner'];
const BB_CDG = 'B&B Grand Roissy CDG or similar';
const EVERNESS = 'Everness or similar';
const LA_MAISON = 'La Maison or similar';
const EINDHOVEN = 'Holiday Inn Eindhoven or similar';

const PARIS_SIGHTS = (stay) => D('Versailles, Eiffel Tower 3rd level, Montmartre',
  'A guided visit to the Palace of Versailles and the Hall of Mirrors, the Eiffel Tower to its 3rd level, the Montmartre funicular to Sacré-Cœur, and Paris lit up at night.',
  stay, 'Coach', ALL3);
const PARIS_DISNEY = (stay, meals) => D('Paris city tour, Seine cruise, Disneyland® Paris',
  'A guided city tour (Arc de Triomphe, Champs-Élysées, Place de la Concorde, Notre-Dame), a River Seine cruise, then Disneyland® Paris: one day, one park, and the fireworks.',
  stay, 'Coach', meals);
const GENEVA = (meals) => D('Geneva, and Lake Geneva by boat or toy train',
  'On to Geneva: the Jet d’Eau, the Flower Clock and the lakeside promenade, then a Lake Geneva cruise or a toy train ride.',
  EVERNESS, 'Coach', meals);
const JUNGFRAU = D('Harder Kulm and Jungfraujoch, Top of Europe',
  'The Harder Kulm funicular with a special lunch at the summit, Interlaken, and Jungfraujoch with the Sphinx Observatory and the Ice Palace.',
  LA_MAISON, 'Coach + mountain railway', ALL3);
const TITLIS = D('Black Forest, Mount Titlis and Lucerne',
  'A cuckoo-clock demonstration in Germany’s Black Forest, Mount Titlis by the revolving Rotair cable car with the Glacier Cave and Titlis Tower, then Lucerne’s Chapel Bridge and Lion Monument.',
  LA_MAISON, 'Coach + cable car', ALL3);
const INNSBRUCK = D('Rhine Falls, Vaduz, Swarovski, Innsbruck',
  'The Rhine Falls, a mini-train ride in Vaduz, Liechtenstein, the Swarovski Crystal Museum, then Innsbruck.',
  'Alpenkoning or similar', 'Coach', ALL3);
const VENICE = D('Venice: private boat and gondola',
  'By private boat to St Mark’s Square, then a gondola ride through the canals. Overnight in Padova.',
  'Four Points by Sheraton or similar', 'Coach + private boat', ALL3);
const PISA_FLORENCE = D('Pisa and Florence',
  'The Leaning Tower on the Square of Miracles, then a guided tour of Florence, the birthplace of the Renaissance. Overnight in Tuscany.',
  'Grand Le Fonti or similar', 'Coach', ALL3);
const ROME = D('Rome and the Vatican',
  'A guided tour of the Eternal City, then Vatican City and St Peter’s Basilica.',
  'Simon or similar', 'Coach', ALL3);
const ROME_HOME = D('Fly home', 'Breakfast, check out, and a transfer to the airport for your flight home.', null, 'Airport transfer + flight', ['Breakfast']);
const DUTCH = D('Giethoorn, Zaanse Schans, tulips or Volendam',
  'A boat ride through car-free Giethoorn, the windmills of Zaanse Schans, and the tulip gardens (till 9 May) or Volendam (from 10 May).',
  EINDHOVEN, 'Coach + boat', ALL3);
const BRUSSELS = D('Madurodam, Mini-Europe, Brussels',
  'The miniature cities of Madurodam and Mini-Europe, an orientation tour of Brussels (and the Belgian Beer Museum after 9 May), then on to Paris.',
  BB_CDG, 'Coach', ALL3);
const ALPS_TO_ROME = [GENEVA(['Breakfast', 'Packed lunch', 'Indian dinner']), JUNGFRAU, TITLIS, INNSBRUCK, VENICE, PISA_FLORENCE, ROME, ROME_HOME];

export const ITINERARIES = {
  'fascinating-europe-summer-2027': [
    D('Arrive in Paris', 'Your tour manager meets you on arrival. Transfer to the hotel and settle in.', 'Millennium CDG or similar', 'Flight + airport transfer', ['Indian dinner']),
    PARIS_SIGHTS('Millennium CDG or similar'),
    PARIS_DISNEY('Millennium CDG or similar', ['Breakfast', 'Indian lunch', 'Packed dinner']),
    GENEVA(['Breakfast', 'Packed lunch', 'Indian dinner']),
    JUNGFRAU,
    TITLIS,
    D('Fly home', 'Breakfast, check out, and a transfer to Zurich Airport for your flight home.', null, 'Airport transfer + flight', ['Breakfast']),
  ],
  'the-beauty-of-europe-summer-2027': [
    D('Arrive in Paris', 'Your tour manager meets you on arrival. Transfer to the hotel and settle in.', BB_CDG, 'Flight + airport transfer', ['Indian dinner']),
    PARIS_SIGHTS(BB_CDG),
    PARIS_DISNEY(BB_CDG, ['Breakfast', 'Indian lunch', 'Packed dinner']),
    ...ALPS_TO_ROME,
  ],
  'europe-s-grand-circuit-summer-2027': [
    D('Arrive in Amsterdam, canal cruise', 'Met on arrival and checked in, then an evening cruise on Amsterdam’s canals.', EINDHOVEN, 'Flight + airport transfer', ['Indian dinner']),
    DUTCH,
    BRUSSELS,
    PARIS_SIGHTS(BB_CDG),
    PARIS_DISNEY(BB_CDG, ['Breakfast', 'Packed lunch', 'Indian dinner']),
    ...ALPS_TO_ROME,
  ],
  'grand-wonders-of-europe-summer-2027': [
    D('Arrive in London', 'Met by your Cox & Kings representative and taken to the hotel. Dinner at the hotel.', 'Atrium LHR or similar', 'Flight + airport transfer', ['Indian dinner']),
    D('London, Madame Tussauds, the London Eye', 'A guided city tour past Buckingham Palace, Westminster Abbey, Big Ben and Trafalgar Square, then Madame Tussauds and a ride on the London Eye.', 'Atrium LHR or similar', 'Coach', ALL3),
    D('Eurostar to Amsterdam, canal cruise', 'The high-speed Eurostar to Amsterdam, then an evening cruise on the canals.', EINDHOVEN, 'Eurostar + coach', ALL3),
    DUTCH,
    BRUSSELS,
    PARIS_SIGHTS(BB_CDG),
    PARIS_DISNEY(BB_CDG, ['Breakfast', 'Packed lunch', 'Indian dinner']),
    ...ALPS_TO_ROME,
  ],
};

/* "One price" section: what all four packages' inclusions have in common,
   in the sheet's words, shortened. Icons are in the jsx (INC_ICONS), same order. */
export const INCLUDED = [
  'Return economy airfare',
  'Well-appointed hotels, twin sharing',
  'Daily breakfast',
  'Indian lunches & dinners as per itinerary',
  'Airport & intercity transfers',
  'Tour manager throughout',
  'Eiffel Tower 3rd level & Versailles',
  'Disneyland® Paris with fireworks',
  'Jungfraujoch & Mount Titlis',
  'Driver & guide tips',
  'Complimentary travel insurance',
  'Visa assistance',
  'GST & TCS',
];

export const NEVER = [
  'No exchange-rate impact',
  'No hidden charges',
  'No compulsory shopping stops',
];

/* The sheet's exclusions, common to all four, for the "One price" footnote. */
export const NOT_INCLUDED = 'Embassy visa fees, personal expenses, and anything not listed in the package inclusions.';

export const RATING = { overall: '4.9', count: '2,400+', google: '4.8', tripadvisor: '4.9' };

export const AWARDS = [
  { img: '/awards/accolades.jpg', title: "India's Favourite Tour Operator", by: "Condé Nast Traveller Readers' Travel Awards", years: '2016, 2017, 2022' },
  { img: '/awards/accolades-3.jpg', title: "Asia's Leading Luxury Tour Operator", by: 'World Travel Awards', years: '2015–2019' },
  { img: '/awards/accolades-2.jpg', title: 'PATA Gold Award', by: 'Pacific Asia Travel Association', years: '2015' },
  { img: '/awards/accolades-4.png', title: 'Best Luxury Travel Curator', by: "Travel + Leisure India's Best Awards", years: '2017' },
];

/* ⚠ PLACEHOLDER reviews, retagged to the four real packages. */
export const REVIEWS = [
  { name: 'Kavita & Rohan Mehta', city: 'Mumbai', tour: 'The Beauty of Europe', when: 'June 2026', photo: '1523906834658-6e24ef2386f9', text: 'We booked in January and paid less than friends who booked in May for the same tour. Same hotels, same seats, just earlier.' },
  { name: 'Gurpreet Anand', city: 'Ludhiana', tour: 'Fascinating Europe', when: 'July 2026', photo: '1534351590666-13e3e96b5017', text: 'Indian lunches and dinners that tasted like home. The price we paid was the price, not one euro more.' },
  { name: 'Nirmala Shah', city: 'Surat', tour: 'Europe’s Grand Circuit', when: 'May 2026', photo: '1541343672885-9be56236302a', text: 'Jain food in Paris and Rome, every single day. Our tour manager had called ahead to each restaurant.' },
  { name: 'Arjun Nair', city: 'Kochi', tour: 'Grand Wonders of Europe', when: 'June 2026', photo: '1530122037265-a5f1f91d3b99', text: 'London to Rome in fifteen days and we were never rushed. Jungfraujoch on a clear day is something my parents still talk about.' },
  { name: 'Deepa Krishnan', city: 'Chennai', tour: 'Fascinating Europe', when: 'August 2026', photo: '1467269204594-9661b134dd2b', text: 'The visa paperwork, the appointment, the insurance: all handled. We just packed and turned up at the airport.' },
];

/* EMI on the balance (used by /europe-early-booking-v2 only).
   ⚠ PLACEHOLDER maths, same as the Japan v3 page: the balance after the
   early-bird discount and the booking amount, split evenly, before interest,
   rounded up to ₹100. Rate and eligibility come from the EMI partner. */
export const EMI = {
  tenures: [3, 6, 9, 12],
  defaultTenure: 6,
  note: 'Indicative: the balance split evenly, before interest. Final rate and tenure are set by our EMI partner on approval.',
};
