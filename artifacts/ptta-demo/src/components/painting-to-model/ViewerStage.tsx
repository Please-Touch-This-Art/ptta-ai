import { ModelViewerElement } from "@google/model-viewer";
import { useEffect, useRef, useState } from "react";
import type { ModelEntry, ModelId } from "@/content/models";
import { StageFrame } from "@/components/prada/StageFrame";
import { NextModuleCta } from "@/components/NextModuleCta";

// Our GLBs are produced by gltfpack with EXT_meshopt_compression +
// KHR_mesh_quantization. model-viewer only wires the meshopt decoder into
// three's GLTFLoader if this location is set (see @google/model-viewer's
// features/loading.js). Without it the GLB download completes but the
// geometry is never decoded — load event never fires, canvas stays empty.
ModelViewerElement.meshoptDecoderLocation =
  "https://unpkg.com/meshoptimizer@0.20.0/meshopt_decoder.js";

interface Props {
  model: ModelEntry;
  onBack: () => void;
  onSwap?: (id: ModelId) => void;
}

type Status = "loading" | "ready" | "error";

const AUTO_ROTATE_DELAY_INITIAL_MS = 800;
const AUTO_ROTATE_DELAY_AFTER_INTERACTION_MS = 10000;

export function ViewerStage({ model, onBack, onSwap }: Props) {
  const viewerRef = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [progress, setProgress] = useState(0);
  const [errorDetail, setErrorDetail] = useState("");

  useEffect(() => {
    const el = viewerRef.current;
    if (!el || !model.glb) return;

    el.setAttribute("src", model.glb);
    el.setAttribute("auto-rotate-delay", String(AUTO_ROTATE_DELAY_INITIAL_MS));

    let bumped = false;
    const handleCameraChange = (event: Event) => {
      const detail = (event as CustomEvent<{ source?: string }>).detail;
      if (detail?.source === "user-interaction" && !bumped) {
        bumped = true;
        el.setAttribute(
          "auto-rotate-delay",
          String(AUTO_ROTATE_DELAY_AFTER_INTERACTION_MS)
        );
      }
    };

    const handleLoad = () => {
      setStatus("ready");
      const isLowRelief = model.type === "painting";
      const baseColor: [number, number, number, number] = isLowRelief
        ? [0.72, 0.66, 0.57, 1]
        : [0.82, 0.76, 0.67, 1];
      const roughness = isLowRelief ? 0.95 : 0.4;

      try {
        type PBRSetters = {
          setBaseColorFactor?: (rgba: [number, number, number, number]) => void;
          setMetallicFactor?: (v: number) => void;
          setRoughnessFactor?: (v: number) => void;
        };
        type MVMaterial = { pbrMetallicRoughness?: PBRSetters };
        type MVModel = { materials?: MVMaterial[] };
        const materials = (el as unknown as { model?: MVModel }).model
          ?.materials;
        if (materials && materials.length > 0) {
          for (const mat of materials) {
            mat.pbrMetallicRoughness?.setBaseColorFactor?.(baseColor);
            mat.pbrMetallicRoughness?.setMetallicFactor?.(0);
            mat.pbrMetallicRoughness?.setRoughnessFactor?.(roughness);
          }
        }
      } catch {
        /* material tweaking is progressive enhancement */
      }
    };

    const handleProgress = (event: Event) => {
      const detail = (event as CustomEvent<{ totalProgress: number }>).detail;
      if (detail?.totalProgress != null) {
        setProgress(detail.totalProgress);
        if (detail.totalProgress >= 1) setStatus("ready");
      }
    };

    const handleError = (event: Event) => {
      const detail = (event as CustomEvent).detail;
      const msg =
        detail?.sourceError?.message ||
        detail?.type ||
        (typeof detail === "string" ? detail : JSON.stringify(detail));
      setStatus("error");
      setErrorDetail(msg || "Unknown error");
    };

    el.addEventListener("load", handleLoad);
    el.addEventListener("progress", handleProgress);
    el.addEventListener("error", handleError);
    el.addEventListener("camera-change", handleCameraChange);
    return () => {
      el.removeEventListener("load", handleLoad);
      el.removeEventListener("progress", handleProgress);
      el.removeEventListener("error", handleError);
      el.removeEventListener("camera-change", handleCameraChange);
    };
  }, [model.id, model.glb]);

  if (!model.glb) return null;

  const envUrl = `${import.meta.env.BASE_URL || "/"}environments/studio.hdr`
    .replace(/\/{2,}/g, "/");

  const isPainting = model.type === "painting";
  const cameraOrbit = isPainting ? "-55deg 82deg auto" : "-25deg 76deg auto";
  const exposure = isPainting ? "0.8" : "0.95";
  const shadowIntensity = isPainting ? "2.6" : "2.0";
  const orientation = model.orientation ?? "0 0 0";

  return (
    <StageFrame
      label="The tactile model"
      model={model}
      onBack={onBack}
      backLabel="Pick another piece"
      onSwap={onSwap}
      status={{
        left: status === "ready" ? "Drag to rotate · Pinch to zoom" : status === "loading" ? `Loading ${Math.round(progress * 100)}%` : "Could not load",
        right: status === "ready" ? "● Live" : status === "loading" ? "● Loading" : "● Error",
      }}
      aside={
        <div className="flex flex-col gap-6">
          <p className="prada-body text-[14px] md:text-[15px] leading-[1.6] text-black/65">
            The relief as it will be printed: the painting's depth turned into a
            surface a hand can read. Turn it to see how the brushwork stands off
            the ground.
          </p>
          {model.commissionedBy && (
            <p className="prada-mono-caps text-[10px] text-black/45">{model.commissionedBy}</p>
          )}
          <div className="flex flex-col items-start gap-4">
            <button type="button" onClick={onBack} className="prada-link-cta">
              View another
            </button>
            <NextModuleCta fromSlug="3d-model" />
          </div>
        </div>
      }
    >
      <model-viewer
        ref={viewerRef}
        alt={`3D tactile model of ${model.title} by ${model.artist}`}
        orientation={orientation}
        camera-controls
        auto-rotate
        rotation-per-second="24deg"
        camera-orbit={cameraOrbit}
        shadow-intensity={shadowIntensity}
        shadow-softness="0.4"
        exposure={exposure}
        environment-image={envUrl}
        touch-action="pan-y"
        interaction-prompt="none"
        loading="eager"
        reveal="auto"
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          backgroundColor: "#0a0806",
        }}
      />

      {status !== "ready" && (
        <div
          className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-[#0a0806]/90"
          aria-live="polite"
        >
          {status === "loading" && (
            <>
              <div className="h-8 w-8 animate-spin rounded-full border border-white/20 border-t-white/80" />
              <p className="prada-mono-caps text-[10px] text-white/70">
                Loading the model · {Math.round(progress * 100)}%
              </p>
            </>
          )}
          {status === "error" && (
            <div className="max-w-[36ch] px-6 text-center">
              <p className="prada-display text-[17px] text-white/90">Couldn&rsquo;t load the 3D model</p>
              <p className="prada-body mt-2 break-words text-[12px] text-white/55">{errorDetail}</p>
            </div>
          )}
        </div>
      )}
    </StageFrame>
  );
}
