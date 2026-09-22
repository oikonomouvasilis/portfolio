import Link from "next/link";

/**
 * Το κοινό σώμα των δύο σελίδων 404. Χωρίς server-only εξαρτήσεις, γιατί το
 * `app/[locale]/not-found.tsx` είναι client component — το `not-found` δεν
 * δέχεται props, οπότε η γλώσσα βγαίνει από το pathname.
 */
export function NotFoundNotice({
  code,
  title,
  body,
  homeLabel,
  homeHref,
}: {
  code: string;
  title: string;
  body: string;
  homeLabel: string;
  homeHref: string;
}) {
  return (
    <div className="max-w-2xl space-y-6">
      <p className="font-mono text-xs tracking-widest text-[var(--faint)] uppercase">
        {code}
      </p>
      <h1 className="text-5xl sm:text-6xl">{title}</h1>
      <p className="text-lg leading-relaxed text-[var(--muted)]">{body}</p>
      <Link
        href={homeHref}
        className="inline-block underline underline-offset-4 decoration-[var(--line)] hover:decoration-[var(--fg)]"
      >
        {homeLabel} →
      </Link>
    </div>
  );
}
