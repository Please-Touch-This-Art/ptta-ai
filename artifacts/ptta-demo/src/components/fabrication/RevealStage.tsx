import { motion } from "framer-motion";
import { useLocation } from "wouter";
import type { ModelEntry, ModelId } from "@/content/models";
import { fabricationImage } from "@/content/fabrication-images";
import { StageFrame } from "@/components/prada/StageFrame";

interface Props {
  model: ModelEntry;
  onBack: () => void;
  onPickAnother: () => void;
  onSwap?: (id: ModelId) => void;
}

const NEXT_DEMO_ROUTE = "/audio-guide";

export function RevealStage({ model, onBack, onPickAnother, onSwap }: Props) {
  const src = fabricationImage(model.id);
  const [, navigate] = useLocation();

  return (
    <StageFrame
      label="Finished piece"
      model={model}
      onBack={onBack}
      backLabel="Back to the demos"
      onSwap={onSwap}
      aside={
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        >
          <p className="prada-mono-caps text-[10px] text-black/45">In the hand</p>
          <p className="prada-display mt-3 text-[19px] leading-[1.25]">
            This is how it looks in your hands.
          </p>
          {model.commissionedBy && (
            <p className="prada-body mt-2 text-[13px] text-black/55">{model.commissionedBy}</p>
          )}
          <div className="mt-6 flex flex-col items-start gap-4">
            <button type="button" onClick={onPickAnother} className="prada-link-cta">
              View another
            </button>
            <button
              type="button"
              onClick={() => navigate(NEXT_DEMO_ROUTE)}
              className="prada-link-cta"
              aria-label="Continue to the AI Audio Guide Curator demo"
            >
              Next: AI Audio Guide Curator
            </button>
          </div>
        </motion.div>
      }
    >
      <div className="absolute inset-0 flex items-center justify-center p-6">
        {src ? (
          <motion.img
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            src={src}
            alt={`Finished tactile relief of ${model.title} by ${model.artist}`}
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <p className="prada-body text-[14px] text-white/60">Finished piece not on file yet.</p>
        )}
      </div>
    </StageFrame>
  );
}
