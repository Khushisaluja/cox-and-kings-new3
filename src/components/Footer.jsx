import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube, Linkedin } from 'lucide-react';
import './Footer.css';

const footerLinks = {
  'Tours & Holidays': [
    { label: 'Escorted Group Tours', href: '/tours?type=escorted' },
    { label: 'Tailor-Made Holidays', href: '/tours?type=tailor-made' },
    { label: 'Luxury Journeys', href: '/tours?type=luxury' },
    { label: 'Family Adventures', href: '/tours?type=family' },
    { label: 'Solo Travel', href: '/tours?type=solo' },
    { label: 'River Cruises', href: '/tours?type=cruise' },
  ],
  'Destinations': [
    { label: 'Asia', href: '/destinations?region=Asia' },
    { label: 'Europe', href: '/destinations?region=Europe' },
    { label: 'Africa & Middle East', href: '/destinations?region=Africa' },
    { label: 'Latin America', href: '/destinations?region=Latin+America' },
    { label: 'North America', href: '/destinations?region=North+America' },
    { label: 'Oceania', href: '/destinations?region=Oceania' },
  ],
  'Experiences': [
    { label: 'Cultural Immersion', href: '/experiences?type=cultural' },
    { label: 'Wildlife & Safari', href: '/experiences?type=safari' },
    { label: 'Adventure Travel', href: '/experiences?type=adventure' },
    { label: 'Culinary Journeys', href: '/experiences?type=culinary' },
    { label: 'Photography Tours', href: '/experiences?type=photography' },
    { label: 'Wellness Retreats', href: '/experiences?type=wellness' },
  ],
  'Company': [
    { label: 'About Cox & Kings', href: '/about' },
    { label: 'Our Specialists', href: '/about#specialists' },
    { label: 'Awards & Recognition', href: '/about#awards' },
    { label: 'Responsible Tourism', href: '/about#responsible' },
    { label: 'Press & Media', href: '/about#press' },
    { label: 'Careers', href: '/careers' },
  ],
};

export default function Footer() {
  return (
    <footer className="footer">
      {/* Awards bar */}
      <div className="footer__awards">
        <div className="container footer__awards-inner">
          <span className="footer__awards-label">Proud Recipients Of</span>
          <div className="footer__awards-list">
            <span className="footer__award">Condé Nast Traveller Award</span>
            <span className="footer__award-sep" />
            <span className="footer__award">Travel + Leisure World's Best</span>
            <span className="footer__award-sep" />
            <span className="footer__award">British Travel Award</span>
            <span className="footer__award-sep" />
            <span className="footer__award">ATOL Protected</span>
            <span className="footer__award-sep" />
            <span className="footer__award">ABTA Member</span>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="footer__main">
        <div className="container footer__main-inner">
          {/* Brand column */}
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <img src="/cox-logo.svg" alt="Cox & Kings" className="footer__logo-img" />
            </Link>
            <p className="footer__brand-text">
              The world's most experienced travel company, crafting extraordinary
              journeys since 1758. From the Taj Mahal to the Serengeti — we take
              you there with unrivalled care and expertise.
            </p>
            <div className="footer__contact">
              <a href="tel:+443308808440" className="footer__contact-item">
                <Phone size={15} /> +44 (0) 330 880 8440
              </a>
              <a href="mailto:tours@coxandkings.co.uk" className="footer__contact-item">
                <Mail size={15} /> tours@coxandkings.co.uk
              </a>
              <span className="footer__contact-item">
                <MapPin size={15} /> 30 Millbank, London SW1P 4EE
              </span>
            </div>
            <div className="footer__social">
              {[
                { Icon: Facebook, href: '#', label: 'Facebook' },
                { Icon: Twitter, href: '#', label: 'Twitter' },
                { Icon: Instagram, href: '#', label: 'Instagram' },
                { Icon: Youtube, href: '#', label: 'YouTube' },
                { Icon: Linkedin, href: '#', label: 'LinkedIn' },
              ].map(({ Icon, href, label }) => (
                <a key={label} href={href} className="footer__social-link" aria-label={label}>
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading} className="footer__col">
              <h4 className="footer__col-title">{heading}</h4>
              <ul className="footer__col-links">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link to={href} className="footer__link">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p className="footer__copy">
            © {new Date().getFullYear()} Cox & Kings Ltd. All rights reserved. Established 1758.
          </p>
          <div className="footer__bottom-links">
            <Link to="/privacy" className="footer__bottom-link">Privacy Policy</Link>
            <Link to="/terms" className="footer__bottom-link">Terms & Conditions</Link>
            <Link to="/cookies" className="footer__bottom-link">Cookie Policy</Link>
            <Link to="/sitemap" className="footer__bottom-link">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
