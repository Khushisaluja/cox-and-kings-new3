import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import './Contact.css';

const offices = [
  { city: 'London (HQ)', address: '30 Millbank, London SW1P 4EE', phone: '+44 (0) 330 880 8440', email: 'tours@coxandkings.co.uk' },
  { city: 'Edinburgh', address: '4 George Street, Edinburgh EH2 2PF', phone: '+44 (0) 131 460 9320', email: 'scotland@coxandkings.co.uk' },
  { city: 'Manchester', address: "2 St Peter's Square, Manchester M2 3AE", phone: '+44 (0) 161 835 2930', email: 'north@coxandkings.co.uk' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', destination: '', month: '', notes: '', type: 'Escorted Tour' });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Please enter your name';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Please enter a valid email';
    if (!form.destination.trim()) errs.destination = "Please tell us where you'd like to go";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitted(true);
  };

  const update = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  return (
    <main className="contact-page">
      {/* Hero */}
      <div className="contact-page__hero">
        <div className="contact-page__hero-bg" />
        <div className="contact-page__hero-overlay" />
        <div className="container contact-page__hero-content">
          <span className="tag">Get in Touch</span>
          <h1 className="contact-page__hero-title">Plan Your Journey</h1>
          <p className="contact-page__hero-sub">Our specialists are ready to craft your perfect itinerary</p>
        </div>
      </div>

      <div className="container contact-page__body">
        {/* Contact info cards */}
        <div className="contact-page__info-row">
          <div className="contact-info-card">
            <div className="contact-info-card__icon"><Phone size={22} /></div>
            <div>
              <h3>Call Us</h3>
              <p>+44 (0) 330 880 8440</p>
              <span>Mon–Fri 9am–6pm, Sat 10am–4pm</span>
            </div>
          </div>
          <div className="contact-info-card">
            <div className="contact-info-card__icon"><Mail size={22} /></div>
            <div>
              <h3>Email Us</h3>
              <p>tours@coxandkings.co.uk</p>
              <span>We aim to reply within 2 hours</span>
            </div>
          </div>
          <div className="contact-info-card">
            <div className="contact-info-card__icon"><Clock size={22} /></div>
            <div>
              <h3>Opening Hours</h3>
              <p>Monday–Friday: 9am–6pm</p>
              <span>Saturday: 10am–4pm GMT</span>
            </div>
          </div>
        </div>

        <div className="contact-page__content">
          {/* Form */}
          <div className="contact-page__form-wrap">
            <h2 className="contact-page__form-title">Request a Callback</h2>
            <div className="gold-divider" />
            <p className="contact-page__form-desc">
              Tell us about your dream journey and a specialist will call you back within 2 working hours.
            </p>

            {!submitted ? (
              <form className="contact-form" onSubmit={handleSubmit} noValidate>
                <div className="contact-form__row">
                  <div className="contact-form__field">
                    <label>Full Name *</label>
                    <input type="text" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Your full name" className={errors.name ? 'error' : ''} />
                    {errors.name && <span className="contact-form__error">{errors.name}</span>}
                  </div>
                  <div className="contact-form__field">
                    <label>Email Address *</label>
                    <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="your@email.com" className={errors.email ? 'error' : ''} />
                    {errors.email && <span className="contact-form__error">{errors.email}</span>}
                  </div>
                </div>

                <div className="contact-form__row">
                  <div className="contact-form__field">
                    <label>Phone Number</label>
                    <input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+44 (0)..." />
                  </div>
                  <div className="contact-form__field">
                    <label>Holiday Type</label>
                    <select value={form.type} onChange={(e) => update('type', e.target.value)}>
                      <option>Escorted Tour</option>
                      <option>Tailor-Made Holiday</option>
                      <option>Luxury Journey</option>
                      <option>Family Adventure</option>
                      <option>Wildlife & Safari</option>
                    </select>
                  </div>
                </div>

                <div className="contact-form__row">
                  <div className="contact-form__field">
                    <label>Destination(s) *</label>
                    <input type="text" value={form.destination} onChange={(e) => update('destination', e.target.value)} placeholder="e.g. India, Japan, Kenya..." className={errors.destination ? 'error' : ''} />
                    {errors.destination && <span className="contact-form__error">{errors.destination}</span>}
                  </div>
                  <div className="contact-form__field">
                    <label>Preferred Travel Month</label>
                    <select value={form.month} onChange={(e) => update('month', e.target.value)}>
                      <option value="">Any month</option>
                      {['January','February','March','April','May','June','July','August','September','October','November','December'].map(m => <option key={m}>{m}</option>)}
                    </select>
                  </div>
                </div>

                <div className="contact-form__field">
                  <label>Additional Notes</label>
                  <textarea value={form.notes} onChange={(e) => update('notes', e.target.value)} placeholder="Tell us about your group size, budget, special requests, or anything else..." rows={4} />
                </div>

                <button type="submit" className="btn-primary contact-form__submit">
                  <Send size={16} /> Send My Request
                </button>
                <p className="contact-form__fine">
                  By submitting this form you agree to our Privacy Policy. We will never share your data with third parties.
                </p>
              </form>
            ) : (
              <div className="contact-form__success">
                <CheckCircle size={56} />
                <h3>Thank you, {form.name.split(' ')[0]}!</h3>
                <p>Your enquiry has been received. One of our specialists will call you back within 2 working hours.</p>
                <p className="contact-form__success-ref">Reference: CK-{Math.random().toString(36).slice(2,8).toUpperCase()}</p>
              </div>
            )}
          </div>

          {/* Offices */}
          <div className="contact-page__offices">
            <h3 className="contact-page__offices-title">Our Offices</h3>
            <div className="contact-page__offices-list">
              {offices.map((o) => (
                <div key={o.city} className="office-card">
                  <h4 className="office-card__city"><MapPin size={14} /> {o.city}</h4>
                  <p className="office-card__address">{o.address}</p>
                  <a href={`tel:${o.phone}`} className="office-card__phone">{o.phone}</a>
                  <a href={`mailto:${o.email}`} className="office-card__email">{o.email}</a>
                </div>
              ))}
            </div>

            {/* Map placeholder */}
            <div className="contact-page__map">
              <iframe
                title="Cox & Kings London"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-0.135%2C51.490%2C-0.115%2C51.500&layer=mapnik&marker=51.4957%2C-0.1249"
                style={{ border: 0, width: '100%', height: '260px', borderRadius: 'var(--radius-md)' }}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
