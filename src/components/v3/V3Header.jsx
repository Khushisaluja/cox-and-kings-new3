import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, ChevronDown, Menu, X } from 'lucide-react';
import { CONTACT } from '../../data/v3content';
import HeritageMark from './HeritageMark';
import './V3Header.css';

const NAV = [
  { label: 'Group Tours', to: '/tours', children: ['Europe', 'Japan', 'Australia & NZ', 'Africa Safaris'] },
  { label: 'Bespoke Holidays', to: '/contact', children: ['Honeymoons', 'Family Holidays', 'Luxury Journeys'] },
  { label: 'Destinations', to: '/tours' },
  { label: 'Experiences', to: '/tours' },
  { label: 'About', to: '/contact' },
];

export default function V3Header({ brandLink = '/final3a' }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <header className={`v3hdr ${scrolled ? 'is-scrolled' : ''}`}>
      {/* Tier 1 — brand bar */}
      <div className="v3hdr__brandbar">
        <div className="v3hdr__inner">
          <Link to={brandLink} className="v3hdr__logo" aria-label="Cox & Kings home">
            <img src="/cox-logo.svg" alt="Cox & Kings" />
          </Link>
          <span className="v3hdr__heritage"><HeritageMark variant="ink" size={13} /></span>
          <span className="v3hdr__tag">One of the world’s most trusted travel names</span>
          <div className="v3hdr__actions">
            <a href={CONTACT.phoneHref} className="v3hdr__phone">
              <Phone size={15} aria-hidden="true" />
              <span>{CONTACT.phoneDisplay}</span>
            </a>
            <Link to="/contact" className="v3-btn v3-btn--primary v3hdr__cta">
              <span className="v3hdr__cta-full">Speak to a Travel Expert</span>
              <span className="v3hdr__cta-short">Talk to an Expert</span>
            </Link>
            <button
              className="v3hdr__burger"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Tier 2 — offerings bar (desktop) */}
      <nav className="v3hdr__nav" aria-label="Primary">
        <div className="v3hdr__inner">
          <ul className="v3hdr__navlist">
            {NAV.map((n) => (
              <li className="v3hdr__navitem" key={n.label}>
                <Link to={n.to}>
                  {n.label}
                  {n.children && <ChevronDown size={14} aria-hidden="true" />}
                </Link>
                {n.children && (
                  <div className="v3hdr__menu">
                    {n.children.map((c) => (
                      <Link key={c} to={n.to}>{c}</Link>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`v3hdr__drawer ${open ? 'is-open' : ''}`} role="dialog" aria-modal="true" aria-hidden={!open}>
        <nav aria-label="Mobile">
          {NAV.map((n) => (
            <Link key={n.label} to={n.to} onClick={() => setOpen(false)}>{n.label}</Link>
          ))}
        </nav>
        <a href={CONTACT.phoneHref} className="v3-btn v3-btn--primary">
          <Phone size={16} /> {CONTACT.phoneDisplay}
        </a>
        <a href={CONTACT.whatsappHref} className="v3-link" target="_blank" rel="noreferrer">{CONTACT.whatsappDisplay}</a>
      </div>
      {open && <div className="v3hdr__scrim" onClick={() => setOpen(false)} aria-hidden="true" />}
    </header>
  );
}
