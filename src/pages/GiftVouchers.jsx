/* ============================================================================
   Cox & Kings — GIFT VOUCHERS  (route: /gift-vouchers, alias /gift-cards)

   A virtual travel-gift-card page: choose an amount and a card face, write a
   note, and send it to someone you love by email or WhatsApp. Built on the
   SAME /new3 primitives as the rest of the site so it reads as one brand —
   shared <SiteNav /> + <SiteFooter />, design.md tokens, Cormorant Garamond +
   Work Sans, 4px buttons / rounded cards, blue primary / sienna accent.

   The gift is NEVER tied to a destination. The card face is purely aesthetic;
   every card says, in words, that it is redeemable on ANY Cox & Kings journey,
   anywhere in the world — the choice of trip belongs to the person receiving it.

   Shape, top to bottom:
     - a Vision-&-Mission–style HERO (full-bleed photograph under a dark veil,
       masked headline lines raised by GSAP);
     - HOW IT WORKS: three plainly-numbered steps;
     - THE DESIGNER: the heart — a live PREVIEW (the card + a paired gift note +
       a plain-language "what you're giving" summary) beside a four-step form,
       ending in a success state that hands over the real email / WhatsApp link;
     - WHY A COX & KINGS GIFT: four lines of reassurance;
     - a short FAQ; a closing CTA.

   Motion: GSAP + ScrollTrigger, all of it inside a gsap.matchMedia() gated on
   (prefers-reduced-motion: no-preference). NOTHING is hidden in CSS — every
   resting state is the visible one and GSAP sets the from-state itself, so a
   reduced-motion visitor (or a GSAP failure) simply gets the full, static page.
   ========================================================================== */

import { useState, useMemo, useRef, useCallback, useLayoutEffect, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Palette, PencilLine, Send, Mail, MessageCircle, Check, Copy,
  ArrowRight, Sparkles, ShieldCheck, Clock, Globe2, HeartHandshake,
  ChevronDown, Plane, CreditCard, Smartphone, Building2, Wallet, Lock,
  RefreshCw, Pencil, X, FileText,
} from 'lucide-react';
import { SmartLink as Link, CALLBACK } from '../components/ScheduleCall';
import { SiteNav, SiteFooter, CONTACT_CK } from '../components/SiteChrome';
import { img } from '../data/v3content';
/* Last, so .gv's own rules win over the shared h26 sheets. */
import './GiftVouchers.css';

gsap.registerPlugin(ScrollTrigger);

/* ---------------------------------------------------------------- content */

const AMOUNTS = [10000, 25000, 50000, 100000, 250000];
const MIN_AMOUNT = 2500;
const MAX_AMOUNT = 1000000;

/* Five card faces. These are AESTHETIC choices only — a mood, not a
   destination. The card prints no place name; the money is spendable anywhere.
   `classic` is a photo-less heritage face (navy + crest) for a timeless look. */
const DESIGNS = [
  { key: 'blossom', name: 'Blossom', photo: 'https://images.unsplash.com/photo-1522383225653-ed111181a951' },
  { key: 'coast', name: 'Coastline', photo: 'https://images.unsplash.com/photo-1534445867742-43195f401b6c' },
  { key: 'savannah', name: 'Savannah', photo: 'https://images.unsplash.com/photo-1516426122078-c23e76319801' },
  { key: 'aurora', name: 'Aurora', photo: 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73' },
  { key: 'classic', name: 'Heritage', photo: null },
];

/* Hero — a couple watching the balloons rise over Cappadocia at dawn: human
   warmth and wonder, the feeling of being GIVEN a moment like this, not a
   destination pin. The closing CTA uses a different photo so the page doesn't
   repeat itself. */
const HERO_IMG = 'photo-1530789253388-582c481c54b0';
const CTA_IMG = 'photo-1469854523086-cc02fe5d8800';

const STEPS = [
  { n: '01', icon: Palette, t: 'Choose the value & the look', b: 'Set any amount from ₹2,500 upward and pick a card face. This is the amount they receive — in full, with nothing deducted.' },
  { n: '02', icon: PencilLine, t: 'Make it personal', b: 'Add who it is to, who it is from, and a message in your own words. It appears on the gift note as you type.' },
  { n: '03', icon: Send, t: 'Send it, or schedule it', b: 'Deliver it to their email or WhatsApp in seconds — or set a date and we hold it until the morning of the surprise.' },
];

const ASSURANCES = [
  { icon: Globe2, t: 'Redeemable the world over', b: 'Put towards any Cox & Kings journey across 100+ countries — group, bespoke or luxury. They choose where; you gave them the wings.' },
  { icon: Clock, t: 'Valid for a full 12 months', b: 'A whole year to dream, plan and pick the perfect dates. No rush, no pressure, no expiring in a drawer.' },
  { icon: ShieldCheck, t: 'Every rupee counts', b: 'No processing fees, no deductions. The exact value you choose is the exact value they can spend on travel.' },
  { icon: HeartHandshake, t: 'A specialist plans it with them', b: 'The gift comes with a real person to design the trip around them — the way Cox & Kings has since 1758.' },
];

/* Payment rails offered at checkout. Selection is presentational here — a real
   gateway (Razorpay / Stripe) does the actual charge; see the `pay` handler. */
const PAY_METHODS = [
  { key: 'upi', icon: Smartphone, label: 'UPI', sub: 'GPay, PhonePe, Paytm & more' },
  { key: 'card', icon: CreditCard, label: 'Credit / Debit card', sub: 'Visa, Mastercard, RuPay, Amex' },
  { key: 'netbanking', icon: Building2, label: 'Net banking', sub: 'All major Indian banks' },
  { key: 'wallet', icon: Wallet, label: 'Wallets', sub: 'Paytm, Amazon Pay, Mobikwik' },
];

const FAQS = [
  { q: 'Does the design decide where they can travel?', a: 'Not at all. The card face is purely decorative — a mood, not a map. The value is redeemable on any Cox & Kings journey, to any of 100+ countries. Where they go is entirely their choice.' },
  { q: 'How does the recipient use the gift card?', a: 'When they are ready to travel, they share the card and its code with a Cox & Kings specialist, who applies the full value to their journey and helps design the trip around them, start to finish.' },
  { q: 'Can I choose exactly when it is delivered?', a: 'Yes. Send it right away, or schedule it for a specific date — a birthday, an anniversary, the morning of the surprise. We hold it and deliver it on the day you choose.' },
  { q: 'What if the trip costs more than the gift card?', a: 'That is completely fine — the card is applied as credit and the balance is simply paid when they book. There is no obligation to spend it all at once, or all on one trip.' },
  { q: 'Is the amount I choose the amount they receive?', a: 'Exactly. There are no processing fees or deductions. Every rupee of the value you select goes towards their travel.' },
  { q: 'Can I send a gift card to someone outside India?', a: 'Yes. The card travels by email or WhatsApp anywhere in the world, and can be redeemed on any of our international journeys.' },
];

/* --------------------------------------------------------------- helpers */

/* Indian digit grouping — ₹1,00,000, not ₹100,000. */
function formatINR(n) {
  if (n === '' || n === null || n === undefined || Number.isNaN(Number(n))) return '';
  const s = String(Math.round(Number(n)));
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3);
  const grouped = rest ? `${rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',')},${last3}` : last3;
  return `₹${grouped}`;
}

const emailValid = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.trim());
const phoneDigits = (p) => p.replace(/\D/g, '');

/* A friendly, non-guessable code the recipient quotes when redeeming. */
function makeCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const block = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `CK-${block()}-${block()}`;
}

/* ------------------------------------------------------------- the card */

/* The live preview card. Pure presentation — every value is passed in, so it
   sits unchanged in the form (sticky) and again in the success panel.

   Deliberately carries NO destination: the face is a mood, and the words on it
   say the value is open to any journey, anywhere. The personal message lives on
   the paired note below, not here, so this face stays calm and uncramped. */
function GiftCard({ design, amount, to }) {
  const isClassic = design.key === 'classic';
  return (
    <div className={`gv-card gv-card--${design.key}${isClassic ? ' is-classic' : ''}`}>
      {!isClassic && (
        <div className="gv-card-photo" style={{ backgroundImage: `url(${img(design.photo, 1100)})` }} aria-hidden="true" />
      )}
      <div className="gv-card-veil" aria-hidden="true" />
      {isClassic && <img className="gv-card-watermark" src="/cox-logo-new.png" alt="" aria-hidden="true" />}

      <div className="gv-card-inner">
        <div className="gv-card-top">
          <img className="gv-card-crest" src="/cox-logo-new.png" alt="Cox & Kings" />
          <span className="gv-card-kind">Travel Gift Card</span>
        </div>

        <div className="gv-card-mid">
          <span className="gv-card-eyebrow">The gift of travel</span>
          <span className="gv-card-amount">{amount ? formatINR(amount) : '₹—'}</span>
          <span className="gv-card-rule" aria-hidden="true" />
          <span className="gv-card-redeem">Redeemable on any Cox &amp; Kings journey, anywhere in the world.</span>
        </div>

        <div className="gv-card-foot">
          <span className="gv-card-for"><span className="gv-card-tag">For</span> {to.trim() || 'a fellow traveller'}</span>
          <span className="gv-card-valid">Valid 12 months</span>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- page */

export default function GiftVouchers() {
  const root = useRef(null);

  /* ---- form state ---- */
  const [amount, setAmount] = useState(50000);
  const [customAmount, setCustomAmount] = useState('');
  const [design, setDesign] = useState(DESIGNS[0]);
  const [to, setTo] = useState('');
  const [from, setFrom] = useState('');
  const [message, setMessage] = useState('');
  const [method, setMethod] = useState('email');       // 'email' | 'whatsapp'
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [when, setWhen] = useState('now');             // 'now' | 'schedule'
  const [date, setDate] = useState('');

  /* The panel is a small state machine: design the gift → review & pay → done. */
  const [stage, setStage] = useState('form');          // 'form' | 'review' | 'done'
  const [code, setCode] = useState('');
  const [copied, setCopied] = useState(false);

  /* Sender-copy verification. Confirming the buyer's own email by OTP lets us
     send THEM a copy of the gift too — a record of exactly what the recipient
     got, which is what makes the purchase feel safe. Simulated client-side;
     wire `sendOtp`/`verifyOtp` to a backend that actually emails + checks the
     code before production. */
  const [senderEmail, setSenderEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState('');

  /* Payment. Selection only — a real gateway does the charge in `pay`. */
  const [payMethod, setPayMethod] = useState('');
  const [paying, setPaying] = useState(false);
  const [paidAt, setPaidAt] = useState(null);          // timestamp printed on the receipt

  const MSG_MAX = 200;

  const usingCustom = !AMOUNTS.includes(amount);
  const contactValid = method === 'email' ? emailValid(email) : phoneDigits(phone).length >= 7;
  const amountValid = amount >= MIN_AMOUNT && amount <= MAX_AMOUNT;
  const canSend = amountValid && to.trim().length > 0 && from.trim().length > 0 && contactValid
    && (when === 'now' || date !== '');

  const redeemLink = code ? `https://coxandkings.com/gift/${code}` : '';
  const messageBody = useMemo(() => [
    `${to.trim() || 'Hello'}, someone has sent you the world.`,
    '',
    `${from.trim() || 'A friend'} has gifted you a Cox & Kings Travel Gift Card worth ${formatINR(amount)} — towards any journey you choose, anywhere across 100+ countries.`,
    message.trim() ? `\n"${message.trim()}"\n` : '',
    code ? `Your gift code: ${code}` : '',
    redeemLink ? `Open your gift: ${redeemLink}` : '',
    '',
    'Valid for 12 months. A Cox & Kings specialist will help you plan every step. Bon voyage.',
  ].filter((l) => l !== null && l !== undefined).join('\n'), [to, from, amount, message, code, redeemLink]);

  const setPreset = (v) => { setAmount(v); setCustomAmount(''); };
  const onCustom = (e) => {
    const raw = e.target.value.replace(/[^\d]/g, '');
    setCustomAmount(raw);
    setAmount(raw ? Number(raw) : 0);
  };

  /* Designing done → open the pay drawer (a right-side window). */
  const submit = (e) => {
    e.preventDefault();
    if (!canSend) return;
    setStage('review');
  };

  /* Closing the drawer: after a completed purchase it resets everything for a
     fresh gift; mid-review it just returns to the (still-filled) design form. */
  const closeDrawer = () => { if (stage === 'done') reset(); else setStage('form'); };

  /* --- sender-copy OTP (simulated) --- */
  const sendOtp = () => {
    if (!emailValid(senderEmail)) { setOtpError('Enter a valid email so we can send you a copy.'); return; }
    setOtpCode(String(Math.floor(100000 + Math.random() * 900000)));
    setOtpSent(true); setOtpInput(''); setOtpError('');
  };
  const verifyOtp = () => {
    if (otpInput.trim() === otpCode) { setOtpVerified(true); setOtpError(''); }
    else setOtpError('That code doesn’t match. Please check and try again.');
  };

  /* --- payment (simulated) → gift is issued and sent --- */
  const canPay = otpVerified && payMethod !== '' && !paying;
  const pay = () => {
    if (!canPay) return;
    setPaying(true);
    /* Stand-in for the gateway round-trip. Swap for a real charge + a backend
       call that emails/WhatsApps the recipient and copies the sender. */
    setTimeout(() => {
      setCode(makeCode());
      setPaidAt(new Date());
      setPaying(false);
      setStage('done');
    }, 1600);
  };

  const reset = () => {
    setStage('form'); setCode(''); setCopied(false); setPaidAt(null);
    setSenderEmail(''); setOtpSent(false); setOtpCode(''); setOtpInput(''); setOtpVerified(false); setOtpError('');
    setPayMethod(''); setPaying(false);
  };

  /* Lock the page behind the open drawer, and let Escape close it. */
  useEffect(() => {
    if (stage === 'form') return undefined;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') closeDrawer(); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  const waHref = useMemo(() => {
    const digits = phoneDigits(phone);
    const base = method === 'whatsapp' && digits ? `https://wa.me/${digits}` : 'https://wa.me/';
    return `${base}?text=${encodeURIComponent(messageBody)}`;
  }, [phone, method, messageBody]);

  const mailHref = useMemo(() => {
    const subject = `You've been given the world — a gift from ${from.trim() || 'a friend'}`;
    return `mailto:${method === 'email' ? email.trim() : ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(messageBody)}`;
  }, [email, from, method, messageBody]);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(redeemLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch { /* clipboard blocked — the link is still visible to copy by hand */ }
  }, [redeemLink]);

  /* ------------------------------------------------------------- motion */
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        /* Hero load — the photo settles out of a slow push-in while the
           headline lines rise out of their masks. */
        gsap.timeline({ defaults: { ease: 'power3.out' } })
          .from('.gv-hero-media img', { scale: 1.16, duration: 1.8, ease: 'power2.out' })
          .from('.gv-hero-eyebrow', { opacity: 0, y: 14, duration: 0.7 }, 0.25)
          .from('.gv-hero-line span', { yPercent: 116, duration: 1.1, stagger: 0.1 }, 0.35)
          .from('.gv-hero-lede', { opacity: 0, y: 18, duration: 0.8 }, 0.95)
          .from('.gv-hero-cta > *', { opacity: 0, y: 16, duration: 0.7, stagger: 0.1 }, 1.15)
          .from('.gv-hero-facts li', { opacity: 0, y: 12, duration: 0.6, stagger: 0.08 }, 1.35)
          .from('.gv-hero-cue', { opacity: 0, duration: 0.7 }, 1.5);

        /* Hero photo drifts up as you leave it. */
        gsap.to('.gv-hero-media img', {
          yPercent: 12, ease: 'none',
          scrollTrigger: { trigger: '.gv-hero', start: 'top top', end: 'bottom top', scrub: true },
        });

        /* Generic reveals — resting state is visible; GSAP owns the from-state. */
        gsap.utils.toArray('[data-reveal]').forEach((el) => {
          gsap.from(el, {
            opacity: 0, y: 30, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 86%', once: true, invalidateOnRefresh: true },
          });
        });

        /* Staggered groups — one trigger, children cascade. */
        gsap.utils.toArray('[data-stagger]').forEach((group) => {
          gsap.from(group.children, {
            opacity: 0, y: 34, duration: 0.9, stagger: 0.12, ease: 'power3.out',
            scrollTrigger: { trigger: group, start: 'top 82%', once: true, invalidateOnRefresh: true },
          });
        });

        /* The step ledger's connecting rule draws itself in. */
        gsap.from('.gv-steps-rule', {
          scaleX: 0, transformOrigin: 'left center', duration: 1.3, ease: 'power3.inOut',
          scrollTrigger: { trigger: '.gv-steps', start: 'top 74%', once: true },
        });

        /* The designer's preview lifts in once. It then stays put (sticky) while
           the form scrolls beside it — no parallax drift, so it reads as fixed. */
        gsap.from('.gv-preview-stack', {
          opacity: 0, y: 40, duration: 1.1, ease: 'power3.out',
          scrollTrigger: { trigger: '.gv-designer', start: 'top 72%', once: true },
        });

        /* Closing CTA photo parallax. */
        gsap.to('.gv-cta-photo', {
          yPercent: 12, ease: 'none',
          scrollTrigger: { trigger: '.gv-cta', start: 'top bottom', end: 'bottom top', scrub: true },
        });
      });

      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener('load', refresh);
      const t = setTimeout(refresh, 900);
      return () => { window.removeEventListener('load', refresh); clearTimeout(t); };
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div className="h26 new-typo gv" ref={root}>
      <SiteNav />

      {/* ===================== HERO (Vision-&-Mission style) ===================== */}
      <header className="gv-hero">
        <div className="gv-hero-media" aria-hidden="true">
          <img src={img(`https://images.unsplash.com/${HERO_IMG}`, 2200)} alt="" fetchpriority="high" />
        </div>
        <div className="gv-hero-veil" aria-hidden="true" />

        <div className="gv-wrap gv-hero-inner">
          <p className="gv-hero-eyebrow">
            <span className="gv-rule" aria-hidden="true" />
            <span className="gv-eyebrow gv-eyebrow--light">Gift Vouchers</span>
          </p>

          <h1 className="gv-hero-h">
            <span className="gv-hero-line"><span>Give someone</span></span>
            <span className="gv-hero-line"><span><em>the world.</em></span></span>
          </h1>

          <p className="gv-hero-lede">
            A Cox &amp; Kings travel gift card — designed by you, delivered to their inbox or WhatsApp,
            and redeemable on any journey they dream up. Not a place. A possibility.
          </p>

          <div className="gv-hero-cta">
            <a href="#gv-designer" className="h26-btn h26-btn-pill h26-btn-lg">Create a gift card <ArrowRight size={16} aria-hidden="true" /></a>
            <a href="#gv-how" className="gv-hero-textlink">See how it works</a>
          </div>

          <ul className="gv-hero-facts">
            <li><Check size={14} aria-hidden="true" /> Any amount from ₹2,500</li>
            <li><Check size={14} aria-hidden="true" /> Spendable in 100+ countries</li>
            <li><Check size={14} aria-hidden="true" /> Valid a full 12 months</li>
          </ul>

          <p className="gv-hero-cue" aria-hidden="true"><span className="gv-cue-line" />Scroll</p>
        </div>
      </header>

      <main id="gv-main">
        {/* ===================== HOW IT WORKS ===================== */}
        <section className="gv-how" id="gv-how" aria-labelledby="gv-how-h">
          <div className="gv-wrap">
            <div className="gv-head" data-reveal>
              <p className="gv-eyebrow">In three simple steps</p>
              <h2 className="gv-h2" id="gv-how-h">You’ll know exactly what you’re giving</h2>
              <p className="gv-head-sub">No fine print, no expiring points. A clear amount, a real person to help them spend it, and a full year to decide where in the world it takes them.</p>
            </div>

            <div className="gv-steps">
              <span className="gv-steps-rule" aria-hidden="true" />
              <ol data-stagger>
                {STEPS.map((s) => (
                  <li className="gv-step" key={s.n}>
                    <span className="gv-step-badge" aria-hidden="true"><s.icon size={24} strokeWidth={1.5} /></span>
                    <span className="gv-step-n">Step {s.n}</span>
                    <h3 className="gv-step-t">{s.t}</h3>
                    <p className="gv-step-b">{s.b}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ===================== THE DESIGNER ===================== */}
        <section className="gv-designer" id="gv-designer" aria-labelledby="gv-designer-h">
          <div className="gv-wrap gv-designer-grid">
            {/* ---- Sticky live preview ---- */}
            <div className="gv-preview">
              <div className="gv-preview-sticky">
                <p className="gv-preview-label"><Sparkles size={13} aria-hidden="true" /> Live preview</p>

                <div className="gv-preview-stack">
                  <GiftCard design={design} amount={amount} to={to} />

                  {/* The paired gift note — where the personal message lives, with
                      room to breathe, so the card face itself stays uncramped. */}
                  <figure className="gv-note">
                    <figcaption className="gv-note-head"><PencilLine size={13} aria-hidden="true" /> A note {from.trim() ? `from ${from.trim().split(' ')[0]}` : ''}</figcaption>
                    <blockquote className="gv-note-msg">
                      {message.trim() || 'Somewhere in the world is a trip you’ll never forget. Go and find it — this one’s on me.'}
                    </blockquote>
                    <p className="gv-note-sign">— {from.trim() || 'you'}</p>
                  </figure>
                </div>

                {/* Plain-language "here's exactly what you're giving". */}
                <dl className="gv-value">
                  <div><dt>Value</dt><dd>{amount ? formatINR(amount) : '—'}</dd></div>
                  <div><dt>Good for</dt><dd>Any journey, worldwide</dd></div>
                  <div><dt>Valid</dt><dd>12 months</dd></div>
                  <div><dt>Delivered by</dt><dd>{method === 'email' ? 'Email' : 'WhatsApp'}, {when === 'now' ? 'instantly' : 'on your date'}</dd></div>
                </dl>
              </div>
            </div>

            {/* ---- The design form. "Preview & send" opens the pay drawer. ---- */}
            <div className="gv-panel">
              <form className="gv-form" onSubmit={submit} noValidate>
                  <header className="gv-form-head" data-reveal>
                    <p className="gv-eyebrow">Design your card</p>
                    <h2 className="gv-h2" id="gv-designer-h">Make it theirs</h2>
                  </header>

                  {/* Step 1 — Amount */}
                  <fieldset className="gv-step-block">
                    <legend className="gv-legend"><span className="gv-legend-n">1</span> Choose an amount</legend>
                    <div className="gv-chips" role="group" aria-label="Gift amount">
                      {AMOUNTS.map((v) => (
                        <button
                          type="button" key={v}
                          className={`gv-chip${amount === v && !usingCustom ? ' is-on' : ''}`}
                          onClick={() => setPreset(v)} aria-pressed={amount === v && !usingCustom}
                        >
                          {formatINR(v)}
                        </button>
                      ))}
                    </div>
                    <label className="gv-custom">
                      <span className="gv-custom-label">Or enter your own</span>
                      <span className="gv-custom-field">
                        <span className="gv-custom-cur" aria-hidden="true">₹</span>
                        <input
                          type="text" inputMode="numeric"
                          value={customAmount ? Number(customAmount).toLocaleString('en-IN') : ''}
                          onChange={onCustom} placeholder="e.g. 75,000" aria-label="Custom amount in rupees"
                        />
                      </span>
                    </label>
                    {!amountValid && (customAmount || usingCustom) && (
                      <p className="gv-hint gv-hint--warn">Enter an amount between {formatINR(MIN_AMOUNT)} and {formatINR(MAX_AMOUNT)}.</p>
                    )}
                    <p className="gv-hint">They receive the full amount — there are no fees taken out.</p>
                  </fieldset>

                  {/* Step 2 — Design */}
                  <fieldset className="gv-step-block">
                    <legend className="gv-legend"><span className="gv-legend-n">2</span> Pick a card face</legend>
                    <p className="gv-substep">Just how it looks — the gift is spendable anywhere, whichever you choose.</p>
                    <div className="gv-designs" role="group" aria-label="Card design">
                      {DESIGNS.map((d) => (
                        <button
                          type="button" key={d.key}
                          className={`gv-design${design.key === d.key ? ' is-on' : ''}`}
                          onClick={() => setDesign(d)} aria-pressed={design.key === d.key}
                        >
                          <span
                            className={`gv-design-img${d.key === 'classic' ? ' gv-design-img--classic' : ''}`}
                            style={d.photo ? { backgroundImage: `url(${img(d.photo, 320)})` } : undefined}
                            aria-hidden="true"
                          >
                            {d.key === 'classic' && <img src="/cox-logo-new.png" alt="" />}
                          </span>
                          <span className="gv-design-name">{d.name}</span>
                          {design.key === d.key && <span className="gv-design-tick" aria-hidden="true"><Check size={12} strokeWidth={3} /></span>}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  {/* Step 3 — Personalise */}
                  <fieldset className="gv-step-block">
                    <legend className="gv-legend"><span className="gv-legend-n">3</span> Add a personal touch</legend>
                    <div className="gv-field-row">
                      <label className="gv-field">
                        <span className="gv-field-label">To</span>
                        <input type="text" value={to} onChange={(e) => setTo(e.target.value)} placeholder="Their name" maxLength={40} autoComplete="off" />
                      </label>
                      <label className="gv-field">
                        <span className="gv-field-label">From</span>
                        <input type="text" value={from} onChange={(e) => setFrom(e.target.value)} placeholder="Your name" maxLength={40} autoComplete="name" />
                      </label>
                    </div>
                    <label className="gv-field">
                      <span className="gv-field-label">
                        A short message <span className="gv-opt">(optional)</span>
                        <span className="gv-count">{message.length}/{MSG_MAX}</span>
                      </span>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value.slice(0, MSG_MAX))}
                        placeholder="Happy 30th, Meera. Go chase the springtime you always talk about — this one's on us."
                        rows={3}
                      />
                    </label>
                  </fieldset>

                  {/* Step 4 — Delivery */}
                  <fieldset className="gv-step-block">
                    <legend className="gv-legend"><span className="gv-legend-n">4</span> How should we send it?</legend>
                    <div className="gv-toggle" role="tablist" aria-label="Delivery method">
                      <button type="button" role="tab" aria-selected={method === 'email'} className={`gv-toggle-btn${method === 'email' ? ' is-on' : ''}`} onClick={() => setMethod('email')}>
                        <Mail size={16} aria-hidden="true" /> Email
                      </button>
                      <button type="button" role="tab" aria-selected={method === 'whatsapp'} className={`gv-toggle-btn${method === 'whatsapp' ? ' is-on' : ''}`} onClick={() => setMethod('whatsapp')}>
                        <MessageCircle size={16} aria-hidden="true" /> WhatsApp
                      </button>
                    </div>

                    {method === 'email' ? (
                      <label className="gv-field">
                        <span className="gv-field-label">Their email address</span>
                        <input type="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@email.com" aria-invalid={email !== '' && !emailValid(email)} />
                        {email !== '' && !emailValid(email) && <span className="gv-hint gv-hint--warn">That doesn&apos;t look like an email address.</span>}
                      </label>
                    ) : (
                      <label className="gv-field">
                        <span className="gv-field-label">Their WhatsApp number</span>
                        <input type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" aria-invalid={phone !== '' && phoneDigits(phone).length < 7} />
                        {phone !== '' && phoneDigits(phone).length < 7 && <span className="gv-hint gv-hint--warn">Please enter a valid phone number with country code.</span>}
                      </label>
                    )}

                    <div className="gv-when">
                      <button type="button" className={`gv-when-btn${when === 'now' ? ' is-on' : ''}`} onClick={() => setWhen('now')} aria-pressed={when === 'now'}>Send now</button>
                      <button type="button" className={`gv-when-btn${when === 'schedule' ? ' is-on' : ''}`} onClick={() => setWhen('schedule')} aria-pressed={when === 'schedule'}>Schedule a date</button>
                      {when === 'schedule' && (
                        <input className="gv-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-label="Delivery date" />
                      )}
                    </div>
                  </fieldset>

                  <div className="gv-submit-row">
                    <button type="submit" className="h26-btn h26-btn-pill h26-btn-lg gv-submit" disabled={!canSend}>
                      Preview &amp; send <ArrowRight size={16} aria-hidden="true" />
                    </button>
                    <p className="gv-submit-note">Opens a secure window to review your bill and pay. No charge until you confirm.</p>
                  </div>
                </form>
            </div>
          </div>
        </section>

        {/* ===================== WHY ===================== */}
        <section className="gv-why" aria-labelledby="gv-why-h">
          <div className="gv-wrap">
            <div className="gv-head gv-head--center" data-reveal>
              <p className="gv-eyebrow gv-eyebrow--light">Why a Cox &amp; Kings gift</p>
              <h2 className="gv-h2 gv-h2--light" id="gv-why-h">A gift that keeps its promise</h2>
              <p className="gv-head-sub gv-head-sub--light">Not a voucher that expires in a drawer — the beginning of a journey, backed by the people who have planned them since 1758.</p>
            </div>
            <ul className="gv-assur" data-stagger>
              {ASSURANCES.map((a) => (
                <li className="gv-assur-item" key={a.t}>
                  <span className="gv-assur-ic" aria-hidden="true"><a.icon size={22} strokeWidth={1.5} /></span>
                  <h3 className="gv-assur-t">{a.t}</h3>
                  <p className="gv-assur-b">{a.b}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ===================== FAQ ===================== */}
        <section className="gv-faq" aria-labelledby="gv-faq-h">
          <div className="gv-wrap gv-faq-grid">
            <div className="gv-faq-intro" data-reveal>
              <p className="gv-eyebrow">Good to know</p>
              <h2 className="gv-h2" id="gv-faq-h">Questions, answered</h2>
              <p className="gv-head-sub">Anything else? A specialist is a message away.</p>
              <Link to={CALLBACK} className="h26-btn h26-btn-ghost h26-btn-lg gv-faq-cta"><MessageCircle size={16} aria-hidden="true" /> Talk to a specialist</Link>
            </div>
            <div className="gv-faq-list" data-reveal>
              {FAQS.map((f, i) => <FaqItem key={f.q} f={f} defaultOpen={i === 0} />)}
            </div>
          </div>
        </section>

        {/* ===================== CLOSING CTA ===================== */}
        <section className="gv-cta" aria-labelledby="gv-cta-h">
          <div className="gv-cta-photo" style={{ backgroundImage: `url(${img(`https://images.unsplash.com/${CTA_IMG}`, 1900)})` }} aria-hidden="true" />
          <div className="gv-cta-veil" aria-hidden="true" />
          <div className="gv-wrap gv-cta-inner" data-reveal>
            <Plane size={26} strokeWidth={1.3} aria-hidden="true" className="gv-cta-plane" />
            <h2 className="gv-cta-h" id="gv-cta-h">Somewhere out there is a trip they’ll never forget.</h2>
            <p className="gv-cta-sub">Start it with a card that says you know them — and lets them choose where it leads.</p>
            <a href="#gv-designer" className="h26-btn h26-btn-glass h26-btn-lg">Create their gift card <ArrowRight size={16} aria-hidden="true" /></a>
          </div>
        </section>
      </main>

      {/* ===================== PAY DRAWER (right-side window) =====================
          Modelled on the tour-detail booking drawer: a fixed scrim + a panel that
          slides in from the right, with a pinned header, a scrolling body and a
          pinned footer CTA. Portaled to <body> so no transformed ancestor from
          the page's GSAP work can break its fixed positioning. */}
      {stage !== 'form' && createPortal(
        <div className="gv gv-drawer" role="dialog" aria-modal="true" aria-label={stage === 'done' ? 'Payment receipt' : 'Review and pay'}>
          <div className="gv-drawer__scrim" onClick={closeDrawer} />
          <aside className="gv-drawer__panel">
            <button className="gv-drawer__close" aria-label="Close" onClick={closeDrawer}><X size={18} /></button>

            {stage === 'review' ? (
              <>
                <header className="gv-drawer__head">
                  <span className="gv-eyebrow">Review &amp; pay</span>
                  <h3 className="gv-drawer__title">Confirm &amp; send your gift</h3>
                  <p className="gv-drawer__sub">Check the details, confirm your email for a copy, and choose how to pay — you’ll see your full bill before anything is charged.</p>
                </header>

                <div className="gv-drawer__body">
                  {/* On mobile the card isn't shown on the page — it appears here,
                      first thing after "Preview & send". Hidden on desktop, where
                      the sticky preview beside the form already shows it. */}
                  <div className="gv-drawer-preview">
                    <GiftCard design={design} amount={amount} to={to} />
                  </div>

                  {/* -- gift summary -- */}
                  <div className="gv-co-block">
                    <div className="gv-co-blockhead">
                      <h3 className="gv-co-h">Your gift</h3>
                      <button type="button" className="gv-editlink" onClick={() => setStage('form')}><Pencil size={13} aria-hidden="true" /> Edit</button>
                    </div>
                    <dl className="gv-summary">
                      <div><dt>Value</dt><dd>{formatINR(amount)}</dd></div>
                      <div><dt>Card face</dt><dd>{design.name}</dd></div>
                      <div><dt>To</dt><dd>{to.trim()}</dd></div>
                      <div><dt>From</dt><dd>{from.trim()}</dd></div>
                      <div>
                        <dt>Delivery</dt>
                        <dd>
                          {method === 'email' ? email.trim() : phone.trim()}
                          {' · '}
                          {when === 'schedule' && date
                            ? new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                            : 'Instantly'}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  {/* -- sender-copy verification (trust) -- */}
                  <div className="gv-co-block">
                    <div className="gv-co-blockhead">
                      <h3 className="gv-co-h"><ShieldCheck size={16} aria-hidden="true" /> Send a copy to yourself</h3>
                    </div>
                    <p className="gv-co-note">
                      We’ll email you the same gift card, so you have a record of exactly what {to.trim().split(' ')[0] || 'they'} received.
                      Confirm your address with a one-time code.
                    </p>

                    {!otpVerified ? (
                      <>
                        <div className="gv-otp-row">
                          <input
                            className="gv-otp-email" type="email" inputMode="email"
                            value={senderEmail} onChange={(e) => { setSenderEmail(e.target.value); setOtpSent(false); setOtpError(''); }}
                            placeholder="your@email.com" aria-label="Your email address"
                            aria-invalid={!!otpError && !otpSent}
                          />
                          <button type="button" className="h26-btn h26-btn-ghost gv-otp-btn" onClick={sendOtp} disabled={!emailValid(senderEmail)}>
                            {otpSent ? 'Resend OTP' : 'Send OTP'}
                          </button>
                        </div>

                        {otpSent && (
                          <div className="gv-otp-verify">
                            <p className="gv-otp-sentline"><Mail size={13} aria-hidden="true" /> We sent a 6-digit OTP to <strong>{senderEmail}</strong>.</p>
                            <div className="gv-otp-row">
                              <input
                                className="gv-otp-code" type="text" inputMode="numeric" maxLength={6}
                                value={otpInput} onChange={(e) => { setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 6)); setOtpError(''); }}
                                placeholder="Enter OTP" aria-label="6-digit one-time code" aria-invalid={!!otpError}
                              />
                              <button type="button" className="h26-btn h26-btn-pill gv-otp-btn" onClick={verifyOtp} disabled={otpInput.length !== 6}>Verify</button>
                            </div>
                            {/* Prototype only — there is no email backend, so the OTP is shown here.
                                Delete this line once sendOtp posts to a real endpoint. */}
                            <p className="gv-otp-demo">Preview build — no email is actually sent. Your OTP is <strong>{otpCode}</strong>.</p>
                          </div>
                        )}
                        {otpError && <p className="gv-hint gv-hint--warn">{otpError}</p>}
                      </>
                    ) : (
                      <div className="gv-verified">
                        <span className="gv-verified-ic" aria-hidden="true"><Check size={15} strokeWidth={3} /></span>
                        <span className="gv-verified-txt">
                          <strong>{senderEmail}</strong>
                          <span className="gv-verified-status">Confirmed — your copy is on its way once you pay.</span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* -- payment method -- */}
                  <div className="gv-co-block">
                    <div className="gv-co-blockhead">
                      <h3 className="gv-co-h">Pay with</h3>
                    </div>
                    <div className="gv-pay-methods" role="radiogroup" aria-label="Payment method">
                      {PAY_METHODS.map((m) => (
                        <button
                          type="button" key={m.key} role="radio" aria-checked={payMethod === m.key}
                          className={`gv-pay-method${payMethod === m.key ? ' is-on' : ''}`}
                          onClick={() => setPayMethod(m.key)}
                        >
                          <span className="gv-pay-ic" aria-hidden="true"><m.icon size={20} strokeWidth={1.6} /></span>
                          <span className="gv-pay-txt"><span className="gv-pay-label">{m.label}</span><span className="gv-pay-sub">{m.sub}</span></span>
                          <span className="gv-pay-dot" aria-hidden="true" />
                        </button>
                      ))}
                    </div>
                    <p className="gv-pay-secure"><Lock size={13} aria-hidden="true" /> 256-bit secured payment · 100% refundable while unused</p>
                  </div>

                  {/* -- the bill, in writing -- */}
                  <div className="gv-co-block gv-bill">
                    <div className="gv-co-blockhead">
                      <h3 className="gv-co-h"><FileText size={16} aria-hidden="true" /> Your bill</h3>
                    </div>
                    <dl className="gv-bill-lines">
                      <div><dt>Gift card value</dt><dd>{formatINR(amount)}</dd></div>
                      <div><dt>Delivery ({method === 'email' ? 'email' : 'WhatsApp'})</dt><dd className="gv-bill-free">Free</dd></div>
                      <div><dt>Processing fee</dt><dd className="gv-bill-free">₹0</dd></div>
                      <div className="gv-bill-total"><dt>Total payable</dt><dd>{formatINR(amount)}</dd></div>
                    </dl>
                    <p className="gv-bill-note">No fees, no deductions — {to.trim().split(' ')[0] || 'they'} receives the full {formatINR(amount)} towards travel.</p>
                  </div>
                </div>

                <footer className="gv-drawer__foot">
                  <div className="gv-foot-total"><span>Total payable</span><strong>{formatINR(amount)}</strong></div>
                  <button type="button" className="h26-btn h26-btn-pill h26-btn-lg gv-pay-btn" onClick={pay} disabled={!canPay}>
                    {paying
                      ? <><RefreshCw size={16} className="gv-spin" aria-hidden="true" /> Processing payment…</>
                      : <>Pay {formatINR(amount)} &amp; send gift <ArrowRight size={16} aria-hidden="true" /></>}
                  </button>
                  <p className="gv-drawer__footnote">
                    {!otpVerified ? 'Confirm your email above to unlock payment.' : payMethod === '' ? 'Choose a payment method to continue.' : 'The gift sends the instant your payment succeeds.'}
                  </p>
                </footer>
              </>
            ) : (
              /* ============ DONE — receipt / bill in writing ============ */
              <>
                <header className="gv-drawer__head gv-drawer__head--done">
                  <span className="gv-done-ic" aria-hidden="true"><Check size={24} strokeWidth={2.4} /></span>
                  <span className="gv-eyebrow">Payment successful</span>
                  <h3 className="gv-drawer__title">Paid — the gift is on its way{to.trim() ? `, to ${to.trim().split(' ')[0]}` : ''}.</h3>
                  <p className="gv-drawer__sub">A copy of this receipt has been emailed to {senderEmail}. Here’s everything, in writing.</p>
                </header>

                <div className="gv-drawer__body">
                  {/* -- the receipt -- */}
                  <div className="gv-co-block gv-bill">
                    <div className="gv-co-blockhead">
                      <h3 className="gv-co-h"><FileText size={16} aria-hidden="true" /> Receipt</h3>
                      <span className="gv-receipt-ref">{code}</span>
                    </div>
                    <dl className="gv-bill-lines">
                      <div><dt>Date</dt><dd>{paidAt ? paidAt.toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}</dd></div>
                      <div><dt>Paid via</dt><dd>{PAY_METHODS.find((m) => m.key === payMethod)?.label || 'Card'}</dd></div>
                      <div><dt>Gift card value</dt><dd>{formatINR(amount)}</dd></div>
                      <div><dt>Fees</dt><dd className="gv-bill-free">₹0</dd></div>
                      <div className="gv-bill-total"><dt>Total paid</dt><dd>{formatINR(amount)}</dd></div>
                    </dl>
                  </div>

                  {/* -- what happened -- */}
                  <ul className="gv-done-confirms">
                    <li><span className="gv-tick" aria-hidden="true"><Check size={13} strokeWidth={3} /></span><span className="gv-confirm-txt">Delivered to <strong>{to.trim()}</strong> by {method === 'email' ? 'email' : 'WhatsApp'} ({method === 'email' ? email.trim() : phone.trim()}){when === 'schedule' && date ? ', on your chosen date' : ''}.</span></li>
                    <li><span className="gv-tick" aria-hidden="true"><Check size={13} strokeWidth={3} /></span><span className="gv-confirm-txt">A copy sent to you at <strong>{senderEmail}</strong> for your records.</span></li>
                    <li><span className="gv-tick" aria-hidden="true"><Check size={13} strokeWidth={3} /></span><span className="gv-confirm-txt">Gift code <strong>{code}</strong>, valid 12 months, redeemable worldwide.</span></li>
                  </ul>

                  {/* -- manual send -- */}
                  <div className="gv-co-block">
                    <div className="gv-co-blockhead"><h3 className="gv-co-h">Prefer to hand it over yourself?</h3></div>
                    <div className="gv-done-link">
                      <span className="gv-done-link-label">Shareable gift link</span>
                      <div className="gv-done-link-row">
                        <code>{redeemLink}</code>
                        <button type="button" className="gv-copy" onClick={copyLink}>
                          {copied ? <><Check size={15} aria-hidden="true" /> Copied</> : <><Copy size={15} aria-hidden="true" /> Copy</>}
                        </button>
                      </div>
                    </div>
                    <div className="gv-done-actions">
                      <a href={waHref} target="_blank" rel="noopener noreferrer" className="h26-btn h26-btn-ghost gv-btn-share"><MessageCircle size={16} aria-hidden="true" /> WhatsApp</a>
                      <a href={mailHref} className="h26-btn h26-btn-ghost gv-btn-share"><Mail size={16} aria-hidden="true" /> Email</a>
                    </div>
                  </div>
                </div>

                <footer className="gv-drawer__foot">
                  <button type="button" className="h26-btn h26-btn-pill h26-btn-lg gv-pay-btn" onClick={reset}>Create another gift</button>
                  <p className="gv-drawer__footnote">Questions about a gift? <Link to={CALLBACK} className="gv-inline-link">Talk to a specialist</Link> or email {CONTACT_CK.email}.</p>
                </footer>
              </>
            )}
          </aside>
        </div>,
        document.body,
      )}

      <SiteFooter />
    </div>
  );
}

/* One FAQ row — a controlled disclosure so the chevron rotates and the panel
   animates open. */
function FaqItem({ f, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`gv-faq-item${open ? ' is-open' : ''}`}>
      <button type="button" className="gv-faq-q" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <span>{f.q}</span>
        <ChevronDown size={18} className="gv-faq-chev" aria-hidden="true" />
      </button>
      <div className="gv-faq-a" hidden={!open}>
        <p>{f.a}</p>
      </div>
    </div>
  );
}
