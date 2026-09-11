import { useEffect, useRef, useState } from "react";

interface CountUpNumberProps {
  /** The finished figure with its qualifiers: "27+", "5,680+", "80%". */
  value: string;
  durationMs?: number;
  /** Held before counting starts, so a row of figures can cascade. */
  delayMs?: number;
  /**
   * Where the count begins, as a share of the target. Starting part-way up
   * rather than at zero keeps the figure reading as a real number the whole
   * time — 5,680 climbs from 1,100 rather than from nothing.
   */
  startFraction?: number;
  className?: string;
}

interface Parsed {
  prefix: string;
  suffix: string;
  target: number;
  /** The character grouping thousands — "," in English, "." in German. */
  separator: string;
}

/* Pulls "5,680+" apart into the number and the text sitting either side of it,
   remembering how the thousands were grouped so the ticking value can be
   rebuilt in the same style rather than in the browser's default locale. */
function parse(value: string): Parsed | null {
  const match = value.match(/^(\D*)(\d[\d.,]*\d|\d)(\D*)$/);
  if (!match) return null;

  const [, prefix = "", digits = "", suffix = ""] = match;
  const target = Number(digits.replace(/\D/g, ""));
  if (!Number.isFinite(target)) return null;

  return {
    prefix,
    suffix,
    target,
    separator: /\d([.,])\d{3}/.exec(digits)?.[1] ?? "",
  };
}

/* The opening figure is rounded to a step that suits its size, so the count
   starts on something that looks chosen (1,100) rather than on the arithmetic
   remainder of a percentage (1,136).

   It also never opens with fewer digits than it closes on: a figure that grows
   from 5 to 27 changes width partway through, and re-centring the text mid-count
   is the one visible hitch in an otherwise continuous climb. */
function startValue(target: number, fraction: number) {
  const raw = target * fraction;
  const step = raw >= 1000 ? 100 : raw >= 100 ? 10 : 1;
  const rounded = Math.floor(raw / step) * step;
  const sameWidth = Math.pow(10, String(target).length - 1);
  return Math.max(rounded, Math.min(sameWidth, target));
}

function format(n: number, { prefix, suffix, separator }: Parsed) {
  const digits = separator
    ? String(n).replace(/\B(?=(\d{3})+(?!\d))/g, separator)
    : String(n);
  return `${prefix}${digits}${suffix}`;
}

/* Eased at both ends: the figure gathers pace instead of snapping into motion,
   and settles instead of stopping dead. A curve eased only at the finish starts
   at full tilt, which is what makes a short count read as a jolt. */
const smoothStep = (t: number) => t * t * (3 - 2 * t);

/**
 * A figure that counts up to `value` the first time it scrolls into view.
 *
 * The finished value is always what assistive tech announces — a number
 * re-rendering sixty times a second is noise to a screen reader — and it also
 * sizes the element, so the surrounding layout holds still while digits are
 * still being added.
 */
export function CountUpNumber({
  value,
  durationMs = 1500,
  delayMs = 0,
  startFraction = 0.2,
  className,
}: CountUpNumberProps) {
  const parsed = parse(value);
  const from = parsed ? startValue(parsed.target, startFraction) : 0;
  const ref = useRef<HTMLSpanElement>(null);
  const digitsRef = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(() =>
    parsed ? format(from, parsed) : value,
  );

  useEffect(() => {
    const el = ref.current;
    if (!el || !parsed) return;

    if (typeof IntersectionObserver === "undefined") {
      setDisplay(value);
      return;
    }

    let frame = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;

    /* Each frame writes straight to the text node. Re-rendering through React
       sixty times a second makes the count compete with the hero video for the
       same frames; the finished value is handed back to React at the end so the
       component's own state stays truthful. */
    const run = () => {
      const start = performance.now();
      const span = parsed.target - from;
      const tick = (now: number) => {
        const t = Math.min((now - start) / durationMs, 1);
        const text = format(Math.round(from + smoothStep(t) * span), parsed);
        if (digitsRef.current) digitsRef.current.textContent = text;
        if (t < 1) {
          frame = requestAnimationFrame(tick);
        } else {
          setDisplay(text);
        }
      };
      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        timer = setTimeout(run, delayMs);
      },
      { threshold: 0.5 },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      if (timer) clearTimeout(timer);
    };
    // `parsed` is derived from `value`, so it needs no dependency of its own.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, durationMs, delayMs, from]);

  if (!parsed) return <span className={className}>{value}</span>;

  return (
    <span ref={ref} className={`relative inline-block ${className ?? ""}`}>
      {/* Reserves the finished figure's width so nothing reflows mid-count. */}
      <span aria-hidden="true" className="invisible tabular-nums">
        {value}
      </span>
      <span
        ref={digitsRef}
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center tabular-nums"
      >
        {display}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
