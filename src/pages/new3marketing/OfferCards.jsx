/* ============================================================================
   Offer cards: /new3-marketing-v3's third section.

   The three campaigns (Japan, Europe, Vietnam) as wide landscape cards in a
   horizontal row that advances on its own. It is a native scroll-snap row,
   so swipe, trackpad and the scrollbar all just work; autoplay only calls
   scrollTo on it. No GSAP here, nothing to fight with the page's own layer.

   Autoplay holds (WCAG 2.2.2): the pause button, mouse over the row, keyboard
   focus inside it, the row being off screen, the tab hidden, for a while
   after the user scrolls it themselves, and always under reduced motion.
   ========================================================================== */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react';
import { inr } from './campaigns';

const STEP_MS = 4500;     // time on each card
const IDLE_MS = 7000;     // quiet time after a manual scroll before autoplay resumes

/* A card's x inside the row's scrolled content (offsetLeft would be measured
   from the nearest positioned ancestor, not the row). */
const cardLeft = (t, c) => c.getBoundingClientRect().left - t.getBoundingClientRect().left + t.scrollLeft;

export default function OfferCards({ campaigns, copy = {}, label = 'This season', title = 'Trending packages' }) {
  const navigate = useNavigate();
  const trackRef = useRef(null);
  const cardRefs = useRef([]);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const holds = useRef({ hover: false, focus: false, offscreen: true, hidden: false, until: 0 });
  const autoScrolling = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  /* Which card is "current": the one nearest the row's start edge (the last
     one once the row can scroll no further). */
  const readActive = useCallback(() => {
    const t = trackRef.current;
    if (!t) return 0;
    if (t.scrollLeft >= t.scrollWidth - t.clientWidth - 4) return campaigns.length - 1;
    const pad = parseFloat(getComputedStyle(t).scrollPaddingLeft) || 0;
    let best = 0; let dist = Infinity;
    cardRefs.current.forEach((c, i) => {
      if (!c) return;
      const d = Math.abs(cardLeft(t, c) - pad - t.scrollLeft);
      if (d < dist) { dist = d; best = i; }
    });
    return best;
  }, [campaigns.length]);

  /* Moves are our own rAF tween with snapping switched off for its length:
     smooth scrollTo on a scroll-snap row stutters or jumps in Safari and can
     fight a swipe in Chrome. Any touch, wheel or press stops it at once. */
  const animRef = useRef(0);
  const stopTween = useCallback(() => {
    const t = trackRef.current;
    cancelAnimationFrame(animRef.current);
    animRef.current = 0;
    autoScrolling.current = false;
    if (t) t.style.scrollSnapType = '';
  }, []);

  const goTo = useCallback((i, smooth = true) => {
    const t = trackRef.current; const c = cardRefs.current[i];
    if (!t || !c) return;
    const pad = parseFloat(getComputedStyle(t).scrollPaddingLeft) || 0;
    const target = Math.max(0, Math.min(cardLeft(t, c) - pad, t.scrollWidth - t.clientWidth));
    stopTween();
    setActive(i);
    if (!smooth || reduced) { t.scrollLeft = target; return; }
    const from = t.scrollLeft; const dist = target - from;
    if (Math.abs(dist) < 1) return;
    const dur = Math.min(1100, 600 + Math.abs(dist) * 0.35);
    const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
    autoScrolling.current = true;
    t.style.scrollSnapType = 'none';
    const start = performance.now();
    const tick = (now) => {
      const k = Math.min(1, (now - start) / dur);
      t.scrollLeft = from + dist * ease(k);
      if (k < 1) animRef.current = requestAnimationFrame(tick);
      else { t.scrollLeft = target; stopTween(); }
    };
    animRef.current = requestAnimationFrame(tick);
  }, [reduced, stopTween]);

  useEffect(() => {
    const t = trackRef.current;
    if (!t) return undefined;
    const interrupt = () => { if (animRef.current) { stopTween(); holds.current.until = Date.now() + IDLE_MS; } };
    t.addEventListener('pointerdown', interrupt);
    t.addEventListener('wheel', interrupt, { passive: true });
    t.addEventListener('touchstart', interrupt, { passive: true });
    return () => {
      t.removeEventListener('pointerdown', interrupt);
      t.removeEventListener('wheel', interrupt);
      t.removeEventListener('touchstart', interrupt);
      cancelAnimationFrame(animRef.current);
    };
  }, [stopTween]);

  /* Track the current card as the row scrolls; a scroll the user made
     themselves (not one of ours) holds autoplay for a while. */
  useEffect(() => {
    const t = trackRef.current;
    if (!t) return undefined;
    let raf = 0;
    const onScroll = () => {
      if (!autoScrolling.current) holds.current.until = Date.now() + IDLE_MS;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setActive(readActive()));
    };
    t.addEventListener('scroll', onScroll, { passive: true });
    return () => { t.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, [readActive]);

  useEffect(() => {
    const t = trackRef.current;
    const io = new IntersectionObserver(([e]) => { holds.current.offscreen = !e.isIntersecting; }, { threshold: 0.35 });
    if (t) io.observe(t);
    const onVis = () => { holds.current.hidden = document.hidden; };
    document.addEventListener('visibilitychange', onVis);
    return () => { io.disconnect(); document.removeEventListener('visibilitychange', onVis); };
  }, []);

  const playing = !paused && !reduced;
  useEffect(() => {
    if (!playing) return undefined;
    const id = window.setInterval(() => {
      const h = holds.current;
      if (h.hover || h.focus || h.offscreen || h.hidden || Date.now() < h.until) return;
      goTo((readActive() + 1) % campaigns.length);
    }, STEP_MS);
    return () => window.clearInterval(id);
  }, [playing, goTo, readActive, campaigns.length]);

  const step = (d) => goTo((active + d + campaigns.length) % campaigns.length);

  return (
    <section className="n3m-offers" id="offers" aria-roledescription="carousel" aria-labelledby="n3m-offers-title">
      <div className="n3m-offers__head">
        <div>
          <p className="h26-label">{label}</p>
          <h2 className="n3m-offers__title" id="n3m-offers-title">{title}</h2>
        </div>
        <div className="n3m-offers__ctrl">
          <button type="button" onClick={() => step(-1)} aria-label="Previous offer"><ArrowLeft size={18} /></button>
          <button type="button" onClick={() => setPaused((p) => !p)} aria-pressed={paused}
            aria-label={paused ? 'Play the offers' : 'Pause the offers'} hidden={reduced}>
            {paused ? <Play size={16} /> : <Pause size={16} />}
          </button>
          <button type="button" onClick={() => step(1)} aria-label="Next offer"><ArrowRight size={18} /></button>
        </div>
      </div>

      <div
        className="n3m-offers__track"
        ref={trackRef}
        onPointerEnter={(e) => { if (e.pointerType === 'mouse') holds.current.hover = true; }}
        onPointerLeave={() => { holds.current.hover = false; }}
        onFocus={() => { holds.current.focus = true; }}
        onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) holds.current.focus = false; }}
      >
        {campaigns.map((s, i) => (
          <article
            key={s.key}
            ref={(el) => { cardRefs.current[i] = el; }}
            className={`n3m-ocard n3m-ocard--${s.key}${i === active ? ' is-on' : ''}`}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${campaigns.length}: ${s.title.join(' ')}`}
          >
            <div className="n3m-ocard__media" aria-hidden="true">
              <img src={s.image} alt="" style={{ objectPosition: s.pos }} loading="lazy" />
              {s.layer && <img className="n3m-ocard__layer" src={s.layer} alt="" loading="lazy" />}
            </div>
            <div className="n3m-ocard__veil" aria-hidden="true" />
            <div className="n3m-ocard__body">
              <p className="n3m-ocard__eyebrow">{s.season}<i aria-hidden="true" />{s.kind}</p>
              <h3 className="n3m-ocard__title">{s.title[0]} <em>{s.title[1]}</em></h3>
              <p className="n3m-ocard__sub">{s.sub}</p>
              <div className="n3m-ocard__foot">
                <div className="n3m-ocard__price">
                  <span className="n3m-ocard__tag">{s.tag}</span>
                  <span>from <b>{inr(s.from)}</b> <small>per person</small></span>
                </div>
                <a href={s.to} className="n3m-ocard__cta" onClick={(e) => { e.preventDefault(); navigate(s.to); }}>
                  {copy.cta ? copy.cta(s) : 'See the journey'} <ArrowRight size={16} aria-hidden="true" />
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="n3m-offers__dots" role="tablist" aria-label="Choose an offer">
        {campaigns.map((s, i) => (
          <button key={s.key} type="button" role="tab" aria-selected={i === active}
            aria-label={s.title[0].replace(',', '')} className={i === active ? 'is-on' : ''}
            onClick={() => goTo(i)}>
            <i />
          </button>
        ))}
      </div>
    </section>
  );
}
