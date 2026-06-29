# Cox & Kings — Revamped Landing Page Blueprint

**Core promise:** *Premium international holidays, expertly led and obsessively curated by one of the world's most trusted travel names.*

**Design feel:** A premium editorial travel magazine meets a trusted Indian concierge. Spacious, cinematic, confident, warm. Generous whitespace, soft-but-visible CTAs, human concierge cues throughout. Mobile-first, low cognitive load. **Not** an OTA.

**Design system (reuse existing tokens):**
- Voyager Blue 800 `#042447` / 700 `#07366A` / 500 `#0B5AB1`; Sienna Flame `#BD4011` (the single warm accent for primary CTAs); Cloudstone `#F7F5FD` and Neutral 50 `#F8F7F1` as section grounds; Neutral 900 `#1F2A36` for text.
- Headings: **IvyJournal** Light (300). Body/buttons: **Work Sans**. Labels/eyebrows: **Mozaic HUM**, 4px letter-spacing, uppercase.
- Existing class namespace `.nh-` continues. New blocks introduced below.

**The 7 pillars:** Legacy · Trust · Expertise · Curation · Service · Ease · Proof.
**The 6 homepage jobs:** (1) establish brand above fold · (2) segment the visitor · (3) show strongest destinations · (4) prove trust high up · (5) create desire (editorial) · (6) capture intent-based leads.
**The 8 segments:** S1 Legacy-reassurance · S2 Premium group-tour buyer · S3 Bespoke buyer · S4 Destination-decided searcher · S5 Undecided/inspired · S6 Price comparer · S7 Senior/parent-led · S8 Repeat/referral.

---

## 1. Section-by-Section Blueprint (top → bottom)

### 0. Header / Nav (persistent)
- **Purpose:** Orientation + permanent escape hatch to a human.
- **Pillars/Job/Segments:** Legacy, Service · Job 1 · all segments (esp. S1, S7).
- **Copy:**
  - Utility tagline: `One of the world's most trusted travel names · Since 1758`
  - Persistent CTA (top-right, always visible): **Talk to an Expert** (with phone glyph; expands to "Speak to a Travel Expert" on desktop).
- **Layout:** Two-tier sticky header. Tier 1 white brand bar: logo · tagline · phone CTA. Tier 2 Voyager-Blue offerings bar: *Group Tours · Bespoke Holidays · Destinations · Experiences · About* with hover mega-menus. On scroll, tiers condense into one slim blue bar that keeps the logo + Talk to an Expert. Concierge phone number visible on desktop.

---

### 1. Hero — Brand statement + primary routing
- **Purpose:** In one screen answer who/why-trust/what/what-next. Lead with the promise; offer the three primary paths.
- **Pillars/Job/Segments:** Legacy + Trust + Curation + Expertise · Jobs 1, 2 · all (entry point).
- **Copy:**
  - Eyebrow: `SINCE 1758 · THE WORLD'S MOST TRUSTED TRAVEL NAME`
  - H1: **The world's most awaited travel brand, reimagined for the Indian traveller.**
  - Subcopy: *Premium escorted group tours and bespoke international holidays — crafted with 260 years of travel legacy, expert-led planning, and an obsessive eye for detail. We handle everything; you simply travel well.*
  - Buttons: **Explore Group Tours** (primary, Sienna) · **Design a Bespoke Holiday** (primary outline) · **Talk to an Expert** (text + phone glyph).
  - Trust strip under buttons: `4.7★ from 1M+ travellers · 70% travel with us again · 90% visa success · As featured in Condé Nast, T+L, NatGeo`
- **Layout:** Full-bleed cinematic hero image (slow Ken-Burns; rotating set: Swiss alp rail, Kyoto blossom, Maasai Mara). Dark gradient scrim bottom-left for text legibility. Left-aligned editorial copy column. Two solid CTA buttons + one quiet text CTA. Thin inline trust strip directly beneath. Scroll cue. *(Two interchangeable hero treatments — Variant A and A2 — specified in Section 4.)*

---

### 2. The 4-Path Router — "Where shall we begin?"
- **Purpose:** Segment every visitor into one of four intent paths within seconds; rescue the undecided.
- **Pillars/Job/Segments:** Service + Curation + Ease · Job 2 · S2, S3, S5, S7 (+ all).
- **Copy:**
  - Eyebrow: `START HERE`
  - H2: **Tell us how you like to travel.**
  - Sub: *Four ways in. Every one leads to a real travel expert — never a call centre.*
  - (Four cards — full copy in Section 3.)
- **Layout:** Four equal editorial cards on a calm Cloudstone ground, each with a small line illustration/photo, title, one-line description, and a soft underlined CTA. Card 3 ("Find My Perfect Trip") gets a subtle accent ring so the undecided feel caught. Stacks to a single column / horizontal swipe on mobile, most-popular card first.

---

### 3. Trust Bar — Proof, high up
- **Purpose:** Prove the brand is real and trusted *before* asking anyone to browse. Believably framed.
- **Pillars/Job/Segments:** Trust + Legacy + Proof · Job 4 · S1, S6, S7, S8.
- **Copy:**
  - Eyebrow: `WHY TRAVELLERS TRUST US`
  - Four stat tiles:
    - **260 years** — *of travel heritage, since 1758*
    - **1M+ travellers** — *guided across the world*
    - **70% return** — *of our guests travel with us again*
    - **90% visa success** — *paperwork handled end to end*
  - Footer line: *Top-rated on Google & TripAdvisor · Award-winning · Members of IATA, TAAI & ASTA.*
- **Layout:** Slim horizontal band on Voyager-Blue 800, four stat tiles divided by hairlines, large IvyJournal numerals over small Mozaic labels. Association/award logos in a muted single row beneath. Quiet, confident, no clutter.

---

### 4. Strongest Destinations — "Where the world is open to you"
- **Purpose:** Show the flagship destinations; capture destination-decided searchers immediately.
- **Pillars/Job/Segments:** Curation + Expertise · Job 3 · S4, S5.
- **Copy:**
  - Eyebrow: `DESTINATIONS WE KNOW BY HEART`
  - H2: **Where the world is open to you.**
  - Sub: *Hand-picked countries our specialists travel, vet and re-walk every season — so the version you experience is the best one.*
  - Tiles (image + name + one specialist hook):
    - **Switzerland** — *Glacier trains & lakeside towns*
    - **Japan** — *Cherry blossom, bullet trains, ryokans*
    - **Italy** — *Amalfi, Tuscany & the lakes*
    - **Scandinavia & the Northern Lights** — *Arctic skies, fjord nights*
    - **Australia & New Zealand** — *Reef, road trips & family time*
    - **USA** — *Coast to coast, the great parks*
    - **Southeast Asia** — *Islands, temples & street food*
    - **Maldives** — *Overwater calm*
    - **Africa Safaris** — *The Great Migration, up close*
    - **Grand Europe** — *Many countries, one seamless journey*
  - CTA: **See All Destinations** →
- **Layout:** Editorial mosaic of varied-height image tiles (magazine grid, not uniform cards). Destination name in IvyJournal, specialist hook on hover/below. Horizontal scroll-snap rail on mobile. Each tile routes to that destination's tours.

---

### 5. How We Travel — the four ways (offer clarity)
- **Purpose:** Make the product model explicit: escorted group, tailor-made, luxury, special-interest. Reinforce router.
- **Pillars/Job/Segments:** Curation + Expertise + Service · Jobs 1, 2 · S2, S3.
- **Copy:**
  - Eyebrow: `HOW WE TRAVEL`
  - H2: **Two ways to go. Both, unmistakably Cox & Kings.**
  - Cards:
    - **Escorted Group Tours** — *Travel in fine company with an expert tour manager who handles every detail. Premium hotels, paced for comfort, Indian meals on request.* → **Explore Group Tours**
    - **Bespoke Private Holidays** — *Your itinerary, your pace, designed one-to-one with a destination specialist. Nothing off-the-shelf.* → **Design a Bespoke Holiday**
    - **Luxury Journeys** — *The finest stays, private guides and exclusive access in the world's most extraordinary places.* → **Explore Luxury**
    - **Special Interest & Family** — *Honeymoons, multi-gen family trips, safaris and cruises — built around the people travelling.* → **Find My Trip**
- **Layout:** Two large hero cards (Group + Bespoke) above, two narrower cards below. Full-bleed imagery with dark-to-clear gradient, title + 1–2 lines + soft CTA. Generous gutters.

---

### 6. The Cox & Kings Difference — Expertise + Ease
- **Purpose:** Explain *why* we're worth a premium: experts + everything-handled. The reassurance spine.
- **Pillars/Job/Segments:** Expertise + Service + Ease · Jobs 1, 5 · S1, S2, S3, S6, S7.
- **Copy:**
  - Eyebrow: `THE COX & KINGS DIFFERENCE`
  - H2: **Experts plan it. We handle everything. You simply travel.**
  - Three reassurance pillars:
    - **Specialists, not salespeople** — *Your trip is shaped by someone who has actually walked it. Destination specialists and seasoned tour managers, not a booking desk.*
    - **Everything, handled** — *Flights, visas, hotels, transfers, insurance and experiences — coordinated end to end. One team, one point of contact.*
    - **Looked after, all the way** — *Concierge planning before you go and real on-trip support after you land — including a WhatsApp line to your team.*
  - Indian-traveller assurance strip: `Senior-friendly pacing · Indian & dietary meal options on request · Multi-generational family travel · Visa support with 90% success`
  - CTA: **Talk to an Expert** →
- **Layout:** Three columns each with a fine-line icon, short title, two-line body. Beneath, a warm full-width assurance ribbon (Sienna-tinted) carrying the four Indian-traveller specifics as pill chips. A small concierge portrait/quote anchors the human cue.

---

### 7. Editorial Desire Module — "Journeys worth dreaming about"
- **Purpose:** Create desire for the undecided/inspired through seasonal, story-led journeys.
- **Pillars/Job/Segments:** Curation + Proof · Job 5 · S5, S2, S4.
- **Copy:**
  - Eyebrow: `IN SEASON NOW`
  - H2: **Journeys worth dreaming about.**
  - Sub: *Timed to the season, built for the moment — our experts' favourite ways to see the world right now.*
  - Featured stories:
    - **Cherry Blossom Japan** — *Two weeks, one fleeting bloom* · *Mar–Apr*
    - **Chasing the Northern Lights** — *Arctic Scandinavia after dark* · *Oct–Mar*
    - **Grand Europe** — *Many countries, one effortless journey*
    - **New Zealand by Road** — *The South Island, end to end*
    - **African Safari** — *The Great Migration season* · *Jul–Oct*
    - **European Christmas Markets** — *Mulled wine & old-town lights* · *Dec*
    - **Summer in Switzerland** — *Glacier trains & alpine lakes* · *Jun–Sep*
    - **Australia for Families** — *Reef, beaches & easy days*
  - CTA per card: **Read the Journey** → · Section CTA: **See All Journeys** →
- **Layout:** Magazine feature spread — one large lead story (Cherry Blossom Japan) with a long editorial caption, then a 2-column gallery of the rest. Season tag chips. IvyJournal titles, photographic, airy. Horizontal scroll on mobile.

---

### 8. Proof — Real travellers, real photos
- **Purpose:** Hard social proof from real guests; convert the price-comparer and reassure the family decision-maker.
- **Pillars/Job/Segments:** Proof + Trust + Service · Jobs 4, 5 · S6, S7, S8, S1.
- **Copy:**
  - Eyebrow: `TRAVELLER STORIES`
  - H2: **Real journeys, in their own words.**
  - Sub: *Photos and reviews from the people who travelled — tap any photo to relive the moment.*
  - Repeat-customer banner: *7 in 10 of our travellers come back. Here's why.*
  - (Existing testimonial carousel + photo lightbox reused; keep real, specific, named reviews.)
  - CTA: **Read More Reviews** →
- **Layout:** Reuse the existing review gallery + quote + lightbox block. Add a thin repeat-customer banner above it and aggregate-rating chip (`4.7 ★ · 2,400+ reviews`). Photo-led, warm.

---

### 9. As Seen In — Media & associations
- **Purpose:** Borrowed authority; cements trust for skeptics.
- **Pillars/Job/Segments:** Trust + Proof · Job 4 · S1, S6.
- **Copy:** Label `AS SEEN IN` · logos: Condé Nast Traveller, Travel + Leisure, National Geographic, Forbes, The Times, Outlook Traveller. Below: `Proud members of IATA · TAAI · ASTA`.
- **Layout:** Quiet single muted logo row on Neutral 50, low contrast, lots of air. (Reuse existing press band.)

---

### 10. Expert-Recommended Curations — Specialist-picked trips
- **Purpose:** Convert browsers to a specific itinerary; show curation + transparent pricing for the comparer.
- **Pillars/Job/Segments:** Curation + Expertise · Jobs 3, 6 · S2, S4, S6.
- **Copy:**
  - Eyebrow: `OUR CURATIONS`
  - H2: **Journeys our experts recommend.**
  - Sub: *Tried, tested and personally vetted by the specialists who design them — with a named expert behind every trip.*
  - Cards keep: category · name · duration · specialist note (named) · from-price · **View Itinerary** →
- **Layout:** Reuse curation card grid. Add a named specialist avatar + "Designed by [Name]" line to each card to humanise. From-price shown plainly to disarm price-comparers.

---

### 11. Lead Capture — "Find My Perfect Trip" / Plan with us
- **Purpose:** Capture high-quality, intent-based leads — the page's main conversion (Job 6).
- **Pillars/Job/Segments:** Service + Ease + Expertise · Job 6 · S3, S5, S7 (+ all).
- **Copy:**
  - Eyebrow: `PLAN WITH US`
  - H2: **Not sure where to begin? Let's find your trip together.**
  - Sub: *Tell us a little about the holiday you have in mind. A destination specialist will come back to you within 24 hours — no obligation, no call centre.*
  - Micro-form (low friction, progressive): *Where to?* (or "Help me decide") · *Group tour or bespoke?* · *Roughly when?* · *Travellers* · *Name & WhatsApp/email.*
  - Reassurance line: *We'll only use this to plan your trip. No spam, ever.*
  - Buttons: **Find My Perfect Trip** (primary) · **Or talk to an expert now** (phone).
- **Layout:** Two-column block on Voyager-Blue ground: left, the inviting copy + a small concierge photo and "Your specialist replies within 24h"; right, a clean carded form with large soft fields. The "Where to?" field accepts "I'm not sure yet — help me decide" to catch S5. Sticky mobile mini-CTA bar (Talk to an Expert / Plan My Trip) appears after this section.

---

### 12. Footer
- **Purpose:** Deep navigation, trust reinforcement, contact.
- **Pillars/Job/Segments:** Legacy + Trust + Service · Jobs 1, 6 · all.
- **Copy:** Brand line `260+ years of travel, trusted by generations.` · contact (phone, email, WhatsApp) · Explore / About / Partner columns · legal. (Reuse existing footer.)
- **Layout:** Existing dark footer; add a WhatsApp contact line and a single rating/association reassurance row at the very bottom.

**Floating elements (persistent):** Concierge chat/WhatsApp widget (existing ChatBot) bottom-right; sticky "Talk to an Expert / Plan My Trip" bar on mobile after Section 11.

---

## 2. Pillar Coverage Map

| Pillar | Where it's expressed (sections) |
|---|---|
| **Legacy** (260 yrs) | Header tagline · Hero eyebrow/H1 · Trust Bar (260 years tile) · Footer |
| **Trust** (1M+, ratings, awards, media, associations) | Hero trust strip · Trust Bar (stats + assoc. logos) · Proof (rating chip) · As Seen In · Footer |
| **Expertise** (specialists & tour managers) | Hero · How We Travel · C&K Difference ("specialists not salespeople") · Curations ("Designed by [Name]") |
| **Curation** (designed journeys) | 4-Path Router · Strongest Destinations · How We Travel · Editorial Desire Module · Curations |
| **Service** (concierge planning + on-trip support) | Header CTA · 4-Path Router ("real expert, never a call centre") · C&K Difference ("looked after all the way") · Lead Capture · Footer/WhatsApp |
| **Ease** (flights, visas, hotels, transfers, insurance, experiences) | Hero subcopy ("we handle everything") · Trust Bar (90% visa) · C&K Difference ("everything, handled") · Lead Capture |
| **Proof** (testimonials, photos, reviews, repeat) | Hero trust strip · Editorial module · Proof section (reviews + photos + 70% repeat) · As Seen In · Curations (specialist notes) |

---

## 3. The 4-Path Router — Card Spec

Block heading: **Tell us how you like to travel.** · *Four ways in. Every one leads to a real travel expert — never a call centre.*

| # | Card title | Description copy | CTA | Serves |
|---|---|---|---|---|
| 1 | **Travel in a Group** | *Premium escorted tours led by an expert manager — fixed departures, everything handled, fine company along the way.* | **Explore Group Tours** | S2, S7 |
| 2 | **Design It Around You** | *A bespoke private holiday shaped one-to-one with a destination specialist. Your pace, your people, your way.* | **Design a Bespoke Holiday** | S3 |
| 3 | **Help Me Decide** *(accent ring)* | *Not sure yet? Answer a few quick questions and we'll match you to the right journey — and the right expert.* | **Find My Perfect Trip** | S5 |
| 4 | **Just Talk to Someone** | *Skip the browsing. Speak to a real travel expert who'll plan it with you — by phone or WhatsApp.* | **Talk to an Expert** | S1, S7, S8 |

Card 1 → /tours?type=escorted · Card 2 → /tours?type=bespoke (or bespoke enquiry) · Card 3 → quiz / scrolls to Lead Capture · Card 4 → /contact + tel/WhatsApp.

---

## 4. Hero Variants (both lead with the brand promise)

### Variant A — Image hero + classic destination/date search *(revamp of Final2-style)*
- **Concept:** Cinematic full-bleed image with brand statement, then a classic structured search widget (Destination · Travel type · Dates · Travellers). For visitors who already want to browse inventory (S4, S6).
- **Copy:**
  - Eyebrow: `SINCE 1758 · ONE OF THE WORLD'S MOST TRUSTED TRAVEL NAMES`
  - H1: **Premium international holidays, expertly led and obsessively curated.**
  - Sub: *The world's most awaited travel brand, reimagined for the Indian traveller — escorted group tours and bespoke journeys built on 260 years of legacy and expert-led planning.*
  - Search widget fields: **Where to?** · **Group or Bespoke?** · **When?** · **Travellers** · button **Search Journeys**.
  - Below widget — quiet links: *Explore Group Tours · Design a Bespoke Holiday · Talk to an Expert.*
  - Trust strip: `4.7★ · 1M+ travellers · 70% return · 90% visa success`
- **Layout:** Hero image with bottom gradient; left-aligned copy column; a single horizontal search bar floating over the lower third (stacks vertically on mobile). Trust strip pinned just beneath the search bar. Three text CTAs sit under the bar as the explicit path routing.

### Variant A2 — Directed Where / What / When search hero *(revamp of Final2a-style)*
- **Concept:** Brand statement + a guided, intent-led search (Where · What · When) with a typewriter prompt and curated suggestion lists — softer, inspiration-friendly for the undecided (S5) while still serving searchers.
- **Copy:**
  - Eyebrow: `SINCE 1758 · THE WORLD'S MOST AWAITED TRAVEL BRAND, REIMAGINED FOR INDIA`
  - H1: **Premium international holidays, expertly led and obsessively curated.**
  - Sub: *260 years of legacy. Expert-led planning. Everything — flights, visas, hotels, transfers — handled, so you simply travel well.*
  - Directed search:
    - **Where do you want to go?** (typewriter cycles: *Switzerland · Japan · Northern Lights · Italy · Australia · Maldives · African Safari*; list of strongest destinations)
    - **What kind of trip?** (Group Tour · Bespoke Private · Luxury · Family · Honeymoon · Safari · Cruise)
    - **When?** (Anytime · Next 3 months · In season now · 2027 & beyond)
    - button **Find My Trip**
  - Under search — primary path buttons: **Explore Group Tours** · **Design a Bespoke Holiday** · **Talk to an Expert.**
  - Trust strip: `4.7★ from 1M+ travellers · 70% travel with us again · 90% visa success · As seen in Condé Nast, T+L, NatGeo`
- **Layout:** Same cinematic image base. Centered (or left) editorial copy; a three-segment pill search bar with animated placeholder; the three primary CTA buttons directly beneath as the explicit 3-path router from the brief. Scroll cue. Reuses the existing typewriter + datalist mechanics.

**Recommendation:** Ship Variant A2 as default (it doubles as routing + inspiration and best fits the undecided-heavy Indian outbound audience); keep Variant A as an A/B test for search-intent traffic.

---

## 5. New Components the Build Will Need

1. **`PathRouter`** — the 4-card visitor-segmentation block (Section 2 / Section 3 spec), with one accent "Help Me Decide" card.
2. **`TrustBar`** — slim Voyager-Blue stat band (4 numeral tiles + association/award logo row), reusable above and below the fold.
3. **`DestinationMosaic`** — magazine-style varied-height destination tiles with specialist hooks + mobile scroll-snap rail.
4. **`HowWeTravel`** (offer block) — 2 large + 2 small imagery cards mapping to Group / Bespoke / Luxury / Special-interest paths.
5. **`DifferenceTriptych`** — Expertise/Ease/Service three-column reassurance block + Indian-traveller assurance ribbon (pill chips) + concierge portrait/quote.
6. **`EditorialDesire`** — seasonal story spread (1 lead feature + gallery) with season tag chips.
7. **`SpecialistBadge`** — small "Designed by [Name]" avatar+name element to drop into curation/tour cards.
8. **`LeadCaptureForm`** — low-friction progressive enquiry form with "Help me decide" option, 24h-reply reassurance, WhatsApp field; posts a qualified lead.
9. **`HeroSearch` (configurable)** — single component supporting Variant A (Destination/Type/Date/Travellers) and Variant A2 (directed Where/What/When + typewriter) via prop, plus the trust strip and 3 primary path CTAs.
10. **`StickyCTABar`** (mobile) — persistent "Talk to an Expert / Plan My Trip" bar after the lead-capture section.
11. **`AssuranceRibbon`** — reusable Sienna-tinted pill strip for Indian-traveller specifics (senior pacing, Indian meals, multi-gen, visa).
12. **`RatingChip`** — aggregate-rating pill (`4.7★ · 2,400+ reviews`) for hero + proof reuse.

*(Reuse as-is: existing nav/header, `FeaturedDestinations`/`FeaturedTours` where useful, the review gallery + lightbox, the press band, footer, and `ChatBot`.)*
