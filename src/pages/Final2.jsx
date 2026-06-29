import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, Phone, X, Menu, Home, Compass, ChevronDown, ChevronRight, ChevronLeft, ArrowRight, Star, ZoomIn,
  Facebook, Youtube, Linkedin, Instagram, Mail, Quote,
} from 'lucide-react';

// Classic-site components (reused as-is)
import Hero from '../components/Hero';
import SearchWidget from '../components/SearchWidget';
import FeaturedDestinations from '../components/FeaturedDestinations';
import FeaturedTours from '../components/FeaturedTours';
import ChatBot from '../components/ChatBot';

import '../pages/NewHome.css'; // new-site (.nh) styles
import './Home.css';           // classic "Ways to Experience" styles
import './Final.css';          // shared base overrides
import './Final2.css';         // final2-only refinements (a11y, polish, fixes)

// Unsplash photos come in small — request larger sizes for the gallery + lightbox
const photoMed = (u) => u.replace(/w=\d+/, 'w=700');
const photoBig = (u) => u.replace(/w=\d+/, 'w=1500');

/* ---------- New-site nav data ---------- */
const navItems = [
  {
    label: 'International Immersions',
    children: ['Europe', 'Southeast Asia', 'Middle East', 'Africa', 'The Americas', 'Australia & New Zealand'],
  },
  {
    label: 'Indian Getaways',
    children: ['Himalayas & North', 'Kerala & South', 'Rajasthan', 'Goa & Beaches', 'Northeast India', 'Andaman Islands'],
  },
  {
    label: 'All Inclusive Vacations',
    children: ['Beach Resorts', 'Cruise Holidays', 'Family Packages', 'Honeymoon Specials'],
  },
  {
    label: 'Tailormade Tours',
    children: ['Design Your Trip', 'Luxury Journeys', 'Group Departures', 'Corporate & MICE'],
  },
];

/* ---------- Classic "Ways to Experience" data ---------- */
const experienceTypes = [
  {
    title: 'Escorted Group Tours',
    desc: 'Travel with like-minded explorers, guided by our expert local specialists, with everything handled for you.',
    image: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=600&q=80',
    href: '/tours?type=escorted',
  },
  {
    title: 'Tailor-Made Holidays',
    desc: 'Your itinerary, your pace, your dream. Our specialists design bespoke journeys perfectly suited to you.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
    href: '/tours?type=tailor-made',
  },
  {
    title: 'Luxury Journeys',
    desc: "The finest hotels, private guides, exclusive access. Uncompromising luxury in the world's most extraordinary destinations.",
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&q=80',
    href: '/tours?type=luxury',
  },
  {
    title: 'Wildlife & Safari',
    desc: "Witness nature's most spectacular theatre — the Great Migration, Arctic polar bears, Galápagos wildlife and more.",
    image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600&q=80',
    href: '/experiences?type=safari',
  },
];

/* ---------- New-site testimonials ---------- */
const testimonialList = [
  {
    text: 'Thank you Aris and Emma Le for all your service and support during the Vietnam trip. It was really very lovely and easy for us to travel in the country where language is a great problem. You have developed such a system that really works. You people are using WhatsApp in a very interesting way. Thanks again and want to give thanks to Mr Naresh Verma and Chandni. Love you all ❤️❤️',
    name: 'Mr. Kumar Biswas', date: 'Jun 04, 2026', rating: 5,
    photos: [
      'https://images.unsplash.com/photo-1528127269322-539801943592?w=200&q=80',
      'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=200&q=80',
      'https://images.unsplash.com/photo-1504457047772-27faf1c00561?w=200&q=80',
    ],
  },
  {
    text: 'Our Japan tour with Cox & Kings was flawless from start to finish. Every transfer, every hotel, every guided walk was perfectly timed. The cherry blossom viewing in Kyoto was a once-in-a-lifetime experience that the team arranged beautifully. We will travel with you again without a doubt.',
    name: 'Mrs. Sunita Rao', date: 'May 12, 2026', rating: 5,
    photos: [
      'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=200&q=80',
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=200&q=80',
      'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=200&q=80',
    ],
  },
];

/* ---------- New-site "Journeys & Insights" ---------- */
const insights = [
  {
    tag: 'Culture', title: 'Hidden Japan: 7 Quiet Corners Beyond the Cities',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
  },
  {
    tag: 'Guides', title: 'Austria Tour Packages from India: All You Need to Know',
    image: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=800&q=80',
  },
  {
    tag: 'Inspiration', title: '5 Unique Things To Do in the Italian Lakes',
    image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&q=80',
  },
];

const pressLogos = [
  'NATIONAL GEOGRAPHIC', 'Robb Report', 'TRAVEL WEEKLY', 'Forbes',
  'TRAVEL+LEISURE', 'CONDÉ NAST', 'The New York Times', 'Los Angeles Times',
];

/* ---------- New-site "Journeys Our Experts Recommend" ---------- */
const curations = [
  {
    cat: 'Beaches · 6 Days', name: 'Thailand Shores and Strolls',
    meta: '6 Days · 5 Nights · 2 Cities', price: 54050,
    image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&q=80',
    note: 'Our Thailand destination specialist team and local ground handling partners ensure seamless coordination of hotels, island tours, transfers and authentic coastal experiences.',
  },
  {
    cat: 'Mountains · 8 Days', name: 'Himachal Hills & High Passes',
    meta: '8 Days · 7 Nights · 3 Cities', price: 225285,
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80',
    note: 'With extensive experience across Himachal Pradesh, Aanchi curates thoughtfully designed mountain getaways covering Manali, Kasauli and Shimla with cosy stays and scenic drives.',
  },
  {
    cat: 'Heritage · 7 Days', name: 'Iberian Heritage & Culture Journey',
    meta: '7 Days · 6 Nights · 4 Cities', price: 83243,
    image: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=800&q=80',
    note: 'With strong on-ground experience across Spain and Portugal, our expert team designs well-planned itineraries covering Lisbon, Seville and Madrid blending history with leisure.',
  },
];

export default function Final2() {
  // Testimonials carousel + photo lightbox
  const [tIndex, setTIndex] = useState(0);
  const [lightbox, setLightbox] = useState(null);
  const t = testimonialList[tIndex];

  // Mobile slide-out menu
  const [menuOpen, setMenuOpen] = useState(false);
  const [openSection, setOpenSection] = useState(null);
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // Focus management for the lightbox dialog
  const lbCloseRef = useRef(null);
  const lbReturnFocusRef = useRef(null);

  const prevRev = () => setTIndex((i) => (i - 1 + testimonialList.length) % testimonialList.length);
  const nextRev = () => setTIndex((i) => (i + 1) % testimonialList.length);
  const lbPrev = () => setLightbox((i) => (i - 1 + t.photos.length) % t.photos.length);
  const lbNext = () => setLightbox((i) => (i + 1) % t.photos.length);

  useEffect(() => {
    if (lightbox === null) return;
    // Remember what had focus, move focus into the dialog, restore on close.
    lbReturnFocusRef.current = document.activeElement;
    lbCloseRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') setLightbox(null);
      else if (e.key === 'ArrowLeft') lbPrev();
      else if (e.key === 'ArrowRight') lbNext();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      lbReturnFocusRef.current?.focus?.();
    };
  }, [lightbox, t.photos.length]);

  // Scroll-reveal: fade new-site sections/cards in as they enter the viewport.
  // Respect prefers-reduced-motion — reveal everything immediately, no animation.
  useEffect(() => {
    const els = document.querySelectorAll('.nh-reveal');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      els.forEach((el) => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* Self-contained landing page: neutralize any link that would jump to a
     DIFFERENT design (the classic /tours, /destinations, /classic, /contact,
     tour-detail pages, etc.). We intercept in the capture phase so navigation
     never fires, while hover states and in-component buttons (carousel,
     filters, chatbot) keep working. Phone/email/external links are allowed. */
  const blockRouteNav = (e) => {
    const a = e.target.closest?.('a');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href === '#' || href.startsWith('tel:') ||
        href.startsWith('mailto:') || href.startsWith('http')) return;
    e.preventDefault();
    e.stopPropagation();
  };
  // The search widget navigates via JS on submit — cancel that too.
  const blockFormNav = (e) => { e.preventDefault(); e.stopPropagation(); };

  return (
    <div className="final2-root" onClickCapture={blockRouteNav} onSubmitCapture={blockFormNav}>
    <a href="#final2-main" className="final2-skip">Skip to main content</a>
    <div className="nh final2">
      {/* ===================== NAVBAR — from NEW website ===================== */}
      <header className="nh-header">
        {/* Tier 1 — white brand bar */}
        <div className="nh-utility">
          <div className="nh-utility__inner">
            <Link to="/final2" className="nh-logo" aria-label="Cox & Kings home">
              <img src="/cox-logo.svg" alt="Cox & Kings" />
            </Link>
            <span className="nh-utility__tag">The World's Most Experienced Travel Company · Est. 1758</span>
            <Link to="/contact" className="nh-nav__cta">
              <span className="nh-nav__cta-full">Speak to a Travel Expert</span>
              <span className="nh-nav__cta-short">Talk to an Expert</span>
            </Link>
          </div>
        </div>
        {/* Tier 2 — blue offerings bar */}
        <div className="nh-mainnav">
          <nav className="nh-mainnav__inner" aria-label="Primary">
            {navItems.map((n) => (
              <div className="nh-mainnav__item" key={n.label}>
                <Link to="/tours" aria-haspopup={n.children ? 'true' : undefined}>
                  {n.label} {n.children && <ChevronDown size={14} className="nh-mainnav__caret" aria-hidden="true" />}
                </Link>
                {n.children && (
                  <div className="nh-dropdown">
                    {n.children.map((c) => (
                      <Link key={c} to="/tours">{c}</Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </header>

      {/* ===================== MOBILE SLIDE-OUT MENU ===================== */}
      <div className={`nh-mobnav ${menuOpen ? 'is-open' : ''}`} id="nh-mobile-menu">
        <div className="nh-mobnav__scrim" onClick={() => setMenuOpen(false)} aria-hidden="true" />
        <div className="nh-mobnav__panel" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="nh-mobnav__top">
            <span className="nh-mobnav__brand">Menu</span>
            <button type="button" className="nh-mobnav__close" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
              <X size={24} aria-hidden="true" />
            </button>
          </div>
          <nav className="nh-mobnav__nav" aria-label="Mobile primary">
            {navItems.map((n) => (
              <div className="nh-mobnav__group" key={n.label}>
                <button
                  type="button"
                  className="nh-mobnav__acc"
                  aria-expanded={openSection === n.label}
                  onClick={() => setOpenSection(openSection === n.label ? null : n.label)}
                >
                  {n.label}
                  <ChevronDown size={18} className="nh-mobnav__acc-caret" aria-hidden="true" />
                </button>
                {n.children && (
                  <div className="nh-mobnav__sub" hidden={openSection !== n.label}>
                    {n.children.map((c) => (
                      <Link key={c} to="/tours" className="nh-mobnav__sublink" onClick={() => setMenuOpen(false)}>{c}</Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
          <Link to="/contact" className="nh-mobnav__cta" onClick={() => setMenuOpen(false)}>
            <Phone size={16} aria-hidden="true" /> Speak to a Travel Expert
          </Link>
        </div>
      </div>

      {/* ===================== MOBILE BOTTOM NAV ===================== */}
      <nav className="nh-botnav" aria-label="Mobile">
        <button type="button" className="nh-botnav__item" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <Home size={21} aria-hidden="true" />
          <span>Home</span>
        </button>
        <button type="button" className="nh-botnav__item" onClick={() => document.querySelector('.featured-dest')?.scrollIntoView({ behavior: 'smooth' })}>
          <Compass size={21} aria-hidden="true" />
          <span>Explore</span>
        </button>
        <button
          type="button"
          className="nh-botnav__item"
          aria-haspopup="dialog"
          aria-expanded={menuOpen}
          aria-controls="nh-mobile-menu"
          onClick={() => setMenuOpen(true)}
        >
          <Menu size={21} aria-hidden="true" />
          <span>Menu</span>
        </button>
        <Link to="/contact" className="nh-botnav__cta">
          <Phone size={18} aria-hidden="true" />
          <span>Talk to Expert</span>
        </Link>
      </nav>

      <main id="final2-main" tabIndex={-1}>
      {/* ===================== CLASSIC: Hero, Search, Popular Destinations, Ways to Experience ===================== */}
      <div className="final-classic">
        <Hero />
        <SearchWidget />
        <FeaturedDestinations />

        {/* Ways to Experience the World */}
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
                    <h3 className="home__exp-title">{exp.title}</h3>
                    <p className="home__exp-desc">{exp.desc}</p>
                    <span className="home__exp-link">Explore &rarr;</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ===================== NEW: Two and a half centuries of crafting journeys ===================== */}
      <section className="nh-heritage">
        <div className="nh-heritage__bg" />
        <div className="nh-heritage__overlay" />
        <div className="nh-container nh-heritage__inner nh-reveal">
          <span className="nh-eyebrow nh-eyebrow--light">Since 1758</span>
          <h2 className="nh-h2 nh-h2--light">Two and a half centuries<br />of crafting journeys</h2>
          <p className="nh-sub nh-sub--light">
            From the age of sail to the era of bespoke travel, Cox &amp; Kings has guided
            generations of explorers across the globe — the world's most experienced travel
            company, and still writing new chapters today.
          </p>
          <div className="nh-tl">
            <div className="nh-tl__item">
              <span className="nh-tl__year">1758</span>
              <span className="nh-tl__lbl">Founded in London</span>
            </div>
            <div className="nh-tl__item">
              <span className="nh-tl__year">1900s</span>
              <span className="nh-tl__lbl">Pioneering grand world tours</span>
            </div>
            <div className="nh-tl__item">
              <span className="nh-tl__year">2000s</span>
              <span className="nh-tl__lbl">Tailor-made luxury journeys</span>
            </div>
            <div className="nh-tl__item">
              <span className="nh-tl__year">Today</span>
              <span className="nh-tl__lbl">Bespoke travel, redefined</span>
            </div>
          </div>
          <Link to="/classic" className="nh-btn nh-btn--ghost">Discover Our Story <ArrowRight size={15} /></Link>
        </div>
      </section>

      {/* ===================== NEW: Real journeys, captured by real travellers ===================== */}
      <section className="nh-revs" id="reviews">
        <div className="nh-container">
          <div className="nh-revs__head nh-reveal">
            <span className="nh-eyebrow">TRAVELLER STORIES</span>
            <h2 className="nh-h2">Real journeys, captured by real travellers</h2>
            <p className="nh-sub">Tap any photo to see the moments that made the trip — straight from the people who lived them.</p>
          </div>

          <div className="nh-revs__grid nh-reveal">
            {/* Photo gallery — the highlight */}
            <div className="nh-revs__gallery">
              {t.photos.slice(0, 3).map((p, i) => (
                <button
                  key={i}
                  className={`nh-revphoto nh-revphoto--${i}`}
                  style={{ backgroundImage: `url(${photoMed(p)})` }}
                  onClick={() => setLightbox(i)}
                  aria-label={`View photo ${i + 1} from ${t.name}`}
                >
                  <span className="nh-revphoto__zoom"><span className="nh-revphoto__zoomi"><ZoomIn size={20} /></span></span>
                  {i === 2 && t.photos.length > 3 && (
                    <span className="nh-revphoto__more">+{t.photos.length - 3}</span>
                  )}
                </button>
              ))}
            </div>

            {/* Quote + author */}
            <div className="nh-revs__content">
              <Quote className="nh-revs__qmark" size={40} />
              <div className="nh-rev__stars">
                {[...Array(t.rating)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
              </div>
              <p className="nh-rev__text">{t.text}</p>
              <div className="nh-rev__author">
                <div>
                  <strong>{t.name}</strong>
                  <span className="nh-rev__date">{t.date}</span>
                </div>
                <div className="nh-revs__nav">
                  <button onClick={prevRev} aria-label="Previous review"><ChevronLeft size={18} /></button>
                  <span className="nh-revs__count">{tIndex + 1} / {testimonialList.length}</span>
                  <button onClick={nextRev} aria-label="Next review"><ChevronRight size={18} /></button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lightbox */}
        {lightbox !== null && (
          <div className="nh-lightbox" onClick={() => setLightbox(null)} role="dialog" aria-modal="true" aria-label={`Travel photos from ${t.name}`}>
            <button ref={lbCloseRef} className="nh-lightbox__close" onClick={() => setLightbox(null)} aria-label="Close photo viewer"><X size={22} /></button>
            <button
              className="nh-lightbox__nav nh-lightbox__nav--prev"
              onClick={(e) => { e.stopPropagation(); lbPrev(); }} aria-label="Previous photo"
            ><ChevronLeft size={26} /></button>
            <figure className="nh-lightbox__fig" onClick={(e) => e.stopPropagation()}>
              <img src={photoBig(t.photos[lightbox])} alt={`Travel photo from ${t.name}`} />
              <figcaption>{t.name} · Photo {lightbox + 1} of {t.photos.length}</figcaption>
            </figure>
            <button
              className="nh-lightbox__nav nh-lightbox__nav--next"
              onClick={(e) => { e.stopPropagation(); lbNext(); }} aria-label="Next photo"
            ><ChevronRight size={26} /></button>
          </div>
        )}
      </section>

      {/* ===================== CLASSIC: Handpicked Tours & Holidays ===================== */}
      <div className="final-classic">
        <FeaturedTours />
      </div>

      {/* ===================== NEW: Journeys & Insights ===================== */}
      <section className="nh-insp">
        <div className="nh-container nh-insp__head nh-reveal">
          <div>
            <span className="nh-eyebrow">INSPIRATION STATION</span>
            <h2 className="nh-h2">Journeys &amp; Insights</h2>
            <p className="nh-sub">Stories, guides and insights from travelers and experts to fuel your next journey.</p>
          </div>
          <Link to="/tours" className="nh-insp__explore">EXPLORE <ArrowRight size={15} aria-hidden="true" /></Link>
        </div>
        <div className="nh-container nh-insp__grid nh-reveal">
          {insights.map((a) => (
            <Link to="/tours" key={a.title} className="nh-inspcard">
              <div className="nh-inspcard__img" style={{ backgroundImage: `url(${a.image})` }} role="img" aria-label={a.title} />
              <div className="nh-inspcard__overlay" />
              <span className="nh-inspcard__tag">{a.tag}</span>
              <h3>{a.title}</h3>
              <span className="nh-inspcard__read">Read article <ArrowRight size={14} aria-hidden="true" /></span>
            </Link>
          ))}
        </div>
      </section>

      {/* ===================== NEW: AS SEEN IN ===================== */}
      <section className="nh-press">
        <p className="nh-press__label">AS SEEN IN</p>
        <div className="nh-container nh-press__row">
          {pressLogos.map((l) => <span key={l} className="nh-press__logo">{l}</span>)}
        </div>
      </section>

      {/* ===================== NEW: Journeys Our Experts Recommend ===================== */}
      <section className="nh-cur">
        <div className="nh-container">
          <div className="nh-reveal">
            <span className="nh-eyebrow">OUR CURATIONS</span>
            <h2 className="nh-h2">Journeys Our Experts Recommend</h2>
            <p className="nh-sub">Tried and tested by our seasonal explorers.</p>
          </div>
          <div className="nh-cur__grid nh-reveal">
            {curations.map((c) => (
              <article key={c.name} className="nh-curcard">
                <div className="nh-curcard__img">
                  <div className="nh-curcard__imgbg" style={{ backgroundImage: `url(${c.image})` }} />
                  <span className="nh-curcard__cat">{c.cat}</span>
                </div>
                <div className="nh-curcard__body">
                  <h3>{c.name}</h3>
                  <p className="nh-curcard__meta">{c.meta}</p>
                  <p className="nh-curcard__note">{c.note}</p>
                  <div className="nh-curcard__foot">
                    <Link to="/classic" className="nh-readmore">READ MORE <ArrowRight size={13} /></Link>
                    <span className="nh-curcard__price">₹{c.price.toLocaleString('en-IN')} <small>/ person</small></span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      </main>

      {/* ===================== FOOTER — from NEW website ===================== */}
      <footer className="nh-footer">
        <div className="nh-container nh-footer__top">
          <div className="nh-footer__brand">
            <img src="/cox-logo.svg" alt="Cox & Kings" />
            <p className="nh-footer__tag">260+ Years of Travel,<br />Trusted by Generations</p>
            <span className="nh-footer__h">CONTACT US</span>
            <a href="tel:+918556001700"><Phone size={14} /> +91 8556001700</a>
            <a href="mailto:holidays@coxandkings.com"><Mail size={14} /> holidays@coxandkings.com</a>
            <div className="nh-footer__social">
              <a href="#" aria-label="Facebook"><Facebook size={17} /></a>
              <a href="#" aria-label="YouTube"><Youtube size={17} /></a>
              <a href="#" aria-label="LinkedIn"><Linkedin size={17} /></a>
              <a href="#" aria-label="Instagram"><Instagram size={17} /></a>
            </div>
          </div>

          <div className="nh-footer__cols">
            <div>
              <span className="nh-footer__h">EXPLORE</span>
              <Link to="/tours">International Immersions</Link>
              <Link to="/tours">All Inclusive Vacations</Link>
              <Link to="/tours">Indian Getaways</Link>
              <Link to="/tours">Tailormade Journeys</Link>
              <span className="nh-footer__h nh-footer__h--gap">QUICK LINKS</span>
              <a href="#">Sitemap</a>
              <a href="#">Refund Policy</a>
              <a href="#">Cancellation Policy</a>
            </div>
            <div>
              <span className="nh-footer__h">ABOUT</span>
              <Link to="/classic">About Us</Link>
              <Link to="/classic">Contact Us</Link>
              <a href="#">Inspiration Station</a>
              <a href="#">Testimonials</a>
              <a href="#">Press &amp; Media</a>
              <a href="#">FAQs</a>
            </div>
            <div>
              <span className="nh-footer__h">PARTNER WITH US</span>
              <a href="#">Become a Franchise Partner</a>
              <a href="#">Collaborate With Us</a>
              <a href="#">Become a Preferred Sales Partner</a>
            </div>
          </div>
        </div>
        <div className="nh-container nh-footer__bottom">
          <p>©2026 Cox &amp; Kings</p>
          <div className="nh-footer__legal">
            <a href="#">Terms &amp; Conditions</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </footer>
    </div>

    {/* AI assistant — from the classic website (floating widget, classic styling) */}
    <ChatBot />
    </div>
  );
}
