import { Link } from 'react-router-dom';
import { Star, Clock, Users, MapPin, ArrowRight } from 'lucide-react';
import './TourCard.css';

export default function TourCard({ tour }) {
  return (
    <Link to={`/tours/${tour.id}`} className="tour-card">
      <div className="tour-card__img-wrap">
        <img src={tour.image} alt={tour.title} className="tour-card__img" loading="lazy" />
        {tour.badge && <span className="tour-card__badge">{tour.badge}</span>}
        <div className="tour-card__type">{tour.type}</div>
      </div>

      <div className="tour-card__body">
        <div className="tour-card__meta">
          <span className="tour-card__dest">
            <MapPin size={12} /> {tour.destination}
          </span>
          <span className="tour-card__category">{tour.category}</span>
        </div>

        <h3 className="tour-card__title">{tour.title}</h3>

        <div className="tour-card__details">
          <span className="tour-card__detail">
            <Clock size={13} /> {tour.duration}
          </span>
          <span className="tour-card__detail">
            <Users size={13} /> {tour.groupSize}
          </span>
        </div>

        <ul className="tour-card__highlights">
          {tour.highlights.slice(0, 3).map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>

        <div className="tour-card__footer">
          <div className="tour-card__rating">
            <Star size={14} fill="currentColor" />
            <span>{tour.rating}</span>
            <span className="tour-card__reviews">({tour.reviews})</span>
          </div>
          <div className="tour-card__price">
            <span className="tour-card__from">from</span>
            <span className="tour-card__amount">₹{(tour.price * 83).toLocaleString('en-IN')}</span>
            <span className="tour-card__pp">pp</span>
          </div>
        </div>

        <div className="tour-card__cta-row">
          <span className="tour-card__cta-btn">
            View Tour <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}
