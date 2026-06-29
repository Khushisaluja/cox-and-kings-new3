import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X, Phone, ChevronDown, Globe } from 'lucide-react';
import './Header.css';

const navItems = [
  {
    label: 'Tours',
    href: '/tours',
    children: [
      { label: 'Escorted Group Tours', href: '/tours?type=escorted' },
      { label: 'Tailor-Made Holidays', href: '/tours?type=tailor-made' },
      { label: 'Luxury Journeys', href: '/tours?type=luxury' },
      { label: 'Family Adventures', href: '/tours?type=family' },
      { label: 'Solo Travel', href: '/tours?type=solo' },
      { label: 'River Cruises', href: '/tours?type=cruise' },
    ],
  },
  {
    label: 'Destinations',
    href: '/destinations',
    children: [
      { label: 'Asia', href: '/destinations?region=Asia' },
      { label: 'Europe', href: '/destinations?region=Europe' },
      { label: 'Africa & Middle East', href: '/destinations?region=Africa' },
      { label: 'Latin America', href: '/destinations?region=Latin+America' },
      { label: 'North America', href: '/destinations?region=North+America' },
      { label: 'Oceania', href: '/destinations?region=Oceania' },
    ],
  },
  {
    label: 'Experiences',
    href: '/experiences',
    children: [
      { label: 'Cultural Immersion', href: '/experiences?type=cultural' },
      { label: 'Wildlife & Safari', href: '/experiences?type=safari' },
      { label: 'Adventure', href: '/experiences?type=adventure' },
      { label: 'Culinary Journeys', href: '/experiences?type=culinary' },
      { label: 'Wellness Retreats', href: '/experiences?type=wellness' },
    ],
  },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();
  const searchRef = useRef(null);
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [location]);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const headerClass = `header ${scrolled ? 'header--scrolled' : ''} ${isHome && !scrolled ? 'header--transparent' : ''}`;

  return (
    <>
      <header className={headerClass}>
        {/* Top bar */}
        <div className="header__topbar">
          <div className="container header__topbar-inner">
            <span className="header__topbar-text">
              <Globe size={13} /> Established 1758 &mdash; The World's Most Experienced Travel Company
            </span>
            <div className="header__topbar-actions">
              <a href="tel:+443308808440" className="header__topbar-phone">
                <Phone size={13} /> +44 (0) 330 880 8440
              </a>
              <span className="header__topbar-sep">|</span>
              <Link to="/contact" className="header__topbar-link">Request a Brochure</Link>
            </div>
          </div>
        </div>

        {/* Main nav */}
        <div className="header__main">
          <div className="container header__main-inner">
            {/* Logo */}
            <Link to="/" className="header__logo">
              <img src="/cox-logo.svg" alt="Cox & Kings" className="header__logo-img" />
            </Link>

            {/* Desktop nav */}
            <nav className="header__nav" aria-label="Main navigation">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="header__nav-item"
                  onMouseEnter={() => item.children && setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    to={item.href}
                    className={`header__nav-link ${location.pathname === item.href ? 'active' : ''}`}
                  >
                    {item.label}
                    {item.children && <ChevronDown size={14} className="header__nav-caret" />}
                  </Link>
                  {item.children && activeDropdown === item.label && (
                    <div className="header__dropdown">
                      {item.children.map((child) => (
                        <Link key={child.label} to={child.href} className="header__dropdown-link">
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Actions */}
            <div className="header__actions">
              <button
                className="header__search-btn"
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Search"
              >
                {searchOpen ? <X size={20} /> : <Search size={20} />}
              </button>
              <Link to="/contact" className="header__cta btn-primary">
                Speak to an Expert
              </Link>
              <button
                className="header__menu-btn"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>

          {/* Search bar */}
          {searchOpen && (
            <div className="header__search-bar">
              <div className="container">
                <form className="header__search-form" onSubmit={(e) => e.preventDefault()}>
                  <Search size={18} />
                  <input
                    ref={searchRef}
                    type="text"
                    placeholder="Search destinations, tours, experiences..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="header__search-input"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="header__search-clear">
                      <X size={16} />
                    </button>
                  )}
                  <button type="submit" className="btn-primary header__search-submit">
                    Search
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && <div className="nav-overlay active" onClick={() => setMobileOpen(false)} />}

      {/* Mobile drawer */}
      <div className={`mobile-drawer ${mobileOpen ? 'mobile-drawer--open' : ''}`}>
        <div className="mobile-drawer__header">
          <Link to="/" className="header__logo">
            <img src="/cox-logo.svg" alt="Cox & Kings" style={{ height: '36px' }} />
          </Link>
          <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
            <X size={24} />
          </button>
        </div>
        <nav className="mobile-drawer__nav">
          {navItems.map((item) => (
            <div key={item.label} className="mobile-drawer__item">
              <Link to={item.href} className="mobile-drawer__link">
                {item.label}
              </Link>
              {item.children && (
                <div className="mobile-drawer__subnav">
                  {item.children.map((child) => (
                    <Link key={child.label} to={child.href} className="mobile-drawer__sublink">
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        <div className="mobile-drawer__footer">
          <Link to="/contact" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            Speak to an Expert
          </Link>
          <a href="tel:+443308808440" style={{ textAlign: 'center', marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
            <Phone size={16} /> +44 (0) 330 880 8440
          </a>
        </div>
      </div>
    </>
  );
}
