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
      className="z-40 bg-page/95 backdrop-blur border-b border-hairline"
    >
      <div className="mx-auto w-full max-w-[640px] px-2 sm:px-4 py-2 sm:py-2.5 flex justify-center overflow-x-auto">
        <ol className="flex items-center justify-center flex-nowrap">
          {PROCESSES.map((p, i) => {
            const isActive = p.slug === activeSlug;
            const isDone = i < activeIdx;
            return (
              <li key={p.slug} className="flex items-center">
                <button
                  type="button"
                  onClick={() => navigate(`/journey/${artworkId}/${p.slug}`)}
                  aria-current={isActive ? "step" : undefined}
                  aria-label={`Step ${i + 1} of ${PROCESSES.length}: ${p.label}`}
                  className={cn(
                    "inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full transition-colors whitespace-nowrap",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                    isActive && "bg-accent",
                    !isActive && isDone && "text-accent hover:bg-accent/10",
                    !isActive &&
                      !isDone &&
                      "text-muted-fg hover:text-ink hover:bg-surface-muted",
                  )}
                  style={{
                    letterSpacing: "0",
                    fontWeight: 400,
                    ...(isActive ? { color: "#241A0E" } : {}),
                  }}
                >
                  <span
                    className={cn(
                      "inline-flex items-center justify-center rounded-full text-[7.5pt] sm:text-[9pt] leading-none",
                      "w-3.5 h-3.5 sm:w-[18px] sm:h-[18px]",
                      isActive && "bg-black/15",
                      !isActive && isDone && "bg-accent text-page",
                      !isActive && !isDone && "bg-surface-muted text-muted-fg",
                    )}
                    style={{ fontWeight: 500 }}
                    aria-hidden
                  >
                    {isDone && !isActive ? "✓" : i + 1}
                  </span>
                  <span
                    className={cn(
                      "leading-none",
                      "text-[8.5pt] sm:text-[10pt]",
                    )}
                  >
                    {p.shortLabel}
                  </span>
                </button>
                {i < PROCESSES.length - 1 && (
                  <span
                    aria-hidden
                    className={cn(
                      "h-[2px] w-3 sm:w-5 shrink-0 rounded-full",
                      i < activeIdx ? "bg-accent" : "bg-hairline",
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
