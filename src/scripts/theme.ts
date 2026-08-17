// Theme persistence logic — task 004 (core functionality/logic).
//
// Contract (shared with src/components/ThemeInit.astro and the design tokens
// owned by task 002 — do not change these names/values without updating both):
//   - localStorage key:  "theme"
//   - stored values:     "light" | "dark"
//   - DOM attribute:     <html data-theme="light" | "dark">
//   - ATTRIBUTE ABSENT means "no explicit visitor choice — follow the OS via
//     the `@media (prefers-color-scheme: dark)` CSS block" (epic.md §7.6).
//
// This module is a *bundled* script (imported normally, not `is:inline`), so
// it is fine for it to run after the DOM is parsed — it is only responsible
// for the toggle button's interactivity, not for preventing the flash of the
// wrong theme on load. That pre-paint job is done by a separate, minimal,
// hand-written `is:inline` script in ThemeInit.astro that intentionally
// duplicates the tiny read-and-apply logic below (a `type="module"` script,
// including this one, is deferred by the browser and would run too late to
// prevent a flash — see epic.md §7.6 step 6).

export const THEME_STORAGE_KEY = "theme";

export type Theme = "light" | "dark";

/** The OS/browser-level preference, ignoring any stored visitor choice. */
export function getSystemTheme(): Theme {
  if (typeof window === "undefined" || !window.matchMedia) return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/** The visitor's explicit stored choice, or `null` if they haven't made one. */
export function getStoredTheme(): Theme | null {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    // localStorage unavailable (private browsing, disabled storage, etc.)
    return null;
  }
}

/** What theme is actually in effect right now: stored choice, else system. */
export function getEffectiveTheme(): Theme {
  return getStoredTheme() ?? getSystemTheme();
}

/**
 * Reflects a theme onto the document. Passing `null` removes the attribute
 * entirely so the CSS `prefers-color-scheme` block takes back over — used
 * only if a "reset to system" affordance is ever added; the toggle itself
 * always passes an explicit value.
 */
export function applyTheme(theme: Theme | null): void {
  const root = document.documentElement;
  if (theme) {
    root.setAttribute("data-theme", theme);
  } else {
    root.removeAttribute("data-theme");
  }
}

/** Persists an explicit choice and applies it immediately. */
export function setTheme(theme: Theme): void {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage may be unavailable — still apply for the current page view.
  }
  applyTheme(theme);
}

/** Flips between light and dark, overriding the system preference in both
 * directions (epic.md criterion 38), and returns the theme now in effect. */
export function toggleTheme(): Theme {
  const next: Theme = getEffectiveTheme() === "dark" ? "light" : "dark";
  setTheme(next);
  return next;
}

/**
 * Wires up an already-rendered toggle `<button>`: syncs its `aria-pressed`
 * state to whether dark mode is currently active, and flips the theme (and
 * re-syncs) on click. Safe to call multiple times on the same button.
 */
export function initThemeToggle(button: HTMLButtonElement): void {
  const sync = () => {
    const isDark = getEffectiveTheme() === "dark";
    button.setAttribute("aria-pressed", String(isDark));
  };

  sync();
  button.addEventListener("click", () => {
    toggleTheme();
    sync();
  });
}
