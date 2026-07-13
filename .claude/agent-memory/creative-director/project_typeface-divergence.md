---
name: typeface-divergence
description: design.md names Zodiak as the display serif, but current house style on new pages is Cormorant Garamond — design.md is stale on type, authoritative on colour
metadata:
  type: project
---

`design.md` is the stated source of truth and is **authoritative on colour, radius (4px), buttons and spacing** — but it is **stale on typography**. It specifies Zodiak Light 300 for all display/headings. The current house direction on new pages is **Cormorant Garamond (display) + Work Sans (body/UI)**.

**Why:** `src/pages/NewTypography.css` scopes a `--serif` override to `.new-typo` precisely so the ~18 older routes on the shared `h26-`/`hi-`/`lx2i-`/`jl-` stylesheets keep Zodiak, while the new composite homepage (`/`, `src/pages/New.jsx`) runs Cormorant. Both families are already loaded via Google Fonts in `index.html` (Cormorant 300–700 incl. italics; Work Sans 300–700) — no new font loading is ever needed.

**How to apply:** For any NEW page, use Cormorant Garamond + Work Sans, and scope the override rather than editing shared stylesheets. Cormorant renders lighter/more delicate than Zodiak, so italic accent words inside headings must be bumped to **700 italic** or they vanish at light weights (this is why `.wr-accent` / `strong` get `font-weight: 700` in NewTypography.css). Also: design.md's global heading line-height of 1.4 goes limp at display sizes — tighten to ~1.15 for large display type and treat that as a documented, deliberate deviation.

Related: [[about-us-creative-direction]]
