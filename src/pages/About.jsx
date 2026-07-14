import { SmartLink as Link, CALLBACK } from '../components/ScheduleCall';
import { Award, Globe, Users, Shield } from 'lucide-react';
import './About.css';

const milestones = [
  { year: '1758', event: 'Founded in London as a military logistics company' },
  { year: '1878', event: 'First escorted tours to India and Egypt' },
  { year: '1920', event: 'First round-the-world tour launched' },
  { year: '1962', event: 'Expanded to Japan and the Far East' },
  { year: '1987', event: 'Wildlife and safari programme established' },
  { year: '2005', event: 'Winner of first Condé Nast Traveller Award' },
  { year: '2015', event: 'Digital transformation — launched tailor-made platform' },
  { year: '2024', event: 'Now operating across 100+ destinations worldwide' },
];

const team = [
  { name: 'India & South Asia', years: '18 years', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&q=80' },
  { name: 'East Africa & Safaris', years: '14 years', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&q=80' },
  { name: 'Japan & East Asia', years: '12 years', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&q=80' },
  { name: 'Latin America', years: '11 years', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80' },
];

export default function About() {
  return (
    <main className="about-page">
      {/* Hero */}
      <div className="about-page__hero">
        <div className="about-page__hero-bg" />
        <div className="about-page__hero-overlay" />
        <div className="container about-page__hero-content">
          <span className="tag">Since 1758</span>
          <h1 className="about-page__hero-title">The World's Most Experienced<br /><em>Travel Company</em></h1>
          <p className="about-page__hero-sub">
            Over 265 years of extraordinary journeys. One enduring promise — to take you further.
          </p>
        </div>
      </div>

      {/* Our Story */}
      <section className="about-page__story">
        <div className="container about-page__story-inner">
          <div className="about-page__story-text">
            <p className="about-page__eyebrow">Our Story</p>
            <h2 className="section-title">A Journey That Began<br />in 1758</h2>
            <div className="gold-divider" />
            <p className="about-page__story-body">
              Cox & Kings was founded in London in 1758, originally as a regimental
              agent for the British Army. Our very first commission was to handle the
              logistics for Colonel Robert Clive's regiment in India — a journey that
              would set the tone for everything that followed.
            </p>
            <p className="about-page__story-body">
              Over two and a half centuries later, we remain guided by the same
              spirit of adventure and the same meticulous attention to detail. What
              began as military logistics has evolved into a world-leading travel
              company, taking tens of thousands of travellers each year to the
              world's most extraordinary destinations.
            </p>
            <p className="about-page__story-body">
              We believe that travel, at its best, is transformative. It opens minds,
              builds bridges between cultures, and creates memories that last a lifetime.
              Our job is simply to make sure every moment of your journey is as
              extraordinary as it can possibly be.
            </p>
          </div>
          <div className="about-page__story-images">
            <img src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80" alt="India" className="about-page__story-img about-page__story-img--main" />
            <img src="https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400&q=80" alt="Safari" className="about-page__story-img about-page__story-img--small" />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="about-page__values">
        <div className="container">
          <div className="about-page__values-header">
            <p className="about-page__eyebrow">What We Stand For</p>
            <h2 className="section-title">Our Values</h2>
            <div className="gold-divider" />
          </div>
          <div className="about-page__values-grid">
            {[
              { icon: Award, title: 'Excellence', desc: 'We hold ourselves to the highest standards in every aspect of the journey — from the hotels we select to the guides we train.' },
              { icon: Globe, title: 'Expertise', desc: 'Our specialists have lived, worked and travelled in the destinations they recommend. Their knowledge is first-hand, not second-hand.' },
              { icon: Users, title: 'Personalisation', desc: 'No two travellers are the same. Every itinerary we create is tailored to the individual — to your pace, passions and preferences.' },
              { icon: Shield, title: 'Integrity', desc: 'We are honest about what to expect, transparent in our pricing, and fully ATOL and ABTA protected for your peace of mind.' },
            ].map((v) => (
              <div key={v.title} className="about-page__value-card">
                <div className="about-page__value-icon">
                  <v.icon size={28} />
                </div>
                <h3 className="about-page__value-title">{v.title}</h3>
                <p className="about-page__value-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="about-page__timeline">
        <div className="container">
          <div className="about-page__timeline-header">
            <p className="about-page__eyebrow">Our Heritage</p>
            <h2 className="section-title">265 Years of Extraordinary Travel</h2>
            <div className="gold-divider" />
          </div>
          <div className="about-page__timeline-list">
            {milestones.map((m, i) => (
              <div key={m.year} className={`timeline-item ${i % 2 === 0 ? 'timeline-item--left' : 'timeline-item--right'}`}>
                <div className="timeline-item__content">
                  <span className="timeline-item__year">{m.year}</span>
                  <p className="timeline-item__event">{m.event}</p>
                </div>
                <div className="timeline-item__dot" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialists */}
      <section className="about-page__team" id="specialists">
        <div className="container">
          <p className="about-page__eyebrow">Our People</p>
          <h2 className="section-title">Meet Our Destination Specialists</h2>
          <div className="gold-divider" />
          <p className="section-subtitle about-page__team-sub">
            Every Cox & Kings specialist has extensive personal experience of the destinations they recommend.
            When you speak with our India expert, you speak with someone who has visited the Taj Mahal at sunrise.
          </p>
          <div className="about-page__team-grid">
            {team.map((member) => (
              <div key={member.name} className="about-page__team-card">
                <img src={member.image} alt={member.name} className="about-page__team-img" loading="lazy" />
                <div className="about-page__team-info">
                  <h3 className="about-page__team-name">{member.name} Specialist</h3>
                  <p className="about-page__team-years">{member.years} experience</p>
                  <Link to={CALLBACK} className="about-page__team-cta">Speak to me →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-page__cta">
        <div className="about-page__cta-bg" />
        <div className="container about-page__cta-inner">
          <h2 className="about-page__cta-title">Ready to Start Your Journey?</h2>
          <p className="about-page__cta-sub">Let our specialists craft your perfect itinerary — tailor-made for you.</p>
          <div className="about-page__cta-actions">
            <Link to="/tours" className="btn-gold">Browse All Tours</Link>
            <Link to={CALLBACK} className="about-page__cta-outline">Speak to a Specialist</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
