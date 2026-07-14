/* ============================================================================
   Cox & Kings India — VISION & MISSION  (route: /vision-mission)

   Five statements, supplied by the business, each given the section it needs:

     PURPOSE     reconnect people to the world and to themselves
     VISION      the most trusted name in travel
     MISSION     curate, work relentlessly, execute seamlessly
     NICHE       depth over breadth
     COMMITMENT  "What we say is what you get."

   The copy is used verbatim. What varies is the FORM each statement is given,
   and the form is chosen from the sentence:

     · PURPOSE turns on "and to themselves" — an outward half and an inward
       half — so it is set against two plates that drift at DIFFERENT rates as
       you scroll: the world moves at one speed, the self at another.
     · VISION is a promise, so it is broken into the three things it promises
       (promises we honour / journeys we craft with care / experiences we
       deliver with meaning) and each is ruled in, one at a time, as you read.
     · MISSION is three verbs — curate, work, execute — so it is three plates
       that wipe open on arrival.
     · NICHE is the page's one big move. "Depth over breadth" is ARGUED rather
       than asserted: a pinned strip of nine thumbnails (breadth) is scrubbed
       away until a single plate remains and fills the frame (depth). The
       section performs the sentence.
     · COMMITMENT is a refrain — it is the last line of the Vision, said again
       at the end as a pull-quote. The echo is deliberate.

   Motion: GSAP + ScrollTrigger, all of it inside a `gsap.matchMedia()` gated on
   `(prefers-reduced-motion: no-preference)`. NOTHING is hidden in CSS — every
   resting state is the visible one, and GSAP sets the from-state itself. So if
   a visitor prefers reduced motion (or GSAP fails to load) the page is simply
   the page, fully readable, with no animation.

   Chrome: <SiteNav /> + <SiteFooter /> — the /new3 navbar and footer, shared.
   Type:   Cormorant Garamond (display) + Work Sans (body/UI) via `new-typo`.
   Colour: design.md tokens only; surface cadence documented in VisionMission.css.
   ========================================================================== */

import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ArrowUpRight, PhoneCall } from 'lucide-react';
import { SmartLink as Link, CALLBACK } from '../components/ScheduleCall';
import { SiteNav, SiteFooter } from '../components/SiteChrome';
/* Last, so .vm's own root rules win over the .h26 root the chrome sits in. */
import './VisionMission.css';

gsap.registerPlugin(ScrollTrigger);

/* Unsplash helper — the same pattern the rest of the site uses. */
const img = (id, w = 1400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

/* --------------------------------------------------------------- the content */

/* VISION, split at its own semicolons. The lead is the claim; the clauses are
   what the claim is made of; the close is the Commitment, said here first. */
const VISION_CLAUSES = [
  { k: 'Promises', v: 'we honour' },
  { k: 'Journeys', v: 'we craft with care' },
  { k: 'Experiences', v: 'we deliver with meaning' },
];

/* MISSION, split at its three verbs. */
const MISSION_PILLARS = [
  {
    n: '01',
    t: 'Curated with heart',
    b: 'Heartfelt journeys and thoughtful experiences — shaped by specialists who have stood where you will be standing, and who plan for the traveller rather than for the itinerary.',
    src: 'photo-1528181304800-259b08848526',
    alt: 'The gilded spires of a temple against a bright sky',
  },
  {
    n: '02',
    t: 'Worked relentlessly',
    b: 'The unglamorous half of a good holiday: the permits, the reconfirmations, the calls made at odd hours in other timezones — the work you should never have to hear about.',
    src: 'photo-1516426122078-c23e76319801',
    alt: 'A safari vehicle crossing open grassland at sunset',
  },
  {
    n: '03',
    t: 'Executed seamlessly',
    b: 'Technology kept where it belongs — in the execution, so nothing slips between a booking and a boarding gate. Never in the place where a person should be.',
    src: 'photo-1602002418082-a4443e081dd1',
    alt: 'A villa interior looking out over water at first light',
  },
];

/* NICHE — the nine plates the pinned strip is built from.

   The eight that scatter are BREADTH: the postcards, the things everyone's list
   has on it — the aurora, the harbour, the overwater villa, the Taj, the tower.
   The one that survives (index 4, the centre) is DEPTH: a quiet lane in Kyoto
   with one person walking down it. Not a monument. Somewhere you'd have to
   actually go into. The casting is the argument, so it is not interchangeable. */
const NICHE_TILES = [
  'photo-1483347756197-71ef80e95f73', // aurora
  'photo-1506973035872-a4ec16b8e8d9', // Sydney harbour
  'photo-1514282401047-d79a71a590e8', // overwater villas
  'photo-1534445867742-43195f401b6c', // Cinque Terre
  'photo-1493976040374-85c8e12f0c0e', // ← THE SURVIVOR: a lane in Kyoto
  'photo-1530122037265-a5f1f91d3b99', // an alpine valley
  'photo-1504457047772-27faf1c00561', // karst lagoon
  'photo-1524492412937-b28074a5d7da', // the Taj Mahal
  'photo-1502602898657-3e91760cbb34', // Paris
];
const NICHE_CENTRE = 4;

export default function VisionMission() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      /* Every tween lives in here. If the visitor prefers reduced motion this
         block never runs, no from-state is ever set, and the page renders as
         its resting state — which is the readable one. */
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        /* ---------------------------------------------------------- hero ---
           Load timeline: the photo settles out of a slow push-in while the
           headline lines rise out of their masks. */
        gsap.timeline({ defaults: { ease: 'power3.out' } })
          .from('.vm-hero-media img', { scale: 1.18, duration: 1.8, ease: 'power2.out' })
          .from('.vm-hero-eyebrow', { opacity: 0, y: 14, duration: 0.7 }, 0.25)
          .from('.vm-hero-line span', { yPercent: 115, duration: 1.1, stagger: 0.1 }, 0.35)
          .from('.vm-hero-lede', { opacity: 0, y: 18, duration: 0.8 }, 0.9)
          .from('.vm-hero-cue', { opacity: 0, duration: 0.8 }, 1.1);

        /* The hero photo drifts up as you leave it. */
        gsap.to('.vm-hero-media img', {
          yPercent: 14,
          ease: 'none',
          scrollTrigger: { trigger: '.vm-hero', start: 'top top', end: 'bottom top', scrub: true },
        });

        /* ------------------------------------------------- generic reveals ---
           `once: true` so a fired reveal can never be hidden again, and
           invalidateOnRefresh so late-loading images cannot leave a trigger
           measured against a stale page height. */
        gsap.utils.toArray('[data-reveal]').forEach((el) => {
          gsap.from(el, {
            opacity: 0,
            y: 28,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 86%', once: true, invalidateOnRefresh: true },
          });
        });

        /* ------------------------------------------------------- purpose ---
           The sentence turns on "and to themselves": one half of it is the
           world, the other half is you. So the two plates travel at different
           rates — the world plate faster, the self plate slower and against it.
           The gap that opens between them IS the sentence. */
        gsap.to('.vm-purpose-plate--world', {
          yPercent: -14,
          ease: 'none',
          scrollTrigger: { trigger: '.vm-purpose', start: 'top bottom', end: 'bottom top', scrub: 1 },
        });
        gsap.to('.vm-purpose-plate--self', {
          yPercent: 10,
          ease: 'none',
          scrollTrigger: { trigger: '.vm-purpose', start: 'top bottom', end: 'bottom top', scrub: 1 },
        });
        /* Each plate is also uncovered rather than faded in — a clip wipe. */
        gsap.utils.toArray('.vm-purpose-plate').forEach((el, i) => {
          gsap.from(el.querySelector('.vm-plate-clip'), {
            clipPath: 'inset(100% 0% 0% 0%)',
            duration: 1.4,
            delay: i * 0.12,
            ease: 'power3.inOut',
            scrollTrigger: { trigger: '.vm-purpose', start: 'top 72%', once: true },
          });
        });

        /* -------------------------------------------------------- vision ---
           The backdrop scales down slowly across the whole section, and the
           three clauses rule themselves in one at a time. */
        gsap.to('.vm-vision-media img', {
          scale: 1,
          ease: 'none',
          scrollTrigger: { trigger: '.vm-vision', start: 'top bottom', end: 'bottom top', scrub: true },
        });
        gsap.from('.vm-clause', {
          opacity: 0,
          x: -28,
          duration: 0.9,
          stagger: 0.18,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.vm-clauses', start: 'top 78%', once: true },
        });
        gsap.from('.vm-clause-rule', {
          scaleX: 0,
          transformOrigin: 'left center',
          duration: 1.1,
          stagger: 0.18,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: '.vm-clauses', start: 'top 78%', once: true },
        });

        /* ------------------------------------------------------- mission ---
           Three plates, wiped open in sequence, each with its photo drifting
           inside its own frame. */
        gsap.utils.toArray('.vm-pillar').forEach((el, i) => {
          gsap.from(el.querySelector('.vm-plate-clip'), {
            clipPath: 'inset(0% 0% 100% 0%)',
            duration: 1.2,
            delay: i * 0.14,
            ease: 'power3.inOut',
            scrollTrigger: { trigger: '.vm-pillars', start: 'top 76%', once: true },
          });
          gsap.from(el.querySelector('.vm-pillar-copy'), {
            opacity: 0,
            y: 24,
            duration: 0.9,
            delay: 0.25 + i * 0.14,
            ease: 'power3.out',
            scrollTrigger: { trigger: '.vm-pillars', start: 'top 76%', once: true },
          });
          gsap.to(el.querySelector('img'), {
            yPercent: -10,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
          });
        });

        /* ---------------------------------------------------- commitment ---
           The refrain arrives a word at a time, scrubbed, so it is read at the
           speed of the scroll rather than skimmed. */
        gsap.from('.vm-commit-word', {
          opacity: 0.12,
          stagger: 0.4,
          ease: 'none',
          scrollTrigger: {
            trigger: '.vm-commit-q',
            start: 'top 82%',
            end: 'bottom 62%',
            scrub: 0.6,
          },
        });
        gsap.to('.vm-commit-media img', {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: { trigger: '.vm-commit', start: 'top bottom', end: 'bottom top', scrub: true },
        });
      });

      /* ------------------------------------------------------------ NICHE ---
         The page's argument, made as motion rather than asserted as a claim:
         pin the section and scrub one timeline, so the eight "breadth" tiles
         blow outwards and fade while the survivor scales up and fills the
         frame. By the time the sentence is legible the strip has become a
         single picture — which IS the sentence.

         Gated on width as well as motion preference. Nine tiles across a 390px
         phone would be ~30px wide, and scaling a 30px tile by 3.15 gives a 95px
         "hero" — the move simply does not exist at that size. Below 640px the
         CSS drops the other eight tiles and shows the survivor as a plain
         photograph, so nothing here needs to run.

         Only transform and opacity are animated (never width/height/top), so
         the scrub stays on the compositor and the pin does not judder. */
      mm.add('(min-width: 641px) and (prefers-reduced-motion: no-preference)', () => {
        const stage = root.current?.querySelector('.vm-niche-stage');
        const tiles = gsap.utils.toArray('.vm-tile');
        const full = root.current?.querySelector('.vm-niche-full');
        if (!stage || !full || tiles.length <= NICHE_CENTRE) return undefined;
        const survivor = tiles[NICHE_CENTRE];

        /* The survivor's footprint, as a clip-path inset on the full-bleed
           plate. Function-based (not a captured string) so `invalidateOnRefresh`
           recomputes it on resize — a hard-coded inset would leave the plate
           opening from the wrong place after the viewport changes. */
        const tileInset = () => {
          const w = stage.clientWidth;
          const h = stage.clientHeight;
          const x = ((w - survivor.offsetWidth) / 2 / w) * 100;
          const y = ((h - survivor.offsetHeight) / 2 / h) * 100;
          return `inset(${y}% ${x}% ${y}% ${x}% round 4px)`;
        };

        /* The plate stands in for the survivor from the very first frame, so
           the tile itself is simply switched off — there is never a moment where
           both are visible and could disagree. */
        gsap.set(survivor, { opacity: 0 });
        gsap.set(full, { opacity: 1 });

        const niche = gsap.timeline({
          scrollTrigger: {
            trigger: '.vm-niche',
            start: 'top top',
            end: '+=200%',
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });

        tiles.forEach((tile, i) => {
          if (i === NICHE_CENTRE) return;
          /* Each tile leaves along the axis it already sits on, so the strip
             opens OUTWARD from the survivor rather than collapsing inward. */
          const dir = i < NICHE_CENTRE ? -1 : 1;
          const dist = Math.abs(i - NICHE_CENTRE);
          niche.to(
            tile,
            {
              xPercent: dir * (60 + dist * 34),
              yPercent: (i % 2 === 0 ? -1 : 1) * 20,
              scale: 0.7,
              opacity: 0,
              ease: 'power2.in',
              duration: 0.45,
            },
            /* Outermost tiles leave first — the frame narrows inwards. */
            (4 - dist) * 0.05
          );
        });

        niche
          .fromTo(
            full,
            { clipPath: tileInset },
            { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'power2.inOut', duration: 0.75 },
            0.25
          )
          .to('.vm-niche-scrim', { opacity: 1, ease: 'none', duration: 0.4 }, 0.6)
          .from('.vm-niche-copy', { opacity: 0, y: 34, ease: 'power2.out', duration: 0.35 }, 0.72);

        /* matchMedia reverts this context (killing the pin and its spacer) if
           the viewport crosses back under 640px. */
        return () => niche.kill();
      });

      /* Photos change the page height as they land; without this the pinned
         NICHE section can be measured against the wrong scroll distance. */
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener('load', refresh);
      const t = setTimeout(refresh, 900);

      return () => {
        window.removeEventListener('load', refresh);
        clearTimeout(t);
      };
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    /* h26 + new-typo = the shared chrome and its Cormorant/Work Sans scale;
       .vm carries this page's own sections. */
    <div className="h26 new-typo vm" ref={root}>
      <SiteNav />

      {/* ============================================================= HERO */}
      <header className="vm-hero">
        {/* A pagoda above Kyoto at dusk — a place you go INTO, not a landmark you
            tick off. The niche section's argument, made once at the top. */}
        <div className="vm-hero-media" aria-hidden="true">
          <img src={img('photo-1545569341-9eb8b30979d9', 2200)} alt="" fetchpriority="high" />
        </div>
        <div className="vm-hero-veil" aria-hidden="true" />

        <div className="vm-wrap vm-hero-inner">
          <p className="vm-hero-eyebrow">
            <span className="vm-rule" aria-hidden="true" />
            <span className="vm-eyebrow vm-eyebrow--light">Cox &amp; Kings India</span>
          </p>

          <h1 className="vm-hero-h">
            <span className="vm-hero-line"><span>Why we</span></span>
            <span className="vm-hero-line"><span><em>travel</em>.</span></span>
          </h1>

          <p className="vm-hero-lede">
            Our purpose, our vision, our mission — and the one promise everything else is
            built to keep.
          </p>

          <p className="vm-hero-cue" aria-hidden="true">
            <span className="vm-cue-line" />
            Scroll
          </p>
        </div>
      </header>

      {/* ========================================================== PURPOSE
          "…to the world AND to themselves." Two plates, two speeds. */}
      <section className="vm-purpose" aria-labelledby="vm-purpose-h">
        <div className="vm-wrap vm-purpose-inner">
          <div className="vm-purpose-copy">
            <p className="vm-eyebrow" data-reveal>Purpose</p>
            <h2 className="vm-statement" id="vm-purpose-h" data-reveal>
              To reconnect people to the world <em>and to themselves</em> through transformative
              journeys and experiences.
            </h2>
            <p className="vm-statement-note" data-reveal>
              A journey is not a list of places. It is the thing it does to the person who went.
            </p>
          </div>

          {/* The two halves of the sentence, cast literally: the world is a place
              (a mountain you climb to), and yourself is a face. The second plate
              is a delighted Indian traveller, not a landscape — "and to
              themselves" is the half of the purpose that is about a person. */}
          <div className="vm-purpose-plates">
            <figure className="vm-purpose-plate vm-purpose-plate--world">
              <span className="vm-plate-clip">
                <img
                  src={img('photo-1526392060635-9d6019884377', 900)}
                  alt="Cloud breaking over a mountain ridge at Machu Picchu"
                  loading="lazy"
                />
              </span>
              <figcaption className="vm-plate-cap">The world</figcaption>
            </figure>
            <figure className="vm-purpose-plate vm-purpose-plate--self">
              <span className="vm-plate-clip">
                <img
                  src={img('photo-1496813146940-1601b02f81a4', 900)}
                  alt="A woman laughing, hand to her forehead, on a street in India"
                  loading="lazy"
                />
              </span>
              <figcaption className="vm-plate-cap">And yourself</figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* =========================================================== VISION */}
      <section className="vm-vision" aria-labelledby="vm-vision-h">
        {/* A torii standing in still water — something that has been kept where
            it was promised to be. The vision is about trust; the picture is too. */}
        <div className="vm-vision-media" aria-hidden="true">
          <img src={img('photo-1492571350019-22de08371fd3', 2000)} alt="" loading="lazy" />
        </div>
        <div className="vm-vision-veil" aria-hidden="true" />

        <div className="vm-wrap vm-vision-inner">
          <p className="vm-eyebrow vm-eyebrow--light" data-reveal>Vision</p>

          <h2 className="vm-vision-h" id="vm-vision-h" data-reveal>
            To be the most trusted <em>name in travel</em>.
          </h2>

          {/* The three things the claim is actually made of. */}
          <ul className="vm-clauses">
            {VISION_CLAUSES.map((c) => (
              <li className="vm-clause" key={c.k}>
                <span className="vm-clause-rule" aria-hidden="true" />
                <span className="vm-clause-k">{c.k}</span>
                <span className="vm-clause-v">{c.v}</span>
              </li>
            ))}
          </ul>

          <p className="vm-vision-close" data-reveal>
            What we say is what you get, and what you get is unforgettable.
          </p>
        </div>
      </section>

      {/* ========================================================== MISSION */}
      <section className="vm-mission" aria-labelledby="vm-mission-h">
        <div className="vm-wrap">
          <div className="vm-mission-head">
            <p className="vm-eyebrow" data-reveal>Mission</p>
            <h2 className="vm-statement vm-statement--mission" id="vm-mission-h" data-reveal>
              To curate heartfelt journeys and thoughtful experiences, working
              <em> relentlessly</em> and using technology for seamless execution.
            </h2>
          </div>

          <div className="vm-pillars">
            {MISSION_PILLARS.map((p) => (
              <article className="vm-pillar" key={p.n}>
                <figure className="vm-pillar-fig">
                  <span className="vm-plate-clip">
                    <img src={img(p.src, 900)} alt={p.alt} loading="lazy" />
                  </span>
                </figure>
                <div className="vm-pillar-copy">
                  <span className="vm-pillar-n" aria-hidden="true">{p.n}</span>
                  <h3 className="vm-pillar-h">{p.t}</h3>
                  <p className="vm-pillar-p">{p.b}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ NICHE
          Pinned. Nine pictures become one — the sentence, performed. */}
      <section className="vm-niche" aria-labelledby="vm-niche-h">
        <div className="vm-niche-stage">
          <div className="vm-niche-strip" aria-hidden="true">
            {NICHE_TILES.map((src, i) => (
              <span
                className={`vm-tile${i === NICHE_CENTRE ? ' is-survivor' : ''}`}
                key={src}
              >
                <img src={img(src, 520)} alt="" loading="lazy" />
              </span>
            ))}
          </div>

          {/* The plate the survivor OPENS INTO.

              Scaling the 122px tile up to fill a 1440px viewport would mean a
              12× transform on a 122px backing texture — i.e. a blurred mess. So
              the tile is not scaled at all. This is a full-resolution,
              full-bleed copy of the same photograph, clipped down to exactly the
              tile's footprint at the start of the scrub and wiped open to the
              full frame by the end. The picture is native-res the whole way, and
              what the eye reads is a window opening — which is the better
              metaphor anyway: you go INTO the one you chose.

              Starts transparent; only GSAP turns it on, so a reduced-motion
              visitor just sees the nine-tile strip. */}
          <div className="vm-niche-full" aria-hidden="true">
            <img src={img(NICHE_TILES[NICHE_CENTRE], 2400)} alt="" loading="lazy" />
          </div>

          <div className="vm-niche-scrim" aria-hidden="true" />

          <div className="vm-wrap vm-niche-copy">
            <p className="vm-eyebrow vm-eyebrow--light">Niche</p>
            <h2 className="vm-niche-h" id="vm-niche-h">
              Depth <em>over</em> breadth.
            </h2>
            <p className="vm-niche-p">
              Deeply curated, premium experiential journeys for discerning Indian travellers who
              choose depth over breadth.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================= COMMITMENT
          The last line of the Vision, said again. The echo is the point. */}
      <section className="vm-commit" aria-labelledby="vm-commit-h">
        <div className="vm-commit-media" aria-hidden="true">
          <img src={img('photo-1531366936337-7c912a4589a7', 2000)} alt="" loading="lazy" />
        </div>
        <div className="vm-commit-veil" aria-hidden="true" />

        <div className="vm-wrap vm-commit-inner">
          <p className="vm-eyebrow vm-eyebrow--light" data-reveal>Our commitment</p>

          <blockquote className="vm-commit-q" id="vm-commit-h">
            {'What we say is what you get. And what you get will be unforgettable.'
              .split(' ')
              .map((w, i) => (
                <span className="vm-commit-word" key={`${w}-${i}`}>{w} </span>
              ))}
          </blockquote>

          <p className="vm-commit-sig" data-reveal>
            <span className="vm-rule" aria-hidden="true" />
            Cox &amp; Kings India
          </p>
        </div>
      </section>

      {/* ============================================================== CTA */}
      <section className="vm-cta" aria-labelledby="vm-cta-h">
        <div className="vm-wrap vm-cta-inner">
          <p className="vm-eyebrow" data-reveal>Where it starts</p>
          <h2 className="vm-cta-h" id="vm-cta-h" data-reveal>
            Every journey begins with <em>a conversation</em>.
          </h2>
          <p className="vm-cta-p" data-reveal>
            Tell one of our specialists where you have been meaning to go. No itinerary, no
            price, no obligation — just the conversation.
          </p>
          <div className="vm-cta-row" data-reveal>
            <Link to={CALLBACK} className="h26-btn h26-btn-pill h26-btn-lg">
              <PhoneCall size={16} aria-hidden="true" /> Talk to a specialist
            </Link>
            <Link to="/journeys4" className="h26-btn h26-btn-ghost h26-btn-lg">
              See the journeys <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
          <p className="vm-cta-foot" data-reveal>
            <Link to="/about-us2" className="vm-link-out">
              Our story, since 1758 <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
