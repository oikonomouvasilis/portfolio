import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

/**
 * Τα preview deployment του Vercel δεν πρέπει να ευρετηριάζονται: αλλιώς η ίδια
 * σελίδα υπάρχει σε δεκάδες διευθύνσεις και το production ανταγωνίζεται τον
 * εαυτό του στα αποτελέσματα.
 */
export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.VERCEL_ENV === "production";

  return {
    rules: isProduction
      ? { userAgent: "*", allow: "/" }
      : { userAgent: "*", disallow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
