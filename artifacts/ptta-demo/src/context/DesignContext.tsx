import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type DesignId =
  | "default"
  | "hermes"
  | "prada"
  | "loewe"
  | "saintlaurent"
  | "aesop"
  | "mission"
  | "pitch"
  | "spotlight";

export interface DesignOption {
  id: DesignId;
  name: string;
  description: string;
}

export const DESIGN_OPTIONS: DesignOption[] = [
  {
    id: "default",
    name: "Default",
    description: "Original PTTA editorial layout.",
  },
  {
    id: "hermes",
    name: "Hermès",
    description: "Maison Hermès — italic serif, generous breathing, minimal accent.",
  },
  {
    id: "prada",
    name: "Prada",
    description: "Prada — geometric sans display, alternating grey panels, serif wordmark.",
  },
  {
    id: "loewe",
    name: "Loewe",
    description: "Loewe — editorial split layout, Untitled Sans body, monospaced annotations.",
  },
  {
    id: "saintlaurent",
    name: "Saint Laurent",
    description: "Saint Laurent — couture brutalism, oversized compressed display, monochrome.",
  },
  {
    id: "aesop",
    name: "Aesop",
    description: "Aesop — apothecary serif, lowercase, considered vertical rhythm.",
  },
  {
    id: "mission",
    name: "Mission Control",
    description: "Dark demo console — IBM Plex Mono + Fraunces italic, live signals, specimen grid.",
  },
  {
    id: "pitch",
    name: "Pitch Deck",
    description: "Dark slide deck — Untitled Sans + Fraunces italic, slide markers, NOW SHOWING pin.",
  },
  {
    id: "spotlight",
    name: "Spotlight",
    description: "Dark warm-coal stage — Manrope + EB Garamond italic, amber glow, stage selector.",
  },
];

const DEFAULT_DESIGN_ID: DesignId = "default";
const STORAGE_KEY = "ptta-design";

interface DesignContextValue {
  design: DesignOption;
  setDesignId: (id: DesignId) => void;
  options: DesignOption[];
}

const DesignContext = createContext<DesignContextValue | null>(null);

function readInitialId(): DesignId {
  if (typeof window === "undefined") return DEFAULT_DESIGN_ID;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (
    stored === "default" ||
    stored === "hermes" ||
    stored === "prada" ||
    stored === "loewe" ||
    stored === "saintlaurent" ||
    stored === "aesop" ||
    stored === "mission" ||
    stored === "pitch" ||
    stored === "spotlight"
  ) {
    return stored;
  }
  return DEFAULT_DESIGN_ID;
}

export function DesignProvider({ children }: { children: ReactNode }) {
  const [id, setId] = useState<DesignId>(readInitialId);
  const design = DESIGN_OPTIONS.find((o) => o.id === id) ?? DESIGN_OPTIONS[0];

  useEffect(() => {
    const root = document.documentElement;
    if (design.id === "default") {
      root.removeAttribute("data-design");
    } else {
      root.setAttribute("data-design", design.id);
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, design.id);
    } catch {
      // ignore
    }
  }, [design]);

  return (
    <DesignContext.Provider value={{ design, setDesignId: setId, options: DESIGN_OPTIONS }}>
      {children}
    </DesignContext.Provider>
  );
}

export function useDesign(): DesignContextValue {
  const ctx = useContext(DesignContext);
  if (!ctx) throw new Error("useDesign must be used inside DesignProvider");
  return ctx;
}
