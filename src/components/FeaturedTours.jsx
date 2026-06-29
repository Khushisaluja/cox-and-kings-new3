import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { tours, categories } from '../data/tours';
import TourCard from './TourCard';
import './FeaturedTours.css';

export default function FeaturedTours() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? tours
    : tours.filter((t) => t.category === activeCategory);

  return (
    <section className="featured-tours">
      <div className="container">
        <div className="featured-tours__header">
          <div>
            <p className="featured-tours__eyebrow">Our Journeys</p>
            <h2 className="section-title">Handpicked Tours & Holidays</h2>
            <div className="gold-divider" />
            <p className="section-subtitle">
              Every itinerary is crafted by our expert specialists who have personally experienced
              each destination — ensuring an unmatched depth of knowledge and care.
            </p>
          </div>
          <Link to="/tours" className="btn-outline featured-tours__view-all">
            View All Tours <ArrowRight size={16} />
          </Link>
        </div>

        {/* Category filter */}
        <div className="featured-tours__categories">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`featured-tours__cat-btn ${activeCategory === cat ? 'featured-tours__cat-btn--active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tour cards grid */}
        <div className="featured-tours__grid">
          {filtered.slice(0, 4).map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      </div>
    </section>
  );
}
