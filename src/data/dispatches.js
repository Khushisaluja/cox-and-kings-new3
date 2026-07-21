/* ============================================================================
   Dispatches — the Cox & Kings journal.

   The corpus behind /inspiration (the index) and /inspiration/:slug (the
   reading page). Both import from here, so a piece cannot exist on one and
   not the other.

   THE WRITERS ARE FICTIONAL, exactly as src/data/team.js is fictional —
   invented names, desks and bios over stock portraits. The one real person at
   Cox & Kings India is Karan Agarwal (Director), and he is deliberately given
   no byline here. The pieces themselves are written to be plausible editorial,
   not to be true: every date, forecast and claim in them is invented. Replace
   the writers, the photography and the copy with the real thing before any of
   this goes near production.

   Shape of a post:
     slug   — the URL, /inspiration/<slug>
     n      — folio number, the order the journal was filed in
     cat    — the desk it is filed to (must be one of CATS)
     title  — headline. `em` marks the word the display type italicises.
     deck   — the standfirst. Carries the whole piece on the index.
     by     — writer id
     date / dateLabel — machine + human
     read   — minutes, honest to the body length
     photo  — Unsplash id (bare, without the `photo-` prefix)
     credit — the caption under the plate
     body   — paragraphs. A string is prose; { quote } is a pull-quote.
     cta    — where the piece sends a reader who now wants the trip
   ========================================================================== */

/* The bespoke path is a conversation, not a page: every "design it around me"
   CTA on this site resolves to the schedule-a-callback dialog. CALLBACK is the
   sentinel <SmartLink> watches for, and it lives in the data layer already. */
import { CALLBACK } from './v3content';

export const CATS = ['Destinations', 'Culture', 'Food', 'The Art of Travel', 'Heritage'];

export const WRITERS = [
  {
    id: '01',
    name: 'Aditi Ramesh',
    desk: 'Japan & East Asia',
    photo: '1573496359142-b8d87734a5a2',
    bio: 'Fifteen springs spent watching the blossom front move north. Writes the forecasts our Japan departures are built on.',
  },
  {
    id: '02',
    name: 'Farhan Sheikh',
    desk: 'Europe & the Alps',
    photo: '1507003211169-0a1dd7228f2d',
    bio: 'Knows which Swiss trains have a window that opens, and which side of the carriage to sit on. Has opinions about both.',
  },
  {
    id: '03',
    name: 'Zoya Mirza',
    desk: 'Food & the table',
    photo: '1580489944761-15a19d654956',
    bio: 'Books the counters that do not take bookings. Most of this job is patience and a phone call at the right hour.',
  },
  {
    id: '04',
    name: 'Leela Nambiar',
    desk: 'India & the subcontinent',
    photo: '1494790108377-be9c29b29330',
    bio: 'Argues, professionally, that the most under-travelled country on our list is the one most of our travellers live in.',
  },
  {
    id: '05',
    name: 'Sanjay Pillai',
    desk: 'Africa & the safari desk',
    photo: '1506794778202-cad84cf45f1d',
    bio: 'Twenty-two seasons in the Mara and the Serengeti. Will tell you the truth about what you are likely to see.',
  },
  {
    id: '06',
    name: 'Ishaan Kapoor',
    desk: 'The Arctic & the far north',
    photo: '1618306842557-a2515acf2112',
    bio: 'Chases a light that cannot be promised — and is careful, in print and on the phone, never to promise it.',
  },
];

export const WRITER_BY_ID = Object.fromEntries(WRITERS.map((w) => [w.id, w]));

export const POSTS = [
  /* ---------------------------------------------------------------- LEAD */
  {
    slug: 'blossom-arithmetic',
    n: '01',
    cat: 'Destinations',
    lead: true,
    title: 'Where the cherry trees keep time',
    em: 'keep time',
    deck: 'The blossom front climbs Japan at roughly twenty-five kilometres a day, and it does not care when your leave was approved. Planning a trip around it is less romance than arithmetic — thirty years of bloom dates, an elevation map, and a willingness to move a hotel by four days.',
    by: '01',
    date: '2026-07-02',
    dateLabel: '2 July 2026',
    read: 9,
    photo: '1490806843957-31f4c9a91c65',
    credit: 'Mount Fuji from Lake Kawaguchi — the front, mid-climb',
    cta: { label: 'See the Japan journeys', to: '/journeys4?where=Japan' },
    body: [
      'The blossom does not open across Japan. It opens in Kyushu, in the warm south, and then it climbs — north and uphill, at something close to twenty-five kilometres a day, following a temperature line rather than a calendar. By the time it reaches Hokkaido, six weeks have passed and the south has been green for a month. There is no week in which Japan is in blossom. There is only a week in which a particular place is.',
      'This is the whole problem, and it is an arithmetic problem. A bloom date is a function of the winter that preceded it: a cold January advances the flowering, a mild February delays it, and the difference between the two, in Kyoto, is about nine days. Nine days is the entire window. Full bloom lasts roughly a week from the first open flowers, and the petals fall within three days of a rain.',
      { quote: 'There is no week in which Japan is in blossom. There is only a week in which a particular place is.' },
      'So we do not sell you “cherry blossom season”. We look at thirty years of records for the specific parks on your specific itinerary, we watch the Japan Meteorological Corporation forecasts from mid-January, and we build the trip with the slack to absorb being wrong — a Kyoto stay that can move four days without losing the ryokan, a Hakone leg that works in rain, an Alpine Route day that can be swapped for Nara.',
      'And if your dates are fixed by school holidays, or by the one week your office will release you, we will tell you what those dates are actually likely to give you. Sometimes the honest answer is that you will see the tail of the front in Tokyo and the front itself two hundred kilometres north, and that the trip is still worth taking — the parks are quieter, the petals are on the water, and there is a particular kind of light in the week after. Sometimes the honest answer is: go in November instead, for the maples.',
    ],
  },

  /* ---------------------------------------------------- NEW THIS MONTH */
  {
    slug: 'eight-minutes-at-shibuya',
    n: '02',
    cat: 'Culture',
    title: 'Eight minutes at Shibuya',
    em: 'Shibuya',
    deck: 'What a crossing of three thousand people tells you about a country that never once touches you.',
    by: '01',
    date: '2026-06-28',
    dateLabel: '28 June 2026',
    read: 6,
    photo: '1540959733332-eab4deabeeaf',
    credit: 'Shibuya Scramble, Tokyo — the 19:40 cycle',
    cta: { label: 'See the Japan journeys', to: '/journeys4?where=Japan' },
    body: [
      'Stand at the Hachiko exit for eight minutes and you will watch the light cycle four times. Each cycle releases something like three thousand people into an intersection from five directions at once, and each cycle they cross without a single collision, without a raised voice, and — this is the part that takes a while to notice — without anyone touching anyone.',
      'It is not politeness, exactly. It is a very large number of people each solving a small navigation problem with an unreasonable amount of care, and doing it so consistently that the whole thing looks choreographed from above. Every tourist films it from the Starbucks window. Almost none of them stand in it.',
      'Stand in it. Go at 19:40 on a weekday, when the office crowd and the evening crowd overlap. Do not try to walk fast, and do not try to hold a line. Let the crowd have the decision. You will get across, and somewhere in the middle of the road you will understand something about Japan that no shrine visit will teach you.',
      'Then go and have a drink in Nonbei Yokocho, the alley of six-seat bars two minutes east, where the same country is doing the exact opposite thing at very close quarters.',
    ],
  },
  {
    slug: 'the-chef-who-will-not-take-your-booking',
    n: '03',
    cat: 'Food',
    title: 'The chef who will not take your booking',
    em: 'not',
    deck: 'Kyoto’s best counters seat eight, answer to no website, and are not being difficult. Here is what it actually takes.',
    by: '03',
    date: '2026-06-24',
    dateLabel: '24 June 2026',
    read: 7,
    photo: '1528360983277-13d401cdc186',
    credit: 'A kappo counter, Gion — eight seats, one sitting',
    cta: { label: 'A tailor-made Japan trip', to: CALLBACK },
    body: [
      'There is a counter in Gion with eight seats and one sitting a night. It has no website, no email, and a phone that is answered between 15:00 and 16:00 only. It does not take a booking from anyone it has not cooked for, or anyone vouched for by someone it has cooked for. Every year, a few travellers find this out and conclude the place is rude.',
      'It is not rude. It is eight seats. A counter that size cannot absorb a no-show — one empty stool is twelve per cent of the night’s revenue and a portion of fish bought that morning at auction, for you, that now goes in the bin. The introduction system is not exclusivity. It is a credit check.',
      { quote: 'The introduction system is not exclusivity. It is a credit check.' },
      'What that means for a trip is unglamorous. It means our Kyoto fixer calls at 15:10 on the day the book opens, in Japanese, having eaten there. It means we give the chef a dietary brief three weeks out, not on the night, because the menu is bought before you arrive. It means that if you cancel inside 48 hours, we pay — and we tell you that up front.',
      'And it means that for every counter we can get you into, there is one we cannot, and we will say so rather than substitute something with a similar photograph. The eight-seat counter is worth the trouble. It is not worth lying to you about.',
    ],
  },
  {
    slug: 'a-slow-line-through-the-alps',
    n: '04',
    cat: 'Destinations',
    title: 'A slow line through the Alps',
    em: 'slow',
    deck: 'The Glacier Express is billed as the world’s slowest express train. That is the entire point, and most people miss it.',
    by: '02',
    date: '2026-06-19',
    dateLabel: '19 June 2026',
    read: 8,
    photo: '1530122037265-a5f1f91d3b99',
    credit: 'The Oberalp Pass, Graubünden — 2,033 metres',
    cta: { label: 'See the Switzerland journeys', to: '/journeys4?where=Switzerland' },
    body: [
      'Eight hours to cover 291 kilometres. A car would do it in four, and the road is beautiful too. So the train is not transport, and pretending otherwise is how people end up disappointed by it — they board expecting a spectacle, get four hours of quite ordinary valley, and check their phones through the part that matters.',
      'The part that matters is the middle. The line climbs to the Oberalp Pass at 2,033 metres, and does it on a rack railway, because the gradient beats adhesion. You feel the cogs engage. The valley narrows, the trees stop, and for about forty minutes you are somewhere that has no road and no reason to have a railway at all.',
      'Two practical things. First: the panoramic carriages have sealed windows, which is wonderful for looking and useless for photographing — the glass has a tint and a curve, and everything comes back blue and warped. If the pictures matter to you, take the ordinary first-class carriage with the windows that drop, and accept that you will be cold.',
      'Second: do not do the whole route in one day. Break it at Chur or Andermatt, sleep, and take the good half fresh. The train is not the achievement. The pass is.',
    ],
  },
  {
    slug: 'the-dark-is-the-destination',
    n: '05',
    cat: 'Destinations',
    title: 'The dark is the destination',
    em: 'dark',
    deck: 'Nobody can promise you the aurora. What a good Arctic itinerary can promise is more nights, and better odds.',
    by: '06',
    date: '2026-06-14',
    dateLabel: '14 June 2026',
    read: 6,
    photo: '1483347756197-71ef80e95f73',
    credit: 'Outside Tromsø, 69°N — a KP 3 night',
    cta: { label: 'See the Northern Lights journeys', to: '/journeys4?where=Northern Lights' },
    body: [
      'Every brochure photograph of the northern lights was taken on a good night, with a long exposure, by someone who was there for a week. Your eye does not see that. On a moderate night the aurora is a pale grey-green arc that a camera renders in colours you did not witness, and travellers who were sold the photograph feel cheated by the sky.',
      'So here is the arithmetic instead. The lights are there most nights — the sun does not stop. What varies is whether you can see them: cloud, moon, light pollution, and the strength of the geomagnetic activity. Cloud is the enemy, not the aurora. On a three-night trip in Tromsø your odds of at least one clear, active night are roughly one in two. On a six-night trip they are closer to nine in ten.',
      { quote: 'Cloud is the enemy, not the aurora. The lights are almost always there.' },
      'That is the whole design principle of an Arctic itinerary: buy nights, and buy mobility. A chase vehicle that will drive two hours inland to get out from under a coastal cloud bank is worth more than a nicer hotel. An extra night is worth more than an extra excursion.',
      'And when it does happen — when the arc suddenly sharpens and starts to move, which is the thing the photographs cannot show you — you will not be reaching for a camera. Nobody ever does, the first time.',
    ],
  },
  {
    slug: 'rome-before-the-queues',
    n: '06',
    cat: 'The Art of Travel',
    title: 'Rome, before the queues',
    em: 'before',
    deck: 'The Forum opens at 09:00. Everyone knows this. Almost nobody acts on it, and that gap is worth two hours of your life.',
    by: '02',
    date: '2026-06-09',
    dateLabel: '9 June 2026',
    read: 5,
    photo: '1534445867742-43195f401b6c',
    credit: 'The Roman Forum, from the Palatine — 09:20',
    cta: { label: 'See the Italy journeys', to: '/journeys4?where=Italy' },
    body: [
      'The tour groups arrive in Rome’s ancient centre at about 10:30. This is not a secret; it is a logistics fact, and it follows from hotel breakfasts, coach parking and the length of a guided walk. Between the 09:00 opening and 10:30 there is ninety minutes in which the Forum belongs to about two hundred people instead of six thousand.',
      'You will not enjoy those ninety minutes if you spend them queueing for a ticket, so buy the combined Colosseum–Forum–Palatine ticket in advance, enter at the Palatine gate on Via di San Gregorio rather than the Colosseum gate, and walk down into the Forum from above. You get the view first and the ruins second, which is the correct order.',
      'The same trick works for the Vatican Museums, in reverse: go late. The last two hours before closing empty out, the Sistine Chapel becomes a room you can stand still in, and the guards start herding people at the end anyway. What you lose is the ability to linger. What you gain is the ability to see.',
      'None of this is expensive or clever. It is just early, and most people are not.',
    ],
  },
  {
    slug: 'what-the-guides-carry',
    n: '07',
    cat: 'Culture',
    title: 'What the guides carry',
    em: 'carry',
    deck: 'We asked five of our specialists to empty their bags. What came out says more about the job than any brochure.',
    by: '05',
    date: '2026-06-03',
    dateLabel: '3 June 2026',
    read: 7,
    photo: '1516426122078-c23e76319801',
    credit: 'A guide’s kit, Maasai Mara',
    cta: { label: 'See the safari journeys', to: '/journeys4?where=Africa Safari' },
    body: [
      'Ask a safari guide what is in the vehicle and they will tell you about the first-aid kit and the radio. Ask them to empty their own bag and something more honest comes out: a bird book with the spine gone, a pencil, a folded sheet of paper with a hand-drawn map of a lugga that does not appear on any published map, and a spare pair of reading glasses that belong to nobody.',
      'The reading glasses were the thing that stopped me. Three of the five carried a pair. None of them need them. They carry them because an older traveller will, at some point in a five-day safari, sit down in the vehicle and be unable to read the label on their own medication, and be too embarrassed to say so.',
      { quote: 'They carry the reading glasses because someone always needs them, and nobody ever asks.' },
      'The Alpine guide carried string. The Kyoto guide carried a small towel and a plastic bag, for wet umbrellas, because a wet umbrella in a temple is a problem you cannot solve once you are inside. The Kerala guide carried salt.',
      'A brochure will tell you that our guides are experienced. What experience actually looks like is a bag with somebody else’s reading glasses in it.',
    ],
  },

  /* --------------------------------------------------------- THE INDEX */
  {
    slug: 'kerala-at-four-miles-an-hour',
    n: '08',
    cat: 'Destinations',
    title: 'Kerala, at four miles an hour',
    em: 'four',
    deck: 'A houseboat moves slower than you walk. Three days in, that stops being a complaint and starts being the reason you came.',
    by: '04',
    date: '2026-05-29',
    dateLabel: '29 May 2026',
    read: 6,
    photo: '1602216056096-3b40cc0c9944',
    credit: 'The Vembanad backwaters, near Alappuzha',
    cta: { label: 'See the India journeys', to: '/journeys4?where=India' },
    body: [
      'A kettuvallam does about four miles an hour, which is slower than a brisk walk and considerably slower than the boat you imagined. On the first afternoon this is charming. On the second morning, if you have come from a city and a job, it is quietly maddening, and most people spend an hour of it on their phone before the signal goes.',
      'The third day is the point. Somewhere after the signal goes and before you have run out of book, the pace stops being something happening to you. You start noticing the specific things — a man cutting a coconut on a bank, a heron that has been standing in the same place for forty minutes, the fact that every house on the water faces the water and not the road behind it.',
      'This is why we will not sell a one-night backwater stay, however much easier it is to slot into an itinerary. One night is a boat ride. Three is the thing itself. If the schedule only has room for one, we would honestly rather you spent it somewhere else and came back for the backwaters properly.',
    ],
  },
  {
    slug: 'the-ledger-that-started-it',
    n: '09',
    cat: 'Heritage',
    title: 'The ledger that started it',
    em: 'ledger',
    wide: true,
    deck: 'In 1758 we were a regimental agent, not a travel company: we moved soldiers’ pay, not soldiers. The travelling came later — and it came out of the paperwork.',
    by: '02',
    date: '2026-05-26',
    dateLabel: '26 May 2026',
    read: 10,
    photo: '1488646953014-85cb44e25828',
    credit: 'An agent’s ledger — pay, passage, and the cost of both',
    cta: { label: 'Read our full story', to: '/about-us2' },
    body: [
      'Cox & Kings did not begin as a travel company, and the date on our masthead is not the date we sold anyone a holiday. In 1758 Richard Cox became regimental agent to the Foot Guards, which is a job that no longer exists and is best described as a mix of banker, paymaster and quartermaster. He moved money, not people.',
      'The travelling arrived through the ledger. An agent who is already handling an officer’s pay, his uniform account and his letters home is the obvious person to handle his passage to India as well — and then his wife’s passage, and then his leave, and then the baggage. By the nineteenth century the firm was arranging voyages as a matter of course, because it was already arranging everything else.',
      { quote: 'The travelling arrived through the ledger. We were already doing the difficult parts.' },
      'This is not a romantic origin, and we have stopped dressing it up as one. But it is a useful one to remember, because it explains the shape of the company that came out of it: a business whose oldest competence is not inspiration but administration — visas, transfers, baggage, the money, the boring middle of a journey that nobody photographs.',
      'The 268 years since include an insolvency, in 2020, that ended the old company outright, and an acquisition in 2024 that started this one. We write about that elsewhere, at length, because a heritage claim that skips the worst part of the history is not a heritage claim. It is an advertisement.',
    ],
  },
  {
    slug: 'osaka-eats-standing-up',
    n: '10',
    cat: 'Food',
    title: 'Osaka eats standing up',
    em: 'standing',
    deck: 'The city’s best food is served at counters with no chairs, to people with somewhere to be. Join them.',
    by: '03',
    date: '2026-05-21',
    dateLabel: '21 May 2026',
    read: 5,
    photo: '1493976040374-85c8e12f0c0e',
    credit: 'A tachinomi counter, Kyobashi, Osaka',
    cta: { label: 'A tailor-made Japan trip', to: CALLBACK },
    body: [
      'A tachinomi is a standing bar. There are no chairs, the counter is at elbow height, and the implicit contract is that you will eat, drink, pay and leave inside forty minutes so that someone else can have your patch of counter. The food is very good and very cheap, and the reason it is both is the absence of the chairs.',
      'Osaka is the city for this. Kyobashi and Tenma have whole streets of them, they open at four in the afternoon, and by six they are full of people who have come straight from work and will go home after two drinks. Nobody lingers. Nobody is on a date. It is the least romantic and most enjoyable eating in Japan.',
      'Two rules. Order something the moment you take your place — standing at a counter without a drink in front of you is the one thing that marks you as lost. And watch what the person next to you is eating, then point at it. This works in every language and has never once failed.',
    ],
  },
  {
    slug: 'how-a-private-journey-gets-made',
    n: '11',
    cat: 'The Art of Travel',
    title: 'How a private journey actually gets made',
    em: 'actually',
    deck: 'Six weeks, four drafts, one argument about a train. The unglamorous middle of a tailor-made trip, written down.',
    by: '04',
    date: '2026-05-17',
    dateLabel: '17 May 2026',
    read: 8,
    photo: '1469854523086-cc02fe5d8800',
    credit: 'A fourth draft, marked up',
    cta: { label: 'Start a tailor-made journey', to: CALLBACK },
    body: [
      'The first call is not about the destination. It is about the constraints — how many days you can really take, who is coming, what your parents can walk in a morning, whether anyone gets carsick, and what you are actually hoping this trip will feel like. Twenty minutes of that produces a better itinerary than an hour of destination talk.',
      'Draft one comes back too full. This is deliberate and slightly dishonest of us: it is easier for you to cut than to add, and what you cut tells us more about you than what you keep. Draft two is the real one. Draft three is where the hotels get pinned and the prices become true rather than indicative.',
      { quote: 'It is easier for you to cut than to add — and what you cut tells us more than what you keep.' },
      'Draft four exists because of the argument. There is always an argument, and it is usually about a train: the scenic route that costs a day, the night train that saves a hotel but ruins a morning, the transfer that looks fine on paper and is four hours with a five-year-old. Somebody has to have that argument with you honestly, and it is the entire value of the specialist.',
      'Six weeks, start to finish, is typical for a first-time bespoke trip. It can be done in two. It should not be done in one.',
    ],
  },
  {
    slug: 'packing-for-the-mara',
    n: '12',
    cat: 'The Art of Travel',
    title: 'Packing for the Mara',
    em: 'Mara',
    deck: 'The list is shorter than you think and the light is better than you hope. Bring the second battery anyway.',
    by: '05',
    date: '2026-05-12',
    dateLabel: '12 May 2026',
    read: 4,
    photo: '1547471080-7cc2caa01a7e',
    credit: 'First light, Maasai Mara',
    cta: { label: 'See the safari journeys', to: '/journeys4?where=Africa Safari' },
    body: [
      'The bush laundry does everything in a day and charges almost nothing, so you need three days of clothes for a nine-day safari, not nine. This single fact removes half the weight from most people’s bags, and weight matters, because the light aircraft into the camps have a 15 kg limit and they enforce it on a scale in front of you.',
      'What you do need: something warm for the morning drive, which starts at 05:45 and is genuinely cold in an open vehicle; something that covers your arms for the evening, which is when the mosquitoes arrive; and a hat that will survive a vehicle doing 40 km/h. Not khaki, particularly. That is a costume convention, not a requirement.',
      'And the second battery. Not for the camera — for the camera. The cold morning drains it, the good light lasts ninety minutes, and the leopard does not wait while you swap.',
    ],
  },
  {
    slug: 'the-house-that-murano-built',
    n: '13',
    cat: 'Culture',
    title: 'The house that Murano built',
    em: 'Murano',
    deck: 'A furnace that has not gone cold since the 1300s, and the family that has spent four hundred years feeding it.',
    by: '02',
    date: '2026-05-08',
    dateLabel: '8 May 2026',
    read: 7,
    photo: '1523906834658-6e24ef2386f9',
    credit: 'A glass house on Murano, Venice',
    cta: { label: 'See the Italy journeys', to: '/journeys4?where=Italy' },
    body: [
      'The glassmakers were moved to Murano in 1291 because their furnaces kept setting Venice on fire. The island became a workshop, then a monopoly, and then a prison of sorts: a master glassmaker who left the republic with his knowledge could expect to be pursued. The craft was a state asset.',
      'What survives of that is a handful of houses where the furnace genuinely does not go out — not as a marketing line, but because bringing a furnace from cold back to 1,100 °C costs days and a fortune in gas, and the glass in the crucible would be ruined. The fire is banked, never killed. Some of these have been running, more or less continuously, for centuries.',
      'The tourist version of Murano is a forty-minute demonstration and a shop. The other version is a morning in a working house with a maestro who has no interest in performing, watching a piece fail twice before it works. Ask for the second one. It costs more and it is worth it, and you will never look at a glass the same way.',
    ],
  },
  {
    slug: 'why-we-still-print-the-itinerary',
    n: '14',
    cat: 'Heritage',
    title: 'Why we still print the itinerary',
    em: 'print',
    deck: 'A paper document, couriered, in an age of PDFs. It is not nostalgia — it is the thing that gets read on the plane.',
    by: '02',
    date: '2026-05-04',
    dateLabel: '4 May 2026',
    read: 5,
    photo: '1582719478250-c89cae4dc85b',
    credit: 'A printed itinerary, before it is couriered',
    cta: { label: 'Talk to a specialist', to: CALLBACK },
    body: [
      'We send a PDF, obviously. We also print the thing, bind it, and courier it, and every couple of years somebody internally asks why we are still paying for that.',
      'The answer is that the PDF is opened once, on a laptop, in the week it arrives, and then it lives in an inbox. The printed one gets opened on the plane. It gets opened by the person who is not the person who booked the trip — the husband, the mother, the son who has been told nothing and is now genuinely curious. It gets opened by the hotel, when there is a question. It works without battery, without signal and without the Wi-Fi password.',
      'It also does something less practical. It says that somebody made this, deliberately, for you, and that it was worth the paper. That is a claim it is very hard to make in an email.',
    ],
  },
  {
    slug: 'the-hour-at-the-taj-nobody-books',
    n: '15',
    cat: 'Destinations',
    title: 'The one hour at the Taj nobody books',
    em: 'nobody',
    deck: 'Sunrise is famous and crowded. The last hour before closing is neither, and the marble is warmer.',
    by: '04',
    date: '2026-04-29',
    dateLabel: '29 April 2026',
    read: 5,
    photo: '1524492412937-b28074a5d7da',
    credit: 'The Taj Mahal, Agra — an hour before closing',
    cta: { label: 'See the India journeys', to: '/journeys4?where=India' },
    body: [
      'Every itinerary in India puts the Taj at sunrise, and sunrise at the Taj is genuinely extraordinary — for about twenty minutes, shared with a very large number of other people who read the same itinerary. The queue at the East Gate starts forming in the dark.',
      'The last hour before sunset is a different building. The crowd has thinned to a third, the marble has been in the sun all day and has gone from white to a warm cream that photographs badly and looks wonderful, and the inlay — the pietra dura, the actual craft of the place — is finally lit from an angle where you can see it.',
      'The catch is the light for photographs, which is flatter and less dramatic, and the fact that it is hot. If you have one visit, take sunrise. If you have two, take the second one late and go without a camera. And if you are there on a full moon, the night viewing is a separate ticket, sold at the Archaeological Survey office the day before, for five nights a month only.',
    ],
  },
  {
    slug: 'lights-out-over-tromso',
    n: '16',
    cat: 'Culture',
    title: 'Lights out over Tromsø',
    em: 'Tromsø',
    wide: true,
    deck: 'What a town does with itself when the sun does not rise for two months. Mostly: it keeps going.',
    by: '06',
    date: '2026-04-24',
    dateLabel: '24 April 2026',
    read: 6,
    photo: '1531366936337-7c912a4589a7',
    credit: 'Tromsø in the polar night — 12:40 in the afternoon',
    cta: { label: 'See the Northern Lights journeys', to: '/journeys4?where=Northern Lights' },
    body: [
      'The polar night in Tromsø runs from late November to late January. The sun does not clear the horizon. What you get instead, for a few hours around midday, is a long blue twilight that photographers call the blue hour and that residents simply call the day.',
      'The interesting thing is what does not happen. The town does not shut. Children go to school in the dark, people go to the gym in the dark, the buses run, and the coffee shops are full at 10 a.m. under a sky the colour of a bruise. Nobody is being brave about it. It is just January.',
      { quote: 'Nobody is being brave about it. It is just January.' },
      'Visitors, meanwhile, spend the whole time slightly disoriented, sleep badly, and eat at strange hours. This is normal and it passes in about three days, which is another argument for the longer trip: the first three days are spent adjusting, and the aurora does not care that you are adjusting.',
      'Go out at 13:00 anyway, when the blue is deepest. It is the most beautiful light in Europe and almost nobody photographs it, because they are all indoors waiting for night.',
    ],
  },
  {
    slug: 'the-case-for-the-window-seat',
    n: '17',
    cat: 'The Art of Travel',
    title: 'The case for the window seat, argued badly',
    em: 'badly',
    deck: 'A specialist who has done the Bernina line thirty times explains, at length, why you want the left-hand side.',
    by: '02',
    date: '2026-04-19',
    dateLabel: '19 April 2026',
    read: 4,
    photo: '1467269204594-9661b134dd2b',
    credit: 'The Bernina line, above Alp Grüm',
    cta: { label: 'See the Switzerland journeys', to: '/journeys4?where=Switzerland' },
    body: [
      'Travelling south from Chur, sit on the left. This is not a preference. On the descent from Alp Grüm the line performs the Brusio spiral viaduct — the train turns through a full circle on a stone bridge, in the open, and comes back underneath itself — and the geometry of that turn puts the view, and the train’s own tail curving away below you, on the left-hand side.',
      'The right-hand side gets a rock face for much of it, and then a very good lake. It is not a bad seat. It is simply the second-best seat, and you are on this train once.',
      'There are perhaps six journeys in Europe where the side of the carriage genuinely changes the trip, and a specialist who has done the route will know all six without looking it up. It is a small thing to know. It is also, roughly, the job.',
    ],
  },
  {
    slug: 'the-rule-of-the-busy-stall',
    n: '18',
    cat: 'Food',
    title: 'The rule of the busy stall',
    em: 'busy',
    deck: 'One heuristic will feed you well in any city on our list. It has nothing to do with reviews.',
    by: '03',
    date: '2026-04-15',
    dateLabel: '15 April 2026',
    read: 4,
    photo: '1528181304800-259b08848526',
    credit: 'A night market, Bangkok',
    cta: { label: 'See the Southeast Asia journeys', to: '/journeys4?where=Southeast Asia' },
    body: [
      'Eat where there is a queue of locals, and eat the one thing that stall makes. That is the entire rule, and it outperforms every app, because a queue is a real-time signal from people who have to eat there again tomorrow, and a review is a two-year-old signal from someone who did not.',
      'The corollary matters more: a stall that makes one thing has been making it for years, buys for it every morning, and cannot hide behind a laminated menu of forty dishes it does not cook well. Turnover is also, bluntly, food safety — the stock is not sitting.',
      'What the rule cannot do is tell you what the thing is. That is the part worth asking a local for, and it is why our city days start with someone who eats there, not someone who guides there.',
    ],
  },
  {
    slug: 'the-grand-tour-and-who-it-was-for',
    n: '19',
    cat: 'Heritage',
    title: 'The Grand Tour, and who it was for',
    em: 'who',
    deck: 'Europe’s original itinerary was a finishing school for the rich. What survives of it is the shape of the route.',
    by: '02',
    date: '2026-04-10',
    dateLabel: '10 April 2026',
    read: 9,
    photo: '1543349689-9a4d426bee8e',
    credit: 'The route, more or less unchanged',
    cta: { label: 'See the Europe journeys', to: '/journeys4?where=Europe' },
    body: [
      'The Grand Tour was not travel as we mean it. It was an education, taken by young aristocratic men between roughly 1660 and 1840, lasting anything from a year to four, with a tutor, a servant and a letter of credit. The point was to come home with Latin, manners, a few antiquities and a portrait.',
      'It was also, unavoidably, a route for a class of person that most of the continent’s population was not. Pretending otherwise is how the phrase gets used in brochures — as a shorthand for grandeur, with the aristocracy quietly filed off.',
      'What did survive is the shape. Paris, then the Alps, then Turin or Milan, then Florence, then Rome, and — for the serious — Naples and the newly excavated Pompeii. Look at almost any classical Europe itinerary sold today and you are looking at that route, with the tutor replaced by a guide and the four years compressed into fourteen days.',
      'Which is worth knowing, because it tells you what the route was optimised for: art, ruins and the acquisition of taste. Not food, not landscape, not the parts of Europe that were poor. If those are what you want, the Grand Tour is the wrong skeleton, and a specialist should be telling you so rather than selling you the famous shape.',
    ],
  },
];

export const LEAD_POST = POSTS.find((p) => p.lead);

/* "New this month" — the six most recent after the lead. */
export const RAIL_POSTS = POSTS.filter((p) => !p.lead).slice(0, 6);

/* The index is the WHOLE journal, lead and rail included. It used to be only
   the older twelve, which left the desk filters with two or three pieces each
   — "Destinations" resolved to a single card, and a filter that returns one
   result reads as a broken filter rather than a small desk. An index is also
   simply meant to be complete: a reader who filters to Food expects every food
   piece, not every food piece we have not already shown them. */
export const INDEX_POSTS = POSTS;

export const bySlug = (slug) => POSTS.find((p) => p.slug === slug);
