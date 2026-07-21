import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import New3 from './pages/New3';
import Journeys4 from './pages/Journeys4';
import Journeys4Group from './pages/Journeys4Group';
import Journeys4Private from './pages/Journeys4Private';
import JapanJourneys2 from './pages/JapanJourneys2';
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
import Collaborate from './pages/Collaborate';
import Franchise from './pages/Franchise';
import Terms from './pages/Terms';
import { ScheduleCallProvider } from './components/ScheduleCall';

/* A new route always starts at the top — except when the link carried a hash
   ("/#reviews"), where we scroll to that section once it has been painted.
   Browser scroll restoration is turned off: on the GSAP-pinned pages it would
   otherwise drop an arriving visitor into the middle of the page. */
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
  }, []);
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return undefined;
    }
    window.scrollTo(0, 0);
    const raf = requestAnimationFrame(() => {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname, hash]);
  return null;
}

function NotFound() {
  return (
    <main style={{ paddingTop: 140, textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: 'var(--color-navy)' }}>Page Not Found</h2>
      <p style={{ color: 'var(--color-text-light)', fontSize: '1rem' }}>The page you're looking for doesn't exist.</p>
      <a href="/" className="btn-primary">Return to Home</a>
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
        <Routes>
          {/* HOMEPAGE. /new3 stays as an alias because existing links and shared
              screenshots still point at it. */}
          <Route path="/" element={<New3 />} />
          <Route path="/new3" element={<New3 />} />

          {/* Tour LISTING — filterable via ?where= (destination), ?style= (trip
              style) and ?pace=. Every tour card leads to /tour-detail-japan-5. */}
          <Route path="/journeys4" element={<Journeys4 />} />

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
              below. */}
          <Route path="/journeys/japan-2" element={<JapanJourneys2 />} />

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

          {/* INSPIRATION — "Dispatches", the journal. The create-desire job given
              its own room: a traveller who is inspired but undecided has nothing
              to do on a listing page, because they do not yet know what they want.
              /inspiration/:slug is the reading page behind every card on it, off
              one corpus in src/data/dispatches.js. */}
          <Route path="/inspiration" element={<Inspiration />} />
          <Route path="/inspiration/:slug" element={<InspirationArticle />} />

          {/* TERMS & CONDITIONS — the legal reference page, redesigned from the
              live wall-of-headings into a searchable, scroll-spied document.
              /info/terms-condition mirrors the live-site URL so old links land. */}
          <Route path="/terms" element={<Terms />} />
          <Route path="/info/terms-condition" element={<Terms />} />

          {/* Meta ad landing pages — message-matched, deliberately not linked
              from the site. Live campaign destinations: check the running ads
              before removing these. */}
          <Route path="/private-italy" element={<PrivateItaly />} />
          <Route path="/private-italy-mobile" element={<PrivateItaly mobile />} />
          <Route path="/group-japan" element={<GroupJapan />} />
          <Route path="/group-japan-mobile" element={<GroupJapan mobile />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </ScheduleCallProvider>
    </BrowserRouter>
  );
}
