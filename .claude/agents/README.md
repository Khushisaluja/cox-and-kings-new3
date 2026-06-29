# Cox & Kings — Customer Persona Panel (UX testing agents)

Four roleplay personas distilled from the manager's post-Covid Indian outbound
research brief. Each one acts as a real customer doing user testing: give it a
design (a running URL, screenshots, or a page) and it returns an in-character UX
critique — what built or broke trust, where it would drop off, whether it would
convert, and concrete changes in its own voice. They do **not** write code.

Together they cover all 8 strategic segments and the 4 main site paths.

| Agent | Persona | Segments covered |
|-------|---------|------------------|
| `persona-rajesh-grouptour` | Rajesh, 44, Bengaluru — Europe group tour for parents + family | Premium group buyer, price comparer, senior/parent-led |
| `persona-ananya-bespoke` | Ananya, 33, Hyderabad — design-literate, Instagram-inspired, wants tailor-made | Bespoke buyer, undecided/inspired |
| `persona-sunita-trust` | Sunita, 58, Delhi — remembers the old brand, cautious, low tech comfort | Legacy reassurance, senior, repeat/referral |
| `persona-karan-comparer` | Karan, 29, Mumbai — mobile-first, high-intent, fast to bounce | Destination searcher, price comparer |

## How to run a review

Point each persona at the design you want tested, e.g.:

> Use the persona-rajesh-grouptour agent to review http://localhost:5001/final2

Or run the whole panel on a design and compare. Each returns the same review
structure (First impression → journey → trust → drop-off → would-I-act → changes
→ scores /10), so feedback is comparable across personas.

Tips:
- For visual critique, give them screenshots (they Read images). For copy/structure
  critique they can also fetch a running URL.
- Tell Karan he's on mobile if you want a mobile-specific read (that's his default).
- After finalising a design and making changes, re-run the panel to see if scores
  move.

## Notes
- Personas are intentionally distinct and a little demanding — they praise only
  what earns it, so treat low scores as signal, not failure.
- Edit the `.md` files to refine a persona's budget, trip, or priorities as the
  product and segments sharpen.
