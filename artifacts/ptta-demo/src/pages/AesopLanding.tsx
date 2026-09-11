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
  { label: "Range",    href: "/demo-hub" },
  { label: "Read",     href: "/artist-persona" },
  { label: "Practice", href: "/how-it-works" },
  { label: "Stockists",href: "/future-features" },
];

const RANGE = [
  { img: `${BASE}/printed/st-nikolai.png`,             title: "St. Nikolai",            sub: "A bronze relief, hand-finished." ,         href: "/painting-to-model" },
  { img: `${BASE}/printed/van-gogh.png`,                title: "Van Gogh, self-portrait", sub: "Polymer cast in matte ivory.",            href: "/painting-to-model" },
  { img: `${BASE}/printed/mona-lisa.jpg`,               title: "Mona Lisa",              sub: "Bas-relief; reduced palette.",             href: "/painting-to-model" },
  { img: `${BASE}/printed/persistence-of-memory.png`,   title: "Persistence of Memory",  sub: "Resin, softly translucent.",               href: "/painting-to-model" },
];

const NOTES = [
  { k: "Texture",     v: "Soft, considered" },
  { k: "Sensation",   v: "Cool to warm" },
  { k: "Pairs with",  v: "Slow audio" },
  { k: "Provenance",  v: "Bremen, 2024" },
];

export default function AesopLanding() {
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
      navigate(href);
    },
    [navigate],
  );

  return (
    <div className="aesop-root min-h-screen bg-[#efe9dd] text-[#1f1d18]">
      {/* HEADER */}
      <header className="aesop-header sticky top-0 z-50 bg-[#efe9dd]/95 backdrop-blur-sm border-b border-[#1f1d18]/12" role="banner">
        <div className="grid grid-cols-3 items-center px-6 md:px-10 py-5">
          <div className="flex items-center gap-6">
            <button type="button" aria-label="Search" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              <span className="aesop-nav text-[12px] hidden md:inline">Search</span>
            </button>
          </div>
          <a
            href="/"
            onClick={go("/")}
            className="text-center leading-none"
            aria-label="Please Touch This Art — home"
          >
            <span className="aesop-wordmark block">Please Touch This Art</span>
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
            <a key={item.label} href={item.href} onClick={go(item.href)} className="aesop-nav text-[12px] hover:opacity-55 transition-opacity">
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      {/* HERO — narrow centred column, considered serif headline */}
      <section className="px-6 md:px-10 pt-28 md:pt-40 pb-20 md:pb-28 text-center" aria-label="Hero">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mx-auto max-w-2xl"
        >
          <p className="aesop-eyebrow text-[11px] mb-8">— a study in tactility</p>
          <h1 className="aesop-display text-[40px] md:text-[64px] leading-[1.05] mb-8">
            {t.hero.headline.leading}
            <em className="aesop-display-italic">{t.hero.headline.emphasis}</em>
            {t.hero.headline.trailing ?? "."}
          </h1>
          <p className="aesop-body text-[15px] md:text-[16.5px] leading-[1.75] max-w-lg mx-auto mb-12 opacity-85">
            Considered tactile renderings of museum works, made with — and for — those who experience art beyond the visual.
          </p>
          <button type="button" onClick={go("/how-it-works")} className="aesop-cta">
            Begin
          </button>
        </motion.div>
      </section>

      {/* HERO IMAGE — soft full-width */}
      <section className="px-6 md:px-10 pb-24 md:pb-32" aria-label="In practice">
        <div className="mx-auto max-w-6xl">
          <div className="relative w-full aspect-[16/9] overflow-hidden bg-[#e0d8c5]">
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
          </div>
          <p className="aesop-caption text-[12px] mt-4 opacity-65 text-center">
            Visitors with the range, Overbeck Museum, Bremen.
          </p>
        </div>
      </section>

      {/* RANGE — 4-up apothecary catalogue with descriptive captions */}
      <section className="px-6 md:px-10 pb-24 md:pb-36" aria-label="Range">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16 md:mb-20">
            <p className="aesop-eyebrow text-[11px] mb-3">— the range</p>
            <h2 className="aesop-display text-[28px] md:text-[40px]">A considered collection</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 md:gap-x-10 gap-y-16">
            {RANGE.map((item) => (
              <a key={item.title} href={item.href} onClick={go(item.href)} className="block group text-center">
                <div className="aspect-[3/4] bg-[#e0d8c5] overflow-hidden mb-5 flex items-center justify-center p-6">
                  <img
                    src={item.img}
                    alt={item.title}
                    loading="lazy"
                    className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <p className="aesop-display text-[16px] md:text-[18px] mb-1.5">{item.title}</p>
                <p className="aesop-caption text-[12px] opacity-65 leading-[1.5]">{item.sub}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* NOTES — apothecary table-of-attributes */}
      <section className="border-y border-[#1f1d18]/15 bg-[#e7dfcd] px-6 md:px-10 py-16 md:py-20" aria-label="Notes">
        <div className="mx-auto max-w-4xl">
          <p className="aesop-eyebrow text-[11px] mb-8 text-center">— notes</p>
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center md:text-left">
            {NOTES.map((n) => (
              <div key={n.k} className="md:border-l md:border-[#1f1d18]/20 md:pl-6">
                <dt className="aesop-eyebrow text-[10px] mb-2 opacity-70">{n.k}</dt>
                <dd className="aesop-display text-[16px] md:text-[18px]">{n.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* QUOTE — slim italic serif */}
      <section className="px-6 md:px-10 py-28 md:py-40 text-center" aria-label="Mission">
        <div className="mx-auto max-w-2xl">
          <p className="aesop-display-italic text-[28px] md:text-[40px] leading-[1.2] mb-8">
            “{t.slogan.quote.leading}
            {t.slogan.quote.emphasis}
            {t.slogan.quote.trailing}”
          </p>
          <p className="aesop-eyebrow text-[10px] opacity-65">{t.slogan.caption}</p>
        </div>
      </section>

      {/* EDITORIAL PAIR */}
      <section className="px-6 md:px-10 pb-28 md:pb-40" aria-label="Practice">
        <div className="mx-auto max-w-6xl grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="aspect-[4/5] overflow-hidden bg-[#e0d8c5]">
            <img
              src={`${BASE}/images/model-with-plaque.jpeg`}
              alt=""
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="md:pl-4">
            <p className="aesop-eyebrow text-[11px] mb-5">— in practice</p>
            <h2 className="aesop-display text-[28px] md:text-[40px] leading-[1.15] mb-6">
              A practice, slowly made.
            </h2>
            <p className="aesop-body text-[15px] md:text-[16.5px] leading-[1.75] opacity-80 mb-8 max-w-md">
              We work in unhurried collaboration with blind and visually-impaired co-creators, refining each model until it speaks clearly to the hand.
            </p>
            <button type="button" onClick={go("/how-it-works")} className="aesop-cta">
              Read the practice
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#1f1d18]/15 px-6 md:px-10 py-16 text-center" role="contentinfo">
        <p className="aesop-wordmark mb-3" style={{ fontSize: 24 }}>Please Touch This Art</p>
        <p className="aesop-caption text-[11px] opacity-60">Heilbronn · MMXXVI</p>
      </footer>
    </div>
  );
}
