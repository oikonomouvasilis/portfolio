import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { getProjectSlugs } from "@/lib/content/projects";
import { alternatesFor, siteUrl } from "@/lib/site";

/**
 * Κάθε σελίδα μπαίνει μία φορά ανά γλώσσα, με τις εναλλακτικές δηλωμένες πάνω
 * της. Έτσι η Google βλέπει δύο εκδοχές του ίδιου περιεχομένου και όχι δύο
 * ανεξάρτητες σελίδες που μοιάζουν ύποπτα μεταξύ τους.
 *
 * Η προτεραιότητα δεν είναι διακόσμηση: τα project είναι ο λόγος που υπάρχει το
 * site, γι' αυτό κάθονται ψηλότερα από το contact.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getProjectSlugs();

  const routes: { path: string; priority: number }[] = [
    { path: "", priority: 1 },
    { path: "/projects", priority: 0.9 },
    ...slugs.map((slug) => ({ path: `/projects/${slug}`, priority: 0.8 })),
    { path: "/about", priority: 0.7 },
    { path: "/cv", priority: 0.7 },
    { path: "/contact", priority: 0.5 },
  ];

  const lastModified = new Date();

  return routes.flatMap(({ path, priority }) =>
    locales.map((locale) => ({
      url: `${siteUrl}/${locale}${path}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority,
      alternates: { languages: alternatesFor(locale, path).languages },
    })),
  );
}
