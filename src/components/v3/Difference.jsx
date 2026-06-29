import { Link } from 'react-router-dom';
import { UserCheck, Briefcase, Headphones, Phone, ArrowRight } from 'lucide-react';
import { DIFFERENCE, ASSURANCE, EXPERTS, CONTACT, img } from '../../data/v3content';
import './Difference.css';

/* Fine-line icons mapped to each DIFFERENCE pillar */
const PILLAR_ICONS = [UserCheck, Briefcase, Headphones];

export default function Difference() {
  const expert = EXPERTS[0];

  return (
    <section
      className="v3-section v3-section--cream v3diff"
      id="v3-difference"
      aria-labelledby="v3diff-heading"
    >
      <div className="v3-container">

        {/* Section head */}
        <header className="v3-head v3-head--center">
          <p className="v3-eyebrow">The Cox &amp; Kings Difference</p>
          <h2 className="v3-h2" id="v3diff-heading">
            Experts plan it. We handle everything.<br />
            You simply travel.
          </h2>
        </header>

        {/* Three-column triptych */}
        <div className="v3diff__triptych" role="list">
          {DIFFERENCE.map((pillar, i) => {
            const Icon = PILLAR_ICONS[i];
            return (
              <article key={pillar.title} className="v3diff__pillar" role="listitem">
                <div className="v3diff__icon" aria-hidden="true">
                  <Icon size={28} strokeWidth={1.4} />
                </div>
                <h3 className="v3diff__pillar-title">{pillar.title}</h3>
                <p className="v3diff__pillar-body">{pillar.body}</p>
              </article>
            );
          })}
        </div>

        {/* Assurance ribbon */}
        <div className="v3diff__ribbon" aria-label="Our commitments to Indian travellers">
          <ul className="v3diff__chips" role="list">
            {ASSURANCE.map((item) => (
              <li key={item} role="listitem">
                <span className="v3-chip v3diff__chip">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Human concierge cue */}
        <div className="v3diff__concierge">
          <div className="v3diff__portrait-wrap" aria-hidden="true">
            <img
              src={img(expert.photo, 200)}
              alt={`${expert.name}, ${expert.region}`}
              className="v3diff__portrait"
              width="72"
              height="72"
              loading="lazy"
            />
          </div>
          <div className="v3diff__concierge-text">
            <p className="v3diff__concierge-line">
              Every journey has a real specialist behind it — yours replies within 24&nbsp;hours.
            </p>
            <p className="v3diff__concierge-meta">
              {expert.name} &middot; {expert.region} &middot; {expert.years} with Cox &amp; Kings
            </p>
          </div>
          <div className="v3diff__concierge-ctas">
            <Link to="/contact" className="v3-link v3diff__talk">
              Talk to an Expert
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
            <a
              href={CONTACT.phoneHref}
              className="v3-link"
              aria-label={`Call us at ${CONTACT.phoneDisplay}`}
            >
              <Phone size={15} aria-hidden="true" />
              {CONTACT.phoneDisplay}
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
