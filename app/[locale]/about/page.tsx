import { notFound } from "next/navigation";
import { getMessages, isLocale } from "@/lib/i18n";
import { PlaceholderPage } from "@/components/placeholder-page";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const t = await getMessages(locale);
  return <PlaceholderPage title={t.nav.about} note={t.common.scaffoldNote} />;
}
