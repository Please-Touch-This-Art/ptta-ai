import { useEffect, useRef } from "react";
import { MODELS, type ModelEntry, type ModelId } from "@/content/models";
import { cn } from "@/lib/utils";

type Variant = "light" | "dark";

interface Props {
  activeId: ModelId;
  onSelect: (id: ModelId) => void;
  /** Restrict to a subset (e.g. paintings only). Defaults to all available models. */
  models?: ModelEntry[];
  /** Style against light page background ("light") vs dark hero ("dark"). */
  variant?: Variant;
  className?: string;
}

export function PaintingCarousel({
  activeId,
  onSelect,
  models,
  variant = "light",
  className,
}: Props) {
  const items = (models ?? MODELS).filter((m) => m.available);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  // Bring the active thumb into view whenever the selection changes.
  useEffect(() => {
    const node = activeRef.current;
    if (!node) return;
    node.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeId]);

  const isDark = variant === "dark";

  return (
    <div
      className={cn(
        "relative w-full",
        isDark
          ? "bg-stone-950/85 border-b border-white/10"
          : "bg-page/95 border-b border-hairline backdrop-blur-sm",
        className,
      )}
      role="tablist"
      aria-label="Swap painting"
    >
      <div
        ref={scrollerRef}
        className="flex items-center gap-2 overflow-x-auto px-4 py-2 snap-x snap-mandatory scroll-px-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {items.map((m) => {
          const isActive = m.id === activeId;
          return (
            <button
              key={m.id}
              ref={isActive ? activeRef : null}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`Switch to ${m.title} by ${m.artist}`}
              onClick={() => {
                if (!isActive) onSelect(m.id);
              }}
              className={cn(
                "relative shrink-0 snap-center overflow-hidden rounded-md transition-all duration-200",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                isActive
                  ? "w-16 h-16 ring-2 ring-accent ring-offset-2 " +
                      (isDark ? "ring-offset-stone-950" : "ring-offset-page")
                  : "w-12 h-12 opacity-65 hover:opacity-100",
              )}
            >
              {m.image ? (
                <img
                  src={m.image}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div
                  className={cn(
                    "absolute inset-0 flex items-center justify-center text-[9pt]",
                    isDark ? "bg-stone-800 text-cream" : "bg-surface-muted text-muted-fg",
                  )}
                >
                  {m.title.slice(0, 1)}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
