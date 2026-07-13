/* ============================================================================
   Cox & Kings India — ABOUT US  (route: /about-us2)

   Self-contained page (own chrome + own CSS), matching the repo convention.
   The centrepiece is a PINNED, SCROLL-SCRUBBED HORIZONTAL TIMELINE built with
   GSAP ScrollTrigger + containerAnimation, modelled on the supplied
   "Timeline animation.mov": a glowing spine travels sideways, nodes pop on the
   line, elbow connectors draw alternately above/below, and a circular medallion
   reveals at each year.

   Content sources:
     · coxandkings.com/about-us            (India — voice, pillars, services)
     · coxandkingstravel.com/about-us      (shared 1758-onwards history)
     · wilsonandhughes.com                 (owner: description, values, focus)

   Fonts: Cormorant Garamond (display) + Work Sans (body/UI) — both already
   loaded in index.html. Colour/spacing/button tokens from design.md.

   NOTE: Karan Agarwal is the only REAL named person here. Every specialist in
   TEAM below is a fictional placeholder — swap in real staff + photography.
   ========================================================================== */

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ArrowUpRight, Phone, Mail } from 'lucide-react';
import { DIRECTOR, TEAM_MAIN, TEAM } from '../data/team';
import { SiteNav, SiteFooter } from '../components/SiteChrome';
/* AboutUs.css must come AFTER the chrome's stylesheets so .ab's own root
   (background, overflow-x: clip) wins over the .h26 root it sits beside. */
import './AboutUs.css';

gsap.registerPlugin(ScrollTrigger);

/* Unsplash helper — same pattern the rest of the site uses. */
const img = (id, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

/* ---------------------------------------------------------------------------
   An arched plate — the same treatment the images get on /about-us1.

   Two motions, both scroll-driven:
     · the frame WIPES UP from nothing (clip-path inset 100% → 0), so the
       picture is uncovered rather than faded in;
     · the picture itself DRIFTS against its frame as the section passes
       (yPercent -8 → 8, scrubbed) — which is why the img is 116% tall: it
       needs the overscan, or the drift would expose the frame's edge.
   ------------------------------------------------------------------------- */
function Arch({ src, alt, className = '', ratio = '3 / 4' }) {
  const wrap = useRef(null);
  const pic = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(
        wrap.current,
        { clipPath: 'inset(100% 0 0 0)' },
        {
          clipPath: 'inset(0% 0 0 0)',
          duration: 1.25,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: wrap.current,
            start: 'top 86%',
            once: true,
            invalidateOnRefresh: true,
          },
        }
      );

      gsap.fromTo(
        pic.current,
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: 'none',
          scrollTrigger: {
            trigger: wrap.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );
    });

    return () => mm.revert();
  }, []);

  return (
    <figure ref={wrap} className={`ab-arch ${className}`} style={{ aspectRatio: ratio }}>
      <img ref={pic} src={src} alt={alt} loading="lazy" decoding="async" />
      <span className="ab-arch-ring" aria-hidden="true" />
    </figure>
  );
}

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

/* "On the ground" — the practical care promises. Content lifted verbatim from
   the CARE block on /about-us1 (AboutLedger). */
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

/* How we work — drawn from the firm's founding character. */
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

/* Wilson & Hughes — content lifted from the "A new chapter" section on
   /about-us1 (AboutLedger). */
const WH_FACTS = [
  ['Owner', 'Wilson & Hughes Pte Ltd, Singapore'],
  ['Since', '2024 — outright ownership of brand and business'],
  ['Also holds', 'Alliance World (supply chain) · Duraton Cement'],
  ['Mandate', 'Rebuild Cox & Kings for the next hundred years'],
];

const ACCREDITATIONS = ['IATA', 'USTOA', 'Adventure Travel Trade Association', 'ASTA'];

/* ==========================================================================
   The scroll-scrubbed horizontal timeline.
   ========================================================================== */
function Timeline() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [activeYear, setActiveYear] = useState(TIMELINE[0].year);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      /* --- Motion-safe, wide viewports: pin + scrub horizontally --------- */
      mm.add(
        '(min-width: 861px) and (prefers-reduced-motion: no-preference)',
        () => {
          const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

          const scroll = gsap.to(track, {
            x: () => -distance(),
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: () => '+=' + distance(),
              pin: true,
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              /* The pin injects a multi-thousand-pixel spacer. Without a higher
                 refreshPriority it can refresh AFTER the reveals below it, which
                 then hold start positions computed against the un-spaced page —
                 and never fire, leaving whole sections stuck at opacity 0. */
              refreshPriority: 1,
              onUpdate: (self) => setProgress(self.progress),
            },
          });

          const items = gsap.utils.toArray('.ab-tl-item', track);

          items.forEach((item) => {
            const stem = item.querySelector('.ab-tl-stem');
            const node = item.querySelector('.ab-tl-node');
            const medal = item.querySelector('.ab-tl-medallion');
            const year = item.querySelector('.ab-tl-year');
            const card = item.querySelector('.ab-tl-card');

            /* Each entry animates as it passes the playhead — driven by the
               horizontal tween, not by the page scrollbar (containerAnimation). */
            const tl = gsap.timeline({
              defaults: { ease: 'power3.out' },
              scrollTrigger: {
                trigger: item,
                containerAnimation: scroll,
                start: 'left 78%',
                end: 'left 30%',
                toggleActions: 'play none none reverse',
              },
            });

            tl.fromTo(node, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35 })
              .fromTo(stem, { scaleY: 0 }, { scaleY: 1, duration: 0.4 }, '-=0.12')
              .fromTo(
                medal,
                { scale: 0.55, opacity: 0, filter: 'blur(10px)' },
                { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.6 },
                '-=0.22'
              )
              .fromTo(
                year,
                { opacity: 0, y: 26, letterSpacing: '0.3em' },
                { opacity: 1, y: 0, letterSpacing: '0em', duration: 0.5 },
                '-=0.45'
              )
              .fromTo(card, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.45 }, '-=0.35');
          });

          /* Read out the year currently sitting under the playhead. */
          items.forEach((item) => {
            ScrollTrigger.create({
              trigger: item,
              containerAnimation: scroll,
              start: 'left 55%',
              end: 'right 55%',
              onToggle: (self) => {
                if (self.isActive) setActiveYear(item.dataset.year);
              },
            });
          });
        }
      );

      /* --- Narrow viewports: a plain vertical list ----------------------
         No pin, no scrub, no horizontal transform. Everything is legible and
         reachable; entries simply fade up as they arrive.                  */
      mm.add(
        '(max-width: 860px) and (prefers-reduced-motion: no-preference)',
        () => {
          gsap.utils.toArray('.ab-tl-item', track).forEach((item) => {
            gsap.fromTo(
              item,
              { opacity: 0, y: 24 },
              {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: 'power2.out',
                scrollTrigger: { trigger: item, start: 'top 88%' },
              }
            );
          });
        }
      );

      /* --- Reduced motion: nothing animates and nothing starts hidden.
         The timeline is simply a vertical, fully-rendered list (see CSS).  */
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className="ab-tl" ref={sectionRef} id="history" aria-labelledby="ab-tl-h">
      <div className="ab-tl-viewport">
        {/* Section heading sits inside the pin so it stays put while we travel */}
        <header className="ab-tl-head">
          <p className="ab-eyebrow ab-eyebrow--light">Our history</p>
          <h2 className="ab-tl-h" id="ab-tl-h">
            Two hundred and sixty-five <em>years</em>
          </h2>
          <p className="ab-tl-sub">
            Scroll to travel the line — from a regimental agent’s ledger in 1758 to the company we
            are rebuilding today.
          </p>
        </header>

        {/* The stage takes whatever height is left between the heading and the
            HUD, and the rail centres inside IT — so an entry can never ride up
            into the heading, at any viewport height. */}
        <div className="ab-tl-stage">
          {/* The rail: a faint full-length line, a sienna fill that tracks
              progress, and a glowing playhead parked at the scrub point. */}
          <div className="ab-tl-rail" aria-hidden="true">
            <span className="ab-tl-rail-base" />
            <span className="ab-tl-rail-fill" style={{ transform: `scaleX(${progress})` }} />
            <span className="ab-tl-playhead" />
          </div>

          <ol className="ab-tl-track" ref={trackRef}>
            {TIMELINE.map((e, i) => (
              <li
                key={e.year}
                data-year={e.year}
                className={`ab-tl-item ${i % 2 === 0 ? 'is-up' : 'is-down'}${e.now ? ' is-now' : ''}`}
              >
                <span className="ab-tl-node" aria-hidden="true" />
                <span className="ab-tl-stem" aria-hidden="true" />

                <div className="ab-tl-content">
                  <figure className="ab-tl-medallion">
                    <img src={img(e.photo, 640)} alt={e.alt} loading="lazy" />
                  </figure>
                  <div className="ab-tl-text">
                    <p className="ab-tl-year">{e.year}</p>
                    <div className="ab-tl-card">
                      <p className="ab-tl-tag">{e.tag}</p>
                      <h3>{e.title}</h3>
                      <p>{e.body}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Live progress read-out */}
        <div className="ab-tl-hud" aria-hidden="true">
          <span className="ab-tl-hud-year">{activeYear}</span>
          <span className="ab-tl-hud-bar">
            <i style={{ transform: `scaleX(${progress})` }} />
          </span>
          <span className="ab-tl-hud-count">{TIMELINE.length} moments</span>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   Page
   ========================================================================== */
export default function AboutUs() {
  const heroRef = useRef(null);

  /* Hero entrance + the gentle reveals down the page. */
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

        /* Hero image drifts up slowly as you leave it. */
        gsap.to('.ab-hero-media img', {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: { trigger: '.ab-hero', start: 'top top', end: 'bottom top', scrub: true },
        });

        /* Generic section reveals. `once` so a fired reveal can never be
           re-hidden, and invalidateOnRefresh so positions are recomputed when
           the pin spacer and late-loading images change the page height. */
        gsap.utils.toArray('[data-reveal]').forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 28 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 88%',
                once: true,
                invalidateOnRefresh: true,
              },
            }
          );
        });

        /* Stat counters. */
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

    /* Images and webfonts land after mount and change the page height, which
       leaves every ScrollTrigger holding a stale start position. Recompute once
       they've settled — otherwise sections below the pinned timeline can sit at
       opacity 0 forever. */
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    const t = setTimeout(refresh, 800);
    if (document.fonts?.ready) document.fonts.ready.then(refresh);

    return () => {
      window.removeEventListener('load', refresh);
      clearTimeout(t);
      ctx.revert();
    };
  }, []);

  return (
    /* h26 + new-typo = the /new-homepage chrome and its Cormorant/Work Sans
       type scale; .ab carries this page's own sections. */
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

      {/* ------------------------------------------------------------- purpose */}
      <section className="ab-purpose" aria-labelledby="ab-purpose-h">
        <div className="ab-wrap">
          {/* The headline gets the FULL content width, above the two columns.
              Boxed into the text column it needed shrinking below the page's h2
              scale to avoid a six-line wall; given the whole measure it sets at
              full size in two lines — and the art keeps its width. */}
          <header className="ab-purpose-head">
            <p className="ab-eyebrow" data-reveal>Our purpose</p>
            <h2 className="ab-h2" id="ab-purpose-h" data-reveal>
              We have never been the traveller. We’ve been the name in the
              <em> margin</em> of everyone else’s journey.
            </h2>
          </header>
        </div>

        <div className="ab-wrap ab-purpose-grid">
          <div className="ab-purpose-text">
            <div className="ab-prose" data-reveal>
              <p className="ab-drop">
                Churchill’s. Mallory’s. Gandhi’s. We didn’t climb the mountain — we got the climber
                his boots. For two hundred and sixty-eight years this company has been the quiet
                hand that made somebody else’s passage possible, and there is no prouder job in
                travel than that one.
              </p>
              <p>
                Which is why we have been part of family albums, farewell hugs and airport tears.
                Change is constant; the soul of travel is worth preserving.
              </p>
            </div>

            <blockquote className="ab-pull" data-reveal>
              Our purpose is to recreate that feeling, for you and yours — when wonder came
              naturally, and the world felt full of possibility.
            </blockquote>
          </div>

          <div className="ab-purpose-art">
            <Arch
              src={img('photo-1492571350019-22de08371fd3', 900)}
              alt="Cherry blossom over a Japanese street at dusk"
              ratio="3 / 4.4"
            />
            <Arch
              src={img('photo-1534445867742-43195f401b6c', 700)}
              alt="The Italian lakes at first light"
              className="ab-arch--offset"
              ratio="3 / 3.6"
            />
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------- stats
          A thin beige band of proof, sitting between the purpose and the
          history it rests on. */}
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

      {/* ------------------------------------------------------------ timeline */}
      <Timeline />

      {/* ----------------------------------------------------- Wilson & Hughes */}
      <section className="ab-wh" aria-labelledby="ab-wh-h">
        <span className="ab-rules" aria-hidden="true" />

        <div className="ab-wrap ab-wh-grid">
          <div className="ab-wh-art">
            <Arch
              src={img('photo-1467269204594-9661b134dd2b', 900)}
              alt="A European city at golden hour"
              ratio="3 / 4"
            />
          </div>

          <div className="ab-wh-text">
            <p className="ab-eyebrow" data-reveal>2024 · A new chapter</p>
            <h2 className="ab-h2" id="ab-wh-h" data-reveal>
              Acquired by <em>Wilson &amp; Hughes</em>.
            </h2>

            <div className="ab-prose" data-reveal>
              <p>
                In 2024 the Cox &amp; Kings brand and its India travel business were acquired by
                Wilson &amp; Hughes Pte Ltd — a Singapore investment firm that backs businesses it
                intends to run, not resell.
              </p>
              <p>
                They brought capital, a new leadership team, and a deliberately smaller programme:
                fewer departures, capped in size, each one led by a tour manager who has walked the
                route. Their words for what they want from us are plain enough — to{' '}
                <em>empower travellers to discover the world on their terms, blending heritage with
                innovation</em>.
              </p>
            </div>

            <ul className="ab-wh-facts">
              {WH_FACTS.map(([k, v]) => (
                <li key={k} data-reveal>
                  <span>{k}</span>
                  <strong>{v}</strong>
                </li>
              ))}
            </ul>

            <a
              href="https://wilsonandhughes.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="ab-link-out"
              data-reveal
            >
              wilsonandhughes.com <ArrowUpRight size={15} />
            </a>
          </div>
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
              {/* Dummy for now — goes nowhere until the "how we plan" page exists. */}
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

      {/* --------------------------------------------------- on the ground ---- */}
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

      {/* ---------------------------------------------------------------- team */}
      <section className="ab-team" aria-labelledby="ab-team-h">
        {/* Faint blueprint rule pattern + grain — stops the warm paper reading flat */}
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

          {/* ---- Director: asymmetric feature, name breaking over the portrait */}
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

          {/* ---- The four heads */}
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

      {/* -------------------------------------------------------------- footer */}
      <SiteFooter />
    </div>
  );
}
