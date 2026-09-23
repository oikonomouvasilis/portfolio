"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, localeNames, switchLocalePath, type Locale } from "@/lib/i18n";
import { Flag } from "@/components/flag";

/**
 * Κρατά τον χρήστη στην ίδια σελίδα όταν αλλάζει γλώσσα — δεν τον πετάει στην
 * αρχική, που είναι ο συνηθέστερος τρόπος να χαλάσει ένας δίγλωσσος ιστότοπος.
 */
export function LocaleSwitch({ current }: { current: Locale }) {
  const pathname = usePathname() ?? `/${current}`;

  return (
    <div className="flex items-center gap-1 text-sm">
      {locales.map((locale, index) => (
        <span key={locale} className="flex items-center gap-1">
          {index > 0 && <span className="text-[var(--muted)]">·</span>}
          {locale === current ? (
            <span
              aria-current="true"
              className="flex items-center gap-1.5 font-medium"
            >
              <Flag locale={locale} />
              {localeNames[locale]}
            </span>
          ) : (
            <Link
              href={switchLocalePath(pathname, locale)}
              hrefLang={locale}
              className="flex items-center gap-1.5 text-[var(--muted)] underline-offset-4 hover:text-[var(--fg)] hover:underline"
            >
              {/* Η σημαία της **ανενεργής** γλώσσας ξεθωριάζει μέχρι το hover. */}
              <Flag locale={locale} className="h-3.5 w-[21px] opacity-70" />
              {localeNames[locale]}
            </Link>
          )}
        </span>
      ))}
    </div>
  );
}
