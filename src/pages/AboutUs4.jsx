/* ============================================================================
   Cox & Kings India — ABOUT US, v4  (route: /about-us4)

   Same page as /about-us2 and /about-us3 in every section EXCEPT the history
   timeline, which is rebuilt a second time as "THE RIFFLE".

   WHY IT CHANGED AGAIN
   --------------------
   /about-us3 gave each of the 11 eras its own full viewport. That is ~10
   viewports of scrolling, and because every era used the same layout, it read
   as both long AND repetitive. The scroll length was a symptom; the disease
   was one-era-per-screen.

   So this version stops showing eras one at a time. The eras become a DECK of
   archival plates receding into 3D space — five or six visible at once — and
   scrolling riffles them toward the viewer. Three things fall out of that:

     · Scroll cost drops from ~10 viewports to ~4.5. Cards overlap in depth
       instead of queueing in time, so each era costs 0.45vh, not 0.9vh.
     · Density replaces repetition. A moving stack of plates is a spectacle;
       one centred card shown eleven times is a slideshow.
     · It is scannable. A chronological ruler along the bottom jumps straight
       to any era, and a "Skip to today" control exits the whole section — for
       the visitor who only wants to know the brand is real and move on.

   HOW IT IS DRIVEN
   ----------------
   Not by eleven ScrollTriggers. One scrubbed tween drives a single float,
   `head` (0 → n-1), and every frame each card positions itself purely as a
   function of its distance from the head, `d = i - head`. That means the deck
   is a pure function of scroll — it cannot desync, it scrubs backwards
   perfectly, and adding an era is a data change, not an animation change.
   A frame is ~11 direct element.style writes; GSAP is used only to scrub
   `head` (see the note in render() on why the transforms bypass it).
   ========================================================================== */

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ArrowUpRight, Phone, Mail, ArrowDown } from 'lucide-react';
import { DIRECTOR, TEAM_MAIN, TEAM } from '../data/team';
import { SiteNav, SiteFooter } from '../components/SiteChrome';
import './AboutUs4.css';

gsap.registerPlugin(ScrollTrigger);

const img = (id, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

/* ---------------------------------------------------------------------------
   THE HISTORY. Same 11 moments; `y` is the sortable year the ruler plots by.
   ("1920s" is pinned to 1920 so the deck order stays chronological — with
   1925 it would sit after 1922 and 1924 and the ruler would walk backwards.)
   ------------------------------------------------------------------------- */
const TIMELINE = [
  {
    year: '1758', y: 1758,
    tag: 'The beginning',
    title: 'Richard Cox founds Cox & Co.',
    body: 'On 25 May, while serving Lord Ligonier — commander-in-chief of Britain’s Armed Forces — Richard Cox becomes regimental agent to the Foot Guards, handling supplies, wages, shipping and travel. The travel company is born out of logistics.',
    photo: 'photo-1493976040374-85c8e12f0c0e',
    alt: 'Georgian London, where Cox & Co. was founded in 1758',
  },
  {
    year: '1920s', y: 1920,
    tag: 'A name is made',
    title: 'Cox & Co. merges with Henry S. King & Co.',
    body: 'After the First World War the firm joins with Henry S. King & Co., a shipping agency with deep Indian connections — and becomes Cox & Kings. Offices open across Britain, Egypt, France and India.',
    photo: 'photo-1543783207-ec64e4d95325',
    alt: 'A steamship of the era the Cox & Kings name was formed',
  },
  {
    year: '1922', y: 1922,
    tag: 'In print',
    title: 'Watson’s dispatch box, care of Cox & Co.',
    body: 'Conan Doyle places Dr Watson’s battered tin dispatch box in the vaults of Cox & Co. at Charing Cross. The firm is, by then, woven into the furniture of British life.',
    photo: 'photo-1512453979798-5ea266f8880c',
    alt: 'A writing desk and papers, evoking the Sherlock Holmes story of 1922',
  },
  {
    year: '1924', y: 1924,
    tag: 'The mountain',
    title: 'Outfitting Mallory’s Everest expedition',
    body: 'Cox & Kings supports George Mallory’s attempt on Everest — the expedition that ended in one of exploration’s enduring mysteries.',
    photo: 'photo-1504457047772-27faf1c00561',
    alt: 'High Himalayan peaks, as on the 1924 Everest expedition',
  },
  {
    year: '1931', y: 1931,
    tag: 'A passage to Europe',
    title: 'Mahatma Gandhi travels with Cox & Kings',
    body: 'Gandhi sails for Europe with arrangements made by Cox & Kings — the same year he attends the Round Table Conference in London.',
    photo: 'photo-1524492412937-b28074a5d7da',
    alt: 'India in the 1930s, when Gandhi travelled with Cox & Kings',
  },
  {
    year: '1970', y: 1970,
    tag: 'New hands',
    title: 'Acquired by Grindlays Bank',
    body: 'The banking and travel arms of the business formally part ways. Travel goes on; the ledgers stay behind.',
    photo: 'photo-1517154421773-0529f29ea451',
    alt: 'A bank hall of the period Grindlays acquired Cox & Kings',
  },
  {
    year: '1988', y: 1988,
    tag: 'Westward',
    title: 'The New York office opens',
    body: 'Through the 1980s the company expands into the USA, the Middle East, Africa, East and Southeast Asia and Europe. New York opens its doors in 1988.',
    photo: 'photo-1496813146940-1601b02f81a4',
    alt: 'The New York skyline, where Cox & Kings opened an office in 1988',
  },
  {
    year: '1990', y: 1990,
    tag: 'The new world',
    title: 'Latin American journeys launch',
    body: 'The map keeps widening — Peru, Ecuador, Argentina, Brazil. Few operators are taking travellers there; Cox & Kings is.',
    photo: 'photo-1526392060635-9d6019884377',
    alt: 'Andean ruins, from the Latin American programme launched in 1990',
  },
  {
    year: '2018', y: 2018,
    tag: 'Two and a half centuries',
    title: '260 years, and all seven continents',
    body: 'The company marks its 260th anniversary operating across every continent on earth — including Antarctica.',
    photo: 'photo-1469854523086-cc02fe5d8800',
    alt: 'A world of destinations, marking 260 years of Cox & Kings',
  },
  {
    year: '2024', y: 2024,
    tag: 'The next chapter',
    title: 'Wilson & Hughes acquires Cox & Kings India',
    body: 'The Singapore private-equity firm Wilson & Hughes acquires Cox & Kings India — free of the old entity’s liabilities — and begins rebuilding the brand around modern technology and old-world service.',
    photo: 'photo-1502602898657-3e91760cbb34',
    alt: 'A contemporary skyline, marking the 2024 acquisition by Wilson & Hughes',
  },
  {
    year: 'Today', y: 2026,
    tag: 'Now',
    title: 'The oldest name in travel, started again',
    body: 'A relaunched Cox & Kings India: specialists on the phone, 100+ destinations, and a plan for 300 franchises, preferred agents and holiday clubs across India and beyond.',
    photo: 'photo-1530122037265-a5f1f91d3b99',
    alt: 'A traveller today, in the relaunched Cox & Kings era',
    now: true,
  },
];

/* Unchanged from /about-us2 ------------------------------------------------ */
const PILLARS = [
  { n: '01', title: 'Pace, stated honestly', body: 'Every itinerary tells you how much walking there is, how many early starts, and how many stairs. Nobody should discover that on day three.' },
  { n: '02', title: 'Food that actually suits you', body: 'Vegetarian, Jain and Indian meals arranged in advance — not requested at the table. Say it once, on the booking form.' },
  { n: '03', title: 'Travelling with parents', body: 'Lifts over stairs, longer transfer times, rooms near the lobby, and a tour manager who has been asked all of this before.' },
  { n: '04', title: 'Someone awake while you sleep', body: 'A WhatsApp line to a real person for the whole trip — in your timezone, and in ours.' },
];

const VALUES = [
  { k: 'Discretion', d: 'We have arranged travel for pioneers, poets and prime ministers since 1758. What we know about our travellers stays with us.' },
  { k: 'Reliability', d: 'Two and a half centuries of getting people there and back. A real person answers the phone, and stays with your file end to end.' },
  { k: 'Global reach', d: 'Over 100 destinations across all seven continents, and ground relationships in each of them that took decades to build.' },
  { k: 'Curiosity', d: 'We are trying to recreate the feeling you had as a child — when the world was enormous and everything in it was worth asking about.' },
];

const STATS = [
  { v: '265+', l: 'Years in travel' },
  { v: '100+', l: 'Destinations' },
  { v: '7', l: 'Continents' },
  { v: '1758', l: 'Established' },
];

const WH_FOCUS = [
  { t: 'Travel & Holidays', d: 'Backing technology-enabled travel companies — Cox & Kings foremost among them.' },
  { t: 'Everyday Products', d: 'Supporting fast-growing consumer brands in the FMCG sector.' },
  { t: 'Building Materials', d: 'Investing in eco-friendly, forward-looking construction solutions.' },
];

const WH_PILLARS = [
  { t: 'Smart investing', d: 'Rigorous market analysis and risk assessment before a rupee moves.' },
  { t: 'Operational excellence', d: 'Hands-on process improvement, not capital parked at a distance.' },
  { t: 'Value creation', d: 'Strategic guidance, industry expertise and networks — long after the deal closes.' },
];

const ACCREDITATIONS = ['IATA', 'USTOA', 'Adventure Travel Trade Association', 'ASTA'];

/* ==========================================================================
   THE RIFFLE
   ========================================================================== */

/* Scroll cost of one era, in viewport heights. The whole reason this version
   exists — /about-us3 spent 0.9 here and the section ran to ten screens. */
const PER_ERA = 0.45;

/* How a card sits in space, purely as a function of d = (its index − head).

   d = 0    the plate you are reading: dead centre, crisp, square to the eye.
   d > 0    still to come: recedes along −z, drifts right, tilts away, blurs.
   d < 0    already read: rushes past the camera on +z and slides off left.

   Nothing here is a keyframe — it is one continuous function, which is why the
   deck can be scrubbed in either direction and never desynchronise. */
function place(d) {
  const ahead = d >= 0;
  return {
    x: ahead ? d * 76 : d * 300,
    y: ahead ? d * -26 : d * 40,
    z: ahead ? d * -200 : d * -560,          /* d<0 → +z, toward the viewer */
    rotY: ahead ? -12 - d * 2.2 : -12 + d * 20,
    rotZ: ahead ? d * 0.6 : d * 5,
    /* Cards behind the front one fade and blur with depth; cards that have
       passed blow out fast, so they never smear across what you are reading. */
    opacity: ahead
      ? gsap.utils.clamp(0, 1, 1 - d * 0.17)
      : gsap.utils.clamp(0, 1, 1 + d * 1.9),
    blur: ahead
      ? Math.min(d * 1.7, 8)
      : Math.min(-d * 7, 12),
  };
}

function Timeline() {
  const sectionRef = useRef(null);
  const [active, setActive] = useState(0);
  /* Set by ScrollTrigger once it knows its own scroll range. */
  const seekRef = useRef(null);
  const skipRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      const n = TIMELINE.length;

      mm.add(
        '(min-width: 901px) and (prefers-reduced-motion: no-preference)',
        () => {
          const cards = gsap.utils.toArray('.ab-rf-card', section);
          const odo = section.querySelector('.ab-rf-odo-col');
          const warm = section.querySelector('.ab-rf-warm');

          /* These are written straight to element.style rather than through
             GSAP. `transform` is NOT a GSAP-managed property — GSAP composes
             transforms from x/y/rotationY/… and a raw transform string handed
             to quickSetter is silently dropped. We own these three properties
             outright and recompute them from scratch every frame, so a direct
             style write is both the correct call and the cheapest one.
             (The trade: GSAP's context revert knows nothing about them, so the
             cleanup below has to strip them by hand.) */
          const state = { head: 0 };
          let last = -1;

          const render = () => {
            const head = state.head;

            for (let i = 0; i < cards.length; i++) {
              const p = place(i - head);
              const s = cards[i].style;
              s.transform =
                `translate3d(${p.x}px, ${p.y}px, ${p.z}px) ` +
                `rotateY(${p.rotY}deg) rotateZ(${p.rotZ}deg)`;
              s.opacity = p.opacity;
              s.filter = p.blur > 0.05 ? `blur(${p.blur}px)` : 'none';
            }

            /* The odometer is one tall column of years behind a 1-line window.
               Because it tracks `head` (a float, not an int) the digits roll
               continuously with the scroll rather than snapping era to era. */
            odo.style.transform = `translateY(${(-head / n) * 100}%)`;

            /* 1758 is cold navy; today is warm. Cross-fade the warm wash in
               across the whole passage — a slow, barely-conscious cue that
               you are travelling forward through time. */
            warm.style.opacity = head / (n - 1);

            /* Only re-render React when the era label actually changes. */
            const i = Math.round(head);
            if (i !== last) {
              last = i;
              setActive(i);
            }
          };

          /* ONE tween. `head` is the single source of truth; scrub smooths it. */
          const drive = gsap.to(state, {
            head: n - 1,
            ease: 'none',
            onUpdate: render,
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: () => '+=' + window.innerHeight * n * PER_ERA,
              pin: true,
              scrub: 0.9,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onRefresh: (self) => {
                const span = self.end - self.start;
                /* head maps linearly across the range, so era i lives at i/(n-1). */
                seekRef.current = (i) =>
                  window.scrollTo({
                    top: self.start + (span * i) / (n - 1),
                    behavior: 'smooth',
                  });
                /* Straight past the whole section, for the uninterested.
                   NOT self.end — that is where the pin RELEASES, and at that
                   scroll position the section still fills the viewport. To
                   actually clear it you need one more viewport height, which
                   lands exactly on the bottom of the pin spacer, i.e. the top
                   of the next section. */
                skipRef.current = () =>
                  window.scrollTo({
                    top: self.end + window.innerHeight,
                    behavior: 'smooth',
                  });
              },
            },
          });

          render();

          return () => {
            drive.kill();
            /* Hand-written styles are invisible to gsap.context().revert(), so
               strip them here. Without this, resizing a desktop window down
               past 900px tears this branch down but leaves every card frozen
               mid-riffle — rotated, blurred and half-transparent — on top of
               the static list that is supposed to replace it. */
            cards.forEach((c) => {
              c.style.transform = '';
              c.style.opacity = '';
              c.style.filter = '';
            });
            odo.style.transform = '';
            warm.style.opacity = '';
          };
        }
      );

      /* ---- Narrow viewports: a compact list, not a filmstrip ---------------
         Short cards (16:9, not full-bleed) so the whole history is a few
         thumb-flicks, and each one lifts in as it arrives.                  */
      mm.add(
        '(max-width: 900px) and (prefers-reduced-motion: no-preference)',
        () => {
          gsap.utils.toArray('.ab-rf-card', section).forEach((card) => {
            gsap.fromTo(
              card,
              { opacity: 0, y: 30 },
              {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power3.out',
                scrollTrigger: { trigger: card, start: 'top 86%' },
              }
            );
          });
        }
      );

      /* ---- Reduced motion: neither branch runs. The CSS renders a plain,
         fully-visible list — nothing hidden, nothing pinned.               */
    }, section);

    return () => ctx.revert();
  }, []);

  const cur = TIMELINE[active];

  return (
    <section className="ab-rf" ref={sectionRef} id="history" aria-labelledby="ab-rf-h">
      <div className="ab-rf-stage">
        {/* atmosphere: cold base + a warm wash that fades in across the years */}
        <span className="ab-rf-cold" aria-hidden="true" />
        <span className="ab-rf-warm" aria-hidden="true" />
        <span className="ab-rf-grain" aria-hidden="true" />

        {/* ------------------------------------------------- corner heading */}
        <header className="ab-rf-head">
          <p className="ab-eyebrow ab-eyebrow--light">Our history</p>
          <h2 className="ab-rf-h" id="ab-rf-h">
            Two hundred and sixty-five <em>years</em>
          </h2>
        </header>

        {/* -------------------------------------------------- the odometer --
            A column of every year, behind a one-line window. Scrubs with the
            scroll, so the numerals physically roll from 1758 to Today. */}
        <div className="ab-rf-odo" aria-hidden="true">
          <div className="ab-rf-odo-col">
            {TIMELINE.map((e) => (
              <span className="ab-rf-odo-y" key={e.year}>
                {e.year}
              </span>
            ))}
          </div>
        </div>

        {/* ------------------------------------------------------- the deck */}
        <div className="ab-rf-deck-wrap">
          <ol className="ab-rf-deck">
            {TIMELINE.map((e, i) => (
              <li
                className={`ab-rf-card${e.now ? ' is-now' : ''}`}
                key={e.year}
                aria-label={`${e.year} — ${e.title}`}
                style={{ '--i': i }}
              >
                <img src={img(e.photo, 900)} alt={e.alt} loading="lazy" />
                <span className="ab-rf-card-edge" aria-hidden="true" />
                <span className="ab-rf-card-year" aria-hidden="true">
                  {e.year}
                </span>
                {/* Visible only on the static/mobile rendering — on the deck
                    the copy lives in the panel, not on the plate. */}
                <div className="ab-rf-card-copy">
                  <p className="ab-rf-card-tag">{e.tag}</p>
                  <h3 className="ab-rf-card-title">{e.title}</h3>
                  <p className="ab-rf-card-body">{e.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* ------------------------------------------------- the copy panel --
            Keyed on the era, so React remounts it and the CSS entrance
            animation re-fires on every change — the words snap in as the
            plate lands, rather than cross-fading limply. */}
        <div className="ab-rf-panel" key={active}>
          <p className="ab-rf-panel-tag">{cur.tag}</p>
          <h3 className="ab-rf-panel-title">{cur.title}</h3>
          <p className="ab-rf-panel-body">{cur.body}</p>
        </div>

        {/* ----------------------------------------------------- the ruler --
            The escape hatch AND the map. Every era is a real button, so a
            visitor who only wants 2024 can have 2024 in one click. */}
        <nav className="ab-rf-ruler" aria-label="Jump to a moment in our history">
          <span className="ab-rf-ruler-line" aria-hidden="true" />
          <ul>
            {TIMELINE.map((e, i) => (
              <li key={e.year}>
                <button
                  type="button"
                  className={`ab-rf-mark${i === active ? ' is-active' : ''}${
                    i < active ? ' is-past' : ''
                  }`}
                  aria-current={i === active ? 'true' : undefined}
                  onClick={() => seekRef.current?.(i)}
                >
                  <span className="ab-rf-mark-tick" aria-hidden="true" />
                  <span className="ab-rf-mark-year">{e.year}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className="ab-rf-skip"
          onClick={() => skipRef.current?.()}
        >
          Skip to today <ArrowDown size={13} />
        </button>
      </div>
    </section>
  );
}

/* ==========================================================================
   Page — everything outside <Timeline /> is /about-us2, unchanged.
   ========================================================================== */
export default function AboutUs4() {
  const heroRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap
          .timeline({ defaults: { ease: 'power3.out' } })
          .fromTo('.ab-hero-eyebrow', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 })
          .fromTo(
            '.ab-hero-line span',
            { yPercent: 115 },
            { yPercent: 0, duration: 1.05, stagger: 0.09 },
            '-=0.35'
          )
          .fromTo('.ab-hero-lede', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
          .fromTo('.ab-hero-cue', { opacity: 0 }, { opacity: 1, duration: 0.6 }, '-=0.3');

        gsap.to('.ab-hero-media img', {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: { trigger: '.ab-hero', start: 'top top', end: 'bottom top', scrub: true },
        });

        gsap.utils.toArray('[data-reveal]').forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 28 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: 'power3.out',
              scrollTrigger: { trigger: el, start: 'top 85%' },
            }
          );
        });

        gsap.utils.toArray('.ab-stat').forEach((el, i) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              delay: i * 0.08,
              ease: 'power2.out',
              scrollTrigger: { trigger: '.ab-stats', start: 'top 85%' },
            }
          );
        });
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="h26 new-typo ab" ref={heroRef}>
      <SiteNav />

      {/* --------------------------------------------------------------- hero */}
      <section className="ab-hero">
        <div className="ab-hero-media" aria-hidden="true">
          <img src={img('photo-1469854523086-cc02fe5d8800', 2000)} alt="" />
          <span className="ab-hero-scrim" />
          <span className="ab-hero-grain" />
        </div>

        <div className="ab-hero-inner">
          <p className="ab-hero-eyebrow">Cox &amp; Kings · India · Est. 1758</p>
          <h1 className="ab-hero-title">
            <span className="ab-hero-line"><span>The longest-established</span></span>
            <span className="ab-hero-line"><span><em>travel company</em> on earth.</span></span>
          </h1>
          <p className="ab-hero-lede">
            We have been arranging journeys since a year when the Seven Years’ War was still being
            fought — for pioneers, poets and prime ministers. Two hundred and sixty-five years on, we
            are trying to recreate one particular feeling: the one you had as a child, when the world
            was enormous and every part of it was worth asking about.
          </p>
          <div className="ab-hero-cue">
            <span className="ab-hero-cue-line" aria-hidden="true" />
            <span>Scroll</span>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- pillars */}
      <section className="ab-pillars" aria-labelledby="ab-pillars-h">
        <div className="ab-wrap">
          <header className="ab-sec-head" data-reveal>
            <p className="ab-eyebrow">On the ground</p>
            <h2 className="ab-h2" id="ab-pillars-h">
              How we look after you <em>on the road</em>.
            </h2>
          </header>

          <div className="ab-pillars-grid">
            {PILLARS.map((p) => (
              <article className="ab-pillar" key={p.n} data-reveal>
                <span className="ab-pillar-n">{p.n}</span>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------- timeline (the new one) */}
      <Timeline />

      {/* --------------------------------------------------------------- stats */}
      <section className="ab-stats" aria-label="Cox & Kings in numbers">
        <div className="ab-wrap ab-stats-grid">
          {STATS.map((s) => (
            <div className="ab-stat" key={s.l}>
              <p className="ab-stat-v">{s.v}</p>
              <p className="ab-stat-l">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------------- values */}
      <section className="ab-values" aria-labelledby="ab-values-h">
        <div className="ab-wrap ab-values-inner">
          <div className="ab-values-aside">
            <div data-reveal>
              <p className="ab-eyebrow">How we work</p>
              <h2 className="ab-h2" id="ab-values-h">
                The character of the firm has not <em>changed</em>.
              </h2>
              <p className="ab-lede">
                In 1758 we were trusted with the wages, supplies and passages of the British Armed
                Forces and the aristocracy. The work was built on discretion, reliability and global
                reach. It still is.
              </p>
              <button type="button" className="h26-btn h26-btn-ghost">
                See how we plan a journey <ArrowRight size={15} />
              </button>
            </div>
          </div>

          <ul className="ab-values-list">
            {VALUES.map((v) => (
              <li key={v.k} data-reveal>
                <h3>{v.k}</h3>
                <p>{v.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ----------------------------------------------------- Wilson & Hughes */}
      <section className="ab-wh" aria-labelledby="ab-wh-h">
        <div className="ab-wrap">
          <div className="ab-wh-top">
            <div data-reveal>
              <p className="ab-eyebrow ab-eyebrow--light">Our owners</p>
              <h2 className="ab-h2 ab-h2--light" id="ab-wh-h">
                Wilson &amp; Hughes
              </h2>
              <dl className="ab-wh-meta">
                <div>
                  <dt>Based</dt>
                  <dd>Singapore</dd>
                </div>
                <div>
                  <dt>Sector</dt>
                  <dd>Private equity</dd>
                </div>
                <div>
                  <dt>Acquired Cox &amp; Kings</dt>
                  <dd>2024</dd>
                </div>
              </dl>
            </div>

            <div className="ab-wh-intro" data-reveal>
              <p>
                In 2024, the Singapore-based private equity firm <strong>Wilson &amp; Hughes Pte
                Ltd</strong> acquired Cox &amp; Kings India — a company carrying more than 270 years
                of legacy — through the National Company Law Tribunal, free of the former entity’s
                liabilities.
              </p>
              <p>
                They describe themselves as dynamic and forward-thinking, unlocking premier
                investment opportunities across dynamic sectors and turning visions into value-driven
                realities. In practice, for us, it has meant something simpler: the capital and the
                patience to rebuild an old name properly — blending its heritage with contemporary
                innovation, so travellers can discover the world on their own terms.
              </p>
              <a
                href="https://wilsonandhughes.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="ab-link-out"
              >
                wilsonandhughes.com <ArrowUpRight size={15} />
              </a>
            </div>
          </div>

          <div className="ab-wh-cols">
            <div className="ab-wh-col" data-reveal>
              <h3 className="ab-wh-ch">Where they invest</h3>
              <ul className="ab-wh-list">
                {WH_FOCUS.map((f) => (
                  <li key={f.t}>
                    <h4>{f.t}</h4>
                    <p>{f.d}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="ab-wh-col" data-reveal>
              <h3 className="ab-wh-ch">How they operate</h3>
              <ul className="ab-wh-list">
                {WH_PILLARS.map((f) => (
                  <li key={f.t}>
                    <h4>{f.t}</h4>
                    <p>{f.d}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="ab-wh-col ab-wh-quote" data-reveal>
              <blockquote>
                “Empowering travellers to discover the world on their terms — blending heritage with
                contemporary innovation.”
              </blockquote>
              <p className="ab-wh-attr">Wilson &amp; Hughes, on acquiring Cox &amp; Kings</p>
              <ul className="ab-wh-tags">
                <li>Excellence</li>
                <li>Innovation</li>
                <li>Hands-on</li>
                <li>Long-term value</li>
                <li>Transparency</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- team */}
      <section className="ab-team" aria-labelledby="ab-team-h">
        <span className="ab-team-rules" aria-hidden="true" />

        <div className="ab-wrap">
          <header className="ab-sec-head" data-reveal>
            <p className="ab-eyebrow">The people</p>
            <h2 className="ab-h2" id="ab-team-h">
              The people putting it back <em>together</em>.
            </h2>
            <p className="ab-lede">
              A small leadership team, rebuilding a 265-year-old company from the inside out.
            </p>
          </header>

          <article className="ab-director" data-reveal>
            <figure className="ab-director-photo">
              <img src={img(DIRECTOR.photo, 1100)} alt={DIRECTOR.name} loading="lazy" />
              <span className="ab-director-frame" aria-hidden="true" />
            </figure>

            <div className="ab-director-body">
              <p className="ab-director-kicker">
                <span>{DIRECTOR.role}</span>
                <i aria-hidden="true" />
                <span>{DIRECTOR.unit}</span>
              </p>
              <h3 className="ab-director-name">{DIRECTOR.name}</h3>
              <p className="ab-director-bio">{DIRECTOR.bio}</p>
            </div>
          </article>

          <ul className="ab-heads">
            {TEAM_MAIN.map((m) => (
              <li className="ab-head" key={m.name} data-reveal>
                <figure className="ab-head-photo">
                  <img src={img(m.photo, 700)} alt={m.name} loading="lazy" />
                  <figcaption className="ab-head-unit">{m.unit}</figcaption>
                </figure>

                <div className="ab-head-body">
                  <span className="ab-head-n" aria-hidden="true">{m.n}</span>
                  <h3 className="ab-head-name">{m.name}</h3>
                  <p className="ab-head-role">{m.role}</p>
                  <p className="ab-head-bio">{m.bio}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="ab-team-more" data-reveal>
            <Link to="/about-us2/team" className="h26-btn h26-btn-ghost">
              Meet the full team — all {TEAM.length} <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ accreditations */}
      <section className="ab-accred" aria-label="Accreditations">
        <div className="ab-wrap ab-accred-inner" data-reveal>
          <p className="ab-eyebrow">Members of</p>
          <ul>
            {ACCREDITATIONS.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* ----------------------------------------------------------------- CTA */}
      <section className="ab-cta" aria-labelledby="ab-cta-h">
        <div className="ab-cta-media" aria-hidden="true">
          <img src={img('photo-1469854523086-cc02fe5d8800', 2000)} alt="" loading="lazy" />
          <span className="ab-cta-scrim" />
          <span className="ab-cta-grain" />
        </div>

        <div className="ab-wrap ab-cta-inner" data-reveal>
          <h2 className="ab-h2 ab-h2--light" id="ab-cta-h">
            Start your <em>story</em>.
          </h2>
          <p>
            Tell us where you have always meant to go. A specialist — not a call centre — will take
            it from there.
          </p>
          <div className="ab-cta-actions">
            <Link to="/contact" className="h26-btn h26-btn-accent h26-btn-lg">
              Talk to a specialist <ArrowRight size={15} />
            </Link>
            <Link to="/journeys" className="h26-btn h26-btn-glass">
              Browse journeys
            </Link>
          </div>
          <div className="ab-cta-contact">
            <a href="tel:+918556001700">
              <Phone size={14} /> +91 8556 001 700
            </a>
            <a href="mailto:holidays@coxandkings.com">
              <Mail size={14} /> holidays@coxandkings.com
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
