---
name: improved-homepage-round2
description: My (Ananya, bespoke buyer) reactions to the revamped Cox & Kings homepage at /improved — round-2 fixes plus a round-3 code check of what's still unaddressed
metadata:
  type: project
---

Reviewed the revamped homepage (http://localhost:5173/improved) via full-page + bespoke-flow screenshots. This revamp was built largely off my round-1 feedback ([[homepage-localhost-5173]]).

**Round-1 flaws — status:**
1. "Specialists, not salespeople" overlap (my #1) — FIXED. Clean two-column editorial block. Did the most for my trust.
2. Hero leading with Group Tour / ₹95,000 — PARTLY FIXED. Hero copy now names private trip, but search bar STILL defaults Style to "Group Tour."
3. Prices stamped on every card — PARTLY FIXED. Split by lane, but DESTINATION grid tiles still carry "from ₹X/person."
4. Stock-feeling images — mostly resolved.
6. Final CTA — WhatsApp now leads (good), Request-a-callback secondary.

**The headline win:** "Design it around you" LEADS the fork, image-led, no price, START DESIGNING. 4-step flow (Where/Who/Style/What matters+budget), no email at door, ends on named specialist match (Arjun Rao) + sample itinerary teaser + WhatsApp-this-brief. This converts me.

**Round-3 code check (2026-06): three snags UNCHANGED in src/pages/Home2026Improved.jsx —**
- Hero `style` state still inits to `HERO_TRIP_TYPES[0]` = 'Group Tour' (line 234 / v3content.js:157).
- Destination tiles still render `d.priceFrom` "from ₹X / person" (line 556).
- Match end-state still text-only: specialist headshot + day-list, NO real photos of the ryokan/room/sushi counter (lines 200-220). My ask for proof-of-the-bed not done.

**My remaining asks:** fix hero Style default; strip price off destination tiles; add 2-3 real stay photos to the match end-state; give Italy a flow end-state as rich as Japan's.

**Would I act now:** Yes. Run flow, land on Arjun, WhatsApp the brief, then book the call.

Scores: Taste 8.5 · Bespoke 8.5 · Inspires 9 · Clarity 8.5 · Confidence-to-enquire 9. See [[homepage-localhost-5173]].
