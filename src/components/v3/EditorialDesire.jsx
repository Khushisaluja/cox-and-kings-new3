import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { JOURNEYS, img } from '../../data/v3content';
import './EditorialDesire.css';

const lead = JOURNEYS.find((j) => j.lead);
const gallery = JOURNEYS.filter((j) => !j.lead);

export default function EditorialDesire() {
  return (
    <section className="v3-section v3-section--cream v3journeys__section" id="v3-journeys">
      <div className="v3-container">

        {/* ── Section head ── */}
        <div className="v3-head v3journeys__head">
          <div className="v3journeys__head-text">
            <p className="v3-eyebrow">In Season Now</p>
            <h2 className="v3-h2">Journeys worth<br />dreaming about.</h2>
            <p className="v3-sub">
              Timed to the season, built for the moment — our experts'
              favourite ways to see the world right now.
            </p>
          </div>
          <Link to="/tours" className="v3-link v3journeys__all-link" aria-label="See all journeys">
            See All Journeys <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        {/* ── Lead Feature ── */}
        {lead && (
          <article className="v3journeys__lead v3-rise" aria-label={`Featured journey: ${lead.title}`}>
            <Link to="/tours" className="v3journeys__lead-imglink" tabIndex="-1" aria-hidden="true">
              <div className="v3-imgwrap v3journeys__lead-img">
                <img
                  src={img(lead.image, 1500)}
                  alt={lead.title}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </Link>

            <div className="v3journeys__lead-caption">
              {lead.season && (
                <span className="v3-chip v3journeys__season">{lead.season}</span>
              )}
              <h3 className="v3journeys__lead-title">{lead.title}</h3>
              <p className="v3journeys__lead-blurb">{lead.blurb}</p>
              <Link to="/tours" className="v3-link v3journeys__read-link">
                Read the Journey <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </article>
        )}

        {/* ── Gallery rail ── */}
        <div className="v3journeys__gallery" role="list">
          {gallery.map((journey) => (
            <Link
              key={journey.title}
              to="/tours"
              className="v3journeys__card v3-rise"
              role="listitem"
              aria-label={journey.title}
            >
              <div className="v3-imgwrap v3journeys__card-img">
                <img
                  src={img(journey.image, 800)}
                  alt={journey.title}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="v3journeys__card-body">
                {journey.season && (
                  <span className="v3-chip v3journeys__season">{journey.season}</span>
                )}
                <h3 className="v3journeys__card-title">{journey.title}</h3>
                <p className="v3journeys__card-blurb">{journey.blurb}</p>
                <span className="v3-link v3journeys__read-link" aria-hidden="true">
                  Read the Journey <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* ── Bottom CTA ── */}
        <div className="v3journeys__footer">
          <Link to="/tours" className="v3-btn v3-btn--outline">
            See All Journeys <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>

      </div>
    </section>
  );
}
