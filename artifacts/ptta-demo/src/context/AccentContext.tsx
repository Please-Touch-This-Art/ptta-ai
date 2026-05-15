import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface AccentOption {
  id: string;
  name: string;
  hex: string;
  rgb: string;
  /** HSL triplet "H S% L%" — written into --accent, --primary, --ring so Tailwind utilities follow. */
  hsl: string;
  /** HSL triplet for text/icons on top of the accent surface. */
  foregroundHsl: string;
}

// Cream + ink foreground tokens — match the existing palette.
const FG_CREAM = "40 89% 97%";
const FG_INK = "24 10% 10%";

export const ACCENT_OPTIONS: AccentOption[] = [
  // Default — current editorial vermilion (cinnabar red).
  { id: "vermilion",    name: "Vermilion",    hex: "#D64324", rgb: "214, 67, 36",  hsl: "10 71% 49%",  foregroundHsl: FG_CREAM },
  // Klein/Tate-style deep saturated blue.
  { id: "ultramarine",  name: "Ultramarine",  hex: "#2E4FE8", rgb: "46, 79, 232",  hsl: "229 80% 55%", foregroundHsl: FG_CREAM },
  // Warm illumination yellow — fresco gold, New Yorker cover.
  { id: "saffron",      name: "Saffron",      hex: "#F2A03F", rgb: "242, 160, 63", hsl: "33 87% 60%",  foregroundHsl: FG_INK   },
  // Vibrant green — Riso/modern-gallery viridian, not muted forest.
  { id: "emerald",      name: "Emerald",      hex: "#1FAE6B", rgb: "31, 174, 107", hsl: "152 70% 40%", foregroundHsl: FG_CREAM },
  // Hot pink-magenta — risograph fluorescent feel.
  { id: "fuchsia",      name: "Fuchsia",      hex: "#E5407C", rgb: "229, 64, 124", hsl: "338 76% 57%", foregroundHsl: FG_CREAM },
  // Bright museum cyan — Memphis/Bauhaus modern.
  { id: "cyan",         name: "Cyan",         hex: "#1DBED4", rgb: "29, 190, 212", hsl: "187 76% 47%", foregroundHsl: FG_INK   },
];

const DEFAULT_ACCENT_ID = ACCENT_OPTIONS[0].id;
const STORAGE_KEY = "ptta-accent";

interface AccentContextValue {
  accent: AccentOption;
  setAccentId: (id: string) => void;
  options: AccentOption[];
}

const AccentContext = createContext<AccentContextValue | null>(null);

function readInitialId(): string {
  if (typeof window === "undefined") return DEFAULT_ACCENT_ID;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored && ACCENT_OPTIONS.some((o) => o.id === stored)) return stored;
  return DEFAULT_ACCENT_ID;
}

function applyAccent(option: AccentOption) {
  const root = document.documentElement;
  // Drive Tailwind utilities (bg-accent, text-accent-foreground, bg-primary, ring, etc.).
  // These are referenced via `hsl(var(--accent))` etc. in @theme inline, so updating the
  // HSL triplet here cascades into every compiled utility class.
  root.style.setProperty("--accent", option.hsl);
  root.style.setProperty("--accent-foreground", option.foregroundHsl);
  root.style.setProperty("--primary", option.hsl);
  root.style.setProperty("--primary-foreground", option.foregroundHsl);
  root.style.setProperty("--ring", option.hsl);
  root.style.setProperty("--sidebar-primary", option.hsl);
  root.style.setProperty("--sidebar-primary-foreground", option.foregroundHsl);
  root.style.setProperty("--sidebar-ring", option.hsl);
  root.style.setProperty("--chart-1", option.hsl);
  // RGB triplet for inline-style rgba() uses in JS files.
  root.style.setProperty("--accent-rgb", option.rgb);
}

export function AccentProvider({ children }: { children: ReactNode }) {
  const [id, setId] = useState<string>(readInitialId);
  const accent = ACCENT_OPTIONS.find((o) => o.id === id) ?? ACCENT_OPTIONS[0];

  useEffect(() => {
    applyAccent(accent);
    try {
      window.localStorage.setItem(STORAGE_KEY, accent.id);
    } catch {
      // ignore — private mode / quota
    }
  }, [accent]);

  return (
    <AccentContext.Provider value={{ accent, setAccentId: setId, options: ACCENT_OPTIONS }}>
      {children}
    </AccentContext.Provider>
  );
}

export function useAccent(): AccentContextValue {
  const ctx = useContext(AccentContext);
  if (!ctx) throw new Error("useAccent must be used inside AccentProvider");
  return ctx;
}
