# Cox & Kings — Reusable Asset Inventory (Revamp Survey)

Survey of the existing React (Vite) codebase to identify what the revamp can reuse and what must be built new. Working dir: `/Users/khushisaluja/Downloads/TIET/WORK/Cox and Kings`.

Routing note (`src/App.jsx`): `/` = `NewHome` (self-contained, no shared chrome), `/final`, `/final2`, `/final2a` = composite landing pages, `/private-italy` + `/group-japan` = ad landing pages, and the **classic** site (`/classic`, `/tours`, `/destinations`, `/about`, `/contact`) lives under `ClassicLayout` which wraps `Header` + `Footer` + `ChatBot` + `BackToTop`. The two design worlds use **different tokens and fonts** — see section 2.

---

## 1. Reusable Components

All in `src/components/`. These are the "classic" site components (use `src/index.css` tokens + Cormorant/Mozaic fonts). They are reusable but visually belong to the OLD brand world unless restyled to the new tokens.

| Component | File | Props | Renders | Reuse notes |
|---|---|---|---|---|
| Header | `src/components/Header.jsx` | none (internal `navItems` const) | Sticky 2-row header: topbar (Est. 1758 tagline, phone, brochure link), logo, desktop nav w/ hover dropdowns, search toggle/bar, "Speak to an Expert" CTA, mobile drawer + overlay | Full-featured classic header. Uses `react-router` `Link`, `lucide-react` icons. NewHome/Final pages ship their OWN `.nh-header` instead — pick one direction. |
| Footer | `src/components/Footer.jsx` | none (internal `footerLinks`) | Awards bar (Condé Nast, T+L, BTA, ATOL, ABTA), 4 link columns, brand blurb, contact, socials, legal bottom bar | Strong **Trust/Proof** content (awards). Reusable; NewHome has a parallel `.nh-footer`. |
| Hero | `src/components/Hero.jsx` | none (internal `slides` array of 4) | Auto-rotating full-bleed image carousel: tag, title, subtitle, price accent, dual CTA, arrows, dots, scroll indicator | Classic hero. NewHome uses a static search-led `.nh-hero` instead. |
| SearchWidget | `src/components/SearchWidget.jsx` | none | Trip search bar: destination (with **typewriter placeholder** via `useTypewriter` hook), travel month, duration; navigates to `/tours?...` | The `useTypewriter` hook is a nice reusable primitive. **Ease pillar** asset. |
| TourCard | `src/components/TourCard.jsx` | `tour` (object) | Card: image, badge, type, destination, category, title, duration, group size, 3 highlights, rating/reviews, price (₹ = `price*83`), "View Tour" CTA | Clean, reusable card. **Curation/Proof.** Links to `/tours/:id`. |
| FeaturedDestinations | `src/components/FeaturedDestinations.jsx` | none (imports `destinations`,`regions`) | Region filter tabs + 6-card destination grid (first card large), eyebrow/title/divider header | **Curation.** Composed-section, depends on data file. |
| FeaturedTours | `src/components/FeaturedTours.jsx` | none (imports `tours`,`categories`) | Category filter + 4 `TourCard`s + "View All" | **Curation.** |
| Testimonials | `src/components/Testimonials.jsx` | none (imports `testimonials`) | Quote carousel (arrows, dots) + **trust badges** (4.9/5 Trustpilot, 12,000+ reviews, 98% recommend) | **Proof + Trust.** Carousel + the badge strip are both reusable. |
| WhyChooseUs | `src/components/WhyChooseUs.jsx` | none (internal `reasons`) | 6 icon cards (Est.1758, 100+ destinations, expert specialists, 24/7 support, ATOL, award-winning) + stats block (265+, 100+, 4.9★) | Covers **Legacy/Expertise/Service/Trust/Proof** at once. Closest existing "why premium" module. |
| Newsletter | `src/components/Newsletter.jsx` | none | Email capture w/ validation + success state, side image | Lead-gen. **Service/Ease** adjacent. |
| ChatBot | `src/components/ChatBot.jsx` | none (imports `tours`) | Multi-stage guided **trip-finder concierge** bot (destination → style → month → duration → budget → results → handoff/capture). ~30KB, large state machine | Most valuable existing **Ease + Service + Concierge** asset. Reusable as floating widget. |
| BackToTop | `src/components/BackToTop.jsx` | none | Scroll-to-top FAB (appears after 500px) | Utility. |

**Page-level reusables (not in /components but copy-pasteable):**
- `pi-trust` trust strip — `src/pages/PrivateItaly.jsx:230` & `GroupJapan.jsx:232`: inline 4-item trust bar (Est.1758 / ★4.9 / All-inclusive / 100+ destinations). Good seed for a **Trust Bar** component.
- NewHome sections (all `.nh-*`, single-file in `src/pages/NewHome.jsx`): Heritage timeline, "blue medallion band" stats, curations grid, photo-review lightbox, Inspiration Station, "AS SEEN IN" press row, floating promo. These are markup-in-page, not extracted components, but are directly liftable.

---

## 2. Design Tokens

⚠️ **Two distinct token systems exist.** Decide which the revamp inherits. Per the brief the revamp should use the **`.nh.final2` Zodiak + Work Sans** direction, but the **canonical color palette is the Figma "Voyager Blue / Sienna Flame" system** (in memory, NOT fully wired into CSS yet — see Gaps).

### A. Classic tokens — `src/index.css` `:root`
```
--color-burgundy: #BD4011        --color-burgundy-dark: #97330E    --color-burgundy-light: #D2552A
--color-gold: #C9A84C            --color-gold-light: #E2C87A
--color-navy: #0F1F3D            --color-navy-light: #1A2F52
--color-cream: #FAF6F0           --color-cream-dark: #F0E8D8       --color-white: #FFFFFF
--color-text: #2C2C2C            --color-text-light: #6B6B6B       --color-border: #E0D5C5
--font-serif: 'Cormorant Garamond', Georgia, serif
--font-sans:  'Mozaic HUM', 'Helvetica Neue', Arial, sans-serif
--shadow-sm/md/lg/xl   --radius-sm:4px /-md:8px /-lg:16px   --transition: 0.3s ease
```
Global utility classes here: `.container` (max 1280px), `.section-title`, `.section-subtitle`, `.btn-primary`, `.btn-outline`, `.btn-gold`, `.gold-divider[.center]`, `.tag`, keyframes (`fadeInUp`, `fadeIn`, `slideDown`, `pulse`), `.nav-overlay`.

### B. New-home tokens — `src/pages/NewHome.css` `.nh` scope
```
--blue: #005899        --blue-bright: #0a5fb0   --blue-nav: #064f93   --blue-band: #1f51a3
--navy: #0e2336        --cream: #ece8df
--accent: #BD4011  (Sienna Flame)   --accent-dark: #97330E   --gold: #c9a86a
--ink: #202a36         --muted: #5f6b78         --line: #e3e7eb
--font-serif: 'Cormorant Garamond', Georgia, 'Times New Roman', serif
--font-sans:  'Cormorant Garamond', Georgia, serif
--font-label: 'Mozaic HUM', 'Helvetica Neue', Arial, sans-serif
```
Helper classes: `.nh-container`, `.nh-eyebrow[--light]`, `.nh-h2[--light]`, `.nh-sub[--light]`, `.nh-btn--blue/--orange/--ghost`.

### C. Revamp tokens — `.nh.final2` override in `src/pages/Final2.css` (USE THESE)
Repoints the `.nh` vars for `/final2` + `/final2a`:
```
--font-serif: 'Zodiak', Georgia, 'Times New Roman', serif
--font-sans:  'Zodiak', Georgia, serif
--font-label: 'Work Sans', 'Helvetica Neue', Arial, sans-serif
```
(Colors stay as the `.nh` values above.) Also defines: `.final2-skip` (a11y skip link), visible focus-ring (`outline 2px #BD4011`), image-loading placeholders (`#ece8df` cream / `#0e2336` navy) + shimmer, and a `prefers-reduced-motion` block. **Reuse this file's a11y + loading patterns wholesale.**

### D. Canonical Figma tokens (in memory `cox-kings-design-tokens.md`) — NOT YET in CSS
- **Voyager Blue:** 500 `#0B5AB1`, 700 `#07366A`, 800 `#042447`, 300 `#6D9CD0`
- **Sienna Flame:** 500 `#BD4011`
- Cloudstone `#F7F5FD`; Neutrals 0→900 (`#FFFFFF`…`#1F2A36`)
- Type: headings **IvyJournal Light 300** (note: codebase ships **Ivy Mode**, not IvyJournal); body/buttons **Work Sans** 400/500 (labels letter-spacing 4px); small labels **Mozaic HUM**.

> Reconciliation needed: brief says reuse Zodiak (served, working) but Figma spec says IvyJournal. The blue in CSS (`#005899`) differs from Figma `#0B5AB1`. Flag for the build team to pick the source of truth before tokenizing.

---

## 3. Existing Data Sources

All in `src/data/` (plain JS arrays, no API). Images are remote Unsplash URLs.

**`destinations.js`**
- `destinations[]` — `{ id, name, region, tagline, tours:Number, image, featured:Bool }` × 12 (India, Japan, Egypt, Peru, Kenya, Italy, Iceland, Morocco, NZ, Canada, Sri Lanka, Nepal).
- `regions[]` — `{ name, count, image }` × 6 (Asia, Europe, Africa & Middle East, Latin America, North America, Oceania).

**`tours.js`**
- `tours[]` — `{ id, title, destination, region, duration, price (USD; UI ×83 → ₹), type, rating, reviews, image, highlights:[], departures, groupSize, badge, category }` × 8.
- `categories[]`, `regions[]`, `durations[]` filter constants.

**`testimonials.js`**
- `testimonials[]` — `{ id, name, location, tour, rating, text, date, avatar }` × 4 (UK travellers).
- Note: `NewHome.jsx` and `ChatBot.jsx` define their OWN inline arrays (`testimonialList` w/ `photos[]`, `curations`, `insights`, `pressLogos`, `escapeTiles`, `DESTINATIONS`/`TRAVEL_STYLES`/`MONTHS`/`DURATIONS`/`BUDGETS`) — not centralized. The revamp should consider consolidating into `src/data/`.

---

## 4. Available Assets

**Logos**
- `public/cox-logo.svg` — the production logo, referenced as `/cox-logo.svg` (Header, Footer, NewHome header/hero/footer). **Use this.**
- `./cox and kings logo.svg` (repo root, spaces in name) — duplicate, not served from `public/`; ignore.

**Fonts** (self-hosted in `public/fonts/`, referenced as `/fonts/...`)
| Family | Path | Faces | Status |
|---|---|---|---|
| **Zodiak** | `/fonts/zodiak/` | Variable.ttf (100–900) + Regular/Light/Bold/Extrabold + Italic/BoldItalic .otf | **Revamp primary** — `@font-face` in `Final2.css`. |
| **Work Sans** | (Google Fonts, not local) | — | **Revamp secondary** — loaded externally; verify the `<link>`/import exists in `index.html`. |
| Ivy Mode | `/fonts/ivy-mode/` | full weight + italic .woff/.woff2 | `@font-face` in `index.css` (classic primary). NOT the Figma-spec "IvyJournal". |
| Mosaic | `/fonts/mosaic/` | Mosaic.otf/.ttf | classic secondary display. |
| Mozaic HUM | `/fonts/mozaic-hum/` | Light/Regular/Medium/SemiBold/Bold .otf | classic `--font-label`/`--font-sans`. |

**Images:** No local hero/destination imagery — everything is remote `images.unsplash.com` URLs hard-coded in components/pages (helper `photoMed`/`photoBig` rewrite the `w=` param). The revamp will likely need real licensed brand photography (gap).

**Other:** Root has `ad-group-japan.html`, `ad-private-italy.html`, 4 screenshots, `Zodaik Font/` + `Mozaic HUM copy/` source dirs — not app assets.

---

## 5. GAPS — 7-Pillar Coverage & What Must Be Built

| Pillar | Existing coverage | Gap / build new |
|---|---|---|
| **Legacy** | NewHome Heritage timeline (1758→Today), medallion "260+ Years", WhyChooseUs "Est.1758", footer "Established 1758" | Partial. Could extract a reusable `<HeritageTimeline>` / legacy module — currently page-bound markup. |
| **Trust** | Footer awards bar; Testimonials trust badges; `pi-trust` strip on ad pages; ATOL/ABTA mentions | **No standalone `<TrustBar>` component** — duplicated inline. Build one (Est.1758 / rating / protections / destinations). |
| **Expertise** | WhyChooseUs "Expert Specialists" card; curation notes mention specialists; "Speak to an Expert" CTAs | **No expert/specialist PROFILE module** (named people, photos, regions). Build `<ExpertProfiles>`. |
| **Curation** | FeaturedTours, FeaturedDestinations, TourCard, NewHome curations grid, Top Picks carousel | Well covered. Reuse + restyle. |
| **Service** | ChatBot concierge, WhyChooseUs "24/7 Support", Newsletter, contact CTAs | **No dedicated concierge CTA / "talk to a human" hero block** as a component. ChatBot exists but is a floating widget only. Build a `<ConciergeCTA>` section. |
| **Ease** | SearchWidget (+typewriter), NewHome `.nh-hsearch`, ChatBot trip-finder flow | **No standalone reusable `<TripFinder>` / path-router cards** ("I want X → go here"). The logic lives inside ChatBot; extract or rebuild as a visible on-page module. |
| **Proof** | Testimonials carousel + badges; NewHome photo-review lightbox; "AS SEEN IN" press row; ratings on cards | Decent. **No "as seen in" / press-logo component** (inline in NewHome only) and no stats-counter component. |

**Net new components recommended for the revamp:**
1. `TrustBar` — extract from `pi-trust` (Trust).
2. `PathRouterCards` / `TripFinder` — visible on-page trip-style router (Ease) — logic borrowable from ChatBot stages.
3. `WhyPremium` module — refactor/restyle WhyChooseUs to new tokens (Trust/Expertise/Legacy).
4. `ExpertProfiles` — net new, no data exists (Expertise).
5. `ConciergeCTA` — net new section (Service).
6. `AsSeenIn` / `PressLogos` — extract from NewHome inline `pressLogos` (Proof).
7. `StatsBand` — extract NewHome medallion/stat blocks (Legacy/Proof).
8. A **tokenized theme layer** that reconciles the Figma "Voyager Blue/Sienna Flame" palette with the live `.nh` CSS vars — currently the canonical palette is only in memory, not in code. (Foundational.)

**Other gaps:** no centralized data module for reviews-with-photos / experts / press; no local brand photography (all Unsplash); Work Sans is external (Google) while everything else is self-hosted — confirm it loads.
