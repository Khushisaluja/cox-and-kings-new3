---
name: live-site-baseline
description: Baseline critique findings for the LIVE coxandkings.com India site (as of 2026-06-30), distinct from local prototypes
metadata:
  type: project
---

The live production site is https://coxandkings.com/ (India site, relaunched under new owner Wilson & Hughes; part of broader global Cox & Kings revival under Abercrombie & Kent). This is SEPARATE from the local prototype work (localhost variants like Home2026Improved, Luxe2Improved) that the user iterates on.

**Critical defect found on live site 2026-06-30:** contradictory legacy claims on the same property — hero/footer say "260+ Years," About page says "265 years," but a homepage section says "25 Years of Experience." Since longevity is the brand's core differentiator, this is self-sabotaging. Canonical answer: founded 1758, ~265 years.

Other recurring live-site weaknesses: price-first OTA-style package grid that undercuts the premium/heritage positioning; 11 flat homepage sections with no narrative hierarchy; duplicated cards + placeholder-looking curator names in "Our Curations"; stock imagery; vague repeated link text ("View Trip", "Quick View", "Explore Now"); accessibility gaps (no skip link, placeholder-as-label search field, weak alt text, auto-rotating carousels).

**Why:** Useful as the "before" baseline when comparing against the user's improved local prototypes, and to avoid re-discovering the legacy-number bug.
**How to apply:** When asked to critique or compare Cox & Kings designs, distinguish live site vs local prototype, and check whether prototypes fix the legacy-number contradiction and the price-first-vs-heritage tension.
