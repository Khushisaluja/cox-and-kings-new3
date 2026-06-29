# Cox & Kings — Design Language

The single source of truth for the Cox & Kings website design system, extracted from the
Figma file [_Khushi · Cox & Kings Website Design_](https://www.figma.com/design/tZfvJYGdKIq6aJN00W4WOG/Khushi--Cox---Kings-Website-Design?node-id=1-260)
(`🟢 Design Styleguide` page). All values below are taken directly from the Figma design
variables and component definitions.

---

## 1. Brand foundations

The palette pairs a deep, trustworthy **Voyager Blue** (heritage, reliability) with a warm
**Sienna Flame** accent (adventure, the earth-tone of travel), grounded on a **warm paper**
neutral scale rather than cold greys. Headings are set in the editorial serif **Zodiak**;
body and UI text in the humanist sans **Work Sans**.

---

## 2. Colour

Colours are organised as token ramps. The `500` step is the base/brand value; lower numbers
are tints (lighter), higher numbers are shades (darker).

### 2.1 Primary — Voyager Blue
The core brand colour. Used for primary actions, links, and key brand moments.

| Token | Hex | Usage |
|-------|-----|-------|
| Voyager Blue / 100 | `#CEDEEF` | Subtle backgrounds, selected/hover surfaces |
| Voyager Blue / 300 | `#6D9CD0` | Disabled-on-brand, borders |
| **Voyager Blue / 500** | `#0B5AB1` | **Primary brand / primary button / links** |
| Voyager Blue / 700 | `#07366A` | Pressed states, dark accents |
| Voyager Blue / 800 | `#042447` | Deepest brand shade |
| _(button hover)_ | `#09488E` | Primary button hover (between 500 & 700) |

### 2.2 Primary 2 — Cloudstone
| Token | Hex | Usage |
|-------|-----|-------|
| Cloudstone | `#F7F5FD` | Soft tinted section background |

### 2.3 Secondary — Sienna Flame
The accent colour. Used for secondary CTAs, highlights, and energetic moments.

| Token | Hex | Usage |
|-------|-----|-------|
| Sienna Flame / 100 | `#F2D9CF` | Tint backgrounds |
| Sienna Flame / 300 | `#D78C70` | Borders, muted accent |
| **Sienna Flame / 500** | `#BD4011` | **Secondary button / accent** |
| Sienna Flame / 700 | `#71260A` | Pressed / dark accent |
| Sienna Flame / 800 | `#4C1A07` | Deepest accent shade |

### 2.4 Semantic — Success
| Token | Hex |
|-------|-----|
| Success / 100 | `#D6E5E0` |
| Success / 300 | `#85B1A2` |
| **Success / 500** | `#337D64` |
| Success / 700 | `#1F4B3C` |
| Success / 900 | `#0A1914` |

### 2.5 Semantic — Warning
| Token | Hex |
|-------|-----|
| Warning / 100 | `#FDEECB` |
| Warning / 300 | `#F6BA65` |
| **Warning / 500** | `#E27004` |
| Warning / 700 | `#A23F02` |
| Warning / 900 | `#6C1F00` |

### 2.6 Semantic — Error
| Token | Hex |
|-------|-----|
| Error / 100 | `#F9D7D3` |
| Error / 300 | `#EE887A` |
| **Error / 500** | `#E23822` |
| Error / 700 | `#A21117` |
| Error / 900 | `#6C061B` |

### 2.7 Neutrals (warm / paper scale)
The primary surface and text scale. Warm-toned rather than pure grey.

| Token | Hex | Usage |
|-------|-----|-------|
| Neutrals / 0 | `#FFFFFF` | Base surface / white |
| Neutrals / 50 | `#F8F7F1` | Page background (off-white) |
| Neutrals / 100 | `#F1EFE2` | Cards, on-dark text, button labels |
| Neutrals / 200 | `#D9D7CB` | Borders, dividers, disabled text |
| Neutrals / 300 | `#C1BFB5` | Disabled borders |
| Neutrals / 400 | `#A9A79E` | Muted icons |
| Neutrals / 500 | `#918F88` | Placeholder text, disabled fills |
| Neutrals / 600 | `#797871` | Secondary text |
| Neutrals / 700 | `#60605A` | Body text (muted) |
| Neutrals / 800 | `#484844` | Strong body text |
| Neutrals / 900 | `#1F2A36` | Headings / primary text |

### 2.8 Support neutrals
| Token | Hex | Usage |
|-------|-----|-------|
| Neutrals-Dark / 900 | `#021330` | Near-black sections / footer / hero overlays |
| Neutrals-Light / 0 | `#FFFFFF` | White on dark |
| Neutrals-Light / 200 | `#DFE1E6` | Cool light border (cards on dark) |
| Neutrals-Mid / 500 | `#7A869A` | Cool mid-grey (secondary UI) |
| OnSurface / Primary | `#000000` | Pure-black text where required |
| OnSurface / PrimaryInverse | `#FFFFFF` | Text on dark/brand surfaces |

---

## 3. Typography

Two type families carry the brand:

- **Zodiak** — editorial serif, used for all display & headings. Always **Light (300)**.
- **Work Sans** — humanist sans, used for all body, labels & UI.

Global heading settings: line-height **1.4**, letter-spacing **0**.

### 3.1 Display & Headings — `Zodiak`, Light (300)

| Style | Desktop | Mobile | Line-height |
|-------|---------|--------|-------------|
| Title | 56 px | 36 px | 1.4 |
| H1 | 36 px | 24 px | 1.4 |
| H2 | 24 px | 20 px | 1.4 |
| H3 | 20 px | 16 px | 1.4 |
| H4 | 16 px | 14 px | 1.4 |
| H5 | 14 px | 12 px | 1.4 |

### 3.2 Body — `Work Sans`, Light (300)

| Style | Desktop | Mobile | Line-height (D / M) |
|-------|---------|--------|---------------------|
| Body / Large | 18 px | 16 px | 22 / 20 px |
| Body / Medium | 16 px | 14 px | 20 / 18 px |
| Body / Small | 14 px | 12 px | 18 / 16 px |

### 3.3 Labels — `Work Sans`, Regular (400), letter-spacing **4**

Labels are used for eyebrows, tags, and UI captions. Typically **UPPERCASE** with wide tracking.

| Style | Desktop | Mobile | Line-height (D / M) |
|-------|---------|--------|---------------------|
| Label / Large | 14 px | 12 px | 18 / 16 px |
| Label / Small | 12 px | 10 px | 16 / 14 px |

> **Note:** Button labels use the **Medium (500)** weight of Work Sans (see §4),
> a slightly heavier cut than the Regular labels above.

---

## 4. Buttons

A single Button component drives all CTAs, with these axes:

- **Type:** Primary · Secondary · Outline (a.k.a. Secondary-Grey) · Tertiary · Links
- **Size:** Large · Small
- **State:** Default · Hover · Disabled
- **Content:** Label only · Leading icon · Lagging icon · Leading + Lagging · Icon only

### 4.1 Shared specs
| Property | Value |
|----------|-------|
| Corner radius | `4px` |
| Label font | Work Sans **Medium (500)**, UPPERCASE |
| Label (Large) | 14 px / line-height 18 / tracking 0.56px |
| Label (Small) | 12 px / line-height 16 / tracking 0.48px |
| Padding — Large | `12px 24px` (py / px) |
| Padding — Small | `8px 12px` (py / px) |
| Padding — Links | none (inline text) |

### 4.2 Type styles (Default state)

| Type | Background | Text | Border |
|------|-----------|------|--------|
| **Primary** | `#0B5AB1` (Voyager Blue/500) | `#F1EFE2` | — |
| **Secondary** | `#BD4011` (Sienna Flame/500) | `#F1EFE2` | — |
| **Outline** (Secondary-Grey) | `#FFFFFF` | `#0B5AB1` | `1px #D9D7CB` |
| **Tertiary** | transparent | `#0B5AB1` | — |
| **Links** | transparent | `#0B5AB1` | — (underlined text link) |

### 4.3 States (Primary shown — apply the same logic per type)

| State | Background | Text |
|-------|-----------|------|
| Default | `#0B5AB1` | `#F1EFE2` |
| Hover | `#09488E` (darker) | `#F1EFE2` |
| Disabled | `#918F88` (Neutrals/500) | `#D9D7CB` (Neutrals/200) |

**State logic, generalised:**
- **Hover** — darken the fill (Primary → `#09488E`; Secondary → a darker Sienna; Outline/Tertiary → add a subtle tint background).
- **Disabled** — neutral grey fill `#918F88` with `#D9D7CB` text for solid buttons; muted neutral text for outline/tertiary/links.

---

## 5. Input fields

Form inputs draw from the same neutral scale.

| Property | Token / Value |
|----------|---------------|
| Label | Label/Large — Work Sans Regular, 14 px, tracking 4 |
| Input text | Body/Medium — 16 px (desktop) / 14 px (mobile) |
| Helper / hint text | Body/Small — Work Sans Light, 14 px |
| Placeholder | Neutrals/500 `#918F88` |
| Default border | Neutrals/200 `#D9D7CB` |
| Surface | Neutrals/50 `#F8F7F1` / Neutrals/0 `#FFFFFF` |
| Filled / strong text | Neutrals/800 `#484844`, Neutrals/900 `#1F2A36` |
| Error state | Error/500 `#E23822` |

---

## 6. Usage principles

- **Headings are always Zodiak Light** — never bold the serif; weight comes from size, not heaviness.
- **One primary action per view.** Use Primary (blue) for the main CTA, Secondary (sienna) sparingly for a competing or accent action.
- **Warm neutrals, not cold greys.** Default to the `Neutrals` paper scale for surfaces and text; reserve the cool `Neutrals-Light / Neutrals-Mid` set for content placed on dark or brand backgrounds.
- **Labels are wide-tracked and uppercase** (tracking 4) — use for eyebrows and tags, not for running text.
- **Semantic colours** (Success / Warning / Error) are for status only — never decorative.
- **4px corner radius** is the system default for interactive elements.

---

*Generated from the Figma design system. When the Figma file changes, re-sync the tokens above.*
