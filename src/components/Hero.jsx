import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import './Hero.css';

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1920&q=90',
    tag: 'Asia',
    title: 'The Jewels of India',
    subtitle: 'Explore maharaja palaces, ancient temples and the incomparable Taj Mahal on our most celebrated journey.',
    cta: 'Explore India Tours',
    href: '/destinations?region=Asia',
    accent: 'From ₹2,07,085 per person',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1920&q=90',
    tag: 'Asia',
    title: 'The Wonders of Japan',
    subtitle: 'Discover ancient temples, bullet trains and cherry blossom gardens on this iconic journey through Japan.',
    cta: 'Explore Japan Tours',
    href: '/destinations?region=Asia',
    accent: 'From ₹4,88,870 per person',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1920&q=90',
    tag: 'Africa',
    title: 'African Safari',
    subtitle: 'Witness the Great Migration and encounter the Big Five in the untamed wilderness of the Masai Mara.',
    cta: 'Explore Safari Tours',
    href: '/destinations?region=Africa',
    accent: 'From ₹4,35,750 per person',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1920&q=90',
    tag: 'Europe',
    title: 'Iceland: Land of Fire & Ice',
    subtitle: 'Chase the Northern Lights, hike glaciers and soak in geothermal lagoons in this extraordinary Nordic land.',
    cta: 'Explore Iceland Tours',
    href: '/destinations?region=Europe',
    accent: 'From ₹3,02,950 per person',
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback((index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent(index);
      setIsTransitioning(false);
    }, 400);
  }, [isTransitioning]);

  const prev = () => goTo((current - 1 + slides.length) % slides.length);
  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="hero">
      {/* Background images */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={`hero__bg ${i === current ? 'hero__bg--active' : ''}`}
          style={{ backgroundImage: `url(${s.image})` }}
        />
      ))}
      <div className="hero__overlay" />

      {/* Content */}
      <div className={`hero__content ${isTransitioning ? 'hero__content--out' : 'hero__content--in'}`}>
        <div className="container">
          <div className="hero__inner">
            <span className="tag hero__tag">{slide.tag}</span>
            <h1 className="hero__title">{slide.title}</h1>
            <p className="hero__subtitle">{slide.subtitle}</p>
            <p className="hero__accent">{slide.accent}</p>
            <div className="hero__actions">
              <Link to={slide.href} className="btn-gold hero__cta">
                {slide.cta}
              </Link>
              <Link to="/tours" className="hero__cta-outline">
                View All Tours
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Nav arrows */}
      <button className="hero__arrow hero__arrow--prev" onClick={prev} aria-label="Previous slide">
        <ChevronLeft size={24} />
      </button>
      <button className="hero__arrow hero__arrow--next" onClick={next} aria-label="Next slide">
        <ChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="hero__dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`hero__dot ${i === current ? 'hero__dot--active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="hero__scroll">
        <span>Scroll to explore</span>
        <div className="hero__scroll-line" />
      </div>
    </section>
  );
}
