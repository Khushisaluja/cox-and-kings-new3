import { Link } from 'react-router-dom';
import { ArrowRight, Clock, UserCircle } from 'lucide-react';
import { CURATIONS, img } from '../../data/v3content';
import './Curations.css';

/* Generate initials from a name string */
function getInitials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

/* Deterministic hue per specialist name */
function getAvatarHue(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
  return h;
}

export default function Curations() {
  return (
    <section className="v3-section v3-section--cloud" aria-labelledby="v3cur-heading">
      <div className="v3-container">
        {/* Section head */}
        <div className="v3-head v3cur__head">
          <p className="v3-eyebrow">OUR CURATIONS</p>
          <h2 className="v3-h2" id="v3cur-heading">
            Journeys our experts recommend.
          </h2>
          <p className="v3-sub">
            Tried, tested and personally vetted by the specialists who design them —
            with a named expert behind every trip.
          </p>
        </div>

        {/* Cards grid */}
        <ul className="v3cur__grid" role="list">
          {CURATIONS.map((c) => {
            const hue = getAvatarHue(c.specialist);
            const initials = getInitials(c.specialist);

            return (
              <li key={c.name} className="v3cur__item">
                <article className="v3-card v3cur__card" tabIndex="0">
                  {/* Image with category chip overlay */}
                  <div className="v3-imgwrap v3cur__imgwrap">
                    <img
                      src={img(c.image, 800)}
                      alt={c.name}
                      loading="lazy"
                      width="800"
                      height="520"
                    />
                    <span className="v3-chip v3cur__chip">{c.category}</span>
                  </div>

                  {/* Card body */}
                  <div className="v3cur__body">
                    {/* Name */}
                    <h3 className="v3cur__name">{c.name}</h3>

                    {/* Meta row */}
                    <div className="v3cur__meta">
                      <span className="v3cur__meta-item">
                        <Clock size={14} aria-hidden="true" />
                        {c.duration}
                      </span>
                      <span className="v3cur__sep" aria-hidden="true" />
                      <span className="v3cur__price">from {c.priceFrom}</span>
                    </div>

                    {/* Specialist note */}
                    <p className="v3cur__note">{c.note}</p>

                    {/* Humanising specialist line */}
                    <div className="v3cur__specialist">
                      <span
                        className="v3cur__avatar"
                        style={{
                          '--v3cur-avatar-bg': `hsl(${hue},40%,72%)`,
                          '--v3cur-avatar-color': `hsl(${hue},45%,28%)`,
                        }}
                        aria-hidden="true"
                      >
                        {initials}
                      </span>
                      <span className="v3cur__specialist-text">
                        Designed by <strong>{c.specialist}</strong>
                      </span>
                    </div>

                    {/* CTA */}
                    <Link to="/tours" className="v3-link v3cur__cta" aria-label={`View itinerary for ${c.name}`}>
                      View Itinerary <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
