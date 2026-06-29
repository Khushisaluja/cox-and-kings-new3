import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './SearchWidget.css';

const destinations = ['India', 'Japan', 'Egypt', 'Peru', 'Kenya', 'Italy', 'Iceland', 'Morocco', 'Nepal', 'Sri Lanka'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const durations = ['Any Duration', '1–7 days', '8–10 days', '11–14 days', '15+ days'];

// Rotating prompts the destination field "types" out to suggest searches.
const TYPED_PROMPTS = [
  'Japan Trip', 'Singapore Packages', 'Bali Honeymoon', 'Dubai Getaway',
  'Europe Tour', 'Maldives Escape', 'Kerala Holiday', 'Thailand Beaches',
];

// Typewriter: types a phrase, pauses, backspaces, moves to the next one.
function useTypewriter(words, { typeSpeed = 95, deleteSpeed = 45, holdTime = 1400, active = true } = {}) {
  const [text, setText] = useState('');
  useEffect(() => {
    if (!active) { setText(''); return; }
    let wordIdx = 0, charIdx = 0, deleting = false, timer;
    const tick = () => {
      const word = words[wordIdx];
      charIdx += deleting ? -1 : 1;
      setText(word.slice(0, charIdx));
      let delay = deleting ? deleteSpeed : typeSpeed;
      if (!deleting && charIdx === word.length) {
        deleting = true; delay = holdTime;           // full word — hold before deleting
      } else if (deleting && charIdx === 0) {
        deleting = false; wordIdx = (wordIdx + 1) % words.length; delay = 350;
      }
      timer = setTimeout(tick, delay);
    };
    timer = setTimeout(tick, 500);
    return () => clearTimeout(timer);
  }, [words, typeSpeed, deleteSpeed, holdTime, active]);
  return text;
}

export default function SearchWidget() {
  const [destination, setDestination] = useState('');
  const [month, setMonth] = useState('');
  const [duration, setDuration] = useState('');
  const [destFocused, setDestFocused] = useState(false);
  const navigate = useNavigate();

  // Only animate the placeholder while the field is empty and unfocused.
  const showTyped = !destination && !destFocused;
  const typed = useTypewriter(TYPED_PROMPTS, { active: showTyped });

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination) params.set('dest', destination);
    if (month) params.set('month', month);
    if (duration) params.set('duration', duration);
    navigate(`/tours?${params.toString()}`);
  };

  return (
    <div className="search-widget">
      <div className="container">
        <div className="search-widget__inner">
          <h2 className="search-widget__title">Find Your Perfect Journey</h2>
          <form className="search-widget__form" onSubmit={handleSearch}>
            <div className="search-widget__field">
              <label className="search-widget__label">
                <MapPin size={15} /> Destination
              </label>
              <div className="search-widget__typed-wrap">
                <input
                  type="text"
                  className="search-widget__input"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  onFocus={() => setDestFocused(true)}
                  onBlur={() => setDestFocused(false)}
                  list="search-destinations"
                  autoComplete="off"
                  aria-label="Destination"
                  /* Real placeholder only when focused (animation is paused then) */
                  placeholder={destFocused ? 'Try “Japan Trip”…' : ''}
                />
                {showTyped && (
                  <span className="search-widget__typed" aria-hidden="true">
                    {typed}
                    <span className="search-widget__caret" />
                  </span>
                )}
                <datalist id="search-destinations">
                  {destinations.map((d) => (
                    <option key={d} value={d} />
                  ))}
                </datalist>
              </div>
            </div>

            <div className="search-widget__divider" />

            <div className="search-widget__field">
              <label className="search-widget__label">
                <Calendar size={15} /> Travel Month
              </label>
              <select
                className="search-widget__select"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              >
                <option value="">Any Month</option>
                {months.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div className="search-widget__divider" />

            <div className="search-widget__field">
              <label className="search-widget__label">
                <Users size={15} /> Duration
              </label>
              <select
                className="search-widget__select"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              >
                {durations.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="search-widget__btn btn-burgundy">
              <Search size={18} />
              <span>Search Tours</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
