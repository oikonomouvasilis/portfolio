import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getMessages, isLocale } from "@/lib/i18n";
import { alternatesFor, openGraphFor } from "@/lib/site";
import { getProjects } from "@/lib/content/projects";
import { getCategoryFacets, getStackFacets } from "@/lib/content/taxonomy";
import { ProjectExplorer } from "@/components/project-explorer";
import { Container } from "@/components/container";
import type { ProjectCard } from "@/lib/content/filter";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getMessages(locale);
  return {
    title: t.projects.title,
    description: t.projects.intro,
    alternates: alternatesFor(locale, "/projects"),
    openGraph: openGraphFor(locale, {
      title: t.projects.title,
      description: t.projects.intro,
      path: "/projects",
    }),
  };
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const t = await getMessages(locale);
  const [projects, categoryFacets, stackFacets] = await Promise.all([
    getProjects(locale),
    getCategoryFacets(locale),
    getStackFacets(locale),
  ]);

  /*
   * Στο client περνάει μόνο ό,τι χρειάζεται η κάρτα — **όχι** το σώμα MDX.
   * Αλλιώς κάθε case study θα ταξίδευε ολόκληρο στο payload της λίστας.
   */
  const cards: ProjectCard[] = projects.map((p) => ({
    slug: p.slug,
    title: p.title,
    summary: p.summary,
    year: p.year,
    status: p.status,
    categories: p.categories,
    categoryLabels: p.categories.map((c) => t.categories[c]),
    stack: p.stack,
    role: p.role,
    cover: p.cover,
    images: [
      { src: p.cover },
      ...p.gallery.map((g) => ({ src: g.src, caption: g.caption })),
    ],
  }));

  return (
    <Container className="space-y-16 py-16 sm:py-24">
      <header data-reveal className="max-w-2xl space-y-4">
        <h1 className="text-5xl sm:text-6xl">{t.projects.title}</h1>
        <p className="text-lg text-[var(--muted)]">{t.projects.intro}</p>
      </header>

      {/*
        Το `useSearchParams` απαιτεί Suspense boundary σε στατικά παραγόμενη
        σελίδα: το κέλυφος προ-αποδίδεται και τα φίλτρα ενυδατώνονται μετά.
      */}
      <Suspense
        fallback={<p className="text-[var(--muted)]">{t.projects.loading}</p>}
      >
        <ProjectExplorer
          projects={cards}
          locale={locale}
          categoryOptions={categoryFacets.map(({ value, count }) => ({
            value,
            label: t.categories[value],
            count,
          }))}
          stackOptions={stackFacets.map(({ value, count }) => ({
            value,
            label: value,
            count,
          }))}
          labels={{
            categories: t.projects.categoriesLabel,
            stack: t.projects.stackLabel,
            search: t.projects.search,
            searchPlaceholder: t.projects.searchPlaceholder,
            clear: t.projects.clear,
            results: t.projects.results,
            empty: t.projects.noMatches,
            status: t.status,
          }}
        />
      </Suspense>
    </Container>
  );
}
