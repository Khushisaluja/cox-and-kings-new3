/* ============================================================================
   Cox & Kings — TERMS & CONDITIONS  (routes: /terms, /info/terms-condition)

   A minimal redesign of the live legal page — a flat wall of 32 headings with
   no way to orient or search. Same legal text (src/data/terms.js); the only
   additions are the three things that make a long reference page usable:

     - a sticky left contents list (skim + jump), with the reading position
       tracked as you scroll,
     - a search box that filters the list and the body and highlights hits,
     - readable, well-measured body copy.

   Everything is built on the shared site chrome and the .n3 design tokens
   (design.md), so type, colour and spacing match every other page: Cormorant
   Garamond heads at weight 500, Work Sans body at 400, warm-paper neutrals,
   Voyager-Blue links, Sienna eyebrows. No page-specific colours or effects.
   ========================================================================== */

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { Search, X, ArrowUp, ListTree } from 'lucide-react';
import { SiteNav, SiteFooter } from '../components/SiteChrome';
import { TERMS, GROUP_ORDER, TERMS_META, TERMS_INTRO, sectionText } from '../data/terms';
import './Terms.css';

/* Precompute each section's lowercased searchable text once. */
const SEARCH_INDEX = TERMS.map((s) => ({ id: s.id, text: sectionText(s) }));

/* Sections bucketed under their group, preserving TERMS order. */
const GROUPED = GROUP_ORDER.map((g) => ({
  ...g,
  sections: TERMS.filter((s) => s.group === g.key),
})).filter((g) => g.sections.length);

/* Honour "reduce motion" for the JS-driven scrolls (CSS can't reach them). */
const scrollBehavior = () =>
  (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth');

/* Wrap search hits in <mark>; case-insensitive, regex-safe. */
function Highlight({ text, query }) {
  if (!query) return text;
  const safe = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${safe})`, 'ig'));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase()
      ? <mark className="tc-hit" key={i}>{part}</mark>
      : part,
  );
}

/* One typed content block → markup. */
function Block({ block, query }) {
  const { k } = block;
  if (k === 'p') return <p className="tc-p"><Highlight text={block.v} query={query} /></p>;
  if (k === 'h') return <h3 className="tc-subhead"><Highlight text={block.v} query={query} /></h3>;
  if (k === 'ul') {
    return (
      <ul className="tc-list">
        {block.v.map((it, i) => <li key={i}><Highlight text={it} query={query} /></li>)}
      </ul>
    );
  }
  if (k === 'ol') {
    return (
      <ol className="tc-list tc-list--num">
        {block.v.map((it, i) => <li key={i}><Highlight text={it} query={query} /></li>)}
      </ol>
    );
  }
  if (k === 'table') {
    return (
      <div className="tc-table-wrap" role="region" tabIndex={0} aria-label="Rate table">
        <table className="tc-table">
          <thead>
            <tr>{block.head.map((h, i) => <th key={i}><Highlight text={h} query={query} /></th>)}</tr>
          </thead>
          <tbody>
            {block.rows.map((r, ri) => (
              <tr key={ri}>{r.map((c, ci) => <td key={ci}><Highlight text={c} query={query} /></td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  if (k === 'note') {
    return (
      <div className="tc-note">
        {block.title && <p className="tc-note-title"><Highlight text={block.title} query={query} /></p>}
        {block.v && <p className="tc-p"><Highlight text={block.v} query={query} /></p>}
        {block.items && (
          <ul className="tc-list">
            {block.items.map((it, i) => <li key={i}><Highlight text={it} query={query} /></li>)}
          </ul>
        )}
      </div>
    );
  }
  return null;
}

export default function Terms() {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(TERMS[0]?.id);
  const [showTop, setShowTop] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);        // mobile contents drawer
  const searchRef = useRef(null);
  const panelRef = useRef(null);
  const railRef = useRef(null);
  const contentRef = useRef(null);

  const q = query.trim().toLowerCase();

  const matches = useMemo(() => {
    if (!q) return null;
    return new Set(SEARCH_INDEX.filter((s) => s.text.includes(q)).map((s) => s.id));
  }, [q]);

  const visibleSections = useMemo(
    () => (matches ? TERMS.filter((s) => matches.has(s.id)) : TERMS),
    [matches],
  );
  const visibleGroups = useMemo(
    () => GROUPED
      .map((g) => ({ ...g, sections: matches ? g.sections.filter((s) => matches.has(s.id)) : g.sections }))
      .filter((g) => g.sections.length),
    [matches],
  );

  /* Scroll-spy via IntersectionObserver. The rootMargin carves a thin band just
     below the fixed nav (top: -120px) down to ~30% of the viewport (bottom:
     -70%); the active section is the topmost one whose heading sits in that
     band. This is what auto-highlights the left nav as the reader scrolls. */
  useEffect(() => {
    const els = visibleSections
      .map((s) => document.getElementById(s.id))
      .filter(Boolean);
    if (!els.length) return undefined;
    const inBand = new Set();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) inBand.add(e.target.id);
        else inBand.delete(e.target.id);
      }
      const first = visibleSections.find((s) => inBand.has(s.id));
      if (first) setActive(first.id);
    }, { rootMargin: '-120px 0px -70% 0px', threshold: 0 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [visibleSections]);

  /* Show the back-to-top button once the reader has scrolled a screenful. */
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Pin the contents rail with position:fixed, driven by JS. CSS `sticky` was
     being silently defeated by an ancestor in this app, so we measure and pin
     explicitly instead — this cannot be blocked by ancestor overflow/transform.
       - The rail's grid column (railRef) stays in flow and keeps its 260px
         width, so pinning the panel never shifts the content.
       - While the column top is under the nav, the panel is fixed at 120px;
         near the very bottom it is clamped to the content's end so it releases
         instead of overlapping the footer.
       - Disabled below 900px, where the mobile drawer takes over. */
  useEffect(() => {
    const NAV = 120, GAP = 24;
    const clear = () => {
      const p = panelRef.current;
      if (!p) return;
      p.style.position = p.style.top = p.style.left = p.style.width = p.style.maxHeight = '';
    };
    let raf = 0;
    const update = () => {
      raf = 0;
      const rail = railRef.current, panel = panelRef.current, content = contentRef.current;
      if (!rail || !panel || !content) return;
      if (window.innerWidth <= 900) { clear(); return; }
      const railRect = rail.getBoundingClientRect();
      if (railRect.top <= NAV) {
        const maxH = window.innerHeight - NAV - GAP;
        const panelH = Math.min(panel.scrollHeight, maxH);
        const maxTop = content.getBoundingClientRect().bottom - panelH;
        panel.style.position = 'fixed';
        panel.style.top = Math.min(NAV, maxTop) + 'px';
        panel.style.left = railRect.left + 'px';
        panel.style.width = railRect.width + 'px';
        panel.style.maxHeight = maxH + 'px';
      } else {
        clear();
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
      clear();
    };
  }, []);

  /* Keep the highlighted item visible when the contents list scrolls within
     itself. `block:'nearest'` moves only the overflowing rail, not the page
     (the item is already within the viewport). */
  useEffect(() => {
    const link = panelRef.current?.querySelector('.tc-toc-link.is-active');
    link?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }, [active]);

  /* Land on the right section if the URL carries a hash. */
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const el = document.getElementById(hash);
    if (el) requestAnimationFrame(() => el.scrollIntoView({ block: 'start' }));
  }, []);

  /* Lock the page behind the mobile drawer; Esc closes it. */
  useEffect(() => {
    if (!tocOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') setTocOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, [tocOpen]);

  const goTo = useCallback((id) => (e) => {
    e.preventDefault();
    setTocOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
      window.history.replaceState(null, '', `#${id}`);
      setActive(id);
    }
  }, []);

  const count = visibleSections.length;

  const Toc = (
    <nav className="tc-toc" aria-label="Sections">
      {visibleGroups.length === 0 ? (
        <p className="tc-toc-empty">No sections match “{query.trim()}”.</p>
      ) : visibleGroups.map((g) => (
        <div className="tc-toc-group" key={g.key}>
          <p className="tc-toc-group-label">{g.label}</p>
          <ul>
            {g.sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} onClick={goTo(s.id)}
                  className={`tc-toc-link${active === s.id ? ' is-active' : ''}`}
                  aria-current={active === s.id ? 'true' : undefined}>
                  <Highlight text={s.title} query={q} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <div className="h26 new-typo n3 tc">
      {/* Light paper page (no dark hero) → the nav must be solid from the top. */}
      <SiteNav solidAt={-1} skipTo="#tc-content" skipLabel="Skip to the terms" />

      <header className="tc-masthead">
        <div className="tc-masthead-inner">
          <p className="tc-eyebrow h26-label">Legal</p>
          <h1 className="tc-title">Terms &amp; Conditions</h1>
          <p className="tc-lead">{TERMS_INTRO}</p>
          <ul className="tc-tags">
            <li className="tc-tag"><span className="tc-tag-key">Effective</span>{TERMS_META.effective}</li>
            <li className="tc-tag"><span className="tc-tag-key">Last updated</span>{TERMS_META.updated}</li>
            <li className="tc-tag"><span className="tc-tag-key">Operated by</span>{TERMS_META.entity}</li>
          </ul>
        </div>
      </header>

      <button type="button" className="tc-mobile-toc-btn" onClick={() => setTocOpen(true)}>
        <ListTree size={16} aria-hidden="true" /> Contents &amp; search
      </button>

      <div className="tc-shell">
        <aside ref={railRef} className={`tc-rail${tocOpen ? ' is-open' : ''}`} aria-label="Contents and search">
          <div className="tc-rail-scrim" onClick={() => setTocOpen(false)} />
          <div className="tc-rail-panel" ref={panelRef}>
            <div className="tc-rail-head">
              <span className="tc-rail-title">On this page</span>
              <button type="button" className="tc-rail-close" aria-label="Close contents"
                onClick={() => setTocOpen(false)}><X size={18} /></button>
            </div>

            <div className="tc-search">
              <Search className="tc-search-icon" size={15} aria-hidden="true" />
              <input
                ref={searchRef}
                type="search"
                className="tc-search-input"
                placeholder="Search the terms…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search the terms and conditions"
              />
              {query && (
                <button type="button" className="tc-search-clear" aria-label="Clear search"
                  onClick={() => { setQuery(''); searchRef.current?.focus(); }}><X size={14} /></button>
              )}
            </div>
            {q && <p className="tc-result-count" aria-live="polite">{count} {count === 1 ? 'section' : 'sections'}</p>}

            {Toc}
          </div>
        </aside>

        <main ref={contentRef} className="tc-content" id="tc-content">
          {count === 0 ? (
            <div className="tc-empty">
              <p className="tc-empty-title">No results for “{query.trim()}”.</p>
              <p className="tc-empty-sub">Try a different term — for example “cancellation”, “refund”, “visa” or “TCS”.</p>
              <button type="button" className="tc-clear-btn" onClick={() => { setQuery(''); searchRef.current?.focus(); }}>
                Clear search
              </button>
            </div>
          ) : visibleSections.map((s) => (
            <section key={s.id} id={s.id} className="tc-section" aria-labelledby={`${s.id}-h`}>
              <h2 className="tc-section-title" id={`${s.id}-h`}><Highlight text={s.title} query={q} /></h2>
              <div className="tc-section-body">
                {s.blocks.map((b, bi) => <Block key={bi} block={b} query={q} />)}
              </div>
            </section>
          ))}
        </main>
      </div>

      <button type="button" className={`tc-top${showTop ? ' is-visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: scrollBehavior() })} aria-label="Back to top">
        <ArrowUp size={18} />
      </button>

      <SiteFooter />
    </div>
  );
}
