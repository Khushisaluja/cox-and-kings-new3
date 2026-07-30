/* ============================================================================
   Cox & Kings India — FAQ, VARIANT 2.  Route: /faq2

   V1 (/faq) borrowed the /about-us2/team system. V2 rebuilds the same 45
   questions on the TOUR-DETAIL system instead (/tour-detail-japan-5), so the
   help centre reads as the same product as the pages that sell a journey:

     · the hero is .lxjt-hero — ken-burns photograph under the lxjt5 constant
       neutral tint, light eyebrow, Zodiak display title, glass fact pills;
     · a sticky .lxjt-subnav under the header, topic links on the left and the
       one action on the right, scroll-spied like the tour's;
     · the FAQ accordion is the itinerary's .lxjt2-day language: a numbered
       serif node on a connector spine, sienna gradient when open, a card that
       lifts to white, and a body that animates on grid-template-rows.

   The page says what it is and stops. No breadcrumb (there is no listing to go
   back to — the masthead logo is the way home), no section preamble above the
   controls, and no sentence where a label will do. The two controls are a
   plain search field and a plain topic dropdown, side by side on one line.

   Scoped under .fq2, built on the .lx2i tokens. Content is unchanged — the
   same src/data/faq.js both variants share.
   ========================================================================== */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SmartLink as Link, CALLBACK } from '../components/ScheduleCall';
import {
  ArrowRight, ChevronDown, Check, Search, X, ListFilter,
  MessageCircle, PhoneCall, Phone, Mail, Headset,
} from 'lucide-react';
import { FAQ_TOPICS } from '../data/faq';
import { SiteNav, SiteFooter, CONTACT_CK } from '../components/SiteChrome';
/* The tour page's stylesheets, in its own order — .lx2i tokens first, then the
   five tour layers. Every rule below leans on what they define. */
import './Home2026.css';
import './Home2026Improved.css';
import './Luxe2Improved.css';
import './JapanTourLuxe.css';
import './JapanTourLuxe2.css';
import './JapanTourLuxe3.css';
import './JapanTourLuxe4.css';
import './JapanTourLuxe5.css';
import './NewTypography.css';
import './New3.css';
import './Faq2.css';

const sizedUnsplash = (id, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const WHATSAPP =
  'https://wa.me/918556001700?text=Hi%20Cox%20%26%20Kings%2C%20I%20have%20a%20question%20about%20booking%20a%20journey.';

const TOTAL_Q = FAQ_TOPICS.reduce((n, t) => n + t.items.length, 0);

/* Sub-nav labels. The full topic names ("Transport, Visa and Insurance") are
   what the section headers carry, but seven of them do not fit the sub-nav at
   1240px — the last two fell off the end of a scroller nobody would think to
   drag. Same topics, named short enough to all be visible. */
const SHORT = {
  general: 'General',
  'flights-fares': 'Flights',
  'booking-payment': 'Booking',
  'accommodation-meals': 'Stays & meals',
  'transport-visa': 'Visa & transport',
  'tailor-made': 'Tailor-made',
  'cancellation-refunds': 'Cancellations',
};


/* Four ways to reach a person, as the tour page's .lxjt-term cards. One line
   of copy each: the card title already says what it is. */
const HELP_ROUTES = [
  {
    icon: PhoneCall,
    title: 'Call us',
    text: `${CONTACT_CK.phoneDisplay} · 9am–9pm IST, every day.`,
    href: CONTACT_CK.phoneHref,
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    text: 'Message us and get an answer in writing.',
    href: WHATSAPP,
    external: true,
  },
  {
    icon: Headset,
    title: 'Schedule a callback',
    text: 'Pick a time and we will call you.',
    to: CALLBACK,
  },
  {
    icon: Mail,
    title: 'Email us',
    text: `${CONTACT_CK.email} · we reply within a working day.`,
    href: `mailto:${CONTACT_CK.email}`,
  },
];

/* Scroll-reveal, the tour page's hook — but re-observing whenever `dep`
   changes, because filtering swaps whole sections in and out and elements
   mounted after the first pass would otherwise stay invisible. */
function useReveal(dep) {
  useEffect(() => {
    const els = document.querySelectorAll('.fq2 .lx2i-reveal:not(.in)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { els.forEach((e) => e.classList.add('in')); return undefined; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [dep]);
}

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');

/* One question — the /gift-vouchers FAQ row, which is the pattern this site
   already uses for a question list: a hairline rule, the question set in the
   display serif, and a chevron that rotates. Nothing else. */
function Question({ item, open, onToggle, id }) {
  return (
    <li className={`fq2-q${open ? ' is-open' : ''}`}>
      <h3 className="fq2-q__h">
        <button
          type="button"
          className="fq2-q__btn"
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          id={`${id}-btn`}
          onClick={onToggle}
        >
          <span>{item.q}</span>
          <ChevronDown size={18} className="fq2-q__chev" aria-hidden="true" />
        </button>
      </h3>
      <div
        className="fq2-q__body"
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-btn`}
      >
        <div className="fq2-q__bodyin">
          <p className="fq2-q__text">{item.a}</p>
        </div>
      </div>
    </li>
  );
}

export default function Faq2() {
  const [topic, setTopic] = useState('all');
  const [query, setQuery] = useState('');
  /* Every answer starts closed — 45 open panels is not a page. */
  const [openKey, setOpenKey] = useState(null);
  const [activeSection, setActiveSection] = useState(FAQ_TOPICS[0].id);
  const [pickOpen, setPickOpen] = useState(false);
  const pickRef = useRef(null);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  /* Topic filter and keyword search compose: the dropdown narrows the
     sections, the search narrows the questions inside whatever is left. */
  const shown = useMemo(() => {
    const q = norm(query).trim();
    const terms = q ? q.split(/\s+/).filter(Boolean) : [];
    return FAQ_TOPICS
      .filter((t) => topic === 'all' || t.id === topic)
      .map((t) => ({
        ...t,
        items: terms.length
          ? t.items.filter((it) => {
            const hay = norm(`${it.q} ${it.a}`);
            return terms.every((term) => hay.includes(term));
          })
          : t.items,
      }))
      .filter((t) => t.items.length);
  }, [topic, query]);

  const count = shown.reduce((n, t) => n + t.items.length, 0);
  const filtering = topic !== 'all' || query.trim() !== '';
  const shownKey = shown.map((t) => t.id).join(',');

  /* A search that lands on exactly one answer opens it — the traveller has
     already told us which question they meant. Any other change closes
     everything rather than leaving a stale panel open under new results. */
  useEffect(() => {
    if (count === 1) setOpenKey(`${shown[0].id}:${shown[0].items[0].q}`);
    else setOpenKey(null);
  }, [topic, query]); // eslint-disable-line react-hooks/exhaustive-deps

  useReveal(`${topic}|${query}`);

  /* Sub-nav spy. Only meaningful while every section is on the page; once a
     topic is picked, that topic IS the active one. */
  useEffect(() => {
    if (filtering) { setActiveSection(shown[0]?.id ?? null); return undefined; }
    const els = FAQ_TOPICS.map((t) => document.getElementById(t.id)).filter(Boolean);
    if (!els.length) return undefined;
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (vis[0]) setActiveSection(vis[0].target.id);
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.2, 0.6, 1] }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
    /* `shown` is a fresh array every render; key the effect on what actually
       changes which sections exist, or the observer would rebuild constantly. */
  }, [filtering, shownKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const scrollToId = useCallback((id) => {
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, []);

  const navClick = useCallback((href) => (e) => {
    if (!href.startsWith('#')) return;
    e.preventDefault();
    const id = href.slice(1);
    /* A sub-nav link is a jump through the whole list, so it clears any filter
       first — otherwise it would point at a section that isn't rendered. */
    if (FAQ_TOPICS.some((t) => t.id === id)) { setTopic('all'); setQuery(''); }
    scrollToId(id);
  }, [scrollToId]);

  const onTopic = useCallback((v) => {
    setTopic(v);
    setPickOpen(false);
    if (v !== 'all') scrollToId(v);
  }, [scrollToId]);

  /* Close the topic menu on outside click / Escape — the same handling the
     journeys sort dropdown uses. */
  useEffect(() => {
    if (!pickOpen) return undefined;
    const onDoc = (e) => { if (pickRef.current && !pickRef.current.contains(e.target)) setPickOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setPickOpen(false); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [pickOpen]);

  const reset = useCallback(() => { setTopic('all'); setQuery(''); }, []);

  return (
    <div className="lx2i lxjt lxjt2 lxjt3 lxjt4 lxjt5 fq2">
      <div className="lx2i-grain" aria-hidden="true" />
      <SiteNav />

      <main id="main">
        {/* ================= HERO (the tour page's, verbatim) ================= */}
        <section className="lxjt-hero">
          {/* A wing above the clouds — the travel moment the questions precede. */}
          <div
            className="lxjt-hero__bg"
            style={{ backgroundImage: `url(${sizedUnsplash('1436491865332-7a61a109cc05', 1900)})` }}
            aria-hidden="true"
          />
          <div className="lxjt-hero__veil" aria-hidden="true" />
          <div className="lx2i-container lxjt-hero__inner">
            <div className="lxjt-hero__content lx2i-fade" style={{ '--d': '.1s' }}>
              <span className="lx2i-eyebrow lx2i-eyebrow--light">Cox &amp; Kings India</span>
              <h1 className="lxjt-hero__title">
                Frequently asked <em className="lxjt-hero__accent">questions</em>
              </h1>
              <p className="lxjt-hero__lead">
                Booking, flights, stays, visas, changes and refunds — answered plainly.
              </p>

              {/* The search sits in the hero, where a help centre's search
                  belongs: it is the first thing to reach for, and putting it
                  down with the list meant scrolling past the answers to find
                  the tool for finding answers. */}
              <div className="fq2-hsearch">
                <Search size={18} aria-hidden="true" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={`Search ${TOTAL_Q} questions`}
                  aria-label="Search questions"
                />
                {query && (
                  <button
                    type="button"
                    className="fq2-hsearch__clear"
                    onClick={() => setQuery('')}
                    aria-label="Clear search"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
              {/* Results are below the fold, so the count answers "did that do
                  anything?" without making the visitor scroll to find out. */}
              {query.trim() && (
                <p className="fq2-hsearch__count" aria-live="polite">
                  {count === 0
                    ? 'No matches'
                    : `${count} ${count === 1 ? 'question' : 'questions'} below`}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* ===================== STICKY SUB-NAV ===================== */}
        <nav className="lxjt-subnav" aria-label="FAQ topics">
          <div className="lx2i-container lxjt-subnav__inner">
            <ul>
              {FAQ_TOPICS.map((t) => (
                <li key={t.id}>
                  <a
                    href={`#${t.id}`}
                    onClick={navClick(`#${t.id}`)}
                    className={activeSection === t.id ? 'is-active' : ''}
                  >
                    {SHORT[t.id] ?? t.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* ========================= THE ANSWERS =========================
            Search lives in the hero; what is left here is the topic filter,
            the running count and a way out of both. */}
        <section className="fq2-answers" id="questions">
          <div className="lx2i-container">
            <div className="fq2-bar">
              {/* A real listbox, not a native <select>. The options list of a
                  <select> is drawn by the operating system — it cannot take
                  the site's paper, radii or blue, so it was the one control
                  on the page that looked like it came from somewhere else.
                  This is the journeys sort dropdown (.jl-sort), rebuilt on
                  this page's tokens: a pill trigger, a popover panel, and a
                  check against the option in force. */}
              <div className="fq2-pick" ref={pickRef}>
                <button
                  type="button"
                  className={`fq2-pick__btn${pickOpen ? ' is-open' : ''}`}
                  aria-haspopup="listbox"
                  aria-expanded={pickOpen}
                  onClick={() => setPickOpen((o) => !o)}
                >
                  <ListFilter size={15} aria-hidden="true" />
                  <span>{topic === 'all' ? 'All topics' : FAQ_TOPICS.find((t) => t.id === topic)?.name}</span>
                  <ChevronDown size={15} className="fq2-pick__chev" aria-hidden="true" />
                </button>

                {pickOpen && (
                  <ul className="fq2-pick__pop" role="listbox" aria-label="Filter by topic">
                    <li>
                      <button
                        type="button"
                        role="option"
                        aria-selected={topic === 'all'}
                        className={`fq2-pick__opt${topic === 'all' ? ' is-on' : ''}`}
                        onClick={() => onTopic('all')}
                      >
                        All topics
                        {topic === 'all' && <Check size={15} aria-hidden="true" />}
                      </button>
                    </li>
                    {FAQ_TOPICS.map((t) => (
                      <li key={t.id}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={topic === t.id}
                          className={`fq2-pick__opt${topic === t.id ? ' is-on' : ''}`}
                          onClick={() => onTopic(t.id)}
                        >
                          {t.name}
                          {topic === t.id && <Check size={15} aria-hidden="true" />}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* No count here: the hero placeholder states the total and the
                  line under the hero search states the filtered number, both
                  within a screen of this bar. */}
              {filtering && (
                <button type="button" className="fq2-reset" onClick={reset}>
                  <X size={13} /> Clear
                </button>
              )}
            </div>

            {count === 0 && (
              <div className="fq2-empty">
                <span className="fq2-empty__ic"><Search size={22} strokeWidth={1.7} /></span>
                <h2>No matches for &ldquo;{query.trim()}&rdquo;</h2>
                <p>Try a plainer word — refund, visa, deposit — or ask us directly.</p>
                <div className="fq2-empty__actions">
                  <button type="button" className="lx2i-btn lx2i-btn--outline" onClick={reset}>
                    Clear
                  </button>
                  <Link to={CALLBACK} className="lx2i-btn lx2i-btn--secondary">
                    Ask an expert <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            )}

            {shown.map((t) => (
              <section className="fq2-topic" id={t.id} key={t.id} aria-labelledby={`h-${t.id}`}>
                {/* No count beside the name — the numbered nodes below already
                    show how many, and the toolbar carries the running total. */}
                <header className="fq2-topic__head">
                  <h2 className="fq2-topic__name" id={`h-${t.id}`}>{t.name}</h2>
                </header>

                <ul className="fq2-qs">
                  {t.items.map((item, i) => {
                    const key = `${t.id}:${item.q}`;
                    return (
                      <Question
                        key={item.q}
                        item={item}
                        id={`${t.id}-${i}`}
                        open={openKey === key}
                        onToggle={() => setOpenKey(openKey === key ? null : key)}
                      />
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        </section>

        {/* =================== STILL STUCK — the help routes ===================
            The policies section's card language (.lxjt-term), pointed at people
            instead of clauses. */}
        <section className="lxjt-terms fq2-help" id="help">
          <div className="lx2i-container">
            <div className="lxjt-head lx2i-reveal">
              <h2 className="lx2i-h2">Ask a <strong>person</strong></h2>
            </div>
            <div className="lxjt-terms__grid fq2-help__grid lx2i-reveal">
              {HELP_ROUTES.map(({ icon: Icon, title, text, href, to, external }) => {
                const inner = (
                  <>
                    <span className="lxjt-term__ic"><Icon size={20} strokeWidth={1.7} /></span>
                    <div className="lxjt-term__txt">
                      <strong>{title}</strong>
                      <p>{text}</p>
                    </div>
                    <ArrowRight size={16} className="fq2-term__go" aria-hidden="true" />
                  </>
                );
                return to ? (
                  <Link key={title} to={to} className="lxjt-term fq2-term">{inner}</Link>
                ) : (
                  <a
                    key={title}
                    href={href}
                    className="lxjt-term fq2-term"
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    {inner}
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* ============================ FINAL CTA ============================ */}
        <section className="lx2i-cta">
          <div
            className="lx2i-cta__bg"
            style={{ backgroundImage: `url(${sizedUnsplash('1493976040374-85c8e12f0c0e', 1800)})` }}
          />
          <div className="lx2i-cta__veil" />
          <div className="lx2i-container lx2i-cta__inner lx2i-reveal">
            <h2 className="lx2i-cta__title">Still have a <strong>question?</strong></h2>
            <p className="lx2i-cta__sub">
              Talk to a travel expert. They will price it, plan it, and tell you exactly
              what is included.
            </p>
            <div className="lx2i-cta__actions">
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="lx2i-btn lx2i-btn--secondary lx2i-btn--lg"
              >
                <MessageCircle size={17} /> WhatsApp us
              </a>
              <Link to={CALLBACK} className="lx2i-btn lx2i-btn--glass lx2i-btn--lg">
                <PhoneCall size={16} /> Schedule a callback
              </Link>
            </div>
            <p className="lx2i-cta__hours">
              <Phone size={13} /> {CONTACT_CK.phoneDisplay} · 9am–9pm IST, every day
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
