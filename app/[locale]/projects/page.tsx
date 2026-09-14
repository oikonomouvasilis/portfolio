import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMessages, isLocale } from "@/lib/i18n";
import { getProjects } from "@/lib/content/projects";
import { getCategoryFacets, getStackFacets } from "@/lib/content/taxonomy";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getMessages(locale);
  return { title: t.projects.title, description: t.projects.intro };
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

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-medium tracking-tight">
          {t.projects.title}
        </h1>
        <p className="text-[var(--muted)]">{t.projects.intro}</p>
      </header>

      {/*
        Φάση 2: οι όψεις παράγονται από τα δεδομένα και εμφανίζονται ως απόδειξη
        ότι το pipeline δουλεύει. Γίνονται πραγματικά, συνδυαστικά φίλτρα με
        κατάσταση στο URL στη Φάση 5.
      */}
      {categoryFacets.length > 0 && (
        <section className="space-y-4 text-sm">
          <div>
            <h2 className="mb-2 text-[var(--muted)]">
              {t.projects.categoriesLabel}
            </h2>
            <ul className="flex flex-wrap gap-2">
              {categoryFacets.map(({ value, count }) => (
                <li
                  key={value}
                  className="rounded-md border border-[var(--border)] px-2.5 py-1"
                >
                  {t.categories[value]}{" "}
                  <span className="text-[var(--muted)]">{count}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-2 text-[var(--muted)]">
              {t.projects.stackLabel}
            </h2>
            <ul className="flex flex-wrap gap-2">
              {stackFacets.map(({ value, count }) => (
                <li
                  key={value}
                  className="rounded-md border border-[var(--border)] px-2.5 py-1"
                >
                  {value} <span className="text-[var(--muted)]">{count}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {projects.length === 0 ? (
        <p className="text-[var(--muted)]">{t.projects.empty}</p>
      ) : (
        <ul className="space-y-4">
          {projects.map((project) => (
            <li key={project.slug}>
              <Link
                href={`/${locale}/projects/${project.slug}`}
                className="block rounded-xl border border-[var(--border)] px-5 py-4 transition-colors hover:border-[var(--muted)]"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="font-medium">{project.title}</h3>
                  <span className="text-sm text-[var(--muted)]">
                    {project.year} · {t.status[project.status]}
                  </span>
                </div>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {project.summary}
                </p>
                <p className="mt-3 text-xs text-[var(--muted)]">
                  {project.stack.join(" · ")}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
