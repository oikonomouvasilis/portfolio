import type { Metadata } from "next";
import Image from "next/image";
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
    <div className="space-y-16">
      <header className="max-w-2xl space-y-4">
        <h1 className="text-5xl sm:text-6xl">{t.projects.title}</h1>
        <p className="text-lg text-[var(--muted)]">{t.projects.intro}</p>
      </header>

      {/*
        Φάση 3: οι όψεις παράγονται από τα δεδομένα και εμφανίζονται ως απόδειξη
        ότι το pipeline δουλεύει. Γίνονται πραγματικά, συνδυαστικά φίλτρα με
        κατάσταση στο URL στη Φάση 5.
      */}
      {categoryFacets.length > 0 && (
        <section className="grid gap-6 border-y border-[var(--line)] py-6 text-sm sm:grid-cols-[10rem_1fr]">
          <h2 className="font-mono text-xs tracking-widest text-[var(--faint)] uppercase">
            {t.projects.categoriesLabel}
          </h2>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {categoryFacets.map(({ value, count }) => (
              <li key={value}>
                {t.categories[value]}{" "}
                <span className="font-mono text-xs text-[var(--faint)]">
                  {count}
                </span>
              </li>
            ))}
          </ul>

          <h2 className="font-mono text-xs tracking-widest text-[var(--faint)] uppercase">
            {t.projects.stackLabel}
          </h2>
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[var(--muted)]">
            {stackFacets.map(({ value, count }) => (
              <li key={value}>
                {value}{" "}
                <span className="font-mono text-xs text-[var(--faint)]">
                  {count}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {projects.length === 0 ? (
        <p className="text-[var(--muted)]">{t.projects.empty}</p>
      ) : (
        <ul className="space-y-16">
          {projects.map((project) => (
            <li key={project.slug}>
              <Link
                href={`/${locale}/projects/${project.slug}`}
                className="group grid gap-6 sm:grid-cols-[1fr_1.2fr] sm:items-center"
              >
                <div className="overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--surface)]">
                  <Image
                    src={project.cover}
                    alt=""
                    width={1200}
                    height={675}
                    className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.02]"
                    sizes="(max-width: 40rem) 100vw, 24rem"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <h2 className="text-3xl group-hover:underline group-hover:underline-offset-4">
                      {project.title}
                    </h2>
                    <span className="font-mono text-xs text-[var(--faint)]">
                      {project.year} · {t.status[project.status]}
                    </span>
                  </div>
                  <p className="text-[var(--muted)]">{project.summary}</p>
                  <p className="font-mono text-xs text-[var(--faint)]">
                    {project.stack.join("  ·  ")}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
