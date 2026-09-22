import { htmlLang, locales, type Locale } from "@/lib/i18n";

/**
 * Η κανονική διεύθυνση του site. Χρειάζεται σε τρία σημεία που **πρέπει** να
 * συμφωνούν — `metadataBase`, `sitemap.xml`, `robots.txt` — γι' αυτό υπολογίζεται
 * μία φορά εδώ. Αν αποφασιστεί custom domain (D11), αλλάζει μόνο αυτή η γραμμή.
 *
 * Στα preview deployment παίρνει το URL που δίνει το Vercel, ώστε τα OG preview
 * να δείχνουν το preview και όχι το production.
 */
export const siteUrl =
  process.env.VERCEL_ENV === "production"
    ? "https://portfolio-oiko4.vercel.app"
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

/**
 * Το `alternates` μιας σελίδας: κανονικό URL + οι δύο γλώσσες.
 *
 * Το `path` είναι η διαδρομή **χωρίς** το πρόθεμα γλώσσας — `/projects`, `""`
 * για την αρχική. Χωρίς canonical ανά σελίδα, το Next κληρονομεί αυτό του
 * layout και και οι εννιά σελίδες δηλώνουν την ίδια διεύθυνση.
 *
 * Το `x-default` δείχνει στο `/` — τη ρίζα που ανακατευθύνει στην προεπιλεγμένη
 * γλώσσα — ώστε η Google να ξέρει πού να στείλει όποιον δεν ταιριάζει σε καμία.
 */
export function alternatesFor(locale: Locale, path = "") {
  return {
    canonical: `${siteUrl}/${locale}${path}`,
    languages: {
      ...Object.fromEntries(
        locales.map((l) => [htmlLang[l], `${siteUrl}/${l}${path}`]),
      ),
      "x-default": `${siteUrl}/`,
    },
  };
}

export const siteName = "Vasilis Oikonomou";

/**
 * Το `openGraph` μιας σελίδας, ολόκληρο.
 *
 * Υπάρχει επειδή το Next **δεν** συγχωνεύει το `openGraph` του layout με αυτό
 * της σελίδας — το αντικαθιστά. Όποια σελίδα δήλωνε μόνο τίτλο και περιγραφή
 * έχανε σιωπηλά τα `og:site_name` και `og:locale`.
 */
export function openGraphFor(
  locale: Locale,
  {
    title,
    description,
    path = "",
    type = "website",
  }: {
    title: string;
    description: string;
    path?: string;
    type?: "website" | "article";
  },
) {
  return {
    type,
    siteName,
    locale: locale === "el" ? "el_GR" : "en_US",
    alternateLocale: locale === "el" ? "en_US" : "el_GR",
    url: `${siteUrl}/${locale}${path}`,
    title,
    description,
  };
}
