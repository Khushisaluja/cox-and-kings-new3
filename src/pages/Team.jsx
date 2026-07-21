/* ============================================================================
   Cox & Kings India — THE FULL TEAM  (route: /about-us2/team)

   A skimmable team directory. A picker at the top lets a visitor choose which
   team to view (All, Leadership, or any single department); the grid below
   updates in place. Every card links out to that person's LinkedIn.

   Neutral palette: a warm-charcoal hero (so the shared white nav stays legible)
   over a warm off-white body, with plain white cards. Reuses the AboutUs
   design tokens (Cormorant Garamond + Work Sans) for type only.

   Karan Agarwal is the only real person in here — see src/data/team.js.
   ========================================================================== */

import { useMemo, useState } from 'react';
import { SmartLink as Link } from '../components/ScheduleCall';
import { ArrowLeft, ArrowRight, Mail, Users } from 'lucide-react';
import { LEADERSHIP, DEPARTMENTS } from '../data/team';
import { SiteNav, SiteFooter } from '../components/SiteChrome';
import './AboutUs.css';
import './Team.css';

const img = (id, w = 640) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

/* The actual LinkedIn logo mark (the "in" bug), rendered in LinkedIn Blue.
   Colour comes from currentColor so the pill can flip it to white on hover. */
function LinkedInLogo({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.8 0 0 .78 0 1.73v20.54C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .78 23.2 0 22.22 0z" />
    </svg>
  );
}

/* Leadership (the Director) sits above the functional departments, but reads as
   just another team in the picker. */
const GROUPS = [
  {
    name: 'Leadership',
    blurb: 'The people steering the rebuild of a 265-year-old name.',
    members: LEADERSHIP,
  },
  ...DEPARTMENTS,
];

const FILTERS = ['All', ...GROUPS.map((g) => g.name)];

/* One person, rendered as a card. Name and role are what you skim; the
   LinkedIn pill is the one thing to click. */
function MemberCard({ m, i }) {
  return (
    <article className={`tm-card${m.real ? ' is-lead' : ''}`} style={{ '--i': i }}>
      <figure className="tm-card-photo">
        <img src={img(m.photo)} alt={m.name} loading="lazy" />
      </figure>
      <div className="tm-card-body">
        {m.real && <span className="tm-card-badge">Director</span>}
        <h3 className="tm-card-name">{m.name}</h3>
        <p className="tm-card-role">{m.role}</p>
        <p className="tm-card-unit">{m.unit}</p>
        <a
          className="tm-card-li"
          href={m.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${m.name}, ${m.role} — open LinkedIn profile (opens in a new tab)`}
        >
          <LinkedInLogo size={15} />
          <span>LinkedIn</span>
        </a>
      </div>
    </article>
  );
}

export default function Team() {
  const [active, setActive] = useState('All');

  const shown = useMemo(
    () => (active === 'All' ? GROUPS : GROUPS.filter((g) => g.name === active)),
    [active]
  );

  return (
    <div className="h26 new-typo ab tm">
      <SiteNav />

      {/* ---------------------------------------------------------------- hero */}
      <section className="tm-hero" id="main">
        {/* Delhi skyline from above at dusk — the office is in Delhi. */}
        <div className="tm-hero-media" aria-hidden="true">
          <img src={img('photo-1596176530529-78163a4f7af2', 2000)} alt="" />
          <span className="tm-hero-scrim" />
        </div>
        <div className="ab-wrap tm-hero-inner">
          <Link to="/about-us2" className="tm-back">
            <ArrowLeft size={14} /> Back to About
          </Link>
          <p className="tm-hero-eyebrow">Cox &amp; Kings India</p>
          <h1 className="tm-hero-title">
            Meet the <em>team</em>.
          </h1>
          <p className="tm-hero-lede">
            Rebuilding a company founded in 1758, organised by the department that owns
            your journey. Pick a team to see who is behind it.
          </p>
        </div>
      </section>

      {/* -------------------------------------------------------- team picker */}
      <div className="tm-pick">
        <div className="ab-wrap tm-pick-inner">
          <span className="tm-pick-label" id="tm-pick-label">
            <Users size={16} aria-hidden="true" /> Browse by team
          </span>
          <div className="tm-pick-chips" role="group" aria-labelledby="tm-pick-label">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                className={`tm-chip${active === f ? ' is-active' : ''}`}
                aria-pressed={active === f}
                onClick={() => setActive(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------ results */}
      <section className="tm-results" aria-live="polite">
        <div className="ab-wrap">
          <div className="tm-groups" key={active}>
            {shown.map((group) => (
              <section className="tm-group" key={group.name} aria-labelledby={`g-${group.name}`}>
                <header className="tm-group-head">
                  <h2 className="tm-group-name" id={`g-${group.name}`}>{group.name}</h2>
                  <p className="tm-group-blurb">{group.blurb}</p>
                  <span className="tm-group-count">
                    {group.members.length} {group.members.length === 1 ? 'person' : 'people'}
                  </span>
                </header>
                <div className="tm-grid">
                  {group.members.map((m, i) => (
                    <MemberCard m={m} i={i} key={m.name} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------- CTA */}
      <section className="tm-cta" aria-labelledby="tm-cta-h">
        <div className="tm-cta-media" aria-hidden="true">
          <img src={img('photo-1488085061387-422e29b40080', 1800)} alt="" />
          <span className="tm-cta-scrim" />
        </div>
        <div className="ab-wrap tm-cta-inner">
          <h2 className="tm-cta-h" id="tm-cta-h">
            Want to <em>join</em> us?
          </h2>
          <p>
            We are hiring as we rebuild. If you have an opinion about how travel in India ought to
            work, we would like to hear it.
          </p>
          <div className="tm-cta-actions">
            <Link to="/careers" className="h26-btn h26-btn-accent h26-btn-lg">
              View open roles <ArrowRight size={15} />
            </Link>
          </div>
          <div className="tm-cta-contact">
            <a href="mailto:holidays@coxandkings.com">
              <Mail size={14} /> holidays@coxandkings.com
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
