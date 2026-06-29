import { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';
import './Newsletter.css';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setSubmitted(true);
    setError('');
  };

  return (
    <section className="newsletter">
      <div className="newsletter__bg" />
      <div className="container newsletter__inner">
        <div className="newsletter__content">
          <span className="tag newsletter__tag">Stay Inspired</span>
          <h2 className="newsletter__title">
            Discover the World <em>with Us</em>
          </h2>
          <p className="newsletter__desc">
            Subscribe to our newsletter for expert travel inspiration, exclusive offers,
            early access to new itineraries, and stories from our global explorers.
          </p>

          {!submitted ? (
            <form className="newsletter__form" onSubmit={handleSubmit}>
              <div className="newsletter__input-wrap">
                <Mail size={18} className="newsletter__input-icon" />
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  className="newsletter__input"
                />
              </div>
              {error && <p className="newsletter__error">{error}</p>}
              <button type="submit" className="btn-gold newsletter__btn">
                Subscribe Now
              </button>
              <p className="newsletter__fine">
                No spam, ever. Unsubscribe at any time. By subscribing you agree to our Privacy Policy.
              </p>
            </form>
          ) : (
            <div className="newsletter__success">
              <CheckCircle size={48} />
              <h3>Thank you for subscribing!</h3>
              <p>Your first dose of travel inspiration is on its way to {email}</p>
            </div>
          )}
        </div>

        <div className="newsletter__image">
          <img
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=700&q=80"
            alt="Travel inspiration"
            loading="lazy"
          />
          <div className="newsletter__image-overlay" />
        </div>
      </div>
    </section>
  );
}
