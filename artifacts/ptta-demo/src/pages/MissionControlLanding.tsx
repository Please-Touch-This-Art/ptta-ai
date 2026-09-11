import { useRef, useEffect, useCallback, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { AccentPicker } from "@/components/AccentPicker";
import { DesignPicker } from "@/components/DesignPicker";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const VIDEO_SRC = `${BASE}/videos/people-using-tactile.mp4`;
const VIDEO_POSTER = `${BASE}/posters/people-using-tactile.jpg`;

const MODULES = [
  { sig: "SIG-001", img: `${BASE}/printed/st-nikolai.png`,            title: "St. Nikolai",            type: "PAINTING / BRONZE",  href: "/painting-to-model" },
  { sig: "SIG-002", img: `${BASE}/printed/van-gogh.png`,               title: "Van Gogh, Self-Portrait", type: "PAINTING / POLYMER", href: "/painting-to-model" },
  { sig: "SIG-003", img: `${BASE}/printed/persistence-of-memory.png`,  title: "Persistence of Memory",  type: "PAINTING / RESIN",   href: "/painting-to-model" },
  { sig: "SIG-004", img: `${BASE}/printed/the-scream.png`,             title: "The Scream",             type: "PAINTING / WAX",     href: "/painting-to-model" },
];

const LOG = [
  { t: "00:00:01", k: "BOOT",     v: "Tactile engine online." },
  { t: "00:00:03", k: "VISITOR",  v: "Visitor approaches model SIG-001." },
  { t: "00:00:05", k: "AUDIO",    v: "Custom audio guide initiated." },
  { t: "00:00:08", k: "TOUCH",    v: "Bas-relief contour engaged — fingertips registered." },
];

const TELEMETRY = [
  { k: "INSTALLATIONS",  v: "27+" },
  { k: "PARTNERS",       v: "BSVH · BSVB" },
  { k: "COMMISSION",     v: "ESA — MARS" },
  { k: "ARCHIVE",        v: "20+ OVERBECK" },
];

function formatClock(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())} UTC`;
}

export default function MissionControlLanding() {
  const { t } = useLanguage();
  const [, navigate] = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [clock, setClock] = useState(() => formatClock(new Date()));

  useEffect(() => {
    const id = window.setInterval(() => setClock(formatClock(new Date())), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
  }, []);

  const go = useCallback(
    (href: string) => (e?: React.MouseEvent) => {
      e?.preventDefault();
      navigate(href);
    },
    [navigate],
  );

  return (
    <div className="mc-root min-h-screen bg-[#0a0b0e] text-[#e8e6df]">
      {/* TOP STATUS BAR — monospaced telemetry strip */}
      <div className="mc-statusbar border-b border-[#e8e6df]/10">
        <div className="grid grid-cols-3 items-center px-5 md:px-8 py-2.5 mc-mono text-[10.5px]">
          <div className="flex items-center gap-3 opacity-80">
            <span className="mc-pulse" aria-hidden="true" />
            <span>LIVE · DEMO</span>
            <span className="opacity-50">·</span>
            <span>RED BULL BASEMENT / 2026</span>
          </div>
          <div className="text-center opacity-70">
            <span>SESSION 0026 / OVERBECK · BREMEN</span>
          </div>
          <div className="flex items-center justify-end gap-3 opacity-70">
            <span>{clock}</span>
            <span className="opacity-40">·</span>
            <span>52.51° N · 13.39° E</span>
          </div>
        </div>
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-[#0a0b0e]/95 backdrop-blur border-b border-[#e8e6df]/10" role="banner">
        <div className="grid grid-cols-3 items-center px-5 md:px-8 py-4">
          <a href="/" onClick={go("/")} className="mc-mark flex items-center gap-3" aria-label="Please Touch This Art — home">
            <span className="mc-glyph" aria-hidden="true">▮▮</span>
            <span>PTTA / MISSION</span>
          </a>
          <nav className="hidden md:flex items-center justify-center gap-8 mc-mono text-[11px]" aria-label="Primary">
            <a href="/how-it-works"     onClick={go("/how-it-works")}     className="hover:opacity-60">PROCESS</a>
            <a href="/demo-hub"         onClick={go("/demo-hub")}         className="hover:opacity-60">MODULES</a>
            <a href="/artist-persona"   onClick={go("/artist-persona")}   className="hover:opacity-60">VOICES</a>
            <a href="/future-features"  onClick={go("/future-features")}  className="hover:opacity-60">ROADMAP</a>
          </nav>
          <div className="flex items-center justify-end gap-4">
            <span className="hidden md:inline mc-mono text-[10px] opacity-50">[ ESC ] EXIT DEMO</span>
            <AccentPicker />
            <DesignPicker />
          </div>
        </div>
      </header>

      {/* HERO — split panel, demo viewport */}
      <section className="px-5 md:px-8 pt-10 pb-12" aria-label="Hero">
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left meta column */}
          <div className="lg:col-span-4">
            <p className="mc-mono text-[11px] opacity-55 mb-6">
              <span className="mr-3">N° 001</span>
              <span className="mc-signal-dot mr-2" aria-hidden="true" />
              <span>{t.hero.eyebrow.toUpperCase()}</span>
            </p>
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mc-display text-[44px] md:text-[64px] leading-[0.95] mb-8"
            >
              {t.hero.headline.leading}
              <em className="mc-display-italic">{t.hero.headline.emphasis}</em>
              {t.hero.headline.trailing ?? "."}
            </motion.h1>
            <p className="mc-mono text-[12px] opacity-70 leading-[1.7] mb-10 max-w-md">
              {t.hero.subline.leading.toUpperCase()}
              <span className="mc-text-accent">{t.hero.subline.emphasis.toUpperCase()}</span>
              {t.hero.subline.trailing.toUpperCase()}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button type="button" onClick={go("/how-it-works")} className="mc-cta mc-cta--primary">
                ▶  RUN DEMO
              </button>
              <button type="button" onClick={go("/demo-hub")} className="mc-cta">
                MODULES →
              </button>
            </div>

            {/* LOG console */}
            <div className="mt-10 border border-[#e8e6df]/15 bg-[#0e1014]">
              <div className="flex items-center justify-between px-3 py-2 border-b border-[#e8e6df]/10 mc-mono text-[10px] opacity-65">
                <span>// DEMO.LOG</span>
                <span>STREAM · 4 / 4</span>
              </div>
              <ul className="px-3 py-3 space-y-1.5 mc-mono text-[11px]">
                {LOG.map((line) => (
                  <li key={line.t} className="grid grid-cols-[auto_auto_1fr] gap-3">
                    <span className="opacity-50">{line.t}</span>
                    <span className="mc-text-accent">{line.k}</span>
                    <span className="opacity-85 truncate">{line.v}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right viewport */}
          <div className="lg:col-span-8">
            <div className="mc-viewport relative w-full aspect-[16/10] overflow-hidden">
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
              {/* Frame chrome */}
              <div aria-hidden="true" className="absolute inset-0 pointer-events-none mc-viewport-chrome" />
              <div className="absolute top-3 left-3 flex items-center gap-2 mc-mono text-[10px] opacity-90">
                <span className="mc-pulse mc-pulse--solid" aria-hidden="true" />
                <span>REC · LIVE</span>
              </div>
              <div className="absolute top-3 right-3 mc-mono text-[10px] opacity-80">
                CAM 01 · WIDE · 24 FPS
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between mc-mono text-[10px] opacity-80">
                <span>FIG. 01 — VISITORS · OVERBECK MUSEUM</span>
                <span>{clock}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 md:gap-x-6 mt-4">
              {TELEMETRY.map((tel) => (
                <div key={tel.k} className="border-t border-[#e8e6df]/15 pt-3">
                  <p className="mc-mono text-[9.5px] opacity-55 mb-1">{tel.k}</p>
                  <p className="mc-mono text-[14px]">{tel.v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MODULES — specimen grid */}
      <section className="px-5 md:px-8 py-16 md:py-24 border-t border-[#e8e6df]/10" aria-label="Modules">
        <div className="flex items-baseline justify-between mb-8 md:mb-12">
          <h2 className="mc-display text-[28px] md:text-[40px]">
            <em className="mc-display-italic">Specimens</em>
          </h2>
          <p className="mc-mono text-[11px] opacity-55">04 / 27 · TAP TO INSPECT</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {MODULES.map((m) => (
            <a key={m.sig} href={m.href} onClick={go(m.href)} className="mc-specimen group block">
              <div className="aspect-[4/5] bg-[#11141a] overflow-hidden flex items-center justify-center p-5 relative">
                <img
                  src={m.img}
                  alt={m.title}
                  loading="lazy"
                  className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <span className="absolute top-2 left-2 mc-mono text-[9.5px] opacity-70">{m.sig}</span>
                <span className="absolute bottom-2 right-2 mc-mono text-[9.5px] mc-text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                  RUN →
                </span>
              </div>
              <div className="border-t border-[#e8e6df]/15 px-1 pt-2 flex items-baseline justify-between gap-2">
                <p className="text-[14px]">{m.title}</p>
                <p className="mc-mono text-[9.5px] opacity-55">{m.type}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* MANIFESTO — full-bleed quote */}
      <section className="px-5 md:px-8 py-24 md:py-36 border-t border-[#e8e6df]/10" aria-label="Manifesto">
        <div className="mx-auto max-w-5xl">
          <p className="mc-mono text-[10px] opacity-55 mb-8">[ TRANSMISSION ]  N° 002 / 2026</p>
          <p className="mc-display text-[32px] md:text-[56px] leading-[1.06]">
            {t.slogan.quote.leading}
            <em className="mc-display-italic">{t.slogan.quote.emphasis}</em>
            {t.slogan.quote.trailing}
          </p>
          <p className="mc-mono text-[10px] opacity-55 mt-12">— {t.slogan.caption.toUpperCase()}</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#e8e6df]/15 px-5 md:px-8 py-12" role="contentinfo">
        <div className="grid md:grid-cols-3 items-center gap-4 mc-mono text-[10.5px] opacity-70">
          <span>PTTA / MISSION · BERLIN · MMXXVI</span>
          <span className="text-center">PRESENTED FOR — RED BULL BASEMENT 2026</span>
          <span className="text-right">END OF TRANSMISSION ▮</span>
        </div>
      </footer>
    </div>
  );
}
