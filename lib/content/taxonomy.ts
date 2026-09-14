import type { Locale } from "@/lib/i18n";
import { getProjects } from "./projects";
import { categories, type Category } from "./schema";

export type Facet<T extends string> = {
  value: T;
  /** Πόσα project φέρουν αυτή την τιμή — δείχνεται δίπλα στο φίλτρο. */
  count: number;
};

/**
 * Κατηγορίες που **έχουν** project, με τη σειρά που ορίζει το schema.
 *
 * Παράγονται από τα δεδομένα, όχι από χειροκίνητη λίστα (D6): μια κατηγορία που
 * δεν έχει περιεχόμενο δεν εμφανίζεται ποτέ ως άδειο φίλτρο.
 */
export async function getCategoryFacets(
  locale: Locale,
): Promise<Facet<Category>[]> {
  const projects = await getProjects(locale);
  const counts = new Map<Category, number>();

  for (const project of projects) {
    for (const category of project.categories) {
      counts.set(category, (counts.get(category) ?? 0) + 1);
    }
  }

  return categories
    .filter((category) => counts.has(category))
    .map((category) => ({ value: category, count: counts.get(category)! }));
}

/**
 * Οι τεχνολογίες όλων των project — ο δεύτερος, ανεξάρτητος άξονας φιλτραρίσματος.
 * Σειρά: πρώτα οι συχνότερες, μετά αλφαβητικά για σταθερό αποτέλεσμα.
 */
export async function getStackFacets(
  locale: Locale,
): Promise<Facet<string>[]> {
  const projects = await getProjects(locale);
  const counts = new Map<string, number>();

  for (const project of projects) {
    for (const tech of project.stack) {
      counts.set(tech, (counts.get(tech) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
}
