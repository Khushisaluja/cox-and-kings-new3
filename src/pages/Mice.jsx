/* ============================================================================
   Cox & Kings — MICE  (route: /mice)

   Meetings, Incentives, Conferences & Events. The B2B page: a company sends a
   whole group somewhere, rather than one person booking a holiday.

   Built to the two design documents in the project root:
     · Cox-and-Kings_MICE_Brief-Review-and-UX-UI-Spec.pdf        (the full review)
     · Cox-and-Kings_MICE_Design-Decisions-and-User-Flows.pdf    (the decisions)
   Copy is the PM's brief, unchanged.

   ---------------------------------------------------------------------------
   THREE FLOWS, ONE PAGE. Three different people read a MICE page and want
   different things:

     A · the sourcer   HR/admin with a date and a headcount. Wants feasibility.
                       Served by the hero trust rail, the banded form fields
                       and the FAQ, and can reach the form from anywhere.
     B · the approver  A director, usually sent the link. Wants to feel the
                       company is safe. Served by the heritage section and the
                       experiences. May never touch the form.
     C · the comparer  Procurement, three tabs open. Wants facts, leaves in
                       thirty seconds without them. Served by the trust rail,
                       the stat band and the FAQ.

   So several sections are deliberately skippable, and the form is reachable
   from six places rather than one.

   ---------------------------------------------------------------------------
   HOUSE STYLE. This page reuses the homepage's own components wherever the two
   do the same job, rather than restating them in a private stylesheet:

     · `hi-fork-grid--four` + `hi-lane`  the four solution cards, so they read
       exactly like "How would you like to travel?" on /new3.
     · `h26-pills` / `h26-pill`          the hero trust rail.
     · `h26-reviews` + `hi-rtrust` + `h26-marquee` + `h26-rev`   testimonials,
       the same marquee as /journeys/japan-2.
     · `h26-thumbbar`                    the mobile bottom bar, identical to
       the one on /new3.
     · `h26-btn h26-btn-pill`            primary CTAs.

   All of those live in Home2026.css / Home2026Improved.css / New3.css, which
   SiteChrome already loads, so there is nothing extra to import and nothing to
   keep in sync by hand. What is left in Mice.css is only what this page needs.

   COLOUR & TYPE — design.md. Voyager Blue is the PRIMARY action, Sienna Flame
   the ACCENT (numerals, eyebrows and figures, never a button). Dark ground is
   Neutrals-Dark/900 #021330. Cormorant Garamond Light for display, Work Sans
   for everything else. Cloudstone #F7F5FD is deliberately unused: it is the
   only cool tint in a warm paper system and reads as a dirty lilac beside
   Neutrals/50.

   NO PHONE NUMBERS. Every "talk to us" route on this page opens the callback
   dialog instead of dialling. A tel: link fires an unexpected call, is dead on
   desktop, and tells us nothing about who is calling or what they need — the
   same reasoning /new3 already applies to its own thumb-bar.

   ---------------------------------------------------------------------------
   MOTION — GSAP + ScrollTrigger, all inside gsap.matchMedia() gated on
   (prefers-reduced-motion: no-preference), and all fromTo() rather than from():
   StrictMode double-mounts this component, and fromTo is explicit about both
   ends so it cannot accumulate.

   NOTHING IS HIDDEN IN CSS. Every resting state is the visible one and GSAP
   owns the from-state, so a reduced-motion visitor — or one whose GSAP failed
   to load — gets the whole page, static and complete.

   No pinning and no scroll-jacking anywhere. The experiences gallery and the
   mobile destinations rail are native CSS scroll-snap, driven by the reader.
   ========================================================================== */

import { useState, useRef, useLayoutEffect, useCallback, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSearchParams } from 'react-router-dom';
import {
  ArrowRight, ArrowUpRight, Check, ChevronLeft, ChevronRight, ChevronDown,
  Star, MessageCircle, ShieldCheck, Globe2, Users, CalendarCheck,
  FileText, Compass,
} from 'lucide-react';
import { SiteNav, SiteFooter } from '../components/SiteChrome';
import { useScheduleCall } from '../components/ScheduleCall';
import './Mice.css';

gsap.registerPlugin(ScrollTrigger);

const img = (id, w = 1400) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

/* The hero can carry a video once one exists. Until then the poster IS the
   hero: it is the LCP element either way, and the video only ever swaps in on
   desktop after load. */
const HERO_VIDEO = null;

/* ---------------------------------------------------------------------------
   ⚠ PLACEHOLDER FIGURES — DO NOT SHIP AS-IS.

   The hero trust rail and the heritage stat band are the credibility argument,
   and they are open question 1 in the decisions document. Every figure marked
   below needs a real, defensible number from the MICE team.

   "260+ years" and the 4.9 review score are taken from the live site, so those
   two are safe.
   --------------------------------------------------------------------------- */
const HERO_TRUST = [
  { v: '260+ yrs', l: 'of knowing the world' },
  { v: '4.9★', l: '2,400+ verified reviews' },
  { v: '100+', l: 'destinations' },         // ⚠ confirm for MICE specifically
  { v: '24 hr', l: 'specialist reply' },    // ⚠ confirm with the MICE desk
];

/* The heritage stat band. `n: null` collapses the figure and keeps the label,
   so the section survives only some of these being answered. */
const HERITAGE_STATS = [
  { n: 260, suffix: '+', label: 'Years of journeys' },
  { n: 100, suffix: '+', label: 'Destinations' },
  { n: null, suffix: '+', label: 'Groups moved a year' },   // ⚠ needed
];

const HERITAGE_BADGES = [
  { icon: Users, stat: 'Dedicated MICE desk', label: 'Specialists, not a general line' },
  { icon: Globe2, stat: 'On-ground teams', label: 'Our own people at destination' },
  { icon: ShieldCheck, stat: 'End-to-end cover', label: 'Flights, stays, events, visas' },
  { icon: CalendarCheck, stat: 'One point of contact', label: 'Brief to boarding pass' },
];

const SOLUTIONS = [
  {
    id: 'incentive',
    tag: 'Reward & recognise',
    title: 'Incentive Travel',
    line: 'Reward. Recognise. Inspire.',
    body: 'Give your top performers more than a reward. International incentive journeys, sales achiever trips and dealer incentives designed to recognise performance.',
    cta: 'Explore incentives',
    image: '1546708973-b339540b5162',
    alt: 'A reward journey at a resort by the sea',
  },
  {
    id: 'retreat',
    tag: 'Think differently',
    title: 'Corporate Retreats',
    line: 'Step Away. Think Differently.',
    body: 'Take your team somewhere that changes the way they think. Leadership retreats, strategy offsites and executive getaways built around your objectives.',
    cta: 'Explore retreats',
    image: '1501785888041-af3ef285b470',
    alt: 'A mountain lake retreat setting',
  },
  {
    id: 'conference',
    tag: 'Everyone together',
    title: 'Conferences & Meetings',
    line: 'Bring Everyone Together.',
    body: 'From the first arrival to the final farewell, every detail planned. Conferences, annual meets, dealer meets, board meetings and corporate gatherings.',
    cta: 'Explore conferences',
    image: '1583422409516-2895a77efded',
    alt: 'A host city for a corporate conference',
  },
  {
    id: 'event',
    tag: 'Occasions',
    title: 'Corporate Events',
    line: 'Worth Remembering.',
    body: 'From intimate celebrations to spectacular corporate events. Gala dinners, award ceremonies, product launches and experiential events.',
    cta: 'Explore events',
    image: '1524413840807-0c3cb6fa808d',
    alt: 'An evening celebration lit along a canal',
  },
];

/* Five groups, not the brief's four. Two of the signature experiences below sit
   in Tuscany and on the Mediterranean and had no home in the original four, so
   "For the Celebratory" was added to hold them — and it gives the Corporate
   Events card a destination story it did not have either.

   `note` is the logistics micro-line: a buyer's first thought about Iceland is
   whether it is even feasible, and three words answer it at the moment the
   question forms. ⚠ Indicative — confirm with the MICE desk. */
const DEST_GROUPS = [
  { id: 'extraordinary', title: 'For the Extraordinary', places: ['Iceland', 'Norway', 'Switzerland'],
    line: 'For journeys that deserve a little more wonder.',
    note: 'Long-haul via Europe · Schengen or e-visa', image: '1476610182048-b716b8518aae' },
  { id: 'energetic', title: 'For the Energetic', places: ['Dubai', 'Singapore', 'Bangkok'],
    line: 'For teams that like their journeys fast-paced and unforgettable.',
    note: 'Under 6 hours from most metros · visa on arrival', image: '1512453979798-5ea266f8880c' },
  { id: 'experiential', title: 'For the Experiential', places: ['Japan', 'Australia', 'New Zealand'],
    line: 'For discovering something new together.',
    note: 'Long-haul · visa required, plan 6–8 weeks ahead', image: '1545569341-9eb8b30979d9' },
  { id: 'unwinding', title: 'For the Unwinding', places: ['Bali', 'Maldives', 'Mauritius'],
    line: 'For slowing down, reconnecting and celebrating.',
    note: 'Short to mid-haul · visa on arrival', image: '1514282401047-d79a71a590e8' },
  { id: 'celebratory', title: 'For the Celebratory', places: ['Italy', 'Spain', 'Greece'],
    line: 'For the evenings that end up being the whole point.',
    note: 'Long-haul via Europe · Schengen visa', image: '1534445867742-43195f401b6c' },
];

const EXPERIENCES = [
  { n: '01', title: 'A Dinner Under the Northern Lights', line: 'An extraordinary evening beneath one of nature’s greatest spectacles.', image: '1483347756197-71ef80e95f73' },
  { n: '02', title: 'A Private Evening on the Dubai Marina', line: 'Raise a glass with your team as the city lights up around you.', image: '1512453979798-5ea266f8880c' },
  { n: '03', title: 'A Private Japanese Cultural Experience', line: 'Step beyond the itinerary and experience Japan through its traditions and people.', image: '1478436127897-769e1b3f0f36' },
  { n: '04', title: 'A Vineyard Experience in Tuscany', line: 'Slow down, raise a glass and celebrate together in the heart of Italy.', image: '1543429776-2782fc8e1acd' },
  { n: '05', title: 'A Sunset Gala by the Mediterranean', line: 'Turn an evening together into a memory everyone takes home.', image: '1516483638261-f4dbaf036963' },
];

const STEPS = [
  { n: '01', title: 'Tell us your objective', body: 'Tell us what you’re planning, who is travelling and what you want the journey to achieve.' },
  { n: '02', title: 'We build the concept', body: 'We bring together destination, experiences, itinerary and budget to create the right concept.' },
  { n: '03', title: 'We curate the journey', body: 'Hotels, flights, transport, activities, dining and events, thoughtfully brought together.' },
  { n: '04', title: 'We execute everything', body: 'Our team manages the details before departure and coordinates the journey on ground.' },
  { n: '05', title: 'Your people make memories', body: 'You focus on your people. We focus on everything else.' },
];

/* ⚠ PLACEHOLDER TESTIMONIALS — the brief says real ones follow. The first is
   the placeholder quote from the brief itself; the other two are written to the
   same shape so the marquee can be judged at a realistic length.

   Attribution is Role · Industry · Group size on purpose: that is the part that
   makes a reader recognise themselves. "Corporate Client" persuades nobody, so
   when the real ones are collected, please push for at least the industry and
   the approximate headcount even where the company name cannot be used. */
const REVIEWS = [
  { name: 'Head of HR', location: 'Manufacturing · 180 travellers', tour: 'Annual sales achiever trip',
    rating: 5, text: 'The Cox & Kings team managed every detail seamlessly, allowing us to focus entirely on our people. The experience was exceptional from start to finish.',
    avatar: '1573497019940-1c28c88b4f3e', tripPhoto: '1512453979798-5ea266f8880c' },
  { name: 'Director, Sales', location: 'Pharmaceuticals · 240 travellers', tour: 'Dealer incentive, Europe',
    rating: 5, text: 'Two hundred and forty people, four cities, and not one thing landed back on my desk. The on-ground team knew every name by the second day.',
    avatar: '1519085360753-af0119f7cbe7', tripPhoto: '1534445867742-43195f401b6c' },
  { name: 'Head of People', location: 'Technology · 60 travellers', tour: 'Leadership retreat',
    rating: 5, text: 'We asked for somewhere that would change how the team talked to each other. They understood the objective before they suggested a destination.',
    avatar: '1566492031773-4f4e44671857', tripPhoto: '1501785888041-af3ef285b470' },
];

/* ⚠ PLACEHOLDER ANSWERS. These eight are the questions that sit between a
   convinced reader and the form. Until the MICE team supplies an answer the
   panel says so, rather than inventing a fact the page cannot stand behind. */
const FAQS = [
  { q: 'What is the smallest and largest group you handle?', a: null },
  { q: 'How much lead time do you need before departure?', a: null },
  { q: 'Do you handle domestic MICE as well as international?', a: null },
  { q: 'Do you manage visas, insurance and documentation for the whole group?', a: null },
  { q: 'Will we have a single point of contact?', a: null },
  { q: 'Does someone from Cox & Kings travel with the group?', a: null },
  { q: 'How does payment and GST invoicing work for a corporate account?', a: null },
  { q: 'What happens if our numbers change close to departure?', a: null },
];

/* The "what happens next" rail beside the form. Three cards, because the
   reader's state at this point is mild anxiety about what they are setting off,
   and three discrete objects answer that faster than a paragraph does. */
const NEXT_STEPS = [
  { n: '01', icon: FileText, title: 'A specialist reads your brief',
    body: 'Someone from the MICE desk, not a general enquiries queue.' },
  { n: '02', icon: MessageCircle, title: 'We come back within one working day',
    body: 'To understand the objective before we suggest anything.' },
  { n: '03', icon: Compass, title: 'You get a concept and a budget',
    body: 'A destination, an outline itinerary and an indicative cost.' },
];

/* Bands rather than free text throughout: quicker to answer, they produce data
   you can route on, and the options themselves say something — a visible "250+"
   tells a buyer that 250 is normal here, which the page claims nowhere else. */
const ENQUIRY_TYPES = [
  { id: 'incentive', label: 'Incentive Travel' },
  { id: 'retreat', label: 'Corporate Retreat' },
  { id: 'conference', label: 'Conference' },
  { id: 'meeting', label: 'Meeting' },
  { id: 'event', label: 'Corporate Event' },
  { id: 'other', label: 'Other' },
];
const PAX_BANDS = ['Up to 25', '26–50', '51–100', '101–250', '250+', 'Not sure yet'];
const BUDGET_BANDS = ['Under ₹25k / person', '₹25k–50k', '₹50k–1L', '₹1L+', 'Prefer to discuss'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
const YEARS = ['2026', '2027', '2028'];

/* ========================================================================== */

export default function Mice() {
  const root = useRef(null);
  const [params] = useSearchParams();
  const openCallback = useScheduleCall();

  const [barVisible, setBarVisible] = useState(false);
  const [openDest, setOpenDest] = useState(DEST_GROUPS[0].id);
  const [openFaqs, setOpenFaqs] = useState([]);
  const [expIndex, setExpIndex] = useState(0);
  const [destIndex, setDestIndex] = useState(0);
  const expTrack = useRef(null);
  const destRail = useRef(null);

  /* ---- form ------------------------------------------------------------- */
  const [step, setStep] = useState(1);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    type: '', pax: '', destination: '', destUnsure: false,
    name: '', company: '', email: '', phone: '',
    month: '', year: '', flexible: false, budget: '', notes: '', consent: false,
  });
  const set = (k) => (e) => {
    const v = e && e.target
      ? (e.target.type === 'checkbox' ? e.target.checked : e.target.value)
      : e;
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((x) => (x[k] ? { ...x, [k]: undefined } : x));
  };

  /* Deep-link. The four solution cards have no child pages to point at, so they
     route here with their type already chosen — four dead CTAs become four
     working paths at no content cost, and it reverses the day those pages ship. */
  useEffect(() => {
    const t = params.get('type');
    if (t && ENQUIRY_TYPES.some((x) => x.id === t)) setForm((f) => ({ ...f, type: t }));
  }, [params]);

  const goToForm = useCallback((type) => {
    if (type) setForm((f) => ({ ...f, type }));
    setStep(1);
    const el = document.getElementById('mice-enquiry');
    if (!el) return;
    /* 120px of offset so the section heading stays visible — landing with the
       first field flush to the top of the viewport loses the context. */
    const y = el.getBoundingClientRect().top + window.scrollY - 120;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: y, behavior: reduce ? 'instant' : 'smooth' });
  }, []);

  /* These return the errors object rather than a boolean, because the caller
     needs it SYNCHRONOUSLY. Reading `errors` straight after setErrors() gets
     the previous render's value, so focus would be moved using the last
     submit's errors — empty on a first submit, and focus goes nowhere. */
  const validateStep1 = () => {
    const e = {};
    if (!form.type) e.type = 'Please choose what you’re planning.';
    if (!form.pax) e.pax = 'Please choose an approximate group size.';
    if (!form.destination && !form.destUnsure) e.destination = 'Tell us where, or tick “not sure yet”.';
    setErrors(e);
    return e;
  };
  const validateStep2 = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Please tell us your name.';
    if (!form.company.trim()) e.company = 'Please tell us your company.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Please check your work email address.';
    if (form.phone.replace(/\D/g, '').length < 8) e.phone = 'Please check your phone number.';
    if (!form.consent) e.consent = 'We need your agreement before we can get in touch.';
    setErrors(e);
    return e;
  };

  /* The submit button is never disabled — a greyed-out button tells a person
     they have failed without telling them how. An invalid submit moves focus to
     the first field in error instead. */
  const focusFirstError = (errs) => {
    const first = Object.keys(errs)[0];
    if (!first) return;
    const el = root.current?.querySelector(`[name="${first}"], #mice-${first}`);
    if (el && el.focus) el.focus();
  };
  const onContinue = (ev) => {
    ev.preventDefault();
    const errs = validateStep1();
    if (Object.keys(errs).length === 0) setStep(2);
    else focusFirstError(errs);
  };
  const onSubmit = (ev) => {
    ev.preventDefault();
    const errs = validateStep2();
    if (Object.keys(errs).length > 0) { focusFirstError(errs); return; }
    /* TODO — no endpoint yet. Where this posts, and the response time we can
       actually commit to, are open question 2 in the decisions document. The
       confirmation promises one working day; it must not ship until the MICE
       desk has agreed to that. */
    setSent(true);
    requestAnimationFrame(() => {
      root.current?.querySelector('#mice-sent-heading')?.focus();
      ScrollTrigger.refresh();
    });
  };

  /* ---- horizontal rails -------------------------------------------------- */
  const railStep = (ref, dir) => {
    const track = ref.current;
    if (!track) return;
    const panel = track.firstElementChild;
    if (!panel) return;
    const gap = parseFloat(getComputedStyle(track).columnGap || '24') || 24;
    track.scrollBy({
      left: dir * (panel.offsetWidth + gap),
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    });
  };
  const railIndex = (ref, setter) => () => {
    const track = ref.current;
    if (!track) return;
    const panel = track.firstElementChild;
    if (!panel) return;
    const gap = parseFloat(getComputedStyle(track).columnGap || '24') || 24;
    setter(Math.round(track.scrollLeft / (panel.offsetWidth + gap)));
  };

  /* ---- motion ------------------------------------------------------------ */
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      /* The bars are the only triggers outside the reduced-motion gate: they
         are a navigation aid, not decoration, and a reader who asked for less
         motion still needs a way to reach the form. */
      ScrollTrigger.create({
        trigger: '.mice-hero',
        start: 'bottom top+=80',
        onEnter: () => setBarVisible(true),
        onLeaveBack: () => setBarVisible(false),
      });
      ScrollTrigger.create({
        trigger: '#mice-enquiry',
        start: 'top center',
        onEnter: () => setBarVisible(false),
        onLeaveBack: () => setBarVisible(true),
      });

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const rise = (targets, opts = {}) => gsap.fromTo(
          targets,
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.08, ...opts },
        );

        gsap.fromTo('.mice-hero__reveal',
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.11, delay: 0.15 });

        /* The trust rail comes in from the right, the way the homepage's does,
           so the two heroes feel like the same page furniture. */
        gsap.fromTo('.mice-hero .h26-pill',
          { opacity: 0, x: 30, filter: 'blur(8px)' },
          { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out',
            stagger: 0.12, delay: 0.75 });

        /* Counters. The resting DOM already holds the final text, so a visitor
           without JavaScript sees the number rather than a zero. */
        gsap.utils.toArray('[data-count]').forEach((el) => {
          const end = Number(el.dataset.count);
          if (!Number.isFinite(end)) return;
          const o = { v: 0 };
          gsap.to(o, {
            v: end, duration: 1.6, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
            onUpdate: () => { el.textContent = Math.round(o.v).toLocaleString('en-IN'); },
          });
        });

        gsap.utils.toArray('.mice-rise').forEach((el) => {
          rise(el, { scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
        });
        gsap.utils.toArray('.mice-rise-group').forEach((group) => {
          rise(group.children, { scrollTrigger: { trigger: group, start: 'top 85%', once: true } });
        });

        const introImg = document.querySelector('.mice-intro__img img');
        if (introImg) {
          gsap.fromTo(introImg, { yPercent: -6 }, {
            yPercent: 6, ease: 'none',
            scrollTrigger: { trigger: '.mice-intro', start: 'top bottom', end: 'bottom top',
              scrub: true, invalidateOnRefresh: true },
          });
        }

        /* The heritage portrait travels a little slower than its column. */
        const herImg = document.querySelector('.mice-her__main img');
        if (herImg) {
          gsap.fromTo(herImg, { yPercent: -5 }, {
            yPercent: 5, ease: 'none',
            scrollTrigger: { trigger: '.mice-her', start: 'top bottom', end: 'bottom top',
              scrub: true, invalidateOnRefresh: true },
          });
        }
        return () => {};
      });

      /* HOW WE WORK — the rule draws itself as the section arrives. It runs
         horizontally on desktop and vertically on mobile, which are different
         transforms, so the two are separate matchMedia branches rather than one
         tween that silently does nothing on a phone. */
      mm.add({
        wide: '(min-width: 981px) and (prefers-reduced-motion: no-preference)',
        narrow: '(max-width: 980px) and (prefers-reduced-motion: no-preference)',
      }, (c) => {
        const rule = document.querySelector('.mice-steps__rule i');
        const items = gsap.utils.toArray('.mice-steps__rail li');
        if (!rule || !items.length) return undefined;
        const axis = c.conditions.wide ? 'scaleX' : 'scaleY';
        gsap.fromTo(rule, { [axis]: 0 }, {
          [axis]: 1, duration: 1.1, ease: 'power2.inOut',
          scrollTrigger: { trigger: '.mice-steps__rail', start: 'top 80%', once: true },
        });
        /* On a phone the five steps are a tall column, so each one gets its own
           trigger rather than a single stagger the reader has already scrolled
           past by the time it fires. */
        if (c.conditions.narrow) {
          items.forEach((li) => {
            gsap.fromTo(li,
              { opacity: 0, y: 26 },
              { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
                scrollTrigger: { trigger: li, start: 'top 88%', once: true } });
          });
        } else {
          gsap.fromTo(items,
            { opacity: 0, y: 26 },
            { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.12,
              scrollTrigger: { trigger: '.mice-steps__rail', start: 'top 80%', once: true } });
        }
        return () => {};
      });
    }, root);

    return () => ctx.revert();
  }, []);

  /* Re-measure after the form changes height — step two is taller than step one
     and the confirmation is shorter than both — or every trigger below it is
     anchored to a page length that no longer exists. */
  useLayoutEffect(() => { ScrollTrigger.refresh(); }, [step, sent]);

  return (
    <div className="h26 new-typo n3 mice" ref={root}>
      <SiteNav solidAt={80} skipTo="#mice-main" skipLabel="Skip to content" />

      {/* ================================================================ HERO */}
      <header className="mice-hero">
        <div className="mice-hero__media" aria-hidden="true">
          <img
            src={img('1529156069898-49953e39b3ac', 2000)}
            alt=""
            fetchpriority="high"
            decoding="async"
            width="2000"
            height="1125"
          />
          {HERO_VIDEO && (
            <video className="mice-hero__video" src={HERO_VIDEO}
              poster={img('1529156069898-49953e39b3ac', 1200)}
              muted loop playsInline preload="none" />
          )}
        </div>
        {/* A directional scrim rather than a flat wash: navy in the lower left,
            gone by the upper right. A flat overlay is what makes hero images
            look muddy; this keeps 4.5:1 behind the type while leaving most of
            the photograph at full strength. */}
        <div className="mice-hero__scrim" aria-hidden="true" />

        <div className="mice-hero__inner" id="mice-main">
          <p className="mice-eyebrow mice-eyebrow--light mice-hero__reveal">MICE by Cox &amp; Kings</p>
          <h1 className="mice-hero__title mice-hero__reveal">
            Where Business <span className="mice-nb">Meets <em>Extraordinary.</em></span>
          </h1>
          <p className="mice-hero__lead mice-hero__reveal">
            From incentive journeys and corporate retreats to conferences and events,
            Cox &amp; Kings creates experiences that bring people together, inspire
            teams and make business travel worth remembering.
          </p>
          <div className="mice-hero__actions mice-hero__reveal">
            <button type="button" className="h26-btn h26-btn-pill" onClick={() => goToForm()}>
              Plan your MICE journey <ArrowRight size={16} aria-hidden="true" />
            </button>
            <button type="button" className="mice-btn-ghost" onClick={openCallback}>
              <MessageCircle size={16} aria-hidden="true" /> Talk to a MICE expert
            </button>
          </div>
          <p className="mice-hero__credential mice-hero__reveal">
            260+ years of knowing the world. Now, creating extraordinary journeys for business.
          </p>
        </div>

        {/* Trust rail — the homepage's own hero pills, on the right. This is
            where the page answers "why you" inside a procurement reader's first
            thirty seconds, which is the one thing the brief had no room for. */}
        <div className="h26-pills mice-hero__trust" aria-label="Why Cox and Kings">
          {HERO_TRUST.map((p) => (
            <div className="h26-pill" key={p.v}>
              <strong>{p.v}</strong>
              <span>{p.l}</span>
            </div>
          ))}
        </div>
      </header>

      {/* ======================================================= INTRODUCTION */}
      <section className="mice-intro" aria-labelledby="mice-intro-h">
        {/* The photograph bleeds off the left edge of the viewport while the
            copy stays inside the grid. A plain two-column split is what every
            framework produces by default; the asymmetry is the difference
            between a section that was laid out and one that was designed. */}
        <div className="mice-intro__img">
          <img src={img('1539635278303-d4002c07eae3', 1200)}
            alt="Colleagues laughing together on a group trip in the mountains."
            loading="lazy" decoding="async" width="1200" height="900" />
        </div>
        <div className="mice-intro__copy mice-rise-group">
          <p className="mice-eyebrow">MICE by Cox &amp; Kings</p>
          <h2 id="mice-intro-h" className="mice-h2">More Than Meetings. Journeys That Move People.</h2>
          <p>
            A successful corporate journey isn&apos;t just about getting everyone there.
            It&apos;s about creating the moments that bring teams together, reward
            performance and inspire what&apos;s next.
          </p>
          <p>
            With Cox &amp; Kings, every journey is thoughtfully designed around your
            business objective, your people and the experience you want them to take home.
          </p>
        </div>
      </section>

      {/* =========================================================== SOLUTIONS */}
      {/* The homepage's own fork cards — `hi-fork-grid--four` + `hi-lane` — so
          this section reads as the same furniture as "How would you like to
          travel?" rather than a lookalike rebuilt in a private stylesheet. */}
      <section className="mice-sec mice-solutions" aria-labelledby="mice-sol-h">
        <div className="mice-wrap">
          <header className="mice-sechead mice-sechead--center mice-rise-group">
            <p className="mice-eyebrow">What we create</p>
            <h2 id="mice-sol-h" className="mice-h2">Built Around Your Business. Designed Around Your People.</h2>
            <p className="mice-lede">Whatever brings your people together, we create the journey around it.</p>
          </header>

          <div className="hi-fork-grid hi-fork-grid--four mice-fork mice-rise-group">
            {SOLUTIONS.map((s) => (
              <div className="hi-lane" key={s.id}>
                <div className="hi-lane-media">
                  <img src={img(s.image, 800)} alt={s.alt} loading="lazy" decoding="async" />
                </div>
                <div className="hi-lane-body">
                  <span className="hi-lane-tag">{s.tag}</span>
                  <h3>{s.title}</h3>
                  <p className="mice-lane-line">{s.line}</p>
                  <p>{s.body}</p>
                  {/* Deliberately inert. The four solution child pages do not
                      exist, and rather than send every card to the same form —
                      which made four different labels do one identical thing —
                      these read as labels for now.

                      A span, not a disabled button: a button that does nothing
                      still takes a tab stop and still announces itself as a
                      control, which is a worse lie than static text. /new3 uses
                      the same span-as-pill for its non-navigating fork card.
                      Swap it back to a Link the day those pages ship. */}
                  <span className="h26-btn h26-btn-pill mice-lane-cta">
                    {s.cta} <ArrowRight size={16} aria-hidden="true" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================== WHY — heritage section */}
      {/* Rebuilt on the homepage's heritage shape: a photograph, an eyebrow, a
          serif statement with an italic emphasis, trust badges and a counted
          stat band. The earlier version was a sticky column beside a list of
          adjectives, which read as flat as it sounds. */}
      <section className="mice-sec mice-her" aria-labelledby="mice-her-h">
        <div className="mice-wrap mice-her__grid">
          {/* The homepage's own heritage composition: a large photograph with a
              card overlapping its lower corner, carrying a second inset image.
              Rebuilt here rather than borrowed, because the homepage's version
              lives in Luxe2Improved.css, which SiteChrome does not load — and
              importing another page's whole sheet to get one section would drag
              its resets and its own background rules along with it. */}
          <div className="mice-her__media mice-rise">
            <div className="mice-her__main">
              <img src={img('1511632765486-a01980e01a18', 1100)}
                alt="Four colleagues arm in arm, watching the sun go down together."
                loading="lazy" decoding="async" width="1100" height="1400" />
            </div>

            <div className="mice-her__card">
              <p className="mice-her__ceyebrow">Since 1758</p>
              <h3 className="mice-her__ctitle">A dedicated MICE desk</h3>
              <p className="mice-her__ccopy">
                Specialists who understand corporate objectives, timelines and
                budgets — not a general enquiries line.
              </p>
              <div className="mice-her__inset">
                <img src={img('1528605248644-14dd04022da1', 800)}
                  alt="A long table of colleagues eating together at the end of a day."
                  loading="lazy" decoding="async" width="800" height="500" />
              </div>
            </div>
          </div>

          <div className="mice-her__text mice-rise-group">
            <p className="mice-eyebrow">Why Cox &amp; Kings</p>
            <h2 id="mice-her-h" className="mice-her__h2">
              260+ years of <em>knowing the world</em>
            </h2>
            <p className="mice-her__copy">
              Our legacy has taken us across generations, continents and cultures.
              Today that experience comes together with a modern understanding of
              business, people and experiences — and from the first brief to the
              moment your team returns home, we bring the destination expertise,
              planning and on-ground execution that makes a journey seamless.
            </p>

            <ul className="mice-her__badges" aria-label="Why teams choose Cox and Kings">
              {HERITAGE_BADGES.map((b) => {
                const Icon = b.icon;
                return (
                  <li key={b.stat}>
                    <span className="mice-her__ic"><Icon size={19} strokeWidth={1.6} aria-hidden="true" /></span>
                    <span className="mice-her__bt">
                      <strong>{b.stat}</strong>
                      <small>{b.label}</small>
                    </span>
                  </li>
                );
              })}
            </ul>

            {/* Any stat whose figure is still unknown keeps its label and shows
                a hairline instead of a number, so the band survives being only
                partly answered rather than shipping an invented figure. */}
            <div className="mice-her__band">
              {HERITAGE_STATS.map((st) => (
                <div className="mice-her__stat" key={st.label}>
                  {st.n === null
                    ? <span className="mice-her__n mice-her__n--empty" aria-hidden="true" />
                    : (
                      <span className="mice-her__n">
                        <span data-count={st.n}>{st.n.toLocaleString('en-IN')}</span>{st.suffix}
                      </span>
                    )}
                  <span className="mice-her__l">{st.label}</span>
                </div>
              ))}
            </div>

            <button type="button" className="h26-btn h26-btn-pill" onClick={() => goToForm()}>
              Plan your MICE journey <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      {/* ======================================================== DESTINATIONS */}
      <section className="mice-sec mice-dest" aria-labelledby="mice-dest-h">
        <div className="mice-wrap">
          {/* Heading left, lede right. Stacked, the lede left a column of dead
              space down the right of the section; set beside the heading it
              fills the measure and the two read as one statement. */}
          <header className="mice-sechead mice-sechead--split mice-rise-group">
            <div>
              <p className="mice-eyebrow">The world is your conference room</p>
              <h2 id="mice-dest-h" className="mice-h2">Take Business <span className="mice-nb">Somewhere Extraordinary.</span></h2>
            </div>
            <p className="mice-lede">
              From the familiar to the unexpected, choose a destination that gives your
              people something to talk about long after they return.
            </p>
          </header>
        </div>

        {/* DESKTOP — a horizontal accordion. Grouping by intent is the strongest
            idea in the brief: it reframes "where can you send us", which every
            operator can answer, into "what should this trip do", which only a
            good partner asks. So it earns the strongest interaction here. */}
        <ul className="mice-dest__bands">
          {DEST_GROUPS.map((g) => {
            const open = openDest === g.id;
            return (
              <li key={g.id}
                className={`mice-dest__band${open ? ' is-open' : ''}`}
                style={{ backgroundImage: `url(${img(g.image, 1600)})` }}
                onMouseEnter={() => setOpenDest(g.id)}>
                <button type="button" className="mice-dest__btn" aria-expanded={open}
                  onClick={() => setOpenDest(g.id)} onFocus={() => setOpenDest(g.id)}>
                  <span className="mice-dest__title">{g.title}</span>
                  <span className="mice-dest__reveal">
                    <span className="mice-dest__places">{g.places.join('  ·  ')}</span>
                    <span className="mice-dest__line">{g.line}</span>
                    <span className="mice-dest__note">{g.note}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* MOBILE — one card at a time on a snap rail, instead of five stacked
            bands. Five full-bleed panels down a phone was a wall of photographs
            with no sense of where you were in it; a rail shows one group at a
            time, at a size where the type can breathe, and the peeking next card
            is the only affordance needed to say "there is more". */}
        <div className="mice-destm">
          <div className="mice-destm__rail" ref={destRail}
            onScroll={railIndex(destRail, setDestIndex)}
            tabIndex={0} role="group" aria-label="Destinations by the kind of journey">
            {DEST_GROUPS.map((g) => (
              <article className="mice-destm__card" key={g.id}>
                <img src={img(g.image, 900)} alt="" loading="lazy" decoding="async" />
                <div className="mice-destm__body">
                  <h3>{g.title}</h3>
                  <p className="mice-destm__places">{g.places.join('  ·  ')}</p>
                  <p className="mice-destm__line">{g.line}</p>
                  <p className="mice-destm__note">{g.note}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="mice-railnav">
            <button type="button" onClick={() => railStep(destRail, -1)} aria-label="Previous group">
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <button type="button" onClick={() => railStep(destRail, 1)} aria-label="Next group">
              <ChevronRight size={18} aria-hidden="true" />
            </button>
            <span className="mice-railnav__count">
              {String(Math.min(destIndex + 1, DEST_GROUPS.length)).padStart(2, '0')}
              <i> / </i>{String(DEST_GROUPS.length).padStart(2, '0')}
            </span>
          </div>
        </div>

        <div className="mice-wrap mice-dest__foot">
          <button type="button" className="mice-link" onClick={() => goToForm()}>
            Explore MICE destinations <ArrowRight size={15} aria-hidden="true" />
          </button>
        </div>
      </section>

      {/* ========================================================= EXPERIENCES */}
      <section className="mice-sec mice-exp" aria-labelledby="mice-exp-h">
        <div className="mice-wrap">
          <header className="mice-sechead mice-sechead--light mice-rise-group">
            <p className="mice-eyebrow mice-eyebrow--light">Not just an itinerary</p>
            <h2 id="mice-exp-h" className="mice-h2 mice-h2--light">Make It More Than a Trip.</h2>
            <p className="mice-lede mice-lede--light">
              Because the best corporate journeys aren&apos;t remembered for their
              schedules. They&apos;re remembered for how they made people feel.
            </p>
          </header>
        </div>

        {/* Native scroll-snap, driven by the reader. Not a pinned, scrubbed
            track: pinning takes the scroll away, is fragile on trackpads, has
            mis-measured on this codebase before, and needs a second
            implementation for touch anyway. */}
        <div className="mice-exp__track" ref={expTrack}
          onScroll={railIndex(expTrack, setExpIndex)}
          tabIndex={0} role="group" aria-label="Signature experiences">
          {EXPERIENCES.map((e) => (
            <article className="mice-exp__panel" key={e.n}>
              <img src={img(e.image, 1200)} alt="" loading="lazy" decoding="async" width="1200" height="1500" />
              <div className="mice-exp__copy">
                <span className="mice-exp__n">{e.n}</span>
                <h3 className="mice-exp__t">{e.title}</h3>
                <p className="mice-exp__l">{e.line}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mice-wrap mice-exp__foot">
          <div className="mice-railnav mice-railnav--light">
            <button type="button" onClick={() => railStep(expTrack, -1)} aria-label="Previous experience">
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <button type="button" onClick={() => railStep(expTrack, 1)} aria-label="Next experience">
              <ChevronRight size={18} aria-hidden="true" />
            </button>
            <span className="mice-railnav__count">
              {String(Math.min(expIndex + 1, EXPERIENCES.length)).padStart(2, '0')}
              <i> / </i>{String(EXPERIENCES.length).padStart(2, '0')}
            </span>
          </div>
          <button type="button" className="mice-link mice-link--light" onClick={() => goToForm()}>
            Create your experience <ArrowRight size={15} aria-hidden="true" />
          </button>
        </div>
      </section>

      {/* ========================================================= HOW WE WORK */}
      <section className="mice-sec mice-steps" aria-labelledby="mice-steps-h">
        <div className="mice-wrap">
          <header className="mice-sechead mice-sechead--split mice-rise-group">
            <div>
              <p className="mice-eyebrow">From brief to boarding pass</p>
              <h2 id="mice-steps-h" className="mice-h2">You Bring the Objective. We&apos;ll Build the Journey.</h2>
            </div>
            <p className="mice-lede">A simple process. Thoughtful planning. Seamless execution.</p>
          </header>

          {/* Horizontal on desktop, a vertical timeline on mobile. Five columns
              on a 390px screen is either illegible or a carousel that hides
              four-fifths of a process the reader wants to see whole. */}
          <div className="mice-steps__rail">
            <div className="mice-steps__rule" aria-hidden="true"><i /></div>
            <ol>
              {STEPS.map((s) => (
                <li key={s.n}>
                  <span className="mice-steps__n">{s.n}</span>
                  <h3 className="mice-steps__t">{s.title}</h3>
                  <p className="mice-steps__b">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* ⚠ Confirm this figure with the MICE desk before launch. */}
          <p className="mice-steps__lead mice-rise">
            Typical lead time from brief to departure: <strong>6&ndash;8 weeks.</strong>
          </p>
        </div>
      </section>

      {/* ========================================================= TESTIMONIALS */}
      {/* The same marquee as /journeys/japan-2 — trust strip, then reviews that
          travel sideways on their own. Placeholder content, clearly marked in
          the REVIEWS constant; the layout is what is being signed off here. */}
      <section className="h26-reviews mice-revs" id="mice-reviews" aria-labelledby="mice-rev-h">
        <div className="mice-wrap">
          <div className="mice-sechead mice-rise-group">
            <p className="mice-eyebrow">What our clients say</p>
            <h2 id="mice-rev-h" className="mice-h2">The Journey Ends. <span className="mice-nb">The Impression Doesn&apos;t.</span></h2>
            <p className="mice-lede">
              Teams of twenty and teams of two hundred, moved by people who do this every week.
            </p>
          </div>
        </div>

        <div className="hi-rtrust mice-rise">
          <div className="hi-rtrust-overall">
            <strong>4.9</strong>
            <div className="hi-rtrust-overall-meta">
              <span className="hi-rtrust-stars" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, k) => <Star key={k} size={15} fill="currentColor" />)}
              </span>
              <span className="hi-rtrust-sub">Excellent · 2,400+ verified reviews</span>
            </div>
          </div>
          <span className="hi-rtrust-div" aria-hidden="true" />
          <div className="hi-rtrust-platforms">
            <span className="hi-rtrust-plat"><span><strong>Corporate clients</strong> across India</span></span>
          </div>
        </div>

        <div className="h26-marquee">
          <div className="h26-marquee-track">
            {[...REVIEWS, ...REVIEWS].map((r, i) => (
              <article className="h26-rev" key={i}>
                <div className="h26-rev-photo">
                  <img src={img(r.tripPhoto, 600)} alt="" loading="lazy" />
                  <span className="h26-rev-tour">{r.tour}</span>
                </div>
                <div className="h26-rev-content">
                  <div className="h26-rev-stars">
                    {Array.from({ length: r.rating }).map((_, k) => <Star key={k} size={14} fill="currentColor" />)}
                  </div>
                  <p>&ldquo;{r.text}&rdquo;</p>
                  <div className="h26-rev-who">
                    <img src={img(r.avatar, 120)} alt="" loading="lazy" />
                    <span>
                      <strong>{r.name}</strong>
                      <em>{r.location}</em>
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== ENQUIRY */}
      <section className="mice-sec mice-form" id="mice-enquiry" aria-labelledby="mice-form-h">
        <div className="mice-wrap">
          <header className="mice-sechead mice-sechead--split mice-rise-group">
            <div>
              <p className="mice-eyebrow">Let&apos;s create something extraordinary</p>
              <h2 id="mice-form-h" className="mice-h2">Tell Us Where You Want to Take Your People.</h2>
            </div>
            <p className="mice-lede">
              Share a few details about your plans. Our MICE specialists will take it from there.
            </p>
          </header>
        </div>

        <div className="mice-wrap mice-form__grid">
          {/* The form sits on its own white card. On a cream page a bare form
              reads as loose fields floating in a section; boxed, it reads as one
              object with a beginning and an end, which is most of what makes it
              feel quick to fill. */}
          <div className="mice-form__card mice-rise">

            {sent ? (
              /* The confirmation replaces the form in place. No navigation away,
                 no modal. The stated response window is the strongest trust
                 signal on this page and costs only the commitment. */
              <div className="mice-sent">
                <span className="mice-sent__tick" aria-hidden="true"><Check size={20} /></span>
                <h3 id="mice-sent-heading" tabIndex={-1}>
                  Thank you{form.name ? `, ${form.name.split(' ')[0]}` : ''}. Your enquiry is with our MICE team.
                </h3>
                <p>
                  A MICE specialist will be in touch within one working day to understand
                  your requirements and start building the right experience.
                </p>
                <button type="button" className="mice-link" onClick={openCallback}>
                  Would you rather we called sooner? <ArrowRight size={15} aria-hidden="true" />
                </button>
              </div>
            ) : (
              <form className="mice-fields" onSubmit={step === 1 ? onContinue : onSubmit} noValidate>
                <div className="mice-steps-ind" aria-hidden="true">
                  <i className={step >= 1 ? 'is-on' : ''} />
                  <i className={step >= 2 ? 'is-on' : ''} />
                  <span>Step {step} of 2</span>
                </div>

                {step === 1 ? (
                  <>
                    {/* Promoted from seventh to first: the easiest question on
                        the form, the most useful for routing, and the landing
                        point for all four solution cards. */}
                    <fieldset className="mice-field">
                      <legend>What are you planning? <b aria-hidden="true">*</b></legend>
                      <div className="mice-chips">
                        {ENQUIRY_TYPES.map((t) => (
                          <label key={t.id} className={form.type === t.id ? 'is-on' : ''}>
                            <input type="radio" name="type" value={t.id}
                              checked={form.type === t.id} onChange={set('type')} />
                            {t.label}
                          </label>
                        ))}
                      </div>
                      {errors.type && <p className="mice-err">{errors.type}</p>}
                    </fieldset>

                    <fieldset className="mice-field">
                      <legend>How many travellers? <b aria-hidden="true">*</b></legend>
                      <div className="mice-chips">
                        {PAX_BANDS.map((p) => (
                          <label key={p} className={form.pax === p ? 'is-on' : ''}>
                            <input type="radio" name="pax" value={p}
                              checked={form.pax === p} onChange={set('pax')} />
                            {p}
                          </label>
                        ))}
                      </div>
                      {errors.pax && <p className="mice-err">{errors.pax}</p>}
                    </fieldset>

                    <div className="mice-field">
                      <label htmlFor="mice-destination">Where would you like to go?</label>
                      <input id="mice-destination" name="destination" type="text"
                        placeholder="A country, a city, or a region"
                        value={form.destination} onChange={set('destination')}
                        disabled={form.destUnsure} autoComplete="off" />
                      <label className="mice-check">
                        <input type="checkbox" name="destUnsure" checked={form.destUnsure} onChange={set('destUnsure')} />
                        <span>Not sure yet &mdash; help us choose</span>
                      </label>
                      {errors.destination && <p className="mice-err">{errors.destination}</p>}
                    </div>

                    <button type="submit" className="h26-btn h26-btn-pill mice-btn-wide">
                      Continue <ArrowRight size={16} aria-hidden="true" />
                    </button>
                  </>
                ) : (
                  <>
                    <p className="mice-group">Your details</p>
                    <div className="mice-two">
                      <div className="mice-field">
                        <label htmlFor="mice-name">Your name <b aria-hidden="true">*</b></label>
                        <input id="mice-name" name="name" type="text" autoComplete="name"
                          value={form.name} onChange={set('name')} />
                        {errors.name && <p className="mice-err">{errors.name}</p>}
                      </div>
                      <div className="mice-field">
                        <label htmlFor="mice-company">Company <b aria-hidden="true">*</b></label>
                        <input id="mice-company" name="company" type="text" autoComplete="organization"
                          value={form.company} onChange={set('company')} />
                        {errors.company && <p className="mice-err">{errors.company}</p>}
                      </div>
                    </div>

                    <div className="mice-two">
                      <div className="mice-field">
                        <label htmlFor="mice-email">Work email <b aria-hidden="true">*</b></label>
                        <input id="mice-email" name="email" type="email" autoComplete="email"
                          value={form.email} onChange={set('email')} />
                        {errors.email && <p className="mice-err">{errors.email}</p>}
                      </div>
                      <div className="mice-field">
                        <label htmlFor="mice-phone">Phone <b aria-hidden="true">*</b></label>
                        <input id="mice-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel"
                          value={form.phone} onChange={set('phone')} />
                        {errors.phone && <p className="mice-err">{errors.phone}</p>}
                      </div>
                    </div>

                    <p className="mice-group">About the journey</p>

                    {/* Month AND year. Month alone is ambiguous for most of the
                        year and breaks routing the moment it crosses December. */}
                    <div className="mice-field">
                      <label htmlFor="mice-month">When are you travelling?</label>
                      <div className="mice-two mice-two--tight">
                        <select id="mice-month" name="month" value={form.month} onChange={set('month')}>
                          <option value="">Month</option>
                          {MONTHS.map((m) => <option key={m}>{m}</option>)}
                        </select>
                        <select name="year" value={form.year} onChange={set('year')} aria-label="Year">
                          <option value="">Year</option>
                          {YEARS.map((y) => <option key={y}>{y}</option>)}
                        </select>
                      </div>
                      <label className="mice-check">
                        <input type="checkbox" name="flexible" checked={form.flexible} onChange={set('flexible')} />
                        <span>Our dates are flexible</span>
                      </label>
                    </div>

                    {/* Optional, and banded. An optional free-text budget field
                        is skipped by almost everyone, because nobody types a
                        number they might be held to. A range is easy to pick. */}
                    <fieldset className="mice-field">
                      <legend>Approximate budget <span className="mice-opt">(optional)</span></legend>
                      <div className="mice-chips">
                        {BUDGET_BANDS.map((b) => (
                          <label key={b} className={form.budget === b ? 'is-on' : ''}>
                            <input type="radio" name="budget" value={b}
                              checked={form.budget === b} onChange={set('budget')} />
                            {b}
                          </label>
                        ))}
                      </div>
                    </fieldset>

                    <div className="mice-field">
                      <label htmlFor="mice-notes">Anything else we should know <span className="mice-opt">(optional)</span></label>
                      <textarea id="mice-notes" name="notes" rows={3}
                        value={form.notes} onChange={set('notes')} />
                    </div>

                    {/* Un-ticked, scoped to this enquiry, not bundled with
                        anything else. The form takes a work email and a phone
                        number: the DPDP Act 2023 requires notice and
                        affirmative consent, GDPR applies to EU and UK traffic,
                        and a pre-ticked box satisfies neither. Any marketing
                        opt-in must be a SECOND, SEPARATE box. */}
                    <div className="mice-field">
                      <label className="mice-check mice-check--consent">
                        <input type="checkbox" name="consent" checked={form.consent} onChange={set('consent')} />
                        <span>
                          I agree that Cox &amp; Kings may contact me about this enquiry.
                          See our <a href="/terms">privacy notice</a>.
                        </span>
                      </label>
                      {errors.consent && <p className="mice-err">{errors.consent}</p>}
                    </div>

                    <div className="mice-form__actions">
                      <button type="button" className="mice-btn-ghost mice-btn-ghost--dark" onClick={() => setStep(1)}>
                        Back
                      </button>
                      <button type="submit" className="h26-btn h26-btn-pill">
                        Start planning <ArrowRight size={16} aria-hidden="true" />
                      </button>
                    </div>
                  </>
                )}

                <p className="mice-fields__foot">
                  We&apos;ll be in touch with you to understand your requirements and
                  build the right experience.
                </p>
              </form>
            )}
          </div>

          {/* Not a photograph. This is the highest-intent space on the page and
              the reader's state here is mild anxiety about what they are about
              to set off, so the rail answers that instead of decorating it.

              Three cards rather than a list on a dark slab: each step is its own
              object, which is scannable in a glance, and it stops the panel
              reading as a second block of body copy next to the form. */}
          <aside className="mice-rail mice-rise-group">
            <p className="mice-rail__t">What happens next</p>
            <ol className="mice-next">
              {NEXT_STEPS.map((n) => {
                const Icon = n.icon;
                return (
                  <li className="mice-next__card" key={n.n}>
                    <span className="mice-next__head">
                      <span className="mice-next__ic"><Icon size={17} strokeWidth={1.7} aria-hidden="true" /></span>
                      <span className="mice-next__n">{n.n}</span>
                    </span>
                    <strong>{n.title}</strong>
                    <small>{n.body}</small>
                  </li>
                );
              })}
            </ol>

            <div className="mice-talk">
              <p className="mice-talk__t">Rather talk it through first?</p>
              <p className="mice-talk__b">
                A MICE specialist can call you at a time that suits, before you send anything.
              </p>
              <button type="button" className="mice-talk__cta" onClick={openCallback}>
                Schedule a call <ArrowUpRight size={16} aria-hidden="true" />
              </button>
            </div>
          </aside>
        </div>
      </section>

      {/* ================================================================= FAQ */}
      {/* Moved below the form deliberately. These are the questions that stop a
          reader mid-decision, so they belong beside the decision rather than
          three sections before it — and anyone who has already enquired scrolls
          straight past. */}
      <section className="mice-sec mice-faq" aria-labelledby="mice-faq-h">
        <div className="mice-wrap mice-faq__grid">
          <header className="mice-sechead mice-rise-group">
            <p className="mice-eyebrow">FAQ</p>
            <h2 id="mice-faq-h" className="mice-h2">Frequently Asked Questions</h2>
            <p className="mice-lede">The things corporate teams ask us before they brief us.</p>
          </header>

          {/* Closed by default, and more than one may be open at a time — an
              accordion that shuts your previous answer when you open the next is
              hostile to anyone comparing two of them. */}
          <ul className="mice-faq__list">
            {FAQS.map((f, i) => {
              const open = openFaqs.includes(i);
              return (
                <li key={f.q} className={open ? 'is-open' : ''}>
                  <h3>
                    <button type="button" aria-expanded={open} aria-controls={`mice-faq-${i}`}
                      onClick={() => setOpenFaqs((o) => (
                        o.includes(i) ? o.filter((x) => x !== i) : [...o, i]
                      ))}>
                      <span>{f.q}</span>
                      <ChevronDown size={18} aria-hidden="true" />
                    </button>
                  </h3>
                  <div className="mice-faq__a" id={`mice-faq-${i}`} hidden={!open}>
                    {/* Nothing here invents a fact. Until the MICE team supplies
                        an answer, the page says so rather than guessing. */}
                    <p>{f.a || 'To be confirmed with our MICE team — ask us in the form above and we’ll come straight back to you.'}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ============================================================= CLOSING */}
      <section className="mice-close" aria-labelledby="mice-close-h">
        <div className="mice-close__media" aria-hidden="true">
          <img src={img('1543783207-ec64e4d95325', 1800)} alt="" loading="lazy"
            decoding="async" width="1800" height="1012" />
        </div>
        <div className="mice-close__inner mice-rise-group">
          <h2 id="mice-close-h" className="mice-close__title">
            <span>You Bring the People.</span>
            <span><em>We&apos;ll Bring the World.</em></span>
          </h2>
          <p className="mice-close__sub">
            MICE by Cox &amp; Kings. Corporate journeys, thoughtfully designed and
            expertly delivered.
          </p>
          <div className="mice-close__actions">
            <button type="button" className="h26-btn h26-btn-pill" onClick={() => goToForm()}>
              Plan your MICE journey <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      <SiteFooter />

      {/* Mobile thumb-reach bar — the homepage's own component, so the two pages
          behave identically in the one place a thumb actually rests. The shared
          stylesheet hides it above 680px, where the desktop bar takes over. */}
      <div className={`h26-thumbbar${barVisible ? '' : ' is-hidden'}`} aria-hidden={!barVisible}>
        <button type="button" className="h26-thumbbar-cta" onClick={() => goToForm()}>
          Plan Your MICE Journey <ArrowRight size={18} aria-hidden="true" />
        </button>
        <button type="button" className="h26-thumbbar-call" aria-label="Schedule a callback"
          onClick={openCallback}>
          <MessageCircle size={20} aria-hidden="true" />
        </button>
      </div>

      {/* Desktop equivalent of the thumb-bar. */}
      <div className={`mice-bar${barVisible ? ' is-on' : ''}`}>
        <button type="button" className="h26-btn h26-btn-pill" onClick={() => goToForm()}>
          Plan your MICE journey
        </button>
        <button type="button" className="mice-btn-ghost mice-btn-ghost--onDark" onClick={openCallback}>
          <MessageCircle size={15} aria-hidden="true" /> Talk to a MICE expert
        </button>
      </div>
    </div>
  );
}
