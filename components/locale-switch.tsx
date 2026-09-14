"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, localeNames, switchLocalePath, type Locale } from "@/lib/i18n";

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
            <span aria-current="true" className="font-medium">
              {localeNames[locale]}
            </span>
          ) : (
            <Link
              href={switchLocalePath(pathname, locale)}
              hrefLang={locale}
              className="text-[var(--muted)] underline-offset-4 hover:underline"
            >
              {localeNames[locale]}
            </Link>
          )}
        </span>
      ))}
    </div>
  );
}
