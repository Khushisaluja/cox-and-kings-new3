---
name: luxe2-improved
description: Karan's standing verdict on the /luxe2-improved luxury homepage prototype + the two concrete issues to recheck on future passes
metadata:
  type: project
---

Reviewed `/luxe2-improved` (src/pages/Luxe2Improved.jsx) as Karan the price-comparer. Standing verdict: strong, ~8/10. It does the thing competitors hide — per-person "from" prices on every card with NO form, a clean Private/Bespoke vs Escorted Group toggle, and concrete inclusions (return flights, max-20 group, veg/Jain meals, central 4*/5* hotels, dedicated tour manager) that make the "why pay more than MakeMyTrip/SOTC" case implicitly.

**Why:** This is the persona panel's preferred homepage direction. Future reviews should stay consistent with this baseline rather than re-deriving from scratch.

**How to apply:** When asked to re-review luxe2-improved, re-check these specific gripes I raised so feedback stays consistent:
1. Trust-number mismatch — FIXED (re-verified 2026-06-30). Hero now reads 4.9 / "from 2,400+ verified reviews"; reviews section reads 4.9/5 from 2,400+ with a platform breakdown (4.8 Google · 4.9 Tripadvisor) that explains the aggregate. Group-card review counts (1180+640+520≈2,340) now ladder up coherently. Consistent.
2. Mobile hero search overflow — FIXED (re-verified 2026-06-30). At ≤700px search is max-width 480px centered; ≤860px fields flex-wrap to full-width with full-width Search button; container is calc(100%-32px). No clip. Mobile thumb-bar no longer clips footer (footer padding-bottom:104px clearance). Both confirmed in CSS.
3. STILL OPEN — no day-by-day itinerary anywhere; "View itinerary" on every card still jumps to #contact. Content gap.
4. STILL OPEN — hero is ~92svh + heritage-first headline ("Discover the World in Luxury & Style"), not destination+price. Compensated by search + quick picks + 4.9 rating.
5. NEW (2026-06-30) — "Two ways to travel": Escorted Group leads & is highlighted (good), but the "Private & Bespoke" card is a placeholder whose onClick is preventDefault — it looks tappable but does nothing, so I can't compare the two paths. Dead second path.
6. NEW (2026-06-30) — hero quick-picks (Japan/Europe/Maldives/Safari/Rajasthan) all just scroll to #curated; they don't filter to the destination I tapped. Tapping "Japan" gives a generic 3-card scroll, not Japan results.
7. STILL OPEN — no explicit "why us vs cheaper (MMT/SOTC)" comparison panel. Inclusions + money-safety strip imply value but never state it head-to-head. Group prices ₹2.55–2.95L pp sit at/above my ₹1.5–2.5L band.

**Standing verdict update (2026-06-30):** Re-scored UP to 8.5/10 — 3 flagged issues fixed (number mismatch, mobile search overflow, thumb-bar clip) plus the group-lead reorder and decluttered, now-distinct escorted cards. Held back from 9 by the dead Bespoke path, no itinerary, and still-missing why-us-vs-cheaper panel.

See sibling persona memories [[luxe2-homepage]] [[luxe2-vs-improved]] under persona-ananya-bespoke for cross-persona context.
