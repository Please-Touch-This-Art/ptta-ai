import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { ModelEntry, ModelId } from "@/content/models";
import { polishRender } from "@/content/fabrication-images";
import { StageFrame } from "./StageFrame";

interface Props {
  model: ModelEntry;
  onDone: () => void;
  onBack: () => void;
  onSwap?: (id: ModelId) => void;
}

const POLISH_MS = 3000;
const PASSES = 4;
const TICK_MS = 60;

/* The buffer's rough path over the plate, and the highlight that follows it. */
const BUFFER_TOP = ["22%", "28%", "72%", "82%", "70%", "26%", "22%"];
const BUFFER_LEFT = ["28%", "72%", "70%", "50%", "30%", "28%", "28%"];
const BUFFER_TIMES = [0, 0.18, 0.36, 0.5, 0.64, 0.82, 1];
const HIGHLIGHT = [
  "radial-gradient(circle at 25% 25%, rgba(255,240,210,0.55) 0%, transparent 28%)",
  "radial-gradient(circle at 75% 28%, rgba(255,240,210,0.6) 0%, transparent 28%)",
  "radial-gradient(circle at 72% 72%, rgba(255,240,210,0.55) 0%, transparent 28%)",
  "radial-gradient(circle at 25% 75%, rgba(255,240,210,0.6) 0%, transparent 28%)",
  "radial-gradient(circle at 50% 50%, rgba(255,240,210,0.35) 0%, transparent 60%)",
];
const SPARK_DELAYS = [0, 0.4, 0.8, 1.2, 1.8, 2.2];

const pad2 = (n: number) => n.toString().padStart(2, "0");

export function PolishStage({ model, onDone, onBack, onSwap }: Props) {
  const [pass, setPass] = useState(1);
  const startedAt = useRef<number>(Date.now());

  const polishSrc = useMemo(() => polishRender(model.id), [model.id]);
  const baseSrc = polishSrc ?? model.image;
  const fallbackFilter = polishSrc ? undefined : "grayscale(1) contrast(1.05) brightness(0.98)";

  useEffect(() => {
    const t = setTimeout(onDone, POLISH_MS);
    return () => clearTimeout(t);
  }, [onDone]);

  useEffect(() => {
    const id = window.setInterval(() => {
      const p = Math.min(1, (Date.now() - startedAt.current) / POLISH_MS);
      setPass(Math.min(PASSES, Math.max(1, Math.ceil(p * PASSES))));
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, []);

  const blurLadder = fallbackFilter
    ? [
        "blur(7px) grayscale(1) brightness(0.6)",
        "blur(4px) grayscale(1) brightness(0.75)",
        "blur(1.5px) grayscale(1) brightness(0.9)",
        "blur(0px) grayscale(1) brightness(0.98)",
      ]
    : [
        "blur(7px) brightness(0.55) contrast(0.9)",
        "blur(4px) brightness(0.72) contrast(0.95)",
        "blur(1.5px) brightness(0.88) contrast(1)",
        "blur(0px) brightness(1) contrast(1)",
      ];

  return (
    <StageFrame
      label="Finishing"
      model={model}
      onBack={onBack}
      backLabel="Pick another piece"
      onSwap={onSwap}
      status={{ left: `Surface pass ${pad2(pass)} of ${pad2(PASSES)}`, right: "● Buffing" }}
      aside={
        <p className="prada-body text-[14px] md:text-[15px] leading-[1.6] text-black/65">
          Off the printer, the surface is worked over by hand until every ridge reads
          cleanly under a fingertip. The haze lifts from the plate as the passes go by.
        </p>
      }
    >
      {baseSrc && (
        <>
          <img
            src={baseSrc}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            style={fallbackFilter ? { filter: fallbackFilter } : undefined}
          />
          <motion.img
            src={baseSrc}
            alt=""
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            initial={{ filter: blurLadder[0], opacity: 1 }}
            animate={{ filter: blurLadder, opacity: [1, 0.85, 0.55, 0] }}
            transition={{ duration: POLISH_MS / 1000, times: [0, 0.4, 0.75, 1], ease: "linear" }}
          />
          <motion.div
            className="pointer-events-none absolute inset-0 mix-blend-screen"
            animate={{ background: HIGHLIGHT }}
            transition={{ duration: POLISH_MS / 1000, times: [0, 0.25, 0.5, 0.75, 1], ease: "linear" }}
          />
        </>
      )}

      {/* The buffer, and the sparks it throws. */}
      <motion.div
        className="absolute z-10 rounded-full border-2 border-accent"
        style={{
          width: 28,
          height: 28,
          background: "radial-gradient(circle, rgba(var(--accent-rgb),0.25), transparent)",
          transform: "translate(-50%, -50%)",
        }}
        animate={{ top: BUFFER_TOP, left: BUFFER_LEFT }}
        transition={{ duration: POLISH_MS / 1000, times: BUFFER_TIMES, ease: "linear" }}
      >
        <motion.span
          aria-hidden
          className="absolute inset-[-3px] rounded-full"
          style={{ border: "1px dashed rgba(var(--accent-rgb),0.6)" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, ease: "linear", repeat: Infinity }}
        />
      </motion.div>
      {SPARK_DELAYS.map((delay, i) => (
        <motion.span
          key={delay}
          aria-hidden
          className="absolute rounded-full bg-white"
          style={{
            width: 3,
            height: 3,
            top: `${24 + (i % 3) * 18}%`,
            left: `${40 + (i % 4) * 5}%`,
            boxShadow: "0 0 4px rgba(255,240,210,0.9)",
          }}
          animate={{ opacity: [0, 1, 0], x: [0, -10], y: [0, -10], scale: [1, 0.4] }}
          transition={{ duration: 1, delay, repeat: Infinity, repeatDelay: 0.4, ease: "easeOut" }}
        />
      ))}
    </StageFrame>
  );
}
