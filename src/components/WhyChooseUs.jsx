import { Award, Users, Globe, HeadphonesIcon, Shield, Star } from 'lucide-react';
import './WhyChooseUs.css';

const reasons = [
  {
    icon: Award,
    title: 'Est. 1758',
    desc: 'The world\'s most experienced travel company, with over 265 years of crafting extraordinary journeys.',
  },
  {
    icon: Globe,
    title: '100+ Destinations',
    desc: 'From the temples of Angkor to the glaciers of Patagonia — we operate tours across every continent.',
  },
  {
    icon: Users,
    title: 'Expert Specialists',
    desc: 'Our travel specialists have personally visited every destination we sell, ensuring genuine insider knowledge.',
  },
  {
    icon: HeadphonesIcon,
    title: '24/7 Support',
    desc: 'Our dedicated concierge team is available around the clock, before, during and after your journey.',
  },
  {
    icon: Shield,
    title: 'ATOL Protected',
    desc: 'All our holidays are fully ATOL and ABTA protected, giving you complete financial peace of mind.',
  },
  {
    icon: Star,
    title: 'Award-Winning',
    desc: 'Consistently recognised by Condé Nast Traveller, Travel + Leisure, and the British Travel Awards.',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="why-us">
      <div className="why-us__bg" />
      <div className="container why-us__inner">
        <div className="why-us__text">
          <p className="why-us__eyebrow">The Cox & Kings Difference</p>
          <h2 className="section-title why-us__title">Why Travel With Us?</h2>
          <div className="gold-divider" />
          <p className="why-us__desc">
            For over two and a half centuries, Cox & Kings has been setting the standard
            in luxury and cultural travel. We go further so you can go farther — in
            comfort, style, and with unparalleled expertise.
          </p>
          <div className="why-us__stats">
            <div className="why-us__stat">
              <span className="why-us__stat-number">265+</span>
              <span className="why-us__stat-label">Years Experience</span>
            </div>
            <div className="why-us__stat-divider" />
            <div className="why-us__stat">
              <span className="why-us__stat-number">100+</span>
              <span className="why-us__stat-label">Destinations</span>
            </div>
            <div className="why-us__stat-divider" />
            <div className="why-us__stat">
              <span className="why-us__stat-number">4.9★</span>
              <span className="why-us__stat-label">Average Rating</span>
            </div>
          </div>
        </div>

        <div className="why-us__grid">
          {reasons.map((reason, i) => (
            <div key={reason.title} className="why-us__card" style={{ '--delay': `${i * 0.08}s` }}>
              <div className="why-us__icon">
                <reason.icon size={26} />
              </div>
              <h3 className="why-us__card-title">{reason.title}</h3>
              <p className="why-us__card-desc">{reason.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
