import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import New3 from './pages/New3';
/* TEMP — restored design explorations for local review only. Not part of the
   live site; remove these three imports + routes before shipping. */
import Home2026Improved from './pages/Home2026Improved';
import Home2026Improved2 from './pages/Home2026Improved2';
import Luxe2Improved from './pages/Luxe2Improved';
import Journeys4 from './pages/Journeys4';
import Journeys4Group from './pages/Journeys4Group';
import Journeys4Private from './pages/Journeys4Private';
import JapanJourneys2 from './pages/JapanJourneys2';
import Adventure from './pages/Adventure';
import CityJourneys from './pages/CityJourneys';
import JapanTourLuxe5 from './pages/JapanTourLuxe5';
import ThailandEscape2 from './pages/ThailandEscape2';
import AboutUs from './pages/AboutUs';
import Team from './pages/Team';
import VisionMission from './pages/VisionMission';
import Careers from './pages/Careers';
import CareerRole from './pages/CareerRole';
import Inspiration from './pages/Inspiration';
import InspirationArticle from './pages/InspirationArticle';
import PrivateItaly from './pages/PrivateItaly';
import GroupJapan from './pages/GroupJapan';
import GiftVouchers from './pages/GiftVouchers';
import PreferredPartner from './pages/PreferredPartner';
import PressMedia from './pages/PressMedia';
import Testimonials from './pages/Testimonials';
import Collaborate from './pages/Collaborate';
import Franchise from './pages/Franchise';
import Mice from './pages/Mice';
import Terms from './pages/Terms';
import Sitemap from './pages/Sitemap';
import Faq2 from './pages/Faq2';
import NotFound404 from './pages/NotFound404';
import { ScheduleCallProvider } from './components/ScheduleCall';
import { EinayaProvider } from './components/Einaya';

/* A new route always starts at the top — except when the link carried a hash
   ("/#reviews"), where we scroll to that section once it has been painted.
   Browser scroll restoration is turned off: on the GSAP-pinned pages it would
   otherwise drop an arriving visitor into the middle of the page.

   The jump to the top must be INSTANT: html has scroll-behavior: smooth, so a
   plain scrollTo(0,0) animates all the way up from wherever the footer link
   was clicked — and on pages that re-measure themselves while mounting (GSAP
   refresh, images sizing) the animation gets cut short, landing the visitor
   mid-page. Only the in-page hash scroll stays smooth. */
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
  }, []);
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (!hash) return undefined;
    const raf = requestAnimationFrame(() => {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname, hash]);
  return null;
}

function NotFound() {
  const { pathname } = useLocation();
  /* Two kinds of not-yet-built page land here:
     - /tour-detail-<id> — a tour card whose product page isn't built yet;
     - /vibe/<slug>       — a "What's your vibe?" theme page that isn't built.
     Detect each so the copy speaks to it, and surface the live example page(s)
     a developer can open to see the intended layout. */
  const isTour = pathname.startsWith('/tour-detail-');
  const isVibe = pathname.startsWith('/vibe/');
  const heading = isVibe ? "This page isn't ready yet"
    : isTour ? "This tour's page isn't built yet"
      : 'Page Not Found';
  const copy = isVibe
    ? "We haven't built this vibe's page yet. The Adventure collection is the live example of the intended layout — see it below."
    : isTour
      ? "We haven't created a detailed page for this journey yet. Two example product pages are live below."
      : "The page you're looking for doesn't exist.";
  return (
    <main style={{ paddingTop: 140, paddingBottom: 80, textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: 'var(--color-navy)', margin: 0 }}>
        {heading}
      </h2>
      <p style={{ color: 'var(--color-text-light)', fontSize: '1rem', maxWidth: 460 }}>
        {copy}
      </p>
      <a href="/" className="btn-primary">Return to Home</a>

      {/* Dev-facing reference: the live example page(s) for the intended layout. */}
      {isVibe && (
        <div style={{ marginTop: 24, padding: '18px 22px', border: '1px dashed var(--color-border, #d7ddea)', borderRadius: 12, maxWidth: 480, textAlign: 'left' }}>
          <p style={{ textTransform: 'uppercase', letterSpacing: '0.16em', fontSize: '0.7rem', color: 'var(--color-text-light)', margin: '0 0 10px' }}>
            For developers · example vibe page
          </p>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li>
              <a href="/adventure" style={{ color: 'var(--color-navy)', fontWeight: 600 }}>
                Adventure — live example
              </a>
              <span style={{ color: 'var(--color-text-light)', fontSize: '0.85rem' }}> · /adventure</span>
            </li>
          </ul>
        </div>
      )}

      {isTour && (
        <div style={{ marginTop: 24, padding: '18px 22px', border: '1px dashed var(--color-border, #d7ddea)', borderRadius: 12, maxWidth: 480, textAlign: 'left' }}>
          <p style={{ textTransform: 'uppercase', letterSpacing: '0.16em', fontSize: '0.7rem', color: 'var(--color-text-light)', margin: '0 0 10px' }}>
            For developers · example tour pages
          </p>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li>
              <a href="/tour-detail-japan-5" style={{ color: 'var(--color-navy)', fontWeight: 600 }}>
                Japan — FIT, luxe
              </a>
              <span style={{ color: 'var(--color-text-light)', fontSize: '0.85rem' }}> · /tour-detail-japan-5</span>
            </li>
            <li>
              <a href="/tour-detail-thailand-2" style={{ color: 'var(--color-navy)', fontWeight: 600 }}>
                Thailand — GIT, low budget
              </a>
              <span style={{ color: 'var(--color-text-light)', fontSize: '0.85rem' }}> · /tour-detail-thailand-2</span>
            </li>
          </ul>
        </div>
      )}
    </main>
  );
}

/* Where the homepage search lands when a traveller picks a specific destination
   whose country page isn't built yet. Japan is the only one live today, so this
   says so plainly rather than quietly dropping them on the Japan page. The place
   they searched arrives as ?dest= for the copy. */
function ComingSoon() {
  const { search } = useLocation();
  const dest = new URLSearchParams(search).get('dest');
  return (
    <main style={{ paddingTop: 140, paddingBottom: 80, textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <p style={{ textTransform: 'uppercase', letterSpacing: '0.18em', fontSize: '0.75rem', color: 'var(--color-text-light)' }}>Coming soon</p>
      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: 'var(--color-navy)', margin: 0 }}>
        {dest ? `Our ${dest} page isn't ready yet` : "That destination isn't ready yet"}
      </h2>
      <p style={{ color: 'var(--color-text-light)', fontSize: '1rem', maxWidth: 460 }}>
        We're still crafting this destination. Right now, our Japan collection is fully live —
        explore it while we finish the rest.
      </p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <a href="/journeys/japan-2" className="btn-primary">Explore Japan</a>
        <a href="/" className="btn-primary" style={{ background: 'transparent', color: 'var(--color-navy)', border: '1px solid var(--color-navy)' }}>Return to Home</a>
      </div>
    </main>
  );
}

/* This is the live site — everything routed below ships, and nothing else is
   kept. The earlier design explorations (the /final*, /luxe*, /modern*,
   /improved*, /home2026 and /new* homepages; the /journeys 1–3 listings; the
   /tour-detail-japan 1–4 and 6 product pages; the classic /tours,
   /destinations and /about site) have been deleted. They are in the git
   history if one is ever needed back. */
export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      {/* There is no /contact page: every "talk to us" CTA on the site opens
          the schedule-a-callback dialog this provider owns. */}
      <ScheduleCallProvider>
        <EinayaProvider>
        <Routes>
          {/* HOMEPAGE. /new3 stays as an alias because existing links and shared
              screenshots still point at it. */}
          <Route path="/" element={<New3 />} />
          <Route path="/new3" element={<New3 />} />

          {/* TEMP — restored explorations for local review only. Remove with the
              imports above before shipping. */}
          <Route path="/improved" element={<Home2026Improved />} />
          <Route path="/improved2" element={<Home2026Improved2 />} />
          <Route path="/luxe2-improved" element={<Luxe2Improved />} />

          {/* Tour LISTING — filterable via ?where= (destination), ?style= (trip
              style) and ?pace=. Every tour card leads to /tour-detail-japan-5. */}
          <Route path="/journeys4" element={<Journeys4 />} />

          {/* ADVENTURE collection — the dedicated page the New3 homepage
              "What's your vibe?" carousel deep-links to for Adventure. */}
          <Route path="/adventure" element={<Adventure />} />

          {/* GROUP-TOURS listing — the same sidebar-filtered grid as /journeys4,
              pre-narrowed to escorted, fixed-departure group tours, with a hero
              that speaks to that audience. */}
          <Route path="/journeys4-group" element={<Journeys4Group />} />

          {/* PRIVATE / BESPOKE listing — the same sidebar-filtered grid as
              /journeys4, opening on the "Bespoke Private" trip-style filter,
              with a hero that speaks to tailor-made travellers. */}
          <Route path="/journeys4-private" element={<Journeys4Private />} />

          {/* Japan country page: hero + about, a filterable grid of the Japan
              tours, food & reservations, "where you'll go" city cards,
              testimonials. Its city cards are the only way into the city pages
              below. The homepage search deep-links here with ?who= & ?when= to
              pre-select its filters. */}
          <Route path="/journeys/japan-2" element={<JapanJourneys2 />} />

          {/* "Coming soon" — where the homepage search lands for a specific
              destination that has no country page built yet (everywhere but
              Japan, today). */}
          <Route path="/journeys/coming-soon" element={<ComingSoon />} />

          {/* City pages, one level under the country page. Data-driven by the
              :city param — tokyo, kyoto, hakone and osaka are the only valid
              values; anything else renders empty. */}
          <Route path="/journeys/japan/:city" element={<CityJourneys />} />

          {/* PRODUCT PAGES — "Essence Japan with Hakone" and the Pattaya &
              Bangkok Escape. The two tours the site actually sells. */}
          <Route path="/tour-detail-japan-5" element={<JapanTourLuxe5 />} />
          <Route path="/tour-detail-thailand-2" element={<ThailandEscape2 />} />

          {/* ABOUT US, plus the full-team page behind its leadership section
              (About shows the Director + 4 heads; this one carries everyone). */}
          <Route path="/about-us2" element={<AboutUs />} />
          <Route path="/about-us2/team" element={<Team />} />

          {/* FAQ — the live site's 45 questions across 7 topics, rebuilt on
              the TOUR-DETAIL system (/tour-detail-japan-5): its hero, its
              sticky sub-nav, its .lxjt-select dropdown and its
              itinerary-style accordion. This is the ONE FAQ page: the earlier
              /faq exploration (team-page system) is retired, and its URL is
              kept as an alias so nothing that linked to /faq dead-ends. */}
          <Route path="/faq2" element={<Faq2 />} />
          <Route path="/faq" element={<Faq2 />} />

          {/* Vision & Mission — "The Standing Orders". The vision is one sentence
              cut into a dark plate; the mission is six numbered orders in a ruled
              ledger, each with the consequence it exists to prevent. Reached from
              "About us" in the nav, the footer's Company column, and a button on
              the About page. */}
          <Route path="/vision-mission" element={<VisionMission />} />

          {/* CAREERS — the recruitment page (centre-aligned hero, "why work
              here" ledger, searchable/filterable open roles, and a speculative
              reach-out form). /careers/:slug is the job-description page behind
              every "View role", with its own application form. */}
          <Route path="/careers" element={<Careers />} />
          <Route path="/careers/:slug" element={<CareerRole />} />

          {/* GIFT VOUCHERS — send a virtual travel gift card to someone by
              email or WhatsApp: pick an amount and a card design, write a note,
              watch it build live, then hand over the ready-made send link.
              /gift-cards is an alias so either name resolves. */}
          <Route path="/gift-vouchers" element={<GiftVouchers />} />
          <Route path="/gift-cards" element={<GiftVouchers />} />

          {/* BECOME A PARTNER — the Preferred Sales Partner programme page for
              GSA/PSA partners and travel agents wanting to sell Cox & Kings.
              Covers the franchisee/preferred-agent enquiry in one page. */}
          <Route path="/become-a-partner" element={<PreferredPartner />} />

          {/* COLLABORATE WITH US — the partnerships/creators room. Distinct from
              /become-a-partner (that recruits sales agents): this is for
              creators, brands, press and hospitality partners who want to
              CREATE with the brand — hosted journeys, co-branded campaigns,
              press access. Linked from the footer's "Partner with us" column. */}
          <Route path="/collaborate" element={<Collaborate />} />

          {/* BECOME A FRANCHISE PARTNER — own and operate a physically-branded
              Cox & Kings franchise store: an exclusive territory, store setup,
              technology, training and supply chain. Distinct from
              /become-a-partner (sales agents) and /collaborate (creators).
              Form-first; linked from the footer's "Partner with us" column. */}
          <Route path="/franchise" element={<Franchise />} />
          <Route path="/mice" element={<Mice />} />

          {/* INSPIRATION — "Dispatches", the journal. The create-desire job given
              its own room: a traveller who is inspired but undecided has nothing
              to do on a listing page, because they do not yet know what they want.
              /inspiration/:slug is the reading page behind every card on it, off
              one corpus in src/data/dispatches.js. */}
          <Route path="/inspiration" element={<Inspiration />} />
          <Route path="/inspiration/:slug" element={<InspirationArticle />} />

          {/* PRESS & MEDIA — the live site's /press-media newsroom rebuilt on
              the new3 system: the coverage as a filterable clippings ledger,
              the awards, the SKIFT quote and the press-desk contacts. Same URL
              as the live site so existing links land. Reached from the nav's
              "As featured in" (About us menu) and the footer's Company column. */}
          <Route path="/press-media" element={<PressMedia />} />

          {/* TESTIMONIALS — "The Guest Book", the trust page: the homepage's
              reviews plus four worry-answering stories, every entry linking out
              to the platform it was posted on (Google / Tripadvisor /
              Trustpilot), the awards ledger, and count-up trust stats. Reached
              from "Real reviews" in the About-us menu and the footer's
              Assurance column; /reviews is an alias. */}
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/reviews" element={<Testimonials />} />

          {/* TERMS & CONDITIONS — the legal reference page, redesigned from the
              live wall-of-headings into a searchable, scroll-spied document.
              /info/terms-condition mirrors the live-site URL so old links land. */}
          <Route path="/terms" element={<Terms />} />
          <Route path="/info/terms-condition" element={<Terms />} />

          {/* SITEMAP — "The Atlas Index". The live site's /sitemap redesigned:
              an interactive dotted world map + searchable index of every page.
              Linked from the footer's legal row. */}
          <Route path="/sitemap" element={<Sitemap />} />

          {/* Meta ad landing pages — message-matched, deliberately not linked
              from the site. Live campaign destinations: check the running ads
              before removing these. */}
          <Route path="/private-italy" element={<PrivateItaly />} />
          <Route path="/private-italy-mobile" element={<PrivateItaly mobile />} />
          <Route path="/group-japan" element={<GroupJapan />} />
          <Route path="/group-japan-mobile" element={<GroupJapan mobile />} />

          {/* CLIENT-FACING 404 — "you're wandering off the map". Reachable
              ONLY at its own /404 address for now: nothing links to it, and
              unmatched URLs still get the dev-facing NotFound below. */}
          <Route path="/404" element={<NotFound404 />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </EinayaProvider>
      </ScheduleCallProvider>
    </BrowserRouter>
  );
}
