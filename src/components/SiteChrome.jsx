/* ============================================================================
   Shared site chrome — the SAME navbar + footer as /new-homepage (New.jsx).

   New.jsx builds its chrome inline, so pages that want to match it had been
   re-implementing it. This component lifts that markup out so /about-us2 and
   /about-us2/team use the real thing — the h26- nav with mega-menu flyouts,
   the phone link, the pill CTA, the burger + mobile slide-in menu, and the
   h26-footer — rather than an approximation.

   It pulls the same stylesheets New.jsx does. NewTypography.css is scoped to
   `.h26.new-typo`, so any page using this chrome must carry BOTH classes on
   its root element to get Cormorant Garamond + Work Sans.

   Buttons available from these sheets (use these, not bespoke ones):
     .h26-btn.h26-btn-pill    → blue primary
     .h26-btn.h26-btn-accent  → sienna
     .h26-btn.h26-btn-ghost   → white / outlined  (light backgrounds)
     .h26-btn.h26-btn-glass   → translucent       (dark backgrounds)
     .h26-btn.h26-btn-lg      → size modifier
   ========================================================================== */

import { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown, Phone, Menu, X, ArrowRight, ArrowUpRight,
  Instagram, Facebook, Youtube,
} from 'lucide-react';

import '../pages/Home2026.css';
import '../pages/Home2026Improved.css';
import '../pages/NewTypography.css';
/* /new3's nav refinements: the wider grouped flyout, the catch-all row, the
   compact nav buttons and the shared gutter. All of its rules are scoped under
   `.n3` (which only declares tokens — no generic element selectors), so the
   nav is wrapped in a .n3 container and nothing leaks into the page body. */
import '../pages/New3.css';

export const CONTACT_CK = {
  phoneDisplay: '+91 8556001700',
  phoneHref: 'tel:+918556001700',
  email: 'holidays@coxandkings.com',
};

/* The /new3 mega-menu, verbatim: four groups, the Destinations panel split by
   KIND with section rules, and a catch-all row that sits outside the list.
   /new3's "Talk to an expert" is an in-place callback dialog that only exists
   on that page — here it resolves to /contact rather than dead-ending. */
const NAV_MENU = [
  {
    label: 'Ways to travel', to: '/journeys4',
    blurb: 'Two ways to see the world. Pick the one that fits you.',
    items: [
      { label: 'Escorted group tours', desc: 'Expert-led, fixed departures', to: '/journeys4?style=Group Tour' },
      { label: 'Tailor-made journeys', desc: 'Designed entirely around you', to: '/journeys4?style=Bespoke Private' },
      { label: 'Luxury & private travel', desc: 'Elevated stays and guiding', to: '/journeys4?style=Luxury' },
      { label: 'Help me decide', desc: 'Talk it through with a specialist', to: '/contact' },
    ],
  },
  {
    label: 'Destinations', to: '/journeys4',
    blurb: 'Over 100 countries, shaped by specialists who know them first-hand.',
    items: [
      { group: 'By destination', label: 'Japan', desc: 'Cherry blossom to neon', to: '/journeys4?where=Japan' },
      { group: 'By destination', label: 'Switzerland', desc: 'Alpine railways & lakes', to: '/journeys4?where=Switzerland' },
      { group: 'By destination', label: 'Italy', desc: 'Cities, coast & countryside', to: '/journeys4?where=Italy' },
      { group: 'By destination', label: 'Northern Lights', desc: 'Arctic winter skies', to: '/journeys4?where=Northern Lights' },
      { group: 'By destination', label: 'African Safari', desc: 'Big-five wilderness', to: '/journeys4?where=Africa Safari' },
      { group: 'Signature journeys', label: 'Cherry Blossom Japan', desc: '13 nights · Mar–Apr', to: '/tour-detail-japan-4' },
      { group: 'Signature journeys', label: 'Relaxed-pace journeys', desc: 'A calm vacation, handled', to: '/journeys4?pace=Relaxed' },
    ],
    all: { label: 'All destinations', meta: '31 journeys', to: '/journeys4' },
  },
  {
    label: 'Indian Getaways', to: '/journeys4?where=India',
    blurb: 'Closer to home, and no less of a journey.',
    items: [
      { label: 'Golden Triangle & the Taj', desc: '8 nights · Delhi, Agra, Jaipur', to: '/journeys4?where=India&style=Group Tour' },
      { label: 'Rajasthan: palaces & forts', desc: 'Udaipur, Jodhpur & the Thar', to: '/journeys4?where=India&style=Luxury' },
      { label: 'Kerala backwaters', desc: 'Houseboats, tea country, coast', to: '/journeys4?where=India&style=Bespoke Private' },
    ],
    all: { label: 'All Indian journeys', meta: '5 journeys', to: '/journeys4?where=India' },
  },
  {
    label: 'About us', to: '/about-us2',
    blurb: 'Specialists, not salespeople, with 260 years behind every trip.',
    items: [
      { label: 'Our story', desc: 'Since 1758, and what came after', to: '/about-us2' },
      { label: 'The team', desc: 'The people rebuilding it', to: '/about-us2/team' },
      { label: 'Wilson & Hughes', desc: 'Who owns us now', to: '/about-us2' },
      { label: 'Talk to an expert', desc: 'Pick a time, we call you back', to: '/contact' },
    ],
  },
];

const MOBILE_LINKS = [
  { label: 'Ways to travel', to: '/journeys4' },
  { label: 'Destinations', to: '/journeys4' },
  { label: 'Indian Getaways', to: '/journeys4?where=India' },
  { label: 'About us', to: '/about-us2' },
  { label: 'The team', to: '/about-us2/team' },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Don't let the page scroll behind the open mobile menu. */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    /* .n3 scopes New3.css's nav refinements to the chrome only. */
    <div className="n3">
      <header className={`h26-nav${scrolled ? ' is-solid' : ''}`}>
        <Link to="/" className="h26-brand">
          <img src="/cox-logo-new.png" alt="Cox & Kings" />
        </Link>

        <nav className="h26-links hi-nav" aria-label="Primary">
          {NAV_MENU.map((group) => (
            <div className="hi-nav-group" key={group.label}>
              <Link to={group.to} className="hi-nav-top" aria-haspopup="true">
                {group.label}
                <ChevronDown size={14} className="hi-nav-caret" aria-hidden="true" />
              </Link>
              <div className="hi-nav-flyout" role="menu">
                <div className="hi-nav-flyout-inner">
                  <p className="hi-nav-blurb">{group.blurb}</p>

                  <ul className="hi-nav-list">
                    {group.items.map((it, idx) => (
                      <Fragment key={it.label}>
                        {/* Section rule wherever the KIND of item changes. */}
                        {it.group && group.items[idx - 1]?.group !== it.group && (
                          <li className="n3-navgroup" aria-hidden="true"><span>{it.group}</span></li>
                        )}
                        <li>
                          <Link to={it.to} role="menuitem" className="hi-nav-item">
                            <span className="hi-nav-item-label">{it.label}</span>
                            <span className="hi-nav-item-desc">{it.desc}</span>
                          </Link>
                        </li>
                      </Fragment>
                    ))}
                  </ul>

                  {/* The catch-all sits OUTSIDE the list: it is not one more thing
                      to choose between, it is the way past the choosing. */}
                  {group.all && (
                    <Link to={group.all.to} role="menuitem" className="n3-navall">
                      <span className="n3-navall-label">{group.all.label}</span>
                      <span className="n3-navall-meta">{group.all.meta}</span>
                      <ArrowRight size={15} className="n3-navall-arrow" aria-hidden="true" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </nav>

        <div className="h26-nav-cta">
          <a href={CONTACT_CK.phoneHref} className="h26-phone">
            <Phone size={15} /> <span>{CONTACT_CK.phoneDisplay}</span>
          </a>
          <Link to="/contact" className="h26-btn h26-btn-pill">Talk to an expert</Link>
          <button className="h26-burger" aria-label="Menu" onClick={() => setMenuOpen(true)}>
            <Menu size={22} />
          </button>
        </div>
      </header>

      {/* Mobile slide-in menu */}
      <div className={`h26-menu${menuOpen ? ' is-open' : ''}`} aria-hidden={!menuOpen}>
        <div className="h26-menu-scrim" onClick={() => setMenuOpen(false)} />
        <div className="h26-menu-panel" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="h26-menu-top">
            <button className="h26-menu-close" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
              <X size={20} />
            </button>
            <img className="h26-menu-logo" src="/cox-logo-new.png" alt="Cox & Kings — Est. 1758" />
          </div>

          <nav className="h26-menu-primary" aria-label="Mobile primary">
            {MOBILE_LINKS.map((n) => (
              <Link key={n.label} to={n.to} onClick={() => setMenuOpen(false)}>
                {n.label}
                <span className="h26-menu-chev"><ArrowRight size={16} /></span>
              </Link>
            ))}
          </nav>

          <div className="h26-menu-divider" />

          <div className="h26-menu-secondary">
            <Link to="/journeys" onClick={() => setMenuOpen(false)}>All journeys <ArrowUpRight size={13} /></Link>
            <Link to="/about-us2" onClick={() => setMenuOpen(false)}>Our story <ArrowUpRight size={13} /></Link>
            <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact <ArrowUpRight size={13} /></Link>
          </div>

          <a
            href={CONTACT_CK.phoneHref}
            className="h26-btn h26-btn-pill h26-menu-cta"
            onClick={() => setMenuOpen(false)}
          >
            <Phone size={16} /> Speak to an expert
          </a>

          <div className="h26-menu-foot">
            <span className="h26-menu-eyebrow">Follow the journey</span>
            <div className="h26-menu-social">
              <a href="#" aria-label="Instagram"><Instagram size={18} /></a>
              <a href="#" aria-label="Facebook"><Facebook size={18} /></a>
              <a href="#" aria-label="YouTube"><Youtube size={18} /></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="h26-footer">
      <div className="h26-footer-top">
        <div className="h26-footer-brand">
          <img src="/cox-logo-new.png" alt="Cox & Kings" />
          <p>The world's most experienced travel company. Established 1758.</p>
          <div className="h26-footer-contact">
            <a href={CONTACT_CK.phoneHref}><Phone size={15} /> {CONTACT_CK.phoneDisplay}</a>
            <a href={`mailto:${CONTACT_CK.email}`}>{CONTACT_CK.email}</a>
          </div>
        </div>

        <div className="h26-footer-cols">
          <div>
            <h4>Travel</h4>
            <Link to="/journeys">Group tours</Link>
            <Link to="/contact">Bespoke holidays</Link>
            <Link to="/journeys">Luxury journeys</Link>
            <Link to="/journeys">Destinations</Link>
          </div>
          <div>
            <h4>Company</h4>
            <Link to="/about-us2">Our story</Link>
            <Link to="/about-us2/team">The team</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/about-us2">Why Cox &amp; Kings</Link>
          </div>
          <div>
            <h4>Assurance</h4>
            <Link to="/about-us2">Trust &amp; safety</Link>
            <Link to="/about-us2">Our history</Link>
            <Link to="/contact">Refund policy</Link>
            <Link to="/contact">Speak to an expert</Link>
          </div>
        </div>
      </div>

      <div className="h26-footer-bottom">
        <span>© {new Date().getFullYear()} Cox &amp; Kings. Travelling the world since 1758.</span>
        <span className="h26-footer-assoc">IATA · TAAI · ASTA</span>
      </div>
    </footer>
  );
}
