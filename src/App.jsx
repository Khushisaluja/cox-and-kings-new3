import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import BackToTop from './components/BackToTop';
import NewHome from './pages/NewHome';
import Home2026 from './pages/Home2026';
import Home2026Improved from './pages/Home2026Improved';
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
import EssenceJapan from './pages/EssenceJapan';
import EssenceJapan2 from './pages/EssenceJapan2';
import Journeys from './pages/Journeys';
import Journeys2 from './pages/Journeys2';
import JapanJourneys from './pages/JapanJourneys';
import CityJourneys from './pages/CityJourneys';
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

        {/* Journeys — tour LISTING page (design language shared with /improved).
            Opened by clicking a destination or searching on /improved.
            Filterable via ?where= (destination) and ?style= (trip style). */}
        <Route path="/journeys" element={<Journeys />} />

        {/* Journeys2 — sidebar variant: always-open LEFT filter rail
            (destination, budget, style, duration, pace) + results grid. */}
        <Route path="/journeys2" element={<Journeys2 />} />

        {/* Japan Journeys — country-specific listing page (Japan only):
            about Japan → the Japan tours → "food people eat in Japan".
            Shares the /improved chrome + design.md tokens. */}
        <Route path="/journeys/japan" element={<JapanJourneys />} />

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
