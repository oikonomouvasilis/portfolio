import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getMessages, isLocale, locales } from "@/lib/i18n";
import { alternatesFor, openGraphFor } from "@/lib/site";
import {
  getNeighbours,
  getProject,
  getProjectSlugs,
} from "@/lib/content/projects";
import { StackDiagram } from "@/components/stack-diagram";
import { Gallery } from "@/components/gallery";
import { Carousel } from "@/components/carousel";
import { Container } from "@/components/container";

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

  /*
   * Δεν δηλώνεται `openGraph.images` — θα υπερίσχυε του `opengraph-image.tsx`
   * δίπλα, που παράγει την κάρτα με τον τίτλο πάνω στο στιγμιότυπο.
   */
  return {
    title: project.title,
    description: project.summary,
    alternates: alternatesFor(locale, `/projects/${slug}`),
    openGraph: openGraphFor(locale, {
      title: project.title,
      description: project.summary,
      path: `/projects/${slug}`,
      type: "article",
    }),
  };
}

export default async function ProjectPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const project = await getProject(slug, locale);
  if (!project) notFound();

  const t = await getMessages(locale);
  const neighbours = await getNeighbours(slug, locale);

  const narrative = [
    [t.projects.problem, project.problem],
    [t.projects.goal, project.goal],
    [t.projects.solution, project.solution],
    [t.projects.outcome, project.outcome],
  ] as const;

  return (
    <Container className="py-16 sm:py-24">
      {/*
        Κάθε ενότητα του case study εμφανίζεται μόνη της καθώς κατεβαίνεις:
        κεφαλίδα, carousel, αφήγηση, αρχιτεκτονική, κείμενο, συλλογή, πλοήγηση.
      */}
      <article data-reveal-children className="space-y-20">
        <header className="space-y-8">
        <Link
          href={`/${locale}/projects`}
          className="font-mono text-xs tracking-widest text-[var(--faint)] uppercase underline-offset-4 hover:text-[var(--fg)] hover:underline"
        >
          ← {t.projects.backToProjects}
        </Link>

        <div className="max-w-3xl space-y-5">
          <h1 className="text-5xl sm:text-6xl">{project.title}</h1>
          <p className="text-xl text-[var(--muted)]">{project.summary}</p>
        </div>

        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 border-y border-[var(--line)] py-4 font-mono text-xs tracking-wide text-[var(--faint)] uppercase">
          <span>{project.year}</span>
          <span>{t.status[project.status]}</span>
          <span className="normal-case">{project.role}</span>

          <span className="flex flex-1 flex-wrap justify-end gap-x-6 gap-y-2">
            {project.repo && (
              <a
                href={project.repo}
                rel="noreferrer"
                className="text-[var(--fg)] underline underline-offset-4 decoration-[var(--line)] hover:decoration-[var(--fg)]"
              >
                {t.projects.viewRepo} ↗
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                rel="noreferrer"
                className="text-[var(--fg)] underline underline-offset-4 decoration-[var(--line)] hover:decoration-[var(--fg)]"
              >
                {t.projects.viewDemo} ↗
              </a>
            )}
            {project.caseStudyOnly && <span>{t.projects.caseStudyOnly}</span>}
          </span>
        </div>
      </header>

      {project.isFallback && (
        <p
          role="status"
          className="border-l-2 border-[var(--line)] pl-4 text-sm text-[var(--muted)]"
        >
          {t.projects.fallbackNotice}
        </p>
      )}

      {/*
        Το εξώφυλλο είναι η αρχή ενός carousel με όλες τις οθόνες του project:
        ο επισκέπτης βλέπει τι είναι το πράγμα χωρίς να κατέβει μέχρι κάτω.
        Οι ίδιες εικόνες επανέρχονται πιο κάτω σε πλήρες μέγεθος, με λεζάντα.
      */}
      <Carousel
        images={[
          { src: project.cover, caption: project.summary },
          ...project.gallery,
        ]}
        priority
        showCaption
        sizes="(max-width: 64rem) 100vw, 64rem"
        label={project.title}
      />

      {/* Πρόβλημα → στόχος → λύση → αποτέλεσμα: η αφήγηση με μια ματιά (D15). */}
      <section className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {narrative.map(([label, value]) => (
          <div key={label} className="space-y-2">
            <h2 className="font-mono text-xs tracking-widest text-[var(--faint)] uppercase">
              {label}
            </h2>
            <p className="text-sm leading-relaxed">{value}</p>
          </div>
        ))}
      </section>

      <StackDiagram
        layers={project.stackLayers}
        labels={t.layers}
        title={t.projects.architecture}
      />

      {/*
        Το σώμα MDX είναι δικό μας περιεχόμενο από το repo, όχι είσοδος χρήστη.
        Το μέγιστο πλάτος κρατά τη γραμμή σε αναγνώσιμο μήκος (~70 χαρακτήρες).
      */}
      <div className="max-w-2xl space-y-5 leading-[1.75] [&_h2]:mt-12 [&_h2]:mb-3 [&_h2]:text-2xl [&_p]:text-[var(--muted)] [&_strong]:font-medium [&_strong]:text-[var(--fg)]">
        <MDXRemote source={project.body} />
      </div>

      <section className="space-y-6">
        <h2 className="flex items-baseline gap-4 font-mono text-xs tracking-widest text-[var(--faint)] uppercase">
          {t.projects.gallery}
          <span aria-hidden="true" className="h-px flex-1 bg-[var(--line)]" />
        </h2>
        <Gallery items={project.gallery} />
      </section>

      {(neighbours.previous || neighbours.next) && (
        <nav
          aria-label={t.projects.title}
          className="grid gap-6 border-t border-[var(--line)] pt-8 sm:grid-cols-2"
        >
          {neighbours.previous ? (
            <Link
              href={`/${locale}/projects/${neighbours.previous.slug}`}
              className="group space-y-1"
            >
              <span className="font-mono text-xs tracking-widest text-[var(--faint)] uppercase">
                ← {t.projects.previous}
              </span>
              <span className="block text-xl group-hover:underline group-hover:underline-offset-4">
                {neighbours.previous.title}
              </span>
            </Link>
          ) : (
            <span />
          )}

          {neighbours.next && (
            <Link
              href={`/${locale}/projects/${neighbours.next.slug}`}
              className="group space-y-1 sm:text-right"
            >
              <span className="font-mono text-xs tracking-widest text-[var(--faint)] uppercase">
                {t.projects.next} →
              </span>
              <span className="block text-xl group-hover:underline group-hover:underline-offset-4">
                {neighbours.next.title}
              </span>
            </Link>
          )}
          </nav>
        )}
      </article>
    </Container>
  );
}
