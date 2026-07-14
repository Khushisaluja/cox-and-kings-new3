/* ============================================================
   City Journeys — a CITY-SPECIFIC listing page, one level below
   the country page (/journeys/japan). Reached by clicking a city
   card (Tokyo, Kyoto, Hakone, Osaka) on the Japan page.

   Same flow and design language as /journeys/japan:
     breadcrumb → hero → a little about the city (+ good-to-know) →
     neighbourhoods → the city journeys (two carousels) →
     the food people eat here (carousel) → restaurants → CTA.

   Content is data-driven from CITY_DATA[:city]; all chrome, cards
   and styles are shared with JapanJourneys (design.md tokens).
   ============================================================ */
import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { SmartLink as Link, CALLBACK } from '../components/ScheduleCall';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import {
  Phone, PhoneCall, MessageCircle, ArrowUpRight, ArrowRight,
  MapPin, Menu, X, ChevronDown, ChevronLeft, ChevronRight,
  Star, Clock, Calendar, Users, Gauge, Images, Utensils,
  CalendarDays, TrainFront, Navigation, Landmark, Sparkles,
  Instagram, Facebook, Youtube, Linkedin,
} from 'lucide-react';
import { img } from '../data/v3content';
import './Home2026.css';
import './Home2026Improved.css';
import './Journeys.css';
import './JapanJourneys.css';
import './CityJourneys.css';

const CONTACT = {
  phoneDisplay: '+91 8556001700',
  phoneHref: 'tel:+918556001700',
  whatsappHref: 'https://wa.me/918556001700',
  email: 'journeys@coxandkings.com',
};

const U = (id) => `https://images.unsplash.com/photo-${id}`;

/* Tour-card enricher (same shape as the country page). */
const GROUP_BY_STYLE = {
  'Group Tour': 'Small group · max 18',
  'Bespoke Private': 'Private & tailor-made',
  Luxury: 'Private guiding',
};
const T = (o, pool) => ({
  ...o,
  priceLabel: `₹${o.price.toLocaleString('en-IN')}`,
  nightsLabel: `${o.nights} nights`,
  group: GROUP_BY_STYLE[o.style],
  gallery: [...new Set([o.image, ...pool])].slice(0, 5),
});

/* ---------------------------------------------------------------
   CITY DATA — one entry per city under Japan.
   --------------------------------------------------------------- */
const RAW = {
  tokyo: {
    name: 'Tokyo',
    hero: U('1540959733332-eab4deabeeaf'),
    photos: [U('1540959733332-eab4deabeeaf'), U('1536098561742-ca998e48cbcc'), U('1513407030348-c983a97b98d8'), U('1522383225653-ed111181a951'), U('1493976040374-85c8e12f0c0e')],
    tagline: 'Tokyo, all at once',
    heroSub: 'Neon and quiet, ancient and next — the world\'s greatest city plays every note at once. Here\'s a little about it, our Tokyo journeys, and what to eat while you\'re there.',
    lede: "Few cities hold their contradictions so easily. In Tokyo a 1,300-year-old shrine sits a lift ride below a cocktail bar; a hushed tea house shares a wall with the world's busiest crossing. It is spotless, endlessly polite and astonishingly easy to move around — and it rewards the curious like nowhere else.",
    facts: [
      { icon: CalendarDays, label: 'Best time', value: 'Mar–Apr (blossom) · Oct–Nov (autumn)' },
      { icon: TrainFront, label: 'Getting there', value: 'Narita/Haneda · direct from India' },
      { icon: Navigation, label: 'Getting around', value: 'JR Yamanote line & metro' },
      { icon: Landmark, label: "Don't miss", value: 'Senso-ji, Shibuya, teamLab' },
      { icon: Clock, label: 'Ideal stay', value: '3–4 days' },
    ],
    areas: [
      { name: 'Shibuya & Shinjuku', note: 'Neon canyons, the famous crossing and endless nightlife.', image: U('1540959733332-eab4deabeeaf') },
      { name: 'Asakusa & the old city', note: 'Senso-ji temple, riverside lanes and traditional craft.', image: U('1522383225653-ed111181a951') },
      { name: 'Ginza & Marunouchi', note: 'Refined shopping, sushi counters and hotel bars.', image: U('1536098561742-ca998e48cbcc') },
    ],
    guided: [
      { id: 't-3day', title: 'Tokyo in Three Days', blurb: 'The icons, done well — Asakusa, Shibuya, Meiji and a river cruise.', style: 'Group Tour', pace: 'Balanced', rating: 4.8, nights: 3, season: 'Year-round', price: 85000, image: U('1540959733332-eab4deabeeaf') },
      { id: 't-districts', title: 'Tokyo Icons & Hidden Districts', blurb: 'Beyond the postcards — backstreets, izakaya alleys and local markets.', style: 'Group Tour', pace: 'Active', rating: 4.7, nights: 4, season: 'Year-round', price: 98000, image: U('1522383225653-ed111181a951') },
      { id: 't-fuji', title: 'Tokyo & Mt Fuji Day Escape', blurb: 'Three city days plus a full day to Hakone and the sacred cone.', style: 'Group Tour', pace: 'Balanced', rating: 4.8, nights: 3, season: 'Mar–Nov', price: 92000, image: U('1490806843957-31f4c9a91c65') },
    ],
    private: [
      { id: 't-yourway', title: 'Private Tokyo, Your Way', blurb: 'A private guide and car, shaped entirely around your interests.', style: 'Bespoke Private', pace: 'Relaxed', rating: 4.9, nights: 3, season: 'Any date', price: 125000, image: U('1536098561742-ca998e48cbcc') },
      { id: 't-food', title: 'Tokyo Food & Culture Bespoke', blurb: 'Tsukiji at dawn, a sushi counter, a sake tasting and a kaiseki night.', style: 'Bespoke Private', pace: 'Balanced', rating: 4.9, nights: 4, season: 'Any date', price: 165000, image: U('1579584425555-c3ce17fd4351') },
      { id: 't-luxe', title: 'Tokyo Luxury Stay & Guide', blurb: 'A landmark suite, private guiding and after-hours access.', style: 'Luxury', pace: 'Relaxed', rating: 4.9, nights: 3, season: 'Year-round', price: 210000, image: U('1513407030348-c983a97b98d8') },
    ],
    dishes: [
      { name: 'Sushi & Sashimi', tag: 'Ginza', desc: 'Edo-style nigiri cut to order at a counter — the purest taste of the sea.', image: U('1579584425555-c3ce17fd4351') },
      { name: 'Ramen', tag: 'Everywhere', desc: 'Rich tonkotsu or clear shoyu, slurped fast at a steamy counter.', image: U('1557872943-16a5ac26437e') },
      { name: 'Tempura', tag: 'Nihonbashi', desc: 'Seafood and vegetables in a whisper-light, lace-crisp batter.', image: U('1615361200141-f45040f367be') },
      { name: 'Monjayaki', tag: 'Tsukishima', desc: 'Tokyo\'s gooey griddle pancake — cooked at your own hotplate.', image: U('1580822184713-fc5400e7fe10') },
    ],
    restaurants: [
      { name: 'Sukiyabashi Jiro', city: 'Ginza', note: 'The legendary sushi counter — a bucket-list omakase. Book far ahead.', price: '¥¥¥¥', image: U('1579584425555-c3ce17fd4351') },
      { name: 'Ichiran Ramen', city: 'Shibuya', note: 'Solo-booth tonkotsu ramen, dialled exactly to your taste. Casual & iconic.', price: '¥¥', image: U('1557872943-16a5ac26437e') },
      { name: 'Narisawa', city: 'Minami-Aoyama', note: 'Two-Michelin-star "innovative satoyama" cuisine. A destination meal.', price: '¥¥¥¥', image: U('1615361200141-f45040f367be') },
      { name: 'Afuri', city: 'Ebisu', note: 'Bright yuzu-shio ramen — a lighter, modern take worth the detour.', price: '¥¥', image: U('1591814468924-caf88d1232e1') },
    ],
  },

  kyoto: {
    name: 'Kyoto',
    hero: U('1493976040374-85c8e12f0c0e'),
    photos: [U('1493976040374-85c8e12f0c0e'), U('1492571350019-22de08371fd3'), U('1524413840807-0c3cb6fa808d'), U('1522383225653-ed111181a951'), U('1490806843957-31f4c9a91c65')],
    tagline: 'Kyoto, quietly',
    heroSub: 'A thousand years of capital — temples, tea houses and moss-still gardens. A little about the old city, our Kyoto journeys, and what to eat while you\'re there.',
    lede: 'For a thousand years Kyoto was the imperial capital, and it wears that history lightly — 1,600 temples, seventeen World Heritage sites, geisha lanes and Zen gardens raked to stillness. Slow down here. It is a city best taken at the pace of a tea ceremony.',
    facts: [
      { icon: CalendarDays, label: 'Best time', value: 'Apr (blossom) · Nov (maples)' },
      { icon: TrainFront, label: 'Getting there', value: '~2h 15m by Shinkansen from Tokyo' },
      { icon: Navigation, label: 'Getting around', value: 'City bus, bicycle & short taxis' },
      { icon: Landmark, label: "Don't miss", value: 'Fushimi Inari, Arashiyama, Gion' },
      { icon: Clock, label: 'Ideal stay', value: '2–3 days' },
    ],
    areas: [
      { name: 'Higashiyama & Gion', note: 'Lantern-lit lanes, wooden tea houses and the geisha district.', image: U('1493976040374-85c8e12f0c0e') },
      { name: 'Arashiyama', note: 'The bamboo grove, riverside temples and the western hills.', image: U('1524413840807-0c3cb6fa808d') },
      { name: 'Fushimi & the south', note: 'Ten thousand vermilion torii gates climbing the mountain.', image: U('1492571350019-22de08371fd3') },
    ],
    guided: [
      { id: 'k-temples', title: 'Kyoto Temples & Gardens', blurb: 'Kinkaku-ji, Ryoan-ji and Fushimi Inari with an expert guide.', style: 'Group Tour', pace: 'Balanced', rating: 4.9, nights: 2, season: 'Year-round', price: 72000, image: U('1493976040374-85c8e12f0c0e') },
      { id: 'k-nara', title: 'Kyoto & Nara Highlights', blurb: 'The old capital plus a day among Nara\'s temples and tame deer.', style: 'Group Tour', pace: 'Active', rating: 4.8, nights: 3, season: 'Year-round', price: 90000, image: U('1524413840807-0c3cb6fa808d') },
      { id: 'k-arashiyama', title: 'Arashiyama & Fushimi Day', blurb: 'Bamboo grove at dawn and the torii-lined trail before the crowds.', style: 'Group Tour', pace: 'Balanced', rating: 4.8, nights: 2, season: 'Year-round', price: 76000, image: U('1492571350019-22de08371fd3') },
    ],
    private: [
      { id: 'k-culture', title: 'Private Kyoto Culture', blurb: 'A private geiko evening, a tea ceremony and hidden temple courtyards.', style: 'Bespoke Private', pace: 'Relaxed', rating: 4.9, nights: 3, season: 'Any date', price: 132000, image: U('1493976040374-85c8e12f0c0e') },
      { id: 'k-craft', title: 'Kyoto Tea & Craft Bespoke', blurb: 'Matcha in Uji, indigo dyeing and a visit to a master craftsman.', style: 'Bespoke Private', pace: 'Relaxed', rating: 4.9, nights: 3, season: 'Any date', price: 176000, image: U('1536256263959-770b48d82b0a') },
      { id: 'k-ryokan', title: 'Kyoto Ryokan Luxury', blurb: 'A machiya-style ryokan, private guiding and kaiseki dining.', style: 'Luxury', pace: 'Relaxed', rating: 4.9, nights: 2, season: 'Year-round', price: 205000, image: U('1490806843957-31f4c9a91c65') },
    ],
    dishes: [
      { name: 'Kaiseki', tag: 'Higashiyama', desc: 'Japan\'s seasonal haute cuisine — many small, exquisite courses.', image: U('1615361200141-f45040f367be') },
      { name: 'Yudofu', tag: 'Nanzen-ji', desc: 'Silky simmered tofu — a temple dish, delicate and warming.', image: U('1580822184713-fc5400e7fe10') },
      { name: 'Matcha & Wagashi', tag: 'Uji · Gion', desc: 'Stone-ground green tea with delicate seasonal sweets — a ritual.', image: U('1536256263959-770b48d82b0a') },
      { name: 'Obanzai', tag: 'Nishiki', desc: 'Kyoto home cooking — seasonal vegetables, quietly perfected.', image: U('1557872943-16a5ac26437e') },
    ],
    restaurants: [
      { name: 'Kikunoi Honten', city: 'Higashiyama', note: 'Three-Michelin-star kaiseki — Japan\'s seasonal haute cuisine.', price: '¥¥¥¥', image: U('1615361200141-f45040f367be') },
      { name: 'Gion Karyo', city: 'Gion', note: 'Approachable kaiseki in a machiya townhouse — beauty without ceremony.', price: '¥¥¥', image: U('1536256263959-770b48d82b0a') },
      { name: 'Arashiyama Yoshimura', city: 'Arashiyama', note: 'Hand-cut soba with a river-and-hills view. Worth the wait.', price: '¥¥', image: U('1557872943-16a5ac26437e') },
      { name: 'Nishiki Market', city: 'Nakagyo', note: '"Kyoto\'s kitchen" — a 400-year covered market to graze through.', price: '¥', image: U('1580822184713-fc5400e7fe10') },
    ],
  },

  hakone: {
    name: 'Mt Fuji & Hakone',
    hero: U('1490806843957-31f4c9a91c65'),
    photos: [U('1490806843957-31f4c9a91c65'), U('1545569341-9eb8b30979d9'), U('1578662996442-48f60103fc96'), U('1493976040374-85c8e12f0c0e'), U('1522383225653-ed111181a951')],
    tagline: 'Fuji, up close',
    heroSub: 'Hot-spring inns, lake cruises and Japan\'s sacred cone on the skyline. A little about the region, our journeys here, and what to eat while you\'re there.',
    lede: 'An hour and a half from Tokyo, the city falls away into cedar forest, sulphur valleys and still lakes — all under the watch of Mt Fuji. Hakone is where Japan comes to soak: a place of open-air onsen, mountain railways and ryokan dinners served in your room, in a robe, in view of the mountain.',
    facts: [
      { icon: CalendarDays, label: 'Best time', value: 'Oct–Nov & clear winter days for Fuji' },
      { icon: TrainFront, label: 'Getting there', value: '~85 min from Tokyo (Romancecar)' },
      { icon: Navigation, label: 'Getting around', value: 'Hakone loop — rail, ropeway & boat' },
      { icon: Landmark, label: "Don't miss", value: 'Lake Ashi, Owakudani, an onsen' },
      { icon: Clock, label: 'Ideal stay', value: '1–2 nights' },
    ],
    areas: [
      { name: 'Lake Ashi', note: 'Pirate-ship cruises and the floating Hakone shrine torii.', image: U('1578662996442-48f60103fc96') },
      { name: 'Owakudani', note: 'A steaming volcanic valley — and its famous black eggs.', image: U('1490806843957-31f4c9a91c65') },
      { name: 'Fuji Five Lakes', note: 'The classic Chureito-pagoda-and-Fuji view in spring.', image: U('1545569341-9eb8b30979d9') },
    ],
    guided: [
      { id: 'h-escape', title: 'Hakone & Mt Fuji Escape', blurb: 'The full Hakone loop and a night in a hot-spring ryokan.', style: 'Group Tour', pace: 'Relaxed', rating: 4.8, nights: 2, season: 'Year-round', price: 82000, image: U('1490806843957-31f4c9a91c65') },
      { id: 'h-lakes', title: 'Fuji Five Lakes Tour', blurb: 'The best Fuji viewpoints, Oshino Hakkai springs and Chureito pagoda.', style: 'Group Tour', pace: 'Active', rating: 4.8, nights: 3, season: 'Mar–Nov', price: 96000, image: U('1545569341-9eb8b30979d9') },
      { id: 'h-art', title: 'Hakone Onsen & Open-Air Art', blurb: 'The Open-Air Museum, a cable-car ride and a soak with a view.', style: 'Group Tour', pace: 'Relaxed', rating: 4.7, nights: 2, season: 'Year-round', price: 86000, image: U('1578662996442-48f60103fc96') },
    ],
    private: [
      { id: 'h-ryokan', title: 'Private Hakone Ryokan Retreat', blurb: 'A room with a private open-air bath and kaiseki served in-suite.', style: 'Luxury', pace: 'Relaxed', rating: 4.9, nights: 2, season: 'Year-round', price: 190000, image: U('1490806843957-31f4c9a91c65') },
      { id: 'h-discovery', title: 'Mt Fuji Private Discovery', blurb: 'A private car and guide chasing the best light on the mountain.', style: 'Bespoke Private', pace: 'Balanced', rating: 4.9, nights: 3, season: 'Mar–Nov', price: 152000, image: U('1545569341-9eb8b30979d9') },
      { id: 'h-luxe', title: 'Luxury Onsen & Fuji Views', blurb: 'A design ryokan, private guiding and the region\'s finest tables.', style: 'Luxury', pace: 'Relaxed', rating: 4.9, nights: 2, season: 'Year-round', price: 230000, image: U('1578662996442-48f60103fc96') },
    ],
    dishes: [
      { name: 'Kuro-tamago', tag: 'Owakudani', desc: 'Eggs boiled black in the volcanic springs — said to add seven years.', image: U('1580822184713-fc5400e7fe10') },
      { name: 'Ryokan Kaiseki', tag: 'In your inn', desc: 'A multi-course seasonal dinner, often served in your room.', image: U('1615361200141-f45040f367be') },
      { name: 'Soba', tag: 'Hakone-Yumoto', desc: 'Buckwheat noodles from the mountain water — hot or chilled.', image: U('1557872943-16a5ac26437e') },
      { name: 'Amazake', tag: 'Old Tokaido road', desc: 'A warm, sweet fermented-rice drink at a 400-year-old tea house.', image: U('1536256263959-770b48d82b0a') },
    ],
    restaurants: [
      { name: 'Gora Kadan', city: 'Gora', note: 'A former imperial retreat — exquisite ryokan kaiseki. Special-occasion.', price: '¥¥¥¥', image: U('1615361200141-f45040f367be') },
      { name: 'Amazake Chaya', city: 'Hatajuku', note: 'A thatched tea house on the old road, pouring amazake for 400 years.', price: '¥', image: U('1536256263959-770b48d82b0a') },
      { name: 'Hatsuhana', city: 'Hakone-Yumoto', note: 'Beloved handmade soba by the river. Simple and superb.', price: '¥¥', image: U('1557872943-16a5ac26437e') },
      { name: 'Itoh Dining', city: 'Gora', note: 'Kuroge wagyu teppanyaki with a mountain outlook.', price: '¥¥¥', image: U('1544025162-d76694265947') },
    ],
  },

  osaka: {
    name: 'Osaka',
    hero: U('1528360983277-13d401cdc186'),
    photos: [U('1528360983277-13d401cdc186'), U('1590559899731-a382839e5549'), U('1493976040374-85c8e12f0c0e'), U('1522383225653-ed111181a951'), U('1540959733332-eab4deabeeaf')],
    tagline: "Osaka, Japan's kitchen",
    heroSub: 'Street food, neon canals and the country\'s warmest welcome. A little about the city, our Osaka journeys, and what to eat while you\'re there.',
    lede: "If Kyoto is Japan's restraint, Osaka is its appetite. This is the nation's kitchen — a loud, funny, generous city built around eating well and cheaply, where the local greeting is practically \"are you eating properly?\" Come hungry, stay out late, and let Dotonbori's neon do the rest.",
    facts: [
      { icon: CalendarDays, label: 'Best time', value: 'Spring & autumn · lively year-round' },
      { icon: TrainFront, label: 'Getting there', value: '~2h 30m from Tokyo by Shinkansen' },
      { icon: Navigation, label: 'Getting around', value: 'Midosuji subway line & loop line' },
      { icon: Landmark, label: "Don't miss", value: 'Dotonbori, Osaka Castle, Kuromon' },
      { icon: Clock, label: 'Ideal stay', value: '2 days' },
    ],
    areas: [
      { name: 'Dotonbori & Namba', note: 'The neon canal, running-man sign and street-food heart.', image: U('1528360983277-13d401cdc186') },
      { name: 'Osaka Castle', note: 'A golden-trimmed keep in a moat and cherry-tree park.', image: U('1590559899731-a382839e5549') },
      { name: 'Kuromon Market', note: '"Osaka\'s kitchen" — 150 stalls of grilled everything.', image: U('1522383225653-ed111181a951') },
    ],
    guided: [
      { id: 'o-food', title: 'Osaka Street Food & Sights', blurb: 'Dotonbori, Kuromon market and the castle, tasting as you go.', style: 'Group Tour', pace: 'Active', rating: 4.8, nights: 2, season: 'Year-round', price: 68000, image: U('1528360983277-13d401cdc186') },
      { id: 'o-kobe', title: 'Osaka, Nara & Kobe', blurb: 'Three cities in three days — deer, wagyu and neon canals.', style: 'Group Tour', pace: 'Active', rating: 4.7, nights: 3, season: 'Year-round', price: 92000, image: U('1590559899731-a382839e5549') },
      { id: 'o-castle', title: 'Osaka Castle & Dotonbori', blurb: 'History by day, neon and takoyaki by night.', style: 'Group Tour', pace: 'Balanced', rating: 4.7, nights: 2, season: 'Year-round', price: 72000, image: U('1522383225653-ed111181a951') },
    ],
    private: [
      { id: 'o-crawl', title: 'Private Osaka Food Crawl', blurb: 'A local foodie guide leads you counter to counter after dark.', style: 'Bespoke Private', pace: 'Active', rating: 4.9, nights: 2, season: 'Any date', price: 115000, image: U('1580822184713-fc5400e7fe10') },
      { id: 'o-beef', title: 'Osaka & Kobe Beef Bespoke', blurb: 'A private day in Kobe and a legendary teppanyaki dinner.', style: 'Luxury', pace: 'Balanced', rating: 4.9, nights: 3, season: 'Any date', price: 165000, image: U('1544025162-d76694265947') },
      { id: 'o-luxe', title: 'Osaka Luxury City Break', blurb: 'A skyline suite, private guiding and the city\'s best tables.', style: 'Luxury', pace: 'Relaxed', rating: 4.8, nights: 2, season: 'Year-round', price: 195000, image: U('1540959733332-eab4deabeeaf') },
    ],
    dishes: [
      { name: 'Okonomiyaki', tag: 'Dotonbori', desc: 'The savoury griddle pancake — cabbage, batter and your pick of fillings.', image: U('1580822184713-fc5400e7fe10') },
      { name: 'Takoyaki', tag: 'Namba', desc: 'Molten octopus dumplings from a street griddle — Osaka\'s signature.', image: U('1557872943-16a5ac26437e') },
      { name: 'Kushikatsu', tag: 'Shinsekai', desc: 'Skewered, crumbed and deep-fried — just don\'t double-dip the sauce.', image: U('1615361200141-f45040f367be') },
      { name: 'Kobe Beef', tag: 'Kobe · nearby', desc: 'The world\'s most marbled beef, seared on a teppan just outside town.', image: U('1544025162-d76694265947') },
    ],
    restaurants: [
      { name: 'Mizuno', city: 'Dotonbori', note: 'A Michelin-listed okonomiyaki institution on the canal. Expect a queue.', price: '¥¥', image: U('1580822184713-fc5400e7fe10') },
      { name: 'Kukuru', city: 'Dotonbori', note: 'Famous, generous takoyaki under the giant octopus sign.', price: '¥', image: U('1557872943-16a5ac26437e') },
      { name: 'Daruma', city: 'Shinsekai', note: 'The original kushikatsu house since 1929 — crisp, cheap, iconic.', price: '¥¥', image: U('1615361200141-f45040f367be') },
      { name: 'Steakland Kobe', city: 'Kobe', note: 'Approachable, excellent Kobe-beef teppanyaki. Book the counter.', price: '¥¥¥', image: U('1544025162-d76694265947') },
    ],
  },
};

/* Build enriched, ready-to-render city objects. */
function buildCity(slug) {
  const c = RAW[slug];
  if (!c) return null;
  return {
    ...c,
    slug,
    guided: c.guided.map((o) => T(o, c.photos)),
    private: c.private.map((o) => T(o, c.photos)),
    count: c.guided.length + c.private.length,
  };
}

/* Nav megamenu — Japan-scoped, mirrors the country page. */
const NAV_MENU = [
  {
    label: 'Ways to travel', href: '/journeys',
    blurb: 'Two ways to see the world — pick the one that fits you.',
    items: [
      { label: 'Escorted group tours', desc: 'Expert-led, fixed departures', to: '/journeys?style=Group Tour' },
      { label: 'Tailor-made journeys', desc: 'Designed entirely around you', to: '/journeys?style=Bespoke Private' },
      { label: 'Luxury & private travel', desc: 'Elevated stays and guiding', to: '/journeys?style=Luxury' },
      { label: 'Help me decide', desc: 'Talk it through with a specialist', to: CALLBACK },
    ],
  },
  {
    label: 'Japan', href: '/journeys/japan',
    blurb: 'Cherry blossom to neon — explore Japan by city.',
    items: [
      { label: 'Tokyo', desc: 'Neon, sushi & calm gardens', to: '/journeys/japan/tokyo' },
      { label: 'Kyoto', desc: 'Temples, tea & tradition', to: '/journeys/japan/kyoto' },
      { label: 'Mt Fuji & Hakone', desc: 'Onsen & the sacred cone', to: '/journeys/japan/hakone' },
      { label: 'Osaka', desc: 'Street food & neon', to: '/journeys/japan/osaka' },
      { label: 'All Japan journeys', desc: 'Back to the country page', to: '/journeys/japan' },
    ],
  },
  {
    label: 'Destinations', href: '/journeys',
    blurb: 'Over 100 countries, shaped by specialists who know them first-hand.',
    items: [
      { label: 'Japan', desc: 'Cherry blossom to neon', to: '/journeys/japan' },
      { label: 'Switzerland', desc: 'Alpine railways & lakes', to: '/journeys?where=Switzerland' },
      { label: 'Italy', desc: 'Cities, coast & countryside', to: '/journeys?where=Italy' },
      { label: 'All destinations', desc: 'Browse every journey', to: '/journeys' },
    ],
  },
  {
    label: 'Why us', href: '/#heritage',
    blurb: 'Specialists, not salespeople — and 260 years behind every trip.',
    items: [
      { label: 'Our specialists', desc: 'The people who plan your trip', to: '/#heritage' },
      { label: 'Since 1758', desc: 'Heritage you can lean on', to: '/#heritage' },
      { label: 'Real reviews', desc: '2,400+ verified travellers', to: '/#reviews' },
      { label: 'Talk to an expert', desc: 'We pick up the phone', to: CALLBACK },
    ],
  },
];

/* ---- Reduced-motion-safe reveal (shared pattern). ---- */
function Reveal({ children, className = '', delay = 0, y = 20, as = 'div' }) {
  const M = motion[as] || motion.div;
  const reduce = useReducedMotion();
  if (reduce) return <M className={className}>{children}</M>;
  return (
    <M
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(12px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </M>
  );
}

function WordReveal({ text, className = '', accent = [], delay = 0 }) {
  const words = text.split(' ');
  const reduce = useReducedMotion();
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => (
        <span className="wr-wrap" key={i} aria-hidden="true">
          {reduce ? (
            <span className={`wr-word${accent.includes(i) ? ' wr-accent' : ''}`}>{w}</span>
          ) : (
            <motion.span
              className={`wr-word${accent.includes(i) ? ' wr-accent' : ''}`}
              initial={{ opacity: 0, y: '1em', filter: 'blur(12px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: delay + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
            >
              {w}
            </motion.span>
          )}{' '}
        </span>
      ))}
    </span>
  );
}

const WaIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.5A10 10 0 1 0 12 2zm0 18.3c-1.5 0-2.98-.4-4.27-1.16l-.3-.18-3.17 1 1.02-3.09-.2-.32A8.3 8.3 0 1 1 12 20.3z" />
    <path d="M17.5 14.4c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35z" />
  </svg>
);

function Rail({ label, title, sub, id, children, railClass = '' }) {
  const railRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    update();
    const el = railRef.current;
    el?.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { el?.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, [update]);

  const scrollBy = (dir) => {
    const el = railRef.current;
    if (!el) return;
    const card = el.firstElementChild;
    const step = (card ? card.offsetWidth : 320) + 16;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  return (
    <section className="jl-shelf" aria-labelledby={id}>
      <div className="jl-shelf-head">
        <div className="jl-shelf-heading">
          <Reveal className="h26-label jl-shelf-label" as="p">{label}</Reveal>
          <Reveal as="h2" className="jl-shelf-title" delay={0.04} id={id}>{title}</Reveal>
          <Reveal as="p" className="jl-shelf-sub" delay={0.08}>{sub}</Reveal>
        </div>
        <div className="jl-shelf-arrows" aria-hidden="true">
          <button type="button" className="jl-arrow" onClick={() => scrollBy(-1)} disabled={atStart} aria-label="Scroll left" tabIndex={-1}>
            <ChevronLeft size={20} />
          </button>
          <button type="button" className="jl-arrow" onClick={() => scrollBy(1)} disabled={atEnd} aria-label="Scroll right" tabIndex={-1}>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      <div className={`jl-rail ${railClass}`} ref={railRef} role="group" aria-label={`${title} — scroll for more`}>
        {children}
      </div>
    </section>
  );
}

function JourneyCard({ j, i, cityName, onPhotos }) {
  const waHref = `${CONTACT.whatsappHref}?text=${encodeURIComponent(`Hi Cox & Kings, I'd like to enquire about the "${j.title}" journey.`)}`;
  return (
    <Reveal className="jl-card" delay={(i % 3) * 0.05} y={24} as="article">
      <div className="jl-card-media">
        <Link to={CALLBACK} className="jl-card-media-link" aria-label={`${j.title} — enquire`}>
          <img src={img(j.image, 800)} alt={j.title} loading="lazy" />
        </Link>
        <span className="jl-card-style">{j.style}</span>
        <span className="jl-card-rating"><Star size={12} fill="currentColor" aria-hidden="true" /> {j.rating.toFixed(1)}</span>
        <span className="jl-card-region"><MapPin size={12} aria-hidden="true" /> {cityName}</span>
        {j.gallery.length > 1 && (
          <button type="button" className="jl-photos" onClick={() => onPhotos(j)} aria-label={`View ${j.gallery.length} photos of ${j.title}`}>
            <Images size={15} aria-hidden="true" /> {j.gallery.length} photos
          </button>
        )}
      </div>
      <div className="jl-card-body">
        <h3 className="jl-card-title"><Link to={CALLBACK}>{j.title}</Link></h3>
        <span className="jl-card-group"><Users size={13} aria-hidden="true" /> {j.group}</span>
        <p className="jl-card-blurb">{j.blurb}</p>
        <div className="jl-card-meta">
          <span><Clock size={14} aria-hidden="true" /> {j.nightsLabel}</span>
          <span><Calendar size={14} aria-hidden="true" /> {j.season}</span>
          <span><Gauge size={14} aria-hidden="true" /> {j.pace} pace</span>
        </div>
        <div className="jl-card-foot">
          <span className="jl-card-price"><small>from</small> {j.priceLabel} <small>/ person</small></span>
          <div className="jl-card-ctas">
            <Link to={CALLBACK} className="jl-cbtn jl-cbtn-view">View Itinerary <ArrowRight size={15} aria-hidden="true" /></Link>
            <a href={waHref} target="_blank" rel="noopener noreferrer" className="jl-cbtn jl-cbtn-wa" aria-label={`Enquire about ${j.title} on WhatsApp`}>
              <WaIcon size={15} /> Enquire Now
            </a>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function DishCard({ d }) {
  return (
    <article className="jp-dish">
      <div className="jp-dish-media">
        <img src={img(d.image, 640)} alt={d.name} loading="lazy" />
        <span className="jp-dish-tag"><MapPin size={12} aria-hidden="true" /> {d.tag}</span>
      </div>
      <div className="jp-dish-body">
        <h3 className="jp-dish-name">{d.name}</h3>
        <p className="jp-dish-desc">{d.desc}</p>
      </div>
    </article>
  );
}

function RestoCard({ r }) {
  const bookHref = `${CONTACT.whatsappHref}?text=${encodeURIComponent(`Hi Cox & Kings, I'd like to book a table at ${r.name} (${r.city}) as part of my Japan trip.`)}`;
  return (
    <article className="jp-resto-card">
      <div className="jp-resto-media">
        <img src={img(r.image, 420)} alt={r.name} loading="lazy" />
        <span className="jp-resto-price">{r.price}</span>
      </div>
      <div className="jp-resto-body">
        <h4 className="jp-resto-name">{r.name}</h4>
        <span className="jp-resto-city"><MapPin size={12} aria-hidden="true" /> {r.city}</span>
        <p className="jp-resto-note">{r.note}</p>
        <a href={bookHref} target="_blank" rel="noopener noreferrer" className="jp-resto-book" aria-label={`Book a table at ${r.name}`}>
          <Utensils size={14} aria-hidden="true" /> Book a table
        </a>
      </div>
    </article>
  );
}

function Lightbox({ data, onClose }) {
  const { title, photos } = data;
  const [idx, setIdx] = useState(data.index || 0);
  const dialogRef = useRef(null);
  const go = useCallback((dir) => setIdx((n) => (n + dir + photos.length) % photos.length), [photos.length]);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    };
    document.addEventListener('keydown', onKey);
    dialogRef.current?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [go, onClose]);
  return (
    <motion.div className="jl-lb" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} onClick={onClose} role="dialog" aria-modal="true" aria-label={`Photos of ${title}`}>
      <div className="jl-lb-top" onClick={(e) => e.stopPropagation()}>
        <span className="jl-lb-title">{title}</span>
        <span className="jl-lb-count">{idx + 1} / {photos.length}</span>
        <button type="button" className="jl-lb-close" onClick={onClose} aria-label="Close photos"><X size={22} /></button>
      </div>
      <div className="jl-lb-stage" onClick={(e) => e.stopPropagation()} ref={dialogRef} tabIndex={-1}>
        <button type="button" className="jl-lb-nav jl-lb-prev" onClick={() => go(-1)} aria-label="Previous photo"><ChevronLeft size={26} /></button>
        <AnimatePresence mode="wait">
          <motion.img key={idx} src={img(photos[idx], 1400)} alt={`${title} — photo ${idx + 1}`} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }} />
        </AnimatePresence>
        <button type="button" className="jl-lb-nav jl-lb-next" onClick={() => go(1)} aria-label="Next photo"><ChevronRight size={26} /></button>
      </div>
      <div className="jl-lb-thumbs" onClick={(e) => e.stopPropagation()}>
        {photos.map((p, k) => (
          <button key={p + k} type="button" className={`jl-lb-thumb${k === idx ? ' is-on' : ''}`} onClick={() => setIdx(k)} aria-label={`Photo ${k + 1}`} aria-current={k === idx}>
            <img src={img(p, 200)} alt="" />
          </button>
        ))}
      </div>
    </motion.div>
  );
}

export default function CityJourneys() {
  const { city: slug } = useParams();
  const city = buildCity(slug);

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightbox, setLightbox] = useState(null);

  const openPhotos = useCallback((j) => setLightbox({ title: j.title, photos: j.gallery, index: 0 }), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const lock = menuOpen || !!lightbox;
    document.body.style.overflow = lock ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen, lightbox]);

  /* Unknown city → fall back to the Japan country page. */
  if (!city) return <Navigate to="/journeys/japan" replace />;

  return (
    <div className="h26 jl jp jc">
      <a className="h26-skip" href="#tours">Skip to journeys</a>

      {/* ---------- NAV (shared /improved chrome) ---------- */}
      <header className={`h26-nav${scrolled ? ' is-solid' : ''}`}>
        <Link to="/" className="h26-brand">
          <img src="/cox-logo-new.png" alt="Cox & Kings" />
        </Link>
        <nav className="h26-links hi-nav" aria-label="Primary">
          {NAV_MENU.map((group) => (
            <div className="hi-nav-group" key={group.label}>
              <Link to={group.href} className="hi-nav-top" aria-haspopup="true">
                {group.label}
                <ChevronDown size={14} className="hi-nav-caret" aria-hidden="true" />
              </Link>
              <div className="hi-nav-flyout" role="menu">
                <div className="hi-nav-flyout-inner">
                  <p className="hi-nav-blurb">{group.blurb}</p>
                  <ul className="hi-nav-list">
                    {group.items.map((it) => (
                      <li key={it.label}>
                        <Link to={it.to} role="menuitem" className="hi-nav-item">
                          <span className="hi-nav-item-label">{it.label}</span>
                          <span className="hi-nav-item-desc">{it.desc}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </nav>
        <div className="h26-nav-cta">
          <a href={CONTACT.phoneHref} className="h26-phone">
            <Phone size={15} /> <span>{CONTACT.phoneDisplay}</span>
          </a>
          <Link to={CALLBACK} className="h26-btn h26-btn-pill">Talk to an expert</Link>
          <button className="h26-burger" aria-label="Menu" onClick={() => setMenuOpen(true)}>
            <Menu size={22} />
          </button>
        </div>
      </header>

      {/* Mobile slide-in menu */}
      <div className={`h26-menu${menuOpen ? ' is-open' : ''}`} aria-hidden={!menuOpen}>
        <div className="h26-menu-scrim" onClick={() => setMenuOpen(false)} />
        <div className="h26-menu-panel" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="h26-menu-top">
            <button className="h26-menu-close" aria-label="Close menu" onClick={() => setMenuOpen(false)}><X size={20} /></button>
            <img className="h26-menu-logo" src="/cox-logo-new.png" alt="Cox & Kings — Est. 1758" />
          </div>
          <nav className="h26-menu-primary" aria-label="Mobile primary">
            {['tokyo', 'kyoto', 'hakone', 'osaka'].map((s) => (
              <Link key={s} to={`/journeys/japan/${s}`} onClick={() => setMenuOpen(false)}>
                {RAW[s].name}<span className="h26-menu-chev"><ArrowRight size={16} /></span>
              </Link>
            ))}
          </nav>
          <div className="h26-menu-divider" />
          <div className="h26-menu-secondary">
            <Link to="/journeys/japan" onClick={() => setMenuOpen(false)}>All Japan <ArrowUpRight size={13} /></Link>
            <Link to="/journeys" onClick={() => setMenuOpen(false)}>All destinations <ArrowUpRight size={13} /></Link>
            <Link to="/" onClick={() => setMenuOpen(false)}>Home <ArrowUpRight size={13} /></Link>
            <Link to={CALLBACK} onClick={() => setMenuOpen(false)}>Contact <ArrowUpRight size={13} /></Link>
          </div>
          <a href={CONTACT.phoneHref} className="h26-btn h26-btn-pill h26-menu-cta" onClick={() => setMenuOpen(false)}>
            <Phone size={16} /> Speak to an expert
          </a>
          <div className="h26-menu-foot">
            <span className="h26-menu-eyebrow">Follow the journey</span>
            <div className="h26-menu-social">
              <a href="#" aria-label="Instagram"><Instagram size={18} /></a>
              <a href="#" aria-label="Facebook"><Facebook size={18} /></a>
              <a href="#" aria-label="YouTube"><Youtube size={18} /></a>
              <a href="#" aria-label="LinkedIn"><Linkedin size={18} /></a>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- HERO ---------- */}
      <section className="jl-hero">
        <div className="jl-hero-bg" style={{ backgroundImage: `url(${img(city.hero, 1800)})` }} aria-hidden="true" />
        <div className="jl-hero-veil" aria-hidden="true" />
        <div className="jl-hero-inner">
          {/* Breadcrumb — shows the country → city hierarchy and a way back. */}
          <Reveal className="jc-crumb" as="nav" aria-label="Breadcrumb">
            <Link to="/journeys">Journeys</Link>
            <ChevronRight size={13} aria-hidden="true" />
            <Link to="/journeys/japan">Japan</Link>
            <ChevronRight size={13} aria-hidden="true" />
            <span aria-current="page">{city.name}</span>
          </Reveal>
          <h1 className="jl-hero-title">
            <WordReveal text={city.tagline} accent={[0]} />
          </h1>
          <Reveal className="jl-hero-sub" as="p" delay={0.15}>{city.heroSub}</Reveal>
          <Reveal className="jp-hero-actions" as="div" delay={0.24}>
            <a href="#tours" className="h26-btn h26-btn-accent h26-btn-lg">View {city.name} journeys <ArrowRight size={16} /></a>
            <a href="#food" className="h26-btn h26-btn-glass h26-btn-lg"><Utensils size={16} /> What to eat</a>
          </Reveal>
        </div>
      </section>

      {/* ---------- A LITTLE ABOUT THE CITY ---------- */}
      <section className="jp-about" aria-labelledby="about-city">
        <span className="jp-about-glyph" aria-hidden="true">日本</span>
        <div className="jp-wrap">
          <div className="jp-about-top">
            <div className="jp-about-intro">
              <Reveal className="h26-label jp-eyebrow" as="p">The destination</Reveal>
              <Reveal as="h2" className="jp-title" id="about-city" delay={0.04}>
                A little about <em>{city.name}</em>
              </Reveal>
              <Reveal as="p" className="jp-lede" delay={0.08}>{city.lede}</Reveal>
            </div>
            <Reveal className="jp-facts" delay={0.12} as="aside">
              <p className="jp-facts-title">Good to know</p>
              {city.facts.map((f) => (
                <div className="jp-fact" key={f.label}>
                  <span className="jp-fact-ic"><f.icon size={17} aria-hidden="true" /></span>
                  <div className="jp-fact-txt">
                    <span className="jp-fact-label">{f.label}</span>
                    <span className="jp-fact-value">{f.value}</span>
                  </div>
                </div>
              ))}
            </Reveal>
          </div>

          {/* Neighbourhoods / areas within the city */}
          <div className="jp-hl-head">
            <Reveal className="h26-label jp-eyebrow" as="p">Where to spend your time</Reveal>
            <Reveal as="p" className="jp-hl-sub" delay={0.04}>The corners of {city.name} worth building a day around.</Reveal>
          </div>
          <div className="jp-highlights jc-areas">
            {city.areas.map((a, i) => (
              <Reveal className="jp-hl" key={a.name} delay={0.05 * i} y={24} as="article">
                <div className="jp-hl-media">
                  <img src={img(a.image, 700)} alt={a.name} loading="lazy" />
                  <span className="jp-hl-scrim" aria-hidden="true" />
                  <div className="jp-hl-cap">
                    <span className="jp-hl-idx">{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="jp-hl-name">{a.name}</h3>
                    <p className="jp-hl-note">{a.note}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- THE CITY JOURNEYS — two carousels ---------- */}
      <main className="jl-results jp-tours" id="tours">
        <div className="jl-collections">
          <Rail
            id="rail-guided"
            label={`${city.guided.length} journeys · tour-manager led`}
            title={`Guided ${city.name} journeys`}
            sub={`Escorted, expertly-led trips built around ${city.name} — everything handled, fine company along the way.`}
          >
            {city.guided.map((j, i) => <JourneyCard key={j.id} j={j} i={i} cityName={city.name} onPhotos={openPhotos} />)}
          </Rail>
          <Rail
            id="rail-private"
            label={`${city.private.length} journeys · just for you`}
            title="Private & tailor-made"
            sub={`Designed one-to-one around your dates and pace — private guides, elevated stays and rare access in ${city.name}.`}
          >
            {city.private.map((j, i) => <JourneyCard key={j.id} j={j} i={i} cityName={city.name} onPhotos={openPhotos} />)}
          </Rail>
        </div>
      </main>

      {/* ---------- THE FOOD PEOPLE EAT HERE ---------- */}
      <section className="jp-food" id="food" aria-labelledby="rail-food">
        <div className="jl-collections">
          <Rail
            id="rail-food"
            label="What's on the table"
            title={`The food people eat in ${city.name}`}
            sub={`Regional, seasonal and taken seriously. Swipe through the dishes you'll actually eat in ${city.name}.`}
            railClass="jl-rail-food"
          >
            {city.dishes.map((d) => <DishCard key={d.name} d={d} />)}
          </Rail>

          <Rail
            id="rail-resto"
            label="Reservations"
            title="Where to eat — our recommendations"
            sub="From bucket-list counters to easy neighbourhood favourites — swipe through, and book the table as part of your trip."
            railClass="jl-rail-resto"
          >
            {city.restaurants.map((r) => <RestoCard key={r.name} r={r} />)}
          </Rail>
        </div>
        <div className="jp-resto-footwrap">
          <Reveal as="p" className="jp-resto-foot" delay={0.1}>
            Want a table at any of these? Your Cox &amp; Kings specialist can request reservations
            as part of your itinerary — including the counters that book out months ahead.
          </Reveal>
        </div>
      </section>

      {/* ---------- CLOSING CTA ---------- */}
      <section className="jl-cta">
        <div className="jl-cta-bg" style={{ backgroundImage: `url(${img(city.hero, 1800)})` }} aria-hidden="true" />
        <div className="jl-cta-veil" aria-hidden="true" />
        <div className="jl-cta-inner">
          <Reveal className="h26-label jl-cta-eyebrow" as="span">Dreaming of {city.name}?</Reveal>
          <Reveal as="h2" className="jl-cta-title" delay={0.05}>
            Tell us when you'd like to go.<br /><strong>We'll shape the perfect {city.name} around you.</strong>
          </Reveal>
          <Reveal className="jl-cta-actions" delay={0.12}>
            <a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer" className="h26-btn h26-btn-accent h26-btn-lg"><MessageCircle size={17} /> WhatsApp us</a>
            <Link to={CALLBACK} className="h26-btn h26-btn-glass h26-btn-lg"><PhoneCall size={16} /> Schedule a callback</Link>
          </Reveal>
          <Reveal as="p" className="jl-cta-hours" delay={0.18}>Travel experts available 9am–9pm IST, every day.</Reveal>
        </div>
      </section>

      {/* ---------- FOOTER ---------- */}
      <footer className="h26-footer">
        <div className="h26-footer-top">
          <div className="h26-footer-brand">
            <img src="/cox-logo-new.png" alt="Cox & Kings" />
            <p>The world's most experienced travel company. Established 1758.</p>
            <div className="h26-footer-contact">
              <a href={CONTACT.phoneHref}><Phone size={15} /> {CONTACT.phoneDisplay}</a>
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            </div>
          </div>
          <div className="h26-footer-cols">
            <div>
              <h4>Japan by city</h4>
              <Link to="/journeys/japan/tokyo">Tokyo</Link>
              <Link to="/journeys/japan/kyoto">Kyoto</Link>
              <Link to="/journeys/japan/hakone">Mt Fuji &amp; Hakone</Link>
              <Link to="/journeys/japan/osaka">Osaka</Link>
            </div>
            <div>
              <h4>Company</h4>
              <Link to="/about-us2">Our story</Link>
              <Link to="/about-us2">Specialists</Link>
              <Link to={CALLBACK}>Contact</Link>
              <Link to="/#heritage">Why Cox &amp; Kings</Link>
            </div>
            <div>
              <h4>Assurance</h4>
              <Link to="/#heritage">Trust &amp; safety</Link>
              <Link to="/#heritage">Awards</Link>
              <Link to={CALLBACK}>Refund policy</Link>
              <Link to={CALLBACK}>Speak to an expert</Link>
            </div>
          </div>
        </div>
        <div className="h26-footer-bottom">
          <span>© {new Date().getFullYear()} Cox &amp; Kings. Travelling the world since 1758.</span>
          <span className="h26-footer-assoc">IATA · TAAI · ASTA</span>
        </div>
      </footer>

      <AnimatePresence>
        {lightbox && <Lightbox data={lightbox} onClose={() => setLightbox(null)} />}
      </AnimatePresence>
    </div>
  );
}
