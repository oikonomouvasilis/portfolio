import { ImageResponse } from "next/og";
import { getMessages, isLocale, defaultLocale, locales } from "@/lib/i18n";
import { cv } from "@/content/cv";
import { ogContentType, ogFonts, ogSize, ogTheme } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Vasilis Oikonomou";

/*
 * Χωρίς αυτό η εικόνα παράγεται κατά παραγγελία, οπότε η γραμματοσειρά θα έπρεπε
 * να διαβαστεί από τον δίσκο σε runtime — αρχείο που το file tracing δεν πιάνει,
 * επειδή η διαδρομή του συντίθεται δυναμικά. Στατική, το θέμα δεν τίθεται.
 */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/** Η κάρτα που βλέπει όποιος μοιράζεται τη ρίζα του site σε LinkedIn ή Slack. */
export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;
  const t = await getMessages(locale);

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
            fontFamily: "Manrope",
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
              fontFamily: "Literata",
              fontSize: 76,
              lineHeight: 1.1,
              letterSpacing: -1.5,
              color: ogTheme.fg,
            }}
          >
            {t.home.tagline}
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "Manrope",
              fontSize: 30,
              color: ogTheme.muted,
            }}
          >
            {t.home.subtitle}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontFamily: "Manrope",
            fontSize: 24,
            color: ogTheme.faint,
          }}
        >
          {cv.headline[locale]}
        </div>
      </div>
    ),
    { ...size, fonts: await ogFonts() },
  );
}
