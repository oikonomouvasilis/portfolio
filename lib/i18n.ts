export const locales = ["en", "el"] as const;

export type Locale = (typeof locales)[number];

/** Η γλώσσα στην οποία προσγειώνεται όποιος έρθει χωρίς prefix (D4). */
export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  el: "Ελληνικά",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * Αντιστοιχεί το locale σε ετικέτα `lang` του HTML. Κρατιέται ξεχωριστά από το
 * slug γιατί τα δύο αποκλίνουν μόλις προστεθεί παραλλαγή (π.χ. `en-GB`).
 */
export const htmlLang: Record<Locale, string> = {
  en: "en",
  el: "el",
};

type Messages = typeof import("@/messages/en.json");

const dictionaries: Record<Locale, () => Promise<Messages>> = {
  en: () => import("@/messages/en.json").then((m) => m.default),
  el: () => import("@/messages/el.json").then((m) => m.default),
};

export async function getMessages(locale: Locale): Promise<Messages> {
  return dictionaries[locale]();
}

/**
 * Αντικαθιστά το locale σε ένα υπάρχον path, κρατώντας τον χρήστη στην ίδια
 * σελίδα όταν αλλάζει γλώσσα — `/el/projects/foo` → `/en/projects/foo`.
 */
export function switchLocalePath(pathname: string, next: Locale): string {
  const segments = pathname.split("/");
  // segments[0] είναι πάντα κενό επειδή το path ξεκινά με "/"
  if (segments.length > 1 && isLocale(segments[1])) {
    segments[1] = next;
    return segments.join("/");
  }
  return `/${next}${pathname}`;
}
