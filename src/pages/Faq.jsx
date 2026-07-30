/* ============================================================================
   Cox & Kings India — FAQ  (route: /faq)

   The /about-us2/team layout applied to questions: a photo hero under a navy
   scrim, a sticky topic picker (All, or any single topic) driving the groups
   below, and a blue photo CTA at the end. Content is the live site's FAQ,
   verbatim — see src/data/faq.js.

   Instead of a card grid, each topic renders as a single-column accordion:
   one open question per topic at a time, so the page stays skimmable even
   with all 45 questions on screen under "All".
   ========================================================================== */

import { useMemo, useState } from 'react';
import { SmartLink as Link, CALLBACK } from '../components/ScheduleCall';
import { ArrowLeft, ChevronDown, HelpCircle, Mail, Phone } from 'lucide-react';
import { FAQ_TOPICS } from '../data/faq';
import { SiteNav, SiteFooter, CONTACT_CK } from '../components/SiteChrome';
import './AboutUs.css';
import './Faq.css';

const img = (id, w = 640) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const FILTERS = ['All', ...FAQ_TOPICS.map((t) => t.name)];

/* One question. The collapse is animated with the grid-rows trick (0fr → 1fr)
   so height animates without measuring; answers keep their line breaks via
   pre-line (the social-media answer is a list of platforms). */
function QaItem({ item, open, onToggle, id }) {
  return (
    <div className={`fq-item${open ? ' is-open' : ''}`}>
      <h3 className="fq-q-head">
        <button
          type="button"
          className="fq-q"
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          id={`${id}-btn`}
          onClick={onToggle}
        >
          <span>{item.q}</span>
          <ChevronDown size={18} className="fq-q-chev" aria-hidden="true" />
        </button>
      </h3>
      <div
        className="fq-a"
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-btn`}
      >
        <div className="fq-a-clip">
          <p className="fq-a-text">{item.a}</p>
        </div>
      </div>
    </div>
  );
}

/* One topic: the team page's group header (name, blurb, count on the rule)
   over its accordion. Open state lives here so switching topics resets it. */
function TopicGroup({ topic }) {
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <section className="fq-group" aria-labelledby={`t-${topic.id}`}>
      <header className="fq-group-head">
        <h2 className="fq-group-name" id={`t-${topic.id}`}>{topic.name}</h2>
        <p className="fq-group-blurb">{topic.blurb}</p>
        <span className="fq-group-count">{topic.items.length} questions</span>
      </header>
      <div className="fq-list">
        {topic.items.map((item, i) => (
          <QaItem
            key={item.q}
            item={item}
            id={`${topic.id}-${i}`}
            open={openIdx === i}
            onToggle={() => setOpenIdx(openIdx === i ? -1 : i)}
          />
        ))}
      </div>
    </section>
  );
}

export default function Faq() {
  const [active, setActive] = useState('All');

  const shown = useMemo(
    () => (active === 'All' ? FAQ_TOPICS : FAQ_TOPICS.filter((t) => t.name === active)),
    [active]
  );

  return (
    <div className="h26 new-typo ab fq">
      <SiteNav />

      {/* ---------------------------------------------------------------- hero */}
      <section className="fq-hero" id="main">
        {/* A traveller's flat-lay — map, camera, notes: the planning moment
            most of these questions come from. */}
        <div className="fq-hero-media" aria-hidden="true">
          <img src={img('photo-1488646953014-85cb44e25828', 2000)} alt="" />
          <span className="fq-hero-scrim" />
        </div>
        <div className="ab-wrap fq-hero-inner">
          <Link to="/" className="fq-back">
            <ArrowLeft size={14} /> Back to Home
          </Link>
          <p className="fq-hero-eyebrow">Cox &amp; Kings India</p>
          <h1 className="fq-hero-title">
            Questions, <em>answered</em>.
          </h1>
          <p className="fq-hero-lede">
            Everything travellers ask us most — about the company, booking, flying,
            staying and cancelling. Pick a topic, or browse the lot.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------- topic picker */}
      <div className="fq-pick">
        <div className="ab-wrap fq-pick-inner">
          <span className="fq-pick-label" id="fq-pick-label">
            <HelpCircle size={16} aria-hidden="true" /> Browse by topic
          </span>
          <div className="fq-pick-chips" role="group" aria-labelledby="fq-pick-label">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                className={`fq-chip${active === f ? ' is-active' : ''}`}
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
      <section className="fq-results" aria-live="polite">
        <div className="ab-wrap">
          <div className="fq-groups" key={active}>
            {shown.map((topic) => (
              <TopicGroup topic={topic} key={topic.id} />
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------- CTA */}
      <section className="fq-cta" aria-labelledby="fq-cta-h">
        <div className="fq-cta-media" aria-hidden="true">
          <img src={img('photo-1469854523086-cc02fe5d8800', 1800)} alt="" />
          <span className="fq-cta-scrim" />
        </div>
        <div className="ab-wrap fq-cta-inner">
          <h2 className="fq-cta-h" id="fq-cta-h">
            Still have a <em>question</em>?
          </h2>
          <p>
            Ask a person, not a page. Pick a time and one of our travel experts
            will call you back — no obligation, no queue.
          </p>
          <div className="fq-cta-actions">
            <Link to={CALLBACK} className="h26-btn h26-btn-accent h26-btn-lg">
              Schedule a call <Phone size={15} />
            </Link>
          </div>
          <div className="fq-cta-contact">
            <a href={CONTACT_CK.phoneHref}>
              <Phone size={14} /> {CONTACT_CK.phoneDisplay}
            </a>
            <a href={`mailto:${CONTACT_CK.email}`}>
              <Mail size={14} /> {CONTACT_CK.email}
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
