import { useParams } from 'react-router-dom';
import { SmartLink as Link, CALLBACK } from '../components/ScheduleCall';
import { Star, Clock, Users, MapPin, CheckCircle, ArrowLeft, Calendar, Phone } from 'lucide-react';
import { tours } from '../data/tours';
import './TourDetail.css';

export default function TourDetail() {
  const { id } = useParams();
  const tour = tours.find((t) => t.id === Number(id));

  if (!tour) {
    return (
      <main style={{ paddingTop: 140, textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-navy)' }}>Tour Not Found</h2>
        <p style={{ color: 'var(--color-text-light)' }}>We couldn't find that tour. Please browse our full collection.</p>
        <Link to="/tours" className="btn-primary">Browse All Tours</Link>
      </main>
    );
  }

  const includedItems = [
    'Return international flights',
    'All accommodation in hand-selected hotels',
    'Expert English-speaking local guides',
    'All entrance fees as listed',
    'Selected meals (B = Breakfast, D = Dinner)',
    'All transfers and transport',
    '24/7 emergency support',
  ];

  const relatedTours = tours.filter((t) => t.region === tour.region && t.id !== tour.id).slice(0, 3);

  return (
    <main className="tour-detail">
      {/* Hero */}
      <div className="tour-detail__hero">
        <img src={tour.image} alt={tour.title} className="tour-detail__hero-img" />
        <div className="tour-detail__hero-overlay" />
        <div className="container tour-detail__hero-content">
          <Link to="/tours" className="tour-detail__back">
            <ArrowLeft size={16} /> All Tours
          </Link>
          {tour.badge && <span className="tag tour-detail__badge">{tour.badge}</span>}
          <h1 className="tour-detail__title">{tour.title}</h1>
          <div className="tour-detail__meta">
            <span><MapPin size={14} /> {tour.destination}</span>
            <span><Clock size={14} /> {tour.duration}</span>
            <span><Users size={14} /> {tour.groupSize}</span>
            <span><Star size={14} fill="currentColor" style={{color: 'var(--color-gold)'}} /> {tour.rating} ({tour.reviews} reviews)</span>
          </div>
        </div>
      </div>

      <div className="container tour-detail__body">
        <div className="tour-detail__main">
          {/* Overview */}
          <section className="tour-detail__section">
            <h2 className="tour-detail__section-title">Tour Overview</h2>
            <div className="gold-divider" />
            <p className="tour-detail__overview-text">
              Embark on an extraordinary {tour.duration} journey to {tour.destination} with Cox & Kings —
              the world's most experienced travel company. This carefully crafted {tour.type.toLowerCase()} tour
              takes you to the very heart of {tour.destination}'s most iconic sights and hidden gems,
              guided by our expert local specialists who know every corner of this remarkable destination.
            </p>
            <p className="tour-detail__overview-text">
              Throughout your journey you'll enjoy hand-selected accommodation, private transfers,
              and the peace of mind that comes from over 265 years of travel expertise. Whether
              you're travelling solo, as a couple, or with family, this is the journey of a lifetime.
            </p>
          </section>

          {/* Highlights */}
          <section className="tour-detail__section">
            <h2 className="tour-detail__section-title">Tour Highlights</h2>
            <div className="gold-divider" />
            <div className="tour-detail__highlights-grid">
              {tour.highlights.map((h) => (
                <div key={h} className="tour-detail__highlight">
                  <CheckCircle size={18} />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Sample itinerary */}
          <section className="tour-detail__section">
            <h2 className="tour-detail__section-title">Sample Itinerary</h2>
            <div className="gold-divider" />
            {Array.from({ length: Math.min(parseInt(tour.duration), 7) }, (_, i) => (
              <div key={i} className="tour-detail__day">
                <div className="tour-detail__day-num">Day {i + 1}</div>
                <div className="tour-detail__day-content">
                  <h4 className="tour-detail__day-title">
                    {i === 0 ? `Arrive in ${tour.destination}` : i === parseInt(tour.duration) - 1 ? 'Departure Day' : `Day ${i + 1}: Exploring ${tour.destination}`}
                  </h4>
                  <p className="tour-detail__day-desc">
                    {i === 0
                      ? `Your Cox & Kings journey begins today. Upon arrival at the airport you will be met by your local representative and transferred to your carefully selected hotel. This evening enjoy a welcome dinner with your tour manager and fellow travellers.`
                      : i === parseInt(tour.duration) - 1
                        ? `After breakfast, you will be transferred to the airport for your return flight home, carrying with you memories that will last a lifetime. Your Cox & Kings tour manager will be on hand until the very end.`
                        : `Today's programme takes you to some of ${tour.destination}'s most spectacular sites. Your expert guide will bring each location to life with fascinating historical and cultural context. ${tour.highlights[i % tour.highlights.length]} is among today's highlights.`
                    }
                  </p>
                  <div className="tour-detail__day-meals">
                    {i > 0 && <span>🍳 Breakfast</span>}
                    {i > 0 && i < parseInt(tour.duration) - 1 && <span>🍽️ Dinner</span>}
                  </div>
                </div>
              </div>
            ))}
            {parseInt(tour.duration) > 7 && (
              <p className="tour-detail__itinerary-note">
                Full {tour.duration} itinerary available upon request or when booking. Contact our specialists for complete day-by-day details.
              </p>
            )}
          </section>

          {/* What's included */}
          <section className="tour-detail__section">
            <h2 className="tour-detail__section-title">What's Included</h2>
            <div className="gold-divider" />
            <div className="tour-detail__included-grid">
              {includedItems.map((item) => (
                <div key={item} className="tour-detail__included-item">
                  <CheckCircle size={16} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="tour-detail__sidebar">
          <div className="tour-detail__booking-card">
            <div className="tour-detail__booking-price">
              <span className="tour-detail__booking-from">from</span>
              <span className="tour-detail__booking-amount">₹{(tour.price * 83).toLocaleString('en-IN')}</span>
              <span className="tour-detail__booking-pp">per person</span>
            </div>

            <div className="tour-detail__booking-details">
              <div className="tour-detail__booking-row">
                <Clock size={15} /> <span>{tour.duration}</span>
              </div>
              <div className="tour-detail__booking-row">
                <Users size={15} /> <span>{tour.groupSize}</span>
              </div>
              <div className="tour-detail__booking-row">
                <Calendar size={15} /> <span>Departures: {tour.departures}</span>
              </div>
              <div className="tour-detail__booking-row">
                <MapPin size={15} /> <span>{tour.type}</span>
              </div>
            </div>

            <Link to={CALLBACK} className="btn-primary tour-detail__booking-btn">
              Enquire & Book Now
            </Link>

            <div className="tour-detail__booking-phone">
              <Phone size={15} />
              <div>
                <span>Call a specialist</span>
                <a href="tel:+443308808440">+44 (0) 330 880 8440</a>
              </div>
            </div>

            <div className="tour-detail__trust-badges">
              <span className="tour-detail__trust-badge">ATOL Protected</span>
              <span className="tour-detail__trust-badge">ABTA Member</span>
            </div>
          </div>

          <div className="tour-detail__specialist-card">
            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80" alt="Specialist" className="tour-detail__specialist-img" />
            <div>
              <h4 className="tour-detail__specialist-name">{tour.destination} Specialist</h4>
              <p className="tour-detail__specialist-text">Have a question? Our destination expert has personally visited every site on this tour.</p>
              <Link to={CALLBACK} className="tour-detail__specialist-link">Chat with me →</Link>
            </div>
          </div>
        </aside>
      </div>

      {/* Related tours */}
      {relatedTours.length > 0 && (
        <section className="tour-detail__related">
          <div className="container">
            <h2 className="section-title tour-detail__related-title">You May Also Like</h2>
            <div className="gold-divider" />
            <div className="tour-detail__related-grid">
              {relatedTours.map((t) => (
                <Link key={t.id} to={`/tours/${t.id}`} className="tour-detail__related-card">
                  <img src={t.image} alt={t.title} className="tour-detail__related-img" loading="lazy" />
                  <div className="tour-detail__related-content">
                    <h3>{t.title}</h3>
                    <span>{t.duration} • from ₹{(t.price * 83).toLocaleString('en-IN')}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
