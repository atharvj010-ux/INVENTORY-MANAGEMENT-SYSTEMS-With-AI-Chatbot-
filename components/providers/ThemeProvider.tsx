"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { applyTheme, type ThemeMode } from "@/lib/theme";

type ThemeContextValue = {
  darkMode: boolean;
  setDarkMode: (enabled: boolean) => void;
  theme: ThemeMode;
};

const ThemeContext = createContext<ThemeContextValue>({
  darkMode: true,
  setDarkMode: () => {},
  theme: "dark",
});

function readThemeFromDocument(): ThemeMode {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>(readThemeFromDocument);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  function setDarkMode(enabled: boolean) {
    setTheme(enabled ? "dark" : "light");
  }

  return (
    <ThemeContext.Provider value={{ darkMode: theme === "dark", setDarkMode, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
