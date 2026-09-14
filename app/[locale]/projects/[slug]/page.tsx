import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getMessages, isLocale, locales } from "@/lib/i18n";
import { getProject, getProjectSlugs } from "@/lib/content/projects";

type Params = Promise<{ locale: string; slug: string }>;

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};

  const project = await getProject(slug, locale);
  if (!project) return {};

  return { title: project.title, description: project.summary };
}

export default async function ProjectPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const project = await getProject(slug, locale);
  if (!project) notFound();

  const t = await getMessages(locale);

  return (
    <article className="space-y-10">
      <Link
        href={`/${locale}/projects`}
        className="text-sm text-[var(--muted)] underline-offset-4 hover:underline"
      >
        ← {t.projects.backToProjects}
      </Link>

      <header className="space-y-3">
        <h1 className="text-3xl font-medium tracking-tight">{project.title}</h1>
        <p className="text-[var(--muted)]">{project.summary}</p>

        <dl className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-[var(--muted)]">
          <div className="flex gap-2">
            <dt className="sr-only">{t.projects.role}</dt>
            <dd>{project.role}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="sr-only">Year</dt>
            <dd>
              {project.year} · {t.status[project.status]}
            </dd>
          </div>
        </dl>

        <ul className="flex flex-wrap gap-2 text-xs">
          {project.stack.map((tech) => (
            <li
              key={tech}
              className="rounded-md border border-[var(--border)] px-2 py-0.5 text-[var(--muted)]"
            >
              {tech}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-4 text-sm">
          {project.repo && (
            <a
              href={project.repo}
              className="underline underline-offset-4"
              rel="noreferrer"
            >
              {t.projects.viewRepo}
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              className="underline underline-offset-4"
              rel="noreferrer"
            >
              {t.projects.viewDemo}
            </a>
          )}
          {project.caseStudyOnly && (
            <span className="text-[var(--muted)]">
              {t.projects.caseStudyOnly}
            </span>
          )}
        </div>
      </header>

      {project.isFallback && (
        <p
          role="status"
          className="rounded-lg border border-[var(--border)] px-4 py-3 text-sm text-[var(--muted)]"
        >
          {t.projects.fallbackNotice}
        </p>
      )}

      <section className="grid gap-6 sm:grid-cols-3">
        {(
          [
            [t.projects.problem, project.problem],
            [t.projects.solution, project.solution],
            [t.projects.outcome, project.outcome],
          ] as const
        ).map(([label, value]) => (
          <div key={label} className="space-y-1">
            <h2 className="text-sm font-medium">{label}</h2>
            <p className="text-sm text-[var(--muted)]">{value}</p>
          </div>
        ))}
      </section>

      {/*
        Το σώμα MDX είναι δικό μας περιεχόμενο από το repo, όχι είσοδος χρήστη.
        Η προεπιλεγμένη τυπογραφία μπαίνει στη Φάση 3 μαζί με το design system.
      */}
      <div className="space-y-4 leading-relaxed [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-medium [&_p]:text-[var(--muted)]">
        <MDXRemote source={project.body} />
      </div>
    </article>
  );
}
