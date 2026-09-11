import { useRef, useEffect, useCallback, useState } from "react";
import type { CSSProperties, ReactNode, RefObject } from "react";
import { useLocation } from "wouter";
import { ChevronDown, ChevronUp, Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { DesignPicker } from "@/components/DesignPicker";
import { LanguageSelect } from "@/components/LanguageSelect";
import { ModelPreviewDialog } from "@/components/ModelPreviewDialog";
import { CountUpNumber } from "@/components/CountUpNumber";
import { ContactForm } from "@/components/ContactForm";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { siteCopy, type SiteLang } from "@/content/pradaCopy";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

/* The hero ships in two cuts. Desktop keeps the original 16:9 master; phones get
   a 4:5 centre crop (576×720, half the bytes) so the footage fills a portrait
   screen instead of sitting in a letterbox. */
const HERO_VIDEO_WIDE = `${BASE}/videos/people-using-tactile.mp4`;
const HERO_POSTER_WIDE = `${BASE}/posters/people-using-tactile.jpg`;
const HERO_VIDEO_PORTRAIT = `${BASE}/videos/people-using-tactile-portrait.mp4`;
const HERO_POSTER_PORTRAIT = `${BASE}/posters/people-using-tactile-portrait.jpg`;

const TESTIMONIALS_VIDEO = `${BASE}/videos/testimonials.mp4`;
const TESTIMONIALS_POSTER = `${BASE}/posters/testimonials.jpg`;

/* Photographs of finished work rather than source paintings: these are the
   objects that actually ship to a museum. */
/* Sessions with the people the work is made with. The St. Nikolai workshop
   leads; the rest are from the testing and community shoots.

   Laid out as two justified rows rather than a uniform grid. Each row is a flex
   line whose children carry `flex: <aspect>` alongside that same aspect ratio,
   which is the justified-gallery trick: widths come out proportional to the
   aspects, so every frame in a row resolves to the identical height and the row
   fills its width exactly, at any viewport. Nothing needs hand-tuned spans and
   no cell can leave a gap. */
function TestimonialAvatar({ src, name }: { src: string; name: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <img
      src={src}
      alt={name}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className="h-14 w-14 shrink-0 rounded-full object-cover md:h-16 md:w-16"
    />
  );
}

/* Portraits for the quotes. Neither has been supplied yet, so the avatar is
   allowed to fail: the block below drops the circle and centres the attribution
   instead of leaving a broken frame in the middle of a dark band. */
const TESTIMONIAL_AVATARS = [
  `${BASE}/testimonials/katja-pourshirazi.jpg`,
  `${BASE}/testimonials/hela-michalski.jpg`,
];

const COMMUNITY_LEAD = `${BASE}/exhibit/workshop-st-nikolai.jpg`;
/* Three across rather than four, and deliberately unequal: the two wider frames
   hold their rooms, the close-up of hands sits narrower between them. Because
   the row is justified, changing these aspects re-proportions the whole line and
   it still fills the width exactly. They also crop less than the squares did —
   every source here is 16:9, so a 1.5 frame keeps more of the picture than a 1:1
   one did. */
const COMMUNITY_ROW = [
  { src: `${BASE}/community/gallery-headphones.jpg`, aspect: 1.5 },
  { src: `${BASE}/community/hands-close.jpg`, aspect: 1.1 },
  { src: `${BASE}/community/reading-relief.jpg`, aspect: 1.5 },
];

/* The collage. The framed relief leads at the largest size; the country road
   keeps its own landscape shape rather than being cropped square, which was
   hiding the plinth and the wall label; and the two portraits sit under it.
   The thatched-cottage plate is gone: it photographs the same installation as
   the hero, so it read as the hero repeated.

   Proportions are chosen so the two halves finish flush. The right column is
   5/12 wide and stacks a 1.45 landscape over a row of two 0.75 portraits, which
   comes to almost exactly the height of a square hero at 7/12 wide, so the
   block tiles with no leftover space. */
/* Archived section switch. See the IMPACT block below. */
const SHOW_IMPACT: boolean = false;

const COLLAGE_HERO = `${BASE}/exhibit/gallery-relief-framed.jpg`;
const COLLAGE_WIDE = `${BASE}/exhibit/pairing-country-road.jpg`;
const COLLAGE_PAIR = [
  `${BASE}/exhibit/pairing-daffodils.jpg`,
  `${BASE}/exhibit/pairing-ferry.jpg`,
];


/* Before/after: the painting and the tactile relief made from it, cropped and
   scaled to the same frame so the wipe lands on the same composition. */
const COMPARE_BEFORE = `${BASE}/compare/vangogh-painting.jpg`;
const COMPARE_AFTER = `${BASE}/compare/vangogh-relief.jpg`;
/* The same GLB the demo's viewer loads, so the preview shows the real model
   rather than a second copy that could drift out of sync. */
/* The coloured relief: a "painting" material with the artwork baked on as a
   base-colour texture, so it turns in full colour rather than in the cream of
   the untextured print model. */
const COMPARE_MODEL = `${BASE}/models/van-gogh-colored.glb`;

function CompareSlider({
  copy,
}: {
  copy: {
    beforeLabel: string;
    afterLabel: string;
    beforeAlt: string;
    afterAlt: string;
    sliderLabel: string;
  };
}) {
  const [pos, setPos] = useState(50);
  const frameRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const posFromClientX = useCallback((clientX: number) => {
    const el = frameRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.width === 0) return;
    setPos(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)));
  }, []);

  /* Pointer input is handled here rather than left to the range element.
     Chrome orients a range input vertically when it is taller than it is
     wide, which this frame always is, so dragging it sideways mapped to
     nonsense. The input below stays for the keyboard and assistive tech. */
  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      /* Stops the browser starting a text selection or an image drag when the
         pointer leaves the frame mid-drag. Focus is unaffected: the range
         element below is the tab stop, not this div. */
      e.preventDefault();
      dragging.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
      posFromClientX(e.clientX);
    },
    [posFromClientX],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragging.current) return;
      posFromClientX(e.clientX);
    },
    [posFromClientX],
  );

  const endDrag = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  }, []);

  return (
    <div
      ref={frameRef}
      className="prada-compare"
      style={{ aspectRatio: "800 / 972" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onLostPointerCapture={endDrag}
    >
      <img
        src={COMPARE_BEFORE}
        alt={copy.beforeAlt}
        loading="lazy"
        decoding="async"
        draggable={false}
        className="prada-compare__img"
      />
      {/* Clipped from the left edge to the divider, so raising `pos` uncovers
          more painting and lowering it uncovers more relief. */}
      <div className="prada-compare__after" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
        <img
          src={COMPARE_AFTER}
          alt={copy.afterAlt}
          loading="lazy"
          decoding="async"
          draggable={false}
          className="prada-compare__img"
        />
      </div>

      <span className="prada-compare__tag prada-compare__tag--before prada-mono-caps text-[8.5px] md:text-[9px]">
        {copy.beforeLabel}
      </span>
      <span className="prada-compare__tag prada-compare__tag--after prada-mono-caps text-[8.5px] md:text-[9px]">
        {copy.afterLabel}
      </span>

      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={Math.round(pos)}
        onChange={(e) => setPos(Number(e.target.value))}
        className="prada-compare__range"
        aria-label={copy.sliderLabel}
        aria-valuetext={`${Math.round(pos)}% ${copy.beforeLabel}, ${100 - Math.round(pos)}% ${copy.afterLabel}`}
      />

      <div className="prada-compare__divider" style={{ left: `${pos}%` }} aria-hidden="true">
        <span className="prada-compare__handle">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M10 6 4 12l6 6z" />
          </svg>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M14 6l6 6-6 6z" />
          </svg>
        </span>
      </div>
    </div>
  );
}

/* Which of the six dots in a braille cell are raised for the digits 1-4.
   Dots number down the left column first (1,2,3) then down the right (4,5,6),
   which is also the order .prada-braille lays them out in. */
const BRAILLE_DIGITS: number[][] = [[1], [1, 2], [1, 4], [1, 4, 5]];

function BrailleCell({ value }: { value: number }) {
  const raised = BRAILLE_DIGITS[value - 1] ?? [];
  return (
    <span className="prada-braille" aria-hidden="true">
      {[1, 2, 3, 4, 5, 6].map((dot) => (
        <span
          key={dot}
          className={
            raised.includes(dot)
              ? "prada-braille__dot prada-braille__dot--raised"
              : "prada-braille__dot"
          }
        />
      ))}
    </span>
  );
}

/* Logos as published on pleasetouchthisart.com. KBBN is kulturbüro bremen nord;
   BSVH and BSVB are the Hamburg and Bremen blind and partially sighted
   associations. */
/* Every file here is cropped to its own ink, so these widths describe the mark
   itself rather than the whitespace its exporter happened to leave around it.
   BSVB shipped with ~8px of padding on a small canvas and Overbeck with a
   quarter of its height empty, which is why they looked shrunken beside BSVH at
   nominally similar sizes.

   BSVH and BSVB are sized so their "BSV" caps match: the cap is 0.348 of BSVH's
   ink height and 0.358 of BSVB's, so BSVB is set very slightly smaller to land
   on the same letter size. */
const PARTNER_LOGOS = [
  { src: `${BASE}/partners/overbeck.png`, name: "Overbeck-Museum", w: 215 },
  { src: `${BASE}/partners/bsvh.png`, name: "Blinden- und Sehbehindertenverein Hamburg e.V.", w: 146 },
  { src: `${BASE}/partners/bsvb.png`, name: "Blinden- und Sehbehindertenverein Bremen e.V.", w: 137 },
  { src: `${BASE}/partners/hollweg.png`, name: "Karin und Uwe Hollweg Stiftung", w: 246 },
  { src: `${BASE}/partners/tvibit.webp`, name: "Tvibit, Tromsø", w: 102 },
];

/* Everyone who has taken the work: museums showing a model, and the
   organisations that commissioned one. Sized by height rather than width so a
   square emblem and a wide wordmark carry the same weight along the row. */
const CUSTOMER_LOGOS = [
  { src: `${BASE}/partners/overbeck.png`, name: "Overbeck-Museum", h: 48 },
  { src: `${BASE}/partners/st-nikolai.svg`, name: "Mahnmal St. Nikolai", h: 72 },
  { src: `${BASE}/partners/luebecker-museen.svg`, name: "Die Lübecker Museen", h: 46 },
  /* Shipped white for a dark header, so the file is recoloured to the page's
     ink — the mark itself is untouched. */
  { src: `${BASE}/partners/esa.svg`, name: "European Space Agency", h: 32 },
  { src: `${BASE}/partners/tvibit.webp`, name: "Tvibit, Tromsø", h: 50 },
  { src: `${BASE}/partners/lwl.jpg`, name: "LWL-Museum", h: 62 },
];

/* The analysis pass lifted from the demo's ProcessingStage, reduced to the
   frame itself: the same filter ladder, accent overlays and sweep line, with
   the picker chrome and progress rings left behind. Deliberately keeps running
   under prefers-reduced-motion for the same reason the demo does — the
   animation is the content here, and stopping it leaves a still photograph
   that explains nothing. */
const SCAN_PASSES = [
  { filter: "contrast(1.55) saturate(0.4) brightness(1.02)", dots: true, heat: false, mesh: false },
  { filter: "grayscale(1) contrast(1.3) brightness(1.08)", dots: true, heat: true, mesh: false },
  { filter: "invert(1) contrast(2.3) brightness(1.3) saturate(0)", dots: false, heat: false, mesh: true },
  { filter: "contrast(1.1) saturate(1.15)", dots: false, heat: false, mesh: false },
];
const SCAN_PASS_MS = 2200;
const ACCENT_RGB = "var(--accent-rgb)";

function ScanStage({ active, alt }: { active: boolean; alt: string }) {
  const [pass, setPass] = useState(0);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(
      () => setPass((p) => (p + 1) % SCAN_PASSES.length),
      SCAN_PASS_MS,
    );
    return () => clearInterval(id);
  }, [active]);

  const step = SCAN_PASSES[pass];

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0a0806]">
      <img
        src={COMPARE_BEFORE}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover"
        style={{ filter: step.filter, transition: "filter 1.1s ease" }}
      />
      <ScanLayer
        visible={step.dots}
        style={{
          backgroundImage: `radial-gradient(circle, rgba(${ACCENT_RGB},0.75) 1px, transparent 1.6px)`,
          backgroundSize: "14px 14px",
          mixBlendMode: "screen",
        }}
      />
      <ScanLayer
        visible={step.heat}
        style={{
          background:
            "radial-gradient(ellipse 58% 52% at 50% 42%, rgba(254,240,138,0.85) 0%, rgba(var(--accent-rgb),0.75) 30%, rgba(120,18,6,0.55) 65%, rgba(12,10,9,0.5) 100%)",
          mixBlendMode: "color",
        }}
      />
      <ScanLayer
        visible={step.mesh}
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, rgba(${ACCENT_RGB},0.75) 0 1px, transparent 1px 12px), repeating-linear-gradient(90deg, rgba(${ACCENT_RGB},0.75) 0 1px, transparent 1px 12px)`,
          mixBlendMode: "screen",
        }}
      />
      {active && (
        <div
          aria-hidden="true"
          className="absolute left-0 right-0 pointer-events-none"
          style={{
            height: 2,
            top: 0,
            background: `linear-gradient(90deg, transparent, var(--color-accent), transparent)`,
            boxShadow: `0 0 12px var(--color-accent), 0 0 24px rgba(${ACCENT_RGB},0.5)`,
            animation: "ptta-scan-sweep 2.8s linear infinite",
          }}
        />
      )}
    </div>
  );
}

/* One slot of the stage. Inactive layers keep their box but stop taking
   pointer events, so a hidden comparison slider cannot be dragged by accident. */
function StageLayer({ visible, children }: { visible: boolean; children: ReactNode }) {
  return (
    <div
      className="absolute inset-0 transition-opacity duration-700"
      style={{ opacity: visible ? 1 : 0, pointerEvents: visible ? "auto" : "none" }}
      aria-hidden={visible ? undefined : true}
      inert={!visible}
    >
      {children}
    </div>
  );
}

function ScanLayer({ visible, style }: { visible: boolean; style: CSSProperties }) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none"
      style={{ ...style, opacity: visible ? 1 : 0, transition: "opacity 0.85s ease" }}
    />
  );
}

/* The finished relief.
 *
 * It sweeps between two angles instead of turning through a full circle: the
 * back of the slab is a blank slab with nothing on it, so half of a 360 showed
 * nothing at all. The sweep starts angled so the face's own left side is toward
 * the camera, and the user can take over by dragging, clamped to the same arc
 * so they cannot swing round to the blank side. The full circle stays available
 * behind the Preview in 3D button.
 *
 * `warm` runs the import and the download ahead of the step being reached, so
 * arriving at it does not stall on an 18MB fetch.
 */
/* Positive theta puts the camera to the viewer's right, which is the side that
   shows the face's own left. Verified against the model rather than assumed:
   at +40deg the right edge of the slab turns toward the viewer and the left
   cheek is presented; at -40deg it is the mirror of that. The arc therefore
   runs -8deg to +44deg and never approaches the blank back at 180deg. */
const SWEEP_CENTRE = 18;
const SWEEP_AMPLITUDE = 26;
const SWEEP_SECONDS = 14;

function RotatingModel({
  active,
  warm,
  alt,
}: {
  active: boolean;
  warm: boolean;
  alt: string;
}) {
  const [defined, setDefined] = useState(false);
  const viewerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!(active || warm) || defined) return;
    let cancelled = false;
    import("@google/model-viewer")
      .then((mod) => {
        if (cancelled) return;
        /* Same as the dialog: these GLBs are meshopt-packed and never decode
           without the decoder wired in. */
        mod.ModelViewerElement.meshoptDecoderLocation =
          "https://unpkg.com/meshoptimizer@0.20.0/meshopt_decoder.js";
        setDefined(true);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [active, warm, defined]);

  /* Pull the model into the HTTP cache while the visitor is still on the
     earlier steps, so model-viewer reads it from cache when it mounts. */
  useEffect(() => {
    if (!warm) return;
    const controller = new AbortController();
    fetch(COMPARE_MODEL, { signal: controller.signal, cache: "force-cache" }).catch(
      () => {},
    );
    return () => controller.abort();
  }, [warm]);

  /* The sweep, driven here rather than by `auto-rotate`, which only does full
     revolutions. It yields permanently the moment the visitor drags. */
  useEffect(() => {
    const el = viewerRef.current;
    if (!el || !defined) return;

    let frame = 0;
    let taken = false;
    const start = performance.now();

    const step = (now: number) => {
      if (taken) return;
      const t = ((now - start) / 1000 / SWEEP_SECONDS) * Math.PI * 2;
      /* cos, not sin: at t=0 this is the far end of the arc, which is the angle
         the element already carries as its starting `camera-orbit`. With sin it
         would jump to the middle of the sweep on the first frame. */
      const theta = SWEEP_CENTRE + SWEEP_AMPLITUDE * Math.cos(t);
      el.setAttribute("camera-orbit", `${theta.toFixed(2)}deg 82deg auto`);
      frame = requestAnimationFrame(step);
    };

    const onCameraChange = (event: Event) => {
      const detail = (event as CustomEvent<{ source?: string }>).detail;
      if (detail?.source === "user-interaction") {
        taken = true;
        cancelAnimationFrame(frame);
      }
    };

    el.addEventListener("camera-change", onCameraChange);
    frame = requestAnimationFrame(step);
    return () => {
      el.removeEventListener("camera-change", onCameraChange);
      cancelAnimationFrame(frame);
    };
  }, [defined]);

  const envUrl = `${import.meta.env.BASE_URL || "/"}environments/studio.hdr`.replace(
    /\/{2,}/g,
    "/",
  );

  return (
    <div className="absolute inset-0 bg-[#0a0806]">
      {defined && (
        <model-viewer
          ref={viewerRef}
          src={COMPARE_MODEL}
          alt={alt}
          camera-controls
          /* Zoom off, so the wheel is left alone and the page keeps scrolling
             when the pointer happens to be over the model. `camera-controls`
             otherwise binds wheel-to-zoom and swallows the event, which strands
             the reader on this step. Dragging to rotate is unaffected, and the
             full zoom stays available behind Preview in 3D. */
          disable-zoom
          disable-pan
          /* Clamped to the front arc: dragging can look along either cheek but
             never round to the blank back. */
          min-camera-orbit={`${SWEEP_CENTRE - 60}deg 65deg auto`}
          max-camera-orbit={`${SWEEP_CENTRE + 60}deg 100deg auto`}
          camera-orbit={`${SWEEP_CENTRE + SWEEP_AMPLITUDE}deg 82deg auto`}
          shadow-intensity="2.4"
          shadow-softness="0.4"
          exposure="0.95"
          environment-image={envUrl}
          interaction-prompt="none"
          touch-action="pan-y"
          loading="eager"
          reveal="auto"
          style={{ width: "100%", height: "100%", display: "block" }}
        />
      )}
    </div>
  );
}

/* True once the element comes within `rootMargin` of the viewport, and stays
   true afterwards. Used to start fetching the 3D model while the visitor is
   still reading the earlier steps, rather than when they arrive at it. */
function useNearViewport(ref: RefObject<HTMLElement | null>, rootMargin: string) {
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || near) return;
    if (typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, rootMargin, near]);

  return near;
}

/* Turns scroll position through a tall section into a step index. The section
   is `count` viewports tall and its inner panel is sticky, so the page appears
   to hold still while the steps advance under it. Measured off the section's
   own rect rather than a global scroll offset, so it stays correct no matter
   what sits above it on the page. */
function useScrollStep(ref: RefObject<HTMLElement | null>, count: number) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frame = 0;
    const measure = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      if (travel <= 0) return;
      const progress = Math.min(Math.max(-rect.top / travel, 0), 1);
      setStep(Math.min(count - 1, Math.floor(progress * count)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    /* A background tab freezes animation frames, so a scroll that lands while
       the tab is hidden never gets measured and the step would still be showing
       whatever was active when the tab was last visible. Re-measure on the way
       back in. */
    document.addEventListener("visibilitychange", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("visibilitychange", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ref, count]);

  return step;
}

/** Tracks a media query and re-evaluates on resize, unlike <source media>. */
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false,
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

export default function PradaLanding() {
  const { theme, toggle } = useTheme();
  const [, navigate] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [videoPaused, setVideoPaused] = useState(false);
  const [lang, setLang] = useState<SiteLang>("en");
  const [modelOpen, setModelOpen] = useState(false);
  /* Drives the pinned product steps below. */
  const processRef = useRef<HTMLDivElement>(null);
  const processStep = useScrollStep(processRef, 3);

  const voicesVideoRef = useRef<HTMLVideoElement>(null);
  const [voicesPlaying, setVoicesPlaying] = useState(false);
  const toggleVoices = useCallback(() => {
    const video = voicesVideoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  }, []);
  const processWarm = useNearViewport(processRef, "100% 0px");


  const c = siteCopy[lang];

  const isPhone = useMediaQuery("(max-width: 767px)");
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  /* The rail moves the page, not the step index: scrolling stays the only thing
     that decides which step is active, so the chevrons can never disagree with
     where the page actually is. */
  const goToStep = useCallback(
    (index: number) => {
      const el = processRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      if (travel <= 0) return;
      const top = rect.top + window.scrollY;
      window.scrollTo({
        top: top + travel * ((index + 0.5) / 3),
        /* "instant", not "auto": `auto` defers to the CSS `scroll-behavior:
           smooth` set on <html>, so it would animate for exactly the people who
           asked not to be animated at. */
        behavior: reduceMotion ? "instant" : "smooth",
      });
    },
    [reduceMotion],
  );

  const videoRef = useRef<HTMLVideoElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);

  /* The hero plays regardless of prefers-reduced-motion: it carries the argument
     of the page rather than decorating it. Reduced motion is honoured where it
     belongs, and WCAG 2.2.2 is met by the pause control on the video. */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.play().then(
      () => setVideoPaused(false),
      () => setVideoPaused(true),
    );
  }, [isPhone]);

  const toggleVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setVideoPaused(false), () => {});
    } else {
      video.pause();
      setVideoPaused(true);
    }
  }, []);

  /* The drawer is the only navigation on a phone, so it has to be operable from
     the keyboard: Escape closes it and focus returns to the button that opened it. */
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    menuPanelRef.current?.querySelector<HTMLElement>("a,button")?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [menuOpen]);

  const go = useCallback(
    (href: string) => (e?: React.MouseEvent) => {
      e?.preventDefault();
      setMenuOpen(false);
      if (href.startsWith("#")) {
        /* "instant", not "auto": `auto` defers to the CSS `scroll-behavior:
           smooth` on <html>, so the nav animated for exactly the people who
           asked not to be animated at — and never arrived at all if the frames
           were not running. */
        document.querySelector(href)?.scrollIntoView({
          behavior: reduceMotion ? "instant" : "smooth",
          block: "start",
        });
        return;
      }
      navigate(href);
    },
    [navigate, reduceMotion],
  );

  const navLinks = [
    /* The impact band is archived, so #impact resolves to nothing. Impact points
       at the portfolio section for now; Portfolio moves to its own page later,
       at which point these two stop sharing a target. */
    { label: c.nav.impact, href: "#portfolio" },
    { label: c.nav.portfolio, href: "#portfolio" },
    { label: c.nav.partners, href: "#partners" },
    { label: c.nav.contact, href: "#contact" },
  ];

  const themeIcon =
    theme === "light" ? (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    ) : (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
    );

  return (
    <div className="prada-root min-h-screen bg-white text-black">
      {/* HEADER — language menu left on desktop, hamburger left on a phone. The
          wordmark is centred from md up and left-aligned beside the menu below it. */}
      <header
        className="prada-header sticky top-0 left-0 right-0 z-50 bg-white border-b border-black/10"
        role="banner"
      >
        <div className="flex lg:grid lg:grid-cols-3 items-center gap-3 px-5 md:px-10 py-3 md:py-4">
          <div className="flex items-center text-black">
            <button
              ref={menuButtonRef}
              type="button"
              aria-label={c.menu.open}
              aria-expanded={menuOpen}
              aria-controls="prada-menu"
              onClick={() => setMenuOpen((v) => !v)}
              className="lg:hidden flex items-center justify-center min-h-11 min-w-11 -ml-2"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden lg:block">
              <LanguageSelect lang={lang} onChange={setLang} label={c.menu.language} />
            </div>
          </div>

          {/* Wordmark — Fraunces, borrowed from the Aesop variant. */}
          <a
            href="/"
            onClick={go("/")}
            className="flex-1 lg:text-center text-black leading-none whitespace-nowrap min-w-0"
            aria-label="Please Touch This Art"
          >
            <span className="prada-wordmark prada-wordmark--compact block">
              Please Touch This Art
            </span>
          </a>

          <div className="flex items-center justify-end gap-3.5 text-black">
            {/* Measured: the four labels run 210px, and with the icon buttons
                the row needs ~293px against a centre-third that is only 315px
                at lg. So the wide gap waits for xl, where the third grows to
                400px. Below lg the row does not fit at all and the drawer
                takes over instead, which is why this is lg: and not md:. */}
            <nav
              className="hidden lg:flex items-center gap-4 xl:gap-8 xl:mr-3"
              aria-label="Sections"
            >
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={go(link.href)}
                  className="prada-nav text-[13px] hover:opacity-60 transition-opacity"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <button
              type="button"
              onClick={toggle}
              aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
              /* From lg up the button collapses to the bare 17px icon, which is
                 below the 24px minimum target and easy to miss. The pseudo-element
                 grows the hit area to ~29x41 without moving anything: the inset
                 stops short of half the 14px gap so it never overlaps the picker
                 beside it. */
              className="relative flex items-center justify-center min-h-11 min-w-11 lg:min-h-0 lg:min-w-0 -mr-2 lg:mr-0 lg:ml-1 [touch-action:manipulation] lg:before:absolute lg:before:content-[''] lg:before:-inset-x-1.5 lg:before:-inset-y-3"
            >
              {themeIcon}
            </button>
            {/* Variant switcher, local development only. */}
            {import.meta.env.DEV && <DesignPicker />}
          </div>
        </div>

        {/* MENU DRAWER — the whole navigation on a phone. */}
        {menuOpen && (
          <div
            id="prada-menu"
            ref={menuPanelRef}
            className="absolute inset-x-0 top-full bg-white border-b border-black/10 shadow-sm"
          >
            <nav className="flex flex-col px-5 py-2" aria-label="Main">
              {[
                ...navLinks,
                { label: c.menu.experience, href: "/demo-hub" },
                { label: c.menu.howItWorks, href: "/how-it-works" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={go(link.href)}
                  className="prada-body text-[16px] py-3.5 border-b border-black/5"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="flex items-center justify-between px-5 py-4">
              <LanguageSelect lang={lang} onChange={setLang} label={c.menu.language} />
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  menuButtonRef.current?.focus();
                }}
                className="flex items-center gap-2 prada-mono-caps text-[11px] text-black/60"
              >
                <X className="w-3.5 h-3.5" /> {c.menu.close}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      {/* data-on-dark: this section is dark in both themes, so its white text
          must not follow the dark-mode palette flip. */}
      <section className="relative w-full" aria-label="Hero" data-on-dark>
        <div className="prada-hero-stage relative w-full min-h-[78svh] md:min-h-0 md:aspect-[21/9] overflow-hidden bg-stone-200">
          <video
            ref={videoRef}
            key={isPhone ? "portrait" : "wide"}
            className="absolute inset-0 w-full h-full object-cover"
            src={isPhone ? HERO_VIDEO_PORTRAIT : HERO_VIDEO_WIDE}
            poster={isPhone ? HERO_POSTER_PORTRAIT : HERO_POSTER_WIDE}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="People testing tactile art models in a museum"
          />
          {/* Scrim reaching the text band, not just the bottom edge. */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.55) 28%, rgba(0,0,0,0.18) 58%, transparent 85%)",
            }}
          />
          <button
            type="button"
            onClick={toggleVideo}
            aria-label={videoPaused ? c.hero.play : c.hero.pause}
            className="absolute top-4 right-4 md:top-6 md:right-6 z-10 flex items-center justify-center w-11 h-11 rounded-full bg-black/45 hover:bg-black/65 text-white backdrop-blur-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {videoPaused ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            )}
          </button>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.5 }}
            className="absolute inset-x-0 bottom-0 pb-12 md:pb-16 text-center text-white px-6"
          >
            <h1 className="prada-display text-[30px] md:text-[64px] leading-[1.06] md:leading-[1.02] mb-3 md:mb-4">
              {c.hero.headLead}
              {c.hero.headEm}
              {c.hero.headTail}
            </h1>
            <p className="prada-body text-[14px] md:text-[17px] text-white/85 max-w-[34ch] md:max-w-[46ch] mx-auto mb-6 md:mb-7">
              {c.hero.subLead}
              <strong className="font-medium text-white">{c.hero.subEm}</strong>
              {c.hero.subTail}
            </p>
            <button
              type="button"
              onClick={go("/demo-hub")}
              className="prada-link-cta prada-link-cta--on-dark"
            >
              {c.hero.cta}
            </button>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-b border-black/10 bg-white" aria-label="Impact figures">
        <div className="grid grid-cols-3">
          {c.stats.map((s, i) => (
            <div
              key={s.label}
              className="px-3 md:px-8 py-7 md:py-9 text-center border-r border-black/10 last:border-r-0"
            >
              <p className="prada-display text-[26px] md:text-[38px] leading-none mb-2">
                {/* Staggered so the three figures land in sequence, left to right. */}
                <CountUpNumber value={s.value} delayMs={i * 110} />
              </p>
              <p className="prada-mono-caps text-[9px] md:text-[10.5px] text-black/55 leading-[1.4]">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCT.
          A display of work, not a catalogue: these artworks already hang in
          these museums, and each photograph shows one of them beside the
          tactile model we made of it. Composed as a single mosaic rather than
          a run of full-width plates so the whole range reads in one view, with
          the workshop frame leading to show the models being used.

          The painting/relief comparison opens the section instead of standing
          on its own further down: it answers what the heading claims — that a
          painting becomes something you can read by hand — and a visitor can
          drag it before reading a word. */}
      <section
        id="product"
        className="bg-white pt-16 md:pt-24 scroll-mt-16"
        aria-labelledby="product-heading"
      >
        <div className="mx-auto max-w-[1240px] px-6 md:px-10">
          {/* Split header. The rest of the page centres its headings; this one
              hangs off a full-width rule to read as the opening of a catalogue
              rather than another band of marketing. */}
          <div className="flex items-center gap-5 pb-8 md:pb-10 border-t border-black/15 pt-5">
            <p className="prada-mono-caps text-[10.5px] text-black/50">{c.product.eyebrow}</p>
            <span aria-hidden="true" className="h-px flex-1 bg-black/10" />
            <BrailleCell value={1} />
          </div>

          {/* The claim and the proof of it. The panel is pinned while the page
              scrolls three viewports past it, so the visual on the left changes
              under a heading that stays put: the analysis pass, then the relief
              it produces, then the finished model turning on its own.

              Laid out as a centred pair rather than on the page's 12-column
              grid. The stage is capped against viewport height, so on a wide
              window a grid column sized in twelfths left a slab of dead space
              between the image and the text. Sizing both to their content and
              centring the pair keeps them together at any width. The heading
              leads in the markup so a phone reads the point before the
              demonstration; `order` puts the stage back on the left from md up. */}
          <div ref={processRef} className="relative h-[300vh]">
            <div className="sticky top-[61px] flex min-h-[calc(100vh-61px)] items-center py-10">
              <div className="w-full">
              <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-9 md:gap-14 lg:gap-20">
                <div className="md:order-2 md:flex-1 md:max-w-[36ch]">
                  <h2
                    id="product-heading"
                    className="prada-display text-[27px] md:text-[40px] leading-[1.1] mb-4"
                  >
                    {c.product.heading}
                  </h2>
                  {/* The steps themselves. All three stay readable — the inactive
                      ones fade rather than disappear, so the whole process is
                      visible at once and nothing depends on having scrolled. */}
                  {/* Steps and their position rail. Hairline rules divide the
                      rows so the list closes up into one block in the page's
                      own idiom, and the rail sits beside it the way the
                      reference has it. The chevrons scroll the page rather than
                      setting the step directly, so scroll stays authoritative
                      and they cannot fall out of sync with it. */}
                  <div className="mt-7 md:mt-8 flex items-stretch gap-5 md:gap-6">
                      <ol className="min-w-0 flex-1 border-t border-black/10">
                      {c.product.steps.map((stepCopy, i) => {
                        const isActive = i === processStep;
                        return (
                          <li
                            key={stepCopy.title}
                            aria-current={isActive ? "step" : undefined}
                            className="border-b border-black/10 py-3.5"
                          >
                            <span className="block min-w-0">
                              <span
                                className="prada-mono-caps block text-[10px] transition-colors duration-500"
                                style={{ color: isActive ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.4)" }}
                              >
                                {stepCopy.title}
                              </span>
                              <span
                                className="prada-body block text-[14px] md:text-[15px] leading-[1.6] text-black/65 overflow-hidden transition-all duration-500"
                                style={{
                                  maxHeight: isActive ? 140 : 0,
                                  opacity: isActive ? 1 : 0,
                                  marginTop: isActive ? 6 : 0,
                                }}
                              >
                                {stepCopy.body}
                              </span>
                            </span>
                          </li>
                        );
                      })}
                    </ol>

                    <div className="flex shrink-0 flex-col items-center justify-center gap-5">
                      <button
                        type="button"
                        onClick={() => goToStep(processStep - 1)}
                        disabled={processStep === 0}
                        aria-label={c.product.steps[processStep - 1]?.title ?? ""}
                        className="text-black/45 transition-opacity hover:text-black disabled:pointer-events-none disabled:opacity-25"
                      >
                        <ChevronUp className="h-5 w-5" strokeWidth={1.5} />
                      </button>

                      <ol className="flex flex-col items-center gap-3.5">
                        {c.product.steps.map((stepCopy, i) => (
                          <li key={stepCopy.title}>
                            <span
                              aria-hidden="true"
                              className="block rounded-full transition-all duration-500"
                              style={{
                                /* Same size throughout — only colour marks the
                                   active step, so the rail stays a steady row of
                                   dots rather than one that swells and shrinks. */
                                width: 9,
                                height: 9,
                                backgroundColor:
                                  i === processStep
                                    ? "#000"
                                    : "rgba(0,0,0,0.16)",
                              }}
                            />
                            <span className="sr-only">
                              {stepCopy.title}
                              {i === processStep ? " (current)" : ""}
                            </span>
                          </li>
                        ))}
                      </ol>

                      <button
                        type="button"
                        onClick={() => goToStep(processStep + 1)}
                        disabled={processStep === c.product.steps.length - 1}
                        aria-label={c.product.steps[processStep + 1]?.title ?? ""}
                        className="text-black/45 transition-opacity hover:text-black disabled:pointer-events-none disabled:opacity-25"
                      >
                        <ChevronDown className="h-5 w-5" strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="md:order-1 md:shrink-0">
                  {/* Width is capped against viewport height as well as pixels:
                    the stage is a tall 800:972, and on a short window a fixed
                    440px pushed the caption and the 3D link past the bottom of
                    the pinned panel. */}
                <div
                  className="mx-auto w-full"
                  style={{ maxWidth: "min(440px, 52vh)" }}
                >
                    {/* One stage, three visuals crossfading inside it. The box keeps
                        the comparison's aspect so nothing jumps between steps. */}
                    <div
                      className="relative w-full overflow-hidden"
                      style={{ aspectRatio: "800 / 972" }}
                    >
                      <StageLayer visible={processStep === 0}>
                        {/* The analysis leads: it is what gives the painting
                            depth, so it runs before the relief it produces. */}
                        <ScanStage active={processStep === 0} alt={c.compare.beforeAlt} />
                      </StageLayer>
                      <StageLayer visible={processStep === 1}>
                        <CompareSlider copy={c.compare} />
                      </StageLayer>
                      <StageLayer visible={processStep === 2}>
                        <RotatingModel
                          active={processStep === 2}
                          warm={processWarm}
                          alt={c.compare.modelAlt}
                        />
                      </StageLayer>
                    </div>

                    {/* The painting keeps its credit — that line is attribution,
                        not marketing. */}
                    <p className="prada-mono-caps text-[9.5px] text-black/45 mt-5 text-center">
                      {c.compare.caption}
                    </p>
                    <div className="pt-5 text-center">
                      <button
                        type="button"
                        onClick={() => setModelOpen(true)}
                        className="prada-link-cta"
                      >
                        {c.compare.view3d}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>

        <ModelPreviewDialog
          open={modelOpen}
          onClose={() => setModelOpen(false)}
          src={COMPARE_MODEL}
          alt={c.compare.modelAlt}
          title={c.compare.caption}
          meta={c.compare.modelMeta}
          closeLabel={c.compare.close}
          loadingLabel={c.compare.loading}
          errorLabel={c.compare.loadError}
        />
      </section>

      {/* CUSTOMERS — a logo strip, not a gallery: it runs on its own, carries no
          captions, and stays shallow so it reads as a credit line closing the
          product section rather than as another full section of its own. The
          marquee pauses on hover and, under prefers-reduced-motion, stops and
          wraps the logos into a centred row instead. */}
      <section
        className="border-b border-black/10 bg-white py-10 md:py-12"
        aria-labelledby="customers-heading"
      >
        {/* Set as a label rather than a display heading — the same mono small
            caps as the figures' "INSTALLED MODELS", so the strip reads as a
            quiet credit line rather than as a new section competing with the
            product heading above it. */}
        <h2
          id="customers-heading"
          className="prada-mono-caps text-center text-[9px] md:text-[10.5px] text-black/55 leading-[1.4] mb-8 md:mb-10 px-6"
        >
          {c.museums.heading}
        </h2>
        <div className="prada-marquee prada-marquee--always">
          <div className="prada-marquee__track">
            {[0, 1].map((copyIndex) => (
              <ul
                key={copyIndex}
                className="prada-marquee__group"
                aria-hidden={copyIndex === 1 ? true : undefined}
              >
                {CUSTOMER_LOGOS.map((logo) => (
                  <li key={logo.name} className="flex items-center justify-center">
                    <img
                      src={logo.src}
                      alt={copyIndex === 0 ? logo.name : ""}
                      loading="lazy"
                      style={{ height: logo.h, mixBlendMode: "multiply" }}
                      className="w-auto max-w-none object-contain opacity-85"
                    />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </section>

      {/* SELECTED WORK — the mosaic that was the back half of the product
          section. Split off so the customer strip can sit directly under the
          steps, where it reads as the credit line to the claim just made
          rather than as an afterthought following the plates. */}
      <section className="bg-white pb-16 md:pb-24" aria-label={c.product.eyebrow}>
        <div className="mx-auto max-w-[1240px] px-6 md:px-10 pt-16 md:pt-24">
          {/* Heading hangs off a full-width rule, the way the product section
              opens, rather than sitting centred over the plates. */}
          <div className="border-t border-black/15 pt-5 pb-10 md:pb-14">
            <div className="flex items-baseline gap-5">
              <h2 className="prada-display text-[24px] md:text-[34px] leading-[1.1]">
                {c.product.settingsHeading}
              </h2>
              <span aria-hidden="true" className="h-px flex-1 bg-black/10" />
            </div>
          </div>

          {/* Uncaptioned: the labels here named paintings inaccurately, and a
              wall of installed work reads better without a title under every
              plate. The alt text still describes each one. */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.2, 0.6, 0.2, 1] }}
            className="mx-auto grid max-w-[1140px] grid-cols-1 md:grid-cols-[1.144fr_1fr] gap-8 md:gap-10"
          >
            {/* The hero is square at half the width, so it is shorter than the
                stack beside it. That difference is not a gap to be closed: the
                body copy sits in it, which is why this column is not stretched
                to match the other. */}
            <div className="flex flex-col">
              <figure className="prada-plate m-0 aspect-square">
                <img
                  src={COLLAGE_HERO}
                  alt={c.product.plates[0].alt}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </figure>
              {/* One gutter everywhere: this sits the same 40px below the hero
                  as separates the columns and the plates opposite. The columns
                  still finish level, which is why the split is 1.144:1 rather
                  than even: solving hero + gap + text = landscape + gap + row
                  for these aspects (1, 1.45, 0.75) puts the boundary there, and
                  the figure is trued against the rendered text height. An even
                  split leaves the left column short of the right. */}
              <p className="prada-body mt-8 md:mt-10 max-w-[42ch] text-[15px] md:text-[16px] leading-[1.65] text-black/65">
                {c.product.settingsBody}
              </p>
            </div>

            <div className="flex flex-col gap-8 md:gap-10">
              <figure className="prada-plate m-0 aspect-[1.45]">
                <img
                  src={COLLAGE_WIDE}
                  alt={c.product.plates[1].alt}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </figure>
              <div className="grid grid-cols-2 gap-8 md:gap-10">
                {COLLAGE_PAIR.map((src, i) => (
                  <figure key={src} className="prada-plate m-0 aspect-[0.75]">
                    <img
                      src={src}
                      alt={c.product.plates[i + 2].alt}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  </figure>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="pt-12 md:pt-16 text-center">
            <button
              type="button"
              onClick={go("#portfolio")}
              className="prada-btn-solid prada-mono-caps inline-block px-9 py-3.5 text-[10.5px] transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              {c.product.cta}
            </button>
          </div>
        </div>
      </section>


      <section
        /* Light bottom padding: the testimonials that follow open with their own
           lead-in, and the two paddings were stacking into a chasm. */
        id="portfolio"
        className="pt-16 md:pt-24 pb-8 md:pb-12 px-6 md:px-10 bg-white scroll-mt-16"
        aria-labelledby="portfolio-heading"
      >
        <div className="mx-auto flex max-w-[1140px] flex-col gap-8 md:gap-12">
          {/* Uncaptioned, like the galleries collage: the pictures carry it, and
              a title under each one would turn a wall into a catalogue. The
              paragraph sits in the space the second photograph used to take, set
              the same way as the body copy under the galleries heading. */}
          <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-8 md:gap-12 md:items-center">
            <figure className="prada-plate m-0 aspect-[1.78]">
              <img
                src={COMMUNITY_LEAD}
                alt={c.portfolio.tiles[0].alt}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </figure>
            <div>
              <h2
                id="portfolio-heading"
                className="prada-display text-[24px] md:text-[32px] leading-[1.14]"
              >
                {c.portfolio.heading}
              </h2>
              <p className="prada-body mt-5 text-[15px] md:text-[16px] leading-[1.65] text-black/65">
                {c.portfolio.body}
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            {COMMUNITY_ROW.map((cell, i) => (
              <figure
                key={cell.src}
                className="prada-plate m-0 min-w-0"
                style={{ flex: `${cell.aspect} 1 0%`, aspectRatio: cell.aspect }}
              >
                <img
                  src={cell.src}
                  alt={c.portfolio.tiles[i + 1].alt}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* VOICES — not autoplayed: it carries speech, so it waits for the visitor. */}
      <section
        id="voices"
        className="pt-10 md:pt-14 pb-16 md:pb-24 px-6 md:px-10 bg-white scroll-mt-16"
        aria-label="Testimonials"
      >
        <div className="mx-auto max-w-[880px]">
          <h2 className="prada-display text-[19px] md:text-[24px] leading-[1.2] mb-5 md:mb-6 text-center mx-auto max-w-[28ch] text-black/75">
            {c.voices.heading}
          </h2>
          <figure className="m-0">
            <div className="prada-video-frame relative w-full aspect-video overflow-hidden bg-stone-900">
              <video
                ref={voicesVideoRef}
                className="absolute inset-0 w-full h-full object-cover"
                src={TESTIMONIALS_VIDEO}
                poster={TESTIMONIALS_POSTER}
                controls
                playsInline
                preload="none"
                onPlay={() => setVoicesPlaying(true)}
                onPause={() => setVoicesPlaying(false)}
                aria-label="Museum visitors describing their experience of the tactile models"
              />

              {/* The picture itself starts and stops it. A bare <video controls>
                  only responds on its control bar, so the obvious gesture —
                  tapping the frame — did nothing. This layer stops short of the
                  bottom so the native scrubber stays reachable underneath. */}
              <button
                type="button"
                onClick={toggleVoices}
                aria-label={
                  voicesPlaying
                    ? "Pause the visitor testimonials"
                    : "Play the visitor testimonials"
                }
                className="absolute inset-x-0 top-0 bottom-12 flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-white"
              >
                {!voicesPlaying && (
                  <span
                    aria-hidden="true"
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-black/45 backdrop-blur-sm transition-colors hover:bg-black/60"
                  >
                    <svg width="20" height="22" viewBox="0 0 20 22" fill="white" aria-hidden="true">
                      <path d="M0 0v22l20-11z" />
                    </svg>
                  </span>
                )}
              </button>
            </div>
            <figcaption className="prada-mono-caps text-[9.5px] text-black/45 mt-4 text-center">
              {c.voices.meta}
            </figcaption>
          </figure>
        </div>
      </section>

      {/* QUOTES — one at a time, on the page's own beige band and in its own
          faces. Two quotes side by side would halve the measure and make a
          statement read like a card, so it is a slider: the arrows advance it,
          and each quote gets the full width. */}
      <section
        className="py-16 md:py-24 px-6 md:px-10 bg-[var(--prada-band)] border-t border-black/10"
        aria-label="Testimonials"
      >
        <Carousel opts={{ loop: true, align: "start" }} className="mx-auto max-w-[880px]">
          <CarouselContent>
            {c.testimonials.map((entry, i) => (
              <CarouselItem key={entry.name}>
                <figure className="m-0 px-6 md:px-12 text-center">
                  <blockquote className="prada-display text-[19px] md:text-[26px] leading-[1.45] text-black/85">
                    {entry.quote}
                  </blockquote>
                  <figcaption className="mt-8 md:mt-10 flex items-center justify-center gap-4">
                    <TestimonialAvatar src={TESTIMONIAL_AVATARS[i]} name={entry.name} />
                    <span className="text-left">
                      <span className="prada-caption block text-[15px] md:text-[16px] text-black">
                        {entry.name}
                      </span>
                      <span className="prada-mono-caps mt-1 block text-[9.5px] text-black/50">
                        {entry.role}
                        {entry.org}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* `.hover-elevate` forces position:relative over Tailwind's absolute,
              so these need the stylesheet's opt-out to sit at the edges. */}
          <CarouselPrevious
            aria-label="Previous quote"
            className="no-default-hover-elevate no-default-active-elevate -left-1 md:-left-4 border-black/15 text-black hover:bg-black/5"
          />
          <CarouselNext
            aria-label="Next quote"
            className="no-default-hover-elevate no-default-active-elevate -right-1 md:-right-4 border-black/15 text-black hover:bg-black/5"
          />
        </Carousel>
      </section>

      {/* PARTNERS — marquee. Under prefers-reduced-motion the track stops and the
          row simply centres, so nothing is hidden from anyone who has that on. */}
      <section
        id="partners"
        className="border-t border-black/10 py-16 md:py-24 bg-[var(--prada-band)] text-center scroll-mt-16"
        aria-label="Partners"
      >
        <div className="px-6 md:px-10">
          <p className="prada-mono-caps text-[10.5px] text-black/50 mb-4">{c.partners.eyebrow}</p>
          <h2 className="prada-display text-[26px] md:text-[36px] mb-12 md:mb-14">
            {c.partners.heading}
          </h2>
        </div>
        <div className="prada-marquee">
          <div className="prada-marquee__track">
            {[0, 1].map((copyIndex) => (
              <ul
                key={copyIndex}
                className="prada-marquee__group"
                aria-hidden={copyIndex === 1 ? true : undefined}
              >
                {PARTNER_LOGOS.map((logo) => (
                  <li key={logo.name} className="flex items-center justify-center">
                    {/* multiply blend drops the logos' white backgrounds onto the
                        warm ground without hand-cutting five transparent PNGs */}
                    <img
                      src={logo.src}
                      alt={copyIndex === 0 ? logo.name : ""}
                      loading="lazy"
                      style={{ width: logo.w, mixBlendMode: "multiply" }}
                      className="h-auto max-w-none object-contain opacity-85"
                    />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </section>

      {/* IMPACT — archived, not deleted. Kept in the tree behind a flag so the
          markup, copy and the dot-grid figure survive intact and it can come
          back by flipping SHOW_IMPACT to true. */}
      {SHOW_IMPACT && (
  <section
          id="impact"
          className="bg-[var(--prada-band)] border-y border-black/10 py-16 md:py-24 px-6 md:px-10 scroll-mt-16"
          aria-label="Impact"
        >
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-12 md:mb-16">
              <p className="prada-mono-caps text-[10.5px] text-black/50 mb-4">{c.impact.eyebrow}</p>
              <h2 className="prada-display text-[26px] md:text-[40px] leading-[1.15] mx-auto max-w-3xl mb-5">
                {c.impact.heading}
              </h2>
              <p className="prada-body text-[15px] text-black/65 max-w-[54ch] mx-auto">
                {c.impact.lead}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
              <div>
                <p className="prada-display text-[58px] md:text-[80px] leading-[0.9] mb-3">
                  {c.impact.bigStat}
                </p>
                <p className="prada-body text-[15px] text-black/75 mb-6 max-w-[32ch]">
                  {c.impact.bigStatLabel}
                </p>
                {/* 30 dots, each standing for roughly 10M people. */}
                <div aria-hidden="true" className="grid grid-cols-10 gap-1.5 max-w-[260px] mb-3">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <span key={i} className="aspect-square rounded-full bg-black/75" />
                  ))}
                </div>
                <p className="prada-mono-caps text-[9.5px] text-black/45 mb-7">{c.impact.dotNote}</p>
                <div className="pt-6 border-t border-black/15 flex items-baseline gap-3 flex-wrap">
                  <span className="prada-mono-caps text-[9.5px] text-black/45">{c.impact.ofWhich}</span>
                  <span className="prada-display text-[28px] leading-none">{c.impact.subStat}</span>
                  <span className="prada-mono-caps text-[9.5px] text-black/45">
                    {c.impact.subStatLabel}
                  </span>
                </div>
                <p className="prada-mono-caps text-[9.5px] text-black/40 mt-5">{c.impact.source}</p>
              </div>

              <div>
                <div className="prada-video-frame relative w-full aspect-[16/11] overflow-hidden bg-stone-200 mb-6">
                  <img
                    src={`${BASE}/images/model-with-plaque.jpeg`}
                    alt="A finished tactile model on a plinth with its braille plaque"
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <h3 className="prada-display text-[22px] md:text-[26px] mb-3">
                  {c.impact.solutionHeading}
                </h3>
                <p className="prada-body text-[15px] leading-[1.65] text-black/75 mb-5 max-w-[46ch]">
                  {c.impact.solutionBody}
                </p>
                <button type="button" onClick={go("/how-it-works")} className="prada-link-cta">
                  {c.impact.solutionCta}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* MISSION STATEMENT */}
      <section
        className="py-20 md:py-36 px-6 md:px-10 text-center bg-[var(--prada-band)]"
        aria-label="Mission statement"
      >
        <div className="mx-auto max-w-2xl">
          {/* Two voices in one sentence: the museum's instruction set in the
              page's own sans, and the reply written by hand over it. The second
              line takes the period with it so the handwriting finishes the
              sentence rather than the type. */}
          <h2 className="prada-display text-[26px] md:text-[40px] leading-[1.15]">
            <span className="block">{c.slogan.lead.trim()}</span>
            <span className="prada-hand mt-2 block text-[38px] md:text-[58px] leading-[1] text-[#FF6A00]">
              {c.slogan.em}
              {c.slogan.tail}
            </span>
          </h2>
        </div>
      </section>

      {/* CONTACT */}
      <section
        id="contact"
        className="py-16 md:py-28 px-6 md:px-10 text-center bg-[var(--prada-band)] scroll-mt-16"
        aria-label="Contact"
      >
        <h2 className="prada-display text-[26px] md:text-[40px]">{c.contact.heading}</h2>

        <ContactForm
          copy={c.contact.form}
          to={c.contact.email}
          subject={c.contact.form.subject}
        />

        {/* The address stays on the page: some people would rather write from
            their own client than fill anything in. */}
        <a
          href={`mailto:${c.contact.email}`}
          className="prada-mono-caps mt-10 inline-block text-[10px] text-black/50 underline underline-offset-4 hover:text-black"
        >
          {c.contact.email}
        </a>
      </section>

      {/* FOOTER */}
      <footer
        className="border-t border-black/10 py-14 md:py-20 px-6 md:px-10 bg-white"
        role="contentinfo"
      >
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 text-left mb-14">
            <div className="col-span-2 md:col-span-1">
              <p className="prada-wordmark mb-3" style={{ fontSize: 22 }}>
                Please Touch This Art
              </p>
              <p className="prada-body text-[13px] text-black/60 max-w-[28ch]">
                {c.footer.tagline}
              </p>
            </div>
            {[
              {
                title: c.footer.explore,
                links: [
                  { label: c.nav.product, href: "#product" },
                  { label: c.footer.links.portfolio, href: "#portfolio" },
                  { label: c.footer.links.voices, href: "#voices" },
                  { label: c.footer.links.experience, href: "/demo-hub" },
                  { label: c.footer.links.howItWorks, href: "/how-it-works" },
                ],
              },
              {
                title: c.footer.company,
                links: [
                  { label: c.footer.links.impact, href: "#portfolio" },
                  { label: c.footer.links.partners, href: "#partners" },
                  { label: c.footer.links.next, href: "/future-features" },
                ],
              },
              {
                title: c.footer.contact,
                links: [
                  { label: c.contact.email, href: `mailto:${c.contact.email}` },
                  { label: c.footer.links.place, href: "#contact" },
                ],
              },
            ].map((col) => (
              <div key={col.title}>
                <p className="prada-mono-caps text-[10px] text-black/45 mb-4">{col.title}</p>
                <ul className="flex flex-col gap-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        onClick={l.href.startsWith("mailto:") ? undefined : go(l.href)}
                        className="prada-body text-[13.5px] text-black/70 hover:text-black transition-colors"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-black/10 pt-7 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="prada-mono-caps text-[10px] text-black/50">{c.footer.stamp}</p>
            <nav className="flex items-center gap-4" aria-label={c.footer.legal}>
              {[
                { href: "/impressum", label: "Impressum" },
                { href: "/datenschutz", label: "Datenschutz" },
                { href: "/accessibility", label: lang === "de" ? "Barrierefreiheit" : "Accessibility" },
              ].map((entry) => (
                <a
                  key={entry.href}
                  href={entry.href}
                  onClick={go(entry.href)}
                  className="prada-mono-caps text-[10px] text-black/50 underline underline-offset-4 hover:text-black"
                >
                  {entry.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
