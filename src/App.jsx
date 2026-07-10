import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import BackToTop from './components/BackToTop';
import NewHome from './pages/NewHome';
import Home2026 from './pages/Home2026';
import Home2026Improved from './pages/Home2026Improved';
import Home2026Improved2 from './pages/Home2026Improved2';
import Final from './pages/Final';
import Final2 from './pages/Final2';
import Final2a from './pages/Final2a';
import Final3 from './pages/Final3';
import Final3a from './pages/Final3a';
import Luxe from './pages/Luxe';
import Luxe2 from './pages/Luxe2';
import Luxe2Improved from './pages/Luxe2Improved';
import Modern from './pages/Modern';
import ModernVariant from './pages/ModernVariant';
import ModernVariant2 from './pages/ModernVariant2';
import ModernVariant3 from './pages/ModernVariant3';
import PrivateItaly from './pages/PrivateItaly';
import GroupJapan from './pages/GroupJapan';
import JapanTour from './pages/JapanTour';
import JapanTourLuxe from './pages/JapanTourLuxe';
import JapanTourLuxe2 from './pages/JapanTourLuxe2';
import JapanTourLuxe3 from './pages/JapanTourLuxe3';
import JapanTourLuxe4 from './pages/JapanTourLuxe4';
import JapanTourLuxe5 from './pages/JapanTourLuxe5';
import JapanTourLuxe6 from './pages/JapanTourLuxe6';
import ThailandEscape from './pages/ThailandEscape';
import ThailandEscape2 from './pages/ThailandEscape2';
import EssenceJapan from './pages/EssenceJapan';
import EssenceJapan2 from './pages/EssenceJapan2';
import Journeys from './pages/Journeys';
import Journeys2 from './pages/Journeys2';
import Journeys3 from './pages/Journeys3';
import Journeys4 from './pages/Journeys4';
import JapanJourneys from './pages/JapanJourneys';
import JapanJourneys2 from './pages/JapanJourneys2';
import CityJourneys from './pages/CityJourneys';
import New from './pages/New';
import New2 from './pages/New2';
import Home from './pages/Home';
import Tours from './pages/Tours';
import TourDetail from './pages/TourDetail';
import Destinations from './pages/Destinations';
import About from './pages/About';
import Contact from './pages/Contact';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
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

/* Shared chrome (Header/Footer/widgets) for the classic site pages.
   The new homepage at "/" is standalone and brings its own header & footer. */
function ClassicLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
      <ChatBot />
      <BackToTop />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Fresh scroll-activated homepage — self-contained design */}
        <Route path="/" element={<Home2026 />} />

        {/* Improved homepage — persona-driven UX revamp (keeps "/" intact) */}
        <Route path="/improved" element={<Home2026Improved />} />

        {/* Improved v2 — identical to /improved but the hero backdrop is
            static & in-flow (no fixed parallax), so the hero image renders in
            a full-page screenshot capture. */}
        <Route path="/improved2" element={<Home2026Improved2 />} />

        {/* New — composite page: /improved nav + hero + specialists + fork +
            destinations + clips, /luxe2-improved Enaya + heritage + reviews +
            press, and the /journeys "Relaxed pace" shelf. */}
        <Route path="/new-homepage" element={<New />} />

        {/* New2 — second version of /new: redesigned intro assurance cards
            + an "Accolades & Achievements" award band in the heritage
            section. The original /new is untouched. */}
        <Route path="/new2" element={<New2 />} />

        {/* Journeys — tour LISTING page (design language shared with /improved).
            Opened by clicking a destination or searching on /improved.
            Filterable via ?where= (destination) and ?style= (trip style). */}
        <Route path="/journeys" element={<Journeys />} />

        {/* Journeys2 — sidebar variant: always-open LEFT filter rail
            (destination, budget, style, duration, pace) + results grid. */}
        <Route path="/journeys2" element={<Journeys2 />} />

        {/* Journeys3 — Journeys2 with a bold "Private Tour" / "Group Tour"
            badge on every card, and a squarer radius language (≤4px). */}
        <Route path="/journeys3" element={<Journeys3 />} />

        {/* Journeys4 — Journeys2 with ONLY a "Private Tour" / "Group Tour"
            badge added on every card; everything else identical. */}
        <Route path="/journeys4" element={<Journeys4 />} />

        {/* Japan Journeys — country-specific listing page (Japan only):
            about Japan → the Japan tours → "food people eat in Japan".
            Shares the /improved chrome + design.md tokens. */}
        <Route path="/journeys/japan" element={<JapanJourneys />} />

        {/* Japan Journeys 2 — new version: hero + about kept, then a
            filterable/sortable grid of ALL Japan tours with a left rail
            (like /journeys2), the food & reservations section on a beige
            surface, a standalone "Where you'll go" section, traveller
            testimonials and a "people also view" shelf, then the CTA. */}
        <Route path="/journeys/japan-2" element={<JapanJourneys2 />} />

        {/* City pages — one level below the country page (Tokyo, Kyoto,
            Hakone, Osaka). Reached from the city cards on /journeys/japan.
            Same design language; data-driven by the :city param. */}
        <Route path="/journeys/japan/:city" element={<CityJourneys />} />

        {/* Tour / product detail — escorted Japan cherry-blossom journey.
            Opens from the Japan package card on the improved homepage. */}
        <Route path="/tours/japan" element={<JapanTour />} />
        <Route path="/japan" element={<JapanTour />} />

        {/* Essence Japan with Hakone — fresh product / tour-detail page,
            self-contained, navbar consistent with /improved. Mirrors the
            live URL path so it reads like the real site. */}
        <Route path="/group-tours/essence-japan-with-hakone" element={<EssenceJapan />} />
        <Route path="/essence-japan" element={<EssenceJapan />} />

        {/* Essence Japan 2 — alternate layout: itinerary + pictures fused
            into one synced section (timeline left, sticky photo right),
            standalone gallery removed. */}
        <Route path="/essence-japan-2" element={<EssenceJapan2 />} />

        {/* Previous homepage, preserved */}
        <Route path="/newhome" element={<NewHome />} />

        {/* Final — composite of new + classic sections, self-contained */}
        <Route path="/final" element={<Final />} />

        {/* Final2 — refined Final (a11y, loading states, link fixes) */}
        <Route path="/final2" element={<Final2 />} />

        {/* Final2a — Final2 with the original new-page hero */}
        <Route path="/final2a" element={<Final2a />} />
        <Route path="/final2a-pill" element={<Final2a variant="pill" />} />
        <Route path="/final2a-bar" element={<Final2a variant="bar" />} />
        <Route path="/final2a-inline" element={<Final2a variant="inline" />} />
        <Route path="/final2a-stack" element={<Final2a variant="stack" />} />
        <Route path="/final2a-stack-ds" element={<Final2a variant="stack" ds />} />

        {/* Final3 / Final3a — revamped pages built around the core promise + 7 pillars */}
        <Route path="/final3" element={<Final3 />} />
        <Route path="/final3a" element={<Final3a />} />

        {/* Luxe — new standalone luxury homepage (glassmorphism, photo-first reviews) */}
        <Route path="/luxe" element={<Luxe />} />

        {/* Luxe2 — blue-forward variant: wordmark, heritage-first, mood section, Enaya AI */}
        <Route path="/luxe2" element={<Luxe2 />} />

        {/* Luxe2-improved — persona-driven revamp of /luxe2 (price clarity, group/bespoke split, trust, human contact) */}
        <Route path="/luxe2-improved" element={<Luxe2Improved />} />

        {/* Splendours of Japan — product / tour-detail page in the luxe2-improved
            design language. Opens from the Japan package card on /luxe2-improved. */}
        <Route path="/tour-detail-japan" element={<JapanTourLuxe />} />

        {/* Splendours of Japan — VARIANT 2: the day-by-day itinerary sits on the
            left with a sticky picture that follows the active day on the right;
            the standalone photo gallery is removed. */}
        <Route path="/tour-detail-japan-2" element={<JapanTourLuxe2 />} />

        {/* Splendours of Japan — VARIANT 3: the terms section becomes "The policies",
            three filterable categories (Booking Terms, Cancellation Policy, Terms &
            Conditions) with summaries, expand-on-demand detail, and a policy search. */}
        <Route path="/tour-detail-japan-3" element={<JapanTourLuxe3 />} />

        {/* Splendours of Japan — VARIANT 4: "Essence Japan with Hakone" real product
            content. The day-by-day carries per-day hotel/meals/sights, shown on a
            shorter picture on hover (desktop) or in the day accordion (mobile). */}
        <Route path="/tour-detail-japan-4" element={<JapanTourLuxe4 />} />

        {/* Splendours of Japan — VARIANT 5: identical to VARIANT 4, but the hero
            carries a near-constant overlay. On desktop it eases only slightly
            lighter towards the right; on mobile it is fully uniform. */}
        <Route path="/tour-detail-japan-5" element={<JapanTourLuxe5 />} />

        {/* Splendours of Japan — VARIANT 6: a paid-AD LANDING page. Built from
            VARIANT 5 but pared to lead capture — a hero lead form, an urgency /
            scarcity strip, loud "seats left" tags, and a closing enquiry block.
            The deep-info sections (day-by-day, inclusions, policies, similar
            tours) are removed so there's far less to read. */}
        <Route path="/tour-detail-japan-6" element={<JapanTourLuxe6 />} />

        {/* Pattaya & Bangkok Escape — Thailand tour-detail page, built on the
            same design language as /tour-detail-japan-5 but tuned to CONVERT /
            book (loud "Book now" hero CTA, high-demand urgency strip + scarcity
            ribbon on the booking card, seats-left tags on every date, and trust
            badges beside checkout). Content from coxandkings.com. */}
        <Route path="/tour-detail-thailand" element={<ThailandEscape />} />

        {/* Pattaya & Bangkok Escape — VERSION 2. Identical to the above, but the
            booking/payment section is redesigned to a single centred column: a
            "Book with confidence" card + a white booking card with a simplified
            departure list, two payment-choice cards and a solid sienna
            "Pay now and secure seat" CTA (matches the supplied reference). */}
        <Route path="/tour-detail-thailand-2" element={<ThailandEscape2 />} />

        {/* Modern variant — vaulk.com-style single-page layout, CK content + design.md tokens */}
        <Route path="/modern" element={<Modern />} />

        {/* Modern Variant — scroll-activated editorial homepage (reference motion study),
            CK heritage content + design.md tokens. Self-contained. */}
        <Route path="/modern-variant" element={<ModernVariant />} />

        {/* Modern Variant 2 — cinematic "private atelier" homepage (second reference
            motion study), CK heritage content + design.md tokens. Self-contained. */}
        <Route path="/modern-variant-2" element={<ModernVariant2 />} />

        {/* Modern Variant 3 — editorial-luxury: parallax HD hero, 3D plane through
            sections, scroll word-highlighting, agency-grade cards. design.md tokens. */}
        <Route path="/modern-variant-3" element={<ModernVariant3 />} />

        {/* Private Italy — Meta ad landing page (message-matched) */}
        <Route path="/private-italy" element={<PrivateItaly />} />
        <Route path="/private-italy-mobile" element={<PrivateItaly mobile />} />

        {/* Japan — Meta ad landing page, group tour (message-matched) */}
        <Route path="/group-japan" element={<GroupJapan />} />
        <Route path="/group-japan-mobile" element={<GroupJapan mobile />} />

        {/* Classic site (older version) under shared chrome */}
        <Route element={<ClassicLayout />}>
          <Route path="/classic" element={<Home />} />
          <Route path="/tours" element={<Tours />} />
          <Route path="/tours/:id" element={<TourDetail />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/destinations/:name" element={<Destinations />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/experiences" element={<Tours />} />
          <Route path="/privacy" element={<NotFound />} />
          <Route path="/terms" element={<NotFound />} />
          <Route path="/careers" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
