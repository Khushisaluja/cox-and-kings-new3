/* ============================================================================
   Homepage, marketing variant: /new3-marketing.

   The /new3 homepage with its hero handed to the three live campaigns
   (Japan cherry blossom, Europe early booking, Vietnam), a redesigned search
   dock, and a GSAP ScrollTrigger layer choreographing every section below.

   Like /new3-v2 this does not fork the 100KB homepage. <New3> takes:
     Hero={CampaignHero}   the campaign stage + search dock
     rootClass="n3m"       scopes New3Marketing.css to this page only
     motion="gsap"         switches New3's framer-motion reveals to static
                           markup, so GSAP is the only engine moving them
   / and /new3 pass none of these and render exactly as before.

   GSAP rules this file follows (both bit earlier pages):
   · fromTo, never from: React runs effects twice in dev and from() would read
     the first pass's offset as the resting state.
   · one engine per node, and an entrance tween and a scrub never share a node
     (entrance on the element, scrub on its image or a wrapper).
   · every entrance clears its transform when done, so the existing CSS hover
     lifts (.hi-lane:hover etc.) keep working afterwards.
   ========================================================================== */

import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import New3 from './New3';
import CampaignHero from './new3marketing/CampaignHero';
import './New3Marketing.css';

gsap.registerPlugin(ScrollTrigger, SplitText);

function useSectionMotion() {
  useLayoutEffect(() => {
    const root = document.querySelector('.n3m');
    if (!root) return undefined;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { root.classList.add('n3m--still'); return undefined; }

    const splits = [];
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      const sheet = root.querySelector('.h26-sheet');
      const S = (sel) => gsap.utils.toArray(sheet.querySelectorAll(sel));
      const once = (trigger, start = 'top 82%') => ({ trigger, start, once: true });

      /* Page progress hairline (top of the viewport, campaign-agnostic gold). */
      gsap.fromTo(document.querySelector('.n3m-progress'), { scaleX: 0 }, {
        scaleX: 1, ease: 'none',
        scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: 0.3 },
      });

      /* 1. Display headlines: masked line rise (SplitText). */
      /* The theme title is set with a <br> and a tight line-height; SplitText
         keeps the <br> as an empty line there, so it rises as one block. */
      S('.n3d__title').forEach((h) => {
        gsap.fromTo(h, { clipPath: 'inset(0% 0% 100% 0%)', y: 40 }, {
          clipPath: 'inset(0% 0% -10% 0%)', y: 0, duration: 1.2, ease: 'power4.out', clearProps: 'clipPath,transform',
          scrollTrigger: once(h, 'top 88%'),
        });
      });
      S('.h26-h2, .lx2i-h2').forEach((h) => {
        const sp = SplitText.create(h, { type: 'lines', mask: 'lines', linesClass: 'n3m-sl' });
        splits.push(sp);
        gsap.fromTo(sp.lines, { yPercent: 110, rotate: 2.5 }, {
          yPercent: 0, rotate: 0, duration: 1.1, stagger: 0.1, ease: 'power4.out',
          scrollTrigger: once(h, 'top 88%'),
        });
      });

      /* 2. WordReveal statements (static in gsap mode): words climb out of
            their .wr-wrap masks, staggered, with a slight lean. */
      S('.h26-statement, .h26-contact-title').forEach((h) => {
        gsap.fromTo(h.querySelectorAll('.wr-word'), { yPercent: 105, rotate: 4, transformOrigin: '0% 100%' }, {
          yPercent: 0, rotate: 0, duration: 1, stagger: 0.06, ease: 'power4.out',
          scrollTrigger: once(h, 'top 85%'),
        });
      });

      /* 3. Generic reveals (labels, intro text, links, bullets) in batches. */
      const generic = S('[data-reveal]').filter((el) => !el.matches('.hi-lane, .h26-dest, .h26-reel, .jl-card, .h26-h2'));
      gsap.set(generic, { autoAlpha: 0, y: 34 });
      ScrollTrigger.batch(generic, {
        start: 'top 90%', once: true,
        onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.07, ease: 'power3.out', clearProps: 'transform' }),
      });

      /* 4. Intro scatter: the copy column draws a hairline down as it lands. */
      gsap.fromTo(q('.h26-intro-copy'), { '--n3m-rule': 0 }, {
        '--n3m-rule': 1, ease: 'none',
        scrollTrigger: { trigger: q('.h26-intro')[0], start: 'top 70%', end: 'bottom 60%', scrub: true },
      });

      /* 5. "How would you like to travel?": lanes tip up out of the floor,
            and each lane's photo zooms out with scroll. */
      const lanes = S('.hi-lane');
      if (lanes.length) {
        gsap.fromTo(lanes, { autoAlpha: 0, y: 140, rotateX: -22, transformPerspective: 1400, transformOrigin: '50% 100%' }, {
          autoAlpha: 1, y: 0, rotateX: 0, duration: 1.3, stagger: 0.14, ease: 'expo.out', clearProps: 'transform',
          scrollTrigger: once(lanes[0].parentElement, 'top 80%'),
        });
        lanes.forEach((l) => {
          const im = l.querySelector('.hi-lane-media');
          if (im) gsap.fromTo(im, { scale: 1.18 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: l, start: 'top bottom', end: 'bottom 40%', scrub: true } });
        });
      }

      /* 6. Destinations: each tile opens like a shutter (clip-path) in a
            diagonal stagger. (No photo parallax: the CSS hover zoom owns
            the img transform.) */
      const dests = S('.h26-dest');
      if (dests.length) {
        gsap.fromTo(dests, { clipPath: 'inset(100% 0% 0% 0% round 18px)', autoAlpha: 1 }, {
          clipPath: 'inset(0% 0% 0% 0% round 18px)', duration: 1.25, ease: 'expo.inOut',
          stagger: { each: 0.09, grid: 'auto', from: 'start' },
          scrollTrigger: once(dests[0].parentElement, 'top 78%'),
          onComplete: () => gsap.set(dests, { clearProps: 'clipPath' }),
        });
      }

      /* 7. Heritage: the main photo unmasks bottom-up on scrub, the glass
            card slides in, the inset photo floats. */
      const her = q('#heritage')[0];
      if (her) {
        gsap.fromTo(her.querySelector('.lx2i-heritage__photo--main'), { clipPath: 'inset(30% 12% 0% 12% round 28px)' }, {
          clipPath: 'inset(0% 0% 0% 0% round 28px)', ease: 'none',
          scrollTrigger: { trigger: her, start: 'top 85%', end: 'top 25%', scrub: 0.6 },
        });
        gsap.fromTo(her.querySelector('.lx2i-heritage__card'), { x: 90, autoAlpha: 0 }, {
          x: 0, autoAlpha: 1, duration: 1.2, ease: 'expo.out', clearProps: 'transform', scrollTrigger: once(her, 'top 55%'),
        });
        gsap.fromTo(her.querySelectorAll('.lx2i-trust__item'), { x: -30, autoAlpha: 0 }, {
          x: 0, autoAlpha: 1, duration: 0.8, stagger: 0.08, ease: 'power3.out', scrollTrigger: once(her.querySelector('.lx2i-trust'), 'top 85%'),
        });
        gsap.fromTo(her.querySelectorAll('.lx2i-statband > *'), { y: 30, autoAlpha: 0 }, {
          y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.08, ease: 'power3.out', scrollTrigger: once(her.querySelector('.lx2i-statband'), 'top 90%'),
        });
      }

      /* 8. Press logos: a soft cascade. */
      gsap.fromTo(S('.lx2i-press__logo'), { autoAlpha: 0, y: 16 }, {
        autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.05, ease: 'power2.out', scrollTrigger: once(q('#press')[0], 'top 90%'),
      });

      /* 9. Relaxed shelf cards: deal in from the right. */
      S('.jl-shelf').forEach((shelf) => {
        gsap.fromTo(shelf.querySelectorAll('.jl-card'), { autoAlpha: 0, x: 120, rotate: 2 }, {
          autoAlpha: 1, x: 0, rotate: 0, duration: 1.1, stagger: 0.1, ease: 'expo.out', clearProps: 'transform',
          scrollTrigger: once(shelf, 'top 78%'),
        });
      });

      /* 10. Theme arch: grows up out of the page as it scrolls in. */
      const arch = q('.n3d__arch')[0];
      if (arch) {
        gsap.fromTo(arch, { clipPath: 'inset(22% 16% 0% 16% round 999px 999px 0px 0px)' }, {
          clipPath: 'inset(0% 0% 0% 0% round 999px 999px 0px 0px)', ease: 'none',
          scrollTrigger: { trigger: arch, start: 'top 95%', end: 'top 35%', scrub: 0.6 },
        });
        gsap.fromTo(q('.n3d__thumb'), { autoAlpha: 0, y: 30 }, {
          autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.06, ease: 'power3.out', clearProps: 'transform', scrollTrigger: once(q('.n3d__rail')[0], 'top 92%'),
        });
      }

      /* 11. Clips: the reel cards fan in from the right like a dealt hand. */
      const reels = S('.h26-reel');
      if (reels.length) {
        gsap.fromTo(reels, { autoAlpha: 0, x: 180, rotate: 6, transformOrigin: '50% 120%' }, {
          autoAlpha: 1, x: 0, rotate: 0, duration: 1.2, stagger: 0.07, ease: 'expo.out', clearProps: 'transform',
          scrollTrigger: once(reels[0].parentElement, 'top 80%'),
        });
      }

      /* 12. Reviews: the wall rises in columns; the rating card pops. */
      const wall = q('.lx2i-wall')[0];
      if (wall) {
        gsap.fromTo(wall.children, { autoAlpha: 0, y: 90 }, {
          autoAlpha: 1, y: 0, duration: 1, stagger: { each: 0.08, from: 'start' }, ease: 'expo.out', clearProps: 'transform',
          scrollTrigger: once(wall, 'top 82%'),
        });
        gsap.fromTo(q('.lx2i-reviews__agg'), { scale: 0.86, autoAlpha: 0 }, {
          scale: 1, autoAlpha: 1, duration: 1, ease: 'back.out(1.6)', clearProps: 'transform', scrollTrigger: once(q('#reviews')[0], 'top 70%'),
        });
      }

      /* 13. Contact: the photo pulls back as you arrive. */
      const contact = q('#contact')[0];
      if (contact) {
        gsap.fromTo(contact.querySelector('.h26-contact-bg'), { scale: 1.3, yPercent: -8 }, {
          scale: 1, yPercent: 0, ease: 'none', scrollTrigger: { trigger: contact, start: 'top bottom', end: 'bottom bottom', scrub: true },
        });
      }

    }, root);

    /* Fonts and lazy images change heights after first layout. */
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener('load', refresh);
    const t = setTimeout(refresh, 1200);

    return () => {
      clearTimeout(t);
      window.removeEventListener('load', refresh);
      splits.forEach((sp) => sp.revert());
      ctx.revert();
    };
  }, []);
}

export default function New3Marketing() {
  useSectionMotion();
  return (
    <>
      <div className="n3m-progress" aria-hidden="true" />
      <New3 Hero={CampaignHero} rootClass="n3m" motion="gsap" />
    </>
  );
}
