import type { ReactNode } from "react";
import type { ModelEntry, ModelId } from "@/content/models";
import { PieceStrip } from "./PieceStrip";

interface Props {
  /** What the stage is doing: Fabricating, Finishing, Finished piece. */
  label: string;
  model: ModelEntry;
  onBack: () => void;
  backLabel: string;
  onSwap?: (id: ModelId) => void;
  /** What plays on the dark plate. Children are positioned against it. */
  children: ReactNode;
  /** Status line under the plate: progress on the left, the machine's state on the right. */
  status?: { left: string; right: string };
  /** Copy and calls to action in the column beside the plate. */
  aside?: ReactNode;
}

/**
 * The frame every workshop stage sits in: the piece's name and the stage's
 * name above a hairline; the dark square plate the stage plays on, with its
 * status line; and beside it the source artwork, the stage's copy, and the
 * strip for swapping the piece. Set the way the homepage sets its work.
 */
export function StageFrame({
  label,
  model,
  onBack,
  backLabel,
  onSwap,
  children,
  status,
  aside,
}: Props) {
  return (
    <section className="pt-10 md:pt-14 pb-16 md:pb-24 px-6 md:px-10" aria-label={`${label}: ${model.title}`}>
      <div className="mx-auto max-w-[1140px]">
        <div className="flex flex-col gap-4 border-b border-black/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="prada-mono-caps text-[10px] text-black/45">{label}</p>
            <h1 className="prada-display mt-2 text-[24px] md:text-[32px] leading-[1.12]">{model.title}</h1>
            <p className="prada-body mt-1 text-[14px] text-black/55">
              {model.artist} · {model.year}
            </p>
          </div>
          <button type="button" onClick={onBack} className="prada-link-cta shrink-0 self-start sm:self-auto">
            {backLabel}
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 items-start gap-8 md:grid-cols-[minmax(0,1fr)_300px] md:gap-12">
          <div>
            {/* Square, and no taller than the viewport allows, so the whole
                plate is in view while it works. */}
            <div
              className="prada-plate mx-auto aspect-square w-full bg-[#0a0806]"
              style={{ maxWidth: "min(100%, 72vh)" }}
            >
              {children}
            </div>
            {status && (
              <div
                className="mx-auto mt-4 flex items-center justify-between border-t border-black/10 pt-3"
                style={{ maxWidth: "min(100%, 72vh)" }}
                aria-live="polite"
              >
                <span className="prada-mono-caps text-[10px] text-black/60">{status.left}</span>
                <span className="prada-mono-caps text-[10px] text-black">{status.right}</span>
              </div>
            )}
          </div>

          <aside className="flex flex-col gap-8">
            <div>
              <p className="prada-mono-caps text-[10px] text-black/45">Source artwork</p>
              <figure className="prada-plate m-0 mt-3 aspect-[4/5] w-full max-w-[200px]">
                <img
                  src={model.image}
                  alt={`${model.title} by ${model.artist}`}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </figure>
            </div>
            {aside}
            {onSwap && <PieceStrip activeId={model.id} onSelect={onSwap} label="Run another piece" />}
          </aside>
        </div>
      </div>
    </section>
  );
}
