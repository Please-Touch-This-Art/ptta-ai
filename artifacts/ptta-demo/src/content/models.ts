export type ModelId =
  | "mona-lisa"
  | "van-gogh"
  | "the-scream"
  | "persistence-of-memory"
  | "st-nikolai"
  | "eiffel-tower";

export interface ModelEntry {
  id: ModelId;
  type: "painting" | "monument";
  title: string;
  artist: string;
  year: string;
  image: string;
  glb?: string;
  /** The GLB carries the painting as a base-colour texture, so the viewer keeps
      its colours instead of tinting the relief cream. */
  colored?: boolean;
  available: boolean;
  commissionedBy?: string;
  /** Override the default <model-viewer orientation> ("roll pitch yaw"). Give
      units: bare numbers are read as radians, so "0 -90 0" tilts ~27° off. */
  orientation?: string;
}

function publicPath(relative: string): string {
  const base = import.meta.env.BASE_URL || "/";
  return `${base}${relative}`.replace(/\/{2,}/g, "/");
}

export const MODELS: ModelEntry[] = [
  {
    id: "mona-lisa",
    type: "painting",
    title: "Mona Lisa",
    artist: "Leonardo da Vinci",
    year: "c. 1503",
    image: publicPath("paintings/mona-lisa.webp"),
    glb: publicPath("models/mona-lisa.glb"),
    available: true,
    commissionedBy: "Commissioned by Tvibit Norway",
  },
  {
    id: "van-gogh",
    type: "painting",
    title: "Self-Portrait with Grey Felt Hat",
    artist: "Vincent van Gogh",
    year: "1887",
    image: publicPath("paintings/van-gogh.webp"),
    /* The coloured relief (see COMPARE_MODEL in PradaLanding.tsx), welded and
       simplified for the stage; it renders the same as the 18 MB full cut.
         gltf-transform weld     van-gogh-colored.glb welded.glb
         gltf-transform simplify --ratio 0.35 --error 0.0002 welded.glb simp.glb
         gltf-transform meshopt  --level medium simp.glb van-gogh-colored-viewer.glb
       The untextured van-gogh.glb is kept alongside. */
    glb: publicPath("models/van-gogh-colored-viewer.glb"),
    colored: true,
    available: true,
  },
  {
    id: "the-scream",
    type: "painting",
    title: "The Scream",
    artist: "Edvard Munch",
    year: "1893",
    image: publicPath("paintings/the-scream.jpg"),
    /* the-scream.glb with the painting projected front-on (u from X, v from Z)
       as a base-colour texture, then welded, simplified at --ratio 0.4
       --error 0.0002 and meshopt-compressed. The untextured file is kept. */
    glb: publicPath("models/the-scream-colored.glb"),
    colored: true,
    available: true,
    // Authored lying flat (Y = shallow depth, Z = tall). Rotate 90°
    // around X so it stands upright with its face toward the camera.
    orientation: "0deg -90deg 0deg",
  },
  {
    id: "persistence-of-memory",
    type: "painting",
    title: "The Persistence of Memory",
    artist: "Salvador Dalí",
    year: "1931",
    image: publicPath("paintings/persistence-of-memory.jpeg"),
    glb: publicPath("models/persistence-of-memory.glb"),
    available: true,
    // Same axis convention as The Scream — stand it up via X rotation.
    orientation: "0deg -90deg 0deg",
  },
  {
    id: "st-nikolai",
    type: "monument",
    title: "St. Nikolai Church",
    artist: "Hamburg",
    year: "19th century",
    image: publicPath("paintings/st-nikolai.jpg"),
    glb: publicPath("models/st-nikolai.glb"),
    available: true,
    commissionedBy: "Commissioned by St. Nikolai Church Museum",
  },
  {
    id: "eiffel-tower",
    type: "monument",
    title: "Eiffel Tower",
    artist: "Paris",
    year: "1889",
    image: publicPath("paintings/eiffel-tower.webp"),
    glb: publicPath("models/eiffel-tower.glb"),
    available: true,
  },
];

export const PAINTINGS = MODELS.filter((m) => m.type === "painting");
export const MONUMENTS = MODELS.filter((m) => m.type === "monument");
