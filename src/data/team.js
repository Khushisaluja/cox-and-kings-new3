/* ============================================================================
   Cox & Kings India — the team.

   Karan Agarwal is the only REAL, verifiable person here: he was appointed
   Director of Cox & Kings India following the 2024 Wilson & Hughes acquisition.
   EVERY OTHER PERSON BELOW IS FICTIONAL — invented names, roles and bios, with
   stock portraits. Swap them for real staff and real photography before this
   goes anywhere near production.

   LinkedIn: the individual profile URLs on the fictional staff are placeholders
   and do NOT resolve to real people — replace them with real profiles when the
   real team lands here. The Director's link points at the Cox & Kings company
   page rather than a fabricated personal profile.

   `lead: true`  → shown as the feature card on the About page.
   `main: true`  → shown in the leadership row on the About page (/about-us2).
   `department`  → groups people on the full team page (/about-us2/team).
   ========================================================================== */

const LI = 'https://www.linkedin.com/in/';

export const DIRECTOR = {
  name: 'Karan Agarwal',
  role: 'Director',
  unit: 'Cox & Kings India',
  department: 'Leadership',
  bio: 'Appointed following the Wilson & Hughes acquisition, Karan drives the franchise, preferred-agent and holiday-club network across India — and the rebuild of a 265-year-old name for travellers who have never heard of it.',
  photo: 'photo-1500648767791-00dcc994a43e',
  linkedin: 'https://www.linkedin.com/company/coxandkings/',
  real: true,
};

/* The senior leadership group shown at the top of the full team page. The
   Director is the only real person; the rest are fictional placeholders. */
export const LEADERSHIP = [
  DIRECTOR,
  {
    name: 'Rajiv Malhotra',
    role: 'Managing Director',
    unit: 'Cox & Kings India',
    department: 'Leadership',
    bio: 'Runs the business day to day as the 265-year-old name is rebuilt for a new generation of Indian travellers.',
    photo: 'photo-1566492031773-4f4e44671857',
    linkedin: `${LI}rajiv-malhotra`,
  },
  {
    name: 'Anjali Deshpande',
    role: 'Chief Operating Officer',
    unit: 'Cox & Kings India',
    department: 'Leadership',
    bio: 'Owns how the whole company runs — the systems, the standards and the people delivering on them.',
    photo: 'photo-1607746882042-944635dfe10e',
    linkedin: `${LI}anjali-deshpande`,
  },
  {
    name: 'Vivek Sharma',
    role: 'Chief Strategy Officer',
    unit: 'Cox & Kings India',
    department: 'Leadership',
    bio: 'Sets where the company goes next — the markets, the partnerships and the bets worth making.',
    photo: 'photo-1552058544-f2b08422138a',
    linkedin: `${LI}vivek-sharma`,
  },
];

export const TEAM = [
  /* ---------------------------------------------------- Marketing & Brand --- */
  {
    n: '01',
    name: 'Meera Sundaram',
    role: 'Head of Marketing',
    unit: 'Brand & Growth',
    department: 'Marketing & Brand',
    bio: 'Rebuilding a name most Indians last heard from their parents — without leaning on the nostalgia alone.',
    photo: 'photo-1573496359142-b8d87734a5a2',
    linkedin: `${LI}meera-sundaram`,
    main: true,
    head: true,
  },
  {
    name: 'Kabir Anand',
    role: 'Brand & Design Lead',
    unit: 'Brand & Growth',
    department: 'Marketing & Brand',
    bio: 'Owns how the company looks and sounds — from the logo lock-up to the last line of a brochure.',
    photo: 'photo-1519085360753-af0119f7cbe7',
    linkedin: `${LI}kabir-anand`,
  },
  {
    name: 'Sneha Pillai',
    role: 'Content & Editorial Lead',
    unit: 'Brand & Growth',
    department: 'Marketing & Brand',
    bio: 'Turns destinations into stories worth reading before anyone books a flight.',
    photo: 'photo-1544005313-94ddf0286df2',
    linkedin: `${LI}sneha-pillai`,
  },

  /* --------------------------------------------------- Product & Journeys --- */
  {
    n: '02',
    name: 'Arjun Rao',
    role: 'Head of Product',
    unit: 'Journeys & Platform',
    department: 'Product & Journeys',
    bio: 'Owns what a Cox & Kings journey actually is — the itineraries, the pacing, and the booking experience around them.',
    photo: 'photo-1507003211169-0a1dd7228f2d',
    linkedin: `${LI}arjun-rao`,
    main: true,
    head: true,
  },
  {
    name: 'Ishaan Kapoor',
    role: 'Itinerary Designer',
    unit: 'Journeys & Platform',
    department: 'Product & Journeys',
    bio: 'Builds the day-by-day — where you sleep, how far you drive, and what you skip so the trip still breathes.',
    photo: 'photo-1527980965255-d3b416303d12',
    linkedin: `${LI}ishaan-kapoor`,
  },
  {
    name: 'Tara Menon',
    role: 'Product Manager, Platform',
    unit: 'Journeys & Platform',
    department: 'Product & Journeys',
    bio: 'Runs the roadmap for the site and the booking flow you are looking at right now.',
    photo: 'photo-1438761681033-6461ffad8d80',
    linkedin: `${LI}tara-menon`,
  },

  /* ---------------------------------------------------- Sales & Franchise --- */
  {
    n: '03',
    name: 'Nisha Verma',
    role: 'Head of Sales',
    unit: 'Retail & Franchise',
    department: 'Sales & Franchise',
    bio: 'Runs the counters, the franchise network and the people who pick up the phone when you call.',
    photo: 'photo-1580489944761-15a19d654956',
    linkedin: `${LI}nisha-verma`,
    main: true,
    head: true,
  },
  {
    name: 'Aditya Joshi',
    role: 'Franchise Development Manager',
    unit: 'Retail & Franchise',
    department: 'Sales & Franchise',
    bio: 'Signs and supports the partners who fly the Cox & Kings name in their own cities.',
    photo: 'photo-1472099645785-5658abf4ff4e',
    linkedin: `${LI}aditya-joshi`,
  },
  {
    name: 'Priya Nambiar',
    role: 'Retail Sales Lead',
    unit: 'Retail & Franchise',
    department: 'Sales & Franchise',
    bio: 'Leads the advisors who turn an enquiry into a holiday people actually take.',
    photo: 'photo-1534528741775-53994a69daeb',
    linkedin: `${LI}priya-nambiar`,
  },

  /* ---------------------------------------------------------- Operations --- */
  {
    n: '04',
    name: 'Devika Iyer',
    role: 'Head of Operations',
    unit: 'Ground & Supply',
    department: 'Operations',
    bio: 'The ground handlers, the hotels, the transfers. When a flight is cancelled at 2am, this is whose phone rings.',
    photo: 'photo-1494790108377-be9c29b29330',
    linkedin: `${LI}devika-iyer`,
    head: true,
  },
  {
    name: 'Sameer Khan',
    role: 'Ground Operations Manager',
    unit: 'Ground & Supply',
    department: 'Operations',
    bio: 'Keeps the on-the-ground machine running across every destination we sell.',
    photo: 'photo-1507591064344-4c6ce005b128',
    linkedin: `${LI}sameer-khan`,
  },
  {
    name: 'Lakshmi Raghavan',
    role: 'Supplier Relations Manager',
    unit: 'Ground & Supply',
    department: 'Operations',
    bio: 'Holds the hotel and DMC relationships that decide whether a promise is one we can keep.',
    photo: 'photo-1524504388940-b1c1722653e1',
    linkedin: `${LI}lakshmi-raghavan`,
  },

  /* ---------------------------------------------------------- Technology --- */
  {
    n: '05',
    name: 'Farah Qureshi',
    role: 'Head of Technology',
    unit: 'Engineering & Data',
    department: 'Technology',
    bio: 'Putting a 265-year-old business onto software that was written this decade.',
    photo: 'photo-1573497019940-1c28c88b4f3e',
    linkedin: `${LI}farah-qureshi`,
    head: true,
  },
  {
    name: 'Rahul Desai',
    role: 'Engineering Lead',
    unit: 'Engineering & Data',
    department: 'Technology',
    bio: 'Owns the codebase behind the booking platform and the systems that feed it.',
    photo: 'photo-1489424731084-a5d8b219a5bb',
    linkedin: `${LI}rahul-desai`,
  },
  {
    name: 'Ayesha Siddiqui',
    role: 'Data & Analytics Lead',
    unit: 'Engineering & Data',
    department: 'Technology',
    bio: 'Turns what travellers do into what the company builds next.',
    photo: 'photo-1531123897727-8f129e1688ce',
    linkedin: `${LI}ayesha-siddiqui`,
  },

  /* ------------------------------------------------- Customer Experience --- */
  {
    n: '06',
    name: 'Ananya Bose',
    role: 'Head of Customer Experience',
    unit: 'Service & Care',
    department: 'Customer Experience',
    bio: 'Owns everything that happens after you pay — including the parts nobody likes talking about.',
    photo: 'photo-1463335361701-e90f4c5045d0',
    linkedin: `${LI}ananya-bose`,
    head: true,
  },
  {
    name: 'Neha Gupta',
    role: 'Service & Care Manager',
    unit: 'Service & Care',
    department: 'Customer Experience',
    bio: 'Runs the team that answers when the trip has already started and something needs fixing.',
    photo: 'photo-1502685104226-ee32379fefbe',
    linkedin: `${LI}neha-gupta`,
  },

  /* -------------------------------------------------------------- Finance --- */
  {
    n: '07',
    name: 'Rohan Mehta',
    role: 'Head of Finance',
    unit: 'Finance & Controls',
    department: 'Finance',
    bio: 'Keeps a company that once went under solvent, audited and boring — in the way finance ought to be boring.',
    photo: 'photo-1618306842557-a2515acf2112',
    linkedin: `${LI}rohan-mehta`,
    main: true,
    head: true,
  },
  {
    name: 'Manish Agarwal',
    role: 'Financial Controller',
    unit: 'Finance & Controls',
    department: 'Finance',
    bio: 'Signs off the numbers so the ambition upstairs stays honest.',
    photo: 'photo-1560250097-0b93528c311a',
    linkedin: `${LI}manish-agarwal`,
  },

  /* --------------------------------------------------------- Partnerships --- */
  {
    n: '08',
    name: 'Vikram Nair',
    role: 'Head of Partnerships',
    unit: 'Airlines, Hotels & Trade',
    department: 'Partnerships',
    bio: 'Rebuilding the trade relationships the old company spent decades earning and one insolvency losing.',
    photo: 'photo-1506794778202-cad84cf45f1d',
    linkedin: `${LI}vikram-nair`,
    head: true,
  },
  {
    name: 'Divya Krishnan',
    role: 'Trade & Alliances Manager',
    unit: 'Airlines, Hotels & Trade',
    department: 'Partnerships',
    bio: 'Keeps the airline and hotel alliances that decide what we can offer, and at what price.',
    photo: 'photo-1487412720507-e7ab37603c6f',
    linkedin: `${LI}divya-krishnan`,
  },
];

/* The four heads that surface on the About page. */
export const TEAM_MAIN = TEAM.filter((m) => m.main);

/* Ordered department metadata — the order these sections appear on the full
   team page. The Director sits above all of these, on their own. */
const DEPARTMENT_ORDER = [
  { name: 'Marketing & Brand', blurb: 'The name, the story, and how the world finds us again.' },
  { name: 'Product & Journeys', blurb: 'What a Cox & Kings journey is, and the platform you book it on.' },
  { name: 'Sales & Franchise', blurb: 'The counters, the partners, and the people who pick up the phone.' },
  { name: 'Operations', blurb: 'Everything on the ground once you have left home.' },
  { name: 'Technology', blurb: 'The software and data putting a 265-year-old business online.' },
  { name: 'Customer Experience', blurb: 'Everything that happens after you have paid.' },
  { name: 'Finance', blurb: 'Solvent, audited, and boring — the way finance ought to be.' },
  { name: 'Partnerships', blurb: 'The airline, hotel and trade alliances behind every price.' },
];

/* TEAM grouped by department, in DEPARTMENT_ORDER, head first within each. */
export const DEPARTMENTS = DEPARTMENT_ORDER.map((dept) => {
  const members = TEAM.filter((m) => m.department === dept.name);
  return {
    ...dept,
    members: [...members].sort((a, b) => (b.head ? 1 : 0) - (a.head ? 1 : 0)),
  };
}).filter((dept) => dept.members.length > 0);

/* Total headcount shown on the page, including the Director. */
export const TEAM_COUNT = TEAM.length + 1;
