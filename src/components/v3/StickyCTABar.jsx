import { useState, useEffect } from 'react';
import { Phone, MapPin } from 'lucide-react';
import { CONTACT } from '../../data/v3content';
import './StickyCTABar.css';

const SCROLL_THRESHOLD = 700;

export default function StickyCTABar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > SCROLL_THRESHOLD);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    // Check on mount in case page loads already scrolled
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={`v3sticky__bar${visible ? ' v3sticky__bar--visible' : ''}`}
      aria-label="Quick contact actions"
      role="navigation"
    >
      <a
        href={CONTACT.phoneHref}
        className="v3sticky__action v3sticky__action--secondary"
        aria-label={`Call us: ${CONTACT.phoneDisplay}`}
      >
        <Phone size={17} aria-hidden="true" />
        <span>Talk to an Expert</span>
      </a>

      <div className="v3sticky__divider" aria-hidden="true" />

      <a
        href="#v3-plan"
        className="v3sticky__action v3sticky__action--primary"
        aria-label="Go to trip planning form"
      >
        <MapPin size={17} aria-hidden="true" />
        <span>Plan My Trip</span>
      </a>
    </div>
  );
}
