import { readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";

/**
 * Οι γραμματοσειρές των OG καρτών, σε WOFF μέσα στο repo.
 *
 * Δεν έρχονται από το `next/font`: εκείνο κατεβάζει WOFF2, που το satori —
 * η μηχανή πίσω από το `ImageResponse` — δεν διαβάζει. Και δεν κατεβαίνουν από
 * το δίκτυο στο build, γιατί ένα build δεν έχει λόγο να εξαρτάται από τη
 * διαθεσιμότητα του fonts.gstatic.com.
 *
 * Είναι το **greek subset**: χωρίς αυτό οι ελληνικοί τίτλοι των project θα
 * έβγαιναν κουτάκια στο preview του LinkedIn.
 */
export const ogFonts = cache(async () => {
  const dir = path.join(process.cwd(), "assets", "fonts");
  const [serif, sans] = await Promise.all([
    readFile(path.join(dir, "serif600.woff")),
    readFile(path.join(dir, "sans400.woff")),
  ]);

  return [
    { name: "Source Serif 4", data: serif, weight: 600 as const, style: "normal" as const },
    { name: "Inter", data: sans, weight: 400 as const, style: "normal" as const },
  ];
});

/** 1200×630 — το μέγεθος που περιμένουν Facebook, LinkedIn, Slack και X. */
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

/**
 * Τα χρώματα του σκούρου θέματος, αντιγραμμένα από το `globals.css`. Το satori
 * δεν διαβάζει CSS μεταβλητές, οπότε εδώ γράφονται κυριολεκτικά.
 */
export const ogTheme = {
  bg: "#100f0e",
  fg: "#f2efe9",
  muted: "#a5a29a",
  faint: "#8a867c",
  accent: "#d79268",
};
