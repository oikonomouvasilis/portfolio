import { brandIcons } from "./tech-icons.brand";

/**
 * Το εικονίδιο κάθε τεχνολογίας.
 *
 * Δύο είδη, γιατί δύο είναι και οι περιπτώσεις: όσες τεχνολογίες έχουν αναγνωρίσιμο
 * σήμα το κρατούν (`brand`, γεμισμένο μονοπάτι από τη Simple Icons)· όσες δεν έχουν
 * —SQL, Excel/VBA, «web scraping»— παίρνουν γραμμικό σύμβολο φτιαγμένο εδώ (`glyph`).
 *
 * Το εναλλακτικό θα ήταν ένα ψεύτικο «σήμα» με αρχικά μέσα σε τετράγωνο. Ένα σύμβολο
 * που λέει *τι κάνει* το εργαλείο διαβάζεται σε 16px· δύο γράμματα όχι.
 */
export type TechIcon =
  | { kind: "brand"; d: string }
  | { kind: "glyph"; d: string };

/**
 * Γραμμικά σύμβολα για ό,τι δεν έχει σήμα — ίδιο πλέγμα 24×24, χωρίς γέμισμα.
 * Σχεδιάστηκαν με το ίδιο οπτικό βάρος ώστε να μη «βαραίνουν» δίπλα στα σήματα.
 */
const glyphs = {
  /** Κύλινδρος βάσης δεδομένων. */
  database:
    "M4 6c0-1.66 3.58-3 8-3s8 1.34 8 3-3.58 3-8 3-8-1.34-8-3Z M4 6v12c0 1.66 3.58 3 8 3s8-1.34 8-3V6 M20 12c0 1.66-3.58 3-8 3s-8-1.34-8-3",
  /** Άξονες με πολυγωνική γραμμή — γράφημα. */
  lineChart: "M4 4v16h16 M7 15.5l4-5 3 3 5-7.5",
  /** Καμπύλη κατανομής πάνω από άξονα. */
  distribution: "M4 20h16 M4 20c3 0 3.2-12 8-12s5 12 8 12",
  /** Ράβδοι διαφορετικού ύψους. */
  barChart: "M4 20h16 M7.5 20v-5 M12 20v-9 M16.5 20v-3",
  /** Πίνακας ελέγχου: ένα μεγάλο πλαίσιο και δύο μικρά. */
  dashboard: "M3 4h8v7H3z M14 4h7v4h-7z M14 11h7v9h-7z M3 14h8v6H3z",
  /** Πλέγμα φύλλου εργασίας. */
  grid: "M3 5h18v14H3z M3 10h18 M3 15h18 M9.5 5v14 M15.5 5v14",
  /** Νέφος σημείων με γραμμή τάσης — παλινδρόμηση. */
  regression: "M4 4v16h16 M6.5 17.5L18.5 8 M8.5 16.5h.01 M12 13.5h.01 M15.5 10.5h.01",
  /** Άγκιστρα με σημείο στο κέντρο — περιορισμένη βελτιστοποίηση. */
  optimization:
    "M9.5 4h-1a2 2 0 0 0-2 2v3a2 2 0 0 1-2 2 2 2 0 0 1 2 2v3a2 2 0 0 0 2 2h1 M14.5 4h1a2 2 0 0 1 2 2v3a2 2 0 0 0 2 2 2 2 0 0 0-2 2v3a2 2 0 0 1-2 2h-1 M12 12h.01",
  /** Σελίδα με βέλος προς τα κάτω — άντληση περιεχομένου. */
  scrape:
    "M6 3h8l4 4v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z M14 3v4h4 M11 10.5v5.5 M8.8 14l2.2 2.4 2.2-2.4",
  /** Άγκιστρα κώδικα με κάθετο — τελικό σημείο API. */
  endpoint: "M9 8l-4 4 4 4 M15 8l4 4-4 4 M13.4 6.5l-2.8 11",
} as const satisfies Record<string, string>;

const brand = (d: string): TechIcon => ({ kind: "brand", d });
const glyph = (d: string): TechIcon => ({ kind: "glyph", d });

/**
 * Από το όνομα της δεξιότητας στο εικονίδιο. Τα κλειδιά είναι πεζά ώστε το
 * «Excel / VBA» του βιογραφικού να βρίσκεται χωρίς να χρειάζεται δεύτερο πεδίο
 * στα δεδομένα — το `content/cv.ts` παραμένει σκέτη λίστα ονομάτων.
 */
const byName: Record<string, TechIcon> = {
  python: brand(brandIcons.python),
  sql: glyph(glyphs.database),
  typescript: brand(brandIcons.typescript),
  java: brand(brandIcons.openjdk),
  pandas: brand(brandIcons.pandas),
  numpy: brand(brandIcons.numpy),
  "scikit-learn": brand(brandIcons.scikitlearn),
  scipy: brand(brandIcons.scipy),
  matplotlib: glyph(glyphs.lineChart),
  seaborn: glyph(glyphs.distribution),
  plotly: brand(brandIcons.plotly),
  "next.js": brand(brandIcons.nextdotjs),
  react: brand(brandIcons.react),
  "tailwind css": brand(brandIcons.tailwindcss),
  html5: brand(brandIcons.html5),
  css3: brand(brandIcons.css),
  "power bi": glyph(glyphs.barChart),
  tableau: glyph(glyphs.dashboard),
  "excel / vba": glyph(glyphs.grid),
  eviews: glyph(glyphs.regression),
  "gams / lingo": glyph(glyphs.optimization),
  n8n: brand(brandIcons.n8n),
  "github actions": brand(brandIcons.githubactions),
  "web scraping": glyph(glyphs.scrape),
  "rest apis": glyph(glyphs.endpoint),
};

/**
 * Επιστρέφει `null` όταν δεν υπάρχει εικονίδιο — και τότε το όνομα εμφανίζεται
 * μόνο του. Καμία νέα τεχνολογία στο βιογραφικό δεν χαλάει τη σελίδα επειδή
 * ξεχάστηκε ένα σύμβολο.
 */
export function techIcon(name: string): TechIcon | null {
  return byName[name.trim().toLowerCase()] ?? null;
}
