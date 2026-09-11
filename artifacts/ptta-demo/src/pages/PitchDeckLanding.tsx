import { useRef, useEffect, useCallback, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { AccentPicker } from "@/components/AccentPicker";
import { DesignPicker } from "@/components/DesignPicker";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const VIDEO_SRC = `${BASE}/videos/people-using-tactile.mp4`;
const VIDEO_POSTER = `${BASE}/posters/people-using-tactile.jpg`;

const SLIDES = ["01", "02", "03", "04", "05", "06"];

const PROOF = [
  { k: "Installations",         v: "27+" },
  { k: "Museum partners",       v: "BSVH · BSVB" },
  { k: "Commissioned by",       v: "ESA — Mars surface" },
  { k: "Archive", v: "20+ Overbeck models" },
];

const MODULES = [
  { n: "01", img: `${BASE}/printed/st-nikolai.png`,             title: "St. Nikolai",              tag: "painting → relief",  href: "/painting-to-model" },
  { n: "02", img: `${BASE}/printed/van-gogh.png`,                title: "Van Gogh, Self-Portrait",  tag: "painting → polymer", href: "/painting-to-model" },
  { n: "03", img: `${BASE}/images/audio-guide.jpg`,              title: "Audio Guide",              tag: "voice for art",      href: "/audio-guide" },
  { n: "04", img: `${BASE}/artists/leonardo.webp`,               title: "Artist Persona",           tag: "AI co-curator",      href: "/artist-persona" },
];

function SlidePin({ n, total = 6 }: { n: string; total?: number }) {
  return (
    <div className="pd-pin flex items-center gap-3">
      <span className="pd-pin-dot" aria-hidden="true" />
      <span className="pd-mono text-[10px]">NOW SHOWING</span>
      <span className="pd-mono text-[10px] opacity-55">{n} / {String(total).padStart(2, "0")}</span>
    </div>
  );
}

export default function PitchDeckLanding() {
  const { t } = useLanguage();
  const [, navigate] = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeSlide, setActiveSlide] = useState<string>(SLIDES[0]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
  }, []);

  // Track which slide is in view so the top bar updates as the audience scrolls.
  useEffect(() => {
    const els = SLIDES.map((id) => document.getElementById(`slide-${id}`)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id?.startsWith("slide-")) {
          setActiveSlide(visible.target.id.slice("slide-".length));
        }
      },
      { threshold: [0.35, 0.6] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const go = useCallback(
    (href: string) => (e?: React.MouseEvent) => {
      e?.preventDefault();
      navigate(href);
    },
    [navigate],
  );

  return (
    <div className="pd-root min-h-screen bg-[#0d1117] text-[#ede9e0]">
      {/* DECK HEADER — sticky */}
      <header className="sticky top-0 z-50 bg-[#0d1117]/95 backdrop-blur border-b border-[#ede9e0]/10" role="banner">
        <div className="grid grid-cols-3 items-center px-6 md:px-10 py-4">
          <a href="/" onClick={go("/")} className="pd-mark" aria-label="Please Touch This Art — home">
            <em className="pd-mark-italic">ptta</em>
            <span className="pd-mono text-[10px] block opacity-55 mt-0.5">PLEASE TOUCH THIS ART</span>
          </a>
          <div className="flex items-center justify-center">
            <SlidePin n={activeSlide} total={SLIDES.length} />
          </div>
          <div className="flex items-center justify-end gap-4">
            <span className="hidden md:inline pd-mono text-[10px] opacity-55">RED BULL BASEMENT — BERLIN 2026</span>
            <AccentPicker />
            <DesignPicker />
          </div>
        </div>
      </header>

      {/* SLIDE 01 — Title */}
      <section id="slide-01" className="pd-slide px-6 md:px-12 pt-20 md:pt-28 pb-24" aria-label="Title">
        <div className="grid md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-7">
            <p className="pd-mono text-[11px] opacity-65 mb-6">SLIDE 01 — TITLE</p>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="pd-display text-[48px] md:text-[88px] leading-[0.95]"
            >
              {t.hero.headline.leading}
              <em className="pd-display-italic">{t.hero.headline.emphasis}</em>
              {t.hero.headline.trailing ?? "."}
            </motion.h1>
            <p className="pd-body text-[16px] md:text-[18px] leading-[1.65] opacity-80 mt-8 max-w-xl">
              {t.hero.subline.leading}
              <span className="pd-body-italic">{t.hero.subline.emphasis}</span>
              {t.hero.subline.trailing}
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-10">
              <button type="button" onClick={go("/how-it-works")} className="pd-cta pd-cta--primary">
                START THE DEMO  →
              </button>
              <button type="button" onClick={go("/demo-hub")} className="pd-cta">
                Skip to modules
              </button>
            </div>
          </div>
          <div className="md:col-span-5">
            <div className="pd-frame relative aspect-[5/6] overflow-hidden">
              <img
                src={`${BASE}/images/hands-exploring-model.jpeg`}
                alt=""
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <span className="pd-mono absolute top-3 left-3 text-[9.5px] opacity-85">FIG. 01</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-12 mt-20 md:mt-28 pt-6 border-t border-[#ede9e0]/15 pd-mono text-[10px] opacity-65">
          <span className="col-span-4">01 / 06</span>
          <span className="col-span-4 text-center">PTTA · PLEASE TOUCH THIS ART</span>
          <span className="col-span-4 text-right">RED BULL BASEMENT 2026</span>
        </div>
      </section>

      {/* SLIDE 02 — The Demo */}
      <section id="slide-02" className="pd-slide pd-slide--shade px-6 md:px-12 py-24 md:py-32" aria-label="The Demo">
        <p className="pd-mono text-[11px] opacity-65 mb-6">SLIDE 02 — THE DEMO</p>
        <div className="grid md:grid-cols-12 gap-8 items-end mb-10">
          <h2 className="md:col-span-7 pd-display text-[40px] md:text-[68px] leading-[0.95]">
            Watch what happens<br />
            <em className="pd-display-italic">when art meets hands.</em>
          </h2>
          <p className="md:col-span-5 pd-body text-[15px] md:text-[16px] opacity-80 leading-[1.7]">
            A live capture from the Overbeck Museum, Bremen — visitors using our tactile renderings with paired custom audio.
          </p>
        </div>
        <div className="pd-frame relative w-full aspect-[16/8] overflow-hidden">
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
          <span className="pd-mono absolute top-3 left-3 text-[9.5px] opacity-90 flex items-center gap-2">
            <span className="pd-pin-dot" aria-hidden="true" /> LIVE FOOTAGE
          </span>
          <span className="pd-mono absolute bottom-3 right-3 text-[9.5px] opacity-80">CAM 01 · WIDE</span>
        </div>
        <div className="grid grid-cols-12 mt-16 pt-6 border-t border-[#ede9e0]/15 pd-mono text-[10px] opacity-65">
          <span className="col-span-4">02 / 06</span>
          <span className="col-span-4 text-center">THE DEMO</span>
          <span className="col-span-4 text-right">RED BULL BASEMENT 2026</span>
        </div>
      </section>

      {/* SLIDE 03 — Proof */}
      <section id="slide-03" className="pd-slide px-6 md:px-12 py-24 md:py-32" aria-label="Proof">
        <p className="pd-mono text-[11px] opacity-65 mb-6">SLIDE 03 — PROOF</p>
        <h2 className="pd-display text-[40px] md:text-[68px] leading-[0.95] mb-12 md:mb-16">
          Already <em className="pd-display-italic">in the world.</em>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
          {PROOF.map((p) => (
            <div key={p.k} className="border-t border-[#ede9e0]/20 pt-5">
              <p className="pd-mono text-[10px] opacity-55 mb-2">{p.k.toUpperCase()}</p>
              <p className="pd-display text-[22px] md:text-[28px] leading-[1.1]">{p.v}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-12 mt-20 pt-6 border-t border-[#ede9e0]/15 pd-mono text-[10px] opacity-65">
          <span className="col-span-4">03 / 06</span>
          <span className="col-span-4 text-center">TRACTION</span>
          <span className="col-span-4 text-right">RED BULL BASEMENT 2026</span>
        </div>
      </section>

      {/* SLIDE 04 — Modules */}
      <section id="slide-04" className="pd-slide pd-slide--shade px-6 md:px-12 py-24 md:py-32" aria-label="Modules">
        <p className="pd-mono text-[11px] opacity-65 mb-6">SLIDE 04 — MODULES</p>
        <div className="flex items-baseline justify-between mb-10 md:mb-14">
          <h2 className="pd-display text-[40px] md:text-[68px] leading-[0.95]">
            Four ways <em className="pd-display-italic">to touch art.</em>
          </h2>
          <p className="hidden md:block pd-mono text-[11px] opacity-65">TAP A CARD →</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {MODULES.map((m) => (
            <a key={m.n} href={m.href} onClick={go(m.href)} className="pd-card group block">
              <div className="pd-frame relative aspect-[4/5] overflow-hidden">
                <img
                  src={m.img}
                  alt={m.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <span className="pd-mono absolute top-3 left-3 text-[9.5px] opacity-90">{m.n}</span>
              </div>
              <div className="flex items-baseline justify-between gap-2 mt-3">
                <p className="text-[15px]"><em className="pd-display-italic">{m.title}</em></p>
                <span className="pd-mono text-[9.5px] opacity-65 group-hover:opacity-100 transition-opacity">RUN →</span>
              </div>
              <p className="pd-mono text-[10px] opacity-55 mt-1">{m.tag}</p>
            </a>
          ))}
        </div>
        <div className="grid grid-cols-12 mt-16 pt-6 border-t border-[#ede9e0]/15 pd-mono text-[10px] opacity-65">
          <span className="col-span-4">04 / 06</span>
          <span className="col-span-4 text-center">MODULES</span>
          <span className="col-span-4 text-right">RED BULL BASEMENT 2026</span>
        </div>
      </section>

      {/* SLIDE 05 — Mission */}
      <section id="slide-05" className="pd-slide px-6 md:px-12 py-32 md:py-44" aria-label="Mission">
        <div className="mx-auto max-w-4xl">
          <p className="pd-mono text-[11px] opacity-65 mb-8">SLIDE 05 — MISSION</p>
          <p className="pd-display text-[36px] md:text-[64px] leading-[1.05]">
            “{t.slogan.quote.leading}
            <em className="pd-display-italic">{t.slogan.quote.emphasis}</em>
            {t.slogan.quote.trailing}”
          </p>
          <p className="pd-mono text-[11px] opacity-55 mt-12">— {t.slogan.caption.toUpperCase()}</p>
        </div>
        <div className="grid grid-cols-12 mt-24 pt-6 border-t border-[#ede9e0]/15 pd-mono text-[10px] opacity-65">
          <span className="col-span-4">05 / 06</span>
          <span className="col-span-4 text-center">MISSION</span>
          <span className="col-span-4 text-right">RED BULL BASEMENT 2026</span>
        </div>
      </section>

      {/* SLIDE 06 — Ask */}
      <section id="slide-06" className="pd-slide pd-slide--shade px-6 md:px-12 py-28 md:py-40" aria-label="The Ask">
        <div className="mx-auto max-w-5xl">
          <p className="pd-mono text-[11px] opacity-65 mb-6">SLIDE 06 — THE ASK</p>
          <h2 className="pd-display text-[44px] md:text-[80px] leading-[0.95] mb-10">
            Let's put <em className="pd-display-italic">art in every hand.</em>
          </h2>
          <div className="flex flex-wrap items-center gap-4">
            <button type="button" onClick={go("/how-it-works")} className="pd-cta pd-cta--primary">
              RUN THE DEMO  →
            </button>
            <button type="button" onClick={go("/demo-hub")} className="pd-cta">
              See every module
            </button>
          </div>
        </div>
        <div className="grid grid-cols-12 mt-24 pt-6 border-t border-[#ede9e0]/15 pd-mono text-[10px] opacity-65">
          <span className="col-span-4">06 / 06</span>
          <span className="col-span-4 text-center">THANK YOU</span>
          <span className="col-span-4 text-right">— PTTA · BERLIN · MMXXVI</span>
        </div>
      </section>
    </div>
  );
}
