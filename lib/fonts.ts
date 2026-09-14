import { Inter, Source_Serif_4 } from "next/font/google";

/**
 * Επικεφαλίδες. Το `greek` subset είναι ο λόγος που επιλέχθηκε αυτή και όχι μια
 * από τις συνήθεις editorial serif — Instrument Serif, Fraunces και Playfair δεν
 * έχουν ελληνικούς χαρακτήρες, οπότε η μισή σελίδα θα έπεφτε σε fallback (D14).
 */
export const serif = Source_Serif_4({
  subsets: ["latin", "greek"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400", "600"],
  style: ["normal", "italic"],
});

/** Σώμα κειμένου και UI. Έχει κι αυτή πλήρη ελληνική κάλυψη. */
export const sans = Inter({
  subsets: ["latin", "greek"],
  variable: "--font-sans",
  display: "swap",
});
