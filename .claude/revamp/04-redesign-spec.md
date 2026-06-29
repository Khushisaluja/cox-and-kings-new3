# Cox & Kings — /final3 + /final3a Redesign Spec

**Status:** Client rejected the current /final3 + /final3a. This spec fixes the three rejection reasons without touching the section set or the fonts.

**What this spec does NOT change:** the section blueprint (`03-blueprint.md`), the fonts (Zodiak + Work Sans), the `.v3-` class namespace, the brand primary (Voyager Blue `#0B5AB1`). Those are fixed.

**What this spec DOES change:** the design system's colour roles (blue must dominate, Sienna demoted), the CTA hierarchy (one primary per section), and the hero (one primary CTA, far less competing content).

---

## 0. Why the current design was rejected — root cause

The diagnosis is in the code, not opinion:

- **Sienna is doing the brand's entire job.** `v3-btn--primary` = Sienna. Eyebrows = Sienna. Focus rings = Sienna. Hero search submit = Sienna. Typewriter caret = Sienna. Accent rings on PathRouter / Curations / DestinationMosaic = Sienna. Every high-salience, eye-drawn element on the page is warm orange. Blue only appears as a passive section *ground* (`--section--blue`) and in the footer. The eye records orange as "the brand colour." **That is exactly the "no blue recall" complaint, and it is structural — not a matter of adding more blue, but of reassigning every salient role from Sienna to Blue.**
- **The hero is a decision dump.** It stacks: eyebrow + H1 + sub + a 3–4 field search bar + 3 path CTAs (one a solid orange button) + a 4-item trust strip + a scroll cue. That is 6+ competing decisions above the fold. Hick's Law: time-to-decide rises with the number and salience of options. The client felt it before they could name it.
- **No demonstrable ease win over /final2a.** Same number of choices, just rearranged. Nothing made the *next step* obvious.

The fixes below are ordered by the decision hierarchy: **Accessibility → Clarity → Narrative → Beauty → Novelty.**

---

## 1. Brand-Colour Recall System

**Principle:** Voyager Blue is the brand. It must own every element the eye is *drawn to* — primary buttons, the most important headings, links, active states, icons, motifs — not just passive backgrounds. Recall comes from **one colour, used consistently, in the salient role.** The single accent earns attention precisely because it is rare.

### 1.1 Hex → role map (authoritative)

| Token | Hex | Role | Where |
|---|---|---|---|
| `--v3-blue-500` | `#0B5AB1` | **THE brand colour.** Primary buttons, links, active tab/state, icon strokes, the signature underline, eyebrows. | Everywhere salience lives. The colour the user must remember. |
| `--v3-blue-700` | `#07366A` | Primary button *hover/pressed*; mid blue section grounds; heading colour on light grounds when a heading should read as "brand". | Button states, the TrustBar mid-band option, selected headings. |
| `--v3-blue-800` | `#042447` | Deep ground: hero scrim base, TrustBar band, LeadCapture band, footer. Text on white when near-black-blue is wanted. | Dark sections + body text tinted toward brand (`--v3-ink` stays for long-form). |
| `--v3-blue-300` | `#6D9CD0` | Light blue: tints, hairline dividers on dark, focus glow, hover wash on white cards, motif lines. | Subtle blue presence on light grounds so blue is felt even in airy sections. |
| `--v3-gold` (accent) | `#C9A86A` | **The ONLY accent.** Strictly limited — see 1.4. Heritage signal, star ratings, the one "designed by" / specialist cue, eyebrow on dark grounds. | Rare, ceremonial. Never a button fill, never a section ground. |
| `--v3-sienna` | `#BD4011` | **Demoted to near-zero.** Permitted only as a tiny seasonal/"in season now" tag accent in EditorialDesire if a warm note is wanted there — and even that is optional. **Never a button, never an eyebrow, never a focus ring, never an accent ring.** | Remove from all primary roles. Prefer dropping entirely; gold replaces its "warmth" role. |
| `--v3-ink` | `#1F2A36` | Long-form body text. | Paragraphs, descriptions. |
| `--v3-cloud` / `--v3-cream` / `--v3-white` | `#F7F5FD` / `#F8F7F1` / `#FFF` | Light section grounds (alternation rhythm). | Calm backgrounds between blue moments. |

### 1.2 Blue proportion budget (the "60/30/10"-style rule)

Aim, across any full scroll of the page:

- **~55–60% neutral grounds** (white / cream / cloud) — the editorial air. Premium = whitespace.
- **~30–35% blue** — but it must include **all the salient hits**: every primary button, every link, every active icon, the recurring motif, plus the 3–4 deep-blue full-bleed bands (Hero scrim, TrustBar, the Difference assurance moment, LeadCapture). Blue is felt as *structure* (the recurring bands) AND as *action* (every button).
- **~5% gold** — ratings, the heritage lockup, specialist cues. Ceremonial only.
- **~0–1% sienna** — ideally zero.

The recall win is not "more blue square inches"; it is **blue in the action role.** When the only colour the user ever clicks is `#0B5AB1`, blue becomes the brand by muscle memory.

### 1.3 Button-colour decision (the single most important fix)

- **Primary CTA = `--v3-blue-500` (#0B5AB1) solid, white text.** Hover/pressed → `--v3-blue-700`. This is the change that fixes complaint #2.
  - WCAG: `#0B5AB1` on white = 4.6:1 (text AA passes for the label; the button itself is a large component). White text on `#0B5AB1` = 4.6:1 — passes AA for the ≥18.66px/bold button label. Verified safe.
- **Secondary CTA = outline in `--v3-blue-700`** (transparent fill, blue border + blue label), hover fills blue. On dark grounds: white outline → fills white, blue label on hover.
- **Quiet/tertiary = text link** in `--v3-blue-700` with the signature underline + arrow; hover slides arrow + deepens to `#07366A` (NOT to sienna — change `.v3-link:hover` away from sienna).
- **On deep-blue bands:** primary becomes `--v3-btn--light` (white fill, `#042447` label) so it still reads as "the action," and stays monochrome-brand.

Implementation note for the implementer: in `v3-theme.css`, repoint `--v3-btn--primary` background to `var(--v3-blue-500)` / hover `var(--v3-blue-700)`; repoint `.v3-eyebrow` color to `var(--v3-blue-500)`; repoint the global focus ring to `var(--v3-blue-700)` (currently sienna); repoint `.v3-link:hover` to `var(--v3-blue-700)`; repoint the hero search submit, the typewriter caret, and all accent rings (PathRouter / Curations / DestinationMosaic) from sienna to `var(--v3-blue-500)`. Keep `.v3-rating__stars` gold.

### 1.4 The single accent and its strict rule

**Gold `#C9A86A` only.** Allowed uses, total, across the whole page:
1. Star-rating glyphs (`.v3-rating__stars`).
2. The **heritage lockup** mark (see 1.5) — the "Since 1758" crest/compass.
3. The **specialist cue** — the small "Designed by [Name]" line/avatar ring in Curations, and the concierge cue in Difference.
4. Eyebrow text *only when on a deep-blue ground* (gold reads better than blue on `#042447`); on light grounds eyebrows are blue.

Gold is **never** a button, never a section background, never a body-text colour, never more than a thin line or small glyph. If it appears more than ~4 times per viewport-height, it is overused.

### 1.5 Three repeated "brand signature" devices (this is what builds recall)

Recall is built by **repetition of a distinctive, ownable device.** Three, used relentlessly:

1. **The Voyager underline.** A 2px `#0B5AB1` underline with a short lead-in (think a compass/route line) that sits under every section eyebrow and under text links, and animates left-to-right on the hero H1's last word and on link hover. One consistent gesture = "this is Cox & Kings blue." Class: `.v3-uline` (a `::after` pseudo, 2px, `--v3-blue-500`, `transform: scaleX()` origin-left).
2. **The 1758 heritage lockup.** A small fixed lockup — gold compass/crest glyph + `SINCE 1758` in Work Sans 4px-tracked caps — that appears in the header, repeats as the hero eyebrow's leading mark, and closes the footer. Same mark, three touchpoints = a remembered emblem. Gold-on-blue or blue-on-light only.
3. **The blue band rhythm.** Deep `#042447`→`#07366A` full-bleed bands recur at predictable beats (Hero scrim → TrustBar → Difference assurance → LeadCapture). The page visibly "breathes blue" on a regular cadence, so blue becomes the page's spine, not a one-off. Each band carries one of the signature devices.

If a user is asked the next day "what colour was that site?" — these three devices are what make the answer "blue."

---

## 2. CTA Hierarchy Rules

**Iron rule: ONE primary CTA per section.** Everything else on a screen is secondary (outline/quiet) or non-interactive. This is the single biggest *ease* lever (Hick's Law) and it directly answers complaint #1.

### 2.1 The three tiers (visual contract)

| Tier | Look | Count per section | Purpose |
|---|---|---|---|
| **Primary** | Solid `#0B5AB1` pill, white label | **Exactly 1** (incl. hero) | The one obvious next step. |
| **Secondary** | Blue outline pill (or white outline on dark) | 0–1 | An alternative for the minority who want it. |
| **Quiet** | Text + arrow link, blue, signature underline | as needed but visually recessive | "More / read on / talk to someone." Low salience. |

A persistent **"Talk to an Expert"** lives in the header and the mobile sticky bar — so it never needs to compete *inside* a section. This is what lets every section drop to one primary.

### 2.2 The NEW hero (fixes complaint #1)

**Keep:** cinematic full-bleed image (slow Ken-Burns rotation is fine), eyebrow with heritage lockup, H1, one short sub, ONE primary CTA, the scroll cue. Add a 3-stat (not 4) trust strip, condensed.

**Remove from the hero:**
- The in-hero **search bar** (both the A2 directed search and the A 4-field search). → Move it down (see 2.3). This removes the single biggest source of above-fold clutter and the "is this an OTA?" feeling.
- **Two of the three path buttons.** Hero gets one primary + one quiet secondary only.
- The 4th trust item (trim to 3).

**Hero contents — exact spec:**
- Eyebrow (with gold 1758 lockup mark): `SINCE 1758 · THE WORLD'S MOST TRUSTED TRAVEL NAME`
- H1 (Zodiak): **Premium international holidays, expertly led and obsessively curated.** (Voyager underline animates under "curated.")
- Sub (one line, ≤22 words): *260 years of legacy and expert-led planning — flights, visas, hotels and transfers all handled, so you simply travel well.*
- **Primary CTA (the ONE):** `Start Planning My Trip` → scrolls to the 4-Path Router (`#v3-router`). Solid `#0B5AB1`.
  - Rationale for label + target: the router is where the *ease* story begins; "Start Planning" is a low-commitment, high-intent verb that suits both decided and undecided. It is the single obvious next step.
- **Quiet secondary (at most one):** `Talk to an Expert` (phone glyph), text link, white on the dark hero. No solid button.
- **Trust strip (3 items, condensed, one line):** `4.7★ from 1M+ travellers · 70% travel with us again · 90% visa success`
- Scroll cue: `Where shall we begin?` ↓ (unchanged; it now reinforces the single CTA's destination).

That is **1 primary + 1 quiet link + a passive trust line.** From 6 competing decisions down to 1. The hero now reads as a brand statement, not a booking console.

### 2.3 Where the search goes — and why (ease justification)

**Move the directed search OUT of the hero and INTO the 4-Path Router section, as the body of the "Help Me Decide" path / a single inline field at the top of the router.** Reasoning:

- **Jakob's Law cuts both ways:** users expect a search on an OTA; Cox & Kings is deliberately *not* an OTA, and the brand's wedge is "we plan it, you don't fiddle with filters." Leading with search undercuts the premium-concierge promise and overloads the hero.
- **Progressive disclosure:** the hero asks one question ("ready to begin?"). Only after the user opts in (scrolls / clicks) do we present the directed Where/What/When. Choice is revealed when wanted, not dumped up front.
- **Two audiences, one flow:** the decided searcher (S4/S6) loses nothing — the search is one scroll away and is the first interactive thing in the router. The undecided majority (S5/S7) are no longer confronted with empty fields they can't fill.

So `/final3a`'s differentiator becomes: the **directed Where/What/When search is the lead element of the Router**, with the typewriter prompt and curated suggestion lists (reuse existing mechanics). `/final3` keeps a calmer router with the 4 cards and a simpler "search or talk" entry. Both heroes are identical and clean — the A/A2 difference moves to the router, where it belongs.

### 2.4 Per-section CTA assignment (one primary each)

| Section | Primary (1) | Secondary / Quiet |
|---|---|---|
| Hero | `Start Planning My Trip` → #v3-router | quiet: `Talk to an Expert` |
| 4-Path Router | the router cards are *equal* choices; the directed search submit `Find My Trip` is the one solid CTA | each card has a quiet underline link |
| TrustBar | none (proof band, no CTA) | — |
| Strongest Destinations | `See All Destinations` (one, end of section) | tiles are quiet links |
| How We Travel | `Explore Group Tours` (the flagship product = the one solid CTA) | other cards use quiet links |
| C&K Difference | none inline; ends with quiet `Talk to an Expert` | — (the band is reassurance, not conversion) |
| Editorial Desire | `See All Journeys` (one) | per-card `Read the Journey` quiet links |
| Proof | `Read More Reviews` (one, quiet-ish outline) | rating chip is passive |
| As Seen In | none | — |
| Curations | `View Itinerary` per card is the action; section has no extra primary | — |
| Lead Capture | `Find My Perfect Trip` (the page's main conversion — solid blue) | quiet `Or talk to an expert now` |
| Footer | none | links only |

Note the discipline: **two sections (TrustBar, As Seen In) have zero CTAs** — they are pure trust. Two more (Difference, Curations) have no *section-level* primary. This restraint is what makes the real conversion points (Router search, Lead Capture) unmissable.

---

## 3. Ease-of-Use Improvements (vs /final2a)

Concrete, measurable reductions:

1. **Above-fold decisions: 6 → 1.** Hero now offers one primary action. (Hick's Law — fewer salient options = faster, more confident decision.)
2. **One colour means one "click here" signal.** Because every primary action is the same blue, users learn the affordance once. In /final2a, orange buttons, orange links, orange rings and orange search all competed; nothing told the eye *which* orange was the next step.
3. **Search is opt-in, not imposed.** The undecided are not blocked by empty fields; the decided reach it in one scroll. Both journeys get shorter perceived effort.
4. **Scan-ability via consistent heading kit.** Every section: blue eyebrow + signature underline → Zodiak H2 → one sub ≤60ch → content → at most one primary. Predictable rhythm = the eye knows where to look (Visual Hierarchy + Jakob's Law of internal consistency).
5. **Two zero-CTA trust bands** give the eye rest and build credibility without asking for anything — reducing cognitive load between asks.
6. **Mobile thumb-flow:** primary CTA always full-width and in the lower-third thumb arc; sticky bottom bar (`Talk to an Expert` / `Plan My Trip`) carries the persistent ask so section CTAs can be single and calm. Router cards stack with the most-popular first; search field is large-tap (≥48px, Fitts's Law).
7. **The single obvious next step on every screen:** there is always exactly one solid blue element in view. If a user does nothing else, that's where they go.

---

## 4. Pillar Expression Map (one clear home each — simple, not over-claimed)

| Pillar | The ONE clearest place + treatment |
|---|---|
| **Legacy** (260 yrs) | Hero eyebrow heritage lockup (`SINCE 1758`) + TrustBar `260 years` numeral tile. Gold 1758 mark = the memorable carrier. One claim, stated plainly. |
| **Trust** (1M+, ratings, awards, media) | TrustBar deep-blue band: four numerals + muted association/award logo row. The blue band IS the trust moment — believable because it's quiet, not shouty. |
| **Expertise** (specialists & tour managers) | C&K Difference, pillar 1: "Specialists, not salespeople." Reinforced by the gold "Designed by [Name]" specialist cue in Curations. |
| **Curation** (designed journeys) | Editorial Desire module (season-led story spread) — desire shows curation better than a claim. Strongest Destinations' "vet and re-walk every season" hook supports it. |
| **Service** (concierge + on-trip) | C&K Difference, pillar 3: "Looked after, all the way" (WhatsApp line) + persistent header/sticky `Talk to an Expert`. Service is *demonstrated* by the ever-present human, not just claimed. |
| **Ease** (everything handled) | Hero sub one-liner ("flights, visas, hotels and transfers all handled") + Difference pillar 2 "Everything, handled" + TrustBar `90% visa success`. |
| **Proof** (testimonials, photos, repeat) | Proof section: real photos + named reviews + `4.7★ · 2,400+ reviews` chip + "7 in 10 come back" banner. Photographic, specific, named — the antidote to over-claiming. |

Each pillar = one primary home + at most one reinforcement. Nothing is buried; nothing is repeated so often it reads as marketing noise.

---

## 5. Section-by-Section Adjustments (keep the sections, fix execution)

**Global (apply to every section via `v3-theme.css`):**
- `.v3-btn--primary` → blue fill `#0B5AB1`, hover `#07366A`. Drop the sienna shadow; use `0 10px 26px rgba(11,90,177,0.28)`.
- `.v3-eyebrow` → `color: var(--v3-blue-500)`; add the signature underline.
- Global focus ring → `var(--v3-blue-700)` (was sienna).
- `.v3-link` hover → `var(--v3-blue-700)` (was sienna).
- `.v3-chip` → neutral/blue tint, not sienna tint.

**Header:** primary CTA stays `Talk to an Expert` but recolour to blue solid (was sienna). Add the gold 1758 lockup beside the logo. Tier-2 offerings bar already blue — keep.

**Hero (HeroV3):** rebuild per §2.2. Remove search form + 2 path buttons + 1 trust item. Recolour caret, submit-not-present-anymore. Animate the Voyager underline under H1's last word as the single orchestrated reveal beat.

**4-Path Router:** becomes the new home of the directed search (lead element, above the 4 cards) for /final3a; /final3 keeps cards + a simple "search or talk" line. Accent ring on "Help Me Decide" card → blue `#0B5AB1` (was sienna). Card CTAs = quiet blue underline links. Search submit `Find My Trip` = the one solid blue button.

**TrustBar:** already deep-blue band — good, keep as the anchor trust moment. Numerals Zodiak; labels Work Sans tracked. Carry one signature device (the underline under the eyebrow). Zero CTAs. Association logos muted white-60% row.

**Strongest Destinations (DestinationMosaic):** recolour hover/focus rings blue. One section CTA `See All Destinations`. Tiles = quiet. Keep the magazine varied-height grid.

**How We Travel:** one solid CTA only — `Explore Group Tours` on the flagship Group card. Other three cards → quiet underline links. Trim each body to ≤2 lines.

**C&K Difference:** **Replace the Sienna assurance ribbon with a blue (or cream-on-blue) ribbon.** The Indian-traveller pill chips move from sienna tint to blue-tint chips. Concierge portrait/quote = gold ring (the rare accent earns its place here as the human-warmth cue). No inline primary; close with quiet `Talk to an Expert`.

**Editorial Desire:** one section CTA `See All Journeys`; per-card `Read the Journey` quiet links. Season tags MAY use a thin gold rule. If any warm note survives anywhere, it is here and it is gold, not sienna. Trim lead caption to 2 sentences.

**Proof:** rating chip gold stars on blue/white. "7 in 10 come back" banner = blue band, white text. One CTA `Read More Reviews` (outline). Keep real named reviews + photo lightbox.

**As Seen In:** unchanged structurally (muted logo row on cream); zero CTA. Ensure logos are greyscale at ~60% so they don't compete with blue.

**Curations:** accent ring → blue. Add gold "Designed by [Name]" specialist cue (the rare accent). `View Itinerary` per card = the action (blue outline). From-price plain. No extra section primary.

**Lead Capture:** deep-blue band. Primary `Find My Perfect Trip` = `--v3-btn--light` (white fill, `#042447` label) so it pops on blue and stays brand-monochrome. Quiet `Or talk to an expert now`. "Where to?" accepts "I'm not sure yet — help me decide." Keep 24h-reply + no-spam reassurance.

**Footer:** unchanged structurally; add the 1758 gold lockup as the closing signature device. WhatsApp line + single rating/association row.

**StickyCTABar (mobile):** recolour from sienna to blue `#0B5AB1`. Two items: `Talk to an Expert` / `Plan My Trip`.

---

## 6. Page-Load / Motion Intent + Accessibility

**Motion philosophy: one orchestrated hero reveal, restraint everywhere else.** Premium = confident stillness, not effects.

- **Hero (the one orchestrated beat):** on load, a single staggered rise — eyebrow (0ms) → H1 (90ms) → sub (180ms) → CTA + trust (270ms), each `v3-rise` (22px, 0.7s, `--v3-ease`). Then, once, the **Voyager underline** sweeps under H1's last word (scaleX 0→1, origin-left, ~0.5s). The Ken-Burns image drift is slow (≥20s per image) and subliminal.
- **Below the fold:** elements fade/rise **once** on scroll-into-view (IntersectionObserver, `v3-rise`, single play, no loop, no parallax). No section should animate more than its heading + content block. No counters racing, no carousels auto-advancing faster than 6s.
- **Link/button micro-motion:** the underline grow + arrow slide on hover; button `translateY(-2px)`. Nothing else.

**Accessibility (WCAG 2.2 AA, non-negotiable — tier 1 of the hierarchy):**
- `prefers-reduced-motion`: already handled globally (kills animation/transition durations) — keep, and ensure the hero reveal and underline sweep are inside it (they render in final state instantly).
- **Contrast:** white-on-`#0B5AB1` button label = 4.6:1 (AA for the bold/large label — pass). Body `--v3-ink` on white = high pass. **Do NOT** put `#0B5AB1` body text on cream for long text; use `--v3-ink`. Blue-500 on cream `#F8F7F1` for links/eyebrows = ~4.3:1 — acceptable for the bold tracked eyebrow and underlined links (the underline is a non-colour affordance, satisfying 1.4.1 Use of Color). Gold `#C9A86A` is decorative only — never the sole carrier of meaning, never small body text (it fails contrast for that).
- **Focus:** visible `#07366A` 2px ring, 3px offset (already wired) — ensure every new interactive element inherits it.
- **Keyboard:** skip link present (keep); router search, all CTAs, lightbox fully keyboard-operable; sticky bar reachable in tab order.
- **Screen readers:** hero rotating images `aria-hidden`; trust strip read as text; the typewriter placeholder has a real `aria-label` (already done) so the animated text is decorative only.
- **Tap targets:** ≥44×44px (buttons already 48px tall — keep on mobile, full-width).

---

## 7. Self-Critique → the three weakest decisions, improved

Before finalizing, I stress-tested this spec. Three weakest points and the fixes now folded in above:

1. **Weakness — "remove search from hero" risks alienating high-intent searchers (S4/S6) and could feel like a downgrade from /final2a's search-forward hero.**
   *Improvement:* the search isn't deleted, it's **relocated to the first interactive position in the Router** (one scroll, one click from hero via the single `Start Planning My Trip` CTA that scrolls straight to it). Decided users lose ~one scroll; undecided users lose a wall of empty fields. Net ease gain for the majority, near-zero loss for the minority — and it protects the premium-concierge positioning. This is now explicit in §2.3.

2. **Weakness — white-on-`#0B5AB1` is only 4.6:1; if any primary button label were set small/regular-weight it would fail AA, and an all-blue page risks monotony that reads as "cheap blue corporate," the opposite of premium.**
   *Improvement:* pinned the button label to bold/≥16px (so the 4.6:1 large-text allowance holds), reserved `#042447`/`#07366A` deep shades for the recurring bands to give blue *depth and variation* (not one flat hue), and gave gold a precise ceremonial role so the palette has a warm jewel against the blue. Monotony is broken by **shade hierarchy + neutral air + rare gold**, not by reintroducing sienna. Contrast specifics now in §6.

3. **Weakness — "one primary CTA per section" could starve genuine conversion if a key section's lone CTA is wrong, and a rule can become dogma.**
   *Improvement:* the persistent header + mobile sticky `Talk to an Expert` carries the always-available human ask, so no section has to choose between "browse" and "talk" — freeing each section's single primary to be the *right* one. I also audited every section's single primary in §2.4 to confirm it's the highest-value action for that section's job (e.g., Lead Capture keeps the page's true conversion as a high-contrast light button on blue), and explicitly allowed two sections to have **zero** CTAs so restraint reads as confidence, not omission.

---

## Quick-reference summary for the implementer

- **Brand colour:** repoint every salient role (primary buttons, eyebrows, links, focus rings, accent rings, search submit, caret) from Sienna → **Voyager Blue `#0B5AB1`** (hover `#07366A`). Sienna → drop. Gold `#C9A86A` = rare accent only (stars, 1758 lockup, specialist cue).
- **Signature devices (build recall):** Voyager underline, gold 1758 heritage lockup (header + hero + footer), recurring deep-blue bands.
- **Hero:** eyebrow + H1 + one sub + **ONE** primary `Start Planning My Trip` (→ #v3-router) + one quiet `Talk to an Expert` + 3-item trust strip. **Remove the search bar and two path buttons.**
- **Search:** relocate to the top of the 4-Path Router (opt-in, progressive disclosure).
- **CTA rule:** exactly one solid blue primary per section; two sections carry zero CTAs.
