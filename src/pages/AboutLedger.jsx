/* ============================================================================
   Cox & Kings India — ABOUT US  ·  "The Atlas Room"   (route: /about-us1)

   ART DIRECTION
   The page is a warm-paper editorial spread — an atlas opened on a desk — with
   deep Voyager navy used as PUNCTUATION, not as the ground. Three night chapters
   (the hero, the ledger, the closing) sit inside a daylight page. That inversion
   is the whole visual argument: heritage is not gloom.

   THE SIGNATURE — the arch.
   Every photograph on this page is cut into an arch. It is the one shape travel
   has always been framed by — a Mughal jharokha, a Roman aqueduct, a torii, the
   window of a wagon-lit. Nobody else's About page is built on it, and one
   screenshot of this page is unmistakable.

   THE CENTREPIECE — the ledger.
   A pinned, scroll-scrubbed horizontal timeline (GSAP ScrollTrigger +
   containerAnimation), modelled on the supplied "Timeline animation.mov": a
   glowing spine travels sideways, nodes punch in on the line, elbow connectors
   draw alternately above and below it. Every one of the 268 years between 1758
   and today is a real tick, positioned in TIME, not in even steps — so you
   physically scroll the empty century between 1795 and 1908. Length is felt,
   never stated. The last entry on the line is blank, and it is yours.

   Type: Cormorant Garamond (display, oldstyle figures) + Work Sans (UI).
   Colour, radius and button tokens from design.md.

   NOTE ON PHOTOGRAPHY: every image here is a placeholder from the same library
   the rest of this prototype uses. The team portraits in particular must be
   replaced with real headshots before launch.
   ========================================================================== */

import { useEffect, useRef, useState, useCallback } from 'react';
import { SmartLink as Link, CALLBACK } from '../components/ScheduleCall';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import {
  ArrowRight, ArrowUpRight, Phone, Menu, X, Sparkles,
  MessageCircle, Plus, Minus,
} from 'lucide-react';
import ChatBot from '../components/ChatBot';
import './AboutLedger.css';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const img = (id, w = 1000) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const CONTACT = {
  phoneDisplay: '+91 8556001700',
  phoneHref: 'tel:+918556001700',
  whatsappHref: 'https://wa.me/918556001700',
  email: 'holidays@coxandkings.com',
};

/* ---------------------------------------------------------------------------
   THE LEDGER — 12 entries, plus the blank one.

   `t` is the entry's true position in time (what the spine is measured in);
   `year` is only what we print. `side` alternates meaningfully, not decoratively:
      'up'   — what the WORLD was doing (Everest, Gandhi, Independence)
      'down' — what the FIRM was doing (founded, merged, expanded, acquired)

   Each entry carries a stamped Roman folio seal rather than a photograph. Half
   of this history predates the camera; a stock library picture of "an old
   European street" beside 1758 would be a lie told in pictures. If the brand
   archive opens up (the regimental ledgers, Gandhi's passage papers, the 1924
   Everest manifests), real scans slot in behind the seal.
   ------------------------------------------------------------------------- */
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII'];

const LEDGER = [
  {
    year: '1758', t: 1758, side: 'down', era: 'sail',
    tag: 'The first entry',
    title: 'Richard Cox becomes agent to the regiment',
    body: 'On 25 May, Richard Cox becomes regimental agent to the 1st Foot Guards — paying the men, provisioning them, moving them. A travel company, born out of logistics.',
  },
  {
    year: '1795', t: 1795, side: 'down', era: 'sail',
    tag: 'Scale',
    title: 'The largest military agent in Britain',
    body: 'Cox & Co. serves 14 regiments of cavalry, 64 of infantry, 17 of militia. Most of the British Army now banks with a travel agent.',
  },
  {
    year: '1905–11', t: 1908, side: 'up', era: 'empire',
    tag: 'India',
    title: 'Five branches open across India',
    body: 'The firm follows its clients east — the beginning of a presence in India that has now outlasted the empire which brought it here.',
  },
  {
    year: '1914–18', t: 1916, side: 'up', era: 'empire',
    tag: 'The Great War',
    title: 'Paying and provisioning an army',
    body: 'Four years of war — the pay, kit and passage of hundreds of thousands of officers. Among the clients: the Duke of York, and a young Churchill.',
  },
  {
    year: '1922', t: 1922, side: 'down', era: 'empire',
    tag: 'The name',
    title: 'Cox & Co. and Henry S. King & Co. become Cox & Kings',
    body: 'The firm merges with a shipping agency whose network runs deep into India. Two ledgers become one, and the name has not changed since.',
    source: '“…a battered tin dispatch box… in the vaults of the bank of Cox & Co., at Charing Cross.” — Arthur Conan Doyle, on where Dr Watson kept his papers. Published that same year.',
  },
  {
    year: '1924', t: 1924, side: 'up', era: 'empire',
    tag: 'The mountain',
    title: 'Outfitting Mallory’s Everest expedition',
    body: 'The firm handles passage and supply for the British attempt on Everest. Mallory walks into the cloud at 28,000 feet and does not come back.',
  },
  {
    year: '1931', t: 1931, side: 'up', era: 'empire',
    tag: 'A passage to Europe',
    title: 'Mahatma Gandhi sails for the Round Table Conference',
    body: 'His passage to London is arranged by Cox & Kings. He travels second class.',
  },
  {
    year: '1947', t: 1947, side: 'up', era: 'india',
    tag: 'Independence',
    title: 'An Indian company, for an independent India',
    body: 'The empire the firm was built to serve ends. The Indian business does not. It stays, run by Indians, and turns slowly from logistics towards leisure.',
  },
  {
    year: '1970s', t: 1975, side: 'down', era: 'india',
    tag: 'Two businesses',
    title: 'The bank and the travel agency part ways',
    body: 'Under Grindlays, the banking arm and the travel arm formally separate. Travel goes on. The ledgers stay behind.',
  },
  {
    year: '1988', t: 1988, side: 'down', era: 'india',
    tag: 'Westward',
    title: 'New York opens',
    body: 'Through the eighties the map widens — the USA, the Middle East, Africa, East and Southeast Asia. Latin America follows in 1990.',
  },
  {
    year: '2018', t: 2012, side: 'up', era: 'india',
    tag: 'Seven continents',
    title: '260 years, and Antarctica',
    body: 'The 260th anniversary, with journeys running on every continent on earth — the oldest travel company in the world, by a wide margin.',
  },
  {
    year: '2024', t: 2024, side: 'up', era: 'now', flag: true,
    tag: 'A new chapter',
    title: 'Wilson & Hughes acquires Cox & Kings',
    body: 'Wilson & Hughes takes ownership of the brand and the India travel business — new capital, new leadership, and a mandate to build the next hundred years.',
  },
];

/* The last tick on the line has no year. */
const BLANK = { year: '', t: 2026, era: 'now' };

const T0 = 1758;
const SPAN = BLANK.t - T0; // 268

const ERAS = [
  { key: 'sail', label: 'The age of sail', range: '1758–1878' },
  { key: 'empire', label: 'Empire & the passage east', range: '1878–1947' },
  { key: 'india', label: 'A new India', range: '1947–2019' },
  { key: 'now', label: 'The next chapter', range: '2024–today' },
];

/* ---------------------------------------------------------------------------
   POSITION MAPPING — the load-bearing idea.

   Pure real time leaves a 113-year void between 1795 and 1908 and stacks the
   modern entries on top of each other. Pure even spacing makes 1758→1922 look
   the same distance as 2018→2024 — which destroys the only thing worth saying
   about this company. So: 52% real time, 48% even.

   The even component guarantees two entries on the SAME side of the spine can
   never overlap. The real-time component is what leaves the 18th century almost
   entirely empty — a quarter of the whole ledger with nothing written on it.
   That emptiness is the argument. Every tick maps through the same function, so
   the ruler never lies about its own warp.
   ------------------------------------------------------------------------- */
const NODES = [...LEDGER, BLANK];
const ANCHORS = NODES.map((e, i) => ({
  t: e.t,
  p: 0.52 * ((e.t - T0) / SPAN) + 0.48 * (i / (NODES.length - 1)),
}));

function mapYear(t) {
  const last = ANCHORS[ANCHORS.length - 1];
  if (t <= ANCHORS[0].t) return ANCHORS[0].p;
  if (t >= last.t) return last.p;
  for (let i = 0; i < ANCHORS.length - 1; i++) {
    const a = ANCHORS[i];
    const b = ANCHORS[i + 1];
    if (t >= a.t && t <= b.t) return a.p + ((t - a.t) / (b.t - a.t || 1)) * (b.p - a.p);
  }
  return last.p;
}

/** 0..1 along the line → year, so the running counter never snaps */
function invMap(p) {
  const last = ANCHORS[ANCHORS.length - 1];
  if (p <= ANCHORS[0].p) return T0;
  if (p >= last.p) return last.t;
  for (let i = 0; i < ANCHORS.length - 1; i++) {
    const a = ANCHORS[i];
    const b = ANCHORS[i + 1];
    if (p >= a.p && p <= b.p) return a.t + ((p - a.p) / (b.p - a.p || 1)) * (b.t - a.t);
  }
  return last.t;
}

/* Every year 1758…2026 is a real tick on the spine. */
const TICKS = Array.from({ length: SPAN + 1 }, (_, i) => T0 + i);

/* How far into the present the ink has warmed — 0 = archival, 1 = today. */
const ageOf = (t) => Math.max(0, Math.min(1, (t - 1900) / 110));

/* ---------------------------------------------------------------------------
   TRACK GEOMETRY.

   The naive version — track width = content, translate by -(scrollWidth - vw) —
   parks the LAST entry hard against the right edge, where it is never actually
   readable. Here that would be fatal: the last entry is the blank one, and the
   whole 268-year scroll would end on nothing. So the content occupies CONTENT px
   and the track carries a trailing run of (1 - PLAY) × viewport after it. At the
   end of the scrub the final entry lands exactly on the playhead, where every
   other entry landed, and the spine keeps running past it — unmarked, waiting.
   ------------------------------------------------------------------------- */
const CONTENT = 6900;
const LEAD = 320;
const PLAY = 0.22;
const trackW = () => CONTENT + (1 - PLAY) * window.innerWidth;
const xAt = (p) => LEAD + p * (CONTENT - LEAD);
const pAt = (px) => (px - LEAD) / (CONTENT - LEAD);

/* --------------------------------------------------------------------------
   THE LEDGER — pinned horizontal scrub on desktop; an honest vertical list
   everywhere else (mobile, and anyone who asked for reduced motion).
   -------------------------------------------------------------------------- */
function Ledger() {
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const trackRef = useRef(null);
  const fillRef = useRef(null);
  const yearRef = useRef(null);
  const barRef = useRef(null);
  const horizRef = useRef(null);

  const [era, setEra] = useState(ERAS[0].key);
  const [pinned, setPinned] = useState(false);

  /* Land an entry on the playhead, whichever layout is live. Used by the era
     rail, by clicking an entry, and — critically — by focus, so a keyboard user
     can never land on an entry translated off-canvas (WCAG 2.2 · 2.4.11). */
  const goTo = useCallback((index) => {
    const horiz = horizRef.current;
    if (!horiz) {
      document.getElementById(`entry-${index}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    const st = horiz.scrollTrigger;
    if (!st) return;
    const travel = trackW() - window.innerWidth;
    const targetX = xAt(ANCHORS[index].p) - window.innerWidth * PLAY;
    const prog = gsap.utils.clamp(0, 1, targetX / travel);
    gsap.to(window, {
      scrollTo: st.start + prog * (st.end - st.start),
      duration: 0.9, ease: 'power3.inOut', overwrite: true,
    });
  }, []);

  /* The exit has to land somewhere clean — scrolling out while the pin is still
     unwinding drops you into the tail of the pinned stage, which reads as broken. */
  const skip = useCallback(() => {
    const next = document.getElementById('chapter');
    if (!next) return;
    gsap.killTweensOf(window);
    gsap.to(window, {
      scrollTo: { y: next, offsetY: 20, autoKill: false },
      duration: 0.8, ease: 'power3.inOut', overwrite: true,
      onComplete: () => {
        ScrollTrigger.refresh();
        next.querySelector('h2')?.focus();
      },
    });
  }, []);

  useEffect(() => {
    const mm = gsap.matchMedia();

    /* ---- DESKTOP, motion allowed: the pinned ledger ---- */
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      setPinned(true);
      const track = trackRef.current;

      const sizeTrack = () => gsap.set(track, { width: trackW() });
      sizeTrack();
      ScrollTrigger.addEventListener('refreshInit', sizeTrack);

      const horiz = gsap.to(track, {
        x: () => -(trackW() - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: rootRef.current,
          pin: stageRef.current,
          pinSpacing: true,
          anticipatePin: 1,
          start: 'top top',
          end: () => '+=' + (trackW() - window.innerWidth),
          scrub: 1, // the world has weight — a full second of catch-up
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const travel = trackW() - window.innerWidth;
            const passed = self.progress * travel + window.innerWidth * PLAY;
            const p = gsap.utils.clamp(0, 1, pAt(passed));

            if (fillRef.current) fillRef.current.style.width = `${Math.max(0, passed)}px`;
            if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress})`;
            if (yearRef.current) {
              const y = Math.round(invMap(p));
              yearRef.current.textContent = y >= BLANK.t ? '—' : String(y);
            }
            let hit = NODES[0];
            NODES.forEach((n, i) => { if (ANCHORS[i].p <= p + 0.01) hit = n; });
            if (hit?.era) setEra(hit.era);
          },
        },
      });
      horizRef.current = horiz;

      /* Per-entry reveals ride INSIDE the horizontal motion — this is what
         separates a real horizontal scrub from a translated div. */
      gsap.utils.toArray('.led-entry', track).forEach((el) => {
        const elbow = el.querySelector('.led-elbow-path');
        const node = el.querySelector('.led-node');
        const seal = el.querySelector('.led-seal');
        const text = el.querySelectorAll('.led-anim');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            containerAnimation: horiz,
            start: 'left 84%',
            end: 'left 36%',
            scrub: true, // welded to the hand — the ink has no inertia
          },
        });

        if (node) tl.fromTo(node, { scale: 0 }, { scale: 1, ease: 'back.out(1.9)', duration: 0.22 }, 0);
        if (elbow) {
          const len = elbow.getTotalLength?.() || 300;
          gsap.set(elbow, { strokeDasharray: len, strokeDashoffset: len });
          tl.to(elbow, { strokeDashoffset: 0, ease: 'expo.out', duration: 0.5 }, 0.05);
        }
        /* the seal is STAMPED, not faded — it lands oversized and settles */
        if (seal) {
          tl.fromTo(seal, { scale: 0.55, opacity: 0, rotate: -8 },
            { scale: 1, opacity: 1, rotate: 0, ease: 'back.out(2.4)', duration: 0.32 }, 0.12);
        }
        if (text.length) {
          tl.fromTo(text, { y: 20, opacity: 0 },
            { y: 0, opacity: 1, ease: 'power3.out', duration: 0.35, stagger: 0.06 }, 0.2);
        }
      });

      const refresh = () => ScrollTrigger.refresh();
      document.fonts?.ready.then(refresh);
      window.addEventListener('load', refresh);

      return () => {
        window.removeEventListener('load', refresh);
        ScrollTrigger.removeEventListener('refreshInit', sizeTrack);
        horizRef.current = null;
        setPinned(false);
      };
    });

    /* ---- Everything else: no pin is ever created. Not "reduced" — absent.
       This branch is also what makes 400% zoom reflow (WCAG 1.4.10) pass. ---- */
    mm.add('(max-width: 1023px), (prefers-reduced-motion: reduce)', () => {
      gsap.utils.toArray('.led-entry').forEach((el, i) => {
        gsap.fromTo(el, { opacity: 0, y: 16 }, {
          opacity: 1, y: 0, duration: 0.45, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
        });
        /* the sticky year must track the entry you are actually looking at —
           a header frozen on "1758" while you read about 1988 is a lie */
        ScrollTrigger.create({
          trigger: el, start: 'top 55%', end: 'bottom 55%',
          onToggle: (self) => {
            if (!self.isActive) return;
            if (yearRef.current) yearRef.current.textContent = NODES[i].year || '—';
            if (NODES[i].era) setEra(NODES[i].era);
          },
        });
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section className="led" id="timeline" ref={rootRef} aria-labelledby="led-h">
      <div className="led-stage" ref={stageRef}>
        <div className="led-grain" aria-hidden="true" />
        <div className="led-contours" aria-hidden="true" />

        <div className="led-hud">
          <div className="led-hud-l">
            <p className="ckl-eyebrow ckl-eyebrow--gold" id="led-h">Our history · the ledger</p>
            <p className="led-year" ref={yearRef} aria-hidden="true">1758</p>
            <p className="led-era" aria-hidden="true">{ERAS.find((e) => e.key === era)?.label}</p>
          </div>
          <div className="led-hud-r">
            {/* First focusable element in the section, by design: a keyboard
                user's very first Tab into the ledger offers them the exit. */}
            <button type="button" className="led-skip" onClick={skip}>
              Skip the history <ArrowRight size={14} aria-hidden="true" />
            </button>
            <p className="led-hint" aria-hidden="true">
              {pinned
                ? 'Keep scrolling. Every single year between 1758 and today is a mark on this line.'
                : 'Two and a half centuries, in thirteen entries.'}
            </p>
          </div>
        </div>

        {/* An ordered list in true chronological DOM order. No tablist, no
            carousel ARIA — the list IS the accessible interface, and the
            horizontal layout is transform only. */}
        <div className="led-viewport">
          <ol className="led-track" ref={trackRef}>
            <div className="led-spine" aria-hidden="true">
              <span className="led-spine-base" />
              <span className="led-spine-fill" ref={fillRef} />
              {TICKS.map((t) => {
                const century = t % 100 === 0;
                const decade = t % 10 === 0;
                return (
                  <span
                    key={t}
                    className={`led-tick${century ? ' is-century' : decade ? ' is-decade' : ''}`}
                    style={{ left: `${xAt(mapYear(t))}px` }}
                  />
                );
              })}
            </div>

            {NODES.map((e, i) => {
              const blank = !e.tag;
              const up = e.side === 'up';
              return (
                <li
                  key={e.year || 'blank'}
                  id={`entry-${i}`}
                  className={[
                    'led-entry',
                    up ? 'is-up' : 'is-down',
                    blank ? 'is-blank' : '',
                    e.flag ? 'is-flag' : '',
                  ].filter(Boolean).join(' ')}
                  style={{ left: `${xAt(ANCHORS[i].p)}px`, '--age': ageOf(e.t) }}
                  tabIndex={0}
                  onFocus={() => goTo(i)}
                  onClick={() => goTo(i)}
                  onKeyDown={(ev) => {
                    if (ev.key === 'ArrowRight' && i < NODES.length - 1) {
                      ev.preventDefault();
                      document.getElementById(`entry-${i + 1}`)?.focus();
                    }
                    if (ev.key === 'ArrowLeft' && i > 0) {
                      ev.preventDefault();
                      document.getElementById(`entry-${i - 1}`)?.focus();
                    }
                  }}
                >
                  <span className="led-node" aria-hidden="true" />
                  <svg className="led-elbow" viewBox="0 0 120 96" aria-hidden="true" preserveAspectRatio="none">
                    {/* the elbow's horizontal run sits 32px off the spine; the body
                        starts at 46px, so the connector leads INTO the text block
                        rather than striking through it */}
                    <path className="led-elbow-path" d={up ? 'M 3 96 L 3 64 L 118 64' : 'M 3 0 L 3 32 L 118 32'} />
                  </svg>

                  <div className="led-body">
                    {blank ? (
                      <>
                        <div className="led-head led-anim">
                          <span className="led-caret" aria-hidden="true" />
                          <div>
                            <p className="ckl-eyebrow ckl-eyebrow--gold">The next entry</p>
                            <p className="led-e-year">—</p>
                          </div>
                        </div>
                        <h3 className="led-e-title">Yours.</h3>
                        <p className="led-e-copy led-anim">
                          The line is still running. The next entry on it hasn’t been written.
                        </p>
                        <Link to={CALLBACK} className="ckl-btn ckl-btn--gold led-anim">
                          Start it with a specialist <ArrowRight size={15} aria-hidden="true" />
                        </Link>
                      </>
                    ) : (
                      <>
                        <div className="led-head led-anim">
                          <span className="led-seal" aria-hidden="true">
                            <span className="led-seal-n">{ROMAN[i]}</span>
                          </span>
                          <div>
                            <p className="ckl-eyebrow ckl-eyebrow--gold">{e.tag}</p>
                            <p className="led-e-year">{e.year}</p>
                          </div>
                        </div>
                        <h3 className="led-e-title led-anim">{e.title}</h3>
                        <p className="led-e-copy led-anim">{e.body}</p>
                        {e.source && <p className="led-e-source">{e.source}</p>}
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <nav className="led-rail" aria-label="Jump to an era">
          <span className="led-rail-bar" aria-hidden="true"><span ref={barRef} /></span>
          <ul>
            {ERAS.map((x) => {
              const first = NODES.findIndex((n) => n.era === x.key);
              return (
                <li key={x.key}>
                  <button
                    type="button"
                    onClick={() => goTo(first)}
                    aria-current={era === x.key ? 'true' : undefined}
                    className={era === x.key ? 'is-on' : undefined}
                  >
                    <span className="led-rail-label">{x.label}</span>
                    <span className="led-rail-range">{x.range}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

const FIGURES = [
  { n: '268', l: 'years of journeys', s: 'Founded 25 May 1758' },
  { n: '100+', l: 'destinations', s: 'Ground partners in each' },
  { n: 'VII', l: 'continents', s: 'Antarctica included' },
  { n: '1', l: 'named specialist', s: 'On your file, start to finish' },
];

/* PLACEHOLDER ROSTER — real names, roles and headshots before launch. */
const LEADERS = [
  {
    name: 'Ramalingam Subramanian',
    role: 'President, Cox & Kings',
    photo: 'photo-1560250097-0b93528c311a',
    bio: 'Leads the revival of Cox & Kings under Wilson & Hughes — rebuilding the company around what today’s traveller actually expects, without mislaying what took 268 years to earn.',
  },
  {
    name: 'Karan Agarwal',
    role: 'Director, Cox & Kings India',
    photo: 'photo-1519085360753-af0119f7cbe7',
    bio: 'Building the franchise, agent and holiday-club network across India, so there is a person within reach of you — not only a phone number.',
  },
];

const SPECIALISTS = [
  {
    name: 'Meera Sundaram', role: 'Europe', years: '18 years',
    photo: 'photo-1573496359142-b8d87734a5a2',
    bio: 'Knows which Tuscan road is worth the detour, and which one is only longer.',
  },
  {
    name: 'Arjun Rao', role: 'Japan & East Asia', years: '12 years',
    photo: 'photo-1507003211169-0a1dd7228f2d',
    bio: 'Books the ryokan, then calls ahead about the dietary requirement you mentioned in passing.',
  },
  {
    name: 'Nisha Verma', role: 'Family & senior travel', years: '14 years',
    photo: 'photo-1580489944761-15a19d654956',
    bio: 'Builds itineraries a six-year-old and a seventy-year-old can both enjoy on the same day.',
  },
];

const CARE = [
  { k: 'Pace, stated honestly', v: 'Every itinerary tells you how much walking there is, how many early starts, and how many stairs. Nobody should discover the hard day while standing at the bottom of it.' },
  { k: 'Food that actually suits you', v: 'Vegetarian, Jain and Indian meals arranged in advance — not requested at the table. Say it once, on the booking form.' },
  { k: 'Travelling with parents', v: 'Lifts over stairs, longer transfer times, rooms near the lobby, and a tour manager who has been asked all of this before.' },
  { k: 'Someone awake while you sleep', v: 'A WhatsApp line to a real person for the whole trip — in your timezone, and in ours.' },
];

const FAQ = [
  {
    q: 'Who owns Cox & Kings now?',
    a: 'Wilson & Hughes Pte Ltd, a Singapore-based investment firm, owns the brand and the India travel business outright. They also hold companies in supply chain and building materials. They bought Cox & Kings to run it — not to flip a logo.',
  },
  {
    q: 'Is this a franchise, or a licence on an old name?',
    a: 'Neither. The brand and the India travel business were acquired together, and the company plans and operates the journeys it sells. The people who design your trip are on our payroll, not a marketplace.',
  },
  {
    q: 'What has actually changed under the new ownership?',
    a: 'New capital, new leadership, and a smaller, more deliberate programme. Every escorted departure is capped at 24 travellers and led by a tour manager who has run that route before. Every booking gets one named specialist, start to finish.',
  },
  {
    q: 'Group tour or tailor-made — which am I?',
    a: 'If you want the route solved for you and good company on it, take an escorted group tour. If you want the trip built around your dates, your pace and your budget, take a tailor-made journey. If you genuinely don’t know, call us and we will tell you honestly which one you are — even when it’s the cheaper one.',
  },
  {
    q: 'How do I know my booking is in safe hands?',
    a: 'Every invoice carries the company’s registered name and GSTIN. Pay by card and your bank’s chargeback protection stays in force exactly as normal. Ask us where your deposit is held before you pay it — we will answer on the phone or in writing, whichever you prefer.',
  },
];

/* -------------------------------------------------------------------------- */

function Reveal({ children, className = '', as: As = 'div', delay = 0, ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(el, { opacity: 0, y: 26 }, {
        opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay,
        scrollTrigger: { trigger: el, start: 'top 88%' },
      });
    });
    return () => mm.revert();
  }, [delay]);
  return <As ref={ref} className={className} {...rest}>{children}</As>;
}

/* An arched plate. The signature shape of the page — every photograph on it is
   cut by the same arch, and the picture inside drifts against the frame. */
function Arch({ src, alt, className = '', tone = false, ratio = '3 / 4' }) {
  const wrap = useRef(null);
  const pic = useRef(null);
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(wrap.current,
        { clipPath: 'inset(100% 0 0 0)' },
        {
          clipPath: 'inset(0% 0 0 0)', duration: 1.25, ease: 'expo.out',
          scrollTrigger: { trigger: wrap.current, start: 'top 86%' },
        });
      gsap.fromTo(pic.current, { yPercent: -8 }, {
        yPercent: 8, ease: 'none',
        scrollTrigger: { trigger: wrap.current, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });
    return () => mm.revert();
  }, []);
  return (
    <figure
      ref={wrap}
      className={`ckl-arch${tone ? ' is-tone' : ''} ${className}`}
      style={{ aspectRatio: ratio }}
    >
      <img ref={pic} src={src} alt={alt} loading="lazy" decoding="async" />
      <span className="ckl-arch-ring" aria-hidden="true" />
    </figure>
  );
}

function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <ul className="ckl-faq">
      {FAQ.map((f, i) => {
        const on = open === i;
        return (
          <li key={f.q} className={on ? 'is-open' : undefined}>
            <h3>
              <button type="button" aria-expanded={on} aria-controls={`faq-${i}`} onClick={() => setOpen(on ? null : i)}>
                <span className="ckl-faq-n">{String(i + 1).padStart(2, '0')}</span>
                <span className="ckl-faq-q">{f.q}</span>
                {on ? <Minus size={20} aria-hidden="true" /> : <Plus size={20} aria-hidden="true" />}
              </button>
            </h3>
            <div id={`faq-${i}`} className="ckl-faq-a" hidden={!on}>
              <p>{f.a}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

const PRESS = ['cntraveller', 'natgeo', 'travel-leisure', 'forbes', 'telegraph', 'harpers-bazaar'];

/* ==========================================================================
   THE PAGE
   ========================================================================== */
export default function AboutLedger() {
  const [menu, setMenu] = useState(false);
  const [chat, setChat] = useState(false);
  const [solid, setSolid] = useState(false);
  const heroImg = useRef(null);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* The hero opens: the photograph settles out of a slow push-in while the
     headline rises. One orchestrated load beats a dozen scattered fidgets. */
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(heroImg.current, { scale: 1.14 }, { scale: 1, duration: 2.4, ease: 'expo.out' });
      gsap.fromTo('.ckl-hero-rise', { y: 34, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, ease: 'power3.out', stagger: 0.09, delay: 0.25 });
      gsap.to(heroImg.current, {
        yPercent: 12, ease: 'none',
        scrollTrigger: { trigger: '.ckl-hero', start: 'top top', end: 'bottom top', scrub: true },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <>
      <div className="ckl">
        <a href="#main" className="ckl-skip">Skip to content</a>

        {/* ---------- CHROME ---------- */}
        <header className={`ckl-nav${solid ? ' is-solid' : ''}`}>
          <Link to="/" className="ckl-brand" aria-label="Cox & Kings — home">
            <img src="/cox-logo-light.svg" alt="Cox & Kings" />
          </Link>
          <nav className="ckl-nav-links" aria-label="Primary">
            <Link to="/journeys">Journeys</Link>
            <Link to="/journeys2">Destinations</Link>
            <a href="#timeline">Our history</a>
            <a href="#team">The team</a>
          </nav>
          <div className="ckl-nav-cta">
            <a href={CONTACT.phoneHref} className="ckl-nav-phone">
              <Phone size={15} aria-hidden="true" /> <span>{CONTACT.phoneDisplay}</span>
            </a>
            <Link to={CALLBACK} className="ckl-btn ckl-btn--gold">Talk to a specialist</Link>
            <button type="button" className="ckl-burger" aria-label="Open menu" onClick={() => setMenu(true)}>
              <Menu size={22} aria-hidden="true" />
            </button>
          </div>
        </header>

        <div className={`ckl-menu${menu ? ' is-open' : ''}`} aria-hidden={!menu}>
          <div className="ckl-menu-scrim" onClick={() => setMenu(false)} />
          <div className="ckl-menu-panel" role="dialog" aria-modal="true" aria-label="Menu">
            <button type="button" className="ckl-menu-close" aria-label="Close menu" onClick={() => setMenu(false)}>
              <X size={20} aria-hidden="true" />
            </button>
            <nav aria-label="Mobile primary">
              {[
                { l: 'Our purpose', h: '#purpose' },
                { l: 'Our history', h: '#timeline' },
                { l: 'A new chapter', h: '#chapter' },
                { l: 'The team', h: '#team' },
                { l: 'On the road', h: '#care' },
                { l: 'Straight answers', h: '#faq' },
              ].map((n) => (
                <a key={n.l} href={n.h} onClick={() => setMenu(false)}>
                  {n.l} <ArrowRight size={16} aria-hidden="true" />
                </a>
              ))}
            </nav>
            <a href={CONTACT.phoneHref} className="ckl-btn ckl-btn--gold ckl-menu-cta" onClick={() => setMenu(false)}>
              <Phone size={16} aria-hidden="true" /> Speak to a specialist
            </a>
          </div>
        </div>

        <main id="main">
          {/* ---------- 1 · THE HERO (night) ---------- */}
          <section className="ckl-hero" id="top">
            <div className="ckl-hero-media" aria-hidden="true">
              <img ref={heroImg} src={img('photo-1483347756197-71ef80e95f73', 2000)} alt="" />
              <span className="ckl-hero-veil" />
              <span className="ckl-hero-grain" />
            </div>

            <div className="ckl-hero-body">
              <p className="ckl-eyebrow ckl-eyebrow--gold ckl-hero-rise">About Cox &amp; Kings India</p>
              <h1 className="ckl-h1 ckl-hero-rise">
                The world’s oldest<br />travel company.<br />
                <em>Beginning again.</em>
              </h1>
              <p className="ckl-hero-sub ckl-hero-rise">
                Founded in 1758, Cox &amp; Kings has arranged the passage of soldiers, poets,
                mountaineers and prime ministers. In 2024 it was acquired by Wilson &amp; Hughes —
                new capital, new leadership, and a mandate to build the next hundred years on top
                of the last two hundred and sixty-eight.
              </p>
              <div className="ckl-hero-ctas ckl-hero-rise">
                <Link to={CALLBACK} className="ckl-btn ckl-btn--gold ckl-btn--lg">Talk to a specialist</Link>
                <a href="#timeline" className="ckl-btn ckl-btn--ghost ckl-btn--lg">
                  Walk the 268 years <ArrowRight size={16} aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* the rule the whole page walks — the same line the ledger travels */}
            <div className="ckl-hero-rule ckl-hero-rise" aria-hidden="true">
              <span className="ckl-hero-rule-line" />
              <span className="ckl-hero-rule-tick"><i />MDCCLVIII</span>
            </div>
          </section>

          {/* ---------- 2 · THE PURPOSE (paper) ---------- */}
          <section className="ckl-sec ckl-purpose" id="purpose" aria-labelledby="purpose-h">
            <div className="ckl-wrap ckl-purpose-grid">
              <div className="ckl-purpose-text">
                <Reveal as="p" className="ckl-eyebrow">Our purpose</Reveal>
                <Reveal as="h2" className="ckl-h2" id="purpose-h">
                  We have never been the traveller. We’ve been the name in the
                  <em> margin</em> of everyone else’s journey.
                </Reveal>
                <Reveal as="div" className="ckl-prose">
                  <p className="ckl-drop">
                    Churchill’s. Mallory’s. Gandhi’s. We didn’t climb the mountain — we got the
                    climber his boots. For two hundred and sixty-eight years this company has been
                    the quiet hand that made somebody else’s passage possible, and there is no
                    prouder job in travel than that one.
                  </p>
                  <p>
                    Which is why we have been part of family albums, farewell hugs and airport
                    tears. Change is constant; the soul of travel is worth preserving.
                  </p>
                </Reveal>
                <Reveal as="blockquote" className="ckl-pull">
                  Our purpose is to recreate that feeling, for you and yours — when wonder came
                  naturally, and the world felt full of possibility.
                </Reveal>
              </div>

              <div className="ckl-purpose-art">
                <Arch
                  src={img('photo-1492571350019-22de08371fd3', 900)}
                  alt="Cherry blossom over a Japanese street at dusk"
                  ratio="3 / 4.4"
                />
                <Arch
                  src={img('photo-1534445867742-43195f401b6c', 700)}
                  alt="The Italian lakes at first light"
                  className="ckl-arch--offset"
                  ratio="3 / 3.6"
                />
              </div>
            </div>
          </section>

          {/* ---------- 3 · IN FIGURES (paper2) ---------- */}
          <section className="ckl-figs" aria-label="Cox &amp; Kings in figures">
            <div className="ckl-wrap">
              <dl className="ckl-figs-row">
                {FIGURES.map((f, i) => (
                  <Reveal as="div" key={f.l} className="ckl-fig" delay={i * 0.06}>
                    <dt>{f.n}</dt>
                    <dd>
                      <span className="ckl-fig-l">{f.l}</span>
                      <span className="ckl-fig-s">{f.s}</span>
                    </dd>
                  </Reveal>
                ))}
              </dl>
            </div>
          </section>

          {/* ---------- 4 · THE LEDGER (night) ---------- */}
          <Ledger />

          {/* ---------- 5 · A NEW CHAPTER (paper) ---------- */}
          <section className="ckl-sec ckl-chapter" id="chapter" aria-labelledby="chapter-h">
            <div className="ckl-wrap ckl-chapter-grid">
              <div className="ckl-chapter-art">
                <Arch
                  src={img('photo-1467269204594-9661b134dd2b', 900)}
                  alt="A European city at golden hour"
                  ratio="3 / 4"
                />
              </div>
              <div className="ckl-chapter-text">
                <Reveal as="p" className="ckl-eyebrow">2024 · A new chapter</Reveal>
                <h2 className="ckl-h2" id="chapter-h" tabIndex={-1}>
                  Acquired by <em>Wilson &amp; Hughes</em>.
                </h2>
                <Reveal as="div" className="ckl-prose">
                  <p>
                    In 2024 the Cox &amp; Kings brand and its India travel business were acquired
                    by Wilson &amp; Hughes Pte Ltd — a Singapore investment firm that backs
                    businesses it intends to run, not resell.
                  </p>
                  <p>
                    They brought capital, a new leadership team, and a deliberately smaller
                    programme: fewer departures, capped in size, each one led by a tour manager who
                    has walked the route. Their words for what they want from us are plain enough —
                    to <em>empower travellers to discover the world on their terms, blending
                    heritage with innovation</em>.
                  </p>
                </Reveal>
                <ul className="ckl-chapter-facts">
                  {[
                    ['Owner', 'Wilson & Hughes Pte Ltd, Singapore'],
                    ['Since', '2024 — outright ownership of brand and business'],
                    ['Also holds', 'Alliance World (supply chain) · Duraton Cement'],
                    ['Mandate', 'Rebuild Cox & Kings for the next hundred years'],
                  ].map(([k, v], i) => (
                    <Reveal as="li" key={k} delay={i * 0.05}>
                      <span>{k}</span>
                      <strong>{v}</strong>
                    </Reveal>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* ---------- 6 · THE TEAM (paper2) ---------- */}
          <section className="ckl-sec ckl-team" id="team" aria-labelledby="team-h">
            <div className="ckl-wrap">
              <div className="ckl-team-head">
                <div>
                  <Reveal as="p" className="ckl-eyebrow">The team</Reveal>
                  <Reveal as="h2" className="ckl-h2" id="team-h">
                    The people who’ll <em>actually plan</em> your trip.
                  </Reveal>
                </div>
                <Reveal as="p" className="ckl-lede">
                  Not a call centre. One named person on your file, from the first phone call to
                  the day you land home — and above them, two people whose names are on the
                  company.
                </Reveal>
              </div>

              <ul className="ckl-leaders">
                {LEADERS.map((p, i) => (
                  <Reveal as="li" key={p.name} delay={i * 0.08}>
                    <Arch src={img(p.photo, 700)} alt={`${p.name}, ${p.role}`} tone ratio="3 / 3.7" />
                    <div className="ckl-person">
                      <p className="ckl-person-role">{p.role}</p>
                      <h3 className="ckl-person-name">{p.name}</h3>
                      <p className="ckl-person-bio">{p.bio}</p>
                    </div>
                  </Reveal>
                ))}
              </ul>

              <Reveal as="p" className="ckl-team-div">Your specialists</Reveal>

              <ul className="ckl-people">
                {SPECIALISTS.map((s, i) => (
                  <Reveal as="li" key={s.name} delay={i * 0.06}>
                    <Arch src={img(s.photo, 560)} alt={`${s.name}, ${s.role} specialist`} tone ratio="3 / 3.4" />
                    <div className="ckl-person">
                      <p className="ckl-person-role">{s.role} · {s.years}</p>
                      <h3 className="ckl-person-name">{s.name}</h3>
                      <p className="ckl-person-bio">{s.bio}</p>
                    </div>
                  </Reveal>
                ))}
              </ul>

              <Reveal as="div" className="ckl-team-cta">
                <p>Not sure who you need? Tell us where you’re going and we’ll put the right one on the phone.</p>
                <div className="ckl-team-cta-row">
                  <a href={CONTACT.phoneHref} className="ckl-btn ckl-btn--ink ckl-btn--lg">
                    <Phone size={16} aria-hidden="true" /> {CONTACT.phoneDisplay}
                  </a>
                  <a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer" className="ckl-btn ckl-btn--line ckl-btn--lg">
                    <MessageCircle size={16} aria-hidden="true" /> WhatsApp us
                  </a>
                </div>
              </Reveal>
            </div>
          </section>

          {/* ---------- 7 · ON THE ROAD (paper) ---------- */}
          <section className="ckl-sec ckl-care" id="care" aria-labelledby="care-h">
            <div className="ckl-wrap ckl-care-grid">
              <div className="ckl-care-text">
                <Reveal as="p" className="ckl-eyebrow">On the ground</Reveal>
                <Reveal as="h2" className="ckl-h2" id="care-h">
                  How we look after you <em>on the road</em>.
                </Reveal>
                <dl className="ckl-care-list">
                  {CARE.map((c, i) => (
                    <Reveal key={c.k} className="ckl-care-item" delay={i * 0.05}>
                      <dt><span>{String(i + 1).padStart(2, '0')}</span>{c.k}</dt>
                      <dd>{c.v}</dd>
                    </Reveal>
                  ))}
                </dl>
              </div>
              <div className="ckl-care-art">
                <Arch
                  src={img('photo-1516426122078-c23e76319801', 800)}
                  alt="Elephants on the plains at dusk"
                  ratio="3 / 4.6"
                />
              </div>
            </div>
          </section>

          {/* ---------- 8 · PROOF (paper2) ---------- */}
          <section className="ckl-proof" id="proof" aria-labelledby="proof-h">
            <div className="ckl-wrap">
              <Reveal as="p" className="ckl-eyebrow ckl-proof-eyebrow">Accredited &amp; featured</Reveal>
              <Reveal as="h2" className="ckl-h3" id="proof-h">
                Members of the registers that matter — look us up on any of them.
              </Reveal>
              <Reveal as="ul" className="ckl-accred">
                {['IATA', 'ASTA', 'USTOA', 'TAAI', 'Adventure Travel Trade Association'].map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </Reveal>
              <Reveal as="ul" className="ckl-press">
                {PRESS.map((p) => (
                  <li key={p}><img src={`/press/${p}.svg`} alt="" aria-hidden="true" loading="lazy" /></li>
                ))}
              </Reveal>
            </div>
          </section>

          {/* ---------- 9 · FAQ (paper) ---------- */}
          <section className="ckl-sec ckl-faq-sec" id="faq" aria-labelledby="faq-h">
            <div className="ckl-wrap ckl-wrap--narrow">
              <Reveal as="p" className="ckl-eyebrow">Straight answers</Reveal>
              <Reveal as="h2" className="ckl-h2" id="faq-h">
                The questions people <em>actually ask us</em>.
              </Reveal>
              <Faq />
            </div>
          </section>

          {/* ---------- 10 · THE BLANK LINE (night) ---------- */}
          <section className="ckl-end" id="contact" aria-labelledby="end-h">
            <div className="ckl-end-grain" aria-hidden="true" />
            <div className="ckl-wrap">
              <p className="ckl-eyebrow ckl-eyebrow--gold">Talk to us</p>
              <h2 className="ckl-end-h" id="end-h">
                Two hundred and sixty-eight years,<br />
                thousands of names in the margin.<br />
                <em>The next one is yours.</em>
              </h2>
              <p className="ckl-end-p">
                A specialist picks up — not a queue, not a bot. 9am to 9pm IST, every day.
              </p>
              <div className="ckl-end-ctas">
                <a href={CONTACT.phoneHref} className="ckl-btn ckl-btn--gold ckl-btn--lg">
                  <Phone size={17} aria-hidden="true" /> {CONTACT.phoneDisplay}
                </a>
                <Link to="/journeys2" className="ckl-btn ckl-btn--ghost ckl-btn--lg">
                  Browse our journeys <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              </div>
              <div className="ckl-end-rule" aria-hidden="true">
                <i className="ckl-caret" />
                <span />
              </div>
            </div>
          </section>
        </main>

        <footer className="ckl-foot">
          <div className="ckl-wrap ckl-foot-in">
            <div className="ckl-foot-brand">
              <img src="/cox-logo-light.svg" alt="Cox & Kings" />
              <p>Founded 1758. A new chapter since 2024, under Wilson &amp; Hughes.</p>
            </div>
            <nav className="ckl-foot-links" aria-label="Footer">
              <Link to="/journeys">Journeys</Link>
              <Link to="/journeys2">Destinations</Link>
              <a href="#team">The team</a>
              <Link to={CALLBACK}>Contact</Link>
            </nav>
            <div className="ckl-foot-contact">
              <a href={CONTACT.phoneHref}>{CONTACT.phoneDisplay}</a>
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            </div>
          </div>
          <p className="ckl-foot-bottom">
            © {new Date().getFullYear()} Cox &amp; Kings. Owned and operated by Wilson &amp; Hughes Pte Ltd.
            {/* CLIENT CONTENT — put the real registered office, CIN/GSTIN and the
                IATA / ASTA / USTOA / TAAI membership NUMBERS here as plain text.
                Persona testing was unanimous: "available on request" is not proof. */}
            <span className="ckl-foot-note">
              Registered office, CIN and our IATA, ASTA and TAAI membership numbers appear on every
              booking confirmation — and we’ll send them in writing before you pay a rupee.
            </span>
          </p>
        </footer>

        <button type="button" className={`ckl-fab${chat ? ' is-hidden' : ''}`} onClick={() => setChat(true)}>
          <Sparkles size={18} aria-hidden="true" /> <span>Ask Enaya</span>
        </button>

        <div className="ckl-thumb">
          <a href={CONTACT.phoneHref} className="ckl-thumb-cta">
            <Phone size={17} aria-hidden="true" /> Talk to a specialist
          </a>
          <button type="button" className="ckl-thumb-alt" aria-label="Ask Enaya, the travel assistant" onClick={() => setChat(true)}>
            <Sparkles size={19} aria-hidden="true" />
          </button>
        </div>
      </div>

      <ChatBot open={chat} onOpenChange={setChat} hideFab name="Enaya" />
    </>
  );
}
