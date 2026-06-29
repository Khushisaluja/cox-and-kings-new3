import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Users, Sparkles, Wand2, Phone, ArrowRight, MapPin, Compass, Calendar, Search } from 'lucide-react';
import { PATHS, HERO_DESTINATIONS, HERO_TRIP_TYPES, HERO_WHEN } from '../../data/v3content';
import './PathRouter.css';

const PATH_ICONS = [
  <Users size={22} aria-hidden="true" />,
  <Sparkles size={22} aria-hidden="true" />,
  <Wand2 size={22} aria-hidden="true" />,
  <Phone size={22} aria-hidden="true" />,
];

/* Typewriter for the directed-search placeholder (variant A2) */
function useTypewriter(words, active) {
  const [text, setText] = useState('');
  const ref = useRef({ i: 0, j: 0, del: false });
  useEffect(() => {
    if (!active) { setText(''); return; }
    let t;
    const tick = () => {
      const s = ref.current;
      const word = words[s.i % words.length];
      s.j += s.del ? -1 : 1;
      setText(word.slice(0, s.j));
      let delay = s.del ? 45 : 90;
      if (!s.del && s.j === word.length) { delay = 1500; s.del = true; }
      else if (s.del && s.j === 0) { s.del = false; s.i += 1; delay = 350; }
      t = setTimeout(tick, delay);
    };
    t = setTimeout(tick, 400);
    return () => clearTimeout(t);
  }, [words, active]);
  return text;
}

/* The directed search — the ONE primary action of this section.
   variant 'A2' = full Where/What/When directed search (typewriter prompt).
   variant 'A'  = a calmer single "where to?" + talk line. */
function RouterSearch({ variant }) {
  const [focused, setFocused] = useState(false);
  const [query, setQuery] = useState('');
  const typed = useTypewriter(HERO_DESTINATIONS, variant === 'A2' && !focused && !query);

  return (
    <form className="v3router__search v3-card" role="search" aria-label="Find a trip" onSubmit={(e) => e.preventDefault()}>
      <label className="v3router__field">
        <MapPin size={18} aria-hidden="true" />
        <span className="v3router__typewrap">
          <input
            type="text"
            aria-label="Where do you want to go?"
            placeholder={focused ? 'Where do you want to go?' : ''}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            list="v3router-dest"
            autoComplete="off"
          />
          {!focused && !query && (
            <span className="v3router__typed" aria-hidden="true">{typed}<span className="v3router__caret" /></span>
          )}
        </span>
        <datalist id="v3router-dest">{HERO_DESTINATIONS.map((d) => <option key={d} value={d} />)}</datalist>
      </label>

      {variant === 'A2' && (
        <>
          <span className="v3router__div" />
          <label className="v3router__field">
            <Compass size={18} aria-hidden="true" />
            <select aria-label="What kind of trip?" defaultValue="">
              <option value="" disabled hidden>What kind of trip?</option>
              {HERO_TRIP_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </label>
          <span className="v3router__div" />
          <label className="v3router__field">
            <Calendar size={18} aria-hidden="true" />
            <select aria-label="When?" defaultValue="">
              <option value="" disabled hidden>When?</option>
              {HERO_WHEN.map((w) => <option key={w}>{w}</option>)}
            </select>
          </label>
        </>
      )}

      <Link to="/tours" className="v3-btn v3-btn--primary v3router__submit">
        <Search size={17} /> Find My Trip
      </Link>
    </form>
  );
}

export default function PathRouter({ variant = 'A2' }) {
  return (
    <section id="v3-router" className="v3-section v3-section--cloud">
      <div className="v3-container">
        <div className="v3-head v3-head--center">
          <p className="v3-eyebrow">Start here</p>
          <h2 className="v3-h2">Where shall we begin?</h2>
          <p className="v3-sub">
            Tell us where you’re headed — or pick a way in below. Every route leads to a real travel expert, never a call centre.
          </p>
        </div>

        <RouterSearch variant={variant} />

        <p className="v3router__or"><span>or choose how you’d like to travel</span></p>

        <div className="v3router__grid" role="list">
          {PATHS.map((path, i) => {
            const isAnchor = path.to.startsWith('#');
            const className = `v3router__card${path.accent ? ' v3router__card--accent' : ''}`;
            const inner = (
              <>
                {path.accent && (
                  <span className="v3router__accent-badge">Not sure yet?</span>
                )}
                <div className="v3router__icon">{PATH_ICONS[i]}</div>
                <h3 className="v3router__title">{path.title}</h3>
                <p className="v3router__desc">{path.desc}</p>
                <span className="v3-link v3router__cta" aria-hidden="true">
                  {path.cta}
                  <ArrowRight size={15} />
                </span>
              </>
            );
            return isAnchor ? (
              <a key={path.title} href={path.to} className={className} role="listitem">{inner}</a>
            ) : (
              <Link key={path.title} to={path.to} className={className} role="listitem">{inner}</Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
