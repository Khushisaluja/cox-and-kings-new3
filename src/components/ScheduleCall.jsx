/* ---------------------------------------------------------------------------
   Schedule-a-call — the single "talk to us" surface for the whole site.
   There is no /contact page any more: every CTA that used to point at one
   (nav, footers, journey cards, the CTA bands) opens this dialog instead.

   Usage:
     • Wrap the app once in <ScheduleCallProvider> (see App.jsx).
     • Anywhere below it, either
         const openCall = useScheduleCall();   → openCall() on any handler, or
         <SmartLink to={CALLBACK} className="…">Talk to an expert</SmartLink>
       SmartLink is a drop-in for react-router's <Link>: a normal route path
       navigates as before, the CALLBACK sentinel opens the dialog. That lets
       page data keep using a plain `to:` field for both kinds of destination.
--------------------------------------------------------------------------- */
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, X, ArrowRight, ChevronDown, Check, MessageCircle } from 'lucide-react';
import { CONTACT, CALLBACK } from '../data/v3content';
import '../pages/Home2026.css';         // .h26 design tokens
import '../pages/Home2026Improved.css'; // .bf-* / .cb-* dialog styles
import '../pages/New3.css';             // .n3 refinements to the dialog
import './ScheduleCall.css';

/* The number the New3 / luxe2-improved chrome advertises. */
const CB_CONTACT = {
  ...CONTACT,
  phoneDisplay: '+91 8556001700',
  phoneHref: 'tel:+918556001700',
  whatsappHref: 'https://wa.me/918556001700',
};

/* Sentinel destination: "open the callback dialog" rather than "go to a page".
   Defined alongside the content data so data files can use it without pulling
   in UI; re-exported here because this is where callers expect to find it. */
export { CALLBACK };

const CB_PURPOSES = [
  'Plan a new trip',
  'Get a price quote',
  'An existing booking',
  'Group / family tour',
  'Bespoke / tailor-made journey',
  'Other',
];
const CB_TIMES = [
  'As soon as possible',
  '9–11 AM',
  '11 AM–1 PM',
  '1–3 PM',
  '3–5 PM',
  '5–7 PM',
  '7–9 PM',
];

function ScheduleCallPanel({ onClose }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  /* Purpose starts EMPTY rather than pre-selected on "Plan a new trip": it is
     optional, and a pre-filled dropdown quietly answers for the traveller and
     sends us data they never actually chose. */
  const [purpose, setPurpose] = useState('');
  const [purposeOther, setPurposeOther] = useState('');
  const [time, setTime] = useState(CB_TIMES[0]);
  const [sent, setSent] = useState(false);

  const phoneValid = phone.replace(/\D/g, '').length >= 7;
  /* Optional — but if it IS filled in, it has to be usable, or we promise to
     write back to an address that bounces. */
  const emailValid = email.trim() === '' || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
  const purposeText = purpose === 'Other' ? purposeOther.trim() : purpose;

  /* Only what we genuinely need to make the call: who you are, where to ring,
     and when. Email and purpose are nice to have and never block the request. */
  const canSubmit = name.trim().length > 1 && phoneValid && !!time && emailValid;

  const waHref = `${CB_CONTACT.whatsappHref}?text=${encodeURIComponent(
    [
      'Hi Cox & Kings, please schedule a callback.',
      `Name: ${name}`,
      `Phone: ${phone}`,
      email.trim() ? `Email: ${email.trim()}` : null,
      purposeText ? `About: ${purposeText}` : null,
      `Preferred time: ${time}`,
    ].filter(Boolean).join('\n'),
  )}`;

  const submit = (e) => {
    e.preventDefault();
    if (canSubmit) setSent(true);
  };

  return (
    <motion.div
      className="bf h26-cb" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }} onClick={onClose}
    >
      <motion.div
        className="bf-panel cb-panel" role="dialog" aria-modal="true" aria-label="Schedule a callback"
        initial={{ opacity: 0, y: 28, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} onClick={(e) => e.stopPropagation()}
      >
        <button className="bf-close" aria-label="Close" onClick={onClose}><X size={20} /></button>

        {!sent ? (
          <form className="cb-form" onSubmit={submit}>
            <span className="bf-eyebrow"><Phone size={13} /> Schedule a callback</span>
            <h3 className="bf-q cb-title">A specialist will call you back</h3>
            <p className="cb-intro">Leave your details and a time that suits you. We'll call, no charge and no obligation.</p>

            <label className="cb-field">
              <span className="cb-label">Your name <abbr className="cb-req" title="Required">*</abbr></span>
              <input className="cb-input" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Priya Sharma" autoComplete="name" required />
            </label>

            <label className="cb-field">
              <span className="cb-label">Phone number <abbr className="cb-req" title="Required">*</abbr></span>
              <input className="cb-input" type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. +91 98765 43210" autoComplete="tel" required />
            </label>

            <label className="cb-field">
              <span className="cb-label">Email <span className="cb-opt">(optional)</span></span>
              <input
                className="cb-input"
                type="email"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. priya@email.com"
                autoComplete="email"
                aria-invalid={!emailValid}
              />
              {!emailValid && <span className="cb-err">That doesn&apos;t look like an email address.</span>}
            </label>

            <label className="cb-field">
              <span className="cb-label">What&apos;s it about? <span className="cb-opt">(optional)</span></span>
              <span className="cb-select-wrap">
                <select className="cb-input cb-select" value={purpose} onChange={(e) => setPurpose(e.target.value)} aria-label="Purpose of callback">
                  <option value="">Tell us if you like</option>
                  {CB_PURPOSES.map((pp) => <option key={pp} value={pp}>{pp}</option>)}
                </select>
                <ChevronDown size={16} className="cb-select-chev" aria-hidden="true" />
              </span>
            </label>

            {purpose === 'Other' && (
              <label className="cb-field">
                <span className="cb-label">Tell us a little more <span className="cb-opt">(optional)</span></span>
                <input className="cb-input" type="text" value={purposeOther} onChange={(e) => setPurposeOther(e.target.value)} placeholder="In a few words…" />
              </label>
            )}

            <div className="cb-field">
              <span className="cb-label">Preferred time to call <abbr className="cb-req" title="Required">*</abbr></span>
              <div className="bf-chips cb-times">
                {CB_TIMES.map((t) => (
                  <button key={t} type="button" className={`bf-chip${time === t ? ' on' : ''}`} onClick={() => setTime(t)}>{t}</button>
                ))}
              </div>
            </div>

            <p className="cb-legend"><abbr className="cb-req" title="Required">*</abbr> Required</p>

            <button type="submit" className="h26-btn h26-btn-accent cb-submit" disabled={!canSubmit}>
              Request my callback <ArrowRight size={16} />
            </button>
          </form>
        ) : (
          <div className="cb-done">
            <span className="cb-done-ic"><Check size={26} /></span>
            <h3 className="bf-q cb-title">You're all set, {name.trim().split(' ')[0]}.</h3>
            <p className="cb-intro">
              A Cox &amp; Kings specialist will call you on <strong>{phone}</strong>, <strong>{time.toLowerCase()}</strong>
              {purposeText ? <>, about <strong>{purposeText.toLowerCase()}</strong></> : null}.
            </p>
            <div className="cb-done-actions">
              <a href={waHref} target="_blank" rel="noopener noreferrer" className="h26-btn h26-btn-accent"><MessageCircle size={16} /> Send details on WhatsApp</a>
              <button type="button" className="h26-btn h26-btn-ghost" onClick={onClose}>Done</button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

const ScheduleCallCtx = createContext(() => {});

/* Mounted once, above the routes. The dialog is portaled to <body> so no page's
   stacking context or overflow can clip it. */
export function ScheduleCallProvider({ children }) {
  const [open, setOpen] = useState(false);
  const openCall = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  return (
    <ScheduleCallCtx.Provider value={openCall}>
      {children}
      {createPortal(
        <div className="h26 n3 sc-host">
          <AnimatePresence>
            {open && <ScheduleCallPanel onClose={close} />}
          </AnimatePresence>
        </div>,
        document.body,
      )}
    </ScheduleCallCtx.Provider>
  );
}

export function useScheduleCall() {
  return useContext(ScheduleCallCtx);
}

/* Drop-in for <Link>. `to={CALLBACK}` opens the dialog; anything else routes.
   The callback form is an <a> without href so element-based link styles in the
   footers and menus keep matching it; role/tabIndex/keys restore button
   semantics that the missing href would otherwise take away. */
export function SmartLink({ to, className, children, onClick, ...rest }) {
  const openCall = useScheduleCall();

  if (to !== CALLBACK) {
    return <Link to={to} className={className} onClick={onClick} {...rest}>{children}</Link>;
  }

  const fire = (e) => {
    e.preventDefault();
    onClick?.(e);
    openCall();
  };

  return (
    <a
      className={className ? `${className} sc-link` : 'sc-link'}
      role="button"
      tabIndex={0}
      onClick={fire}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') fire(e);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
