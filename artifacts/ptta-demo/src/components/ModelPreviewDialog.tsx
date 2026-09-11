import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

/**
 * Opens a GLB over the page in a modal.
 *
 * `@google/model-viewer` pulls in three.js and is far larger than the rest of
 * this page put together, so it is imported only once someone actually asks
 * for the 3D view. The homepage bundle is unchanged until then.
 */

interface Props {
  open: boolean;
  onClose: () => void;
  src: string;
  alt: string;
  title: string;
  meta: string;
  closeLabel: string;
  loadingLabel: string;
  errorLabel: string;
}

type Status = "loading" | "ready" | "error";

export function ModelPreviewDialog({
  open,
  onClose,
  src,
  alt,
  title,
  meta,
  closeLabel,
  loadingLabel,
  errorLabel,
}: Props) {
  const [defined, setDefined] = useState(false);
  const [status, setStatus] = useState<Status>("loading");
  const viewerRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || defined) return;
    let cancelled = false;
    import("@google/model-viewer").then((mod) => {
      if (cancelled) return;
      /* These GLBs are packed by gltfpack with EXT_meshopt_compression, and
         model-viewer only wires the meshopt decoder into three's GLTFLoader
         when this is set. Without it the download finishes, the geometry is
         never decoded, and `load` never fires. Same as the demo viewer. */
      mod.ModelViewerElement.meshoptDecoderLocation =
        "https://unpkg.com/meshoptimizer@0.20.0/meshopt_decoder.js";
      setDefined(true);
    }).catch(() => {
      if (!cancelled) setStatus("error");
    });
    return () => {
      cancelled = true;
    };
  }, [open, defined]);

  /* Escape closes, focus starts on the close button and returns to whatever
     opened the dialog, and the page behind it does not scroll. */
  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      opener?.focus?.();
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open || !defined) return;
    const el = viewerRef.current;
    if (!el) return;
    setStatus("loading");
    const onLoad = () => setStatus("ready");
    const onError = () => setStatus("error");
    el.addEventListener("load", onLoad);
    el.addEventListener("error", onError);
    return () => {
      el.removeEventListener("load", onLoad);
      el.removeEventListener("error", onError);
    };
  }, [open, defined]);

  const onBackdrop = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === panelRef.current) onClose();
    },
    [onClose],
  );

  if (!open) return null;

  const envUrl = `${import.meta.env.BASE_URL || "/"}environments/studio.hdr`.replace(
    /\/{2,}/g,
    "/",
  );

  return (
    <div
      ref={panelRef}
      onMouseDown={onBackdrop}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      /* Opaque, not translucent: the page behind holds the same portrait, and
         seeing it ghosted through the model was more distracting than dim. */
      className="fixed inset-0 z-[100] bg-[#0a0806] flex flex-col"
    >
      <div className="flex items-start justify-between gap-4 px-5 md:px-8 pt-5 md:pt-6 pb-3">
        <div className="min-w-0">
          <p className="prada-display text-[17px] md:text-[20px] text-white leading-tight truncate">
            {title}
          </p>
          <p className="prada-mono-caps text-[9.5px] text-white/55 mt-1.5">{meta}</p>
        </div>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className="shrink-0 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="relative flex-1 min-h-0">
        {defined && (
          <model-viewer
            ref={viewerRef}
            src={src}
            alt={alt}
            camera-controls
            auto-rotate
            rotation-per-second="24deg"
            camera-orbit="-35deg 80deg auto"
            shadow-intensity="2.4"
            shadow-softness="0.4"
            exposure="0.95"
            environment-image={envUrl}
            touch-action="pan-y"
            interaction-prompt="none"
            loading="eager"
            reveal="auto"
            style={{ width: "100%", height: "100%", display: "block" }}
          />
        )}
        {status !== "ready" && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="prada-mono-caps text-[10px] text-white/60">
              {status === "error" ? errorLabel : loadingLabel}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
