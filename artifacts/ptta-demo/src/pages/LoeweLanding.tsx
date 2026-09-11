import { useRef, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { Search, ShoppingBag, User } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { AccentPicker } from "@/components/AccentPicker";
import { DesignPicker } from "@/components/DesignPicker";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const VIDEO_SRC = `${BASE}/videos/people-using-tactile.mp4`;
const VIDEO_POSTER = `${BASE}/posters/people-using-tactile.jpg`;

const NAV = [
  { label: "WOMAN", href: "#" },
  { label: "MAN", href: "#" },
  { label: "CRAFT", href: "/how-it-works" },
  { label: "JOURNAL", href: "/artist-persona" },
  { label: "ATELIER", href: "/demo-hub" },
];

const INDEX = [
  { n: "01", img: `${BASE}/printed/st-nikolai.png`,             caption: "St. Nikolai",            sub: "Bronze relief — 2024",        href: "/painting-to-model" },
  { n: "02", img: `${BASE}/printed/van-gogh.png`,                caption: "Van Gogh, Self-Portrait", sub: "Polymer — 2024",              href: "/painting-to-model" },
  { n: "03", img: `${BASE}/printed/mona-lisa.jpg`,               caption: "Mona Lisa",              sub: "Bas-relief — 2025",           href: "/painting-to-model" },
  { n: "04", img: `${BASE}/printed/persistence-of-memory.png`,   caption: "Persistence of Memory",  sub: "Resin — 2025",                href: "/painting-to-model" },
];

const FACTS = [
  { k: "INSTALLATIONS",  v: "027" },
  { k: "PARTNERS",       v: "BSVH · BSVB" },
  { k: "COMMISSIONED BY",v: "ESA · Mars" },
  { k: "ARCHIVE",        v: "20+ Overbeck" },
];

export default function LoeweLanding() {
  const { t } = useLanguage();
  const { theme, toggle } = useTheme();
  const [, navigate] = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {});
  }, []);

  const go = useCallback(
    (href: string) => (e?: React.MouseEvent) => {
      e?.preventDefault();
      if (href.startsWith("#")) return;
      navigate(href);
    },
    [navigate],
  );

  return (
    <div className="loewe-root min-h-screen bg-[#f3efe7] text-[#1b1a17]">
      {/* HEADER */}
      <header className="loewe-header sticky top-0 z-50 bg-[#f3efe7]/95 backdrop-blur-sm border-b border-[#1b1a17]/10" role="banner">
        <div className="grid grid-cols-3 items-center px-6 md:px-10 py-5">
          <div className="flex items-center gap-6">
            <button type="button" aria-label="Search" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              <span className="loewe-mono text-[11px] hidden md:inline">SEARCH</span>
            </button>
          </div>
          <a
            href="/"
            onClick={go("/")}
            className="text-center leading-none"
            aria-label="Please Touch This Art — home"
          >
            <span className="loewe-mark block">ptta</span>
            <span className="loewe-mono block text-[9px] mt-2 opacity-55">PLEASE · TOUCH · THIS · ART</span>
          </a>
          <div className="flex items-center justify-end gap-5">
            <button
              type="button"
              onClick={toggle}
              aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
              className="flex items-center"
            >
              {theme === "light" ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="4" />
                  <line x1="12" y1="2" x2="12" y2="4" />
                  <line x1="12" y1="20" x2="12" y2="22" />
                </svg>
              )}
            </button>
            <User className="w-4 h-4 hidden md:block" aria-hidden="true" />
            <ShoppingBag className="w-4 h-4 hidden md:block" aria-hidden="true" />
            <AccentPicker />
            <DesignPicker />
          </div>
        </div>
        <nav className="hidden md:flex items-center justify-center gap-12 pb-5" aria-label="Primary">
          {NAV.map((item) => (
            <a key={item.label} href={item.href} onClick={go(item.href)} className="loewe-mono text-[11px] hover:opacity-50 transition-opacity">
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      {/* HERO — split layout with editorial copy left, image-first right */}
      <section className="px-6 md:px-10 pt-16 md:pt-24 pb-20" aria-label="Hero">
        <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-end">
          <div className="md:col-span-5 md:pt-12">
            <p className="loewe-mono text-[11px] opacity-60 mb-8">
              <span className="mr-3">N° 001</span>
              <span>{t.hero.eyebrow.toUpperCase()}</span>
            </p>
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="loewe-display text-[44px] md:text-[68px] leading-[0.95] mb-10"
            >
              {t.hero.headline.leading}
              <em className="loewe-display-italic">{t.hero.headline.emphasis}</em>
              {t.hero.headline.trailing ?? "."}
            </motion.h1>
            <p className="loewe-body text-[15px] md:text-[16px] leading-[1.7] opacity-80 max-w-md mb-10">
              {t.hero.subline.leading}
              <span className="loewe-body-italic">{t.hero.subline.emphasis}</span>
              {t.hero.subline.trailing}
            </p>
            <button type="button" onClick={go("/how-it-works")} className="loewe-cta">
              {t.hero.cta.toUpperCase()}
            </button>
          </div>
          <div className="md:col-span-7">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="relative w-full aspect-[5/6] overflow-hidden bg-[#d9d2c2]"
            >
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                src={VIDEO_SRC}
                poster={VIDEO_POSTER}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label="People testing tactile art models in a museum"
              />
            </motion.div>
            <p className="loewe-mono text-[10px] mt-3 opacity-50">
              FIG. 01 — VISITORS · OVERBECK MUSEUM · BREMEN
            </p>
          </div>
        </div>
      </section>

      {/* RUNNING NUMERALS — facts strip */}
      <section className="border-y border-[#1b1a17]/15 px-6 md:px-10 py-10" aria-label="Facts">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
          {FACTS.map((f) => (
            <div key={f.k}>
              <p className="loewe-mono text-[10px] opacity-55 mb-2">{f.k}</p>
              <p className="loewe-display text-[22px] md:text-[28px] leading-none">{f.v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* INDEX — 4-up archive */}
      <section className="px-6 md:px-10 pt-20 md:pt-28 pb-24" aria-label="Archive">
        <div className="flex items-baseline justify-between mb-10 md:mb-16">
          <h2 className="loewe-display text-[28px] md:text-[40px]">The Archive</h2>
          <p className="loewe-mono text-[11px] opacity-60">04 OF 27</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 md:gap-x-8 gap-y-14">
          {INDEX.map((item) => (
            <a key={item.caption} href={item.href} onClick={go(item.href)} className="block group">
              <div className="aspect-[4/5] bg-[#e6dfd1] overflow-hidden mb-4 flex items-center justify-center p-4">
                <img
                  src={item.img}
                  alt={item.caption}
                  loading="lazy"
                  className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex items-baseline justify-between gap-2">
                <p className="loewe-body text-[14px]">{item.caption}</p>
                <p className="loewe-mono text-[10px] opacity-55">{item.n}</p>
              </div>
              <p className="loewe-mono text-[10px] opacity-55 mt-1">{item.sub}</p>
            </a>
          ))}
        </div>
      </section>

      {/* MANIFESTO — left rule, oversized quote */}
      <section className="bg-[#1b1a17] text-[#f3efe7] px-6 md:px-10 py-24 md:py-36" aria-label="Manifesto">
        <div className="mx-auto max-w-5xl">
          <p className="loewe-mono text-[10px] opacity-60 mb-10">— MANIFESTO</p>
          <p className="loewe-display text-[32px] md:text-[56px] leading-[1.08]">
            {t.slogan.quote.leading}
            <em className="loewe-display-italic">{t.slogan.quote.emphasis}</em>
            {t.slogan.quote.trailing}
          </p>
          <p className="loewe-mono text-[10px] opacity-50 mt-12">{t.slogan.caption.toUpperCase()}</p>
        </div>
      </section>

      {/* EDITORIAL PAIR */}
      <section className="px-6 md:px-10 py-24 md:py-32" aria-label="Process">
        <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-center">
          <div className="md:col-span-6">
            <div className="aspect-[4/5] bg-[#e6dfd1] overflow-hidden">
              <img
                src={`${BASE}/images/hands-exploring-model.jpeg`}
                alt=""
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <p className="loewe-mono text-[11px] opacity-60 mb-6">— ON CRAFT</p>
            <h2 className="loewe-display text-[32px] md:text-[44px] leading-[1.05] mb-8">
              Brushstroke,<br />
              <em className="loewe-display-italic">becomes relief.</em>
            </h2>
            <p className="loewe-body text-[15px] md:text-[16px] leading-[1.7] opacity-80 mb-10">
              Each tactile model is a translation. A brushstroke turns into a contour, a horizon into an incline, colour into voice — refined over years with blind and visually-impaired co-creators.
            </p>
            <button type="button" onClick={go("/how-it-works")} className="loewe-cta">
              READ THE PROCESS
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#1b1a17]/15 px-6 md:px-10 py-20 text-center" role="contentinfo">
        <p className="loewe-mark mb-4" style={{ fontSize: 64 }}>ptta</p>
        <p className="loewe-mono text-[10px] opacity-55">BERLIN · MMXXVI · ALL HANDS</p>
      </footer>
    </div>
  );
}
