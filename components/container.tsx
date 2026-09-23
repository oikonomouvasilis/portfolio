import type { ReactNode } from "react";

/**
 * Το αναγνώσιμο πλάτος της σελίδας.
 *
 * Ζει εδώ και όχι στο `main`, ώστε μια ενότητα να μπορεί να απλώσει το **φόντο**
 * της σε όλο το πλάτος του παραθύρου κρατώντας το **κείμενο** μέσα στη στήλη.
 * Όσο ο περιορισμός ήταν στο `main`, κάθε τέτοια ζώνη χρειαζόταν κόλπα με
 * αρνητικά περιθώρια σε `vw` — που μετρούν και τη μπάρα κύλισης, και γεννούν
 * οριζόντιο scroll σε Windows.
 */
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-5xl px-6 ${className}`}>
      {children}
    </div>
  );
}
