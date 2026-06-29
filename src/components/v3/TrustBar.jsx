import { STATS, ASSOCIATIONS } from '../../data/v3content';
import './TrustBar.css';

export default function TrustBar() {
  const associationsLine = ASSOCIATIONS.join(' · ');

  return (
    <section className="v3-section v3-section--blue v3trust" aria-label="Trust and credentials">
      <div className="v3-container">

        {/* Eyebrow */}
        <p className="v3-eyebrow v3-eyebrow--light">WHY TRAVELLERS TRUST US</p>

        {/* Stats grid */}
        <div className="v3trust__stats" role="list" aria-label="Key statistics">
          {STATS.map((stat) => (
            <div className="v3trust__tile" key={stat.value} role="listitem">
              <p className="v3trust__value">{stat.value}</p>
              <p className="v3trust__label">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Associations / accolades line */}
        <p className="v3trust__meta">
          Top-rated on Google &amp; TripAdvisor&nbsp;&middot;&nbsp;Award-winning&nbsp;&middot;&nbsp;Members of {associationsLine}
        </p>

      </div>
    </section>
  );
}
