import { useEffect } from 'react';
import '../components/v3/v3-theme.css';
import V3Header from '../components/v3/V3Header';
import V3Footer from '../components/v3/V3Footer';
import HeroV3 from '../components/v3/HeroV3';
import PathRouter from '../components/v3/PathRouter';
import TrustBar from '../components/v3/TrustBar';
import DestinationMosaic from '../components/v3/DestinationMosaic';
import HowWeTravel from '../components/v3/HowWeTravel';
import Difference from '../components/v3/Difference';
import EditorialDesire from '../components/v3/EditorialDesire';
import Proof from '../components/v3/Proof';
import AsSeenIn from '../components/v3/AsSeenIn';
import Curations from '../components/v3/Curations';
import LeadCapture from '../components/v3/LeadCapture';
import StickyCTABar from '../components/v3/StickyCTABar';
import ChatBot from '../components/ChatBot';
import BackToTop from '../components/BackToTop';

/* /final3 — revamped landing page, Variant A (image hero + classic search).
   Built around the core promise + 7 pillars. /final2 is left untouched. */
export default function Final3() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="v3">
      <a href="#v3-main" className="v3-skip">Skip to main content</a>
      <V3Header brandLink="/final3" />
      <main id="v3-main" tabIndex={-1}>
        <HeroV3 />
        <PathRouter variant="A" />
        <TrustBar />
        <DestinationMosaic />
        <HowWeTravel />
        <Difference />
        <EditorialDesire />
        <Proof />
        <AsSeenIn />
        <Curations />
        <LeadCapture />
      </main>
      <V3Footer />
      <StickyCTABar />
      <ChatBot />
      <BackToTop />
    </div>
  );
}
