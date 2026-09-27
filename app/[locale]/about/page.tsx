import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getMessages, isLocale, type Locale } from "@/lib/i18n";
import { alternatesFor, openGraphFor } from "@/lib/site";
import { Container } from "@/components/container";
import { formatPeriod } from "@/lib/format";
import { cv } from "@/content/cv";
import { TechList } from "@/components/tech-icon";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getMessages(locale);
  return {
    title: t.about.title,
    description: cv.summary[locale],
    alternates: alternatesFor(locale, "/about"),
    openGraph: openGraphFor(locale, {
      title: t.about.title,
      description: cv.summary[locale],
      path: "/about",
    }),
  };
}

/*
 * Προφίλ και βιογραφικό σε **μία** σελίδα (D27).
 *
 * Ήταν δύο — `/about` και `/cv` — που έλεγαν τα ίδια με άλλη σειρά, και ο
 * επισκέπτης δεν ήξερε ποια να ανοίξει. Τώρα εδώ ζουν όλα, και από εδώ
 * τυπώνονται και τα δύο PDF (`npm run cv:pdf`). Τα project δεν επαναλαμβάνονται:
 * έχουν δική τους ενότητα στην αρχική και στο `/projects`.
 */
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
    <Container className="cv-page space-y-20 py-16 sm:py-24">
      <header
        data-reveal
        className="grid gap-8 sm:grid-cols-[auto_1fr] sm:items-start"
      >
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
          <p className="no-print font-mono text-xs tracking-widest text-[var(--faint)] uppercase">
            {t.about.title}
          </p>
          <h1 className="cv-name text-5xl sm:text-6xl">{cv.name}</h1>
          <p className="text-lg text-[var(--fg)]">{cv.headline[locale]}</p>
          <p className="text-block max-w-2xl text-lg leading-relaxed text-[var(--muted)]">
            {cv.summary[locale]}
          </p>

          {/* Στο PDF οι σύνδεσμοι τυπώνονται ως κείμενο — βλ. `@media print`. */}
          <p className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-[var(--faint)]">
            <span>{cv.location[locale]}</span>
            <span aria-hidden="true">·</span>
            <a href={`mailto:${cv.email}`} className="hover:text-[var(--fg)]">
              {cv.email}
            </a>
            {cv.links.map((link) => (
              <span key={link.href} className="contents">
                <span aria-hidden="true">·</span>
                <a
                  href={link.href}
                  rel="me noreferrer"
                  className="hover:text-[var(--fg)]"
                >
                  {link.href.replace(/^https?:\/\/(www\.)?/, "")}
                </a>
              </span>
            ))}
          </p>

          {/* Η λήψη δεν τυπώνεται — θα ήταν χαρτί που λέει «κατέβασε χαρτί». */}
          <a
            href={`/cv-${locale}.pdf`}
            download
            className="no-print inline-block rounded-md border border-[var(--line)] px-4 py-2 text-sm transition-colors hover:bg-[var(--panel)]"
          >
            {t.cv.download} ↓
          </a>
        </div>
      </header>

      <Section title={t.about.experience}>
        <ol data-reveal-children className="space-y-10">
          {cv.experience.map((entry) => (
            <Row
              key={`${entry.from}-${entry.role.en}`}
              aside={period(entry.from, entry.to)}
            >
              <h3 className="text-xl">{entry.role[locale]}</h3>
              <p className="text-sm text-[var(--faint)]">
                {entry.organization[locale]} · {entry.location[locale]}
              </p>
              <p className="text-block text-sm text-[var(--muted)]">
                {entry.summary[locale]}
              </p>
              {entry.highlights && entry.highlights.length > 0 && (
                <ul className="text-block ml-4 list-disc space-y-1 pt-1 text-sm text-[var(--muted)] marker:text-[var(--faint)]">
                  {entry.highlights.map((h) => (
                    <li key={h.en}>{h[locale]}</li>
                  ))}
                </ul>
              )}
            </Row>
          ))}
        </ol>
      </Section>

      <Section title={t.about.education}>
        <ol data-reveal-children className="space-y-8">
          {cv.education.map((entry) => (
            <Row
              key={`${entry.from}-${entry.degree.en}`}
              aside={period(entry.from, entry.to)}
            >
              <h3 className="text-xl">{entry.degree[locale]}</h3>
              <p className="text-sm text-[var(--faint)]">
                {entry.institution[locale]}
              </p>
              {entry.note && (
                <p className="text-sm text-[var(--muted)] italic">
                  {entry.note[locale]}
                </p>
              )}
            </Row>
          ))}
        </ol>
      </Section>

      <Section title={t.about.certifications}>
        <ol data-reveal-children className="space-y-8">
          {cv.certifications.map((entry) => (
            <Row
              key={`${entry.from}-${entry.title.en}`}
              aside={period(entry.from, entry.to)}
            >
              <h3 className="text-xl">{entry.title[locale]}</h3>
              <p className="text-sm text-[var(--faint)]">
                {entry.issuer[locale]}
              </p>
            </Row>
          ))}
        </ol>
      </Section>

      <Section title={t.about.skills}>
        <dl data-reveal-children className="space-y-6">
          {cv.skills.map((group) => (
            <div
              key={group.label.en}
              className="cv-entry grid gap-x-8 gap-y-2 sm:grid-cols-[11rem_1fr]"
            >
              <dt className="font-mono text-xs tracking-widest text-[var(--faint)] uppercase sm:pt-1">
                {group.label[locale]}
              </dt>
              <dd>
                <TechList items={group.items} />
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section title={t.about.languages}>
        <dl data-reveal-children className="space-y-6">
          {cv.languages.map((lang) => (
            <div
              key={lang.name.en}
              className="cv-entry grid gap-x-8 gap-y-2 sm:grid-cols-[11rem_1fr]"
            >
              <dt className="font-mono text-xs tracking-widest text-[var(--faint)] uppercase sm:pt-1">
                {lang.name[locale]}
              </dt>
              <dd className="text-[var(--muted)]">{lang.level[locale]}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section title={t.about.events}>
        <ol data-reveal-children className="space-y-8">
          {cv.events.map((entry) => (
            <Row key={entry.title.en} aside={entry.when[locale]}>
              <h3 className="text-xl">{entry.title[locale]}</h3>
              <p className="text-sm text-[var(--faint)]">
                {entry.organizer && <>{entry.organizer[locale]} · </>}
                {entry.location[locale]}
              </p>
            </Row>
          ))}
        </ol>
      </Section>

      <Section title={t.about.publications}>
        <ol data-reveal-children className="space-y-8">
          {cv.publications.map((entry) => (
            <Row key={entry.title.en} aside={entry.year ?? ""}>
              <h3 className="text-xl">{entry.title[locale]}</h3>
              <p className="text-sm text-[var(--faint)]">
                {entry.venue[locale]}
              </p>
              {entry.note && (
                <p className="text-sm text-[var(--muted)] italic">
                  {entry.note[locale]}
                </p>
              )}
            </Row>
          ))}
        </ol>
      </Section>

      <Section title={t.about.interests}>
        <p data-reveal className="text-[var(--muted)]">
          {cv.interests.map((i) => i[locale]).join(" · ")}
        </p>
      </Section>
    </Container>
  );
}

/** Μία εγγραφή: η περίοδος αριστερά, το περιεχόμενο δεξιά. */
function Row({
  aside,
  children,
}: {
  aside: string;
  children: React.ReactNode;
}) {
  return (
    <li className="cv-entry grid gap-x-8 gap-y-2 sm:grid-cols-[11rem_1fr]">
      <span className="font-mono text-xs text-[var(--faint)] sm:pt-1.5">
        {aside}
      </span>
      <div className="space-y-1">{children}</div>
    </li>
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
    <section className="cv-section space-y-8">
      <h2
        data-reveal
        className="flex items-baseline gap-4 font-mono text-xs tracking-widest text-[var(--faint)] uppercase"
      >
        {title}
        <span aria-hidden="true" data-rule className="h-px flex-1 bg-[var(--line)]" />
      </h2>
      {children}
    </section>
  );
}
