import { PRESS, ASSOCIATIONS } from '../../data/v3content';
import './AsSeenIn.css';

export default function AsSeenIn() {
  return (
    <section
      className="v3-section v3-section--cream v3press"
      aria-label="Press recognition and industry associations"
    >
      <div className="v3-container v3press__inner">
        {/* ── Label ── */}
        <p className="v3-eyebrow v3press__eyebrow">As Seen In</p>

        {/* ── Press names ── */}
        <ul className="v3press__logos" role="list" aria-label="Media mentions">
          {PRESS.map((name) => (
            <li key={name} className="v3press__name" aria-label={name}>
              {name}
            </li>
          ))}
        </ul>

        {/* ── Divider ── */}
        <hr className="v3press__rule" aria-hidden="true" />

        {/* ── Associations ── */}
        <p className="v3press__assoc">
          Proud members of{' '}
          {ASSOCIATIONS.map((a, i) => (
            <span key={a}>
              <span className="v3press__assoc-name">{a}</span>
              {i < ASSOCIATIONS.length - 1 && (
                <span className="v3press__assoc-sep" aria-hidden="true"> · </span>
              )}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
