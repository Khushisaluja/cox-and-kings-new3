import Hero from '../components/Hero';
import SearchWidget from '../components/SearchWidget';
import FeaturedDestinations from '../components/FeaturedDestinations';
import FeaturedTours from '../components/FeaturedTours';
import WhyChooseUs from '../components/WhyChooseUs';
import Testimonials from '../components/Testimonials';
import Newsletter from '../components/Newsletter';
import './Home.css';

const experienceTypes = [
  {
    title: 'Escorted Group Tours',
    desc: 'Travel with like-minded explorers, guided by our expert local specialists, with everything handled for you.',
    image: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=600&q=80',
    href: '/tours?type=escorted',
    icon: '👥',
  },
  {
    title: 'Tailor-Made Holidays',
    desc: 'Your itinerary, your pace, your dream. Our specialists design bespoke journeys perfectly suited to you.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
    href: '/tours?type=tailor-made',
    icon: '✨',
  },
  {
    title: 'Luxury Journeys',
    desc: "The finest hotels, private guides, exclusive access. Uncompromising luxury in the world's most extraordinary destinations.",
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&q=80',
    href: '/tours?type=luxury',
    icon: '💎',
  },
  {
    title: 'Wildlife & Safari',
    desc: "Witness nature's most spectacular theatre — the Great Migration, Arctic polar bears, Galápagos wildlife and more.",
    image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600&q=80',
    href: '/experiences?type=safari',
    icon: '🦁',
  },
];

export default function Home() {
  return (
    <main className="home">
      <Hero />
      <SearchWidget />
      <FeaturedDestinations />

      {/* Experiences strip */}
      <section className="home__experiences">
        <div className="container">
          <div className="home__exp-header">
            <p className="home__exp-eyebrow">How We Travel</p>
            <h2 className="section-title">Ways to Experience the World</h2>
            <div className="gold-divider" />
          </div>
          <div className="home__exp-grid">
            {experienceTypes.map((exp) => (
              <a key={exp.title} href={exp.href} className="home__exp-card">
                <div
                  className="home__exp-img"
                  style={{ backgroundImage: `url(${exp.image})` }}
                />
                <div className="home__exp-overlay" />
                <div className="home__exp-content">
                  <span className="home__exp-icon">{exp.icon}</span>
                  <h3 className="home__exp-title">{exp.title}</h3>
                  <p className="home__exp-desc">{exp.desc}</p>
                  <span className="home__exp-link">Explore &rarr;</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <FeaturedTours />
      <WhyChooseUs />

      {/* Editorial / Feature */}
      <section className="home__editorial">
        <div className="container home__editorial-inner">
          <div className="home__editorial-img">
            <img
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
              alt="Travel story"
              loading="lazy"
            />
          </div>
          <div className="home__editorial-content">
            <span className="tag">Expert Insight</span>
            <h2 className="home__editorial-title">
              Why Travelling Slowly <br /><em>Changes Everything</em>
            </h2>
            <div className="gold-divider" />
            <p className="home__editorial-text">
              The best travel experiences aren't found in a hurry. Cox & Kings has always believed
              in dwelling deeply in each place — savouring a sunrise over the Taj Mahal, sharing
              tea with a Kyoto geisha, listening to the silence of the Sahara at dusk.
            </p>
            <p className="home__editorial-text">
              That's why our itineraries are designed to breathe. Every destination is given
              the time it deserves, guided by specialists who know it intimately.
            </p>
            <a href="/about" className="btn-outline home__editorial-cta">
              Our Philosophy
            </a>
          </div>
        </div>
      </section>

      <Testimonials />
      <Newsletter />
    </main>
  );
}
