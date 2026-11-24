/* ============================================================================
   Search dock: the /new3-marketing replacement for the glass hero search.

   Why it changed: the old search sat ON the hero photo as frosted glass. With
   the hero now a rotating set of campaign banners, glass over three different
   photos reads differently on each one, and it competes with the banner's own
   CTA. So the search leaves the photo and becomes a solid card that docks over
   the hero's bottom edge: always legible, always in the same place, and
   visibly a separate tool from the offer above it.

   What it adds for the campaigns:
   · "Where to?" is a real combobox (arrow keys, Enter, Escape). Typing or
     opening it puts the three live offers first, each with its from-price.
   · "When?" is a month grid instead of a day calendar (group tours depart on
     fixed dates, so the month is the real decision). Months with a live offer
     departure carry that campaign's colour dot.
   · The button says where it is going: "See the offer" when the search lands
     on a campaign page, "Search" otherwise, and a status line spells it out.

   Routing reuses New3's exported helpers so the non-campaign path lands on
   exactly the URLs the /new3 search builds.
   ========================================================================== */

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, Search, ArrowRight, Sparkles, Check } from 'lucide-react';
import { HERO_WHO_OPTS, JOURNEYS_PATH, COMING_SOON_PATH, destPage } from '../New3';
import { CAMPAIGNS, campaignFor, inr } from './campaigns';

const POPULAR = [
  'Kyoto, Japan', 'Paris, France', 'Ha Long Bay, Vietnam', 'Rajasthan, India',
  'The Maldives', 'Bali, Indonesia', 'Swiss Alps', 'African Safari',
];
const ANY_DEST = 'Anywhere';
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MON_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const ym = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
const monthLabel = (key, long = false) => {
  const [y, m] = key.split('-').map(Number);
  return `${(long ? MON_LONG : MON)[m - 1]} ${y}`;
};

export default function SearchDock() {
  const navigate = useNavigate();
  const uid = useId().replace(/:/g, '');
  const rootRef = useRef(null);
  const inputRef = useRef(null);

  const [open, setOpen] = useState(null);       // 'where' | 'when' | 'who' | null
  const [dest, setDest] = useState('');
  const [active, setActive] = useState(-1);     // combobox highlighted option
  const [month, setMonth] = useState(null);     // 'YYYY-MM' | 'any' | null
  const [who, setWho] = useState(null);         // a HERO_WHO_OPTS entry | 'any' | null

  /* 12 months from this one. */
  const months = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 12 }, (_, i) => ym(new Date(now.getFullYear(), now.getMonth() + i, 1)));
  }, []);

  /* Combobox options: offers first, then places, then "Anywhere". */
  const options = useMemo(() => {
    const q = dest.trim().toLowerCase();
    const offers = CAMPAIGNS
      .filter((c) => !q || c.match.test(q) || c.season.toLowerCase().includes(q) || c.word.toLowerCase().includes(q))
      .map((c) => ({ type: 'offer', c, value: c.title.join(' ').replace(/,/, '') , label: c.title.join(' ') }));
    const places = POPULAR
      .filter((p) => !q || p.toLowerCase().includes(q))
      .map((p) => ({ type: 'place', value: p, label: p }));
    return [...offers, ...places, { type: 'any', value: ANY_DEST, label: 'Anywhere · show me everything' }];
  }, [dest]);

  /* Close on outside click / Escape. */
  useEffect(() => {
    if (!open) return undefined;
    const down = (e) => { if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(null); };
    const key = (e) => { if (e.key === 'Escape') { setOpen(null); } };
    document.addEventListener('pointerdown', down);
    document.addEventListener('keydown', key);
    return () => { document.removeEventListener('pointerdown', down); document.removeEventListener('keydown', key); };
  }, [open]);

  const pickOption = (o) => {
    setDest(o.type === 'offer' ? o.c.word === 'VIỆT NAM' ? 'Vietnam' : o.c.word[0] + o.c.word.slice(1).toLowerCase() : o.value);
    setActive(-1);
    setOpen(null);
  };

  const onComboKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen('where'); setActive((i) => Math.min(i + 1, options.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter' && open === 'where' && active >= 0) { e.preventDefault(); pickOption(options[active]); }
  };

  /* ---------- Where does this search land? ---------- */
  const campaign = campaignFor(dest);
  const monthKey = month && month !== 'any' ? month : null;
  const toCampaign = !!campaign && (!monthKey || campaign.months.includes(monthKey));

  const href = useMemo(() => {
    const whoOpt = who && who !== 'any' ? who : null;
    if (toCampaign) return campaign.to;
    const when = monthKey ? `${monthKey}-15` : null;
    const d = dest.trim();
    if (d && d !== ANY_DEST) {
      const qs = new URLSearchParams();
      if (whoOpt?.key) qs.set('who', whoOpt.key);
      if (when) qs.set('when', when);
      const page = destPage(d);
      if (page) return qs.toString() ? `${page}?${qs}` : page;
      return `${COMING_SOON_PATH}?${new URLSearchParams({ dest: d })}`;
    }
    const qs = new URLSearchParams();
    if (whoOpt?.style) qs.set('style', whoOpt.style);
    if (whoOpt?.pace) qs.set('pace', whoOpt.pace);
    if (when) qs.set('when', when);
    return qs.toString() ? `${JOURNEYS_PATH}?${qs}` : JOURNEYS_PATH;
  }, [toCampaign, campaign, monthKey, dest, who]);

  /* One line that says what pressing the button will do. */
  const status = (() => {
    if (toCampaign) {
      const live = monthKey ? `${monthLabel(monthKey, true)} departures are open` : `${campaign.months.length} departure months open`;
      return { offer: campaign, text: `${campaign.season}: ${live}, from ${inr(campaign.from)} per person.` };
    }
    if (campaign && monthKey) {
      return { text: `No ${campaign.season.toLowerCase()} departure in ${monthLabel(monthKey, true)}. Offer months: ${campaign.months.map((m) => monthLabel(m)).join(', ')}.` };
    }
    return null;
  })();

  const whenLabel = month === 'any' ? 'Any time' : month ? monthLabel(month, true) : '';
  const whoLabel = who === 'any' ? 'Anyone' : who?.label || '';

  const submit = (e) => { e.preventDefault(); setOpen(null); navigate(href); };

  const listId = `${uid}-where`;
  const optId = (i) => `${uid}-opt-${i}`;

  return (
    <div className="n3m-dock" ref={rootRef}>
      <form className="n3m-dock__form" role="search" aria-label="Find a journey" onSubmit={submit}>
        {/* WHERE */}
        <div className={`n3m-field n3m-field--where${open === 'where' ? ' is-open' : ''}`}>
          <label className="n3m-field__label" htmlFor={`${uid}-in`}><MapPin size={14} aria-hidden="true" /> Where to</label>
          <input
            id={`${uid}-in`}
            ref={inputRef}
            className="n3m-field__input"
            type="text"
            autoComplete="off"
            placeholder="Search a country, city or offer"
            role="combobox"
            aria-expanded={open === 'where'}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={open === 'where' && active >= 0 ? optId(active) : undefined}
            value={dest}
            onFocus={() => setOpen('where')}
            onClick={() => setOpen('where')}
            onChange={(e) => { setDest(e.target.value); setOpen('where'); setActive(-1); }}
            onKeyDown={onComboKey}
          />
          {campaign && <span className="n3m-field__flag" style={{ '--acc': campaign.accent }}>Offer</span>}
          {open === 'where' && (
            <div className="n3m-pop n3m-pop--where">
              <ul id={listId} role="listbox" aria-label="Destinations and offers" className="n3m-opts">
                {options.map((o, i) => {
                  const first = i === 0 || options[i - 1].type !== o.type;
                  return (
                    <li key={o.value} role="presentation">
                      {first && o.type !== 'any' && (
                        <span className="n3m-opts__head" aria-hidden="true">{o.type === 'offer' ? 'On offer this season' : 'Popular destinations'}</span>
                      )}
                      <div
                        id={optId(i)}
                        role="option"
                        aria-selected={i === active}
                        className={`n3m-opt n3m-opt--${o.type}${i === active ? ' is-active' : ''}`}
                        onPointerDown={(e) => e.preventDefault()}
                        onClick={() => pickOption(o)}
                        onMouseEnter={() => setActive(i)}
                      >
                        {o.type === 'offer' ? (
                          <>
                            <span className="n3m-opt__thumb" style={{ backgroundImage: `url(${o.c.thumb})` }} aria-hidden="true" />
                            <span className="n3m-opt__body">
                              <b>{o.label}</b>
                              <small>{o.c.season} · {o.c.kind}</small>
                            </span>
                            <span className="n3m-opt__price" style={{ '--acc': o.c.accent }}>from {inr(o.c.from)}</span>
                          </>
                        ) : o.type === 'any' ? (
                          <><Sparkles size={16} aria-hidden="true" /><span>{o.label}</span></>
                        ) : (
                          <><MapPin size={16} aria-hidden="true" /><span>{o.label}</span></>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        {/* WHEN */}
        <div className={`n3m-field n3m-field--when${open === 'when' ? ' is-open' : ''}`}>
          <span className="n3m-field__label" id={`${uid}-when-l`}><Calendar size={14} aria-hidden="true" /> When</span>
          <button
            type="button"
            className="n3m-field__btn"
            aria-haspopup="dialog"
            aria-expanded={open === 'when'}
            aria-labelledby={`${uid}-when-l ${uid}-when-v`}
            onClick={() => setOpen(open === 'when' ? null : 'when')}
          >
            <span id={`${uid}-when-v`} className={whenLabel ? '' : 'is-ph'}>{whenLabel || 'Pick a month'}</span>
          </button>
          {open === 'when' && (
            <div className="n3m-pop n3m-pop--when" role="dialog" aria-label="Choose a travel month">
              <div className="n3m-months">
                {months.map((m) => {
                  const offers = CAMPAIGNS.filter((c) => c.months.includes(m));
                  const [y, mm] = m.split('-').map(Number);
                  return (
                    <button
                      key={m}
                      type="button"
                      className={`n3m-month${month === m ? ' is-on' : ''}`}
                      aria-pressed={month === m}
                      aria-label={`${MON_LONG[mm - 1]} ${y}${offers.length ? `, offer departures: ${offers.map((c) => c.word === 'VIỆT NAM' ? 'Vietnam' : c.word.toLowerCase()).join(', ')}` : ''}`}
                      onClick={() => { setMonth(m); setOpen(null); }}
                    >
                      <span className="n3m-month__m">{MON[mm - 1]}</span>
                      <span className="n3m-month__y">{y}</span>
                      {offers.length > 0 && (
                        <span className="n3m-month__dots" aria-hidden="true">
                          {offers.map((c) => <i key={c.key} style={{ background: c.accent }} />)}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="n3m-months__foot">
                <span className="n3m-legend" aria-hidden="true">
                  {CAMPAIGNS.map((c) => <span key={c.key}><i style={{ background: c.accent }} />{c.word === 'VIỆT NAM' ? 'Vietnam' : c.word[0] + c.word.slice(1).toLowerCase()}</span>)}
                </span>
                <button type="button" className={`n3m-anytime${month === 'any' ? ' is-on' : ''}`} onClick={() => { setMonth('any'); setOpen(null); }}>
                  <Sparkles size={14} aria-hidden="true" /> Any time
                </button>
              </div>
            </div>
          )}
        </div>

        {/* WHO */}
        <div className={`n3m-field n3m-field--who${open === 'who' ? ' is-open' : ''}`}>
          <span className="n3m-field__label" id={`${uid}-who-l`}><Users size={14} aria-hidden="true" /> Who</span>
          <button
            type="button"
            className="n3m-field__btn"
            aria-haspopup="listbox"
            aria-expanded={open === 'who'}
            aria-labelledby={`${uid}-who-l ${uid}-who-v`}
            onClick={() => setOpen(open === 'who' ? null : 'who')}
          >
            <span id={`${uid}-who-v`} className={whoLabel ? '' : 'is-ph'}>{whoLabel || 'Add travellers'}</span>
          </button>
          {open === 'who' && (
            <div className="n3m-pop n3m-pop--who">
              <ul role="listbox" aria-label="Who's travelling" className="n3m-opts">
                {[...HERO_WHO_OPTS, 'any'].map((o) => {
                  const on = o === 'any' ? who === 'any' : who?.key === o.key;
                  return (
                    <li key={o === 'any' ? 'any' : o.key} role="presentation">
                      <button
                        type="button"
                        role="option"
                        aria-selected={on}
                        className={`n3m-opt${on ? ' is-on' : ''}`}
                        onClick={() => { setWho(o); setOpen(null); }}
                      >
                        {o === 'any' ? <Sparkles size={16} aria-hidden="true" /> : <Users size={16} aria-hidden="true" />}
                        <span>{o === 'any' ? 'Anyone · show me everything' : o.label.replace(' — ', ': ')}</span>
                        {on && <Check size={15} className="n3m-opt__tick" aria-hidden="true" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        <button type="submit" className={`n3m-go${toCampaign ? ' is-offer' : ''}`} >
          {toCampaign ? <ArrowRight size={18} aria-hidden="true" /> : <Search size={18} aria-hidden="true" />}
          <span>{toCampaign ? 'See the offer' : 'Search'}</span>
        </button>
      </form>

      <div className="n3m-dock__foot">
        <p className="n3m-dock__status" aria-live="polite">
          {status ? (
            <>{status.offer && <i style={{ background: status.offer.accent }} aria-hidden="true" />}{status.text}</>
          ) : (
            <>Group departures, private journeys and everything between. Since 1758.</>
          )}
        </p>
        <nav className="n3m-dock__chips" aria-label="Offers this season">
          <span className="n3m-dock__chipslbl">This season</span>
          {CAMPAIGNS.map((c) => (
            <a key={c.key} href={c.to} className="n3m-chip" style={{ '--acc': c.accent }}
              onClick={(e) => { e.preventDefault(); navigate(c.to); }}>
              <i aria-hidden="true" />{c.title[0].replace(',', '')}<span>{c.season.replace(/ 2027$/, '')}</span>
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
