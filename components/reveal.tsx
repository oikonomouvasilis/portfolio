"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const SELECTOR = "[data-reveal]:not([data-shown]), [data-rule]:not([data-shown])";

/**
 * Παρακολουθεί ό,τι φέρει `data-reveal` ή `data-rule` και το αποκαλύπτει μόλις
 * μπει στο κάδρο. Μπαίνει **μία φορά** στο layout· τα ίδια τα στοιχεία μένουν
 * server components και απλώς κουβαλούν το attribute.
 *
 * `IntersectionObserver` και όχι `animation-timeline: view()`: τα CSS
 * scroll-driven animations δεν είναι Baseline — ο Firefox stable τα κρατά πίσω
 * από flag — και η αποκάλυψη περιεχομένου δεν είναι κάτι που επιτρέπεται να
 * λείπει σε έναν στους πέντε επισκέπτες.
 *
 * Η αποκάλυψη γίνεται **μία φορά**: μόλις φανεί κάτι, παύει να παρακολουθείται.
 * Περιεχόμενο που σβήνει όταν το προσπερνάς και ξαναεμφανίζεται όταν γυρίζεις
 * πίσω κουράζει στη δεύτερη ανάγνωση.
 */
export function Reveal() {
  const pathname = usePathname();

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll(SELECTOR));
    if (elements.length === 0) return;

    const show = (el: Element) => el.setAttribute("data-shown", "");

    // Η προτίμηση διαβάζεται εδώ και όχι μόνο στο CSS, ώστε να μη στηθεί καν
    // observer όταν κανείς δεν τον χρειάζεται.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elements.forEach(show);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          show(entry.target);
          observer.unobserve(entry.target);
        }
      },
      /*
       * Το αρνητικό κάτω περιθώριο καθυστερεί την αποκάλυψη μέχρι το στοιχείο
       * να έχει μπει ουσιαστικά στο κάδρο, αντί να ενεργοποιείται από ένα
       * pixel στην άκρη της οθόνης.
       */
      { rootMargin: "0px 0px -12% 0px", threshold: 0.15 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
