import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { WAYS, img } from '../../data/v3content';
import './HowWeTravel.css';

/* Render a single travel-way card */
function WayCard({ card }) {
  const isInPage = card.to.startsWith('#');
  const inner = (
    <>
      <div className="v3ways__imgwrap v3-imgwrap">
        <img src={img(card.image, 1100)} alt={card.title} loading="lazy" />
        <div className="v3ways__gradient" aria-hidden="true" />
      </div>
      <div className="v3ways__body">
        <h3 className="v3ways__title">{card.title}</h3>
        <p className="v3ways__desc">{card.desc}</p>
        <span className="v3-link v3-link--light v3ways__cta" aria-hidden="true">
          {card.cta} <ArrowRight size={15} />
        </span>
      </div>
    </>
  );

  const sharedProps = {
    className: `v3ways__card v3ways__card--${card.size}`,
    'aria-label': `${card.title} — ${card.cta}`,
  };

  if (isInPage) {
    return (
      <a href={card.to} {...sharedProps}>
        {inner}
      </a>
    );
  }
  return (
    <Link to={card.to} {...sharedProps}>
      {inner}
    </Link>
  );
}

const largCards = WAYS.filter((w) => w.size === 'large');
const smallCards = WAYS.filter((w) => w.size === 'small');

export default function HowWeTravel() {
  return (
    <section className="v3-section v3ways" id="v3-ways" aria-labelledby="v3ways-heading">
      <div className="v3-container">

        {/* Section head */}
        <header className="v3-head v3-head--center">
          <p className="v3-eyebrow">How We Travel</p>
          <h2 className="v3-h2" id="v3ways-heading">
            Two ways to go.<br />Both, unmistakably Cox&nbsp;&amp;&nbsp;Kings.
          </h2>
          <p className="v3-sub">
            Whether you travel in fine company or on your own terms, every journey
            is expert-led and obsessively curated.
          </p>
        </header>

        {/* Large hero cards — group & bespoke */}
        <div className="v3ways__row v3ways__row--large" role="list">
          {largCards.map((card) => (
            <div key={card.key} role="listitem">
              <WayCard card={card} />
            </div>
          ))}
        </div>

        {/* Small cards — luxury & family */}
        <div className="v3ways__row v3ways__row--small" role="list">
          {smallCards.map((card) => (
            <div key={card.key} role="listitem">
              <WayCard card={card} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
