/* ---------------------------------------------------------------------------
   Einaya — the single AI-assistant surface for the whole site, mirroring the
   ScheduleCall pattern. The nav's "Help me decide" (and any other chrome CTA
   that wants the assistant rather than the callback form) opens THIS.

   Usage:
     • Wrap the app once in <EinayaProvider> (see App.jsx), below the router.
     • Anywhere below it, either
         const openEinaya = useEinaya();   → openEinaya() on any handler, or
         <SmartLink to={EINAYA}>…          → not wired here; chrome links check
       the EINAYA sentinel directly (see SiteChrome's ChromeLink).

   Only ONE ChatBot is mounted here, controlled and with its floating button
   suppressed (hideFab), so it stays invisible until opened and never collides
   with the per-page ChatBot launchers that some pages (New3, JapanJourneys2…)
   still render for their own in-page buttons.
--------------------------------------------------------------------------- */
import { createContext, useCallback, useContext, useState } from 'react';
import ChatBot from './ChatBot';

/* Sentinel destination: "open Einaya" rather than "go to a page". A unique
   string so it can never collide with a real route or the CALLBACK sentinel. */
export const EINAYA = '@@einaya';

const EinayaCtx = createContext(() => {});

export function EinayaProvider({ children }) {
  const [open, setOpen] = useState(false);
  const openEinaya = useCallback(() => setOpen(true), []);

  return (
    <EinayaCtx.Provider value={openEinaya}>
      {children}
      {/* Controlled + hideFab: no floating button of its own, opens only when
          openEinaya() is called. Centred (expanded) because reaching for it is
          a deliberate "help me decide", not an idle side offer. */}
      <ChatBot open={open} onOpenChange={setOpen} openExpanded hideFab name="Einaya" />
    </EinayaCtx.Provider>
  );
}

export function useEinaya() {
  return useContext(EinayaCtx);
}
