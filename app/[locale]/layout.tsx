import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { htmlLang, isLocale, locales, getMessages, type Locale } from "@/lib/i18n";
import { alternatesFor, openGraphFor, siteName, siteUrl } from "@/lib/site";
import { cv } from "@/content/cv";
import { serif, sans } from "@/lib/fonts";
import { LocaleSwitch } from "@/components/locale-switch";
import { ThemeToggle, themeInitScript } from "@/components/theme-toggle";
import "../globals.css";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const isGreek = locale === "el";

  const description = isGreek
    ? "Data engineering, αυτοματισμοί και full-stack ανάπτυξη."
    : "Data engineering, automation and full-stack development.";

  return {
    /*
     * Χωρίς αυτό, οι σχετικές διαδρομές των OG εικόνων δεν γίνονται απόλυτα URL
     * και το preview σε LinkedIn/Slack βγαίνει χωρίς εικόνα.
     */
    metadataBase: new URL(siteUrl),
    title: { default: siteName, template: `%s · ${siteName}` },
    description,
    alternates: alternatesFor(locale),
    openGraph: openGraphFor(locale, { title: siteName, description }),
    twitter: { card: "summary_large_image" },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const t = await getMessages(locale);
  const year = new Date().getFullYear();

  /*
   * Ένας κόμβος `Person` για όλο το site — γι' αυτό σταθερό `@id` και όχι ένας
   * ανά σελίδα: αλλιώς η Google βλέπει εννιά διαφορετικά πρόσωπα με το ίδιο
   * όνομα. Το `sameAs` είναι ο τρόπος να δέσει το site με τα GitHub/LinkedIn.
   */
  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: cv.name,
    alternateName: "Vasilis Oikonomou",
    url: `${siteUrl}/${locale}`,
    image: `${siteUrl}${cv.photo}`,
    jobTitle: cv.headline[locale as Locale],
    email: `mailto:${cv.email}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: locale === "el" ? "Αθήνα" : "Athens",
      addressCountry: "GR",
    },
    description: cv.summary[locale as Locale],
    knowsAbout: cv.skills.flatMap((group) => group.items),
    sameAs: cv.links
      .filter((link) => link.label !== "Portfolio")
      .map((link) => link.href),
  };

  const nav = [
    { href: `/${locale}/projects`, label: t.nav.projects },
    { href: `/${locale}/about`, label: t.nav.about },
    { href: `/${locale}/cv`, label: t.nav.cv },
    { href: `/${locale}/contact`, label: t.nav.contact },
  ];

  return (
    <html
      lang={htmlLang[locale as Locale]}
      className={`${serif.variable} ${sans.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Εφαρμόζει το αποθηκευμένο θέμα πριν το πρώτο βάψιμο (D16). */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
        />
      </head>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded focus:bg-[var(--fg)] focus:px-3 focus:py-2 focus:text-[var(--bg)]"
        >
          {locale === "el" ? "Στο περιεχόμενο" : "Skip to content"}
        </a>

        <header className="border-b border-[var(--line)]">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-8 gap-y-3 px-6 py-5">
            <Link
              href={`/${locale}`}
              className="font-serif text-lg tracking-tight"
            >
              Vasilis Oikonomou
            </Link>

            <nav className="flex flex-1 flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-[var(--muted)] underline-offset-4 transition-colors hover:text-[var(--fg)] hover:underline"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <LocaleSwitch current={locale as Locale} />
              <ThemeToggle label={t.common.toggleTheme} />
            </div>
          </div>
        </header>

        <main id="main" className="mx-auto w-full max-w-5xl flex-1 px-6 py-16">
          {children}
        </main>

        <footer className="border-t border-[var(--line)]">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-8 text-sm text-[var(--faint)]">
            <span>© {year} Vasileios Oikonomou</span>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <a
                href={`/cv-${locale}.pdf`}
                download
                className="underline-offset-4 hover:text-[var(--fg)] hover:underline"
              >
                {t.home.ctaCv} ↓
              </a>
              <a
                href="https://github.com/oikonomouvasilis"
                rel="me noreferrer"
                className="underline-offset-4 hover:text-[var(--fg)] hover:underline"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/vasileios-oikonomoy/"
                rel="me noreferrer"
                className="underline-offset-4 hover:text-[var(--fg)] hover:underline"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </footer>

        {/* Χωρίς cookies, χωρίς banner συγκατάθεσης (D10). */}
        <Analytics />
      </body>
    </html>
  );
}
