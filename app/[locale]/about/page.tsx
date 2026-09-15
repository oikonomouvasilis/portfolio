import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getMessages, isLocale, type Locale } from "@/lib/i18n";
import { formatPeriod } from "@/lib/format";
import { cv } from "@/content/cv";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getMessages(locale);
  return { title: t.about.title, description: cv.summary[locale] };
}

export default async function AboutPage({
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

  return (
    <div className="space-y-20">
      <header className="grid gap-8 sm:grid-cols-[auto_1fr] sm:items-start">
        {/*
          Η πηγή είναι 200×200, οπότε δεν εμφανίζεται ποτέ μεγαλύτερη από 128px —
          πάνω από αυτό αρχίζει να φαίνεται η έλλειψη ανάλυσης.
        */}
        <Image
          src={cv.photo}
          alt=""
          width={200}
          height={200}
          priority
          className="size-32 rounded-full border border-[var(--line)] object-cover"
        />

        <div className="space-y-4">
          <h1 className="text-5xl sm:text-6xl">{t.about.title}</h1>
          <p className="max-w-2xl text-lg leading-relaxed text-[var(--muted)]">
            {cv.summary[locale]}
          </p>
          <p className="font-mono text-xs tracking-widest text-[var(--faint)] uppercase">
            {cv.location[locale]}
          </p>
        </div>
      </header>

      <Section title={t.about.experience}>
        <ol className="space-y-8">
          {cv.experience.map((entry) => (
            <li
              key={`${entry.from}-${entry.role.en}`}
              className="grid gap-x-8 gap-y-2 sm:grid-cols-[11rem_1fr]"
            >
              <span className="font-mono text-xs text-[var(--faint)] sm:pt-1.5">
                {period(entry.from, entry.to)}
              </span>
              <div className="space-y-1">
                <h3 className="text-xl">{entry.role[locale]}</h3>
                <p className="text-sm text-[var(--faint)]">
                  {entry.organization[locale]} · {entry.location[locale]}
                </p>
                <p className="text-sm text-[var(--muted)]">
                  {entry.summary[locale]}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section title={t.about.education}>
        <ol className="space-y-8">
          {cv.education.map((entry) => (
            <li
              key={`${entry.from}-${entry.degree.en}`}
              className="grid gap-x-8 gap-y-2 sm:grid-cols-[11rem_1fr]"
            >
              <span className="font-mono text-xs text-[var(--faint)] sm:pt-1.5">
                {period(entry.from, entry.to)}
              </span>
              <div className="space-y-1">
                <h3 className="text-xl">{entry.degree[locale]}</h3>
                <p className="text-sm text-[var(--faint)]">
                  {entry.institution[locale]}
                </p>
                {entry.note && (
                  <p className="text-sm text-[var(--muted)] italic">
                    {entry.note[locale]}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section title={t.about.skills}>
        <dl className="space-y-6">
          {cv.skills.map((group) => (
            <div
              key={group.label.en}
              className="grid gap-x-8 gap-y-2 sm:grid-cols-[11rem_1fr]"
            >
              <dt className="font-mono text-xs tracking-widest text-[var(--faint)] uppercase sm:pt-1">
                {group.label[locale]}
              </dt>
              <dd className="flex flex-wrap gap-x-4 gap-y-1.5">
                {group.items.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section title={t.about.interests}>
        <p className="text-[var(--muted)]">
          {cv.interests.map((i) => i[locale]).join(" · ")}
        </p>
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-8">
      <h2 className="flex items-baseline gap-4 font-mono text-xs tracking-widest text-[var(--faint)] uppercase">
        {title}
        <span aria-hidden="true" className="h-px flex-1 bg-[var(--line)]" />
      </h2>
      {children}
    </section>
  );
}
