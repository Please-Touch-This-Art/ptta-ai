import { useRef, useEffect, useCallback, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { AccentPicker } from "@/components/AccentPicker";
import { DesignPicker } from "@/components/DesignPicker";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const VIDEO_SRC = `${BASE}/videos/people-using-tactile.mp4`;
const VIDEO_POSTER = `${BASE}/posters/people-using-tactile.jpg`;

const STAGES = [
  {
    id: "touch",
    label: "STAGE 01",
    eyebrow: "THE TOUCH",
    title: "Brush becomes relief.",
    body: "Each model is a translation of a painting into a tactile contour — refined with blind and visually-impaired co-creators until it speaks clearly to the hand.",
    img: `${BASE}/printed/st-nikolai.png`,
    href: "/painting-to-model",
  },
  {
    id: "voice",
    label: "STAGE 02",
    eyebrow: "THE VOICE",
    title: "Art finds a voice.",
    body: "A custom audio guide paired to each model — describing colour, history, intent — generated and refined for every visitor.",
    img: `${BASE}/images/audio-guide.jpg`,
    href: "/audio-guide",
  },
  {
    id: "persona",
    label: "STAGE 03",
    eyebrow: "THE ARTIST",
    title: "The artist returns.",
    body: "Speak with an AI-rendered persona of the artist — Leonardo, Van Gogh, Münch — in their own voice and frame of reference.",
    img: `${BASE}/artists/leonardo.webp`,
    href: "/artist-persona",
  },
];

export default function SpotlightLanding() {
  const { t } = useLanguage();
  const [, navigate] = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeStage, setActiveStage] = useState<string>(STAGES[0].id);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
  }, []);

  const activeData = STAGES.find((s) => s.id === activeStage) ?? STAGES[0];

  const go = useCallback(
    (href: string) => (e?: React.MouseEvent) => {
      e?.preventDefault();
      navigate(href);
    },
    [navigate],
  );

  return (
    <div className="sl-root min-h-screen bg-[#140f0a] text-[#f1e8d5]">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-[#140f0a]/95 backdrop-blur border-b border-[#f1e8d5]/12" role="banner">
        <div className="grid grid-cols-3 items-center px-6 md:px-10 py-5">
          <a href="/" onClick={go("/")} className="sl-mark" aria-label="Please Touch This Art — home">
            <span className="sl-mark-symbol" aria-hidden="true">✦</span>
            <em className="sl-mark-italic">Please Touch This Art</em>
          </a>
          <nav className="hidden md:flex items-center justify-center gap-10 sl-nav text-[11px]" aria-label="Primary">
            <a href="/how-it-works"     onClick={go("/how-it-works")}     className="hover:opacity-65">PROCESS</a>
            <a href="/demo-hub"         onClick={go("/demo-hub")}         className="hover:opacity-65">PROGRAMME</a>
            <a href="/artist-persona"   onClick={go("/artist-persona")}   className="hover:opacity-65">VOICES</a>
            <a href="/future-features"  onClick={go("/future-features")}  className="hover:opacity-65">FUTURE</a>
          </nav>
          <div className="flex items-center justify-end gap-4">
            <span className="hidden md:inline sl-nav text-[10px] opacity-55">— RED BULL BASEMENT · 2026</span>
            <AccentPicker />
            <DesignPicker />
          </div>
        </div>
      </header>

      {/* HERO — full-bleed video with amber spotlight gradient */}
      <section className="relative w-full" aria-label="Hero">
        <div className="relative w-full h-[90vh] min-h-[620px] overflow-hidden bg-[#0d0907]">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover opacity-55"
            src={VIDEO_SRC}
            poster={VIDEO_POSTER}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="People testing tactile art models in a museum"
          />
          {/* Amber spotlight gradient — the "stage light" */}
          <div aria-hidden="true" className="absolute inset-0 sl-spotlight" />
          <div aria-hidden="true" className="absolute inset-0 sl-vignette" />

          <div className="relative z-10 h-full flex flex-col justify-between px-6 md:px-12 py-10 md:py-14">
            <div className="flex items-center justify-between sl-nav text-[10px] opacity-80">
              <span className="flex items-center gap-2">
                <span className="sl-stage-dot" aria-hidden="true" /> ON STAGE
              </span>
              <span>BERLIN · MMXXVI · A TACTILE DEMO</span>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65 }}
              className="max-w-4xl"
            >
              <p className="sl-eyebrow mb-8">— A demo, in three stages</p>
              <h1 className="sl-display text-[52px] md:text-[104px] leading-[0.92]">
                {t.hero.headline.leading}
                <em className="sl-display-italic">{t.hero.headline.emphasis}</em>
                {t.hero.headline.trailing ?? "."}
              </h1>
              <p className="sl-body text-[16px] md:text-[18px] leading-[1.65] opacity-85 mt-8 max-w-xl">
                {t.hero.subline.leading}
                <em className="sl-body-italic">{t.hero.subline.emphasis}</em>
                {t.hero.subline.trailing}
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-10">
                <button type="button" onClick={go("/how-it-works")} className="sl-cta sl-cta--primary">
                  <span className="sl-cta-glyph" aria-hidden="true">▶</span>
                  Begin the demo
                </button>
                <button type="button" onClick={go("/demo-hub")} className="sl-cta">
                  See the programme  →
                </button>
              </div>
            </motion.div>

            <div className="flex items-end justify-between sl-nav text-[10px] opacity-65">
              <span>STAGE 00 — OVERTURE</span>
              <span>FIG. 01 · OVERBECK MUSEUM · BREMEN</span>
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAMME — interactive stage selector */}
      <section className="px-6 md:px-12 py-24 md:py-32 border-t border-[#f1e8d5]/12" aria-label="Programme">
        <div className="flex items-baseline justify-between mb-12 md:mb-16">
          <h2 className="sl-display text-[40px] md:text-[64px] leading-[0.95]">
            The <em className="sl-display-italic">programme.</em>
          </h2>
          <p className="hidden md:block sl-nav text-[11px] opacity-65">CHOOSE A STAGE →</p>
        </div>

        {/* Tabs */}
        <div role="tablist" aria-label="Stage selector" className="flex flex-wrap items-end gap-2 md:gap-3 mb-10 md:mb-12 border-b border-[#f1e8d5]/15">
          {STAGES.map((s) => {
            const isActive = s.id === activeStage;
            return (
              <button
                key={s.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveStage(s.id)}
                className={`sl-stage-tab ${isActive ? "sl-stage-tab--active" : ""}`}
              >
                <span className="sl-nav text-[10px] block opacity-65 mb-1">{s.label}</span>
                <span className="sl-display text-[18px] md:text-[22px]">
                  <em className="sl-display-italic">{s.eyebrow.toLowerCase()}</em>
                </span>
              </button>
            );
          })}
        </div>

        {/* Active stage panel */}
        <motion.div
          key={activeData.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid md:grid-cols-12 gap-8 md:gap-12 items-center"
        >
          <div className="md:col-span-7">
            <div className="sl-frame relative w-full aspect-[16/10] overflow-hidden">
              <img
                src={activeData.img}
                alt={activeData.eyebrow}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <span className="sl-nav absolute top-3 left-3 text-[10px] opacity-90">{activeData.label}</span>
            </div>
          </div>
          <div className="md:col-span-5">
            <p className="sl-eyebrow mb-5">— {activeData.eyebrow}</p>
            <h3 className="sl-display text-[34px] md:text-[48px] leading-[1.02] mb-6">
              <em className="sl-display-italic">{activeData.title}</em>
            </h3>
            <p className="sl-body text-[15px] md:text-[17px] leading-[1.75] opacity-85 mb-10 max-w-md">
              {activeData.body}
            </p>
            <button type="button" onClick={go(activeData.href)} className="sl-cta sl-cta--primary">
              <span className="sl-cta-glyph" aria-hidden="true">▶</span>
              Open this stage
            </button>
          </div>
        </motion.div>
      </section>

      {/* MISSION — soft glow card */}
      <section className="px-6 md:px-12 py-32 md:py-44 border-t border-[#f1e8d5]/12" aria-label="Mission">
        <div className="mx-auto max-w-4xl text-center">
          <p className="sl-eyebrow mb-10">— The reason we built this</p>
          <p className="sl-display text-[34px] md:text-[60px] leading-[1.08]">
            “{t.slogan.quote.leading}
            <em className="sl-display-italic">{t.slogan.quote.emphasis}</em>
            {t.slogan.quote.trailing}”
          </p>
          <p className="sl-nav text-[10px] opacity-55 mt-12">— {t.slogan.caption.toUpperCase()}</p>
        </div>
      </section>

      {/* CURTAIN CALL — pitch closer */}
      <section className="relative px-6 md:px-12 py-28 md:py-40 border-t border-[#f1e8d5]/12 overflow-hidden" aria-label="Curtain call">
        <div aria-hidden="true" className="absolute inset-0 sl-curtain" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <p className="sl-eyebrow mb-8">— Curtain call</p>
          <h2 className="sl-display text-[40px] md:text-[76px] leading-[0.96] mb-10">
            Let's put art <em className="sl-display-italic">in every hand.</em>
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button type="button" onClick={go("/how-it-works")} className="sl-cta sl-cta--primary">
              <span className="sl-cta-glyph" aria-hidden="true">▶</span>
              Run the full demo
            </button>
            <button type="button" onClick={go("/demo-hub")} className="sl-cta">
              See every stage  →
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#f1e8d5]/12 px-6 md:px-12 py-14 text-center" role="contentinfo">
        <p className="sl-display text-[24px] md:text-[30px] mb-3">
          <em className="sl-display-italic">Please Touch This Art</em>
        </p>
        <p className="sl-nav text-[10px] opacity-55">BERLIN · MMXXVI · PRESENTED FOR RED BULL BASEMENT</p>
      </footer>
    </div>
  );
}
