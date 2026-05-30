import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Theme = "light" | "dark";
// "content" is the finalized site variant. The legacy values are preserved in
// the type so any lingering callers still compile, but the provider always
// returns "content".
export type FontTheme = "default" | "editorial" | "content";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggle: () => void;
  fontTheme: FontTheme;
  setFontTheme: (next: FontTheme) => void;
}

const STORAGE_KEY = "ptta-theme";

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readInitial(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return "dark";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readInitial);
  const fontTheme: FontTheme = "content";

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // ignore (private mode / quota)
    }
  }, [theme]);

  useEffect(() => {
    // Make sure no stale editorial font class lingers from a prior session.
    document.documentElement.classList.remove("font-editorial");
  }, []);

  const setTheme = (next: Theme) => setThemeState(next);
  const toggle = () => setThemeState((prev) => (prev === "light" ? "dark" : "light"));
  const setFontTheme = (_next: FontTheme) => {
    // No-op: site variant is locked to "content".
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle, fontTheme, setFontTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
