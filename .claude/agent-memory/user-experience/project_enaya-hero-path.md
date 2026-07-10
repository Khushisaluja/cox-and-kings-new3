---
name: enaya-hero-path
description: Enaya (AI travel concierge chat popup) is the primary/hero conversion path on Japan journey pages, above browse-and-filter
metadata:
  type: project
---

On the Cox & Kings Japan journey pages, "Enaya" is an AI travel concierge that opens as a chat popup (`chatOpen` state). It is treated as the HERO / primary conversion path — ranked above the two "ready-made" browse-and-filter lanes (Group tours, Private & tailor-made).

**Why:** The strategic bet is that undecided/inspired travellers convert better through guided co-creation than through self-serve filtering. The "How would you like to travel?" fork section (`#how-to-travel`, `.jj2-fork`) on `/journeys/japan-2` exists to route people to Enaya vs the two pre-filtered listing views.

**How to apply:** In any fork/decision UI on these pages, the Enaya lane should be the most visually elevated and inviting of the options. The two ready-made lanes perform an in-page action (filter the tour grid above + scroll up), so they are `<button>`s, not links — same as the Enaya trigger.
