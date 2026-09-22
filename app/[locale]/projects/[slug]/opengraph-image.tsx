import { ImageResponse } from "next/og";
import { getMessages, isLocale, defaultLocale, locales } from "@/lib/i18n";
import { getProject, getProjectSlugs } from "@/lib/content/projects";
import { cv } from "@/content/cv";
import { ogContentType, ogFonts, ogSize, ogTheme } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

/* Βλ. σχόλιο στο `app/[locale]/opengraph-image.tsx` — παράγονται στο build. */
export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

/**
 * Μόνο για το `alt`. Ένα σταθερό `export const alt` θα έδινε σε κάθε κάρτα την
 * ίδια περιγραφή — και η κάρτα *είναι* ο τίτλος του project, οπότε αυτό ακριβώς
 * πρέπει να ακούσει όποιος δεν βλέπει την εικόνα.
 */
export async function generateImageMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const project = await getProject(params.slug, locale);

  return [
    {
      id: "card",
      size: ogSize,
      contentType: ogContentType,
      alt: project ? `${project.title} — ${project.summary}` : cv.name,
    },
  ];
}

/**
 * Μία κάρτα ανά project και ανά γλώσσα, τυπογραφική — όχι το στιγμιότυπο.
 * Τα στιγμιότυπα έχουν διάφορες αναλογίες και γεμάτο περιεχόμενο· σε 1200×630
 * με περικοπή δεν διαβάζεται τίποτα. Ο τίτλος διαβάζεται.
 */
export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;

  const [project, t] = await Promise.all([
    getProject(slug, locale),
    getMessages(locale),
  ]);

  const meta = project
    ? [
        String(project.year),
        ...project.categories.map((c) => t.categories[c]),
        ...project.stack.slice(0, 3),
      ].join("  ·  ")
    : "";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          backgroundColor: ogTheme.bg,
          padding: "72px 80px",
          borderLeft: `16px solid ${ogTheme.accent}`,
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "Inter",
            fontSize: 24,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: ogTheme.faint,
          }}
        >
          {cv.name}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              display: "flex",
              fontFamily: "Source Serif 4",
              fontSize: 76,
              lineHeight: 1.1,
              letterSpacing: -1.5,
              color: ogTheme.fg,
            }}
          >
            {project?.title ?? t.projects.title}
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "Inter",
              fontSize: 30,
              lineHeight: 1.4,
              color: ogTheme.muted,
            }}
          >
            {project?.summary ?? t.projects.intro}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontFamily: "Inter",
            fontSize: 22,
            color: ogTheme.faint,
          }}
        >
          {meta}
        </div>
      </div>
    ),
    { ...size, fonts: await ogFonts() },
  );
}
