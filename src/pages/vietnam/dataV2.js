/* ============================================================================
   dataV2.js: the data for /vietnam-group-tours-v2 (a copy of data.js taken
   2026-11-25, so v1 and v2 can change independently).

   Vietnam group tours (/vietnam-group-tours). The same lander as the Japan
   and Europe pages. Every number and every line of offer copy lives here.

   SOURCE OF TRUTH: the PM's product sheet (Google Sheet
   1aSUJAetAIHvmNbHhUfOUOBKNFUC37Ji2fbho0yP8F_w, tab gid 698108089, the one
   Vietnam row) and its live package page:
     · Vietnam From Heritage to Paradise
       coxandkings.com/private-tours/vietnam-from-heritage-to-paradise
   Name, price, offer, departure windows, departure cities, nights per city,
   inclusions, exclusions and highlights are the sheet's, word for word where
   the page prints them. Hotels and the day by day come from the live page's
   itinerary.

   ⚠ STILL TO CONFIRM BEFORE LAUNCH
   · NO BOOKING AMOUNT (PM, 2026-11-25): Vietnam is lead-form only. The one
     button on the page is "Talk to an Expert"; nothing is paid online.
   · STEAL DEAL: the sheet's "Flat 10% Off Rs 16000 (Limited Period Offer /
     Limited Discount Vouchers)". It is not online-only, and the sheet gives
     no end date or voucher count.
   · DEPARTURES: the sheet gives three date windows, not fixed dates, so the
     page lets people pick a date inside a window. No seat counts are shown.
   · REVIEWS: placeholder copy.
   · LEAD_URL: null, so the lead form shows its thank-you without sending
     anything. Set it to the CRM endpoint (POST, JSON body) before launch.
   ========================================================================== */

export const OFFER = {
  onlineDiscount: 16000,  // the sheet's Steal Deal: flat 10% off ₹1,60,000. Name kept for the shared campaign code.
  dealName: 'Steal Deal',
  dealPct: 10,
};

/* EMI (used by /vietnam-group-tours-v2 only). There is no booking amount,
   so the monthly figure is the Steal Deal price split evenly.
   ⚠ PLACEHOLDER: tenures and the zero-interest maths are illustrative, as on
   Japan v3, until the EMI partner's rates are signed off. */
export const EMI = {
  tenures: [3, 6, 9, 12],
  defaultTenure: 6,
  note: 'Indicative: the tour price split evenly, before interest. Final rate and tenure are set by our EMI partner on approval.',
};

/* One number for every WhatsApp link and the footer, as on Japan v2. */
export const WA_NUMBER = '918556001700';
export const LEAD_URL = null;
export const PHONE = { display: '+91 85560 01700', href: 'tel:+918556001700' };
export const EMAIL = 'holidays@coxandkings.com';

export const inr = (n) => '₹' + n.toLocaleString('en-IN');

export const waLink = (text) =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;

export const img = (id, w = 1400) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=78`;

const seatsFor = (key) => {
  let h = 2166136261;
  for (let i = 0; i < key.length; i += 1) h = Math.imul(h ^ key.charCodeAt(i), 16777619);
  return 3 + (Math.abs(h) % 6); // 3 to 8 seats left
};

const fmt = (iso, o) => new Date(`${iso}T00:00:00`).toLocaleDateString('en-IN', o);

/* A departure WINDOW: travel on any date from `iso` to `end`. `iso` is the
   first day so the shared campaign code (which reads d.iso) keeps working;
   it also reads d.end to know the last month. `seats` only feeds that code. */
const win = (tourId, iso, end, sold = false) => {
  const sameYear = iso.slice(0, 4) === end.slice(0, 4);
  return {
    id: `${tourId}-${iso}`,
    iso,
    end,
    from: fmt(iso, { day: 'numeric', month: 'short' }),
    to: fmt(end, { day: 'numeric', month: 'short' }),
    year: sameYear ? iso.slice(0, 4) : `${iso.slice(0, 4)}–${end.slice(2, 4)}`,
    label: `${fmt(iso, { day: 'numeric', month: 'short', ...(sameYear ? {} : { year: 'numeric' }) })} to ${fmt(end, { day: 'numeric', month: 'short', year: 'numeric' })}`,
    soldOut: sold || end < new Date().toISOString().slice(0, 10),
    seats: sold ? 0 : seatsFor(`${tourId}-${iso}`),
  };
};

/* The sheet's "Departure City": DEL, BOM, BLR, CCU. */
export const DEPARTURE_CITIES = ['Delhi', 'Mumbai', 'Bengaluru', 'Kolkata'];

export const TOURS = [
  {
    id: 'vietnam-from-heritage-to-paradise',
    name: 'Vietnam From Heritage to Paradise',
    nd: '8 Nights / 9 Days',
    price: 160000,
    tag: 'Steal Deal · 10% off',
    featured: true,
    blurb: 'Three nights on Phu Quoc, three in Da Nang with Hoi An and Ba Na Hills, then Hanoi and a day cruise on Ha Long Bay.',
    from: DEPARTURE_CITIES.join(', '),
    stops: [
      { city: 'Phu Quoc', nights: 3 },
      { city: 'Da Nang', nights: 3 },
      { city: 'Hoi An', nights: 0 },
      { city: 'Hanoi', nights: 2 },
      { city: 'Ha Long Bay', nights: 0, lp: [1, 1.1, 'start'] },
    ],
    /* The sheet's "Experiences/Key Highlights", verbatim. */
    highlights: [
      'Phu Quoc Island Hopping with Hon Thom Cable Car & Aquatopia Water Park',
      'Vinpearl Safari, Vin Wonders Theme Park & Grand World',
      'Da Nang City Tour, Marble Mountain & Linh Ung Pagoda',
      'Cam Thanh Coconut Village Basket Boat Experience',
      'Hoi An Ancient Town & Lantern Boat Ride',
      'Ba Na Hills Cable Car & Iconic Golden Bridge',
      'Hanoi Old Quarter, Hoan Kiem Lake & Train Street',
      'Full-Day Halong Bay Cruise with Kayaking, Cave Visits & Buffet Lunch',
    ],
    flights: {
      out: `${DEPARTURE_CITIES.join(', ')} to Phu Quoc, return economy class`,
      back: 'Phu Quoc to Da Nang and Da Nang to Hanoi on domestic flights, then Hanoi home',
    },
    image: '1564596823821-79b97151055e',
    alt: 'The Golden Bridge held up by two giant stone hands above the forest at Ba Na Hills',
    /* The sheet's "Departures": (21st Nov 26 to 19th Dec 26 & 6th Jan 27 to
       31st Jan 27 & 16th Feb 27 to 30th Nov 27). */
    deps: [
      win('vietnam-from-heritage-to-paradise', '2026-11-21', '2026-12-19'),
      /* ⚠ DUMMY: not on the sheet. Two sold-out windows in the sheet's gaps
         (Christmas–New Year and early Feb), to show what a full window looks
         like. Remove before launch. */
      win('vietnam-from-heritage-to-paradise', '2026-12-20', '2027-01-05', true),
      win('vietnam-from-heritage-to-paradise', '2027-01-06', '2027-01-31'),
      win('vietnam-from-heritage-to-paradise', '2027-02-01', '2027-02-15', true),
      win('vietnam-from-heritage-to-paradise', '2027-02-16', '2027-11-30'),
    ],
    url: 'https://coxandkings.com/private-tours/vietnam-from-heritage-to-paradise',
  },
];

/* Hotels, from the live package page. All are "or similar". */
export const HOTELS = {
  'Phu Quoc': 'Maison du Vietnam Resort & Spa or similar',
  'Da Nang': 'Angel Beach Hotel or similar',
  Hanoi: 'Super Candle or similar',
};

/* Day by day, condensed from the live package page. `stay` is a HOTELS key;
   meals are as that page lists them (B = breakfast, L = lunch, D = dinner). */
const D = (t, d, stay, travel, meals) => ({ t, d, stay, travel, meals });

export const ITINERARIES = {
  'vietnam-from-heritage-to-paradise': [
    D('Arrive in Phu Quoc', 'Met at Phu Quoc airport and taken to your hotel for lunch and time at your own pace. In the evening, the Sunset Sonata Beach Club with one drink, then Sunset Town (two-way transfer included).', 'Phu Quoc', 'Flight + airport transfer', 'L D'),
    D('Island hopping, Hon Thom cable car & Aquatopia', 'A pearl showroom, then a speedboat round Coral Park, May Rut and Mong Tay islands to swim, and Dua, Roi and Nom islands for their coral reefs, with a buffet lunch. The world’s longest sea-crossing cable car takes you to Hon Thom for Aquatopia Water Park, the Theme Park and the beach.', 'Phu Quoc', 'Shuttle + speedboat + cable car', 'B L D'),
    D('Vinpearl Safari, VinWonders & Grand World', 'A walk through the open zoo at Vinpearl Safari, then lunch and an afternoon at VinWonders: Fantasy World, the Viking Village, Adventure World, the water park and the aquarium. In the evening, Grand World, “the sleepless city”, along its Venice River.', 'Phu Quoc', 'Shuttle', 'B L D'),
    D('Fly to Da Nang, city tour & Marble Mountains', 'A flight to Da Nang, then Han Bridge and Dragon Bridge, Linh Ung Pagoda on the Son Tra peninsula, My Khe Beach and the Marble Mountains with the lift, and Han Market if time allows.', 'Da Nang', 'Domestic flight + coach', 'B L D'),
    D('Basket boats & Hoi An by lantern light', 'A free morning, then a basket boat through the water-coconut forest of Cam Thanh village. In the early evening, a walk through Hoi An’s UNESCO-listed Ancient Town to the Japanese Covered Bridge, and a lantern boat ride.', 'Da Nang', 'Coach + basket boat', 'B L D'),
    D('Ba Na Hills & the Golden Bridge', 'The cable car up Ba Na Hills, past the Old French Villas to Nui Chua peak, the Orchid Garden and the Golden Bridge. The afternoon is for Fantasy Park, then back to Da Nang.', 'Da Nang', 'Coach + cable car', 'B L D'),
    D('Fly to Hanoi, city tour', 'A flight to Hanoi. In the afternoon, a photo stop at the Ho Chi Minh Mausoleum, Tran Quoc Pagoda, Hoan Kiem Lake and the Old Quarter, and coffee on Train Street (subject to train timings).', 'Hanoi', 'Domestic flight + coach', 'B L D'),
    D('Ha Long Bay day cruise', 'A drive to Tuan Chau and five hours among the karsts: Surprising Cave, kayaking or a bamboo boat through Luon Cave, and the climb up Titov Island, with an international buffet lunch on board. Back to Hanoi in the evening.', 'Hanoi', 'Coach + cruise', 'B L D'),
    D('Fly home', 'Breakfast and check-out, then a transfer to Noi Bai airport for your flight home.', null, 'Airport transfer + flight', 'B'),
  ],
};

/* The sheet's "Inclusions", verbatim, in its order. Shown in full in the
   package popup. */
export const INCLUSIONS = [
  'Return Economy Class Airfare',
  'Domestic Airfare Included',
  'Vietnam Visa Fees Included',
  '08 Nights Accommodation in well-appointed Hotels.',
  'Daily Continental Breakfast',
  'Daily Lunches and Dinners as mentioned in the itinerary',
  'Arrival and Departure Airport Transfers',
  'All Sightseeing and Transfers on Seat-in-Coach (SIC) Basis with Guide as mentioned in the itinerary',
  'Full-Day Phu Quoc Island Hopping Tour with Speedboat',
  'Fly Cam Photography Experience',
  'Two-Way Hon Thom Cable Car Ride',
  'Aquatopia Water Park',
  'Theme Park Experience at Hon Thom',
  'Buffet Lunch during the Island Tour',
  'Visit to Sunset Town and Sunset Sonata Beach Club with One Drink',
  'Full-Day Vinpearl Safari and VinWonders Theme Park',
  'Visit to Grand World Phu Quoc',
  'Half-Day Danang City Tour',
  'Visit to Marble Mountains with Lift',
  'Visit to Linh Ung Pagoda',
  'Visit to Han Bridge and Dragon Bridge',
  'Visit to My Khe Beach',
  'Visit to Han Market, time permitting',
  'Coconut Village Tour with Basket Boat Experience',
  'Hoi An Ancient Town Tour',
  'Lantern Boat Ride in Hoi An',
  'Full-Day Ba Na Hills Tour',
  'Two-Way Ba Na Hills Cable Car Ride',
  'Golden Bridge Visit',
  'Fantasy Park at Ba Na Hills',
  'Half-Day Hanoi City Tour',
  'Visit to Hoan Kiem Lake and Hanoi Old Quarter',
  'Train Street Visit with Coffee, subject to train timings',
  'Full-Day Halong Bay Cruise',
  'Visit to Surprising Cave',
  'Luon Cave Experience by Kayaking or Bamboo Boat',
  'Visit to Titov Island',
  'International Buffet Lunch during Halong Bay Cruise',
  'Complimentary Travel Insurance',
  'GST and TCS Included',
];

/* The sheet's "Exclusions", verbatim. */
export const EXCLUSIONS = [
  'Meals not mentioned in the itinerary',
  'Personal expenses including laundry, beverages, porterage and tips',
  'Optional sightseeing and activities',
  'Early check-in and late check-out',
  'Expenses due to weather or operational changes',
  'Anything not specifically mentioned under Package Inclusions',
];

/* The price-ticket summary of INCLUSIONS above: every line maps to one or
   more sheet inclusions, nothing added. The icons are in the jsx, same order. */
export const INCLUDED = [
  'Return economy flights',
  'Domestic flights',
  'Vietnam visa fees',
  '8 nights in well-appointed hotels',
  'Daily breakfast',
  'Lunches & dinners as per itinerary',
  'Airport transfers',
  'Sightseeing with a guide (SIC)',
  'Island hopping & Ha Long Bay cruise',
  'Cable cars, theme parks & Golden Bridge',
  'Fly Cam photography',
  'Complimentary travel insurance',
  'GST & TCS',
];

export const NEVER = [
  'No exchange-rate impact',
  'No hidden charges',
];

/* Ratings: the same figures the homepage, /testimonials and the Thailand
   lander print (Testimonials.jsx PLATFORMS). Change them there and here together. */
export const RATING = { overall: '4.9', count: '2,400+', google: '4.8', tripadvisor: '4.9' };

/* Accolades: verbatim from /press-media and /testimonials, same emblems. */
export const AWARDS = [
  { img: '/awards/accolades.jpg', title: "India's Favourite Tour Operator", by: "Condé Nast Traveller Readers' Travel Awards", years: '2016, 2017, 2022' },
  { img: '/awards/accolades-3.jpg', title: "Asia's Leading Luxury Tour Operator", by: 'World Travel Awards', years: '2015–2019' },
  { img: '/awards/accolades-2.jpg', title: 'PATA Gold Award', by: 'Pacific Asia Travel Association', years: '2015' },
  { img: '/awards/accolades-4.png', title: 'Best Luxury Travel Curator', by: "Travel + Leisure India's Best Awards", years: '2017' },
];

/* ⚠ PLACEHOLDER reviews: see the header note. They only mention things the
   real package includes. `photo` is an Unsplash id. */
const TOUR_NAME = 'Vietnam From Heritage to Paradise';
export const REVIEWS = [
  { name: 'Sneha & Vikram Joshi', city: 'Pune', tour: TOUR_NAME, when: 'March 2026', photo: '1559592413-7cec4d0cae2b', text: 'The Golden Bridge in the morning mist, then Hoi An by lantern light the evening before. Nine days and not one thing we had to arrange ourselves.' },
  { name: 'Harpreet Sandhu', city: 'Amritsar', tour: TOUR_NAME, when: 'April 2026', photo: '1528127269322-539801943592', text: 'The Ha Long Bay cruise was the best day of the trip. Kayaking through Luon Cave, then lunch on deck between the karsts.' },
  { name: 'Meena Iyer', city: 'Bengaluru', tour: TOUR_NAME, when: 'February 2026', photo: '1504457047772-27faf1c00561', text: 'Three days on Phu Quoc to start, island hopping and the cable car to Hon Thom. My mother, who is 71, never once felt rushed.' },
  { name: 'Aditya Rao', city: 'Hyderabad', tour: TOUR_NAME, when: 'March 2026', photo: '1583417319070-4a69db38a482', text: 'The price we saw was the price we paid. Visa fees, both domestic flights, the cable cars and the theme parks: all of it already included.' },
  { name: 'Farah Siddiqui', city: 'Lucknow', tour: TOUR_NAME, when: 'February 2026', photo: '1555921015-5532091f6026', text: 'Hanoi’s Old Quarter felt overwhelming for about ten minutes, until our guide took over. Coffee on Train Street was a highlight for the kids.' },
];
