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
const CONTACT_EMAIL = "contact@ptta.art";

const PEOPLE_IMAGES = [
  "people-01.jpg",
  "people-09.jpeg",
  "people-02.png",
  "people-10.jpeg",
  "people-03.png",
  "people-11.jpeg",
  "people-04.png",
  "people-12.jpeg",
  "people-05.png",
  "people-06.png",
  "people-07.png",
  "people-08.png",
].map((f) => `${BASE}/images/people-using-models/${f}`);

const tight = { letterSpacing: "-0.02em" } as const;

function DotGrid({
  total,
  filled,
  cols,
  accent = false,
}: {
  total: number;
  filled: number;
  cols: number;
  accent?: boolean;
}) {
  const filledColor = accent
    ? "var(--color-accent)"
    : "rgba(242,233,214,0.70)";
  const emptyColor = "rgba(242,233,214,0.10)";
  return (
    <div
      className="grid w-fit"
      style={{
        gridTemplateColumns: `repeat(${cols}, 7px)`,
        gap: "5px",
      }}
      aria-hidden
    >
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className="block w-[7px] h-[7px] rounded-full"
          style={{ background: i < filled ? filledColor : emptyColor }}
        />
      ))}
    </div>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p
      className="ptta-mono-eyebrow text-accent mb-3"
      style={{ fontSize: "clamp(12px, 3.4vw, 13px)" }}
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
          className="mx-auto w-full max-w-[480px] md:max-w-3xl lg:max-w-5xl px-5 md:px-8 pt-7 md:pt-12 pb-10 md:pb-12"
        >
          <motion.div
            {...fade(0.05)}
            className="relative mx-auto w-full overflow-hidden rounded-[20px] md:rounded-[28px]"
            style={{
              maxWidth: "min(100%, calc(42dvh * 16 / 9), 880px)",
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

          <div className="text-center mx-auto max-w-3xl mt-9 md:mt-12">
            <motion.h1
              {...fade(0.1)}
              className="font-serif text-ink leading-[1.06] mb-5"
              style={{
                letterSpacing: "-0.02em",
                fontSize: "clamp(2.5rem, 10vw, 4.5rem)",
              }}
            >
              <span className="block whitespace-nowrap">
                Museum art<span className="hidden lg:inline"> you can</span>
              </span>
              <span className="block lg:whitespace-nowrap">
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
              {...fade(0.17)}
              className="text-body-fg mx-auto max-w-2xl text-lg md:text-2xl leading-relaxed"
            >
              We use <strong className="font-bold text-ink">AI</strong> to turn
              museum artworks into{" "}
              <strong className="font-bold text-ink">tactile 3D models</strong>,
              for blind visitors and for all.
            </motion.p>
            <motion.div {...fade(0.25)} className="mt-7">
              <button
                type="button"
                onClick={tryDemo}
                className="ptta-cta-attn inline-flex items-center gap-2 rounded-full bg-accent px-7 md:px-8 py-3.5 md:py-4 font-semibold text-base md:text-lg transition-transform hover:scale-[1.03] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                style={{ color: "#241A0E", minHeight: 52 }}
              >
                Try the demo →
              </button>
            </motion.div>
          </div>
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

          {/* Voice of the community: demand callout */}
          <div
            className="mt-14 md:mt-16 rounded-2xl px-6 md:px-10 py-8 md:py-10 md:grid md:grid-cols-[auto_1fr] md:gap-12 md:items-center"
            style={{
              background: "rgba(242,233,214,0.05)",
              border: "1px solid var(--color-hairline)",
            }}
          >
            <div className="text-center md:text-left mb-4 md:mb-0 shrink-0">
              <p
                className="font-serif italic text-accent leading-none"
                style={{
                  fontSize: "clamp(3.5rem, 10vw, 5.25rem)",
                  letterSpacing: "-0.03em",
                }}
              >
                86%
              </p>
              <p
                className="ptta-mono-eyebrow text-muted-fg mt-3"
                style={{ fontSize: "11px" }}
              >
                say the same
              </p>
            </div>
            <div className="text-center md:text-left">
              <p
                className="font-sans text-ink leading-snug"
                style={{
                  fontSize: "clamp(1.05rem, 2.4vw, 1.35rem)",
                  fontWeight: 400,
                  letterSpacing: "-0.005em",
                }}
              >
                &ldquo;Current museums aren&rsquo;t inclusive enough for us. We
                would visit far more often if their content were accessible.&rdquo;
              </p>
              <p className="text-muted-fg mt-3 text-sm">
                Survey of blind and visually impaired museum visitors.
              </p>
            </div>
          </div>
        </section>

        {/* ── OUR SOLUTION ─────────────────────────────────────────────────── */}
        <section
          aria-label="Our solution"
          className="w-full px-5 md:px-8 py-16 md:py-24"
          style={{ background: "rgba(242,233,214,0.035)" }}
        >
          <div className="mx-auto max-w-[480px] md:max-w-5xl">
            <div className="text-center mb-12 md:mb-14 max-w-2xl mx-auto">
              <Eyebrow>Our solution</Eyebrow>
              <h2
                className="font-serif text-ink leading-[1.05] mb-6"
                style={{ ...tight, fontSize: "clamp(2.2rem, 5.5vw, 3.75rem)" }}
              >
                Art you can read with your hands.
              </h2>
              <p className="text-body-fg text-lg leading-relaxed">
                We turn museum artworks, from paintings to sculptures, into{" "}
                <strong className="font-bold text-ink">3D printed tactile models</strong>{" "}
                with a{" "}
                <strong className="font-bold text-ink">custom audio guide</strong>,
                made with blind collaborators for all visitors.
              </p>
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

        {/* ── THE DIFFERENCE ───────────────────────────────────────────────── */}
        <section
          aria-label="The difference"
          className="mx-auto w-full max-w-[480px] md:max-w-4xl px-5 md:px-8 py-12 md:py-16"
        >
          <div className="text-center max-w-2xl mx-auto mb-9 md:mb-10">
            <Eyebrow>The difference</Eyebrow>
            <h2
              className="font-serif text-ink leading-[1.06] mb-4"
              style={{ ...tight, fontSize: "clamp(2rem, 5vw, 3.25rem)" }}
            >
              A better product, at a fraction of the cost and time.
            </h2>
            <p className="text-body-fg text-base md:text-lg leading-relaxed">
              Wood-carved or clay-sculpted tactile reliefs with audio guides
              run upwards of{" "}
              <strong className="font-bold text-ink">€35,000</strong> and{" "}
              <strong className="font-bold text-ink">5 months</strong> per
              piece. PTTA closes this gap.
            </p>
          </div>

          <div className="space-y-7 md:space-y-9 max-w-3xl mx-auto">
            {/* COST */}
            <div>
              <p
                className="ptta-mono-eyebrow text-muted-fg mb-4 text-center"
                style={{ fontSize: "11px" }}
              >
                Cost per piece &nbsp;·&nbsp; one dot = €1,000
              </p>
              <div className="grid grid-cols-2 gap-6 md:gap-10">
                <div className="flex flex-col gap-3 items-center text-center">
                  <DotGrid total={35} filled={35} cols={7} />
                  <div>
                    <p
                      className="font-serif italic text-ink leading-none"
                      style={{
                        fontSize: "clamp(1.75rem, 4.5vw, 2.5rem)",
                        letterSpacing: "-0.03em",
                      }}
                    >
                      €35,000+
                    </p>
                    <p className="text-muted-fg text-sm mt-1">Conventional</p>
                  </div>
                </div>
                <div className="flex flex-col gap-3 items-center text-center">
                  <DotGrid total={35} filled={3} cols={7} accent />
                  <div>
                    <p
                      className="font-serif italic text-accent leading-none"
                      style={{
                        fontSize: "clamp(1.75rem, 4.5vw, 2.5rem)",
                        letterSpacing: "-0.03em",
                      }}
                    >
                      A fraction
                    </p>
                    <p className="text-muted-fg text-sm mt-1">With PTTA</p>
                  </div>
                </div>
              </div>
            </div>

            {/* TIME */}
            <div>
              <p
                className="ptta-mono-eyebrow text-muted-fg mb-4 text-center"
                style={{ fontSize: "11px" }}
              >
                Time per piece &nbsp;·&nbsp; one dot = 1 week
              </p>
              <div className="grid grid-cols-2 gap-6 md:gap-10">
                <div className="flex flex-col gap-3 items-center text-center">
                  <DotGrid total={20} filled={20} cols={5} />
                  <div>
                    <p
                      className="font-serif italic text-ink leading-none"
                      style={{
                        fontSize: "clamp(1.75rem, 4.5vw, 2.5rem)",
                        letterSpacing: "-0.03em",
                      }}
                    >
                      5 months
                    </p>
                    <p className="text-muted-fg text-sm mt-1">Conventional</p>
                  </div>
                </div>
                <div className="flex flex-col gap-3 items-center text-center">
                  <DotGrid total={20} filled={1} cols={5} accent />
                  <div>
                    <p
                      className="font-serif italic text-accent leading-none"
                      style={{
                        fontSize: "clamp(1.75rem, 4.5vw, 2.5rem)",
                        letterSpacing: "-0.03em",
                      }}
                    >
                      1 week
                    </p>
                    <p className="text-muted-fg text-sm mt-1">With PTTA</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── THE EXPERIENCE ───────────────────────────────────────────────── */}
        <section
          aria-label="The experience"
          className="w-full px-0 md:px-0 py-16 md:py-24"
        >
          <div className="mx-auto max-w-[480px] md:max-w-3xl px-5 md:px-8 text-center mb-10 md:mb-14">
            <Eyebrow>The experience</Eyebrow>
            <h2
              className="font-serif text-ink leading-[1.08] mb-5"
              style={{ ...tight, fontSize: "clamp(2rem, 5vw, 3.25rem)" }}
            >
              Read with your hands. Hear the story.
            </h2>
            <p className="text-body-fg text-lg leading-relaxed max-w-2xl mx-auto">
              Each piece is a tactile 3D model, shaped with blind
              collaborators. A custom audio guide narrates the artwork as
              your fingers explore it.
            </p>
          </div>

          <div
            className="relative overflow-hidden"
            aria-label="Gallery of visitors exploring PTTA tactile models in museums"
            style={{
              maskImage:
                "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
            }}
          >
            <ul
              className="ptta-marquee flex gap-3 md:gap-5 py-2"
              style={{ width: "fit-content" }}
            >
              {[...PEOPLE_IMAGES, ...PEOPLE_IMAGES].map((src, i) => (
                <li
                  key={`${src}-${i}`}
                  className="shrink-0 w-[200px] md:w-[280px] aspect-[3/4] overflow-hidden rounded-2xl"
                  style={{
                    border: "1px solid var(--color-hairline)",
                    boxShadow: "0 18px 40px -22px rgba(0,0,0,0.7)",
                  }}
                >
                  <img
                    src={src}
                    alt=""
                    aria-hidden={i >= PEOPLE_IMAGES.length}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </li>
              ))}
            </ul>
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
                Hear what they have to say.
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
              Footage from museum installations: blind and visually impaired
              visitors exploring tactile models, sharing their testimonials
              and reactions.
            </p>
          </div>
        </section>

        {/* ── ALREADY IN MUSEUMS ───────────────────────────────────────────── */}
        <section
          aria-label="Already in museums"
          className="mx-auto w-full max-w-[480px] md:max-w-5xl px-5 md:px-8 pt-6 pb-14 md:pt-10 md:pb-20"
        >
          <div className="text-center mb-9 md:mb-10 max-w-2xl mx-auto">
            <h2
              className="font-serif text-ink leading-[1.08]"
              style={{ ...tight, fontSize: "clamp(2rem, 5vw, 3.25rem)" }}
            >
              Already in museums
            </h2>
          </div>

          <dl className="flex flex-col md:flex-row md:flex-wrap items-center md:justify-center gap-3 md:gap-6">
            {/* Museums */}
            <div className="flex flex-col items-center text-center">
              <div
                className="rounded-2xl bg-white inline-flex items-center justify-center gap-7 px-7 py-3"
                style={{
                  minHeight: 150,
                  minWidth: 240,
                  boxShadow: "0 18px 40px -22px rgba(0,0,0,0.55)",
                }}
              >
                {/* Left: Lübecker on top, Overbeck below */}
                <div className="flex flex-col items-center gap-5">
                  <img
                    src={`${BASE}/logos/luebecker-museum.svg`}
                    alt="Die Lübecker Museen"
                    loading="lazy"
                    className="block w-auto h-12 object-contain"
                  />
                  <img
                    src={`${BASE}/logos/overbeck-museum.png`}
                    alt="Overbeck Museum"
                    loading="lazy"
                    className="block w-auto h-12 object-contain"
                  />
                </div>
                {/* Right: St. Nikolai + Tvibit in a row */}
                <div className="flex items-center gap-5">
                  <img
                    src={`${BASE}/logos/st-nikolai-church-museum.png`}
                    alt="St. Nikolai Church Museum"
                    loading="lazy"
                    className="block w-auto h-20 object-contain"
                  />
                  <img
                    src={`${BASE}/logos/tvibit.webp`}
                    alt="Tvibit"
                    loading="lazy"
                    className="block w-auto h-14 object-contain"
                  />
                </div>
              </div>
              <dd className="mt-5">
                <span
                  className="font-serif italic text-accent block leading-none"
                  style={{
                    fontSize: "clamp(1.65rem, 4vw, 2rem)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  27+
                </span>
                <span className="text-body-fg block mt-1.5 text-base">
                  museum installations
                </span>
              </dd>
            </div>

            {/* Accessibility partners */}
            <div className="flex flex-col items-center text-center">
              <div
                className="rounded-2xl bg-white inline-flex items-center justify-center gap-8 px-7 py-3"
                style={{
                  minHeight: 150,
                  minWidth: 240,
                  boxShadow: "0 18px 40px -22px rgba(0,0,0,0.55)",
                }}
              >
                <img
                  src={`${BASE}/logos/bsvh.png`}
                  alt="BSVH, Blinden- und Sehbehindertenverein Hamburg"
                  loading="lazy"
                  className="block w-auto h-16 object-contain"
                />
                <img
                  src={`${BASE}/logos/bsvb.png`}
                  alt="BSVB, Blinden- und Sehbehindertenverein Bremen"
                  loading="lazy"
                  className="block w-auto h-16 object-contain"
                />
              </div>
              <dd className="mt-5">
                <span
                  aria-hidden
                  className="hidden md:block leading-none"
                  style={{
                    fontSize: "clamp(1.65rem, 4vw, 2rem)",
                    visibility: "hidden",
                  }}
                >
                  &nbsp;
                </span>
                <span className="text-body-fg block md:mt-1.5 text-base">
                  Accessibility partners
                </span>
              </dd>
            </div>
          </dl>
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
