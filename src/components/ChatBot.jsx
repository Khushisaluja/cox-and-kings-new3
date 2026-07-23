import { useState, useRef, useEffect, useCallback } from 'react';
import {
  X, Send, ChevronDown, Sparkles, Maximize2, Minimize2, RotateCcw,
  ChevronDown as ScrollDown, MessageCircle, Share2, Calendar, PhoneCall, Compass,
} from 'lucide-react';
import './ChatBot.css';

const EMPTY_PROFILE = {
  destination: null, region: null,
  travelStyle: null, travelStyleLabel: null,
  month: null,
  duration: null, durationLabel: null,
  budget: null, budgetLabel: null,
};

const STAGES = {
  WELCOME: 'welcome', DESTINATION: 'destination', TRAVEL_STYLE: 'travel_style',
  MONTH: 'month', DURATION: 'duration', BUDGET: 'budget',
  CURATING: 'curating', ITINERARY: 'itinerary', CALLBACK: 'callback',
  SHARE: 'share', DONE: 'done',
};

const PROGRESS_STAGES = [
  STAGES.DESTINATION, STAGES.TRAVEL_STYLE, STAGES.MONTH,
  STAGES.DURATION, STAGES.BUDGET, STAGES.CURATING,
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

const CALLBACK_DAYS = ['Today', 'Tomorrow', 'This weekend'];
// 2-hour windows, 9am → 9pm. WINDOW_START keeps the 24h start hour for each,
// used to hide slots that have already passed when "Today" is chosen.
const CALLBACK_TIMES = ['9–11 AM', '11 AM–1 PM', '1–3 PM', '3–5 PM', '5–7 PM', '7–9 PM'];
const WINDOW_START   = [9, 11, 13, 15, 17, 19];

// Approx. nights per duration bucket — drives the generated itinerary length.
const DURATION_NIGHTS = { short: 5, ten: 10, fortnight: 14, longer: 21 };

// Build a light, tailored day-by-day outline from the profile. We have no real
// package data, so this is a bespoke skeleton shaped by destination + pace +
// who's travelling — enough to make the plan feel real and specific in-chat.
function buildItinerary(profile) {
  const dest = (profile.destination && profile.destination !== 'Not sure yet')
    ? profile.destination : 'your destination';
  const nights = DURATION_NIGHTS[profile.duration] || 8;
  const days = Math.max(4, nights + 1);

  const styleFlavour = {
    romantic: ['a private candlelit dinner', 'a couples’ spa afternoon', 'a sunset for two'],
    family:   ['a family-friendly hands-on workshop', 'an easy-paced discovery day', 'a treat the kids will love'],
    solo:     ['a small-group local experience', 'time to wander at your own pace', 'a chance to meet fellow travellers'],
    group:    ['a lively group tasting', 'a shared adventure activity', 'an evening out together'],
  }[profile.travelStyle] || ['a signature local experience', 'a relaxed discovery day', 'a memorable evening'];

  const out = [];
  out.push({ day: 'Day 1', title: `Arrive in ${dest}`, desc: 'Private airport welcome, transfer and an unhurried evening to settle in.' });
  // Middle days alternate marquee sights with tailored, style-led experiences.
  for (let d = 2; d < days; d++) {
    if (d % 2 === 0) {
      out.push({ day: `Day ${d}`, title: `Highlights of ${dest}`, desc: `Guided by a local expert — the icons plus the corners most visitors miss.` });
    } else {
      const f = styleFlavour[(d - 3) / 2 % styleFlavour.length | 0] || styleFlavour[0];
      out.push({ day: `Day ${d}`, title: 'A day designed around you', desc: `A slower day with ${f}.` });
    }
  }
  out.push({ day: `Day ${days}`, title: 'Farewell', desc: 'A final morning at leisure before your private departure transfer.' });

  // Keep the in-chat preview digestible — collapse the middle if it's long.
  if (out.length > 6) {
    const head = out.slice(0, 3);
    const tail = out[out.length - 1];
    const hiddenCount = out.length - 4;
    return { days, items: [...head, { day: '···', title: `+ ${hiddenCount} more tailored days`, desc: '', more: true }, tail] };
  }
  return { days, items: out };
}

// ── Stage → input placeholder ─────────────────────────────────────────────────
const STAGE_PLACEHOLDER = {
  [STAGES.WELCOME]:      'Type a destination or question…',
  [STAGES.DESTINATION]:  'Or type a destination…',
  [STAGES.TRAVEL_STYLE]: 'Or describe who\'s travelling…',
  [STAGES.MONTH]:        'Or type a month or season…',
  [STAGES.DURATION]:     'Or tell me how long you have…',
  [STAGES.BUDGET]:       'Or tell me your budget…',
  [STAGES.CURATING]:     'Curating your itinerary…',
  [STAGES.ITINERARY]:    'Ask me anything about your trip…',
  [STAGES.CALLBACK]:     'Ask me anything…',
  [STAGES.SHARE]:        'Ask me anything…',
  [STAGES.DONE]:         'Ask me anything else…',
};

const isValidPhone = (v) => {
  const digits = (v || '').replace(/\D/g, '');
  return digits.length >= 8 && digits.length <= 15;
};

const styleLabel = (p) => p.travelStyleLabel || TRAVEL_STYLES.find(s => s.value === p.travelStyle)?.label;
const durationLabel = (p) => p.durationLabel || DURATIONS.find(d => d.value === p.duration)?.label;
const budgetLabel = (p) => p.budgetLabel || BUDGETS.find(b => b.value === p.budget)?.label;
const destLabel = (p) => (p.destination && p.destination !== 'Not sure yet') ? p.destination : 'your dream trip';
const isFlexibleMonth = (p) => !p.month || /flex/i.test(p.month);
const monthPhrase = (p) => isFlexibleMonth(p) ? 'with flexible dates' : `travelling in ${p.month}`;

// 'Today' slots that have already passed are dropped; other days show all six.
const slotsForDay = (day) => {
  if (day !== 'Today') return CALLBACK_TIMES;
  const hour = new Date().getHours();
  return CALLBACK_TIMES.filter((_, i) => WINDOW_START[i] > hour + 1);
};

function buildBotMessage(stage, profile, extra = {}) {
  switch (stage) {
    case STAGES.WELCOME:
      return {
        text: `Hello! I'm Einaya, your personal Cox & Kings travel designer.\n\nAnswer a few quick questions and I'll craft a **bespoke itinerary** shaped entirely around you — not a generic package. It takes about 2 minutes.\n\n**Where in the world are you dreaming of?**`,
        widget: 'destinations',
      };
    case STAGES.DESTINATION:
      return {
        text: profile.destination === 'Not sure yet'
          ? `No problem at all — that's often where the best journeys begin. Let me help you shape the right fit.\n\n**Who are you travelling with?**`
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
        text: `${isFlexibleMonth(profile) ? 'Flexible dates — perfect, that gives us plenty of options.' : `${profile.month} is a beautiful time to travel. Noted.`}\n\n**How long do you have?**`,
        widget: 'duration',
      };
    case STAGES.DURATION:
      return {
        text: `Perfect. One last question — and it genuinely helps me tailor the right trip.\n\n**What's your rough budget per person?**`,
        widget: 'budget',
      };
    case STAGES.BUDGET:
      return {
        text: `Wonderful — that's everything I need. ✨\n\nI'm now curating a **bespoke ${destLabel(profile)} itinerary** around your dates, pace and budget.\n\nWhile I put the finishing touches together, pop in your **name and mobile number** — I'll save your itinerary and text you a copy so it's never lost.`,
        widget: 'curate_form',
      };
    case STAGES.ITINERARY: {
      const bits = [
        durationLabel(profile) && durationLabel(profile).toLowerCase(),
        `across ${destLabel(profile)}`,
        styleLabel(profile) && `tuned to ${styleLabel(profile).toLowerCase()}`,
        monthPhrase(profile),
      ].filter(Boolean).join(', ');
      return {
        text: `Your bespoke **${destLabel(profile)} itinerary** is ready, **${extra.firstName || 'traveller'}**! 🎉\n\nI've shaped ${bits}${budgetLabel(profile) ? `, within your **${budgetLabel(profile)}** budget` : ''}. Here's the outline:`,
        widget: 'itinerary_preview',
        itinerary: buildItinerary(profile),
      };
    }
    case STAGES.CALLBACK:
      return {
        text: `Lovely — a callback it is. **Which day** suits you best for our ${destLabel(profile)} expert to call?`,
        widget: 'callback_days',
      };
    default:
      return { text: 'How can I help you further?', widget: null };
  }
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ChatBot({ open: openProp, onOpenChange, hideFab = false, openExpanded, name = 'Einaya' } = {}) {
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
  const [captureFirstName, setCaptureFirstName]   = useState('');
  const [capturePhone, setCapturePhone]           = useState('');
  const [captureError, setCaptureError]           = useState('');
  const [friendName, setFriendName]   = useState('');
  const [friendPhone, setFriendPhone] = useState('');
  const [shareError, setShareError]   = useState('');
  const [callbackDay, setCallbackDay] = useState('');
  const [customPrompt, setCustomPrompt] = useState(''); // set when "Other" focuses the input
  const [isTyping, setIsTyping]       = useState(false);
  const [typingLabel, setTypingLabel] = useState('');
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
  function pushBotMessage(msg, delay = 860, label = '') {
    setIsTyping(true);
    setTypingLabel(label);
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now(), role: 'bot', time: new Date(), ...msg }]);
      setIsTyping(false);
      setTypingLabel('');
    }, delay);
  }

  function pushUserMessage(text) {
    setCustomPrompt(''); // any answer clears a pending "Other" hint
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', text, time: new Date() }]);
    scrollToBottom(true);
  }

  // ── Selection cores (shared by preset chips and free-typed "Other" answers) ──
  function applyDestination(label, region) {
    const p = { ...profile, destination: label, region: region ?? null };
    setProfile(p); setStage(STAGES.DESTINATION);
    pushBotMessage(buildBotMessage(STAGES.DESTINATION, p));
  }
  function applyTravelStyle(value, label) {
    const p = { ...profile, travelStyle: value, travelStyleLabel: label };
    setProfile(p); setStage(STAGES.MONTH);
    pushBotMessage(buildBotMessage(STAGES.TRAVEL_STYLE, p));
  }
  function applyMonth(month) {
    const p = { ...profile, month };
    setProfile(p); setStage(STAGES.DURATION);
    pushBotMessage(buildBotMessage(STAGES.MONTH, p));
  }
  function applyDuration(value, label) {
    const p = { ...profile, duration: value, durationLabel: label };
    setProfile(p); setStage(STAGES.BUDGET);
    pushBotMessage(buildBotMessage(STAGES.DURATION, p));
  }
  function applyBudget(value, label) {
    const p = { ...profile, budget: value, budgetLabel: label };
    setProfile(p); setStage(STAGES.CURATING);
    pushBotMessage(buildBotMessage(STAGES.BUDGET, p), 900);
  }

  // ── Preset chip handlers ─────────────────────────────────────────────────────
  function handleDestinationSelect(dest) { pushUserMessage(dest.label); applyDestination(dest.label, dest.region); }
  function handleTravelStyleSelect(s)    { pushUserMessage(`${s.emoji} ${s.label}`); applyTravelStyle(s.value, s.label); }
  function handleMonthSelect(month)      { pushUserMessage(month); applyMonth(month); }
  function handleDurationSelect(d)       { pushUserMessage(`${d.emoji} ${d.label}`); applyDuration(d.value, d.label); }
  function handleBudgetSelect(b)         { pushUserMessage(`${b.emoji} ${b.label}`); applyBudget(b.value, b.label); }
  function handleBudgetSkip()            { pushUserMessage('Prefer not to say'); applyBudget(null, null); }

  // "Other" — focus the text input and hint what to type for the current step.
  function handleOther(hint) {
    setCustomPrompt(hint);
    setTimeout(() => inputRef.current?.focus(), 40);
  }

  // ── Lead capture — name + phone, collected while the itinerary "curates" ─────
  function handleCurateSubmit(e) {
    e.preventDefault();
    if (!captureFirstName.trim()) { setCaptureError('Please enter your name'); return; }
    if (!isValidPhone(capturePhone)) { setCaptureError('Please enter a valid mobile number'); return; }
    setCaptureError('');
    pushUserMessage(`${captureFirstName} · ${capturePhone}`);
    setStage(STAGES.ITINERARY);
    // The longer delay + label doubles as the "preparing your itinerary" moment.
    pushBotMessage(
      buildBotMessage(STAGES.ITINERARY, profile, { firstName: captureFirstName }),
      2400,
      'Curating your bespoke itinerary…',
    );
  }

  // ── Itinerary actions ────────────────────────────────────────────────────────
  function handleChatExpert() {
    pushUserMessage('Chat to an expert now');
    pushBotMessage({
      text: `Connecting you now, **${captureFirstName || 'there'}**. A Cox & Kings ${destLabel(profile)} expert will join this chat shortly — they've personally travelled the routes on your itinerary.\n\nTravelling with someone? Share your itinerary and I'll send them a copy too.`,
      widget: 'share_prompt',
    });
  }

  function handleScheduleCallback() {
    pushUserMessage('Schedule a free callback');
    setStage(STAGES.CALLBACK);
    pushBotMessage(buildBotMessage(STAGES.CALLBACK, profile));
  }

  function handleCallbackDay(day) {
    pushUserMessage(day);
    const times = slotsForDay(day);
    // Edge case: it's already too late for any slot today — roll to tomorrow.
    if (day === 'Today' && times.length === 0) {
      setCallbackDay('Tomorrow');
      pushBotMessage({
        text: `It's a little late for a callback today — let's find you a slot **tomorrow** instead. What time works best?`,
        widget: 'callback_times', times: CALLBACK_TIMES,
      });
      return;
    }
    setCallbackDay(day);
    pushBotMessage({
      text: `Great — what time works best **${day.toLowerCase()}**? Each slot is a 2-hour window.`,
      widget: 'callback_times', times,
    });
  }

  function handleCallbackTime(time) {
    pushUserMessage(time);
    const when = /weekend/i.test(callbackDay) ? 'this weekend' : (callbackDay || 'tomorrow').toLowerCase();
    pushBotMessage({
      text: `Perfect — our ${destLabel(profile)} expert will call you **${when}, ${time}** on **${capturePhone}**. It's completely free and there's no obligation.\n\nWhile you wait — travelling with someone? Share your itinerary and I'll send them a copy too.`,
      widget: 'share_prompt',
    });
  }

  // ── Share — collects a second lead (a travel companion) ─────────────────────
  function handleShareStart() {
    pushUserMessage('Share with a friend');
    setStage(STAGES.SHARE);
    pushBotMessage({
      text: `Lovely — who shall I send it to? Pop in their **name and mobile number** and I'll share your ${destLabel(profile)} itinerary with them.`,
      widget: 'share_form',
    });
  }

  function handleShareSubmit(e) {
    e.preventDefault();
    if (!friendName.trim()) { setShareError('Please enter their name'); return; }
    if (!isValidPhone(friendPhone)) { setShareError('Please enter a valid mobile number'); return; }
    setShareError('');
    pushUserMessage(`${friendName} · ${friendPhone}`);
    setStage(STAGES.DONE);
    pushBotMessage({
      text: `Done! I've shared your ${destLabel(profile)} itinerary with **${friendName}**. 🎉\n\nThank you, **${captureFirstName || 'traveller'}** — you're all set, and our team will be in touch very soon.\n\n**Is there anything else I can help you with today?**`,
      widget: 'done_actions',
    });
  }

  function handleRestart() {
    setMessages([]);
    setStage(STAGES.WELCOME);
    setProfile(EMPTY_PROFILE);
    setCaptureFirstName(''); setCapturePhone(''); setCaptureError('');
    setFriendName(''); setFriendPhone(''); setShareError('');
    setCallbackDay(''); setCustomPrompt('');
    setUnreadCount(0);
    pushBotMessage(buildBotMessage(STAGES.WELCOME, EMPTY_PROFILE), 400);
  }

  function handleFreeText(e) {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text) return;
    setInputValue('');
    setCustomPrompt('');
    const lower = text.toLowerCase();

    // ── Question flow: a typed answer IS the answer to the current step, so the
    //    user is never trapped by the preset chips (this is the "Other" path). ──
    // NB: `stage` holds the value set by the PREVIOUS answer, so while each
    //     question's widget is on screen the stage is the one below.
    if (stage === STAGES.WELCOME)     { pushUserMessage(text); applyDestination(text, null); return; }   // destination
    if (stage === STAGES.DESTINATION) { pushUserMessage(text); applyTravelStyle('custom', text); return; } // who's travelling
    if (stage === STAGES.MONTH)       { pushUserMessage(text); applyMonth(text); return; }                // when
    if (stage === STAGES.DURATION)    { pushUserMessage(text); applyDuration('custom', text); return; }    // how long
    if (stage === STAGES.BUDGET)      { pushUserMessage(text); applyBudget('custom', text); return; }      // budget

    pushUserMessage(text);

    // ── Curating (name+phone still needed): steer them to the quick form. ──
    if (stage === STAGES.CURATING) {
      pushBotMessage({
        text: `Almost there! Pop your **name and mobile number** in the boxes above and I'll have your itinerary ready in seconds.`,
        widget: null,
      }, 600);
      return;
    }

    // ── Post-itinerary: honour typed intent, else re-offer the three actions. ──
    const POST = [STAGES.ITINERARY, STAGES.CALLBACK, STAGES.SHARE, STAGES.DONE];
    if (POST.includes(stage) && (lower.includes('call') || lower.includes('callback') || lower.includes('phone'))) {
      handleScheduleCallback();
      return;
    }
    if (POST.includes(stage) && lower.includes('share')) {
      handleShareStart();
      return;
    }
    if (POST.includes(stage) && (lower.includes('expert') || lower.includes('agent') || lower.includes('human') || lower.includes('speak'))) {
      handleChatExpert();
      return;
    }
    // Want to plan another trip.
    if (POST.includes(stage) && (lower.includes('another') || lower.includes('new trip') || lower.includes('start over') || lower.includes('restart'))) {
      handleRestart();
      return;
    }
    if (stage === STAGES.ITINERARY) {
      pushBotMessage({
        text: `Good question — our expert can talk you through every detail of that. How would you like to take your itinerary forward?`,
        widget: 'itinerary_actions',
      }, 700);
      return;
    }
    // Done / share follow-ups — Einaya stays available and keeps offering to help.
    pushBotMessage({
      text: `I've noted that and passed it to our team. Anything else I can help you with — a callback, a chat with an expert, or planning another trip?`,
      widget: 'done_actions',
    }, 700);
  }

  // ── Progress ─────────────────────────────────────────────────────────────────
  const progressIdx = PROGRESS_STAGES.indexOf(stage);
  const progressPct = progressIdx < 0
    ? ([STAGES.ITINERARY, STAGES.CALLBACK, STAGES.SHARE, STAGES.DONE].includes(stage) ? 100 : 0)
    : Math.round((progressIdx / (PROGRESS_STAGES.length - 1)) * 100);

  const placeholder = customPrompt || STAGE_PLACEHOLDER[stage] || 'Type anything…';

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
          aria-label={open ? 'Close Einaya' : 'Plan your trip with Einaya'}
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
        aria-label={`${name} — Cox & Kings Travel Designer`}
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
              {stage === STAGES.DONE ? 'Itinerary shared — we\'ll be in touch' : 'Designing your journey'}
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
              {stage === STAGES.CURATING
                ? 'Finalising your itinerary…'
                : progressPct < 100
                  ? `Step ${progressIdx + 1} of ${PROGRESS_STAGES.length - 1} — building your trip profile`
                  : '✓ Your bespoke itinerary is ready'}
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
                        <button className="chat-dest-chip" onClick={() => handleOther('Type your destination and press send…')}>
                          <div className="chat-dest-chip__img chat-dest-chip__img--blank">✍️</div>
                          <span className="chat-dest-chip__label">Somewhere else</span>
                        </button>
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
                        <button className="chat-option-card chat-option-card--other" onClick={() => handleOther('Tell me who’s travelling…')}>
                          <span className="chat-option-card__emoji">✍️</span>
                          <span className="chat-option-card__label">Someone else</span>
                          <span className="chat-option-card__sub">Type your own</span>
                        </button>
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
                        <div className="chat-months__row">
                          <button className="chat-month-chip chat-month-chip--wide" onClick={() => handleMonthSelect('Flexible')}>
                            My dates are flexible
                          </button>
                        </div>
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
                        <button className="chat-option-card chat-option-card--other" onClick={() => handleOther('e.g. “about 12 days”…')}>
                          <span className="chat-option-card__emoji">✍️</span>
                          <span className="chat-option-card__label">Something else</span>
                          <span className="chat-option-card__sub">Type your own</span>
                        </button>
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
                        <button className="chat-option-card chat-option-card--other" onClick={handleBudgetSkip}>
                          <span className="chat-option-card__emoji">🙊</span>
                          <span className="chat-option-card__label">Prefer not to say</span>
                          <span className="chat-option-card__sub">Skip this step</span>
                        </button>
                      </div>
                    )}

                    {/* Lead capture — shown while the itinerary "prepares" */}
                    {msg.widget === 'curate_form' && (
                      <div className="chat-widget">
                        <div className="chat-curate-loader">
                          <div className="chat-curate-loader__bar"><span /></div>
                          <span className="chat-curate-loader__label">
                            <Sparkles size={12} /> Preparing your itinerary…
                          </span>
                        </div>
                        <form className="chat-capture-form" onSubmit={handleCurateSubmit}>
                          <input className="chat-capture-input" placeholder="Your name" value={captureFirstName}
                            onChange={e => { setCaptureFirstName(e.target.value); setCaptureError(''); }} />
                          <input className="chat-capture-input" type="tel" inputMode="tel" placeholder="Mobile number" value={capturePhone}
                            onChange={e => { setCapturePhone(e.target.value); setCaptureError(''); }} />
                          {captureError && <p className="chat-capture-error">{captureError}</p>}
                          <button type="submit" className="chat-capture-submit">
                            <Sparkles size={14} /> Save my itinerary
                          </button>
                        </form>
                        <p className="chat-capture-note">We'll only use this to send your itinerary and help plan your trip.</p>
                      </div>
                    )}

                    {/* Itinerary preview — the generated day-by-day outline… */}
                    {msg.widget === 'itinerary_preview' && msg.itinerary && (
                      <div className="chat-widget chat-itinerary">
                        <div className="chat-itinerary__head">
                          <span className="chat-itinerary__badge">Bespoke · {msg.itinerary.days} days</span>
                        </div>
                        <ol className="chat-itinerary__days">
                          {msg.itinerary.items.map((it, di) => (
                            <li key={di} className={`chat-itinerary__day ${it.more ? 'chat-itinerary__day--more' : ''}`}>
                              <span className="chat-itinerary__daynum">{it.day}</span>
                              <span className="chat-itinerary__daybody">
                                <strong className="chat-itinerary__title">{it.title}</strong>
                                {it.desc && <span className="chat-itinerary__desc">{it.desc}</span>}
                              </span>
                            </li>
                          ))}
                        </ol>
                        <p className="chat-itinerary__note">A draft outline — your expert will tailor every day with you. How would you like to take it forward?</p>
                        <div className="chat-action-list">
                          <button className="chat-action-btn chat-action-btn--primary" onClick={handleChatExpert}>
                            <MessageCircle size={16} /> Chat to an expert now
                          </button>
                          <button className="chat-action-btn" onClick={handleScheduleCallback}>
                            <Calendar size={16} /> Schedule a free callback
                          </button>
                          <button className="chat-action-btn" onClick={handleShareStart}>
                            <Share2 size={16} /> Share with a friend
                          </button>
                          <button className="chat-newtrip-btn" onClick={handleRestart}>
                            <Compass size={14} /> Explore another destination
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Itinerary actions (re-offered if the user free-types) */}
                    {msg.widget === 'itinerary_actions' && (
                      <div className="chat-widget chat-action-list">
                        <button className="chat-action-btn chat-action-btn--primary" onClick={handleChatExpert}>
                          <MessageCircle size={16} /> Chat to an expert now
                        </button>
                        <button className="chat-action-btn" onClick={handleScheduleCallback}>
                          <Calendar size={16} /> Schedule a free callback
                        </button>
                        <button className="chat-action-btn" onClick={handleShareStart}>
                          <Share2 size={16} /> Share with a friend
                        </button>
                        <button className="chat-newtrip-btn" onClick={handleRestart}>
                          <Compass size={14} /> Explore another destination
                        </button>
                      </div>
                    )}

                    {/* Done — keep Einaya open; lead with a new destination search */}
                    {msg.widget === 'done_actions' && (
                      <div className="chat-widget chat-action-list">
                        <button className="chat-action-btn chat-action-btn--primary" onClick={handleRestart}>
                          <Compass size={16} /> Plan another trip
                        </button>
                        <button className="chat-action-btn" onClick={handleChatExpert}>
                          <MessageCircle size={16} /> Chat to an expert
                        </button>
                        <button className="chat-action-btn" onClick={handleScheduleCallback}>
                          <Calendar size={16} /> Schedule a free callback
                        </button>
                      </div>
                    )}

                    {/* Callback — step 1: pick a day */}
                    {msg.widget === 'callback_days' && (
                      <div className="chat-widget chat-action-list">
                        {CALLBACK_DAYS.map(day => (
                          <button key={day} className="chat-action-btn" onClick={() => handleCallbackDay(day)}>
                            <Calendar size={15} /> {day}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Callback — step 2: pick a 2-hour window */}
                    {msg.widget === 'callback_times' && (
                      <div className="chat-widget chat-slot-grid">
                        {(msg.times || CALLBACK_TIMES).map(time => (
                          <button key={time} className="chat-slot-chip" onClick={() => handleCallbackTime(time)}>
                            <PhoneCall size={13} /> {time}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Share prompt (single button, offered after expert / callback) */}
                    {msg.widget === 'share_prompt' && (
                      <div className="chat-widget chat-action-list">
                        <button className="chat-action-btn chat-action-btn--primary" onClick={handleShareStart}>
                          <Share2 size={16} /> Share my itinerary with a friend
                        </button>
                      </div>
                    )}

                    {/* Share form — second lead */}
                    {msg.widget === 'share_form' && (
                      <form className="chat-capture-form" onSubmit={handleShareSubmit}>
                        <input className="chat-capture-input" placeholder="Friend's name" value={friendName}
                          onChange={e => { setFriendName(e.target.value); setShareError(''); }} />
                        <input className="chat-capture-input" type="tel" inputMode="tel" placeholder="Friend's mobile number" value={friendPhone}
                          onChange={e => { setFriendPhone(e.target.value); setShareError(''); }} />
                        {shareError && <p className="chat-capture-error">{shareError}</p>}
                        <button type="submit" className="chat-capture-submit">
                          <Share2 size={14} /> Share itinerary
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="chatbot__msg chatbot__msg--bot">
              <div className="chatbot__msg-avatar"><Sparkles size={12} /></div>
              <div className="chatbot__typing-wrap">
                <div className="chatbot__typing"><span /><span /><span /></div>
                {typingLabel && <span className="chatbot__typing-label">{typingLabel}</span>}
              </div>
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
          />
          <button type="submit" className="chatbot__send" disabled={!inputValue.trim()} aria-label="Send">
            <Send size={15} />
          </button>
        </form>

        <div className="chatbot__footer">
          Cox & Kings Personal Travel Designer · Est. 1758
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
