/* ============================================================================
   Cox & Kings India — the team.

   Karan Agarwal is the only REAL, verifiable person here: he was appointed
   Director of Cox & Kings India following the 2024 Wilson & Hughes acquisition.
   EVERY OTHER PERSON BELOW IS FICTIONAL — invented names, roles and bios, with
   stock portraits. Swap them for real staff and real photography before this
   goes anywhere near production.

   `lead: true`  → shown as the feature card on the About page.
   `main: true`  → shown in the leadership row on the About page (/about-us2).
   Everyone else appears only on the full team page (/about-us2/team).
   ========================================================================== */

export const DIRECTOR = {
  name: 'Karan Agarwal',
  role: 'Director',
  unit: 'Cox & Kings India',
  bio: 'Appointed following the Wilson & Hughes acquisition, Karan drives the franchise, preferred-agent and holiday-club network across India — and the rebuild of a 265-year-old name for travellers who have never heard of it.',
  photo: 'photo-1500648767791-00dcc994a43e',
  real: true,
};

export const TEAM = [
  {
    n: '01',
    name: 'Meera Sundaram',
    role: 'Head of Marketing',
    unit: 'Brand & Growth',
    bio: 'Rebuilding a name most Indians last heard from their parents — without leaning on the nostalgia alone.',
    photo: 'photo-1573496359142-b8d87734a5a2',
    main: true,
  },
  {
    n: '02',
    name: 'Arjun Rao',
    role: 'Head of Product',
    unit: 'Journeys & Platform',
    bio: 'Owns what a Cox & Kings journey actually is — the itineraries, the pacing, and the booking experience around them.',
    photo: 'photo-1507003211169-0a1dd7228f2d',
    main: true,
  },
  {
    n: '03',
    name: 'Nisha Verma',
    role: 'Head of Sales',
    unit: 'Retail & Franchise',
    bio: 'Runs the counters, the franchise network and the people who pick up the phone when you call.',
    photo: 'photo-1580489944761-15a19d654956',
    main: true,
  },
  {
    n: '04',
    name: 'Rohan Mehta',
    role: 'Head of Finance',
    unit: 'Finance & Controls',
    bio: 'Keeps a company that once went under solvent, audited and boring — in the way finance ought to be boring.',
    photo: 'photo-1618306842557-a2515acf2112',
    main: true,
  },
  {
    n: '05',
    name: 'Devika Iyer',
    role: 'Head of Operations',
    unit: 'Ground & Supply',
    bio: 'The ground handlers, the hotels, the transfers. When a flight is cancelled at 2am, this is whose phone rings.',
    photo: 'photo-1494790108377-be9c29b29330',
  },
  {
    n: '06',
    name: 'Farah Qureshi',
    role: 'Head of Technology',
    unit: 'Engineering & Data',
    bio: 'Putting a 265-year-old business onto software that was written this decade.',
    photo: 'photo-1759840278361-f1adc75529a1',
  },
  {
    n: '07',
    name: 'Ananya Bose',
    role: 'Head of Customer Experience',
    unit: 'Service & Care',
    bio: 'Owns everything that happens after you pay — including the parts nobody likes talking about.',
    photo: 'photo-1463335361701-e90f4c5045d0',
  },
  {
    n: '08',
    name: 'Vikram Nair',
    role: 'Head of Partnerships',
    unit: 'Airlines, Hotels & Trade',
    bio: 'Rebuilding the trade relationships the old company spent decades earning and one insolvency losing.',
    photo: 'photo-1506794778202-cad84cf45f1d',
  },
];

/* The four heads that surface on the About page. */
export const TEAM_MAIN = TEAM.filter((m) => m.main);
