/* ============================================================================
   Cox & Kings India — BECOME A FRANCHISE PARTNER   (route: /franchise)

   THE HERO is form-first and untouched: the pitch on the left, the enquiry form
   top-right, fillable the instant the page loads. It asks four things and
   nothing more — full name, email, city, and where you're coming from. There is
   no phone number anywhere on this page; the enquiry is answered by email, and
   email is the only contact channel the page shows.

   BELOW THE HERO the page is three sections and no more, because a franchise
   prospect who has already seen the form is browsing, not studying:

     01 · WHAT YOU GET a navy counter rail out of the hero, then the four
                       things a partner is actually buying, as ONE ROW of four
                       photographic cards. One row, not four stacked bands —
                       the section has to be short, and the copy is plain.
     02 · THE SHELF    what the store sells, as a PINNED HORIZONTAL TRACK: eight
                       photographic tiles scrubbed sideways by vertical scroll,
                       with a progress rule beneath them.
     03 · THE ANSWERS  the FAQ, built to the /mice pattern exactly — heading
                       block in a 4fr column, the questions in a 7fr column
                       beside it, ruled top and bottom, chevrons that rotate,
                       and more than one answer open at a time. "How it works",
                       "who can apply" and what a store costs are all answers
                       here rather than sections of their own. A closing CTA
                       band ends the page.

   AESTHETIC — archive editorial, not neon. The house language is unchanged:
   Cormorant Garamond display, Work Sans body, and only the design.md palette.
   What carries it is precision — oversized numerals, hairline rules, index
   marks set in the margin like a ledger, and photography that travels at a
   different speed to the type.

   MOTION — GSAP + ScrollTrigger, all of it inside gsap.matchMedia() gated on
   (prefers-reduced-motion: no-preference). NOTHING is hidden in CSS: every
   resting state is the visible one and GSAP owns the from-state, so a
   reduced-motion visitor — or a GSAP failure — gets the full, static page. The
   pinned shelf is gated on (min-width: 1025px) too; below that the same track
   is a native scroll-snap carousel, with no pin and no transform.

   How this differs from the two sibling partner pages:
     · /become-a-partner  → Preferred SALES Partner: agents/consultants who
                             sell under the brand (no storefront, no franchise fee).
     · /collaborate        → creators, brands & press who CREATE with the brand.
     · /franchise (this)   → a full, physically-branded Cox & Kings FRANCHISE
                             store: an exclusive territory, store setup, the
                             technology, training and supply chain — a business
                             you own and operate under the name.
   ========================================================================== */

import { useState, useLayoutEffect, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Check, ArrowRight, ArrowUpRight, Mail, ShieldCheck, Send, ChevronDown, Briefcase,
} from 'lucide-react';
import { SmartLink as Link, CALLBACK } from '../components/ScheduleCall';
import { SiteNav, SiteFooter } from '../components/SiteChrome';
import './Franchise.css';

gsap.registerPlugin(ScrollTrigger);

/* The franchise desk's own inbox — verified against the live Cox & Kings
   franchise page (coxandkings.com/become-a-franchisee), which publishes
   franchisee@coxandkings.com. NOT "franchise@", which the business does not
   use. /become-a-partner already carried the same address. */
const EMAIL = 'franchisee@coxandkings.com';

/* Every photograph on this page is already in service elsewhere on the site,
   so the franchise story is told in the same visual voice as the journeys. */
const img = (id, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

/* -------------------------------------------------------------- the content */

/* Counters — `count` drives the tick-up, `n` is the fallback text that is on
   the page before (and without) JavaScript. */
const STATS = [
  { n: '1758', count: 1758, l: 'Established' },
  { n: '260', count: 260, sup: '+', l: 'Years of travel' },
  { n: '100', count: 100, sup: '+', l: 'Destinations' },
  { n: '20', count: 20, sup: '+', l: 'Franchise stores' },
];

const PILLARS = [
  {
    n: '01',
    t: 'The name above the door',
    b: 'You trade as Cox & Kings — a name Indian travellers have known for generations. Customers walk in already trusting you.',
    src: img('1467269204594-9661b134dd2b'),
    alt: 'A warmly lit European street at dusk',
  },
  {
    n: '02',
    t: 'An exclusive territory',
    b: 'Your catchment is mapped and agreed in writing before you sign. No second Cox & Kings opens inside it.',
    src: img('1524661135-423995f22d0b'),
    alt: 'A vintage printed world map',
  },
  {
    n: '03',
    t: 'A store, set up for you',
    b: 'We handle the site, the design, the fit-out and the training. You take over a store that is ready to trade.',
    src: img('1571896349842-33c89424de2d'),
    alt: 'A glass-fronted building lit from within at dusk',
  },
  {
    n: '04',
    t: 'Systems and supply',
    b: 'One platform books flights, hotels, cruises, visas, currency and holidays, with our contracts in 100+ destinations behind it.',
    src: img('1526392060635-9d6019884377'),
    alt: 'Machu Picchu in early morning cloud',
  },
];

/* OUR PRODUCTS — the shelf a franchise store trades, every line photographed. */
const SHELF = [
  { k: 'Holidays', t: 'International holidays', b: 'Escorted group tours and private, tailor-made journeys across 100+ destinations.', src: img('1516426122078-c23e76319801', 900), alt: 'A cliffside village on the Italian coast' },
  { k: 'India', t: 'India & short breaks', b: 'Weekend escapes, family holidays and the whole of India, in every season.', src: img('1524492412937-b28074a5d7da', 900), alt: 'The Taj Mahal reflected in its water channel' },
  { k: 'Documents', t: 'Visas & passports', b: 'Documentation, appointments and end-to-end visa handling for every walk-in.', src: img('1581553673739-c4906b5d0de8', 900), alt: 'An open passport covered in coloured entry stamps' },
  { k: 'Air & stay', t: 'Flights & hotels', b: 'Domestic and international air, and a global hotel inventory at trade rates.', src: img('1546708973-b339540b5162', 900), alt: 'A palm-lined resort pool under blue sky' },
  { k: 'At sea', t: 'Cruises', b: 'Ocean, river and expedition sailings with the world’s leading cruise lines.', src: img('1506973035872-a4ec16b8e8d9', 900), alt: 'Boats crossing a wide city harbour' },
  { k: 'Currency', t: 'Foreign exchange', b: 'Notes and multi-currency forex cards for every outbound traveller you serve.', src: img('1591033594798-33227a05780d', 900), alt: 'Banknotes from several countries fanned out' },
  { k: 'Business', t: 'Corporate & MICE', b: 'Meetings, incentives, conferences and exhibitions for your local businesses.', src: img('1521737604893-d14cc237f11d', 900), alt: 'Colleagues working together around a table' },
  { k: 'Occasions', t: 'Honeymoons & celebrations', b: 'Honeymoons, anniversaries and destination-wedding groups, planned end to end.', src: img('1514282401047-d79a71a590e8', 900), alt: 'Overwater villas on a turquoise lagoon' },
];

const ALSO = ['Travel insurance', 'Student & education travel', 'Rail & transfers', 'Gift vouchers'];

/* "How it works", "who can apply" and what a store costs are all answers here
   rather than sections of their own, so the page stays short and nothing that
   was on it is lost. */
const FAQS = [
  {
    q: 'Do I need experience in travel to apply?',
    a: 'No. A good number of our franchise partners come from outside the industry — corporate careers, retail, family businesses — alongside agents, and airline and hotel professionals starting out on their own. What matters is a strong local network, a suitable high-street site, and the commitment to run the store yourself. The product training, the systems and the selling skills all come from us.',
  },
  {
    q: 'What happens after I send the form?',
    a: 'Four stages. A franchise development manager reads your enquiry and replies within two working days to talk through your city, the territory and the investment. If it fits both sides, we agree the catchment and the site. We then handle the fit-out, install the technology and train you and your team. Finally you open under the Cox & Kings name with a launch marketing push behind you — typically eight to twelve weeks from that first email.',
  },
  {
    q: 'How much space and money does a store need?',
    a: 'A high-street or mall unit of roughly 250–500 sq ft, and an investment in the ₹15–50 lakh range, with two to four consultants on the floor once you are trading. Both move with your city and your catchment — a metro high street and a tier-2 market are not the same business — so treat these as the range rather than the number. Your franchise development manager works out the real figure for your location before anything is signed.',
  },
  {
    q: 'What does the investment actually cover?',
    a: 'The franchise fee, the store fit-out and branding, the full technology stack, training for you and your team, and your launch marketing — plus the working capital to trade from day one. Your franchise development manager breaks the figure down line by line for your specific city before anything is signed.',
  },
  {
    q: 'Is the territory really exclusive?',
    a: 'Yes. Your catchment is mapped and agreed in writing before you sign, and we do not open a second Cox & Kings outlet inside it. Every enquiry generated in your territory routes to your store.',
  },
  {
    q: 'What can I sell from the store?',
    a: 'Everything on the shelf above: international and India holidays, flights, hotels, cruises, visas and passports, foreign exchange, corporate and MICE business, honeymoons, travel insurance, student travel and gift vouchers. It is a one-stop travel shop, which is what makes a catchment worth owning — the same customer returns for the visa, the currency and the cover, not only for the trip.',
  },
  {
    q: 'What support continues after I open?',
    a: 'A named franchise development manager, refreshed product and systems training through the year, campaign and creative support for local marketing, central operations and contracting behind every booking, and 24/7 on-tour assistance for the customers you send out.',
  },
  {
    q: 'How does a franchise partner earn?',
    a: 'On commission across everything the store sells, with the rate varying by product line — holidays, air, hotels, forex, visas and insurance each carry their own. The full commission grid is shared during the assessment conversation, before you commit to anything.',
  },
  {
    q: 'I already run a travel agency. Can I convert it?',
    a: 'Often, yes — it is one of the most common routes in. Subject to the site meeting brand standards and the territory being open, an existing agency can be rebranded as a Cox & Kings store, bringing its customer book across onto our systems and supply.',
  },
];

/* Where a prospective partner is coming from. Kept as one plain question
   because it is the only qualifying signal the form asks for. */
const SOURCE = [
  'Travel agency — currently employed',
  'Travel agency — previously employed',
  'Airline or hotel background',
  'Running my own travel business',
  'Travel content creator / community',
  'Another industry entirely',
  'Something else',
];

const HERO_POINTS = [
  'A protected, exclusive territory',
  'Full store setup & branding',
  'End-to-end technology & training',
  'A supply chain across 100+ destinations',
];

/* ---------------------------------------------------------------- the picker
   A native <select> is drawn by the operating system: it cannot take the
   site's paper, its radii, its blue or Work Sans, so it was the one control in
   the form that looked like it came from somewhere else. This is the /faq2
   topic picker (.fq2-pick, itself the journeys sort dropdown) rebuilt as a
   FORM FIELD rather than a filter pill — same trigger, same popover, same
   check against the option in force, but sized and coloured to sit in the
   column with the three text inputs above it.

   <button> is a labelable element, so the field's <label for> still points at
   it and clicking the label still opens the menu. */
function SourcePicker({ value, onChange, id }) {
  const [open, setOpen] = useState(false);
  const wrap = useRef(null);
  const btn = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => { if (wrap.current && !wrap.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      btn.current?.focus();      /* Escape puts the caret back on the trigger */
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const pick = (t) => { onChange(t); setOpen(false); btn.current?.focus(); };

  return (
    <div className="fr-pick" ref={wrap}>
      <button
        type="button"
        id={id}
        ref={btn}
        className={`fr-pick__btn${open ? ' is-open' : ''}${value ? ' has-value' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <Briefcase size={15} className="fr-pick__ic" aria-hidden="true" />
        <span className="fr-pick__val">{value || 'Select one'}</span>
        <ChevronDown size={16} className="fr-pick__chev" aria-hidden="true" />
      </button>

      {open && (
        <ul className="fr-pick__pop" role="listbox" aria-label="Where you&apos;re coming from">
          {SOURCE.map((t) => (
            <li key={t}>
              <button
                type="button"
                role="option"
                aria-selected={value === t}
                className={`fr-pick__opt${value === t ? ' is-on' : ''}`}
                onClick={() => pick(t)}
              >
                <span>{t}</span>
                {value === t && <Check size={15} aria-hidden="true" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------- form
   Four fields and an optional note. Pure controlled state, no side-effects.
   Submitting swaps the form for a confirmation panel in place. */
function FranchiseForm() {
  const [form, setForm] = useState({ name: '', email: '', city: '', source: '', message: '' });
  const [sent, setSent] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const onSubmit = (e) => { e.preventDefault(); setSent(true); };

  if (sent) {
    return (
      <div className="fr-done" role="status">
        <span className="fr-done__ic" aria-hidden="true"><Check size={26} strokeWidth={2.2} /></span>
        <h3 className="fr-done__h">Thank you — we&apos;ve got it.</h3>
        <p className="fr-done__p">
          A Cox &amp; Kings franchise development manager will reach out by email
          within two working days. If anything comes up before then, write to us
          at {EMAIL}.
        </p>
        <a href={`mailto:${EMAIL}`} className="h26-btn h26-btn-pill h26-btn-lg fr-done__btn">
          <Mail size={15} aria-hidden="true" /> Email the franchise desk
        </a>
      </div>
    );
  }

  return (
    <form className="fr-form" onSubmit={onSubmit} noValidate>
      <div className="fr-field">
        <label htmlFor="fr-name">Full name</label>
        <input id="fr-name" type="text" required autoComplete="name" placeholder="Your name" value={form.name} onChange={set('name')} />
      </div>
      <div className="fr-field">
        <label htmlFor="fr-email">Email</label>
        <input id="fr-email" type="email" required autoComplete="email" placeholder="you@email.com" value={form.email} onChange={set('email')} />
      </div>
      <div className="fr-field">
        <label htmlFor="fr-city">City</label>
        <input id="fr-city" type="text" required autoComplete="address-level2" placeholder="Where you'd open" value={form.city} onChange={set('city')} />
      </div>
      <div className="fr-field">
        <label htmlFor="fr-source">Where you&apos;re coming from</label>
        <SourcePicker
          id="fr-source"
          value={form.source}
          onChange={(v) => setForm((f) => ({ ...f, source: v }))}
        />
      </div>
      <div className="fr-field">
        <label htmlFor="fr-msg">Anything we should know <span className="fr-optional">(optional)</span></label>
        <textarea id="fr-msg" rows={2} placeholder="Your experience, goals, or questions" value={form.message} onChange={set('message')} />
      </div>
      <button type="submit" className="h26-btn h26-btn-pill h26-btn-lg fr-form__submit">
        Submit franchise enquiry <Send size={15} aria-hidden="true" />
      </button>
      <p className="fr-form__note"><ShieldCheck size={13} aria-hidden="true" /> No commitment · a franchise manager replies within two working days</p>
    </form>
  );
}

/* ------------------------------------------------------------------- FAQ
   Built to the /mice accordion exactly: a heading block in its own column, the
   questions ruled top and bottom beside it, the question set in Work Sans at
   16px rather than the display serif, and a chevron that rotates.

   More than one answer may be open at a time, as on /mice — an accordion that
   shuts your previous answer when you open the next is hostile to anyone
   comparing two of them. It holds its own state so the page around it never
   re-renders under the stat counters GSAP has written into. */
function FranchiseFaq() {
  const [open, setOpen] = useState([]);
  const toggle = (i) => setOpen((o) => (o.includes(i) ? o.filter((x) => x !== i) : [...o, i]));

  return (
    <div>
      <ul className="fr-faq__list">
        {FAQS.map((f, i) => {
          const isOpen = open.includes(i);
          return (
            <li key={f.q} className={isOpen ? 'is-open' : ''}>
              <h3>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`fr-faq-${i}`}
                  onClick={() => toggle(i)}
                >
                  <span>{f.q}</span>
                  <ChevronDown size={18} aria-hidden="true" />
                </button>
              </h3>
              <div className="fr-faq__a" id={`fr-faq-${i}`} hidden={!isOpen}>
                <p>{f.a}</p>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="fr-faq__more">
        Still something unanswered? Write to{' '}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a> and a franchise development
        manager will answer it directly.
      </p>
    </div>
  );
}

export default function Franchise() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      /* ---------------------------------------------- the everyday reveals */
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        /* Masked display lines rise out of their own overflow. */
        gsap.utils.toArray('[data-lines]').forEach((el) => {
          gsap.from(el.querySelectorAll('.fr-line > span'), {
            yPercent: 118, duration: 1.05, ease: 'power3.out', stagger: 0.09,
            scrollTrigger: { trigger: el, start: 'top 88%', once: true, invalidateOnRefresh: true },
          });
        });

        /* Generic reveal + staggered groups. */
        gsap.utils.toArray('[data-reveal]').forEach((el) => {
          gsap.from(el, {
            opacity: 0, y: 28, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true, invalidateOnRefresh: true },
          });
        });
        gsap.utils.toArray('[data-stagger]').forEach((group) => {
          gsap.from(group.children, {
            opacity: 0, y: 30, duration: 0.85, stagger: 0.1, ease: 'power3.out',
            scrollTrigger: { trigger: group, start: 'top 86%', once: true, invalidateOnRefresh: true },
          });
        });

        /* Hairline rules draw themselves left to right. */
        gsap.utils.toArray('[data-rule]').forEach((el) => {
          gsap.from(el, {
            scaleX: 0, transformOrigin: 'left center', duration: 1.2, ease: 'power3.inOut',
            scrollTrigger: { trigger: el, start: 'top 92%', once: true },
          });
        });

        /* The counters tick up once. */
        gsap.utils.toArray('[data-count]').forEach((el) => {
          const end = Number(el.dataset.count);
          const o = { v: 0 };
          gsap.to(o, {
            v: end, duration: 1.7, ease: 'power2.out', snap: { v: 1 },
            onUpdate: () => { el.textContent = String(Math.round(o.v)); },
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          });
        });

        /* The four card photographs drift against the scroll. The range is
           small because they sit side by side — four big travels in one row
           would read as wobble, not depth. */
        gsap.utils.toArray('.fr-pillar__media').forEach((el) => {
          gsap.fromTo(el.querySelector('img'),
            { yPercent: -5, scale: 1.16 },
            {
              yPercent: 5, scale: 1.16, ease: 'none',
              scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
            });
        });
      });

      /* ------------------------------------------------ the pinned shelf
         Desktop only, and only when motion is welcome. Everywhere else the
         same markup is a native scroll-snap carousel — no pin, no transform,
         so a phone never fights the page for the scroll. */
      mm.add('(min-width: 1025px) and (prefers-reduced-motion: no-preference)', () => {
        const shelf = root.current?.querySelector('.fr-shelf');
        const track = root.current?.querySelector('.fr-shelf__track');
        if (!shelf || !track) return;

        shelf.classList.add('is-pinned');
        const travel = () => Math.max(0, track.scrollWidth - shelf.clientWidth);

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: shelf,
            start: 'top top',
            end: () => `+=${travel() + window.innerHeight * 0.35}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        tl.to(track, { x: () => -travel(), ease: 'none' }, 0)
          .fromTo('.fr-shelf__bar', { scaleX: 0 }, { scaleX: 1, ease: 'none' }, 0);

        return () => shelf.classList.remove('is-pinned');
      });

      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener('load', refresh);
      const t = setTimeout(refresh, 900);
      return () => { window.removeEventListener('load', refresh); clearTimeout(t); };
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div className="h26 new-typo n3 fr" ref={root}>
      <SiteNav solidAt={80} skipTo="#fr-form" skipLabel="Skip to franchise form" />

      {/* ============================================================ HERO + FORM */}
      <header className="fr-hero">
        <div className="fr-hero__bg" aria-hidden="true" />
        <div className="fr-hero__veil" aria-hidden="true" />

        <div className="fr-hero__inner">
          {/* Left — the pitch, kept short. The form is the star. */}
          <div className="fr-hero__intro">
            <p className="fr-eyebrow fr-eyebrow--light">Franchise Partner Programme</p>
            <h1 className="fr-hero__title">
              Open your own Cox &amp; Kings, under a name that&apos;s stood since <em>1758</em>.
            </h1>
            <p className="fr-hero__lead">
              Launch a fully-branded Cox &amp; Kings travel store in your city — the
              brand, the technology, the training and an exclusive territory come with
              it. Fill out the form to get started.
            </p>
            <ul className="fr-hero__points">
              {HERO_POINTS.map((p) => (
                <li key={p}><Check size={16} strokeWidth={2.2} aria-hidden="true" /> {p}</li>
              ))}
            </ul>
            <div className="fr-hero__contact">
              <a href={`mailto:${EMAIL}`}><Mail size={15} aria-hidden="true" /> {EMAIL}</a>
            </div>
          </div>

          {/* Right — THE FORM. Above the fold, the primary action on the page. */}
          <div className="fr-formcard" id="fr-form">
            <div className="fr-formcard__head">
              <span className="fr-formcard__eyebrow">Apply now</span>
              <h2 className="fr-formcard__h">Become a franchise partner</h2>
              <p className="fr-formcard__sub">
                Four questions, nothing more. A franchise development manager gets back to you within two working days.
              </p>
            </div>
            <FranchiseForm />
          </div>
        </div>
      </header>

      {/* ================================================= 01 · WHAT YOU GET ==== */}
      <section className="fr-offer" aria-labelledby="fr-offer-h">
        {/* The counter rail rides out of the hero on the same navy, so the two
            read as one block before the page turns to paper. */}
        <div className="fr-rail">
          <dl className="fr-rail__grid" data-stagger>
            {STATS.map((s2) => (
              <div className="fr-rail__stat" key={s2.l}>
                <dt className="fr-rail__n">
                  <span data-count={s2.count}>{s2.n}</span>
                  {s2.sup && <i className="fr-rail__sup">{s2.sup}</i>}
                </dt>
                <dd className="fr-rail__l">{s2.l}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="fr-wrap">
          <header className="fr-mark">
            <div data-lines>
              <p className="fr-index"><span className="fr-index__n">01</span> What you get</p>
              <h2 className="fr-display" id="fr-offer-h">
                <span className="fr-line"><span>What comes with a</span></span>
                <span className="fr-line"><span>Cox &amp; Kings <em>franchise</em>.</span></span>
              </h2>
            </div>
            <p className="fr-mark__lead" data-reveal>
              You own the store and run it. We provide the brand, the territory,
              the systems and the supply behind them.
            </p>
          </header>

          {/* One row of four, not four stacked bands — this section has to stay
              short, so the cards carry the images and the copy stays brief. */}
          <ol className="fr-pillars" data-stagger>
            {PILLARS.map((p2) => (
              <li className="fr-pillar" key={p2.n}>
                <figure className="fr-pillar__media">
                  <img src={p2.src} alt={p2.alt} loading="lazy" decoding="async" />
                  <span className="fr-pillar__n" aria-hidden="true">{p2.n}</span>
                </figure>
                <h3 className="fr-pillar__t">{p2.t}</h3>
                <p className="fr-pillar__b">{p2.b}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ==================================================== 02 · THE SHELF ====
          Pinned on desktop and scrubbed sideways; a scroll-snap carousel
          everywhere else. Same markup either way. */}
      <section className="fr-shelf" aria-labelledby="fr-shelf-h">
        <div className="fr-wrap fr-shelf__head">
          <div data-lines>
            <p className="fr-index fr-index--light"><span className="fr-index__n">02</span> The shelf</p>
            <h2 className="fr-display fr-display--light" id="fr-shelf-h">
              <span className="fr-line"><span>One storefront,</span></span>
              <span className="fr-line"><span>the <em>whole of travel</em>.</span></span>
            </h2>
          </div>
          <p className="fr-shelf__lead" data-reveal>
            Everything here is on your shelf the day you open — so the same customer
            comes back for the visa, the currency and the cover, not only for the trip.
            <span className="fr-shelf__cue" aria-hidden="true">Scroll <ArrowRight size={14} /></span>
          </p>
        </div>

        <div className="fr-shelf__view">
          <ul className="fr-shelf__track">
            {SHELF.map((c, i) => (
              <li
                className={`fr-tile${c.type ? ` fr-tile--type fr-tile--${c.type}` : ''}`}
                key={c.t}
              >
                <span className="fr-tile__ix" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                {c.src && <img className="fr-tile__img" src={c.src} alt={c.alt} loading="lazy" decoding="async" />}
                <div className="fr-tile__cap">
                  <span className="fr-tile__k">{c.k}</span>
                  <h3 className="fr-tile__t">{c.t}</h3>
                  <p className="fr-tile__b">{c.b}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="fr-wrap fr-shelf__foot">
          <span className="fr-shelf__progress" aria-hidden="true"><i className="fr-shelf__bar" /></span>
          <p className="fr-shelf__also">
            Also on the shelf — {ALSO.map((a, i) => (
              <span key={a}>{i > 0 && <i aria-hidden="true"> · </i>}{a}</span>
            ))}
          </p>
        </div>
      </section>

      {/* ================================================== 03 · THE ANSWERS ==== */}
      <section className="fr-answers" aria-labelledby="fr-answers-h">
        <div className="fr-wrap fr-faq__grid">
          <header className="fr-faq__head">
            <p className="fr-faq__eyebrow">FAQ</p>
            <h2 id="fr-answers-h" className="fr-faq__h">Frequently Asked Questions</h2>
            <p className="fr-faq__lede">
              The things people ask before they open one — what it costs, who it
              suits, and what happens after the form.
            </p>
          </header>

          <FranchiseFaq />
        </div>
      </section>

      {/* ============================================================== CLOSING CTA */}
      <section className="fr-cta" aria-labelledby="fr-cta-h">
        <div className="fr-wrap fr-cta__inner">
          <div>
            <p className="fr-eyebrow fr-eyebrow--light">Become a franchise partner</p>
            <h2 className="fr-cta__h" id="fr-cta-h">Ready to open a Cox &amp; Kings?</h2>
            <p className="fr-cta__p">No commitment, no obligation — just a conversation about the opportunity in your city.</p>
          </div>
          <div className="fr-cta__actions">
            <a href="#fr-form" className="h26-btn h26-btn-pill h26-btn-lg">
              Fill out the form <ArrowRight size={15} aria-hidden="true" />
            </a>
            <Link to={CALLBACK} className="fr-cta__link">
              Prefer we schedule a call? <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
