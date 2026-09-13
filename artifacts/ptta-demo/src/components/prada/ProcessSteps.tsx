import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

/** One pass of a staged process: its name, what it is doing, and the filter it puts on the plate. */
export interface ProcessStep {
  id: string;
  label: string;
  hint: string;
  filter: string;
}

const pad2 = (n: number) => String(n).padStart(2, "0");

/** The passes as a list beside the plate; the active one unfolds its line. */
export function StepList({ steps, activeIndex }: { steps: ProcessStep[]; activeIndex: number }) {
  return (
    <ol className="flex flex-col border-t border-black/10" aria-label="Steps">
      {steps.map((s, i) => {
        const state = i < activeIndex ? "done" : i === activeIndex ? "active" : "idle";
        return (
          <li
            key={s.id}
            aria-current={state === "active" ? "step" : undefined}
            className="border-b border-black/10 py-3"
          >
            <div className="flex items-baseline justify-between">
              <span
                className={cn(
                  "prada-mono-caps text-[10px] transition-colors duration-500",
                  state === "active" && "text-black",
                  state === "done" && "text-black/45",
                  state === "idle" && "text-black/25",
                )}
              >
                {pad2(i + 1)} · {s.label}
              </span>
              {state === "done" && (
                <span className="prada-mono-caps text-[10px] text-black/45">Done</span>
              )}
            </div>
            <p
              className={cn(
                "prada-body overflow-hidden text-[14px] leading-[1.6] text-black/65 transition-all duration-500",
                state === "active" ? "mt-1.5 max-h-24 opacity-100" : "max-h-0 opacity-0",
              )}
            >
              {s.hint}
            </p>
          </li>
        );
      })}
    </ol>
  );
}

/** An overlay on the plate that fades in for one pass and out for the rest. */
export function FadeLayer({ visible, style }: { visible: boolean; style: CSSProperties }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{ ...style, opacity: visible ? 1 : 0, transition: "opacity 0.85s ease" }}
    />
  );
}

/** The scan line every staged process runs across its plate. */
export function ScanLine() {
  return (
    <div
      className="pointer-events-none absolute left-0 right-0"
      style={{
        height: 2,
        top: 0,
        background: "linear-gradient(90deg, transparent, var(--color-accent), transparent)",
        boxShadow: "0 0 12px var(--color-accent), 0 0 24px rgba(var(--accent-rgb),0.5)",
        animation: "ptta-scan-sweep 2.8s linear infinite",
      }}
    />
  );
}
