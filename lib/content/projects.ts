import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";
import { defaultLocale, isLocale, locales, type Locale } from "@/lib/i18n";
import {
  flattenStack,
  projectFrontmatterSchema,
  type ProjectFrontmatter,
} from "./schema";

const CONTENT_DIR = path.join(process.cwd(), "content", "projects");

/** Όνομα αρχείου: `<slug>.<locale>.mdx` — π.χ. `ai-trader.el.mdx`. */
const FILENAME = /^(?<slug>[a-z0-9-]+)\.(?<locale>[a-z]{2})\.mdx$/;

export type Project = ProjectFrontmatter & {
  /** Επίπεδη λίστα τεχνολογιών, παραγόμενη από τα `stackLayers` — για τα φίλτρα. */
  stack: string[];
  /** Το σώμα MDX, χωρίς το frontmatter. */
  body: string;
  /** Η γλώσσα του κειμένου που πράγματι επιστράφηκε. */
  locale: Locale;
  /**
   * `true` όταν ζητήθηκε γλώσσα που δεν υπάρχει και σερβίρεται η προεπιλεγμένη.
   * Η σελίδα το δείχνει διακριτικά αντί να προσποιείται ότι μετέφρασε (D4).
   */
  isFallback: boolean;
};

type Entry = { frontmatter: ProjectFrontmatter; body: string };

/**
 * Διαβάζει και επικυρώνει ολόκληρο τον φάκελο μία φορά. Οτιδήποτε δεν περνά το
 * schema ρίχνει σφάλμα εδώ — δηλαδή στο build, όχι στα μάτια του επισκέπτη (D6).
 */
const loadAll = cache(async (): Promise<Map<string, Map<Locale, Entry>>> => {
  let filenames: string[];
  try {
    filenames = await readdir(CONTENT_DIR);
  } catch {
    // Ο φάκελος μπορεί να μην υπάρχει ακόμη — κενή βιτρίνα, όχι σφάλμα.
    return new Map();
  }

  const index = new Map<string, Map<Locale, Entry>>();

  for (const filename of filenames.sort()) {
    if (!filename.endsWith(".mdx")) continue;

    const groups = FILENAME.exec(filename)?.groups;
    if (!groups) {
      throw new Error(
        `[content] Μη αναγνωρίσιμο όνομα αρχείου: ${filename}\n` +
          `Αναμένεται <slug>.<locale>.mdx, π.χ. ai-trader.en.mdx`,
      );
    }

    const { slug, locale } = groups;
    if (!isLocale(locale)) {
      throw new Error(
        `[content] ${filename}: άγνωστη γλώσσα "${locale}". ` +
          `Επιτρεπτές: ${locales.join(", ")}`,
      );
    }

    const raw = await readFile(path.join(CONTENT_DIR, filename), "utf8");
    const { data, content } = matter(raw);

    const parsed = projectFrontmatterSchema.safeParse(data);
    if (!parsed.success) {
      const issues = parsed.error.issues
        .map((i) => `  · ${i.path.join(".") || "(ρίζα)"}: ${i.message}`)
        .join("\n");
      throw new Error(`[content] Άκυρο frontmatter στο ${filename}:\n${issues}`);
    }

    // Το slug του αρχείου είναι η αυθεντία· το frontmatter πρέπει να συμφωνεί,
    // αλλιώς οι δύο γλώσσες του ίδιου project αποκλίνουν χωρίς να το πάρει κανείς είδηση.
    if (parsed.data.slug !== slug) {
      throw new Error(
        `[content] ${filename}: το slug του frontmatter ("${parsed.data.slug}") ` +
          `δεν ταιριάζει με το όνομα αρχείου ("${slug}")`,
      );
    }

    const byLocale = index.get(slug) ?? new Map<Locale, Entry>();
    byLocale.set(locale, { frontmatter: parsed.data, body: content });
    index.set(slug, byLocale);
  }

  // Κάθε project πρέπει να υπάρχει τουλάχιστον στην προεπιλεγμένη γλώσσα,
  // αλλιώς το fallback δεν έχει πού να πέσει.
  for (const [slug, byLocale] of index) {
    if (!byLocale.has(defaultLocale)) {
      throw new Error(
        `[content] Το project "${slug}" δεν έχει έκδοση στην προεπιλεγμένη ` +
          `γλώσσα (${slug}.${defaultLocale}.mdx)`,
      );
    }
  }

  return index;
});

function resolve(
  byLocale: Map<Locale, Entry>,
  locale: Locale,
): Project | null {
  const exact = byLocale.get(locale);
  if (exact) {
    return {
      ...exact.frontmatter,
      stack: flattenStack(exact.frontmatter.stackLayers),
      body: exact.body,
      locale,
      isFallback: false,
    };
  }

  const fallback = byLocale.get(defaultLocale);
  if (!fallback) return null;

  return {
    ...fallback.frontmatter,
    stack: flattenStack(fallback.frontmatter.stackLayers),
    body: fallback.body,
    locale: defaultLocale,
    isFallback: true,
  };
}

/** Όλα τα project, νεότερα πρώτα. */
export async function getProjects(locale: Locale): Promise<Project[]> {
  const index = await loadAll();

  return [...index.values()]
    .map((byLocale) => resolve(byLocale, locale))
    .filter((p): p is Project => p !== null)
    .sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));
}

export async function getProject(
  slug: string,
  locale: Locale,
): Promise<Project | null> {
  const index = await loadAll();
  const byLocale = index.get(slug);
  return byLocale ? resolve(byLocale, locale) : null;
}

/** Τα slugs για το `generateStaticParams` των σελίδων project. */
export async function getProjectSlugs(): Promise<string[]> {
  return [...(await loadAll()).keys()];
}

export type Neighbours = {
  previous: Pick<Project, "slug" | "title"> | null;
  next: Pick<Project, "slug" | "title"> | null;
};

/**
 * Τα γειτονικά project στη σειρά της λίστας, για την πλοήγηση στο τέλος κάθε
 * case study. Η λίστα **δεν** κυκλώνει: στο πρώτο δεν υπάρχει προηγούμενο και
 * στο τελευταίο δεν υπάρχει επόμενο, ώστε ο επισκέπτης να ξέρει πού βρίσκεται.
 */
export async function getNeighbours(
  slug: string,
  locale: Locale,
): Promise<Neighbours> {
  const all = await getProjects(locale);
  const index = all.findIndex((p) => p.slug === slug);
  if (index === -1) return { previous: null, next: null };

  const pick = (p: Project | undefined) =>
    p ? { slug: p.slug, title: p.title } : null;

  return {
    previous: pick(all[index - 1]),
    next: pick(all[index + 1]),
  };
}
