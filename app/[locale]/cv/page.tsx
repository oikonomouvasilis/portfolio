import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMessages, isLocale, type Locale } from "@/lib/i18n";
import { alternatesFor, openGraphFor } from "@/lib/site";
import { formatPeriod } from "@/lib/format";
import { getProjects } from "@/lib/content/projects";
import { cv } from "@/content/cv";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getMessages(locale);
  return {
    title: t.nav.cv,
    description: cv.summary[locale],
    alternates: alternatesFor(locale, "/cv"),
    openGraph: openGraphFor(locale, {
      title: t.nav.cv,
      description: cv.summary[locale],
      path: "/cv",
    }),
  };
}

export default async function CvPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  const t = await getMessages(locale);
  const period = (from: string, to: string | null) =>
    formatPeriod(from, to, locale, t.about.present);

  /*
   * Τα project του βιογραφικού αντλούνται από το ίδιο content pipeline με το
   * site — δεν ξαναγράφονται εδώ. Ένα project που αλλάζει στο MDX αλλάζει και
   * στο PDF, χωρίς να το θυμηθεί κανείς.
   */
  const projects = (await getProjects(locale)).filter((p) => p.featured);

  return (
    <div className="cv-page mx-auto max-w-3xl space-y-10">
      {/* Η γραμμή λήψης δεν τυπώνεται — θα ήταν χαρτί που λέει «κατέβασε χαρτί». */}
      <div className="no-print flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] pb-6">
        <h1 className="text-4xl sm:text-5xl">{t.nav.cv}</h1>
        <a
          href={`/cv-${locale}.pdf`}
          download
          className="rounded-md border border-[var(--border-strong,var(--line))] px-4 py-2 text-sm transition-colors hover:bg-[var(--surface)]"
        >
          {t.cv.download} ↓
        </a>
      </div>

      <header className="space-y-2">
        <h2 className="cv-name text-3xl">{cv.name}</h2>
        <p className="text-[var(--muted)]">{cv.headline[locale]}</p>
        <p className="font-mono text-xs text-[var(--faint)]">
          {cv.location[locale]} · {cv.email} ·{" "}
          {cv.links.map((l) => l.href.replace(/^https?:\/\/(www\.)?/, "")).join(" · ")}
        </p>
      </header>

      <p className="max-w-2xl leading-relaxed text-[var(--muted)]">
        {cv.summary[locale]}
      </p>

      <CvSection title={t.about.experience}>
        {cv.experience.map((e) => (
          <article key={`${e.from}-${e.role.en}`} className="cv-entry space-y-1">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <h4 className="text-lg">{e.role[locale]}</h4>
              <span className="font-mono text-xs text-[var(--faint)]">
                {period(e.from, e.to)}
              </span>
            </div>
            <p className="text-sm text-[var(--faint)]">
              {e.organization[locale]} · {e.location[locale]}
            </p>
            <p className="text-sm text-[var(--muted)]">{e.summary[locale]}</p>
            {e.highlights && e.highlights.length > 0 && (
              <ul className="ml-4 list-disc space-y-1 pt-1 text-sm text-[var(--muted)] marker:text-[var(--faint)]">
                {e.highlights.map((h) => (
                  <li key={h.en}>{h[locale]}</li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </CvSection>

      <CvSection title={t.cv.projects}>
        {projects.map((p) => (
          <article key={p.slug} className="cv-entry space-y-1">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <h4 className="text-lg">{p.title}</h4>
              <span className="font-mono text-xs text-[var(--faint)]">
                {p.year}
              </span>
            </div>
            <p className="text-sm text-[var(--muted)]">{p.summary}</p>
            <p className="text-sm text-[var(--muted)]">{p.outcome}</p>
            <p className="font-mono text-xs text-[var(--faint)]">
              {p.stack.join(" · ")}
              {p.repo && (
                <>
                  {" — "}
                  {p.repo.replace(/^https?:\/\/(www\.)?/, "")}
                </>
              )}
            </p>
          </article>
        ))}
      </CvSection>

      <CvSection title={t.about.education}>
        {cv.education.map((e) => (
          <article key={`${e.from}-${e.degree.en}`} className="cv-entry space-y-1">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <h4 className="text-lg">{e.degree[locale]}</h4>
              <span className="font-mono text-xs text-[var(--faint)]">
                {period(e.from, e.to)}
              </span>
            </div>
            <p className="text-sm text-[var(--faint)]">{e.institution[locale]}</p>
            {e.note && (
              <p className="text-sm text-[var(--muted)] italic">{e.note[locale]}</p>
            )}
          </article>
        ))}
      </CvSection>

      <CvSection title={t.about.skills}>
        <dl className="space-y-2">
          {cv.skills.map((g) => (
            <div key={g.label.en} className="cv-entry sm:flex sm:gap-4">
              <dt className="min-w-44 font-mono text-xs tracking-widest text-[var(--faint)] uppercase sm:pt-1">
                {g.label[locale]}
              </dt>
              <dd className="text-sm">{g.items.join(" · ")}</dd>
            </div>
          ))}
        </dl>
      </CvSection>

      <CvSection title={t.about.interests}>
        <p className="text-sm text-[var(--muted)]">
          {cv.interests.map((i) => i[locale]).join(" · ")}
        </p>
      </CvSection>
    </div>
  );
}

function CvSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="cv-section space-y-4">
      <h3 className="flex items-baseline gap-4 font-mono text-xs tracking-widest text-[var(--faint)] uppercase">
        {title}
        <span aria-hidden="true" className="h-px flex-1 bg-[var(--line)]" />
      </h3>
      <div className="space-y-5">{children}</div>
    </section>
  );
}
