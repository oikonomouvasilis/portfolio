"use client";

import { useSyncExternalStore } from "react";

type Theme = "system" | "light" | "dark";

const THEMES: Theme[] = ["system", "light", "dark"];
const STORAGE_KEY = "theme";

/**
 * Το script που τρέχει **πριν** το πρώτο βάψιμο. Χωρίς αυτό, όποιος έχει σκοτεινό
 * θέμα βλέπει μια λευκή αναλαμπή σε κάθε φόρτωση (D16).
 *
 * Μπαίνει στο <head> ως inline script· γι' αυτό είναι συμβολοσειρά και όχι κώδικας.
 */
export const themeInitScript = `
(function () {
  try {
    var t = localStorage.getItem("${STORAGE_KEY}");
    if (t === "light" || t === "dark") {
      document.documentElement.setAttribute("data-theme", t);
    }
  } catch (e) {}
})();
`;

/*
 * Το θέμα ζει στο localStorage, δηλαδή **έξω** από το React. Το διαβάζουμε με
 * useSyncExternalStore αντί για useState+useEffect: έτσι δεν υπάρχει render με
 * λάθος τιμή, ούτε setState μέσα σε effect, και η τιμή που διαβάζεται είναι
 * πάντα η τωρινή — ακόμη και σε δύο κλικ μέσα στο ίδιο tick.
 */
const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  // Αλλαγή από άλλη καρτέλα του ίδιου site.
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getSnapshot(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // Ιδιωτικό παράθυρο ή μπλοκαρισμένη αποθήκευση — μένουμε στο "system".
  }
  return "system";
}

/** Στον server δεν υπάρχει αποθήκευση· το markup βγαίνει πάντα ουδέτερο. */
function getServerSnapshot(): Theme {
  return "system";
}

function setTheme(next: Theme) {
  const root = document.documentElement;
  if (next === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", next);

  try {
    if (next === "system") localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Η επιλογή ισχύει για τη συνεδρία, απλώς δεν θυμάται.
  }

  for (const notify of listeners) notify();
}

const ICONS: Record<Theme, string> = {
  system: "◐",
  light: "☀",
  dark: "☾",
};

/**
 * Προχωράει έναν κρίκο στον κύκλο, διαβάζοντας την τρέχουσα τιμή **τη στιγμή του
 * κλικ** και όχι από το render στο οποίο δέθηκε ο handler. Δύο κλικ μέσα στο ίδιο
 * tick θα έβλεπαν αλλιώς και τα δύο την ίδια παλιά τιμή, και ο κύκλος θα κολλούσε.
 */
function advance() {
  const now = getSnapshot();
  setTheme(THEMES[(THEMES.indexOf(now) + 1) % THEMES.length]);
}

export function ThemeToggle({ label }: { label: string }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <button
      type="button"
      onClick={advance}
      title={label}
      aria-label={label}
      className="grid size-8 place-items-center rounded-full border border-[var(--line)] text-sm transition-colors hover:bg-[var(--surface)]"
    >
      <span aria-hidden="true">{ICONS[theme]}</span>
    </button>
  );
}
