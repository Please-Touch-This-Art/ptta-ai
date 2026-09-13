import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { motion } from "framer-motion";
import type { ModelEntry, ModelId } from "@/content/models";
import { fabricateRenders } from "@/content/fabrication-images";
import { StageFrame } from "./StageFrame";

interface Props {
  model: ModelEntry;
  onDone: () => void;
  onBack: () => void;
  onSwap?: (id: ModelId) => void;
}

const FABRICATE_MS = 5500;
const TOTAL_LAYERS = 240;
const START_LAYER = 1;
const TICK_MS = 60;

/* Three renders of the printed piece crossfade as the build climbs: each
   holds for a stretch, hands over, and the next takes it. */
const KEYFRAME_TIMES = [0, 0.3, 0.4, 0.6, 0.7, 1];
const RENDER_OPACITY: number[][] = [
  [1, 1, 0, 0, 0, 0],
  [0, 0, 1, 1, 0, 0],
  [0, 0, 0, 0, 1, 1],
];
const NOZZLE_PATH = ["24%", "76%", "76%", "24%", "24%", "76%", "76%", "24%", "24%"];
const NOZZLE_TIMES = [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1];

const pad3 = (n: number) => n.toString().padStart(3, "0");

export function FabricateStage({ model, onDone, onBack, onSwap }: Props) {
  const [progress, setProgress] = useState(0);
  const startedAt = useRef<number>(Date.now());

  useEffect(() => {
    const t = setTimeout(onDone, FABRICATE_MS);
    return () => clearTimeout(t);
  }, [onDone]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setProgress(Math.min(1, (Date.now() - startedAt.current) / FABRICATE_MS));
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, []);

  const layer = Math.round(START_LAYER + progress * (TOTAL_LAYERS - START_LAYER));
  const hiddenPct = (1 - progress) * 100;

  const renders = useMemo(() => fabricateRenders(model.id), [model.id]);
  const fallbackStyle: CSSProperties | undefined = renders
    ? undefined
    : { filter: "grayscale(1) contrast(1.05) brightness(0.95)" };

  return (
    <StageFrame
      label="Fabricating"
      model={model}
      onBack={onBack}
      backLabel="Pick another piece"
      onSwap={onSwap}
      status={{ left: `Layer ${pad3(layer)} of ${pad3(TOTAL_LAYERS)}`, right: "● Printing" }}
      aside={
        <p className="prada-body text-[14px] md:text-[15px] leading-[1.6] text-black/65">
          The relief is built up in durable PLA, one thin layer at a time, each pass
          laid down where the depth map calls for it. The plate shows the piece
          emerging as the head works across it.
        </p>
      }
    >
      {renders ? (
        renders.map((src, i) => (
          <motion.img
            key={src}
            src={src}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ opacity: RENDER_OPACITY[i][0] }}
            animate={{ opacity: RENDER_OPACITY[i] }}
            transition={{ duration: FABRICATE_MS / 1000, times: KEYFRAME_TIMES, ease: "linear" }}
          />
        ))
      ) : (
        <img
          src={model.image}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
          style={fallbackStyle}
        />
      )}

      {/* Dark cover over the part not yet printed, from the top down, shrinking
          to nothing as the build completes. */}
      <div
        className="pointer-events-none absolute left-0 right-0 top-0"
        style={{
          height: `${hiddenPct}%`,
          background:
            "linear-gradient(to bottom, #0a0806 0%, #0a0806 80%, rgba(10,8,6,0.92) 100%)",
          transition: `height ${TICK_MS}ms linear`,
        }}
      />
      <div
        className="pointer-events-none absolute left-0 right-0"
        style={{
          top: `${hiddenPct}%`,
          height: 18,
          background: "linear-gradient(to bottom, rgba(var(--accent-rgb),0.4), transparent)",
          transform: "translateY(-18px)",
          transition: `top ${TICK_MS}ms linear`,
          mixBlendMode: "screen",
        }}
      />
      <div
        className="pointer-events-none absolute left-0 right-0"
        style={{
          top: `${hiddenPct}%`,
          height: 2,
          background: "linear-gradient(90deg, transparent, var(--color-accent), transparent)",
          boxShadow: "0 0 10px var(--color-accent), 0 0 20px rgba(var(--accent-rgb),0.5)",
          transform: "translateY(-1px)",
          transition: `top ${TICK_MS}ms linear`,
        }}
      />

      {/* The print head, tracking back and forth along the build line. */}
      <motion.div
        className="pointer-events-none absolute z-10"
        style={{
          width: 18,
          height: 22,
          top: `${hiddenPct}%`,
          transform: "translate(-50%, -100%)",
          transition: `top ${TICK_MS}ms linear`,
        }}
        animate={{ left: NOZZLE_PATH }}
        transition={{ duration: FABRICATE_MS / 1000, ease: "linear", times: NOZZLE_TIMES }}
      >
        <div
          className="h-full w-full rounded-sm"
          style={{
            background: "linear-gradient(to bottom, #3a3028 0%, #1c1814 60%, #0a0806 100%)",
            border: "1px solid rgba(245,241,234,0.45)",
          }}
        />
        <span
          aria-hidden
          className="absolute left-1/2 -translate-x-1/2 bg-accent"
          style={{
            bottom: -4,
            width: 3,
            height: 5,
            boxShadow: "0 0 6px var(--color-accent), 0 0 12px var(--color-accent)",
          }}
        />
        <span
          aria-hidden
          className="absolute left-1/2 -translate-x-1/2 bg-white/30"
          style={{ top: -120, width: 2, height: 120 }}
        />
        <span
          aria-hidden
          className="absolute left-1/2 -translate-x-1/2 rounded-full"
          style={{
            bottom: -8,
            width: 16,
            height: 6,
            background: "radial-gradient(ellipse, rgba(var(--accent-rgb),0.55), transparent 70%)",
          }}
        />
      </motion.div>
    </StageFrame>
  );
}
