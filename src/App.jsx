import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
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
import Home from './pages/Home';
import Tours from './pages/Tours';
import TourDetail from './pages/TourDetail';
import Destinations from './pages/Destinations';
import About from './pages/About';
import Contact from './pages/Contact';

function ScrollToTop() {
  if (typeof window !== 'undefined') {
    window.scrollTo(0, 0);
  }
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
      <Routes>
        {/* Fresh scroll-activated homepage — self-contained design */}
        <Route path="/" element={<Home2026 />} />

        {/* Improved homepage — persona-driven UX revamp (keeps "/" intact) */}
        <Route path="/improved" element={<Home2026Improved />} />

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
