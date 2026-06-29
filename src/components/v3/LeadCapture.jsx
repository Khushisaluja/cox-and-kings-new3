import { useState } from 'react';
import { Phone, MessageCircle, CheckCircle, Send, Clock } from 'lucide-react';
import { CONTACT, DESTINATIONS } from '../../data/v3content';
import './LeadCapture.css';

const INITIAL = {
  destination: '',
  tripType: '',
  timing: '',
  travellers: '',
  name: '',
  contact: '',
};

export default function LeadCapture() {
  const [fields, setFields] = useState(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setFields((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((err) => ({ ...err, [name]: '' }));
  }

  function validate() {
    const e = {};
    if (!fields.name.trim()) e.name = 'Please enter your name.';
    if (!fields.contact.trim()) e.contact = 'Please enter a WhatsApp number or email.';
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) {
      setErrors(e2);
      return;
    }
    setSubmitted(true);
  }

  return (
    <section
      id="v3-plan"
      className="v3-section v3-section--blue"
      aria-labelledby="v3lead-heading"
    >
      <div className="v3-container">
        <div className="v3lead__layout">
          {/* ---- LEFT: copy ---- */}
          <div className="v3lead__copy">
            <p className="v3-eyebrow v3-eyebrow--light">PLAN WITH US</p>
            <h2 className="v3-h2" id="v3lead-heading">
              Not sure where to begin?<br />
              Let's find your trip together.
            </h2>
            <p className="v3-sub">
              Tell us a little about the holiday you have in mind. A destination
              specialist will come back to you within 24 hours — no obligation,
              no call centre.
            </p>

            {/* Concierge cues */}
            <div className="v3lead__cues">
              <p className="v3lead__cue">
                <Clock size={15} aria-hidden="true" />
                Your specialist replies within 24h
              </p>
              <div className="v3lead__contact-links">
                <a
                  href={CONTACT.phoneHref}
                  className="v3-btn v3-btn--outline v3-btn--on-dark v3lead__contact-btn"
                >
                  <Phone size={16} aria-hidden="true" />
                  {CONTACT.phoneDisplay}
                </a>
                <a
                  href={CONTACT.whatsappHref}
                  className="v3-btn v3-btn--outline v3-btn--on-dark v3lead__contact-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle size={16} aria-hidden="true" />
                  {CONTACT.whatsappDisplay}
                </a>
              </div>
            </div>
          </div>

          {/* ---- RIGHT: form card ---- */}
          <div className="v3-card v3lead__card">
            {submitted ? (
              /* Success state */
              <div className="v3lead__success" role="status" aria-live="polite">
                <CheckCircle size={44} className="v3lead__success-icon" aria-hidden="true" />
                <h3 className="v3lead__success-title">You're all set!</h3>
                <p className="v3lead__success-msg">
                  Thank you — a destination specialist will be in touch within
                  24 hours. We look forward to planning your journey.
                </p>
                <button
                  className="v3-btn v3-btn--outline v3lead__reset-btn"
                  onClick={() => { setSubmitted(false); setFields(INITIAL); }}
                >
                  Submit another enquiry
                </button>
              </div>
            ) : (
              <form
                className="v3lead__form"
                onSubmit={handleSubmit}
                noValidate
                aria-label="Trip planning enquiry"
              >
                <p className="v3lead__form-title">Find My Perfect Trip</p>

                {/* 1. Where to? */}
                <div className="v3lead__field">
                  <label htmlFor="v3lead-dest" className="v3lead__label">
                    Where to?
                  </label>
                  <div className="v3lead__select-wrap">
                    <select
                      id="v3lead-dest"
                      name="destination"
                      value={fields.destination}
                      onChange={handleChange}
                      className="v3lead__input"
                    >
                      <option value="">I'm not sure yet — help me decide</option>
                      {DESTINATIONS.map((d) => (
                        <option key={d.name} value={d.name}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 2. Group tour or bespoke? */}
                <div className="v3lead__field">
                  <label htmlFor="v3lead-type" className="v3lead__label">
                    Group tour or bespoke?
                  </label>
                  <div className="v3lead__select-wrap">
                    <select
                      id="v3lead-type"
                      name="tripType"
                      value={fields.tripType}
                      onChange={handleChange}
                      className="v3lead__input"
                    >
                      <option value="">Select an option</option>
                      <option value="group">Escorted Group</option>
                      <option value="bespoke">Bespoke Private</option>
                      <option value="unsure">Not sure</option>
                    </select>
                  </div>
                </div>

                {/* 3. Roughly when? */}
                <div className="v3lead__field">
                  <label htmlFor="v3lead-when" className="v3lead__label">
                    Roughly when?
                  </label>
                  <div className="v3lead__select-wrap">
                    <select
                      id="v3lead-when"
                      name="timing"
                      value={fields.timing}
                      onChange={handleChange}
                      className="v3lead__input"
                    >
                      <option value="">Select a timeframe</option>
                      <option value="3m">Next 3 months</option>
                      <option value="6m">3–6 months</option>
                      <option value="eoy">Later this year</option>
                      <option value="2027">2027+</option>
                      <option value="flex">Flexible</option>
                    </select>
                  </div>
                </div>

                {/* 4. Travellers */}
                <div className="v3lead__field">
                  <label htmlFor="v3lead-pax" className="v3lead__label">
                    Travellers
                  </label>
                  <div className="v3lead__select-wrap">
                    <select
                      id="v3lead-pax"
                      name="travellers"
                      value={fields.travellers}
                      onChange={handleChange}
                      className="v3lead__input"
                    >
                      <option value="">Select group size</option>
                      <option value="1-2">1–2</option>
                      <option value="3-4">3–4</option>
                      <option value="5+">5+</option>
                      <option value="family">Family with kids</option>
                      <option value="seniors">With seniors</option>
                    </select>
                  </div>
                </div>

                {/* 5. Name */}
                <div className={`v3lead__field${errors.name ? ' v3lead__field--error' : ''}`}>
                  <label htmlFor="v3lead-name" className="v3lead__label">
                    Your name <span className="v3lead__req" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="v3lead-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={fields.name}
                    onChange={handleChange}
                    placeholder="e.g. Anjali Mehta"
                    className="v3lead__input"
                    aria-required="true"
                    aria-describedby={errors.name ? 'v3lead-name-err' : undefined}
                  />
                  {errors.name && (
                    <p id="v3lead-name-err" className="v3lead__error" role="alert">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* 6. Contact */}
                <div className={`v3lead__field${errors.contact ? ' v3lead__field--error' : ''}`}>
                  <label htmlFor="v3lead-contact" className="v3lead__label">
                    WhatsApp or email <span className="v3lead__req" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="v3lead-contact"
                    name="contact"
                    type="text"
                    autoComplete="off"
                    value={fields.contact}
                    onChange={handleChange}
                    placeholder="e.g. 9876543210 or you@example.com"
                    className="v3lead__input"
                    aria-required="true"
                    aria-describedby={errors.contact ? 'v3lead-contact-err' : undefined}
                  />
                  {errors.contact && (
                    <p id="v3lead-contact-err" className="v3lead__error" role="alert">
                      {errors.contact}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <div className="v3lead__actions">
                  <button type="submit" className="v3-btn v3-btn--primary v3lead__submit">
                    <Send size={16} aria-hidden="true" />
                    Find My Perfect Trip
                  </button>
                  <a
                    href={CONTACT.phoneHref}
                    className="v3-btn v3-btn--outline v3lead__phone-btn"
                  >
                    <Phone size={15} aria-hidden="true" />
                    Or talk to an expert now
                  </a>
                </div>

                <p className="v3lead__reassurance">
                  We'll only use this to plan your trip. No spam, ever.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
