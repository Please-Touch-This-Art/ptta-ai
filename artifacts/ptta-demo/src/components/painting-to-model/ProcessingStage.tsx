import { useEffect, useState } from "react";
import type { ModelEntry, ModelId } from "@/content/models";
import { StageFrame } from "@/components/prada/StageFrame";
import {
  StepList,
  FadeLayer,
  ScanLine,
  SCAN_MAX_HEIGHT,
  type ProcessStep,
} from "@/components/prada/ProcessSteps";

/*
 * The painting being read for depth: four passes — analyse, depth, mesh,
 * refine — each with its own overlay on the plate and its own line in the
 * step list beside it. Plays regardless of prefers-reduced-motion: the passes
 * are what the demo shows, and without them the viewer would simply appear.
 */

interface Props {
  model: ModelEntry;
  onDone: () => void;
  onBack: () => void;
  onSwap?: (id: ModelId) => void;
}

const STEPS: ProcessStep[] = [
  {
    id: "analyze",
    label: "Analyse",
    hint: "Reading the brushwork and the composition.",
    filter: "contrast(1.55) saturate(0.4) brightness(1.02)",
  },
  {
    id: "depth",
    label: "Depth",
    hint: "Mapping depth from the surface: what sits forward, what recedes.",
    filter: "grayscale(1) contrast(1.3) brightness(1.08)",
  },
  {
    id: "mesh",
    label: "Mesh",
    hint: "Building the relief surface from the depth map.",
    filter: "invert(1) contrast(2.3) brightness(1.3) saturate(0)",
  },
  {
    id: "refine",
    label: "Refine",
    hint: "Sharpening the edges a fingertip will look for.",
    filter: "contrast(1.1) saturate(1.15)",
  },
];

const STEP_MS = 2500;
const ACCENT_RGB = "var(--accent-rgb)";
const pad2 = (n: number) => String(n).padStart(2, "0");

export function ProcessingStage({ model, onDone, onBack, onSwap }: Props) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (stepIndex < STEPS.length - 1) setStepIndex((i) => i + 1);
      else onDone();
    }, STEP_MS);
    return () => clearTimeout(timeout);
  }, [stepIndex, onDone]);

  const current = STEPS[stepIndex];
  const isStep = (id: string) => current.id === id;

  return (
    <StageFrame
      label="Reading the painting"
      model={model}
      onBack={onBack}
      backLabel="Pick another piece"
      onSwap={onSwap}
      status={{ left: `Step ${pad2(stepIndex + 1)} of ${pad2(STEPS.length)} · ${current.label}`, right: "● Processing" }}
      aside={<StepList steps={STEPS} activeIndex={stepIndex} />}
      bare
    >
      {/* Just the artwork, at its own proportions: the overlays and scan line
          cover the painting and nothing around it. */}
      <div className="relative mx-auto w-fit max-w-full overflow-hidden">
        <img
          src={model.image}
          alt=""
          aria-hidden
          className="block h-auto w-auto max-w-full"
          style={{ maxHeight: SCAN_MAX_HEIGHT, filter: current.filter, transition: "filter 1.1s ease" }}
        />
        {/* ANALYSE — sampling grid */}
        <FadeLayer
          visible={isStep("analyze")}
          style={{
            backgroundImage: `radial-gradient(circle, rgba(${ACCENT_RGB},0.75) 1px, transparent 1.6px)`,
            backgroundSize: "14px 14px",
            mixBlendMode: "screen",
          }}
        />
        {/* DEPTH — a heat map, warm where the surface comes forward */}
        <FadeLayer
          visible={isStep("depth")}
          style={{
            background: `radial-gradient(ellipse 58% 52% at 50% 42%, rgba(254,240,138,0.85) 0%, rgba(${ACCENT_RGB},0.75) 30%, rgba(120,18,6,0.55) 65%, rgba(12,10,9,0.5) 100%)`,
            mixBlendMode: "color",
          }}
        />
        {/* MESH — the wireframe */}
        <FadeLayer
          visible={isStep("mesh")}
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, rgba(${ACCENT_RGB},0.75) 0 1px, transparent 1px 12px), repeating-linear-gradient(90deg, rgba(${ACCENT_RGB},0.75) 0 1px, transparent 1px 12px)`,
            mixBlendMode: "screen",
          }}
        />
        <ScanLine />
      </div>
    </StageFrame>
  );
}
