import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { applyTheme, resolveTheme, type Theme } from "@/lib/theme";
import { Button } from "./button";

const STORAGE_KEY = "portfolio-theme";

function readInitialTheme(): Theme {
  const current = document.documentElement.dataset.theme;
  if (current === "light" || current === "dark") return current;

  let stored: string | null = null;
  try {
    stored = localStorage.getItem(STORAGE_KEY);
  } catch {
    // Storage can be unavailable in privacy modes; system preference still works.
  }
  return resolveTheme(
    stored,
    window.matchMedia("(prefers-color-scheme: dark)").matches,
  );
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    setTheme(readInitialTheme());
  }, []);

  const nextTheme: Theme = theme === "light" ? "dark" : "light";
  const nextLabel = nextTheme === "dark" ? "Dark" : "Light";

  function toggleTheme(): void {
    applyTheme(nextTheme);
    setTheme(nextTheme);
    try {
      localStorage.setItem(STORAGE_KEY, nextTheme);
    } catch {
      // The visual preference still applies for the current page.
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      aria-label={`Switch to ${nextLabel.toLowerCase()} theme`}
      data-theme-toggle
    >
      {nextTheme === "dark" ? (
        <Moon aria-hidden="true" />
      ) : (
        <Sun aria-hidden="true" />
      )}
      <span>{nextLabel}</span>
    </Button>
  );
}
