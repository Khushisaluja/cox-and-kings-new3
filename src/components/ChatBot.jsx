import { useState, useRef, useEffect, useCallback } from 'react';
import {
  X, Send, ChevronDown, Sparkles, ArrowRight, Star, Clock,
  Users, Phone, Mail, Maximize2, Minimize2, RotateCcw, ChevronDown as ScrollDown,
} from 'lucide-react';
import { tours } from '../data/tours';
import { Link } from 'react-router-dom';
import './ChatBot.css';

const EMPTY_PROFILE = {
  destination: null, region: null, travelStyle: null,
  month: null, duration: null, budget: null,
};

const STAGES = {
  WELCOME: 'welcome', DESTINATION: 'destination', TRAVEL_STYLE: 'travel_style',
  MONTH: 'month', DURATION: 'duration', BUDGET: 'budget',
  RESULTS: 'results', DETAIL: 'detail', HANDOFF: 'handoff',
  CAPTURE: 'capture', DONE: 'done',
};

const PROGRESS_STAGES = [
  STAGES.DESTINATION, STAGES.TRAVEL_STYLE, STAGES.MONTH,
  STAGES.DURATION, STAGES.BUDGET, STAGES.RESULTS,
];

const DESTINATIONS = [
  { label: 'India',          region: 'Asia',          emoji: '🇮🇳', image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=160&q=75' },
  { label: 'Japan',          region: 'Asia',          emoji: '🇯🇵', image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=160&q=75' },
  { label: 'Kenya',          region: 'Africa',        emoji: '🦁', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=160&q=75' },
  { label: 'Peru',           region: 'Latin America', emoji: '🏔️', image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=160&q=75' },
  { label: 'Morocco',        region: 'Africa',        emoji: '🕌', image: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=160&q=75' },
  { label: 'Italy',          region: 'Europe',        emoji: '🇮🇹', image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=160&q=75' },
  { label: 'Iceland',        region: 'Europe',        emoji: '🌌', image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=160&q=75' },
  { label: 'Egypt',          region: 'Africa',        emoji: '🏛️', image: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=160&q=75' },
  { label: "Not sure yet",   region: null,            emoji: '✨', image: null },
];

const TRAVEL_STYLES = [
  { label: 'Just the two of us', sub: 'Romantic escape', value: 'romantic', emoji: '💑' },
  { label: 'Family trip',        sub: 'With children',   value: 'family',   emoji: '👨‍👩‍👧‍👦' },
  { label: 'Solo adventure',     sub: 'Just me',         value: 'solo',     emoji: '🎒' },
  { label: 'Group of friends',   sub: 'Small group',     value: 'group',    emoji: '👥' },
];

const MONTHS = [
  ['Jan', 'Feb', 'Mar', 'Apr'],
  ['May', 'Jun', 'Jul', 'Aug'],
  ['Sep', 'Oct', 'Nov', 'Dec'],
];

const DURATIONS = [
  { label: 'Under a week',   sub: '4–6 nights',     value: 'short',    emoji: '⚡' },
  { label: 'Around 10 days', sub: 'The sweet spot',  value: 'ten',      emoji: '✅' },
  { label: 'A fortnight',    sub: '14 nights',       value: 'fortnight',emoji: '🗓️' },
  { label: 'Three weeks+',   sub: 'Deep immersion',  value: 'longer',   emoji: '🌍' },
];

const BUDGETS = [
  { label: 'Under ₹2,00,000',          sub: 'per person', value: 'budget',  emoji: '🌱' },
  { label: '₹2,00,000 – ₹4,00,000',    sub: 'per person', value: 'mid',     emoji: '⭐' },
  { label: '₹4,00,000 – ₹6,50,000',    sub: 'per person', value: 'premium', emoji: '✨' },
  { label: '₹6,50,000+',               sub: 'Luxury',     value: 'luxury',  emoji: '💎' },
];

// ── Stage → input placeholder ─────────────────────────────────────────────────
const STAGE_PLACEHOLDER = {
  [STAGES.WELCOME]:      'Type a destination or question…',
  [STAGES.DESTINATION]:  'Or type a destination…',
  [STAGES.TRAVEL_STYLE]: 'Or describe who\'s travelling…',
  [STAGES.MONTH]:        'Or type a month or season…',
  [STAGES.DURATION]:     'Or tell me how long you have…',
  [STAGES.BUDGET]:       'Or tell me your budget…',
  [STAGES.RESULTS]:      'Ask me anything about these tours…',
  [STAGES.DETAIL]:       'Ask me anything…',
  [STAGES.HANDOFF]:      'Type your name and email…',
  [STAGES.DONE]:         'Ask me anything else…',
};

function matchTours(profile) {
  let pool = [...tours];
  if (profile.destination && profile.destination !== 'Not sure yet') {
    const exact = pool.filter(t => t.destination.toLowerCase() === profile.destination.toLowerCase());
    if (exact.length) pool = exact;
    else if (profile.region) pool = pool.filter(t => t.region === profile.region);
  }
  if (profile.budget === 'budget')  pool = pool.filter(t => t.price < 3000);
  if (profile.budget === 'mid')     pool = pool.filter(t => t.price >= 2500 && t.price <= 5000);
  if (profile.budget === 'premium') pool = pool.filter(t => t.price >= 5000 && t.price <= 8000);
  if (profile.budget === 'luxury')  pool = pool.filter(t => t.price >= 5000);
  if (profile.travelStyle === 'family') pool = pool.filter(t => t.groupSize !== 'Max 12');
  if (profile.travelStyle === 'romantic') pool.sort((a, b) => b.rating - a.rating);
  if (!pool.length) pool = tours.slice(0, 3);
  return pool.slice(0, 3);
}

function buildBotMessage(stage, profile, extra = {}) {
  switch (stage) {
    case STAGES.WELCOME:
      return {
        text: `Hello! I'm your personal Cox & Kings travel concierge.\n\nI'll help you discover, plan and book a journey that's made for you — not a generic package. It takes about 2 minutes.\n\n**Where in the world are you dreaming of?**`,
        widget: 'destinations',
      };
    case STAGES.DESTINATION:
      return {
        text: profile.destination === 'Not sure yet'
          ? `No problem at all — that's often where the best journeys begin. Let me help you discover the right fit.\n\n**Who are you travelling with?**`
          : `**${profile.destination}** — a wonderful choice. You're going to love it.\n\n**Who's joining you on this adventure?**`,
        widget: 'travel_style',
      };
    case STAGES.TRAVEL_STYLE: {
      const found = TRAVEL_STYLES.find(s => s.value === profile.travelStyle);
      return {
        text: `${found?.label || 'Got it'} — I'll make sure the pace and style feel just right for you.\n\n**When are you hoping to travel?**`,
        widget: 'month',
      };
    }
    case STAGES.MONTH:
      return {
        text: `${profile.month} is a beautiful time to travel. Noted.\n\n**How long do you have?**`,
        widget: 'duration',
      };
    case STAGES.DURATION:
      return {
        text: `Perfect. One last question — and it genuinely helps me find the right match.\n\n**What's your rough budget per person?**`,
        widget: 'budget',
      };
    case STAGES.BUDGET: {
      const matched = matchTours(profile);
      const dest = profile.destination && profile.destination !== 'Not sure yet' ? profile.destination : 'your wishlist';
      return {
        text: `Wonderful. Based on everything you've shared — **${dest}**, **${profile.month}**, **${TRAVEL_STYLES.find(s=>s.value===profile.travelStyle)?.label || 'your group'}**, **${BUDGETS.find(b=>b.value===profile.budget)?.label || 'your budget'}** — I've found **${matched.length} journeys** I think you'll love.\n\nHere's your personal shortlist:`,
        widget: 'tour_cards',
        tours: matched,
      };
    }
    case STAGES.DETAIL: {
      const t = extra.tour;
      if (!t) return { text: 'Which tour would you like to know more about?', widget: null };
      return {
        text: `**${t.title}** is one of our most celebrated itineraries.\n\nIn ${t.duration} you'll experience:\n${t.highlights.map(h => `• ${h}`).join('\n')}\n\n📅 Departures: ${t.departures}\n👥 ${t.groupSize}\n\nWould you like one of our **${t.destination} specialists** to call you? They've visited every site on this tour personally.`,
        widget: 'handoff_prompt',
      };
    }
    case STAGES.HANDOFF:
      return {
        text: `Excellent! To connect you with the right person, I just need a couple of details.\n\n**What's your first name and email address?**`,
        widget: 'capture_form',
      };
    case STAGES.DONE:
      return {
        text: `Thank you, **${extra.firstName || 'traveller'}**! Your enquiry is on its way to our ${profile.destination && profile.destination !== 'Not sure yet' ? profile.destination : 'travel'} specialist.\n\nThey'll be in touch within **2 working hours**. Is there anything else I can help you with in the meantime?`,
        widget: 'done_cta',
      };
    default:
      return { text: 'How can I help you further?', widget: null };
  }
}

// ── Tour card (in chat) ───────────────────────────────────────────────────────
function ChatTourCard({ tour, onSelect, expanded }) {
  return (
    <button className={`chat-tour-card ${expanded ? 'chat-tour-card--expanded' : ''}`} onClick={() => onSelect(tour)}>
      <div className="chat-tour-card__img" style={{ backgroundImage: `url(${tour.image})` }}>
        {tour.badge && <span className="chat-tour-card__badge">{tour.badge}</span>}
      </div>
      <div className="chat-tour-card__body">
        <div className="chat-tour-card__meta">
          <span className="chat-tour-card__dest">{tour.destination}</span>
          <span className="chat-tour-card__rating"><Star size={10} fill="currentColor" /> {tour.rating}</span>
        </div>
        <h4 className="chat-tour-card__title">{tour.title}</h4>
        {expanded && (
          <p className="chat-tour-card__highlights">
            {tour.highlights.slice(0, 2).join(' · ')}
          </p>
        )}
        <div className="chat-tour-card__details">
          <span><Clock size={10} /> {tour.duration}</span>
          <span><Users size={10} /> {tour.groupSize}</span>
        </div>
        <div className="chat-tour-card__footer">
          <span className="chat-tour-card__price">from ₹{(tour.price * 83).toLocaleString('en-IN')} pp</span>
          <span className="chat-tour-card__cta">Tell me more <ArrowRight size={11} /></span>
        </div>
      </div>
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ChatBot({ open: openProp, onOpenChange, hideFab = false, openExpanded, name = 'Cox & Kings Concierge' } = {}) {
  // Optional controlled-open: when `open`/`onOpenChange` are passed (e.g. a host
  // page with its own launcher), the parent drives visibility and `hideFab` can
  // suppress the built-in launcher. With no props it behaves exactly as before.
  const [openState, setOpenState] = useState(false);
  const open = openProp !== undefined ? openProp : openState;
  const setOpen = (v) => {
    const next = typeof v === 'function' ? v(open) : v;
    if (openProp === undefined) setOpenState(next);
    if (onOpenChange) onOpenChange(next);
  };
  const [expanded, setExpanded]       = useState(false);

  /* `openExpanded` lets a host page launch the chat centred (expanded) rather
     than docked in the corner — used where the chat IS the task, not a side
     offer. Re-applied on each open, so a page with two launchers (a "start
     here" card vs. the floating button) can give each its own presentation.

     Left UNDEFINED by default and no-op in that case: callers that don't opt in
     keep today's behaviour exactly, where `expanded` persists across opens. */
  useEffect(() => {
    if (open && openExpanded !== undefined) setExpanded(openExpanded);
  }, [open, openExpanded]);
  const [stage, setStage]             = useState(STAGES.WELCOME);
  const [profile, setProfile]         = useState(EMPTY_PROFILE);
  const [messages, setMessages]       = useState([]);
  const [inputValue, setInputValue]   = useState('');
  const [captureEmail, setCaptureEmail]           = useState('');
  const [captureFirstName, setCaptureFirstName]   = useState('');
  const [captureError, setCaptureError]           = useState('');
  const [isTyping, setIsTyping]       = useState(false);
  const [hasOpened, setHasOpened]     = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const messagesRef  = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef     = useRef(null);
  const isAtBottomRef = useRef(true);

  // ── Scroll tracking ─────────────────────────────────────────────────────────
  const handleScroll = useCallback(() => {
    const el = messagesRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
    isAtBottomRef.current = atBottom;
    setShowScrollBtn(!atBottom);
    if (atBottom) setUnreadCount(0);
  }, []);

  const scrollToBottom = useCallback((force = false) => {
    if (force || isAtBottomRef.current) {
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 60);
    } else {
      setUnreadCount(c => c + 1);
    }
  }, []);

  // ── Init on first open ───────────────────────────────────────────────────────
  useEffect(() => {
    if (open && !hasOpened) {
      setHasOpened(true);
      pushBotMessage(buildBotMessage(STAGES.WELCOME, profile), 420);
    }
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open]);

  useEffect(() => { if (open) scrollToBottom(); }, [messages, open]);

  // ── Keyboard: Escape collapses expanded, then closes ────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (expanded) setExpanded(false);
        else if (open) setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, expanded]);

  // ── Message helpers ──────────────────────────────────────────────────────────
  function pushBotMessage(msg, delay = 860) {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now(), role: 'bot', time: new Date(), ...msg }]);
      setIsTyping(false);
    }, delay);
  }

  function pushUserMessage(text) {
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', text, time: new Date() }]);
    scrollToBottom(true);
  }

  // ── Selection handlers ───────────────────────────────────────────────────────
  function handleDestinationSelect(dest) {
    const p = { ...profile, destination: dest.label, region: dest.region };
    setProfile(p); setStage(STAGES.DESTINATION);
    pushUserMessage(dest.label);
    pushBotMessage(buildBotMessage(STAGES.DESTINATION, p));
  }

  function handleTravelStyleSelect(s) {
    const p = { ...profile, travelStyle: s.value };
    setProfile(p); setStage(STAGES.MONTH);
    pushUserMessage(`${s.emoji} ${s.label}`);
    pushBotMessage(buildBotMessage(STAGES.TRAVEL_STYLE, p));
  }

  function handleMonthSelect(month) {
    const p = { ...profile, month };
    setProfile(p); setStage(STAGES.DURATION);
    pushUserMessage(month);
    pushBotMessage(buildBotMessage(STAGES.MONTH, p));
  }

  function handleDurationSelect(d) {
    const p = { ...profile, duration: d.value };
    setProfile(p); setStage(STAGES.BUDGET);
    pushUserMessage(`${d.emoji} ${d.label}`);
    pushBotMessage(buildBotMessage(STAGES.DURATION, p));
  }

  function handleBudgetSelect(b) {
    const p = { ...profile, budget: b.value };
    setProfile(p); setStage(STAGES.RESULTS);
    pushUserMessage(`${b.emoji} ${b.label}`);
    pushBotMessage(buildBotMessage(STAGES.BUDGET, p), 1200);
  }

  function handleTourSelect(tour) {
    pushUserMessage(`Tell me more about "${tour.title}"`);
    setStage(STAGES.DETAIL);
    pushBotMessage(buildBotMessage(STAGES.DETAIL, profile, { tour }));
  }

  function handleHandoffYes() {
    pushUserMessage("Yes, have a specialist call me");
    setStage(STAGES.HANDOFF);
    pushBotMessage(buildBotMessage(STAGES.HANDOFF, profile));
  }

  function handleHandoffNo() {
    pushUserMessage("I'll browse for now");
    setStage(STAGES.DONE);
    pushBotMessage({
      text: `No problem — take your time. All the tours I showed you are on the website.\n\nIf you'd like a specialist to call you later, just come back and I'll pick up where we left off. Happy exploring! 🌍`,
      widget: 'done_cta',
    });
  }

  function handleCaptureSubmit(e) {
    e.preventDefault();
    if (!captureFirstName.trim()) { setCaptureError('Please enter your first name'); return; }
    if (!captureEmail || !/\S+@\S+\.\S+/.test(captureEmail)) { setCaptureError('Please enter a valid email'); return; }
    setCaptureError('');
    pushUserMessage(`${captureFirstName} · ${captureEmail}`);
    setStage(STAGES.DONE);
    pushBotMessage(buildBotMessage(STAGES.DONE, profile, { firstName: captureFirstName }));
  }

  function handleFreeText(e) {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text) return;
    setInputValue('');
    pushUserMessage(text);
    const lower = text.toLowerCase();

    if ([STAGES.RESULTS, STAGES.DETAIL].includes(stage) &&
        (lower.includes('book') || lower.includes('call') || lower.includes('enquir') || lower.includes('speak'))) {
      setStage(STAGES.HANDOFF);
      pushBotMessage(buildBotMessage(STAGES.HANDOFF, profile));
      return;
    }
    if (stage === STAGES.RESULTS && lower.includes('more')) {
      const matched = matchTours(profile);
      if (matched[0]) { handleTourSelect(matched[0]); return; }
    }
    pushBotMessage({
      text: `Good to know — I've made a note of that. To make sure I find the perfect match, let's keep going with just a couple more questions!`,
      widget: [STAGES.RESULTS, STAGES.DETAIL].includes(stage) ? 'handoff_prompt' : null,
    }, 700);
  }

  function handleRestart() {
    setMessages([]);
    setStage(STAGES.WELCOME);
    setProfile(EMPTY_PROFILE);
    setCaptureEmail(''); setCaptureFirstName(''); setCaptureError('');
    setUnreadCount(0);
    pushBotMessage(buildBotMessage(STAGES.WELCOME, EMPTY_PROFILE), 400);
  }

  // ── Progress ─────────────────────────────────────────────────────────────────
  const progressIdx = PROGRESS_STAGES.indexOf(stage);
  const progressPct = progressIdx < 0
    ? ([STAGES.RESULTS, STAGES.DETAIL, STAGES.HANDOFF, STAGES.CAPTURE, STAGES.DONE].includes(stage) ? 100 : 0)
    : Math.round((progressIdx / (PROGRESS_STAGES.length - 1)) * 100);

  const placeholder = STAGE_PLACEHOLDER[stage] || 'Type anything…';

  return (
    <>
      {/* Backdrop for expanded mode */}
      {open && expanded && (
        <div className="chatbot-backdrop" onClick={() => setExpanded(false)} aria-hidden="true" />
      )}

      {/* FAB (suppressed when the host page supplies its own launcher) */}
      {!hideFab && (
        <button
          className={`chatbot-fab ${open ? 'chatbot-fab--open' : ''}`}
          onClick={() => setOpen(o => !o)}
          aria-label={open ? 'Close concierge' : 'Plan your trip with our concierge'}
        >
          <div className="chatbot-fab__icon">
            {open ? <X size={20} /> : <Sparkles size={20} />}
          </div>
          {!open && <span className="chatbot-fab__label">Plan My Trip</span>}
          {!open && <span className="chatbot-fab__pulse" />}
        </button>
      )}

      {/* Chat window */}
      <div
        className={`chatbot ${open ? 'chatbot--open' : ''} ${expanded ? 'chatbot--expanded' : ''}`}
        role="dialog"
        aria-label="Cox & Kings Travel Concierge"
        aria-modal={expanded}
      >
        {/* ── Header ── */}
        <div className="chatbot__header">
          <div className="chatbot__header-avatar">
            <Sparkles size={16} />
          </div>
          <div className="chatbot__header-info">
            <h3 className="chatbot__header-title">{name}</h3>
            <p className="chatbot__header-status">
              <span className="chatbot__online-dot" />
              {stage === STAGES.DONE ? 'Enquiry sent — we\'ll call you soon' : 'Personalising your journey'}
            </p>
          </div>
          <div className="chatbot__header-actions">
            {messages.length > 1 && (
              <button className="chatbot__icon-btn" onClick={handleRestart} title="Start over" aria-label="Restart conversation">
                <RotateCcw size={14} />
              </button>
            )}
            <button
              className="chatbot__icon-btn chatbot__icon-btn--expand"
              onClick={() => setExpanded(e => !e)}
              title={expanded ? 'Compact view' : 'Expand chat'}
              aria-label={expanded ? 'Collapse to compact view' : 'Expand to larger view'}
            >
              {expanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            </button>
            <button className="chatbot__icon-btn" onClick={() => { setOpen(false); setExpanded(false); }} aria-label="Close">
              <ChevronDown size={16} />
            </button>
          </div>
        </div>

        {/* ── Progress ── */}
        {progressPct > 0 && (
          <div className="chatbot__progress">
            <div className="chatbot__progress-track">
              <div className="chatbot__progress-bar" style={{ width: `${progressPct}%` }} />
            </div>
            <span className="chatbot__progress-label">
              {progressPct < 100 ? `Step ${progressIdx + 1} of ${PROGRESS_STAGES.length - 1} — building your trip profile` : '✓ Profile complete — here are your matches'}
            </span>
          </div>
        )}

        {/* ── Messages ── */}
        <div className="chatbot__messages" ref={messagesRef} onScroll={handleScroll}>
          {messages.map((msg, i) => {
            const showTime = i === 0 || (msg.time - messages[i - 1].time > 60000);
            return (
              <div key={msg.id} className={`chatbot__msg-group chatbot__msg-group--${msg.role}`}>
                {showTime && (
                  <div className="chatbot__time-divider">
                    {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                )}
                <div className={`chatbot__msg chatbot__msg--${msg.role}`}>
                  {msg.role === 'bot' && (
                    <div className="chatbot__msg-avatar"><Sparkles size={12} /></div>
                  )}
                  <div className="chatbot__msg-body">
                    {msg.text && (
                      <div
                        className="chatbot__msg-bubble"
                        dangerouslySetInnerHTML={{
                          __html: msg.text
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/\n/g, '<br/>'),
                        }}
                      />
                    )}

                    {/* ─ Widgets ─ */}
                    {msg.widget === 'destinations' && (
                      <div className={`chat-widget chat-destinations ${expanded ? 'chat-destinations--expanded' : ''}`}>
                        {DESTINATIONS.map(d => (
                          <button key={d.label} className="chat-dest-chip" onClick={() => handleDestinationSelect(d)}>
                            {d.image
                              ? <div className="chat-dest-chip__img" style={{ backgroundImage: `url(${d.image})` }} />
                              : <div className="chat-dest-chip__img chat-dest-chip__img--blank">{d.emoji}</div>
                            }
                            <span className="chat-dest-chip__label">{d.label}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {msg.widget === 'travel_style' && (
                      <div className={`chat-widget chat-grid-2 ${expanded ? 'chat-grid-expanded' : ''}`}>
                        {TRAVEL_STYLES.map(s => (
                          <button key={s.value} className="chat-option-card" onClick={() => handleTravelStyleSelect(s)}>
                            <span className="chat-option-card__emoji">{s.emoji}</span>
                            <span className="chat-option-card__label">{s.label}</span>
                            <span className="chat-option-card__sub">{s.sub}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {msg.widget === 'month' && (
                      <div className="chat-widget chat-months">
                        {MONTHS.map((row, ri) => (
                          <div key={ri} className="chat-months__row">
                            {row.map(m => (
                              <button key={m} className="chat-month-chip" onClick={() => handleMonthSelect(m)}>{m}</button>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}

                    {msg.widget === 'duration' && (
                      <div className={`chat-widget chat-grid-2 ${expanded ? 'chat-grid-expanded' : ''}`}>
                        {DURATIONS.map(d => (
                          <button key={d.value} className="chat-option-card" onClick={() => handleDurationSelect(d)}>
                            <span className="chat-option-card__emoji">{d.emoji}</span>
                            <span className="chat-option-card__label">{d.label}</span>
                            <span className="chat-option-card__sub">{d.sub}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {msg.widget === 'budget' && (
                      <div className={`chat-widget chat-grid-2 ${expanded ? 'chat-grid-expanded' : ''}`}>
                        {BUDGETS.map(b => (
                          <button key={b.value} className="chat-option-card" onClick={() => handleBudgetSelect(b)}>
                            <span className="chat-option-card__emoji">{b.emoji}</span>
                            <span className="chat-option-card__label">{b.label}</span>
                            <span className="chat-option-card__sub">{b.sub}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {msg.widget === 'tour_cards' && msg.tours && (
                      <div className={`chat-widget chat-tour-cards ${expanded ? 'chat-tour-cards--expanded' : ''}`}>
                        {msg.tours.map(t => (
                          <ChatTourCard key={t.id} tour={t} onSelect={handleTourSelect} expanded={expanded} />
                        ))}
                      </div>
                    )}

                    {msg.widget === 'handoff_prompt' && (
                      <div className="chat-widget chat-handoff-btns">
                        <button className="chat-handoff-btn chat-handoff-btn--yes" onClick={handleHandoffYes}>
                          <Phone size={14} /> Yes — have a specialist call me
                        </button>
                        <button className="chat-handoff-btn chat-handoff-btn--no" onClick={handleHandoffNo}>
                          I'll browse for now
                        </button>
                      </div>
                    )}

                    {msg.widget === 'capture_form' && (
                      <form className="chat-capture-form" onSubmit={handleCaptureSubmit}>
                        <input className="chat-capture-input" placeholder="First name" value={captureFirstName}
                          onChange={e => { setCaptureFirstName(e.target.value); setCaptureError(''); }} />
                        <input className="chat-capture-input" type="email" placeholder="Email address" value={captureEmail}
                          onChange={e => { setCaptureEmail(e.target.value); setCaptureError(''); }} />
                        {captureError && <p className="chat-capture-error">{captureError}</p>}
                        <button type="submit" className="chat-capture-submit">
                          <Mail size={14} /> Send my details
                        </button>
                      </form>
                    )}

                    {msg.widget === 'done_cta' && (
                      <div className="chat-widget chat-done-actions">
                        <Link to="/tours" className="chat-done-cta" onClick={() => { setOpen(false); setExpanded(false); }}>
                          Browse all tours <ArrowRight size={14} />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="chatbot__msg chatbot__msg--bot">
              <div className="chatbot__msg-avatar"><Sparkles size={12} /></div>
              <div className="chatbot__typing"><span /><span /><span /></div>
            </div>
          )}
          <div ref={messagesEndRef} style={{ height: 1 }} />
        </div>

        {/* ── Scroll-to-bottom ── */}
        {showScrollBtn && (
          <button
            className="chatbot__scroll-btn"
            onClick={() => { scrollToBottom(true); setUnreadCount(0); }}
            aria-label="Scroll to latest message"
          >
            <ScrollDown size={16} />
            {unreadCount > 0 && <span className="chatbot__unread">{unreadCount}</span>}
          </button>
        )}

        {/* ── Input ── */}
        <form className="chatbot__input-area" onSubmit={handleFreeText}>
          <input
            ref={inputRef}
            type="text"
            className="chatbot__input"
            placeholder={placeholder}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            disabled={stage === STAGES.DONE}
          />
          <button type="submit" className="chatbot__send" disabled={!inputValue.trim()} aria-label="Send">
            <Send size={15} />
          </button>
        </form>

        <div className="chatbot__footer">
          Cox & Kings Personal Concierge · Est. 1758
          {!expanded && (
            <button className="chatbot__footer-expand" onClick={() => setExpanded(true)}>
              <Maximize2 size={11} /> Expand
            </button>
          )}
        </div>
      </div>
    </>
  );
}
