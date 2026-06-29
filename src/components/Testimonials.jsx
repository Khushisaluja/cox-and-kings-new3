import { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { testimonials } from '../data/testimonials';
import './Testimonials.css';

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);

  const t = testimonials[current];

  return (
    <section className="testimonials">
      <div className="container">
        <div className="testimonials__header">
          <p className="testimonials__eyebrow">Traveller Stories</p>
          <h2 className="section-title">What Our Guests Say</h2>
          <div className="gold-divider center" />
          <p className="section-subtitle testimonials__subtitle">
            Thousands of travellers have trusted Cox & Kings to craft the journey of a lifetime.
            Here are just a few of their stories.
          </p>
        </div>

        <div className="testimonials__stage">
          <button className="testimonials__arrow testimonials__arrow--prev" onClick={prev} aria-label="Previous">
            <ChevronLeft size={20} />
          </button>

          <div className="testimonials__card">
            <div className="testimonials__quote-icon">
              <Quote size={32} />
            </div>

            <div className="testimonials__stars">
              {[...Array(t.rating)].map((_, i) => (
                <Star key={i} size={18} fill="currentColor" />
              ))}
            </div>

            <blockquote className="testimonials__text">
              "{t.text}"
            </blockquote>

            <div className="testimonials__tour">
              Tour: <strong>{t.tour}</strong>
            </div>

            <div className="testimonials__author">
              <img src={t.avatar} alt={t.name} className="testimonials__avatar" loading="lazy" />
              <div>
                <p className="testimonials__name">{t.name}</p>
                <p className="testimonials__location">{t.location} &bull; {t.date}</p>
              </div>
            </div>
          </div>

          <button className="testimonials__arrow testimonials__arrow--next" onClick={next} aria-label="Next">
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Dots */}
        <div className="testimonials__dots">
          {testimonials.map((_, i) => (
            <button
              key={i}
              className={`testimonials__dot ${i === current ? 'testimonials__dot--active' : ''}`}
              onClick={() => setCurrent(i)}
            />
          ))}
        </div>

        {/* Trust badges */}
        <div className="testimonials__badges">
          <div className="testimonials__badge">
            <span className="testimonials__badge-num">4.9/5</span>
            <span className="testimonials__badge-label">Trustpilot Rating</span>
          </div>
          <div className="testimonials__badge-sep" />
          <div className="testimonials__badge">
            <span className="testimonials__badge-num">12,000+</span>
            <span className="testimonials__badge-label">5-Star Reviews</span>
          </div>
          <div className="testimonials__badge-sep" />
          <div className="testimonials__badge">
            <span className="testimonials__badge-num">98%</span>
            <span className="testimonials__badge-label">Would Recommend</span>
          </div>
        </div>
      </div>
    </section>
  );
}
