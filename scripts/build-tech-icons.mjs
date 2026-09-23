/**
 * Παράγει το `lib/tech-icons.brand.ts` από το πακέτο `simple-icons`.
 *
 * Τα σήματα των τεχνολογιών **δεν** γίνονται runtime dependency: το πακέτο μένει
 * devDependency, τα μονοπάτια που πραγματικά χρησιμοποιούνται αντιγράφονται μία
 * φορά εδώ, και το site σερβίρει inline SVG χωρίς κανένα αίτημα δικτύου.
 *
 * Τρέξε ξανά με `node scripts/build-tech-icons.mjs` όταν προστεθεί τεχνολογία.
 *
 * Τα εικονίδια της Simple Icons είναι CC0 1.0 (public domain)· τα ίδια τα σήματα
 * παραμένουν εμπορικά σήματα των κατόχων τους και μπαίνουν μόνο ως αναφορά.
 */
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/*
 * Διαδρομή αρχείων και όχι `require.resolve`: το πακέτο δεν εκθέτει το
 * `package.json` στα exports του, οπότε η ανάλυση μέσω module resolver σκάει.
 */
const pkg = join(root, "node_modules/simple-icons");
const version = JSON.parse(
  await readFile(join(pkg, "package.json"), "utf8"),
).version;

/**
 * Μόνο ό,τι εμφανίζεται πράγματι στο site — όχι και τα 3.461 του πακέτου.
 * Οι δεξιότητες, συν το σήμα του GitHub για την κεφαλίδα. Το LinkedIn **δεν**
 * υπάρχει στο πακέτο (αφαιρέθηκε για λόγους εμπορικού σήματος) — σχεδιάζεται ως
 * γραμμικό «in» στο `components/social-links.tsx`.
 */
const SLUGS = [
  "python",
  "typescript",
  "openjdk",
  "pandas",
  "numpy",
  "scikitlearn",
  "scipy",
  "plotly",
  "nextdotjs",
  "react",
  "tailwindcss",
  "html5",
  "css",
  "n8n",
  "githubactions",
  "github",
];

const meta = new Map(
  JSON.parse(await readFile(join(pkg, "data/simple-icons.json"), "utf8")).map(
    (icon) => [icon.slug, icon],
  ),
);

const entries = [];
for (const slug of SLUGS) {
  const svg = await readFile(join(pkg, `icons/${slug}.svg`), "utf8");
  const d = svg.match(/ d="([^"]+)"/)?.[1];
  if (!d) throw new Error(`Δεν βρέθηκε path στο ${slug}.svg`);
  const title = meta.get(slug)?.title;
  if (!title) throw new Error(`Δεν βρέθηκε τίτλος για το ${slug}`);
  entries.push({ slug, d, title });
}

const body = entries
  .map(({ slug, d, title }) => `  /** ${title} */\n  ${slug}:\n    "${d}",`)
  .join("\n");

const file = `/**
 * ΠΑΡΑΓΟΜΕΝΟ ΑΡΧΕΙΟ — μην το πειράξεις στο χέρι.
 * Πηγή: simple-icons ${version} (CC0 1.0).
 * Ξαναφτιάξ' το με: node scripts/build-tech-icons.mjs
 */

/**
 * Μονοπάτι σε πλέγμα 24×24, γεμισμένο με currentColor.
 *
 * Τα σήματα μένουν **μονόχρωμα**: τα επίσημα χρώματα θα έσπαγαν και τη σχεδιαστική
 * γραμμή («ελάχιστο χρώμα στο chrome») και την αναγνωσιμότητα — το μαύρο του
 * Next.js εξαφανίζεται στο σκοτεινό θέμα, το κυανό του React στο ανοιχτό.
 */
export type BrandIcon = string;

export const brandIcons = {
${body}
} as const satisfies Record<string, BrandIcon>;

export type BrandSlug = keyof typeof brandIcons;
`;

await writeFile(join(root, "lib/tech-icons.brand.ts"), file, "utf8");
console.log(`Γράφτηκαν ${entries.length} εικονίδια στο lib/tech-icons.brand.ts`);
