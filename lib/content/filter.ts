import type { Category } from "./schema";

/** Ό,τι χρειάζεται μια κάρτα για να εμφανιστεί και να φιλτραριστεί. */
export type ProjectCard = {
  slug: string;
  title: string;
  summary: string;
  year: number;
  status: string;
  categories: Category[];
  /**
   * Οι **μεταφρασμένες** ετικέτες των κατηγοριών. Χρειάζονται ξεχωριστά από τα
   * slugs επειδή ο επισκέπτης πληκτρολογεί αυτό που βλέπει: γράφει
   * «αυτοματισμοί», όχι «automation».
   */
  categoryLabels: string[];
  stack: string[];
  role: string;
  cover: string;
  /**
   * Όλες οι εικόνες του project — εξώφυλλο πρώτο. Η κάρτα τις εναλλάσσει με
   * κλικ, οπότε χρειάζεται τη λίστα και όχι μόνο την πρώτη.
   */
  images: { src: string; caption?: string }[];
};

export type Filters = {
  categories: string[];
  stack: string[];
  query: string;
};

export const EMPTY_FILTERS: Filters = {
  categories: [],
  stack: [],
  query: "",
};

/**
 * Κανονικοποίηση για σύγκριση κειμένου.
 *
 * Τα ελληνικά το χρειάζονται περισσότερο από τα αγγλικά: χωρίς αφαίρεση τόνων,
 * η αναζήτηση «αυτοματισμος» δεν βρίσκει το «αυτοματισμός», και ο χρήστης
 * συμπεραίνει ότι η αναζήτηση είναι χαλασμένη. Το τελικό σίγμα ισοπεδώνεται
 * για τον ίδιο λόγο.
 */
export function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/ς/g, "σ")
    .toLocaleLowerCase("el");
}

/**
 * Συνδυαστικό φιλτράρισμα: **ΚΑΙ** μεταξύ αξόνων, **Ή** μέσα σε κάθε άξονα.
 *
 * Δηλαδή «automation ή data» **και** «Python» — που είναι αυτό που περιμένει
 * κανείς όταν τσεκάρει δύο κουτάκια στην ίδια ομάδα και ένα σε άλλη.
 */
export function filterProjects(
  projects: ProjectCard[],
  filters: Filters,
): ProjectCard[] {
  const query = normalize(filters.query.trim());
  const terms = query ? query.split(/\s+/) : [];

  return projects.filter((project) => {
    if (
      filters.categories.length > 0 &&
      !project.categories.some((c) => filters.categories.includes(c))
    ) {
      return false;
    }

    if (
      filters.stack.length > 0 &&
      !project.stack.some((tech) => filters.stack.includes(tech))
    ) {
      return false;
    }

    if (terms.length === 0) return true;

    const haystack = normalize(
      [
        project.title,
        project.summary,
        project.role,
        project.stack.join(" "),
        project.categories.join(" "),
        project.categoryLabels.join(" "),
        String(project.year),
      ].join(" "),
    );

    // Κάθε λέξη πρέπει να βρεθεί — έτσι το «python etl» στενεύει το αποτέλεσμα
    // αντί να το πλαταίνει.
    return terms.every((term) => haystack.includes(term));
  });
}

/** Διαβάζει τα φίλτρα από το query string. Άγνωστες παράμετροι αγνοούνται. */
export function filtersFromParams(params: URLSearchParams): Filters {
  return {
    categories: params.getAll("cat"),
    stack: params.getAll("tech"),
    query: params.get("q") ?? "",
  };
}

/**
 * Γράφει τα φίλτρα σε query string. Οι κενές τιμές παραλείπονται ώστε ένα
 * καθαρό φίλτρο να δίνει καθαρό URL και όχι `?cat=&tech=&q=`.
 */
export function paramsFromFilters(filters: Filters): URLSearchParams {
  const params = new URLSearchParams();
  for (const category of filters.categories) params.append("cat", category);
  for (const tech of filters.stack) params.append("tech", tech);
  if (filters.query.trim()) params.set("q", filters.query.trim());
  return params;
}

export function isEmpty(filters: Filters): boolean {
  return (
    filters.categories.length === 0 &&
    filters.stack.length === 0 &&
    filters.query.trim() === ""
  );
}

/** Προσθέτει ή αφαιρεί μια τιμή — η κίνηση ενός checkbox. */
export function toggle(values: string[], value: string): string[] {
  return values.includes(value)
    ? values.filter((v) => v !== value)
    : [...values, value];
}
