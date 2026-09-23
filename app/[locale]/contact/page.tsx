import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMessages, isLocale, type Locale } from "@/lib/i18n";
import { alternatesFor, openGraphFor } from "@/lib/site";
import { Container } from "@/components/container";
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
    title: t.contact.title,
    description: t.contact.intro,
    alternates: alternatesFor(locale, "/contact"),
    openGraph: openGraphFor(locale, {
      title: t.contact.title,
      description: t.contact.intro,
      path: "/contact",
    }),
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  const t = await getMessages(locale);

  return (
    <Container className="py-16 sm:py-24">
      <div className="max-w-2xl space-y-12">
      <header data-reveal className="space-y-4">
        <h1 className="text-5xl sm:text-6xl">{t.contact.title}</h1>
        <p className="text-lg text-[var(--muted)]">{t.contact.intro}</p>
      </header>

      {/* Χωρίς φόρμα: κρατά τη σελίδα 100% στατική και δεν χρειάζεται anti-spam (D13). */}
      <dl data-reveal-children className="space-y-8">
        <div className="grid gap-x-8 gap-y-2 sm:grid-cols-[8rem_1fr] sm:items-baseline">
          <dt className="font-mono text-xs tracking-widest text-[var(--faint)] uppercase">
            {t.contact.email}
          </dt>
          <dd>
            <a
              href={`mailto:${cv.email}`}
              className="text-xl underline underline-offset-4 decoration-[var(--line)] hover:decoration-[var(--fg)]"
            >
              {cv.email}
            </a>
          </dd>
        </div>

        <div className="grid gap-x-8 gap-y-2 sm:grid-cols-[8rem_1fr] sm:items-baseline">
          <dt className="font-mono text-xs tracking-widest text-[var(--faint)] uppercase">
            {t.contact.elsewhere}
          </dt>
          <dd className="flex flex-wrap gap-x-6 gap-y-2">
            {cv.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                rel="me noreferrer"
                className="text-xl underline underline-offset-4 decoration-[var(--line)] hover:decoration-[var(--fg)]"
              >
                {link.label} ↗
              </a>
            ))}
          </dd>
        </div>
      </dl>

      {cv.openToWork && (
        <p
          data-reveal
          className="border-l-2 border-[var(--accent)] pl-4 text-sm text-[var(--muted)]"
        >
          {t.contact.openToWork}
        </p>
        )}
      </div>
    </Container>
  );
}
