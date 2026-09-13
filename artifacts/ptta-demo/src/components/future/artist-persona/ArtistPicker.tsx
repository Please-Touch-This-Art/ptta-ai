import { useRef } from "react";
import { ARTIST_IDS, ARTISTS, type ArtistId } from "@/content/artists";
import { cn } from "@/lib/utils";

interface Props {
  selected: ArtistId;
  onSelect: (id: ArtistId) => void;
}

/** The painters as a row of portrait plates; arrow keys move between them. */
export function ArtistPicker({ selected, onSelect }: Props) {
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([]);

  const onKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const idx = ARTIST_IDS.indexOf(selected);
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    const nextIdx = (idx + step + ARTIST_IDS.length) % ARTIST_IDS.length;
    onSelect(ARTIST_IDS[nextIdx]);
    tabsRef.current[nextIdx]?.focus();
    e.preventDefault();
  };

  return (
    <div
      role="tablist"
      aria-label="Choose a painter to talk to"
      className="grid grid-cols-4 gap-4 border-b border-black/10 pb-8 md:gap-8"
      onKeyDown={onKey}
    >
      {ARTIST_IDS.map((id, i) => {
        const meta = ARTISTS[id];
        const isSelected = id === selected;
        const src = `${import.meta.env.BASE_URL || "/"}${meta.portrait}`.replace(/\/{2,}/g, "/");
        return (
          <button
            key={id}
            ref={(el) => {
              tabsRef.current[i] = el;
            }}
            type="button"
            role="tab"
            aria-selected={isSelected}
            aria-controls="artist-chat-panel"
            tabIndex={isSelected ? 0 : -1}
            onClick={() => onSelect(id)}
            className="group flex flex-col items-start text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
          >
            <span
              className={cn(
                "prada-plate block aspect-[4/5] w-full transition-opacity duration-300",
                isSelected
                  ? "ring-1 ring-black ring-offset-2 ring-offset-(--color-white)"
                  : "opacity-50 group-hover:opacity-90",
              )}
            >
              <img src={src} alt="" aria-hidden="true" loading="lazy" className="h-full w-full object-cover" />
            </span>
            <span
              className={cn(
                "prada-mono-caps mt-3 text-[10px] transition-colors",
                isSelected ? "text-black" : "text-black/45",
              )}
            >
              {meta.shortName}
            </span>
          </button>
        );
      })}
    </div>
  );
}
