/* ============================================================================
   Cox & Kings India — BECOME A PREFERRED SALES PARTNER   (route: /become-a-partner)

   Rebuilt from scratch, form-first. The old version buried the application form
   at the very bottom behind six GSAP scroll-triggered sections, a parallax hero
   and a scroll-listener sticky bar — which is what made it glitch (elements
   hidden in JS, ScrollTrigger refreshes flashing content in and out).

   This version:
     • The FORM is the hero. It sits top-right, above the fold, visible and
       fillable the instant the page loads — the whole point of the page.
     • Zero scroll-driven JavaScript. No GSAP, no scroll listeners, no sticky
       bar. Every resting state is the visible one, so nothing can flash or get
       stuck. A single CSS load-in on the hero, and hover transitions on cards.
     • Chrome is the shared /new3 <SiteNav /> + <SiteFooter />, and the page is
       wrapped in `h26 new-typo n3` so it inherits the exact homepage tokens
       (Cormorant headings, warm Neutrals scale, brand-blue CTAs, Sienna
       eyebrows).

   Structure — hero(form) → stats → why → who → how → closing CTA → footer.
   Supporting sections live BELOW the form; they inform, they don't gate it.
   ========================================================================== */

import { useState } from 'react';
import {
  Landmark, Layers, TrendingUp, MonitorSmartphone, Briefcase, MapPin,
  Users, Rocket, ShieldCheck, Check, ArrowRight, ArrowUpRight, PhoneCall, Mail,
} from 'lucide-react';
import { SmartLink as Link, CALLBACK } from '../components/ScheduleCall';
import { SiteNav, SiteFooter, CONTACT_CK } from '../components/SiteChrome';
import './PreferredPartner.css';

const EMAIL = 'franchisee@coxandkings.com';

/* -------------------------------------------------------------- the content */

const STATS = [
  { n: '1758', l: 'Established' },
  { n: '260', l: 'Years of travel', sup: 'yrs' },
  { n: '100', l: 'Countries', sup: '+' },
  { n: '25', l: 'Active partners', sup: '+' },
];

const BENEFITS = [
  { icon: Landmark, t: 'Trade on the name', b: 'Open under a globally recognised, heritage-rich brand that inspires instant trust — the credibility of 1758 on your first day.' },
  { icon: Layers, t: 'The whole shop, one platform', b: 'Flights, hotels, cruises, visas and holiday packages sold from one unified system — everything a traveller needs, under a single roof.' },
  { icon: TrendingUp, t: 'Among the best commissions', b: "One of the industry's strongest commission structures, with additional earnings layered on every corporate booking." },
  { icon: MonitorSmartphone, t: 'An integrated tech suite', b: 'Quotation tools, CRM, call recording and MIS dashboards — the back office is built, so your day goes on selling.' },
  { icon: Briefcase, t: 'Higher corporate earnings', b: 'A dedicated commission structure for business travel opens a second, steadier revenue line beyond leisure holidays.' },
  { icon: MapPin, t: 'Leads that come to you', b: 'Listed on the official Cox & Kings Store Locator, so inbound enquiries in your city are routed straight to your door.' },
];

const APPLICANTS = [
  { icon: Users, t: 'Travel professionals', b: 'Agents and consultants ready to trade under a bigger name.' },
  { icon: Briefcase, t: 'Ex-corporates', b: 'Professionals who want to own the business, not only run it.' },
  { icon: Rocket, t: 'Entrepreneurs', b: 'First-timers who want a tech-enabled business, ready to sell.' },
  { icon: ShieldCheck, t: 'GSA / PSA partners', b: 'Established sales & distribution networks looking to expand.' },
];

const STEPS = [
  { n: '01', t: 'Apply', b: 'Send your details in the form — no commitment, no prior travel experience required.' },
  { n: '02', t: 'We call you back', b: 'A partnerships specialist reaches out within 24 hours to understand your goals.' },
  { n: '03', t: 'Onboard & train', b: 'We set up the technology, the supply access and the training you need to trade.' },
  { n: '04', t: 'Go live & earn', b: 'Open under the Cox & Kings name, get listed, and start booking from day one.' },
];

const HERO_POINTS = [
  'The name travellers already trust',
  'One platform that sells everything',
  'A pan-India supply chain',
  'No franchise fee to enquire',
];

const BUSINESS_TYPES = ['Existing travel agency', 'Ex-corporate / professional', 'First-time entrepreneur', 'GSA / PSA network', 'Other'];

/* ------------------------------------------------------------------- form
   Pure controlled state, no side-effects. Submitting swaps the form for a
   confirmation panel in place — the card never changes size abruptly. */
function ApplyForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', city: '', type: '', message: '' });
  const [sent, setSent] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const onSubmit = (e) => { e.preventDefault(); setSent(true); };

  if (sent) {
    return (
      <div className="pp-done" role="status">
        <span className="pp-done__ic" aria-hidden="true"><Check size={26} strokeWidth={2.2} /></span>
        <h3 className="pp-done__h">Thank you — we've got it.</h3>
        <p className="pp-done__p">
          A Cox &amp; Kings partnerships specialist will reach out within 24 hours. In the
          meantime, feel free to call us on {CONTACT_CK.phoneDisplay}.
        </p>
        <a href={CONTACT_CK.phoneHref} className="h26-btn h26-btn-pill h26-btn-lg pp-done__btn">
          <PhoneCall size={15} aria-hidden="true" /> {CONTACT_CK.phoneDisplay}
        </a>
      </div>
    );
  }

  return (
    <form className="pp-form" onSubmit={onSubmit} noValidate>
      <div className="pp-field">
        <label htmlFor="pp-name">Full name</label>
        <input id="pp-name" type="text" required autoComplete="name" placeholder="Your name" value={form.name} onChange={set('name')} />
      </div>
      <div className="pp-field-row">
        <div className="pp-field">
          <label htmlFor="pp-email">Email</label>
          <input id="pp-email" type="email" required autoComplete="email" placeholder="you@email.com" value={form.email} onChange={set('email')} />
        </div>
        <div className="pp-field">
          <label htmlFor="pp-phone">Phone</label>
          <input id="pp-phone" type="tel" required autoComplete="tel" placeholder="+91 00000 00000" value={form.phone} onChange={set('phone')} />
        </div>
      </div>
      <div className="pp-field-row">
        <div className="pp-field">
          <label htmlFor="pp-city">City</label>
          <input id="pp-city" type="text" autoComplete="address-level2" placeholder="Where you'd operate" value={form.city} onChange={set('city')} />
        </div>
        <div className="pp-field">
          <label htmlFor="pp-type">You are</label>
          <select id="pp-type" value={form.type} onChange={set('type')} required>
            <option value="" disabled>Select one</option>
            {BUSINESS_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <div className="pp-field">
        <label htmlFor="pp-msg">Anything we should know <span className="pp-optional">(optional)</span></label>
        <textarea id="pp-msg" rows={2} placeholder="Your experience, goals, or questions" value={form.message} onChange={set('message')} />
      </div>
      <button type="submit" className="h26-btn h26-btn-pill h26-btn-lg pp-form__submit">
        Request a callback <ArrowRight size={15} aria-hidden="true" />
      </button>
      <p className="pp-form__note"><ShieldCheck size={13} aria-hidden="true" /> No commitment · a specialist calls within 24 hours</p>
    </form>
  );
}

export default function PreferredPartner() {
  return (
    <div className="h26 new-typo n3 pp">
      <SiteNav solidAt={80} skipTo="#pp-form" skipLabel="Skip to application form" />

      {/* ============================================================ HERO + FORM */}
      <header className="pp-hero">
        <div className="pp-hero__bg" aria-hidden="true" />
        <div className="pp-hero__veil" aria-hidden="true" />

        <div className="pp-hero__inner">
          {/* The pitch, kept short on purpose — the form is the star. */}
          <div className="pp-hero__intro">
            <p className="pp-eyebrow pp-eyebrow--light">Preferred Sales Partner Programme</p>
            <h1 className="pp-hero__title">
              Build a travel business under a name that&apos;s stood since <em>1758</em>.
            </h1>
            <p className="pp-hero__lead">
              Don&apos;t start from scratch. Trade under the world&apos;s longest-established
              travel name — the brand, the technology and the supply chain come with it.
            </p>
            <ul className="pp-hero__points">
              {HERO_POINTS.map((p) => (
                <li key={p}><Check size={16} strokeWidth={2.2} aria-hidden="true" /> {p}</li>
              ))}
            </ul>
            <div className="pp-hero__contact">
              <a href={CONTACT_CK.phoneHref}><PhoneCall size={15} aria-hidden="true" /> {CONTACT_CK.phoneDisplay}</a>
              <a href={`mailto:${EMAIL}`}><Mail size={15} aria-hidden="true" /> {EMAIL}</a>
            </div>
          </div>

          {/* THE FORM — above the fold, the primary action on the page. */}
          <div className="pp-formcard" id="pp-form">
            <div className="pp-formcard__head">
              <span className="pp-formcard__eyebrow">Apply now</span>
              <h2 className="pp-formcard__h">Become a partner</h2>
              <p className="pp-formcard__sub">
                Leave your details and a partnerships specialist calls you back within 24 hours.
              </p>
            </div>
            <ApplyForm />
          </div>
        </div>
      </header>

      {/* ================================================================= STATS */}
      <section className="pp-stats" aria-label="Cox & Kings at a glance">
        <dl className="pp-stats__grid">
          {STATS.map((s) => (
            <div className="pp-stat" key={s.l}>
              <dt className="pp-stat__n">{s.n}{s.sup && <span className="pp-stat__sup">{s.sup}</span>}</dt>
              <dd className="pp-stat__l">{s.l}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ============================================================ WHY PARTNER */}
      <section className="pp-section pp-why" aria-labelledby="pp-why-h">
        <div className="pp-wrap">
          <header className="pp-head">
            <p className="pp-eyebrow">Why partner with us</p>
            <h2 className="pp-h2" id="pp-why-h">Six reasons it works from day one.</h2>
          </header>
          <ul className="pp-cards">
            {BENEFITS.map(({ icon: Icon, t, b }) => (
              <li className="pp-card" key={t}>
                <span className="pp-card__ic" aria-hidden="true"><Icon size={20} strokeWidth={1.5} /></span>
                <h3 className="pp-card__t">{t}</h3>
                <p className="pp-card__b">{b}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* =========================================================== WHO IT'S FOR */}
      <section className="pp-section pp-who" aria-labelledby="pp-who-h">
        <div className="pp-wrap">
          <header className="pp-head">
            <p className="pp-eyebrow">Who it&apos;s for</p>
            <h2 className="pp-h2" id="pp-who-h">Four ways in. No experience required.</h2>
          </header>
          <ul className="pp-cards pp-cards--4">
            {APPLICANTS.map(({ icon: Icon, t, b }) => (
              <li className="pp-card" key={t}>
                <span className="pp-card__ic" aria-hidden="true"><Icon size={20} strokeWidth={1.5} /></span>
                <h3 className="pp-card__t">{t}</h3>
                <p className="pp-card__b">{b}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============================================================== HOW IT WORKS */}
      <section className="pp-section pp-how" aria-labelledby="pp-how-h">
        <div className="pp-wrap">
          <header className="pp-head">
            <p className="pp-eyebrow">How it works</p>
            <h2 className="pp-h2" id="pp-how-h">From application to open, in four steps.</h2>
          </header>
          <ol className="pp-steps">
            {STEPS.map((s) => (
              <li className="pp-step" key={s.n}>
                <span className="pp-step__n" aria-hidden="true">{s.n}</span>
                <h3 className="pp-step__t">{s.t}</h3>
                <p className="pp-step__b">{s.b}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============================================================== CLOSING CTA */}
      <section className="pp-cta" aria-labelledby="pp-cta-h">
        <div className="pp-wrap pp-cta__inner">
          <div>
            <p className="pp-eyebrow pp-eyebrow--light">Become a partner</p>
            <h2 className="pp-cta__h" id="pp-cta-h">Ready to open a <span className="pp-nowrap">Cox &amp; Kings</span>?</h2>
            <p className="pp-cta__p">No commitment, no obligation — just a conversation about the opportunity.</p>
          </div>
          <div className="pp-cta__actions">
            <a href="#pp-form" className="h26-btn h26-btn-pill h26-btn-lg">
              Apply now <ArrowRight size={15} aria-hidden="true" />
            </a>
            <Link to={CALLBACK} className="pp-cta__link">
              Prefer we schedule the call? <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
