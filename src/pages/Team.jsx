/* ============================================================================
   Cox & Kings India — THE FULL TEAM  (route: /about-us2/team)

   The detail page behind the About page's leadership section. The About page
   shows the Director + the four heads that matter to a traveller; this page
   carries everyone.

   Reuses the AboutUs design language (Cormorant Garamond + Work Sans,
   design.md tokens) and its own dark "roll-call" treatment so it reads as a
   deeper level rather than a repeat of the section it came from.

   Karan Agarwal is the only real person in here — see src/data/team.js.
   ========================================================================== */

import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, ArrowRight, Phone, Mail } from 'lucide-react';
import { DIRECTOR, TEAM } from '../data/team';
import { SiteNav, SiteFooter } from '../components/SiteChrome';
import './AboutUs.css';
import './Team.css';

gsap.registerPlugin(ScrollTrigger);

const img = (id, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export default function Team() {
  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap
          .timeline({ defaults: { ease: 'power3.out' } })
          .fromTo('.tm-hero-eyebrow', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.55 })
          .fromTo('.tm-hero-line span', { yPercent: 115 }, { yPercent: 0, duration: 1, stagger: 0.08 }, '-=0.3')
          .fromTo('.tm-hero-lede', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.65 }, '-=0.5');

        gsap.utils.toArray('.tm-row').forEach((row) => {
          gsap.fromTo(
            row,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: 'power3.out',
              scrollTrigger: { trigger: row, start: 'top 88%' },
            }
          );
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  /* Director first, then every head in order. */
  const roll = [{ ...DIRECTOR, n: '00' }, ...TEAM];

  return (
    <div className="h26 new-typo ab tm" ref={rootRef}>
      <SiteNav />

      {/* ---------------------------------------------------------------- hero */}
      <section className="tm-hero">
        <span className="tm-hero-grain" aria-hidden="true" />
        <div className="ab-wrap tm-hero-inner">
          <Link to="/about-us2" className="tm-back">
            <ArrowLeft size={14} /> Back to About
          </Link>

          <p className="tm-hero-eyebrow">Cox &amp; Kings India · Leadership</p>
          <h1 className="tm-hero-title">
            <span className="tm-hero-line"><span>The full</span></span>
            <span className="tm-hero-line"><span><em>team</em>.</span></span>
          </h1>
          <p className="tm-hero-lede">
            Nine people rebuilding a company founded in 1758. No call centre, no anonymous
            department — the person who owns the decision is on this page.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------ the roll */}
      <section className="tm-roll" aria-label="Team members">
        <div className="ab-wrap">
          {roll.map((m) => (
            <article className={`tm-row${m.real ? ' is-director' : ''}`} key={m.name}>
              <span className="tm-row-n" aria-hidden="true">{m.n}</span>

              <figure className="tm-row-photo">
                <img src={img(m.photo, 700)} alt={m.name} loading="lazy" />
              </figure>

              <div className="tm-row-main">
                <h2 className="tm-row-name">{m.name}</h2>
                <p className="tm-row-role">{m.role}</p>
              </div>

              <div className="tm-row-meta">
                <p className="tm-row-unit">{m.unit}</p>
                <p className="tm-row-bio">{m.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ----------------------------------------------------------------- CTA */}
      <section className="tm-cta" aria-labelledby="tm-cta-h">
        <div className="ab-wrap tm-cta-inner">
          <h2 className="ab-h2 ab-h2--light" id="tm-cta-h">
            Want to <em>join</em> them?
          </h2>
          <p>
            We are hiring as we rebuild. If you have an opinion about how travel in India ought to
            work, we would like to hear it.
          </p>
          <div className="tm-cta-actions">
            <Link to="/contact" className="h26-btn h26-btn-accent h26-btn-lg">
              Get in touch <ArrowRight size={15} />
            </Link>
            <Link to="/about-us2" className="h26-btn h26-btn-glass">
              Back to About
            </Link>
          </div>
          <div className="ab-cta-contact">
            <a href="tel:+918556001700">
              <Phone size={14} /> +91 8556 001 700
            </a>
            <a href="mailto:holidays@coxandkings.com">
              <Mail size={14} /> holidays@coxandkings.com
            </a>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------- footer */}
      <SiteFooter />
    </div>
  );
}
