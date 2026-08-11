import React from "react";

export const FONT_SIZES = [
  { value: "xs", label: "Small", hint: "85%" },
  { value: "sm", label: "Compact", hint: "90%" },
  { value: "md", label: "Default", hint: "100%" },
  { value: "lg", label: "Large", hint: "110%" },
] as const;

export type FontSize = (typeof FONT_SIZES)[number]["value"];

const STORAGE_KEY = "app-font-size";
const DEFAULT: FontSize = "md";

const isValid = (v: unknown): v is FontSize => FONT_SIZES.some((f) => f.value === v);

export function useFontSize() {
  const [fontSize, setState] = React.useState<FontSize>(DEFAULT);

  // read what the inline script already applied — avoids hydration mismatch
  React.useEffect(() => {
    const current = document.documentElement.dataset.fontSize;
    if (isValid(current)) setState(current);
  }, []);

  const setFontSize = React.useCallback((v: FontSize) => {
    setState(v);
    document.documentElement.dataset.fontSize = v;
    try {
      localStorage.setItem(STORAGE_KEY, v);
    } catch {}
  }, []);

  return { fontSize, setFontSize };
}
