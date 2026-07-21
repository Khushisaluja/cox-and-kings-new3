/* ============================================================================
   Cox & Kings India — COLLABORATE WITH US   (route: /collaborate)

   Form-first, minimal — built to mirror /become-a-partner. The FORM is the
   hero: it sits top-right, above the fold, fillable the instant the page loads.
   Everything below it informs; nothing gates the form. The one job of the page
   is "fill out the form below to get started".

   Distinct from /become-a-partner (that recruits sales agents & franchisees).
   This one is for the creators, brands, publishers and ground partners who want
   to CREATE with the brand — hosted journeys, co-branded campaigns, press
   access, hospitality partnerships.

   Zero scroll-driven JavaScript — no GSAP, no scroll listeners. One CSS load-in
   on the hero, hover transitions on cards; every resting state is the visible
   one, so nothing flashes or sticks.

   COLOUR — only the design.md palette (Voyager Blue, Sienna Flame, warm
   Neutrals, Neutrals-Dark navy, Rating Gold). The page declares those exact
   hexes locally in Collaborate.css and uses nothing else. Chrome is the shared
   <SiteNav /> + <SiteFooter />; the `h26 new-typo n3` wrapper gives Cormorant
   Garamond display + Work Sans body.
   ========================================================================== */

import { useState } from 'react';
import {
  Camera, Sparkles, Newspaper, Building2, Check, ArrowRight, ArrowUpRight,
  PhoneCall, Mail, ShieldCheck, Send,
} from 'lucide-react';
import { SmartLink as Link, CALLBACK } from '../components/ScheduleCall';
import { SiteNav, SiteFooter, CONTACT_CK } from '../components/SiteChrome';
import './Collaborate.css';

const EMAIL = 'partnerships@coxandkings.com';

/* -------------------------------------------------------------- the content */

const STATS = [
  { n: '1758', l: 'Established' },
  { n: '267', l: 'Years of travel', sup: 'yrs' },
  { n: '100', l: 'Countries', sup: '+' },
  { n: '2,400', l: 'Traveller reviews', sup: '+' },
];

const WAYS = [
  { icon: Camera, t: 'Creators & influencers', b: 'Fully-hosted journeys built around your audience and your voice — reels, films and stills, with our specialists handling every logistic so you stay behind the lens.' },
  { icon: Sparkles, t: 'Brands & co-marketing', b: 'Co-branded campaigns, product integrations and experiential activations under a 1758 name that signals trust the moment it appears.' },
  { icon: Newspaper, t: 'Media & press', b: 'Press trips, expert commentary from our destination specialists, and first-look access to signature itineraries — everything an editor needs.' },
  { icon: Building2, t: 'Hospitality & DMCs', b: 'Hotels, airlines, boutique stays and ground partners who want to feature in the journeys we sell across 100+ countries.' },
];

const STEPS = [
  { n: '01', t: 'Tell us the idea', b: 'Send the shape of it in the form — a destination, an audience, a campaign, or just a hunch. No deck required.' },
  { n: '02', t: 'We shape it together', b: 'A partnerships lead and a destination specialist build the concept, the route and the deliverables with you.' },
  { n: '03', t: 'We handle the ground', b: 'Permits, access, stays and the moments that photograph — arranged by the people who have done it since 1758.' },
  { n: '04', t: 'We publish & amplify', b: 'Your work goes out across our owned channels and 2,400+ traveller community. One story, many rooms.' },
];

const HERO_POINTS = [
  'Fully-hosted creator journeys',
  'Co-branded brand campaigns',
  'Press trips & editorial access',
  'Hotel, airline & DMC partnerships',
];

const COLLAB_TYPES = ['Creator / Influencer', 'Brand partnership', 'Media / Press', 'Hospitality / DMC', 'Something else'];
const PLATFORMS = ['Instagram', 'YouTube', 'TikTok', 'Print / Editorial', 'Podcast', 'Brand / Agency', 'Hotel / DMC', 'Other'];

/* ------------------------------------------------------------------- form
   Pure controlled state, no side-effects. Submitting swaps the form for a
   confirmation panel in place. */
function CollabForm() {
  const [form, setForm] = useState({ name: '', email: '', org: '', type: '', platform: '', reach: '', message: '' });
  const [sent, setSent] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const onSubmit = (e) => { e.preventDefault(); setSent(true); };

  if (sent) {
    return (
      <div className="cw-done" role="status">
        <span className="cw-done__ic" aria-hidden="true"><Check size={26} strokeWidth={2.2} /></span>
        <h3 className="cw-done__h">Thank you — it&apos;s landed.</h3>
        <p className="cw-done__p">
          A partnerships lead will read this personally and reply within two working
          days. In a hurry? Write to {EMAIL}.
        </p>
        <a href={`mailto:${EMAIL}`} className="h26-btn h26-btn-pill h26-btn-lg cw-done__btn">
          <Mail size={15} aria-hidden="true" /> {EMAIL}
        </a>
      </div>
    );
  }

  return (
    <form className="cw-form" onSubmit={onSubmit} noValidate>
      <div className="cw-field">
        <label htmlFor="cw-name">Full name</label>
        <input id="cw-name" type="text" required autoComplete="name" placeholder="Your name" value={form.name} onChange={set('name')} />
      </div>
      <div className="cw-field-row">
        <div className="cw-field">
          <label htmlFor="cw-email">Email</label>
          <input id="cw-email" type="email" required autoComplete="email" placeholder="you@email.com" value={form.email} onChange={set('email')} />
        </div>
        <div className="cw-field">
          <label htmlFor="cw-org">Brand / publication / handle</label>
          <input id="cw-org" type="text" placeholder="@handle or company" value={form.org} onChange={set('org')} />
        </div>
      </div>
      <div className="cw-field-row">
        <div className="cw-field">
          <label htmlFor="cw-type">Type of collaboration</label>
          <select id="cw-type" value={form.type} onChange={set('type')} required>
            <option value="" disabled>Select one</option>
            {COLLAB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="cw-field">
          <label htmlFor="cw-platform">Primary platform</label>
          <select id="cw-platform" value={form.platform} onChange={set('platform')}>
            <option value="" disabled>Where you publish</option>
            {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>
      <div className="cw-field">
        <label htmlFor="cw-reach">Audience / reach <span className="cw-optional">(optional)</span></label>
        <input id="cw-reach" type="text" placeholder="e.g. 250k followers" value={form.reach} onChange={set('reach')} />
      </div>
      <div className="cw-field">
        <label htmlFor="cw-msg">Tell us about the idea <span className="cw-optional">(optional)</span></label>
        <textarea id="cw-msg" rows={2} placeholder="Destination, campaign, timing — as much or as little as you have." value={form.message} onChange={set('message')} />
      </div>
      <button type="submit" className="h26-btn h26-btn-pill h26-btn-lg cw-form__submit">
        Send collaboration request <Send size={15} aria-hidden="true" />
      </button>
      <p className="cw-form__note"><ShieldCheck size={13} aria-hidden="true" /> No obligation · a specialist replies within two working days</p>
    </form>
  );
}

export default function Collaborate() {
  return (
    <div className="h26 new-typo n3 cw">
      <SiteNav solidAt={80} skipTo="#cw-form" skipLabel="Skip to collaboration form" />

      {/* ============================================================ HERO + FORM */}
      <header className="cw-hero">
        <div className="cw-hero__bg" aria-hidden="true" />
        <div className="cw-hero__veil" aria-hidden="true" />

        <div className="cw-hero__inner">
          {/* Left — the pitch, kept short. The form is the star. */}
          <div className="cw-hero__intro">
            <p className="cw-eyebrow cw-eyebrow--light">Partnerships &amp; Collaborations</p>
            <h1 className="cw-hero__title">
              Let&apos;s create something <em>worth the journey</em>.
            </h1>
            <p className="cw-hero__lead">
              For the creators, brands and publishers who tell the world&apos;s stories —
              collaborate with a name that has been shaping journeys since 1758. Fill
              out the form to get started.
            </p>
            <ul className="cw-hero__points">
              {HERO_POINTS.map((p) => (
                <li key={p}><Check size={16} strokeWidth={2.2} aria-hidden="true" /> {p}</li>
              ))}
            </ul>
            <div className="cw-hero__contact">
              <a href={CONTACT_CK.phoneHref}><PhoneCall size={15} aria-hidden="true" /> {CONTACT_CK.phoneDisplay}</a>
              <a href={`mailto:${EMAIL}`}><Mail size={15} aria-hidden="true" /> {EMAIL}</a>
            </div>
          </div>

          {/* Right — THE FORM. Above the fold, the primary action on the page. */}
          <div className="cw-formcard" id="cw-form">
            <div className="cw-formcard__head">
              <span className="cw-formcard__eyebrow">Get started</span>
              <h2 className="cw-formcard__h">Start a collaboration</h2>
              <p className="cw-formcard__sub">
                Fill out the form below and the right specialist gets back to you within two working days.
              </p>
            </div>
            <CollabForm />
          </div>
        </div>
      </header>

      {/* ================================================================= STATS */}
      <section className="cw-stats" aria-label="Cox & Kings at a glance">
        <dl className="cw-stats__grid">
          {STATS.map((s) => (
            <div className="cw-stat" key={s.l}>
              <dt className="cw-stat__n">{s.n}{s.sup && <span className="cw-stat__sup">{s.sup}</span>}</dt>
              <dd className="cw-stat__l">{s.l}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ====================================================== WAYS TO COLLABORATE */}
      <section className="cw-section cw-ways" aria-labelledby="cw-ways-h">
        <div className="cw-wrap">
          <header className="cw-head">
            <p className="cw-eyebrow">Ways to collaborate</p>
            <h2 className="cw-h2" id="cw-ways-h">However you tell a story, there&apos;s a way to tell it with us.</h2>
          </header>
          <ul className="cw-cards cw-cards--4">
            {WAYS.map(({ icon: Icon, t, b }) => (
              <li className="cw-card" key={t}>
                <span className="cw-card__ic" aria-hidden="true"><Icon size={20} strokeWidth={1.5} /></span>
                <h3 className="cw-card__t">{t}</h3>
                <p className="cw-card__b">{b}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============================================================== HOW IT WORKS */}
      <section className="cw-section cw-how" aria-labelledby="cw-how-h">
        <div className="cw-wrap">
          <header className="cw-head">
            <p className="cw-eyebrow">How it works</p>
            <h2 className="cw-h2" id="cw-how-h">From a hunch to a headline, in four steps.</h2>
          </header>
          <ol className="cw-steps">
            {STEPS.map((s) => (
              <li className="cw-step" key={s.n}>
                <span className="cw-step__n" aria-hidden="true">{s.n}</span>
                <h3 className="cw-step__t">{s.t}</h3>
                <p className="cw-step__b">{s.b}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============================================================== CLOSING CTA */}
      <section className="cw-cta" aria-labelledby="cw-cta-h">
        <div className="cw-wrap cw-cta__inner">
          <div>
            <p className="cw-eyebrow cw-eyebrow--light">Collaborate with us</p>
            <h2 className="cw-cta__h" id="cw-cta-h">Ready to create together?</h2>
            <p className="cw-cta__p">Whether it&apos;s a fully-formed campaign or a single line of an idea, we&apos;d love to hear it.</p>
          </div>
          <div className="cw-cta__actions">
            <a href="#cw-form" className="h26-btn h26-btn-pill h26-btn-lg">
              Fill out the form <ArrowRight size={15} aria-hidden="true" />
            </a>
            <Link to={CALLBACK} className="cw-cta__link">
              Prefer we schedule a call? <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
