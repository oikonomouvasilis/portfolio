import type { Locale } from "@/lib/i18n";

const MONTHS: Record<Locale, string[]> = {
  en: [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ],
  el: [
    "Ιαν", "Φεβ", "Μάρ", "Απρ", "Μάι", "Ιούν",
    "Ιούλ", "Αύγ", "Σεπ", "Οκτ", "Νοέ", "Δεκ",
  ],
};

/**
 * Μορφοποιεί `YYYY-MM` σε «Οκτ 2022».
 *
 * Γράφτηκε με τα χέρια αντί για `Intl.DateTimeFormat` επειδή η δεύτερη δίνει
 * γενική πτώση στα ελληνικά («Οκτωβρίου»), που είναι λάθος όταν ο μήνας στέκεται
 * μόνος του σε μια περίοδο.
 */
export function formatMonth(value: string, locale: Locale): string {
  const [year, month] = value.split("-");
  const index = Number(month) - 1;
  const name = MONTHS[locale][index];
  return name ? `${name} ${year}` : year;
}

/** «Οκτ 2022 – Μάι 2024», ή «Ιούν 2024 – σήμερα» όταν το `to` είναι `null`. */
export function formatPeriod(
  from: string,
  to: string | null,
  locale: Locale,
  present: string,
): string {
  return `${formatMonth(from, locale)} – ${to ? formatMonth(to, locale) : present}`;
}
