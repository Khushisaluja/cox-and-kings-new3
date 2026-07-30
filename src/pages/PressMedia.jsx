/* ============================================================================
   Cox & Kings — PRESS & MEDIA  (route: /press-media)

   The live site's /press-media page ("Media & Highlights") rebuilt on the
   /new3 design system: the shared <SiteNav /> + <SiteFooter /> chrome, the
   `.h26-section` rhythm, Cormorant Garamond display type, wide-tracked Work
   Sans labels, Voyager Blue actions and Sienna Flame accents on warm paper.

   WHO THIS PAGE IS FOR — and why it is logo-first
   -----------------------------------------------
   The visitor here is rarely reading travel news. They are a traveller — or an
   investor — checking whether the brand is legitimate. Logos answer that in
   one scan; headlines answer it only if clicked, and almost nobody clicks.
   Top to bottom:

     - a photographic hero in the standard inner-page shape (the same
       centre-aligned hero as /careers), carrying the proof numbers;
     - THE WALL: every masthead that has covered Cox & Kings, as a ruled grid
       of logos — global titles first, then the Indian newsrooms of the
       current coverage. Nothing to click; everything to recognise;
     - MEDIA SPOTLIGHT STORIES: the coverage as logo-led cards, four at
       first, "View more" loading more of the same;
     - the SKIFT pull-quote; the four awards as image cards (the same award
       emblems the live site shows, self-hosted in /public/awards); and THE
       PRESS DESK contacts.

   Outlet logos: the six global mastheads are local SVGs (the same files the
   homepage strip uses). The Indian outlets' marks are pulled from their brand
   domains (Clearbit, then the Google favicon service), and if both fail the
   tile degrades to a serif monogram — the wall never shows a broken image.

   Content is lifted from coxandkings.com/press-media (pages 1–3 of its 14).
   ========================================================================== */
import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight, ArrowUpRight, ChevronDown, Mail, Phone, Quote,
} from 'lucide-react';
import { SmartLink as Link } from '../components/ScheduleCall';
import { SiteNav, SiteFooter, CONTACT_CK } from '../components/SiteChrome';
/* Last, so .pm's own rules win over the shared h26 sheets. */
import './PressMedia.css';

gsap.registerPlugin(ScrollTrigger);

/* Same six mastheads as the homepage's #press strip — the two must agree. */
const GLOBAL_MASTHEADS = [
  { name: 'Condé Nast Traveler', src: '/press/cntraveller.svg' },
  { name: 'National Geographic', src: '/press/natgeo.svg' },
  { name: 'Travel + Leisure', src: '/press/travel-leisure.svg' },
  { name: 'Forbes', src: '/press/forbes.svg' },
  { name: "Harper's Bazaar", src: '/press/harpers-bazaar.svg' },
  { name: 'The Telegraph', src: '/press/telegraph.svg' },
];

/* ------------------------------------------------------------- the coverage.
   Every clipping on the live newsroom's first three pages, newest first.
   `src` is the outlet name as printed; OUTLETS below folds the "Economic
   Times Travel" byline into the Economic Times masthead for the wall. */
const STORIES = [
  { date: '24 Feb 2026', iso: '2026-02-24', src: 'News18', title: "Why Japan Is The Hottest Destination For Indian Travellers In 2026, And It's More Than Anime And Sushi", url: 'https://www.news18.com/lifestyle/travel/why-japan-is-the-hottest-destination-for-indian-travellers-in-2026-and-its-more-than-anime-and-sushi-9926241.html' },
  { date: '13 Feb 2026', iso: '2026-02-13', src: 'Economic Times Travel', title: 'Japan attracts over 3 lakh Indian travellers in 2025; Cox & Kings reports 30% surge in summer bookings', url: 'https://travel.economictimes.indiatimes.com/news/research-and-statistics/research/japan-records-over-300000-indian-tourists-in-2025-with-30-surge-in-summer-bookings/128333761' },
  { date: '12 Feb 2026', iso: '2026-02-12', src: 'Hindustan Times', title: "Japan's summer tourism is set to boom despite no Cherry Blossom cheer for tourists: Here's why", url: 'https://www.hindustantimes.com/htcity/trips-tours/japan-scraps-cherry-blossom-festival-for-overtourism-but-summer-travel-from-india-is-set-to-boom-as-per-cox-kings-101770891146249.html' },
  { date: '31 Jan 2026', iso: '2026-01-31', src: 'NDTV Travel', title: 'Foreign Trips Cheaper, 7 High-Speed Train Corridors: How Travel Experts Are Reacting To Budget 2026', url: 'https://www.ndtv.com/travel/budget-2026-foreign-trips-cheaper-7-high-speed-train-corridors-how-travel-experts-are-reacting-10930239' },
  { date: '13 Feb 2026', iso: '2026-02-13', src: 'Travel and Tour World', title: 'Beyond Cherry Blossoms: Why 300,000 Indian Travelers Flocked to Japan in 2025', url: 'https://www.travelandtourworld.com/news/article/beyond-cherry-blossoms-why-300000-indian-travelers-flocked-to-japan-in-2025/' },
  { date: '12 Feb 2026', iso: '2026-02-12', src: 'Hospibuz', title: "Japan's Tourism Story Goes Beyond Cherry Blossom: 3 Lakh+ Indians Travelled in 2025; Cox & Kings Sees Strong All-Season Momentum for 2026", url: 'https://hospibuz.com/travel-hot-topics/japans-tourism-story-goes-beyond-cherry-blossom-3-lakh-indians-travelled-in-2025-cox-kings-sees-strong-all-season-momentum-for-2026-11102589' },
  { date: '12 Feb 2026', iso: '2026-02-12', src: 'Travel Daily News', title: 'Indian arrivals to Japan exceed 300,000 in 2025', url: 'https://www.traveldailynews.asia/statistics-trends/indian-arrivals-to-japan-exceed-300000-in-2025/' },
  { date: '11 Feb 2026', iso: '2026-02-11', src: 'CNBC-TV18', title: 'Japan tourism sees record Indian arrivals in 2025 as travel expands beyond cherry blossom season', url: 'https://www.cnbctv18.com/travel/japan-tourism-sees-record-indian-arrivals-in-2025-as-travel-expands-beyond-cherry-blossom-season-ws-l-19848657.htm' },
  { date: '11 Feb 2026', iso: '2026-02-11', src: 'Economic Times', title: 'From sakura to snow, Japan emerges as an all-season favourite for Indian travellers', url: 'https://economictimes.indiatimes.com/nri/visit/japan-emerges-as-an-all-season-favourite-for-indian-travellers-cherry-blossoms/articleshow/128245012.cms' },
  { date: '31 Jan 2026', iso: '2026-01-31', src: 'Economic Times Travel', title: "Budget reaction: Industry welcomes tourism's elevation as a growth engine; TCS cut, infra & skilling push draw strong support", url: 'https://travel.economictimes.indiatimes.com/news/people/budget-reaction-industry-welcomes-tourisms-elevation-as-growth-engine-tcs-cut-infra-skilling-push-draw-strong-support/127854385' },
  { date: '31 Jan 2026', iso: '2026-01-31', src: 'CNBC-TV18', title: 'Budget 2026 Explained: How It May Change Your Holiday Costs And Travel Plans', url: 'https://www.cnbctv18.com/budget/budget-explained-how-it-may-change-your-holiday-costs-travel-tcs-rates-19839898.htm' },
  { date: '31 Jan 2026', iso: '2026-01-31', src: 'Fortune India', title: "Budget 2026 Seeks To Overhaul India's Tourism Ecosystem", url: 'https://www.fortuneindia.com/business-news/budget-2026-seeks-to-overhaul-indias-tourism-ecosystem/129965' },
  { date: '31 Jan 2026', iso: '2026-01-31', src: 'Hotelier India', title: 'Big Push For Tourism And Hospitality But Key Gaps Remain In Budget 2026', url: 'https://www.hotelierindia.com/operations/budget-2026-big-push-for-tourism-and-hospitality-but-key-gaps-remain' },
  { date: '31 Jan 2026', iso: '2026-01-31', src: 'Trav Talk India', title: 'Budget Shifts Focus To Experience-Led Tourism: Karan Agarwal', url: 'https://travtalkindia.com/budget-shifts-focus-to-experience-led-tourism-karan-agarwal/' },
  { date: '31 Jan 2026', iso: '2026-01-31', src: 'Travel Trade Journal', title: 'Union Budget 2026 Repositions Tourism As An Economic Engine, Even As Inbound Gaps Persist', url: 'https://traveltradejournal.com/union-budget-2026-repositions-tourism-as-an-economic-engine-even-as-inbound-gaps-persist/' },
  { date: '31 Jan 2026', iso: '2026-01-31', src: 'Travel World Online', title: 'Travel Trade Hails Infrastructure-Led Union Budget 2026', url: 'https://travelworldonline.in/travel-trade-hails-infrastructure-led-union-budget-2026/' },
  { date: '31 Jan 2026', iso: '2026-01-31', src: 'MSN', title: "Union Budget 2026: Why Sitharaman's Buddhist Circuit Plan Is A Big Deal For Northeast Tourism; What Industry Experts Have To Say", url: 'https://www.msn.com/en-in/news/world/union-budget-2026-why-sitharaman-s-buddhist-circuit-plan-is-a-big-deal-for-northeast-tourism-what-industry-experts-have-to-say/ar-AA1VpWyd' },
  { date: '31 Jan 2026', iso: '2026-01-31', src: 'Daily Excelsior', title: "Industry Welcomes Budget's Focus On Tourism Sector, Calls It Growth Driver", url: 'https://www.dailyexcelsior.com/industry-welcomes-budgets-focus-on-tourism-sector-calls-it-growth-driver/' },
  { date: '31 Jan 2026', iso: '2026-01-31', src: 'Travel Daily Media', title: 'Indian Union Budget 2026: Tax Relief To Trigger Surge In Outbound Markets', url: 'https://www.traveldailymedia.com/india-union-budget-2026-tax-relief-to-trigger-surge-in-outbound-markets/' },
];

/* How the story cards page: four on load, six more per "View more". */
const CARDS_FIRST = 4;
const CARDS_STEP = 6;

/* ------------------------------------------------------------- THE WALL.
   One entry per masthead in the current coverage (plus Skift, whose verdict
   the quote band carries). `domain` fetches the outlet's mark; bylines that
   print under a parent masthead fold into it via `alsoAs`. */
const OUTLETS = [
  { name: 'Economic Times', domain: 'economictimes.indiatimes.com', alsoAs: ['Economic Times Travel'] },
  { name: 'Hindustan Times', domain: 'hindustantimes.com' },
  { name: 'News18', domain: 'news18.com' },
  { name: 'NDTV', domain: 'ndtv.com', alsoAs: ['NDTV Travel'] },
  { name: 'CNBC-TV18', domain: 'cnbctv18.com' },
  { name: 'Fortune India', domain: 'fortuneindia.com' },
  { name: 'MSN', domain: 'msn.com' },
  { name: 'Skift', domain: 'skift.com' },
  { name: 'Travel and Tour World', domain: 'travelandtourworld.com' },
  { name: 'Travel Daily News', domain: 'traveldailynews.asia' },
  { name: 'Travel Daily Media', domain: 'traveldailymedia.com' },
  { name: 'Hotelier India', domain: 'hotelierindia.com' },
  { name: 'Trav Talk India', domain: 'travtalkindia.com' },
  { name: 'Travel Trade Journal', domain: 'traveltradejournal.com' },
  { name: 'Travel World Online', domain: 'travelworldonline.in' },
  { name: 'Hospibuz', domain: 'hospibuz.com' },
].map((o) => ({
  ...o,
  count: STORIES.filter((c) => c.src === o.name || o.alsoAs?.includes(c.src)).length,
}));

const DOMAIN_OF = Object.fromEntries(
  OUTLETS.flatMap((o) => [[o.name, o.domain], ...(o.alsoAs ?? []).map((a) => [a, o.domain])]),
);

/* The proof numbers the hero carries. Publications = the wall + the six
   global mastheads; recomputed from data so they can never drift from it. */
const STATS = [
  { num: '265+', label: 'Years in the headlines' },
  { num: String(OUTLETS.length + GLOBAL_MASTHEADS.length), label: 'Publications' },
  { num: '4', label: 'Industry awards' },
];

/* --------------------------------------------------- the awards, per the
   live page — same emblems, self-hosted in /public/awards. */
const AWARDS = [
  { img: '/awards/accolades.jpg', title: "India's Favourite Tour Operator", by: "Condé Nast Traveller Readers' Travel Awards", years: '2016, 2017, 2022' },
  { img: '/awards/accolades-2.jpg', title: 'PATA Gold Award', by: 'The Pacific Asia Travel Association', years: '2015' },
  { img: '/awards/accolades-3.jpg', title: "Asia's Leading Luxury Tour Operator", by: 'World Travel Awards', years: '2015 – 2019' },
  { img: '/awards/accolades-4.png', title: 'Best Luxury Travel Curator', by: "Travel + Leisure India's Best Awards", years: '2017' },
];

/* -------------------------------------------------- the press desk contacts,
   as published on the live page. */
const DESKS = [
  {
    label: 'Press & collaborations',
    email: 'partnerships@coxandkings.com',
    note: 'For interviews, quotes and media requests.',
  },
  {
    label: 'Corporate & MICE',
    email: 'hello@coxandkings.com',
    note: 'For corporate travel, incentives and events.',
  },
  {
    label: 'Travel planning & bookings',
    email: 'holidays@coxandkings.com',
    phone: CONTACT_CK,
    note: 'For holiday planning and bookings.',
  },
];

/* An outlet's mark, three attempts deep: the Clearbit brand logo, then the
   Google favicon service, then a serif monogram. The wall never shows a
   broken-image glyph. Decorative (alt="") — the outlet's name is always
   printed beside it. */
function OutletMark({ name, domain, size = 34 }) {
  const [stage, setStage] = useState(0);
  if (stage >= 2) {
    return <span className="pm-mono" style={{ width: size, height: size }} aria-hidden="true">{name[0]}</span>;
  }
  const src = stage === 0
    ? `https://logo.clearbit.com/${domain}`
    : `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  return (
    <img
      className="pm-mark"
      src={src}
      width={size}
      height={size}
      alt=""
      loading="lazy"
      onError={() => setStage((s) => s + 1)}
    />
  );
}

export default function PressMedia() {
  const root = useRef(null);
  const [cardCount, setCardCount] = useState(CARDS_FIRST);

  const cards = STORIES.slice(0, cardCount);
  const remaining = STORIES.length - cardCount;

  /* ============================================================
     MOTION — one context, reduced-motion gated. Every tween is a
     gsap.from(), so the CSS resting state IS the finished state:
     if none of this runs the page stands still and complete.
     ============================================================ */
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add({ motion: '(prefers-reduced-motion: no-preference)' }, (self) => {
        if (!self.conditions.motion) return;

        gsap.timeline({ defaults: { ease: 'power3.out' } })
          .from('.pm-hero__eyebrow', { opacity: 0, y: 14, duration: 0.7 }, 0.15)
          .from('.pm-hero__line > span', { yPercent: 115, duration: 1.05, stagger: 0.12 }, 0.25)
          .from('.pm-hero__lead', { opacity: 0, y: 16, duration: 0.8 }, 0.8)
          .from('.pm-hero__stats > *', { opacity: 0, y: 14, duration: 0.7, stagger: 0.1 }, 0.95)
          .from('.pm-hero__actions', { opacity: 0, y: 14, duration: 0.7 }, 1.15);

        /* Scroll reveals on nodes that never re-render, so nothing orphans.
           (The story-card grid grows via "View more", so its reveal sits on
           the wrapper, never on the cards.) */
        gsap.utils.toArray('[data-pmreveal]').forEach((el) => {
          gsap.from(el, {
            opacity: 0, y: 26, duration: 0.85, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 86%' },
          });
        });

        /* The wall assembles tile by tile — a cascade of proof. */
        gsap.from('.pm-tile', {
          opacity: 0, y: 16, duration: 0.6, ease: 'power3.out', stagger: 0.035,
          scrollTrigger: { trigger: '.pm-wall__grid', start: 'top 84%' },
        });

        gsap.from('.pm-acard', {
          opacity: 0, y: 20, duration: 0.7, ease: 'power3.out', stagger: 0.09,
          scrollTrigger: { trigger: '.pm-awards__grid', start: 'top 84%' },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div className="h26 new-typo pm" ref={root}>
      {/* solidAt matches /new3 so the nav's transition timing is identical. */}
      <SiteNav solidAt={80} skipTo="#pm-wall" skipLabel="Skip to press coverage" />

      <main id="pm-main">
        {/* ==================== HERO ==================== */}
        <header className="pm-hero">
          <div
            className="pm-hero__bg"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=2000&q=80')" }}
            aria-hidden="true"
          />
          <div className="pm-hero__veil" aria-hidden="true" />

          <div className="pm-hero__inner">
            <p className="pm-hero__eyebrow h26-label h26-label-light">Press &amp; Media</p>

            <h1 className="pm-hero__title">
              <span className="pm-hero__line"><span>Media &amp;</span></span>
              <span className="pm-hero__line"><span><em>Highlights</em></span></span>
            </h1>

            <p className="pm-hero__lead">
              For over 265 years, Cox &amp; Kings has been part of conversations across
              the globe that truly shaped the changing travel industry.
            </p>

            <dl className="pm-hero__stats">
              {STATS.map((s) => (
                <div className="pm-stat" key={s.label}>
                  <dd className="pm-stat__num">{s.num}</dd>
                  <dt className="pm-stat__lbl">{s.label}</dt>
                </div>
              ))}
            </dl>

            <div className="pm-hero__actions">
              <a href="#pm-wall" className="h26-btn h26-btn-pill h26-btn-lg">
                View coverage <ArrowRight size={16} aria-hidden="true" />
              </a>
              <a href="#pm-desks" className="pm-hero__textcta">
                Press enquiries <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </div>
          </div>
        </header>

        {/* ==================== THE WALL ==================== */}
        <section className="h26-section pm-wall" id="pm-wall" aria-labelledby="pm-wall-h">
          <div className="pm-wrap">
            <div className="pm-head" data-pmreveal>
              <p className="h26-label">Media coverage</p>
              <h2 className="pm-h2" id="pm-wall-h">As featured in</h2>
              <p className="pm-sub">
                Publications that have covered Cox &amp; Kings.
              </p>
            </div>

            <div className="pm-wall__tier" data-pmreveal>
              <span className="pm-wall__tierlabel">Global publications</span>
              <ul className="pm-wall__global">
                {GLOBAL_MASTHEADS.map((p) => (
                  <li key={p.name}>
                    <img className="pm-wall__glogo" src={p.src} alt={p.name} loading="lazy" />
                  </li>
                ))}
              </ul>
            </div>

            <div className="pm-wall__tier">
              <span className="pm-wall__tierlabel" data-pmreveal>Indian publications</span>
              <ul className="pm-wall__grid">
                {OUTLETS.map((o) => (
                  <li className="pm-tile" key={o.name}>
                    <OutletMark name={o.name} domain={o.domain} />
                    <span className="pm-tile__name">{o.name}</span>
                    {o.count > 1 && <span className="pm-tile__n">{o.count} stories</span>}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ==================== MEDIA SPOTLIGHT STORIES ==================== */}
        <section className="h26-section pm-cuts" id="pm-coverage" aria-labelledby="pm-cuts-h">
          <div className="pm-wrap">
            <div className="pm-head" data-pmreveal>
              <p className="h26-label">Press releases</p>
              <h2 className="pm-h2" id="pm-cuts-h">Media Spotlight Stories</h2>
              <p className="pm-sub">
                News stories featuring Cox &amp; Kings.
              </p>
            </div>

            <div className="pm-cuts__grid" data-pmreveal>
              {cards.map((c) => (
                <a
                  className="pm-cut"
                  key={c.url}
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${c.title} — ${c.src}, ${c.date} (opens the original article)`}
                >
                  <div className="pm-cut__mast">
                    <OutletMark name={c.src} domain={DOMAIN_OF[c.src]} size={28} />
                    <span className="pm-cut__src">{c.src}</span>
                    <time className="pm-cut__date" dateTime={c.iso}>{c.date}</time>
                  </div>
                  <h3 className="pm-cut__title">{c.title}</h3>
                  <span className="pm-cut__read">
                    Read the story <ArrowUpRight size={15} aria-hidden="true" />
                  </span>
                </a>
              ))}
            </div>

            {remaining > 0 && (
              <div className="pm-more" data-pmreveal>
                <button
                  type="button"
                  className="pm-morebtn"
                  onClick={() => setCardCount((c) => c + CARDS_STEP)}
                >
                  View more
                  <ChevronDown size={16} aria-hidden="true" />
                </button>
                <span className="pm-more__note">{remaining} more stories</span>
              </div>
            )}
          </div>
        </section>

        {/* ==================== THE SKIFT LINE ==================== */}
        <figure className="pm-quote">
          <div className="pm-wrap pm-quote__inner" data-pmreveal>
            <Quote size={34} className="pm-quote__mark" aria-hidden="true" />
            <blockquote className="pm-quote__text">
              A lot of people had love for Cox&nbsp;&amp;&nbsp;Kings —
              the brand has a <em>high recall value</em>.
            </blockquote>
            <figcaption className="pm-quote__by">
              <cite>SKIFT</cite> · Travel industry news
            </figcaption>
          </div>
        </figure>

        {/* ==================== ACCOLADES & ACHIEVEMENTS ==================== */}
        <section className="h26-section pm-awards" aria-labelledby="pm-awards-h">
          <div className="pm-wrap">
            <div className="pm-head pm-head--center" data-pmreveal>
              <p className="h26-label">Accolades &amp; achievements</p>
              <h2 className="pm-h2" id="pm-awards-h">Celebrated Worldwide, Trusted for Generations</h2>
            </div>

            <ul className="pm-awards__grid">
              {AWARDS.map((a) => (
                <li className="pm-acard" key={a.title}>
                  <img className="pm-acard__img" src={a.img} alt={`${a.by} emblem`} loading="lazy" />
                  <h3 className="pm-acard__title">{a.title}</h3>
                  <p className="pm-acard__by">{a.by}</p>
                  <span className="pm-acard__years">{a.years}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ==================== THE PRESS DESK ==================== */}
        <section className="h26-section pm-desks" id="pm-desks" aria-labelledby="pm-desks-h">
          <div className="pm-wrap">
            <div className="pm-head pm-head--center" data-pmreveal>
              <p className="h26-label h26-label-light">Contact</p>
              <h2 className="pm-h2 pm-h2--light" id="pm-desks-h">Get in touch</h2>
              <p className="pm-sub pm-sub--light">
                For press, corporate or travel enquiries, write to the right desk.
              </p>
            </div>

            <div className="pm-desks__grid" data-pmreveal>
              {DESKS.map((d) => (
                <div className="pm-desk" key={d.label}>
                  <h3 className="pm-desk__label">{d.label}</h3>
                  <p className="pm-desk__note">{d.note}</p>
                  <a className="pm-desk__link" href={`mailto:${d.email}`}>
                    <Mail size={15} aria-hidden="true" /> {d.email}
                  </a>
                  {d.phone && (
                    <a className="pm-desk__link" href={d.phone.phoneHref}>
                      <Phone size={15} aria-hidden="true" /> {d.phone.phoneDisplay}
                    </a>
                  )}
                </div>
              ))}
            </div>

            <div className="pm-desks__cta" data-pmreveal>
              <Link to="/collaborate" className="h26-btn h26-btn-pill h26-btn-lg">
                Collaborate with us <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
