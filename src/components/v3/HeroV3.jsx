import { useState, useEffect } from 'react';
import { Phone, ChevronDown, Star } from 'lucide-react';
import { CONTACT, RATING, HERO_IMAGES, img } from '../../data/v3content';
import HeritageMark from './HeritageMark';
import './HeroV3.css';

/* HeroV3 — a brand statement, not a booking console.
   ONE primary CTA ("Start Planning My Trip" → the 4-path router) + one quiet
   link. The directed search now lives in the router (see PathRouter). */
export default function HeroV3() {
  const [bg, setBg] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setBg((b) => (b + 1) % HERO_IMAGES.length), 7000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="v3hero">
      <div className="v3hero__bg" aria-hidden="true">
        {HERO_IMAGES.map((src, i) => (
          <div
            key={src}
            className={`v3hero__img ${i === bg ? 'is-active' : ''}`}
            style={{ backgroundImage: `url(${img(src, 1900)})` }}
          />
        ))}
        <div className="v3hero__scrim" />
      </div>

      <div className="v3hero__inner v3-container">
        <p className="v3hero__eyebrow v3-rise">
          <HeritageMark variant="gold" />
          <span className="v3hero__eyebrow-sep" aria-hidden="true" />
          The world’s most trusted travel name
        </p>

        <h1 className="v3hero__title v3-rise">
          Premium international holidays, expertly led and obsessively{' '}
          <span className="v3-uline">curated.</span>
        </h1>

        <p className="v3hero__sub v3-rise">
          260 years of legacy and expert-led planning — flights, visas, hotels and transfers all handled, so you simply travel well.
        </p>

        <div className="v3hero__ctas v3-rise">
          <a href="#v3-router" className="v3-btn v3-btn--primary v3hero__primary">Start Planning My Trip</a>
          <a href={CONTACT.phoneHref} className="v3-link v3-link--light v3hero__talk">
            <Phone size={15} /> Talk to an Expert
          </a>
        </div>

        <div className="v3hero__trust v3-rise">
          <span className="v3-rating">
            <span className="v3-rating__stars">
              {[...Array(RATING.stars)].map((_, i) => <Star key={i} size={13} fill="currentColor" />)}
            </span>
            <strong>{RATING.score}</strong> from 1M+ travellers
          </span>
          <span className="v3hero__trust-dot" />
          <span>70% travel with us again</span>
          <span className="v3hero__trust-dot" />
          <span>90% visa success</span>
        </div>
      </div>

      <a href="#v3-router" className="v3hero__scroll" aria-label="Scroll to start planning">
        <span>Where shall we begin?</span>
        <ChevronDown size={18} />
      </a>
    </section>
  );
}
