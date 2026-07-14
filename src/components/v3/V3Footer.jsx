import { SmartLink as Link, CALLBACK } from '../ScheduleCall';
import { Phone, Mail, MessageCircle, Star } from 'lucide-react';
import { CONTACT, ASSOCIATIONS, RATING } from '../../data/v3content';
import HeritageMark from './HeritageMark';
import './V3Footer.css';

const COLUMNS = [
  { title: 'Explore', links: [['Group Tours', '/tours'], ['Bespoke Holidays', CALLBACK], ['Destinations', '/tours'], ['Luxury Journeys', '/tours'], ['Experiences', '/tours']] },
  { title: 'Company', links: [['About Cox & Kings', CALLBACK], ['Our Specialists', CALLBACK], ['Traveller Stories', CALLBACK], ['Press & Awards', CALLBACK], ['Careers', CALLBACK]] },
  { title: 'Plan', links: [['Talk to an Expert', CALLBACK], ['Find My Perfect Trip', '#v3-plan'], ['Visa Support', CALLBACK], ['Travel Insurance', CALLBACK], ['FAQs', CALLBACK]] },
];

export default function V3Footer() {
  return (
    <footer className="v3ftr">
      <div className="v3ftr__top v3-container">
        <div className="v3ftr__brand">
          <img src="/cox-logo.svg" alt="Cox & Kings" className="v3ftr__logo" />
          <div className="v3ftr__heritage"><HeritageMark variant="gold" /></div>
          <p className="v3ftr__tag">260+ years of travel, trusted by generations.</p>
          <div className="v3ftr__contact">
            <a href={CONTACT.phoneHref}><Phone size={15} /> {CONTACT.phoneDisplay}</a>
            <a href={`mailto:${CONTACT.email}`}><Mail size={15} /> {CONTACT.email}</a>
            <a href={CONTACT.whatsappHref} target="_blank" rel="noreferrer"><MessageCircle size={15} /> {CONTACT.whatsappDisplay}</a>
          </div>
        </div>
        {COLUMNS.map((col) => (
          <nav className="v3ftr__col" key={col.title} aria-label={col.title}>
            <h4>{col.title}</h4>
            {col.links.map(([label, to]) => (
              to.startsWith('#')
                ? <a key={label} href={to}>{label}</a>
                : <Link key={label} to={to}>{label}</Link>
            ))}
          </nav>
        ))}
      </div>

      <div className="v3ftr__trust v3-container">
        <span className="v3-rating">
          <span className="v3-rating__stars">{[...Array(RATING.stars)].map((_, i) => <Star key={i} size={13} fill="currentColor" />)}</span>
          <strong>{RATING.score}</strong> · {RATING.count} traveller reviews
        </span>
        <span className="v3ftr__assoc">Proud members of {ASSOCIATIONS.join(' · ')}</span>
      </div>

      <div className="v3ftr__legal v3-container">
        <span>© {new Date().getFullYear()} Cox & Kings. Established 1758.</span>
        <span className="v3ftr__legal-links">
          <Link to={CALLBACK}>Privacy</Link>
          <Link to={CALLBACK}>Terms</Link>
          <Link to={CALLBACK}>Cookies</Link>
        </span>
      </div>
    </footer>
  );
}
