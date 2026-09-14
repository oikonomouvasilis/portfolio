import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { htmlLang, isLocale, locales, type Locale } from "@/lib/i18n";
import { LocaleSwitch } from "@/components/locale-switch";
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
  const isGreek = locale === "el";

  return {
    title: {
      default: "Vasilis Oikonomou",
      template: "%s · Vasilis Oikonomou",
    },
    description: isGreek
      ? "Data engineering, αυτοματισμοί και full-stack ανάπτυξη."
      : "Data engineering, automation and full-stack development.",
    // Οι εναλλακτικές γλώσσες δηλώνονται ρητά ώστε οι μηχανές αναζήτησης να μη
    // θεωρήσουν τις δύο εκδοχές διπλότυπο περιεχόμενο.
    alternates: {
      languages: Object.fromEntries(
        locales.map((l) => [htmlLang[l], `/${l}`]),
      ),
    },
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

  return (
    <html lang={htmlLang[locale as Locale]} suppressHydrationWarning>
      <body className="min-h-dvh antialiased">
        <header className="border-b border-[var(--border)]">
          <nav className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
            <span className="font-medium">Vasilis Oikonomou</span>
            <LocaleSwitch current={locale as Locale} />
          </nav>
        </header>
        <main className="mx-auto max-w-3xl px-6 py-16">{children}</main>
      </body>
    </html>
  );
}
