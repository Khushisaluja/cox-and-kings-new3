import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { DESTINATIONS, img } from '../../data/v3content';
import './DestinationMosaic.css';

export default function DestinationMosaic() {
  return (
    <section className="v3-section v3-section--cream v3dest__section" id="v3-destinations">
      <div className="v3-container">

        {/* ── Section head ── */}
        <div className="v3dest__head">
          <div className="v3dest__head-copy">
            <p className="v3-eyebrow">Destinations we know by heart</p>
            <h2 className="v3-h2">Where the world is open to you.</h2>
            <p className="v3-sub">
              Hand-picked countries our specialists travel, vet and re-walk every season —
              so the version you experience is the best one.
            </p>
          </div>
          <Link to="/tours" className="v3-link v3dest__see-all">
            See All Destinations <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        {/* ── Desktop: editorial mosaic grid ── */}
        <div className="v3dest__mosaic" aria-label="Destination tiles">
          {DESTINATIONS.map((dest) => (
            <Link
              key={dest.name}
              to="/tours"
              className={`v3dest__tile v3dest__tile--${dest.span}`}
              aria-label={`Explore ${dest.name} tours`}
            >
              <div className="v3-imgwrap v3dest__imgwrap">
                <img
                  src={img(dest.image, dest.span === 'normal' ? 900 : 1300)}
                  alt={`${dest.name} — ${dest.hook}`}
                  loading="lazy"
                />
                <div className="v3dest__scrim" aria-hidden="true" />
                <div className="v3dest__caption">
                  <span className="v3dest__name">{dest.name}</span>
                  <span className="v3dest__hook">{dest.hook}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* ── Mobile: scroll-snap rail ── */}
        <div className="v3dest__rail" aria-label="Destination tiles" role="list">
          {DESTINATIONS.map((dest) => (
            <Link
              key={`rail-${dest.name}`}
              to="/tours"
              className="v3dest__rail-card"
              aria-label={`Explore ${dest.name} tours`}
              role="listitem"
            >
              <div className="v3-imgwrap v3dest__rail-imgwrap">
                <img
                  src={img(dest.image, 900)}
                  alt={`${dest.name} — ${dest.hook}`}
                  loading="lazy"
                />
                <div className="v3dest__scrim" aria-hidden="true" />
                <div className="v3dest__caption">
                  <span className="v3dest__name">{dest.name}</span>
                  <span className="v3dest__hook">{dest.hook}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* ── Mobile: "See All" link beneath rail ── */}
        <div className="v3dest__mobile-cta">
          <Link to="/tours" className="v3-link">
            See All Destinations <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

      </div>
    </section>
  );
}
