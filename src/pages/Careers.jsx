/* ============================================================================
   Cox & Kings - CAREERS  (route: /careers)

   The recruitment page, built on the SAME primitives as /new3 so the rhythm,
   type and colour read as one site: the shared <SiteNav /> + <SiteFooter />
   chrome, the `.h26-section` spacing rhythm, `.h26-head` / `.h26-label` /
   `.h26-h2` / `.h26-statement` heads, and the `.h26-btn h26-btn-pill` CTA.

   Shape, top to bottom:
     - a full-bleed, CENTRE-ALIGNED hero with one clear primary CTA;
     - WHY WORK AT COX & KINGS: a sticky statement + team photo, and the reasons
       as a numbered ledger;
     - EXPLORE OUR OPEN ROLES: a live search + department / location / type
       filters over a role list (each "View role" opens /careers/:slug);
     - a "Didn't find a role?" reach-out form (name, contact, why, CV upload).
   ========================================================================== */

import { useLayoutEffect, useRef, useState, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Plane, Landmark, Gem, HeartHandshake, GraduationCap, Sprout, Compass,
  Search, MapPin, Briefcase, Building2, ArrowRight, ArrowUpRight,
  Check, Paperclip, ChevronRight, PhoneCall, X,
} from 'lucide-react';
import { SmartLink as Link, CALLBACK } from '../components/ScheduleCall';
import { SiteNav, SiteFooter, CONTACT_CK } from '../components/SiteChrome';
/* Last, so .crs's own rules win over the shared h26 sheets. */
import './Careers.css';

gsap.registerPlugin(ScrollTrigger);

export const img = (id, w = 1400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

/* One slug per role title, shared by the listing (the link) and the detail
   page (the lookup), so they can never disagree. */
export const slugify = (s) =>
  s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

/* What every role offers, the same across the board, shown on each JD page. */
export const OFFER = [
  'Familiarisation trips and on-the-ground research',
  'A heritage brand travellers have trusted since 1758',
  'Small teams, with real ownership from day one',
  'Mentorship from specialists who have spent careers on their craft',
  'A front-row seat as a storied brand is rebuilt',
];

/* --------------------------------------------------------------- the content */

const HERO_FACTS = [
  { icon: Landmark, label: 'Since 1758' },
  { icon: MapPin, label: 'Delhi & Chandigarh offices' },
  { icon: Plane, label: 'Familiarisation trips' },
  { icon: Sprout, label: 'A brand being rebuilt' },
];

/* Why work here, six reasons, one icon each. */
const REASONS = [
  {
    icon: Plane,
    t: 'Travel is the job, and the perk',
    b: 'Familiarisation trips, on-the-ground research and departures you help design. You sell the world because you have seen it. Nobody here learns a destination from a brochure.',
  },
  {
    icon: Landmark,
    t: '260+ years to stand on',
    b: 'Join a name travellers have trusted since 1758: the credibility of a heritage brand on day one, without the bureaucracy. The India team is deliberately small.',
  },
  {
    icon: Gem,
    t: 'Craft over volume',
    b: 'We build considered journeys, not conveyor-belt packages. Your work is measured by the trip a guest remembers for a decade, not the bookings closed by Friday.',
  },
  {
    icon: HeartHandshake,
    t: 'Small teams, real ownership',
    b: 'You will own outcomes, not tickets. Decisions are made in the room you are sitting in, and the person who designed the itinerary is the one the guest thanks.',
  },
  {
    icon: GraduationCap,
    t: 'Learn from specialists',
    b: 'Sit beside people who have spent careers on a single region. Mentorship here is a daily habit, not an annual programme, the fastest way to get genuinely good at this.',
  },
  {
    icon: Sprout,
    t: 'Grow with the relaunch',
    b: 'Cox & Kings India is being rebuilt under new ownership. Early is the best time to join, and the roles you shape now become the team the brand is known for next.',
  },
];

const CULTURE = [
  { n: '30+', l: 'Specialists on the India team' },
  { n: '4', l: 'Familiarisation trips a year' },
  { n: '100+', l: 'Countries we design for' },
  { n: '1758', l: 'The year we started' },
];

/* -------------------------------------------------------------- the open roles
   Each role carries the three facets the filters read: department, location,
   type. One source, so search + filters + list stay in sync. */
const DEPARTMENTS = [
  'Sales & Partnerships',
  'Product & Tour Design',
  'Operations',
  'Marketing & Brand',
  'Technology',
  'Guest Experience',
  'Finance & Legal',
];
const LOCATIONS = ['Delhi', 'Chandigarh', 'Remote'];
const TYPES = ['Full-time', 'Contract', 'Internship'];

export const ROLES = [
  { t: 'Senior Destination Specialist, Japan', dept: 'Product & Tour Design', loc: 'Delhi', type: 'Full-time', exp: '5+ yrs', blurb: 'Design and cost our Japan journeys end to end, from cherry-blossom timing to the ryokan that makes a trip.' },
  { t: 'Luxury Travel Consultant', dept: 'Sales & Partnerships', loc: 'Delhi', type: 'Full-time', exp: '3+ yrs', blurb: 'Turn an enquiry into a journey a guest talks about for years. Consultative selling, with no scripts and no targets you cannot be proud of.' },
  { t: 'Group Tour Manager, Europe', dept: 'Operations', loc: 'Chandigarh', type: 'Full-time', exp: '4+ yrs', blurb: 'Own the on-tour experience for escorted Europe departures, the logistics guests never see and always feel.' },
  { t: 'Brand & Content Lead', dept: 'Marketing & Brand', loc: 'Delhi', type: 'Full-time', exp: '6+ yrs', blurb: 'Give a 260-year-old name a contemporary voice. Own the editorial, the campaigns and the standard everything is held to.' },
  { t: 'Frontend Engineer', dept: 'Technology', loc: 'Remote', type: 'Full-time', exp: '3+ yrs', blurb: 'Build the booking and inspiration experiences travellers actually use. React, motion, and a real eye for craft.' },
  { t: 'Guest Relations Executive', dept: 'Guest Experience', loc: 'Delhi', type: 'Full-time', exp: '2+ yrs', blurb: 'Be the calm voice before, during and after a trip. The person a guest is relieved to have on the other end of the phone.' },
  { t: 'Partnerships Manager', dept: 'Sales & Partnerships', loc: 'Chandigarh', type: 'Full-time', exp: '5+ yrs', blurb: 'Grow our network of preferred sales partners across India: find them, sign them, and set them up to win.' },
  { t: 'Itinerary Designer', dept: 'Product & Tour Design', loc: 'Remote', type: 'Contract', exp: '3+ yrs', blurb: 'Shape day-by-day journeys that read like a story and run like clockwork. A six-month contract with a real chance to extend.' },
  { t: 'Performance Marketing Manager', dept: 'Marketing & Brand', loc: 'Chandigarh', type: 'Full-time', exp: '4+ yrs', blurb: 'Own paid acquisition across search and social, spend that respects the brand and still fills departures.' },
  { t: 'Reservations Executive', dept: 'Operations', loc: 'Delhi', type: 'Full-time', exp: '1+ yrs', blurb: 'Hold the details together (hotels, flights, transfers) so a consultant can promise a guest it is all handled.' },
  { t: 'Finance Analyst', dept: 'Finance & Legal', loc: 'Chandigarh', type: 'Full-time', exp: '2+ yrs', blurb: 'Keep the numbers behind every journey honest. Costing, margins and the reporting the business is steered by.' },
  { t: 'Product Design Intern', dept: 'Product & Tour Design', loc: 'Chandigarh', type: 'Internship', exp: 'Students', blurb: 'A six-month internship on the team that builds our journeys. Learn the craft from specialists, on real trips.' },
];

/* ------------------------------------------------------- the reach-out form */
function ReachOutForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', role: '', why: '' });
  const [fileName, setFileName] = useState('');
  const [sent, setSent] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const onFile = (e) => setFileName(e.target.files?.[0]?.name || '');
  const clearFile = () => setFileName('');
  const onSubmit = (e) => { e.preventDefault(); setSent(true); };

  if (sent) {
    return (
      <div className="crs-form-done" role="status">
        <span className="crs-form-done-icon" aria-hidden="true"><Check size={26} strokeWidth={2} /></span>
        <h3 className="crs-form-done-h">Thank you, your note is with us.</h3>
        <p className="crs-form-done-p">
          Our people team reads every message. If there's a fit, now or when a role opens, we'll
          be in touch. In the meantime, you can reach us at {CONTACT_CK.email}.
        </p>
      </div>
    );
  }

  return (
    <form className="crs-form" onSubmit={onSubmit} noValidate>
      <div className="crs-field-row">
        <div className="crs-field">
          <label htmlFor="crs-name">Full name</label>
          <input id="crs-name" type="text" required autoComplete="name"
            placeholder="Your name" value={form.name} onChange={set('name')} />
        </div>
        <div className="crs-field">
          <label htmlFor="crs-email">Email</label>
          <input id="crs-email" type="email" required autoComplete="email"
            placeholder="you@email.com" value={form.email} onChange={set('email')} />
        </div>
      </div>

      <div className="crs-field-row">
        <div className="crs-field">
          <label htmlFor="crs-phone">Phone <span className="crs-optional">(optional)</span></label>
          <input id="crs-phone" type="tel" autoComplete="tel"
            placeholder="+91 00000 00000" value={form.phone} onChange={set('phone')} />
        </div>
        <div className="crs-field">
          <label htmlFor="crs-role">Role you're after</label>
          <input id="crs-role" type="text" required
            placeholder="e.g. Destination Specialist" value={form.role} onChange={set('role')} />
        </div>
      </div>

      <div className="crs-field">
        <label htmlFor="crs-why">Why Cox &amp; Kings, and why you</label>
        <textarea id="crs-why" rows={4} required
          placeholder="A few lines on the work you want to do and what you'd bring to it."
          value={form.why} onChange={set('why')} />
      </div>

      <div className="crs-field">
        <label htmlFor="crs-cv">CV / résumé</label>
        {fileName ? (
          <div className="crs-file crs-file--filled">
            <Paperclip size={16} aria-hidden="true" />
            <span className="crs-file-name">{fileName}</span>
            <button type="button" className="crs-file-clear" onClick={clearFile} aria-label="Remove file">
              <X size={15} aria-hidden="true" />
            </button>
          </div>
        ) : (
          <label htmlFor="crs-cv" className="crs-file crs-file--empty">
            <Paperclip size={16} aria-hidden="true" />
            <span>Attach your CV <span className="crs-file-hint">PDF or DOC, up to 5 MB</span></span>
          </label>
        )}
        <input id="crs-cv" type="file" accept=".pdf,.doc,.docx"
          className="crs-file-input" onChange={onFile} />
      </div>

      <button type="submit" className="h26-btn h26-btn-pill crs-form-submit">
        Send my details <ArrowRight size={15} aria-hidden="true" />
      </button>
      <p className="crs-form-note">
        <Check size={13} aria-hidden="true" /> We read every message · No agencies, please
      </p>
    </form>
  );
}

export default function Careers() {
  const root = useRef(null);

  /* Filter state: search box + three facet selects. */
  const [query, setQuery] = useState('');
  const [dept, setDept] = useState('All');
  const [loc, setLoc] = useState('All');
  const [type, setType] = useState('All');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ROLES.filter((r) => {
      if (dept !== 'All' && r.dept !== dept) return false;
      if (loc !== 'All' && r.loc !== loc) return false;
      if (type !== 'All' && r.type !== type) return false;
      if (q && !(`${r.t} ${r.dept} ${r.loc} ${r.blurb}`.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [query, dept, loc, type]);

  const anyFilter = query || dept !== 'All' || loc !== 'All' || type !== 'All';
  const reset = () => { setQuery(''); setDept('All'); setLoc('All'); setType('All'); };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.timeline({ defaults: { ease: 'power3.out' } })
          .from('.crs-hero__eyebrow', { opacity: 0, y: 14, duration: 0.7 }, 0.15)
          .from('.crs-hero__line span', { yPercent: 115, duration: 1.1, stagger: 0.1 }, 0.25)
          .from('.crs-hero__lead', { opacity: 0, y: 18, duration: 0.8 }, 0.8)
          .from('.crs-hero__actions', { opacity: 0, y: 16, duration: 0.7 }, 0.95)
          .from('.crs-hero__facts > *', { opacity: 0, y: 14, duration: 0.6, stagger: 0.08 }, 1.05);

        gsap.utils.toArray('[data-reveal]').forEach((el) => {
          gsap.from(el, {
            opacity: 0, y: 24, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true, invalidateOnRefresh: true },
          });
        });

        gsap.utils.toArray('[data-stagger]').forEach((grid) => {
          gsap.from(grid.children, {
            opacity: 0, y: 22, duration: 0.7, stagger: 0.07, ease: 'power3.out',
            scrollTrigger: { trigger: grid, start: 'top 88%', once: true, invalidateOnRefresh: true },
          });
        });
      });

      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener('load', refresh);
      const t = setTimeout(refresh, 900);
      return () => {
        window.removeEventListener('load', refresh);
        clearTimeout(t);
      };
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div className="h26 new-typo crs" ref={root}>
      {/* Same shared navbar as /new3 (transparent over the hero, solid on
          scroll); solidAt matches /new3 so the transition timing is identical. */}
      <SiteNav solidAt={80} skipTo="#crs-roles" skipLabel="Skip to open roles" />

      {/* ============================================================= HERO */}
      <header className="crs-hero">
        <div
          className="crs-hero__bg"
          style={{ backgroundImage: `url(${img('photo-1522071820081-009f0129c71c', 2200)})` }}
          aria-hidden="true"
        />
        <div className="crs-hero__veil" aria-hidden="true" />

        <div className="crs-hero__inner">
          <p className="crs-hero__eyebrow h26-label h26-label-light">Careers at Cox &amp; Kings</p>

          <h1 className="crs-hero__title">
            <span className="crs-hero__line"><span>Help the world</span></span>
            <span className="crs-hero__line"><span>travel <em>better</em>.</span></span>
          </h1>

          <p className="crs-hero__lead">
            We've been designing journeys since 1758, and we're rebuilding the team that carries
            the name next. If you believe a trip should be made, not sold, there's a place for you
            here.
          </p>

          <div className="crs-hero__actions">
            <a href="#crs-roles" className="h26-btn h26-btn-pill h26-btn-lg">
              Explore open roles <ArrowRight size={16} aria-hidden="true" />
            </a>
            <a href="#crs-why" className="crs-hero__textcta">
              <Compass size={15} aria-hidden="true" /> Why work with us
            </a>
          </div>

          <ul className="crs-hero__facts">
            {HERO_FACTS.map(({ icon: Icon, label }) => (
              <li className="crs-fact" key={label}>
                <Icon size={15} aria-hidden="true" /> {label}
              </li>
            ))}
          </ul>
        </div>
      </header>

      {/* ==================================================== WHY WORK HERE
          Editorial split: a sticky statement + team photograph on the left, the
          six reasons entered as a numbered ledger on the right. Culture numbers
          close the section as a full-width footer. */}
      <section className="h26-section crs-why" id="crs-why" aria-labelledby="crs-why-h">
        <div className="crs-why-grid crs-wrap">
          <aside className="crs-why-aside">
            <p className="h26-label" data-reveal>Why work at Cox &amp; Kings</p>
            <h2 className="h26-statement crs-why-h" id="crs-why-h" data-reveal>
              A heritage brand, being <span className="wr-accent">rebuilt from the inside</span>.
            </h2>
            <p className="crs-lede" data-reveal>
              Most people join a travel company to sell holidays. Here you get to shape what a
              260-year-old name means next, with the reach of a global brand and the pace of a
              team small enough to know everyone's name.
            </p>
            <figure className="crs-why-figure" data-reveal>
              <img src={img('photo-1552664730-d307ca884978', 1100)}
                alt="The Cox &amp; Kings India team at work" loading="lazy" />
              <figcaption><strong>The India team</strong><span>Delhi HQ</span></figcaption>
            </figure>
          </aside>

          <ol className="crs-ledger" data-stagger>
            {REASONS.map(({ icon: Icon, t, b }, i) => (
              <li className="crs-lrow" key={t}>
                <span className="crs-lnum" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <div className="crs-lbody">
                  <h3 className="crs-lt">
                    <span className="crs-lic" aria-hidden="true"><Icon size={17} strokeWidth={1.7} /></span>
                    {t}
                  </h3>
                  <p className="crs-lb">{b}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <ul className="crs-culture crs-wrap" data-stagger>
          {CULTURE.map((s) => (
            <li className="crs-culture-item" key={s.l}>
              <span className="crs-culture-n">{s.n}</span>
              <span className="crs-culture-l">{s.l}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ==================================================== OPEN ROLES */}
      <section className="h26-section crs-roles" id="crs-roles" aria-labelledby="crs-roles-h">
        <div className="crs-roles-inner">
          <div className="h26-head">
            <p className="h26-label" data-reveal>Open positions</p>
            <h2 className="h26-h2" data-reveal id="crs-roles-h">Explore our open roles.</h2>
            <p className="crs-lede" data-reveal>
              Search by keyword, or narrow by team, city and type. Don't see your fit?{' '}
              <a href="#crs-reach" className="crs-inline-link">Tell us anyway</a>.
            </p>
          </div>

          <div className="crs-toolbar" data-reveal>
            <div className="crs-search">
              <Search size={18} aria-hidden="true" />
              <input
                type="search"
                aria-label="Search roles"
                placeholder="Search roles, teams, cities…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div className="crs-filters">
              <div className="crs-select">
                <Building2 size={15} aria-hidden="true" />
                <select aria-label="Filter by department" value={dept} onChange={(e) => setDept(e.target.value)}>
                  <option value="All">All teams</option>
                  {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="crs-select">
                <MapPin size={15} aria-hidden="true" />
                <select aria-label="Filter by location" value={loc} onChange={(e) => setLoc(e.target.value)}>
                  <option value="All">All locations</option>
                  {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div className="crs-select">
                <Briefcase size={15} aria-hidden="true" />
                <select aria-label="Filter by type" value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="All">All types</option>
                  {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="crs-result-bar">
            <span className="crs-count" aria-live="polite">
              {filtered.length} {filtered.length === 1 ? 'role' : 'roles'}
              {anyFilter ? ' match your search' : ' open right now'}
            </span>
            {anyFilter && (
              <button type="button" className="crs-clear" onClick={reset}>
                Clear filters <X size={13} aria-hidden="true" />
              </button>
            )}
          </div>

          {filtered.length > 0 ? (
            <ul className="crs-role-list">
              {filtered.map((r) => (
                <li className="crs-role" key={r.t}>
                  <div className="crs-role-main">
                    <h3 className="crs-role-t">{r.t}</h3>
                    <p className="crs-role-b">{r.blurb}</p>
                    <ul className="crs-role-tags">
                      <li className="crs-tag crs-tag--dept"><Building2 size={13} aria-hidden="true" /> {r.dept}</li>
                      <li className="crs-tag"><MapPin size={13} aria-hidden="true" /> {r.loc}</li>
                      <li className="crs-tag"><Briefcase size={13} aria-hidden="true" /> {r.type}</li>
                      <li className="crs-tag">{r.exp}</li>
                    </ul>
                  </div>
                  <Link
                    to={`/careers/${slugify(r.t)}`}
                    className="crs-role-cta"
                    aria-label={`View and apply for ${r.t}`}
                  >
                    <span>View role</span>
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="crs-empty" role="status">
              <span className="crs-empty-icon" aria-hidden="true"><Search size={22} /></span>
              <h3 className="crs-empty-h">No roles match that just yet.</h3>
              <p className="crs-empty-b">
                We hire ahead of need and we're growing fast. Clear your filters to see everything,
                or tell us what you're looking for and we'll keep you in mind.
              </p>
              <div className="crs-empty-actions">
                <button type="button" className="h26-btn h26-btn-pill" onClick={reset}>
                  Show all roles
                </button>
                <a href="#crs-reach" className="crs-empty-textcta">
                  Reach out instead <ArrowRight size={15} aria-hidden="true" />
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ==================================================== REACH OUT */}
      <section className="h26-section crs-reach" id="crs-reach" aria-labelledby="crs-reach-h">
        <div className="crs-reach__grid">
          <div className="crs-reach__intro">
            <p className="h26-label h26-label-light" data-reveal>Open application</p>
            <h2 className="h26-h2 h26-h2-light crs-reach__h" id="crs-reach-h" data-reveal>
              Didn't find <span className="wr-accent">a role</span>?
            </h2>
            <p className="crs-reach__p" data-reveal>
              If you believe in the work but don't see the exact title, write to us. Tell us the role
              you want, why Cox &amp; Kings, and leave your CV. Our people team reads every message,
              and the right person tends to create their own opening.
            </p>
            <p className="crs-reach__contact" data-reveal>
              <PhoneCall size={15} aria-hidden="true" /> Prefer to talk?{' '}
              <Link to={CALLBACK} className="crs-reach__link">Schedule a call <ChevronRight size={14} aria-hidden="true" /></Link>
            </p>
          </div>

          <div className="crs-reach__form" data-reveal>
            <div className="crs-form-head">
              <span className="crs-form-eyebrow">Introduce yourself</span>
              <h3 className="crs-form-title">Tell us why you're a fit</h3>
            </div>
            <ReachOutForm />
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
