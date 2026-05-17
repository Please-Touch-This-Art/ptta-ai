import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import type { ModelId } from "@/content/models";

export type ProcessSlug = "model" | "fabrication" | "audio" | "artist";

export interface ProcessMeta {
  slug: ProcessSlug;
  label: string;
  shortLabel: string;
}

export const PROCESSES: readonly ProcessMeta[] = [
  { slug: "model", label: "AI 3D Model", shortLabel: "Model" },
  { slug: "fabrication", label: "Fabrication", shortLabel: "Fabrication" },
  { slug: "audio", label: "Audio Guide", shortLabel: "Audio" },
  { slug: "artist", label: "Artist Persona", shortLabel: "Artist" },
] as const;

interface Props {
  artworkId: ModelId;
  activeSlug: ProcessSlug;
}

export function ProcessStepper({ artworkId, activeSlug }: Props) {
  const [, navigate] = useLocation();
  const activeIdx = PROCESSES.findIndex((p) => p.slug === activeSlug);

  return (
    <nav
      aria-label="Demo journey progress"
      className="sticky top-[3.25rem] z-40 bg-page/95 backdrop-blur border-b border-hairline"
    >
      <div className="mx-auto w-full max-w-[560px] px-4 py-2.5 flex justify-center">
        <ol className="flex items-center gap-2 flex-nowrap">
          {PROCESSES.map((p, i) => {
            const isActive = p.slug === activeSlug;
            const isDone = i < activeIdx;
            return (
              <li key={p.slug} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigate(`/journey/${artworkId}/${p.slug}`)}
                  aria-current={isActive ? "step" : undefined}
                  aria-label={`Step ${i + 1} of ${PROCESSES.length}: ${p.label}`}
                  className={cn(
                    "inline-flex items-center gap-2 px-3.5 py-2 rounded-full font-bold transition-all",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500",
                    isActive &&
                      "bg-orange-500 text-white shadow-md shadow-orange-500/25",
                    !isActive &&
                      isDone &&
                      "bg-orange-500/10 text-orange-600 hover:bg-orange-500/15",
                    !isActive &&
                      !isDone &&
                      "text-muted-fg hover:text-ink hover:bg-surface-muted",
                  )}
                  style={{ letterSpacing: "-0.005em" }}
                >
                  <span
                    className={cn(
                      "inline-flex items-center justify-center rounded-full text-[10pt] leading-none",
                      "w-5 h-5",
                      isActive && "bg-white/25 text-white",
                      !isActive && isDone && "bg-orange-500 text-white",
                      !isActive && !isDone && "bg-surface-muted text-muted-fg",
                    )}
                    aria-hidden
                  >
                    {isDone && !isActive ? "✓" : i + 1}
                  </span>
                  <span
                    className={cn(
                      "leading-none",
                      isActive ? "text-[11pt]" : "text-[10pt]",
                    )}
                  >
                    {p.shortLabel}
                  </span>
                </button>
                {i < PROCESSES.length - 1 && (
                  <span
                    aria-hidden
                    className={cn(
                      "h-px w-3 md:w-4",
                      i < activeIdx ? "bg-orange-500" : "bg-hairline",
                    )}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
