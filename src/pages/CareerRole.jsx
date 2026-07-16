/* ============================================================================
   Cox & Kings - ROLE / JOB DESCRIPTION  (route: /careers/:slug)

   The page behind every "View role" on /careers. It reads the :slug param,
   finds the role in the shared ROLES corpus (exported from Careers.jsx, so the
   listing and this page can never disagree), and renders the full job
   description alongside a sticky application form.

   Shape:
     - a dark header band (so the shared transparent nav stays legible) with the
       breadcrumb, department, title, meta chips and an "Apply" CTA;
     - a two-column body: the description on the left (about, what you'll do,
       what we're looking for, what we offer), a sticky application form on the
       right (name, contact, cover note, CV / résumé attachment).

   Wears the shared /new3 chrome and reuses the .crs form primitives from
   Careers.css; page-specific layout lives under .crd in that same sheet.
   ========================================================================== */

import { useLayoutEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  MapPin, Briefcase, Clock, Building2, ArrowRight, ArrowLeft,
  Check, Paperclip, X, ChevronRight, Sparkles,
} from 'lucide-react';
import { SmartLink as Link } from '../components/ScheduleCall';
import { SiteNav, SiteFooter, CONTACT_CK } from '../components/SiteChrome';
import { ROLES, slugify, OFFER } from './Careers';
import './Careers.css';

gsap.registerPlugin(ScrollTrigger);

/* The long-form job descriptions, keyed by role title so a slug typo can't
   silently orphan one. Every role in ROLES has an entry here. */
const DETAIL = {
  'Senior Destination Specialist, Japan': {
    about: "You'll own our Japan programme end to end: the journeys, the costings and the relationships that make them possible. From cherry-blossom timing to the ryokan that turns a good trip into an unforgettable one, the product is yours to shape.",
    resp: [
      'Design and cost Japan itineraries from first idea to final quote',
      'Build and hold relationships with DMCs, hotels and guides in Japan',
      'Keep pricing, margins and seasonality current across the programme',
      'Brief the sales team and answer the questions only a specialist can',
      'Travel to Japan to research new experiences and refresh existing ones',
    ],
    req: [
      '5+ years designing or selling Japan (or comparable Asia) travel',
      'First-hand knowledge of the country, its regions and its seasons',
      'Confidence with costings, margins and supplier negotiation',
      'An eye for the detail that makes a journey memorable',
    ],
  },
  'Luxury Travel Consultant': {
    about: "You'll turn enquiries into journeys guests talk about for years. This is consultative selling: listening first, designing around the traveller, and never reaching for a script or a target you couldn't be proud of.",
    resp: [
      'Respond to and qualify inbound luxury travel enquiries',
      'Design tailored proposals with our destination specialists',
      'Guide guests from first conversation to confirmed booking',
      'Own the relationship before, during and after the trip',
      'Meet revenue goals through service, not pressure',
    ],
    req: [
      '3+ years in luxury travel, hospitality or high-end sales',
      'A consultative, unhurried style and genuine curiosity about people',
      'Strong written English and an eye for a well-made proposal',
      'Comfort owning targets without compromising the guest',
    ],
  },
  'Group Tour Manager, Europe': {
    about: "You'll own the on-tour experience for our escorted Europe departures, the hundred logistics guests never see, and the calm they always feel. When it works, nobody notices; that's the job.",
    resp: [
      'Manage escorted group departures across Europe end to end',
      'Coordinate hotels, transfers, guides and dining on the ground',
      'Be the point of calm for guests throughout the journey',
      'Handle the inevitable curveballs without the group ever knowing',
      'Feed learnings back into how we design and run tours',
    ],
    req: [
      '4+ years in tour management, operations or ground handling',
      'Willingness to travel with groups for extended periods',
      'Unflappable problem-solving and genuine care for people',
      'Working knowledge of European destinations and logistics',
    ],
  },
  'Brand & Content Lead': {
    about: "You'll give a 260-year-old name a contemporary voice. The editorial, the campaigns and the standard everything is held to, all yours to define as Cox & Kings is rebuilt.",
    resp: [
      'Own the brand voice across every touchpoint',
      'Lead editorial, campaigns and the content calendar',
      'Set the creative bar and brief designers and writers',
      'Partner with product and sales to tell real journey stories',
      'Protect and evolve the brand through its relaunch',
    ],
    req: [
      '6+ years in brand, content or editorial leadership',
      'A portfolio that shows taste, range and results',
      'Sharp writing and sharper judgement',
      'Travel, luxury or lifestyle experience a plus',
    ],
  },
  'Frontend Engineer': {
    about: "You'll build the booking and inspiration experiences travellers actually use. We care about craft (motion, detail and performance) as much as we care about shipping.",
    resp: [
      'Build and maintain our customer-facing web experiences',
      'Turn designs into fast, accessible, polished interfaces',
      'Collaborate with design and product on what to build next',
      'Own quality: performance, accessibility and the small details',
      'Help shape our frontend architecture as we grow',
    ],
    req: [
      '3+ years with React and modern frontend tooling',
      'A real eye for design, motion and interaction detail',
      'Care for performance and accessibility',
      "A portfolio or work you're proud to show",
    ],
  },
  'Guest Relations Executive': {
    about: "You'll be the calm voice before, during and after a trip, the person a guest is relieved to have on the other end of the phone. Service here is a craft, not a queue.",
    resp: [
      'Support guests across phone, email and WhatsApp',
      'Resolve questions and issues quickly and warmly',
      'Coordinate with operations to keep promises to guests',
      'Turn a good trip into a story a guest retells',
      'Spot patterns and help us serve better next time',
    ],
    req: [
      '2+ years in guest relations, hospitality or premium support',
      'Warmth, patience and genuinely good written English',
      'Calm under pressure and an instinct to own problems',
      'Care for the detail that makes people feel looked after',
    ],
  },
  'Partnerships Manager': {
    about: "You'll grow our network of preferred sales partners across India: find them, sign them, and set them up to win under the Cox & Kings name.",
    resp: [
      'Identify and sign new sales partners across India',
      'Onboard partners onto our platform and ways of working',
      'Support partners to grow their bookings and revenue',
      'Own partner relationships and performance',
      'Represent Cox & Kings at trade events and meetings',
    ],
    req: [
      '5+ years in partnerships, channel sales or franchising',
      'A network in the Indian travel trade a strong plus',
      "Commercial instinct and a builder's mindset",
      'Willingness to travel across India',
    ],
  },
  'Itinerary Designer': {
    about: "You'll shape day-by-day journeys that read like a story and run like clockwork. A six-month contract with a real chance to extend for the right person.",
    resp: [
      'Craft detailed day-by-day itineraries across destinations',
      'Balance pace, logistics and the moments that matter',
      'Work with specialists to ground every plan in reality',
      'Write itinerary copy that makes travellers lean in',
      'Refine journeys from guest and operations feedback',
    ],
    req: [
      '3+ years designing itineraries or travel products',
      "A storyteller's sense of pace and place",
      'Precision with logistics and detail',
      'Available for a six-month contract',
    ],
  },
  'Performance Marketing Manager': {
    about: "You'll own paid acquisition across search and social: spend that respects the brand and still fills departures. Growth without cheapening the name.",
    resp: [
      'Plan and run paid campaigns across search and social',
      'Own budgets, targets and reporting end to end',
      'Test, measure and scale what works',
      'Partner with brand so performance never cheapens the name',
      'Feed insight back into product and audience strategy',
    ],
    req: [
      '4+ years in performance marketing, ideally consumer',
      'Hands-on with Google, Meta and analytics tools',
      'Numerate, testing-minded and brand-aware',
      'Travel or luxury experience a plus',
    ],
  },
  'Reservations Executive': {
    about: "You'll hold the details together (hotels, flights, transfers) so a consultant can promise a guest it's all handled. The quiet engine behind every journey.",
    resp: [
      'Make and manage bookings across hotels, flights and transfers',
      'Keep reservations accurate, current and confirmed',
      'Coordinate with suppliers and consultants',
      'Flag and resolve conflicts before they reach a guest',
      'Keep our systems tidy and trustworthy',
    ],
    req: [
      '1+ years in reservations, operations or a GDS role',
      'Precise, organised and calm with detail',
      'Comfort with booking systems and suppliers',
      'A service mindset',
    ],
  },
  'Finance Analyst': {
    about: "You'll keep the numbers behind every journey honest: costing, margins and the reporting the business is steered by.",
    resp: [
      'Own costing and margin analysis across products',
      'Build and maintain the reports leadership relies on',
      'Support pricing decisions with real numbers',
      'Keep financial data clean and trustworthy',
      'Flag risks and opportunities early',
    ],
    req: [
      '2+ years in finance, FP&A or analysis',
      'Strong Excel and a head for numbers',
      'Care for accuracy and clear reporting',
      'Travel industry experience a plus',
    ],
  },
  'Product Design Intern': {
    about: "A six-month internship on the team that builds our journeys. You'll learn the craft from specialists, on real trips and real products.",
    resp: [
      'Support specialists in researching and building itineraries',
      'Help cost, format and quality-check journeys',
      'Assist with supplier research and outreach',
      'Learn the end-to-end of how a trip is made',
      'Bring fresh eyes and ideas',
    ],
    req: [
      'Currently studying or a recent graduate',
      'A love of travel and an eye for detail',
      'Organised, curious and eager to learn',
      'Available for a six-month internship',
    ],
  },
};

/* -------------------------------------------------- the per-role application */
function ApplyForm({ roleTitle }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', cover: '' });
  const [fileName, setFileName] = useState('');
  const [sent, setSent] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const onFile = (e) => setFileName(e.target.files?.[0]?.name || '');
  const clearFile = () => setFileName('');
  const onSubmit = (e) => { e.preventDefault(); setSent(true); };

  return (
    <div className="crd-formcard" id="crd-apply">
      {sent ? (
        <div className="crs-form-done" role="status">
          <span className="crs-form-done-icon" aria-hidden="true"><Check size={26} strokeWidth={2} /></span>
          <h3 className="crs-form-done-h">Application received.</h3>
          <p className="crs-form-done-p">
            Thanks for applying for <strong>{roleTitle}</strong>. Our people team reviews every
            application and will be in touch if there's a fit. Questions? Email {CONTACT_CK.email}.
          </p>
        </div>
      ) : (
        <>
          <div className="crd-formhead">
            <span className="crd-formeyebrow">Apply for this role</span>
            <h2 className="crd-formtitle">{roleTitle}</h2>
          </div>

          <form className="crs-form" onSubmit={onSubmit} noValidate>
            <div className="crs-field">
              <label htmlFor="crd-name">Full name</label>
              <input id="crd-name" type="text" required autoComplete="name"
                placeholder="Your name" value={form.name} onChange={set('name')} />
            </div>
            <div className="crs-field-row">
              <div className="crs-field">
                <label htmlFor="crd-email">Email</label>
                <input id="crd-email" type="email" required autoComplete="email"
                  placeholder="you@email.com" value={form.email} onChange={set('email')} />
              </div>
              <div className="crs-field">
                <label htmlFor="crd-phone">Phone</label>
                <input id="crd-phone" type="tel" required autoComplete="tel"
                  placeholder="+91 00000 00000" value={form.phone} onChange={set('phone')} />
              </div>
            </div>

            <div className="crs-field">
              <label htmlFor="crd-cover">A short note <span className="crs-optional">(why you)</span></label>
              <textarea id="crd-cover" rows={4}
                placeholder="A few lines on why this role, and what you'd bring to it."
                value={form.cover} onChange={set('cover')} />
            </div>

            <div className="crs-field">
              <label htmlFor="crd-cv">CV / résumé</label>
              {fileName ? (
                <div className="crs-file crs-file--filled">
                  <Paperclip size={16} aria-hidden="true" />
                  <span className="crs-file-name">{fileName}</span>
                  <button type="button" className="crs-file-clear" onClick={clearFile} aria-label="Remove file">
                    <X size={15} aria-hidden="true" />
                  </button>
                </div>
              ) : (
                <label htmlFor="crd-cv" className="crs-file crs-file--empty">
                  <Paperclip size={16} aria-hidden="true" />
                  <span>Attach your CV <span className="crs-file-hint">PDF or DOC, up to 5 MB</span></span>
                </label>
              )}
              <input id="crd-cv" type="file" accept=".pdf,.doc,.docx"
                className="crs-file-input" onChange={onFile} />
            </div>

            <button type="submit" className="h26-btn h26-btn-pill crs-form-submit">
              Submit application <ArrowRight size={15} aria-hidden="true" />
            </button>
            <p className="crs-form-note">
              <Check size={13} aria-hidden="true" /> We read every application · No agencies, please
            </p>
          </form>
        </>
      )}
    </div>
  );
}

export default function CareerRole() {
  const { slug } = useParams();
  const role = ROLES.find((r) => slugify(r.t) === slug);
  const root = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray('[data-reveal]').forEach((el) => {
          gsap.from(el, {
            opacity: 0, y: 22, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 92%', once: true, invalidateOnRefresh: true },
          });
        });
        gsap.utils.toArray('[data-stagger]').forEach((list) => {
          gsap.from(list.children, {
            opacity: 0, y: 16, duration: 0.6, stagger: 0.06, ease: 'power3.out',
            scrollTrigger: { trigger: list, start: 'top 90%', once: true, invalidateOnRefresh: true },
          });
        });
      });
    }, root);
    return () => ctx.revert();
  }, [slug]);

  /* Unknown slug: a closed or mistyped role. Say so, don't dead-end. */
  if (!role) {
    return (
      <div className="h26 new-typo crs crd" ref={root}>
        <SiteNav solidAt={20} skipTo="#crd-nf" skipLabel="Skip to content" />
        <div className="crd-notfound" id="crd-nf">
          <p className="h26-label">Role not found</p>
          <h1 className="crd-nf-h">This role isn't open right now.</h1>
          <p className="crd-nf-p">It may have closed, or the link may be out of date. Here's everything we're hiring for.</p>
          <Link to="/careers" className="h26-btn h26-btn-pill h26-btn-lg">
            <ArrowLeft size={15} aria-hidden="true" /> Back to all roles
          </Link>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const detail = DETAIL[role.t] || { about: role.blurb, resp: [], req: [] };

  return (
    <div className="h26 new-typo crs crd" ref={root}>
      <SiteNav solidAt={160} skipTo="#crd-apply" skipLabel="Skip to application" />

      {/* ================================================= DARK HEADER BAND */}
      <header className="crd-head">
        <div className="crd-head-inner">
          <nav className="crd-crumb" aria-label="Breadcrumb">
            <Link to="/careers">Careers</Link>
            <ChevronRight size={13} aria-hidden="true" />
            <span>{role.t}</span>
          </nav>

          <p className="crd-dept"><Building2 size={13} aria-hidden="true" /> {role.dept}</p>
          <h1 className="crd-title">{role.t}</h1>

          <ul className="crd-meta">
            <li><MapPin size={14} aria-hidden="true" /> {role.loc}</li>
            <li><Briefcase size={14} aria-hidden="true" /> {role.type}</li>
            <li><Clock size={14} aria-hidden="true" /> {role.exp} experience</li>
          </ul>

          <div className="crd-head-actions">
            <a href="#crd-apply" className="h26-btn h26-btn-pill h26-btn-lg">
              Apply for this role <ArrowRight size={16} aria-hidden="true" />
            </a>
            <Link to="/careers" className="crd-back">
              <ArrowLeft size={15} aria-hidden="true" /> All open roles
            </Link>
          </div>
        </div>
      </header>

      {/* ==================================================== TWO-COLUMN BODY */}
      <div className="crd-body">
        <div className="crd-grid">
          <div className="crd-main">
            <section className="crd-section" aria-labelledby="crd-about">
              <h2 className="crd-sub" id="crd-about" data-reveal>About this role</h2>
              <p className="crd-lead" data-reveal>{detail.about}</p>
            </section>

            {detail.resp.length > 0 && (
              <section className="crd-section" aria-labelledby="crd-do">
                <h2 className="crd-sub" id="crd-do" data-reveal>What you'll do</h2>
                <ul className="crd-list" data-stagger>
                  {detail.resp.map((x) => (
                    <li key={x}><Check size={16} strokeWidth={2.2} aria-hidden="true" /> <span>{x}</span></li>
                  ))}
                </ul>
              </section>
            )}

            {detail.req.length > 0 && (
              <section className="crd-section" aria-labelledby="crd-look">
                <h2 className="crd-sub" id="crd-look" data-reveal>What we're looking for</h2>
                <ul className="crd-list" data-stagger>
                  {detail.req.map((x) => (
                    <li key={x}><Check size={16} strokeWidth={2.2} aria-hidden="true" /> <span>{x}</span></li>
                  ))}
                </ul>
              </section>
            )}

            <section className="crd-section crd-offer" aria-labelledby="crd-offer">
              <h2 className="crd-sub" id="crd-offer" data-reveal>What we offer</h2>
              <ul className="crd-list crd-list--offer" data-stagger>
                {OFFER.map((x) => (
                  <li key={x}><Sparkles size={16} strokeWidth={2} aria-hidden="true" /> <span>{x}</span></li>
                ))}
              </ul>
              <p className="crd-note" data-reveal>
                Cox &amp; Kings is an equal-opportunity employer. We hire for character and craft,
                and we welcome applicants from every background.
              </p>
            </section>
          </div>

          <aside className="crd-aside" aria-label="Application form">
            <ApplyForm roleTitle={role.t} />
          </aside>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
