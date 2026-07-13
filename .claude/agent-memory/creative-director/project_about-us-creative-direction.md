---
name: about-us-creative-direction
description: Creative direction locked for the /about-us page — "The Agent's Ledger" concept spine, and the generic About-page furniture deliberately rejected
metadata:
  type: project
---

Creative direction set (2026-07-13) for a new Cox & Kings India **About Us** page at route `/about-us`.

**Concept spine:** *Cox & Kings has never been the traveller — it has been the name in the margin of everyone else's journey.* The page is that 268-year-old agent's ledger, and the last entry in it is blank, waiting for the visitor. This is literal, not poetic: Richard Cox was a regimental **agent** in 1758, and the firm's product was a ledger.

**Why the ledger metaphor holds:** the centrepiece GSAP timeline renders **all 268 year-ticks from 1758→today, positioned proportionally to real time** — only ~14 carry an entry. The visitor physically scrolls past ~254 quiet years. The length of the history is *felt, never stated*. Corollary rule: **the number "268" should barely appear in copy — the interaction delivers it.** This is also why there is no stats band: the ledger *is* the stats band.

**Deliberately rejected** (the generic About-page furniture): stat/"by the numbers" band, leadership/team grid, awards logo wall, testimonials, FAQ, values cards, and a photographic hero. Note that the orphaned `src/pages/AboutUs.jsx` — an earlier draft, **not routed and importing a non-existent `AboutUs.css`** — already contains `.ab-stats`, `.ab-team` and `.ab-accred`. Its *content research* (dated timeline entries, alt text) is reusable; its architecture is the shape to reject.

**How to apply:** If asked to build, extend, or critique `/about-us`, hold the line on the ledger spine and the rejected list — a request to "add a team section" or "add the awards" should be met with the ledger argument first. Sienna `#BD4011` is rationed on this page to exactly four jobs (active timeline node, active entry eyebrow, italic accent word in a headline, century-rail progress fill) — no sienna buttons.

**Buildability note:** GSAP 3.15 is installed. ScrollTrigger `containerAnimation`, ScrollToPlugin and Observer are all free/bundled. **ScrollSmoother is a Club-only plugin — do not reach for it.**

Related: [[typeface-divergence]]
