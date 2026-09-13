/** The crossfade a demo's stages use as they hand over to one another. */
export const STAGE_FADE = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.25 },
} as const;
