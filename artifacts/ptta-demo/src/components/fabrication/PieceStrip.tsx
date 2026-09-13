import { MODELS, type ModelId } from "@/content/models";
import { cn } from "@/lib/utils";

interface Props {
  activeId: ModelId;
  onSelect: (id: ModelId) => void;
  label: string;
}

/** The other pieces as a row of small plates: pick one to run it through the same stage. */
export function PieceStrip({ activeId, onSelect, label }: Props) {
  const items = MODELS.filter((m) => m.available);
  return (
    <div>
      <p className="prada-mono-caps text-[10px] text-black/45">{label}</p>
      <ul className="mt-3 flex flex-wrap gap-2.5" role="tablist" aria-label={label}>
        {items.map((m) => {
          const isActive = m.id === activeId;
          return (
            <li key={m.id}>
              <button
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Switch to ${m.title} by ${m.artist}`}
                onClick={() => {
                  if (!isActive) onSelect(m.id);
                }}
                className={cn(
                  "prada-plate block h-12 w-12 transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black",
                  isActive
                    ? "ring-1 ring-black ring-offset-2 ring-offset-white"
                    : "opacity-55 hover:opacity-100",
                )}
              >
                <img
                  src={m.image}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
