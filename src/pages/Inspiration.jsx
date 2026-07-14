/* ============================================================
   Inspiration (/inspiration) — "Dispatches", the Cox & Kings journal.

   The inspiration page is the homepage's job #5 ("create desire") given its
   own room. The visitor it exists for — inspired but undecided (segment S5) —
   has nowhere useful to go on a listing page, because they do not yet know
   what they want. So this is not a catalogue with better photographs. It is a
   magazine, and the only things it asks of you are "read this" and "talk to
   the person who wrote it".

   DESIGN
   ------
   The theme is /new3's. The page root carries `h26 new-typo n3` — the three
   classes that Home2026.css (colour tokens), NewTypography.css (Cormorant
   Garamond + Work Sans and its heading weight ramp) and New3.css (the gutter
   system) hang their rules off. So the navbar and footer below are /new3's
   verbatim with no wrapper needed, and the page reads as the same site rather
   than a microsite that borrowed the logo.

   What the page adds of its own is scoped `insp-` (Inspiration.css) and built
   on design.md: Voyager Blue for actions, Sienna Flame as the single editorial
   accent, warm paper neutrals as ground, 4px radii on interactive elements,
   and wide-tracked uppercase Work Sans labels.

   MOTION (GSAP + ScrollTrigger)
   -----------------------------
     1. Hero    — three photographic columns at three parallax speeds; the
                  masthead rises word by word through a type mask.
     2. Lead    — the plate wipes open from an inset crop to full-bleed while
                  the photograph inside it de-zooms; a ghost folio counter-drifts.
     3. Rail    — PINNED; vertical scroll is remapped to horizontal, and each
                  photograph parallaxes inside its frame (`containerAnimation`).
     4. Ribbon  — an infinite marquee whose speed and skew are driven by scroll
                  VELOCITY, so the band leans the way you are reading.
     5. Reveals — a generic [data-reveal] / [data-rule] pass.

   All of it runs inside gsap.context + matchMedia. Reduced motion gets none of
   it; ≤900px gets the reveals only (no pin, no scrub) and the rail falls back
   to the native snap-scroll shelf its stylesheet already defines. Every CSS
   resting state IS the finished state, so if the JS never runs the page is
   still whole rather than a column of invisible divs.
   ============================================================ */
import { Fragment, useState, useMemo, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { SmartLink as Link, CALLBACK, useScheduleCall } from '../components/ScheduleCall';
import { SiteNav, SiteFooter } from '../components/SiteChrome';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Phone, ArrowRight, Clock, Check, MoveHorizontal } from 'lucide-react';
import { img } from '../data/v3content';
import { CATS, WRITER_BY_ID, LEAD_POST, RAIL_POSTS, INDEX_POSTS } from '../data/dispatches';
import './Home2026.css';
import './Home2026Improved.css';
import './NewTypography.css';
import './New3.css';
import './Inspiration.css';

gsap.registerPlugin(ScrollTrigger);

const U = (id) => `https://images.unsplash.com/photo-${id}`;

/* /improved-scoped direct line — the one /new3 and /journeys4 carry. */
const CONTACT = {
  phoneDisplay: '+91 8556001700',
  phoneHref: 'tel:+918556001700',
  email: 'journeys@coxandkings.com',
};



/* ---- Byline + date + reading time. Shared by every card here and by the
   article page's standfirst — which already carries the writer's name and
   portrait above it, and so asks for `author={false}` rather than saying it
   twice in two lines. ---- */
export function Meta({ post, className = '', author = true }) {
  const writer = WRITER_BY_ID[post.by];
  return (
    <p className={`insp-meta ${className}`}>
      {author && (
        <>
          <span>{writer.name}</span>
          <span className="insp-dot" aria-hidden="true" />
        </>
      )}
      <time dateTime={post.date}>{post.dateLabel}</time>
      <span className="insp-dot" aria-hidden="true" />
      <span><Clock size={12} style={{ verticalAlign: '-2px', marginRight: 5 }} />{post.read} min read</span>
    </p>
  );
}

/* Split a headline into mask-wrapped words for the load-in reveal. `em` is the
   phrase the display type italicises — matched as words, not as markup, so the
   accessible name stays plain text. */
function Masked({ text, em = '', className = '' }) {
  const emWords = em ? em.split(' ') : [];
  return (
    <span className={className} aria-label={text}>
      {text.split(' ').map((w, i) => (
        <Fragment key={i}>
          <span className="insp-mask" aria-hidden="true">
            <span className="insp-word">
              {emWords.includes(w) ? <em>{w}</em> : w}
            </span>
          </span>{' '}
        </Fragment>
      ))}
    </span>
  );
}

export default function Inspiration() {
  const [cat, setCat] = useState('All');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const rootRef = useRef(null);
  const railRef = useRef(null);
  const trackRef = useRef(null);
  const progRef = useRef(null);
  const gridRef = useRef(null);

  const openScheduleCall = useScheduleCall();

  /* How many pieces sit behind each filter. A count on a chip is the
     difference between a filter and a guess. */
  const counts = useMemo(() => {
    const out = { All: INDEX_POSTS.length };
    for (const c of CATS) out[c] = INDEX_POSTS.filter((p) => p.cat === c).length;
    return out;
  }, []);

  const shown = useMemo(
    () => (cat === 'All' ? INDEX_POSTS : INDEX_POSTS.filter((p) => p.cat === cat)),
    [cat],
  );

  /* ============================================================
     THE SCROLL SYSTEM — one context, one matchMedia.

     `motion` gates everything: under prefers-reduced-motion nothing below runs,
     and because every CSS resting state IS the finished state, the page simply
     stands still and complete. `desktop` gates the expensive work (the pin and
     the scrubs); phones get the reveals only.
     ============================================================ */
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          motion: '(prefers-reduced-motion: no-preference)',
          desktop: '(min-width: 901px)',
        },
        (self) => {
          const { motion, desktop } = self.conditions;
          if (!motion) return;

          /* ---- 1. THE MASTHEAD ---- */
          gsap.from('.insp-hero-col', {
            clipPath: 'inset(100% 0% 0% 0%)',
            duration: 1.5,
            ease: 'power3.inOut',
            stagger: 0.12,
          });

          gsap.from('.insp-hero-title .insp-word', {
            yPercent: 115,
            duration: 1.15,
            ease: 'power4.out',
            stagger: 0.075,
            delay: 0.35,
          });

          gsap.from(['.insp-hero-lede', '.insp-hero-cue'], {
            opacity: 0,
            y: 18,
            duration: 1,
            ease: 'power3.out',
            stagger: 0.12,
            delay: 0.8,
          });

          if (desktop) {
            /* Three columns, three speeds — the plate has depth. The travel is
               bounded by the plate's 20% overhang (Inspiration.css): the tallest
               column moves 13% of its own height, and its own height is 1.4× the
               hero's, so nothing pulls an edge into view. */
            gsap.to('.insp-hero-col', {
              yPercent: (i) => [-8, 6, -13][i],
              ease: 'none',
              scrollTrigger: {
                trigger: '.insp-hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true,
              },
            });

            /* The masthead lets go before the section does. */
            gsap.to('.insp-hero-inner', {
              yPercent: -14,
              opacity: 0,
              ease: 'none',
              scrollTrigger: {
                trigger: '.insp-hero',
                start: '55% center',
                end: 'bottom top',
                scrub: true,
              },
            });

            /* ---- 2. THE LEAD ----
               The plate is laid onto the page: an inset crop opens to full-bleed
               while the photograph inside it de-zooms. Both tweens share one
               scrub range, so they resolve together. */
            const laying = {
              trigger: '.insp-lead-fig',
              start: 'top 92%',
              end: 'top 22%',
              scrub: 0.6,
            };
            gsap.from('.insp-lead-fig', {
              clipPath: 'inset(14% 20% 14% 20%)',
              ease: 'none',
              scrollTrigger: laying,
            });
            gsap.from('.insp-lead-fig img', {
              scale: 1.32,
              ease: 'none',
              scrollTrigger: laying,
            });

            /* …and keeps drifting once it has landed. */
            gsap.to('.insp-lead-fig img', {
              yPercent: -7,
              ease: 'none',
              scrollTrigger: {
                trigger: '.insp-lead-fig',
                start: 'top 20%',
                end: 'bottom top',
                scrub: true,
              },
            });

            /* The ghost folio runs against the scroll. */
            gsap.fromTo('.insp-lead-ghost',
              { yPercent: 26 },
              {
                yPercent: -26,
                ease: 'none',
                scrollTrigger: {
                  trigger: '.insp-lead',
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: true,
                },
              },
            );

            /* ---- 3. THE RAIL ----
               Vertical scroll remapped to horizontal. The distance is read
               through a function + invalidateOnRefresh, so a resize or a
               late-decoding image recomputes it instead of stranding the track
               halfway along. */
            const track = trackRef.current;
            const rail = railRef.current;
            if (track && rail) {
              const distance = () => Math.max(0, track.scrollWidth - rail.clientWidth);

              const drag = gsap.to(track, {
                x: () => -distance(),
                ease: 'none',
                scrollTrigger: {
                  trigger: rail,
                  start: 'top top',
                  end: () => `+=${distance()}`,
                  pin: true,
                  scrub: 0.5,
                  anticipatePin: 1,
                  invalidateOnRefresh: true,
                  onUpdate: (st) => {
                    if (progRef.current) progRef.current.style.transform = `scaleX(${st.progress})`;
                  },
                },
              });

              /* Each photograph parallaxes inside its own frame as its card
                 crosses the viewport. `containerAnimation` is what makes this
                 legal: the trigger is measured along the HORIZONTAL tween rather
                 than the page. The image is 125% of its frame (Inspiration.css),
                 and that overhang is the room these ±8% have to move in. */
              gsap.utils.toArray('.insp-rcard-fig').forEach((figure) => {
                gsap.fromTo(figure.querySelector('img'),
                  { xPercent: -8 },
                  {
                    xPercent: 8,
                    ease: 'none',
                    scrollTrigger: {
                      trigger: figure,
                      containerAnimation: drag,
                      start: 'left right',
                      end: 'right left',
                      scrub: true,
                    },
                  },
                );
              });
            }

            /* ---- 7. THE SIGN-OFF backdrop ----
               The scale has to out-cover the drift: yPercent ±8 moves the image
               by 8% of its own height each way, so a 1.14 scale (7% of overhang
               per edge) would just barely pull an edge into frame. 1.25 leaves
               room. */
            gsap.fromTo('.insp-signoff-bg img',
              { yPercent: -8, scale: 1.25 },
              {
                yPercent: 8,
                ease: 'none',
                scrollTrigger: {
                  trigger: '.insp-signoff',
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: true,
                },
              },
            );
          }

          /* ---- 4. THE RIBBON ----
             The loop is independent of scroll; scroll VELOCITY only bends it.
             The x lives on the track and the skew on its parent, so the two
             tweens can never overwrite one another. */
          const loop = gsap.to('.insp-ribbon-track', {
            xPercent: -50,
            duration: 30,
            ease: 'none',
            repeat: -1,
          });

          ScrollTrigger.create({
            trigger: '.insp-ribbon',
            start: 'top bottom',
            end: 'bottom top',
            onUpdate: (st) => {
              const v = gsap.utils.clamp(-3, 3, st.getVelocity() / 420);
              gsap.to(loop, { timeScale: 1 + Math.abs(v) * 0.85, duration: 0.5, overwrite: true });
              gsap.to('.insp-ribbon-skew', { skewX: -v * 1.6, duration: 0.6, ease: 'power2.out', overwrite: true });
            },
            onLeave: () => gsap.to('.insp-ribbon-skew', { skewX: 0, duration: 0.4 }),
            onLeaveBack: () => gsap.to('.insp-ribbon-skew', { skewX: 0, duration: 0.4 }),
          });

          /* ---- 5. THE GENERIC PASS — copy rises, rules draw themselves. ---- */
          gsap.utils.toArray('[data-reveal]').forEach((el) => {
            gsap.from(el, {
              opacity: 0,
              y: 28,
              duration: 0.95,
              ease: 'power3.out',
              scrollTrigger: { trigger: el, start: 'top 88%', once: true },
            });
          });

          gsap.utils.toArray('[data-rule]').forEach((el) => {
            gsap.from(el, {
              scaleX: 0,
              duration: 1.2,
              ease: 'power3.inOut',
              scrollTrigger: { trigger: el, start: 'top 92%', once: true },
            });
          });
        },
      );
    }, rootRef);

    /* Photographs decode after ScrollTrigger has already measured the page —
       most consequentially the rail, whose pin distance is the track's real
       width. One refresh once everything has settled. */
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);

    return () => {
      window.removeEventListener('load', onLoad);
      ctx.revert();
    };
  }, []);

  /* The index re-renders whenever the filter changes, so its reveal lives in
     its own context keyed on `cat`: the previous context is reverted (which
     restores the old cards' inline styles) and the new cards get a fresh
     stagger.

     The refresh is the load-bearing part. Filtering changes the grid's height,
     which moves every trigger below it AND every trigger on the incoming cards
     themselves — measured, otherwise, against the layout the page had before
     the filter ran. That is what left a card sitting at opacity 0 while its
     reveal waited for a scroll position the page no longer had. */
  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.insp-card').forEach((el, i) => {
        gsap.from(el, {
          opacity: 0,
          y: 36,
          duration: 0.9,
          ease: 'power3.out',
          delay: (i % 3) * 0.08,
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        });
      });
    }, gridRef);
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [cat]);

  const onSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
  };

  return (
    <div className="insp h26 new-typo n3" ref={rootRef}>
      <a className="h26-skip" href="#index">Skip to the index</a>

      <SiteNav />

      {/* ============================================================
          1. THE MASTHEAD
          ============================================================ */}
      <section className="insp-hero">
        <div className="insp-hero-plates" aria-hidden="true">
          {['1522383225653-ed111181a951', '1483347756197-71ef80e95f73', '1534445867742-43195f401b6c'].map((id) => (
            <div className="insp-hero-col" key={id}>
              <img src={img(U(id), 1200)} alt="" />
            </div>
          ))}
        </div>
        <div className="insp-hero-veil" aria-hidden="true" />

        <div className="insp-hero-inner">
          {/* Two deliberate lines, not one line left to wrap. Set as a single
              string, "go." dropped alone onto the second line at most widths —
              an orphan, and the masthead is the one place on the page that
              cannot afford to look accidental. */}
          <h1 className="insp-hero-title">
            <Masked text="Read first." className="insp-hero-line" />
            <Masked text="Then go." em="Then" className="insp-hero-line" />
          </h1>

          <div className="insp-hero-foot">
            <p className="insp-hero-lede">
              Nineteen pieces from the people who plan our journeys — on the arithmetic behind a
              blossom season, the counters that take no bookings, and the one hour at the Taj
              nobody books. <strong>Nothing here is for sale.</strong> This is the reading that
              comes before the deciding.
            </p>
            <p className="insp-hero-cue">
              <span className="insp-hero-cue-track" aria-hidden="true" />
              Scroll to begin
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          2. THE LEAD
          ============================================================ */}
      <section className="insp-lead" aria-labelledby="lead-title">
        <span className="insp-lead-ghost" aria-hidden="true">01</span>

        <div className="insp-lead-inner">
          <p className="insp-label" data-reveal>The lead · {LEAD_POST.cat}</p>
          <h2 className="insp-lead-title" id="lead-title" data-reveal>
            Where the cherry trees <em>keep time</em>
          </h2>

          <Link to={`/inspiration/${LEAD_POST.slug}`} className="insp-lead-plate">
            <figure className="insp-lead-fig">
              <img src={img(U(LEAD_POST.photo), 1900)} alt={LEAD_POST.credit} />
            </figure>
          </Link>
          <p className="insp-lead-caption">
            <span>{LEAD_POST.credit}</span>
            <span className="insp-folio">Folio {LEAD_POST.n} / 19</span>
          </p>

          <div className="insp-lead-body">
            <p className="insp-lead-deck" data-reveal>{LEAD_POST.deck}</p>
            <div className="insp-lead-side" data-reveal>
              <Meta post={LEAD_POST} />
              <p className="insp-lead-note">
                Aditi runs our Japan desk. If a blossom trip is what you are after, she is the one
                who will build it — and the one who will tell you if your dates are wrong.
              </p>
              <div className="insp-lead-actions">
                <Link to={`/inspiration/${LEAD_POST.slug}`} className="h26-btn h26-btn-pill">
                  Read the lead <ArrowRight size={15} />
                </Link>
                <button type="button" className="h26-btn h26-btn-ghost" onClick={openScheduleCall}>
                  Ask Aditi
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          3. THE RAIL — pinned on desktop, a swipeable shelf on mobile.
          ============================================================ */}
      <section className="insp-rail" ref={railRef} aria-labelledby="rail-title">
        <div className="insp-rail-inner">
          <div className="insp-rail-head">
            <div>
              <p className="insp-label" data-reveal>New this month</p>
              <h2 className="insp-h2 insp-rail-title" id="rail-title" data-reveal>
                Six pieces, <em>filed</em> in June
              </h2>
            </div>
            <p className="insp-head-note" data-reveal>
              Written by the specialists who plan the trips — not by a marketing desk that has
              never been.
            </p>
          </div>

          <div className="insp-rail-view">
            <div className="insp-rail-track" ref={trackRef}>
              {RAIL_POSTS.map((p) => (
                <Link className="insp-rcard" to={`/inspiration/${p.slug}`} key={p.slug}>
                  <div className="insp-rcard-fig">
                    <span className="insp-rcard-n">{p.n}</span>
                    <img src={img(U(p.photo), 900)} alt="" />
                  </div>
                  <div className="insp-rcard-body">
                    <span className="insp-rcard-cat">{p.cat}</span>
                    <h3 className="insp-rcard-title">{p.title}</h3>
                    <p className="insp-rcard-deck">{p.deck}</p>
                    <Meta post={p} />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="insp-rail-prog" aria-hidden="true">
            <i ref={progRef} />
          </div>
          <p className="insp-rail-hint" aria-hidden="true">
            <MoveHorizontal size={14} /> Keep scrolling
          </p>
        </div>
      </section>

      {/* ============================================================
          4. THE INDEX
          ============================================================ */}
      <section className="insp-index" id="index" aria-labelledby="index-title">
        <div className="insp-index-inner">
          <div className="insp-head">
            <div className="insp-head-row">
              <div>
                <p className="insp-label" data-reveal>The index</p>
                <h2 className="insp-h2 insp-index-title" id="index-title" data-reveal>
                  Every piece, <em>filed</em> by desk
                </h2>
              </div>
              <p className="insp-head-note" data-reveal>
                The whole journal — nineteen dispatches, four to ten minutes each, and not one of
                them is a brochure.
              </p>
            </div>
            <hr data-rule />

            <div className="insp-filters" role="group" aria-label="Filter by desk">
              {['All', ...CATS].map((c) => (
                <button
                  type="button"
                  key={c}
                  className={`insp-chip${cat === c ? ' is-on' : ''}`}
                  aria-pressed={cat === c}
                  onClick={() => setCat(c)}
                >
                  {c}<i>{counts[c]}</i>
                </button>
              ))}
            </div>
          </div>

          <div className="insp-grid" ref={gridRef}>
            {shown.map((p) => (
              <Link
                className={`insp-card${p.wide && cat === 'All' ? ' is-wide' : ''}`}
                to={`/inspiration/${p.slug}`}
                key={p.slug}
              >
                <div className="insp-card-fig">
                  <img src={img(U(p.photo), p.wide ? 1400 : 800)} alt="" loading="lazy" />
                </div>
                <div className="insp-card-body">
                  <div className="insp-card-kicker">
                    <span className="insp-card-cat">{p.cat}</span>
                    <span className="insp-folio">{p.n}</span>
                  </div>
                  <h3 className="insp-card-title">{p.title}</h3>
                  <p className="insp-card-deck">{p.deck}</p>
                  <Meta post={p} />
                  <span className="insp-textlink insp-card-more">
                    <span>Read the piece</span> <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
            {shown.length === 0 && (
              <p className="insp-empty">Nothing filed to this desk yet.</p>
            )}
          </div>
        </div>
      </section>

      {/* ============================================================
          5. THE RIBBON — a quiet running strip, not a statement.

          It was a full-bleed navy band of 56px serif, which made a decorative
          marquee the loudest thing between the index and the sign-off. It is
          now a hairline-ruled paper strip in small tracked caps: still moving,
          no longer shouting.

          Each phrase also says its own thing. "Written by the people who go"
          and "Specialists, not salespeople" were two ways of making one claim,
          scrolling past twice.
          ============================================================ */}
      <div className="insp-ribbon" aria-hidden="true">
        <div className="insp-ribbon-skew">
          <div className="insp-ribbon-track">
            {[0, 1].map((k) => (
              <span className="insp-ribbon-row" key={k}>
                <span>Travelling the world since 1758</span>
                <i>◆</i>
                <span>Nineteen pieces, nothing for sale</span>
                <i>◆</i>
                <span>Filed from Kyoto, Tromsø and the Mara</span>
                <i>◆</i>
                <span>The reading that comes before the deciding</span>
                <i>◆</i>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================
          7. THE SIGN-OFF
          ============================================================ */}
      <section className="insp-signoff" aria-labelledby="signoff-title">
        <div className="insp-signoff-bg" aria-hidden="true">
          <img src={img(U('1469854523086-cc02fe5d8800'), 1900)} alt="" />
        </div>
        <div className="insp-signoff-inner">
          <div>
            <p className="insp-label is-light" data-reveal>The dispatch</p>
            <h2 className="insp-signoff-title" id="signoff-title" data-reveal>
              One letter a month. <em>Nothing</em> to buy.
            </h2>
            <p className="insp-signoff-copy" data-reveal>
              What our specialists are watching — a blossom forecast, a shoulder season worth
              taking, a counter worth queueing for. It goes out on the first of the month, and it
              never sells you anything.
            </p>
            <div className="insp-signoff-cta">
              <Link to="/journeys4" className="h26-btn h26-btn-accent">
                Browse the journeys <ArrowRight size={15} />
              </Link>
              <button type="button" className="h26-btn h26-btn-glass" onClick={openScheduleCall}>
                <Phone size={15} /> Talk to a specialist
              </button>
            </div>
          </div>

          <form className="insp-form" onSubmit={onSubscribe} data-reveal>
            <span className="insp-form-label">Subscribe</span>
            {subscribed ? (
              <p className="insp-form-done">
                <Check size={17} /> You&apos;re on the list. The next one goes out on the 1st.
              </p>
            ) : (
              <>
                <div className="insp-form-row">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    aria-label="Email address"
                  />
                  <button type="submit" className="h26-btn h26-btn-accent">
                    Send it <ArrowRight size={15} />
                  </button>
                </div>
                <p className="insp-form-note">
                  One email a month. Unsubscribe in one click. We do not sell your address — to
                  anyone, ever.
                </p>
              </>
            )}
          </form>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
