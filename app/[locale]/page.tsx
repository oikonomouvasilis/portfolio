import { notFound } from "next/navigation";
import { getMessages, isLocale } from "@/lib/i18n";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const t = await getMessages(locale);

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-medium tracking-tight text-balance">
          {t.home.tagline}
        </h1>
        <p className="text-[var(--muted)]">{t.home.subtitle}</p>
      </div>

      <div
        className="rounded-xl border border-[var(--border)] px-5 py-4 text-sm"
        role="status"
      >
        <p className="font-medium">{t.common.comingSoon}</p>
        <p className="mt-1 text-[var(--muted)]">{t.common.scaffoldNote}</p>
      </div>
    </div>
  );
}
