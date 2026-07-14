import { useState, useEffect, useRef } from 'react';
import { SmartLink as Link, CALLBACK } from '../components/ScheduleCall';
import {
  Search, Phone, X, ChevronDown, ChevronRight, ChevronLeft, ArrowRight, Star, MapPin, Compass, Calendar, ZoomIn,
  Facebook, Youtube, Linkedin, Instagram, Mail, Quote,
} from 'lucide-react';

// Unsplash photos come in at w=200 — request larger sizes for the gallery + lightbox
const photoMed = (u) => u.replace(/w=\d+/, 'w=700');
const photoBig = (u) => u.replace(/w=\d+/, 'w=1500');
import { tours } from '../data/tours';
import './NewHome.css';

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

const quickTabs = [
  'Trending Trips', 'Beach Escapes', 'Mountain Getaways', 'Honeymoon',
  'Family Holidays', 'Wildlife & Safari', 'Easy Visa', 'Weekend Breaks',
];

const tileImg = (id) => `https://images.unsplash.com/${id}?w=500&q=80`;
const escapeTiles = [
  { name: 'Thailand', img: tileImg('photo-1528181304800-259b08848526') },
  { name: 'Spain & Portugal', img: tileImg('photo-1543783207-ec64e4d95325') },
  { name: 'Philippines', img: tileImg('photo-1518509562904-e7ef99cdcc86') },
  { name: 'Andamans', img: tileImg('photo-1559494007-9f5847c49d94') },
  { name: 'Kerala', img: tileImg('photo-1602216056096-3b40cc0c9944') },
  { name: 'Switzerland', img: tileImg('photo-1530122037265-a5f1f91d3b99') },
  { name: 'Japan', img: tileImg('photo-1493976040374-85c8e12f0c0e') },
  { name: 'Canada', img: tileImg('photo-1503614472-8c93d56e92ce') },
  { name: 'Greece', img: tileImg('photo-1533105079780-92b9be482077') },
  { name: 'Vietnam', img: tileImg('photo-1528127269322-539801943592') },
];

const topPicks = tours.slice(0, 7).map((t) => ({
  id: t.id, title: t.title, destination: t.destination,
  duration: t.duration, price: t.price, image: t.image, category: t.category,
  rating: t.rating, reviews: t.reviews,
}));

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

export default function NewHome() {
  const [activeTab, setActiveTab] = useState(0);
  const [query, setQuery] = useState('');
  const [tIndex, setTIndex] = useState(0);
  const [promoOpen, setPromoOpen] = useState(true);

  const t = testimonialList[tIndex];
  const picksRef = useRef(null);
  const scrollPicks = (dir) => picksRef.current?.scrollBy({ left: dir * 386, behavior: 'smooth' });

  // Reviews: photo lightbox
  const [lightbox, setLightbox] = useState(null); // photo index within current review, or null
  const prevRev = () => setTIndex((i) => (i - 1 + testimonialList.length) % testimonialList.length);
  const nextRev = () => setTIndex((i) => (i + 1) % testimonialList.length);
  const lbPrev = () => setLightbox((i) => (i - 1 + t.photos.length) % t.photos.length);
  const lbNext = () => setLightbox((i) => (i + 1) % t.photos.length);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setLightbox(null);
      else if (e.key === 'ArrowLeft') lbPrev();
      else if (e.key === 'ArrowRight') lbNext();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [lightbox, t.photos.length]);

  // Scroll-reveal: fade sections/cards in as they enter the viewport
  useEffect(() => {
    const els = document.querySelectorAll('.nh-reveal');
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

  return (
    <div className="nh">
      {/* ===================== HEADER (two-tone) ===================== */}
      <header className="nh-header">
        {/* Tier 1 — white brand bar */}
        <div className="nh-utility">
          <div className="nh-utility__inner">
            <Link to="/" className="nh-logo" aria-label="Cox & Kings home">
              <img src="/cox-logo.svg" alt="Cox & Kings" />
            </Link>
            <span className="nh-utility__tag">The World's Most Experienced Travel Company · Est. 1758</span>
            <Link to={CALLBACK} className="nh-nav__cta">
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
                <a href="#picks">
                  {n.label} {n.children && <ChevronDown size={14} className="nh-mainnav__caret" />}
                </a>
                {n.children && (
                  <div className="nh-dropdown">
                    {n.children.map((c) => (
                      <a key={c} href="#picks">{c}</a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </header>

      {/* ===================== HERO ===================== */}
      <section className="nh-hero">
        <div className="nh-hero__bg" />
        <div className="nh-hero__overlay" />
        <div className="nh-hero__inner">
          <img src="/cox-logo.svg" alt="Cox & Kings" className="nh-hero__crest" />
          <h1 className="nh-hero__title">Every great journey begins<br />with fine company</h1>

          <form className="nh-hsearch" onSubmit={(e) => e.preventDefault()} role="search" aria-label="Find a trip">
            <div className="nh-sfield">
              <MapPin size={19} />
              <input
                type="text" placeholder="Where do you want to go?"
                value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Destination"
              />
            </div>
            <span className="nh-sdiv" />
            <div className="nh-sfield">
              <Compass size={19} />
              <select className="nh-sselect" defaultValue="" aria-label="Experience">
                <option value="" disabled hidden>What do you want to see?</option>
                <option>Beaches &amp; Islands</option>
                <option>Mountains &amp; Nature</option>
                <option>Heritage &amp; Culture</option>
                <option>Wildlife &amp; Safari</option>
                <option>Cruises</option>
                <option>City Breaks</option>
              </select>
            </div>
            <span className="nh-sdiv" />
            <div className="nh-sfield">
              <Calendar size={19} />
              <select className="nh-sselect" defaultValue="" aria-label="When">
                <option value="" disabled hidden>When do you want to go?</option>
                <option>Anytime</option>
                <option>Next 3 months</option>
                <option>Jul – Sep 2026</option>
                <option>Oct – Dec 2026</option>
                <option>2027 &amp; beyond</option>
              </select>
            </div>
            <button type="submit" className="nh-sbtn"><Search size={18} /> Search</button>
          </form>

          <div className="nh-hero__alt">
            <span className="nh-hero__alt-txt">Looking for something bespoke?</span>
            <a href="#picks" className="nh-hero__build">Build a tailor-made itinerary <ArrowRight size={16} /></a>
          </div>

          <a href="#reviews" className="nh-hero__rating">
            <span className="nh-hero__rating-stars">
              {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
            </span>
            <strong>4.5</strong>
            <span className="nh-hero__rating-cap">2,400+ traveller reviews</span>
            <ChevronRight size={16} />
          </a>
        </div>

        <a href="#explore" className="nh-hero__scroll" aria-label="Scroll to explore">
          <span>Explore more</span>
          <ChevronDown size={18} />
        </a>
      </section>

      {/* ===================== QUICK ESCAPES ===================== */}
      <section className="nh-quick" id="explore">
        <div className="nh-container nh-quick__head nh-reveal">
          <span className="nh-eyebrow">GET INSPIRED</span>
          <h2 className="nh-h2">Quick Escapes &amp; Once in a Lifetime Journeys</h2>
          <p className="nh-sub">Designed to match your pace, mood, and dreams.</p>
        </div>
        <div className="nh-container nh-quick__tabs nh-reveal">
          <div className="nh-tabs">
            {quickTabs.map((tab, i) => (
              <button key={tab} className={`nh-tab ${activeTab === i ? 'is-active' : ''}`} onClick={() => setActiveTab(i)}>
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="nh-container nh-tiles nh-reveal">
          {escapeTiles.map((d) => (
            <a href="#picks" key={d.name} className="nh-tile">
              <div className="nh-tile__img" style={{ backgroundImage: `url(${d.img})` }} />
              <div className="nh-tile__shade" />
              <span className="nh-tile__name">{d.name}</span>
              <span className="nh-tile__go" aria-hidden="true"><ArrowRight size={16} /></span>
            </a>
          ))}
        </div>
        <div className="nh-container nh-quick__more">
          <a href="#picks" className="nh-textlink">Browse all destinations <ArrowRight size={15} /></a>
        </div>
      </section>

      {/* ===================== TOP PICKS ===================== */}
      <section className="nh-picks" id="picks">
        <div className="nh-container nh-picks__head nh-reveal">
          <div>
            <span className="nh-eyebrow">CURATED FOR YOU</span>
            <h2 className="nh-h2">Our Top Picks</h2>
            <p className="nh-sub">It's on our radar, it should be on yours too.</p>
          </div>
          <div className="nh-picks__controls">
            <button className="nh-picks__arrow" onClick={() => scrollPicks(-1)} aria-label="Scroll left">
              <ChevronLeft size={20} />
            </button>
            <button className="nh-picks__arrow" onClick={() => scrollPicks(1)} aria-label="Scroll right">
              <ChevronRight size={20} />
            </button>
            <Link to="/classic" className="nh-textlink nh-picks__all">View all trips <ArrowRight size={15} /></Link>
          </div>
        </div>
        <div className="nh-picks__track nh-reveal" ref={picksRef}>
          {topPicks.map((p) => (
            <Link to="/classic" key={p.id} className="nh-pick">
              <div className="nh-pick__img">
                <div className="nh-pick__imgbg" style={{ backgroundImage: `url(${p.image})` }} />
                <span className="nh-pick__cat">{p.category}</span>
                <span className="nh-pick__rating"><Star size={12} fill="currentColor" /> {p.rating}</span>
              </div>
              <div className="nh-pick__body">
                <span className="nh-pick__dest"><MapPin size={13} /> {p.destination}</span>
                <h3>{p.title}</h3>
                <p className="nh-pick__meta">{p.duration} · {p.reviews} reviews</p>
                <p className="nh-pick__price"><span className="nh-pick__from">from</span> ₹{(p.price * 83).toLocaleString('en-IN')} <span>/ person</span></p>
                <span className="nh-pick__link">View Trip <ArrowRight size={14} /></span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===================== HERITAGE (260+ YEARS) ===================== */}
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

      {/* ===================== BLUE MEDALLION BAND ===================== */}
      <section className="nh-band">
        <svg className="nh-band__wave nh-band__wave--top" viewBox="0 0 1440 110" preserveAspectRatio="none">
          <path d="M0,0 H1440 V95 C1080,5 360,5 0,95 Z" fill="#fff" />
        </svg>

        <div className="nh-band__marks">OF LIBERTY · ROUND THE WORLD · TOUR DE FRANCE</div>

        <div className="nh-container nh-band__grid nh-reveal">
          <div className="nh-band__col nh-band__col--left">
            <div className="nh-statblock">
              <h3>100+ Destinations Worldwide</h3>
              <p>From cultural escapes to relaxing retreats, our network spans the globe.</p>
            </div>
            <div className="nh-statblock">
              <h3>1M+ Happy Travelers</h3>
              <p>We take pride in curating millions of unforgettable memories.</p>
            </div>
          </div>

          <div className="nh-medallion">
            <div className="nh-medallion__img" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=600&q=80)' }} />
            <div className="nh-medallion__overlay" />
            <div className="nh-medallion__content">
              <span className="nh-medallion__num">260+</span>
              <span className="nh-medallion__cap">Years of Travel</span>
            </div>
          </div>

          <div className="nh-band__col nh-band__col--right">
            <div className="nh-statblock">
              <h3>Global Legacy with Local Access</h3>
              <p>With trusted partners worldwide we open doors others can't.</p>
            </div>
            <div className="nh-statblock">
              <h3>90% Travel With Us Again</h3>
              <p>Travelers return for the warmth, the detail, and the difference.</p>
            </div>
          </div>
        </div>

        <div className="nh-band__cta">
          <Link to="/classic" className="nh-btn nh-btn--ghost">ABOUT US <ArrowRight size={15} /></Link>
        </div>

        <svg className="nh-band__wave nh-band__wave--bottom" viewBox="0 0 1440 110" preserveAspectRatio="none">
          <path d="M0,110 H1440 V15 C1080,105 360,105 0,15 Z" fill="#fff" />
        </svg>
      </section>

      {/* ===================== CURATIONS ===================== */}
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

      {/* ===================== TESTIMONIALS ===================== */}
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
          <div className="nh-lightbox" onClick={() => setLightbox(null)} role="dialog" aria-modal="true">
            <button className="nh-lightbox__close" onClick={() => setLightbox(null)} aria-label="Close"><X size={22} /></button>
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

      {/* ===================== INSPIRATION STATION ===================== */}
      <section className="nh-insp">
        <div className="nh-container nh-insp__head nh-reveal">
          <div>
            <span className="nh-eyebrow">INSPIRATION STATION</span>
            <h2 className="nh-h2">Journeys &amp; Insights</h2>
            <p className="nh-sub">Stories, guides and insights from travelers and experts to fuel your next journey.</p>
          </div>
          <a href="#picks" className="nh-insp__explore">EXPLORE <ArrowRight size={15} /></a>
        </div>
        <div className="nh-container nh-insp__grid nh-reveal">
          {insights.map((a) => (
            <a href="#picks" key={a.title} className="nh-inspcard">
              <div className="nh-inspcard__img" style={{ backgroundImage: `url(${a.image})` }} />
              <div className="nh-inspcard__overlay" />
              <span className="nh-inspcard__tag">{a.tag}</span>
              <h3>{a.title}</h3>
              <span className="nh-inspcard__read">Read article <ArrowRight size={14} /></span>
            </a>
          ))}
        </div>
      </section>

      {/* ===================== AS SEEN IN ===================== */}
      <section className="nh-press">
        <p className="nh-press__label">AS SEEN IN</p>
        <div className="nh-container nh-press__row">
          {pressLogos.map((l) => <span key={l} className="nh-press__logo">{l}</span>)}
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
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
              <a href="#picks">International Immersions</a>
              <a href="#picks">All Inclusive Vacations</a>
              <a href="#picks">Indian Getaways</a>
              <a href="#picks">Tailormade Journeys</a>
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

      {/* ===================== FLOATING PROMO ===================== */}
      {promoOpen && (
        <div className="nh-promo">
          <button className="nh-promo__close" onClick={() => setPromoOpen(false)} aria-label="Close"><X size={15} /></button>
          <div className="nh-promo__icon"><ArrowRight size={18} style={{ transform: 'rotate(-45deg)' }} /></div>
          <p>18 islands, a lifetime of memories — 95% of travellers say Greece is where the soul finally exhales.</p>
          <a href="#picks" className="nh-promo__btn">EXPLORE TRIPS TO GREECE</a>
        </div>
      )}
    </div>
  );
}
