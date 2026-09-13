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

/* The Prada landing is the site. The picker came off the header on 2026-09-13;
   a value an earlier visit left in storage must not switch the page back to a
   retired variant, so nothing is read from storage here. */
const DEFAULT_DESIGN_ID: DesignId = "prada";

interface DesignContextValue {
  design: DesignOption;
  setDesignId: (id: DesignId) => void;
  options: DesignOption[];
}

const DesignContext = createContext<DesignContextValue | null>(null);

function readInitialId(): DesignId {
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
