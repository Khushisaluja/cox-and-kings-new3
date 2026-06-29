import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { destinations, regions } from '../data/destinations';
import './FeaturedDestinations.css';

export default function FeaturedDestinations() {
  const [activeRegion, setActiveRegion] = useState('All');
  const allRegions = ['All', ...regions.map((r) => r.name)];

  const filtered = activeRegion === 'All'
    ? destinations.filter((d) => d.featured)
    : destinations.filter((d) => d.region === activeRegion);

  return (
    <section className="featured-dest">
      <div className="container">
        <div className="featured-dest__header">
          <div>
            <p className="featured-dest__eyebrow">Explore the World</p>
            <h2 className="section-title">Popular Destinations</h2>
            <div className="gold-divider" />
            <p className="section-subtitle">
              From the temples of India to the savannahs of Africa — discover our most
              beloved destinations, each expertly curated by our travel specialists.
            </p>
          </div>
          <Link to="/destinations" className="btn-outline featured-dest__view-all">
            View All Destinations <ArrowRight size={16} />
          </Link>
        </div>

        {/* Region filter tabs */}
        <div className="featured-dest__tabs">
          {allRegions.map((region) => (
            <button
              key={region}
              className={`featured-dest__tab ${activeRegion === region ? 'featured-dest__tab--active' : ''}`}
              onClick={() => setActiveRegion(region)}
            >
              {region}
            </button>
          ))}
        </div>

        {/* Destination grid */}
        <div className="featured-dest__grid">
          {filtered.slice(0, 6).map((dest, i) => (
            <Link
              key={dest.id}
              to={`/destinations/${dest.name.toLowerCase().replace(/\s+/g, '-')}`}
              className={`dest-card ${i === 0 ? 'dest-card--large' : ''}`}
              style={{ '--delay': `${i * 0.08}s` }}
            >
              <div
                className="dest-card__img"
                style={{ backgroundImage: `url(${dest.image})` }}
              />
              <div className="dest-card__overlay" />
              <div className="dest-card__content">
                <div>
                  <p className="dest-card__region">{dest.region}</p>
                  <h3 className="dest-card__name">{dest.name}</h3>
                  <p className="dest-card__tagline">{dest.tagline}</p>
                </div>
                <div className="dest-card__footer">
                  <span className="dest-card__tours">{dest.tours} Tours</span>
                  <span className="dest-card__arrow">
                    <ArrowRight size={18} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
