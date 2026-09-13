import { useEffect, useState } from "react";
import type { ModelEntry, ModelId } from "@/content/models";
import { StageFrame } from "@/components/prada/StageFrame";
import { StepList, FadeLayer, ScanLine, type ProcessStep } from "@/components/prada/ProcessSteps";

/*
 * The audio guide being composed: four passes over the painting — analyse,
 * context, narrate, voice — each with its own overlay on the plate and its
 * own line in the step list beside it. Plays regardless of
 * prefers-reduced-motion: it is the bridge between picking a piece and
 * hearing it, and without it the player would simply appear.
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
    id: "context",
    label: "Context",
    hint: "Gathering the history around the work.",
    filter: "grayscale(0.6) contrast(1.2) brightness(1.06)",
  },
  {
    id: "narrate",
    label: "Narrate",
    hint: "Writing the description as a narrative, in the order a hand would read it.",
    filter: "contrast(1.1) saturate(0.85) brightness(1.02)",
  },
  {
    id: "voice",
    label: "Voice",
    hint: "Giving the narration a voice.",
    filter: "contrast(1.08) saturate(1.15) brightness(1.02)",
  },
];

const STEP_MS = 2500;
const ACCENT_RGB = "var(--accent-rgb)";
const pad2 = (n: number) => String(n).padStart(2, "0");

export function AudioProcessingStage({ model, onDone, onBack, onSwap }: Props) {
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
      label="Composing the audio guide"
      model={model}
      onBack={onBack}
      backLabel="Pick another piece"
      onSwap={onSwap}
      status={{ left: `Step ${pad2(stepIndex + 1)} of ${pad2(STEPS.length)} · ${current.label}`, right: "● Composing" }}
      aside={<StepList steps={STEPS} activeIndex={stepIndex} />}
    >
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <div className="relative h-full max-w-full aspect-[3/4] overflow-hidden">
          <img
            src={model.image}
            alt=""
            aria-hidden
            className="h-full w-full object-cover"
            style={{ filter: current.filter, transition: "filter 1.1s ease" }}
          />

          {/* ANALYSE — sampling grid */}
          <FadeLayer
            visible={isStep("analyze")}
            style={{
              backgroundImage: `radial-gradient(circle, rgba(${ACCENT_RGB},0.8) 1px, transparent 1.6px)`,
              backgroundSize: "14px 14px",
              mixBlendMode: "screen",
            }}
          />
          {/* CONTEXT — text-scan lines */}
          <FadeLayer
            visible={isStep("context")}
            style={{
              backgroundImage: `repeating-linear-gradient(0deg, rgba(${ACCENT_RGB},0.55) 0 1px, transparent 1px 5px)`,
              mixBlendMode: "screen",
            }}
          />
          {/* NARRATE — a story radiating out */}
          <FadeLayer
            visible={isStep("narrate")}
            style={{
              background: `radial-gradient(circle at 50% 50%, transparent 0%, transparent 22%, rgba(${ACCENT_RGB},0.3) 35%, transparent 48%, rgba(${ACCENT_RGB},0.25) 60%, transparent 72%, rgba(${ACCENT_RGB},0.2) 86%, transparent 100%)`,
              mixBlendMode: "screen",
              animation: "ptta-audio-ripple 2.4s ease-in-out infinite",
            }}
          />
          {/* VOICE — a waveform along the bottom */}
          <VoiceWaveformOverlay visible={isStep("voice")} />

          <ScanLine />
        </div>
      </div>
    </StageFrame>
  );
}

const WAVE_BARS = [22, 42, 60, 38, 70, 48, 84, 55, 72, 40, 62, 80, 46, 68, 34, 58];

function VoiceWaveformOverlay({ visible }: { visible: boolean }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 flex h-1/3 items-end justify-center gap-[3px] px-5 pb-5"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.85s ease" }}
    >
      {WAVE_BARS.map((h, i) => (
        <span
          key={i}
          className="flex-1 rounded-full bg-accent"
          style={{
            height: visible ? `${h}%` : "8%",
            maxWidth: 6,
            animation: visible
              ? `ptta-wave-pulse 1.2s ease-in-out ${(i * 0.06).toFixed(2)}s infinite alternate`
              : undefined,
          }}
        />
      ))}
    </div>
  );
}
