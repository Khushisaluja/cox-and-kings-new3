/* ============================================================================
   Cox & Kings India — BECOME A FRANCHISE PARTNER   (route: /franchise)

   Form-first, minimal — same shape as /collaborate and /become-a-partner. The
   FORM is the hero: top-right, above the fold, fillable the instant the page
   loads. Everything below informs; nothing gates the form. The one job of the
   page is "fill out the form below to get started".

   The form asks four things and nothing more — name, email, city, and where
   you're coming from. No phone number anywhere on this page: the enquiry is
   answered by email, which is also the only contact channel the page shows.

   Below the form the page is browsable, in the shape Thomas Cook's franchise
   page uses: what the business IS (why), what you SELL (our products), how you
   GET there (steps), whether you QUALIFY (who can apply), and the questions
   everyone asks (FAQ) — so a visitor who isn't ready to fill the form still has
   somewhere to go before they leave.

   How this differs from the two sibling partner pages:
     · /become-a-partner  → Preferred SALES Partner: agents/consultants who
                             sell under the brand (no storefront, no franchise fee).
     · /collaborate        → creators, brands & press who CREATE with the brand.
     · /franchise (this)   → a full, physically-branded Cox & Kings FRANCHISE
                             store: an exclusive territory, store setup, the
                             technology, training and supply chain — a business
                             you own and operate under the name.

   Zero scroll-driven JavaScript — one CSS load-in on the hero, hover
   transitions on cards, and a native <details> accordion for the FAQ; every
   resting state is the visible one.

   COLOUR — only the design.md palette (declared locally in Franchise.css).
   Chrome is the shared <SiteNav /> + <SiteFooter />; the `h26 new-typo n3`
   wrapper gives Cormorant Garamond display + Work Sans body.
   ========================================================================== */

import { useState } from 'react';
import {
  Landmark, MapPin, Store, MonitorSmartphone, Check, ArrowRight, ArrowUpRight,
  Mail, ShieldCheck, Send, Plus, Globe2, Compass, Plane, BedDouble, Ship,
  FileCheck2, Banknote, Users, GraduationCap, Gift, Heart,
} from 'lucide-react';
import { SmartLink as Link, CALLBACK } from '../components/ScheduleCall';
import { SiteNav, SiteFooter } from '../components/SiteChrome';
import './Franchise.css';

/* The franchise desk's own inbox — verified against the live Cox & Kings
   franchise page (coxandkings.com/become-a-franchisee), which lists
   franchisee@coxandkings.com. NOT "franchise@" — that address is not the one
   the business publishes. /become-a-partner uses the same constant value. */
const EMAIL = 'franchisee@coxandkings.com';

/* -------------------------------------------------------------- the content */

const STATS = [
  { n: '1758', l: 'Established' },
  { n: '267', l: 'Years of travel', sup: 'yrs' },
  { n: '100', l: 'Countries', sup: '+' },
  { n: '20', l: 'Franchise stores', sup: '+' },
];

const WHY = [
  { icon: Landmark, t: 'Trade on the name', b: 'Open under a globally recognised, heritage-rich brand that inspires instant trust — the credibility of 1758 from your very first day.' },
  { icon: MapPin, t: 'An exclusive territory', b: 'A protected catchment that’s yours alone — no internal competition, so every enquiry in your area comes to your door.' },
  { icon: Store, t: 'A store, ready to run', b: 'Location guidance, design, branding, fit-out and launch marketing — the outlet is set up for you, so you open ready to trade.' },
  { icon: MonitorSmartphone, t: 'The full tech & supply stack', b: 'One platform sells flights, hotels, cruises, visas and holidays, backed by CRM, MIS dashboards and ongoing staff training.' },
];

/* OUR PRODUCTS — the shelf a franchise store actually trades. Twelve lines in
   a bordered grid, so it reads as an inventory rather than another card row. */
const PRODUCTS = [
  { icon: Globe2, t: 'International holidays', b: 'Escorted group tours and private, tailor-made journeys across 100+ countries.' },
  { icon: Compass, t: 'India & short breaks', b: 'Weekend escapes, family holidays and the whole of India, in every season.' },
  { icon: Plane, t: 'Flights', b: 'Domestic and international air on every major carrier, ticketed in-store.' },
  { icon: BedDouble, t: 'Hotels & resorts', b: 'A global hotel and resort inventory, bookable at negotiated trade rates.' },
  { icon: Ship, t: 'Cruises', b: 'Ocean, river and expedition sailings with the world’s leading cruise lines.' },
  { icon: FileCheck2, t: 'Visa & passport services', b: 'Documentation, appointments and end-to-end visa handling for your walk-ins.' },
  { icon: Banknote, t: 'Foreign exchange', b: 'Currency and multi-currency forex cards for every outbound traveller you serve.' },
  { icon: ShieldCheck, t: 'Travel insurance', b: 'Cover for individuals, families, students and business travellers.' },
  { icon: Users, t: 'Corporate & MICE', b: 'Meetings, incentives, conferences and exhibitions for the businesses on your high street.' },
  { icon: GraduationCap, t: 'Student & education travel', b: 'School groups, study tours and student journeys — a reliable seasonal earner.' },
  { icon: Heart, t: 'Honeymoons & celebrations', b: 'Honeymoons, anniversaries and destination-wedding groups, planned end to end.' },
  { icon: Gift, t: 'Gift vouchers', b: 'Cox & Kings gift cards — often the very first sale a new store makes.' },
];

const STEPS = [
  { n: '01', t: 'Apply', b: 'Send your details in the form — no commitment, and no prior travel experience required.' },
  { n: '02', t: 'Meet & assess', b: 'A franchise development manager discusses your city, the territory, investment and fit within two working days.' },
  { n: '03', t: 'Set up & train', b: 'We handle the store fit-out, install the technology and train you and your team to trade.' },
  { n: '04', t: 'Launch & grow', b: 'Open under the Cox & Kings name with launch marketing, and keep growing with continuing head-office support.' },
];

/* WHO CAN APPLY — the profiles that work, then the practical numbers beside
   them so nobody has to write in to find out whether they're in range. */
const ELIGIBILITY = [
  'Travel agents ready to trade under a stronger name',
  'Airline, hotel or hospitality professionals starting out on their own',
  'First-time entrepreneurs with a local network and a high-street site',
  'Investors looking for an owner-run retail business',
  'Anyone who can commit to running the store day to day',
];

const FACTS = [
  { k: 'Store size', v: '250–500 sq ft, high street or mall' },
  { k: 'Investment', v: '₹15–50 lakh, by city and catchment' },
  { k: 'Your team', v: '2–4 travel consultants, trained by us' },
  { k: 'Territory', v: 'Exclusive, agreed before you sign' },
  { k: 'Time to open', v: 'Typically 8–12 weeks from applying' },
  { k: 'Experience', v: 'Helpful, but genuinely not required' },
];

const FAQS = [
  {
    q: 'Do I need experience in travel to apply?',
    a: 'No. A good number of our franchise partners come from outside the industry — corporate careers, retail, family businesses. What matters more is a strong local network, a suitable location and the commitment to run the store yourself. The product training, the systems training and the selling skills all come from us.',
  },
  {
    q: 'What does the investment actually cover?',
    a: 'The franchise fee, the store fit-out and branding, the full technology stack, training for you and your team, and your launch marketing — plus the working capital to trade from day one. Your franchise development manager breaks the figure down line by line for your specific city before anything is signed.',
  },
  {
    q: 'Is the territory really exclusive?',
    a: 'Yes. Your catchment is mapped and agreed in writing before you sign, and we do not open a second Cox & Kings outlet inside it. Every enquiry generated in your territory — walk-in, phone or online — routes to your store.',
  },
  {
    q: 'What can I sell from the store?',
    a: 'Everything listed under Our products above: international and India holidays, flights, hotels, cruises, visas, foreign exchange, insurance, corporate and MICE business, student travel and gift vouchers. It is a one-stop travel shop, which is what makes the catchment worth owning.',
  },
  {
    q: 'How long does it take to open?',
    a: 'Typically eight to twelve weeks from your application — a fortnight or so for the assessment and territory agreement, then site finalisation, fit-out, technology installation and training, ending with a launch marketing push in your city.',
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
    a: 'Often, yes — that is one of the most common routes in. Subject to the site meeting brand standards and the territory being open, an existing agency can be rebranded as a Cox & Kings store, bringing its customer book across onto our systems and supply.',
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
  'A supply chain across 100+ countries',
];

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
        <select id="fr-source" value={form.source} onChange={set('source')} required>
          <option value="" disabled>Select one</option>
          {SOURCE.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
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

export default function Franchise() {
  return (
    <div className="h26 new-typo n3 fr">
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

      {/* ================================================================= STATS */}
      <section className="fr-stats" aria-label="Cox & Kings at a glance">
        <dl className="fr-stats__grid">
          {STATS.map((s) => (
            <div className="fr-stat" key={s.l}>
              <dt className="fr-stat__n">{s.n}{s.sup && <span className="fr-stat__sup">{s.sup}</span>}</dt>
              <dd className="fr-stat__l">{s.l}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ============================================================ WHY FRANCHISE */}
      <section className="fr-section fr-why" aria-labelledby="fr-why-h">
        <div className="fr-wrap">
          <header className="fr-head">
            <p className="fr-eyebrow">Why a Cox &amp; Kings franchise</p>
            <h2 className="fr-h2" id="fr-why-h">A business you own, on foundations we&apos;ve built since 1758.</h2>
          </header>
          <ul className="fr-cards fr-cards--4">
            {WHY.map(({ icon: Icon, t, b }) => (
              <li className="fr-card" key={t}>
                <span className="fr-card__ic" aria-hidden="true"><Icon size={20} strokeWidth={1.5} /></span>
                <h3 className="fr-card__t">{t}</h3>
                <p className="fr-card__b">{b}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============================================================ OUR PRODUCTS
          The shelf, laid out as a bordered inventory grid rather than a fourth
          row of cards — a visitor should be able to scan what the store sells. */}
      <section className="fr-section fr-prod" aria-labelledby="fr-prod-h">
        <div className="fr-wrap">
          <header className="fr-head">
            <p className="fr-eyebrow">Our products</p>
            <h2 className="fr-h2" id="fr-prod-h">One storefront, the whole of travel.</h2>
            <p className="fr-head__lead">
              A Cox &amp; Kings franchise isn&apos;t a holiday counter. Everything below
              is on your shelf from the day you open — so the same customer comes back
              for the visa, the currency and the insurance, not just the trip.
            </p>
          </header>
          <ul className="fr-prodgrid">
            {PRODUCTS.map(({ icon: Icon, t, b }) => (
              <li className="fr-prod__item" key={t}>
                <span className="fr-prod__ic" aria-hidden="true"><Icon size={19} strokeWidth={1.5} /></span>
                <div>
                  <h3 className="fr-prod__t">{t}</h3>
                  <p className="fr-prod__b">{b}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============================================================== HOW IT WORKS */}
      <section className="fr-section fr-how" aria-labelledby="fr-how-h">
        <div className="fr-wrap">
          <header className="fr-head">
            <p className="fr-eyebrow">How it works</p>
            <h2 className="fr-h2" id="fr-how-h">From application to open, in four steps.</h2>
          </header>
          <ol className="fr-steps">
            {STEPS.map((s) => (
              <li className="fr-step" key={s.n}>
                <span className="fr-step__n" aria-hidden="true">{s.n}</span>
                <h3 className="fr-step__t">{s.t}</h3>
                <p className="fr-step__b">{s.b}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============================================================= WHO CAN APPLY
          Profiles on the left, the practical numbers on the right, so the two
          questions everyone has — "is this for someone like me?" and "what does
          it take?" — are answered side by side. */}
      <section className="fr-section fr-who" aria-labelledby="fr-who-h">
        <div className="fr-wrap fr-who__inner">
          <div className="fr-who__copy">
            <p className="fr-eyebrow">Who can apply</p>
            <h2 className="fr-h2" id="fr-who-h">You don&apos;t need to have sold a holiday before.</h2>
            <p className="fr-who__lead">
              We look for the person, the location and the commitment — the travel
              knowledge is ours to teach. Franchise partners have joined us from all
              of these starting points.
            </p>
            <ul className="fr-who__list">
              {ELIGIBILITY.map((e) => (
                <li key={e}><Check size={16} strokeWidth={2.2} aria-hidden="true" /> {e}</li>
              ))}
            </ul>
          </div>

          <aside className="fr-who__panel">
            <h3 className="fr-who__panel-h">What a store typically takes</h3>
            <dl className="fr-facts">
              {FACTS.map(({ k, v }) => (
                <div className="fr-fact" key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            <p className="fr-who__panel-note">
              Indicative only — the real numbers depend on your city and catchment,
              and we walk through them with you before anything is signed.
            </p>
          </aside>
        </div>
      </section>

      {/* ===================================================================== FAQ
          Native <details>, so it works with no JavaScript, is searchable by the
          browser's find-in-page, and needs no state of its own. */}
      <section className="fr-section fr-faq" aria-labelledby="fr-faq-h">
        <div className="fr-wrap">
          <header className="fr-head">
            <p className="fr-eyebrow">Questions</p>
            <h2 className="fr-h2" id="fr-faq-h">The things everyone asks first.</h2>
          </header>
          <div className="fr-faq__list">
            {FAQS.map(({ q, a }) => (
              <details className="fr-faq__item" key={q}>
                <summary className="fr-faq__q">
                  <span>{q}</span>
                  <span className="fr-faq__mark" aria-hidden="true"><Plus size={17} strokeWidth={2} /></span>
                </summary>
                <p className="fr-faq__a">{a}</p>
              </details>
            ))}
          </div>
          <p className="fr-faq__more">
            Still something unanswered? Write to{' '}
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a> and a franchise development
            manager will answer it directly.
          </p>
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
