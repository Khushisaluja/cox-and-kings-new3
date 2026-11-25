/* ============================================================================
   Japan cherry-blossom lander, VARIANT 2 (/japan-cherry-blossom-v2).

   The two packages come from the product sheet ("Package Name" tab of the
   Focused Destination products sheet, Japan rows) and the live package pages
   on coxandkings.com, so names, prices, departures, cities, hotels and the
   day-by-day are the real products, not placeholders:
     · Japan's Cherry Blossom Trail  /group-tours/japan-s-cherry-blossom-trail
     · Japan Sakura Explorer         /group-tours/japan-sakura-explorer

   ⚠ STILL TO CONFIRM BEFORE LAUNCH
   · DEPOSIT: the sheet says "Book at just ₹55,000, pay after you get your
     visa". Online booking takes ₹10,000 off, so the page shows ₹45,000 online.
   · EMI: the strategy deck names Asigo as the EMI partner. Tenures and the
     "from ₹X a month" figure are the balance split evenly BEFORE interest;
     swap in the partner's real rates when they are agreed.
   · Seats left per departure are a stable hash, not live inventory.
   · REVIEWS are placeholder copy.
   ========================================================================== */

export const OFFER = {
  depositOnline: 45000,   // what the customer pays today when booking online
  depositOffline: 55000,  // the sheet's "Book at just ₹55,000"
  onlineDiscount: 10000,  // comes off the tour price when booked online
};

/* One number for every WhatsApp link AND the footer. The v1 page sent
   WhatsApp to 2269111700 while the footer printed 8556001700; 8556001700 is
   the number the rest of the site uses for wa.me links (21 places). */
export const WA_NUMBER = '918556001700';
export const PAYMENT_URL = null;
export const PHONE = { display: '+91 85560 01700', href: 'tel:+918556001700' };
export const WHATSAPP = { display: '+91 85560 01700' };
export const EMAIL = 'holidays@coxandkings.com';

export const inr = (n) => '₹' + n.toLocaleString('en-IN');
/* ₹2,80,000 → ₹2.8 lakh, for tight spots. */
export const lakh = (n) => `₹${(n / 100000).toFixed(2).replace(/0+$/, '').replace(/\.$/, '')} lakh`;

export const waLink = (text) =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;

export const img = (id, w = 1400) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=78`;

const seatsFor = (key) => {
  let h = 2166136261;
  for (let i = 0; i < key.length; i += 1) h = Math.imul(h ^ key.charCodeAt(i), 16777619);
  return 3 + (Math.abs(h) % 16);
};

const dep = (tourId, iso) => {
  const d = new Date(`${iso}T00:00:00`);
  return {
    id: `${tourId}-${iso}`,
    iso,
    day: d.toLocaleDateString('en-IN', { day: '2-digit' }),
    mon: d.toLocaleDateString('en-IN', { month: 'short' }),
    label: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    soldOut: false,
    seats: seatsFor(`${tourId}-${iso}`),
  };
};

/* "Mar.27: 02, 06" → ['2027-03-02', '2027-03-06'] */
const days = (month, list) => list.map((d) => `2027-${month}-${String(d).padStart(2, '0')}`);

/* Extra map points the v1 map module doesn't carry, in its projection
   (equirectangular, lon 129.4–142.2 → x 0–400, y = (41.7 − lat) × 38.63). */
export const EXTRA_CITIES = {
  Hamamatsu: [260.3, 270.0],
  'Kansai Airport': [182.5, 280.8],
};

const CITIES_7 = 'Delhi, Mumbai, Bengaluru, Kolkata, Ahmedabad, Hyderabad, Chennai';

export const TOURS = [
  {
    id: 'japan-s-cherry-blossom-trail',
    name: "Japan's Cherry Blossom Trail",
    nd: '7 Nights / 8 Days',
    price: 290000,
    tag: 'Kyoto, Nara & Mt Fuji',
    blurb: 'Four nights in Osaka with Kyoto and Nara by day, then the bullet train to Tokyo for Mt Fuji and Hakone.',
    from: 'Delhi',
    stops: [
      { city: 'Osaka', nights: 4 },
      { city: 'Kyoto', nights: 0 },
      { city: 'Nara', nights: 0, lp: [0.9, 1.1, 'start'] },
      { city: 'Hakone', nights: 0 },
      { city: 'Tokyo', nights: 3 },
    ],
    highlights: [
      'Shinkansen both ways',
      'Kinkaku-ji & Fushimi Inari',
      'Nara deer park',
      'Mt Fuji 5th Station',
      'Lake Ashi pirate cruise',
      'Tokyo Skytree ticket',
    ],
    image: '1522547902298-51566e4fb383',
    alt: 'The Senso-ji pagoda in Tokyo behind branches of cherry blossom',
    deps: [...days('03', [2, 6, 7, 13, 14, 21, 23, 28, 30]), ...days('04', [11, 13, 15, 17, 20])]
      .map((d) => dep('japan-s-cherry-blossom-trail', d)),
    flights: {
      out: 'Delhi to Tokyo (Haneda), economy',
      back: 'Tokyo (Haneda) to Delhi, economy',
    },
    hotels: [
      { name: 'RIHGA Royal Hotel Osaka or similar', city: 'Osaka', nights: 4 },
      { name: 'Mercure Tokyo Haneda or similar', city: 'Tokyo', nights: 3 },
    ],
    url: 'https://coxandkings.com/group-tours/japan-s-cherry-blossom-trail',
  },
  {
    id: 'japan-sakura-explorer',
    name: 'Japan Sakura Explorer',
    nd: '7 Nights / 8 Days',
    price: 340000,
    tag: 'Peak bloom dates',
    featured: true,
    blurb: 'Timed for the peak bloom: Ueno Park, Mt Fuji, Kyoto, Hiroshima and Nara, from seven Indian cities.',
    from: CITIES_7,
    stops: [
      { city: 'Tokyo', nights: 2 },
      { city: 'Hakone', nights: 0, lp: [0.9, 1.0, 'start'] },
      { city: 'Hamamatsu', nights: 1, lp: [-0.2, 1.7, 'start'] },
      { city: 'Kyoto', nights: 0, lp: [0.9, -0.6, 'start'] },
      { city: 'Osaka', nights: 3, lp: [-0.3, -0.9, 'end'] },
      { city: 'Hiroshima', nights: 0, lp: [0, 1.6, 'middle'] },
      { city: 'Nara', nights: 0, lp: [0.9, 0.5, 'start'] },
      /* The last night is at the Kansai airport hotel, a few km from Osaka:
         on a map this small it would sit on Osaka's dot, so it's left off the
         map (the caption's hotel count still includes it). */
    ],
    highlights: [
      'Ueno Park cherry blossom',
      'TeamLab Planets',
      'Sagano Romantic Train',
      'Hiroshima by bullet train',
      'Mt Fuji & Lake Ashi',
      'Nara & Todai-ji',
    ],
    image: '1493976040374-85c8e12f0c0e',
    alt: 'Cherry blossom over the old wooden lanes of Higashiyama in Kyoto',
    deps: [...days('03', [24, 26, 28, 30]), ...days('04', [1, 3])]
      .map((d) => dep('japan-sakura-explorer', d)),
    flights: {
      out: `${CITIES_7} to Tokyo, economy`,
      back: 'Osaka (Kansai) to your home city, economy',
    },
    hotels: [
      { name: 'Shinagawa Prince Hotel or similar', city: 'Tokyo', nights: 2 },
      { name: 'Grand Mercure Lake Hamana Resort & Spa or similar', city: 'Hamamatsu', nights: 1 },
      { name: 'Fairfield by Marriott Osaka Namba or similar', city: 'Osaka', nights: 3 },
      { name: 'Nikko Kansai Airport Hotel or similar', city: 'Kansai Airport', nights: 1 },
    ],
    url: 'https://coxandkings.com/group-tours/japan-sakura-explorer',
  },
];

/* Day by day, condensed from the live package pages. `stay` is the hotel
   name itself; meals are as the package page lists them. */
const D = (t, d, stay, travel, meals) => ({ t, d, stay, travel, meals });
const RIHGA = 'RIHGA Royal Hotel Osaka or similar';
const MERCURE = 'Mercure Tokyo Haneda or similar';
const SHINAGAWA = 'Shinagawa Prince Hotel or similar';
const FAIRFIELD = 'Fairfield by Marriott Osaka Namba or similar';
const ALL3 = ['Breakfast', 'Indian lunch', 'Indian dinner'];

export const ITINERARIES = {
  'japan-s-cherry-blossom-trail': [
    D('Arrive in Tokyo, bullet train to Osaka', 'Met at Tokyo Haneda, then the Shinkansen from Tokyo Station to Osaka. Check in; the rest of the day is yours.', RIHGA, 'Flight + Shinkansen + transfer', ['Indian dinner']),
    D('Kyoto, a full day', 'Arashiyama Bamboo Grove, Kinkaku-ji (the Golden Pavilion), the torii gates of Fushimi Inari, Kiyomizu-dera and the Gion district.', RIHGA, 'Coach, day trip from Osaka', ALL3),
    D('Nara, then Osaka', 'The free-roaming deer of Nara Park and Todai-ji Temple, then Osaka: Umeda Sky Building and the lights of Dotonbori.', RIHGA, 'Coach, day trip from Osaka', ALL3),
    D('A day at leisure in Osaka', 'A free day. Osaka Castle, Universal Studios Japan or Shinsaibashi are close by (optional, not included).', RIHGA, 'At leisure', ['Breakfast', 'Indian dinner']),
    D('Bullet train to Tokyo', 'The Shinkansen from Osaka to Tokyo, then the Ginza shopping district before check-in.', MERCURE, 'Shinkansen + coach', ALL3),
    D('Mt Fuji and Hakone', 'Mt Fuji 5th Station (weather permitting), the Lake Ashi pirate cruise, the Hakone Ropeway over Owakudani, and Gotemba Premium Outlets.', MERCURE, 'Coach, day trip from Tokyo', ALL3),
    D('Tokyo and the Skytree', 'Asakusa, Senso-ji and Nakamise Street, Tokyo Skytree (ticket included), Shibuya Crossing, Harajuku and Takeshita Street.', MERCURE, 'Coach', ALL3),
    D('Fly home', 'Check out and transfer to Tokyo Haneda for the flight to Delhi.', null, 'Airport transfer + flight', ['Breakfast']),
  ],
  'japan-sakura-explorer': [
    D('Arrive in Tokyo, TeamLab Planets', 'Met at the airport and checked in, then TeamLab Planets, the immersive digital art museum. Indian dinner.', SHINAGAWA, 'Flight + airport transfer', ['Indian dinner']),
    D('Tokyo in blossom', 'Ueno Park at cherry blossom time, Tokyo Skytree, a drive past the Imperial Palace and Tokyo Tower, and free time in Ginza.', SHINAGAWA, 'Coach', ALL3),
    D('Mt Fuji and Hakone', 'Mt Fuji 5th Station (weather permitting), a cruise on Lake Ashi and the ropeway over Owakudani, then on to Hamamatsu.', 'Grand Mercure Lake Hamana Resort & Spa or similar', 'Coach', ['Breakfast', 'Indian lunch', 'Dinner']),
    D('Kyoto, on to Osaka', 'A sushi-and-Indian lunch, Kiyomizu-dera and the wooden lanes of Gion, then Osaka.', FAIRFIELD, 'Coach', ALL3),
    D('Kyoto heritage', 'The Sagano Romantic Train, Arashiyama Bamboo Grove, the Kyoto Imperial Palace and the gates of Fushimi Inari.', FAIRFIELD, 'Coach + Sagano train', ALL3),
    D('Hiroshima by bullet train', 'The Shinkansen to Hiroshima for the Peace Memorial Museum and Hiroshima Castle, and back to Osaka.', FAIRFIELD, 'Shinkansen, return', ALL3),
    D('Nara and Osaka', 'Nara Park’s deer and Todai-ji, an Osaka Castle photo stop, then Shinsaibashi and Dotonbori. Overnight by Kansai airport.', 'Nikko Kansai Airport Hotel or similar', 'Coach', ALL3),
    D('Fly home', 'Walk across to Kansai International Airport for your flight home.', null, 'Flight', ['Breakfast']),
  ],
};

/* What the price covers: common to both packages in the sheet's inclusions. */
export const INCLUDED = [
  'Return economy flights',
  'Japan visa fees',
  '7 nights in well-appointed hotels',
  'Daily breakfast',
  'Indian lunches & dinners',
  'Airport & intercity transfers',
  'Shinkansen bullet train',
  'Guided sightseeing',
  'Mt Fuji, Lake Ashi & Hakone',
  'Entry tickets as listed',
  'Complimentary travel insurance',
  'GST & TCS',
];

export const NEVER = [
  'No exchange-rate impact',
  'No hidden charges',
  'No costly optional sightseeing',
];

/* EMI on the balance (what is left after the deposit).
   ⚠ PLACEHOLDER: tenures and the zero-interest maths are illustrative until
   the EMI partner's (Asigo, per the strategy deck) rates are signed off. */
export const EMI = {
  tenures: [3, 6, 9, 12],
  defaultTenure: 6,
  note: 'Indicative: the balance split evenly, before interest. Final rate and tenure are set by our EMI partner on approval.',
};

export const RATING = { overall: '4.9', count: '2,400+', google: '4.8', tripadvisor: '4.9' };

export const AWARDS = [
  { img: '/awards/accolades.jpg', title: "India's Favourite Tour Operator", by: "Condé Nast Traveller Readers' Travel Awards", years: '2016, 2017, 2022' },
  { img: '/awards/accolades-3.jpg', title: "Asia's Leading Luxury Tour Operator", by: 'World Travel Awards', years: '2015–2019' },
  { img: '/awards/accolades-2.jpg', title: 'PATA Gold Award', by: 'Pacific Asia Travel Association', years: '2015' },
  { img: '/awards/accolades-4.png', title: 'Best Luxury Travel Curator', by: "Travel + Leisure India's Best Awards", years: '2017' },
];

/* ⚠ PLACEHOLDER reviews, retagged to the two real packages. */
export const REVIEWS = [
  { name: 'Meera & Anil Kulkarni', city: 'Pune', tour: 'Japan Sakura Explorer', when: 'April 2026', photo: '1522547902298-51566e4fb383', text: 'We are both vegetarian and never once had to explain ourselves. The hotels were exactly the ones named in our itinerary.' },
  { name: 'Harpreet Sethi', city: 'Chandigarh', tour: "Japan's Cherry Blossom Trail", when: 'March 2026', photo: '1540959733332-eab4deabeeaf', text: 'The price we paid was the price. No dollar surprises at the counter, no “optional” tours on the bus.' },
  { name: 'Rajesh Jain', city: 'Ahmedabad', tour: 'Japan Sakura Explorer', when: 'April 2026', photo: '1528360983277-13d401cdc186', text: 'Jain meals, every single day, in Japan. Our tour manager had spoken to every restaurant before we arrived.' },
  { name: 'Ananya Reddy', city: 'Hyderabad', tour: "Japan's Cherry Blossom Trail", when: 'April 2026', photo: '1526481280693-3bfa7568e0f3', text: 'Four nights in one hotel in Osaka meant we actually unpacked. The bullet train was the kids’ favourite part.' },
  { name: 'Suresh Iyer', city: 'Bengaluru', tour: 'Japan Sakura Explorer', when: 'March 2026', photo: '1493976040374-85c8e12f0c0e', text: 'I booked for my parents, both past 70. Visa, insurance, the pace: all handled. They came home rested, not tired.' },
];
