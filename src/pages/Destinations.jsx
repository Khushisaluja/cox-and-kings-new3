import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import { destinations, regions } from '../data/destinations';
import './Destinations.css';

export default function Destinations() {
  const [activeRegion, setActiveRegion] = useState('All');
  const allRegionNames = ['All', ...regions.map((r) => r.name)];

  const filtered = activeRegion === 'All'
    ? destinations
    : destinations.filter((d) => d.region === activeRegion);

  return (
    <main className="destinations-page">
      {/* Hero */}
      <div className="destinations-page__hero">
        <div className="destinations-page__hero-bg" />
        <div className="destinations-page__hero-overlay" />
        <div className="container destinations-page__hero-content">
          <span className="tag">Destinations</span>
          <h1 className="destinations-page__hero-title">Explore the World</h1>
          <p className="destinations-page__hero-sub">
            Over 100 destinations across 6 continents — each one brought to life by our expert specialists
          </p>
        </div>
      </div>

      {/* Regions banner */}
      <section className="destinations-page__regions">
        <div className="container">
          <div className="destinations-page__regions-grid">
            {regions.map((region) => (
              <button
                key={region.name}
                className={`region-card ${activeRegion === region.name ? 'region-card--active' : ''}`}
                onClick={() => setActiveRegion(region.name)}
              >
                <div
                  className="region-card__img"
                  style={{ backgroundImage: `url(${region.image})` }}
                />
                <div className="region-card__overlay" />
                <div className="region-card__content">
                  <h3 className="region-card__name">{region.name}</h3>
                  <p className="region-card__count">{region.count} destinations</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations grid */}
      <section className="destinations-page__list">
        <div className="container">
          <div className="destinations-page__list-header">
            <div className="destinations-page__tabs">
              {allRegionNames.map((r) => (
                <button
                  key={r}
                  className={`destinations-page__tab ${activeRegion === r ? 'active' : ''}`}
                  onClick={() => setActiveRegion(r)}
                >
                  {r}
                </button>
              ))}
            </div>
            <span className="destinations-page__count">{filtered.length} destinations</span>
          </div>

          <div className="destinations-page__grid">
            {filtered.map((dest) => (
              <Link
                key={dest.id}
                to={`/destinations/${dest.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="dest-list-card"
              >
                <div
                  className="dest-list-card__img"
                  style={{ backgroundImage: `url(${dest.image})` }}
                />
                <div className="dest-list-card__overlay" />
                <div className="dest-list-card__content">
                  <div className="dest-list-card__region">
                    <MapPin size={11} /> {dest.region}
                  </div>
                  <h3 className="dest-list-card__name">{dest.name}</h3>
                  <p className="dest-list-card__tagline">{dest.tagline}</p>
                  <div className="dest-list-card__footer">
                    <span>{dest.tours} Tours Available</span>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
