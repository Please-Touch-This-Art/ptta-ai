import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MODELS, type ModelId } from "@/content/models";
import { SiteShell } from "@/components/prada/SiteShell";
import { STAGE_FADE } from "@/components/prada/stageFade";
import { AudioGuidePicker } from "@/components/audio-guide/AudioGuidePicker";
import { AudioProcessingStage } from "@/components/audio-guide/AudioProcessingStage";
import { AudioPlayer } from "@/components/audio-guide/AudioPlayer";

type Stage =
  | { stage: "picker" }
  | { stage: "processing"; modelId: ModelId }
  | { stage: "player"; modelId: ModelId };

export default function AudioGuide() {
  const [state, setState] = useState<Stage>({ stage: "picker" });

  const handleSelect = useCallback((id: ModelId) => {
    setState({ stage: "processing", modelId: id });
  }, []);

  const handleProcessingDone = useCallback(() => {
    setState((prev) =>
      prev.stage === "processing" ? { stage: "player", modelId: prev.modelId } : prev,
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
            <AudioGuidePicker onSelect={handleSelect} />
          </motion.div>
        )}
        {model && state.stage === "processing" && (
          <motion.div key="processing" {...STAGE_FADE}>
            <AudioProcessingStage
              key={model.id}
              model={model}
              onDone={handleProcessingDone}
              onBack={toPicker}
              onSwap={handleSelect}
            />
          </motion.div>
        )}
        {model && state.stage === "player" && (
          <motion.div key="player" {...STAGE_FADE}>
            <AudioPlayer key={model.id} model={model} onBack={toPicker} onSwap={handleSelect} />
          </motion.div>
        )}
      </AnimatePresence>
    </SiteShell>
  );
}
