/* ============================================================================
   Homepage, marketing variant v3: /new3-marketing-v3.

   The original /new3 hero and its search, unchanged. The campaign banners
   (Japan, Europe, Vietnam, brand-voice copy from v2) move out of the hero and
   become the page's third section: a row of wide cards that scrolls
   sideways on its own, right after the intro. Everything below keeps v2's live coxandkings.com copy.
   /new3-marketing and /new3-marketing-v2 stay as they are.
   ========================================================================== */

import New3 from './New3';
import OfferCards from './new3marketing/OfferCards';
import { CAMPAIGNS_V2, HERO_COPY_V2, NEW3_COPY_V2 } from './new3marketing/voice';
import { useSectionMotion } from './New3Marketing';
import './New3Marketing.css';

function OfferBanners() {
  return <OfferCards campaigns={CAMPAIGNS_V2} copy={HERO_COPY_V2} />;
}

export default function New3MarketingV3() {
  useSectionMotion();
  return (
    <>
      <div className="n3m-progress" aria-hidden="true" />
      <New3 AfterIntro={OfferBanners} rootClass="n3m n3m--orighero" motion="gsap" copy={NEW3_COPY_V2} />
    </>
  );
}
