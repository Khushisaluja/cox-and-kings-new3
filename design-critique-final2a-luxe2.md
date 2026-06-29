# Design Critique — Final 2a vs. Luxe 2

**Reviewed:** http://localhost:5173/final2a and http://localhost:5173/luxe2
**Method:** Headless Chrome captures at 1440px (desktop) and 390px (mobile), full-page section-by-section, plus live computed-style probes of fonts, colours and CTA specs.
**Benchmark bar:** Instrument, Active Theory, Resn, Pentagram, COLLINS, Basic/Dept.
**Reference design system:** `design.md` — Voyager Blue `#0B5AB1`, Sienna Flame `#BD4011`, **Zodiak** serif headings (Light 300), **Work Sans** body, warm paper neutrals, 4px radius.

---

## CRITICAL CROSS-CUTTING FINDING — read first

**The signature serif (Zodiak) is not actually loading on either page.** The live document font set on both `/final2a` and `/luxe2` contains *Cormorant Garamond, Playfair Display, Inter and Work Sans* — **but no Zodiak at all.** Headings declare `font-family: Zodiak, Georgia, "Times New Roman", serif`, so every heading you see is rendering in the **Georgia/Times fallback**, not the brand face.

- **Severity:** Critical
- **Why it matters:** Zodiak *is* the brand's editorial voice in `design.md`. With it absent, the entire typographic identity collapses to a system serif that ships on every laptop. Half of what should make this feel like a 260-year house is silently gone — and the resemblance to a generic template is largely caused by this one bug.
- **Root cause:** The `@font-face`/`Zodiak` asset is never served or registered (the list is polluted with three *other* unused display/body fonts — Cormorant, Playfair, Inter — that aren't in the design system either, suggesting copy-paste boilerplate font stacks rather than a curated load).
- **Recommendation:** Self-host and preload Zodiak (woff2, weight 300), strip Cormorant/Playfair/Inter from the bundle entirely, and verify `document.fonts` lists `Zodiak ... loaded` before judging anything else. Re-screenshot afterward; several "generic serif" notes below will partly resolve.

A second shared problem: **both heroes use the identical headline "Discover the World in Luxury & Style."** "Luxury & Style" is the single most over-used phrase in premium-travel marketing. For a house that can say *"since 1758,"* leading with the most generic luxury cliché in the category is a wasted first impression on both screens.

---

# SCREEN 1 — FINAL 2A

### First impression / brand character
Reads as a **competent premium-travel template**, not a 260-year institution. The chrome is the tell: a tall, saturated **double-decker header** — a bright `#0B5AB1` band ("THE WORLD'S MOST EXPERIENCED TRAVEL COMPANY · EST. 1758") sitting on a second dark-navy nav bar — eats ~140px before any content and feels like a SaaS dashboard, not editorial heritage. The crest is dropped into a **white rounded-rectangle "sticker"** floating on the blue, which looks like an un-styled logo container / placeholder rather than an integrated mark. Below the fold it's a familiar parade of agency-starter sections: destination grid → experience cards → trust stats → testimonial slider → tours grid → "AS SEEN IN" logo wall → blog cards → expert-curated cards → footer. Every block is *fine*; none is memorable. Heritage is *asserted* in copy ("260+ years," "1758" four times) but never *expressed* in art direction.

### Visual hierarchy & layout
- The hero is **over-tall** (~2 viewports of mountain photo) with the headline + search bar floated low/centre, so the first screen is mostly empty dark-blue sky with no message — you scroll a full viewport before the value proposition lands.
- The content body is a clean, predictable 12-col grid. Hierarchy is legible but monotonous: nearly every section is `eyebrow → serif H2 → one line of body → card row`. No rhythm change, no scale contrast, no asymmetry to create interest across ~8 sections.
- The mixed card system is inconsistent: the Popular Destinations block uses one tall + four short tiles (good), but the Experiences row, Tours row and "Recommended" row are three different card languages stacked back-to-back.

### Typography & colour fidelity to design.md
- **Heading weight is wrong:** computed `font-weight: 400` on the H1. `design.md` mandates Zodiak **Light 300** ("never bold the serif; weight comes from size, not heaviness"). Combined with the Georgia fallback, headings render visibly heavier than the system intends.
- **Body text is a cold grey-blue** `rgb(95,107,120)` ≈ `#5F6B78`, not the warm `Neutrals/700 #60605A`. `design.md` is explicit: *"warm neutrals, not cold greys."* This is a direct violation and it subtly chills the whole page.
- **CTA radius is 3px**, not the system's **4px**; CTA label is **pure white `#FFF`** rather than the warm `#F1EFE2` button spec. Small, but these are exactly the details an Awwwards jury checks.
- **Off-palette gold/ochre** appears repeatedly with no token behind it: the "Explore →" links on the experience cards, the underline accents beneath H2s, and the "EST. 1758" chip. There is **no gold in `design.md`** — it's an invented accent that muddies the Blue/Sienna system.
- Primary/secondary logic is muddled: the most prominent header CTA is **Sienna** ("SPEAK TO A TRAVEL EXPERT"), while `design.md` says blue is primary and sienna is for *sparing* accent.

### Hero & primary CTA effectiveness
- The hero has **no narrative CTA** — just a search bar whose only button is "SEARCH." The emotional pitch ("Discover the World…") and the action ("SEARCH") don't connect.
- **Too many competing CTAs on one view**, violating `design.md`'s "one primary action per view": header "Speak to a Travel Expert" (sienna) + hero "Search" (blue) + a floating "Plan My Trip" pill (sienna + sparkle). Three sienna/blue calls fight for the same eye.
- Hero search **placeholder + the "4.5 · 2,400+ traveller reviews" rating chip are very low-contrast** (faint grey/translucent on the dark photo) — they nearly disappear.

### Mobile experience
- **Two stacked floating CTAs collide:** a "Plan My Trip" pill *and* a full-width "Speak to a Travel Expert" bar both pin to the bottom, overlapping each other and **covering real content** (e.g. they sit on top of the "4.5 average rating" stat and the "Ways to Experience the World" heading). This is the most damaging mobile issue — permanent obstruction + redundant duplicate actions.
- Otherwise mobile stacking is orderly: full-width image destination cards read well and have good contrast.

### Accessibility & readability
- Cold-grey body on off-white paper is lighter than ideal; verify `#5F6B78` on `#F8F7F1` meets 4.5:1 (it is borderline at 16px).
- Hero rating text and search placeholders likely **fail WCAG AA**.
- Gold "Explore" links on photographic cards — contrast unverified and likely fails over lighter image regions.
- Persistent floating CTAs reduce usable mobile viewport and overlap focus targets.

### Prioritised recommendations
1. **(High)** Fix the Zodiak load and set headings to **300 weight**; this alone lifts the whole page. Remove Cormorant/Playfair/Inter from the bundle.
2. **(High)** Kill the redundant mobile double-CTA — keep **one** persistent action, and stop it covering content.
3. **(High)** Recolour body text to the **warm** neutral scale and correct CTA radius (4px) + label colour (`#F1EFE2`); delete the off-palette gold accent.
4. **(Med)** Replace the double-decker saturated header with a single, lighter heritage bar; re-style the crest so it isn't a floating white sticker.
5. **(Med/Low)** Give the hero a real narrative CTA, tighten its height so the proposition is above the fold, and introduce layout-rhythm variation so the 8 sections don't feel like one template repeated.

---

# SCREEN 2 — LUXE 2

### First impression / brand character
Markedly **more art-directed and memorable.** Full-bleed Santorini hero on a near-black navy (`Neutrals-Dark`, exactly the "hero overlay" use `design.md` prescribes), left-aligned stacked serif with an **italic display cut** ("*in Luxury & Style.*"), and — critically — **subcopy that actually says something**: *"…for those who travel not to escape life, but to deepen it — planned end to end, by one expert who is yours alone."* That's a brand sentence, not filler. Downstream it earns its ambition: an **arched image mask** for Destinations, a video "Moods" moodboard, and a genuinely distinctive **"Don't choose a destination. Choose a feeling."** mood-selector. This is the screen reaching for Instrument/COLLINS territory — though with rough edges that would currently keep it out of the running.

### Visual hierarchy & layout
- Strong hero hierarchy: eyebrow → large stacked headline → meaningful subcopy → labelled search → social proof. The right-side **floating credibility chips** (Est. 1758 / 2,400+ Reviews / 100+ Destinations / Private, Tailor-Made / 24/7 Concierge) add depth without clutter.
- More compositional variety than Final 2a: arch masks, asymmetric heritage split, horizontal video row, masonry reviews. It *moves*.
- **But the page is excessively tall and gappy** — total scroll ≈ 8,800px desktop / ~12,800px mobile. Several full viewports are near-empty during scroll because heavy scroll-reveal sections (counters, mood preview) sit at low opacity / `0`-state counters until their trigger fires. On a fast scroll you pass through dead, half-rendered space.

### Typography & colour fidelity to design.md
- **Most faithful of the two:** H1 computes to **weight 300** (correct Light), CTA radius **4px** (correct), CTA label **`#F1EFE2`** (correct warm off-white). Body on the hero is white-82% — appropriate on dark.
- **However**, the display style leans on **bold/heavy italic serif** for "*unforgettable journeys*" and "*Choose a feeling.*" That contradicts `design.md`'s rule "never bold the serif — weight comes from size, not heaviness." It's a deliberate, attractive choice, but it's off-system; decide whether to amend the system or pull these back to Light.
- Still inherits the **Zodiak-not-loading** bug, so even the "good" 300 weight is Georgia, not the brand face.
- The **"// " eyebrow prefix** ("// OUR HERITAGE", "// DISCOVER MY MOOD") is a techy/developer flourish slightly at odds with a heritage tone — minor, but worth a deliberate decision.

### Hero & primary CTA effectiveness
- Clear single primary action in the hero (blue **SEARCH**) with the sienna "Speak to an Expert" as a secondary header call — **closer to the "one primary action" principle** than Final 2a.
- The labelled search ("Where to?", "How many people?", "When?") is more usable and more premium than Final 2a's placeholder-only bar.
- Rating "4.8 from 14,200 verified travellers" is legible against the gradient.

### Mobile experience
- Hero translates well: full-bleed image, stacked headline, **stacked labelled search card** with dropdowns, rating. Good.
- But the desktop-first **scroll-reveal / pinned interactions degrade on mobile** — long empty stretches where the Destinations arch, the stats counters ("0 / 0+ / 0%" caught un-animated) and the reviews masonry haven't revealed. A 12,800px mobile page that's partly dead air is a real cost.
- Same pattern as Final 2a: a persistent **"Speak to an Expert" bar + AI button** pin to the bottom and overlap the hero rating line.

### Accessibility & readability
- **Several low-contrast failures, worse than Final 2a:**
  - The mood-selector **inactive items** (Adventure, Serenity, Culture…) are grey-on-blue, well below AA.
  - The mood **preview card** text ("Slow mornings, private dinners…") is dark-blue on a blue image — barely readable.
  - The **reviews masonry** uses translucent white overlay cards on dark navy; "The Nair Family" and its star rating are very faint grey-on-light-translucent.
- **Motion safety:** heavy scroll-triggered reveals + counters; no evidence of `prefers-reduced-motion` handling — must be verified.
- The arched-mask and overlay-text patterns put text over busy photography in places; gradients help but contrast needs auditing per card.

### Prioritised recommendations
1. **(High)** Fix Zodiak loading (shared) and decide the bold-italic-vs-Light question deliberately rather than violating the system by accident.
2. **(High)** Fix the contrast failures: mood inactive items, mood preview card, and the translucent reviews cards must hit AA. These are the difference between "characterful" and "fails a jury's accessibility pass."
3. **(High)** Tame the page height / reveal timing so there are **no dead half-rendered viewports**, especially on mobile; ensure counters and reveals have a sensible fallback (visible end-state) for fast scroll and reduced-motion.
4. **(Med)** Reconsider the "// " eyebrow and re-audit which scroll-jacked/pinned sections are worth their mobile cost.
5. **(Med/Low)** Replace the shared "Luxury & Style" hero line with something only a 1758 house could say — the subcopy already proves you can write it.

---

# COMPARISON

**Luxe 2 is the stronger screen, clearly.** It has art direction (arched masks, mood selector, "Choose a feeling," video moodboard), a hero that *says something*, and it is **more faithful to `design.md`** on the measurable specs — Light 300 headings, 4px radius, `#F1EFE2` button text, warm-dark hero. Final 2a, by contrast, reads as a polished but generic premium-travel template, and it quietly breaks the system in several places: 400-weight headings, **cold** grey body text, 3px radius, pure-white button labels, and an **invented gold accent** that isn't in the palette.

Luxe 2's weaknesses are *executional and fixable* (contrast failures, over-long gappy page, reveal timing, bold-serif-vs-system, mobile degradation of desktop motion). Final 2a's weakness is *conceptual* — it's competent but template-like, and would need a stronger creative idea, not just bug fixes, to be memorable.

**Neither is award-ready yet.** Both are sunk by the same root issue — **Zodiak never loads, so both fall back to Georgia** — which must be fixed before any serious jury submission.

**What Final 2a should borrow from Luxe 2:** the meaningful hero subcopy and single-primary-CTA discipline; the warm-dark editorial hero treatment instead of the saturated double-decker header; the labelled search; the design-token fidelity (300 weight, 4px, `#F1EFE2`); and the willingness to art-direct sections differently instead of repeating one template.

**What Luxe 2 should borrow from Final 2a:** its tighter, more predictable mobile stacking and shorter scroll; the cleaner contrast on solid card backgrounds (Final 2a's image cards are more reliably readable than Luxe 2's translucent overlays); and its more restrained section pacing — Luxe 2 is ~40% taller for not much more content.

---

## SCORES

| Dimension | Final 2a | Luxe 2 |
|---|---|---|
| Creativity | 4 / 10 | 7 / 10 |
| UX | 6 / 10 | 6 / 10 |
| Visual Design | 5 / 10 | 7 / 10 |
| Motion Design | 4 / 10 | 6 / 10 |
| Accessibility | 5 / 10 | 4 / 10 |
| Technical Quality | 5 / 10 | 5 / 10 |
| Brand Character | 4 / 10 | 7 / 10 |
| **Award Potential** | **3 / 10** | **5 / 10** |

*Both Technical Quality scores are capped by the Zodiak font-load failure and the polluted font bundle. Luxe 2's Accessibility is lower than its visual polish because of multiple low-contrast text-on-image / translucent-card failures.*
