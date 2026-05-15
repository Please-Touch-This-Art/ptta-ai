import { useRef, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { Search, User, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { AccentPicker } from "@/components/AccentPicker";
import { DesignPicker } from "@/components/DesignPicker";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const VIDEO_SRC = `${BASE}/videos/people-using-tactile.mp4`;
const VIDEO_POSTER = `${BASE}/posters/people-using-tactile.jpg`;

const NAV_ITEMS = [
  { label: "HOME", href: "/" },
  { label: "HOW IT WORKS", href: "/how-it-works" },
  { label: "DEMO HUB", href: "/demo-hub" },
  { label: "AUDIO GUIDE", href: "/audio-guide" },
  { label: "ARTIST PERSONA", href: "/artist-persona" },
  { label: "FUTURE FEATURES", href: "/future-features" },
];

const EDITORIAL_GRID = [
  {
    img: `${BASE}/printed/st-nikolai.png`,
    caption: "ST. NIKOLAI",
    href: "/painting-to-model",
  },
  {
    img: `${BASE}/printed/van-gogh.png`,
    caption: "VAN GOGH SELBSTPORTRÄT",
    href: "/painting-to-model",
  },
  {
    img: `${BASE}/printed/mona-lisa.jpg`,
    caption: "MONA LISA",
    href: "/painting-to-model",
  },
  {
    img: `${BASE}/printed/persistence-of-memory.png`,
    caption: "PERSISTENCE OF MEMORY",
    href: "/painting-to-model",
  },
];

const EDITORIAL_PAIR = {
  img: `${BASE}/images/hands-exploring-model.jpeg`,
  title: "Berührung als Übersetzung",
  body:
    "Jedes taktile Modell ist eine Übersetzung. Pinselstrich wird Relief, Horizont wird Neigung, Farbe wird Stimme. Aus jahrelanger Arbeit mit blinden Mitgestaltenden.",
  cta: "ENTDECKEN SIE DEN PROZESS",
  href: "/how-it-works",
};

export default function HermesLanding() {
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

  const handleCta = useCallback(() => navigate("/how-it-works"), [navigate]);
  const go = useCallback(
    (href: string) => (e: React.MouseEvent) => {
      e.preventDefault();
      navigate(href);
    },
    [navigate],
  );

  return (
    <div className="hermes-root min-h-screen bg-page text-ink font-hermes-sans">
      {/* HEADER — three-column row: search · wordmark · account/cart */}
      <header
        className="hermes-header sticky top-0 left-0 right-0 z-50 bg-page border-b border-hairline"
        role="banner"
      >
        <div className="grid grid-cols-3 items-center px-6 md:px-10 pt-5 pb-3">
          {/* Search */}
          <div className="flex items-center gap-2 text-ink">
            <Search className="w-4 h-4" aria-hidden="true" />
            <span className="hermes-nav-text text-[11px]">SUCHEN</span>
          </div>

          {/* Wordmark — centered, Hermès-style */}
          <a
            href="/"
            onClick={go("/")}
            className="hermes-wordmark text-center text-ink leading-none"
            aria-label="Please Touch This Art — home"
          >
            <span className="block font-hermes-serif tracking-[0.18em] text-[20px] md:text-[26px]">
              PLEASE TOUCH THIS ART
            </span>
            <span className="block hermes-nav-text text-[10px] mt-1 opacity-70">
              BERLIN
            </span>
          </a>

          {/* Theme + Account + Cart + Pickers */}
          <div className="flex items-center justify-end gap-5">
            <button
              type="button"
              onClick={toggle}
              aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
              aria-pressed={theme === "dark"}
              className="flex items-center gap-2 text-ink"
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
                  <line x1="4.93" y1="4.93" x2="6.34" y2="6.34" />
                  <line x1="17.66" y1="17.66" x2="19.07" y2="19.07" />
                  <line x1="2" y1="12" x2="4" y2="12" />
                  <line x1="20" y1="12" x2="22" y2="12" />
                  <line x1="4.93" y1="19.07" x2="6.34" y2="17.66" />
                  <line x1="17.66" y1="6.34" x2="19.07" y2="4.93" />
                </svg>
              )}
            </button>
            <div className="hidden md:flex items-center gap-1.5 text-ink">
              <User className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hermes-nav-text text-[11px]">KONTO</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5 text-ink">
              <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hermes-nav-text text-[11px]">PARTNER</span>
            </div>
            <AccentPicker />
            <DesignPicker />
          </div>
        </div>

        {/* Nav row */}
        <nav
          className="hidden md:flex items-start justify-center gap-10 lg:gap-14 pb-5"
          aria-label="Primary"
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={go(item.href)}
              className="hermes-nav-text text-[11px] text-ink whitespace-nowrap hover:opacity-60 transition-opacity"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      {/* HERO — italic serif headline, light body, underlined CTA */}
      <section className="px-6 md:px-10 pt-20 md:pt-28 pb-16 md:pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl"
        >
          <p className="hermes-nav-text text-[11px] text-ink/70 mb-10">
            {t.hero.eyebrow.toUpperCase()}
          </p>
          <h1 className="hermes-display text-ink leading-[1.02] mb-8">
            <span>{t.hero.headline.leading}</span>
            <em className="hermes-display-italic">{t.hero.headline.emphasis}</em>
            <span>{t.hero.headline.trailing ?? "."}</span>
          </h1>
          <p className="mx-auto max-w-xl text-ink/80 hermes-body text-[16px] md:text-[17px] leading-[1.7] font-light mb-10">
            {t.hero.subline.leading}
            {t.hero.subline.emphasis}
            {t.hero.subline.trailing}
          </p>
          <button
            type="button"
            onClick={handleCta}
            className="hermes-link-cta"
            aria-label={t.hero.cta}
          >
            {t.hero.cta.toUpperCase()}
          </button>
        </motion.div>
      </section>

      {/* HERO VIDEO — full-bleed, no rounded corners */}
      <section className="px-6 md:px-10 pb-20 md:pb-28">
        <div className="mx-auto max-w-7xl">
          <div className="relative w-full aspect-[16/7] overflow-hidden bg-stone-200">
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
          </div>
        </div>
      </section>

      {/* EDITORIAL GRID — 4-up product/installation tiles, Hermès-style */}
      <section className="px-6 md:px-10 pb-20 md:pb-28" aria-label="Tactile model gallery">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12">
            {EDITORIAL_GRID.map((item) => (
              <a
                key={item.caption}
                href={item.href}
                onClick={go(item.href)}
                className="block group"
              >
                <div className="aspect-square bg-surface-muted overflow-hidden mb-4">
                  <img
                    src={item.img}
                    alt={item.caption}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                </div>
                <p className="hermes-nav-text text-[11px] text-ink">{item.caption}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* MISSION QUOTE — centered italic serif epigraph */}
      <section className="px-6 md:px-10 py-24 md:py-36 text-center" aria-label="Mission">
        <div className="mx-auto max-w-2xl">
          <p className="hermes-display-italic text-ink leading-[1.15] mb-10 text-[28px] md:text-[40px]">
            “{t.slogan.quote.leading}
            {t.slogan.quote.emphasis}
            {t.slogan.quote.trailing}”
          </p>
          <p className="hermes-nav-text text-[10px] text-ink/60">
            {t.slogan.caption.toUpperCase()}
          </p>
        </div>
      </section>

      {/* EDITORIAL PAIR — image + italic title + body + underlined CTA */}
      <section className="px-6 md:px-10 pb-24 md:pb-36" aria-label="Process">
        <div className="mx-auto max-w-7xl grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="relative aspect-[5/6] overflow-hidden bg-surface-muted">
            <img
              src={EDITORIAL_PAIR.img}
              alt="Hands exploring a tactile model"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="md:pl-6 text-left">
            <h2 className="hermes-display-italic text-ink leading-[1.1] mb-6 text-[32px] md:text-[48px]">
              {EDITORIAL_PAIR.title}
            </h2>
            <p className="text-ink/80 hermes-body text-[16px] leading-[1.7] font-light mb-8 max-w-md">
              {EDITORIAL_PAIR.body}
            </p>
            <button
              type="button"
              onClick={() => navigate(EDITORIAL_PAIR.href)}
              className="hermes-link-cta"
            >
              {EDITORIAL_PAIR.cta}
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER — quiet centered closer */}
      <footer className="border-t border-hairline px-6 md:px-10 py-20 md:py-28 text-center" role="contentinfo">
        <p className="hermes-display-italic text-ink text-[28px] md:text-[36px] leading-[1.1] mb-6">
          Please touch this art.
        </p>
        <p className="hermes-nav-text text-[10px] text-ink/60">PTTA · BERLIN · 2026</p>
      </footer>
    </div>
  );
}
