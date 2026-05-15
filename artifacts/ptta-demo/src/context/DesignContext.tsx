import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type DesignId = "default" | "hermes" | "prada";

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
    description: "Prada — bold sans display, alternating grey panels, serif wordmark.",
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
  if (stored === "default" || stored === "hermes" || stored === "prada") return stored;
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
