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
  { label: "ATELIER", href: "/how-it-works" },
  { label: "OBJECTS", href: "/demo-hub" },
  { label: "VOICES",  href: "/artist-persona" },
  { label: "HORIZON", href: "/future-features" },
];

const RUNWAY = [
  { n: "01", img: `${BASE}/printed/the-scream.png`,         caption: "THE SCREAM",            href: "/painting-to-model" },
  { n: "02", img: `${BASE}/printed/van-gogh.png`,           caption: "VAN GOGH",              href: "/painting-to-model" },
  { n: "03", img: `${BASE}/printed/mona-lisa.jpg`,          caption: "MONA LISA",             href: "/painting-to-model" },
  { n: "04", img: `${BASE}/printed/persistence-of-memory.png`, caption: "PERSISTENCE OF MEMORY", href: "/painting-to-model" },
];

export default function SaintLaurentLanding() {
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
    <div className="ysl-root min-h-screen bg-black text-white">
      {/* HEADER */}
      <header className="ysl-header sticky top-0 z-50 bg-black border-b border-white/15" role="banner">
        <div className="grid grid-cols-3 items-center px-6 md:px-10 py-5">
          <div className="flex items-center gap-6">
            <button type="button" aria-label="Search" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              <span className="ysl-nav text-[11px] hidden md:inline">SEARCH</span>
            </button>
          </div>
          <a
            href="/"
            onClick={go("/")}
            className="text-center leading-none"
            aria-label="Please Touch This Art — home"
          >
            <span className="ysl-wordmark block">PTTA</span>
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
            <a key={item.label} href={item.href} onClick={go(item.href)} className="ysl-nav text-[11px] hover:opacity-60 transition-opacity">
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      {/* HERO — full-bleed black with oversized compressed wordmark over video */}
      <section className="relative w-full" aria-label="Hero">
        <div className="relative w-full h-[88vh] min-h-[560px] overflow-hidden bg-black">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover opacity-65"
            src={VIDEO_SRC}
            poster={VIDEO_POSTER}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="People testing tactile art models in a museum"
          />
          <div aria-hidden="true" className="absolute inset-0" style={{
            background: "linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.75) 100%)",
          }} />
          <div className="relative z-10 h-full flex flex-col justify-end px-6 md:px-10 pb-16 md:pb-20">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="ysl-display text-[20vw] md:text-[16vw] leading-[0.85] mb-6"
            >
              TOUCH<br />THIS ART.
            </motion.h1>
            <div className="flex items-end justify-between gap-6 flex-wrap">
              <p className="ysl-body text-[12px] md:text-[13px] opacity-80 max-w-md uppercase tracking-[0.18em] leading-[1.7]">
                {t.hero.subline.leading.toUpperCase()}
                <span className="ysl-body-bold">{t.hero.subline.emphasis.toUpperCase()}</span>
                {t.hero.subline.trailing.toUpperCase()}
              </p>
              <button type="button" onClick={go("/how-it-works")} className="ysl-cta">
                ENTER →
              </button>
            </div>
          </div>
          <div className="absolute top-6 left-6 md:top-10 md:left-10 z-10 flex items-center gap-3">
            <span className="block w-6 h-px bg-white" />
            <span className="ysl-nav text-[10px]">N° 2026 / 01 — BERLIN</span>
          </div>
        </div>
      </section>

      {/* RUNWAY — full-bleed alternating black/dark tiles, oversized numbers */}
      <section className="bg-black border-y border-white/15" aria-label="Runway">
        <div className="grid md:grid-cols-2">
          {RUNWAY.map((item, i) => (
            <a
              key={item.caption}
              href={item.href}
              onClick={go(item.href)}
              className={`relative aspect-[5/6] md:aspect-[4/5] group overflow-hidden ${i % 2 ? "bg-[#0a0a0a]" : "bg-[#111]"} border-b md:border-b border-white/10 ${i < RUNWAY.length - 1 ? "md:border-r" : ""}`}
            >
              <img
                src={item.img}
                alt={item.caption}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-contain p-10 md:p-16 transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <span className="absolute top-6 left-6 ysl-nav text-[10px] opacity-70">{item.n}</span>
              <span className="absolute bottom-6 left-6 right-6 ysl-display text-[28px] md:text-[36px] leading-none">
                {item.caption}
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* MANIFESTO — stark left-aligned */}
      <section className="px-6 md:px-10 py-32 md:py-44" aria-label="Manifesto">
        <div className="grid md:grid-cols-12 gap-8 items-start">
          <p className="md:col-span-3 ysl-nav text-[11px] opacity-60">
            <span className="block mb-1">— STATEMENT</span>
            N° 002 / 2026
          </p>
          <h2 className="md:col-span-9 ysl-display text-[40px] md:text-[88px] leading-[0.95]">
            {t.slogan.quote.leading.toUpperCase()}
            <span className="ysl-display-accent">{t.slogan.quote.emphasis.toUpperCase()}</span>
            {t.slogan.quote.trailing.toUpperCase()}
          </h2>
        </div>
      </section>

      {/* EDITORIAL PAIR — image left, oversized title right */}
      <section className="bg-[#0a0a0a] border-y border-white/10 px-6 md:px-10 py-24 md:py-32" aria-label="Process">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="aspect-[4/5] overflow-hidden bg-black">
            <img
              src={`${BASE}/images/hands-touching-model.jpeg`}
              alt=""
              loading="lazy"
              className="w-full h-full object-cover grayscale contrast-[1.05]"
            />
          </div>
          <div>
            <p className="ysl-nav text-[10px] opacity-60 mb-6">— THE PROCESS</p>
            <h2 className="ysl-display text-[44px] md:text-[80px] leading-[0.9] mb-8">
              BRUSH<br /><span className="ysl-display-accent">BECOMES</span><br />RELIEF.
            </h2>
            <p className="ysl-body text-[13px] md:text-[14px] opacity-75 max-w-sm uppercase tracking-[0.18em] leading-[1.8] mb-10">
              A brushstroke turns into contour. Horizon becomes incline. Colour becomes voice.
            </p>
            <button type="button" onClick={go("/how-it-works")} className="ysl-cta">
              ENTER →
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/15 px-6 md:px-10 py-20 text-center" role="contentinfo">
        <p className="ysl-display text-[12vw] md:text-[10vw] leading-none mb-6">PTTA</p>
        <p className="ysl-nav text-[10px] opacity-50">BERLIN · MMXXVI · TACTILE COUTURE</p>
      </footer>
    </div>
  );
}
