/* ============================================================
   v3content.js — single source of content for the revamped
   /final3 + /final3a pages. Keeps copy, prices (in ₹), and
   imagery consistent across every v3 section component.

   Imagery is Unsplash (placeholder) — swap for licensed brand
   photography before launch. Helper `img()` keeps request sizes sane.
   ============================================================ */

/* Destination sentinel for "open the schedule-a-call dialog" rather than
   "navigate to a page" — there is no /contact page. Lives here, not in the
   component, so content data can reference it without importing UI (and
   ScheduleCall.jsx, which reads CONTACT below, would otherwise be circular).
   Consumed by <SmartLink to={…}> in components/ScheduleCall.jsx. */
export const CALLBACK = '#schedule-call';

export const img = (url, w = 1100) =>
  `${url}${url.includes('?') ? '&' : '?'}auto=format&fit=crop&w=${w}&q=80`;

/* ---- Brand contact (concierge cues, reused in CTAs) ---- */
export const CONTACT = {
  phoneDisplay: '+91 22 6911 1700',
  phoneHref: 'tel:+912269111700',
  whatsappDisplay: 'WhatsApp us',
  whatsappHref: 'https://wa.me/912269111700',
  email: 'journeys@coxandkings.com',
  replyPromise: 'A destination specialist replies within 24 hours.',
};

/* ---- Trust stats (Section 3 / hero strip) ---- */
export const STATS = [
  { value: '260+ years', label: 'of travel heritage, since 1758' },
  { value: '1M+ travellers', label: 'guided across the world' },
  { value: '70% return', label: 'of our guests travel with us again' },
  { value: '90% visa success', label: 'paperwork handled end to end' },
];

export const RATING = { score: '4.7', count: '2,400+', stars: 5 };

export const ASSOCIATIONS = ['IATA', 'TAAI', 'ASTA'];
export const PRESS = [
  'Condé Nast Traveller',
  'Travel + Leisure',
  'National Geographic',
  'Forbes',
  'The Times',
  'Outlook Traveller',
];

/* ---- 4-Path router (Section 2) ---- */
export const PATHS = [
  {
    title: 'Travel in a Group',
    desc: 'Premium escorted tours led by an expert manager — fixed departures, everything handled, fine company along the way.',
    cta: 'Explore Group Tours',
    to: '/tours',
    accent: false,
  },
  {
    title: 'Design It Around You',
    desc: 'A bespoke private holiday shaped one-to-one with a destination specialist. Your pace, your people, your way.',
    cta: 'Design a Bespoke Holiday',
    to: CALLBACK,
    accent: false,
  },
  {
    title: 'Help Me Decide',
    desc: 'Not sure yet? Answer a few quick questions and we’ll match you to the right journey — and the right expert.',
    cta: 'Find My Perfect Trip',
    to: '#v3-plan',
    accent: true,
  },
  {
    title: 'Just Talk to Someone',
    desc: 'Skip the browsing. Speak to a real travel expert who’ll plan it with you — by phone or WhatsApp.',
    cta: 'Talk to an Expert',
    to: CALLBACK,
    accent: false,
  },
];

/* ---- Strongest destinations (Section 4) ---- */
export const DESTINATIONS = [
  { name: 'Switzerland', hook: 'Glacier trains & lakeside towns', priceFrom: '₹2,45,000', image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99', span: 'tall' },
  { name: 'Japan', hook: 'Cherry blossom, bullet trains, ryokans', priceFrom: '₹2,60,000', image: 'https://images.unsplash.com/photo-1492571350019-22de08371fd3', span: 'wide' },
  { name: 'Italy', hook: 'Amalfi, Tuscany & the lakes', priceFrom: '₹1,95,000', image: 'https://images.unsplash.com/photo-1534445867742-43195f401b6c', span: 'normal' },
  { name: 'Scandinavia & the Northern Lights', hook: 'Arctic skies, fjord nights', priceFrom: '₹2,85,000', image: 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73', span: 'normal' },
  { name: 'Australia & New Zealand', hook: 'Reef, road trips & family time', priceFrom: '₹3,40,000', image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9', span: 'wide' },
  { name: 'USA', hook: 'Coast to coast, the great parks', priceFrom: '₹2,20,000', image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29', span: 'normal' },
  { name: 'Southeast Asia', hook: 'Islands, temples & street food', priceFrom: '₹95,000', image: 'https://images.unsplash.com/photo-1528181304800-259b08848526', span: 'tall' },
  { name: 'Maldives', hook: 'Overwater calm', priceFrom: '₹1,40,000', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8', span: 'normal' },
  { name: 'Africa Safaris', hook: 'The Great Migration, up close', priceFrom: '₹3,10,000', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801', span: 'wide' },
  { name: 'Grand Europe', hook: 'Many countries, one seamless journey', priceFrom: '₹1,85,000', image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b', span: 'normal' },
];

/* ---- How We Travel (Section 5) ---- */
export const WAYS = [
  { key: 'group', size: 'large', title: 'Escorted Group Tours', desc: 'Travel in fine company with an expert tour manager who handles every detail. Premium hotels, paced for comfort, Indian meals on request.', cta: 'Explore Group Tours', to: '/tours', image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828' },
  { key: 'bespoke', size: 'large', title: 'Bespoke Private Holidays', desc: 'Your itinerary, your pace, designed one-to-one with a destination specialist. Nothing off-the-shelf.', cta: 'Design a Bespoke Holiday', to: CALLBACK, image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800' },
  { key: 'luxury', size: 'small', title: 'Luxury Journeys', desc: 'The finest stays, private guides and exclusive access in the world’s most extraordinary places.', cta: 'Explore Luxury', to: '/tours', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b' },
  { key: 'family', size: 'small', title: 'Special Interest & Family', desc: 'Honeymoons, multi-gen family trips, safaris and cruises — built around the people travelling.', cta: 'Find My Trip', to: '#v3-plan', image: 'https://images.unsplash.com/photo-1602002418082-a4443e081dd1' },
];

/* ---- The Cox & Kings Difference (Section 6) ---- */
export const DIFFERENCE = [
  { title: 'Specialists, not salespeople', body: 'Your trip is shaped by someone who has actually walked it. Destination specialists and seasoned tour managers, not a booking desk.' },
  { title: 'Everything, handled', body: 'Flights, visas, hotels, transfers, insurance and experiences — coordinated end to end. One team, one point of contact.' },
  { title: 'Looked after, all the way', body: 'Concierge planning before you go and real on-trip support after you land — including a WhatsApp line to your team.' },
];
export const ASSURANCE = [
  'Expert-guided journeys',
  'Indian & dietary meals on request',
  'Multi-generational family travel',
  'Visa support · 90% success',
];

/* ---- Editorial desire module (Section 7) ---- */
export const JOURNEYS = [
  { title: 'Cherry Blossom Japan', blurb: 'Two weeks, one fleeting bloom — Tokyo neon to Kyoto temple gardens, timed to the petals.', season: 'Mar–Apr', nights: '13 nights', priceFrom: '₹2,95,000', lead: true, image: 'https://images.unsplash.com/photo-1522383225653-ed111181a951' },
  { title: 'Chasing the Northern Lights', blurb: 'Arctic Scandinavia after dark', season: 'Oct–Mar', nights: '7 nights', priceFrom: '₹2,75,000', image: 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73' },
  { title: 'Grand Europe', blurb: 'Many countries, one effortless journey', season: 'Apr–Sep', nights: '15 nights', priceFrom: '₹1,85,000', image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b' },
  { title: 'New Zealand by Road', blurb: 'The South Island, end to end', season: 'Oct–Apr', nights: '12 nights', priceFrom: '₹3,20,000', image: 'https://images.unsplash.com/photo-1469521669194-babb45599def' },
  { title: 'African Safari', blurb: 'The Great Migration season', season: 'Jul–Oct', nights: '8 nights', priceFrom: '₹3,10,000', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801' },
  { title: 'European Christmas Markets', blurb: 'Mulled wine & old-town lights', season: 'Dec', nights: '9 nights', priceFrom: '₹1,70,000', image: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e' },
  { title: 'Summer in Switzerland', blurb: 'Glacier trains & alpine lakes', season: 'Jun–Sep', nights: '10 nights', priceFrom: '₹2,45,000', image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99' },
  { title: 'Australia for Families', blurb: 'Reef, beaches & easy days', season: 'Year-round', nights: '14 nights', priceFrom: '₹3,40,000', image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9' },
];

/* ---- Proof / reviews (Section 8) ---- */
export const REVIEWS = [
  { name: 'Anjali & Rohan Mehta', location: 'Mumbai', tour: 'Switzerland & Italy, escorted', rating: 5, text: 'Three generations, one trip, zero stress. The pace was gentle enough for my in-laws and exciting for the kids. Our tour manager felt like family by day three.', avatar: 'https://images.unsplash.com/photo-1545167622-3a6ac756afa4', tripPhoto: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99' },
  { name: 'Suresh Iyer', location: 'Bengaluru', tour: 'Cherry Blossom Japan', rating: 5, text: 'I booked for my parents, both 70+. Vegetarian meals were arranged in advance, the hotels were central, and someone was always a WhatsApp away. Worth every rupee.', avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d', tripPhoto: 'https://images.unsplash.com/photo-1492571350019-22de08371fd3' },
  { name: 'Priya Nair', location: 'Delhi', tour: 'Bespoke honeymoon, Maldives & Sri Lanka', rating: 5, text: 'Not a package — genuinely ours. They listened, suggested things we’d never have found, and the whole thing just flowed. The most relaxed I’ve been on a holiday.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80', tripPhoto: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8' },
  { name: 'The Kapoor Family', location: 'Pune', tour: 'Australia & New Zealand', rating: 5, text: 'Our fourth trip with Cox & Kings and the reason we keep coming back: nothing is left to chance. Visas, flights, transfers — all handled. We just showed up and travelled.', avatar: 'https://images.unsplash.com/photo-1552058544-f2b08422138a', tripPhoto: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9' },
];

/* Short-form vertical "reels" for discovery — YouTube-Shorts-style. */
export const REELS = [
  { id: 'r1', title: 'Sunrise over the Matterhorn', place: 'Zermatt, Switzerland', tag: 'Alps', views: '128K', poster: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7' },
  { id: 'r2', title: 'Cherry blossoms in Kyoto', place: 'Kyoto, Japan', tag: 'Japan', views: '241K', poster: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e' },
  { id: 'r3', title: 'Northern Lights, live', place: 'Tromsø, Norway', tag: 'Arctic', views: '317K', poster: 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73' },
  { id: 'r4', title: 'Overwater at golden hour', place: 'Maldives', tag: 'Islands', views: '198K', poster: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8' },
  { id: 'r5', title: 'The Great Migration', place: 'Maasai Mara, Kenya', tag: 'Safari', views: '276K', poster: 'https://images.unsplash.com/photo-1516426122078-c23e76319801' },
  { id: 'r6', title: 'Amalfi from the water', place: 'Amalfi Coast, Italy', tag: 'Italy', views: '154K', poster: 'https://images.unsplash.com/photo-1534445867742-43195f401b6c' },
];

/* ---- Expert-recommended curations (Section 10) ---- */
export const CURATIONS = [
  { category: 'Escorted Group Tour', name: 'Grand Switzerland & Italy', duration: '13 days', departs: 'Departs Apr–Sep 2026', specialist: 'Meera Sundaram', note: 'Lakeside Lucerne, the Matterhorn, then Venice to Rome — paced so you actually savour it.', priceFrom: '₹2,45,000', image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99' },
  { category: 'Bespoke Private', name: 'Japan for First-Timers', duration: '11 days', departs: 'Any date you choose', specialist: 'Arjun Rao', note: 'Tokyo, Hakone, Kyoto with a private guide and a night in a traditional ryokan.', priceFrom: '₹3,10,000', image: 'https://images.unsplash.com/photo-1492571350019-22de08371fd3' },
  { category: 'Family', name: 'Australia & New Zealand', duration: '15 days', departs: 'Departs in school holidays', specialist: 'Nisha Verma', note: 'Reef snorkelling, Rotorua and the South Island — easy days built for all ages.', priceFrom: '₹3,75,000', image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9' },
  { category: 'Luxury', name: 'Kenya Migration Safari', duration: '8 days', departs: 'Departs Jul–Oct 2026', specialist: 'David Okello', note: 'Private conservancy camps in the Maasai Mara, timed to the Great Migration.', priceFrom: '₹4,20,000', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801' },
];

/* ---- Expert specialists (used by Difference / Curations human cues) ---- */
export const EXPERTS = [
  { name: 'Meera Sundaram', region: 'Europe specialist', years: '18 years', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2' },
  { name: 'Arjun Rao', region: 'Japan & East Asia specialist', years: '12 years', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d' },
  { name: 'Nisha Verma', region: 'Australasia & family travel', years: '14 years', photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956' },
];

/* ---- Hero directed-search suggestion lists (Variant A2) ---- */
export const HERO_DESTINATIONS = ['Switzerland', 'Japan', 'Northern Lights', 'Italy', 'Australia', 'Maldives', 'African Safari'];
export const HERO_TRIP_TYPES = ['Group Tour', 'Bespoke Private', 'Luxury', 'Family', 'Honeymoon', 'Safari', 'Cruise'];
export const HERO_WHEN = ['Anytime', 'Next 3 months', 'In season now', '2027 & beyond'];

/* ---- Hero rotating background images ---- */
export const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99',
  'https://images.unsplash.com/photo-1522383225653-ed111181a951',
  'https://images.unsplash.com/photo-1516426122078-c23e76319801',
];
