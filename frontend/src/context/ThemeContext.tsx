"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getAccentShades } from "@/lib/utils";

interface ThemeContextType {
  accentColor: string;
  setAccentColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  accentColor: "#6366f1",
  setAccentColor: () => {},
});

export function ThemeProvider({
  children,
  initialColor = "#6366f1",
}: {
  children: ReactNode;
  initialColor?: string;
}) {
  const [accentColor, setAccentColor] = useState(initialColor);

  useEffect(() => {
    const root = document.documentElement;
    const shades = getAccentShades(accentColor);
    root.style.setProperty("--accent", accentColor);
    root.style.setProperty("--accent-light", shades.light);
    root.style.setProperty("--accent-dark", shades.dark);
  }, [accentColor]);

  return (
    <ThemeContext.Provider value={{ accentColor, setAccentColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
