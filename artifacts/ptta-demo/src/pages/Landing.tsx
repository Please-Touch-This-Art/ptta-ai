import {
  useRef,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useLocation } from "wouter";
import { motion, useReducedMotion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { Header } from "@/components/Header";
import { CyclingText } from "@/components/CyclingText";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const HERO_VIDEO = `${BASE}/videos/people-using-tactile.mp4`;
const HERO_POSTER = `${BASE}/posters/people-using-tactile.jpg`;
const TESTIMONIALS_VIDEO = `${BASE}/videos/testimonials.mp4`;
const PAINTING_IMG = `${BASE}/paintings/starry-night.webp`;
const RELIEF_IMG = `${BASE}/printed/starry-night.png`;
const EXPERIENCE_IMG = `${BASE}/images/hands-exploring-model.jpeg`;
const IN_HANDS_IMG = `${BASE}/images/hands-touching-model.jpeg`;
const CONTACT_EMAIL = "contact@ptta.art";

const tight = { letterSpacing: "-0.02em" } as const;

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p
      className="ptta-mono-eyebrow text-accent mb-3"
      style={{ fontSize: "clamp(9.5px, 2.6vw, 11px)" }}
    >
      {children}
    </p>
  );
}

const STEPS = [
  {
    n: "01",
    t: "Capture the painting",
    d: "We start from a high-resolution scan of the original museum artwork, capturing every brushstroke and layer of the composition.",
  },
  {
    n: "02",
    t: "AI sculpts the depth",
    d: "Our AI reads that flat painting and converts it into a 3D depth model, turning colour, contrast and brushwork into touchable relief, designed for fingers rather than eyes.",
  },
  {
    n: "03",
    t: "Print & narrate",
    d: "The model is 3D-printed as a durable tactile relief and paired with a custom audio guide that tells the artwork's story.",
  },
];

const FACTS = [
  { v: "27+", l: "Museum installations" },
  { v: "BSVH · BSVB", l: "Accessibility partners" },
  { v: "European Space Agency", l: "Mars-surface commission" },
];

const LOGOS = [
  { src: "logos/luebecker-museum.svg", alt: "Lübecker Museen" },
  { src: "logos/st-nikolai-church-museum.png", alt: "Mahnmal St. Nikolai" },
  { src: "logos/overbeck-museum.png", alt: "Overbeck-Museum Bremen" },
  { src: "logos/european-space-agency.svg", alt: "European Space Agency" },
  { src: "logos/tvibit.webp", alt: "Tvibit" },
];

export default function Landing() {
  const heroRef = useRef<HTMLVideoElement>(null);
  const [, navigate] = useLocation();
  const reduce = useReducedMotion() ?? false;
  const [heroPlaying, setHeroPlaying] = useState(true);
  const [showFloatCta, setShowFloatCta] = useState(false);

  useEffect(() => {
    const v = heroRef.current;
    if (!v) return;
    v.muted = true;
    v.play().then(() => setHeroPlaying(true)).catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => setShowFloatCta(window.scrollY > 520);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const tryDemo = useCallback(() => navigate("/demo"), [navigate]);

  const toggleHero = useCallback(() => {
    const v = heroRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().then(() => setHeroPlaying(true)).catch(() => {});
    } else {
      v.pause();
      setHeroPlaying(false);
    }
  }, []);

  const fade = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay },
        };

  return (
    <div className="ptta-root min-h-screen bg-page text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
        style={{ color: "#241A0E" }}
      >
        Skip to content
      </a>
      <Header />

      <main id="main">
        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section
          aria-label="Introduction"
          className="mx-auto w-full max-w-[480px] md:max-w-3xl lg:max-w-5xl px-5 md:px-8 pt-7 md:pt-12"
        >
          <div className="text-center mx-auto max-w-3xl">
            <Eyebrow>
              <span className="block md:inline">AI-powered tactile art</span>
              <span className="hidden md:inline"> · </span>
              <span className="block md:inline">
                for blind &amp; low-vision visitors
              </span>
            </Eyebrow>
            <motion.h1
              {...fade(0.05)}
              className="font-serif text-ink leading-[1.02] mb-5"
              style={{ ...tight, fontSize: "clamp(1.9rem, 8.5vw, 5.75rem)" }}
            >
              <span className="block whitespace-nowrap">
                Museum art<span className="hidden lg:inline"> you can</span>
              </span>
              <span className="block whitespace-nowrap">
                <span className="lg:hidden">you can </span>
                <em className="italic text-accent">
                  <CyclingText
                    words={["touch", "feel", "experience"]}
                    reduceMotion={false}
                    caret="_"
                    blink={false}
                  />
                </em>
              </span>
            </motion.h1>
            <motion.p
              {...fade(0.12)}
              className="text-body-fg mx-auto max-w-2xl text-lg md:text-2xl leading-relaxed"
            >
              We use <strong className="font-bold text-ink">AI</strong> to turn
              museum artworks into{" "}
              <strong className="font-bold text-ink">tactile 3D models</strong>,
              for blind visitors and for all.
            </motion.p>
            <motion.div {...fade(0.2)} className="mt-7">
              <button
                type="button"
                onClick={tryDemo}
                className="ptta-cta-attn inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 font-semibold text-lg transition-transform hover:scale-[1.03] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                style={{ color: "#241A0E", minHeight: 56 }}
              >
                Try the demo →
              </button>
            </motion.div>
          </div>

          <motion.div
            {...fade(0.26)}
            className="relative mx-auto mt-9 md:mt-12 w-full overflow-hidden rounded-[20px] md:rounded-[28px]"
            style={{
              maxWidth: "calc(58dvh * 16 / 9)",
              border: "1px solid var(--color-hairline)",
            }}
          >
            <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
              <video
                ref={heroRef}
                className="absolute inset-0 h-full w-full object-cover"
                src={HERO_VIDEO}
                poster={HERO_POSTER}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                aria-label="A blind visitor reading a tactile art relief with both hands in a museum"
              />
              <button
                type="button"
                onClick={toggleHero}
                aria-label={
                  heroPlaying ? "Pause background video" : "Play background video"
                }
                className="absolute bottom-3 left-3 z-10 flex h-11 w-11 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                style={{
                  background: "rgba(3,5,8,0.6)",
                  color: "var(--color-cream)",
                  backdropFilter: "blur(4px)",
                }}
              >
                {heroPlaying ? (
                  <Pause size={15} />
                ) : (
                  <Play size={15} className="ml-0.5" />
                )}
              </button>
            </div>
          </motion.div>
        </section>

        {/* TRUSTED BY (client logos) */}
        <section
          aria-label="Trusted by museums and partners"
          className="mx-auto w-full max-w-[480px] md:max-w-5xl px-5 md:px-8 pt-6 pb-2 md:pt-10 md:pb-4"
        >
          <div className="text-center mb-6">
            <h2
              className="font-serif text-ink leading-[1.1]"
              style={{ ...tight, fontSize: "clamp(1.5rem, 3.6vw, 2.25rem)" }}
            >
              Trusted by museums &amp; partners
            </h2>
          </div>
          <div
            className="rounded-3xl bg-white px-3 py-5 sm:px-6 sm:py-7 md:px-10 md:py-9"
            style={{ boxShadow: "0 20px 55px -22px rgba(0,0,0,0.65)" }}
          >
            <ul className="grid grid-cols-5 items-center gap-2 sm:gap-4 md:gap-8">
              {LOGOS.map((l) => (
                <li
                  key={l.src}
                  className="flex min-w-0 items-center justify-center"
                >
                  <img
                    src={`${BASE}/${l.src}`}
                    alt={l.alt}
                    loading="lazy"
                    className="block w-auto max-w-full object-contain max-h-6 sm:max-h-9 md:max-h-12"
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── THE PROBLEM ──────────────────────────────────────────────────── */}
        <section
          aria-label="The problem"
          className="mx-auto w-full max-w-[480px] md:max-w-4xl px-5 md:px-8 py-16 md:py-24"
        >
          <div className="md:grid md:grid-cols-[1fr_auto] md:gap-14 md:items-center">
            <div>
              <Eyebrow>The problem</Eyebrow>
              <h2
                className="font-serif text-ink leading-[1.06] mb-5"
                style={{ ...tight, fontSize: "clamp(2rem, 5vw, 3.25rem)" }}
              >
                <span className="block">Museums say: don&rsquo;t touch.</span>
                <span className="block">We&rsquo;re changing that.</span>
              </h2>
              <p className="text-body-fg text-lg leading-relaxed max-w-xl">
                For blind and low-vision visitors, art has always lived behind
                glass, present but out of reach.
              </p>
            </div>
            <div className="mt-10 md:mt-0 md:text-right shrink-0">
              <p
                className="font-serif italic text-accent leading-none"
                style={{
                  fontSize: "clamp(3.5rem, 13vw, 6rem)",
                  letterSpacing: "-0.03em",
                }}
              >
                300M
              </p>
              <p className="text-body-fg mt-2 text-base">
                people live with vision impairment
              </p>
              <p className="text-muted-fg mt-1 text-base">
                43&nbsp;million of them fully blind.
              </p>
              <p className="text-muted-fg mt-4" style={{ fontSize: "12px" }}>
                Source: World Health Organization, 2023
              </p>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS (AI) ────────────────────────────────────────────── */}
        <section
          aria-label="How it works"
          className="w-full px-5 md:px-8 py-16 md:py-24"
          style={{ background: "rgba(242,233,214,0.035)" }}
        >
          <div className="mx-auto max-w-[480px] md:max-w-5xl">
            <div className="text-center mb-12 md:mb-14 max-w-2xl mx-auto">
              <Eyebrow>How it works</Eyebrow>
              <h2
                className="font-serif text-ink leading-[1.05]"
                style={{ ...tight, fontSize: "clamp(2.2rem, 5.5vw, 3.75rem)" }}
              >
                From a painting, to your fingertips.
              </h2>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-5 md:gap-3 mb-14 md:mb-16">
              <figure className="w-full max-w-[340px]">
                <div
                  className="aspect-[4/3] overflow-hidden rounded-2xl"
                  style={{ border: "1px solid var(--color-hairline)" }}
                >
                  <img
                    src={PAINTING_IMG}
                    alt="Van Gogh's The Starry Night, the original flat painting"
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <figcaption className="text-muted-fg mt-2 text-center text-sm">
                  The original painting
                </figcaption>
              </figure>

              <div
                className="flex shrink-0 flex-col items-center gap-1 px-2 md:px-4"
                aria-hidden="true"
              >
                <span className="font-serif italic text-accent text-2xl">
                  AI
                </span>
                <span
                  className="text-muted-fg"
                  style={{ fontSize: "11px", letterSpacing: "0.14em" }}
                >
                  CONVERTS DEPTH
                </span>
                <span
                  className="hidden md:block h-px w-16"
                  style={{ background: "var(--color-hairline)" }}
                />
              </div>

              <figure className="w-full max-w-[340px]">
                <div
                  className="aspect-[4/3] overflow-hidden rounded-2xl"
                  style={{ border: "1px solid var(--color-hairline)" }}
                >
                  <img
                    src={RELIEF_IMG}
                    alt="The Starry Night rebuilt as a raised, touchable 3D relief"
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <figcaption className="text-muted-fg mt-2 text-center text-sm">
                  The tactile 3D relief
                </figcaption>
              </figure>
            </div>

            <ol className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {STEPS.map((s) => (
                <li key={s.n}>
                  <p
                    className="font-serif italic text-accent leading-none mb-4"
                    style={{ fontSize: "2rem", letterSpacing: "-0.02em" }}
                  >
                    {s.n}
                  </p>
                  <h3
                    className="font-serif text-ink text-xl md:text-2xl mb-2"
                    style={tight}
                  >
                    {s.t}
                  </h3>
                  <p className="text-body-fg text-base leading-relaxed">
                    {s.d}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── THE EXPERIENCE ───────────────────────────────────────────────── */}
        <section
          aria-label="The experience"
          className="mx-auto w-full max-w-[480px] md:max-w-5xl px-5 md:px-8 py-16 md:py-24"
        >
          <div className="md:grid md:grid-cols-2 md:gap-14 items-center">
            <div
              className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl order-2 md:order-1"
              style={{ border: "1px solid var(--color-hairline)" }}
            >
              <img
                src={EXPERIENCE_IMG}
                alt="A visitor's hands reading the raised ridges of a tactile relief"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <div className="mb-8 md:mb-0 order-1 md:order-2">
              <Eyebrow>The experience</Eyebrow>
              <h2
                className="font-serif text-ink leading-[1.08] mb-5"
                style={{ ...tight, fontSize: "clamp(2rem, 5vw, 3.25rem)" }}
              >
                Read with your hands. Hear the story.
              </h2>
              <p className="text-body-fg text-lg leading-relaxed">
                Each piece is a tactile 3D model, shaped with blind
                collaborators. A custom audio guide narrates the artwork as
                your fingers explore it.
              </p>
            </div>
          </div>
        </section>

        {/* SEE IT (video) */}
        <section
          aria-label="In the museum"
          className="w-full px-5 md:px-8 py-16 md:py-24"
          style={{ background: "rgba(242,233,214,0.035)" }}
        >
          <div className="mx-auto max-w-[480px] md:max-w-3xl lg:max-w-4xl">
            <div className="text-center mb-8 max-w-2xl mx-auto">
              <Eyebrow>In the museum</Eyebrow>
              <h2
                className="font-serif text-ink leading-[1.08]"
                style={{ ...tight, fontSize: "clamp(2rem, 5vw, 3.25rem)" }}
              >
                See it in their hands.
              </h2>
            </div>
            <div
              className="relative w-full aspect-video overflow-hidden rounded-[20px] md:rounded-[26px]"
              style={{ border: "1px solid var(--color-hairline)" }}
            >
              <video
                className="absolute inset-0 h-full w-full object-cover"
                src={TESTIMONIALS_VIDEO}
                controls
                playsInline
                preload="metadata"
                aria-label="Visitors and museum partners describing the Please Touch This Art tactile experience"
              />
            </div>
            <p className="text-muted-fg mt-3 text-sm text-center">
              Footage from museum installations: blind and low-vision visitors
              exploring tactile reliefs, with reactions from staff and
              accessibility partners.
            </p>
          </div>
        </section>

        {/* ── ALREADY IN MUSEUMS ───────────────────────────────────────────── */}
        <section
          aria-label="Already in museums"
          className="mx-auto w-full max-w-[480px] md:max-w-5xl px-5 md:px-8 py-16 md:py-24"
        >
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <h2
              className="font-serif text-ink leading-[1.08]"
              style={{ ...tight, fontSize: "clamp(2rem, 5vw, 3.25rem)" }}
            >
              Already in museums
            </h2>
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-3 divide-y divide-[var(--color-hairline)] sm:divide-y-0 sm:divide-x">
            {FACTS.map((f) => (
              <div key={f.l} className="px-4 py-5 text-center">
                <dt
                  className="font-serif italic text-accent leading-tight"
                  style={{
                    fontSize: "clamp(1.3rem,3.6vw,1.85rem)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {f.v}
                </dt>
                <dd className="text-muted-fg mt-2 text-sm">{f.l}</dd>
              </div>
            ))}
          </dl>

          <div
            className="mt-10 mx-auto max-w-3xl overflow-hidden rounded-2xl"
            style={{ border: "1px solid var(--color-hairline)" }}
          >
            <img
              src={IN_HANDS_IMG}
              alt="A visitor holding and reading a finished tactile relief in their hands"
              loading="lazy"
              className="block w-full h-auto"
            />
          </div>
        </section>

        {/* ── FOOTER ───────────────────────────────────────────────────────── */}
        <footer
          className="w-full"
          role="contentinfo"
          style={{ background: "rgba(242,233,214,0.04)" }}
        >
          <div className="mx-auto max-w-[480px] md:max-w-2xl px-5 md:px-8 py-16 md:py-20 pb-28 md:pb-32 text-center">
            <p
              className="font-serif italic text-ink leading-[1.1] mb-5"
              style={{ ...tight, fontSize: "clamp(1.75rem,5vw,2.75rem)" }}
            >
              Please touch this art.
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-muted-fg hover:text-ink transition-colors"
              style={{ fontSize: "14px" }}
            >
              {CONTACT_EMAIL}
            </a>
            <p className="text-muted-fg mt-2" style={{ fontSize: "12px" }}>
              PTTA · 2026
            </p>
          </div>
        </footer>
      </main>

      {/* Floating CTA: appears after scrolling past the hero */}
      {showFloatCta && (
        <motion.button
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          type="button"
          onClick={tryDemo}
          aria-label="Try the demo"
          className="ptta-cta-attn fixed left-1/2 z-50 -translate-x-1/2 rounded-full bg-accent px-8 py-3.5 font-semibold shadow-xl transition-transform hover:scale-[1.04] active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          style={{
            bottom: "max(1.25rem, env(safe-area-inset-bottom) + 0.75rem)",
            color: "#241A0E",
            letterSpacing: "-0.01em",
            minHeight: 52,
          }}
        >
          Try the demo →
        </motion.button>
      )}
    </div>
  );
}
