"use client";

import { usePathname } from "next/navigation";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";
import { NotFoundNotice } from "@/components/not-found-notice";
import { Container } from "@/components/container";
import el from "@/messages/el.json";
import en from "@/messages/en.json";

const messages: Record<Locale, typeof en> = { en, el };

/**
 * Για τα 404 που γεννιούνται **μέσα** σε έγκυρη γλώσσα — π.χ. `notFound()` σε
 * ανύπαρκτο slug project. Κρατά κεφαλίδα και υποσέλιδο, σε αντίθεση με το
 * `app/not-found.tsx` που πιάνει τις εντελώς άγνωστες διευθύνσεις.
 *
 * Client component επειδή το `not-found` δεν δέχεται `params`: η μόνη πηγή για
 * τη γλώσσα είναι το pathname.
 */
export default function LocaleNotFound() {
  const pathname = usePathname();
  const segment = pathname.split("/")[1] ?? "";
  const locale = isLocale(segment) ? segment : defaultLocale;
  const t = messages[locale].notFound;

  return (
    <Container className="py-24">
      <NotFoundNotice
      code={t.code}
      title={t.title}
      body={t.body}
        homeLabel={t.home}
        homeHref={`/${locale}`}
      />
    </Container>
  );
}
