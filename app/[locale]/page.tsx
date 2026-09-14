import Link from "next/link";
import { notFound } from "next/navigation";
import { getMessages, isLocale } from "@/lib/i18n";
import { getProjects } from "@/lib/content/projects";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const t = await getMessages(locale);
  const featured = (await getProjects(locale)).filter((p) => p.featured);

  return (
    <div className="space-y-12">
      <div className="space-y-3">
        <h1 className="text-3xl font-medium tracking-tight text-balance">
          {t.home.tagline}
        </h1>
        <p className="text-[var(--muted)]">{t.home.subtitle}</p>
        <Link
          href={`/${locale}/projects`}
          className="inline-block text-sm underline underline-offset-4"
        >
          {t.home.ctaProjects} →
        </Link>
      </div>

      {featured.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-sm text-[var(--muted)]">{t.projects.title}</h2>
          <ul className="space-y-3">
            {featured.map((project) => (
              <li key={project.slug}>
                <Link
                  href={`/${locale}/projects/${project.slug}`}
                  className="block rounded-xl border border-[var(--border)] px-5 py-4 transition-colors hover:border-[var(--muted)]"
                >
                  <h3 className="font-medium">{project.title}</h3>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {project.summary}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div
        className="rounded-xl border border-[var(--border)] px-5 py-4 text-sm"
        role="status"
      >
        <p className="font-medium">{t.common.comingSoon}</p>
        <p className="mt-1 text-[var(--muted)]">{t.common.scaffoldNote}</p>
      </div>
    </div>
  );
}
