/* ============================================================================
   Cox & Kings India — BECOME A FRANCHISE PARTNER   (route: /franchise)

   Form-first, minimal — same shape as /collaborate and /become-a-partner. The
   FORM is the hero: top-right, above the fold, fillable the instant the page
   loads. Everything below informs; nothing gates the form. The one job of the
   page is "fill out the form below to get started".

   How this differs from the two sibling partner pages:
     · /become-a-partner  → Preferred SALES Partner: agents/consultants who
                             sell under the brand (no storefront, no franchise fee).
     · /collaborate        → creators, brands & press who CREATE with the brand.
     · /franchise (this)   → a full, physically-branded Cox & Kings FRANCHISE
                             store: an exclusive territory, store setup, the
                             technology, training and supply chain — a business
                             you own and operate under the name.

   Zero scroll-driven JavaScript — one CSS load-in on the hero, hover
   transitions on cards; every resting state is the visible one.

   COLOUR — only the design.md palette (declared locally in Franchise.css).
   Chrome is the shared <SiteNav /> + <SiteFooter />; the `h26 new-typo n3`
   wrapper gives Cormorant Garamond display + Work Sans body.
   ========================================================================== */

import { useState } from 'react';
import {
  Landmark, MapPin, Store, MonitorSmartphone, Check, ArrowRight, ArrowUpRight,
  PhoneCall, Mail, ShieldCheck, Send,
} from 'lucide-react';
import { SmartLink as Link, CALLBACK } from '../components/ScheduleCall';
import { SiteNav, SiteFooter, CONTACT_CK } from '../components/SiteChrome';
import './Franchise.css';

const EMAIL = 'franchise@coxandkings.com';

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

const STEPS = [
  { n: '01', t: 'Apply', b: 'Send your details in the form — no commitment, and no prior travel experience required.' },
  { n: '02', t: 'Meet & assess', b: 'A franchise development manager discusses your city, the territory, investment and fit within two working days.' },
  { n: '03', t: 'Set up & train', b: 'We handle the store fit-out, install the technology and train you and your team to trade.' },
  { n: '04', t: 'Launch & grow', b: 'Open under the Cox & Kings name with launch marketing, and keep growing with continuing head-office support.' },
];

const HERO_POINTS = [
  'A protected, exclusive territory',
  'Full store setup & branding',
  'End-to-end technology & training',
  'A supply chain across 100+ countries',
];

const INVESTMENT = ['Under ₹15 lakh', '₹15–30 lakh', '₹30–50 lakh', 'Above ₹50 lakh', 'Prefer to discuss'];
const BACKGROUND = ['Existing travel agency', 'Ex-corporate / professional', 'First-time entrepreneur', 'Investor', 'Other'];

/* ------------------------------------------------------------------- form
   Pure controlled state, no side-effects. Submitting swaps the form for a
   confirmation panel in place. */
function FranchiseForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', city: '', investment: '', background: '', message: '' });
  const [sent, setSent] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const onSubmit = (e) => { e.preventDefault(); setSent(true); };

  if (sent) {
    return (
      <div className="fr-done" role="status">
        <span className="fr-done__ic" aria-hidden="true"><Check size={26} strokeWidth={2.2} /></span>
        <h3 className="fr-done__h">Thank you — we&apos;ve got it.</h3>
        <p className="fr-done__p">
          A Cox &amp; Kings franchise development manager will reach out within two
          working days. In the meantime, feel free to call us on {CONTACT_CK.phoneDisplay}.
        </p>
        <a href={CONTACT_CK.phoneHref} className="h26-btn h26-btn-pill h26-btn-lg fr-done__btn">
          <PhoneCall size={15} aria-hidden="true" /> {CONTACT_CK.phoneDisplay}
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
      <div className="fr-field-row">
        <div className="fr-field">
          <label htmlFor="fr-email">Email</label>
          <input id="fr-email" type="email" required autoComplete="email" placeholder="you@email.com" value={form.email} onChange={set('email')} />
        </div>
        <div className="fr-field">
          <label htmlFor="fr-phone">Phone</label>
          <input id="fr-phone" type="tel" required autoComplete="tel" placeholder="+91 00000 00000" value={form.phone} onChange={set('phone')} />
        </div>
      </div>
      <div className="fr-field-row">
        <div className="fr-field">
          <label htmlFor="fr-city">City / preferred territory</label>
          <input id="fr-city" type="text" autoComplete="address-level2" placeholder="Where you'd open" value={form.city} onChange={set('city')} />
        </div>
        <div className="fr-field">
          <label htmlFor="fr-invest">Investment capacity</label>
          <select id="fr-invest" value={form.investment} onChange={set('investment')} required>
            <option value="" disabled>Select one</option>
            {INVESTMENT.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <div className="fr-field">
        <label htmlFor="fr-bg">Your background</label>
        <select id="fr-bg" value={form.background} onChange={set('background')}>
          <option value="" disabled>Select one</option>
          {BACKGROUND.map((t) => <option key={t} value={t}>{t}</option>)}
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
              <a href={CONTACT_CK.phoneHref}><PhoneCall size={15} aria-hidden="true" /> {CONTACT_CK.phoneDisplay}</a>
              <a href={`mailto:${EMAIL}`}><Mail size={15} aria-hidden="true" /> {EMAIL}</a>
            </div>
          </div>

          {/* Right — THE FORM. Above the fold, the primary action on the page. */}
          <div className="fr-formcard" id="fr-form">
            <div className="fr-formcard__head">
              <span className="fr-formcard__eyebrow">Apply now</span>
              <h2 className="fr-formcard__h">Become a franchise partner</h2>
              <p className="fr-formcard__sub">
                Fill out the form below and a franchise development manager gets back to you within two working days.
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
