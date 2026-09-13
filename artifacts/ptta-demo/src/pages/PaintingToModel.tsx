import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MODELS, type ModelId } from "@/content/models";
import { SiteShell } from "@/components/prada/SiteShell";
import { STAGE_FADE } from "@/components/prada/stageFade";
import { ModelPicker } from "@/components/painting-to-model/ModelPicker";
import { ProcessingStage } from "@/components/painting-to-model/ProcessingStage";
import { ViewerStage } from "@/components/painting-to-model/ViewerStage";

type Stage =
  | { stage: "picker" }
  | { stage: "processing"; modelId: ModelId }
  | { stage: "viewer"; modelId: ModelId };

export default function PaintingToModel() {
  const [state, setState] = useState<Stage>({ stage: "picker" });

  const handleSelect = useCallback((id: ModelId) => {
    setState({ stage: "processing", modelId: id });
  }, []);

  const handleProcessingDone = useCallback(() => {
    setState((prev) =>
      prev.stage === "processing" ? { stage: "viewer", modelId: prev.modelId } : prev,
    );
  }, []);

  const toPicker = useCallback(() => setState({ stage: "picker" }), []);

  const model =
    state.stage === "picker" ? undefined : MODELS.find((m) => m.id === state.modelId);

  /* The header and footer stay put; only the stage between them crossfades. */
  return (
    <SiteShell>
      <AnimatePresence mode="wait">
        {(!model || state.stage === "picker") && (
          <motion.div key="picker" {...STAGE_FADE}>
            <ModelPicker onSelect={handleSelect} />
          </motion.div>
        )}
        {model && state.stage === "processing" && (
          <motion.div key="processing" {...STAGE_FADE}>
            <ProcessingStage
              key={model.id}
              model={model}
              onDone={handleProcessingDone}
              onBack={toPicker}
              onSwap={handleSelect}
            />
          </motion.div>
        )}
        {model && state.stage === "viewer" && (
          <motion.div key="viewer" {...STAGE_FADE}>
            <ViewerStage key={model.id} model={model} onBack={toPicker} onSwap={handleSelect} />
          </motion.div>
        )}
      </AnimatePresence>
    </SiteShell>
  );
}
