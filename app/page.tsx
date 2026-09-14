import { redirect } from "next/navigation";
import { defaultLocale } from "@/lib/i18n";

/**
 * Το `/` δεν έχει δικό του περιεχόμενο — στέλνει στην προεπιλεγμένη γλώσσα (D4).
 * Όταν προστεθεί ανίχνευση `Accept-Language`, η απόφαση μετακομίζει εδώ.
 */
export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
