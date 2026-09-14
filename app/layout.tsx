import type { ReactNode } from "react";

/**
 * Pass-through root layout. Τα <html> και <body> ζουν στο `app/[locale]/layout.tsx`
 * ώστε η ετικέτα `lang` να αντιστοιχεί στη γλώσσα της σελίδας (D4) — κάτι αδύνατο
 * αν το <html> γραφόταν εδώ, όπου το locale δεν είναι ακόμη γνωστό.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
