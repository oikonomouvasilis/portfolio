import { brandIcons } from "@/lib/tech-icons.brand";

/**
 * GitHub και LinkedIn στην κεφαλίδα.
 *
 * Το σήμα του GitHub έρχεται από τη Simple Icons· το LinkedIn **δεν** υπάρχει
 * εκεί (αφαιρέθηκε για λόγους εμπορικού σήματος), οπότε σχεδιάζεται εδώ ως
 * γραμμικό «in» — αναγνωρίσιμο χωρίς να αντιγράφει το επίσημο λογότυπο.
 */
const LINKEDIN_GLYPH =
  "M4.5 3.5h15a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1v-15a1 1 0 0 1 1-1Z M7.8 10.8v6 M7.8 7.6v.01 M11.7 16.8v-6 M11.7 13.4c0-1.5 1.2-2.7 2.7-2.7s2.7 1.2 2.7 2.7v3.4";

type Social = {
  label: string;
  href: string;
  kind: "brand" | "glyph";
  d: string;
};

const SOCIALS: Social[] = [
  {
    label: "GitHub",
    href: "https://github.com/oikonomouvasilis",
    kind: "brand",
    d: brandIcons.github,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/vasileios-oikonomoy/",
    kind: "glyph",
    d: LINKEDIN_GLYPH,
  },
];

export function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {SOCIALS.map((social) => (
        <a
          key={social.label}
          href={social.href}
          rel="me noreferrer"
          /*
           * Το όνομα υπάρχει μόνο για τον αναγνώστη οθόνης και για το tooltip:
           * στην κεφαλίδα δεν χωρά κείμενο, αλλά ένας σύνδεσμος χωρίς
           * προσβάσιμο όνομα είναι σύνδεσμος που δεν μπορεί να ακολουθηθεί.
           */
          aria-label={social.label}
          title={social.label}
          className="grid size-8 place-items-center rounded-full text-[var(--muted)] transition-colors hover:bg-[var(--panel)] hover:text-[var(--fg)]"
        >
          {social.kind === "brand" ? (
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
              className="size-[18px]"
              fill="currentColor"
            >
              <path d={social.d} />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
              className="size-[18px]"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.7}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d={social.d} />
            </svg>
          )}
        </a>
      ))}
    </div>
  );
}
