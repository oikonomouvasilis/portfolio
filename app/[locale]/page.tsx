import Image from "next/image";
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
    <div className="space-y-24">
      {/* Η επικεφαλίδα κουβαλάει όλο το βάρος — editorial σημαίνει να τολμάς μέγεθος. */}
      <section className="max-w-3xl space-y-6">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl">{t.home.tagline}</h1>
        <p className="font-mono text-sm tracking-widest text-[var(--faint)] uppercase">
          {t.home.subtitle}
        </p>
      </section>

      {featured.length > 0 && (
        <section className="space-y-10">
          <h2 className="flex items-baseline gap-4 font-mono text-xs tracking-widest text-[var(--faint)] uppercase">
            {t.home.selectedWork}
            <span aria-hidden="true" className="h-px flex-1 bg-[var(--line)]" />
          </h2>

          <ul className="grid gap-12 sm:grid-cols-2">
            {featured.map((project) => (
              <li key={project.slug}>
                <Link href={`/${locale}/projects/${project.slug}`} className="group block space-y-4">
                  <div className="overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--surface)]">
                    <Image
                      src={project.cover}
                      alt=""
                      width={1200}
                      height={675}
                      className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.02]"
                      sizes="(max-width: 40rem) 100vw, 32rem"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="text-2xl group-hover:underline group-hover:underline-offset-4">
                        {project.title}
                      </h3>
                      <span className="shrink-0 font-mono text-xs text-[var(--faint)]">
                        {project.year}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--muted)]">{project.summary}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href={`/${locale}/projects`}
            className="inline-block underline underline-offset-4 decoration-[var(--line)] hover:decoration-[var(--fg)]"
          >
            {t.home.ctaProjects} →
          </Link>
        </section>
      )}

      <p
        role="status"
        className="border-l-2 border-[var(--line)] pl-4 text-sm text-[var(--muted)]"
      >
        <strong className="font-medium text-[var(--fg)]">
          {t.common.comingSoon}
        </strong>{" "}
        — {t.common.scaffoldNote}
      </p>
    </div>
  );
}
