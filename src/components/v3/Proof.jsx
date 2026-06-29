import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ArrowRight, X, Repeat2 } from 'lucide-react';
import { REVIEWS, RATING, img } from '../../data/v3content';
import './Proof.css';

/* ── Aggregate rating chip ── */
function RatingChip() {
  return (
    <span className="v3-rating v3proof__rating-chip">
      <span className="v3-rating__stars" aria-label={`${RATING.stars} stars`}>
        {[...Array(RATING.stars)].map((_, i) => (
          <Star key={i} size={14} fill="currentColor" aria-hidden="true" />
        ))}
      </span>
      <strong>{RATING.score}</strong>
      <span className="v3proof__rating-count">
        from {RATING.count} reviews
      </span>
    </span>
  );
}

/* ── Star row for individual review ── */
function StarRow({ rating }) {
  return (
    <span className="v3-rating__stars v3proof__stars" aria-label={`Rated ${rating} out of 5`}>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={13}
          fill={i < rating ? 'currentColor' : 'none'}
          strokeWidth={i < rating ? 0 : 1.5}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

/* ── Lightbox ── */
function Lightbox({ src, alt, onClose }) {
  return (
    <div
      className="v3proof__lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`Photo: ${alt}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}
    >
      <div className="v3proof__lightbox-inner">
        <img src={src} alt={alt} />
        <button
          className="v3proof__lightbox-close"
          onClick={onClose}
          aria-label="Close photo"
          autoFocus
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}

/* ── Main component ── */
export default function Proof() {
  const [lightbox, setLightbox] = useState(null); // { src, alt } | null

  function openLightbox(review) {
    setLightbox({ src: img(review.photo, 1200), alt: `Photo from ${review.name}'s journey` });
  }

  function closeLightbox() {
    setLightbox(null);
  }

  return (
    <section className="v3-section v3proof" aria-labelledby="proof-heading">
      {/* ── Repeat-customer banner ── */}
      <div className="v3proof__banner" aria-label="Repeat traveller statistic">
        <span className="v3proof__banner-inner v3-container">
          <Repeat2 size={16} className="v3proof__banner-icon" aria-hidden="true" />
          7 in 10 of our travellers come back. Here&rsquo;s why.
        </span>
      </div>

      <div className="v3-container">
        {/* ── Section head ── */}
        <header className="v3-head v3proof__head">
          <p className="v3-eyebrow">TRAVELLER STORIES</p>
          <h2 className="v3-h2" id="proof-heading">Real journeys, in their own words.</h2>
          <p className="v3-sub">
            Photos and reviews from the people who travelled — tap any photo to relive the moment.
          </p>
          <RatingChip />
        </header>

        {/* ── Review grid ── */}
        <ul className="v3proof__grid" role="list">
          {REVIEWS.map((review) => (
            <li key={review.name} className="v3-card v3proof__card">
              {/* Photo — clickable */}
              <button
                className="v3proof__photo-btn v3-imgwrap"
                onClick={() => openLightbox(review)}
                aria-label={`View photo from ${review.name}'s journey to ${review.tour}`}
              >
                <img
                  src={img(review.photo, 700)}
                  alt={`${review.name} — ${review.tour}`}
                  loading="lazy"
                  decoding="async"
                />
                <span className="v3proof__photo-overlay" aria-hidden="true">
                  Tap to enlarge
                </span>
              </button>

              {/* Card body */}
              <div className="v3proof__body">
                <StarRow rating={review.rating} />
                <blockquote className="v3proof__quote">
                  <p>&#8220;{review.text}&#8221;</p>
                </blockquote>
                <footer className="v3proof__meta">
                  <span className="v3proof__name">{review.name}</span>
                  <span className="v3proof__dot" aria-hidden="true" />
                  <span className="v3proof__loc">{review.location}</span>
                  <span className="v3proof__dot" aria-hidden="true" />
                  <span className="v3proof__tour">{review.tour}</span>
                </footer>
              </div>
            </li>
          ))}
        </ul>

        {/* ── CTA ── */}
        <div className="v3proof__cta">
          <Link to="/contact" className="v3-link">
            Read More Reviews <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* ── Lightbox ── */}
      {lightbox && (
        <Lightbox
          src={lightbox.src}
          alt={lightbox.alt}
          onClose={closeLightbox}
        />
      )}
    </section>
  );
}
