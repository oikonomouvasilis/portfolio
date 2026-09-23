"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Τι παρακολουθείται: ό,τι φέρει `data-reveal`, οι γραμμές των ενοτήτων, και τα
 * **παιδιά** κάθε `data-reveal-children`. Το τελευταίο γλιτώνει ένα attribute σε
 * κάθε `<li>`: μπαίνει μία φορά στη λίστα και ισχύει για όλες τις εγγραφές της.
 */
const SELECTOR = "[data-reveal], [data-rule], [data-reveal-children] > *";

/** Απόσταση μεταξύ δύο διαδοχικών εμφανίσεων της ίδιας ριπής. */
const STEP_MS = 80;

/**
 * Πάνω από τόσα βήματα η σκυταλοδρομία σταματά να μεγαλώνει.
 *
 * Χωρίς όριο, ένα πλέγμα με δεκαπέντε στοιχεία που μπαίνουν μαζί στο κάδρο θα
 * τελείωνε ενάμισι δευτερόλεπτο μετά — και το τελευταίο θα εμφανιζόταν αφού ο
 * επισκέπτης έχει ήδη προσπεράσει.
 */
const MAX_STEPS = 5;

/**
 * Αποκαλύπτει ό,τι μπαίνει στο κάδρο και το **αποσύρει** μόλις βγει.
 *
 * Μπαίνει μία φορά στο layout· τα ίδια τα στοιχεία μένουν server components και
 * απλώς κουβαλούν το attribute.
 *
 * `IntersectionObserver` και όχι `animation-timeline: view()`: τα CSS
 * scroll-driven animations δεν είναι Baseline — ο Firefox stable τα κρατά πίσω
 * από flag — και η αποκάλυψη περιεχομένου δεν είναι κάτι που επιτρέπεται να
 * λείπει σε έναν στους πέντε επισκέπτες.
 *
 * Η κίνηση είναι **αμφίδρομη** (ζητήθηκε ρητά): ό,τι φεύγει από την οθόνη
 * αποσύρεται προς τη μεριά από την οποία έφυγε, και ξαναεμφανίζεται όταν
 * γυρίσεις. Το κόστος είναι ότι η δεύτερη ανάγνωση της ίδιας σελίδας κινείται
 * ξανά· γι' αυτό η απόσταση είναι μικρή και η καμπύλη γρήγορη στο τέλος.
 */
export function Reveal() {
  const pathname = usePathname();

  useEffect(() => {
    const show = (el: Element) => el.setAttribute("data-shown", "");

    // Η προτίμηση διαβάζεται εδώ και όχι μόνο στο CSS, ώστε να μη στηθεί καν
    // observer όταν κανείς δεν τον χρειάζεται.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll(SELECTOR).forEach(show);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        /*
         * Όσα μπαίνουν στο κάδρο **μαζί** εμφανίζονται το ένα μετά το άλλο, από
         * πάνω προς τα κάτω. Η ταξινόμηση είναι απαραίτητη: ο observer παραδίδει
         * τις εγγραφές με τη σειρά που τις παρατήρησε, όχι με τη σειρά της
         * σελίδας, και σε πλέγμα δύο στηλών η σκυταλοδρομία έβγαινε ανάκατη.
         */
        const arriving = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        arriving.forEach((entry, index) => {
          const el = entry.target as HTMLElement;
          el.style.setProperty(
            "--reveal-delay",
            `${Math.min(index, MAX_STEPS) * STEP_MS}ms`,
          );
          show(el);
        });

        for (const entry of entries) {
          if (entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;

          /*
           * Προς τα πού αποσύρεται: αν βγήκε από πάνω, φεύγει προς τα πάνω. Αν
           * επέστρεφε πάντα προς τα κάτω, το περιεχόμενο που μόλις προσπέρασες
           * θα κινούνταν αντίθετα από το scroll σου.
           */
          el.setAttribute(
            "data-from",
            entry.boundingClientRect.top < 0 ? "above" : "below",
          );
          el.removeAttribute("data-shown");
        }
      },
      /*
       * Το αρνητικό περιθώριο καθυστερεί την αποκάλυψη μέχρι το στοιχείο να έχει
       * μπει ουσιαστικά στο κάδρο, αντί να ενεργοποιείται από ένα pixel στην άκρη
       * της οθόνης. Κατώφλι 0 και όχι 0.15: ένα στοιχείο ψηλότερο από την οθόνη —
       * ένα μεγάλο case study, μια ενότητα βιογραφικού — δεν φτάνει ποτέ να
       * δείχνει το 15% του εαυτού του, και δεν θα εμφανιζόταν ποτέ.
       */
      { rootMargin: "-4% 0px -10% 0px", threshold: 0 },
    );

    const observe = (el: Element) => observer.observe(el);
    document.querySelectorAll(SELECTOR).forEach(observe);

    /*
     * Ό,τι προστίθεται μετά — οι κάρτες που ξαναχτίζονται σε κάθε αλλαγή φίλτρου
     * στη λίστα project — δεν το ξέρει ο observer. Χωρίς αυτό, το φιλτράρισμα θα
     * άφηνε τις νέες κάρτες **μόνιμα αόρατες**: το CSS τις κρύβει από την αρχή
     * και κανείς δεν θα τους έδινε ποτέ το `data-shown`.
     */
    const mutations = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (!(node instanceof HTMLElement)) continue;
          if (node.matches(SELECTOR)) observe(node);
          node.querySelectorAll(SELECTOR).forEach(observe);
        }
      }
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, [pathname]);

  return null;
}
