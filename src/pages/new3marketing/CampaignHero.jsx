/* ============================================================================
   Campaign stage: the /new3-marketing hero.

   Three full-bleed campaign banners (Japan, Europe, Vietnam) that advance on
   their own, sideways. Each one is a doorway to its lander.

   Motion, all GSAP:
   · Slide change: the incoming banner WIPES in from the side it is coming
     from (clip-path), its photo drifting the same way, while the outgoing
     photo slides off the other way. Headline lines rise out of a mask.
   · Each banner's destination word runs as a slow horizontal marquee. On
     Vietnam it slides BETWEEN the sky and the karst cut-out, as on its lander.
   · The tab's progress bar IS the timer: one tween per slide, and its
     onComplete advances. Pausing the carousel pauses that tween, so the bar
     always shows exactly how long is left.
   · On scroll the whole stage settles back into the page: it scales down and
     rounds its corners while the copy lifts away.

   UX rules it keeps (WCAG 2.2.2 + APG carousel):
   · A visible pause button. Autoplay also stops on hover, on keyboard focus
     anywhere in the hero, when the tab is hidden and when the hero is off
     screen. It never restarts on its own after the user pauses it.
   · Reduced motion: no autoplay, no marquee, slides swap without a wipe.
   · Tabs (arrow keys move between them), inactive slides are inert, and a
     polite live region announces the slide only while NOT autoplaying.
   · Swipe on touch, arrows on desktop.
   ========================================================================== */

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, ArrowRight, Pause, Play, Phone } from 'lucide-react';
import { useScheduleCall } from '../../components/ScheduleCall';
import { CAMPAIGNS, inr } from './campaigns';
import SearchDock from './SearchDock';

gsap.registerPlugin(ScrollTrigger);

const DUR = 7; // seconds per banner
const pad = (n) => String(n).padStart(2, '0');

export default function CampaignHero({ heroRef }) {
  const navigate = useNavigate();
  const openCallback = useScheduleCall();

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);   // the user's pause button only
  const [reduced, setReduced] = useState(false);

  const stageRef = useRef(null);
  const slideRefs = useRef([]);
  const barRefs = useRef([]);
  const tabRefs = useRef([]);
  const prevRef = useRef(0);
  const dirRef = useRef(1);
  const tlRef = useRef(null);
  const timerRef = useRef(null);
  /* Every reason autoplay might be held, besides the user's own pause. */
  const holds = useRef({ hover: false, focus: false, hidden: false, offscreen: false });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => { setReduced(mq.matches); if (mq.matches) setPaused(true); };
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const go = useCallback((to, dir) => {
    setActive((cur) => {
      const next = (to + CAMPAIGNS.length) % CAMPAIGNS.length;
      if (next === cur) return cur;
      dirRef.current = dir ?? (next > cur ? 1 : -1);
      return next;
    });
  }, []);
  const next = useCallback(() => go(active + 1, 1), [go, active]);
  const prev = useCallback(() => go(active - 1, -1), [go, active]);

  /* ---------- Holding / releasing the timer ---------- */
  /* Stable, reads refs: ScrollTrigger callbacks hold on to it for the page's
     life, so it must never close over a stale `paused`. */
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  const syncTimer = useCallback(() => {
    const t = timerRef.current;
    if (!t) return;
    const h = holds.current;
    if (pausedRef.current || h.hover || h.focus || h.hidden || h.offscreen) t.pause();
    else t.resume();
  }, []);

  useEffect(() => {
    const onVis = () => { holds.current.hidden = document.hidden; syncTimer(); };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [syncTimer]);
  useEffect(() => { syncTimer(); }, [paused, syncTimer]);

  /* ---------- Slide change ---------- */
  useLayoutEffect(() => {
    const slides = slideRefs.current;
    const from = prevRef.current;
    const to = active;
    const dir = dirRef.current;
    slides.forEach((el, i) => { if (el) el.inert = i !== to; });

    // Finish any wipe still in flight so two never fight over a slide.
    if (tlRef.current) tlRef.current.progress(1).kill();

    const inc = slides[to];
    const q = gsap.utils.selector(inc);

    if (from === to) {
      // First paint: just show the first banner and run its arrival.
      slides.forEach((el, i) => gsap.set(el, { autoAlpha: i === to ? 1 : 0, zIndex: i === to ? 2 : 1, clipPath: 'inset(0% 0% 0% 0%)' }));
      if (!reduced) {
        tlRef.current = gsap.timeline({ delay: 0.15 })
          .fromTo(q('.n3m-slide__media'), { scale: 1.18 }, { scale: 1, duration: 2.2, ease: 'power3.out' }, 0)
          .fromTo(q('.n3m-line > span'), { yPercent: 115 }, { yPercent: 0, duration: 1.1, stagger: 0.09, ease: 'power4.out' }, 0.25)
          .fromTo(q('[data-in]'), { y: 26, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.07, ease: 'power3.out' }, 0.55);
      }
    } else if (reduced) {
      slides.forEach((el, i) => gsap.set(el, { autoAlpha: i === to ? 1 : 0, zIndex: i === to ? 2 : 1 }));
    } else {
      const out = slides[from];
      const oq = gsap.utils.selector(out);
      gsap.set(inc, { autoAlpha: 1, zIndex: 3, clipPath: dir > 0 ? 'inset(0% 0% 0% 100%)' : 'inset(0% 100% 0% 0%)' });
      tlRef.current = gsap.timeline({
        onComplete: () => {
          gsap.set(out, { autoAlpha: 0, zIndex: 1 });
          gsap.set(oq('.n3m-slide__media'), { xPercent: 0 });
          gsap.set(inc, { zIndex: 2 });
        },
      })
        .to(inc, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.25, ease: 'expo.inOut' }, 0)
        .fromTo(q('.n3m-slide__media'), { xPercent: 22 * dir, scale: 1.12 }, { xPercent: 0, scale: 1, duration: 1.6, ease: 'expo.inOut' }, 0)
        .to(oq('.n3m-slide__media'), { xPercent: -14 * dir, duration: 1.25, ease: 'expo.inOut' }, 0)
        .to(oq('.n3m-slide__copy'), { x: -60 * dir, autoAlpha: 0, duration: 0.6, ease: 'power2.in' }, 0)
        .set(oq('.n3m-slide__copy'), { x: 0, autoAlpha: 1 })
        .fromTo(q('.n3m-line > span'), { yPercent: 115, rotate: 3 * dir }, { yPercent: 0, rotate: 0, duration: 1, stagger: 0.08, ease: 'power4.out' }, 0.55)
        .fromTo(q('[data-in]'), { y: 26, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.06, ease: 'power3.out' }, 0.75);
    }
    prevRef.current = to;

    /* The timer: this tab's bar fills; when it is full, advance. */
    barRefs.current.forEach((b, i) => b && gsap.set(b, { scaleX: i < to ? 1 : 0 }));
    timerRef.current?.kill();
    timerRef.current = null;
    if (!reduced) {
      timerRef.current = gsap.fromTo(barRefs.current[to], { scaleX: 0 }, {
        scaleX: 1, duration: DUR, ease: 'none',
        onComplete: () => go(to + 1, 1),
      });
      syncTimer();
    } else {
      gsap.set(barRefs.current[to], { scaleX: 1 });
    }
  }, [active, reduced]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => { tlRef.current?.kill(); timerRef.current?.kill(); }, []);

  /* ---------- Ambient + scroll motion ---------- */
  useLayoutEffect(() => {
    if (reduced) return undefined;
    const ctx = gsap.context(() => {
      // Destination word marquee, every banner, forever (cheap: one transform).
      gsap.utils.toArray('.n3m-word__track').forEach((t, i) => {
        gsap.fromTo(t, { xPercent: 0 }, { xPercent: -50, duration: 38 + i * 4, ease: 'none', repeat: -1 });
      });
      // Slow Ken Burns on the photo itself (the media wrapper does the wipe).
      // Not Vietnam: its sky and karst cut-out must stay the same size to align.
      gsap.utils.toArray('.n3m-slide:not(.n3m-slide--vietnam) .n3m-slide__img').forEach((im) => {
        gsap.fromTo(im, { scale: 1 }, { scale: 1.08, duration: 16, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      });

      const st = { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true };
      gsap.fromTo(stageRef.current,
        { scale: 1, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
        { scale: 0.93, borderBottomLeftRadius: 36, borderBottomRightRadius: 36, ease: 'none', scrollTrigger: st });
      gsap.fromTo('.n3m-copywrap', { y: 0, autoAlpha: 1 }, { y: -110, autoAlpha: 0.15, ease: 'none', scrollTrigger: { ...st, end: '70% top' } });
      gsap.fromTo('.n3m-parallax', { yPercent: 0 }, { yPercent: 14, ease: 'none', scrollTrigger: st });
      // Vietnam karsts rise a touch faster than the sky (only ever UP, see lander).
      gsap.fromTo('.n3m-slide__layer', { yPercent: 0 }, { yPercent: -6, ease: 'none', scrollTrigger: st });

      // Hold autoplay while the hero is off screen.
      ScrollTrigger.create({
        trigger: heroRef.current, start: 'top top', end: 'bottom top',
        onToggle: (self) => { holds.current.offscreen = !self.isActive; syncTimer(); },
      });


    });
    return () => ctx.revert();
  }, [reduced]); // eslint-disable-line react-hooks/exhaustive-deps

  /* The floating "Ask Einaya" button lands exactly on the dock's Search
     button on the first screen. Keep it away until the dock has scrolled
     under the nav (runs under reduced motion too: it's layout, not motion). */
  useEffect(() => {
    const root = document.documentElement;
    const dock = document.querySelector('.n3m-dock');
    if (!dock) return undefined;
    const io = new IntersectionObserver(([e]) => root.classList.toggle('n3m-dockin', e.isIntersecting), { threshold: 0 });
    io.observe(dock);
    return () => { io.disconnect(); root.classList.remove('n3m-dockin'); };
  }, []);

  /* ---------- Swipe ---------- */
  const swipe = useRef(null);
  const onPointerDown = (e) => { swipe.current = { x: e.clientX, y: e.clientY }; };
  const onPointerUp = (e) => {
    const s = swipe.current; swipe.current = null;
    if (!s) return;
    const dx = e.clientX - s.x; const dy = e.clientY - s.y;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.4) (dx < 0 ? next : prev)();
  };

  const onTabKey = (e) => {
    let to = null;
    if (e.key === 'ArrowRight') to = active + 1;
    else if (e.key === 'ArrowLeft') to = active - 1;
    else if (e.key === 'Home') to = 0;
    else if (e.key === 'End') to = CAMPAIGNS.length - 1;
    if (to === null) return;
    e.preventDefault();
    const n = (to + CAMPAIGNS.length) % CAMPAIGNS.length;
    go(n, to > active ? 1 : -1);
    tabRefs.current[n]?.focus();
  };

  const autoplaying = !paused && !reduced;
  const c = CAMPAIGNS[active];

  return (
    <>
      <section
        className="n3m-hero"
        id="top"
        ref={heroRef}
        aria-roledescription="carousel"
        aria-label="This season's offers"
        /* Hover holds autoplay only over the things you read or use (copy,
           tabs, controls, search). The stage fills the viewport, so holding
           on ANY hover would mean it never moved for a mouse user. */
        onPointerOver={(e) => {
          if (e.pointerType !== 'mouse') return;
          const h = !!e.target.closest('.n3m-slide__copy, .n3m-tabs, .n3m-hud, .n3m-dock');
          if (h !== holds.current.hover) { holds.current.hover = h; syncTimer(); }
        }}
        onPointerLeave={() => { holds.current.hover = false; syncTimer(); }}
        onFocus={(e) => { if (e.target.matches(':focus-visible')) { holds.current.focus = true; syncTimer(); } }}
        onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) { holds.current.focus = false; syncTimer(); } }}
      >
        <h1 className="n3m-sr">Cox &amp; Kings: group tours and tailor-made holidays since 1758</h1>

        <div className="n3m-stage" ref={stageRef} onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
          <div className="n3m-slides" aria-live={autoplaying ? 'off' : 'polite'}>
            {CAMPAIGNS.map((s, i) => (
              <article
                key={s.key}
                id={`n3m-slide-${s.key}`}
                ref={(el) => { slideRefs.current[i] = el; }}
                className={`n3m-slide n3m-slide--${s.key}`}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${CAMPAIGNS.length}: ${s.title.join(' ')}`}
              >
                <div className="n3m-parallax" aria-hidden="true">
                  <div className="n3m-slide__media">
                    <img className="n3m-slide__img" src={s.image} alt="" style={{ objectPosition: s.pos }}
                      fetchpriority={i === 0 ? 'high' : 'auto'} loading={i === 0 ? 'eager' : 'lazy'} />
                    {s.layer && <div className="n3m-slide__tint" />}
                    <div className="n3m-word">
                      <div className="n3m-word__track">
                        <span>{s.word}&nbsp;</span><span>{s.word}&nbsp;</span>
                      </div>
                    </div>
                    {s.layer && <img className="n3m-slide__layer" src={s.layer} alt="" />}
                  </div>
                </div>
                <div className="n3m-slide__veil" aria-hidden="true" />

                <div className="n3m-copywrap">
                  <div className="n3m-slide__copy">
                    <p className="n3m-eyebrow" data-in>
                      {s.season}<i aria-hidden="true" />{s.kind}
                    </p>
                    <h2 className="n3m-title">
                      <span className="n3m-line"><span>{s.title[0]}</span></span>
                      <span className="n3m-line"><span><em>{s.title[1]}</em></span></span>
                    </h2>
                    <p className="n3m-sub" data-in>{s.sub}</p>
                    <div className="n3m-offer" data-in>
                      <span className="n3m-offer__tag">{s.tag}</span>
                      <span className="n3m-offer__from">from <b>{inr(s.from)}</b> <small>per person</small></span>
                      <span className="n3m-offer__dep">Pay {inr(s.deposit)} {s.depositWas ? <s>{inr(s.depositWas)}</s> : null} today{s.deadline ? ` · until ${s.deadline}` : ''}</span>
                    </div>
                    <div className="n3m-ctas" data-in>
                      <a href={s.to} className="n3m-btn n3m-btn--acc" onClick={(e) => { e.preventDefault(); navigate(s.to); }}>
                        See the {s.word === 'VIỆT NAM' ? 'Vietnam' : s.word[0] + s.word.slice(1).toLowerCase()} tours <ArrowRight size={17} aria-hidden="true" />
                      </a>
                      <button type="button" className="n3m-btn n3m-btn--ghost" onClick={openCallback}>
                        <Phone size={16} aria-hidden="true" /> Talk to an expert
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* HUD: counter + controls (right), tabs (bottom) */}
          <div className="n3m-hud">
            <div className="n3m-count" aria-hidden="true">
              <span className="n3m-count__now" key={active}>{pad(active + 1)}</span>
              <span className="n3m-count__rule" />
              <span className="n3m-count__all">{pad(CAMPAIGNS.length)}</span>
            </div>
            <div className="n3m-ctrl">
              <button type="button" className="n3m-ctrl__btn" onClick={prev} aria-label="Previous offer"><ArrowLeft size={18} /></button>
              <button type="button" className="n3m-ctrl__btn" onClick={() => setPaused((p) => !p)}
                aria-label={paused ? 'Play the offers slideshow' : 'Pause the offers slideshow'} aria-pressed={paused}>
                {paused ? <Play size={16} /> : <Pause size={16} />}
              </button>
              <button type="button" className="n3m-ctrl__btn" onClick={next} aria-label="Next offer"><ArrowRight size={18} /></button>
            </div>
          </div>

          <div className="n3m-tabs" role="tablist" aria-label="Choose an offer">
            {CAMPAIGNS.map((s, i) => (
              <button
                key={s.key}
                ref={(el) => { tabRefs.current[i] = el; }}
                type="button"
                role="tab"
                id={`n3m-tab-${s.key}`}
                aria-selected={i === active}
                aria-controls={`n3m-slide-${s.key}`}
                tabIndex={i === active ? 0 : -1}
                className={`n3m-tab${i === active ? ' is-on' : ''}`}
                onClick={() => go(i, i > active ? 1 : -1)}
                onKeyDown={onTabKey}
              >
                <span className="n3m-tab__bar" aria-hidden="true"><i ref={(el) => { barRefs.current[i] = el; }} /></span>
                <span className="n3m-tab__thumb" style={{ backgroundImage: `url(${s.thumb})` }} aria-hidden="true" />
                <span className="n3m-tab__txt">
                  <span className="n3m-tab__no">{pad(i + 1)}</span>
                  <b>{s.title[0].replace(',', '')}</b>
                  <small>{s.season} · from {inr(s.from)}</small>
                </span>
              </button>
            ))}
          </div>
        </div>

        <SearchDock />
      </section>

    </>
  );
}
