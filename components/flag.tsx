import type { Locale } from "@/lib/i18n";

/**
 * Σημαία ανά γλώσσα, σε πλέγμα 24×16.
 *
 * Η σημαία **δεν** αντικαθιστά το όνομα της γλώσσας, το συνοδεύει: γλώσσα και
 * χώρα δεν είναι το ίδιο πράγμα, και ένας επισκέπτης από την Ιρλανδία ή την
 * Κύπρο δεν πρέπει να ψάχνει ποια σημαία εννοεί «τα αγγλικά».
 *
 * Σχεδιασμένες με ορθογώνια και όχι με έτοιμο πακέτο εικονιδίων: δύο σημαίες δεν
 * δικαιολογούν εξάρτηση, και η Union Jack εδώ είναι απλοποιημένη (χωρίς την
 * αντιμετάθεση των διαγωνίων) — στα 20px δεν διακρίνεται η διαφορά.
 */
const GREEK_BLUE = "#0D5EAF";
const UK_BLUE = "#012169";
const UK_RED = "#C8102E";

/** Το ύψος μιας λωρίδας της ελληνικής σημαίας: 16 / 9 λωρίδες. */
const STRIPE = 16 / 9;

export function Flag({
  locale,
  className = "h-3.5 w-[21px]",
}: {
  locale: Locale;
  className?: string;
}) {
  const clipId = `flag-clip-${locale}`;

  return (
    <svg
      viewBox="0 0 24 16"
      aria-hidden="true"
      focusable="false"
      className={`shrink-0 ${className}`}
    >
      <defs>
        <clipPath id={clipId}>
          <rect width="24" height="16" rx="2.5" />
        </clipPath>
      </defs>

      <g clipPath={`url(#${clipId})`}>
        {locale === "el" ? <Greece /> : <UnitedKingdom />}
      </g>

      {/* Οι λευκές λωρίδες χάνονται πάνω στο χαρτί χωρίς περίγραμμα. */}
      <rect
        width="24"
        height="16"
        rx="2.5"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.25"
      />
    </svg>
  );
}

function Greece() {
  return (
    <>
      <rect width="24" height="16" fill={GREEK_BLUE} />
      {[1, 3, 5, 7].map((row) => (
        <rect
          key={row}
          y={row * STRIPE}
          width="24"
          height={STRIPE}
          fill="#fff"
        />
      ))}

      {/* Το καντόνι είναι 5×5 λωρίδες, ο σταυρός μία λωρίδα πλάτος. */}
      <rect width={STRIPE * 5} height={STRIPE * 5} fill={GREEK_BLUE} />
      <rect x={STRIPE * 2} width={STRIPE} height={STRIPE * 5} fill="#fff" />
      <rect y={STRIPE * 2} width={STRIPE * 5} height={STRIPE} fill="#fff" />
    </>
  );
}

function UnitedKingdom() {
  return (
    <>
      <rect width="24" height="16" fill={UK_BLUE} />

      <path
        d="M0 0 24 16 M24 0 0 16"
        stroke="#fff"
        strokeWidth="3.4"
        fill="none"
      />
      <path
        d="M0 0 24 16 M24 0 0 16"
        stroke={UK_RED}
        strokeWidth="1.8"
        fill="none"
      />

      <path d="M12 0v16 M0 8h24" stroke="#fff" strokeWidth="5.4" fill="none" />
      <path d="M12 0v16 M0 8h24" stroke={UK_RED} strokeWidth="3.2" fill="none" />
    </>
  );
}
