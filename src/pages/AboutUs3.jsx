/* ============================================================================
   Cox & Kings India — ABOUT US, v3  (route: /about-us3)

   Identical to /about-us2 in every section EXCEPT the history timeline, which
   is rebuilt from scratch as "THE LONG PASSAGE" — a pinned, scroll-scrubbed
   cinematic chapter stack instead of the old horizontal rail.

   The design idea: each era is a full-viewport scene assembled from four
   layers that travel at different rates, so scrolling reads as moving THROUGH
   depth rather than along a line —

     depth 1  ab-tx-bleed   full-bleed archival photo, blurred + dimmed.
                            Drifts slowest and de-scales. The "far distance".
     depth 2  ab-tx-ghost   the year set enormous in outlined Cormorant.
                            Drifts COUNTER to the scroll — the strongest depth
                            cue in the whole scene.
     depth 3  ab-tx-plate   a crisp portrait plate of the same photograph.
                            Wipes in with clip-path while the image inside
                            counter-scales, so the frame reveals rather than
                            slides. Foreground object.
     depth 4  ab-tx-copy    the words. Fastest layer, nearest the reader.

   Chapters cross-dissolve on ONE master GSAP timeline scrubbed by a single
   ScrollTrigger, so there is no per-chapter trigger arithmetic and the whole
   sequence is scrubbable in both directions.

   Everything below the timeline (hero, pillars, stats, values, Wilson &
   Hughes, team, accreditations, CTA) is carried over from AboutUs.jsx
   unchanged, and AboutUs3.css re-uses AboutUs.css wholesale for them.
   ========================================================================== */

import { useEffect, useRef, useState } from 'react';
import { SmartLink as Link, CALLBACK } from '../components/ScheduleCall';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ArrowUpRight, Phone, Mail } from 'lucide-react';
import { DIRECTOR, TEAM_MAIN, TEAM } from '../data/team';
import { SiteNav, SiteFooter } from '../components/SiteChrome';
import './AboutUs3.css';

gsap.registerPlugin(ScrollTrigger);

const img = (id, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

/* ---------------------------------------------------------------------------
   THE HISTORY. Shared across Cox & Kings India and UK — the firm is one firm.
   ------------------------------------------------------------------------- */
const TIMELINE = [
  {
    year: '1758',
    tag: 'The beginning',
    title: 'Richard Cox founds Cox & Co.',
    body: 'On 25 May, while serving Lord Ligonier — commander-in-chief of Britain’s Armed Forces — Richard Cox becomes regimental agent to the Foot Guards, handling supplies, wages, shipping and travel. The travel company is born out of logistics.',
    photo: 'photo-1493976040374-85c8e12f0c0e',
    alt: 'Georgian London, where Cox & Co. was founded in 1758',
  },
  {
    year: '1920s',
    tag: 'A name is made',
    title: 'Cox & Co. merges with Henry S. King & Co.',
    body: 'After the First World War the firm joins with Henry S. King & Co., a shipping agency with deep Indian connections — and becomes Cox & Kings. Offices open across Britain, Egypt, France and India.',
    photo: 'photo-1543783207-ec64e4d95325',
    alt: 'A steamship of the era the Cox & Kings name was formed',
  },
  {
    year: '1922',
    tag: 'In print',
    title: 'Watson’s dispatch box, care of Cox & Co.',
    body: 'Conan Doyle places Dr Watson’s battered tin dispatch box in the vaults of Cox & Co. at Charing Cross. The firm is, by then, woven into the furniture of British life.',
    photo: 'photo-1512453979798-5ea266f8880c',
    alt: 'A writing desk and papers, evoking the Sherlock Holmes story of 1922',
  },
  {
    year: '1924',
    tag: 'The mountain',
    title: 'Outfitting Mallory’s Everest expedition',
    body: 'Cox & Kings supports George Mallory’s attempt on Everest — the expedition that ended in one of exploration’s enduring mysteries.',
    photo: 'photo-1504457047772-27faf1c00561',
    alt: 'High Himalayan peaks, as on the 1924 Everest expedition',
  },
  {
    year: '1931',
    tag: 'A passage to Europe',
    title: 'Mahatma Gandhi travels with Cox & Kings',
    body: 'Gandhi sails for Europe with arrangements made by Cox & Kings — the same year he attends the Round Table Conference in London.',
    photo: 'photo-1524492412937-b28074a5d7da',
    alt: 'India in the 1930s, when Gandhi travelled with Cox & Kings',
  },
  {
    year: '1970',
    tag: 'New hands',
    title: 'Acquired by Grindlays Bank',
    body: 'The banking and travel arms of the business formally part ways. Travel goes on; the ledgers stay behind.',
    photo: 'photo-1517154421773-0529f29ea451',
    alt: 'A bank hall of the period Grindlays acquired Cox & Kings',
  },
  {
    year: '1988',
    tag: 'Westward',
    title: 'The New York office opens',
    body: 'Through the 1980s the company expands into the USA, the Middle East, Africa, East and Southeast Asia and Europe. New York opens its doors in 1988.',
    photo: 'photo-1496813146940-1601b02f81a4',
    alt: 'The New York skyline, where Cox & Kings opened an office in 1988',
  },
  {
    year: '1990',
    tag: 'The new world',
    title: 'Latin American journeys launch',
    body: 'The map keeps widening — Peru, Ecuador, Argentina, Brazil. Few operators are taking travellers there; Cox & Kings is.',
    photo: 'photo-1526392060635-9d6019884377',
    alt: 'Andean ruins, from the Latin American programme launched in 1990',
  },
  {
    year: '2018',
    tag: 'Two and a half centuries',
    title: '260 years, and all seven continents',
    body: 'The company marks its 260th anniversary operating across every continent on earth — including Antarctica.',
    photo: 'photo-1469854523086-cc02fe5d8800',
    alt: 'A world of destinations, marking 260 years of Cox & Kings',
  },
  {
    year: '2024',
    tag: 'The next chapter',
    title: 'Wilson & Hughes acquires Cox & Kings India',
    body: 'The Singapore private-equity firm Wilson & Hughes acquires Cox & Kings India — free of the old entity’s liabilities — and begins rebuilding the brand around modern technology and old-world service.',
    photo: 'photo-1502602898657-3e91760cbb34',
    alt: 'A contemporary skyline, marking the 2024 acquisition by Wilson & Hughes',
  },
  {
    year: 'Today',
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
  {
    n: '01',
    title: 'Pace, stated honestly',
    body: 'Every itinerary tells you how much walking there is, how many early starts, and how many stairs. Nobody should discover that on day three.',
  },
  {
    n: '02',
    title: 'Food that actually suits you',
    body: 'Vegetarian, Jain and Indian meals arranged in advance — not requested at the table. Say it once, on the booking form.',
  },
  {
    n: '03',
    title: 'Travelling with parents',
    body: 'Lifts over stairs, longer transfer times, rooms near the lobby, and a tour manager who has been asked all of this before.',
  },
  {
    n: '04',
    title: 'Someone awake while you sleep',
    body: 'A WhatsApp line to a real person for the whole trip — in your timezone, and in ours.',
  },
];

const VALUES = [
  {
    k: 'Discretion',
    d: 'We have arranged travel for pioneers, poets and prime ministers since 1758. What we know about our travellers stays with us.',
  },
  {
    k: 'Reliability',
    d: 'Two and a half centuries of getting people there and back. A real person answers the phone, and stays with your file end to end.',
  },
  {
    k: 'Global reach',
    d: 'Over 100 destinations across all seven continents, and ground relationships in each of them that took decades to build.',
  },
  {
    k: 'Curiosity',
    d: 'We are trying to recreate the feeling you had as a child — when the world was enormous and everything in it was worth asking about.',
  },
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
   THE LONG PASSAGE — pinned, scrubbed, layered-parallax chapter stack.

   Master-timeline geometry (in abstract "units", one unit per chapter):

     LEAD ─┬── chapter 0 ──┬── chapter 1 ──┬── … ── chapter n-1 ──┬─ TAIL
           │               │               │                      │
       t0 = LEAD + i       │           t0 + 1                     │
       enters over [t0 - IN, t0]   holds   exits over [t0 + 1 - IN, t0 + 1]

   Because a chapter's exit window is exactly the next chapter's entry window,
   the dissolve is symmetric and no gap or double-exposure ever opens up.
   ========================================================================== */
const LEAD = 0.55;   // a beat where only the section heading is on screen
const TAIL = 0.35;   // a beat after the last chapter, before the pin releases
const IN = 0.4;      // length of the cross-dissolve

function Timeline() {
  const sectionRef = useRef(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  /* Filled in by the ScrollTrigger so the year spine can scroll-to a chapter. */
  const seekRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      const n = TIMELINE.length;

      /* ---- Wide viewports, motion allowed: the pinned depth stack --------- */
      mm.add(
        '(min-width: 901px) and (prefers-reduced-motion: no-preference)',
        () => {
          const chapters = gsap.utils.toArray('.ab-tx-chapter', section);

          /* The master's real duration is whatever the tweens below add up to.
             Read it back from GSAP once they are all on the timeline rather
             than recomputing it by hand here — the two WILL drift apart
             otherwise, and every scroll-position ↔ chapter mapping below
             depends on getting it exactly right. Assigned after build; the
             callbacks are closures and only ever run afterwards. */
          let total = 0;

          /* One master timeline. Its own duration is in units; ScrollTrigger
             scrubs it against a scroll distance of ~0.9 viewports per chapter. */
          const master = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: () => '+=' + window.innerHeight * n * 0.9,
              pin: true,
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                setProgress(self.progress);
                /* Which chapter owns the screen right now. The label flips at
                   the MIDPOINT of the dissolve (IN / 2), i.e. when the incoming
                   chapter passes 50% opacity — flipping at the start of the
                   dissolve would rename the scene while the old one is still
                   the one you can actually see. */
                const t = self.progress * total;
                const i = Math.floor(t - LEAD + IN / 2);
                setActive(gsap.utils.clamp(0, n - 1, i));
              },
              onRefresh: (self) => {
                seekRef.current = (i) => {
                  /* Land in the middle of chapter i's hold, not on its edge. */
                  const at = (LEAD + i + 0.4) / total;
                  window.scrollTo({
                    top: self.start + (self.end - self.start) * at,
                    behavior: 'smooth',
                  });
                };
              },
            },
          });

          /* The heading dissolves as the first chapter arrives. */
          master.to('.ab-tx-head', { autoAlpha: 0, y: -40, duration: LEAD - 0.1 }, 0.1);

          chapters.forEach((ch, i) => {
            const t0 = LEAD + i;
            const q = (sel) => ch.querySelector(sel);

            const bleed = q('.ab-tx-bleed img');
            const ghost = q('.ab-tx-ghost');
            const plate = q('.ab-tx-plate');
            const plateImg = q('.ab-tx-plate img');
            const copy = q('.ab-tx-copy');
            const reveals = ch.querySelectorAll('.ab-tx-reveal > *');
            const rule = q('.ab-tx-rule');

            /* -- cross-dissolve ------------------------------------------- */
            master.fromTo(
              ch,
              { autoAlpha: 0 },
              { autoAlpha: 1, duration: IN },
              t0 - IN
            );
            if (i < n - 1) master.to(ch, { autoAlpha: 0, duration: IN }, t0 + 1 - IN);

            /* -- depth 1: the far backdrop. Slowest, and settles out of its
                  over-scale as the chapter lands, so the world "arrives". -- */
            master.fromTo(
              bleed,
              { yPercent: -5, scale: 1.32 },
              { yPercent: 5, scale: 1.14, duration: 1 + IN },
              t0 - IN
            );

            /* -- depth 2: the ghost year, travelling AGAINST the scroll ---- */
            master.fromTo(
              ghost,
              { yPercent: 26, xPercent: 4 },
              { yPercent: -26, xPercent: -4, duration: 1 + IN },
              t0 - IN
            );

            /* -- depth 3: the plate. A clip-path wipe uncovers the frame
                  while the photo inside counter-scales — the frame reveals,
                  the image does not slide. Then the whole plate parallaxes. */
            master
              .fromTo(
                plate,
                { clipPath: 'inset(100% 0% 0% 0%)' },
                { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.55, ease: 'power2.out' },
                t0 - IN
              )
              .fromTo(
                plateImg,
                { scale: 1.4, yPercent: -8 },
                { scale: 1.06, yPercent: 0, duration: 1 + IN },
                t0 - IN
              )
              .fromTo(
                plate,
                { yPercent: 12 },
                { yPercent: -12, duration: 1 + IN },
                t0 - IN
              );

            /* -- depth 4: the words. Fastest layer, masked line-by-line. --- */
            master
              .fromTo(
                copy,
                { yPercent: 16 },
                { yPercent: -16, duration: 1 + IN },
                t0 - IN
              )
              .fromTo(
                reveals,
                { yPercent: 115 },
                { yPercent: 0, duration: 0.55, stagger: 0.07, ease: 'power3.out' },
                t0 - IN + 0.12
              )
              .fromTo(
                rule,
                { scaleX: 0 },
                { scaleX: 1, duration: 0.6, ease: 'power2.out' },
                t0 - IN + 0.2
              );
          });

          /* An empty tween that exists only to extend the timeline, so the last
             chapter holds on screen for a beat instead of the pin releasing the
             instant its parallax runs out. */
          master.to({}, { duration: TAIL }, LEAD + n);

          /* NOW the duration is final — take it from the source of truth. */
          total = master.duration();

          /* ---- pointer parallax: the scene leans as the cursor moves ------
             Layered against the scroll parallax, this is what sells depth
             while the reader is holding still and reading.                 */
          const stage = section.querySelector('.ab-tx-stage');
          const setX = gsap.quickTo(stage, '--lean-x', { duration: 0.9, ease: 'power3' });
          const setY = gsap.quickTo(stage, '--lean-y', { duration: 0.9, ease: 'power3' });
          const onMove = (e) => {
            setX((e.clientX / window.innerWidth - 0.5) * 2);
            setY((e.clientY / window.innerHeight - 0.5) * 2);
          };
          window.addEventListener('pointermove', onMove);
          return () => window.removeEventListener('pointermove', onMove);
        }
      );

      /* ---- Narrow viewports, motion allowed --------------------------------
         No pin, no dissolve. Chapters are a plain vertical stack; each photo
         keeps a real (if gentle) parallax against its own frame, and the copy
         rises as it arrives. Immersive enough, and never a scroll trap.    */
      mm.add(
        '(max-width: 900px) and (prefers-reduced-motion: no-preference)',
        () => {
          gsap.utils.toArray('.ab-tx-chapter', section).forEach((ch) => {
            gsap.fromTo(
              ch.querySelector('.ab-tx-plate img'),
              { yPercent: -10 },
              {
                yPercent: 10,
                ease: 'none',
                scrollTrigger: { trigger: ch, start: 'top bottom', end: 'bottom top', scrub: true },
              }
            );
            gsap.fromTo(
              ch.querySelector('.ab-tx-copy'),
              { opacity: 0, y: 26 },
              {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power3.out',
                scrollTrigger: { trigger: ch, start: 'top 78%' },
              }
            );
          });
        }
      );

      /* ---- Reduced motion: no matchMedia branch runs at all. Nothing is
         hidden, nothing moves; the CSS renders a legible vertical list.   */
    }, section);

    return () => ctx.revert();
  }, []);

  const current = TIMELINE[active];

  return (
    <section className="ab-tx" ref={sectionRef} id="history" aria-labelledby="ab-tx-h">
      <div className="ab-tx-stage">
        {/* ---------------------------------------------------------- heading */}
        <header className="ab-tx-head">
          <p className="ab-eyebrow ab-eyebrow--light">Our history</p>
          <h2 className="ab-tx-h" id="ab-tx-h">
            Two hundred and sixty-five <em>years</em>
          </h2>
          <p className="ab-tx-sub">
            Eleven moments, from a regimental agent’s ledger in 1758 to the company we are
            rebuilding today. Keep scrolling — the passage moves around you.
          </p>
          <p className="ab-tx-cue" aria-hidden="true">
            <span className="ab-tx-cue-rule" />
            Scroll
          </p>
        </header>

        {/* --------------------------------------------------------- chapters */}
        <ol className="ab-tx-chapters">
          {TIMELINE.map((e) => (
            <li
              className={`ab-tx-chapter${e.now ? ' is-now' : ''}`}
              key={e.year}
              aria-label={`${e.year} — ${e.title}`}
            >
              {/* depth 1 — the far distance */}
              <div className="ab-tx-bleed" aria-hidden="true">
                <img src={img(e.photo, 1600)} alt="" loading="lazy" />
              </div>

              {/* depth 2 — the year, enormous and hollow. The wrapper does the
                  centring so GSAP owns the transform on the numeral itself. */}
              <div className="ab-tx-ghostwrap" aria-hidden="true">
                <span className="ab-tx-ghost">{e.year}</span>
              </div>

              {/* depth 3 — the plate */}
              <figure className="ab-tx-plate">
                <img src={img(e.photo, 1600)} alt={e.alt} loading="lazy" />
                <span className="ab-tx-plate-edge" aria-hidden="true" />
              </figure>

              {/* depth 4 — the words */}
              <div className="ab-tx-copy">
                <p className="ab-tx-tag ab-tx-reveal">
                  <span>{e.tag}</span>
                </p>
                <h3 className="ab-tx-title ab-tx-reveal">
                  <span>{e.title}</span>
                </h3>
                <span className="ab-tx-rule" aria-hidden="true" />
                <p className="ab-tx-body ab-tx-reveal">
                  <span>{e.body}</span>
                </p>
              </div>
            </li>
          ))}
        </ol>

        {/* ----------------------------------------------- atmosphere overlays */}
        <span className="ab-tx-vignette" aria-hidden="true" />
        <span className="ab-tx-grain" aria-hidden="true" />

        {/* ------------------------------------------------------- year spine */}
        <nav className="ab-tx-spine" aria-label="Jump to a moment in our history">
          <span className="ab-tx-spine-base" aria-hidden="true" />
          <span
            className="ab-tx-spine-fill"
            aria-hidden="true"
            style={{ transform: `scaleY(${progress})` }}
          />
          <ul>
            {TIMELINE.map((e, i) => (
              <li key={e.year}>
                <button
                  type="button"
                  className={`ab-tx-tick${i === active ? ' is-active' : ''}`}
                  aria-current={i === active ? 'true' : undefined}
                  onClick={() => seekRef.current?.(i)}
                >
                  <span className="ab-tx-tick-dot" aria-hidden="true" />
                  <span className="ab-tx-tick-year">{e.year}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* -------------------------------------------------------------- HUD */}
        <div className="ab-tx-hud" aria-hidden="true">
          <span className="ab-tx-hud-idx">
            {String(active + 1).padStart(2, '0')}
            <i>/</i>
            {String(TIMELINE.length).padStart(2, '0')}
          </span>
          <span className="ab-tx-hud-year">{current.year}</span>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   Page — everything outside <Timeline /> is /about-us2, unchanged.
   ========================================================================== */
export default function AboutUs3() {
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
            <Link to={CALLBACK} className="h26-btn h26-btn-accent h26-btn-lg">
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
