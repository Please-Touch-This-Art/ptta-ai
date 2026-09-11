import { useRef, useEffect, useCallback, useState } from "react";
import { useLocation } from "wouter";
import { Search, Menu, User, Heart, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { AccentPicker } from "@/components/AccentPicker";
import { DesignPicker } from "@/components/DesignPicker";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const VIDEO_SRC = `${BASE}/videos/people-using-tactile.mp4`;
const VIDEO_POSTER = `${BASE}/posters/people-using-tactile.jpg`;

const PRODUCT_GRID = [
  { img: `${BASE}/printed/st-nikolai.png`, caption: "St. Nikolai", href: "/painting-to-model" },
  { img: `${BASE}/printed/van-gogh.png`, caption: "Van Gogh Selbstporträt", href: "/painting-to-model" },
  { img: `${BASE}/printed/mona-lisa.jpg`, caption: "Mona Lisa", href: "/painting-to-model" },
  { img: `${BASE}/printed/persistence-of-memory.png`, caption: "Persistence of Memory", href: "/painting-to-model" },
];

const CATEGORY_TILES = [
  { img: `${BASE}/images/hands-touching-model.jpeg`, caption: "Tastmodelle", href: "/demo-hub" },
  { img: `${BASE}/images/audio-guide.jpg`, caption: "Audio-Guide", href: "/audio-guide" },
  { img: `${BASE}/images/model-with-plaque.jpeg`, caption: "Künstler-Persona", href: "/artist-persona" },
  { img: `${BASE}/images/future-of-art.jpg`, caption: "Zukunft", href: "/future-features" },
];

const EDITORIAL_PAIR = {
  thumb: `${BASE}/images/hands-exploring-model.jpeg`,
  video: VIDEO_SRC,
  poster: VIDEO_POSTER,
  title: "Damen-Sonnenbrillen-style Editorial",
  pradaTitle: "Berührung als Vision",
  subtitle: "Kühne Reflexionen über das Sehen.",
  cta: "ENTDECKEN",
  href: "/how-it-works",
};

export default function PradaLanding() {
  const { t } = useLanguage();
  const { theme, toggle } = useTheme();
  const [, navigate] = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const pairVideoRef = useRef<HTMLVideoElement>(null);
  const [collectionTab, setCollectionTab] = useState<"models" | "experiences">("models");

  useEffect(() => {
    [videoRef.current, pairVideoRef.current].forEach((v) => {
      if (!v) return;
      v.muted = true;
      v.play().catch(() => {});
    });
  }, []);

  const go = useCallback(
    (href: string) => (e?: React.MouseEvent) => {
      e?.preventDefault();
      navigate(href);
    },
    [navigate],
  );

  const activeTiles = collectionTab === "models" ? PRODUCT_GRID : CATEGORY_TILES;

  return (
    <div className="prada-root min-h-screen bg-white text-black">
      {/* HEADER — 3-column row: hamburger+search | PRADA wordmark | account/cart */}
      <header
        className="prada-header sticky top-0 left-0 right-0 z-50 bg-white border-b border-black/10"
        role="banner"
      >
        <div className="grid grid-cols-3 items-center px-6 md:px-10 py-4">
          <div className="flex items-center gap-6 text-black">
            <button type="button" aria-label="Menu" className="flex items-center gap-2">
              <Menu className="w-5 h-5" />
              <span className="prada-nav text-[13px] hidden md:inline">Menü</span>
            </button>
            <button type="button" aria-label="Search" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              <span className="prada-nav text-[13px] hidden md:inline">Suchen</span>
            </button>
          </div>

          {/* Wordmark — Bodoni serif, all-caps, dramatic letter spacing */}
          <a
            href="/"
            onClick={go("/")}
            className="text-center text-black leading-none"
            aria-label="Please Touch This Art — home"
          >
            <span className="prada-wordmark block">PTTA</span>
          </a>

          <div className="flex items-center justify-end gap-5 text-black">
            <button
              type="button"
              onClick={toggle}
              aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
              className="flex items-center"
            >
              {theme === "light" ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="4" />
                  <line x1="12" y1="2" x2="12" y2="4" />
                  <line x1="12" y1="20" x2="12" y2="22" />
                  <line x1="4.93" y1="4.93" x2="6.34" y2="6.34" />
                  <line x1="17.66" y1="17.66" x2="19.07" y2="19.07" />
                  <line x1="2" y1="12" x2="4" y2="12" />
                  <line x1="20" y1="12" x2="22" y2="12" />
                  <line x1="4.93" y1="19.07" x2="6.34" y2="17.66" />
                  <line x1="17.66" y1="6.34" x2="19.07" y2="4.93" />
                </svg>
              )}
            </button>
            <span className="prada-nav text-[13px] hidden md:inline cursor-pointer">Kontakt</span>
            <Heart className="w-4 h-4 hidden md:block" aria-hidden="true" />
            <User className="w-4 h-4 hidden md:block" aria-hidden="true" />
            <ShoppingBag className="w-4 h-4 hidden md:block" aria-hidden="true" />
            <AccentPicker />
            <DesignPicker />
          </div>
        </div>
      </header>

      {/* HERO — full-bleed video with bold sans overlay text */}
      <section className="relative w-full" aria-label="Hero">
        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-stone-200">
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
            aria-label="Tactile art experience"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.05) 35%, transparent 70%)",
            }}
          />
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-x-0 bottom-0 pb-12 md:pb-16 text-center text-white px-6"
          >
            <h1 className="prada-display text-[40px] md:text-[64px] leading-[1.02] mb-4">
              {t.hero.headline.leading}
              {t.hero.headline.emphasis}
              {t.hero.headline.trailing ?? "."}
            </h1>
            <button
              type="button"
              onClick={go("/how-it-works")}
              className="prada-link-cta prada-link-cta--on-dark"
            >
              {t.hero.cta.toUpperCase()}
            </button>
          </motion.div>
        </div>
      </section>

      {/* INTRO BLOCK — centered title + body + tabs */}
      <section className="py-20 md:py-28 px-6 md:px-10 bg-white text-center" aria-label="Collection">
        <div className="mx-auto max-w-2xl">
          <h2 className="prada-display text-[28px] md:text-[36px] mb-5">Sammlung</h2>
          <p className="prada-body text-[15px] md:text-[16px] leading-[1.6] text-black/80 mb-8">
            Von den Werken, die Pradas-Vision auf das Museum übertragen, bis zu den neuesten
            Experimenten — Vergangenheit und Gegenwart vereinen sich in funktionaler, zeitgenössischer
            Inklusion.
          </p>
          <div
            className="flex items-center justify-center gap-10"
            role="tablist"
            aria-label="Collection tab"
          >
            <button
              role="tab"
              aria-selected={collectionTab === "models"}
              onClick={() => setCollectionTab("models")}
              className={`prada-tab ${collectionTab === "models" ? "prada-tab--active" : ""}`}
            >
              Tastmodelle
            </button>
            <button
              role="tab"
              aria-selected={collectionTab === "experiences"}
              onClick={() => setCollectionTab("experiences")}
              className={`prada-tab ${collectionTab === "experiences" ? "prada-tab--active" : ""}`}
            >
              Erlebnisse
            </button>
          </div>
        </div>
      </section>

      {/* 4-up GRID — Prada's signature row of tinted-bg product tiles */}
      <section className="pb-20 md:pb-28 px-0" aria-label={`${collectionTab} grid`}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
          {activeTiles.map((tile) => (
            <a
              key={tile.caption}
              href={tile.href}
              onClick={go(tile.href)}
              className="block group bg-[#f3f3f1]"
            >
              <div className="aspect-[3/4] overflow-hidden flex items-center justify-center p-6">
                <img
                  src={tile.img}
                  alt={tile.caption}
                  loading="lazy"
                  className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
            </a>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 bg-white">
          {activeTiles.map((tile) => (
            <div key={`caption-${tile.caption}`} className="py-6 px-3 text-center">
              <p className="prada-caption text-[14px] md:text-[15px]">{tile.caption}</p>
            </div>
          ))}
        </div>
      </section>

      {/* EDITORIAL PAIR — Prada's "image + bold title + light subtitle + underlined CTA" block.
          Mirrored layout: left = small photo + text, right = full video. */}
      <section className="bg-[#f6f5f3] py-16 md:py-24" aria-label="Mission editorial">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center px-6 md:px-10">
          <div className="flex flex-col items-center text-center md:items-start md:text-left md:pl-10 lg:pl-20">
            <div className="w-[180px] md:w-[220px] aspect-[4/5] mb-8 overflow-hidden bg-white">
              <img
                src={EDITORIAL_PAIR.thumb}
                alt=""
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="prada-display text-[28px] md:text-[36px] mb-3">
              {EDITORIAL_PAIR.pradaTitle}
            </h2>
            <p className="prada-body text-[14px] md:text-[15px] text-black/70 mb-5">
              {EDITORIAL_PAIR.subtitle}
            </p>
            <button
              type="button"
              onClick={go(EDITORIAL_PAIR.href)}
              className="prada-link-cta"
            >
              {EDITORIAL_PAIR.cta}
            </button>
          </div>
          <div className="relative aspect-[5/6] overflow-hidden bg-black">
            <video
              ref={pairVideoRef}
              className="absolute inset-0 w-full h-full object-cover"
              src={EDITORIAL_PAIR.video}
              poster={EDITORIAL_PAIR.poster}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Mission video"
            />
          </div>
        </div>
      </section>

      {/* MISSION STATEMENT — centered, bold, no decoration */}
      <section className="py-24 md:py-36 px-6 md:px-10 text-center bg-white" aria-label="Mission statement">
        <div className="mx-auto max-w-2xl">
          <h2 className="prada-display text-[28px] md:text-[40px] leading-[1.15] mb-6">
            {t.slogan.quote.leading}
            {t.slogan.quote.emphasis}
            {t.slogan.quote.trailing}
          </h2>
          <p className="prada-caption text-[12px] text-black/60">{t.slogan.caption}</p>
        </div>
      </section>

      {/* TITLE+SUBTITLE+CTA BLOCK — the standalone "Herren-Sonnenbrillen / Neue geometrische Formen / ENTDECKEN" pattern. */}
      <section className="py-20 md:py-28 px-6 md:px-10 text-center bg-[#f6f5f3]" aria-label="Process">
        <h2 className="prada-display text-[28px] md:text-[40px] mb-4">Wie es funktioniert</h2>
        <p className="prada-body text-[15px] md:text-[16px] text-black/70 mb-7">
          Vom Pinselstrich zum Tastrelief — vier Schritte.
        </p>
        <button
          type="button"
          onClick={go("/how-it-works")}
          className="prada-link-cta"
        >
          ENTDECKEN
        </button>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-black/10 py-14 md:py-20 px-6 md:px-10 text-center bg-white" role="contentinfo">
        <p className="prada-wordmark text-[22px] mb-3">PTTA</p>
        <p className="prada-caption text-[11px] text-black/60">BERLIN · 2026</p>
      </footer>
    </div>
  );
}
