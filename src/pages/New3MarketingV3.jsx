/* ============================================================================
   Homepage, marketing variant v3: /new3-marketing-v3.

   The original /new3 hero and its search, unchanged. The campaign banners
   (Japan, Europe, Vietnam, brand-voice copy from v2) move out of the hero and
   become the page's third section: a row of wide cards that scrolls
   sideways on its own, right after the intro. Everything below keeps v2's live coxandkings.com copy.
   /new3-marketing and /new3-marketing-v2 stay as they are.
   Copy and photographs: new3marketing/voiceV3.jsx (the brand-voice pass that
   runs through the whole page, not only the cards).
   ========================================================================== */

import New3 from './New3';
import OfferCards from './new3marketing/OfferCards';
import { CAMPAIGNS_V3, OFFER_COPY_V3, NEW3_COPY_V3 } from './new3marketing/voiceV3';
import './New3Marketing.css';

function OfferBanners() {
  return <OfferCards campaigns={CAMPAIGNS_V3} copy={OFFER_COPY_V3} />;
}

/* motion="light": no GSAP scroll layer, no blur reveals, no parallax; each
   block just fades in once. The user found the heavier motion glitchy. */
export default function New3MarketingV3() {
  return <New3 AfterIntro={OfferBanners} rootClass="n3m n3m--orighero" motion="light" copy={NEW3_COPY_V3} />;
}
