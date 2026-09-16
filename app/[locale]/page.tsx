import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMessages, isLocale, type Locale } from "@/lib/i18n";
import { getProjects } from "@/lib/content/projects";
import { cv } from "@/content/cv";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  const t = await getMessages(locale);
  const featured = (await getProjects(locale)).filter((p) => p.featured);

  return (
    <div className="space-y-24">
      {/* Η επικεφαλίδα κουβαλάει όλο το βάρος — editorial σημαίνει να τολμάς μέγεθος. */}
      <section className="grid gap-10 sm:grid-cols-[1fr_auto] sm:items-start">
        <div className="max-w-2xl space-y-6">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl">{t.home.tagline}</h1>
          <p className="text-lg leading-relaxed text-[var(--muted)]">
            {cv.summary[locale]}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <Link
              href={`/${locale}/projects`}
              className="underline underline-offset-4 decoration-[var(--line)] hover:decoration-[var(--fg)]"
            >
              {t.home.ctaProjects} →
            </Link>
            <Link
              href={`/${locale}/about`}
              className="text-[var(--muted)] underline-offset-4 hover:text-[var(--fg)] hover:underline"
            >
              {t.nav.about}
            </Link>
            <a
              href={`/cv-${locale}.pdf`}
              download
              className="text-[var(--muted)] underline-offset-4 hover:text-[var(--fg)] hover:underline"
            >
              {t.home.ctaCv} ↓
            </a>
          </div>
        </div>

        <Image
          src={cv.photo}
          alt=""
          width={200}
          height={200}
          priority
          className="order-first size-28 rounded-full border border-[var(--line)] object-cover sm:order-none sm:size-32"
        />
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
                <Link
                  href={`/${locale}/projects/${project.slug}`}
                  className="group block space-y-4"
                >
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
                    <p className="text-sm text-[var(--muted)]">
                      {project.summary}
                    </p>
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

      <section className="space-y-6">
        <h2 className="flex items-baseline gap-4 font-mono text-xs tracking-widest text-[var(--faint)] uppercase">
          {t.about.skills}
          <span aria-hidden="true" className="h-px flex-1 bg-[var(--line)]" />
        </h2>
        <dl className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
          {cv.skills.map((group) => (
            <div key={group.label.en} className="space-y-1">
              <dt className="font-mono text-xs tracking-widest text-[var(--faint)] uppercase">
                {group.label[locale]}
              </dt>
              <dd className="text-sm">{group.items.join(" · ")}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
